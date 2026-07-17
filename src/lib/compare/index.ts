import type { CompareMode, CompareOptions, CompareResult } from "../types";
import { envToFlatMap } from "./env";
import { extractConfigMapData } from "./configmap";
import { parseYaml, parseJson } from "./parse";
import { flattenToMap, compareFlatMaps } from "./deepDiff";

export function compareEnvironments(
  mode: CompareMode,
  inputA: string,
  inputB: string,
  options: CompareOptions
): CompareResult {
  const result: CompareResult = {
    onlyA: [],
    onlyB: [],
    changed: [],
    same: [],
    warnings: [],
    errors: [],
  };

  if (!inputA.trim() && !inputB.trim()) {
    result.errors.push("Both environments are empty");
    return result;
  }

  switch (mode) {
    case "env": {
      const a = envToFlatMap(inputA, options.trimWhitespace);
      const b = envToFlatMap(inputB, options.trimWhitespace);
      result.warnings.push(...a.warnings, ...b.warnings);
      applyFlatDiff(result, a.map, b.map);
      break;
    }
    case "configmap": {
      const a = extractConfigMapData(inputA);
      const b = extractConfigMapData(inputB);
      result.errors.push(...a.errors, ...b.errors);
      if (result.errors.length === 0) {
        applyFlatDiff(result, a.map, b.map);
      }
      break;
    }
    case "yaml": {
      const a = parseYaml(inputA);
      const b = parseYaml(inputB);
      result.errors.push(...a.errors, ...b.errors);
      if (result.errors.length === 0 && a.value !== null && b.value !== null) {
        const mapA = flattenToMap(a.value, options.matchListByName);
        const mapB = flattenToMap(b.value, options.matchListByName);
        applyFlatDiff(result, mapA, mapB);
      }
      break;
    }
    case "json": {
      const a = parseJson(inputA);
      const b = parseJson(inputB);
      result.errors.push(...a.errors, ...b.errors);
      if (result.errors.length === 0 && a.value !== null && b.value !== null) {
        const mapA = flattenToMap(a.value, options.matchListByName);
        const mapB = flattenToMap(b.value, options.matchListByName);
        applyFlatDiff(result, mapA, mapB);
      }
      break;
    }
  }

  return result;
}

function applyFlatDiff(
  result: CompareResult,
  mapA: Map<string, string>,
  mapB: Map<string, string>
): void {
  const diff = compareFlatMaps(mapA, mapB);
  result.onlyA = diff.onlyA.map((e) => ({ key: e.key, valueA: e.valueA }));
  result.onlyB = diff.onlyB.map((e) => ({ key: e.key, valueB: e.valueB }));
  result.changed = diff.changed;
  result.same = diff.same;
}
