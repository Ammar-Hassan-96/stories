import { Story } from "../types";
import { StorageKeys, storageGet, storageSet } from "./storage";

export interface BookmarkedStory extends Story {
  bookmarkedAt: string;
}

export async function getBookmarks(): Promise<BookmarkedStory[]> {
  return storageGet<BookmarkedStory[]>(StorageKeys.BOOKMARKS, []);
}

export async function addBookmark(story: Story): Promise<void> {
  const current = await getBookmarks();
  const exists = current.some((b) => b.id === story.id);
  if (exists) return;
  const updated: BookmarkedStory[] = [
    { ...story, bookmarkedAt: new Date().toISOString() },
    ...current,
  ];
  await storageSet(StorageKeys.BOOKMARKS, updated);
}

export async function removeBookmark(storyId: number): Promise<void> {
  const current = await getBookmarks();
  await storageSet(
    StorageKeys.BOOKMARKS,
    current.filter((b) => b.id !== storyId)
  );
}

export async function isBookmarked(storyId: number): Promise<boolean> {
  const current = await getBookmarks();
  return current.some((b) => b.id === storyId);
}

export async function toggleBookmark(story: Story): Promise<boolean> {
  const bookmarked = await isBookmarked(story.id);
  if (bookmarked) {
    await removeBookmark(story.id);
    return false;
  } else {
    await addBookmark(story);
    return true;
  }
}
