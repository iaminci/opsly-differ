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
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            mode === m.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export function ModeDescription({ mode }: { mode: CompareMode }) {
  const info = MODES.find((m) => m.id === mode)!;
  return (
    <p className="text-sm leading-relaxed text-muted-foreground">
      {info.description}
    </p>
  );
}
