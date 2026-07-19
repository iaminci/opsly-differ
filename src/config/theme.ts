import {
  DEFAULT_ACCENT_ID,
  getAccentOption,
  normalizeAccentId,
  type AccentId,
} from "./accent-options";
import { readPersistedTheme } from "../lib/theme-storage";

export type ThemeMode = "light" | "dark";

export type ThemeStyles = Record<string, string>;

export interface ThemeState {
  accent: AccentId;
  currentMode: ThemeMode;
  styles: {
    light: ThemeStyles;
    dark: ThemeStyles;
  };
}

export const COMMON_STYLES = [
  "font-sans",
  "font-mono",
  "radius",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
  "letter-spacing",
] as const;

const baseLightThemeStyles: ThemeStyles = {
  background: "#fcfcfc",
  foreground: "#171717",
  card: "#fcfcfc",
  "card-foreground": "#171717",
  popover: "#fcfcfc",
  "popover-foreground": "#525252",
  secondary: "#fdfdfd",
  "secondary-foreground": "#171717",
  muted: "#ededed",
  "muted-foreground": "#202020",
  accent: "#ededed",
  "accent-foreground": "#202020",
  destructive: "#ca3214",
  "destructive-foreground": "#fffcfc",
  border: "#dfdfdf",
  input: "#f6f6f6",
  "chart-2": "#3b82f6",
  "chart-3": "#8b5cf6",
  "chart-4": "#f59e0b",
  "chart-5": "#10b981",
  sidebar: "#fcfcfc",
  "sidebar-foreground": "#707070",
  "sidebar-accent": "#ededed",
  "sidebar-accent-foreground": "#202020",
  "sidebar-border": "#dfdfdf",
  "font-sans": "Inter, sans-serif",
  "font-mono": "JetBrains Mono, monospace",
  radius: "0.5rem",
  "shadow-color": "#000000",
  "shadow-opacity": "0.17",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "1px",
  "letter-spacing": "0.025em",
};

const baseDarkThemeStyles: ThemeStyles = {
  background: "#121212",
  foreground: "#e2e8f0",
  card: "#171717",
  "card-foreground": "#e2e8f0",
  popover: "#242424",
  "popover-foreground": "#a9a9a9",
  secondary: "#242424",
  "secondary-foreground": "#fafafa",
  muted: "#1f1f1f",
  "muted-foreground": "#a2a2a2",
  accent: "#313131",
  "accent-foreground": "#fafafa",
  destructive: "#541c15",
  "destructive-foreground": "#ede9e8",
  border: "#292929",
  input: "#242424",
  "chart-2": "#60a5fa",
  "chart-3": "#a78bfa",
  "chart-4": "#fbbf24",
  "chart-5": "#2dd4bf",
  sidebar: "#121212",
  "sidebar-foreground": "#898989",
  "sidebar-accent": "#313131",
  "sidebar-accent-foreground": "#fafafa",
  "sidebar-border": "#292929",
  "font-sans": "Inter, sans-serif",
  "font-mono": "JetBrains Mono, monospace",
  radius: "0.5rem",
  "shadow-color": "#000000",
  "shadow-opacity": "0.17",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "1px",
  "letter-spacing": "0.025em",
};

export function buildThemeStyles(accentId: string): ThemeState["styles"] {
  const accent = getAccentOption(accentId);

  return {
    light: {
      ...baseLightThemeStyles,
      ...accent.light,
    },
    dark: {
      ...baseDarkThemeStyles,
      ...accent.dark,
    },
  };
}

export function getSystemThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getInitialThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = readPersistedTheme()?.mode;
  if (stored) return stored;
  return getSystemThemeMode();
}

export function getInitialAccent(): AccentId {
  if (typeof window === "undefined") return DEFAULT_ACCENT_ID;
  const stored = readPersistedTheme()?.accent;
  return stored ? normalizeAccentId(stored) : DEFAULT_ACCENT_ID;
}

export function createThemeState(accent: AccentId, currentMode: ThemeMode): ThemeState {
  return {
    accent,
    currentMode,
    styles: buildThemeStyles(accent),
  };
}

export const defaultThemeState: ThemeState = createThemeState(
  DEFAULT_ACCENT_ID,
  "light"
);
