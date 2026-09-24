"use client";

/**
 * StreakMilestoneCelebration Component
 *
 * Shows a celebration modal when a child hits a streak milestone (3, 7, 14, 30, 100 days).
 * Reuses the MissionCompletionCelebration visual pattern for consistency.
 * Distinguishable from XP celebrations through copy ("streak milestone" vs "XP earned").
 *
 * Usage:
 *   const [milestoneDay, setMilestoneDay] = useState<number | null>(null);
 *   <StreakMilestoneCelebration
 *     milestoneDay={milestoneDay}
 *     onClose={() => setMilestoneDay(null)}
 *   />
 */

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STREAK_MILESTONES, getStreakMilestoneMessage } from "@/lib/streaks/utils";

interface StreakMilestoneCelebrationProps {
  milestoneDay: number | null;
  onClose: () => void;
}

export function StreakMilestoneCelebration({
  milestoneDay,
  onClose,
}: StreakMilestoneCelebrationProps) {
  // Auto-close after 3 seconds
  useEffect(() => {
    if (milestoneDay === null) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [milestoneDay, onClose]);

  const isMilestone = milestoneDay !== null && STREAK_MILESTONES.includes(milestoneDay);

  if (!isMilestone) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="streak-milestone-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/30 p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          key="streak-milestone-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-orange-50 to-rose-50 p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti-like background elements */}
          <motion.div
            className="absolute -top-4 -left-4 text-5xl opacity-60"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎉
          </motion.div>
          <motion.div
            className="absolute -bottom-4 -right-4 text-5xl opacity-60"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎊
          </motion.div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            {/* Fire emoji - large and animated */}
            <motion.div
              className="text-6xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              🔥
            </motion.div>

            {/* Milestone message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-amber-700">
                {milestoneDay}-Day Streak!
              </h2>
              <p className="text-lg font-semibold text-orange-600">
                {getStreakMilestoneMessage(milestoneDay)}
              </p>
            </div>

            {/* Motivational text */}
            <div className="text-sm text-gray-700 mt-2">
              {milestoneDay === 3 && "You're building momentum! 💪"}
              {milestoneDay === 7 && "A full week! That's incredible consistency!"}
              {milestoneDay === 14 && "Two weeks of dedication! You're unstoppable!"}
              {milestoneDay === 30 && "A whole month! You're a true learning champion!"}
              {milestoneDay === 100 && "100 DAYS! You're a legend in the Àmì family! 👑"}
            </div>

            {/* Close hint */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              className="mt-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Keep Learning! 🚀
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * NewStreakStarted Component
 *
 * Shows when a streak is reset to 1 (neutral/encouraging message, not negative).
 * Usage:
 *   <NewStreakStarted show={streakResetToOne} onClose={() => setShow(false)} />
 */
export function NewStreakStarted({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  // Auto-close after 2 seconds
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="new-streak-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/20 p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            key="new-streak-card"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <motion.div
                className="text-4xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                🔥
              </motion.div>

              <h3 className="text-xl font-bold text-green-700">
                New Streak Started!
              </h3>

              <p className="text-sm text-gray-700">
                Every day is a fresh opportunity. Let's build something amazing! 💪
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Quick celebration modal for any non-milestone streak update.
 * Shows brief encouragement without heavy animation.
 */
export function StreakUpdated({
  show,
  currentStreak,
  onClose,
}: {
  show: boolean;
  currentStreak: number;
  onClose: () => void;
}) {
  // Auto-close after 1.5 seconds
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="streak-updated-toast"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 shadow-lg"
        >
          <div className="flex items-center gap-2 text-white font-semibold">
            <span className="text-xl">🔥</span>
            <span>{currentStreak}-day streak!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
