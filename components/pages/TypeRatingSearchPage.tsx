import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plane, Star, DollarSign, Calendar, Gauge, Building2, BookOpen, MousePointerClick, Briefcase, X, Globe, Users, User, Clock, Award, Shield, Bookmark } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { BookmarkService } from '@/services/bookmarkService';
import { PathwaysSidebar } from '@/components/website/components/pilot-recognition/PathwaysSidebar';
import { PlatformNavbar } from '@/components/website/components/PlatformNavbar';
import { ManufacturerPreviewCard } from '@/components/website/components/pilot-recognition/ManufacturerPreviewCard';
import { AircraftPreviewCard } from '@/components/website/components/pilot-recognition/AircraftPreviewCard';
import { ManufacturerAircraftCarousel } from '@/components/website/components/pilot-recognition/ManufacturerAircraftCarousel';
import { AircraftLogbookStylePanel } from '@/components/website/components/pilot-recognition/AircraftLogbookStylePanel';
import { safeRedirect } from '@/lib/url-validator';
import {
  manufacturers as rawManufacturers,
  aircraftTypeRatings as rawAircraftTypeRatings,
} from '@/data/aircraft-manufacturers';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
  training_curriculum?: any;
  simulator_details?: any;
  career_info?: any;
  hiring_requirements?: any;
  compensation_data?: any;
  comparison_data?: any;
  show_career_outlook?: boolean;
  extended_info_content?: any;
  demandLevel?: 'none' | 'high' | 'medium' | 'low';
  lifecycleStage?: 'early-career' | 'mid-career' | 'mature' | 'retiring' | 'end-of-life';
  lifecycle_stage?: 'early-career' | 'mid-career' | 'mature' | 'retiring' | 'end-of-life';
  orderBacklog?: { orders: number; delivered: number };
  operatorCount?: number;
  operator_count?: number;
  pilotCount?: number;
  pilot_count?: number;
  careerScore?: number;
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


interface TypeRatingSearchPageProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export default function TypeRatingSearchPage({ onNavigate, onBack }: TypeRatingSearchPageProps) {
  const { currentUser, userProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const auth = useAuth();

  // Check subscription status
  const isRecognitionPlus = userProfile?.subscription_tier === 'recognition_plus' || userProfile?.subscription_tier === 'enterprise';
  const isLoggedIn = !!currentUser;
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftTypeRating | null>(null);
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingManufacturerId, setPendingManufacturerId] = useState<string | null>(null);
  const manufacturerCarouselRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Universal search entity tabs
  type EntityType = 'all' | 'manufacturers' | 'airlines' | 'operators' | 'private-jet';
  const [activeEntity, setActiveEntity] = useState<EntityType>('all');
  const [activeEntityCategory, setActiveEntityCategory] = useState<string>('All');

  const ENTITY_TABS: { id: EntityType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'manufacturers', label: 'Manufacturers' },
    { id: 'airlines', label: 'Airlines' },
    { id: 'operators', label: 'Operators' },
    { id: 'private-jet', label: 'Private Jet' },
  ];

  // Logo folder categories — matches /images/manufacturer-logos/<category>/
  const FOLDER_CATEGORY_LABELS: Record<string, string> = {
    'commercial-jets': 'Commercial Jets',
    'regional-aircraft': 'Regional Aircraft',
    'business-private-jets': 'Business & Private Jets',
    'helicopters': 'Helicopters',
    'military-defense': 'Military & Defense',
    'general-aviation': 'General Aviation',
    'evtol-uam': 'eVTOL & UAM',
    'agricultural-utility': 'Agricultural & Utility',
    'autonomous-cargo': 'Autonomous Cargo',
    'survey-utility': 'Survey & Utility',
    'other': 'Other',
  };

  const getManufacturerFolderCategory = (manufacturerId: string): string => {
    const path = MANUFACTURER_LOGOS[manufacturerId];
    if (!path) return 'other';
    const match = path.match(/\/manufacturer-logos\/([^/]+)\//);
    return match ? match[1] : 'other';
  };

  const ENTITY_CATEGORIES: Record<EntityType, string[]> = {
    all: ['All'],
    manufacturers: ['All', ...Array.from(new Set(Object.values(FOLDER_CATEGORY_LABELS))).sort()],
    airlines: ['All', 'International', 'Regional', 'Low-Cost', 'Cargo', 'Legacy'],
    operators: ['All', 'Commercial', 'Corporate', 'Charter', 'Cargo', 'Training'],
    'private-jet': ['All', 'Light', 'Mid-Size', 'Super Mid-Size', 'Large', 'Ultra-Long Range'],
  };

  // Data — manufacturers load immediately from hardcoded data (old version behavior)
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(HARDCODED_MANUFACTURERS);
  const [aircraftTypeRatings, setAircraftTypeRatings] = useState<AircraftTypeRating[]>(HARDCODED_AIRCRAFT);
  const [dataLoading, setDataLoading] = useState(true);

  // Filter manufacturers shown in the carousel by search query and category
  const filteredManufacturers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = manufacturers;
    if (activeEntity === 'manufacturers' && activeEntityCategory !== 'All') {
      result = result.filter(m => FOLDER_CATEGORY_LABELS[getManufacturerFolderCategory(m.id)] === activeEntityCategory);
    }
    if (!query) return result;
    return result.filter(m => m.name.toLowerCase().includes(query));
  }, [searchQuery, manufacturers, activeEntity, activeEntityCategory]);

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


  // Get available categories for selected manufacturer

  // Get categories specifically available for the selected manufacturer
  const manufacturerCategories = React.useMemo(() => {
    if (!selectedManufacturer) return [];
    const categories = new Set<string>();
    aircraftTypeRatings
      .filter(a => a.manufacturer_id === selectedManufacturer.id)
      .forEach(a => categories.add(a.category));
    return Array.from(categories).sort();
  }, [selectedManufacturer, aircraftTypeRatings]);


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


  const handleSelect = (aircraft: AircraftTypeRating) => {
    setSelectedAircraft(aircraft);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const handleManufacturerSelect = (manufacturer: Manufacturer) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setPendingManufacturerId(manufacturer.id);

    // Pause auto-scroll during the transition
    if (manufacturerCarouselRef.current) {
      manufacturerCarouselRef.current.style.overflowX = 'hidden';
    }

    setTimeout(() => {
      setSelectedManufacturer(manufacturer);
      setSelectedAircraft(null);
      setSearchQuery('');
      setTimeout(() => {
        setIsTransitioning(false);
        setPendingManufacturerId(null);
        if (manufacturerCarouselRef.current) {
          manufacturerCarouselRef.current.style.overflowX = 'auto';
        }
      }, 650);
    }, 420);
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
              <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none opacity-[0.22]" style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>
                <div className="space-y-16">
                  {[...Array(12)].map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className={`flex gap-24 ${rowIndex % 2 === 1 ? 'pl-32' : ''}`}
                    >
                      {[...Array(14)].map((_, i) => (
                        <img key={`${selectedManufacturer.id}-${rowIndex}-${i}`} src={selectedManufacturer.logo} alt={selectedManufacturer.name} className="h-10 w-auto object-contain flex-shrink-0" />
                      ))}
                    </div>
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
            <motion.div
              key="manufacturer-preview"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="px-4 md:px-8 lg:px-12"
            >
              <ManufacturerPreviewCard manufacturer={selectedManufacturer} />
            </motion.div>
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
        <AnimatePresence mode="wait" initial={false}>
          {selectedManufacturer ? (
            <motion.div
              key="aircraft-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="pt-1 pb-3 px-5"
            >
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: EASE_OUT_EXPO }}
                className="mt-4 flex items-center gap-2 max-w-5xl mx-auto px-2 sm:px-0"
              >
                <button
                  onClick={() => { setSelectedCategory('all'); setSelectedManufacturer(null); setSelectedAircraft(null); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap backdrop-blur-xl border border-red-500/40 text-white hover:bg-red-500/20 transition-all flex-shrink-0"
                  style={{ background: 'rgba(239, 68, 68, 0.85)', boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                >
                  <X className="w-3 h-3" />
                  Cancel Filter
                </button>

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
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="manufacturer-stage"
              ref={manufacturerCarouselRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="flex gap-3 overflow-x-auto pt-1 pb-3 px-5 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {filteredManufacturers.map((manufacturer, index) => (
                <motion.button
                  key={manufacturer.id}
                  initial={{ opacity: 0, y: 24, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.02,
                    duration: 0.45,
                    ease: EASE_OUT_EXPO,
                  }}
                  whileHover={{ y: -6, scale: 1.04, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.14)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleManufacturerSelect(manufacturer)}
                  disabled={isTransitioning}
                  className="flex-shrink-0 rounded-lg relative overflow-hidden text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    width: '160px',
                    border: '2px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Animated glow overlay on tap */}
                  {isTransitioning && pendingManufacturerId === manufacturer.id && (
                    <motion.div
                      className="absolute inset-0 z-0 rounded-lg"
                      style={{ background: 'radial-gradient(circle at center, rgba(14,165,233,0.55) 0%, transparent 70%)' }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 1, 0.6], scale: [0.5, 1.6, 2.2] }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  )}
                  {/* Top: Logo on light background */}
                  <div className="h-[85px] relative overflow-hidden flex items-center justify-center p-3 rounded-t-lg" style={{ background: '#f3f4f6' }}>
                    <motion.img
                      src={manufacturer.logo}
                      alt={manufacturer.name}
                      className="w-full h-full object-contain relative z-10"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {/* Bottom: Name on dark bg */}
                  <div className="p-3 relative z-10">
                    <p className="text-sm font-bold text-white truncate">{manufacturer.name}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(selectedAircraft || selectedManufacturer) && (
        <div className="text-center mt-2 mb-1">
          <p className="text-sm text-red-500 font-medium tracking-wide drop-shadow-sm">
            {selectedAircraft ? (
              <>Scroll down to discover more about {selectedAircraft.model}</>
            ) : (
              <>Scroll down to discover more about {selectedManufacturer?.name}</>
            )}
          </p>
        </div>
      )}

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
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 text-white/80">Discover Pathways</p>
                <div className="relative flex items-center justify-center">
                  <select
                    value={activeEntity}
                    onChange={(e) => { setActiveEntity(e.target.value as EntityType); setActiveEntityCategory('All'); }}
                    className="w-full bg-transparent text-white text-sm font-semibold appearance-none cursor-pointer focus:outline-none pr-6"
                  >
                    {ENTITY_TABS.map(tab => (
                      <option key={tab.id} value={tab.id} className="bg-slate-900 text-white">{tab.label}</option>
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
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 text-white/80">Category</p>
                <div className="relative flex items-center justify-center">
                  <select
                    value={activeEntityCategory}
                    onChange={(e) => setActiveEntityCategory(e.target.value)}
                    className="w-full bg-transparent text-white text-sm font-semibold appearance-none cursor-pointer focus:outline-none pr-6"
                  >
                    {ENTITY_CATEGORIES[activeEntity].map(cat => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
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
      <div className="relative z-10 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-12">
        {/* Press/media style repeating selected manufacturer logo wall */}
        {selectedManufacturer && (
          <div className="absolute -inset-8 overflow-hidden z-0 pointer-events-none opacity-[0.16]" style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>
            <div className="space-y-16">
              {[...Array(18)].map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`flex gap-24 ${rowIndex % 2 === 1 ? 'pl-32' : ''}`}
                >
                  {[...Array(14)].map((_, i) => (
                    <img key={`${selectedManufacturer.id}-${rowIndex}-${i}`} src={selectedManufacturer.logo} alt={selectedManufacturer.name} className="h-9 w-auto object-contain flex-shrink-0" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative z-10">
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
        // Manufacturer details when selected
        <>
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
              Choose any aircraft from the manufacturer carousel above to view its specifications, training requirements, manufacturer details, and career information.
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
        <div id="aircraft-detail-section" ref={detailRef} className="max-w-7xl mx-auto px-6 mb-12">
          <AircraftLogbookStylePanel
            aircraft={selectedAircraft}
            manufacturer={getManufacturer(selectedAircraft)}
            onShowExtendedInfo={() => setShowExtendedInfo(true)}
          />
        </div>
      )}
        </div>
      </div>

      {/* Extended Info Modal */}
      {showExtendedInfo && selectedAircraft && selectedAircraft.id === 'a220-300' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-full flex items-start justify-center p-4 pt-10 pb-10">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative">
              <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl sticky top-0 z-10">
                <h2 className="text-xl font-bold text-slate-900">{selectedAircraft.model} — Pilot Career Outlook</h2>
                <button onClick={() => setShowExtendedInfo(false)} className="p-2 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">The "Why": Pilot Benefits vs. Other Airbus Ratings</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-2">Unlike the A320 or A350, the A220 was a "clean-sheet" design (originally the Bombardier CSeries). This offers specific advantages:</p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Modernity:</strong> It features a newer flight deck than the A320. It uses Sidestick controllers and a Fly-By-Wire system, but with the latest tech—including five large LCD screens and an electronic flight bag (EFB) integrated from day one.</li>
                    <li><strong>Steep Approach Capability:</strong> It is certified for steep approaches (like London City), giving pilots access to challenging, prestigious, and "fun" airports.</li>
                    <li><strong>Comfort:</strong> Because the cabin altitude is lower and the windows are larger, crew fatigue is often reported as lower compared to older narrow-body fleets.</li>
                    <li><strong>The CCQ:</strong> While it is a distinct type rating from the A320 family, Airbus has worked to harmonize training. For a pilot, having an A220 rating is currently a "boutique" skill.</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">Market Demand & Backlog (Job Security)</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Total Orders:</strong> 959 firm orders from 33–34 different customers.</li>
                    <li><strong>Remaining Backlog:</strong> Approximately 458 aircraft still waiting to be delivered as of April 2026.</li>
                    <li><strong>Production Goal:</strong> Airbus is aiming to ramp up to 12 aircraft per month by the end of 2026.</li>
                    <li><strong>Market Share:</strong> The A220 family holds over 55% market share in its segment.</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">A220 Pilot Community</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Global Community Size:</strong> Approximately 5,000+ pilots (vs. 150,000+ for A320 family).</li>
                    <li><strong>Pilots Per Aircraft:</strong> Major airlines typically employ 10-12 pilots per aircraft.</li>
                    <li><strong>Major Employers:</strong> Delta Air Lines (85 aircraft), airBaltic (54 aircraft, 1,500+ pilots), JetBlue (61), Air France (55), Breeze Airways (54).</li>
                    <li><strong>Growth Potential:</strong> The backlog will require approximately 4,500-5,500 additional A220-rated pilots.</li>
                    <li><strong>Certification:</strong> Listed as BD-500 by aviation authorities, covering both A220-100 and A220-300 under a single rating.</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">Operational Reliability & Reach</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Flight Hours:</strong> The global fleet has surpassed 3.65 million block hours.</li>
                    <li><strong>Flight Cycles:</strong> Over 2.08 million flights completed.</li>
                    <li><strong>Route Network:</strong> The A220 currently serves over 1,900 routes to more than 500 destinations.</li>
                    <li><strong>Reliability:</strong> Maintains a 99% operational reliability (3-month rolling average).</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-sky-700 mb-2">Why Pilots Choose It (Technical Perks)</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li><strong>Modern Cockpit:</strong> Features five 15.1-inch LCD displays and full Fly-By-Wire technology.</li>
                    <li><strong>Environmentally Leading:</strong> 25% lower fuel burn and CO2 emissions per seat.</li>
                    <li><strong>Maintenance Intervals:</strong> 1,000 hours for "A" checks and 8,500 hours for "C" checks.</li>
                  </ul>
                </section>
                <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                  <h3 className="text-sm font-bold text-sky-800 mb-1 uppercase tracking-wide">Summary for Pilots</h3>
                  <p className="text-sm text-sky-700 leading-relaxed italic">"This aircraft is at the 'peak of its youth.' With over 500 planes in the air and another 450+ on the way, an A220 type rating is one of the most future-proof credentials a pilot can hold right now."</p>
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
