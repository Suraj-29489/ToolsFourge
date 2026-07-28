import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import ToolHeader from '../../../components/common/ToolHeader';
import DropZone from '../../../components/common/DropZone';
import ProgressBar from '../../../components/common/ProgressBar';
import ErrorState from '../../../components/common/ErrorState';
import { useFileDrop } from '../../../hooks/useFileDrop';
import { useDownload } from '../../../hooks/useDownload';
import { useProcessing } from '../../../hooks/useProcessing';
import { FileOutput, Download, FileText } from 'lucide-react';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToImages() {
  const { files, isDragging, error: fileError, onDragOver, onDragLeave, onDrop, onFileSelect, clearFiles } = useFileDrop({ accept: '.pdf,application/pdf', multiple: false });
  const { downloadDataUrl } = useDownload();
  const { processing, progress, statusMessage, error: procError, startProcessing, updateProgress, finishProcessing, failProcessing } = useProcessing();

  const [renderedImages, setRenderedImages] = useState([]);

  const handleConvert = async () => {
    if (files.length === 0) return;
    const file = files[0];
    startProcessing('Rendering PDF pages to images...');
    setRenderedImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      const imagesList = [];

      for (let i = 1; i <= total; i++) {
        updateProgress(Math.round((i / total) * 90), `Rendering page ${i} of ${total}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/png');
        imagesList.push({ pageNum: i, dataUrl });
      }

      setRenderedImages(imagesList);
      finishProcessing();
    } catch (err) {
      console.error(err);
      failProcessing('Failed to render PDF pages. Ensure file is valid.');
    }
  };

  return (
    <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToolHeader
        title="PDF to Images"
        description="Convert each page of a PDF document into high-resolution PNG images."
        icon={FileOutput}
      />

      <ErrorState error={fileError || procError} />

      {files.length === 0 ? (
        <DropZone
          accept=".pdf,application/pdf"
          multiple={false}
          onFileSelect={onFileSelect}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          isDragging={isDragging}
          title="Drag & drop a PDF file here"
          subtitle="Select 1 PDF file to convert"
        />
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-obsidian-border">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-base font-bold text-obsidian-text">{files[0].name}</h3>
                <p className="text-xs text-obsidian-text-muted">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => { clearFiles(); setRenderedImages([]); }} className="text-xs text-obsidian-text-muted hover:text-white underline">
              Change File
            </button>
          </div>

          {processing && <ProgressBar progress={progress} statusMessage={statusMessage} />}

          {renderedImages.length === 0 && !processing && (
            <button
              onClick={handleConvert}
              className="w-full py-3.5 px-6 rounded-xl bg-obsidian-accent hover:bg-obsidian-accent-hover text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-obsidian-accent/20"
            >
              <FileOutput className="w-4 h-4" />
              <span>Convert PDF Pages to Images</span>
            </button>
          )}

          {renderedImages.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-obsidian-text mb-4">
                Converted Pages ({renderedImages.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderedImages.map((img) => (
                  <div key={img.pageNum} className="bg-obsidian-secondary border border-obsidian-border p-3 rounded-xl">
                    <img src={img.dataUrl} alt={`Page ${img.pageNum}`} className="w-full h-44 object-contain rounded bg-black/40 mb-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium text-obsidian-text-muted">Page #{img.pageNum}</span>
                      <button
                        onClick={() => downloadDataUrl(img.dataUrl, `page_${img.pageNum}.png`)}
                        className="px-3 py-1.5 rounded-lg bg-obsidian-accent text-white font-semibold text-xs flex items-center space-x-1 hover:bg-obsidian-accent-hover"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
