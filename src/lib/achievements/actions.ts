/**
 * Achievements System - Server Actions
 *
 * Manages achievement checking, awarding, and retrieval.
 * These are "use server" functions that can be called from Client Components.
 *
 * Usage:
 *   import { checkAndAwardAchievements, getChildAllAchievements } from "@/lib/achievements/actions";
 *   const result = await checkAndAwardAchievements(childId);
 *   if (result.newAchievementIds.length > 0) { show celebration }
 */

"use server";

import { createClient } from "@/lib/supabase/server";

export interface Achievement {
  id: string;
  code: string;
  name: string;
  icon: string;
  description: string;
}

export interface ChildAchievementWithStatus extends Achievement {
  earned: boolean;
  earnedAt: string | null;
}

export interface CheckAndAwardResult {
  success: boolean;
  achievementsAwarded: number;
  newAchievementIds: string[];
  newAchievements?: Achievement[];
  error?: string;
}

/**
 * Check all achievements for a child and award any newly met ones.
 *
 * Calls the Postgres check_and_award_achievements() function which:
 *   - Evaluates all unearned achievements
 *   - Checks against child_progress (activity counts)
 *   - Checks against child_profiles (streaks)
 *   - Inserts newly met achievements into child_achievements
 *
 * Returns the count and IDs of newly awarded achievements.
 */
export async function checkAndAwardAchievements(childId: string): Promise<CheckAndAwardResult> {
  try {
    const supabase = await createClient();

    // Call the Postgres function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("check_and_award_achievements", {
      p_child_id: childId,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        success: true,
        achievementsAwarded: 0,
        newAchievementIds: [],
      };
    }

    const result = data[0];
    const newAchievementIds = result.new_achievement_ids || [];

    // If achievements were awarded, fetch their details for display
    let newAchievements: Achievement[] = [];
    if (newAchievementIds.length > 0) {
      newAchievements = await getAchievementsById(newAchievementIds);
    }

    return {
      success: true,
      achievementsAwarded: result.achievements_awarded || 0,
      newAchievementIds,
      newAchievements,
    };
  } catch (err) {
    console.error("[checkAndAwardAchievements] Error:", err);
    return {
      success: false,
      achievementsAwarded: 0,
      newAchievementIds: [],
      error: err instanceof Error ? err.message : "Failed to check achievements",
    };
  }
}

/**
 * Get all earned achievements for a child.
 */
export async function getChildAchievements(childId: string): Promise<Achievement[]> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("get_child_achievements", {
      p_child_id: childId,
    });

    if (error) throw error;

    return (data || []).map((a: any) => ({
      id: a.id,
      code: a.code,
      name: a.name,
      icon: a.icon,
      description: a.description,
    }));
  } catch (err) {
    console.error("[getChildAchievements] Error:", err);
    return [];
  }
}

/**
 * Get all achievements (earned + unearned) for a child with status.
 * Used for badge display showing locked/unlocked state.
 */
export async function getChildAllAchievements(
  childId: string
): Promise<ChildAchievementWithStatus[]> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("get_child_all_achievements", {
      p_child_id: childId,
    });

    if (error) throw error;

    return (data || []).map((a: any) => ({
      id: a.id,
      code: a.code,
      name: a.name,
      icon: a.icon,
      description: a.description,
      earned: a.earned,
      earnedAt: a.earned_at,
    }));
  } catch (err) {
    console.error("[getChildAllAchievements] Error:", err);
    return [];
  }
}

/**
 * Get specific achievements by their IDs.
 * Used internally for fetching details of newly awarded achievements.
 */
async function getAchievementsById(achievementIds: string[]): Promise<Achievement[]> {
  try {
    if (achievementIds.length === 0) return [];

    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("achievements")
      .select("id, code, name, icon, description")
      .in("id", achievementIds);

    if (error) throw error;

    return (data || []).map((a: any) => ({
      id: a.id,
      code: a.code,
      name: a.name,
      icon: a.icon,
      description: a.description,
    }));
  } catch (err) {
    console.error("[getAchievementsById] Error:", err);
    return [];
  }
}

/**
 * Check and award achievements for multiple children (for backfill).
 * Returns a summary of how many achievements were awarded per child.
 */
export async function backfillAchievementsForAllChildren(): Promise<{
  success: boolean;
  childrenProcessed: number;
  totalAchievementsAwarded: number;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get all child IDs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: children, error: childrenError } = await (supabase as any)
      .from("child_profiles")
      .select("id");

    if (childrenError) throw childrenError;

    let totalAchievementsAwarded = 0;
    const childrenProcessed = (children || []).length;

    // Process each child
    for (const child of children || []) {
      const result = await checkAndAwardAchievements(child.id);
      if (result.success) {
        totalAchievementsAwarded += result.achievementsAwarded;
      }
    }

    return {
      success: true,
      childrenProcessed,
      totalAchievementsAwarded,
    };
  } catch (err) {
    console.error("[backfillAchievementsForAllChildren] Error:", err);
    return {
      success: false,
      childrenProcessed: 0,
      totalAchievementsAwarded: 0,
      error: err instanceof Error ? err.message : "Failed to backfill achievements",
    };
  }
}
