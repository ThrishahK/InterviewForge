export function HistoryCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-2 h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800/60" />
    </div>
  );
}
