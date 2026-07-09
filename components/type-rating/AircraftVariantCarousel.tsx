import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AircraftVariant {
  id: string;
  name: string;
  years: string;
  description: string;
  image: string;
  features: string[];
}

interface AircraftVariantCarouselProps {
  variants: AircraftVariant[];
  onVariantClick?: (variant: AircraftVariant) => void;
}

export function AircraftVariantCarousel({
  variants,
  onVariantClick,
}: AircraftVariantCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-cycle variants every 4 seconds
  useEffect(() => {
    if (variants.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % variants.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [variants.length]);

  if (variants.length === 0) return null;

  const currentVariant = variants[currentIndex];

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">Aircraft Variant</h3>
        <div className="flex gap-1">
          {variants.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-sky-400' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Single cycling preview */}
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        style={{
          background: 'linear-gradient(135deg, rgba(20,26,38,0.85) 0%, rgba(14,19,29,0.90) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
        }}
        onClick={() => onVariantClick?.(currentVariant)}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {currentVariant.image ? (
            <motion.img
              key={currentIndex}
              src={currentVariant.image}
              alt={currentVariant.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <div className="text-white/30 text-sm">No image available</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-xl font-bold text-white mb-1">{currentVariant.name}</h4>
              <p className="text-sm text-sky-400 font-semibold">{currentVariant.years}</p>
            </div>
          </div>
          <p className="text-sm text-white/70 line-clamp-2">{currentVariant.description}</p>
        </div>
      </div>
    </div>
  );
}
