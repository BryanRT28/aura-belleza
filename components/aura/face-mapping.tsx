'use client';

import { motion } from 'framer-motion';

interface FaceMappingOverlayProps {
  isVisible: boolean;
  hoveredTool: string | null;
}

export function FaceMappingOverlay({ isVisible, hoveredTool }: FaceMappingOverlayProps) {
  if (!isVisible) return null;

  // Coordenadas simuladas agrupadas en el centro para evitar dispersión
  const dots = [
    { id: 1, cx: "45%", cy: "30%", area: "Botox" }, // Frente izquierda
    { id: 2, cx: "55%", cy: "30%", area: "Botox" }, // Frente derecha
    { id: 3, cx: "50%", cy: "35%", area: "Botox" }, // Entretejo
    { id: 4, cx: "48%", cy: "48%", area: "Rinoplastia" }, // Tabique nasal
    { id: 5, cx: "52%", cy: "52%", area: "Rinoplastia" }, // Punta nasal
    { id: 6, cx: "38%", cy: "68%", area: "Mentoplastia" }, // Mandíbula izquierda
    { id: 7, cx: "62%", cy: "68%", area: "Mandíbula derecha" }, // Mandíbula derecha
    { id: 8, cx: "50%", cy: "74%", area: "Mentoplastia" }, // Mentón
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      {dots.map((dot) => {
        // Lógica de iluminación activa condicional por hover
        const isActive = hoveredTool === dot.area;
        
        return (
          <g key={dot.id}>
            {/* Halo de brillo sutil */}
            <motion.circle
              cx={dot.cx}
              cy={dot.cy}
              r={isActive ? 8 : 4}
              className="transition-all duration-300"
              fill={isActive ? "#d4af37" : "rgba(212, 175, 55, 0.4)"}
              animate={isActive ? { scale: [1, 1.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            {/* Nodo central fino */}
            <circle
              cx={dot.cx}
              cy={dot.cy}
              r={2.5}
              fill="#d4af37"
            />
          </g>
        );
      })}
    </svg>
  );
}