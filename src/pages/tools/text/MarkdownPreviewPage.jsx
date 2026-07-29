import React, { useState } from 'react';
import { FileText, Copy, Download, ArrowLeft, Check, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(`# Welcome to Daily Tools Markdown Editor

## Features
- **Live Preview**: See your formatted text as you type
- *Styling*: Supports headers, bold, italics, lists, and code
- [GitHub Repo](https://github.com/Suraj-29489/ToolsFourge)

### Code Example
\`\`\`js
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

- [x] Easy to use
- [x] 100% Browser-side
`);

  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `document_${Date.now()}.md`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple client-side Markdown to HTML converter
  const renderMarkdown = (text) => {
    let html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white my-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-purple-400 my-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-white pb-2 border-b border-obsidian-border mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-purple-300">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic text-gray-300">$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noreferrer" class="text-purple-400 underline hover:text-purple-300">$1</a>')
      .replace(/^-\s*\[x\]\s*(.*$)/gim, '<li class="flex items-center gap-2 text-emerald-400">✓ $1</li>')
      .replace(/^-\s*(.*$)/gim, '<li class="ml-4 list-disc text-gray-300">$1</li>')
      .replace(/\n$/gim, '<br />');

    return { __html: html };
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
          <FileText className="w-8 h-8 text-purple-400" />
          Markdown Editor & Live Preview
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Write and format Markdown documents with real-time rendering.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-obsidian-border">
          <span className="text-xs font-bold text-obsidian-text-muted uppercase tracking-wider">Markdown Editor & Preview</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setMarkdown('')} className="px-3 py-1.5 bg-obsidian-secondary hover:bg-gray-800 text-rose-400 text-xs font-bold rounded-lg flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
            <button onClick={copyText} className="px-3.5 py-1.5 bg-obsidian-secondary hover:bg-gray-800 text-white text-xs font-bold rounded-lg flex items-center gap-1">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={downloadFile} className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Download .md
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown code here..."
            className="w-full h-96 bg-obsidian-secondary border border-obsidian-border text-white text-sm p-4 rounded-xl font-mono outline-none resize-y"
          />

          <div className="w-full h-96 bg-obsidian-secondary border border-obsidian-border text-white text-sm p-4 rounded-xl overflow-y-auto space-y-2">
            <div dangerouslySetInnerHTML={renderMarkdown(markdown)} />
          </div>
        </div>
      </div>
    </main>
  );
}
