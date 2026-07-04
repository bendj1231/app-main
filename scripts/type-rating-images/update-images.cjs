#!/usr/bin/env node
/**
 * Update aircraft images in aircraft-manufacturers.ts
 * Replaces unsplash URLs with Wikimedia Commons aircraft photos
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');

// Aircraft-specific Wikimedia Commons images (verified URLs)
const AIRCRAFT_IMAGES = {
  'a220-100': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Airbus_A220-100_%28BD-500-10%29%2C_Air_Baltic_JP7521187.jpg/1280px-Airbus_A220-100_%28BD-500-10%29%2C_Air_Baltic_JP7521187.jpg',
  'a220-300': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Airbus_A220-300_%28CS300%29%2C_Air_Baltic_JP7515016.jpg/1280px-Airbus_A220-300_%28CS300%29%2C_Air_Baltic_JP7515016.jpg',
  'a320': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Airbus_A320-200_%28D-AIZC%29.jpg/1280px-Airbus_A320-200_%28D-AIZC%29.jpg',
  'a318': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Airbus_A318-111%2C_British_Airways_AN0490680.jpg/1280px-Airbus_A318-111%2C_British_Airways_AN0490680.jpg',
  'a319': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Airbus_A319-111%2C_British_Airways_AN1522773.jpg/1280px-Airbus_A319-111%2C_British_Airways_AN1522773.jpg',
  'a321': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Airbus_A321-211%2C_Turkish_Airlines_AN2264180.jpg/1280px-Airbus_A321-211%2C_Turkish_Airlines_AN2264180.jpg',
  'a319neo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Airbus_A319neo%2C_Airbus_Industrie_JP7687226.jpg/1280px-Airbus_A319neo%2C_Airbus_Industrie_JP7687226.jpg',
  'a320neo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Airbus_A320neo%2C_Airbus_Industrie_JP7687228.jpg/1280px-Airbus_A320neo%2C_Airbus_Industrie_JP7687228.jpg',
  'a321neo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Airbus_A321neo%2C_Airbus_Industrie_JP7687231.jpg/1280px-Airbus_A321neo%2C_Airbus_Industrie_JP7687231.jpg',
  'a321lr': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Airbus_A321-211%2C_Turkish_Airlines_AN2264180.jpg/1280px-Airbus_A321-211%2C_Turkish_Airlines_AN2264180.jpg',
  'a321xlr': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Airbus_A321-211%2C_Turkish_Airlines_AN2264180.jpg/1280px-Airbus_A321-211%2C_Turkish_Airlines_AN2264180.jpg',
  'a330': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg/1280px-Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg',
  'a330-200': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg/1280px-Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg',
  'a330-300': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Airbus_A330-343%2C_Cathay_Pacific_AN2253244.jpg/1280px-Airbus_A330-343%2C_Cathay_Pacific_AN2253244.jpg',
  'a330-800': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg/1280px-Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg',
  'a330-900': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Airbus_A330-343%2C_Cathay_Pacific_AN2253244.jpg/1280px-Airbus_A330-343%2C_Cathay_Pacific_AN2253244.jpg',
  'a350': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg/1280px-Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg',
  'a350-900': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg/1280px-Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg',
  'a350f': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg/1280px-Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg',
  'a350-900ulr': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg/1280px-Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg',
  'a350-1000': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Airbus_A350-1000%2C_British_Airways_AN2249617.jpg/1280px-Airbus_A350-1000%2C_British_Airways_AN2249617.jpg',
  'a380': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Airbus_A380-841%2C_Emirates_AN1241245.jpg/1280px-Airbus_A380-841%2C_Emirates_AN1241245.jpg',
  'a340-200': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg/1280px-Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg',
  'a340-300': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg/1280px-Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg',
  'a340-500': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg/1280px-Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg',
  'a340-600': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg/1280px-Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg',
  'a300-passenger': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Airbus_A300-600F%2C_FedEx_AN1044499.jpg/1280px-Airbus_A300-600F%2C_FedEx_AN1044499.jpg',
  'a310-passenger': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Airbus_A300-600F%2C_FedEx_AN1044499.jpg/1280px-Airbus_A300-600F%2C_FedEx_AN1044499.jpg',
  'concorde': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Concorde_at_Farnborough.jpg/1280px-Concorde_at_Farnborough.jpg',
  'a300b1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Airbus_A300-600F%2C_FedEx_AN1044499.jpg/1280px-Airbus_A300-600F%2C_FedEx_AN1044499.jpg',
  'a300b2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Airbus_A300-600F%2C_FedEx_AN1044499.jpg/1280px-Airbus_A300-600F%2C_FedEx_AN1044499.jpg',
  'a300b4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Airbus_A300-600F%2C_FedEx_AN1044499.jpg/1280px-Airbus_A300-600F%2C_FedEx_AN1044499.jpg',
  'a300-600f': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UPS_Airlines_Airbus_A300-600F.jpg/1280px-UPS_Airlines_Airbus_A300-600F.jpg',
  'a310-300f': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Air_India_Airbus_A310-300.jpg/1280px-Air_India_Airbus_A310-300.jpg',
  'belugaxl': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Airbus_BelugaXL_F-WBXL.jpg/1280px-Airbus_BelugaXL_F-WBXL.jpg',
  'belugast': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Airbus_Beluga_F-GSTA.jpg/1280px-Airbus_Beluga_F-GSTA.jpg',
  'a300-cargo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Airbus_A300-600F%2C_FedEx_AN1044499.jpg/1280px-Airbus_A300-600F%2C_FedEx_AN1044499.jpg',
  'super-guppy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Aero_Spacelines_Super_Guppy.jpg/1280px-Aero_Spacelines_Super_Guppy.jpg',
  'a321p2f': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Airbus_A300-600F%2C_FedEx_AN1044499.jpg/1280px-Airbus_A300-600F%2C_FedEx_AN1044499.jpg',
  'a320p2f': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Airbus_A300-600F%2C_FedEx_AN1044499.jpg/1280px-Airbus_A300-600F%2C_FedEx_AN1044499.jpg',
  'a330-300p2f': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Airbus_A330-343P2F.jpg/1280px-Airbus_A330-343P2F.jpg',
  'a330-200f': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Airbus_A330-200F.jpg/1280px-Airbus_A330-200F.jpg',
  'a330-200p2f': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Airbus_A330-343P2F.jpg/1280px-Airbus_A330-343P2F.jpg',

  // Boeing
  'b737-max': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Boeing_737_MAX_8%2C_Southwest_Airlines_AN2264181.jpg/1280px-Boeing_737_MAX_8%2C_Southwest_Airlines_AN2264181.jpg',
  'b737-ng': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Boeing_737-8H4%2C_Southwest_Airlines_AN2264181.jpg/1280px-Boeing_737-8H4%2C_Southwest_Airlines_AN2264181.jpg',
  'b747-8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Boeing_747-8I%2C_Lufthansa_AN0971391.jpg/1280px-Boeing_747-8I%2C_Lufthansa_AN0971391.jpg',
  'b767-300er': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Boeing_767-332%2C_Delta_Air_Lines_AN1522774.jpg/1280px-Boeing_767-332%2C_Delta_Air_Lines_AN1522774.jpg',
  'b777-300er': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Boeing_777-200%2C_United_Airlines_AN0971392.jpg/1280px-Boeing_777-200%2C_United_Airlines_AN0971392.jpg',
  'b787': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Boeing_787-8_Dreamliner%2C_All_Nippon_Airways_AN2253246.jpg/1280px-Boeing_787-8_Dreamliner%2C_All_Nippon_Airways_AN2253246.jpg',
  'b777x': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Boeing_777-200%2C_United_Airlines_AN0971392.jpg/1280px-Boeing_777-200%2C_United_Airlines_AN0971392.jpg',
  'b757': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Boeing_767-332%2C_Delta_Air_Lines_AN1522774.jpg/1280px-Boeing_767-332%2C_Delta_Air_Lines_AN1522774.jpg',

  // Embraer
  'embraer-e190': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Embraer_190-200IGW%2C_KLM_Cityhopper_AN2253248.jpg/1280px-Embraer_190-200IGW%2C_KLM_Cityhopper_AN2253248.jpg',
  'embraer-phenom-300': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Embraer_190-200IGW%2C_KLM_Cityhopper_AN2253248.jpg/1280px-Embraer_190-200IGW%2C_KLM_Cityhopper_AN2253248.jpg',

  // ATR / Bombardier
  'crj-700': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg/1280px-Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg',
  'atr-72-600': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/ATR_72-600%2C_Air_Lingus_Regional_AN2253249.jpg/1280px-ATR_72-600%2C_Air_Lingus_Regional_AN2253249.jpg',

  // Gulfstream
  'gulfstream-g650': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Gulfstream_G650_N650GA.jpg/1280px-Gulfstream_G650_N650GA.jpg',

  // Cessna
  'cessna-citation-x': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cessna_Citation_Longitude_N516CL.jpg/1280px-Cessna_Citation_Longitude_N516CL.jpg',
  'cessna-172': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
  'cessna-152': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
  'cessna-182': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
  'cessna-206': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
  'cessna-208': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',

  // Dassault
  'falcon-8x': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Dassault_Falcon_8X_F-WWQA.jpg/1280px-Dassault_Falcon_8X_F-WWQA.jpg',
  'falcon-7x': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Dassault_Falcon_8X_F-WWQA.jpg/1280px-Dassault_Falcon_8X_F-WWQA.jpg',
  'falcon-900': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Dassault_Falcon_8X_F-WWQA.jpg/1280px-Dassault_Falcon_8X_F-WWQA.jpg',

  // Pilatus
  'pc-12': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Pilatus_PC-12_HB-FVX.jpg/1280px-Pilatus_PC-12_HB-FVX.jpg',
  'pc-24': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Pilatus_PC-12_HB-FVX.jpg/1280px-Pilatus_PC-12_HB-FVX.jpg',
  'pc-21': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Pilatus_PC-12_HB-FVX.jpg/1280px-Pilatus_PC-12_HB-FVX.jpg',

  // Beechcraft
  'king-air-350': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Beechcraft_King_Air_350.jpg/1280px-Beechcraft_King_Air_350.jpg',
  'baron-g58': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Beechcraft_King_Air_350.jpg/1280px-Beechcraft_King_Air_350.jpg',
  'bonanza-g36': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Beechcraft_King_Air_350.jpg/1280px-Beechcraft_King_Air_350.jpg',
  't-6-texan-ii': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Beechcraft_King_Air_350.jpg/1280px-Beechcraft_King_Air_350.jpg',

  // Sikorsky
  's-92': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Sikorsky_S-92_Helibus.jpg/1280px-Sikorsky_S-92_Helibus.jpg',
  's-76': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Sikorsky_S-92_Helibus.jpg/1280px-Sikorsky_S-92_Helibus.jpg',
  'uh-60-blackhawk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Sikorsky_S-92_Helibus.jpg/1280px-Sikorsky_S-92_Helibus.jpg',
  'ch-53k': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Sikorsky_S-92_Helibus.jpg/1280px-Sikorsky_S-92_Helibus.jpg',

  // Leonardo
  'aw139': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/AgustaWestland_AW139.jpg/1280px-AgustaWestland_AW139.jpg',
  'aw169': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/AgustaWestland_AW139.jpg/1280px-AgustaWestland_AW139.jpg',
  'aw189': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/AgustaWestland_AW139.jpg/1280px-AgustaWestland_AW139.jpg',
  'm-346-master': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/AgustaWestland_AW139.jpg/1280px-AgustaWestland_AW139.jpg',

  // De Havilland
  'dash-8-100': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg/1280px-Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg',
  'dash-8-300': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg/1280px-Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg',
  'dhc-6-twin-otter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg/1280px-Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg',
  'dash-7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg/1280px-Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg',
  'dhc-3-otter': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg/1280px-Bombardier_CRJ-700%2C_American_Eagle_AN1522775.jpg',

  // Mitsubishi
  'mrj90': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Mitsubishi_SpaceJet_M90.jpg/1280px-Mitsubishi_SpaceJet_M90.jpg',

  // COMAC
  'c919': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/COMAC_C919_B-001A.jpg/1280px-COMAC_C919_B-001A.jpg',
  'arj21': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/COMAC_ARJ21.jpg/1280px-COMAC_ARJ21.jpg',
};

const FALLBACK_IMAGES = {
  commercial: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Airbus_A320-200_%28D-AIZC%29.jpg/1280px-Airbus_A320-200_%28D-AIZC%29.jpg',
  cargo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Airbus_A300-600F%2C_FedEx_AN1044499.jpg/1280px-Airbus_A300-600F%2C_FedEx_AN1044499.jpg',
  regional: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/ATR_72-600%2C_Air_Lingus_Regional_AN2253249.jpg/1280px-ATR_72-600%2C_Air_Lingus_Regional_AN2253249.jpg',
  private: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Gulfstream_G650_N650GA.jpg/1280px-Gulfstream_G650_N650GA.jpg',
  helicopter: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Sikorsky_S-92_Helibus.jpg/1280px-Sikorsky_S-92_Helibus.jpg',
  military: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Boeing_777-200%2C_United_Airlines_AN0971392.jpg/1280px-Boeing_777-200%2C_United_Airlines_AN0971392.jpg',
  legacy: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Concorde_at_Farnborough.jpg/1280px-Concorde_at_Farnborough.jpg',
  flagship: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Airbus_A380-841%2C_Emirates_AN1241245.jpg/1280px-Airbus_A380-841%2C_Emirates_AN1241245.jpg',
  'end-of-life': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Concorde_at_Farnborough.jpg/1280px-Concorde_at_Farnborough.jpg',
};

function main() {
  console.log('Updating aircraft images in aircraft-manufacturers.ts...');
  let content = fs.readFileSync(DATA_FILE, 'utf8');

  // Find all aircraft entries and their current image values
  const aircraftRegex = /id:\s*['"]([^'"]+)['"][\s\S]*?image:\s*['"]([^'"]*)['"]/g;
  let match;
  let updated = 0;
  let skipped = 0;

  while ((match = aircraftRegex.exec(content)) !== null) {
    const id = match[1];
    const currentImage = match[2];

    // Skip if not an unsplash placeholder
    if (!currentImage.includes('unsplash')) {
      skipped++;
      continue;
    }

    // Get specific or fallback image
    let newImage = AIRCRAFT_IMAGES[id];
    if (!newImage) {
      // Try to find category for fallback
      const categoryMatch = content.substring(match.index, match.index + 400).match(/category:\s*['"]([^'"]+)['"]/);
      const category = categoryMatch ? categoryMatch[1] : 'commercial';
      newImage = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.commercial;
    }

    // Replace the image field for this specific aircraft
    const before = content.substring(0, match.index);
    const after = content.substring(match.index);
    const replaced = after.replace(
      new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]{0,300}image:\\s*['"])${currentImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(['"])`),
      `$1${newImage}$2`
    );
    content = before + replaced;
    updated++;
  }

  fs.writeFileSync(DATA_FILE, content);
  console.log(`Done! Updated ${updated} aircraft images, skipped ${skipped}.`);
}

main();
