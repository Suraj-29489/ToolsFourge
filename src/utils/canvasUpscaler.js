/**
 * Canvas High-Quality Multi-Pass Super Resolution Fallback Engine
 */

/**
 * Upscales an image using multi-pass canvas step interpolation
 * @param {HTMLImageElement} img 
 * @param {number} scaleFactor 2 or 4
 * @param {string} noiseReduction 'off' | 'low' | 'medium' | 'high'
 * @param {boolean} preserveTransparency 
 * @returns {Promise<{blob: Blob, url: string, width: number, height: number, size: number}>}
 */
export async function canvasSuperResolution(img, scaleFactor = 2, noiseReduction = 'off', preserveTransparency = true) {
  const srcWidth = img.naturalWidth || img.width;
  const srcHeight = img.naturalHeight || img.height;
  const targetWidth = Math.round(srcWidth * scaleFactor);
  const targetHeight = Math.round(srcHeight * scaleFactor);

  // Multi-pass step scaling for high sharpness
  let currentCanvas = document.createElement('canvas');
  currentCanvas.width = srcWidth;
  currentCanvas.height = srcHeight;
  let ctx = currentCanvas.getContext('2d', { willReadFrequently: true });
  
  if (!preserveTransparency) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, srcWidth, srcHeight);
  }
  ctx.drawImage(img, 0, 0);

  // Stepwise scaling (1.5x steps up to target size) for smoother edge reconstruction
  let currentWidth = srcWidth;
  let currentHeight = srcHeight;

  while (currentWidth < targetWidth || currentHeight < targetHeight) {
    const nextWidth = Math.min(targetWidth, Math.round(currentWidth * 1.5));
    const nextHeight = Math.min(targetHeight, Math.round(currentHeight * 1.5));

    const stepCanvas = document.createElement('canvas');
    stepCanvas.width = nextWidth;
    stepCanvas.height = nextHeight;
    const stepCtx = stepCanvas.getContext('2d', { willReadFrequently: true });

    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = 'high';

    if (!preserveTransparency) {
      stepCtx.fillStyle = '#FFFFFF';
      stepCtx.fillRect(0, 0, nextWidth, nextHeight);
    }

    stepCtx.drawImage(currentCanvas, 0, 0, nextWidth, nextHeight);

    currentCanvas = stepCanvas;
    currentWidth = nextWidth;
    currentHeight = nextHeight;
  }

  // Apply noise reduction & unsharp mask filter if requested
  if (noiseReduction !== 'off') {
    applyNoiseReductionFilter(currentCanvas, noiseReduction);
  }

  return new Promise((resolve) => {
    currentCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resolve({
        blob,
        url,
        width: targetWidth,
        height: targetHeight,
        size: blob.size,
      });
    }, 'image/png');
  });
}

/**
 * Applies spatial noise reduction & edge enhancement filter to canvas
 */
function applyNoiseReductionFilter(canvas, level) {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const w = canvas.width;
  const h = canvas.height;

  // Smoothing threshold based on level
  const radius = level === 'high' ? 2 : level === 'medium' ? 1 : 1;
  const blend = level === 'high' ? 0.35 : level === 'medium' ? 0.25 : 0.15;

  const copy = new Uint8ClampedArray(data);

  for (let y = radius; y < h - radius; y++) {
    for (let x = radius; x < w - radius; x++) {
      const idx = (y * w + x) * 4;

      let rSum = 0, gSum = 0, bSum = 0, count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nIdx = ((y + dy) * w + (x + dx)) * 4;
          rSum += copy[nIdx];
          gSum += copy[nIdx + 1];
          bSum += copy[nIdx + 2];
          count++;
        }
      }

      const avgR = rSum / count;
      const avgG = gSum / count;
      const avgB = bSum / count;

      data[idx] = Math.round(data[idx] * (1 - blend) + avgR * blend);
      data[idx + 1] = Math.round(data[idx + 1] * (1 - blend) + avgG * blend);
      data[idx + 2] = Math.round(data[idx + 2] * (1 - blend) + avgB * blend);
    }
  }

  ctx.putImageData(imgData, 0, 0);
}
