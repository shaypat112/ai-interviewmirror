"use client";

import { useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useRecorder } from "@/hooks/useRecorder";
import { useTranscript } from "@/hooks/useTranscript";
import { CameraView } from "./Cameraview";
import { ControlButtons } from "./Controlbuttons";
import { StatusBar, TranscriptPanel } from "./Panels";

// This is the assembler. It:
// 1. Calls all three hooks to get data and functions
// 2. Wires them together (e.g. passes stream from camera → recorder)
// 3. Passes everything down to dumb components as props
// It has NO JSX of its own beyond layout — just connects pieces.

export function InterviewRecorder() {
  const [status, setStatus] = useState(
    "Start the camera to begin a practice session.",
  );

  const { videoRef, streamRef, isCameraReady, cameraError, startCamera } =
    useCamera();
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
  } = useTranscript();

  // --- Coordinated actions ---
  // These functions call multiple hooks together.
  // This is the one place where hooks "talk to each other".

  async function handleStartCamera() {
    setStatus("Starting camera...");
    const stream = await startCamera();

    if (!stream) {
      setStatus(cameraError ?? "Camera failed.");
      return;
    }

    // Both recorder and transcript need to be set up with the same stream/timing
    setupRecorder(stream);
    setupTranscript();
    setStatus("Camera is ready. You can start recording.");
  }

  function handleStartRecording() {
    resetTranscript();
    startRecording();
    startTranscript();
    setStatus("Recording in progress...");
  }

  function handleStopRecording() {
    stopRecording();
    stopTranscript();
    setStatus("Recording completed successfully.");
  }

  async function handleUpload() {
    setStatus("Uploading recording...");
    const success = await uploadRecording();
    setStatus(
      success ? "Upload successful." : "Upload failed. Check backend server.",
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <CameraView videoRef={videoRef} recordingUrl={recordingUrl} />
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
      </div>

      <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <StatusBar message={status} />
        <TranscriptPanel transcript={transcript} />
      </aside>
    </section>
  );
}
