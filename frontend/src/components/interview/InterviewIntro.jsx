import { useEffect, useState } from 'react';

const LINES = [
  'Welcome to InterviewForge.',
  "I'm your AI interviewer today.",
  'This interview consists of questions tailored to your selected role and experience level.',
  'Please answer naturally, just as you would in a real interview.',
  "When you're ready, we'll begin.",
];

const LINE_DELAY_MS = 900;
const HOLD_AFTER_LAST_MS = 1600;

export function InterviewIntro({ role, experienceLevel, voice, onComplete }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (voice.voiceEnabled) {
      const spoken = LINES.join(' ');
      voice.speak(spoken);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lineDelay = prefersReducedMotion ? 0 : LINE_DELAY_MS;

    const timers = LINES.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), lineDelay * (i + 1))
    );

    const finishTimer = setTimeout(
      () => onComplete(),
      lineDelay * LINES.length + HOLD_AFTER_LAST_MS
    );

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {role ? `${role} \u00b7 ${experienceLevel}` : 'Mock interview'}
      </p>
      <div className="mt-6 max-w-md space-y-3">
        {LINES.map((line, i) => (
          <p
            key={line}
            className={`text-lg font-medium leading-relaxed text-zinc-800 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] dark:text-zinc-200 ${
              i < visibleCount ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            {line}
          </p>
        ))}
      </div>
      <button
        type="button"
        onClick={onComplete}
        className={`mt-10 text-sm font-medium text-zinc-400 underline-offset-4 transition-opacity hover:text-zinc-700 hover:underline dark:text-zinc-500 dark:hover:text-zinc-300 ${
          visibleCount >= LINES.length ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        Skip intro
      </button>
    </div>
  );
}
