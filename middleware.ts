import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Middleware to guard protected routes.
 * 
 * For authenticated users accessing protected routes:
 * 1. Check if user has a role set in profiles table
 * 2. If no role, redirect to /auth/select-role (for OAuth users without role)
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

  // Skip if already going to onboarding or role selection
  if (pathname.startsWith('/onboarding') || pathname.startsWith('/auth/select-role')) {
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

    // Check if user has a profile with a role set
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    // No profile or no role — redirect to role selection
    if (!profile || !(profile as any)?.role) {
      return NextResponse.redirect(new URL('/auth/select-role', request.url));
    }

    // Profile with role exists — allow access
    return NextResponse.next();
  } catch (error) {
    console.error('[middleware] Error checking user profile:', error);
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
