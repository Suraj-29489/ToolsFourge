import React from 'react';
import {
  Wand2,
  Film,
  MessageSquare,
  Sparkles,
  Globe,
  Smartphone,
  Palette,
  FileCheck,
  Rocket,
  Video,
  Mic
} from 'lucide-react';

const upcomingTools = [
  {
    id: 'ai-bg-remover',
    title: 'AI Background Remover',
    description: 'Remove image backgrounds instantly using AI.',
    icon: Wand2,
    status: 'Coming Soon',
  },
  {
    id: 'ig-reel-downloader',
    title: 'Instagram Reel Downloader',
    description: 'Download Instagram Reels quickly.',
    icon: Film,
    status: 'Coming Soon',
  },
  {
    id: 'ai-pdf-chat',
    title: 'AI PDF Chat',
    description: 'Chat with PDFs using AI.',
    icon: MessageSquare,
    status: 'Coming Soon',
  },
  {
    id: 'ai-voice-cleaner',
    title: 'AI Voice Cleaner',
    description: 'Remove background noise from audio recordings.',
    icon: Mic,
    status: 'Coming Soon',
  },
  {
    id: 'ai-face-restoration',
    title: 'AI Face Restoration',
    description: 'Restore blurry and old faces using AI.',
    icon: Sparkles,
    status: 'Coming Soon',
  },
  {
    id: 'ai-subtitle-generator',
    title: 'AI Subtitle Generator',
    description: 'Automatically generate subtitles from videos.',
    icon: Video,
    status: 'Coming Soon',
  },
  {
    id: 'website-screenshot',
    title: 'Website Screenshot Generator',
    description: 'Capture high-quality website screenshots.',
    icon: Globe,
    status: 'Coming Soon',
  },
  {
    id: 'tiktok-downloader',
    title: 'TikTok Downloader',
    description: 'Download TikTok videos without watermark.',
    icon: Smartphone,
    status: 'Coming Soon',
  },
  {
    id: 'ai-logo-generator',
    title: 'AI Logo Generator',
    description: 'Generate professional logos with AI.',
    icon: Palette,
    status: 'Coming Soon',
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Create beautiful ATS-friendly resumes in minutes.',
    icon: FileCheck,
    status: 'Coming Soon',
  },
];

export default function UpcomingToolsSection() {
  return (
    <section className="mt-16 pt-12 border-t border-obsidian-border/60">
      {/* Header */}
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2.5">
          <Rocket className="w-7 h-7 text-purple-400" />
          Upcoming Tools
        </h2>
        <p className="text-xs sm:text-sm text-obsidian-text-muted max-w-xl mx-auto">
          We're constantly building new tools to make ToolsFourge even better. Stay tuned for these exciting upcoming features.
        </p>
      </div>

      {/* Grid: 4 cols Desktop, 2 cols Tablet, 1 col Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {upcomingTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <div
              key={tool.id}
              className="bg-obsidian-card/80 backdrop-blur-md border border-obsidian-border hover:border-purple-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-200">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-[10px] rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    {tool.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-obsidian-text-muted mt-1.5 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-obsidian-border/40 flex items-center justify-between text-[11px] text-gray-400">
                <span className="font-medium text-obsidian-text-muted">Preview Only</span>
                <span className="text-purple-400 font-bold group-hover:underline">In Pipeline &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <span className="inline-block text-xs font-semibold text-purple-300/80 bg-purple-500/5 border border-purple-500/20 px-4 py-2 rounded-full">
          ✨ More exciting tools are already in development...
        </span>
      </div>
    </section>
  );
}
