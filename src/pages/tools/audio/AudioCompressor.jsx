import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { FileArchive, Download, Music } from 'lucide-react';

export default function AudioCompressor() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: 'audio/*', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [sampleRateRatio, setSampleRateRatio] = useState(0.5); // 50% resample

  const handleCompress = async () => {
    if (files.length === 0) return;
    startProcessing('Compressing audio file...');

    try {
      updateProgress(30, 'Decoding audio track...');
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      updateProgress(60, 'Resampling and compressing bitrates...');
      const origSampleRate = decodedBuffer.sampleRate;
      const newSampleRate = Math.round(origSampleRate * sampleRateRatio);
      const offlineCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
        decodedBuffer.numberOfChannels,
        Math.floor(decodedBuffer.duration * newSampleRate),
        newSampleRate
      );

      const bufferSource = offlineCtx.createBufferSource();
      bufferSource.buffer = decodedBuffer;
      bufferSource.connect(offlineCtx.destination);
      bufferSource.start(0);

      const compressedBuffer = await offlineCtx.startRendering();

      updateProgress(90, 'Encoding compressed audio file...');
      const wavBlob = audioBufferToWav(compressedBuffer);
      updateProgress(100, 'Done!');
      downloadBlob(wavBlob, `compressed_${file.name.replace(/\.[^/.]+$/, '')}.wav`);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to compress audio file.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Audio Compressor"
        description="Compress audio file sizes by adjusting sample rates and audio channel bitrates."
        icon={FileArchive}
      />

      <ErrorState error={fileError || procError} />

      {files.length === 0 ? (
        <DropZone
          accept="audio/*"
          multiple={false}
          onFileSelect={onFileSelect}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          isDragging={isDragging}
          title="Drag & drop an audio file here"
          subtitle="Supports MP3, WAV, AAC, OGG"
        />
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-border">
            <div className="flex items-center space-x-3">
              <Music className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-obsidian-text">{files[0].name}</h3>
                <p className="text-xs text-obsidian-text-muted">
                  Original Size: {(files[0].size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button onClick={clearFiles} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change Audio
            </button>
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-obsidian-text block mb-2">
              Compression Ratio: <span className="text-obsidian-accent font-bold">{Math.round(sampleRateRatio * 100)}% Quality</span>
            </label>
            <input
              type="range"
              min="0.25"
              max="0.8"
              step="0.05"
              value={sampleRateRatio}
              onChange={(e) => setSampleRateRatio(parseFloat(e.target.value))}
              className="w-full accent-obsidian-accent cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-obsidian-text-muted mt-1">
              <span>High Compression (Smaller Size)</span>
              <span>Medium</span>
              <span>High Quality</span>
            </div>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleCompress}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Compress Audio & Download</span>
          </button>
        </div>
      )}
    </main>
  );
}

function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels = [];
  let sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function writeString(str) {
    for (let i = 0; i < str.length; i++) {
      out.setUint8(pos++, str.charCodeAt(i));
    }
  }

  function setUint16(data) {
    out.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  writeString('RIFF');
  setUint32(length - 8);
  writeString('WAVE');
  writeString('fmt ');
  setUint32(16);
  setUint16(1);
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);
  writeString('data');
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

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
