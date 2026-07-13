/**
 * Score is always on a 0-10 scale (confirmed from evaluate_answer() and the
 * overall_score average computed in finish_interview). Centralizing the
 * color bands here keeps the evaluation card, the final report gauge, and
 * history cards visually consistent.
 */
export function scoreColorClass(score) {
  if (score === null || score === undefined) return 'text-zinc-400 dark:text-zinc-500';
  if (score >= 7) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 4) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

export function scoreStrokeColor(score) {
  if (score === null || score === undefined) return '#a1a1aa'; // zinc-400
  if (score >= 7) return '#059669'; // emerald-600
  if (score >= 4) return '#d97706'; // amber-600
  return '#dc2626'; // red-600
}
