"use client";

import type { Difficulty } from "@/app/data/questions";

interface SimulationSetupProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onStart: (d: Difficulty) => void;
}

const difficulties: {
  value: Difficulty;
  label: string;
  desc: string;
  color: string;
}[] = [
  {
    value: "Easy",
    label: "Easy",
    desc: "Foundational concepts and intro behavioral questions. Good for warming up.",
    color: "border-emerald-500/40 bg-emerald-500/8 hover:border-emerald-500/70",
  },
  {
    value: "Medium",
    label: "Medium",
    desc: "Standard interview difficulty. Mix of applied technical and STAR behavioral.",
    color: "border-amber-500/40 bg-amber-500/8 hover:border-amber-500/70",
  },
  {
    value: "Hard",
    label: "Hard",
    desc: "Advanced concepts and complex scenarios. Closest to real FAANG interviews.",
    color: "border-rose-500/40 bg-rose-500/8 hover:border-rose-500/70",
  },
];

export function SimulationSetup({
  difficulty,
  onDifficultyChange,
  onStart,
}: SimulationSetupProps) {
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="label mb-3">Interview Simulation</p>
        <h1
          className="text-4xl font-semibold tracking-tight"
          style={{ color: "var(--text-1)" }}
        >
          Ready to practice?
        </h1>
        <p className="mt-3 text-base" style={{ color: "var(--text-2)" }}>
          You'll answer 4 questions — 2 behavioral, 2 technical. <br />
          AI feedback for all answers appears at the end.
        </p>
      </div>

      {/* Difficulty picker */}
      <div className="mb-8">
        <p className="label mb-4">Select difficulty</p>
        <div className="grid gap-3">
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => onDifficultyChange(d.value)}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-150 ${d.color} ${
                difficulty === d.value
                  ? "ring-2 ring-white/20 ring-offset-1 ring-offset-transparent"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-1)" }}
                >
                  {d.label}
                </span>
                {difficulty === d.value && (
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>
                    selected
                  </span>
                )}
              </div>
              <p
                className="mt-1 text-xs leading-5"
                style={{ color: "var(--text-2)" }}
              >
                {d.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart(difficulty)}
        className="btn btn-primary w-full justify-center py-3 text-sm"
      >
        Start Simulation →
      </button>

      <p
        className="mt-4 text-center text-xs"
        style={{ color: "var(--text-3)" }}
      >
        Make sure your camera and microphone are ready before starting.
      </p>
    </div>
  );
}
