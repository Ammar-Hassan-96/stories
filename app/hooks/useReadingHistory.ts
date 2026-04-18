import { useState, useEffect, useCallback } from "react";
import { HistoryEntry, getHistory, clearHistory } from "../services/historyService";

export function useReadingHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getHistory();
    setHistory(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const clear = useCallback(async () => {
    await clearHistory();
    setHistory([]);
  }, []);

  return { history, loading, refresh, clear };
}
