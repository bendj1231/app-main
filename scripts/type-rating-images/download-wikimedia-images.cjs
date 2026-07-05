#!/usr/bin/env node
/**
 * Fallback image downloader using Wikimedia Commons API.
 * Used when JetAPI/JetPhotos is blocked by Cloudflare.
 * Searches Wikimedia Commons for aircraft images by model name.
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');
const BASE_DIR = path.resolve(__dirname, '../../public/images/manufacturers');

if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}

const WIKI_USER_AGENT = 'PilotRecognitionBot/1.0 ( aviation-images@example.com )';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function safeFileName(manufacturer, model) {
  return `${manufacturer}-${model}`.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

function fetchJson(url, retries = 3) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json', 'User-Agent': WIKI_USER_AGENT } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 429 && retries > 0) {
          const delay = (4 - retries) * 5000;
          console.log(`    Rate limited, retrying in ${delay}ms...`);
          setTimeout(() => resolve(fetchJson(url, retries - 1)), delay);
          return;
        }
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Invalid JSON: ' + data.substring(0, 200))); }
      });
    }).on('error', reject).setTimeout(15000, function() { this.destroy(); reject(new Error('Timeout')); });
  });
}

function downloadImage(url, destPath, retries = 2) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    options.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Referer': 'https://commons.wikimedia.org/'
    };
    https.get(options, (res) => {
      if (res.statusCode === 429 && retries > 0) {
        const delay = (3 - retries) * 8000;
        console.log(`    Download rate limited, retrying in ${delay}ms...`);
        setTimeout(() => resolve(downloadImage(url, destPath, retries - 1)), delay);
        return;
      }
      if (res.statusCode === 302 && res.headers.location) {
        const redirectOptions = new URL(res.headers.location);
        redirectOptions.headers = options.headers;
        https.get(redirectOptions, (redirectRes) => {
          if (redirectRes.statusCode !== 200) {
            reject(new Error(`HTTP ${redirectRes.statusCode}`));
            return;
          }
          const file = fs.createWriteStream(destPath);
          redirectRes.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
          file.on('error', reject);
        }).on('error', reject);
        return;
      }
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

async function searchWikimedia(model) {
  const query = encodeURIComponent(`${model} aircraft`);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json&origin=*`;
  try {
    const data = await fetchJson(url);
    const pages = data.query?.pages;
    if (!pages) return null;
    const images = Object.values(pages)
      .filter(p => p.imageinfo && p.imageinfo[0])
      .map(p => p.imageinfo[0])
      .filter(img => img.mime?.startsWith('image/'));
    return images.length > 0 ? images : null;
  } catch (e) {
    console.log(`    Wikimedia error for ${model}: ${e.message}`);
    return null;
  }
}

async function downloadForAircraft(id, manufacturer, model, folderPath) {
  const safeName = safeFileName(manufacturer, model);
  const destPath = path.join(folderPath, `${safeName}.jpg`);

  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    return { status: 'cached', path: destPath };
  }

  const images = await searchWikimedia(model);
  if (!images || images.length === 0) {
    return { status: 'no-images' };
  }

  for (const img of images) {
    try {
      const url = img.url;
      if (!url) continue;
      await downloadImage(url, destPath);
      const stats = fs.statSync(destPath);
      if (stats.size > 1000) {
        return { status: 'downloaded', path: destPath, size: stats.size, source: url };
      }
      fs.unlinkSync(destPath);
    } catch (e) {
      // try next image
    }
  }
  return { status: 'failed' };
}

async function main() {
  const content = fs.readFileSync(DATA_FILE, 'utf8');

  const start = content.indexOf('export const aircraftTypeRatings');
  const end = content.indexOf('export const getManufacturerById');
  const section = content.substring(start, end);

  const regex = /\n\s+id:\s+'([^']+)',\n\s+manufacturer_id:\s+'([^']+)',\n\s+model:\s+'([^']+)'/g;
  let match;
  const aircraft = [];
  while ((match = regex.exec(section)) !== null) {
    aircraft.push({ id: match[1], manufacturer_id: match[2], model: match[3] });
  }

  const byManufacturer = {};
  for (const a of aircraft) {
    if (!byManufacturer[a.manufacturer_id]) byManufacturer[a.manufacturer_id] = [];
    byManufacturer[a.manufacturer_id].push(a);
  }

  const filter = process.argv[2];
  let manufacturerIds = Object.keys(byManufacturer);
  if (filter) {
    manufacturerIds = manufacturerIds.filter(id => id.toLowerCase().includes(filter.toLowerCase()));
    console.log(`Filtering to ${manufacturerIds.length} manufacturer(s) matching '${filter}'...`);
  }
  console.log(`Processing ${manufacturerIds.length} manufacturers...`);

  const results = [];
  for (const mid of manufacturerIds) {
    const folderPath = path.join(BASE_DIR, mid);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    console.log(`\n📁 ${mid} (${byManufacturer[mid].length} aircraft)`);
    for (const a of byManufacturer[mid]) {
      const res = await downloadForAircraft(a.id, mid, a.model, folderPath);
      const relativePath = res.status === 'cached' || res.status === 'downloaded'
        ? `/images/manufacturers/${mid}/${safeFileName(mid, a.model)}.jpg`
        : null;
      results.push({ ...a, ...res, relativePath });
      const label = res.status === 'cached' ? '✅ CACHED' : res.status === 'downloaded' ? '✅ DOWNLOADED' : '❌ ' + res.status.toUpperCase();
      console.log(`  ${label} ${a.model}`);
      await sleep(5000);
    }
  }

  // Update data file
  let updatedContent = content;
  let updated = 0;
  for (const r of results) {
    if (!r.relativePath) continue;
    const imgRegex = new RegExp(`(id:\\s*'${r.id}'[\\s\\S]{0,300}image:\\s*')[^']*(')`);
    if (imgRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(imgRegex, `$1${r.relativePath}$2`);
      updated++;
    }
  }
  fs.writeFileSync(DATA_FILE, updatedContent);

  console.log(`\nDone! Updated ${updated} aircraft image paths in ${DATA_FILE}.`);
  console.log(`Manufacturer folders under ${BASE_DIR}:`);
  manufacturerIds.forEach(m => {
    const downloaded = results.filter(r => r.manufacturer_id === m && r.status === 'downloaded').length;
    const cached = results.filter(r => r.manufacturer_id === m && r.status === 'cached').length;
    const missing = results.filter(r => r.manufacturer_id === m && !r.relativePath).length;
    console.log(`  - ${m}: ${downloaded} downloaded, ${cached} cached, ${missing} missing`);
  });
}

main().catch(err => { console.error(err); process.exit(1); });
