import { useState, useEffect, useCallback } from "react";
import {
  ReadingStats,
  ReadingStreak,
  DailyReading,
  getStats,
  getStreak,
  getLastNDays,
  getUnlockedAchievements,
  ACHIEVEMENTS,
  Achievement,
} from "../services/statsService";

export function useReadingStats() {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [streak, setStreak] = useState<ReadingStreak | null>(null);
  const [last30Days, setLast30Days] = useState<DailyReading[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [s, st, days, unlocked] = await Promise.all([
      getStats(),
      getStreak(),
      getLastNDays(30),
      getUnlockedAchievements(),
    ]);
    setStats(s);
    setStreak(st);
    setLast30Days(days);
    setUnlockedIds(unlocked);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const achievements = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: unlockedIds.includes(a.id),
  }));

  return { stats, streak, last30Days, achievements, loading, refresh };
}
