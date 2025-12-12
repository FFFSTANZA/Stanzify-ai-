import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SlideViewer } from "@/components/SlideViewer";
import { LoadingState } from "@/components/LoadingState";
import { generateSlides } from "@/services/groqService";
import { replaceImagePlaceholders } from "@/services/unsplashService";
import { toast } from "sonner";
import { Sparkles, RotateCcw, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { COLOR_PALETTES, DESIGN_STYLES, IMAGE_SOURCES, SLIDE_PURPOSES } from "@/types/theme";
import type { ColorPalette, DesignStyle, ImageSource, SlidePurpose } from "@/types/theme";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  
  // Customization options
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(COLOR_PALETTES[1]); // Blue Tech
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>('modern');
  const [selectedImageSource, setSelectedImageSource] = useState<ImageSource>('unsplash');
  const [selectedPurpose, setSelectedPurpose] = useState<SlidePurpose>('business');

  const characterCount = prompt.length;
  const isReady = characterCount >= 50;

  const handleGenerate = async () => {
    if (!isReady) {
      toast.error("Please provide more details (at least 50 characters)");
      return;
    }

    setIsLoading(true);
    setMarkdown("");

    try {
      let accumulatedMarkdown = "";

      const themeConfig = {
        palette: selectedPalette,
        fonts: { id: 'modern', name: 'Modern Sans', heading: 'Inter', body: 'Inter' },
        style: selectedStyle,
        purpose: selectedPurpose,
        imageSource: selectedImageSource,
      };

      const result = await generateSlides({
        prompt,
        theme: themeConfig,
        onProgress: (chunk) => {
          accumulatedMarkdown += chunk;
          setMarkdown(accumulatedMarkdown);
        },
      });

      if (selectedImageSource === 'unsplash') {
        toast.info("Processing images...");
        const withImages = await replaceImagePlaceholders(result);
        setMarkdown(withImages);
      } else {
        setMarkdown(result);
      }

      toast.success("Presentation generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate presentation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setMarkdown("");
  };

  if (isLoading || markdown) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
              <h1 className="text-xl font-semibold">Your Presentation</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMarkdown("");
                    setPrompt("");
                  }}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Presentation
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <SlideViewer markdown={markdown} />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8 shadow-elegant">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold gradient-text">Stanzify</h1>
            <p className="text-muted-foreground">AI-Powered Presentation Generator</p>
          </div>

          {/* Prompt Input */}
          <div className="space-y-3">
            <label className="text-lg font-semibold">Describe Your Presentation</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Create a 12-slide business presentation about our new SaaS product launch, targeting enterprise clients. Include market analysis, product features, pricing tiers, and implementation timeline."
              className="min-h-[200px] text-base resize-none"
            />
            <div className="flex items-center justify-between text-sm">
              <span className={characterCount >= 50 ? "text-green-600" : "text-muted-foreground"}>
                {characterCount} / 1000 {characterCount >= 50 ? "Great! Your prompt is detailed enough" : ""}
              </span>
              {isReady && (
                <span className="text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Ready to generate
                </span>
              )}
            </div>
          </div>

          {/* Customize Design (Collapsible) */}
          <div className="border border-border rounded-lg">
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <span className="font-semibold">Customize Design</span>
                <span className="text-sm text-muted-foreground">(Optional)</span>
              </div>
              {showCustomize ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showCustomize && (
              <div className="p-6 pt-0 space-y-6 border-t border-border mt-2">
                {/* Color Palette */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Color Palette</label>
                  <div className="grid grid-cols-5 gap-3">
                    {COLOR_PALETTES.map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() => setSelectedPalette(palette)}
                        className={`p-3 rounded-lg border-2 transition-smooth hover:scale-105 ${
                          selectedPalette.id === palette.id
                            ? "border-primary shadow-md"
                            : "border-border"
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-full h-6 rounded" style={{ backgroundColor: palette.primary }}></div>
                          <div className="w-full h-6 rounded" style={{ backgroundColor: palette.accent }}></div>
                        </div>
                        <p className="text-xs font-medium text-center">{palette.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design Style */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Design Style</label>
                  <div className="grid grid-cols-3 gap-3">
                    {DESIGN_STYLES.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setSelectedStyle(style.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-smooth hover:scale-105 ${
                          selectedStyle === style.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <p className="font-semibold text-sm mb-1">{style.label}</p>
                        <p className="text-xs text-muted-foreground">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Source */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Image Source</label>
                  <div className="grid grid-cols-3 gap-3">
                    {IMAGE_SOURCES.map((source) => (
                      <button
                        key={source.value}
                        onClick={() => setSelectedImageSource(source.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-smooth hover:scale-105 ${
                          selectedImageSource === source.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <p className="font-semibold text-sm mb-1">{source.label}</p>
                        <p className="text-xs text-muted-foreground">{source.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slide Purpose */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Slide Purpose</label>
                  <div className="grid grid-cols-3 gap-3">
                    {SLIDE_PURPOSES.map((purpose) => (
                      <button
                        key={purpose.value}
                        onClick={() => setSelectedPurpose(purpose.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-smooth hover:scale-105 ${
                          selectedPurpose === purpose.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <p className="font-semibold text-sm mb-1">{purpose.label}</p>
                        <p className="text-xs text-muted-foreground">{purpose.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={!isReady}
              className="flex-1 h-12 text-base"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Slides
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="h-12"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
