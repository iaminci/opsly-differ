import type { CompareMode } from "./types";
import { envToFlatMap } from "./compare/env";
import { extractConfigMapData } from "./compare/configmap";
import { parseJson, parseYaml } from "./compare/parse";
import { flattenToMap } from "./compare/deepDiff";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getInputStats(mode: CompareMode, value: string): {
  keys: number;
  bytes: number;
} {
  const bytes = new TextEncoder().encode(value).length;
  if (!value.trim()) {
    return { keys: 0, bytes };
  }

  try {
    switch (mode) {
      case "env": {
        const { map } = envToFlatMap(value, false);
        return { keys: map.size, bytes };
      }
      case "configmap": {
        const { map, errors } = extractConfigMapData(value);
        if (errors.length > 0) return { keys: 0, bytes };
        return { keys: map.size, bytes };
      }
      case "yaml": {
        const parsed = parseYaml(value);
        if (parsed.errors.length > 0 || parsed.value === null) {
          return { keys: 0, bytes };
        }
        return { keys: flattenToMap(parsed.value, false).size, bytes };
      }
      case "json": {
        const parsed = parseJson(value);
        if (parsed.errors.length > 0 || parsed.value === null) {
          return { keys: 0, bytes };
        }
        return { keys: flattenToMap(parsed.value, false).size, bytes };
      }
    }
  } catch {
    return { keys: 0, bytes };
  }
}
