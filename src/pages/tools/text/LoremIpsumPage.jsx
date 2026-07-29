import React, { useState } from 'react';
import { Type, Copy, Download, ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut',
  'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur'
];

export default function LoremIpsumPage() {
  const [unit, setUnit] = useState('paragraphs'); // 'paragraphs' | 'sentences' | 'words'
  const [count, setCount] = useState(3);
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    let result = [];
    if (unit === 'words') {
      for (let i = 0; i < count; i++) {
        result.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      return result.join(' ');
    }
    if (unit === 'sentences') {
      for (let i = 0; i < count; i++) {
        const sentenceWords = LOREM_WORDS.slice(i * 5, (i + 1) * 5 + 3).join(' ');
        result.push(sentenceWords.charAt(0).toUpperCase() + sentenceWords.slice(1) + '.');
      }
      return result.join(' ');
    }
    // Paragraphs
    for (let i = 0; i < count; i++) {
      const para = LOREM_WORDS.slice(0, 30 + (i * 10) % 20).join(' ');
      result.push(para.charAt(0).toUpperCase() + para.slice(1) + '.');
    }
    return result.join('\n\n');
  };

  const outputText = generateText();

  const copyText = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `lorem_ipsum_${Date.now()}.txt`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
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
          Lorem Ipsum Generator
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Generate placeholder text by words, sentences, or paragraphs.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Generate By</label>
            <div className="grid grid-cols-3 gap-2">
              {['paragraphs', 'sentences', 'words'].map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`py-2.5 rounded-xl border text-xs font-bold capitalize ${unit === u ? 'bg-purple-600 border-purple-500 text-white' : 'bg-obsidian-secondary border-obsidian-border text-gray-300'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Quantity ({count})</label>
            <input type="range" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-purple-500" />
          </div>
        </div>

        <div className="bg-obsidian-secondary border border-obsidian-border rounded-xl p-4 space-y-4">
          <textarea
            value={outputText}
            readOnly
            rows={8}
            className="w-full bg-transparent text-gray-200 text-sm outline-none resize-none font-serif leading-relaxed"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-obsidian-border">
            <button onClick={copyText} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button onClick={downloadText} className="px-4 py-2 bg-obsidian-card hover:bg-gray-800 border border-obsidian-border text-white font-bold text-xs rounded-lg flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Download .txt
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
