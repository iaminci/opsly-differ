import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { accentOptions } from "../config/accent-options";
import { cn } from "../lib/utils";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export function AccentPicker() {
  const { accent, accentLabel, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const active =
    accentOptions.find((option) => option.id === accent) ?? accentOptions[0];

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="outline"
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className="gap-2"
      >
        <Palette className="h-4 w-4" />
        <span
          className="h-3 w-3 rounded-full border border-border/60"
          style={{ background: active.swatch }}
        />
        <span className="max-w-[8rem] truncate">{accentLabel}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </Button>

      {open && (
        <div
          role="listbox"
          aria-label="Accent colors"
          className="absolute right-0 z-50 mt-2 w-[min(16rem,calc(100vw-2rem))] rounded-xl border border-border bg-popover p-2 shadow-lg"
        >
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Accent color
          </p>
          <div className="grid grid-cols-2 gap-1">
            {accentOptions.map((option) => {
              const selected = option.id === accent;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setAccent(option.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    selected && "bg-accent/70"
                  )}
                >
                  <span
                    className="h-5 w-5 shrink-0 rounded-md border border-border/60"
                    style={{ background: option.swatch }}
                  />
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
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
