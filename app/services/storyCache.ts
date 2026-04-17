import { Story } from "../types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  stories: Story[];
  page: number; // Last page fetched (0-based)
  hasMore: boolean;
  timestamp: number;
}

// Module-level in-memory cache — persists for the lifetime of the app session
const cache = new Map<string, CacheEntry>();

/**
 * Returns cached entry for a category if it exists and is still fresh.
 */
export function getFromCache(categoryId: string): CacheEntry | null {
  const entry = cache.get(categoryId);
  if (!entry) return null;
  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    cache.delete(categoryId);
    return null;
  }
  return entry;
}

/**
 * Sets or replaces the cache for a category with page 0 results.
 */
export function setCache(categoryId: string, stories: Story[], hasMore: boolean): void {
  cache.set(categoryId, {
    stories,
    page: 0,
    hasMore,
    timestamp: Date.now(),
  });
}

/**
 * Appends additional paginated results to the cache.
 */
export function appendToCache(
  categoryId: string,
  newStories: Story[],
  nextPage: number,
  hasMore: boolean
): void {
  const existing = cache.get(categoryId);
  if (existing) {
    // Deduplicate by id
    const existingIds = new Set(existing.stories.map((s) => s.id));
    const unique = newStories.filter((s) => !existingIds.has(s.id));
    cache.set(categoryId, {
      stories: [...existing.stories, ...unique],
      page: nextPage,
      hasMore,
      timestamp: existing.timestamp, // Keep original TTL
    });
  } else {
    setCache(categoryId, newStories, hasMore);
  }
}

/**
 * Invalidates cache for one category or all categories.
 */
export function invalidateCache(categoryId?: string): void {
  if (categoryId) {
    cache.delete(categoryId);
  } else {
    cache.clear();
  }
}
