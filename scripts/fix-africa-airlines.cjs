#!/usr/bin/env node
/**
 * Fixes all Africa airline logos and downloads missing aircraft images.
 * - Re-downloads incorrect/corrupt logos (RwandAir, Tunisair, Air Seychelles)
 * - Downloads missing logos (FlySafair, Mango, Fly540, Jambojet)
 * - Downloads missing aircraft livery photos
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
      if (res.statusCode === 301 || res.statusCode === 302) {
        fetch(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.destroy();
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(fs.statSync(destPath).size); });
    }).on('error', (err) => {
      try { fs.unlinkSync(destPath); } catch {}
      reject(err);
    });
  });
}

// Get file URL from English Wikipedia (for non-free logos)
async function getWikiFileUrl(fileTitle) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  for (const key of Object.keys(pages)) {
    if (pages[key].imageinfo?.[0]) return pages[key].imageinfo[0].url;
  }
  return null;
}

// Get file URL from Wikimedia Commons
async function getCommonsFileUrl(fileTitle) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  for (const key of Object.keys(pages)) {
    if (pages[key].imageinfo?.[0]) return pages[key].imageinfo[0].url;
  }
  return null;
}

// Search Commons for files
async function searchCommons(term) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srnamespace=6&format=json&srlimit=20`;
  const data = JSON.parse(await fetch(api));
  return data?.query?.search || [];
}

// Get images from a Wikipedia article
async function getArticleImages(articleTitle) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=images&format=json&imlimit=30`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  for (const key of Object.keys(pages)) {
    if (pages[key].images) return pages[key].images.map((img) => img.title);
  }
  return [];
}

// Find the best logo from image list
function findLogo(images) {
  const svgLogos = images.filter((f) => f.toLowerCase().endsWith('.svg') && f.toLowerCase().includes('logo'));
  if (svgLogos.length > 0) return svgLogos[0];
  const pngLogos = images.filter((f) => f.toLowerCase().endsWith('.png') && f.toLowerCase().includes('logo'));
  if (pngLogos.length > 0) return pngLogos[0];
  const svgs = images.filter((f) => f.toLowerCase().endsWith('.svg') &&
    !f.toLowerCase().includes('icon') && !f.toLowerCase().includes('map') &&
    !f.toLowerCase().includes('flag') && !f.toLowerCase().includes('commons') &&
    !f.toLowerCase().includes('alliance') && !f.toLowerCase().includes('star'));
  if (svgs.length > 0) return svgs[0];
  return null;
}

// Find best aircraft photo from image list
function findAircraftImage(images) {
  // Prefer photos with aircraft model in the name
  const aircraftImgs = images.filter((f) =>
    (f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png')) &&
    !f.toLowerCase().includes('logo') &&
    !f.toLowerCase().includes('icon') &&
    !f.toLowerCase().includes('map') &&
    !f.toLowerCase().includes('flag') &&
    !f.toLowerCase().includes('diagram') &&
    !f.toLowerCase().includes('commons') &&
    (f.toLowerCase().includes('airbus') || f.toLowerCase().includes('boeing') || f.toLowerCase().includes('atr') ||
     f.toLowerCase().includes('embraer') || f.toLowerCase().includes('a350') || f.toLowerCase().includes('a330') ||
     f.toLowerCase().includes('a320') || f.toLowerCase().includes('b737') || f.toLowerCase().includes('b767') ||
     f.toLowerCase().includes('b777') || f.toLowerCase().includes('b787') || f.toLowerCase().includes('a319'))
  );
  if (aircraftImgs.length > 0) return aircraftImgs[0];

  // Any JPG photo
  const jpgs = images.filter((f) =>
    f.toLowerCase().endsWith('.jpg') &&
    !f.toLowerCase().includes('logo') &&
    !f.toLowerCase().includes('icon') &&
    !f.toLowerCase().includes('map') &&
    !f.toLowerCase().includes('flag') &&
    !f.toLowerCase().includes('commons')
  );
  if (jpgs.length > 0) return jpgs[0];
  return null;
}

// Tasks: fix logos and download aircraft images
const TASKS = [
  // === FIX LOGOS ===
  // RwandAir - file is actually PNG, need real SVG
  { type: 'logo', airline: 'RwandAir', article: 'RwandAir',
    dest: 'africa/rwanda/international-operators/rwandair.svg' },
  // Tunisair - file is actually PNG, need real SVG
  { type: 'logo', airline: 'Tunisair', article: 'Tunisair',
    dest: 'africa/tunisia/international-operators/tunisair.svg' },
  // Air Seychelles - 0 byte file
  { type: 'logo', airline: 'Air Seychelles', article: 'Air Seychelles',
    dest: 'africa/seychelles/international-operators/air-seychelles.svg' },
  // FlySafair - no logo
  { type: 'logo', airline: 'FlySafair', article: 'FlySafair',
    dest: 'africa/south-africa/regional-operators/flysafair.svg' },
  // Mango - no logo
  { type: 'logo', airline: 'Mango Airlines', article: 'Mango (airline)',
    dest: 'africa/south-africa/regional-operators/mango.svg' },
  // Fly540 - no logo
  { type: 'logo', airline: 'Fly540', article: 'Fly540',
    dest: 'africa/kenya/regional-operators/fly540.svg' },
  // Jambojet - no logo
  { type: 'logo', airline: 'Jambojet', article: 'Jambojet',
    dest: 'africa/kenya/regional-operators/jambojet.svg' },

  // === DOWNLOAD AIRCRAFT IMAGES ===
  { type: 'aircraft', airline: 'Kenya Airways', article: 'Kenya Airways',
    dest: 'africa/kenya/international-operators/kenya-airways-aircraft.jpg' },
  { type: 'aircraft', airline: 'Royal Air Maroc', article: 'Royal Air Maroc',
    dest: 'africa/morocco/international-operators/royal-air-maroc-aircraft.jpg' },
  { type: 'aircraft', airline: 'Tunisair', article: 'Tunisair',
    dest: 'africa/tunisia/international-operators/tunisair-aircraft.jpg' },
  { type: 'aircraft', airline: 'Air Algerie', article: 'Air Algérie',
    dest: 'africa/algeria/international-operators/air-algerie-aircraft.jpg' },
  { type: 'aircraft', airline: 'RwandAir', article: 'RwandAir',
    dest: 'africa/rwanda/international-operators/rwandair-aircraft.jpg' },
  { type: 'aircraft', airline: 'Air Seychelles', article: 'Air Seychelles',
    dest: 'africa/seychelles/international-operators/air-seychelles-aircraft.jpg' },
];

async function main() {
  const results = { success: [], failed: [] };

  for (const task of TASKS) {
    const destPath = path.join(LOGOS_DIR, task.dest);
    console.log(`\n--- ${task.type.toUpperCase()}: ${task.airline} ---`);

    // Skip if file exists and is valid
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      // For logos, check if it's actually an SVG
      if (task.type === 'logo') {
        const buf = fs.readFileSync(destPath);
        const isPng = buf.length > 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
        if (isPng) {
          console.log(`  File is PNG disguised as SVG, re-downloading...`);
        } else {
          console.log(`  SKIP: already exists (${fs.statSync(destPath).size} bytes)`);
          results.success.push(task);
          continue;
        }
      } else {
        console.log(`  SKIP: already exists (${fs.statSync(destPath).size} bytes)`);
        results.success.push(task);
        continue;
      }
    }

    try {
      // Step 1: Get article images
      await sleep(1500);
      const images = await getArticleImages(task.article);
      if (images.length === 0) {
        results.failed.push({ ...task, error: 'No images found' });
        console.log(`  FAIL: No images found on article`);
        continue;
      }

      // Step 2: Find the right image
      const targetFile = task.type === 'logo' ? findLogo(images) : findAircraftImage(images);
      if (!targetFile) {
        // Try Commons search for logos
        if (task.type === 'logo') {
          await sleep(1500);
          const commonsResults = await searchCommons(task.airline + ' logo');
          const svgResult = commonsResults.find((r) =>
            r.title.toLowerCase().endsWith('.svg') &&
            !r.title.toLowerCase().includes('commons') &&
            !r.title.toLowerCase().includes('icon')
          );
          if (svgResult) {
            await sleep(1500);
            const url = await getCommonsFileUrl(svgResult.title);
            if (url) {
              await sleep(1500);
              // Delete old file if exists
              if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
              const size = await downloadFile(url, destPath);
              // Verify it's actually SVG
              const buf = fs.readFileSync(destPath);
              const isPng = buf.length > 4 && buf[0] === 0x89 && buf[1] === 0x50;
              if (isPng) {
                // Rename to .png
                const pngPath = destPath.replace('.svg', '.png');
                fs.renameSync(destPath, pngPath);
                console.log(`  OK (PNG): ${task.dest.replace('.svg', '.png')} (${size} bytes)`);
              } else {
                console.log(`  OK: ${task.dest} (${size} bytes)`);
              }
              results.success.push(task);
              continue;
            }
          }
        }
        results.failed.push({ ...task, error: 'No suitable image found' });
        console.log(`  FAIL: No ${task.type} image found among ${images.length} images`);
        continue;
      }

      // Step 3: Get file URL
      await sleep(1500);
      let fileUrl = await getCommonsFileUrl(targetFile);
      if (!fileUrl) {
        // Try English Wikipedia
        fileUrl = await getWikiFileUrl(targetFile);
      }
      if (!fileUrl) {
        results.failed.push({ ...task, error: 'Could not get file URL' });
        console.log(`  FAIL: Could not get URL for ${targetFile}`);
        continue;
      }

      // Step 4: Download
      await sleep(1500);
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      const size = await downloadFile(fileUrl, destPath);

      if (size < 500) {
        fs.unlinkSync(destPath);
        results.failed.push({ ...task, error: `File too small (${size} bytes)` });
        console.log(`  FAIL: File too small (${size} bytes)`);
      } else {
        // For logos, check if it's actually SVG
        if (task.type === 'logo' && destPath.endsWith('.svg')) {
          const buf = fs.readFileSync(destPath);
          const isPng = buf.length > 4 && buf[0] === 0x89 && buf[1] === 0x50;
          if (isPng) {
            const pngPath = destPath.replace('.svg', '.png');
            fs.renameSync(destPath, pngPath);
            console.log(`  OK (PNG): ${task.dest.replace('.svg', '.png')} (${size} bytes)`);
          } else {
            console.log(`  OK: ${task.dest} (${size} bytes)`);
          }
        } else {
          console.log(`  OK: ${task.dest} (${size} bytes)`);
        }
        results.success.push(task);
      }
    } catch (err) {
      results.failed.push({ ...task, error: err.message });
      console.log(`  FAIL: ${err.message}`);
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log('\nFailed:');
    results.failed.forEach((f) => console.log(`  ${f.airline} (${f.type}): ${f.error}`));
  }
}

main();
