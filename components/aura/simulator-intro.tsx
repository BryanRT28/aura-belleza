'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function SimulatorIntro() {
  const scrollToSimulator = () => {
    const element = document.getElementById('espejo-inteligente');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-background border-t border-border">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            ¿Tienes dudas sobre un cambio?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Pruébalo primero en nuestro{' '}
            <span className="text-primary font-semibold">Espejo Inteligente</span>. 
            Visualiza cómo te vería con diferentes procedimientos estéticos 
            y toma decisiones informadas con confianza.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToSimulator}
            className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-3xl hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 inline-block"
          >
            Abrir Espejo Inteligente
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
