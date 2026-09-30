"use client";

import { motion } from "framer-motion";
import { useStoryAudio } from "@/hooks/useStoryAudio";

interface StoryAudioControlsProps {
  text: string;
  disabled?: boolean;
}

export function StoryAudioControls({
  text,
  disabled = false,
}: StoryAudioControlsProps) {
  const { isPlaying, play, pause, replay } = useStoryAudio();

  const handlePlayClick = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play(text);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center flex-wrap">
      {/* Play/Pause Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handlePlayClick}
        disabled={disabled}
        aria-label={isPlaying ? "Pause narration" : "Play narration"}
        className={`
          inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold
          transition focus:outline-none focus-ring
          ${
            disabled
              ? "bg-stone-100 text-stone-400 cursor-not-allowed"
              : isPlaying
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200"
                : "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200"
          }
        `}
        style={{
          outline: "2px solid transparent",
          outlineOffset: "2px",
        }}
      >
        {isPlaying ? (
          <>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ⏸
            </motion.span>
            <span className="hidden sm:inline">Pause</span>
          </>
        ) : (
          <>
            <span>🔊</span>
            <span className="hidden sm:inline">Listen</span>
          </>
        )}
      </motion.button>

      {/* Replay Button (only show when not playing) */}
      {!isPlaying && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => replay(text)}
          disabled={disabled}
          aria-label="Replay narration"
          className={`
            inline-flex items-center gap-1 px-4 py-3 rounded-full font-bold
            transition focus:outline-none focus-ring
            ${
              disabled
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50"
            }
          `}
          style={{
            outline: "2px solid transparent",
            outlineOffset: "2px",
          }}
        >
          <span>↻</span>
          <span className="hidden sm:inline">Replay</span>
        </motion.button>
      )}

      {/* Stop Button (only show when playing) */}
      {isPlaying && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={pause}
          disabled={disabled}
          aria-label="Stop narration"
          className="inline-flex items-center gap-1 px-4 py-3 rounded-full font-bold transition focus:outline-none focus-ring bg-stone-100 text-stone-700 hover:bg-stone-200"
          style={{
            outline: "2px solid transparent",
            outlineOffset: "2px",
          }}
        >
          <span>⏹</span>
          <span className="hidden sm:inline">Stop</span>
        </motion.button>
      )}
    </div>
  );
}
