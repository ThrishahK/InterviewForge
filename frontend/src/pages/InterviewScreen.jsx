import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Keyboard, Send } from 'lucide-react';

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

// Phases within a single question round. Distinct from session.status
// ('active' | 'finished'), which tracks the interview as a whole.
// Per-question scoring is intentionally never shown here - only collected
// silently via recordAnswer() for the Final Report to aggregate later.
const PHASES = {
  LOADING_QUESTION: 'loading-question',
  READY: 'ready',
  RECORDING: 'recording',
  MANUAL_ENTRY: 'manual-entry',
  PROCESSING: 'processing',
  ERROR_TRANSCRIPTION: 'error-transcription',
  ERROR_PROCESSING: 'error-processing',
};

const PROCESSING_MESSAGES = [
  'Answer received.',
  'Analyzing your response…',
  'Evaluating technical accuracy…',
  'Preparing your next question…',
];

export default function InterviewScreen() {
  const navigate = useNavigate();
  const { session, setCurrentQuestion, recordAnswer, completeSession } = useInterviewContext();
  const recorder = useVoiceRecorder();
  const voice = useSpeechSynthesis();

  const [phase, setPhase] = useState(PHASES.LOADING_QUESTION);
  const [manualText, setManualText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const hasFetchedInitialQuestion = useRef(false);
  // Kept so a failed evaluate/finish/next-question call can be retried
  // without asking the person to record their answer again.
  const pendingAnswerRef = useRef('');

  const fetchQuestion = useCallback(
    async (prevAnswer) => {
      setErrorMessage('');
      setPhase(PHASES.LOADING_QUESTION);
      try {
        const { question } = await getNextQuestion(prevAnswer);
        setCurrentQuestion(question);
        setManualText('');
        setPhase(PHASES.READY);
        if (voice.voiceEnabled) voice.speak(question);
      } catch (error) {
        setErrorMessage(extractErrorMessage(error));
        setPhase(PHASES.READY);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setCurrentQuestion]
  );

  // Fetch the first question once. If a question is already in the
  // persisted session (e.g. the user refreshed mid-question), resume with
  // that instead of fetching a new one (and don't re-speak on resume).
  useEffect(() => {
    if (hasFetchedInitialQuestion.current) return;
    hasFetchedInitialQuestion.current = true;

    if (session.currentQuestion) {
      setPhase(PHASES.READY);
    } else {
      fetchQuestion('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Core auto-flow: evaluate -> silently record -> either finish or fetch
  // the next question. No transcript confirmation, no visible per-question
  // score - the brief is explicit that this should feel like a real
  // interview, not a quiz with instant grading.
  const submitAnswer = useCallback(
    async (answerText) => {
      pendingAnswerRef.current = answerText;
      setErrorMessage('');
      setPhase(PHASES.PROCESSING);

      // Capture completion locally: session.questionNumber won't reflect
      // recordAnswer's update until the next render, so isSessionComplete
      // from context would still read stale here.
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
        setErrorMessage('We couldn\u2019t make out an answer in that recording.');
        setPhase(PHASES.ERROR_TRANSCRIPTION);
        return;
      }
      submitAnswer(text.trim());
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
      setPhase(PHASES.ERROR_TRANSCRIPTION);
    }
  };

  const handleManualSubmit = () => {
    if (!manualText.trim()) return;
    submitAnswer(manualText.trim());
  };

  const handleReplay = () => {
    if (session.currentQuestion) voice.speak(session.currentQuestion);
  };

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
          />
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setPhase(PHASES.MANUAL_ENTRY)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <Keyboard size={14} aria-hidden="true" />
              Type your answer instead
            </button>
          </div>
        </div>
      )}

      {(phase === PHASES.MANUAL_ENTRY || phase === PHASES.ERROR_TRANSCRIPTION) && (
        <div className="mt-8">
          <label
            htmlFor="answer-text"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {phase === PHASES.ERROR_TRANSCRIPTION ? 'Type your answer instead' : 'Your answer'}
          </label>
          <textarea
            id="answer-text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            rows={5}
            placeholder="Type your answer here…"
            className="mt-2 w-full rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleManualSubmit}
              disabled={!manualText.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Submit answer
              <Send size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setManualText('');
                setErrorMessage('');
                setPhase(PHASES.READY);
              }}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {phase === PHASES.ERROR_TRANSCRIPTION ? 'Try recording again' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {phase === PHASES.ERROR_PROCESSING && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => submitAnswer(pendingAnswerRef.current)}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Retry
          </button>
        </div>
      )}
    </section>
  );
}
