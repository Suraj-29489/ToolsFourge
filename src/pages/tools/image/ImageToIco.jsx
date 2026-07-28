import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { Disc, Download } from 'lucide-react';

export default function ImageToIco() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: 'image/*', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [icoSize, setIcoSize] = useState(32); // 16, 32, 48, 64

  const handleConvert = async () => {
    if (files.length === 0) return;
    startProcessing('Generating ICO favicon...');

    try {
      updateProgress(40, 'Rendering icon canvas...');
      const file = files[0];
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      await new Promise((res) => { img.onload = res; });

      const canvas = document.createElement('canvas');
      canvas.width = icoSize;
      canvas.height = icoSize;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, icoSize, icoSize);

      updateProgress(80, 'Formatting ICO file data...');
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/x-icon'));
      const icoBlob = blob || (await new Promise((res) => canvas.toBlob(res, 'image/png')));

      updateProgress(100, 'Done!');
      downloadBlob(icoBlob, 'favicon.ico');
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to generate ICO file.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Image to ICO"
        description="Convert PNG, JPG, or WEBP images into a favicon.ico file for websites."
        icon={Disc}
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
          subtitle="Supports PNG, JPG, WEBP"
        />
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-border">
            <div>
              <h3 className="text-base font-bold text-obsidian-text">{files[0].name}</h3>
            </div>
            <button onClick={clearFiles} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change Image
            </button>
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-obsidian-text block mb-3">Favicon Dimension (Pixels)</label>
            <div className="grid grid-cols-4 gap-3">
              {[16, 32, 48, 64].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setIcoSize(size)}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                    icoSize === size
                      ? 'bg-obsidian-accent text-white border-obsidian-accent'
                      : 'bg-obsidian-secondary text-obsidian-text-muted border-obsidian-border hover:border-obsidian-accent/40'
                  }`}
                >
                  {size} × {size} px
                </button>
              ))}
            </div>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleConvert}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download favicon.ico</span>
          </button>
        </div>
      )}
    </main>
  );
}
