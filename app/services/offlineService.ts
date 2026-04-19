import { Story } from "../types";
import { StorageKeys, storageGet, storageSet } from "./storage";

export interface OfflineStory extends Story {
  downloadedAt: string;
  sizeBytes: number;
}

/**
 * Get all offline (downloaded) stories.
 */
export async function getOfflineStories(): Promise<OfflineStory[]> {
  return storageGet<OfflineStory[]>(StorageKeys.OFFLINE_STORIES, []);
}

/**
 * Check if a specific story is downloaded.
 */
export async function isStoryOffline(storyId: number): Promise<boolean> {
  const stories = await getOfflineStories();
  return stories.some((s) => s.id === storyId);
}

/**
 * Download a story for offline reading (just persists full content locally).
 * No file download needed since the story text is already in memory when viewed.
 */
export async function downloadStory(story: Story): Promise<OfflineStory> {
  const current = await getOfflineStories();
  const existing = current.find((s) => s.id === story.id);
  if (existing) return existing;

  const sizeBytes = new Blob([
    JSON.stringify(story),
  ]).size;

  const offlineStory: OfflineStory = {
    ...story,
    downloadedAt: new Date().toISOString(),
    sizeBytes,
  };

  const updated = [offlineStory, ...current];
  await storageSet(StorageKeys.OFFLINE_STORIES, updated);
  return offlineStory;
}

/**
 * Remove a story from offline storage.
 */
export async function removeOfflineStory(storyId: number): Promise<void> {
  const current = await getOfflineStories();
  await storageSet(
    StorageKeys.OFFLINE_STORIES,
    current.filter((s) => s.id !== storyId)
  );
}

/**
 * Toggle offline state for a story.
 */
export async function toggleOfflineStory(story: Story): Promise<boolean> {
  const isOffline = await isStoryOffline(story.id);
  if (isOffline) {
    await removeOfflineStory(story.id);
    return false;
  } else {
    await downloadStory(story);
    return true;
  }
}

/**
 * Get total offline storage size in bytes.
 */
export async function getOfflineStorageSize(): Promise<number> {
  const stories = await getOfflineStories();
  return stories.reduce((sum, s) => sum + (s.sizeBytes || 0), 0);
}

/**
 * Format bytes into a human-readable Arabic string.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} ب`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ك.ب`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} م.ب`;
}

/**
 * Clear all offline stories.
 */
export async function clearOfflineStories(): Promise<void> {
  await storageSet(StorageKeys.OFFLINE_STORIES, []);
}
