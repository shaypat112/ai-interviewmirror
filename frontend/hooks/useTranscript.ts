import { useRef, useState } from "react";

// Teaches TypeScript that these browser APIs exist
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// This hook owns all speech recognition logic.
// Completely separate from recording — transcript doesn't care about video.

export function useTranscript() {
  const recognitionRef = useRef<any>(null);
  const [transcript, setTranscript] = useState("");

  function setupTranscript() {
    // Some browsers use the webkit prefix (mainly Chrome/Safari)
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;     // keep listening, don't stop after silence
    recognition.interimResults = true; // show words as you speak, not just when done
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }
      setTranscript(text);
    };

    recognitionRef.current = recognition;
  }

  function startTranscript() {
    recognitionRef.current?.start();
  }

  function stopTranscript() {
    recognitionRef.current?.stop();
  }

  function resetTranscript() {
    setTranscript("");
  }

  return {
    transcript,
    setupTranscript,  // call once when camera starts
    startTranscript,  // call when recording starts
    stopTranscript,   // call when recording stops
    resetTranscript,
  };
}