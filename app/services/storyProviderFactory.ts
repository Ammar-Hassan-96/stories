import { StoryProvider } from "./StoryProvider";
import { JsonStoryProvider } from "./JsonStoryProvider";
import { SupabaseStoryProvider } from "./SupabaseStoryProvider";

// ─── Data Source Switch ──────────────────────────────────────────────────────
//
//  Change this ONE line to swap between offline JSON and online Supabase:
//
//    "json"     → Offline mode (reads from bundled stories.json)
//    "supabase" → Online mode  (fetches from Supabase REST API)
//
type DataSource = "json" | "supabase";

const ACTIVE_SOURCE: DataSource = "supabase";

// ─── Factory ─────────────────────────────────────────────────────────────────

function createStoryProvider(): StoryProvider {
  switch (ACTIVE_SOURCE) {
    case "supabase":
      return SupabaseStoryProvider;
    case "json":
    default:
      return JsonStoryProvider;
  }
}

/**
 * The single story provider instance used throughout the app.
 *
 * To switch from offline → online, change ACTIVE_SOURCE above to "supabase".
 */
export const storyProvider: StoryProvider = createStoryProvider();
