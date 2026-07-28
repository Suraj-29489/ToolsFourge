import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function ToolHeader({ title, description, icon: Icon, badge = 'Client-side' }) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm text-obsidian-text-muted hover:text-obsidian-accent transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Utilities</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-obsidian-card border border-obsidian-border rounded-2xl p-6 shadow-xl">
        <div className="flex items-start space-x-4">
          {Icon && (
            <div className="p-3.5 rounded-2xl bg-obsidian-accent/10 border border-obsidian-accent/20 text-obsidian-accent flex-shrink-0">
              <Icon className="w-7 h-7" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-obsidian-text tracking-tight">
                {title}
              </h1>
              {badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{badge}</span>
                </span>
              )}
            </div>
            <p className="text-sm text-obsidian-text-muted mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
