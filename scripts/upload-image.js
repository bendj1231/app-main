const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'WMPILOTGROUP',
  api_key: '337769872771858',
  api_secret: '01ozqHqkTM6uNPZ1Bzue4pYMe24',
  secure: true,
});

cloudinary.uploader.upload('/tmp/downloaded-image.jpg', { folder: 'general' }, (error, result) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', result.secure_url);
    console.log('Public ID:', result.public_id);
  }
});
