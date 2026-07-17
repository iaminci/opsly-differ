import type { CompareOptions } from "../lib/types";
import type { CompareMode } from "../lib/types";
import { Button } from "./ui/button";

interface OptionsBarProps {
  mode: CompareMode;
  options: CompareOptions;
  onChange: (options: CompareOptions) => void;
  onCompare: () => void;
  onSwap: () => void;
  onClear: () => void;
}

export default function OptionsBar({
  mode,
  options,
  onChange,
  onCompare,
  onSwap,
  onClear,
}: OptionsBarProps) {
  const showMatchByName = mode === "yaml" || mode === "json";

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-card px-4 py-3 shadow-xs">
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={options.maskSecrets}
          onChange={(e) =>
            onChange({ ...options, maskSecrets: e.target.checked })
          }
          className="h-4 w-4 rounded border-input accent-primary"
        />
        Mask secrets
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={options.trimWhitespace}
          onChange={(e) =>
            onChange({ ...options, trimWhitespace: e.target.checked })
          }
          className="h-4 w-4 rounded border-input accent-primary"
        />
        Trim whitespace
      </label>

      {showMatchByName && (
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={options.matchListByName}
            onChange={(e) =>
              onChange({ ...options, matchListByName: e.target.checked })
            }
            className="h-4 w-4 rounded border-input accent-primary"
          />
          Match list items by{" "}
          <code className="code-inline">name</code>
        </label>
      )}

      <div className="ml-auto flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onSwap}>
          Swap A ↔ B
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
        <Button size="sm" onClick={onCompare}>
          Compare
        </Button>
      </div>
    </div>
  );
}
