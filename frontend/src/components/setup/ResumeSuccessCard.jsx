import { CheckCircle2 } from 'lucide-react';
import { humanFileSize } from '../../utils/humanFileSize';

export function ResumeSuccessCard({ file, uploadedAt }) {
  return (
    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <CheckCircle2 size={16} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Resume uploaded and parsed successfully
          </p>
          <p className="mt-1 text-sm leading-relaxed text-emerald-700/90 dark:text-emerald-300/80">
            Interview questions will now be personalized using your resume.
          </p>
          {(file || uploadedAt) && (
            <p className="mt-2 text-xs text-emerald-700/70 dark:text-emerald-400/70">
              {file?.name}
              {file?.size ? ` \u00b7 ${humanFileSize(file.size)}` : ''}
              {uploadedAt ? ` \u00b7 ${uploadedAt}` : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
