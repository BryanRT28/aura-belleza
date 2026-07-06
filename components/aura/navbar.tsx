'use client';

import { Button } from '@/components/ui/button';
import type { AppTheme } from '@/hooks/use-theme';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Menu,
  Moon,
  Sparkles,
  Stethoscope,
  Sun,
  WandSparkles,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavbarProps {
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
}

const nextTheme: Record<AppTheme, AppTheme> = {
  experiencia: 'consulta',
  consulta: 'oscuro',
  oscuro: 'experiencia',
};

const themeLabel: Record<AppTheme, string> = {
  experiencia: 'Experiencia',
  consulta: 'Consulta',
  oscuro: 'Oscuro',
};

const navLinks = [
  { label: 'Inicio', href: '#inicio', id: 'inicio' },
  { label: 'Servicios', href: '#servicios', id: 'servicios' },
  { label: 'Espejo IA', href: '#espejo-inteligente', id: 'espejo-inteligente' },
  { label: 'Opiniones', href: '#resenas', id: 'resenas' },
];

export function Navbar({ theme = 'experiencia', onThemeChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: 0.01,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    const element = document.getElementById(href.replace('#', ''));

    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', href);
    setActiveSection(href.replace('#', ''));
    setIsOpen(false);
  };

  const ThemeIcon =
    theme === 'experiencia' ? Sun : theme === 'consulta' ? Stethoscope : Moon;

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        isScrolled
          ? 'border-border/80 bg-background/88 shadow-lg shadow-black/5 backdrop-blur-xl'
          : 'border-transparent bg-background/72 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <button
            type="button"
            onClick={() => scrollTo('#inicio')}
            className="group flex min-w-0 items-center gap-3 text-left"
            aria-label="Ir al inicio de Aura Belleza"
          >
            <motion.span
              whileHover={{ rotate: -6, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/12 text-primary shadow-sm"
            >
              <span className="absolute inset-1 rounded-md border border-primary/15" />
              <Sparkles size={22} className="relative" />
            </motion.span>
            <span className="min-w-0">
              <span className="block text-lg font-bold leading-tight text-foreground lg:text-xl">
                Aura Belleza
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                IA Estetica
              </span>
            </span>
          </button>

          <div className="hidden items-center rounded-lg border border-border/80 bg-card/80 p-1 shadow-sm lg:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className={`relative rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-md bg-primary shadow-sm"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => onThemeChange?.(nextTheme[theme])}
              className="group flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-semibold text-foreground shadow-sm hover:border-primary/70 hover:text-primary"
              title={`Cambiar modo. Actual: ${themeLabel[theme]}`}
              aria-label={`Cambiar modo. Actual: ${themeLabel[theme]}`}
            >
              <ThemeIcon size={17} />
              <span>{themeLabel[theme]}</span>
            </button>

            <Button
              className="h-10 rounded-md px-4 font-semibold shadow-md shadow-primary/20"
              onClick={() => scrollTo('#espejo-inteligente')}
            >
              <WandSparkles size={17} />
              Simular
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm lg:hidden"
            aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? 'close' : 'menu'}
                initial={{ rotate: -45, opacity: 0, scale: 0.85 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 45, opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.18 }}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="border-t border-border bg-background/96 px-4 pb-4 shadow-lg backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-3">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;

                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className={`flex items-center justify-between rounded-md px-4 py-3 text-left text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground hover:bg-secondary/40'
                    }`}
                  >
                    {link.label}
                    <ChevronRight size={16} />
                  </button>
                );
              })}

              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onThemeChange?.(nextTheme[theme]);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
                >
                  <ThemeIcon size={16} />
                  {themeLabel[theme]}
                </button>

                <Button
                  className="h-auto rounded-md py-3 font-semibold"
                  onClick={() => scrollTo('#espejo-inteligente')}
                >
                  <WandSparkles size={16} />
                  Simular
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
