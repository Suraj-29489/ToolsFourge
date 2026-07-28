import { execFile, spawn } from 'child_process';
import path from 'path';

/**
 * Format duration in seconds to HH:MM:SS or MM:SS
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return 'Unknown duration';
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
  if (!bytes || isNaN(bytes)) return null;
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Identify platform name from URL or extractor
 */
export function detectPlatform(url, extractor = '') {
  const lowerUrl = (url || '').toLowerCase();
  const lowerExt = (extractor || '').toLowerCase();

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
 * Run yt-dlp to extract metadata as JSON without downloading
 */
export function extractVideoMetadata(videoUrl) {
  return new Promise((resolve, reject) => {
    // Validate URL syntax
    try {
      new URL(videoUrl);
    } catch {
      return reject(new Error('Invalid URL format. Please enter a valid HTTP or HTTPS video URL.'));
    }

    const args = ['-m', 'yt_dlp', '-j', '--no-warnings', '--no-playlist', videoUrl];

    execFile('python', args, { maxBuffer: 15 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error('yt-dlp error:', stderr || error.message);
        let errorMsg = 'Failed to process video. Please check the URL and try again.';
        if (stderr.includes('Unsupported URL') || stderr.includes('is not a valid URL')) {
          errorMsg = 'Unsupported platform or invalid video URL.';
        } else if (stderr.includes('Private video') || stderr.includes('Sign in')) {
          errorMsg = 'This video is private or restricted.';
        } else if (stderr.includes('Video unavailable')) {
          errorMsg = 'The requested video is unavailable or deleted.';
        }
        return reject(new Error(errorMsg));
      }

      try {
        const metadata = JSON.parse(stdout);
        const platform = detectPlatform(videoUrl, metadata.extractor);

        // Process formats into clean user options
        const formatsList = [];
        const rawFormats = metadata.formats || [];

        // Check highest resolution available
        const maxResolution = metadata.height || 1080;

        // Define quality presets
        const presets = [
          { label: '1080p Full HD', height: 1080, formatId: 'bestvideo[height<=1080]+bestaudio/best[height<=1080]', ext: 'mp4', type: 'video' },
          { label: '720p HD', height: 720, formatId: 'bestvideo[height<=720]+bestaudio/best[height<=720]', ext: 'mp4', type: 'video' },
          { label: '480p SD', height: 480, formatId: 'bestvideo[height<=480]+bestaudio/best[height<=480]', ext: 'mp4', type: 'video' },
          { label: '360p Low', height: 360, formatId: 'bestvideo[height<=360]+bestaudio/best[height<=360]', ext: 'mp4', type: 'video' },
        ];

        // Filter video presets based on max available height
        presets.forEach((preset) => {
          if (maxResolution >= preset.height - 60) {
            // Find estimated size if possible
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

        // Always ensure at least "Best Available" format
        if (formatsList.length === 0) {
          formatsList.push({
            formatId: 'best',
            quality: 'Best Quality',
            ext: metadata.ext || 'mp4',
            type: 'video',
            filesize: formatBytes(metadata.filesize || metadata.filesize_approx) || 'Best resolution',
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
          id: metadata.id,
          title: metadata.title || 'Untitled Video',
          thumbnail: metadata.thumbnail || metadata.thumbnails?.[0]?.url || '',
          durationSeconds: metadata.duration || 0,
          durationFormatted: formatDuration(metadata.duration),
          uploader: metadata.uploader || metadata.channel || metadata.uploader_id || 'Unknown creator',
          platform,
          webpageUrl: metadata.webpage_url || videoUrl,
          formats: formatsList,
        });
      } catch (parseErr) {
        console.error('JSON parse error:', parseErr);
        reject(new Error('Failed to parse video metadata output.'));
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
  const isAudio = formatId.includes('audio');
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
    // Log download progress or stderr warnings
    console.log(`yt-dlp stream: ${data.toString().trim()}`);
  });

  dlProcess.on('error', (err) => {
    console.error('Download spawn error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Failed to start download stream.' });
    }
  });

  res.on('close', () => {
    dlProcess.kill();
  });
}
