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

// Images to download and upload
const images = [
  { id: '1KgVuIuCv8mKxTcJ4rClCUCdaQ3fxm0x6', name: 'wing-mentor-logo', folder: 'w1000' },
  { id: '1InHXB-jhAZ3UNDXcvHbENwbB5ApY8eOp', name: 'comms-icon', folder: 'w1000' },
  { id: '1GbUopHNGyXMhzi5sW1Ybo5gZMh2_YSKN', name: 'handbook-icon', folder: 'w1000' },
  { id: '1sUUBI2blGY9oNoutvN9fH1cJ8j6RVOiX', name: 'passport-icon', folder: 'w1000' },
  { id: '1l3DzGrf1cgUAExrS5d-9ncs_j455G9c_', name: 'cpl-examination', folder: 'w1000' },
  { id: '11j7ZHv874EBZZ5O36etvuHC6rRWWm8kF', name: 'exams-icon', folder: 'w1000' },
  { id: '1HpzTC2mR312qpDeG6i1Cy4FU0JeRrfuE', name: 'simulator-icon', folder: 'w1000' },
  { id: '1yLM_bGVPN8Sa__fqR95C0EeA1CUsTAA7', name: 'blackbox-icon', folder: 'w1000' },
  { id: '1TQFFjrDKWlyqCkiHJjWC5QPlEAWQEIEu', name: 'fundamentals-ifr', folder: 'w1000' },
  { id: '1VNI13hbdlRSDkt2QdRR0lxUHi0U7tn9f', name: 'master-class', folder: 'w1000' },
  { id: '1ahthu2ZsyfNcYGsQPI9K9GiIxqM8JUI1', name: 'aircraft-vor', folder: 'w1000' },
];

const downloadDir = '/tmp/w1-images';

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
  console.log('Starting W1 images upload to Cloudinary...\n');
  
  const results = [];
  
  for (const img of images) {
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
  const outputFile = '/tmp/w1-cloudinary-urls.json';
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputFile}`);
}

main().catch(console.error);
