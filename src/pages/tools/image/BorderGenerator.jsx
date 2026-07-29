import React, { useState, useRef, useEffect } from 'react';
import { Square, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function BorderGenerator() {
  const [file, setFile] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [borderWidth, setBorderWidth] = useState(15);
  const [borderColor, setBorderColor] = useState('#8b5cf6');
  const [padding, setPadding] = useState(10);
  const [radiusTL, setRadiusTL] = useState(24);
  const [radiusTR, setRadiusTR] = useState(24);
  const [radiusBL, setRadiusBL] = useState(24);
  const [radiusBR, setRadiusBR] = useState(24);

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

    const totalWidth = imageObj.width + (borderWidth + padding) * 2;
    const totalHeight = imageObj.height + (borderWidth + padding) * 2;
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    ctx.clearRect(0, 0, totalWidth, totalHeight);

    // Draw Outer Border with Rounded Corners
    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.roundRect(0, 0, totalWidth, totalHeight, [radiusTL, radiusTR, radiusBR, radiusBL]);
    ctx.fill();

    // Draw Image Inside Padding
    const imgX = borderWidth + padding;
    const imgY = borderWidth + padding;

    ctx.save();
    ctx.beginPath();
    const innerRadius = Math.max(0, Math.min(radiusTL, radiusTR, radiusBL, radiusBR) - borderWidth);
    ctx.roundRect(imgX, imgY, imageObj.width, imageObj.height, innerRadius);
    ctx.clip();
    ctx.drawImage(imageObj, imgX, imgY);
    ctx.restore();
  }, [imageObj, borderWidth, borderColor, padding, radiusTL, radiusTR, radiusBL, radiusBR]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    const a = document.createElement('a');
    a.download = `framed_${file.name}`;
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
          <Square className="w-8 h-8 text-purple-400" />
          Border & Rounded Corner Generator
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Add custom borders, inner padding, and independent corner radius to your images.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Square className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Image</h3>
          <p className="text-xs text-obsidian-text-muted">PNG, JPG, WEBP formats up to 25 MB</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-obsidian-card border border-obsidian-border rounded-2xl p-4 flex items-center justify-center min-h-[380px] bg-black/40">
            <canvas ref={canvasRef} className="max-h-[480px] w-auto max-w-full object-contain shadow-2xl" />
          </div>

          <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider pb-3 border-b border-obsidian-border">Border Styling</h3>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Border Width ({borderWidth}px)</label>
              <input type="range" min={0} max={60} value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Inner Padding ({padding}px)</label>
              <input type="range" min={0} max={40} value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Border Color</label>
              <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-9 rounded-lg bg-transparent cursor-pointer" />
            </div>

            <div className="space-y-2 pt-2 border-t border-obsidian-border">
              <span className="text-xs font-semibold text-obsidian-text-muted block">Corner Radii</span>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-[10px] text-gray-400 block">Top Left ({radiusTL}px)</span><input type="range" min={0} max={80} value={radiusTL} onChange={(e) => setRadiusTL(Number(e.target.value))} className="w-full accent-purple-500" /></div>
                <div><span className="text-[10px] text-gray-400 block">Top Right ({radiusTR}px)</span><input type="range" min={0} max={80} value={radiusTR} onChange={(e) => setRadiusTR(Number(e.target.value))} className="w-full accent-purple-500" /></div>
                <div><span className="text-[10px] text-gray-400 block">Bottom Left ({radiusBL}px)</span><input type="range" min={0} max={80} value={radiusBL} onChange={(e) => setRadiusBL(Number(e.target.value))} className="w-full accent-purple-500" /></div>
                <div><span className="text-[10px] text-gray-400 block">Bottom Right ({radiusBR}px)</span><input type="range" min={0} max={80} value={radiusBR} onChange={(e) => setRadiusBR(Number(e.target.value))} className="w-full accent-purple-500" /></div>
              </div>
            </div>

            <button onClick={handleDownload} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Framed Image
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
