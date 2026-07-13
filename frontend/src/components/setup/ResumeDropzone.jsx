import { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

const ACCEPTED_TYPES = '.pdf,.doc,.docx,.txt';
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB, generous for a resume file

export function ResumeDropzone({ file, onFileSelected, onClear, disabled }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateAndSelect = (candidate) => {
    if (!candidate) return;
    if (candidate.size > MAX_SIZE_BYTES) {
      setValidationError('That file is larger than 10MB. Try a smaller file.');
      return;
    }
    setValidationError('');
    onFileSelected(candidate);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    validateAndSelect(e.dataTransfer.files?.[0]);
  };

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FileText size={16} aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {file.name}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          aria-label="Remove selected resume"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 disabled:opacity-40 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors disabled:opacity-50 ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-50/50 dark:border-indigo-500/60 dark:bg-indigo-500/5'
            : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
        }`}
      >
        <UploadCloud
          size={22}
          className="text-zinc-400 dark:text-zinc-500"
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Click to upload, or drag a file here
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">PDF, DOC, DOCX, or TXT</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={(e) => validateAndSelect(e.target.files?.[0])}
        className="sr-only"
        aria-label="Upload resume file"
      />
      {validationError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{validationError}</p>
      )}
    </div>
  );
}
