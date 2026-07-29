import React, { useState } from 'react';
import { Share2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function SocialPreviewPage() {
  const [title, setTitle] = useState('ToolsFourge - 100% Client-Side Web Utilities');
  const [description, setDescription] = useState('Free, fast, and privacy-focused online tools for PDF, image, audio, video, text, and security.');
  const [domain, setDomain] = useState('toolsfourge.com');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80');

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setImageUrl(URL.createObjectURL(acceptedFiles[0]));
      }
    },
  });

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Share2 className="w-8 h-8 text-purple-400" />
          Social Open Graph Card Preview
        </h1>
        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto">
          Preview how your website link cards will render when shared on Facebook, X (Twitter), and LinkedIn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider pb-2 border-b border-obsidian-border">Meta Tags Input</h3>

          <div>
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-1">Title (og:title)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-1">Description (og:description)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-obsidian-text-muted mb-1">Domain Name</label>
            <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full bg-obsidian-secondary border border-obsidian-border text-white text-xs p-3 rounded-xl" />
          </div>

          <div {...getRootProps()} className="border-2 border-dashed border-obsidian-border rounded-xl p-4 text-center cursor-pointer bg-obsidian-secondary/50">
            <input {...getInputProps()} />
            <ImageIcon className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">Upload Card Image (og:image)</span>
          </div>
        </div>

        {/* Live Mockups */}
        <div className="space-y-6">
          {/* X (Twitter) Card */}
          <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-gray-400 block uppercase">X (Twitter) Large Card Preview</span>
            <div className="bg-[#15202b] rounded-2xl border border-gray-700/50 overflow-hidden text-left">
              <div className="aspect-[1.91/1] bg-black overflow-hidden">
                <img src={imageUrl} alt="Social Card" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider block font-medium">{domain}</span>
                <h4 className="font-bold text-white text-sm line-clamp-1">{title}</h4>
                <p className="text-xs text-gray-400 line-clamp-2">{description}</p>
              </div>
            </div>
          </div>

          {/* Facebook Card */}
          <div className="bg-obsidian-card border border-obsidian-border rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-gray-400 block uppercase">Facebook Feed Card Preview</span>
            <div className="bg-[#242526] rounded-xl border border-gray-700/50 overflow-hidden text-left">
              <div className="aspect-[1.91/1] bg-black overflow-hidden">
                <img src={imageUrl} alt="Social Card" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 bg-[#3a3b3c]/40 space-y-1 border-t border-gray-700/50">
                <span className="text-[10px] text-gray-400 uppercase block font-medium">{domain}</span>
                <h4 className="font-bold text-white text-sm line-clamp-1">{title}</h4>
                <p className="text-xs text-gray-400 line-clamp-1">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
