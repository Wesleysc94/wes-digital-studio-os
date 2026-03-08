import { Check } from "lucide-react";

import { themeOptions, useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Tema visual</p>
        <p className="text-xs text-muted-foreground">Alterne entre as atmosferas do sistema sem recarregar a aplicacao.</p>
      </div>

      <div className="grid gap-2">
        {themeOptions.map((option) => {
          const isActive = option.value === theme;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-300",
                isActive
                  ? "border-accent bg-accent/10 shadow-[0_12px_40px_-18px_hsl(var(--accent))]"
                  : "border-border/60 bg-card/70 hover:border-accent/40 hover:bg-card",
              )}
            >
              <span className={cn("h-10 w-10 rounded-xl bg-gradient-to-br", option.preview)} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="font-medium text-foreground">{option.label}</span>
                  <Check
                    className={cn(
                      "h-4 w-4 transition-opacity duration-200",
                      isActive ? "opacity-100 text-accent" : "opacity-0 group-hover:opacity-40",
                    )}
                  />
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{option.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
