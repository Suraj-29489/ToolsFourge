import React, { useState } from 'react';
import { RotateCcw, Download, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { formatBytes } from '../../../utils/formatters';

export default function ReverseAudioPage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reversedUrl, setReversedUrl] = useState(null);
  const [resultBlob, setResultBlob] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'audio/*': ['.mp3', '.wav', '.aac', '.m4a', '.flac', '.ogg'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setReversedUrl(null);
        setResultBlob(null);
      }
    },
  });

  const handleReverseAudio = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedData = await audioCtx.decodeAudioData(arrayBuffer);

      // Reverse PCM channels
      for (let i = 0; i < decodedData.numberOfChannels; i++) {
        Array.prototype.reverse.call(decodedData.getChannelData(i));
      }

      // Convert AudioBuffer to WAV Blob
      const wavBlob = audioBufferToWav(decodedData);
      const url = URL.createObjectURL(wavBlob);

      setResultBlob(wavBlob);
      setReversedUrl(url);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      alert('Audio reversal failed.');
      setIsProcessing(false);
    }
  };

  // Helper to convert AudioBuffer to WAV format Blob
  function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    let channels = [], sampleRate = buffer.sampleRate, offset = 0, pos = 0;

    function setUint16(data) { out.setUint16(pos, data, true); pos += 2; }
    function setUint32(data) { out.setUint32(pos, data, true); pos += 4; }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));

    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out], { type: 'audio/wav' });
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <RotateCcw className="w-8 h-8 text-purple-400" />
          Reverse Audio
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Play audio files backward by reversing PCM sample buffers in-memory.
        </p>
      </div>

      {!file ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <RotateCcw className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Audio File</h3>
          <p className="text-xs text-obsidian-text-muted">MP3, WAV, AAC, FLAC, OGG formats</p>
        </div>
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-obsidian-border">
            <div>
              <h3 className="font-bold text-white">{file.name}</h3>
              <p className="text-xs text-obsidian-text-muted">Size: {formatBytes(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setReversedUrl(null); }} className="text-xs text-rose-400 hover:underline">Change File</button>
          </div>

          <button onClick={handleReverseAudio} disabled={isProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" />}
            Reverse Audio Track
          </button>

          {reversedUrl && (
            <div className="pt-4 text-center space-y-4 border-t border-obsidian-border">
              <audio src={reversedUrl} controls className="w-full max-w-md mx-auto" />
              <div>
                <a href={reversedUrl} download={`reversed_${file.name.split('.')[0]}.wav`} className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl">
                  <Download className="w-5 h-5" /> Download Reversed WAV ({formatBytes(resultBlob?.size || 0)})
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
