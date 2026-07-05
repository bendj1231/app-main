const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.resolve(__dirname, '../public/images/set-01-logos');
const TARGET_DIR = path.resolve(__dirname, '../public/images/manufacturer-logos');

// Map manufacturer ID -> category
const MANUFACTURER_CATEGORIES = {
  // Commercial Jet Manufacturers
  'airbus-logo': 'commercial-jets',
  'boeing-logo': 'commercial-jets',
  'comac-logo': 'commercial-jets',

  // Regional Aircraft Manufacturers
  'atr-logo': 'regional-aircraft',
  'bombardier-logo': 'regional-aircraft',
  'de-havilland-logo': 'regional-aircraft',
  'embraer-logo': 'regional-aircraft',
  'let-logo': 'regional-aircraft',
  'mitsubishi-logo': 'regional-aircraft',

  // Business & Private Jet Manufacturers
  'beechcraft-logo': 'business-private-jets',
  'cessna-logo': 'business-private-jets',
  'dassault-logo': 'business-private-jets',
  'epic-logo': 'business-private-jets',
  'gulfstream-logo': 'business-private-jets',
  'hondajet-logo': 'business-private-jets',
  'pilatus-logo': 'business-private-jets',
  'socata-logo': 'business-private-jets',
  'twin-commander-logo': 'business-private-jets',

  // Helicopter Manufacturers
  'bell-logo': 'helicopters',
  'leonardo-logo': 'helicopters',
  'sikorsky-logo': 'helicopters',

  // General Aviation & Light Aircraft
  'aero-east-europe-logo': 'general-aviation',
  'aeroprakt-logo': 'general-aviation',
  'american-champion-logo': 'general-aviation',
  'bristell-logo': 'general-aviation',
  'britten-norman-logo': 'general-aviation',
  'cirrus-logo': 'general-aviation',
  'elixir-logo': 'general-aviation',
  'evektor-logo': 'general-aviation',
  'foxcon-logo': 'general-aviation',
  'grob-logo': 'general-aviation',
  'icon-logo': 'general-aviation',
  'jmb-logo': 'general-aviation',
  'mahindra-logo': 'general-aviation',
  'mooney-logo': 'general-aviation',
  'pacific-aerospace-logo': 'general-aviation',
  'piper-logo': 'general-aviation',
  'pipistrel-logo': 'general-aviation',
  'sling-logo': 'general-aviation',
  'tecnam-logo': 'general-aviation',
  'velocity-logo': 'general-aviation',
  'vulcanair-logo': 'general-aviation',
  'waco-logo': 'general-aviation',
  'aviat-logo': 'general-aviation',

  // eVTOL & Urban Air Mobility
  'archer-logo': 'evtol-uam',
  'autoflight-logo': 'evtol-uam',
  'beta-logo': 'evtol-uam',
  'ehang-logo': 'evtol-uam',
  'eve-logo': 'evtol-uam',
  'joby-logo': 'evtol-uam',
  'lilium-logo': 'evtol-uam',
  'regent-craft-logo': 'evtol-uam',
  'supernal-logo': 'evtol-uam',
  'wisk-logo': 'evtol-uam',

  // Military & Defense
  'antonov-logo': 'military-defense',
  'dornier-logo': 'military-defense',
  'hindustan-logo': 'military-defense',
  'ilyushin-logo': 'military-defense',
  'raytheon-logo': 'military-defense',

  // Agricultural & Utility
  'airtractor-logo': 'agricultural-utility',
  'thrush-logo': 'agricultural-utility',

  // Autonomous Cargo & Drones
  'elroy-air-logo': 'autonomous-cargo',
  'pyka-logo': 'autonomous-cargo',
  'sabrewing-logo': 'autonomous-cargo',

  // Survey / Geophysical
  'fugro-logo': 'survey-utility',

  // Other / Services (not aircraft manufacturers)
  'mlg-logo': 'other',
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getBaseName(filename) {
  return filename.replace(/\.[^.]+$/, '');
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error('Source directory not found:', SOURCE_DIR);
    process.exit(1);
  }

  // Create target directory
  ensureDir(TARGET_DIR);

  const files = fs.readdirSync(SOURCE_DIR).filter(f => {
    // Skip non-image files and generic logos
    const ext = path.extname(f).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.svg', '.webp'].includes(ext) &&
           f !== 'logo.png' &&
           f !== 'react.svg';
  });

  const moved = [];
  const skipped = [];
  const uncategorized = [];

  for (const file of files) {
    const baseName = getBaseName(file);
    const category = MANUFACTURER_CATEGORIES[baseName];

    if (!category) {
      uncategorized.push(file);
      continue;
    }

    const categoryDir = path.join(TARGET_DIR, category);
    ensureDir(categoryDir);

    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(categoryDir, file);

    fs.copyFileSync(src, dest);
    moved.push({ file, category });
    console.log(`Moved: ${file} -> ${category}/`);
  }

  // Create category manifest
  const categoryManifest = {};
  for (const { file, category } of moved) {
    if (!categoryManifest[category]) categoryManifest[category] = [];
    categoryManifest[category].push(file);
  }

  fs.writeFileSync(
    path.join(TARGET_DIR, 'manifest.json'),
    JSON.stringify({
      totalFiles: moved.length,
      categories: Object.keys(categoryManifest).sort(),
      categoryManifest,
      uncategorized,
    }, null, 2)
  );

  console.log('\nDone.');
  console.log(`Moved: ${moved.length}`);
  console.log(`Uncategorized: ${uncategorized.length}`);
  if (uncategorized.length > 0) {
    console.log('Uncategorized files:', uncategorized);
  }
}

main().catch(console.error);
