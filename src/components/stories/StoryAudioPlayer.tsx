"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getAudioFilePath, getAudioMimeType } from "@/lib/audio/audioFileFinder";

interface StoryAudioPlayerProps {
  audioUrl?: string;
  pageNumber: number;
  isCurrentPage: boolean;
}

/**
 * StoryAudioPlayer — plays professional voice-actor audio for story pages
 * 
 * Features:
 * - Pages 1-10: MP3 format (Frey)
 * - Pages 11-29: MP4 format (Simi, Vic)
 * - Autoplay on page load (except iOS — requires user tap)
 * - Play, pause, replay controls
 * - Graceful degradation if audio unavailable
 * - iOS-specific hint for manual play requirement
 */
export function StoryAudioPlayer({
  audioUrl,
  pageNumber,
  isCurrentPage,
}: StoryAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const autoplayAttemptedRef = useRef(false);

  // Get the correct audio file path with extension
  const audioFilePath = audioUrl ? getAudioFilePath(audioUrl, pageNumber) : null;

  // Detect if running on iOS
  useEffect(() => {
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !/Android/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  // When page becomes current, try to load audio metadata
  useEffect(() => {
    if (!isCurrentPage || !audioRef.current) return;

    // Reset autoplay flag when page changes
    autoplayAttemptedRef.current = false;

    // On iOS, we need to trigger load to populate metadata
    if (!audioLoaded) {
      console.log(`Loading audio metadata for page ${pageNumber}...`);
      audioRef.current.load();
      setAudioLoaded(true);
    }
  }, [isCurrentPage, pageNumber, audioLoaded]);

  // Stop audio when page changes
  useEffect(() => {
    if (!isCurrentPage && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      autoplayAttemptedRef.current = false;
    }
  }, [isCurrentPage]);

  // Attempt autoplay only after canPlay event (but not on iOS)
  useEffect(() => {
    if (
      !isCurrentPage ||
      !canPlay ||
      autoplayAttemptedRef.current ||
      !audioRef.current ||
      isIOS
    ) {
      return;
    }

    autoplayAttemptedRef.current = true;
    console.log(`Attempting autoplay for page ${pageNumber}`);
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log(`Autoplay succeeded for page ${pageNumber}`);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn(
            `Autoplay blocked for page ${pageNumber}: ${err.message}`
          );
        });
    }
  }, [isCurrentPage, canPlay, pageNumber, isIOS]);

  // Handle audio metadata loading
  const handleCanPlay = () => {
    console.log(`Audio ready for page ${pageNumber}: ${audioFilePath}`);
    setCanPlay(true);
    setIsLoading(false);
    setHasError(false);
  };

  // Handle audio errors
  const handleError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    console.error(`Audio error for page ${pageNumber}:`, {
      src: audioFilePath,
      error: audio.error?.message || 'Unknown error',
      networkState: audio.networkState,
      readyState: audio.readyState,
    });
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
  };

  // Handle play button
  const handlePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        
        // Ensure metadata is loaded
        if (!canPlay) {
          audioRef.current.load();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
        setCanPlay(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(`Audio playback error for page ${pageNumber}:`, err);
      setHasError(true);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  // Handle replay button
  const handleReplay = async () => {
    if (!audioRef.current || !canPlay) return;

    try {
      audioRef.current.currentTime = 0;
      setIsLoading(true);
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      console.error(`Audio replay error for page ${pageNumber}:`, err);
      setHasError(true);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  // Handle audio end
  const handleEnded = () => {
    setIsPlaying(false);
  };

  // If no audio URL, don't render
  if (!audioFilePath) {
    return null;
  }

  // If error loading audio, don't show broken player
  if (hasError) {
    return null;
  }

  const mimeType = getAudioMimeType(pageNumber);

  return (
    <div className="flex flex-col gap-3 mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl ring-1 ring-amber-100">
      {/* iOS hint */}
      {isIOS && !isPlaying && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-amber-600 font-semibold bg-amber-100/50 px-3 py-2 rounded-lg"
        >
          📱 Tap the Play button to listen to Kòkò's voice
        </motion.p>
      )}

      {/* Audio element with iOS compatibility attributes */}
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
        onCanPlay={handleCanPlay}
        onError={handleError}
        onEnded={handleEnded}
        onPlay={() => {
          console.log(`Audio playing: page ${pageNumber}`);
          setIsPlaying(true);
        }}
        onPause={() => {
          console.log(`Audio paused: page ${pageNumber}`);
          setIsPlaying(false);
        }}
      >
        <source src={audioFilePath} type={mimeType} />
        Your browser does not support the audio element.
      </audio>

      {/* Audio Controls */}
      <div className="flex items-center gap-2">
        {/* Play/Pause Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePlay}
          disabled={isLoading || (hasError && !isPlaying) || (!canPlay && !isIOS)}
          aria-label={
            isPlaying
              ? `Pause page ${pageNumber} narration`
              : `Play page ${pageNumber} narration`
          }
          className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition shadow-md shadow-amber-200 min-h-12"
        >
          <span className="text-lg">
            {isLoading ? "⏳" : isPlaying ? "⏸️" : "▶️"}
          </span>
          <span className="text-sm">
            {isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
          </span>
        </motion.button>

        {/* Replay Button — only show if audio is ready */}
        {canPlay && !isLoading && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReplay}
            aria-label={`Replay page ${pageNumber} narration`}
            className="flex items-center justify-center w-12 h-12 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-full transition"
          >
            <span className="text-lg">🔁</span>
          </motion.button>
        )}
      </div>

      {/* Status Text */}
      {isPlaying && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-amber-700 font-semibold"
        >
          🎧 Listening to narration...
        </motion.p>
      )}
    </div>
  );
}
