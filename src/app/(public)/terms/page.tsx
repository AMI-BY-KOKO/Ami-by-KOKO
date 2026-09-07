"use client";

/**
 * Terms of Service page
 * Required for Google Play Store and Apple App Store submission
 * Covers service availability, payments, user responsibilities, and legal terms
 */

import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-stone-600 mb-8">
            Last updated: September 2026
          </p>

          {/* Content */}
          <div className="prose prose-sm md:prose-base max-w-none text-stone-700 space-y-6">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using Àmì by Kòkò at amibykoko.app you agree to these Terms of
                Service. If you do not agree, please do not use the app. These terms apply to
                parents, school administrators and all users.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                2. About the Service
              </h2>
              <p>
                Àmì by Kòkò is an early learning platform for African children aged 0–8. It
                provides phonics, numeracy and world knowledge content in English, with Yorùbá
                and French in development.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                3. Eligibility
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>You must be at least 18 years old to create an account</li>
                <li>Children use the app under the supervision of a parent or school</li>
                <li>School administrators must be authorised by their institution</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                4. Free and Paid Plans
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Free tier:</strong> Letters A–F, Numbers 1–3, Body Parts, 3 story
                  shards
                </li>
                <li>
                  <strong>Explorer plan:</strong> full A–Z, numbers 1–10, all categories —
                  ₦1,500/month
                </li>
                <li>
                  <strong>Family plan:</strong> up to 4 children — ₦2,500/month
                </li>
                <li>
                  <strong>School plans:</strong> annual contracts starting at ₦250,000/year
                </li>
                <li>Prices are subject to change with 30 days notice to existing subscribers</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                5. Payments and Refunds
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>All payments are processed by Paystack</li>
                <li>Subscriptions auto-renew unless cancelled before renewal date</li>
                <li>Refunds: contact us within 7 days of payment if unsatisfied</li>
                <li>School plan payments are non-refundable after onboarding begins</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                6. User Responsibilities
              </h2>
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Share your account credentials with unauthorised users</li>
                <li>Attempt to reverse-engineer or copy the app</li>
                <li>Use the app for any commercial purpose without written permission</li>
                <li>Upload harmful, offensive or inappropriate content</li>
                <li>Attempt to circumvent payment gating</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                7. School Administrator Responsibilities
              </h2>
              <p>School admins agree to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Only register pupils enrolled at their institution</li>
                <li>Keep student PINs confidential</li>
                <li>Not share school codes publicly</li>
                <li>Obtain appropriate parental consent before registering children</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                8. Intellectual Property
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  All content including characters (Àmì, Kòkò), songs, illustrations and
                  curriculum content are owned by Àmì by Kòkò / Akinwoleola Clinton
                </li>
                <li>You may not reproduce, distribute or sell any content from the app</li>
                <li>
                  The Jolly Phonics sound sequence is used under educational fair use
                </li>
              </ul>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                9. Availability
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>We aim for 99% uptime but cannot guarantee uninterrupted service</li>
                <li>We may update or modify features at any time</li>
                <li>We will give reasonable notice before removing major features</li>
              </ul>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                10. Limitation of Liability
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>The app is provided 'as is' without warranties</li>
                <li>We are not liable for learning outcomes</li>
                <li>Our total liability shall not exceed the amount paid in the last 3 months</li>
              </ul>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                11. Termination
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>We may suspend accounts that violate these terms</li>
                <li>You may delete your account at any time via Settings</li>
                <li>On termination, your data will be deleted within 30 days</li>
              </ul>
            </div>

            {/* Section 12 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                12. Governing Law
              </h2>
              <p>
                These terms are governed by the laws of the Federal Republic of Nigeria. Any
                disputes shall be resolved in Oyo State courts.
              </p>
            </div>

            {/* Section 13 */}
            <div>
              <h2 className="text-2xl font-bold text-amber-700 mb-3">
                13. Contact
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
                  <strong>Location:</strong> Ibadan, Oyo State, Nigeria
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
            href="/privacy"
            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-full transition-colors focus-ring"
          >
            📄 Privacy Policy
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
