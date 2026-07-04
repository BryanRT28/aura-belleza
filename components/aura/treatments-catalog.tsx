'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const treatments = [
  {
    name: 'Rinoplastia',
    description: 'Remodelar y refinar la forma de la nariz',
  },
  {
    name: 'Botox',
    description: 'Reducir líneas de expresión de forma suave',
  },
  {
    name: 'Lifting Facial',
    description: 'Restaurar la elasticidad y firmeza',
  },
  {
    name: 'Implantes Capilares',
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-foreground mb-12 text-center"
        >
          Catálogo de Tratamientos
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {treatments.map((treatment, index) => {
            const isSelected = selectedTreatment === treatment.name;

            return (
            <motion.div
              key={treatment.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1 }}
              animate={{ y: isSelected ? -4 : 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <Card
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onTreatmentSelect?.(treatment.name)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onTreatmentSelect?.(treatment.name);
                  }
                }}
                className={`border rounded-3xl p-6 h-full cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-lg'
                    : 'bg-card border-border hover:border-primary hover:bg-primary/5'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {treatment.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {treatment.description}
                </p>
                <div className={`mt-4 h-1 bg-primary rounded-full transition-all duration-300 ${isSelected ? 'w-20' : 'w-12'}`} />
              </Card>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
