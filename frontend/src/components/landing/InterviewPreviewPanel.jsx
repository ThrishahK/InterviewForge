import { useEffect, useState } from 'react';
import { Mic, Sparkles } from 'lucide-react';

const STAGES = ['listening', 'transcribing', 'evaluating', 'scored'];
const STAGE_DURATION_MS = 2200;

const QUESTION = "Tell me about a time you had to debug a production issue under pressure.";

export function InterviewPreviewPanel() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setStageIndex(STAGES.length - 1);
      return undefined;
    }

    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % STAGES.length);
    }, STAGE_DURATION_MS);

    return () => clearInterval(interval);
  }, []);

  const stage = STAGES[stageIndex];

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_16px_40px_-16px_rgba(0,0,0,0.5)]">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <span className="ml-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
          Live interview
        </span>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Question 3 of 8
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {QUESTION}
          </p>
        </div>

        {/* Stage: listening - animated waveform */}
        <div
          className={`flex items-center gap-3 rounded-lg border border-zinc-100 px-3 py-2.5 transition-opacity dark:border-zinc-800 ${
            stage === 'listening' ? 'opacity-100' : 'opacity-40'
          }`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
            <Mic size={13} aria-hidden="true" />
          </span>
          <div className="flex h-5 flex-1 items-center gap-[3px]" aria-hidden="true">
            {[6, 12, 18, 10, 16, 8, 14].map((height, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-full bg-indigo-400 dark:bg-indigo-500 ${
                  stage === 'listening' ? 'animate-wave' : ''
                }`}
                style={{
                  height: `${height}px`,
                  animationDelay: `${i * 90}ms`,
                  transform: stage === 'listening' ? undefined : 'scaleY(0.3)',
                }}
              />
            ))}
          </div>
          <span className="shrink-0 text-xs font-medium text-zinc-400 dark:text-zinc-500">
            {stage === 'listening' ? 'Recording…' : '0:42'}
          </span>
        </div>

        {/* Stage: transcribing */}
        <div
          className={`rounded-lg border border-zinc-100 px-3 py-2.5 text-xs leading-relaxed text-zinc-500 transition-opacity dark:border-zinc-800 dark:text-zinc-400 ${
            stage === 'transcribing' || stage === 'evaluating' || stage === 'scored'
              ? 'opacity-100'
              : 'opacity-30'
          }`}
        >
          {stage === 'transcribing' ? (
            <span className="inline-flex items-center gap-1.5">
              Transcribing your answer
              <span className="inline-flex gap-0.5">
                <span className="h-1 w-1 animate-pulse rounded-full bg-zinc-400" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-zinc-400 [animation-delay:150ms]" />
                <span className="h-1 w-1 animate-pulse rounded-full bg-zinc-400 [animation-delay:300ms]" />
              </span>
            </span>
          ) : (
            <span>
              "I isolated the regression to a recent cache change, rolled it back, then added a
              test to catch it going forward…"
            </span>
          )}
        </div>

        {/* Stage: evaluating / scored */}
        <div
          className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
            stage === 'scored'
              ? 'bg-indigo-50 dark:bg-indigo-500/10'
              : 'bg-zinc-50 dark:bg-zinc-800/60'
          }`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <Sparkles size={13} className="text-indigo-500" aria-hidden="true" />
            {stage === 'scored' ? 'Evaluation complete' : 'AI evaluating answer…'}
          </span>
          <span
            className={`text-sm font-semibold tabular-nums transition-opacity ${
              stage === 'scored' ? 'opacity-100 text-indigo-600 dark:text-indigo-400' : 'opacity-0'
            }`}
          >
            8.4 / 10
          </span>
        </div>
      </div>
    </div>
  );
}
