import { useState, useEffect, useCallback, useRef } from "react";
import { Story } from "../types";
import { fetchStoriesFromSupabase } from "../services/supabaseClient";
import {
  getFromCache,
  setCache,
  appendToCache,
} from "../services/storyCache";

interface UseStoriesResult {
  stories: Story[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
}

export function useStories(categoryId: string): UseStoriesResult {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track current page in a ref to avoid stale closures
  const currentPageRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchInitial = useCallback(async (forceRefresh = false) => {
    // Check cache first (unless force refreshing)
    if (!forceRefresh) {
      const cached = getFromCache(categoryId);
      if (cached) {
        setStories(cached.stories);
        setHasMore(cached.hasMore);
        currentPageRef.current = cached.page;
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    isFetchingRef.current = true;

    try {
      const result = await fetchStoriesFromSupabase(categoryId, 0);
      setStories(result.stories);
      setHasMore(result.hasMore);
      currentPageRef.current = 0;
      setCache(categoryId, result.stories, result.hasMore);
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطأ في تحميل القصص";
      setError(message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [categoryId]);

  useEffect(() => {
    currentPageRef.current = 0;
    fetchInitial(false);
  }, [categoryId, fetchInitial]);

  const loadMore = useCallback(async () => {
    // Guard against concurrent fetches or when no more data
    if (isFetchingRef.current || !hasMore || loadingMore) return;

    const nextPage = currentPageRef.current + 1;
    isFetchingRef.current = true;
    setLoadingMore(true);
    setError(null);

    try {
      const result = await fetchStoriesFromSupabase(categoryId, nextPage);
      currentPageRef.current = nextPage;
      setHasMore(result.hasMore);
      appendToCache(categoryId, result.stories, nextPage, result.hasMore);
      // Always derive from cache to ensure deduplication
      setStories((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const unique = result.stories.filter((s) => !existingIds.has(s.id));
        return [...prev, ...unique];
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطأ في تحميل المزيد";
      setError(message);
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [categoryId, hasMore, loadingMore]);

  const refresh = useCallback(() => {
    currentPageRef.current = 0;
    fetchInitial(true);
  }, [fetchInitial]);

  return { stories, loading, loadingMore, hasMore, error, loadMore, refresh };
}
