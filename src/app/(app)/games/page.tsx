'use client';

import Link from 'next/link';

export default function GamesPage() {
  const games = [
    {
      id: 'letter-hunt',
      title: 'Kòkò\'s Letter Hunt',
      emoji: '⭐',
      description: '5 progressive levels to master letters through fun challenges',
      available: true,
      levels: ['Letter Hunt', 'Sound Safari', 'Picture Hunt', 'Sound Match', 'Super Challenge'],
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cream-bg px-4 pb-24">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="text-8xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold text-amber-600 mb-2">Games</h1>
          <p className="text-xl text-stone-600">Learn through play with Kòkò!</p>
        </div>

        {/* Games Grid */}
        <div className="space-y-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-stone-100 hover:ring-amber-200 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{game.emoji}</span>
                    <h2 className="text-2xl font-bold text-stone-800">{game.title}</h2>
                  </div>
                  <p className="text-stone-600 mb-3">{game.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {game.levels.map((level) => (
                      <span
                        key={level}
                        className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                {game.available && (
                  <Link
                    href={`/games/${game.id}`}
                    className="ml-4 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-2xl transition shadow-md whitespace-nowrap"
                  >
                    Play →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Teaser */}
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border-2 border-dashed border-amber-200 text-center">
          <p className="text-stone-700 font-semibold mb-2">More games coming soon! 🚀</p>
          <p className="text-sm text-stone-500">
            Kòkò is working on more exciting adventures to make learning even more fun.
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-bold transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
