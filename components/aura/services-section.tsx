'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Droplets, Leaf } from 'lucide-react';

const services = [
  {
    icon: Sparkles,
    title: 'Cuidado de Piel',
    label: 'Piel saludable',
    benefits: ['Evaluación personalizada', 'Resultados naturales'],
    description: 'Tratamientos avanzados para rejuvenecimiento, hidratación y renovación de la piel con tecnología de punta.',
  },
  {
    icon: Droplets,
    title: 'Esculpido Facial',
    label: 'Armonía facial',
    benefits: ['Simulación previa', 'Enfoque proporcional'],
    description: 'Procedimientos profesionales para mejorar facciones, proporciones y armonía facial de forma natural.',
  },
  {
    icon: Leaf,
    title: 'Bienestar Capilar',
    label: 'Cuidado integral',
    benefits: ['Diagnóstico visual', 'Plan personalizado'],
    description: 'Soluciones integrales para fortalecimiento, restauración y cuidado del cabello con técnicas innovadoras.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 px-4 bg-background border-t border-border scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos tratamientos estéticos diseñados para resaltar tu belleza natural
            con altos estándares de profesionalismo y cuidado.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden bg-card border border-border rounded-3xl p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="p-4 bg-secondary/20 rounded-2xl w-fit group-hover:bg-primary/10 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {service.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                <ul className="mt-5 space-y-2">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <motion.a
                  whileHover={{ x: 4 }}
                  href="#tratamientos"
                  aria-label={`Explorar tratamientos de ${service.title}`}
                  className="inline-flex items-center text-primary font-semibold mt-7 text-sm gap-2"
                >
                  Explorar tratamientos
                  <ArrowRight size={16} />
                </motion.a>
                <div className="absolute bottom-0 left-8 w-12 h-1 rounded-full bg-primary transition-all duration-300 group-hover:w-24" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
