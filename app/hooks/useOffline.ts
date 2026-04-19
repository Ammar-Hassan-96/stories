import { useState, useEffect, useCallback } from "react";
import { Story } from "../types";
import {
  OfflineStory,
  getOfflineStories,
  isStoryOffline,
  toggleOfflineStory,
  getOfflineStorageSize,
} from "../services/offlineService";

/**
 * Hook to manage offline stories collection (for the screen listing).
 */
export function useOfflineStories() {
  const [stories, setStories] = useState<OfflineStory[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [data, size] = await Promise.all([
      getOfflineStories(),
      getOfflineStorageSize(),
    ]);
    setStories(data);
    setTotalSize(size);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stories, totalSize, loading, refresh };
}

/**
 * Hook to check/toggle offline state for a single story.
 */
export function useStoryOffline(story: Story) {
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isStoryOffline(story.id).then((v) => {
      setOffline(v);
      setLoading(false);
    });
  }, [story.id]);

  const toggle = useCallback(async (): Promise<boolean> => {
    const next = await toggleOfflineStory(story);
    setOffline(next);
    return next;
  }, [story]);

  return { offline, loading, toggle };
}
