import React, { useState } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import { useClipboard } from '../../../hooks/useClipboard';
import { Binary, Copy, Check, ArrowRightLeft } from 'lucide-react';

export default function Base64Encoder() {
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  const { copied, copyToClipboard } = useClipboard();

  const handleProcess = () => {
    setError(null);
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input.trim())));
        setOutput(decoded);
      }
    } catch (err) {
      console.error(err);
      setError(mode === 'decode' ? 'Invalid Base64 string.' : 'Encoding error.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Base64 Encoder / Decoder"
        description="Encode plain text into Base64 strings or decode Base64 strings back to text."
        icon={Binary}
      />

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setMode('encode'); setOutput(''); setError(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'encode' ? 'bg-obsidian-accent text-white' : 'bg-obsidian-secondary text-obsidian-text-muted'
              }`}
            >
              Encode to Base64
            </button>
            <button
              onClick={() => { setMode('decode'); setOutput(''); setError(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'decode' ? 'bg-obsidian-accent text-white' : 'bg-obsidian-secondary text-obsidian-text-muted'
              }`}
            >
              Decode from Base64
            </button>
          </div>

          <button
            onClick={handleProcess}
            className="px-5 py-2.5 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white text-xs font-bold flex items-center space-x-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Process Text</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-obsidian-text block mb-1">
              Input {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
            </label>
            <textarea
              rows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste ${mode === 'encode' ? 'plain text' : 'Base64'} here...`}
              className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl p-4 text-xs font-mono text-obsidian-text focus:border-obsidian-accent focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-obsidian-text block">Output</label>
              {output && (
                <button
                  onClick={() => copyToClipboard(output)}
                  className="text-xs text-obsidian-accent hover:underline flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <textarea
              rows={8}
              readOnly
              value={output}
              placeholder="Output will appear here..."
              className="w-full bg-obsidian-secondary border border-obsidian-border rounded-xl p-4 text-xs font-mono text-obsidian-text focus:outline-none"
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
