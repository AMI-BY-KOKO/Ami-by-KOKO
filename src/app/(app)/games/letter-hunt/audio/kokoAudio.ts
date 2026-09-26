import { useCallback, useEffect, useRef } from 'react';
import type { Question } from '../content/questions';

export type KokoAudioCategory = 'words' | 'instructions' | 'feedback';
export type KokoAudioPath = string | null;
type KokoAudioOptions = {
  browserSpeechRate?: number;
};

/**
 * Natural Kòkò recordings can be added here as they become available.
 * Null entries intentionally use browser speech without requesting a
 * nonexistent file.
 */
export const KOKO_AUDIO = {
  words: {
    agbado: null,
    apple: null,
    ant: null,
    airplane: null,
    banana: null,
    ball: null,
    bus: null,
    book: null,
    cat: null,
    car: null,
    cake: null,
    cup: null,
    drum: null,
    dog: null,
    duck: null,
    door: null,
    egg: null,
    elephant: null,
    envelope: null,
    ear: null,
    fish: null,
    frog: null,
    flower: null,
    fox: null,
  } satisfies Record<string, KokoAudioPath>,
  instructions: {
    welcome: null,
    adventureMap: null,
    howToPlay: null,
    soundSafari: null,
    pictureHunt: null,
  } satisfies Record<string, KokoAudioPath>,
  feedback: {
    greatJob: null,
    youGotIt: null,
    amazing: null,
    tryAgain: null,
    listenOnceMore: null,
  } satisfies Record<string, KokoAudioPath>,
} as const;

export function getKokoAudioPath(category: KokoAudioCategory, key: string): KokoAudioPath {
  return KOKO_AUDIO[category][key as keyof (typeof KOKO_AUDIO)[typeof category]] ?? null;
}

export function getQuestionAudioPath(question: Pick<Question, 'id' | 'audio'>): KokoAudioPath {
  return question.audio ?? (KOKO_AUDIO.words as Record<string, KokoAudioPath>)[question.id] ?? null;
}

function preferredVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => /female|samantha|karen|moira|zira|google us english/i.test(voice.name))
    ?? voices.find((voice) => /^en(-|_)/i.test(voice.lang));
}

export function useKokoAudio(enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audioRef.current = null;
  }, []);

  const stop = useCallback(() => {
    stopAudio();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [stopAudio]);

  const speakFallback = useCallback((text: string, rate = 0.92) => {
    if (
      !enabled
      || typeof text !== 'string'
      || !text.trim()
      || /\b(undefined|null)\b/i.test(text)
      || typeof window === 'undefined'
      || !('speechSynthesis' in window)
    ) return;

    try {
      stopAudio();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = preferredVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech is a fallback; unsupported browsers should keep playing.
    }
  }, [enabled, stopAudio]);

  const play = useCallback((text: string, audioPath: KokoAudioPath = null, options: KokoAudioOptions = {}) => {
    if (!enabled) return;
    const browserSpeechRate = options.browserSpeechRate ?? 0.92;

    if (audioPath && typeof window !== 'undefined') {
      try {
        stop();
        const audio = new Audio(new URL(audioPath, document.baseURI).toString());
        audioRef.current = audio;
        const fallbackToSpeech = () => {
          if (audioRef.current !== audio) return;
          audioRef.current = null;
          speakFallback(text, browserSpeechRate);
        };
        audio.addEventListener('error', fallbackToSpeech, { once: true });
        void audio.play().catch(fallbackToSpeech);
        return;
      } catch {
        // Missing or unsupported audio falls back to browser speech below.
      }
    }

    speakFallback(text, browserSpeechRate);
  }, [enabled, speakFallback, stop]);

  useEffect(() => () => {
    stop();
  }, [stop]);

  return { play, stop };
}