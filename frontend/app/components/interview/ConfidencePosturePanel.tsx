// components/interview/ConfidencePosturePanel.tsx
//
// Displays live scores while recording and final scores after stopping.
// Receives all data as props — zero logic in here.

import type { ConfidenceBreakdown } from "@/hooks/useConfidenceScore";
import type { PostureBreakdown } from "@/hooks/usePostureScore";

interface ConfidencePosturePanelProps {
  // Live scores (shown during recording)
  liveConfidence: ConfidenceBreakdown | null;
  livePosture: PostureBreakdown | null;
  // Final averaged scores (shown after recording stops)
  finalConfidence: ConfidenceBreakdown | null;
  finalPosture: PostureBreakdown | null;
  // State flags
  isRecording: boolean;
  confidenceReady: boolean;
  postureReady: boolean;
  postureLoading: boolean;
}

// Converts a 0-100 number to a Tailwind color class
function scoreToColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

// A single metric row: label on left, score bar + number on right
function MetricRow({ label, score }: { label: string; score: number }) {
  const color = scoreToColor(score);
  const barColor =
    score >= 75
      ? "bg-emerald-500"
      : score >= 50
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-xs text-slate-400">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        {/* Bar fills proportionally to the score */}
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={`w-8 text-right text-xs font-mono font-semibold ${color}`}
      >
        {score}
      </span>
    </div>
  );
}

// Big score circle for the overall number
function ScoreCircle({ score, label }: { score: number; label: string }) {
  const color = scoreToColor(score);
  return (
    <div className="flex flex-col items-center">
      <span className={`text-3xl font-bold font-mono ${color}`}>{score}</span>
      <span className="text-xs text-slate-500 mt-1">{label}</span>
    </div>
  );
}

export function ConfidencePosturePanel({
  liveConfidence,
  livePosture,
  finalConfidence,
  finalPosture,
  isRecording,
  confidenceReady,
  postureReady,
  postureLoading,
}: ConfidencePosturePanelProps) {
  // Nothing to show yet
  if (!confidenceReady && !postureReady && !postureLoading) return null;

  // Use live scores during recording, final scores after
  const confidence = isRecording ? liveConfidence : finalConfidence;
  const posture = isRecording ? livePosture : finalPosture;

  const sectionTitle = isRecording ? "Live Analysis" : "Session Analysis";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{sectionTitle}</h2>
        {isRecording && (
          <span className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            analyzing
          </span>
        )}
      </div>

      {/* Loading state while models load */}
      {postureLoading && (
        <p className="text-xs text-slate-500">Loading posture model...</p>
      )}

      {/* Overall scores row */}
      {(confidence || posture) && (
        <div className="flex justify-around py-2">
          {confidence && (
            <ScoreCircle score={confidence.overall} label="Confidence" />
          )}
          {posture && <ScoreCircle score={posture.overall} label="Posture" />}
          {confidence && posture && (
            <ScoreCircle
              score={Math.round((confidence.overall + posture.overall) / 2)}
              label="Combined"
            />
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Confidence breakdown */}
      {confidence && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Confidence
          </p>
          <MetricRow label="Eye Contact" score={confidence.eyeContact} />
          <MetricRow label="Stability" score={confidence.stability} />
          <MetricRow label="Presence" score={confidence.presence} />
        </div>
      )}

      {/* Posture breakdown */}
      {posture && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Posture
          </p>
          <MetricRow label="Shoulder Level" score={posture.shoulderLevel} />
          <MetricRow label="Shoulders Open" score={posture.shoulderWidth} />
          <MetricRow label="Head Straight" score={posture.headTilt} />
        </div>
      )}

      {/* Tip shown after recording */}
      {!isRecording && finalPosture && finalConfidence && (
        <p className="text-xs text-slate-500 leading-5">
          {finalConfidence.eyeContact < 60
            ? "💡 Try to look directly at the camera lens, not at your own face on screen."
            : finalPosture.shoulderWidth < 60
              ? "💡 Sit back slightly and open your shoulders — it projects more confidence."
              : finalPosture.shoulderLevel < 60
                ? "💡 Watch for raised shoulders — it signals tension. Try relaxing them down."
                : "✅ Great body language overall. Keep it up!"}
        </p>
      )}
    </div>
  );
}
