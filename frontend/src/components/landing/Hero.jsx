import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { InterviewPreviewPanel } from './InterviewPreviewPanel';

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:pt-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="animate-fade-up">
          <p className="inline-flex items-center rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            AI-powered mock interviews
          </p>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.25rem] dark:text-zinc-50">
            Practice interviews that actually push back.
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Answer by voice, get questions that adapt to what you just said, and receive
            evaluated feedback on every response &mdash; not just a score at the end.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/setup"
              className="group inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Start a mock interview
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              See how it works
            </a>
          </div>
        </div>

        <div
          className="flex justify-center lg:justify-end animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          <InterviewPreviewPanel />
        </div>
      </div>
    </section>
  );
}
