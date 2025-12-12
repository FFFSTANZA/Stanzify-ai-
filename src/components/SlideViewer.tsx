import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, Home } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import mermaid from "mermaid";
import "katex/dist/katex.min.css";

interface SlideViewerProps {
  markdown: string;
  onNewPresentation?: () => void;
}

interface Slide {
  content: string;
  layout: string;
  background?: string;
  image?: string;
}

export function SlideViewer({ markdown, onNewPresentation }: SlideViewerProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    const parsedSlides = parseSlidevMarkdown(markdown);
    setSlides(parsedSlides);
    setCurrentSlide(0);
  }, [markdown]);

  useEffect(() => {
    if (mermaidRef.current) {
      const mermaidElements = mermaidRef.current.querySelectorAll('.mermaid-diagram');
      mermaidElements.forEach((element, index) => {
        const code = element.textContent || '';
        if (code.trim()) {
          mermaid.render(`mermaid-${Date.now()}-${index}`, code).then(({ svg }) => {
            element.innerHTML = svg;
          }).catch((error) => {
            console.error('Mermaid rendering error:', error);
            element.innerHTML = `<pre>${code}</pre>`;
          });
        }
      });
    }
  }, [currentSlide, slides]);

  function parseSlidevMarkdown(markdown: string): Slide[] {
    const slides: Slide[] = [];
    const slideBlocks = markdown.split(/\n---\n/);

    slideBlocks.forEach((block) => {
      if (!block.trim()) return;

      const lines = block.split('\n');
      let layout = 'default';
      let background = '';
      let image = '';
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
        }
      }

      const content = lines.slice(contentStart).join('\n').trim();
      
      // Handle ::right:: syntax for two-column layouts
      if (content.includes('::right::')) {
        const parts = content.split('::right::');
        const leftContent = parts[0].trim();
        const rightContent = parts[1]?.trim() || '';
        
        slides.push({
          content: `<div class="grid grid-cols-2 gap-12 h-full items-center"><div class="prose prose-lg dark:prose-invert max-w-none">\n\n${leftContent}\n\n</div><div class="prose prose-lg dark:prose-invert max-w-none">\n\n${rightContent}\n\n</div></div>`,
          layout,
          background,
          image,
        });
      } else {
        slides.push({
          content,
          layout,
          background,
          image,
        });
      }
    });

    return slides;
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevSlide();
    if (e.key === "ArrowRight") handleNextSlide();
    if (e.key === "Escape") setIsFullscreen(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [slides.length]);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "presentation.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No slides to display</p>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];
  const layoutClass = `slidev-layout-${currentSlideData.layout}`;

  return (
    <div
      className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950" : "h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"}`}
    >
      {/* Top Controls Bar */}
      <div className="border-b border-border/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">{currentSlide + 1}</span>
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Slide {currentSlide + 1} of {slides.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Layout: {currentSlideData.layout}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={onNewPresentation} 
              variant="ghost" 
              size="sm"
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden xl:inline">New</span>
            </Button>
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xl:inline">Download</span>
            </Button>
            <Button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden xl:inline">Exit</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden xl:inline">Fullscreen</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Display Area */}
      <div className="flex-1 flex items-center justify-center p-6 xl:p-12 overflow-hidden">
        <div className="w-full max-w-7xl">
          {/* Slide Container */}
          <div 
            ref={mermaidRef}
            className={`w-full aspect-video bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-12 xl:p-20 overflow-auto border border-border/50 flex flex-col justify-center ${layoutClass} transition-smooth hover:shadow-elegant`}
            style={{
              backgroundImage: currentSlideData.background ? `url(${currentSlideData.background})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className={`${currentSlideData.background ? 'bg-white/95 dark:bg-slate-900/95 p-10 rounded-2xl backdrop-blur-sm' : ''} prose prose-lg dark:prose-invert max-w-none`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    
                    // Handle Mermaid diagrams
                    if (match && match[1] === 'mermaid') {
                      return (
                        <div className="mermaid-diagram my-8 flex items-center justify-center">
                          {codeString}
                        </div>
                      );
                    }
                    
                    // Handle code blocks
                    if (!inline && match) {
                      return (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl my-6 shadow-md"
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      );
                    }
                    
                    // Inline code
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {currentSlideData.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="border-t border-border/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <Button
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              size="lg"
              className="gap-2 min-w-[120px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Slide Dots Navigation */}
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-smooth rounded-full ${
                    index === currentSlide
                      ? "w-8 h-2 bg-gradient-to-r from-blue-600 to-purple-600"
                      : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <Button
              onClick={handleNextSlide}
              disabled={currentSlide === slides.length - 1}
              variant="outline"
              size="lg"
              className="gap-2 min-w-[120px]"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="text-center mt-3">
            <p className="text-xs text-muted-foreground">
              Use <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd> and <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> to navigate • <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to exit fullscreen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
