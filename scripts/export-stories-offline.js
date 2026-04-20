#!/usr/bin/env node

/**
 * export-stories-offline.js
 *
 * Fetches all published stories from Supabase, downloads & compresses images
 * to ≤100KB, and saves everything locally for offline use.
 *
 * Usage:  node scripts/export-stories-offline.js
 * Output: assets/stories/stories.json  +  assets/stories/images/*.jpg
 *
 * Requirements: Node.js 18+, ImageMagick (`convert` command)
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");
const { execSync } = require("child_process");

// ─── Configuration ───────────────────────────────────────────────────────────

const SUPABASE_URL = "https://nxlgtyabymdqaaxwxexq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_JOREjdBXwxruBHe0MYDesw_nBBFf4e3";
const PAGE_SIZE = 100; // Larger pages for bulk export (fewer requests)
const MAX_IMAGE_BYTES = 100 * 1024; // 100 KB
const CONCURRENCY = 5; // Parallel image downloads
const MAX_RETRIES = 3;

const CATEGORIES = ["drama", "horror", "kids", "sci-fi", "thriller", "islamic", "love"];

// Resolve paths relative to project root (one level up from scripts/)
const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "assets", "stories");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const JSON_OUTPUT = path.join(OUTPUT_DIR, "stories.json");
const TEMP_DIR = path.join(PROJECT_ROOT, "scripts", ".tmp-images");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg) {
  const ts = new Date().toLocaleTimeString("en-US", { hour12: false });
  console.log(`[${ts}] ${msg}`);
}

function logProgress(current, total, label) {
  const pct = Math.round((current / total) * 100);
  const bar = "█".repeat(Math.round(pct / 4)) + "░".repeat(25 - Math.round(pct / 4));
  process.stdout.write(`\r  ${bar} ${pct}% (${current}/${total}) ${label}`);
  if (current === total) process.stdout.write("\n");
}

/**
 * Fetch JSON from a URL (supports https and http).
 */
function fetchJSON(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        return fetchJSON(res.headers.location, headers).then(resolve, reject);
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        let body = "";
        res.on("data", (d) => (body += d));
        res.on("end", () => reject(new Error(`HTTP ${res.statusCode}: ${body}`)));
        return;
      }
      let body = "";
      res.on("data", (d) => (body += d));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message}`));
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

/**
 * Download a file from URL to a local path.
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve, reject);
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`Download failed: HTTP ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
      file.on("error", (err) => {
        fs.unlinkSync(destPath);
        reject(err);
      });
    });
    req.on("error", reject);
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error("Download timeout"));
    });
  });
}

/**
 * Compress an image to ≤ MAX_IMAGE_BYTES using ImageMagick.
 * Tries progressively lower quality settings until size target is met.
 */
function compressImage(inputPath, outputPath) {
  const qualities = [80, 70, 60, 50, 40, 30, 20];

  for (const quality of qualities) {
    try {
      execSync(
        `convert "${inputPath}" -resize "600x870^" -gravity center -crop "600x870+0+0" +repage -quality ${quality} -strip "${outputPath}"`,
        { stdio: "pipe" }
      );
      const stat = fs.statSync(outputPath);
      if (stat.size <= MAX_IMAGE_BYTES) {
        return { size: stat.size, quality };
      }
    } catch (err) {
      // If convert fails, try next quality or bail
      continue;
    }
  }

  // Last resort: aggressive resize + lowest quality
  try {
    execSync(
      `convert "${inputPath}" -resize "400x400>" -quality 20 -strip "${outputPath}"`,
      { stdio: "pipe" }
    );
    const stat = fs.statSync(outputPath);
    return { size: stat.size, quality: 20 };
  } catch {
    // If all fails, just copy the original
    fs.copyFileSync(inputPath, outputPath);
    const stat = fs.statSync(outputPath);
    return { size: stat.size, quality: -1 };
  }
}

/**
 * Process images with concurrency control.
 */
async function processWithConcurrency(items, concurrency, fn) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Retry wrapper for network operations.
 */
async function withRetry(fn, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = attempt * 1000;
      log(`  ⚠ Retry ${attempt}/${retries} after ${delay}ms: ${err.message}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║     📚 Stories Offline Export                    ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  // 0. Check ImageMagick
  try {
    execSync("convert --version", { stdio: "pipe" });
  } catch {
    console.error("❌ ImageMagick not found. Install it: sudo apt install imagemagick");
    process.exit(1);
  }

  // 1. Create directories
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.mkdirSync(TEMP_DIR, { recursive: true });
  log("📁 Output directories ready");

  // 2. Fetch all stories from all categories
  log("📡 Fetching stories from Supabase...\n");

  const allStories = [];
  const seenIds = new Set();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "accept-profile": "public",
  };

  for (const categoryId of CATEGORIES) {
    let page = 0;
    let categoryCount = 0;

    while (true) {
      const offset = page * PAGE_SIZE;
      const params = new URLSearchParams({
        select: "*",
        category_id: `eq.${categoryId}`,
        is_published: "eq.true",
        order: "display_order.desc,created_at.desc",
        offset: String(offset),
        limit: String(PAGE_SIZE),
      });

      const url = `${SUPABASE_URL}/rest/v1/stories?${params.toString()}`;
      const data = await withRetry(() => fetchJSON(url, headers));

      for (const story of data) {
        if (!seenIds.has(story.id)) {
          seenIds.add(story.id);
          allStories.push(story);
          categoryCount++;
        }
      }

      if (data.length < PAGE_SIZE) break;
      page++;
    }

    log(`  ✅ ${categoryId}: ${categoryCount} stories`);
  }

  console.log("");
  log(`📊 Total stories fetched: ${allStories.length}`);

  // 3. Download & compress images
  const storiesWithImages = allStories.filter((s) => s.image_url);
  log(`🖼  Stories with images: ${storiesWithImages.length}\n`);

  let processed = 0;
  let compressed = 0;
  let skipped = 0;
  let failed = 0;

  await processWithConcurrency(storiesWithImages, CONCURRENCY, async (story) => {
    const filename = `${story.id}-${story.category_id}.jpg`;
    const outputPath = path.join(IMAGES_DIR, filename);
    const tempPath = path.join(TEMP_DIR, `${story.id}_temp`);

    try {
      // Download
      await withRetry(() => downloadFile(story.image_url, tempPath));

      // Compress
      const result = compressImage(tempPath, outputPath);
      compressed++;

      // Update story's image_url to local path
      story.image_url = `assets/stories/images/${filename}`;

      // Clean up temp
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch (err) {
      failed++;
      log(`  ❌ Failed: story ${story.id} (${story.title}): ${err.message}`);
      // Keep original URL if download/compress fails
    }

    processed++;
    logProgress(processed, storiesWithImages.length, "images processed");
  });

  console.log("");
  log(`✅ Compressed: ${compressed} | ❌ Failed: ${failed}`);

  // 4. Write final JSON
  // Sort by category then display_order for consistency
  allStories.sort((a, b) => {
    if (a.category_id !== b.category_id) return a.category_id.localeCompare(b.category_id);
    return b.display_order - a.display_order;
  });

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(allStories, null, 2), "utf-8");
  log(`📄 JSON written: ${JSON_OUTPUT}`);
  log(`   Stories: ${allStories.length}`);

  // 5. Clean up temp directory
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  // 6. Summary
  const imageFiles = fs.readdirSync(IMAGES_DIR).filter((f) => f.endsWith(".jpg"));
  const totalImgSize = imageFiles.reduce((sum, f) => {
    return sum + fs.statSync(path.join(IMAGES_DIR, f)).size;
  }, 0);
  const maxImgSize = imageFiles.reduce((max, f) => {
    const s = fs.statSync(path.join(IMAGES_DIR, f)).size;
    return s > max ? s : max;
  }, 0);

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║     ✅ Export Complete!                           ║");
  console.log("╠══════════════════════════════════════════════════╣");
  console.log(`║  Stories:     ${String(allStories.length).padEnd(35)}║`);
  console.log(`║  Images:      ${String(imageFiles.length).padEnd(35)}║`);
  console.log(`║  Total size:  ${(totalImgSize / 1024 / 1024).toFixed(2).padEnd(32)}MB ║`);
  console.log(`║  Max image:   ${(maxImgSize / 1024).toFixed(1).padEnd(32)}KB ║`);
  console.log(`║  JSON:        ${path.relative(PROJECT_ROOT, JSON_OUTPUT).padEnd(35)}║`);
  console.log(`║  Images dir:  ${path.relative(PROJECT_ROOT, IMAGES_DIR).padEnd(35)}║`);
  console.log("╚══════════════════════════════════════════════════╝\n");
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err);
  process.exit(1);
});
