'use client';

import { Button } from '@/components/ui/button';
import { Upload, Eye, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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

type CloudinaryUploadResponse = {
  ok?: boolean;
  imageUrl?: string;
  error?: string;
};

type SimulationResponse = {
  ok?: boolean;
  resultImageUrl?: string;
  error?: string;
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

async function uploadImageToCloudinary(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append('file', file);

  if (cloudName && uploadPreset) {
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = (await response.json()) as {
      secure_url?: string;
      error?: { message?: string };
    };

    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || 'Cloudinary no pudo subir la imagen');
    }

    return data.secure_url;
  }

  const response = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    body: formData,
  });

  const data = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !data.ok || !data.imageUrl) {
    throw new Error(data.error || 'Error al subir la imagen a Cloudinary');
  }

  return data.imageUrl;
}

export function ImageViewer({ onImageUpload, selectedTreatment, hoveredTool }: ImageViewerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);
  const { toast } = useToast();

  const displayImage = previewImage ?? image;

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  const clearPreviewObjectUrl = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
  };

  const validateImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una imagen valida',
        variant: 'destructive',
      });
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: 'Error',
        description: 'La imagen no debe superar los 10 MB',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSelectedFile = async (file: File) => {
    if (!validateImageFile(file)) {
      return;
    }

    clearPreviewObjectUrl();
    const localPreviewUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = localPreviewUrl;

    setPreviewImage(localPreviewUrl);
    setImage(null);
    setSimulatedImage(null);
    setShowComparison(false);
    setShowAIInsights(false);
    setIsUploading(true);

    try {
      const cloudinaryUrl = await uploadImageToCloudinary(file);

      clearPreviewObjectUrl();
      setPreviewImage(cloudinaryUrl);
      setImage(cloudinaryUrl);
      onImageUpload?.(file);
      toast({ title: 'Exito', description: 'Imagen subida a Cloudinary correctamente' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al subir la imagen a Cloudinary';

      clearPreviewObjectUrl();
      setPreviewImage(null);
      setImage(null);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      void handleSelectedFile(file);
    }

    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];

    if (file) {
      void handleSelectedFile(file);
      return;
    }

    toast({
      title: 'Error',
      description: 'Por favor arrastra una imagen valida',
      variant: 'destructive',
    });
  };

  const handleProcessing = async () => {
    const treatment = selectedTreatment ?? hoveredTool;

    if (!image) {
      toast({
        title: 'Informacion',
        description: 'Primero sube la imagen a Cloudinary',
      });
      return;
    }

    if (!treatment) {
      toast({
        title: 'Informacion',
        description: 'Selecciona un tratamiento antes de procesar',
      });
      return;
    }

    setIsProcessing(true);
    setShowAIInsights(false);

    try {
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
      toast({ title: 'Completado', description: 'Simulacion completada con exito' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al procesar la imagen';

      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComparison = () => {
    if (simulatedImage) {
      setShowComparison(!showComparison);
    } else {
      toast({ title: 'Informacion', description: 'Por favor, procesa la imagen primero' });
    }
  };

  const handleResetSimulator = () => {
    clearPreviewObjectUrl();
    setImage(null);
    setPreviewImage(null);
    setSimulatedImage(null);
    setShowComparison(false);
    setIsUploading(false);
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
        {!displayImage ? (
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
                Arrastra tu foto aqui o haz clic para seleccionar
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
            {isProcessing && <ProcessingOverlay isVisible={isProcessing} />}

            <div className="relative">
              {showComparison && image && simulatedImage ? (
                <ComparisonSlider
                  beforeImage={image}
                  afterImage={simulatedImage}
                  title="Comparacion de Simulacion"
                />
              ) : (
                <>
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-background border border-border/30">
                    <motion.img
                      layoutId="main-image"
                      src={displayImage}
                      alt="Uploaded"
                      className="w-full h-full object-contain"
                    />
                    <FaceMappingOverlay isVisible={!!displayImage} hoveredTool={hoveredTool ?? null} />
                  </div>
                  <button
                    onClick={handleResetSimulator}
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground p-2 rounded-full hover:bg-background transition-colors z-10"
                  >
                    <Upload size={20} className="rotate-90" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <Button
                disabled={isUploading || isProcessing || !image}
                onClick={handleProcessing}
                className="w-full px-4 py-6 bg-primary text-primary-foreground rounded-3xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Lightbulb size={18} />
                {isUploading
                  ? 'Subiendo a Cloudinary...'
                  : isProcessing
                    ? 'Procesando...'
                    : 'Procesar Simulacion'}
              </Button>

              <Button
                disabled={!simulatedImage}
                onClick={handleComparison}
                className="w-full px-4 py-6 bg-secondary text-secondary-foreground rounded-3xl font-medium flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:opacity-50"
              >
                <Eye size={18} />
                {showComparison ? 'Ocultar Comparacion' : 'Comparar Antes/Despues'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIInsightsPanel
        isVisible={showAIInsights}
        onClose={() => setShowAIInsights(false)}
      />
    </motion.div>
  );
}
