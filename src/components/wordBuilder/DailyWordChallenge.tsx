"use client";

/**
 * Daily Word Challenge Component
 * Special challenge with bonus stars for completing today's word.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Language } from "@/types";
import type { Word } from "@/lib/wordBuilder/types";
import WordBuilderGame from "./WordBuilderGame";
import StreakMilestones from "./StreakMilestones";
import Koko from "@/components/characters/Koko";

interface DailyWordChallengeProps {
  language: Language;
  getWord: () => Word | null;
  onComplete: () => void;
  onCancel: () => void;
  streakCount?: number;
  isNewMilestone?: boolean;
}

export default function DailyWordChallenge({
  language,
  getWord,
  onComplete,
  onCancel,
  streakCount = 0,
  isNewMilestone = false,
}: DailyWordChallengeProps) {
  const [view, setView] = useState<"intro" | "game" | "complete">("intro");
  const [word, setWord] = useState<Word | null>(null);

  useEffect(() => {
    const dailyWord = getWord();
    setWord(dailyWord);
  }, [getWord]);

  if (!word) {
    return (
      <div className="min-h-screen w-full bg-cream-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-stone-700">No word available. Please try again tomorrow!</p>
          <button
            onClick={onCancel}
            className="mt-6 px-6 py-3 bg-amber-500 text-white font-bold rounded-full hover:bg-amber-600 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (view === "intro") {
    return (
      <DailyWordIntro
        word={word}
        language={language}
        onStart={() => setView("game")}
        onCancel={onCancel}
      />
    );
  }

  if (view === "complete") {
    return (
      <DailyWordComplete
        word={word}
        language={language}
        onContinue={onComplete}
        streakCount={streakCount}
        isNewMilestone={isNewMilestone}
      />
    );
  }

  // Game view
  return (
    <div>
      {/* Game logic would go here */}
      <div className="text-center p-4">
        <p>Daily Word: {word.word}</p>
        <button
          onClick={() => setView("complete")}
          className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600"
        >
          Complete Challenge
        </button>
      </div>
    </div>
  );
}

// ─── Daily Word Intro ───────────────────────────────────────────────────────

function DailyWordIntro({
  word,
  language,
  onStart,
  onCancel,
}: {
  word: Word;
  language: Language;
  onStart: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cream-bg to-amber-50 flex flex-col items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-5xl opacity-20"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="absolute bottom-24 right-10 text-5xl opacity-20"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md"
      >
        <Koko speaking className="w-32 h-32 mx-auto mb-6" />

        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
          ⭐ Daily Word Challenge!
        </h1>

        <p className="text-lg text-stone-700 mb-8">
          Complete today's special word and earn{" "}
          <span className="font-bold text-amber-600">+10 BONUS STARS ⭐</span>
        </p>

        {/* Word preview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 p-6 bg-white rounded-3xl shadow-lg"
        >
          {word.image && <div className="text-6xl mb-4">{word.image}</div>}
          <p className="text-sm text-stone-600 mb-2">Today's challenge:</p>
          <p className="text-3xl font-bold text-green-800">{word.word}</p>
          {word.translation && (
            <p className="text-xs text-stone-500 mt-2 italic">{word.translation}</p>
          )}
        </motion.div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 gap-3">
          <motion.button
            onClick={onStart}
            whileTap={{ scale: 0.95 }}
            className="py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-3xl hover:shadow-lg transition-all"
          >
            Let's Build! 🚀
          </motion.button>

          <button
            onClick={onCancel}
            className="py-3 px-6 bg-white border-2 border-stone-300 text-stone-700 font-bold rounded-3xl hover:bg-stone-50 transition-colors"
          >
            Maybe Later
          </button>
        </div>

        <p className="text-xs text-stone-500 mt-6 italic">
          "You can only complete one Daily Word per day!" — Kòkò 🦜
        </p>
      </motion.div>
    </div>
  );
}

// ─── Daily Word Complete ────────────────────────────────────────────────────

function DailyWordComplete({
  word,
  language,
  onContinue,
  streakCount = 0,
  isNewMilestone = false,
}: {
  word: Word;
  language: Language;
  onContinue: () => void;
  streakCount?: number;
  isNewMilestone?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full bg-gradient-to-b from-rose-100 via-amber-50 to-cream-bg flex flex-col items-center justify-center p-4 gap-8"
    >
      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -50,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 50,
              opacity: 0,
              rotate: 360 * Math.random(),
            }}
            transition={{
              duration: 2 + Math.random() * 1,
              ease: "easeIn",
              delay: Math.random() * 0.3,
            }}
          >
            {["🎉", "⭐", "✨", "🎊"][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 text-center max-w-2xl w-full space-y-8"
      >
        <div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
            className="text-7xl mb-6"
          >
            🎉
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-2">
            Daily Word Complete!
          </h1>

          <div className="text-5xl md:text-6xl font-bold text-amber-600 mb-6">
            +10 ⭐
          </div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-6 md:p-8 bg-white rounded-3xl shadow-lg"
          >
            <p className="text-sm text-stone-600 mb-2">You built:</p>
            <p className="text-5xl md:text-6xl font-bold text-green-800">{word.word}</p>
          </motion.div>
        </div>

        {/* Streak Milestones */}
        {streakCount > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <StreakMilestones
              streakCount={streakCount}
              isNewMilestone={isNewMilestone}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-4"
        >
          <p className="text-lg text-stone-700 mb-6 font-semibold">
            Come back tomorrow for a new Daily Word challenge!
          </p>

          <motion.button
            onClick={onContinue}
            whileTap={{ scale: 0.95 }}
            className="py-4 px-8 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg md:text-xl rounded-3xl hover:shadow-lg transition-all focus-ring"
          >
            Continue Playing
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
