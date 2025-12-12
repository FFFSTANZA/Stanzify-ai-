import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Palette, Layout, Image, Target, Zap } from "lucide-react";
import {
  COLOR_PALETTES,
  DESIGN_STYLES,
  IMAGE_SOURCES,
  SLIDE_PURPOSES,
  type ColorPalette,
  type DesignStyle,
  type ImageSource,
  type SlidePurpose,
} from "@/types/theme";

export default function CustomizePage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(COLOR_PALETTES[1]);
  const [selectedDesignStyle, setSelectedDesignStyle] = useState<DesignStyle>('minimal');
  const [selectedImageSource, setSelectedImageSource] = useState<ImageSource>('unsplash');
  const [selectedPurpose, setSelectedPurpose] = useState<SlidePurpose>('pitch');

  useEffect(() => {
    const savedPrompt = localStorage.getItem('stanzify-prompt');
    if (!savedPrompt) {
      navigate('/');
      return;
    }
    setPrompt(savedPrompt);
  }, [navigate]);

  const handleGenerate = () => {
    const config = {
      palette: selectedPalette,
      designStyle: selectedDesignStyle,
      imageSource: selectedImageSource,
      slidePurpose: selectedPurpose,
      prompt,
    };

    localStorage.setItem('stanzify-config', JSON.stringify(config));
    navigate('/viewer');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Stanzify</h1>
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-10">
          <div className="text-center space-y-3 animate-in fade-in duration-500">
            <h2 className="text-4xl xl:text-5xl font-bold text-foreground">
              Customize Your Presentation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your style preferences to create the perfect presentation
            </p>
            <div className="inline-block px-4 py-2 rounded-full bg-accent/50 text-sm font-medium">
              <Zap className="w-4 h-4 inline mr-2" />
              Advanced Slidev Features Enabled
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-4 animate-in slide-in-from-left duration-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label className="text-lg font-bold">Color Palette</Label>
                  <p className="text-sm text-muted-foreground">Choose your brand colors</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => setSelectedPalette(palette)}
                    className={`p-4 rounded-xl border-2 transition-smooth hover:scale-[1.02] ${
                      selectedPalette.id === palette.id
                        ? "border-primary shadow-elegant bg-accent/30"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5 h-10">
                        <div
                          className="w-10 rounded-lg"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div
                          className="w-10 rounded-lg"
                          style={{ backgroundColor: palette.accent }}
                        />
                        <div
                          className="w-10 rounded-lg border border-border"
                          style={{ backgroundColor: palette.background }}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold">{palette.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {palette.id === 'minimal' && 'Clean & Professional'}
                          {palette.id === 'blue' && 'Tech & Innovation'}
                          {palette.id === 'sunset' && 'Warm & Energetic'}
                          {palette.id === 'forest' && 'Natural & Calm'}
                          {palette.id === 'royal' && 'Bold & Creative'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 animate-in slide-in-from-right duration-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Layout className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label className="text-lg font-bold">Design Style</Label>
                  <p className="text-sm text-muted-foreground">Select presentation layout</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {DESIGN_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedDesignStyle(style.value)}
                    className={`p-4 rounded-xl border-2 transition-smooth hover:scale-[1.02] text-left ${
                      selectedDesignStyle === style.value
                        ? "border-primary shadow-elegant bg-accent/30"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold">{style.label}</p>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Image className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label className="text-lg font-bold">Image Source</Label>
                  <p className="text-sm text-muted-foreground">How to handle images</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {IMAGE_SOURCES.map((source) => (
                  <button
                    key={source.value}
                    onClick={() => setSelectedImageSource(source.value)}
                    className={`p-4 rounded-xl border-2 transition-smooth hover:scale-[1.02] text-left ${
                      selectedImageSource === source.value
                        ? "border-primary shadow-elegant bg-accent/30"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold">{source.label}</p>
                    <p className="text-sm text-muted-foreground">{source.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label className="text-lg font-bold">Presentation Purpose</Label>
                  <p className="text-sm text-muted-foreground">What's the goal?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {SLIDE_PURPOSES.map((purpose) => (
                  <button
                    key={purpose.value}
                    onClick={() => setSelectedPurpose(purpose.value)}
                    className={`p-4 rounded-xl border-2 transition-smooth hover:scale-[1.02] text-left ${
                      selectedPurpose === purpose.value
                        ? "border-primary shadow-elegant bg-accent/30"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-semibold">{purpose.label}</p>
                    <p className="text-sm text-muted-foreground">{purpose.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <Button
              size="lg"
              onClick={handleGenerate}
              className="w-full text-lg h-16 rounded-2xl shadow-elegant hover:shadow-xl transition-smooth"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Presentation with Advanced Features
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Includes: Transitions • Animations • Code Highlighting • Diagrams • Math Equations
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
