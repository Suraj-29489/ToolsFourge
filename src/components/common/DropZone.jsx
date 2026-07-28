import React, { useRef } from 'react';
import { Upload, FileUp } from 'lucide-react';

export default function DropZone({
  onFileSelect,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging,
  accept = '*/*',
  multiple = true,
  title = 'Drag & drop files here',
  subtitle = 'or click to browse from your device',
}) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={handleClick}
      className={`group relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 select-none ${
        isDragging
          ? 'border-obsidian-accent bg-obsidian-accent/10 scale-[1.01]'
          : 'border-obsidian-border bg-obsidian-card hover:bg-obsidian-card-hover hover:border-obsidian-accent/50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onFileSelect}
        className="hidden"
      />

      <div className="p-4 rounded-2xl bg-obsidian-secondary border border-obsidian-border text-obsidian-accent group-hover:scale-110 transition-transform duration-200 mb-4">
        {isDragging ? (
          <FileUp className="w-8 h-8 animate-bounce" />
        ) : (
          <Upload className="w-8 h-8" />
        )}
      </div>

      <h3 className="text-base font-bold text-obsidian-text text-center">
        {title}
      </h3>
      <p className="text-xs text-obsidian-text-muted mt-1 text-center">
        {subtitle}
      </p>

      <span className="mt-4 px-4 py-2 rounded-xl bg-obsidian-secondary border border-obsidian-border text-xs font-semibold text-obsidian-text group-hover:bg-obsidian-accent group-hover:border-obsidian-accent group-hover:text-white transition-all duration-200">
        Choose Files
      </span>
    </div>
  );
}
