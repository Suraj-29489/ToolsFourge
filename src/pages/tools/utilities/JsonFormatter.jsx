import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import { useClipboard } from '../../../hooks/useClipboard';
import { Code2, Copy, Check, Minimize2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('{\n  "name": "Daily Tools",\n  "type": "utility",\n  "active": true\n}');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState(null);
  const [validMsg, setValidMsg] = useState(null);

  const { copied, copyToClipboard } = useClipboard();

  const handleFormat = () => {
    setError(null);
    setValidMsg(null);
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setInput(formatted);
      setValidMsg('Valid JSON formatted successfully.');
    } catch (err) {
      setError(err.message || 'Invalid JSON syntax.');
    }
  };

  const handleMinify = () => {
    setError(null);
    setValidMsg(null);
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setValidMsg('JSON minified successfully.');
    } catch (err) {
      setError(err.message || 'Invalid JSON syntax.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="JSON Formatter & Validator"
        description="Prettify, minify, validate, and format JSON structures with syntax error diagnostics."
        icon={Code2}
      />

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-obsidian-border">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFormat}
              className="px-4 py-2 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white text-xs font-bold transition-colors"
            >
              Format / Prettify
            </button>
            <button
              onClick={handleMinify}
              className="px-4 py-2 rounded-xl bg-obsidian-secondary border border-obsidian-border text-obsidian-text hover:border-obsidian-accent text-xs font-bold transition-colors flex items-center space-x-1"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Minify</span>
            </button>
            <select
              value={indent}
              onChange={(e) => setIndent(parseInt(e.target.value, 10))}
              className="bg-obsidian-secondary border border-obsidian-border rounded-xl px-3 py-2 text-xs text-obsidian-text focus:outline-none"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={0}>Tab Indent</option>
            </select>
          </div>

          <button
            onClick={() => copyToClipboard(input)}
            className="px-4 py-2 rounded-xl bg-obsidian-secondary border border-obsidian-border text-obsidian-text hover:text-white text-xs font-bold flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* Validation Banners */}
        {validMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{validMsg}</span>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Code Editor */}
        <textarea
          rows={16}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON object or array here..."
          className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl p-4 font-mono text-xs text-obsidian-text focus:border-obsidian-accent focus:outline-none"
        />
      </div>
    </main>
  );
}
