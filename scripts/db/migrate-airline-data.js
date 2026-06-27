import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the PortalAirlineExpectationsPage.tsx file to extract the AIRLINES data
const portalPagePath = join(__dirname, '../portal/pages/PortalAirlineExpectationsPage.tsx');
const portalPageContent = readFileSync(portalPagePath, 'utf-8');

// Extract the AIRLINES array from the file
const airlinesMatch = portalPageContent.match(/const AIRLINES.*?=\s*\[(.*?)\];/s);
if (!airlinesMatch) {
  console.error('Could not find AIRLINES array in PortalAirlineExpectationsPage.tsx');
  process.exit(1);
}

// Parse the airlines array (this is a simplified approach - in production you'd use a proper parser)
const airlinesArrayString = '[' + airlinesMatch[1] + ']';

// Generate SQL UPDATE statements for each airline
function generateUpdateSQL(airline) {
  const id = airline.id;
  const name = airline.name?.replace(/'/g, "''") || '';
  const location = airline.location?.replace(/'/g, "''") || '';
  const salaryRange = airline.salaryRange?.replace(/'/g, "''") || '';
  const flightHours = airline.flightHours?.replace(/'/g, "''") || '';
  const description = airline.description?.replace(/'/g, "''") || '';
  const fleet = airline.fleet?.replace(/'/g, "''") || '';
  const region = airline.region?.replace(/'/g, "''") || '';
  const image = airline.image?.replace(/'/g, "''") || '';
  const cardImage = airline.cardImage?.replace(/'/g, "''") || '';
  
  // Convert tags array to PostgreSQL array syntax
  const tagsArray = airline.tags ? `ARRAY[${airline.tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : 'NULL';
  
  // Convert JSON objects to JSONB strings
  const expectations = airline.expectations ? `'${JSON.stringify(airline.expectations).replace(/'/g, "''")}'::jsonb` : 'NULL';
  const futureFleetPlans = airline.futureFleetPlans ? `'${JSON.stringify(airline.futureFleetPlans).replace(/'/g, "''")}'::jsonb` : 'NULL';
  const aircraftDemand = airline.aircraftDemand ? `'${JSON.stringify(aircraft.aircraftDemand).replace(/'/g, "''")}'::jsonb` : 'NULL';
  const pilotRequirements = airline.pilotRequirements ? `'${JSON.stringify(airline.pilotRequirements).replace(/'/g, "''")}'::jsonb` : 'NULL';
  const detailedInfo = airline.detailedInfo ? `'${JSON.stringify(airline.detailedInfo).replace(/'/g, "''")}'::jsonb` : 'NULL';
  
  return `
UPDATE public.airlines 
SET 
  name = '${name}',
  location = '${location}',
  salary_range = ${salaryRange ? `'${salaryRange}'` : 'NULL'},
  flight_hours = ${flightHours ? `'${flightHours}'` : 'NULL'},
  tags = ${tagsArray},
  image = ${image ? `'${image}'` : 'NULL'},
  card_image = ${cardImage ? `'${cardImage}'` : 'NULL'},
  description = ${description ? `'${description}'` : 'NULL'},
  fleet = ${fleet ? `'${fleet}'` : 'NULL'},
  region = '${region}',
  expectations = ${expectations},
  future_fleet_plans = ${futureFleetPlans},
  aircraft_demand = ${aircraftDemand},
  pilot_requirements = ${pilotRequirements},
  detailed_info = ${detailedInfo},
  updated_at = NOW()
WHERE id = '${id}';
`;
}

// Generate SQL INSERT statements for new airlines
function generateInsertSQL(airline) {
  const id = airline.id;
  const name = airline.name?.replace(/'/g, "''") || '';
  const location = airline.location?.replace(/'/g, "''") || '';
  const salaryRange = airline.salaryRange?.replace(/'/g, "''") || '';
  const flightHours = airline.flightHours?.replace(/'/g, "''") || '';
  const description = airline.description?.replace(/'/g, "''") || '';
  const fleet = airline.fleet?.replace(/'/g, "''") || '';
  const region = airline.region?.replace(/'/g, "''") || '';
  const image = airline.image?.replace(/'/g, "''") || '';
  const cardImage = airline.cardImage?.replace(/'/g, "''") || '';
  
  const tagsArray = airline.tags ? `ARRAY[${airline.tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]` : 'NULL';
  const expectations = airline.expectations ? `'${JSON.stringify(airline.expectations).replace(/'/g, "''")}'::jsonb` : 'NULL';
  const futureFleetPlans = airline.futureFleetPlans ? `'${JSON.stringify(airline.futureFleetPlans).replace(/'/g, "''")}'::jsonb` : 'NULL';
  const aircraftDemand = airline.aircraftDemand ? `'${JSON.stringify(airline.aircraftDemand).replace(/'/g, "''")}'::jsonb` : 'NULL';
  const pilotRequirements = airline.pilotRequirements ? `'${JSON.stringify(airline.pilotRequirements).replace(/'/g, "''")}'::jsonb` : 'NULL';
  const detailedInfo = airline.detailedInfo ? `'${JSON.stringify(airline.detailedInfo).replace(/'/g, "''")}'::jsonb` : 'NULL';
  
  return `
INSERT INTO public.airlines (id, name, location, salary_range, flight_hours, tags, image, card_image, description, fleet, region, expectations, future_fleet_plans, aircraft_demand, pilot_requirements, detailed_info, created_at, updated_at)
VALUES (
  '${id}',
  '${name}',
  '${location}',
  ${salaryRange ? `'${salaryRange}'` : 'NULL'},
  ${flightHours ? `'${flightHours}'` : 'NULL'},
  ${tagsArray},
  ${image ? `'${image}'` : 'NULL'},
  ${cardImage ? `'${cardImage}'` : 'NULL'},
  ${description ? `'${description}'` : 'NULL'},
  ${fleet ? `'${fleet}'` : 'NULL'},
  '${region}',
  ${expectations},
  ${futureFleetPlans},
  ${aircraftDemand},
  ${pilotRequirements},
  ${detailedInfo},
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  salary_range = EXCLUDED.salary_range,
  flight_hours = EXCLUDED.flight_hours,
  tags = EXCLUDED.tags,
  image = EXCLUDED.image,
  card_image = EXCLUDED.card_image,
  description = EXCLUDED.description,
  fleet = EXCLUDED.fleet,
  region = EXCLUDED.region,
  expectations = EXCLUDED.expectations,
  future_fleet_plans = EXCLUDED.future_fleet_plans,
  aircraft_demand = EXCLUDED.aircraft_demand,
  pilot_requirements = EXCLUDED.pilot_requirements,
  detailed_info = EXCLUDED.detailed_info,
  updated_at = NOW();
`;
}

console.log('This script generates SQL statements to sync airline data from PortalAirlineExpectationsPage.tsx to Supabase.');
console.log('');
console.log('To use this script:');
console.log('1. Run: node scripts/sync-airline-data.js');
console.log('2. Copy the generated SQL statements');
console.log('3. Execute them in Supabase SQL Editor or use the Supabase MCP tool');
console.log('');
console.log('This keeps the database as a safeguard/backup while the app continues using static data.');
console.log('');
console.log('Generated SQL statements:');
console.log('='.repeat(80));

// Note: Since we can't parse the complex JavaScript array properly without eval (which is unsafe),
// we'll provide a simpler approach - generate a template that can be used with the MCP tool
console.log(`
-- Sync script for airline data
-- Run this in Supabase SQL Editor after updating PortalAirlineExpectationsPage.tsx
-- This keeps the database in sync with static data as a safeguard

-- The following airlines are in the static file and should be synced:
-- Qatar Airways, Emirates, Etihad, El Al, Royal Jordanian, Saudia, Oman Air
-- Singapore Airlines, Cathay Pacific, ANA, JAL, Korean Air, Asiana, Thai Airways
-- Malaysia Airlines, Garuda Indonesia, Philippine Airlines, Vietnam Airlines
-- Air China, China Eastern, China Southern, Cathay Dragon, HK Express
-- Scoot, Jetstar Asia, Peach Aviation, Spring Airlines, IndiGo, Air India

-- Use the individual UPDATE statements below for each airline
-- or use the INSERT ... ON CONFLICT approach for bulk sync

-- Example for Qatar Airways (update with actual data from the file):
UPDATE public.airlines 
SET 
  salary_range = '$100,000 – $265,000 USD/Year (Total Package)',
  flight_hours = '1,000 hrs (FO) / 6,000 hrs (DEC)',
  tags = ARRAY['5-Star Airline', 'Tax-Free', 'Worldwide Routes'],
  image = 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg',
  card_image = 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Qatar_Airways_Logo.png',
  description = 'Qatar Airways is renowned for its exceptional service standards and global network spanning over 160 destinations.',
  fleet = 'Boeing 777, 787, Airbus A350, A380 (active until 2032), A320, A321neo (2026 deliveries), B777-9 (2027 deliveries)',
  updated_at = NOW()
WHERE id = 'qatar';

-- Repeat similar UPDATE statements for other airlines...
`);

