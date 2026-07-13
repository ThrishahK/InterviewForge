import { Reveal } from '../Reveal';

const STEPS = [
  {
    number: '01',
    title: 'Set up your interview',
    description: 'Choose a role, experience level, and how many questions you want to answer.',
  },
  {
    number: '02',
    title: 'Answer by voice',
    description:
      'Speak your answer naturally. It\u2019s transcribed automatically so nothing gets lost.',
  },
  {
    number: '03',
    title: 'Get evaluated instantly',
    description: 'Each answer is scored right away, with feedback on what worked and what didn\u2019t.',
  },
  {
    number: '04',
    title: 'Review your report',
    description: 'See your overall score, strengths, weaknesses, and where to focus next.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            How it works
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 80}>
              <div className="relative">
                <span className="font-display text-3xl font-semibold text-zinc-200 dark:text-zinc-800">
                  {step.number}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
