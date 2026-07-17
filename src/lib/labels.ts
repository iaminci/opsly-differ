export function displayLabel(label: string, side: "A" | "B"): string {
  const trimmed = label.trim();
  return trimmed || `Environment ${side}`;
}
