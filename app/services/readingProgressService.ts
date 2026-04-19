import { Story } from "../types";
import { StorageKeys, storageGet, storageSet } from "./storage";

export interface StoryProgress {
  story: Story;
  scrollY: number;
  contentHeight: number;
  percentage: number;   // 0 – 1
  savedAt: string;      // ISO timestamp
}

type ProgressMap = Record<string, StoryProgress>;

// Ignore saves below 3% (just opened) or above 97% (basically done)
const MIN_PCT = 0.03;
const DONE_PCT = 0.97;

async function getMap(): Promise<ProgressMap> {
  return storageGet<ProgressMap>(StorageKeys.READING_PROGRESS, {});
}

export async function saveProgress(
  story: Story,
  scrollY: number,
  contentHeight: number,
  layoutHeight: number = 0
): Promise<void> {
  if (contentHeight <= 0) return;
  const percentage = Math.min((scrollY + layoutHeight) / contentHeight, 1);
  if (percentage < MIN_PCT) return;

  const map = await getMap();

  if (percentage >= DONE_PCT) {
    // Story finished — remove from "continue reading"
    delete map[String(story.id)];
  } else {
    map[String(story.id)] = {
      story,
      scrollY,
      contentHeight,
      percentage,
      savedAt: new Date().toISOString(),
    };
  }

  await storageSet(StorageKeys.READING_PROGRESS, map);
}

export async function getProgress(storyId: number): Promise<StoryProgress | null> {
  const map = await getMap();
  return map[String(storyId)] ?? null;
}

export async function clearProgress(storyId: number): Promise<void> {
  const map = await getMap();
  delete map[String(storyId)];
  await storageSet(StorageKeys.READING_PROGRESS, map);
}

/** Returns in-progress stories sorted newest first (for HomeScreen). */
export async function getInProgressStories(): Promise<StoryProgress[]> {
  const map = await getMap();
  return Object.values(map)
    .filter((p) => p.percentage >= MIN_PCT && p.percentage < DONE_PCT)
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
}
