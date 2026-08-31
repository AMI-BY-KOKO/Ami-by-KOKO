"use client";

/**
 * Language Selection Screen for Word Builder.
 * Child selects a language (English, Yorùbá, Français) to begin or continue.
 * Shows Kòkò and large, child-friendly language cards with selection animation.
 */

import { motion } from "framer-motion";
import { useState } from "react";
import Koko from "@/components/characters/Koko";
import type { Language } from "@/types";
import { LANGUAGE_OPTIONS } from "@/lib/wordBuilder/types";

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
  selectedLanguage?: Language | null;
  recentLanguage?: Language | null;
  loading?: boolean;
}

export default function LanguageSelector({
  onLanguageSelect,
  selectedLanguage,
  recentLanguage,
  loading = false,
}: LanguageSelectorProps) {
  const [hoveredLanguage, setHoveredLanguage] = useState<Language | null>(null);

  const languages: Language[] = ["english", "yoruba", "french"];

  const handleLanguageClick = (language: Language) => {
    if (!loading) {
      onLanguageSelect(language);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-cream-bg to-amber-50 flex flex-col items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-5 text-6xl opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🦜
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-5xl opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        {/* Kòkò greeting */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <Koko speaking={false} className="w-32 h-32 md:w-40 md:h-40" />
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-amber-900 mb-2">
              🦜 Kòkò's Word Adventure
            </h1>
            <p className="text-xl md:text-2xl text-amber-800 font-bold">
              Mix it. Match it. Make a word!
            </p>
            <p className="text-sm md:text-base text-stone-600 mt-3 italic">
              Join Kòkò on a learning journey through three languages
            </p>
          </div>
        </motion.div>

        {/* Language selection heading */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-green-800 mb-3">
            🌍 Choose Your Language
          </h2>
          <p className="text-base md:text-lg text-stone-700 font-medium">
            Which language adventure would you like to explore today?
          </p>
        </motion.div>

        {/* Language cards */}
        <div className="w-full grid gap-4 md:gap-6 mt-8">
          {languages.map((language, index) => {
            const option = LANGUAGE_OPTIONS[language];
            const isSelected = selectedLanguage === language;
            const isHovered = hoveredLanguage === language;
            const isRecent = recentLanguage === language && !selectedLanguage;

            return (
              <motion.button
                key={language}
                onClick={() => handleLanguageClick(language)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.12 }}
                onHoverStart={() => setHoveredLanguage(language)}
                onHoverEnd={() => setHoveredLanguage(null)}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`relative w-full rounded-3xl p-6 md:p-7 transition-all duration-300 group cursor-pointer min-h-[120px] md:min-h-[140px] flex items-center
                  ${isSelected ? "ring-4 ring-amber-500 shadow-2xl scale-105" : "shadow-lg hover:shadow-xl hover:scale-[1.02]"}
                  ${isRecent && !isSelected ? "ring-2 ring-green-400" : ""}
                  ${loading ? "opacity-60 cursor-not-allowed" : ""}
                `}
              >
                {/* Card background with gradient */}
                <div
                  className={`absolute inset-0 rounded-3xl transition-all duration-300
                    ${index === 0 ? "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50" : ""}
                    ${index === 1 ? "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50" : ""}
                    ${index === 2 ? "bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50" : ""}
                    ${isSelected ? "shadow-inner" : ""}
                  `}
                />

                {/* Card content with improved spacing */}
                <div className="relative z-10 flex items-center gap-5 md:gap-6 w-full">
                  {/* Flag/Icon - Larger */}
                  <motion.div
                    className="text-6xl md:text-7xl flex-shrink-0 leading-none"
                    animate={isHovered ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {option.flag}
                  </motion.div>

                  {/* Text content - Improved hierarchy */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl md:text-3xl font-black text-stone-900">
                        {option.displayName}
                      </h3>
                      {isRecent && !isSelected && (
                        <span className="text-xs font-bold px-2.5 py-1 bg-green-200 text-green-800 rounded-full whitespace-nowrap">
                          Recently played
                        </span>
                      )}
                    </div>
                    <p className="text-sm md:text-base text-stone-700 font-semibold mb-1">
                      {option.nativeName}
                    </p>
                    <p className="text-xs md:text-sm text-stone-600">
                      {option.description}
                    </p>
                  </div>

                  {/* Play button - Larger touch target */}
                  <motion.div
                    className="flex-shrink-0 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md transition-all duration-300 font-bold text-lg md:text-xl"
                    animate={
                      isSelected
                        ? { scale: 1.15, backgroundColor: "#FCD34D" }
                        : isHovered
                          ? { scale: 1.1 }
                          : { scale: 1 }
                    }
                  >
                    <span className={isSelected ? "text-amber-700" : "text-amber-600"}>
                      {isSelected ? "✓" : option.playLabel}
                    </span>
                  </motion.div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-4 border-amber-500 pointer-events-none"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Continue prompt */}
        {selectedLanguage && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center text-sm text-stone-600 mt-4"
          >
            <p>
              Ready to build words in{" "}
              <span className="font-bold text-green-800">
                {LANGUAGE_OPTIONS[selectedLanguage].displayName}
              </span>
              ?
            </p>
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="inline-block">
              <motion.div
                className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <p className="text-sm text-stone-600 mt-2">Loading…</p>
          </motion.div>
        )}

        {/* Kòkò hint text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10 pt-8 border-t-2 border-amber-200"
        >
          <p className="text-base md:text-lg text-amber-800 font-semibold mb-2">
            "Let's go on an adventure together!" — Kòkò 🦜
          </p>
          <p className="text-xs md:text-sm text-stone-600">
            Learn new words, grow your Word Garden, and unlock achievements!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
