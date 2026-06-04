'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react'; // Icono de ayuda alternativo elegante

interface TreatmentTooltipProps {
  treatment: string;
  description: string;
  duration: string;
  recovery: string;
  children?: React.ReactNode;
}

export function TreatmentTooltip({ treatment, description, duration, recovery, children }: TreatmentTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1">
      {children}
      
      {/* CAMBIADO DE motion.button A motion.div INTERACTIVO PARA EVITAR ANIDACIÓN EN HTML */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          // Crucial: Evita que al hacer click en la "(i)" se active también el botón padre del tratamiento
          e.stopPropagation(); 
        }}
        className="p-1 hover:bg-secondary/50 rounded-full transition-colors cursor-pointer text-muted-foreground hover:text-primary flex items-center justify-center"
        role="button"
        tabIndex={0}
        aria-label={`Información sobre ${treatment}`}
      >
        <HelpCircle size={14} />
      </motion.div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-popover text-popover-foreground border border-border p-4 rounded-2xl shadow-xl backdrop-blur-sm pointer-events-none"
          >
            <div className="space-y-2 text-left">
              <h5 className="font-semibold text-sm text-primary">{treatment}</h5>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
              <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="block text-muted-foreground font-medium">Duración:</span>
                  <span className="text-foreground">{duration}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground font-medium">Recuperación:</span>
                  <span className="text-foreground">{recovery}</span>
                </div>
              </div>
            </div>
            {/* Pequeña flecha decorativa inferior */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-r border-b border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}