/**
 * Supabase auth callback — handles:
 * 1. Email confirmation redirects
 * 2. OAuth redirects (Google, etc.)
 * Checks if parent_profiles exists; if not, redirects to onboarding.
 */
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed`);
    }

    if (!data.user) {
      return NextResponse.redirect(`${origin}/auth/login?error=no_user`);
    }

    // Check if user profile exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", data.user.id)
      .maybeSingle();

    // If no profile, redirect to role selection
    if (!profile) {
      return NextResponse.redirect(`${origin}/onboarding/role-selection`);
    }

    // Profile exists, check if they've completed role-specific onboarding
    // For now, redirect to intended destination (dashboard or home based on role)
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Something went wrong — redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed`);
}
