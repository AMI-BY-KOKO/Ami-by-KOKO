import { useCallback, useEffect, useState } from "react";
import {
  calculatePerformanceMetrics,
  getDifficultyLevel,
  getDifficultyConfig,
  getSupportMessage,
  getEncouragementMessage,
  shouldAdjustDifficulty,
  shouldProvideExtraSupport,
  type DifficultyLevel,
  type DifficultyConfig,
  type PerformanceMetrics,
} from "@/lib/wordBuilder/adaptiveDifficulty";

interface UseAdaptiveDifficultyProps {
  initialLevel?: DifficultyLevel;
  onDifficultyChange?: (level: DifficultyLevel, config: DifficultyConfig) => void;
}

interface UseAdaptiveDifficultyReturn {
  difficulty: DifficultyLevel;
  config: DifficultyConfig;
  metrics: PerformanceMetrics;
  recordWord: (correct: boolean, attempts: number, hintsUsed: number) => void;
  supportMessage: string | null;
  encouragementMessage: string;
  shouldShowExtraSupport: boolean;
  resetMetrics: () => void;
}

export function useAdaptiveDifficulty({
  initialLevel = "normal",
  onDifficultyChange,
}: UseAdaptiveDifficultyProps): UseAdaptiveDifficultyReturn {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialLevel);
  const [wordHistory, setWordHistory] = useState<
    Array<{ correct: boolean; attempts: number; hintsUsed: number }>
  >([]);
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [currentHintsUsed, setCurrentHintsUsed] = useState(0);

  // Calculate metrics from history
  const metrics = calculatePerformanceMetrics(wordHistory);
  const config = getDifficultyConfig(difficulty);
  const supportMessage = getSupportMessage(metrics, difficulty);
  const encouragementMessage = getEncouragementMessage(metrics);
  const shouldShowExtraSupport = shouldProvideExtraSupport(
    metrics,
    currentAttempts,
    currentHintsUsed
  );

  // Record a completed word
  const recordWord = useCallback(
    (correct: boolean, attempts: number, hintsUsed: number) => {
      setWordHistory((prev) => [
        ...prev,
        { correct, attempts, hintsUsed },
      ]);
      setCurrentAttempts(0);
      setCurrentHintsUsed(0);
    },
    []
  );

  // Track current word attempts
  const trackAttempt = useCallback(() => {
    setCurrentAttempts((prev) => prev + 1);
  }, []);

  const trackHintUsed = useCallback(() => {
    setCurrentHintsUsed((prev) => prev + 1);
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setWordHistory([]);
    setCurrentAttempts(0);
    setCurrentHintsUsed(0);
    setDifficulty(initialLevel);
  }, [initialLevel]);

  // Check if difficulty should be adjusted
  useEffect(() => {
    if (shouldAdjustDifficulty([metrics])) {
      const newLevel = getDifficultyLevel(metrics);
      if (newLevel !== difficulty) {
        setDifficulty(newLevel);
        const newConfig = getDifficultyConfig(newLevel);
        if (onDifficultyChange) {
          onDifficultyChange(newLevel, newConfig);
        }
      }
    }
  }, [metrics.wordsCompleted, difficulty, onDifficultyChange]);

  return {
    difficulty,
    config,
    metrics,
    recordWord,
    supportMessage,
    encouragementMessage,
    shouldShowExtraSupport,
    resetMetrics,
  };
}
