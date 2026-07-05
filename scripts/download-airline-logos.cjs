const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../public/images/airline-logos/APAC');

const AIRLINES = [
  // Already downloaded (17)
  { name: 'Singapore Airlines', search: 'Singapore Airlines logo', preferred: 'Singapore Airlines Logo.svg' },
  { name: 'Cathay Pacific', search: 'Cathay Pacific logo', preferred: 'Cathay Pacific' },
  { name: 'Japan Airlines', search: 'Japan Airlines logo', preferred: 'Japan Airlines' },
  { name: 'All Nippon Airways', search: 'ANA All Nippon Airways logo', preferred: 'All Nippon Airways' },
  { name: 'Korean Air', search: 'Korean Air logo', preferred: 'Korean Air' },
  { name: 'Asiana Airlines', search: 'Asiana Airlines logo', preferred: 'Asiana Airlines' },
  { name: 'Thai Airways', search: 'Thai Airways logo', preferred: 'Thai Airways' },
  { name: 'Malaysia Airlines', search: '"Malaysia Airlines" logo', preferred: 'Malaysia Airlines' },
  { name: 'Garuda Indonesia', search: 'Garuda Indonesia logo', preferred: 'Garuda Indonesia' },
  { name: 'Philippine Airlines', search: 'Philippine Airlines logo', preferred: 'Philippine Airlines' },
  { name: 'Vietnam Airlines', search: 'Vietnam Airlines logo', preferred: 'Vietnam Airlines' },
  { name: 'Air India', search: '"Air India" logo', preferred: 'Air India' },
  { name: 'IndiGo', search: 'IndiGo Airlines logo', preferred: 'IndiGo' },
  { name: 'AirAsia', search: 'AirAsia logo', preferred: 'AirAsia' },
  { name: 'China Eastern Airlines', search: '"China Eastern Airlines" logo', preferred: 'China Eastern Airlines' },
  { name: 'China Southern Airlines', search: '"China Southern Airlines" logo', preferred: 'China Southern Airlines' },
  { name: 'Air China', search: 'Air China logo', preferred: 'Air China' },
  { name: 'Hainan Airlines', search: '"Hainan Airlines" logo', preferred: 'Hainan Airlines' },
  { name: 'EVA Air', search: 'EVA Air logo', preferred: 'EVA Air' },
  { name: 'Scoot', search: 'Scoot airline logo', preferred: 'Scoot' },
  // New additions
  { name: 'China Airlines', search: 'China Airlines Taiwan logo', preferred: 'China Airlines' },
  { name: 'Hong Kong Airlines', search: 'Hong Kong Airlines logo', preferred: 'Hong Kong Airlines' },
  { name: 'Hong Kong Express', search: 'Hong Kong Express logo', preferred: 'Hong Kong Express' },
  { name: 'Starlux Airlines', search: 'Starlux Airlines logo', preferred: 'Starlux Airlines' },
  { name: 'Tigerair Taiwan', search: 'Tigerair Taiwan logo', preferred: 'Tigerair Taiwan' },
  { name: 'Mandarin Airlines', search: 'Mandarin Airlines logo', preferred: 'Mandarin Airlines' },
  { name: 'UNI Air', search: 'UNI Air logo', preferred: 'UNI Air' },
  { name: 'Peach Aviation', search: 'Peach Aviation logo', preferred: 'Peach Aviation' },
  { name: 'Skymark Airlines', search: 'Skymark Airlines logo', preferred: 'Skymark Airlines' },
  { name: 'Star Flyer', search: 'Star Flyer airline logo', preferred: 'Star Flyer' },
  { name: 'Solaseed Air', search: 'Solaseed Air logo', preferred: 'Solaseed Air' },
  { name: 'Spring Japan', search: 'Spring Japan airline logo', preferred: 'Spring Japan' },
  { name: 'Zipair', search: 'Zipair logo', preferred: 'Zipair' },
  { name: 'Jeju Air', search: 'Jeju Air logo', preferred: 'Jeju Air' },
  { name: 'Tway Air', search: 'Tway Air logo', preferred: 'Tway Air' },
  { name: 'Jin Air', search: 'Jin Air logo', preferred: 'Jin Air' },
  { name: 'Air Busan', search: 'Air Busan logo', preferred: 'Air Busan' },
  { name: 'Air Seoul', search: 'Air Seoul logo', preferred: 'Air Seoul' },
  { name: 'Eastar Jet', search: 'Eastar Jet logo', preferred: 'Eastar Jet' },
  { name: 'SpiceJet', search: 'SpiceJet logo', preferred: 'SpiceJet' },
  { name: 'Akasa Air', search: 'Akasa Air logo', preferred: 'Akasa Air' },
  { name: 'Thai AirAsia', search: 'Thai AirAsia logo', preferred: 'Thai AirAsia' },
  { name: 'Thai Lion Air', search: 'Thai Lion Air logo', preferred: 'Thai Lion Air' },
  { name: 'Nok Air', search: 'Nok Air logo', preferred: 'Nok Air' },
  { name: 'Bangkok Airways', search: 'Bangkok Airways logo', preferred: 'Bangkok Airways' },
  { name: 'Lion Air', search: 'Lion Air logo', preferred: 'Lion Air' },
  { name: 'Batik Air', search: 'Batik Air logo', preferred: 'Batik Air' },
  { name: 'Citilink', search: 'Citilink logo', preferred: 'Citilink' },
  { name: 'Cebu Pacific', search: 'Cebu Pacific logo', preferred: 'Cebu Pacific' },
  { name: 'PAL Express', search: 'PAL Express logo', preferred: 'PAL Express' },
  { name: 'VietJet Air', search: 'VietJet Air logo', preferred: 'VietJet Air' },
  { name: 'Bamboo Airways', search: 'Bamboo Airways logo', preferred: 'Bamboo Airways' },
  { name: 'Myanmar Airways International', search: 'Myanmar Airways International logo', preferred: 'Myanmar Airways International' },
  { name: 'Royal Brunei Airlines', search: 'Royal Brunei Airlines logo', preferred: 'Royal Brunei Airlines' },
  { name: 'Cambodia Angkor Air', search: 'Cambodia Angkor Air logo', preferred: 'Cambodia Angkor Air' },
  { name: 'Laos Airlines', search: 'Lao Airlines logo', preferred: 'Lao Airlines' },
  { name: 'SriLankan Airlines', search: 'SriLankan Airlines logo', preferred: 'SriLankan Airlines' },
  { name: 'Nepal Airlines', search: 'Nepal Airlines logo', preferred: 'Nepal Airlines' },
  { name: 'Maldivian', search: 'Maldivian airline logo', preferred: 'Maldivian' },
  { name: 'Biman Bangladesh Airlines', search: 'Biman Bangladesh Airlines logo', preferred: 'Biman Bangladesh Airlines' },
  { name: 'US-Bangla Airlines', search: 'US-Bangla Airlines logo', preferred: 'US-Bangla Airlines' },
  { name: 'Qantas', search: 'Qantas logo', preferred: 'Qantas' },
  { name: 'Virgin Australia', search: 'Virgin Australia logo', preferred: 'Virgin Australia' },
  { name: 'Jetstar', search: 'Jetstar logo', preferred: 'Jetstar' },
  { name: 'Rex Airlines', search: 'Rex Airlines Australia logo', preferred: 'Rex Airlines' },
  { name: 'Air New Zealand', search: 'Air New Zealand logo', preferred: 'Air New Zealand' },
  { name: 'Fiji Airways', search: 'Fiji Airways logo', preferred: 'Fiji Airways' },
  { name: 'Air Niugini', search: 'Air Niugini logo', preferred: 'Air Niugini' },
  { name: 'Solomon Airlines', search: 'Solomon Airlines logo', preferred: 'Solomon Airlines' },
  { name: 'Air Calin', search: 'Air Calin logo', preferred: 'Air Calin' },
  { name: 'Shanghai Airlines', search: 'Shanghai Airlines logo', preferred: 'Shanghai Airlines' },
  { name: 'Xiamen Airlines', search: 'Xiamen Airlines logo', preferred: 'Xiamen Airlines' },
  { name: 'Shenzhen Airlines', search: 'Shenzhen Airlines logo', preferred: 'Shenzhen Airlines' },
  { name: 'Sichuan Airlines', search: 'Sichuan Airlines logo', preferred: 'Sichuan Airlines' },
  { name: 'Juneyao Airlines', search: 'Juneyao Airlines logo', preferred: 'Juneyao Airlines' },
  { name: 'Spring Airlines', search: 'Spring Airlines logo', preferred: 'Spring Airlines' },
];

function fetchJson(urlStr) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, headers: { 'User-Agent': 'PilotRecognition/1.0 (dev@pilotrecognition.com)' } };
    https.get(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(urlStr, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const u = new URL(urlStr);
    const opts = { hostname: u.hostname, path: u.pathname + u.search, headers: { 'User-Agent': 'PilotRecognition/1.0 (dev@pilotrecognition.com)' } };
    https.get(opts, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        const loc = res.headers.location;
        if (!loc) { file.close(); reject(new Error('Redirect without location')); return; }
        if (loc.startsWith('http')) {
          const ru = new URL(loc);
          const redirectOpts = { hostname: ru.hostname, path: ru.pathname + ru.search, headers: opts.headers };
          https.get(redirectOpts, (res2) => { res2.pipe(file); file.on('finish', () => { file.close(); resolve(); }); }).on('error', reject);
        } else {
          https.get({ ...opts, path: loc }, (res2) => { res2.pipe(file); file.on('finish', () => { file.close(); resolve(); }); }).on('error', reject);
        }
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

function sanitizeFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const BAD_KEYWORDS = ['airport', 'terminal', 'check-in', 'entrance', 'aircraft', 'boeing', 'airbus', 'dreamliner', 'air force', 'military', 'runway', 'hangar', 'uniform', 'cockpit', 'cabin', 'flight attendant', 'photo', 'search areas', 'flight 370', 'cargo', 'express', 'expo', 'b-', '@'];
const GOOD_KEYWORDS = ['logo', 'wordmark', 'emblem', 'symbol'];

// Manual overrides for known exact files from Wikimedia Commons, logo.wine, and cdnlogo
const MANUAL_OVERRIDES = {
  'Malaysia Airlines': {
    title: 'File:MalaysiaAirlinesLogo Enrich.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/MalaysiaAirlinesLogo_Enrich.png',
    mime: 'image/png',
    width: 400,
    height: 200,
  },
  'Air India': {
    title: 'File:Air India 2023.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Air_India_2023.svg',
    mime: 'image/svg+xml',
    width: 168,
    height: 39,
  },
  'China Eastern Airlines': {
    title: 'Logo.wine: China Eastern Airlines',
    url: 'https://www.logo.wine/a/logo/China_Eastern_Airlines/China_Eastern_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'China Southern Airlines': {
    title: 'Logo.wine: China Southern Airlines',
    url: 'https://www.logo.wine/a/logo/China_Southern_Airlines/China_Southern_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Hainan Airlines': {
    title: 'Logo.wine: Hainan Airlines',
    url: 'https://www.logo.wine/a/logo/Hainan_Airlines/Hainan_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Shanghai Airlines': {
    title: 'Logo.wine: Shanghai Airlines',
    url: 'https://www.logo.wine/a/logo/Shanghai_Airlines/Shanghai_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Shenzhen Airlines': {
    title: 'Logo.wine: Shenzhen Airlines',
    url: 'https://www.logo.wine/a/logo/Shenzhen_Airlines/Shenzhen_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Sichuan Airlines': {
    title: 'Logo.wine: Sichuan Airlines',
    url: 'https://www.logo.wine/a/logo/Sichuan_Airlines/Sichuan_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Spring Airlines': {
    title: 'Logo.wine: Spring Airlines',
    url: 'https://www.logo.wine/a/logo/Spring_Airlines/Spring_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'PAL Express': {
    title: 'Logo.wine: PAL Express',
    url: 'https://www.logo.wine/a/logo/PAL_Express/PAL_Express-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Virgin Australia': {
    title: 'Logo.wine: Virgin Australia',
    url: 'https://www.logo.wine/a/logo/Virgin_Australia/Virgin_Australia-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'SriLankan Airlines': {
    title: 'Logo.wine: SriLankan Airlines',
    url: 'https://www.logo.wine/a/logo/SriLankan_Airlines/SriLankan_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Lion Air': {
    title: 'Logo.wine: Lion Air',
    url: 'https://www.logo.wine/a/logo/Lion_Air/Lion_Air-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Hong Kong Airlines': {
    title: 'Logo.wine: Hong Kong Airlines',
    url: 'https://www.logo.wine/a/logo/Hong_Kong_Airlines/Hong_Kong_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Hong Kong Express': {
    title: 'Logo.wine: HK Express',
    url: 'https://www.logo.wine/a/logo/HK_Express/HK_Express-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Biman Bangladesh Airlines': {
    title: 'Logo.wine: Biman Bangladesh Airlines',
    url: 'https://www.logo.wine/a/logo/Biman_Bangladesh_Airlines/Biman_Bangladesh_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Air Niugini': {
    title: 'Logo.wine: Air Niugini',
    url: 'https://www.logo.wine/a/logo/Air_Niugini/Air_Niugini-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Tway Air': {
    title: "File:T'way Air logo.svg",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/T'way_Air_logo.svg",
    mime: 'image/svg+xml',
    width: 107,
    height: 45,
  },
  'Starlux Airlines': {
    title: 'cdnlogo: Starlux Airlines',
    url: 'https://static.cdnlogo.com/logos/s/84/starlux-airlines.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Mandarin Airlines': {
    title: 'Logo.wine: Mandarin Airlines',
    url: 'https://www.logo.wine/a/logo/Mandarin_Airlines/Mandarin_Airlines-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Fiji Airways': {
    title: 'Logo.wine: Fiji Airways',
    url: 'https://www.logo.wine/a/logo/Fiji_Airways/Fiji_Airways-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
  'Air Calin': {
    title: 'Logo.wine: Aircalin',
    url: 'https://www.logo.wine/a/logo/Aircalin/Aircalin-Logo.wine.svg',
    mime: 'image/svg+xml',
    width: 300,
    height: 100,
  },
};

function scoreResult(title, mime) {
  const t = title.toLowerCase();
  let score = 0;
  if (mime === 'image/svg+xml') score += 10;
  if (mime === 'image/png') score += 5;
  for (const kw of GOOD_KEYWORDS) if (t.includes(kw)) score += 3;
  for (const kw of BAD_KEYWORDS) if (t.includes(kw)) score -= 20;
  return score;
}

async function queryCandidates(searchTerm) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&srlimit=10&format=json&origin=*`;
  const searchData = await fetchJson(searchUrl);
  const results = searchData.query?.search || [];
  if (results.length === 0) return [];

  const titles = results.map(r => r.title);
  const titlesPipe = titles.join('|');
  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titlesPipe)}&prop=imageinfo&iiprop=url|mime|size&format=json&origin=*`;
  const infoData = await fetchJson(infoUrl);
  const pages = infoData.query?.pages || {};

  const candidates = [];
  for (const pageId in pages) {
    const p = pages[pageId];
    const ii = p.imageinfo?.[0];
    if (!ii || !ii.url) continue;
    if (!ii.mime?.startsWith('image/')) continue;
    const score = scoreResult(p.title, ii.mime);
    candidates.push({ title: p.title, ...ii, score });
  }
  return candidates;
}

function pickBest(candidates, preferred) {
  const preferredLower = preferred.toLowerCase();
  candidates.sort((a, b) => {
    const aHasName = a.title.toLowerCase().includes(preferredLower) ? 1 : 0;
    const bHasName = b.title.toLowerCase().includes(preferredLower) ? 1 : 0;
    if (bHasName !== aHasName) return bHasName - aHasName;
    return b.score - a.score;
  });
  return candidates[0] || null;
}

async function searchAndDownload(airline) {
  const safeName = sanitizeFilename(airline.name);
  console.log(`\nSearching: ${airline.name}`);

  // Manual override: bypass search for known exact files
  const manual = MANUAL_OVERRIDES[airline.name];
  if (manual) {
    const ext = manual.mime === 'image/svg+xml' ? 'svg' : manual.mime === 'image/png' ? 'png' : 'jpg';
    const destPath = path.join(OUTPUT_DIR, `${safeName}.${ext}`);
    console.log(`  Using manual override: ${manual.title} -> ${safeName}.${ext}`);
    await downloadFile(manual.url, destPath);
    return {
      name: airline.name,
      status: 'downloaded',
      file: `${safeName}.${ext}`,
      title: manual.title,
      url: manual.url,
      width: manual.width,
      height: manual.height,
      mime: manual.mime,
      source: 'manual_override',
    };
  }

  let candidates = await queryCandidates(airline.search);
  let best = pickBest(candidates, airline.preferred);

  // Fallback: try simpler search without quotes
  if (!best || best.score < -5) {
    const fallback = airline.name + ' logo';
    if (fallback !== airline.search) {
      console.log(`  Trying fallback: ${fallback}`);
      candidates = await queryCandidates(fallback);
      best = pickBest(candidates, airline.preferred);
    }
  }

  if (!best) {
    console.log(`  No suitable image for ${airline.name}`);
    return { name: airline.name, status: 'no_suitable' };
  }

  if (best.score < -5) {
    console.log(`  Rejected all results for ${airline.name} (best: ${best.title})`);
    return { name: airline.name, status: 'rejected', title: best.title };
  }

  const ext = best.mime === 'image/svg+xml' ? 'svg' : best.mime === 'image/png' ? 'png' : best.mime === 'image/jpeg' ? 'jpg' : 'png';
  const destPath = path.join(OUTPUT_DIR, `${safeName}.${ext}`);

  console.log(`  Downloading: ${best.title} -> ${safeName}.${ext}`);
  await downloadFile(best.url, destPath);

  return {
    name: airline.name,
    status: 'downloaded',
    file: `${safeName}.${ext}`,
    title: best.title,
    url: best.url,
    width: best.width,
    height: best.height,
    mime: best.mime,
  };
}

function alreadyExists(safeName) {
  const exts = ['svg', 'png', 'jpg'];
  return exts.some(ext => fs.existsSync(path.join(OUTPUT_DIR, `${safeName}.${ext}`)));
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Load existing manifest if present
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  let existingResults = [];
  if (fs.existsSync(manifestPath)) {
    try { existingResults = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch {}
  }

  const results = [];
  let skipped = 0;
  for (const airline of AIRLINES) {
    const safeName = sanitizeFilename(airline.name);
    const existing = existingResults.find(r => r.name === airline.name && r.status === 'downloaded');
    if (existing && alreadyExists(safeName)) {
      console.log(`Skipping: ${airline.name} (already exists)`);
      results.push(existing);
      skipped++;
      continue;
    }
    try {
      const result = await searchAndDownload(airline);
      results.push(result);
    } catch (err) {
      console.error(`  Error for ${airline.name}:`, err.message);
      results.push({ name: airline.name, status: 'error', error: err.message });
    }
    // Rate limit
    await new Promise(r => setTimeout(r, 800));
  }

  fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));

  const downloaded = results.filter(r => r.status === 'downloaded').length;
  console.log(`\nDone: ${downloaded}/${AIRLINES.length} downloaded, ${skipped} skipped.`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch(console.error);
