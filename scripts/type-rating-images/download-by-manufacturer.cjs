#!/usr/bin/env node
/**
 * Download aircraft images grouped into manufacturer folders.
 * Searches Wikimedia Commons for manufacturer-owned / house-livery / prototype photos
 * when possible, then falls back to generic aircraft photos.
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');
const BASE_DIR = path.resolve(__dirname, '../../public/images/manufacturers');
const USER_AGENT = 'Mozilla/5.0 (AviationTypeRatingApp/1.0; contact@example.com)';

const MAX_MANUFACTURERS = 20;

if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}

async function fetchJson(url, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    await sleep(attempt * 3000 + 1500); // base delay + backoff
    const data = await new Promise((resolve, reject) => {
      https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
        if (res.statusCode === 429) {
          reject(new Error('rate limited'));
          return;
        }
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https.get(res.headers.location, { headers: { 'User-Agent': USER_AGENT } }, (redirectRes) => {
            if (redirectRes.statusCode === 429) {
              reject(new Error('rate limited'));
              return;
            }
            let data = '';
            redirectRes.on('data', chunk => data += chunk);
            redirectRes.on('end', () => resolve(data));
          }).on('error', reject);
          return;
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject).setTimeout(15000, function() { this.destroy(); reject(new Error('Timeout')); });
    });

    const isRateLimited = typeof data === 'string' && data.toLowerCase().includes('too many requests');
    if (isRateLimited && attempt < retries) {
      console.log(`    -> rate limited, retry ${attempt + 1}/3...`);
      continue;
    }

    try {
      return JSON.parse(data);
    } catch (e) {
      if (attempt < retries) {
        console.log(`    -> invalid JSON response, retry ${attempt + 1}/3...`);
        continue;
      }
      throw new Error('Invalid JSON: ' + data.substring(0, 200));
    }
  }
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'User-Agent': USER_AGENT } }, (redirectRes) => {
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function safeFileName(manufacturer, model) {
  return `${manufacturer}-${model}`.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

function buildQueries(manufacturer, model) {
  const m = manufacturer.toLowerCase();
  const queries = [];

  // Prefer manufacturer-owned / house colors / prototype shots
  if (m === 'airbus') {
    queries.push(`Airbus ${model} F-WW prototype`, `Airbus ${model} manufacturer`, `Airbus ${model} house colors`);
  } else if (m === 'boeing') {
    queries.push(`Boeing ${model} N787BA prototype`, `Boeing ${model} manufacturer`, `Boeing ${model} house colors`);
  } else if (m === 'embraer') {
    queries.push(`Embraer ${model} prototype`, `Embraer ${model} PR-`);
  } else if (m === 'gulfstream') {
    queries.push(`Gulfstream ${model} N650GA`);
  } else if (m === 'dassault falcon') {
    queries.push(`Dassault Falcon ${model} F-WW`);
  } else if (m === 'pilatus') {
    queries.push(`Pilatus ${model} HB-`);
  } else if (m === 'bombardier') {
    queries.push(`Bombardier ${model} C-G`);
  } else if (m === 'atr') {
    queries.push(`ATR ${model} F-WW`);
  } else if (m === 'cessna') {
    queries.push(`Cessna ${model} N`);
  } else if (m === 'beechcraft') {
    queries.push(`Beechcraft ${model} N`);
  } else if (m === 'sikorsky') {
    queries.push(`Sikorsky ${model} N`);
  } else if (m === 'leonardo') {
    queries.push(`Leonardo ${model} I-`);
  } else if (m === 'comac') {
    queries.push(`COMAC ${model} B-001A`);
  } else if (m === 'tecnam') {
    queries.push(`Tecnam ${model} I-`);
  } else if (m === 'piper') {
    queries.push(`Piper ${model} N`);
  } else if (m === 'cirrus') {
    queries.push(`Cirrus ${model} N`);
  } else if (m === 'let') {
    queries.push(`Let ${model} OK-`);
  } else if (m === 'aeroprakt') {
    queries.push(`Aeroprakt ${model} UR-`);
  } else {
    queries.push(`${manufacturer} ${model} prototype`, `${manufacturer} ${model} manufacturer`);
  }

  // Fallback generic aircraft queries
  queries.push(`${manufacturer} ${model} aircraft`, `${model} aircraft`);
  return queries;
}

async function searchWikimedia(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=3&format=json&origin=*`;
  const data = await fetchJson(url);
  if (!data.query?.search?.length) return null;
  return data.query.search.map(r => r.title.replace('File:', ''));
}

async function getImageUrl(fileName) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=800&format=json&origin=*`;
  const data = await fetchJson(url);
  const pages = data.query?.pages;
  if (!pages) return null;
  const page = pages[Object.keys(pages)[0]];
  return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || null;
}

async function downloadForAircraft(manufacturer, model, folderPath) {
  const safeName = safeFileName(manufacturer, model);
  const destPath = path.join(folderPath, `${safeName}.jpg`);

  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    return { path: destPath, status: 'cached' };
  }

  const queries = buildQueries(manufacturer, model);
  for (const query of queries) {
    const fileNames = await searchWikimedia(query);
    if (!fileNames) continue;

    for (const fileName of fileNames) {
      try {
        const imageUrl = await getImageUrl(fileName);
        if (!imageUrl) continue;
        await downloadImage(imageUrl, destPath);
        const stats = fs.statSync(destPath);
        if (stats.size > 1000) {
          return { path: destPath, size: stats.size, status: 'downloaded', query };
        }
        fs.unlinkSync(destPath);
      } catch (e) {
        // continue to next
      }
    }
    await sleep(500);
  }
  return { status: 'failed' };
}

async function main() {
  const content = fs.readFileSync(DATA_FILE, 'utf8');

  const start = content.indexOf('export const aircraftTypeRatings');
  const end = content.indexOf('export const getManufacturerById');
  const section = content.substring(start, end);

  const regex = /\n\s+id:\s+'([^']+)'[\s\S]*?manufacturer_id:\s+'([^']+)'[\s\S]*?model:\s+'([^']+)'/g;
  let match;
  const aircraft = [];
  while ((match = regex.exec(section)) !== null) {
    aircraft.push({ id: match[1], manufacturer_id: match[2], model: match[3] });
  }

  // Group by manufacturer
  const byManufacturer = {};
  for (const a of aircraft) {
    if (!byManufacturer[a.manufacturer_id]) byManufacturer[a.manufacturer_id] = [];
    byManufacturer[a.manufacturer_id].push(a);
  }

  // Limit to MAX_MANUFACTURERS
  const manufacturerIds = Object.keys(byManufacturer).slice(0, MAX_MANUFACTURERS);
  console.log(`Processing ${manufacturerIds.length} manufacturers, ${manufacturerIds.reduce((s, m) => s + byManufacturer[m].length, 0)} aircraft total`);

  const results = [];
  for (const mid of manufacturerIds) {
    const folderPath = path.join(BASE_DIR, mid);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    console.log(`\n📁 ${mid} (${byManufacturer[mid].length} aircraft)`);
    for (const a of byManufacturer[mid]) {
      const res = await downloadForAircraft(mid, a.model, folderPath);
      const relativePath = res.status === 'failed' ? null : `/images/manufacturers/${mid}/${safeFileName(mid, a.model)}.jpg`;
      results.push({ ...a, ...res, relativePath });
      const label = res.status === 'failed' ? '❌ FAILED' : res.status === 'cached' ? '✅ CACHED' : '✅ DOWNLOADED';
      console.log(`  ${label} ${a.model}${res.query ? ` [${res.query}]` : ''}`);
      await sleep(400);
    }
  }

  // Update data file with local paths
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
  console.log(`Folders created under ${BASE_DIR}:`);
  manufacturerIds.forEach(m => console.log(`  - ${m} (${byManufacturer[m].length} aircraft)`));
}

main().catch(err => { console.error(err); process.exit(1); });
