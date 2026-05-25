import { useState } from "react";

// The browser has a built-in text-to-speech engine called speechSynthesis.
// It's free, works offline, no API key needed.
// We just tell it what to say and it handles the rest.

export function useInterviewerVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  function speak(text: string) {
    // Cancel anything currently being spoken first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Pick the best available voice — prefer a natural English one
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel"))
    );
    if (preferred) utterance.voice = preferred;

    // Tweak these to make it sound more like an interviewer
    utterance.rate = 0.92;   // slightly slower than default — more deliberate
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  return {
    speak,
    stop,
    isSpeaking,
  };
}