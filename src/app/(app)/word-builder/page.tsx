"use client";

/**
 * Kòkò's Word Builder — Main Game Route
 * /word-builder
 *
 * Handles language selection, game flow, and integration with useWordBuilder hook.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useChild } from "@/hooks/useChild";
import { useWordBuilder } from "@/hooks/useWordBuilder";
import LanguageSelector from "@/components/wordBuilder/LanguageSelector";
import WordBuilderHome from "@/components/wordBuilder/WordBuilderHome";
import WordBuilderGame from "@/components/wordBuilder/WordBuilderGame";
import DailyWordChallenge from "@/components/wordBuilder/DailyWordChallenge";

type GameView = "language-select" | "home" | "game" | "daily-word" | "level-complete";

export default function WordBuilderPage() {
  const { activeChild } = useChild();
  const {
    selectedLanguage,
    selectLanguage,
    progress,
    isLoadingProgress,
    error,
    currentChallenge,
    generateChallenge,
    selectedLetters,
    selectLetter,
    deselectLastLetter,
    resetSelection,
    submitAnswer,
    getHint,
    recordCompletion,
    getDailyWord,
    completeDailyWord,
  } = useWordBuilder();

  const [currentView, setCurrentView] = useState<GameView>("language-select");
  const [lastSelectedLanguage, setLastSelectedLanguage] = useState<string | null>(null);

  // ─── Load last selected language from localStorage ──────────────────────
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("wordBuilder_language") : null;
    if (saved) {
      setLastSelectedLanguage(saved);
    }
  }, []);

  // ─── Handle language selection ──────────────────────────────────────────
  const handleLanguageSelect = (language: string) => {
    selectLanguage(language as any);
    setLastSelectedLanguage(language);
    // Show home after selecting language
    setTimeout(() => setCurrentView("home"), 600);
  };

  // ─── Handle game flow ───────────────────────────────────────────────────
  const handleStartGame = () => {
    generateChallenge();
    setCurrentView("game");
  };

  const handleSelectLevel = (level: 1 | 2 | 3 | 4 | 5) => {
    // In a full implementation, this would load challenges from that specific level
    // For now, it just starts the game (existing level is handled by generateChallenge)
    generateChallenge();
    setCurrentView("game");
  };

  const handleDailyWord = () => {
    setCurrentView("daily-word");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  const handleChangeLanguage = () => {
    setCurrentView("language-select");
  };

  const handleLevelComplete = () => {
    setCurrentView("level-complete");
  };

  const handleContinueAfterLevel = () => {
    setCurrentView("home");
  };

  // ─── If no child selected, show message ─────────────────────────────────
  if (!activeChild) {
    return (
      <div className="min-h-screen w-full bg-cream-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-stone-700 mb-4">Please select a child to start.</p>
        </div>
      </div>
    );
  }

  // ─── Show error if loading fails ────────────────────────────────────────
  if (error && currentView !== "language-select") {
    return (
      <div className="min-h-screen w-full bg-cream-bg flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-lg text-red-600 font-bold mb-4">Unable to Load Game</p>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setCurrentView("language-select");
            }}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Render current view ───────────────────────────────────────────────
  return (
    <>
      {/* Language Selection */}
      {currentView === "language-select" && (
        <LanguageSelector
          onLanguageSelect={handleLanguageSelect}
          selectedLanguage={selectedLanguage as any}
          recentLanguage={lastSelectedLanguage as any}
          loading={isLoadingProgress}
        />
      )}

      {/* Home/Intro Screen */}
      {currentView === "home" && selectedLanguage && (
        <WordBuilderHome
          language={selectedLanguage as any}
          progress={progress}
          loading={isLoadingProgress}
          onStart={handleStartGame}
          onSelectLevel={handleSelectLevel}
          onChangeLanguage={handleChangeLanguage}
          onDailyWord={handleDailyWord}
        />
      )}

      {/* Main Game Screen */}
      {currentView === "game" && selectedLanguage && currentChallenge && (
        <WordBuilderGame
          language={selectedLanguage as any}
          challenge={currentChallenge}
          selectedLetters={selectedLetters}
          onSelectLetter={selectLetter}
          onDeselectLetter={deselectLastLetter}
          onResetSelection={resetSelection}
          onSubmitAnswer={submitAnswer}
          onGetHint={getHint}
          onCorrectAnswer={(stars) => {
            recordCompletion(stars);
            // Check if level complete after a short delay
            setTimeout(() => {
              if (progress && progress.current_word_index >= LEVEL_CONFIGS[progress.current_level].wordsPerLevel - 1) {
                handleLevelComplete();
              }
            }, 1500);
          }}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Daily Word Challenge */}
      {currentView === "daily-word" && selectedLanguage && (
        <DailyWordChallenge
          language={selectedLanguage as any}
          getWord={getDailyWord}
          onComplete={() => {
            completeDailyWord();
            handleBackToHome();
          }}
          onCancel={handleBackToHome}
        />
      )}

      {/* Level Complete Screen */}
      {currentView === "level-complete" && selectedLanguage && (
        <LevelCompleteScreen
          language={selectedLanguage as any}
          progress={progress}
          onContinue={handleContinueAfterLevel}
        />
      )}
    </>
  );
}

// ─── Level Complete Screen (placeholder) ────────────────────────────────

function LevelCompleteScreen({
  language,
  progress,
  onContinue,
}: {
  language: string;
  progress: any;
  onContinue: () => void;
}) {
  const streakText = progress?.streak_count ? `${progress.streak_count} day streak! 🔥` : "Keep it up!";
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background confetti animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, y: -20, x: Math.random() * 400 - 200 }}
            animate={{ opacity: 0, y: 600 }}
            transition={{ duration: 3, delay: i * 0.1, ease: "easeIn" }}
            className="absolute text-4xl"
          >
            {["🎉", "✨", "⭐", "🌟", "🎊"][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-md relative z-10"
      >
        {/* Celebration emoji */}
        <motion.div
          className="text-8xl mb-6"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎉
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-black text-amber-900 mb-4"
        >
          Level Complete!
        </motion.h1>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white rounded-2xl p-4 shadow-md ring-1 ring-amber-100">
            <div className="text-3xl font-black text-amber-600">⭐</div>
            <div className="text-sm font-bold text-stone-700">
              {progress?.stars_earned ?? 0} Stars
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md ring-1 ring-rose-100">
            <div className="text-3xl font-black text-rose-600">🔥</div>
            <div className="text-sm font-bold text-stone-700">
              {streakText}
            </div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-stone-800 mb-8 font-semibold"
        >
          You're becoming a Word Champion! Ready for the next adventure?
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="w-full px-8 py-5 md:py-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl md:text-2xl rounded-3xl hover:shadow-xl transition-all focus-ring"
        >
          ▶ Continue Adventure
        </motion.button>
      </motion.div>
    </div>
  );
}

// Import level configs
import { LEVEL_CONFIGS } from "@/lib/wordBuilder/types";
