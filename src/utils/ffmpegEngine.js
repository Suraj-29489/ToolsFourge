import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance = null;

/**
 * Lazy loads FFmpeg.wasm instance from CDN
 */
export async function getFFmpegInstance(onProgress) {
  if (ffmpegInstance) {
    if (onProgress) {
      ffmpegInstance.on('progress', ({ progress: p }) => {
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        onProgress(pct);
      });
    }
    return ffmpegInstance;
  }

  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const ffmpeg = new FFmpeg();

  if (onProgress) {
    ffmpeg.on('progress', ({ progress: p }) => {
      const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
      onProgress(pct);
    });
  }

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

/**
 * Executes FFmpeg command on a video File and returns output Blob
 * 
 * @param {File} inputFile 
 * @param {Array<string>} args - FFmpeg CLI flags (excluding input/output file names)
 * @param {string} outputExt - Output extension (e.g. 'mp4', 'gif', 'mp3', 'webm')
 * @param {string} outputMimeType - MIME type for Blob (e.g. 'video/mp4')
 * @param {Function} onProgressStep - Status callback
 * @param {Function} onProgressPct - Percentage callback
 * @returns {Promise<{blob: Blob, url: string, size: number}>}
 */
export async function processVideoWithFFmpeg(
  inputFile,
  args,
  outputExt = 'mp4',
  outputMimeType = 'video/mp4',
  onProgressStep,
  onProgressPct
) {
  onProgressStep?.('Loading GIF / Video Engine...');
  onProgressPct?.(10);

  const ffmpeg = await getFFmpegInstance(onProgressPct);

  const inputName = `input_${Date.now()}.${inputFile.name.split('.').pop() || 'mp4'}`;
  const outputName = `output_${Date.now()}.${outputExt}`;

  try {
    onProgressStep?.('Preparing video file...');
    onProgressPct?.(25);

    const fileData = await fetchFile(inputFile);
    await ffmpeg.writeFile(inputName, fileData);

    onProgressStep?.('Processing video...');
    onProgressPct?.(40);

    const fullArgs = ['-i', inputName, ...args, '-y', outputName];
    await ffmpeg.exec(fullArgs);

    onProgressStep?.('Finalizing output...');
    onProgressPct?.(95);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data.buffer], { type: outputMimeType });
    const url = URL.createObjectURL(blob);

    // Clean up VFS
    try {
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (_) {}

    onProgressPct?.(100);

    return {
      blob,
      url,
      size: blob.size,
    };
  } catch (err) {
    try {
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (_) {}
    throw err;
  }
}
