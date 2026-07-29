import React from 'react';
import { Sliders, Cpu, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function UpscaleSettingsPanel({ settings, onUpdateSettings }) {
  const SCALE_OPTIONS = [
    { value: 2, label: '2× Upscale', desc: 'Double resolution' },
    { value: 4, label: '4× Upscale', desc: 'Quadruple resolution' },
  ];

  const MODE_OPTIONS = [
    { key: 'ai', label: 'AI Model (Default)', desc: 'TensorFlow neural network', icon: Sparkles },
    { key: 'fast', label: 'Fast Interpolation', desc: 'Instant bicubic multi-step', icon: Zap },
  ];

  const NOISE_OPTIONS = [
    { key: 'off', label: 'Off' },
    { key: 'low', label: 'Low' },
    { key: 'medium', label: 'Medium' },
    { key: 'high', label: 'High' },
  ];

  return (
    <div className="w-full bg-obsidian-card border border-obsidian-border rounded-2xl p-5 sm:p-6 shadow-xl animate-fade-in space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-obsidian-border/60">
        <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">Upscaling Configuration</h3>
          <p className="text-xs text-obsidian-text-muted">Configure AI scale factor, engine mode, and noise reduction</p>
        </div>
      </div>

      {/* Scale Factor Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-obsidian-text-muted uppercase tracking-wider">
          Scale Factor
        </label>
        <div className="grid grid-cols-2 gap-3">
          {SCALE_OPTIONS.map((opt) => {
            const isSelected = settings.scale === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdateSettings({ scale: opt.value })}
                className={`min-h-[48px] p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30'
                    : 'bg-obsidian-secondary border-obsidian-border text-gray-300 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm sm:text-base">{opt.label}</span>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />}
                </div>
                <span className="text-[11px] sm:text-xs text-obsidian-text-muted block">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interpolation Engine Mode */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-obsidian-text-muted uppercase tracking-wider">
          Upscaling Engine Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODE_OPTIONS.map((m) => {
            const isSelected = settings.mode === m.key;
            const ModeIcon = m.icon;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => onUpdateSettings({ mode: m.key })}
                className={`min-h-[48px] p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-obsidian-secondary border-obsidian-border text-gray-300 hover:border-gray-600'
                }`}
              >
                <ModeIcon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-purple-400' : 'text-obsidian-text-muted'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm block truncate">{m.label}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-purple-400" />}
                  </div>
                  <span className="text-xs text-obsidian-text-muted block mt-0.5">{m.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Noise Reduction & Transparency Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        {/* Noise Reduction */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-obsidian-text-muted uppercase tracking-wider">
            Noise Reduction
          </label>
          <div className="grid grid-cols-4 gap-2">
            {NOISE_OPTIONS.map((n) => {
              const isSelected = settings.noiseReduction === n.key;
              return (
                <button
                  key={n.key}
                  type="button"
                  onClick={() => onUpdateSettings({ noiseReduction: n.key })}
                  className={`min-h-[44px] py-2 px-1 rounded-xl border text-center font-bold text-xs transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-white'
                      : 'bg-obsidian-secondary border-obsidian-border text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preserve Transparency Toggle */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-obsidian-text-muted uppercase tracking-wider">
            Alpha Channel
          </label>
          <button
            type="button"
            onClick={() => onUpdateSettings({ preserveTransparency: !settings.preserveTransparency })}
            className={`w-full min-h-[44px] p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
              settings.preserveTransparency
                ? 'bg-purple-600/20 border-purple-500 text-white'
                : 'bg-obsidian-secondary border-obsidian-border text-gray-300'
            }`}
          >
            <span className="text-xs font-semibold">Preserve Transparency</span>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${settings.preserveTransparency ? 'bg-purple-600' : 'bg-gray-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${settings.preserveTransparency ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Future Expansion Architecture Notice */}
      <div className="p-3.5 bg-obsidian-secondary border border-obsidian-border/60 rounded-xl flex items-center justify-between text-xs text-obsidian-text-muted">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Extensible architecture ready for Face Enhancement, Photo Repair, & Batch Upscaling.</span>
        </div>
      </div>
    </div>
  );
}
