import { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

export const metadata: Metadata = {
  title: "About Àmì by Kòkò — Phonics for African Children",
  description: "Learn about Àmì by Kòkò, a multilingual phonics and early learning app built for African children aged 0–8 with culturally relevant content and real African voices.",
  openGraph: {
    title: "About Àmì by Kòkò",
    description: "Phonics and early learning for African children, in English and African languages.",
    type: "website",
  },
};

export default function AboutPage() {
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
            About <span className="text-amber-500">Àmì by Kòkò</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto">
            Early literacy should celebrate who children are — not erase it. That's why we built Àmì.
          </p>
        </div>
      </section>

      {/* ── What is Àmì ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-y border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-5">
              What is Àmì by Kòkò?
            </h2>
            <p className="text-stone-600 mb-4 leading-relaxed">
              Àmì by Kòkò is a multilingual phonics and early learning app for African children aged 0–8. We combine playful, interactive lessons with authentic African content — real child voices, mother-tongue word associations, and storylines that feel familiar to children across the continent.
            </p>
            <p className="text-stone-600 leading-relaxed">
              English phonics a to f is free forever. Paid plans unlock African languages like Yorùbá, with Igbo and Hausa coming soon. Every feature is designed for low-bandwidth devices and hands-on engagement — no passive watching, all active play.
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl p-8 sm:p-12 flex items-center justify-center min-h-64">
            <div className="text-center">
              <p className="text-6xl sm:text-7xl mb-4">🧒🏾 🦜</p>
              <p className="text-stone-700 font-semibold">Àmì and Kòkò</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Characters ──────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 text-center mb-12">
          Meet the characters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Àmì */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-stone-100">
            <div className="text-6xl mb-4">👧🏾</div>
            <h3 className="text-2xl font-extrabold text-stone-900 mb-3">Àmì</h3>
            <p className="text-stone-600 leading-relaxed">
              A curious, adventurous 6-year-old Nigerian girl. Àmì is kind, encouraging, and never condescending. She speaks directly to children, celebrates their wins, and guides them through learning with warmth. The app's name comes from the Yoruba word meaning "sign" or "symbol" — she's the symbol of possibility.
            </p>
          </div>

          {/* Kòkò */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-stone-100">
            <div className="text-6xl mb-4">🦜</div>
            <h3 className="text-2xl font-extrabold text-stone-900 mb-3">Kòkò</h3>
            <p className="text-stone-600 leading-relaxed">
              A vibrant African parrot with a big personality. In Story Mode, Kòkò has lost his voice — and children learn the alphabet by helping him find it. Every sound, every letter, every activity restores his voice piece by piece. Kòkò is the audio avatar; every phoneme comes from a real child voice through Kòkò's speech.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 border-y border-stone-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 text-center mb-12">
            Our mission & vision
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200">
              <h3 className="text-xl font-extrabold text-amber-900 mb-3">🎯 Mission</h3>
              <p className="text-stone-700 leading-relaxed">
                Make early literacy accessible, joyful, and culturally relevant for every African child — regardless of income, device, or first language.
              </p>
            </div>

            <div className="bg-green-50 rounded-3xl p-8 border border-green-200">
              <h3 className="text-xl font-extrabold text-green-900 mb-3">🌍 Vision</h3>
              <p className="text-stone-700 leading-relaxed">
                A future where African children learn to read through their own languages, in their own voices, and see themselves in every story.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-3xl p-8 sm:p-10 border border-stone-200">
            <h3 className="text-xl font-extrabold text-stone-900 mb-4">Why we built this</h3>
            <p className="text-stone-700 leading-relaxed mb-4">
              Global phonics apps treat African children as an afterthought — if they're included at all. Lessons feature Western names and contexts. Audio is synthetic or English-only. And cost? Often prohibitive for families in Nigeria, Ghana, Kenya, and beyond.
            </p>
            <p className="text-stone-700 leading-relaxed mb-4">
              We built Àmì to prove that early learning can be different. That children deserve apps built *for* them, not *at* them. That their languages, their foods, their stories matter from day one.
            </p>
            <p className="text-stone-700 leading-relaxed">
              Every feature — from the DJ Booth (mixing letter sounds into music) to Story Mode (Kòkò's voice journey) to the word builders (English *and* Yorùbá options) — comes from real feedback from parents, teachers, and children across the continent.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 text-center mb-12">
          Our values
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: "Cultural Pride", desc: "We celebrate African languages, names, food, and stories — not as side content, but as the center." },
            { title: "Child-led", desc: "Every design choice starts with what children actually enjoy — play, discovery, celebration." },
            { title: "Accessible", desc: "Free tier. Low-bandwidth design. Works on any phone. No paywalls between a child and learning." },
            { title: "Transparent", desc: "No ads. No data sell-off. No dark patterns. Parents know exactly what their children see." },
            { title: "Inclusive", desc: "For all children — regardless of ability, language, or context. Built with accessibility first." },
            { title: "Joyful", desc: "Learning should feel like play. If it's not fun, it won't stick. Simple as that." },
          ].map((v, i) => (
            <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h3 className="font-extrabold text-stone-900 mb-2">{v.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mb-4">
            Ready to join Àmì and Kòkò?
          </h2>
          <p className="text-stone-600 text-lg mb-8 leading-relaxed">
            English phonics is completely free. Start learning today — no credit card needed.
          </p>
          <Link href="/auth/signup" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-lg px-10 py-4 rounded-2xl transition shadow-xl shadow-amber-200 active:scale-95">
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
