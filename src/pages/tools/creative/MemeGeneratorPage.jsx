import React, { useState, useRef, useEffect } from 'react';
import { Smile, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function MemeGeneratorPage() {
  const [file, setFile] = useState(null);
  const [imageObj, setImageObj] = useState(null);
  const [topText, setTopText] = useState('ONE DOES NOT SIMPLY');
  const [bottomText, setBottomText] = useState('BUILD WITHOUT DAILY TOOLS');
  const [fontSize, setFontSize] = useState(42);

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

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.max(3, fontSize / 8);
    ctx.font = `bold ${fontSize}px Impact, system-ui, sans-serif`;
    ctx.textAlign = 'center';

    // Top Text
    if (topText) {
      ctx.textBaseline = 'top';
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);
    }

    // Bottom Text
    if (bottomText) {
      ctx.textBaseline = 'bottom';
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
    }
  }, [imageObj, topText, bottomText, fontSize]);

  const downloadMeme = () => {
    if (!canvasRef.current || !file) return;
    const a = document.createElement('a');
    a.download = `meme_${Date.now()}.png`;
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
          <Smile className="w-8 h-8 text-purple-400" />
          Classic Meme Generator
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Create classic Internet memes with top and bottom text overlays locally inside your browser.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Smile className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Meme Template Image</h3>
          <p className="text-xs text-obsidian-text-muted">PNG, JPG, WEBP formats up to 25 MB</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-obsidian-card border border-obsidian-border rounded-2xl p-4 flex items-center justify-center min-h-[380px] bg-black/40">
            <canvas ref={canvasRef} className="max-h-[480px] w-auto max-w-full object-contain rounded-lg shadow-2xl" />
          </div>

          <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider pb-3 border-b border-obsidian-border">Meme Text Options</h3>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Top Text</label>
              <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl uppercase font-bold" />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Bottom Text</label>
              <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl uppercase font-bold" />
            </div>

            <div>
              <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Font Size ({fontSize}px)</label>
              <input type="range" min={20} max={90} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>

            <button onClick={downloadMeme} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Meme Image
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
