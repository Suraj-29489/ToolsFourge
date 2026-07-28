import { useCallback } from 'react';

/**
 * Custom hook to safely trigger browser file downloads and revoke Object URLs
 */
export function useDownload() {
  const downloadBlob = useCallback((blob, filename) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke memory after download
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }, []);

  const downloadText = useCallback((text, filename, mimeType = 'text/plain') => {
    const blob = new Blob([text], { type: mimeType });
    downloadBlob(blob, filename);
  }, [downloadBlob]);

  const downloadDataUrl = useCallback((dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    downloadBlob,
    downloadText,
    downloadDataUrl,
  };
}
