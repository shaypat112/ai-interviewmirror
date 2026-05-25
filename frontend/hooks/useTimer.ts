import { useRef, useState } from "react";

// This hook owns all timer logic.
// It counts UP in seconds from 0 while recording.

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function startTimer() {
    // Clear any existing interval first — safety guard
    if (intervalRef.current) clearInterval(intervalRef.current);

    setSeconds(0); // always reset when starting fresh

    // setInterval fires every 1000ms (1 second)
    // We use the functional form of setSeconds (prev => prev + 1)
    // so we don't need seconds in the dependency — avoids stale closure bugs
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // We do NOT reset seconds here — we want to show the final time after stopping
  }

  function resetTimer() {
    stopTimer();
    setSeconds(0);
  }

  // Convert raw seconds into "0:00" display format
  function formatTime(s: number): string {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Color logic based on interview pacing guidelines
  // Green = on track, Yellow = getting long, Red = too long
  function getColor(s: number): string {
    if (s < 120) return "text-emerald-400"; // under 2 min
    if (s < 180) return "text-amber-400";   // 2-3 min
    return "text-rose-400";                  // over 3 min
  }

  return {
    seconds,
    formattedTime: formatTime(seconds),
    color: getColor(seconds),
    startTimer,
    stopTimer,
    resetTimer,
  };
}