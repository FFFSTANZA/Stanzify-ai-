export interface ComponentSlideData {
  id: string;
  componentId: string;
  props: Record<string, any>;
  layout?: string;
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  transition?: 'fade' | 'slide-left' | 'slide-right' | 'zoom-in' | 'none';
}

export interface ComponentPresentationData {
  title: string;
  subtitle?: string;
  theme: string;
  slides: ComponentSlideData[];
  metadata?: {
    author?: string;
    date?: string;
    duration?: number;
  };
}

export interface ComponentMetadata {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  useCases: string[];
  tags: string[];
  propsSchema: Record<string, PropSchema>;
}

export type ComponentCategory =
  | 'hero'
  | 'layout'
  | 'content'
  | 'visualization'
  | 'interactive'
  | 'data'
  | 'media'
  | 'special';

export interface PropSchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum';
  required?: boolean;
  default?: any;
  description?: string;
  enumValues?: string[];
}

export interface SlideComponentProps {
  theme?: string;
  palette?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  className?: string;
}
