import type { CompareMode } from "../lib/types";
import { MODES } from "../lib/types";
import { cn } from "../lib/utils";

interface ModeSelectorProps {
  mode: CompareMode;
  onChange: (mode: CompareMode) => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {MODES.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            mode === item.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-border bg-card text-foreground hover:bg-muted/60"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
