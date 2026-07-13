import { apiClient } from './apiClient';

/**
 * POST /start_interview
 * Request:  { role, experience_level, resume_uploaded, max_questions }
 * Response: { interview_id }
 */
export async function startInterview({ role, experienceLevel, resumeUploaded, maxQuestions }) {
  const { data } = await apiClient.post('/start_interview', {
    role,
    experience_level: experienceLevel,
    resume_uploaded: resumeUploaded,
    max_questions: maxQuestions,
  });
  return data; // { interview_id }
}

/**
 * GET /next_question?prev_answer=
 * Response: { question }
 * Note: the backend keys this off its own in-memory interview_state, not an
 * interview_id param - the route signature has no id argument.
 */
export async function getNextQuestion(prevAnswer = '') {
  const { data } = await apiClient.get('/next_question', {
    params: { prev_answer: prevAnswer },
  });
  return data; // { question }
}

/**
 * POST /evaluate
 * Request:  { answer }
 * Response (declared): { evaluation }
 * The route body also computes `finished`, but response_model=EvaluateResponse
 * strips any field not declared on that schema, so `finished` never actually
 * arrives here - do not rely on it. Completion is tracked client-side instead
 * (see InterviewContext.isSessionComplete).
 */
export async function evaluateAnswer(answer) {
  const { data } = await apiClient.post('/evaluate', { answer });
  return data.evaluation; // { score, strengths[], weaknesses[], suggestions[] }
}

/**
 * POST /finish_interview
 * Response: { completed, overall_score, total_questions }
 * Score is 0-10, matching the scale evaluate_answer() scores on.
 */
export async function finishInterview() {
  const { data } = await apiClient.post('/finish_interview');
  return data;
}

/**
 * GET /history
 * Response: { interviews: [{ interview_id, role, experience_level, overall_score, started_at, completed_at }] }
 * List-level fields only - no per-question breakdown is available from the
 * backend, which is why InterviewDetails cannot show Strengths/Weaknesses/
 * Suggestions for past interviews, only for the one just completed in-session.
 */
export async function getHistory() {
  const { data } = await apiClient.get('/history');
  return data.interviews;
}
