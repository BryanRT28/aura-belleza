'use client';

import { useEffect } from 'react';

export type AppTheme = 'experiencia' | 'consulta' | 'oscuro';

export function useTheme(theme: AppTheme) {
  useEffect(() => {
    const html = document.documentElement;

    // Primero limpiamos todos los modos
    html.classList.remove('modo-consulta');
    html.classList.remove('dark');

    // Modo clínico / consulta
    if (theme === 'consulta') {
      html.classList.add('modo-consulta');
    }

    // Modo oscuro real
    if (theme === 'oscuro') {
      html.classList.add('dark');
    }

    // Guardamos el tema elegido
    localStorage.setItem('aura-theme', theme);
  }, [theme]);
}