import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { getHistory } from '../services/interviewService';
import { extractErrorMessage } from '../services/apiClient';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { HistoryCardSkeleton } from '../components/history/HistoryCardSkeleton';
import { StatusBadge } from '../components/history/StatusBadge';
import { ScoreGauge } from '../components/report/ScoreGauge';
import { formatDateTime } from '../utils/formatDate';

export default function InterviewDetails() {
  const { id } = useParams();
  const [interview, setInterview] = useState(undefined); // undefined = loading, null = not found
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    setInterview(undefined);
    try {
      const data = await getHistory();
      const match = data.find((item) => String(item.interview_id) === String(id));
      setInterview(match ?? null);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
      <Link
        to="/history"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to history
      </Link>

      <div className="mt-6">
        {interview === undefined && !error && <HistoryCardSkeleton />}

        {error && <ErrorState message={error} onRetry={load} />}

        {interview === null && !error && (
          <EmptyState
            title="Interview not found"
            description="This interview may have been removed, or the link is incorrect."
          />
        )}

        {interview && (
          <>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              {interview.role || 'Untitled role'}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {interview.experience_level}
              </p>
              <StatusBadge completed={Boolean(interview.completed_at)} />
            </div>

            <div className="mt-8 flex flex-col items-center gap-6 rounded-xl border border-zinc-200 py-8 sm:flex-row sm:justify-center sm:gap-10 dark:border-zinc-800">
              <ScoreGauge score={Number(interview.overall_score ?? 0)} />
              <dl className="space-y-3 text-center sm:text-left">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                    Started
                  </dt>
                  <dd className="text-sm text-zinc-700 dark:text-zinc-300">
                    {formatDateTime(interview.started_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                    Completed
                  </dt>
                  <dd className="text-sm text-zinc-700 dark:text-zinc-300">
                    {interview.completed_at ? formatDateTime(interview.completed_at) : 'Not yet completed'}
                  </dd>
                </div>
              </dl>
            </div>

            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              Per-question answers and feedback are only available right after finishing an
              interview, on the report screen &mdash; the backend doesn't store a retrievable
              breakdown for past sessions.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
