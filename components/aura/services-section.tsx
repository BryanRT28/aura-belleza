'use client';

import { motion } from 'framer-motion';
import { Sparkles, Droplets, Leaf } from 'lucide-react';

const services = [
  {
    icon: Sparkles,
    title: 'Cuidado de Piel',
    description: 'Tratamientos avanzados para rejuvenecimiento, hidratación y renovación de la piel con tecnología de punta.'
  },
  {
    icon: Droplets,
    title: 'Esculpido Facial',
    description: 'Procedimientos profesionales para mejorar facciones, proporciones y armonía facial de forma natural.'
  },
  {
    icon: Leaf,
    title: 'Bienestar Capilar',
    description: 'Soluciones integrales para fortalecimiento, restauración y cuidado del cabello con técnicas innovadoras.'
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
            Ofrecemos una variedad de tratamientos estéticos diseñados para resaltar tu belleza natural
            con los más altos estándares de profesionalismo y cuidado.
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
                className="group bg-card border border-border rounded-3xl p-8 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-6 p-4 bg-secondary/20 rounded-2xl w-fit group-hover:bg-primary/10 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <motion.a
                  whileHover={{ x: 4 }}
                  href="#"
                  className="inline-flex items-center text-primary font-medium mt-6 text-sm gap-2"
                >
                  Conocer más
                  <span>→</span>
                </motion.a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
