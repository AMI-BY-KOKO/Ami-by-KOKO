/**
 * audioFileFinder — dynamically locate audio files in different formats
 * 
 * Since voice actor recordings may arrive in different formats (.mp3, .mpeg, .wav, .m4a, .ogg, .webm, .mp4),
 * this utility checks for available formats without requiring a specific extension.
 */

const SUPPORTED_AUDIO_FORMATS = [".m4a", ".mp4", ".mp3", ".mpeg", ".wav", ".ogg", ".webm"];

/**
 * Given a base audio path (without extension), find which format actually exists
 * 
 * Example:
 * - Input: "/stories/nigerias-independence/audio/page-01"
 * - Output: "/stories/nigerias-independence/audio/page-01.mpeg" (if that file exists)
 * 
 * This function attempts to fetch each format and returns the first one that exists.
 * Falls back to the original path if no format is found (browser will handle the 404).
 */
export async function findAudioFile(baseAudioPath: string): Promise<string> {
  // If path already includes an extension, return as-is
  if (SUPPORTED_AUDIO_FORMATS.some((ext) => baseAudioPath.endsWith(ext))) {
    return baseAudioPath;
  }

  // Try each format
  for (const format of SUPPORTED_AUDIO_FORMATS) {
    const fullPath = `${baseAudioPath}${format}`;
    try {
      const response = await fetch(fullPath, { method: "HEAD" });
      if (response.ok) {
        return fullPath;
      }
    } catch {
      // Continue to next format
    }
  }

  // If no format found, return base path and let browser handle it
  // (will likely result in a 404, which StoryAudioPlayer handles gracefully)
  return baseAudioPath;
}

/**
 * Batch-find audio files for multiple pages
 * Useful for preloading audio metadata
 */
export async function findAudioFiles(
  basePathPrefix: string,
  pageNumbers: number[]
): Promise<Map<number, string>> {
  const audioMap = new Map<number, string>();

  for (const pageNum of pageNumbers) {
    const basePath = `${basePathPrefix}/page-${String(pageNum).padStart(2, "0")}`;
    const audioUrl = await findAudioFile(basePath);
    audioMap.set(pageNum, audioUrl);
  }

  return audioMap;
}
