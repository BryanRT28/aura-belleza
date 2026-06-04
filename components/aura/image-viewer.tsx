'use client';

import { Button } from '@/components/ui/button';
import { Upload, Eye, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { ComparisonSlider } from './comparison-slider';
import { ProcessingOverlay } from './processing-overlay';
import { useToast } from './toast-container';
import { FaceMappingOverlay } from './face-mapping';
import { AIInsightsPanel } from './ai-insights';

interface ImageViewerProps {
  onImageUpload?: (file: File) => void;
  hoveredTool?: string | null;
}

export function ImageViewer({ onImageUpload, hoveredTool }: ImageViewerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith('image/')) {
      addToast('Por favor selecciona una imagen válida', 'error');
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setImage(result);
          addToast('Imagen cargada correctamente', 'success');
        }
      };
      reader.onerror = () => {
        addToast('Error al leer la imagen', 'error');
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
          addToast('Imagen cargada correctamente', 'success');
        }
      };
      reader.onerror = () => {
        addToast('Error al leer la imagen', 'error');
      };
      reader.readAsDataURL(file);
      onImageUpload?.(file);
    } else {
      addToast('Por favor arrastra una imagen válida', 'error');
    }
  };

  const handleProcessing = () => {
    setIsProcessing(true);
    setShowAIInsights(false);
    
    const timeoutId = setTimeout(() => {
      if (image) {
        setSimulatedImage(image);
        setShowAIInsights(true);
      }
      setIsProcessing(false);
      addToast('Simulación completada', 'success');
    }, 3000);

    return () => clearTimeout(timeoutId);
  };

  const handleComparison = () => {
    if (simulatedImage) {
      setShowComparison(!showComparison);
    } else {
      addToast('Por favor, procesa la imagen primero', 'info');
    }
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
                onComplete={() => setIsProcessing(false)}
              />
            )}

            {/* Image Display */}
            <div className="relative">
              {showComparison && simulatedImage ? (
                <ComparisonSlider
                  beforeImage={image}
                  afterImage={simulatedImage}
                  title="Comparación de Simulación"
                />
              ) : (
                <>
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-background border border-border/30">
                    <motion.img
                      layoutId="main-image"
                      src={image}
                      alt="Uploaded"
                      className="w-full h-full object-contain"
                    />
                    <FaceMappingOverlay isVisible={!!image} hoveredTool={hoveredTool} />
                  </div>
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground p-2 rounded-full hover:bg-background transition-colors"
                  >
                    <Upload size={20} className="rotate-90" />
                  </button>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProcessing}
                disabled={isProcessing}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-3xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Lightbulb size={18} />
                {isProcessing ? 'Procesando...' : 'Procesar Simulación'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComparison}
                disabled={!simulatedImage}
                className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-3xl font-medium flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-50"
              >
                <Eye size={18} />
                {showComparison ? 'Ocultar Comparación' : 'Comparar Antes/Después'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights Panel */}
      <AIInsightsPanel isVisible={showAIInsights} />
    </motion.div>
  );
}
