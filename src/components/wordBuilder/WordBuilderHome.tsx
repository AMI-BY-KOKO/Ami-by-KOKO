"use client";

/**
 * Word Builder Home Screen
 * Shown after language selection. Displays:
 * - Kòkò greeting
 * - Quick start button or adventure map
 * - Current level and progress
 * - Word Garden
 * - Language and stats
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Koko from "@/components/characters/Koko";
import AdventureMap from "./AdventureMap";
import WordGarden from "./WordGarden";
import WordCollection from "./WordCollection";
import Achievements from "./Achievements";
import type { Language } from "@/types";
import type { WordBuilderProgress, Word, AchievementType } from "@/lib/wordBuilder/types";
import { LANGUAGE_OPTIONS, LEVEL_CONFIGS, KOKO_DIALOGUE } from "@/lib/wordBuilder/types";
import { getAllWords } from "@/lib/wordBuilder/wordDatasets";

interface WordBuilderHomeProps {
  language: Language;
  progress: WordBuilderProgress | null;
  loading?: boolean;
  onStart: () => void;
  onSelectLevel?: (level: 1 | 2 | 3 | 4 | 5) => void;
  onChangeLanguage: () => void;
  onDailyWord?: () => void;
  onResetProgress?: () => Promise<void>;
}

export default function WordBuilderHome({
  language,
  progress,
  loading = false,
  onStart,
  onSelectLevel,
  onChangeLanguage,
  onDailyWord,
  onResetProgress,
}: WordBuilderHomeProps) {
  const [showMap, setShowMap] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const languageConfig = LANGUAGE_OPTIONS[language];
  const currentLevel = progress?.current_level ?? 1;
  const levelConfig = LEVEL_CONFIGS[currentLevel];

  // Get appropriate Kòkò greeting
  const greetingText = KOKO_DIALOGUE[language].greeting;

  // Calculate progress bar
  const wordsInLevel = progress?.current_word_index ?? 0;
  const totalWordsInLevel = levelConfig.wordsPerLevel;
  const progressPercent = Math.min((wordsInLevel / totalWordsInLevel) * 100, 100);

  // Word garden visual representation
  const seedCount = progress?.word_garden_seeds ?? 0;
  const gardenStage =
    seedCount < 10 ? "🌱" : seedCount < 25 ? "🌿" : seedCount < 50 ? "🌷" : "🌳";

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cream-bg to-amber-50 flex flex-col items-center justify-start overflow-x-hidden">
      {/* Compact mobile header with minimal height */}
      <div className="w-full sticky top-16 md:top-20 z-30 bg-gradient-to-b from-cream-bg via-cream-bg to-transparent pb-2 md:pb-3 px-4 md:px-6 pt-2 md:pt-3">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between gap-2 max-w-2xl mx-auto"
        >
          {/* Left: Language selector */}
          <button
            onClick={onChangeLanguage}
            className="text-xs md:text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 md:px-3 py-1.5 md:py-2 rounded-full transition-colors focus-ring whitespace-nowrap"
            aria-label="Change language"
          >
            🌍 {languageConfig.displayName}
          </button>

          {/* Center: Compact stats (stars + streak) */}
          <div className="flex gap-2 md:gap-3 items-center">
            <div className="text-center bg-amber-50 rounded-lg px-2 py-1">
              <div className="text-sm md:text-base font-bold text-amber-600">⭐{progress?.stars_earned ?? 0}</div>
            </div>
            <div className="text-center bg-rose-50 rounded-lg px-2 py-1">
              <div className="text-sm md:text-base font-bold text-rose-500">🔥{progress?.streak_count ?? 0}</div>
            </div>
          </div>

          {/* Right: Action buttons (compact) */}
          <div className="flex gap-1 md:gap-2">
            <motion.button
              onClick={() => setShowMap(!showMap)}
              className={`text-xs md:text-sm font-bold px-2 md:px-3 py-1.5 md:py-2 rounded-full transition-all focus-ring ${
                showMap
                  ? "bg-green-200 text-green-800"
                  : "bg-stone-200 text-stone-700 hover:bg-stone-300"
              }`}
              whileTap={{ scale: 0.95 }}
              aria-label={showMap ? "Show quick start" : "Show adventure map"}
              title="Toggle adventure map"
            >
              {showMap ? "🗺️" : "🎮"}
            </motion.button>
            <motion.button
              onClick={() => setShowAchievements(true)}
              className="text-xs md:text-sm font-bold px-2 md:px-3 py-1.5 md:py-2 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all focus-ring"
              whileTap={{ scale: 0.95 }}
              aria-label="View achievements"
              title="View badges"
            >
              🏆
            </motion.button>
            <motion.button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs md:text-sm font-bold px-2 md:px-3 py-1.5 md:py-2 rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition-all focus-ring"
              whileTap={{ scale: 0.95 }}
              aria-label="Reset all progress"
              title="Reset progress"
            >
              ↻
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Show Adventure Map or Quick Start based on state */}
      <AnimatePresence mode="wait">
        {showMap && progress ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex-1 flex items-center justify-center px-4 md:px-6"
          >
            <AdventureMap
              progress={progress}
              language={language}
              onSelectLevel={(level) => {
                if (onSelectLevel) {
                  onSelectLevel(level);
                  setShowMap(false);
                }
              }}
              loading={loading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="quick"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex-1 overflow-y-auto flex flex-col items-center px-4 md:px-6"
          >
            {/* Hero Section - Compact */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full max-w-xl flex flex-col items-center gap-2 md:gap-3 py-2 md:py-3"
            >
              {/* Kòkò - smaller on mobile */}
              <div className="w-28 h-28 md:w-40 md:h-40 flex items-center justify-center">
                <Koko speaking={false} />
              </div>

              {/* Title + greeting - compact spacing */}
              <div className="text-center">
                <h1 className="text-2xl md:text-4xl font-black text-amber-900">
                  Kòkò's Word Adventure
                </h1>
                <p className="text-sm md:text-base text-stone-700 font-medium mt-1">
                  {greetingText}
                </p>
              </div>
            </motion.div>

            {/* Current Level Card - Compact */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-xl bg-white rounded-2xl shadow-md p-4 md:p-6 ring-1 ring-amber-100 mb-3 md:mb-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-2xl font-black text-green-800 mb-0.5">
                    {levelConfig.name}
                  </h2>
                  <p className="text-xs md:text-sm text-stone-600 font-medium line-clamp-2">
                    {levelConfig.description}
                  </p>
                </div>
                <div className="text-4xl md:text-5xl ml-2 flex-shrink-0">
                  {currentLevel === 1 && "🌱"}
                  {currentLevel === 2 && "🌿"}
                  {currentLevel === 3 && "🌳"}
                  {currentLevel === 4 && "🏡"}
                  {currentLevel === 5 && "🏆"}
                </div>
              </div>

              {/* Progress bar - compact */}
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-stone-700 uppercase">Progress</span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    {wordsInLevel}/{totalWordsInLevel}
                  </span>
                </div>
                <div className="w-full h-2 md:h-3 bg-stone-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Game Mode Selector */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-xl"
            >
              {/* Primary BUILD CTA - Prominent */}
              <motion.div
                className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl shadow-lg p-6 md:p-8 mb-4 ring-2 ring-amber-400"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4 md:gap-5">
                  <motion.div
                    className="text-5xl md:text-6xl flex-shrink-0"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🧩
                  </motion.div>
                  <div className="text-white flex-1">
                    <h3 className="text-xl md:text-2xl font-black mb-1">BUILD A WORD</h3>
                    <p className="text-sm md:text-base font-semibold opacity-95">
                      Mix • Match • Discover
                    </p>
                  </div>
                  <motion.div
                    className="text-3xl md:text-4xl flex-shrink-0 font-black text-amber-100"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ▶
                  </motion.div>
                </div>
              </motion.div>

              {/* Alternative modes hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-xs md:text-sm text-stone-600 italic"
              >
                <p>
                  🎧 Sound Challenge & 🔍 Word Hunt coming soon!
                </p>
              </motion.div>
            </motion.div>

            {/* Word Garden - Compact */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="w-full max-w-xl mb-3 md:mb-4"
            >
              <WordGarden
                seedCount={seedCount}
                masteredWordsCount={progress?.mastered_words?.length ?? 0}
              />
            </motion.div>

            {/* Action buttons - stack vertically, compact spacing */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-xl space-y-2 md:space-y-3 mb-4 md:mb-6"
            >
              {/* Primary CTA */}
              <button
                onClick={onStart}
                disabled={loading}
                className={`w-full py-4 md:py-5 px-4 md:px-6 rounded-2xl md:rounded-3xl font-bold text-lg md:text-xl transition-all duration-300 focus-ring shadow-md
                  ${
                    loading
                      ? "bg-amber-300 text-amber-700 opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  }
                `}
                aria-label="Start Word Adventure"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ⏳
                    </motion.span>
                    Loading…
                  </span>
                ) : (
                  `▶ ${wordsInLevel > 0 ? "Continue" : "Start"} Adventure`
                )}
              </button>

              {/* My Words collection button */}
              <motion.button
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.45 }}
                onClick={() => setShowCollection(true)}
                disabled={loading || !progress?.mastered_words?.length}
                className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-2xl md:rounded-3xl font-bold text-base md:text-lg transition-all duration-300 focus-ring shadow-sm
                  ${
                    progress?.mastered_words?.length
                      ? "bg-white border-2 md:border-3 border-amber-400 text-amber-700 hover:bg-amber-50"
                      : "bg-stone-100 border-2 md:border-3 border-stone-300 text-stone-500 cursor-not-allowed opacity-60"
                  }
                `}
                aria-label="View my word collection"
              >
                📚 My Words — {progress?.mastered_words?.length ?? 0}
              </motion.button>

              {/* Daily Word button (if not completed today) */}
              {!progress?.daily_word_completed_today && onDailyWord && (
                <motion.button
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.48 }}
                  onClick={onDailyWord}
                  disabled={loading}
                  className="w-full py-3 md:py-4 px-4 md:px-6 rounded-2xl md:rounded-3xl font-bold text-base md:text-lg bg-white border-2 md:border-3 border-green-400 text-green-700 hover:bg-green-50 transition-all duration-300 focus-ring shadow-sm"
                  aria-label="Daily Word challenge"
                >
                  ⭐ Daily Word — +10 Stars
                </motion.button>
              )}

              {/* Daily Word completed badge */}
              {progress?.daily_word_completed_today && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.48 }}
                  className="w-full py-3 md:py-4 px-4 md:px-6 rounded-2xl md:rounded-3xl font-bold text-base md:text-lg bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-center flex items-center justify-center gap-2 ring-2 ring-green-300"
                >
                  ✅ Daily Complete
                  <span className="text-xl">+10⭐</span>
                </motion.div>
              )}
            </motion.div>

            {/* Inspirational message - subtle */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center text-xs md:text-sm text-stone-700 font-medium italic mb-4 md:mb-6 px-4"
            >
              <p>
                🌱 Build → 🌿 Grow Garden → 🌳 New Worlds → 🏆 Champion!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word Collection Modal */}
      <WordCollection
        isOpen={showCollection}
        masteredWords={
          progress?.mastered_words && progress.mastered_words.length > 0
            ? progress.mastered_words.map((wordId: string) => {
                const allWords = getAllWords(language);
                return allWords.find((w: Word) => w.id === wordId);
              }).filter(Boolean) as Word[]
            : []
        }
        onClose={() => setShowCollection(false)}
      />

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAchievements(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-4 md:inset-20 bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-y-auto ring-2 ring-amber-200 p-6 md:p-8"
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAchievements(false)}
                className="absolute top-6 right-6 text-2xl md:text-3xl text-stone-600 hover:text-stone-800 transition-colors focus-ring"
                aria-label="Close achievements"
              >
                ✕
              </motion.button>

              {/* Achievements Content */}
              <Achievements
                unlockedIds={
                  (progress?.achievements as AchievementType[]) ||
                  []
                }
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 ring-2 ring-red-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h2 className="text-2xl md:text-3xl font-black text-red-800 mb-3">
                    Reset All Progress?
                  </h2>
                  <p className="text-stone-700 text-lg md:text-xl mb-2 font-semibold">
                    This will:
                  </p>
                  <ul className="text-left text-stone-600 mb-8 space-y-2 bg-red-50 rounded-2xl p-4 text-sm md:text-base">
                    <li>✗ Clear all levels (back to Level 1)</li>
                    <li>✗ Reset stars and streak</li>
                    <li>✗ Clear Word Garden</li>
                    <li>✗ Delete mastered words</li>
                  </ul>
                  <p className="text-red-700 font-bold text-sm md:text-base mb-8">
                    This action cannot be undone!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowResetConfirm(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 md:py-4 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-2xl transition-colors focus-ring text-base md:text-lg"
                    aria-label="Cancel reset"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={async () => {
                      if (onResetProgress) {
                        await onResetProgress();
                      }
                      setShowResetConfirm(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 md:py-4 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors focus-ring text-base md:text-lg"
                    aria-label="Confirm reset"
                  >
                    Reset
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
