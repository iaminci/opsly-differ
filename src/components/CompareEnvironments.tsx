import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import type { CompareMode, CompareOptions, CompareResult } from "../lib/types";
import { DEFAULT_OPTIONS } from "../lib/types";
import { compareEnvironments } from "../lib/compare";
import { SAMPLES } from "../lib/samples";
import { Button } from "./ui/button";
import ModeSelector from "./ModeSelector";
import { CompareActions, OptionCheckboxes } from "./OptionsBar";
import EditorPanel from "./EditorPanel";
import DiffResults from "./DiffResults";
import ResultsStatus from "./ResultsStatus";

export default function CompareEnvironments() {
  const [mode, setMode] = useState<CompareMode>("env");
  const [options, setOptions] = useState<CompareOptions>(DEFAULT_OPTIONS);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [labelA, setLabelA] = useState("");
  const [labelB, setLabelB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [hasCompared, setHasCompared] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const runCompare = useCallback(() => {
    const compareResult = compareEnvironments(mode, inputA, inputB, options);
    setResult(compareResult);
    setHasCompared(true);
    setCompareCount((count) => count + 1);
  }, [mode, inputA, inputB, options]);

  useEffect(() => {
    if (compareCount === 0) return;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [compareCount]);

  const handleModeChange = (newMode: CompareMode) => {
    setMode(newMode);
    setResult(null);
    setHasCompared(false);
  };

  const loadSample = (side: "A" | "B") => {
    const sample = SAMPLES[mode];
    if (side === "A") setInputA(sample.a);
    else setInputB(sample.b);
  };

  const loadBothSamples = () => {
    const sample = SAMPLES[mode];
    setInputA(sample.a);
    setInputB(sample.b);
  };

  const handleSwap = () => {
    setInputA(inputB);
    setInputB(inputA);
    setLabelA(labelB);
    setLabelB(labelA);
    setResult(null);
    setHasCompared(false);
  };

  const handleClear = () => {
    setInputA("");
    setInputB("");
    setLabelA("");
    setLabelB("");
    setResult(null);
    setHasCompared(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight">
          Compare Environments
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Diff .env, ConfigMap, YAML, and JSON locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
        <div className="flex flex-wrap items-center gap-2">
          <ModeSelector mode={mode} onChange={handleModeChange} />
          <Button variant="outline" onClick={loadBothSamples} className="ml-20 shrink-0">
            Load Sample
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <OptionCheckboxes options={options} onChange={setOptions} />
          <CompareActions onCompare={runCompare} onClear={handleClear} />
        </div>
      </div>

      <div className="relative grid gap-4 lg:grid-cols-2">
        <EditorPanel
          side="A"
          label={labelA}
          value={inputA}
          mode={mode}
          onLabelChange={setLabelA}
          onChange={setInputA}
          onSample={() => loadSample("A")}
        />
        <EditorPanel
          side="B"
          label={labelB}
          value={inputB}
          mode={mode}
          onLabelChange={setLabelB}
          onChange={setInputB}
          onSample={() => loadSample("B")}
        />

        <Button
          variant="outline"
          size="icon"
          type="button"
          aria-label="Swap environments"
          onClick={handleSwap}
          className="absolute left-1/2 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background shadow-md lg:inline-flex"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center lg:hidden">
        <Button variant="outline" size="sm" onClick={handleSwap} className="gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          Swap A ↔ B
        </Button>
      </div>

      <div ref={resultsRef} className="scroll-mt-24 space-y-4">
        <ResultsStatus
          result={result}
          labelA={labelA}
          labelB={labelB}
          hasCompared={hasCompared}
        />

        {result && (
          <DiffResults
            result={result}
            labelA={labelA}
            labelB={labelB}
            maskSecrets={options.maskSecrets}
          />
        )}
      </div>
    </div>
  );
}
