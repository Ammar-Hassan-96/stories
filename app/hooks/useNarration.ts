import { useState, useEffect, useRef, useCallback } from "react";
import {
  startNarration,
  stopNarration,
  pauseNarration,
  resumeNarration,
  getAudioSettings,
  saveAudioSettings,
  AudioSettings,
} from "../services/audioService";

export type NarrationStatus = "idle" | "playing" | "paused";

export function useNarration(text: string) {
  const [status, setStatus] = useState<NarrationStatus>("idle");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [settings, setSettings] = useState<AudioSettings | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    getAudioSettings().then(setSettings);
    return () => {
      isMounted.current = false;
      stopNarration();
    };
  }, []);

  const play = useCallback(async () => {
    if (status === "paused") {
      setStatus("playing");
      await resumeNarration({
        onDone: () => isMounted.current && setStatus("idle"),
        onStopped: () => isMounted.current && setStatus("idle"),
        onChunkProgress: (c, t) =>
          isMounted.current && setProgress({ current: c, total: t }),
      });
      return;
    }

    setStatus("playing");
    await startNarration(text, {
      onStart: () => isMounted.current && setStatus("playing"),
      onDone: () => {
        if (isMounted.current) {
          setStatus("idle");
          setProgress({ current: 0, total: 0 });
        }
      },
      onStopped: () => isMounted.current && setStatus("idle"),
      onError: () => isMounted.current && setStatus("idle"),
      onChunkProgress: (c, t) =>
        isMounted.current && setProgress({ current: c, total: t }),
    });
  }, [text, status]);

  const pause = useCallback(async () => {
    await pauseNarration();
    setStatus("paused");
  }, []);

  const stop = useCallback(async () => {
    await stopNarration();
    setStatus("idle");
    setProgress({ current: 0, total: 0 });
  }, []);

  const updateSettings = useCallback(async (updates: Partial<AudioSettings>) => {
    if (!settings) return;
    const next = { ...settings, ...updates };
    setSettings(next);
    await saveAudioSettings(next);
  }, [settings]);

  return { status, progress, settings, play, pause, stop, updateSettings };
}
