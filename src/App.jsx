import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import VideoDownloader from './pages/VideoDownloader';

// PDF Tools
import MergePdf from './pages/tools/pdf/MergePdf';
import SplitPdf from './pages/tools/pdf/SplitPdf';
import RotatePdf from './pages/tools/pdf/RotatePdf';
import ImagesToPdf from './pages/tools/pdf/ImagesToPdf';
import PdfToImages from './pages/tools/pdf/PdfToImages';
import UnlockPdf from './pages/tools/pdf/UnlockPdf';

// Image Tools
import ImageConverter from './pages/tools/image/ImageConverter';
import ResizeImage from './pages/tools/image/ResizeImage';
import CropImage from './pages/tools/image/CropImage';
import CompressImage from './pages/tools/image/CompressImage';
import ImageToIco from './pages/tools/image/ImageToIco';

// Audio Tools
import TrimAudio from './pages/tools/audio/TrimAudio';
import MergeAudio from './pages/tools/audio/MergeAudio';
import VolumeBooster from './pages/tools/audio/VolumeBooster';
import AudioCompressor from './pages/tools/audio/AudioCompressor';
import Mp3Converter from './pages/tools/audio/Mp3Converter';

// Utility Tools
import QrGenerator from './pages/tools/utilities/QrGenerator';
import PasswordGenerator from './pages/tools/utilities/PasswordGenerator';
import UuidGenerator from './pages/tools/utilities/UuidGenerator';
import Base64Encoder from './pages/tools/utilities/Base64Encoder';
import TimestampConverter from './pages/tools/utilities/TimestampConverter';
import JsonFormatter from './pages/tools/utilities/JsonFormatter';
import WordCounter from './pages/tools/utilities/WordCounter';
import TextCompare from './pages/tools/utilities/TextCompare';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex flex-col selection:bg-obsidian-accent selection:text-white">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* PDF Tools */}
            <Route path="/tools/merge-pdf" element={<MergePdf />} />
            <Route path="/tools/split-pdf" element={<SplitPdf />} />
            <Route path="/tools/rotate-pdf" element={<RotatePdf />} />
            <Route path="/tools/images-to-pdf" element={<ImagesToPdf />} />
            <Route path="/tools/pdf-to-images" element={<PdfToImages />} />
            <Route path="/tools/unlock-pdf" element={<UnlockPdf />} />
            <Route path="/tools/watermark-pdf" element={<RotatePdf />} />

            {/* Image Tools */}
            <Route path="/tools/jpg-to-png" element={<ImageConverter targetFormat="png" defaultTitle="JPG to PNG Converter" />} />
            <Route path="/tools/png-to-jpg" element={<ImageConverter targetFormat="jpeg" defaultTitle="PNG to JPG Converter" />} />
            <Route path="/tools/webp-to-png" element={<ImageConverter targetFormat="png" defaultTitle="WEBP to PNG Converter" />} />
            <Route path="/tools/png-to-webp" element={<ImageConverter targetFormat="webp" defaultTitle="PNG to WEBP Converter" />} />
            <Route path="/tools/resize-image" element={<ResizeImage />} />
            <Route path="/tools/crop-image" element={<CropImage />} />
            <Route path="/tools/compress-image" element={<CompressImage />} />
            <Route path="/tools/image-to-ico" element={<ImageToIco />} />

            {/* Audio Tools */}
            <Route path="/tools/trim-audio" element={<TrimAudio />} />
            <Route path="/tools/merge-audio" element={<MergeAudio />} />
            <Route path="/tools/volume-booster" element={<VolumeBooster />} />
            <Route path="/tools/audio-compressor" element={<AudioCompressor />} />
            <Route path="/tools/mp3-converter" element={<Mp3Converter />} />
            <Route path="/tools/extract-audio" element={<Mp3Converter />} />

            {/* Utility Tools */}
            <Route path="/tools/qr-generator" element={<QrGenerator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/base64-encoder" element={<Base64Encoder />} />
            <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/text-compare" element={<TextCompare />} />

            {/* Video Tools */}
            <Route path="/tools/video-downloader" element={<VideoDownloader />} />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <footer className="py-6 border-t border-obsidian-border/50 text-center text-xs text-obsidian-text-muted">
          <p>ToolsFourge &copy; {new Date().getFullYear()} &bull; 100% Client-Side Web Utilities</p>
        </footer>
      </div>
    </Router>
  );
}
