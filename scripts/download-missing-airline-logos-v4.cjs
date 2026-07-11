#!/usr/bin/env node
/**
 * Downloads missing airline logos by searching Wikimedia Commons directly.
 * Uses the Commons search API to find logo files, then downloads them.
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

// Search Commons for logo files
async function searchCommonsLogo(airlineName) {
  const searchTerms = [
    `${airlineName} logo`,
    `${airlineName} Logo`,
  ];

  for (const term of searchTerms) {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srnamespace=6&format=json&srlimit=10`;
    const data = JSON.parse(await fetch(api));
    const results = data?.query?.search || [];

    // Filter for SVG files with "logo" in the name
    const svgLogos = results.filter((r) =>
      r.title.toLowerCase().endsWith('.svg') &&
      r.title.toLowerCase().includes('logo')
    );
    if (svgLogos.length > 0) return svgLogos[0].title;

    // Filter for PNG files with "logo" in the name
    const pngLogos = results.filter((r) =>
      r.title.toLowerCase().endsWith('.png') &&
      r.title.toLowerCase().includes('logo')
    );
    if (pngLogos.length > 0) return pngLogos[0].title;

    // Any SVG file
    const svgs = results.filter((r) => r.title.toLowerCase().endsWith('.svg'));
    if (svgs.length > 0) {
      // Filter out non-logo SVGs
      const logoSvgs = svgs.filter((r) =>
        !r.title.toLowerCase().includes('icon') &&
        !r.title.toLowerCase().includes('map') &&
        !r.title.toLowerCase().includes('flag') &&
        !r.title.toLowerCase().includes('diagram') &&
        !r.title.toLowerCase().includes('alliance') &&
        !r.title.toLowerCase().includes('star') &&
        !r.title.toLowerCase().includes('commons')
      );
      if (logoSvgs.length > 0) return logoSvgs[0].title;
    }
  }

  return null;
}

// Get the actual file URL from Commons
async function getFileUrl(fileTitle) {
  // fileTitle includes "File:" prefix
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
  const data = JSON.parse(await fetch(api));
  const pages = data?.query?.pages;
  if (!pages) return null;
  for (const key of Object.keys(pages)) {
    if (pages[key].imageinfo && pages[key].imageinfo[0]) {
      const url = pages[key].imageinfo[0].url;
      // Skip if it's the Commons logo placeholder
      if (url.includes('Commons-logo') || url.includes('commons_logo')) return null;
      return url;
    }
  }
  return null;
}

const MISSING_LOGOS = [
  // Africa
  { id: 'airmauritius', name: 'Air Mauritius', dest: 'africa/air-mauritius.svg' },
  { id: 'kenyaairways', name: 'Kenya Airways', dest: 'africa/kenya-airways.svg' },
  { id: 'royalairmaroc', name: 'Royal Air Maroc', dest: 'africa/royal-air-maroc.svg' },
  { id: 'tunisair', name: 'Tunisair', dest: 'africa/tunisair.svg' },
  { id: 'rwandair', name: 'RwandAir', dest: 'africa/rwandair.svg' },
  { id: 'airseychelles', name: 'Air Seychelles', dest: 'africa/air-seychelles.svg' },

  // Americas
  { id: 'frontier', name: 'Frontier Airlines', dest: 'americas/frontier.svg' },
  { id: 'porter', name: 'Porter Airlines', dest: 'americas/porter-airlines.svg' },
  { id: 'azul', name: 'Azul Brazilian Airlines', dest: 'americas/azul.svg' },
  { id: 'aerolineas', name: 'Aerolineas Argentinas', dest: 'americas/aerolineas-argentinas.svg' },
  { id: 'skyairline', name: 'Sky Airline', dest: 'americas/sky-airline.svg' },
  { id: 'jetsmart', name: 'JetSMART', dest: 'americas/jetsmart.svg' },

  // Europe
  { id: 'ryanair', name: 'Ryanair', dest: 'europe/ryanair.svg' },
  { id: 'easyjet', name: 'EasyJet', dest: 'europe/easyjet.svg' },
  { id: 'wizzair', name: 'Wizz Air', dest: 'europe/wizz-air.svg' },
  { id: 'vueling', name: 'Vueling', dest: 'europe/vueling.svg' },
  { id: 'jet2', name: 'Jet2', dest: 'europe/jet2.svg' },
  { id: 'tui', name: 'TUI Airways', dest: 'europe/tui-airways.svg' },
  { id: 'aeroflot', name: 'Aeroflot', dest: 'europe/aeroflot.svg' },

  // Middle East
  { id: 'gulfair', name: 'Gulf Air', dest: 'middle-east/gulf-air.svg' },
  { id: 'kuwaitairways', name: 'Kuwait Airways', dest: 'middle-east/kuwait-airways.svg' },

  // Central Asia
  { id: 'airastana', name: 'Air Astana', dest: 'APAC/kazakhstan/international-operators/air-astana.svg' },
  { id: 'uzbekistanairways', name: 'Uzbekistan Airways', dest: 'APAC/uzbekistan/international-operators/uzbekistan-airways.svg' },
  { id: 'pia', name: 'Pakistan International Airlines', dest: 'APAC/pakistan/international-operators/pakistan-international-airlines.svg' },
];

async function main() {
  const results = { success: [], failed: [] };

  // First, clean up the bad 932-byte placeholder files
  for (const airline of MISSING_LOGOS) {
    const destPath = path.join(LOGOS_DIR, airline.dest);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size === 932) {
      fs.unlinkSync(destPath);
      console.log(`  Deleted placeholder: ${airline.dest}`);
    }
  }

  for (const airline of MISSING_LOGOS) {
    const destPath = path.join(LOGOS_DIR, airline.dest);

    // Skip if already exists and is valid (not 932 bytes)
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      console.log(`  SKIP: ${airline.name} - already exists (${fs.statSync(destPath).size} bytes)`);
      results.success.push(airline);
      continue;
    }

    try {
      // Step 1: Search Commons for the logo
      await sleep(800);
      const fileTitle = await searchCommonsLogo(airline.name);
      if (!fileTitle) {
        results.failed.push({ ...airline, error: 'No logo found on Commons' });
        console.log(`  FAIL: ${airline.name} - No logo found on Commons`);
        continue;
      }

      // Step 2: Get the file URL
      await sleep(800);
      const fileUrl = await getFileUrl(fileTitle);
      if (!fileUrl) {
        results.failed.push({ ...airline, error: 'Could not get file URL' });
        console.log(`  FAIL: ${airline.name} - Could not get URL for ${fileTitle}`);
        continue;
      }

      // Step 3: Download
      await sleep(800);
      const size = await downloadFile(fileUrl, destPath);
      if (size < 1000) {
        fs.unlinkSync(destPath);
        results.failed.push({ ...airline, error: `File too small (${size} bytes)` });
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
