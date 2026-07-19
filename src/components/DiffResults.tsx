import { useState } from "react";
import type { CompareResult, DiffBucket, DiffEntry } from "../lib/types";
import { displayLabel } from "../lib/labels";
import { displayValue, isSecretKey } from "../lib/secrets";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface DiffResultsProps {
  result: CompareResult | null;
  labelA: string;
  labelB: string;
  maskSecrets: boolean;
}

const BUCKET_META: Record<
  DiffBucket,
  { title: string; colorClass: string; dotClass: string }
> = {
  onlyA: {
    title: "Only in A",
    colorClass: "text-chart-2",
    dotClass: "bg-chart-2",
  },
  onlyB: {
    title: "Only in B",
    colorClass: "text-chart-3",
    dotClass: "bg-chart-3",
  },
  changed: {
    title: "Changed",
    colorClass: "text-chart-4",
    dotClass: "bg-chart-4",
  },
  same: {
    title: "Same",
    colorClass: "text-chart-1",
    dotClass: "bg-chart-1",
  },
};

function formatBucketText(
  bucket: DiffBucket,
  entries: DiffEntry[],
  labelA: string,
  labelB: string
): string {
  const nameA = displayLabel(labelA, "A");
  const nameB = displayLabel(labelB, "B");
  return entries
    .map((e) => {
      if (bucket === "onlyA") return `${e.key}=${e.valueA ?? ""}`;
      if (bucket === "onlyB") return `${e.key}=${e.valueB ?? ""}`;
      if (bucket === "changed")
        return `${e.key}: ${nameA}=${e.valueA ?? ""} | ${nameB}=${e.valueB ?? ""}`;
      return `${e.key}=${e.valueA ?? ""}`;
    })
    .join("\n");
}

function BucketSection({
  bucket,
  entries,
  labelA,
  labelB,
  maskSecrets,
  hideValues,
}: {
  bucket: DiffBucket;
  entries: DiffEntry[];
  labelA: string;
  labelB: string;
  maskSecrets: boolean;
  hideValues: boolean;
}) {
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const meta = BUCKET_META[bucket];

  if (entries.length === 0) return null;

  const toggleReveal = (key: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const copyBucket = async () => {
    const text = formatBucketText(bucket, entries, labelA, labelB);
    await navigator.clipboard.writeText(text);
  };

  const downloadBucket = () => {
    const text = formatBucketText(bucket, entries, labelA, labelB);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diff-${bucket}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const nameA = displayLabel(labelA, "A");
  const nameB = displayLabel(labelB, "B");
  const isOnlyBucket = bucket === "onlyA" || bucket === "onlyB";
  const showValueColumns = !hideValues || isOnlyBucket;
  const showOnlyPlaceholder = hideValues && isOnlyBucket;

  const title =
    bucket === "onlyA"
      ? `Only in ${nameA}`
      : bucket === "onlyB"
        ? `Only in ${nameB}`
        : meta.title;

  return (
    <section className="rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", meta.dotClass)} />
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {entries.length}
          </span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={copyBucket}>
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadBucket}>
            Download
          </Button>
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 text-left text-xs text-muted-foreground backdrop-blur-sm">
            <tr>
              <th className="px-4 py-2 font-medium">Key</th>
              {showValueColumns &&
                (bucket === "onlyA" || bucket === "changed" || bucket === "same") && (
                  <th className="px-4 py-2 font-medium">{nameA}</th>
                )}
              {showValueColumns && (bucket === "onlyB" || bucket === "changed") && (
                <th className="px-4 py-2 font-medium">{nameB}</th>
              )}
              {!hideValues && maskSecrets && <th className="w-16 px-2 py-2" />}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const revealed = revealedKeys.has(entry.key);
              const secret = isSecretKey(entry.key);
              return (
                <tr
                  key={entry.key}
                  className="border-t border-border/50 hover:bg-muted/40"
                >
                  <td className="px-4 py-2 font-mono text-xs">{entry.key}</td>
                  {showValueColumns &&
                    (bucket === "onlyA" || bucket === "changed" || bucket === "same") && (
                      <td className="max-w-xs truncate px-4 py-2 font-mono text-xs text-muted-foreground">
                        {showOnlyPlaceholder ? (
                          <span className="text-muted-foreground/60">{nameA}</span>
                        ) : (
                          displayValue(entry.key, entry.valueA, maskSecrets, revealed)
                        )}
                      </td>
                    )}
                  {showValueColumns && (bucket === "onlyB" || bucket === "changed") && (
                    <td className="max-w-xs truncate px-4 py-2 font-mono text-xs text-muted-foreground">
                      {showOnlyPlaceholder ? (
                        <span className="text-muted-foreground/60">{nameB}</span>
                      ) : (
                        displayValue(entry.key, entry.valueB, maskSecrets, revealed)
                      )}
                    </td>
                  )}
                  {!hideValues && maskSecrets && secret && (
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => toggleReveal(entry.key)}
                        className="text-xs text-primary hover:underline"
                      >
                        {revealed ? "Hide" : "Show"}
                      </button>
                    </td>
                  )}
                  {!hideValues && maskSecrets && !secret && <td />}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DiffResults({
  result,
  labelA,
  labelB,
  maskSecrets,
}: DiffResultsProps) {
  const [hideValues, setHideValues] = useState(true);

  if (!result) return null;

  const hasDiff =
    result.onlyA.length +
      result.onlyB.length +
      result.changed.length +
      result.same.length >
    0;

  return (
    <div className="space-y-4">
      {result.errors.length > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {result.errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="rounded-xl border border-chart-4/30 bg-chart-4/10 px-4 py-3 text-sm text-chart-4">
          {result.warnings.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      )}

      {hasDiff && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setHideValues((v) => !v)}>
            {hideValues ? "Show values" : "Hide values"}
          </Button>
        </div>
      )}

      {hasDiff ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <BucketSection
            bucket="onlyA"
            entries={result.onlyA}
            labelA={labelA}
            labelB={labelB}
            maskSecrets={maskSecrets}
            hideValues={hideValues}
          />
          <BucketSection
            bucket="onlyB"
            entries={result.onlyB}
            labelA={labelA}
            labelB={labelB}
            maskSecrets={maskSecrets}
            hideValues={hideValues}
          />
          <BucketSection
            bucket="changed"
            entries={result.changed}
            labelA={labelA}
            labelB={labelB}
            maskSecrets={maskSecrets}
            hideValues={hideValues}
          />
          <BucketSection
            bucket="same"
            entries={result.same}
            labelA={labelA}
            labelB={labelB}
            maskSecrets={maskSecrets}
            hideValues={hideValues}
          />
        </div>
      ) : (
        !result.errors.length && (
          <p className="text-center text-sm text-muted-foreground">
            No differences found — environments match.
          </p>
        )
      )}
    </div>
  );
}
