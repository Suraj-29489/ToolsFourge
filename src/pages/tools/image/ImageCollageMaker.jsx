import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Download, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function ImageCollageMaker() {
  const [images, setImages] = useState([]);
  const [layout, setLayout] = useState('2x2'); // '2x2' | 'columns-3' | 'side-by-side'
  const [gap, setGap] = useState(10);
  const [bgColor, setBgColor] = useState('#0f1117');

  const canvasRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const loaded = acceptedFiles.map((file) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        return { file, img };
      });
      setImages((prev) => [...prev, ...loaded]);
    },
  });

  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const totalWidth = 1200;
    const totalHeight = 800;
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    const count = images.length;
    if (count === 0) return;

    if (layout === '2x2' || count <= 4) {
      const cols = 2;
      const rows = Math.ceil(count / cols);
      const cellW = (totalWidth - gap * (cols + 1)) / cols;
      const cellH = (totalHeight - gap * (rows + 1)) / rows;

      images.forEach((item, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        const x = gap + c * (cellW + gap);
        const y = gap + r * (cellH + gap);

        if (item.img.complete) {
          drawCoverImage(ctx, item.img, x, y, cellW, cellH);
        } else {
          item.img.onload = () => drawCoverImage(ctx, item.img, x, y, cellW, cellH);
        }
      });
    } else if (layout === 'side-by-side') {
      const cellW = (totalWidth - gap * (count + 1)) / count;
      const cellH = totalHeight - gap * 2;

      images.forEach((item, idx) => {
        const x = gap + idx * (cellW + gap);
        const y = gap;
        drawCoverImage(ctx, item.img, x, y, cellW, cellH);
      });
    }
  }, [images, layout, gap, bgColor]);

  function drawCoverImage(ctx, img, x, y, w, h) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    const imgRatio = img.width / img.height;
    const cellRatio = w / h;
    let renderW, renderH, offsetX, offsetY;

    if (imgRatio > cellRatio) {
      renderH = h;
      renderW = h * imgRatio;
      offsetX = x - (renderW - w) / 2;
      offsetY = y;
    } else {
      renderW = w;
      renderH = w / imgRatio;
      offsetX = x;
      offsetY = y - (renderH - h) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    ctx.restore();
  }

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.download = `collage_${Date.now()}.png`;
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
          <LayoutGrid className="w-8 h-8 text-purple-400" />
          Image Collage Maker
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Combine multiple photos into custom grid collages directly inside your browser.
        </p>
      </div>

      {images.length === 0 ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-12 text-center cursor-pointer">
          <input {...getInputProps()} />
          <LayoutGrid className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Multiple Images</h3>
          <p className="text-xs text-obsidian-text-muted">Select 2 or more photos to compose a collage</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-obsidian-card border border-obsidian-border rounded-2xl p-4 flex items-center justify-center min-h-[380px] bg-black/40">
            <canvas ref={canvasRef} className="max-h-[480px] w-auto max-w-full object-contain rounded-lg shadow-2xl" />
          </div>

          <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-5 space-y-6">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider pb-3 border-b border-obsidian-border">Collage Options</h3>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-2">Grid Layout</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setLayout('2x2')} className={`p-2.5 rounded-xl border text-xs font-bold ${layout === '2x2' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-obsidian-secondary border-obsidian-border text-gray-300'}`}>2×2 Grid</button>
                <button onClick={() => setLayout('side-by-side')} className={`p-2.5 rounded-xl border text-xs font-bold ${layout === 'side-by-side' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-obsidian-secondary border-obsidian-border text-gray-300'}`}>Side-by-Side</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Gap Spacing ({gap}px)</label>
              <input type="range" min={0} max={30} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Background Color</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-9 rounded-lg bg-transparent cursor-pointer" />
            </div>

            {/* Images List */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-obsidian-text-muted">Images ({images.length})</span>
                <div {...getRootProps()} className="cursor-pointer text-xs text-purple-400 font-semibold hover:underline flex items-center gap-1">
                  <input {...getInputProps()} />
                  <Plus className="w-3.5 h-3.5" /> Add More
                </div>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {images.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-obsidian-secondary rounded-lg border border-obsidian-border text-xs">
                    <span className="truncate max-w-[180px] text-gray-300">{item.file.name}</span>
                    <button onClick={() => removeImage(idx)} className="text-rose-400 hover:text-rose-300 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleDownload} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Collage
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
