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

interface SlideViewerProps {
  markdown: string;
  onNewPresentation?: () => void;
  title?: string;
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

export function SlideViewer({ markdown, onNewPresentation, title = "Stanzify Presentation" }: SlideViewerProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Mermaid
  useEffect(() => {
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
        primaryColor: '#dbeafe',
        primaryTextColor: '#0f172a',
        primaryBorderColor: '#3b82f6',
        lineColor: '#475569',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#ffffff',
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondBkg: '#f8fafc',
        tertiaryBkg: '#f1f5f9',
        fontSize: '18px',
      },
    });
  }, []);

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

          if (/^(#|```|::left::|::right::|!\[|>|\$\$|[-*+]\s|\d+\.\s)/.test(t)) {
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

      // Headings
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const content = line.replace(/^#+\s*/, '');
        elements.push({ type: 'heading', level, content });
        i++;
        continue;
      }

      // Lists
      if (line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
        const ordered = line.match(/^\d+\.\s/) !== null;
        const items: string[] = [];
        while (i < lines.length && (lines[i].trim().match(/^[-*+]\s/) || lines[i].trim().match(/^\d+\.\s/))) {
          const item = lines[i].trim().replace(/^[-*+]\s/, '').replace(/^\d+\.\s/, '');
          items.push(item);
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
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
            backgroundImage: currentSlideData.backgroundImage || currentSlideData.background 
              ? `url(${currentSlideData.backgroundImage || currentSlideData.background})` 
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <SlideContent slide={currentSlideData} />
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
                      ? 'bg-blue-600 w-8' 
                      : 'bg-slate-300 dark:bg-slate-600 w-2 hover:bg-slate-400'
                  }`}
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
}

function SlideContent({ slide }: SlideContentProps) {
  const getLayoutStyles = () => {
    const baseClasses = "h-full w-full";
    
    switch (slide.layout) {
      case 'cover':
      case 'intro':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16 lg:p-20 bg-gradient-to-br from-blue-600/95 to-purple-600/95`,
          text: 'text-white'
        };
      case 'section':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16 lg:p-20 bg-gradient-to-r from-slate-800/95 to-slate-900/95`,
          text: 'text-white'
        };
      case 'end':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16 lg:p-20 bg-gradient-to-br from-purple-600/95 to-pink-600/95`,
          text: 'text-white'
        };
      case 'center':
      case 'fact':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16`,
          text: 'text-slate-900 dark:text-white'
        };
      case 'quote':
        return {
          container: `${baseClasses} flex flex-col items-center justify-center text-center p-12 md:p-16 bg-gradient-to-br from-slate-100/95 to-slate-200/95`,
          text: 'text-slate-800 italic'
        };
      case 'two-cols':
      case 'image-right':
      case 'image-left':
        return {
          container: `${baseClasses} p-8 md:p-12`,
          text: 'text-slate-900 dark:text-white'
        };
      default:
        return {
          container: `${baseClasses} flex flex-col justify-center p-8 md:p-12 lg:p-16`,
          text: 'text-slate-900 dark:text-white'
        };
    }
  };

  const styles = getLayoutStyles();

  if (slide.isTwoColumn) {
    return (
      <div className={styles.container}>
        <div className="grid grid-cols-2 gap-8 md:gap-12 w-full h-full items-center">
          <div className={styles.text}>
            <RenderContent content={slide.leftContent || ''} textColor={styles.text} />
          </div>
          <div className={styles.text}>
            <RenderContent content={slide.rightContent || ''} textColor={styles.text} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.text} w-full`}>
        {slide.parsedElements ? (
          <RenderParsedElements elements={slide.parsedElements} textColor={styles.text} />
        ) : (
          <RenderContent content={slide.content} textColor={styles.text} />
        )}
      </div>
    </div>
  );
}

interface RenderContentProps {
  content: string;
  textColor: string;
}

function RenderContent({ content, textColor }: RenderContentProps) {
  const elements = parseInlineContent(content);
  
  return (
    <div className="space-y-6">
      {elements.map((element, idx) => (
        <RenderElement key={idx} element={element} textColor={textColor} />
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

    // Headings
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 1;
      const content = line.replace(/^#+\s*/, '');
      elements.push({ type: 'heading', level, content });
      i++;
      continue;
    }

    // Lists
    if (line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
      const ordered = line.match(/^\d+\.\s/) !== null;
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().match(/^[-*+]\s/) || lines[i].trim().match(/^\d+\.\s/))) {
        const item = lines[i].trim().replace(/^[-*+]\s/, '').replace(/^\d+\.\s/, '');
        items.push(item);
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
}

function RenderParsedElements({ elements, textColor }: RenderParsedElementsProps) {
  return (
    <div className="space-y-6">
      {elements.map((element, idx) => (
        <RenderElement key={idx} element={element} textColor={textColor} />
      ))}
    </div>
  );
}

interface RenderElementProps {
  element: ContentElement;
  textColor: string;
}

function RenderElement({ element, textColor }: RenderElementProps) {
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

      return (
        <HeadingTag className={`font-bold mb-4 leading-tight ${headingSizes[level - 1]} ${textColor}`}>
          {processInlineFormatting(element.content || '')}
        </HeadingTag>
      );
    }

    case 'paragraph':
      return (
        <p className={`text-xl md:text-2xl leading-relaxed ${textColor}`}>
          {processInlineFormatting(element.content || '')}
        </p>
      );

    case 'list':
      return (
        <ul className={`space-y-3 ${textColor}`}>
          {element.items?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-4 text-xl md:text-2xl">
              <span className="text-blue-500 text-2xl mt-1 flex-shrink-0">▸</span>
              <span className="flex-1">{processInlineFormatting(item)}</span>
            </li>
          ))}
        </ul>
      );

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
            className="mermaid-diagram bg-white/95 dark:bg-slate-800/95 p-6 rounded-xl shadow-lg" 
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
        <blockquote className={`border-l-4 border-blue-500 pl-6 py-3 text-2xl italic ${textColor} opacity-90`}>
          {processInlineFormatting(element.content || '')}
        </blockquote>
      );

    case 'divider':
      return <hr className="my-8 border-t-2 border-slate-300 dark:border-slate-600" />;

    default:
      return null;
  }
}

function processInlineFormatting(text: string): React.ReactNode {
  // Process inline formatting (bold, italic, inline code, links, etc.)
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let key = 0;

  // Remove v-click and other directives
  currentText = currentText.replace(/v-click[^>]*/g, '');
  currentText = currentText.replace(/<div[^>]*>/g, '').replace(/<\/div>/g, '');
  currentText = currentText.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '');

  // Process bold **text** or __text__
  const boldRegex = /(\*\*|__)(.*?)\1/g;
  let lastIndex = 0;
  let match;

  const processText = (str: string) => {
    // Process inline code `code`
    const codeRegex = /`([^`]+)`/g;
    const codeParts: React.ReactNode[] = [];
    let codeLastIndex = 0;
    let codeMatch;

    while ((codeMatch = codeRegex.exec(str)) !== null) {
      if (codeMatch.index > codeLastIndex) {
        codeParts.push(str.substring(codeLastIndex, codeMatch.index));
      }
      codeParts.push(
        <code key={`code-${key++}`} className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm font-mono">
          {codeMatch[1]}
        </code>
      );
      codeLastIndex = codeRegex.lastIndex;
    }

    if (codeLastIndex < str.length) {
      codeParts.push(str.substring(codeLastIndex));
    }

    return codeParts.length > 0 ? codeParts : str;
  };

  while ((match = boldRegex.exec(currentText)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = currentText.substring(lastIndex, match.index);
      parts.push(...(Array.isArray(processText(textBefore)) ? processText(textBefore) : [processText(textBefore)]));
    }
    parts.push(
      <strong key={`bold-${key++}`} className="font-bold text-blue-600 dark:text-blue-400">
        {match[2]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < currentText.length) {
    const remaining = currentText.substring(lastIndex);
    parts.push(...(Array.isArray(processText(remaining)) ? processText(remaining) : [processText(remaining)]));
  }

  return parts.length > 0 ? <>{parts}</> : currentText;
}
