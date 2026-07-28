import React from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { Combine, Download, Music, Trash2 } from 'lucide-react';

export default function MergeAudio() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, removeFile, clearFiles } = useFileDrop({ accept: 'audio/*', multiple: true });
  const { downloadBlob } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const handleMerge = async () => {
    if (files.length < 2) return;
    startProcessing('Concatenating audio tracks...');

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const decodedBuffers = [];
      let totalLength = 0;

      for (let i = 0; i < files.length; i++) {
        updateProgress(Math.round(((i + 1) / files.length) * 50), `Decoding track ${i + 1} of ${files.length}...`);
        const arrayBuffer = await files[i].arrayBuffer();
        const decoded = await audioCtx.decodeAudioData(arrayBuffer);
        decodedBuffers.push(decoded);
        totalLength += decoded.length;
      }

      updateProgress(70, 'Merging channels and sample buffers...');
      const sampleRate = decodedBuffers[0].sampleRate;
      const numChannels = decodedBuffers[0].numberOfChannels;
      const mergedBuffer = audioCtx.createBuffer(numChannels, totalLength, sampleRate);

      for (let channel = 0; channel < numChannels; channel++) {
        const mergedData = mergedBuffer.getChannelData(channel);
        let currentOffset = 0;

        for (let i = 0; i < decodedBuffers.length; i++) {
          const trackData = decodedBuffers[i].getChannelData(Math.min(channel, decodedBuffers[i].numberOfChannels - 1));
          mergedData.set(trackData, currentOffset);
          currentOffset += decodedBuffers[i].length;
        }
      }

      updateProgress(90, 'Encoding merged audio...');
      const wavBlob = audioBufferToWav(mergedBuffer);
      updateProgress(100, 'Done!');
      downloadBlob(wavBlob, 'merged_audio.wav');
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to merge audio tracks.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Merge Audio"
        description="Combine and concatenate multiple audio files into a single continuous audio track."
        icon={Combine}
      />

      <ErrorState error={fileError || procError} />

      <DropZone
        accept="audio/*"
        multiple={true}
        onFileSelect={onFileSelect}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        isDragging={isDragging}
        title="Drag & drop audio files here"
        subtitle="Select 2 or more audio tracks to merge"
      />

      {files.length > 0 && (
        <div className="mt-8 bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-obsidian-border">
            <h3 className="text-base font-bold text-obsidian-text">
              Selected Audio Tracks ({files.length})
            </h3>
            <button onClick={clearFiles} className="text-xs text-red-400 hover:text-red-300">
              Clear All
            </button>
          </div>

          <div className="space-y-2 mb-6">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-obsidian-secondary border border-obsidian-border rounded-xl">
                <div className="flex items-center space-x-3 truncate">
                  <Music className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-obsidian-text truncate">{file.name}</span>
                </div>
                <button onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          <button
            onClick={handleMerge}
            disabled={processing || files.length < 2}
            className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
          >
            <Download className="w-4 h-4" />
            <span>Merge {files.length} Tracks & Download</span>
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
