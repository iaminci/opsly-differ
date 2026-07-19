import * as culori from "culori";

type ColorFormat = "hsl" | "rgb" | "oklch" | "hex";

const formatNumber = (num?: number) => {
  if (num === undefined || num === null) return "0";
  return num % 1 === 0 ? String(num) : num.toFixed(4);
};

const formatHsl = (hsl: culori.Hsl) =>
  `hsl(${formatNumber(hsl.h)} ${formatNumber((hsl.s ?? 0) * 100)}% ${formatNumber((hsl.l ?? 0) * 100)}%)`;

export function colorFormatter(
  colorValue: string,
  format: ColorFormat = "hsl",
  tailwindVersion: "3" | "4" = "4"
): string {
  try {
    const color = culori.parse(colorValue);
    if (!color) return colorValue;

    switch (format) {
      case "hsl": {
        const hsl = culori.converter("hsl")(color);
        if (!hsl) return colorValue;
        if (tailwindVersion === "4") return formatHsl(hsl);
        return `${formatNumber(hsl.h)} ${formatNumber((hsl.s ?? 0) * 100)}% ${formatNumber((hsl.l ?? 0) * 100)}%`;
      }
      case "rgb":
        return culori.formatRgb(color);
      case "oklch": {
        const oklch = culori.converter("oklch")(color);
        if (!oklch) return colorValue;
        return `oklch(${formatNumber(oklch.l)} ${formatNumber(oklch.c)} ${formatNumber(oklch.h)})`;
      }
      case "hex":
        return culori.formatHex(color);
      default:
        return colorValue;
    }
  } catch {
    return colorValue;
  }
}

export function isColorKey(key: string): boolean {
  return ![
    "font-sans",
    "font-mono",
    "radius",
    "shadow-opacity",
    "shadow-blur",
    "shadow-spread",
    "shadow-offset-x",
    "shadow-offset-y",
    "letter-spacing",
  ].includes(key);
}
