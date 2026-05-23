/**
 * Content Image Upload Utilities
 * 
 * For pathway images, airline logos, platform content
 * Can use separate Cloudinary account from profile images
 */

import { supabase } from './supabase';
import { CONTENT_CLOUDINARY } from './cloudinaryConfig';

const VITE_SUPABASE_URL = (typeof window !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL)
  ? (import.meta as any).env.VITE_SUPABASE_URL
  : 'https://gkbhgrozrzhalnjherfu.supabase.co';

export interface ContentUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload content image (pathway, airline logo, etc.)
 * 
 * Uses separate Cloudinary account if configured, otherwise falls back to profile account
 */
export async function uploadContentImage(
  file: File,
  folder: string = 'pathways' // 'pathways', 'airlines', 'logos', etc.
): Promise<ContentUploadResult> {
  try {
    // Validate
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }
    if (file.size > 10 * 1024 * 1024) { // Larger limit for content images
      return { success: false, error: 'Image must be under 10MB' };
    }

    // Get auth token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return { success: false, error: 'Not authenticated' };
    }

    // Compress image
    const base64Image = await compressImage(file, 1200, 800, 0.85); // Larger for content

    // Call edge function with type='content'
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
          userId: `content_${folder}`,
          type: 'content', // This tells edge function to use content account
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

  } catch (err: any) {
    console.error('[contentImageUpload] Upload failed:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Compress image for content upload
 */
async function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
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
      
      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve(base64);
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Get optimized content image URL
 * Uses content Cloudinary config
 */
export function getContentImageUrl(publicIdOrUrl: string, width: number = 800): string {
  if (!publicIdOrUrl) return '';
  
  // If already a full URL
  if (publicIdOrUrl.includes('cloudinary.com') && publicIdOrUrl.includes('/upload/')) {
    if (publicIdOrUrl.includes('f_auto')) return publicIdOrUrl;
    return publicIdOrUrl.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  
  // Construct from public_id using content cloud name
  const cloudName = CONTENT_CLOUDINARY.cloudName;
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicIdOrUrl}`;
}
