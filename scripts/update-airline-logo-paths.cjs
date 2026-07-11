#!/usr/bin/env node
/**
 * Updates logo paths in PortalAirlineExpectationsPage.tsx for airlines
 * that originally had no logo but now have downloaded logos.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'portal/pages/PortalAirlineExpectationsPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Map of airline id -> logo path (for airlines that were added without logos)
const LOGO_UPDATES = [
  // Africa
  { id: 'airmauritius', logo: '/images/airline-logos/africa/air-mauritius.svg' },
  { id: 'kenyaairways', logo: '/images/airline-logos/africa/kenya-airways.svg' },
  { id: 'royalairmaroc', logo: '/images/airline-logos/africa/royal-air-maroc.svg' },
  { id: 'tunisair', logo: '/images/airline-logos/africa/tunisair.svg' },
  { id: 'airalgerie', logo: '/images/airline-logos/africa/air-algerie.svg' },
  { id: 'rwandair', logo: '/images/airline-logos/africa/rwandair.svg' },
  // Air Seychelles - no logo downloaded yet, skip

  // Americas
  { id: 'frontier', logo: '/images/airline-logos/americas/frontier.svg' },
  { id: 'allegiant', logo: '/images/airline-logos/americas/allegiant.svg' },
  { id: 'hawaiian', logo: '/images/airline-logos/americas/hawaiian-airlines.svg' },
  { id: 'airtransat', logo: '/images/airline-logos/americas/air-transat.svg' },
  { id: 'porter', logo: '/images/airline-logos/americas/porter-airlines.svg' },
  { id: 'azul', logo: '/images/airline-logos/americas/azul.svg' },
  { id: 'aerolineas', logo: '/images/airline-logos/americas/aerolineas-argentinas.svg' },
  { id: 'skyairline', logo: '/images/airline-logos/americas/sky-airline.svg' },
  { id: 'jetsmart', logo: '/images/airline-logos/americas/jetsmart.svg' },

  // Europe
  { id: 'ryanair', logo: '/images/airline-logos/europe/ryanair.svg' },
  { id: 'easyjet', logo: '/images/airline-logos/europe/easyjet.svg' },
  { id: 'wizzair', logo: '/images/airline-logos/europe/wizz-air.svg' },
  { id: 'vueling', logo: '/images/airline-logos/europe/vueling.svg' },
  { id: 'aireuropa', logo: '/images/airline-logos/europe/air-europa.svg' },
  { id: 'jet2', logo: '/images/airline-logos/europe/jet2.svg' },
  { id: 'tui', logo: '/images/airline-logos/europe/tui-airways.svg' },
  { id: 'aeroflot', logo: '/images/airline-logos/europe/aeroflot.svg' },
  { id: 'airbaltic', logo: '/images/airline-logos/europe/airbaltic.svg' },

  // Middle East
  { id: 'gulfair', logo: '/images/airline-logos/middle-east/gulf-air.svg' },
  { id: 'kuwaitairways', logo: '/images/airline-logos/middle-east/kuwait-airways.svg' },
  { id: 'airarabia', logo: '/images/airline-logos/middle-east/air-arabia.svg' },

  // Central Asia
  { id: 'airastana', logo: '/images/airline-logos/APAC/kazakhstan/international-operators/air-astana.svg' },
  // Uzbekistan Airways - no logo downloaded yet, skip
  { id: 'azerbaijan', logo: '/images/airline-logos/APAC/azerbaijan/international-operators/azerbaijan-airlines.svg' },

  // Pakistan
  { id: 'pia', logo: '/images/airline-logos/APAC/pakistan/international-operators/pakistan-international-airlines.svg' },
  { id: 'airblue', logo: '/images/airline-logos/APAC/pakistan/regional-operators/airblue.svg' },
];

let updated = 0;
for (const { id, logo } of LOGO_UPDATES) {
  // Find the entry by id and add logo if not present
  // Pattern: find "id: 'xxx'," and check if the next line has "logo:"
  const idPattern = `id: '${id}',`;
  const idIdx = content.indexOf(idPattern);
  if (idIdx === -1) {
    console.log(`  SKIP: ${id} - not found in file`);
    continue;
  }

  // Check if logo already exists right after the id line
  const afterId = content.substring(idIdx, idIdx + 200);
  if (afterId.includes("logo: '")) {
    console.log(`  SKIP: ${id} - already has logo`);
    continue;
  }

  // Insert logo line after the id line
  const idLineEnd = content.indexOf('\n', idIdx);
  const before = content.substring(0, idLineEnd + 1);
  const after = content.substring(idLineEnd + 1);
  content = before + `    logo: '${logo}',\n` + after;
  updated++;
  console.log(`  OK: ${id} -> ${logo}`);
}

fs.writeFileSync(filePath, content);
console.log(`\nUpdated ${updated} airline entries with logo paths`);
