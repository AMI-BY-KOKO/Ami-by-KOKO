/**
 * POST /api/referral/confirm-status
 * Confirm referral status after email verification
 * Called after user confirms email address
 * 
 * Updates referral_events.attribution_status to 'confirmed'
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { confirmReferralStatus } from '@/lib/referral/attribution';

export async function POST(request: NextRequest) {
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

    // Confirm referral status for this user
    const result = await confirmReferralStatus(user.id);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to confirm referral status',
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('[confirm-status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm referral status' },
      { status: 500 }
    );
  }
}
