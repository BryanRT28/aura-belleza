'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface TreatmentTooltipProps {
  treatment: string;
  description: string;
  duration?: string;
  recovery?: string;
}

export function TreatmentTooltip({
  treatment,
  description,
  duration = '30-45 minutos',
  recovery = 'Sin tiempo de recuperación',
}: TreatmentTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="p-1 hover:bg-secondary/50 rounded-full transition-colors"
        aria-label={`Información sobre ${treatment}`}
      >
        <Info size={16} className="text-muted-foreground hover:text-primary transition-colors" />
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 bg-card border border-border rounded-2xl shadow-xl p-3 z-50"
          >
            {/* Arrow */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45" />

            {/* Content */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">{treatment}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>

              <div className="pt-2 space-y-1 border-t border-border/50">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-medium text-primary">⏱</span>
                  <span className="text-xs text-foreground/70">{duration}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-medium text-primary">✓</span>
                  <span className="text-xs text-foreground/70">{recovery}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
