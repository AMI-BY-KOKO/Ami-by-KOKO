/**
 * DailyChallengeCard Component
 *
 * Shows "Kòkò's Daily Challenge" on home screen.
 * Displays challenge question, handles answer submission, shows completion state.
 *
 * Usage:
 *   <DailyChallengeCard childId={activeChild.id} />
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayChallenge, getChildTodayAttempt, completeDailyChallenge, type DailyChallenge } from "@/lib/daily-challenges/actions";
import { MissionCompletionCelebration } from "@/components/TodaysAdventure";

interface DailyChallengeCardProps {
  childId: string;
}

export default function DailyChallengeCard({ childId }: DailyChallengeCardProps) {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    xpAwarded: number;
    newLevel: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load today's challenge and attempt status
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Get challenge
        const chal = await getTodayChallenge(childId);
        setChallenge(chal);

        // Get attempt status
        const attempt = await getChildTodayAttempt(childId);
        if (attempt?.completed) {
          setIsCompleted(true);
        }
      } catch (err) {
        console.error("[DailyChallengeCard] Failed to load challenge:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [childId]);

  const handleCorrectAnswer = async () => {
    if (!challenge || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await completeDailyChallenge(childId, challenge.activityRef);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Show celebration
      setCelebrationData({
        xpAwarded: result.xpAwarded,
        newLevel: result.newLevel,
      });
      setShowCelebration(true);
      setIsCompleted(true);

      // Auto-dismiss after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    } catch (err) {
      console.error("[DailyChallengeCard] Error completing challenge:", err);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl" />
    );
  }

  if (!challenge) {
    return null;
  }

  // Completed state
  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 ring-1 ring-green-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold text-stone-800 text-sm">Daily Challenge Complete!</p>
            <p className="text-xs text-stone-600">Come back tomorrow for a new one</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Challenge card - show question based on type
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 ring-1 ring-purple-200 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦜</span>
          <div>
            <p className="font-bold text-stone-800 text-sm">Kòkò's Daily Challenge</p>
            <p className="text-xs text-stone-600">Answer to earn +50 XP</p>
          </div>
        </div>

        {/* Question - rendered based on type */}
        <ChallengQuestion challenge={challenge} onCorrectAnswer={handleCorrectAnswer} isSubmitting={isSubmitting} />
      </motion.div>

      {/* Celebration */}
      {showCelebration && celebrationData && (
        <MissionCompletionCelebration
          xpAwarded={celebrationData.xpAwarded}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </>
  );
}

/**
 * ChallengQuestion Component
 * Renders different question types
 */
function ChallengQuestion({
  challenge,
  onCorrectAnswer,
  isSubmitting,
}: {
  challenge: DailyChallenge;
  onCorrectAnswer: () => void;
  isSubmitting: boolean;
}) {
  switch (challenge.questionType) {
    case "letter_sound": {
      const letter = challenge.questionData.letter;
      return (
        <LetterSoundChallenge
          letter={letter}
          onCorrect={onCorrectAnswer}
          isSubmitting={isSubmitting}
        />
      );
    }

    case "number_count": {
      const number = challenge.questionData.number;
      return (
        <NumberCountChallenge
          number={number}
          onCorrect={onCorrectAnswer}
          isSubmitting={isSubmitting}
        />
      );
    }

    case "vocab_identify": {
      const topic = challenge.questionData.topic;
      return (
        <VocabChallenge topic={topic} onCorrect={onCorrectAnswer} isSubmitting={isSubmitting} />
      );
    }

    default:
      return (
        <div className="text-center py-4 text-stone-600">
          <p>Challenge loading...</p>
        </div>
      );
  }
}

/**
 * Letter Sound Challenge
 */
function LetterSoundChallenge({
  letter,
  onCorrect,
  isSubmitting,
}: {
  letter: string;
  onCorrect: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center py-6 bg-white rounded-xl">
        <p className="text-5xl font-bold text-purple-600 mb-2">{letter}</p>
        <p className="text-sm text-stone-600">What's this letter's sound?</p>
      </div>

      <button
        onClick={onCorrect}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-stone-300 disabled:to-stone-300 text-white font-bold py-3 rounded-xl transition"
      >
        {isSubmitting ? "Checking..." : `🔊 Play Sound`}
      </button>
    </div>
  );
}

/**
 * Number Count Challenge
 */
function NumberCountChallenge({
  number,
  onCorrect,
  isSubmitting,
}: {
  number: number;
  onCorrect: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center py-6 bg-white rounded-xl">
        <div className="flex items-center justify-center gap-1 mb-3">
          {Array.from({ length: number }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-3xl"
            >
              ●
            </motion.span>
          ))}
        </div>
        <p className="text-sm text-stone-600">How many?</p>
      </div>

      <button
        onClick={onCorrect}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-stone-300 disabled:to-stone-300 text-white font-bold py-3 rounded-xl transition"
      >
        {isSubmitting ? "Checking..." : `✓ That's ${number}!`}
      </button>
    </div>
  );
}

/**
 * Vocabulary Challenge
 */
function VocabChallenge({
  topic,
  onCorrect,
  isSubmitting,
}: {
  topic: string;
  onCorrect: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center py-6 bg-white rounded-xl">
        <p className="text-xl font-bold text-purple-600 mb-2 capitalize">{topic}</p>
        <p className="text-sm text-stone-600">Find the {topic.toLowerCase()}!</p>
      </div>

      <button
        onClick={onCorrect}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-stone-300 disabled:to-stone-300 text-white font-bold py-3 rounded-xl transition"
      >
        {isSubmitting ? "Checking..." : `✓ Found it!`}
      </button>
    </div>
  );
}
