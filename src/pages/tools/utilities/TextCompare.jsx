import React, { useState, useMemo } from 'react';
import * as diff from 'diff';
import ToolHeader from '../../../components/common/ToolHeader';
import { GitCompare, ArrowRightLeft } from 'lucide-react';

export default function TextCompare() {
  const [text1, setText1] = useState('Const name = "Daily Tools";\nconst type = "utility";');
  const [text2, setText2] = useState('const name = "ToolsFourge";\nconst type = "utility suite";\nconst active = true;');
  const [diffMode, setDiffMode] = useState('lines'); // 'lines' or 'words'

  const diffResult = useMemo(() => {
    if (diffMode === 'words') {
      return diff.diffWords(text1, text2);
    }
    return diff.diffLines(text1, text2);
  }, [text1, text2, diffMode]);

  return (
    <main className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Text Compare & Diff"
        description="Compare two text snippets side-by-side and highlight additions and deletions."
        icon={GitCompare}
      />

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl space-y-6">
        {/* Controls Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-border">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-obsidian-text">Diff Mode:</span>
            <button
              onClick={() => setDiffMode('lines')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                diffMode === 'lines' ? 'bg-obsidian-accent text-white' : 'bg-obsidian-secondary text-obsidian-text-muted'
              }`}
            >
              Line-by-Line
            </button>
            <button
              onClick={() => setDiffMode('words')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                diffMode === 'words' ? 'bg-obsidian-accent text-white' : 'bg-obsidian-secondary text-obsidian-text-muted'
              }`}
            >
              Word-by-Word
            </button>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Additions</span>
            </span>
            <span className="text-red-400 flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span>Deletions</span>
            </span>
          </div>
        </div>

        {/* Input Textareas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-obsidian-text block mb-1">Original Text (Left)</label>
            <textarea
              rows={8}
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter original text..."
              className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl p-3.5 text-xs font-mono text-obsidian-text focus:border-obsidian-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-obsidian-text block mb-1">Modified Text (Right)</label>
            <textarea
              rows={8}
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter modified text..."
              className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl p-3.5 text-xs font-mono text-obsidian-text focus:border-obsidian-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Highlighted Diff Output */}
        <div>
          <h3 className="text-sm font-bold text-obsidian-text mb-2">Differences Output</h3>
          <div className="bg-obsidian-secondary border border-obsidian-border rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {diffResult.map((part, index) => {
              const color = part.added
                ? 'bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded border border-emerald-500/30'
                : part.removed
                ? 'bg-red-500/20 text-red-300 px-1 py-0.5 rounded border border-red-500/30 line-through'
                : 'text-obsidian-text-muted';

              return (
                <span key={index} className={color}>
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
