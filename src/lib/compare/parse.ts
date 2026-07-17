import yaml from "js-yaml";

export function parseYaml(input: string): {
  value: unknown;
  errors: string[];
} {
  try {
    const value = yaml.load(input);
    if (value === undefined || value === null) {
      return { value: {}, errors: [] };
    }
    if (typeof value !== "object") {
      return { value: {}, errors: ["YAML root must be an object or array"] };
    }
    return { value, errors: [] };
  } catch (e) {
    return { value: null, errors: [`YAML parse error: ${(e as Error).message}`] };
  }
}

export function parseJson(input: string): {
  value: unknown;
  errors: string[];
} {
  try {
    const value = JSON.parse(input);
    if (typeof value !== "object" || value === null) {
      return { value: {}, errors: ["JSON root must be an object or array"] };
    }
    return { value, errors: [] };
  } catch (e) {
    return { value: null, errors: [`JSON parse error: ${(e as Error).message}`] };
  }
}
