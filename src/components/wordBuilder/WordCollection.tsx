"use client";

/**
 * Word Collection Modal
 * Shows mastered words organized by category.
 * Features:
 * - Grid view with word cards
 * - Category filtering
 * - Progress indicators (stars collected on each word)
 * - Lightweight and responsive
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Word } from "@/lib/wordBuilder/types";

interface WordCollectionProps {
  isOpen: boolean;
  masteredWords: Word[];
  onClose: () => void;
}

/**
 * Group words by category and get unique categories
 */
function groupWordsByCategory(
  words: Word[]
): Record<string, Word[]> {
  const grouped: Record<string, Word[]> = {};

  words.forEach((word) => {
    const category = word.category || "Other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(word);
  });

  return grouped;
}

/**
 * Get emoji for each category
 */
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    animals: "🦁",
    nature: "🌿",
    food: "🍎",
    home: "🏠",
    verbs: "🏃",
    objects: "🎁",
    body: "👋",
    transport: "🚗",
    clothing: "👕",
    weather: "☁️",
    subjects: "📚",
    adjectives: "✨",
    adverbs: "🎯",
    prepositions: "🔗",
    pronouns: "👤",
    articles: "📄",
    Other: "⭐",
  };

  return emojiMap[category] || "⭐";
}

export default function WordCollection({
  isOpen,
  masteredWords,
  onClose,
}: WordCollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const grouped = groupWordsByCategory(masteredWords);
  const categories = Object.keys(grouped).sort();

  // If a category is selected, show only that category's words
  const displayedWords =
    selectedCategory && grouped[selectedCategory]
      ? grouped[selectedCategory]
      : masteredWords;

  const displayedCategory = selectedCategory || "All Words";
  const displayedCount = displayedWords.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 md:inset-20 bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden ring-2 ring-green-200"
          >
            {/* Header */}
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 md:px-8 py-5 md:py-6 flex items-center justify-between"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl md:text-5xl">📚</span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    My Words
                  </h2>
                  <p className="text-xs md:text-sm text-green-100">
                    {displayedCount} word{displayedCount !== 1 ? "s" : ""} mastered
                  </p>
                </div>
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-2xl md:text-3xl text-white hover:text-green-100 transition-colors focus-ring"
                aria-label="Close word collection"
              >
                ✕
              </motion.button>
            </motion.div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
              {/* Category sidebar */}
              <motion.div
                className="w-full md:w-32 bg-stone-50 border-b md:border-r md:border-b-0 border-stone-200 p-4 md:p-5 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                {/* All Words button */}
                <motion.button
                  onClick={() => setSelectedCategory(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 md:px-3 py-2 md:py-3 rounded-2xl font-bold text-sm md:text-xs whitespace-nowrap transition-all ${
                    selectedCategory === null
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-white text-stone-700 border-2 border-stone-300 hover:border-green-400"
                  }`}
                >
                  All ({masteredWords.length})
                </motion.button>

                {/* Category buttons */}
                {categories.map((category, idx) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                    className={`px-3 md:px-2 py-2 md:py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-white text-stone-700 border-2 border-stone-300 hover:border-green-400"
                    }`}
                    title={category}
                  >
                    <span className="mr-1">{getCategoryEmoji(category)}</span>
                    {category.substring(0, 8)}
                  </motion.button>
                ))}
              </motion.div>

              {/* Words grid */}
              <motion.div
                className="flex-1 p-6 md:p-8 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {displayedWords.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
                    layout
                  >
                    <AnimatePresence mode="popLayout">
                      {displayedWords.map((word, idx) => (
                        <motion.div
                          key={word.id}
                          layout
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="relative group"
                        >
                          {/* Word card */}
                          <motion.div
                            whileHover={{ y: -4 }}
                            className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow ring-2 ring-amber-100 hover:ring-amber-300 flex flex-col items-center justify-center cursor-pointer"
                          >
                            {/* Image/Emoji */}
                            {word.image && (
                              <motion.div
                                className="text-3xl md:text-4xl mb-2"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                              >
                                {word.image}
                              </motion.div>
                            )}

                            {/* Word text */}
                            <div className="text-xs md:text-sm font-black text-center text-amber-900 line-clamp-2">
                              {word.word}
                            </div>

                            {/* Category badge */}
                            <div className="mt-2 text-[8px] md:text-[10px] font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                              {word.category || "word"}
                            </div>

                            {/* Level indicator */}
                            <div className="absolute top-1 right-1 text-xs font-black text-green-600 bg-green-100 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center">
                              {word.level}
                            </div>
                          </motion.div>

                          {/* Star mastery indicator (placeholder for future star count) */}
                          <motion.div
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-lg md:text-xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + idx * 0.03 }}
                          >
                            ⭐
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4"
                  >
                    <div className="text-6xl md:text-7xl">🌱</div>
                    <p className="text-lg md:text-xl font-bold text-stone-700 text-center">
                      No mastered words yet
                    </p>
                    <p className="text-sm md:text-base text-stone-600 text-center max-w-xs">
                      Complete words in the game to build your collection!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Footer stats */}
            <motion.div
              className="bg-gradient-to-r from-stone-100 to-stone-50 px-6 md:px-8 py-4 md:py-5 border-t border-stone-200 flex gap-4 md:gap-6 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-green-600">
                  {masteredWords.length}
                </div>
                <div className="text-xs md:text-sm font-bold text-stone-700">
                  Total Words
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-black text-amber-600">
                  {categories.length}
                </div>
                <div className="text-xs md:text-sm font-bold text-stone-700">
                  Categories
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
