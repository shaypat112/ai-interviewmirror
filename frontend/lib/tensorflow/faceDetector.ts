import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

import * as faceDetection from "@tensorflow-models/face-detection";

let detector: faceDetection.FaceDetector | null = null;

export async function getFaceDetector() {
  if (detector) return detector;

  await tf.setBackend("webgl");
  await tf.ready();

  detector = await faceDetection.createDetector(
    faceDetection.SupportedModels.MediaPipeFaceDetector,
    {
      runtime: "tfjs",
    }
  );

  return detector;
}