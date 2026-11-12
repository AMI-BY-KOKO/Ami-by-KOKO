/**
 * Referral Validation
 * Server-side validation utilities for referral codes
 */

import { createClient } from '@/lib/supabase/server';

export interface CodeValidationResult {
  isValid: boolean;
  code?: string;
  profileId?: string;
  profileName?: string;
  reason?: string;
}

/**
 * Comprehensive validation of referral code
 * Checks: format, existence, active status
 *
 * @param code - The referral code to validate
 * @returns Validation result with details
 */
export async function validateAndGetCodeDetails(
  code: string
): Promise<CodeValidationResult> {
  try {
    // Format validation: 6-8 uppercase alphanumeric
    if (!code || typeof code !== 'string') {
      return {
        isValid: false,
        reason: 'Code is required',
      };
    }

    const trimmedCode = code.toUpperCase().trim();

    if (!/^[A-Z0-9]{6,8}$/.test(trimmedCode)) {
      return {
        isValid: false,
        reason: 'Code format invalid (must be 6-8 alphanumeric characters)',
      };
    }

    const supabase = await createClient();

    // Get code and profile details
    const { data, error } = await supabase
      .from('referral_codes')
      .select(`
        code,
        status,
        profile_id,
        profiles!inner(full_name)
      `)
      .eq('code', trimmedCode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          isValid: false,
          reason: 'Referral code not found',
        };
      }
      console.error('[validateAndGetCodeDetails] Error:', error);
      return {
        isValid: false,
        reason: 'Error validating code',
      };
    }

    if (!data) {
      return {
        isValid: false,
        reason: 'Referral code not found',
      };
    }

    const codeRecord = data as any;

    // Check if code is active
    if (codeRecord.status !== 'active') {
      return {
        isValid: false,
        reason: `Code is ${codeRecord.status}`,
      };
    }

    return {
      isValid: true,
      code: codeRecord.code,
      profileId: codeRecord.profile_id,
      profileName: codeRecord.profiles?.full_name || 'Referrer',
    };
  } catch (err) {
    console.error('[validateAndGetCodeDetails] Exception:', err);
    return {
      isValid: false,
      reason: 'Internal validation error',
    };
  }
}

/**
 * Check if a code can be used (doesn't require full profile details)
 * @param code - The referral code
 * @returns True if code is valid and active
 */
export async function isCodeValid(code: string): Promise<boolean> {
  try {
    const result = await validateAndGetCodeDetails(code);
    return result.isValid;
  } catch {
    return false;
  }
}

/**
 * Validate that user is not self-referring
 * @param code - The referral code
 * @param currentProfileId - Profile ID of user attempting to use code
 * @returns True if not self-referral
 */
export async function validateNotSelfReferral(
  code: string,
  currentProfileId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_codes')
      .select('profile_id')
      .eq('code', code.toUpperCase().trim())
      .single();

    if (error || !data) {
      return true; // Assume not self-referral if code invalid
    }

    const codeRecord = data as any;
    return codeRecord.profile_id !== currentProfileId;
  } catch {
    return true; // Assume not self-referral on error
  }
}

/**
 * Check if a profile already has a referral attribution
 * @param profileId - Profile ID to check
 * @returns True if already referred
 */
export async function hasExistingReferral(profileId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('referral_events')
      .select('id')
      .eq('referred_profile_id', profileId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false; // No existing referral
      }
      console.error('[hasExistingReferral] Error:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('[hasExistingReferral] Exception:', err);
    return false;
  }
}

/**
 * Validate referral code with all pre-attribution checks
 * @param code - Referral code
 * @param newProfileId - Profile ID of person using code
 * @returns Detailed validation result
 */
export async function validateBeforeAttribution(
  code: string,
  newProfileId: string
): Promise<{
  isValid: boolean;
  reason?: string;
  profileId?: string;
}> {
  // Step 1: Basic format and existence check
  const codeValidation = await validateAndGetCodeDetails(code);
  if (!codeValidation.isValid) {
    return {
      isValid: false,
      reason: codeValidation.reason,
    };
  }

  // Step 2: Prevent self-referral
  const isNotSelf = await validateNotSelfReferral(code, newProfileId);
  if (!isNotSelf) {
    return {
      isValid: false,
      reason: 'Cannot use your own referral code',
    };
  }

  // Step 3: Check for existing referral on this profile
  const hasExisting = await hasExistingReferral(newProfileId);
  if (hasExisting) {
    return {
      isValid: false,
      reason: 'This profile already has a referral attribution',
    };
  }

  return {
    isValid: true,
    profileId: codeValidation.profileId,
  };
}
