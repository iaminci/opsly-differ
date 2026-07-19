import type { ThemeState } from "../config/theme";
import {
  applyCommonStyles,
  applyThemeColors,
  setShadowVariables,
} from "./shadows";

export function applyThemeToElement(themeState: ThemeState, root: HTMLElement) {
  const { currentMode: mode } = themeState;

  root.classList.toggle("dark", mode === "dark");

  applyCommonStyles(root, themeState.styles.light);
  applyThemeColors(root, themeState);
  setShadowVariables(themeState);
}
