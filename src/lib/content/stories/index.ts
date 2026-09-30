import { nigeriasIndependenceStory } from "./nigerias-independence";
import type { Story } from "@/types/stories";

/**
 * All available stories
 * Add new stories here as they are created
 */
export const STORIES: Story[] = [nigeriasIndependenceStory];

interface ComingSoonStory extends Omit<Story, "pages"> {
  pages?: never;
}

/**
 * Future stories (coming soon)
 * Structure only, no pages yet
 */
export const COMING_SOON_STORIES: ComingSoonStory[] = [
  {
    id: "folktales-coming-soon",
    slug: "folktales",
    title: "African Folktales",
    description: "Traditional stories passed down through generations",
    category: "African Folktales",
    ageRange: "Ages 3–8",
    status: "coming-soon" as const,
    coverImageUrl: "/stories/folktales/cover.webp",
  },
  {
    id: "bedtime-coming-soon",
    slug: "bedtime-stories",
    title: "Bedtime Stories with Àmì & Kòkò",
    description: "Peaceful stories to help you rest",
    category: "Bedtime Stories",
    ageRange: "Ages 0–7",
    status: "coming-soon" as const,
    coverImageUrl: "/stories/bedtime/cover.webp",
  },
];

/**
 * Get all stories (available + coming soon)
 */
export function getAllStories(): (Story | ComingSoonStory)[] {
  return [
    ...STORIES,
    ...COMING_SOON_STORIES,
  ];
}

/**
 * Get a story by slug
 */
export function getStoryBySlug(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug);
}
