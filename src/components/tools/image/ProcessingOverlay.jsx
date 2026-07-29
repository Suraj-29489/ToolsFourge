import React from 'react';
import { Loader2, Sparkles, Cpu } from 'lucide-react';

export default function ProcessingOverlay({ isProcessing, progressPct, currentStep }) {
  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-obsidian-card border border-obsidian-border rounded-3xl p-8 shadow-2xl text-center space-y-6">
        
        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/30 rounded-3xl flex items-center justify-center text-purple-400">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
          <div className="absolute -top-1 -right-1 p-2 bg-purple-600 text-white rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            AI Image Upscaling in Progress
          </h3>
          <p className="text-xs sm:text-sm font-medium text-purple-400 min-h-[20px]">
            {currentStep || 'Processing local neural network inference...'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-obsidian-text-muted uppercase tracking-wider">Progress</span>
            <span className="text-purple-300 font-mono text-sm">{progressPct}%</span>
          </div>

          <div className="w-full h-3 bg-obsidian-secondary rounded-full overflow-hidden border border-obsidian-border p-0.5">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 rounded-full transition-all duration-300 shadow-md shadow-purple-500/50"
              style={{ width: `${Math.max(5, progressPct)}%` }}
            />
          </div>
        </div>

        {/* Local Processing Notice */}
        <div className="p-3 bg-obsidian-secondary rounded-xl border border-obsidian-border/60 text-xs text-obsidian-text-muted leading-relaxed">
          Running 100% locally in your browser. No images are uploaded to external servers.
        </div>
      </div>
    </div>
  );
}
