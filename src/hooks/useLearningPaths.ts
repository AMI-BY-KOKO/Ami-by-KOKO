/**
 * useLearningPaths Hook
 *
 * Provides access to child's learning path data and completion status.
 * 
 * Usage:
 *   const { missions, subjectProgress, loading } = useLearningPaths();
 */

"use client";

import { useEffect, useState } from "react";
import { useChild } from "@/hooks/useChild";
import {
  getNextRecommendedActivities,
  getChildAllProgress,
  getSubjectCompletionPercentage,
  type TodaysMission,
  type ChildProgressItem,
} from "@/lib/learning-paths/actions";

interface SubjectProgress {
  subject: string;
  completionPercentage: number;
  totalItems: number;
  completedItems: number;
}

interface LearningPathsData {
  missions: TodaysMission;
  allProgress: ChildProgressItem[];
  subjectProgress: Record<string, SubjectProgress>;
  loading: boolean;
  error: string | null;
}

export function useLearningPaths(): LearningPathsData {
  const { activeChild } = useChild();
  const [data, setData] = useState<LearningPathsData>({
    missions: {},
    allProgress: [],
    subjectProgress: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!activeChild) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const load = async () => {
      setData(prev => ({ ...prev, loading: true }));

      try {
        // Get today's missions
        const missions = await getNextRecommendedActivities(activeChild.id);

        // Get all progress
        const allProgress = await getChildAllProgress(activeChild.id);

        // Get completion % per subject
        const subjectProgress: Record<string, SubjectProgress> = {};
        const subjects = ["literacy", "numbers", "vocabulary", "world", "stories"];

        for (const subject of subjects) {
          const percentage = await getSubjectCompletionPercentage(activeChild.id, subject);
          const subjectItems = allProgress.filter(p => p.subject === subject);
          const completedItems = subjectItems.filter(p => p.status === "completed").length;

          subjectProgress[subject] = {
            subject,
            completionPercentage: percentage,
            totalItems: subjectItems.length,
            completedItems,
          };
        }

        setData({
          missions,
          allProgress,
          subjectProgress,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("[useLearningPaths] Error:", err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    };

    load();
  }, [activeChild]);

  return data;
}
