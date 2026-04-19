export interface Category {
  id: string;
  name: string;
  image?: string;
}

// Matches Supabase stories table schema exactly
export interface Story {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  category_id: string;
  author: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  last_action: string | null;
  last_action_at: string | null;
}

export type ThemeMode = "light" | "dark";

// Helper to get a short excerpt from story content
export const getExcerpt = (content: string, maxLength: number = 80): string => {
  const cleaned = content.replace(/\*\*/g, "").replace(/\n/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).trim() + "...";
};

// Estimated Arabic reading time in minutes (~180 wpm)
export const getReadingTime = (content: string): number => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
};

// Helper to format created_at date for Arabic display
export const formatArabicDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
};
