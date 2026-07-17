# Opsly Differ — Compare Environments

A browser-based tool to diff configuration between two environments. Inspired by [Daily Developer Tools — Compare Environments](https://dailydevelopertools.com/compare-environments.html).

All processing runs locally in your browser. Nothing is uploaded.

## Supported modes

| Mode | Description |
|------|-------------|
| **.env** | Key-by-key diff of dotenv files. Order-insensitive; duplicate keys use the last value. |
| **ConfigMap** | Paste Kubernetes ConfigMap YAML manifests; diffs only the `data:` entries. |
| **YAML** | Deep diff at keypath level (`server.host`, `items[auth].enabled`). Optional match-by-`name` for lists. |
| **JSON** | Same deep-diff behavior as YAML mode for JSON objects. |

## Features

- Side-by-side editors with customizable environment labels
- Result buckets: only in A, only in B, changed, same
- Mask secrets (keys matching `PASSWORD`, `API_KEY`, `TOKEN`, `SECRET`, etc.)
- Trim whitespace, match YAML/JSON list items by `name`
- Load files, try samples, swap A ↔ B, copy/download per bucket

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
pnpm build
pnpm preview
```

## License

MIT
