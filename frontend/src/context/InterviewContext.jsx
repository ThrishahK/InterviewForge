import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const InterviewContext = createContext(undefined);

const STORAGE_KEY = 'interviewforge:session';

/**
 * Shape of the persisted session. Kept flat and serializable so it can be
 * written to localStorage as-is.
 *
 * Why this exists (see architecture discussion):
 * - The backend's /evaluate endpoint computes a `finished` flag but the
 *   declared response_model strips it before it reaches the client, so
 *   `questionNumber` vs `maxQuestions` is tracked here instead and compared
 *   client-side.
 * - There is no backend endpoint to re-fetch a live interview's collected
 *   evaluations (strengths/weaknesses/suggestions), so `answers` is the only
 *   copy of that qualitative data. Persisting it protects against losing it
 *   on an accidental refresh mid-interview.
 * - `interview_state` on the backend is a single global (non-per-session)
 *   dict, so this app intentionally assumes one active interview at a time
 *   and does not attempt concurrency handling.
 */
const initialState = {
  interviewId: null,
  role: '',
  experienceLevel: '',
  maxQuestions: 10,
  resumeUploaded: false,
  resumeAnalysis: null,
  questionNumber: 1,
  currentQuestion: '',
  answers: [], // { questionNumber, question, answer, evaluation }
  status: 'idle', // 'idle' | 'active' | 'finished'
  finalReport: null, // { completed, overall_score, total_questions }
};

export function InterviewProvider({ children }) {
  const [session, setSession, clearSession] = useLocalStorage(STORAGE_KEY, initialState);

  const saveDraft = useCallback(
    ({ role, experienceLevel, maxQuestions }) => {
      setSession((prev) => ({
        ...prev,
        role,
        experienceLevel,
        maxQuestions,
      }));
    },
    [setSession]
  );

  const startInterview = useCallback(
    ({ interviewId, role, experienceLevel, maxQuestions, resumeUploaded, resumeAnalysis }) => {
      setSession({
        ...initialState,
        interviewId,
        role,
        experienceLevel,
        maxQuestions,
        resumeUploaded: Boolean(resumeUploaded),
        resumeAnalysis: resumeAnalysis ?? null,
        status: 'active',
      });
    },
    [setSession]
  );

  const setResumeAnalysis = useCallback(
    (resumeAnalysis) => {
      setSession((prev) => ({ ...prev, resumeAnalysis }));
    },
    [setSession]
  );

  const setCurrentQuestion = useCallback(
    (currentQuestion) => {
      setSession((prev) => ({ ...prev, currentQuestion }));
    },
    [setSession]
  );

  const recordAnswer = useCallback(
    ({ question, answer, evaluation }) => {
      setSession((prev) => ({
        ...prev,
        answers: [
          ...prev.answers,
          { questionNumber: prev.questionNumber, question, answer, evaluation },
        ],
        questionNumber: prev.questionNumber + 1,
      }));
    },
    [setSession]
  );

  const completeSession = useCallback(
    (finalReport) => {
      setSession((prev) => ({ ...prev, status: 'finished', finalReport }));
    },
    [setSession]
  );

  const resetSession = useCallback(() => {
    clearSession();
  }, [clearSession]);

  // Client-side stand-in for the backend's dropped `finished` flag.
  const isSessionComplete = session.questionNumber > session.maxQuestions;

  const value = useMemo(
    () => ({
      session,
      isSessionComplete,
      saveDraft,
      startInterview,
      setResumeAnalysis,
      setCurrentQuestion,
      recordAnswer,
      completeSession,
      resetSession,
    }),
    [
      session,
      isSessionComplete,
      saveDraft,
      startInterview,
      setResumeAnalysis,
      setCurrentQuestion,
      recordAnswer,
      completeSession,
      resetSession,
    ]
  );

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

export function useInterviewContext() {
  const ctx = useContext(InterviewContext);
  if (!ctx) {
    throw new Error('useInterviewContext must be used within an InterviewProvider');
  }
  return ctx;
}
