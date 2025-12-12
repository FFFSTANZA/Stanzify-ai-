import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemePicker } from "@/components/customization/ThemePicker";
import { FontPicker } from "@/components/customization/FontPicker";
import { StyleSelector } from "@/components/customization/StyleSelector";
import { useTheme } from "@/hooks/use-theme";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function CustomizationSidebar() {
  const { resetTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 right-4 z-50 shadow-elegant">
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full xl:w-[400px] p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span>Customize Presentation</span>
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-6">
            <ThemePicker />
            <Separator />
            <FontPicker />
            <Separator />
            <StyleSelector />
          </div>
        </ScrollArea>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <Button variant="outline" onClick={resetTheme} className="w-full">
            Reset to Default
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
