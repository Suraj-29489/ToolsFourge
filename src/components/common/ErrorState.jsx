import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorState({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 sm:p-5 mb-6 flex items-start justify-between space-x-3.5 animate-fade-in">
      <div className="flex items-start space-x-3.5">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-red-300">Operation Error</h4>
          <p className="text-xs text-red-300/80 mt-1 leading-relaxed">{error}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-xs text-red-300 hover:text-white underline ml-2"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
