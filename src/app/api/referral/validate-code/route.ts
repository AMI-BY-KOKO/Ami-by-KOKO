/**
 * POST /api/referral/validate-code
 * Validate a referral code before signup
 * Server-side validation to prevent tampering
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAndGetCodeDetails } from '@/lib/referral/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    // Validate code using server-side utility
    const result = await validateAndGetCodeDetails(code);

    if (!result.isValid) {
      return NextResponse.json(
        {
          isValid: false,
          reason: result.reason,
        },
        { status: 200 } // Return 200 even for invalid code (not a server error)
      );
    }

    return NextResponse.json({
      isValid: true,
      code: result.code,
      profileId: result.profileId,
      profileName: result.profileName,
    });
  } catch (error) {
    console.error('[validate-code] Error:', error);
    return NextResponse.json(
      { error: 'Failed to validate referral code' },
      { status: 500 }
    );
  }
}
