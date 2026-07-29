import React, { useState } from 'react';
import { Info, ArrowLeft, HardDrive, Monitor, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { formatBytes } from '../../../utils/formatters';

export default function ImageMetadataViewer() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.svg'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        const img = new Image();
        const url = URL.createObjectURL(uploadedFile);
        img.src = url;
        img.onload = () => {
          const mp = ((img.width * img.height) / 1000000).toFixed(2);
          setMetadata({
            name: uploadedFile.name,
            size: uploadedFile.size,
            type: uploadedFile.type || `image/${uploadedFile.name.split('.').pop()}`,
            width: img.width,
            height: img.height,
            aspectRatio: `${(img.width / img.height).toFixed(2)}:1`,
            megapixels: `${mp} MP`,
            lastModified: new Date(uploadedFile.lastModified).toLocaleString(),
            url,
          });
        };
      }
    },
  });

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Info className="w-8 h-8 text-purple-400" />
          Image Metadata Inspector
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Inspect image resolution, file size, megapixels, aspect ratio, and technical specs.
        </p>
      </div>

      {!file || !metadata ? (
        <div {...getRootProps()} className="bg-obsidian-card border-2 border-dashed border-obsidian-border hover:border-purple-500/50 rounded-3xl p-10 text-center cursor-pointer">
          <input {...getInputProps()} />
          <Info className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Upload Image File</h3>
          <p className="text-xs text-obsidian-text-muted">PNG, JPG, WEBP, GIF, SVG up to 25 MB</p>
        </div>
      ) : (
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-obsidian-border">
            <div className="w-48 h-48 bg-black/50 rounded-xl overflow-hidden border border-obsidian-border flex items-center justify-center p-2 shrink-0">
              <img src={metadata.url} alt="Preview" className="max-h-full max-w-full object-contain rounded" />
            </div>

            <div className="flex-1 space-y-2 min-w-0">
              <h3 className="text-xl font-bold text-white truncate" title={metadata.name}>{metadata.name}</h3>
              <span className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono rounded-lg uppercase font-bold">
                {metadata.type}
              </span>
            </div>

            <button onClick={() => { setFile(null); setMetadata(null); }} className="px-4 py-2 bg-obsidian-secondary border border-obsidian-border text-xs text-white rounded-xl">
              Change Image
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-obsidian-secondary p-4 rounded-xl border border-obsidian-border">
              <Monitor className="w-4 h-4 text-purple-400 mb-1" />
              <span className="text-[10px] text-obsidian-text-muted block">Dimensions</span>
              <span className="text-sm font-bold text-white">{metadata.width} × {metadata.height} px</span>
            </div>

            <div className="bg-obsidian-secondary p-4 rounded-xl border border-obsidian-border">
              <HardDrive className="w-4 h-4 text-purple-400 mb-1" />
              <span className="text-[10px] text-obsidian-text-muted block">File Size</span>
              <span className="text-sm font-bold text-white">{formatBytes(metadata.size)}</span>
            </div>

            <div className="bg-obsidian-secondary p-4 rounded-xl border border-obsidian-border">
              <FileText className="w-4 h-4 text-purple-400 mb-1" />
              <span className="text-[10px] text-obsidian-text-muted block">Megapixels</span>
              <span className="text-sm font-bold text-white">{metadata.megapixels}</span>
            </div>

            <div className="bg-obsidian-secondary p-4 rounded-xl border border-obsidian-border">
              <Calendar className="w-4 h-4 text-purple-400 mb-1" />
              <span className="text-[10px] text-obsidian-text-muted block">Aspect Ratio</span>
              <span className="text-sm font-bold text-white">{metadata.aspectRatio}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
