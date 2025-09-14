'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple' | 'orange';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) : null;
      if (stored) {
        setThemeState(stored);
        return;
      }
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) setThemeState('dark');
    } catch {
      
    }
  }, []);

  
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-blue', 'theme-green', 'theme-purple', 'theme-orange');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme !== 'light') {
      root.classList.add(`theme-${theme}`);
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme: (t: Theme) => setThemeState(t),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
