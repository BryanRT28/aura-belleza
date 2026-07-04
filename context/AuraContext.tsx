'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

interface AuraContextType {
  selectedTreatment: string | null;
  setSelectedTreatment: (treatment: string | null) => void;

  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;

  generatedImage: string | null;
  setGeneratedImage: (image: string | null) => void;

  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export function AuraProvider({ children }: { children: ReactNode }) {
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <AuraContext.Provider
      value={{
        selectedTreatment,
        setSelectedTreatment,

        uploadedImage,
        setUploadedImage,

        generatedImage,
        setGeneratedImage,

        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </AuraContext.Provider>
  );
}

export function useAura() {
  const context = useContext(AuraContext);

  if (!context) {
    throw new Error('useAura debe utilizarse dentro de AuraProvider');
  }

  return context;
}