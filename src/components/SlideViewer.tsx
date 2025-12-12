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
  Settings,
  FileText,
  Image,
  Presentation,
  Maximize
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
import { exportSlidevPresentation, analyzeSlidevPresentation } from "@/services/slidevService";
import { toast } from "sonner";

interface SlideViewerProps {
  markdown: string;
  onNewPresentation?: () => void;
  title?: string;
}

interface Slide {
  content: string;
  layout: string;
  background?: string;
  image?: string;
  notes?: string;
  clicks?: string[];
}

interface SlideStats {
  slideCount: number;
  layoutCount: number;
  mermaidDiagrams: number;
  codeBlocks: number;
  images: number;
}

export function SlideViewer({ markdown, onNewPresentation, title = "Stanzify Presentation" }: SlideViewerProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresenter, setIsPresenter] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [presentationStats, setPresentationStats] = useState<SlideStats | null>(null);
  const [qualityAnalysis, setQualityAnalysis] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const mermaidRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Mermaid with enhanced configuration
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

  // Parse slidev markdown with enhanced parsing
  useEffect(() => {
    const parsedSlides = parseAdvancedSlidevMarkdown(markdown);
    setSlides(parsedSlides);
    setCurrentSlide(0);
    
    // Calculate presentation statistics
    const stats = calculateSlideStats(markdown);
    setPresentationStats(stats);
    
    // Analyze presentation quality
    analyzePresentationQuality();
  }, [markdown]);

  // Handle Mermaid diagram rendering
  useEffect(() => {
    if (mermaidRef.current && slides.length > 0) {
      renderMermaidDiagrams();
    }
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
      }, 5000); // 5 seconds per slide
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
          setIsPresenter(false);
          break;
        case "f":
        case "F11":
          setIsFullscreen(!isFullscreen);
          break;
        case "p":
          setIsPresenter(!isPresenter);
          break;
        case "n":
          setShowNotes(!showNotes);
          break;
        case "s":
          setIsAutoPlay(!isAutoPlay);
          break;
        case "r":
          analyzePresentationQuality();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, isPresenter, showNotes, isAutoPlay, slides.length]);

  function parseAdvancedSlidevMarkdown(markdown: string): Slide[] {
    const slides: Slide[] = [];
    const slideBlocks = markdown.split(/\n---\n/);

    slideBlocks.forEach((block) => {
      if (!block.trim()) return;

      const lines = block.split('\n');
      let layout = 'default';
      let background = '';
      let image = '';
      let notes = '';
      let clicks: string[] = [];
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
          if (line.startsWith('layout:')) {
            layout = line.replace('layout:', '').trim();
          }
          if (line.startsWith('background:')) {
            background = line.replace('background:', '').trim();
          }
          if (line.startsWith('image:')) {
            image = line.replace('image:', '').trim();
          }
          if (line.startsWith('backgroundImage:')) {
            background = line.replace('backgroundImage:', '').trim();
          }
        }
      }

      // Parse content for clicks and special directives
      const content = lines.slice(contentStart).join('\n').trim();
      const processedContent = processSlidevDirectives(content, clicks);
      
      // Handle speaker notes (if present)
      if (content.includes(':::notes')) {
        const notesMatch = content.match(/:::notes\s*([\s\S]*?):::/);
        if (notesMatch) {
          notes = notesMatch[1].trim();
        }
      }

      // Handle two-column layouts
      if (processedContent.includes('::right::')) {
        const parts = processedContent.split('::right::');
        const leftContent = parts[0].trim();
        const rightContent = parts[1]?.trim() || '';
        
        slides.push({
          content: `<div class="grid grid-cols-2 gap-12 h-full items-center">
            <div class="prose prose-lg dark:prose-invert max-w-none">
              ${processMarkdownContent(leftContent)}
            </div>
            <div class="prose prose-lg dark:prose-invert max-w-none">
              ${processMarkdownContent(rightContent)}
            </div>
          </div>`,
          layout,
          background,
          image,
          notes,
          clicks
        });
      } else {
        slides.push({
          content: `<div class="prose prose-lg dark:prose-invert max-w-none">
            ${processMarkdownContent(processedContent)}
          </div>`,
          layout,
          background,
          image,
          notes,
          clicks
        });
      }
    });

    return slides;
  }

  function processSlidevDirectives(content: string, _clicks: string[]): string {
    // Process v-click directives
    let processed = content.replace(/v-click(?:-(\d+))?/g, (_match, num) => {
      return `<span v-click${num ? `="${num}"` : ''}>`;
    });
    
    // Process v-after directives
    processed = processed.replace(/v-after(?:-(\d+))?/g, (_match, num) => {
      return `<span v-after${num ? `="${num}"` : ''}>`;
    });
    
    return processed;
  }

  function processMarkdownContent(content: string): string {
    // Process special slidev syntax
    return content
      // Handle clickable elements
      .replace(/v-click/g, 'data-v-click')
      // Handle math equations
      .replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">$$$1$$</div>')
      .replace(/\$([^$\n]+)\$/g, '<span class="math-inline">$1</span>')
      // Handle code blocks with language
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
        return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
      });
  }

  function renderMermaidDiagrams() {
    if (!mermaidRef.current) return;
    
    const mermaidElements = mermaidRef.current.querySelectorAll('.mermaid-diagram');
    mermaidElements.forEach((element, index) => {
      const code = element.textContent || '';
      if (code.trim() && !element.innerHTML.includes('<svg')) {
        try {
          const id = `mermaid-${Date.now()}-${index}`;
          mermaid.render(id, code).then(({ svg }) => {
            element.innerHTML = svg;
          }).catch((error) => {
            console.error('Mermaid rendering error:', error);
            element.innerHTML = `<div class="error-boundary p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p class="text-red-600 dark:text-red-400">Failed to render diagram</p>
              <pre class="text-xs mt-2">${code}</pre>
            </div>`;
          });
        } catch (error) {
          console.error('Mermaid element error:', error);
        }
      }
    });
  }

  function calculateSlideStats(markdown: string): SlideStats {
    const slides = markdown.split(/\n---\n/).filter(slide => slide.trim());
    const layouts = new Set<string>();
    const mermaidCount = (markdown.match(/```mermaid/g) || []).length;
    const codeCount = (markdown.match(/```/g) || []).length / 2;
    const imageCount = (markdown.match(/!\[.*?\]\(.*?\)/g) || []).length;

    slides.forEach(slide => {
      const layoutMatch = slide.match(/layout:\s*(\w+)/);
      if (layoutMatch) {
        layouts.add(layoutMatch[1]);
      }
    });

    return {
      slideCount: slides.length,
      layoutCount: layouts.size,
      mermaidDiagrams: mermaidCount,
      codeBlocks: codeCount,
      images: imageCount
    };
  }

  const analyzePresentationQuality = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeSlidevPresentation(markdown);
      setQualityAnalysis(analysis);
      toast.success(`Presentation analyzed: ${analysis.score}/100`);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Failed to analyze presentation");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
  };

  const handleDownload = async () => {
    try {
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Slidev markdown downloaded!");
    } catch (error) {
      toast.error("Failed to download presentation");
    }
  };

  const handleExport = async (format: 'pdf' | 'png' | 'html') => {
    setIsExporting(true);
    try {
      const result = await exportSlidevPresentation(markdown, format);
      if (result.success) {
        toast.success(`Presentation exported to ${format.toUpperCase()}`);
      } else {
        toast.error(`Export failed: ${result.error}`);
      }
    } catch (error) {
      toast.error("Export failed");
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
          <Button onClick={onNewPresentation} variant="outline">
            Create New Presentation
          </Button>
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
      {/* Enhanced Top Controls Bar */}
      <div className="border-b border-border/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Presentation Info */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Presentation className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Slide {currentSlide + 1} of {slides.length} • {currentSlideData.layout}
                  </p>
                </div>
              </div>
              
              {/* Presentation Stats */}
              {presentationStats && (
                <div className="hidden lg:flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {presentationStats.slideCount} slides
                  </span>
                  <span className="flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    {presentationStats.layoutCount} layouts
                  </span>
                  {presentationStats.mermaidDiagrams > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-purple-500 rounded"></span>
                      {presentationStats.mermaidDiagrams} diagrams
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: Control Buttons */}
            <div className="flex items-center gap-2">
              {/* Analysis Button */}
              <Button
                onClick={analyzePresentationQuality}
                disabled={isAnalyzing}
                variant="ghost"
                size="sm"
                className="gap-2"
                title="Analyze presentation quality (R)"
              >
                <Settings className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span className="hidden xl:inline">Analyze</span>
              </Button>

              {/* Export Buttons */}
              <div className="hidden md:flex gap-1">
                <Button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  variant="ghost"
                  size="sm"
                  title="Export to PDF"
                >
                  PDF
                </Button>
                <Button
                  onClick={() => handleExport('png')}
                  disabled={isExporting}
                  variant="ghost"
                  size="sm"
                  title="Export to PNG"
                >
                  PNG
                </Button>
              </div>

              {/* View Controls */}
              <Button
                onClick={() => setIsPresenter(!isPresenter)}
                variant={isPresenter ? "default" : "ghost"}
                size="sm"
                title="Presenter mode (P)"
              >
                <Maximize className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                variant={isAutoPlay ? "default" : "ghost"}
                size="sm"
                title="Auto-play (S)"
              >
                {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                title="Download markdown"
              >
                <Download className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => setIsFullscreen(!isFullscreen)}
                variant="outline"
                size="sm"
                title="Fullscreen (F)"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>

              <Button
                onClick={onNewPresentation}
                variant="outline"
                size="sm"
                title="New presentation"
              >
                <Home className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Slide Display Area */}
      <div className="flex-1 flex items-center justify-center p-4 xl:p-8 overflow-hidden">
        <div className="w-full max-w-7xl">
          {/* Slide Container with Enhanced Styling */}
          <div 
            ref={slideContainerRef}
            className={`relative w-full aspect-video bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-border/30 transition-all duration-500 ${
              isPresenter ? 'aspect-[4/3]' : 'aspect-video'
            }`}
            style={{
              backgroundImage: currentSlideData.background ? `url(${currentSlideData.background})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Background Overlay */}
            {currentSlideData.background && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/95" />
            )}

            {/* Slide Content */}
            <div 
              ref={mermaidRef}
              className="relative z-10 h-full p-8 xl:p-16 flex flex-col justify-center"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    
                    // Handle Mermaid diagrams with proper spacing and scaling
                    if (match && match[1] === 'mermaid') {
                      return (
                        <div className="mermaid-diagram my-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg overflow-x-auto max-w-full">
                          <div className="w-full min-w-max flex justify-center">
                            {codeString}
                          </div>
                        </div>
                      );
                    }
                    
                    // Handle regular code blocks with syntax highlighting
                    if (!inline && match) {
                      return (
                        <div className="my-6 rounded-xl overflow-hidden shadow-lg border border-border/20">
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              fontSize: '13px',
                              lineHeight: '1.5',
                              margin: 0,
                              padding: '16px'
                            }}
                            showLineNumbers={true}
                            wrapLines={true}
                            {...props}
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }
                    
                    // Inline code
                    return (
                      <code 
                        className="bg-muted px-2 py-1 rounded text-sm font-mono" 
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="text-4xl xl:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl xl:text-4xl font-semibold mb-4 text-slate-800 dark:text-slate-200 leading-tight">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl xl:text-3xl font-medium mb-3 text-slate-700 dark:text-slate-300">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-lg xl:text-xl leading-relaxed mb-4 text-slate-600 dark:text-slate-400">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-3 mb-6">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3 flex-shrink-0" />
                      <span className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        {children}
                      </span>
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl italic text-xl">
                      {children}
                    </blockquote>
                  ),
                  img: ({ src, alt, ...props }: any) => (
                    <img 
                      src={src} 
                      alt={alt || 'slide image'} 
                      className="max-w-full h-auto rounded-xl shadow-lg my-6 object-cover"
                      {...props}
                    />
                  ),
                }}
              >
                {currentSlideData.content}
              </ReactMarkdown>
            </div>

            {/* Slide Number Badge */}
            <div className="absolute top-6 right-6 bg-black/20 dark:bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-semibold">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>

          {/* Speaker Notes */}
          {showNotes && currentSlideData.notes && (
            <div className="mt-6 p-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-border/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Speaker Notes
              </h3>
              <div className="prose prose-sm dark:prose-invert">
                {currentSlideData.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Bottom Navigation Bar */}
      <div className="border-t border-border/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <Button
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              size="lg"
              className="gap-2 min-w-[140px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Enhanced Slide Dots Navigation */}
            <div className="flex items-center gap-3 px-6 py-3 bg-muted/50 rounded-full">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? "w-10 h-3 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                      : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/60 hover:scale-110"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  title={`Slide ${index + 1}: ${slides[index].layout}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              onClick={handleNextSlide}
              disabled={currentSlide === slides.length - 1}
              variant="outline"
              size="lg"
              className="gap-2 min-w-[140px]"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Enhanced Keyboard Shortcuts */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">←→</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">F</kbd>
                <span>Fullscreen</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">P</kbd>
                <span>Presenter</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">S</kbd>
                <span>Auto-play</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">R</kbd>
                <span>Analyze</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Analysis Modal */}
      {qualityAnalysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Presentation Analysis</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setQualityAnalysis(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {qualityAnalysis.score}
                </div>
                <div className="text-muted-foreground">Overall Quality Score</div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl text-center">
                  <div className="text-2xl font-bold">{qualityAnalysis.layoutDiversity}</div>
                  <div className="text-sm text-muted-foreground">Layout Diversity</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl text-center">
                  <div className="text-2xl font-bold">{qualityAnalysis.visualImpact}</div>
                  <div className="text-sm text-muted-foreground">Visual Impact</div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">Strengths</h4>
                <ul className="space-y-2">
                  {qualityAnalysis.strengths?.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Suggestions</h4>
                <ul className="space-y-2">
                  {qualityAnalysis.suggestions?.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">💡</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}