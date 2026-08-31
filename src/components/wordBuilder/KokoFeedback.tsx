"use client";

/**
 * Kòkò Feedback Component
 * Shows encouraging, celebratory, or helpful messages from Kòkò with animations.
 * Supports celebration animations, streak highlighting, and contextual styling.
 */

import { motion } from "framer-motion";

interface KokoFeedbackProps {
  text: string;
  type?: "success" | "encouragement" | "hint" | "level-complete" | "streak";
}

export default function KokoFeedback({ text, type = "encouragement" }: KokoFeedbackProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-rose-300 via-pink-300 to-rose-200 text-rose-900 shadow-lg";
      case "level-complete":
        return "bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 text-amber-900 shadow-xl";
      case "streak":
        return "bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 text-red-900 shadow-xl";
      case "hint":
        return "bg-gradient-to-r from-cyan-200 to-blue-200 text-blue-900 shadow-md";
      default:
        return "bg-gradient-to-r from-green-200 to-emerald-200 text-green-900 shadow-md";
    }
  };

  const shouldBounce = type === "success" || type === "level-complete" || type === "streak";

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.5, opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
        px-6 md:px-8 py-4 md:py-6 rounded-3xl text-base md:text-lg font-bold
        text-center max-w-md mx-auto
        ${getTypeStyles()}
      `}
    >
      <motion.span
        initial={{ scale: 0.8 }}
        animate={
          shouldBounce
            ? { scale: [0.8, 1.1, 1, 1.05, 1] }
            : { scale: 1 }
        }
        transition={{ duration: shouldBounce ? 0.5 : 0.3 }}
        className="block"
      >
        {text}
      </motion.span>

      {/* Celebration particles for streak/level complete */}
      {(type === "streak" || type === "level-complete") && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, x: (i - 1) * 40, y: -40 }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="absolute text-2xl"
            >
              ✨
            </motion.span>
          ))}
        </>
      )}
    </motion.div>
  );
}
