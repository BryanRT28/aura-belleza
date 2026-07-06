'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Quote, ShieldCheck, Star } from 'lucide-react';

const reviews = [
  {
    name: 'Valeria M.',
    treatment: 'Rinoplastia',
    rating: 5,
    date: 'Hace 2 semanas',
    comment:
      'La simulacion me ayudo a entender mejor que cambio queria. El resultado se ve natural y el comparador antes/despues es muy claro.',
  },
  {
    name: 'Andrea C.',
    treatment: 'Botox',
    rating: 5,
    date: 'Hace 1 mes',
    comment:
      'Me gusto que la plataforma no exagera los cambios. La vista previa me dio seguridad antes de conversar con una especialista.',
  },
  {
    name: 'Marco R.',
    treatment: 'Implantes Capilares',
    rating: 4,
    date: 'Hace 3 semanas',
    comment:
      'El flujo es facil de seguir: subes la foto, eliges tratamiento y comparas. El reporte PDF sirve para revisar la simulacion luego.',
  },
  {
    name: 'Camila P.',
    treatment: 'Lifting Facial',
    rating: 5,
    date: 'Hace 5 dias',
    comment:
      'La experiencia se siente ordenada y confiable. Las indicaciones paso a paso evitan perderse durante la simulacion.',
  },
];

const stats = [
  { value: '4.8/5', label: 'Satisfaccion promedio' },
  { value: '320+', label: 'Simulaciones revisadas' },
  { value: '96%', label: 'Claridad percibida' },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, scale: 0.4, rotate: -12 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06, type: 'spring', stiffness: 420, damping: 18 }}
        >
          <Star
            size={16}
            className={index < rating ? 'fill-primary text-primary' : 'text-muted'}
          />
        </motion.span>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section
      id="resenas"
      className="border-t border-border bg-background px-4 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <ShieldCheck size={14} />
            Opiniones verificadas
          </span>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Opiniones de usuarios
          </h2>
          <p className="mt-3 text-muted-foreground">
            Comentarios de referencia sobre la experiencia de simulacion, comparacion visual y reporte final.
          </p>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-lg border border-border bg-card p-5 text-center"
            >
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {reviews.map((review, index) => (
            <motion.article
              key={`${review.name}-${review.treatment}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: -4 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                    >
                      {review.name.charAt(0)}
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-foreground">{review.name}</h3>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, 0], opacity: [0.55, 0.9, 0.55] }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                >
                  <Quote size={22} className="text-primary/50" />
                </motion.div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Stars rating={review.rating} />
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  {review.treatment}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-border/70 pt-4 text-xs font-medium text-foreground">
                <CheckCircle size={15} className="text-primary" />
                Simulacion visual revisada
              </div>
              <div className="absolute bottom-0 left-6 h-1 w-12 rounded-full bg-primary transition-all duration-300 group-hover:w-24" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
