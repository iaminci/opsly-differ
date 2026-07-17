import {
  defaultDarkThemeStyles,
  defaultLightThemeStyles,
  type ThemeState,
} from "../config/theme";
import { defaultPresets } from "../config/theme-presets";
import type { ThemeStyles } from "../types/theme";

function mergePresetWithDefaults(presetStyles: {
  light?: Record<string, string>;
  dark?: Record<string, string>;
}): ThemeState["styles"] {
  return {
    light: {
      ...defaultLightThemeStyles,
      ...(presetStyles.light ?? {}),
    },
    dark: {
      ...defaultDarkThemeStyles,
      ...(presetStyles.light ?? {}),
      ...(presetStyles.dark ?? {}),
    },
  };
}

export function getPresetThemeStyles(presetId: string): ThemeState["styles"] {
  if (presetId === "default") {
    return {
      light: defaultLightThemeStyles,
      dark: defaultDarkThemeStyles,
    };
  }

  const preset = defaultPresets[presetId];
  if (!preset) {
    return {
      light: defaultLightThemeStyles,
      dark: defaultDarkThemeStyles,
    };
  }

  return mergePresetWithDefaults(preset.styles);
}

export function getPresetLabel(presetId: string): string {
  if (presetId === "default") return "Default";
  return defaultPresets[presetId]?.label ?? presetId.replace(/-/g, " ");
}

export const PRESET_IDS = ["default", ...Object.keys(defaultPresets)] as const;

export type PresetId = (typeof PRESET_IDS)[number];

export function listPresets(): { id: string; label: string; primary: string }[] {
  return PRESET_IDS.map((id) => {
    const styles = getPresetThemeStyles(id);
    return {
      id,
      label: getPresetLabel(id),
      primary: styles.light.primary,
    };
  });
}

export function resolveThemeState(
  presetId: string,
  mode: ThemeState["currentMode"]
): ThemeState {
  return {
    preset: presetId,
    currentMode: mode,
    styles: getPresetThemeStyles(presetId),
  };
}

export type { ThemeStyles };
