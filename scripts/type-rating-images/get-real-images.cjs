const fs = require('fs');
const https = require('https');

const DATA_FILE = './data/aircraft-manufacturers.ts';
const USER_AGENT = 'AviationApp/1.0 (test@local)';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function searchImage(query) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=3&format=json&origin=*`;
  try {
    const data = await fetchJson(searchUrl);
    if (!data.query?.search?.length) return null;
    
    // Try each result until we find one with an image
    for (const result of data.query.search) {
      const fileName = result.title.replace('File:', '');
      const imageUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=800&format=json&origin=*`;
      const imgData = await fetchJson(imageUrl);
      const pages = imgData.query?.pages;
      if (!pages) continue;
      const page = pages[Object.keys(pages)[0]];
      const url = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
      if (url) return url;
    }
    return null;
  } catch (e) {
    console.error(`Search error for "${query}": ${e.message}`);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  let content = fs.readFileSync(DATA_FILE, 'utf8');
  
  // Extract aircraft entries with unsplash or wikimedia images
  const start = content.indexOf('export const aircraftTypeRatings');
  const end = content.indexOf('export const getManufacturerById');
  const section = content.substring(start, end);
  
  // Find all aircraft with images
  const regex = /\n\s+id:\s+'([^']+)'[\s\S]*?manufacturer_id:\s+'([^']+)'[\s\S]*?model:\s+'([^']+)'[\s\S]*?image:\s+'([^']+)'/g;
  let match;
  const aircraft = [];
  while ((match = regex.exec(section)) !== null) {
    aircraft.push({ id: match[1], manufacturer: match[2], model: match[3], image: match[4] });
  }
  
  console.log(`Found ${aircraft.length} aircraft entries`);
  
  let updated = 0;
  let failed = 0;
  
  for (const entry of aircraft) {
    // Skip if already has a good image (not unsplash and has wikimedia)
    if (!entry.image.includes('unsplash') && entry.image.includes('wikimedia')) {
      // Verify the URL works
      try {
        const res = await new Promise((resolve, reject) => {
          https.get(entry.image, { headers: { 'User-Agent': USER_AGENT }, method: 'HEAD' }, (r) => resolve(r.statusCode))
            .on('error', reject);
        });
        if (res === 200) {
          console.log(`[OK] ${entry.model} - image works`);
          continue;
        }
      } catch (e) {}
    }
    
    const query = `${entry.manufacturer} ${entry.model} aircraft`;
    console.log(`[SEARCH] ${entry.model}: "${query}"`);
    
    try {
      const url = await searchImage(query);
      if (url) {
        const regex = new RegExp(`(id:\\s*'${entry.id}'[\\s\\S]{0,300}image:\\s*')[^']*(')`);
        if (regex.test(content)) {
          content = content.replace(regex, `$1${url}$2`);
          console.log(`  -> ${url.substring(0, 80)}...`);
          updated++;
        }
      } else {
        console.log(`  -> No results`);
        failed++;
      }
    } catch (e) {
      console.error(`  -> ERROR: ${e.message}`);
      failed++;
    }
    
    await sleep(600);
  }
  
  fs.writeFileSync(DATA_FILE, content);
  console.log(`\nDone! Updated ${updated}, failed ${failed}, total ${aircraft.length}`);
}

main().catch(console.error);
