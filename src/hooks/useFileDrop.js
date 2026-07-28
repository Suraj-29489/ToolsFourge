import { useState, useCallback } from 'react';

/**
 * Custom hook for handling drag & drop and file input selection
 */
export function useFileDrop(options = {}) {
  const { accept = '', multiple = true, maxFiles = 20 } = options;
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleFiles = useCallback((incomingFiles) => {
    setError(null);
    const fileList = Array.from(incomingFiles);

    if (!multiple && fileList.length > 1) {
      setFiles([fileList[0]]);
      return;
    }

    if (maxFiles && fileList.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed at once.`);
      setFiles(fileList.slice(0, maxFiles));
      return;
    }

    setFiles((prev) => (multiple ? [...prev, ...fileList] : [fileList[0]]));
  }, [multiple, maxFiles]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const onFileSelect = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  return {
    files,
    setFiles,
    isDragging,
    error,
    setError,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileSelect,
    removeFile,
    clearFiles,
  };
}
