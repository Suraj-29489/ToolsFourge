import React, { useState } from 'react';
import { Code, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState(`Contact us at support@toolsfourge.com or sales@example.org for help!`);
  const [error, setError] = useState(null);

  const testRegex = () => {
    if (!pattern) return [];
    try {
      const regex = new RegExp(pattern, flags);
      setError(null);
      const matches = [];
      let match;
      if (flags.includes('g')) {
        while ((match = regex.exec(testText)) !== null) {
          matches.push({ text: match[0], index: match.index });
        }
      } else {
        match = regex.exec(testText);
        if (match) matches.push({ text: match[0], index: match.index });
      }
      return matches;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const matches = testRegex();

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Code className="w-8 h-8 text-purple-400" />
          Regular Expression (Regex) Tester
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Test regular expression patterns against sample text in real time with live match highlights.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        {/* Pattern Input */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Regular Expression Pattern</label>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3.5 rounded-xl font-mono" />
          </div>

          <div>
            <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Flags (g, i, m)</label>
            <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3.5 rounded-xl font-mono uppercase font-bold" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Test Text */}
        <div>
          <label className="text-xs font-semibold text-obsidian-text-muted block mb-1">Test Text Input</label>
          <textarea value={testText} onChange={(e) => setTestText(e.target.value)} rows={4} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3 rounded-xl font-mono outline-none" />
        </div>

        {/* Match Results */}
        <div className="space-y-3 pt-3 border-t border-obsidian-border">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white uppercase tracking-wider">Matched Results ({matches.length})</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {matches.map((m, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs rounded-lg font-bold">
                #{idx + 1}: "{m.text}" <span className="text-[10px] text-gray-400">@{m.index}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
