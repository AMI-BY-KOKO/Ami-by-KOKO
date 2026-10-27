"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import AuthBackButton from "@/components/ui/AuthBackButton";
import Wordmark from "@/components/ui/Wordmark";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export default function SignupPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"parent" | "school_admin">("parent");
  const [schoolName, setSchoolName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });

    if (signUpError) {
      setError(`${signUpError.message} (status: ${signUpError.status})`);
      setLoading(false);
      return;
    }

    // Trigger handle_new_user() creates the profile row automatically.
    // Save phone number if provided
    if (data.user && phone.trim()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("profiles")
        .update({ phone_number: phone.trim() })
        .eq("id", data.user.id);
    }

    // For school admins, also create the school and link it.
    if (data.user && role === "school_admin" && schoolName.trim()) {
      // Create the school record
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: school, error: schoolErr } = await (supabase as any)
        .from("schools")
        .insert({ name: schoolName.trim(), subscription_active: false })
        .select("id")
        .single();

      if (!schoolErr && school) {
        // Link the profile to the school
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("profiles")
          .update({ school_id: school.id, role: "school_admin" })
          .eq("id", data.user.id);
      }
    }

    // If email confirmation is required, data.session will be null.
    if (!data.session) {
      setLoading(false);
      window.location.href = "/auth/confirm";
      return;
    }

    window.location.href = "/home";
  }

  const passwordsTyped = password.length > 0 && confirmPassword.length > 0;
  const passwordMatch = password === confirmPassword;

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-bg px-4 py-8 relative overflow-hidden" style={{
      backgroundImage: "linear-gradient(135deg, #FFFBEF 0%, #E6F0FF 100%)",
    }}>
      <div className="w-full max-w-md flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-sm ring-1 ring-border-warm p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          {/* Back button */}
          <div className="mb-6 sticky top-6">
            <AuthBackButton />
          </div>

          {/* Wordmark */}
          <div className="mb-2">
            <Wordmark size="lg" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-bold text-navy text-center font-display mb-1">
            Create Your Account
          </h1>
          <p className="text-sm text-navy-muted text-center mb-6">
            Join Àmì by Kòkò's learning world!
          </p>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            {/* Full name */}
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-navy">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-12 rounded-[14px] border border-border-warm bg-white px-4 text-navy placeholder-navy-muted focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green"
                placeholder="Enter your full name"
              />
            </div>

            {/* Role selector — pill segmented */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-navy">
                I am signing up as
              </label>
              <div className="flex gap-3">
                {([
                  { value: "parent", label: "Parent" },
                  { value: "school_admin", label: "School" },
                ] as const).map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setRole(opt.value)}
                    className={`flex-1 h-11 rounded-full font-semibold text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      role === opt.value
                        ? "bg-green-filled text-white focus:ring-green-filled"
                        : "bg-white border border-border-warm text-navy hover:border-primary-green focus:ring-primary-green"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* School name — only for school_admin */}
            {role === "school_admin" && (
              <div>
                <label htmlFor="schoolName" className="mb-2 block text-sm font-semibold text-navy">
                  School Name
                </label>
                <input id="schoolName" type="text" required
                  value={schoolName} onChange={e => setSchoolName(e.target.value)}
                  className="w-full h-12 rounded-[14px] border border-border-warm bg-white px-4 text-navy placeholder-navy-muted focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green"
                  placeholder="e.g. Sunshine Academy"/>
              </div>
            )}

            {/* Phone number — only for parent */}
            {role === "parent" && (
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-navy">
                  WhatsApp Number <span className="text-navy-muted font-normal">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 rounded-[14px] border border-border-warm bg-white px-4 text-navy placeholder-navy-muted focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green"
                  placeholder="+234 801 234 5678"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-navy">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-[14px] border border-border-warm bg-white px-4 text-navy placeholder-navy-muted focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-navy">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-[14px] border border-border-warm bg-white px-4 pr-12 text-navy placeholder-navy-muted focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-muted hover:text-navy transition focus:outline-none focus:ring-2 focus:ring-primary-green rounded-md p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-navy">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full h-12 rounded-[14px] border bg-white px-4 pr-12 text-navy placeholder-navy-muted focus:outline-none focus:ring-2 focus:ring-primary-green ${
                    passwordsTyped
                      ? passwordMatch
                        ? "border-green-filled"
                        : "border-coral"
                      : "border-border-warm"
                  }`}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-muted hover:text-navy transition focus:outline-none focus:ring-2 focus:ring-primary-green rounded-md p-1"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {passwordsTyped && (
                <p className={`mt-1 text-xs font-medium ${passwordMatch ? "text-green-filled" : "text-coral"}`}>
                  {passwordMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {error && (
              <p role="alert" className="text-sm text-coral">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading || (passwordsTyped && !passwordMatch)}
              className="w-full h-12 rounded-full bg-accent-yellow hover:bg-[#F5B800] text-navy font-bold transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow active:scale-95 mt-2"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-warm"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-sm text-navy-muted">or</span>
            </div>
          </div>

          {/* Google button */}
          <GoogleSignInButton />

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-navy-muted">
            Already have an account?{" "}
            <a href="/auth/login" className="font-bold text-green-filled hover:text-green-hover transition">
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
