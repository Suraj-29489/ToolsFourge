import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { ArrowRightLeft, Download, Image as ImageIcon } from 'lucide-react';

export default function ImageConverter({ targetFormat = 'png', defaultTitle = 'Image Converter' }) {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: 'image/*', multiple: true });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [format, setFormat] = useState(targetFormat);
  const [quality, setQuality] = useState(0.9);

  const handleConvert = async () => {
    if (files.length === 0) return;
    startProcessing(`Converting images to ${format.toUpperCase()}...`);

    try {
      const total = files.length;
      for (let i = 0; i < total; i++) {
        updateProgress(Math.round(((i + 1) / total) * 90), `Converting ${files[i].name}...`);
        const file = files[i];

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        await new Promise((res) => { img.onload = res; });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (format === 'jpeg' || format === 'jpg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
        const blob = await new Promise((res) => canvas.toBlob(res, mimeType, quality));

        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        downloadBlob(blob, `${baseName}.${format === 'jpg' ? 'jpg' : format}`);
        URL.revokeObjectURL(img.src);
      }

      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing(err.message || 'Failed to convert images.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title={defaultTitle}
        description={`Convert your images into ${targetFormat.toUpperCase()} format with customizable quality.`}
        icon={ArrowRightLeft}
      />

      <ErrorState error={fileError || procError} />

      <DropZone
        accept="image/*"
        multiple={true}
        onFileSelect={onFileSelect}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        isDragging={isDragging}
        title="Drag & drop images here"
        subtitle="JPG, PNG, WEBP formats supported"
      />

      {files.length > 0 && (
        <div className="mt-8 bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-border">
            <div className="flex items-center space-x-3">
              <ImageIcon className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-obsidian-text">
                Selected Images ({files.length})
              </h3>
            </div>
            <button onClick={clearFiles} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Target Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-obsidian-text focus:outline-none"
              >
                <option value="png">PNG (Lossless & Transparent)</option>
                <option value="jpeg">JPG / JPEG (Standard)</option>
                <option value="webp">WEBP (Web Optimized)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-obsidian-accent cursor-pointer mt-2"
              />
            </div>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleConvert}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Convert & Download {files.length} Images</span>
          </button>
        </div>
      )}
    </main>
  );
}
