const fs = require('fs');

const countryInfoPath = 'public/images/airline-logos/APAC/philippines/country-info.json';
const countryInfo = JSON.parse(fs.readFileSync(countryInfoPath, 'utf8'));

countryInfo.regionalOperators.push({
  name: 'AirTrav',
  file: 'airtrav.png',
  title: 'AirTrav Philippines',
  url: null,
  width: null,
  height: null,
  mime: null,
  note: 'Seaplane and charter operator (Manila-based)'
});

countryInfo.totalOperators = countryInfo.internationalOperators.length + countryInfo.regionalOperators.length;
fs.writeFileSync(countryInfoPath, JSON.stringify(countryInfo, null, 2));
console.log('Updated country-info.json: ' + countryInfo.regionalOperators.length + ' regional operators');

const apacPath = 'public/images/airline-logos/APAC/apac-region.json';
const apac = JSON.parse(fs.readFileSync(apacPath, 'utf8'));
const phEntry = apac.countries.find(c => c.country === 'philippines');
if (phEntry) {
  phEntry.regionalCount = countryInfo.regionalOperators.length;
  phEntry.totalCount = countryInfo.totalOperators;
}
apac.totalOperators = apac.countries.reduce((sum, c) => sum + c.totalCount, 0);
fs.writeFileSync(apacPath, JSON.stringify(apac, null, 2));
console.log('Updated apac-region.json: total operators = ' + apac.totalOperators);

const manifestPath = 'public/images/airline-logos/APAC/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.push({
  name: 'AirTrav',
  status: 'pending',
  file: 'airtrav.png',
  title: 'AirTrav Philippines',
  url: null,
  width: null,
  height: null,
  mime: null,
  path: 'philippines/regional-operators/airtrav.png',
  note: 'Seaplane and charter operator (Manila-based)'
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Updated manifest.json');
