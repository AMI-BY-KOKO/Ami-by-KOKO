/**
 * Referral Statistics (Client-side)
 * Client-side wrapper for fetching referral metrics from API routes
 * Use this in Client Components instead of stats.ts
 */

export interface ReferralStats {
  profileId: string;
  totalCodesGenerated: number;
  totalReferralsAttributed: number;
  confirmedReferrals: number;
  activeSubscriptions: number;
  churned: number;
  lastReferralDate?: string;
}

export interface ReferralListItem {
  referralEventId: string;
  referredProfileId: string;
  referredAt: string;
  status: 'pending' | 'confirmed' | 'active' | 'churned';
  fraudScore: number;
}

export interface LeaderboardEntry {
  rank: number;
  profileId: string;
  fullName: string;
  activeSubscriptions: number;
  confirmedReferrals: number;
}

/**
 * Get all referrals made by the authenticated user
 * @param limit - Maximum results (default 50)
 * @returns Array of referral events
 */
export async function getReferralsByProfile(
  limit: number = 50
): Promise<ReferralListItem[]> {
  try {
    const response = await fetch(`/api/referral/get-referrals?limit=${limit}`);
    if (!response.ok) {
      console.error('[getReferralsByProfile] API error:', response.status);
      return [];
    }
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error('[getReferralsByProfile] Error:', err);
    return [];
  }
}

/**
 * Get top referrers by active subscriptions
 * @param limit - Number of top referrers to return (default 50)
 * @returns Leaderboard entries
 */
export async function getTopReferrers(limit: number = 50): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(`/api/referral/get-leaderboard?limit=${limit}`);
    if (!response.ok) {
      console.error('[getTopReferrers] API error:', response.status);
      return [];
    }
    const result = await response.json();
    return result.data || [];
  } catch (err) {
    console.error('[getTopReferrers] Error:', err);
    return [];
  }
}
