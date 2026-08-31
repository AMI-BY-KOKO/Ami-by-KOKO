"use client";

/**
 * Game Mode Selector Component
 * Allows player to choose between BUILD, LISTEN, and FIND modes.
 * Architecture for future modes; currently only BUILD is functional.
 */

import { motion } from "framer-motion";
import type { Language } from "@/types";

export type GameMode = "BUILD" | "LISTEN" | "FIND";

interface GameModeSelectorProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  language: Language;
  disabled?: boolean;
}

/**
 * Game mode definitions with descriptions
 */
const GAME_MODES = [
  {
    id: "BUILD" as GameMode,
    emoji: "🧩",
    label: "BUILD",
    title: "Letter Puzzle",
    description: "Arrange letters to build words",
    color: "from-amber-400 to-orange-500",
    textColor: "text-amber-900",
    borderColor: "border-amber-300",
    status: "available",
  },
  {
    id: "LISTEN" as GameMode,
    emoji: "🎧",
    label: "LISTEN",
    title: "Sound Challenge",
    description: "Hear a word, spell it out",
    color: "from-blue-400 to-cyan-500",
    textColor: "text-blue-900",
    borderColor: "border-blue-300",
    status: "coming-soon",
  },
  {
    id: "FIND" as GameMode,
    emoji: "🔍",
    label: "FIND",
    title: "Word Hunt",
    description: "Find the word from picture clues",
    color: "from-green-400 to-emerald-500",
    textColor: "text-green-900",
    borderColor: "border-green-300",
    status: "coming-soon",
  },
];

export default function GameModeSelector({
  selectedMode,
  onSelectMode,
  language,
  disabled = false,
}: GameModeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <h3 className="text-xl md:text-2xl font-black text-stone-800 mb-1">
          Choose Your Mode
        </h3>
        <p className="text-sm md:text-base text-stone-600 font-medium">
          Different ways to build and explore words
        </p>
      </motion.div>

      {/* Mode Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {GAME_MODES.map((mode, idx) => {
          const isSelected = selectedMode === mode.id;
          const isAvailable = mode.status === "available";

          return (
            <motion.button
              key={mode.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + idx * 0.08 }}
              onClick={() => isAvailable && onSelectMode(mode.id)}
              disabled={!isAvailable || disabled}
              className={`relative p-5 md:p-6 rounded-2xl transition-all duration-300 focus-ring ${
                isSelected
                  ? `bg-gradient-to-br ${mode.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-white ring-opacity-50`
                  : isAvailable
                    ? `bg-gradient-to-br ${mode.color} bg-opacity-10 ${mode.textColor} border-2 ${mode.borderColor} hover:bg-opacity-20 cursor-pointer`
                    : `bg-stone-100 text-stone-500 border-2 border-stone-300 cursor-not-allowed opacity-60`
              }`}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
            >
              {/* Coming Soon Badge */}
              {mode.status === "coming-soon" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full"
                >
                  Soon
                </motion.div>
              )}

              {/* Emoji */}
              <motion.div
                className="text-4xl md:text-5xl mb-3"
                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                transition={{
                  duration: 0.6,
                  repeat: isSelected ? Infinity : 0,
                  repeatDelay: 2,
                }}
              >
                {mode.emoji}
              </motion.div>

              {/* Mode Label */}
              <div className="text-xs md:text-sm font-black tracking-wider mb-1">
                {mode.label}
              </div>

              {/* Mode Title */}
              <div className="text-lg md:text-xl font-bold mb-2">
                {mode.title}
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm font-medium opacity-90 leading-snug">
                {mode.description}
              </p>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-3 right-3 text-lg"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 md:p-5 bg-blue-50 rounded-2xl ring-1 ring-blue-200"
      >
        <div className="flex gap-2 md:gap-3">
          <span className="text-lg md:text-xl">💡</span>
          <div>
            <p className="text-sm md:text-base font-semibold text-blue-900 mb-1">
              Level up with different modes
            </p>
            <p className="text-xs md:text-sm text-blue-800">
              BUILD mode is available now. LISTEN and FIND modes coming soon to make learning more interactive and fun!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Architecture Notes (for development) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-xs text-stone-500 italic text-center"
      >
        <p>📋 Architecture ready for future modes | Currently: BUILD functional</p>
      </motion.div>
    </motion.div>
  );
}
