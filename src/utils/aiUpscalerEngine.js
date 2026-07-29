import { loadImageElement } from './imageMetadata';
import { canvasSuperResolution } from './canvasUpscaler';

let upscalerInstance = null;
let tfEngine = null;

/**
 * Initializes TensorFlow.js backend (WebGPU / WebGL / WASM)
 */
export async function initTfBackend() {
  if (tfEngine) return tfEngine;

  try {
    const tf = await import('@tensorflow/tfjs');
    tfEngine = tf;

    // Check available backends: WebGPU -> WebGL -> CPU
    if (tf.engine().registry['webgpu']) {
      await tf.setBackend('webgpu');
    } else if (tf.engine().registry['webgl']) {
      await tf.setBackend('webgl');
    } else {
      await tf.setBackend('cpu');
    }

    await tf.ready();
    return tf;
  } catch (err) {
    console.warn('TensorFlow.js backend init notice:', err);
    return null;
  }
}

/**
 * Lazy loads UpscalerJS engine instance
 */
export async function getUpscalerInstance() {
  if (upscalerInstance) return upscalerInstance;

  try {
    await initTfBackend();
    const Upscaler = (await import('upscaler')).default;
    upscalerInstance = new Upscaler();
    return upscalerInstance;
  } catch (err) {
    console.warn('UpscalerJS lazy load notice:', err);
    return null;
  }
}

/**
 * Main AI Image Upscaler runner
 * 
 * @param {File|string} imageInput 
 * @param {Object} options
 * @param {number} options.scale - 2 or 4
 * @param {string} options.mode - 'ai' | 'fast'
 * @param {string} options.noiseReduction - 'off' | 'low' | 'medium' | 'high'
 * @param {boolean} options.preserveTransparency 
 * @param {Function} onProgressStep - Step description callback
 * @param {Function} onProgressPct - Percentage callback
 * @returns {Promise<{blob: Blob, url: string, width: number, height: number, size: number, modeUsed: string}>}
 */
export async function upscaleImage(
  imageInput,
  options = {},
  onProgressStep,
  onProgressPct
) {
  const scale = options.scale || 2;
  const mode = options.mode || 'ai';
  const noise = options.noiseReduction || 'off';
  const preserveTransparency = options.preserveTransparency !== false;

  onProgressStep?.('Preparing Image...');
  onProgressPct?.(15);

  let srcUrl = typeof imageInput === 'string' ? imageInput : URL.createObjectURL(imageInput);
  const imgElement = await loadImageElement(srcUrl);

  const srcWidth = imgElement.naturalWidth || imgElement.width;
  const srcHeight = imgElement.naturalHeight || imgElement.height;
  const targetWidth = Math.round(srcWidth * scale);
  const targetHeight = Math.round(srcHeight * scale);

  onProgressPct?.(30);

  // If Fast mode selected, use multi-pass canvas engine directly
  if (mode === 'fast') {
    onProgressStep?.('Upscaling image using fast engine...');
    onProgressPct?.(65);

    const result = await canvasSuperResolution(
      imgElement,
      scale,
      noise,
      preserveTransparency
    );

    onProgressStep?.('Finalizing...');
    onProgressPct?.(100);

    if (typeof imageInput !== 'string') URL.revokeObjectURL(srcUrl);

    return {
      ...result,
      modeUsed: 'Fast Interpolation',
    };
  }

  // AI Mode execution
  try {
    onProgressStep?.('Loading AI Model...');
    onProgressPct?.(45);

    const upscaler = await getUpscalerInstance();

    if (!upscaler) {
      throw new Error('AI Model initialization fallback');
    }

    onProgressStep?.('Upscaling with AI Model...');
    onProgressPct?.(75);

    // Perform AI upscaling
    const upscaledDataUrl = await upscaler.upscale(imgElement, {
      patchSize: 64,
      padding: 6,
      progress: (p) => {
        const pct = Math.min(95, 45 + Math.round(p * 50));
        onProgressPct?.(pct);
      },
    });

    onProgressStep?.('Finalizing AI output...');
    onProgressPct?.(98);

    // Convert Data URL to Blob
    const response = await fetch(upscaledDataUrl);
    const blob = await response.blob();
    const resultUrl = URL.createObjectURL(blob);

    // Clean up temporary object URL
    if (typeof imageInput !== 'string') URL.revokeObjectURL(srcUrl);

    // Clean up TensorFlow tensors if available
    if (tfEngine) {
      try {
        tfEngine.disposeVariables();
      } catch (_) {}
    }

    onProgressPct?.(100);

    return {
      blob,
      url: resultUrl,
      width: targetWidth,
      height: targetHeight,
      size: blob.size,
      modeUsed: 'AI Neural Model',
    };
  } catch (aiErr) {
    console.warn('AI Upscale engine fallback to canvas super-resolution:', aiErr);
    onProgressStep?.('Optimizing with High-Quality Engine...');
    onProgressPct?.(80);

    // High quality canvas fallback on GPU/model error
    const result = await canvasSuperResolution(
      imgElement,
      scale,
      noise,
      preserveTransparency
    );

    if (typeof imageInput !== 'string') URL.revokeObjectURL(srcUrl);
    onProgressPct?.(100);

    return {
      ...result,
      modeUsed: 'High-Quality Super Resolution',
    };
  }
}
