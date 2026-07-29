import React, { useState } from 'react';
import { Table, Search, Download, ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function CsvViewerPage() {
  const [csvText, setCsvText] = useState(`Name, Age, Role, Country
John Doe, 28, Developer, USA
Jane Smith, 32, Designer, UK
Alex Johnson, 24, Marketer, Canada
Maria Garcia, 29, Engineer, Spain`);

  const [searchTerm, setSearchTerm] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => setCsvText(e.target.result);
        reader.readAsText(acceptedFiles[0]);
      }
    },
  });

  const parseCsv = () => {
    const lines = csvText.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) => line.split(',').map((c) => c.trim()));
    return { headers, rows };
  };

  const { headers, rows } = parseCsv();

  const filteredRows = rows.filter((r) =>
    r.some((cell) => cell.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const downloadCsv = () => {
    const blob = new Blob([csvText], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `data_${Date.now()}.csv`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Table className="w-8 h-8 text-purple-400" />
          CSV Table Viewer & Search
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Upload and inspect CSV data inside an interactive searchable table grid.
        </p>
      </div>

      <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
        <div {...getRootProps()} className="border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-xl p-6 text-center cursor-pointer bg-obsidian-secondary/50">
          <input {...getInputProps()} />
          <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <span className="text-xs font-bold text-white block">Drop CSV File Here</span>
          <span className="text-[10px] text-obsidian-text-muted">or click to browse .csv spreadsheet</span>
        </div>

        {/* Search Bar & Download */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-obsidian-text-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search table rows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs pl-9 pr-4 py-2.5 rounded-xl outline-none"
            />
          </div>

          <button onClick={downloadCsv} className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0">
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>

        {/* Table Grid */}
        <div className="overflow-x-auto border border-obsidian-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-obsidian-secondary border-b border-obsidian-border text-purple-300 font-bold uppercase tracking-wider">
                {headers.map((h, idx) => (
                  <th key={idx} className="p-3 border-r border-obsidian-border/50 last:border-r-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-border/50 text-gray-200 font-mono">
              {filteredRows.length > 0 ? (
                filteredRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-purple-500/5 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 border-r border-obsidian-border/50 last:border-r-0">{cell}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length || 1} className="p-6 text-center text-obsidian-text-muted">No matching rows found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
