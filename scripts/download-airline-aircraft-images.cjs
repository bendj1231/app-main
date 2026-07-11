/**
 * Download airline flagship aircraft livery images from Wikimedia Commons.
 * Stores each image next to the airline's logo in the airline-logos folders.
 *
 * Usage: node scripts/download-airline-aircraft-images.cjs
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images', 'airline-logos');

// Mapping: airline id -> { name, searchQuery, destFolder, destFile, flagshipAircraft }
// destFolder is relative to PUBLIC_DIR
const AIRCRAFT_IMAGES = [
  // ===== Middle East =====
  { id: 'qatar', name: 'Qatar Airways', searchQuery: 'Qatar Airways Airbus A350', destFolder: 'middle-east', destFile: 'qatar-airways-aircraft.jpg', flagshipAircraft: 'Airbus A350-1000' },
  { id: 'emirates', name: 'Emirates', searchQuery: 'Emirates Airbus A380', destFolder: 'middle-east', destFile: 'emirates-aircraft.jpg', flagshipAircraft: 'Airbus A380' },
  { id: 'etihad', name: 'Etihad Airways', searchQuery: 'Etihad Airways Boeing 787', destFolder: 'middle-east', destFile: 'etihad-airways-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'elal', name: 'El Al Israel', searchQuery: 'El Al Boeing 787', destFolder: 'middle-east', destFile: 'el-al-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'royaljordanian', name: 'Royal Jordanian', searchQuery: 'Royal Jordanian Boeing 787', destFolder: 'middle-east', destFile: 'royal-jordanian-aircraft.jpg', flagshipAircraft: 'Boeing 787-8' },
  { id: 'saudia', name: 'Saudia', searchQuery: 'Saudia Boeing 777', destFolder: 'middle-east', destFile: 'saudia-aircraft.jpg', flagshipAircraft: 'Boeing 777-300ER' },
  { id: 'omanair', name: 'Oman Air', searchQuery: 'Oman Air Boeing 787', destFolder: 'middle-east', destFile: 'oman-air-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },

  // ===== APAC - International =====
  { id: 'singapore', name: 'Singapore Airlines', searchQuery: 'Singapore Airlines Airbus A380', destFolder: 'APAC/singapore/international-operators', destFile: 'singapore-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A380' },
  { id: 'cathay', name: 'Cathay Pacific', searchQuery: 'Cathay Pacific Boeing 777', destFolder: 'APAC/hong-kong/international-operators', destFile: 'cathay-pacific-aircraft.jpg', flagshipAircraft: 'Boeing 777-300ER' },
  { id: 'ana', name: 'ANA All Nippon', searchQuery: 'All Nippon Airways Boeing 787', destFolder: 'APAC/japan/international-operators', destFile: 'all-nippon-airways-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'jal', name: 'Japan Airlines', searchQuery: 'Japan Airlines Airbus A350', destFolder: 'APAC/japan/international-operators', destFile: 'japan-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'korean', name: 'Korean Air', searchQuery: 'Korean Air Airbus A380', destFolder: 'APAC/south-korea/international-operators', destFile: 'korean-air-aircraft.jpg', flagshipAircraft: 'Airbus A380' },
  { id: 'asiana', name: 'Asiana Airlines', searchQuery: 'Asiana Airlines Airbus A350', destFolder: 'APAC/south-korea/international-operators', destFile: 'asiana-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'thai', name: 'Thai Airways', searchQuery: 'Thai Airways Airbus A350', destFolder: 'APAC/thailand/international-operators', destFile: 'thai-airways-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'malaysia', name: 'Malaysia Airlines', searchQuery: 'Malaysia Airlines Airbus A350', destFolder: 'APAC/malaysia/international-operators', destFile: 'malaysia-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'garuda', name: 'Garuda Indonesia', searchQuery: 'Garuda Indonesia Airbus A330', destFolder: 'APAC/indonesia/international-operators', destFile: 'garuda-indonesia-aircraft.jpg', flagshipAircraft: 'Airbus A330-300' },
  { id: 'philippine', name: 'Philippine Airlines', searchQuery: 'Philippine Airlines Airbus A350', destFolder: 'APAC/philippines/international-operators', destFile: 'philippine-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'vietnam', name: 'Vietnam Airlines', searchQuery: 'Vietnam Airlines Airbus A350', destFolder: 'APAC/vietnam/international-operators', destFile: 'vietnam-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'china', name: 'Air China', searchQuery: 'Air China Boeing 747', destFolder: 'APAC/china/international-operators', destFile: 'air-china-aircraft.jpg', flagshipAircraft: 'Boeing 747-8I' },
  { id: 'chinaeastern', name: 'China Eastern', searchQuery: 'China Eastern Airlines Airbus A350', destFolder: 'APAC/china/international-operators', destFile: 'china-eastern-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'chinasouthern', name: 'China Southern', searchQuery: 'China Southern Airlines Airbus A380', destFolder: 'APAC/china/international-operators', destFile: 'china-southern-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A380' },
  { id: 'airindia', name: 'Air India', searchQuery: 'Air India Boeing 787', destFolder: 'APAC/india/international-operators', destFile: 'air-india-aircraft.jpg', flagshipAircraft: 'Boeing 787-8' },
  { id: 'srilankan', name: 'SriLankan Airlines', searchQuery: 'SriLankan Airlines Airbus A330', destFolder: 'APAC/sri-lanka/international-operators', destFile: 'srilankan-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A330-300' },
  { id: 'nepal', name: 'Nepal Airlines', searchQuery: 'Nepal Airlines Airbus A320', destFolder: 'APAC/nepal/international-operators', destFile: 'nepal-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A320' },
  { id: 'biman', name: 'Biman Bangladesh', searchQuery: 'Biman Bangladesh Boeing 777', destFolder: 'APAC/bangladesh/international-operators', destFile: 'biman-bangladesh-airlines-aircraft.jpg', flagshipAircraft: 'Boeing 777-300ER' },

  // ===== APAC - Regional =====
  { id: 'cathaydragon', name: 'Cathay Dragon', searchQuery: 'Cathay Dragon Airbus A330', destFolder: 'APAC/hong-kong/international-operators', destFile: 'cathay-dragon-aircraft.jpg', flagshipAircraft: 'Airbus A330-300' },
  { id: 'hkexpress', name: 'HK Express', searchQuery: 'HK Express Airbus A321', destFolder: 'APAC/hong-kong/regional-operators', destFile: 'hong-kong-express-aircraft.jpg', flagshipAircraft: 'Airbus A321neo' },
  { id: 'scoot', name: 'Scoot', searchQuery: 'Scoot Boeing 787', destFolder: 'APAC/singapore/regional-operators', destFile: 'scoot-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'jetstar', name: 'Jetstar Asia', searchQuery: 'Jetstar Airbus A320', destFolder: 'APAC/australia/international-operators', destFile: 'jetstar-aircraft.jpg', flagshipAircraft: 'Airbus A320' },
  { id: 'peach', name: 'Peach Aviation', searchQuery: 'Peach Aviation Airbus A320', destFolder: 'APAC/japan/regional-operators', destFile: 'peach-aviation-aircraft.jpg', flagshipAircraft: 'Airbus A320' },
  { id: 'spring', name: 'Spring Airlines', searchQuery: 'Spring Airlines Airbus A320', destFolder: 'APAC/china/regional-operators', destFile: 'spring-airlines-aircraft.jpg', flagshipAircraft: 'Airbus A320' },
  { id: 'indigo', name: 'IndiGo', searchQuery: 'IndiGo Airbus A320neo', destFolder: 'APAC/india/regional-operators', destFile: 'indigo-aircraft.jpg', flagshipAircraft: 'Airbus A320neo' },
  { id: 'spicejet', name: 'SpiceJet', searchQuery: 'SpiceJet Boeing 737', destFolder: 'APAC/india/regional-operators', destFile: 'spicejet-aircraft.jpg', flagshipAircraft: 'Boeing 737-800' },
  { id: 'aigle', name: 'Air India Express', searchQuery: 'Air India Express Boeing 737', destFolder: 'asia', destFile: 'aigle-aircraft.jpg', flagshipAircraft: 'Boeing 737-800' },
  { id: 'cebupacific', name: 'Cebu Pacific', searchQuery: 'Cebu Pacific Airbus A330', destFolder: 'APAC/philippines/regional-operators', destFile: 'cebu-pacific-aircraft.jpg', flagshipAircraft: 'Airbus A330-300' },

  // ===== Europe =====
  { id: 'lufthansa', name: 'Lufthansa', searchQuery: 'Lufthansa Airbus A350', destFolder: 'europe', destFile: 'lufthansa-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'british', name: 'British Airways', searchQuery: 'British Airways Airbus A350', destFolder: 'europe', destFile: 'british-airways-aircraft.jpg', flagshipAircraft: 'Airbus A350-1000' },
  { id: 'airfrance', name: 'Air France', searchQuery: 'Air France Airbus A350', destFolder: 'europe', destFile: 'airfrance-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'klm', name: 'KLM', searchQuery: 'KLM Boeing 787', destFolder: 'europe', destFile: 'klm-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'swiss', name: 'Swiss International', searchQuery: 'Swiss International Air Lines Airbus A350', destFolder: 'europe', destFile: 'swiss-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'turkish', name: 'Turkish Airlines', searchQuery: 'Turkish Airlines Airbus A350', destFolder: 'europe', destFile: 'turkish-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'iberia', name: 'Iberia', searchQuery: 'Iberia Airbus A350', destFolder: 'europe', destFile: 'iberia-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'alitalia', name: 'ITA Airways', searchQuery: 'ITA Airways Airbus A350', destFolder: 'europe', destFile: 'alitalia-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'austrian', name: 'Austrian Airlines', searchQuery: 'Austrian Airlines Boeing 767', destFolder: 'europe', destFile: 'austrian-aircraft.jpg', flagshipAircraft: 'Boeing 767-300ER' },
  { id: 'brussels', name: 'Brussels Airlines', searchQuery: 'Brussels Airlines Airbus A330', destFolder: 'europe', destFile: 'brussels-aircraft.jpg', flagshipAircraft: 'Airbus A330-300' },
  { id: 'sas', name: 'SAS Scandinavian', searchQuery: 'SAS Scandinavian Airlines Airbus A350', destFolder: 'europe', destFile: 'sas-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'finnair', name: 'Finnair', searchQuery: 'Finnair Airbus A350', destFolder: 'europe', destFile: 'finnair-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'tap', name: 'TAP Portugal', searchQuery: 'TAP Air Portugal Airbus A330neo', destFolder: 'europe', destFile: 'tap-aircraft.jpg', flagshipAircraft: 'Airbus A330-900neo' },
  { id: 'aegean', name: 'Aegean Airlines', searchQuery: 'Aegean Airlines Airbus A320neo', destFolder: 'europe', destFile: 'aegean-aircraft.jpg', flagshipAircraft: 'Airbus A320neo' },
  { id: 'lot', name: 'LOT Polish', searchQuery: 'LOT Polish Airlines Boeing 787', destFolder: 'europe', destFile: 'lot-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'czech', name: 'Czech Airlines', searchQuery: 'Czech Airlines Airbus A320', destFolder: 'europe', destFile: 'czech-aircraft.jpg', flagshipAircraft: 'Airbus A320' },
  { id: 'norwegian', name: 'Norwegian', searchQuery: 'Norwegian Air Shuttle Boeing 787', destFolder: 'europe', destFile: 'norwegian-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'icelandair', name: 'Icelandair', searchQuery: 'Icelandair Boeing 767', destFolder: 'europe', destFile: 'icelandair-aircraft.jpg', flagshipAircraft: 'Boeing 767-300ER' },
  { id: 'virginatlantic', name: 'Virgin Atlantic', searchQuery: 'Virgin Atlantic Airbus A350', destFolder: 'europe', destFile: 'virginatlantic-aircraft.jpg', flagshipAircraft: 'Airbus A350-1000' },

  // ===== Americas =====
  { id: 'delta', name: 'Delta Air Lines', searchQuery: 'Delta Air Lines Airbus A350', destFolder: 'americas', destFile: 'delta-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'american', name: 'American Airlines', searchQuery: 'American Airlines Boeing 777', destFolder: 'americas', destFile: 'american-airlines-aircraft.jpg', flagshipAircraft: 'Boeing 777-300ER' },
  { id: 'united', name: 'United Airlines', searchQuery: 'United Airlines Boeing 787', destFolder: 'americas', destFile: 'united-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'southwest', name: 'Southwest Airlines', searchQuery: 'Southwest Airlines Boeing 737', destFolder: 'americas', destFile: 'southwest-aircraft.jpg', flagshipAircraft: 'Boeing 737-800' },
  { id: 'alaska', name: 'Alaska Airlines', searchQuery: 'Alaska Airlines Boeing 737', destFolder: 'americas', destFile: 'alaska-aircraft.jpg', flagshipAircraft: 'Boeing 737-900ER' },
  { id: 'jetblue', name: 'JetBlue Airways', searchQuery: 'JetBlue Airbus A321', destFolder: 'americas', destFile: 'jetblue-aircraft.jpg', flagshipAircraft: 'Airbus A321neo' },
  { id: 'aircanada', name: 'Air Canada', searchQuery: 'Air Canada Boeing 787', destFolder: 'americas', destFile: 'aircanada-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'westjet', name: 'WestJet', searchQuery: 'WestJet Boeing 737 MAX', destFolder: 'americas', destFile: 'westjet-aircraft.jpg', flagshipAircraft: 'Boeing 737 MAX 8' },
  { id: 'latam', name: 'LATAM Airlines', searchQuery: 'LATAM Airlines Boeing 787', destFolder: 'americas', destFile: 'latam-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'avianca', name: 'Avianca', searchQuery: 'Avianca Boeing 787', destFolder: 'americas', destFile: 'avianca-aircraft.jpg', flagshipAircraft: 'Boeing 787-8' },
  { id: 'aeromexico', name: 'Aeromexico', searchQuery: 'Aeromexico Boeing 787', destFolder: 'americas', destFile: 'aeromexico-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'copaair', name: 'Copa Airlines', searchQuery: 'Copa Airlines Boeing 737', destFolder: 'americas', destFile: 'copaair-aircraft.jpg', flagshipAircraft: 'Boeing 737 MAX 9' },
  { id: 'gol', name: 'GOL Linhas', searchQuery: 'GOL Linhas Aereas Boeing 737', destFolder: 'americas', destFile: 'gol-aircraft.jpg', flagshipAircraft: 'Boeing 737-800' },

  // ===== Oceania =====
  { id: 'qantas', name: 'Qantas', searchQuery: 'Qantas Airbus A380', destFolder: 'APAC/australia/international-operators', destFile: 'qantas-aircraft.jpg', flagshipAircraft: 'Airbus A380' },
  { id: 'virginaustralia', name: 'Virgin Australia', searchQuery: 'Virgin Australia Boeing 737', destFolder: 'APAC/australia/international-operators', destFile: 'virgin-australia-aircraft.jpg', flagshipAircraft: 'Boeing 737-800' },

  // ===== Africa =====
  { id: 'egyptair', name: 'EgyptAir', searchQuery: 'EgyptAir Boeing 787', destFolder: 'africa', destFile: 'egyptair-aircraft.jpg', flagshipAircraft: 'Boeing 787-9' },
  { id: 'ethiopian', name: 'Ethiopian Airlines', searchQuery: 'Ethiopian Airlines Airbus A350', destFolder: 'africa', destFile: 'ethiopian-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
  { id: 'southafrican', name: 'South African Airways', searchQuery: 'South African Airways Airbus A350', destFolder: 'africa', destFile: 'southafrican-aircraft.jpg', flagshipAircraft: 'Airbus A350-900' },
];

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, {
      headers: {
        'User-Agent': 'PilotRecognitionBot/1.0 (educational aviation resource; contact admin@pilotrecognition.com)',
        'Accept': '*/*',
        ...options.headers,
      },
      ...options,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        const newUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        fetchUrl(newUrl, options).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function fetchJson(url) {
  return fetchUrl(url).then((buf) => JSON.parse(buf.toString('utf8')));
}

async function searchWikimediaCommons(query, limit = 6) {
  const apiUrl = 'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      list: 'search',
      srsearch: `filetype:bitmap ${query}`,
      srnamespace: '6',
      srlimit: String(limit),
      prop: 'imageinfo',
    }).toString();

  const data = await fetchJson(apiUrl);
  if (!data.query || !data.query.search || data.query.search.length === 0) {
    return [];
  }

  const results = data.query.search.map((item) => ({
    title: item.title,
    snippet: item.snippet ? item.snippet.replace(/<[^>]*>/g, '') : '',
  }));

  // Get image info for each result
  const titles = results.map((r) => r.title).join('|');
  const infoUrl = 'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: titles,
      prop: 'imageinfo',
      iiprop: 'url|size|mime|extmetadata',
      iiurlwidth: '1600',
    }).toString();

  const infoData = await fetchJson(infoUrl);
  if (!infoData.query || !infoData.query.pages) return [];

  const pages = Object.values(infoData.query.pages);
  const images = [];
  for (const page of pages) {
    if (page.imageinfo && page.imageinfo.length > 0) {
      const info = page.imageinfo[0];
      // Prefer landscape orientation (width > height) for hero backgrounds
      const isLandscape = info.width > info.height;
      images.push({
        title: page.title,
        url: info.thumburl || info.url,
        fullUrl: info.url,
        width: info.width,
        height: info.height,
        mime: info.mine,
        isLandscape,
        description: info.extmetadata?.ImageDescription?.value ? info.extmetadata.ImageDescription.value.replace(/<[^>]*>/g, '') : '',
        license: info.extmetadata?.LicenseShortName?.value || 'Unknown',
      });
    }
  }

  // Sort: prefer landscape images, then by relevance (original search order)
  images.sort((a, b) => {
    if (a.isLandscape && !b.isLandscape) return -1;
    if (!a.isLandscape && b.isLandscape) return 1;
    return 0;
  });

  return images;
}

async function downloadImage(entry) {
  const destDir = path.join(PUBLIC_DIR, entry.destFolder);
  const destPath = path.join(destDir, entry.destFile);

  // Skip if already exists
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 10000) {
    console.log(`[SKIP] ${entry.name} - already exists (${entry.destFile})`);
    return { ...entry, status: 'skipped', filePath: destPath };
  }

  fs.mkdirSync(destDir, { recursive: true });

  console.log(`[SEARCH] ${entry.name} - searching for "${entry.searchQuery}"...`);

  let images = [];
  try {
    images = await searchWikimediaCommons(entry.searchQuery);
  } catch (err) {
    console.error(`[ERROR] Search failed for ${entry.name}: ${err.message}`);
    return { ...entry, status: 'error', error: err.message };
  }

  if (images.length === 0) {
    // Try a broader search
    console.log(`[RETRY] ${entry.name} - trying broader search...`);
    try {
      const broaderQuery = entry.searchQuery.split(' ').slice(0, 3).join(' ');
      images = await searchWikimediaCommons(broaderQuery);
    } catch (err) {
      console.error(`[ERROR] Broader search also failed for ${entry.name}: ${err.message}`);
      return { ...entry, status: 'error', error: err.message };
    }
  }

  if (images.length === 0) {
    console.error(`[NOT FOUND] ${entry.name} - no images found for "${entry.searchQuery}"`);
    return { ...entry, status: 'not_found' };
  }

  // Pick the best image - prefer landscape
  const best = images[0];
  console.log(`[FOUND] ${entry.name} - ${best.title} (${best.width}x${best.height})`);

  try {
    const imgBuffer = await fetchUrl(best.url);
    if (imgBuffer.length < 5000) {
      console.error(`[TOO SMALL] ${entry.name} - image only ${imgBuffer.length} bytes`);
      return { ...entry, status: 'too_small' };
    }
    fs.writeFileSync(destPath, imgBuffer);
    console.log(`[SAVED] ${entry.name} -> ${entry.destFolder}/${entry.destFile} (${(imgBuffer.length / 1024).toFixed(0)}KB)`);
    return { ...entry, status: 'downloaded', filePath: destPath, sourceTitle: best.title, sourceUrl: best.fullUrl };
  } catch (err) {
    console.error(`[ERROR] Download failed for ${entry.name}: ${err.message}`);
    return { ...entry, status: 'error', error: err.message };
  }
}

async function main() {
  console.log(`\n=== Downloading ${AIRCRAFT_IMAGES.length} airline aircraft images ===\n`);

  const results = [];
  // Process in batches of 5 to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < AIRCRAFT_IMAGES.length; i += batchSize) {
    const batch = AIRCRAFT_IMAGES.slice(i, i + batchSize);
    console.log(`\n--- Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(AIRCRAFT_IMAGES.length / batchSize)} ---`);
    const batchResults = await Promise.all(batch.map((entry) => downloadImage(entry)));
    results.push(...batchResults);
    // Small delay between batches
    if (i + batchSize < AIRCRAFT_IMAGES.length) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  // Summary
  console.log('\n=== Summary ===\n');
  const downloaded = results.filter((r) => r.status === 'downloaded');
  const skipped = results.filter((r) => r.status === 'skipped');
  const notFound = results.filter((r) => r.status === 'not_found');
  const errors = results.filter((r) => r.status === 'error' || r.status === 'too_small');

  console.log(`Downloaded: ${downloaded.length}`);
  console.log(`Skipped (already exist): ${skipped.length}`);
  console.log(`Not found: ${notFound.length}`);
  console.log(`Errors: ${errors.length}`);

  if (notFound.length > 0 || errors.length > 0) {
    console.log('\n--- Issues ---');
    [...notFound, ...errors].forEach((r) => {
      console.log(`  ${r.name}: ${r.status}${r.error ? ' - ' + r.error : ''}`);
    });
  }

  // Write results JSON for reference
  const resultsPath = path.join(__dirname, 'airline-aircraft-images-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${resultsPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
