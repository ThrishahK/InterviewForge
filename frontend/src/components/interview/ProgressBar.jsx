export function ProgressBar({ current, total }) {
  const clampedCurrent = Math.min(current, total);
  const percent = total > 0 ? Math.round((clampedCurrent / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-zinc-400 dark:text-zinc-500">
        <span>
          Question {clampedCurrent} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-[width] duration-500 ease-out dark:bg-indigo-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
