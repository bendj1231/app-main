const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dridtecu6',
  api_key: '337769872771858',
  api_secret: '01ozqHqkTM6uNPZ1Bzue4pYMe24',
  secure: true,
});

const airlineLogos = [
  { name: 'delta', path: '/tmp/airline-logos/delta.svg' },
  { name: 'american', path: '/tmp/airline-logos/american.svg' },
  { name: 'united', path: '/tmp/airline-logos/united.svg' },
  { name: 'jetblue', path: '/tmp/airline-logos/jetblue.svg' },
  { name: 'southwest', path: '/tmp/airline-logos/southwest.svg' },
  { name: 'alaska', path: '/tmp/airline-logos/alaska.svg' },
];

async function uploadLogos() {
  for (const logo of airlineLogos) {
    try {
      console.log(`Uploading ${logo.name}...`);
      const result = await cloudinary.uploader.upload(logo.path, {
        folder: 'airline-logos',
        public_id: `airline-logos/${logo.name}`,
        resource_type: 'image',
      });
      console.log(`✅ ${logo.name} uploaded: ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${logo.name}:`, error.message);
    }
  }
}

uploadLogos().then(() => {
  console.log('Upload complete!');
  process.exit(0);
}).catch((error) => {
  console.error('Upload failed:', error);
  process.exit(1);
});
