import React, { useState, useEffect } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import { useClipboard } from '../../../hooks/useClipboard';
import { Fingerprint, Copy, Check, RefreshCw } from 'lucide-react';

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState([]);
  const { copied, copyToClipboard } = useClipboard();

  const generateUuids = () => {
    const list = [];
    for (let i = 0; i < count; i++) {
      if (window.crypto && window.crypto.randomUUID) {
        list.push(window.crypto.randomUUID());
      } else {
        // Fallback v4 generator
        list.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }));
      }
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUuids();
  }, [count]);

  return (
    <main className="max-w-[800px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="UUID Generator"
        description="Generate bulk RFC 4122 version 4 Universally Unique Identifiers (UUIDs)."
        icon={Fingerprint}
      />

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <label className="text-xs font-bold text-obsidian-text">Quantity:</label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="bg-obsidian-secondary border border-obsidian-border rounded-xl px-3 py-1.5 text-xs text-obsidian-text focus:outline-none"
            >
              <option value={1}>1 UUID</option>
              <option value={5}>5 UUIDs</option>
              <option value={10}>10 UUIDs</option>
              <option value={20}>20 UUIDs</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={generateUuids}
              className="px-3 py-2 rounded-xl bg-obsidian-secondary border border-obsidian-border text-xs text-obsidian-text font-bold hover:bg-obsidian-accent hover:text-white flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
            <button
              onClick={() => copyToClipboard(uuids.join('\n'))}
              className="px-4 py-2 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white text-xs font-bold flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied All!' : 'Copy All'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {uuids.map((uuid, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-obsidian-secondary border border-obsidian-border rounded-xl font-mono text-sm text-obsidian-text select-all"
            >
              <span>{uuid}</span>
              <button
                onClick={() => copyToClipboard(uuid)}
                className="text-xs text-obsidian-text-muted hover:text-obsidian-accent p-1"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
