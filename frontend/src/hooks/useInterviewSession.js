import { useInterviewContext } from '../context/InterviewContext';

/**
 * useInterviewSession
 *
 * For now this simply re-exposes InterviewContext so pages have a stable
 * hook to import from `hooks/` (per the agreed folder structure) rather than
 * reaching into `context/` directly. Once API wiring lands (Step 8), this is
 * where the live interview loop will live: fetching the next question,
 * submitting transcribed answers for evaluation, and deciding when to call
 * /finish_interview based on the client-tracked question count.
 */
export function useInterviewSession() {
  return useInterviewContext();
}
