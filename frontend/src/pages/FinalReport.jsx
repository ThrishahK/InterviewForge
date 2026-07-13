import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { useInterviewContext } from '../context/InterviewContext';
import { ScoreGauge } from '../components/report/ScoreGauge';
import { QuestionAccordionItem } from '../components/report/QuestionAccordionItem';
import { aggregateEvaluations } from '../utils/aggregateEvaluations';

function AggregateList({ icon: Icon, iconClassName, title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p
        className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${iconClassName}`}
      >
        <Icon size={13} aria-hidden="true" />
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FinalReport() {
  const navigate = useNavigate();
  const { session, resetSession } = useInterviewContext();
  const { finalReport, answers, role, experienceLevel } = session;

  const { strengths, weaknesses, suggestions } = aggregateEvaluations(answers);
  const hasQualitativeData = strengths.length + weaknesses.length + suggestions.length > 0;

  const handleStartAnother = () => {
    resetSession();
    navigate('/setup');
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        Interview complete
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
        {role ? `${role} interview report` : 'Interview report'}
      </h1>
      {experienceLevel && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{experienceLevel}</p>
      )}

      <div className="mt-8 flex flex-col items-center gap-6 rounded-xl border border-zinc-200 py-8 sm:flex-row sm:justify-center sm:gap-10 dark:border-zinc-800">
        <ScoreGauge score={Number(finalReport?.overall_score ?? 0)} />
        <div className="text-center sm:text-left">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Questions answered</p>
          <p className="font-display text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {finalReport?.total_questions ?? answers.length}
          </p>
        </div>
      </div>

      {hasQualitativeData ? (
        <div className="mt-8 space-y-5 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Overall feedback
          </h2>
          <AggregateList
            icon={CheckCircle2}
            iconClassName="text-emerald-600 dark:text-emerald-400"
            title="Strengths"
            items={strengths}
          />
          <AggregateList
            icon={AlertTriangle}
            iconClassName="text-amber-600 dark:text-amber-400"
            title="Weaknesses"
            items={weaknesses}
          />
          <AggregateList
            icon={Lightbulb}
            iconClassName="text-indigo-600 dark:text-indigo-400"
            title="Suggestions"
            items={suggestions}
          />
        </div>
      ) : null}

      {answers.length > 0 && (
        <div className="mt-8 rounded-xl border border-zinc-200 px-6 dark:border-zinc-800">
          <h2 className="pt-5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Question by question
          </h2>
          <div className="mt-1">
            {answers.map((a, i) => (
              <QuestionAccordionItem
                key={i}
                index={i}
                question={a.question}
                answer={a.answer}
                evaluation={a.evaluation}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleStartAnother}
          className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start another interview
        </button>
        <Link
          to="/history"
          onClick={resetSession}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          View interview history
        </Link>
      </div>
    </section>
  );
}
