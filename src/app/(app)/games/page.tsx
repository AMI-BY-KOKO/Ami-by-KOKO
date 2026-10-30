'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';

export default function GamesPage() {
  const games = [
    {
      id: 'letter-hunt',
      title: "Kòkò's Letter Hunt",
      thumbnail: '/games/letter-hunt.webp',
      thumbnailFallback: '/games/letter-hunt.png',
      available: true,
      titleColor: 'text-sky-500',
      titleGradient: 'from-sky-400 to-sky-600',
    },
    {
      id: 'word-adventure',
      title: "Kòkò's Word Adventure",
      thumbnail: '/games/word-adventure.webp',
      thumbnailFallback: '/games/word-adventure.png',
      available: true,
      titleColor: 'text-purple-500',
      titleGradient: 'from-purple-400 to-purple-600',
    },
    {
      id: 'abc-coloring-book',
      title: "Kòkò's ABC Coloring Book",
      thumbnail: '/games/abc-coloring-book.webp',
      thumbnailFallback: '/games/abc-coloring-book.png',
      available: true,
      titleColor: 'text-yellow-500',
      titleGradient: 'from-yellow-400 to-orange-500',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-bg via-yellow-50 to-cream-bg px-4 pb-24">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-6">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🎮</span>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">Games</h1>
            <span className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎲</span>
          </div>
          <p className="text-lg md:text-xl text-navy-body font-semibold">Learn through play with Kòkò!</p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {games.map((game) => (
            <div key={game.id} className="flex flex-col">
              {/* Game Title - Above thumbnail */}
              <div className="mb-4">
                <h2 className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${game.titleGradient} bg-clip-text text-transparent drop-shadow-sm`}>
                  {game.title}
                </h2>
              </div>

              {/* Thumbnail with Play Button Overlay */}
              <Link
                href={`/games/${game.id}`}
                className="group relative overflow-hidden rounded-3xl shadow-lg ring-2 ring-[#EFE8D8] hover:shadow-2xl hover:ring-4 transition-all active:scale-95 flex-grow w-full aspect-video"
              >
                {/* Thumbnail Image with WebP support and fallback */}
                <picture className="absolute inset-0">
                  <source srcSet={game.thumbnail} type="image/webp" />
                  <img
                    src={game.thumbnailFallback}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </picture>

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play Button Overlay - appears on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 backdrop-blur-md rounded-full p-6 shadow-2xl ring-4 ring-white/70 animate-pulse">
                    <Play size={56} className="text-primary-green fill-primary-green" />
                  </div>
                </div>

                {/* Aspect ratio container */}
                {/* Handled by aspect-video on Link element */}
              </Link>
            </div>
          ))}
        </div>

        {/* Coming Soon Teaser */}
        <div className="mt-16 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 rounded-3xl p-8 border-2 border-dashed border-purple-200 text-center shadow-md">
          <p className="text-2xl font-black text-purple-700 mb-2">✨ More games coming soon! 🚀</p>
          <p className="text-base text-purple-600 font-semibold">
            Kòkò is cooking up more exciting adventures to make learning super fun!
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-lg font-bold text-primary-green hover:text-green-700 transition-all hover:scale-110 active:scale-95"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
