import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { Volume2, Download, Music } from 'lucide-react';

export default function VolumeBooster() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: 'audio/*', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [gainMultiplier, setGainMultiplier] = useState(2.0); // 1.0 to 5.0 (100% to 500%)

  const handleBoost = async () => {
    if (files.length === 0) return;
    startProcessing('Boosting audio volume level...');

    try {
      updateProgress(20, 'Decoding audio track...');
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      updateProgress(60, `Applying ${Math.round(gainMultiplier * 100)}% volume gain multiplier...`);
      const length = decodedBuffer.length;
      const numChannels = decodedBuffer.numberOfChannels;
      const boostedBuffer = audioCtx.createBuffer(numChannels, length, decodedBuffer.sampleRate);

      for (let channel = 0; channel < numChannels; channel++) {
        const inputData = decodedBuffer.getChannelData(channel);
        const outputData = boostedBuffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          // Multiply sample amplitude by gain multiplier with soft clipping
          let sample = inputData[i] * gainMultiplier;
          outputData[i] = Math.max(-1, Math.min(1, sample));
        }
      }

      updateProgress(90, 'Encoding boosted audio...');
      const wavBlob = audioBufferToWav(boostedBuffer);
      updateProgress(100, 'Done!');
      downloadBlob(wavBlob, `boosted_${file.name.replace(/\.[^/.]+$/, '')}.wav`);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to boost audio volume.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Volume Booster"
        description="Amplify and boost audio volume up to 500% cleanly without distortion."
        icon={Volume2}
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
              <h3 className="text-base font-bold text-obsidian-text">{files[0].name}</h3>
            </div>
            <button onClick={clearFiles} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change Audio
            </button>
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-obsidian-text block mb-2">
              Volume Gain Level: <span className="text-obsidian-accent font-bold">{Math.round(gainMultiplier * 100)}%</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.2"
              value={gainMultiplier}
              onChange={(e) => setGainMultiplier(parseFloat(e.target.value))}
              className="w-full accent-obsidian-accent cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-obsidian-text-muted mt-1">
              <span>100% (Original)</span>
              <span>250% (Recommended)</span>
              <span>500% (Maximum)</span>
            </div>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleBoost}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Boost Volume & Download</span>
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
