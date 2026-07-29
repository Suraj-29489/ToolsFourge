import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FileText, Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function PdfPageNumbering() {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState('bottom-center'); // 'bottom-left' | 'bottom-center' | 'bottom-right'
  const [format, setFormat] = useState('page-n-of-m'); // 'page-n' | 'page-n-of-m' | 'number-only'
  const [fontSize, setFontSize] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setResultUrl(null);
      }
    },
  });

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNum = index + 1;

        let text = `${pageNum}`;
        if (format === 'page-n') text = `Page ${pageNum}`;
        if (format === 'page-n-of-m') text = `Page ${pageNum} of ${totalPages}`;

        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        const margin = 25;

        let x = (width - textWidth) / 2;
        if (position === 'bottom-left') x = margin;
        if (position === 'bottom-right') x = width - margin - textWidth;

        page.drawText(text, {
          x,
          y: margin,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0.3, 0.3, 0.3),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert('Failed to add page numbers to PDF.');
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
          <FileText className="w-8 h-8 text-purple-400" />
          PDF Page Numbering
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Add page numbers to your PDF documents automatically directly inside your browser.
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
              <p className="text-xs text-obsidian-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => setFile(null)} className="text-xs text-rose-400 hover:underline">Change File</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Position</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl">
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl">
                <option value="page-n-of-m">Page N of M</option>
                <option value="page-n">Page N</option>
                <option value="number-only">Number Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Font Size ({fontSize}px)</label>
              <input type="range" min={8} max={18} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
          </div>

          <button onClick={handleProcess} disabled={isProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Add Page Numbers
          </button>

          {resultUrl && (
            <div className="pt-4 text-center space-y-3">
              <a href={resultUrl} download={`numbered_${file.name}`} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                <Download className="w-5 h-5" /> Download Numbered PDF
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
