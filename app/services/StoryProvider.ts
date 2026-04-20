import { Story } from "../types";

// ─── Strategy Interface ──────────────────────────────────────────────────────

export interface FetchResult {
  stories: Story[];
  hasMore: boolean;
}

/**
 * StoryProvider defines the contract for any story data source.
 * Implementations can read from JSON (offline), Supabase (online), etc.
 *
 * To switch providers, change the export at the bottom of this file.
 */
export interface StoryProvider {
  /** Fetch paginated stories for a category */
  fetchStories(categoryId: string, page: number, pageSize: number): Promise<FetchResult>;
  /** Get a "featured story of the day" */
  fetchFeatured(): Promise<Story | null>;
  /** Search across all stories */
  searchStories(query: string, categoryIds: string[]): Promise<Story[]>;
}
