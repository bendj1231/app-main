const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = '/Users/bowler/Documents/apps/app-main/public';

async function* findImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* findImages(fullPath);
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      yield fullPath;
    }
  }
}

async function compress() {
  const stats = { processed: 0, skipped: 0, saved: 0, errors: 0 };
  
  for await (const imgPath of findImages(PUBLIC_DIR)) {
    const original = await fs.stat(imgPath);
    const ext = path.extname(imgPath).toLowerCase();
    
    try {
      let buffer;
      if (ext === '.png') {
        buffer = await sharp(imgPath)
          .png({ quality: 80, compressionLevel: 9 })
          .toBuffer();
      } else {
        buffer = await sharp(imgPath)
          .jpeg({ quality: 70, progressive: true, mozjpeg: true })
          .toBuffer();
      }
      
      if (buffer.length < original.size * 0.9) {
        await fs.writeFile(imgPath, buffer);
        const saved = original.size - buffer.length;
        stats.saved += saved;
        stats.processed++;
        console.log(`✓ ${imgPath.replace(PUBLIC_DIR, '')}: ${(original.size/1024/1024).toFixed(1)}MB → ${(buffer.length/1024/1024).toFixed(1)}MB`);
      } else {
        stats.skipped++;
      }
    } catch (err) {
      stats.errors++;
      console.log(`✗ ${imgPath}: ${err.message}`);
    }
  }
  
  console.log(`\nDone: ${stats.processed} compressed, ${stats.skipped} skipped, ${stats.errors} errors, ${(stats.saved/1024/1024).toFixed(1)}MB saved`);
}

compress();
