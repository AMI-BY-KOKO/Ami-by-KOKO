/**
 * GET /api/referral/get-code
 * Get referral code for authenticated user
 * Used by referral dashboard to display user's code and stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getReferralCode, getReferralCodeRecord, generateReferralCode } from '@/lib/referral/code-generation';
import { getReferralStats } from '@/lib/referral/stats';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get referral code for user
    let codeRecord = await getReferralCodeRecord(user.id);

    // If no code exists, generate one
    if (!codeRecord) {
      console.log('[get-code] No code found, generating new one for user', user.id);
      const generateResult = await generateReferralCode(user.id);
      if (generateResult.success && generateResult.code) {
        // Fetch the newly created code record
        codeRecord = await getReferralCodeRecord(user.id);
      } else {
        console.error('[get-code] Failed to generate code:', generateResult.error);
        // Return empty stats instead of 404
        return NextResponse.json({
          success: false,
          error: 'Unable to generate referral code',
          stats: {
            profileId: user.id,
            totalCodesGenerated: 0,
            totalReferralsAttributed: 0,
            confirmedReferrals: 0,
            activeSubscriptions: 0,
            churned: 0,
            lastReferralDate: null,
          },
        });
      }
    }

    if (!codeRecord) {
      // Still no code - return graceful failure
      return NextResponse.json({
        success: false,
        error: 'Referral code unavailable',
        stats: {
          profileId: user.id,
          totalCodesGenerated: 0,
          totalReferralsAttributed: 0,
          confirmedReferrals: 0,
          activeSubscriptions: 0,
          churned: 0,
          lastReferralDate: null,
        },
      });
    }

    // Get referral stats
    const stats = await getReferralStats(user.id);

    return NextResponse.json({
      success: true,
      code: codeRecord.code,
      status: codeRecord.status,
      generatedAt: codeRecord.generated_at,
      stats: stats || {
        profileId: user.id,
        totalCodesGenerated: 0,
        totalReferralsAttributed: 0,
        confirmedReferrals: 0,
        activeSubscriptions: 0,
        churned: 0,
        lastReferralDate: null,
      },
    });
  } catch (error) {
    console.error('[get-code] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve referral code' },
      { status: 500 }
    );
  }
}
