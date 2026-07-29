/**
 * Extracts metadata from an image File object
 * @param {File} file 
 * @returns {Promise<{name: string, size: number, type: string, width: number, height: number, aspectRatio: string, objectUrl: string}>}
 */
export function extractImageMetadata(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      const allowedExts = ['png', 'jpg', 'jpeg', 'webp'];
      const ext = file ? file.name.split('.').pop().toLowerCase() : '';
      if (!allowedExts.includes(ext)) {
        return reject(new Error('Unsupported image format. Please upload PNG, JPG, JPEG, or WEBP.'));
      }
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const metadata = {
        name: file.name,
        size: file.size,
        type: file.type || `image/${file.name.split('.').pop()}`,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        aspectRatio: (img.width && img.height) ? (img.width / img.height).toFixed(2) : '1:1',
        objectUrl,
      };
      resolve(metadata);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image. The file may be corrupted.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Helper to convert Blob or Data URL to Image HTML Element
 */
export function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image element'));
    img.src = src;
  });
}
