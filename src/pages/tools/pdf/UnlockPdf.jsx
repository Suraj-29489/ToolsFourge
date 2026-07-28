import React from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { Unlock, Download, FileText } from 'lucide-react';

export default function UnlockPdf() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: '.pdf,application/pdf', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const handleUnlock = async () => {
    if (files.length === 0) return;
    const file = files[0];
    startProcessing('Removing owner restrictions...');

    try {
      updateProgress(40, 'Loading PDF structure...');
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

      updateProgress(80, 'Re-saving unlocked PDF document...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      updateProgress(100, 'Done!');
      downloadBlob(blob, `${file.name.replace('.pdf', '')}_unlocked.pdf`);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing(err.message || 'Failed to unlock PDF. High-level user password protection cannot be bypassed client-side.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Unlock PDF"
        description="Remove owner restrictions, printing limits, and edit permissions from PDF files."
        icon={Unlock}
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
          subtitle="Select 1 PDF file to unlock"
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

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleUnlock}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Unlock PDF Restrictions & Download</span>
          </button>
        </div>
      )}
    </main>
  );
}
