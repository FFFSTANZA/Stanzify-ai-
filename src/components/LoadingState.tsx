import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground">
          Generating your presentation...
        </p>
        <p className="text-sm text-muted-foreground">
          This may take a few moments
        </p>
      </div>
    </div>
  );
}
