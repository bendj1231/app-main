#!/usr/bin/env node
/**
 * Moves images from public/images/airline-expectations/ into the
 * organized public/images/airline-logos/ folder structure.
 *
 * - APAC region: organized by country/{international,regional}-operators/
 * - Other regions (africa, americas, europe, middle-east): flat
 *
 * Images that already exist in airline-logos (as *-aircraft.* files) are skipped.
 * Variant files (delta-757, etihad-airways-new, etihad-airways.png) are skipped.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'public', 'images');
const SRC = path.join(ROOT, 'airline-expectations');
const LOGOS = path.join(ROOT, 'airline-logos');

// Mapping: source filename -> destination path (relative to airline-logos/)
// Only includes files that DON'T already have a corresponding aircraft image
const MAPPING = {
  // APAC - new country folders needed
  'air-kiribati.jpg': 'APAC/kiribati/international-operators/air-kiribati-aircraft.jpg',
  'air-tahiti-nui.jpg': 'APAC/french-polynesia/international-operators/air-tahiti-nui-aircraft.jpg',
  'air-vanuatu.jpg': 'APAC/vanuatu/international-operators/air-vanuatu-aircraft.jpg',
  'myanmar-airways.jpg': 'APAC/myanmar/international-operators/myanmar-airways-aircraft.jpg',
  'samoa-airways.jpg': 'APAC/samoa/international-operators/samoa-airways-aircraft.jpg',
  'solomon-airlines.jpg': 'APAC/solomon-islands/international-operators/solomon-airlines-aircraft.jpg',
  'serene-air.jpg': 'APAC/pakistan/international-operators/serene-air-aircraft.jpg',

  // APAC - existing country folders
  'airasia-x.jpg': 'APAC/malaysia/international-operators/airasia-x-aircraft.jpg',
  'bamboo-airways.jpg': 'APAC/vietnam/regional-operators/bamboo-airways-aircraft.jpg',
  'bangkok-airways.jpg': 'APAC/thailand/regional-operators/bangkok-airways-aircraft.jpg',
  'lao-airlines.jpg': 'APAC/laos/international-operators/lao-airlines-aircraft.jpg',
  'royal-brunei.jpg': 'APAC/brunei/international-operators/royal-brunei-airlines-aircraft.jpg',

  // Europe (flat structure)
  'air-malta.jpg': 'europe/air-malta-aircraft.jpg',
  'air-serbia.jpg': 'europe/air-serbia-aircraft.jpg',
  'croatia-airlines.jpg': 'europe/croatia-airlines-aircraft.jpg',
  'ita-airways.jpg': 'europe/ita-airways-aircraft.jpg',
  'tarom.jpg': 'europe/tarom-aircraft.jpg',
  'uia.jpg': 'europe/ukraine-international-airlines-aircraft.jpg',

  // Americas (flat structure)
  'air-canada-rouge.jpg': 'americas/air-canada-rouge-aircraft.jpg',
  'spirit.jpg': 'americas/spirit-aircraft.jpg',

  // Africa (flat structure)
  'fly540.jpg': 'africa/fly540-aircraft.jpg',
  'jambojet.jpg': 'africa/jambojet-aircraft.jpg',
  'flysafair.jpg': 'africa/flysafair-aircraft.jpg',
  'mango.jpg': 'africa/mango-aircraft.jpg',

  // Middle East (flat structure)
  'flydubai.jpg': 'middle-east/flydubai-aircraft.jpg',
  'flynas.jpg': 'middle-east/flynas-aircraft.jpg',
};

// Files to skip (variants/duplicates of existing images)
const SKIP = new Set([
  'delta-757.jpg',
  'etihad-airways-new.jpg',
  'etihad-airways.png',
  'emirates.png', // already have emirates-aircraft.jpg
]);

function main() {
  const moved = [];
  const skipped = [];
  const errors = [];

  for (const [srcFile, destRel] of Object.entries(MAPPING)) {
    const srcPath = path.join(SRC, srcFile);
    const destPath = path.join(LOGOS, destRel);

    if (!fs.existsSync(srcPath)) {
      errors.push(`Source not found: ${srcFile}`);
      continue;
    }

    // Create destination directory
    const destDir = path.dirname(destPath);
    fs.mkdirSync(destDir, { recursive: true });

    // Copy (not move yet, to be safe)
    fs.copyFileSync(srcPath, destPath);
    moved.push(`${srcFile} -> ${destRel}`);
  }

  // Check for any files in airline-expectations not in MAPPING or SKIP
  const allFiles = fs.readdirSync(SRC);
  const mappedFiles = new Set([...Object.keys(MAPPING), ...SKIP]);
  const unmapped = allFiles.filter((f) => !mappedFiles.has(f) && !f.startsWith('.'));

  console.log('=== MOVED ===');
  moved.forEach((m) => console.log(`  ${m}`));
  console.log(`\nTotal moved: ${moved.length}`);

  console.log('\n=== SKIPPED (variants/duplicates) ===');
  [...SKIP].forEach((s) => console.log(`  ${s}`));

  if (unmapped.length > 0) {
    console.log('\n=== UNMAPPED FILES (already have aircraft images in airline-logos) ===');
    unmapped.forEach((u) => console.log(`  ${u}`));
    console.log(`\nTotal unmapped: ${unmapped.length}`);
  }

  if (errors.length > 0) {
    console.log('\n=== ERRORS ===');
    errors.forEach((e) => console.log(`  ${e}`));
  }
}

main();
