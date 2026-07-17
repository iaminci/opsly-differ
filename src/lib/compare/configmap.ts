import yaml from "js-yaml";

export function extractConfigMapData(
  input: string
): { map: Map<string, string>; errors: string[] } {
  const errors: string[] = [];
  const map = new Map<string, string>();

  try {
    const doc = yaml.load(input) as Record<string, unknown> | null;
    if (!doc || typeof doc !== "object") {
      errors.push("Invalid ConfigMap: expected a YAML object");
      return { map, errors };
    }

    const data = doc.data as Record<string, unknown> | undefined;
    if (!data || typeof data !== "object") {
      errors.push("No data: block found in ConfigMap");
      return { map, errors };
    }

    for (const [key, value] of Object.entries(data)) {
      map.set(key, stringifyValue(value));
    }
  } catch (e) {
    errors.push(`YAML parse error: ${(e as Error).message}`);
  }

  return { map, errors };
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}
