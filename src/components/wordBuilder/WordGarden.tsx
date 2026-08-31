"use client";

/**
 * Word Garden — Interactive Visual World
 * Shows a beautiful, animated garden that grows as child completes words.
 * Features:
 * - Dynamic garden scene with multiple growing plants
 * - Word seed collection with visual representation
 * - Progressive unlocking of garden elements
 * - Mastery visualization
 */

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface WordGardenProps {
  seedCount: number;
  masteredWordsCount?: number;
  className?: string;
}

/**
 * Garden stages and visual elements
 */
function getGardenStage(seeds: number) {
  if (seeds < 10) {
    return {
      stage: "planting",
      icon: "🌱",
      name: "Planting",
      nextMilestone: 10,
      description: "Your garden is just beginning!",
      progress: (seeds / 10) * 100,
      elements: 1,
    };
  } else if (seeds < 25) {
    return {
      stage: "growing",
      icon: "🌿",
      name: "Growing",
      nextMilestone: 25,
      description: "Your garden is coming to life!",
      progress: ((seeds - 10) / 15) * 100,
      elements: 2,
    };
  } else if (seeds < 50) {
    return {
      stage: "blooming",
      icon: "🌷",
      name: "Blooming",
      nextMilestone: 50,
      description: "Your garden is beautiful!",
      progress: ((seeds - 25) / 25) * 100,
      elements: 3,
    };
  } else {
    return {
      stage: "thriving",
      icon: "🌳",
      name: "Thriving",
      nextMilestone: 100,
      description: "Your garden is magnificent!",
      progress: Math.min((seeds / 100) * 100, 100),
      elements: 4,
    };
  }
}

export default function WordGarden({
  seedCount,
  masteredWordsCount = 0,
  className = "",
}: WordGardenProps) {
  const stageData = getGardenStage(seedCount);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation on seed count increase
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [seedCount]);

  // Generate garden plants based on seed count
  const generatePlants = () => {
    const plants = [];
    
    // Main plant (center, always visible)
    plants.push(
      <motion.div
        key="main"
        className="absolute left-1/2 -translate-x-1/2 bottom-12"
        animate={isAnimating ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="text-7xl md:text-8xl">{stageData.icon}</div>
      </motion.div>
    );

    // Additional plants based on stage
    const additionalPlants = [
      { emoji: "🌾", x: 15, y: 20, minSeeds: 10 },
      { emoji: "🌻", x: -20, y: 25, minSeeds: 20 },
      { emoji: "🌺", x: 25, y: 30, minSeeds: 35 },
    ];

    additionalPlants.forEach((plant, idx) => {
      if (seedCount >= plant.minSeeds) {
        plants.push(
          <motion.div
            key={`plant-${idx}`}
            className="absolute text-5xl md:text-6xl"
            style={{ left: `${plant.x}%`, bottom: `${plant.y}px` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.1 }}
          >
            {plant.emoji}
          </motion.div>
        );
      }
    });

    // Decorative elements
    if (seedCount >= 25) {
      plants.push(
        <motion.div
          key="butterfly"
          className="absolute text-4xl"
          style={{ right: "10%", top: "15%" }}
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🦋
        </motion.div>
      );
    }

    if (seedCount >= 40) {
      plants.push(
        <motion.div
          key="bee"
          className="absolute text-3xl"
          style={{ left: "10%", top: "20%" }}
          animate={{
            x: [0, -15, 0],
            y: [0, 8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          🐝
        </motion.div>
      );
    }

    return plants;
  };

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Garden Scene */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md h-64 md:h-80 rounded-3xl bg-gradient-to-b from-cyan-200 via-blue-100 to-green-100 border-4 border-green-400 shadow-xl relative overflow-hidden"
      >
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 to-transparent opacity-30" />

        {/* Sun/Moon based on stage */}
        <motion.div className="absolute top-4 right-4 text-5xl">
          {seedCount < 25 ? "☀️" : "⭐"}
        </motion.div>

        {/* Garden ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-green-300 to-green-500 opacity-40" />

        {/* Plants and decorations */}
        {generatePlants()}

        {/* Seeds floating animation on new completion */}
        {isAnimating && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`seed-${i}`}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-2xl"
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -120, opacity: 0, x: (i - 1) * 30 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              >
                🌱
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Stage Info */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <h3 className="text-2xl md:text-3xl font-black text-green-800 mb-1">
          {stageData.icon} {stageData.name}
        </h3>
        <p className="text-sm md:text-base text-stone-700 italic">
          {stageData.description}
        </p>
      </motion.div>

      {/* Progress Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-md p-5 ring-1 ring-green-100"
      >
        {/* Seeds Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-stone-700">🌱 Seeds Collected</span>
            <span className="text-sm font-bold text-green-600">
              {seedCount}/{stageData.nextMilestone}
            </span>
          </div>
          <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${stageData.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Mastery Progress */}
        {masteredWordsCount > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-stone-700">🏆 Words Mastered</span>
              <span className="text-sm font-bold text-amber-600">{masteredWordsCount}</span>
            </div>
            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((masteredWordsCount / 20) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Milestone Tracker */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="grid grid-cols-4 gap-2">
          {[
            { seeds: 10, emoji: "🌱", label: "Planted" },
            { seeds: 25, emoji: "🌿", label: "Growing" },
            { seeds: 50, emoji: "🌷", label: "Blooming" },
            { seeds: 100, emoji: "🌳", label: "Thriving" },
          ].map((milestone) => {
            const isReached = seedCount >= milestone.seeds;
            return (
              <motion.div
                key={milestone.seeds}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`text-center p-3 rounded-2xl transition-all duration-300 ring-2 ${
                  isReached
                    ? "bg-gradient-to-br from-green-100 to-emerald-100 ring-green-400 shadow-md"
                    : "bg-stone-100 ring-stone-300 opacity-60"
                }`}
              >
                <div className="text-3xl md:text-4xl mb-1">{milestone.emoji}</div>
                <div className="text-xs md:text-sm font-bold text-stone-700">
                  {milestone.seeds}
                </div>
                <div className="text-[10px] text-stone-600">{milestone.label}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Encouragement Message */}
      {seedCount < stageData.nextMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-sm text-stone-600 italic"
        >
          <p>
            {stageData.nextMilestone - seedCount} more word{seedCount < stageData.nextMilestone - 1 ? "s" : ""} to reach{" "}
            <span className="font-bold text-green-700">{stageData.name}!</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}
