/**
 * Profile Image Upload via Supabase Edge Function
 * 
 * Uploads to Cloudinary through a secure Supabase edge function.
 * Server-side signed upload (more secure than client-side unsigned).
 * 
 * Setup required:
 * 1. Deploy edge function: supabase functions deploy cloudinary-upload
 * 2. Add Cloudinary secrets to Supabase Dashboard
 * 3. Configure CORS in Cloudinary Dashboard for your domain
 */

import { supabase } from './supabase';

// CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@drcfmairy
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const VITE_SUPABASE_URL = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) as string;

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Compress image client-side before upload
 */
async function compressImage(
  file: File,
  maxWidth: number = 400,
  maxHeight: number = 400,
  quality: number = 0.8
): Promise<string> {
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
      
      // Convert to base64
      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve(base64);
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Upload profile image via Supabase edge function
 * 
 * Flow:
 * 1. Compress image client-side
 * 2. Call Supabase edge function (server-side Cloudinary upload)
 * 3. Return Cloudinary URL
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

    // Get auth token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return { success: false, error: 'Not authenticated' };
    }

    // Compress image
    const base64Image = await compressImage(file, 400, 400, 0.8);

    // Call edge function
    const response = await fetch(
      `${VITE_SUPABASE_URL}/functions/v1/cloudinary-upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64Image,
          userId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.error || `Upload failed: ${response.statusText}` 
      };
    }

    const result = await response.json();
    
    if (!result.success) {
      return { success: false, error: result.error || 'Upload failed' };
    }

    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
    };

  } catch (err: unknown) {
    console.error('[profileImageUpload] Upload failed:', err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Get optimized Cloudinary URL with transformations
 */
export function getCloudinaryUrl(publicIdOrUrl: string, width: number = 200): string {
  if (!publicIdOrUrl) return '';
  
  // If it's already a full URL with transformations, return it
  if (publicIdOrUrl.includes('cloudinary.com') && publicIdOrUrl.includes('/upload/')) {
    // Add optimizations if not present
    if (!publicIdOrUrl.includes('f_auto')) {
      return publicIdOrUrl.replace('/upload/', '/upload/f_auto,q_auto,w_' + width + '/');
    }
    return publicIdOrUrl;
  }
  
  // If it's just a public_id, construct URL
  // CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@drcfmairy
  const cloudName = 'drcfmairy';
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicIdOrUrl}`;
}
