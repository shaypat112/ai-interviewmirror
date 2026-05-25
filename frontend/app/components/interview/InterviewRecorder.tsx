"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { Question } from "@/app/data/questions";
import { useCamera } from "@/hooks/useCamera";
import { useRecorder } from "@/hooks/useRecorder";
import { useTranscript } from "@/hooks/useTranscript";
import { useAIGrader } from "@/hooks/useAIGrader";
import { useUsageGate } from "@/hooks/useUsageGate";
import { AuthGateModal } from "@/components/AuthGateModal";
import { CameraView } from "./CameraView";
import { ControlButtons } from "./ControlButtons";
import { StatusBar, TranscriptPanel } from "./Panels";
import { FeedbackPanel } from "./FeedbackPanel";
import { useTimer } from "@/hooks/useTimer";
import { TimerDisplay } from "./TimerDisplay";
import { useInterviewerVoice } from "@/hooks/useInterviewerVoice";
import { SpeakButton } from "./SpeakButton";
import { useExportPDF } from "@/hooks/useExport";
import { ExportButton } from "./ExportButton";

interface InterviewRecorderProps {
  activeQuestion: string | null;
  activeQuestionDetails: Question | null;
}

export function InterviewRecorder({
  activeQuestion,
  activeQuestionDetails,
}: InterviewRecorderProps) {
  const { exportPDF } = useExportPDF();
  const { user } = useUser();
  const [status, setStatus] = useState(
    "Start the camera to begin a practice session.",
  );
  const { speak, stop, isSpeaking } = useInterviewerVoice();
  const [isAnalyzeReady, setIsAnalyzeReady] = useState(false);
  const { showAuthModal, checkAndIncrement, dismissModal } = useUsageGate();

  const { videoRef, isCameraReady, cameraError, startCamera } = useCamera();
  const {
    setupRecorder,
    startRecording,
    stopRecording,
    uploadRecording,
    recordingUrl,
    isRecording,
    isUploading,
  } = useRecorder();
  const {
    transcript,
    setupTranscript,
    startTranscript,
    stopTranscript,
    resetTranscript,
    transcriptError,
  } = useTranscript();
  const {
    feedback,
    isAnalyzing,
    error: graderError,
    analyze,
    resetFeedback,
  } = useAIGrader();
  const { formattedTime, color, startTimer, stopTimer, resetTimer } =
    useTimer();

  useEffect(() => {
    if (!recordingUrl) {
      setIsAnalyzeReady(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsAnalyzeReady(true);
      setStatus("Recording done. Analyze your answer below.");
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [recordingUrl]);

  const canAnalyze = useMemo(() => {
    return Boolean(
      recordingUrl &&
      isAnalyzeReady &&
      activeQuestion &&
      transcript.trim().length > 0 &&
      !isAnalyzing,
    );
  }, [activeQuestion, isAnalyzeReady, isAnalyzing, recordingUrl, transcript]);

  async function handleStartCamera() {
    setStatus("Starting camera...");
    const stream = await startCamera();

    if (!stream) {
      setStatus(cameraError ?? "Camera failed.");
      return;
    }

    setupRecorder(stream);
    setupTranscript();
    setStatus("Camera is ready. You can start recording.");
  }

  function handleExport() {
    if (!activeQuestion || !feedback) return;
    exportPDF({
      question: activeQuestion,
      category: activeQuestion,
      difficulty: activeQuestion,
      transcript,
      feedback,
    });
  }

  function handleStartRecording() {
    resetTimer(); // ← add this line
    resetTranscript();
    resetFeedback();
    startRecording();
    startTranscript();
    startTimer(); // ← add this line
    setStatus("Recording in progress...");
  }

  function handleStopRecording() {
    stopRecording();
    stopTranscript();
    stopTimer();
    setStatus("Wrapping up your recording...");
  }

  async function handleUpload() {
    setStatus("Uploading recording...");
    const success = await uploadRecording();
    setStatus(
      success ? "Upload successful." : "Upload failed. Check backend server.",
    );
  }

  async function handleAnalyze() {
    if (!activeQuestion) {
      setStatus("Pick a question first before analyzing.");
      return;
    }

    if (!transcript.trim()) {
      setStatus("Say your answer out loud before analyzing.");
      return;
    }

    const allowed = checkAndIncrement();

    if (!allowed) {
      return;
    }

    setStatus("Sending to AI...");

    await analyze({
      question: activeQuestion,
      transcript,
      clerkUserId: user?.id,
      category: activeQuestionDetails?.category,
      difficulty: activeQuestionDetails?.difficulty,
    });

    setStatus("Analysis complete.");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          {activeQuestion ? (
            <div className="mb-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <SpeakButton
                question={activeQuestion}
                isSpeaking={isSpeaking}
                onSpeak={speak}
                onStop={stop}
              />
              <p className="mt-1 text-sm text-slate-200">{activeQuestion}</p>
            </div>
          ) : null}

          <CameraView videoRef={videoRef} recordingUrl={recordingUrl} />
          <TimerDisplay
            formattedTime={formattedTime}
            color={color}
            isRecording={isRecording}
          />

          <ControlButtons
            isCameraReady={isCameraReady}
            isRecording={isRecording}
            isUploading={isUploading}
            hasRecording={!!recordingUrl}
            onStartCamera={handleStartCamera}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onUpload={handleUpload}
          />

          {recordingUrl ? (
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="mt-3 w-full rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Answer"}
            </button>
          ) : null}
          {feedback && <ExportButton onExport={handleExport} />}
        </div>

        <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
          <StatusBar message={status} />
          <TranscriptPanel transcript={transcript} error={transcriptError} />
        </aside>
      </section>

      <FeedbackPanel
        feedback={feedback}
        isAnalyzing={isAnalyzing}
        error={graderError}
      />

      <AuthGateModal isOpen={showAuthModal} onDismiss={dismissModal} />
    </div>
  );
}
