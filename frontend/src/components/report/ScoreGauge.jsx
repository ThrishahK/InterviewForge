import { scoreStrokeColor } from '../../utils/scoreColor';

export function ScoreGauge({ score, size = 128 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(10, score));
  const offset = circumference * (1 - clamped / 10);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={8}
          className="stroke-zinc-100 dark:stroke-zinc-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          stroke={scoreStrokeColor(score)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
          {score.toFixed(1)}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">out of 10</span>
      </div>
    </div>
  );
}
