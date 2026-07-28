import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Video,
  Clipboard,
  Search,
  Loader2,
  AlertCircle,
  Download,
  Clock,
  User,
  CheckCircle2,
  Film,
  Music,
  Share2,
  Radio
} from 'lucide-react';

/**
 * Safely extracts a plain string message from any error or API response object.
 * NEVER returns an object. Guarantees string output for React rendering.
 */
function extractErrorMessage(input) {
  if (!input) {
    return 'Something went wrong while analyzing the video.';
  }

  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof Error) {
    return input.message || 'Something went wrong while analyzing the video.';
  }

  if (typeof input === 'object') {
    // Check input.error.message schema
    if (input.error && typeof input.error === 'object' && typeof input.error.message === 'string') {
      return input.error.message;
    }

    // Check input.error string schema
    if (typeof input.error === 'string') {
      return input.error;
    }

    // Check input.message string schema
    if (typeof input.message === 'string') {
      return input.message;
    }
  }

  return 'Something went wrong while analyzing the video.';
}

export default function VideoDownloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ALWAYS a string or null
  const [videoData, setVideoData] = useState(null);
  const [downloadingFormatId, setDownloadingFormatId] = useState(null);

  // Platform Support Badges
  const platforms = [
    { name: 'YouTube & Shorts', color: '#ff0000', icon: Film },
    { name: 'YouTube Live', color: '#ff4e45', icon: Radio },
    { name: 'Instagram', color: '#e1306c', icon: Share2 },
    { name: 'TikTok', color: '#00f2fe', icon: Video },
    { name: 'Facebook', color: '#1877f2', icon: Film },
    { name: 'X (Twitter)', color: '#1da1f2', icon: Share2 },
  ];

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setError(null);
      }
    } catch (err) {
      console.error('[Clipboard Access Error]:', err);
    }
  };

  // Analyze Video URL
  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();

    if (!url || !url.trim()) {
      setError('Please enter or paste a video URL first.');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoData(null);

    try {
      const response = await fetch('/api/video/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      // Verify JSON Content-Type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('The server returned an unexpected response.');
      }

      const result = await response.json();

      // Console logging requirement (Task 5)
      console.log('[Frontend API Analyze Response]:', result);

      if (!response.ok || !result.success) {
        const errorMsg = extractErrorMessage(result);
        throw new Error(errorMsg);
      }

      if (!result.data || typeof result.data !== 'object') {
        throw new Error('Something went wrong while analyzing the video.');
      }

      setVideoData(result.data);
    } catch (err) {
      console.error('[Frontend Analysis Exception]:', err);
      const safeMsg = extractErrorMessage(err);
      setError(safeMsg);
    } finally {
      setLoading(false);
    }
  };

  // Initiate Download Stream
  const handleDownload = (format) => {
    if (!videoData || !url) return;

    setDownloadingFormatId(format.formatId);

    const downloadUrl = `/api/video/download?url=${encodeURIComponent(
      url
    )}&formatId=${encodeURIComponent(format.formatId)}&title=${encodeURIComponent(
      videoData.title
    )}`;

    window.location.href = downloadUrl;

    setTimeout(() => {
      setDownloadingFormatId(null);
    }, 3500);
  };

  return (
    <main className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb Navigation */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm text-obsidian-text-muted hover:text-obsidian-accent transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Utilities</span>
        </Link>
      </div>

      {/* Main Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-obsidian-accent/10 text-obsidian-accent border border-obsidian-accent/20 mb-3 shadow-sm">
          <Video className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-obsidian-text tracking-tight">
          Video Downloader
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted mt-2 max-w-xl mx-auto">
          Fast metadata extraction and high-speed MP4 & MP3 downloads for YouTube, Shorts, Live streams, and major platforms.
        </p>

        {/* Platform Support Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {platforms.map((p) => (
            <span
              key={p.name}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-obsidian-card border border-obsidian-border text-obsidian-text-muted"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span>{p.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Large Input Bar */}
      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-4 sm:p-6 shadow-xl mb-8">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video link (YouTube, Shorts, Live, Instagram, TikTok...)"
              className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl px-4 py-3.5 pr-24 text-sm text-obsidian-text placeholder-obsidian-text-muted/60 focus:outline-none focus:border-obsidian-accent focus:ring-1 focus:ring-obsidian-accent transition-all duration-200"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-obsidian-card border border-obsidian-border text-xs text-obsidian-text-muted hover:text-obsidian-text hover:border-obsidian-accent/40 flex items-center space-x-1 transition-all duration-200"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-obsidian-accent/20 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analyze Video</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error State Banner (Guaranteed string rendering) */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 sm:p-5 mb-8 flex items-start space-x-3.5 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-300">Analysis Error</h4>
            <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
              {typeof error === 'string' ? error : 'Something went wrong while analyzing the video.'}
            </p>
          </div>
        </div>
      )}

      {/* Loading Skeleton State */}
      {loading && (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-8 text-center animate-pulse mb-8">
          <Loader2 className="w-10 h-10 text-obsidian-accent animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-obsidian-text">
            Extracting video metadata & streaming options...
          </p>
          <p className="text-xs text-obsidian-text-muted mt-1">
            Communicating with backend server via JSON API.
          </p>
        </div>
      )}

      {/* Analyzed Metadata & Download Cards */}
      {videoData && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Video Information Banner */}
          <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 shadow-xl">
            {/* Thumbnail */}
            <div className="relative w-full md:w-72 h-44 rounded-xl overflow-hidden bg-obsidian-secondary border border-obsidian-border flex-shrink-0">
              {videoData.thumbnail ? (
                <img
                  src={videoData.thumbnail}
                  alt={videoData.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-obsidian-text-muted">
                  <Film className="w-10 h-10 opacity-40" />
                </div>
              )}

              {/* Duration / LIVE Badge */}
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/80 backdrop-blur text-[11px] font-mono font-medium text-white flex items-center space-x-1">
                {videoData.isLive ? (
                  <>
                    <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                    <span className="text-red-400 font-bold">LIVE STREAM</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-obsidian-accent" />
                    <span>{videoData.durationFormatted}</span>
                  </>
                )}
              </div>

              {/* Platform Tag */}
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-obsidian-accent/90 text-[10px] font-bold text-white shadow">
                {videoData.platform}
              </div>
            </div>

            {/* Video Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-obsidian-text leading-snug line-clamp-2">
                  {videoData.title}
                </h3>
                <div className="flex items-center space-x-4 mt-3 text-xs text-obsidian-text-muted">
                  <span className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-obsidian-accent" />
                    <span className="truncate max-w-[200px]">{videoData.uploader}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>JSON Metadata Verified</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-obsidian-border/60 text-xs text-obsidian-text-muted">
                Select your desired video resolution or audio MP3 stream below to start download.
              </div>
            </div>
          </div>

          {/* Download Quality Options */}
          <div>
            <h4 className="text-base font-bold text-obsidian-text mb-4 flex items-center space-x-2">
              <Download className="w-4 h-4 text-obsidian-accent" />
              <span>Download Options</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {videoData.formats.map((fmt, idx) => {
                const isAudio = fmt.type === 'audio';
                const isDownloading = downloadingFormatId === fmt.formatId;

                return (
                  <div
                    key={idx}
                    className="group bg-obsidian-card border border-obsidian-border hover:border-obsidian-accent/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-xl bg-obsidian-secondary border border-obsidian-border text-obsidian-accent">
                          {isAudio ? <Music className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-obsidian-secondary text-obsidian-text-muted border border-obsidian-border uppercase">
                          {fmt.ext}
                        </span>
                      </div>

                      <h5 className="text-base font-bold text-obsidian-text group-hover:text-white transition-colors">
                        {fmt.quality}
                      </h5>

                      <p className="text-xs text-obsidian-text-muted mt-1">
                        Est. Size: <span className="text-obsidian-text font-medium">{fmt.filesize}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownload(fmt)}
                      disabled={isDownloading}
                      className="mt-5 w-full py-2.5 px-4 rounded-xl bg-obsidian-secondary hover:bg-obsidian-accent hover:text-white border border-obsidian-border hover:border-obsidian-accent text-obsidian-text font-semibold text-xs flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Preparing...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download {isAudio ? 'Audio' : 'Video'}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
