#!/usr/bin/env node
/**
 * Reorganizes the africa, americas, europe, and middle-east folders
 * to use the same country/international-operators/regional-operators
 * structure as APAC.
 *
 * Also cleans up duplicate -logo.svg files from earlier download attempts.
 * Updates all paths in PortalAirlineExpectationsPage.tsx.
 */

const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'images', 'airline-logos');
const PAGE_FILE = path.join(__dirname, '..', 'portal/pages/PortalAirlineExpectationsPage.tsx');

// Mapping: current file path (relative to airline-logos/) -> new path
const REORGANIZE = {
  // ===== AFRICA =====
  // Egypt
  'africa/egyptair-aircraft.jpg': 'africa/egypt/international-operators/egyptair-aircraft.jpg',
  'africa/egyptair.png': 'africa/egypt/international-operators/egyptair.png',
  // Ethiopia
  'africa/ethiopian-aircraft.jpg': 'africa/ethiopia/international-operators/ethiopian-aircraft.jpg',
  'africa/ethiopian.png': 'africa/ethiopia/international-operators/ethiopian.png',
  // South Africa
  'africa/southafrican-aircraft.jpg': 'africa/south-africa/international-operators/southafrican-aircraft.jpg',
  'africa/southafrican.png': 'africa/south-africa/international-operators/southafrican.png',
  'africa/flysafair-aircraft.jpg': 'africa/south-africa/regional-operators/flysafair-aircraft.jpg',
  'africa/mango-aircraft.jpg': 'africa/south-africa/regional-operators/mango-aircraft.jpg',
  // Kenya
  'africa/fly540-aircraft.jpg': 'africa/kenya/regional-operators/fly540-aircraft.jpg',
  'africa/jambojet-aircraft.jpg': 'africa/kenya/regional-operators/jambojet-aircraft.jpg',
  'africa/kenya-airways.svg': 'africa/kenya/international-operators/kenya-airways.svg',
  // Mauritius
  'africa/air-mauritius.svg': 'africa/mauritius/international-operators/air-mauritius.svg',
  // Morocco
  'africa/royal-air-maroc.svg': 'africa/morocco/international-operators/royal-air-maroc.svg',
  // Tunisia
  'africa/tunisair.svg': 'africa/tunisia/international-operators/tunisair.svg',
  // Algeria
  'africa/air-algerie.svg': 'africa/algeria/international-operators/air-algerie.svg',
  // Rwanda
  'africa/rwandair.svg': 'africa/rwanda/international-operators/rwandair.svg',
  // Seychelles
  'africa/air-seychelles-logo.svg': 'africa/seychelles/international-operators/air-seychelles.svg',

  // ===== AMERICAS =====
  // United States
  'americas/american-airlines-aircraft.jpg': 'americas/united-states/international-operators/american-airlines-aircraft.jpg',
  'americas/delta-aircraft.jpg': 'americas/united-states/international-operators/delta-aircraft.jpg',
  'americas/united-aircraft.jpg': 'americas/united-states/international-operators/united-aircraft.jpg',
  'americas/united.png': 'americas/united-states/international-operators/united.png',
  'americas/southwest-aircraft.jpg': 'americas/united-states/international-operators/southwest-aircraft.jpg',
  'americas/alaska-aircraft.jpg': 'americas/united-states/international-operators/alaska-aircraft.jpg',
  'americas/alaska.png': 'americas/united-states/international-operators/alaska.png',
  'americas/jetblue-aircraft.jpg': 'americas/united-states/international-operators/jetblue-aircraft.jpg',
  'americas/jetblue.png': 'americas/united-states/international-operators/jetblue.png',
  'americas/spirit-aircraft.jpg': 'americas/united-states/regional-operators/spirit-aircraft.jpg',
  'americas/frontier.svg': 'americas/united-states/regional-operators/frontier.svg',
  'americas/allegiant.svg': 'americas/united-states/regional-operators/allegiant.svg',
  'americas/hawaiian-airlines.svg': 'americas/united-states/regional-operators/hawaiian-airlines.svg',
  // Canada
  'americas/aircanada-aircraft.jpg': 'americas/canada/international-operators/aircanada-aircraft.jpg',
  'americas/aircanada.png': 'americas/canada/international-operators/aircanada.png',
  'americas/westjet-aircraft.jpg': 'americas/canada/international-operators/westjet-aircraft.jpg',
  'americas/westjet.png': 'americas/canada/international-operators/westjet.png',
  'americas/air-canada-rouge-aircraft.jpg': 'americas/canada/regional-operators/air-canada-rouge-aircraft.jpg',
  'americas/air-transat.svg': 'americas/canada/regional-operators/air-transat.svg',
  'americas/porter-airlines.svg': 'americas/canada/regional-operators/porter-airlines.svg',
  // Chile
  'americas/latam-aircraft.jpg': 'americas/chile/international-operators/latam-aircraft.jpg',
  'americas/latam.png': 'americas/chile/international-operators/latam.png',
  'americas/sky-airline.svg': 'americas/chile/regional-operators/sky-airline.svg',
  'americas/jetsmart.svg': 'americas/chile/regional-operators/jetsmart.svg',
  // Colombia
  'americas/avianca-aircraft.jpg': 'americas/colombia/international-operators/avianca-aircraft.jpg',
  'americas/avianca.png': 'americas/colombia/international-operators/avianca.png',
  // Panama
  'americas/copaair-aircraft.jpg': 'americas/panama/international-operators/copaair-aircraft.jpg',
  'americas/copaair.png': 'americas/panama/international-operators/copaair.png',
  // Mexico
  'americas/aeromexico-aircraft.jpg': 'americas/mexico/international-operators/aeromexico-aircraft.jpg',
  'americas/aeromexico.png': 'americas/mexico/international-operators/aeromexico.png',
  // Brazil
  'americas/gol-aircraft.jpg': 'americas/brazil/international-operators/gol-aircraft.jpg',
  'americas/gol.png': 'americas/brazil/international-operators/gol.png',
  'americas/azul.svg': 'americas/brazil/regional-operators/azul.svg',
  // Argentina
  'americas/aerolineas-argentinas.svg': 'americas/argentina/international-operators/aerolineas-argentinas.svg',

  // ===== EUROPE =====
  // Germany
  'europe/lufthansa-aircraft.jpg': 'europe/germany/international-operators/lufthansa-aircraft.jpg',
  // United Kingdom
  'europe/british-airways-aircraft.jpg': 'europe/united-kingdom/international-operators/british-airways-aircraft.jpg',
  'europe/british.svg': 'europe/united-kingdom/international-operators/british-airways.svg',
  'europe/virginatlantic-aircraft.jpg': 'europe/united-kingdom/international-operators/virginatlantic-aircraft.jpg',
  'europe/virginatlantic.png': 'europe/united-kingdom/international-operators/virginatlantic.png',
  'europe/easyjet.svg': 'europe/united-kingdom/regional-operators/easyjet.svg',
  'europe/jet2.svg': 'europe/united-kingdom/regional-operators/jet2.svg',
  'europe/tui-airways.svg': 'europe/united-kingdom/regional-operators/tui-airways.svg',
  // Ireland
  'europe/ryanair.svg': 'europe/ireland/international-operators/ryanair.svg',
  // France
  'europe/airfrance-aircraft.jpg': 'europe/france/international-operators/airfrance-aircraft.jpg',
  'europe/airfrance.svg': 'europe/france/international-operators/airfrance.svg',
  // Netherlands
  'europe/klm-aircraft.jpg': 'europe/netherlands/international-operators/klm-aircraft.jpg',
  'europe/klm.svg': 'europe/netherlands/international-operators/klm.svg',
  // Switzerland
  'europe/swiss-aircraft.jpg': 'europe/switzerland/international-operators/swiss-aircraft.jpg',
  'europe/swiss.svg': 'europe/switzerland/international-operators/swiss.svg',
  // Turkey
  'europe/turkish-aircraft.jpg': 'europe/turkey/international-operators/turkish-aircraft.jpg',
  'europe/turkish.svg': 'europe/turkey/international-operators/turkish.svg',
  // Spain
  'europe/iberia-aircraft.jpg': 'europe/spain/international-operators/iberia-aircraft.jpg',
  'europe/iberia.svg': 'europe/spain/international-operators/iberia.svg',
  'europe/vueling.svg': 'europe/spain/regional-operators/vueling.svg',
  'europe/air-europa.svg': 'europe/spain/regional-operators/air-europa.svg',
  // Italy
  'europe/alitalia-aircraft.jpg': 'europe/italy/international-operators/alitalia-aircraft.jpg',
  'europe/alitalia.png': 'europe/italy/international-operators/alitalia.png',
  'europe/ita-airways-aircraft.jpg': 'europe/italy/international-operators/ita-airways-aircraft.jpg',
  // Austria
  'europe/austrian-aircraft.jpg': 'europe/austria/international-operators/austrian-aircraft.jpg',
  'europe/austrian.svg': 'europe/austria/international-operators/austrian.svg',
  // Belgium
  'europe/brussels-aircraft.jpg': 'europe/belgium/international-operators/brussels-aircraft.jpg',
  'europe/brussels.png': 'europe/belgium/international-operators/brussels.png',
  // Denmark (SAS is Scandinavian, HQ in Stockholm but main hub Copenhagen)
  'europe/sas-aircraft.jpg': 'europe/denmark/international-operators/sas-aircraft.jpg',
  'europe/sas.png': 'europe/denmark/international-operators/sas.png',
  // Finland
  'europe/finnair-aircraft.jpg': 'europe/finland/international-operators/finnair-aircraft.jpg',
  'europe/finnair.png': 'europe/finland/international-operators/finnair.png',
  // Portugal
  'europe/tap-aircraft.jpg': 'europe/portugal/international-operators/tap-aircraft.jpg',
  'europe/tap.png': 'europe/portugal/international-operators/tap.png',
  // Greece
  'europe/aegean-aircraft.jpg': 'europe/greece/international-operators/aegean-aircraft.jpg',
  'europe/aegean.png': 'europe/greece/international-operators/aegean.png',
  // Poland
  'europe/lot-aircraft.jpg': 'europe/poland/international-operators/lot-aircraft.jpg',
  'europe/lot.png': 'europe/poland/international-operators/lot.png',
  // Czech Republic
  'europe/czech-aircraft.jpg': 'europe/czech-republic/international-operators/czech-aircraft.jpg',
  'europe/czech.png': 'europe/czech-republic/international-operators/czech.png',
  // Norway
  'europe/norwegian-aircraft.jpg': 'europe/norway/international-operators/norwegian-aircraft.jpg',
  'europe/norwegian.png': 'europe/norway/international-operators/norwegian.png',
  // Iceland
  'europe/icelandair-aircraft.jpg': 'europe/iceland/international-operators/icelandair-aircraft.jpg',
  'europe/icelandair.png': 'europe/iceland/international-operators/icelandair.png',
  // Malta
  'europe/air-malta-aircraft.jpg': 'europe/malta/international-operators/air-malta-aircraft.jpg',
  // Serbia
  'europe/air-serbia-aircraft.jpg': 'europe/serbia/international-operators/air-serbia-aircraft.jpg',
  // Croatia
  'europe/croatia-airlines-aircraft.jpg': 'europe/croatia/international-operators/croatia-airlines-aircraft.jpg',
  // Romania
  'europe/tarom-aircraft.jpg': 'europe/romania/international-operators/tarom-aircraft.jpg',
  // Ukraine
  'europe/ukraine-international-airlines-aircraft.jpg': 'europe/ukraine/international-operators/ukraine-international-airlines-aircraft.jpg',
  // Russia
  'europe/aeroflot.svg': 'europe/russia/international-operators/aeroflot.svg',
  // Latvia
  'europe/airbaltic.svg': 'europe/latvia/international-operators/airbaltic.svg',
  // Hungary
  'europe/wizz-air.svg': 'europe/hungary/international-operators/wizz-air.svg',

  // ===== MIDDLE EAST =====
  // Qatar
  'middle-east/qatar-airways-aircraft.jpg': 'middle-east/qatar/international-operators/qatar-airways-aircraft.jpg',
  'middle-east/qatar-airways.svg': 'middle-east/qatar/international-operators/qatar-airways.svg',
  // UAE
  'middle-east/emirates-aircraft.jpg': 'middle-east/united-arab-emirates/international-operators/emirates-aircraft.jpg',
  'middle-east/emirates.svg': 'middle-east/united-arab-emirates/international-operators/emirates.svg',
  'middle-east/etihad-airways-aircraft.jpg': 'middle-east/united-arab-emirates/international-operators/etihad-airways-aircraft.jpg',
  'middle-east/etihad-airways.svg': 'middle-east/united-arab-emirates/international-operators/etihad-airways.svg',
  'middle-east/flydubai-aircraft.jpg': 'middle-east/united-arab-emirates/regional-operators/flydubai-aircraft.jpg',
  'middle-east/air-arabia.svg': 'middle-east/united-arab-emirates/regional-operators/air-arabia.svg',
  // Israel
  'middle-east/el-al-aircraft.jpg': 'middle-east/israel/international-operators/el-al-aircraft.jpg',
  'middle-east/el-al.svg': 'middle-east/israel/international-operators/el-al.svg',
  // Jordan
  'middle-east/royal-jordanian-aircraft.jpg': 'middle-east/jordan/international-operators/royal-jordanian-aircraft.jpg',
  'middle-east/royal-jordanian.jpg': 'middle-east/jordan/international-operators/royal-jordanian.jpg',
  // Saudi Arabia
  'middle-east/saudia-aircraft.jpg': 'middle-east/saudi-arabia/international-operators/saudia-aircraft.jpg',
  'middle-east/saudia.png': 'middle-east/saudi-arabia/international-operators/saudia.png',
  'middle-east/flynas-aircraft.jpg': 'middle-east/saudi-arabia/regional-operators/flynas-aircraft.jpg',
  // Oman
  'middle-east/oman-air-aircraft.jpg': 'middle-east/oman/international-operators/oman-air-aircraft.jpg',
  'middle-east/oman-air.png': 'middle-east/oman/international-operators/oman-air.png',
  // Bahrain
  'middle-east/gulf-air.svg': 'middle-east/bahrain/international-operators/gulf-air.svg',
  // Kuwait
  'middle-east/kuwait-airways.svg': 'middle-east/kuwait/international-operators/kuwait-airways.svg',
};

// Duplicate -logo.svg files to delete (replaced by proper .svg files)
const DUPLICATES_TO_DELETE = [
  'africa/air-algerie-logo.svg',
  'africa/air-mauritius-logo.svg',
  'africa/kenya-airways-logo.svg',
  'africa/royal-air-maroc-logo.svg',
  'africa/rwandair-logo.svg',
  'africa/tunisair-logo.svg',
  'americas/aerolineas-argentinas-logo.svg',
  'americas/air-transat-logo.svg',
  'americas/allegiant-logo.svg',
  'americas/azul-logo.svg',
  'americas/frontier-logo.svg',
  'americas/hawaiian-airlines-logo.svg',
  'americas/jetsmart-logo.svg',
  'americas/porter-airlines-logo.svg',
  'americas/sky-airline-logo.svg',
  'europe/aeroflot-logo.svg',
  'europe/air-europa-logo.svg',
  'europe/airbaltic-logo.svg',
  'europe/easyjet-logo.svg',
  'europe/jet2-logo.svg',
  'europe/ryanair-logo.svg',
  'europe/tui-airways-logo.svg',
  'europe/vueling-logo.svg',
  'europe/wizz-air-logo.svg',
  'middle-east/air-arabia-logo.svg',
  'middle-east/gulf-air-logo.svg',
  'middle-east/kuwait-airways-logo.svg',
];

function main() {
  let moved = 0;
  let deleted = 0;
  let errors = [];

  // Step 1: Delete duplicate -logo.svg files
  console.log('=== DELETING DUPLICATES ===');
  for (const dup of DUPLICATES_TO_DELETE) {
    const dupPath = path.join(LOGOS_DIR, dup);
    if (fs.existsSync(dupPath)) {
      fs.unlinkSync(dupPath);
      deleted++;
      console.log(`  Deleted: ${dup}`);
    }
  }

  // Step 2: Move files to new country-organized structure
  console.log('\n=== MOVING FILES ===');
  for (const [srcRel, destRel] of Object.entries(REORGANIZE)) {
    const srcPath = path.join(LOGOS_DIR, srcRel);
    const destPath = path.join(LOGOS_DIR, destRel);

    if (!fs.existsSync(srcPath)) {
      // Check if already moved
      if (fs.existsSync(destPath)) {
        console.log(`  SKIP: ${srcRel} -> already at ${destRel}`);
        continue;
      }
      errors.push(`Source not found: ${srcRel}`);
      continue;
    }

    // Create destination directory
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    // Move file
    fs.renameSync(srcPath, destPath);
    moved++;
    console.log(`  ${srcRel} -> ${destRel}`);
  }

  // Step 3: Clean up empty directories
  console.log('\n=== CLEANING UP EMPTY DIRS ===');
  function cleanupEmptyDirs(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        cleanupEmptyDirs(path.join(dir, entry.name));
      }
    }
    // Check if dir is now empty (no files, only empty subdirs or nothing)
    const remaining = fs.readdirSync(dir, { withFileTypes: true });
    const hasFiles = remaining.some((e) => e.isFile());
    const subdirs = remaining.filter((e) => e.isDirectory());
    if (!hasFiles && subdirs.length === 0) {
      fs.rmdirSync(dir);
      console.log(`  Removed empty: ${path.relative(LOGOS_DIR, dir)}`);
    }
  }

  for (const region of ['africa', 'americas', 'europe', 'middle-east']) {
    cleanupEmptyDirs(path.join(LOGOS_DIR, region));
  }

  // Step 4: Update paths in PortalAirlineExpectationsPage.tsx
  console.log('\n=== UPDATING PATHS IN CODE ===');
  let content = fs.readFileSync(PAGE_FILE, 'utf8');
  let pathUpdates = 0;

  for (const [oldRel, newRel] of Object.entries(REORGANIZE)) {
    const oldPath = `/images/airline-logos/${oldRel}`;
    const newPath = `/images/airline-logos/${newRel}`;

    if (content.includes(oldPath)) {
      content = content.split(oldPath).join(newPath);
      pathUpdates++;
    }
  }

  // Also update the british.svg -> british-airways.svg rename
  const oldBritish = '/images/airline-logos/europe/british.svg';
  const newBritish = '/images/airline-logos/europe/united-kingdom/international-operators/british-airways.svg';
  if (content.includes(oldBritish)) {
    content = content.split(oldBritish).join(newBritish);
    pathUpdates++;
  }

  fs.writeFileSync(PAGE_FILE, content);
  console.log(`  Updated ${pathUpdates} path references`);

  console.log(`\n=== SUMMARY ===`);
  console.log(`Files moved: ${moved}`);
  console.log(`Duplicates deleted: ${deleted}`);
  console.log(`Path references updated: ${pathUpdates}`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach((e) => console.log(`  ${e}`));
  }
}

main();
