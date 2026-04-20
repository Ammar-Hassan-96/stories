import { useState, useEffect, useCallback, useRef } from "react";
import { Story } from "../types";
import { storyProvider } from "../services/storyProviderFactory";
import {
  getFromCache,
  setCache,
  appendToCache,
} from "../services/storyCache";

interface UseStoriesResult {
  stories: Story[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
}

const PAGE_SIZE = 15;

export function useStories(categoryId: string): UseStoriesResult {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPageRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchInitial = useCallback(
    async (forceRefresh = false, signal?: AbortSignal) => {
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

      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      isFetchingRef.current = true;

      try {
        const result = await storyProvider.fetchStories(categoryId, 0, PAGE_SIZE);
        if (signal?.aborted) return;
        setStories(result.stories);
        setHasMore(result.hasMore);
        currentPageRef.current = 0;
        setCache(categoryId, result.stories, result.hasMore);
      } catch (err) {
        if (signal?.aborted) return;
        const message =
          err instanceof Error ? err.message : "خطأ في تحميل القصص";
        setError(message);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
          isFetchingRef.current = false;
        }
      }
    },
    [categoryId]
  );

  useEffect(() => {
    const controller = new AbortController();
    currentPageRef.current = 0;
    isFetchingRef.current = false;
    fetchInitial(false, controller.signal);
    return () => controller.abort();
  }, [categoryId, fetchInitial]);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || loadingMore) return;

    const nextPage = currentPageRef.current + 1;
    isFetchingRef.current = true;
    setLoadingMore(true);
    setError(null);

    try {
      const result = await storyProvider.fetchStories(categoryId, nextPage, PAGE_SIZE);
      currentPageRef.current = nextPage;
      setHasMore(result.hasMore);
      appendToCache(categoryId, result.stories, nextPage, result.hasMore);
      setStories((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const unique = result.stories.filter((s) => !existingIds.has(s.id));
        return [...prev, ...unique];
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "خطأ في تحميل المزيد";
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

  return { stories, loading, refreshing, loadingMore, hasMore, error, loadMore, refresh };
}
