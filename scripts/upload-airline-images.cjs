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

async function uploadImage(filePath, publicId) {
  try {
    console.log(`Uploading ${filePath} as ${publicId}...`);
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: 'airline-expectations',
      resource_type: 'auto',
    });
    console.log('✅ Upload successful:', result.secure_url);
    return result;
  } catch (error) {
    console.error('❌ Error uploading image:', error.message);
    return null;
  }
}

async function main() {
  const airlineImagesDir = path.join(__dirname, '../public/images/airline-expectations');
  
  if (!fs.existsSync(airlineImagesDir)) {
    console.error('Airline images directory not found:', airlineImagesDir);
    process.exit(1);
  }

  const files = fs.readdirSync(airlineImagesDir).filter(file => 
    file !== '.DS_Store' && 
    (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp'))
  );

  console.log(`Found ${files.length} airline images to upload\n`);

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const filePath = path.join(airlineImagesDir, file);
    const publicId = file.replace(/\.(jpg|png|webp)$/i, '');
    
    const result = await uploadImage(filePath, publicId);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n📊 Upload Summary:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📁 Total: ${files.length}`);
}

main();
