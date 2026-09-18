/**
 * Streaks System Utilities (non-server)
 *
 * Utility functions and constants for streak functionality.
 * This file contains no "use server" directive, so it can be imported in Client Components.
 */

/**
 * Streak milestones that trigger celebrations
 */
export const STREAK_MILESTONES = [3, 7, 14, 30, 100];

/**
 * Get milestone message and emoji
 */
export function getStreakMilestoneMessage(day: number): string {
  const messages: Record<number, string> = {
    3: "🔥 3-Day Streak! You're on fire!",
    7: "🔥 One Week Streak! Amazing consistency!",
    14: "🔥 Two Weeks Strong! You're unstoppable!",
    30: "🔥 One Month Milestone! Incredible effort!",
    100: "🔥 100-Day Streak! You're a legend!",
  };
  return messages[day] || "🔥 New Milestone!";
}
