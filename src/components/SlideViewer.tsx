import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Maximize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SlideViewerProps {
  markdown: string;
}

export function SlideViewer({ markdown }: SlideViewerProps) {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const slideArray = markdown
      .split("---")
      .map((slide) => slide.trim())
      .filter((slide) => slide.length > 0);
    setSlides(slideArray);
    setCurrentSlide(0);
  }, [markdown]);

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
        <div className="w-full max-w-5xl aspect-video bg-card rounded-xl shadow-elegant p-8 xl:p-12 overflow-auto transition-smooth">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
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

