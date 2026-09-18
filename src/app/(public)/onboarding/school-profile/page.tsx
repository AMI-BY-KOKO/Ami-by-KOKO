'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SchoolProfileOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [schoolName, setSchoolName] = useState('');
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

      // Update profile with full name
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .update({
          full_name: fullName.trim(),
        })
        .eq('id', user.id);

      if (profileError) {
        setError('Failed to update your profile. Please try again.');
        setLoading(false);
        return;
      }

      // Create school
      const { data: schoolData, error: schoolError } = await (supabase as any)
        .from('schools')
        .insert({
          name: schoolName.trim(),
          subscription_active: false,
        })
        .select('id')
        .single();

      if (schoolError || !schoolData) {
        setError('Failed to create school. Please try again.');
        setLoading(false);
        return;
      }

      // Link school to admin profile
      const { error: linkError } = await (supabase as any)
        .from('profiles')
        .update({
          school_id: schoolData.id,
        })
        .eq('id', user.id);

      if (linkError) {
        setError('Failed to link school. Please try again.');
        setLoading(false);
        return;
      }

      // Success — redirect to school dashboard
      router.push('/dashboard/school');
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
          <h1 className="text-3xl font-bold text-green-600 mb-2">🏫 School Setup</h1>
          <p className="text-stone-600">
            Tell us about your school so we can get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* School Name */}
          <div>
            <label htmlFor="schoolName" className="mb-2 block text-sm font-semibold text-stone-700">
              School Name <span className="text-red-600">*</span>
            </label>
            <input
              id="schoolName"
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
              placeholder="e.g., Lagos Primary School"
            />
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-stone-700">
              Your Full Name <span className="text-red-600">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
              placeholder="e.g., Tunde Okafor"
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
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
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
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
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
            className="mt-4 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          >
            {loading ? 'Setting up your school…' : 'Get Started'}
          </button>

          <p className="text-center text-xs text-stone-500">
            Your information is safe and secure. See our{' '}
            <a href="/privacy" className="text-green-600 hover:underline font-medium">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </main>
  );
}
