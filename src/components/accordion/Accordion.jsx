import React from 'react';
import ToolItem from '../cards/ToolItem';
import { X, Wrench, AlertCircle } from 'lucide-react';
import { CATEGORY_IDS } from '../../constants/categories';

export default function Accordion({ activeCategory, tools, onClose }) {
  if (!activeCategory) return null;

  const isUpcoming = activeCategory.id === CATEGORY_IDS.UPCOMING;
  const CategoryIcon = activeCategory.icon;

  return (
    <section
      id={`accordion-${activeCategory.id}`}
      aria-label={`${activeCategory.name} Tools`}
      className="w-full mt-6 bg-obsidian-secondary/90 border border-obsidian-border rounded-2xl p-5 sm:p-6 shadow-2xl transition-all duration-200 ease-in-out animate-fade-in"
    >
      {/* Header bar of expanded section */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-obsidian-border/60">
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg bg-obsidian-card border border-obsidian-border"
            style={{ color: activeCategory.categoryColor || '#8b5cf6' }}
          >
            {CategoryIcon && <CategoryIcon className="w-5 h-5" aria-hidden="true" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-obsidian-text">
              {activeCategory.name} Tools
            </h3>
            <p className="text-xs text-obsidian-text-muted">
              {isUpcoming ? 'Category status update' : `${tools.length} available utilities`}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close tools section"
          className="p-2 rounded-lg text-obsidian-text-muted hover:text-obsidian-text hover:bg-obsidian-card border border-transparent hover:border-obsidian-border transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      {isUpcoming ? (
        /* Special Upcoming Banner */
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-obsidian-card/50 border border-dashed border-obsidian-border rounded-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3.5">
            <Wrench className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-semibold text-obsidian-text">
            🚧 More tools are on the way.
          </h4>
          <p className="text-sm text-obsidian-text-muted mt-1 max-w-md">
            Stay tuned for future updates. New utilities will be added here regularly.
          </p>
        </div>
      ) : tools.length === 0 ? (
        /* Empty State Fallback */
        <div className="flex flex-col items-center justify-center py-8 text-center text-obsidian-text-muted">
          <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm font-medium">No tools available yet.</p>
        </div>
      ) : (
        /* Grid of Thin Horizontal Tool Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {tools.map((tool) => (
            <ToolItem key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
