import React, { useState, useRef, useEffect } from 'react';
import { UserCheck, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AvatarGeneratorPage() {
  const [initials, setInitials] = useState('DT');
  const [bgColor1, setBgColor1] = useState('#8b5cf6');
  const [bgColor2, setBgColor2] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [shape, setShape] = useState('circle'); // 'circle' | 'square' | 'rounded'

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;

    ctx.clearRect(0, 0, 400, 400);

    // Draw Background
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, bgColor1);
    gradient.addColorStop(1, bgColor2);
    ctx.fillStyle = gradient;

    ctx.beginPath();
    if (shape === 'circle') {
      ctx.arc(200, 200, 200, 0, Math.PI * 2);
    } else if (shape === 'rounded') {
      ctx.roundRect(0, 0, 400, 400, 60);
    } else {
      ctx.rect(0, 0, 400, 400);
    }
    ctx.fill();

    // Draw Initials
    ctx.fillStyle = textColor;
    ctx.font = 'bold 160px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials.toUpperCase().slice(0, 3), 200, 200);
  }, [initials, bgColor1, bgColor2, textColor, shape]);

  const downloadAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `avatar_${initials.toLowerCase()}_${Date.now()}.png`;
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
          <UserCheck className="w-8 h-8 text-purple-400" />
          Avatar Initial Badge Generator
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Create custom profile initials avatars with gradient backgrounds & vector shapes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-obsidian-card border border-obsidian-border rounded-2xl p-6">
        <div className="flex justify-center p-6 bg-obsidian-secondary rounded-xl border border-obsidian-border">
          <canvas ref={canvasRef} className="w-48 h-48 drop-shadow-2xl" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Initials / Letters</label>
            <input type="text" maxLength={3} value={initials} onChange={(e) => setInitials(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl uppercase font-extrabold" />
          </div>

          <div>
            <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Avatar Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {['circle', 'rounded', 'square'].map((s) => (
                <button key={s} onClick={() => setShape(s)} className={`py-2 rounded-xl border text-xs font-bold capitalize ${shape === s ? 'bg-purple-600 border-purple-500 text-white' : 'bg-obsidian-secondary border-obsidian-border text-gray-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-[10px] text-obsidian-text-muted block">Gradient 1</label><input type="color" value={bgColor1} onChange={(e) => setBgColor1(e.target.value)} className="w-full h-8 rounded-lg bg-transparent cursor-pointer" /></div>
            <div><label className="text-[10px] text-obsidian-text-muted block">Gradient 2</label><input type="color" value={bgColor2} onChange={(e) => setBgColor2(e.target.value)} className="w-full h-8 rounded-lg bg-transparent cursor-pointer" /></div>
            <div><label className="text-[10px] text-obsidian-text-muted block">Text Color</label><input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-8 rounded-lg bg-transparent cursor-pointer" /></div>
          </div>

          <button onClick={downloadAvatar} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Avatar PNG
          </button>
        </div>
      </div>
    </main>
  );
}
