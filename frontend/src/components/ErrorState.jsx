import { AlertCircle } from 'lucide-react';

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-500/30 dark:bg-red-500/10">
      <AlertCircle size={20} className="text-red-600 dark:text-red-400" aria-hidden="true" />
      <p className="mt-3 text-sm text-red-700 dark:text-red-400">
        {message || 'Something went wrong.'}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md border border-red-300 px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          Try again
        </button>
      )}
    </div>
  );
}
