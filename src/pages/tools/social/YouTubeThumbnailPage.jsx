import React, { useState } from 'react';
import { Youtube, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function YouTubeThumbnailPage() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ');

  const extractVideoId = (inputUrl) => {
    setUrl(inputUrl);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = inputUrl.match(regExp);
    if (match && match[2].length === 11) {
      setVideoId(match[2]);
    }
  };

  const thumbnails = [
    { label: 'HD 1080p (Max Resolution)', key: 'maxresdefault', quality: '1920 × 1080' },
    { label: 'SD 480p (Standard Definition)', key: 'sddefault', quality: '640 × 480' },
    { label: 'HQ 360p (High Quality)', key: 'hqdefault', quality: '480 × 360' },
    { label: 'MQ 180p (Medium Quality)', key: 'mqdefault', quality: '320 × 180' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Youtube className="w-8 h-8 text-rose-500" />
          YouTube Thumbnail Grabber
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Extract and download full-resolution YouTube video thumbnail cover images.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Paste YouTube Video Link</label>
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => extractVideoId(e.target.value)}
            className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-4 rounded-xl outline-none"
          />
        </div>

        {videoId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-obsidian-border">
            {thumbnails.map((t) => {
              const imgUrl = `https://img.youtube.com/vi/${videoId}/${t.key}.jpg`;
              return (
                <div key={t.key} className="bg-obsidian-secondary border border-obsidian-border rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{t.label}</span>
                      <span className="text-purple-400 font-mono font-bold">{t.quality}</span>
                    </div>
                    <div className="aspect-video bg-black/60 rounded-lg overflow-hidden border border-obsidian-border flex items-center justify-center">
                      <img src={imgUrl} alt={t.label} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <a
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={`yt_thumbnail_${videoId}_${t.key}.jpg`}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download {t.key.toUpperCase()}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
