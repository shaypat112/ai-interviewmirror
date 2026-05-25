import { useRef, useState } from "react";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCamera(): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraReady(true);
      setError(null);

      return stream;
    } catch {
      setError("Camera or microphone access denied.");
      return null;
    }
  }

  return {
    videoRef,
    isCameraReady,
    cameraError: error,
    startCamera,
  };
}
