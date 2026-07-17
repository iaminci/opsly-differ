type FlatMap = Map<string, string>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringifyLeaf(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix: string,
  result: FlatMap
): void {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) {
      flattenObject(value, path, result);
    } else if (Array.isArray(value)) {
      flattenArray(value, path, result, false);
    } else {
      result.set(path, stringifyLeaf(value));
    }
  }
}

function flattenArray(
  arr: unknown[],
  prefix: string,
  result: FlatMap,
  matchByName: boolean,
  nameField = "name"
): void {
  if (matchByName && arr.every(isNamedItem(nameField))) {
    for (const item of arr) {
      const named = item as Record<string, unknown>;
      const name = String(named[nameField]);
      const itemPath = `${prefix}[${name}]`;
      if (isPlainObject(named)) {
        for (const [key, value] of Object.entries(named)) {
          if (key === nameField) continue;
          const path = `${itemPath}.${key}`;
          if (isPlainObject(value)) {
            flattenObject(value, path, result);
          } else if (Array.isArray(value)) {
            flattenArray(value, path, result, matchByName, nameField);
          } else {
            result.set(path, stringifyLeaf(value));
          }
        }
      }
    }
    return;
  }

  arr.forEach((item, index) => {
    const path = `${prefix}[${index}]`;
    if (isPlainObject(item)) {
      flattenObject(item, path, result);
    } else if (Array.isArray(item)) {
      flattenArray(item, path, result, matchByName, nameField);
    } else {
      result.set(path, stringifyLeaf(item));
    }
  });
}

function isNamedItem(nameField: string) {
  return (item: unknown): boolean =>
    isPlainObject(item) && nameField in item && item[nameField] != null;
}

export function flattenToMap(
  value: unknown,
  matchListByName: boolean
): FlatMap {
  const result: FlatMap = new Map();

  if (value === null || value === undefined) return result;

  if (Array.isArray(value)) {
    flattenArray(value, "", result, matchListByName);
  } else if (isPlainObject(value)) {
    flattenObject(value, "", result);
  } else {
    result.set("", stringifyLeaf(value));
  }

  return result;
}

export function compareFlatMaps(
  mapA: FlatMap,
  mapB: FlatMap
): {
  onlyA: { key: string; valueA: string }[];
  onlyB: { key: string; valueB: string }[];
  changed: { key: string; valueA: string; valueB: string }[];
  same: { key: string; valueA: string; valueB: string }[];
} {
  const onlyA: { key: string; valueA: string }[] = [];
  const onlyB: { key: string; valueB: string }[] = [];
  const changed: { key: string; valueA: string; valueB: string }[] = [];
  const same: { key: string; valueA: string; valueB: string }[] = [];

  const allKeys = new Set([...mapA.keys(), ...mapB.keys()]);
  const sortedKeys = [...allKeys].sort();

  for (const key of sortedKeys) {
    const inA = mapA.has(key);
    const inB = mapB.has(key);

    if (inA && !inB) {
      onlyA.push({ key, valueA: mapA.get(key)! });
    } else if (!inA && inB) {
      onlyB.push({ key, valueB: mapB.get(key)! });
    } else if (inA && inB) {
      const valueA = mapA.get(key)!;
      const valueB = mapB.get(key)!;
      if (valueA === valueB) {
        same.push({ key, valueA, valueB });
      } else {
        changed.push({ key, valueA, valueB });
      }
    }
  }

  return { onlyA, onlyB, changed, same };
}
