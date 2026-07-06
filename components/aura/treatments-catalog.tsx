'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, Check, Clock, Sparkles } from 'lucide-react';

const treatments = [
  {
    name: 'Rinoplastia',
    toolName: 'Rinoplastia',
    category: 'Armonización facial',
    benefit: 'Resultado natural',
    description: 'Remodelar y refinar la forma de la nariz',
  },
  {
    name: 'Botox',
    toolName: 'Botox',
    category: 'Rejuvenecimiento',
    benefit: 'Apariencia descansada',
    description: 'Reducir líneas de expresión de forma suave',
  },
  {
    name: 'Lifting Facial',
    toolName: 'Lifting',
    category: 'Rejuvenecimiento',
    benefit: 'Contornos definidos',
    description: 'Restaurar la elasticidad y firmeza',
  },
  {
    name: 'Implantes Capilares',
    toolName: 'Implantes',
    category: 'Restauración capilar',
    benefit: 'Mayor densidad',
    description: 'Recuperar volumen y densidad capilar',
  },
];

interface TreatmentsCatalogProps {
  selectedTreatment?: string | null;
  onTreatmentSelect?: (treatment: string) => void;
}

export function TreatmentsCatalog({
  selectedTreatment,
  onTreatmentSelect,
}: TreatmentsCatalogProps) {
  return (
    <section
      id="tratamientos"
      className="py-20 px-4 bg-secondary/5 border-t border-border"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={14} />
            Recomendados para ti
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Catálogo de Tratamientos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Selecciona una alternativa para visualizarla en tu Espejo Inteligente.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 1 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {treatments.map((treatment, index) => {
            const isSelected = selectedTreatment === treatment.toolName;

            return (
            <motion.div
              key={treatment.name}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              animate={{ y: isSelected ? -4 : 0 }}
              transition={{ duration: 0.58, ease: 'easeOut' }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onTreatmentSelect?.(treatment.toolName)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onTreatmentSelect?.(treatment.toolName);
                  }
                }}
                className={`group relative overflow-hidden border rounded-3xl p-6 h-full cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-lg'
                    : 'bg-card border-border hover:border-primary hover:bg-primary/5 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="px-3 py-1 rounded-full border border-border bg-background/70 text-xs font-medium text-muted-foreground">
                    {treatment.category}
                  </span>
                  <motion.span
                    animate={isSelected ? { rotate: [0, -10, 0], scale: [1, 1.12, 1] } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/50 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground'
                  }`}
                  >
                    {isSelected ? <Check size={17} /> : <ArrowUpRight size={17} />}
                  </motion.span>
                </div>
                <h3 className={`text-xl font-semibold mt-5 mb-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {treatment.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {treatment.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary" />
                    {treatment.benefit}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    Vista previa inmediata
                  </span>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/70">
                  <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {isSelected ? 'Seleccionado' : 'Probar en el espejo'}
                  </span>
                  <span className="text-xs text-muted-foreground">Sin compromiso</span>
                </div>
                <div className={`absolute bottom-0 left-6 h-1 bg-primary rounded-full transition-all duration-300 ${isSelected ? 'w-24' : 'w-12 group-hover:w-20'}`} />
              </Card>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
