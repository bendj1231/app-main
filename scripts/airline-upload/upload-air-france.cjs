const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dridtecu6',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function downloadAndUpload() {
  const url = 'https://media.istockphoto.com/id/1977724210/photo/boeing-787-dreamliner-air-france.jpg?s=612x612&w=0&k=20&c=swo7QED289prErDzIVpP_mEP4HZiPntjJa3Ri7BPnDw=';
  const tempPath = path.join(__dirname, '../temp-air-france.jpg');
  const publicId = 'air-france';

  console.log(`📥 Downloading Air France image from ${url}...`);

  try {
    // Download the file
    const file = fs.createWriteStream(tempPath);
    
    await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          https.get(response.headers.location, (redirectResponse) => {
            redirectResponse.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          }).on('error', reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', reject);
    });

    console.log('✅ Downloaded successfully');

    // Upload to Cloudinary
    console.log(`Uploading to Cloudinary as ${publicId}...`);
    const result = await cloudinary.uploader.upload(tempPath, {
      public_id: publicId,
      folder: 'airline-expectations',
      resource_type: 'auto',
    });

    console.log('✅ Upload successful:', result.secure_url);

    // Clean up
    fs.unlinkSync(tempPath);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Clean up if file exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    
    throw error;
  }
}

downloadAndUpload()
  .then(() => console.log('\n✅ Air France image uploaded successfully!'))
  .catch((error) => console.error('\n❌ Failed:', error.message));
