import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import VideoDownloader from './pages/VideoDownloader';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex flex-col selection:bg-obsidian-accent selection:text-white">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools/video-downloader" element={<VideoDownloader />} />
            {/* Fallback route for all other tools -> redirect to Home or Video Downloader */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <footer className="py-6 border-t border-obsidian-border/50 text-center text-xs text-obsidian-text-muted">
          <p>Daily Tools &copy; {new Date().getFullYear()} &bull; Fast & Minimal Utilities</p>
        </footer>
      </div>
    </Router>
  );
}
