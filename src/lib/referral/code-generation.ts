/**
 * Referral Code Generation
 * Handles atomic code generation via PostgreSQL function
 * Every profile gets exactly one unique, permanent code
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

export interface ReferralCodeResult {
  success: boolean;
  code?: string | null;
  error?: string;
}

/**
 * Generate a referral code for a profile (via PostgreSQL function)
 * This function is called automatically by a trigger when a profile is created.
 * Can also be called manually if code needs to be regenerated.
 *
 * @param profileId - The profile ID (UUID)
 * @returns Result with success status, code, or error
 */
export async function generateReferralCode(
  profileId: string
): Promise<ReferralCodeResult> {
  try {
    const supabase = await createClient();

    // Call PostgreSQL function to generate unique code
    // Using service role to bypass RLS
    // @ts-expect-error Supabase RPC types not fully inferred
    const { data, error } = await supabase.rpc('generate_referral_code', {
      p_profile_id: profileId,
    }) as any;

    if (error) {
      console.error('[generateReferralCode] RPC error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'No response from code generation function',
      };
    }

    const result = data[0] as {
      success: boolean;
      code: string | null;
      error: string | null;
    };

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Unknown error during code generation',
      };
    }

    return {
      success: true,
      code: result.code,
    };
  } catch (err) {
    console.error('[generateReferralCode] Exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Retrieve existing referral code for a profile
 * @param profileId - The profile ID (UUID)
 * @returns The referral code or null if not found
 */
export async function getReferralCode(profileId: string): Promise<string | null> {
  try {
    const supabase = await createClient();

    const { data: codeData, error: codeError } = await supabase
      .from('referral_codes')
      .select('code')
      .eq('profile_id', profileId)
      .single();

    if (codeError) {
      if (codeError.code === 'PGRST116') {
        // No rows found
        return null;
      }
      console.error('[getReferralCode] Error:', codeError);
      return null;
    }

    if (!codeData) {
      return null;
    }

    const codeRecord = codeData as any;
    return codeRecord.code as string | null;
  } catch (err) {
    console.error('[getReferralCode] Exception:', err);
    return null;
  }
}

/**
 * Get full referral code record for a profile
 * @param profileId - The profile ID (UUID)
 * @returns Full referral code record or null
 */
export async function getReferralCodeRecord(
  profileId: string
): Promise<Database['public']['Tables']['referral_codes']['Row'] | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[getReferralCodeRecord] Error:', error);
      return null;
    }

    const codeRecord = data as any;
    return codeRecord || null;
  } catch (err) {
    console.error('[getReferralCodeRecord] Exception:', err);
    return null;
  }
}

/**
 * Validate referral code format and existence
 * @param code - The referral code to validate
 * @returns True if code exists and is active; false otherwise
 */
export async function validateReferralCode(code: string): Promise<boolean> {
  try {
    // Basic format validation: 6-8 alphanumeric uppercase
    if (!/^[A-Z0-9]{6,8}$/.test(code)) {
      return false;
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_codes')
      .select('id')
      .eq('code', code)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return false;
      }
      console.error('[validateReferralCode] Error:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('[validateReferralCode] Exception:', err);
    return false;
  }
}

/**
 * Get profile ID for a given referral code
 * @param code - The referral code
 * @returns Profile ID or null if not found
 */
export async function getProfileIdFromCode(code: string): Promise<string | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_codes')
      .select('profile_id')
      .eq('code', code)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[getProfileIdFromCode] Error:', error);
      return null;
    }

    const codeRecord = data as any;
    return codeRecord?.profile_id || null;
  } catch (err) {
    console.error('[getProfileIdFromCode] Exception:', err);
    return null;
  }
}
