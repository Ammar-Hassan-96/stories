import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Layout constants derived from screen dimensions. */
export const COVER_HEIGHT = Math.round(SCREEN_WIDTH * 0.4);
export const BOOK_MARGIN = 16;
export const BOOK_WIDTH = SCREEN_WIDTH - BOOK_MARGIN * 2;

/** Represents one "page" in the paginated reader. */
export interface PageData {
  type: "title" | "chapter";
  heading?: string;
  paragraphs: string[];
}

/** Category accent color palette for the book theme. */
export const categoryAccent: Record<
  string,
  { primary: string; light: string; dark: string }
> = {
  horror: { primary: "#8B0000", light: "#FFF0F0", dark: "#2C0A0A" },
  love: { primary: "#C2185B", light: "#FFF0F5", dark: "#2C0A18" },
  "sci-fi": { primary: "#1565C0", light: "#F0F4FF", dark: "#0A1228" },
  thriller: { primary: "#E65100", light: "#FFF3EE", dark: "#2C1000" },
  islamic: { primary: "#1B5E20", light: "#F0FFF2", dark: "#061A08" },
  drama: { primary: "#4A148C", light: "#F5F0FF", dark: "#140A2C" },
  kids: { primary: "#F57F17", light: "#FFFBF0", dark: "#2C1E00" },
};

/** Default accent used when category is unknown. */
export const defaultAccent = {
  primary: "#8B5A2B",
  light: "#FDF6E3",
  dark: "#2C1E10",
};

/**
 * Splits raw story content into pages by heading markers (**heading**).
 *
 * Each **heading** starts a new chapter page containing that heading
 * plus all paragraphs until the next heading.
 * If there are no headings, all paragraphs go into a single page.
 */
export function splitIntoPages(content: string): PageData[] {
  // Regex: captures **heading** (group 1) then all text until next ** or end (group 2).
  // The 'gs' flags: g = global (find all matches), s = dotAll (. matches newlines too).
  const regex = /\*\*([^*]+)\*\*(.*?)(?=\*\*|$)/gs;

  const pages: PageData[] = [];

  // ── Step 1: Capture any text that appears BEFORE the first ** heading ──
  const firstStarIdx = content.indexOf("**");
  if (firstStarIdx > 0) {
    const beforeText = content.substring(0, firstStarIdx).trim();
    if (beforeText.length > 0) {
      const paragraphs = beforeText
        .split(/\n\n|\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
      if (paragraphs.length > 0) {
        pages.push({ type: "chapter", paragraphs });
      }
    }
  }

  // ── Step 2: Extract all **heading** + content pairs ──
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const heading = match[1].trim();
    const rawContent = match[2].trim();

    // Split the content block into paragraphs by line breaks
    const paragraphs = rawContent
      .split(/\n\n|\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Always create a page for the heading, even if no paragraphs follow it
    pages.push({
      type: "chapter",
      heading,
      paragraphs,
    });
  }

  // ── Fallback: if no **headings** were found, treat the entire text as one page ──
  if (pages.length === 0 && content.trim().length > 0) {
    const paragraphs = content
      .split(/\n\n|\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    pages.push({ type: "chapter", paragraphs });
  }

  return pages;
}
