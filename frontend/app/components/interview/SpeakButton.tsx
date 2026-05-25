// components/interview/SpeakButton.tsx

interface SpeakButtonProps {
  question: string;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
  onStop: () => void;
}

export function SpeakButton({
  question,
  isSpeaking,
  onSpeak,
  onStop,
}: SpeakButtonProps) {
  const handleClick = () => {
    if (isSpeaking) {
      onStop();
    } else {
      onSpeak(question);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        isSpeaking
          ? "border-rose-500/30 bg-rose-500/20 text-rose-400"
          : "border-white/10 bg-white/10 text-slate-300 hover:bg-white/20"
      }`}
    >
      <span>{isSpeaking ? "⏹" : ""}</span>
      <span>{isSpeaking ? "Stop" : "Hear Question"}</span>
    </button>
  );
}
