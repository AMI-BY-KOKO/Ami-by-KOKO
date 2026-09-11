import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Àmì by Kòkò",
  description: "Simple, honest pricing for Àmì by Kòkò. Free tier includes English phonics A–F. Paid plans unlock full alphabet and African languages.",
  openGraph: {
    title: "Pricing — Àmì by Kòkò",
    description: "Start free, upgrade when your child is hooked.",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#FFFBF0" }}>
      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <span className="text-2xl">🦜</span>
            <span className="font-extrabold text-amber-900 text-base sm:text-lg">Àmì by Kòkò</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/signup" className="text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl transition shadow-md shadow-amber-200">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-[1.1] mb-4">
            Simple, honest <span className="text-amber-500">pricing</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto">
            Start free. Upgrade when your child is hooked. No hidden fees.
          </p>
        </div>
      </section>

      {/* ── Plan comparison ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {/* Free */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-stone-100 flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Free Forever</p>
              <p className="text-4xl font-extrabold text-stone-900">₦0</p>
              <p className="text-stone-500 text-sm mt-2">No credit card needed</p>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-700 mb-4">What's included:</p>
              <ul className="space-y-3">
                {["Letters A–F", "Numbers 1–3", "Body Parts category", "3 story shards (Story Mode intro)", "3 DJ pads (DJ Booth intro)", "Unlimited practice"].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-stone-600">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-stone-100 space-y-2">
                {["Letters G–Z", "Numbers 4–10", "All 5 categories", "Full story", "All 8 DJ pads", "African languages"].map(f => (
                  <p key={f} className="flex items-start gap-2 text-sm text-stone-400">
                    <span className="font-bold">🔒</span> {f}
                  </p>
                ))}
              </div>
            </div>

            <Link href="/auth/signup" className="w-full text-center bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3 rounded-2xl transition text-sm">
              Start free →
            </Link>
          </div>

          {/* Explorer — Most Popular */}
          <div className="bg-amber-500 rounded-3xl p-8 shadow-xl shadow-amber-200 flex flex-col gap-6 relative overflow-hidden ring-2 ring-amber-400">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
              MOST POPULAR
            </div>

            <div>
              <p className="text-xs font-bold text-amber-100 uppercase tracking-wide mb-2">Explorer Plan</p>
              <p className="text-4xl font-extrabold text-white">₦1,500<span className="text-lg font-normal">/month</span></p>
              <p className="text-amber-100 text-sm mt-2">or <span className="font-bold">₦15,000/year</span> (save 2 months)</p>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white mb-4">Everything in Free, plus:</p>
              <ul className="space-y-3">
                {["Full A–Z letters", "Numbers 1–10", "All 5 learning categories", "Complete Story Mode (10 shards)", "All 8 DJ pads", "1 child profile", "Yorùbá language (coming soon)"].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white">
                    <span className="font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/auth/signup" className="w-full text-center bg-white text-amber-600 font-extrabold py-3 rounded-2xl transition hover:bg-amber-50 text-sm">
              Start free, then upgrade →
            </Link>

            <p className="text-xs text-amber-50 text-center">
              Most families choose this plan ★
            </p>
          </div>

          {/* Family */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-stone-100 flex flex-col gap-6">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Family Plan</p>
              <p className="text-4xl font-extrabold text-stone-900">₦2,500<span className="text-lg font-normal">/month</span></p>
              <p className="text-stone-500 text-sm mt-2">or <span className="font-bold">₦25,000/year</span> (save 2 months)</p>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-700 mb-4">Everything in Explorer, plus:</p>
              <ul className="space-y-3">
                {["Up to 4 child profiles", "Family progress dashboard", "Track multiple children in one account", "Igbo (coming soon)", "Hausa (coming soon)"].map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-stone-600">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/auth/signup" className="w-full text-center bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3 rounded-2xl transition text-sm">
              Start free, then upgrade →
            </Link>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mb-16 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-stone-200">
                <th className="text-left py-3 px-4 font-bold text-stone-700 bg-stone-50">Feature</th>
                <th className="text-center py-3 px-4 font-bold text-stone-700 bg-stone-50">Free</th>
                <th className="text-center py-3 px-4 font-bold text-amber-700 bg-amber-50">Explorer</th>
                <th className="text-center py-3 px-4 font-bold text-stone-700 bg-stone-50">Family</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Letters A–F", free: "✓", explorer: "✓", family: "✓" },
                { feature: "Letters G–Z", free: "—", explorer: "✓", family: "✓" },
                { feature: "Numbers 1–3", free: "✓", explorer: "✓", family: "✓" },
                { feature: "Numbers 4–10", free: "—", explorer: "✓", family: "✓" },
                { feature: "Story Mode (intro)", free: "3 shards", explorer: "Full (10)", family: "Full (10)" },
                { feature: "DJ Booth pads", free: "3", explorer: "8", family: "8" },
                { feature: "Child profiles", free: "1", explorer: "1", family: "Up to 4" },
                { feature: "Progress dashboard", free: "Yes", explorer: "Yes", family: "Family-wide" },
                { feature: "Yorùbá (soon)", free: "—", explorer: "✓", family: "✓" },
                { feature: "Igbo (soon)", free: "—", explorer: "—", family: "✓" },
                { feature: "Hausa (soon)", free: "—", explorer: "—", family: "✓" },
              ].map(row => (
                <tr key={row.feature} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="py-3 px-4 font-medium text-stone-700">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-stone-600">{row.free}</td>
                  <td className="py-3 px-4 text-center text-amber-700 font-semibold">{row.explorer}</td>
                  <td className="py-3 px-4 text-center text-stone-600">{row.family}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* School Pricing */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-8 sm:p-10 overflow-hidden">
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div className="flex-1">
                <p className="text-green-300 text-xs font-bold uppercase tracking-wide mb-2">School Plans</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">For nurseries & primary schools</h3>
                <div className="space-y-3 text-sm text-green-100 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-lg">🌱</span>
                    <div>
                      <p className="font-bold">Starter — ₦150,000/year</p>
                      <p className="text-green-200">Up to 50 pupils, 1 admin account</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-lg">📈</span>
                    <div>
                      <p className="font-bold">Growth — ₦250,000/year</p>
                      <p className="text-green-200">Up to 150 pupils, 3 admin accounts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-lg">🏫</span>
                    <div>
                      <p className="font-bold">Academy — ₦400,000/year</p>
                      <p className="text-green-200">Unlimited pupils, unlimited admins</p>
                    </div>
                  </div>
                </div>
              </div>
              <a href="mailto:schools@amibykoko.com" className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg whitespace-nowrap">
                Contact us →
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-green-700">
              <p className="text-green-100 text-sm leading-relaxed">
                <strong>School plans include:</strong> Pupil management dashboard • Class-level progress reports • Teacher accounts • CSV exports • Custom school branding on login screen • Priority support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-y border-stone-200">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 text-center mb-12">
          Frequently asked questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "Can I try paid features for free?",
              a: "Yes. The free tier is fully functional — you can try everything before paying. Paid plans unlock more content, not core functionality.",
            },
            {
              q: "Do I get billed immediately?",
              a: "No. You sign up free, create your child's profile, and only pay when you choose to unlock a paid plan. We'll never charge without confirmation.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel your subscription anytime from your account settings. No penalties, no locked-in contracts.",
            },
            {
              q: "What if I buy the yearly plan?",
              a: "You save 2 months of fees. For Explorer: ₦15,000/year instead of ₦18,000. For Family: ₦25,000/year instead of ₦30,000.",
            },
            {
              q: "Will African languages cost extra?",
              a: "No. Yorùbá, Igbo, and Hausa are unlocked with your paid plan — not separate subscriptions.",
            },
            {
              q: "Can schools get a discount?",
              a: "Yes. School plans are significantly cheaper per child than individual Family plans. Email schools@amibykoko.com for a custom quote.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h3 className="font-bold text-stone-900 mb-2">{item.q}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4">
            Ready to start?
          </h2>
          <p className="text-stone-600 text-lg mb-8">
            English phonics is completely free. Start learning today.
          </p>
          <Link href="/auth/signup" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-lg px-12 py-4 rounded-2xl transition shadow-xl shadow-amber-200 active:scale-95">
            Create Free Account 🎉
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-stone-900 text-stone-400 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <span className="text-xl">🦜</span>
              <span className="font-extrabold text-white">Àmì by Kòkò</span>
            </Link>
            <p className="text-sm text-center text-stone-500">
              Made with ❤️ for African children everywhere.
            </p>
            <div className="flex gap-5 sm:gap-6 text-sm">
              <Link href="/about" className="hover:text-white transition">About</Link>
              <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
              <a href="mailto:hello@amibykoko.com" className="hover:text-white transition">Contact</a>
            </div>
          </div>

          <div className="border-t border-stone-700 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-stone-500">
            <Link href="/" className="hover:text-white transition">amibykoko.app</Link>
            <span className="hidden sm:block">•</span>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <span className="hidden sm:block">•</span>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
