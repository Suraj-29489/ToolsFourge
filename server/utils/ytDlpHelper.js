import { execFile, spawn } from 'child_process';

/**
 * Check whether python -m yt_dlp is installed and executable
 */
export function checkYtDlpAvailable() {
  return new Promise((resolve, reject) => {
    execFile('python', ['-m', 'yt_dlp', '--version'], (error, stdout) => {
      if (error) {
        console.error('yt-dlp check failed:', error.message);
        return reject(new Error('yt-dlp is not installed on the server.'));
      }
      resolve(stdout.trim());
    });
  });
}

/**
 * Format duration in seconds to HH:MM:SS or MM:SS
 */
export function formatDuration(seconds, isLive = false) {
  if (isLive) return 'LIVE Stream';
  if (!seconds || isNaN(seconds) || seconds <= 0) return 'Unknown duration';

  const sec = Math.floor(seconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Format bytes into human readable string (KB, MB, GB)
 */
export function formatBytes(bytes) {
  if (!bytes || isNaN(bytes) || bytes <= 0) return null;
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Identify platform name from URL or extractor
 */
export function detectPlatform(url = '', extractor = '') {
  const lowerUrl = url.toLowerCase();
  const lowerExt = extractor.toLowerCase();

  if (lowerUrl.includes('youtube.com/shorts') || lowerUrl.includes('youtu.be/shorts')) {
    return 'YouTube Shorts';
  }
  if (lowerUrl.includes('youtube.com/live')) {
    return 'YouTube Live';
  }
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerExt.includes('youtube')) {
    return 'YouTube';
  }
  if (lowerUrl.includes('instagram.com') || lowerExt.includes('instagram')) {
    return 'Instagram';
  }
  if (lowerUrl.includes('tiktok.com') || lowerExt.includes('tiktok')) {
    return 'TikTok';
  }
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch') || lowerExt.includes('facebook')) {
    return 'Facebook';
  }
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com') || lowerExt.includes('twitter')) {
    return 'X (Twitter)';
  }
  return 'Web Video';
}

/**
 * Extract metadata as structured object using yt-dlp
 */
export async function extractVideoMetadata(videoUrl) {
  // 1. Verify yt-dlp installation first
  try {
    await checkYtDlpAvailable();
  } catch (err) {
    throw new Error('yt-dlp is not installed on the server.');
  }

  // 2. Validate URL format syntax
  try {
    const parsedUrl = new URL(videoUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error();
    }
  } catch {
    throw new Error('Invalid URL format. Please enter a valid HTTP or HTTPS video link.');
  }

  // 3. Execute yt-dlp --dump-json
  return new Promise((resolve, reject) => {
    const args = ['-m', 'yt_dlp', '-j', '--no-warnings', '--no-playlist', videoUrl];

    execFile('python', args, { maxBuffer: 20 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (stderr) {
        console.error('[yt-dlp stderr]:', stderr);
      }

      if (error) {
        console.error('[yt-dlp exec error]:', error.message);
        let errorMsg = 'Failed to analyze video URL. Please verify the link.';

        const stderrText = (stderr || '').toLowerCase();
        if (stderrText.includes('unsupported url') || stderrText.includes('is not a valid url')) {
          errorMsg = 'Unsupported website or invalid video link.';
        } else if (stderrText.includes('private video') || stderrText.includes('sign in')) {
          errorMsg = 'This video is private or login-restricted.';
        } else if (stderrText.includes('video unavailable') || stderrText.includes('deleted')) {
          errorMsg = 'The requested video is unavailable or has been deleted.';
        } else if (stderrText.includes('live event')) {
          errorMsg = 'This live stream has not started yet.';
        }

        return reject(new Error(errorMsg));
      }

      try {
        const metadata = JSON.parse(stdout);
        const platform = detectPlatform(videoUrl, metadata.extractor || '');
        const isLive = Boolean(metadata.is_live || metadata.was_live && !metadata.duration);

        // Extract formats list
        const formatsList = [];
        const rawFormats = metadata.formats || [];
        const maxResolution = metadata.height || (rawFormats.reduce((max, f) => Math.max(max, f.height || 0), 0)) || 1080;

        const presets = [
          { label: '1080p Full HD', height: 1080, formatId: 'bestvideo[height<=1080]+bestaudio/best[height<=1080]', ext: 'mp4', type: 'video' },
          { label: '720p HD', height: 720, formatId: 'bestvideo[height<=720]+bestaudio/best[height<=720]', ext: 'mp4', type: 'video' },
          { label: '480p SD', height: 480, formatId: 'bestvideo[height<=480]+bestaudio/best[height<=480]', ext: 'mp4', type: 'video' },
          { label: '360p Low', height: 360, formatId: 'bestvideo[height<=360]+bestaudio/best[height<=360]', ext: 'mp4', type: 'video' },
        ];

        presets.forEach((preset) => {
          if (maxResolution >= preset.height - 60) {
            const matchingRaw = rawFormats.find((f) => f.height === preset.height && (f.filesize || f.filesize_approx));
            const estimatedSize = matchingRaw ? formatBytes(matchingRaw.filesize || matchingRaw.filesize_approx) : null;

            formatsList.push({
              formatId: preset.formatId,
              quality: preset.label,
              ext: preset.ext,
              type: preset.type,
              filesize: estimatedSize || 'Variable size',
            });
          }
        });

        // Ensure at least "Best Quality" fallback
        if (formatsList.length === 0) {
          formatsList.push({
            formatId: 'best',
            quality: 'Best Quality',
            ext: metadata.ext || 'mp4',
            type: 'video',
            filesize: formatBytes(metadata.filesize || metadata.filesize_approx) || 'Direct stream',
          });
        }

        // Add Audio MP3 preset
        const audioRaw = rawFormats.find((f) => f.vcodec === 'none' && (f.filesize || f.filesize_approx));
        formatsList.push({
          formatId: 'bestaudio/best',
          quality: 'Audio Only (MP3)',
          ext: 'mp3',
          type: 'audio',
          filesize: audioRaw ? formatBytes(audioRaw.filesize || audioRaw.filesize_approx) : 'Audio stream',
        });

        resolve({
          id: metadata.id || 'video',
          title: metadata.title || 'Untitled Video',
          thumbnail: metadata.thumbnail || metadata.thumbnails?.[0]?.url || '',
          durationSeconds: metadata.duration || 0,
          durationFormatted: formatDuration(metadata.duration, isLive),
          uploader: metadata.uploader || metadata.channel || metadata.uploader_id || 'Unknown creator',
          platform,
          isLive,
          webpageUrl: metadata.webpage_url || videoUrl,
          formats: formatsList,
        });
      } catch (parseErr) {
        console.error('[yt-dlp JSON parse error]:', parseErr);
        reject(new Error('Failed to parse video metadata output from server.'));
      }
    });
  });
}

/**
 * Stream video/audio download using yt-dlp directly to response
 */
export function streamVideoDownload(videoUrl, formatId, res, customTitle = 'video') {
  const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9_\-\.\s]/g, '_').substring(0, 100);
  const cleanTitle = sanitizeFilename(customTitle);
  const isAudio = (formatId || '').includes('audio');
  const ext = isAudio ? 'mp3' : 'mp4';
  const filename = `${cleanTitle}.${ext}`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

  const args = [
    '-m', 'yt_dlp',
    '-f', formatId || 'best',
    '-o', '-',
    '--no-playlist',
    '--no-warnings',
  ];

  if (isAudio) {
    args.push('-x', '--audio-format', 'mp3');
  }

  args.push(videoUrl);

  const dlProcess = spawn('python', args);

  dlProcess.stdout.pipe(res);

  dlProcess.stderr.on('data', (data) => {
    console.log(`[yt-dlp stream log]: ${data.toString().trim()}`);
  });

  dlProcess.on('error', (err) => {
    console.error('[yt-dlp spawn error]:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Failed to start download stream.' });
    }
  });

  res.on('close', () => {
    dlProcess.kill();
  });
}
