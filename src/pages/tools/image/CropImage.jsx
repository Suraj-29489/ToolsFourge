import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { Crop, Download } from 'lucide-react';

export default function CropImage() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: 'image/*', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [aspectRatio, setAspectRatio] = useState('free'); // '1:1', '16:9', '4:3', 'free'

  const handleCrop = async () => {
    if (files.length === 0) return;
    startProcessing('Cropping image...');

    try {
      updateProgress(40, 'Processing crop region...');
      const file = files[0];
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      await new Promise((res) => { img.onload = res; });

      const canvas = document.createElement('canvas');
      let cropWidth = img.width;
      let cropHeight = img.height;

      if (aspectRatio === '1:1') {
        const size = Math.min(img.width, img.height);
        cropWidth = size;
        cropHeight = size;
      } else if (aspectRatio === '16:9') {
        cropWidth = img.width;
        cropHeight = Math.round(img.width * (9 / 16));
        if (cropHeight > img.height) {
          cropHeight = img.height;
          cropWidth = Math.round(img.height * (16 / 9));
        }
      } else if (aspectRatio === '4:3') {
        cropWidth = img.width;
        cropHeight = Math.round(img.width * (3 / 4));
        if (cropHeight > img.height) {
          cropHeight = img.height;
          cropWidth = Math.round(img.height * (4 / 3));
        }
      }

      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      const startX = Math.round((img.width - cropWidth) / 2);
      const startY = Math.round((img.height - cropHeight) / 2);

      ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      updateProgress(90, 'Exporting cropped image...');
      const blob = await new Promise((res) => canvas.toBlob(res, file.type || 'image/png', 0.95));

      updateProgress(100, 'Done!');
      downloadBlob(blob, `cropped_${file.name}`);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to crop image.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Crop Image"
        description="Crop images into square (1:1), widescreen (16:9), or custom ratios."
        icon={Crop}
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
            </div>
            <button onClick={clearFiles} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change Image
            </button>
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-obsidian-text block mb-3">Crop Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Square (1:1)', val: '1:1' },
                { label: 'Widescreen (16:9)', val: '16:9' },
                { label: 'Standard (4:3)', val: '4:3' },
                { label: 'Freeform', val: 'free' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setAspectRatio(item.val)}
                  className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all ${
                    aspectRatio === item.val
                      ? 'bg-obsidian-accent text-white border-obsidian-accent'
                      : 'bg-obsidian-secondary text-obsidian-text-muted border-obsidian-border hover:border-obsidian-accent/40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleCrop}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Crop & Download Image</span>
          </button>
        </div>
      )}
    </main>
  );
}
