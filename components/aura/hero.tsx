'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollToServices = () => {
    const element = document.getElementById('servicios');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
      style={{
        backgroundImage: 'url(/spa-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Headline - Emotional */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Revela la mejor{' '}
          <span className="text-primary">versión de ti misma</span>
        </motion.h1>

        {/* Subtitle - Emphasizing expertise and safety */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Combinamos la experiencia médica profesional con herramientas de visualización avanzadas
          para que tomes decisiones seguras y conscientes sobre tu belleza.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <button
            onClick={scrollToServices}
            className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-3xl hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            Descubre Nuestros Servicios
          </button>
          <Button 
            className="!bg-[#d4af37] !text-[#2c2c2c] hover:!bg-[#bfa030] hover:!text-[#2c2c2c] font-semibold px-8 py-6 rounded-full shadow-lg transition-all duration-300 text-base"
            onClick={() => window.location.hash = '#espejo-inteligente'}
          >
            Agendar Cita
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={scrollToServices}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/60 hover:text-white transition-colors p-2"
            aria-label="Scroll to next section"
          >
            <ChevronDown size={32} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
