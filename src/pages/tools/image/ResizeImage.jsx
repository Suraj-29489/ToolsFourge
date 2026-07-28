import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { Scaling, Download, Lock, Unlock } from 'lucide-react';

export default function ResizeImage() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: 'image/*', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);

  const handleFileLoaded = (file) => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
    };
  };

  const handleWidthChange = (val) => {
    const newW = parseInt(val, 10) || 0;
    setWidth(newW);
    if (lockAspect && origWidth > 0) {
      setHeight(Math.round((newW / origWidth) * origHeight));
    }
  };

  const handleHeightChange = (val) => {
    const newH = parseInt(val, 10) || 0;
    setHeight(newH);
    if (lockAspect && origHeight > 0) {
      setWidth(Math.round((newH / origHeight) * origWidth));
    }
  };

  const handleResize = async () => {
    if (files.length === 0) return;
    startProcessing('Resizing image...');

    try {
      updateProgress(30, 'Scaling Canvas dimensions...');
      const file = files[0];
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      await new Promise((res) => { img.onload = res; });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      updateProgress(80, 'Exporting resized image...');
      const blob = await new Promise((res) => canvas.toBlob(res, file.type || 'image/png', 0.92));

      updateProgress(100, 'Done!');
      downloadBlob(blob, `resized_${file.name}`);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to resize image.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Resize Image"
        description="Change image dimensions by custom pixel widths and heights while maintaining aspect ratio."
        icon={Scaling}
      />

      <ErrorState error={fileError || procError} />

      {files.length === 0 ? (
        <DropZone
          accept="image/*"
          multiple={false}
          onFileSelect={(e) => { onFileSelect(e); if (e.target.files[0]) handleFileLoaded(e.target.files[0]); }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => { onDrop(e); if (e.dataTransfer.files[0]) handleFileLoaded(e.dataTransfer.files[0]); }}
          isDragging={isDragging}
          title="Drag & drop an image here"
          subtitle="Supports JPG, PNG, WEBP"
        />
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-border">
            <div>
              <h3 className="text-base font-bold text-obsidian-text">{files[0].name}</h3>
              <p className="text-xs text-obsidian-text-muted">Original: {origWidth} × {origHeight} px</p>
            </div>
            <button onClick={clearFiles} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change Image
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-obsidian-text focus:outline-none"
              />
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-obsidian-text focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <button
              type="button"
              onClick={() => setLockAspect(!lockAspect)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                lockAspect ? 'bg-obsidian-accent/20 border-obsidian-accent text-obsidian-accent' : 'bg-obsidian-secondary border-obsidian-border text-obsidian-text-muted'
              }`}
            >
              {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>Lock Aspect Ratio</span>
            </button>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleResize}
            disabled={processing || width <= 0 || height <= 0}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Resize & Download Image</span>
          </button>
        </div>
      )}
    </main>
  );
}
