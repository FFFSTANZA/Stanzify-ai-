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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import mermaid from "mermaid";
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
}

export function SlideViewer({ markdown, onNewPresentation, title = "Stanzify Presentation" }: SlideViewerProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const mermaidRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#1e40af',
        primaryBorderColor: '#60a5fa',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#ffffff',
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondBkg: '#f9fafb',
        tertiaryBkg: '#f3f4f6'
      }
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
    }, 100);
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
    const slideBlocks = markdown.split(/\n---\n/);

    slideBlocks.forEach((block) => {
      if (!block.trim()) return;

      const lines = block.split('\n');
      const frontmatter: Record<string, string> = {};
      let contentStart = 0;

      // Parse frontmatter
      if (lines[0]?.trim() === '---') {
        contentStart = 1;
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line === '---') {
            contentStart = i + 1;
            break;
          }
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            frontmatter[key] = value;
          }
        }
      }

      // Get content
      let content = lines.slice(contentStart).join('\n').trim();
      
      // Remove ::notes:: blocks
      content = content.replace(/:::notes[\s\S]*?:::/g, '').trim();
      
      // Check for two-column layout
      const isTwoColumn = content.includes('::left::') && content.includes('::right::');
      let leftContent = '';
      let rightContent = '';

      if (isTwoColumn) {
        // Split by ::right::
        const parts = content.split('::right::');
        if (parts.length >= 2) {
          // Get left content (remove ::left:: marker)
          leftContent = parts[0].replace('::left::', '').trim();
          rightContent = parts[1].trim();
        }
      }

      slides.push({
        frontmatter,
        content: isTwoColumn ? '' : content,
        layout: frontmatter.layout || 'default',
        background: frontmatter.background,
        backgroundImage: frontmatter.backgroundImage,
        image: frontmatter.image,
        transition: frontmatter.transition,
        isTwoColumn,
        leftContent,
        rightContent
      });
    });

    return slides;
  }

  function renderMermaidDiagrams() {
    if (!slideContainerRef.current) return;
    
    const mermaidElements = slideContainerRef.current.querySelectorAll('.mermaid-code');
    mermaidElements.forEach((element, index) => {
      const code = element.textContent || '';
      if (code.trim() && !element.querySelector('svg')) {
        try {
          const id = `mermaid-${currentSlide}-${index}-${Date.now()}`;
          mermaid.render(id, code).then(({ svg }) => {
            element.innerHTML = svg;
          }).catch((error) => {
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
          className="w-full max-w-6xl aspect-[16/9] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden relative"
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
            <div className="flex gap-1.5 items-center">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
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
  // Determine layout class
  const getLayoutClass = () => {
    switch (slide.layout) {
      case 'cover':
      case 'intro':
        return 'flex flex-col items-center justify-center text-center h-full p-16 bg-gradient-to-br from-blue-600/90 to-purple-600/90 text-white';
      case 'section':
        return 'flex flex-col items-center justify-center text-center h-full p-16 bg-gradient-to-r from-slate-800/90 to-slate-900/90 text-white';
      case 'end':
        return 'flex flex-col items-center justify-center text-center h-full p-16 bg-gradient-to-br from-purple-600/90 to-pink-600/90 text-white';
      case 'center':
      case 'fact':
        return 'flex flex-col items-center justify-center text-center h-full p-16';
      case 'quote':
        return 'flex flex-col items-center justify-center text-center h-full p-16 italic';
      case 'two-cols':
      case 'image-right':
      case 'image-left':
        return 'h-full p-12';
      default:
        return 'flex flex-col justify-center h-full p-12';
    }
  };

  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 leading-tight">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-xl md:text-2xl mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-3 text-xl md:text-2xl list-none">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-3 text-xl md:text-2xl list-decimal list-inside">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-1.5">▸</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-6 py-2 text-2xl italic text-slate-600 dark:text-slate-300">
              {children}
            </blockquote>
          ),
          code({ className, children }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            // Check if it's a mermaid diagram
            if (language === 'mermaid') {
              return (
                <div className="my-8 mermaid-code bg-white dark:bg-slate-800 p-6 rounded-lg">
                  {String(children).replace(/\n$/, '')}
                </div>
              );
            }
            
            // Regular code block
            if (language) {
              return (
                <div className="my-6 rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    className="text-sm md:text-base"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }
            
            // Inline code
            return (
              <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt || ''} 
              className="max-w-full h-auto rounded-lg shadow-lg my-6"
            />
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-blue-600 dark:text-blue-400">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-purple-600 dark:text-purple-400">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  if (slide.isTwoColumn) {
    return (
      <div className={getLayoutClass()}>
        <div className="grid grid-cols-2 gap-12 w-full h-full items-center">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {renderMarkdown(slide.leftContent || '')}
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {renderMarkdown(slide.rightContent || '')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={getLayoutClass()}>
      <div className="prose prose-lg dark:prose-invert max-w-none w-full">
        {renderMarkdown(slide.content)}
      </div>
    </div>
  );
}
