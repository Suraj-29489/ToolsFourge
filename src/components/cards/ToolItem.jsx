import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function ToolItem({ tool }) {
  const Icon = tool.icon;
  const navigate = useNavigate();

  const handleToolClick = () => {
    if (tool.route) {
      navigate(tool.route);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToolClick();
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Open ${tool.title}`}
      onClick={handleToolClick}
      onKeyDown={handleKeyDown}
      className="group flex items-center justify-between min-h-[48px] p-3.5 sm:p-4 bg-obsidian-card border border-obsidian-border rounded-xl transition-all duration-300 ease-in-out hover:bg-obsidian-card-hover hover:border-obsidian-accent/50 hover:shadow-lg cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-obsidian-accent focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-bg"
    >
      <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 flex-1 pr-2">
        <div className="p-2 sm:p-2.5 rounded-lg bg-obsidian-secondary text-obsidian-text-muted group-hover:text-obsidian-accent group-hover:bg-obsidian-accent/10 transition-colors duration-300 shrink-0 flex items-center justify-center">
          {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h4 className="text-xs sm:text-sm font-semibold text-obsidian-text group-hover:text-white transition-colors duration-300 truncate max-w-full">
              {tool.title}
            </h4>
            {tool.status === 'ready' && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded shrink-0">
                Active
              </span>
            )}
            {tool.status === 'beta' && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded shrink-0">
                Beta
              </span>
            )}
          </div>
          {tool.description && (
            <p className="text-[11px] sm:text-xs text-obsidian-text-muted truncate mt-0.5 leading-snug">
              {tool.description}
            </p>
          )}
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-obsidian-text-muted opacity-60 sm:opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 shrink-0 ml-1" />
    </div>
  );
}
