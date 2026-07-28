import { useState, useCallback } from 'react';

/**
 * Custom hook for copying text to clipboard with temporary feedback state
 */
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const copyToClipboard = useCallback((text) => {
    if (!text) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          setError(null);
          setTimeout(() => setCopied(false), timeout);
        })
        .catch((err) => {
          setError('Failed to copy to clipboard.');
          console.error(err);
        });
    } else {
      // Fallback for non-secure contexts
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setError(null);
        setTimeout(() => setCopied(false), timeout);
      } catch (err) {
        setError('Failed to copy to clipboard.');
        console.error(err);
      }
    }
  }, [timeout]);

  return { copied, error, copyToClipboard };
}
