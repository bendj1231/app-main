const fs = require('fs');

const manifestPath = 'public/images/airline-logos/APAC/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const updates = {
  'philippines-airasia.svg': { url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/AirAsia_New_Logo.svg', status: 'downloaded', width: 555, height: 320 },
  'cebgo.png': { url: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Logo_of_Cebgo.png', status: 'downloaded', width: 439, height: 178 },
  'sunlight-air.png': { url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Sunlight-Air-PH-Logo.png', status: 'downloaded', width: 3897, height: 1372 }
};

let changed = 0;
manifest.forEach(entry => {
  const base = entry.path.split('/').pop();
  if (updates[base]) {
    Object.assign(entry, updates[base]);
    changed++;
  }
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Updated manifest entries:', changed);

const phDir = 'public/images/airline-logos/APAC/philippines/regional-operators';
const files = fs.readdirSync(phDir);
console.log('Philippines regional operators files:', files.length);
files.forEach(f => console.log('  ' + f));
