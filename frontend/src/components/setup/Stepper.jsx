import { Minus, Plus } from 'lucide-react';

export function Stepper({ label, value, onChange, min = 3, max = 20, id }) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease question count"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          <Minus size={15} aria-hidden="true" />
        </button>

        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isNaN(next)) return;
            onChange(Math.min(max, Math.max(min, next)));
          }}
          className="h-9 w-16 rounded-md border border-zinc-200 bg-white text-center text-sm font-medium tabular-nums text-zinc-900 focus-visible:outline-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        />

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase question count"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-40 disabled:hover:bg-transparent dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          <Plus size={15} aria-hidden="true" />
        </button>

        <span className="text-sm text-zinc-400 dark:text-zinc-500">
          questions ({min}&ndash;{max})
        </span>
      </div>
    </div>
  );
}
