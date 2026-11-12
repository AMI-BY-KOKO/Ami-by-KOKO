/**
 * GET /api/referral/get-referrals
 * Get referrals made by authenticated user
 * Query params: limit (default 50)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getReferralsByProfile } from '@/lib/referral/stats';

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

    // Get limit from query params
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

    // Get referrals for this user
    const referrals = await getReferralsByProfile(user.id, limit);

    return NextResponse.json({
      success: true,
      data: referrals,
    });
  } catch (error) {
    console.error('[get-referrals] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve referrals' },
      { status: 500 }
    );
  }
}
