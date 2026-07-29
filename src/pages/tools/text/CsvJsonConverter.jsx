import React, { useState } from 'react';
import { ArrowLeftRight, Copy, ArrowLeft, Check, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CsvJsonConverter() {
  const [mode, setMode] = useState('csv2json'); // 'csv2json' | 'json2csv'
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertCsvToJson = (csvText) => {
    if (!csvText.trim()) return '';
    const lines = csvText.trim().split('\n');
    if (lines.length < 1) return '';
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const obj = {};
      const currentline = lines[i].split(',').map((item) => item.trim().replace(/^"|"$/g, ''));
      headers.forEach((header, index) => {
        obj[header] = currentline[index] || '';
      });
      result.push(obj);
    }
    return JSON.stringify(result, null, 2);
  };

  const convertJsonToCsv = (jsonText) => {
    if (!jsonText.trim()) return '';
    try {
      const arr = JSON.parse(jsonText);
      if (!Array.isArray(arr) || arr.length === 0) return 'Input must be a JSON array of objects.';
      const headers = Object.keys(arr[0]);
      const csvRows = [headers.join(',')];

      for (const row of arr) {
        const values = headers.map((header) => {
          const val = row[header] ?? '';
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      return csvRows.join('\n');
    } catch (e) {
      return 'Invalid JSON format.';
    }
  };

  const handleConvert = () => {
    if (mode === 'csv2json') {
      setOutput(convertCsvToJson(input));
    } else {
      setOutput(convertJsonToCsv(input));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
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
          <ArrowLeftRight className="w-8 h-8 text-purple-400" />
          CSV ↔ JSON Converter
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Convert data bi-directionally between CSV and JSON formats instantly.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => { setMode('csv2json'); setOutput(''); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${mode === 'csv2json' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}
          >
            CSV to JSON
          </button>
          <button
            onClick={() => { setMode('json2csv'); setOutput(''); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${mode === 'json2csv' ? 'bg-purple-600 text-white' : 'bg-obsidian-secondary text-gray-300'}`}
          >
            JSON to CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Input {mode === 'csv2json' ? 'CSV' : 'JSON'}</label>
            <textarea
              rows={10}
              placeholder={mode === 'csv2json' ? "name, age, city\nAlice, 30, New York\nBob, 25, London" : '[\n  {"name": "Alice", "age": 30},\n  {"name": "Bob", "age": 25}\n]'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3.5 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-2">Output {mode === 'csv2json' ? 'JSON' : 'CSV'}</label>
            <textarea
              rows={10}
              readOnly
              value={output}
              className="w-full bg-obsidian-secondary/60 border border-obsidian-border text-purple-300 text-xs p-3.5 rounded-xl font-mono"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleConvert} className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl">
            Convert Data
          </button>
          {output && (
            <button onClick={handleCopy} className="px-6 py-3 bg-obsidian-secondary hover:bg-gray-800 text-white font-bold text-sm rounded-xl flex items-center gap-2">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
