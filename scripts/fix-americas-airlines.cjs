#!/usr/bin/env node
/**
 * Fixes all bad Americas airline assets:
 * - Deletes HTML error pages and oversized images
 * - Downloads missing/incorrect logos from English Wikipedia
 * - Downloads missing aircraft livery photos from Wikimedia Commons (thumbnails)
 * - Fixes wrong file extensions
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'images', 'airline-logos');
const UA = 'pilotrecognition.com airline logo downloader (educational project; contact: dev@pilotrecognition.com)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA, Accept: 'application/json,*/*' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) { fetch(res.headers.location).then(resolve).catch(reject); return; }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      let data = ''; res.on('data', (c) => (data += c)); res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) { res.destroy(); downloadFile(res.headers.location, destPath).then(resolve).catch(reject); return; }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file); file.on('finish', () => { file.close(); resolve(fs.statSync(destPath).size); });
    }).on('error', (e) => { try { fs.unlinkSync(destPath); } catch {} reject(e); });
  });
}

async function getWikiFileUrl(fileTitle) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  for (const key of Object.keys(pages)) { if (pages[key].imageinfo?.[0]) return pages[key].imageinfo[0].url; }
  return null;
}

async function getCommonsThumbUrl(fileTitle, width = 1200) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  for (const key of Object.keys(pages)) { if (pages[key].imageinfo?.[0]?.thumburl) return pages[key].imageinfo[0].thumburl; }
  return null;
}

async function getArticleImages(articleTitle) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=images&format=json&imlimit=50`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  for (const key of Object.keys(pages)) { if (pages[key].images) return pages[key].images.map((i) => i.title); }
  return [];
}

const EXCLUDE = ['commons-logo', 'commons_logo', 'oojs', 'wiki', 'increase', 'decrease', 'industry', 'edit-ltr', 'crystal', 'flag', 'map', 'icon', 'alliance', 'star', 'orthographic', 'seal', 'question', 'ambox', 'red_pog'];
const isExcluded = (f) => EXCLUDE.some((e) => f.toLowerCase().includes(e));

function findLogo(images) {
  const svgLogos = images.filter((f) => f.toLowerCase().endsWith('.svg') && f.toLowerCase().includes('logo') && !isExcluded(f));
  if (svgLogos.length > 0) return svgLogos[0];
  const pngLogos = images.filter((f) => f.toLowerCase().endsWith('.png') && f.toLowerCase().includes('logo') && !isExcluded(f));
  if (pngLogos.length > 0) return pngLogos[0];
  const svgs = images.filter((f) => f.toLowerCase().endsWith('.svg') && !isExcluded(f));
  if (svgs.length > 0) return svgs[0];
  return null;
}

function findAircraftImage(images) {
  const aircraft = images.filter((f) => {
    const l = f.toLowerCase();
    return (l.endsWith('.jpg') || l.endsWith('.jpeg')) &&
      !l.includes('logo') && !l.includes('icon') && !l.includes('map') &&
      !l.includes('flag') && !l.includes('commons') && !l.includes('diagram') &&
      !l.includes('cockpit') && !l.includes('interior') && !l.includes('seat') &&
      !l.includes('cabin') && !l.includes('ticket') && !l.includes('building') &&
      !l.includes('airport') && !l.includes('terminal') && !l.includes('crew') &&
      !l.includes('staff') && !l.includes('office') && !l.includes('route') &&
      !l.includes('board') && !l.includes('passenger') && !l.includes('lounge');
  });
  // Prefer ones with aircraft model names
  const withModel = aircraft.filter((f) => {
    const l = f.toLowerCase();
    return l.includes('airbus') || l.includes('boeing') || l.includes('atr') ||
      l.includes('embraer') || l.includes('a350') || l.includes('a330') ||
      l.includes('a320') || l.includes('a319') || l.includes('a321') ||
      l.includes('b737') || l.includes('b767') || l.includes('b777') ||
      l.includes('b787') || l.includes('737') || l.includes('767') ||
      l.includes('777') || l.includes('787') || l.includes('a300') ||
      l.includes('crj') || l.includes('e190') || l.includes('e195') ||
      l.includes('dash') || l.includes('q400') || l.includes('saab');
  });
  if (withModel.length > 0) return withModel[0];
  if (aircraft.length > 0) return aircraft[0];
  return null;
}

async function downloadLogo(article, destDir, baseName) {
  const images = await getArticleImages(article);
  const logoFile = findLogo(images);
  if (!logoFile) {
    // Try Commons search
    await sleep(2000);
    const searchApi = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(article + ' logo')}&srnamespace=6&format=json&srlimit=10`;
    const searchData = JSON.parse(await fetch(searchApi));
    const results = searchData?.query?.search || [];
    const svgResult = results.find((r) => r.title.toLowerCase().endsWith('.svg') && !isExcluded(r.title));
    const pngResult = results.find((r) => r.title.toLowerCase().endsWith('.png') && !isExcluded(r.title));
    const target = svgResult || pngResult;
    if (!target) return { success: false, error: 'No logo found', dest: null };
    await sleep(2000);
    const url = await getCommonsThumbUrl ? null : null; // not used for SVG
    // For SVG, get full URL
    const fileApi = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(target.title)}&prop=imageinfo&iiprop=url&format=json`;
    const fileData = JSON.parse(await fetch(fileApi));
    const pages = fileData?.query?.pages;
    let fileUrl = null;
    for (const key of Object.keys(pages)) { if (pages[key].imageinfo?.[0]) fileUrl = pages[key].imageinfo[0].url; }
    if (!fileUrl) return { success: false, error: 'No URL', dest: null };
    const ext = target.title.toLowerCase().endsWith('.png') ? '.png' : '.svg';
    const destPath = path.join(destDir, baseName + ext);
    await sleep(2000);
    const size = await downloadFile(fileUrl, destPath);
    return { success: size > 1000, size, dest: destPath };
  }

  // Get URL from en.wiki first, then Commons
  await sleep(2000);
  let url = await getWikiFileUrl(logoFile);
  if (!url) {
    await sleep(2000);
    const commonsApi = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(logoFile)}&prop=imageinfo&iiprop=url&format=json`;
    const commonsData = JSON.parse(await fetch(commonsApi));
    const pages = commonsData?.query?.pages;
    for (const key of Object.keys(pages)) { if (pages[key].imageinfo?.[0]) url = pages[key].imageinfo[0].url; }
  }
  if (!url) return { success: false, error: 'No URL', dest: null };

  const ext = logoFile.toLowerCase().endsWith('.png') ? '.png' : '.svg';
  const destPath = path.join(destDir, baseName + ext);
  await sleep(2000);
  const size = await downloadFile(url, destPath);
  return { success: size > 1000, size, dest: destPath };
}

async function downloadAircraft(article, destPath) {
  const images = await getArticleImages(article);
  const aircraftFile = findAircraftImage(images);
  if (!aircraftFile) return { success: false, error: 'No aircraft image found' };

  // Try Commons thumbnail first
  await sleep(2000);
  let url = await getCommonsThumbUrl(aircraftFile, 1200);
  if (!url) {
    await sleep(2000);
    url = await getWikiFileUrl(aircraftFile);
  }
  if (!url) return { success: false, error: 'No URL' };

  await sleep(2000);
  const size = await downloadFile(url, destPath);
  // Verify it's not HTML
  const buf = fs.readFileSync(destPath);
  const isHtml = buf.toString('utf8', 0, 20).includes('<!DOCTYPE') || buf.toString('utf8', 0, 20).includes('<html');
  if (isHtml) { fs.unlinkSync(destPath); return { success: false, error: 'Got HTML' }; }
  return { success: size > 5000, size };
}

// All fix tasks
const TASKS = [
  // === FIX HTML ERROR PAGE ===
  { type: 'aircraft', article: 'Air Canada Rouge', dest: 'americas/canada/regional-operators/air-canada-rouge-aircraft.jpg', force: true },

  // === FIX OVERSIZED AIRCRAFT IMAGES ===
  { type: 'aircraft', article: 'Copa Airlines', dest: 'americas/panama/international-operators/copaair-aircraft.jpg', force: true },
  { type: 'aircraft', article: 'American Airlines', dest: 'americas/united-states/international-operators/american-airlines-aircraft.jpg', force: true },

  // === FIX WRONG EXTENSION (united-aircraft.jpg is PNG) ===
  { type: 'aircraft', article: 'United Airlines', dest: 'americas/united-states/international-operators/united-aircraft.jpg', force: true },

  // === MISSING AIRCRAFT IMAGES ===
  { type: 'aircraft', article: 'Aerolineas Argentinas', dest: 'americas/argentina/international-operators/aerolineas-argentinas-aircraft.jpg' },
  { type: 'aircraft', article: 'Azul Brazilian Airlines', dest: 'americas/brazil/regional-operators/azul-aircraft.jpg' },
  { type: 'aircraft', article: 'Air Transat', dest: 'americas/canada/regional-operators/air-transat-aircraft.jpg' },
  { type: 'aircraft', article: 'Porter Airlines', dest: 'americas/canada/regional-operators/porter-airlines-aircraft.jpg' },
  { type: 'aircraft', article: 'JetSMART', dest: 'americas/chile/regional-operators/jetsmart-aircraft.jpg' },
  { type: 'aircraft', article: 'Sky Airline', dest: 'americas/chile/regional-operators/sky-airline-aircraft.jpg' },
  { type: 'aircraft', article: 'Allegiant Air', dest: 'americas/united-states/regional-operators/allegiant-aircraft.jpg' },
  { type: 'aircraft', article: 'Frontier Airlines', dest: 'americas/united-states/regional-operators/frontier-aircraft.jpg' },
  { type: 'aircraft', article: 'Hawaiian Airlines', dest: 'americas/united-states/regional-operators/hawaiian-airlines-aircraft.jpg' },

  // === MISSING LOGOS ===
  { type: 'logo', article: 'American Airlines', destDir: 'americas/united-states/international-operators', baseName: 'american-airlines' },
  { type: 'logo', article: 'Delta Air Lines', destDir: 'americas/united-states/international-operators', baseName: 'delta' },
  { type: 'logo', article: 'Southwest Airlines', destDir: 'americas/united-states/international-operators', baseName: 'southwest' },
  { type: 'logo', article: 'Spirit Airlines', destDir: 'americas/united-states/regional-operators', baseName: 'spirit' },
  { type: 'logo', article: 'Air Canada Rouge', destDir: 'americas/canada/regional-operators', baseName: 'air-canada-rouge' },
];

async function main() {
  const results = { success: [], failed: [] };

  for (const task of TASKS) {
    console.log(`\n--- ${task.type.toUpperCase()}: ${task.article} ---`);
    const destPath = task.type === 'logo'
      ? null // determined during download
      : path.join(LOGOS_DIR, task.dest);

    try {
      if (task.type === 'aircraft') {
        // Delete bad file if exists
        if (fs.existsSync(destPath)) {
          const size = fs.statSync(destPath).size;
          const buf = fs.readFileSync(destPath);
          const isHtml = buf.toString('utf8', 0, 20).includes('<!DOCTYPE') || buf.toString('utf8', 0, 20).includes('<html');
          const isOversized = size > 5000000;
          const isPngNamedJpg = destPath.endsWith('.jpg') && buf.length > 4 && buf[0] === 0x89 && buf[1] === 0x50;
          if (isHtml || isOversized || isPngNamedJpg || task.force) {
            console.log(`  Deleting bad file (${size} bytes)`);
            fs.unlinkSync(destPath);
          } else {
            console.log(`  SKIP: valid file (${size} bytes)`);
            results.success.push(task);
            continue;
          }
        }

        const result = await downloadAircraft(task.article, destPath);
        if (result.success) {
          console.log(`  OK: ${task.dest} (${result.size} bytes)`);
          results.success.push(task);
        } else {
          results.failed.push({ ...task, error: result.error });
          console.log(`  FAIL: ${result.error}`);
        }
      } else if (task.type === 'logo') {
        const destDir = path.join(LOGOS_DIR, task.destDir);
        const result = await downloadLogo(task.article, destDir, task.baseName);
        if (result.success) {
          const relPath = result.dest.replace(LOGOS_DIR + '/', '');
          console.log(`  OK: ${relPath} (${result.size} bytes)`);
          results.success.push({ ...task, dest: relPath });
        } else {
          results.failed.push({ ...task, error: result.error });
          console.log(`  FAIL: ${result.error}`);
        }
      }
    } catch (err) {
      results.failed.push({ ...task, error: err.message });
      console.log(`  FAIL: ${err.message}`);
    }
    await sleep(2000);
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log('\nFailed:');
    results.failed.forEach((f) => console.log(`  ${f.article} (${f.type}): ${f.error}`));
  }
}

main();
