import React, { useState } from 'react';
import { KeyRound, Copy, ArrowLeft, Check, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HashGenerator() {
  const [inputText, setInputText] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha512, setSha512] = useState('');
  const [sha1, setSha1] = useState('');
  const [copiedField, setCopiedField] = useState('');

  const generateHashes = async (text) => {
    setInputText(text);
    if (!text) {
      setSha1(''); setSha256(''); setSha512('');
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // SHA-1
    const buffer1 = await crypto.subtle.digest('SHA-1', data);
    setSha1(Array.from(new Uint8Array(buffer1)).map((b) => b.toString(16).padStart(2, '0')).join(''));

    // SHA-256
    const buffer256 = await crypto.subtle.digest('SHA-256', data);
    setSha256(Array.from(new Uint8Array(buffer256)).map((b) => b.toString(16).padStart(2, '0')).join(''));

    // SHA-512
    const buffer512 = await crypto.subtle.digest('SHA-512', data);
    setSha512(Array.from(new Uint8Array(buffer512)).map((b) => b.toString(16).padStart(2, '0')).join(''));
  };

  const copyValue = (val, fieldName) => {
    navigator.clipboard.writeText(val);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
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
          <Shield className="w-8 h-8 text-purple-400" />
          Hash Generator (SHA-256 / SHA-512 / SHA-1)
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Generate cryptographic hashes using browser Web Crypto API without uploading data.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Input String</label>
          <textarea
            rows={4}
            placeholder="Type text to generate cryptographic hash..."
            value={inputText}
            onChange={(e) => generateHashes(e.target.value)}
            className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-3.5 rounded-xl font-mono"
          />
        </div>

        {inputText && (
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-purple-400">SHA-256</span>
                <button onClick={() => copyValue(sha256, 'sha256')} className="text-xs text-obsidian-text-muted hover:text-white flex items-center gap-1">
                  {copiedField === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === 'sha256' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <input type="text" readOnly value={sha256} className="w-full bg-obsidian-secondary border border-obsidian-border text-xs text-white p-3 rounded-xl font-mono" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-purple-400">SHA-512</span>
                <button onClick={() => copyValue(sha512, 'sha512')} className="text-xs text-obsidian-text-muted hover:text-white flex items-center gap-1">
                  {copiedField === 'sha512' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === 'sha512' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <input type="text" readOnly value={sha512} className="w-full bg-obsidian-secondary border border-obsidian-border text-xs text-white p-3 rounded-xl font-mono" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-purple-400">SHA-1</span>
                <button onClick={() => copyValue(sha1, 'sha1')} className="text-xs text-obsidian-text-muted hover:text-white flex items-center gap-1">
                  {copiedField === 'sha1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === 'sha1' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <input type="text" readOnly value={sha1} className="w-full bg-obsidian-secondary border border-obsidian-border text-xs text-white p-3 rounded-xl font-mono" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
