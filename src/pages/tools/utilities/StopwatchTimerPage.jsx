import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, ArrowLeft, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTime } from '../../../utils/formatters';

export default function StopwatchTimerPage() {
  const [tab, setTab] = useState('stopwatch'); // 'stopwatch' | 'timer'

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const swIntervalRef = useRef(null);

  // Countdown timer state
  const [timerInputSec, setTimerInputSec] = useState(300); // 5 mins
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Stopwatch effect
  useEffect(() => {
    if (swRunning) {
      swIntervalRef.current = setInterval(() => {
        setSwTime((t) => t + 10);
      }, 10);
    } else {
      clearInterval(swIntervalRef.current);
    }
    return () => clearInterval(swIntervalRef.current);
  }, [swRunning]);

  // Countdown timer effect
  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((t) => t - 1);
      }, 1000);
    } else if (timerRemaining === 0 && timerRunning) {
      setTimerRunning(false);
      alert('Timer Finished!');
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerRunning, timerRemaining]);

  const addLap = () => {
    setLaps((prev) => [swTime, ...prev]);
  };

  const resetStopwatch = () => {
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
  };

  const formatMs = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
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
          <Timer className="w-8 h-8 text-purple-400" />
          Stopwatch & Countdown Timer
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Precision lap stopwatch and customizable countdown timer.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div className="flex justify-center gap-2 flex-wrap">
          <button onClick={() => setTab('stopwatch')} className={`px-4 py-2 rounded-xl font-bold text-xs ${tab === 'stopwatch' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}>
            Precision Stopwatch
          </button>
          <button onClick={() => setTab('timer')} className={`px-4 py-2 rounded-xl font-bold text-xs ${tab === 'timer' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}>
            Countdown Timer
          </button>
        </div>

        {tab === 'stopwatch' && (
          <div className="text-center space-y-6">
            <div className="font-mono text-5xl sm:text-6xl font-black text-white tracking-widest p-6 bg-obsidian-secondary border border-obsidian-border rounded-2xl">
              {formatMs(swTime)}
            </div>

            <div className="flex justify-center gap-3">
              <button onClick={() => setSwRunning(!swRunning)} className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 ${swRunning ? 'bg-amber-600 text-white' : 'bg-purple-600 text-white'}`}>
                {swRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {swRunning ? 'Pause' : 'Start'}
              </button>
              {swRunning && (
                <button onClick={addLap} className="px-5 py-3 bg-obsidian-secondary border border-obsidian-border text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                  <Flag className="w-4 h-4" /> Lap
                </button>
              )}
              <button onClick={resetStopwatch} className="px-5 py-3 bg-obsidian-secondary border border-obsidian-border text-gray-300 font-bold text-xs rounded-xl flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>

            {laps.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-1.5 pt-4 border-t border-obsidian-border">
                {laps.map((lTime, idx) => (
                  <div key={idx} className="flex justify-between items-center px-4 py-2 bg-obsidian-secondary rounded-lg text-xs font-mono">
                    <span className="text-obsidian-text-muted">Lap #{laps.length - idx}</span>
                    <span className="text-purple-300 font-bold">{formatMs(lTime)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'timer' && (
          <div className="text-center space-y-6">
            <div className="font-mono text-5xl sm:text-6xl font-black text-purple-400 tracking-widest p-6 bg-obsidian-secondary border border-obsidian-border rounded-2xl">
              {formatTime(timerRemaining)}
            </div>

            <div className="flex justify-center items-center gap-3">
              <input
                type="number"
                value={Math.floor(timerInputSec / 60)}
                onChange={(e) => { const mins = Number(e.target.value); setTimerInputSec(mins * 60); setTimerRemaining(mins * 60); }}
                className="w-24 bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl text-center font-bold"
              />
              <span className="text-xs text-obsidian-text-muted font-bold">Minutes</span>
            </div>

            <div className="flex justify-center gap-3">
              <button onClick={() => setTimerRunning(!timerRunning)} className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 ${timerRunning ? 'bg-amber-600 text-white' : 'bg-purple-600 text-white'}`}>
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {timerRunning ? 'Pause' : 'Start Timer'}
              </button>
              <button onClick={() => { setTimerRunning(false); setTimerRemaining(timerInputSec); }} className="px-5 py-3 bg-obsidian-secondary border border-obsidian-border text-gray-300 font-bold text-xs rounded-xl flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
