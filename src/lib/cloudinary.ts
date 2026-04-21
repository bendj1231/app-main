import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// Helper function to upload image
export const uploadImage = async (
  file: File | string,
  folder: string = 'general'
): Promise<any> => {
  try {
    let fileToUpload: string;

    if (file instanceof File) {
      // Convert File to base64 string
      fileToUpload = await convertFileToBase64(file);
    } else {
      fileToUpload = file;
    }

    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Helper function to upload video
export const uploadVideo = async (
  file: File | string,
  folder: string = 'videos'
): Promise<any> => {
  try {
    let fileToUpload: string;

    if (file instanceof File) {
      // Convert File to base64 string
      fileToUpload = await convertFileToBase64(file);
    } else {
      fileToUpload = file;
    }

    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder,
      resource_type: 'video',
    });
    return result;
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw error;
  }
};

// Helper function to convert File to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to delete resource
export const deleteResource = async (publicId: string): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting resource from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get image URL with transformations
export const getImageUrl = (
  publicId: string,
  transformations: any = {}
): string => {
  return cloudinary.url(publicId, transformations);
};

// Helper function to get video URL with transformations
export const getVideoUrl = (
  publicId: string,
  transformations: any = {}
): string => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    ...transformations,
  });
};
