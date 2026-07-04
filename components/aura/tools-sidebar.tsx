'use client';

import { Button } from '@/components/ui/button';
import { Zap, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { TreatmentTooltip } from './treatment-tooltip';
import { useToast } from './toast-container';
import { useAura } from '@/context/AuraContext';

const toolCategories = [
  {
    name: 'Esculpido Facial',
    tools: [
      {
        name: 'Rinoplastia',
        description: 'Refinamiento de la forma y tamaño de la nariz',
        duration: '1-2 horas',
        recovery: '1-2 semanas',
      },
      {
        name: 'Mentoplastia',
        description: 'Mejora del mentón para armonía facial',
        duration: '1 hora',
        recovery: '1 semana',
      },
    ],
  },
  {
    name: 'Piel',
    tools: [
      {
        name: 'Botox',
        description: 'Suavizado de líneas y arrugas de expresión',
        duration: '15 minutos',
        recovery: 'Sin tiempo de recuperación',
      },
      {
        name: 'Lifting',
        description: 'Elevación de rasgos faciales para efecto tensor',
        duration: '2 horas',
        recovery: '2 semanas',
      },
    ],
  },
  {
    name: 'Capilar',
    tools: [
      {
        name: 'Implantes',
        description: 'Restauración y densidad capilar natural',
        duration: '4-6 horas',
        recovery: '1 mes',
      },
    ],
  },
];

interface ToolsSidebarProps {
  onToolSelect?: (tool: string) => void;
  onToolHover?: (tool: string | null) => void;
}

export function ToolsSidebar({ onToolSelect, onToolHover }: ToolsSidebarProps) {
  const { addToast } = useToast();
  const { setSelectedTreatment } = useAura();

  const handleToolClick = (toolName: string) => {
    onToolSelect?.(toolName);
    setSelectedTreatment(toolName);
    
    addToast(`Simulación de ${toolName} aplicando...`, 'success');
  };

  const handleSave = () => {
    addToast('Simulación guardada correctamente', 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-30 overflow-visible bg-card rounded-3xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Herramientas</h3>

      <div className="space-y-6">
        {toolCategories.map((category) => (
          <div key={category.name}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              {category.name}
            </h4>
            <div className="space-y-2">
              {category.tools.map((tool) => (
                <motion.div
                  key={tool.name}
                  className="relative group"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToolClick(tool.name)}
                    onMouseEnter={() => onToolHover?.(tool.name)}
                    onMouseLeave={() => onToolHover?.(null)}
                    className="w-full px-4 py-3 bg-background text-foreground border-2 border-border rounded-3xl hover:border-primary hover:text-primary transition-all duration-300 text-sm font-medium flex items-center justify-between group"
                  >
                    <span>{tool.name}</span>
                    <TreatmentTooltip
                      treatment={tool.name}
                      description={tool.description}
                      duration={tool.duration}
                      recovery={tool.recovery}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className="w-full mt-8 px-4 py-3 bg-primary text-primary-foreground rounded-3xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
      >
        <Save size={18} />
        Guardar Simulación
      </motion.button>
    </motion.div>
  );
}
