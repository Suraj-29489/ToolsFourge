import React, { useState } from 'react';
import { RefreshCw, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { processVideoWithFFmpeg } from '../../../utils/ffmpegEngine';
import { formatBytes } from '../../../utils/formatters';

export default function ConvertVideoPage() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('webm'); // 'mp4' | 'webm' | 'avi' | 'mov'
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

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressPct(0);

    const mimeMap = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
    };

    const args = targetFormat === 'webm' ? ['-c:v', 'libvpx', '-c:a', 'libvorbis'] : ['-preset', 'ultrafast'];

    try {
      const res = await processVideoWithFFmpeg(
        file,
        args,
        targetFormat,
        mimeMap[targetFormat] || 'video/mp4',
        (step) => setCurrentStep(step),
        (pct) => setProgressPct(pct)
      );

      setResult(res);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      alert('Video conversion failed.');
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
          <RefreshCw className="w-8 h-8 text-purple-400" />
          Video Format Converter (MP4 ↔ WEBM ↔ AVI)
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Convert video formats locally inside your browser without uploading files.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <RefreshCw className="w-12 h-12 text-purple-400 mx-auto mb-3" />
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
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Target Format</label>
            <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3.5 rounded-xl uppercase font-bold">
              <option value="webm">WEBM Video</option>
              <option value="mp4">MP4 Video</option>
              <option value="mov">MOV Video</option>
              <option value="avi">AVI Video</option>
            </select>
          </div>

          <button onClick={handleConvert} disabled={isProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            Convert Video Format
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
              <a href={result.url} download={`${file.name.split('.')[0]}.${targetFormat}`} className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                <Download className="w-5 h-5" /> Download {targetFormat.toUpperCase()} Video ({formatBytes(result.size)})
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
