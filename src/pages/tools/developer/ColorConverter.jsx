import React, { useState } from 'react';
import { Palette, Copy, ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ColorConverter() {
  const [hex, setHex] = useState('#8b5cf6');
  const [copied, setCopied] = useState('');

  const hexToRgb = (hexStr) => {
    let cleaned = hexStr.replace('#', '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map((c) => c + c).join('');
    }
    if (cleaned.length !== 6) return null;
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgbObj = hexToRgb(hex);
  const hslObj = rgbObj ? rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b) : null;

  const rgbStr = rgbObj ? `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})` : 'Invalid HEX';
  const hslStr = hslObj ? `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)` : 'Invalid HEX';

  const copyVal = (val, key) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
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
          <Palette className="w-8 h-8 text-purple-400" />
          HEX ↔ RGB ↔ HSL Color Converter
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Convert color codes between HEX, RGB, and HSL formats with instant preview.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={hex.startsWith('#') && hex.length === 7 ? hex : '#8b5cf6'}
            onChange={(e) => setHex(e.target.value)}
            className="w-16 h-16 rounded-xl cursor-pointer bg-transparent border-0"
          />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-1">HEX Code</label>
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl font-mono uppercase"
            />
          </div>
        </div>

        {/* Color Output Rows */}
        <div className="space-y-3 pt-2">
          <div className="bg-obsidian-secondary p-4 rounded-xl border border-obsidian-border flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-obsidian-text-muted">RGB Format</span>
              <span className="text-sm font-mono text-white font-bold">{rgbStr}</span>
            </div>
            <button onClick={() => copyVal(rgbStr, 'rgb')} className="px-3 py-1.5 bg-obsidian-card hover:bg-gray-800 text-xs font-bold text-white rounded-lg flex items-center gap-1">
              {copied === 'rgb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'rgb' ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="bg-obsidian-secondary p-4 rounded-xl border border-obsidian-border flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-obsidian-text-muted">HSL Format</span>
              <span className="text-sm font-mono text-purple-300 font-bold">{hslStr}</span>
            </div>
            <button onClick={() => copyVal(hslStr, 'hsl')} className="px-3 py-1.5 bg-obsidian-card hover:bg-gray-800 text-xs font-bold text-white rounded-lg flex items-center gap-1">
              {copied === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'hsl' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
