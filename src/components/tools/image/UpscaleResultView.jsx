import React, { useState } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { Download, RefreshCw, Sparkles, HardDrive, Monitor, CheckCircle2, ZoomIn, X } from 'lucide-react';
import { formatBytes } from '../../../utils/formatters';

export default function UpscaleResultView({ result, originalMetadata, settings, onReset }) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!result || !originalMetadata) return null;

  const { url: upscaledUrl, width: upscaledW, height: upscaledH, size: upscaledSize, modeUsed } = result;
  const originalDimensions = `${originalMetadata.width} × ${originalMetadata.height} px`;
  const upscaledDimensions = `${upscaledW} × ${upscaledH} px`;

  const handleDownload = (format = 'png') => {
    const a = document.createElement('a');
    const nameWithoutExt = originalMetadata.name.substring(0, originalMetadata.name.lastIndexOf('.')) || 'image';
    a.download = `${nameWithoutExt}_upscaled_${settings.scale}x.${format}`;

    if (format === 'jpeg' || format === 'jpg') {
      // Draw onto canvas to convert PNG blob to JPG
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = upscaledW;
        canvas.height = upscaledH;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, upscaledW, upscaledH);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((jpgBlob) => {
          const jpgUrl = URL.createObjectURL(jpgBlob);
          a.href = jpgUrl;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(jpgUrl);
        }, 'image/jpeg', 0.92);
      };
      img.src = upscaledUrl;
    } else {
      a.href = upscaledUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="w-full bg-obsidian-card border border-obsidian-border rounded-3xl p-5 sm:p-8 shadow-2xl animate-fade-in space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-border/60">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Upscaling Complete! ({settings.scale}×)
            </h3>
            <p className="text-xs text-obsidian-text-muted">Processed with {modeUsed || 'Neural AI'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsZoomOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-obsidian-text hover:text-white bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border rounded-xl transition-all hover:scale-105 active:scale-95 min-h-[44px]"
          >
            <ZoomIn className="w-4 h-4 text-purple-400" />
            Zoom Preview
          </button>
          <button
            onClick={onReset}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-obsidian-text hover:text-white bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border rounded-xl transition-all hover:scale-105 active:scale-95 min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            Upscale Another
          </button>
        </div>
      </div>

      {/* Interactive Split Comparison Slider */}
      <BeforeAfterSlider
        originalUrl={originalMetadata.objectUrl}
        upscaledUrl={upscaledUrl}
        originalDimensions={originalDimensions}
        upscaledDimensions={upscaledDimensions}
      />

      {/* Metadata Comparison Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-obsidian-secondary p-3.5 rounded-xl border border-obsidian-border/60 flex items-center gap-3">
          <Monitor className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <span className="block text-[10px] font-medium uppercase text-obsidian-text-muted">Original Res</span>
            <span className="text-xs sm:text-sm font-bold text-white">{originalDimensions}</span>
          </div>
        </div>

        <div className="bg-obsidian-secondary p-3.5 rounded-xl border border-obsidian-border/60 flex items-center gap-3">
          <Monitor className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="block text-[10px] font-medium uppercase text-obsidian-text-muted">Upscaled Res</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-300">{upscaledDimensions}</span>
          </div>
        </div>

        <div className="bg-obsidian-secondary p-3.5 rounded-xl border border-obsidian-border/60 flex items-center gap-3">
          <HardDrive className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <span className="block text-[10px] font-medium uppercase text-obsidian-text-muted">Original Size</span>
            <span className="text-xs sm:text-sm font-bold text-white">{formatBytes(originalMetadata.size)}</span>
          </div>
        </div>

        <div className="bg-obsidian-secondary p-3.5 rounded-xl border border-obsidian-border/60 flex items-center gap-3">
          <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="block text-[10px] font-medium uppercase text-obsidian-text-muted">Upscaled Size</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-300">{formatBytes(upscaledSize)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={() => handleDownload('png')}
          className="w-full sm:flex-1 min-h-[48px] py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold rounded-2xl shadow-xl shadow-purple-600/30 hover:shadow-purple-500/50 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-95"
        >
          <Download className="w-5 h-5" />
          Download PNG
        </button>

        <button
          onClick={() => handleDownload('jpg')}
          className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-obsidian-text hover:text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-purple-400" />
          Download JPG
        </button>
      </div>

      {/* Fullscreen Zoom Preview Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-obsidian-card border border-obsidian-border rounded-3xl p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-obsidian-border">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-purple-400" />
                Full Resolution Zoom Preview ({upscaledDimensions})
              </h4>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-2 text-obsidian-text-muted hover:text-white rounded-xl hover:bg-obsidian-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto max-h-[75vh] flex items-center justify-center bg-black/60 rounded-2xl p-4">
              <img
                src={upscaledUrl}
                alt="Full Upscaled Preview"
                className="max-w-none w-auto h-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
