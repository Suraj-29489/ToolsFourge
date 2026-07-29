import React, { useState, useCallback, useEffect } from 'react';
import ImageUploadZone from '../../../components/tools/image/ImageUploadZone';
import UpscaleSettingsPanel from '../../../components/tools/image/UpscaleSettingsPanel';
import ProcessingOverlay from '../../../components/tools/image/ProcessingOverlay';
import UpscaleResultView from '../../../components/tools/image/UpscaleResultView';
import { extractImageMetadata } from '../../../utils/imageMetadata';
import { upscaleImage } from '../../../utils/aiUpscalerEngine';
import { Sparkles, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AiImageUpscaler() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const [settings, setSettings] = useState({
    scale: 2,
    mode: 'ai',
    noiseReduction: 'off',
    preserveTransparency: true,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

  const cleanupResult = useCallback(() => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }
  }, [result]);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
      if (metadata?.objectUrl) URL.revokeObjectURL(metadata.objectUrl);
    };
  }, [result, metadata]);

  const handleFileSelect = async (file) => {
    try {
      cleanupResult();
      setErrorNotice(null);
      const meta = await extractImageMetadata(file);
      setSelectedFile(file);
      setMetadata(meta);
    } catch (err) {
      console.error(err);
      setErrorNotice(err.message || 'Failed to read image file.');
    }
  };

  const handleReset = useCallback(() => {
    cleanupResult();
    if (metadata?.objectUrl) {
      URL.revokeObjectURL(metadata.objectUrl);
    }
    setSelectedFile(null);
    setMetadata(null);
    setErrorNotice(null);
  }, [cleanupResult, metadata]);

  const handleUpdateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleUpscale = async () => {
    if (!selectedFile || !metadata) return;

    setIsProcessing(true);
    setProgressPct(0);
    setErrorNotice(null);
    cleanupResult();

    try {
      const res = await upscaleImage(
        selectedFile,
        settings,
        (step) => setCurrentStep(step),
        (pct) => setProgressPct(pct)
      );

      setResult(res);
      setIsProcessing(false);
    } catch (err) {
      console.error('Upscale error:', err);
      setIsProcessing(false);
      setErrorNotice(err.message || 'Image upscaling failed. Please try Fast mode or a smaller image.');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 animate-fade-in">
      {/* Back Link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-obsidian-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          100% Browser-Based AI Engine
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
          <div className="p-2.5 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/30">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          AI Image <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">Upscaler</span>
        </h1>

        <p className="text-sm sm:text-base text-obsidian-text-muted max-w-xl mx-auto leading-relaxed">
          Enhance image quality, increase resolution up to 4×, and remove noise using browser AI. No server uploads.
        </p>
      </div>

      {/* Error Notice */}
      {errorNotice && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm text-center">
          {errorNotice}
        </div>
      )}

      {/* Upload Zone */}
      <ImageUploadZone
        onFileSelect={handleFileSelect}
        selectedFile={selectedFile}
        metadata={metadata}
        onReset={handleReset}
      />

      {/* Workspace Controls (shown when image is loaded & not yet upscaled) */}
      {selectedFile && metadata && !result && (
        <div className="space-y-8 animate-fade-in">
          <UpscaleSettingsPanel
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />

          {/* Upscale Action Trigger */}
          <div className="text-center pt-2">
            <button
              onClick={handleUpscale}
              disabled={isProcessing}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-base sm:text-lg font-bold rounded-2xl shadow-2xl shadow-purple-600/40 hover:shadow-purple-500/60 flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none mx-auto min-h-[54px]"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
              Upscale Image ({settings.scale}×)
            </button>
            <p className="text-xs text-obsidian-text-muted mt-3">
              The AI neural network model will lazy-load directly inside your browser upon clicking.
            </p>
          </div>
        </div>
      )}

      {/* Upscale Result View */}
      {result && (
        <UpscaleResultView
          result={result}
          originalMetadata={metadata}
          settings={settings}
          onReset={handleReset}
        />
      )}

      {/* Processing Status Modal Overlay */}
      <ProcessingOverlay
        isProcessing={isProcessing}
        progressPct={progressPct}
        currentStep={currentStep}
      />
    </main>
  );
}
