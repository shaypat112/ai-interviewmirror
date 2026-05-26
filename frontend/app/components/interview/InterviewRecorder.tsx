"use client";

import { useUser } from "@clerk/nextjs";
import { BrainCircuit, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Question } from "@/app/data/questions";
import { AuthGateModal } from "@/components/AuthGateModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAIGrader } from "@/hooks/useAIGrader";
import { useCamera } from "@/hooks/useCamera";
import { useConfidenceScore } from "@/hooks/useConfidenceScore";
import { useExportPDF } from "@/hooks/useExport";
import { useInterviewerVoice } from "@/hooks/useInterviewerVoice";
import { usePostureScore } from "@/hooks/usePostureScore";
import { useRecorder } from "@/hooks/useRecorder";
import { useTimer } from "@/hooks/useTimer";
import { useTranscript } from "@/hooks/useTranscript";
import { useUsageGate } from "@/hooks/useUsageGate";
import { CameraView } from "./CameraView";
import { ConfidencePosturePanel } from "./ConfidencePosturePanel";
import { ControlButtons } from "./ControlButtons";
import { ExportButton } from "./ExportButton";
import { FeedbackPanel } from "./FeedbackPanel";
import { StatusBar, TranscriptPanel } from "./Panels";
import { SpeakButton } from "./SpeakButton";
import { TimerDisplay } from "./TimerDisplay";

interface InterviewRecorderProps {
  activeQuestion: string | null;
  activeQuestionDetails: Question | null;
}

export function InterviewRecorder({
  activeQuestion,
  activeQuestionDetails,
}: InterviewRecorderProps) {
  const {
    loadModel: loadConfidenceModel,
    startAnalysis: startConfidence,
    stopAnalysis: stopConfidence,
    reset: resetConfidence,
    isReady: confidenceReady,
    liveScore: liveConfidence,
    finalScore: finalConfidence,
  } = useConfidenceScore();

  const {
    loadModel: loadPostureModel,
    startAnalysis: startPosture,
    stopAnalysis: stopPosture,
    reset: resetPosture,
    isReady: postureReady,
    isLoading: postureLoading,
    livePosture,
    finalPosture,
  } = usePostureScore();

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

    Promise.all([loadConfidenceModel(), loadPostureModel()]);
    setStatus("Camera ready. Loading analysis models...");
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
    resetTranscript();
    resetFeedback();
    resetConfidence();
    resetPosture();
    startRecording();
    startTranscript();
    startTimer();

    if (videoRef.current) {
      startConfidence(videoRef.current);
      startPosture(videoRef.current);
    }

    setStatus("Recording in progress...");
  }

  function handleStopRecording() {
    stopRecording();
    stopTranscript();
    stopTimer();
    stopConfidence();
    stopPosture();
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
    if (!allowed) return;

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
    // Forces complete page background to black cleanly
    <div className="min-h-screen bg-black text-slate-100 p-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        {/* Main Recording Console Frame */}
        <Card className="border-white/10 bg-zinc-950 p-5 rounded-3xl flex flex-col justify-between">
          <CardContent className="p-0 space-y-4">
            {activeQuestion && (
              <Card className="border-white/5 bg-slate-900/40 p-4 rounded-2xl flex items-center gap-4">
                <SpeakButton
                  question={activeQuestion}
                  isSpeaking={isSpeaking}
                  onSpeak={speak}
                  onStop={stop}
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Active Prompt
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-200 leading-relaxed">
                    {activeQuestion}
                  </p>
                </div>
              </Card>
            )}

            <CameraView videoRef={videoRef} recordingUrl={recordingUrl} />

            <TimerDisplay
              formattedTime={formattedTime}
              color={color}
              isRecording={isRecording}
            />
          </CardContent>

          <CardContent className="p-0 pt-4 space-y-3">
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

            {recordingUrl && (
              <Button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                size="lg"
                className="w-full rounded-full bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-lg transition-all duration-200 gap-2 disabled:opacity-40"
              >
                <BrainCircuit className="h-4 w-4" />
                {isAnalyzing ? "Processing Analytics..." : "Analyze Answer"}
              </Button>
            )}

            {feedback && <ExportButton onExport={handleExport} />}
          </CardContent>
        </Card>

        {/* Sidebar Status & Audio Logs Frame */}
        <Card className="border-white/10 bg-zinc-950/60 backdrop-blur-sm p-6 rounded-3xl flex flex-col space-y-6">
          <StatusBar message={status} />
          <div className="flex-1 rounded-2xl border border-white/5 bg-slate-900/20 p-1">
            <TranscriptPanel transcript={transcript} error={transcriptError} />
          </div>
        </Card>
      </div>

      {/* Analytics Metric Dashboards */}
      <ConfidencePosturePanel
        liveConfidence={liveConfidence}
        livePosture={livePosture}
        finalConfidence={finalConfidence}
        finalPosture={finalPosture}
        isRecording={isRecording}
        confidenceReady={confidenceReady}
        postureReady={postureReady}
        postureLoading={postureLoading}
      />

      <FeedbackPanel
        feedback={feedback}
        isAnalyzing={isAnalyzing}
        error={graderError}
      />

      <AuthGateModal isOpen={showAuthModal} onDismiss={dismissModal} />
    </div>
  );
}
