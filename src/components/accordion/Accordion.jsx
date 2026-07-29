import React, { useEffect, useRef } from 'react';
import ToolItem from '../cards/ToolItem';
import { X, Wrench, AlertCircle } from 'lucide-react';
import { CATEGORY_IDS } from '../../constants/categories';

export default function Accordion({ activeCategory, tools, onClose, isMobileInline = false }) {
  const containerRef = useRef(null);

  // Auto scroll into view on mobile if partially offscreen when opened
  useEffect(() => {
    if (activeCategory && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const isOut = rect.top < 0 || rect.bottom > window.innerHeight;
      if (isOut) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeCategory?.id]);

  if (!activeCategory) return null;

  const isUpcoming = activeCategory.id === CATEGORY_IDS.UPCOMING;
  const CategoryIcon = activeCategory.icon;

  return (
    <section
      ref={containerRef}
      id={`accordion-${activeCategory.id}`}
      aria-label={`${activeCategory.name} Tools`}
      className={`w-full bg-obsidian-secondary/95 border border-obsidian-border rounded-2xl p-4 sm:p-6 shadow-2xl transition-all duration-300 ease-in-out animate-fade-in ${
        isMobileInline ? 'mt-3 mb-2' : 'mt-6'
      }`}
    >
      {/* Header bar of expanded section */}
      <div className="flex items-center justify-between pb-3.5 mb-4 sm:mb-5 border-b border-obsidian-border/60">
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div 
            className="p-2 rounded-lg bg-obsidian-card border border-obsidian-border shrink-0"
            style={{ color: activeCategory.categoryColor || '#8b5cf6' }}
          >
            {CategoryIcon && <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-obsidian-text truncate">
              {activeCategory.name} Tools
            </h3>
            <p className="text-[11px] sm:text-xs text-obsidian-text-muted truncate">
              {isUpcoming ? 'Category status update' : `${tools.length} available utilities`}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close tools section"
          className="min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-lg text-obsidian-text-muted hover:text-obsidian-text hover:bg-obsidian-card border border-transparent hover:border-obsidian-border transition-all duration-200 shrink-0 ml-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      {isUpcoming ? (
        /* Special Upcoming Banner */
        <div className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 text-center bg-obsidian-card/50 border border-dashed border-obsidian-border rounded-xl">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
            <Wrench className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-obsidian-text">
            🚧 More tools are on the way.
          </h4>
          <p className="text-xs sm:text-sm text-obsidian-text-muted mt-1 max-w-md leading-relaxed">
            Stay tuned for future updates. New utilities will be added here regularly.
          </p>
        </div>
      ) : tools.length === 0 ? (
        /* Empty State Fallback */
        <div className="flex flex-col items-center justify-center py-8 text-center text-obsidian-text-muted">
          <AlertCircle className="w-7 h-7 mb-2 opacity-50 text-purple-400" />
          <p className="text-xs sm:text-sm font-medium">No tools available yet.</p>
        </div>
      ) : (
        /* Responsive Grid of Horizontal Tool Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {tools.map((tool) => (
            <ToolItem key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
