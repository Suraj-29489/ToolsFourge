import React from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { FileText, Combine, Trash2, ArrowUp, ArrowDown, Download } from 'lucide-react';

export default function MergePdf() {
  const { files, setFiles, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, removeFile, clearFiles } = useFileDrop({ accept: '.pdf,application/pdf', multiple: true });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index - 1];
    newFiles[index - 1] = newFiles[index];
    newFiles[index] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index + 1];
    newFiles[index + 1] = newFiles[index];
    newFiles[index] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    startProcessing('Initializing PDF merger...');

    try {
      const mergedPdf = await PDFDocument.create();
      const total = files.length;

      for (let i = 0; i < total; i++) {
        updateProgress(Math.round(((i + 1) / total) * 80), `Reading ${files[i].name}...`);
        const fileBytes = await files[i].arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      updateProgress(90, 'Generating merged PDF bytes...');
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

      updateProgress(100, 'Done!');
      downloadBlob(blob, 'merged-document.pdf');
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing(err.message || 'Failed to merge PDF files. Ensure files are not encrypted.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Merge PDF"
        description="Combine multiple PDF documents into a single organized PDF file directly in your browser."
        icon={Combine}
      />

      <ErrorState error={fileError || procError} />

      <DropZone
        accept=".pdf,application/pdf"
        onFileSelect={onFileSelect}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        isDragging={isDragging}
        title="Drag & drop PDF files here"
        subtitle="Select 2 or more PDF documents to merge"
      />

      {files.length > 0 && (
        <div className="mt-8 bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-obsidian-border">
            <h3 className="text-base font-bold text-obsidian-text">
              Selected Files ({files.length})
            </h3>
            <button
              onClick={clearFiles}
              className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2.5 mb-6">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-obsidian-secondary border border-obsidian-border rounded-xl"
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className="text-xs font-mono font-bold text-obsidian-accent bg-obsidian-card px-2 py-1 rounded border border-obsidian-border">
                    #{idx + 1}
                  </span>
                  <FileText className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-obsidian-text truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-obsidian-text-muted">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-obsidian-text-muted hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1.5 rounded-lg text-obsidian-text-muted hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleMerge}
            disabled={processing || files.length < 2}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Merge {files.length} PDFs & Download</span>
          </button>
        </div>
      )}
    </main>
  );
}
