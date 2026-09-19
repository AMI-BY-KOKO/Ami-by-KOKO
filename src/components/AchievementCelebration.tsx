"use client";

/**
 * AchievementCelebration Component
 *
 * Shows a celebration modal when a child earns a new badge/achievement.
 * Reuses the MissionCompletionCelebration visual pattern but with distinct styling
 * (trophy/badge theme, different colors) to differentiate from XP gains and streak milestones.
 *
 * Usage:
 *   const [newAchievementIds, setNewAchievementIds] = useState<string[]>([]);
 *   const [achievements, setAchievements] = useState<Achievement[]>([]);
 *   <AchievementCelebration
 *     achievements={achievements}
 *     onClose={() => { setNewAchievementIds([]); setAchievements([]); }}
 *   />
 */

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AchievementForCelebration {
  id: string;
  code: string;
  name: string;
  icon: string;
  description: string;
}

interface AchievementCelebrationProps {
  achievements: AchievementForCelebration[];
  onClose: () => void;
}

export function AchievementCelebration({
  achievements,
  onClose,
}: AchievementCelebrationProps) {
  // Auto-close after 3 seconds if multiple achievements, 4 seconds if single
  useEffect(() => {
    if (achievements.length === 0) return;
    const timeout = setTimeout(onClose, achievements.length === 1 ? 3500 : 4500);
    return () => clearTimeout(timeout);
  }, [achievements, onClose]);

  if (achievements.length === 0) {
    return null;
  }

  const isSingleAchievement = achievements.length === 1;
  const firstAchievement = achievements[0];

  return (
    <AnimatePresence>
      <motion.div
        key="achievement-celebration-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          key="achievement-celebration-card"
          initial={{ scale: 0.7, opacity: 0, rotateX: -20 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.7, opacity: 0, rotateX: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{ perspective: "1000px" }}
        >
          {/* Decorative background elements */}
          <motion.div
            className="absolute -top-6 -right-6 text-6xl opacity-30"
            animate={{ rotate: 360, y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute -bottom-4 -left-4 text-5xl opacity-30"
            animate={{ rotate: -360, y: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🎊
          </motion.div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            {/* Single Achievement View */}
            {isSingleAchievement && (
              <>
                {/* Badge Icon - Large and animated */}
                <motion.div
                  className="text-7xl filter drop-shadow-lg"
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {firstAchievement.icon}
                </motion.div>

                {/* Achievement Name */}
                <div className="space-y-1">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    New Achievement!
                  </h2>
                  <p className="text-2xl font-bold text-purple-700">{firstAchievement.name}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed max-w-xs">
                  {firstAchievement.description}
                </p>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={onClose}
                  className="mt-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  🎉 Awesome!
                </motion.button>
              </>
            )}

            {/* Multiple Achievements View */}
            {!isSingleAchievement && (
              <>
                {/* Multiple Badges Icon */}
                <motion.div
                  className="text-6xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  🏆
                </motion.div>

                {/* Title */}
                <div className="space-y-1">
                  <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Multiple Achievements!
                  </h2>
                  <p className="text-lg text-purple-700">
                    You earned {achievements.length} badges! 🌟
                  </p>
                </div>

                {/* Achievement List */}
                <div className="w-full max-h-48 overflow-y-auto space-y-2 py-3 px-4 bg-white/60 rounded-2xl backdrop-blur-sm">
                  {achievements.map((achievement, idx) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100"
                    >
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-bold text-purple-700 text-sm truncate">
                          {achievement.name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={onClose}
                  className="mt-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Keep Learning! 🚀
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Quick toast notification for achievements (alternative to modal).
 * Shows briefly at bottom of screen without blocking.
 */
export function AchievementToast({
  achievement,
  show,
  onClose,
}: {
  achievement: AchievementForCelebration | null;
  show: boolean;
  onClose: () => void;
}) {
  // Auto-close after 2 seconds
  useEffect(() => {
    if (!show || !achievement) return;
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [show, achievement, onClose]);

  return (
    <AnimatePresence>
      {show && achievement && (
        <motion.div
          key="achievement-toast"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 shadow-lg"
        >
          <div className="flex items-center gap-3 text-white font-bold">
            <span className="text-2xl">{achievement.icon}</span>
            <span className="text-sm">{achievement.name}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
