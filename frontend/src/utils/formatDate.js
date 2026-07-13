/**
 * The backend returns started_at/completed_at via str(datetime), e.g.
 * "2026-07-12 10:23:45.123456" (space-separated, not strictly ISO 8601).
 * Some browsers parse that fine, others don't - normalize before parsing,
 * and fall back to the raw string if it's still unparseable rather than
 * showing "Invalid Date".
 */
export function formatDateTime(raw) {
  if (!raw) return null;

  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
