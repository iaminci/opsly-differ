import { FIRA_CODE_FONT, type ThemeState } from "../config/theme";
import { applyStyleToElement } from "./apply-style-to-element";
import {
  applyCommonStyles,
  applyThemeColors,
  setShadowVariables,
} from "./shadows";

export function applyThemeToElement(themeState: ThemeState, root: HTMLElement) {
  const { currentMode: mode } = themeState;

  root.classList.toggle("dark", mode === "dark");

  applyCommonStyles(root, {
    ...themeState.styles.light,
    "font-mono": FIRA_CODE_FONT,
  });

  applyThemeColors(root, themeState);
  applyStyleToElement(root, "font-mono", FIRA_CODE_FONT);
  setShadowVariables(themeState);
}
