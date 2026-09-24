/**
 * Learning Paths System - Server Actions
 *
 * Manages guided journeys through curriculum with unlocking logic.
 * These are "use server" functions that can be called from Client Components.
 *
 * Usage:
 *   import { getNextRecommendedActivities, completeActivity } from "@/lib/learning-paths/actions";
 *   const missions = await getNextRecommendedActivities(childId);
 *   await completeActivity(childId, "letter_a");
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { awardXP, XP_AMOUNTS } from "@/lib/xp/xp";
import { recordActivity } from "@/lib/streaks/actions";
import { checkAndAwardAchievements } from "@/lib/achievements/actions";
import { SUBJECT_EMOJIS_PATH } from "@/lib/learning-paths/constants";

export interface LearningPathItem {
  id: string;
  subject: string;
  sequenceOrder: number;
  activityRef: string;
  activityName: string;
  unlockRequirement: string | null;
  difficultyLevel: number;
}

export interface ChildProgressItem {
  id: string;
  childId: string;
  learningPathId: string;
  subject: string;
  activityRef: string;
  status: "locked" | "available" | "completed";
  completedAt: string | null;
  firstAttemptAt: string | null;
  attemptsCount: number;
}

export interface RecommendedMission {
  subject: string;
  activityRef: string;
  activityName: string;
  sequenceOrder: number;
  difficultyLevel: number;
  icon?: string; // e.g., 🔤 for literacy
}

export interface TodaysMission {
  literacy?: RecommendedMission;
  numbers?: RecommendedMission;
  vocabulary?: RecommendedMission;
  world?: RecommendedMission;
  stories?: RecommendedMission;
}

/**
 * Get today's recommended activities across all subjects.
 * Returns one activity per subject that is currently 'available'.
 * Prioritizes the earliest available item in each subject's sequence.
 *
 * This is the main entry point for the "Today's Mission" UI.
 */
export async function getNextRecommendedActivities(childId: string): Promise<TodaysMission> {
  try {
    const supabase = await createClient();

    // Get all 'available' activities for this child, grouped by subject
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("child_progress")
      .select(`
        id,
        subject,
        activity_ref,
        learning_path_id,
        learning_paths (
          id,
          sequence_order,
          activity_name,
          difficulty_level
        )
      `)
      .eq("child_id", childId)
      .eq("status", "available")
      .order("subject", { ascending: true });

    if (error) {
      console.error("[getNextRecommendedActivities] Query error:", error);
      throw error;
    }

    console.log("[getNextRecommendedActivities] Got data:", data);

    const missions: TodaysMission = {};

    // For each subject, take the first available activity
    const processedSubjects = new Set<string>();

    for (const item of data || []) {
      if (!processedSubjects.has(item.subject)) {
        const pathItem = item.learning_paths;
        if (pathItem && !Array.isArray(pathItem)) {
          // If not an array, it's a single object (which is correct for Postgres)
          missions[item.subject as keyof TodaysMission] = {
            subject: item.subject,
            activityRef: item.activity_ref,
            activityName: pathItem.activity_name,
            sequenceOrder: pathItem.sequence_order,
            difficultyLevel: pathItem.difficulty_level,
            icon: SUBJECT_EMOJIS_PATH[item.subject],
          };
          processedSubjects.add(item.subject);
        } else if (pathItem && Array.isArray(pathItem) && pathItem.length > 0) {
          // Fallback if it is an array
          const path = pathItem[0];
          missions[item.subject as keyof TodaysMission] = {
            subject: item.subject,
            activityRef: item.activity_ref,
            activityName: path.activity_name,
            sequenceOrder: path.sequence_order,
            difficultyLevel: path.difficulty_level,
            icon: SUBJECT_EMOJIS_PATH[item.subject],
          };
          processedSubjects.add(item.subject);
        }
      }
    }

    console.log("[getNextRecommendedActivities] Final missions:", missions);
    return missions;
  } catch (err) {
    console.error("[getNextRecommendedActivities] Error:", err);
    return {};
  }
}

/**
 * Mark an activity as completed.
 * - Updates child_progress status to 'completed'
 * - Unlocks the next item in that subject's sequence (if unlock requirement is met)
 * - Awards XP via the existing awardXP helper
 * - Records activity for streak tracking
 * - Returns the unlocked next activity info for UI feedback
 */
export async function completeActivity(
  childId: string,
  activityRef: string,
  xpSource: "lesson_complete" | "correct_answer" = "lesson_complete"
): Promise<{
  success: boolean;
  completionResult?: {
    activityCompleted: boolean;
    nextActivityRef: string | null;
    nextActivityName: string | null;
    allCompletedInSubject: boolean;
  };
  xpAwarded?: {
    amount: number;
    newLevel: number;
    newXpTotal: number;
  };
  streakResult?: {
    currentStreak: number;
    longestStreak: number;
    isMilestone: boolean;
    milestoneDay: number;
  };
  achievementResult?: {
    achievementsAwarded: number;
    newAchievementIds: string[];
  };
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Call the complete_activity Postgres function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: completionData, error: completionError } = await (supabase as any).rpc(
      "complete_activity",
      {
        p_child_id: childId,
        p_activity_ref: activityRef,
      }
    );

    if (completionError) throw completionError;

    if (!completionData || completionData.length === 0) {
      throw new Error("No data returned from complete_activity");
    }

    const result = completionData[0];

    // Award XP
    const xpAmount = XP_AMOUNTS[xpSource];
    const xpResult = await awardXP(childId, xpSource, xpAmount);

    // Record activity for streak tracking
    const streakResult = await recordActivity(childId);

    // Check and award achievements
    const achievementResult = await checkAndAwardAchievements(childId);

    return {
      success: true,
      completionResult: {
        activityCompleted: result.activity_completed,
        nextActivityRef: result.next_activity_ref,
        nextActivityName: result.next_activity_name,
        allCompletedInSubject: result.all_completed_in_subject,
      },
      xpAwarded: {
        amount: xpAmount,
        newLevel: xpResult.newLevel,
        newXpTotal: xpResult.newXpTotal,
      },
      streakResult: streakResult
        ? {
            currentStreak: streakResult.currentStreak,
            longestStreak: streakResult.longestStreak,
            isMilestone: streakResult.isMilestone,
            milestoneDay: streakResult.milestoneDay,
          }
        : undefined,
      achievementResult: achievementResult.success
        ? {
            achievementsAwarded: achievementResult.achievementsAwarded,
            newAchievementIds: achievementResult.newAchievementIds,
          }
        : undefined,
    };
  } catch (err) {
    console.error("[completeActivity] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to complete activity",
    };
  }
}

/**
 * Initialize learning paths for a new child.
 * Should be called when a new child_profile is created.
 */
export async function initializeChildProgress(childId: string): Promise<{
  success: boolean;
  initializedCount?: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("initialize_child_progress", {
      p_child_id: childId,
    });

    if (error) {
      const errorMsg = error instanceof Error 
        ? error.message 
        : error?.message 
        ? error.message
        : JSON.stringify(error);
      console.error("[initializeChildProgress] RPC error:", errorMsg, "Full error:", error);
      throw new Error(`RPC failed: ${errorMsg}`);
    }

    if (!data || data.length === 0) {
      console.warn("[initializeChildProgress] No data returned, but no error either. This might mean the RPC exists but returned empty.");
      throw new Error("No data returned from initialize_child_progress");
    }

    return {
      success: true,
      initializedCount: data[0].initialized_count,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[initializeChildProgress] Error:", errorMsg, "Stack:", err instanceof Error ? err.stack : 'N/A');
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Get all learning path items for a subject (for "Browse all" view).
 */
export async function getLearningPathBySubject(subject: string): Promise<LearningPathItem[]> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("learning_paths")
      .select("*")
      .eq("subject", subject)
      .order("sequence_order", { ascending: true });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      subject: item.subject,
      sequenceOrder: item.sequence_order,
      activityRef: item.activity_ref,
      activityName: item.activity_name,
      unlockRequirement: item.unlock_requirement,
      difficultyLevel: item.difficulty_level,
    }));
  } catch (err) {
    console.error("[getLearningPathBySubject] Error:", err);
    return [];
  }
}

/**
 * Get a child's progress across all learning paths.
 * Useful for dashboards and progress tracking.
 */
export async function getChildAllProgress(childId: string): Promise<ChildProgressItem[]> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("child_progress")
      .select("*")
      .eq("child_id", childId)
      .order("subject, learning_path_id", { ascending: true });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      childId: item.child_id,
      learningPathId: item.learning_path_id,
      subject: item.subject,
      activityRef: item.activity_ref,
      status: item.status,
      completedAt: item.completed_at,
      firstAttemptAt: item.first_attempt_at,
      attemptsCount: item.attempts_count,
    }));
  } catch (err) {
    console.error("[getChildAllProgress] Error:", err);
    return [];
  }
}

/**
 * Get completion percentage for a subject.
 * Returns 0–100.
 */
export async function getSubjectCompletionPercentage(
  childId: string,
  subject: string
): Promise<number> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: total, error: totalError } = await (supabase as any)
      .from("child_progress")
      .select("*", { count: "exact", head: true })
      .eq("child_id", childId)
      .eq("subject", subject);

    if (totalError) throw totalError;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: completed, error: completedError } = await (supabase as any)
      .from("child_progress")
      .select("*", { count: "exact", head: true })
      .eq("child_id", childId)
      .eq("subject", subject)
      .eq("status", "completed");

    if (completedError) throw completedError;

    const totalCount = total?.length || 0;
    const completedCount = completed?.length || 0;

    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  } catch (err) {
    console.error("[getSubjectCompletionPercentage] Error:", err);
    return 0;
  }
}


/**
 * Check if a child's learning progress has been initialized.
 * Returns:
 * - 'not_initialized': No rows in child_progress (need to call initializeChildProgress)
 * - 'initialized_empty': Rows exist but all are locked (initialization done, no available items yet)
 * - 'has_available': At least one activity is available
 * - 'all_completed': All activities are completed
 */
export async function checkProgressInitialization(childId: string): Promise<
  'not_initialized' | 'initialized_empty' | 'has_available' | 'all_completed'
> {
  try {
    const supabase = await createClient();

    // Get all progress for this child
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("child_progress")
      .select("status")
      .eq("child_id", childId);

    if (error) throw error;

    const allProgress = data || [];

    // Case 1: No rows at all
    if (allProgress.length === 0) {
      return 'not_initialized';
    }

    // Count statuses
    const statuses = new Set(allProgress.map((p: any) => p.status));
    const hasAvailable = statuses.has('available');
    const hasCompleted = statuses.has('completed');
    const hasLocked = statuses.has('locked');

    // Case 2: Has available items
    if (hasAvailable) {
      return 'has_available';
    }

    // Case 3: All completed (no available, at least some completed)
    if (hasCompleted && !hasAvailable && !hasLocked) {
      return 'all_completed';
    }

    // Case 4: Initialized but empty (only locked)
    if (hasLocked && !hasAvailable && !hasCompleted) {
      return 'initialized_empty';
    }

    // Fallback
    return 'initialized_empty';
  } catch (err) {
    console.error("[checkProgressInitialization] Error:", err);
    return 'not_initialized';
  }
}
