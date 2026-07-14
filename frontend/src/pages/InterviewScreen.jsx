import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

import { useInterviewContext } from '../context/InterviewContext';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { getNextQuestion, evaluateAnswer, finishInterview } from '../services/interviewService';
import { transcribeAudio } from '../services/transcribeService';
import { extractErrorMessage } from '../services/apiClient';

import { ProgressBar } from '../components/interview/ProgressBar';
import { RecordingControl } from '../components/interview/RecordingControl';
import { VoiceControls } from '../components/interview/VoiceControls';
import { ProcessingTransition } from '../components/interview/ProcessingTransition';
import { InterviewSkeleton } from '../components/interview/InterviewSkeleton';
import { InterviewIntro } from '../components/interview/InterviewIntro';

// Phases within a single question round. Distinct from session.status
// ('active' | 'finished'), which tracks the interview as a whole.
// Per-question scoring is intentionally never shown here - only collected
// silently via recordAnswer() for the Final Report to aggregate later.
// Voice-first: there is deliberately no typed-answer phase. Accessibility
// text input is out of scope for the default experience per the brief.
const PHASES = {
  INTRO: 'intro',
  LOADING_QUESTION: 'loading-question',
  READY: 'ready',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  ERROR_TRANSCRIPTION: 'error-transcription',
  ERROR_PROCESSING: 'error-processing',
};

const PROCESSING_MESSAGES = [
  'Analyzing your response…',
  'Evaluating technical accuracy…',
  'Preparing your next question…',
];

// Small pause after a question appears before the mic can be used, so the
// experience has a beat between "question shown" and "you may answer now"
// rather than feeling instantaneous.
const PRE_ANSWER_PAUSE_MS = 900;

export default function InterviewScreen() {
  const navigate = useNavigate();
  const { session, setCurrentQuestion, recordAnswer, completeSession } = useInterviewContext();
  const recorder = useVoiceRecorder();
  const voice = useSpeechSynthesis();

  const [phase, setPhase] = useState(PHASES.INTRO);
  const [errorMessage, setErrorMessage] = useState('');
  const [canAnswer, setCanAnswer] = useState(false);

  const hasFetchedInitialQuestion = useRef(false);
  // Kept so a failed evaluate/finish/next-question call can be retried
  // without asking the person to record their answer again.
  const pendingAnswerRef = useRef('');

  const fetchQuestion = useCallback(
    async (prevAnswer) => {
      setErrorMessage('');
      setCanAnswer(false);
      setPhase(PHASES.LOADING_QUESTION);
      try {
        const { question } = await getNextQuestion(prevAnswer);
        setCurrentQuestion(question);
        setPhase(PHASES.READY);
        if (voice.voiceEnabled) voice.speak(question);

        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        setTimeout(() => setCanAnswer(true), prefersReducedMotion ? 0 : PRE_ANSWER_PAUSE_MS);
      } catch (error) {
        setErrorMessage(extractErrorMessage(error));
        setPhase(PHASES.READY);
        setCanAnswer(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setCurrentQuestion]
  );

  // On mount: if resuming a session already in progress (e.g. a refresh
  // mid-question), skip the intro and jump straight to the existing
  // question. Otherwise play the interviewer introduction first.
  useEffect(() => {
    if (hasFetchedInitialQuestion.current) return;
    hasFetchedInitialQuestion.current = true;

    if (session.currentQuestion) {
      setPhase(PHASES.READY);
      setCanAnswer(true);
    }
    // else: stay in PHASES.INTRO: handleIntroComplete triggers the fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIntroComplete = useCallback(() => {
    fetchQuestion('');
  }, [fetchQuestion]);

  // Core auto-flow: evaluate -> silently record -> either finish or fetch
  // the next question. No transcript, no confirmation, no visible
  // per-question score - this should feel like a real interview.
  const submitAnswer = useCallback(
    async (answerText) => {
      pendingAnswerRef.current = answerText;
      setErrorMessage('');
      setPhase(PHASES.PROCESSING);

      // Capture completion locally: session.questionNumber won't reflect
      // recordAnswer's update until the next render.
      const completingNow = session.questionNumber >= session.maxQuestions;

      try {
        const evaluation = await evaluateAnswer(answerText);
        recordAnswer({ question: session.currentQuestion, answer: answerText, evaluation });
      } catch (error) {
        setErrorMessage(extractErrorMessage(error));
        setPhase(PHASES.ERROR_PROCESSING);
        return;
      }

      if (completingNow) {
        try {
          const report = await finishInterview();
          completeSession(report);
          navigate('/report');
        } catch (error) {
          setErrorMessage(extractErrorMessage(error));
          setPhase(PHASES.ERROR_PROCESSING);
        }
        return;
      }

      fetchQuestion(answerText);
    },
    [session.questionNumber, session.maxQuestions, session.currentQuestion, recordAnswer, completeSession, navigate, fetchQuestion]
  );

  const handleStartRecording = async () => {
    setErrorMessage('');
    await recorder.start();
    if (recorder.error) {
      setErrorMessage(recorder.error);
      return;
    }
    voice.stop();
    setPhase(PHASES.RECORDING);
  };

  const handleStopRecording = async () => {
    const blob = await recorder.stop();
    if (!blob) {
      setPhase(PHASES.READY);
      return;
    }
    setPhase(PHASES.PROCESSING);
    try {
      const text = await transcribeAudio(blob);
      if (!text || !text.trim()) {
        setErrorMessage("We couldn't make out an answer in that recording.");
        setPhase(PHASES.ERROR_TRANSCRIPTION);
        return;
      }
      submitAnswer(text.trim());
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
      setPhase(PHASES.ERROR_TRANSCRIPTION);
    }
  };

  const handleReplay = () => {
    if (session.currentQuestion) voice.speak(session.currentQuestion);
  };

  const handleRetryRecording = () => {
    setErrorMessage('');
    setPhase(PHASES.READY);
  };

  if (phase === PHASES.INTRO) {
    return (
      <InterviewIntro
        role={session.role}
        experienceLevel={session.experienceLevel}
        voice={voice}
        onComplete={handleIntroComplete}
      />
    );
  }

  const isRecordingUiVisible = phase === PHASES.READY || phase === PHASES.RECORDING;

  return (
    <section className="mx-auto max-w-xl px-4 pb-20 pt-4 sm:px-6">
      <ProgressBar
        current={Math.min(session.questionNumber, session.maxQuestions)}
        total={session.maxQuestions}
      />

      <div className="mt-8 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        {phase === PHASES.LOADING_QUESTION ? (
          <InterviewSkeleton label="Preparing your next question…" />
        ) : (
          <>
            <p
              key={session.currentQuestion}
              className="animate-fade-up text-lg font-medium leading-relaxed text-zinc-900 dark:text-zinc-100"
            >
              {session.currentQuestion}
            </p>
            {voice.isSupported && (
              <VoiceControls
                voiceEnabled={voice.voiceEnabled}
                isSpeaking={voice.isSpeaking}
                onReplay={handleReplay}
                onToggleVoice={voice.toggleVoice}
                disabled={phase !== PHASES.READY && phase !== PHASES.RECORDING}
              />
            )}
          </>
        )}
      </div>

      {errorMessage && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {phase === PHASES.PROCESSING && <ProcessingTransition messages={PROCESSING_MESSAGES} />}

      {isRecordingUiVisible && (
        <div className="mt-8">
          <RecordingControl
            isRecording={phase === PHASES.RECORDING}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
            disabled={phase === PHASES.READY && !canAnswer}
          />
        </div>
      )}

      {phase === PHASES.ERROR_TRANSCRIPTION && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleRetryRecording}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Try recording again
          </button>
        </div>
      )}

      {phase === PHASES.ERROR_PROCESSING && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => submitAnswer(pendingAnswerRef.current)}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Retry
          </button>
        </div>
      )}
    </section>
  );
}
