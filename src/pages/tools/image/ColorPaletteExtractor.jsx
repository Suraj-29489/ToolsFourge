import React, { useState, useRef, useEffect } from 'react';
import { Palette, Copy, ArrowLeft, Check, Pipette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function ColorPaletteExtractor() {
  const [file, setFile] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [pickedColor, setPickedColor] = useState('#8b5cf6');
  const [palette, setPalette] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

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
    canvas.width = imageObj.width;
    canvas.height = imageObj.height;
    ctx.drawImage(imageObj, 0, 0);

    // Extract dominant palette
    extractPalette(ctx, canvas.width, canvas.height);
  }, [imageObj]);

  const extractPalette = (ctx, width, height) => {
    const imgData = ctx.getImageData(0, 0, width, height).data;
    const colorCounts = {};
    const step = Math.max(1, Math.floor((width * height) / 5000)); // Sample ~5000 pixels

    for (let i = 0; i < imgData.length; i += 4 * step) {
      const r = Math.round(imgData[i] / 32) * 32;
      const g = Math.round(imgData[i + 1] / 32) * 32;
      const b = Math.round(imgData[i + 2] / 32) * 32;
      const a = imgData[i + 3];

      if (a < 128) continue; // Skip transparent pixels

      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7)}`;
      colorCounts[hex] = (colorCounts[hex] || 0) + 1;
    }

    const sortedColors = Object.keys(colorCounts)
      .sort((a, b) => colorCounts[b] - colorCounts[a])
      .slice(0, 8);

    setPalette(sortedColors);
    if (sortedColors.length > 0) {
      setPickedColor(sortedColors[0]);
    }
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1, 7)}`;
    setPickedColor(hex);
  };

  const copyHex = (hexCode, index) => {
    navigator.clipboard.writeText(hexCode);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
          <Pipette className="w-8 h-8 text-purple-400" />
          Color Picker & Palette Extractor
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Click anywhere on an image to pick exact colors or extract dominant color palettes.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Palette className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Image</h3>
          <p className="text-xs text-obsidian-text-muted">PNG, JPG, WEBP formats up to 25 MB</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Eyedropper Canvas */}
          <div className="lg:col-span-2 bg-obsidian-card border border-obsidian-border rounded-2xl p-4 flex flex-col items-center justify-center bg-black/40 space-y-3">
            <p className="text-xs text-obsidian-text-muted">Click anywhere on the image to pick a color</p>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-h-[450px] w-auto max-w-full object-contain rounded-lg cursor-crosshair border border-obsidian-border"
            />
          </div>

          {/* Color Details & Palette */}
          <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-5 space-y-6">
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Selected Color</h3>
              <div className="flex items-center gap-4 bg-obsidian-secondary p-3.5 rounded-xl border border-obsidian-border">
                <div className="w-12 h-12 rounded-xl border border-white/20 shadow-inner shrink-0" style={{ backgroundColor: pickedColor }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-obsidian-text-muted block">HEX Code</span>
                  <span className="font-mono font-bold text-white text-base uppercase">{pickedColor}</span>
                </div>
                <button onClick={() => copyHex(pickedColor, 'picked')} className="p-2 bg-obsidian-card hover:bg-gray-800 text-white rounded-lg border border-obsidian-border">
                  {copiedIndex === 'picked' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Extracted Palette</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {palette.map((colorHex, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyHex(colorHex, idx)}
                    className="flex items-center gap-2.5 p-2 bg-obsidian-secondary border border-obsidian-border hover:border-purple-500/50 rounded-xl transition-all text-left"
                  >
                    <div className="w-6 h-6 rounded-lg border border-white/20 shrink-0" style={{ backgroundColor: colorHex }} />
                    <span className="font-mono text-xs font-semibold text-gray-200 uppercase truncate">{colorHex}</span>
                    {copiedIndex === idx && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setFile(null)} className="w-full py-3 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-xl">
              Upload Different Image
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
