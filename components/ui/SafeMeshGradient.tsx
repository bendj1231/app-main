import React, { useState, useEffect } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

interface Props {
  className?: string;
  colors: string[];
  speed: number;
}

export const SafeMeshGradient: React.FC<Props> = ({ className, colors, speed }) => {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Only render shader after client mount — ensures canvas/DOM is ready
    setMounted(true);
  }, []);

  // If WebGL isn't available or component crashes, don't try to render
  if (!mounted || hasError) return null;

  // Verify WebGL is actually available in this browser
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      return null;
    }
  } catch {
    return null;
  }

  return (
    <div
      className={className}
      style={{ position: 'absolute', inset: 0 }}
      onError={() => setHasError(true)}
    >
      <MeshGradient className="w-full h-full" colors={colors} speed={speed} />
    </div>
  );
};
