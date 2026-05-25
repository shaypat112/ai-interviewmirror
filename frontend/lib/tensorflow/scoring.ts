export function analyzeInterview(faces: any, poses: any) {
  let confidenceScore = 100;

  if (poses.length > 0) {
    const keypoints = poses[0].keypoints;

    const leftShoulder = keypoints.find(
      (k: any) => k.name === "left_shoulder"
    );

    const rightShoulder = keypoints.find(
      (k: any) => k.name === "right_shoulder"
    );

    if (leftShoulder && rightShoulder) {
      const shoulderTilt = Math.abs(
        leftShoulder.y - rightShoulder.y
      );

      if (shoulderTilt > 30) {
        confidenceScore -= 15;
      }
    }
  }

  if (faces.length === 0) {
    confidenceScore -= 20;
  }

  console.log({
    confidenceScore,
  });

  return {
    confidenceScore,
  };
}