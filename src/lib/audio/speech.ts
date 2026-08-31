/**
 * Web Speech API wrapper — fallback TTS when pre-recorded clips aren't available.
 * Uses new audioService abstraction layer with caching and better error handling.
 */
import type { Language } from "@/types";
import { getAudioService } from "./audioService";

const LANGUAGE_BCP47: Record<Language, string> = {
  english: "en-NG", // Nigerian English accent preferred
  yoruba: "yo-NG",
  igbo: "ig-NG",
  hausa: "ha-NG",
  french: "fr-FR",
};

interface PlayLetterSoundOptions {
  letter: string;
  language: Language;
  /** Deprecated: audioClipUrl is now handled internally by audioService */
  audioClipUrl?: string;
}

/**
 * Plays the sound for a letter.
 * Strategy: recorded clip → Web Speech API fallback.
 */
export async function playLetterSound({
  letter,
  language,
  audioClipUrl, // deprecated, kept for backwards compatibility
}: PlayLetterSoundOptions): Promise<void> {
  const audioService = getAudioService(language);
  
  try {
    await audioService.playWord(letter, {
      volume: 0.8,
      rate: 0.9, // Slightly slower for clarity
    });
  } catch (error) {
    console.error(`Failed to play letter sound for "${letter}":`, error);
  }
}

/**
 * Plays pronunciation for a full word.
 */
export async function playWordPronunciation(
  word: string,
  language: Language
): Promise<void> {
  const audioService = getAudioService(language);
  
  try {
    await audioService.playWord(word, {
      volume: 0.8,
      rate: 0.85, // Slightly slower for word clarity
    });
  } catch (error) {
    console.error(`Failed to play word pronunciation for "${word}":`, error);
  }
}

/**
 * Preload audio clips for a set of words (for better performance).
 */
export async function preloadWordAudio(
  words: string[],
  language: Language
): Promise<void> {
  const audioService = getAudioService(language);
  
  try {
    await audioService.preloadClips(words);
  } catch (error) {
    console.error("Failed to preload audio clips:", error);
  }
}

/**
 * Stop any currently playing audio.
 */
export function stopAudio(): void {
  // Stop all audio services
  const languages: Language[] = [
    "english",
    "yoruba",
    "french",
    "igbo",
    "hausa",
  ];
  languages.forEach((lang) => {
    getAudioService(lang).stopAudio();
  });
}

