'use client';

import { motion } from 'framer-motion';

interface FaceMappingOverlayProps {
  isVisible: boolean;
  hoveredTool: string | null;
}

export function FaceMappingOverlay({ isVisible, hoveredTool }: FaceMappingOverlayProps) {
  if (!isVisible) return null;

  const dots = [
    // BÓTOX
    { id: 1, cx: "45%", cy: "30%", area: "Botox" },
    { id: 2, cx: "55%", cy: "30%", area: "Botox" },
    { id: 3, cx: "50%", cy: "35%", area: "Botox" },
    
    // RINOPLASTIA (Se agregó el punto izquierdo id: 9)
    { id: 4, cx: "48%", cy: "48%", area: "Rinoplastia" }, // Tabique
    { id: 5, cx: "52%", cy: "52%", area: "Rinoplastia" }, // Punta
    { id: 9, cx: "45%", cy: "51%", area: "Rinoplastia" }, // Ala nasal izquierda (¡Nuevo!)

    // MENTOPLASTIA (Movidos un 2% a la izquierda para alineación perfecta)
    { id: 6, cx: "36%", cy: "62%", area: "Mentoplastia" }, // Mandíbula izquierda (Antes 38%)
    { id: 7, cx: "60%", cy: "62%", area: "Mentoplastia" }, // Mandíbula derecha (Antes 62%)
    { id: 8, cx: "48%", cy: "66%", area: "Mentoplastia" }, // Centro del mentón (Antes 50%)
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      {dots.map((dot) => {
        const isActive = hoveredTool === dot.area;
        
        return (
          <g key={dot.id}>
            <motion.circle
              cx={dot.cx}
              cy={dot.cy}
              r={isActive ? 8 : 4}
              className="transition-all duration-300"
              fill={isActive ? "#d4af37" : "rgba(212, 175, 55, 0.4)"}
              animate={isActive ? { scale: [1, 1.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
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