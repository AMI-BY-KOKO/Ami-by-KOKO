'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RoleSelectionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedRole, setSelectedRole] = useState<'parent' | 'school_admin' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRoleSelection() {
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('You must be logged in to continue');
        setLoading(false);
        return;
      }

      // Create or update profile with selected role
      const { error: upsertError } = await (supabase as any)
        .from('profiles')
        .upsert(
          {
            id: user.id,
            role: selectedRole,
            full_name: user.user_metadata?.full_name || '',
            created_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (upsertError) {
        setError('Failed to save your role. Please try again.');
        setLoading(false);
        return;
      }

      // Redirect to appropriate onboarding page based on role
      if (selectedRole === 'school_admin') {
        router.push('/onboarding/school-profile');
      } else {
        router.push('/onboarding/parent-profile');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cream-bg px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-amber-500 mb-2">Welcome to Àmì by Kòkò</h1>
          <p className="text-stone-600">
            Are you a parent or a school administrator?
          </p>
        </div>

        {/* Role selection cards */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Parent option */}
          <button
            onClick={() => setSelectedRole('parent')}
            className={`p-6 rounded-2xl border-2 transition text-left ${
              selectedRole === 'parent'
                ? 'border-amber-400 bg-amber-50'
                : 'border-stone-200 hover:border-amber-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">👩‍👧‍👦</span>
              <div className="flex-1">
                <p className="font-bold text-stone-800 mb-1">I'm a Parent</p>
                <p className="text-sm text-stone-600">
                  Monitor my child's learning progress and create profiles for multiple children
                </p>
              </div>
              {selectedRole === 'parent' && (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* School Admin option */}
          <button
            onClick={() => setSelectedRole('school_admin')}
            className={`p-6 rounded-2xl border-2 transition text-left ${
              selectedRole === 'school_admin'
                ? 'border-green-400 bg-green-50'
                : 'border-stone-200 hover:border-green-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">🏫</span>
              <div className="flex-1">
                <p className="font-bold text-stone-800 mb-1">I'm a School Administrator</p>
                <p className="text-sm text-stone-600">
                  Manage students, track class progress, and create assignments for your school
                </p>
              </div>
              {selectedRole === 'school_admin' && (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg p-3 mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleRoleSelection}
          disabled={loading || !selectedRole}
          className="w-full rounded-2xl bg-amber-500 py-4 text-lg font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          {loading ? 'Setting up your account…' : 'Continue'}
        </button>

        <p className="text-center text-xs text-stone-500 mt-4">
          Your information is safe and secure. See our{' '}
          <a href="/privacy" className="text-amber-600 hover:underline font-medium">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
