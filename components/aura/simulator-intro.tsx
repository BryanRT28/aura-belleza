'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ScanFace, Sparkles } from 'lucide-react';

export function SimulatorIntro() {
  const scrollToSimulator = () => {
    const element = document.getElementById('espejo-inteligente');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-background border-t border-border">
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -10, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[8%] top-12 hidden h-16 w-16 items-center justify-center rounded-lg border border-primary/20 bg-card/60 text-primary md:flex"
      >
        <Sparkles size={24} />
      </motion.div>
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 12, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-[10%] hidden h-20 w-20 items-center justify-center rounded-lg border border-border bg-card/70 text-primary md:flex"
      >
        <ScanFace size={30} />
      </motion.div>

      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
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
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToSimulator}
            className="inline-flex items-center gap-2 rounded-3xl bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            Abrir Espejo Inteligente
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight size={18} />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
