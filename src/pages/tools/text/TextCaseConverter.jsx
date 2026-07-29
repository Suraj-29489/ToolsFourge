import React, { useState } from 'react';
import { Type, Copy, ArrowLeft, Check, Trash2, SortAsc, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TextCaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const lineCount = text ? text.split('\n').length : 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());
  const toTitleCase = () => {
    setText(
      text.toLowerCase().replace(/(?:^|\s|-)\S/g, (m) => m.toUpperCase())
    );
  };
  const toSentenceCase = () => {
    setText(
      text.toLowerCase().replace(/(^\s*|[.!?]\s+)[a-z]/g, (m) => m.toUpperCase())
    );
  };
  const toCamelCase = () => {
    setText(
      text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    );
  };
  const toKebabCase = () => {
    setText(
      text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
    );
  };
  const toSnakeCase = () => {
    setText(
      text.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    );
  };

  const reverseText = () => setText(text.split('').reverse().join(''));

  const sortLines = () => {
    const lines = text.split('\n').sort();
    setText(lines.join('\n'));
  };

  const removeDuplicates = () => {
    const lines = text.split('\n');
    const unique = Array.from(new Set(lines));
    setText(unique.join('\n'));
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
          <Type className="w-8 h-8 text-purple-400" />
          Text Case & Line Converter
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Convert text case, remove duplicate lines, sort lines, and calculate stats locally in your browser.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-5">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-obsidian-secondary rounded-xl text-center text-xs">
          <div><span className="block text-obsidian-text-muted">Characters</span><span className="font-bold text-white text-base">{charCount}</span></div>
          <div><span className="block text-obsidian-text-muted">Words</span><span className="font-bold text-purple-400 text-base">{wordCount}</span></div>
          <div><span className="block text-obsidian-text-muted">Lines</span><span className="font-bold text-white text-base">{lineCount}</span></div>
        </div>

        <textarea
          rows={8}
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-4 rounded-xl font-mono outline-none focus:border-purple-500 transition-colors"
        />

        {/* Converter Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={toUpperCase} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">UPPERCASE</button>
          <button onClick={toLowerCase} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">lowercase</button>
          <button onClick={toTitleCase} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">Title Case</button>
          <button onClick={toSentenceCase} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">Sentence case</button>
          <button onClick={toCamelCase} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">camelCase</button>
          <button onClick={toKebabCase} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">kebab-case</button>
          <button onClick={toSnakeCase} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">snake_case</button>
          <button onClick={reverseText} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">Reverse Text</button>
          <button onClick={sortLines} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">Sort Lines</button>
          <button onClick={removeDuplicates} className="px-3 py-2 bg-obsidian-secondary hover:bg-gray-800 border border-obsidian-border text-white text-xs font-semibold rounded-lg">Remove Duplicates</button>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button onClick={() => setText('')} className="flex items-center gap-1 text-xs text-rose-400 hover:underline">
            <Trash2 className="w-3.5 h-3.5" /> Clear Text
          </button>
          <button onClick={copyToClipboard} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
        </div>
      </div>
    </main>
  );
}
