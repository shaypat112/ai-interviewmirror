import * as poseDetection from "@tensorflow-models/pose-detection";

let detector: poseDetection.PoseDetector | null = null;

export async function getPoseDetector() {
  if (detector) return detector;

  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType:
        poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    }
  );

  return detector;
}