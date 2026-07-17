export const THEME_STORAGE_KEY = "differ-theme";

export interface PersistedTheme {
  mode: "light" | "dark";
  preset: string;
  styles?: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export function persistTheme(state: PersistedTheme) {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
}

export function readPersistedTheme(): PersistedTheme | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedTheme;
    if (parsed.mode !== "light" && parsed.mode !== "dark") return null;
    return parsed;
  } catch {
    const legacy = localStorage.getItem(THEME_STORAGE_KEY);
    if (legacy === "light" || legacy === "dark") {
      return { mode: legacy, preset: "default" };
    }
    return null;
  }
}
