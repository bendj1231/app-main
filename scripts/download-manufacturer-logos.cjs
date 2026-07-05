#!/usr/bin/env node
/**
 * Download manufacturer logos from external URLs to local storage.
 * Replaces hyperlinked logos with local assets.
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const DEST_DIR = path.resolve(__dirname, '../public/images/manufacturer-logos');

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

const LOGOS = [
  {
    id: 'airbus',
    filename: 'airbus-logo.png',
    url: 'https://ih1.redbubble.net/image.3072472393.7477/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg',
  },
  {
    id: 'boeing',
    filename: 'boeing-logo.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Boeing_full_logo.svg/960px-Boeing_full_logo.svg.png',
  },
  {
    id: 'embraer',
    filename: 'embraer-logo.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Embraer_logo.svg/3840px-Embraer_logo.svg.png',
  },
  {
    id: 'dassault-falcon',
    filename: 'dassault-logo.png',
    url: 'https://brandcenter.dassault-aviation.com/assets/contents/img/dassault-brand-center_4.png',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Dassault_Aviation_logo.svg/2560px-Dassault_Aviation_logo.svg.png',
  },
  {
    id: 'pilatus',
    filename: 'pilatus-logo.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Pilatus_Aircraft_logo.svg/3840px-Pilatus_Aircraft_logo.svg.png',
  },
  {
    id: 'beechcraft',
    filename: 'beechcraft-logo.png',
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTytkPLeDMSLb2r4ukzys6EUJcg98nCLEU5UKK2UJSZKQ&s=10',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Beechcraft_logo.svg/2560px-Beechcraft_logo.svg.png',
  },
  {
    id: 'piper',
    filename: 'piper-logo.svg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Piper_Aircraft_logo.svg',
  },
  {
    id: 'cirrus',
    filename: 'cirrus-logo.png',
    url: 'https://www.flyingmag.com/wp-content/uploads/2024/02/cirrus-1.jpeg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Cirrus_Aircraft_logo.svg/2560px-Cirrus_Aircraft_logo.svg.png',
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const location = res.headers.location;
        if (location) {
          file.close();
          fs.unlinkSync(dest);
          return download(location, dest).then(resolve).catch(reject);
        }
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        if (stats.size < 1024) {
          fs.unlinkSync(dest);
          reject(new Error(`File too small (${stats.size}b) — likely an error page`));
        } else {
          resolve();
        }
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    }).setTimeout(30000, function() {
      this.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  const results = [];
  for (const logo of LOGOS) {
    const dest = path.join(DEST_DIR, logo.filename);
    if (fs.existsSync(dest)) {
      console.log(`SKIP (exists): ${logo.filename}`);
      results.push({ id: logo.id, status: 'skipped' });
      continue;
    }
    try {
      await download(logo.url, dest);
      console.log(`OK: ${logo.filename}`);
      results.push({ id: logo.id, status: 'ok' });
    } catch (err) {
      console.error(`FAIL primary (${logo.id}): ${err.message}`);
      if (logo.fallback) {
        try {
          await download(logo.fallback, dest);
          console.log(`OK (fallback): ${logo.filename}`);
          results.push({ id: logo.id, status: 'ok-fallback' });
        } catch (fallbackErr) {
          console.error(`FAIL fallback (${logo.id}): ${fallbackErr.message}`);
          results.push({ id: logo.id, status: 'fail', error: fallbackErr.message });
        }
      } else {
        results.push({ id: logo.id, status: 'fail', error: err.message });
      }
    }
  }

  console.log('\n--- Summary ---');
  const ok = results.filter(r => r.status.startsWith('ok'));
  const fail = results.filter(r => r.status === 'fail');
  const skip = results.filter(r => r.status === 'skipped');
  console.log(`Downloaded: ${ok.length}, Failed: ${fail.length}, Skipped: ${skip.length}`);
  if (fail.length > 0) {
    console.log('Failed:');
    fail.forEach(f => console.log(`  - ${f.id}: ${f.error}`));
  }
}

main().catch(console.error);
