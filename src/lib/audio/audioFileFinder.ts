/**
 * audioFileFinder — resolve audio file paths with format detection
 * 
 * Audio files are organized by format:
 * - Pages 1-10: MP3 (Frey)
 * - Pages 11-29: MP4 (Simi, Vic)
 * - Story audio: MP4 (various narrators)
 */

/**
 * Get the correct audio file path with extension based on page number
 * 
 * Handles two cases:
 * 1. Paths WITHOUT extension: adds .mp3 (pages 1-10) or .mp4 (pages 11+)
 * 2. Paths WITH extension: returns as-is (for story audio URLs)
 * 
 * Example:
 * - Page 1-10 without ext: /audio/koko/feedback/page-01 → /audio/koko/feedback/page-01.mp3
 * - Page 11-29 without ext: /stories/nigerias/audio/page-11 → /stories/nigerias/audio/page-11.mp4
 * - Story with ext: /stories/the-night-koko/audio/page-01.mp4 → /stories/the-night-koko/audio/page-01.mp4
 */
export function getAudioFilePath(baseAudioPath: string, pageNumber: number): string {
  // Check if path already has an extension (ends with .mp3, .mp4, .m4a, etc)
  if (/\.(mp3|mp4|m4a|wav|ogg)$/i.test(baseAudioPath)) {
    // Path already has extension, return as-is
    return baseAudioPath;
  }

  // Path doesn't have extension, append based on page number
  // Pages 1-10 use MP3, pages 11+ use MP4
  const extension = pageNumber <= 10 ? ".mp3" : ".mp4";
  return `${baseAudioPath}${extension}`;
}

/**
 * Determine MIME type based on page number
 */
export function getAudioMimeType(pageNumber: number): string {
  return pageNumber <= 10 ? "audio/mpeg" : "audio/mp4";
}
