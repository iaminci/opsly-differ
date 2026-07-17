export interface ParsedEnv {
  entries: Map<string, string>;
  duplicates: string[];
}

export function parseEnv(input: string, trimWhitespace: boolean): ParsedEnv {
  const entries = new Map<string, string>();
  const seen = new Map<string, number>();
  const duplicates: string[] = [];

  for (const line of input.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    let key = trimmed.slice(0, eqIndex);
    let value = trimmed.slice(eqIndex + 1);

    if (trimWhitespace) {
      key = key.trim();
      value = value.trim();
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (seen.has(key)) {
      duplicates.push(key);
    }
    seen.set(key, (seen.get(key) ?? 0) + 1);
    entries.set(key, value);
  }

  return { entries, duplicates };
}

export function envToFlatMap(
  input: string,
  trimWhitespace: boolean
): { map: Map<string, string>; warnings: string[] } {
  const { entries, duplicates } = parseEnv(input, trimWhitespace);
  const warnings = duplicates.map(
    (key) => `Duplicate key "${key}" — using last value`
  );
  return { map: entries, warnings };
}
