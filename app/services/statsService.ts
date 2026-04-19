import { Story } from "../types";
import { StorageKeys, storageGet, storageSet } from "./storage";

/**
 * Per-day reading entry.
 */
export interface DailyReading {
  date: string;         // YYYY-MM-DD
  minutesRead: number;  // total minutes spent reading that day
  storiesRead: number;  // count of unique stories read that day
  storyIds: number[];   // ids of stories read (for dedup)
}

export interface ReadingStats {
  totalStoriesRead: number;
  totalMinutesRead: number;
  categoryBreakdown: Record<string, number>;  // categoryId -> count
  dailyHistory: DailyReading[];               // last 90 days
  firstReadAt: string | null;
}

export interface ReadingStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;   // YYYY-MM-DD
}

const DEFAULT_STATS: ReadingStats = {
  totalStoriesRead: 0,
  totalMinutesRead: 0,
  categoryBreakdown: {},
  dailyHistory: [],
  firstReadAt: null,
};

const DEFAULT_STREAK: ReadingStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastReadDate: null,
};

// === Utilities ===

function toDateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

// === Stats API ===

export async function getStats(): Promise<ReadingStats> {
  return storageGet<ReadingStats>(StorageKeys.READING_STATS, DEFAULT_STATS);
}

export async function getStreak(): Promise<ReadingStreak> {
  return storageGet<ReadingStreak>(StorageKeys.READING_STREAK, DEFAULT_STREAK);
}

/**
 * Record that a story was completed (scrolled to end).
 * Updates: totals, category breakdown, daily history, streak.
 */
export async function recordStoryCompletion(
  story: Story,
  estimatedMinutes: number
): Promise<{ stats: ReadingStats; streak: ReadingStreak; isFirstToday: boolean }> {
  const today = toDateKey();
  const stats = await getStats();
  const streak = await getStreak();

  // --- Update daily history ---
  const existingDay = stats.dailyHistory.find((d) => d.date === today);
  const alreadyReadToday = existingDay?.storyIds.includes(story.id) ?? false;

  let isFirstToday = false;

  if (existingDay) {
    if (!alreadyReadToday) {
      existingDay.storiesRead += 1;
      existingDay.storyIds.push(story.id);
    }
    existingDay.minutesRead += estimatedMinutes;
  } else {
    isFirstToday = true;
    stats.dailyHistory.unshift({
      date: today,
      minutesRead: estimatedMinutes,
      storiesRead: 1,
      storyIds: [story.id],
    });
    // Keep only last 90 days
    stats.dailyHistory = stats.dailyHistory.slice(0, 90);
  }

  // --- Update totals (only count new stories) ---
  if (!alreadyReadToday) {
    stats.totalStoriesRead += 1;
    stats.categoryBreakdown[story.category_id] =
      (stats.categoryBreakdown[story.category_id] ?? 0) + 1;
  }
  stats.totalMinutesRead += estimatedMinutes;

  if (!stats.firstReadAt) {
    stats.firstReadAt = new Date().toISOString();
  }

  await storageSet(StorageKeys.READING_STATS, stats);

  // --- Update streak ---
  if (streak.lastReadDate !== today) {
    if (!streak.lastReadDate) {
      streak.currentStreak = 1;
    } else {
      const diff = daysBetween(streak.lastReadDate, today);
      if (diff === 1) {
        streak.currentStreak += 1;
      } else if (diff > 1) {
        streak.currentStreak = 1;
      }
      // diff === 0 means same day, leave streak untouched
    }

    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    streak.lastReadDate = today;
    await storageSet(StorageKeys.READING_STREAK, streak);
  }

  return { stats, streak, isFirstToday };
}

/**
 * Get the last N days of reading activity (for chart display).
 * Fills in zero-days so the chart has continuous dates.
 */
export async function getLastNDays(n: number): Promise<DailyReading[]> {
  const stats = await getStats();
  const result: DailyReading[] = [];
  const now = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    const existing = stats.dailyHistory.find((x) => x.date === key);
    result.push(
      existing ?? { date: key, minutesRead: 0, storiesRead: 0, storyIds: [] }
    );
  }
  return result;
}

/**
 * Reset all stats (for debug / privacy).
 */
export async function clearStats(): Promise<void> {
  await storageSet(StorageKeys.READING_STATS, DEFAULT_STATS);
  await storageSet(StorageKeys.READING_STREAK, DEFAULT_STREAK);
}

// === Achievements ===

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;                    // emoji
  threshold: number;
  metric: "stories" | "minutes" | "streak";
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_story", title: "البداية",          description: "اقرأ أول قصة",             icon: "📖", threshold: 1,   metric: "stories" },
  { id: "reader_5",    title: "قارئ مبتدئ",       description: "اقرأ 5 قصص",              icon: "🌱", threshold: 5,   metric: "stories" },
  { id: "reader_25",   title: "قارئ نشيط",         description: "اقرأ 25 قصة",             icon: "🌟", threshold: 25,  metric: "stories" },
  { id: "reader_50",   title: "مدمن قراءة",       description: "اقرأ 50 قصة",             icon: "🏅", threshold: 50,  metric: "stories" },
  { id: "reader_100",  title: "عاشق الحكايات",    description: "اقرأ 100 قصة",            icon: "🏆", threshold: 100, metric: "stories" },
  { id: "streak_3",    title: "الالتزام",          description: "اقرأ 3 أيام متتالية",    icon: "🔥", threshold: 3,   metric: "streak" },
  { id: "streak_7",    title: "أسبوع كامل",       description: "اقرأ 7 أيام متتالية",    icon: "⚡", threshold: 7,   metric: "streak" },
  { id: "streak_30",   title: "شهر قراءة",         description: "اقرأ 30 يوم متتالي",     icon: "💎", threshold: 30,  metric: "streak" },
  { id: "minutes_60",  title: "ساعة قراءة",        description: "اقرأ 60 دقيقة",           icon: "⏱️", threshold: 60,  metric: "minutes" },
  { id: "minutes_300", title: "5 ساعات قراءة",     description: "اقرأ 300 دقيقة",          icon: "📚", threshold: 300, metric: "minutes" },
];

export async function getUnlockedAchievements(): Promise<string[]> {
  return storageGet<string[]>(StorageKeys.READING_ACHIEVEMENTS, []);
}

/**
 * Check for newly unlocked achievements based on current stats+streak.
 * Returns the list of achievements unlocked in THIS call (for celebration).
 */
export async function checkAchievements(): Promise<Achievement[]> {
  const stats = await getStats();
  const streak = await getStreak();
  const unlocked = await getUnlockedAchievements();
  const newlyUnlocked: Achievement[] = [];

  for (const a of ACHIEVEMENTS) {
    if (unlocked.includes(a.id)) continue;
    let value = 0;
    if (a.metric === "stories") value = stats.totalStoriesRead;
    else if (a.metric === "minutes") value = stats.totalMinutesRead;
    else if (a.metric === "streak") value = streak.currentStreak;

    if (value >= a.threshold) {
      newlyUnlocked.push(a);
      unlocked.push(a.id);
    }
  }

  if (newlyUnlocked.length > 0) {
    await storageSet(StorageKeys.READING_ACHIEVEMENTS, unlocked);
  }

  return newlyUnlocked;
}
