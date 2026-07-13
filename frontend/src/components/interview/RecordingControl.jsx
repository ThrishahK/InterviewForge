import { useEffect, useState } from 'react';
import { Mic, Square } from 'lucide-react';

const BAR_HEIGHTS = [8, 16, 22, 12, 20, 10, 18];

function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function RecordingControl({ isRecording, onStart, onStop, disabled }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRecording) {
      setElapsed(0);
      return undefined;
    }
    const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {isRecording && (
          <span
            className="absolute inset-0 -m-2 animate-ping rounded-full bg-red-500/30"
            aria-hidden="true"
          />
        )}
        <button
          type="button"
          onClick={isRecording ? onStop : onStart}
          disabled={disabled}
          aria-pressed={isRecording}
          aria-label={isRecording ? 'Stop recording' : 'Start recording your answer'}
          className={`relative inline-flex h-16 w-16 items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
            isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white`}
        >
          {isRecording ? (
            <Square size={20} aria-hidden="true" />
          ) : (
            <Mic size={22} aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="flex h-6 items-center gap-[3px]" aria-hidden="true">
        {BAR_HEIGHTS.map((height, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full bg-indigo-400 dark:bg-indigo-500 ${
              isRecording ? 'animate-wave' : ''
            }`}
            style={{
              height: `${height}px`,
              animationDelay: `${i * 90}ms`,
              transform: isRecording ? undefined : 'scaleY(0.3)',
              opacity: isRecording ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400" aria-live="polite">
        {isRecording ? `Recording… ${formatElapsed(elapsed)} · tap to stop` : 'Tap to answer by voice'}
      </p>
    </div>
  );
}
