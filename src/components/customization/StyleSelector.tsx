import { Check } from "lucide-react";
import { STYLE_PREFERENCES } from "@/types/theme";
import { useTheme } from "@/hooks/use-theme";
import { Label } from "@/components/ui/label";

export function StyleSelector() {
  const { theme, updateStyle } = useTheme();

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Presentation Style</Label>
      <div className="grid grid-cols-1 gap-3">
        {STYLE_PREFERENCES.map((style) => {
          const isSelected = theme.style === style.value;
          return (
            <button
              key={style.value}
              onClick={() => updateStyle(style.value)}
              className={`relative p-3 rounded-lg border-2 transition-smooth hover:border-primary text-left ${
                isSelected ? "border-primary bg-accent" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{style.label}</span>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">{style.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
