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
      <button
        onClick={onStartCamera}
        disabled={isCameraReady}
        className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-medium text-black disabled:opacity-50"
      >
        {isCameraReady ? "Camera Ready" : "Start Camera"}
      </button>

      <button
        onClick={onStartRecording}
        disabled={!isCameraReady || isRecording}
        className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-medium text-black disabled:opacity-50"
      >
        Start Recording
      </button>

      <button
        onClick={onStopRecording}
        disabled={!isRecording}
        className="rounded-full bg-rose-500 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        Stop Recording
      </button>

      {/* Only shows after a recording exists */}
      {hasRecording && (
        <button
          onClick={onUpload}
          disabled={isUploading}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Recording"}
        </button>
      )}
    </div>
  );
}
