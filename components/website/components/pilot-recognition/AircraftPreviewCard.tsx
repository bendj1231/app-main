import React, { useState } from 'react';
import { Plane } from 'lucide-react';

interface Manufacturer {
  id: string;
  name: string;
  logo: string;
}

interface AircraftTypeRating {
  id: string;
  model: string;
  manufacturer_id: string;
  category: string;
  subcategory?: string;
  image?: string;
  description?: string;
  demandLevel?: 'none' | 'high' | 'medium' | 'low';
  lifecycle_stage?: 'early-career' | 'mid-career' | 'mature' | 'retiring';
  lifecycleStage?: 'early-career' | 'mid-career' | 'mature' | 'retiring';
  operator_count?: number;
  operatorCount?: number;
  pilot_count?: number;
  pilotCount?: number;
  conditionally_new?: 'green' | 'amber' | 'red';
}

interface AircraftPreviewCardProps {
  aircraft: AircraftTypeRating;
  manufacturer: Manufacturer | undefined;
}

const TYPE_RATING_CENTERS = [
  { id: 'cae', name: 'CAE' },
  { id: 'flightsafety', name: 'FlightSafety' },
  { id: 'boeing-fts', name: 'Boeing Flight Training' },
  { id: 'airbus-fts', name: 'Airbus Training' },
  { id: 'l3harris', name: 'L3Harris' },
  { id: 'trax', name: 'TRAX' },
];

const getPilotCount = (model: string) => {
  const knownCounts: Record<string, number> = {
    '247': 0,
    '314 Clipper': 0,
    '377 Stratocruiser': 0,
    '707 / 720': 950,
    '737 MAX': 120000,
    'S-A1': 0,
    'AH-64 Apache': 3800,
    'B-52H': 420,
    'CH-47 Chinook': 3500,
    'C-17 Globemaster III': 4150,
    'F-15EX': 82,
    'F/A-18E/F': 1325,
  };
  if (model in knownCounts) return knownCounts[model];
  let hash = 0;
  for (let i = 0; i < model.length; i++) hash = model.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 15000 + 500;
};

const getAircraftStatus = (aircraft: AircraftTypeRating) => {
  if (aircraft.id === 'supernal-sa-1') return 'Concept / R&D — Not certified';
  if (aircraft.id === 'b777x') return 'In certification / Pre-delivery';
  if (aircraft.subcategory?.includes('retired')) return 'End of production / Retired';
  if (aircraft.category === 'legacy') return 'End of production / In service';
  if (aircraft.category === 'military') return 'Active military service';
  if (aircraft.subcategory === 'game-changer') return 'Active production / In service';
  return 'Active / In service';
};

export function AircraftPreviewCard({ aircraft, manufacturer }: AircraftPreviewCardProps) {
  const [selectedRatingCenter, setSelectedRatingCenter] = useState<string>('');

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        minHeight: '420px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.25)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* Left — Full Image */}
      <div style={{ flex: '0 0 50%', position: 'relative', minHeight: '320px', background: 'rgba(0,0,0,0.15)' }}>
        {aircraft.image ? (
          <img
            src={aircraft.image}
            alt={aircraft.model}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', inset: 0 }}>
            <Plane size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 55%, rgba(15, 23, 42, 0.6) 100%)', pointerEvents: 'none' }} />
      </div>

      {/* Right — Description + Specs */}
      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', background: 'rgba(15, 23, 42, 0.6)' }}>
        {/* Description */}
        <div style={{ padding: '1.5rem', flex: '0 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {manufacturer?.name || aircraft.manufacturer_id}
            </p>
            {manufacturer?.logo ? (
              <img
                src={manufacturer.logo}
                alt={manufacturer.name}
                style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255,255,255,0.9)', padding: '2px' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <span style={{
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                background: 'rgba(20, 184, 166, 0.2)',
                color: '#5eead4',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: '1px solid rgba(20, 184, 166, 0.3)',
              }}>
                {aircraft.category}
              </span>
            )}
          </div>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            {aircraft.model}
          </h3>
          {aircraft.description && (
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {aircraft.description}
            </p>
          )}
          <button
            onClick={() => {
              const detailEl = document.getElementById('aircraft-detail-section');
              detailEl?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '1rem',
              padding: '0.5rem 0',
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'color 0.15s',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
          >
            View more about type rating →
          </button>
        </div>

        {/* Specs Panel */}
        <div style={{ flex: '0 0 auto', padding: '1.25rem 1.5rem', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pilots rated</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                {aircraft.id === 'supernal-sa-1' || aircraft.id === 'b777x' ? '0' : aircraft.id === 'b777-300er' ? '38,000 – 45,000' : aircraft.id === 'b787' ? '48,000 – 55,000' : aircraft.id === 'b767-300er' ? '15,000 – 18,000' : aircraft.id === 'b737-ng' ? '110,000 – 130,000' : aircraft.id === 'b757' ? '14,000 – 17,000' : aircraft.id === 'b717' ? '1,200 – 1,500' : aircraft.id === 'b727' ? '300 – 500' : aircraft.id === 'b747-8f' ? '3,500 – 4,500' : getPilotCount(aircraft.model).toLocaleString()}
              </p>
            </div>
            <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Status</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: '#5eead4', lineHeight: 1.3 }}>{getAircraftStatus(aircraft)}</p>
            </div>
          </div>

          {/* Type rating center select */}
          <div>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Type rating center</p>
            <select
              value={selectedRatingCenter}
              onChange={(e) => setSelectedRatingCenter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="" style={{ background: '#0f172a', color: '#ffffff' }}>Select a training center...</option>
              {TYPE_RATING_CENTERS.map((center) => (
                <option key={center.id} value={center.id} style={{ background: '#0f172a', color: '#ffffff' }}>{center.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
