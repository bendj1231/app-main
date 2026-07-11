#!/usr/bin/env node
/**
 * Create folder structure and data files for APAC helicopter/general aviation operators.
 * Mirrors the airline-logos/APAC/ pattern with country subdirectories.
 *
 * Structure:
 *   public/images/operator-logos/APAC/
 *     apac-region.json
 *     manifest.json
 *     australia/
 *       country-info.json
 *       helicopter-operators/
 *       general-aviation/
 *       air-ambulance/
 *       agricultural-aviation/
 *       flight-training/
 *     new-zealand/
 *       ...
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '../public/images/Pathways/Helicopter Operators/APAC');

// ─── Operator data organized by country ───
const APAC_OPERATORS = {
  australia: {
    helicopter: [
      { name: 'Nautilus Aviation', serviceType: 'EMS, SAR, VIP, charter, tourism' },
      { name: 'McDermott Aviation', serviceType: 'Fire-fighting, aerial lifting, construction' },
      { name: 'Professional Helicopter Services', serviceType: 'Training, charter, EMS' },
      { name: 'Helifarm', serviceType: 'Agricultural, utility' },
      { name: 'Valhalla Helicopters', serviceType: 'Charter, VIP' },
    ],
    general_aviation: [
      { name: 'National Jet Express', serviceType: 'FIFO charter, cargo' },
      { name: 'Brooks Airways', serviceType: 'Private charter, FIFO, medEvac' },
      { name: 'Hardy Aviation', serviceType: 'Charter, passenger, freight' },
      { name: 'Machjet International', serviceType: 'Charter, aeromedical, FBO' },
      { name: 'AERgO International', serviceType: 'Charter, VIP, government, FIFO' },
      { name: 'GAM Group', serviceType: 'Cargo, charter, VIP, FIFO, medical' },
    ],
    air_ambulance: [
      { name: 'CareFlight', serviceType: 'Air ambulance, rescue' },
      { name: 'Royal Flying Doctor Service', serviceType: 'Air ambulance, medical evacuation' },
      { name: 'LifeFlight Australia', serviceType: 'Air ambulance, rescue' },
      { name: 'Pel-Air', serviceType: 'Air ambulance' },
      { name: 'MedSTAR', serviceType: 'Air ambulance' },
      { name: 'Snowy Hydro SouthCare', serviceType: 'Air ambulance, rescue' },
      { name: 'Westpac Lifesaver Rescue Helicopter', serviceType: 'Air ambulance, rescue' },
    ],
    agricultural: [
      { name: 'Air Ag', serviceType: 'Agricultural spraying' },
      { name: 'Robins Aviation', serviceType: 'Aerial agriculture' },
      { name: 'Rebel Ag Aviation', serviceType: 'Aerial agriculture' },
      { name: 'Dunn Aviation', serviceType: 'Aerial agriculture' },
    ],
    flight_training: [
      { name: 'Flight One Education', serviceType: 'Pilot training (fixed-wing and rotary)' },
      { name: 'Flight Training Adelaide', serviceType: 'Airline pilot training' },
      { name: 'National Aviation Academy', serviceType: 'Fixed-wing flight training' },
      { name: 'Quantum Aviation', serviceType: 'Flying school, charter' },
      { name: 'Airspeed Aviation', serviceType: 'Flight training' },
    ],
  },

  'new-zealand': {
    helicopter: [
      { name: 'The Helicopter Line', serviceType: 'Scenic, charter, tourism' },
      { name: 'GCH Aviation', serviceType: 'Scenic, rescue, air ambulance, training' },
      { name: 'Heletranz Helicopters', serviceType: 'VIP, scenic, charter' },
      { name: 'Advanced Flight', serviceType: 'Charter, management, training' },
      { name: 'Rotor Work', serviceType: 'Scenic, charter, agricultural' },
      { name: 'Beck Helicopters', serviceType: 'Aerial services' },
      { name: 'Escape Aviation', serviceType: 'Luxury charters, wilderness' },
      { name: 'Alpine Helicopters', serviceType: 'Scenic, charter' },
    ],
    general_aviation: [
      { name: 'Mainland Air', serviceType: 'Flight training, air charter' },
      { name: 'Eagleflight Technics', serviceType: 'Charter, UAV, training' },
      { name: 'Island Aviation', serviceType: 'Scenic flights, connections' },
      { name: 'Air Safaris', serviceType: 'Scenic flights' },
      { name: 'INFLITE Aviation Services', serviceType: 'Aircraft management, private aviation' },
      { name: 'Tasman Aviation', serviceType: 'Charter flights' },
    ],
    scenic: [
      { name: 'Glenorchy Air', serviceType: 'Scenic flights to Milford Sound, Mt Cook' },
      { name: 'Air Milford', serviceType: 'Scenic flights' },
      { name: 'Southern Alps Air', serviceType: 'Wanaka scenic flights' },
      { name: 'Mount Cook Ski Planes & Helicopters', serviceType: 'Glacier flights, scenic' },
      { name: 'Glacier Southern Lakes Helicopters', serviceType: 'Queenstown scenic flights' },
    ],
  },

  japan: {
    helicopter: [
      { name: 'Central Helicopter Service', serviceType: 'EMS (HEMS), firefighting, rescue' },
      { name: 'Aero Asahi Corporation', serviceType: 'Offshore, EMS, survey, power line' },
      { name: 'NOEVIR AVIATION', serviceType: 'Charter, FBO, maintenance' },
      { name: 'New Japan Helicopter', serviceType: 'Material transport, aerial photography' },
    ],
    general_aviation: [
      { name: 'Aeroworks International', serviceType: 'Business jet ground handling' },
      { name: 'Japan General Aviation Service', serviceType: 'Aircraft sales, maintenance' },
      { name: 'Japan Biz Aviation', serviceType: 'Business aviation, HondaJet charter' },
    ],
  },

  'south-korea': {
    helicopter: [
      { name: 'Korean Air Aerospace Division', serviceType: 'Military helicopter operations' },
    ],
    general_aviation: [],
  },

  china: {
    helicopter: [
      { name: 'Shanghai New Sky Helicopter', serviceType: 'VIP, emergency rescue, medical, filming' },
      { name: 'Eastern General Aviation', serviceType: 'Scenic, charter, training, rescue' },
      { name: 'GDAT General Aviation', serviceType: 'Police, fire, HEMS, offshore, utility' },
      { name: 'Inner Mongolia Eagle Aviation Group', serviceType: 'Agricultural, rescue, training' },
      { name: 'Suzhou Feixian (Ruohang)', serviceType: 'General aviation, helicopter operations' },
      { name: 'CITIC Offshore Helicopter', serviceType: 'Offshore, marine surveillance' },
    ],
    general_aviation: [],
  },

  india: {
    helicopter: [
      { name: 'Pawan Hans Limited', serviceType: 'Offshore, VIP, charter, SAR' },
      { name: 'Global Vectra Helicorp', serviceType: 'Offshore, VIP, charter' },
      { name: 'Heligo Charters', serviceType: 'Offshore, VIP, charter' },
    ],
    flight_training: [
      { name: 'Chimes Aviation Academy', serviceType: 'Flying training, DGCA approved' },
      { name: 'Skynex Aero', serviceType: 'Flight training school' },
      { name: 'Flight Simulation Technique Centre', serviceType: 'CPL training, type rating' },
      { name: 'Redbird Aviation', serviceType: 'Flight training academy' },
      { name: 'Garg Aviation Limited', serviceType: 'Pilot training institute' },
    ],
  },

  indonesia: {
    helicopter: [
      { name: 'Derazona Helicopters', serviceType: 'Offshore, utility, charter' },
      { name: 'Equator Avia Persada', serviceType: 'VIP, charter, medevac, survey' },
      { name: 'ALTIUS Indonesia', serviceType: 'VIP executive transport' },
      { name: 'Falcon Patriot Udara', serviceType: 'Executive transport, surveillance' },
      { name: 'SGi', serviceType: 'Mining support, SAR, firefighting, offshore' },
      { name: 'Volta Pasifik Aviasi', serviceType: 'Passenger, patrol, agriculture, tourism' },
      { name: 'Matthew Air Nusantara', serviceType: 'Charter' },
    ],
    general_aviation: [],
  },

  malaysia: {
    helicopter: [
      { name: 'MHS Aviation Berhad', serviceType: 'Offshore oil and gas, charter, SAR' },
      { name: 'Weststar Group', serviceType: 'Offshore, VIP, charter' },
      { name: 'Mycopter Aviation Services', serviceType: 'Helicopter maintenance' },
    ],
    general_aviation: [],
  },

  singapore: {
    helicopter: [
      { name: 'Singapore Heli Services', serviceType: 'Charter, sightseeing, filming' },
    ],
    private_jet: [
      { name: 'Air Charter Service Singapore', serviceType: 'Private helicopter charter' },
      { name: 'Singapore Air Charter', serviceType: 'Private jet charter' },
      { name: 'Air 7 Asia', serviceType: 'Private jet charter, aircraft management' },
    ],
  },

  thailand: {
    helicopter: [
      { name: 'Thai Aviation Services', serviceType: 'Offshore oil and gas' },
      { name: 'Advance Aviation', serviceType: 'VIP helicopter charter, private jet' },
      { name: 'Silk Sky Air', serviceType: 'Luxury helicopter tours, VIP transfers' },
      { name: 'Andaman Aerodrome', serviceType: 'Helicopter charter' },
    ],
    general_aviation: [],
  },

  vietnam: {
    helicopter: [
      { name: 'Vietnam Helicopters', serviceType: 'Cargo, training, tourism, medevac, SAR' },
      { name: 'VNH Central', serviceType: 'Central Vietnam helicopter operations' },
      { name: 'Aerial.vn', serviceType: 'Helicopter tours, charters, filming' },
      { name: 'Vietnam Helicopter Travel', serviceType: 'Tours, leasing, training' },
      { name: 'Uni Group Asia', serviceType: 'Charter, medivac' },
    ],
    general_aviation: [],
  },

  philippines: {
    helicopter: [
      { name: 'Asia Aircraft Philippines', serviceType: 'Charter, heavy lift, survey' },
      { name: 'PhilJets', serviceType: 'Helicopter charter, private jet' },
      { name: 'LionAir Incorporated', serviceType: 'Private jet and helicopter charter' },
      { name: 'AirTaxi.PH', serviceType: 'Charter planes' },
    ],
    general_aviation: [],
  },

  taiwan: {
    helicopter: [
      { name: 'Ginger Aviation', serviceType: 'Aerial surveying, photography, spraying' },
      { name: 'Apex Aviation', serviceType: 'Offshore wind operations' },
      { name: 'Dong Fang Offshore', serviceType: 'Offshore wind operations' },
    ],
    general_aviation: [],
  },

  'hong-kong': {
    helicopter: [
      { name: 'Heliservices Hong Kong', serviceType: 'Sightseeing, VIP, filming, lifting' },
      { name: 'Government Flying Service', serviceType: 'Emergency helicopter, fixed-wing' },
      { name: 'Seaplane Group', serviceType: 'Charter, private jet, cross-border' },
    ],
    general_aviation: [],
  },

  'sri-lanka': {
    helicopter: [
      { name: 'IWS Aviation', serviceType: 'Charter, maintenance' },
      { name: 'Air SENOK', serviceType: 'Private helicopter charter' },
      { name: 'Rathna Aviation', serviceType: 'Charter helicopter service' },
      { name: 'Senok Air', serviceType: 'Private air charter' },
      { name: 'Senok Air Leisure', serviceType: 'Helicopter tours' },
    ],
    general_aviation: [],
  },

  bangladesh: {
    helicopter: [
      { name: 'Fly Helicopter Service Bangladesh', serviceType: 'Helicopter charter' },
      { name: 'Meghna Aviation Limited', serviceType: 'Corporate air transportation' },
      { name: 'R&R Aviation (Sikder Group)', serviceType: 'Helicopter charter' },
      { name: 'Bashundhara Airways Limited', serviceType: 'Helicopter charter' },
      { name: 'Square Air Limited', serviceType: 'Helicopter charter' },
      { name: 'Impress Aviation Limited', serviceType: 'Helicopter charter' },
      { name: 'BRB Air Limited', serviceType: 'Helicopter charter' },
      { name: 'Partex Aviation Limited', serviceType: 'Helicopter charter' },
      { name: 'South Asian Airlines Limited', serviceType: 'Helicopter charter' },
      { name: 'Helicopter BD', serviceType: 'Helicopter charter, flight charters' },
    ],
    general_aviation: [],
  },

  nepal: {
    helicopter: [
      { name: 'Fishtail Air', serviceType: 'Charter, rescue, trans-border' },
      { name: 'Air Dynasty', serviceType: 'Sightseeing, VIP, SAR, medevac, high-altitude' },
      { name: 'Kailash Helicopter Services', serviceType: 'Rescue, charter, tours, medevac' },
      { name: 'Mustang Helicopter', serviceType: 'High-altitude, rescue, cargo, skydiving' },
      { name: 'Shree Airlines', serviceType: 'Mi-17 operations, CRJ jet fleet' },
      { name: 'Heli Everest', serviceType: 'Charter, tours' },
      { name: 'Basecamp Helicopter', serviceType: 'High-altitude, rescue, logistics' },
    ],
    general_aviation: [],
  },

  pakistan: {
    helicopter: [],
    general_aviation: [],
  },

  'papua-new-guinea': {
    helicopter: [
      { name: 'Pacific Helicopters', serviceType: 'Oil, gas, mining, construction' },
      { name: 'Heli Solutions Ltd', serviceType: 'Executive charter, surveys, cargo, training' },
      { name: 'Niugini Helicopters', serviceType: 'Ad-hoc charter' },
      { name: 'Manolos Aviation Ltd', serviceType: 'Charter, medical evacuation' },
      { name: 'SIL Aviation', serviceType: 'Flight hire, helicopters and fixed-wing' },
      { name: 'Helifix Operations Ltd', serviceType: 'Charter, medevac, survey' },
    ],
    general_aviation: [],
  },

  fiji: {
    helicopter: [
      { name: 'Heli-Tours Fiji', serviceType: 'Resort transfers, scenic, medevac, SAR' },
      { name: 'Island Hoppers Fiji', serviceType: 'Express transfers, scenic flights' },
      { name: 'Helipro Fiji', serviceType: 'Aero medical evacuation, rescue' },
    ],
    general_aviation: [],
  },

  brunei: {
    helicopter: [],
    general_aviation: [],
  },

  myanmar: {
    helicopter: [
      { name: 'Air Myanmar Aviation Services', serviceType: 'Civil aviation services' },
    ],
    general_aviation: [],
  },

  cambodia: {
    helicopter: [
      { name: 'Helicopters Cambodia', serviceType: 'Scenic, mining exploration, surveys' },
      { name: 'Helistar Cambodia', serviceType: 'Scenic, charter, VIP, mining support' },
      { name: 'Helitop Aviation', serviceType: 'Chartered flights, scenic, emergency' },
    ],
    general_aviation: [],
  },

  laos: {
    helicopter: [
      { name: 'Lao Skyway', serviceType: 'Domestic charter, SAR' },
      { name: 'Lao Westcoast Helicopters', serviceType: 'Charter' },
    ],
    general_aviation: [],
  },

  kazakhstan: {
    helicopter: [
      { name: 'Air Tengri', serviceType: 'Offshore, MEDEVAC, VIP' },
      { name: 'Burundaiavia', serviceType: 'Sightseeing, cargo transport' },
      { name: 'Prime Aviation', serviceType: 'Oil and gas, forestry, marine' },
      { name: 'Sky Service', serviceType: 'Helicopter and aircraft charter' },
      { name: 'Tamga Jet', serviceType: 'Business aviation' },
      { name: 'Kazavialesoohrana', serviceType: 'Forest fire detection and extinguishing' },
      { name: 'NCA North Caspian Aviation', serviceType: 'Aerial surveys, patrol' },
    ],
    general_aviation: [],
  },

  uzbekistan: {
    helicopter: [
      { name: 'Uzbekistan Helicopters LLC', serviceType: 'Passenger, charter, medevac' },
      { name: 'Silk Avia', serviceType: 'Tourism helicopter services' },
    ],
    general_aviation: [],
  },

  azerbaijan: {
    helicopter: [
      { name: 'ASG Helicopter Services', serviceType: 'Offshore, SAR, VIP, aerial works' },
      { name: 'Silk Way Helicopter Services', serviceType: 'External load, offshore/onshore' },
    ],
    general_aviation: [],
  },

  maldives: {
    helicopter: [],
    general_aviation: [],
  },

  'solomon-islands': {
    helicopter: [
      { name: 'Helicopter Support (H.A.S. Pty Ltd)', serviceType: 'Charter, utility' },
    ],
    general_aviation: [],
  },

  vanuatu: {
    helicopter: [
      { name: 'Vanuatu Helicopters', serviceType: 'Scenic, charter, volcano viewing' },
      { name: 'Unity Airlines', serviceType: 'Air charter and tour operator' },
    ],
    general_aviation: [],
  },

  'new-caledonia': {
    helicopter: [
      { name: 'Hélicocéan', serviceType: 'Tours, charter, lifting, surveys' },
      { name: 'Helisud', serviceType: 'Scenic tours, aerial work' },
      { name: 'HeliCal (HCM Group)', serviceType: 'Nickel mining, drilling prospecting' },
    ],
    general_aviation: [],
  },

  'french-polynesia': {
    helicopter: [
      { name: 'Tahiti Nui Helicopters', serviceType: 'Scenic flights, inter-island transfers' },
      { name: 'Tahiti-Helicopters', serviceType: 'Bora Bora helicopter tours' },
    ],
    general_aviation: [],
  },

  kiribati: {
    helicopter: [],
    general_aviation: [],
  },

  samoa: {
    helicopter: [],
    general_aviation: [],
  },
};

// ─── Category labels ───
const CATEGORY_LABELS = {
  helicopter: 'Helicopter Operators',
  general_aviation: 'General Aviation',
  air_ambulance: 'Air Ambulance & Medical',
  agricultural: 'Agricultural Aviation',
  flight_training: 'Flight Training',
  scenic: 'Scenic & Tourism',
  private_jet: 'Private Jet Charter',
};

// ─── Helpers ───
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeFilename(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getOperatorsByCategory(countryData) {
  const result = {};
  for (const [category, operators] of Object.entries(countryData)) {
    if (operators.length === 0) continue;
    if (!result[category]) result[category] = [];
    for (const op of operators) {
      result[category].push({
        name: op.name,
        file: `${sanitizeFilename(op.name)}.svg`,
        serviceType: op.serviceType,
        status: 'pending',
      });
    }
  }
  return result;
}

// ─── Main ───
function main() {
  ensureDir(BASE_DIR);

  const countries = [];
  const manifestEntries = [];
  let totalOperators = 0;

  for (const [country, data] of Object.entries(APAC_OPERATORS)) {
    const countryDir = path.join(BASE_DIR, country);
    ensureDir(countryDir);

    const byCategory = getOperatorsByCategory(data);
    const countryCategories = Object.keys(byCategory);
    let countryTotal = 0;

    // Create subdirectories and count operators
    for (const [category, operators] of Object.entries(byCategory)) {
      const catDir = path.join(countryDir, category.replace(/_/g, '-'));
      ensureDir(catDir);
      countryTotal += operators.length;

      // Add to manifest
      for (const op of operators) {
        manifestEntries.push({
          ...op,
          country,
          category,
          path: `${country}/${category.replace(/_/g, '-')}/${op.file}`,
        });
      }
    }

    totalOperators += countryTotal;

    // Create country-info.json
    const countryInfo = {
      country,
      region: 'APAC',
      totalOperators: countryTotal,
      categories: countryCategories.map(cat => ({
        key: cat,
        label: CATEGORY_LABELS[cat] || cat,
        count: byCategory[cat].length,
        operators: byCategory[cat],
      })),
    };

    fs.writeFileSync(
      path.join(countryDir, 'country-info.json'),
      JSON.stringify(countryInfo, null, 2)
    );

    countries.push({
      country,
      totalOperators: countryTotal,
      categories: countryCategories.map(cat => ({
        key: cat,
        label: CATEGORY_LABELS[cat] || cat,
        count: byCategory[cat].length,
      })),
    });

    console.log(`${country}: ${countryTotal} operators across ${countryCategories.length} categories`);
  }

  // Create APAC region overview
  const apacOverview = {
    region: 'APAC',
    totalCountries: countries.filter(c => c.totalOperators > 0).length,
    totalOperators,
    categoryLabels: CATEGORY_LABELS,
    countries: countries.sort((a, b) => b.totalOperators - a.totalOperators),
  };

  fs.writeFileSync(
    path.join(BASE_DIR, 'apac-region.json'),
    JSON.stringify(apacOverview, null, 2)
  );
  console.log(`\nCreated apac-region.json: ${totalOperators} operators across ${apacOverview.totalCountries} countries`);

  // Create manifest.json
  fs.writeFileSync(
    path.join(BASE_DIR, 'manifest.json'),
    JSON.stringify(manifestEntries, null, 2)
  );
  console.log(`Created manifest.json: ${manifestEntries.length} entries`);

  // Create scope of works document
  const scope = `# APAC Helicopter & General Aviation Operator Logos — Scope of Works

## Overview
This document outlines the scope of works for collecting, organizing, and downloading
logos for helicopter operators, general aviation companies, air ambulance services,
agricultural aviation operators, flight training schools, scenic flight operators,
and private jet charter companies across the APAC (Asia-Pacific) region.

## Folder Structure
\`\`\`
public/images/operator-logos/APAC/
  apac-region.json          # Regional overview
  manifest.json             # Download manifest (all operators)
  <country>/
    country-info.json       # Country-level operator data
    helicopter-operators/   # Helicopter operator logos
    general-aviation/       # General aviation operator logos
    air-ambulance/          # Air ambulance & medical logos
    agricultural-aviation/  # Agricultural aviation logos
    flight-training/        # Flight training school logos
    scenic/                 # Scenic & tourism operator logos
    private-jet/            # Private jet charter logos
\`\`\`

## Statistics
- **Total countries with operators:** ${apacOverview.totalCountries}
- **Total operators identified:** ${totalOperators}
- **Logo format:** SVG (preferred), PNG/JPG (fallback)

## Categories
${Object.entries(CATEGORY_LABELS).map(([key, label]) => `- **${label}** (\`${key}\`)`).join('\n')}

## Countries & Operator Counts
${countries
  .filter(c => c.totalOperators > 0)
  .sort((a, b) => b.totalOperators - a.totalOperators)
  .map(c => `- **${c.country}**: ${c.totalOperators} operators (${c.categories.map(cat => `${cat.label}: ${cat.count}`).join(', ')})`)
  .join('\n')}

## Methodology
1. Research and identify all helicopter and general aviation operators in each APAC country
2. Create geographic folder structure mirroring the airline-logos pattern
3. Download SVG logos from Wikimedia Commons where available
4. Fall back to PNG/JPG from official websites or Wikipedia where SVG is unavailable
5. Generate country-info.json for each country with operator metadata
6. Generate apac-region.json with regional overview
7. Generate manifest.json tracking download status for each operator

## Next Steps
- [ ] Download SVG logos from Wikimedia Commons for all identified operators
- [ ] For operators without SVG logos on Commons, search official websites for logo assets
- [ ] Create a TypeScript data file (similar to aircraft-manufacturers.ts) for operator metadata
- [ ] Build UI components to display operators by country and category
- [ ] Integrate with career pathways for helicopter/general aviation pilot routes
`;

  fs.writeFileSync(
    path.join(BASE_DIR, 'SCOPE_OF_WORKS.md'),
    scope
  );
  console.log(`Created SCOPE_OF_WORKS.md`);

  console.log('\n✅ Done! Folder structure and data files created.');
}

main();
