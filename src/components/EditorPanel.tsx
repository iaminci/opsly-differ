import { useEffect, useRef, useState } from "react";
import {
  FileUp,
  Pencil,
} from "lucide-react";
import { displayLabel } from "../lib/labels";
import { formatBytes, getInputStats } from "../lib/input-stats";
import type { CompareMode } from "../lib/types";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface EditorPanelProps {
  side: "A" | "B";
  label: string;
  value: string;
  mode: CompareMode;
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);
  const [editingLabel, setEditingLabel] = useState(false);
  const [dragging, setDragging] = useState(false);

  const shownLabel = displayLabel(label, side);
  const isPlaceholder = !label.trim();
  const stats = getInputStats(mode, value);
  const lineCount = Math.max(1, value.split("\n").length);

  useEffect(() => {
    if (editingLabel) labelRef.current?.focus();
  }, [editingLabel]);

  const closeLabelEdit = () => setEditingLabel(false);

  const loadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) loadFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  return (
    <div className="flex min-h-[620px] flex-1 flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold",
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
            onChange={(event) => onLabelChange(event.target.value)}
            onBlur={closeLabelEdit}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === "Escape") {
                event.preventDefault();
                closeLabelEdit();
              }
            }}
            className="min-w-0 flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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

        <span className="text-xs text-muted-foreground">
          {stats.keys} keys · {formatBytes(stats.bytes)}
        </span>

        <Button variant="ghost" size="sm" type="button" onClick={onSample}>
          Try sample
        </Button>

        <input
          ref={fileRef}
          type="file"
          accept=".env,.yaml,.yml,.json,.txt"
          className="hidden"
          onChange={handleFileLoad}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => textareaRef.current?.focus()}
          className={cn(
            "flex cursor-text items-center justify-center gap-3 rounded-lg border border-dashed px-3 py-2.5 text-center transition-colors sm:justify-between sm:px-4",
            dragging
              ? "border-primary bg-primary/5"
              : "border-border/80 bg-muted/20 hover:bg-muted/30"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground shadow-xs">
              <FileUp className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium sm:text-sm">
              Drop file here or paste content
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="shrink-0"
            onClick={(event) => {
              event.stopPropagation();
              fileRef.current?.click();
            }}
          >
            Load file
          </Button>
        </div>

        <div className="flex min-h-[460px] flex-1 overflow-hidden rounded-lg border border-input bg-background shadow-xs">
          <div
            ref={lineNumberRef}
            aria-hidden
            className="scrollbar-thin select-none overflow-hidden border-r border-border bg-muted/40 px-3 py-3 text-right font-mono text-xs leading-relaxed text-muted-foreground"
          >
            {Array.from({ length: lineCount }, (_, index) => (
              <div key={index + 1}>{index + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onScroll={(event) => {
              if (lineNumberRef.current) {
                lineNumberRef.current.scrollTop = event.currentTarget.scrollTop;
              }
            }}
            placeholder="Paste content here..."
            spellCheck={false}
            className="scrollbar-thin min-h-[460px] flex-1 resize-none bg-transparent px-3 py-3 font-mono text-sm leading-relaxed text-foreground focus-visible:outline-none placeholder:text-muted-foreground/60"
          />
        </div>
      </div>
    </div>
  );
}
