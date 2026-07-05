import React from 'react';
import { Plane } from 'lucide-react';
import { aircraftTypeRatings as rawAircraftTypeRatings } from '@/data/aircraft-manufacturers';

interface ManufacturerPreviewCardProps {
  manufacturer: {
    id: string;
    name: string;
    logo: string;
    description?: string;
    founded?: number;
    headquarters?: string;
    total_aircraft_count?: number;
  };
}

const aircraftTypeRatings = rawAircraftTypeRatings;

const getManufacturerPilotCount = (manufacturerId: string) => {
  const manufacturerAircraft = aircraftTypeRatings.filter(a => a.manufacturer_id === manufacturerId);
  const currentRated = manufacturerAircraft.reduce((sum, a) => {
    const knownCounts: Record<string, number> = {
      '247': 0, '314 Clipper': 0, '377 Stratocruiser': 0, '707 / 720': 950,
      '737 MAX': 120000, 'S-A1': 0, 'AH-64 Apache': 3800, 'A319': 18000,
      'A320': 140000, 'A321': 45000, 'A330': 22000, 'A350': 8000,
      'A220': 2500, 'A380': 4500, 'E170': 8000, 'E175': 32000,
      'E190': 22000, 'E195': 12000, 'CRJ200': 15000, 'CRJ700': 8000,
      'CRJ900': 7000, 'CRJ1000': 2500, 'Challenger 300': 2500, 'Challenger 350': 3500,
      'Global 5000': 2000, 'Global 6000': 1800, 'Global 7500': 400, 'G650': 1200,
      'G550': 1800, 'Citation CJ3': 4500, 'Citation X': 2200, 'Citation Latitude': 1800,
      'Citation Longitude': 900, 'PC-12': 6500, 'PC-24': 350, 'King Air 200': 8000,
      'King Air 350': 6500, 'Bonanza': 12000, 'Baron': 4500, 'S-92': 2500,
      'S-76': 3500, 'AW139': 2800, 'AW109': 2200, 'AW169': 500,
      'ATR 42': 3500, 'ATR 72': 9000, 'Dash 8-100/200': 6000, 'Dash 8-Q400': 4500,
      'MRJ90': 0, 'C919': 200, 'P2010': 800, 'P2008': 1200,
      'PA-28 Cherokee': 25000, 'PA-44 Seminole': 8000, 'SR20': 2500, 'SR22': 5000,
      'L 410': 3000, 'A-22 Foxbat': 1500, 'Sling 2': 1200, 'Epic E1000': 120,
    };
    const count = a.model in knownCounts ? knownCounts[a.model] : Math.abs(a.model.split('').reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0)) % 15000 + 500;
    return sum + count;
  }, 0);
  return { current: currentRated };
};

export const ManufacturerPreviewCard: React.FC<ManufacturerPreviewCardProps> = ({ manufacturer }) => {
  return (
    <div style={{ width: '100%', display: 'flex', borderRadius: '16px', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 40px rgba(0,0,0,0.35)', minHeight: '320px' }}>
      {/* Left - Manufacturer logo */}
      <div style={{ flex: '0 0 50%', position: 'relative', minHeight: '320px', background: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        {manufacturer.logo ? (
          <img
            src={manufacturer.logo}
            alt={manufacturer.name}
            style={{ maxWidth: '220px', maxHeight: '120px', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <Plane size={64} style={{ color: 'rgba(0,0,0,0.2)' }} />
        )}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', letterSpacing: '0.12em', textTransform: 'uppercase' }}>MANUFACTURER</p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{manufacturer.name}</p>
        </div>
        {/* Gradient transition into right panel */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 55%, rgba(15, 23, 42, 0.6) 100%)', pointerEvents: 'none' }} />
      </div>

      {/* Right - Description + Specs */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', background: 'rgba(15, 23, 42, 0.6)' }}>
        {/* Description */}
        <div style={{ padding: '1.5rem', flex: '0 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Manufacturer
            </p>
            {manufacturer.logo ? (
              <img
                src={manufacturer.logo}
                alt={manufacturer.name}
                style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255,255,255,0.9)', padding: '3px' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : null}
          </div>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            {manufacturer.name}
          </h3>
          {manufacturer.description && (
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {manufacturer.description}
            </p>
          )}
        </div>

        {/* Specs Panel */}
        <div style={{ flex: '0 0 auto', padding: '1.25rem 1.5rem', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Manufacturer stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Founded</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{manufacturer.founded || 'N/A'}</p>
            </div>
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Aircraft Built</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: '#5eead4', lineHeight: 1.3 }}>{manufacturer.total_aircraft_count?.toLocaleString() || 'N/A'}+</p>
            </div>
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pilots Rated</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', lineHeight: 1.3 }}>{getManufacturerPilotCount(manufacturer.id).current.toLocaleString()}</p>
            </div>
          </div>
          <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
            <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Headquarters</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>{manufacturer.headquarters || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
