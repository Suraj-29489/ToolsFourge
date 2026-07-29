import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileText, Download, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function DeletePdfPages() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToDelete, setPagesToDelete] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        setResultUrl(null);
        try {
          const ab = await uploadedFile.arrayBuffer();
          const doc = await PDFDocument.load(ab);
          setPageCount(doc.getPageCount());
        } catch (_) {}
      }
    },
  });

  const parsePagesInput = (inputStr, total) => {
    const indicesToDelete = new Set();
    const parts = inputStr.split(',');
    parts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map((n) => parseInt(n, 10));
        if (start && end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= total) indicesToDelete.add(i - 1);
          }
        }
      } else {
        const num = parseInt(trimmed, 10);
        if (num >= 1 && num <= total) indicesToDelete.add(num - 1);
      }
    });
    return indicesToDelete;
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const ab = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(ab);
      const deleteIndices = parsePagesInput(pagesToDelete, pageCount);

      if (deleteIndices.size >= pageCount) {
        alert('Cannot delete all pages from the PDF.');
        setIsProcessing(false);
        return;
      }

      // Delete pages in descending index order
      const sortedIndices = Array.from(deleteIndices).sort((a, b) => b - a);
      sortedIndices.forEach((idx) => pdfDoc.removePage(idx));

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert('Failed to delete pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Trash2 className="w-8 h-8 text-rose-400" />
          Delete PDF Pages
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Remove unwanted pages from your PDF file completely inside your browser.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <FileText className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload PDF Document</h3>
          <p className="text-xs text-obsidian-text-muted">Drag & drop or click to select a PDF file</p>
        </div>
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-obsidian-border">
            <div>
              <h3 className="font-bold text-white">{file.name}</h3>
              <p className="text-xs text-obsidian-text-muted">Total Pages: <span className="text-purple-400 font-bold">{pageCount}</span></p>
            </div>
            <button onClick={() => setFile(null)} className="text-xs text-rose-400 hover:underline">Change File</button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">
              Page Numbers to Delete (e.g. 1, 3-5)
            </label>
            <input
              type="text"
              placeholder="e.g. 2, 4, 7-9"
              value={pagesToDelete}
              onChange={(e) => setPagesToDelete(e.target.value)}
              className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3.5 rounded-xl font-mono"
            />
          </div>

          <button onClick={handleProcess} disabled={isProcessing || !pagesToDelete.trim()} className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            Delete Selected Pages
          </button>

          {resultUrl && (
            <div className="pt-4 text-center">
              <a href={resultUrl} download={`modified_${file.name}`} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                <Download className="w-5 h-5" /> Download Modified PDF
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
