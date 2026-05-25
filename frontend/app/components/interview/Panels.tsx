// --- StatusBar ---
// Shows what's currently happening (camera ready, recording, error, etc.)

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

// --- TranscriptPanel ---
// Displays the live speech-to-text output

interface TranscriptPanelProps {
  transcript: string;
}

export function TranscriptPanel({ transcript }: TranscriptPanelProps) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-medium text-slate-200">Live Transcript</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {transcript || "Transcript will appear here during recording."}
      </p>
    </div>
  );
}
