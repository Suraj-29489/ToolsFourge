import React, { useState } from 'react';
import { Gauge, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { processVideoWithFFmpeg } from '../../../utils/ffmpegEngine';
import { formatBytes } from '../../../utils/formatters';

export default function VideoSpeedPage() {
  const [file, setFile] = useState(null);
  const [speed, setSpeed] = useState(2); // 0.5 | 1.5 | 2 | 3
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

  const handleSpeedChange = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressPct(0);

    const ptsFactor = (1 / speed).toFixed(4);
    const vf = `setpts=${ptsFactor}*PTS`;
    const af = `atempo=${speed}`;

    const args = ['-vf', vf, '-af', af, '-preset', 'ultrafast'];

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
      alert('Video speed adjustment failed.');
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
          <Gauge className="w-8 h-8 text-purple-400" />
          Video Speed Changer
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Speed up or slow down video playback locally inside your browser.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Gauge className="w-12 h-12 text-purple-400 mx-auto mb-3" />
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

          <div>
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Playback Speed Factor</label>
            <div className="grid grid-cols-4 gap-2">
              {[0.5, 1.5, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`py-3 rounded-xl border text-center font-bold text-xs ${speed === s ? 'bg-purple-600 border-purple-500 text-white' : 'bg-obsidian-secondary border-obsidian-border text-gray-300'}`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSpeedChange} disabled={isProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gauge className="w-5 h-5" />}
            Apply {speed}× Speed
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
              <a href={result.url} download={`speed_${speed}x_${file.name}`} className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                <Download className="w-5 h-5" /> Download Modified Speed Video ({formatBytes(result.size)})
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
