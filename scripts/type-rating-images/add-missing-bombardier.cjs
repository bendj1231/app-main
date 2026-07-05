const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/aircraft-manufacturers.ts');

const defaultTraining = {
  minimum_hours: 1500,
  required_licenses: ['CPL', 'IR', 'ME'],
  medical_certificate: 'Class 1',
  english_proficiency: 'ICAO Level 4',
  ground_school_hours: 80,
  simulator_hours: 20,
  flight_hours: 10
};

const defaultCurriculum = [
  { phase: 'Ground School', duration: '4 weeks', topics: ['Systems', 'Performance', 'Navigation', 'Emergency Procedures'] },
  { phase: 'Simulator Training', duration: '3 weeks', topics: ['Normal Operations', 'Abnormal Procedures', 'Emergency Procedures'] },
  { phase: 'Flight Training', duration: '2 weeks', topics: ['Takeoff and Landing', 'Cruise Operations', 'Approach and Go-Around'] }
];

const defaultSimulator = {
  type: 'Full Flight Simulator',
  locations: ['Manufacturer training center'],
  features: ['6-DOF Motion', 'Visual System', 'Instructor Station']
};

const defaultInstructors = [
  { type: 'Type Rating Instructor', requirements: ['500 hours on type', 'TRI certification', 'Instructor rating'] }
];

const defaultCertification = {
  authority: 'EASA / FAA',
  validity: '1 year',
  renewal_requirements: ['6 takeoffs and landings', '1 approach', 'Proficiency check']
};

function fmtObj(obj, indent = 4) {
  const spaces = ' '.repeat(indent);
  const entries = Object.entries(obj).map(([k, v]) => {
    if (Array.isArray(v)) {
      if (typeof v[0] === 'string') {
        return `${spaces}${k}: [${v.map(s => `'${s}'`).join(', ')}]`;
      }
      const arrStr = v.map(item => {
        if (typeof item === 'object') {
          const inner = Object.entries(item).map(([ik, iv]) => {
            if (Array.isArray(iv)) {
              return `${spaces}      ${ik}: [${iv.map(s => `'${s}'`).join(', ')}]`;
            }
            return `${spaces}      ${ik}: '${iv}'`;
          }).join(',\n');
          return `${spaces}    {\n${inner}\n${spaces}    }`;
        }
        return `${spaces}    '${item}'`;
      }).join(',\n');
      return `${spaces}${k}:[\n${arrStr}\n${spaces}]`;
    }
    if (typeof v === 'object' && v !== null) {
      return `${spaces}${k}: ${fmtObj(v, indent + 2).trimStart()}`;
    }
    if (typeof v === 'number') {
      return `${spaces}${k}: ${v}`;
    }
    return `${spaces}${k}: '${v}'`;
  }).join(',\n');
  return `{\n${entries}\n${' '.repeat(indent - 2)}}`;
}

function generateEntry(a) {
  const entry = {
    id: a.id,
    manufacturer_id: 'bombardier',
    model: a.model,
    category: a.category,
    image: a.image || '',
    description: a.description,
    first_flight: a.first_flight,
    specifications: a.specifications,
    training_requirements: a.training_requirements || defaultTraining,
    training_curriculum: defaultCurriculum,
    simulator_details: defaultSimulator,
    instructor_qualifications: defaultInstructors,
    certification: defaultCertification
  };
  return fmtObj(entry, 2);
}

const aircraftData = [
  // Learjet early series
  { id: 'learjet-23', model: 'Learjet 23', category: 'private', first_flight: 1963, description: 'The original Learjet. First light business jet, seating 6-8 passengers.', specifications: { max_takeoff_weight: '5,670 kg', cruising_speed: 'Mach 0.82', range: '2,800 km', capacity: 6, engines: 2, engine_type: 'GE CJ610-1', length: '12.98 m', wingspan: '10.85 m', height: '3.33 m' } },
  { id: 'learjet-24', model: 'Learjet 24', category: 'private', first_flight: 1966, description: 'Improved Learjet 23 with uprated engines and better performance.', specifications: { max_takeoff_weight: '5,670 kg', cruising_speed: 'Mach 0.81', range: '2,800 km', capacity: 6, engines: 2, engine_type: 'GE CJ610-6', length: '12.98 m', wingspan: '10.85 m', height: '3.33 m' } },
  { id: 'learjet-25', model: 'Learjet 25', category: 'private', first_flight: 1966, description: 'Stretched Learjet 24 with 8-seat cabin and longer range.', specifications: { max_takeoff_weight: '6,033 kg', cruising_speed: 'Mach 0.81', range: '3,200 km', capacity: 8, engines: 2, engine_type: 'GE CJ610-6', length: '14.50 m', wingspan: '10.85 m', height: '3.33 m' } },
  { id: 'learjet-28', model: 'Learjet 28', category: 'private', first_flight: 1977, description: 'Longhorn variant with distinctive winglets for improved efficiency.', specifications: { max_takeoff_weight: '5,670 kg', cruising_speed: 'Mach 0.81', range: '3,400 km', capacity: 8, engines: 2, engine_type: 'GE CJ610-8', length: '14.02 m', wingspan: '11.97 m', height: '3.33 m' } },
  { id: 'learjet-29', model: 'Learjet 29', category: 'private', first_flight: 1977, description: 'Two-seat variant of the Learjet 28 Longhorn for training and utility.', specifications: { max_takeoff_weight: '5,670 kg', cruising_speed: 'Mach 0.81', range: '3,400 km', capacity: 2, engines: 2, engine_type: 'GE CJ610-8', length: '14.02 m', wingspan: '11.97 m', height: '3.33 m' } },
  { id: 'learjet-31', model: 'Learjet 31', category: 'private', first_flight: 1987, description: 'Light business jet combining Learjet 35 wings with Learjet 55 fuselage.', specifications: { max_takeoff_weight: '7,530 kg', cruising_speed: 'Mach 0.81', range: '2,900 km', capacity: 8, engines: 2, engine_type: 'Honeywell TFE731-2', length: '14.83 m', wingspan: '13.34 m', height: '3.73 m' } },
  { id: 'learjet-40', model: 'Learjet 40', category: 'private', first_flight: 2002, description: 'Light business jet developed from the Learjet 45 with reduced cabin length.', specifications: { max_takeoff_weight: '9,299 kg', cruising_speed: 'Mach 0.81', range: '3,400 km', capacity: 7, engines: 2, engine_type: 'Honeywell TFE731-20', length: '16.93 m', wingspan: '14.56 m', height: '4.38 m' } },
  { id: 'learjet-45', model: 'Learjet 45', category: 'private', first_flight: 1995, description: 'Super light business jet with stand-up cabin and advanced avionics.', specifications: { max_takeoff_weight: '9,752 kg', cruising_speed: 'Mach 0.81', range: '3,400 km', capacity: 9, engines: 2, engine_type: 'Honeywell TFE731-20', length: '17.68 m', wingspan: '14.56 m', height: '4.30 m' } },
  { id: 'learjet-55c', model: 'Learjet 55C', category: 'private', first_flight: 1981, description: 'Midsize business jet with winglets and improved fuel efficiency over the original 55.', specifications: { max_takeoff_weight: '9,299 kg', cruising_speed: 'Mach 0.81', range: '4,400 km', capacity: 10, engines: 2, engine_type: 'Honeywell TFE731-3A', length: '16.80 m', wingspan: '13.34 m', height: '4.19 m' } },
  { id: 'learjet-60xr', model: 'Learjet 60XR', category: 'private', first_flight: 2005, description: 'Enhanced version of the Learjet 60 with upgraded avionics and interior.', specifications: { max_takeoff_weight: '10,659 kg', cruising_speed: 'Mach 0.81', range: '4,500 km', capacity: 8, engines: 2, engine_type: 'Honeywell TFE731-307', length: '17.88 m', wingspan: '13.34 m', height: '4.47 m' } },

  // Canadair / Bombardier special purpose
  { id: 'cl-215', model: 'CL-215', category: 'special', first_flight: 1967, description: 'Piston-powered amphibious water bomber, first aircraft designed specifically for aerial firefighting.', specifications: { max_takeoff_weight: '19,731 kg', cruising_speed: '290 km/h', range: '2,400 km', capacity: 0, engines: 2, engine_type: 'Pratt & Whitney R-2800', length: '19.82 m', wingspan: '28.60 m', height: '7.57 m' }, training_requirements: { minimum_hours: 1500, required_licenses: ['CPL', 'IR', 'ME', 'Seaplane'], medical_certificate: 'Class 1', english_proficiency: 'ICAO Level 4', ground_school_hours: 80, simulator_hours: 20, flight_hours: 10 } },
  { id: 'cl-415', model: 'CL-415', category: 'special', first_flight: 1993, description: 'Turboprop-powered amphibious water bomber, upgraded from the CL-215 with modern systems.', specifications: { max_takeoff_weight: '19,890 kg', cruising_speed: '333 km/h', range: '2,400 km', capacity: 0, engines: 2, engine_type: 'Pratt & Whitney PW123', length: '19.82 m', wingspan: '28.60 m', height: '8.98 m' }, training_requirements: { minimum_hours: 1500, required_licenses: ['CPL', 'IR', 'ME', 'Seaplane'], medical_certificate: 'Class 1', english_proficiency: 'ICAO Level 4', ground_school_hours: 80, simulator_hours: 20, flight_hours: 10 } },
  { id: 'cl-415eaf', model: 'CL-415EAF', category: 'special', first_flight: 2019, description: 'Enhanced Aerial Firefighter, modernized CL-415 with avionics upgrades and structural improvements.', specifications: { max_takeoff_weight: '19,890 kg', cruising_speed: '333 km/h', range: '2,400 km', capacity: 0, engines: 2, engine_type: 'Pratt & Whitney PW123', length: '19.82 m', wingspan: '28.60 m', height: '8.98 m' }, training_requirements: { minimum_hours: 1500, required_licenses: ['CPL', 'IR', 'ME', 'Seaplane'], medical_certificate: 'Class 1', english_proficiency: 'ICAO Level 4', ground_school_hours: 80, simulator_hours: 20, flight_hours: 10 } },
  { id: 'cl-44', model: 'CL-44', category: 'cargo', first_flight: 1960, description: 'Four-engine turboprop cargo aircraft with swing-tail for oversized loads.', specifications: { max_takeoff_weight: '43,091 kg', cruising_speed: '480 km/h', range: '8,800 km', capacity: 0, engines: 4, engine_type: 'Rolls-Royce Tyne', length: '41.50 m', wingspan: '43.37 m', height: '11.76 m' } },
  { id: 'cl-84-dynavert', model: 'CL-84 Dynavert', category: 'experimental', first_flight: 1965, description: 'Experimental tilt-wing VTOL aircraft developed by Canadair. Only 4 prototypes built.', specifications: { max_takeoff_weight: '8,165 kg', cruising_speed: '500 km/h', range: '1,200 km', capacity: 1, engines: 2, engine_type: 'Lycoming T53', length: '12.20 m', wingspan: '10.10 m', height: '4.27 m' } },

  // de Havilland Canada (acquired by Bombardier 1992)
  { id: 'dhc-1-chipmunk', model: 'DHC-1 Chipmunk', category: 'trainer', first_flight: 1946, description: 'Two-seat primary trainer aircraft widely used by military air forces worldwide.', specifications: { max_takeoff_weight: '1,111 kg', cruising_speed: '185 km/h', range: '720 km', capacity: 2, engines: 1, engine_type: 'de Havilland Gipsy Major', length: '7.64 m', wingspan: '10.47 m', height: '2.10 m' } },
  { id: 'dhc-2-beaver', model: 'DHC-2 Beaver', category: 'private', first_flight: 1947, description: 'Iconic bush plane and STOL utility aircraft, most widely used in remote areas.', specifications: { max_takeoff_weight: '2,310 kg', cruising_speed: '210 km/h', range: '740 km', capacity: 6, engines: 1, engine_type: 'Pratt & Whitney R-985', length: '9.24 m', wingspan: '14.63 m', height: '2.74 m' } },
  { id: 'dhc-3-otter', model: 'DHC-3 Otter', category: 'private', first_flight: 1951, description: 'Larger development of the DHC-2 Beaver with greater capacity and range.', specifications: { max_takeoff_weight: '3,814 kg', cruising_speed: '240 km/h', range: '1,530 km', capacity: 9, engines: 1, engine_type: 'Pratt & Whitney R-1340', length: '12.80 m', wingspan: '17.69 m', height: '3.56 m' } },
  { id: 'dhc-4-caribou', model: 'DHC-4 Caribou', category: 'cargo', first_flight: 1958, description: 'Twin-engine STOL cargo aircraft used by military and civilian operators.', specifications: { max_takeoff_weight: '14,289 kg', cruising_speed: '348 km/h', range: '1,300 km', capacity: 32, engines: 2, engine_type: 'Pratt & Whitney R-2000', length: '22.12 m', wingspan: '29.46 m', height: '9.68 m' } },
  { id: 'dhc-5-buffalo', model: 'DHC-5 Buffalo', category: 'cargo', first_flight: 1964, description: 'Improved STOL turboprop derivative of the DHC-4 Caribou with turbine engines.', specifications: { max_takeoff_weight: '19,051 kg', cruising_speed: '380 km/h', range: '1,100 km', capacity: 41, engines: 2, engine_type: 'General Electric T64', length: '22.12 m', wingspan: '29.26 m', height: '9.65 m' } },
  { id: 'dhc-7-dash-7', model: 'DHC-7 Dash 7', category: 'commercial', first_flight: 1975, description: 'Four-engine regional turboprop with exceptional STOL performance, predecessor to Dash 8.', specifications: { max_takeoff_weight: '20,000 kg', cruising_speed: '428 km/h', range: '1,800 km', capacity: 54, engines: 4, engine_type: 'Pratt & Whitney PT6A', length: '24.54 m', wingspan: '28.40 m', height: '7.98 m' } },

  // Short Brothers (acquired by Bombardier 1989)
  { id: 'short-330', model: 'Short 330', category: 'commercial', first_flight: 1974, description: 'Regional turboprop airliner developed by Short Brothers, seating up to 30 passengers.', specifications: { max_takeoff_weight: '10,387 kg', cruising_speed: '370 km/h', range: '870 km', capacity: 30, engines: 2, engine_type: 'Pratt & Whitney PT6A', length: '17.69 m', wingspan: '22.76 m', height: '4.95 m' } },
  { id: 'short-360', model: 'Short 360', category: 'commercial', first_flight: 1981, description: 'Stretched and improved version of the Short 330 with up to 36 seats.', specifications: { max_takeoff_weight: '12,292 kg', cruising_speed: '370 km/h', range: '780 km', capacity: 36, engines: 2, engine_type: 'Pratt & Whitney PT6A', length: '21.59 m', wingspan: '22.76 m', height: '5.97 m' } },
  { id: 'short-belfast', model: 'Short Belfast', category: 'cargo', first_flight: 1964, description: 'Heavy military cargo turboprop, one of the largest aircraft built in the UK.', specifications: { max_takeoff_weight: '104,326 kg', cruising_speed: '480 km/h', range: '8,500 km', capacity: 0, engines: 4, engine_type: 'Rolls-Royce Tyne', length: '49.10 m', wingspan: '48.40 m', height: '14.33 m' } },
];

function generateAllEntries() {
  return aircraftData.map(generateEntry).join(',\n');
}

function main() {
  let content = fs.readFileSync(DATA_FILE, 'utf8');

  // Find the end of aircraftTypeRatings array
  const insertMarker = '  }\n\n];\n\n// Helper functions';
  if (!content.includes(insertMarker)) {
    console.error('Could not find insertion point');
    process.exit(1);
  }

  const newEntries = generateAllEntries();
  const replacement = `  },\n${newEntries}\n];\n\n// Helper functions`;
  
  // We need to replace the last `}\n\n];` with `},\n[new entries]\n];`
  // Find the last occurrence
  const lastEntryEnd = content.lastIndexOf(insertMarker);
  if (lastEntryEnd === -1) {
    console.error('Could not find insertion point');
    process.exit(1);
  }

  const before = content.substring(0, lastEntryEnd + 3); // include the `}`
  const after = content.substring(lastEntryEnd + insertMarker.length - '// Helper functions'.length - 2);
  
  const newContent = before + ',\n' + newEntries + '\n];\n\n' + after;
  
  fs.writeFileSync(DATA_FILE, newContent);
  console.log(`Added ${aircraftData.length} new Bombardier aircraft entries.`);
}

main();
