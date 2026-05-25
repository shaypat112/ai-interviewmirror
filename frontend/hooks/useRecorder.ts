import { useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/config";

export function useRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function setupRecorder(stream: MediaStream) {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      return;
    }

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const finalChunks = [...chunksRef.current];
      const blob = new Blob(finalChunks, { type: "video/webm" });
      setRecordedBlob(blob);

      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }

      setRecordingUrl(URL.createObjectURL(blob));
      chunksRef.current = [];
    };
  }

  function startRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state !== "inactive") {
      return;
    }

    chunksRef.current = [];
    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state !== "recording") {
      return;
    }

    recorder.stop();
    setIsRecording(false);
  }

  async function uploadRecording(): Promise<boolean> {
    if (!recordedBlob) {
      return false;
    }

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
    setupRecorder,
    startRecording,
    stopRecording,
    uploadRecording,
    recordedBlob,
    recordingUrl,
    isRecording,
    isUploading,
  };
}
