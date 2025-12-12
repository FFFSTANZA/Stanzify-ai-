import { useState } from "react";
import { PromptInput } from "@/components/PromptInput";
import { SlideViewer } from "@/components/SlideViewer";
import { LoadingState } from "@/components/LoadingState";
import { generateSlides } from "@/services/groqService";
import { toast } from "sonner";
import { Presentation } from "lucide-react";

export default function PresentationPage() {
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setMarkdown("");

    try {
      let accumulatedMarkdown = "";

      const result = await generateSlides({
        prompt,
        onProgress: (chunk) => {
          accumulatedMarkdown += chunk;
          setMarkdown(accumulatedMarkdown);
        },
      });

      setMarkdown(result);
      toast.success("Presentation generated successfully!");
    } catch (error) {
      console.error("Error generating slides:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate presentation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col xl:flex-row">
      <div className="w-full xl:w-[400px] border-b xl:border-b-0 xl:border-r border-border bg-card">
        <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
      </div>

      <div className="flex-1 bg-background">
        {isLoading && !markdown ? (
          <LoadingState />
        ) : markdown ? (
          <SlideViewer markdown={markdown} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
            <Presentation className="w-24 h-24 text-muted-foreground opacity-50" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Ready to Create
              </h2>
              <p className="text-muted-foreground max-w-md">
                Enter your topic on the left to generate a beautiful
                presentation powered by AI
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
