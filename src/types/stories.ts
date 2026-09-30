/**
 * Story types — for the Stories feature
 * Defines the data structure for story content
 */

export type StoryPageType =
  | "narrative"
  | "explanation"
  | "fact"
  | "reflection"
  | "milestone"
  | "character"
  | "symbol"
  | "learning"
  | "inspiration"
  | "game"
  | "activity"
  | "challenge"
  | "quiz"
  | "celebration"
  | "ending";

export type StoryStatus = "available" | "coming-soon";

export interface StoryPage {
  pageNumber: number;
  type?: StoryPageType;
  text: string;
  audioText?: string; // Override text for TTS (if needed, e.g., formatting adjustments)
  imageUrl?: string; // e.g., "/stories/nigerias-independence/page-01.webp"
  audioUrl?: string; // Future: pre-recorded narration URL
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  ageRange: string;
  status: StoryStatus;
  coverImageUrl?: string;
  estimatedMinutes?: number;
  pages: StoryPage[];
}

/**
 * Story reader state for navigation
 */
export interface StoryReaderState {
  currentPageNumber: number;
  isPlaying: boolean;
  isComplete: boolean;
}
