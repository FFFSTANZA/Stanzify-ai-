export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface FontPairing {
  id: string;
  name: string;
  heading: string;
  body: string;
}

export type StylePreference = 'minimal' | 'corporate' | 'creative' | 'academic';

export type BackgroundStyle = 'solid' | 'gradient' | 'image';

export interface PresentationTheme {
  palette: ColorPalette;
  fonts: FontPairing;
  style: StylePreference;
  backgroundStyle: BackgroundStyle;
  backgroundImage?: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
    background: '#F0F9FF',
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    primary: '#F97316',
    secondary: '#EA580C',
    accent: '#FB923C',
    background: '#FFF7ED',
  },
  {
    id: 'forest',
    name: 'Forest Green',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    background: '#F0FDF4',
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA',
    background: '#FAF5FF',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    primary: '#1F2937',
    secondary: '#111827',
    accent: '#4B5563',
    background: '#F9FAFB',
  },
];

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'modern',
    name: 'Modern Sans',
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  {
    id: 'classic',
    name: 'Classic Serif',
    heading: 'Playfair Display, Georgia, serif',
    body: 'Source Sans Pro, sans-serif',
  },
  {
    id: 'tech',
    name: 'Tech Mono',
    heading: 'Space Grotesk, sans-serif',
    body: 'IBM Plex Sans, sans-serif',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    heading: 'Cormorant Garamond, serif',
    body: 'Lato, sans-serif',
  },
];

export const STYLE_PREFERENCES: { value: StylePreference; label: string; description: string }[] = [
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Clean and simple with lots of white space',
  },
  {
    value: 'corporate',
    label: 'Corporate',
    description: 'Professional and business-focused',
  },
  {
    value: 'creative',
    label: 'Creative',
    description: 'Bold and visually striking',
  },
  {
    value: 'academic',
    label: 'Academic',
    description: 'Structured and information-dense',
  },
];
