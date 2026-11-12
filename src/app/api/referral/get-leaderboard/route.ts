/**
 * GET /api/referral/get-leaderboard
 * Get top referrers leaderboard
 * Query params: limit (default 50)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTopReferrers } from '@/lib/referral/stats';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user for context
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

    // Get leaderboard
    const leaderboard = await getTopReferrers(limit);

    return NextResponse.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('[get-leaderboard] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve leaderboard' },
      { status: 500 }
    );
  }
}
