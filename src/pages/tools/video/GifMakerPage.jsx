import React, { useState } from 'react';
import { Film, Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { processVideoWithFFmpeg } from '../../../utils/ffmpegEngine';
import { formatBytes } from '../../../utils/formatters';

export default function GifMakerPage() {
  const [file, setFile] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [fps, setFps] = useState(15);
  const [resolution, setResolution] = useState('480p');
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

  const handleGenerateGif = async () => {
    if (!file) return;
    const duration = Math.max(0.5, endTime - startTime);
    setIsProcessing(true);
    setProgressPct(0);

    let scale = 'scale=-2:480';
    if (resolution === '720p') scale = 'scale=-2:720';
    if (resolution === '360p') scale = 'scale=-2:360';

    const filtergraph = `[0:v] fps=${fps},${scale},palettegen=max_colors=256:stats_mode=full [p]; [0:v][p] paletteuse=dither=sierra2_4a`;

    const args = ['-ss', startTime.toString(), '-t', duration.toString(), '-vf', filtergraph, '-loop', '0'];

    try {
      const res = await processVideoWithFFmpeg(
        file,
        args,
        'gif',
        'image/gif',
        (step) => setCurrentStep(step),
        (pct) => setProgressPct(pct)
      );

      setResult(res);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      alert('GIF generation failed.');
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
          <Film className="w-8 h-8 text-purple-400" />
          Video to GIF Maker (FFmpeg.wasm)
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Convert short video clips into high-quality animated GIFs directly in your browser.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Film className="w-12 h-12 text-purple-400 mx-auto mb-3" />
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">FPS ({fps})</label>
              <select value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl">
                <option value={10}>10 FPS</option>
                <option value={15}>15 FPS (Recommended)</option>
                <option value={20}>20 FPS</option>
                <option value={25}>25 FPS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Resolution</label>
              <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl">
                <option value="720p">720p HD</option>
                <option value="480p">480p Standard</option>
                <option value="360p">360p Small</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Duration (Seconds)</label>
              <input type="number" min={1} max={30} value={endTime - startTime} onChange={(e) => setEndTime(startTime + Number(e.target.value))} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl" />
            </div>
          </div>

          <button onClick={handleGenerateGif} disabled={isProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate Animated GIF
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
              <div className="relative max-h-64 bg-black rounded-xl overflow-hidden inline-block p-2 border border-obsidian-border">
                <img src={result.url} alt="GIF Preview" className="max-h-56 w-auto rounded object-contain" />
              </div>
              <div>
                <a href={result.url} download={`${file.name.split('.')[0]}.gif`} className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                  <Download className="w-5 h-5" /> Download GIF ({formatBytes(result.size)})
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
