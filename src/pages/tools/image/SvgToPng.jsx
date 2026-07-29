import React, { useState } from 'react';
import { FileCode, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function SvgToPng() {
  const [file, setFile] = useState(null);
  const [svgContent, setSvgContent] = useState('');
  const [scale, setScale] = useState(2); // 1x, 2x, 4x
  const [format, setFormat] = useState('png'); // 'png' | 'webp'
  const [isProcessing, setIsProcessing] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/svg+xml': ['.svg'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        const reader = new FileReader();
        reader.onload = (e) => setSvgContent(e.target.result);
        reader.readAsText(uploadedFile);
      }
    },
  });

  const handleExport = () => {
    if (!svgContent) return;
    setIsProcessing(true);

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const renderW = (img.width || 300) * scale;
      const renderH = (img.height || 300) * scale;
      canvas.width = renderW;
      canvas.height = renderH;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, renderW, renderH);

      const mimeType = format === 'webp' ? 'image/webp' : 'image/png';
      canvas.toBlob((outputBlob) => {
        const downloadUrl = URL.createObjectURL(outputBlob);
        const a = document.createElement('a');
        a.download = `${file.name.replace('.svg', '')}_${scale}x.${format}`;
        a.href = downloadUrl;
        a.click();
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(downloadUrl);
        setIsProcessing(false);
      }, mimeType);
    };

    img.src = url;
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
          <FileCode className="w-8 h-8 text-purple-400" />
          SVG to PNG / WEBP Converter
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Convert SVG vector graphics to high-resolution raster images directly inside your browser.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <FileCode className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload SVG File</h3>
          <p className="text-xs text-obsidian-text-muted">Drag & drop or click to select a vector .svg file</p>
        </div>
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-obsidian-border">
            <div>
              <h3 className="font-bold text-white">{file.name}</h3>
              <p className="text-xs text-obsidian-text-muted">SVG Vector Graphics</p>
            </div>
            <button onClick={() => { setFile(null); setSvgContent(''); }} className="text-xs text-rose-400 hover:underline">Change File</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Export Quality / Scale</label>
              <select value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3.5 rounded-xl">
                <option value={1}>1× Standard Size</option>
                <option value={2}>2× HD Resolution</option>
                <option value={4}>4× Ultra-HD Resolution</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Target Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3.5 rounded-xl">
                <option value="png">PNG (Transparent)</option>
                <option value="webp">WEBP (Optimized)</option>
              </select>
            </div>
          </div>

          <button onClick={handleExport} disabled={isProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            Export {format.toUpperCase()} Image
          </button>
        </div>
      )}
    </main>
  );
}
