interface UploadProgressBarProps {
  label: string;
  progress: number;
}

function UploadProgressBar({ label, progress }: UploadProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="twin-upload-progress">
      <div className="twin-upload-progress__header">
        <span>{label}</span>
        <span>{clampedProgress}%</span>
      </div>
      <div className="twin-upload-progress__track">
        <div
          className="twin-upload-progress__fill"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

export default UploadProgressBar;
