#!/usr/bin/env node

/**
 * Image Conversion Script
 * Converts JPEG auth images to WebP for optimized web delivery
 * Usage: node scripts/convert-images.mjs
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, "..", "public", "brand");
const sourceDir = path.join(__dirname, "..", "assets-source");

// Ensure source directory exists
if (!fs.existsSync(sourceDir)) {
  fs.mkdirSync(sourceDir, { recursive: true });
}

const conversions = [
  {
    source: "auth-bg-desktop.jfif",
    output: "auth-bg-desktop.webp",
    resize: { width: 1920, withoutEnlargement: true },
    quality: 80,
  },
  {
    source: "auth-bg-mobile.jfif",
    output: "auth-bg-mobile.webp",
    resize: { width: 1080, withoutEnlargement: true },
    quality: 80,
  },
  {
    source: "ami-koko-wave.jfif",
    output: "ami-koko-wave.webp",
    resize: { withoutEnlargement: true, fit: "inside", width: 1000, height: 1000 },
    quality: 85,
  },
  {
    source: "ami-koko-welcome.jfif",
    output: "ami-koko-welcome.webp",
    resize: { withoutEnlargement: true, fit: "inside", width: 1000, height: 1000 },
    quality: 85,
  },
];

async function convertImages() {
  console.log("🖼️  Converting images to WebP...\n");

  for (const conv of conversions) {
    const sourcePath = path.join(brandDir, conv.source);
    const outputPath = path.join(brandDir, conv.output);
    const backupPath = path.join(sourceDir, conv.source);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️  Source not found: ${conv.source}`);
      continue;
    }

    try {
      // Backup original JPEG
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(sourcePath, backupPath);
        console.log(`✓ Backed up: ${conv.source} → /assets-source/${conv.source}`);
      }

      // Convert to WebP
      const image = sharp(sourcePath);
      const resized = image.resize(conv.resize.width, conv.resize.height, {
        withoutEnlargement: true,
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      });

      await resized
        .webp({ quality: conv.quality })
        .toFile(outputPath);

      // Get file size
      const stats = fs.statSync(outputPath);
      const sizeKb = (stats.size / 1024).toFixed(2);

      if (stats.size > 250 * 1024) {
        console.warn(
          `⚠️  ${conv.output}: ${sizeKb} KB (over 250 KB limit, attempting re-compression...)`
        );

        // Re-compress with lower quality
        const newQuality = Math.max(conv.quality - 10, 60);
        await sharp(sourcePath)
          .resize(conv.resize.width, conv.resize.height, {
            withoutEnlargement: true,
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .webp({ quality: newQuality })
          .toFile(outputPath);

        const newStats = fs.statSync(outputPath);
        const newSizeKb = (newStats.size / 1024).toFixed(2);
        console.log(`   ✓ Re-compressed to ${newSizeKb} KB (quality ${newQuality})`);
      } else {
        console.log(`✓ ${conv.output}: ${sizeKb} KB`);
      }
    } catch (err) {
      console.error(`✗ Error converting ${conv.source}: ${err.message}`);
    }
  }

  console.log("\n✅ Image conversion complete!");
}

convertImages().catch((err) => {
  console.error("❌ Conversion failed:", err);
  process.exit(1);
});
