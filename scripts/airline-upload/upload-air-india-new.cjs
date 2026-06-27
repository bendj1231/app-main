const cloudinary = require('cloudinary').v2;
const https = require('https');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dridtecu6',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Air India image URL
const imageUrl = 'https://images.indianexpress.com/2025/06/Air-India-New.jpg';
const tempFilePath = 'temp-air-india-new.jpg';

// Download the image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image. Status code: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filepath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Upload to Cloudinary
const uploadToCloudinary = (filepath, publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filepath, {
      public_id: publicId,
      folder: 'airline-expectations',
      resource_type: 'auto',
    }).then(result => {
      resolve(result);
    }).catch(error => {
      reject(error);
    });
  });
};

// Main execution
(async () => {
  try {
    console.log('Downloading Air India image...');
    await downloadImage(imageUrl, tempFilePath);
    console.log('Download complete.');

    console.log('Uploading to Cloudinary...');
    const publicId = 'air-india-new';
    const result = await uploadToCloudinary(tempFilePath, publicId);
    console.log('✅ Upload successful:', result.secure_url);

    // Clean up
    fs.unlinkSync(tempFilePath);
    console.log('Temporary file deleted.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Clean up on error
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    process.exit(1);
  }
})();
