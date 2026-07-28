import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { FileArchive, Download } from 'lucide-react';

export default function CompressImage() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: 'image/*', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [quality, setQuality] = useState(0.8);
  const [compressedFile, setCompressedFile] = useState(null);

  const handleCompress = async () => {
    if (files.length === 0) return;
    startProcessing('Compressing image...');

    try {
      const file = files[0];
      updateProgress(30, 'Optimizing bytes...');

      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
        onProgress: (p) => updateProgress(Math.round(p), 'Compressing...'),
      };

      const compressed = await imageCompression(file, options);
      setCompressedFile(compressed);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to compress image.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Compress Image"
        description="Reduce image file size significantly while retaining high visual quality."
        icon={FileArchive}
      />

      <ErrorState error={fileError || procError} />

      {files.length === 0 ? (
        <DropZone
          accept="image/*"
          multiple={false}
          onFileSelect={onFileSelect}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          isDragging={isDragging}
          title="Drag & drop an image here"
          subtitle="Supports JPG, PNG, WEBP"
        />
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-border">
            <div>
              <h3 className="text-base font-bold text-obsidian-text">{files[0].name}</h3>
              <p className="text-xs text-obsidian-text-muted">
                Original Size: {(files[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button onClick={() => { clearFiles(); setCompressedFile(null); }} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change Image
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Max File Size (MB)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={maxSizeMB}
                onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
                className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-obsidian-text focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Quality ({Math.round(quality * 100)}%)</label>
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

          {compressedFile ? (
            <div className="bg-obsidian-secondary border border-obsidian-border rounded-xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-400 font-bold">Compression Successful!</p>
                <p className="text-xs text-obsidian-text mt-0.5">
                  New Size: {(compressedFile.size / 1024 / 1024).toFixed(2)} MB ({Math.round((1 - compressedFile.size / files[0].size) * 100)}% reduction)
                </p>
              </div>
              <button
                onClick={() => downloadBlob(compressedFile, `compressed_${files[0].name}`)}
                className="px-4 py-2 rounded-xl bg-obsidian-accent text-white font-bold text-xs flex items-center space-x-1.5 hover:bg-obsidian-accent-hover"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Compressed File</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleCompress}
              disabled={processing}
              className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
            >
              <FileArchive className="w-4 h-4" />
              <span>Compress Image</span>
            </button>
          )}
        </div>
      )}
    </main>
  );
}
