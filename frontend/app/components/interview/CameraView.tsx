import { RefObject } from "react";

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  recordingUrl: string | null;
}

export function CameraView({ videoRef, recordingUrl }: CameraViewProps) {
  return (
    <div>
      {/* Live feed — muted so you don't hear yourself echo */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="aspect-video w-full rounded-2xl bg-black object-cover"
      />

      {/* Only shows up once you've stopped recording */}
      {recordingUrl && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-slate-400">Playback</p>
          <video
            controls
            src={recordingUrl}
            className="aspect-video w-full rounded-2xl bg-black"
          />
        </div>
      )}
    </div>
  );
}
