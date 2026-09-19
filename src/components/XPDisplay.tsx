/**
 * XPDisplay Component
 * Shows a child's current level, XP, and progress to next level.
 *
 * Usage:
 *   <XPDisplay level={3} xpTotal={245} />
 *
 * Displays in header/nav with icon, level name, and progress bar.
 */

"use client";

import { getLevelInfo, getProgressPercentage } from "@/lib/xp/xp";
import { motion } from "framer-motion";

interface XPDisplayProps {
  level: number;
  xpTotal: number;
  compact?: boolean; // If true, show only icon + level number
}

export default function XPDisplay({ level, xpTotal, compact = false }: XPDisplayProps) {
  const levelInfo = getLevelInfo(level);
  const progress = getProgressPercentage(xpTotal, level);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl">{levelInfo.icon}</span>
        <span className="font-bold text-sm text-stone-700">L{level}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Header: Icon + Level Name + XP Total */}
      <div className="flex items-center gap-3">
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-3xl"
        >
          {levelInfo.icon}
        </motion.span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-stone-800 leading-tight">
            Level {level}: {levelInfo.name}
          </p>
          <p className="text-xs text-stone-500">{xpTotal.toLocaleString()} XP</p>
        </div>
      </div>

      {/* Progress bar to next level */}
      {level < 10 && (
        <div className="w-full">
          <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
            />
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {progress.toFixed(0)}% to next level
          </p>
        </div>
      )}

      {/* Max level message */}
      {level >= 10 && (
        <p className="text-xs text-amber-600 font-semibold">🏆 Max level reached!</p>
      )}
    </div>
  );
}

/**
 * XPDisplayCompact Component
 * Minimal version for headers/navs: just icon + level
 */
export function XPDisplayCompact({ level, xpTotal }: XPDisplayProps) {
  return <XPDisplay level={level} xpTotal={xpTotal} compact={true} />;
}

/**
 * XPBadge Component
 * Shows level icon + number as a small badge
 */
export function XPBadge({ level }: { level: number }) {
  const levelInfo = getLevelInfo(level);

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 ring-1 ring-amber-200">
      <span className="text-lg">{levelInfo.icon}</span>
      <span className="text-xs font-bold text-amber-900">L{level}</span>
    </div>
  );
}
