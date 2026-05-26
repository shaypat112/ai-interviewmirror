"use client";

import { Activity, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConfidenceBreakdown } from "@/hooks/useConfidenceScore";
import type { PostureBreakdown } from "@/hooks/usePostureScore";

interface ConfidencePosturePanelProps {
  liveConfidence: ConfidenceBreakdown | null;
  livePosture: PostureBreakdown | null;
  finalConfidence: ConfidenceBreakdown | null;
  finalPosture: PostureBreakdown | null;
  isRecording: boolean;
  confidenceReady: boolean;
  postureReady: boolean;
  postureLoading: boolean;
}

// Converts a 0-100 score to a Tailwind semantic text color class
function getScoreTextColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-400";
}

// Custom progress-bar style selector to override standard background colors
function getProgressBarColor(score: number): string {
  if (score >= 75) return "[&>div]:bg-emerald-500 bg-emerald-500/10";
  if (score >= 50) return "[&>div]:bg-amber-500 bg-amber-500/10";
  return "[&>div]:bg-rose-500 bg-rose-500/10";
}

// Refactored Metric Row utilizing Shadcn Progress
function MetricRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-32 shrink-0 text-xs text-slate-400 font-medium">
        {label}
      </span>
      <Progress
        value={score}
        className={`h-2 flex-1 rounded-full ${getProgressBarColor(score)}`}
      />
      <span
        className={`w-8 text-right text-xs font-mono font-bold ${getScoreTextColor(score)}`}
      >
        {score}
      </span>
    </div>
  );
}

// Refactored Score Circle Widget
function ScoreCircle({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-2">
      <span
        className={`text-3xl font-extrabold font-mono tracking-tight ${getScoreTextColor(score)}`}
      >
        {score}
      </span>
      <span className="text-xs font-medium text-slate-500 mt-1">{label}</span>
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
  // Guard clause to hide the panel entirely if context data is completely absent
  if (!confidenceReady && !postureReady && !postureLoading) return null;

  const confidence = isRecording ? liveConfidence : finalConfidence;
  const posture = isRecording ? livePosture : finalPosture;
  const sectionTitle = isRecording ? "Live Analysis" : "Session Summary";

  return (
    <Card className="border-white/10 bg-slate-900/60 backdrop-blur-sm">
      {/* Structural Header Layout */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold tracking-tight text-white">
            {sectionTitle}
          </CardTitle>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Activity className="h-3 w-3 inline mr-0.5 animate-pulse" />
            Active Feed
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Posture Model Loading States backed by Skeletons */}
        {postureLoading && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3">
            <Skeleton className="h-4 w-4 rounded-full bg-slate-700" />
            <span className="text-xs text-slate-400 animate-pulse">
              Initializing hardware mapping & posture node configurations...
            </span>
          </div>
        )}

        {/* Global Summary Target Clusters */}
        {(confidence || posture) && (
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            {confidence && (
              <ScoreCircle score={confidence.overall} label="Confidence" />
            )}
            {posture && <ScoreCircle score={posture.overall} label="Posture" />}
            {confidence && posture && (
              <ScoreCircle
                score={Math.round((confidence.overall + posture.overall) / 2)}
                label="Combined Avg"
              />
            )}
          </div>
        )}

        {/* Confidence Breakdown Segment */}
        {confidence && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-slate-400" />
              Confidence Metrics
            </p>
            <div className="space-y-2.5">
              <MetricRow label="Eye Contact" score={confidence.eyeContact} />
              <MetricRow label="Stability" score={confidence.stability} />
              <MetricRow label="Presence" score={confidence.presence} />
            </div>
          </div>
        )}

        {confidence && posture && <Separator className="bg-white/5" />}

        {/* Posture Breakdown Segment */}
        {posture && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-slate-400" />
              Posture Diagnostics
            </p>
            <div className="space-y-2.5">
              <MetricRow label="Shoulder Level" score={posture.shoulderLevel} />
              <MetricRow label="Shoulders Open" score={posture.shoulderWidth} />
              <MetricRow label="Head Alignment" score={posture.headTilt} />
            </div>
          </div>
        )}

        {/* Feedback Section with Contextual Posture Insights */}
        {!isRecording && finalPosture && finalConfidence && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-400">
              <ShieldAlert className="h-4 w-4 shrink-0 text-sky-400 mt-0.5" />
              <div>
                {finalConfidence.eyeContact < 60
                  ? "Look directly at the camera lens instead of your own preview image to project a strong presence."
                  : finalPosture.shoulderWidth < 60
                    ? "Sit back slightly and square your posture to maximize screen coverage and look relaxed."
                    : finalPosture.shoulderLevel < 60
                      ? "Keep your shoulder heights even. Dropping or lifting on one side signals muscle strain or nervousness."
                      : "Outstanding presence. Posture alignment and camera eye contact are fully optimized."}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
