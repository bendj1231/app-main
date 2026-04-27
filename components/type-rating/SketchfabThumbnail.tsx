import React, { useState, useEffect, useRef } from 'react';
import { Plane } from 'lucide-react';

// Cache for fetched thumbnail URLs
const thumbnailCache: Record<string, string> = {};

// Rate limiter - max 10 requests per minute
const requestTimestamps: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 10;
const REQUEST_WINDOW_MS = 60000; // 1 minute

function checkRateLimit(): boolean {
  const now = Date.now();
  // Remove timestamps older than the window
  requestTimestamps.splice(0, requestTimestamps.filter(t => now - t < REQUEST_WINDOW_MS).length);
  return requestTimestamps.length < MAX_REQUESTS_PER_MINUTE;
}

function recordRequest(): void {
  requestTimestamps.push(Date.now());
}

interface SketchfabThumbnailProps {
  sketchfab_id: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export function SketchfabThumbnail({
  sketchfab_id,
  alt,
  className,
  onError,
}: SketchfabThumbnailProps) {
  const [src, setSrc] = useState<string | null>(thumbnailCache[sketchfab_id] || null);
  const [loading, setLoading] = useState(!thumbnailCache[sketchfab_id]);
  const [failed, setFailed] = useState(false);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    if (thumbnailCache[sketchfab_id]) {
      setSrc(thumbnailCache[sketchfab_id]);
      setLoading(false);
      return;
    }

    if (!checkRateLimit()) {
      console.warn('[SketchfabThumbnail] Rate limit exceeded, skipping request');
      setFailed(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setFailed(false);
    retryCountRef.current = 0;

    const fetchWithRetry = async (attempt: number = 0): Promise<void> => {
      if (attempt > 0) {
        recordRequest();
      }

      try {
        const response = await fetch(`https://api.sketchfab.com/v3/models/${sketchfab_id}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !data.thumbnails || !data.thumbnails.images || data.thumbnails.images.length === 0) {
          throw new Error('No thumbnails available in response');
        }

        const images: any[] = data.thumbnails.images;
        const best = images.sort((a, b) => (b.width || 0) - (a.width || 0))[0];

        if (best?.url) {
          thumbnailCache[sketchfab_id] = best.url;
          setSrc(best.url);
          setLoading(false);
        } else {
          throw new Error('No valid thumbnail URL found');
        }
      } catch (error) {
        console.error(`[SketchfabThumbnail] Fetch attempt ${attempt + 1} failed:`, error);

        if (attempt < MAX_RETRIES) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          setTimeout(() => fetchWithRetry(attempt + 1), delay);
        } else {
          setFailed(true);
          setLoading(false);
        }
      }
    };

    let cancelled = false;
    fetchWithRetry(0);

    return () => { cancelled = true; };
  }, [sketchfab_id]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-200 animate-pulse`}>
        <Plane className="w-8 h-8 text-slate-400" />
      </div>
    );
  }

  if (failed || !src) {
    return (
      <img
        src="/placeholder-aircraft.png"
        alt={alt}
        className={className}
        onError={onError}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={onError}
    />
  );
}
