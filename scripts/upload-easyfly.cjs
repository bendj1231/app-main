const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dridtecu6',
  api_key: '337769872771858',
  api_secret: '01ozqHqkTM6uNPZ1Bzue4pYMe24',
  secure: true,
});

async function downloadAndUpload() {
  const url = 'https://live.staticflickr.com/7204/7007351083_9d314940b3_b.jpg';
  const tempPath = path.join(__dirname, '../temp-easyfly.jpg');
  const publicId = 'easyfly';

  console.log(`📥 Downloading Easy Fly image from ${url}...`);

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
  .then(() => console.log('\n✅ Easy Fly image uploaded successfully!'))
  .catch((error) => console.error('\n❌ Failed:', error.message));
