"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { StoryPage } from "./StoryPage";
import { StoryCompletion } from "./StoryCompletion";
import type { Story } from "@/types/stories";

interface StoryReaderProps {
  story: Story;
  initialPageNumber?: number;
}

/**
 * Main story reader component
 * Manages page navigation, progress, and completion state
 */
export function StoryReader({
  story,
  initialPageNumber = 1,
}: StoryReaderProps) {
  const [currentPageNumber, setCurrentPageNumber] = useState(initialPageNumber);
  const [isComplete, setIsComplete] = useState(false);

  const currentPage = story.pages.find((p) => p.pageNumber === currentPageNumber);
  const totalPages = story.pages.length;
  const isFirstPage = currentPageNumber === 1;
  const isLastPage = currentPageNumber === totalPages;
  const progressPercent = Math.round((currentPageNumber / totalPages) * 100);

  // Handle completion when reaching the last page
  useEffect(() => {
    if (isLastPage && !isComplete) {
      setIsComplete(true);
    }
  }, [isLastPage, isComplete]);

  const goToPreviousPage = useCallback(() => {
    if (!isFirstPage) {
      setCurrentPageNumber(currentPageNumber - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isFirstPage, currentPageNumber]);

  const goToNextPage = useCallback(() => {
    if (!isLastPage) {
      setCurrentPageNumber(currentPageNumber + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isLastPage, currentPageNumber]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPreviousPage();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [goToPreviousPage, goToNextPage]);

  if (!currentPage) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-stone-600 font-semibold">Page not found</p>
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl transition"
        >
          ← Back to Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 pb-10 max-w-2xl mx-auto w-full">
      {/* Header with back button and progress */}
      <div className="w-full flex items-center justify-between px-2 gap-4">
        <Link
          href="/stories"
          className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-bold text-sm transition focus:outline-none focus-ring"
          aria-label="Back to stories"
          style={{
            outline: "2px solid transparent",
            outlineOffset: "2px",
          }}
        >
          ← Stories
        </Link>
        <h1 className="font-bold text-stone-800 text-center flex-1 line-clamp-1">
          {story.title}
        </h1>
        <div className="text-sm font-bold text-stone-600 flex-shrink-0">
          {currentPageNumber}/{totalPages}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full px-2">
        <div className="flex justify-between text-xs font-semibold text-stone-500 mb-2">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Story content */}
      <div className="w-full px-2">
        <AnimatePresence mode="wait">
          {isComplete ? (
            <StoryCompletion
              story={story}
              onReadAgain={() => {
                setCurrentPageNumber(1);
                setIsComplete(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          ) : (
            <StoryPage
              key={currentPage.pageNumber}
              page={currentPage}
              totalPages={totalPages}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      {!isComplete && (
        <div className="w-full px-2 sticky bottom-0 bg-gradient-to-t from-amber-50 to-transparent pt-6 pb-4">
          <div className="flex items-center justify-between gap-3">
            {/* Previous button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousPage}
              disabled={isFirstPage}
              aria-label="Go to previous page (keyboard: Left arrow)"
              className={`
                flex-1 py-3 px-4 rounded-2xl font-bold transition
                focus:outline-none focus-ring
                ${
                  isFirstPage
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-white border-2 border-stone-300 text-stone-700 hover:bg-stone-50 active:scale-95"
                }
              `}
              style={{
                outline: "2px solid transparent",
                outlineOffset: "2px",
              }}
            >
              ← Previous
            </motion.button>

            {/* Page indicator */}
            <div className="text-center px-2">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                Page
              </p>
              <p className="text-lg font-extrabold text-stone-800">
                {currentPageNumber}/{totalPages}
              </p>
            </div>

            {/* Next button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goToNextPage}
              disabled={isLastPage}
              aria-label="Go to next page (keyboard: Right arrow)"
              className={`
                flex-1 py-3 px-4 rounded-2xl font-bold transition
                focus:outline-none focus-ring
                ${
                  isLastPage
                    ? "bg-gradient-to-br from-amber-300 to-orange-300 text-white cursor-default"
                    : "bg-amber-500 hover:bg-amber-600 text-white active:scale-95 shadow-md shadow-amber-200"
                }
              `}
              style={{
                outline: "2px solid transparent",
                outlineOffset: "2px",
              }}
            >
              {isLastPage ? "🎉 Complete" : "Next →"}
            </motion.button>
          </div>

          {/* Keyboard hint */}
          <p className="text-center text-xs text-stone-400 mt-3">
            Use arrow keys or buttons to navigate
          </p>
        </div>
      )}
    </div>
  );
}
