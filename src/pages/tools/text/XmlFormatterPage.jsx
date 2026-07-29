import React, { useState } from 'react';
import { Code2, Copy, ArrowLeft, Check, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLE_XML = `<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`;

export default function XmlFormatterPage() {
  const [xml, setXml] = useState(SAMPLE_XML);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const validateXml = (input) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      setError(parseError.textContent);
      return null;
    }
    setError(null);
    return doc;
  };

  const formatXml = () => {
    const doc = validateXml(xml);
    if (!doc) return;

    const serializer = new XMLSerializer();
    let unformatted = serializer.serializeToString(doc);
    let formatted = '';
    let reg = /(>)(<)(\/*)/g;
    unformatted = unformatted.replace(reg, '$1\r\n$2$3');
    let pad = 0;

    unformatted.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      }
      let padding = '';
      for (let i = 0; i < pad; i++) padding += '  ';
      formatted += padding + node + '\r\n';
      pad += indent;
    });

    setXml(formatted.trim());
  };

  const minifyXml = () => {
    const doc = validateXml(xml);
    if (!doc) return;
    const serializer = new XMLSerializer();
    const minified = serializer.serializeToString(doc).replace(/>\s+</g, '><').trim();
    setXml(minified);
  };

  const copyXml = () => {
    navigator.clipboard.writeText(xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Code2 className="w-8 h-8 text-purple-400" />
          XML Formatter & Validator
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Beautify, minify, and validate XML documents directly in your browser.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-obsidian-border">
          <span className="text-xs font-bold text-obsidian-text-muted uppercase tracking-wider">XML Code</span>
          <div className="flex items-center gap-2">
            <button onClick={formatXml} className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Beautify
            </button>
            <button onClick={minifyXml} className="px-3.5 py-1.5 bg-obsidian-secondary hover:bg-gray-800 text-white text-xs font-bold rounded-lg">
              Minify
            </button>
            <button onClick={copyXml} className="px-3.5 py-1.5 bg-obsidian-secondary hover:bg-gray-800 text-white text-xs font-bold rounded-lg flex items-center gap-1">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-mono">{error}</span>
          </div>
        )}

        <textarea
          value={xml}
          onChange={(e) => { setXml(e.target.value); validateXml(e.target.value); }}
          rows={12}
          placeholder="Paste XML code here..."
          className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-sm p-4 rounded-xl font-mono outline-none resize-y"
        />
      </div>
    </main>
  );
}
