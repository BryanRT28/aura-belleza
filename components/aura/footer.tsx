'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground mb-2">
            Proyecto: Interacción Humano Computador
          </p>
          <p className="text-sm text-muted-foreground">
            UNMSM - FISI 2026
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
