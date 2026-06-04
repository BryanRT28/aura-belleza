'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessingOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
}

// Predefined data points to avoid hydration mismatch from Math.random()
const FIXED_DATA_POINTS = [
  { id: 'point-0', x: 35, y: 28 },
  { id: 'point-1', x: 65, y: 32 },
  { id: 'point-2', x: 50, y: 45 },
  { id: 'point-3', x: 40, y: 58 },
  { id: 'point-4', x: 60, y: 62 },
  { id: 'point-5', x: 25, y: 50 },
  { id: 'point-6', x: 75, y: 55 },
  { id: 'point-7', x: 45, y: 25 },
  { id: 'point-8', x: 55, y: 70 },
  { id: 'point-9', x: 30, y: 72 },
  { id: 'point-10', x: 70, y: 38 },
  { id: 'point-11', x: 50, y: 52 },
];

export function ProcessingOverlay({
  isVisible,
  onComplete,
}: ProcessingOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible || !mounted) return;

    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, onComplete, mounted]);

  if (!isVisible || !mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-20 overflow-hidden"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {/* Scanning Laser Line */}
        <motion.div
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 w-full h-1 bg-gradient-to-b from-transparent via-primary to-transparent pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)',
          }}
        />

        {/* Data Points */}
        {FIXED_DATA_POINTS.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute w-2 h-2 bg-primary rounded-full pointer-events-none"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              boxShadow: '0 0 8px rgba(212, 175, 55, 0.8)',
            }}
          >
            <motion.div
              animate={{ r: [0, 12] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 border border-primary rounded-full"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </motion.div>
        ))}

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-8 text-center pointer-events-none"
        >
          <p className="text-white font-medium text-lg">Escaneando Rostro...</p>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-2"
          >
            <span className="text-primary text-sm">Analizando características...</span>
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-background/20"
        >
          <motion.div
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 2.8, ease: 'easeInOut' }}
            className="h-full bg-primary"
            style={{ backfaceVisibility: 'hidden' }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
