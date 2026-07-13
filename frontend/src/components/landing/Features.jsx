import { Brain, FileText, Mic, Gauge, MessageSquareText, History } from 'lucide-react';
import { Reveal } from '../Reveal';

const FEATURES = [
  {
    icon: Brain,
    title: 'Adaptive questioning',
    description:
      'Each question builds on your last answer, so the interview follows your reasoning instead of a fixed script.',
  },
  {
    icon: FileText,
    title: 'Resume-aware interviews',
    description:
      'Upload your resume and questions can draw on your actual projects and experience, not generic prompts.',
  },
  {
    icon: Mic,
    title: 'Voice-first practice',
    description:
      'Answer out loud like a real interview. Your response is transcribed automatically so you can focus on speaking.',
  },
  {
    icon: Gauge,
    title: 'Instant evaluation',
    description:
      'Every answer is scored as you go, so you know how you did before moving to the next question.',
  },
  {
    icon: MessageSquareText,
    title: 'Detailed feedback',
    description:
      'Get concrete strengths, weaknesses, and suggestions for each response, in plain language.',
  },
  {
    icon: History,
    title: 'Interview history',
    description:
      'Every session is saved, so you can track scores across roles and experience levels over time.',
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Reveal>
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            Everything you need to prepare, in one flow
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            No scheduling, no other person on the other end &mdash; just focused, repeatable
            practice whenever you have twenty minutes.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
        {FEATURES.map(({ icon: Icon, title, description }, i) => (
          <Reveal key={title} delay={i * 60}>
            <div className="h-full bg-white p-6 dark:bg-zinc-950">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Icon size={18} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
