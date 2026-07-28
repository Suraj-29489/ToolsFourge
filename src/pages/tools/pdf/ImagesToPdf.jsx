import React from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { FileImage, Download, Trash2 } from 'lucide-react';

export default function ImagesToPdf() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, removeFile, clearFiles } = useFileDrop({ accept: 'image/jpeg,image/png,image/webp', multiple: true });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const handleConvert = async () => {
    if (files.length === 0) return;
    startProcessing('Creating PDF from images...');

    try {
      const pdfDoc = await PDFDocument.create();
      const total = files.length;

      for (let i = 0; i < total; i++) {
        updateProgress(Math.round(((i + 1) / total) * 80), `Processing image ${i + 1} of ${total}...`);
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();

        let image;
        if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // For JPG / WEBP convert via Canvas to PNG bytes first for pdf-lib compatibility
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          await new Promise((res) => { img.onload = res; });
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const pngBlob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
          const pngBuffer = await pngBlob.arrayBuffer();
          image = await pdfDoc.embedPng(pngBuffer);
          URL.revokeObjectURL(img.src);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      updateProgress(90, 'Generating PDF...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      updateProgress(100, 'Done!');
      downloadBlob(blob, 'images-converted.pdf');
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing(err.message || 'Failed to convert images to PDF.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Images to PDF"
        description="Convert JPG, PNG, and WEBP images into a clean multi-page PDF file."
        icon={FileImage}
      />

      <ErrorState error={fileError || procError} />

      <DropZone
        accept="image/jpeg,image/png,image/webp"
        multiple={true}
        onFileSelect={onFileSelect}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        isDragging={isDragging}
        title="Drag & drop images here"
        subtitle="Select JPG, PNG, or WEBP images"
      />

      {files.length > 0 && (
        <div className="mt-8 bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-obsidian-border">
            <h3 className="text-base font-bold text-obsidian-text">
              Selected Images ({files.length})
            </h3>
            <button onClick={clearFiles} className="text-xs text-red-400 hover:text-red-300">
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {files.map((file, idx) => (
              <div key={idx} className="relative group bg-obsidian-secondary p-2 rounded-xl border border-obsidian-border">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-[10px] text-obsidian-text-muted truncate mt-1">{file.name}</p>
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleConvert}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Convert {files.length} Images to PDF</span>
          </button>
        </div>
      )}
    </main>
  );
}
