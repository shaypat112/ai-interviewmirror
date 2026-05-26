// components/interview/FeedbackPanel.tsx
//
// Pure display component — receives feedback as props, renders it.
// No logic, no API calls. Just UI.

import type { AIFeedback } from "@/hooks/useAIGrader";

interface FeedbackPanelProps {
  feedback: AIFeedback | null;
  isAnalyzing: boolean;
  error: string | null;
}

// Picks a color for the score circle based on the number
function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  return "text-rose-400";
}

export function FeedbackPanel({
  feedback,
  isAnalyzing,
  error,
}: FeedbackPanelProps) {
  // Loading state
  if (isAnalyzing) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-3">
          {/* Simple CSS spinner */}
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-sm text-slate-300">Analyzing your answer...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6">
        <p className="text-sm text-rose-400">{error}</p>
      </div>
    );
  }

  // Empty state — nothing analyzed yet
  if (!feedback) {
    return;
  }

  // Feedback result
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white">AI Feedback</h2>

      {/* Score */}
      <div className="flex items-center gap-4">
        <span className={`text-5xl font-bold ${scoreColor(feedback.score)}`}>
          {feedback.score}
        </span>
        <span className="text-slate-400 text-sm">/ 10</span>
      </div>

      {/* What to improve */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          What to Improve
        </h3>
        <ul className="space-y-2">
          {feedback.improvements.map((item, index) => (
            <li key={index} className="flex gap-2 text-sm text-slate-300">
              {/* Bullet dot */}
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Example answer */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Example Strong Answer
        </h3>
        <p className="text-sm leading-7 text-slate-300 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          {feedback.exampleAnswer}
        </p>
      </div>
    </div>
  );
}
