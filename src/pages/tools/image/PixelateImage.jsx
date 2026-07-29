import React, { useState, useRef, useEffect } from 'react';
import { Grid, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function PixelateImage() {
  const [file, setFile] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [pixelSize, setPixelSize] = useState(12);

  const canvasRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        const img = new Image();
        img.src = URL.createObjectURL(uploadedFile);
        img.onload = () => setImageObj(img);
      }
    },
  });

  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const w = imageObj.width;
    const h = imageObj.height;
    canvas.width = w;
    canvas.height = h;

    // Downsample and upsample for pixelation effect
    const scaledW = Math.max(1, Math.floor(w / pixelSize));
    const scaledH = Math.max(1, Math.floor(h / pixelSize));

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = scaledW;
    tempCanvas.height = scaledH;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(imageObj, 0, 0, scaledW, scaledH);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, scaledW, scaledH, 0, 0, w, h);
  }, [imageObj, pixelSize]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    const a = document.createElement('a');
    a.download = `pixelated_${file.name}`;
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Grid className="w-8 h-8 text-purple-400" />
          Pixelate Image Effect
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Apply a retro pixelated mosaic effect to your photos locally inside your browser.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Grid className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Image</h3>
          <p className="text-xs text-obsidian-text-muted">PNG, JPG, WEBP formats up to 25 MB</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-obsidian-card border border-obsidian-border rounded-2xl p-4 flex items-center justify-center min-h-[380px] bg-black/40">
            <canvas ref={canvasRef} className="max-h-[480px] w-auto max-w-full object-contain rounded-lg shadow-2xl" />
          </div>

          <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-5 space-y-6">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider pb-3 border-b border-obsidian-border">Pixelation Settings</h3>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Pixel Block Size ({pixelSize}px)</label>
              <input type="range" min={2} max={64} value={pixelSize} onChange={(e) => setPixelSize(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <button onClick={handleDownload} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Pixelated Image
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
