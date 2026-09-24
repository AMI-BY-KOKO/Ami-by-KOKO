/**
 * Streaks System - Server Actions
 *
 * Records activity and manages streak state for children.
 * Integrates with learning_paths and daily_challenges systems.
 *
 * Usage:
 *   import { recordActivity } from "@/lib/streaks/actions";
 *   const result = await recordActivity(childId);
 *   if (result.isMilestone) { show celebration }
 */

"use server";

import { createClient } from "@/lib/supabase/server";

export interface StreakResult {
  childId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  streakIncreased: boolean;
  isMilestone: boolean;
  milestoneDay: number;
}

/**
 * Record an activity completion (learning path or daily challenge).
 *
 * Calls the Postgres record_activity() function which:
 *   - If already active today: no-op
 *   - If last active yesterday: increment streak, check for milestone
 *   - If last active older/null: reset streak to 1
 *
 * Returns streak state including milestone detection.
 */
export async function recordActivity(childId: string): Promise<StreakResult | null> {
  try {
    const supabase = await createClient();

    // Call the Postgres function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("record_activity", {
      p_child_id: childId,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn("[recordActivity] No data returned from record_activity RPC");
      return null;
    }

    const result = data[0];

    return {
      childId: result.child_id,
      currentStreak: result.current_streak,
      longestStreak: result.longest_streak,
      lastActiveDate: result.last_active_date,
      streakIncreased: result.streak_increased,
      isMilestone: result.is_milestone,
      milestoneDay: result.milestone_day,
    };
  } catch (err) {
    console.error("[recordActivity] Error:", err);
    return null;
  }
}

/**
 * Get current streak info for a child (without recording activity).
 * Used for displaying streak on home screen without side effects.
 */
export async function getChildStreak(childId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
} | null> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("child_profiles")
      .select("current_streak, longest_streak, last_active_date")
      .eq("id", childId)
      .single();

    if (error) throw error;

    return {
      currentStreak: data?.current_streak || 0,
      longestStreak: data?.longest_streak || 0,
      lastActiveDate: data?.last_active_date || null,
    };
  } catch (err) {
    console.error("[getChildStreak] Error:", err);
    return null;
  }
}
