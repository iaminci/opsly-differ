import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { displayLabel } from "../lib/labels";
import { MODES } from "../lib/types";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface EditorPanelProps {
  side: "A" | "B";
  label: string;
  value: string;
  mode: (typeof MODES)[number]["id"];
  onLabelChange: (label: string) => void;
  onChange: (value: string) => void;
  onSample: () => void;
}

export default function EditorPanel({
  side,
  label,
  value,
  mode,
  onLabelChange,
  onChange,
  onSample,
}: EditorPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLInputElement>(null);
  const [editingLabel, setEditingLabel] = useState(false);
  const modeInfo = MODES.find((m) => m.id === mode)!;
  const shownLabel = displayLabel(label, side);
  const isPlaceholder = !label.trim();

  useEffect(() => {
    if (editingLabel) labelRef.current?.focus();
  }, [editingLabel]);

  const closeLabelEdit = () => setEditingLabel(false);

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ""));
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="flex min-h-[280px] flex-1 flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
            side === "A"
              ? "bg-chart-2/15 text-chart-2"
              : "bg-chart-4/15 text-chart-4"
          )}
        >
          {side}
        </span>
        {editingLabel ? (
          <input
            ref={labelRef}
            type="text"
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
            onBlur={closeLabelEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                e.preventDefault();
                closeLabelEdit();
              }
            }}
            className="min-w-0 flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            placeholder={`Environment ${side}`}
          />
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <span
              className={cn(
                "truncate text-sm font-medium",
                isPlaceholder && "text-muted-foreground"
              )}
            >
              {shownLabel}
            </span>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-7 w-7 shrink-0 text-muted-foreground"
              aria-label={`Rename environment ${side}`}
              onClick={() => setEditingLabel(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".env,.yaml,.yml,.json,.txt"
          className="hidden"
          onChange={handleFileLoad}
        />
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => fileRef.current?.click()}
        >
          Load file
        </Button>
        <Button variant="ghost" size="sm" type="button" onClick={onSample}>
          Try sample
        </Button>
      </div>
      <div className="flex flex-1 flex-col p-3 pt-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={modeInfo.placeholder}
          spellCheck={false}
          className="scrollbar-thin min-h-[240px] flex-1 resize-y rounded-md border border-input bg-background p-3 font-mono text-sm leading-relaxed text-foreground shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </div>
    </div>
  );
}
