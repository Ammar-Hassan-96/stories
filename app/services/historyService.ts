import { Story } from "../types";
import { StorageKeys, storageGet, storageSet } from "./storage";

const MAX_HISTORY = 20;

export interface HistoryEntry extends Story {
  readAt: string;
}

export async function getHistory(): Promise<HistoryEntry[]> {
  return storageGet<HistoryEntry[]>(StorageKeys.READING_HISTORY, []);
}

export async function addToHistory(story: Story): Promise<void> {
  const current = await getHistory();
  // Remove existing entry for this story (will re-add at top)
  const filtered = current.filter((h) => h.id !== story.id);
  const updated: HistoryEntry[] = [
    { ...story, readAt: new Date().toISOString() },
    ...filtered,
  ].slice(0, MAX_HISTORY);
  await storageSet(StorageKeys.READING_HISTORY, updated);
}

export async function clearHistory(): Promise<void> {
  await storageSet(StorageKeys.READING_HISTORY, []);
}
