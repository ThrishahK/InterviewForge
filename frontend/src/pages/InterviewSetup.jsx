import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useInterviewContext } from '../context/InterviewContext';
import { SegmentedControl } from '../components/setup/SegmentedControl';
import { Stepper } from '../components/setup/Stepper';

const EXPERIENCE_OPTIONS = [
  { value: 'Entry-level', label: 'Entry-level' },
  { value: 'Mid-level', label: 'Mid-level' },
  { value: 'Senior', label: 'Senior' },
];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { session, saveDraft } = useInterviewContext();

  const [role, setRole] = useState(session.role || '');
  const [experienceLevel, setExperienceLevel] = useState(
    session.experienceLevel || EXPERIENCE_OPTIONS[1].value
  );
  const [maxQuestions, setMaxQuestions] = useState(session.maxQuestions || 10);
  const [touched, setTouched] = useState(false);

  const roleIsValid = role.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!roleIsValid) return;

    saveDraft({ role: role.trim(), experienceLevel, maxQuestions });
    navigate('/resume-upload');
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-20 animate-fade-up">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        Step 1 of 2
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
        Set up your interview
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Tell us what you're practicing for. You can add your resume next, or skip straight in.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">
        <div>
          <label
            htmlFor="role"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Role
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g. Frontend Engineer"
            aria-invalid={touched && !roleIsValid}
            aria-describedby={touched && !roleIsValid ? 'role-error' : undefined}
            className={`mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-offset-2 dark:bg-zinc-900 dark:text-zinc-100 ${
              touched && !roleIsValid
                ? 'border-red-400 dark:border-red-500/60'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          />
          {touched && !roleIsValid && (
            <p id="role-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              Enter a role to continue.
            </p>
          )}
        </div>

        <SegmentedControl
          label="Experience level"
          name="experienceLevel"
          options={EXPERIENCE_OPTIONS}
          value={experienceLevel}
          onChange={setExperienceLevel}
        />

        <Stepper
          id="maxQuestions"
          label="Number of questions"
          value={maxQuestions}
          onChange={setMaxQuestions}
        />

        <button
          type="submit"
          className="group inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-700 hover:scale-[1.02] active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Continue
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </form>
    </section>
  );
}
