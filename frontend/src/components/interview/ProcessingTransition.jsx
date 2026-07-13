import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export function ProcessingTransition({ messages }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || messages.length <= 1) return undefined;

    const interval = setInterval(() => {
      setIndex((prev) => Math.min(prev + 1, messages.length - 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div
      className="flex flex-col items-center gap-3 py-14"
      role="status"
      aria-live="polite"
      aria-label={messages[index]}
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        <Sparkles size={17} aria-hidden="true" />
        <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/20" />
      </span>
      <p className="text-sm font-medium text-zinc-600 transition-opacity duration-300 dark:text-zinc-400">
        {messages[index]}
      </p>
    </div>
  );
}
