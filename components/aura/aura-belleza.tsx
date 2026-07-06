'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './navbar';
import { Hero } from './hero';
import { ServicesSection } from './services-section';
import { MethodSection } from './method-section';
import { SimulatorIntro } from './simulator-intro';
import { ToolsSidebar } from './tools-sidebar';
import {
  ImageViewer,
  type SimulationDraft,
  type SimulationWorkflowState,
} from './image-viewer';
import { TreatmentsCatalog } from './treatments-catalog';
import { ReviewsSection } from './reviews-section';
import { Footer } from './footer';
import { AuraAIAssistant } from './ai-assistant';
import { RecommendationCard } from './recommendation-card';
import { ToastContainer, useToast } from './toast-container';
import { AppTheme, useTheme } from '@/hooks/use-theme';
import { AuraProvider } from '@/context/AuraContext';
import { formatFeedbackForToast, getFriendlyFeedback } from './error-feedback';

export function AuraBelleza() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [theme, setTheme] = useState<AppTheme>('experiencia');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [latestSimulation, setLatestSimulation] = useState<SimulationDraft | null>(null);
  const [isSavingSimulation, setIsSavingSimulation] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [savedSimulationId, setSavedSimulationId] = useState<number | null>(null);
  const [workflow, setWorkflow] = useState<SimulationWorkflowState>({
    hasImage: false,
    hasTreatment: false,
    hasResult: false,
    isUploading: false,
    isProcessing: false,
  });
  const { messages: toastMessages, addToast, removeToast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem('aura-theme') as AppTheme | null;

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useTheme(theme);

  const handleSimulationChange = (simulation: SimulationDraft | null) => {
    setLatestSimulation(simulation);
    setSavedSimulationId(null);
  };

  const handleSaveSimulation = async () => {
    if (!latestSimulation || isSavingSimulation) {
      addToast('Procesa una simulacion antes de guardarla', 'info');
      return;
    }

    setIsSavingSimulation(true);

    try {
      const response = await fetch('/api/simulaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          treatment: latestSimulation.treatment,
          originalImageUrl: latestSimulation.originalImageUrl,
          resultImageUrl: latestSimulation.resultImageUrl,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        simulacion?: { id?: number };
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'No fue posible guardar la simulacion');
      }

      setSavedSimulationId(data.simulacion?.id ?? null);
      addToast('Simulacion guardada correctamente', 'success');
    } catch (error) {
      const feedback = getFriendlyFeedback(error, 'save');

      addToast(formatFeedbackForToast(feedback), 'error');
    } finally {
      setIsSavingSimulation(false);
    }
  };

  const handleDownloadSimulationPdf = async () => {
    if (!savedSimulationId || isDownloadingPdf) {
      addToast('Guarda una simulacion antes de descargar el PDF', 'info');
      return;
    }

    setIsDownloadingPdf(true);

    try {
      const response = await fetch(`/api/simulaciones/${savedSimulationId}/pdf`);

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || 'No fue posible generar el PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aura-simulacion-${savedSimulationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      addToast('PDF generado correctamente', 'success');
    } catch (error) {
      const feedback = getFriendlyFeedback(error, 'pdf');

      addToast(formatFeedbackForToast(feedback), 'error');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <AuraProvider>
      <div className="min-h-screen scroll-smooth bg-background text-foreground transition-colors duration-300">
        <Navbar theme={theme} onThemeChange={setTheme} />
        <Hero />
        <ServicesSection />
        <MethodSection />
        <SimulatorIntro />

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
                Simula diferentes procedimientos esteticos y visualiza resultados personalizados
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
              <div className="lg:col-span-1 order-2 lg:order-1 relative z-30 overflow-visible">
                <ToolsSidebar
                  selectedTool={selectedTool}
                  canSaveSimulation={!!latestSimulation}
                  isSavingSimulation={isSavingSimulation}
                  isDownloadingPdf={isDownloadingPdf}
                  savedSimulationId={savedSimulationId}
                  workflow={workflow}
                  onToolSelect={setSelectedTool}
                  onToolHover={setHoveredTool}
                  onSaveSimulation={handleSaveSimulation}
                  onDownloadPdf={handleDownloadSimulationPdf}
                />
              </div>

              <div className="lg:col-span-3 order-1 lg:order-2 relative z-0">
                <ImageViewer
                  selectedTreatment={selectedTool}
                  hoveredTool={hoveredTool}
                  onSimulationChange={handleSimulationChange}
                  onWorkflowChange={setWorkflow}
                />
              </div>
            </motion.div>

            {(selectedTool || workflow.hasImage || workflow.hasResult) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 grid gap-4 rounded-3xl border border-border bg-secondary/20 p-5 md:grid-cols-3"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Tratamiento
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {selectedTool ?? 'Pendiente'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Imagen
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {workflow.isUploading
                      ? 'Subiendo'
                      : workflow.hasImage
                        ? 'Lista para IA'
                        : 'Pendiente'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Siguiente paso
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {!selectedTool
                      ? 'Elige un tratamiento'
                      : !workflow.hasImage
                        ? 'Sube una imagen'
                        : workflow.hasResult
                          ? 'Guarda y descarga PDF'
                          : 'Procesa la simulacion'}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <TreatmentsCatalog
          selectedTreatment={selectedTool}
          onTreatmentSelect={setSelectedTool}
        />
        <ReviewsSection />
        <Footer />

        <AuraAIAssistant />

        <RecommendationCard
          isVisible={showRecommendations}
          onClose={() => setShowRecommendations(false)}
        />

        <ToastContainer
          messages={toastMessages}
          onRemove={removeToast}
        />
      </div>
    </AuraProvider>
  );
}
