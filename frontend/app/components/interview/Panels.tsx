import { countFillerWords } from "@/hooks/useTranscript";

interface StatusBarProps {
  message: string;
}

export function StatusBar({ message }: StatusBarProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white">Session Status</h2>
      <p className="mt-3 text-sm text-slate-300">{message}</p>
    </div>
  );
}

interface TranscriptPanelProps {
  transcript: string;
  error?: string | null;
}

export function TranscriptPanel({ transcript, error }: TranscriptPanelProps) {
  const fillerCounts = countFillerWords(transcript);

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-medium text-slate-200">Live Transcript</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {transcript || "Transcript will appear here during recording."}
      </p>

      {error ? (
        <p className="mt-4 text-sm text-amber-300">{error}</p>
      ) : null}

      {Object.keys(fillerCounts).length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Filler Words
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(fillerCounts).map(([word, count]) => (
              <span
                key={word}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  count >= 3
                    ? "bg-rose-500/15 text-rose-300"
                    : "bg-amber-500/15 text-amber-200"
                }`}
              >
                {word}: {count}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
