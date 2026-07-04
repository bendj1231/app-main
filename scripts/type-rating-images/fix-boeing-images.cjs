const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');
let content = fs.readFileSync(DATA_FILE, 'utf8');

const fixes = {
  'b737-max': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Boeing_737_MAX_8%2C_Southwest_Airlines_AN2264181.jpg/1280px-Boeing_737_MAX_8%2C_Southwest_Airlines_AN2264181.jpg',
  'b737-ng': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Boeing_737-8H4%2C_Southwest_Airlines_AN2264181.jpg/1280px-Boeing_737-8H4%2C_Southwest_Airlines_AN2264181.jpg',
  'b747-8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Boeing_747-8I%2C_Lufthansa_AN0971391.jpg/1280px-Boeing_747-8I%2C_Lufthansa_AN0971391.jpg',
  'b767-300er': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Boeing_767-332%2C_Delta_Air_Lines_AN1522774.jpg/1280px-Boeing_767-332%2C_Delta_Air_Lines_AN1522774.jpg',
  'b777-300er': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Boeing_777-200%2C_United_Airlines_AN0971392.jpg/1280px-Boeing_777-200%2C_United_Airlines_AN0971392.jpg',
  'b787': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Boeing_787-8_Dreamliner%2C_All_Nippon_Airways_AN2253246.jpg/1280px-Boeing_787-8_Dreamliner%2C_All_Nippon_Airways_AN2253246.jpg',
  'b777x': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Boeing_777-200%2C_United_Airlines_AN0971392.jpg/1280px-Boeing_777-200%2C_United_Airlines_AN0971392.jpg',
  'b757': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Boeing_767-332%2C_Delta_Air_Lines_AN1522774.jpg/1280px-Boeing_767-332%2C_Delta_Air_Lines_AN1522774.jpg',
  'embraer-e190': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Embraer_190-200IGW%2C_KLM_Cityhopper_AN2253248.jpg/1280px-Embraer_190-200IGW%2C_KLM_Cityhopper_AN2253248.jpg',
  'embraer-phenom-300': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Embraer_190-200IGW%2C_KLM_Cityhopper_AN2253248.jpg/1280px-Embraer_190-200IGW%2C_KLM_Cityhopper_AN2253248.jpg',
  'atr-72-600': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/ATR_72-600%2C_Air_Lingus_Regional_AN2253249.jpg/1280px-ATR_72-600%2C_Air_Lingus_Regional_AN2253249.jpg',
  'gulfstream-g650': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Gulfstream_G650_N650GA.jpg/1280px-Gulfstream_G650_N650GA.jpg',
  'cessna-172': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
  'cessna-152': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
  'cessna-182': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
  'cessna-206': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
  'cessna-208': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
  'cessna-citation-x': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cessna_Citation_Longitude_N516CL.jpg/1280px-Cessna_Citation_Longitude_N516CL.jpg',

  // Remaining Airbus duplicates
  'a330': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg/1280px-Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg',
  'a330-200': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg/1280px-Airbus_A330-243%2C_Malaysia_Airlines_AN0971390.jpg',
  'a340-200': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg/1280px-Airbus_A340-211%2C_Aerolineas_Argentinas_AN2253245.jpg',
  'a350-900': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg/1280px-Airbus_A350-900_XWB%2C_Singapore_Airlines_AN2249616.jpg',

  // Military / Historical
  'ah64': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_AH-64_Apache.jpg/1280px-Boeing_AH-64_Apache.jpg',
  'b17': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_B-17_Flying_Fortress.jpg/1280px-Boeing_B-17_Flying_Fortress.jpg',
  'b247': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_B-17_Flying_Fortress.jpg/1280px-Boeing_B-17_Flying_Fortress.jpg',
  'b29': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_B-17_Flying_Fortress.jpg/1280px-Boeing_B-17_Flying_Fortress.jpg',
  'b314': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_B-17_Flying_Fortress.jpg/1280px-Boeing_B-17_Flying_Fortress.jpg',
  'b377': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_B-17_Flying_Fortress.jpg/1280px-Boeing_B-17_Flying_Fortress.jpg',
  'b52h': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_B-52_Stratofortress.jpg/1280px-Boeing_B-52_Stratofortress.jpg',
  'b707': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_707.jpg/1280px-Boeing_707.jpg',
  'b727': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_727.jpg/1280px-Boeing_727.jpg',
  'c17': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_C-17_Globemaster_III.jpg/1280px-Boeing_C-17_Globemaster_III.jpg',
  'ch47': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Sikorsky_S-92_Helibus.jpg/1280px-Sikorsky_S-92_Helibus.jpg',
  'f15ex': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/McDonnell_Douglas_F-15_Eagle.jpg/1280px-McDonnell_Douglas_F-15_Eagle.jpg',
  'f86': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/North_American_F-86_Sabre.jpg/1280px-North_American_F-86_Sabre.jpg',
  'fa18f': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/McDonnell_Douglas_F-A-18_Hornet.jpg/1280px-McDonnell_Douglas_F-A-18_Hornet.jpg',
  'kc46': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Boeing_777-200%2C_United_Airlines_AN0971392.jpg/1280px-Boeing_777-200%2C_United_Airlines_AN0971392.jpg',
  'p8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Boeing_P-8_Poseidon.jpg/1280px-Boeing_P-8_Poseidon.jpg',
  'v22': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bell-Boeing_V-22_Osprey.jpg/1280px-Bell-Boeing_V-22_Osprey.jpg',

  // Tecnam
  'tecnam-p2006t': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Cessna_172_Skyhawk.jpg/1280px-Cessna_172_Skyhawk.jpg',
};

let updated = 0;
for (const [id, img] of Object.entries(fixes)) {
  const regex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]{0,300}image:\\s*['"])[^'"]*(['"])`);
  if (regex.test(content)) {
    content = content.replace(regex, `$1${img}$2`);
    updated++;
  }
}

fs.writeFileSync(DATA_FILE, content);
console.log(`Fixed ${updated} aircraft images.`);
