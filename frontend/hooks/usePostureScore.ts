import { useRef, useState, useCallback } from "react";

// Using MediaPipe Tasks Vision instead of TensorFlow — works properly in Next.js.
// Loads the pose landmark model from CDN, no local package conflicts.

export interface PostureBreakdown {
  overall: number;
  shoulderLevel: number;
  headTilt: number;
  shoulderWidth: number;
}

export function usePostureScore() {
  const detectorRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const snapshotsRef = useRef<PostureBreakdown[]>([]);

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [livePosture, setLivePosture] = useState<PostureBreakdown | null>(null);
  const [finalPosture, setFinalPosture] = useState<PostureBreakdown | null>(
    null,
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadModel() {
    try {
      setIsLoading(true);
      setLoadError(null);

      // Import from the working package
      const { PoseLandmarker, FilesetResolver } =
        await import("@mediapipe/tasks-vision");

      // FilesetResolver fetches the WASM binary that runs the model
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
      );

      detectorRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      setIsReady(true);
    } catch (err) {
      console.warn("Pose detection failed to load:", err);
      setLoadError("Posture detection unavailable.");
    } finally {
      setIsLoading(false);
    }
  }

  const analyzePosture = useCallback(
    async (videoEl: HTMLVideoElement): Promise<PostureBreakdown | null> => {
      if (!detectorRef.current || videoEl.readyState < 2) return null;
      if (videoEl.videoWidth === 0 || videoEl.videoHeight === 0) return null;

      const rect = videoEl.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) return null;

      try {
        // Tasks Vision needs a timestamp for VIDEO mode
        const result = detectorRef.current.detectForVideo(
          videoEl,
          performance.now(),
        );

        if (!result.landmarks || result.landmarks.length === 0) return null;

        // MediaPipe Pose gives 33 landmarks, normalized 0-1
        // Key indices:
        // 0  = nose
        // 11 = left shoulder
        // 12 = right shoulder
        const landmarks = result.landmarks[0];

        const nose = landmarks[0];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];

        if (!leftShoulder || !rightShoulder) return null;

        // ── Shoulder Level (are shoulders even?) ──
        const shoulderYDiff = Math.abs(leftShoulder.y - rightShoulder.y);
        const shoulderLevel = Math.round(
          Math.max(0, 100 - shoulderYDiff * 800),
        );

        // ── Head Tilt (is nose centered between shoulders?) ──
        const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
        const noseDrift = nose ? Math.abs(nose.x - shoulderMidX) : 0;
        const headTilt = Math.round(Math.max(0, 100 - noseDrift * 600));

        // ── Shoulder Width (open vs hunched posture?) ──
        const span = Math.abs(rightShoulder.x - leftShoulder.x);
        let shoulderWidth: number;
        if (span >= 0.25 && span <= 0.55) {
          shoulderWidth = 100;
        } else if (span < 0.25) {
          shoulderWidth = Math.round((span / 0.25) * 100);
        } else {
          shoulderWidth = Math.round(Math.max(0, 100 - (span - 0.55) * 300));
        }

        const overall = Math.round(
          shoulderLevel * 0.4 + shoulderWidth * 0.35 + headTilt * 0.25,
        );

        return {
          overall: Math.min(100, Math.max(0, overall)),
          shoulderLevel: Math.min(100, Math.max(0, shoulderLevel)),
          headTilt: Math.min(100, Math.max(0, headTilt)),
          shoulderWidth: Math.min(100, Math.max(0, shoulderWidth)),
        };
      } catch {
        return null;
      }
    },
    [],
  );

  function startAnalysis(videoEl: HTMLVideoElement) {
    if (!isReady) return;
    snapshotsRef.current = [];
    setFinalPosture(null);

    intervalRef.current = setInterval(async () => {
      const score = await analyzePosture(videoEl);
      if (score) {
        setLivePosture(score);
        snapshotsRef.current.push(score);
      }
    }, 800);
  }

  function stopAnalysis() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLivePosture(null);

    const snapshots = snapshotsRef.current;
    if (snapshots.length === 0) return;

    const avg = (key: keyof PostureBreakdown) =>
      Math.round(
        snapshots.reduce((sum, s) => sum + s[key], 0) / snapshots.length,
      );

    setFinalPosture({
      overall: avg("overall"),
      shoulderLevel: avg("shoulderLevel"),
      headTilt: avg("headTilt"),
      shoulderWidth: avg("shoulderWidth"),
    });
  }

  function reset() {
    stopAnalysis();
    setFinalPosture(null);
    setLivePosture(null);
    snapshotsRef.current = [];
  }

  return {
    loadModel,
    startAnalysis,
    stopAnalysis,
    reset,
    isReady,
    isLoading,
    loadError,
    livePosture,
    finalPosture,
  };
}
