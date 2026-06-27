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
  const url = 'https://media.cntraveler.com/photos/5b48bb106bfb817351292e8d/16:9/w_2560%2Cc_limit/bamboo-airways-recruits-approximately-600-positions-424201834131am.jpg';
  const tempPath = path.join(__dirname, '../temp-bamboo-airways.jpg');
  const publicId = 'bamboo-airways';

  console.log(`📥 Downloading bamboo-airways.jpg from ${url}...`);

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
  .then(() => console.log('\n✅ bamboo-airways.jpg uploaded successfully!'))
  .catch((error) => console.error('\n❌ Failed:', error.message));
