import React, { useState } from 'react';
import { Scissors, Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { processVideoWithFFmpeg } from '../../../utils/ffmpegEngine';
import { formatBytes } from '../../../utils/formatters';

export default function VideoTrimmerPage() {
  const [file, setFile] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setResult(null);
      }
    },
  });

  const handleTrim = async () => {
    if (!file) return;
    const duration = Math.max(0.5, endTime - startTime);
    setIsProcessing(true);
    setProgressPct(0);

    const args = ['-ss', startTime.toString(), '-t', duration.toString(), '-c', 'copy'];

    try {
      const res = await processVideoWithFFmpeg(
        file,
        args,
        'mp4',
        'video/mp4',
        (step) => setCurrentStep(step),
        (pct) => setProgressPct(pct)
      );

      setResult(res);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      alert('Video trim failed. Please check trim start and end times.');
      setIsProcessing(false);
    }
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
          <Scissors className="w-8 h-8 text-purple-400" />
          Video Trimmer (FFmpeg.wasm)
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Cut and trim video segments with precision timing directly in your browser.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Scissors className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Video File</h3>
          <p className="text-xs text-obsidian-text-muted">MP4, MOV, AVI, MKV, WEBM formats</p>
        </div>
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-obsidian-border">
            <div>
              <h3 className="font-bold text-white">{file.name}</h3>
              <p className="text-xs text-obsidian-text-muted">Size: {formatBytes(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-xs text-rose-400 hover:underline">Change Video</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Start Time (Seconds)</label>
              <input type="number" min={0} value={startTime} onChange={(e) => setStartTime(Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3.5 rounded-xl font-mono" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">End Time (Seconds)</label>
              <input type="number" min={startTime + 0.1} value={endTime} onChange={(e) => setEndTime(Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3.5 rounded-xl font-mono" />
            </div>
          </div>

          <button onClick={handleTrim} disabled={isProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
            Trim Video Clip
          </button>

          {isProcessing && (
            <div className="space-y-2 pt-2 text-center">
              <span className="text-xs text-purple-400 font-semibold">{currentStep} ({progressPct}%)</span>
              <div className="w-full h-2.5 bg-obsidian-secondary rounded-full overflow-hidden border border-obsidian-border">
                <div className="h-full bg-purple-500 transition-all duration-200" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}

          {result && (
            <div className="pt-4 text-center space-y-4 border-t border-obsidian-border">
              <a href={result.url} download={`trimmed_${file.name}`} className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                <Download className="w-5 h-5" /> Download Trimmed Clip ({formatBytes(result.size)})
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
