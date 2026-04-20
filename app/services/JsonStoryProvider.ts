import { Story } from "../types";
import { StoryProvider, FetchResult } from "./StoryProvider";
// @ts-ignore – JSON module import
import allStoriesData from "../../assets/stories/stories.json";

const ALL_STORIES = allStoriesData as Story[];

/**
 * JsonStoryProvider — reads stories from the bundled offline JSON file.
 * No network calls, instant results.
 */
export const JsonStoryProvider: StoryProvider = {
  async fetchStories(
    categoryId: string,
    page: number,
    pageSize: number
  ): Promise<FetchResult> {
    const filtered = ALL_STORIES.filter(
      (s) => s.category_id === categoryId && s.is_published
    );
    const offset = page * pageSize;
    const stories = filtered.slice(offset, offset + pageSize);
    const hasMore = offset + pageSize < filtered.length;
    return { stories, hasMore };
  },

  async fetchFeatured(): Promise<Story | null> {
    const published = ALL_STORIES.filter((s) => s.is_published);
    if (published.length === 0) return null;
    const today = new Date();
    const seed =
      today.getDate() + today.getMonth() * 31 + today.getFullYear() * 366;
    return published[seed % published.length];
  },

  async searchStories(query: string): Promise<Story[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return ALL_STORIES.filter(
      (s) =>
        s.title.includes(trimmed) ||
        (s.author && s.author.includes(trimmed))
    );
  },
};
