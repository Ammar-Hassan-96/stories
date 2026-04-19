import { useState, useEffect, useCallback } from "react";
import { Story } from "../types";
import {
  BookmarkedStory,
  getBookmarks,
  toggleBookmark,
  isBookmarked,
} from "../services/bookmarkService";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedStory[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getBookmarks();
    setBookmarks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (story: Story): Promise<boolean> => {
      const nowBookmarked = await toggleBookmark(story);
      await refresh();
      return nowBookmarked;
    },
    [refresh]
  );

  const checkIsBookmarked = useCallback(
    (storyId: number): boolean => bookmarks.some((b) => b.id === storyId),
    [bookmarks]
  );

  return { bookmarks, loading, toggle, checkIsBookmarked, refresh };
}

export function useStoryBookmark(story: Story) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isBookmarked(story.id).then((v) => {
      setBookmarked(v);
      setLoading(false);
    });
  }, [story.id]);

  const toggle = useCallback(async (): Promise<void> => {
    const next = await toggleBookmark(story);
    setBookmarked(next);
  }, [story]);

  return { bookmarked, loading, toggle };
}
