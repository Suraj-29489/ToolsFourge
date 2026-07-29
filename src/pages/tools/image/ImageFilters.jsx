import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Download, ArrowLeft, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function ImageFilters() {
  const [file, setFile] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

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

    const isRotated90 = rotation % 180 !== 0;
    canvas.width = isRotated90 ? imageObj.height : imageObj.width;
    canvas.height = isRotated90 ? imageObj.width : imageObj.height;

    ctx.save();
    ctx.filter = `blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%) brightness(${brightness}%) contrast(${contrast}%)`;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    ctx.drawImage(imageObj, -imageObj.width / 2, -imageObj.height / 2);
    ctx.restore();
  }, [imageObj, blur, grayscale, sepia, brightness, contrast, rotation, flipH, flipV]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    const a = document.createElement('a');
    a.download = `filtered_${file.name}`;
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
          <Sliders className="w-8 h-8 text-purple-400" />
          Image Filters & Effects
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Apply blur, grayscale, sepia, rotate, and flip adjustments locally in real time.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Sliders className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Image</h3>
          <p className="text-xs text-obsidian-text-muted">PNG, JPG, WEBP formats up to 25 MB</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-obsidian-card border border-obsidian-border rounded-2xl p-4 flex items-center justify-center min-h-[350px] bg-black/40">
            <canvas ref={canvasRef} className="max-h-[500px] w-auto max-w-full object-contain rounded-lg" />
          </div>

          <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-white text-base border-b border-obsidian-border pb-3">Adjustments</h3>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Blur ({blur}px)</label>
              <input type="range" min={0} max={20} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Grayscale ({grayscale}%)</label>
              <input type="range" min={0} max={100} value={grayscale} onChange={(e) => setGrayscale(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Sepia ({sepia}%)</label>
              <input type="range" min={0} max={100} value={sepia} onChange={(e) => setSepia(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Brightness ({brightness}%)</label>
              <input type="range" min={20} max={200} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Contrast ({contrast}%)</label>
              <input type="range" min={20} max={200} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setRotation((r) => (r + 90) % 360)} className="flex-1 p-2 bg-obsidian-secondary border border-obsidian-border text-white text-xs rounded-xl flex items-center justify-center gap-1.5">
                <RotateCw className="w-4 h-4 text-purple-400" /> Rotate
              </button>
              <button onClick={() => setFlipH((f) => !f)} className="flex-1 p-2 bg-obsidian-secondary border border-obsidian-border text-white text-xs rounded-xl flex items-center justify-center gap-1.5">
                <FlipHorizontal className="w-4 h-4 text-purple-400" /> Flip H
              </button>
            </div>

            <button onClick={handleDownload} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Result
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
