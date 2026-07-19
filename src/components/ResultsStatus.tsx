import type { CompareResult } from "../lib/types";
import { displayLabel } from "../lib/labels";
import { cn } from "../lib/utils";

interface ResultsStatusProps {
  result: CompareResult | null;
  labelA: string;
  labelB: string;
  hasCompared: boolean;
}

const STATS = [
  { key: "onlyA" as const, label: "Only in A", dotClass: "bg-chart-2" },
  { key: "changed" as const, label: "Changed", dotClass: "bg-chart-4" },
  { key: "onlyB" as const, label: "Only in B", dotClass: "bg-chart-3" },
  { key: "same" as const, label: "Same", dotClass: "bg-chart-1" },
];

export default function ResultsStatus({
  result,
  labelA,
  labelB,
  hasCompared,
}: ResultsStatusProps) {
  const nameA = displayLabel(labelA, "A");
  const nameB = displayLabel(labelB, "B");

  const counts = {
    onlyA: result?.onlyA.length ?? 0,
    changed: result?.changed.length ?? 0,
    onlyB: result?.onlyB.length ?? 0,
    same: result?.same.length ?? 0,
  };

  let statusTitle = "No comparison yet";
  let statusDescription =
    "Paste or load content into both environments, then click Compare.";

  if (hasCompared && result) {
    if (result.errors.length > 0) {
      statusTitle = "Comparison failed";
      statusDescription = result.errors[0];
    } else {
      const totalDiff = counts.onlyA + counts.onlyB + counts.changed;
      statusTitle =
        totalDiff === 0 ? "Environments match" : "Comparison complete";
      statusDescription =
        totalDiff === 0
          ? "All keys and values are identical across both environments."
          : `Found ${totalDiff} difference${totalDiff === 1 ? "" : "s"} between ${nameA} and ${nameB}.`;
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card px-4 py-4 shadow-xs sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{statusTitle}</h3>
          <p className="text-sm text-muted-foreground">{statusDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {STATS.map((stat) => {
            const count = counts[stat.key];

            return (
              <div
                key={stat.key}
                className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", stat.dotClass)} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="mt-1 text-xl font-semibold tabular-nums">{count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
