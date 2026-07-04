'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Stethoscope } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: MessageCircle,
    title: 'Consulta Personalizada',
    description: 'Te escuchamos. Nuestros expertos conocen tus objetivos, inquietudes y aspiraciones para personalizar tu experiencia.',
  },
  {
    number: 2,
    icon: Sparkles,
    title: 'Simulación Visual (Espejo Inteligente)',
    description: 'Visualiza los posibles resultados con nuestra tecnología avanzada. Una herramienta que te ayuda a decidir con confianza.',
  },
  {
    number: 3,
    icon: Stethoscope,
    title: 'Tratamiento Profesional',
    description: 'Bajo supervisión médica, ejecutamos tu plan personalizado con los más altos estándares de seguridad y calidad.',
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

const connectorVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { delay: 0.3, duration: 0.6 },
  },
};

export function MethodSection() {
  return (
    <section className="py-24 px-4 bg-secondary/5 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            El Método Aura
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un proceso integral diseñado para tu comodidad, seguridad y satisfacción
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">
          {/* Desktop Connectors */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  custom={index}
                  variants={stepVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Number Circle */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-20 h-20 bg-card border-2 border-primary rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-primary">{step.number}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="bg-card border border-border rounded-3xl p-8 text-center h-full">
                    {/* Icon */}
                    <div className="mb-6 p-4 bg-primary/10 rounded-2xl w-fit mx-auto">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
