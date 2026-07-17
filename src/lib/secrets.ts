const SECRET_PATTERNS = [
  /secret/i,
  /password/i,
  /passwd/i,
  /token/i,
  /api[_-]?key/i,
  /private/i,
  /credential/i,
  /auth/i,
];

export function isSecretKey(key: string): boolean {
  return SECRET_PATTERNS.some((pattern) => pattern.test(key));
}

export function maskValue(value: string): string {
  if (value.length <= 4) return "••••";
  return value.slice(0, 2) + "••••" + value.slice(-2);
}

export function displayValue(
  key: string,
  value: string | undefined,
  maskSecrets: boolean,
  revealed: boolean
): string {
  if (value === undefined) return "";
  if (!maskSecrets || revealed || !isSecretKey(key)) return value;
  return maskValue(value);
}
