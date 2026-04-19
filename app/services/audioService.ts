import * as Speech from "expo-speech";
import { StorageKeys, storageGet, storageSet } from "./storage";

export interface AudioSettings {
  rate: number;       // 0.5 - 1.5 (1 = normal)
  pitch: number;      // 0.5 - 2.0 (1 = normal)
  voice: string | null;
  language: string;   // ar-SA / ar-EG
}

const DEFAULT_SETTINGS: AudioSettings = {
  rate: 1.0,
  pitch: 1.0,
  voice: null,
  language: "ar-SA",
};

export async function getAudioSettings(): Promise<AudioSettings> {
  return storageGet<AudioSettings>(StorageKeys.AUDIO_SETTINGS, DEFAULT_SETTINGS);
}

export async function saveAudioSettings(settings: AudioSettings): Promise<void> {
  await storageSet(StorageKeys.AUDIO_SETTINGS, settings);
}

/**
 * Get available Arabic voices on the device.
 */
export async function getArabicVoices() {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.filter((v) => v.language?.startsWith("ar"));
  } catch {
    return [];
  }
}

/**
 * Returns true if the device has at least one Arabic TTS voice installed.
 */
export async function isArabicTTSAvailable(): Promise<boolean> {
  const voices = await getArabicVoices();
  return voices.length > 0;
}

// Arabic language codes to try in order
const ARABIC_LANG_CODES = ["ar-SA", "ar-EG", "ar-001", "ar"];

/**
 * Pick the best Arabic voice/language pair available on this device.
 * Returns { voice, language } to be used with Speech.speak.
 */
async function resolveBestArabicVoice(
  preferredVoice: string | null
): Promise<{ voice: string | undefined; language: string }> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const arabicVoices = voices.filter((v) => v.language?.startsWith("ar"));

    if (arabicVoices.length === 0) {
      // No Arabic voices — pass a language code and hope for the best
      return { voice: undefined, language: "ar" };
    }

    // Use the user-preferred voice if it's still available
    if (preferredVoice) {
      const found = arabicVoices.find((v) => v.identifier === preferredVoice);
      if (found) return { voice: found.identifier, language: found.language };
    }

    // Prefer sa-SA voices, then any Arabic voice
    for (const code of ARABIC_LANG_CODES) {
      const match = arabicVoices.find((v) => v.language === code);
      if (match) return { voice: match.identifier, language: match.language };
    }

    const first = arabicVoices[0];
    return { voice: first.identifier, language: first.language };
  } catch {
    return { voice: undefined, language: "ar-SA" };
  }
}

// === Narration state (module singleton) ===

interface NarrationCallbacks {
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: any) => void;
  onChunkProgress?: (current: number, total: number) => void;
}

let activeChunkIndex = 0;
let activeChunks: string[] = [];
let activeCallbacks: NarrationCallbacks = {};
let isNarrating = false;
let stopRequested = false;

/**
 * Split long content into speakable chunks.
 * expo-speech has a ~4000 char limit on some platforms, we go smaller.
 */
function splitIntoChunks(text: string, maxLen: number = 500): string[] {
  const clean = text.replace(/\*\*/g, "").trim();
  const chunks: string[] = [];
  const sentences = clean.split(/(?<=[.!؟?])\s+/);
  let current = "";

  for (const s of sentences) {
    if ((current + " " + s).length > maxLen && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = current ? current + " " + s : s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

let resolvedVoice: string | undefined = undefined;
let resolvedLanguage: string = "ar-SA";

async function speakChunk(index: number, settings: AudioSettings) {
  if (stopRequested || index >= activeChunks.length) {
    if (!stopRequested) activeCallbacks.onDone?.();
    isNarrating = false;
    return;
  }

  activeChunkIndex = index;
  activeCallbacks.onChunkProgress?.(index, activeChunks.length);

  const chunk = activeChunks[index];

  Speech.speak(chunk, {
    language: resolvedLanguage,
    rate: settings.rate,
    pitch: settings.pitch,
    voice: resolvedVoice,
    onDone: () => {
      speakChunk(index + 1, settings);
    },
    onStopped: () => {
      activeCallbacks.onStopped?.();
      isNarrating = false;
    },
    onError: (err) => {
      activeCallbacks.onError?.(err);
      isNarrating = false;
    },
  });
}

/**
 * Start narrating a piece of text.
 */
export async function startNarration(
  text: string,
  callbacks: NarrationCallbacks = {}
): Promise<void> {
  if (isNarrating) {
    await stopNarration();
  }
  const settings = await getAudioSettings();

  // Resolve the best available Arabic voice before starting
  const best = await resolveBestArabicVoice(settings.voice);
  resolvedVoice = best.voice;
  resolvedLanguage = best.language;

  activeChunks = splitIntoChunks(text);
  activeCallbacks = callbacks;
  activeChunkIndex = 0;
  stopRequested = false;
  isNarrating = true;
  callbacks.onStart?.();
  speakChunk(0, settings);
}

/**
 * Stop narration immediately.
 */
export async function stopNarration(): Promise<void> {
  stopRequested = true;
  isNarrating = false;
  try {
    await Speech.stop();
  } catch {}
}

/**
 * Pause narration (expo-speech has no native pause on all platforms, so we stop).
 */
export async function pauseNarration(): Promise<void> {
  await stopNarration();
}

/**
 * Resume narration from where we stopped.
 */
export async function resumeNarration(callbacks?: NarrationCallbacks): Promise<void> {
  if (activeChunks.length === 0) return;
  const settings = await getAudioSettings();
  if (callbacks) activeCallbacks = callbacks;
  stopRequested = false;
  isNarrating = true;
  speakChunk(activeChunkIndex, settings);
}

export function isCurrentlyNarrating(): boolean {
  return isNarrating;
}
