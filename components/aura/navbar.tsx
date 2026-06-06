'use client';

import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  theme?: 'experiencia' | 'consulta';
  onThemeChange?: (theme: 'experiencia' | 'consulta') => void;
}

export function Navbar({ theme = 'experiencia', onThemeChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Espejo Inteligente', href: '#espejo-inteligente' },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="#inicio" onClick={handleNavClick} className="flex-shrink-0 hover:opacity-80 transition">
            <h1 className="text-2xl font-bold text-primary">Aura Belleza</h1>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={() => onThemeChange?.(theme === 'experiencia' ? 'consulta' : 'experiencia')}
              className="p-2 hover:bg-secondary/20 rounded-full transition-colors"
              title={theme === 'experiencia' ? 'Cambiar a Modo Clínica' : 'Cambiar a Modo Experiencia'}
            >
              {theme === 'experiencia' ? (
                <Sun size={20} className="text-primary" />
              ) : (
                <Moon size={20} className="text-primary" />
              )}
            </button>
            
            {/* BOTÓN DESKTOP CORREGIDO A DORADO PREMIUM FORZADO */}
            <Button 
              className="!bg-[#d4af37] !text-[#2c2c2c] hover:!bg-[#bfa030] hover:!text-[#2c2c2c] font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 opacity-100 block"
              onClick={() => window.location.hash = '#simulador'}
            >
              Agendar Cita
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="block py-2 text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            
            {/* Theme Toggle Mobile */}
            <button
              onClick={() => {
                onThemeChange?.(theme === 'experiencia' ? 'consulta' : 'experiencia');
                handleNavClick();
              }}
              className="w-full py-2 px-4 flex items-center justify-between bg-secondary/10 hover:bg-secondary/20 rounded-3xl transition-colors"
            >
              <span className="text-sm font-medium text-foreground">
                {theme === 'experiencia' ? 'Modo Experiencia' : 'Modo Clínica'}
              </span>
              {theme === 'experiencia' ? (
                <Sun size={16} className="text-primary" />
              ) : (
                <Moon size={16} className="text-primary" />
              )}
            </button>
            
            {/* BOTÓN MOBILE CORRECTO */}
            <Button 
              className="w-full !bg-[#d4af37] !text-[#2c2c2c] hover:!bg-[#bfa030] hover:!text-[#2c2c2c] font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300 opacity-100 block"
              onClick={() => {
                window.location.hash = '#simulador';
                handleNavClick();
              }}
            >
              Agendar Cita
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}