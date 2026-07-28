import React from 'react';

export default function ProgressBar({ progress = 0, statusMessage = 'Processing...' }) {
  return (
    <div className="w-full bg-obsidian-card border border-obsidian-border rounded-2xl p-5 shadow-xl animate-fade-in my-6">
      <div className="flex items-center justify-between text-xs font-semibold mb-2">
        <span className="text-obsidian-text">{statusMessage}</span>
        <span className="text-obsidian-accent font-mono">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2.5 bg-obsidian-secondary rounded-full overflow-hidden border border-obsidian-border/50">
        <div
          className="h-full bg-gradient-to-r from-obsidian-accent to-purple-400 rounded-full transition-all duration-200"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
