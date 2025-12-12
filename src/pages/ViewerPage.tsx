import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SlideViewer } from "@/components/SlideViewer";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { generateSlides } from "@/services/groqService";
import { replaceImagePlaceholders } from "@/services/unsplashService";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw } from "lucide-react";
import type { PresentationConfig } from "@/types/theme";

export default function ViewerPage() {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<PresentationConfig | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('stanzify-config');
    if (!savedConfig) {
      navigate('/');
      return;
    }

    const parsedConfig = JSON.parse(savedConfig);
    setConfig(parsedConfig);
    generatePresentation(parsedConfig);
  }, []);

  const generatePresentation = async (presentationConfig: any) => {
    setIsLoading(true);
    setMarkdown("");

    try {
      let accumulatedMarkdown = "";

      const themeConfig = {
        palette: presentationConfig.palette,
        fonts: { id: 'modern', name: 'Modern Sans', heading: 'Inter', body: 'Inter' },
        style: presentationConfig.designStyle,
        purpose: presentationConfig.slidePurpose,
        imageSource: presentationConfig.imageSource,
      };

      const result = await generateSlides({
        prompt: presentationConfig.prompt,
        theme: themeConfig,
        onProgress: (chunk) => {
          accumulatedMarkdown += chunk;
          setMarkdown(accumulatedMarkdown);
        },
      });

      toast.success("Presentation generated! Processing images...");

      if (presentationConfig.imageSource === 'unsplash') {
        const markdownWithImages = await replaceImagePlaceholders(result);
        setMarkdown(markdownWithImages);
      } else {
        setMarkdown(result);
      }

      toast.success("Presentation ready!");
    } catch (error) {
      console.error("Error generating slides:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate presentation. Please try again."
      );
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (config) {
      generatePresentation(config);
    }
  };

  const handleBackToCreate = () => {
    navigate('/');
  };

  if (isLoading && !markdown) {
    return (
      <div className="h-screen flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Stanzify</h1>
            <Button variant="outline" onClick={handleBackToCreate}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </header>
        <div className="flex-1">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold gradient-text">Stanzify</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRegenerate} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            <Button variant="outline" onClick={handleBackToCreate}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Presentation
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {markdown ? (
          <SlideViewer markdown={markdown} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No slides to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
