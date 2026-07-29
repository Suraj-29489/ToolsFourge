import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTime } from '../../../utils/formatters';

export default function VoiceRecorderPage() {
  const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'paused' | 'stopped'
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current.start(100);
      setRecordingState('recording');
      setTimer(0);

      timerIntervalRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Microphone access is required to use the Voice Recorder.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
      clearInterval(timerIntervalRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
      timerIntervalRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecordingState('stopped');
      clearInterval(timerIntervalRef.current);
    }
  };

  const resetRecording = () => {
    setRecordingState('idle');
    setTimer(0);
    setAudioUrl(null);
    setAudioBlob(null);
  };

  useEffect(() => {
    return () => clearInterval(timerIntervalRef.current);
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Mic className="w-8 h-8 text-purple-400" />
          Voice & Audio Recorder
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Record voice notes directly from your microphone locally in your browser.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-8 text-center space-y-6">
        {/* Timer Display */}
        <div className="space-y-1">
          <span className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-widest">
            {formatTime(timer)}
          </span>
          <span className="block text-xs font-semibold text-purple-400 uppercase tracking-wider">
            {recordingState === 'recording' ? '• Recording Live' : recordingState === 'paused' ? 'Paused' : 'Ready'}
          </span>
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {recordingState === 'idle' && (
            <button onClick={startRecording} className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-600/30">
              <Mic className="w-5 h-5 animate-pulse" /> Start Recording
            </button>
          )}

          {recordingState === 'recording' && (
            <>
              <button onClick={pauseRecording} className="px-6 py-3.5 bg-obsidian-secondary border border-obsidian-border text-white font-bold text-xs rounded-xl flex items-center gap-2">
                <Pause className="w-4 h-4" /> Pause
              </button>
              <button onClick={stopRecording} className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                <Square className="w-4 h-4" /> Stop Recording
              </button>
            </>
          )}

          {recordingState === 'paused' && (
            <>
              <button onClick={resumeRecording} className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                <Play className="w-4 h-4" /> Resume
              </button>
              <button onClick={stopRecording} className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                <Square className="w-4 h-4" /> Stop Recording
              </button>
            </>
          )}
        </div>

        {/* Playback & Download */}
        {audioUrl && (
          <div className="pt-6 border-t border-obsidian-border space-y-4">
            <audio src={audioUrl} controls className="w-full max-w-md mx-auto" />
            <div className="flex justify-center gap-3">
              <a href={audioUrl} download={`voice_recording_${Date.now()}.webm`} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Audio File
              </a>
              <button onClick={resetRecording} className="px-4 py-3 bg-obsidian-secondary border border-obsidian-border text-xs text-white rounded-xl flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Record Again
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
