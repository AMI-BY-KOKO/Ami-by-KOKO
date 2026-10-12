'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function GamesPage() {
  const games = [
    {
      id: 'letter-hunt',
      title: "Kòkò's Letter Hunt",
      thumbnail: '/games/letter-hunt.png',
      available: true,
    },
    {
      id: 'word-adventure',
      title: "Kòkò's Word Adventure",
      thumbnail: '/games/word-adventure.png',
      available: true,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cream-bg px-4 pb-24">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-2">🎮 Games</h1>
          <p className="text-lg text-navy-body">Learn through play with Kòkò!</p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group relative overflow-hidden rounded-3xl shadow-md ring-1 ring-[#EFE8D8] hover:shadow-lg transition-all active:scale-95"
            >
              {/* Thumbnail Image */}
              <Image
                src={game.thumbnail}
                alt={game.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />

              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Game Title */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {game.title}
                </h2>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 shadow-xl ring-4 ring-white/50">
                  <Play size={48} className="text-primary-green fill-primary-green" />
                </div>
              </div>

              {/* Aspect ratio container */}
              <div className="aspect-video" />
            </Link>
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
            className="inline-flex items-center gap-2 text-primary-green hover:text-green-700 font-bold transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
