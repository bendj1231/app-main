import React from 'react';
import { ChevronLeft, ChevronRight, Plane } from 'lucide-react';
import { SketchfabThumbnail } from './SketchfabThumbnail';
import type { AircraftTypeRating } from '../../utils/careerScoreCalculator';

const CATEGORY_LABELS: Record<string, string> = {
  'all': 'All',
  'commercial': 'Commercial',
  'private': 'Private',
  'cargo': 'Cargo',
  'regional': 'Regional',
  'helicopter': 'Helicopter',
  'military': 'Military',
  'legacy': 'Legacy (Retired)',
  'flagship': 'Flagship',
};

interface AircraftCarouselProps {
  filteredAircraft: AircraftTypeRating[];
  selectedAircraft: AircraftTypeRating | null;
  carouselRef: React.RefObject<HTMLDivElement>;
  onScroll: (dir: 'left' | 'right') => void;
  onSelect: (aircraft: AircraftTypeRating) => void;
}

export function AircraftCarousel({
  filteredAircraft,
  selectedAircraft,
  carouselRef,
  onScroll,
  onSelect,
}: AircraftCarouselProps) {
  return (
    <div className="px-0 mb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-normal text-slate-900">Browse Aircraft</h2>
          <p className="text-sm text-slate-500">{filteredAircraft.length} aircraft available</p>
        </div>
        {/* Scroll arrows */}
        <div className="flex gap-2">
          <button onClick={() => onScroll('left')} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => onScroll('right')} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Edge-to-edge carousel */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-4 px-6 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {filteredAircraft.map(aircraft => (
          <div
            key={aircraft.id}
            onClick={() => onSelect(aircraft)}
            className={`flex-shrink-0 w-72 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border ${
              selectedAircraft?.id === aircraft.id
                ? 'ring-2 ring-sky-500 border-sky-500/50'
                : 'border-slate-200 hover:border-slate-400'
            } bg-white group`}
          >
            {/* Thumbnail */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              {aircraft.sketchfab_id ? (
                <SketchfabThumbnail
                  sketchfab_id={aircraft.sketchfab_id}
                  alt={aircraft.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <img
                  src={aircraft.image}
                  alt={aircraft.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-white font-serif text-base leading-tight">{aircraft.model}</span>
                <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                  <Plane className="w-3 h-3" />
                  {CATEGORY_LABELS[aircraft.category]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
