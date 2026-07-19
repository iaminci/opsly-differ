import { Zap } from "lucide-react";
import type { CompareOptions } from "../lib/types";
import { Button } from "./ui/button";

interface OptionCheckboxesProps {
  options: CompareOptions;
  onChange: (options: CompareOptions) => void;
}

function OptionCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-input accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}

export function OptionCheckboxes({ options, onChange }: OptionCheckboxesProps) {
  return (
    <div className="ml-15 flex flex-wrap items-center gap-x-0 gap-y-0">
      <OptionCheckbox
        checked={options.maskSecrets}
        onChange={(maskSecrets) => onChange({ ...options, maskSecrets })}
        label="Mask secrets"
      />

      <OptionCheckbox
        checked={options.trimWhitespace}
        onChange={(trimWhitespace) => onChange({ ...options, trimWhitespace })}
        label="Trim whitespace"
      />

      <div aria-hidden className="invisible text-sm">
        Ignore order
      </div>
    </div>
  );
}

interface CompareActionsProps {
  onCompare: () => void;
  onClear: () => void;
}

export function CompareActions({ onCompare, onClear }: CompareActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={onClear}>
        Clear
      </Button>
      <Button onClick={onCompare} className="gap-1.5">
        <Zap className="h-4 w-4" />
        Compare
      </Button>
    </div>
  );
}
