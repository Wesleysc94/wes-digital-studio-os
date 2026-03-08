import { Check } from "lucide-react";

import { themeOptions, useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5">
      <div className="space-y-1">
        <p className="text-sm font-medium text-white">Tema visual</p>
        <p className="text-xs leading-5 text-white/45">Troque a atmosfera do painel sem recarregar a aplicacao.</p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {themeOptions.map((option) => {
          const isActive = option.value === theme;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={cn(
                "group flex items-center gap-3 rounded-[22px] border px-3 py-3 text-left transition-all duration-200",
                isActive
                  ? "border-accent/50 bg-accent/12 text-white shadow-[0_16px_40px_-24px_hsl(var(--accent))]"
                  : "border-white/10 bg-slate-950/30 text-white/80 hover:border-white/20 hover:bg-white/[0.05]",
              )}
            >
              <span className={cn("h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br", option.preview)} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="font-medium text-current">{option.label}</span>
                  <Check
                    className={cn(
                      "h-4 w-4 transition-opacity duration-200",
                      isActive ? "opacity-100 text-accent" : "opacity-0 text-white/35 group-hover:opacity-100",
                    )}
                  />
                </span>
                <span className="mt-1 block text-xs leading-5 text-white/48">{option.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
