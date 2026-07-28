import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import ToolHeader from '../../../components/common/ToolHeader';
import { useDownload } from '../../../hooks/useDownload';
import { QrCode, Download, Copy, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export default function QrGenerator() {
  const [text, setText] = useState('https://toolsfourge.com');
  const [size, setSize] = useState(300);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrSvgString, setQrSvgString] = useState('');
  const canvasRef = useRef(null);

  const { downloadDataUrl, downloadText } = useDownload();
  const { copied, copyToClipboard } = useClipboard();

  useEffect(() => {
    if (!text.trim()) {
      setQrDataUrl('');
      setQrSvgString('');
      return;
    }

    // Generate PNG Data URL
    QRCode.toDataURL(text, { width: size, margin: 2, color: { dark: color, light: bgColor } })
      .then(setQrDataUrl)
      .catch(console.error);

    // Generate SVG string
    QRCode.toString(text, { type: 'svg', width: size, margin: 2, color: { dark: color, light: bgColor } })
      .then(setQrSvgString)
      .catch(console.error);
  }, [text, size, color, bgColor]);

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="QR Code Generator"
        description="Create customized high-resolution QR codes for websites, WiFi, and text with PNG and SVG export."
        icon={QrCode}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Options Form */}
        <div className="md:col-span-7 bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <label className="text-xs font-bold text-obsidian-text block mb-1">QR Content (URL or Text)</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter website link or text content..."
              className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl px-4 py-3 text-sm text-obsidian-text focus:border-obsidian-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-obsidian-text-muted block mb-1">Dimension ({size}px)</label>
              <select
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl px-3 py-2 text-xs text-obsidian-text focus:outline-none"
              >
                <option value={200}>200 × 200 px</option>
                <option value={300}>300 × 300 px</option>
                <option value={500}>500 × 500 px</option>
                <option value={800}>800 × 800 px (HD)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-obsidian-text-muted block mb-1">Foreground</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-9 bg-obsidian-secondary border border-obsidian-border rounded-xl cursor-pointer p-0.5"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-obsidian-text-muted block mb-1">Background</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-9 bg-obsidian-secondary border border-obsidian-border rounded-xl cursor-pointer p-0.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right QR Preview & Download */}
        <div className="md:col-span-5 bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
          {qrDataUrl ? (
            <div className="w-full flex flex-col items-center">
              <div className="p-4 bg-white rounded-2xl border border-obsidian-border shadow-lg mb-6">
                <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 object-contain" />
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => downloadDataUrl(qrDataUrl, 'qrcode.png')}
                  className="py-2.5 px-3 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
                <button
                  onClick={() => downloadText(qrSvgString, 'qrcode.svg', 'image/svg+xml')}
                  className="py-2.5 px-3 rounded-xl bg-obsidian-secondary hover:bg-obsidian-accent hover:text-white border border-obsidian-border text-obsidian-text font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-obsidian-text-muted py-8">
              <QrCode className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Enter text or URL to generate QR code</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
