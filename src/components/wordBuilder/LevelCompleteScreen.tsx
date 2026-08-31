"use client";

/**
 * Level Complete Screen
 * Shown when child completes all words in a level.
 * Displays celebration, stars earned, and progression to next level.
 */

import { motion } from "framer-motion";
import Koko from "@/components/characters/Koko";
import type { Language } from "@/types";
import type { WordBuilderProgress } from "@/lib/wordBuilder/types";
import { LEVEL_CONFIGS, KOKO_DIALOGUE } from "@/lib/wordBuilder/types";
import WordGarden from "./WordGarden";

interface LevelCompleteScreenProps {
  language: Language;
  progress: WordBuilderProgress | null;
  onContinue: () => void;
}

export default function LevelCompleteScreen({
  language,
  progress,
  onContinue,
}: LevelCompleteScreenProps) {
  if (!progress) return null;

  const currentLevel = progress.current_level;
  const levelConfig = LEVEL_CONFIGS[currentLevel];
  const nextLevel = Math.min(currentLevel + 1, 5);
  const nextLevelConfig = LEVEL_CONFIGS[nextLevel];
  const dialogue = KOKO_DIALOGUE[language];

  // Calculate total stars in this level
  const levelStars = progress.stars_earned % 30; // Rough estimate per level

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-gradient-to-b from-rose-100 via-amber-50 to-cream-bg flex flex-col items-center justify-between p-4 md:p-6 overflow-hidden"
    >
      {/* Confetti animation */}
      <Confetti />

      {/* Content */}
      <div className="w-full max-w-lg flex flex-col items-center gap-8 z-10">
        {/* Kòkò celebration */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            className="text-7xl"
          >
            🎉
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 text-center">
            Level Complete!
          </h1>

          <p className="text-lg md:text-xl text-stone-700 italic">
            {dialogue.levelComplete[Math.floor(Math.random() * dialogue.levelComplete.length)]}
          </p>
        </motion.div>

        {/* Level stats card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full bg-white rounded-3xl shadow-lg p-6 md:p-8"
        >
          {/* Current level summary */}
          <div className="mb-6 pb-6 border-b border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-800">
                  {levelConfig.name}
                </h2>
                <p className="text-sm text-stone-600">{levelConfig.description}</p>
              </div>
              <div className="text-4xl">
                {currentLevel === 1 && "🔤"}
                {currentLevel === 2 && "📝"}
                {currentLevel === 3 && "🎯"}
                {currentLevel === 4 && "🚀"}
                {currentLevel === 5 && "🏆"}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-amber-50 rounded-xl">
                <div className="text-3xl font-bold text-amber-600">
                  {levelConfig.wordsPerLevel}
                </div>
                <div className="text-xs text-stone-600">Words Built</div>
              </div>
              <div className="text-center p-3 bg-rose-50 rounded-xl">
                <div className="text-3xl font-bold text-rose-600">
                  {levelStars}
                </div>
                <div className="text-xs text-stone-600">Stars</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">
                  ✓
                </div>
                <div className="text-xs text-stone-600">Mastered</div>
              </div>
            </div>
          </div>

          {/* Next level preview */}
          <div>
            <h3 className="text-lg font-bold text-stone-800 mb-4">
              🚀 Up Next: {nextLevelConfig.name}
            </h3>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
              <div>
                <div className="font-bold text-green-800">
                  {nextLevelConfig.description}
                </div>
                <div className="text-sm text-stone-600 mt-1">
                  {nextLevelConfig.wordsPerLevel} words • Difficulty +1
                </div>
              </div>
              <div className="text-4xl">
                {nextLevel === 1 && "🔤"}
                {nextLevel === 2 && "📝"}
                {nextLevel === 3 && "🎯"}
                {nextLevel === 4 && "🚀"}
                {nextLevel === 5 && "🏆"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Word Garden progress */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-full bg-white rounded-3xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-stone-800 mb-4 text-center">
            🌱 Your Word Garden
          </h3>
          <WordGarden seedCount={progress.word_garden_seeds} />
        </motion.div>

        {/* Action button */}
        <motion.button
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="w-full py-4 md:py-5 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg md:text-xl rounded-3xl hover:shadow-lg transition-all focus-ring"
        >
          {nextLevel <= 5 ? `→ Start ${nextLevelConfig.name}` : "🎓 You're a Master!"}
        </motion.button>
      </div>

      {/* Footer celebration */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center text-sm text-stone-600 italic mt-8"
      >
        <p>"You're getting better every day! Keep building words!" 🦜</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Confetti Component ─────────────────────────────────────────────────────

function Confetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 0),
            y: -50,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: typeof window !== "undefined" ? window.innerHeight + 50 : 0,
            opacity: 0,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            ease: "easeIn",
            delay: Math.random() * 0.5,
          }}
        >
          {["🎉", "⭐", "✨", "🎊", "🌟", "🦜"][i % 6]}
        </motion.div>
      ))}
    </div>
  );
}
