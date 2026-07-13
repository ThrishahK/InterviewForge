import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * useSpeechSynthesis
 *
 * Thin wrapper around window.speechSynthesis. Voice is explicitly optional
 * per the brief: if the browser blocks unprompted speech (autoplay-style
 * policies) or has no support at all, the Replay button still lets the
 * person trigger it manually, and the rest of the interview works exactly
 * the same either way.
 */
export function useSpeechSynthesis() {
  const [voiceEnabled, setVoiceEnabled] = useLocalStorage('interviewforge:voiceEnabled', true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      if (prev) stop();
      return !prev;
    });
  }, [setVoiceEnabled, stop]);

  return { isSupported, voiceEnabled, isSpeaking, speak, stop, toggleVoice };
}
