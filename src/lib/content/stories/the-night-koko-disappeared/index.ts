import { theNightKokoDisappearedMetadata } from "./metadata";
import { theNightKokoDisappearedPages } from "./pages";
import type { Story } from "@/types/stories";

export const theNightKokoDisappearedStory: Story = {
  ...theNightKokoDisappearedMetadata,
  pages: theNightKokoDisappearedPages,
};
