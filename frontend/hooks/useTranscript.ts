import { useRef, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

type SpeechRecognitionResultLike = {
  0: {
    transcript: string;
  };
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};


//  fix these fillers words for acctually filelr words or make a category system for different types of filler words (e.g. hesitation, intensifiers, discourse markers, etc.)
const FILLER_WORDS = [
  "um",
  "uh",
  "er",
  "ah",
  "hmm",
  "like",
  "you know",
  "i mean",
  "basically",
  "literally",
  "actually",

  "seriously",
  "obviously",



  "so",
  "well",
  "anyway",
  "kind of",
  "sort of",
  "stuff",
  "things",
  "and yeah",
  "or something",
  "whatever",
  "just",
  "totally",
  "pretty much",
  "at the end of the day",

  "if that makes sense",
  "you see",
  "believe me",
  "you guys",
  "kinda",
  "sorta",
  "alright",
  "essentially",
  "in a way",
  "for sure",
  "definitely",
  "probably",
  "maybe",
  "i guess",
  "i think",
  "possibly",
  "hopefully",
  "technically",
  "really",
  "very",
  "super",
  "extremely",
  "quite",
  "rather",
  "you know what i mean",
  "to some extent",
  "more or less",
  "as i said",
  "needless to say",
  "the thing is",
  "at the moment",
  "to tell you the truth",
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function countFillerWords(transcript: string): Record<string, number> {
  const lower = transcript.toLowerCase();
  const counts: Record<string, number> = {};

  for (const word of FILLER_WORDS) {
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, "gi");
    const matches = lower.match(regex);

    if (matches && matches.length > 0) {
      counts[word] = matches.length;
    }
  }

  return counts;
}

export function useTranscript() {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  function setupTranscript() {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError("Speech recognition is only supported in Chrome or Edge.");
        console.warn("Speech recognition not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let text = "";

        for (let index = 0; index < event.results.length; index += 1) {
          text += `${event.results[index][0].transcript} `;
        }

        setTranscript(text.trim());
      };

      recognition.onerror = () => {
        setError("Speech recognition is only supported in Chrome or Edge.");
      };

      recognitionRef.current = recognition;
      setError(null);
    } catch {
      setError("Speech recognition is only supported in Chrome or Edge.");
    }
  }

  function startTranscript() {
    if (!recognitionRef.current) {
      console.warn("setupTranscript must run before startTranscript.");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      setError("Speech recognition is only supported in Chrome or Edge.");
    }
  }

  function stopTranscript() {
    recognitionRef.current?.stop();
  }

  function resetTranscript() {
    setTranscript("");
  }

  return {
    transcript,
    transcriptError: error,
    setupTranscript,
    startTranscript,
    stopTranscript,
    resetTranscript,
  };
}
