import React, { useState, useRef } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { Scissors, Download, Play, Pause, Music } from 'lucide-react';

export default function TrimAudio() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: 'audio/*', multiple: false });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleAudioLoaded = (file) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 60);
      setStartTime(0);
      setEndTime(Math.min(30, audio.duration || 30));
    };
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTrim = async () => {
    if (files.length === 0) return;
    startProcessing('Trimming audio track...');

    try {
      updateProgress(20, 'Decoding Web Audio buffer...');
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      updateProgress(60, 'Slicing audio samples...');
      const sampleRate = decodedBuffer.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const frameCount = Math.max(1, endSample - startSample);

      const trimmedBuffer = audioCtx.createBuffer(
        decodedBuffer.numberOfChannels,
        frameCount,
        sampleRate
      );

      for (let channel = 0; channel < decodedBuffer.numberOfChannels; channel++) {
        const channelData = decodedBuffer.getChannelData(channel);
        const trimmedData = trimmedBuffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          trimmedData[i] = channelData[startSample + i] || 0;
        }
      }

      updateProgress(90, 'Encoding output audio...');
      // Encode to WAV Blob
      const wavBlob = audioBufferToWav(trimmedBuffer);
      updateProgress(100, 'Done!');
      downloadBlob(wavBlob, `trimmed_${file.name.replace(/\.[^/.]+$/, '')}.wav`);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to trim audio track.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Trim Audio"
        description="Cut and clip precise start and end times for any audio file directly in your browser."
        icon={Scissors}
      />

      <ErrorState error={fileError || procError} />

      {files.length === 0 ? (
        <DropZone
          accept="audio/*"
          multiple={false}
          onFileSelect={(e) => { onFileSelect(e); if (e.target.files[0]) handleAudioLoaded(e.target.files[0]); }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => { onDrop(e); if (e.dataTransfer.files[0]) handleAudioLoaded(e.dataTransfer.files[0]); }}
          isDragging={isDragging}
          title="Drag & drop an audio file here"
          subtitle="Supports MP3, WAV, AAC, OGG"
        />
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <audio ref={audioRef} src={URL.createObjectURL(files[0])} onEnded={() => setIsPlaying(false)} />

          <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-border">
            <div className="flex items-center space-x-3">
              <Music className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-obsidian-text">{files[0].name}</h3>
                <p className="text-xs text-obsidian-text-muted">Total Duration: {duration.toFixed(1)}s</p>
              </div>
            </div>
            <button onClick={clearFiles} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change Audio
            </button>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-center space-x-3 my-4">
              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-obsidian-accent text-white hover:bg-obsidian-accent-hover"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">
                  Start Time (seconds): {startTime.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.5"
                  value={startTime}
                  onChange={(e) => setStartTime(Math.min(parseFloat(e.target.value), endTime - 0.5))}
                  className="w-full accent-obsidian-accent cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">
                  End Time (seconds): {endTime.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.5"
                  value={endTime}
                  onChange={(e) => setEndTime(Math.max(parseFloat(e.target.value), startTime + 0.5))}
                  className="w-full accent-obsidian-accent cursor-pointer"
                />
              </div>
            </div>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleTrim}
            disabled={processing}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Trim & Download Audio</span>
          </button>
        </div>
      )}
    </main>
  );
}

// Convert AudioBuffer to WAV format Blob
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
