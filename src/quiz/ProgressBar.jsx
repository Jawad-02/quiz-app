export default function ProgressBar({ value, label, ariaLabel }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div className="progress">
      <div className="progress__meta">
        <span>{label}</span>
        <span className="progress__pct">{Math.round(pct)}%</span>
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={ariaLabel}
      >
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
