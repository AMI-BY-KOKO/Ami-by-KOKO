import { nigeriasIndependenceMetadata } from "./metadata";
import { nigeriasIndependencePages } from "./pages";
import type { Story } from "@/types/stories";

export const nigeriasIndependenceStory: Story = {
  ...nigeriasIndependenceMetadata,
  pages: nigeriasIndependencePages,
};
