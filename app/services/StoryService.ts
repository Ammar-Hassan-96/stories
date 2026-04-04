import categoriesData from "../data/categories.json";
import storiesData from "../data/stories.json";
import { Category, Story } from "../types";

export const StoryService = {
  getCategories: (): Category[] => {
    return categoriesData.categories;
  },

  getStoriesByCategory: (categoryId: string): Story[] => {
    return storiesData.stories.filter((story) => story.categoryId === categoryId);
  },

  getStoryById: (storyId: string): Story | undefined => {
    return storiesData.stories.find((story) => story.id === storyId);
  },
};
