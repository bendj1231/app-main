#!/usr/bin/env node
/**
 * Expand aircraft entries and download images per manufacturer.
 * Usage: node expand-and-download.cjs <manufacturer-id>
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');

function makeEntry(mfr, id, model, cat, year, desc, mtow, speed, range, cap, eng, engType, len, span, hgt) {
  const safeId = id.replace(/[^a-z0-9-]/g, '');
  const image = `/images/manufacturers/${mfr}/${mfr}-${safeId}.jpg`;
  return `  {
    id: '${safeId}',
    manufacturer_id: '${mfr}',
    model: '${model}',
    category: '${cat}',
    image: '${image}',
    description: '${desc}',
    first_flight: ${year},
    specifications: {
      max_takeoff_weight: '${mtow}',
      cruising_speed: '${speed}',
      range: '${range}',
      capacity: ${cap},
      engines: ${eng},
      engine_type: '${engType}',
      length: '${len}',
      wingspan: '${span}',
      height: '${hgt || 'N/A'}'
    },
    training_requirements: {
      minimum_hours: 1500,
      required_licenses: ['CPL', 'IR', 'ME'],
      medical_certificate: 'Class 1',
      english_proficiency: 'ICAO Level 4',
      ground_school_hours: 80,
      simulator_hours: 20,
      flight_hours: 10
    },
    training_curriculum: [
      { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
      { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
      { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
    ],
    simulator_details: {
      type: 'Full Flight Simulator',
      locations: ['Manufacturer training center'],
      features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
    },
    instructor_qualifications: [
      { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
    ],
    certification: {
      authority: 'EASA / FAA',
      validity: '1 year',
      renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
    }
  }`;
}

function addEntries(mfr, entries) {
  let content = fs.readFileSync(DATA_FILE, 'utf8');
  const marker = 'export const getManufacturerById';
  const markerIndex = content.indexOf(marker);
  const insertAt = content.lastIndexOf('\n];', markerIndex);
  if (insertAt < 0) { console.log('Could not find insertion point'); return 0; }

  const existingIds = new Set();
  const idRegex = new RegExp(`id:\\s+'([^']+)',\\s+\\n\\s+manufacturer_id:\\s+'${mfr}'`, 'g');
  let m; while ((m = idRegex.exec(content)) !== null) existingIds.add(m[1]);

  const newEntries = entries.filter(e => !existingIds.has(e[0])).map(e =>
    makeEntry(mfr, e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13])
  );

  if (newEntries.length === 0) { console.log('No new entries to add'); return 0; }

  content = content.slice(0, insertAt) + ',\n' + newEntries.join(',\n') + '\n' + content.slice(insertAt);
  fs.writeFileSync(DATA_FILE, content);
  console.log(`Added ${newEntries.length} new entries for ${mfr}`);
  return newEntries.length;
}

// Load data from external module
const dataPath = path.join(__dirname, 'batch-data', `${process.argv[2]}-batch.cjs`);
if (!fs.existsSync(dataPath)) {
  console.error(`No batch data found: ${dataPath}`);
  process.exit(1);
}

const batch = require(dataPath);
const mfr = process.argv[2];
console.log(`Processing ${mfr} with ${batch.length} entries...`);
const added = addEntries(mfr, batch);

if (added > 0) {
  console.log(`Running image download for ${mfr}...`);
  execSync(`node "${path.join(__dirname, 'download-jetapi-images.cjs')}" ${mfr}`, { stdio: 'inherit' });
}
console.log('Done!');
