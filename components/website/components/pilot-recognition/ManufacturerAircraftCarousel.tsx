import React, { useMemo } from 'react';
import { Plane } from 'lucide-react';
import {
  aircraftTypeRatings as rawAircraftTypeRatings,
  type AircraftTypeRating as DataAircraftTypeRating,
} from '@/data/aircraft-manufacturers';

type AircraftTypeRating = DataAircraftTypeRating;

interface ManufacturerAircraftCarouselProps {
  manufacturerId: string;
  manufacturerName?: string;
  onSelect?: (aircraft: AircraftTypeRating) => void;
  selectedId?: string;
  previewedId?: string;
  showCount?: boolean;
  title?: string;
}

export const ManufacturerAircraftCarousel: React.FC<ManufacturerAircraftCarouselProps> = ({
  manufacturerId,
  manufacturerName,
  onSelect,
  selectedId,
  previewedId,
  showCount = true,
  title,
}) => {
  const aircraft = useMemo(() => {
    return rawAircraftTypeRatings.filter(a => a.manufacturer_id === manufacturerId);
  }, [manufacturerId]);

  if (aircraft.length === 0) {
    return null;
  }

  const displayName = manufacturerName || aircraft[0]?.manufacturer_id || 'Manufacturer';
  const header = title || `${showCount ? `${aircraft.length} ` : ''}${displayName} Previews`;

  return (
    <div style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {header}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
        {aircraft.slice(0, 20).map((a) => {
          const isSelected = selectedId === a.id;
          const isPreviewed = previewedId === a.id;
          return (
            <button
              key={a.id}
              onClick={() => onSelect?.(a)}
              style={{
                flex: '0 0 auto',
                width: '160px',
                textAlign: 'left',
                background: isSelected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.08)',
                border: `2px solid ${isPreviewed ? 'rgba(56, 189, 248, 0.8)' : isSelected ? 'rgba(239, 68, 68, 0.55)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = isSelected ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255,255,255,0.18)'; e.currentTarget.style.borderColor = isPreviewed ? 'rgba(56, 189, 248, 1)' : isSelected ? 'rgba(239, 68, 68, 0.75)' : 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isSelected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = isPreviewed ? 'rgba(56, 189, 248, 0.8)' : isSelected ? 'rgba(239, 68, 68, 0.55)' : 'rgba(255,255,255,0.12)'; }}
            >
              <div style={{ height: '90px', background: 'rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>
                {a.image ? (
                  <img src={a.image} alt={a.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plane size={24} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </div>
                )}
                <span style={{
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
                }}>
                  {a.category}
                </span>
              </div>
              <div style={{ padding: '0.75rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.model}</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
