import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Maximize2, Edit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import mermaid from "mermaid";

interface SlideViewerProps {
  markdown: string;
  onEdit?: () => void;
}

export function SlideViewer({ markdown, onEdit }: SlideViewerProps) {
  const [slides, setSlides] = useState<string[]>([]);
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
    const slideArray = markdown
      .split("---")
      .map((slide) => slide.trim())
      .filter((slide) => slide.length > 0);
    setSlides(slideArray);
    setCurrentSlide(0);
  }, [markdown]);

  useEffect(() => {
    if (mermaidRef.current) {
      const mermaidElements = mermaidRef.current.querySelectorAll('.mermaid');
      mermaidElements.forEach((element, index) => {
        const code = element.textContent || '';
        mermaid.render(`mermaid-${index}-${Date.now()}`, code).then(({ svg }) => {
          element.innerHTML = svg;
        }).catch((error) => {
          console.error('Mermaid rendering error:', error);
        });
      });
    }
  }, [currentSlide, slides]);

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      goToNextSlide();
    } else if (e.key === "ArrowLeft") {
      goToPreviousSlide();
    } else if (e.key === "Escape" && isFullscreen) {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "presentation.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No slides to display</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-full"}`}
    >
      <div className="flex-1 flex items-center justify-center p-4 xl:p-8 overflow-auto">
        <div 
          ref={mermaidRef}
          className="w-full max-w-5xl aspect-video bg-card rounded-xl shadow-elegant p-6 xl:p-12 overflow-auto transition-smooth"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  const inline = !className;
                  
                  if (match && match[1] === 'mermaid') {
                    return (
                      <div className="mermaid my-4">
                        {codeString}
                      </div>
                    );
                  }
                  
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg my-4"
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {slides[currentSlide]}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 p-4 xl:p-6 border-t border-border bg-card">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousSlide}
          disabled={currentSlide === 0}
          className="order-1 xl:order-none"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex flex-col xl:flex-row items-center gap-4 order-3 xl:order-none">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <div className="flex space-x-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-smooth ${
                  index === currentSlide ? "bg-primary w-6" : "bg-muted"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              {isFullscreen ? "Exit" : "Fullscreen"}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadMarkdown}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextSlide}
          disabled={currentSlide === slides.length - 1}
          className="order-2 xl:order-none"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}


