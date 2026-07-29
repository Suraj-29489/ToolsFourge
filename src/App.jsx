import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';

// Video Tools
import VideoDownloader from './pages/VideoDownloader';
import VideoCompressorPage from './pages/tools/video/VideoCompressorPage';
import VideoTrimmerPage from './pages/tools/video/VideoTrimmerPage';
import ConvertVideoPage from './pages/tools/video/ConvertVideoPage';
import MuteVideoPage from './pages/tools/video/MuteVideoPage';
import VideoSpeedPage from './pages/tools/video/VideoSpeedPage';
import ReverseVideoPage from './pages/tools/video/ReverseVideoPage';
import ThumbnailGeneratorPage from './pages/tools/video/ThumbnailGeneratorPage';
import GifMakerPage from './pages/tools/video/GifMakerPage';

// PDF Tools
import MergePdf from './pages/tools/pdf/MergePdf';
import SplitPdf from './pages/tools/pdf/SplitPdf';
import RotatePdf from './pages/tools/pdf/RotatePdf';
import ImagesToPdf from './pages/tools/pdf/ImagesToPdf';
import PdfToImages from './pages/tools/pdf/PdfToImages';
import UnlockPdf from './pages/tools/pdf/UnlockPdf';
import PdfPageNumbering from './pages/tools/pdf/PdfPageNumbering';
import DeletePdfPages from './pages/tools/pdf/DeletePdfPages';
import ProtectPdf from './pages/tools/pdf/ProtectPdf';

// Image Tools
import AiImageUpscaler from './pages/tools/image/AiImageUpscaler';
import ImageConverter from './pages/tools/image/ImageConverter';
import ResizeImage from './pages/tools/image/ResizeImage';
import CropImage from './pages/tools/image/CropImage';
import CompressImage from './pages/tools/image/CompressImage';
import ImageToIco from './pages/tools/image/ImageToIco';
import ImageFilters from './pages/tools/image/ImageFilters';
import ColorPaletteExtractor from './pages/tools/image/ColorPaletteExtractor';
import ImageCollageMaker from './pages/tools/image/ImageCollageMaker';
import BorderGenerator from './pages/tools/image/BorderGenerator';
import ImageMetadataViewer from './pages/tools/image/ImageMetadataViewer';
import SvgToPng from './pages/tools/image/SvgToPng';
import PixelateImage from './pages/tools/image/PixelateImage';

// Audio Tools
import TrimAudio from './pages/tools/audio/TrimAudio';
import MergeAudio from './pages/tools/audio/MergeAudio';
import VolumeBooster from './pages/tools/audio/VolumeBooster';
import AudioCompressor from './pages/tools/audio/AudioCompressor';
import Mp3Converter from './pages/tools/audio/Mp3Converter';
import VoiceRecorderPage from './pages/tools/audio/VoiceRecorderPage';
import AudioVisualizerPage from './pages/tools/audio/AudioVisualizerPage';
import ReverseAudioPage from './pages/tools/audio/ReverseAudioPage';
import AudioSpeedPage from './pages/tools/audio/AudioSpeedPage';

// Text Tools
import TextCaseConverter from './pages/tools/text/TextCaseConverter';
import CsvJsonConverter from './pages/tools/text/CsvJsonConverter';
import MarkdownPreviewPage from './pages/tools/text/MarkdownPreviewPage';
import HtmlPreviewPage from './pages/tools/text/HtmlPreviewPage';
import LoremIpsumPage from './pages/tools/text/LoremIpsumPage';
import XmlFormatterPage from './pages/tools/text/XmlFormatterPage';
import CsvViewerPage from './pages/tools/text/CsvViewerPage';

// Security Tools
import HashGenerator from './pages/tools/security/HashGenerator';
import JwtDecoder from './pages/tools/security/JwtDecoder';

// Developer Tools
import ColorConverter from './pages/tools/developer/ColorConverter';
import CronGeneratorPage from './pages/tools/developer/CronGeneratorPage';
import RegexTesterPage from './pages/tools/developer/RegexTesterPage';

// Creative Tools
import CssGenerators from './pages/tools/creative/CssGenerators';
import SignatureGeneratorPage from './pages/tools/creative/SignatureGeneratorPage';
import AvatarGeneratorPage from './pages/tools/creative/AvatarGeneratorPage';
import MemeGeneratorPage from './pages/tools/creative/MemeGeneratorPage';

// Social Tools
import YouTubeThumbnailPage from './pages/tools/social/YouTubeThumbnailPage';
import SocialPreviewPage from './pages/tools/social/SocialPreviewPage';

// Utility Tools
import QrGenerator from './pages/tools/utilities/QrGenerator';
import PasswordGenerator from './pages/tools/utilities/PasswordGenerator';
import UuidGenerator from './pages/tools/utilities/UuidGenerator';
import Base64Encoder from './pages/tools/utilities/Base64Encoder';
import TimestampConverter from './pages/tools/utilities/TimestampConverter';
import JsonFormatter from './pages/tools/utilities/JsonFormatter';
import WordCounter from './pages/tools/utilities/WordCounter';
import TextCompare from './pages/tools/utilities/TextCompare';
import UnitConverter from './pages/tools/utilities/UnitConverter';
import CalculatorsSuite from './pages/tools/utilities/CalculatorsSuite';
import RandomGeneratorsPage from './pages/tools/utilities/RandomGeneratorsPage';
import StopwatchTimerPage from './pages/tools/utilities/StopwatchTimerPage';

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
            <Route path="/tools/pdf-page-numbering" element={<PdfPageNumbering />} />
            <Route path="/tools/delete-pdf-pages" element={<DeletePdfPages />} />
            <Route path="/tools/protect-pdf" element={<ProtectPdf />} />

            {/* Image Tools */}
            <Route path="/tools/ai-image-upscaler" element={<AiImageUpscaler />} />
            <Route path="/tools/jpg-to-png" element={<ImageConverter targetFormat="png" defaultTitle="JPG to PNG Converter" />} />
            <Route path="/tools/png-to-jpg" element={<ImageConverter targetFormat="jpeg" defaultTitle="PNG to JPG Converter" />} />
            <Route path="/tools/webp-to-png" element={<ImageConverter targetFormat="png" defaultTitle="WEBP to PNG Converter" />} />
            <Route path="/tools/png-to-webp" element={<ImageConverter targetFormat="webp" defaultTitle="PNG to WEBP Converter" />} />
            <Route path="/tools/resize-image" element={<ResizeImage />} />
            <Route path="/tools/crop-image" element={<CropImage />} />
            <Route path="/tools/compress-image" element={<CompressImage />} />
            <Route path="/tools/image-to-ico" element={<ImageToIco />} />
            <Route path="/tools/image-filters" element={<ImageFilters />} />
            <Route path="/tools/color-palette-extractor" element={<ColorPaletteExtractor />} />
            <Route path="/tools/image-collage-maker" element={<ImageCollageMaker />} />
            <Route path="/tools/border-generator" element={<BorderGenerator />} />
            <Route path="/tools/image-metadata-viewer" element={<ImageMetadataViewer />} />
            <Route path="/tools/svg-to-png" element={<SvgToPng />} />
            <Route path="/tools/pixelate-image" element={<PixelateImage />} />

            {/* Audio Tools */}
            <Route path="/tools/trim-audio" element={<TrimAudio />} />
            <Route path="/tools/merge-audio" element={<MergeAudio />} />
            <Route path="/tools/volume-booster" element={<VolumeBooster />} />
            <Route path="/tools/audio-compressor" element={<AudioCompressor />} />
            <Route path="/tools/mp3-converter" element={<Mp3Converter />} />
            <Route path="/tools/extract-audio" element={<Mp3Converter />} />
            <Route path="/tools/voice-recorder" element={<VoiceRecorderPage />} />
            <Route path="/tools/audio-visualizer" element={<AudioVisualizerPage />} />
            <Route path="/tools/reverse-audio" element={<ReverseAudioPage />} />
            <Route path="/tools/audio-speed" element={<AudioSpeedPage />} />

            {/* Text Tools */}
            <Route path="/tools/text-case-converter" element={<TextCaseConverter />} />
            <Route path="/tools/csv-json-converter" element={<CsvJsonConverter />} />
            <Route path="/tools/markdown-preview" element={<MarkdownPreviewPage />} />
            <Route path="/tools/html-preview" element={<HtmlPreviewPage />} />
            <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumPage />} />
            <Route path="/tools/xml-formatter" element={<XmlFormatterPage />} />
            <Route path="/tools/csv-viewer" element={<CsvViewerPage />} />

            {/* Security Tools */}
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />

            {/* Developer Tools */}
            <Route path="/tools/color-converter" element={<ColorConverter />} />
            <Route path="/tools/cron-generator" element={<CronGeneratorPage />} />
            <Route path="/tools/regex-tester" element={<RegexTesterPage />} />

            {/* Creative Tools */}
            <Route path="/tools/css-generators" element={<CssGenerators />} />
            <Route path="/tools/digital-signature" element={<SignatureGeneratorPage />} />
            <Route path="/tools/avatar-generator" element={<AvatarGeneratorPage />} />
            <Route path="/tools/meme-generator" element={<MemeGeneratorPage />} />

            {/* Social Tools */}
            <Route path="/tools/youtube-thumbnail" element={<YouTubeThumbnailPage />} />
            <Route path="/tools/social-preview" element={<SocialPreviewPage />} />

            {/* Utility Tools */}
            <Route path="/tools/qr-generator" element={<QrGenerator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/base64-encoder" element={<Base64Encoder />} />
            <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/text-compare" element={<TextCompare />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/calculators" element={<CalculatorsSuite />} />
            <Route path="/tools/random-generators" element={<RandomGeneratorsPage />} />
            <Route path="/tools/stopwatch-timer" element={<StopwatchTimerPage />} />

            {/* Video Tools */}
            <Route path="/tools/video-downloader" element={<VideoDownloader />} />
            <Route path="/tools/video-compressor" element={<VideoCompressorPage />} />
            <Route path="/tools/trim-video" element={<VideoTrimmerPage />} />
            <Route path="/tools/convert-video" element={<ConvertVideoPage />} />
            <Route path="/tools/extract-audio-video" element={<Mp3Converter />} />
            <Route path="/tools/mute-video" element={<MuteVideoPage />} />
            <Route path="/tools/video-speed" element={<VideoSpeedPage />} />
            <Route path="/tools/reverse-video" element={<ReverseVideoPage />} />
            <Route path="/tools/thumbnail-generator" element={<ThumbnailGeneratorPage />} />
            <Route path="/tools/gif-maker" element={<GifMakerPage />} />

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
