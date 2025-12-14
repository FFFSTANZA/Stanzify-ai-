import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Play,
  Pause,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ComponentPresentationData } from '@/types/componentSlide';
import type { ColorPalette } from '@/types/theme';
import { getComponent } from '@/components/slides/registry';

interface ComponentSlideViewerProps {
  presentationData: ComponentPresentationData;
  palette?: ColorPalette;
  onNewPresentation?: () => void;
}

const DEFAULT_PALETTE: ColorPalette = {
  id: 'default',
  name: 'Default',
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  background: '#FFFFFF',
};

export function ComponentSlideViewer({
  presentationData,
  palette,
  onNewPresentation,
}: ComponentSlideViewerProps) {
  const activePalette = palette ?? DEFAULT_PALETTE;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const slides = presentationData.slides;
  const theme = presentationData.theme || 'modern';

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isAutoPlay && slides.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev < slides.length - 1) {
            return prev + 1;
          } else {
            setIsAutoPlay(false);
            return prev;
          }
        });
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlay, slides.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'h':
          handlePrevSlide();
          break;
        case 'ArrowRight':
        case 'l':
        case ' ':
          if (e.key === ' ') e.preventDefault();
          handleNextSlide();
          break;
        case 'Home':
          setCurrentSlide(0);
          break;
        case 'End':
          setCurrentSlide(slides.length - 1);
          break;
        case 'Escape':
          setIsFullscreen(false);
          break;
        case 'f':
          setIsFullscreen(!isFullscreen);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, slides.length]);

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    toast.info('Download feature coming soon!');
  };

  const handleGoHome = useCallback(() => {
    if (onNewPresentation) {
      onNewPresentation();
    }
  }, [onNewPresentation]);

  const slide = slides[currentSlide];
  const Component = getComponent(slide?.componentId);

  if (!slide || !Component) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Error: Slide component not found
          </h2>
          <p className="text-gray-600 mb-4">
            Component ID: {slide?.componentId || 'unknown'}
          </p>
          <Button onClick={handleGoHome}>Create New Presentation</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-screen'} bg-gray-900`}
      data-theme={theme}
      style={{
        '--palette-primary': activePalette.primary,
        '--palette-secondary': activePalette.secondary,
        '--palette-accent': activePalette.accent,
        '--palette-background': activePalette.background,
      } as React.CSSProperties}
    >
      {/* Slide Container */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-7xl aspect-video bg-white shadow-2xl rounded-lg overflow-hidden"
          style={{ backgroundColor: activePalette.background }}
        >
          <Component {...slide.props} palette={activePalette} theme={theme} />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-800/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <Button
          onClick={handleGoHome}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700"
          title="Home"
        >
          <Home className="w-5 h-5" />
        </Button>

        <Button
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700 disabled:opacity-30"
          title="Previous (Arrow Left)"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2 px-4 text-white font-medium">
          <span className="text-lg">{currentSlide + 1}</span>
          <span className="opacity-50">/</span>
          <span className="text-lg opacity-70">{slides.length}</span>
        </div>

        <Button
          onClick={handleNextSlide}
          disabled={currentSlide === slides.length - 1}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700 disabled:opacity-30"
          title="Next (Arrow Right)"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <div className="w-px h-8 bg-gray-600" />

        <Button
          onClick={toggleAutoPlay}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700"
          title={isAutoPlay ? 'Pause' : 'Auto-play'}
        >
          {isAutoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>

        <Button
          onClick={toggleFullscreen}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700"
          title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen (F)'}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>

        <Button
          onClick={handleDownload}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700"
          title="Download"
        >
          <Download className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            backgroundColor: activePalette.accent,
          }}
        />
      </div>

      {/* Presentation Title Overlay */}
      <div className="absolute top-8 left-8 bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2 max-w-md">
        <h2 className="text-white font-semibold text-sm truncate">
          {presentationData.title}
        </h2>
        {presentationData.subtitle && (
          <p className="text-gray-300 text-xs truncate">
            {presentationData.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
