import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageKeys = {
  THEME: "app_theme",
  BOOKMARKS: "app_bookmarks",
  READING_HISTORY: "app_reading_history",
  FONT_SIZE: "app_font_size",

  // === NEW KEYS ===
  OFFLINE_STORIES: "app_offline_stories",
  READING_STATS: "app_reading_stats",
  READING_STREAK: "app_reading_streak",
  READING_ACHIEVEMENTS: "app_reading_achievements",
  AUDIO_SETTINGS: "app_audio_settings",
  READING_PROGRESS: "app_reading_progress",
} as const;

export async function storageGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function storageRemove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {}
}
