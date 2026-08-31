/**
 * Adaptive Difficulty System
 * Monitors player performance (accuracy, attempts, hints used) and adjusts challenge accordingly.
 * Provides hints and support when struggling, increases difficulty when mastering.
 */

export interface PerformanceMetrics {
  wordsCompleted: number;
  correctFirstAttempt: number; // Solved without errors
  hintsUsed: number;
  averageAttempts: number; // Average attempts per word
  accuracy: number; // 0-1, percentage of first-attempt successes
  recentStruggle: boolean; // Last 3 words had issues
}

export type DifficultyLevel = "easy" | "normal" | "hard" | "very-hard";

export interface DifficultyConfig {
  level: DifficultyLevel;
  distractorCount: number; // Number of wrong letters
  hintsAvailable: number;
  showImages: boolean;
  audioAvailable: boolean;
  encouragement: "frequent" | "moderate" | "minimal";
}

/**
 * Calculate performance metrics from game history
 */
export function calculatePerformanceMetrics(
  wordHistory: Array<{
    correct: boolean;
    attempts: number;
    hintsUsed: number;
  }>
): PerformanceMetrics {
  if (wordHistory.length === 0) {
    return {
      wordsCompleted: 0,
      correctFirstAttempt: 0,
      hintsUsed: 0,
      averageAttempts: 0,
      accuracy: 0,
      recentStruggle: false,
    };
  }

  const correctFirstAttempt = wordHistory.filter(
    (w) => w.correct && w.attempts === 1 && w.hintsUsed === 0
  ).length;
  const totalHints = wordHistory.reduce((sum, w) => sum + w.hintsUsed, 0);
  const avgAttempts =
    wordHistory.reduce((sum, w) => sum + w.attempts, 0) / wordHistory.length;
  const accuracy = correctFirstAttempt / wordHistory.length;

  // Check recent struggle (last 3 words)
  const recentWords = wordHistory.slice(-3);
  const recentStruggle =
    recentWords.length > 0 &&
    recentWords.some((w) => w.attempts > 2 || w.hintsUsed > 1);

  return {
    wordsCompleted: wordHistory.length,
    correctFirstAttempt,
    hintsUsed: totalHints,
    averageAttempts: avgAttempts,
    accuracy,
    recentStruggle,
  };
}

/**
 * Determine appropriate difficulty level based on performance
 */
export function getDifficultyLevel(metrics: PerformanceMetrics): DifficultyLevel {
  // Need at least 5 words to make accurate assessment
  if (metrics.wordsCompleted < 5) {
    return "normal";
  }

  // If struggling recently, ease difficulty
  if (metrics.recentStruggle) {
    return "easy";
  }

  // High accuracy → increase difficulty
  if (metrics.accuracy >= 0.9 && metrics.averageAttempts < 1.3) {
    return metrics.averageAttempts < 1.1 ? "very-hard" : "hard";
  }

  // Good accuracy → normal/hard
  if (metrics.accuracy >= 0.7 && metrics.averageAttempts < 1.8) {
    return "hard";
  }

  // Moderate accuracy → normal
  if (metrics.accuracy >= 0.5) {
    return "normal";
  }

  // Low accuracy → easy
  return "easy";
}

/**
 * Get difficulty configuration for a given level
 */
export function getDifficultyConfig(level: DifficultyLevel): DifficultyConfig {
  const configs: Record<DifficultyLevel, DifficultyConfig> = {
    easy: {
      level: "easy",
      distractorCount: 1, // Fewer wrong letters
      hintsAvailable: 3, // More hints
      showImages: true,
      audioAvailable: true,
      encouragement: "frequent",
    },
    normal: {
      level: "normal",
      distractorCount: 2,
      hintsAvailable: 2,
      showImages: true,
      audioAvailable: true,
      encouragement: "moderate",
    },
    hard: {
      level: "hard",
      distractorCount: 3,
      hintsAvailable: 1,
      showImages: true,
      audioAvailable: true,
      encouragement: "minimal",
    },
    "very-hard": {
      level: "very-hard",
      distractorCount: 4,
      hintsAvailable: 1,
      showImages: false, // No images
      audioAvailable: true,
      encouragement: "minimal",
    },
  };

  return configs[level];
}

/**
 * Get appropriate support message based on difficulty and performance
 */
export function getSupportMessage(
  metrics: PerformanceMetrics,
  difficulty: DifficultyLevel
): string | null {
  const messages: Record<string, string[]> = {
    easy: [
      "You're doing great! Keep it up! 🌟",
      "Nice work! You've got this! 💪",
      "Excellent effort! Keep playing! 🎉",
    ],
    normal: [
      "You're progressing well! 👍",
      "Nice attempt! Ready for the next one? ✨",
      "Well done! 🌈",
    ],
    hard: [
      "Challenge accepted! 🎯",
      "Push through! You can do it! 🚀",
      "Give it your best shot! 💯",
    ],
    "very-hard": [
      "This is a tough one. Take your time! 🧩",
      "Champion level! Show us what you've got! 👑",
      "Ready for an extra challenge? 🔥",
    ],
  };

  // Show support when struggling
  if (metrics.recentStruggle) {
    return (
      "It's okay to find this tricky! Use hints if you need them. 🤝"
    );
  }

  // Show encouragement based on difficulty
  const messageList = messages[difficulty] || messages.normal;
  return messageList[Math.floor(Math.random() * messageList.length)];
}

/**
 * Determine if difficulty should be adjusted (every 5 words)
 */
export function shouldAdjustDifficulty(metricsHistory: PerformanceMetrics[]): boolean {
  if (metricsHistory.length === 0) return false;
  const latest = metricsHistory[metricsHistory.length - 1];
  // Check every 5 words
  return latest.wordsCompleted % 5 === 0;
}

/**
 * Get encouragement message based on current performance
 */
export function getEncouragementMessage(metrics: PerformanceMetrics): string {
  if (metrics.wordsCompleted === 0) {
    return "Let's start your word adventure! 🚀";
  }

  if (metrics.accuracy === 1) {
    return "Perfect score! You're a word master! 🏆";
  }

  if (metrics.accuracy >= 0.8) {
    return "Fantastic accuracy! You're crushing it! 💪";
  }

  if (metrics.accuracy >= 0.6) {
    return "Good progress! Keep up the momentum! 📈";
  }

  if (metrics.averageAttempts <= 1.5) {
    return "Quick learner! You're speeding through! ⚡";
  }

  return "Every word brings you closer to mastery! 🌱";
}

/**
 * Determine if player should get extra support for a specific word
 */
export function shouldProvideExtraSupport(
  metrics: PerformanceMetrics,
  currentAttempts: number,
  currentHintsUsed: number
): boolean {
  // If they're struggling on this word after 2 attempts and no hints used
  if (currentAttempts >= 2 && currentHintsUsed === 0 && metrics.recentStruggle) {
    return true;
  }

  // If overall accuracy is low and they're on attempt 3+
  if (metrics.accuracy < 0.5 && currentAttempts >= 3) {
    return true;
  }

  return false;
}
