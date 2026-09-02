"use client";

/**
 * Main Word Builder Game Component
 * Handles letter tile interactions, word building, answer validation, and feedback.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Koko from "@/components/characters/Koko";
import type { Language } from "@/types";
import type { WordChallenge } from "@/lib/wordBuilder/types";
import { KOKO_DIALOGUE, INSTRUCTION_TEXT, LEVEL_CONFIGS } from "@/lib/wordBuilder/types";
import KokoFeedback from "./KokoFeedback";

interface WordBuilderGameProps {
  language: Language;
  challenge: WordChallenge;
  selectedLetters: string[];
  onSelectLetter: (letter: string) => void;
  onDeselectLetter: () => void;
  onResetSelection: () => void;
  onSubmitAnswer: () => boolean;
  onGetHint: () => Promise<{
    type: 'encouragement' | 'pronunciation' | 'highlight-first' | 'highlight-multi';
    firstLetterToGlow?: string;
    message?: string;
  } | null>;
  onCorrectAnswer: (stars: 1 | 2 | 3) => void;
  onBackToHome: () => void;
}

type GameState = "playing" | "correct" | "wrong" | "hint";

export default function WordBuilderGame({
  language,
  challenge,
  selectedLetters,
  onSelectLetter,
  onDeselectLetter,
  onResetSelection,
  onSubmitAnswer,
  onGetHint,
  onCorrectAnswer,
  onBackToHome,
}: WordBuilderGameProps) {
  const [gameState, setGameState] = useState<GameState>("playing");
  const [kokoReaction, setKokoReaction] = useState<string | null>(null);
  const [currentHint, setCurrentHint] = useState<{
    type: 'encouragement' | 'pronunciation' | 'highlight-first' | 'highlight-multi';
    firstLetterToGlow?: string;
    message?: string;
  } | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const word = challenge.word;
  const instructionText = INSTRUCTION_TEXT[language];
  const dialogue = KOKO_DIALOGUE[language];
  const level = LEVEL_CONFIGS[word.level];

  // ─── Handle letter selection ────────────────────────────────────────────
  const handleLetterClick = (letter: string) => {
    if (gameState !== "playing") return;

    // No audio for Word Adventure
    onSelectLetter(letter);
  };

  const handleRemoveLetter = () => {
    if (selectedLetters.length > 0) {
      onDeselectLetter();
    }
  };

  // ─── Handle answer submission ───────────────────────────────────────────
  const handleSubmitAnswer = () => {
    if (gameState !== "playing" || selectedLetters.length === 0) return;

    const isCorrect = onSubmitAnswer();
    setAttemptCount(prev => prev + 1);

    if (isCorrect) {
      // Correct answer!
      setGameState("correct");

      // Calculate stars based on attempts and hints
      let stars: 1 | 2 | 3 = 3;
      if (attemptCount > 0) stars = 2;
      if (attemptCount > 2) stars = 1;

      setKokoReaction(dialogue.correct[Math.floor(Math.random() * dialogue.correct.length)]);

      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Trigger correct answer callback after animation
      setTimeout(() => {
        onCorrectAnswer(stars);
      }, 2000);
    } else {
      // Wrong answer
      setGameState("wrong");
      setKokoReaction(dialogue.almost[Math.floor(Math.random() * dialogue.almost.length)]);

      // Return to playing state after showing feedback
      setTimeout(() => {
        setGameState("playing");
        onResetSelection();
      }, 2000);
    }
  };

  // ─── Handle hint ────────────────────────────────────────────────────────
  const handleGetHint = async () => {
    if (gameState !== "playing") return;

    const hint = await onGetHint();
    if (!hint) {
      // No more hints available
      setKokoReaction("You're so close! Keep trying!");
      setTimeout(() => setKokoReaction(null), 1500);
      return;
    }

    setCurrentHint(hint);
    
    let feedbackMessage = hint.message || "";
    if (hint.type === 'pronunciation') {
      feedbackMessage = "🎵 Listen carefully!";
    } else if (hint.type === 'highlight-first') {
      feedbackMessage = "✨ First letter glowing!";
    } else if (hint.type === 'highlight-multi') {
      feedbackMessage = "✨ Multiple letters glowing!";
    }
    
    setKokoReaction(feedbackMessage);

    // Hide hint after delay
    const hideDelay = hint.type === 'pronunciation' ? 3000 : 3000;
    setTimeout(() => {
      setCurrentHint(null);
      setKokoReaction(null);
    }, hideDelay);
  };

  // ─── Get highlighted letters based on hint type ──────────────────────────
  const getHintHighlightLetters = (): string[] => {
    if (!currentHint) return [];

    if (currentHint.type === 'highlight-first' && currentHint.firstLetterToGlow) {
      return [currentHint.firstLetterToGlow];
    }

    if (currentHint.type === 'highlight-multi' && currentHint.firstLetterToGlow) {
      // For multi-letter hints, show first two letters max
      const firstLetter = currentHint.firstLetterToGlow;
      const letterIndex = challenge.correctOrder.indexOf(firstLetter);
      if (letterIndex >= 0) {
        return challenge.correctOrder.slice(0, Math.min(letterIndex + 2, challenge.correctOrder.length));
      }
    }

    return [];
  };

  const highlightedLetters = getHintHighlightLetters();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cream-bg to-amber-50 flex flex-col items-center justify-between p-4 md:p-6">
      {/* Header */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <motion.button
            onClick={onBackToHome}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-full transition-colors focus-ring"
            aria-label="Back to home"
          >
            ← Back
          </motion.button>
          
          <motion.button
            onClick={() => {
              onResetSelection();
              setAttemptCount(0);
            }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-full transition-colors focus-ring"
            aria-label="Reset game"
            title="Reset the current word"
          >
            🔄 Reset
          </motion.button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-green-800">
              {level.name}
            </h2>
            <p className="text-xs md:text-sm text-stone-600">{level.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl md:text-3xl font-bold text-amber-600">⭐</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-2xl flex-1 flex flex-col items-center justify-center gap-6 md:gap-8">
        {/* Kòkò character */}
        <motion.div
          animate={gameState === "correct" ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.6 }}
        >
          <Koko speaking={false} className="w-32 h-32 md:w-40 md:h-40" />
        </motion.div>

        {/* Kòkò feedback */}
        <AnimatePresence mode="wait">
          {kokoReaction && (
            <KokoFeedback
              key={kokoReaction}
              text={kokoReaction}
              type={
                gameState === "correct"
                  ? "success"
                  : currentHint
                    ? "hint"
                    : "encouragement"
              }
            />
          )}
        </AnimatePresence>

        {/* Instruction text */}
        <motion.p className="text-lg md:text-2xl font-bold text-stone-800 text-center">
          {instructionText}
        </motion.p>

        {/* Word image/hint */}
        {word.image && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-6xl md:text-8xl"
          >
            {word.image}
          </motion.div>
        )}

        {/* Word slots */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex gap-2 md:gap-4 flex-wrap justify-center"
        >
          {challenge.correctOrder.map((letter, index) => {
            const selectedLetter = selectedLetters[index];
            const isCorrect = selectedLetter === letter;
            const isHighlighted = highlightedLetters.includes(letter);

            return (
              <motion.div
                key={index}
                initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                className={`
                  min-w-[72px] min-h-[72px] md:min-w-[88px] md:min-h-[88px]
                  flex items-center justify-center rounded-2xl md:rounded-3xl
                  text-4xl md:text-5xl font-black
                  transition-all duration-200 shadow-md
                  ${
                    isCorrect
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg ring-2 ring-amber-600"
                      : isHighlighted
                        ? "bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-500 text-stone-800 shadow-lg"
                        : "bg-gradient-to-br from-stone-100 to-stone-200 border-4 border-stone-300 text-stone-300"
                  }
                `}
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: selectedLetter ? 1 : 0, scale: selectedLetter ? 1 : 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedLetter || ""}
                </motion.span>
                {!selectedLetter && (
                  <motion.span
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute"
                  >
                    _
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Letter tiles */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-sm grid gap-3"
        >
          {/* Available letters */}
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {challenge.letters.map((letter, idx) => {
              const isUsed = selectedLetters.includes(letter) &&
                selectedLetters.indexOf(letter) < challenge.correctOrder.indexOf(letter);
              const isSelected = selectedLetters.includes(letter);
              const isHintLetter = highlightedLetters.includes(letter);

              return (
                <motion.button
                  key={`${letter}-${idx}`}
                  onClick={() => handleLetterClick(letter)}
                  whileTap={{ scale: 0.88 }}
                  whileHover={gameState === "playing" && !isSelected ? { scale: 1.08, translateY: -4 } : {}}
                  animate={isHintLetter ? { x: [-4, 4, -4, 4, 0], boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0)", "0 0 0 8px rgba(34, 197, 94, 0.3)", "0 0 0 0 rgba(34, 197, 94, 0)"] } : {}}
                  transition={isHintLetter ? { duration: 0.6, repeat: 2 } : {}}
                  disabled={gameState !== "playing"}
                  className={`
                    h-20 md:h-24 rounded-2xl md:rounded-3xl font-bold text-3xl md:text-4xl
                    transition-all duration-150 cursor-pointer
                    focus-ring shadow-md
                    ${
                      isHintLetter
                        ? "bg-gradient-to-br from-green-300 to-emerald-400 text-white shadow-lg ring-2 ring-green-500"
                        : isSelected
                          ? "bg-gradient-to-br from-stone-400 to-stone-500 opacity-40 cursor-not-allowed shadow-sm"
                          : gameState === "playing"
                            ? "bg-gradient-to-br from-white to-stone-50 border-2 border-stone-300 hover:shadow-lg hover:border-amber-400 text-stone-900 active:shadow-sm active:translate-y-1"
                            : "bg-gradient-to-br from-stone-100 to-stone-200 opacity-50 cursor-not-allowed text-stone-500 border-2 border-stone-300"
                    }
                  `}
                  aria-label={`Letter ${letter}`}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>

          {/* Remove letter button */}
          {selectedLetters.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleRemoveLetter}
              disabled={gameState !== "playing"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 md:py-4 px-4 bg-gradient-to-r from-red-100 to-orange-100 hover:from-red-200 hover:to-orange-200 text-red-700 font-bold rounded-2xl md:rounded-3xl transition-all focus-ring shadow-md"
              aria-label="Remove last letter"
            >
              ↩ Remove Last
            </motion.button>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <motion.button
              onClick={handleGetHint}
              disabled={gameState !== "playing"}
              whileTap={{ scale: 0.95 }}
              whileHover={gameState === "playing" ? { scale: 1.05 } : {}}
              className={`
                py-3 md:py-4 px-4 rounded-2xl md:rounded-3xl font-bold text-lg md:text-xl transition-all focus-ring shadow-md
                ${
                  gameState === "playing"
                    ? "bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 text-amber-800"
                    : "bg-stone-100 text-stone-400 opacity-50 cursor-not-allowed"
                }
              `}
              aria-label="Get hint"
            >
              💡 Hint
            </motion.button>

            <motion.button
              onClick={handleSubmitAnswer}
              disabled={gameState !== "playing" || selectedLetters.length === 0}
              whileTap={gameState === "playing" && selectedLetters.length > 0 ? { scale: 0.95 } : {}}
              whileHover={gameState === "playing" && selectedLetters.length > 0 ? { scale: 1.05 } : {}}
              className={`
                py-3 md:py-4 px-4 rounded-2xl md:rounded-3xl font-bold text-lg md:text-xl transition-all focus-ring shadow-md
                ${
                  gameState === "playing" && selectedLetters.length > 0
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-lg"
                    : "bg-stone-100 text-stone-400 opacity-50 cursor-not-allowed"
                }
              `}
              aria-label="Check answer"
            >
              ✓ Check
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-2xl text-center text-xs md:text-sm text-stone-500 mt-4">
        <p>Tap letters in order to build the word</p>
      </div>
    </div>
  );
}
