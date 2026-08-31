"use client";

/**
 * useWordAudio Hook
 * Provides audio playback for words with recorded clips + Web Speech fallback.
 */

import { useCallback, useEffect, useRef } from "react";
import type { Language } from "@/types";
import { getAudioService } from "@/lib/audio/audioService";

interface UseWordAudioProps {
  language: Language;
  enabled?: boolean;
}

interface UseWordAudioReturn {
  playWord: (word: string, options?: { rate?: number }) => Promise<void>;
  stopAudio: () => void;
  isPlaying: boolean;
}

export function useWordAudio({
  language,
  enabled = true,
}: UseWordAudioProps): UseWordAudioReturn {
  const audioServiceRef = useRef(getAudioService(language));
  const isPlayingRef = useRef(false);

  // Update service if language changes
  useEffect(() => {
    audioServiceRef.current = getAudioService(language);
  }, [language]);

  const playWord = useCallback(
    async (word: string, options?: { rate?: number }) => {
      if (!enabled) return;

      try {
        isPlayingRef.current = true;
        await audioServiceRef.current.playWord(word, {
          volume: 0.8,
          rate: options?.rate ?? 1,
          onComplete: () => {
            isPlayingRef.current = false;
          },
          onError: (error) => {
            console.error("Audio playback error:", error);
            isPlayingRef.current = false;
          },
        });
      } catch (error) {
        console.error("Error playing word:", error);
        isPlayingRef.current = false;
      }
    },
    [enabled]
  );

  const stopAudio = useCallback(() => {
    audioServiceRef.current.stopAudio();
    isPlayingRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    playWord,
    stopAudio,
    isPlaying: isPlayingRef.current,
  };
}
