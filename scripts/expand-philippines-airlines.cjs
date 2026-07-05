const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = path.resolve(__dirname, '../public/images/airline-logos/APAC');
const PH_DIR = path.join(BASE_DIR, 'philippines');
const REGIONAL_DIR = path.join(PH_DIR, 'regional-operators');
const INTERNATIONAL_DIR = path.join(PH_DIR, 'international-operators');

// Ensure directories exist
[REGIONAL_DIR, INTERNATIONAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Airlines to add
const NEW_REGIONAL_AIRLINES = [
  {
    name: 'Philippines AirAsia',
    file: 'philippines-airasia.svg',
    title: 'File:AirAsia Logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/AirAsia_Logo.svg',
    width: 555,
    height: 320,
    mime: 'image/svg+xml',
    note: 'Uses parent AirAsia brand logo'
  },
  {
    name: 'Cebgo',
    file: 'cebgo.png',
    title: 'File:Logo of Cebgo.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Logo_of_Cebgo.png',
    width: 300,
    height: 100,
    mime: 'image/png',
    note: 'Cebu Pacific regional subsidiary'
  },
  {
    name: 'Sunlight Air',
    file: 'sunlight-air.png',
    title: 'File:Sunlight-Air-PH-Logo.png',
    url: 'https://upload.wikimedia.org/wikipedia/en/c/c0/Sunlight-Air-PH-Logo.png',
    width: 300,
    height: 100,
    mime: 'image/png',
    note: 'Boutique regional airline based in Clark'
  },
  {
    name: 'SkyJet Airlines',
    file: 'skyjet-airlines.png',
    title: 'SkyJet Airlines',
    url: null, // No Wikimedia logo found
    width: null,
    height: null,
    mime: null,
    note: 'Leisure airline serving Batanes, Siargao, Coron'
  },
  {
    name: 'Royal Air Philippines',
    file: 'royal-air-philippines.png',
    title: 'Royal Air Philippines',
    url: null,
    width: null,
    height: null,
    mime: null,
    note: 'Low-cost carrier based in Clark'
  },
  {
    name: 'Air Juan',
    file: 'air-juan.png',
    title: 'Air Juan',
    url: null,
    width: null,
    height: null,
    mime: null,
    note: 'Seaplane and domestic airline'
  },
  {
    name: 'Sky Pasada',
    file: 'sky-pasada.png',
    title: 'Sky Pasada',
    url: null,
    width: null,
    height: null,
    mime: null,
    note: 'Northern Luzon regional carrier'
  },
  {
    name: 'Bangsamoro Airways',
    file: 'bangsamoro-airways.png',
    title: 'Bangsamoro Airways',
    url: null,
    width: null,
    height: null,
    mime: null,
    note: 'BARMM regional airline (est. 2024)'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { timeout: 15000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, { timeout: 15000 }, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
          file.on('error', reject);
        }).on('error', reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`Status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

// Update country-info.json
const countryInfoPath = path.join(PH_DIR, 'country-info.json');
const countryInfo = JSON.parse(fs.readFileSync(countryInfoPath, 'utf8'));

// Add new regional operators
for (const airline of NEW_REGIONAL_AIRLINES) {
  countryInfo.regionalOperators.push({
    name: airline.name,
    file: airline.file,
    title: airline.title,
    url: airline.url,
    width: airline.width,
    height: airline.height,
    mime: airline.mime
  });
}

countryInfo.totalOperators = countryInfo.internationalOperators.length + countryInfo.regionalOperators.length;
fs.writeFileSync(countryInfoPath, JSON.stringify(countryInfo, null, 2));
console.log('Updated country-info.json: ' + countryInfo.regionalOperators.length + ' regional operators');

// Update apac-region.json
const apacPath = path.join(BASE_DIR, 'apac-region.json');
const apac = JSON.parse(fs.readFileSync(apacPath, 'utf8'));
const phEntry = apac.countries.find(c => c.country === 'philippines');
if (phEntry) {
  phEntry.regionalCount = countryInfo.regionalOperators.length;
  phEntry.totalCount = countryInfo.totalOperators;
}
apac.totalOperators = apac.countries.reduce((sum, c) => sum + c.totalCount, 0);
fs.writeFileSync(apacPath, JSON.stringify(apac, null, 2));
console.log('Updated apac-region.json: total operators = ' + apac.totalOperators);

// Update manifest.json
const manifestPath = path.join(BASE_DIR, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

for (const airline of NEW_REGIONAL_AIRLINES) {
  manifest.push({
    name: airline.name,
    status: airline.url ? 'downloaded' : 'pending',
    file: airline.file,
    title: airline.title,
    url: airline.url,
    width: airline.width,
    height: airline.height,
    mime: airline.mime,
    path: 'philippines/regional-operators/' + airline.file,
    note: airline.note
  });
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Updated manifest.json');

// Download logos where URL is available
(async () => {
  for (const airline of NEW_REGIONAL_AIRLINES) {
    if (!airline.url) {
      console.log('Skipped (no URL): ' + airline.name);
      continue;
    }
    const dest = path.join(REGIONAL_DIR, airline.file);
    try {
      await downloadFile(airline.url, dest);
      const stats = fs.statSync(dest);
      console.log('Downloaded: ' + airline.name + ' (' + stats.size + ' bytes)');
    } catch (err) {
      console.log('Failed: ' + airline.name + ' - ' + err.message);
    }
  }
  console.log('\nDone. Philippines now has:');
  console.log('  International: ' + countryInfo.internationalOperators.length);
  console.log('  Regional: ' + countryInfo.regionalOperators.length);
})();
