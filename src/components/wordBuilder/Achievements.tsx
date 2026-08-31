"use client";

/**
 * Achievements Display Component
 * Shows earned badges/achievements with unlock status.
 * Features:
 * - Grid view of achievements
 * - Visual indicators for locked/unlocked
 * - Animation on unlock
 * - Responsive design
 */

import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import type { Achievement, AchievementType } from "@/lib/wordBuilder/types";
import { ACHIEVEMENTS } from "@/lib/wordBuilder/types";

interface AchievementsProps {
  unlockedIds: AchievementType[];
  newlyUnlockedId?: AchievementType;
  onAchievementUnlock?: (id: AchievementType) => void;
}

export default function Achievements({
  unlockedIds,
  newlyUnlockedId,
  onAchievementUnlock,
}: AchievementsProps) {
  const achievementList = Object.values(ACHIEVEMENTS);

  // Trigger celebration on new unlock
  useEffect(() => {
    if (newlyUnlockedId) {
      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#FFD700", "#FFA500", "#FF6347"],
      });

      if (onAchievementUnlock) {
        onAchievementUnlock(newlyUnlockedId);
      }
    }
  }, [newlyUnlockedId, onAchievementUnlock]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <span className="text-4xl">🏆</span>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-amber-900">
            Achievements
          </h2>
          <p className="text-sm md:text-base text-stone-700 font-medium">
            {unlockedIds.length} / {achievementList.length} unlocked
          </p>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="w-full"
      >
        <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedIds.length / achievementList.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence mode="popLayout">
          {achievementList.map((achievement, idx) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            const isNewlyUnlocked = achievement.id === newlyUnlockedId;

            return (
              <motion.div
                key={achievement.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: idx * 0.05,
                  duration: 0.3,
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="group"
              >
                {/* Badge Card */}
                <motion.div
                  animate={
                    isNewlyUnlocked
                      ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 5, -5, 0],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    repeat: isNewlyUnlocked ? 3 : 0,
                  }}
                  className={`relative aspect-square rounded-2xl p-4 md:p-5 flex flex-col items-center justify-center text-center transition-all duration-300 ring-2 cursor-default ${
                    isUnlocked
                      ? isNewlyUnlocked
                        ? "bg-gradient-to-br from-yellow-200 to-amber-300 ring-yellow-500 shadow-lg"
                        : "bg-gradient-to-br from-amber-100 to-yellow-100 ring-amber-400 shadow-md"
                      : "bg-stone-100 ring-stone-300 opacity-50"
                  }`}
                  title={achievement.description}
                >
                  {/* Badge emoji */}
                  <motion.div
                    className="text-5xl md:text-6xl mb-2"
                    animate={
                      isNewlyUnlocked
                        ? {
                            scale: [1, 1.15, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.6,
                      repeat: isNewlyUnlocked ? Infinity : 0,
                      repeatDelay: 2,
                    }}
                  >
                    {achievement.emoji}
                  </motion.div>

                  {/* Badge label */}
                  <div className="text-xs md:text-sm font-black text-center text-stone-800 line-clamp-2 px-1">
                    {achievement.label}
                  </div>

                  {/* Unlock checkmark */}
                  {isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs md:text-sm font-black shadow-lg"
                    >
                      ✓
                    </motion.div>
                  )}

                  {/* Lock icon for locked */}
                  {!isUnlocked && (
                    <motion.div
                      className="absolute -bottom-2 -right-2 text-xl opacity-70"
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      🔒
                    </motion.div>
                  )}
                </motion.div>

                {/* Tooltip on hover - show unlock condition for locked */}
                {!isUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-10 pointer-events-none"
                  >
                    {achievement.unlockCondition}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Unlocked List */}
      {unlockedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4 border-t border-stone-200"
        >
          <h3 className="text-lg font-bold text-stone-800 mb-3">Unlocked Badges</h3>
          <div className="flex flex-wrap gap-2">
            {unlockedIds.map((id) => {
              const achievement = ACHIEVEMENTS[id];
              return (
                <motion.div
                  key={id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full px-4 py-2 ring-1 ring-amber-300 text-sm font-semibold text-amber-900"
                >
                  <span className="text-xl">{achievement.emoji}</span>
                  <span>{achievement.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Encouragement for locked achievements */}
      {unlockedIds.length < achievementList.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="p-4 md:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl ring-1 ring-blue-200"
        >
          <p className="text-sm md:text-base text-blue-900 font-semibold">
            Keep playing to unlock more achievements! 🚀
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
