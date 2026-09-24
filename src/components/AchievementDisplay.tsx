"use client";

/**
 * AchievementDisplay Component
 *
 * Shows all achievements (earned + locked) for a child.
 * Earned badges display in full color, locked badges are grayed out with description.
 * Positioned on profile/dashboard screens.
 */

import { useEffect, useState } from "react";
import { getChildAllAchievements, type ChildAchievementWithStatus } from "@/lib/achievements/actions";
import { motion } from "framer-motion";

interface AchievementDisplayProps {
  childId: string;
  title?: string;
  showUnearned?: boolean; // Default: true (show locked badges)
}

export function AchievementDisplay({
  childId,
  title = "🏆 Achievements",
  showUnearned = true,
}: AchievementDisplayProps) {
  const [achievements, setAchievements] = useState<ChildAchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) return;

    const loadAchievements = async () => {
      setLoading(true);
      try {
        const result = await getChildAllAchievements(childId);
        console.log("[AchievementDisplay] Loaded achievements:", result);
        console.log("[AchievementDisplay] Earned count:", result.filter(a => a.earned).length);
        result.forEach(a => {
          if (a.earned) {
            console.log(`[AchievementDisplay] ✓ EARNED: ${a.name} (${a.id})`);
          }
        });
        setAchievements(result);
      } catch (err) {
        console.error("[AchievementDisplay] Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [childId]);

  const earnedAchievements = achievements.filter((a) => a.earned);
  const unearnedAchievements = achievements.filter((a) => !a.earned);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-800">{title}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-stone-800">{title}</h2>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-green-700">Earned ({earnedAchievements.length})</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {earnedAchievements.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative"
              >
                <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-50 shadow-md ring-2 ring-amber-300 hover:shadow-lg transition cursor-pointer">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="text-xs font-bold text-center text-amber-900 line-clamp-2">
                    {achievement.name}
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                  <div className="bg-stone-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                    {achievement.earnedAt && (
                      <div className="text-amber-300">
                        Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Unearned Achievements (Locked) */}
      {showUnearned && unearnedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-600">
            Keep Learning ({unearnedAchievements.length})
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {unearnedAchievements.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (earnedAchievements.length + idx) * 0.05 }}
                className="group relative"
              >
                <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-100 shadow-sm ring-2 ring-gray-300 opacity-60 hover:opacity-80 transition cursor-help">
                  <div className="text-4xl grayscale opacity-50">{achievement.icon}</div>
                  <div className="text-xs font-bold text-center text-stone-600 line-clamp-2">
                    {achievement.name}
                  </div>
                </div>

                {/* Description tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 w-48">
                  <div className="bg-stone-900 text-white text-xs rounded-lg px-3 py-2">
                    <div className="font-bold mb-1">{achievement.name}</div>
                    <div className="text-stone-300">{achievement.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {achievements.length === 0 && (
        <div className="text-center py-8 text-stone-500">
          <p className="text-sm">No achievements yet. Keep learning! 🌟</p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact achievement badge row for dashboards/sidebars.
 * Shows only earned badges in a horizontal scrollable list.
 */
export function AchievementBadgeRow({ childId }: { childId: string }) {
  const [achievements, setAchievements] = useState<ChildAchievementWithStatus[]>([]);

  useEffect(() => {
    if (!childId) return;

    const loadAchievements = async () => {
      try {
        const result = await getChildAllAchievements(childId);
        setAchievements(result.filter((a) => a.earned));
      } catch (err) {
        console.error("[AchievementBadgeRow] Failed to load achievements:", err);
      }
    };

    loadAchievements();
  }, [childId]);

  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-50 px-3 py-2 rounded-full ring-1 ring-amber-300 hover:shadow-md transition cursor-pointer"
          title={achievement.description}
        >
          <span className="text-2xl">{achievement.icon}</span>
          <span className="text-xs font-bold text-amber-900 whitespace-nowrap">{achievement.name}</span>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Achievement counter badge (e.g., "3 badges earned").
 * Useful for quick stats display.
 */
export function AchievementCounter({ childId }: { childId: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!childId) return;

    const loadCount = async () => {
      try {
        const result = await getChildAllAchievements(childId);
        setCount(result.filter((a) => a.earned).length);
      } catch (err) {
        console.error("[AchievementCounter] Failed to load count:", err);
      }
    };

    loadCount();
  }, [childId]);

  if (count === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-1 rounded-full text-sm font-bold text-amber-900 shadow-md"
    >
      <span>🏆</span>
      <span>{count}</span>
    </motion.div>
  );
}
