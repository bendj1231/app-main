#!/usr/bin/env node
/**
 * Downloads missing airline logos using the Wikipedia API.
 * 1. Searches for the airline article on Wikipedia
 * 2. Gets the images used on that page
 * 3. Downloads the logo SVG/PNG
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'images', 'airline-logos');
const UA = 'pilotrecognition.com airline logo downloader (educational project; contact: dev@pilotrecognition.com)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fetch(url) {
  return new Promise((resolve, reject) => {
    const options = { headers: { 'User-Agent': UA, 'Accept': 'application/json,*/*' } };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        fetch(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
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
    const options = { headers: { 'User-Agent': UA } };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.destroy();
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(destPath).size;
        resolve(size);
      });
    }).on('error', (err) => {
      try { fs.unlinkSync(destPath); } catch {}
      reject(err);
    });
  });
}

// Get image info (URL) for a file on Wikimedia Commons
async function getFileUrl(fileName) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  if (!pages) return null;
  for (const key of Object.keys(pages)) {
    if (pages[key].imageinfo && pages[key].imageinfo[0]) {
      return pages[key].imageinfo[0].url;
    }
  }
  return null;
}

// Get list of images from a Wikipedia article
async function getArticleImages(articleTitle) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=images&format=json&imlimit=20`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  if (!pages) return [];
  for (const key of Object.keys(pages)) {
    if (pages[key].images) {
      return pages[key].images.map((img) => img.title.replace('File:', ''));
    }
  }
  return [];
}

// Find the best logo image from a list of image file names
function findLogoImage(images, airlineName) {
  // Prefer SVG files with "logo" in the name
  const svgLogos = images.filter((f) => f.toLowerCase().endsWith('.svg') && f.toLowerCase().includes('logo'));
  if (svgLogos.length > 0) return svgLogos[0];

  // Prefer SVG files
  const svgs = images.filter((f) => f.toLowerCase().endsWith('.svg'));
  if (svgs.length > 0) {
    // Filter out icons, diagrams, etc.
    const logoSvgs = svgs.filter((f) =>
      !f.toLowerCase().includes('icon') &&
      !f.toLowerCase().includes('diagram') &&
      !f.toLowerCase().includes('map') &&
      !f.toLowerCase().includes('flag') &&
      !f.toLowerCase().includes('symbol') &&
      !f.toLowerCase().includes('star') &&
      !f.toLowerCase().includes('alliance')
    );
    if (logoSvgs.length > 0) return logoSvgs[0];
  }

  // Prefer PNG files with "logo" in the name
  const pngLogos = images.filter((f) => f.toLowerCase().endsWith('.png') && f.toLowerCase().includes('logo'));
  if (pngLogos.length > 0) return pngLogos[0];

  return null;
}

const MISSING_LOGOS = [
  // Africa
  { id: 'airmauritius', name: 'Air Mauritius', article: 'Air Mauritius', dest: 'africa/air-mauritius.svg' },
  { id: 'kenyaairways', name: 'Kenya Airways', article: 'Kenya Airways', dest: 'africa/kenya-airways.svg' },
  { id: 'royalairmaroc', name: 'Royal Air Maroc', article: 'Royal Air Maroc', dest: 'africa/royal-air-maroc.svg' },
  { id: 'tunisair', name: 'Tunisair', article: 'Tunisair', dest: 'africa/tunisair.svg' },
  { id: 'airalgerie', name: 'Air Algérie', article: 'Air Algérie', dest: 'africa/air-algerie.svg' },
  { id: 'rwandair', name: 'RwandAir', article: 'RwandAir', dest: 'africa/rwandair.svg' },
  { id: 'airseychelles', name: 'Air Seychelles', article: 'Air Seychelles', dest: 'africa/air-seychelles.svg' },

  // Americas
  { id: 'frontier', name: 'Frontier Airlines', article: 'Frontier Airlines', dest: 'americas/frontier.svg' },
  { id: 'allegiant', name: 'Allegiant Air', article: 'Allegiant Air', dest: 'americas/allegiant.svg' },
  { id: 'hawaiian', name: 'Hawaiian Airlines', article: 'Hawaiian Airlines', dest: 'americas/hawaiian-airlines.svg' },
  { id: 'airtransat', name: 'Air Transat', article: 'Air Transat', dest: 'americas/air-transat.svg' },
  { id: 'porter', name: 'Porter Airlines', article: 'Porter Airlines', dest: 'americas/porter-airlines.svg' },
  { id: 'azul', name: 'Azul Brazilian Airlines', article: 'Azul Brazilian Airlines', dest: 'americas/azul.svg' },
  { id: 'aerolineas', name: 'Aerolíneas Argentinas', article: 'Aerolíneas Argentinas', dest: 'americas/aerolineas-argentinas.svg' },
  { id: 'skyairline', name: 'Sky Airline', article: 'Sky Airline', dest: 'americas/sky-airline.svg' },
  { id: 'jetsmart', name: 'JetSMART', article: 'JetSMART', dest: 'americas/jetsmart.svg' },

  // Europe
  { id: 'ryanair', name: 'Ryanair', article: 'Ryanair', dest: 'europe/ryanair.svg' },
  { id: 'easyjet', name: 'easyJet', article: 'EasyJet', dest: 'europe/easyjet.svg' },
  { id: 'wizzair', name: 'Wizz Air', article: 'Wizz Air', dest: 'europe/wizz-air.svg' },
  { id: 'vueling', name: 'Vueling', article: 'Vueling', dest: 'europe/vueling.svg' },
  { id: 'aireuropa', name: 'Air Europa', article: 'Air Europa', dest: 'europe/air-europa.svg' },
  { id: 'jet2', name: 'Jet2.com', article: 'Jet2.com', dest: 'europe/jet2.svg' },
  { id: 'tui', name: 'TUI Airways', article: 'TUI Airways', dest: 'europe/tui-airways.svg' },
  { id: 'aeroflot', name: 'Aeroflot', article: 'Aeroflot', dest: 'europe/aeroflot.svg' },
  { id: 'airbaltic', name: 'airBaltic', article: 'AirBaltic', dest: 'europe/airbaltic.svg' },

  // Middle East
  { id: 'gulfair', name: 'Gulf Air', article: 'Gulf Air', dest: 'middle-east/gulf-air.svg' },
  { id: 'kuwaitairways', name: 'Kuwait Airways', article: 'Kuwait Airways', dest: 'middle-east/kuwait-airways.svg' },
  { id: 'airarabia', name: 'Air Arabia', article: 'Air Arabia', dest: 'middle-east/air-arabia.svg' },

  // Central Asia
  { id: 'airastana', name: 'Air Astana', article: 'Air Astana', dest: 'APAC/kazakhstan/international-operators/air-astana.svg' },
  { id: 'uzbekistanairways', name: 'Uzbekistan Airways', article: 'Uzbekistan Airways', dest: 'APAC/uzbekistan/international-operators/uzbekistan-airways.svg' },
  { id: 'azerbaijan', name: 'Azerbaijan Airlines', article: 'Azerbaijan Airlines', dest: 'APAC/azerbaijan/international-operators/azerbaijan-airlines.svg' },

  // Pakistan
  { id: 'pia', name: 'Pakistan International Airlines', article: 'Pakistan International Airlines', dest: 'APAC/pakistan/international-operators/pakistan-international-airlines.svg' },
  { id: 'airblue', name: 'Airblue', article: 'Airblue', dest: 'APAC/pakistan/regional-operators/airblue.svg' },
];

async function main() {
  const results = { success: [], failed: [] };

  for (const airline of MISSING_LOGOS) {
    const destPath = path.join(LOGOS_DIR, airline.dest);
    try {
      // Step 1: Get article images
      await sleep(500); // Rate limit
      const images = await getArticleImages(airline.article);
      if (images.length === 0) {
        results.failed.push({ ...airline, error: 'No images found on article' });
        console.log(`  FAIL: ${airline.name} - No images found on article`);
        continue;
      }

      // Step 2: Find the logo image
      const logoFile = findLogoImage(images, airline.name);
      if (!logoFile) {
        results.failed.push({ ...airline, error: 'No logo image found', images });
        console.log(`  FAIL: ${airline.name} - No logo found among ${images.length} images`);
        continue;
      }

      // Step 3: Get the file URL from Commons
      await sleep(500);
      const fileUrl = await getFileUrl(logoFile);
      if (!fileUrl) {
        results.failed.push({ ...airline, error: 'Could not get file URL' });
        console.log(`  FAIL: ${airline.name} - Could not get URL for ${logoFile}`);
        continue;
      }

      // Step 4: Download the file
      await sleep(500);
      const size = await downloadFile(fileUrl, destPath);
      if (size < 100) {
        fs.unlinkSync(destPath);
        results.failed.push({ ...airline, error: 'File too small' });
        console.log(`  FAIL: ${airline.name} - File too small (${size} bytes)`);
      } else {
        results.success.push(airline);
        console.log(`  OK: ${airline.name} -> ${airline.dest} (${size} bytes)`);
      }
    } catch (err) {
      results.failed.push({ ...airline, error: err.message });
      console.log(`  FAIL: ${airline.name} - ${err.message}`);
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Downloaded: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log('\nFailed airlines:');
    results.failed.forEach((f) => console.log(`  ${f.name}: ${f.error}`));
  }
}

main();
