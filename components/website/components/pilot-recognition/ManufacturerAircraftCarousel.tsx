import React, { useMemo, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  aircraftTypeRatings as rawAircraftTypeRatings,
  type AircraftTypeRating as DataAircraftTypeRating,
} from '@/data/aircraft-manufacturers';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

type AircraftTypeRating = DataAircraftTypeRating;

interface AircraftWithStats extends DataAircraftTypeRating {
  operatorCount?: number;
  pilotCount?: number;
  reputationScore?: number;
}

const IMAGE_CYCLE_MS = 7000;
const getServerTimeIndex = () => 0;
const getTimeIndex = () => Math.floor(Date.now() / IMAGE_CYCLE_MS);
const subscribeTimeIndex = (callback: () => void) => {
  const interval = setInterval(callback, IMAGE_CYCLE_MS);
  return () => clearInterval(interval);
};

interface CarouselManufacturer {
  id: string;
  name: string;
  logo: string;
  description?: string;
  founded?: number;
  headquarters?: string;
  total_aircraft_count?: number;
}

interface ManufacturerAircraftCarouselProps {
  manufacturer?: CarouselManufacturer;
  manufacturerId: string;
  manufacturerName?: string;
  manufacturerLogo?: string;
  onSelect?: (aircraft: AircraftTypeRating) => void;
  onManufacturerSelect?: () => void;
  selectedId?: string;
  previewedId?: string;
  showCount?: boolean;
  title?: string;
  categoryFilter?: string;
  searchFilter?: string;
  sort?: 'newest' | 'oldest' | 'trending' | 'recommended';
  floating?: boolean;
}

export const ManufacturerAircraftCarousel: React.FC<ManufacturerAircraftCarouselProps> = ({
  manufacturer,
  manufacturerId,
  manufacturerName,
  manufacturerLogo,
  onSelect,
  onManufacturerSelect,
  selectedId,
  previewedId,
  showCount = true,
  title,
  categoryFilter,
  searchFilter,
  sort = 'newest',
  floating = false,
}) => {
  const aircraft = useMemo(() => {
    const query = searchFilter?.trim().toLowerCase();
    const filtered = rawAircraftTypeRatings.filter((a) => {
      if (a.manufacturer_id !== manufacturerId) return false;
      if (categoryFilter && categoryFilter !== 'all' && a.category !== categoryFilter) return false;
      if (query && !a.model.toLowerCase().includes(query)) return false;
      return true;
    });

    // Sort according to the selected sort option
    const getYear = (value: string | number | undefined) => {
      if (value === undefined || value === null) return 0;
      const parsed = parseInt(String(value).slice(0, 4), 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    switch (sort) {
      case 'oldest':
        filtered.sort((a, b) => getYear(a.first_flight) - getYear(b.first_flight));
        break;
      case 'newest':
        filtered.sort((a, b) => getYear(b.first_flight) - getYear(a.first_flight));
        break;
      case 'trending': {
        const rated = filtered as AircraftWithStats[];
        const getScore = (a: AircraftWithStats) => {
          const operators = Number(a.operator_count) || Number(a.operatorCount) || 0;
          const pilots = Number(a.pilot_count) || Number(a.pilotCount) || 0;
          return operators * 10 + pilots;
        };
        rated.sort((a, b) => getScore(b) - getScore(a));
        break;
      }
      case 'recommended': {
        const rated = filtered as AircraftWithStats[];
        const getScore = (a: AircraftWithStats) => {
          const year = getYear(a.first_flight);
          const operators = Number(a.operator_count) || Number(a.operatorCount) || 0;
          const reputation = Number(a.reputation_score) || Number(a.reputationScore) || 0;
          // Newer + more operators + higher reputation = better recommendation
          return year * 0.5 + operators * 5 + reputation * 20;
        };
        rated.sort((a, b) => getScore(b) - getScore(a));
        break;
      }
      default:
        break;
    }

    return filtered;
  }, [manufacturerId, categoryFilter, searchFilter, sort]);

  // Time-based synchronized image cycling (all components use same formula)
  const timeIndex = useSyncExternalStore(subscribeTimeIndex, getTimeIndex, getServerTimeIndex);
  const getSynchronizedImageIndex = (aircraftId: string, imageCount: number) => {
    if (imageCount <= 1) return 0;
    // Use aircraft ID as a seed to offset different aircraft
    const aircraftSeed = aircraftId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (timeIndex + aircraftSeed) % imageCount;
  };

  // Get current image for an aircraft
  const getCurrentImage = (a: DataAircraftTypeRating) => {
    const images = a.images || [a.image].filter(Boolean);
    if (images.length <= 1) return a.image;
    const currentIndex = getSynchronizedImageIndex(a.id, images.length);
    return images[currentIndex];
  };

  // Get current image index for an aircraft
  const getCurrentImageIndex = (a: DataAircraftTypeRating) => {
    const images = a.images || [a.image].filter(Boolean);
    if (images.length <= 1) return 0;
    return getSynchronizedImageIndex(a.id, images.length);
  };

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isProgrammaticScroll = useRef(false);
  const ignoreScrollAfterClick = useRef(false);
  const isPointerDown = useRef(false);

  const centerCard = useCallback((index: number) => {
    const card = cardRefs.current[index];
    const track = trackRef.current;
    if (!card || !track) return;
    const cardRect = card.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const trackCenter = trackRect.left + trackRect.width / 2;
    const targetScrollLeft = track.scrollLeft + (cardCenter - trackCenter);
    isProgrammaticScroll.current = true;
    track.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    // Release the lock shortly after the smooth-scroll animation finishes
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 600);
  }, []);

  const selectCardAtIndex = useCallback(
    (index: number) => {
      const aircraftItem = aircraft[index];
      if (!aircraftItem) return;
      onSelect?.(aircraftItem);
      centerCard(index);
    },
    [aircraft, onSelect, centerCard]
  );

  const scrollByCard = useCallback(
    (direction: 'left' | 'right') => {
      const currentIndex = aircraft.findIndex((a) => a.id === selectedId);
      const baseIndex = currentIndex === -1 ? 0 : currentIndex;
      const nextIndex =
        direction === 'left'
          ? Math.max(0, baseIndex - 1)
          : Math.min(aircraft.length - 1, baseIndex + 1);
      selectCardAtIndex(nextIndex);
    },
    [aircraft, selectedId, selectCardAtIndex]
  );

  // Center the selected card when selection changes
  useEffect(() => {
    if (selectedId) {
      const index = aircraft.findIndex((a) => a.id === selectedId);
      if (index !== -1) {
        // Small delay to allow layout/render to settle
        const timeout = setTimeout(() => centerCard(index), 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [selectedId, aircraft, centerCard]);

  // Auto-select the card closest to the center of the track while scrolling
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !floating) return;

    const handleScroll = () => {
      if (isProgrammaticScroll.current || ignoreScrollAfterClick.current || isPointerDown.current)
        return;
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestIndex = -1;
      let closestDistance = Infinity;

      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - trackCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = idx;
        }
      });

      if (closestIndex !== -1 && aircraft[closestIndex]?.id !== selectedId) {
        onSelect?.(aircraft[closestIndex]);
      }
    };

    // Debounce scroll selection slightly so it doesn't fire constantly
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 50);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [aircraft, floating, onSelect, selectedId]);

  // Keyboard left/right arrow support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      scrollByCard(e.key === 'ArrowLeft' ? 'left' : 'right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollByCard]);

  if (aircraft.length === 0) {
    return null;
  }

  const displayName = manufacturerName || aircraft[0]?.manufacturer_id || 'Manufacturer';
  const header = title || `${showCount ? `${aircraft.length} ` : ''}${displayName} Previews`;

  return (
    <div
      style={{
        marginBottom: floating ? '0' : '0.75rem',
        paddingBottom: floating ? '0' : '0.75rem',
        borderBottom: floating ? 'none' : '1px solid rgba(255,255,255,0.12)',
      }}
    >
      {!floating && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {header}
          </p>
        </div>
      )}
      {floating ? (
        <div className="relative" style={{ width: '100%' }}>
          {/* Center selection indicator - white upside-down triangle, only when aircraft selected */}
          {selectedId && (
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-20 pointer-events-none"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '12px solid rgba(255,255,255,0.95)',
                }}
              />
            </div>
          )}

          {/* Left edge fade */}
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(8, 12, 24, 0.98), transparent)' }}
          />
          {/* Right edge fade */}
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, rgba(8, 12, 24, 0.98), transparent)' }}
          />

          {/* Left glassy arrow */}
          <button
            type="button"
            onClick={() => scrollByCard('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 backdrop-blur-xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right glassy arrow */}
          <button
            type="button"
            onClick={() => scrollByCard('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 backdrop-blur-xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            ref={trackRef}
            className="floating-carousel-track px-4 md:px-6 lg:px-8"
            style={{
              display: 'flex',
              gap: '1.25rem',
              overflowX: 'auto',
              paddingBottom: '1rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Manufacturer logo card as first carousel card */}
            {(manufacturer?.logo || manufacturerLogo) && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                onClick={() => onManufacturerSelect?.()}
                className="w-[280px] min-w-[280px] md:w-[360px] md:min-w-[360px] lg:w-[420px] lg:min-w-[420px]"
                style={{
                  border: 'none',
                  borderRadius: '20px',
                  padding: 0,
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  outline: 'none',
                  scrollSnapAlign: 'center',
                }}
              >
                <div
                  className="h-[170px] md:h-[200px] lg:h-[220px]"
                  style={{
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background:
                      'linear-gradient(135deg, rgba(30, 41, 70, 0.6) 0%, rgba(15, 23, 42, 0.75) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow:
                      '0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                    transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                    position: 'relative',
                  }}
                >
                  {/* Edge vignette */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      zIndex: 2,
                      borderRadius: '20px',
                      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.35), inset 0 0 80px rgba(0,0,0,0.15)',
                    }}
                  />
                  <img
                    src={manufacturer?.logo || manufacturerLogo}
                    alt={manufacturer?.name || manufacturerName || manufacturerId}
                    style={{
                      width: '55%',
                      height: '55%',
                      objectFit: 'contain',
                      filter: 'brightness(0) invert(1)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </motion.button>
            )}

            {aircraft.map((a, index) => {
              const isSelected = selectedId === a.id;
              const isPreviewed = previewedId === a.id;
              return (
                <motion.button
                  key={a.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  initial={{ opacity: 0, y: 30, scale: 0.92 }}
                  animate={{ opacity: 1, y: isSelected ? -6 : 0, scale: isSelected ? 1.02 : 1 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.5,
                    ease: EASE_OUT_EXPO,
                  }}
                  onPointerDown={() => {
                    isPointerDown.current = true;
                  }}
                  onPointerUp={() => {
                    isPointerDown.current = false;
                  }}
                  onClick={() => {
                    ignoreScrollAfterClick.current = true;
                    setTimeout(() => {
                      ignoreScrollAfterClick.current = false;
                    }, 800);
                    centerCard(index);
                    onSelect?.(a);
                  }}
                  className="w-[280px] min-w-[280px] md:w-[360px] md:min-w-[360px] lg:w-[420px] lg:min-w-[420px]"
                  style={{
                    border: 'none',
                    borderRadius: '20px',
                    padding: 0,
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    outline: 'none',
                    scrollSnapAlign: 'center',
                    perspective: '1000px',
                  }}
                >
                  <div
                    className="floating-aircraft-card h-[170px] md:h-[200px] lg:h-[220px]"
                    style={{
                      position: 'relative',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      background: 'transparent',
                      border: isSelected
                        ? '1px solid rgba(255, 255, 255, 0.25)'
                        : isPreviewed
                          ? '1px solid rgba(255, 255, 255, 0.16)'
                          : '1px solid rgba(255, 255, 255, 0.10)',
                      boxShadow: isSelected
                        ? '0 20px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)'
                        : '0 12px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10)',
                      transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    {/* Image with bottom dissolve into shader */}
                    {getCurrentImage(a) ? (
                      <img
                        src={getCurrentImage(a)}
                        alt={a.model}
                        className="h-[130px] md:h-[155px] lg:h-[170px]"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          maskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)',
                          WebkitMaskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)',
                        }}
                      />
                    ) : null}
                    <div
                      className="h-[130px] md:h-[155px] lg:h-[170px]"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        pointerEvents: 'none',
                        background:
                          'linear-gradient(to bottom, rgba(15,23,42,0) 0%, rgba(15,23,42,0) 55%, rgba(15,23,42,0.18) 82%, rgba(15,23,42,0.35) 100%)',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        background: 'rgba(15, 23, 42, 0.75)',
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 2,
                      }}
                    >
                      {a.category}
                    </span>
                    {/* Aircraft name bar below the image */}
                    <div
                      className="h-[40px] md:h-[45px] lg:h-[50px]"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 1rem',
                        zIndex: 2,
                      }}
                    >
                      <p
                        className="text-sm md:text-base"
                        style={{
                          margin: 0,
                          fontWeight: 800,
                          color: '#ffffff',
                          textAlign: 'center',
                          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        }}
                      >
                        {a.model}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.2) transparent',
          }}
        >
          {aircraft.slice(0, 20).map((a, index) => {
            const isSelected = selectedId === a.id;
            const isPreviewed = previewedId === a.id;
            return (
              <motion.button
                key={a.id}
                layout
                initial={{ opacity: 0, y: 28, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.45,
                  ease: EASE_OUT_EXPO,
                }}
                whileHover={{ y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect?.(a)}
                className="w-[140px] md:w-[160px] lg:w-[180px]"
                style={{
                  flex: '0 0 auto',
                  textAlign: 'left',
                  background: isSelected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.08)',
                  border: `2px solid ${isPreviewed ? 'rgba(56, 189, 248, 0.8)' : isSelected ? 'rgba(239, 68, 68, 0.55)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isSelected
                    ? 'rgba(239, 68, 68, 0.35)'
                    : 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.borderColor = isPreviewed
                    ? 'rgba(56, 189, 248, 1)'
                    : isSelected
                      ? 'rgba(239, 68, 68, 0.75)'
                      : 'rgba(255,255,255,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSelected
                    ? 'rgba(239, 68, 68, 0.25)'
                    : 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = isPreviewed
                    ? 'rgba(56, 189, 248, 0.8)'
                    : isSelected
                      ? 'rgba(239, 68, 68, 0.55)'
                      : 'rgba(255,255,255,0.12)';
                }}
              >
                <div
                  className="h-[80px] md:h-[90px] lg:h-[100px]"
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <AnimatePresence mode="sync">
                    {getCurrentImage(a) ? (
                      <motion.div
                        key={`${a.id}-${getCurrentImageIndex(a)}`}
                        style={{ position: 'absolute', inset: 0 }}
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{
                          duration: 1.0,
                          ease: [0.4, 0.0, 0.2, 1],
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.img
                          src={getCurrentImage(a)}
                          alt={a.model}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          initial={{ scale: 1 }}
                          animate={{ scale: 1.1 }}
                          transition={{
                            duration: 7,
                            ease: 'linear',
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                        />
                      </motion.div>
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plane size={24} style={{ color: 'rgba(255,255,255,0.3)' }} />
                      </div>
                    )}
                  </AnimatePresence>
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.4rem',
                      right: '0.4rem',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {a.category}
                  </span>
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {a.model}
                  </p>
                  <p
                    style={{
                      margin: '0.25rem 0 0',
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.55)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {displayName}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};
