declare module 'pptxgenjs' {
  export default class PptxGenJS {
    author: string;
    company: string;
    subject: string;
    title: string;
    
    addSlide(): Slide;
    writeFile(options: { fileName: string }): Promise<void>;
  }

  interface Slide {
    background: { color: string } | { path: string };
    addText(text: string | object[], options: TextOptions): void;
    addImage(options: ImageOptions): void;
  }

  interface TextOptions {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    fontSize?: number;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: 'left' | 'center' | 'right';
    valign?: 'top' | 'middle' | 'bottom';
  }

  interface ImageOptions {
    path: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  }
}
