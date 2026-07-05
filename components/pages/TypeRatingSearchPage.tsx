import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Plane, CheckCircle2, Star, DollarSign, Calendar, FileText, Gauge, Building2, BookOpen, MousePointerClick, Briefcase, X, Globe, Users, User, Clock, Award, Shield, ArrowLeft, Bookmark } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { BookmarkService } from '@/services/bookmarkService';
import { PathwaysSidebar } from '@/components/website/components/pilot-recognition/PathwaysSidebar';
import { PlatformNavbar } from '@/components/website/components/PlatformNavbar';
import { ManufacturerPreviewCard } from '@/components/website/components/pilot-recognition/ManufacturerPreviewCard';
import { AircraftPreviewCard } from '@/components/website/components/pilot-recognition/AircraftPreviewCard';
import { ManufacturerAircraftCarousel } from '@/components/website/components/pilot-recognition/ManufacturerAircraftCarousel';
import { safeRedirect } from '@/lib/url-validator';
import {
  manufacturers as rawManufacturers,
  aircraftTypeRatings as rawAircraftTypeRatings,
} from '@/data/aircraft-manufacturers';

// Types from D1 schema
interface Manufacturer {
  id: string;
  name: string;
  logo: string;
  hero_image?: string;
  description?: string;
  founded?: number;
  headquarters?: string;
  website?: string;
  reputation_score?: number;
  total_aircraft_count?: number;
  hero_stats?: any;
  rating_estimates?: any;
}

interface AircraftTypeRating {
  id: string;
  model: string;
  manufacturer_id: string;
  category: string;
  subcategory?: string;
  image?: string;
  sketchfab_id?: string;
  description?: string;
  conditionally_new?: 'green' | 'amber' | 'red';
  first_flight?: string | number;
  why_choose_rating?: string;
  specifications?: any;
  news?: any;
  training_requirements?: any;
  hiring_requirements?: any;
  compensation_data?: any;
  comparison_data?: any;
  show_career_outlook?: boolean;
  extended_info_content?: any;
  demandLevel?: 'none' | 'high' | 'medium' | 'low';
  lifecycleStage?: 'early-career' | 'mid-career' | 'mature' | 'retiring';
  orderBacklog?: { orders: number; delivered: number };
  operatorCount?: number;
  pilotCount?: number;
}

// Manufacturer logo mapping — categorized in /images/manufacturer-logos/<category>/
const MANUFACTURER_LOGOS: Record<string, string> = {
  airbus: '/images/manufacturer-logos/commercial-jets/airbus-logo.png',
  boeing: '/images/manufacturer-logos/commercial-jets/boeing-logo.png',
  atr: '/images/manufacturer-logos/regional-aircraft/atr-logo.png',
  embraer: '/images/manufacturer-logos/regional-aircraft/embraer-logo.svg',
  bombardier: '/images/manufacturer-logos/regional-aircraft/bombardier-logo.svg',
  gulfstream: '/images/manufacturer-logos/business-private-jets/gulfstream-logo.webp',
  cessna: '/images/manufacturer-logos/business-private-jets/cessna-logo.png',
  'dassault-falcon': '/images/manufacturer-logos/business-private-jets/dassault-logo.png',
  pilatus: '/images/manufacturer-logos/business-private-jets/pilatus-logo.svg',
  beechcraft: '/images/manufacturer-logos/business-private-jets/beechcraft-logo.png',
  sikorsky: '/images/manufacturer-logos/helicopters/sikorsky-logo.png',
  leonardo: '/images/manufacturer-logos/helicopters/leonardo-logo.png',
  'de-havilland': '/images/manufacturer-logos/regional-aircraft/de-havilland-logo.png',
  'mitsubishi-mrj': '/images/manufacturer-logos/regional-aircraft/mitsubishi-logo.svg',
  'comac-c919': '/images/manufacturer-logos/commercial-jets/comac-logo.jpg',
  tecnam: '/images/manufacturer-logos/general-aviation/tecnam-logo.png',
  piper: '/images/manufacturer-logos/general-aviation/piper-logo.svg',
  cirrus: '/images/manufacturer-logos/general-aviation/cirrus-logo.png',
  let: '/images/manufacturer-logos/regional-aircraft/let-logo.svg',
  aeroprakt: '/images/manufacturer-logos/general-aviation/aeroprakt-logo.png',
  antonov: '/images/manufacturer-logos/military-defense/antonov-logo.png',
  ilyushin: '/images/manufacturer-logos/military-defense/ilyushin-logo.png',
  'hindustan-aeronautics': '/images/manufacturer-logos/military-defense/hindustan-logo.jpg',
  dornier: '/images/manufacturer-logos/military-defense/dornier-logo.svg',
  archer: '/images/manufacturer-logos/evtol-uam/archer-logo.svg',
  joby: '/images/manufacturer-logos/evtol-uam/joby-logo.jpg',
  mlg: '/images/manufacturer-logos/other/mlg-logo.jpg',
  bell: '/images/manufacturer-logos/helicopters/bell-logo.svg',
  ehang: '/images/manufacturer-logos/evtol-uam/ehang-logo.jpg',
  raytheon: '/images/manufacturer-logos/military-defense/raytheon-logo.svg',
  lilium: '/images/manufacturer-logos/evtol-uam/lilium-logo.png',
  wisk: '/images/manufacturer-logos/evtol-uam/wisk-logo.jpg',
  beta: '/images/manufacturer-logos/evtol-uam/beta-logo.png',
  autoflight: '/images/manufacturer-logos/evtol-uam/autoflight-logo.jpg',
  eve: '/images/manufacturer-logos/evtol-uam/eve-logo.jpg',
  mooney: '/images/manufacturer-logos/general-aviation/mooney-logo.png',
  pipistrel: '/images/manufacturer-logos/general-aviation/pipistrel-logo.png',
  aviat: '/images/manufacturer-logos/general-aviation/aviat-logo.png',
  'american-champion': '/images/manufacturer-logos/general-aviation/american-champion-logo.png',
  sling: '/images/manufacturer-logos/general-aviation/sling-logo.png',
  epic: '/images/manufacturer-logos/business-private-jets/epic-logo.jpg',
  socata: '/images/manufacturer-logos/business-private-jets/socata-logo.png',
  hondajet: '/images/manufacturer-logos/business-private-jets/hondajet-logo.png',
  airtractor: '/images/manufacturer-logos/agricultural-utility/airtractor-logo.svg',
  thrush: '/images/manufacturer-logos/agricultural-utility/thrush-logo.jpg',
  elixir: '/images/manufacturer-logos/general-aviation/elixir-logo.webp',
  icon: '/images/manufacturer-logos/general-aviation/icon-logo.jpg',
  waco: '/images/manufacturer-logos/general-aviation/waco-logo.png',
  vulcanair: '/images/manufacturer-logos/general-aviation/vulcanair-logo.png',
  mahindra: '/images/manufacturer-logos/general-aviation/mahindra-logo.png',
  'twin-commander': '/images/manufacturer-logos/business-private-jets/twin-commander-logo.png',
  'britten-norman': '/images/manufacturer-logos/general-aviation/britten-norman-logo.png',
  evektor: '/images/manufacturer-logos/general-aviation/evektor-logo.jpg',
  bristell: '/images/manufacturer-logos/general-aviation/bristell-logo.png',
  velocity: '/images/manufacturer-logos/general-aviation/velocity-logo.png',
  quest: '/images/manufacturer-logos/general-aviation/quest-logo.png',
  'pacific-aerospace': '/images/manufacturer-logos/general-aviation/pacific-aerospace-logo.jpg',
  'aero-east-europe': '/images/manufacturer-logos/general-aviation/aero-east-europe-logo.png',
  jmb: '/images/manufacturer-logos/general-aviation/jmb-logo.png',
  foxcon: '/images/manufacturer-logos/general-aviation/foxcon-logo.jpg',
  grob: '/images/manufacturer-logos/general-aviation/grob-logo.jpg',
  'elroy-air': '/images/manufacturer-logos/autonomous-cargo/elroy-air-logo.jpg',
  pyka: '/images/manufacturer-logos/autonomous-cargo/pyka-logo.jpg',
  sabrewing: '/images/manufacturer-logos/autonomous-cargo/sabrewing-logo.jpg',
  fugro: '/images/manufacturer-logos/survey-utility/fugro-logo.svg',
  supernal: '/images/manufacturer-logos/evtol-uam/supernal-logo.jpg',
  'regent-craft': '/images/manufacturer-logos/evtol-uam/regent-craft-logo.png',
};

// Map hardcoded data file manufacturers to component interface
const HARDCODED_MANUFACTURERS: Manufacturer[] = rawManufacturers.map(m => ({
  id: m.id,
  name: m.name,
  logo: MANUFACTURER_LOGOS[m.id] || m.logo || '/images/set-01-logos/logo.png',
  hero_image: m.heroImage,
  description: m.description,
  founded: m.founded,
  headquarters: m.headquarters,
  website: m.website,
  reputation_score: m.reputationScore,
  total_aircraft_count: m.totalAircraftCount,
}));

// Map hardcoded data file aircraft to component interface
const HARDCODED_AIRCRAFT: AircraftTypeRating[] = rawAircraftTypeRatings.map(a => ({
  id: a.id,
  model: a.model,
  manufacturer_id: a.manufacturer_id,
  category: a.category,
  subcategory: a.subcategory,
  image: a.image,
  sketchfab_id: a.sketchfab_id,
  description: a.description,
  conditionally_new: a.conditionally_new as 'green' | 'amber' | 'red' | undefined,
  first_flight: String(a.first_flight),
  why_choose_rating: a.why_choose_rating,
  specifications: a.specifications,
  demandLevel: a.demandLevel === 'none' ? 'low' : a.demandLevel as 'high' | 'medium' | 'low',
  lifecycleStage: (a as any).lifecycle_stage as 'early-career' | 'mid-career' | 'mature' | 'retiring' | undefined,
  orderBacklog: (a as any).order_backlog,
  operatorCount: (a as any).operator_count,
  pilotCount: (a as any).pilot_count,
}));

// D1-backed aircraft (will be merged with hardcoded)
let d1Aircraft: AircraftTypeRating[] = [];

// Airlines by aircraft ID for detail panel — restored from old git history
const AIRCRAFT_AIRLINES: Record<string, { name: string; logo: string }[]> = {
  'airbus-a320': [
    { name: 'Philippine Airlines', logo: 'https://www.philippineairlines.com/content/dam/palportal/migration/files/historyandmilestonespalsstory/nutshell-copy.jpg' },
    { name: 'Cebu Pacific', logo: 'https://images.jgsummit.com.ph/2021/12/15/0f999ad31e634dc5a90ad0d350cbe86ddfc4eca3.jpg' },
    { name: 'IndiGo', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
    { name: 'easyJet', logo: 'https://www.cae.com/content/images/civil-aviation/_webp/easyJet_crew_.jpg_webp_40cd750bba9870f18aada2478b24840a.webp' },
  ],
  'boeing-737': [
    { name: 'Southwest Airlines', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Southwest_Airlines_logo_2014.svg/1200px-Southwest_Airlines_logo_2014.svg.png' },
    { name: 'Ryanair', logo: 'https://cdn.aviationa2z.com/wp-content/uploads/2024/01/image-25-1024x683.png' },
    { name: 'SkyWest', logo: 'https://www.thrustflight.com/wp-content/uploads/2022/11/skywest-airlines-2-768x512.jpg' },
  ],
  'tecnam-p2002': [
    { name: 'Flight Training Schools', logo: '/images/set-01-logos/logo.png' },
  ],
  'cessna-172': [
    { name: 'Flight Schools Worldwide', logo: '/images/set-01-logos/logo.png' },
  ],
  'cessna-152': [
    { name: 'Flight Schools Worldwide', logo: '/images/set-01-logos/logo.png' },
  ],
  'airbus-a350': [
    { name: 'Qatar Airways', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
    { name: 'Singapore Airlines', logo: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400&q=80' },
    { name: 'Cathay Pacific', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
    { name: 'Finnair', logo: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400&q=80' },
  ],
  'airbus-a380': [
    { name: 'Emirates', logo: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/emirates.jpg' },
    { name: 'Singapore Airlines', logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80' },
    { name: 'Qantas', logo: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400&q=80' },
    { name: 'British Airways', logo: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/british-airways.jpg' },
  ],
  'atr-72': [
    { name: 'Cebu Pacific', logo: 'https://images.jgsummit.com.ph/2021/12/15/0f999ad31e634dc5a90ad0d350cbe86ddfc4eca3.jpg' },
    { name: 'Philippine Airlines', logo: 'https://www.philippineairlines.com/content/dam/palportal/migration/files/historyandmilestonespalsstory/nutshell-copy.jpg' },
  ],
};

// Career Score Calculation Function
function calculateCareerScore(aircraft: AircraftTypeRating, pilotProfile?: {
  totalFlightHours?: number;
  licenses?: string[];
  recognitionScore?: number;
  experienceLevel?: string;
  technicalSkillsScore?: number;
  interviewScore?: number;
  examinationScore?: number;
}): number {
  let score = 0;
  const maxScore = 100;

  // === Aircraft-Based Scoring (60 points) ===

  // Demand Level (15 points)
  if (aircraft.demandLevel === 'high') score += 15;
  else if (aircraft.demandLevel === 'low') score += 6;
  else score += 0;

  // Lifecycle Stage (12 points)
  if (aircraft.lifecycleStage === 'early-career') score += 12;
  else if (aircraft.lifecycleStage === 'mid-career') score += 6;
  else score += 0;

  // Order Backlog Ratio (12 points) - orders/delivered
  if (aircraft.orderBacklog) {
    const ratio = aircraft.orderBacklog.orders / (aircraft.orderBacklog.delivered || 1);
    if (ratio >= 2) score += 12;
    else if (ratio >= 1.5) score += 9;
    else if (ratio >= 1) score += 6;
    else score += 3;
  }

  // Operator Count (9 points) - more operators = more opportunities
  if (aircraft.operatorCount) {
    if (aircraft.operatorCount >= 30) score += 9;
    else if (aircraft.operatorCount >= 20) score += 7;
    else if (aircraft.operatorCount >= 10) score += 5;
    else score += 2;
  }

  // Pilot Count vs Demand (12 points) - fewer pilots with rating = higher score
  if (aircraft.pilotCount && aircraft.operatorCount) {
    const pilotsPerOperator = aircraft.pilotCount / aircraft.operatorCount;
    if (pilotsPerOperator <= 100) score += 12;
    else if (pilotsPerOperator <= 200) score += 9;
    else if (pilotsPerOperator <= 300) score += 6;
    else score += 3;
  } else if (!aircraft.pilotCount) {
    score += 6;
  }

  // === Pilot Profile-Based Scoring (40 points) ===

  if (pilotProfile) {
    // Total Flight Hours (12 points)
    if (pilotProfile.totalFlightHours) {
      if (pilotProfile.totalFlightHours >= 5000) score += 12;
      else if (pilotProfile.totalFlightHours >= 3000) score += 9;
      else if (pilotProfile.totalFlightHours >= 1500) score += 6;
      else if (pilotProfile.totalFlightHours >= 500) score += 3;
      else score += 1;
    }

    // Number of Licenses (8 points)
    if (pilotProfile.licenses) {
      if (pilotProfile.licenses.length >= 5) score += 8;
      else if (pilotProfile.licenses.length >= 3) score += 6;
      else if (pilotProfile.licenses.length >= 2) score += 4;
      else if (pilotProfile.licenses.length >= 1) score += 2;
    }

    // Recognition Score (10 points)
    if (pilotProfile.recognitionScore) {
      if (pilotProfile.recognitionScore >= 80) score += 10;
      else if (pilotProfile.recognitionScore >= 60) score += 8;
      else if (pilotProfile.recognitionScore >= 40) score += 5;
      else if (pilotProfile.recognitionScore >= 20) score += 3;
      else score += 1;
    }

    // Experience Level (5 points)
    if (pilotProfile.experienceLevel) {
      if (pilotProfile.experienceLevel === 'senior' || pilotProfile.experienceLevel === 'captain') score += 5;
      else if (pilotProfile.experienceLevel === 'mid-level' || pilotProfile.experienceLevel === 'first-officer') score += 3;
      else if (pilotProfile.experienceLevel === 'junior') score += 1;
    }

    // Technical Skills Score (5 points)
    if (pilotProfile.technicalSkillsScore) {
      if (pilotProfile.technicalSkillsScore >= 80) score += 5;
      else if (pilotProfile.technicalSkillsScore >= 60) score += 3;
      else if (pilotProfile.technicalSkillsScore >= 40) score += 1;
    }
  }

  return Math.min(score, maxScore);
}

// Cache for fetched thumbnail URLs
const thumbnailCache: Record<string, string> = {};

function SketchfabThumbnail({
  sketchfabId,
  alt,
  className,
  onError,
}: {
  sketchfabId: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}) {
  const [src, setSrc] = useState<string | null>(thumbnailCache[sketchfabId] || null);
  const [loading, setLoading] = useState(!thumbnailCache[sketchfabId]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (thumbnailCache[sketchfabId]) {
      setSrc(thumbnailCache[sketchfabId]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    let cancelled = false;
    fetch(`https://api.sketchfab.com/v3/models/${sketchfabId}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const images: any[] = data?.thumbnails?.images || [];
        const best = images.sort((a, b) => (b.width || 0) - (a.width || 0))[0];
        if (best?.url) {
          thumbnailCache[sketchfabId] = best.url;
          setSrc(best.url);
          setLoading(false);
        } else {
          setFailed(true);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) { setFailed(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [sketchfabId]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-200 animate-pulse`}>
        <Plane className="w-8 h-8 text-slate-400" />
      </div>
    );
  }

  if (failed || !src) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100`}>
        <Plane className="w-10 h-10 text-slate-400" />
      </div>
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

type Category = 'all' | 'commercial' | 'private' | 'cargo' | 'regional' | 'helicopter' | 'military' | 'legacy' | 'flagship';

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

const CATEGORY_COLORS: Record<string, string> = {
  'commercial': 'bg-blue-500',
  'private': 'bg-emerald-500',
  'cargo': 'bg-purple-500',
  'regional': 'bg-sky-500',
  'helicopter': 'bg-teal-500',
  'military': 'bg-rose-500',
  'legacy': 'bg-slate-500',
  'flagship': 'bg-amber-500',
};

const LEGACY_SUBCATEGORY_LABELS: Record<string, string> = {
  'retired': 'Retired',
  'reaching-end-of-service': 'Reaching End of Service',
  'historical': 'Historical',
};

const LEGACY_SUBCATEGORY_COLORS: Record<string, string> = {
  'retired': 'bg-slate-600',
  'reaching-end-of-service': 'bg-orange-500',
  'historical': 'bg-amber-600',
};

const HELICOPTER_SUBCATEGORY_LABELS: Record<string, string> = {
  'light-single-engine': 'Light Single-Engine',
  'light-twin-engine': 'Light Twin-Engine',
  'medium-twin-engine': 'Medium Twin-Engine',
  'heavy-twin-engine': 'Heavy Twin-Engine',
  'evtol': 'eVTOL',
  'drone-helicopter': 'Drone',
};

const HELICOPTER_SUBCATEGORY_COLORS: Record<string, string> = {
  'light-single-engine': 'bg-sky-500',
  'light-twin-engine': 'bg-blue-500',
  'medium-twin-engine': 'bg-indigo-500',
  'heavy-twin-engine': 'bg-purple-500',
  'evtol': 'bg-emerald-500',
  'drone-helicopter': 'bg-teal-500',
};

const MILITARY_SUBCATEGORY_LABELS: Record<string, string> = {
  'transport-tanker': 'Transport & Tanker',
  'tactical-transport': 'Tactical Transport',
  'combat-stealth': 'Combat & Stealth',
  'attack-tactical-helicopter': 'Attack/Tactical Heli',
  'utility-helicopter': 'Utility/Scout Heli',
  'surveillance-uas': 'Surveillance & UAS',
};

const MILITARY_SUBCATEGORY_COLORS: Record<string, string> = {
  'transport-tanker': 'bg-slate-700',
  'tactical-transport': 'bg-stone-600',
  'combat-stealth': 'bg-red-600',
  'attack-tactical-helicopter': 'bg-orange-600',
  'utility-helicopter': 'bg-amber-600',
  'surveillance-uas': 'bg-cyan-600',
};

const CARGO_SUBCATEGORY_LABELS: Record<string, string> = {
  'production-freighter': 'Production Freighter',
  'p2f-freighter': 'P2F Conversion',
  'outsize-transport': 'Outsize Transport',
  'historical-cargo': 'Historical',
};

const CARGO_SUBCATEGORY_COLORS: Record<string, string> = {
  'production-freighter': 'bg-indigo-700',
  'p2f-freighter': 'bg-purple-700',
  'outsize-transport': 'bg-pink-700',
  'historical-cargo': 'bg-gray-600',
};

const FLAGSHIP_SUBCATEGORY_LABELS: Record<string, string> = {
  'game-changer': 'Game Changers',
  'legacy-fading': 'Legacy (Fading)',
  'resurgent': 'Resurgent',
  'historical-flagship': 'Historical',
};

const FLAGSHIP_SUBCATEGORY_COLORS: Record<string, string> = {
  'game-changer': 'bg-blue-700',
  'legacy-fading': 'bg-orange-700',
  'resurgent': 'bg-emerald-700',
  'historical-flagship': 'bg-gray-700',
};

interface TypeRatingSearchPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function TypeRatingSearchPage({ onNavigate, onBack }: TypeRatingSearchPageProps) {
  const { currentUser, userProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const [activeCategory, setActiveCategory] = useState<Category>('flagship');

  // Check subscription status
  const isRecognitionPlus = userProfile?.subscription_tier === 'recognition_plus' || userProfile?.subscription_tier === 'enterprise';
  const isLoggedIn = !!currentUser;
  const [activeLegacySubcategory, setActiveLegacySubcategory] = useState<string | null>(null);
  const [activeHelicopterSubcategory, setActiveHelicopterSubcategory] = useState<string | null>(null);
  const [activeMilitarySubcategory, setActiveMilitarySubcategory] = useState<string | null>(null);
  const [activeCargoSubcategory, setActiveCargoSubcategory] = useState<string | null>(null);
  const [activeFlagshipSubcategory, setActiveFlagshipSubcategory] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftTypeRating | null>(null);
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const carouselRef = useRef<HTMLDivElement>(null);
  const manufacturerCarouselRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showRequirements, setShowRequirements] = useState(false);

  // Universal search entity tabs
  type EntityType = 'all' | 'manufacturers' | 'airlines' | 'operators' | 'private-jet';
  const [activeEntity, setActiveEntity] = useState<EntityType>('all');
  const [activeEntityCategory, setActiveEntityCategory] = useState<string>('all');

  const ENTITY_TABS: { id: EntityType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'manufacturers', label: 'Manufacturers' },
    { id: 'airlines', label: 'Airlines' },
    { id: 'operators', label: 'Operators' },
    { id: 'private-jet', label: 'Private Jet' },
  ];

  const ENTITY_CATEGORIES: Record<EntityType, string[]> = {
    all: ['All'],
    manufacturers: ['All', 'Commercial Jets', 'Regional Aircraft', 'Business & Private', 'Helicopters', 'Military & Defense', 'General Aviation', 'eVTOL & UAM'],
    airlines: ['All', 'International', 'Regional', 'Low-Cost', 'Cargo', 'Legacy'],
    operators: ['All', 'Commercial', 'Corporate', 'Charter', 'Cargo', 'Training'],
    'private-jet': ['All', 'Light', 'Mid-Size', 'Super Mid-Size', 'Large', 'Ultra-Long Range'],
  };

  // Data — manufacturers load immediately from hardcoded data (old version behavior)
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(HARDCODED_MANUFACTURERS);
  const [aircraftTypeRatings, setAircraftTypeRatings] = useState<AircraftTypeRating[]>(HARDCODED_AIRCRAFT);
  const [dataLoading, setDataLoading] = useState(true);

  // Filter manufacturers shown in the carousel by search query
  const filteredManufacturers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return manufacturers;
    return manufacturers.filter(m => m.name.toLowerCase().includes(query));
  }, [searchQuery, manufacturers]);

  // Bookmark state
  const [bookmarkedAircraft, setBookmarkedAircraft] = useState<Set<string>>(new Set());

  const { callApi } = useWorkerAuth();
  const bookmarkService = React.useMemo(() => new BookmarkService(callApi), [callApi]);

  // Fetch aircraft from D1 and merge with hardcoded data
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Fetch aircraft type ratings from D1 and merge
        const aircraftData = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'aircraft_type_ratings',
          operation: 'select',
          limit: 500,
        });
        if (aircraftData && aircraftData.length > 0) {
          d1Aircraft = (aircraftData as unknown) as AircraftTypeRating[];
          // Merge: D1 entries override hardcoded by ID
          const hardcodedIds = new Set(HARDCODED_AIRCRAFT.map(a => a.id));
          const newD1 = aircraftData.filter((a: any) => !hardcodedIds.has(a.id));
          setAircraftTypeRatings([...HARDCODED_AIRCRAFT, ...((newD1 as unknown) as AircraftTypeRating[])]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // Load bookmarks from database on mount and when user changes
  useEffect(() => {
    if (!currentUser) return;

    const loadBookmarks = async () => {
      try {
        const aircraftBookmarks = await bookmarkService.getBookmarksByType('aircraft', currentUser.id);
        const bookmarkedIds = new Set(aircraftBookmarks.map(b => b.item_id));
        setBookmarkedAircraft(bookmarkedIds);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        // Fallback to localStorage if database fails
        const savedAircraftBookmarks = localStorage.getItem('bookmarkedAircraft');
        if (savedAircraftBookmarks) {
          setBookmarkedAircraft(new Set(JSON.parse(savedAircraftBookmarks)));
        }
      }
    };

    loadBookmarks();
  }, [currentUser]);

  // Toggle aircraft bookmark
  const toggleAircraftBookmark = async (aircraftId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    
    if (!currentUser) {
      // Fallback to localStorage if user not authenticated
      setBookmarkedAircraft(prev => {
        const newBookmarks = new Set(prev);
        if (newBookmarks.has(aircraftId)) {
          newBookmarks.delete(aircraftId);
        } else {
          newBookmarks.add(aircraftId);
        }
        localStorage.setItem('bookmarkedAircraft', JSON.stringify(Array.from(newBookmarks)));
        // Force re-render by creating a new Set
        return new Set(Array.from(newBookmarks));
      });
      return;
    }

    try {
      // Find aircraft data for bookmark
      const aircraft = aircraftTypeRatings.find(a => a.id === aircraftId);
      if (!aircraft) return;

      const result = await bookmarkService.toggleBookmark(
        aircraftId,
        'aircraft',
        {
          title: aircraft.model,
          description: aircraft.description || 'Bookmarked aircraft from type rating search',
          image_url: aircraft.image,
          metadata: {
            manufacturer_id: aircraft.manufacturer_id,
            category: aircraft.category,
            subcategory: aircraft.subcategory
          }
        },
        currentUser.id
      );

      // Update local state
      setBookmarkedAircraft(prev => {
        const newBookmarks = new Set(prev);
        if (result.action === 'added') {
          newBookmarks.add(aircraftId);
        } else {
          newBookmarks.delete(aircraftId);
        }
        // Force re-render by creating a new Set
        return new Set(Array.from(newBookmarks));
      });

      // Also update localStorage as backup
      localStorage.setItem('bookmarkedAircraft', JSON.stringify(Array.from(result.action === 'added' ? 
        [...bookmarkedAircraft, aircraftId] : 
        Array.from(bookmarkedAircraft).filter(id => id !== aircraftId)
      )));

    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Fallback to localStorage on error
      setBookmarkedAircraft(prev => {
        const newBookmarks = new Set(prev);
        if (newBookmarks.has(aircraftId)) {
          newBookmarks.delete(aircraftId);
        } else {
          newBookmarks.add(aircraftId);
        }
        localStorage.setItem('bookmarkedAircraft', JSON.stringify(Array.from(newBookmarks)));
        // Force re-render by creating a new Set
        return new Set(Array.from(newBookmarks));
      });
    }
  };

  // Check if aircraft is bookmarked
  const isAircraftBookmarked = (aircraftId: string) => {
    return bookmarkedAircraft.has(aircraftId);
  };

  // Handle URL parameters for pre-selection
  useEffect(() => {
    const manufacturerParam = searchParams.get('manufacturer');
    const aircraftParam = searchParams.get('aircraft');

    if (manufacturerParam) {
      const manufacturer = manufacturers.find(m => m.id === manufacturerParam);
      if (manufacturer) {
        setSelectedManufacturer(manufacturer);
      }
    }

    if (aircraftParam) {
      const aircraft = aircraftTypeRatings.find(a => a.id === aircraftParam);
      if (aircraft) {
        setSelectedAircraft(aircraft);
      }
    }
  }, [searchParams, manufacturers, aircraftTypeRatings]);

  // Reset category filter when manufacturer changes
  useEffect(() => {
    setSelectedCategory('all');
  }, [selectedManufacturer?.id]);

  const filteredAircraft = React.useMemo(() => {
    let aircraft = aircraftTypeRatings;
    
    if (selectedManufacturer) {
      aircraft = aircraft.filter(a => a.manufacturer_id === selectedManufacturer.id);
    }
    
    if (activeCategory !== 'all') {
      aircraft = aircraft.filter(a => a.category === activeCategory);
    }
    
    // Filter by legacy subcategory if legacy category is selected and a subcategory is active
    if (activeCategory === 'legacy' && activeLegacySubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeLegacySubcategory);
    }
    
    // Filter by helicopter subcategory if helicopter category is selected and a subcategory is active
    if (activeCategory === 'helicopter' && activeHelicopterSubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeHelicopterSubcategory);
    }
    
    // Filter by military subcategory if military category is selected and a subcategory is active
    if (activeCategory === 'military' && activeMilitarySubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeMilitarySubcategory);
    }
    
    // Filter by cargo subcategory if cargo category is selected and a subcategory is active
    if (activeCategory === 'cargo' && activeCargoSubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeCargoSubcategory);
    }
    
    // Filter by flagship subcategory if flagship category is selected and a subcategory is active
    if (activeCategory === 'flagship' && activeFlagshipSubcategory) {
      aircraft = aircraft.filter(a => a.subcategory === activeFlagshipSubcategory);
    }
    
    if (searchQuery) {
      aircraft = aircraft.filter(a => 
        a.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.manufacturer_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return aircraft;
  }, [selectedManufacturer, activeCategory, activeLegacySubcategory, activeHelicopterSubcategory, activeMilitarySubcategory, activeCargoSubcategory, activeFlagshipSubcategory, searchQuery]);

  // Get available categories for selected manufacturer
  const availableCategories = React.useMemo(() => {
    const categories = new Set<Category>();
    aircraftTypeRatings.forEach(aircraft => {
      categories.add(aircraft.category as Category);
    });
    return Array.from(categories);
  }, [aircraftTypeRatings]);

  // Get categories specifically available for the selected manufacturer
  const manufacturerCategories = React.useMemo(() => {
    if (!selectedManufacturer) return [];
    const categories = new Set<string>();
    aircraftTypeRatings
      .filter(a => a.manufacturer_id === selectedManufacturer.id)
      .forEach(a => categories.add(a.category));
    return Array.from(categories).sort();
  }, [selectedManufacturer, aircraftTypeRatings]);

  // Auto-scroll aircraft carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      const el = carouselRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll manufacturer carousel (infinite loop)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!manufacturerCarouselRef.current) return;
      const el = manufacturerCarouselRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 240, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scroll = (dir: 'left' | 'right') =>
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });

  const handleSelect = (aircraft: AircraftTypeRating) => {
    setSelectedAircraft(aircraft);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const getManufacturer = (aircraft: AircraftTypeRating) => {
    return manufacturers.find(m => m.id === aircraft.manufacturer_id);
  };

  // Helper function to get manufacturer by ID (for direct access)
  const getManufacturerById = (id: string) => {
    return manufacturers.find(m => m.id === id);
  };

  // Helper function to get aircraft by manufacturer
  const getAircraftByManufacturer = (manufacturerId: string) => {
    return aircraftTypeRatings.filter(a => a.manufacturer_id === manufacturerId);
  };

  // Helper function to get aircraft by category
  const getAircraftByCategory = (category: string) => {
    return aircraftTypeRatings.filter(a => a.category === category);
  };

  return (
    <div className="min-h-screen relative text-slate-900 font-sans">
      {/* MeshGradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          className="w-full h-full"
          colors={["#4a4a4d", "#60606a", "#7a7a8b", "#ffffff"]}
          speed={1.0}
        />
      </div>
      {/* Glassy blur overlay */}
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xl z-0" />

      {/* Top Navigation Bar */}
      <PlatformNavbar
        onNavigate={onNavigate || ((page) => safeRedirect(`/${page}`))}
        currentPage="pathways"
      />

      {/* Sidebar Navigation */}
      <PathwaysSidebar activeSection="type-ratings" onNavigate={onNavigate || ((page) => safeRedirect(`/${page}`))} />

      {/* Hero Section - outside main, edge-to-edge behind navbar */}
      <div className="relative overflow-hidden z-10" style={{ marginLeft: '280px' }}>
        {/* Background - dark gradient, only when manufacturer or aircraft selected */}
        {(selectedManufacturer || selectedAircraft) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
            {/* Press/media style repeating selected manufacturer logo wall */}
            {selectedManufacturer && (
              <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none opacity-[0.25]" style={{ filter: 'grayscale(100%) brightness(200%)' }}>
                <div className="flex flex-wrap gap-x-10 gap-y-6 p-6 justify-around content-around">
                  {[...Array(90)].map((_, i) => (
                    <img key={`${selectedManufacturer.id}-${i}`} src={selectedManufacturer.logo} alt={selectedManufacturer.name} className="h-9 w-auto object-contain opacity-80" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className={`relative z-10 max-w-7xl mx-auto px-6 pt-[48px] ${(selectedManufacturer || selectedAircraft) ? 'pb-2' : 'pb-6'}`}>
          {!selectedManufacturer && !selectedAircraft ? (
            <div className="w-full text-white px-4 md:px-8 lg:px-12 py-6 md:py-8 backdrop-blur-xl rounded-2xl border border-white/25" style={{ background: 'rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
              <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
                <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-sky-400 mb-1 md:mb-2">Discover Type-Ratings</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal mb-2 leading-tight text-white">
                  Aircraft <span style={{ color: '#dc2626' }}>Type Ratings</span>
                </h1>
                <div className="space-y-1 text-white/70 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Worldwide Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Global Pilot Community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Industry Verified Data</span>
                  </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-3 max-w-lg">
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40 mb-0.5">Total Aircraft in Service</div>
                    <div className="text-xl font-bold">437,900+</div>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40 mb-0.5">Type-Rated Pilots Worldwide</div>
                    <div className="text-xl font-bold">875,000+</div>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40 mb-0.5">Active Type Ratings</div>
                    <div className="text-xl font-bold">87</div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedAircraft ? (
            <div className="px-4 md:px-8 lg:px-12">
              <AircraftPreviewCard aircraft={selectedAircraft} manufacturer={getManufacturerById(selectedAircraft.manufacturer_id)} />
            </div>
          ) : (
            <div className="px-4 md:px-8 lg:px-12">
              <ManufacturerPreviewCard manufacturer={selectedManufacturer} />
            </div>
          )}
        </div>
      </div>

      {/* Manufacturer Carousel - overlaps hero like a popup, always visible */}
      <div className="relative z-20 -mt-3 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl" style={{ background: 'rgba(255,255,255,0.08)', marginLeft: '280px' }}>
        <div className="text-center -mt-3 mb-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl border border-white/20" style={{ background: 'rgba(255,255,255,0.1)', boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
            <h2 className="text-sm font-serif font-normal text-white drop-shadow-md">
              {selectedManufacturer ? (
                <>{selectedManufacturer.name} Aircraft</>
              ) : (
                <>Browse Manufacturers <span className="text-xs text-white/60">({filteredManufacturers.length})</span></>
              )}
            </h2>
          </div>
        </div>
        {selectedManufacturer ? (
          <div className="pt-1 pb-3 px-5">
            <ManufacturerAircraftCarousel
              manufacturerId={selectedManufacturer.id}
              manufacturerName={selectedManufacturer.name}
              onSelect={(aircraft) => setSelectedAircraft(aircraft)}
              selectedId={selectedAircraft?.id}
              title="Aircraft"
              categoryFilter={selectedCategory}
              searchFilter={searchQuery}
            />

            {/* Search bar + category filter buttons below aircraft carousel */}
            <div className="mt-4 flex items-center gap-2 max-w-5xl mx-auto px-2 sm:px-0">
              <div className="relative flex-shrink-0 w-64 md:w-80">
                {selectedManufacturer && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-md flex items-center justify-center p-1 z-10">
                    <img
                      src={selectedManufacturer.logo}
                      alt={selectedManufacturer.name}
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search aircraft, manufacturers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full pr-11 py-2.5 rounded-xl border border-white/30 bg-white/90 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all shadow-lg ${selectedManufacturer ? 'pl-12' : 'pl-4'}`}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  All
                </button>
                {manufacturerCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedManufacturer(null); setSelectedAircraft(null); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap backdrop-blur-xl border border-white/20 text-white/90 hover:text-white hover:bg-white/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.1)', boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                >
                  <X className="w-3 h-3" />
                  Cancel Filter
                </button>
              </div>
            </div>
          </div>
        ) : (
        <div
          ref={manufacturerCarouselRef}
          className="flex gap-3 overflow-x-auto pt-1 pb-3 px-5 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {filteredManufacturers.map(manufacturer => (
            <button
              key={manufacturer.id}
              onClick={() => { setSelectedManufacturer(manufacturer); setSelectedAircraft(null); }}
              className={`flex-shrink-0 rounded-lg transition-all relative overflow-hidden text-left ${
                selectedManufacturer?.id === manufacturer.id
                  ? 'ring-2 ring-sky-500 border-sky-500/50 shadow-2xl'
                  : 'hover:shadow-lg'
              }`}
              style={{
                width: '160px',
                border: `2px solid ${selectedManufacturer?.id === manufacturer.id ? 'rgba(14, 165, 233, 0.5)' : 'rgba(255,255,255,0.12)'}`,
                background: 'rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => {
                if (selectedManufacturer?.id !== manufacturer.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedManufacturer?.id !== manufacturer.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }
              }}
            >
              {/* Top: Logo on light background */}
              <div className="h-[85px] relative overflow-hidden flex items-center justify-center p-3" style={{ background: '#f3f4f6' }}>
                <img
                  src={manufacturer.logo}
                  alt={manufacturer.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              {/* Bottom: Name on dark bg */}
              <div className="p-3">
                <p className="text-sm font-bold text-white truncate">{manufacturer.name}</p>
              </div>
            </button>
          ))}
        </div>
        )}
      </div>

      {/* Main Content with sidebar margin */}
      <main className="flex-1 w-full min-h-screen overflow-x-hidden" style={{ marginLeft: '280px', paddingTop: '0', paddingRight: '1rem' }}>

      {/* Search + Entity Tabs area */}
      <div className="relative overflow-hidden pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6 lg:pb-8 px-4 md:px-6 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-transparent to-indigo-900/10 pointer-events-none" />

        {/* Search — only in main content when no manufacturer selected (aircraft stage uses carousel search) */}
        {!selectedManufacturer && (
          <div className="max-w-lg mx-auto relative px-2 sm:px-0">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search aircraft, manufacturers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-white/30 bg-white/90 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all shadow-lg"
              />
            </div>
          </div>
        )}

          {/* Universal Search Entity Tabs — frosty glassy UI, hidden in aircraft selection stage */}
          {!selectedManufacturer && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto px-2 sm:px-0">
            {/* Left: Entity selector card */}
            <div className="relative rounded-xl overflow-hidden backdrop-blur-2xl" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
              <div className="p-2 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 text-slate-500">Discover Pathways</p>
                <div className="relative flex items-center justify-center">
                  <select
                    value={activeEntity}
                    onChange={(e) => { setActiveEntity(e.target.value as EntityType); setActiveEntityCategory('all'); }}
                    className="w-full bg-transparent text-slate-900 text-sm font-semibold appearance-none cursor-pointer focus:outline-none pr-6"
                  >
                    {ENTITY_TABS.map(tab => (
                      <option key={tab.id} value={tab.id} className="bg-white text-slate-900">{tab.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Right: Category selector card */}
            <div className="relative rounded-xl overflow-hidden backdrop-blur-2xl" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
              <div className="p-3 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 text-slate-500">Category</p>
                <div className="relative flex items-center justify-center">
                  <select
                    value={activeEntityCategory}
                    onChange={(e) => setActiveEntityCategory(e.target.value)}
                    className="w-full bg-transparent text-slate-900 text-sm font-semibold appearance-none cursor-pointer focus:outline-none pr-6"
                  >
                    {ENTITY_CATEGORIES[activeEntity].map(cat => (
                      <option key={cat} value={cat} className="bg-white text-slate-900">{cat}</option>
                    ))}
                  </select>
                  <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

      {/* Read more about manufacturer expectations - positioned at bottom center of hero */}
      {selectedManufacturer && (
        <div className="relative z-10 flex justify-center mb-8">
          <button
            onClick={() => safeRedirect(`/manufacturer/${selectedManufacturer.id}/expectations`)}
            className="bg-white/30 backdrop-blur-xl border border-white/50 px-6 py-3 text-white text-sm font-medium rounded-xl hover:bg-white/40 transition-all shadow-xl"
          >
            Read more about {selectedManufacturer.name} expectations
          </button>
        </div>
      )}

      {/* Manufacturer logo below hero section */}
      <div className="relative z-10 flex justify-center -mt-8 mb-8">
        {selectedManufacturer ? (
          <span className="text-white text-2xl font-bold">{selectedManufacturer.name}</span>
        ) : (
          <span style={{ fontFamily: 'Arial Black, Helvetica Neue, sans-serif' }} className="text-white text-2xl">
            PilotRecognition.com
          </span>
        )}
      </div>

      {/* Dark blue background for content below hero */}
      <div className="relative z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-12">
      {!selectedManufacturer ? (
        // Profile view when no manufacturer is selected
        <div className="max-w-7xl mx-auto px-6 pt-8">
          {isLoggedIn && userProfile ? (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-sky-500" />
                Your Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {userProfile.full_legal_name ? userProfile.full_legal_name.charAt(0).toUpperCase() : userProfile.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{userProfile.full_legal_name || userProfile.display_name || 'Pilot'}</h4>
                      <p className="text-sm text-slate-500">{userProfile.email}</p>
                    </div>
                  </div>
                </div>

                {/* Flight Hours */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm text-slate-500">Total Flight Hours</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{userProfile.total_flight_hours || userProfile.flight_hours || '0'}</div>
                  <p className="text-xs text-slate-500 mt-1">Hours logged</p>
                </div>

                {/* Recognition Score */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-slate-500">Recognition Score</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{userProfile.recognition_score || userProfile.recognitionScore || 'N/A'}</div>
                  <p className="text-xs text-slate-500 mt-1">Industry recognition</p>
                </div>
              </div>

              {/* Additional Profile Details */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">License Type</div>
                  <div className="font-semibold text-slate-900">{userProfile.license_type || userProfile.licenseType || 'CPL/ATPL'}</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Experience Level</div>
                  <div className="font-semibold text-slate-900">{userProfile.experience_level || userProfile.experienceLevel || 'Mid-Career'}</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Country</div>
                  <div className="font-semibold text-slate-900">{userProfile.residing_country || userProfile.residingCountry || userProfile.nationality || 'N/A'}</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Member Since</div>
                  <div className="font-semibold text-slate-900">{userProfile.created_at ? new Date(userProfile.created_at).getFullYear() : '2026'}</div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Industry News Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-sky-500 rounded-full"></span>
                Industry News
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-sky-600 font-semibold mb-1 block">April 2026</span>
                  <h4 className="font-semibold text-slate-900 mb-1">Global Pilot Shortage Continues</h4>
                  <p className="text-sm text-slate-600">Airlines worldwide report 18,000+ pilot vacancies, with highest demand for A320neo and B737MAX type-rated pilots.</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Source: ICAO / Boeing Pilot & Technician Outlook 2026</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-sky-600 font-semibold mb-1 block">March 2026</span>
                  <h4 className="font-semibold text-slate-900 mb-1">New Training Standards Announced</h4>
                  <p className="text-sm text-slate-600">EASA and FAA align on enhanced training requirements for next-generation aircraft including A350, B777X, and eVTOL operations.</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Source: EASA SIB 2026-03 / FAA SAFO 16001</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-sky-600 font-semibold mb-1 block">February 2026</span>
                  <h4 className="font-semibold text-slate-900 mb-1">Regional Jet Market Expansion</h4>
                  <p className="text-sm text-slate-600">Embraer E2 family and ATR 72-600 see increased orders as airlines focus on regional connectivity and fuel efficiency.</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Source: Embraer & ATR Market Outlook Q1 2026</p>
                </div>
              </div>
            </div>

            {/* Latest Type Rating Changes Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                Latest Type Rating Changes
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-emerald-600 font-semibold mb-1 block">Boeing</span>
                  <h4 className="font-semibold text-slate-900 mb-1">737 MAX Training Updates</h4>
                  <p className="text-sm text-slate-600">Enhanced simulator requirements for MAX 8, 9, and 10 variants. New MCAS training modules mandatory from Q3 2026.</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Source: Boeing Training & Flight Services Bulletin</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-emerald-600 font-semibold mb-1 block">Airbus</span>
                  <h4 className="font-semibold text-slate-900 mb-1">A320neo Family Certification</h4>
                  <p className="text-sm text-slate-600">Common type rating extended to include A321XLR. Reduced training hours for pilots with A320ceo experience.</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Source: Airbus Training Centre Technical Notice 2026-04</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-emerald-600 font-semibold mb-1 block">Embraer</span>
                  <h4 className="font-semibold text-slate-900 mb-1">E-Jet E2 Cross-Qualification</h4>
                  <p className="text-sm text-slate-600">New cross-qualification program between E190-E2 and E195-E2. 40% reduction in training time announced.</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Source: Embraer Commercial Aviation Training Update</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-emerald-600 font-semibold mb-1 block">ATR</span>
                  <h4 className="font-semibold text-slate-900 mb-1">ATR 72-600 New Procedures</h4>
                  <p className="text-sm text-slate-600">Updated cold weather operations procedures for 72-600. New de-icing certification requirements effective immediately.</p>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Source: ATR Aircraft Operations Bulletin 2026-02</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manufacturer Overview Stats */}
          <div className="mt-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              Manufacturer Overview ({manufacturers.length} Aircraft Manufacturers)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-slate-900">200,000+</div>
                <div className="text-sm text-slate-600">Total Aircraft in Service</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-slate-900">500,000+</div>
                <div className="text-sm text-slate-600">Type-Rated Pilots Worldwide</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-slate-900">87</div>
                <div className="text-sm text-slate-600">Active Type Ratings</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-slate-900">150+</div>
                <div className="text-sm text-slate-600">Training Centers Globally</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Category filter chips and manufacturer details when selected
        <>
      {/* Category Filter Chips */}
      <div className="max-w-7xl mx-auto px-6 mb-10 relative z-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setActiveCategory(key as Category);
                setActiveLegacySubcategory(null);
                setActiveHelicopterSubcategory(null);
                setActiveMilitarySubcategory(null);
                setActiveCargoSubcategory(null);
                setActiveFlagshipSubcategory(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === key
                  ? `${CATEGORY_COLORS[key] || 'bg-slate-500'} text-white shadow-lg`
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Subcategory filters for specific categories */}
        {activeCategory === 'legacy' && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {Object.entries(LEGACY_SUBCATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveLegacySubcategory(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeLegacySubcategory === key
                    ? `${LEGACY_SUBCATEGORY_COLORS[key]} text-white shadow-md`
                    : 'bg-white/80 border border-slate-300 text-slate-600 hover:bg-white hover:border-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {activeCategory === 'helicopter' && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {Object.entries(HELICOPTER_SUBCATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveHelicopterSubcategory(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeHelicopterSubcategory === key
                    ? `${HELICOPTER_SUBCATEGORY_COLORS[key]} text-white shadow-md`
                    : 'bg-white/80 border border-slate-300 text-slate-600 hover:bg-white hover:border-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {activeCategory === 'military' && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {Object.entries(MILITARY_SUBCATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveMilitarySubcategory(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeMilitarySubcategory === key
                    ? `${MILITARY_SUBCATEGORY_COLORS[key]} text-white shadow-md`
                    : 'bg-white/80 border border-slate-300 text-slate-600 hover:bg-white hover:border-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {activeCategory === 'cargo' && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {Object.entries(CARGO_SUBCATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCargoSubcategory(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCargoSubcategory === key
                    ? `${CARGO_SUBCATEGORY_COLORS[key]} text-white shadow-md`
                    : 'bg-white/80 border border-slate-300 text-slate-600 hover:bg-white hover:border-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {activeCategory === 'flagship' && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {Object.entries(FLAGSHIP_SUBCATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFlagshipSubcategory(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFlagshipSubcategory === key
                    ? `${FLAGSHIP_SUBCATEGORY_COLORS[key]} text-white shadow-md`
                    : 'bg-white/80 border border-slate-300 text-slate-600 hover:bg-white hover:border-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Carousel Section */}
      <div className="px-0 mb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-normal text-white">Browse Aircraft</h2>
            <p className="text-sm text-slate-300">{filteredAircraft.length} aircraft available</p>
          </div>
          {/* Scroll arrows */}
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white transition-colors backdrop-blur-sm border border-slate-600/30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-white transition-colors backdrop-blur-sm border border-slate-600/30">
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
          {dataLoading ? (
            <div className="flex gap-4 w-full">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex-shrink-0 w-80 h-72 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            filteredAircraft.map(aircraft => (
            <div
              key={aircraft.id}
              onClick={() => handleSelect(aircraft)}
              className={`flex-shrink-0 w-80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border ${
                selectedAircraft?.id === aircraft.id
                  ? 'ring-2 ring-sky-500 border-sky-500/50'
                  : 'border-slate-200 hover:border-slate-400'
              } bg-white group`}
            >
              {/* Thumbnail */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                {/* Bookmark Icon - Top Left */}
                <button
                  onClick={(e) => toggleAircraftBookmark(aircraft.id, e)}
                  className={`absolute top-2 left-2 w-8 h-8 backdrop-blur-sm border rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 z-20 ${
                    isAircraftBookmarked(aircraft.id)
                      ? 'bg-teal-500/90 border-teal-400'
                      : 'bg-slate-800/80 border-slate-600/50 hover:bg-slate-700/90'
                  }`}
                  title={isAircraftBookmarked(aircraft.id) ? "Remove bookmark" : "Add bookmark"}
                >
                  <Bookmark 
                    className={`w-4 h-4 transition-colors duration-300 ${
                      isAircraftBookmarked(aircraft.id) 
                        ? '!text-white !fill-white' 
                        : '!text-slate-300 hover:!text-white'
                    }`}
                    style={{
                      color: isAircraftBookmarked(aircraft.id) ? 'white' : '#cbd5e1',
                      fill: isAircraftBookmarked(aircraft.id) ? 'white' : 'none'
                    }}
                  />
                </button>
                
                {aircraft.sketchfab_id ? (
                  <SketchfabThumbnail
                    sketchfabId={aircraft.sketchfab_id}
                    alt={aircraft.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={
                      (aircraft.image && !aircraft.image.includes('efqjszksldcdm6kbnzoq.png'))
                        ? aircraft.image
                        : 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80'
                    }
                    alt={aircraft.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      console.error('Image failed to load:', aircraft.model, aircraft.image);
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {aircraft.sketchfab_id && (
                  <div className="absolute top-3 right-3 bg-sky-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                    3D
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-white font-serif text-lg leading-tight font-semibold">{aircraft.model}</span>
                  <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                    <Plane className="w-4 h-4" />
                    {CATEGORY_LABELS[aircraft.category]}
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Empty state — no aircraft selected */}
      {!selectedAircraft && (
        <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-16">
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 md:p-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center">
                <MousePointerClick className="w-10 h-10 text-sky-400" />
              </div>
            </div>
            <h2 className="text-2xl font-serif font-normal text-slate-800 mb-3">Select an Aircraft to Explore</h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
              Choose any aircraft from the carousel above to view its specifications, training requirements, manufacturer details, and career information.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: <Plane className="w-5 h-5 text-sky-500" />, label: 'Aircraft Specifications' },
                { icon: <DollarSign className="w-5 h-5 text-emerald-500" />, label: 'Training Costs' },
                { icon: <Building2 className="w-5 h-5 text-purple-500" />, label: 'Manufacturer Info' },
                { icon: <Gauge className="w-5 h-5 text-rose-500" />, label: 'Performance Specs' },
                { icon: <Calendar className="w-5 h-5 text-amber-500" />, label: 'Aircraft History' },
                { icon: <BookOpen className="w-5 h-5 text-indigo-500" />, label: 'Training Requirements' },
                { icon: <Briefcase className="w-5 h-5 text-teal-500" />, label: 'Career Info' },
                { icon: <Star className="w-5 h-5 text-yellow-500" />, label: 'Reputation Score' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  {item.icon}
                  <span className="text-xs font-medium text-slate-600 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Selected Aircraft Detail Panel */}
      {selectedAircraft && (
        <div ref={detailRef} className="max-w-7xl mx-auto px-6 mb-12">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">

            {/* Hero image with overlay */}
            <div className="relative h-64 md:h-80">
              {selectedAircraft.sketchfab_id ? (
                <SketchfabThumbnail
                  sketchfabId={selectedAircraft.sketchfab_id}
                  alt={selectedAircraft.model}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedAircraft.image}
                  alt={selectedAircraft.model}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Detail image failed to load:', selectedAircraft.model, selectedAircraft.image);
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
              {selectedAircraft.sketchfab_id && (
                <div className="absolute top-4 right-4 bg-sky-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                  3D Model Available
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold tracking-[0.2em] uppercase text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30`}>
                    {CATEGORY_LABELS[selectedAircraft.category]}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-2">{selectedAircraft.model}</h2>
                <div className="flex items-center gap-4 flex-wrap mb-3">
                  <span className="flex items-center gap-1.5 text-sky-300 text-sm">
                    <img src={getManufacturer(selectedAircraft)?.logo || '/images/set-01-logos/logo.png'} alt="Manufacturer" className="h-4 w-auto object-contain opacity-80" />
                    {getManufacturer(selectedAircraft)?.name}
                  </span>
                </div>
                {/* Indicators */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white border-2 border-sky-400 backdrop-blur-xl shadow-lg">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    Career Score: {calculateCareerScore(selectedAircraft)}/100
                  </div>
                  {selectedAircraft.demandLevel && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                      selectedAircraft.demandLevel === 'high' ? 'bg-emerald-500 text-white border-emerald-400' :
                      selectedAircraft.demandLevel === 'low' ? 'bg-amber-500 text-white border-amber-400' :
                      'bg-red-500 text-white border-red-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        selectedAircraft.demandLevel === 'high' ? 'bg-white' :
                        selectedAircraft.demandLevel === 'low' ? 'bg-white' :
                        'bg-white'
                      }`} />
                      Demand: {selectedAircraft.demandLevel === 'high' ? 'High' : selectedAircraft.demandLevel === 'low' ? 'Low' : 'None'}
                    </div>
                  )}
                  {selectedAircraft.conditionally_new && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                      selectedAircraft.conditionally_new === 'green' ? 'bg-emerald-500 text-white border-emerald-400' :
                      selectedAircraft.conditionally_new === 'amber' ? 'bg-amber-500 text-white border-amber-400' :
                      'bg-red-500 text-white border-red-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        selectedAircraft.conditionally_new === 'green' ? 'bg-white' :
                        selectedAircraft.conditionally_new === 'amber' ? 'bg-white' :
                        'bg-white'
                      }`} />
                      Conditionally New
                    </div>
                  )}
                  {selectedAircraft.lifecycleStage && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xl border-2 ${
                      selectedAircraft.lifecycleStage === 'early-career' ? 'bg-emerald-500 text-white border-emerald-400' :
                      selectedAircraft.lifecycleStage === 'mid-career' ? 'bg-amber-500 text-white border-amber-400' :
                      'bg-red-500 text-white border-red-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        selectedAircraft.lifecycleStage === 'early-career' ? 'bg-white' :
                        selectedAircraft.lifecycleStage === 'mid-career' ? 'bg-white' :
                        'bg-white'
                      }`} />
                      Lifecycle: {selectedAircraft.lifecycleStage === 'early-career' ? 'Early Career' : selectedAircraft.lifecycleStage === 'mid-career' ? 'Mid Career' : 'End of Life'}
                    </div>
                  )}
                  {selectedAircraft.operatorCount && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 text-white border-2 border-amber-400 backdrop-blur-xl">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      Operators: {selectedAircraft.operatorCount}+
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info bar — manufacturer + cost + age */}
            <div className="px-6 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={getManufacturer(selectedAircraft)?.logo || '/images/set-01-logos/logo.png'} alt={getManufacturer(selectedAircraft)?.name} className="h-8 object-contain" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">Manufacturer</p>
                  <p className="text-sm font-semibold text-slate-800">{getManufacturer(selectedAircraft)?.name}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">First Flight</p>
                <p className="text-sm font-semibold text-slate-800">{selectedAircraft.first_flight}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Category</p>
                <p className="text-sm font-semibold text-slate-800 capitalize">{selectedAircraft.category}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Reputation</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-slate-800">{getManufacturer(selectedAircraft)?.reputation_score || 0}</span>
                </div>
              </div>
            </div>

            {/* Airlines Operating This Type */}
            {(() => {
              const airlines = AIRCRAFT_AIRLINES[selectedAircraft.id];
              if (!airlines || !airlines.length) return null;
              return (
                <div className="px-6 md:px-8 py-5 border-b border-slate-100">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Airlines Operating This Type</p>
                  <div className="flex flex-wrap gap-3">
                    {airlines.map(a => (
                      <div key={a.name} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                        <img src={a.logo} alt={a.name} className="h-6 w-10 object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                        <span className="text-xs font-medium text-slate-700">{a.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 px-6 md:px-8 bg-white">
              <div className="flex gap-1 overflow-x-auto">
                {['Overview', 'Training', 'Hiring', 'Compensation', 'Comparison'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-sky-500 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Section — requirements + specs */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              {activeTab === 'Overview' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">Description</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{selectedAircraft.description}</p>
                    
                    {selectedAircraft.why_choose_rating && (
                      <>
                        <h3 className="text-lg font-semibold mb-3 text-slate-900">Why Should a Pilot Choose This Rating?</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{selectedAircraft.why_choose_rating}</p>
                        {selectedAircraft.id === 'a220-300' && (
                          <button
                            onClick={() => setShowExtendedInfo(true)}
                            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                          >
                            View Full Career Outlook
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-slate-900">Technical Specifications</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedAircraft.specifications as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-2 border-b border-slate-50">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-sm font-medium text-slate-800">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Overview' && selectedAircraft.news && selectedAircraft.news.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Latest News</h3>
                  <div className="space-y-3">
                    {selectedAircraft.news.map((news, i) => (
                      <div key={news.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 text-sm mb-1">{news.title}</h4>
                            <p className="text-xs text-slate-500 mb-2">{news.summary}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">{new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 hover:text-sky-700 font-medium">
                                Read more →
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Training' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Training Requirements</h3>
                  {selectedAircraft.training_requirements ? (
                    <ul className="space-y-2.5 mb-6">
                      <li className="flex items-start gap-3 text-sm text-slate-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Minimum Flight Hours: {selectedAircraft.training_requirements.minimumHours}
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Ground School: {selectedAircraft.training_requirements.groundSchoolHours} hours
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Simulator Training: {selectedAircraft.training_requirements.simulatorHours} hours
                      </li>
                      <li className="flex items-start gap-3 text-sm text-slate-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        Flight Training: {selectedAircraft.training_requirements.flightHours} hours
                      </li>
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">Training requirements data not available for this aircraft.</p>
                  )}
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id === 'a220-300' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Hiring Requirements by Airline Type</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    Many operators now offer company-funded type ratings for the A220 to meet high demand, but minimum flight hour thresholds vary significantly between regional and major carriers.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airline</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Position</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Min. Total Hours</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Key Requirements</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200">airBaltic</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">300–500 hrs</td>
                          <td className="p-2 border border-slate-200">300+ hrs on aircraft &gt;5.7t; EASA license</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">Breeze Airways</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">1,500 hrs</td>
                          <td className="p-2 border border-slate-200">FAA ATP/R-ATP; 500 hrs turbine; 50 hrs multi-engine</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">QantasLink</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">500–700 hrs</td>
                          <td className="p-2 border border-slate-200">CASA license; 200 hrs multi-engine/turbine command; Level 6 English</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">Air France</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">~1,500 hrs</td>
                          <td className="p-2 border border-slate-200">Varies by recruitment cycle; typically requires EASA ATPL</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200">Delta Air Lines</td>
                          <td className="p-2 border border-slate-200">First Officer</td>
                          <td className="p-2 border border-slate-200">1,500+ hrs</td>
                          <td className="p-2 border border-slate-200">FAA ATP; prefers 1,000+ hours in Part 121 operations</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id === 'a220-100' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer (FO) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 1,500 hours (FAA) or 500 hours (EASA/ICAO with an airline cadet background)</li>
                    <li><strong>Multi-Engine/Turbine Time:</strong> Minimum 500 hours preferred (though many A220 operators like airBaltic accept 300 hours on aircraft &gt;5.7t)</li>
                    <li><strong>License:</strong> Valid ATPL or CPL with "Frozen" ATPL theory</li>
                    <li><strong>Medical:</strong> Class 1 Medical Certificate</li>
                    <li><strong>English Proficiency:</strong> ICAO Level 4 minimum (Level 6 preferred)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Direct Entry Captain (DEC) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 3,000 – 5,000+ hours</li>
                    <li><strong>PIC Command Time:</strong> 1,000 hours as Pilot-in-Command (PIC) on a multi-pilot turbojet aircraft (e.g., A320, B737, or E-Jet)</li>
                    <li><strong>Type Specific:</strong> Non-type rated pilots are frequently accepted if they have experience on "Glass Cockpit" and Fly-By-Wire aircraft</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Career Opportunities & Bonuses</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    <strong>Current Demand:</strong> Very High. Because the A220 fleet is expanding faster than pilots can be trained, "Type Rating provided by company" is a common offer.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">Sign-on Bonuses</h4>
                      <p className="text-xs text-emerald-700">Currently ranging from $10,000 to $15,000 for type-rated pilots at regional and expansion carriers</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Fast-Track Command</h4>
                      <p className="text-xs text-blue-700">Due to the massive order backlog, First Officers on the A220 often see a faster path to the left seat than those on established A320 fleets</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    <strong>Major Operators Hiring:</strong> Delta Air Lines, JetBlue, Air France, airBaltic, Breeze Airways, and QantasLink
                  </p>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Recruiter's Note</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A220 is currently the best airframe for pilots looking to transition from Regional Jets (ERJ/CRJ) to Mainline flying, as its systems logic is the most modern in the narrow-body class."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id === 'a320' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer (FO) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 1,500 hours (FAA ATP) or 200 hours (EASA/ICAO via Integrated Cadet programs)</li>
                    <li><strong>Multi-Engine/Turbine Time:</strong> 500 hours preferred for direct entry; often waived for graduates of partnered flight schools</li>
                    <li><strong>License:</strong> Valid ATPL or CPL with "Frozen" ATPL theory</li>
                    <li><strong>Type Rating Status:</strong> Many LCCs require a self-funded rating, while legacy carriers usually provide the rating via a training bond. Note: Many European and Asian LCCs now offer "Pay-via-Salary-Deduction" schemes, where the airline pays the $25k upfront and the pilot pays it back over 3 years from their paycheck, reducing the barrier to entry for new FOs.</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Direct Entry Captain (DEC) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 3,000 – 5,000+ hours</li>
                    <li><strong>Command Experience:</strong> 1,000 hours Pilot-in-Command (PIC) on a multi-pilot turbojet aircraft (CS25/Part 25)</li>
                    <li><strong>Glass Cockpit Experience:</strong> Mandatory. Previous Fly-By-Wire (Airbus) experience is a major advantage but not always required if transitioning from Boeing</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Career Opportunities & Job Security</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    <strong>Global Reach:</strong> With over 370 operators, an A320 rating allows a pilot to work in almost any country.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">The "Neo" Growth</h4>
                      <p className="text-xs text-emerald-700">Because of the massive A320neo backlog, airlines are hiring at record rates to replace aging CEO fleets</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Fast-Track Command</h4>
                      <p className="text-xs text-blue-700">In high-growth regions (India, SE Asia, Middle East), FO-to-Captain upgrades can occur in as little as 3–5 years</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Career Path Note</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A320 is the ultimate 'Utility Rating.' It opens doors to hundreds of airlines and serves as the technical foundation for the A330 and A350 widebody fleets."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id === 'a330' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer (FO) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 3,000 hours (FAA) or 1,500 hours (EASA/ICAO with previous jet experience)</li>
                    <li><strong>Multi-Engine/Turbine Time:</strong> 1,000 hours minimum on multi-pilot turbojet aircraft</li>
                    <li><strong>License:</strong> Valid ATPL (CPL with "Frozen" ATPL not accepted for wide-body)</li>
                    <li><strong>Type Rating Status:</strong> Most wide-body carriers provide the rating via training bond. A320-rated pilots can transition via CCQ in 8-10 days.</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Direct Entry Captain (DEC) Requirements</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Total Flight Time:</strong> 5,000 – 8,000+ hours</li>
                    <li><strong>Command Experience:</strong> 2,000 hours Pilot-in-Command (PIC) on wide-body or narrow-body aircraft</li>
                    <li><strong>Wide-body Experience:</strong> Preferred but not always mandatory. Previous heavy aircraft experience valued.</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Career Opportunities & Job Security</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    <strong>Global Reach:</strong> The A330 rating is a "passport" to global wide-body carriers including Delta, Cathay Pacific, Qatar Airways, and Turkish Airlines.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">The "A320 Advantage"</h4>
                      <p className="text-xs text-emerald-700">For A320-rated pilots, the transition is famously smooth via Cross-Crew Qualification (CCQ) - only 8-10 working days of training instead of a full month-long type rating.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Heavy Lifestyle</h4>
                      <p className="text-xs text-blue-700">Wide-body flying offers premium layovers in international destinations and significantly higher compensation compared to narrow-body operations.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Career Path Note</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A330 is the best aircraft for achieving a 'Heavy' rating without the stress of a completely new flight deck logic. It offers a massive jump in pay and lifestyle (layovers) for a fraction of the training time of a Boeing 787."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Hiring' && selectedAircraft.id !== 'a220-300' && selectedAircraft.id !== 'a220-100' && selectedAircraft.id !== 'a320' && selectedAircraft.id !== 'a330' && (
                <p className="text-sm text-slate-500 italic">Hiring requirements are not available for this aircraft.</p>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id === 'a220-300' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Compensation Package (Year 1 First Officer)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    Based on typical 2026 contract rates from top-tier carriers like Air France and Delta.
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Base Salary (MMG):</strong> ~$100,000 – $115,000 (Minimum Monthly Guarantee of 70–75 flight hours)</li>
                    <li><strong>Flight Hourly Rate:</strong> $110 – $170/hr (First-year FO rates ~$112/hr at major US carriers; €70k – €90k in Europe)</li>
                    <li><strong>Per Diems (Tax-Free):</strong> ~$7,000 – $12,000 (US: $2.25 – $3.50/hr away from base; higher for international layovers)</li>
                    <li><strong>Total Annual Cash (Year 1):</strong> ~$110,000 – $135,000</li>
                  </ul>
                </div>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id === 'a220-100' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer (FO) Earnings</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Starting Salary (Year 1):</strong> $110,000 – $135,000</li>
                    <li><strong>Senior FO (Year 5+):</strong> $160,000 – $220,000</li>
                    <li><strong>Hourly Rate (US Major Scale):</strong> $112 – $185/hr (Typically 75-hour monthly guarantee)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Captain Earnings</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Starting Command (Year 1):</strong> $260,000 – $315,000</li>
                    <li><strong>Senior Captain (Year 12+):</strong> $350,000 – $450,000+</li>
                    <li><strong>Hourly Rate (US Major Scale):</strong> $295 – $415/hr</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Additional Financial Benefits</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Per Diems:</strong> Average $7,000 – $12,000 annually (tax-free)</li>
                    <li><strong>Retirement:</strong> Major carriers contribute 14% – 17% direct 401k/Pension funding</li>
                    <li><strong>Sign-on Bonuses:</strong> Currently $10k – $15k for type-rated candidates</li>
                    <li><strong>Efficiency Bonus:</strong> Many operators offer "productivity pay" for flying above 75 hours a month</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Career Intel for Pilots</h3>
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">Pay Parity</h4>
                      <p className="text-xs text-emerald-700">Most airlines place the A220 in the same "Narrow-body" pay bracket as the A320 and B737. This means pilots earn the same high rates while operating a significantly quieter, more modern aircraft with lower fatigue levels.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">The "Regional Plus" Advantage</h4>
                      <p className="text-xs text-blue-700">For pilots at carriers like Breeze or QantasLink, the A220 offers mainline-level compensation while maintaining a mix of short-haul and trans-continental schedules.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Summary</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A220 is a financial winner. Pilots enjoy A320-level pay with 21st-century tech, lower cockpit noise, and a massive growth curve that ensures career longevity."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id === 'a320' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Annual Compensation Profiles (2026)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    The A320 often shares the same pay scale as larger wide-bodies at legacy airlines, meaning pilots earn premium rates while maintaining a short-haul lifestyle.
                  </p>
                  
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="p-2 text-left font-semibold text-slate-800">Region</th>
                          <th className="p-2 text-left font-semibold text-slate-800">First Officer (Entry - Senior)</th>
                          <th className="p-2 text-left font-semibold text-slate-800">Captain (Junior - Senior)</th>
                          <th className="p-2 text-left font-semibold text-slate-800">Key Benefits</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 text-slate-700">United States</td>
                          <td className="p-2 text-slate-700">$120,000 – $200,000+</td>
                          <td className="p-2 text-slate-700">$250,000 – $450,000+</td>
                          <td className="p-2 text-slate-700">14–17% 401k direct contribution</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 text-slate-700">Middle East</td>
                          <td className="p-2 text-slate-700">$100,000 – $180,000</td>
                          <td className="p-2 text-slate-700">$200,000 – $380,000</td>
                          <td className="p-2 text-slate-700">Tax-free, housing, and schooling</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 text-slate-700">Europe</td>
                          <td className="p-2 text-slate-700">€50,000 – €150,000</td>
                          <td className="p-2 text-slate-700">€150,000 – €350,000</td>
                          <td className="p-2 text-slate-700">High job security & sector protections</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-slate-700">India / Asia</td>
                          <td className="p-2 text-slate-700">$30,000 – $80,000</td>
                          <td className="p-2 text-slate-700">$100,000 – $250,000+</td>
                          <td className="p-2 text-slate-700">Rapid command upgrade paths</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Carrier Spotlights (A320 Family)</h3>
                  <div className="space-y-3 mb-4">
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">Lufthansa Mainline</h4>
                      <p className="text-xs text-purple-700">Features a "Golden Cage" pay scale where base salary is ~85% of total pay, offering unmatched security. Senior Captains can earn up to €280,000 gross plus high pension contributions.</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <h4 className="text-sm font-semibold text-orange-800 mb-1">Air France</h4>
                      <p className="text-xs text-orange-700">Uses a dual-pillar system with high fixed pay and a productivity-based "Prime de Vol". Long-haul A320 Captains can reach €350,000 gross.</p>
                    </div>
                    <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                      <h4 className="text-sm font-semibold text-teal-800 mb-1">Etihad Airways</h4>
                      <p className="text-xs text-teal-700">Offers tax-free packages up to $170,000 for A320 Captains, plus massive education and housing allowances.</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Additional Earnings Components</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Per Diems:</strong> Often add $7,000 – $12,000 in tax-free income for meal and hotel incidentals</li>
                    <li><strong>Overtime:</strong> Most contracts pay 150% or more for any flight hours exceeding the monthly guarantee (typically 70–75 hours)</li>
                    <li><strong>Training Supplements:</strong> Check Captains (TRI/TRE) typically earn a premium of $15,000 – $25,000 annually on top of their standard pay</li>
                  </ul>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Summary</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A320 is the most portable rating in aviation. It offers high-level compensation that rivals wide-body pay in the U.S. and provides tax-free wealth-building opportunities in the Middle East."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id === 'a330' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Wide-Body Compensation Profile (2026)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    The A330 offers premium compensation for "Heavy" wide-body flying, with significantly higher earnings than narrow-body aircraft.
                  </p>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">First Officer Earnings</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Starting Salary (Year 1):</strong> $140,000 – $180,000</li>
                    <li><strong>Senior FO (Year 5+):</strong> $180,000 – $220,000</li>
                    <li><strong>Hourly Rate:</strong> $180 – $250/hr (varies by carrier and region)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Captain Earnings</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Starting Command (Year 1):</strong> $280,000 – $350,000</li>
                    <li><strong>Senior Captain (Year 12+):</strong> $350,000 – $480,000+</li>
                    <li><strong>Hourly Rate:</strong> $350 – $480/hr</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Additional Benefits</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <li><strong>Per Diems:</strong> $15,000 – $25,000 annually (tax-free) for international layovers</li>
                    <li><strong>Premium Layovers:</strong> Wide-body routes often include 24-48 hour stays in premium destinations</li>
                    <li><strong>Retirement:</strong> Major carriers contribute 16% – 20% direct pension/401k funding</li>
                  </ul>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Summary</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A330 rating is a 'passport' to global wide-body carriers. It offers a massive jump in pay and lifestyle (layovers) for a fraction of the training time of a Boeing 787."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Compensation' && selectedAircraft.id !== 'a220-300' && selectedAircraft.id !== 'a220-100' && selectedAircraft.id !== 'a320' && selectedAircraft.id !== 'a330' && (
                <p className="text-sm text-slate-500 italic">Compensation data is not available for this aircraft.</p>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id === 'a220-300' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A220-100 vs. A220-300: The Common Type Rating</h3>
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200 mb-4">
                    <p className="text-sm text-sky-700 leading-relaxed font-semibold mb-2">
                      Important: Pilots do not choose between them.
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      Because they share a Common Type Rating (BD-500), when you get rated on one, you are legally qualified to fly both. The FAA and EASA recognize them under the same "BD-500" endorsement.
                    </p>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li><strong>One License, Two Planes:</strong> Training centers offer the rating for both simultaneously.</li>
                      <li><strong>99% Commonality:</strong> Both variants share the same engines, flight deck, and internal systems.</li>
                      <li><strong>Unified Training:</strong> Airlines typically train pilots on the -300 and provide a brief differences module for the -100.</li>
                      <li><strong>Mixed-Fleet Flying:</strong> At airlines that operate both, pilots will often fly a -100 in the morning and a -300 in the afternoon on the same schedule.</li>
                      <li><strong>Current Status:</strong> Both are in high production. Neither is retiring; the -300 is entering its "golden age" of deliveries.</li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Which Variant is "Best" for You?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    While you get both on your license, pilots often prefer one over the other based on the type of flying they want to do:
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-100 (The "Sports Car")</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-300 (The "Workhorse")</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Handling</td>
                          <td className="p-2 border border-slate-200">More "twitchy" and responsive; feels lighter on controls</td>
                          <td className="p-2 border border-slate-200">More stable and "heavy" feel; smoother in turbulence</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Routes</td>
                          <td className="p-2 border border-slate-200">Short, high-frequency, or niche (Steep approaches)</td>
                          <td className="p-2 border border-slate-200">Long-haul narrow-body (Trans-con/Trans-atlantic)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Prestige</td>
                          <td className="p-2 border border-slate-200">Access to restricted airports like London City (LCY)</td>
                          <td className="p-2 border border-slate-200">Access to high-capacity "flagship" routes for major airlines</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Landing</td>
                          <td className="p-2 border border-slate-200">Harder to "grease" (shorter, more sensitive)</td>
                          <td className="p-2 border border-slate-200">Easier to land smoothly (longer wheelbase)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Best For</td>
                          <td className="p-2 border border-slate-200">Pilots who love stick-and-rudder handling</td>
                          <td className="p-2 border border-slate-200">Pilots who want stability and long-range flying</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Airlines by Variant (As of April 2026)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    The A220-300 is the "volume seller" with many more operators, while the A220-100 is a niche specialist for restricted airports.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-2">Airlines Flying BOTH</h4>
                      <ul className="space-y-1 text-xs text-purple-700">
                        <li>Delta Air Lines</li>
                        <li>SWISS</li>
                        <li>ITA Airways</li>
                        <li>Bulgaria Air</li>
                        <li>Air Canada</li>
                        <li>Korean Air</li>
                        <li>QantasLink</li>
                        <li>Croatia Airlines</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">A220-300 ONLY</h4>
                      <ul className="space-y-1 text-xs text-blue-700">
                        <li>airBaltic (All-A220 fleet)</li>
                        <li>JetBlue</li>
                        <li>Air France</li>
                        <li>Breeze Airways</li>
                        <li>EgyptAir</li>
                        <li>Iraqi Airways</li>
                        <li>Air Austral</li>
                        <li>Air Tanzania</li>
                        <li>Cyprus Airways</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-2">A220-100 ONLY</h4>
                      <ul className="space-y-1 text-xs text-emerald-700">
                        <li>Executive/Private Jets</li>
                        <li>(Niche operators)</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Advice: Choose an Airline, Not a Variant</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    Since the rating is the same, choose based on the Airline's Fleet Mix:
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">Choose a -100 Operator (e.g., Delta, SWISS)</h4>
                      <p className="text-xs text-emerald-700">If you want to fly into unique, challenging airports with short runways. The -100 has a better thrust-to-weight ratio and can get in and out of places the -300 cannot. It is the largest aircraft certified for London City Airport (LCY) due to its steep approach capabilities.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Choose a -300 Operator (e.g., Air France, JetBlue, Breeze)</h4>
                      <p className="text-xs text-blue-700">If you want maximum job security and variety. With a backlog of over 700 units, this variant is the industry standard for "long and thin" routes, including some trans-Atlantic hops. It is easier to land smoothly due to its longer fuselage.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Pilot Recognition Verdict</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "Don't worry about choosing a variant—focus on getting the BD-500 rating. Once you have it, you are part of an elite group of ~5,000 pilots who can fly the most modern narrow-body fleet in the world. If you want the 'purest' flying experience, aim for the -100; if you want the most stable career path, the -300 is the king of the backlog."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id === 'a220-100' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A220-100 vs. A220-300: The Common Type Rating</h3>
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200 mb-4">
                    <p className="text-sm text-sky-700 leading-relaxed font-semibold mb-2">
                      Important: Pilots do not choose between them.
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed mb-2">
                      Because they share a Common Type Rating (BD-500), when you get rated on one, you are legally qualified to fly both. The FAA and EASA recognize them under the same "BD-500" endorsement.
                    </p>
                    <ul className="space-y-1 text-sm text-slate-700">
                      <li><strong>One License, Two Planes:</strong> Training centers offer the rating for both simultaneously.</li>
                      <li><strong>99% Commonality:</strong> Both variants share the same engines, flight deck, and internal systems.</li>
                      <li><strong>Unified Training:</strong> Airlines typically train pilots on the -300 and provide a brief differences module for the -100.</li>
                      <li><strong>Mixed-Fleet Flying:</strong> At airlines that operate both, pilots will often fly a -100 in the morning and a -300 in the afternoon on the same schedule.</li>
                      <li><strong>Current Status:</strong> Both are in high production. Neither is retiring; the -300 is entering its "golden age" of deliveries.</li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Which Variant is "Best" for You?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    While you get both on your license, pilots often prefer one over the other based on the type of flying they want to do:
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-100 (The "Sports Car")</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A220-300 (The "Workhorse")</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Handling</td>
                          <td className="p-2 border border-slate-200">More "twitchy" and responsive; feels lighter on controls</td>
                          <td className="p-2 border border-slate-200">More stable and "heavy" feel; smoother in turbulence</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Routes</td>
                          <td className="p-2 border border-slate-200">Short, high-frequency, or niche (Steep approaches)</td>
                          <td className="p-2 border border-slate-200">Long-haul narrow-body (Trans-con/Trans-atlantic)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Prestige</td>
                          <td className="p-2 border border-slate-200">Access to restricted airports like London City (LCY)</td>
                          <td className="p-2 border border-slate-200">Access to high-capacity "flagship" routes for major airlines</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Landing</td>
                          <td className="p-2 border border-slate-200">Harder to "grease" (shorter, more sensitive)</td>
                          <td className="p-2 border border-slate-200">Easier to land smoothly (longer wheelbase)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Best For</td>
                          <td className="p-2 border border-slate-200">Pilots who love stick-and-rudder handling</td>
                          <td className="p-2 border border-slate-200">Pilots who want stability and long-range flying</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Airlines by Variant (As of April 2026)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    The A220-300 is the "volume seller" with many more operators, while the A220-100 is a niche specialist for restricted airports.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-2">Airlines Flying BOTH</h4>
                      <ul className="space-y-1 text-xs text-purple-700">
                        <li>Delta Air Lines</li>
                        <li>SWISS</li>
                        <li>ITA Airways</li>
                        <li>Bulgaria Air</li>
                        <li>Air Canada</li>
                        <li>Korean Air</li>
                        <li>QantasLink</li>
                        <li>Croatia Airlines</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">A220-300 ONLY</h4>
                      <ul className="space-y-1 text-xs text-blue-700">
                        <li>airBaltic (All-A220 fleet)</li>
                        <li>JetBlue</li>
                        <li>Air France</li>
                        <li>Breeze Airways</li>
                        <li>EgyptAir</li>
                        <li>Iraqi Airways</li>
                        <li>Air Austral</li>
                        <li>Air Tanzania</li>
                        <li>Cyprus Airways</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-2">A220-100 ONLY</h4>
                      <ul className="space-y-1 text-xs text-emerald-700">
                        <li>Executive/Private Jets</li>
                        <li>(Niche operators)</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Advice: Choose an Airline, Not a Variant</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    Since the rating is the same, choose based on the Airline's Fleet Mix:
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">Choose a -100 Operator (e.g., Delta, SWISS)</h4>
                      <p className="text-xs text-emerald-700">If you want to fly into unique, challenging airports with short runways. The -100 has a better thrust-to-weight ratio and can get in and out of places the -300 cannot. It is the largest aircraft certified for London City Airport (LCY) due to its steep approach capabilities.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Choose a -300 Operator (e.g., Air France, JetBlue, Breeze)</h4>
                      <p className="text-xs text-blue-700">If you want maximum job security and variety. With a backlog of over 700 units, this variant is the industry standard for "long and thin" routes, including some trans-Atlantic hops. It is easier to land smoothly due to its longer fuselage.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Pilot Recognition Verdict</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "Don't worry about choosing a variant—focus on getting the BD-500 rating. Once you have it, you are part of an elite group of ~5,000 pilots who can fly the most modern narrow-body fleet in the world. If you want the 'purest' flying experience, aim for the -100; if you want the most stable career path, the -300 is the king of the backlog."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id === 'a320' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A320 Comparison Profile</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    The A320 is most frequently compared to its arch-rival, the Boeing 737, and its smaller, more modern sibling, the Airbus A220.
                  </p>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airbus A320 (CEO/NEO)</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Boeing 737 (NG/MAX)</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airbus A220-300</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Control System</td>
                          <td className="p-2 border border-slate-200">Sidestick / Fly-By-Wire</td>
                          <td className="p-2 border border-slate-200">Control Yoke / Cables (Manual)</td>
                          <td className="p-2 border border-slate-200">Sidestick / Fly-By-Wire</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Cockpit Tech</td>
                          <td className="p-2 border border-slate-200">Glass Cockpit / ECAM</td>
                          <td className="p-2 border border-slate-200">Glass Cockpit / Overhead Panels</td>
                          <td className="p-2 border border-slate-200">Advanced 5-Screen / Mouse-CCU</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Training Path</td>
                          <td className="p-2 border border-slate-200">Foundation for A330/A350</td>
                          <td className="p-2 border border-slate-200">Foundation for 777/787</td>
                          <td className="p-2 border border-slate-200">Standalone (Niche)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Pilot Comfort</td>
                          <td className="p-2 border border-slate-200">High (Tray table, wider cockpit)</td>
                          <td className="p-2 border border-slate-200">Moderate (Cramped, no table)</td>
                          <td className="p-2 border border-slate-200">High (Newest design)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Market Role</td>
                          <td className="p-2 border border-slate-200">Global Backbone</td>
                          <td className="p-2 border border-slate-200">Global Backbone</td>
                          <td className="p-2 border border-slate-200">High-Efficiency Specialist</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Handling</td>
                          <td className="p-2 border border-slate-200">"Law" Protected (Stable)</td>
                          <td className="p-2 border border-slate-200">Traditional (Manual feel)</td>
                          <td className="p-2 border border-slate-200">"Law" Protected (Responsive)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A320ceo vs. A320neo: Pilot's Quick Fact Sheet</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    While the "office" remains virtually identical, the performance jump is substantial.
                  </p>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A320ceo (Current Engine Option)</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">A320neo (New Engine Option)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Engines</td>
                          <td className="p-2 border border-slate-200">CFM56-5B or IAE V2500</td>
                          <td className="p-2 border border-slate-200">CFM LEAP-1A or PW1100G-JM</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Fuel Burn</td>
                          <td className="p-2 border border-slate-200">Standard Efficiency</td>
                          <td className="p-2 border border-slate-200">15–20% Lower Fuel Burn</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Range</td>
                          <td className="p-2 border border-slate-200">~6,200 km (3,350 nm)</td>
                          <td className="p-2 border border-slate-200">~6,400 km (3,450 nm)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Max Capacity</td>
                          <td className="p-2 border border-slate-200">180 Passengers</td>
                          <td className="p-2 border border-slate-200">194 Passengers</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Noise Level</td>
                          <td className="p-2 border border-slate-200">Standard</td>
                          <td className="p-2 border border-slate-200">50% Quieter</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Sharklets</td>
                          <td className="p-2 border border-slate-200">Optional (Retrofit or later models)</td>
                          <td className="p-2 border border-slate-200">Standard</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Key Technical Intelligence</h3>
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">95% Airframe Commonality</h4>
                      <p className="text-xs text-emerald-700">From a pilot's perspective, the cockpit and operational philosophy are largely unchanged. This means a pilot can fly an A320ceo one day and an A320neo the next with only minor differences training.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Engine Innovation</h4>
                      <p className="text-xs text-blue-700">The "neo" uses larger fan diameters and higher bypass ratios to achieve its efficiency. Specifically, the Pratt & Whitney PW1100G uses a unique Geared Turbofan system, allowing the fan and turbine to spin at their respective optimal speeds.</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">Weight & Performance</h4>
                      <p className="text-xs text-purple-700">The "neo" is roughly 1.8 tonnes heavier than the "ceo," but pilots enjoy better climb performance, often reaching initial cruise altitudes (FL350) much faster.</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <h4 className="text-sm font-semibold text-orange-800 mb-1">Aero Enhancements</h4>
                      <p className="text-xs text-orange-700">Standard Sharklets (2.4m tall wingtip devices) improve the lift-to-drag ratio, reducing fuel consumption by up to 4% on long-haul routes.</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Strategic Advice for Pilots</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">A320 vs. Boeing 737</h4>
                      <p className="text-xs text-purple-700"><strong>The Choice:</strong> Choose the A320 if you prefer a modern, ergonomic office with a tray table and a sidestick that does a lot of the "heavy lifting" for you via flight envelope protections.</p>
                      <p className="text-xs text-purple-700 mt-2"><strong>The Career:</strong> The A320 rating is generally considered more "flexible" globally, as the systems logic prepares you perfectly for the larger A330 and A350 widebodies.</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h4 className="text-sm font-semibold text-orange-800 mb-1">A320 vs. A220</h4>
                      <p className="text-xs text-orange-700"><strong>The Choice:</strong> Choose the A320 if you want the widest possible variety of airlines to work for. While the A220 is "newer" and "fancier," the A320 has 10x the number of jobs available worldwide.</p>
                      <p className="text-xs text-orange-700 mt-2"><strong>The Career:</strong> The A320 is the safer "long-term" bet for job security, while the A220 is a "boutique" rating for pilots who want to fly the latest tech on specific regional/mainline routes.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">PILOT RECOGNITION VERDICT</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "The A320 is the industry standard. If you are looking for your first jet rating, this is the one. It offers the best balance of pay, global job mobility, and a clear path to widebody 'Heavy' aircraft later in your career."
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 mt-4">
                    <h3 className="text-sm font-bold text-emerald-800 mb-1 uppercase tracking-wide">CEO vs. NEO Summary</h3>
                    <p className="text-sm text-emerald-700 leading-relaxed italic">
                      "The 'neo' is the smarter, greener version of the world's most popular jet. While it feels the same in your hands, the fuel savings and range boost make it the clear choice for airlines looking toward 2030 and beyond."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id === 'a330' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">A320 to A330: The Career Leap</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    This transition chart shows A320 pilots exactly how to level up their careers. It highlights how Airbus's Common Cockpit Philosophy turns a narrow-body pilot into a wide-body "Heavy" pilot with minimal friction.
                  </p>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-600 border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="text-left p-2 border border-slate-200 font-semibold">Feature</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airbus A320 (The Foundation)</th>
                          <th className="text-left p-2 border border-slate-200 font-semibold">Airbus A330 (The Heavy Step)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Typical Mission</td>
                          <td className="p-2 border border-slate-200">1–4 Hour Regional Sectors</td>
                          <td className="p-2 border border-slate-200">6–12 Hour Long-Haul Layovers</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Flight Deck</td>
                          <td className="p-2 border border-slate-200">Standard 6-screen Glass Cockpit</td>
                          <td className="p-2 border border-slate-200">95% Identical (Familiar layout)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Sidestick Logic</td>
                          <td className="p-2 border border-slate-200">Normal/Alternate/Direct Law</td>
                          <td className="p-2 border border-slate-200">Same Laws (Scale adjusted for mass)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Training Path</td>
                          <td className="p-2 border border-slate-200">Full Type Rating (4-6 weeks)</td>
                          <td className="p-2 border border-slate-200">CCQ Short Course (8-10 Days)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Pilot Workload</td>
                          <td className="p-2 border border-slate-200">High (Multiple takeoffs/landings per day)</td>
                          <td className="p-2 border border-slate-200">Low (Cruise-heavy, 1 takeoff/landing)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Wake Category</td>
                          <td className="p-2 border border-slate-200">Medium</td>
                          <td className="p-2 border border-slate-200">Heavy (Enhanced prestige/pay)</td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-slate-200 font-semibold">Bunk/Rest</td>
                          <td className="p-2 border border-slate-200">None (Flight deck only)</td>
                          <td className="p-2 border border-slate-200">Dedicated Crew Rest Compartments</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Why the Transition is the "Smartest Move" in Aviation</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-1">1. The CCQ (Cross-Crew Qualification) Advantage</h4>
                      <p className="text-xs text-emerald-700">Because the A330 was designed to be handled just like an A320, the training is essentially a "differences" course. You learn the Trim Tank (fuel in the tail for CG balance) and the larger landing gear geometry, but you don't have to re-learn how to fly the airplane.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">2. Physical Handling: "A320 on Slow Motion"</h4>
                      <p className="text-xs text-blue-700">Pilots transitioning to the A330 often describe it as flying an A320 that has been slowed down. The aircraft is much heavier (242 tonnes vs 78 tonnes), so it has more inertia. It responds slightly slower to sidestick inputs, which many pilots find makes it easier and smoother to land.</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">3. Lifestyle & Pay Jump</h4>
                      <p className="text-xs text-purple-700"><strong>The Pay:</strong> Moving to the A330 usually triggers "Widebody Pay Scales," which are typically 15-25% higher than narrow-body rates for the same seniority level.</p>
                      <p className="text-xs text-purple-700 mt-2"><strong>The Lifestyle:</strong> Instead of flying 4 sectors and sleeping at home, you fly one long sector and spend 24–48 hours in cities like Tokyo, London, or Rio.</p>
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200 mb-4">
                    <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Strategic Advice: The "A330 Passport"</h3>
                    <p className="text-sm text-sky-700 leading-relaxed italic">
                      "If you are an A320 pilot, the A330 rating is your passport to the world. It is the most efficient way to get 'Heavy' time in your logbook. Once you have A330 time, you are a prime candidate for the A350, as the commonality continues upward through the entire Airbus family."
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <h3 className="text-sm font-bold text-emerald-800 mb-1 uppercase tracking-wide">The "Pilot Recognition" Verdict</h3>
                    <p className="text-sm text-emerald-700 leading-relaxed italic">
                      "Don't stay in the narrow-body lane forever. If your airline operates both, or if you're looking to move to a global carrier, the A330 is the most logical and highest-ROI upgrade for an A320-rated pilot."
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'Comparison' && selectedAircraft.id !== 'a220-300' && selectedAircraft.id !== 'a220-100' && selectedAircraft.id !== 'a320' && selectedAircraft.id !== 'a330' && (
                <p className="text-sm text-slate-500 italic">Comparison data is not available for this aircraft.</p>
              )}
            </div>

            {/* Training Curriculum */}
            <div className="px-6 md:px-8 py-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Training Curriculum</h3>
              <div className="space-y-4">
                {selectedAircraft.training_requirements?.curriculum?.map((item: any, i: number) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{item.phase}</h4>
                      <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded">{item.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.topics.map((topic, j) => (
                        <span key={j} className="text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">{topic}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulator Details */}
            <div className="px-6 md:px-8 py-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Simulator Training</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Simulator Type</p>
                    <p className="font-semibold text-slate-900">{(selectedAircraft.training_requirements?.simulator as any)?.type || 'Full Flight Simulator'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Available Locations</p>
                    <p className="font-semibold text-slate-900">{((selectedAircraft.training_requirements?.simulator as any)?.locations || []).join(', ')}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-1">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {((selectedAircraft.training_requirements?.simulator as any)?.features || []).map((feature: string, i: number) => (
                      <span key={i} className="text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">{feature}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
      </div>

      {/* Extended Info Modal */}
      {showExtendedInfo && selectedAircraft && selectedAircraft.id === 'a220-300' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-full flex items-start justify-center p-4 pt-10 pb-10">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative">
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl sticky top-0 z-10">
                <h2 className="text-xl font-bold text-slate-900">{selectedAircraft.model} — Pilot Career Outlook</h2>
                <button
                  onClick={() => setShowExtendedInfo(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">The "Why": Pilot Benefits vs. Other Airbus Ratings</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    Unlike the A320 or A350, the A220 was a "clean-sheet" design (originally the Bombardier CSeries). This offers specific advantages:
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Modernity:</strong> It features a newer flight deck than the A320. It uses Sidestick controllers and a Fly-By-Wire system, but with the latest tech—including five large LCD screens and an electronic flight bag (EFB) integrated from day one.</li>
                    <li><strong>Steep Approach Capability:</strong> It is certified for steep approaches (like London City), giving pilots access to challenging, prestigious, and "fun" airports that many standard narrow-bodies can't touch.</li>
                    <li><strong>Comfort:</strong> Because the cabin altitude is lower and the windows are larger, crew fatigue is often reported as lower compared to older narrow-body fleets.</li>
                    <li><strong>The "Cross-Crew Qualification" (CCQ):</strong> While it is a distinct type rating from the A320 family, Airbus has worked to harmonize training. For a pilot, having an A220 rating on a license is currently a "boutique" skill that sets them apart from the massive pool of A320-rated pilots.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">Market Demand & Backlog (Job Security)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    The A220 is not just "in demand"—it has one of the healthiest backlogs in its segment, ensuring decades of flying for newly rated pilots.
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Total Orders:</strong> 959 firm orders from 33–34 different customers.</li>
                    <li><strong>Remaining Backlog:</strong> Approximately 458 aircraft are still waiting to be built and delivered as of April 2026.</li>
                    <li><strong>Production Goal:</strong> Airbus is aiming to ramp up to 12 aircraft per month by the end of 2026.</li>
                    <li><strong>Market Share:</strong> The A220 family holds over 55% market share in the small single-aisle commercial aircraft sector.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">A220 Pilot Community</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    The A220 pilot community is relatively small compared to legacy types, creating excellent opportunities for newly rated pilots.
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Global Community Size:</strong> Approximately 5,000+ pilots (vs. 150,000+ for A320 family).</li>
                    <li><strong>Pilots Per Aircraft:</strong> Major airlines typically employ 10-12 pilots per aircraft for duty limits and scheduling.</li>
                    <li><strong>Major Employers:</strong> Delta Air Lines (85 aircraft), airBaltic (all-A220 fleet, 54 aircraft, 1,500+ pilots), JetBlue (61), Air France (55), Breeze Airways (54).</li>
                    <li><strong>Growth Potential:</strong> The backlog will require approximately 4,500-5,500 additional A220-rated pilots in coming years to staff new deliveries.</li>
                    <li><strong>Certification:</strong> Listed as BD-500 by aviation authorities (reflecting Bombardier CSeries origins), covers both A220-100 and A220-300 under a single rating.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">Operational Reliability & Reach</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">
                    Pilots can use these stats to judge the maturity of the "office" they will be working in:
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Flight Hours:</strong> The global fleet has surpassed 3.65 million block hours.</li>
                    <li><strong>Flight Cycles:</strong> Over 2.08 million flights completed.</li>
                    <li><strong>Route Network:</strong> The A220 currently serves over 1,900 routes to more than 500 destinations.</li>
                    <li><strong>Reliability:</strong> Maintains a 99% operational reliability (3-month rolling average), making it a highly dependable machine for flight crews.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">Why Pilots Choose It (Technical Perks)</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Modern Cockpit:</strong> Features five 15.1-inch LCD displays and full Fly-By-Wire technology.</li>
                    <li><strong>Environmentally Leading:</strong> 25% lower fuel burn and CO2 emissions per seat compared to previous generation aircraft.</li>
                    <li><strong>Maintenance Intervals:</strong> Pilots deal with fewer mechanical groundings due to longer intervals: 1,000 hours for "A" checks and 8,500 hours for "C" checks.</li>
                  </ul>
                </section>

                <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                  <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Summary for Pilots</h3>
                  <p className="text-sm text-sky-700 leading-relaxed italic">
                    "This aircraft is at the 'peak of its youth.' With over 500 planes in the air and another 450+ on the way, an A220 type rating is one of the most future-proof credentials a pilot can hold right now."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Disclaimer */}
      <div className="px-6 md:px-8 pb-6 border-t border-slate-200 pt-5 bg-white relative z-10">
        <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 max-w-7xl mx-auto">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-slate-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-900 mb-1">Data Disclaimer</p>
              <p className="text-xs text-slate-800 leading-relaxed">
                PilotRecognition.com is operated by a university research pilot group for the benefit of helping pilots to be aware and connect more to the industry. This platform matches pilots with current industry information publicly available and sourced across the internet through various credible sources to help pilots align their profiles. All information presented is compiled from publicly available sources for informational purposes only. This platform is not currently affiliated with, endorsed by, or sponsored by any airline, though we plan to establish partnerships in the future. Airline logos, trademarks, and branding are used under fair use principles solely for identification and informational purposes to help pilots understand industry requirements. No airline has verified, endorsed, or approved any information on this platform. All salary ranges, requirements, and assessment processes are estimates based on available public data and may not reflect current airline policies. Aircraft specifications and fleet information are sourced from public manufacturer announcements, aviation industry reports, and publicly available delivery data for pilot awareness purposes only—not for competitive intelligence. We welcome data sharing agreements with manufacturers to ensure accuracy and offer to remove or correct inaccurate data per manufacturer request. PilotRecognition+ membership provides AI-powered data comparison tools to help pilots align their profiles with airline expectations. Any fees charged are solely for platform development and AI optimization services, not for access to airline data. Users should conduct their own due diligence and verify all information directly with official sources before making career decisions. This platform provides general guidance only and does not constitute professional career, legal, or financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
  );
}
