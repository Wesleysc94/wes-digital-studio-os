import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "dark" | "light" | "ruby" | "aura";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const themeOptions: Array<{
  value: Theme;
  label: string;
  description: string;
  preview: string;
}> = [
  {
    value: "dark",
    label: "Midnight",
    description: "Contraste alto para foco continuo e leitura noturna.",
    preview: "from-cyan-400 via-slate-500 to-slate-950",
  },
  {
    value: "light",
    label: "Paper",
    description: "Tema claro para operacao diurna, tabelas e leitura longa.",
    preview: "from-sky-200 via-white to-slate-200",
  },
  {
    value: "ruby",
    label: "Ruby",
    description: "Tom editorial com energia comercial e contraste equilibrado.",
    preview: "from-rose-400 via-fuchsia-600 to-zinc-950",
  },
  {
    value: "aura",
    label: "Aura",
    description: "Paleta ambar da identidade principal para demonstracao e apresentacao premium.",
    preview: "from-amber-300 via-amber-500 to-zinc-950",
  },
];

const STORAGE_KEY = "wes-digital-studio-os-theme";

function normalizeTheme(theme: string | null | undefined): Theme {
  if (theme === "dark" || theme === "light" || theme === "ruby" || theme === "aura") {
    return theme;
  }

  if (theme === "gold") {
    return "aura";
  }

  return "light";
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, defaultTheme = "light", ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    return storedTheme ? normalizeTheme(storedTheme) : defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const normalizedTheme = normalizeTheme(theme);
    root.setAttribute("data-theme", normalizedTheme);
    localStorage.setItem(STORAGE_KEY, normalizedTheme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme],
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
