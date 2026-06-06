'use client';

import { useEffect } from 'react';

export function useTheme(theme: 'experiencia' | 'consulta') {
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'consulta') {
      html.classList.add('modo-consulta');
    } else {
      html.classList.remove('modo-consulta');
    }
  }, [theme]);
}
