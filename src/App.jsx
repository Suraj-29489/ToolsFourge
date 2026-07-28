import React from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex flex-col selection:bg-obsidian-accent selection:text-white">
      <Navbar />
      <div className="flex-1">
        <Home />
      </div>
      <footer className="py-6 border-t border-obsidian-border/50 text-center text-xs text-obsidian-text-muted">
        <p>Daily Tools &copy; {new Date().getFullYear()} &bull; Fast & Minimal Utilities</p>
      </footer>
    </div>
  );
}
