'use client';

import { motion } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Recommendation {
  treatment: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  benefits: string[];
}

interface RecommendationCardProps {
  isVisible: boolean;
  onClose?: () => void;
  recommendations?: Recommendation[];
}

const defaultRecommendations: Recommendation[] = [
  {
    treatment: 'Rinoplastia',
    priority: 'high',
    description: 'Refinamiento de la forma nasal para armonía facial',
    benefits: ['Mejora de proporción', 'Perfil más definido', 'Mayor confianza'],
  },
  {
    treatment: 'Botox',
    priority: 'medium',
    description: 'Suavizado de líneas de expresión',
    benefits: ['Aspecto rejuvenecido', 'Piel más lisa', 'Resultado natural'],
  },
  {
    treatment: 'Lifting Facial',
    priority: 'medium',
    description: 'Elevación de los rasgos faciales',
    benefits: ['Contornos definidos', 'Efecto tensor', 'Juventud restaurada'],
  },
];

export function RecommendationCard({
  isVisible,
  onClose,
  recommendations = defaultRecommendations,
}: RecommendationCardProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={{ duration: 0.4, type: 'spring', damping: 20 }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-2xl overflow-y-auto z-40"
    >
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-card to-card/80 p-6 border-b border-border backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star size={24} className="text-primary" fill="currentColor" />
            <h2 className="text-xl font-semibold text-foreground">
              Plan de Belleza Personalizado
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>
        <p className="text-sm text-muted-foreground">
          Basado en el análisis de tu rostro
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.treatment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background border border-border rounded-3xl p-4 overflow-hidden"
          >
            {/* Priority Badge */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">{rec.treatment}</h3>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  rec.priority === 'high'
                    ? 'bg-primary/20 text-primary'
                    : rec.priority === 'medium'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {rec.priority === 'high'
                  ? 'Recomendado'
                  : rec.priority === 'medium'
                    ? 'Sugerido'
                    : 'Opcional'}
              </motion.span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>

            {/* Benefits */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                Beneficios:
              </p>
              <ul className="space-y-1">
                {rec.benefits.map((benefit) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.15 }}
                    className="text-xs text-foreground flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-2xl font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Visualizar Simulación
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 p-6 bg-gradient-to-t from-card to-card/80 border-t border-border backdrop-blur">
        <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-3xl font-semibold hover:shadow-lg transition-shadow">
          Programar Consulta
        </Button>
      </div>
    </motion.div>
  );
}
