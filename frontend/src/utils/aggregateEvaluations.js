/**
 * Combines the per-question evaluation objects collected during a session
 * into a single deduped, capped list per category. This is the client-side
 * stand-in agreed on earlier: the backend has no endpoint that returns an
 * aggregate qualitative summary, only the numeric overall_score, so this is
 * derived entirely from what the client already collected live.
 */
const MAX_ITEMS_PER_CATEGORY = 6;

function dedupeAndCap(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const trimmed = (item || '').trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
    if (result.length >= MAX_ITEMS_PER_CATEGORY) break;
  }
  return result;
}

export function aggregateEvaluations(answers) {
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  for (const { evaluation } of answers) {
    if (!evaluation) continue;
    strengths.push(...(evaluation.strengths || []));
    weaknesses.push(...(evaluation.weaknesses || []));
    suggestions.push(...(evaluation.suggestions || []));
  }

  return {
    strengths: dedupeAndCap(strengths),
    weaknesses: dedupeAndCap(weaknesses),
    suggestions: dedupeAndCap(suggestions),
  };
}
