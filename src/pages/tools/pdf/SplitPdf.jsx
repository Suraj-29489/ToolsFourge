import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { Split, Download, FileText } from 'lucide-react';

export default function SplitPdf() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: '.pdf,application/pdf', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [pageRange, setPageRange] = useState('');
  const [splitMode, setSplitMode] = useState('range'); // 'range' or 'all'

  const handleSplit = async () => {
    if (files.length === 0) return;
    const file = files[0];
    startProcessing('Loading PDF for splitting...');

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const totalPages = pdfDoc.getPageCount();

      if (splitMode === 'all') {
        for (let i = 0; i < totalPages; i++) {
          updateProgress(Math.round(((i + 1) / totalPages) * 90), `Extracting page ${i + 1} of ${totalPages}...`);
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          downloadBlob(blob, `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`);
        }
      } else {
        // Parse range (e.g. 1-3, 5)
        const pagesToExtract = new Set();
        const parts = pageRange.split(',').map((p) => p.trim());

        parts.forEach((part) => {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) {
                if (i >= 1 && i <= totalPages) pagesToExtract.add(i - 1);
              }
            }
          } else {
            const pageNum = parseInt(part, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
              pagesToExtract.add(pageNum - 1);
            }
          }
        });

        if (pagesToExtract.size === 0) {
          throw new Error(`Invalid page range. Please enter valid page numbers between 1 and ${totalPages}.`);
        }

        updateProgress(50, 'Extracting specified pages...');
        const newPdf = await PDFDocument.create();
        const indices = Array.from(pagesToExtract).sort((a, b) => a - b);
        const copiedPages = await newPdf.copyPages(pdfDoc, indices);
        copiedPages.forEach((p) => newPdf.addPage(p));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        downloadBlob(blob, `${file.name.replace('.pdf', '')}_extracted.pdf`);
      }

      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing(err.message || 'Failed to split PDF.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Split PDF"
        description="Extract specific page ranges or split every page into separate PDF documents."
        icon={Split}
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
          subtitle="Select 1 PDF file to split"
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

          <div className="space-y-4 mb-6">
            <label className="text-sm font-semibold text-obsidian-text block">Split Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSplitMode('range')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  splitMode === 'range'
                    ? 'bg-obsidian-accent text-white border-obsidian-accent'
                    : 'bg-obsidian-secondary text-obsidian-text-muted border-obsidian-border hover:border-obsidian-accent/40'
                }`}
              >
                Extract Specific Pages
              </button>
              <button
                type="button"
                onClick={() => setSplitMode('all')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  splitMode === 'all'
                    ? 'bg-obsidian-accent text-white border-obsidian-accent'
                    : 'bg-obsidian-secondary text-obsidian-text-muted border-obsidian-border hover:border-obsidian-accent/40'
                }`}
              >
                Split Every Page
              </button>
            </div>

            {splitMode === 'range' && (
              <div className="mt-4">
                <label className="text-xs font-medium text-obsidian-text-muted block mb-1">
                  Enter Page Range (e.g. 1-3, 5, 8-10)
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g. 1-4, 7, 10"
                  className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl px-4 py-3 text-sm text-obsidian-text focus:border-obsidian-accent focus:outline-none"
                />
              </div>
            )}
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleSplit}
            disabled={processing || (splitMode === 'range' && !pageRange.trim())}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Process & Download PDF</span>
          </button>
        </div>
      )}
    </main>
  );
}
