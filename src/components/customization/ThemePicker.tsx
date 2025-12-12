import { Check } from "lucide-react";
import { COLOR_PALETTES } from "@/types/theme";
import { useTheme } from "@/hooks/use-theme";
import { Label } from "@/components/ui/label";

export function ThemePicker() {
  const { theme, updatePalette } = useTheme();

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Color Palette</Label>
      <div className="grid grid-cols-1 gap-3">
        {COLOR_PALETTES.map((palette) => {
          const isSelected = theme.palette.id === palette.id;
          return (
            <button
              key={palette.id}
              onClick={() => updatePalette(palette)}
              className={`relative p-3 rounded-lg border-2 transition-smooth hover:border-primary ${
                isSelected ? "border-primary bg-accent" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{palette.name}</span>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </div>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: palette.primary }}
                />
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: palette.secondary }}
                />
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: palette.accent }}
                />
                <div
                  className="w-8 h-8 rounded border border-border"
                  style={{ backgroundColor: palette.background }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
