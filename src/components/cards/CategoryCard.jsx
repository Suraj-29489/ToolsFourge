import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function CategoryCard({ category, isOpen, onToggle }) {
  const Icon = category.icon;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}
      aria-controls={`accordion-${category.id}`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={`group relative flex flex-col justify-between p-4 sm:p-6 rounded-2xl border min-h-[140px] sm:min-h-[170px] transition-all duration-300 ease-in-out cursor-pointer outline-none select-none focus-visible:ring-2 focus-visible:ring-obsidian-accent focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-bg ${
        isOpen
          ? 'bg-obsidian-card-hover border-obsidian-accent shadow-lg shadow-obsidian-accent/10 ring-1 ring-obsidian-accent/30'
          : 'bg-obsidian-card border-obsidian-border hover:bg-obsidian-card-hover hover:border-obsidian-accent/50 md:hover:scale-[1.03] hover:shadow-xl'
      }`}
    >
      {/* Top Row: Category Icon & Chevron Toggle Indicator */}
      <div className="flex items-start justify-between w-full">
        <div 
          className="p-2.5 sm:p-3 rounded-xl bg-obsidian-secondary border border-obsidian-border group-hover:border-obsidian-accent/30 transition-colors duration-300 flex items-center justify-center shrink-0"
          style={{ color: category.categoryColor || '#8b5cf6' }}
        >
          {Icon && <Icon className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />}
        </div>
        <div
          className={`p-2 rounded-lg transition-transform duration-300 flex items-center justify-center shrink-0 min-w-[36px] min-h-[36px] ${
            isOpen
              ? 'rotate-180 bg-obsidian-accent/20 text-obsidian-accent'
              : 'text-obsidian-text-muted group-hover:text-obsidian-text'
          }`}
        >
          <ChevronDown className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom Row: Name and Description */}
      <div className="mt-3 sm:mt-4">
        <h3 className="text-base sm:text-lg font-bold text-obsidian-text group-hover:text-white transition-colors duration-300 truncate">
          {category.name}
        </h3>
        <p className="text-xs text-obsidian-text-muted mt-0.5 sm:mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
          {category.description}
        </p>
      </div>

      {/* Active Indicator Line */}
      {isOpen && (
        <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 h-0.5 bg-obsidian-accent rounded-full animate-fade-in" />
      )}
    </div>
  );
}
