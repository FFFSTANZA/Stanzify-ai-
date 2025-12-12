import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SlideViewer } from "@/components/SlideViewer";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { generateSlides } from "@/services/groqService";
import { replaceImagePlaceholders } from "@/services/unsplashService";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw, Sparkles, Zap } from "lucide-react";
import type { PresentationConfig } from "@/types/theme";

export default function ViewerPage() {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [config, setConfig] = useState<PresentationConfig | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);

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
    setIsGenerating(true);
    setMarkdown("");
    setProgressMessage("Initializing AI-powered slidev generation...");
    setGenerationStartTime(Date.now());

    try {
      let accumulatedMarkdown = "";

      const themeConfig = {
        palette: presentationConfig.palette,
        fonts: { id: 'modern', name: 'Modern Sans', heading: 'Inter', body: 'Inter' },
        style: presentationConfig.designStyle,
        purpose: presentationConfig.slidePurpose,
        imageSource: presentationConfig.imageSource,
      };

      // Enhanced progress tracking
      const updateProgress = (chunk: string) => {
        accumulatedMarkdown += chunk;
        setMarkdown(accumulatedMarkdown);
        
        // Update progress message based on content
        const lines = accumulatedMarkdown.split('\n');
        const lastLine = lines[lines.length - 1].toLowerCase();
        
        if (lastLine.includes('layout: cover')) {
          setProgressMessage("Creating stunning cover slide...");
        } else if (lastLine.includes('mermaid')) {
          setProgressMessage("Generating interactive diagrams...");
        } else if (lastLine.includes('layout: two-cols')) {
          setProgressMessage("Building balanced content layouts...");
        } else if (lastLine.includes('layout: fact')) {
          setProgressMessage("Adding compelling statistics...");
        } else if (lastLine.includes('layout: quote')) {
          setProgressMessage("Crafting memorable quotes...");
        } else if (lastLine.includes('layout: end')) {
          setProgressMessage("Finalizing presentation...");
        }
      };

      const result = await generateSlides({
        prompt: presentationConfig.prompt,
        theme: themeConfig,
        onProgress: updateProgress,
        temperature: 0.8, // Higher creativity for premium content
        maxRetries: 3,
        template: presentationConfig.slidePurpose || 'custom'
      });

      setProgressMessage("Processing and optimizing images...");
      
      let finalMarkdown = result;
      if (presentationConfig.imageSource === 'unsplash') {
        const markdownWithImages = await replaceImagePlaceholders(result, (status) => {
          setProgressMessage(status);
        });
        finalMarkdown = markdownWithImages;
      }
      
      setMarkdown(finalMarkdown);

      const generationTime = generationStartTime 
        ? Math.round((Date.now() - generationStartTime) / 1000) 
        : 0;

      toast.success(
        `🚀 Premium slidev presentation generated in ${generationTime}s!`,
        {
          description: "Ready to present with advanced features",
          duration: 4000,
        }
      );
      
    } catch (error) {
      console.error("Error generating slides:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to generate presentation. Please try again.";
        
      toast.error("Generation failed", {
        description: errorMessage,
        duration: 5000,
      });
      
      // Don't navigate away immediately, let user retry
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (config && !isGenerating) {
      generatePresentation(config);
    }
  };

  const handleBackToCreate = () => {
    navigate('/');
  };

  const handleBackToCustomize = () => {
    navigate('/customize');
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

  // Enhanced loading state with progress
  if (isGenerating && markdown) {
    return (
      <div className="h-screen flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Stanzify</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBackToCustomize}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button variant="outline" onClick={handleBackToCreate}>
                New Presentation
              </Button>
            </div>
          </div>
        </header>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center space-y-6 p-8">
            {/* Enhanced Loading Animation */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Generating Premium Presentation</h2>
              <p className="text-lg text-muted-foreground">
                Crafting your slidev presentation with AI-powered design
              </p>
            </div>
            
            {/* Progress Message */}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm font-medium flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                {progressMessage}
              </p>
            </div>
            
            {/* Real-time Preview */}
            {markdown && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-border/50">
                <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="max-h-60 overflow-y-auto">
                    {markdown.split('\n').slice(0, 20).map((line, index) => (
                      <div key={index} className="text-xs font-mono opacity-70">
                        {line}
                      </div>
                    ))}
                    {markdown.split('\n').length > 20 && (
                      <div className="text-xs text-muted-foreground italic">
                        ... and more slides being generated
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium">AI-Powered Design</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <p className="font-medium">Interactive Diagrams</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-medium">Premium Layouts</p>
              </div>
            </div>
          </div>
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
            <Button 
              variant="outline" 
              onClick={handleRegenerate} 
              disabled={isLoading || isGenerating}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            <Button variant="outline" onClick={handleBackToCustomize} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Customize
            </Button>
            <Button variant="outline" onClick={handleBackToCreate} className="gap-2">
              New Presentation
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {markdown ? (
          <SlideViewer 
            markdown={markdown} 
            title={config?.prompt?.slice(0, 50) + "..." || "Stanzify Presentation"}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">No slides to display</p>
              <div className="flex gap-2">
                <Button onClick={handleBackToCreate} variant="outline">
                  Create New
                </Button>
                <Button onClick={handleBackToCustomize} variant="outline">
                  Customize
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
