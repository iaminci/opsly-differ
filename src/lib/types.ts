export type CompareMode = "env" | "configmap" | "yaml" | "json";

export type DiffBucket = "onlyA" | "onlyB" | "changed" | "same";

export interface DiffEntry {
  key: string;
  valueA?: string;
  valueB?: string;
}

export interface CompareResult {
  onlyA: DiffEntry[];
  onlyB: DiffEntry[];
  changed: DiffEntry[];
  same: DiffEntry[];
  warnings: string[];
  errors: string[];
}

export interface CompareOptions {
  maskSecrets: boolean;
  trimWhitespace: boolean;
  matchListByName: boolean;
}

export const DEFAULT_OPTIONS: CompareOptions = {
  maskSecrets: true,
  trimWhitespace: true,
  matchListByName: false,
};

export interface ModeInfo {
  id: CompareMode;
  label: string;
  description: string;
  placeholder: string;
}

export const MODES: ModeInfo[] = [
  {
    id: "env",
    label: ".env",
    description:
      "Diff two .env files key-by-key. Order-insensitive. Duplicate keys keep the last value.",
    placeholder: "DATABASE_URL=postgres://localhost/dev\nAPI_KEY=dev-key\nDEBUG=true",
  },
  {
    id: "configmap",
    label: "ConfigMap",
    description:
      "Paste two Kubernetes ConfigMap YAML manifests. Diffs only the data: entries.",
    placeholder: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: info
  FEATURE_X: "true"`,
  },
  {
    id: "yaml",
    label: "YAML",
    description:
      "Deep-diff two YAML documents at the keypath level (e.g. server.host).",
    placeholder: `server:
  host: localhost
  port: 8080
features:
  - name: auth
    enabled: true`,
  },
  {
    id: "json",
    label: "JSON",
    description:
      "Deep-diff two JSON objects. Useful for config snapshots and feature flags.",
    placeholder: `{
  "server": { "host": "localhost", "port": 8080 },
  "features": { "auth": true }
}`,
  },
];
