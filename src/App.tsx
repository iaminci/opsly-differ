import CompareEnvironments from "./components/CompareEnvironments";
import { ThemePresetPicker } from "./components/theme-preset-picker";
import { ThemeToggle } from "./components/theme-toggle";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,color-mix(in_oklch,var(--chart-2)_8%,transparent),transparent_50%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              O
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Opsly Differ</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground lg:inline">
              Runs locally · No uploads
            </span>
            <ThemePresetPicker />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <CompareEnvironments />
      </main>
    </div>
  );
}
