"use client";

import { useRef } from "react";

export function InterviewRecorder() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-[400px] w-[600px] rounded-xl bg-black object-cover"
      />

      <button
        onClick={startCamera}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Start Camera
      </button>
    </div>
  );
}
