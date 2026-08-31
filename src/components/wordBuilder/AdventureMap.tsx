"use client";

/**
 * Adventure Map — Visual progression showing the 5 levels as an adventure journey.
 * Maps existing levels to adventure worlds:
 * 1. Letter Garden (🌱)
 * 2. Little Word Path (🌿)
 * 3. Word Forest (🌳)
 * 4. Kòkò's Village (🏡)
 * 5. Kòkò Challenge (🏆)
 *
 * Shows completed, current, and locked worlds.
 * Allows selection of any unlocked world to play.
 */

import { motion } from "framer-motion";
import type { Language } from "@/types";
import type { WordBuilderProgress } from "@/lib/wordBuilder/types";
import { LEVEL_CONFIGS } from "@/lib/wordBuilder/types";

interface AdventureNode {
  level: 1 | 2 | 3 | 4 | 5;
  icon: string;
  name: string;
  description: string;
  milestone: string;
}

const ADVENTURE_NODES: AdventureNode[] = [
  {
    level: 1,
    icon: "🌱",
    name: "Letter Garden",
    description: "Meet your letter friends",
    milestone: "8 words",
  },
  {
    level: 2,
    icon: "🌿",
    name: "Little Word Path",
    description: "Build your first little words",
    milestone: "10 words",
  },
  {
    level: 3,
    icon: "🌳",
    name: "Word Forest",
    description: "Explore new words",
    milestone: "10 words",
  },
  {
    level: 4,
    icon: "🏡",
    name: "Kòkò's Village",
    description: "Build bigger words",
    milestone: "12 words",
  },
  {
    level: 5,
    icon: "🏆",
    name: "Kòkò Challenge",
    description: "Become a Word Champion",
    milestone: "12 words",
  },
];

interface AdventureMapProps {
  progress: WordBuilderProgress | null;
  language: Language;
  onSelectLevel: (level: 1 | 2 | 3 | 4 | 5) => void;
  loading?: boolean;
}

export default function AdventureMap({
  progress,
  language,
  onSelectLevel,
  loading = false,
}: AdventureMapProps) {
  const currentLevel = progress?.current_level ?? 1;
  const wordsCompleted = progress?.words_completed ?? 0;

  // Calculate completion for each level
  const getLevelCompletion = (level: 1 | 2 | 3 | 4 | 5) => {
    const levelConfig = LEVEL_CONFIGS[level];
    if (level < currentLevel) {
      // Previous level is fully complete
      return 100;
    } else if (level === currentLevel) {
      // Current level: show progress
      const wordIndex = progress?.current_word_index ?? 0;
      return Math.min((wordIndex / levelConfig.wordsPerLevel) * 100, 100);
    } else {
      // Future level: locked
      return 0;
    }
  };

  const isLevelUnlocked = (level: 1 | 2 | 3 | 4 | 5) => level <= currentLevel;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Map header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-black text-green-800 mb-2">
          🗺️ Your Word Adventure
        </h2>
        <p className="text-base md:text-lg text-stone-600">
          You're on an amazing journey through {ADVENTURE_NODES[currentLevel - 1].name}
        </p>
      </motion.div>

      {/* Adventure path visualization */}
      <div className="space-y-6 md:space-y-8">
        {ADVENTURE_NODES.map((node, index) => {
          const isCurrentLevel = node.level === currentLevel;
          const isCompleted = node.level < currentLevel;
          const isUnlocked = isLevelUnlocked(node.level);
          const completion = getLevelCompletion(node.level);

          return (
            <motion.div
              key={node.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-4 md:gap-6 items-center"
            >
              {/* Connector line (except last) */}
              {index < ADVENTURE_NODES.length - 1 && (
                <div className="absolute left-[38px] md:left-[54px] top-[72px] md:top-[88px] w-1 h-12 md:h-16 bg-gradient-to-b from-amber-300 to-transparent opacity-40 pointer-events-none" />
              )}

              {/* Level icon circle */}
              <motion.div
                whileHover={isUnlocked ? { scale: 1.15 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                className={`
                  relative flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center text-5xl md:text-6xl cursor-pointer transition-all duration-300 z-10
                  ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-200 to-emerald-200 ring-3 ring-green-400 shadow-lg"
                      : isCurrentLevel
                        ? "bg-gradient-to-br from-amber-200 to-orange-200 ring-4 ring-amber-500 shadow-xl"
                        : "bg-gradient-to-br from-stone-200 to-stone-300 ring-2 ring-stone-400 opacity-60"
                  }
                `}
                onClick={() => {
                  if (isUnlocked && !loading) {
                    onSelectLevel(node.level);
                  }
                }}
                aria-label={`Level ${node.level}: ${node.name}`}
              >
                {node.icon}

                {/* Current level indicator */}
                {isCurrentLevel && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-amber-500"
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Completed checkmark */}
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg"
                  >
                    ✓
                  </motion.div>
                )}

                {/* Locked indicator */}
                {!isUnlocked && (
                  <motion.div className="absolute -bottom-1 -right-1 text-2xl md:text-3xl">
                    🔒
                  </motion.div>
                )}
              </motion.div>

              {/* Level info card */}
              <motion.button
                onClick={() => {
                  if (isUnlocked && !loading) {
                    onSelectLevel(node.level);
                  }
                }}
                disabled={!isUnlocked || loading}
                whileHover={isUnlocked ? { scale: 1.02 } : {}}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                className={`
                  flex-1 text-left p-4 md:p-5 rounded-2xl transition-all duration-300 focus-ring
                  ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300"
                      : isCurrentLevel
                        ? "bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-amber-400 shadow-lg"
                        : "bg-stone-100 border-2 border-stone-300 opacity-60 cursor-not-allowed"
                  }
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`text-lg md:text-xl font-black ${
                      isCurrentLevel ? "text-amber-900" : isCompleted ? "text-green-900" : "text-stone-700"
                    }`}>
                      {node.name}
                    </h3>
                    <p className={`text-xs md:text-sm font-medium ${
                      isCurrentLevel ? "text-amber-700" : isCompleted ? "text-green-700" : "text-stone-600"
                    }`}>
                      {node.description}
                    </p>
                  </div>

                  {/* Status badge */}
                  {isCurrentLevel && (
                    <span className="text-xs md:text-sm font-bold bg-amber-200 text-amber-800 px-3 py-1 rounded-full whitespace-nowrap ml-2">
                      Current
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-xs md:text-sm font-bold bg-green-200 text-green-800 px-3 py-1 rounded-full whitespace-nowrap ml-2">
                      Complete ✓
                    </span>
                  )}
                </div>

                {/* Progress/Milestone info */}
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-stone-600 font-semibold">
                    {node.milestone}
                  </span>

                  {/* Progress bar */}
                  {isCurrentLevel || isCompleted ? (
                    <div className="flex-1 ml-3 h-2 md:h-2.5 bg-stone-300 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          isCompleted
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : "bg-gradient-to-r from-amber-400 to-orange-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${completion}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 font-bold ml-3">🔒 Locked</span>
                  )}
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Map footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-10 p-4 md:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl text-center"
      >
        <p className="text-sm md:text-base font-bold text-amber-900 mb-2">
          🎯 You're doing great! Keep exploring!
        </p>
        <p className="text-xs md:text-sm text-stone-700">
          Complete this level to unlock the next world in your adventure.
        </p>
      </motion.div>
    </div>
  );
}
