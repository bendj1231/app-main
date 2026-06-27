const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dridtecu6',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Failed images and their replacement URLs
const failedImages = [
  {
    fileName: 'air-canada-rouge.jpg',
    url: 'https://assets.skiesmag.com/wp-content/uploads/2024/10/Boeing-737-Max-8-19-1024x683.jpg'
  },
  {
    fileName: 'air-malta.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/9H-NEC_at_LHR_20250728.jpg'
  },
  {
    fileName: 'royal-brunei.jpg',
    url: 'https://aviationweek.com/sites/default/files/styles/crop_freeform/public/2025-06/royal_brunei_a320neo_source_rob_finlayson.png?itok=dMaISJky'
  },
  {
    fileName: 'serene-air.jpg',
    url: 'https://www.aeroinside.com/img/aircrafts/aircraft-registration-AP-BND-169351b636_z.jpg'
  },
  {
    fileName: 'spirit.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Spirit_Airlines_A320neo_N993NK_BWI_MD1.jpg'
  },
  {
    fileName: 'tarom.jpg',
    url: 'https://s28477.pcdn.co/wp-content/uploads/2018/07/TAROM_2.jpg'
  },
  {
    fileName: 'uia.jpg',
    url: 'https://www.aviontourism.com/images/1920-900-fix/1a1045d4-d0a2-4bda-ac56-b508094a678b'
  },
  {
    fileName: 'lao-airlines.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/RDPL-34233_%28ATR_72-600%29_from_Lao_Airlines_%289786869653%29_%28cropped%29.jpg'
  }
];

// Download file from URL
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filePath);

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        downloadFile(response.headers.location, filePath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Upload image to Cloudinary
async function uploadImage(filePath, publicId) {
  try {
    console.log(`Uploading ${publicId}...`);
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
  const tempDir = path.join(__dirname, '../temp-downloads');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  let successCount = 0;
  let failCount = 0;

  for (const image of failedImages) {
    const tempPath = path.join(tempDir, image.fileName);
    const publicId = image.fileName.replace(/\.(jpg|png|webp)$/i, '');

    try {
      console.log(`\n📥 Downloading ${image.fileName} from ${image.url}...`);
      await downloadFile(image.url, tempPath);
      
      console.log(`✅ Downloaded successfully`);
      
      const result = await uploadImage(tempPath, publicId);
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Clean up temp file
      fs.unlinkSync(tempPath);
    } catch (error) {
      console.error(`❌ Failed to process ${image.fileName}:`, error.message);
      failCount++;
      
      // Clean up temp file if it exists
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmdirSync(tempDir);
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📁 Total: ${failedImages.length}`);
}

main();
