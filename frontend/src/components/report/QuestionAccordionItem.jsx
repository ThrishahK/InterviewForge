import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { scoreColorClass } from '../../utils/scoreColor';

export function QuestionAccordionItem({ index, question, answer, evaluation }) {
  const [isOpen, setIsOpen] = useState(false);
  const score = Number(evaluation?.score ?? 0);

  return (
    <div className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
            Question {index + 1}
          </p>
          <p className="mt-0.5 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {question}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className={`text-sm font-semibold tabular-nums ${scoreColorClass(score)}`}>
            {score.toFixed(1)}
          </span>
          <ChevronDown
            size={16}
            className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 pl-0">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Your answer
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {answer}
            </p>

            {evaluation?.strengths?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  Strengths
                </p>
                <ul className="mt-1 space-y-0.5">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation?.weaknesses?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
                  Weaknesses
                </p>
                <ul className="mt-1 space-y-0.5">
                  {evaluation.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
