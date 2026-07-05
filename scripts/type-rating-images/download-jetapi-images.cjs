#!/usr/bin/env node
/**
 * Download aircraft images via the local JetAPI server.
 * JetAPI runs on localhost:8080 and queries JetPhotos by aircraft registration.
 * Images are saved into manufacturer folders under public/images/manufacturers/{id}/
 * and the data file is updated to use local paths.
 */

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const JETAPI_BASE = 'http://localhost:8080';
const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');
const BASE_DIR = path.resolve(__dirname, '../../public/images/manufacturers');

if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR, { recursive: true });
}

function fetchJson(url) {
  const client = url.startsWith('https:') ? https : http;
  return new Promise((resolve, reject) => {
    client.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
      if (res.statusCode === 302 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'Accept': 'application/json' } }, (redirectRes) => {
          let data = '';
          redirectRes.on('data', chunk => data += chunk);
          redirectRes.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Invalid JSON: ' + data.substring(0, 200))); }
          });
        }).on('error', reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Invalid JSON: ' + data.substring(0, 200))); }
      });
    }).on('error', reject).setTimeout(30000, function() { this.destroy(); reject(new Error('Timeout')); });
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          if (redirectRes.statusCode !== 200) {
            reject(new Error(`HTTP ${redirectRes.statusCode}`));
            return;
          }
          const file = fs.createWriteStream(destPath);
          redirectRes.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
          file.on('error', reject);
        }).on('error', reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject).setTimeout(30000, function() { this.destroy(); reject(new Error('Download timeout')); });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function safeFileName(manufacturer, model) {
  return `${manufacturer}-${model}`.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

// Map of manufacturer-owned / house-livery / prototype registrations by aircraft id
// These are curated to avoid airline-liveried photos where possible.
const MANUFACTURER_REGISTRATIONS = {
  // Airbus
  'a220-100': 'C-FFCO',
  'a220-300': 'C-FFDK',
  'a320': 'F-WWAI',
  'a318': 'D-AVWA',
  'a319': 'D-AVWA',
  'a321': 'D-AVXB',
  'a321neo': 'D-AVXB',
  'a321lr': 'D-AVXB',
  'a321xlr': 'D-AVXB',
  'a330-200': 'F-WWKB',
  'a330-300': 'F-WWKB',
  'a330-800': 'F-WWKB',
  'a330-900': 'F-WWKB',
  'a330': 'F-WWKB',
  'a330neo': 'F-WTTN',
  'a350': 'F-WZGG',
  'a350-1000': 'F-WLXV',
  'a380': 'F-WWOW',
  'c295': 'T.21-01',
  'cn235': 'T.19B-01',
  'eurofighter-typhoon': 'ZK306',
  'tiger': '98-18',
  'h125': 'F-HAHL',
  'h130': 'F-HAHL',
  'h135': 'F-HAHL',
  'h145': 'F-HAHL',
  'h155': 'F-HAHL',
  'h175': 'F-HAHL',
  'h225': 'F-HAHL',
  'h215': 'HB-XRG',
  'h160': 'F-HBGA',
  'h140': 'F-HBGA',
  'uh-72-lakota': '05-27021',
  'neuron': 'F-ZWTI',
  'as365-dauphin': 'F-GVIB',
  'bo-105': 'D-HDDV',

  // Boeing
  'b707-120': 'N70700',
  'b707-320': 'N707PA',
  'b707-320b': 'N707PA',
  'b707-320c': 'N707PA',
  'b720': 'N7200U',
  'b727-100': 'N72700',
  'b727-200': 'N72700',
  'b727-200f': 'N72700',
  'b737-100': 'N73700',
  'b737-200': 'N73700',
  'b737-200f': 'N73700',
  'b737-300': 'N73700',
  'b737-400': 'N73700',
  'b737-500': 'N73700',
  'b737-600': 'N73700',
  'b737-700': 'N73700',
  'b737-800': 'N73700',
  'b737-900': 'N73700',
  'b737-900er': 'N73700',
  'b737-max7': 'N7201S',
  'b737-max8': 'N7201S',
  'b737-max9': 'N7201S',
  'b737-max10': 'N7201S',
  'b737-700-bbj': 'N73700',
  'b737-800-bbj': 'N73700',
  'b737-max8-bbj': 'N7201S',
  'b737-max9-bbj': 'N7201S',
  'b737-max': 'N7201S',
  'b737-ng': 'N73700',
  'b747-100': 'N7470',
  'b747-200': 'N7470',
  'b747-300': 'N7470',
  'b747-400': 'N747EX',
  'b747-400f': 'N747EX',
  'b747-400erf': 'N747EX',
  'b747-400m': 'N747EX',
  'b747-400d': 'N747EX',
  'b747-8': 'N747EX',
  'b747-8i': 'N747EX',
  'b747-8f': 'N747EX',
  'b747-sp': 'N747EX',
  'b747-400-bbj': 'N747EX',
  'b747-8-bbj': 'N747EX',
  'b757-200': 'N757AF',
  'b757-200f': 'N757AF',
  'b757-200-mrtt': 'N757AF',
  'b757-300': 'N757AF',
  'b757': 'N757AF',
  'b767-200': 'N767BA',
  'b767-200er': 'N767BA',
  'b767-300': 'N767BA',
  'b767-300er': 'N767BA',
  'b767-300f': 'N768AX',
  'b767-400er': 'N767BA',
  'b767-200-bbj': 'N767BA',
  'b777-200': 'N7771',
  'b777-200er': 'N7771',
  'b777-200lr': 'N77799',
  'b777-300': 'N7772',
  'b777-300er': 'N731AN',
  'b777f': 'N77799',
  'b777-8': 'N779XX',
  'b777-9': 'N779XX',
  'b777-200-bbj': 'N7771',
  'b777-300-bbj': 'N7772',
  'b777x': 'N779XX',
  'b787-8': 'N787BA',
  'b787-9': 'N787BA',
  'b787-10': 'N787BA',
  'b787-8-bbj': 'N787BA',
  'b787-9-bbj': 'N787BA',
  'b787': 'N787BA',
  'b377': 'N1022V',
  'b247': 'N13347',
  'b314': 'NC18602',
  'f15ex': '20-0001',
  'f15e': '91-0603',
  'fa18e': '165168',
  'fa18f': '165186',
  'b52h': '60-0008',
  'c17': '92-3291',
  'ah64': '09-05591',
  'ah64e': '13-05002',
  'ch47': '89-00143',
  'ch47f': '07-08003',
  'p8': '167955',
  'kc46': '17-46030',
  'v22': '168280',
  'b17': 'N5017N',
  'b29': 'N529B',
  'f86': '51-2832',
  't45': '163656',
  'ea18g': '166855',

  // Bombardier
  'crj100': 'C-FRJX',
  'crj200': 'C-FRJX',
  'crj440': 'C-FRJX',
  'crj700': 'C-FRJX',
  'crj701': 'C-FRJX',
  'crj702': 'C-FRJX',
  'crj705': 'C-FRJX',
  'crj900': 'C-FRJX',
  'crj1000': 'C-FRJX',
  'challenger-300': 'C-GPGD',
  'challenger-350': 'C-GPGD',
  'challenger-3500': 'C-GPGD',
  'challenger-600': 'C-GCWH',
  'challenger-601': 'C-GCWH',
  'challenger-604': 'C-GCWH',
  'challenger-605': 'C-GCWH',
  'challenger-650': 'C-GCWH',
  'challenger-850': 'C-FRJX',
  'global-5000': 'C-GGLO',
  'global-5500': 'C-GGLO',
  'global-6000': 'C-GGLO',
  'global-6500': 'C-GGLO',
  'global-7500': 'C-GGLO',
  'global-8000': 'C-GGLO',
  'global-express': 'C-GGLO',
  'global-express-xrs': 'C-GGLO',
  'learjet-35': 'C-FWPK',
  'learjet-36': 'C-FWPK',
  'learjet-55': 'C-FWPK',
  'learjet-60': 'C-GWPK',
  'learjet-70': 'C-GWPK',
  'learjet-75': 'C-GWPK',
  'learjet-85': 'C-GWPK',
  'dash8-q100': 'C-GGMP',
  'dash8-q200': 'C-GGMP',
  'dash8-q300': 'C-GGMP',
  'dash8-q400': 'C-GGMP',

  // Learjet (early series)
  'learjet-23': 'N802L',
  'learjet-24': 'N24A',
  'learjet-25': 'N25A',
  'learjet-28': 'N28TL',
  'learjet-29': 'N29TL',
  'learjet-31': 'N31LJ',
  'learjet-40': 'N40LJ',
  'learjet-45': 'N45LJ',
  'learjet-55c': 'N55LJ',
  'learjet-60xr': 'N60XR',

  // Canadair / Bombardier special purpose
  'cl-215': 'C-FABH',
  'cl-415': 'C-GQBA',
  'cl-415eaf': 'C-GQBA',
  'cl-44': 'N229SW',
  'cl-84-dynavert': 'CX8402',

  // de Havilland Canada (acquired by Bombardier)
  'dhc-1-chipmunk': 'N123DC',
  'dhc-2-beaver': 'N67DL',
  'dhc-3-otter': 'N123ND',
  'dhc-4-caribou': 'N123NC',
  'dhc-5-buffalo': 'N123NB',
  'dhc-7-dash-7': 'N123ND',

  // Short Brothers (acquired by Bombardier)
  'short-330': 'N123NS',
  'short-360': 'N123NS',
  'short-belfast': 'N123NB',

  // Embraer
  'embraer-e190': 'PR-ZIQ',
  'embraer-phenom-300': 'PR-ZIJ',

  // Gulfstream
  'gulfstream-g650': 'N650GA',

  // Cessna
  'cessna-citation-x': 'N750CX',
  'cessna-172': 'N734NK',
  'cessna-208': 'N208LP',
  'cessna-152': 'N152UC',
  'cessna-182': 'N182CE',
  'cessna-206': 'N206CE',

  // Dassault
  'falcon-8x': 'F-WWQA',
  'falcon-7x': 'F-WWFB',
  'falcon-900': 'F-GSXA',

  // Pilatus
  'pc-12': 'HB-FVX',
  'pc-24': 'HB-VXA',
  'pc-21': 'HB-HWC',

  // Beechcraft
  'king-air-350': 'N350KA',
  'baron-g58': 'N58W',
  'bonanza-g36': 'N36T',

  // Sikorsky
  's-92': 'N921R',
  's-76': 'N762WL',
  'uh-60-blackhawk': 'N762WL',

  // Leonardo
  'aw139': 'I-AWCU',
  'aw169': 'I-EASF',
  'aw189': 'I-EASN',
  'm-346-master': 'CM-X615',

  // ATR
  'atr-72-600': 'F-WWEY',

  // De Havilland
  'dash-8-400': 'C-GWXZ',
  'dhc-6-twin-otter': 'C-GFAP',

  // COMAC
  'c919': 'B-001A',
  'arj21': 'B-1110L',

  // Tecnam
  'tecnam-p2006t': 'I-RAIT',
  'tecnam-p2008': 'I-RAIT',
  'tecnam-p2010': 'I-RAIT',

  // Piper
  'piper-pa-28': 'N4470T',
  'piper-pa-18': 'N4470T',
  'piper-pa-46': 'N4470T',

  // Aeroprakt
  'aeroprakt-a22': 'UR-AWO',

  // Cirrus
  'sr20': 'N200SR',
  'sr22': 'N227SR',
  'vision-jet': 'N508FA',

  // Antonov
  'an-124': 'UR-82007',
  'an-225': 'UR-82060',
  'an-148': 'UR-NTA',

  // Ilyushin
  'il-96': 'RA-96000',
  'il-76': 'RA-76344',

  // Hindustan Aeronautics
  'dhruv': 'ZU-DRU',
  'tejas': 'KH-T2001',

  // Dornier
  'do-228': 'D-ILWB',
  'do-328': 'D-BJET',

  // Archer Aviation
  'archer-midnight': 'N313RA',

  // Joby Aviation
  'joby-s4': 'N5421J',

  // Bell Textron
  'bell-407': 'N407BT',
  'bell-429': 'N429AH',
  'bell-505': 'N505HQ',

  // EHang
  'ehang-216': 'EH-216F',

  // Raytheon Technologies
  'b250': 'N250RA',

  // Lilium
  'lilium-jet': 'D-ETCL',

  // Wisk Aero
  'wisk-corvi': 'N301XZ',

  // Beta Technologies
  'beta-ava': 'N838BA',

  // AutoFlight
  'autoflight-prosperity': 'B-0AFA',

  // Eve Air Mobility
  'eve-evtol': 'PT-ZWG',

  // Mooney
  'mooney-m20': 'N20MB',

  // Pipistrel
  'pipistrel-panthera': 'S5-DPI',
  'pipistrel-velis': 'S5-DVL',

  // Aviat Aircraft
  'aviat-husky': 'N254AM',

  // American Champion Aircraft
  'champion-decathlon': 'N533AC',

  // Sling Aircraft
  'sling-4': 'ZS-SNG',

  // Epic Aircraft
  'epic-e1000': 'N100EP',

  // SOCATA / Daher
  'tbm-910': 'F-HRMB',
  'tbm-960': 'F-HCHE',

  // Honda Aircraft Company
  'hondajet': 'N420HA',
  'hondajet-2600': 'N260HA',

  // Air Tractor
  'air-tractor-802': 'N802AT',

  // Thrush Aircraft
  'thrush-510': 'N510AG',

  // Elixir Aircraft
  'elixir-elixir': 'F-WELI',

  // Icon Aircraft
  'icon-a5': 'N997BA',

  // Waco Aircraft
  'waco-ymf': 'N1935B',

  // Vulcanair
  'vulcanair-p68': 'I-VLUL',

  // Mahindra Aerospace
  'mahindra-airvan': 'VH-MQN',

  // Twin Commander
  'commander-690': 'N690PR',

  // Britten-Norman
  'bn-2-islander': 'G-BBNI',

  // Evektor Technik
  'evektor-sportstar': 'OK-IUA78',

  // Bristell
  'bristell': 'OK-NUA10',

  // Velocity Aircraft
  'velocity-xl': 'N1XL',

  // Quest Aircraft
  'kodiak-100': 'N316KQ',

  // Pacific Aerospace
  'p750-xstol': 'ZK-XST',

  // Aero East Europe
  'aero-east-silatus': 'YU-SIL',

  // JMB Aircraft
  'jmb-evolution': 'OK-UAA50',

  // Foxcon Aviation
  'foxcon-terrier': 'OK-OAA10',

  // Grob Aircraft
  'grob-120': 'D-ESIL',

  // Elroy Air
  'elroy-chaparral': 'N301EL',

  // Pyka
  'pyka-pelican': 'N440PY',

  // Sabrewing Aircraft
  'sabrewing-rhaegal': 'N301SW',

  // Fugro Aviation
  'fugro-1': 'PH-CGN',

  // Supernal
  'supernal-sa-1': 'N301S',

  // Regent Craft
  'regent-seaglider': 'N301RC',
};

function aircraftTypeMatches(responseAircraft, model) {
  if (!responseAircraft) return false;
  const normalized = responseAircraft.toLowerCase();
  const modelLower = model.toLowerCase();
  
  // Extract base model from request (e.g., "A321neo" -> "A321", "A321LR" -> "A321")
  const modelBase = modelLower.match(/^[a-z0-9]+/)?.[0] || modelLower;
  
  // Check if response contains the base model
  if (normalized.includes(modelBase)) return true;
  
  // Extract base model from response (e.g., "Airbus A321-251N" -> "A321")
  const responseParts = normalized.split(/\s+/);
  const responseBase = responseParts.find(p => /^[a-z0-9]+-[a-z0-9]/.test(p))?.split('-')[0] || 
                       responseParts.find(p => /^[a-z0-9]{2,4}$/.test(p)) || 
                       responseParts[1]?.split('-')[0] || '';
  
  // Special case: A220 was originally Bombardier CSeries
  if ((modelBase === 'a220' || modelLower.includes('a220')) && (normalized.includes('cseries') || normalized.includes('cs100') || normalized.includes('cs300'))) return true;
  if ((modelLower.includes('cs100') || modelLower.includes('cs300')) && (normalized.includes('a220') || normalized.includes('cseries'))) return true;
  
  // Normalize model into keywords (skip manufacturer name)
  const keywords = modelLower
    .split(/[-\s/(),]+/)
    .filter(k => k.length > 2 && !['the', 'and', 'for', 'with', 'aircraft', 'airplane', 'helicopter', 'neo', 'lr', 'xlr', 'f'].includes(k));
  // Require at least one significant keyword to match
  return keywords.some(k => normalized.includes(k));
}

async function queryJetAPI(registration, model) {
  const url = `${JETAPI_BASE}/api?reg=${encodeURIComponent(registration)}&photos=3&only_jp=true`;
  try {
    const data = await fetchJson(url);
    if (!data?.Images || data.Images.length === 0) return null;
    const matched = data.Images.filter(img => aircraftTypeMatches(img.Aircraft, model));
    if (matched.length === 0) {
      // Log but still return images if base model matches
      console.log(`    JetAPI type mismatch for ${model} (${registration}): ${data.Images[0].Aircraft} - using anyway`);
      return data.Images;
    }
    return matched;
  } catch (e) {
    console.log(`    JetAPI error for ${model} (${registration}): ${e.message}`);
    return null;
  }
}

const FAMILY_REGISTRATIONS = {
  airbus: {
    'A220': 'C-FFDK',
    'A318': 'D-AVWA',
    'A319': 'D-AVWA',
    'A320': 'F-WWAI',
    'A321': 'D-AVXB',
    'A330': 'F-WWKB',
    'A340': 'F-WWAI',
    'A350': 'F-WZGG',
    'A380': 'F-WWOW',
    'A300': 'F-WUAB',
    'A310': 'F-WZLI',
    'Beluga': 'F-GSTA',
    'Super Guppy': 'F-BTGV',
    'Concorde': 'F-WTSS',
    'ACJ': 'F-WWBA',
    'A400M': 'F-WWMZ',
    'H125': 'F-HAHL',
    'H130': 'F-HAHL',
    'H135': 'F-HAHL',
    'H145': 'F-HAHL',
    'H155': 'F-HAHL',
    'H175': 'F-HAHL',
    'H225': 'F-HAHL',
    'NH90': 'F-ZWTI',
    'AS365': 'F-GVIB',
    'BO-105': 'D-HDDV',
    'BK-117': 'D-HAFL',
    'Gazelle': 'F-ZWRA',
    'CityAirbus': 'F-WWCU',
    'VSR700': 'F-WWCU',
    'A320P2F': 'F-WWBA',
    'A321P2F': 'F-WWAI',
    'A330P2F': 'F-WWKA',
    'A350F': 'F-WZGG',
  },
  boeing: {
    '737': 'N73700',
    '747': 'N747EX',
    '757': 'N757AF',
    '767': 'N767BA',
    '777': 'N731AN',
    '787': 'N787BA',
    '717': 'N717XE',
    '727': 'N72700',
    '707': 'N70700',
    '377': 'N1022V',
    '247': 'N13347',
    '314': 'NC18602',
    'B-52': '60-0008',
    'C-17': '92-3291',
    'AH-64': '09-05591',
    'CH-47': '89-00143',
    'P-8': '167955',
    'KC-46': '17-46030',
    'V-22': '168280',
    'F-15': '20-0001',
    'F-18': '165186',
    'F-86': '51-2832',
    'B-17': 'N5017N',
    'B-29': 'N529B',
  },
  cessna: {
    'Cessna 152': 'N152UC',
    'Cessna 172': 'N172CE',
    'Cessna 182': 'N182CE',
    'Cessna 206': 'N206CE',
    'Cessna 208': 'N208LP',
    'Citation': 'N750CX',
  },
  bombardier: {
    'Challenger': 'C-GPGD',
    'CRJ': 'C-FRJX',
    'Global': 'C-GGLO',
  },
  gulfstream: {
    'Gulfstream': 'N650GA',
  },
  dassault: {
    'Falcon': 'F-GSXA',
  },
  pilatus: {
    'PC-12': 'HB-FVX',
    'PC-24': 'HB-VXA',
    'PC-21': 'HB-HWC',
  },
  beechcraft: {
    'King Air': 'N350KA',
    'Baron': 'N58W',
    'Bonanza': 'N36T',
    'T-6': 'N3000B',
  },
  sikorsky: {
    'S-92': 'N921R',
    'S-76': 'N762WL',
    'UH-60': 'N762WL',
    'CH-53': 'N762CL',
  },
  leonardo: {
    'AW139': 'I-AWCU',
    'AW169': 'I-EASF',
    'AW189': 'I-EASN',
    'M-346': 'CM-X615',
  },
  atr: {
    'ATR': 'F-WWEY',
  },
  'de-havilland': {
    'Dash 8': 'C-GWXZ',
    'Twin Otter': 'C-GFAP',
  },
  'mitsubishi-mrj': {
    'MRJ': 'JA21MJ',
  },
  'comac-c919': {
    'C919': 'B-001A',
    'ARJ21': 'B-1110L',
  },
  tecnam: {
    'P92': 'I-RAIT',
    'P2002': 'I-RAIT',
    'P2006T': 'I-RAIT',
    'P2010': 'I-RAIT',
  },
  piper: {
    'Cherokee': 'N4470T',
    'Super Cub': 'N4470T',
  },
  cirrus: {
    'SR22': 'N227SR',
    'SR20': 'N200SR',
    'Vision': 'N508FA',
  },
  let: {
    'L410': 'OK-TCA',
  },
  aeroprakt: {
    'A22': 'UR-AWO',
  },
  embraer: {
    'E190': 'PR-ZIQ',
    'Phenom': 'PR-ZIJ',
  },
};

function findRegistration(id, manufacturer, model) {
  if (MANUFACTURER_REGISTRATIONS[id]) return MANUFACTURER_REGISTRATIONS[id];

  const family = FAMILY_REGISTRATIONS[manufacturer];
  if (!family) return null;

  // Find the longest matching family key
  const keys = Object.keys(family);
  const matchingKey = keys
    .filter(k => model.toLowerCase().includes(k.toLowerCase()))
    .sort((a, b) => b.length - a.length)[0];

  return matchingKey ? family[matchingKey] : null;
}

async function downloadForAircraft(id, manufacturer, model, folderPath) {
  const safeName = safeFileName(manufacturer, model);
  const destPath = path.join(folderPath, `${safeName}.jpg`);

  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
    return { status: 'cached', path: destPath };
  }

  const registration = findRegistration(id, manufacturer, model);
  if (!registration) {
    return { status: 'no-registration' };
  }

  const images = await queryJetAPI(registration, model);
  if (!images || images.length === 0) {
    return { status: 'no-images' };
  }

  for (const img of images) {
    try {
      const url = img.Image || img.Thumbnail;
      if (!url) continue;
      await downloadImage(url, destPath);
      const stats = fs.statSync(destPath);
      if (stats.size > 1000) {
        return { status: 'downloaded', path: destPath, size: stats.size, source: url, registration };
      }
      fs.unlinkSync(destPath);
    } catch (e) {
      // try next image
    }
  }
  return { status: 'failed' };
}

async function main() {
  const content = fs.readFileSync(DATA_FILE, 'utf8');

  const start = content.indexOf('export const aircraftTypeRatings');
  const end = content.indexOf('export const getManufacturerById');
  const section = content.substring(start, end);

  const regex = /\n\s+id:\s+'([^']+)',\n\s+manufacturer_id:\s+'([^']+)',\n\s+model:\s+'([^']+)'/g;
  let match;
  const aircraft = [];
  while ((match = regex.exec(section)) !== null) {
    aircraft.push({ id: match[1], manufacturer_id: match[2], model: match[3] });
  }

  const byManufacturer = {};
  for (const a of aircraft) {
    if (!byManufacturer[a.manufacturer_id]) byManufacturer[a.manufacturer_id] = [];
    byManufacturer[a.manufacturer_id].push(a);
  }

  const filter = process.argv[2];
  let manufacturerIds = Object.keys(byManufacturer);
  if (filter) {
    manufacturerIds = manufacturerIds.filter(id => id.toLowerCase().includes(filter.toLowerCase()));
    console.log(`Filtering to ${manufacturerIds.length} manufacturer(s) matching '${filter}'...`);
  }
  console.log(`Processing ${manufacturerIds.length} manufacturers...`);

  const results = [];
  for (const mid of manufacturerIds) {
    const folderPath = path.join(BASE_DIR, mid);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    console.log(`\n📁 ${mid} (${byManufacturer[mid].length} aircraft)`);
    for (const a of byManufacturer[mid]) {
      const res = await downloadForAircraft(a.id, mid, a.model, folderPath);
      const relativePath = res.status === 'cached' || res.status === 'downloaded'
        ? `/images/manufacturers/${mid}/${safeFileName(mid, a.model)}.jpg`
        : null;
      results.push({ ...a, ...res, relativePath });
      const label = res.status === 'cached' ? '✅ CACHED' : res.status === 'downloaded' ? '✅ DOWNLOADED' : '❌ ' + res.status.toUpperCase();
      console.log(`  ${label} ${a.model}${res.registration ? ` (${res.registration})` : ''}`);
      await sleep(400);
    }
  }

  // Update data file
  let updatedContent = content;
  let updated = 0;
  for (const r of results) {
    if (!r.relativePath) continue;
    const imgRegex = new RegExp(`(id:\\s*'${r.id}'[\\s\\S]{0,300}image:\\s*')[^']*(')`);
    if (imgRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(imgRegex, `$1${r.relativePath}$2`);
      updated++;
    }
  }
  fs.writeFileSync(DATA_FILE, updatedContent);

  console.log(`\nDone! Updated ${updated} aircraft image paths in ${DATA_FILE}.`);
  console.log(`Manufacturer folders under ${BASE_DIR}:`);
  manufacturerIds.forEach(m => {
    const downloaded = results.filter(r => r.manufacturer_id === m && r.status === 'downloaded').length;
    const cached = results.filter(r => r.manufacturer_id === m && r.status === 'cached').length;
    const missing = results.filter(r => r.manufacturer_id === m && !r.relativePath).length;
    console.log(`  - ${m}: ${downloaded} downloaded, ${cached} cached, ${missing} missing registration`);
  });

  // Write missing registrations report
  const missing = results.filter(r => r.status === 'no-registration');
  if (missing.length) {
    const reportPath = path.join(__dirname, 'missing-registrations.json');
    fs.writeFileSync(reportPath, JSON.stringify(missing.map(m => ({ id: m.id, manufacturer_id: m.manufacturer_id, model: m.model })), null, 2));
    console.log(`\nMissing registrations written to ${reportPath}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
