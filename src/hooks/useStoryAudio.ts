"use client";

/**
 * useStoryAudio — manages page-level text-to-speech for story reader
 * Uses the existing audioService abstraction layer
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { getAudioService } from "@/lib/audio/audioService";
import type { Language } from "@/types";

interface UseStoryAudioOptions {
  language?: Language;
}

export function useStoryAudio(options: UseStoryAudioOptions = {}) {
  const { language = "english" } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioServiceRef = useRef(getAudioService(language));

  // Update audio service if language changes
  useEffect(() => {
    audioServiceRef.current = getAudioService(language);
  }, [language]);

  const play = useCallback(
    async (text: string) => {
      if (!text || isPlaying) return;

      setIsPlaying(true);
      setError(null);

      try {
        await audioServiceRef.current.playWord(text, {
          volume: 0.85,
          rate: 0.9, // Slightly slower for clarity
          onComplete: () => {
            setIsPlaying(false);
          },
          onError: (err) => {
            console.error("Story audio playback error:", err);
            setError(err.message);
            setIsPlaying(false);
          },
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Audio playback failed";
        console.error("useStoryAudio play error:", err);
        setError(errorMessage);
        setIsPlaying(false);
      }
    },
    [isPlaying]
  );

  const pause = useCallback(() => {
    audioServiceRef.current.stopAudio();
    setIsPlaying(false);
  }, []);

  const replay = useCallback(
    (text: string) => {
      pause();
      // Small delay to ensure audio is fully stopped
      setTimeout(() => {
        play(text);
      }, 100);
    },
    [play, pause]
  );

  return {
    isPlaying,
    error,
    play,
    pause,
    replay,
  };
}
