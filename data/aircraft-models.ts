export interface AircraftModel {
  id: string;
  name: string;
  title: string;
  sketchfabId: string;
  embedUrl: string;
  author: string;
  authorUrl: string;
  modelUrl: string;
  category: 'single-engine' | 'multi-engine' | 'turboprop' | 'jet' | 'cockpit' | 'amphibious' | 'vintage' | 'commercial' | 'regional' | 'business-jet';
  tags: string[];
}

export const aircraftModels: AircraftModel[] = [
  // Cessna Single-Engine
  {
    id: 'cessna-172',
    name: 'Cessna 172',
    title: 'Cessna172',
    sketchfabId: 'd1b15841c29c43d0862667300bad55a4',
    embedUrl: 'https://sketchfab.com/models/d1b15841c29c43d0862667300bad55a4/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'KOG_THORNS',
    authorUrl: 'https://sketchfab.com/ioai25312',
    modelUrl: 'https://sketchfab.com/3d-models/cessna172-d1b15841c29c43d0862667300bad55a4',
    category: 'single-engine',
    tags: ['cessna', '172', 'skyhawk', 'piston', 'training', 'ga']
  },
  {
    id: 'cessna-152',
    name: 'Cessna 152',
    title: 'Cessna 152 - NAC Livery',
    sketchfabId: 'f20f6eb4616e4a708241eb3c8a90340a',
    embedUrl: 'https://sketchfab.com/models/f20f6eb4616e4a708241eb3c8a90340a/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'digitaldiligence',
    authorUrl: 'https://sketchfab.com/digitaldiligence',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-152-nac-livery-f20f6eb4616e4a708241eb3c8a90340a',
    category: 'single-engine',
    tags: ['cessna', '152', 'piston', 'training', 'ga']
 },
  {
    id: 'cessna-182',
    name: 'Cessna 182',
    title: 'Cessna 182',
    sketchfabId: 'ed54f082ab014626a1359009b33e7e81',
    embedUrl: 'https://sketchfab.com/models/ed54f082ab014626a1359009b33e7e81/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Zoltan Zengovari',
    authorUrl: 'https://sketchfab.com/Raymax',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-182-ed54f082ab014626a1359009b33e7e81',
    category: 'single-engine',
    tags: ['cessna', '182', 'skylane', 'piston', 'ga']
  },
  {
    id: 'cessna-206',
    name: 'Cessna 206',
    title: 'Cessna 206',
    sketchfabId: 'cf61032f294f4cfab478de38451422a3',
    embedUrl: 'https://sketchfab.com/models/cf61032f294f4cfab478de38451422a3/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'The Digital Shaman',
    authorUrl: 'https://sketchfab.com/digital-shaman',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-206-cf61032f294f4cfab478de38451422a3',
    category: 'single-engine',
    tags: ['cessna', '206', 'stationair', 'piston', 'utility', 'ga']
  },
  {
    id: 'cessna-208',
    name: 'Cessna 208',
    title: 'Cessna 208',
    sketchfabId: '2759f3b519904924bb09d02bd961a308',
    embedUrl: 'https://sketchfab.com/models/2759f3b519904924bb09d02bd961a308/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Dave Love SketchFab',
    authorUrl: 'https://sketchfab.com/Tyler_Dave',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-208-2759f3b519904924bb09d02bd961a308',
    category: 'turboprop',
    tags: ['cessna', '208', 'caravan', 'turboprop', 'cargo']
  },
  {
    id: 'cessna-caravan',
    name: 'Cessna Caravan',
    title: 'Cessna Caravan',
    sketchfabId: '950b500ea537461f8674cebe4902f7ba',
    embedUrl: 'https://sketchfab.com/models/950b500ea537461f8674cebe4902f7ba/embed?autospin=1&camera=0&preload=1',
    author: 'HQ3DMOD',
    authorUrl: 'https://sketchfab.com/AivisAstics',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-caravan-950b500ea537461f8674cebe4902f7ba',
    category: 'turboprop',
    tags: ['cessna', '208', 'caravan', 'turboprop', 'utility']
  },
  {
    id: 'cessna-skycourier',
    name: 'Cessna SkyCourier',
    title: 'Cessna SkyCourier',
    sketchfabId: '36c73da0342144918c439ab5d2f6227f',
    embedUrl: 'https://sketchfab.com/models/36c73da0342144918c439ab5d2f6227f/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Exhibition 3.0',
    authorUrl: 'https://sketchfab.com/Exhibition3.0',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-skycourier-36c73da0342144918c439ab5d2f6227f',
    category: 'turboprop',
    tags: ['cessna', 'skycourier', 'turboprop', 'cargo', 'twin-engine']
  },
  {
    id: 'cessna-citation-x',
    name: 'Cessna Citation X',
    title: 'Cessna Citation X',
    sketchfabId: 'a9eac6363d7f4bfaa7f0ee3b9beca604',
    embedUrl: 'https://sketchfab.com/models/a9eac6363d7f4bfaa7f0ee3b9beca604/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'velychko3dstudio',
    authorUrl: 'https://sketchfab.com/velychko3dstudio',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-citation-x-a9eac6363d7f4bfaa7f0ee3b9beca604',
    category: 'jet',
    tags: ['cessna', 'citation', 'x', 'jet', 'business']
  },
  {
    id: 'cessna-340',
    name: 'Cessna 340',
    title: 'Cessna 340 Landed',
    sketchfabId: '5db8dc613bc2456da7a0a84d908396b0',
    embedUrl: 'https://sketchfab.com/models/5db8dc613bc2456da7a0a84d908396b0/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'The Digital Shaman',
    authorUrl: 'https://sketchfab.com/digital-shaman',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-340-landed-5db8dc613bc2456da7a0a84d908396b0',
    category: 'multi-engine',
    tags: ['cessna', '340', 'piston', 'twin-engine', 'pressurized']
  },
  {
    id: 'cessna-310',
    name: 'Cessna 310',
    title: 'Cessna 310 F-GBMZ (inside & outside)',
    sketchfabId: 'bac3f4fa513f4da189ad6a0f3d4fc42a',
    embedUrl: 'https://sketchfab.com/models/bac3f4fa513f4da189ad6a0f3d4fc42a/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Gerpho 3D',
    authorUrl: 'https://sketchfab.com/gerpho',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-310-f-gbmz-inside-outside-bac3f4fa513f4da189ad6a0f3d4fc42a',
    category: 'multi-engine',
    tags: ['cessna', '310', 'piston', 'twin-engine', 'interior']
  },

  // Tecnam Aircraft
  {
    id: 'tecnam-p92',
    name: 'Tecnam P.92',
    title: 'TECNAM P.92',
    sketchfabId: '4b1c90cce7f14fa3bcbade0bb8c3d855',
    embedUrl: 'https://sketchfab.com/models/4b1c90cce7f14fa3bcbade0bb8c3d855/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'helijah',
    authorUrl: 'https://sketchfab.com/helijah',
    modelUrl: 'https://sketchfab.com/3d-models/tecnam-p92-4b1c90cce7f14fa3bcbade0bb8c3d855',
    category: 'single-engine',
    tags: ['tecnam', 'p92', 'piston', 'light-sport', 'ulm']
  },
  {
    id: 'tecnam-p2002',
    name: 'Tecnam P2002 Sierra',
    title: 'Tecnam P2002 Sierra',
    sketchfabId: '5325a60e1c2f402a8b5b71656ffaea66',
    embedUrl: 'https://sketchfab.com/models/5325a60e1c2f402a8b5b71656ffaea66/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'helijah',
    authorUrl: 'https://sketchfab.com/helijah',
    modelUrl: 'https://sketchfab.com/3d-models/tecnam-p2002-sierra-5325a60e1c2f402a8b5b71656ffaea66',
    category: 'single-engine',
    tags: ['tecnam', 'p2002', 'sierra', 'piston', 'ulm']
  },
  {
    id: 'tecnam-p2006t',
    name: 'Tecnam P2006T',
    title: 'Tecnam P2006T',
    sketchfabId: 'a0a4d717a8c94a17b958eb69c4efc352',
    embedUrl: 'https://sketchfab.com/models/a0a4d717a8c94a17b958eb69c4efc352/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'helijah',
    authorUrl: 'https://sketchfab.com/helijah',
    modelUrl: 'https://sketchfab.com/3d-models/tecnam-p2006t-a0a4d717a8c94a17b958eb69c4efc352',
    category: 'multi-engine',
    tags: ['tecnam', 'p2006t', 'piston', 'twin-engine', 'ulm']
  },

  // Piper Aircraft
  {
    id: 'piper-pa28',
    name: 'Piper PA-28 Cherokee',
    title: 'Piper PA-28 181',
    sketchfabId: 'e39b3679c3a94053a53c4be4eff548bc',
    embedUrl: 'https://sketchfab.com/models/e39b3679c3a94053a53c4be4eff548bc/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Senin Ceria',
    authorUrl: 'https://sketchfab.com/seninceria',
    modelUrl: 'https://sketchfab.com/3d-models/piper-pa-28-181-e39b3679c3a94053a53c4be4eff548bc',
    category: 'single-engine',
    tags: ['piper', 'pa28', 'cherokee', 'piston', 'ga']
  },
  {
    id: 'piper-pa18',
    name: 'Piper PA-18 Super Cub',
    title: 'Piper PA-18 Supercub',
    sketchfabId: '947504c5e11244db8d512f1511e75e4b',
    embedUrl: 'https://sketchfab.com/models/947504c5e11244db8d512f1511e75e4b/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'winterborn',
    authorUrl: 'https://sketchfab.com/winterborn',
    modelUrl: 'https://sketchfab.com/3d-models/piper-pa-18-supercub-947504c5e11244db8d512f1511e75e4b',
    category: 'single-engine',
    tags: ['piper', 'pa18', 'super-cub', 'piston', 'taildragger', 'bush']
  },

  // Business Jets
  {
    id: 'embraer-phenom-300',
    name: 'Embraer Phenom 300',
    title: 'Embraer Phenom 300 Jet',
    sketchfabId: 'cdc1ecc85bf345b788e0094f2fb7e91e',
    embedUrl: 'https://sketchfab.com/models/cdc1ecc85bf345b788e0094f2fb7e91e/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'João Kalva',
    authorUrl: 'https://sketchfab.com/joaokalva',
    modelUrl: 'https://sketchfab.com/3d-models/embraer-phenom-300-jet-cdc1ecc85bf345b788e0094f2fb7e91e',
    category: 'jet',
    tags: ['embraer', 'phenom', '300', 'jet', 'business']
  },
  {
    id: 'cirrus-vision-sf50',
    name: 'Cirrus Vision SF50',
    title: 'cirrus vision Sf50',
    sketchfabId: 'd46dd06b4b5646acaed90993db34d639',
    embedUrl: 'https://sketchfab.com/models/d46dd06b4b5646acaed90993db34d639/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'hilos run',
    authorUrl: 'https://sketchfab.com/hilosrun',
    modelUrl: 'https://sketchfab.com/3d-models/cirrus-vision-sf50-d46dd06b4b5646acaed90993db34d639',
    category: 'jet',
    tags: ['cirrus', 'vision', 'sf50', 'jet', 'vlsa', 'single-engine-jet']
  },
  {
    id: 'cirrus-sr22',
    name: 'Cirrus SR22',
    title: 'Cirrus SR22',
    sketchfabId: 'cba602c99c524cd4b40e5c2e5f9c5b4f',
    embedUrl: 'https://sketchfab.com/models/cba602c99c524cd4b40e5c2e5f9c5b4f/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'KOG_THORNS',
    authorUrl: 'https://sketchfab.com/ioai25312',
    modelUrl: 'https://sketchfab.com/3d-models/cirrus-sr22-cba602c99c524cd4b40e5c2e5f9c5b4f',
    category: 'single-engine',
    tags: ['cirrus', 'sr22', 'piston', 'parachute', 'ga']
  },

  // Regional Aircraft
  {
    id: 'atr-72-600',
    name: 'ATR 72-600',
    title: 'ATR 72 - 600',
    sketchfabId: '1e1a7186f7444d288675262fcee44744',
    embedUrl: 'https://sketchfab.com/models/1e1a7186f7444d288675262fcee44744/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Sofyan Kurniawan',
    authorUrl: 'https://sketchfab.com/sofyankurniawan',
    modelUrl: 'https://sketchfab.com/3d-models/atr-72-600-1e1a7186f7444d288675262fcee44744',
    category: 'turboprop',
    tags: ['atr', '72', 'regional', 'turboprop', 'airline']
  },
  {
    id: 'let-l410',
    name: 'Let L410 Turbolet',
    title: 'Let L410 Turbolet',
    sketchfabId: '38c3aaea4de54eb1a20634586c2a215f',
    embedUrl: 'https://sketchfab.com/models/38c3aaea4de54eb1a20634586c2a215f/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'helijah',
    authorUrl: 'https://sketchfab.com/helijah',
    modelUrl: 'https://sketchfab.com/3d-models/let-l410-turbolet-38c3aaea4de54eb1a20634586c2a215f',
    category: 'turboprop',
    tags: ['let', 'l410', 'turbolet', 'turboprop', 'regional']
  },

  // Vintage & Historical
  {
    id: 'boeing-367',
    name: 'Boeing 367-80 (Dash 80)',
    title: 'Boeing 367-80',
    sketchfabId: '157d9b11101b40319f03dd33678cbde5',
    embedUrl: 'https://sketchfab.com/models/157d9b11101b40319f03dd33678cbde5/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Tim Samedov',
    authorUrl: 'https://sketchfab.com/citizensnip',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-367-80-157d9b11101b40319f03dd33678cbde5',
    category: 'vintage',
    tags: ['boeing', '367', 'dash-80', '707', 'prototype', 'vintage', 'jet']
  },

  // Amphibious
  {
    id: 'aeroprakt-a22-foxbat',
    name: 'Aeroprakt A22 Foxbat Amphibious',
    title: 'Aeroprakt A22 Foxbat Amphibius',
    sketchfabId: '881d2479d29149b7bf2b5788b869094f',
    embedUrl: 'https://sketchfab.com/models/881d2479d29149b7bf2b5788b869094f/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'helijah',
    authorUrl: 'https://sketchfab.com/helijah',
    modelUrl: 'https://sketchfab.com/3d-models/aeroprakt-a22-foxbat-amphibius-881d2479d29149b7bf2b5788b869094f',
    category: 'amphibious',
    tags: ['aeroprakt', 'a22', 'foxbat', 'amphibious', 'ulm', 'floats']
  },

  // Cockpit Models
  {
    id: 'cessna-172-cockpit',
    name: 'Cessna 172 Cockpit',
    title: 'Cessna 172 Cockpit Instrument Panel',
    sketchfabId: '8abac371880c47869ee4063a3c33707b',
    embedUrl: 'https://sketchfab.com/models/8abac371880c47869ee4063a3c33707b/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'FordVFX',
    authorUrl: 'https://sketchfab.com/FordVFX',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-172-cockpit-instrument-panel-8abac371880c47869ee4063a3c33707b',
    category: 'cockpit',
    tags: ['cessna', '172', 'cockpit', 'instruments', 'panel', 'interior']
  },
  {
    id: 'atr-72-cockpit',
    name: 'ATR 72-600 Cockpit',
    title: 'ART 72-600 Cockpit',
    sketchfabId: '5fbfd7db08f741fba7d0abbfb42e334a',
    embedUrl: 'https://sketchfab.com/models/5fbfd7db08f741fba7d0abbfb42e334a/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'AirStudios',
    authorUrl: 'https://sketchfab.com/airstudios3d',
    modelUrl: 'https://sketchfab.com/3d-models/art-72-600-cockpit-5fbfd7db08f741fba7d0abbfb42e334a',
    category: 'cockpit',
    tags: ['atr', '72', 'cockpit', 'interior', 'instruments']
  },
  {
    id: 'boeing-777-cockpit',
    name: 'Boeing 777 Cockpit',
    title: '(Boeing b777) Airplane Cockpit',
    sketchfabId: 'b26348458561460eba447a12dec33676',
    embedUrl: 'https://sketchfab.com/models/b26348458561460eba447a12dec33676/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'AirStudios',
    authorUrl: 'https://sketchfab.com/airstudios3d',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-b777-airplane-cockpit-b26348458561460eba447a12dec33676',
    category: 'cockpit',
    tags: ['boeing', '777', 'cockpit', 'interior', 'widebody', 'instruments']
  },
  {
    id: 'boeing-737-cockpit',
    name: 'Boeing 737 Cockpit',
    title: '(Boeing 737) Airplane Cockpit',
    sketchfabId: '41a1ae9e252d41bda7c63cfe9fab5a02',
    embedUrl: 'https://sketchfab.com/models/41a1ae9e252d41bda7c63cfe9fab5a02/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'AirStudios',
    authorUrl: 'https://sketchfab.com/airstudios3d',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-737-airplane-cockpit-41a1ae9e252d41bda7c63cfe9fab5a02',
    category: 'cockpit',
    tags: ['boeing', '737', 'cockpit', 'interior', 'narrowbody', 'instruments']
  },

  // Duplicate/Alternative Models
  {
    id: 'cessna-172-alt',
    name: 'Cessna 172 (Alternative)',
    title: 'Cessna 172',
    sketchfabId: '4e8c5bf635164a85b3932dcbe959bfdd',
    embedUrl: 'https://sketchfab.com/models/4e8c5bf635164a85b3932dcbe959bfdd/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'radbitgames',
    authorUrl: 'https://sketchfab.com/radbitgames',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-172-4e8c5bf635164a85b3932dcbe959bfdd',
    category: 'single-engine',
    tags: ['cessna', '172', 'skyhawk', 'piston', 'training', 'ga']
  },

  // Airbus Commercial Aircraft
  {
    id: 'airbus-a320',
    name: 'Airbus A320',
    title: 'Airbus A320 Airplane (Highly Detailed)',
    sketchfabId: 'ae3d357729a44f278f9ef9326977504a',
    embedUrl: 'https://sketchfab.com/models/ae3d357729a44f278f9ef9326977504a/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'AirStudios',
    authorUrl: 'https://sketchfab.com/airstudios3d',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a320-airplane-highly-detailed-ae3d357729a44f278f9ef9326977504a',
    category: 'commercial',
    tags: ['airbus', 'a320', 'narrowbody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a380',
    name: 'Airbus A380',
    title: 'Airbus A380',
    sketchfabId: '98d21f9c8104445f814cef47ef992889',
    embedUrl: 'https://sketchfab.com/models/98d21f9c8104445f814cef47ef992889/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'David Broutian',
    authorUrl: 'https://sketchfab.com/davidbroutian',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a380-98d21f9c8104445f814cef47ef992889',
    category: 'commercial',
    tags: ['airbus', 'a380', 'superjumbo', 'widebody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a330',
    name: 'Airbus A330-900neo',
    title: 'Airbus A330-900 neo',
    sketchfabId: '50c4ed883e00436e80a3f1c8048f549f',
    embedUrl: 'https://sketchfab.com/models/50c4ed883e00436e80a3f1c8048f549f/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'lrgk',
    authorUrl: 'https://sketchfab.com/lrgk',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a330-900-neo-50c4ed883e00436e80a3f1c8048f549f',
    category: 'commercial',
    tags: ['airbus', 'a330', 'neo', 'widebody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a350',
    name: 'Airbus A350-900',
    title: 'Airbus A350 900',
    sketchfabId: '0703224a1a7e497eaa2a860e1d3b1774',
    embedUrl: 'https://sketchfab.com/models/0703224a1a7e497eaa2a860e1d3b1774/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'SQUIR3D',
    authorUrl: 'https://sketchfab.com/squir3d',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a350-900-0703224a1a7e497eaa2a860e1d3b1774',
    category: 'commercial',
    tags: ['airbus', 'a350', 'xwb', 'widebody', 'commercial', 'airline']
  },

  // Boeing Commercial Aircraft
  {
    id: 'boeing-737',
    name: 'Boeing 737-800',
    title: 'Boeing 737-800',
    sketchfabId: '7a548b5ba64340f78f7c58d23781ffe9',
    embedUrl: 'https://sketchfab.com/models/7a548b5ba64340f78f7c58d23781ffe9/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'andriiharbut',
    authorUrl: 'https://sketchfab.com/andriiharbut',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-737-800-7a548b5ba64340f78f7c58d23781ffe9',
    category: 'commercial',
    tags: ['boeing', '737', 'narrowbody', 'commercial', 'airline']
  },
  {
    id: 'boeing-777',
    name: 'Boeing 777-300ER',
    title: 'Boeing 777-300ER',
    sketchfabId: 'be25770697e64f1daef1cc3ad26d3ce7',
    embedUrl: 'https://sketchfab.com/models/be25770697e64f1daef1cc3ad26d3ce7/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Fel P',
    authorUrl: 'https://sketchfab.com/philpay',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-777-300er-be25770697e64f1daef1cc3ad26d3ce7',
    category: 'commercial',
    tags: ['boeing', '777', 'widebody', 'commercial', 'airline', 'triple-seven']
  },
  {
    id: 'boeing-787',
    name: 'Boeing 787 Dreamliner',
    title: 'Boeing 787 Dreamliner',
    sketchfabId: '3ba8a5275d0e41968b34d367c34e8f0f',
    embedUrl: 'https://sketchfab.com/models/3ba8a5275d0e41968b34d367c34e8f0f/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'iSteven',
    authorUrl: 'https://sketchfab.com/isteven',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-787-dreamliner-3ba8a5275d0e41968b34d367c34e8f0f',
    category: 'commercial',
    tags: ['boeing', '787', 'dreamliner', 'widebody', 'commercial', 'airline']
  },
  {
    id: 'boeing-747',
    name: 'Boeing 747-8i',
    title: 'Boeing 747-8i',
    sketchfabId: '86ec524a08e74e5e8907771c2d96b525',
    embedUrl: 'https://sketchfab.com/models/86ec524a08e74e5e8907771c2d96b525/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Fel P',
    authorUrl: 'https://sketchfab.com/philpay',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-747-8i-86ec524a08e74e5e8907771c2d96b525',
    category: 'commercial',
    tags: ['boeing', '747', 'jumbo', 'widebody', 'commercial', 'airline', 'queen-of-skies']
  },

  // Regional Aircraft
  {
    id: 'embraer-e190',
    name: 'Embraer E190',
    title: 'Embraer E-190 E-Jets E2',
    sketchfabId: 'b971aca02af4435db7104c8c2ce9bbdd',
    embedUrl: 'https://sketchfab.com/models/b971aca02af4435db7104c8c2ce9bbdd/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Simaoelis3D',
    authorUrl: 'https://sketchfab.com/simaoelis3d',
    modelUrl: 'https://sketchfab.com/3d-models/embraer-e-190-e-jets-e2-color-house-shark-b971aca02af4435db7104c8c2ce9bbdd',
    category: 'regional',
    tags: ['embraer', 'e190', 'e-jet', 'e2', 'regional', 'airline']
  },
  {
    id: 'crj-700',
    name: 'CRJ-700',
    title: 'CRJ-700',
    sketchfabId: '98e4de0ba2b6489c896f224fb70c5e75',
    embedUrl: 'https://sketchfab.com/models/98e4de0ba2b6489c896f224fb70c5e75/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'Rick Palo',
    authorUrl: 'https://sketchfab.com/rickpalo',
    modelUrl: 'https://sketchfab.com/3d-models/crj-700-98e4de0ba2b6489c896f224fb70c5e75',
    category: 'regional',
    tags: ['crj', '700', 'canadair', 'regional', 'jet', 'airline']
  },

  // Business Jets
  {
    id: 'gulfstream-g650',
    name: 'Gulfstream G650',
    title: 'Gulfstream G650',
    sketchfabId: '67451e56d38746de86667347d7a56587',
    embedUrl: 'https://sketchfab.com/models/67451e56d38746de86667347d7a56587/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'John Doe',
    authorUrl: 'https://sketchfab.com/johndoe3d',
    modelUrl: 'https://sketchfab.com/3d-models/gulfstream-g650-67451e56d38746de86667347d7a56587',
    category: 'business-jet',
    tags: ['gulfstream', 'g650', 'business-jet', 'ultra-long-range', 'corporate']
  },
  {
    id: 'challenger-350',
    name: 'Bombardier Challenger 350',
    title: 'Bombardier Challenger 350',
    sketchfabId: '5f7af63167374f98a3a457f38818b996',
    embedUrl: 'https://sketchfab.com/models/5f7af63167374f98a3a457f38818b996/embed?autospin=1&camera=0&preload=1&ui_theme=dark',
    author: 'dizmi',
    authorUrl: 'https://sketchfab.com/dizmi',
    modelUrl: 'https://sketchfab.com/3d-models/bombardier-challenger-350-5f7af63167374f98a3a457f38818b996',
    category: 'business-jet',
    tags: ['bombardier', 'challenger', '350', 'business-jet', 'super-midsize', 'corporate']
  },

  // Additional aircraft from PathwaysPageModern.tsx SKETCHFAB_MODELS
  {
    id: 'airbus-a220',
    name: 'Airbus A220',
    title: 'Airbus A220',
    sketchfabId: 'ce4fbb839e6b4bb989422426bfc8fd1c',
    embedUrl: 'https://sketchfab.com/models/ce4fbb839e6b4bb989422426bfc8fd1c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'BlueMesh',
    authorUrl: 'https://sketchfab.com/bluemesh',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a220-ce4fbb839e6b4bb989422426bfc8fd1c',
    category: 'commercial',
    tags: ['airbus', 'a220', 'c-series', 'narrowbody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a318',
    name: 'Airbus A318',
    title: 'Airbus A318',
    sketchfabId: '43cd2ce76c214dd6b465117426554dd6',
    embedUrl: 'https://sketchfab.com/models/43cd2ce76c214dd6b465117426554dd6/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'OUTPISTON',
    authorUrl: 'https://sketchfab.com/outpiston',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a318-43cd2ce76c214dd6b465117426554dd6',
    category: 'commercial',
    tags: ['airbus', 'a318', 'a320-family', 'narrowbody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a319',
    name: 'Airbus A319',
    title: 'Airbus A319',
    sketchfabId: '536400f2043a4809a0b6913cd4df2617',
    embedUrl: 'https://sketchfab.com/models/536400f2043a4809a0b6913cd4df2617/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'OUTPISTON',
    authorUrl: 'https://sketchfab.com/outpiston',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a319-536400f2043a4809a0b6913cd4df2617',
    category: 'commercial',
    tags: ['airbus', 'a319', 'a320-family', 'narrowbody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a321',
    name: 'Airbus A321',
    title: 'Airbus A321',
    sketchfabId: '561c4002ed6c44b697195cdffb60e25c',
    embedUrl: 'https://sketchfab.com/models/561c4002ed6c44b697195cdffb60e25c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'OUTPISTON',
    authorUrl: 'https://sketchfab.com/outpiston',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a321-561c4002ed6c44b697195cdffb60e25c',
    category: 'commercial',
    tags: ['airbus', 'a321', 'a320-family', 'narrowbody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a310',
    name: 'Airbus A310',
    title: 'Airbus A310',
    sketchfabId: '93b8d5bf59f74071a65ede1ef2e29aae',
    embedUrl: 'https://sketchfab.com/models/93b8d5bf59f74071a65ede1ef2e29aae/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'OUTPISTON',
    authorUrl: 'https://sketchfab.com/outpiston',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a310-93b8d5bf59f74071a65ede1ef2e29aae',
    category: 'commercial',
    tags: ['airbus', 'a310', 'widebody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a330-300',
    name: 'Airbus A330-300',
    title: 'Airbus A330-300',
    sketchfabId: '745c36e5187d4352bbe7e5e94f8e5105',
    embedUrl: 'https://sketchfab.com/models/745c36e5187d4352bbe7e5e94f8e5105/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'SQUIR3D',
    authorUrl: 'https://sketchfab.com/squir3d',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a330-300-745c36e5187d4352bbe7e5e94f8e5105',
    category: 'commercial',
    tags: ['airbus', 'a330', 'widebody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a340',
    name: 'Airbus A340',
    title: 'Airbus A340',
    sketchfabId: '499ae6227c734f59a54c101a537ca6c7',
    embedUrl: 'https://sketchfab.com/models/499ae6227c734f59a54c101a537ca6c7/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'Dave Love SketchFab',
    authorUrl: 'https://sketchfab.com/Tyler_Dave',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a340-499ae6227c734f59a54c101a537ca6c7',
    category: 'commercial',
    tags: ['airbus', 'a340', 'four-engine', 'widebody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a350-ns',
    name: 'Airbus A350 (N.S. Studios)',
    title: 'Airbus A350',
    sketchfabId: 'b36bae5dcdd9465e8789df568a9620e2',
    embedUrl: 'https://sketchfab.com/models/b36bae5dcdd9465e8789df568a9620e2/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'N.S STUDIOS',
    authorUrl: 'https://sketchfab.com/n-s-studios',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a350-b36bae5dcdd9465e8789df568a9620e2',
    category: 'commercial',
    tags: ['airbus', 'a350', 'xwb', 'widebody', 'commercial', 'airline']
  },
  {
    id: 'airbus-a380-alt',
    name: 'Airbus A380 (Alternative)',
    title: 'Airbus A380',
    sketchfabId: '49687e726121405d96c7d5be03b5673a',
    embedUrl: 'https://sketchfab.com/models/49687e726121405d96c7d5be03b5673a/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'davidmarton1987',
    authorUrl: 'https://sketchfab.com/davidmarton1987',
    modelUrl: 'https://sketchfab.com/3d-models/airbus-a380-49687e726121405d96c7d5be03b5673a',
    category: 'commercial',
    tags: ['airbus', 'a380', 'superjumbo', 'widebody', 'commercial', 'airline']
  },
  {
    id: 'boeing-777-kanedog',
    name: 'Boeing 777 (Kanedog)',
    title: 'Boeing 777',
    sketchfabId: 'f9e03987eaa84127ab999f48a32be641',
    embedUrl: 'https://sketchfab.com/models/f9e03987eaa84127ab999f48a32be641/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'Kanedog',
    authorUrl: 'https://sketchfab.com/kanedog',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-777-f9e03987eaa84127ab999f48a32be641',
    category: 'commercial',
    tags: ['boeing', '777', 'widebody', 'commercial', 'airline', 'triple-seven']
  },
  {
    id: 'boeing-737-outpiston',
    name: 'Boeing 737-800 (OUTPISTON)',
    title: 'Boeing 737-800',
    sketchfabId: 'fa2d273dba0e45348284a6d6cd711218',
    embedUrl: 'https://sketchfab.com/models/fa2d273dba0e45348284a6d6cd711218/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'OUTPISTON',
    authorUrl: 'https://sketchfab.com/outpiston',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-737-800-fa2d273dba0e45348284a6d6cd711218',
    category: 'commercial',
    tags: ['boeing', '737', 'narrowbody', 'commercial', 'airline']
  },
  {
    id: 'cessna-citation-latitude',
    name: 'Cessna Citation Latitude',
    title: 'Cessna Citation Latitude',
    sketchfabId: 'c5ad92e005e84f229de080f5b7279957',
    embedUrl: 'https://sketchfab.com/models/c5ad92e005e84f229de080f5b7279957/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'artformat',
    authorUrl: 'https://sketchfab.com/artformat',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-citation-latitude-c5ad92e005e84f229de080f5b7279957',
    category: 'business-jet',
    tags: ['cessna', 'citation', 'latitude', 'business-jet', 'super-midsize', 'corporate']
  },
  {
    id: 'cessna-citation-m2',
    name: 'Cessna Citation M2',
    title: 'Cessna Citation M2',
    sketchfabId: '36e78f157d2643849bb89a46d5bc03ab',
    embedUrl: 'https://sketchfab.com/models/36e78f157d2643849bb89a46d5bc03ab/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'Exhibition 3.0',
    authorUrl: 'https://sketchfab.com/exhibition3.0',
    modelUrl: 'https://sketchfab.com/3d-models/cessna-citation-m2-36e78f157d2643849bb89a46d5bc03ab',
    category: 'business-jet',
    tags: ['cessna', 'citation', 'm2', 'business-jet', 'light-jet', 'corporate']
  },

  // Cockpit Models from PathwaysPageModern.tsx SKETCHFAB_COCKPITS
  {
    id: 'airbus-a320-cockpit',
    name: 'Airbus A320 Cockpit',
    title: 'A320 Cockpit',
    sketchfabId: 'feaa475ce5824121be0380a42987007f',
    embedUrl: 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'AirStudios',
    authorUrl: 'https://sketchfab.com/airstudios3d',
    modelUrl: 'https://sketchfab.com/3d-models/a320-cockpit-feaa475ce5824121be0380a42987007f',
    category: 'cockpit',
    tags: ['airbus', 'a320', 'cockpit', 'interior', 'glass-cockpit', 'a320-family']
  },
  {
    id: 'boeing-737-cockpit-alt',
    name: 'Boeing 737 Cockpit (Alternative)',
    title: '(Boeing 737) Airplane Cockpit',
    sketchfabId: '41a1ae9e252d41bda7c63cfe9fab5a02',
    embedUrl: 'https://sketchfab.com/models/41a1ae9e252d41bda7c63cfe9fab5a02/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'AirStudios',
    authorUrl: 'https://sketchfab.com/airstudios3d',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-737-airplane-cockpit-41a1ae9e252d41bda7c63cfe9fab5a02',
    category: 'cockpit',
    tags: ['boeing', '737', 'cockpit', 'interior', 'glass-cockpit', 'narrowbody']
  },
  {
    id: 'boeing-747-cockpit-alt',
    name: 'Boeing 747 Cockpit (Alternative)',
    title: 'Boeing 747 Cockpit',
    sketchfabId: '9e7bfa1049ec44a2a8d8d0bdaf51533c',
    embedUrl: 'https://sketchfab.com/models/9e7bfa1049ec44a2a8d8d0bdaf51533c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
    author: 'AirStudios',
    authorUrl: 'https://sketchfab.com/airstudios3d',
    modelUrl: 'https://sketchfab.com/3d-models/boeing-747-cockpit-9e7bfa1049ec44a2a8d8d0bdaf51533c',
    category: 'cockpit',
    tags: ['boeing', '747', 'cockpit', 'interior', 'glass-cockpit', 'jumbo']
  }
];

// Helper functions
export const getAircraftById = (id: string): AircraftModel | undefined => {
  return aircraftModels.find(model => model.id === id);
};

export const getAircraftByCategory = (category: AircraftModel['category']): AircraftModel[] => {
  return aircraftModels.filter(model => model.category === category);
};

export const getAircraftByTag = (tag: string): AircraftModel[] => {
  return aircraftModels.filter(model => model.tags.includes(tag.toLowerCase()));
};

export const getSingleEngineAircraft = (): AircraftModel[] => {
  return aircraftModels.filter(model => model.category === 'single-engine');
};

export const getMultiEngineAircraft = (): AircraftModel[] => {
  return aircraftModels.filter(model => model.category === 'multi-engine');
};

export const getCockpitModels = (): AircraftModel[] => {
  return aircraftModels.filter(model => model.category === 'cockpit');
};

export const getTurboprops = (): AircraftModel[] => {
  return aircraftModels.filter(model => model.category === 'turboprop');
};

export const getJets = (): AircraftModel[] => {
  return aircraftModels.filter(model => model.category === 'jet');
};

export const generateEmbedIframe = (model: AircraftModel, width = '640', height = '480'): string => {
  return `<div class="sketchfab-embed-wrapper">
  <iframe 
    title="${model.title}" 
    frameborder="0" 
    allowfullscreen 
    mozallowfullscreen="true" 
    webkitallowfullscreen="true" 
    allow="autoplay; fullscreen; xr-spatial-tracking" 
    xr-spatial-tracking 
    execution-while-out-of-viewport 
    execution-while-not-rendered 
    web-share 
    src="${model.embedUrl}" 
    width="${width}" 
    height="${height}"
    style="border: none;"
  ></iframe>
  <p style="font-size: 13px; font-weight: normal; margin: 5px; color: #4A4A4A;">
    <a href="${model.modelUrl}?utm_medium=embed&utm_campaign=share-popup&utm_content=${model.sketchfabId}" 
       target="_blank" 
       rel="nofollow" 
       style="font-weight: bold; color: #1CAAD9;">
      ${model.title}
    </a> by 
    <a href="${model.authorUrl}?utm_medium=embed&utm_campaign=share-popup&utm_content=${model.sketchfabId}" 
       target="_blank" 
       rel="nofollow" 
       style="font-weight: bold; color: #1CAAD9;">
      ${model.author}
    </a> on 
    <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=${model.sketchfabId}" 
       target="_blank" 
       rel="nofollow" 
       style="font-weight: bold; color: #1CAAD9;">
      Sketchfab
    </a>
  </p>
</div>`;
};
