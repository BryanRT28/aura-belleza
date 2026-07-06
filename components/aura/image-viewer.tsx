'use client';

import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle,
  Cloud,
  Eye,
  ImageIcon,
  Lightbulb,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ComparisonSlider } from './comparison-slider';
import { ProcessingOverlay } from './processing-overlay';
import { useToast } from '@/components/ui/use-toast';
import { FaceMappingOverlay } from './face-mapping';
import { AIInsightsPanel } from './ai-insights';
import { getFriendlyFeedback } from './error-feedback';

interface ImageViewerProps {
  onImageUpload?: (file: File) => void;
  onSimulationChange?: (simulation: SimulationDraft | null) => void;
  onWorkflowChange?: (workflow: SimulationWorkflowState) => void;
  selectedTreatment?: string | null;
  hoveredTool?: string | null;
}

export type SimulationDraft = {
  treatment: string;
  originalImageUrl: string;
  resultImageUrl: string;
};

export type SimulationWorkflowState = {
  hasImage: boolean;
  hasTreatment: boolean;
  hasResult: boolean;
  isUploading: boolean;
  isProcessing: boolean;
};

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

const MAX_SOURCE_IMAGE_SIZE = 30 * 1024 * 1024;
const MAX_CLOUDINARY_UPLOAD_SIZE = 9 * 1024 * 1024;
const MAX_COMPRESSED_DIMENSION = 1600;

async function compressImageForUpload(file: File) {
  if (file.size <= MAX_CLOUDINARY_UPLOAD_SIZE) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const imageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No fue posible preparar la imagen'));
      img.src = objectUrl;
    });

    const scale = Math.min(
      1,
      MAX_COMPRESSED_DIMENSION / Math.max(imageElement.width, imageElement.height),
    );
    const width = Math.max(1, Math.round(imageElement.width * scale));
    const height = Math.max(1, Math.round(imageElement.height * scale));
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('No fue posible comprimir la imagen');
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(imageElement, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.85);
    });

    if (!blob) {
      throw new Error('No fue posible comprimir la imagen');
    }

    if (blob.size > MAX_CLOUDINARY_UPLOAD_SIZE) {
      throw new Error('La imagen sigue siendo muy pesada despues de comprimirla');
    }

    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
      type: 'image/jpeg',
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

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

export function ImageViewer({
  onImageUpload,
  onSimulationChange,
  onWorkflowChange,
  selectedTreatment,
  hoveredTool,
}: ImageViewerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);
  const { toast } = useToast();

  const displayImage = previewImage ?? image;
  const activeTreatment = selectedTreatment ?? hoveredTool ?? null;
  const uploadReady = !!image && !isUploading;
  const canProcess = !!image && !!activeTreatment && !isUploading && !isProcessing;
  const disabledReason = isUploading
    ? 'Espera a que termine la subida a Cloudinary'
    : !image
      ? 'Sube una imagen para continuar'
      : !activeTreatment
        ? 'Selecciona un tratamiento'
        : null;

  const workflowSteps = [
    {
      label: 'Imagen',
      complete: !!image,
      active: isUploading,
      helper: isUploading ? 'Subiendo' : image ? 'Lista' : 'Pendiente',
    },
    {
      label: 'Tratamiento',
      complete: !!activeTreatment,
      active: false,
      helper: activeTreatment ?? 'Pendiente',
    },
    {
      label: 'IA',
      complete: !!simulatedImage,
      active: isProcessing,
      helper: isProcessing ? 'Procesando' : simulatedImage ? 'Completada' : 'Pendiente',
    },
  ];

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    onWorkflowChange?.({
      hasImage: !!image,
      hasTreatment: !!activeTreatment,
      hasResult: !!simulatedImage,
      isUploading,
      isProcessing,
    });
  }, [activeTreatment, image, isProcessing, isUploading, onWorkflowChange, simulatedImage]);

  const clearPreviewObjectUrl = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
  };

  const validateImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      const feedback = getFriendlyFeedback(new Error('imagen valida'), 'upload');
      toast({ title: feedback.title, description: feedback.description, variant: 'destructive' });
      return false;
    }

    if (file.size > MAX_SOURCE_IMAGE_SIZE) {
      const feedback = getFriendlyFeedback(new Error('30 MB'), 'upload');
      toast({ title: feedback.title, description: feedback.description, variant: 'destructive' });
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
    onSimulationChange?.(null);

    try {
      const uploadFile = await compressImageForUpload(file);
      const cloudinaryUrl = await uploadImageToCloudinary(uploadFile);

      clearPreviewObjectUrl();
      setPreviewImage(cloudinaryUrl);
      setImage(cloudinaryUrl);
      onImageUpload?.(file);
      toast({ title: 'Exito', description: 'Imagen subida a Cloudinary correctamente' });
    } catch (error) {
      const feedback = getFriendlyFeedback(error, 'upload');

      clearPreviewObjectUrl();
      setPreviewImage(null);
      setImage(null);
      onSimulationChange?.(null);
      toast({ title: feedback.title, description: feedback.description, variant: 'destructive' });
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
    setIsDragging(false);

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
    const treatment = activeTreatment;

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
    onSimulationChange?.(null);

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
      onSimulationChange?.({
        treatment,
        originalImageUrl: image,
        resultImageUrl: data.resultImageUrl,
      });
      toast({ title: 'Completado', description: 'Simulacion completada con exito' });
    } catch (error) {
      const feedback = getFriendlyFeedback(error, 'ai');

      toast({ title: feedback.title, description: feedback.description, variant: 'destructive' });
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
    onSimulationChange?.(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-3xl p-4 md:p-8 border border-border flex flex-col items-center justify-center min-h-96 relative"
      style={{ containIntrinsicSize: 'auto 400px' }}
    >
      <div className="w-full mb-5">
        <div className="grid grid-cols-3 gap-2" aria-label="Progreso de simulacion">
          {workflowSteps.map((step, index) => (
            <div
              key={step.label}
              className={`rounded-2xl border px-3 py-2 text-left transition-colors ${
                step.complete
                  ? 'border-primary/40 bg-primary/10'
                  : step.active
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.complete
                      ? 'bg-primary text-primary-foreground'
                      : step.active
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {step.active ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : step.complete ? (
                    <CheckCircle size={13} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="text-xs font-semibold text-foreground">{step.label}</span>
              </div>
              <p className="mt-1 truncate text-[11px] text-muted-foreground">{step.helper}</p>
            </div>
          ))}
        </div>
      </div>

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
              role="button"
              tabIndex={0}
              onDrop={handleDrop}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label="Subir imagen para simulacion"
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border hover:border-primary hover:bg-secondary/20'
              }`}
            >
              <motion.div
                animate={{ y: isDragging ? -4 : 0, scale: isDragging ? 1.05 : 1 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <Upload size={34} />
              </motion.div>
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
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-3xl"
              >
                Seleccionar Archivo
              </Button>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 border border-border">
                  <ShieldCheck size={13} />
                  JPG, PNG o WebP
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 border border-border">
                  <Cloud size={13} />
                  Se optimiza antes de subir
                </span>
              </div>
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
              {isUploading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-background/70 backdrop-blur-sm">
                  <Loader2 size={34} className="animate-spin text-primary" />
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    Subiendo imagen a Cloudinary
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Preparando una URL publica para la IA
                  </p>
                </div>
              )}
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
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
                          uploadReady
                            ? 'bg-green-50/90 text-green-700 border border-green-200'
                            : 'bg-background/80 text-muted-foreground border border-border'
                        }`}
                      >
                        {uploadReady ? <CheckCircle size={13} /> : <Loader2 size={13} className="animate-spin" />}
                        {uploadReady ? 'Cloudinary listo' : 'Subiendo'}
                      </span>
                      {activeTreatment && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-foreground border border-border backdrop-blur">
                          <ImageIcon size={13} />
                          {activeTreatment}
                        </span>
                      )}
                    </div>
                    <FaceMappingOverlay isVisible={!!displayImage} hoveredTool={hoveredTool ?? null} />
                  </div>
                  <button
                    onClick={handleResetSimulator}
                    aria-label="Cambiar imagen"
                    title="Cambiar imagen"
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground p-2 rounded-full hover:bg-background transition-colors z-10"
                  >
                    <RotateCcw size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <Button
                disabled={!canProcess}
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
              {disabledReason && (
                <p className="flex items-center gap-2 rounded-2xl bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
                  <AlertCircle size={14} />
                  {disabledReason}
                </p>
              )}

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
