"use client";

/**
 * Streak Milestones Component
 * Shows visual badges for streak milestones (3, 7, 14, 30 days).
 * Celebrates achievements with animations and confetti.
 */

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface StreakMilestonesProps {
  streakCount: number;
  isNewMilestone?: boolean;
  onMilestoneReached?: (milestone: number) => void;
}

/**
 * Get milestone data for a given streak count
 */
function getStreakMilestones(streak: number): Array<{
  milestone: number;
  emoji: string;
  label: string;
  message: string;
}> {
  return [
    {
      milestone: 3,
      emoji: "🌱",
      label: "3-Day Sprout",
      message: "Your learning habit is growing!",
    },
    {
      milestone: 7,
      emoji: "🌿",
      label: "7-Day Grove",
      message: "You're building amazing momentum!",
    },
    {
      milestone: 14,
      emoji: "🌳",
      label: "14-Day Forest",
      message: "Incredible dedication! Keep it up!",
    },
    {
      milestone: 30,
      emoji: "🏆",
      label: "30-Day Champion",
      message: "You're a Word Adventure Master!",
    },
  ];
}

function getMilestoneIndex(streak: number): number {
  if (streak >= 30) return 3;
  if (streak >= 14) return 2;
  if (streak >= 7) return 1;
  if (streak >= 3) return 0;
  return -1;
}

export default function StreakMilestones({
  streakCount,
  isNewMilestone = false,
  onMilestoneReached,
}: StreakMilestonesProps) {
  const milestones = getStreakMilestones(streakCount);
  const currentMilestoneIndex = getMilestoneIndex(streakCount);
  const currentMilestone = milestones[currentMilestoneIndex] || null;

  // Trigger celebration on new milestone
  useEffect(() => {
    if (isNewMilestone && currentMilestone) {
      // Confetti celebration
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#F43F5E", "#10B981"],
      });

      // Callback
      if (onMilestoneReached) {
        onMilestoneReached(currentMilestone.milestone);
      }
    }
  }, [isNewMilestone, currentMilestone, onMilestoneReached]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Milestone Badges Grid */}
      <div className="w-full grid grid-cols-4 gap-2 md:gap-3">
        {milestones.map((milestone, idx) => {
          const isReached = streakCount >= milestone.milestone;
          const isCurrent = idx === currentMilestoneIndex;

          return (
            <motion.div
              key={milestone.milestone}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {/* Badge */}
              <motion.div
                animate={
                  isCurrent && isNewMilestone
                    ? {
                        scale: [1, 1.15, 1],
                        rotate: [0, 5, -5, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className={`flex flex-col items-center justify-center aspect-square rounded-2xl transition-all duration-300 ring-2 ${
                  isReached
                    ? isCurrent
                      ? "bg-gradient-to-br from-amber-300 to-orange-400 ring-amber-500 shadow-lg"
                      : "bg-gradient-to-br from-green-100 to-emerald-100 ring-green-400 shadow-md"
                    : "bg-stone-100 ring-stone-300 opacity-50"
                }`}
              >
                <div className="text-2xl md:text-3xl mb-1">{milestone.emoji}</div>
                <div className="text-[9px] md:text-[10px] font-black text-center text-stone-700 px-1">
                  {milestone.milestone}d
                </div>
              </motion.div>

              {/* Reached indicator */}
              {isReached && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs md:text-sm font-black shadow-lg"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Current Milestone Info */}
      {currentMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`w-full text-center p-4 md:p-5 rounded-2xl ring-2 transition-all ${
            isNewMilestone
              ? "bg-gradient-to-r from-amber-50 to-orange-50 ring-amber-300 shadow-lg"
              : "bg-stone-50 ring-stone-200"
          }`}
        >
          <motion.div
            animate={isNewMilestone ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="text-3xl md:text-4xl mb-2"
          >
            {currentMilestone.emoji}
          </motion.div>
          <h3 className="text-lg md:text-xl font-black text-stone-800 mb-1">
            {currentMilestone.label}
          </h3>
          <p className="text-sm md:text-base text-stone-600 font-medium">
            {currentMilestone.message}
          </p>
          <div className="mt-3 text-2xl md:text-3xl font-black text-amber-600">
            🔥 {streakCount}-Day Streak
          </div>
        </motion.div>
      )}

      {/* Next Milestone Encouragement */}
      {currentMilestoneIndex >= 0 && currentMilestoneIndex < milestones.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm md:text-base text-stone-600 italic"
        >
          <p>
            {milestones[currentMilestoneIndex + 1].milestone - streakCount} more day
            {milestones[currentMilestoneIndex + 1].milestone - streakCount !== 1 ? "s" : ""} until{" "}
            <span className="font-bold text-green-700">
              {milestones[currentMilestoneIndex + 1].label}
            </span>
          </p>
        </motion.div>
      )}

      {/* Master Milestone Celebration */}
      {streakCount >= 30 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full text-center p-4 md:p-6 bg-gradient-to-r from-amber-200 via-rose-200 to-orange-200 rounded-2xl shadow-lg ring-2 ring-amber-400"
        >
          <div className="text-4xl md:text-5xl mb-2">🏆👑✨</div>
          <p className="text-lg md:text-xl font-black text-amber-900">
            You're a Word Adventure Legend!
          </p>
          <p className="text-sm md:text-base text-amber-800 mt-2 font-semibold">
            An incredible 30-day learning journey! 🎉
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
