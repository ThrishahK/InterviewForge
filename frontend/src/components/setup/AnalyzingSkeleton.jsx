export function AnalyzingSkeleton() {
  return (
    <div
      className="mt-4 animate-pulse rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      role="status"
      aria-label="Analyzing resume"
    >
      <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-3 h-3 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800/60" />
      <div className="mt-2 h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800/60" />
    </div>
  );
}
