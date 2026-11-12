/**
 * Referral Attribution
 * Atomic, fraud-resistant referral attribution mechanism
 * Called during signup to link new user to referrer
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';
import crypto from 'crypto';

export interface AttributionResult {
  success: boolean;
  referralEventId?: string;
  error?: string;
  fraudScore?: number;
  fraudFlags?: string[];
}

/**
 * Hash IP address for storage (one-way, privacy-preserving)
 * @param ip - IP address string
 * @returns SHA256 hash of IP
 */
export function hashIpAddress(ip: string | null | undefined): string | null {
  if (!ip) return null;
  try {
    return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
  } catch {
    return null;
  }
}

/**
 * Hash user agent for fraud detection
 * @param userAgent - User agent string
 * @returns SHA256 hash of user agent
 */
export function hashUserAgent(userAgent: string | null | undefined): string | null {
  if (!userAgent) return null;
  try {
    return crypto.createHash('sha256').update(userAgent).digest('hex').substring(0, 16);
  } catch {
    return null;
  }
}

export interface AttributionOptions {
  referralCode: string;
  referredProfileId: string;
  referrerIp?: string;
  referredIp?: string;
  userAgent?: string;
}

/**
 * Attribute a new signup to a referrer
 * Atomic database operation via PostgreSQL function
 *
 * CRITICAL RULES ENFORCED:
 * - Code must exist and be active
 * - Cannot self-refer
 * - Cannot duplicate attribute same user
 * - Fraud scoring applied automatically
 * - Transaction atomic at database level
 *
 * @param options - Attribution options
 * @returns Result with event ID and fraud score
 */
export async function attributeReferral(
  options: AttributionOptions
): Promise<AttributionResult> {
  const {
    referralCode,
    referredProfileId,
    referrerIp,
    referredIp,
    userAgent,
  } = options;

  try {
    // Validate inputs
    if (!referralCode || typeof referralCode !== 'string') {
      return {
        success: false,
        error: 'Invalid referral code',
      };
    }

    if (!referredProfileId || typeof referredProfileId !== 'string') {
      return {
        success: false,
        error: 'Invalid referred profile ID',
      };
    }

    // Hash IP and user agent for fraud detection
    const referrerIpHash = hashIpAddress(referrerIp);
    const referredIpHash = hashIpAddress(referredIp);
    const userAgentHash = hashUserAgent(userAgent);

    const supabase = await createClient();

    // Call PostgreSQL function — atomic with fraud checks
    // @ts-expect-error Supabase RPC types not fully inferred
    const { data, error } = await supabase.rpc('attribute_referral', {
      p_referral_code: referralCode,
      p_referred_profile_id: referredProfileId,
      p_referrer_ip_hash: referrerIpHash || undefined,
      p_referred_ip_hash: referredIpHash || undefined,
      p_user_agent_hash: userAgentHash || undefined,
    }) as any;

    if (error) {
      console.error('[attributeReferral] RPC error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'No response from attribution function',
      };
    }

    const result = data[0] as {
      success: boolean;
      referral_event_id: string | null;
      error: string | null;
      fraud_score: number;
    };

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Attribution failed',
        fraudScore: result.fraud_score || 0,
      };
    }

    return {
      success: true,
      referralEventId: result.referral_event_id as string | undefined,
      fraudScore: result.fraud_score || 0,
    };
  } catch (err) {
    console.error('[attributeReferral] Exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Confirm referral status after email confirmation
 * Updates attribution_status to 'confirmed'
 *
 * @param referredProfileId - Profile ID of referred user
 * @returns Success status
 */
export async function confirmReferralStatus(
  referredProfileId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // @ts-expect-error Supabase RPC types not fully inferred
    const { data, error } = await supabase.rpc('confirm_referral_status', {
      p_referred_profile_id: referredProfileId,
      p_new_status: 'confirmed',
    }) as any;

    if (error) {
      console.error('[confirmReferralStatus] RPC error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'No response from confirmation function',
      };
    }

    const result = data[0] as {
      success: boolean;
      error: string | null;
    };

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to confirm referral status',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('[confirmReferralStatus] Exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Mark referral as active when subscription is activated
 * Called when referred user completes payment/activates subscription
 *
 * @param referredProfileId - Profile ID of referred user
 * @returns Success status
 */
export async function activateReferralSubscription(
  referredProfileId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    
    const { data: activateData, error: activateError } = await (supabase as any).rpc(
      'activate_referral_subscription',
      {
        p_referred_profile_id: referredProfileId,
      }
    );

    if (activateError) {
      console.error('[activateReferralSubscription] RPC error:', activateError);
      return {
        success: false,
        error: activateError.message,
      };
    }

    if (!activateData || activateData.length === 0) {
      return {
        success: false,
        error: 'No response from subscription activation function',
      };
    }

    const result = activateData[0] as {
      success: boolean;
      error: string | null;
    };

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to activate referral subscription',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('[activateReferralSubscription] Exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Get referral event details (for auditing)
 * @param referralEventId - Referral event ID
 * @returns Full referral event record
 */
export async function getReferralEvent(
  referralEventId: string
): Promise<Database['public']['Tables']['referral_events']['Row'] | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_events')
      .select('*')
      .eq('id', referralEventId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[getReferralEvent] Error:', error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error('[getReferralEvent] Exception:', err);
    return null;
  }
}

/**
 * Check if a profile already has a referral attribution
 * @param profileId - Profile ID to check
 * @returns Referral event if found, null otherwise
 */
export async function checkExistingReferral(
  profileId: string
): Promise<Database['public']['Tables']['referral_events']['Row'] | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_events')
      .select('*')
      .eq('referred_profile_id', profileId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[checkExistingReferral] Error:', error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error('[checkExistingReferral] Exception:', err);
    return null;
  }
}
