import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dridtecu6',
  api_key: '337769872771858',
  api_secret: '01ozqHqkTM6uNPZ1Bzue4pYMe24',
  secure: true,
});

const images = [
  {
    name: 'PR3.png',
    folder: 'newsroom'
  },
  {
    name: 'discoverpathways.png',
    folder: 'newsroom'
  },
  {
    name: 'foundation.png',
    folder: 'newsroom'
  }
];

async function uploadImages() {
  for (const img of images) {
    try {
      const filePath = path.join(__dirname, '../public', img.name);
      console.log(`Uploading ${img.name}...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        folder: img.folder,
        resource_type: 'image',
      });
      
      console.log(`✓ Uploaded ${img.name}`);
      console.log(`  Public ID: ${result.public_id}`);
      console.log(`  URL: ${result.secure_url}`);
      console.log('');
    } catch (error) {
      console.error(`✗ Error uploading ${img.name}:`, error.message);
    }
  }
}

uploadImages();
