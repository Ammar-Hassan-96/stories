import { Story } from "../types";
import { StoryProvider, FetchResult } from "./StoryProvider";
import {
  fetchStoriesFromSupabase,
  fetchFeaturedStory,
  searchStoriesFromSupabase,
} from "./supabaseClient";

/**
 * SupabaseStoryProvider — reads stories from the Supabase REST API.
 * Requires network connectivity.
 */
export const SupabaseStoryProvider: StoryProvider = {
  async fetchStories(
    categoryId: string,
    page: number,
    pageSize: number
  ): Promise<FetchResult> {
    return fetchStoriesFromSupabase(categoryId, page, pageSize);
  },

  async fetchFeatured(): Promise<Story | null> {
    return fetchFeaturedStory();
  },

  async searchStories(
    query: string,
    categoryIds: string[]
  ): Promise<Story[]> {
    return searchStoriesFromSupabase(query, categoryIds);
  },
};
