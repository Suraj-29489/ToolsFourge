import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { formatTime } from '../../../utils/formatters';

export default function ThumbnailGeneratorPage() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        setFile(f);
        setVideoUrl(URL.createObjectURL(f));
      }
    },
  });

  const captureFrame = (format = 'image/png') => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    const dataUrl = canvas.toDataURL(format);
    const a = document.createElement('a');
    a.download = `thumbnail_${file ? file.name.split('.')[0] : 'video'}_${Math.round(currentTime)}s.${ext}`;
    a.href = dataUrl;
    a.click();
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
          <Camera className="w-8 h-8 text-purple-400" />
          Video Thumbnail Generator
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Scrub to any frame in your video and capture high-resolution thumbnail images.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Camera className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Video File</h3>
          <p className="text-xs text-obsidian-text-muted">MP4, MOV, AVI, MKV, WEBM formats</p>
        </div>
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-obsidian-border flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 bg-obsidian-secondary border border-obsidian-border rounded-xl">
            <span className="text-xs text-obsidian-text-muted">Current Frame: <b className="text-purple-400 font-mono text-sm">{formatTime(currentTime)}</b></span>
            <div className="flex gap-2">
              <button onClick={() => captureFrame('image/png')} className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> Capture PNG
              </button>
              <button onClick={() => captureFrame('image/jpeg')} className="px-4 py-2.5 bg-obsidian-card hover:bg-gray-800 border border-obsidian-border text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Capture JPG
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
