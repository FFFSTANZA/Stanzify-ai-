import { Check } from "lucide-react";
import { FONT_PAIRINGS } from "@/types/theme";
import { useTheme } from "@/hooks/use-theme";
import { Label } from "@/components/ui/label";

export function FontPicker() {
  const { theme, updateFonts } = useTheme();

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Font Pairing</Label>
      <div className="grid grid-cols-1 gap-3">
        {FONT_PAIRINGS.map((fonts) => {
          const isSelected = theme.fonts.id === fonts.id;
          return (
            <button
              key={fonts.id}
              onClick={() => updateFonts(fonts)}
              className={`relative p-3 rounded-lg border-2 transition-smooth hover:border-primary text-left ${
                isSelected ? "border-primary bg-accent" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{fonts.name}</span>
                {isSelected && <Check className="w-4 h-4 text-primary" />}
              </div>
              <div className="space-y-1">
                <div
                  className="text-lg font-semibold"
                  style={{ fontFamily: fonts.heading }}
                >
                  Heading Style
                </div>
                <div className="text-sm text-muted-foreground" style={{ fontFamily: fonts.body }}>
                  Body text style
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
