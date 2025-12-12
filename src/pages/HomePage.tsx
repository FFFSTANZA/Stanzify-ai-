import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SlideViewer } from "@/components/SlideViewer";
import { LoadingState } from "@/components/LoadingState";
import { generateSlides } from "@/services/groqService";
import { replaceImagePlaceholders } from "@/services/unsplashService";
import { toast } from "sonner";
import { Sparkles, ChevronDown, ChevronUp, Palette, Image, Target, Wand2 } from "lucide-react";
import { COLOR_PALETTES, DESIGN_STYLES, IMAGE_SOURCES, SLIDE_PURPOSES } from "@/types/theme";
import type { ColorPalette, DesignStyle, ImageSource, SlidePurpose } from "@/types/theme";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  
  // Customization options
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(COLOR_PALETTES[1]);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>('modern');
  const [selectedImageSource, setSelectedImageSource] = useState<ImageSource>('unsplash');
  const [selectedPurpose, setSelectedPurpose] = useState<SlidePurpose>('business');

  const characterCount = prompt.length;
  const isReady = characterCount >= 50;

  const samplePrompts = [
    "Create a 12-slide business presentation about our new SaaS product launch, targeting enterprise clients. Include market analysis, product features, pricing tiers, and implementation timeline.",
    "Build an educational presentation about Climate Change for high school students. Cover causes, effects, solutions, and real-world examples with statistics and diagrams.",
    "Design a pitch deck for a fintech startup that provides AI-powered investment advice. Include problem statement, solution, market size, business model, and competitive advantage.",
  ];

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

      if (selectedImageSource !== 'none') {
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
      <div className="h-screen flex flex-col">
        {isLoading ? (
          <LoadingState />
        ) : (
          <SlideViewer 
            markdown={markdown} 
            palette={selectedPalette}
            onNewPresentation={() => {
              setMarkdown("");
              setPrompt("");
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-border/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">Stanzify</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            AI Presentation Generator
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 xl:py-20">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-full text-sm text-blue-700 dark:text-blue-300 mb-4">
              <Wand2 className="w-4 h-4" />
              <span>Powered by Groq AI</span>
            </div>
            <h1 className="text-5xl xl:text-6xl font-bold tracking-tight">
              Create stunning presentations
              <br />
              <span className="gradient-text">in seconds with AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Describe your presentation idea and watch as AI generates professional slides with layouts, diagrams, and beautiful design.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-smooth">
              <div className="p-6 space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your presentation... (e.g., Create a 12-slide business presentation about our new SaaS product launch)"
                  className="min-h-[160px] text-base border-0 focus-visible:ring-0 resize-none p-0 placeholder:text-muted-foreground/60"
                />
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${characterCount >= 50 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                      {characterCount >= 50 ? (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full"></span>
                          Ready to generate
                        </span>
                      ) : (
                        `${characterCount} / 1000 characters`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {prompt && (
                      <Button
                        onClick={handleClear}
                        variant="ghost"
                        size="sm"
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      onClick={handleGenerate}
                      disabled={!isReady}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Presentation
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Prompts */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Try these examples:</p>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                {samplePrompts.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(sample)}
                    className="text-left text-sm p-4 rounded-xl bg-white dark:bg-slate-900 border border-border hover:border-primary hover:shadow-md transition-smooth group"
                  >
                    <p className="text-foreground group-hover:text-primary transition-smooth line-clamp-3">
                      {sample}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customization Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-lg overflow-hidden">
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-smooth"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Customize Design</h3>
                  <p className="text-sm text-muted-foreground">Optional: Personalize colors, style, and more</p>
                </div>
              </div>
              {showCustomize ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {showCustomize && (
              <div className="border-t border-border p-6 space-y-8">
                {/* Color Palette */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-semibold">Color Palette</label>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {COLOR_PALETTES.map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() => setSelectedPalette(palette)}
                        className={`group relative p-4 rounded-xl border-2 transition-smooth hover:scale-105 ${
                          selectedPalette.id === palette.id
                            ? "border-primary shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex gap-1.5 mb-3">
                          <div className="flex-1 h-8 rounded-md" style={{ backgroundColor: palette.primary }}></div>
                          <div className="flex-1 h-8 rounded-md" style={{ backgroundColor: palette.accent }}></div>
                        </div>
                        <p className="text-xs font-medium text-center">{palette.name}</p>
                        {selectedPalette.id === palette.id && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design Style */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-semibold">Design Style</label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {DESIGN_STYLES.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setSelectedStyle(style.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-smooth hover:scale-105 ${
                          selectedStyle === style.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-semibold text-sm mb-1">{style.label}</p>
                        <p className="text-xs text-muted-foreground">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Source */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-semibold">Image Source</label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {IMAGE_SOURCES.map((source) => (
                      <button
                        key={source.value}
                        onClick={() => setSelectedImageSource(source.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-smooth hover:scale-105 ${
                          selectedImageSource === source.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <p className="font-semibold text-sm mb-1">{source.label}</p>
                        <p className="text-xs text-muted-foreground">{source.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slide Purpose */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-semibold">Presentation Purpose</label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {SLIDE_PURPOSES.map((purpose) => (
                      <button
                        key={purpose.value}
                        onClick={() => setSelectedPurpose(purpose.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-smooth hover:scale-105 ${
                          selectedPurpose === purpose.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
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

          {/* Features */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Generation</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI creates professional slides with proper layouts, diagrams, and content structure.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Beautiful Design</h3>
              <p className="text-sm text-muted-foreground">
                Choose from multiple color palettes and design styles to match your brand.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30 border border-pink-200 dark:border-pink-800">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Slidev Compatible</h3>
              <p className="text-sm text-muted-foreground">
                Export to Slidev format with full support for code, diagrams, and animations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
