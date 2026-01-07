import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Era = 'modern' | 'ancient' | 'future';

export interface ThemeColors {
  background: string;
  primary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeConfig {
  era: Era;
  colors: ThemeColors;
  typography: {
    fontFamily: string;
    headingFont: string;
    monoFont: string;
  };
  textures: {
    background: string;
    pattern: string;
  };
  name: string;
  description: string;
}

const modernTheme: ThemeConfig = {
  era: 'modern',
  name: 'Modern',
  description: 'Contemporary geometric design with gold and emerald accents',
  colors: {
    background: '#0f172a', // slate-900
    primary: '#059669',    // emerald-600
    accent: '#fbbf24',     // amber-400
    text: '#f8fafc',       // slate-50
    textSecondary: '#cbd5e1', // slate-300
    border: '#334155',     // slate-700
    card: '#1e293b',       // slate-800
    success: '#10b981',    // emerald-500
    warning: '#f59e0b',    // amber-500
    error: '#ef4444',      // red-500
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    headingFont: "'Playfair Display', serif",
    monoFont: "'JetBrains Mono', monospace",
  },
  textures: {
    background: 'none',
    pattern: 'linear-gradient(135deg, #059669 0%, #0f172a 50%, #fbbf24 100%)',
  },
};

const ancientTheme: ThemeConfig = {
  era: 'ancient',
  name: 'Ancient',
  description: 'Sandstone, madder red, and silk textures inspired by historical textiles',
  colors: {
    background: '#d4a574', // sandstone
    primary: '#c53030',    // madder red
    accent: '#d69e2e',     // gold ochre
    text: '#2d3748',       // gray-800
    textSecondary: '#4a5568', // gray-700
    border: '#b7791f',     // yellow-700
    card: '#e2c391',       // light sandstone
    success: '#38a169',    // green-600
    warning: '#d69e2e',    // amber-600
    error: '#c53030',      // red-600
  },
  typography: {
    fontFamily: "'Crimson Text', serif",
    headingFont: "'Cormorant Garamond', serif",
    monoFont: "'Crimson Text', serif",
  },
  textures: {
    background: `
      linear-gradient(135deg, #d4a574 0%, #e2c391 100%),
      url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='silk' patternUnits='userSpaceOnUse' width='40' height='40'%3E%3Cpath d='M0,20 Q10,15 20,20 T40,20' stroke='%23c53030' stroke-width='0.5' fill='none' opacity='0.1'/%3E%3Cpath d='M20,0 Q25,10 20,20 T20,40' stroke='%23d69e2e' stroke-width='0.5' fill='none' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23silk)' opacity='0.3'/%3E%3C/svg%3E")
    `,
    pattern: 'linear-gradient(135deg, #c53030 0%, #d4a574 50%, #d69e2e 100%)',
  },
};

const futureTheme: ThemeConfig = {
  era: 'future',
  name: 'Future',
  description: 'Obsidian, neon cyan, and bioluminescent glow for speculative interfaces',
  colors: {
    background: '#0a0a0f', // near-black
    primary: '#00f5ff',    // neon cyan
    accent: '#ff00ff',     // magenta
    text: '#e0e0ff',       // light blue-white
    textSecondary: '#a0a0ff', // lavender
    border: '#222244',     // dark blue
    card: '#111122',       // dark navy
    success: '#00ffaa',    // neon green
    warning: '#ffaa00',    // amber
    error: '#ff0055',      // pink-red
  },
  typography: {
    fontFamily: "'Rajdhani', sans-serif",
    headingFont: "'Orbitron', sans-serif",
    monoFont: "'Share Tech Mono', monospace",
  },
  textures: {
    background: `
      radial-gradient(circle at 50% 50%, #0a0a0f 0%, #000005 100%),
      repeating-linear-gradient(0deg, transparent, transparent 2px, #00f5ff05 2px, #00f5ff05 4px),
      repeating-linear-gradient(90deg, transparent, transparent 2px, #ff00ff03 2px, #ff00ff03 4px)
    `,
    pattern: 'linear-gradient(135deg, #00f5ff 0%, #0a0a0f 50%, #ff00ff 100%)',
  },
};

export const themes: Record<Era, ThemeConfig> = {
  modern: modernTheme,
  ancient: ancientTheme,
  future: futureTheme,
};

interface ThemeContextType {
  era: Era;
  theme: ThemeConfig;
  setEra: (era: Era) => void;
  cycleEra: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [era, setEra] = useState<Era>('modern');
  const theme = themes[era];

  const cycleEra = () => {
    const eras: Era[] = ['modern', 'ancient', 'future'];
    const currentIndex = eras.indexOf(era);
    const nextIndex = (currentIndex + 1) % eras.length;
    setEra(eras[nextIndex]);
  };

  // Apply theme to document root for CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-card', theme.colors.card);
    
    // Set font families
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    root.style.setProperty('--font-heading', theme.typography.headingFont);
    root.style.setProperty('--font-mono', theme.typography.monoFont);
    
    // Update body class for era-specific styling
    document.body.className = `era-${era}`;
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors.background);
    }
  }, [era, theme]);

  return (
    <ThemeContext.Provider value={{ era, theme, setEra, cycleEra }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};