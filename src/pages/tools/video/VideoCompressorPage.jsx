import React, { useState } from 'react';
import { Video, Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { processVideoWithFFmpeg } from '../../../utils/ffmpegEngine';
import { formatBytes } from '../../../utils/formatters';

export default function VideoCompressorPage() {
  const [file, setFile] = useState(null);
  const [preset, setPreset] = useState('medium'); // 'high' | 'medium' | 'low'
  const [resolution, setResolution] = useState('480p'); // '720p' | '480p' | '360p'
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

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressPct(0);
    setResult(null);

    let crf = '28';
    if (preset === 'high') crf = '23';
    if (preset === 'low') crf = '34';

    let scale = 'scale=-2:480';
    if (resolution === '720p') scale = 'scale=-2:720';
    if (resolution === '360p') scale = 'scale=-2:360';

    const args = ['-vf', scale, '-crf', crf, '-preset', 'ultrafast'];

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
      alert('Video compression failed. Please try a smaller video clip.');
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
          <Video className="w-8 h-8 text-purple-400" />
          Video Compressor (FFmpeg.wasm)
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Reduce video file size using browser WebAssembly. 100% private & offline.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Video className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Video File</h3>
          <p className="text-xs text-obsidian-text-muted">MP4, MOV, AVI, MKV, WEBM formats</p>
        </div>
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-obsidian-border">
            <div>
              <h3 className="font-bold text-white">{file.name}</h3>
              <p className="text-xs text-obsidian-text-muted">Original Size: <span className="text-purple-400 font-bold">{formatBytes(file.size)}</span></p>
            </div>
            <button onClick={() => { setFile(null); setResult(null); }} className="text-xs text-rose-400 hover:underline">Change Video</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Compression Quality</label>
              <select value={preset} onChange={(e) => setPreset(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3.5 rounded-xl">
                <option value="high">High Quality (Slight Compression)</option>
                <option value="medium">Balanced (Recommended)</option>
                <option value="low">Maximum Compression (Smaller File)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Target Resolution</label>
              <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3.5 rounded-xl">
                <option value="720p">720p HD</option>
                <option value="480p">480p Standard</option>
                <option value="360p">360p Small</option>
              </select>
            </div>
          </div>

          <button onClick={handleCompress} disabled={isProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Compress Video
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
              <div className="p-4 bg-obsidian-secondary rounded-xl flex justify-between items-center text-xs">
                <span>Compressed Size: <b className="text-emerald-400">{formatBytes(result.size)}</b></span>
                <span>Savings: <b className="text-purple-300">{Math.max(0, Math.round((1 - result.size / file.size) * 100))}%</b></span>
              </div>
              <a href={result.url} download={`compressed_${file.name}`} className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                <Download className="w-5 h-5" /> Download Compressed Video
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
