import { RotateCcw, Volume2, VolumeX } from 'lucide-react';

export function VoiceControls({ voiceEnabled, isSpeaking, onReplay, onToggleVoice, disabled }) {
  return (
    <div className="mt-3 flex items-center gap-1.5">
      <button
        type="button"
        onClick={onReplay}
        disabled={disabled || !voiceEnabled}
        aria-label="Replay question aloud"
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        <RotateCcw size={13} aria-hidden="true" className={isSpeaking ? 'animate-spin' : ''} />
        Replay
      </button>
      <button
        type="button"
        onClick={onToggleVoice}
        aria-pressed={voiceEnabled}
        aria-label={voiceEnabled ? 'Mute question voice' : 'Unmute question voice'}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        {voiceEnabled ? (
          <Volume2 size={13} aria-hidden="true" />
        ) : (
          <VolumeX size={13} aria-hidden="true" />
        )}
        {voiceEnabled ? 'Voice on' : 'Voice off'}
      </button>
    </div>
  );
}
