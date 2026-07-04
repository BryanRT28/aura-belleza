'use client';

import { Button } from '@/components/ui/button';
import { Upload, Eye, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { ComparisonSlider } from './comparison-slider';
import { ProcessingOverlay } from './processing-overlay';
import { useToast } from '@/components/ui/use-toast';
import { FaceMappingOverlay } from './face-mapping';
import { AIInsightsPanel } from './ai-insights';

interface ImageViewerProps {
  onImageUpload?: (file: File) => void;
  selectedTreatment?: string | null;
  hoveredTool?: string | null;
}

type SimulationResponse = {
  ok?: boolean;
  resultImageUrl?: string;
  error?: string;
};

export function ImageViewer({ onImageUpload, selectedTreatment, hoveredTool }: ImageViewerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith('image/')) {
      toast({ title: "Error", description: 'Por favor selecciona una imagen válida', variant: 'destructive' });
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setImage(result);
          toast({ title: "Éxito", description: 'Imagen cargada correctamente' });
        }
      };
      reader.onerror = () => {
        toast({ title: "Error", description: 'Error al leer la imagen', variant: 'destructive' });
      };
      reader.readAsDataURL(file);
      onImageUpload?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setImage(result);
          toast({ title: "Éxito", description: 'Imagen cargada correctamente' });
        }
      };
      reader.onerror = () => {
        toast({ title: "Error", description: 'Error al leer la imagen', variant: 'destructive' });
      };
      reader.readAsDataURL(file);
      onImageUpload?.(file);
    } else {
      toast({ title: "Error", description: 'Por favor arrastra una imagen válida', variant: 'destructive' });
    }
  };

  const handleProcessing = async () => {
    const treatment = selectedTreatment ?? hoveredTool;

    if (!image) {
      toast({ title: "Información", description: 'Por favor, carga una imagen primero' });
      return;
    }

    if (!treatment) {
      toast({ title: "Información", description: 'Selecciona un tratamiento antes de procesar' });
      return;
    }

    setIsProcessing(true);
    setShowAIInsights(false);

    try {
      // Para produccion, image deberia ser una URL publica de Cloudinary o similar.
      // Replicate necesita poder descargar la imagen desde su backend.
      const response = await fetch('/api/ai/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: image,
          treatment,
        }),
      });

      const data = (await response.json()) as SimulationResponse;

      if (!response.ok || !data.ok || !data.resultImageUrl) {
        throw new Error(data.error || 'Error al procesar la imagen');
      }

      setSimulatedImage(data.resultImageUrl);
      setShowComparison(true);
      setShowAIInsights(true);
      toast({ title: "Completado", description: 'Simulación completada con éxito' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al procesar la imagen';

      toast({ title: "Error", description: message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComparison = () => {
    if (simulatedImage) {
      setShowComparison(!showComparison);
    } else {
      toast({ title: "Información", description: 'Por favor, procesa la imagen primero' });
    }
  };

  // Función de reinicio profundo sin romper la UI
  const handleResetSimulator = () => {
    setImage(null);
    setSimulatedImage(null);
    setShowComparison(false);
    setIsProcessing(false);
    setShowAIInsights(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-3xl p-4 md:p-8 border border-border flex flex-col items-center justify-center min-h-96 relative"
      style={{ containIntrinsicSize: 'auto 400px' }}
    >
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-border rounded-3xl p-8 text-center hover:border-primary hover:bg-secondary/20 transition-all duration-300 cursor-pointer"
            >
              <Upload size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2 text-balance">
                Subir Imagen
              </h3>
              <p className="text-sm text-muted-foreground mb-4 text-balance">
                Arrastra tu foto aquí o haz clic para seleccionar
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-3xl"
              >
                Seleccionar Archivo
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Processing Overlay */}
            {isProcessing && (
              <ProcessingOverlay
                isVisible={isProcessing}
              />
            )}

            {/* CÓDIGO ORIGINAL RECUPERADO DE LA VISUALIZACIÓN DE IMAGEN */}
            <div className="relative">
              {showComparison && simulatedImage ? (
                <ComparisonSlider
                  beforeImage={image ?? ""}
                  afterImage={simulatedImage ?? ""}
                  title="Comparación de Simulación"
                />
              ) : (
                <>
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-background border border-border/30">
                    <motion.img
                      layoutId="main-image"
                      src={image ?? undefined}
                      alt="Uploaded"
                      className="w-full h-full object-contain"
                    />
                    <FaceMappingOverlay isVisible={!!image} hoveredTool={hoveredTool ?? null} />
                  </div>
                  {/* Botón original de la esquina superior derecha con reset profundo */}
                  <button
                    onClick={handleResetSimulator}
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground p-2 rounded-full hover:bg-background transition-colors z-10"
                  >
                    <Upload size={20} className="rotate-90" />
                  </button>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                disabled={isProcessing}
                onClick={handleProcessing}
                className="w-full px-4 py-6 bg-primary text-primary-foreground rounded-3xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Lightbulb size={18} />
                {isProcessing ? 'Procesando...' : 'Procesar Simulación'}
              </Button>

              <Button
                disabled={!simulatedImage}
                onClick={handleComparison}
                className="w-full px-4 py-6 bg-secondary text-secondary-foreground rounded-3xl font-medium flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-50"
              >
                <Eye size={18} />
                {showComparison ? 'Ocultar Comparación' : 'Comparar Antes/Después'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights Panel */}
      <AIInsightsPanel
        isVisible={showAIInsights}
        onClose={() => setShowAIInsights(false)}
      />
    </motion.div>
  );
}
