import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onGenerate, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <div className="flex flex-col h-full p-6 xl:p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl xl:text-4xl font-bold gradient-text">Stanzify</h1>
        <p className="text-sm xl:text-base text-muted-foreground">
          Transform your ideas into professional presentations with AI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
        <div className="flex-1 flex flex-col space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium">
            What would you like to present?
          </label>
          <Textarea
            id="prompt"
            placeholder="E.g., Create a presentation about the benefits of renewable energy..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 resize-none min-h-[150px] xl:min-h-[200px] text-base"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!prompt.trim() || isLoading}
          className="w-full shadow-elegant"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isLoading ? "Generating..." : "Generate Slides"}
        </Button>
      </form>

      <div className="space-y-3 pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground">Try these examples:</p>
        <div className="space-y-2">
          {[
            "Introduction to Machine Learning",
            "The Future of Sustainable Energy",
            "Building Effective Teams",
            "Digital Marketing Strategies 2024",
          ].map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => !isLoading && setPrompt(example)}
              disabled={isLoading}
              className="w-full text-left px-4 py-2 text-sm rounded-lg bg-secondary hover:bg-accent transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

