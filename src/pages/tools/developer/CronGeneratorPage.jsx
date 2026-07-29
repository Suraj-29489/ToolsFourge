import React, { useState } from 'react';
import { Clock, Copy, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CronGeneratorPage() {
  const [minute, setMinute] = useState('*/5');
  const [hour, setHour] = useState('*');
  const [dayMonth, setDayMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayWeek, setDayWeek] = useState('*');
  const [copied, setCopied] = useState(false);

  const cronExpression = `${minute} ${hour} ${dayMonth} ${month} ${dayWeek}`;

  const getHumanReadable = () => {
    let parts = [];
    if (minute === '*') parts.push('every minute');
    else if (minute.startsWith('*/')) parts.push(`every ${minute.replace('*/', '')} minutes`);
    else parts.push(`at minute ${minute}`);

    if (hour === '*') parts.push('of every hour');
    else parts.push(`at hour ${hour}:00`);

    if (dayMonth !== '*') parts.push(`on day ${dayMonth} of the month`);
    if (month !== '*') parts.push(`in month ${month}`);
    if (dayWeek !== '*') parts.push(`on weekday ${dayWeek}`);

    return parts.join(', ');
  };

  const copyCron = () => {
    navigator.clipboard.writeText(cronExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Clock className="w-8 h-8 text-purple-400" />
          Cron Expression Generator & Reader
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Interactively build cron schedule expressions with plain-English human readable descriptions.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        {/* Output Box */}
        <div className="bg-obsidian-secondary border border-obsidian-border p-5 rounded-xl text-center space-y-2">
          <span className="text-xs text-obsidian-text-muted block font-semibold uppercase tracking-wider">Cron Schedule Output</span>
          <span className="font-mono text-3xl font-extrabold text-purple-400 tracking-widest block">{cronExpression}</span>
          <p className="text-xs font-semibold text-emerald-400 capitalize flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> "Runs {getHumanReadable()}"
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-obsidian-text-muted block mb-1">Minute</label>
            <select value={minute} onChange={(e) => setMinute(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-2.5 rounded-lg font-mono">
              <option value="*">* (Every minute)</option>
              <option value="*/5">*/5 (Every 5 mins)</option>
              <option value="*/15">*/15 (Every 15 mins)</option>
              <option value="*/30">*/30 (Every 30 mins)</option>
              <option value="0">0 (At minute 0)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-obsidian-text-muted block mb-1">Hour</label>
            <select value={hour} onChange={(e) => setHour(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-2.5 rounded-lg font-mono">
              <option value="*">* (Every hour)</option>
              <option value="0">0 (Midnight)</option>
              <option value="12">12 (Noon)</option>
              <option value="*/2">*/2 (Every 2 hours)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-obsidian-text-muted block mb-1">Day of Month</label>
            <select value={dayMonth} onChange={(e) => setDayMonth(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-2.5 rounded-lg font-mono">
              <option value="*">* (Every day)</option>
              <option value="1">1 (1st of month)</option>
              <option value="15">15 (15th of month)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-obsidian-text-muted block mb-1">Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-2.5 rounded-lg font-mono">
              <option value="*">* (Every month)</option>
              <option value="1">Jan (1)</option>
              <option value="6">Jun (6)</option>
              <option value="12">Dec (12)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-obsidian-text-muted block mb-1">Day of Week</label>
            <select value={dayWeek} onChange={(e) => setDayWeek(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-2.5 rounded-lg font-mono">
              <option value="*">* (Every day)</option>
              <option value="1-5">1-5 (Mon-Fri)</option>
              <option value="0">0 (Sunday)</option>
            </select>
          </div>
        </div>

        <button onClick={copyCron} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Expression' : 'Copy Cron Expression'}
        </button>
      </div>
    </main>
  );
}
