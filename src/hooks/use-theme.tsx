import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PresentationTheme, ColorPalette, FontPairing, StylePreference, BackgroundStyle } from '@/types/theme';
import { COLOR_PALETTES, FONT_PAIRINGS } from '@/types/theme';

interface ThemeContextType {
  theme: PresentationTheme;
  updatePalette: (palette: ColorPalette) => void;
  updateFonts: (fonts: FontPairing) => void;
  updateStyle: (style: StylePreference) => void;
  updateBackgroundStyle: (style: BackgroundStyle) => void;
  updateBackgroundImage: (url: string) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: PresentationTheme = {
  palette: COLOR_PALETTES[0],
  fonts: FONT_PAIRINGS[0],
  style: 'minimal',
  backgroundStyle: 'solid',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<PresentationTheme>(() => {
    const saved = localStorage.getItem('stanzify-theme');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });

  useEffect(() => {
    localStorage.setItem('stanzify-theme', JSON.stringify(theme));
  }, [theme]);

  const updatePalette = (palette: ColorPalette) => {
    setTheme((prev) => ({ ...prev, palette }));
  };

  const updateFonts = (fonts: FontPairing) => {
    setTheme((prev) => ({ ...prev, fonts }));
  };

  const updateStyle = (style: StylePreference) => {
    setTheme((prev) => ({ ...prev, style }));
  };

  const updateBackgroundStyle = (backgroundStyle: BackgroundStyle) => {
    setTheme((prev) => ({ ...prev, backgroundStyle }));
  };

  const updateBackgroundImage = (url: string) => {
    setTheme((prev) => ({ ...prev, backgroundImage: url }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    localStorage.removeItem('stanzify-theme');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updatePalette,
        updateFonts,
        updateStyle,
        updateBackgroundStyle,
        updateBackgroundImage,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
