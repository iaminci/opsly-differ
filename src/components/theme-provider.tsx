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
  getInitialPreset,
  getInitialThemeMode,
  type ThemeMode,
  type ThemeState,
} from "../config/theme";
import { applyThemeToElement } from "../lib/apply-theme";
import { persistTheme, readPersistedTheme } from "../lib/theme-storage";
import {
  getPresetLabel,
  getPresetThemeStyles,
  resolveThemeState,
} from "../lib/theme-preset-helper";

type Coords = { x: number; y: number };

interface ThemeContextValue {
  theme: ThemeMode;
  preset: string;
  presetLabel: string;
  setTheme: (theme: ThemeMode) => void;
  setPreset: (presetId: string) => void;
  toggleTheme: (coords?: Coords) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function loadInitialState(): ThemeState {
  const stored = readPersistedTheme();
  if (stored?.styles) {
    return {
      preset: stored.preset ?? "default",
      currentMode: stored.mode,
      styles: stored.styles,
    };
  }

  const preset = stored?.preset ?? getInitialPreset();
  const mode = stored?.mode ?? getInitialThemeMode();
  return resolveThemeState(preset, mode);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeState, setThemeState] = useState<ThemeState>(loadInitialState);

  useEffect(() => {
    applyThemeToElement(themeState, document.documentElement);
    persistTheme({
      mode: themeState.currentMode,
      preset: themeState.preset,
      styles: themeState.styles,
    });
  }, [themeState]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState((prev) => ({ ...prev, currentMode: mode }));
  }, []);

  const setPreset = useCallback((presetId: string) => {
    setThemeState((prev) => ({
      ...prev,
      preset: presetId,
      styles: getPresetThemeStyles(presetId),
    }));
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

  const value = useMemo(
    () => ({
      theme: themeState.currentMode,
      preset: themeState.preset,
      presetLabel: getPresetLabel(themeState.preset),
      setTheme,
      setPreset,
      toggleTheme,
    }),
    [themeState.currentMode, themeState.preset, setTheme, setPreset, toggleTheme]
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
