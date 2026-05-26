import { Button } from "@/components/ui/button";
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
    <Button
      type="button"
      onClick={handleClick}
      variant={isSpeaking ? "destructive" : "outline"}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
    >
      <span>{isSpeaking ? "⏹" : ""}</span>
      <span>{isSpeaking ? "Stop" : "Hear Question"}</span>
    </Button>
  );
}
