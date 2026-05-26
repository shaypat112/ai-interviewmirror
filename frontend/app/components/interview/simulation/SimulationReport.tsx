"use client";

import type { QuestionResult } from "@/hooks/useSimulation";

interface SimulationReportProps {
  results: QuestionResult[];
  overallScore: number;
  difficulty: string;
  onReset: () => void;
}

function scoreColor(score: number): string {
  if (score >= 8) return "var(--green)";
  if (score >= 5) return "var(--yellow)";
  return "var(--red)";
}

function scoreBadgeClass(score: number): string {
  if (score >= 8) return "badge-green";
  if (score >= 5) return "badge-yellow";
  return "badge-red";
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function overallVerdict(score: number): { label: string; message: string } {
  if (score >= 8)
    return {
      label: "Excellent",
      message:
        "Strong performance across the board. You're well prepared for real interviews.",
    };
  if (score >= 6)
    return {
      label: "Good",
      message:
        "Solid foundation. Focus on the improvements below to reach the next level.",
    };
  if (score >= 4)
    return {
      label: "Developing",
      message:
        "You have the right ideas but need more structure and depth in your answers.",
    };
  return {
    label: "Needs Work",
    message:
      "Keep practicing. Review the example answers and try to incorporate that structure.",
  };
}

export function SimulationReport({
  results,
  overallScore,
  difficulty,
  onReset,
}: SimulationReportProps) {
  const verdict = overallVerdict(overallScore);

  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-8">
      {/* Overall score hero */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="label mb-4">Simulation Complete</p>

        {/* Big score */}
        <div
          className="text-7xl font-bold font-mono tabular-nums mb-2"
          style={{ color: scoreColor(overallScore) }}
        >
          {overallScore}
        </div>
        <p className="text-sm mb-1" style={{ color: "var(--text-3)" }}>
          Overall score / 10
        </p>

        {/* Verdict */}
        <div
          className="inline-block mt-3 rounded-full px-4 py-1 text-sm font-medium"
          style={{
            background:
              overallScore >= 8
                ? "var(--green-dim)"
                : overallScore >= 5
                  ? "var(--yellow-dim)"
                  : "var(--red-dim)",
            color: scoreColor(overallScore),
          }}
        >
          {verdict.label}
        </div>

        <p
          className="mt-4 text-sm max-w-md mx-auto"
          style={{ color: "var(--text-2)" }}
        >
          {verdict.message}
        </p>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: "Difficulty", value: difficulty },
            { label: "Questions", value: `${results.length} / 4` },
            {
              label: "Avg Time",
              value: formatDuration(
                Math.round(
                  results.reduce((s, r) => s + r.duration, 0) / results.length,
                ),
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-3"
              style={{ background: "var(--surface-2)" }}
            >
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--text-1)" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "var(--text-3)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-question results */}
      <div>
        <p className="label mb-4">Question Breakdown</p>
        <div className="space-y-4">
          {results.map((result, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              {/* Question header */}
              <div
                className="px-5 py-4 flex items-start justify-between gap-4"
                style={{ background: "var(--surface-1)" }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-muted">Q{i + 1}</span>
                    <span className="badge badge-accent">
                      {result.question.category}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-3)" }}
                    >
                      {formatDuration(result.duration)}
                    </span>
                  </div>
                  <p
                    className="text-sm leading-6"
                    style={{ color: "var(--text-1)" }}
                  >
                    {result.question.question}
                  </p>
                </div>

                {/* Score badge */}
                <div className="shrink-0 text-right">
                  <div
                    className="text-3xl font-bold font-mono"
                    style={{ color: scoreColor(result.score) }}
                  >
                    {result.score}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-3)" }}>
                    /10
                  </div>
                </div>
              </div>

              {/* Improvements + example */}
              <div
                className="px-5 py-4 space-y-4"
                style={{ background: "var(--bg-subtle)" }}
              >
                {/* Your transcript (collapsed-ish) */}
                {result.transcript && (
                  <div>
                    <p className="label mb-2">Your Answer</p>
                    <p
                      className="text-xs leading-5 line-clamp-3"
                      style={{ color: "var(--text-2)" }}
                    >
                      {result.transcript}
                    </p>
                  </div>
                )}

                {/* Improvements */}
                <div>
                  <p className="label mb-2">What to Improve</p>
                  <ul className="space-y-1.5">
                    {result.improvements.map((item, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-xs"
                        style={{ color: "var(--text-2)" }}
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: "var(--yellow)" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Example answer */}
                <div>
                  <p className="label mb-2">Example Strong Answer</p>
                  <p
                    className="text-xs leading-5 rounded-xl px-4 py-3 italic"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--text-2)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {result.exampleAnswer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center pb-12">
        <button onClick={onReset} className="btn btn-primary">
          Try Again →
        </button>
        <a href="/" className="btn btn-secondary">
          Back to Practice
        </a>
      </div>
    </div>
  );
}
