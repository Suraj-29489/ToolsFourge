import { useState, useCallback } from 'react';

/**
 * Custom hook for managing client-side processing states and progress percentages
 */
export function useProcessing() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  const startProcessing = useCallback((message = 'Processing...') => {
    setProcessing(true);
    setProgress(0);
    setStatusMessage(message);
    setError(null);
  }, []);

  const updateProgress = useCallback((percent, message) => {
    setProgress(Math.min(100, Math.max(0, percent)));
    if (message) setStatusMessage(message);
  }, []);

  const finishProcessing = useCallback(() => {
    setProcessing(false);
    setProgress(100);
    setStatusMessage('');
  }, []);

  const failProcessing = useCallback((errMessage) => {
    setProcessing(false);
    setProgress(0);
    setStatusMessage('');
    setError(typeof errMessage === 'string' ? errMessage : errMessage?.message || 'Processing failed.');
  }, []);

  const resetProcessing = useCallback(() => {
    setProcessing(false);
    setProgress(0);
    setStatusMessage('');
    setError(null);
  }, []);

  return {
    processing,
    progress,
    statusMessage,
    error,
    setError,
    startProcessing,
    updateProgress,
    finishProcessing,
    failProcessing,
    resetProcessing,
  };
}
