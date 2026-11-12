/**
 * POST /api/referral/attribute
 * Attribute a new signup to a referrer
 * Called after successful profile creation in signup flow
 * 
 * SECURITY:
 * - Requires authenticated user (from Supabase session)
 * - Only processes newly created profiles
 * - Server-side validation to prevent tampering
 * - Transaction atomic at database level
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  attributeReferral,
  checkExistingReferral,
} from '@/lib/referral/attribution';
import { validateAndGetCodeDetails } from '@/lib/referral/validation';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user (already must be logged in from signup)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { referralCode, referrerIp, userAgent } = body;

    if (!referralCode || typeof referralCode !== 'string') {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    // Step 1: Validate code exists and is active
    const codeValidation = await validateAndGetCodeDetails(referralCode);
    if (!codeValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: codeValidation.reason || 'Invalid referral code',
        },
        { status: 200 }
      );
    }

    // Step 2: Check if this profile already has a referral
    const existingReferral = await checkExistingReferral(user.id);
    if (existingReferral) {
      return NextResponse.json(
        {
          success: false,
          error: 'This profile already has a referral attribution',
        },
        { status: 200 }
      );
    }

    // Step 3: Prevent self-referral
    if (codeValidation.profileId === user.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot use your own referral code',
        },
        { status: 200 }
      );
    }

    // Step 4: Attribute referral (atomic operation)
    const attributionResult = await attributeReferral({
      referralCode,
      referredProfileId: user.id,
      referrerIp,
      referredIp: request.headers.get('x-forwarded-for') || undefined,
      userAgent: userAgent || request.headers.get('user-agent') || undefined,
    });

    if (!attributionResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: attributionResult.error || 'Failed to attribute referral',
          fraudScore: attributionResult.fraudScore || 0,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      referralEventId: attributionResult.referralEventId,
      fraudScore: attributionResult.fraudScore || 0,
    });
  } catch (error) {
    console.error('[attribute] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process referral attribution' },
      { status: 500 }
    );
  }
}
