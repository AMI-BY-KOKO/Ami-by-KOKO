import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, '../public/brand');

const jfifFiles = fs.readdirSync(brandDir).filter(f => f.endsWith('.jfif'));

console.log(`Found ${jfifFiles.length} JFIF files. Converting to JPG...`);

for (const file of jfifFiles) {
  const inputPath = path.join(brandDir, file);
  const outputPath = path.join(brandDir, file.replace('.jfif', '.jpg'));
  
  console.log(`Converting: ${file} → ${path.basename(outputPath)}`);
  
  try {
    await sharp(inputPath)
      .jpeg({ quality: 90, progressive: true })
      .toFile(outputPath);
    console.log(`✓ ${path.basename(outputPath)} created`);
  } catch (err) {
    console.error(`✗ Error converting ${file}:`, err.message);
  }
}

console.log('Conversion complete!');
