const fs = require('fs');

const countryInfoPath = 'public/images/airline-logos/APAC/philippines/country-info.json';
const countryInfo = JSON.parse(fs.readFileSync(countryInfoPath, 'utf8'));

countryInfo.regionalOperators.forEach(op => {
  if (op.name === 'SkyJet Airlines') {
    op.url = 'https://upload.wikimedia.org/wikipedia/commons/f/f8/SkyJet_Airlines_Logo.png';
    op.width = 1734;
    op.height = 387;
    op.mime = 'image/png';
  }
  if (op.name === 'Sky Pasada') {
    op.url = 'https://app.skypasada.com/images/skypasada-logo-colored-01.png';
    op.width = 1920;
    op.height = 504;
    op.mime = 'image/png';
  }
  if (op.name === 'Royal Air Philippines') {
    op.url = 'https://content.airhex.com/content/logos/airlines_RW_350_100_r.png';
    op.width = 350;
    op.height = 100;
    op.mime = 'image/png';
    op.note = 'Demo image from Airhex';
  }
  if (op.name === 'Air Juan') {
    op.url = 'https://content.airhex.com/content/logos/airlines_AO_350_100_r.png';
    op.width = 350;
    op.height = 100;
    op.mime = 'image/png';
    op.note = 'Demo image from Airhex';
  }
});

fs.writeFileSync(countryInfoPath, JSON.stringify(countryInfo, null, 2));
console.log('Updated country-info.json');

const manifestPath = 'public/images/airline-logos/APAC/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.forEach(entry => {
  if (entry.name === 'SkyJet Airlines') {
    entry.status = 'downloaded';
    entry.url = 'https://upload.wikimedia.org/wikipedia/commons/f/f8/SkyJet_Airlines_Logo.png';
    entry.width = 1734;
    entry.height = 387;
    entry.mime = 'image/png';
  }
  if (entry.name === 'Sky Pasada') {
    entry.status = 'downloaded';
    entry.url = 'https://app.skypasada.com/images/skypasada-logo-colored-01.png';
    entry.width = 1920;
    entry.height = 504;
    entry.mime = 'image/png';
  }
  if (entry.name === 'Royal Air Philippines') {
    entry.status = 'downloaded';
    entry.url = 'https://content.airhex.com/content/logos/airlines_RW_350_100_r.png';
    entry.width = 350;
    entry.height = 100;
    entry.mime = 'image/png';
    entry.note = 'Demo image from Airhex';
  }
  if (entry.name === 'Air Juan') {
    entry.status = 'downloaded';
    entry.url = 'https://content.airhex.com/content/logos/airlines_AO_350_100_r.png';
    entry.width = 350;
    entry.height = 100;
    entry.mime = 'image/png';
    entry.note = 'Demo image from Airhex';
  }
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Updated manifest.json');
