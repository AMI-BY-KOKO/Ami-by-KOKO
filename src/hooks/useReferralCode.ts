/**
 * React Hook for Referral Code Management
 * Safely manages referral code capture and state
 */

'use client';

import { useEffect, useState } from 'react';
import {
  captureAndStoreReferralCode,
  getReferralCodeFromCookie,
  clearReferralCodeCookie,
  hasReferralCode,
} from '@/lib/referral/client-cookies';

export interface UseReferralCodeReturn {
  code: string | null;
  hasCode: boolean;
  isLoading: boolean;
  error: string | null;
  clearCode: () => void;
}

/**
 * Hook to manage referral code from URL and cookies
 * Automatically captures code from ?ref= parameter on mount
 * Stores in cookie for persistence across navigation
 *
 * @returns Object with code, loading state, error, and clear function
 */
export function useReferralCode(): UseReferralCodeReturn {
  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Capture from URL and store in cookie (idempotent)
      const capturedCode = captureAndStoreReferralCode();
      setCode(capturedCode);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('[useReferralCode] Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCode = () => {
    clearReferralCodeCookie();
    setCode(null);
  };

  return {
    code,
    hasCode: hasReferralCode(),
    isLoading,
    error,
    clearCode,
  };
}

/**
 * Hook to get the referral code for display/sharing
 * Doesn't capture from URL; just retrieves stored code
 *
 * @returns Referral code or null
 */
export function useStoredReferralCode(): string | null {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedCode = getReferralCodeFromCookie();
      setCode(storedCode);
    } catch (err) {
      console.error('[useStoredReferralCode] Error:', err);
    }
  }, []);

  return code;
}
