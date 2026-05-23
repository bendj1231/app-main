/**
 * Multi-Cloudinary Configuration
 * 
 * Separate Cloudinary accounts for different use cases:
 * - PROFILE: User profile photos (drcfmairy)
 * - CONTENT: Pathway images, airline logos, etc. (can be separate)
 * 
 * Benefits:
 * - Cost tracking per use case
 * - Security isolation
 * - Different upload presets/policies
 */

// Profile Images Cloudinary (User Uploads)
// Cloud Name: drcfmairy
export const PROFILE_CLOUDINARY = {
  cloudName: 'drcfmairy',
  uploadPreset: 'profile_avatars', // Unsigned preset for client uploads
  folder: 'profiles',
  // These come from Supabase Edge Function secrets for server-side uploads
  // CLOUDINARY_CLOUD_NAME=drcfmairy
  // CLOUDINARY_API_KEY=xxx
  // CLOUDINARY_API_SECRET=xxx
};

// Content Images Cloudinary (Pathways, Logos, Platform Images)
// MUST be different account from profiles (drcfmairy is for profiles only)
// Set these in your .env file
export const CONTENT_CLOUDINARY = {
  cloudName: typeof window !== 'undefined' && (import.meta as any).env?.VITE_CONTENT_CLOUDINARY_CLOUD_NAME 
    ? (import.meta as any).env.VITE_CONTENT_CLOUDINARY_CLOUD_NAME 
    : '', // Must be configured separately - drcfmairy is for profiles only
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
