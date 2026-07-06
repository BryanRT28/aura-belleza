'use client';

import { CheckCircle, Clock, Download, FileText, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { TreatmentTooltip } from './treatment-tooltip';
import type { SimulationWorkflowState } from './image-viewer';

const toolCategories = [
  {
    name: 'Esculpido Facial',
    tools: [
      {
        name: 'Rinoplastia',
        description: 'Refinamiento de la forma y tamano de la nariz',
        duration: '1-2 horas',
        recovery: '1-2 semanas',
      },
      {
        name: 'Mentoplastia',
        description: 'Mejora del menton para armonia facial',
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
        description: 'Suavizado de lineas y arrugas de expresion',
        duration: '15 minutos',
        recovery: 'Sin tiempo de recuperacion',
      },
      {
        name: 'Lifting',
        description: 'Elevacion de rasgos faciales para efecto tensor',
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
        description: 'Restauracion y densidad capilar natural',
        duration: '4-6 horas',
        recovery: '1 mes',
      },
    ],
  },
];

interface ToolsSidebarProps {
  selectedTool?: string | null;
  canSaveSimulation?: boolean;
  isSavingSimulation?: boolean;
  isDownloadingPdf?: boolean;
  savedSimulationId?: number | null;
  workflow?: SimulationWorkflowState;
  onToolSelect?: (tool: string) => void;
  onToolHover?: (tool: string | null) => void;
  onSaveSimulation?: () => void;
  onDownloadPdf?: () => void;
}

export function ToolsSidebar({
  selectedTool,
  canSaveSimulation = false,
  isSavingSimulation = false,
  isDownloadingPdf = false,
  savedSimulationId,
  workflow,
  onToolSelect,
  onToolHover,
  onSaveSimulation,
  onDownloadPdf,
}: ToolsSidebarProps) {
  const saveDisabled = !canSaveSimulation || isSavingSimulation;
  const saveLabel = isSavingSimulation
    ? 'Guardando...'
    : savedSimulationId
      ? 'Simulacion Guardada'
      : 'Guardar Simulacion';
  const saveStatus = isSavingSimulation
    ? 'Guardando simulacion'
    : savedSimulationId
      ? `Guardada con ID ${savedSimulationId}`
      : canSaveSimulation
        ? 'Lista para guardar'
        : 'Sin simulacion lista';

  const handleToolClick = (toolName: string) => {
    onToolSelect?.(toolName);
  };

  const workflowItems = [
    {
      label: 'Tratamiento seleccionado',
      done: !!workflow?.hasTreatment,
      active: false,
    },
    {
      label: 'Imagen publica lista',
      done: !!workflow?.hasImage,
      active: !!workflow?.isUploading,
    },
    {
      label: 'Resultado IA generado',
      done: !!workflow?.hasResult,
      active: !!workflow?.isProcessing,
    },
    {
      label: 'Reporte guardado',
      done: !!savedSimulationId,
      active: isSavingSimulation,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-30 overflow-visible bg-card rounded-3xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Herramientas</h3>

      <div className="mb-6 rounded-3xl border border-border bg-background/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Flujo guiado
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              Completa los pasos para generar y exportar.
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock size={18} />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {workflowItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  item.done
                    ? 'bg-primary text-primary-foreground'
                    : item.active
                      ? 'bg-primary/15 text-primary'
                      : 'bg-secondary text-muted-foreground'
                }`}
              >
                {item.active ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : item.done ? (
                  <CheckCircle size={12} />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span className={item.done ? 'text-foreground' : ''}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

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
                  animate={{ scale: selectedTool === tool.name ? 1.02 : 1 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToolClick(tool.name)}
                    onMouseEnter={() => onToolHover?.(tool.name)}
                    onMouseLeave={() => onToolHover?.(null)}
                    aria-pressed={selectedTool === tool.name}
                    className={`w-full px-4 py-3 border-2 rounded-3xl transition-all duration-300 text-sm font-medium flex items-center justify-between group ${
                      selectedTool === tool.name
                        ? 'bg-background border-primary text-primary shadow-md'
                        : 'bg-background text-foreground border-border hover:border-primary hover:text-primary'
                    }`}
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

      <div className="mt-8 space-y-3" aria-live="polite">
        <div
          className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium ${
            savedSimulationId
              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-200'
              : canSaveSimulation
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border bg-secondary/30 text-muted-foreground'
          }`}
        >
          {savedSimulationId ? (
            <CheckCircle size={16} />
          ) : canSaveSimulation ? (
            <Clock size={16} />
          ) : (
            <Save size={16} />
          )}
          <span>{saveStatus}</span>
        </div>

        <motion.button
          whileHover={saveDisabled ? undefined : { scale: 1.02 }}
          whileTap={saveDisabled ? undefined : { scale: 0.98 }}
          disabled={saveDisabled}
          onClick={onSaveSimulation}
          aria-disabled={saveDisabled}
          title={canSaveSimulation ? 'Guardar simulacion actual' : 'Procesa una simulacion primero'}
          className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-3xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSavingSimulation ? (
            <Loader2 size={18} className="animate-spin" />
          ) : savedSimulationId ? (
            <CheckCircle size={18} />
          ) : (
            <Save size={18} />
          )}
          {saveLabel}
        </motion.button>

        {savedSimulationId && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={isDownloadingPdf ? undefined : { scale: 1.02 }}
            whileTap={isDownloadingPdf ? undefined : { scale: 0.98 }}
            disabled={isDownloadingPdf}
            onClick={onDownloadPdf}
            title="Descargar reporte PDF de la simulacion"
            className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-3xl font-medium flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDownloadingPdf ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {isDownloadingPdf ? 'Generando PDF...' : 'Descargar PDF'}
          </motion.button>
        )}

        {savedSimulationId && (
          <div className="flex items-start gap-2 rounded-2xl bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
            <FileText size={15} className="mt-0.5 shrink-0" />
            <span>Incluye datos del tratamiento, fecha e imagen antes/despues.</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
