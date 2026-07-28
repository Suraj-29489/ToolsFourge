import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-[70px] bg-[#0b0d12] border-b border-obsidian-border/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-200">
      <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between">
        {/* Left Side: Clickable Logo & Website Name */}
        <Link 
          to="/" 
          className="flex items-center space-x-3 select-none group"
          aria-label="Daily Tools Homepage"
        >
          <div className="w-9 h-9 rounded-lg bg-obsidian-accent/10 border border-obsidian-accent/20 flex items-center justify-center text-obsidian-accent shadow-sm group-hover:scale-105 transition-transform duration-200">
            {/* Minimal Geometric Hexagon Logo */}
            <svg 
              className="w-5 h-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="2" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-obsidian-text group-hover:text-white transition-colors duration-200">
            Daily Tools
          </span>
        </Link>

        {/* Right side intentionally left empty */}
        <div></div>
      </div>
    </header>
  );
}
