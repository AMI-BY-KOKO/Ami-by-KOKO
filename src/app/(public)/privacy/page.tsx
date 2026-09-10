"use client";

/**
 * Privacy Policy page
 * Required for Google Play Store and Apple App Store submission
 * Covers COPPA and NDPR compliance for children's education app
 */

import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-bg to-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors focus-ring px-3 py-2 rounded-full"
            aria-label="Back to home"
          >
            ← Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦜</span>
            <span className="font-black text-amber-900 hidden sm:inline">Àmì by Kòkò</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-8 md:p-12 ring-1 ring-amber-100"
        >
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-amber-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-stone-600 mb-8">
            Last updated: September 2026
          </p>

          {/* Content */}
          <div className="prose prose-sm md:prose-base max-w-none text-stone-700 space-y-6">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                1. Introduction
              </h2>
              <p>
                Àmì by Kòkò ('we', 'our', 'the app') is operated by Akinwoleola Clinton,
                Lagos State, Nigeria. This Privacy Policy explains how we collect,
                use and protect information when you use amibykoko.app.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                2. Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Account information:</strong> email address and full name
                  (parents/school admins only)
                </li>
                <li>
                  <strong>Child profiles:</strong> name, age, class level (no email collected
                  from children)
                </li>
                <li>
                  <strong>Usage data:</strong> which letters, numbers and activities are completed
                </li>
                <li>
                  <strong>Progress data:</strong> mastery levels, streaks, certificates earned
                </li>
                <li>
                  <strong>Device information:</strong> browser type, operating system (for
                  technical support)
                </li>
                <li>
                  <strong>Payment information:</strong> handled entirely by Paystack — we never
                  store card details
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To create and manage your account</li>
                <li>To track your child's learning progress</li>
                <li>To send account-related emails (password reset, subscription confirmation)</li>
                <li>To improve the app based on usage patterns</li>
                <li>We do NOT sell your data to third parties</li>
                <li>We do NOT use your data for advertising</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                4. Children's Privacy (COPPA / NDPR Compliance)
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Children under 13 do not create accounts directly</li>
                <li>Child profiles are created by parents or school administrators</li>
                <li>
                  We collect minimal data about children — name, age, class and learning progress
                  only
                </li>
                <li>No email address is collected from children</li>
                <li>No location data is collected from children</li>
                <li>No advertising is shown to children</li>
                <li>Parents may request deletion of their child's data at any time</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                5. Data Storage and Security
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>All data is stored securely using Supabase (EU-West-2, London)</li>
                <li>Passwords are encrypted and never stored in plain text</li>
                <li>Student PINs are stored for classroom login purposes only</li>
                <li>We use HTTPS encryption for all data transmission</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                6. Third-Party Services
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Supabase:</strong>{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    database and authentication
                  </a>
                </li>
                <li>
                  <strong>Paystack:</strong>{" "}
                  <a
                    href="https://paystack.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    payment processing
                  </a>
                </li>
                <li>
                  <strong>Vercel:</strong>{" "}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    app hosting
                  </a>
                </li>
                <li>
                  <strong>Resend:</strong>{" "}
                  <a
                    href="https://resend.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    email delivery
                  </a>
                </li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                7. Your Rights (NDPR)
              </h2>
              <p>
                Under the Nigeria Data Protection Regulation (NDPR) you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-4">
                <strong>Contact:</strong> akinwoleolaclinton@gmail.com
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                8. Cookies
              </h2>
              <p>
                We use essential cookies only — for keeping you logged in. We do not use
                advertising or tracking cookies.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                9. Changes to This Policy
              </h2>
              <p>
                We will notify users of significant changes via email. Continued use of the app
                after changes means you accept the updated policy.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                10. Contact Us
              </h2>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Akinwoleola Clinton</strong>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:akinwoleolaclinton@gmail.com"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    akinwoleolaclinton@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Website:</strong> amibykoko.app
                </p>
                <p>
                  <strong>Location:</strong> Lagos State, Nigeria
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-4 justify-center text-sm"
        >
          <Link
            href="/terms"
            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-full transition-colors focus-ring"
          >
            📄 Terms of Service
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 font-bold rounded-full transition-colors focus-ring"
          >
            🏠 Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-amber-100 bg-amber-50 py-8">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-sm text-stone-600">
          <p className="mb-3">
            © 2026 Àmì by Kòkò. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://amibykoko.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 underline"
            >
              amibykoko.app
            </a>
            <span className="text-stone-400">•</span>
            <Link href="/privacy" className="text-amber-600 hover:text-amber-700 underline">
              Privacy Policy
            </Link>
            <span className="text-stone-400">•</span>
            <Link href="/terms" className="text-amber-600 hover:text-amber-700 underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
