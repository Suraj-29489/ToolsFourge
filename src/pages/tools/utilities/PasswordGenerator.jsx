import React, { useState, useEffect } from 'react';
import ToolHeader from '../../../components/common/ToolHeader';
import { useClipboard } from '../../../hooks/useClipboard';
import { KeyRound, Copy, Check, RefreshCw, Shield } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const { copied, copyToClipboard } = useClipboard();

  const generatePassword = () => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('');
      return;
    }

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  return (
    <main className="max-w-[800px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="Password Generator"
        description="Generate strong, cryptographically secure passwords using browser Web Crypto API."
        icon={KeyRound}
      />

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl space-y-6">
        {/* Output Box */}
        <div className="flex items-center justify-between p-4 bg-obsidian-secondary border border-obsidian-border rounded-xl">
          <span className="font-mono text-lg font-bold text-obsidian-text tracking-wider break-all select-all">
            {password || 'Select options below'}
          </span>
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            <button
              onClick={generatePassword}
              className="p-2 rounded-lg text-obsidian-text-muted hover:text-white hover:bg-obsidian-card border border-obsidian-border transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => copyToClipboard(password)}
              disabled={!password}
              className="py-2 px-3 rounded-lg bg-obsidian-accent hover:bg-obsidian-accent-hover text-white text-xs font-bold flex items-center space-x-1.5 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-obsidian-text">Password Length</span>
              <span className="text-obsidian-accent font-mono">{length} characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full accent-obsidian-accent cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center space-x-2.5 p-3 bg-obsidian-secondary border border-obsidian-border rounded-xl cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="accent-obsidian-accent w-4 h-4 rounded"
              />
              <span className="text-xs font-medium text-obsidian-text">Uppercase (A-Z)</span>
            </label>

            <label className="flex items-center space-x-2.5 p-3 bg-obsidian-secondary border border-obsidian-border rounded-xl cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="accent-obsidian-accent w-4 h-4 rounded"
              />
              <span className="text-xs font-medium text-obsidian-text">Lowercase (a-z)</span>
            </label>

            <label className="flex items-center space-x-2.5 p-3 bg-obsidian-secondary border border-obsidian-border rounded-xl cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="accent-obsidian-accent w-4 h-4 rounded"
              />
              <span className="text-xs font-medium text-obsidian-text">Numbers (0-9)</span>
            </label>

            <label className="flex items-center space-x-2.5 p-3 bg-obsidian-secondary border border-obsidian-border rounded-xl cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="accent-obsidian-accent w-4 h-4 rounded"
              />
              <span className="text-xs font-medium text-obsidian-text">Symbols (!@#$%)</span>
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}
