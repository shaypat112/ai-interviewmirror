// components/interview/TimerDisplay.tsx
//
// Pure display — receives formatted time and color as props, renders it.
// No logic at all in here.

interface TimerDisplayProps {
  formattedTime: string; // e.g. "1:23"
  color: string; // Tailwind class e.g. "text-emerald-400"
  isRecording: boolean; // controls the pulsing dot
}

export function TimerDisplay({
  formattedTime,
  color,
  isRecording,
}: TimerDisplayProps) {
  // Don't show the timer at all before recording starts
  if (formattedTime === "0:00" && !isRecording) return null;

  return (
    <div className="mt-4 flex items-center gap-3">
      {/* Pulsing red dot — only shows while actively recording */}
      {isRecording && (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
        </span>
      )}

      {/* The clock number */}
      <span className={`text-2xl font-mono font-bold tabular-nums ${color}`}>
        {formattedTime}
      </span>

      {/* Pacing hint — only shows while recording */}
      {isRecording && (
        <span className="text-xs text-slate-500">
          {color === "text-emerald-400" && "good pace"}
          {color === "text-amber-400" && "getting long"}
          {color === "text-rose-400" && "wrap it up"}
        </span>
      )}
    </div>
  );
}
