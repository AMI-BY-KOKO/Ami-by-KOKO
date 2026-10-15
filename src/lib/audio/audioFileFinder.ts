/**
 * audioFileFinder — resolve audio file paths with format detection
 * 
 * Audio files are organized by format:
 * - Pages 1-10: MP3 (Frey)
 * - Pages 11-29: MP4 (Simi, Vic)
 */

/**
 * Get the correct audio file path with extension based on page number
 * 
 * Example:
 * - Page 1-10: /stories/nigerias-independence/audio/page-01.mp3
 * - Page 11-29: /stories/nigerias-independence/audio/page-11.mp4
 */
export function getAudioFilePath(baseAudioPath: string, pageNumber: number): string {
  // Pages 1-10 use MP3, pages 11-29 use MP4
  const extension = pageNumber <= 10 ? ".mp3" : ".mp4";
  return `${baseAudioPath}${extension}`;
}

/**
 * Determine MIME type based on page number
 */
export function getAudioMimeType(pageNumber: number): string {
  return pageNumber <= 10 ? "audio/mpeg" : "audio/mp4";
}
