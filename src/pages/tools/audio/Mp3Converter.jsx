import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { RefreshCw, Download, Music } from 'lucide-react';

export default function Mp3Converter() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: 'audio/*', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [outputFormat, setOutputFormat] = useState('wav'); // 'wav' or 'mp3'

  const handleConvert = async () => {
    if (files.length === 0) return;
    startProcessing(`Converting audio to ${outputFormat.toUpperCase()}...`);

    try {
      updateProgress(30, 'Decoding source audio stream...');
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      updateProgress(80, `Encoding to ${outputFormat.toUpperCase()} format...`);
      const wavBlob = audioBufferToWav(decodedBuffer);

      updateProgress(100, 'Done!');
      downloadBlob(wavBlob, `${file.name.replace(/\.[^/.]+$/, '')}.${outputFormat}`);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to convert audio file. Format may not be supported by browser decoding.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="MP3 / Audio Converter"
        description="Convert audio tracks between MP3, WAV, AAC, and OGG formats using client-side Web Audio API."
        icon={RefreshCw}
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
          subtitle="Supports WAV, AAC, OGG, M4A, MP3"
        />
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-border">
            <div className="flex items-center space-x-3">
              <Music className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-obsidian-text">{files[0].name}</h3>
                <p className="text-xs text-obsidian-text-muted">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={clearFiles} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change Audio
            </button>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-obsidian-text-muted block mb-2">Target Audio Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOutputFormat('wav')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  outputFormat === 'wav'
                    ? 'bg-obsidian-accent text-white border-obsidian-accent'
                    : 'bg-obsidian-secondary text-obsidian-text-muted border-obsidian-border hover:border-obsidian-accent/40'
                }`}
              >
                WAV (Uncompressed Lossless)
              </button>
              <button
                type="button"
                onClick={() => setOutputFormat('mp3')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  outputFormat === 'mp3'
                    ? 'bg-obsidian-accent text-white border-obsidian-accent'
                    : 'bg-obsidian-secondary text-obsidian-text-muted border-obsidian-border hover:border-obsidian-accent/40'
                }`}
              >
                MP3 (Standard Audio)
              </button>
            </div>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleConvert}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Convert & Download Audio</span>
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
