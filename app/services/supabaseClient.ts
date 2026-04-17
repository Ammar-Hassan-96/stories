import { Story } from "../types";

const SUPABASE_URL = "https://nxlgtyabymdqaaxwxexq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_JOREjdBXwxruBHe0MYDesw_nBBFf4e3";
const PAGE_SIZE = 15;

const supabaseHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "accept-profile": "public",
};

export interface FetchStoriesResult {
  stories: Story[];
  hasMore: boolean;
}

/**
 * Fetch paginated stories for a given category from Supabase.
 * @param categoryId - The category to filter by
 * @param page - 0-based page index
 * @param pageSize - Number of items per page (default 15)
 */
export async function fetchStoriesFromSupabase(
  categoryId: string,
  page: number,
  pageSize: number = PAGE_SIZE
): Promise<FetchStoriesResult> {
  const offset = page * pageSize;
  // Fetch pageSize + 1 to detect if there are more pages
  const limit = pageSize + 1;

  const params = new URLSearchParams({
    select: "*",
    category_id: `eq.${categoryId}`,
    is_published: "eq.true",
    order: "display_order.desc,created_at.desc",
    offset: String(offset),
    limit: String(limit),
  });

  const url = `${SUPABASE_URL}/rest/v1/stories?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: supabaseHeaders,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase error ${response.status}: ${errorText}`);
  }

  const data: Story[] = await response.json();

  const hasMore = data.length > pageSize;
  const stories = hasMore ? data.slice(0, pageSize) : data;

  return { stories, hasMore };
}

/**
 * Fetch a "featured story of the day" — picks a recent published story
 * deterministically based on today's date so it stays consistent all day.
 */
export async function fetchFeaturedStory(): Promise<Story | null> {
  const params = new URLSearchParams({
    select: "*",
    is_published: "eq.true",
    order: "created_at.desc",
    limit: "40",
  });

  const url = `${SUPABASE_URL}/rest/v1/stories?${params.toString()}`;

  try {
    const response = await fetch(url, { method: "GET", headers: supabaseHeaders });
    if (!response.ok) return null;
    const data: Story[] = await response.json();
    if (data.length === 0) return null;
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31 + today.getFullYear() * 366;
    return data[seed % data.length];
  } catch {
    return null;
  }
}

/**
 * Fetch a single story by its ID from Supabase.
 */
export async function fetchStoryByIdFromSupabase(id: number): Promise<Story | null> {
  const params = new URLSearchParams({
    select: "*",
    id: `eq.${id}`,
    limit: "1",
  });

  const url = `${SUPABASE_URL}/rest/v1/stories?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: supabaseHeaders,
  });

  if (!response.ok) {
    throw new Error(`Supabase error ${response.status}`);
  }

  const data: Story[] = await response.json();
  return data.length > 0 ? data[0] : null;
}
