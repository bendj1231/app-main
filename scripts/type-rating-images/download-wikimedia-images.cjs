#!/usr/bin/env node
/**
 * Wikimedia Commons image downloader for aircraft.
 * Searches per aircraft by manufacturer + model.
 * Respects rate limits with 6s delay between requests.
 */
const fs = require('fs');
const https = require('https');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');
const BASE_DIR = path.resolve(__dirname, '../../public/images/manufacturers');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function safeFileName(manufacturer, model) {
  return `${manufacturer}-${model}`.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

function fetchJson(url, retries = 3) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PilotRecognitionBot/1.0 ( aviation-images@example.com )'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 429 && retries > 0) {
          const delay = (4 - retries) * 10000;
          console.log(`      Rate limited, retrying in ${delay}ms...`);
          setTimeout(() => resolve(fetchJson(url, retries - 1)), delay);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Invalid JSON')); }
      });
    }).on('error', reject).setTimeout(15000, function() { this.destroy(); reject(new Error('Timeout')); });
  });
}

function downloadImage(url, destPath, retries = 3) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    options.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://commons.wikimedia.org/'
    };
    https.get(options, (res) => {
      if (res.statusCode === 429 && retries > 0) {
        const delay = (4 - retries) * 15000;
        console.log(`      Download rate limited, retrying in ${delay}ms...`);
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

async function searchWikimedia(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encoded}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json&origin=*`;
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
    console.log(`      Search error: ${e.message}`);
    return null;
  }
}

async function downloadForAircraft(id, manufacturer, model, folderPath, searchQueries) {
  const safeName = safeFileName(manufacturer, model);
  const destPath = path.join(folderPath, `${safeName}.jpg`);

  for (const query of searchQueries) {
    const images = await searchWikimedia(query);
    if (!images || images.length === 0) continue;

    for (const img of images) {
      try {
        await downloadImage(img.url, destPath);
        const stats = fs.statSync(destPath);
        if (stats.size > 2000) {
          return { status: 'downloaded', path: destPath, size: stats.size, query };
        }
        fs.unlinkSync(destPath);
      } catch (e) {
        // try next image
      }
    }
  }
  return { status: 'no-images' };
}

function buildSearchQueries(manufacturer, model) {
  const m = model.toLowerCase();
  const queries = [`${manufacturer} ${model} aircraft`];

  // Add model-specific query refinements
  if (m.includes('crj')) {
    queries.push(`Bombardier CRJ ${model.replace(/[^0-9]/g, '')}`);
  }
  if (m.includes('challenger')) {
    queries.push(`Bombardier Challenger ${m.replace(/[^0-9]/g, '')}`);
  }
  if (m.includes('global')) {
    queries.push(`Bombardier Global ${m.replace(/[^0-9]/g, '')}`);
    queries.push(`Bombardier Global Express`);
  }
  if (m.includes('learjet')) {
    const num = m.replace(/[^0-9]/g, '');
    queries.push(`Learjet ${num} aircraft`);
    queries.push(`Bombardier Learjet ${num}`);
  }
  if (m.includes('dash')) {
    queries.push(`Bombardier Dash 8 ${model}`);
  }
  if (m.includes('dhc')) {
    queries.push(`de Havilland Canada ${model}`);
  }
  if (m.includes('short')) {
    queries.push(`Short ${model.replace(/short/i, '').trim()} aircraft`);
  }
  if (m.includes('cl-')) {
    queries.push(`Canadair ${model}`);
  }

  return [...new Set(queries)];
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

  const filter = process.argv[2];
  let manufacturerIds = [...new Set(aircraft.map(a => a.manufacturer_id))];
  if (filter) {
    manufacturerIds = manufacturerIds.filter(id => id.toLowerCase().includes(filter.toLowerCase()));
    console.log(`Filtering to ${manufacturerIds.length} manufacturer(s) matching '${filter}'...`);
  }
  console.log(`Processing ${manufacturerIds.length} manufacturers, ${aircraft.filter(a => manufacturerIds.includes(a.manufacturer_id)).length} aircraft...\n`);

  const results = [];
  for (const mid of manufacturerIds) {
    const folderPath = path.join(BASE_DIR, mid);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    const manufacturerAircraft = aircraft.filter(a => a.manufacturer_id === mid);
    console.log(`📁 ${mid} (${manufacturerAircraft.length} aircraft)`);

    for (const a of manufacturerAircraft) {
      const queries = buildSearchQueries(mid, a.model);
      const res = await downloadForAircraft(a.id, mid, a.model, folderPath, queries);

      const relativePath = res.status === 'downloaded'
        ? `/images/manufacturers/${mid}/${safeFileName(mid, a.model)}.jpg`
        : null;
      results.push({ ...a, ...res, relativePath });

      const label = res.status === 'downloaded' ? '✅' : '❌';
      console.log(`  ${label} ${a.model} (${res.query || 'no result'})`);
      await sleep(6000);
    }
    console.log();
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

  const downloaded = results.filter(r => r.status === 'downloaded').length;
  const failed = results.filter(r => r.status !== 'downloaded').length;
  console.log(`\nDone! ${downloaded} downloaded, ${failed} failed. Updated ${updated} aircraft image paths.`);
}

main().catch(err => { console.error(err); process.exit(1); });
