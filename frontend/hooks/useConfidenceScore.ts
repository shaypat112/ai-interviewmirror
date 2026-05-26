import { useRef, useState, useCallback } from "react";

export interface ConfidenceBreakdown {
  overall: number;
  eyeContact: number;
  stability: number;
  presence: number;
}

export function useConfidenceScore() {
  const detectorRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFacePositionRef = useRef<{ x: number; y: number } | null>(null);
  const scoresRef = useRef<ConfidenceBreakdown[]>([]);

  const [isReady, setIsReady] = useState(false);
  const [liveScore, setLiveScore] = useState<ConfidenceBreakdown | null>(null);
  const [finalScore, setFinalScore] = useState<ConfidenceBreakdown | null>(null);

  async function loadModel() {
    try {
      const { FaceDetector, FilesetResolver } = await import("@mediapipe/tasks-vision");

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      detectorRef.current = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
      });

      setIsReady(true);
    } catch (err) {
      console.warn("Face detection failed to load:", err);
    }
  }

  const analyzeFrame = useCallback(async (
    videoEl: HTMLVideoElement
  ): Promise<ConfidenceBreakdown | null> => {
    if (!detectorRef.current || videoEl.readyState < 2) return null;

    try {
      const result = detectorRef.current.detectForVideo(videoEl, performance.now());

      if (!result.detections || result.detections.length === 0) {
        return { overall: 20, eyeContact: 10, stability: 50, presence: 0 };
      }

      const face = result.detections[0];
      const box = face.boundingBox; // { originX, originY, width, height }

      const videoW = videoEl.videoWidth;
      const videoH = videoEl.videoHeight;

      // Normalize to 0-1
      const normX = box.originX / videoW;
      const normY = box.originY / videoH;
      const normW = box.width / videoW;
      const normH = box.height / videoH;

      // ── Presence: is face centered and sized well? ──
      const centerX = normX + normW / 2;
      const centerY = normY + normH / 2;
      const offsetX = Math.abs(centerX - 0.5);
      const offsetY = Math.abs(centerY - 0.5);
      const centerScore = Math.max(0, 100 - offsetX * 160 - offsetY * 80);
      const sizeScore = normW > 0.1 && normW < 0.6 ? 100 : Math.max(0, 100 - Math.abs(normW - 0.3) * 300);
      const presence = Math.round((centerScore + sizeScore) / 2);

      // ── Eye Contact: use keypoints if available ──
      let eyeContact = 70;
      if (face.keypoints && face.keypoints.length >= 2) {
        const rightEye = face.keypoints[0];
        const leftEye = face.keypoints[1];
        const eyeYDiff = Math.abs(rightEye.y - leftEye.y);
        eyeContact = Math.round(Math.max(0, 100 - eyeYDiff * 800));
      }

      // ── Stability: compare to last frame position ──
      const currentPos = { x: normX + normW / 2, y: normY + normH / 2 };
      let stability = 100;
      if (lastFacePositionRef.current) {
        const dx = Math.abs(currentPos.x - lastFacePositionRef.current.x);
        const dy = Math.abs(currentPos.y - lastFacePositionRef.current.y);
        stability = Math.round(Math.max(0, 100 - (dx + dy) * 1000));
      }
      lastFacePositionRef.current = currentPos;

      const overall = Math.round(presence * 0.35 + eyeContact * 0.45 + stability * 0.20);

      return {
        overall: Math.min(100, Math.max(0, overall)),
        eyeContact: Math.min(100, Math.max(0, eyeContact)),
        stability: Math.min(100, Math.max(0, stability)),
        presence: Math.min(100, Math.max(0, presence)),
      };
    } catch {
      return null;
    }
  }, []);

  function startAnalysis(videoEl: HTMLVideoElement) {
    if (!isReady) return;
    scoresRef.current = [];
    setFinalScore(null);
    lastFacePositionRef.current = null;

    intervalRef.current = setInterval(async () => {
      const score = await analyzeFrame(videoEl);
      if (score) {
        setLiveScore(score);
        scoresRef.current.push(score);
      }
    }, 500);
  }

  function stopAnalysis() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLiveScore(null);

    const scores = scoresRef.current;
    if (scores.length === 0) return;

    const avg = (key: keyof ConfidenceBreakdown) =>
      Math.round(scores.reduce((sum, s) => sum + s[key], 0) / scores.length);

    setFinalScore({
      overall: avg("overall"),
      eyeContact: avg("eyeContact"),
      stability: avg("stability"),
      presence: avg("presence"),
    });
  }

  function reset() {
    stopAnalysis();
    setFinalScore(null);
    setLiveScore(null);
    scoresRef.current = [];
  }

  return {
    loadModel,
    startAnalysis,
    stopAnalysis,
    reset,
    isReady,
    liveScore,
    finalScore,
  };
}