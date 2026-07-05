import React, { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Search, Plane, X, RotateCcw, Plus, Star, DollarSign, Gauge, BookOpen, CheckCircle2, Clock, Award, Users, Briefcase } from 'lucide-react';
import {
  manufacturers as rawManufacturers,
  aircraftTypeRatings as rawAircraftTypeRatings,
  type Manufacturer as DataManufacturer,
  type AircraftTypeRating as DataAircraftTypeRating,
} from '@/data/aircraft-manufacturers';
import { ManufacturerAircraftCarousel } from './ManufacturerAircraftCarousel';

interface AircraftTypeRating extends DataAircraftTypeRating {}

interface Manufacturer extends DataManufacturer {}

// Manufacturer logo mapping — mirrors TypeRatingSearchPage
const MANUFACTURER_LOGOS: Record<string, string> = {
  airbus: '/images/manufacturer-logos/images/set-01-logos/airbus-logo.png',
  boeing: '/images/manufacturer-logos/boeing-logo.png',
  atr: '/images/manufacturer-logos/images/set-01-logos/atr-logo.png',
  embraer: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Embraer_logo.svg/3840px-Embraer_logo.svg.png',
  bombardier: '/images/manufacturer-logos/images/set-01-logos/bombardier-logo.svg',
  gulfstream: '/images/manufacturer-logos/images/set-01-logos/gulfstream-logo.webp',
  cessna: '/images/manufacturer-logos/images/set-01-logos/cessna-logo.png',
  'dassault-falcon': '/images/manufacturer-logos/dassault-logo.png',
  pilatus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Pilatus_Aircraft_logo.svg/3840px-Pilatus_Aircraft_logo.svg.png',
  beechcraft: '/images/manufacturer-logos/beechcraft-logo.png',
  sikorsky: '/images/manufacturer-logos/images/set-01-logos/sikorsky-logo.png',
  leonardo: '/images/manufacturer-logos/images/set-01-logos/leonardo-logo.png',
  'de-havilland': '/images/manufacturer-logos/images/set-01-logos/de-havilland-logo.png',
  'mitsubishi-mrj': '/images/manufacturer-logos/images/set-01-logos/mitsubishi-logo.svg',
  'comac-c919': '/images/manufacturer-logos/images/set-01-logos/comac-logo.jpg',
  tecnam: '/images/manufacturer-logos/images/set-01-logos/tecnam-logo.png',
  piper: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Piper_Aircraft_logo.svg',
  cirrus: '/images/manufacturer-logos/cirrus-logo.png',
  let: '/images/manufacturer-logos/images/set-01-logos/let-logo.svg',
  aeroprakt: '/images/manufacturer-logos/images/set-01-logos/aeroprakt-logo.png',
  antonov: '/images/manufacturer-logos/images/set-01-logos/antonov-logo.png',
  ilyushin: '/images/manufacturer-logos/images/set-01-logos/ilyushin-logo.png',
  'hindustan-aeronautics': '/images/manufacturer-logos/images/set-01-logos/hindustan-logo.jpg',
  dornier: '/images/manufacturer-logos/images/set-01-logos/dornier-logo.svg',
  archer: '/images/manufacturer-logos/images/set-01-logos/archer-logo.png',
  joby: '/images/manufacturer-logos/images/set-01-logos/joby-logo.jpg',
  mlg: '/images/manufacturer-logos/images/set-01-logos/mlg-logo.jpg',
  bell: '/images/manufacturer-logos/images/set-01-logos/bell-logo.svg',
  ehang: '/images/manufacturer-logos/images/set-01-logos/ehang-logo.jpg',
  raytheon: '/images/manufacturer-logos/images/set-01-logos/raytheon-logo.svg',
  lilium: '/images/manufacturer-logos/images/set-01-logos/lilium-logo.png',
  wisk: '/images/manufacturer-logos/images/set-01-logos/wisk-logo.jpg',
  beta: '/images/manufacturer-logos/images/set-01-logos/beta-logo.png',
  autoflight: '/images/manufacturer-logos/images/set-01-logos/autoflight-logo.jpg',
  eve: '/images/manufacturer-logos/images/set-01-logos/eve-logo.jpg',
  mooney: '/images/manufacturer-logos/images/set-01-logos/mooney-logo.png',
  pipistrel: '/images/manufacturer-logos/images/set-01-logos/pipistrel-logo.png',
  aviat: '/images/manufacturer-logos/images/set-01-logos/aviat-logo.png',
  'american-champion': '/images/manufacturer-logos/images/set-01-logos/american-champion-logo.png',
  sling: '/images/manufacturer-logos/images/set-01-logos/sling-logo.png',
  epic: '/images/manufacturer-logos/images/set-01-logos/epic-logo.jpg',
  socata: '/images/manufacturer-logos/images/set-01-logos/socata-logo.png',
  hondajet: '/images/manufacturer-logos/images/set-01-logos/hondajet-logo.png',
  airtractor: '/images/manufacturer-logos/images/set-01-logos/airtractor-logo.png',
  thrush: '/images/manufacturer-logos/images/set-01-logos/thrush-logo.jpg',
  elixir: '/images/manufacturer-logos/images/set-01-logos/elixir-logo.webp',
  icon: '/images/manufacturer-logos/images/set-01-logos/icon-logo.jpg',
  waco: '/images/manufacturer-logos/images/set-01-logos/waco-logo.png',
  vulcanair: '/images/manufacturer-logos/images/set-01-logos/vulcanair-logo.png',
  mahindra: '/images/manufacturer-logos/images/set-01-logos/mahindra-logo.png',
  'twin-commander': '/images/manufacturer-logos/images/set-01-logos/twin-commander-logo.png',
  'britten-norman': '/images/manufacturer-logos/images/set-01-logos/britten-norman-logo.png',
  evektor: '/images/manufacturer-logos/images/set-01-logos/evektor-logo.jpg',
  bristell: '/images/manufacturer-logos/images/set-01-logos/bristell-logo.png',
  velocity: '/images/manufacturer-logos/images/set-01-logos/velocity-logo.png',
  quest: '/images/manufacturer-logos/images/set-01-logos/quest-logo.png',
  'pacific-aerospace': '/images/manufacturer-logos/images/set-01-logos/pacific-aerospace-logo.jpg',
  'aero-east-europe': '/images/manufacturer-logos/images/set-01-logos/aero-east-europe-logo.png',
  jmb: '/images/manufacturer-logos/images/set-01-logos/jmb-logo.png',
  foxcon: '/images/manufacturer-logos/images/set-01-logos/foxcon-logo.jpg',
  grob: '/images/manufacturer-logos/images/set-01-logos/grob-logo.jpg',
  'elroy-air': '/images/manufacturer-logos/images/set-01-logos/elroy-air-logo.jpg',
  pyka: '/images/manufacturer-logos/images/set-01-logos/pyka-logo.jpg',
  sabrewing: '/images/manufacturer-logos/images/set-01-logos/sabrewing-logo.jpg',
  fugro: '/images/manufacturer-logos/images/set-01-logos/fugro-logo.svg',
  supernal: '/images/manufacturer-logos/images/set-01-logos/supernal-logo.jpg',
  'regent-craft': '/images/manufacturer-logos/images/set-01-logos/regent-craft-logo.png',
};

const MANUFACTURER_SCOPE: Record<string, string> = {
  airbus: 'Commercial Aviation',
  boeing: 'Commercial Aviation',
  ilyushin: 'Commercial Aviation',
  'comac-c919': 'Commercial Aviation',
  embraer: 'Regional & Business Aviation',
  atr: 'Regional & Business Aviation',
  'de-havilland': 'Regional & Business Aviation',
  let: 'Regional & Business Aviation',
  'mitsubishi-mrj': 'Regional & Business Aviation',
  dornier: 'Regional & Business Aviation',
  bombardier: 'Regional & Business Aviation',
  gulfstream: 'Regional & Business Aviation',
  'dassault-falcon': 'Regional & Business Aviation',
  pilatus: 'Regional & Business Aviation',
  hondajet: 'Regional & Business Aviation',
  beechcraft: 'Regional & Business Aviation',
  quest: 'Regional & Business Aviation',
  cessna: 'General Aviation',
  piper: 'General Aviation',
  cirrus: 'General Aviation',
  tecnam: 'General Aviation',
  mooney: 'General Aviation',
  socata: 'General Aviation',
  vulcanair: 'General Aviation',
  aviat: 'General Aviation',
  evektor: 'General Aviation',
  sikorsky: 'Helicopters',
  leonardo: 'Helicopters',
  bell: 'Helicopters',
  'hindustan-aeronautics': 'Defense & Aerospace',
  raytheon: 'Defense & Aerospace',
  antonov: 'Cargo & Transport',
  sabrewing: 'Cargo & Transport',
  'elroy-air': 'Cargo & Transport',
  'britten-norman': 'Cargo & Transport',
  'pacific-aerospace': 'Cargo & Transport',
  airtractor: 'Agricultural Aviation',
  thrush: 'Agricultural Aviation',
  mahindra: 'Agricultural Aviation',
  pyka: 'Agricultural Aviation',
  archer: 'Urban Air Mobility',
  joby: 'Urban Air Mobility',
  ehang: 'Urban Air Mobility',
  wisk: 'Urban Air Mobility',
  beta: 'Urban Air Mobility',
  autoflight: 'Urban Air Mobility',
  eve: 'Urban Air Mobility',
  lilium: 'Urban Air Mobility',
  supernal: 'Urban Air Mobility',
  'regent-craft': 'Urban Air Mobility',
  icon: 'Urban Air Mobility',
  aeroprakt: 'Light Sport & Trainers',
  'american-champion': 'Light Sport & Trainers',
  sling: 'Light Sport & Trainers',
  epic: 'Light Sport & Trainers',
  elixir: 'Light Sport & Trainers',
  bristell: 'Light Sport & Trainers',
  'aero-east-europe': 'Light Sport & Trainers',
  jmb: 'Light Sport & Trainers',
  foxcon: 'Light Sport & Trainers',
  grob: 'Light Sport & Trainers',
  pipistrel: 'Light Sport & Trainers',
  velocity: 'Light Sport & Trainers',
  mlg: 'Light Sport & Trainers',
  waco: 'Light Sport & Trainers',
  'twin-commander': 'Light Sport & Trainers',
  fugro: 'Specialty Aviation',
};

const manufacturers: Manufacturer[] = rawManufacturers.map(m => ({
  ...m,
  logo: MANUFACTURER_LOGOS[m.id] || m.logo || '/images/set-01-logos/logo.png',
}));
const aircraftTypeRatings: AircraftTypeRating[] = rawAircraftTypeRatings;

const uniqueCategories = Array.from(new Set(aircraftTypeRatings.map(a => a.category))).sort();
const uniqueModels = Array.from(new Set(aircraftTypeRatings.map(a => a.model))).sort();

const manufacturerById = (id: string) => manufacturers.find(m => m.id === id);

const idsWithAircraft = new Set(aircraftTypeRatings.map(a => a.manufacturer_id));
const manufacturersWithAircraft = manufacturers.filter(m => idsWithAircraft.has(m.id));

const TYPE_RATING_CENTERS = [
  { id: 'cae', name: 'CAE', initials: 'CA', color: '#2563eb' },
  { id: 'flightsafety', name: 'FlightSafety', initials: 'FS', color: '#ea580c' },
  { id: 'boeing-fts', name: 'Boeing Flight Training', initials: 'BF', color: '#1e40af' },
  { id: 'airbus-fts', name: 'Airbus Training', initials: 'AT', color: '#0ea5e9' },
  { id: 'l3harris', name: 'L3Harris', initials: 'L3', color: '#7c3aed' },
  { id: 'trax', name: 'TRAX', initials: 'TR', color: '#16a34a' },
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

const getManufacturerPilotCount = (manufacturerId: string) => {
  // Sum pilot counts for all aircraft from this manufacturer
  const manufacturerAircraft = aircraftTypeRatings.filter(a => a.manufacturer_id === manufacturerId);
  const currentRated = manufacturerAircraft.reduce((sum, a) => sum + getPilotCount(a.model), 0);
  // Historical total is roughly 3-5x current (pilots over decades)
  const historicalTotal = Math.floor(currentRated * 4.2);
  return { current: currentRated, historical: historicalTotal };
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

const getAircraftAge = (firstFlight?: number) => {
  if (!firstFlight) return null;
  const currentYear = new Date().getFullYear();
  return currentYear - firstFlight;
};

export const AircraftRatingsSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedAircraftIds, setSelectedAircraftIds] = useState<string[]>([]);
  const [previewedAircraftId, setPreviewedAircraftId] = useState<string>('');
  const [activeFilterTab, setActiveFilterTab] = useState<'manufacturer' | 'model' | 'class'>('manufacturer');
  const [confirmedAircrafts, setConfirmedAircrafts] = useState<AircraftTypeRating[]>([]);
  const [selectedRatingCenters, setSelectedRatingCenters] = useState<Record<string, string>>({});
  const [categorySelected, setCategorySelected] = useState(false);
  const [hoveredManufacturer, setHoveredManufacturer] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('Overview');
  const [isManufacturerModalOpen, setIsManufacturerModalOpen] = useState(false);
  const [manufacturerScopeFilter, setManufacturerScopeFilter] = useState('');

  const availableScopes = useMemo(() => {
    return Array.from(new Set(Object.values(MANUFACTURER_SCOPE))).sort();
  }, []);

  const availableModels = useMemo(() => {
    if (!selectedManufacturer) return uniqueModels;
    return Array.from(
      new Set(
        aircraftTypeRatings
          .filter(a => a.manufacturer_id === selectedManufacturer)
          .map(a => a.model)
      )
    ).sort();
  }, [selectedManufacturer]);

  const availableClasses = useMemo(() => {
    let filtered = aircraftTypeRatings;
    if (selectedManufacturer) filtered = filtered.filter(a => a.manufacturer_id === selectedManufacturer);
    if (selectedModel) filtered = filtered.filter(a => a.model === selectedModel);
    return Array.from(new Set(filtered.map(a => a.category))).sort();
  }, [selectedManufacturer, selectedModel]);

  const filteredRatings = useMemo(() => {
    return aircraftTypeRatings.filter((aircraft) => {
      const matchesManufacturer = !selectedManufacturer || aircraft.manufacturer_id === selectedManufacturer;
      const matchesClass = !selectedClass || aircraft.category === selectedClass;
      return matchesManufacturer && matchesClass;
    });
  }, [selectedManufacturer, selectedClass]);

  const filteredManufacturers = useMemo(() => {
    let result = manufacturers;
    if (manufacturerScopeFilter) {
      result = result.filter(m => MANUFACTURER_SCOPE[m.id] === manufacturerScopeFilter);
    }
    if (searchQuery) {
      result = result.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [searchQuery, manufacturerScopeFilter]);

  const filteredModelOptions = useMemo(() => {
    if (!searchQuery) return availableModels;
    return availableModels.filter(model => model.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, availableModels]);

  const filteredClassOptions = useMemo(() => {
    if (!searchQuery) return availableClasses;
    return availableClasses.filter(cls => cls.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, availableClasses]);

  const maxReachableStage = useMemo(() => {
    if (!selectedManufacturer) return 'manufacturer';
    if (!categorySelected) return 'class';
    return 'model';
  }, [selectedManufacturer, categorySelected]);

  const selectedAircrafts = useMemo(() => {
    return filteredRatings.filter(a => selectedAircraftIds.includes(a.id));
  }, [filteredRatings, selectedAircraftIds]);

  const previewedAircraft = useMemo(() => {
    return previewedAircraftId ? filteredRatings.find(a => a.id === previewedAircraftId) : null;
  }, [previewedAircraftId, filteredRatings]);

  const selectedAircraft = useMemo(() => {
    return previewedAircraft || selectedAircrafts[0] || filteredRatings[0] || null;
  }, [previewedAircraft, selectedAircrafts, filteredRatings]);

  const selectedManufacturerData = useMemo(() => {
    return selectedManufacturer ? manufacturers.find(m => m.id === selectedManufacturer) || null : null;
  }, [selectedManufacturer]);

  const showManufacturerPreview = useMemo(() => {
    return !!selectedManufacturer && !categorySelected;
  }, [selectedManufacturer, categorySelected]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedManufacturer('');
    setSelectedModel('');
    setSelectedClass('');
    setSelectedAircraftIds([]);
    setPreviewedAircraftId('');
    setConfirmedAircrafts([]);
    setCategorySelected(false);
    setManufacturerScopeFilter('');
    setActiveFilterTab('manufacturer');
  };

  const handleConfirm = () => {
    if (selectedAircrafts.length > 0) {
      setConfirmedAircrafts(selectedAircrafts);
      // eslint-disable-next-line no-console
      console.log('Type ratings locked in:', selectedAircrafts.map(a => a.model).join(', '));
    }
  };

  const hasFilters = searchQuery || selectedManufacturer || selectedModel || selectedClass || selectedAircraftIds.length > 0;
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep tabs within reachable stages
  useEffect(() => {
    const order = ['manufacturer', 'class', 'model'] as const;
    const currentIndex = order.indexOf(activeFilterTab);
    const maxIndex = order.indexOf(maxReachableStage);
    if (currentIndex > maxIndex) {
      setActiveFilterTab(maxReachableStage);
    }
  }, [activeFilterTab, maxReachableStage]);

  const inlineFilters = (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      background: 'rgba(15, 23, 42, 0.4)',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      {/* Filter tabs — hidden on the final model/selection overview stage */}
      {activeFilterTab !== 'model' && (
        <div style={{ display: 'grid', gridTemplateColumns: !selectedManufacturer ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          {/* Manufacturer tab */}
          <button
            onClick={() => setActiveFilterTab('manufacturer')}
            style={{
              padding: '0.65rem 0.75rem',
              background: activeFilterTab === 'manufacturer' ? 'rgba(20, 184, 166, 0.25)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${activeFilterTab === 'manufacturer' ? 'rgba(20, 184, 166, 0.6)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => { if (activeFilterTab !== 'manufacturer') e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
            onMouseLeave={(e) => { if (activeFilterTab !== 'manufacturer') e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: activeFilterTab === 'manufacturer' ? '#5eead4' : 'rgba(255,255,255,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Manufacturer</p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedManufacturer ? manufacturerById(selectedManufacturer)?.name : 'All Manufacturers'}
            </p>
          </button>

          {/* Stage 1: Scope filter dropdown instead of disabled tabs */}
          {!selectedManufacturer ? (
            <div style={{ position: 'relative' }}>
              <select
                value={manufacturerScopeFilter}
                onChange={(e) => setManufacturerScopeFilter(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '0.65rem 0.75rem',
                  background: manufacturerScopeFilter ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${manufacturerScopeFilter ? 'rgba(20, 184, 166, 0.4)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <option value="" style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.85rem' }}>All Sectors</option>
                {availableScopes.map(scope => (
                  <option key={scope} value={scope} style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.85rem' }}>{scope}</option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ) : (
            <>
              {/* Category tab */}
              <button
                onClick={() => setActiveFilterTab('class')}
                style={{
                  padding: '0.65rem 0.75rem',
                  background: activeFilterTab === 'class' ? 'rgba(20, 184, 166, 0.25)' : selectedClass ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${activeFilterTab === 'class' ? 'rgba(20, 184, 166, 0.6)' : selectedClass ? 'rgba(20, 184, 166, 0.4)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (activeFilterTab !== 'class') e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={(e) => { if (activeFilterTab !== 'class') e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: activeFilterTab === 'class' || selectedClass ? '#5eead4' : 'rgba(255,255,255,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Category</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedClass || 'All Categories'}
                </p>
              </button>
              {/* Model tab */}
              <button
                onClick={() => setActiveFilterTab('model')}
                style={{
                  padding: '0.65rem 0.75rem',
                  background: selectedModel ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${selectedModel ? 'rgba(20, 184, 166, 0.4)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: selectedModel ? '#5eead4' : 'rgba(255,255,255,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Aircraft Model</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedModel || 'All Models'}
                </p>
              </button>
            </>
          )}
        </div>
      )}

      {/* Content for the active filter tab */}
      {activeFilterTab !== 'model' && (
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {activeFilterTab === 'manufacturer' ? 'Select Manufacturer' : 'Select Category'}
        </p>
      )}
      {activeFilterTab === 'model' && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Manufacturer Aircraft Previews
            </p>
            <button
              onClick={clearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <RotateCcw size={12} />
              Reset filters
            </button>
          </div>
          {selectedManufacturer ? (
            <ManufacturerAircraftCarousel
              manufacturerId={selectedManufacturer}
              manufacturerName={manufacturerById(selectedManufacturer)?.name}
              selectedId={selectedAircraftIds[selectedAircraftIds.length - 1]}
              previewedId={previewedAircraftId}
              onSelect={(aircraft) => {
                setPreviewedAircraftId(aircraft.id);
                setSelectedModel(aircraft.model);
              }}
            />
          ) : (
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '1.25rem 1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              Select a manufacturer above to see its aircraft carousel.
            </p>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}>
        {activeFilterTab === 'manufacturer' && filteredManufacturers.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setSelectedManufacturer(m.id);
              setSelectedClass('');
              setSelectedModel('');
              setSelectedAircraftIds([]);
              setPreviewedAircraftId('');
              setCategorySelected(false);
              setActiveFilterTab('class');
            }}
            style={{
              flex: '0 0 auto',
              position: 'relative',
              width: '160px',
              textAlign: 'left',
              background: 'rgba(255,255,255,0.08)',
              border: '2px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            onMouseOver={() => setHoveredManufacturer(m.id)}
            onMouseOut={() => setHoveredManufacturer(null)}
          >
            <div style={{ height: '90px', background: '#ffffff', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
              {m.logo ? (
                <img
                  src={m.logo}
                  alt={m.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', textAlign: 'center', lineHeight: 1.2 }}>{m.name.split(' ')[0].slice(0, 2).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div style={{ padding: '0.75rem' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{MANUFACTURER_SCOPE[m.id] || 'Aircraft Manufacturer'}</p>
            </div>
            {hoveredManufacturer === m.id && (
              <span style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0.35rem 0.6rem',
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 600,
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                {m.name}
              </span>
            )}
          </button>
        ))}
        {activeFilterTab === 'class' && (
          <>
            <button
              key="all-categories"
              onClick={() => {
                setSelectedClass('');
                setSelectedModel('');
                setSelectedAircraftIds([]);
                setPreviewedAircraftId('');
                setCategorySelected(true);
                setActiveFilterTab('model');
              }}
              style={{
                flex: '0 0 auto',
                width: '140px',
                padding: '0.75rem',
                background: selectedClass === '' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${selectedClass === '' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => { if (selectedClass !== '') e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={(e) => { if (selectedClass !== '') e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedClass === '' ? '#ffffff' : 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>All</span>
            </button>
            {filteredClassOptions.map((cls) => (
              <button
                key={cls}
                onClick={() => {
                  setSelectedClass(cls);
                  setSelectedModel('');
                  setSelectedAircraftIds([]);
                  setCategorySelected(true);
                  setActiveFilterTab('model');
                }}
                style={{
                  flex: '0 0 auto',
                  width: '140px',
                  padding: '0.75rem',
                  background: selectedClass === cls ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${selectedClass === cls ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => { if (selectedClass !== cls) e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={(e) => { if (selectedClass !== cls) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedClass === cls ? '#ffffff' : 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cls}</span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        transform: 'scale(0.6)',
        transformOrigin: 'top center',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
            <span style={{ color: '#ef4444' }}>Type Rating</span> Search
          </h2>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Main Preview — full image left, description + specs right */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            minHeight: selectedAircraft ? '420px' : '320px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.25)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          }}
        >
          {/* Left — Full Image */}
          <div style={{ flex: '0 0 50%', position: 'relative', minHeight: '320px', background: 'rgba(0,0,0,0.15)' }}>
            {!selectedManufacturer ? (
              <img
                src="/images/set-06-pathways/typeratingsearch.png"
                alt="Type Rating Search"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
            ) : showManufacturerPreview ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', inset: 0, gap: '1.5rem', background: '#ffffff' }}>
                {MANUFACTURER_LOGOS[selectedManufacturerData!.id] ? (
                  <img
                    src={MANUFACTURER_LOGOS[selectedManufacturerData!.id]}
                    alt={selectedManufacturerData!.name}
                    style={{ maxWidth: '220px', maxHeight: '120px', objectFit: 'contain' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <Plane size={64} style={{ color: 'rgba(0,0,0,0.2)' }} />
                )}
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', letterSpacing: '0.12em', textTransform: 'uppercase' }}>MANUFACTURER</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{selectedManufacturerData!.name}</p>
                </div>
              </div>
            ) : selectedAircraft?.image ? (
              <img
                src={selectedAircraft.image}
                alt={selectedAircraft.model}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', inset: 0 }}>
                <Plane size={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>
            )}
            {/* Gradient transition into right panel */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 55%, rgba(15, 23, 42, 0.6) 100%)', pointerEvents: 'none' }} />
          </div>

          {/* Right — Description + Specs */}
          <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', background: 'rgba(15, 23, 42, 0.6)' }}>
            {/* Description */}
            <div style={{ padding: '1.5rem', flex: '0 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {!selectedManufacturer ? (
                <>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', letterSpacing: '0.12em', textTransform: 'uppercase' }}>TYPE RATING</span>
                    <h3 style={{ margin: '0.15rem 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>SEARCH</h3>
                  </div>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                    Select a manufacturer to query your type rating from our database of <strong style={{ color: '#ffffff' }}>40,000+ aircraft</strong>. Learn the requirements, expectations, and career pathways for every rating.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <span style={{ padding: '0.25rem 0.55rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid rgba(239, 68, 68, 0.25)' }}>100,000+ Photos</span>
                    <span style={{ padding: '0.25rem 0.55rem', borderRadius: '6px', background: 'rgba(20, 184, 166, 0.15)', color: '#5eead4', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid rgba(20, 184, 166, 0.25)' }}>3D Models</span>
                    <span style={{ padding: '0.25rem 0.55rem', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#7dd3fc', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid rgba(56, 189, 248, 0.25)' }}>POH & Manuals</span>
                    <span style={{ padding: '0.25rem 0.55rem', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#c4b5fd', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', border: '1px solid rgba(168, 85, 247, 0.25)' }}>Checklists</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                    Out-of-the-factory, airline, and professional aircraft photography alongside operating manuals, specifications, and procedural checklists for every aircraft in our library.
                  </p>
                  <a
                    href="https://pilotcareerpathways.com/type-rating-search"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0',
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      alignSelf: 'flex-start',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
                  >
                    Visit Pilot Career Pathways →
                  </a>
                </>
              ) : showManufacturerPreview && selectedManufacturerData ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Manufacturer
                    </p>
                    {MANUFACTURER_LOGOS[selectedManufacturerData.id] ? (
                      <img
                        src={MANUFACTURER_LOGOS[selectedManufacturerData.id]}
                        alt={selectedManufacturerData.name}
                        style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255,255,255,0.9)', padding: '3px' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : null}
                  </div>
                  <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
                    {selectedManufacturerData.name}
                  </h3>
                  {selectedManufacturerData.description && (
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {selectedManufacturerData.description}
                    </p>
                  )}
                  <button
                    onClick={() => setIsManufacturerModalOpen(true)}
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
                    Learn more about manufacturer →
                  </button>
                </>
              ) : selectedAircraft ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {manufacturerById(selectedAircraft.manufacturer_id)?.name || selectedAircraft.manufacturer_id}
                    </p>
                    {selectedManufacturer && manufacturerById(selectedManufacturer)?.logo ? (
                      <img
                        src={manufacturerById(selectedManufacturer)!.logo}
                        alt={manufacturerById(selectedManufacturer)?.name}
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
                        {selectedAircraft.category}
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
                    {selectedAircraft.model}
                  </h3>
                  {selectedAircraft.description && (
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {selectedAircraft.description}
                    </p>
                  )}
                  <button
                    onClick={() => setIsModalOpen(true)}
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
                </>
              ) : null}
            </div>

            {/* Specs Panel */}
            <div style={{ flex: '0 0 auto', padding: '1.25rem 1.5rem', background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!selectedManufacturer ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Select a manufacturer above to explore aircraft type ratings.</p>
                </div>
              ) : showManufacturerPreview && selectedManufacturerData ? (
                <>
                  {/* Manufacturer stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Founded</p>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{selectedManufacturerData.founded}</p>
                    </div>
                    <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Aircraft Built</p>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: '#5eead4', lineHeight: 1.3 }}>{selectedManufacturerData.totalAircraftCount.toLocaleString()}+</p>
                    </div>
                    <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pilots Rated</p>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', lineHeight: 1.3 }}>{getManufacturerPilotCount(selectedManufacturerData.id).current.toLocaleString()}</p>
                    </div>
                  </div>
                  <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                    <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Headquarters</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>{selectedManufacturerData.headquarters}</p>
                  </div>
                </>
              ) : selectedAircraft ? (
                <>
                  {/* Stats row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pilots rated</p>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{selectedAircraft.id === 'supernal-sa-1' || selectedAircraft.id === 'b777x' ? '0' : selectedAircraft.id === 'b777-300er' ? '38,000 – 45,000' : selectedAircraft.id === 'b787' ? '48,000 – 55,000' : selectedAircraft.id === 'b767-300er' ? '15,000 – 18,000' : selectedAircraft.id === 'b737-ng' ? '110,000 – 130,000' : selectedAircraft.id === 'b757' ? '14,000 – 17,000' : selectedAircraft.id === 'b717' ? '1,200 – 1,500' : selectedAircraft.id === 'b727' ? '300 – 500' : selectedAircraft.id === 'b747-8f' ? '3,500 – 4,500' : getPilotCount(selectedAircraft.model).toLocaleString()}</p>
                    </div>
                    <div style={{ padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Status</p>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', fontWeight: 700, color: '#5eead4', lineHeight: 1.3 }}>{getAircraftStatus(selectedAircraft)}</p>
                    </div>
                  </div>

                  {/* Type rating center select */}
                  <div>
                    <p style={{ margin: '0 0 0.4rem', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Type rating center</p>
                    <select
                      value={selectedRatingCenters[selectedAircraft.id] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedRatingCenters(prev => ({ ...prev, [selectedAircraft.id]: value }));
                      }}
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
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Select an aircraft to view type rating specifications.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

            {/* Search Bar */}
      <div ref={searchContainerRef} style={{ position: 'relative', marginBottom: '1rem', zIndex: 40 }}>
        {previewedAircraft && !selectedAircraftIds.includes(previewedAircraft.id) ? (
          <button
            onClick={() => {
              setSelectedAircraftIds(prev =>
                prev.includes(previewedAircraft.id)
                  ? prev
                  : [...prev, previewedAircraft.id]
              );
              setPreviewedAircraftId('');
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.01)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Plus size={18} />
            Select {previewedAircraft.model}
          </button>
        ) : (
          <>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(255,255,255,0.5)', zIndex: 2 }} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && selectedAircraftIds.length > 0) handleConfirm(); }}
              placeholder={activeFilterTab === 'manufacturer' ? (manufacturerScopeFilter ? `${manufacturerScopeFilter} — Search manufacturers...` : 'Search manufacturers...') : activeFilterTab === 'model' ? 'Search aircraft models...' : 'Search categories...'}
              style={{
                width: '100%',
                padding: selectedAircraftIds.length > 0 ? '0.75rem 9rem 0.75rem 2.5rem' : '0.75rem 1rem 0.75rem 2.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative',
                zIndex: 1,
              }}
              onFocusCapture={(e) => { e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.6)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            />
            {selectedAircraftIds.length > 0 && (
              <button
                onClick={handleConfirm}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)',
                  zIndex: 2,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
              >
                Save
              </button>
            )}
          </>
        )}
      </div>

      {/* Selected Aircraft Pills */}
      {selectedAircrafts.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', padding: '0 0.25rem' }}>
          {selectedAircrafts.map((aircraft) => (
            <div
              key={aircraft.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.65rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '9999px',
                color: '#fca5a5',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'default',
              }}
            >
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.02em' }}>{aircraft.model}</span>
              <button
                onClick={() => {
                  setSelectedAircraftIds(prev => prev.filter(id => id !== aircraft.id));
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                  padding: 0,
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#fca5a5',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Inline Filters */}
      {inlineFilters}

      {/* Manufacturer Details Modal */}
      {isManufacturerModalOpen && selectedManufacturerData && createPortal(
        <div
          onClick={() => setIsManufacturerModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '700px',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'rgba(15, 23, 42, 0.95)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 32px 100px rgba(0,0,0,0.6)',
            }}
          >
            {/* Modal header */}
            <div style={{ position: 'relative', height: '220px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px 24px 0 0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {MANUFACTURER_LOGOS[selectedManufacturerData.id] ? (
                <img
                  src={MANUFACTURER_LOGOS[selectedManufacturerData.id]}
                  alt={selectedManufacturerData.name}
                  style={{ maxWidth: '200px', maxHeight: '120px', objectFit: 'contain', filter: 'brightness(1.2)' }}
                />
              ) : (
                <Plane size={64} style={{ color: 'rgba(255,255,255,0.3)' }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 35%, rgba(15, 23, 42, 0.95) 100%)', pointerEvents: 'none' }} />
              <button
                onClick={() => setIsManufacturerModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{selectedManufacturerData.name}</h2>
                <span style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(20, 184, 166, 0.15)', color: '#5eead4', fontSize: '0.75rem', fontWeight: 700 }}>
                  Est. {selectedManufacturerData.founded}
                </span>
              </div>

              <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                {selectedManufacturerData.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Headquarters</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{selectedManufacturerData.headquarters}</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Aircraft</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{selectedManufacturerData.totalAircraftCount.toLocaleString()}+</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reputation</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>{selectedManufacturerData.reputationScore}/10</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Website</p>
                  <a href={selectedManufacturerData.website} target="_blank" rel="noopener noreferrer" style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', textDecoration: 'none' }}>{selectedManufacturerData.website.replace('https://', '')}</a>
                </div>
              </div>

              {selectedManufacturerData.why_choose_rating && (
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Why Choose {selectedManufacturerData.name}?</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{selectedManufacturerData.why_choose_rating}</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Aircraft Details Modal */}
      {isModalOpen && selectedAircraft && createPortal(
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '960px',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: 'rgba(15, 23, 42, 0.98)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 32px 100px rgba(0,0,0,0.6)',
            }}
          >
            {/* Modal header image */}
            <div style={{ position: 'relative', height: '340px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
              {selectedAircraft.image ? (
                <img
                  src={selectedAircraft.image}
                  alt={selectedAircraft.model}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80'; }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plane size={72} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 35%, rgba(15, 23, 42, 0.95) 100%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.6) 0%, transparent 50%)', pointerEvents: 'none' }} />
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  color: '#ffffff',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              >
                <X size={20} />
              </button>
      
              {/* Header content overlay */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#7dd3fc',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                  }}>
                    {selectedAircraft.category}
                  </span>
                  {selectedAircraft.demandLevel && (
                    <span style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      background: selectedAircraft.demandLevel === 'high' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: selectedAircraft.demandLevel === 'high' ? '#6ee7b7' : '#fcd34d',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      border: '1px solid ' + (selectedAircraft.demandLevel === 'high' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'),
                    }}>
                      Demand: {selectedAircraft.demandLevel === 'high' ? 'High' : 'Low'}
                    </span>
                  )}
                  {selectedAircraft.lifecycle_stage && (
                    <span style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      background: selectedAircraft.lifecycle_stage === 'early-career' ? 'rgba(16, 185, 129, 0.2)' : selectedAircraft.lifecycle_stage === 'mid-career' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: selectedAircraft.lifecycle_stage === 'early-career' ? '#6ee7b7' : selectedAircraft.lifecycle_stage === 'mid-career' ? '#fcd34d' : '#fca5a5',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      border: '1px solid ' + (selectedAircraft.lifecycle_stage === 'early-career' ? 'rgba(16, 185, 129, 0.35)' : selectedAircraft.lifecycle_stage === 'mid-career' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(239, 68, 68, 0.35)'),
                    }}>
                      Lifecycle: {selectedAircraft.lifecycle_stage === 'early-career' ? 'Early Career' : selectedAircraft.lifecycle_stage === 'mid-career' ? 'Mid Career' : 'End of Life'}
                    </span>
                  )}
                </div>
                <h2 style={{ margin: '0 0 0.5rem', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>
                  {selectedAircraft.model}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 600 }}>
                    <img src={manufacturerById(selectedAircraft.manufacturer_id)?.logo || '/images/set-01-logos/logo.png'} alt="" style={{ height: '18px', objectFit: 'contain' }} />
                    {manufacturerById(selectedAircraft.manufacturer_id)?.name || selectedAircraft.manufacturer_id}
                  </span>
                  {selectedAircraft.careerScore !== undefined && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: '9999px', background: 'rgba(14, 165, 233, 0.15)', color: '#7dd3fc', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                      <Star size={14} style={{ fill: '#facc15', color: '#facc15' }} />
                      Career Score: {selectedAircraft.careerScore}/100
                    </span>
                  )}
                </div>
              </div>
            </div>
      
            {/* Info bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', padding: '1.25rem 2rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Manufacturer</p>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{manufacturerById(selectedAircraft.manufacturer_id)?.name || selectedAircraft.manufacturer_id}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>First Flight</p>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{selectedAircraft.first_flight || 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Age</p>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{getAircraftAge(selectedAircraft.first_flight) !== null ? getAircraftAge(selectedAircraft.first_flight) + ' years' : 'N/A'}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Category</p>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textTransform: 'capitalize' }}>{selectedAircraft.category}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Reputation</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={14} style={{ color: '#facc15', fill: '#facc15' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{manufacturerById(selectedAircraft.manufacturer_id)?.reputationScore || 0}</span>
                </div>
              </div>
              {selectedAircraft.operator_count !== undefined && (
                <div>
                  <p style={{ margin: '0 0 0.2rem', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Operators</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{selectedAircraft.operator_count.toLocaleString()}+</p>
                </div>
              )}
            </div>
      
            {/* Tab Navigation */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
                {['Overview', 'Training', 'Hiring', 'Compensation', 'Comparison'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveModalTab(tab)}
                    style={{
                      padding: '1rem 1.25rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      border: 'none',
                      borderBottom: '2px solid ' + (activeModalTab === tab ? '#38bdf8' : 'transparent'),
                      color: activeModalTab === tab ? '#38bdf8' : 'rgba(255,255,255,0.55)',
                      background: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { if (activeModalTab !== tab) e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                    onMouseLeave={(e) => { if (activeModalTab !== tab) e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
      
            {/* Tab Content */}
            <div style={{ padding: '1.5rem 2rem' }}>
              {activeModalTab === 'Overview' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={18} style={{ color: '#38bdf8' }} />
                        Description
                      </h3>
                      <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                        {selectedAircraft.description || 'No description available.'}
                      </p>
                      {selectedAircraft.why_choose_rating && (
                        <>
                          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Award size={18} style={{ color: '#38bdf8' }} />
                            Why Choose This Rating?
                          </h3>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                            {selectedAircraft.why_choose_rating}
                          </p>
                        </>
                      )}
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Gauge size={18} style={{ color: '#38bdf8' }} />
                        Technical Specifications
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {selectedAircraft.specifications && Object.entries(selectedAircraft.specifications).map(([key, value]) => (
                          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', textAlign: 'right' }}>{String(value)}</span>
                          </div>
                        ))}
                        {!selectedAircraft.specifications && (
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Specifications not available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedAircraft.news && selectedAircraft.news.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Latest News</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {selectedAircraft.news.map((news) => (
                          <div key={news.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                            <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{news.title}</h4>
                            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{news.summary}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              <a href={news.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>Read more →</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
      
              {activeModalTab === 'Training' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={18} style={{ color: '#38bdf8' }} />
                        Training Requirements
                      </h3>
                      {selectedAircraft.training_requirements ? (
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                            <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                            Minimum Hours: {selectedAircraft.training_requirements.minimum_hours}
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                            <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                            Licenses: {selectedAircraft.training_requirements.required_licenses.join(', ')}
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                            <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                            Medical: {selectedAircraft.training_requirements.medical_certificate}
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                            <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                            English: {selectedAircraft.training_requirements.english_proficiency}
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                            <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                            Ground School: {selectedAircraft.training_requirements.ground_school_hours} hrs
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                            <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                            Simulator: {selectedAircraft.training_requirements.simulator_hours} hrs
                          </li>
                          <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                            <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                            Flight: {selectedAircraft.training_requirements.flight_hours} hrs
                          </li>
                        </ul>
                      ) : (
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Training requirements not available.</p>
                      )}
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={18} style={{ color: '#38bdf8' }} />
                        Training Curriculum
                      </h3>
                      {selectedAircraft.training_curriculum && selectedAircraft.training_curriculum.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {selectedAircraft.training_curriculum.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>{item.phase}</span>
                              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>{item.duration}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Curriculum details not available.</p>
                      )}
      
                      {selectedAircraft.simulator_details && (
                        <>
                          <h3 style={{ margin: '1.5rem 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Gauge size={18} style={{ color: '#38bdf8' }} />
                            Simulator Training
                          </h3>
                          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                            <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simulator Type</p>
                            <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>{selectedAircraft.simulator_details.type}</p>
                            <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Features</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{selectedAircraft.simulator_details.features}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
      
              {activeModalTab === 'Hiring' && (
                <div>
                  <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={18} style={{ color: '#38bdf8' }} />
                    Hiring & Career Outlook
                  </h3>
                  {selectedAircraft.career_info ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Job Market</h4>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{selectedAircraft.career_info.job_market}</p>
                        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Growth Prospects</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{selectedAircraft.career_info.growth_prospects}</p>
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>Airlines Using This Type</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {selectedAircraft.career_info.airlines_using?.map((emp, i) => (
                            <span key={i} style={{ padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#ffffff', fontSize: '0.75rem', fontWeight: 600 }}>{emp}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>
                        Detailed hiring requirements for this aircraft are not yet available. Check with major operators and training centers for current opportunities.
                      </p>
                    </div>
                  )}
                </div>
              )}
      
              {activeModalTab === 'Compensation' && (
                <div>
                  <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign size={18} style={{ color: '#38bdf8' }} />
                    Compensation & Salary
                  </h3>
                  {selectedAircraft.career_info?.average_salary ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                        <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Typical Salary Range</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{selectedAircraft.career_info.average_salary}</p>
                      </div>
                      <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                        <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demand Level</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: selectedAircraft.demandLevel === 'high' ? '#6ee7b7' : '#fcd34d' }}>
                          {selectedAircraft.demandLevel === 'high' ? 'High' : selectedAircraft.demandLevel === 'low' ? 'Low' : 'Medium'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>
                        Compensation data is not yet available for this aircraft. Salaries vary by region, operator, and experience level.
                      </p>
                    </div>
                  )}
                </div>
              )}
      
              {activeModalTab === 'Comparison' && (
                <div>
                  <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} style={{ color: '#38bdf8' }} />
                    Comparison & Commonality
                  </h3>
                  <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                      {selectedAircraft.why_choose_rating
                        ? `The ${selectedAircraft.model} shares common type rating paths with related aircraft in the ${manufacturerById(selectedAircraft.manufacturer_id)?.name || selectedAircraft.manufacturer_id} family. Pilots holding this rating often benefit from cross-crew qualification (CCQ) opportunities and fleet commonality.`
                        : `Commonality and comparison data for the ${selectedAircraft.model} is being compiled. Contact training centers for differences training options.`}
                    </p>
                    {selectedAircraft.operator_count !== undefined && selectedAircraft.pilot_count !== undefined && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                          <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operators</p>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{selectedAircraft.operator_count.toLocaleString()}+</p>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                          <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pilots Rated</p>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{selectedAircraft.id === 'supernal-sa-1' || selectedAircraft.id === 'b777x' ? '0' : selectedAircraft.id === 'b777-300er' ? '38,000 – 45,000' : selectedAircraft.id === 'b787' ? '48,000 – 55,000' : selectedAircraft.id === 'b767-300er' ? '15,000 – 18,000' : selectedAircraft.id === 'b737-ng' ? '110,000 – 130,000' : selectedAircraft.id === 'b757' ? '14,000 – 17,000' : selectedAircraft.id === 'b717' ? '1,200 – 1,500' : selectedAircraft.id === 'b727' ? '300 – 500' : selectedAircraft.id === 'b747-8f' ? '3,500 – 4,500' : selectedAircraft.pilot_count.toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
      
            {/* Footer actions */}
            <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 0.4rem', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Type rating center</p>
                <select
                  value={selectedRatingCenters[selectedAircraft.id] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedRatingCenters(prev => ({ ...prev, [selectedAircraft.id]: value }));
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
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
              <button
                onClick={() => {
                  setSelectedAircraftIds(prev =>
                    prev.includes(selectedAircraft.id)
                      ? prev
                      : [...prev, selectedAircraft.id]
                  );
                  setIsModalOpen(false);
                }}
                style={{
                  padding: '0.85rem 2rem',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.35)',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Plus size={20} />
                Select {selectedAircraft.model}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </motion.section>
  );
};

export default AircraftRatingsSearch;
