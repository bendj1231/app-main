#!/usr/bin/env node
/**
 * Downloads missing airline logos from Wikipedia/Wikimedia Commons.
 * Saves them to the appropriate airline-logos folder.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const LOGOS_DIR = path.join(__dirname, '..', 'public', 'images', 'airline-logos');

// Airlines needing logos, with their target paths and Wikipedia logo URLs
// Using Wikipedia Commons SVG/PNG logos where available
const MISSING_LOGOS = [
  // Africa
  { id: 'airmauritius', name: 'Air Mauritius', dest: 'africa/air-mauritius-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Air_Mauritius_logo.svg' },
  { id: 'kenyaairways', name: 'Kenya Airways', dest: 'africa/kenya-airways-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Kenya_Airways_logo.svg' },
  { id: 'royalairmaroc', name: 'Royal Air Maroc', dest: 'africa/royal-air-maroc-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Royal_Air_Maroc_logo.svg' },
  { id: 'tunisair', name: 'Tunisair', dest: 'africa/tunisair-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Tunisair_logo.svg' },
  { id: 'airalgerie', name: 'Air Algérie', dest: 'africa/air-algerie-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_Alg%C3%A9rie_logo.svg' },
  { id: 'rwandair', name: 'RwandAir', dest: 'africa/rwandair-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/RwandAir_logo.svg' },
  { id: 'airseychelles', name: 'Air Seychelles', dest: 'africa/air-seychelles-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Air_Seychelles_logo.svg' },

  // Americas
  { id: 'frontier', name: 'Frontier Airlines', dest: 'americas/frontier-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Frontier_Airlines_logo.svg' },
  { id: 'allegiant', name: 'Allegiant Air', dest: 'americas/allegiant-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Allegiant_Air_logo.svg' },
  { id: 'hawaiian', name: 'Hawaiian Airlines', dest: 'americas/hawaiian-airlines-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Hawaiian_Airlines_logo.svg' },
  { id: 'airtransat', name: 'Air Transat', dest: 'americas/air-transat-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Air_Transat_logo.svg' },
  { id: 'porter', name: 'Porter Airlines', dest: 'americas/porter-airlines-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Porter_Airlines_logo.svg' },
  { id: 'azul', name: 'Azul Brazilian Airlines', dest: 'americas/azul-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Azul_Brazilian_Airlines_logo.svg' },
  { id: 'aerolineas', name: 'Aerolíneas Argentinas', dest: 'americas/aerolineas-argentinas-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Aerol%C3%ADneas_Argentinas_logo.svg' },
  { id: 'skyairline', name: 'Sky Airline', dest: 'americas/sky-airline-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Sky_Airline_logo.svg' },
  { id: 'jetsmart', name: 'JetSMART', dest: 'americas/jetsmart-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/JetSMART_logo.svg' },

  // Europe
  { id: 'ryanair', name: 'Ryanair', dest: 'europe/ryanair-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Ryanair_logo.svg' },
  { id: 'easyjet', name: 'easyJet', dest: 'europe/easyjet-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Easyjet_logo.svg' },
  { id: 'wizzair', name: 'Wizz Air', dest: 'europe/wizz-air-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Wizz_Air_logo.svg' },
  { id: 'vueling', name: 'Vueling', dest: 'europe/vueling-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Vueling_logo.svg' },
  { id: 'aireuropa', name: 'Air Europa', dest: 'europe/air-europa-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Air_Europa_logo.svg' },
  { id: 'jet2', name: 'Jet2.com', dest: 'europe/jet2-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Jet2.com_logo.svg' },
  { id: 'tui', name: 'TUI Airways', dest: 'europe/tui-airways-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/TUI_Airways_logo.svg' },
  { id: 'aeroflot', name: 'Aeroflot', dest: 'europe/aeroflot-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Aeroflot_logo.svg' },
  { id: 'airbaltic', name: 'airBaltic', dest: 'europe/airbaltic-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/AirBaltic_logo.svg' },

  // Middle East
  { id: 'gulfair', name: 'Gulf Air', dest: 'middle-east/gulf-air-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Gulf_Air_logo.svg' },
  { id: 'kuwaitairways', name: 'Kuwait Airways', dest: 'middle-east/kuwait-airways-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Kuwait_Airways_logo.svg' },
  { id: 'airarabia', name: 'Air Arabia', dest: 'middle-east/air-arabia-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Air_Arabia_logo.svg' },

  // Central Asia
  { id: 'airastana', name: 'Air Astana', dest: 'APAC/kazakhstan/international-operators/air-astana-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Air_Astana_logo.svg' },
  { id: 'uzbekistanairways', name: 'Uzbekistan Airways', dest: 'APAC/uzbekistan/international-operators/uzbekistan-airways-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Uzbekistan_Airways_logo.svg' },
  { id: 'azerbaijan', name: 'Azerbaijan Airlines', dest: 'APAC/azerbaijan/international-operators/azerbaijan-airlines-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Azerbaijan_Airlines_logo.svg' },

  // Pakistan
  { id: 'pia', name: 'Pakistan International Airlines', dest: 'APAC/pakistan/international-operators/pakistan-international-airlines-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Pakistan_International_Airlines_logo.svg' },
  { id: 'airblue', name: 'Airblue', dest: 'APAC/pakistan/regional-operators/airblue-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Airblue_logo.svg' },
];

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const destDir = path.dirname(destPath);
    fs.mkdirSync(destDir, { recursive: true });

    const file = fs.createWriteStream(destPath);
    const request = (url, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }
      const options = {
        headers: {
          'User-Agent': 'pilotrecognition.com airline logo downloader (educational project; contact: dev@pilotrecognition.com)',
          'Accept': 'image/svg+xml,image/png,image/*,*/*;q=0.8',
        },
      };
      https.get(url, options, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          response.destroy();
          request(response.headers.location, redirectCount + 1);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    };
    request(url);
  });
}

async function main() {
  const results = { success: [], failed: [] };

  for (const airline of MISSING_LOGOS) {
    const destPath = path.join(LOGOS_DIR, airline.dest);
    try {
      await download(airline.url, destPath);
      const size = fs.statSync(destPath).size;
      if (size < 100) {
        // Too small, likely an error page
        fs.unlinkSync(destPath);
        results.failed.push({ ...airline, error: 'File too small' });
      } else {
        results.success.push(airline);
        console.log(`  OK: ${airline.name} -> ${airline.dest} (${size} bytes)`);
      }
    } catch (err) {
      results.failed.push({ ...airline, error: err.message });
      console.log(`  FAIL: ${airline.name} - ${err.message}`);
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Downloaded: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  if (results.failed.length > 0) {
    console.log('\nFailed airlines:');
    results.failed.forEach((f) => console.log(`  ${f.name}: ${f.error}`));
  }
}

main();
