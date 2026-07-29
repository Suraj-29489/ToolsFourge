import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Download, ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SignatureGeneratorPage() {
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 700;
    canvas.height = 300;
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `signature_${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
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
          <PenTool className="w-8 h-8 text-purple-400" />
          Digital Signature Generator
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Draw your custom digital signature with smooth stroke curves & download a transparent PNG file.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-[10px] text-obsidian-text-muted block">Ink Color</label>
              <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer" />
            </div>

            <div>
              <label className="text-[10px] text-obsidian-text-muted block">Stroke Width ({lineWidth}px)</label>
              <input type="range" min={1} max={10} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="accent-purple-500" />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={clearSignature} className="px-4 py-2 bg-obsidian-secondary hover:bg-gray-800 text-rose-400 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-obsidian-border">
              <Trash2 className="w-4 h-4" /> Clear Canvas
            </button>
            <button onClick={downloadSignature} className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Download Signature PNG
            </button>
          </div>
        </div>

        <div className="h-72 bg-black/60 border-2 border-dashed border-obsidian-border rounded-xl flex items-center justify-center relative overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-full cursor-crosshair touch-none"
          />
        </div>
      </div>
    </main>
  );
}
