import React, { useState } from 'react';
import { Sparkles, Copy, ArrowLeft, Check, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CssGenerators() {
  const [tab, setTab] = useState('shadow'); // 'shadow' | 'gradient' | 'radius' | 'glass'
  const [copied, setCopied] = useState(false);

  // Box Shadow state
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState('#8b5cf6');

  // Gradient state
  const [color1, setColor1] = useState('#8b5cf6');
  const [color2, setColor2] = useState('#3b82f6');
  const [angle, setAngle] = useState(135);

  // Border Radius state
  const [radius, setRadius] = useState(16);

  const getCssCode = () => {
    if (tab === 'shadow') {
      return `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};`;
    }
    if (tab === 'gradient') {
      return `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;
    }
    if (tab === 'radius') {
      return `border-radius: ${radius}px;`;
    }
    return `background: rgba(255, 255, 255, 0.05);\nbackdrop-filter: blur(12px);\nborder: 1px solid rgba(255, 255, 255, 0.1);`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCssCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Sparkles className="w-8 h-8 text-purple-400" />
          CSS Generators (Shadow, Gradient & Glass)
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Visually design and generate production-ready CSS code snippets.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div className="flex justify-center gap-2 flex-wrap">
          {['shadow', 'gradient', 'radius', 'glass'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase ${tab === t ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}
            >
              {t} Generator
            </button>
          ))}
        </div>

        {/* Live Preview Box */}
        <div className="h-56 bg-obsidian-secondary border border-obsidian-border rounded-2xl flex items-center justify-center p-6">
          <div
            className="w-48 h-32 flex items-center justify-center text-xs font-bold text-white transition-all duration-200"
            style={
              tab === 'shadow'
                ? { boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${color}`, backgroundColor: '#181c24', borderRadius: '16px' }
                : tab === 'gradient'
                ? { background: `linear-gradient(${angle}deg, ${color1}, ${color2})`, borderRadius: '16px' }
                : tab === 'radius'
                ? { borderRadius: `${radius}px`, backgroundColor: '#8b5cf6' }
                : { background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }
            }
          >
            Preview Element
          </div>
        </div>

        {/* Controls */}
        {tab === 'shadow' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className="text-xs text-obsidian-text-muted block">X Offset ({x}px)</label><input type="range" min={-50} max={50} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <div><label className="text-xs text-obsidian-text-muted block">Y Offset ({y}px)</label><input type="range" min={-50} max={50} value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <div><label className="text-xs text-obsidian-text-muted block">Blur ({blur}px)</label><input type="range" min={0} max={100} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-purple-500" /></div>
            <div><label className="text-xs text-obsidian-text-muted block">Spread ({spread}px)</label><input type="range" min={-20} max={50} value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          </div>
        )}

        {tab === 'gradient' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="text-xs text-obsidian-text-muted block mb-1">Color 1</label><input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" /></div>
            <div><label className="text-xs text-obsidian-text-muted block mb-1">Color 2</label><input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer bg-transparent" /></div>
            <div><label className="text-xs text-obsidian-text-muted block mb-1">Angle ({angle}°)</label><input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-purple-500" /></div>
          </div>
        )}

        {tab === 'radius' && (
          <div>
            <label className="text-xs text-obsidian-text-muted block mb-1">Border Radius ({radius}px)</label>
            <input type="range" min={0} max={60} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
        )}

        {/* Generated Code Output */}
        <div className="bg-obsidian-secondary border border-obsidian-border p-4 rounded-xl flex items-center justify-between">
          <code className="text-xs font-mono text-purple-300">{getCssCode()}</code>
          <button onClick={copyCode} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy CSS'}
          </button>
        </div>
      </div>
    </main>
  );
}
