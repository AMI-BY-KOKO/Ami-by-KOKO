"use client";

/**
 * useWordBuilder — manages Word Builder game state and persistence.
 * Handles language selection, progress tracking, level progression, and daily words.
 *
 * Uses localStorage for session state + Supabase for persistent progress.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Language } from "@/types";
import type {
  WordBuilderProgress,
  DailyWordState,
  Word,
  WordChallenge,
} from "@/lib/wordBuilder/types";
import {
  getWordsForLevel,
  getRandomWord,
  shuffleArray,
} from "@/lib/wordBuilder/wordDatasets";
import { LEVEL_CONFIGS } from "@/lib/wordBuilder/types";

const STORAGE_KEY_LANGUAGE = "wordBuilder_language";
const STORAGE_KEY_SESSION = "wordBuilder_session";

export function useWordBuilder() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // ─── Get Current User ───────────────────────────────────────────────────
  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("[useWordBuilder] auth error:", error);
          setAuthError(error.message);
          return;
        }
        if (!user) {
          console.warn("[useWordBuilder] no authenticated user");
          return;
        }
        console.log("[useWordBuilder] authenticated user:", user.id);
        setUserId(user.id);
      } catch (err) {
        console.error("[useWordBuilder] getUser exception:", err);
        setAuthError(err instanceof Error ? err.message : "Unknown auth error");
      }
    }
    getUser();
  }, [supabase]);

  // ─── Language Selection ──────────────────────────────────────────────────
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isLoadingLanguage, setIsLoadingLanguage] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoadingLanguage(false);
      return;
    }

    // Try to load saved language preference from localStorage
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY_LANGUAGE) : null;
    if (saved && ["english", "yoruba", "french", "igbo", "hausa"].includes(saved)) {
      setSelectedLanguage(saved as Language);
    }

    setIsLoadingLanguage(false);
  }, [userId]);

  const selectLanguage = useCallback((language: Language) => {
    setSelectedLanguage(language);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, language);
    }
  }, []);

  // ─── Progress State ──────────────────────────────────────────────────────
  const [progress, setProgress] = useState<WordBuilderProgress | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !selectedLanguage) {
      console.log("[useWordBuilder] skipping fetch - userId:", userId, "language:", selectedLanguage);
      return;
    }

    async function fetchProgress() {
      setIsLoadingProgress(true);
      setError(null);

      try {
        console.log("[useWordBuilder] fetching progress for user:", userId, "language:", selectedLanguage);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: err } = await (supabase as any)
          .from("word_builder_progress")
          .select("*")
          .eq("user_id", userId)
          .eq("language", selectedLanguage)
          .single();

        if (err) {
          if (err.code === "PGRST116") {
            // No rows found - first time
            console.log("[useWordBuilder] first time user - creating initial progress");
          } else {
            console.error("[useWordBuilder] fetch error details:", {
              code: err.code,
              message: err.message,
              details: err.details,
              hint: err.hint,
            });
            throw err;
          }
        }

        if (data) {
          console.log("[useWordBuilder] loaded progress:", data);
          setProgress(data as WordBuilderProgress);
        } else {
          // First time — create initial progress
          if (!userId || !selectedLanguage) return;

          console.log("[useWordBuilder] creating initial progress record");

          const initial: Partial<WordBuilderProgress> = {
            user_id: userId,
            language: selectedLanguage,
            current_level: 1,
            current_word_index: 0,
            words_completed: 0,
            stars_earned: 0,
            streak_count: 0,
            last_streak_date: new Date().toISOString().split("T")[0] || "",
            word_garden_seeds: 0,
            daily_word_completed_today: false,
            last_daily_word_date: "",
            mastered_words: [],
            last_synced: new Date().toISOString(),
          };

          console.log("[useWordBuilder] insert payload:", initial);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: created, error: createErr } = await (supabase as any)
            .from("word_builder_progress")
            .insert([initial])
            .select()
            .single();

          if (createErr) {
            console.error("[useWordBuilder] create error details:", {
              code: createErr.code,
              message: createErr.message,
              details: createErr.details,
              hint: createErr.hint,
            });
            throw createErr;
          }
          console.log("[useWordBuilder] created progress:", created);
          setProgress(created as WordBuilderProgress);
        }
      } catch (err) {
        console.error("[useWordBuilder] fetch exception:", err);
        const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
        setError(`Failed to load progress: ${errorMessage}`);
      } finally {
        setIsLoadingProgress(false);
      }
    }

    fetchProgress();
  }, [userId, selectedLanguage, supabase]);

  // ─── Current Challenge ───────────────────────────────────────────────────
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  const generateChallenge = useCallback(() => {
    if (!progress || !selectedLanguage) return;

    const level = progress.current_level as 1 | 2 | 3 | 4 | 5;
    const word = getRandomWord(selectedLanguage, level);

    if (!word) {
      console.error("[useWordBuilder] no words for level", level);
      return;
    }

    const correctOrder = word.word.split("");
    const levelConfig = LEVEL_CONFIGS[level];
    const distractors: string[] = [];

    // Add distractor letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < levelConfig.distractorLetterCount; i++) {
      let letter = alphabet[Math.floor(Math.random() * alphabet.length)];
      while (correctOrder.includes(letter) || distractors.includes(letter)) {
        letter = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      distractors.push(letter);
    }

    const allLetters = [...correctOrder, ...distractors];
    const shuffled = shuffleArray(allLetters);

    setCurrentChallenge({
      word,
      letters: shuffled,
      correctOrder,
      distractorLetters: distractors,
    });
    setSelectedLetters([]);
    setHintsUsed(0);
    setAttemptCount(0);
  }, [progress, selectedLanguage]);

  useEffect(() => {
    if (progress && !currentChallenge) {
      generateChallenge();
    }
  }, [progress, currentChallenge, generateChallenge]);

  // ─── Letter Selection ────────────────────────────────────────────────────
  const selectLetter = useCallback(
    (letter: string) => {
      setSelectedLetters(prev => [...prev, letter]);
    },
    []
  );

  const deselectLastLetter = useCallback(() => {
    setSelectedLetters(prev => prev.slice(0, -1));
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedLetters([]);
  }, []);

  // ─── Answer Validation ───────────────────────────────────────────────────
  const submitAnswer = useCallback((): boolean => {
    if (!currentChallenge) return false;

    const isCorrect = selectedLetters.join("") === currentChallenge.correctOrder.join("");

    if (!isCorrect) {
      setAttemptCount(prev => prev + 1);
      setSelectedLetters([]);
    }

    return isCorrect;
  }, [selectedLetters, currentChallenge]);

  // ─── Hint System ────────────────────────────────────────────────────────
  const getHint = useCallback((): string | null => {
    if (!currentChallenge || !progress) return null;

    const level = progress.current_level as 1 | 2 | 3 | 4 | 5;
    const levelConfig = LEVEL_CONFIGS[level];

    if (hintsUsed >= levelConfig.hintsAvailable) return null;

    setHintsUsed(prev => prev + 1);

    // Hint progression: encouragement → highlight first letter → audio
    if (attemptCount === 0) {
      return "encouragement";
    } else if (attemptCount === 1) {
      return `highlight:${currentChallenge.correctOrder[0]}`;
    } else {
      return `audio:${currentChallenge.correctOrder[0]}`;
    }
  }, [currentChallenge, hintsUsed, attemptCount, progress]);

  // ─── Progress Updates ────────────────────────────────────────────────────
  const recordCompletion = useCallback(async (starsEarned: 1 | 2 | 3) => {
    if (!progress || !currentChallenge || !userId) return;

    try {
      const updated: Partial<WordBuilderProgress> = {
        words_completed: progress.words_completed + 1,
        stars_earned: progress.stars_earned + starsEarned,
        word_garden_seeds: progress.word_garden_seeds + 1,
        last_synced: new Date().toISOString(),
        mastered_words: [...progress.mastered_words, currentChallenge.word.id],
      };

      // Check if level is complete
      const levelConfig = LEVEL_CONFIGS[progress.current_level];
      if (progress.words_completed + 1 >= levelConfig.wordsPerLevel) {
        updated.current_level = Math.min(progress.current_level + 1, 5) as 1 | 2 | 3 | 4 | 5;
        updated.current_word_index = 0;
      } else {
        updated.current_word_index = progress.current_word_index + 1;
      }

      // Update streak
      const today = new Date().toISOString().split("T")[0];
      if (progress.last_streak_date === today) {
        updated.streak_count = progress.streak_count + 1;
      } else {
        updated.streak_count = 1;
        updated.last_streak_date = today;
      }

      // Upsert to Supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newData, error: err } = await (supabase as any)
        .from("word_builder_progress")
        .update(updated)
        .eq("user_id", userId)
        .eq("language", selectedLanguage)
        .select()
        .single();

      if (err) throw err;

      setProgress(newData as WordBuilderProgress);
      setCurrentChallenge(null); // Trigger new challenge generation
    } catch (err) {
      console.error("[useWordBuilder] record completion error:", err);
    }
  }, [progress, currentChallenge, userId, selectedLanguage, supabase]);

  // ─── Daily Word ─────────────────────────────────────────────────────────
  const getDailyWord = useCallback((): Word | null => {
    if (!selectedLanguage) return null;

    // Use a consistent word based on day of year
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );

    // Pick a random level (weighted to levels 2–3)
    const level = Math.random() > 0.5 ? (2 as const) : (3 as const);
    const words = getWordsForLevel(selectedLanguage, level);

    if (words.length === 0) return null;

    return words[dayOfYear % words.length];
  }, [selectedLanguage]);

  const completeDailyWord = useCallback(async () => {
    if (!progress || !userId) return;

    const today = new Date().toISOString().split("T")[0];

    try {
      const updated: Partial<WordBuilderProgress> = {
        stars_earned: progress.stars_earned + 10,
        daily_word_completed_today: true,
        last_daily_word_date: today,
        last_synced: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newData, error: err } = await (supabase as any)
        .from("word_builder_progress")
        .update(updated)
        .eq("user_id", userId)
        .eq("language", selectedLanguage)
        .select()
        .single();

      if (err) throw err;

      setProgress(newData as WordBuilderProgress);
    } catch (err) {
      console.error("[useWordBuilder] daily word error:", err);
    }
  }, [progress, userId, selectedLanguage, supabase]);

  return {
    // Language
    selectedLanguage,
    selectLanguage,
    isLoadingLanguage,

    // Progress
    progress,
    isLoadingProgress,
    error,

    // Current challenge
    currentChallenge,
    selectedLetters,
    hintsUsed,
    attemptCount,

    // Actions
    generateChallenge,
    selectLetter,
    deselectLastLetter,
    resetSelection,
    submitAnswer,
    getHint,
    recordCompletion,

    // Daily word
    getDailyWord,
    completeDailyWord,
  };
}
