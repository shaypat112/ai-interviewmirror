import { useRef, useState } from "react";

// This hook owns everything related to the camera stream.
// It returns the videoRef (so CameraView can attach to it),
// whether the camera is ready, and the startCamera function.

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCamera(): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Attach the live stream to the video element so you can see yourself
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;
      setIsCameraReady(true);
      setError(null);

      return stream;
    } catch {
      setError("Camera or microphone access denied.");
      return null;
    }
  }

  return {
    videoRef,       // attach this to <video ref={videoRef} />
    streamRef,      // useRecorder needs this to record from the same stream
    isCameraReady,
    cameraError: error,
    startCamera,
  };
}