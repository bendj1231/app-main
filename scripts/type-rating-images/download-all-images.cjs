#!/usr/bin/env node
/**
 * Download real aircraft images from Wikimedia Commons
 * Searches for each aircraft model, downloads the image, and updates data file to use local paths
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');
const IMAGE_DIR = path.resolve(__dirname, '../../public/images/aircraft');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

// Ensure image directory exists
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Invalid JSON: ' + data.substring(0, 200))); }
      });
    }).on('error', reject).setTimeout(15000, function() { this.destroy(); reject(new Error('Timeout')); });
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject).setTimeout(30000, function() { this.destroy(); reject(new Error('Download timeout')); });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchAndDownloadImage(manufacturer, model, id) {
  // Check if we already have this image locally
  const safeName = `${manufacturer}-${model}`.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const destPath = path.join(IMAGE_DIR, `${safeName}.jpg`);
  
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    console.log(`  [CACHED] ${model}`);
    return `/images/aircraft/${safeName}.jpg`;
  }
  
  // Search Wikimedia Commons
  const searchQuery = `${manufacturer} ${model} aircraft`;
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&srnamespace=6&srlimit=3&format=json&origin=*`;
  
  try {
    const searchData = await fetchJson(searchUrl);
    if (!searchData.query?.search?.length) {
      console.log(`  [NO RESULTS] ${model}`);
      return null;
    }
    
    // Try each result
    for (const result of searchData.query.search) {
      const fileName = result.title.replace('File:', '');
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=800&format=json&origin=*`;
      
      await sleep(500);
      
      const infoData = await fetchJson(infoUrl);
      const pages = infoData.query?.pages;
      if (!pages) continue;
      const page = pages[Object.keys(pages)[0]];
      const info = page?.imageinfo?.[0];
      
      // Try thumburl first, then full url
      const imageUrl = info?.thumburl || info?.url;
      if (!imageUrl) continue;
      
      // Download the image
      console.log(`  [DOWNLOAD] ${model} from ${imageUrl.substring(0, 60)}...`);
      await downloadImage(imageUrl, destPath);
      
      // Verify download
      const stats = fs.statSync(destPath);
      if (stats.size > 1000) {
        console.log(`  [OK] ${model} (${Math.round(stats.size/1024)}KB)`);
        return `/images/aircraft/${safeName}.jpg`;
      } else {
        fs.unlinkSync(destPath);
        console.log(`  [TOO SMALL] ${model}`);
      }
    }
    
    console.log(`  [FAILED] ${model} - no valid images found`);
    return null;
  } catch (e) {
    console.log(`  [ERROR] ${model}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('Starting aircraft image download...');
  let content = fs.readFileSync(DATA_FILE, 'utf8');
  
  // Extract aircraft entries
  const start = content.indexOf('export const aircraftTypeRatings');
  const end = content.indexOf('export const getManufacturerById');
  const section = content.substring(start, end);
  
  const regex = /\n\s+id:\s+'([^']+)'[\s\S]*?manufacturer_id:\s+'([^']+)'[\s\S]*?model:\s+'([^']+)'[\s\S]*?image:\s+'([^']+)'/g;
  let match;
  const aircraft = [];
  while ((match = regex.exec(section)) !== null) {
    aircraft.push({ id: match[1], manufacturer: match[2], model: match[3], image: match[4] });
  }
  
  console.log(`Found ${aircraft.length} aircraft entries`);
  
  let updated = 0;
  let failed = 0;
  let skipped = 0;
  
  for (const entry of aircraft) {
    // Skip if already has a local image path
    if (entry.image.startsWith('/images/aircraft/')) {
      skipped++;
      continue;
    }
    
    const localPath = await searchAndDownloadImage(entry.manufacturer, entry.model, entry.id);
    
    if (localPath) {
      // Update the data file
      const imgRegex = new RegExp(`(id:\\s*'${entry.id}'[\\s\\S]{0,300}image:\\s*')[^']*(')`);
      if (imgRegex.test(content)) {
        content = content.replace(imgRegex, `$1${localPath}$2`);
        updated++;
      }
    } else {
      failed++;
    }
    
    await sleep(800); // Be nice to Wikimedia API
  }
  
  fs.writeFileSync(DATA_FILE, content);
  console.log(`\nDone! Updated ${updated}, skipped ${skipped}, failed ${failed}, total ${aircraft.length}`);
}

main().catch(console.error);
