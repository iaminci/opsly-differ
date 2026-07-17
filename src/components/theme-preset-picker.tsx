import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { listPresets } from "../lib/theme-preset-helper";
import { cn } from "../lib/utils";

export function ThemePresetPicker() {
  const { preset, setPreset } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const presets = listPresets();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const active = presets.find((item) => item.id === preset) ?? presets[0];

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className="gap-2"
      >
        <Palette className="h-4 w-4" />
        <span
          className="h-3 w-3 rounded-full border border-border/60"
          style={{ background: active.primary }}
        />
        <span className="max-w-[8rem] truncate">{active.label}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </Button>

      {open && (
        <div
          role="listbox"
          aria-label="Theme presets"
          className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-popover p-2 shadow-lg"
        >
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Theme presets
          </p>
          <div className="scrollbar-thin max-h-72 overflow-y-auto">
            {presets.map((item) => {
              const selected = item.id === preset;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setPreset(item.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    selected && "bg-accent/70"
                  )}
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded-md border border-border/60 shadow-xs"
                    style={{ background: item.primary }}
                  />
                  <span className="min-w-0 flex-1 truncate capitalize">
                    {item.label}
                  </span>
                  {selected && <Check className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
