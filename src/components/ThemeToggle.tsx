import { Gem, MoonStar, SunMedium, Waves, type LucideIcon } from "lucide-react";

import { themeOptions, useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  variant?: "header" | "panel";
};

const themeIcons: Record<(typeof themeOptions)[number]["value"], LucideIcon> = {
  dark: MoonStar,
  light: SunMedium,
  ruby: Gem,
  gold: Waves,
};

export const ThemeToggle = ({ variant = "panel" }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const activeTheme = themeOptions.find((option) => option.value === theme) ?? themeOptions[0];

  if (variant === "header") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card/92 px-2 py-1.5 shadow-[0_12px_34px_-24px_hsl(var(--shadow-color)/0.25)]">
        <span className="hidden pl-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground lg:block">
          Tema
        </span>
        <div className="flex items-center gap-1">
          {themeOptions.map((option) => {
            const Icon = themeIcons[option.value];
            const isActive = option.value === theme;

            return (
              <button
                key={option.value}
                type="button"
                aria-label={`Trocar para o tema ${option.label}`}
                title={option.label}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-150 ease-out",
                  isActive
                    ? "border-accent/40 bg-accent text-accent-foreground shadow-[0_10px_22px_-16px_hsl(var(--accent))]"
                    : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
        <span className="hidden pr-2 text-xs font-medium text-foreground sm:block">{activeTheme.label}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-[24px] border border-border/80 bg-card/96 p-5 shadow-[0_20px_48px_-36px_hsl(var(--shadow-color)/0.25)]">
      <div>
        <p className="eyebrow-label">Tema visual</p>
        <h3 className="mt-3 text-xl font-semibold text-foreground">Escolha a leitura mais confortavel</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          O tema deve ajudar a operar melhor. Troque a atmosfera sem perder contraste, ritmo ou clareza.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {themeOptions.map((option) => {
          const isActive = option.value === theme;
          const Icon = themeIcons[option.value];

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={cn(
                "group rounded-[20px] border p-4 text-left transition-all duration-150 ease-out",
                isActive
                  ? "border-accent/28 bg-accent/10 shadow-[0_16px_36px_-26px_hsl(var(--accent))]"
                  : "border-border/80 bg-secondary/35 hover:border-accent/18 hover:bg-secondary/55",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br", option.preview)}>
                  <Icon className="h-4 w-4 text-slate-950" />
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
                    isActive ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {isActive ? "Ativo" : "Tema"}
                </span>
              </div>

              <p className="mt-4 text-base font-semibold text-foreground">{option.label}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
