'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  title?: string;
}

export function ComparisonSlider({
  beforeImage,
  afterImage,
  title = 'Antes / Después',
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
          {Math.round(sliderPosition)}% Después
        </div>
      </div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full rounded-3xl overflow-hidden cursor-col-resize select-none bg-background border border-border shadow-lg touch-none"
      >
        {/* After Image (Background) */}
        <img
          src={afterImage}
          alt="Después"
          className="w-full h-full object-cover"
        />

        {/* Before Image (Overlay) */}
        <div
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          className="absolute inset-0 overflow-hidden"
        >
          <img
            src={beforeImage}
            alt="Antes"
            draggable={false}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Slider Handle */}
        <motion.div
          style={{ left: `${sliderPosition}%` }}
          className="absolute top-0 h-full w-1 bg-primary shadow-lg transform -translate-x-1/2"
        >
          {/* Handle Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-md flex items-center justify-center -ml-4">
            <div className="text-primary-foreground text-xs font-bold">⟨⟩</div>
          </div>
        </motion.div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
          <span className="text-white text-xs font-semibold">ANTES</span>
        </div>
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
          <span className="text-white text-xs font-semibold">DESPUÉS</span>
        </div>
      </motion.div>
    </div>
  );
}
