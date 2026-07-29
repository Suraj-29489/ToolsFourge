import React, { useState } from 'react';
import { Key, Copy, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);

  const decodeJwt = (jwtString) => {
    setToken(jwtString);
    setError(null);
    setHeader(null);
    setPayload(null);

    if (!jwtString.trim()) return;

    const parts = jwtString.trim().split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT structure. A JWT must consist of 3 dot-separated parts.');
      return;
    }

    try {
      const decodedHeader = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const decodedPayload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      setHeader(decodedHeader);
      setPayload(decodedPayload);
    } catch (e) {
      setError('Failed to decode Base64 JSON payload in JWT.');
    }
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
          <Key className="w-8 h-8 text-purple-400" />
          JWT Decoder & Inspector
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Decode JWT headers and payload claims securely inside your browser. No tokens are sent anywhere.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Encoded JWT Token</label>
          <textarea
            rows={4}
            placeholder="Paste your JWT token string here (eyJhbGciOi...)"
            value={token}
            onChange={(e) => decodeJwt(e.target.value)}
            className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3.5 rounded-xl font-mono"
          />
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {header && payload && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-rose-400 mb-2 uppercase tracking-wider">Header (Algorithm & Type)</h4>
              <pre className="bg-obsidian-secondary border border-obsidian-border p-4 rounded-xl text-xs text-rose-300 font-mono overflow-x-auto">
                {JSON.stringify(header, null, 2)}
              </pre>
            </div>

            <div>
              <h4 className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">Payload (Data Claims)</h4>
              <pre className="bg-obsidian-secondary border border-obsidian-border p-4 rounded-xl text-xs text-purple-300 font-mono overflow-x-auto">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
