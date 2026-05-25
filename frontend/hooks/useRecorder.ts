import { useRef, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// This hook owns recording start/stop, blob creation, and uploading.
// It needs the stream from useCamera passed in when recording starts.

export function useRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Takes the stream from useCamera so both use the same source
  function setupRecorder(stream: MediaStream) {
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    // Fires after recorder.stop() finishes writing the last chunk
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);

      // createObjectURL makes a local URL you can use in a <video src>
      const url = URL.createObjectURL(blob);
      setRecordingUrl(url);

      chunksRef.current = [];
    };
  }

  function startRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "inactive") return;

    chunksRef.current = [];
    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") return;

    recorder.stop();
    setIsRecording(false);
  }

  async function uploadRecording(): Promise<boolean> {
    if (!recordedBlob) return false;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("recording", recordedBlob, "interview-session.webm");

      const response = await fetch(`${API_BASE_URL}/api/recordings`, {
        method: "POST",
        body: formData,
      });

      return response.ok;
    } catch {
      return false;
    } finally {
      setIsUploading(false);
    }
  }

  return {
    setupRecorder,   // call once after startCamera succeeds
    startRecording,
    stopRecording,
    uploadRecording,
    recordedBlob,
    recordingUrl,
    isRecording,
    isUploading,
  };
}