'use client';

import Link from 'next/link';

export default function GamesPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cream-bg px-4 pb-24">
      <div className="w-full max-w-md text-center">
        {/* Coming Soon Illustration */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold text-amber-600 mb-3">Games</h1>
          <p className="text-xl text-stone-600 font-semibold">Coming Soon!</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-stone-100 mb-6">
          <p className="text-stone-700 mb-4">
            Kòkò is preparing exciting games and activities to make learning even more fun!
          </p>
          <p className="text-sm text-stone-500">
            Check back soon for interactive games that will help you learn through play.
          </p>
        </div>

        {/* Call to Action */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-2xl transition shadow-md"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
