'use client';

import { SVGProps, memo } from 'react';

interface FaceMappingOverlayProps {
  isVisible: boolean;
  hoveredTool: string | null;
}

const FaceMappingDot = memo(({ point, isActive }: any) => (
  <circle
    cx={point.cx}
    cy={point.cy}
    r={isActive ? '2.5' : '1.5'}
    fill="#d4af37"
    opacity={isActive ? 0.9 : 0.5}
    className="transition-all duration-300 will-change-transform"
    style={{
      filter: isActive 
        ? 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))' 
        : 'drop-shadow(0 0 2px rgba(212, 175, 55, 0.4))',
      backfaceVisibility: 'hidden',
    }}
  />
));
FaceMappingDot.displayName = 'FaceMappingDot';

export function FaceMappingOverlay({ isVisible, hoveredTool }: FaceMappingOverlayProps) {
  // Define facial mapping points - condensed to center on face region (adjusted to face proportions)
  const foreheadPoints = [
    { id: 'f1', cx: '50', cy: '25', label: 'Frente Centro' },
    { id: 'f2', cx: '35', cy: '22', label: 'Frente Izquierda' },
    { id: 'f3', cx: '65', cy: '22', label: 'Frente Derecha' },
    { id: 'f4', cx: '40', cy: '32', label: 'Ceja Izquierda' },
    { id: 'f5', cx: '60', cy: '32', label: 'Ceja Derecha' },
  ];

  const nosePoints = [
    { id: 'n1', cx: '50', cy: '40', label: 'Puente Nasal' },
    { id: 'n2', cx: '50', cy: '50', label: 'Punta Nasal' },
  ];

  const jawPoints = [
    { id: 'j1', cx: '35', cy: '65', label: 'Mandíbula Izquierda' },
    { id: 'j2', cx: '65', cy: '65', label: 'Mandíbula Derecha' },
    { id: 'j3', cx: '50', cy: '72', label: 'Barbilla' },
  ];

  const cheekPoints = [
    { id: 'c1', cx: '30', cy: '48', label: 'Mejilla Izquierda' },
    { id: 'c2', cx: '70', cy: '48', label: 'Mejilla Derecha' },
  ];

  const getIsActive = (point: any) => {
    if (!hoveredTool) return false;

    switch (hoveredTool) {
      case 'Botox':
      case 'Lifting':
        return foreheadPoints.some((p) => p.id === point.id);
      case 'Rinoplastia':
        return nosePoints.some((p) => p.id === point.id);
      case 'Mentoplastia':
        return jawPoints.some((p) => p.id === point.id);
      default:
        return false;
    }
  };

  const allPoints = [...foreheadPoints, ...nosePoints, ...jawPoints, ...cheekPoints];

  return (
    <svg
      viewBox="0 0 100 100"
      className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      preserveAspectRatio="xMidYMid slice"
      style={{ zIndex: 10, backfaceVisibility: 'hidden' }}
    >
      {allPoints.map((point) => {
        const isActive = getIsActive(point);
        return (
          <FaceMappingDot key={point.id} point={point} isActive={isActive} />
        );
      })}
    </svg>
  );
}
