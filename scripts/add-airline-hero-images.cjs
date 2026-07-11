/**
 * Add heroImage paths to the AIRLINES array in PortalAirlineExpectationsPage.tsx
 * Maps each airline id to its downloaded aircraft livery image path.
 */

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'portal', 'pages', 'PortalAirlineExpectationsPage.tsx');

// Mapping: airline id -> heroImage path (relative to /public)
const HERO_IMAGES = {
  // Middle East
  qatar: '/images/airline-logos/middle-east/qatar-airways-aircraft.jpg',
  emirates: '/images/airline-logos/middle-east/emirates-aircraft.jpg',
  etihad: '/images/airline-logos/middle-east/etihad-airways-aircraft.jpg',
  elal: '/images/airline-logos/middle-east/el-al-aircraft.jpg',
  royaljordanian: '/images/airline-logos/middle-east/royal-jordanian-aircraft.jpg',
  saudia: '/images/airline-logos/middle-east/saudia-aircraft.jpg',
  omanair: '/images/airline-logos/middle-east/oman-air-aircraft.jpg',

  // APAC - International
  singapore: '/images/airline-logos/APAC/singapore/international-operators/singapore-airlines-aircraft.jpg',
  cathay: '/images/airline-logos/APAC/hong-kong/international-operators/cathay-pacific-aircraft.jpg',
  ana: '/images/airline-logos/APAC/japan/international-operators/all-nippon-airways-aircraft.jpg',
  jal: '/images/airline-logos/APAC/japan/international-operators/japan-airlines-aircraft.jpg',
  korean: '/images/airline-logos/APAC/south-korea/international-operators/korean-air-aircraft.jpg',
  asiana: '/images/airline-logos/APAC/south-korea/international-operators/asiana-airlines-aircraft.jpg',
  thai: '/images/airline-logos/APAC/thailand/international-operators/thai-airways-aircraft.jpg',
  malaysia: '/images/airline-logos/APAC/malaysia/international-operators/malaysia-airlines-aircraft.jpg',
  garuda: '/images/airline-logos/APAC/indonesia/international-operators/garuda-indonesia-aircraft.jpg',
  philippine: '/images/airline-logos/APAC/philippines/international-operators/philippine-airlines-aircraft.jpg',
  vietnam: '/images/airline-logos/APAC/vietnam/international-operators/vietnam-airlines-aircraft.jpg',
  china: '/images/airline-logos/APAC/china/international-operators/air-china-aircraft.jpg',
  chinaeastern: '/images/airline-logos/APAC/china/international-operators/china-eastern-airlines-aircraft.jpg',
  chinasouthern: '/images/airline-logos/APAC/china/international-operators/china-southern-airlines-aircraft.jpg',
  airindia: '/images/airline-logos/APAC/india/international-operators/air-india-aircraft.jpg',
  srilankan: '/images/airline-logos/APAC/sri-lanka/international-operators/srilankan-airlines-aircraft.jpg',
  nepal: '/images/airline-logos/APAC/nepal/international-operators/nepal-airlines-aircraft.jpg',
  biman: '/images/airline-logos/APAC/bangladesh/international-operators/biman-bangladesh-airlines-aircraft.jpg',

  // APAC - Regional
  cathaydragon: '/images/airline-logos/APAC/hong-kong/international-operators/cathay-dragon-aircraft.jpg',
  hkexpress: '/images/airline-logos/APAC/hong-kong/regional-operators/hong-kong-express-aircraft.jpg',
  scoot: '/images/airline-logos/APAC/singapore/regional-operators/scoot-aircraft.jpg',
  jetstar: '/images/airline-logos/APAC/australia/international-operators/jetstar-aircraft.jpg',
  peach: '/images/airline-logos/APAC/japan/regional-operators/peach-aviation-aircraft.jpg',
  spring: '/images/airline-logos/APAC/china/regional-operators/spring-airlines-aircraft.jpg',
  indigo: '/images/airline-logos/APAC/india/regional-operators/indigo-aircraft.jpg',
  spicejet: '/images/airline-logos/APAC/india/regional-operators/spicejet-aircraft.jpg',
  aigle: '/images/airline-logos/asia/aigle-aircraft.jpg',
  cebupacific: '/images/airline-logos/APAC/philippines/regional-operators/cebu-pacific-aircraft.jpg',

  // Europe
  lufthansa: '/images/airline-logos/europe/lufthansa-aircraft.jpg',
  british: '/images/airline-logos/europe/british-airways-aircraft.jpg',
  airfrance: '/images/airline-logos/europe/airfrance-aircraft.jpg',
  klm: '/images/airline-logos/europe/klm-aircraft.jpg',
  swiss: '/images/airline-logos/europe/swiss-aircraft.jpg',
  turkish: '/images/airline-logos/europe/turkish-aircraft.jpg',
  iberia: '/images/airline-logos/europe/iberia-aircraft.jpg',
  alitalia: '/images/airline-logos/europe/alitalia-aircraft.jpg',
  austrian: '/images/airline-logos/europe/austrian-aircraft.jpg',
  brussels: '/images/airline-logos/europe/brussels-aircraft.jpg',
  sas: '/images/airline-logos/europe/sas-aircraft.jpg',
  finnair: '/images/airline-logos/europe/finnair-aircraft.jpg',
  tap: '/images/airline-logos/europe/tap-aircraft.jpg',
  aegean: '/images/airline-logos/europe/aegean-aircraft.jpg',
  lot: '/images/airline-logos/europe/lot-aircraft.jpg',
  czech: '/images/airline-logos/europe/czech-aircraft.jpg',
  norwegian: '/images/airline-logos/europe/norwegian-aircraft.jpg',
  icelandair: '/images/airline-logos/europe/icelandair-aircraft.jpg',
  virginatlantic: '/images/airline-logos/europe/virginatlantic-aircraft.jpg',

  // Americas
  delta: '/images/airline-logos/americas/delta-aircraft.jpg',
  american: '/images/airline-logos/americas/american-airlines-aircraft.jpg',
  united: '/images/airline-logos/americas/united-aircraft.jpg',
  southwest: '/images/airline-logos/americas/southwest-aircraft.jpg',
  alaska: '/images/airline-logos/americas/alaska-aircraft.jpg',
  jetblue: '/images/airline-logos/americas/jetblue-aircraft.jpg',
  aircanada: '/images/airline-logos/americas/aircanada-aircraft.jpg',
  westjet: '/images/airline-logos/americas/westjet-aircraft.jpg',
  latam: '/images/airline-logos/americas/latam-aircraft.jpg',
  avianca: '/images/airline-logos/americas/avianca-aircraft.jpg',
  aeromexico: '/images/airline-logos/americas/aeromexico-aircraft.jpg',
  copaair: '/images/airline-logos/americas/copaair-aircraft.jpg',
  gol: '/images/airline-logos/americas/gol-aircraft.jpg',

  // Oceania
  qantas: '/images/airline-logos/APAC/australia/international-operators/qantas-aircraft.jpg',
  virginaustralia: '/images/airline-logos/APAC/australia/international-operators/virgin-australia-aircraft.jpg',

  // Africa
  egyptair: '/images/airline-logos/africa/egyptair-aircraft.jpg',
  ethiopian: '/images/airline-logos/africa/ethiopian-aircraft.jpg',
  southafrican: '/images/airline-logos/africa/southafrican-aircraft.jpg',
};

let src = fs.readFileSync(FILE_PATH, 'utf8');
let added = 0;
let skipped = 0;

for (const [id, heroPath] of Object.entries(HERO_IMAGES)) {
  // Find the airline entry by id and add heroImage after the logo line
  // Pattern: id: 'xxx',\n    logo: '...',\n    (or logo: '...',\n    name: '...')
  // We need to insert heroImage after the logo line

  // Check if heroImage already exists for this airline
  const idPattern = `id: '${id}',`;
  const idIdx = src.indexOf(idPattern);
  if (idIdx === -1) {
    console.error(`[NOT FOUND] Airline id '${id}' not found in file`);
    continue;
  }

  // Find the next occurrence of "heroImage" after this id - if it exists, skip
  const nextEntryIdx = src.indexOf('id: \'', idIdx + 1);
  const searchEnd = nextEntryIdx === -1 ? src.length : nextEntryIdx;
  const section = src.substring(idIdx, searchEnd);

  if (section.includes('heroImage:')) {
    console.log(`[SKIP] ${id} - heroImage already exists`);
    skipped++;
    continue;
  }

  // Find the logo line after this id
  const logoIdx = src.indexOf('logo:', idIdx);
  if (logoIdx === -1 || logoIdx > searchEnd) {
    console.error(`[ERROR] No logo field found for ${id}`);
    continue;
  }

  // Find the end of the logo line (the next newline after the logo value)
  const logoLineEnd = src.indexOf('\n', logoIdx);
  if (logoLineEnd === -1) {
    console.error(`[ERROR] Could not find end of logo line for ${id}`);
    continue;
  }

  // Insert heroImage after the logo line
  const indent = '    ';
  const heroLine = `\n${indent}heroImage: '${heroPath}',`;
  src = src.substring(0, logoLineEnd) + heroLine + src.substring(logoLineEnd);
  added++;
  console.log(`[ADDED] ${id} -> ${heroPath}`);
}

fs.writeFileSync(FILE_PATH, src);
console.log(`\nDone! Added: ${added}, Skipped: ${skipped}`);
