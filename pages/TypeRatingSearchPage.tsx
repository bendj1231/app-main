import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Plane, CheckCircle2, Star, DollarSign, Calendar, FileText, Gauge, Building2, BookOpen, MousePointerClick, Briefcase, X, Globe, Users, User, Clock, Award, Shield, ArrowLeft } from 'lucide-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '../src/contexts/AuthContext';
import { supabase } from '../src/lib/supabase';

// Types from Supabase schema
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
  first_flight?: string;
  why_choose_rating?: string;
  specifications?: any;
  news?: any;
  training_requirements?: any;
  hiring_requirements?: any;
  compensation_data?: any;
  comparison_data?: any;
  show_career_outlook?: boolean;
  extended_info_content?: any;
  demandLevel?: 'high' | 'medium' | 'low';
  lifecycleStage?: 'early-career' | 'mid-career' | 'mature' | 'retiring';
  orderBacklog?: { orders: number; delivered: number };
  operatorCount?: number;
  pilotCount?: number;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftTypeRating | null>(null);
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showRequirements, setShowRequirements] = useState(false);

  // Data from Supabase
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [aircraftTypeRatings, setAircraftTypeRatings] = useState<AircraftTypeRating[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch manufacturers and aircraft from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Fetch manufacturers
        const { data: manufacturersData, error: manufacturersError } = await supabase
          .from('manufacturers')
          .select('*');
        if (manufacturersError) {
          console.error('Error fetching manufacturers:', manufacturersError);
        } else {
          setManufacturers(manufacturersData || []);
        }

        // Fetch aircraft type ratings
        const { data: aircraftData, error: aircraftError } = await supabase
          .from('aircraft_type_ratings')
          .select('*');
        if (aircraftError) {
          console.error('Error fetching aircraft:', aircraftError);
        } else {
          setAircraftTypeRatings(aircraftData || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Auto-scroll carousel
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

  const scroll = (dir: 'left' | 'right') =>
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -288 : 288, behavior: 'smooth' });

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
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-0" />

      {/* Header Nav */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 backdrop-blur-sm">
        <div className="mx-auto pr-6 py-4 w-full max-w-[1800px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Back Button */}
                <button
                  onClick={() => onNavigate ? onNavigate('pathways-modern') : onBack ? onBack() : window.history.back()}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-transform hover:scale-105"
                  title="Back to Home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {/* Logo */}
                <div className="flex flex-col">
                  <span style={{ fontFamily: 'Georgia, serif' }} className="text-black text-2xl font-normal">
                    Discover <span className="text-red-600">Type-Ratings</span>
                  </span>
                  <span className="text-xs text-slate-600 font-normal">
                    pilotrecognition.com
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              {[
                { label: 'Airline Expectations', page: 'portal-airline-expectations' },
                { label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
                { label: 'Pilot Pathways', page: 'pathways-modern' },
                { label: 'Job Listings', page: 'job-listings' },
              ].map(({ label, page }) => {
                const isActive = page === 'type-rating-search';
                return (
                <button
                  key={page}
                  onClick={() => onNavigate && onNavigate(page)}
                  className="text-[0.6rem] font-bold uppercase tracking-[0.1em] transition-all hover:text-blue-400 flex items-center gap-1 whitespace-nowrap"
                  style={{
                    color: isActive ? '#2563eb' : '#0f172a',
                    borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                    paddingBottom: '4px'
                  }}
                >
                  {label}
                </button>
                );
              })}
            </div>

            {/* Right side items */}
            <div className="flex items-center gap-3">
              {/* Profile section */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-900">
                      {userProfile?.pilot_id || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot'}
                    </span>
                    <span className="text-[10px] text-slate-500">Signed In</span>
                  </div>
                  <button
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    {userProfile?.profile_image_url ? (
                      <img
                        src={userProfile.profile_image_url}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {currentUser?.email?.charAt(0) || 'U'}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate && onNavigate('login')}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-[0.1em] transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('become-member')}
                    className="px-4 py-2 rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-[0.1em] transition-all"
                  >
                    Become Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden pt-16 pb-12 px-6 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 via-transparent to-indigo-900/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-500 mb-3">Discover Type-Ratings</p>
          <h1 className="text-4xl md:text-6xl font-serif font-normal leading-tight mb-4 text-slate-900">
            Aircraft <span style={{ color: '#dc2626' }}>Type Ratings</span>
          </h1>
          <p className="text-lg md:text-xl mb-2 text-black">
            Explore · Manufacturers · Requirements · Specifications
          </p>

          {/* Authentication/Subscription Status Banner */}
          {!isLoggedIn ? (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Sign in to view your profile</h3>
              <p className="text-sm text-slate-600 mb-3">
                Subscribe to Recognition + to compare your profile with manufacturer type ratings and expectations & requirements.
              </p>
              <p className="text-sm text-slate-600 mb-4">
                Log in to see your flight hours, recognition score, and personalized recommendations.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('login')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          ) : isRecognitionPlus ? (
            <div className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-900">Recognition + member pilotrecognition+</h3>
              </div>
            </div>
          ) : null}

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search aircraft, manufacturers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-white/30 bg-white/90 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/50 transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Manufacturer Carousel */}
      <div className="w-full mb-8 relative z-10">
        <div className="px-6 mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-normal text-slate-900">Browse Manufacturers</h2>
          <p className="text-sm text-black">{manufacturers.length} manufacturers available</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-6 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {/* Dashboard News and Updates Card */}
          <button
            onClick={() => { setSelectedManufacturer(null); setSelectedAircraft(null); }}
            className={`flex-shrink-0 w-72 p-6 rounded-xl border-2 transition-all relative overflow-hidden ${
              !selectedManufacturer
                ? 'ring-2 ring-sky-500 border-sky-500/50 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl shadow-2xl shadow-black/30'
                : 'border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-white/30 hover:from-white/20 hover:shadow-lg shadow-black/20'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
            <div className="flex flex-col items-center justify-center h-48 relative z-10">
              <h3 className="text-black font-semibold text-center text-xl">Dashboard</h3>
              <p className="text-black/80 text-xs text-center mt-2">News & Updates</p>
            </div>
          </button>
          {manufacturers.map(manufacturer => (
            <button
              key={manufacturer.id}
              onClick={() => { setSelectedManufacturer(manufacturer); setSelectedAircraft(null); }}
              className={`flex-shrink-0 w-72 p-6 rounded-xl border-2 transition-all relative overflow-hidden ${
                selectedManufacturer?.id === manufacturer.id
                  ? 'ring-2 ring-sky-500 border-sky-500/50 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl shadow-2xl shadow-black/30'
                  : 'border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl hover:border-white/30 hover:from-white/20 hover:shadow-lg shadow-black/20'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
              <img
                src={manufacturer.logo}
                alt={manufacturer.name}
                className="w-48 h-48 object-contain mx-auto relative z-10"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section - Unified component for both default and manufacturer-specific content */}
      <div className="relative overflow-hidden mb-8 z-10 min-h-[600px]">
        {/* Dark blue background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {!selectedManufacturer ? (
            <div className="text-center text-white">
              {/* Worldwide Stats - Calculated from actual data */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">437,900+</div>
                  <div className="text-sm text-slate-300">Total Aircraft in Service</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">875,000+</div>
                  <div className="text-sm text-slate-300">Type-Rated Pilots Worldwide</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">87</div>
                  <div className="text-sm text-slate-300">Active Type Ratings</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">20</div>
                  <div className="text-sm text-slate-300">Manufacturers</div>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif font-normal mb-4">
                Discover Aircraft Manufacturers' Expectations & Type Rating Requirements
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-4xl mx-auto">
                Understanding type ratings is crucial for your career. While aircraft may seem similar, each rating opens different opportunities based on market demand, airline preferences, and career progression.
              </p>

              {/* Type Rating Requirements Section */}
              <div className="max-w-5xl mx-auto mb-12">
                <h3 className="text-2xl font-semibold mb-6 text-left">Type Rating Requirements</h3>
                
                {!showRequirements ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                    <p className="text-slate-300 text-sm mb-4">
                      Understanding type rating requirements is essential for your career progression. Learn about regulatory prerequisites, training structure, and operational details before enrolling in a course.
                    </p>
                    <button
                      onClick={() => setShowRequirements(true)}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 1. Regulatory Prerequisites & Eligibility */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left mb-6">
                      <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-sky-400" />
                        1. Regulatory Prerequisites & Eligibility
                      </h4>
                      <p className="text-slate-300 text-sm mb-4">
                        Before a pilot can enroll in a type rating course, they must meet specific certification and experience thresholds:
                      </p>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Minimum Licenses:</strong> Most candidates need a Commercial Pilot License (CPL) or an Airline Transport Pilot (ATP) certificate.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Instrument Rating (IR):</strong> Mandatory for all turbine aircraft operations.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Flight Experience:</strong> Multi-pilot aeroplanes often require at least 70 hours of Pilot-in-Command (PIC) time.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Theoretical Knowledge:</strong> Pilots must have passed the ATPL theoretical knowledge examinations.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Medical Certification:</strong> Usually a First or Second Class medical certificate is required for commercial operations.</span>
                        </li>
                      </ul>
                    </div>

                    {/* 2. Training Structure & Components */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left mb-6">
                      <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-sky-400" />
                        2. Training Structure & Components
                      </h4>
                      <p className="text-slate-300 text-sm mb-4">
                        Pilots look for the breakdown of the training phases to plan their time and study focus:
                      </p>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Ground School (Theory):</strong> Typically 80–120 hours covering aircraft systems (hydraulics, electrics, fuel), limitations, and performance data.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Simulator Training:</strong> Core certification using Level C or D Full Flight Simulators (FFS), often involving 30–50 hours.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Course Modules:</strong> Information on Differences Training (for similar models within a type) or Cross-Crew Qualification (CCQ) for transitioning between related aircraft (e.g., Airbus A320 to A330).</span>
                        </li>
                      </ul>
                    </div>

                    {/* 3. Operational & Career Details */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left mb-6">
                      <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-sky-400" />
                        3. Operational & Career Details
                      </h4>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Currency Requirements:</strong> Type ratings don't expire, but "currency" (e.g., three takeoffs and landings within 90 days) is needed to exercise privileges.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Insurance Minimums:</strong> Many operators or insurance underwriters require 100–300 hours of supervised operation in-type before a pilot can fly as PIC.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span><strong>Associated Costs:</strong> For self-funded pilots, total costs can range from $28,000 to $45,000, including examiner fees and study materials.</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => setShowRequirements(false)}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      Show Less
                    </button>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                  <h3 className="text-xl font-semibold mb-3">Market Demand</h3>
                  <p className="text-slate-300 text-sm">
                    Airlines prioritize ratings based on their fleet composition. A320/A321neo dominate short-haul, while A350/A380 lead long-haul. Choose ratings matching airline expansion plans.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                  <h3 className="text-xl font-semibold mb-3">Career Progression</h3>
                  <p className="text-slate-300 text-sm">
                    Start with high-demand narrow-body ratings (A320neo, B737MAX) for faster employment. Wide-body ratings (A350, B777) offer premium routes but require more experience.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                  <h3 className="text-xl font-semibold mb-3">Strategic Choice</h3>
                  <p className="text-slate-300 text-sm">
                    A320 vs A330: Same manufacturer, different markets. A320 = high volume, rapid hiring. A330 = medium-haul, bridge to A350. Research airline fleets before investing.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-white">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left side - Header, metadata, and stats */}
                <div className="md:w-1/3">
                  <h2 className="text-5xl md:text-7xl font-serif font-normal mb-4">{selectedManufacturer.name}</h2>
                  <div className="space-y-2 text-slate-300 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{selectedManufacturer.headquarters}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Founded {selectedManufacturer.founded}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{selectedManufacturer.reputation_score || 0}/10</span>
                    </div>
                  </div>
                  
                  {/* Stats under header */}
                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                        {selectedManufacturer.id === 'boeing' ? 'Active Boeing Fleet' : selectedManufacturer.id === 'airbus' ? 'Active Type Ratings' : selectedManufacturer.id === 'embraer' ? 'Aircraft Delivered' : selectedManufacturer.id === 'bombardier' ? 'Active Fleet' : selectedManufacturer.id === 'gulfstream' ? 'Active Global Fleet' : selectedManufacturer.id === 'cessna' ? 'Cessna 172 Production' : selectedManufacturer.id === 'dassault-falcon' ? 'Active Global Fleet' : selectedManufacturer.id === 'pilatus' ? 'Active Fleet' : selectedManufacturer.id === 'beechcraft' ? 'Active Fleet' : selectedManufacturer.id === 'sikorsky' ? 'Global Fleet' : selectedManufacturer.id === 'leonardo' ? 'Active Fleet' : selectedManufacturer.id === 'atr' ? 'Active Global Fleet' : selectedManufacturer.id === 'de-havilland' ? 'Active Fleet' : selectedManufacturer.id === 'mitsubishi-mrj' ? 'Active Fleet' : selectedManufacturer.id === 'comac-c919' ? 'Active Fleet' : selectedManufacturer.id === 'tecnam' ? 'Active Fleet' : selectedManufacturer.id === 'piper' ? 'Active Fleet' : selectedManufacturer.id === 'cirrus' ? 'Active Fleet' : selectedManufacturer.id === 'let' ? 'Active Fleet' : selectedManufacturer.id === 'aeroprakt' ? 'Active Fleet' : 'Aircrafts Listed'}
                      </div>
                      <div className="text-2xl font-bold">
                        {selectedManufacturer.id === 'boeing' ? '12,000-14,000' : selectedManufacturer.id === 'airbus' ? '6-8 (Commercial)' : selectedManufacturer.id === 'embraer' ? '9,000+ (since 1969)' : selectedManufacturer.id === 'bombardier' ? '5,200+ Business Jets' : selectedManufacturer.id === 'gulfstream' ? '3,500-4,000 Aircraft' : selectedManufacturer.id === 'cessna' ? '44,000+ Units' : selectedManufacturer.id === 'dassault-falcon' ? '2,150-2,200 Jets' : selectedManufacturer.id === 'pilatus' ? '2,650+ Units' : selectedManufacturer.id === 'beechcraft' ? '32,700+ Units' : selectedManufacturer.id === 'sikorsky' ? '7,000+ Aircraft' : selectedManufacturer.id === 'leonardo' ? '2,950+ Units' : selectedManufacturer.id === 'atr' ? '1,200-1,300 Aircraft' : selectedManufacturer.id === 'de-havilland' ? '2,150-2,350 Units' : selectedManufacturer.id === 'mitsubishi-mrj' ? '1,400-1,700 Units' : selectedManufacturer.id === 'comac-c919' ? '245-255 Units' : selectedManufacturer.id === 'tecnam' ? '6,250-7,050 Units' : selectedManufacturer.id === 'piper' ? '31,600-32,700 Units' : selectedManufacturer.id === 'cirrus' ? '10,500-11,000 Units' : selectedManufacturer.id === 'let' ? '350-500 Units' : selectedManufacturer.id === 'aeroprakt' ? '3,100-3,500 Units' : '87'}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                        {selectedManufacturer.id === 'boeing' ? 'Crewing Ratio' : selectedManufacturer.id === 'airbus' ? 'Primary Rating' : selectedManufacturer.id === 'embraer' ? 'Major Ratings' : selectedManufacturer.id === 'bombardier' ? 'Key Rating' : selectedManufacturer.id === 'gulfstream' ? 'Pilot Ratio' : selectedManufacturer.id === 'cessna' ? 'Active Fleet' : selectedManufacturer.id === 'dassault-falcon' ? 'Pilot Ratio' : selectedManufacturer.id === 'pilatus' ? 'Primary Model' : selectedManufacturer.id === 'beechcraft' ? 'Primary Model' : selectedManufacturer.id === 'sikorsky' ? 'Primary Civil Model' : selectedManufacturer.id === 'leonardo' ? 'Primary Model' : selectedManufacturer.id === 'atr' ? 'Pilot Ratio' : selectedManufacturer.id === 'de-havilland' ? 'Primary Model' : selectedManufacturer.id === 'mitsubishi-mrj' ? 'Primary Rating' : selectedManufacturer.id === 'comac-c919' ? 'Primary Model' : selectedManufacturer.id === 'tecnam' ? 'Primary Model' : selectedManufacturer.id === 'piper' ? 'Primary Model' : selectedManufacturer.id === 'cirrus' ? 'Primary Model' : selectedManufacturer.id === 'let' ? 'Pilot Ratio' : selectedManufacturer.id === 'aeroprakt' ? 'Primary Model' : 'Preferred Type of Pilots'}
                      </div>
                      <div className="text-base font-bold leading-tight">
                        {selectedManufacturer.id === 'boeing' ? '10-14 pilots/aircraft' : selectedManufacturer.id === 'airbus' ? 'A320 Family (4+ variants)' : selectedManufacturer.id === 'embraer' ? '~4-6 (Commercial & Business)' : selectedManufacturer.id === 'bombardier' ? 'CL30/CL60 (Gold Standard)' : selectedManufacturer.id === 'gulfstream' ? '3-6 pilots/aircraft' : selectedManufacturer.id === 'cessna' ? '24,000+ Skyhawks' : selectedManufacturer.id === 'dassault-falcon' ? '3-6 pilots/aircraft' : selectedManufacturer.id === 'pilatus' ? 'PC-12 Series' : selectedManufacturer.id === 'beechcraft' ? 'King Air Series' : selectedManufacturer.id === 'sikorsky' ? 'S-92 / S-76' : selectedManufacturer.id === 'leonardo' ? 'AW139' : selectedManufacturer.id === 'atr' ? '12-16 pilots/aircraft' : selectedManufacturer.id === 'de-havilland' ? 'Dash 8 Series' : selectedManufacturer.id === 'mitsubishi-mrj' ? 'CL-65 (CRJ Series)' : selectedManufacturer.id === 'comac-c919' ? 'C919 Series' : selectedManufacturer.id === 'tecnam' ? 'Light Trainers' : selectedManufacturer.id === 'piper' ? 'Piston Singles' : selectedManufacturer.id === 'cirrus' ? 'SR Series' : selectedManufacturer.id === 'let' ? '10-12 pilots/aircraft' : selectedManufacturer.id === 'aeroprakt' ? 'A-22 Series' : '600-1500 hours'}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                        {selectedManufacturer.id === 'boeing' ? 'Pilots Rated Worldwide' : selectedManufacturer.id === 'airbus' ? 'Pilots Rated Worldwide' : selectedManufacturer.id === 'embraer' ? 'Pilots Rated Worldwide' : selectedManufacturer.id === 'bombardier' ? 'Pilots Rated Worldwide' : selectedManufacturer.id === 'gulfstream' ? 'Pilots Rated Worldwide' : selectedManufacturer.id === 'cessna' ? 'Qualified Pilots' : selectedManufacturer.id === 'dassault-falcon' ? 'Pilots Rated Worldwide' : selectedManufacturer.id === 'pilatus' ? 'Qualified Pilots' : selectedManufacturer.id === 'beechcraft' ? 'Qualified Pilots' : selectedManufacturer.id === 'sikorsky' ? 'Qualified Pilots' : selectedManufacturer.id === 'leonardo' ? 'Qualified Pilots' : selectedManufacturer.id === 'atr' ? 'Pilots Rated Worldwide' : selectedManufacturer.id === 'de-havilland' ? 'Qualified Pilots' : selectedManufacturer.id === 'mitsubishi-mrj' ? 'Qualified Pilots' : selectedManufacturer.id === 'comac-c919' ? 'Qualified Pilots' : selectedManufacturer.id === 'tecnam' ? 'Qualified Pilots' : selectedManufacturer.id === 'piper' ? 'Qualified Pilots' : selectedManufacturer.id === 'cirrus' ? 'Qualified Pilots' : selectedManufacturer.id === 'let' ? 'Qualified Pilots' : selectedManufacturer.id === 'aeroprakt' ? 'Qualified Pilots' : 'Pilots Rated'}
                      </div>
                      <div className="text-2xl font-bold">
                        {selectedManufacturer.id === 'boeing' ? '135,000-155,000' : selectedManufacturer.id === 'airbus' ? '180,000-220,000+' : selectedManufacturer.id === 'embraer' ? '45,000-60,000' : selectedManufacturer.id === 'bombardier' ? '50,000-65,000' : selectedManufacturer.id === 'gulfstream' ? '12,000-18,000' : selectedManufacturer.id === 'cessna' ? '1.2M-1.5M' : selectedManufacturer.id === 'dassault-falcon' ? '8,000-11,000' : selectedManufacturer.id === 'pilatus' ? '11,000-15,000' : selectedManufacturer.id === 'beechcraft' ? '110,000-135,000' : selectedManufacturer.id === 'sikorsky' ? '45,000-55,000' : selectedManufacturer.id === 'leonardo' ? '18,000-22,000' : selectedManufacturer.id === 'atr' ? '18,000-22,000' : selectedManufacturer.id === 'de-havilland' ? '15,000-20,000' : selectedManufacturer.id === 'mitsubishi-mrj' ? '16,000-22,000' : selectedManufacturer.id === 'comac-c919' ? '3,500-5,000' : selectedManufacturer.id === 'tecnam' ? '115,000-145,000' : selectedManufacturer.id === 'piper' ? '250,000-350,000' : selectedManufacturer.id === 'cirrus' ? '60,000-80,000' : selectedManufacturer.id === 'let' ? '4,500-7,000' : selectedManufacturer.id === 'aeroprakt' ? '8,000-12,000' : '200,000-250,000+'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Center - Empty */}
                <div className="md:w-1/3"></div>
                
                {/* Right center - Description */}
                <div className="md:w-1/3 flex items-center">
                  {selectedManufacturer.id === 'boeing' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Boeing Rating Estimates by Family:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Boeing 737 Series:</span>
                            <span className="font-semibold">95,000 – 110,000</span>
                          </div>
                          <p className="text-slate-400">The "workhorse" of the fleet; most common rating</p>
                          <div className="flex justify-between">
                            <span>Boeing 777 / 787:</span>
                            <span className="font-semibold">35,000 – 45,000</span>
                          </div>
                          <p className="text-slate-400">Common for long-haul carriers</p>
                          <div className="flex justify-between">
                            <span>Legacy/Cargo (747, 757, 767):</span>
                            <span className="font-semibold">5,000 – 10,000</span>
                          </div>
                          <p className="text-slate-400">Standard for cargo giants like FedEx and UPS</p>
                        </div>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'airbus' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Active Airbus Type Ratings:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>A320 Family:</span>
                            <span className="font-semibold">Most common globally</span>
                          </div>
                          <p className="text-slate-400">Covers A318, A319, A320, A321 (CEO & NEO versions)</p>
                          <div className="flex justify-between">
                            <span>A330 / A350:</span>
                            <span className="font-semibold">High commonality</span>
                          </div>
                          <p className="text-slate-400">Transition in 5-8 days via CCQ</p>
                          <div className="flex justify-between">
                            <span>A220:</span>
                            <span className="font-semibold">Standalone rating</span>
                          </div>
                          <p className="text-slate-400">Former Bombardier CSeries</p>
                          <div className="flex justify-between">
                            <span>A380:</span>
                            <span className="font-semibold">Standalone rating</span>
                          </div>
                          <p className="text-slate-400">The "Superjumbo"</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">60-70% of Airbus pilots hold the A320 family rating</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'embraer' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Core Embraer Type Ratings:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>ERJ 170/190 (E-Jet):</span>
                            <span className="font-semibold">Most popular</span>
                          </div>
                          <p className="text-slate-400">Covers E170, E175, E190, E195; E2 series via differences course</p>
                          <div className="flex justify-between">
                            <span>ERJ 135/145:</span>
                            <span className="font-semibold">Regional workhorses</span>
                          </div>
                          <p className="text-slate-400">Also covers Legacy 600/650 business jets</p>
                          <div className="flex justify-between">
                            <span>Phenom 100/300:</span>
                            <span className="font-semibold">Business jets</span>
                          </div>
                          <p className="text-slate-400">Phenom 300: world's best-selling light jet</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">High commonality between regional and business variants</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'bombardier' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Estimated Rated Pilots by Category:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Regional Jets (CRJ Series):</span>
                            <span className="font-semibold">25,000 – 30,000</span>
                          </div>
                          <p className="text-slate-400">CRJ200, 700, 900; 1,200+ in global service</p>
                          <div className="flex justify-between">
                            <span>Business Jets (Challenger/Global):</span>
                            <span className="font-semibold">20,000 – 25,000</span>
                          </div>
                          <p className="text-slate-400">5,200+ jets operated globally</p>
                          <div className="flex justify-between">
                            <span>Turboprops (Dash 8/Q-Series):</span>
                            <span className="font-semibold">10,000 – 15,000</span>
                          </div>
                          <p className="text-slate-400">900+ active units for regional airlines</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">CL30/CL60: Gold standard for corporate pilots</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'gulfstream' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Rated Pilots by Aircraft Generation:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>G650 / G700 / G800:</span>
                            <span className="font-semibold">3,000 – 4,500</span>
                          </div>
                          <p className="text-slate-400">~750+ units; newest ultra-long-range models</p>
                          <div className="flex justify-between">
                            <span>G500 / G600:</span>
                            <span className="font-semibold">1,600 – 2,400</span>
                          </div>
                          <p className="text-slate-400">~400+ units</p>
                          <div className="flex justify-between">
                            <span>G550 / G-V (Legacy):</span>
                            <span className="font-semibold">2,800 – 4,200</span>
                          </div>
                          <p className="text-slate-400">~700+ units; legacy long-range</p>
                          <div className="flex justify-between">
                            <span>G280 (Super Mid-Size):</span>
                            <span className="font-semibold">1,200 – 1,800</span>
                          </div>
                          <p className="text-slate-400">~300+ units</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">Contract pilot market: $2,000-$4,500+ per day</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'cessna' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Citation Business Jet Type Ratings:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>CE-500:</span>
                            <span className="font-semibold">12,000 – 15,000</span>
                          </div>
                          <p className="text-slate-400">Citation I, II, V, Ultra (10 variations)</p>
                          <div className="flex justify-between">
                            <span>CE-525 (CJ):</span>
                            <span className="font-semibold">10,000 – 12,000</span>
                          </div>
                          <p className="text-slate-400">CitationJet, CJ1, CJ2, CJ3, CJ4 series</p>
                          <div className="flex justify-between">
                            <span>CE-560XL:</span>
                            <span className="font-semibold">8,000 – 10,000</span>
                          </div>
                          <p className="text-slate-400">Excel, XLS, XLS+, Citation Ascend</p>
                          <div className="flex justify-between">
                            <span>CE-680 / 700:</span>
                            <span className="font-semibold">5,000 – 8,000</span>
                          </div>
                          <p className="text-slate-400">Sovereign, Latitude, Longitude</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">Total Citation fleet: 8,000+ jets (largest business jet fleet)</p>
                        <p className="text-slate-400 mt-2 italic">Cessna 150-172: Most rated aircraft worldwide (1.2M-1.5M qualified pilots with SEL rating)</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'dassault-falcon' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Rated Pilots by Falcon Family:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Falcon 7X / 8X (Tri-jets):</span>
                            <span className="font-semibold">1,500 – 1,800</span>
                          </div>
                          <p className="text-slate-400">~300+ units; specialized for hot/high airports</p>
                          <div className="flex justify-between">
                            <span>Falcon 2000 Series:</span>
                            <span className="font-semibold">2,600 – 3,250</span>
                          </div>
                          <p className="text-slate-400">~650+ units (twin-jets)</p>
                          <div className="flex justify-between">
                            <span>Falcon 900 Series:</span>
                            <span className="font-semibold">2,000 – 2,500</span>
                          </div>
                          <p className="text-slate-400">~500+ units (tri-jets)</p>
                          <div className="flex justify-between">
                            <span>Legacy Models (10, 20, 50):</span>
                            <span className="font-semibold">1,500 – 2,000</span>
                          </div>
                          <p className="text-slate-400">~600+ units</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">EASy Flight Deck enables easy transitions between Falcon models</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'pilatus' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Qualified Pilots by Model:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>PC-12 Series:</span>
                            <span className="font-semibold">9,000 – 11,500</span>
                          </div>
                          <p className="text-slate-400">~2,100+ units; original, NG, NGX, PC-12 PRO</p>
                          <div className="flex justify-between">
                            <span>PC-24 Super Versatile Jet:</span>
                            <span className="font-semibold">1,500 – 2,500</span>
                          </div>
                          <p className="text-slate-400">~250+ units; requires specific type rating</p>
                          <div className="flex justify-between">
                            <span>PC-21 / PC-7:</span>
                            <span className="font-semibold">500 – 1,000</span>
                          </div>
                          <p className="text-slate-400">~300+ units; military trainers</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">PC-12: Single Engine Turbine (SET) class rating</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'beechcraft' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Qualified Pilots by Category:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>King Air Series:</span>
                            <span className="font-semibold">35,000 – 45,000</span>
                          </div>
                          <p className="text-slate-400">~7,500+ units; "gold standard" turboprop</p>
                          <div className="flex justify-between">
                            <span>Piston Singles (Bonanza):</span>
                            <span className="font-semibold">60,000 – 75,000</span>
                          </div>
                          <p className="text-slate-400">~18,000+ units; no type rating required</p>
                          <div className="flex justify-between">
                            <span>Piston Twins (Baron):</span>
                            <span className="font-semibold">12,000 – 15,000</span>
                          </div>
                          <p className="text-slate-400">~6,000+ units; requires MEL rating</p>
                          <div className="flex justify-between">
                            <span>Regional/Military (B1900/T-6):</span>
                            <span className="font-semibold">3,000 – 5,000</span>
                          </div>
                          <p className="text-slate-400">~1,200+ units; cargo/regional & military</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">King Air 350/360: Requires BE-300 type rating (6,000-8,000 pilots)</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'sikorsky' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Qualified Pilots by Category:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>S-92 (Offshore/SAR):</span>
                            <span className="font-semibold">2,000 – 2,500</span>
                          </div>
                          <p className="text-slate-400">196 active units; high-stakes offshore operations</p>
                          <div className="flex justify-between">
                            <span>S-76 (VIP/Medical):</span>
                            <span className="font-semibold">2,500 – 3,500</span>
                          </div>
                          <p className="text-slate-400">534 active units; "limousine of the sky"</p>
                          <div className="flex justify-between">
                            <span>Civilian S-70 (Firefighting):</span>
                            <span className="font-semibold">1,500 – 2,000</span>
                          </div>
                          <p className="text-slate-400">Retired military airframes</p>
                          <div className="flex justify-between">
                            <span>Military (Black Hawk/CH-53):</span>
                            <span className="font-semibold">35,000 – 40,000</span>
                          </div>
                          <p className="text-slate-400">30+ nations operating Black Hawk family</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">S-92 and S-76 require specific type ratings</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'leonardo' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Rated Pilots by Model Family:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>AW139:</span>
                            <span className="font-semibold">8,000 – 10,000</span>
                          </div>
                          <p className="text-slate-400">~1,200+ units; world's best-selling intermediate twin</p>
                          <div className="flex justify-between">
                            <span>AW109 / AW119:</span>
                            <span className="font-semibold">4,000 – 6,000</span>
                          </div>
                          <p className="text-slate-400">~1,000+ units; VIP/corporate & turbine training</p>
                          <div className="flex justify-between">
                            <span>AW169 / AW189:</span>
                            <span className="font-semibold">2,500 – 3,500</span>
                          </div>
                          <p className="text-slate-400">~350+ units; new-generation "AWFamily" jets</p>
                          <div className="flex justify-between">
                            <span>Military/Other (AW101/Lynx):</span>
                            <span className="font-semibold">3,000 – 4,000</span>
                          </div>
                          <p className="text-slate-400">~400+ units; heavy-lift & naval crews</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">AWFamily: Shared cockpit enables differences training</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'atr' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">ATR Type Rating Facts:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Common Type Rating:</span>
                            <span className="font-semibold">ATR 42 & ATR 72</span>
                          </div>
                          <p className="text-slate-400">Pilots certified on one fly both with minimal differences training</p>
                          <div className="flex justify-between">
                            <span>Global Market Share:</span>
                            <span className="font-semibold">80% Regional Turboprop</span>
                          </div>
                          <p className="text-slate-400">200 operators in 100 countries</p>
                          <div className="flex justify-between">
                            <span>Training Hubs:</span>
                            <span className="font-semibold">Toulouse, Paris, Singapore, Miami</span>
                          </div>
                          <p className="text-slate-400">Thousands of ratings processed annually</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">ATR 72-600F: Cargo variant with FedEx adds freight pilots</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'de-havilland' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Rated Pilots by Aircraft Category:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Dash 8 (Q100/200/300/400):</span>
                            <span className="font-semibold">10,000 – 15,000</span>
                          </div>
                          <p className="text-slate-400">~750-850 units; includes popular Q400</p>
                          <div className="flex justify-between">
                            <span>DHC-6 Twin Otter:</span>
                            <span className="font-semibold">2,500 – 3,500</span>
                          </div>
                          <p className="text-slate-400">~500-600 units; "bush plane" icon (1,000th delivery March 2026)</p>
                          <div className="flex justify-between">
                            <span>Legacy Bush Planes (Beaver/Otter):</span>
                            <span className="font-semibold">1,500 – 2,500</span>
                          </div>
                          <p className="text-slate-400">~900+ units; many single-pilot operations</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">Dash 8: 12-16 pilots/aircraft for high-frequency schedules</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'mitsubishi-mrj' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Qualified Pilots by Category:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>MHI RJ (CRJ Series):</span>
                            <span className="font-semibold">15,000 – 20,000</span>
                          </div>
                          <p className="text-slate-400">~1,100-1,300 units; CL-65 type rating</p>
                          <div className="flex justify-between">
                            <span>Mitsubishi MU-2:</span>
                            <span className="font-semibold">600 – 1,000</span>
                          </div>
                          <p className="text-slate-400">~250-300 units; requires SFAR 108 training</p>
                          <div className="flex justify-between">
                            <span>MU-300 Diamond (Beechjet 400):</span>
                            <span className="font-semibold">200 – 400</span>
                          </div>
                          <p className="text-slate-400">~50-100 units; requires BE-400 type rating</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">SpaceJet: Cancelled February 2023 (0 pilots)</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'comac-c919' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Rated Pilots by Aircraft Family:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>ARJ21 / C909:</span>
                            <span className="font-semibold">2,800 – 4,000</span>
                          </div>
                          <p className="text-slate-400">~210 units; primary workhorse (rebranded C909 in 2024)</p>
                          <div className="flex justify-between">
                            <span>C919 Series:</span>
                            <span className="font-semibold">500 – 1,000</span>
                          </div>
                          <p className="text-slate-400">~35-45 units; 32 delivered by end of 2025, 33 expected in 2026</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">C919: Fleet expected to double in 2026</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'tecnam' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Qualified Pilots by Category:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Light Trainers (P92, P2002, P-Mentor):</span>
                            <span className="font-semibold">90,000 – 110,000</span>
                          </div>
                          <p className="text-slate-400">~5,500-6,000 units; standard training aircraft (65+ countries)</p>
                          <div className="flex justify-between">
                            <span>P2006T (Twin Engine):</span>
                            <span className="font-semibold">15,000 – 20,000</span>
                          </div>
                          <p className="text-slate-400">~600-800 units; popular multi-engine trainer</p>
                          <div className="flex justify-between">
                            <span>P2012 Traveller (Regional):</span>
                            <span className="font-semibold">1,500 – 2,500</span>
                          </div>
                          <p className="text-slate-400">~150-250 units; regional airlines like Cape Air</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">Most models use SEL/MEL class ratings (no type rating)</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'piper' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Qualified Pilots by Category:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Piston Singles (Archer, Warrior, Cherokee):</span>
                            <span className="font-semibold">200,000 – 250,000</span>
                          </div>
                          <p className="text-slate-400">~25,000+ units; backbone of global flight training</p>
                          <div className="flex justify-between">
                            <span>Piston Twins (Seminole, Seneca):</span>
                            <span className="font-semibold">40,000 – 60,000</span>
                          </div>
                          <p className="text-slate-400">~5,000+ units; Seminole is world's most popular multi-engine trainer</p>
                          <div className="flex justify-between">
                            <span>Turboprops (M500, M600/SLS, M700):</span>
                            <span className="font-semibold">8,000 – 12,000</span>
                          </div>
                          <p className="text-slate-400">~1,200+ units; high-performance "M-Class" aircraft</p>
                          <div className="flex justify-between">
                            <span>Piper Cheyenne (Legacy):</span>
                            <span className="font-semibold">1,500 – 2,500</span>
                          </div>
                          <p className="text-slate-400">~400-500 units; older twin-engine turboprops</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">130,000+ aircraft produced since inception</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'cirrus' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Qualified Pilots by Category:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>SR Series (SR20, SR22, SR22T):</span>
                            <span className="font-semibold">55,000 – 70,000</span>
                          </div>
                          <p className="text-slate-400">~9,500+ units; "plane with the parachute" (10,000+ total delivered)</p>
                          <div className="flex justify-between">
                            <span>Vision Jet (SF50):</span>
                            <span className="font-semibold">1,500 – 2,500</span>
                          </div>
                          <p className="text-slate-400">~600+ units; requires SF50 type rating (world's best-selling light jet)</p>
                          <div className="flex justify-between">
                            <span>TRAC Series (Training):</span>
                            <span className="font-semibold">8,000 – 12,000</span>
                          </div>
                          <p className="text-slate-400">~400-500 units; used by United Aviate Academy and Lufthansa</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">SR22: Best-selling high-performance piston for 22 consecutive years</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'let' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">L-410 Rating Facts:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Active Fleet:</span>
                            <span className="font-semibold">350-500 Units</span>
                          </div>
                          <p className="text-slate-400">Over 1,200 L-410 aircraft produced since 1969</p>
                          <div className="flex justify-between">
                            <span>Regional Airlines:</span>
                            <span className="font-semibold">10-14 pilots/aircraft</span>
                          </div>
                          <p className="text-slate-400">High-frequency short-haul schedules</p>
                          <div className="flex justify-between">
                            <span>Utility & Military:</span>
                            <span className="font-semibold">6-8 pilots/aircraft</span>
                          </div>
                          <p className="text-slate-400">Medevac, cargo, maritime patrol roles</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">L-410 NG: Garmin G3000 avionics; STOL capabilities in 50+ countries</p>
                      </div>
                    </div>
                  ) : selectedManufacturer.id === 'aeroprakt' ? (
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                      <p>{selectedManufacturer.description}</p>
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Qualified Pilots by Model:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>A-22 Series (Foxbat):</span>
                            <span className="font-semibold">6,500 – 9,500</span>
                          </div>
                          <p className="text-slate-400">~2,500+ units; widely used in flight schools globally</p>
                          <div className="flex justify-between">
                            <span>A-32 Series (Vixxen):</span>
                            <span className="font-semibold">1,500 – 2,500</span>
                          </div>
                          <p className="text-slate-400">~500-800 units; popular with cross-country private owners</p>
                          <div className="flex justify-between">
                            <span>Legacy/Other (A-20, A-24):</span>
                            <span className="font-semibold">300 – 500</span>
                          </div>
                          <p className="text-slate-400">~100-200 units; niche enthusiast communities</p>
                        </div>
                        <p className="text-slate-400 mt-2 italic">LSA/ultralight: No type rating required (Sport Pilot/PPL with SEL)</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-300 text-lg leading-relaxed">{selectedManufacturer.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Read more about manufacturer expectations - positioned at bottom center of hero */}
      {selectedManufacturer && (
        <div className="relative z-10 flex justify-center mb-8">
          <button
            onClick={() => window.location.href = `/manufacturer/${selectedManufacturer.id}/expectations`}
            className="bg-white/30 backdrop-blur-xl border border-white/50 px-6 py-3 text-white text-sm font-medium rounded-xl hover:bg-white/40 transition-all shadow-xl"
          >
            Read more about {selectedManufacturer.name} expectations
          </button>
        </div>
      )}

      {/* Manufacturer logo below hero section */}
      <div className="relative z-10 flex justify-center -mt-8 mb-8">
        {selectedManufacturer ? (
          <img
            src={selectedManufacturer?.id === 'boeing' ? '/beoinglogo.png' : selectedManufacturer?.id === 'embraer' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Embraer_logo.svg/3840px-Embraer_logo.svg.png' : selectedManufacturer?.id === 'bombardier' ? 'https://download.logo.wine/logo/Bombardier_Inc./Bombardier_Inc.-Logo.wine.png' : selectedManufacturer?.id === 'dassault-falcon' ? 'https://www.skyservice.com/wp-content/uploads/2023/08/dassault.png' : selectedManufacturer?.id === 'pilatus' ? 'https://swartzaviationgroup.com/wp-content/uploads/2025/04/Pilatus.png' : selectedManufacturer?.id === 'leonardo' ? 'https://iconlogovector.com/uploads/images/2025/04/lg-67fd7d3a3dbc5-Leonardo.webp' : selectedManufacturer?.id === 'atr' ? 'https://images.seeklogo.com/logo-png/43/2/atr-logo-png_seeklogo-433115.png' : selectedManufacturer?.id === 'de-havilland' ? 'https://upload.wikimedia.org/wikipedia/en/c/ca/De_Havilland.png' : selectedManufacturer?.id === 'mitsubishi-mrj' ? 'https://image.pitchbook.com/M35hhwSoZmMCkeXDGeQYTR6rDoP1546610261630_200x200' : selectedManufacturer?.id === 'comac-c919' ? 'https://www.logo.wine/a/logo/Comac/Comac-Logo.wine.svg' : selectedManufacturer?.id === 'tecnam' ? 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Primary_Logo_-_Tecnam.png' : selectedManufacturer?.id === 'piper' ? 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Piper_logo.svg/1280px-Piper_logo.svg.png' : selectedManufacturer?.id === 'cirrus' ? 'https://brandlogos.net/wp-content/uploads/2022/02/cirrus_aircraft-logo-brandlogos.net_.png' : selectedManufacturer?.id === 'let' ? 'https://www.let.cz/images/logos/logo_new_s.png' : selectedManufacturer?.id === 'aeroprakt' ? 'https://www.aeropraktsouthafrica.co.za/img/logo.png' : selectedManufacturer.logo}
            alt={selectedManufacturer.name}
            className="w-48 h-24 object-contain"
          />
        ) : (
          <span style={{ fontFamily: 'Arial Black, Helvetica Neue, sans-serif' }} className="text-white text-2xl">
            PilotRecognition.com
          </span>
        )}
      </div>

      {/* White background for content below hero */}
      <div className="relative z-10 bg-white pb-12">
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
          ) : (
            <div className="bg-white/30 backdrop-blur-xl rounded-xl p-6 border border-amber-300/50 mb-8 text-center shadow-xl shadow-amber-500/10">
              <div className="text-2xl font-bold mb-3">
                <span className="text-black">pilot</span>
                <span className="text-red-600">recognition</span>
                <span className="text-red-600 bg-white px-1 rounded">+</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Sign in to view your profile</h3>
              <p className="text-slate-600 mb-2">Subscribe to Recognition + to compare your profile with manufacturer type ratings and expectations & requirements.</p>
              <p className="text-slate-600 mb-4">Log in to see your flight hours, recognition score, and personalized recommendations.</p>
              <button className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors shadow-lg">
                Sign In
              </button>
            </div>
          )}

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
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-sky-600 font-semibold mb-1 block">March 2026</span>
                  <h4 className="font-semibold text-slate-900 mb-1">New Training Standards Announced</h4>
                  <p className="text-sm text-slate-600">EASA and FAA align on enhanced training requirements for next-generation aircraft including A350, B777X, and eVTOL operations.</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-sky-600 font-semibold mb-1 block">February 2026</span>
                  <h4 className="font-semibold text-slate-900 mb-1">Regional Jet Market Expansion</h4>
                  <p className="text-sm text-slate-600">Embraer E2 family and ATR 72-600 see increased orders as airlines focus on regional connectivity and fuel efficiency.</p>
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
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-emerald-600 font-semibold mb-1 block">Airbus</span>
                  <h4 className="font-semibold text-slate-900 mb-1">A320neo Family Certification</h4>
                  <p className="text-sm text-slate-600">Common type rating extended to include A321XLR. Reduced training hours for pilots with A320ceo experience.</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-emerald-600 font-semibold mb-1 block">Embraer</span>
                  <h4 className="font-semibold text-slate-900 mb-1">E-Jet E2 Cross-Qualification</h4>
                  <p className="text-sm text-slate-600">New cross-qualification program between E190-E2 and E195-E2. 40% reduction in training time announced.</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <span className="text-xs text-emerald-600 font-semibold mb-1 block">ATR</span>
                  <h4 className="font-semibold text-slate-900 mb-1">ATR 72-600 New Procedures</h4>
                  <p className="text-sm text-slate-600">Updated cold weather operations procedures for 72-600. New de-icing certification requirements effective immediately.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manufacturer Overview Stats */}
          <div className="mt-8 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              Manufacturer Overview (20 Aircraft Manufacturers)
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
      <div className="max-w-7xl mx-auto px-6 mb-8 relative z-10">
        <div className="flex flex-wrap gap-2">
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
          <div className="flex flex-wrap gap-2 mt-3">
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
          <div className="flex flex-wrap gap-2 mt-3">
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
          <div className="flex flex-wrap gap-2 mt-3">
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
          <div className="flex flex-wrap gap-2 mt-3">
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
          <div className="flex flex-wrap gap-2 mt-3">
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
            <h2 className="text-2xl font-serif font-normal text-slate-900">Browse Aircraft</h2>
            <p className="text-sm text-slate-500">{filteredAircraft.length} aircraft available</p>
          </div>
          {/* Scroll arrows */}
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
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
                <div key={i} className="flex-shrink-0 w-72 h-64 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            filteredAircraft.map(aircraft => (
            <div
              key={aircraft.id}
              onClick={() => handleSelect(aircraft)}
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
                    sketchfabId={aircraft.sketchfab_id}
                    alt={aircraft.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={
                      (aircraft.image && !aircraft.image.includes('efqjszksldcdm6kbnzoq.png'))
                        ? aircraft.image
                        : manufacturers.find(m => m.id === aircraft.manufacturer_id)?.logo || 'https://via.placeholder.com/288x176?text=No+Image'
                    }
                    alt={aircraft.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      console.error('Image failed to load:', aircraft.model, aircraft.image);
                      const manufacturer = manufacturers.find(m => m.id === aircraft.manufacturer_id);
                      if (manufacturer?.logo && e.currentTarget.src !== manufacturer.logo) {
                        e.currentTarget.src = manufacturer.logo;
                      } else {
                        e.currentTarget.src = 'https://via.placeholder.com/288x176?text=No+Image';
                      }
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {aircraft.sketchfab_id && (
                  <div className="absolute top-2 right-2 bg-sky-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                    3D
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-white font-serif text-base leading-tight">{aircraft.model}</span>
                  <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                    <Plane className="w-3 h-3" />
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
                    const manufacturer = manufacturers.find(m => m.id === selectedAircraft.manufacturer_id);
                    if (manufacturer?.logo) {
                      e.currentTarget.src = manufacturer.logo;
                    } else {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image';
                    }
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
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2">{selectedAircraft.model}</h2>
                <div className="flex items-center gap-4 flex-wrap mb-3">
                  <span className="flex items-center gap-1.5 text-sky-300 text-sm">
                    <img src={getManufacturer(selectedAircraft)?.logo || '/logo.png'} alt="Manufacturer" className="h-4 w-auto object-contain opacity-80" />
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
                <img src={getManufacturer(selectedAircraft)?.logo || '/logo.png'} alt={getManufacturer(selectedAircraft)?.name} className="h-8 object-contain" />
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
    </div>
  );
}
