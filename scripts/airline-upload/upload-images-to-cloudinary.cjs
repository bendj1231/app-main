const cloudinary = require('cloudinary').v2;

// Configure Cloudinary using URL format from functions/.env
cloudinary.config({
  cloud_name: 'dridtecu6',
  api_key: '337769872771858',
  api_secret: '01ozqHqkTM6uNPZ1Bzue4pYMe24',
  secure: true,
});

const fs = require('fs');
const path = require('path');

async function uploadImage(filePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: 'pilotrecognition',
      resource_type: 'auto',
    });
    console.log(`✅ Uploaded ${publicId}:`, result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${publicId}:`, error);
    throw error;
  }
}

async function main() {
  console.log('Starting image upload to Cloudinary...\n');

  const images = [
    { path: '/tmp/plane-icon.png', publicId: 'plane-icon' },
    { path: '/tmp/carousel-image.png', publicId: 'carousel-image' },
    { path: '/tmp/accreditation-4.png', publicId: 'accreditation-4' },
    { path: '/tmp/accreditation-5.png', publicId: 'accreditation-5' },
  ];

  const results = {};
  
  for (const image of images) {
    if (fs.existsSync(image.path)) {
      const url = await uploadImage(image.path, image.publicId);
      results[image.publicId] = url;
    } else {
      console.error(`❌ File not found: ${image.path}`);
    }
  }

  console.log('\n📋 Upload Results:');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
