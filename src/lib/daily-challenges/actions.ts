/**
 * Daily Challenges Server Actions
 *
 * These are "use server" functions that can be called from Client Components.
 * They handle all Supabase operations and XP/learning paths integration.
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { completeActivity } from "@/lib/learning-paths/actions";
import { awardXP } from "@/lib/xp/xp";
import { recordActivity } from "@/lib/streaks/actions";
import { checkAndAwardAchievements } from "@/lib/achievements/actions";

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  questionType: string; // 'letter_sound' | 'number_count' | 'vocab_identify' | 'story_question'
  questionData: Record<string, any>; // Challenge-specific data
  correctAnswer: string;
  activityRef: string | null; // Links to learning_paths.activity_ref if applicable
}

export interface ChildChallengeAttempt {
  attemptId: string;
  challengeDate: string;
  completed: boolean;
  xpAwarded: number;
  challenge?: DailyChallenge;
}

/**
 * Get today's challenge for a child.
 * Creates it if it doesn't exist yet.
 * Handles day boundary using UTC (can be adjusted to child's timezone later).
 */
export async function getTodayChallenge(childId: string): Promise<DailyChallenge | null> {
  try {
    const supabase = await createClient();

    // Get or create today's challenge
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("get_or_create_daily_challenge");

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn("[getTodayChallenge] No challenge returned");
      return null;
    }

    const challenge = data[0];

    return {
      id: challenge.id,
      date: challenge.date,
      questionType: challenge.question_type,
      questionData: challenge.question_data,
      correctAnswer: challenge.correct_answer,
      activityRef: challenge.activity_ref,
    };
  } catch (err) {
    console.error("[getTodayChallenge] Error:", err);
    return null;
  }
}

/**
 * Get a child's attempt status for today.
 * Returns null if not yet attempted.
 * Returns attempt details if already completed or attempted.
 */
export async function getChildTodayAttempt(childId: string): Promise<ChildChallengeAttempt | null> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("get_child_today_challenge_attempt", {
      p_child_id: childId,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      // No attempt yet — create one
      const today = new Date().toISOString().split("T")[0];
      return {
        attemptId: "",
        challengeDate: today,
        completed: false,
        xpAwarded: 0,
      };
    }

    const attempt = data[0];

    return {
      attemptId: attempt.attempt_id,
      challengeDate: attempt.challenge_date,
      completed: attempt.completed,
      xpAwarded: attempt.xp_awarded,
      challenge: attempt.challenge_id
        ? {
            id: attempt.challenge_id,
            date: attempt.challenge_date,
            questionType: attempt.question_type,
            questionData: attempt.question_data,
            correctAnswer: attempt.correct_answer,
            activityRef: attempt.activity_ref,
          }
        : undefined,
    };
  } catch (err) {
    console.error("[getChildTodayAttempt] Error:", err);
    return null;
  }
}

/**
 * Mark today's challenge as completed.
 *
 * If challenge has an activity_ref (linked to learning_paths), calls completeActivity()
 * with 'lesson_complete' source to unlock the next item in that sequence + award XP.
 *
 * Otherwise, calls awardXP() directly with source 'correct_answer' and amount 50.
 *
 * Both paths award the same 50 XP (equivalent to "daily_challenge" value).
 * Records activity for streak tracking.
 * Returns the result so UI can show celebration.
 */
export async function completeDailyChallenge(
  childId: string,
  activityRef: string | null
): Promise<{
  success: boolean;
  xpAwarded: number;
  newLevel: number;
  newXpTotal: number;
  nextActivityName?: string;
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
    const today = new Date().toISOString().split("T")[0];

    // Path 1: Has activity_ref — use completeActivity() which calls learning paths + XP + streak + achievements
    if (activityRef) {
      const result = await completeActivity(childId, activityRef, "lesson_complete");

      if (!result.success) {
        throw new Error(result.error || "Failed to complete activity");
      }

      // Also mark in daily challenge table
      const supabase = await createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).rpc("complete_daily_challenge", {
        p_child_id: childId,
        p_challenge_date: today,
        p_xp_amount: result.xpAwarded?.amount || 50,
      });

      return {
        success: true,
        xpAwarded: result.xpAwarded?.amount || 50,
        newLevel: result.xpAwarded?.newLevel || 1,
        newXpTotal: result.xpAwarded?.newXpTotal || 0,
        nextActivityName: result.completionResult?.nextActivityName || undefined,
        streakResult: result.streakResult
          ? {
              currentStreak: result.streakResult.currentStreak,
              longestStreak: result.streakResult.longestStreak,
              isMilestone: result.streakResult.isMilestone,
              milestoneDay: result.streakResult.milestoneDay,
            }
          : undefined,
        achievementResult: result.achievementResult
          ? {
              achievementsAwarded: result.achievementResult.achievementsAwarded,
              newAchievementIds: result.achievementResult.newAchievementIds,
            }
          : undefined,
      };
    }

    // Path 2: No activity_ref — award XP directly, then mark in daily challenge table, then record streak + achievements
    // Use 'correct_answer' source (10 XP each) but award 50 XP total for daily challenge
    const xpResult = await awardXP(childId, "correct_answer", 50);

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("complete_daily_challenge", {
      p_child_id: childId,
      p_challenge_date: today,
      p_xp_amount: 50,
    });

    // Record activity for streak tracking
    const streakResult = await recordActivity(childId);

    // Check and award achievements
    const achievementResult = await checkAndAwardAchievements(childId);

    return {
      success: true,
      xpAwarded: 50,
      newLevel: xpResult.newLevel,
      newXpTotal: xpResult.newXpTotal,
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
    console.error("[completeDailyChallenge] Error:", err);
    return {
      success: false,
      xpAwarded: 0,
      newLevel: 0,
      newXpTotal: 0,
      error: err instanceof Error ? err.message : "Failed to complete challenge",
    };
  }
}

/**
 * Get challenge completion stats for a child.
 * Used for parent dashboard / progress tracking.
 */
export async function getChildChallengeStats(childId: string): Promise<{
  totalCompleted: number;
  completedThisWeek: number;
  streak: number;
  lastCompletedDate: string | null;
}> {
  try {
    const supabase = await createClient();

    // Get all completed challenges
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("child_daily_challenge_attempts")
      .select("challenge_date")
      .eq("child_id", childId)
      .eq("completed", true)
      .order("challenge_date", { ascending: false });

    if (error) throw error;

    const completedDates = (data || []).map((d: any) => d.challenge_date);
    const totalCompleted = completedDates.length;

    // This week (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];
    const completedThisWeek = completedDates.filter((d: string) => d >= sevenDaysAgoStr).length;

    // Streak calculation: consecutive days completed from today backwards
    let streak = 0;
    let checkDate = new Date();
    while (completedDates.includes(checkDate.toISOString().split("T")[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const lastCompletedDate = completedDates[0] || null;

    return {
      totalCompleted,
      completedThisWeek,
      streak,
      lastCompletedDate,
    };
  } catch (err) {
    console.error("[getChildChallengeStats] Error:", err);
    return {
      totalCompleted: 0,
      completedThisWeek: 0,
      streak: 0,
      lastCompletedDate: null,
    };
  }
}
