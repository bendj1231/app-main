/**
 * Delete images from Cloudinary
 * 
 * Uses the Cloudflare Worker for secure server-side deletion
 * (API credentials are not exposed to browser)
 */

const API_URL = (import.meta.env as any).VITE_PILOT_API_URL || 'https://pilotrecognition-api.benjamintigerbowler.workers.dev';

export interface DeleteImageResult {
  success: boolean;
  error?: string;
}

/**
 * Delete a profile image from Cloudinary
 * 
 * @param accessToken - Auth0 ID token JWT
 * @param publicId - The Cloudinary public_id to delete
 * @returns Result of deletion
 */
export async function deleteProfileImage(accessToken: string, publicId: string): Promise<DeleteImageResult> {
  try {
    if (!publicId) {
      return { success: false, error: 'No public_id provided' };
    }
    if (!accessToken) {
      return { success: false, error: 'Not authenticated' };
    }

    // Call Worker endpoint to delete the image
    const res = await fetch(`${API_URL}/api/cloudinary-delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId, type: 'profile' }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('[cloudinaryDelete] Worker error:', data?.error || res.statusText);
      return { success: false, error: data?.error || `Delete failed: ${res.status}` };
    }

    if (!data?.success) {
      return { success: false, error: data?.error || 'Delete failed' };
    }

    return { success: true };
  } catch (err: unknown) {
    console.error('[cloudinaryDelete] Error:', err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Delete old profile image before uploading new one
 * 
 * @param accessToken - Auth0 ID token JWT
 * @param oldPublicId - The existing public_id from profile record
 * @returns Result (non-blocking, failures are logged but not thrown)
 */
export async function cleanupOldProfileImage(accessToken: string | undefined, oldPublicId: string | null | undefined): Promise<void> {
  if (!oldPublicId || !accessToken) return;

  try {
    const result = await deleteProfileImage(accessToken, oldPublicId);
    if (!result.success) {
      console.warn('[cloudinaryDelete] Failed to cleanup old image:', result.error);
      // Don't throw - new image upload should still proceed
    }
  } catch (err) {
    console.warn('[cloudinaryDelete] Cleanup error (non-blocking):', err);
    // Non-blocking - don't prevent new upload
  }
}
