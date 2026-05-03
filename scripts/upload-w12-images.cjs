#!/usr/bin/env node

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dridtecu6',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// All W12 Google Drive images to upload
const images = [
  // From index.tsx
  { id: '1KgVuIuCv8mKxTcJ4rClCUCdaQ3fxm0x6', name: 'wing-mentor-logo', folder: 'w1000' },
  
  // From BlackBoxApp/constants.ts
  { id: '1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR', name: 'blackbox-logo', folder: 'w1000' },
  { id: '1BKT1CFVS2HwUnX2528UchLjnFN8TeCkf', name: 'pilot-gap-logo', folder: 'w1000' },
  { id: '1LMBTc0Qr0MamUdoJt01lEclzMlNt71DQ', name: 'hub-interface', folder: 'w1000' },
  { id: '1zZq7vcdQ_2SilrWsZgnJ77p8XrDP9Qbs', name: 'quote-bg', folder: 'w1000' },
  { id: '1ePNiHj2v3W-bqFZfx8loTeJZUhXfLd5U', name: 'program-bg', folder: 'w1000' },
  { id: '1xZ5rv7k6fhS5Mhx_Db1TlDUkWyZDjMVb', name: 'about-bg', folder: 'w1000' },
  { id: '1i9gQqjVWESQsafz3ARNO1zupAQ_Xu6K4', name: 'runway-holding-point', folder: 'w1000' },
  { id: '1uF7vUNX_5QBD0mwqXU4ILUO_-ngLd9KY', name: 'program-detail-bg', folder: 'w1000' },
  { id: '1gQD0i-4-_dXEjs12ZO5DYksMLLHCcDxR', name: 'shop-bg', folder: 'w1000' },
  { id: '1-QnGd5r6Qe9x9KBKMIOYxWsVX9Idu0e9', name: 'black-box-bg', folder: 'w1000' },
  { id: '1y-ZMwtx856ksi70mOvhyTIpmSC0WEShQ', name: 'mindmap-section-bg', folder: 'w1000' },
  { id: '1xZ5rv7k6fhS5Mhx_Db1TlDUkWyZDjMVb', name: 'forum-bg', folder: 'w1000' }, // Duplicate, will be handled
  { id: '1g2fsJA4Kg8MhFqwcs_ALrVulKMigZ_6_', name: 'ipad-apps-img', folder: 'w1000' },
  { id: '1GyMG1004Ny93i4_ktGikIXgzy-FHiPBI', name: 'instruction-vs-consultancy-img', folder: 'w1000' },
  { id: '12yV8_AmHGkJedZ7c86VZoUwzcSbZt3fV', name: 'wingmentor-passport-app-img', folder: 'w1000' },
  { id: '1InHXB-jhAZ3UNDXcvHbENwbB5ApY8eOp', name: 'pilot-gap-forum-app-img', folder: 'w1000' },
  { id: '1VVv4TLN9LwQTrhM8XGXLNLQ75HCrmi_w', name: 'black-box-app-img', folder: 'w1000' },
  { id: '1FaBcJWDnk6t9JJSimwq4YrV11v_DBgOz', name: 'gap-john-case-img', folder: 'w1000' },
  { id: '1p1PrXJtsOxzDapNsA877LNww_6Us4UKk', name: 'logbook-img', folder: 'w1000' },
  { id: '17avqeJjB6sm0LDDsceBu3odsZZgg1vJf', name: 'economic-trap-img', folder: 'w1000' },
  { id: '1vKe7xkLzViFX_P26HKM3EOewc_WJ5MF6', name: 'comfort-trap-img', folder: 'w1000' },
  { id: '1NJMUDq2SM5uC71dG3bSX6wtu5R0D9hB0', name: 'analyst-profile-img', folder: 'w1000' },
  { id: '1ytmiZmjwFIlH3cqO4vCXsSnmBmYlRI4u', name: 'strategic-pathways-img', folder: 'w1000' },
  { id: '1LePT83ZCh958EgLo2ioy_99uW2-yau8D', name: 'benjamin-bowler-portrait', folder: 'w1000' },
  { id: '1wvNobo69VtlIdpk9zFtrMXMszP19zcy5', name: 'karl-vogt-portrait', folder: 'w1000' },
  { id: '1My79_PxBzY4MDZcd3dv5Me4qgRazdBg8', name: 'final-verdict-img', folder: 'w1000' },
  { id: '1kyq5gnSrFIS3zG_nI3Ggq27ZLLwm5OW5', name: 'subscription-trap-img', folder: 'w1000' },
  { id: '10Q1nBwxCfzJALwYXH74wwO0Zh6V8eggZ', name: 'mindmap-bg', folder: 'w1000' },
  { id: '1bBA0W7Qqw_nJRVrFLIeGWV3h0jjc_rCK', name: 'story-map-bg', folder: 'w1000' },
  { id: '12pf5A8zfaAmnN0TFPrL6_OV8Em7lX_p9', name: 'story-paper-overlay', folder: 'w1000' },
  { id: '1Rsi8rGidQoBXk5ZyHNQVHj5t09wodQwi', name: 'story-student', folder: 'w1000' },
  { id: '16jxua-yU3b3Oagao4-erSja_Ddw8A4oJ', name: 'story-ppl', folder: 'w1000' },
  { id: '11kbdH5oJ6yNCRn5kHH7eQoaL1zuomDRI', name: 'story-cpl', folder: 'w1000' },
  { id: '1sPvcuLwhX_ofgxuGcZ-yesFYt2DMCGrb', name: 'story-mentor-1', folder: 'w1000' },
  { id: '1LFLSOAU4qJug2A3oP99JXXjGmp9cRg6b', name: 'story-mentor-2', folder: 'w1000' },
  { id: '1yEnBPSIo5-TkyvZwh2wjiTO0tIuztyP4', name: 'story-mentor-3', folder: 'w1000' },
  { id: '1JfLv0MAuqZEhpLM-jfah2IUF2J-8aE_u', name: 'cessna-152-img-1', folder: 'w1000' },
  { id: '1xZ5rv7k6fhS5Mhx_Db1TlDUkWyZDjMVb', name: 'news-bg', folder: 'w1000' }, // Duplicate, will be handled
];

const downloadDir = '/tmp/w12-images';

// Ensure download directory exists
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Download image from Google Drive
function downloadImage(id, filename) {
  return new Promise((resolve, reject) => {
    const url = `https://lh3.googleusercontent.com/d/${id}`;
    const filepath = path.join(downloadDir, filename);
    
    console.log(`Downloading: ${filename}...`);
    
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${filename}`);
            resolve(filepath);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${filename}`);
          resolve(filepath);
        });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Upload to Cloudinary
function uploadToCloudinary(filepath, name, folder) {
  return new Promise((resolve, reject) => {
    console.log(`Uploading: ${name} to Cloudinary...`);
    
    cloudinary.uploader.upload(filepath, {
      folder: folder,
      public_id: name,
      overwrite: true,
    }, (error, result) => {
      if (error) {
        console.error(`✗ Failed to upload ${name}:`, error.message);
        reject(error);
      } else {
        console.log(`✓ Uploaded: ${result.secure_url}`);
        resolve(result);
      }
    });
  });
}

// Main function
async function main() {
  console.log('Starting W12 images upload to Cloudinary...\n');
  
  const results = [];
  const processedIds = new Set();
  
  for (const img of images) {
    // Skip duplicates
    if (processedIds.has(img.id)) {
      console.log(`Skipping duplicate: ${img.id}`);
      continue;
    }
    processedIds.add(img.id);
    
    try {
      const filename = `${img.name}.jpg`;
      
      // Download
      const filepath = await downloadImage(img.id, filename);
      
      // Upload
      const result = await uploadToCloudinary(filepath, img.name, img.folder);
      
      results.push({
        name: img.name,
        url: result.secure_url,
        public_id: result.public_id,
        googleId: img.id,
      });
      
      // Clean up local file
      fs.unlinkSync(filepath);
      
    } catch (error) {
      console.error(`✗ Error processing ${img.name}:`, error.message);
    }
  }
  
  console.log('\n========================================');
  console.log('Upload Complete!');
  console.log('========================================\n');
  console.log('Image URLs:');
  results.forEach(r => {
    console.log(`${r.name}:`);
    console.log(`  ${r.url}\n`);
  });
  
  // Save results to JSON file
  const outputFile = '/tmp/w12-cloudinary-urls.json';
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputFile}`);
}

main().catch(console.error);
