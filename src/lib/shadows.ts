import { COMMON_STYLES, type ThemeState } from "../config/theme";
import { colorFormatter } from "./color-converter";
import { applyStyleToElement } from "./apply-style-to-element";

export function setShadowVariables(themeState: ThemeState) {
  const root = document.documentElement;
  const styles = {
    ...themeState.styles[themeState.currentMode],
  };

  const shadowColor = styles["shadow-color"] ?? "oklch(0 0 0)";
  const hsl = colorFormatter(shadowColor, "hsl", "3");
  const offsetX = styles["shadow-offset-x"] ?? "0";
  const offsetY = styles["shadow-offset-y"] ?? "1px";
  const blur = styles["shadow-blur"] ?? "3px";
  const spread = styles["shadow-spread"] ?? "0px";
  const opacity = parseFloat(styles["shadow-opacity"] ?? "0.1");

  const color = (opacityMultiplier: number) =>
    `hsl(${hsl} / ${(opacity * opacityMultiplier).toFixed(2)})`;

  const secondLayer = (fixedOffsetY: string, fixedBlur: string) => {
    const spread2 = `${parseFloat(spread.replace("px", "") || "0") - 1}px`;
    return `${offsetX} ${fixedOffsetY} ${fixedBlur} ${spread2} ${color(1)}`;
  };

  const shadows: Record<string, string> = {
    "shadow-2xs": `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`,
    "shadow-xs": `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`,
    "shadow-sm": `${offsetX} ${offsetY} ${blur} ${spread} ${color(1)}, ${secondLayer("1px", "2px")}`,
    shadow: `${offsetX} ${offsetY} ${blur} ${spread} ${color(1)}, ${secondLayer("1px", "2px")}`,
    "shadow-md": `${offsetX} ${offsetY} ${blur} ${spread} ${color(1)}, ${secondLayer("2px", "4px")}`,
    "shadow-lg": `${offsetX} ${offsetY} ${blur} ${spread} ${color(1)}, ${secondLayer("4px", "6px")}`,
    "shadow-xl": `${offsetX} ${offsetY} ${blur} ${spread} ${color(1)}, ${secondLayer("8px", "10px")}`,
    "shadow-2xl": `${offsetX} ${offsetY} ${blur} ${spread} ${color(2.5)}`,
  };

  for (const [name, value] of Object.entries(shadows)) {
    applyStyleToElement(root, name, value);
  }
}

export function applyCommonStyles(
  root: HTMLElement,
  themeStyles: ThemeState["styles"]["light"]
) {
  for (const key of COMMON_STYLES) {
    const value = themeStyles[key];
    if (value) applyStyleToElement(root, key, value);
  }
}

export function applyThemeColors(
  root: HTMLElement,
  themeState: ThemeState
) {
  const { currentMode: mode, styles } = themeState;
  const active = styles[mode];

  for (const [key, value] of Object.entries(active)) {
    if (
      typeof value === "string" &&
      !COMMON_STYLES.includes(key as (typeof COMMON_STYLES)[number])
    ) {
      applyStyleToElement(root, key, colorFormatter(value, "hsl", "4"));
    }
  }
}
