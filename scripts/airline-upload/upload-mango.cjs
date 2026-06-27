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
  const url = 'https://s28477.pcdn.co/wp-content/uploads/2017/10/Mango_1-984x554.jpg';
  const tempPath = path.join(__dirname, '../temp-mango.jpg');
  const publicId = 'mango';

  console.log(`📥 Downloading mango.jpg from ${url}...`);

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
  .then(() => console.log('\n✅ mango.jpg uploaded successfully!'))
  .catch((error) => console.error('\n❌ Failed:', error.message));
