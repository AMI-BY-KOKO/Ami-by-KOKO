"use client";

/**
 * StreakDisplay Component
 *
 * Shows current streak (🔥 X-day streak) and longest streak info.
 * Positioned near XP/level display on home screen.
 * Designed for children's UX with clear, encouraging visuals.
 */

import { useEffect, useState } from "react";
import { getChildStreak } from "@/lib/streaks/actions";
import { useChild } from "@/hooks/useChild";
import { motion } from "framer-motion";

interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export function StreakDisplay() {
  const { activeChild } = useChild();
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeChild?.id) return;

    const loadStreak = async () => {
      setLoading(true);
      try {
        const result = await getChildStreak(activeChild.id);
        if (result) {
          setStreak(result);
        }
      } catch (err) {
        console.error("[StreakDisplay] Failed to load streak:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStreak();
  }, [activeChild?.id]);

  if (loading || !streak) {
    return (
      <div className="h-16 w-full animate-pulse rounded-2xl bg-gray-200" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-3"
    >
      {/* Current Streak Badge */}
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-100 to-orange-100 px-4 py-3 shadow-sm">
        <div className="text-3xl">🔥</div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-700">Your Streak</div>
          <div className="text-xl font-bold text-amber-600">
            {streak.currentStreak}-day streak
          </div>
        </div>
      </div>

      {/* Personal Best Badge */}
      {streak.longestStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 text-sm"
        >
          <div className="text-xl">🏆</div>
          <div className="flex-1 text-gray-700">
            Personal best: <span className="font-bold text-amber-700">{streak.longestStreak} days</span>
          </div>
        </motion.div>
      )}

      {/* Encouragement message */}
      {streak.currentStreak > 0 && (
        <div className="text-xs text-gray-600 px-4">
          Keep it going! Complete a lesson or daily challenge to maintain your streak. 💪
        </div>
      )}
    </motion.div>
  );
}

/**
 * Compact version of StreakDisplay for sidebars/cards.
 * Just shows the fire emoji + number.
 */
export function StreakDisplayCompact() {
  const { activeChild } = useChild();
  const [streak, setStreak] = useState<StreakInfo | null>(null);

  useEffect(() => {
    if (!activeChild?.id) return;

    const loadStreak = async () => {
      try {
        const result = await getChildStreak(activeChild.id);
        if (result) {
          setStreak(result);
        }
      } catch (err) {
        console.error("[StreakDisplayCompact] Failed to load streak:", err);
      }
    };

    loadStreak();
  }, [activeChild?.id]);

  if (!streak || streak.currentStreak === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700"
    >
      <span>🔥</span>
      <span>{streak.currentStreak}</span>
    </motion.div>
  );
}

/**
 * Streak badge for leaderboards/parent dashboards.
 * Shows current + longest streak side by side.
 */
export function StreakBadge({ childId }: { childId: string }) {
  const [streak, setStreak] = useState<StreakInfo | null>(null);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const result = await getChildStreak(childId);
        if (result) {
          setStreak(result);
        }
      } catch (err) {
        console.error("[StreakBadge] Failed to load streak:", err);
      }
    };

    loadStreak();
  }, [childId]);

  if (!streak) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {streak.currentStreak > 0 && (
        <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
          <span>🔥</span>
          <span>{streak.currentStreak}</span>
        </div>
      )}
      {streak.longestStreak > 0 && (
        <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
          <span>🏆</span>
          <span>{streak.longestStreak}</span>
        </div>
      )}
    </div>
  );
}
