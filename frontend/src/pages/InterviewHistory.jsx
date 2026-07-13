import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, ArrowRight } from 'lucide-react';

import { getHistory } from '../services/interviewService';
import { extractErrorMessage } from '../services/apiClient';
import { InterviewCard } from '../components/history/InterviewCard';
import { HistoryCardSkeleton } from '../components/history/HistoryCardSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';

export default function InterviewHistory() {
  const [interviews, setInterviews] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getHistory();
      // Most recent first - the backend returns insertion order, not
      // guaranteed to be reverse-chronological.
      const sorted = [...data].sort(
        (a, b) => new Date(b.started_at) - new Date(a.started_at)
      );
      setInterviews(sorted);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            Interview history
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Every practice session you've completed, in one place.
          </p>
        </div>
        <Link
          to="/setup"
          className="group inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New interview
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {isLoading && (
          <>
            <HistoryCardSkeleton />
            <HistoryCardSkeleton />
            <HistoryCardSkeleton />
          </>
        )}

        {!isLoading && error && <ErrorState message={error} onRetry={load} />}

        {!isLoading && !error && interviews && interviews.length === 0 && (
          <EmptyState
            icon={HistoryIcon}
            title="No interviews yet"
            description="Start your first mock interview to see it show up here."
            action={
              <Link
                to="/setup"
                className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
              >
                Start a mock interview
              </Link>
            }
          />
        )}

        {!isLoading &&
          !error &&
          interviews &&
          interviews.map((interview) => (
            <InterviewCard key={interview.interview_id} interview={interview} />
          ))}
      </div>
    </section>
  );
}
