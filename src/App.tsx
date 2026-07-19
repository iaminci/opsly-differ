import CompareEnvironments from "./components/CompareEnvironments";
import { AccentPicker } from "./components/accent-picker";
import { ThemeToggle } from "./components/theme-toggle";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              O
            </div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Opsly Differ
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden h-9 items-center rounded-md border border-border bg-background px-3 text-sm text-muted-foreground shadow-xs lg:inline-flex">
              Runs locally · No uploads
            </span>
            <AccentPicker />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <CompareEnvironments />
      </main>
    </div>
  );
}
