#!/usr/bin/env node
/**
 * generate-image-map.js
 *
 * Scans assets/stories/images/ and regenerates app/utils/imageMap.ts
 * with a require() entry for every .jpg file found.
 *
 * Run after re-exporting images:
 *   node scripts/generate-image-map.js
 */

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(PROJECT_ROOT, "assets", "stories", "images");
const OUTPUT_FILE = path.join(PROJECT_ROOT, "app", "utils", "imageMap.ts");

const files = fs
  .readdirSync(IMAGES_DIR)
  .filter((f) => f.endsWith(".jpg"))
  .sort((a, b) => {
    // Sort by category then by numeric id
    const catA = a.replace(/^\d+-/, "");
    const catB = b.replace(/^\d+-/, "");
    if (catA !== catB) return catA.localeCompare(catB);
    return parseInt(a) - parseInt(b);
  });

const lines = files.map((f) => {
  const key = `assets/stories/images/${f}`;
  const requirePath = `../../assets/stories/images/${f}`;
  return `  '${key}': require('${requirePath}'),`;
});

const content = `export const imageMap: Record<string, any> = {\n${lines.join("\n")}\n};\n`;

fs.writeFileSync(OUTPUT_FILE, content, "utf-8");
console.log(`✅ imageMap.ts regenerated with ${files.length} images.`);
