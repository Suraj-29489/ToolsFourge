import React, { useState, useEffect } from 'react';
import { RefreshCw, WifiOff, X } from 'lucide-react';

export default function PwaUpdateBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for SW updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            };
          }
        };
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full px-4 sm:px-0">
      {/* Offline Toast */}
      {isOffline && (
        <div className="bg-obsidian-card border border-rose-500/40 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs text-white">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
            <span>You are offline. Client tools continue working locally.</span>
          </div>
        </div>
      )}

      {/* SW Update Toast */}
      {showUpdate && (
        <div className="bg-obsidian-card border border-purple-500/40 p-4 rounded-2xl shadow-2xl space-y-3">
          <div className="flex items-start justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Update Available</span>
              <p className="text-obsidian-text-muted">A new version of Daily Tools is ready.</p>
            </div>
            <button onClick={() => setShowUpdate(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex gap-2">
            <button onClick={handleRefresh} className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button onClick={() => setShowUpdate(false)} className="px-4 py-2 bg-obsidian-secondary border border-obsidian-border text-gray-300 text-xs rounded-xl">
              Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
