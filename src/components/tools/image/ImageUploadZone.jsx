import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileImage, HardDrive, Monitor, RefreshCw, Sparkles } from 'lucide-react';
import { formatBytes } from '../../../utils/formatters';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const ACCEPTED_TYPES = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
};

export default function ImageUploadZone({ onFileSelect, selectedFile, metadata, onReset }) {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections && fileRejections.length > 0) {
      alert('File exceeds 25 MB or is an unsupported image format.');
      return;
    }

    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  if (selectedFile && metadata) {
    return (
      <div className="w-full bg-obsidian-card border border-obsidian-border rounded-2xl p-5 sm:p-6 shadow-xl animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-border/60">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shrink-0">
              <FileImage className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md" title={metadata.name}>
                {metadata.name}
              </h3>
              <p className="text-xs text-obsidian-text-muted capitalize">
                {metadata.type.replace('image/', '').toUpperCase()} Image
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-obsidian-text hover:text-white bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border rounded-xl transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Change Image
          </button>
        </div>

        {/* Thumbnail & Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 items-center">
          {/* Image Thumbnail Preview */}
          <div className="relative aspect-video bg-black/40 rounded-xl overflow-hidden border border-obsidian-border/60 flex items-center justify-center p-2">
            <img
              src={metadata.objectUrl}
              alt="Source Preview"
              className="max-h-full max-w-full object-contain rounded"
            />
          </div>

          {/* Details */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <div className="bg-obsidian-secondary p-3.5 rounded-xl border border-obsidian-border/60 flex items-center gap-3">
              <HardDrive className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="block text-[10px] font-medium uppercase text-obsidian-text-muted">File Size</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{formatBytes(metadata.size)}</span>
              </div>
            </div>

            <div className="bg-obsidian-secondary p-3.5 rounded-xl border border-obsidian-border/60 flex items-center gap-3">
              <Monitor className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="block text-[10px] font-medium uppercase text-obsidian-text-muted">Original Dimensions</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{metadata.width} × {metadata.height} px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div
        {...getRootProps()}
        className={`w-full bg-obsidian-card border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-purple-500 bg-purple-500/10 scale-[1.01]'
            : 'border-obsidian-border hover:border-purple-500/50 hover:bg-obsidian-card-hover'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center">
          <div className={`p-5 rounded-2xl mb-4 transition-transform duration-300 ${isDragActive ? 'scale-110 bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'}`}>
            <UploadCloud className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-white mb-2">
            {isDragActive ? 'Drop your image here...' : 'Drag & drop image to upscale'}
          </h2>
          <p className="text-obsidian-text-muted text-xs sm:text-sm mb-6 max-w-sm">
            Enhance photo quality, increase resolution, and remove noise using browser AI.
          </p>

          <button
            type="button"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 transition-all transform hover:scale-105 active:scale-95 mb-6 min-h-[48px]"
          >
            Browse File
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-obsidian-text-muted pt-4 border-t border-obsidian-border/60 w-full max-w-md">
            <span className="font-semibold text-gray-300">Supported Formats:</span>
            <span className="px-2 py-0.5 rounded bg-obsidian-secondary border border-obsidian-border font-mono">PNG</span>
            <span className="px-2 py-0.5 rounded bg-obsidian-secondary border border-obsidian-border font-mono">JPG</span>
            <span className="px-2 py-0.5 rounded bg-obsidian-secondary border border-obsidian-border font-mono">JPEG</span>
            <span className="px-2 py-0.5 rounded bg-obsidian-secondary border border-obsidian-border font-mono">WEBP</span>
            <span className="ml-2 text-purple-400 font-medium">• Max 25 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
