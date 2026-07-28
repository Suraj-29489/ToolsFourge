import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import { TextQuote, Copy, Check, Trash2 } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export default function WordCounter() {
  const [text, setText] = useState('');
  const { copied, copyToClipboard } = useClipboard();

  const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsCount = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const linesCount = text.trim() ? text.split(/\r\n|\r|\n/).length : 0;
  const paragraphsCount = text.trim() ? text.split(/\n\s*\n/).length : 0;
  const readingTime = Math.ceil(wordsCount / 200); // 200 words per minute average

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Word Counter"
        description="Count words, characters, sentences, paragraphs, lines, and reading time in real-time."
        icon={TextQuote}
      />

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl space-y-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-obsidian-secondary border border-obsidian-border p-4 rounded-xl text-center">
            <span className="text-2xl font-extrabold text-obsidian-accent block">{wordsCount}</span>
            <span className="text-xs text-obsidian-text-muted font-medium uppercase">Words</span>
          </div>

          <div className="bg-obsidian-secondary border border-obsidian-border p-4 rounded-xl text-center">
            <span className="text-2xl font-extrabold text-obsidian-text block">{charsCount}</span>
            <span className="text-xs text-obsidian-text-muted font-medium uppercase">Characters</span>
          </div>

          <div className="bg-obsidian-secondary border border-obsidian-border p-4 rounded-xl text-center">
            <span className="text-2xl font-extrabold text-emerald-400 block">{linesCount}</span>
            <span className="text-xs text-obsidian-text-muted font-medium uppercase">Lines</span>
          </div>

          <div className="bg-obsidian-secondary border border-obsidian-border p-4 rounded-xl text-center">
            <span className="text-2xl font-extrabold text-amber-400 block">~{readingTime}m</span>
            <span className="text-xs text-obsidian-text-muted font-medium uppercase">Reading Time</span>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-obsidian-text-muted">
            Without spaces: <strong className="text-obsidian-text">{charsNoSpaces}</strong> | Paragraphs: <strong className="text-obsidian-text">{paragraphsCount}</strong>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setText('')}
              disabled={!text}
              className="px-3 py-1.5 rounded-lg bg-obsidian-secondary text-xs text-red-400 hover:text-red-300 disabled:opacity-40"
            >
              Clear Text
            </button>
            <button
              onClick={() => copyToClipboard(text)}
              disabled={!text}
              className="px-3 py-1.5 rounded-lg bg-obsidian-accent text-xs font-bold text-white hover:bg-obsidian-accent-hover flex items-center space-x-1 disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your content here..."
          className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl p-4 text-sm text-obsidian-text leading-relaxed focus:border-obsidian-accent focus:outline-none"
        />
      </div>
    </main>
  );
}
