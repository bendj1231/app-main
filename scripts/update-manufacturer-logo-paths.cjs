const fs = require('fs');
const path = require('path');

const CATEGORY_MAP = {
  'airbus-logo': 'commercial-jets',
  'boeing-logo': 'commercial-jets',
  'comac-logo': 'commercial-jets',
  'atr-logo': 'regional-aircraft',
  'bombardier-logo': 'regional-aircraft',
  'de-havilland-logo': 'regional-aircraft',
  'embraer-logo': 'regional-aircraft',
  'let-logo': 'regional-aircraft',
  'mitsubishi-logo': 'regional-aircraft',
  'beechcraft-logo': 'business-private-jets',
  'cessna-logo': 'business-private-jets',
  'dassault-logo': 'business-private-jets',
  'epic-logo': 'business-private-jets',
  'gulfstream-logo': 'business-private-jets',
  'hondajet-logo': 'business-private-jets',
  'pilatus-logo': 'business-private-jets',
  'socata-logo': 'business-private-jets',
  'twin-commander-logo': 'business-private-jets',
  'bell-logo': 'helicopters',
  'leonardo-logo': 'helicopters',
  'sikorsky-logo': 'helicopters',
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
  'quest-logo': 'general-aviation',
  'sling-logo': 'general-aviation',
  'tecnam-logo': 'general-aviation',
  'velocity-logo': 'general-aviation',
  'vulcanair-logo': 'general-aviation',
  'waco-logo': 'general-aviation',
  'aviat-logo': 'general-aviation',
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
  'antonov-logo': 'military-defense',
  'dornier-logo': 'military-defense',
  'hindustan-logo': 'military-defense',
  'ilyushin-logo': 'military-defense',
  'raytheon-logo': 'military-defense',
  'airtractor-logo': 'agricultural-utility',
  'thrush-logo': 'agricultural-utility',
  'elroy-air-logo': 'autonomous-cargo',
  'pyka-logo': 'autonomous-cargo',
  'sabrewing-logo': 'autonomous-cargo',
  'fugro-logo': 'survey-utility',
  'mlg-logo': 'other',
};

const files = [
  'components/pages/TypeRatingSearchPage.tsx',
  'components/website/components/pilot-recognition/AircraftRatingsSearch.tsx',
  'components/type-rating/AircraftDetailPanel.tsx',
  'components/website/components/pilot-recognition/PilotLicensureExperiencePage.tsx',
];

for (const file of files) {
  const filePath = path.resolve(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log('Not found:', file);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Replace /images/set-01-logos/FILENAME or /images/manufacturer-logos/images/set-01-logos/FILENAME
  content = content.replace(/\/images\/(?:manufacturer-logos\/images\/)?set-01-logos\/([a-z0-9-]+\.(?:png|jpg|jpeg|svg|webp))/g, (match, filename) => {
    const base = filename.replace(/\.[a-z]+$/, '');
    const category = CATEGORY_MAP[base];
    if (category) {
      changes++;
      return '/images/manufacturer-logos/' + category + '/' + filename;
    }
    console.log('  No category for:', base, 'in', file);
    return match;
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file + ': ' + changes + ' replacements');
  } else {
    console.log('No changes in ' + file);
  }
}
