"use client";

import { motion } from "framer-motion";
import { StoryAudioPlayer } from "./StoryAudioPlayer";
import type { StoryPage as StoryPageType } from "@/types/stories";

interface StoryPageProps {
  page: StoryPageType;
  totalPages: number;
}

/**
 * Displays a single story page with text, image, and professional voice-actor audio
 * Removed all Text-to-Speech in favor of recorded audio files
 */
export function StoryPage({ page, totalPages }: StoryPageProps) {
  const isLastPage = page.pageNumber === totalPages;

  // Determine visual styling based on page type
  const getPageTypeStyles = () => {
    switch (page.type) {
      case "ending":
        return "from-rose-50 to-orange-50 ring-rose-100";
      case "celebration":
        return "from-amber-50 to-yellow-50 ring-amber-100";
      case "milestone":
        return "from-green-50 to-emerald-50 ring-green-100";
      case "fact":
        return "from-blue-50 to-cyan-50 ring-blue-100";
      case "quiz":
      case "game":
        return "from-purple-50 to-pink-50 ring-purple-100";
      case "challenge":
        return "from-orange-50 to-red-50 ring-orange-100";
      default:
        return "from-stone-50 to-amber-50 ring-amber-100";
    }
  };

  return (
    <motion.div
      key={page.pageNumber}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      {/* Main content card */}
      <div
        className={`bg-gradient-to-br ${getPageTypeStyles()} rounded-3xl p-6 sm:p-8 ring-1 shadow-md w-full`}
      >
        {/* Page image */}
        {page.imageUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden bg-stone-200 aspect-video flex items-center justify-center">
            <img
              src={page.imageUrl}
              alt={`Page ${page.pageNumber}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, show placeholder emoji
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Page type indicator (subtle) */}
        {page.type && page.type !== "narrative" && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              {page.type === "fact" && "✨ Did You Know"}
              {page.type === "quiz" && "❓ Quiz"}
              {page.type === "game" && "🎮 Game"}
              {page.type === "challenge" && "⭐ Challenge"}
              {page.type === "activity" && "✏️ Activity"}
              {page.type === "learning" && "💡 Learning"}
              {page.type === "reflection" && "🤔 Reflection"}
              {page.type === "milestone" && "🎯 Milestone"}
              {page.type === "character" && "👤 Meet"}
              {page.type === "symbol" && "🏳️ Symbol"}
              {page.type === "inspiration" && "✨ Inspiration"}
              {page.type === "celebration" && "🎉 Celebration"}
              {page.type === "ending" && "🎊 Story Complete"}
            </span>
          </div>
        )}

        {/* Story text */}
        <div className="mb-6">
          <p className="text-stone-800 leading-relaxed whitespace-pre-line text-base sm:text-lg font-medium">
            {page.text}
          </p>
        </div>

        {/* Professional voice-actor audio player */}
        <StoryAudioPlayer
          audioUrl={page.audioUrl}
          pageNumber={page.pageNumber}
          isCurrentPage={true}
        />
      </div>

      {/* Last page hint */}
      {isLastPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center"
        >
          <p className="text-stone-500 text-sm">
            You've reached the end of the story! 🎉
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
