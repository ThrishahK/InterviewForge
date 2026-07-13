import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useInterviewContext } from '../context/InterviewContext';
import { uploadResume } from '../services/resumeService';
import { startInterview } from '../services/interviewService';
import { extractErrorMessage } from '../services/apiClient';
import { ResumeDropzone } from '../components/setup/ResumeDropzone';
import { AnalyzingSkeleton } from '../components/setup/AnalyzingSkeleton';
import { ResumeSuccessCard } from '../components/setup/ResumeSuccessCard';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const { session, startInterview: startInterviewInContext } = useInterviewContext();

  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedAt, setUploadedAt] = useState('');

  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState('');

  const handleFileSelected = async (selectedFile) => {
    setFile(selectedFile);
    setAnalysis(null);
    setUploadError('');
    setIsUploading(true);
    try {
      const result = await uploadResume(selectedFile);
      setAnalysis(result);
      setUploadedAt(
        new Date().toLocaleString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      );
    } catch (error) {
      // analyze_resume() raises on bad LLM JSON, so this is a real, expected
      // failure mode - not just a network hiccup. Keep the flow moving:
      // the resume step must remain skippable regardless of outcome.
      setUploadError(extractErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setAnalysis(null);
    setUploadError('');
  };

  const proceedToInterview = async (withResume) => {
    setStartError('');
    setIsStarting(true);
    try {
      const { interview_id: interviewId } = await startInterview({
        role: session.role,
        experienceLevel: session.experienceLevel,
        resumeUploaded: withResume,
        maxQuestions: session.maxQuestions,
      });

      startInterviewInContext({
        interviewId,
        role: session.role,
        experienceLevel: session.experienceLevel,
        maxQuestions: session.maxQuestions,
        resumeUploaded: withResume,
        resumeAnalysis: withResume ? analysis : null,
      });

      navigate('/interview');
    } catch (error) {
      setStartError(extractErrorMessage(error));
    } finally {
      setIsStarting(false);
    }
  };

  const hasUsableResume = Boolean(analysis) && !uploadError;

  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        Step 2 of 2
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
        Add your resume
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Optional &mdash; questions can draw on your real experience. You can skip this entirely.
      </p>

      <div className="mt-8">
        <ResumeDropzone
          file={file}
          onFileSelected={handleFileSelected}
          onClear={handleClearFile}
          disabled={isUploading || isStarting}
        />

        {isUploading && <AnalyzingSkeleton />}

        {!isUploading && uploadError && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              Couldn't read that resume ({uploadError}). You can try a different file, or skip
              this step &mdash; it won't affect the rest of the interview.
            </span>
          </div>
        )}

        {!isUploading && hasUsableResume && (
          <ResumeSuccessCard file={file} uploadedAt={uploadedAt} />
        )}
      </div>

      {startError && (
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>Couldn't start the interview ({startError}). Please try again.</span>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => proceedToInterview(hasUsableResume)}
          disabled={isUploading || isStarting}
          className="group inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isStarting ? 'Starting interview…' : 'Continue'}
          {!isStarting && (
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          )}
        </button>

        {(file || hasUsableResume) && (
          <button
            type="button"
            onClick={() => proceedToInterview(false)}
            disabled={isUploading || isStarting}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Skip resume and continue
          </button>
        )}
      </div>
    </section>
  );
}
