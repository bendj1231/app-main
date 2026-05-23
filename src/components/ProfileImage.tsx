/**
 * ProfileImage Component
 * 
 * Displays pilot profile images with IndexedDB caching.
 * Fetches from Cloudinary once, caches locally forever.
 * 
 * Usage:
 *   <ProfileImage 
 *     url={profile.profile_image_url}
 *     publicId={profile.profile_image_public_id}
 *     name={profile.full_name}
 *     size={64}
 *     className="rounded-full"
 *   />
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getCachedProfileImage, revokeImageUrl } from '../lib/cloudinaryClient';
import { getProfileImageUrl } from '../lib/cloudinaryConfig';

interface ProfileImageProps {
  url?: string | null;
  publicId?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  fallbackClassName?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  url,
  publicId,
  name,
  size = 40,
  className = '',
  fallbackClassName = '',
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const initials = (name || 'Pilot').charAt(0).toUpperCase();

  // Load cached image
  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      console.log('[ProfileImage] loadImage — url:', url, '| publicId:', publicId);
      if (!url) {
        console.log('[ProfileImage] no url, showing initials');
        setImageUrl('');
        return;
      }

      // If it's already a blob URL, use it directly
      if (url.startsWith('blob:')) {
        console.log('[ProfileImage] blob url, using directly');
        setImageUrl(url);
        return;
      }

      // Optimize the URL
      const optimizedUrl = getProfileImageUrl(url);
      console.log('[ProfileImage] optimizedUrl:', optimizedUrl);

      // If we have a public_id, use IndexedDB caching
      if (publicId) {
        setIsLoading(true);
        try {
          const cachedUrl = await getCachedProfileImage(optimizedUrl, publicId);
          console.log('[ProfileImage] cache result — blob/url length:', cachedUrl?.length, '| starts with blob:', cachedUrl?.startsWith('blob:'));
          if (mounted) {
            setImageUrl(cachedUrl);
          }
        } catch (err) {
          console.warn('[ProfileImage] Cache load failed, using direct URL:', err);
          if (mounted) {
            setImageUrl(optimizedUrl);
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      } else {
        // No public_id available, use optimized URL directly
        console.log('[ProfileImage] no publicId, using optimized URL directly');
        setImageUrl(optimizedUrl);
      }
    };

    loadImage();

    // Cleanup: revoke blob URLs on unmount
    return () => {
      mounted = false;
      if (imageUrl.startsWith('blob:')) {
        revokeImageUrl(imageUrl);
      }
    };
  }, [url, publicId]);

  if (!imageUrl || isLoading) {
    // Show initials fallback
    const sizeStyle = { width: size, height: size };
    return (
      <div
        className={`flex items-center justify-center font-bold text-slate-700 bg-slate-200 ${fallbackClassName}`}
        style={sizeStyle}
      >
        {initials}
      </div>
    );
  }

  // Show image
  const sizeStyle = { width: size, height: size };
  return (
    <img
      src={imageUrl}
      alt={name || 'Profile'}
      className={`object-cover ${className}`}
      style={sizeStyle}
      loading="lazy"
      onError={() => setImageUrl('')} // Reset to show initials on error
    />
  );
};

export default ProfileImage;
