"use client";

import { useEffect, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useRecorder } from "@/hooks/useRecorder";
import { useTranscript } from "@/hooks/useTranscript";
import { useTimer } from "@/hooks/useTimer";
import { useInterviewerVoice } from "@/hooks/useInterviewerVoice";
import type { Question } from "@/app/data/questions";

interface SimulationQuestionProps {
  question: Question;
  questionNumber: number; // 1-based for display
  totalQuestions: number;
  isSubmitting: boolean;
  onSubmit: (transcript: string, duration: number) => void;
}

export function SimulationQuestion({
  question,
  questionNumber,
  totalQuestions,
  isSubmitting,
  onSubmit,
}: SimulationQuestionProps) {
  const [phase, setPhase] = useState<"setup" | "recording" | "done">("setup");
  const [hasCamera, setHasCamera] = useState(false);

  const { videoRef, isCameraReady, startCamera } = useCamera();
  const { setupRecorder, startRecording, stopRecording, recordingUrl } =
    useRecorder();
  const {
    transcript,
    setupTranscript,
    startTranscript,
    stopTranscript,
    resetTranscript,
  } = useTranscript();
  const {
    seconds,
    formattedTime,
    color: timerColor,
    startTimer,
    stopTimer,
    resetTimer,
  } = useTimer();
  const { speak, isSpeaking } = useInterviewerVoice();

  // Start camera automatically when this question mounts
  useEffect(() => {
    async function init() {
      const stream = await startCamera();
      if (!stream) return;
      setupRecorder(stream);
      setupTranscript();
      setHasCamera(true);

      // Auto-read the question aloud after a short delay
      setTimeout(() => speak(question.question), 600);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]); // re-run when question changes

  function handleStart() {
    resetTranscript();
    resetTimer();
    startRecording();
    startTranscript();
    startTimer();
    setPhase("recording");
  }

  function handleStop() {
    stopRecording();
    stopTranscript();
    stopTimer();
    setPhase("done");
  }

  function handleSubmit() {
    onSubmit(transcript, seconds);
  }

  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      {/* Progress bar + question counter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="label">
            Question {questionNumber} of {totalQuestions}
          </p>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            {totalQuestions - questionNumber} remaining after this
          </p>
        </div>
        {/* Track */}
        <div
          className="h-1 w-full rounded-full"
          style={{ background: "var(--surface-2)" }}
        >
          {/* Fill */}
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: `${progress + (1 / totalQuestions) * 100}%`,
              background: "var(--accent)",
            }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left — camera + controls */}
        <div className="space-y-4">
          {/* Category + difficulty badges */}
          <div className="flex gap-2">
            <span className="badge badge-accent">{question.category}</span>
            <span
              className={`badge ${
                question.difficulty === "Easy"
                  ? "badge-green"
                  : question.difficulty === "Medium"
                    ? "badge-yellow"
                    : "badge-red"
              }`}
            >
              {question.difficulty}
            </span>
          </div>

          {/* Question text */}
          <div className="card">
            <p className="label mb-3">Your Question</p>
            <p
              className="text-base leading-7"
              style={{ color: "var(--text-1)" }}
            >
              {question.question}
            </p>
            {isSpeaking && (
              <p className="mt-3 text-xs" style={{ color: "var(--text-3)" }}>
                🔊 Reading question...
              </p>
            )}
          </div>

          {/* Camera feed */}
          <div
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: "var(--border)" }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-video w-full bg-black object-cover"
            />
          </div>

          {/* Timer — only shows while recording */}
          {phase === "recording" && (
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              <span
                className={`text-2xl font-mono font-bold tabular-nums ${timerColor}`}
              >
                {formattedTime}
              </span>
              <span className="text-xs" style={{ color: "var(--text-3)" }}>
                {timerColor === "text-emerald-400"
                  ? "good pace"
                  : timerColor === "text-amber-400"
                    ? "getting long"
                    : "wrap it up"}
              </span>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            {phase === "setup" && (
              <button
                onClick={handleStart}
                disabled={!hasCamera}
                className="btn btn-primary"
              >
                {hasCamera ? "Start Recording" : "Preparing camera..."}
              </button>
            )}

            {phase === "recording" && (
              <button onClick={handleStop} className="btn btn-danger">
                Stop Recording
              </button>
            )}

            {phase === "done" && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting
                  ? "Analyzing..."
                  : questionNumber === totalQuestions
                    ? "Submit & See Results →"
                    : "Submit & Next Question →"}
              </button>
            )}
          </div>
        </div>

        {/* Right — live transcript */}
        <div className="space-y-4">
          <div className="card h-full min-h-48">
            <p className="label mb-3">Live Transcript</p>
            <p
              className="text-sm leading-6"
              style={{ color: transcript ? "var(--text-1)" : "var(--text-3)" }}
            >
              {transcript || "Your words will appear here as you speak..."}
            </p>
          </div>

          {/* Tip card */}
          <div
            className="rounded-xl p-4 text-xs leading-5"
            style={{
              background: "var(--accent-dim)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "var(--text-2)",
            }}
          >
            💡 <strong style={{ color: "var(--text-1)" }}>Tip:</strong>{" "}
            Structure your answer clearly. For technical questions, explain your
            thinking out loud. For behavioral questions, use the STAR format
            (Situation, Task, Action, Result).
          </div>
        </div>
      </div>
    </div>
  );
}
