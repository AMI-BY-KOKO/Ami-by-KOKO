/**
 * Leaderboard Server Functions
 * Server-only queries that access the database
 * Use in Server Components, Route Handlers, and Server Actions
 */

import { createClient } from '@/lib/supabase/server';
import type { LeaderboardEntry, UserLeaderboardPosition } from './leaderboard';

/**
 * Get all-time leaderboard with limit and offset for pagination
 * @param limit - Number of entries to return (default 50)
 * @param offset - Pagination offset (default 0)
 * @returns Array of leaderboard entries
 */
export async function getAllTimeLeaderboard(
  limit: number = 50,
  offset: number = 0
): Promise<LeaderboardEntry[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('leaderboard_rankings_all_time')
      .select('*')
      .range(offset, offset + limit - 1) as any;

    if (error) {
      console.error('[getAllTimeLeaderboard] Error:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    return (data as any[]).map((row) => ({
      rank: row.rank,
      profileId: row.profile_id,
      activeReferrals: row.active_referrals || 0,
      totalAttributed: row.total_attributed || 0,
      lastReferralDate: row.last_referral_date,
      fullName: row.full_name || 'Anonymous',
      publicDisplayName: row.public_display_name,
      showOnLeaderboard: row.show_on_leaderboard,
    }));
  } catch (err) {
    console.error('[getAllTimeLeaderboard] Exception:', err);
    return [];
  }
}

/**
 * Get monthly leaderboard for a specific month
 * @param year - Year (e.g., 2024)
 * @param month - Month (1-12)
 * @param limit - Number of entries (default 50)
 * @param offset - Pagination offset (default 0)
 * @returns Array of leaderboard entries for the month
 */
export async function getMonthlyLeaderboard(
  year: number,
  month: number,
  limit: number = 50,
  offset: number = 0
): Promise<LeaderboardEntry[]> {
  try {
    // Validate month
    if (month < 1 || month > 12) {
      console.error('[getMonthlyLeaderboard] Invalid month:', month);
      return [];
    }

    const supabase = await createClient();

    const rpcResult = await (supabase.rpc(
      'get_monthly_leaderboard',
      {
        p_year: year,
        p_month: month,
      } as any
    ) as any);

    const { data, error } = rpcResult;

    if (error) {
      console.error('[getMonthlyLeaderboard] Error:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Apply pagination in memory (RPC doesn't support LIMIT/OFFSET)
    return (data as any[])
      .slice(offset, offset + limit)
      .map((row) => ({
        rank: row.rank,
        profileId: row.profile_id,
        activeReferrals: row.active_referrals || 0,
        totalAttributed: row.total_attributed || 0,
        lastReferralDate: row.last_referral_date,
        fullName: row.full_name || 'Anonymous',
        publicDisplayName: row.public_display_name,
        showOnLeaderboard: row.show_on_leaderboard,
      }));
  } catch (err) {
    console.error('[getMonthlyLeaderboard] Exception:', err);
    return [];
  }
}

/**
 * Get a user's specific position on the leaderboard
 * Useful for showing user's rank even if not in top N
 * @param profileId - Profile ID to look up
 * @param period - 'all_time' or 'monthly'
 * @param year - Year (for monthly)
 * @param month - Month (for monthly, 1-12)
 * @returns User's leaderboard position or null if not ranked
 */
export async function getUserLeaderboardPosition(
  profileId: string,
  period: 'all_time' | 'monthly' = 'all_time',
  year?: number,
  month?: number
): Promise<UserLeaderboardPosition | null> {
  try {
    const supabase = await createClient();

    const now = new Date();
    const defaultYear = year || now.getFullYear();
    const defaultMonth = month || now.getMonth() + 1;

    const rpcResult = await (supabase.rpc(
      'get_user_leaderboard_position',
      {
        p_profile_id: profileId,
        p_year: defaultYear,
        p_month: defaultMonth,
        p_period: period,
      } as any
    ) as any);

    const { data, error } = rpcResult;

    if (error) {
      console.error('[getUserLeaderboardPosition] Error:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const row = data[0];

    return {
      rank: row.rank,
      profileId: row.profile_id,
      activeReferrals: row.active_referrals || 0,
      totalAttributed: row.total_attributed || 0,
      lastReferralDate: row.last_referral_date,
      fullName: row.full_name || 'Anonymous',
      publicDisplayName: row.public_display_name,
    };
  } catch (err) {
    console.error('[getUserLeaderboardPosition] Exception:', err);
    return null;
  }
}

/**
 * Get top 3 champions (podium positions)
 * @returns First 3 leaderboard entries
 */
export async function getTopChampions(): Promise<LeaderboardEntry[]> {
  return getAllTimeLeaderboard(3, 0);
}

/**
 * Update user's leaderboard privacy settings
 * @param profileId - Profile ID
 * @param showOnLeaderboard - Whether to show on leaderboard
 * @param publicDisplayName - Name to display (if blank, uses full_name)
 * @returns Success status
 */
export async function updateLeaderboardPrivacy(
  profileId: string,
  showOnLeaderboard: boolean,
  publicDisplayName?: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const updateResult = await ((supabase as any)
      .from('profiles')
      .update({
        show_on_leaderboard: showOnLeaderboard,
        public_display_name: publicDisplayName || null,
      })
      .eq('id', profileId));

    const { error } = updateResult;

    if (error) {
      console.error('[updateLeaderboardPrivacy] Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err) {
    console.error('[updateLeaderboardPrivacy] Exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
