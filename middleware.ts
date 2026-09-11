import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Middleware to guard protected routes.
 * 
 * For authenticated users accessing protected routes:
 * 1. Check if user has completed parent_profiles (via OAuth/email signup)
 * 2. If incomplete, redirect to /onboarding/parent-profile
 * 3. Allow access otherwise
 * 
 * Protected route groups: /(app)/* and /super-admin/*
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of protected route prefixes
  const protectedPrefixes = ['/(app)/', '/super-admin/', '/dashboard', '/home'];
  const isProtectedRoute = protectedPrefixes.some(prefix =>
    pathname.includes(prefix) || pathname.startsWith(prefix.replace('/', ''))
  );

  // Skip middleware for public routes
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Skip if already going to onboarding
  if (pathname.startsWith('/onboarding')) {
    return NextResponse.next();
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // No user — redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Check if this is a student account (no parent profile check needed)
    const isStudentEmail = user.email?.endsWith('@amibykoko.app');
    if (isStudentEmail) {
      return NextResponse.next();
    }

    // For parent/admin accounts, check parent_profiles
    const { data: parentProfile } = await supabase
      .from('parent_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    // No parent profile — redirect to onboarding
    if (!parentProfile) {
      return NextResponse.redirect(new URL('/onboarding/parent-profile', request.url));
    }

    // Parent profile exists — allow access
    return NextResponse.next();
  } catch (error) {
    console.error('[middleware] Error checking parent profile:', error);
    // On error, allow the request to proceed (fail open)
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Protect app routes
    '/(app)/:path*',
    // Protect dashboard and home (in case they're not in (app))
    '/dashboard/:path*',
    '/home/:path*',
    // Protect super admin
    '/super-admin/:path*',
  ],
};
