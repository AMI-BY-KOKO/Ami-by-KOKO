/**
 * Audio Service
 * Abstraction layer for playing word audio with fallback to Web Speech API.
 * Supports recorded native speaker clips and synthesized speech.
 */

import type { Language } from "@/types";

export type AudioSource = "recorded" | "synthesized" | "fallback";

interface AudioPlayOptions {
  volume?: number; // 0-1
  rate?: number; // 0.5-2.0
  pitch?: number; // 0-2
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

interface AudioServiceConfig {
  language: Language;
  recordedClipsBasePath: string; // e.g., '/public/audio'
  enableSynthesis: boolean;
  defaultVolume: number;
}

/**
 * Map language codes to Web Speech API language tags
 */
const LANGUAGE_TO_SPEECH_TAG: Record<Language, string> = {
  english: "en-GB",
  yoruba: "yo-NG", // Fallback if available
  french: "fr-FR",
  igbo: "ig-NG", // Fallback if available
  hausa: "ha-NG", // Fallback if available
};

class AudioService {
  private config: AudioServiceConfig;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private currentAudio: HTMLAudioElement | null = null;
  private speechSynthesis: SpeechSynthesis;

  constructor(config: AudioServiceConfig) {
    this.config = config;
    this.speechSynthesis = window.speechSynthesis;
  }

  /**
   * Play a word audio - tries recorded clip first, falls back to Web Speech API
   */
  async playWord(
    word: string,
    options: AudioPlayOptions = {}
  ): Promise<AudioSource> {
    try {
      // Try to play recorded clip first
      const source = await this.playRecordedClip(word, options);
      return source;
    } catch (recordedError) {
      console.warn(
        `Failed to play recorded clip for "${word}":`,
        recordedError
      );

      // Fallback to Web Speech API
      if (this.config.enableSynthesis) {
        try {
          await this.playSynthesizedSpeech(word, options);
          return "synthesized";
        } catch (synthesisError) {
          console.error(
            `Failed to synthesize speech for "${word}":`,
            synthesisError
          );
          if (options.onError) {
            options.onError(
              new Error(
                `Audio playback failed for "${word}": ${String(synthesisError)}`
              )
            );
          }
          return "fallback";
        }
      }

      if (options.onError) {
        options.onError(
          new Error(`Audio playback failed for "${word}": ${String(recordedError)}`)
        );
      }
      return "fallback";
    }
  }

  /**
   * Play a recorded clip from disk
   */
  private async playRecordedClip(
    word: string,
    options: AudioPlayOptions = {}
  ): Promise<AudioSource> {
    return new Promise((resolve, reject) => {
      // Construct path to recorded clip
      const clipPath = `${this.config.recordedClipsBasePath}/${this.config.language}/${word.toLowerCase()}.mp3`;

      // Check cache first
      let audio = this.audioCache.get(clipPath);
      if (!audio) {
        audio = new Audio(clipPath);
        this.audioCache.set(clipPath, audio);
      }

      // Stop currently playing audio
      if (this.currentAudio && this.currentAudio !== audio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }

      // Apply options
      audio.volume = options.volume ?? this.config.defaultVolume;
      if (options.rate && audio.playbackRate !== undefined) {
        audio.playbackRate = options.rate;
      }

      // Set up event handlers
      const handleEnded = () => {
        cleanup();
        if (options.onComplete) {
          options.onComplete();
        }
        resolve("recorded");
      };

      const handleError = (error: Event) => {
        cleanup();
        reject(
          new Error(
            `Failed to load audio from ${clipPath}: ${String(error)}`
          )
        );
      };

      const cleanup = () => {
        audio?.removeEventListener("ended", handleEnded);
        audio?.removeEventListener("error", handleError);
      };

      audio.addEventListener("ended", handleEnded, { once: true });
      audio.addEventListener("error", handleError, { once: true });

      this.currentAudio = audio;

      // Play audio
      audio
        .play()
        .catch((error) => {
          cleanup();
          reject(error);
        });

      // Timeout safety (audio should end naturally)
      setTimeout(() => {
        if (audio?.paused === false) {
          // Still playing, let it finish
        }
      }, 10000); // 10 second timeout
    });
  }

  /**
   * Play synthesized speech using Web Speech API
   */
  private async playSynthesizedSpeech(
    text: string,
    options: AudioPlayOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cancel any ongoing synthesis
      this.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANGUAGE_TO_SPEECH_TAG[this.config.language];
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? this.config.defaultVolume;

      utterance.onend = () => {
        if (options.onComplete) {
          options.onComplete();
        }
        resolve();
      };

      utterance.onerror = (error) => {
        console.error("Speech synthesis error:", error);
        reject(new Error(`Speech synthesis failed: ${error.error}`));
      };

      this.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Stop currently playing audio
   */
  stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this.speechSynthesis.cancel();
  }

  /**
   * Check if a recorded clip exists (for preloading/caching)
   */
  async checkRecordedClipExists(word: string): Promise<boolean> {
    try {
      const clipPath = `${this.config.recordedClipsBasePath}/${this.config.language}/${word.toLowerCase()}.mp3`;
      const response = await fetch(clipPath, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Preload recorded clips for faster playback
   */
  async preloadClips(words: string[]): Promise<void> {
    const loadPromises = words.map((word) =>
      this.checkRecordedClipExists(word).then((exists) => {
        if (exists) {
          const clipPath = `${this.config.recordedClipsBasePath}/${this.config.language}/${word.toLowerCase()}.mp3`;
          const audio = new Audio(clipPath);
          this.audioCache.set(clipPath, audio);
        }
      })
    );

    await Promise.all(loadPromises);
  }

  /**
   * Clear audio cache to free memory
   */
  clearCache(): void {
    this.audioCache.forEach((audio) => {
      audio.pause();
    });
    this.audioCache.clear();
  }

  /**
   * Get cache stats for debugging
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.audioCache.size,
      entries: Array.from(this.audioCache.keys()),
    };
  }
}

/**
 * Create and cache audio service instances per language
 */
let audioServiceInstances: Map<Language, AudioService> = new Map();

export function getAudioService(
  language: Language,
  customConfig?: Partial<AudioServiceConfig>
): AudioService {
  if (!audioServiceInstances.has(language)) {
    const config: AudioServiceConfig = {
      language,
      recordedClipsBasePath: "/audio",
      enableSynthesis: true,
      defaultVolume: 0.8,
      ...customConfig,
    };

    audioServiceInstances.set(language, new AudioService(config));
  }

  return audioServiceInstances.get(language)!;
}

/**
 * Cleanup: Call on app unmount
 */
export function cleanupAudioServices(): void {
  audioServiceInstances.forEach((service) => {
    service.stopAudio();
    service.clearCache();
  });
  audioServiceInstances.clear();
}
