import { useState, useEffect, useCallback, useRef } from "react";
import { Story } from "../types";
import {
  StoryProgress,
  getProgress,
  saveProgress as _save,
  clearProgress as _clear,
} from "../services/readingProgressService";

const SAVE_THRESHOLD_PX = 60; // only save when scrolled ≥60px from last save

export function useReadingProgress(story: Story) {
  const [savedProgress, setSavedProgress] = useState<StoryProgress | null>(null);
  const lastSavedY = useRef<number>(-999);

  useEffect(() => {
    getProgress(story.id).then(setSavedProgress);
  }, [story.id]);

  const saveProgress = useCallback(
    async (scrollY: number, contentHeight: number, layoutHeight: number = 0) => {
      if (Math.abs(scrollY - lastSavedY.current) < SAVE_THRESHOLD_PX) return;
      lastSavedY.current = scrollY;
      await _save(story, scrollY, contentHeight, layoutHeight);
    },
    [story]
  );

  const clearProgress = useCallback(async () => {
    await _clear(story.id);
    setSavedProgress(null);
  }, [story.id]);

  return { savedProgress, saveProgress, clearProgress };
}
