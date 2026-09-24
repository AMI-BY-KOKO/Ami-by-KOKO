/**
 * XP and Leveling System
 * Entry point for awarding XP across the app.
 *
 * Usage:
 *   import { awardXP } from "@/lib/xp/xp";
 *   await awardXP(childId, "lesson_complete", 25);
 */

import { createClient } from "@/lib/supabase/server";

export type XPSource = "lesson_complete" | "correct_answer" | "daily_challenge" | "weekly_goal";

// XP amounts per source
export const XP_AMOUNTS: Record<XPSource, number> = {
  lesson_complete: 25,
  correct_answer: 10,
  daily_challenge: 50,
  weekly_goal: 100,
};

// Level info for UI
export interface LevelInfo {
  level: number;
  icon: string;
  name: string;
  xpRequired: number; // XP needed to reach this level from 0
  xpForNext: number;  // XP needed to reach NEXT level
}

/**
 * Calculate XP required to reach a given level (from 0)
 * Formula: xp_required(level) = (level - 1)^2 * 50
 *
 * Level 1: 0 XP
 * Level 2: 50 XP
 * Level 3: 200 XP
 * Level 4: 450 XP
 * Level 5: 800 XP
 * Level 6: 1250 XP
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.pow(level - 1, 2) * 50;
}

/**
 * Calculate level from total XP
 * Formula: level = floor(sqrt(xp_total / 50)) + 1, capped at 10
 */
export function getLevelFromXp(totalXp: number): number {
  const level = Math.floor(Math.sqrt(totalXp / 50)) + 1;
  return Math.min(level, 10);
}

/**
 * Get level info (icon, name) for a given level
 */
export function getLevelInfo(level: number): LevelInfo {
  const caps = [
    { level: 1, icon: "🥚", name: "Beginner" },
    { level: 2, icon: "🐣", name: "Explorer" },
    { level: 3, icon: "🦜", name: "Learner" },
    { level: 4, icon: "⭐", name: "Super Learner" },
    { level: 5, icon: "🏆", name: "Kòkò Champion" },
  ];

  const cap = caps.find(c => c.level === level) || caps[caps.length - 1];
  const xpRequired = getXpRequiredForLevel(level);
  const xpForNext = getXpRequiredForLevel(level + 1);

  return {
    level,
    icon: cap.icon,
    name: cap.name,
    xpRequired,
    xpForNext,
  };
}

/**
 * Calculate progress to next level (0–100)
 */
export function getProgressPercentage(totalXp: number, currentLevel: number): number {
  const currentLevelXp = getXpRequiredForLevel(currentLevel);
  const nextLevelXp = getXpRequiredForLevel(currentLevel + 1);
  const xpInCurrentLevel = totalXp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  if (xpNeeded === 0) return 100; // Max level
  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeeded) * 100));
}

/**
 * Server-side: Award XP to a child
 * This calls the award_xp Postgres function and returns updated state.
 *
 * Idempotent for lesson_complete (max 1 per day per child)
 * Allows multiple entries for other sources
 *
 * @param childId - UUID of child_profiles row
 * @param source - XP source type
 * @param amount - XP amount (usually from XP_AMOUNTS)
 * @returns { awarded, newLevel, newXpTotal } or throws
 */
export async function awardXP(
  childId: string,
  source: XPSource,
  amount: number
): Promise<{
  awarded: boolean;
  newLevel: number;
  newXpTotal: number;
  eventId?: string;
}> {
  try {
    const supabase = await createClient();

    // Call the Postgres function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("award_xp", {
      p_child_id: childId,
      p_source: source,
      p_xp_amount: amount,
    });

    if (error) {
      console.error("[awardXP] Supabase RPC error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned from award_xp");
    }

    const result = data[0];

    return {
      awarded: result.awarded,
      newLevel: result.new_level,
      newXpTotal: result.new_xp_total,
      eventId: result.event_id,
    };
  } catch (err) {
    console.error("[awardXP] Failed to award XP:", err);
    throw err;
  }
}

/**
 * Get XP history for reporting (server-side)
 * Returns all XP events for a child, sorted by date descending
 */
export async function getXPHistory(childId: string, limit: number = 50) {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("xp_events")
      .select("*")
      .eq("child_id", childId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error("[getXPHistory] Failed to fetch history:", err);
    return [];
  }
}
