/**
 * Referral Statistics
 * Query and display referral metrics and leaderboards
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

export interface ReferralStats {
  profileId: string;
  totalCodesGenerated: number;
  totalReferralsAttributed: number;
  confirmedReferrals: number;
  activeSubscriptions: number;
  churned: number;
  lastReferralDate?: string;
}

/**
 * Get referral stats for a profile
 * @param profileId - Profile ID
 * @returns Referral stats object
 */
export async function getReferralStats(
  profileId: string
): Promise<ReferralStats | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_stats')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[getReferralStats] Error:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    const statsRecord = data as any;

    return {
      profileId: statsRecord.profile_id,
      totalCodesGenerated: statsRecord.total_codes_generated || 0,
      totalReferralsAttributed: statsRecord.total_referrals_attributed || 0,
      confirmedReferrals: statsRecord.confirmed_referrals || 0,
      activeSubscriptions: statsRecord.active_subscriptions || 0,
      churned: statsRecord.churned_referrals || 0,
      lastReferralDate: statsRecord.last_referral_date,
    };
  } catch (err) {
    console.error('[getReferralStats] Exception:', err);
    return null;
  }
}

export interface ReferralListItem {
  referralEventId: string;
  referredProfileId: string;
  referredAt: string;
  status: 'pending' | 'confirmed' | 'active' | 'churned';
  fraudScore: number;
}

/**
 * Get all referrals made by a profile
 * @param profileId - Profile ID of referrer
 * @param limit - Maximum results (default 100)
 * @returns Array of referral events
 */
export async function getReferralsByProfile(
  profileId: string,
  limit: number = 100
): Promise<ReferralListItem[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_events')
      .select('id, referred_profile_id, referred_at, attribution_status, fraud_score')
      .eq('referrer_profile_id', profileId)
      .order('referred_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getReferralsByProfile] Error:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    return (data as any[]).map((row) => ({
      referralEventId: row.id,
      referredProfileId: row.referred_profile_id,
      referredAt: row.referred_at,
      status: row.attribution_status as any,
      fraudScore: row.fraud_score || 0,
    }));
  } catch (err) {
    console.error('[getReferralsByProfile] Exception:', err);
    return [];
  }
}

export interface LeaderboardEntry {
  rank: number;
  profileId: string;
  fullName: string;
  activeSubscriptions: number;
  confirmedReferrals: number;
}

/**
 * Get top referrers by active subscriptions
 * @param limit - Number of top referrers to return (default 50)
 * @returns Leaderboard entries
 */
export async function getTopReferrers(limit: number = 50): Promise<LeaderboardEntry[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_stats')
      .select(`
        profile_id,
        active_subscriptions,
        confirmed_referrals,
        profiles(full_name)
      `)
      .order('active_subscriptions', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[getTopReferrers] Error:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    return (data as any[]).map((row, index) => ({
      rank: index + 1,
      profileId: row.profile_id,
      fullName: row.profiles?.full_name || 'Unknown',
      activeSubscriptions: row.active_subscriptions || 0,
      confirmedReferrals: row.confirmed_referrals || 0,
    }));
  } catch (err) {
    console.error('[getTopReferrers] Exception:', err);
    return [];
  }
}

/**
 * Get referral conversion funnel for analysis
 * @param profileId - Profile ID of referrer
 * @returns Object with conversion stages
 */
export async function getReferralConversionFunnel(
  profileId: string
): Promise<{
  attributed: number;
  confirmed: number;
  active: number;
  conversionRate: number;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_events')
      .select('attribution_status')
      .eq('referrer_profile_id', profileId);

    if (error) {
      console.error('[getReferralConversionFunnel] Error:', error);
      return { attributed: 0, confirmed: 0, active: 0, conversionRate: 0 };
    }

    if (!data) {
      return { attributed: 0, confirmed: 0, active: 0, conversionRate: 0 };
    }

    const eventList = data as any[];
    const attributed = eventList.length;
    const confirmed = eventList.filter((r) => r.attribution_status !== 'pending').length;
    const active = eventList.filter((r) => r.attribution_status === 'active').length;
    const conversionRate = attributed > 0 ? (active / attributed) * 100 : 0;

    return {
      attributed,
      confirmed,
      active,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };
  } catch (err) {
    console.error('[getReferralConversionFunnel] Exception:', err);
    return { attributed: 0, confirmed: 0, active: 0, conversionRate: 0 };
  }
}

/**
 * Get audit logs for a referral event (admin/super-admin only)
 * @param referralEventId - Referral event ID
 * @returns Array of audit log entries
 */
export async function getReferralAuditLog(
  referralEventId: string
): Promise<Database['public']['Tables']['referral_audit_log']['Row'][]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_audit_log')
      .select('*')
      .eq('referral_event_id', referralEventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getReferralAuditLog] Error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[getReferralAuditLog] Exception:', err);
    return [];
  }
}
