import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { scoreColorClass } from '../../utils/scoreColor';
import { formatDateTime } from '../../utils/formatDate';
import { StatusBadge } from './StatusBadge';

export function InterviewCard({ interview }) {
  const {
    interview_id: id,
    role,
    experience_level: experienceLevel,
    overall_score: overallScore,
    started_at: startedAt,
    completed_at: completedAt,
  } = interview;

  return (
    <Link
      to={`/history/${id}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50/50 hover:shadow-md dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {role || 'Untitled role'}
          </p>
          <StatusBadge completed={Boolean(completedAt)} />
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {experienceLevel} &middot; {formatDateTime(startedAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className={`text-lg font-semibold tabular-nums ${scoreColorClass(overallScore)}`}>
          {overallScore !== null && overallScore !== undefined ? overallScore.toFixed(1) : '—'}
        </span>
        <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-600" aria-hidden="true" />
      </div>
    </Link>
  );
}
