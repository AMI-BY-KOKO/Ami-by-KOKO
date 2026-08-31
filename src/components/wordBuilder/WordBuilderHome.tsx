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
import GameModeSelector from "./GameModeSelector";
import Achievements from "./Achievements";
import type { Language } from "@/types";
import type { WordBuilderProgress, Word, AchievementType, GameMode } from "@/lib/wordBuilder/types";
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
}

export default function WordBuilderHome({
  language,
  progress,
  loading = false,
  onStart,
  onSelectLevel,
  onChangeLanguage,
  onDailyWord,
}: WordBuilderHomeProps) {
  const [showMap, setShowMap] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("BUILD");
  
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
    <div className="min-h-screen w-full bg-gradient-to-b from-cream-bg to-amber-50 flex flex-col items-center justify-start p-4 md:p-6">
      {/* Header */}
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-4"
        >
          <button
            onClick={onChangeLanguage}
            className="text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-full transition-colors focus-ring"
            aria-label="Change language"
          >
            🌍 {languageConfig.displayName}
          </button>
          <div className="flex gap-4">
            <motion.button
              onClick={() => setShowMap(!showMap)}
              className={`text-sm font-bold px-3 py-2 rounded-full transition-all focus-ring ${
                showMap
                  ? "bg-green-200 text-green-800"
                  : "bg-stone-200 text-stone-700 hover:bg-stone-300"
              }`}
              whileTap={{ scale: 0.95 }}
              aria-label={showMap ? "Show quick start" : "Show adventure map"}
            >
              {showMap ? "🗺️ Map" : "🎮 Quick"}
            </motion.button>
            <motion.button
              onClick={() => setShowAchievements(true)}
              className="text-sm font-bold px-3 py-2 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all focus-ring"
              whileTap={{ scale: 0.95 }}
              aria-label="View achievements"
            >
              🏆 Badges
            </motion.button>
            <div className="flex gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">⭐</div>
                <div className="text-xs text-stone-600">{progress?.stars_earned ?? 0}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-500">🔥</div>
                <div className="text-xs text-stone-600">{progress?.streak_count ?? 0} day</div>
              </div>
            </div>
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
            className="w-full flex-1 flex items-center justify-center"
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
            className="w-full max-w-xl flex flex-col items-center gap-8 mt-4"
          >
            {/* Kòkò with greeting */}
            <div className="flex flex-col items-center gap-4">
              <Koko speaking={false} className="w-40 h-40 md:w-48 md:h-48" />
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-black text-amber-900 mb-2">
                  🦜 Kòkò's Word Adventure
                </h1>
                <p className="text-lg md:text-xl text-stone-700 font-semibold">
                  {greetingText}
                </p>
              </div>
            </div>

            {/* Level indicator card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-xl p-6 md:p-8 ring-1 ring-amber-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-green-800 mb-1">
                    {levelConfig.name}
                  </h2>
                  <p className="text-sm md:text-base text-stone-600 font-medium">
                    {levelConfig.description}
                  </p>
                </div>
                <div className="text-6xl">
                  {currentLevel === 1 && "🌱"}
                  {currentLevel === 2 && "🌿"}
                  {currentLevel === 3 && "🌳"}
                  {currentLevel === 4 && "🏡"}
                  {currentLevel === 5 && "🏆"}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-700 uppercase">Progress in this level</span>
                  <span className="text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                    {wordsInLevel}/{totalWordsInLevel}
                  </span>
                </div>
                <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Level stats grid */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center p-4 md:p-5 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl ring-1 ring-amber-200"
                >
                  <div className="text-4xl mb-2">⭐</div>
                  <div className="text-lg md:text-xl font-black text-amber-900">
                    {progress?.stars_earned ?? 0}
                  </div>
                  <div className="text-xs font-bold text-stone-600 mt-1">Stars</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-center p-4 md:p-5 bg-gradient-to-br from-rose-100 to-rose-50 rounded-2xl ring-1 ring-rose-200"
                >
                  <div className="text-4xl mb-2">🔥</div>
                  <div className="text-lg md:text-xl font-black text-rose-900">
                    {progress?.streak_count ?? 0}
                  </div>
                  <div className="text-xs font-bold text-stone-600 mt-1">Streak</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center p-4 md:p-5 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl ring-1 ring-green-200"
                >
                  <div className="text-4xl mb-2">{gardenStage}</div>
                  <div className="text-lg md:text-xl font-black text-green-900">
                    {seedCount}
                  </div>
                  <div className="text-xs font-bold text-stone-600 mt-1">Garden</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Game Mode Selector */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.43 }}
              className="w-full"
            >
              <GameModeSelector
                selectedMode={gameMode}
                onSelectMode={setGameMode}
                language={language}
              />
            </motion.div>

            {/* Word Garden */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="w-full"
            >
              <WordGarden
                seedCount={seedCount}
                masteredWordsCount={progress?.mastered_words?.length ?? 0}
              />
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full grid gap-4 md:gap-5"
            >
              {/* Primary CTA */}
              <button
                onClick={onStart}
                disabled={loading}
                className={`w-full py-5 md:py-6 px-6 rounded-3xl font-bold text-xl md:text-2xl transition-all duration-300 focus-ring shadow-lg
                  ${
                    loading
                      ? "bg-amber-300 text-amber-700 opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  }
                `}
                aria-label="Start Word Adventure"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ⏳
                    </motion.span>
                    Loading…
                  </span>
                ) : (
                  `▶ START ADVENTURE${wordsInLevel > 0 ? " (Continue)" : ""}`
                )}
              </button>

              {/* My Words collection button */}
              <motion.button
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.48 }}
                onClick={() => setShowCollection(true)}
                disabled={loading || !progress?.mastered_words?.length}
                className={`w-full py-4 md:py-5 px-6 rounded-3xl font-bold text-lg md:text-xl transition-all duration-300 focus-ring shadow-md
                  ${
                    progress?.mastered_words?.length
                      ? "bg-white border-3 border-amber-400 text-amber-700 hover:bg-amber-50"
                      : "bg-stone-100 border-3 border-stone-300 text-stone-500 cursor-not-allowed opacity-60"
                  }
                `}
                aria-label="View my word collection"
              >
                📚 My Words — {progress?.mastered_words?.length ?? 0} Collected
              </motion.button>

              {/* Daily Word button (if not completed today) */}
              {!progress?.daily_word_completed_today && onDailyWord && (
                <motion.button
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={onDailyWord}
                  disabled={loading}
                  className="w-full py-4 md:py-5 px-6 rounded-3xl font-bold text-lg md:text-xl bg-white border-3 border-green-400 text-green-700 hover:bg-green-50 transition-all duration-300 focus-ring shadow-md"
                  aria-label="Daily Word challenge"
                >
                  ⭐ Daily Word Challenge — +10 Stars!
                </motion.button>
              )}

              {/* Daily Word completed badge */}
              {progress?.daily_word_completed_today && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-full py-4 md:py-5 px-6 rounded-3xl font-bold text-lg md:text-xl bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-center flex items-center justify-center gap-3 ring-2 ring-green-300"
                >
                  ✅ Daily Word Complete!
                  <span className="text-2xl">+10⭐</span>
                </motion.div>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center text-sm md:text-base text-stone-700 font-semibold italic"
            >
              <p>
                🌱 Build words → 🌿 Grow your Word Garden → 🌳 Unlock new worlds → 🏆 Become a Word Champion!
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
    </div>
  );
}
