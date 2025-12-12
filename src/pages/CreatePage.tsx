import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Palette, Layout, Image, Target } from "lucide-react";
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

export default function CreatePage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(COLOR_PALETTES[1]);
  const [selectedDesignStyle, setSelectedDesignStyle] = useState<DesignStyle>('minimal');
  const [selectedImageSource, setSelectedImageSource] = useState<ImageSource>('unsplash');
  const [selectedPurpose, setSelectedPurpose] = useState<SlidePurpose>('pitch');

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    const config = {
      palette: selectedPalette,
      designStyle: selectedDesignStyle,
      imageSource: selectedImageSource,
      slidePurpose: selectedPurpose,
      prompt: prompt.trim(),
    };

    localStorage.setItem('stanzify-config', JSON.stringify(config));
    navigate('/viewer');
  };

  const examplePrompts = [
    "Create a pitch deck for an AI startup solving EV charger uptime issues",
    "Make a class presentation about blockchain consensus mechanisms",
    "Make a report-style deck explaining the Indian EV ecosystem",
    "Create a marketing presentation for a new SaaS product",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold gradient-text">Stanzify</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl xl:text-5xl font-bold text-foreground">
              Create Your Presentation
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your style, describe your topic, and let AI create a professional presentation in seconds
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <Label className="text-base font-semibold">Color Palette</Label>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => setSelectedPalette(palette)}
                    className={`p-4 rounded-xl border-2 transition-smooth hover:scale-105 ${
                      selectedPalette.id === palette.id
                        ? "border-primary shadow-elegant"
                        : "border-border"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex gap-1 h-8">
                        <div
                          className="flex-1 rounded"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div
                          className="flex-1 rounded"
                          style={{ backgroundColor: palette.accent }}
                        />
                      </div>
                      <p className="text-sm font-medium text-center">{palette.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                <Label className="text-base font-semibold">Design Style</Label>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                {DESIGN_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedDesignStyle(style.value)}
                    className={`p-4 rounded-xl border-2 transition-smooth hover:scale-105 text-left ${
                      selectedDesignStyle === style.value
                        ? "border-primary shadow-elegant bg-accent"
                        : "border-border"
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{style.label}</p>
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                <Label className="text-base font-semibold">Image Source</Label>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                {IMAGE_SOURCES.map((source) => (
                  <button
                    key={source.value}
                    onClick={() => setSelectedImageSource(source.value)}
                    className={`p-4 rounded-xl border-2 transition-smooth hover:scale-105 text-left ${
                      selectedImageSource === source.value
                        ? "border-primary shadow-elegant bg-accent"
                        : "border-border"
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{source.label}</p>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <Label className="text-base font-semibold">Slide Purpose</Label>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {SLIDE_PURPOSES.map((purpose) => (
                  <button
                    key={purpose.value}
                    onClick={() => setSelectedPurpose(purpose.value)}
                    className={`p-4 rounded-xl border-2 transition-smooth hover:scale-105 text-left ${
                      selectedPurpose === purpose.value
                        ? "border-primary shadow-elegant bg-accent"
                        : "border-border"
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{purpose.label}</p>
                      <p className="text-sm text-muted-foreground">{purpose.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Label htmlFor="prompt" className="text-base font-semibold">
                What would you like to present?
              </Label>
              <Textarea
                id="prompt"
                placeholder="Describe your presentation topic in detail..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[150px] text-base rounded-xl resize-none"
              />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try these examples:</p>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                  {examplePrompts.map((example) => (
                    <button
                      key={example}
                      onClick={() => setPrompt(example)}
                      className="text-left px-4 py-2 text-sm rounded-lg bg-secondary hover:bg-accent transition-smooth"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="w-full text-lg h-14 rounded-xl shadow-elegant"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Presentation
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
