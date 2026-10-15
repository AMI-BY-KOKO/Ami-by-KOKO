"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Story } from "@/types/stories";

interface StoryCompletionProps {
  story: Story;
  onReadAgain?: () => void;
}

/**
 * Displays the completion state after finishing a story
 */
export function StoryCompletion({
  story,
  onReadAgain,
}: StoryCompletionProps) {
  return (
    <motion.div
      key="completion"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center gap-6"
    >
      {/* Celebration animation */}
      <motion.div
        animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 1.1, 1] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          times: [0, 0.3, 0.7, 1],
        }}
        className="text-7xl"
      >
        🎉
      </motion.div>

      {/* Title */}
      <div className="text-center">
        <h2 className="font-extrabold text-stone-800 text-3xl mb-2">
          Story Complete!
        </h2>
        <p className="text-stone-600 text-lg font-semibold">
          Amazing, Little Explorer!
        </p>
      </div>

      {/* Story summary */}
      <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 ring-1 ring-amber-100 text-center">
        <p className="text-sm text-stone-700 mb-1 font-semibold">
          You just read
        </p>
        <p className="text-lg font-bold text-amber-700">{story.title}</p>
        <p className="text-sm text-stone-600 mt-3">
          {story.pages.length} pages of learning and adventure!
        </p>
      </div>

      {/* Motivational message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6 ring-1 ring-green-100 text-center"
      >
        <p className="text-stone-700 text-sm leading-relaxed">
          <span className="font-bold text-green-700">You're amazing!</span>
          {" "}
          Stories help us learn about the world, about other people, and about ourselves.
          Keep exploring, keep learning, and keep dreaming big!
        </p>
      </motion.div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* Read Again */}
        {onReadAgain && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onReadAgain}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-2xl transition shadow-md shadow-amber-200 focus:outline-none focus-ring"
            style={{
              outline: "2px solid transparent",
              outlineOffset: "2px",
            }}
          >
            📖 Read Again
          </motion.button>
        )}

        {/* Back to Stories */}
        <Link
          href="/stories"
          className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-6 rounded-2xl transition text-center focus:outline-none focus-ring"
          style={{
            outline: "2px solid transparent",
            outlineOffset: "2px",
          }}
        >
          ← Back to Stories
        </Link>
      </div>

      {/* Encourage exploration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <p className="text-stone-500 text-sm">
          More stories coming soon! Check back soon. 🌟
        </p>
      </motion.div>
    </motion.div>
  );
}
