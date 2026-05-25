"use client";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

import { useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function InterviewRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const recognitionRef = useRef<any>(null);

  const chunksRef = useRef<Blob[]>([]);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const [transcript, setTranscript] = useState("");

  const [isRecording, setIsRecording] = useState(false);

  const [isCameraReady, setIsCameraReady] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [status, setStatus] = useState(
    "Start the camera to begin a practice session.",
  );

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });

        setRecordedBlob(blob);

        const url = URL.createObjectURL(blob);

        setRecordingUrl(url);

        chunksRef.current = [];

        setStatus("Recording completed successfully.");
      };

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();

      recognition.continuous = true;

      recognition.interimResults = true;

      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let text = "";

        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript + " ";
        }

        setTranscript(text);
      };

      recognitionRef.current = recognition;

      setIsCameraReady(true);

      setStatus("Camera is ready. You can start recording.");
    } catch {
      setStatus("Camera or microphone access denied.");
    }
  }

  function startRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder) return;

    if (recorder.state === "inactive") {
      chunksRef.current = [];

      setTranscript("");

      recorder.start();

      recognitionRef.current?.start();

      setIsRecording(true);

      setStatus("Recording in progress...");
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder) return;

    if (recorder.state === "recording") {
      recorder.stop();

      recognitionRef.current?.stop();

      setIsRecording(false);

      setStatus("Processing recording...");
    }
  }

  async function uploadRecording() {
    if (!recordedBlob) return;

    try {
      setIsUploading(true);

      setStatus("Uploading recording...");

      const formData = new FormData();

      formData.append("recording", recordedBlob, "interview-session.webm");

      const response = await fetch(`${API_BASE_URL}/api/recordings`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      setStatus(`Upload successful.`);

      console.log(result);
    } catch {
      setStatus("Upload failed. Check backend server.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="aspect-video w-full rounded-2xl bg-black object-cover"
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={startCamera}
            disabled={isCameraReady}
            className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-medium text-black disabled:opacity-50"
          >
            {isCameraReady ? "Camera Ready" : "Start Camera"}
          </button>

          <button
            onClick={startRecording}
            disabled={!isCameraReady || isRecording}
            className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-medium text-black disabled:opacity-50"
          >
            Start Recording
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="rounded-full bg-rose-500 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            Stop Recording
          </button>
        </div>

        {recordingUrl && (
          <div className="mt-6">
            <video
              controls
              src={recordingUrl}
              className="aspect-video w-full rounded-2xl bg-black"
            />

            <button
              onClick={uploadRecording}
              disabled={isUploading}
              className="mt-4 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Recording"}
            </button>
          </div>
        )}
      </div>

      <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        <h2 className="text-xl font-semibold text-white">Session Status</h2>

        <p className="mt-3 text-sm text-slate-300">{status}</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-slate-200">Live Transcript</p>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {transcript || "Transcript will appear here during recording."}
          </p>
        </div>
      </aside>
    </section>
  );
}
