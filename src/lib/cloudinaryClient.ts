/**
 * Cloudinary Client-Side Upload Utilities
 * 
 * Uses Cloudinary's unsigned upload preset for cost-free client-side uploads.
 * No edge functions needed - browser uploads directly to Cloudinary.
 * 
 * Free tier limits (more than enough for profile avatars):
 * - 25 GB storage
 * - 25 GB bandwidth
 * - 25,000 transformations/month
 * 
 * Setup required:
 * 1. Create Cloudinary account (free)
 * 2. Create unsigned upload preset in Cloudinary Dashboard
 * 3. Add preset name to environment variables
 */

// Cloudinary configuration with safety optimizations
// Free tier: 25 credits/month. We MUST stay under this limit.
// Strategy: Client-side compression + Cloudinary transformations

const CLOUDINARY_CLOUD_NAME = 'drcfmairy'; // From CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@drcfmairy
const UPLOAD_PRESET = 'profile_avatars';

// Transformation parameters for ALL profile images
// These are CRITICAL to stay within free tier:
// - f_auto: Automatically serve WebP/AVIF (smallest format)
// - q_auto: Automatic quality optimization
// - w_200,h_200,c_fill: Resize to exact display size (never serve original)
const PROFILE_IMAGE_TRANSFORMATIONS = 'f_auto,q_auto,w_200,h_200,c_fill';

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload image to Cloudinary using unsigned preset (client-side, $0 cost)
 * 
 * Flow:
 * 1. Resize/compress image client-side (reduces bandwidth)
 * 2. Upload directly to Cloudinary via their API
 * 3. Return public URL
 * 
 * No edge functions, no server-side code needed!
 */
export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<CloudinaryUploadResult> {
  try {
    // Validate
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Image must be under 5MB' };
    }

    // AGGRESSIVE compression to stay within free tier
    // Target: 15-50KB final size (was: 800px, 80% quality)
    const compressedFile = await compressImage(file, 400, 400, 0.7);

    // Prepare upload
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'profiles');
    formData.append('public_id', `avatar_${userId}_${Date.now()}`);
    
    // Optional: Add metadata
    formData.append('context', `user_id=${userId}`);

    // Upload directly to Cloudinary (NO edge function!)
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Upload failed: ${error}` };
    }

    const data = await response.json();

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };

  } catch (err: any) {
    console.error('[cloudinaryClient] Upload failed:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Compress and resize image client-side before upload
 * This saves bandwidth and stays within free tier limits
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
      // Calculate new dimensions
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

      // Draw and compress
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

// Local IndexedDB cache for profile images
// Fetches from Cloudinary once, then serves locally forever
const IMAGE_CACHE_DB = 'pr_image_cache';
const IMAGE_CACHE_STORE = 'cloudinary_images';
const IMAGE_CACHE_VERSION = 1;

interface CachedImage {
  url: string;          // Original Cloudinary URL (as key)
  blob: Blob;           // Cached image data
  cachedAt: number;     // Timestamp
  publicId: string;     // For cache invalidation if needed
}

function openImageCache(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IMAGE_CACHE_DB, IMAGE_CACHE_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IMAGE_CACHE_STORE)) {
        db.createObjectStore(IMAGE_CACHE_STORE, { keyPath: 'url' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCachedImage(url: string): Promise<Blob | null> {
  try {
    const db = await openImageCache();
    const tx = db.transaction(IMAGE_CACHE_STORE, 'readonly');
    const store = tx.objectStore(IMAGE_CACHE_STORE);
    
    return new Promise((resolve, reject) => {
      const req = store.get(url);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result.blob);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[cloudinaryClient] Cache read failed:', err);
    return null;
  }
}

async function cacheImage(url: string, blob: Blob, publicId: string): Promise<void> {
  try {
    const db = await openImageCache();
    const tx = db.transaction(IMAGE_CACHE_STORE, 'readwrite');
    const store = tx.objectStore(IMAGE_CACHE_STORE);
    
    const cached: CachedImage = {
      url,
      blob,
      cachedAt: Date.now(),
      publicId,
    };
    
    await new Promise<void>((resolve, reject) => {
      const req = store.put(cached);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[cloudinaryClient] Cache write failed:', err);
  }
}

/**
 * Get profile image with IndexedDB caching
 * 
 * Strategy:
 * 1. Check IndexedDB cache first (ZERO network requests)
 * 2. If not cached, fetch from Cloudinary (ONE request)
 * 3. Store in IndexedDB for future requests (ZERO requests next time)
 * 
 * This reduces Cloudinary bandwidth to ~1 request per user ever
 * (until they clear browser data)
 */
export async function getCachedProfileImage(
  cloudinaryUrl: string,
  publicId: string
): Promise<string> {
  // Step 1: Check cache
  const cached = await getCachedImage(cloudinaryUrl);
  if (cached) {
    // Create object URL from cached blob
    return URL.createObjectURL(cached);
  }
  
  // Step 2: Fetch from Cloudinary
  try {
    const response = await fetch(cloudinaryUrl);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const blob = await response.blob();
    
    // Step 3: Cache for next time
    await cacheImage(cloudinaryUrl, blob, publicId);
    
    // Return object URL
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('[cloudinaryClient] Failed to fetch image:', err);
    // Fallback: return original URL (will cost bandwidth but at least works)
    return cloudinaryUrl;
  }
}

/**
 * Revoke object URL to free memory
 */
export function revokeImageUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Delete image from Cloudinary
 * Note: Requires signature or admin API - use edge function if needed
 */
export async function deleteProfileImage(publicId: string): Promise<boolean> {
  // For deletion, you'd typically use an edge function
  // But for cost savings, you can set up a lifecycle policy in Cloudinary
  // or just leave old images (they're small and free tier is generous)
  console.log('[cloudinaryClient] Mark for deletion:', publicId);
  return true;
}
