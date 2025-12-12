import { Sparkles } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="text-center space-y-8 max-w-md px-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto blur-xl opacity-50 animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold gradient-text">
            Creating your presentation
          </h2>
          <p className="text-muted-foreground">
            AI is crafting beautiful slides with professional layouts...
          </p>
        </div>

        {/* Loading Steps */}
        <div className="space-y-3 text-left bg-white dark:bg-slate-900 rounded-xl p-6 border border-border shadow-lg">
          <LoadingStep text="Analyzing your prompt" delay={0} />
          <LoadingStep text="Structuring content" delay={1} />
          <LoadingStep text="Designing layouts" delay={2} />
          <LoadingStep text="Adding visual elements" delay={3} />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
}

function LoadingStep({ text, delay }: { text: string; delay: number }) {
  return (
    <div 
      className="flex items-center gap-3 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay * 0.3}s`, animationFillMode: 'forwards' }}
    >
      <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
