import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  accentOptions,
  type AccentId,
} from "../config/accent-options";
import {
  createThemeState,
  getInitialAccent,
  getInitialThemeMode,
  type ThemeMode,
  type ThemeState,
} from "../config/theme";
import { applyThemeToElement } from "../lib/apply-theme";
import { persistTheme, readPersistedTheme } from "../lib/theme-storage";

type Coords = { x: number; y: number };

interface ThemeContextValue {
  theme: ThemeMode;
  accent: AccentId;
  accentLabel: string;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accentId: AccentId) => void;
  toggleTheme: (coords?: Coords) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function loadInitialState(): ThemeState {
  const stored = readPersistedTheme();
  const accent = stored?.accent ?? getInitialAccent();
  const currentMode = stored?.mode ?? getInitialThemeMode();
  return createThemeState(accent, currentMode);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeState, setThemeState] = useState<ThemeState>(loadInitialState);

  useEffect(() => {
    applyThemeToElement(themeState, document.documentElement);
    persistTheme({
      accent: themeState.accent,
      mode: themeState.currentMode,
    });
  }, [themeState]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState((prev) => ({ ...prev, currentMode: mode }));
  }, []);

  const setAccent = useCallback((accentId: AccentId) => {
    setThemeState((prev) => createThemeState(accentId, prev.currentMode));
  }, []);

  const toggleTheme = useCallback((coords?: Coords) => {
    const root = document.documentElement;

    if (coords) {
      root.style.setProperty("--x", `${coords.x}px`);
      root.style.setProperty("--y", `${coords.y}px`);
    }

    const apply = () => {
      setThemeState((prev) => ({
        ...prev,
        currentMode: prev.currentMode === "light" ? "dark" : "light",
      }));
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (document.startViewTransition && !prefersReducedMotion) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }, []);

  const accentLabel =
    accentOptions.find((option) => option.id === themeState.accent)?.label ??
    themeState.accent;

  const value = useMemo(
    () => ({
      theme: themeState.currentMode,
      accent: themeState.accent,
      accentLabel,
      setTheme,
      setAccent,
      toggleTheme,
    }),
    [
      themeState.currentMode,
      themeState.accent,
      accentLabel,
      setTheme,
      setAccent,
      toggleTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
