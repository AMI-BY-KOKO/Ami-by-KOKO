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
  imageUrl?: string; // e.g., "/stories/nigerias-independence/page-01.jfif"
  audioUrl?: string; // e.g., "/stories/nigerias-independence/audio/page-01.mp3"
  voiceActor?: string; // e.g., "Frey", "Simi", "Vic"
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
