'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './navbar';
import { Hero } from './hero';
import { ServicesSection } from './services-section';
import { MethodSection } from './method-section';
import { SimulatorIntro } from './simulator-intro';
import { ToolsSidebar } from './tools-sidebar';
import { ImageViewer } from './image-viewer';
import { TreatmentsCatalog } from './treatments-catalog';
import { Footer } from './footer';
import { AuraAIAssistant } from './ai-assistant';
import { RecommendationCard } from './recommendation-card';
import { ToastContainer, useToast } from './toast-container';
import { useTheme } from '@/hooks/use-theme';

export function AuraBelleza() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [theme, setTheme] = useState<'experiencia' | 'consulta'>('experiencia');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { messages: toastMessages, addToast, removeToast } = useToast();
  useTheme(theme);

  return (
    <div className={`min-h-screen scroll-smooth transition-colors duration-300 ${
      theme === 'consulta' ? 'bg-white' : 'bg-background'
    }`}>
      <Navbar theme={theme} onThemeChange={setTheme} />
      <Hero />
      <ServicesSection />
      <MethodSection />
      <SimulatorIntro />

      {/* Espejo Inteligente Section */}
      <section
        id="espejo-inteligente"
        className="py-16 md:py-20 px-4 bg-background border-t border-border scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-center text-balance">
              Tu Espejo Inteligente
            </h2>
            <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto text-balance">
              Simula diferentes procedimientos estéticos y visualiza los resultados personalizados
              basados en tu foto. Una herramienta de apoyo para tomar decisiones informadas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {/* Left Sidebar - Tools */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <ToolsSidebar onToolSelect={setSelectedTool} onToolHover={setHoveredTool} />
            </div>

            {/* Right Column - Image Viewer */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <ImageViewer hoveredTool={hoveredTool} />
            </div>
          </motion.div>

          {/* Selected Tool Info */}
          {selectedTool && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 p-6 bg-secondary/30 border border-border rounded-3xl"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Herramienta Seleccionada: <span className="text-primary">{selectedTool}</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                La herramienta de {selectedTool} está lista para usar. Carga una imagen para comenzar la simulación.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <TreatmentsCatalog />
      <Footer />

      {/* AI Assistant Chatbot */}
      <AuraAIAssistant />

      {/* Recommendation Panel */}
      <RecommendationCard
        isVisible={showRecommendations}
        onClose={() => setShowRecommendations(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer
        messages={toastMessages}
        onRemove={removeToast}
      />
    </div>
  );
}
