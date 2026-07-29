import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({ originalUrl, upscaledUrl, originalDimensions, upscaledDimensions }) {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="w-full space-y-3">
      {/* Visual Slider Container */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
        className="relative w-full aspect-square sm:aspect-video bg-black rounded-2xl overflow-hidden border border-obsidian-border shadow-2xl select-none cursor-ew-resize group"
      >
        {/* Upscaled Image (Base Layer - Right Side) */}
        <img
          src={upscaledUrl}
          alt="AI Upscaled Image"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Original Image (Clipped Layer - Left Side) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalUrl}
            alt="Original Image"
            className="absolute top-0 left-0 h-full w-auto max-w-none object-contain pointer-events-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
            }}
          />
        </div>

        {/* Vertical Divider Line */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Draggable Circle Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 p-2 rounded-full bg-purple-600 border-2 border-white text-white shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white pointer-events-none">
          Original ({originalDimensions})
        </div>

        <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-purple-900/80 backdrop-blur-md border border-purple-400/30 text-xs font-semibold text-purple-200 pointer-events-none">
          AI Upscaled ({upscaledDimensions})
        </div>
      </div>

      <p className="text-center text-xs text-obsidian-text-muted">
        Drag the vertical slider left or right to compare original vs upscaled quality.
      </p>
    </div>
  );
}
