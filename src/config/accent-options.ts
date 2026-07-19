export type AccentId = "green" | "blue" | "violet" | "rose" | "amber" | "teal";

export type AccentTokens = {
  primary: string;
  "primary-foreground": string;
  ring: string;
  "chart-1": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-ring": string;
};

export type AccentOption = {
  id: AccentId;
  label: string;
  swatch: string;
  light: AccentTokens;
  dark: AccentTokens;
};

export const DEFAULT_ACCENT_ID: AccentId = "green";

export const accentOptions: AccentOption[] = [
  {
    id: "green",
    label: "Green",
    swatch: "#72e3ad",
    light: {
      primary: "#72e3ad",
      "primary-foreground": "#1e2723",
      ring: "#72e3ad",
      "chart-1": "#72e3ad",
      "sidebar-primary": "#72e3ad",
      "sidebar-primary-foreground": "#1e2723",
      "sidebar-ring": "#72e3ad",
    },
    dark: {
      primary: "#006239",
      "primary-foreground": "#dde8e3",
      ring: "#4ade80",
      "chart-1": "#4ade80",
      "sidebar-primary": "#006239",
      "sidebar-primary-foreground": "#dde8e3",
      "sidebar-ring": "#4ade80",
    },
  },
  {
    id: "blue",
    label: "Blue",
    swatch: "#3b82f6",
    light: {
      primary: "#3b82f6",
      "primary-foreground": "#ffffff",
      ring: "#3b82f6",
      "chart-1": "#3b82f6",
      "sidebar-primary": "#3b82f6",
      "sidebar-primary-foreground": "#ffffff",
      "sidebar-ring": "#3b82f6",
    },
    dark: {
      primary: "#2563eb",
      "primary-foreground": "#eff6ff",
      ring: "#60a5fa",
      "chart-1": "#60a5fa",
      "sidebar-primary": "#2563eb",
      "sidebar-primary-foreground": "#eff6ff",
      "sidebar-ring": "#60a5fa",
    },
  },
  {
    id: "violet",
    label: "Violet",
    swatch: "#8b5cf6",
    light: {
      primary: "#8b5cf6",
      "primary-foreground": "#ffffff",
      ring: "#8b5cf6",
      "chart-1": "#8b5cf6",
      "sidebar-primary": "#8b5cf6",
      "sidebar-primary-foreground": "#ffffff",
      "sidebar-ring": "#8b5cf6",
    },
    dark: {
      primary: "#7c3aed",
      "primary-foreground": "#f5f3ff",
      ring: "#a78bfa",
      "chart-1": "#a78bfa",
      "sidebar-primary": "#7c3aed",
      "sidebar-primary-foreground": "#f5f3ff",
      "sidebar-ring": "#a78bfa",
    },
  },
  {
    id: "rose",
    label: "Rose",
    swatch: "#f43f5e",
    light: {
      primary: "#f43f5e",
      "primary-foreground": "#ffffff",
      ring: "#f43f5e",
      "chart-1": "#f43f5e",
      "sidebar-primary": "#f43f5e",
      "sidebar-primary-foreground": "#ffffff",
      "sidebar-ring": "#f43f5e",
    },
    dark: {
      primary: "#e11d48",
      "primary-foreground": "#fff1f2",
      ring: "#fb7185",
      "chart-1": "#fb7185",
      "sidebar-primary": "#e11d48",
      "sidebar-primary-foreground": "#fff1f2",
      "sidebar-ring": "#fb7185",
    },
  },
  {
    id: "amber",
    label: "Amber",
    swatch: "#f59e0b",
    light: {
      primary: "#f59e0b",
      "primary-foreground": "#451a03",
      ring: "#f59e0b",
      "chart-1": "#f59e0b",
      "sidebar-primary": "#f59e0b",
      "sidebar-primary-foreground": "#451a03",
      "sidebar-ring": "#f59e0b",
    },
    dark: {
      primary: "#d97706",
      "primary-foreground": "#fffbeb",
      ring: "#fbbf24",
      "chart-1": "#fbbf24",
      "sidebar-primary": "#d97706",
      "sidebar-primary-foreground": "#fffbeb",
      "sidebar-ring": "#fbbf24",
    },
  },
  {
    id: "teal",
    label: "Teal",
    swatch: "#14b8a6",
    light: {
      primary: "#14b8a6",
      "primary-foreground": "#ffffff",
      ring: "#14b8a6",
      "chart-1": "#14b8a6",
      "sidebar-primary": "#14b8a6",
      "sidebar-primary-foreground": "#ffffff",
      "sidebar-ring": "#14b8a6",
    },
    dark: {
      primary: "#0d9488",
      "primary-foreground": "#f0fdfa",
      ring: "#2dd4bf",
      "chart-1": "#2dd4bf",
      "sidebar-primary": "#0d9488",
      "sidebar-primary-foreground": "#f0fdfa",
      "sidebar-ring": "#2dd4bf",
    },
  },
];

export function getAccentOption(accentId: string): AccentOption {
  return (
    accentOptions.find((option) => option.id === accentId) ??
    accentOptions.find((option) => option.id === DEFAULT_ACCENT_ID)!
  );
}

export function normalizeAccentId(accentId: string): AccentId {
  return getAccentOption(accentId).id;
}
