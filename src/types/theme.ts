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

export type DesignStyle = 'minimal' | 'modern' | 'corporate' | 'dark' | 'creative' | 'academic';
export type ImageSource = 'upload' | 'unsplash' | 'none';
export type SlidePurpose = 'pitch' | 'educational' | 'business' | 'marketing' | 'webinar' | 'personal';

export interface PresentationConfig {
  palette: ColorPalette;
  fonts: FontPairing;
  designStyle: DesignStyle;
  imageSource: ImageSource;
  slidePurpose: SlidePurpose;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'minimal',
    name: 'Minimal White',
    primary: '#1F2937',
    secondary: '#111827',
    accent: '#3B82F6',
    background: '#FFFFFF',
  },
  {
    id: 'blue',
    name: 'Blue Tech',
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

export const DESIGN_STYLES: { value: DesignStyle; label: string; description: string }[] = [
  {
    value: 'minimal',
    label: 'Minimal Professional',
    description: 'Clean and simple with lots of white space',
  },
  {
    value: 'modern',
    label: 'Modern Gradient',
    description: 'Contemporary with gradient accents',
  },
  {
    value: 'corporate',
    label: 'Corporate Sharp',
    description: 'Professional and business-focused',
  },
  {
    value: 'dark',
    label: 'Dark Mode',
    description: 'Sleek dark theme for modern presentations',
  },
  {
    value: 'creative',
    label: 'Creative / Vibrant',
    description: 'Bold and visually striking',
  },
  {
    value: 'academic',
    label: 'Academic Clean',
    description: 'Structured and information-dense',
  },
];

export const IMAGE_SOURCES: { value: ImageSource; label: string; description: string }[] = [
  {
    value: 'upload',
    label: 'Upload my own images',
    description: 'Use your own images for slides',
  },
  {
    value: 'unsplash',
    label: 'Autofetch from Unsplash',
    description: 'Automatically find relevant images',
  },
  {
    value: 'none',
    label: 'No images (text-only)',
    description: 'Focus on content without images',
  },
];

export const SLIDE_PURPOSES: { value: SlidePurpose; label: string; description: string }[] = [
  {
    value: 'pitch',
    label: 'Pitch Deck',
    description: 'Investor presentations and startup pitches',
  },
  {
    value: 'educational',
    label: 'Educational Lesson',
    description: 'Teaching and training materials',
  },
  {
    value: 'business',
    label: 'Business Report',
    description: 'Corporate reports and analysis',
  },
  {
    value: 'marketing',
    label: 'Marketing Slides',
    description: 'Product launches and campaigns',
  },
  {
    value: 'webinar',
    label: 'Webinar Slides',
    description: 'Online presentations and workshops',
  },
  {
    value: 'personal',
    label: 'Personal / Creative',
    description: 'Personal projects and creative work',
  },
];

