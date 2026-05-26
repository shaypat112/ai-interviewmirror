import { Button } from "@/components/ui/button";
// This component renders the 4 action buttons.
// Every onClick and disabled state comes from props — no logic here.

interface ControlButtonsProps {
  isCameraReady: boolean;
  isRecording: boolean;
  isUploading: boolean;
  hasRecording: boolean;
  onStartCamera: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onUpload: () => void;
}

export function ControlButtons({
  isCameraReady,
  isRecording,
  isUploading,
  hasRecording,
  onStartCamera,
  onStartRecording,
  onStopRecording,
  onUpload,
}: ControlButtonsProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <Button
        onClick={onStartCamera}
        disabled={isCameraReady}
        variant="secondary"
        className="font-semibold px-5 py-3"
      >
        {isCameraReady ? "Camera Ready" : "Start Camera"}
      </Button>

      <Button
        onClick={onStartRecording}
        disabled={!isCameraReady || isRecording}
        variant="default"
        className="bg-emerald-600 text-white hover:bg-emerald-700 font-semibold px-5 py-3"
      >
        Start Recording
      </Button>

      <Button
        onClick={onStopRecording}
        disabled={!isRecording}
        variant="destructive"
        className="font-semibold px-5 py-3"
      >
        Stop Recording
      </Button>

      {/* Only shows after a recording exists */}
      {hasRecording && (
        <Button
          onClick={onUpload}
          disabled={isUploading}
          variant="outline"
          className="font-semibold px-5 py-3"
        >
          {isUploading ? "Uploading..." : "Upload Recording"}
        </Button>
      )}
    </div>
  );
}
