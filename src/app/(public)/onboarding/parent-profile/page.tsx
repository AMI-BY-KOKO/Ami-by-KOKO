'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ParentProfileOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('You must be logged in to complete your profile');
        setLoading(false);
        return;
      }

      // Insert parent profile
      const { error: insertError } = await supabase
        .from('parent_profiles')
        .insert({
          user_id: user.id,
          full_name: fullName.trim(),
          phone_number: phoneNumber.trim() || null,
          country,
        } as any); // Type cast due to hand-authored database types

      if (insertError) {
        // Handle duplicate profile (race condition / double-submit)
        if (insertError.code === '23505') {
          router.push('/home');
          router.refresh();
          return;
        }
        setError('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Success — redirect to home/dashboard
      router.push('/home');
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
          <h1 className="text-3xl font-bold text-amber-500 mb-2">Complete Your Profile</h1>
          <p className="text-stone-600">
            Just a few details to get you started with Àmì by Kòkò
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-stone-700">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              placeholder="e.g., Ngozi Okonkwo"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="mb-2 block text-sm font-semibold text-stone-700">
              Phone Number <span className="text-stone-400">(optional)</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              placeholder="e.g., +234 701 234 5678"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="mb-2 block text-sm font-semibold text-stone-700">
              Country <span className="text-red-600">*</span>
            </label>
            <select
              id="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Kenya">Kenya</option>
              <option value="South Africa">South Africa</option>
              <option value="Uganda">Uganda</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-amber-500 py-4 text-lg font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {loading ? 'Setting up your profile…' : 'Get Started'}
          </button>

          <p className="text-center text-xs text-stone-500">
            Your information is safe and secure. See our{' '}
            <a href="/privacy" className="text-amber-600 hover:underline font-medium">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </main>
  );
}
