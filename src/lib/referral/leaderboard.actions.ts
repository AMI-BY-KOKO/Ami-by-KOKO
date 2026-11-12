'use server';

/**
 * Leaderboard Server Actions
 * Use these from client components to call server functions safely
 */

import {
  getAllTimeLeaderboard,
  getMonthlyLeaderboard,
  getTopChampions,
  getUserLeaderboardPosition,
  updateLeaderboardPrivacy,
} from './leaderboard.server';
import type { LeaderboardEntry, UserLeaderboardPosition } from './leaderboard';

/**
 * Server Action to get leaderboard data (all-time or monthly)
 */
export async function getLeaderboardDataAction(
  period: 'all_time' | 'monthly',
  year?: number,
  month?: number
): Promise<{
  champions: LeaderboardEntry[] | null;
  entries: LeaderboardEntry[] | null;
  error?: string;
}> {
  try {
    if (period === 'all_time') {
      console.log('[getLeaderboardDataAction] Fetching all-time leaderboard');
      const champions = await getTopChampions();
      const entries = await getAllTimeLeaderboard(100, 0);
      console.log('[getLeaderboardDataAction] Got', entries.length, 'entries');
      return { champions, entries };
    } else {
      if (!year || !month) {
        return { champions: null, entries: null, error: 'Year and month required' };
      }
      console.log('[getLeaderboardDataAction] Fetching monthly leaderboard for', year, month);
      const entries = await getMonthlyLeaderboard(year, month, 100, 0);
      const champions = entries.slice(0, 3);
      console.log('[getLeaderboardDataAction] Got', entries.length, 'entries');
      return { champions, entries };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[getLeaderboardDataAction] Error:', errorMessage, err);
    return {
      champions: null,
      entries: null,
      error: `Failed to load leaderboard data: ${errorMessage}`,
    };
  }
}

/**
 * Server Action to get user's leaderboard position
 */
export async function getUserLeaderboardDataAction(
  profileId: string,
  period: 'all_time' | 'monthly' = 'all_time',
  year?: number,
  month?: number
): Promise<{ data: UserLeaderboardPosition | null; error?: string }> {
  try {
    console.log('[getUserLeaderboardDataAction] Getting position for', profileId, period);
    const data = await getUserLeaderboardPosition(
      profileId,
      period,
      year,
      month
    );
    console.log('[getUserLeaderboardDataAction] Got position:', data?.rank);
    return { data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[getUserLeaderboardDataAction] Error:', errorMessage, err);
    return { data: null, error: `Failed to load user position: ${errorMessage}` };
  }
}

/**
 * Server Action to update leaderboard privacy settings
 * @param profileId - Profile ID
 * @param showOnLeaderboard - Whether to show on leaderboard
 * @param publicDisplayName - Name to display (if blank, uses full_name)
 * @returns Success status
 */
export async function updateLeaderboardPrivacyAction(
  profileId: string,
  showOnLeaderboard: boolean,
  publicDisplayName?: string | null
): Promise<{ success: boolean; error?: string }> {
  return updateLeaderboardPrivacy(
    profileId,
    showOnLeaderboard,
    publicDisplayName
  );
}
