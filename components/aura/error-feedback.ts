export type FeedbackMessage = {
  title: string;
  description: string;
};

function getRawMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error || '');
}

export function getFriendlyFeedback(error: unknown, context: 'upload' | 'ai' | 'save' | 'pdf'): FeedbackMessage {
  const rawMessage = getRawMessage(error);
  const normalized = rawMessage.toLowerCase();

  if (context === 'upload') {
    if (normalized.includes('30 mb') || normalized.includes('10 mb') || normalized.includes('pesada')) {
      return {
        title: 'Imagen demasiado pesada',
        description: 'Usa una foto menor a 30 MB o intenta con una imagen JPG/PNG mas liviana.',
      };
    }

    if (normalized.includes('imagen valida') || normalized.includes('image/')) {
      return {
        title: 'Formato no compatible',
        description: 'Selecciona una imagen valida en formato JPG, PNG o WebP.',
      };
    }

    if (normalized.includes('cloudinary') || normalized.includes('upload')) {
      return {
        title: 'No se pudo subir la imagen',
        description: 'Revisa tu conexion o la configuracion de Cloudinary e intenta nuevamente.',
      };
    }

    return {
      title: 'Error al preparar la imagen',
      description: rawMessage || 'Intenta con otra foto clara, frontal y bien iluminada.',
    };
  }

  if (context === 'ai') {
    if (
      normalized.includes('saldo') ||
      normalized.includes('billing') ||
      normalized.includes('credit') ||
      normalized.includes('insufficient')
    ) {
      return {
        title: 'Replicate no tiene credito disponible',
        description: 'La conexion funciona, pero la cuenta de Replicate necesita saldo o billing activo.',
      };
    }

    if (normalized.includes('tardo demasiado') || normalized.includes('timeout')) {
      return {
        title: 'La IA tardo demasiado',
        description: 'Intenta nuevamente en unos segundos o usa una imagen mas liviana.',
      };
    }

    if (normalized.includes('url publica') || normalized.includes('cloudinary')) {
      return {
        title: 'La IA necesita una URL publica',
        description: 'Vuelve a subir la imagen para generar una URL publica de Cloudinary.',
      };
    }

    return {
      title: 'No se pudo procesar la simulacion',
      description: rawMessage || 'Intenta otra vez o prueba con una imagen mas clara.',
    };
  }

  if (context === 'save') {
    if (normalized.includes('paciente') || normalized.includes('base') || normalized.includes('database')) {
      return {
        title: 'No se pudo guardar en la base de datos',
        description: 'Revisa que la base de datos local este configurada y vuelve a intentar.',
      };
    }

    return {
      title: 'No se pudo guardar la simulacion',
      description: rawMessage || 'Procesa una simulacion completa antes de guardarla.',
    };
  }

  if (normalized.includes('imagen') || normalized.includes('descargar')) {
    return {
      title: 'No se pudo generar el PDF',
      description: 'Una de las imagenes no pudo descargarse. Guarda otra simulacion o intenta de nuevo.',
    };
  }

  return {
    title: 'No se pudo descargar el PDF',
    description: rawMessage || 'Guarda la simulacion y vuelve a generar el reporte.',
  };
}

export function formatFeedbackForToast(feedback: FeedbackMessage) {
  return `${feedback.title}. ${feedback.description}`;
}
