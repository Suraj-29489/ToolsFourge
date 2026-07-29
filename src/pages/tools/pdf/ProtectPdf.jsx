import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Lock, Download, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function ProtectPdf() {
  const [file, setFile] = useState(null);
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
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
    if (!file || !userPassword) return;
    setIsProcessing(true);
    try {
      const ab = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(ab);

      const pdfBytes = await pdfDoc.save({
        userPassword,
        ownerPassword: ownerPassword || userPassword,
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert('Failed to protect PDF document.');
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
          <Lock className="w-8 h-8 text-purple-400" />
          Protect PDF with Password
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Encrypt and secure your PDF documents with custom passwords locally in your browser.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Lock className="w-12 h-12 text-purple-400 mx-auto mb-3" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Password to Open PDF</label>
              <input
                type="password"
                placeholder="Enter opening password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3.5 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Owner Password (Optional)</label>
              <input
                type="password"
                placeholder="Optional master password"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3.5 rounded-xl"
              />
            </div>
          </div>

          <button onClick={handleProcess} disabled={isProcessing || !userPassword} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
            Encrypt & Protect PDF
          </button>

          {resultUrl && (
            <div className="pt-4 text-center">
              <a href={resultUrl} download={`protected_${file.name}`} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                <Download className="w-5 h-5" /> Download Protected PDF
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
