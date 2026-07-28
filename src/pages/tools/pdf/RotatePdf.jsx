import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { RotateCw, Download, FileText } from 'lucide-react';

export default function RotatePdf() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: '.pdf,application/pdf', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [rotationAngle, setRotationAngle] = useState(90); // 90, 180, 270

  const handleRotate = async () => {
    if (files.length === 0) return;
    const file = files[0];
    startProcessing('Rotating PDF pages...');

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();
      const total = pages.length;

      pages.forEach((page, i) => {
        updateProgress(Math.round(((i + 1) / total) * 80), `Rotating page ${i + 1} of ${total}...`);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotationAngle) % 360));
      });

      updateProgress(90, 'Saving updated PDF document...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      updateProgress(100, 'Done!');
      downloadBlob(blob, `${file.name.replace('.pdf', '')}_rotated.pdf`);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing(err.message || 'Failed to rotate PDF pages.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Rotate PDF"
        description="Rotate all pages in your PDF document clockwise by 90°, 180°, or 270° degrees."
        icon={RotateCw}
      />

      <ErrorState error={fileError || procError} />

      {files.length === 0 ? (
        <DropZone
          accept=".pdf,application/pdf"
          multiple={false}
          onFileSelect={onFileSelect}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          isDragging={isDragging}
          title="Drag & drop a PDF file here"
          subtitle="Select 1 PDF file to rotate"
        />
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-border">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-base font-bold text-obsidian-text">{files[0].name}</h3>
                <p className="text-xs text-obsidian-text-muted">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={clearFiles} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change File
            </button>
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-obsidian-text block mb-3">Select Rotation Angle</label>
            <div className="grid grid-cols-3 gap-3">
              {[90, 180, 270].map((angle) => (
                <button
                  key={angle}
                  type="button"
                  onClick={() => setRotationAngle(angle)}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                    rotationAngle === angle
                      ? 'bg-obsidian-accent text-white border-obsidian-accent'
                      : 'bg-obsidian-secondary text-obsidian-text-muted border-obsidian-border hover:border-obsidian-accent/40'
                  }`}
                >
                  +{angle}° Clockwise
                </button>
              ))}
            </div>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleRotate}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Rotate PDF & Download</span>
          </button>
        </div>
      )}
    </main>
  );
}
