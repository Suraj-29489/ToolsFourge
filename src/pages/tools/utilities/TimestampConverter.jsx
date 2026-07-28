import React, { useState, useEffect } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import { useClipboard } from '../../../hooks/useClipboard';
import { Clock, Copy, Check, RefreshCw } from 'lucide-react';

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [timestampInput, setTimestampInput] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState(new Date().toISOString().substring(0, 16));
  
  const [convertedDate, setConvertedDate] = useState('');
  const [convertedTimestamp, setConvertedTimestamp] = useState('');

  const { copied, copyToClipboard } = useClipboard();

  // Live Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Convert Timestamp to Date
  useEffect(() => {
    if (!timestampInput.trim()) {
      setConvertedDate('');
      return;
    }

    try {
      let ts = parseInt(timestampInput.trim(), 10);
      if (isNaN(ts)) return;
      if (ts < 10000000000) ts *= 1000; // convert seconds to ms if needed
      const d = new Date(ts);
      setConvertedDate(d.toUTCString() + ' | ' + d.toLocaleString());
    } catch {
      setConvertedDate('Invalid timestamp');
    }
  }, [timestampInput]);

  // Convert Date to Timestamp
  useEffect(() => {
    if (!dateInput) {
      setConvertedTimestamp('');
      return;
    }

    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return;
      setConvertedTimestamp(Math.floor(d.getTime() / 1000).toString());
    } catch {
      setConvertedTimestamp('Invalid date');
    }
  }, [dateInput]);

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Timestamp Converter"
        description="Convert Unix timestamps into human-readable date formats and vice versa."
        icon={Clock}
      />

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl space-y-6">
        {/* Live Clock Banner */}
        <div className="flex items-center justify-between p-4 bg-obsidian-secondary border border-obsidian-border rounded-xl">
          <div>
            <span className="text-xs text-obsidian-text-muted block">Current Unix Timestamp (Seconds)</span>
            <span className="text-xl font-mono font-bold text-obsidian-accent">{now}</span>
          </div>
          <button
            onClick={() => setTimestampInput(now.toString())}
            className="px-3 py-1.5 rounded-lg bg-obsidian-card border border-obsidian-border text-xs text-obsidian-text hover:border-obsidian-accent"
          >
            Use Current
          </button>
        </div>

        {/* Converter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timestamp -> Date */}
          <div className="bg-obsidian-secondary border border-obsidian-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-obsidian-text">Unix Timestamp → Date</h3>
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g. 1700000000"
              className="w-full bg-obsidian-card border border-obsidian-border rounded-xl px-4 py-2.5 text-sm font-mono text-obsidian-text focus:outline-none"
            />
            <div className="p-3 bg-obsidian-card border border-obsidian-border rounded-xl">
              <span className="text-[11px] text-obsidian-text-muted block mb-1">Human Readable Date</span>
              <span className="text-xs font-mono font-medium text-emerald-400 break-all">{convertedDate || 'Result...'}</span>
            </div>
          </div>

          {/* Date -> Timestamp */}
          <div className="bg-obsidian-secondary border border-obsidian-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-obsidian-text">Date → Unix Timestamp</h3>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full bg-obsidian-card border border-obsidian-border rounded-xl px-4 py-2.5 text-sm text-obsidian-text focus:outline-none"
            />
            <div className="p-3 bg-obsidian-card border border-obsidian-border rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-obsidian-text-muted block mb-0.5">Unix Timestamp</span>
                <span className="text-xs font-mono font-bold text-obsidian-accent">{convertedTimestamp || 'Result...'}</span>
              </div>
              {convertedTimestamp && (
                <button
                  onClick={() => copyToClipboard(convertedTimestamp)}
                  className="text-xs text-obsidian-text-muted hover:text-white p-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
