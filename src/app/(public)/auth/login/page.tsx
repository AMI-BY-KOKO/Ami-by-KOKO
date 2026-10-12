"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-bg px-4 py-8 relative overflow-hidden" style={{
      backgroundImage: "linear-gradient(135deg, #FFFBEF 0%, #E6F0FF 100%)",
    }}>
      <div className="w-full max-w-md flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-sm ring-1 ring-border-warm p-6 md:p-8">
          {/* Back button */}
          <div className="mb-6">
            <AuthBackButton />
          </div>

          {/* Wordmark */}
          <div className="mb-2">
            <Wordmark size="lg" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-bold text-navy text-center font-display mb-1">
            Welcome Back!
          </h1>
          <p className="text-sm text-navy-muted text-center mb-8">
            Sign in to continue the adventure.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-semibold text-navy">
                  Password
                </label>
                <a href="/auth/reset-password"
                  className="text-sm text-green-filled hover:text-green-hover font-semibold transition">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-[14px] border border-border-warm bg-white px-4 pr-12 text-navy placeholder-navy-muted focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green"
                  placeholder="Enter your password"
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

            {error && (
              <p role="alert" className="text-sm text-coral">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-accent-yellow hover:bg-[#F5B800] text-navy font-bold transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow active:scale-95 mt-2"
            >
              {loading ? "Signing in…" : "Log In"}
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
            New here?{" "}
            <a href="/auth/signup" className="font-bold text-green-filled hover:text-green-hover transition">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
