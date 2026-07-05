const fs = require('fs');
const path = require('path');

const APAC_DIR = path.resolve(__dirname, '../public/images/airline-logos/APAC');

// Map airline name -> { country, type }
const AIRLINE_MAP = {
  // Australia
  'Qantas': { country: 'australia', type: 'international' },
  'Virgin Australia': { country: 'australia', type: 'international' },
  'Jetstar': { country: 'australia', type: 'international' },
  'Rex Airlines': { country: 'australia', type: 'regional' },

  // Bangladesh
  'Biman Bangladesh Airlines': { country: 'bangladesh', type: 'international' },

  // Brunei
  'Royal Brunei Airlines': { country: 'brunei', type: 'international' },

  // Cambodia
  // (Myanmar Airways International missing)

  // China
  'Air China': { country: 'china', type: 'international' },
  'China Eastern Airlines': { country: 'china', type: 'international' },
  'China Southern Airlines': { country: 'china', type: 'international' },
  'Hainan Airlines': { country: 'china', type: 'international' },
  'Xiamen Airlines': { country: 'china', type: 'international' },
  'Shanghai Airlines': { country: 'china', type: 'regional' },
  'Shenzhen Airlines': { country: 'china', type: 'regional' },
  'Sichuan Airlines': { country: 'china', type: 'regional' },
  'Spring Airlines': { country: 'china', type: 'regional' },

  // Fiji
  'Fiji Airways': { country: 'fiji', type: 'international' },

  // Hong Kong
  'Cathay Pacific': { country: 'hong-kong', type: 'international' },
  'Hong Kong Airlines': { country: 'hong-kong', type: 'international' },
  'Hong Kong Express': { country: 'hong-kong', type: 'regional' },

  // India
  'Air India': { country: 'india', type: 'international' },
  'IndiGo': { country: 'india', type: 'regional' },
  'SpiceJet': { country: 'india', type: 'regional' },
  'Akasa Air': { country: 'india', type: 'regional' },

  // Indonesia
  'Garuda Indonesia': { country: 'indonesia', type: 'international' },
  'Lion Air': { country: 'indonesia', type: 'regional' },
  'Batik Air': { country: 'indonesia', type: 'regional' },
  'Citilink': { country: 'indonesia', type: 'regional' },

  // Japan
  'Japan Airlines': { country: 'japan', type: 'international' },
  'All Nippon Airways': { country: 'japan', type: 'international' },
  'Zipair': { country: 'japan', type: 'international' },
  'Peach Aviation': { country: 'japan', type: 'regional' },
  'Skymark Airlines': { country: 'japan', type: 'regional' },
  'Star Flyer': { country: 'japan', type: 'regional' },
  'Solaseed Air': { country: 'japan', type: 'regional' },
  'Spring Japan': { country: 'japan', type: 'regional' },

  // Laos
  'Laos Airlines': { country: 'laos', type: 'international' },

  // Malaysia
  'Malaysia Airlines': { country: 'malaysia', type: 'international' },
  'AirAsia': { country: 'malaysia', type: 'international' },

  // Maldives
  'Maldivian': { country: 'maldives', type: 'regional' },

  // Myanmar
  // Myanmar Airways International missing

  // Nepal
  'Nepal Airlines': { country: 'nepal', type: 'international' },

  // New Caledonia
  'Air Calin': { country: 'new-caledonia', type: 'international' },

  // New Zealand
  'Air New Zealand': { country: 'new-zealand', type: 'international' },

  // Papua New Guinea
  'Air Niugini': { country: 'papua-new-guinea', type: 'international' },

  // Philippines
  'Philippine Airlines': { country: 'philippines', type: 'international' },
  'Cebu Pacific': { country: 'philippines', type: 'regional' },
  'PAL Express': { country: 'philippines', type: 'regional' },

  // Singapore
  'Singapore Airlines': { country: 'singapore', type: 'international' },
  'Scoot': { country: 'singapore', type: 'regional' },

  // Solomon Islands
  // Solomon Airlines missing

  // South Korea
  'Korean Air': { country: 'south-korea', type: 'international' },
  'Asiana Airlines': { country: 'south-korea', type: 'international' },
  'Air Seoul': { country: 'south-korea', type: 'regional' },
  'Jeju Air': { country: 'south-korea', type: 'regional' },
  'Tway Air': { country: 'south-korea', type: 'regional' },
  'Jin Air': { country: 'south-korea', type: 'regional' },
  'Air Busan': { country: 'south-korea', type: 'regional' },
  'Eastar Jet': { country: 'south-korea', type: 'regional' },

  // Sri Lanka
  'SriLankan Airlines': { country: 'sri-lanka', type: 'international' },

  // Taiwan
  'EVA Air': { country: 'taiwan', type: 'international' },
  'China Airlines': { country: 'taiwan', type: 'international' },
  'Starlux Airlines': { country: 'taiwan', type: 'international' },
  'Tigerair Taiwan': { country: 'taiwan', type: 'regional' },
  'Mandarin Airlines': { country: 'taiwan', type: 'regional' },
  'UNI Air': { country: 'taiwan', type: 'regional' },

  // Thailand
  'Thai Airways': { country: 'thailand', type: 'international' },
  'Bangkok Airways': { country: 'thailand', type: 'regional' },
  'Thai AirAsia': { country: 'thailand', type: 'regional' },
  'Thai Lion Air': { country: 'thailand', type: 'regional' },
  'Nok Air': { country: 'thailand', type: 'regional' },

  // Vietnam
  'Vietnam Airlines': { country: 'vietnam', type: 'international' },
  'VietJet Air': { country: 'vietnam', type: 'regional' },
  'Bamboo Airways': { country: 'vietnam', type: 'regional' },
};

function sanitizeFilename(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getFileExt(filename) {
  const match = filename.match(/\.([^.]+)$/);
  return match ? match[1] : '';
}

async function main() {
  const manifestPath = path.join(APAC_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('Manifest not found:', manifestPath);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const downloaded = manifest.filter(r => r.status === 'downloaded' && r.file);

  // Track which airlines were moved
  const countryData = {};

  for (const entry of downloaded) {
    const info = AIRLINE_MAP[entry.name];
    if (!info) {
      console.log(`Warning: No country mapping for "${entry.name}" — skipping`);
      continue;
    }

    const { country, type } = info;
    const countryDir = path.join(APAC_DIR, country);
    const typeDir = path.join(countryDir, `${type}-operators`);
    ensureDir(typeDir);

    const srcFile = path.join(APAC_DIR, entry.file);
    const destFile = path.join(typeDir, entry.file);

    if (!fs.existsSync(srcFile)) {
      console.log(`Warning: Source file not found: ${srcFile}`);
      continue;
    }

    fs.renameSync(srcFile, destFile);
    console.log(`Moved: ${entry.file} -> ${country}/${type}-operators/`);

    if (!countryData[country]) {
      countryData[country] = { international: [], regional: [] };
    }
    countryData[country][type].push({
      name: entry.name,
      file: entry.file,
      title: entry.title,
      url: entry.url,
      width: entry.width,
      height: entry.height,
      mime: entry.mime,
    });
  }

  // Create country-info.json for each country
  for (const [country, data] of Object.entries(countryData)) {
    const countryDir = path.join(APAC_DIR, country);
    const infoPath = path.join(countryDir, 'country-info.json');
    fs.writeFileSync(infoPath, JSON.stringify({
      country,
      region: 'APAC',
      totalOperators: data.international.length + data.regional.length,
      internationalOperators: data.international,
      regionalOperators: data.regional,
    }, null, 2));
    console.log(`Created: ${country}/country-info.json`);
  }

  // Create APAC region overview
  const apacOverview = {
    region: 'APAC',
    totalCountries: Object.keys(countryData).length,
    totalOperators: downloaded.length,
    countries: Object.entries(countryData).map(([country, data]) => ({
      country,
      internationalCount: data.international.length,
      regionalCount: data.regional.length,
      totalCount: data.international.length + data.regional.length,
    })),
  };
  fs.writeFileSync(path.join(APAC_DIR, 'apac-region.json'), JSON.stringify(apacOverview, null, 2));
  console.log('Created: apac-region.json');

  // Update manifest to new paths
  const updatedManifest = downloaded.map(entry => {
    const info = AIRLINE_MAP[entry.name];
    if (!info) return entry;
    return {
      ...entry,
      path: `${info.country}/${info.type}-operators/${entry.file}`,
    };
  });
  fs.writeFileSync(manifestPath, JSON.stringify(updatedManifest, null, 2));

  console.log('\nDone.');
  console.log(`Countries: ${Object.keys(countryData).length}`);
  console.log(`Operators organized: ${downloaded.length}`);
}

main().catch(console.error);
