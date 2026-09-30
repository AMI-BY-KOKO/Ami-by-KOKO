"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getAllStories } from "@/lib/content/stories";
import type { Story } from "@/types/stories";

function StoryCard({ story }: { story: Story | Omit<Story, "pages"> }) {
  const isAvailable = story.status === "available";
  const pageCount = "pages" in story ? story.pages?.length ?? 0 : 0;

  return (
    <Link
      href={isAvailable ? `/stories/${story.slug}` : "#"}
      className={isAvailable ? "block" : "pointer-events-none"}
    >
      <motion.div
        whileHover={isAvailable ? { y: -4 } : {}}
        className={`relative overflow-hidden rounded-3xl shadow-md transition ${
          isAvailable
            ? "bg-white ring-1 ring-amber-100 cursor-pointer hover:shadow-lg hover:shadow-amber-100"
            : "bg-stone-50 opacity-75 ring-1 ring-stone-200"
        }`}
      >
        {/* Cover image or placeholder */}
        <div
          className={`w-full aspect-video bg-gradient-to-br ${
            isAvailable
              ? "from-amber-200 to-orange-200"
              : "from-stone-200 to-stone-300"
          } flex items-center justify-center relative overflow-hidden`}
        >
          {story.coverImageUrl ? (
            <img
              src={story.coverImageUrl}
              alt={`${story.title} — ${story.description}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image doesn't exist
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="text-6xl">{isAvailable ? "📖" : "🔒"}</div>
          )}

          {/* Status badge */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-stone-700 text-white px-4 py-2 rounded-full text-sm font-bold">
                Coming Soon
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-bold text-stone-800 text-lg leading-tight">
              {story.title}
            </h3>
            {isAvailable && (
              <span className="text-2xl flex-shrink-0">⭐</span>
            )}
          </div>

          <p className="text-stone-600 text-sm mb-4 line-clamp-2">
            {story.description}
          </p>

          {/* Meta info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-600 font-semibold">
                {story.category}
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-600">{story.ageRange}</span>
            </div>

            {isAvailable && pageCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>📄</span>
                <span>
                  {pageCount} page{pageCount !== 1 ? "s" : ""}
                </span>
                {story.estimatedMinutes && (
                  <>
                    <span>•</span>
                    <span>≈ {story.estimatedMinutes} min</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* CTA Button */}
          {isAvailable && (
            <button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold py-3 px-4 rounded-2xl transition shadow-md shadow-amber-200">
              Start Story
            </button>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export default function StoriesPage() {
  const allStories = getAllStories();

  return (
    <div className="flex flex-col items-center gap-8 pb-10 max-w-2xl mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center"
      >
        <div className="text-5xl mb-3">📚</div>
        <h1 className="font-extrabold text-stone-800 text-3xl mb-2">
          Stories
        </h1>
        <p className="text-stone-600 text-sm">
          Open a story. Read, listen, learn and imagine!
        </p>
      </motion.div>

      {/* Available Stories Section */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4 px-2">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wide">
            Available Stories
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-amber-300 to-transparent" />
        </div>

        <div className="grid grid-cols-1 gap-6 px-2">
          {allStories
            .filter((s) => s.status === "available")
            .map((story, idx) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <StoryCard story={story} />
              </motion.div>
            ))}
        </div>

        {allStories.filter((s) => s.status === "available").length === 0 && (
          <div className="text-center py-12 px-2">
            <div className="text-4xl mb-3">🌟</div>
            <p className="text-stone-600 font-semibold">No stories yet!</p>
            <p className="text-stone-500 text-sm">Check back soon.</p>
          </div>
        )}
      </div>

      {/* Coming Soon Stories Section */}
      {allStories.filter((s) => s.status === "coming-soon").length > 0 && (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-4 px-2">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wide">
              Coming Soon
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-stone-300 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-6 px-2">
            {allStories
              .filter((s) => s.status === "coming-soon")
              .map((story, idx) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <StoryCard story={story} />
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Fun fact or encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 text-center ring-1 ring-amber-100 mx-2"
      >
        <p className="text-stone-600 text-sm">
          <span className="font-bold text-amber-700">Did you know?</span>
          {" "}
          Stories help us learn about the world and about ourselves. Each story is a journey!
        </p>
      </motion.div>
    </div>
  );
}
