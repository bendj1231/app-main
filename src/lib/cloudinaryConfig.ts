/**
 * Cloudinary Configuration
 * 
 * Single Cloudinary account for all image uploads:
 * - PROFILE: User profile photos
 * - CONTENT: Pathway images, airline logos, platform images
 * 
 * Cloud Name: dridtecu6
 */

// Profile Images Cloudinary (User Uploads)
export const PROFILE_CLOUDINARY = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  cloudName: typeof window !== 'undefined' && (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME 
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ? (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME 
    : 'dridtecu6',
  uploadPreset: 'profile_avatars', // Unsigned preset for client uploads
  folder: 'profiles',
};

// Content Images Cloudinary (Pathways, Logos, Platform Images)
// Uses the same account as profiles with different folder structure
export const CONTENT_CLOUDINARY = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  cloudName: typeof window !== 'undefined' && (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME 
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ? (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME 
    : 'dridtecu6',
  uploadPreset: 'content_images',
  folder: 'content',
};

// Helper to get correct config based on use case
export function getCloudinaryConfig(type: 'profile' | 'content') {
  switch (type) {
    case 'profile':
      return PROFILE_CLOUDINARY;
    case 'content':
      return CONTENT_CLOUDINARY;
    default:
      return PROFILE_CLOUDINARY;
  }
}

// Get optimized image URL for profile images
export function getProfileImageUrl(publicIdOrUrl: string, width: number = 200): string {
  if (!publicIdOrUrl) return '';
  
  // If already a full URL with transformations
  if (publicIdOrUrl.includes('cloudinary.com') && publicIdOrUrl.includes('/upload/')) {
    if (publicIdOrUrl.includes('f_auto')) return publicIdOrUrl;
    return publicIdOrUrl.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  
  // Construct URL from public_id
  return `https://res.cloudinary.com/${PROFILE_CLOUDINARY.cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicIdOrUrl}`;
}

// Get optimized image URL for content images
export function getContentImageUrl(publicIdOrUrl: string, width: number = 800): string {
  if (!publicIdOrUrl) return '';
  
  // If already a full URL with transformations
  if (publicIdOrUrl.includes('cloudinary.com') && publicIdOrUrl.includes('/upload/')) {
    if (publicIdOrUrl.includes('f_auto')) return publicIdOrUrl;
    return publicIdOrUrl.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  
  // Construct URL from public_id
  return `https://res.cloudinary.com/${CONTENT_CLOUDINARY.cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicIdOrUrl}`;
}
