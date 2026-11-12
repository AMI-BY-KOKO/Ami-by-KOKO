/**
 * Leaderboard Types & Client-Safe Utilities
 * Client-safe exports only (types, formatting functions)
 * Server functions are in leaderboard.server.ts
 */

export interface LeaderboardEntry {
  rank: number;
  profileId: string;
  activeReferrals: number;
  totalAttributed: number;
  lastReferralDate: string | null;
  fullName: string;
  publicDisplayName: string | null;
  showOnLeaderboard: boolean;
}

export interface UserLeaderboardPosition {
  rank: number;
  profileId: string;
  activeReferrals: number;
  totalAttributed: number;
  lastReferralDate: string | null;
  fullName: string;
  publicDisplayName: string | null;
}

/**
 * Get current month and year for leaderboard queries
 * @returns Object with year and month
 */
export function getCurrentMonth(): { year: number; month: number } {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
}

/**
 * Format month name for display
 * @param month - Month number (1-12)
 * @param year - Year
 * @returns Formatted month string (e.g., "January 2024")
 */
export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

/**
 * Get all available months for leaderboard filtering
 * Returns current month and 11 previous months
 * @returns Array of {year, month, label}
 */
export function getAvailableMonths(): Array<{ year: number; month: number; label: string }> {
  const months: Array<{ year: number; month: number; label: string }> = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: formatMonthYear(date.getMonth() + 1, date.getFullYear()),
    });
  }

  return months;
}
