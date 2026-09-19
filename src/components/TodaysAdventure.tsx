/**
 * TodaysAdventure Component
 *
 * Displays today's recommended missions based on the child's current progress
 * in the learning paths system.
 *
 * Shows: "Kòkò has a new adventure for you today!" with one recommended
 * activity per subject (literacy, numbers, vocabulary, world, stories).
 *
 * Usage:
 *   <TodaysAdventure childId={activeChild.id} />
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getNextRecommendedActivities, checkProgressInitialization, initializeChildProgress, type TodaysMission } from "@/lib/learning-paths/actions";
import { SUBJECT_EMOJIS_PATH } from "@/lib/learning-paths/constants";

interface TodaysAdventureProps {
  childId: string;
}

export default function TodaysAdventure({ childId }: TodaysAdventureProps) {
  const [missions, setMissions] = useState<TodaysMission>({});
  const [loading, setLoading] = useState(true);
  const [initStatus, setInitStatus] = useState<'not_initialized' | 'initialized_empty' | 'has_available' | 'all_completed'>('not_initialized');

  useEffect(() => {
    const loadMissions = async () => {
      setLoading(true);
      try {
        // Check initialization status
        const status = await checkProgressInitialization(childId);
        setInitStatus(status);

        // If not initialized, initialize and retry
        if (status === 'not_initialized') {
          const result = await initializeChildProgress(childId);
          if (result.success) {
            setInitStatus('has_available');
            const data = await getNextRecommendedActivities(childId);
            setMissions(data);
          } else {
            console.error("[TodaysAdventure] Failed to initialize progress:", result.error);
            setInitStatus('initialized_empty');
          }
        } else {
          // Already initialized, load missions
          const data = await getNextRecommendedActivities(childId);
          setMissions(data);
        }
      } catch (err) {
        console.error("[TodaysAdventure] Failed to load missions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMissions();
  }, [childId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  const missionEntries = Object.entries(missions) as Array<[keyof TodaysMission, TodaysMission[keyof TodaysMission]]>;

  // Case 1: All missions completed today
  if (missionEntries.length === 0 && initStatus === 'all_completed') {
    return (
      <div className="text-center py-8 px-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl ring-1 ring-green-100">
        <div className="text-4xl mb-2">🎉</div>
        <p className="font-bold text-stone-800">Amazing work!</p>
        <p className="text-sm text-stone-600 mt-1">You've completed all today's missions. Come back tomorrow for more!</p>
      </div>
    );
  }

  // Case 2: No missions available (but not all completed) — should not happen if initialization worked
  if (missionEntries.length === 0) {
    return (
      <div className="text-center py-6 px-4 bg-amber-50 rounded-3xl ring-1 ring-amber-100">
        <div className="text-3xl mb-2">🤔</div>
        <p className="font-bold text-stone-800 text-sm">No missions available right now</p>
        <p className="text-xs text-stone-600 mt-1">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
        <div className="text-2xl mb-1">🦜</div>
        <p className="font-bold text-stone-800 text-lg">Kòkò has a new adventure for you today!</p>
        <p className="text-xs text-stone-500 mt-0.5">Complete missions to earn XP and level up</p>
      </motion.div>

      {/* Mission cards */}
      <div className="space-y-3">
        {missionEntries.map(([key, mission], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <MissionCard mission={mission} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Individual Mission Card
 */
function MissionCard({ mission }: { mission: TodaysMission[keyof TodaysMission] | undefined }) {
  if (!mission) return null;

  // Route mapping: translate activity_ref to navigation URL
  const getActivityUrl = (activityRef: string, subject: string): string => {
    if (subject === "literacy" && activityRef.startsWith("letter_")) {
      const letter = activityRef.replace("letter_", "").toUpperCase();
      return `/phonics/english/${letter.toLowerCase()}`;
    }
    if (subject === "numbers" && activityRef.startsWith("number_")) {
      const number = activityRef.replace("number_", "");
      return `/numeracy/english/${number}`;
    }
    if (subject === "vocabulary") {
      // Link to vocabulary main page
      return `/vocabulary`;
    }
    if (subject === "world") {
      return `/world/${activityRef}`;
    }
    if (subject === "stories") {
      return `/story/${activityRef}`;
    }
    return "/home";
  };

  const difficultyStars = "⭐".repeat(Math.min(mission.difficultyLevel, 3));
  const url = getActivityUrl(mission.activityRef, mission.subject);

  return (
    <Link href={url}>
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md ring-1 ring-amber-100 hover:shadow-lg hover:scale-[1.02] transition active:scale-[0.98] text-left">
        {/* Subject emoji */}
        <div className="text-3xl flex-shrink-0">
          {mission.icon}
        </div>

        {/* Mission details */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-stone-800 text-sm leading-tight">
            {mission.activityName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-stone-500">
              {mission.subject === "literacy" && "Phonics"}
              {mission.subject === "numbers" && "Numbers"}
              {mission.subject === "vocabulary" && "Vocabulary"}
              {mission.subject === "world" && "World"}
              {mission.subject === "stories" && "Stories"}
            </span>
            {mission.difficultyLevel > 1 && (
              <span className="text-xs text-amber-600">{difficultyStars}</span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="text-stone-300 text-xl flex-shrink-0">›</div>
      </div>
    </Link>
  );
}

/**
 * MissionCompletionCelebration
 *
 * Show when a mission is completed — displays XP earned and next mission
 */
export function MissionCompletionCelebration({
  xpAwarded,
  nextMissionName,
  nextMissionSubject,
  onClose,
}: {
  xpAwarded: number;
  nextMissionName?: string;
  nextMissionSubject?: string;
  onClose?: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />

        {/* Card */}
        <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center"
          >
            {/* Celebration emoji */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5 }}
              className="text-6xl mb-4 inline-block"
            >
              🎉
            </motion.div>

            <h2 className="text-2xl font-extrabold text-stone-800 mb-2">
              Mission Completed!
            </h2>

            {/* XP earned */}
            <div className="mb-6">
              <p className="text-lg font-bold text-amber-600">+{xpAwarded} XP</p>
              <p className="text-xs text-stone-500">Keep going to level up!</p>
            </div>

            {/* Next mission teaser */}
            {nextMissionName && nextMissionSubject && (
              <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 ring-1 ring-amber-100">
                <p className="text-xs text-stone-600 mb-1">Next up:</p>
                <p className="font-semibold text-sm text-stone-800">
                  {SUBJECT_EMOJIS_PATH[nextMissionSubject]} {nextMissionName}
                </p>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition"
            >
              Continue →
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
