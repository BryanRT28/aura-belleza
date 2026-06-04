'use client';

import { motion } from 'framer-motion';

interface AIInsightsPanelProps {
  isVisible: boolean;
}

export function AIInsightsPanel({ isVisible }: AIInsightsPanelProps) {
  const metrics = [
    { label: 'Armonía Facial', value: 92, color: 'bg-primary' },
    { label: 'Simetría Izquierda/Derecha', value: 89, color: 'bg-primary' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 100 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      className={`fixed right-0 top-0 mt-20 mr-4 w-full max-w-sm p-6 rounded-3xl border border-border/30 backdrop-blur-md bg-card/95 shadow-2xl z-40 ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      } transition-all duration-300 contain-layout md:right-6 md:w-72`}
      style={{ willChange: 'transform' }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-1">Análisis de Simetría IA</h3>
        <p className="text-xs text-muted-foreground">Escaneo completo</p>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={`metric-${metric.label}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">{metric.label}</span>
              <span className="text-sm font-bold text-primary">{metric.value}%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isVisible ? `${metric.value}%` : 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`${metric.color} h-full rounded-full`}
                style={{ backfaceVisibility: 'hidden' }}
              />
            </div>
          </div>
        ))}

        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Luminosidad de la Piel</span>
            <span className="text-xs font-bold text-emerald-600">Óptima</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
