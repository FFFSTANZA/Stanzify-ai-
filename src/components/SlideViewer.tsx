import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from "lucide-react";
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
}

interface Slide {
  content: string;
  layout: string;
  background?: string;
  image?: string;
}

export function SlideViewer({ markdown }: SlideViewerProps) {
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
      className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900" : "h-full"}`}
    >
      {/* Controls */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            Slide {currentSlide + 1} / {slides.length}
          </span>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
            Layout: {currentSlideData.layout}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            variant="outline" 
            size="sm"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Slide Display */}
      <div className="flex-1 flex items-center justify-center p-4 xl:p-8 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <div 
          ref={mermaidRef}
          className={`w-full max-w-6xl aspect-video bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-12 xl:p-16 overflow-auto border border-slate-200 dark:border-slate-700 flex flex-col justify-center ${layoutClass}`}
          style={{
            backgroundImage: currentSlideData.background ? `url(${currentSlideData.background})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className={`${currentSlideData.background ? 'bg-white/90 dark:bg-slate-900/90 p-8 rounded-xl' : ''} prose prose-lg dark:prose-invert max-w-none`}>
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
                      <div className="mermaid-diagram my-6">
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
                        className="rounded-lg my-4"
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

      {/* Navigation */}
      <div className="bg-card border-t border-border px-6 py-4 flex items-center justify-between">
        <Button
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-smooth ${
                index === currentSlide
                  ? "bg-primary w-8"
                  : "bg-muted hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNextSlide}
          disabled={currentSlide === slides.length - 1}
          variant="outline"
          size="sm"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
