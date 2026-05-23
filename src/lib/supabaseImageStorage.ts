/**
 * Supabase Storage Image Upload Utilities
 * 
 * Uses Supabase Storage (already configured, free tier: 1GB storage, 2GB egress)
 * No Cloudinary needed - uploads directly to Supabase Storage.
 * 
 * Setup: Already done! Just need to ensure 'profile-pics' bucket exists.
 */

import { supabase } from './supabase';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

// Cache for image URLs
const imageCache = new Map<string, string>();

/**
 * Upload image to Supabase Storage
 * 
 * Bucket: 'profile-pics' (public bucket)
 * Path: {userId}/avatar-{timestamp}.jpg
 */
export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<ImageUploadResult> {
  try {
    // Validate
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Image must be under 5MB' };
    }

    // Compress image before upload
    const compressedFile = await compressImage(file, 400, 400, 0.8);

    // Generate unique filename
    const fileExt = 'jpg';
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profile-pics')
      .upload(filePath, compressedFile, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('[supabaseImageStorage] Upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pics')
      .getPublicUrl(filePath);

    // Clear any cached version
    imageCache.delete(userId);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };

  } catch (err: any) {
    console.error('[supabaseImageStorage] Upload failed:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get profile image URL with caching
 */
export function getProfileImageUrl(url: string | undefined): string {
  if (!url) return '';
  
  // If it's already a full URL, return it
  if (url.startsWith('http')) return url;
  
  // Otherwise, construct public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-pics')
    .getPublicUrl(url);
  
  return publicUrl;
}

/**
 * Compress image client-side
 */
async function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
}
