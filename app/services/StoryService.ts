import categoriesData from "../data/categories.json";
import { Category } from "../types";

export const StoryService = {
  getCategories: (): Category[] => {
    return categoriesData.categories;
  },
};
