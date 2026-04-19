import { useState, useCallback, useEffect } from "react";
import { StoryProgress, getInProgressStories } from "../services/readingProgressService";

export function useContinueReading() {
  const [items, setItems] = useState<StoryProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getInProgressStories();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
}
