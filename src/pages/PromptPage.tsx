import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight } from "lucide-react";

export default function PromptPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const handleContinue = () => {
    if (!prompt.trim()) return;
    localStorage.setItem('stanzify-prompt', prompt.trim());
    navigate('/customize');
  };

  const examplePrompts = [
    "Create a pitch deck for an AI startup solving EV charger uptime issues with real-time monitoring",
    "Make a technical presentation about blockchain consensus mechanisms with code examples and diagrams",
    "Build a marketing deck for a new SaaS product launch with market analysis and growth projections",
    "Create an educational presentation about climate change with data visualizations and statistics",
    "Design a business report on the Indian EV ecosystem with market trends and competitor analysis",
    "Make a webinar presentation about modern web development with live code demonstrations",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold gradient-text">Stanzify</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-700">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-5xl xl:text-6xl font-bold text-foreground tracking-tight">
              What would you like
              <br />
              <span className="gradient-text">to present?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Describe your presentation topic in detail. The more specific you are, the better the results.
            </p>
          </div>

          <div className="space-y-6">
            <Textarea
              placeholder="E.g., Create a comprehensive pitch deck for a B2B SaaS startup that helps companies reduce their carbon footprint through AI-powered energy optimization. Include market size, problem statement, solution, business model, competitive analysis, team, and financial projections..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[200px] text-lg rounded-2xl resize-none border-2 focus:border-primary transition-smooth shadow-lg"
              autoFocus
            />

            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!prompt.trim()}
              className="w-full text-lg h-16 rounded-2xl shadow-elegant hover:shadow-xl transition-smooth"
            >
              Continue to Customization
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Or try one of these examples:
            </p>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left px-5 py-4 text-sm rounded-xl bg-card hover:bg-accent border border-border hover:border-primary transition-smooth shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-primary mt-0.5">0{index + 1}</span>
                    <span className="flex-1">{example}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-muted-foreground">
          Powered by AI • Slidev-compatible presentations
        </div>
      </footer>
    </div>
  );
}
