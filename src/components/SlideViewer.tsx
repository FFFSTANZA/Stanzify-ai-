import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2, 
  Minimize2, 
  Home, 
  Play, 
  Pause,
  Presentation
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import mermaid from "mermaid";
import katex from "katex";
import "katex/dist/katex.min.css";
import { exportToPPTX } from "@/services/pptxService";
import { toast } from "sonner";
import type { ColorPalette } from "@/types/theme";

interface SlideViewerProps {
  markdown: string;
  onNewPresentation?: () => void;
  title?: string;
  palette?: ColorPalette;
}

interface Slide {
  frontmatter: Record<string, string>;
  content: string;
  layout: string;
  background?: string;
  backgroundImage?: string;
  image?: string;
  transition?: string;
  leftContent?: string;
  rightContent?: string;
  isTwoColumn?: boolean;
  parsedElements?: ContentElement[];
}

interface ContentElement {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'mermaid' | 'image' | 'math' | 'blockquote' | 'divider';
  level?: number;
  content?: string;
  language?: string;
  items?: string[];
  ordered?: boolean;
  src?: string;
  alt?: string;
}

const DEFAULT_PALETTE: ColorPalette = {
  id: 'default',
  name: 'Default',
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  background: '#FFFFFF',
};

function parseHexColor(color: string): { r: number; g: number; b: number } | null {
  const trimmed = color.trim();
  const match = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;

  const hex = match[1].length === 3
    ? match[1].split('').map((c) => c + c).join('')
    : match[1];

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return { r, g, b };
}

function withAlpha(color: string, alpha: number): string {
  const rgb = parseHexColor(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function isDarkColor(color: string): boolean {
  const rgb = parseHexColor(color);
  if (!rgb) return false;
  const srgb = [rgb.r, rgb.g, rgb.b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const [r, g, b] = srgb;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.45;
}

export function SlideViewer({ markdown, onNewPresentation, title = "Stanzify Presentation", palette }: SlideViewerProps) {
  const activePalette = palette ?? DEFAULT_PALETTE;

  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Mermaid
  useEffect(() => {
    const text = isDarkColor(activePalette.background) ? '#f8fafc' : '#0f172a';

    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
      flowchart: {
        curve: 'basis',
        padding: 12,
      },
      themeVariables: {
        primaryColor: withAlpha(activePalette.primary, 0.18),
        primaryTextColor: text,
        primaryBorderColor: activePalette.accent,
        lineColor: activePalette.secondary,
        secondaryColor: withAlpha(activePalette.secondary, 0.12),
        tertiaryColor: activePalette.background,
        background: activePalette.background,
        mainBkg: activePalette.background,
        secondBkg: withAlpha(activePalette.primary, 0.04),
        tertiaryBkg: withAlpha(activePalette.secondary, 0.06),
        fontSize: '18px',
      },
    });
  }, [activePalette.primary, activePalette.secondary, activePalette.accent, activePalette.background]);

  // Parse markdown into slides
  useEffect(() => {
    const parsedSlides = parseSlidevMarkdown(markdown);
    setSlides(parsedSlides);
    setCurrentSlide(0);
  }, [markdown]);

  // Render Mermaid diagrams
  useEffect(() => {
    const timer = setTimeout(() => {
      renderMermaidDiagrams();
    }, 150);
    return () => clearTimeout(timer);
  }, [currentSlide, slides]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && slides.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide(prev => {
          if (prev < slides.length - 1) {
            return prev + 1;
          } else {
            setIsAutoPlay(false);
            return prev;
          }
        });
      }, 5000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, slides.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "h":
          handlePrevSlide();
          break;
        case "ArrowRight":
        case "l":
        case " ":
          if (e.key === " ") e.preventDefault();
          handleNextSlide();
          break;
        case "Home":
          setCurrentSlide(0);
          break;
        case "End":
          setCurrentSlide(slides.length - 1);
          break;
        case "Escape":
          setIsFullscreen(false);
          break;
        case "f":
          setIsFullscreen(!isFullscreen);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, slides.length]);

  function parseSlidevMarkdown(markdown: string): Slide[] {
    const slides: Slide[] = [];
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");

    let idx = 0;

    while (idx < lines.length) {
      while (idx < lines.length && !lines[idx].trim()) idx++;
      if (idx >= lines.length) break;

      const frontmatter: Record<string, string> = {};

      // Slidev uses `---` as both slide separators and YAML frontmatter fences.
      // We parse frontmatter only when we see an opening `---` followed fairly
      // quickly by a closing `---` and at least one `key: value` line.
      if (lines[idx].trim() === "---") {
        let endIdx = -1;
        let sawLikelyContent = false;

        for (let j = idx + 1; j < Math.min(lines.length, idx + 40); j++) {
          const t = lines[j].trim();
          if (t === "---") {
            endIdx = j;
            break;
          }

          if (!t) continue;

          if (/^(#|```|::left::|::right::|!\[|>|\$\$|[-*+•]\s|[–—]\s|\d+\.\s|<ul\b|<ol\b|<li\b|<img\b)/i.test(t)) {
            sawLikelyContent = true;
            break;
          }
        }

        if (endIdx !== -1 && !sawLikelyContent) {
          const fmLines = lines.slice(idx + 1, endIdx);
          const hasFrontmatter = fmLines.some((l) => /^[\w-]+\s*:\s*/.test(l.trim()));

          if (hasFrontmatter) {
            for (const rawLine of fmLines) {
              const line = rawLine.trim();
              const match = line.match(/^([\w-]+)\s*:\s*(.*)$/);
              if (match) {
                frontmatter[match[1]] = match[2].trim();
              }
            }
            idx = endIdx + 1;
          } else {
            idx++;
          }
        } else {
          idx++;
        }
      }

      const contentLines: string[] = [];
      while (idx < lines.length && lines[idx].trim() !== "---") {
        contentLines.push(lines[idx]);
        idx++;
      }

      let content = contentLines.join("\n").trim();
      content = content.replace(/:::notes[\s\S]*?:::/g, "").trim();

      // Skip empty separators
      if (!content && Object.keys(frontmatter).length === 0) continue;

      const isTwoColumn = content.includes("::left::") && content.includes("::right::");
      let leftContent = "";
      let rightContent = "";

      if (isTwoColumn) {
        const parts = content.split("::right::");
        if (parts.length >= 2) {
          leftContent = parts[0].replace("::left::", "").trim();
          rightContent = parts[1].trim();
        }
      }

      const slide: Slide = {
        frontmatter,
        content: isTwoColumn ? "" : content,
        layout: frontmatter.layout || "default",
        background: frontmatter.background,
        backgroundImage: frontmatter.backgroundImage,
        image: frontmatter.image,
        transition: frontmatter.transition,
        isTwoColumn,
        leftContent,
        rightContent,
      };

      if (!isTwoColumn && content) {
        slide.parsedElements = parseContentElements(content);
      }

      slides.push(slide);
    }

    return slides;
  }

  function parseContentElements(content: string): ContentElement[] {
    const elements: ContentElement[] = [];
    const lines = content.split('\n');
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) {
        i++;
        continue;
      }

      // Code blocks
      if (line.startsWith('```')) {
        const language = line.substring(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const codeContent = codeLines.join('\n');
        
        if (language === 'mermaid') {
          elements.push({ type: 'mermaid', content: codeContent });
        } else {
          elements.push({ type: 'code', language, content: codeContent });
        }
        i++;
        continue;
      }

      // Mermaid blocks without fences (e.g. if code fences were stripped upstream)
      if (
        /^(%%\{init:|flowchart\b|graph\b|sequenceDiagram\b|classDiagram\b|stateDiagram\b|erDiagram\b|journey\b|gantt\b|pie\b|mindmap\b|timeline\b)/.test(line)
      ) {
        const mermaidLines: string[] = [lines[i].trimEnd()];
        i++;

        while (i < lines.length) {
          const nextLine = lines[i];
          const trimmed = nextLine.trim();

          if (!trimmed) break;
          if (trimmed.startsWith('```')) break;

          mermaidLines.push(nextLine.trimEnd());
          i++;
        }

        elements.push({ type: 'mermaid', content: mermaidLines.join('\n') });
        continue;
      }

      // HTML lists (<ul>/<ol>/<li>)
      const htmlLower = line.toLowerCase();

      if (htmlLower.startsWith('<ul') || htmlLower.startsWith('<ol')) {
        const ordered = htmlLower.startsWith('<ol');
        const closingTag = ordered ? '</ol>' : '</ul>';
        const start = i;

        const listLines: string[] = [];
        while (i < lines.length) {
          listLines.push(lines[i]);
          if (lines[i].toLowerCase().includes(closingTag)) {
            i++;
            break;
          }
          i++;
        }

        const block = listLines.join('\n');
        const items = Array.from(block.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
          .map((m) => m[1].replace(/\n+/g, ' ').trim())
          .filter(Boolean);

        if (items.length) {
          elements.push({ type: 'list', items, ordered });
          continue;
        }

        i = start;
      }

      if (htmlLower.startsWith('<li')) {
        const items: string[] = [];
        while (i < lines.length && lines[i].trim().toLowerCase().startsWith('<li')) {
          const li = lines[i].trim();
          const match = li.match(/^<li\b[^>]*>([\s\S]*?)<\/li>\s*$/i);
          items.push((match?.[1] ?? li).replace(/\n+/g, ' ').trim());
          i++;
        }

        if (items.length) {
          elements.push({ type: 'list', items, ordered: false });
          continue;
        }
      }

      // HTML image (<img ...>)
      if (htmlLower.startsWith('<img')) {
        const src = line.match(/src\s*=\s*['"]([^'"]+)['"]/i)?.[1];
        const alt = line.match(/alt\s*=\s*['"]([^'"]*)['"]/i)?.[1];
        if (src) {
          elements.push({ type: 'image', src, alt });
          i++;
          continue;
        }
      }

      // Headings
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const content = line.replace(/^#+\s*/, '');
        elements.push({ type: 'heading', level, content });
        i++;
        continue;
      }

      // Lists
      const unorderedListRegex = /^([-*+•]|[–—])\s+/;
      const orderedListRegex = /^\d+\.\s+/;

      if (unorderedListRegex.test(line) || orderedListRegex.test(line)) {
        const ordered = orderedListRegex.test(line);
        const items: string[] = [];

        while (i < lines.length) {
          const t = lines[i].trim();
          if (ordered) {
            if (!orderedListRegex.test(t)) break;
            items.push(t.replace(orderedListRegex, '').trim());
            i++;
            continue;
          }

          if (!unorderedListRegex.test(t)) break;
          items.push(t.replace(unorderedListRegex, '').trim());
          i++;
        }

        elements.push({ type: 'list', items, ordered });
        continue;
      }

      // Images
      if (line.match(/^!\[.*?\]\(.*?\)/)) {
        const match = line.match(/^!\[(.*?)\]\((.*?)\)/);
        if (match) {
          elements.push({ type: 'image', alt: match[1], src: match[2] });
        }
        i++;
        continue;
      }

      // Blockquotes
      if (line.startsWith('>')) {
        const content = line.replace(/^>\s*/, '');
        elements.push({ type: 'blockquote', content });
        i++;
        continue;
      }

      // Math blocks
      if (line.startsWith('$$')) {
        const mathLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('$$')) {
          mathLines.push(lines[i]);
          i++;
        }
        elements.push({ type: 'math', content: mathLines.join('\n') });
        i++;
        continue;
      }

      // Dividers
      if (line.match(/^---+$/) || line.match(/^\*\*\*+$/)) {
        elements.push({ type: 'divider' });
        i++;
        continue;
      }

      // Regular paragraph
      elements.push({ type: 'paragraph', content: line });
      i++;
    }

    return elements;
  }

  function renderMermaidDiagrams() {
    if (!slideContainerRef.current) return;
    
    const mermaidElements = slideContainerRef.current.querySelectorAll('.mermaid-diagram');
    mermaidElements.forEach((element, index) => {
      const code = element.getAttribute('data-mermaid-code') || '';
      if (code.trim() && !element.querySelector('svg')) {
        try {
          const id = `mermaid-${currentSlide}-${index}-${Date.now()}`;
          mermaid
            .render(id, code)
            .then(({ svg }) => {
              element.innerHTML = svg;

              const svgEl = element.querySelector('svg') as SVGElement | null;
              if (svgEl) {
                svgEl.removeAttribute('width');
                svgEl.removeAttribute('height');
                svgEl.style.maxWidth = '100%';
                svgEl.style.height = 'auto';
              }
            })
            .catch((error) => {
              console.error('Mermaid rendering error:', error);
              element.innerHTML = `<div class="p-4 bg-red-50 rounded-lg text-red-600 text-sm">Failed to render diagram</div>`;
            });
        } catch (error) {
          console.error('Mermaid element error:', error);
        }
      }
    });
  }

  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await exportToPPTX(slides, title);
      toast.success("Presentation exported as PPTX!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export presentation");
    } finally {
      setIsExporting(false);
    }
  };

  const currentSlideData = slides[currentSlide];

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No slides to display</p>
          {onNewPresentation && (
            <Button onClick={onNewPresentation} variant="outline">
              Create New Presentation
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${
        isFullscreen 
          ? "fixed inset-0 z-50 bg-slate-950" 
          : "h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      }`}
    >
      {/* Top Controls Bar */}
      <div className="border-b border-border/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${activePalette.primary} 0%, ${activePalette.accent} 100%)`,
                }}
              >
                <Presentation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{title}</h2>
                <p className="text-sm text-muted-foreground">
                  Slide {currentSlide + 1} of {slides.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="hidden md:inline">{isAutoPlay ? 'Pause' : 'Play'}</span>
              </Button>

              <Button
                onClick={handleDownload}
                disabled={isExporting}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">{isExporting ? 'Exporting...' : 'Download PPTX'}</span>
              </Button>

              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="ghost"
                size="sm"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>

              {onNewPresentation && (
                <Button
                  onClick={onNewPresentation}
                  variant="ghost"
                  size="sm"
                >
                  <Home className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Display Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <div 
          ref={slideContainerRef}
          className="w-full max-w-6xl aspect-[16/9] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-auto relative"
          style={{
            backgroundColor: activePalette.background,
            backgroundImage: currentSlideData.backgroundImage || currentSlideData.background 
              ? `url(${currentSlideData.backgroundImage || currentSlideData.background})` 
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <SlideContent slide={currentSlideData} palette={activePalette} />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="border-t border-border/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Slide Indicators */}
            <div className="flex gap-1.5 items-center max-w-md overflow-x-auto">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all flex-shrink-0 ${
                    idx === currentSlide 
                      ? 'w-8' 
                      : 'bg-slate-300 dark:bg-slate-600 w-2 hover:bg-slate-400'
                  }`}
                  style={idx === currentSlide ? { backgroundColor: activePalette.accent } : undefined}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={handleNextSlide}
              disabled={currentSlide === slides.length - 1}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SlideContentProps {
  slide: Slide;
  palette: ColorPalette;
}

function SlideContent({ slide, palette }: SlideContentProps) {
  const getLayoutStyles = (): { container: string; text: string; containerStyle?: React.CSSProperties } => {
    const baseClasses = "h-full w-full";
    const isDarkBg = isDarkColor(palette.background);

    switch (slide.layout) {
      case 'cover':
      case 'intro':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16 lg:p-20`,
          containerStyle: {
            backgroundImage: `linear-gradient(135deg, ${withAlpha(palette.primary, 0.92)} 0%, ${withAlpha(palette.accent, 0.92)} 100%)`,
          } as React.CSSProperties,
          text: 'text-white'
        };
      case 'section':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16 lg:p-20`,
          containerStyle: {
            backgroundImage: `linear-gradient(135deg, ${withAlpha(palette.secondary, 0.92)} 0%, ${withAlpha(palette.primary, 0.92)} 100%)`,
          } as React.CSSProperties,
          text: 'text-white'
        };
      case 'end':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16 lg:p-20`,
          containerStyle: {
            backgroundImage: `linear-gradient(135deg, ${withAlpha(palette.accent, 0.92)} 0%, ${withAlpha(palette.secondary, 0.92)} 100%)`,
          } as React.CSSProperties,
          text: 'text-white'
        };
      case 'center':
      case 'fact':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16`,
          text: isDarkBg ? 'text-white' : 'text-slate-900'
        };
      case 'quote':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16`,
          containerStyle: {
            backgroundColor: withAlpha(palette.secondary, 0.08),
          } as React.CSSProperties,
          text: isDarkBg ? 'text-white italic' : 'text-slate-800 italic'
        };
      case 'two-cols':
      case 'image-right':
      case 'image-left':
        return {
          container: `${baseClasses} p-8 md:p-12`,
          text: isDarkBg ? 'text-white' : 'text-slate-900'
        };
      default:
        return {
          container: `${baseClasses} flex flex-col justify-center p-8 md:p-12 lg:p-16`,
          text: isDarkBg ? 'text-white' : 'text-slate-900'
        };
    }
  };

  const styles = getLayoutStyles();

  if (slide.isTwoColumn) {
    return (
      <div className={styles.container} style={styles.containerStyle}>
        <div className="grid grid-cols-2 gap-8 md:gap-12 w-full h-full items-center">
          <div className={styles.text}>
            <RenderContent content={slide.leftContent || ''} textColor={styles.text} palette={palette} />
          </div>
          <div className={styles.text}>
            <RenderContent content={slide.rightContent || ''} textColor={styles.text} palette={palette} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} style={styles.containerStyle}>
      <div className={`${styles.text} w-full`}>
        {slide.parsedElements ? (
          <RenderParsedElements elements={slide.parsedElements} textColor={styles.text} palette={palette} />
        ) : (
          <RenderContent content={slide.content} textColor={styles.text} palette={palette} />
        )}
      </div>
    </div>
  );
}

interface RenderContentProps {
  content: string;
  textColor: string;
  palette: ColorPalette;
}

function RenderContent({ content, textColor, palette }: RenderContentProps) {
  const elements = parseInlineContent(content);
  
  return (
    <div className="space-y-6">
      {elements.map((element, idx) => (
        <RenderElement key={idx} element={element} textColor={textColor} palette={palette} />
      ))}
    </div>
  );
}

function parseInlineContent(content: string): ContentElement[] {
  const elements: ContentElement[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // Code blocks
    if (line.startsWith('```')) {
      const language = line.substring(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      const codeContent = codeLines.join('\n');
      
      if (language === 'mermaid') {
        elements.push({ type: 'mermaid', content: codeContent });
      } else {
        elements.push({ type: 'code', language, content: codeContent });
      }
      i++;
      continue;
    }

    // Mermaid blocks without fences (e.g. if code fences were stripped upstream)
    if (
      /^(%%\{init:|flowchart\b|graph\b|sequenceDiagram\b|classDiagram\b|stateDiagram\b|erDiagram\b|journey\b|gantt\b|pie\b|mindmap\b|timeline\b)/.test(line)
    ) {
      const mermaidLines: string[] = [lines[i].trimEnd()];
      i++;

      while (i < lines.length) {
        const nextLine = lines[i];
        const trimmed = nextLine.trim();

        if (!trimmed) break;
        if (trimmed.startsWith('```')) break;

        mermaidLines.push(nextLine.trimEnd());
        i++;
      }

      elements.push({ type: 'mermaid', content: mermaidLines.join('\n') });
      continue;
    }

    // HTML lists (<ul>/<ol>/<li>)
    const htmlLower = line.toLowerCase();

    if (htmlLower.startsWith('<ul') || htmlLower.startsWith('<ol')) {
      const ordered = htmlLower.startsWith('<ol');
      const closingTag = ordered ? '</ol>' : '</ul>';
      const start = i;

      const listLines: string[] = [];
      while (i < lines.length) {
        listLines.push(lines[i]);
        if (lines[i].toLowerCase().includes(closingTag)) {
          i++;
          break;
        }
        i++;
      }

      const block = listLines.join('\n');
      const items = Array.from(block.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
        .map((m) => m[1].replace(/\n+/g, ' ').trim())
        .filter(Boolean);

      if (items.length) {
        elements.push({ type: 'list', items, ordered });
        continue;
      }

      i = start;
    }

    if (htmlLower.startsWith('<li')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().toLowerCase().startsWith('<li')) {
        const li = lines[i].trim();
        const match = li.match(/^<li\b[^>]*>([\s\S]*?)<\/li>\s*$/i);
        items.push((match?.[1] ?? li).replace(/\n+/g, ' ').trim());
        i++;
      }

      if (items.length) {
        elements.push({ type: 'list', items, ordered: false });
        continue;
      }
    }

    // HTML image (<img ...>)
    if (htmlLower.startsWith('<img')) {
      const src = line.match(/src\s*=\s*['"]([^'"]+)['"]/i)?.[1];
      const alt = line.match(/alt\s*=\s*['"]([^'"]*)['"]/i)?.[1];
      if (src) {
        elements.push({ type: 'image', src, alt });
        i++;
        continue;
      }
    }

    // Headings
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const content = line.replace(/^#+\s*/, '');
      elements.push({ type: 'heading', level, content });
      i++;
      continue;
    }

    // Lists
    const unorderedListRegex = /^([-*+•]|[–—])\s+/;
    const orderedListRegex = /^\d+\.\s+/;

    if (unorderedListRegex.test(line) || orderedListRegex.test(line)) {
      const ordered = orderedListRegex.test(line);
      const items: string[] = [];

      while (i < lines.length) {
        const t = lines[i].trim();
        if (ordered) {
          if (!orderedListRegex.test(t)) break;
          items.push(t.replace(orderedListRegex, '').trim());
          i++;
          continue;
        }

        if (!unorderedListRegex.test(t)) break;
        items.push(t.replace(unorderedListRegex, '').trim());
        i++;
      }

      elements.push({ type: 'list', items, ordered });
      continue;
    }

    // Images
    if (line.match(/^!\[.*?\]\(.*?\)/)) {
      const match = line.match(/^!\[(.*?)\]\((.*?)\)/);
      if (match) {
        elements.push({ type: 'image', alt: match[1], src: match[2] });
      }
      i++;
      continue;
    }

    // Blockquotes
    if (line.startsWith('>')) {
      const content = line.replace(/^>\s*/, '');
      elements.push({ type: 'blockquote', content });
      i++;
      continue;
    }

    // Regular paragraph
    elements.push({ type: 'paragraph', content: line });
    i++;
  }

  return elements;
}

interface RenderParsedElementsProps {
  elements: ContentElement[];
  textColor: string;
  palette: ColorPalette;
}

function RenderParsedElements({ elements, textColor, palette }: RenderParsedElementsProps) {
  return (
    <div className="space-y-6">
      {elements.map((element, idx) => (
        <RenderElement key={idx} element={element} textColor={textColor} palette={palette} />
      ))}
    </div>
  );
}

interface RenderElementProps {
  element: ContentElement;
  textColor: string;
  palette: ColorPalette;
}

function RenderElement({ element, textColor, palette }: RenderElementProps) {
  switch (element.type) {
    case 'heading': {
      const level = Math.min(6, Math.max(1, element.level ?? 1));
      const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
      const HeadingTag = headingTags[level - 1];
      const headingSizes = [
        'text-6xl md:text-7xl',
        'text-4xl md:text-5xl',
        'text-3xl md:text-4xl',
        'text-2xl md:text-3xl',
        'text-xl md:text-2xl',
        'text-lg md:text-xl',
      ];

      const headingUsesLightText = textColor.includes('text-white');

      return (
        <HeadingTag
          className={`font-bold mb-4 leading-tight ${headingSizes[level - 1]} ${textColor}`}
          style={!headingUsesLightText ? { color: palette.primary } : undefined}
        >
          {processInlineFormatting(element.content || '', palette)}
        </HeadingTag>
      );
    }

    case 'paragraph':
      return (
        <p className={`text-xl md:text-2xl leading-relaxed ${textColor}`}>
          {processInlineFormatting(element.content || '', palette)}
        </p>
      );

    case 'list': {
      if (element.ordered) {
        return (
          <ol className={`space-y-3 list-decimal ml-8 ${textColor}`}>
            {element.items?.map((item, idx) => (
              <li key={idx} className="text-xl md:text-2xl leading-relaxed">
                {processInlineFormatting(item, palette)}
              </li>
            ))}
          </ol>
        );
      }

      return (
        <ul className={`space-y-3 ${textColor}`}>
          {element.items?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-4 text-xl md:text-2xl">
              <span style={{ color: palette.accent }} className="text-2xl mt-1 flex-shrink-0">
                ▸
              </span>
              <span className="flex-1">{processInlineFormatting(item, palette)}</span>
            </li>
          ))}
        </ul>
      );
    }

    case 'code':
      return (
        <div className="my-6 rounded-xl overflow-hidden shadow-lg">
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={element.language || 'text'}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: '0.75rem',
              fontSize: '1rem',
              padding: '1.5rem'
            }}
          >
            {element.content || ''}
          </SyntaxHighlighter>
        </div>
      );

    case 'mermaid':
      return (
        <div className="my-8 flex items-center justify-center">
          <div 
            className="mermaid-diagram p-6 rounded-xl shadow-lg" 
            style={{ backgroundColor: withAlpha(palette.background, 0.92) }}
            data-mermaid-code={element.content}
          />
        </div>
      );

    case 'image':
      return (
        <div className="my-8 flex items-center justify-center">
          <img 
            src={element.src} 
            alt={element.alt || ''} 
            className="max-w-full max-h-96 object-contain rounded-xl shadow-lg"
          />
        </div>
      );

    case 'math':
      try {
        const html = katex.renderToString(element.content || '', {
          displayMode: true,
          throwOnError: false
        });
        return (
          <div 
            className="my-6 text-center text-2xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <div className="text-red-500">Math rendering error</div>;
      }

    case 'blockquote':
      return (
        <blockquote
          className={`border-l-4 pl-6 py-3 text-2xl italic ${textColor} opacity-90`}
          style={{ borderColor: palette.accent }}
        >
          {processInlineFormatting(element.content || '', palette)}
        </blockquote>
      );

    case 'divider':
      return <hr className="my-8 border-t-2" style={{ borderColor: withAlpha(palette.secondary, 0.35) }} />;

    default:
      return null;
  }
}

function processInlineFormatting(text: string, palette?: ColorPalette): React.ReactNode {
  const active = palette ?? DEFAULT_PALETTE;
  let key = 0;

  const sanitizeColor = (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    const v = value.trim();

    if (/^#[0-9a-f]{3,8}$/i.test(v)) return v;
    if (/^(rgb|rgba|hsl|hsla)\(/i.test(v)) return v;
    if (/^[a-z]{1,20}$/i.test(v)) return v;

    return undefined;
  };

  const stripTags = (str: string) => str.replace(/<\/?[^>]+>/g, '');

  const renderInlineCode = (str: string): React.ReactNode[] => {
    const codeRegex = /`([^`]+)`/g;
    const out: React.ReactNode[] = [];

    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = codeRegex.exec(str)) !== null) {
      if (match.index > last) out.push(str.slice(last, match.index));

      out.push(
        <code
          key={`code-${key++}`}
          className="px-2 py-1 rounded text-sm font-mono"
          style={{ backgroundColor: withAlpha(active.primary, 0.14) }}
        >
          {match[1]}
        </code>
      );

      last = codeRegex.lastIndex;
    }

    if (last < str.length) out.push(str.slice(last));
    return out;
  };

  const renderMarkdown = (str: string): React.ReactNode[] => {
    const normalized = stripTags(str).replace(/\s+/g, ' ');
    const boldRegex = /(\*\*|__)(.*?)\1/g;

    const out: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = boldRegex.exec(normalized)) !== null) {
      if (match.index > lastIndex) {
        out.push(...renderInlineCode(normalized.slice(lastIndex, match.index)));
      }

      out.push(
        <strong key={`bold-${key++}`} className="font-bold">
          {renderInlineCode(match[2])}
        </strong>
      );

      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < normalized.length) {
      out.push(...renderInlineCode(normalized.slice(lastIndex)));
    }

    return out;
  };

  const parseInline = (input: string): React.ReactNode[] => {
    const out: React.ReactNode[] = [];
    let rest = input;

    const spanRegex = /<span\b[^>]*>/i;
    const brRegex = /<br\s*\/?\s*>/i;

    while (rest.length) {
      const nextSpan = rest.search(spanRegex);
      const nextBr = rest.search(brRegex);

      const candidates = [nextSpan, nextBr].filter((i) => i >= 0);
      const next = candidates.length ? Math.min(...candidates) : -1;

      if (next === -1) {
        out.push(...renderMarkdown(rest));
        break;
      }

      if (next > 0) {
        out.push(...renderMarkdown(rest.slice(0, next)));
        rest = rest.slice(next);
        continue;
      }

      if (nextBr === 0) {
        out.push(<br key={`br-${key++}`} />);
        rest = rest.replace(brRegex, '');
        continue;
      }

      const openMatch = rest.match(/^<span\b([^>]*)>/i);
      if (!openMatch) {
        out.push(...renderMarkdown(rest[0]));
        rest = rest.slice(1);
        continue;
      }

      const attrs = openMatch[1] || '';
      const openLen = openMatch[0].length;
      const closeIdx = rest.toLowerCase().indexOf('</span>', openLen);

      if (closeIdx === -1) {
        out.push(...renderMarkdown(rest.slice(openLen)));
        break;
      }

      const inner = rest.slice(openLen, closeIdx);
      rest = rest.slice(closeIdx + '</span>'.length);

      const styleMatch = attrs.match(/style\s*=\s*['"]([^'"]*)['"]/i);
      const style = styleMatch?.[1] ?? '';
      const colorMatch = style.match(/color\s*:\s*([^;]+)/i);
      const color = sanitizeColor(colorMatch?.[1]);

      out.push(
        <span key={`span-${key++}`} style={color ? { color } : undefined}>
          {parseInline(inner)}
        </span>
      );
    }

    return out;
  };

  const cleaned = text
    .replace(/&nbsp;/g, ' ')
    .replace(/\s*v-click(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
    .replace(/\s*v-after(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
    .replace(/\s*v-motion(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '');

  const nodes = parseInline(cleaned);
  return nodes.length ? <>{nodes}</> : cleaned;
}
