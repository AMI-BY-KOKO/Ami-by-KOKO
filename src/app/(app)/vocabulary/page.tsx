/**
 * Vocabulary - Coming Soon Page
 *
 * Placeholder for vocabulary learning activities.
 * Will eventually feature word-building, definitions, and context usage.
 */

"use client";

import Link from "next/link";

export default function VocabularyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-bg via-amber-50 to-orange-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg text-center">
        {/* Icon */}
        <div className="text-8xl mb-6">📚</div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-stone-800 mb-3">
          Vocabulary Builder
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-stone-600 mb-2">
          Coming Soon! 🚀
        </p>

        {/* Description */}
        <p className="text-stone-500 mb-8 leading-relaxed">
          Kòkò is preparing exciting vocabulary activities to help you learn new words in context.
          Learn how to use words in real-life situations and build a stronger vocabulary together!
        </p>

        {/* Features Coming */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 text-left ring-1 ring-amber-100">
          <p className="text-sm font-bold text-amber-800 mb-4">What's Coming:</p>
          <ul className="space-y-2 text-sm text-stone-600">
            <li className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Learn words in context with Kòkò</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Practice pronunciation with audio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Use new words in sentences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Earn XP and badges as you learn</span>
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition"
        >
          ← Back to Home
        </Link>

        {/* Kòkò Encouragement */}
        <p className="text-sm text-stone-500 mt-8 italic">
          "Keep practicing other activities while we prepare this! 🦜"
        </p>
      </div>
    </div>
  );
}
