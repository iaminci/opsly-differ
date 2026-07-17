import { useCallback, useState } from "react";
import type { CompareMode, CompareOptions, CompareResult } from "../lib/types";
import { DEFAULT_OPTIONS } from "../lib/types";
import { compareEnvironments } from "../lib/compare";
import { SAMPLES } from "../lib/samples";
import { Button } from "./ui/button";
import ModeSelector, { ModeDescription } from "./ModeSelector";
import OptionsBar from "./OptionsBar";
import EditorPanel from "./EditorPanel";
import DiffResults from "./DiffResults";

export default function CompareEnvironments() {
  const [mode, setMode] = useState<CompareMode>("env");
  const [options, setOptions] = useState<CompareOptions>(DEFAULT_OPTIONS);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [labelA, setLabelA] = useState("");
  const [labelB, setLabelB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);

  const runCompare = useCallback(() => {
    const compareResult = compareEnvironments(mode, inputA, inputB, options);
    setResult(compareResult);
  }, [mode, inputA, inputB, options]);

  const handleModeChange = (newMode: CompareMode) => {
    setMode(newMode);
    setResult(null);
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
  };

  const handleClear = () => {
    setInputA("");
    setInputB("");
    setLabelA("");
    setLabelB("");
    setResult(null);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4 text-center sm:text-left">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <h2 className="max-w-3xl bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-3xl font-medium tracking-tight text-transparent sm:text-3xl">
              Compare Environments
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              Diff two environments — .env, ConfigMap, YAML, and JSON. Processed
              locally in your browser.
            </p>
          </div>
          <Button variant="outline" onClick={loadBothSamples} className="shrink-0">
            Try a sample →
          </Button>
        </div>
        <ModeSelector mode={mode} onChange={handleModeChange} />
        <ModeDescription mode={mode} />
      </div>

      <OptionsBar
        mode={mode}
        options={options}
        onChange={setOptions}
        onCompare={runCompare}
        onSwap={handleSwap}
        onClear={handleClear}
      />

      <div className="grid gap-4 lg:grid-cols-2">
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
      </div>

      {result && (
        <DiffResults
          result={result}
          labelA={labelA}
          labelB={labelB}
          maskSecrets={options.maskSecrets}
        />
      )}
    </div>
  );
}
