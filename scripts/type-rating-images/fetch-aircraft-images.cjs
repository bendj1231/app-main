#!/usr/bin/env node
/**
 * Fetch aircraft images from Wikimedia Commons API
 * Updates aircraft-manufacturers.ts with real images
 * Usage: node fetch-aircraft-images.js
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');
const USER_AGENT = 'AviationApp/1.0 (type-rating-images@aviation.local)';

// Wikimedia Commons search API
async function searchWikimedia(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=1&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  const data = await res.json();
  if (!data.query?.search?.length) return null;
  return data.query.search[0].title.replace('File:', '');
}

// Get direct image URL from file name
async function getImageUrl(fileName) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=800&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) return null;
  const page = pages[Object.keys(pages)[0]];
  return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || null;
}

// Extract aircraft entries from the data file
function extractAircraftIds(content) {
  const ids = [];
  const regex = /\{\s*id:\s*['"]([^'"]+)['"],\s*manufacturer_id:\s*['"]([^'"]+)['"],\s*model:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push({ id: match[1], manufacturer: match[2], model: match[3] });
  }
  return ids;
}

// Update image field in file content
function updateImageInContent(content, id, newImageUrl) {
  // Find the aircraft entry and update its image field
  const idPattern = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?image:\\s*['"])[^'"]*(['"])`);
  if (idPattern.test(content)) {
    return content.replace(idPattern, `$1${newImageUrl}$2`);
  }
  return content;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Reading aircraft data...');
  let content = fs.readFileSync(DATA_FILE, 'utf8');
  const aircraft = extractAircraftIds(content);
  console.log(`Found ${aircraft.length} aircraft entries`);

  let updated = 0;
  let skipped = 0;

  for (const entry of aircraft) {
    // Skip if already has a real non-Unsplash image
    const hasRealImage = content.includes(`id: '${entry.id}'`) || content.includes(`id: "${entry.id}"`);
    const currentMatch = content.match(new RegExp(`id:\\s*['"]${entry.id}['"][\\s\\S]{0,200}?image:\\s*['"]([^'"]*)['"]`));
    const currentImage = currentMatch ? currentMatch[1] : '';
    
    if (currentImage && !currentImage.includes('unsplash')) {
      console.log(`  [SKIP] ${entry.model} - already has image`);
      skipped++;
      continue;
    }

    const searchQuery = `${entry.manufacturer} ${entry.model} aircraft`;
    console.log(`  [SEARCH] ${entry.model}: "${searchQuery}"`);

    try {
      const fileName = await searchWikimedia(searchQuery);
      if (!fileName) {
        console.log(`    -> No results`);
        continue;
      }
      
      await sleep(500);
      
      const imageUrl = await getImageUrl(fileName);
      if (!imageUrl) {
        console.log(`    -> No image URL`);
        continue;
      }

      content = updateImageInContent(content, entry.id, imageUrl);
      console.log(`    -> ${imageUrl.substring(0, 80)}...`);
      updated++;

      await sleep(500); // rate limiting
    } catch (err) {
      console.error(`    -> ERROR: ${err.message}`);
    }
  }

  fs.writeFileSync(DATA_FILE, content);
  console.log(`\nDone! Updated ${updated}, skipped ${skipped}, total ${aircraft.length}`);
}

main().catch(console.error);
