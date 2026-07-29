import React, { useState } from 'react';
import { Code, Download, ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f1117; color: white; padding: 2rem; }
    h1 { color: #8b5cf6; }
    .card { background: #181c24; padding: 1.5rem; border-radius: 12px; border: 1px solid #2b313d; }
    button { background: #8b5cf6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello from Daily Tools HTML Sandbox!</h1>
    <p>Edit HTML & CSS in real time to see instant visual changes.</p>
    <button onclick="alert('Button clicked!')">Click Me</button>
  </div>
</body>
</html>`;

export default function HtmlPreviewPage() {
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);

  const downloadFile = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `index_${Date.now()}.html`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Code className="w-8 h-8 text-purple-400" />
          Live HTML / CSS Viewer & Sandbox
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Edit raw HTML & CSS code with an instant sandboxed live preview.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-obsidian-border">
          <span className="text-xs font-bold text-obsidian-text-muted uppercase tracking-wider">HTML & CSS Sandbox</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setHtmlCode(DEFAULT_HTML)} className="px-3 py-1.5 bg-obsidian-secondary hover:bg-gray-800 text-white text-xs font-bold rounded-lg flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Reset Template
            </button>
            <button onClick={() => setHtmlCode('')} className="px-3 py-1.5 bg-obsidian-secondary hover:bg-gray-800 text-rose-400 text-xs font-bold rounded-lg flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
            <button onClick={downloadFile} className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Download .html
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder="Type your HTML code here..."
            className="w-full h-96 bg-obsidian-secondary border border-obsidian-border text-white text-sm p-4 rounded-xl font-mono outline-none resize-y"
          />

          <div className="w-full h-96 bg-obsidian-secondary border border-obsidian-border rounded-xl overflow-hidden">
            <iframe
              srcDoc={htmlCode}
              title="HTML Sandbox Output"
              sandbox="allow-scripts"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
