/**
 * Delete images from Cloudinary
 * 
 * Uses Supabase Edge Function for secure server-side deletion
 * (API credentials are not exposed to browser)
 */

import { supabase } from './supabase';

export interface DeleteImageResult {
  success: boolean;
  error?: string;
}

/**
 * Delete a profile image from Cloudinary
 * 
 * @param publicId - The Cloudinary public_id to delete
 * @returns Result of deletion
 */
export async function deleteProfileImage(publicId: string): Promise<DeleteImageResult> {
  try {
    if (!publicId) {
      return { success: false, error: 'No public_id provided' };
    }

    // Call Supabase edge function to delete the image
    const { data, error } = await supabase.functions.invoke('cloudinary-delete', {
      body: {
        publicId,
        type: 'profile',
      },
    });

    if (error) {
      console.error('[cloudinaryDelete] Edge function error:', error);
      return { success: false, error: error.message };
    }

    if (!data?.success) {
      return { success: false, error: data?.error || 'Delete failed' };
    }

// [AUDIT] Removed console.log // line 44
    return { success: true };
  } catch (err: any) {
    console.error('[cloudinaryDelete] Error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete old profile image before uploading new one
 * 
 * @param oldPublicId - The existing public_id from profile record
 * @returns Result (non-blocking, failures are logged but not thrown)
 */
export async function cleanupOldProfileImage(oldPublicId: string | null | undefined): Promise<void> {
  if (!oldPublicId) return;

  try {
    const result = await deleteProfileImage(oldPublicId);
    if (!result.success) {
      console.warn('[cloudinaryDelete] Failed to cleanup old image:', result.error);
      // Don't throw - new image upload should still proceed
    }
  } catch (err) {
    console.warn('[cloudinaryDelete] Cleanup error (non-blocking):', err);
    // Non-blocking - don't prevent new upload
  }
}
