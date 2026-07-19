import {
  normalizeAccentId,
  type AccentId,
} from "../config/accent-options";
import type { ThemeMode } from "../config/theme";

export const THEME_STORAGE_KEY = "differ-theme";

export interface PersistedTheme {
  accent: AccentId;
  mode: ThemeMode;
}

export function persistTheme(state: PersistedTheme) {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
}

export function readPersistedTheme(): PersistedTheme | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { accent?: unknown; mode?: unknown };
    const mode =
      parsed.mode === "light" || parsed.mode === "dark" ? parsed.mode : null;

    if (typeof parsed.accent === "string") {
      return {
        accent: normalizeAccentId(parsed.accent),
        mode: mode ?? "light",
      };
    }

    if (mode) {
      return { accent: normalizeAccentId("green"), mode };
    }

    return null;
  } catch {
    const legacy = localStorage.getItem(THEME_STORAGE_KEY);
    if (legacy === "light" || legacy === "dark") {
      return { accent: normalizeAccentId("green"), mode: legacy };
    }
    return null;
  }
}
