#!/usr/bin/env node
/**
 * Fixes all bad Africa airline assets:
 * - Deletes 932-byte placeholder SVGs and 2280-byte HTML "jpgs"
 * - Downloads real logos from English Wikipedia
 * - Downloads real aircraft livery photos from Wikimedia Commons
 * - Resizes oversized images
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

async function getCommonsFileUrl(fileTitle) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  for (const key of Object.keys(pages)) { if (pages[key].imageinfo?.[0]) return pages[key].imageinfo[0].url; }
  return null;
}

async function getArticleImages(articleTitle) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=images&format=json&imlimit=50`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  for (const key of Object.keys(pages)) { if (pages[key].images) return pages[key].images.map((i) => i.title); }
  return [];
}

function findLogo(images) {
  const svgLogos = images.filter((f) => f.toLowerCase().endsWith('.svg') && f.toLowerCase().includes('logo'));
  if (svgLogos.length > 0) return svgLogos[0];
  const pngLogos = images.filter((f) => f.toLowerCase().endsWith('.png') && f.toLowerCase().includes('logo'));
  if (pngLogos.length > 0) return pngLogos[0];
  const svgs = images.filter((f) => f.toLowerCase().endsWith('.svg') && !f.toLowerCase().includes('commons') && !f.toLowerCase().includes('icon') && !f.toLowerCase().includes('map') && !f.toLowerCase().includes('flag') && !f.toLowerCase().includes('alliance'));
  if (svgs.length > 0) return svgs[0];
  return null;
}

function findAircraftImage(images) {
  const aircraft = images.filter((f) =>
    (f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg')) &&
    !f.toLowerCase().includes('logo') && !f.toLowerCase().includes('icon') &&
    !f.toLowerCase().includes('map') && !f.toLowerCase().includes('flag') &&
    !f.toLowerCase().includes('commons') && !f.toLowerCase().includes('diagram') &&
    (f.toLowerCase().includes('airbus') || f.toLowerCase().includes('boeing') ||
     f.toLowerCase().includes('atr') || f.toLowerCase().includes('embraer') ||
     f.toLowerCase().includes('a350') || f.toLowerCase().includes('a330') ||
     f.toLowerCase().includes('a320') || f.toLowerCase().includes('a319') ||
     f.toLowerCase().includes('b737') || f.toLowerCase().includes('b767') ||
     f.toLowerCase().includes('b777') || f.toLowerCase().includes('b787') ||
     f.toLowerCase().includes('737') || f.toLowerCase().includes('767') ||
     f.toLowerCase().includes('777') || f.toLowerCase().includes('787'))
  );
  if (aircraft.length > 0) return aircraft[0];
  const jpgs = images.filter((f) => f.toLowerCase().endsWith('.jpg') && !f.toLowerCase().includes('logo') && !f.toLowerCase().includes('icon') && !f.toLowerCase().includes('map') && !f.toLowerCase().includes('flag') && !f.toLowerCase().includes('commons'));
  if (jpgs.length > 0) return jpgs[0];
  return null;
}

// Get a thumbnail URL (smaller download) from Commons
async function getCommonsThumbUrl(fileTitle, width = 1200) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  for (const key of Object.keys(pages)) {
    if (pages[key].imageinfo?.[0]?.thumburl) return pages[key].imageinfo[0].thumburl;
  }
  return null;
}

// All fix tasks
const TASKS = [
  // === FIX BAD LOGOS (932-byte placeholders) ===
  { type: 'logo', airline: 'RwandAir', article: 'RwandAir', dest: 'africa/rwanda/international-operators/rwandair.svg' },
  { type: 'logo', airline: 'Tunisair', article: 'Tunisair', dest: 'africa/tunisia/international-operators/tunisair.svg' },
  { type: 'logo', airline: 'FlySafair', article: 'FlySafair', dest: 'africa/south-africa/regional-operators/flysafair.svg' },
  { type: 'logo', airline: 'Mango Airlines', article: 'Mango (airline)', dest: 'africa/south-africa/regional-operators/mango.svg' },
  { type: 'logo', airline: 'Fly540', article: 'Fly540', dest: 'africa/kenya/regional-operators/fly540.svg' },
  { type: 'logo', airline: 'Jambojet', article: 'Jambojet', dest: 'africa/kenya/regional-operators/jambojet.svg' },

  // === FIX BAD AIRCRAFT IMAGES (2280-byte HTML files) ===
  { type: 'aircraft', airline: 'Fly540', article: 'Fly540', dest: 'africa/kenya/regional-operators/fly540-aircraft.jpg' },
  { type: 'aircraft', airline: 'Jambojet', article: 'Jambojet', dest: 'africa/kenya/regional-operators/jambojet-aircraft.jpg' },
  { type: 'aircraft', airline: 'FlySafair', article: 'FlySafair', dest: 'africa/south-africa/regional-operators/flysafair-aircraft.jpg' },
  { type: 'aircraft', airline: 'Mango Airlines', article: 'Mango (airline)', dest: 'africa/south-africa/regional-operators/mango-aircraft.jpg' },

  // === FIX OVERSIZED AIRCRAFT IMAGE ===
  { type: 'aircraft', airline: 'Tunisair', article: 'Tunisair', dest: 'africa/tunisia/international-operators/tunisair-aircraft.jpg', force: true },
];

async function main() {
  const results = { success: [], failed: [] };

  for (const task of TASKS) {
    const destPath = path.join(LOGOS_DIR, task.dest);
    console.log(`\n--- ${task.type.toUpperCase()}: ${task.airline} ---`);

    // Check if file exists and is valid
    if (fs.existsSync(destPath)) {
      const size = fs.statSync(destPath).size;
      const buf = fs.readFileSync(destPath);
      const isHtml = size < 3000 && buf.toString('utf8', 0, 20).includes('<!DOCTYPE') || buf.toString('utf8', 0, 20).includes('<html');
      const isPlaceholder = size === 932;
      const isOversized = size > 5000000;

      if (isHtml || isPlaceholder || isOversized || task.force) {
        console.log(`  Deleting bad file (${size} bytes)`);
        fs.unlinkSync(destPath);
      } else if (size > 1000) {
        // For SVG logos, check if it's actually PNG
        if (task.type === 'logo' && destPath.endsWith('.svg')) {
          const isPng = buf.length > 4 && buf[0] === 0x89 && buf[1] === 0x50;
          if (isPng) {
            console.log(`  File is PNG disguised as SVG, re-downloading...`);
            fs.unlinkSync(destPath);
          } else {
            console.log(`  SKIP: valid file (${size} bytes)`);
            results.success.push(task);
            continue;
          }
        } else {
          console.log(`  SKIP: valid file (${size} bytes)`);
          results.success.push(task);
          continue;
        }
      }
    }

    try {
      // Get article images
      await sleep(2000);
      const images = await getArticleImages(task.article);
      if (images.length === 0) {
        results.failed.push({ ...task, error: 'No images found' });
        console.log(`  FAIL: No images found on article`);
        continue;
      }

      // Find target image
      const targetFile = task.type === 'logo' ? findLogo(images) : findAircraftImage(images);
      if (!targetFile) {
        console.log(`  No ${task.type} found in article images (${images.length} total)`);
        // Try Commons search for logos
        if (task.type === 'logo') {
          await sleep(2000);
          const searchApi = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(task.airline + ' logo')}&srnamespace=6&format=json&srlimit=10`;
          const searchData = JSON.parse(await fetch(searchApi));
          const commonsResults = searchData?.query?.search || [];
          const svgResult = commonsResults.find((r) => r.title.toLowerCase().endsWith('.svg') && !r.title.toLowerCase().includes('commons'));
          if (svgResult) {
            await sleep(2000);
            const url = await getCommonsFileUrl(svgResult.title);
            if (url) {
              await sleep(2000);
              const size = await downloadFile(url, destPath);
              if (size > 1000) {
                console.log(`  OK (Commons): ${task.dest} (${size} bytes)`);
                results.success.push(task);
                continue;
              }
            }
          }
        }
        results.failed.push({ ...task, error: 'No suitable image found' });
        console.log(`  FAIL: No ${task.type} image found`);
        continue;
      }

      // Get file URL - try Commons first, then English Wikipedia
      await sleep(2000);
      let fileUrl = await getCommonsFileUrl(targetFile);
      if (!fileUrl) {
        fileUrl = await getWikiFileUrl(targetFile);
      }
      if (!fileUrl) {
        results.failed.push({ ...task, error: 'Could not get file URL' });
        console.log(`  FAIL: Could not get URL for ${targetFile}`);
        continue;
      }

      // For aircraft images, try to get a thumbnail to avoid huge downloads
      if (task.type === 'aircraft') {
        await sleep(2000);
        const thumbUrl = await getCommonsThumbUrl(targetFile, 1200);
        if (thumbUrl) fileUrl = thumbUrl;
      }

      // Download
      await sleep(2000);
      const size = await downloadFile(fileUrl, destPath);
      if (size < 500) {
        fs.unlinkSync(destPath);
        results.failed.push({ ...task, error: `File too small (${size} bytes)` });
        console.log(`  FAIL: File too small (${size} bytes)`);
      } else {
        // Verify it's not HTML
        const buf = fs.readFileSync(destPath);
        const isHtml = buf.toString('utf8', 0, 20).includes('<!DOCTYPE') || buf.toString('utf8', 0, 20).includes('<html');
        if (isHtml) {
          fs.unlinkSync(destPath);
          results.failed.push({ ...task, error: 'Downloaded HTML instead of image' });
          console.log(`  FAIL: Got HTML instead of image`);
        } else {
          console.log(`  OK: ${task.dest} (${size} bytes)`);
          results.success.push(task);
        }
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
