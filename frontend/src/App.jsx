import { useState, useEffect, useRef } from "react";
import QuestionBox from "./components/QuestionBox";
import VoiceRecorder from "./components/VoiceRecorder";
import { getNextQuestion, transcribeAudio, evaluateAnswer } from "./api";


function humanizeQuestionText(text) {
  const starters = [
    "Alright…",
    "Okay, let’s begin.",
    "So, to start with…",
    "Let’s start simple.",
    "Alright, first question."
  ];

  const starter = starters[Math.floor(Math.random() * starters.length)];

  // Add natural pauses
  return `${starter}  ${text.replace(/\?/g, "…?")}`;
}



/* =========================
   HUMANIZED TTS HELPERS
========================= */
function getHumanVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Google") ||
          v.name.includes("Microsoft") ||
          v.name.includes("Natural"))
    ) || voices[0]
  );
}

function speakQuestion(text) {
  if (!window.speechSynthesis || !text) return;

  const spokenText = humanizeQuestionText(text);

  const utterance = new SpeechSynthesisUtterance(spokenText);

  const voices = window.speechSynthesis.getVoices();
  utterance.voice =
    voices.find(v => v.name.includes("Microsoft") && v.lang === "en-US") ||
    voices.find(v => v.lang === "en-US") ||
    voices[0];

  utterance.rate = 0.82;   // slower start
  utterance.pitch = 1.08;  // warmth
  utterance.volume = 1.0;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}


/* =========================
        MAIN APP
========================= */
export default function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const lastAnswerRef = useRef("");

  const [numQuestions, setNumQuestions] = useState(5);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [showFinalSummary, setShowFinalSummary] = useState(false);

  /* Load voices once */
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      getHumanVoice();
    };
  }, []);

  /* Speak whenever question changes */
  useEffect(() => {
    if (question) speakQuestion(question);
  }, [question]);

  /* =========================
      INTERVIEW FLOW
  ========================= */
  function startSession() {
    setSessionStarted(true);
    setCurrentQuestionIndex(0);
    setSessionAnswers([]);
    setAllEvaluations([]);
    fetchNextQuestion();
  }

  function endInterview() {
    setShowFinalSummary(true);
  }

  async function fetchNextQuestion(prevAnswer = "") {
    try {
      const data = await getNextQuestion(prevAnswer);
      setQuestion(data.question);
    } catch (err) {
      console.error(err);
      setQuestion("Failed to load question.");
    }
  }

  async function handleVoiceSubmit(audioBlob) {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", audioBlob, "answer.wav");

      const tData = await transcribeAudio(form);
      const answerText = tData.text || "";
      lastAnswerRef.current = answerText;
      setTranscript(answerText);

      const eData = await evaluateAnswer(answerText);
      const safeEval = eData.evaluation|| {
        score: 0,
        strengths: [],
        weaknesses: [],
        suggestions: [],
      };

      setSessionAnswers((prev) => [
        ...prev,
        { question, answer: answerText, evaluation: safeEval },
      ]);
      setAllEvaluations((prev) => [...prev, safeEval]);

      if (currentQuestionIndex + 1 < numQuestions) {
        setCurrentQuestionIndex((i) => i + 1);
        await fetchNextQuestion(answerText);
      } else {
        setShowFinalSummary(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
        FINAL SUMMARY
  ========================= */
  function getFinalSummary() {
    if (!allEvaluations.length) return null;

    const avgScore =
      allEvaluations.reduce((s, e) => s + (e.score || 0), 0) /
      allEvaluations.length;

    return {
      avgScore,
      strengths: allEvaluations.flatMap((e) => e.strengths || []),
      weaknesses: allEvaluations.flatMap((e) => e.weaknesses || []),
      suggestions: allEvaluations.flatMap((e) => e.suggestions || []),
    };
  }

  /* =========================
            UI
  ========================= */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">AI Interview — Voice</h1>

        {!sessionStarted ? (
          <div className="bg-white p-6 rounded shadow">
            <label className="block mb-2">Number of questions:</label>
            <input
              type="number"
              min="1"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="border p-2 rounded w-20"
            />
            <button
              onClick={startSession}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <>
            <QuestionBox
              question={question}
              currentIndex={currentQuestionIndex}
              total={numQuestions}
            />

            <div className="mt-6 bg-white p-6 rounded shadow">
              <VoiceRecorder onSubmit={handleVoiceSubmit} disabled={loading} />
              {loading && (
                <div className="mt-3 text-sm text-gray-600">Processing…</div>
              )}
            </div>

            <button
              onClick={endInterview}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              End Interview
            </button>

            {showFinalSummary && (
              <div className="mt-8 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">
                  Final Interview Summary
                </h2>
                {(() => {
                  const summary = getFinalSummary();
                  if (!summary) return null;
                  return (
                    <>
                      <p>
                        <strong>Average Score:</strong>{" "}
                        {summary.avgScore.toFixed(1)}
                      </p>
                      <h3 className="mt-2 font-semibold">Strengths</h3>
                      <ul>{summary.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                      <h3 className="mt-2 font-semibold">Weaknesses</h3>
                      <ul>{summary.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                      <h3 className="mt-2 font-semibold">Suggestions</h3>
                      <ul>{summary.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </>
                  );
                })()}
              </div>
            )}
          </>
        )}

        <footer className="mt-6 text-xs text-gray-400">
          Backend: {import.meta.env.VITE_API_URL}
        </footer>
      </div>
    </div>
  );
}
