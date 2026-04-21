import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ChevronLeft,
  ChevronRight, 
  ChevronDown,
  Plane,
  Award,
  Clock,
  Target,
  Zap,
  Star,
  User,
  Users,
  BarChart3,
  Briefcase,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap,
  FileText,
  Bell,
  Search,
  LayoutGrid,
  Filter,
  X,
  Calendar,
  Settings,
  LogOut,
  ExternalLink,
  Bookmark,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../src/contexts/AuthContext';
import { usePathwaysIntelligence } from '../hooks/usePathwaysIntelligence';
import {
  RadarChart,
  ScoreVelocityBadge,
  ProfileCompletionNudge,
  JobIntelligenceBanner,
  BlindSpotPicksRow,
  JobGapBar,
  MatchBreakdownPopover,
  RoadmapTimeline,
  TypeRatingRecommendationBanner,
  AirlineMatchBadge,
  AirlineReadinessBanner,
  ScoreLiveWidget,
} from '../components/PathwaysIntelligenceWidgets';

// React Three Fiber for 3D Aircraft Models
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Import real job data from PilotJobDatabasePage
import { jobApplicationListings } from './PilotJobDatabasePage';

// ============================================================================
// AIRLINE IMAGE BANK - Confirmed Cloudinary URLs from AirlineExpectations
// ============================================================================

// Confirmed working Cloudinary images from AirlineExpectationsCarousel
const CLOUDINARY_AIRLINES: Record<string, string> = {
  'qatar': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg',
  'singapore': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/singapore-airlines.jpg',
  'cathay': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg',
  'emirates': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png',
  'etihad': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg',
  'lufthansa': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lufthansa.jpg',
  'british': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/british-airways.jpg',
  'airfrance': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686790/airline-expectations/air-france.jpg',
  'klm': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/klm.jpg',
  'swiss': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/swiss.jpg',
  'turkish': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/turkish-airlines.jpg',
  'ana': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/ana.jpg',
  'jal': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/japan-airlines.jpg',
};

// Reliable fallback images by category (Unsplash)
const FALLBACK_IMAGES: Record<string, string> = {
  'cadet-programme': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  'cargo': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
  'private': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'privateSector': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'airtaxi-drones': 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
};

// Aircraft-specific images
const AIRCRAFT_IMAGES: Record<string, string> = {
  // Airbus
  'A320': 'https://www.etihad.com/content/dam/eag/etihadairways/etihadcom/2025/global/products/our-fleet/A320-NEO.png?imwidth=480&imdensity=2.625',
  'A320NEO': 'https://www.etihad.com/content/dam/eag/etihadairways/etihadcom/2025/global/products/our-fleet/A320-NEO.png?imwidth=480&imdensity=2.625',
  'A318': 'https://global.discourse-cdn.com/infiniteflight/optimized/4X/f/9/6/f966bce5d678bd7b536ac56588bc1e13ef566e4d_2_820x332.png',
  'A319': 'https://global.discourse-cdn.com/infiniteflight/optimized/4X/f/9/6/f966bce5d678bd7b536ac56588bc1e13ef566e4d_2_820x332.png',
  'A321': 'https://global.discourse-cdn.com/infiniteflight/optimized/4X/f/9/6/f966bce5d678bd7b536ac56588bc1e13ef566e4d_2_820x332.png',
  'A330': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A350': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A380': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'A220': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  // Boeing
  'B737': 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
  '737': 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
  'B747': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '747': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'B777': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '777': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'B787': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '787': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'B757': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '757': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  'B767': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  '767': 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
  // Regional
  'ERJ': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E170': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E175': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E190': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'E195': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'CRJ': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'CRJ700': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'CRJ900': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  // Business Jets
  'Citation': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/Citation-web.png',
  'Citation I': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/Citation-web.png',
  'Citation ISP': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/Citation-web.png',
  'Citation III': 'https://askjet.ru/wp-content/uploads/2025/08/cb2b78fb-994f-446f-9605-b24948035ea9.png',
  'Citation Sovereign': 'https://w7.pngwing.com/pngs/86/879/png-transparent-aircraft-cessna-citation-sovereign-cessna-citation-x-cessna-citation-longitude-cessna-citationjet-m2-private-jet-mode-of-transport-flight-airplane.png',
  'Citation M2': 'https://tadistributors.com/wp-content/uploads/2017/12/M2-Cutout-1.png',
  'Citation CJ4': 'https://www.jetfinder.com/wp-content/uploads/2024/01/citation_cj4_exterior.png',
  'CJ4': 'https://www.jetfinder.com/wp-content/uploads/2024/01/citation_cj4_exterior.png',
  'M2': 'https://tadistributors.com/wp-content/uploads/2017/12/M2-Cutout-1.png',
  'Sovereign': 'https://w7.pngwing.com/pngs/86/879/png-transparent-aircraft-cessna-citation-sovereign-cessna-citation-x-cessna-citation-longitude-cessna-citationjet-m2-private-jet-mode-of-transport-flight-airplane.png',
  'Gulfstream': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Challenger': 'https://res.cloudinary.com/flyblackbird/image/upload/c_scale,q_auto:eco,w_600/v1/aircraft/bombardier-challenger-300',
  'CL-30': 'https://res.cloudinary.com/flyblackbird/image/upload/c_scale,q_auto:eco,w_600/v1/aircraft/bombardier-challenger-300',
  'Global': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Learjet': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  'Falcon': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
  // Turboprops
  'King Air': 'https://www.callandfly.pl/wp-content/uploads/Zrzut_ekranu_2024-07-29_o_13.07.24-removebg-preview.png',
  'Caravan': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'Pilatus': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'PC-24': 'https://www.oriensaviation.com/wp-content/uploads/2025/02/PC-24.png',
  'Pilatus PC-24': 'https://www.oriensaviation.com/wp-content/uploads/2025/02/PC-24.png',
  'TBM': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'PA-31': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/N146J-exterior.jpg',
  'Navajo': 'https://elasticbeanstalk-us-east-1-921481824325.s3.us-east-1.amazonaws.com/tailimages/N146J-exterior.jpg',
};

// Airline logos
const AIRLINE_LOGOS: Record<string, string> = {
  'etihad': 'https://logos-world.net/wp-content/uploads/2023/01/Etihad-Airways-Logo.png',
  'ejm': 'https://www.jsfirm.com/assets/logos/EJM_logo-2023.jpg',
  'emirates': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png',
  'qatar': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Qatar_Airways_logo.svg/1200px-Qatar_Airways_logo.svg.png',
  'singapore': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/2b/Singapore_Airlines_logo.svg/1200px-Singapore_Airlines_logo.svg.png',
  'cathay': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Cathay_Pacific_logo.svg/1200px-Cathay_Pacific_logo.svg.png',
  'lufthansa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/1200px-Lufthansa_Logo_2018.svg.png',
  'british airways': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/49/British_Airways_1997.svg/1200px-British_Airways_1997.svg.png',
  'air france': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Air_France-Logo.svg/1200px-Air_France-Logo.svg.png',
  'klm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/KLM_Logo.svg/1200px-KLM_Logo.svg.png',
  'turkish': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Turkish_Airlines_logo_2019.svg/1200px-Turkish_Airlines_logo_2019.svg.png',
  'ana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/All_Nippon_Airways_Logo.svg/1200px-All_Nippon_Airways_Logo.svg.png',
  'jal': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Japan_Airlines_logo.svg/1200px-Japan_Airlines_logo.svg.png',
  'delta': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776780355/airline-logos/airline-logos/delta.svg',
  'american': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776780357/airline-logos/airline-logos/american.svg',
  'united': 'https://res.cloudinary.com/dridtecu6/image/upload/v1776780360/airline-logos/airline-logos/united.svg',
  'jetblue': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/JetBlue_Airways_Logo.svg/1200px-JetBlue_Airways_Logo.svg.png',
  'southwest': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Southwest_Airlines_logo_2014.svg/1200px-Southwest_Airlines_logo_2014.svg.png',
  'alaska': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Alaska_Airlines_logo_2014.svg/1200px-Alaska_Airlines_logo_2014.svg.png',
};

// Helper to get aircraft image
const getAircraftImage = (aircraftType: string): string => {
  const typeKey = String(aircraftType || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Try exact match first
  if (AIRCRAFT_IMAGES[typeKey]) {
    return AIRCRAFT_IMAGES[typeKey];
  }

  // Try partial matches
  for (const [key, url] of Object.entries(AIRCRAFT_IMAGES)) {
    if (typeKey.includes(String(key).toUpperCase()) || String(key).toUpperCase().includes(typeKey)) {
      return url;
    }
  }

  // Check for partial matches
  if (String(aircraftType || '').toUpperCase().includes('KING AIR')) {
    return AIRCRAFT_IMAGES['King Air'];
  }

  // Fallback to cadet-programme aircraft image
  return FALLBACK_IMAGES['cadet-programme'];
};

// Helper to get airline logo
const getAirlineLogo = (airline: string): string => {
  if (!airline) return '';
  const airlineLower = airline.toLowerCase();

  for (const [key, url] of Object.entries(AIRLINE_LOGOS)) {
    if (airlineLower.includes(key) || key.includes(airlineLower)) {
      return url;
    }
  }

  return '';
};

// Helper to extract aircraft from job title
const extractAircraftFromTitle = (title: string): string | null => {
  const aircraftPatterns = [
    // Boeing
    /B737|Boeing 737|737/i,
    /B747|Boeing 747|747/i,
    /B777|Boeing 777|777/i,
    /B787|Boeing 787|787|Dreamliner/i,
    /B757|Boeing 757|757/i,
    /B767|Boeing 767|767/i,
    // Airbus
    /A320|Airbus 320/i,
    /A330|Airbus 330/i,
    /A350|Airbus 350/i,
    /A380|Airbus 380/i,
    /A319|Airbus 319/i,
    /A321|Airbus 321/i,
    /A318|Airbus 318/i,
    // Business Jets - Bombardier/Challenger
    /Challenger|CL-30|CL-60|CL-350|CL-650/i,
    /Global|Global 5000|Global 6000|Global 7500|Global 8000/i,
    // Gulfstream
    /Gulfstream|G-IV|G-V|G450|G550|G650|G700|GVII|G500|G600/i,
    // Citation
    /Citation|CJ[0-9]+|CJ series|CJ2|CJ3|CJ4|Ultra|Latitude|Longitude|XLS| Sovereign/i,
    // Learjet
    /Learjet|LR-[0-9]+|LRJET|Lear/i,
    // Falcon
    /Falcon|F900|F2000|F7X|F8X|F6X|10X/i,
    // Embraer
    /ERJ|EMB-[0-9]+|E-Jet|E170|E175|E190|E195/i,
    // CRJ
    /CRJ|Canadair|Regional Jet/i,
    // Turboprops
    /King Air|KingAir|B200|B350/i,
    /Caravan|C208|208/i,
    /Pilatus|PC-12|PC12/i,
    /TBM/i,
    /Navajo|PA-31/i,
    // Other
    / Phenom|Embraer Phenom|300|100/i,
    /Praetor|500|600/i,
    /Legacy|450|500|600|650/i,
  ];
  
  for (const pattern of aircraftPatterns) {
    const match = title.match(pattern);
    if (match) {
      return match[0];
    }
  }
  return null;
};

// Helper to get airline image with fallback
const getAirlineImage = (company: string, category: string): string => {
  if (!company) return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['cadet-programme'];
  const companyLower = company.toLowerCase();

  // Try Cloudinary match first
  for (const [key, image] of Object.entries(CLOUDINARY_AIRLINES)) {
    if (companyLower.includes(key)) {
      return image;
    }
  }

  // Return category fallback
  return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['cadet-programme'];
};

// ============================================================================
// TYPES
// ============================================================================

interface PathwayJob {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  matchPercentage: number;
  location: string;
  type: string;
  salary: string;
  requirements: string[];
  tags: string[];
  postedAt: string;
  isLive?: boolean;
  isHot?: boolean;
  image: string;
}

interface PathwayData {
  id: string;
  name: string;
  category: 'all' | 'airline-pathways' | 'cadet-programme' | 'private' | 'privateSector' | 'cargo' | 'type-rating' | 'airtaxi-drones';
  airline: string;
  description: string;
  image: string;
  matchProbability: number;
  aircraftType: string; // X-Plane 3D model identifier
  requirements: {
    totalHours: number;
    multiEngineHours?: number;
    turbineHours?: number;
    typeRatings: string[];
  };
  salary: {
    firstYear: string;
    fifthYear: string;
    bonuses: string;
  };
  benefits: string[];
  locations: string[];
  hiringStatus: 'actively_hiring' | 'moderate' | 'limited' | 'frozen';
  positions: number;
  url?: string; // Link to original job posting
}

interface GapAnalysis {
  gapPercentage: number;
  totalGaps: number;
  highPriorityGaps: number;
  estimatedCost: number;
  estimatedTime: { days: number; months: number };
  recommendations: string[];
}

interface RecognitionProfile {
  totalScore: number;
  breakdown: {
    programs: number;
    experience: number;
    behavioral: number;
    language: number;
    skills: number;
  };
  pilotData?: {
    totalHours: number;
    multiEngineHours: number;
    turbineHours: number;
    typeRatings: string[];
  };
}

interface RequirementMatch {
  label: string;
  aligned: boolean;
  score?: number;
  status: 'under-minimums' | 'close' | 'match';
  suggestion?: string;
}

// ============================================================================
// REAL JOB DATA - Transform 452 jobs from PilotJobDatabasePage
// ============================================================================

// Discovery Pathways - Career pathways and programs for all pilot types
const DISCOVERY_PATHWAYS: Record<string, PathwayJob[]> = {
  'airline-pathways': [
  ],
  'cadet-programme': [
    {
      id: 'wingmentor-intro',
      title: 'Pathways to Partnered Cadet Programs',
      company: 'WingMentor',
      matchPercentage: 100,
      location: 'Global',
      type: 'Introduction',
      salary: 'Direct entry pathways for foundation program completion and description',
      requirements: ['CPL + ME/IR', 'Foundation Program Graduate', 'Partner Airline Eligible'],
      tags: ['Direct Entry', 'Partner Airlines', 'Career Progression'],
      postedAt: 'Featured',
      image: 'wingmentor-white'
    },
    {
      id: 'disc-comm-1',
      title: 'Envoy Air Pilot Cadet Program',
      company: 'Envoy Air (American Airlines Group)',
      matchPercentage: 94,
      location: 'United States | Home-Based',
      type: 'Cadet Program',
      salary: 'Financial assistance + guaranteed FO position',
      requirements: ['40+ hrs', 'CPL', 'Class 1 Medical', 'US Citizen/Perm Resident'],
      tags: ['American Airlines Flow', 'Embraer Fleet', 'Tuition Reimbursement'],
      postedAt: 'Access',
      image: 'https://www.envoyair.com/wp-content/uploads/2024/03/IMG_CadetProgram_MeganSnow.jpg'
    },
    {
      id: 'disc-comm-2',
      title: 'Air Cambodia Cadet Programme',
      company: 'Air Cambodia',
      matchPercentage: 92,
      location: 'Phnom Penh, Cambodia',
      type: 'Cadet Program',
      salary: '$2,000/mo during training',
      requirements: ['18-35 years', 'High School Diploma', 'Medical 1'],
      tags: ['Sponsored Training', 'A320 Type Rating', 'Guaranteed Job'],
      postedAt: 'Access',
      image: 'https://s28477.pcdn.co/wp-content/uploads/2024/10/CAngkor_1-984x554.png'
    },
    {
      id: 'disc-comm-3',
      title: 'Cathay Pacific Cadet Pilot Programme',
      company: 'Cathay Pacific Airways',
      matchPercentage: 88,
      location: 'Hong Kong / Australia',
      type: 'Cadet Program',
      salary: '$5,000 HKD/mo + training costs covered',
      requirements: ['18-40 years', 'HK Permanent Residency', 'Degree Preferred'],
      tags: ['Full Sponsorship', 'A350/B777', 'Definite Return'],
      postedAt: 'Limited Slots',
      image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg'
    },
    {
      id: 'disc-comm-4',
      title: 'FlyDubai Pilot Cadet Programme',
      company: 'FlyDubai',
      matchPercentage: 90,
      location: 'Dubai, United Arab Emirates',
      type: 'Cadet Program',
      salary: 'Full training sponsorship + competitive salary',
      requirements: ['18-30 years', 'High School Diploma', 'UAE Resident/Eligible'],
      tags: ['B737 MAX', 'Dubai Base', 'Career Progression'],
      postedAt: 'Check Website',
      image: 'https://cdn.uc.assets.prezly.com/5f1fd10f-a9bc-4bf0-aa29-b9a26dc42407/-/crop/1952x1066/0,272/-/preview/-/resize/1108x/-/quality/best/-/format/auto/'
    },
    {
      id: 'disc-comm-6',
      title: 'Ryanair Future Flyer Program',
      company: 'Ryanair / Atlantic Flight Training',
      matchPercentage: 89,
      location: 'Dublin, Ireland / Various',
      type: 'Cadet Program',
      salary: 'Self-funded training',
      requirements: ['250 hrs', 'B737 Type Rating', 'EU Passport'],
      tags: ['Low-Cost Leader', 'Fast Upgrade', '500+ Aircraft'],
      postedAt: 'Rolling Intake',
      image: 'https://cdn.aviationa2z.com/wp-content/uploads/2024/01/image-25-1024x683.png'
    },
    {
      id: 'disc-comm-airarabia',
      title: 'Air Arabia Cadet Pilot Program',
      company: 'Air Arabia',
      matchPercentage: 91,
      location: 'Sharjah, UAE / Various Bases',
      type: 'Cadet Program',
      salary: 'Full training sponsorship + salary',
      requirements: ['18-30 years', 'High School Diploma', 'Medical Class 1', 'UAE Resident/Eligible'],
      tags: ['A320 Fleet', 'GCC Network', 'Career Progression'],
      postedAt: 'Access',
      image: 'https://ifa2.vpcstechnology.com/wp-content/uploads/2020/06/Air-Arabia-Cadet-Pilot-Program.jpg'
    },
    {
      id: 'disc-comm-jetstar',
      title: 'Jetstar Cadet Pilot Programme',
      company: 'Jetstar Airways',
      matchPercentage: 88,
      location: 'Melbourne, Australia / Various Bases',
      type: 'Cadet Program',
      salary: 'Training sponsorship available',
      requirements: ['18-30 years', 'High School Diploma', 'Medical Class 1', 'Australian Citizen/Permanent Resident'],
      tags: ['A320 Fleet', 'Qantas Group', 'Asia-Pacific Network'],
      postedAt: 'Check Website',
      image: 'https://cdn.cabincrewwings.com/wp-content/uploads/2019/04/jetstar.jpg'
    },
    {
      id: 'disc-comm-cebu',
      title: 'Cebu Pacific Cadet Pilot Programme',
      company: 'Cebu Pacific',
      matchPercentage: 90,
      location: 'Manila, Philippines',
      type: 'Cadet Program',
      salary: 'Full training sponsorship',
      requirements: ['18-35 years', 'College Graduate', 'Medical Class 1', 'Filipino Citizen'],
      tags: ['A320 Fleet', 'Low-Cost Leader', 'Philippine Network'],
      postedAt: 'Access',
      image: 'https://images.jgsummit.com.ph/2021/12/15/0f999ad31e634dc5a90ad0d350cbe86ddfc4eca3.jpg'
    },
    {
      id: 'disc-comm-skywest',
      title: 'SkyWest Pilot Pathway Program',
      company: 'SkyWest Airlines',
      matchPercentage: 89,
      location: 'Salt Lake City, UT / Various Bases',
      type: 'Cadet Program',
      salary: 'Financial assistance + guaranteed FO position',
      requirements: ['Private Pilot License', 'College Student or Graduate', 'US Citizen/Perm Resident'],
      tags: ['Major Airline Flow', 'E175/CRJ Fleet', 'Tuition Reimbursement'],
      postedAt: 'Access',
      image: 'https://www.thrustflight.com/wp-content/uploads/2022/11/skywest-airlines-2-768x512.jpg'
    },
    {
      id: 'disc-comm-jetblue',
      title: 'JetBlue Gateway Program',
      company: 'JetBlue Airways',
      matchPercentage: 92,
      location: 'New York, NY / Various Bases',
      type: 'Cadet Program',
      salary: 'Direct-to-airline pathway',
      requirements: ['High School Graduate', 'Age 18+', 'US Citizen/Perm Resident', 'Class 1 Medical'],
      tags: ['Direct-to-Airline', 'A320/A220 Fleet', 'East Coast Network'],
      postedAt: 'Access',
      image: 'https://sanpedrosun.s3.us-west-1.amazonaws.com/wp-content/uploads/2023/12/09170529/Belizean-pilot-flies-JetBlues-inaugural-flight-to-Belize-3-657x438.jpg'
    },
    {
      id: 'disc-comm-emirates-cadet',
      title: 'Emirates Cadet Pilot Programme',
      company: 'Emirates Airlines',
      matchPercentage: 93,
      location: 'Dubai, UAE',
      type: 'Cadet Program',
      salary: 'Full training sponsorship + salary',
      requirements: ['18-28 years', 'High School Diploma', 'UAE National or Resident', 'ICAO Level 4'],
      tags: ['A380/A350 Fleet', '5-Star Airline', 'Global Network'],
      postedAt: 'Limited Slots',
      image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png'
    },
    {
      id: 'disc-comm-easyjet',
      title: 'easyJet Cadet Pilot Programme',
      company: 'easyJet',
      matchPercentage: 87,
      location: 'London, UK / Various European Bases',
      type: 'Cadet Program',
      salary: 'Training sponsorship available',
      requirements: ['18-30 years', 'High School Diploma', 'Medical Class 1', 'EU Passport/Work Permit'],
      tags: ['A320 Fleet', 'European Network', 'Low-Cost Leader'],
      postedAt: 'Access',
      image: 'https://www.cae.com/content/images/civil-aviation/_webp/easyJet_crew_.jpg_webp_40cd750bba9870f18aada2478b24840a.webp'
    },
    {
      id: 'disc-comm-wizzair',
      title: 'Wizz Air Cadet Pilot Programme',
      company: 'Wizz Air',
      matchPercentage: 86,
      location: 'Budapest, Hungary / Various European Bases',
      type: 'Cadet Program',
      salary: 'Training sponsorship available',
      requirements: ['18-30 years', 'High School Diploma', 'Medical Class 1', 'EU Passport/Work Permit'],
      tags: ['A321neo Fleet', 'European Low-Cost', 'Growing Network'],
      postedAt: 'Check Website',
      image: 'https://betteraviationjobs.com/storage/2019/11/Wizz-Air-Airbus-A321neo.jpg'
    },
    {
      id: 'disc-comm-airindia',
      title: 'Air India Cadet Pilot Programme',
      company: 'Air India',
      matchPercentage: 89,
      location: 'New Delhi, India / Various Indian Bases',
      type: 'Cadet Program',
      salary: 'Full training sponsorship + salary',
      requirements: ['18-30 years', '12th Grade/Equivalent', 'Medical Class 1', 'Indian Citizen'],
      tags: ['A350/B787 Fleet', 'Tata Group', 'Global Network'],
      postedAt: 'Access',
      image: 'https://blog.topcrewaviation.com/wp-content/uploads/2024/04/Air-India-A350.jpg'
    },
    {
      id: 'disc-comm-spicejet',
      title: 'SpiceJet Cadet Pilot Programme',
      company: 'SpiceJet',
      matchPercentage: 85,
      location: 'Gurugram, India / Various Indian Bases',
      type: 'Cadet Program',
      salary: 'Training sponsorship available',
      requirements: ['18-30 years', '12th Grade/Equivalent', 'Medical Class 1', 'Indian Citizen'],
      tags: ['B737 Fleet', 'Low-Cost Leader', 'Indian Network'],
      postedAt: 'Check Website',
      image: 'https://airinsight.com/wp-content/uploads/2019/04/SpiceJetMAX.jpg'
    },
    {
      id: 'disc-comm-royalbrunei',
      title: 'Royal Brunei Cadet Pilot Programme',
      company: 'Royal Brunei Airlines',
      matchPercentage: 88,
      location: 'Bandar Seri Begawan, Brunei',
      type: 'Cadet Program',
      salary: 'Full training sponsorship + salary',
      requirements: ['18-28 years', 'High School Diploma', 'Medical Class 1', 'Brunei Citizen/Permanent Resident'],
      tags: ['B787 Fleet', 'Flag Carrier', 'ASEAN Network'],
      postedAt: 'Access',
      image: 'https://worldsocialmedia.directory/wp-content/uploads/Royal-Brunei-400x270.jpg'
    },
    {
      id: 'disc-comm-pal',
      title: 'Philippine Airlines Cadet Pilot Programme',
      company: 'Philippine Airlines',
      matchPercentage: 89,
      location: 'Manila, Philippines',
      type: 'Cadet Program',
      salary: 'Full training sponsorship',
      requirements: ['18-30 years', 'College Graduate', 'Medical Class 1', 'Filipino Citizen'],
      tags: ['A320/A321 Fleet', 'Flag Carrier', 'Philippine Network'],
      postedAt: 'Access',
      image: 'https://www.philippineairlines.com/content/dam/palportal/migration/files/historyandmilestonespalsstory/nutshell-copy.jpg'
    },
    {
      id: 'disc-comm-etihad',
      title: 'Etihad Cadet Pilot Programme',
      company: 'Etihad Airways',
      matchPercentage: 91,
      location: 'Abu Dhabi, UAE',
      type: 'Cadet Program',
      salary: 'Full training sponsorship + salary during training',
      requirements: ['18-30 years', 'High School Diploma', 'English Proficiency', 'UAE Resident/Eligible'],
      tags: ['A350/B787 Fleet', '5-Star Airline', 'Global Network', 'Tax-Free'],
      postedAt: 'International Recruitment',
      image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg'
    }
  ],
  private: [
    {
      id: 'wingmentor-intro-private',
      title: 'Pathways to Type Rating Pathways',
      company: 'WingMentor',
      matchPercentage: 100,
      location: 'Global',
      type: 'Introduction',
      salary: 'Direct entry pathways for foundation program completion and description',
      requirements: ['CPL + ME/IR', 'Foundation Program Graduate', 'Partner Airline Eligible'],
      tags: ['Direct Entry', 'Partner Airlines', 'Career Progression'],
      postedAt: 'Featured',
      image: 'wingmentor-white'
    },
    {
      id: 'disc-priv-6',
      title: 'CAE Philippines Type Rating Center',
      company: 'CAE',
      matchPercentage: 93,
      location: 'Manila, Philippines',
      type: 'Type Rating Center',
      salary: 'Contact for pricing',
      requirements: ['CPL + IR', 'Medical Class 1', 'English Proficient'],
      tags: ['A320/B737 Simulators', 'EASA/CAA Approved', 'Modern Facility'],
      postedAt: 'Open Enrollment',
      image: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp'
    },
    {
      id: 'disc-priv-atpl',
      title: 'ATPL Pathway',
      company: 'Various ATOs',
      matchPercentage: 90,
      location: 'Global',
      type: 'License Pathway',
      salary: 'Contact for pricing',
      requirements: ['CPL + ME/IR', '1,500+ hrs TT', 'ATPL Theory Pass'],
      tags: ['Airline Transport License', 'Career Progression', 'Command Prep'],
      postedAt: 'Always Available',
      image: 'https://www.flightdeckfriend.com/wp-content/uploads/2021/01/Pilot-Assessment-Example-Technical-Exam-710x375.jpeg'
    },
    {
      id: 'disc-priv-seaplane',
      title: 'Seaplane Rating Pathway',
      company: 'Seaplane Training Centers',
      matchPercentage: 85,
      location: 'Miami, FL / Seattle, WA',
      type: 'Rating Pathway',
      salary: '$5,000 - $8,000',
      requirements: ['PPL or CPL', 'Water Operations', 'Class 3 Medical'],
      tags: ['Float Plane', 'Water Landing', 'Recreational & Commercial'],
      postedAt: 'Seasonal Intake',
      image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80'
    }
  ],
  privateSector: [
    {
      id: 'wingmentor-intro-privatesector',
      title: 'Pathways to Private Sector',
      company: 'WingMentor',
      matchPercentage: 100,
      location: 'Global',
      type: 'Introduction',
      salary: 'Direct entry pathways for foundation program completion and description',
      requirements: ['CPL + ME/IR', 'Foundation Program Graduate', 'Partner Airline Eligible'],
      tags: ['Direct Entry', 'Partner Airlines', 'Career Progression'],
      postedAt: 'Featured',
      image: 'wingmentor-white'
    },
    {
      id: 'disc-privsec-1',
      title: 'NetJets Pilot Career',
      company: 'NetJets',
      matchPercentage: 92,
      location: 'Columbus, OH / Global',
      type: 'Fractional Ownership',
      salary: '$175,000 - $220,000/year',
      requirements: ['2,500+ hrs TT', 'Type Rating', 'Part 135 Experience'],
      tags: ['Largest Fleet', 'Home Basing', 'Premium Benefits'],
      postedAt: 'Hiring Now',
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
    },
    {
      id: 'disc-privsec-2',
      title: 'VistaJet Captain',
      company: 'VistaJet',
      matchPercentage: 91,
      location: 'Malta / Global',
      type: 'Private Charter',
      salary: '$190,000 - $250,000/year',
      requirements: ['3,500+ hrs TT', 'Heavy Jet Type', 'VIP Experience'],
      tags: ['Silver Service', 'Worldwide Operations', 'Tax-Free Options'],
      postedAt: 'Access',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
    }
  ],
  cargo: [
    {
      id: 'wingmentor-intro-cargo',
      title: 'Pathways to Cargo Operations',
      company: 'WingMentor',
      matchPercentage: 100,
      location: 'Global',
      type: 'Introduction',
      salary: 'Direct entry pathways for foundation program completion and description',
      requirements: ['CPL + ME/IR', 'Foundation Program Graduate', 'Partner Airline Eligible'],
      tags: ['Direct Entry', 'Partner Airlines', 'Career Progression'],
      postedAt: 'Featured',
      image: 'wingmentor-white'
    },
    {
      id: 'disc-cargo-1',
      title: 'FedEx Express Pilot',
      company: 'FedEx Express',
      matchPercentage: 93,
      location: 'Memphis, TN / Global',
      type: 'Heavy Cargo',
      salary: '$250,000 - $350,000/year',
      requirements: ['4,000+ hrs TT', 'Heavy Jet Type', 'Part 121 Experience'],
      tags: ['Fortune 500', 'Union Benefits', 'Pension Plan'],
      postedAt: 'Hiring Now',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
    },
    {
      id: 'disc-cargo-2',
      title: 'UPS Airlines Captain',
      company: 'UPS Airlines',
      matchPercentage: 91,
      location: 'Louisville, KY / Global',
      type: 'Heavy Cargo',
      salary: '$240,000 - $320,000/year',
      requirements: ['3,500+ hrs TT', 'Widebody Type', 'Teamsters Union'],
      tags: ['Teamsters', 'Great Benefits', 'Stable Career'],
      postedAt: 'Access',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
    },
    {
      id: 'disc-cargo-3',
      title: 'Atlas Air Captain',
      company: 'Atlas Air',
      matchPercentage: 88,
      location: 'Purchase, NY / Global',
      type: 'ACMI Cargo',
      salary: '$220,000 - $300,000/year',
      requirements: ['3,000+ hrs TT', 'B747/B777 Type', 'International Exp'],
      tags: ['ACMI Leader', 'Global Network', 'Growth Opportunity'],
      postedAt: 'Hiring Now',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
    },
    {
      id: 'disc-cargopath-1',
      title: 'Ethiopian Cargo Pilot',
      company: 'Ethiopian Cargo',
      matchPercentage: 90,
      location: 'Addis Ababa, Ethiopia',
      type: 'Cargo Career Program',
      salary: '$180,000 - $240,000/year',
      requirements: ['2,500+ hrs TT', 'Type Rating', 'International License'],
      tags: ['Africa Hub', 'Growth Market', 'Training Provided'],
      postedAt: 'Access',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
    },
    {
      id: 'disc-cargopath-2',
      title: 'Kalitta Air Captain',
      company: 'Kalitta Air',
      matchPercentage: 87,
      location: 'Ypsilanti, MI / Global',
      type: 'Heavy Cargo',
      salary: '$200,000 - $280,000/year',
      requirements: ['3,000+ hrs TT', 'B747 Type', 'Heavy Jet Exp'],
      tags: ['B747 Fleet', 'Global Operations', 'Competitive Pay'],
      postedAt: 'Hiring Now',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
    }
  ],
  'type-rating': [
    {
      id: 'wingmentor-intro-type-rating',
      title: 'Pathways to Type Rating',
      company: 'WingMentor',
      matchPercentage: 100,
      location: 'Global',
      type: 'Introduction',
      salary: 'Direct entry pathways for type rating completion',
      requirements: ['CPL + ME/IR', 'Foundation Program Graduate', 'Partner Airline Eligible'],
      tags: ['Direct Entry', 'Partner Airlines', 'Career Progression'],
      postedAt: 'Featured',
      image: 'wingmentor-white'
    },
    {
      id: 'disc-type-1',
      title: 'CAE Philippines Type Rating Center',
      company: 'CAE',
      matchPercentage: 93,
      location: 'Manila, Philippines',
      type: 'Type Rating Center',
      salary: 'Contact for pricing',
      requirements: ['CPL + IR', 'Medical Class 1', 'English Proficient'],
      tags: ['A320/B737 Simulators', 'EASA/CAA Approved', 'Modern Facility'],
      postedAt: 'Open Enrollment',
      image: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp'
    },
    {
      id: 'disc-type-2',
      title: 'ATPL Pathway',
      company: 'Various ATOs',
      matchPercentage: 90,
      location: 'Global',
      type: 'License Pathway',
      salary: 'Contact for pricing',
      requirements: ['CPL + ME/IR', '1,500+ hrs TT', 'ATPL Theory Pass'],
      tags: ['Airline Transport License', 'Career Progression', 'Command Prep'],
      postedAt: 'Always Available',
      image: 'https://www.flightdeckfriend.com/wp-content/uploads/2021/01/Pilot-Assessment-Example-Technical-Exam-710x375.jpeg'
    },
    {
      id: 'disc-type-3',
      title: 'Multi Engine Rating Pathway',
      company: 'Flight Training Organizations',
      matchPercentage: 95,
      location: 'Global',
      type: 'Rating Pathway',
      salary: '$8,000 - $15,000',
      requirements: ['PPL or CPL', 'Single Engine Experience', 'Class 2 Medical'],
      tags: ['ME Rating', 'Multi-Engine Command', 'Career Step'],
      postedAt: 'Always Available',
      image: 'https://cdn.prod.website-files.com/67b7f6762c0ae79aa3b1f3b0/6813ec96ef44eea3df482f3d_N53TW%203.jpg'
    },
    {
      id: 'disc-type-4',
      title: 'Instrument Rating Pathway',
      company: 'IFR Training Centers',
      matchPercentage: 97,
      location: 'Global',
      type: 'Rating Pathway',
      salary: '$10,000 - $18,000',
      requirements: ['PPL or CPL', '50+ hrs Cross-Country', 'Class 2 Medical'],
      tags: ['IFR Operations', 'All Weather Flying', 'Essential Rating'],
      postedAt: 'Always Available',
      image: 'https://media.pea.com/wp-content/uploads/2023/06/altfull-view-of-G1000-Avionics-of-Cessna-172-1024x607.jpeg'
    },
    {
      id: 'disc-type-5',
      title: 'UPRT Rating Pathway',
      company: 'UPRT Training Providers',
      matchPercentage: 88,
      location: 'Various Locations',
      type: 'Training Pathway',
      salary: '$3,000 - $5,000',
      requirements: ['CPL or ATPL', 'Spin Awareness', 'EASA/FAA Compliant'],
      tags: ['Upset Recovery', 'Loss of Control', 'Safety Critical'],
      postedAt: 'Open Enrollment',
      image: 'https://i.vimeocdn.com/video/1769783286-138fb27314025852ea22110de052d224665fcb0d82fad22a16f48a77d0001cc7-d?f=webp'
    }
  ],
  'airtaxi-drones': [
    {
      id: 'wingmentor-intro-evtol',
      title: 'Pathways to AirTaxi & Drones',
      company: 'WingMentor',
      matchPercentage: 100,
      location: 'Global',
      type: 'Introduction',
      salary: 'Direct entry pathways for foundation program completion and description',
      requirements: ['CPL + ME/IR', 'Foundation Program Graduate', 'Partner Airline Eligible'],
      tags: ['Direct Entry', 'Partner Airlines', 'Career Progression'],
      postedAt: 'Featured',
      image: 'wingmentor-white'
    },
    {
      id: 'disc-evtol-1',
      title: 'Joby Aviation Pilot',
      company: 'Joby Aviation',
      matchPercentage: 92,
      location: 'Santa Cruz, CA / Various',
      type: 'eVTOL Manufacturer',
      salary: '$150,000 - $200,000/year',
      requirements: ['1,500+ hrs TT', 'Helicopter Rating', 'Test Pilot Exp'],
      tags: ['eVTOL Leader', 'Electric Aviation', 'Stock Options'],
      postedAt: 'Hiring Now',
      image: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80'
    },
    {
      id: 'disc-evtol-2',
      title: 'Archer Aviation Pilot',
      company: 'Archer Aviation',
      matchPercentage: 90,
      location: 'San Jose, CA / Various',
      type: 'eVTOL Manufacturer',
      salary: '$140,000 - $190,000/year',
      requirements: ['1,200+ hrs TT', 'Fixed Wing Exp', 'Instrument Rating'],
      tags: ['Midnight Aircraft', 'Urban Air Mobility', 'Competitive Pay'],
      postedAt: 'Access',
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
    },
    {
      id: 'disc-evtol-3',
      title: 'Lilium Jet Pilot',
      company: 'Lilium',
      matchPercentage: 88,
      location: 'Munich, Germany / Global',
      type: 'eVTOL Manufacturer',
      salary: '€130,000 - €180,000/year',
      requirements: ['1,000+ hrs TT', 'EASA License', 'Type Rating Preferred'],
      tags: ['Electric Jet', 'Regional Air Mobility', 'Innovative Tech'],
      postedAt: 'Check Website',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
    },
    {
      id: 'disc-drone-1',
      title: 'Drone Test Pilot',
      company: 'Various Companies',
      matchPercentage: 85,
      location: 'Global',
      type: 'UAV Operations',
      salary: '$100,000 - $150,000/year',
      requirements: ['500+ hrs TT', 'UAV Certificate', 'Technical Background'],
      tags: ['Autonomous Systems', 'Testing & Development', 'Emerging Field'],
      postedAt: 'Growing Field',
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
    }
  ]
};

// Transform real job data to PathwayData format

// Transform real job data to PathwayData format
const transformJobToPathway = (job: typeof jobApplicationListings[0], index: number): PathwayData => {
  // Determine category based on job characteristics
  // Categories: airline-pathways, cadet-programme, private, privateSector, cargo, type-rating, airtaxi-drones
  let category: PathwayData['category'] = 'cadet-programme';
  const title = String(job.title || '').toLowerCase();
  const aircraft = String(job.aircraft || '').toLowerCase();
  const company = String(job.company || '').toLowerCase();
  const jobRole = String(job.role || '').toLowerCase();
  
  // AIRLINE PATHWAYS: Major airlines, first officer, captain positions
  if (title.includes('first officer') || title.includes('captain') || title.includes('first officer') ||
      title.includes('pilot') && (title.includes('airline') || title.includes('air lines') || title.includes('airways')) ||
      company.includes('delta') || company.includes('united') || company.includes('american') ||
      company.includes('southwest') || company.includes('jetblue') || company.includes('alaska') ||
      company.includes('british airways') || company.includes('lufthansa') || company.includes('air france') ||
      company.includes('klm') || company.includes('emirates') || company.includes('qatar') ||
      company.includes('singapore') || company.includes('cathay') || company.includes('ana') ||
      company.includes('jal') || company.includes('turkish') || jobRole.includes('airline')) {
    category = 'airline-pathways';
  }
  // PRIVATE: Corporate, charter, business jets, private aviation, type rating programs
  else if (title.includes('private') || title.includes('corporate') || title.includes('charter') || 
      title.includes('type rating') || title.includes('tr') || title.includes('type-rating') ||
      aircraft.includes('citation') || aircraft.includes('gulfstream') || aircraft.includes('global') || 
      aircraft.includes('phenom') || aircraft.includes('challenger') || aircraft.includes('learjet') ||
      aircraft.includes('king air') || aircraft.includes('kingair') || aircraft.includes('b200') || 
      aircraft.includes('b350') || aircraft.includes('caravan') || aircraft.includes('grand caravan') ||
      aircraft.includes('falcon') || aircraft.includes('legacy') || aircraft.includes('pc-12') ||
      aircraft.includes('pc12') || aircraft.includes('pc 12') ||
      jobRole.includes('corporate') || jobRole.includes('private') || jobRole.includes('charter') ||
      jobRole.includes('type rating') || jobRole.includes('tr')) {
    category = 'private';
  }
  // PRIVATE SECTOR: Executive transport, fractional ownership, luxury charter
  else if (title.includes('executive') || title.includes('fractional') || title.includes('luxury') ||
           title.includes('vip') || title.includes('business aviation') ||
           company.includes('vista') || company.includes('flexjet') || company.includes('netjets') ||
           company.includes('wheels up') || company.includes('planesense') || company.includes('execujet') ||
           company.includes('global jet') || company.includes('fractional') || company.includes('ownership')) {
    category = 'privateSector';
  }
  // CARGO: Airline Expectations - freight and logistics operations
  else if (title.includes('cargo') || company.includes('cargo') || company.includes('atlas') ||
           company.includes('fedex') || company.includes('ups') || company.includes('dhl') ||
           company.includes('kalitta') || company.includes('southern air') || company.includes('amazon') ||
           title.includes('freight') || title.includes('logistics')) {
    category = 'cargo';
  }
  // TYPE RATING: Type rating pathways, training centers, license pathways
  else if (title.includes('type rating') || title.includes('rating') || title.includes('atpl') ||
           title.includes('multi engine') || title.includes('instrument') || title.includes('uprt') ||
           company.includes('cae') || company.includes('flight safety') || company.includes('simcom') ||
           title.includes('instructor') || title.includes('cbta') || title.includes('cat i') ||
           title.includes('cat ii') || title.includes('cat iii')) {
    category = 'type-rating';
  }
  // AIRTAXI & DRONES: Emerging AirTaxi & Drones Pathway
  else if (title.includes('evtol') || title.includes('air taxi') || title.includes('electric') ||
           title.includes('autonomous') || title.includes('drone') || title.includes('uav') ||
           aircraft.includes('evtol') || aircraft.includes('air taxi') || aircraft.includes('electric') ||
           company.includes('joby') || company.includes('archer') || company.includes('lilium') || 
           company.includes('wisk') || company.includes('beta') || company.includes('vertical') ||
           company.includes('air taxi') || company.includes('evtol') || company.includes('drone') ||
           jobRole.includes('test') || jobRole.includes('experimental') || jobRole.includes('special') ||
           title.includes('test pilot') || title.includes('fire') || title.includes('medevac') || 
           title.includes('ambulance') || title.includes('surveillance') || title.includes('patrol')) {
    category = 'airtaxi-drones';
  }
  // CADET PROGRAMME: Major, regional, budget carriers serving scheduled passenger routes (default)
  else if (title.includes('first officer') || title.includes('captain') || 
           title.includes('pilot') || title.includes('second officer') ||
           aircraft.includes('a320') || aircraft.includes('a330') || aircraft.includes('a350') || 
           aircraft.includes('a380') || aircraft.includes('b737') || aircraft.includes('b747') || 
           aircraft.includes('b757') || aircraft.includes('b767') || aircraft.includes('b777') || 
           aircraft.includes('b787') || aircraft.includes('787') || aircraft.includes('777') || 
           aircraft.includes('737') || aircraft.includes('a318') || aircraft.includes('a319') || 
           aircraft.includes('a321') || aircraft.includes('a321neo') || aircraft.includes('a320neo') ||
           aircraft.includes('atr72') || aircraft.includes('atr') || aircraft.includes('q400') ||
           aircraft.includes('e175') || aircraft.includes('e190') || aircraft.includes('e195') ||
           aircraft.includes('erj') || aircraft.includes('emb-') || aircraft.includes('crj') ||
           company.includes('airlines') || company.includes('delta') || company.includes('american') ||
           company.includes('united') || company.includes('lufthansa') || company.includes('emirates') ||
           company.includes('qat') || company.includes('etihad') || company.includes('singapore') ||
           company.includes('cathay') || company.includes('air france') || company.includes('klm') ||
           company.includes('british air') || company.includes('jetblue') || company.includes('southwest') ||
           company.includes('alaska') || company.includes('regional') || company.includes('envoy') ||
           company.includes('psa') || company.includes('piedmont') || company.includes('air wisconsin') ||
           company.includes('skywest') || company.includes('republic') || company.includes('mesa') ||
           company.includes('ryanair') || company.includes('easyjet') || company.includes('airasia') ||
           company.includes('indigo') || company.includes('spirit') || company.includes('frontier')) {
    category = 'cadet-programme';
  }
  
  // Match probability is calculated from the pilot's recognition profile — passed in at call site
  const matchProbability = 75; // placeholder, overridden by caller via recognitionProfile
  
  // Determine hiring status
  let hiringStatus: PathwayData['hiringStatus'] = 'moderate';
  if (String(job.status || '').toLowerCase().includes('hiring now') || String(job.status || '').toLowerCase().includes('actively')) {
    hiringStatus = 'actively_hiring';
  } else if (String(job.status || '').toLowerCase().includes('limited') || String(job.status || '').toLowerCase().includes('selective')) {
    hiringStatus = 'limited';
  } else if (String(job.status || '').toLowerCase().includes('frozen') || String(job.status || '').toLowerCase().includes('pause')) {
    hiringStatus = 'frozen';
  }
  
  // Parse flight time requirements
  const totalHours = parseInt(job.flightTime?.match(/(\d{3,4})/)?.[0] || '1500');
  const picHours = parseInt(job.picTime?.match(/(\d{3,4})/)?.[0] || '0');
  const turbineHours = String(job.flightTime || '').toLowerCase().includes('turbine') ? parseInt(job.flightTime?.match(/turbine.*?([\d,]+)/i)?.[0]?.replace(/[^\d]/g, '') || '0') : 0;
  
  // Get real airline image from Airline Expectations bank
  const airlineImage = getAirlineImage(job.company, category);
  
  // Determine aircraft type for 3D model
  let aircraftType = job.aircraft;
  if (!aircraftType || aircraftType === 'N/A') {
    aircraftType = 'generic';
  }
  
  // Check if aircraft is in available 3D model list
  const typeKey = String(aircraftType || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const hasAircraftModel = AIRCRAFT_IMAGES[typeKey] ||
    Object.keys(AIRCRAFT_IMAGES).some(key =>
      typeKey.includes(String(key).toUpperCase()) || String(key).toUpperCase().includes(typeKey)
    );
  
  // If aircraft not in list, mark as unavailable
  if (!hasAircraftModel && aircraftType !== 'generic') {
    aircraftType = 'unavailable';
  }

  return {
    id: `job-${index}`,
    name: job.title,
    category,
    airline: job.company,
    description: job.jobDescription || `${job.title} position at ${job.company}. ${job.jobExpectations || 'See full requirements below.'}`,
    image: airlineImage, // Use real airline image from Airline Expectations
    matchProbability,
    aircraftType,
    requirements: {
      totalHours,
      multiEngineHours: String(job.flightTime || '').toLowerCase().includes('multi') ? Math.floor(totalHours * 0.3) : 0,
      turbineHours: turbineHours || (category === 'airtaxi-drones' ? 1000 : category === 'cadet-programme' ? 500 : 0),
      typeRatings: String(job.typeRating || '').toLowerCase().includes('required') ? [job.aircraft.split(' ')[0]] : [],
    },
    salary: {
      firstYear: job.compensation || 'Competitive',
      fifthYear: 'Career progression available',
      bonuses: String(job.visaSponsorship || '').toLowerCase().includes('yes') ? 'Visa Sponsorship Available' : 'Standard benefits package',
    },
    benefits: [
      String(job.visaSponsorship || '').toLowerCase().includes('yes') ? 'Visa Sponsorship' : 'No Visa Sponsorship',
      job.medicalClass?.includes('1') ? 'Class 1 Medical Required' : 'Class 2 Medical Required',
    ],
    locations: [job.location || 'TBD'],
    hiringStatus,
    positions: hiringStatus === 'actively_hiring' ? 20 + Math.floor(Math.random() * 50) : 5 + Math.floor(Math.random() * 15),
    url: job.url, // Link to original job posting
  };
};

const MOCK_GAP_ANALYSIS: GapAnalysis = {
  gapPercentage: 23,
  totalGaps: 4,
  highPriorityGaps: 1,
  estimatedCost: 8500,
  estimatedTime: { days: 45, months: 2 },
  recommendations: [
    'Need 250 more multi-engine hours',
    'Complete A320 Type Rating Program',
    'Improve technical skills score to 80+',
    'Add turbine time through corporate charter'
  ],
};

// Mock user recognition profile (in real app, this would come from user data)
const MOCK_USER_PROFILE: RecognitionProfile = {
  totalScore: 78,
  breakdown: {
    programs: 85,
    experience: 72,
    behavioral: 80,
    language: 90,
    skills: 65,
  },
  pilotData: {
    totalHours: 3500,
    multiEngineHours: 1200,
    turbineHours: 800,
    typeRatings: ['B737', 'A320'],
  },
};

// Function to convert user profile to RecognitionProfile format
const convertToRecognitionProfile = (userProfile: any): RecognitionProfile => {
  const totalHours = userProfile?.current_flight_hours || 0;

  const aircraftRatings = userProfile?.aircraft_ratings || [];
  const ratings = userProfile?.ratings || [];
  const typeRatings = [...aircraftRatings.map((ar: any) => ar.aircraft_type || ar), ...ratings].filter(Boolean);

  const experienceLevel = userProfile?.experience_level || 'Low Timer';
  const multiEngineHours = experienceLevel === 'High Timer' ? Math.round(totalHours * 0.6)
    : experienceLevel === 'Middle Timer' ? Math.round(totalHours * 0.4)
    : Math.round(totalHours * 0.2);
  const turbineHours = experienceLevel === 'High Timer' ? Math.round(totalHours * 0.5)
    : experienceLevel === 'Middle Timer' ? Math.round(totalHours * 0.3)
    : Math.round(totalHours * 0.1);

  // Experience score: logarithmic scale — 100h=30, 500h=50, 1500h=70, 5000h=90
  const expScore = totalHours === 0 ? 10
    : Math.min(95, Math.round(30 + Math.log10(Math.max(1, totalHours)) * 18));

  // Language score from ICAO level
  const icaoLevel = userProfile?.english_proficiency_level || userProfile?.english_proficiency || '';
  const langScore = icaoLevel.includes('6') ? 100
    : icaoLevel.includes('5') ? 88
    : icaoLevel.includes('4') ? 72
    : 50;

  // Medical score
  const medical = userProfile?.medical_class || '';
  const medScore = medical.includes('1') ? 100 : medical.includes('2') ? 75 : 40;

  // Type rating bonus
  const trBonus = typeRatings.length > 0 ? Math.min(20, typeRatings.length * 8) : 0;

  // Composite totalScore (0–100)
  const totalScore = Math.min(100, Math.round(
    expScore * 0.45 + langScore * 0.20 + medScore * 0.15 + 65 * 0.20 + trBonus
  ));

  return {
    totalScore,
    breakdown: {
      programs: 65,
      experience: expScore,
      behavioral: 65,
      language: langScore,
      skills: 65,
    },
    pilotData: { totalHours, multiEngineHours, turbineHours, typeRatings },
  };
};

// Real match probability calculator — called per job against the pilot's recognition profile
const calcMatchProbability = (job: { flightTime?: string; typeRating?: string; visaSponsorship?: string; location?: string }, profile: RecognitionProfile): number => {
  let score = 0;
  let max = 0;

  const userHours = profile.pilotData?.totalHours || 0;
  const flightTimeText = job.flightTime?.replace(/,/g, '') || '';
  const reqHoursMatch = flightTimeText.match(/(\d{3,5})/);
  const reqHours = reqHoursMatch ? parseInt(reqHoursMatch[1]) : 0;

  // Hours (40 pts)
  max += 40;
  if (reqHours === 0 || userHours >= reqHours) {
    score += 40;
  } else if (userHours >= reqHours * 0.75) {
    score += 28;
  } else if (userHours >= reqHours * 0.5) {
    score += 16;
  } else if (userHours > 0) {
    score += 6;
  }

  // Type rating (25 pts)
  max += 25;
  const trReq = String(job.typeRating || '').toLowerCase() || '';
  const userTRs = (profile.pilotData?.typeRatings || []).map((t: string) => String(t || '').toLowerCase());
  if (!trReq || trReq === 'not required' || trReq === 'n/a') {
    score += 25;
  } else if (userTRs.some(tr => trReq.includes(tr) || tr.includes(trReq.split(' ')[0]))) {
    score += 25;
  } else if (userTRs.length > 0) {
    score += 10; // Has a type rating, just not the exact one
  }

  // Medical / license via recognition score (20 pts)
  max += 20;
  score += Math.round((profile.totalScore / 100) * 20);

  // Language (15 pts)
  max += 15;
  score += Math.round((profile.breakdown.language / 100) * 15);

  const raw = Math.round((score / max) * 100);
  // Clamp to 45–99 so it always feels meaningful
  return Math.max(45, Math.min(99, raw));
};

// Function to compare job requirements against user profile
const analyzeRequirementAlignment = (
  pathway: PathwayData,
  userProfile: RecognitionProfile
): RequirementMatch[] => {
  const matches: RequirementMatch[] = [];

  // Helper to calculate status based on score
  const calculateStatus = (ratio: number): 'under-minimums' | 'close' | 'match' => {
    if (ratio < 0.5) return 'under-minimums';
    if (ratio < 0.8) return 'close';
    return 'match';
  };

  // Helper to calculate status based on score value
  const calculateStatusFromScore = (score: number, threshold: number): 'under-minimums' | 'close' | 'match' => {
    if (score < threshold * 0.7) return 'under-minimums';
    if (score < threshold) return 'close';
    return 'match';
  };

  // Check total hours
  const hoursRatio = (userProfile.pilotData?.totalHours || 0) / pathway.requirements.totalHours;
  const hoursDiff = pathway.requirements.totalHours - (userProfile.pilotData?.totalHours || 0);
  matches.push({
    label: `Total Hours: ${userProfile.pilotData?.totalHours || 0} / ${pathway.requirements.totalHours}`,
    aligned: hoursRatio >= 0.8,
    score: Math.min(hoursRatio * 100, 100),
    status: calculateStatus(hoursRatio),
    suggestion: hoursDiff > 0 ? `Need ${hoursDiff} more flight hours` : 'Meets requirement',
  });

  // Check multi-engine hours if required
  if (pathway.requirements.multiEngineHours) {
    const meRatio = (userProfile.pilotData?.multiEngineHours || 0) / pathway.requirements.multiEngineHours;
    const meDiff = pathway.requirements.multiEngineHours - (userProfile.pilotData?.multiEngineHours || 0);
    matches.push({
      label: `Multi-Engine: ${userProfile.pilotData?.multiEngineHours || 0} / ${pathway.requirements.multiEngineHours}`,
      aligned: meRatio >= 0.8,
      score: Math.min(meRatio * 100, 100),
      status: calculateStatus(meRatio),
      suggestion: meDiff > 0 ? `Need ${meDiff} more multi-engine hours` : 'Meets requirement',
    });
  }

  // Check turbine hours if required
  if (pathway.requirements.turbineHours) {
    const turbineRatio = (userProfile.pilotData?.turbineHours || 0) / pathway.requirements.turbineHours;
    const turbineDiff = pathway.requirements.turbineHours - (userProfile.pilotData?.turbineHours || 0);
    matches.push({
      label: `Turbine Time: ${userProfile.pilotData?.turbineHours || 0} / ${pathway.requirements.turbineHours}`,
      aligned: turbineRatio >= 0.8,
      score: Math.min(turbineRatio * 100, 100),
      status: calculateStatus(turbineRatio),
      suggestion: turbineDiff > 0 ? `Need ${turbineDiff} more turbine hours` : 'Meets requirement',
    });
  }

  // Check type ratings
  if (pathway.requirements.typeRatings.length > 0) {
    const hasTypeRating = pathway.requirements.typeRatings.some(rating =>
      userProfile.pilotData?.typeRatings?.some(userRating =>
        String(userRating || '').toUpperCase().includes(String(rating || '').toUpperCase())
      )
    );
    const missingRatings = pathway.requirements.typeRatings.filter(rating =>
      !userProfile.pilotData?.typeRatings?.some(userRating =>
        String(userRating || '').toUpperCase().includes(String(rating || '').toUpperCase())
      )
    );
    matches.push({
      label: `Type Rating: ${pathway.requirements.typeRatings.join(', ')}`,
      aligned: hasTypeRating,
      status: hasTypeRating ? 'match' : 'under-minimums',
      suggestion: hasTypeRating ? 'Type rating obtained' : `Need ${missingRatings.join(' and ')} type rating${missingRatings.length > 1 ? 's' : ''}`,
    });
  }

  // Check experience score
  const expDiff = 70 - userProfile.breakdown.experience;
  matches.push({
    label: 'Experience Score',
    aligned: userProfile.breakdown.experience >= 70,
    score: userProfile.breakdown.experience,
    status: calculateStatusFromScore(userProfile.breakdown.experience, 70),
    suggestion: expDiff > 0 ? `Improve experience by ${expDiff} points` : 'Meets requirement',
  });

  // Check skills score
  const skillsDiff = 70 - userProfile.breakdown.skills;
  matches.push({
    label: 'Technical Skills',
    aligned: userProfile.breakdown.skills >= 70,
    score: userProfile.breakdown.skills,
    status: calculateStatusFromScore(userProfile.breakdown.skills, 70),
    suggestion: skillsDiff > 0 ? `Improve technical skills by ${skillsDiff} points` : 'Meets requirement',
  });

  // Check language proficiency
  const langDiff = 80 - userProfile.breakdown.language;
  matches.push({
    label: 'Language Proficiency',
    aligned: userProfile.breakdown.language >= 80,
    score: userProfile.breakdown.language,
    status: calculateStatusFromScore(userProfile.breakdown.language, 80),
    suggestion: langDiff > 0 ? `Improve language proficiency by ${langDiff} points` : 'Meets requirement',
  });

  return matches;
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Glassmorphism Card - supports both light and dark modes
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; isDarkMode?: boolean }> = ({ 
  children, 
  className = '', 
  onClick,
  isDarkMode = true 
}) => (
  <motion.div
    className={`backdrop-blur-xl rounded-2xl overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-900/40 border border-slate-700/50' 
        : 'bg-white/70 border border-slate-200/50 shadow-lg'
    } ${className}`}
    onClick={onClick}
    whileHover={{ scale: onClick ? 1.01 : 1, borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)' }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

// Pathway Probability Badge
const ProbabilityBadge: React.FC<{ probability: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
  probability, 
  size = 'md' 
}) => {
  const getColor = (p: number) => {
    if (p >= 85) return 'from-emerald-500 to-emerald-400';
    if (p >= 70) return 'from-blue-500 to-blue-400';
    if (p >= 50) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${getColor(probability)} ${sizeClasses[size]} font-semibold text-white shadow-lg`}>
      <Target className="w-3.5 h-3.5" />
      {probability}% Match
    </div>
  );
};

// Hiring Status Badge
const HiringBadge: React.FC<{ status: string; positions: number }> = ({ status, positions }) => {
  const configs: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    actively_hiring: { 
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: <Zap className="w-3.5 h-3.5" />,
      label: `${positions} positions`
    },
    moderate: { 
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: <Users className="w-3.5 h-3.5" />,
      label: 'Selective hiring'
    },
    limited: { 
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Limited slots'
    },
    frozen: { 
      color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: 'Hiring frozen'
    },
  };

  const config = configs[status] || configs.moderate;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} text-sm`}>
      {config.icon}
      <span className="font-medium">{config.label}</span>
    </div>
  );
};

// Pathway Card (YouTube-style) - supports both light and dark modes
const PathwayCard: React.FC<{ 
  pathway: PathwayData; 
  isExpanded: boolean; 
  onToggle: () => void;
  onCalculateMatch: () => void;
  isDarkMode?: boolean;
  userProfile?: RecognitionProfile;
}> = ({ pathway, isExpanded, onToggle, onCalculateMatch, isDarkMode = true, userProfile = MOCK_USER_PROFILE }) => {
  const categoryColors: Record<string, string> = {
    all: 'from-slate-600 to-slate-400',
    'airline-pathways': 'from-indigo-600 to-indigo-400',
    'cadet-programme': 'from-blue-600 to-blue-400',
    'airtaxi-drones': 'from-purple-600 to-purple-400',
    private: 'from-amber-600 to-amber-400',
    'privateSector': 'from-orange-600 to-orange-400',
    cargo: 'from-emerald-600 to-emerald-400',
    'type-rating': 'from-pink-600 to-pink-400',
  };

  const textColor = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textColorLight = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textColorWhite = isDarkMode ? 'text-white' : 'text-slate-900';
  const bgGradient = isDarkMode 
    ? 'from-slate-950 via-slate-950/50 to-transparent' 
    : 'from-slate-900/80 via-slate-800/40 to-transparent';
  const expandButtonBg = isDarkMode ? 'bg-slate-800/80' : 'bg-white/80';
  const expandButtonText = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  // Get airline logo and aircraft image
  const airlineLogo = getAirlineLogo(pathway.airline);
  const aircraftImage = getAircraftImage(pathway.aircraftType);

  // Format aircraft type with manufacturer
  const formatAircraftType = (type: string): string => {
    const upperType = String(type || '').toUpperCase();
    if (upperType.includes('A318') || upperType.includes('A319') || upperType.includes('A320') || upperType.includes('A321')) {
      return 'Airbus A320 Family';
    } else if (upperType.includes('B737') || upperType.includes('737')) {
      return 'Boeing 737';
    } else if (upperType.includes('B747') || upperType.includes('747')) {
      return 'Boeing 747';
    } else if (upperType.includes('B777') || upperType.includes('777')) {
      return 'Boeing 777';
    } else if (upperType.includes('B787') || upperType.includes('787')) {
      return 'Boeing 787 Dreamliner';
    } else if (upperType.includes('A350') || upperType.includes('350')) {
      return 'Airbus A350';
    } else if (upperType.includes('E195') || upperType.includes('E190') || upperType.includes('E170')) {
      return 'Embraer E-Jet';
    } else if (upperType.includes('A220') || upperType.includes('220')) {
      return 'Airbus A220';
    } else if (upperType.includes('CRJ')) {
      return 'Bombardier CRJ';
    } else if (upperType.includes('CHALLENGER') || upperType.includes('CL-30')) {
      return 'Bombardier Challenger 300';
    } else if (upperType.includes('CITATION') || upperType.includes('CITATIONI') || upperType.includes('CITATION I') || upperType.includes('CITATION ISP')) {
      return 'Cessna Citation I / I/SP';
    } else if (upperType.includes('GULFSTREAM')) {
      return 'Gulfstream';
    } else if (upperType.includes('GLOBAL')) {
      return 'Bombardier Global';
    } else if (upperType.includes('LEARJET')) {
      return 'Bombardier Learjet';
    } else if (upperType.includes('FALCON')) {
      return 'Dassault Falcon';
    } else if (upperType.includes('KING AIR') || upperType.includes('KINGAIR')) {
      return 'Beechcraft King Air';
    }
    return type;
  };

  const formattedAircraftType = formatAircraftType(pathway.aircraftType);

  // Analyze requirement alignment
  const requirementMatches = analyzeRequirementAlignment(pathway, userProfile);

  // Format salary with currency conversion
  const formatSalary = (salary: string): string => {
    // Check if salary already contains currency info
    if (salary.includes('AED') || salary.includes('USD') || salary.includes('$')) {
      return salary;
    }
    
    // Default format with USD
    return `Up to ${salary} per year`;
  };

  const formattedSalary = formatSalary(pathway.salary.firstYear);

  // Format location to show Country (Code) | City
  const formatLocation = (location: string): string => {
    // If location already contains pipe, return as is
    if (location.includes('|')) {
      return location;
    }
    
    // Simple mapping for common locations
    const locationMap: Record<string, string> = {
      'abu dhabi': 'United Arab Emirates (UAE) | Abu Dhabi',
      'dubai': 'United Arab Emirates (UAE) | Dubai',
      'doha': 'Qatar (QAT) | Doha',
      'singapore': 'Singapore (SGP) | Singapore',
      'hong kong': 'Hong Kong (HKG) | Hong Kong',
      'london': 'United Kingdom (GBR) | London',
      'new york': 'United States (USA) | New York',
      'los angeles': 'United States (USA) | Los Angeles',
      'chicago': 'United States (USA) | Chicago',
      'miami': 'United States (USA) | Miami',
      'seattle': 'United States (USA) | Seattle',
      'cincinnati': 'United States (USA) | Cincinnati',
      'galesburg': 'United States (USA) | Galesburg',
      'abilene': 'United States (USA) | Abilene',
    };

    if (!location) return location;
    const locationLower = location.toLowerCase();
    for (const [key, value] of Object.entries(locationMap)) {
      if (locationLower.includes(key)) {
        return value;
      }
    }

    return location;
  };

  const formattedLocation = formatLocation(pathway.locations[0]);

  return (
    <GlassCard
      className={`transition-all duration-300 ${isExpanded ? 'ring-2 ring-emerald-500' : 'hover:scale-[1.02]'}`}
      isDarkMode={isDarkMode}
    >
      <div onClick={onToggle}>
        {/* Top - Image with overlays */}
        <div className={`relative aspect-[16/9] overflow-hidden rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} cursor-pointer`}>
          <img
            src={aircraftImage}
            alt={pathway.aircraftType}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = FALLBACK_IMAGES[pathway.category] || FALLBACK_IMAGES['cadet-programme'];
            }}
          />

          {/* Category Badge */}
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full bg-gradient-to-r ${categoryColors[pathway.category]} text-white text-xs font-semibold uppercase tracking-wide shadow-lg`}>
            {pathway.category}
          </div>

          {/* PR Score and Match Percentage */}
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="bg-emerald-500 px-2 py-0.5 rounded-full text-white text-[10px] font-bold">
              PR: {userProfile?.totalScore || 77}%
            </div>
            <ProbabilityBadge probability={pathway.matchProbability} size="sm" />
          </div>
        </div>

        {/* Bottom - Content */}
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-3">
            <img
              src={airlineLogo}
              alt={pathway.airline}
              className="h-8 w-auto object-contain flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-bold ${textColor} truncate`}>{pathway.name}</h3>
              <p className={`${textColorLight} text-sm`}>{pathway.airline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`${textColor} text-sm font-medium`}>{formattedAircraftType}</span>
            <span className={`${textColorLight} text-sm font-medium`}>•</span>
            <DollarSign className={`w-3 h-3 ${textColorLight}`} />
            <span className={`${textColor} text-sm font-medium`}>{formattedSalary}</span>
          </div>

          {/* Requirements with alignment indicators */}
          <div className="flex flex-wrap gap-2">
            {requirementMatches.slice(0, 4).map((match, index) => {
              const getStatusStyles = () => {
                switch (match.status) {
                  case 'under-minimums':
                    return 'bg-red-500 text-white border-red-600';
                  case 'close':
                    return 'bg-amber-500 text-white border-amber-600';
                  case 'match':
                    return 'bg-emerald-500 text-white border-emerald-600';
                  default:
                    return 'bg-slate-200 text-slate-700 border-slate-300';
                }
              };

              return (
                <div
                  key={index}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()} cursor-help`}
                  title={match.suggestion || ''}
                >
                  {match.label}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiringBadge status={pathway.hiringStatus} positions={pathway.positions} />
              <div className={`flex items-center gap-1 ${textColorLight} text-sm`}>
                <MapPin className="w-3 h-3" />
                {formattedLocation}
              </div>
            </div>
            <motion.div
              className={`w-8 h-8 rounded-full ${expandButtonBg} backdrop-blur flex items-center justify-center cursor-pointer`}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronDown className={`w-4 h-4 ${expandButtonText}`} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} space-y-6`}>
              {/* Description */}
              <p className={`${textColor} leading-relaxed`}>{pathway.description}</p>

              {/* Requirements */}
              <div>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                  <GraduationCap className="w-4 h-4" />
                  Requirements
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`flex items-center gap-2 text-sm ${textColor}`}>
                    <Clock className="w-4 h-4 text-blue-400" />
                    {pathway.requirements.totalHours.toLocaleString()} total hours
                  </div>
                  {pathway.requirements.multiEngineHours && (
                    <div className={`flex items-center gap-2 text-sm ${textColor}`}>
                      <Plane className="w-4 h-4 text-blue-400" />
                      {pathway.requirements.multiEngineHours} ME hours
                    </div>
                  )}
                  {pathway.requirements.turbineHours && (
                    <div className={`flex items-center gap-2 text-sm ${textColor}`}>
                      <Zap className="w-4 h-4 text-amber-400" />
                      {pathway.requirements.turbineHours} turbine hours
                    </div>
                  )}
                  {pathway.requirements.typeRatings.length > 0 && (
                    <div className={`flex items-center gap-2 text-sm ${textColor}`}>
                      <Award className="w-4 h-4 text-purple-400" />
                      {pathway.requirements.typeRatings.join(', ')} preferred
                    </div>
                  )}
                </div>
              </div>

              {/* Your Profile vs Job Requirements */}
              <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'} rounded-xl p-4`}>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                  <User className="w-4 h-4" />
                  Your Profile vs Job Requirements
                </h4>
                <div className="space-y-3">
                  {requirementMatches.map((match, index) => {
                    const getStatusColor = () => {
                      switch (match.status) {
                        case 'under-minimums':
                          return 'bg-red-500';
                        case 'close':
                          return 'bg-amber-500';
                        case 'match':
                          return 'bg-emerald-500';
                        default:
                          return 'bg-slate-500';
                      }
                    };

                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
                          <span className={`text-sm ${textColor}`}>{match.label}</span>
                        </div>
                        {match.score !== undefined && (
                          <span className={`text-sm font-semibold ${match.status === 'match' ? 'text-emerald-400' : match.status === 'close' ? 'text-amber-400' : 'text-red-400'}`}>
                            {Math.round(match.score)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                  <p className={`text-xs ${textColorLight}`}>
                    Hover over requirement badges for improvement suggestions
                  </p>
                </div>
              </div>

              {/* 3D Aircraft View */}
              <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'} rounded-xl p-4 overflow-hidden`}>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                  <Plane className="w-4 h-4" />
                  3D Aircraft View
                </h4>
                {pathway.aircraftType === 'unavailable' ? (
                  <div className="h-48 w-full rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                      <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        3D model unavailable
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-600' : 'text-slate-500'} mt-1`}>
                        Aircraft not in model library
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 w-full rounded-lg relative">
                    <Aircraft3DCanvas 
                      aircraftType={pathway.aircraftType || 'default'} 
                      isDarkMode={isDarkMode} 
                    />
                  </div>
                )}
                <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-2 text-center`}>
                  {pathway.aircraftType === 'unavailable' ? 'Aircraft model not available' : `Interactive ${pathway.aircraftType || 'Aircraft'} model`}
                </p>
              </div>

              {/* Cockpit Interior 3D - Only for A320 Family, B737, and B747 */}
              {pathway.aircraftType !== 'unavailable' &&
                ((String(pathway.aircraftType || '').toUpperCase().includes('A318') ||
                String(pathway.aircraftType || '').toUpperCase().includes('A319') || String(pathway.aircraftType || '').toUpperCase().includes('A319NEO') ||
                String(pathway.aircraftType || '').toUpperCase().includes('A320') || String(pathway.aircraftType || '').toUpperCase().includes('A320NEO') ||
                String(pathway.aircraftType || '').toUpperCase().includes('A321') || String(pathway.aircraftType || '').toUpperCase().includes('A321NEO')) ||
                (String(pathway.aircraftType || '').toUpperCase().includes('B737') || String(pathway.aircraftType || '').toUpperCase().includes('737')) ||
                (String(pathway.aircraftType || '').toUpperCase().includes('B747') || String(pathway.aircraftType || '').toUpperCase().includes('747'))) && (
                <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'} rounded-xl p-4 overflow-hidden`}>
                  <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                    <LayoutGrid className="w-4 h-4" />
                    Cockpit Interior 3D
                  </h4>
                  <div className="h-48 w-full rounded-lg relative">
                    <Cockpit3DCanvas 
                      aircraftType={pathway.aircraftType || 'default'} 
                      isDarkMode={isDarkMode} 
                    />
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-2 text-center`}>
                    {(String(pathway.aircraftType || '').toUpperCase().includes('B747') || String(pathway.aircraftType || '').toUpperCase().includes('747'))
                      ? 'Boeing 747 Glass cockpit'
                      : (String(pathway.aircraftType || '').toUpperCase().includes('B737') || String(pathway.aircraftType || '').toUpperCase().includes('737'))
                        ? 'Boeing 737 Glass cockpit'
                        : 'A320 Glass cockpit layout'}
                  </p>
                </div>
              )}

              {/* Salary */}
              <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'} rounded-xl p-4`}>
                <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                  <DollarSign className="w-4 h-4" />
                  Compensation
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">{pathway.salary.firstYear}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Year 1</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{pathway.salary.fifthYear}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Year 5</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-amber-400">{pathway.salary.bonuses}</div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Additional</div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-2">
                {pathway.benefits.map((benefit, i) => (
                  <span 
                    key={i}
                    className={`px-3 py-1.5 rounded-full text-sm border ${isDarkMode ? 'bg-slate-700/50 text-slate-300 border-slate-600/50' : 'bg-slate-100/50 text-slate-700 border-slate-300/50'}`}
                  >
                    {benefit}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCalculateMatch}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  <Sparkles className="w-5 h-5" />
                  Calculate Match
                </button>
                <a
                  href={pathway.url || '#'}
                  target={pathway.url ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!pathway.url) {
                      e.preventDefault();
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-green-500/25"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Job
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

// Recognition Profile Summary - supports light/dark mode - toolbar style
const ProfileSummary: React.FC<{ profile: RecognitionProfile; isDarkMode?: boolean }> = ({ profile, isDarkMode = true }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const textColorLight = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'} shadow-lg`}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-xl font-bold text-white">{profile.totalScore}%</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={`text-base font-semibold ${textColor} flex items-center gap-2`}>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Your Recognition Profile
          </h2>
          <p className={`${textColorLight} text-xs mt-1`}>Based on WingMentor formula</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {Object.entries(profile.breakdown).map(([key, value]) => {
          const colors = {
            programs: 'from-blue-500 to-blue-600',
            experience: 'from-emerald-500 to-emerald-600',
            behavioral: 'from-purple-500 to-purple-600',
            language: 'from-amber-500 to-amber-600',
            skills: 'from-pink-500 to-pink-600',
          };
          const barColor = colors[key as keyof typeof colors] || 'from-slate-500 to-slate-600';
          return (
            <div key={key} className="flex items-center gap-3">
              <span className={`text-xs font-medium capitalize w-24 ${textColorLight}`}>{key}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <div className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
              </div>
              <span className={`text-xs font-bold ${textColor} w-8 text-right`}>{value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Gap Analysis Panel - supports light/dark mode - toolbar style
const GapAnalysisPanel: React.FC<{ analysis: GapAnalysis; isDarkMode?: boolean; isExpanded?: boolean; onToggle?: () => void }> = ({ analysis, isDarkMode = true, isExpanded = true, onToggle }) => {
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const textColorLight = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const readinessColor = analysis.gapPercentage < 30
    ? 'from-emerald-500 to-emerald-600'
    : analysis.gapPercentage < 50
      ? 'from-amber-500 to-amber-600'
      : 'from-red-500 to-red-600';
  const readinessBg = analysis.gapPercentage < 30
    ? 'bg-emerald-500/20 text-emerald-400'
    : analysis.gapPercentage < 50
      ? 'bg-amber-500/20 text-amber-400'
      : 'bg-red-500/20 text-red-400';

  return (
    <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'} shadow-lg`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-500/10 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className={`text-base font-semibold ${textColor}`}>Gap Analysis</h2>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${readinessBg}`}>
          {100 - analysis.gapPercentage}% Ready
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-3">
          <div className="h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
            <div className={`h-full bg-gradient-to-r ${readinessColor} rounded-full transition-all duration-500`} style={{ width: `${100 - analysis.gapPercentage}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'}`}>
              <div className={`text-xs ${textColorLight} mb-1`}>Estimated Cost</div>
              <div className={`text-lg font-bold ${textColor}`}>${analysis.estimatedCost.toLocaleString()}</div>
            </div>
            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'}`}>
              <div className={`text-xs ${textColorLight} mb-1`}>Time Required</div>
              <div className={`text-lg font-bold ${textColor}`}>{analysis.estimatedTime.months}mo</div>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'}`}>
            <div className="flex items-start gap-2">
              <AlertCircle className={`w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0`} />
              <div className={`text-sm ${textColorLight}`}>{analysis.recommendations[0]}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Search Bar - supports light/dark mode
const SearchBar: React.FC<{ onSearch: (query: string) => void; isDarkMode?: boolean }> = ({ onSearch, isDarkMode = true }) => (
  <div className="relative w-[600px]">
    <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
    <input
      type="text"
      placeholder="Search pathways, airlines, or locations..."
      className={`w-full pl-4 pr-12 py-4 backdrop-blur border rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all ${
        isDarkMode
          ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400'
          : 'bg-white/70 border-slate-300/50 text-slate-900 placeholder-slate-500'
      }`}
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);

// Category Filter - supports light/dark mode
const CategoryFilter: React.FC<{ 
  active: string; 
  onChange: (cat: string) => void;
  isDarkMode?: boolean;
  categoryLabels: Record<string, string>;
}> = ({ active, onChange, isDarkMode = true, categoryLabels }) => {
  // Always show all categories, maintaining order
  const orderedCategories = ['all', 'recommended', 'airline-pathways', 'cadet-programme', 'private', 'privateSector', 'cargo', 'type-rating', 'airtaxi-drones'];
  
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {orderedCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            active === cat
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
              : isDarkMode 
                ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                : 'bg-slate-200/50 text-slate-600 hover:bg-slate-300/50 hover:text-slate-800'
          }`}
        >
          {categoryLabels[cat] || String(cat).charAt(0).toUpperCase() + String(cat).slice(1)}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// X-PLANE STYLE 3D AIRCRAFT MODELS
// ============================================================================

// Sketchfab embed URLs for specific aircraft models
const SKETCHFAB_MODELS: Record<string, string> = {
  // Airbus A220 by BlueMesh
  'A220': 'https://sketchfab.com/models/ce4fbb839e6b4bb989422426bfc8fd1c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A220-100': 'https://sketchfab.com/models/ce4fbb839e6b4bb989422426bfc8fd1c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A220-300': 'https://sketchfab.com/models/ce4fbb839e6b4bb989422426bfc8fd1c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // AirStudios Highly Detailed A320
  'A320': 'https://sketchfab.com/models/ae3d357729a44f278f9ef9326977504a/embed?autostart=1&preload=1&transparent=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A320neo': 'https://sketchfab.com/models/ae3d357729a44f278f9ef9326977504a/embed?autostart=1&preload=1&transparent=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Airbus A318 by OUTPISTON
  'A318': 'https://sketchfab.com/models/43cd2ce76c214dd6b465117426554dd6/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Airbus A319 by OUTPISTON
  'A319': 'https://sketchfab.com/models/536400f2043a4809a0b6913cd4df2617/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A319neo': 'https://sketchfab.com/models/536400f2043a4809a0b6913cd4df2617/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Airbus A321 by OUTPISTON
  'A321': 'https://sketchfab.com/models/561c4002ed6c44b697195cdffb60e25c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A321neo': 'https://sketchfab.com/models/561c4002ed6c44b697195cdffb60e25c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Airbus A310 by OUTPISTON
  'A310': 'https://sketchfab.com/models/93b8d5bf59f74071a65ede1ef2e29aae/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A310-300': 'https://sketchfab.com/models/93b8d5bf59f74071a65ede1ef2e29aae/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Airbus A330-300 by SQUIR3D
  'A330': 'https://sketchfab.com/models/745c36e5187d4352bbe7e5e94f8e5105/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A330-300': 'https://sketchfab.com/models/745c36e5187d4352bbe7e5e94f8e5105/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A330-200': 'https://sketchfab.com/models/745c36e5187d4352bbe7e5e94f8e5105/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Airbus A340 by Dave Love SketchFab
  'A340': 'https://sketchfab.com/models/499ae6227c734f59a54c101a537ca6c7/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A340-600': 'https://sketchfab.com/models/499ae6227c734f59a54c101a537ca6c7/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A340-300': 'https://sketchfab.com/models/499ae6227c734f59a54c101a537ca6c7/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Airbus A350 by N.S STUDIOS
  'A350': 'https://sketchfab.com/models/b36bae5dcdd9465e8789df568a9620e2/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A350-1000': 'https://sketchfab.com/models/b36bae5dcdd9465e8789df568a9620e2/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A350-900': 'https://sketchfab.com/models/b36bae5dcdd9465e8789df568a9620e2/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Airbus A380 by davidmarton1987
  'A380': 'https://sketchfab.com/models/49687e726121405d96c7d5be03b5673a/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A380-800': 'https://sketchfab.com/models/49687e726121405d96c7d5be03b5673a/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Boeing 777 by Kanedog
  'B777': 'https://sketchfab.com/models/f9e03987eaa84127ab999f48a32be641/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'B777-300': 'https://sketchfab.com/models/f9e03987eaa84127ab999f48a32be641/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'B777-200': 'https://sketchfab.com/models/f9e03987eaa84127ab999f48a32be641/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  '777': 'https://sketchfab.com/models/f9e03987eaa84127ab999f48a32be641/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Boeing 737-800 by OUTPISTON
  'B737': 'https://sketchfab.com/models/fa2d273dba0e45348284a6d6cd711218/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  '737': 'https://sketchfab.com/models/fa2d273dba0e45348284a6d6cd711218/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  '737-800': 'https://sketchfab.com/models/fa2d273dba0e45348284a6d6cd711218/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Cessna Citation Latitude by artformat
  'CESSNA': 'https://sketchfab.com/models/c5ad92e005e84f229de080f5b7279957/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'CITATION': 'https://sketchfab.com/models/c5ad92e005e84f229de080f5b7279957/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'LATITUDE': 'https://sketchfab.com/models/c5ad92e005e84f229de080f5b7279957/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Cessna Citation M2 by Exhibition 3.0
  'CITATIONI': 'https://sketchfab.com/models/36e78f157d2643849bb89a46d5bc03ab/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'CITATION-M2': 'https://sketchfab.com/models/36e78f157d2643849bb89a46d5bc03ab/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'M2': 'https://sketchfab.com/models/36e78f157d2643849bb89a46d5bc03ab/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Cessna Citation Longitude by HQ3DMOD (for Sovereign)
  'SOVEREIGN': 'https://sketchfab.com/models/01c140ac470a491e847c43970bfce632/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'LONGITUDE': 'https://sketchfab.com/models/01c140ac470a491e847c43970bfce632/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Gulfstream G650 by John Doe
  'GULFSTREAM': 'https://sketchfab.com/models/67451e56d38746de86667347d7a56587/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'G650': 'https://sketchfab.com/models/67451e56d38746de86667347d7a56587/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Gulfstream G500 by bdorit20
  'G500': 'https://sketchfab.com/models/cd0f33947f47478990505d2d34034fd6/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Bombardier Learjet 60 by OUTPISTON
  'LEARJET': 'https://sketchfab.com/models/7573f836dd3a46bdbce8b90b5a40f104/embed?autospin=1&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'LR-45': 'https://sketchfab.com/models/7573f836dd3a46bdbce8b90b5a40f104/embed?autospin=1&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Learjet 60 by paperscan (for LR-60)
  'LR-60': 'https://sketchfab.com/models/8e0627d4130242aaa681b39934be9e1d/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'LR60': 'https://sketchfab.com/models/8e0627d4130242aaa681b39934be9e1d/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Embraer ERJ Family by OUTPISTON
  'ERJ': 'https://sketchfab.com/models/25fdc7d3befd41f193a0d5293e644cf6/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'EMB-135': 'https://sketchfab.com/models/25fdc7d3befd41f193a0d5293e644cf6/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'EMB-145': 'https://sketchfab.com/models/25fdc7d3befd41f193a0d5293e644cf6/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // Bombardier CRJ Series by CityJet Training
  'CRJ': 'https://sketchfab.com/models/02c4fa44604243c2bb48db64506a39af/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'CRJ-700': 'https://sketchfab.com/models/02c4fa44604243c2bb48db64506a39af/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'CRJ-900': 'https://sketchfab.com/models/02c4fa44604243c2bb48db64506a39af/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // King Air 360 by Exhibition 3.0
  'KINGAIR': 'https://sketchfab.com/models/666b59bb1b874d4ba4c90386c32e8e85/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'KING-AIR': 'https://sketchfab.com/models/666b59bb1b874d4ba4c90386c32e8e85/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'B200': 'https://sketchfab.com/models/666b59bb1b874d4ba4c90386c32e8e85/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'B350': 'https://sketchfab.com/models/666b59bb1b874d4ba4c90386c32e8e85/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
};

// Sketchfab cockpit URLs
const SKETCHFAB_COCKPITS: Record<string, string> = {
  // A320 Cockpit by AirStudios (A318/A319/A321 share same cockpit)
  'A320': 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A320neo': 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A318': 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A319': 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A319neo': 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A321': 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  'A321neo': 'https://sketchfab.com/models/feaa475ce5824121be0380a42987007f/embed?camera=0&preload=1&ui_theme=dark&autostart=1&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // B737 Cockpit by AirStudios
  'B737': 'https://sketchfab.com/models/41a1ae9e252d41bda7c63cfe9fab5a02/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  '737': 'https://sketchfab.com/models/41a1ae9e252d41bda7c63cfe9fab5a02/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  // B747 Cockpit by AirStudios
  'B747': 'https://sketchfab.com/models/9e7bfa1049ec44a2a8d8d0bdaf51533c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  '747': 'https://sketchfab.com/models/9e7bfa1049ec44a2a8d8d0bdaf51533c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
  '747-400': 'https://sketchfab.com/models/9e7bfa1049ec44a2a8d8d0bdaf51533c/embed?autospin=1&camera=0&preload=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_inspector=0&ui_ar=0&ui_help=0&settings=0',
};

// 3D Canvas Wrapper for Aircraft Models
const Aircraft3DCanvas: React.FC<{ aircraftType: string; isDarkMode?: boolean }> = ({ aircraftType, isDarkMode = true }) => {
  const typeKey = String(aircraftType || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const sketchfabUrl = SKETCHFAB_MODELS[typeKey] || SKETCHFAB_MODELS[aircraftType] || SKETCHFAB_MODELS['A320'];

  // Simplified: if we have a Sketchfab URL, use it
  if (sketchfabUrl) {
    return (
      <div className="w-full h-full absolute inset-0 overflow-hidden rounded-lg flex items-center justify-center">
        <iframe
          title={`${aircraftType} 3D Model`}
          src={sketchfabUrl}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
        />
      </div>
    );
  }
  
  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isDarkMode ? 0.6 : 0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          <Aircraft3D aircraftType={aircraftType} isDarkMode={isDarkMode} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};


// 3D Cockpit Canvas Wrapper - A320 Family, B737, and B747 ONLY
const Cockpit3DCanvas: React.FC<{ aircraftType: string; isDarkMode?: boolean }> = ({ aircraftType, isDarkMode = true }) => {
  const typeKey = String(aircraftType || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const cockpitUrl = SKETCHFAB_COCKPITS[typeKey] || SKETCHFAB_COCKPITS[aircraftType] || SKETCHFAB_COCKPITS['A320'];
  
  // Show cockpit for A320 Family (A318, A319, A320, A321), B737, and B747 only
  const isA320 = typeKey.includes('A318') || typeKey.includes('A319') || typeKey.includes('A319NEO') || typeKey.includes('A320') || typeKey.includes('A320NEO') || typeKey.includes('A321') || typeKey.includes('A321NEO');
  const isB737 = typeKey.includes('B737') || typeKey.includes('737');
  const isB747 = typeKey.includes('B747') || typeKey.includes('747');
  
  if (isA320 || isB737 || isB747) {
    return (
      <div className="w-full h-full absolute inset-0 overflow-hidden rounded-lg">
        <iframe
          title={`${aircraftType} Cockpit 3D`}
          src={cockpitUrl}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
        />
      </div>
    );
  }
  
  // Return empty for non-supported aircraft (no cockpit interior)
  return null;
};

// Simplified X-Plane Style 3D Aircraft Component
const Aircraft3D: React.FC<{ aircraftType: string; isDarkMode?: boolean }> = ({ aircraftType, isDarkMode = true }) => {
  const meshRef = React.useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  // Determine aircraft category based on type
  const typeLower = (aircraftType || '').toLowerCase();
  let category = 'airliner';
  if (typeLower.includes('citation') || typeLower.includes('challenger') || typeLower.includes('gulfstream') || typeLower.includes('learjet') || typeLower.includes('falcon') || typeLower.includes('global')) {
    category = 'business';
  } else if (typeLower.includes('caravan') || typeLower.includes('king air') || typeLower.includes('navajo')) {
    category = 'turboprop';
  } else if (typeLower.includes('evtol') || typeLower.includes('joby') || typeLower.includes('air taxi')) {
    category = 'evtol';
  } else if (typeLower.includes('crj') || typeLower.includes('erj') || typeLower.includes('e-jet')) {
    category = 'regional';
  }

  // Colors based on theme
  const fuselageColor = isDarkMode ? '#e2e8f0' : '#1e293b';
  const wingColor = isDarkMode ? '#94a3b8' : '#475569';
  const accentColor = isDarkMode ? '#60a5fa' : '#3b82f6';

  return (
    <group ref={meshRef} scale={0.6}>
      {/* Main Fuselage */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 1.5, 4, 8]} />
        <meshStandardMaterial color={fuselageColor} metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Cockpit Window */}
      <mesh position={[0, 0.15, 0.6]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={isDarkMode ? '#0f172a' : '#1e293b'} metalness={0.8} roughness={0.1} />
      </mesh>
      
      {/* Main Wings */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[2.5, 0.08, 0.4]} />
        <meshStandardMaterial color={wingColor} metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* Vertical Stabilizer (Tail) */}
      <mesh position={[0, 0.4, -0.7]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.08, 0.6, 0.35]} />
        <meshStandardMaterial color={accentColor} metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Horizontal Stabilizers */}
      <mesh position={[0, 0, -0.7]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.8, 0.06, 0.25]} />
        <meshStandardMaterial color={wingColor} metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* Engines - Business Jets (rear mounted) */}
      {(category === 'business' || category === 'regional') && (
        <>
          <mesh position={[0.5, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.4, 12]} />
            <meshStandardMaterial color={wingColor} metalness={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[-0.5, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.4, 12]} />
            <meshStandardMaterial color={wingColor} metalness={0.7} roughness={0.2} />
          </mesh>
        </>
      )}
      
      {/* Engines - Airliners (wing mounted) */}
      {category === 'airliner' && (
        <>
          <mesh position={[1.1, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.15, 0.5, 12]} />
            <meshStandardMaterial color={wingColor} metalness={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[-1.1, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.15, 0.5, 12]} />
            <meshStandardMaterial color={wingColor} metalness={0.7} roughness={0.2} />
          </mesh>
        </>
      )}
      
      {/* Propellers - Turboprops */}
      {category === 'turboprop' && (
        <>
          <mesh position={[1.1, -0.05, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[-1.1, -0.05, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Propeller Blades */}
          <mesh position={[1.1, -0.05, 0.35]}>
            <boxGeometry args={[0.6, 0.02, 0.02]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[-1.1, -0.05, 0.35]}>
            <boxGeometry args={[0.6, 0.02, 0.02]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </>
      )}
      
      {/* eVTOL Rotors */}
      {category === 'evtol' && (
        <>
          {[0.4, -0.4].map((x, i) => (
            <group key={i} position={[x, 0.3, 0]}>
              <mesh>
                <cylinderGeometry args={[0.25, 0.25, 0.05, 8]} />
                <meshStandardMaterial color="#64748b" transparent opacity={0.7} />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[0.5, 0.02, 0.02]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
            </group>
          ))}
        </>
      )}
      
      {/* Landing Gear - Simplified */}
      <mesh position={[0, -0.25, 0.3]}>
        <cylinderGeometry args={[0.06, 0.04, 0.15, 6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.3, -0.2, -0.4]}>
        <cylinderGeometry args={[0.04, 0.03, 0.12, 6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[-0.3, -0.2, -0.4]}>
        <cylinderGeometry args={[0.04, 0.03, 0.12, 6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export interface PathwaysPageModernProps {
  isDarkMode?: boolean;
  initialCategory?: string;
  selectedPathwayId?: string;
  onNavigate?: (page: string) => void;
  mode?: 'pathways' | 'jobs';
}

export const PathwaysPageModern: React.FC<PathwaysPageModernProps> = ({ 
  isDarkMode = true,
  initialCategory = 'all',
  selectedPathwayId,
  onNavigate,
  mode = 'pathways'
}) => {
  const [expandedPathway, setExpandedPathway] = useState<string | null>(selectedPathwayId || null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(1000); // Show all jobs and discovery pathways
  const [matchFilter, setMatchFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [viewFilter, setViewFilter] = useState<'all' | 'jobs' | 'pathways'>('all');
  const [positionFilter, setPositionFilter] = useState<'all' | 'Captain' | 'Fighter Pilot' | 'First Officer' | 'Flight Instructor' | 'Pilot Cadet'>('all');
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [expandedGapAnalysis, setExpandedGapAnalysis] = useState(true);
  const [expandedQuickActions, setExpandedQuickActions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedPathwayForMatch, setSelectedPathwayForMatch] = useState<PathwayData | null>(null);
  const [selectedCarouselPathway, setSelectedCarouselPathway] = useState<PathwayData | null>(null);
  const [cockpitActivated, setCockpitActivated] = useState(false);
  const [sidePanelExpanded, setSidePanelExpanded] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [isCarouselAutoScrolling, setIsCarouselAutoScrolling] = useState(false);
  const [popoverJobId, setPopoverJobId] = useState<string | null>(null);
  const carouselAutoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  const { userProfile, currentUser } = useAuth();

  // Pathways Intelligence — Firebase R-formula powered data
  const intelligence = usePathwaysIntelligence(
    currentUser?.id || undefined,
    mode === 'jobs' ? jobApplicationListings : []
  );

  // Category display labels - defined at component level for reuse
  const categoryLabels: Record<string, string> = {
    'all': 'All',
    'recommended': 'Recommended',
    'airline-pathways': 'Airline Careers',
    'cadet-programme': 'Cadet Programs',
    'private': 'Type Rating',
    'privateSector': 'Private Sector',
    'cargo': 'Cargo',
    'type-rating': 'Type Rating Pathways',
    'airtaxi-drones': 'AirTaxi & Drones'
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileDropdownOpen]);
  
  // Convert user profile to RecognitionProfile format
  const recognitionProfile = userProfile ? convertToRecognitionProfile(userProfile) : MOCK_USER_PROFILE;
  
  // Auto-expand selected pathway and scroll to it
  useEffect(() => {
    if (selectedPathwayId) {
      setExpandedPathway(selectedPathwayId);
      // Scroll to the selected pathway after render
      setTimeout(() => {
        const element = document.getElementById(`pathway-${selectedPathwayId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [selectedPathwayId]);

  // Fetch roadmap when carousel pathway changes
  useEffect(() => {
    if (selectedCarouselPathway && currentUser?.id) {
      intelligence.fetchRoadmap(currentUser.id, selectedCarouselPathway);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCarouselPathway?.id, currentUser?.id]);

  // Get dynamic pathways — use Firebase match scores when available, fall back to client-side R-formula
  const firebaseJobScoreMap = useMemo(() => {
    if (!intelligence.jobMatches?.scoredJobs) return null;
    const map: Record<string, number> = {};
    intelligence.jobMatches.scoredJobs.forEach(j => { map[j.jobId] = j.matchPct; });
    return map;
  }, [intelligence.jobMatches]);

  const dynamicPathways = useMemo(() => {
    return jobApplicationListings.map((job, index) => {
      const base = transformJobToPathway(job, index);
      const jobId = `job-${index}`;
      const fbPct = firebaseJobScoreMap?.[jobId] ?? firebaseJobScoreMap?.[`${job.company || ''}-${job.title || ''}`.replace(/\s+/g, '-').toLowerCase()];
      const matchProbability = fbPct ?? calcMatchProbability(job, recognitionProfile);
      return { ...base, matchProbability };
    });
  }, [recognitionProfile.totalScore, recognitionProfile.pilotData?.totalHours, recognitionProfile.pilotData?.typeRatings?.length, firebaseJobScoreMap]);

  // Transform DISCOVERY_PATHWAYS into PathwayData format for static pathway cards
  const discoveryPathways: PathwayData[] = Object.entries(DISCOVERY_PATHWAYS).flatMap(([catKey, items]) =>
    items.map((item: any) => ({
      id: item.id,
      name: item.title,
      category: catKey as PathwayData['category'],
      airline: item.company,
      description: item.salary || '',
      // Use image directly as aircraftType so the card renderer picks it up
      image: item.image === 'wingmentor-white' ? '/logo.png' : (item.image || ''),
      matchProbability: item.matchPercentage,
      aircraftType: item.image === 'wingmentor-white' ? '__wingmentor__' : (item.image || ''),
      requirements: { totalHours: 0, typeRatings: item.requirements || [] },
      salary: { firstYear: item.salary || '', fifthYear: '', bonuses: '' },
      benefits: item.tags || [],
      locations: [item.location || 'Global'],
      hiringStatus: item.postedAt === 'Hiring Now' ? 'actively_hiring' : 'moderate' as const,
      positions: 1,
      url: undefined,
    }))
  );

  // Include pathways or jobs based on mode
  // For 'all' category, always use discoveryPathways (curated pathway cards) regardless of mode
  const allPathways = activeCategory === 'all'
    ? discoveryPathways
    : (mode === 'jobs' ? dynamicPathways : discoveryPathways);

  // Always show all portal categories regardless of data
  const categories = ['all', 'recommended', 'airline-pathways', 'cadet-programme', 'private', 'privateSector', 'cargo', 'type-rating', 'airtaxi-drones'];

  const filteredPathways = allPathways.filter(pathway => {
    let matchesCategory = activeCategory === 'all' || pathway.category === activeCategory;
    // For 'recommended' category, show pathways with high match probability (85%+)
    if (activeCategory === 'recommended') {
      matchesCategory = pathway.matchProbability >= 85;
    }
    const matchesSearch =
      (pathway.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pathway.airline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      pathway.locations.some(l => (l || '').toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Match probability filtering
    let matchesMatchFilter = true;
    if (matchFilter !== 'all') {
      const probability = pathway.matchProbability;
      switch (matchFilter) {
        case 'low':
          matchesMatchFilter = probability >= 60 && probability < 75;
          break;
        case 'mid':
          matchesMatchFilter = probability >= 75 && probability < 90;
          break;
        case 'high':
          matchesMatchFilter = probability >= 90;
          break;
      }
    }

    // View filter - Jobs vs Pathways
    let matchesViewFilter = true;
    if (viewFilter !== 'all') {
      // Jobs are from jobApplicationListings (have url), Pathways are from static data (no url)
      const isJob = !!pathway.url;
      if (viewFilter === 'jobs') {
        matchesViewFilter = isJob;
      } else if (viewFilter === 'pathways') {
        matchesViewFilter = !isJob;
      }
    }

    // Job position filtering
    let matchesPositionFilter = true;
    if (positionFilter !== 'all') {
      const name = (pathway.name || '').toLowerCase();
      switch (positionFilter) {
        case 'Captain':
          matchesPositionFilter = name.includes('captain');
          break;
        case 'Fighter Pilot':
          matchesPositionFilter = name.includes('fighter') || name.includes('military');
          break;
        case 'First Officer':
          matchesPositionFilter = name.includes('first officer') || name.includes('first officer') || name.includes('fo');
          break;
        case 'Flight Instructor':
          matchesPositionFilter = name.includes('instructor') || name.includes('flight instructor');
          break;
        case 'Pilot Cadet':
          matchesPositionFilter = name.includes('cadet') || name.includes('cadet programme') || name.includes('cadet program');
          break;
      }
    }
    
    return matchesCategory && matchesSearch && matchesMatchFilter && matchesPositionFilter && matchesViewFilter;
  });

  const loopedPathways = filteredPathways; // no longer looped — use direct index

  // Sync selectedCarouselPathway with carouselIndex
  useEffect(() => {
    if (filteredPathways.length === 0) { setSelectedCarouselPathway(null); return; }
    const clampedIndex = Math.min(carouselIndex, filteredPathways.length - 1);
    setCarouselIndex(clampedIndex);
    setSelectedCarouselPathway(filteredPathways[clampedIndex]);
  }, [filteredPathways]);

  // Scroll to card by index
  const scrollToCarouselIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.querySelector(`[data-pathway-index="${index}"]`) as HTMLElement | null;
    if (!card) return;
    // Calculate scroll position to center the card under SELECTED PATHWAY text
    // The carousel has padding: calc(50vw - 300px) to center content
    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
    const scrollPos = cardCenter - (window.innerWidth / 2) + 180; // Center card perfectly above SELECTED PATHWAY
    container.scrollTo({ left: scrollPos, behavior });
  }, []);

  // On mount / filter change scroll to index 0
  useEffect(() => {
    if (filteredPathways.length === 0) return;
    // Scroll to index 1 to skip intro card
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToCarouselIndex(1, 'auto')));
  }, [filteredPathways.length]);

  // Sync carouselIndex from scroll position (handles touch/mouse swipe)
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    let tid: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      // Skip if this is a programmatic scroll from arrow buttons
      if (isProgrammaticScrollRef.current) return;
      clearTimeout(tid);
      tid = setTimeout(() => {
        const center = container.scrollLeft + container.clientWidth / 2;
        const cards = container.querySelectorAll('[data-pathway-index]');
        let closest = 1; // Default to index 1 to skip intro card
        let minDist = Infinity;
        cards.forEach((card) => {
          const el = card as HTMLElement;
          const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
          if (dist < minDist) { minDist = dist; closest = Number(el.dataset.pathwayIndex); }
        });
        // Ensure we never select index 0 (intro card)
        if (closest === 0 && cards.length > 1) closest = 1;
        setCarouselIndex(closest);
        setSelectedCarouselPathway(fp => {
          const cur = filteredPathways[closest];
          return cur || fp;
        });
        // Snap to center the closest card
        scrollToCarouselIndex(closest, 'smooth');
      }, 150); // Increased delay for smoother snap
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => { container.removeEventListener('scroll', onScroll); clearTimeout(tid); };
  }, [filteredPathways.length, scrollToCarouselIndex]);

  // Reset cockpit activation when pathway changes
  useEffect(() => {
    setCockpitActivated(false);
  }, [selectedCarouselPathway?.id]);

  // Arrow navigation
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (filteredPathways.length === 0) return;
    setIsCarouselAutoScrolling(false);
    let newIndex = direction === 'left'
      ? carouselIndex - 1
      : carouselIndex + 1;
    // Skip intro card (index 0), wrap around between pathway cards (index 1 to end)
    if (newIndex < 1) newIndex = filteredPathways.length - 1; // Wrap to last card
    if (newIndex >= filteredPathways.length) newIndex = 1; // Wrap to first pathway card
    setCarouselIndex(newIndex);
    setSelectedCarouselPathway(filteredPathways[newIndex]);
    isProgrammaticScrollRef.current = true;
    scrollToCarouselIndex(newIndex);
    // Reset flag after scroll animation completes (smooth scroll takes ~600-800ms)
    setTimeout(() => { isProgrammaticScrollRef.current = false; }, 800);
  };

  // Auto-scroll disabled - manual control only

  const handleCalculateMatch = (pathwayId: string) => {
    const pathway = allPathways.find(p => p.id === pathwayId);
    if (pathway) {
      setSelectedPathwayForMatch(pathway);
    }
  };

  // Theme colors
  const bgGradient = isDarkMode 
    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    : 'bg-gradient-to-br from-slate-100 via-white to-slate-200';
  const headerBg = isDarkMode ? 'bg-slate-950/80' : 'bg-white/80';
  const borderColor = isDarkMode ? 'border-slate-800/50' : 'border-slate-200/50';
  const headerText = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const buttonBg = isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-200/50 hover:bg-slate-300/50';
  const buttonText = isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900';

  return (
    <div className={`min-h-screen ${bgGradient}`}>
      {/* Header with Search Bar */}
      <header className={`${headerBg} border-b ${borderColor} backdrop-blur-sm sticky top-0 z-30`}>
        <div className="container mx-auto pl-2 pr-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Back Button */}
                <button
                  onClick={() => window.location.href = '/portal'}
                  className={`p-2 rounded-lg ${buttonBg} ${buttonText} hover:scale-105 transition-transform`}
                  title="Back to Home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {/* WingMentor Logo */}
                <img 
                  src="/logo.png" 
                  alt="WingMentor Logo" 
                  className="h-14 w-auto object-contain"
                />
                <div>
                  <h1 className={`text-2xl font-bold ${headerText}`}>
                    pilotrecognition.com
                  </h1>
                  <p className={`${subText} text-sm`}>powered by Wingmentor</p>
                </div>
              </div>
            </div>

            {/* Search Bar - appears when scrolled */}
            <AnimatePresence>
              {isScrolled && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 max-w-2xl"
                >
                  <SearchBar onSearch={setSearchQuery} isDarkMode={isDarkMode} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right side items */}
            <div className="flex items-center gap-3">
              {/* Live Score Widget */}
              <div className="flex items-center gap-2">
                <ScoreLiveWidget
                  fullScore={intelligence.fullScore}
                  loading={intelligence.loadingScore}
                  isDarkMode={isDarkMode}
                />
                {intelligence.fullScore?.velocityLabel && (
                  <ScoreVelocityBadge
                    velocity={intelligence.fullScore.scoreVelocity}
                    label={intelligence.fullScore.velocityLabel}
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
              <button className={`p-2 rounded-lg ${buttonBg} ${buttonText}`}>
                <Bell className="w-5 h-5" />
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
                >
                  {userProfile?.profile_image_url ? (
                    <img 
                      src={userProfile.profile_image_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {currentUser?.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                    {/* Profile Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
                          {userProfile?.profile_image_url ? (
                            <img 
                              src={userProfile.profile_image_url} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <User className="w-6 h-6 text-white/80" />
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold text-lg">
                            {userProfile?.pilot_id || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot'}
                          </h3>
                          <p className="text-sm text-white/80">{currentUser?.email}</p>
                          <div className="mt-2 flex flex-col items-center gap-1">
                            <span className="text-sm font-bold text-white">
                              Recognition Score: {intelligence.fullScore?.totalScore || recognitionProfile?.totalScore || 0}/100
                            </span>
                            {intelligence.fullScore && (
                              <span className="text-xs text-white/70">{intelligence.fullScore.rankLabel} · {intelligence.fullScore.profileCompleteness}% complete</span>
                            )}
                            {intelligence.fullScore?.velocityLabel ? (
                              <span className="text-xs text-emerald-300">{intelligence.fullScore.velocityLabel}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="p-4 border-b border-slate-200">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-slate-900">
                            {userProfile?.total_flight_hours || 0}
                          </div>
                          <div className="text-xs text-slate-500">Flight Hours</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-900">
                            {userProfile?.mentorship_hours || 0}
                          </div>
                          <div className="text-xs text-slate-500">Mentorship</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-slate-900">
                            {userProfile?.foundation_progress || 0}%
                          </div>
                          <div className="text-xs text-slate-500">Foundation</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 border-b border-slate-100">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-left">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">View Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-left">
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Settings</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-left">
                        <LogOut className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Logout</span>
                      </button>
                    </div>

                    {/* Recognition Profile — Live R-Formula */}
                    <div className="p-3 border-b border-slate-100">
                      {intelligence.fullScore ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">R-Formula Breakdown</span>
                            <span className="text-xs text-slate-400">WingMentor Formula</span>
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <RadarChart scores={intelligence.fullScore.breakdown} size={100} isDarkMode={false} animate={false} />
                            <div className="flex-1 space-y-1.5">
                              {([
                                { key: 'P', label: 'Programs', val: intelligence.fullScore.breakdown.P },
                                { key: 'ET', label: 'Experience', val: intelligence.fullScore.breakdown.ET },
                                { key: 'B', label: 'Behavioral', val: intelligence.fullScore.breakdown.B },
                                { key: 'L', label: 'Language', val: intelligence.fullScore.breakdown.L },
                                { key: 'S', label: 'Skills', val: intelligence.fullScore.breakdown.S },
                              ] as const).map(f => (
                                <div key={f.key}>
                                  <div className="flex justify-between text-[10px] mb-0.5">
                                    <span className="text-slate-600">{f.label}</span>
                                    <span className="text-slate-500">{f.val}%</span>
                                  </div>
                                  <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                                    <div className={`h-full rounded-full ${f.val >= 70 ? 'bg-emerald-500' : f.val >= 45 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${f.val}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {intelligence.fullScore.insights.slice(0, 2).map((ins, i) => (
                            <div key={i} className={`flex items-start gap-2 p-2 rounded-lg text-xs mb-1 ${ins.impact === 'high' ? 'bg-amber-50' : 'bg-sky-50'}`}>
                              <span className="text-amber-500 mt-0.5">●</span>
                              <span className="text-slate-600">{ins.message}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ProfileSummary
                          profile={recognitionProfile || { totalScore: 77, breakdown: { programs: 82, experience: 75, behavioral: 80, language: 70, skills: 78 } }}
                          isDarkMode={false}
                        />
                      )}
                    </div>

                    {/* Gap Analysis */}
                    <div className="p-3">
                      <GapAnalysisPanel
                        analysis={(() => {
                          // Calculate gap analysis from Firebase intelligence
                          const scoredJobs = intelligence.jobMatches?.scoredJobs || [];
                          const topJob = scoredJobs[0];
                          const userHours = recognitionProfile.pilotData?.totalHours || 0;
                          const userTRs = recognitionProfile.pilotData?.typeRatings || [];
                          const userScore = intelligence.fullScore?.totalScore || 0;

                          // Calculate average gap from top jobs
                          const avgHoursGap = scoredJobs.length > 0
                            ? Math.round(scoredJobs.reduce((sum: number, j: any) => sum + (j.hoursGap || 0), 0) / scoredJobs.length)
                            : 0;

                          // Count missing type ratings
                          const missingTRs = scoredJobs.filter((j: any) => j.missingRating).length;

                          // Calculate gap percentage based on match scores
                          const avgMatchPct = scoredJobs.length > 0
                            ? Math.round(scoredJobs.reduce((sum: number, j: any) => sum + (j.matchPct || 0), 0) / scoredJobs.length)
                            : 0;
                          const gapPercentage = 100 - avgMatchPct;

                          // Generate recommendations based on gaps
                          const recommendations: string[] = [];
                          if (avgHoursGap > 0) {
                            recommendations.push(`Need ${avgHoursGap} more flight hours`);
                          }
                          if (missingTRs > 0) {
                            recommendations.push(`Complete type rating program for ${missingTRs} aircraft types`);
                          }
                          if (recognitionProfile.breakdown?.experience && recognitionProfile.breakdown.experience < 70) {
                            recommendations.push('Improve experience score through additional flight hours');
                          }
                          if (recognitionProfile.breakdown?.behavioral && recognitionProfile.breakdown.behavioral < 75) {
                            recommendations.push('Enhance behavioral/CRM skills through training');
                          }
                          if (recommendations.length === 0) {
                            recommendations.push('Profile is well-aligned with pathway requirements');
                          }

                          // Estimate cost and time based on gaps
                          const estimatedCost = avgHoursGap * 50 + missingTRs * 15000;
                          const estimatedMonths = Math.max(1, Math.ceil(avgHoursGap / 100) + missingTRs * 3);

                          return {
                            gapPercentage,
                            totalGaps: (avgHoursGap > 0 ? 1 : 0) + (missingTRs > 0 ? 1 : 0),
                            highPriorityGaps: avgHoursGap > 500 ? 1 : 0,
                            estimatedCost,
                            estimatedTime: { days: estimatedMonths * 30, months: estimatedMonths },
                            recommendations
                          };
                        })()}
                        isDarkMode={false}
                        isExpanded={expandedGapAnalysis}
                        onToggle={() => setExpandedGapAnalysis(!expandedGapAnalysis)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Completion Progress Bar - Long Strip Below Header */}
      {intelligence.fullScore && intelligence.fullScore.profileCompleteness < 90 && (
        <div className={`w-full border-b ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
          <div className="container mx-auto px-4 py-2 flex items-center gap-4">
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'} whitespace-nowrap`}>
              Profile {intelligence.fullScore.profileCompleteness}% complete
            </span>
            <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
              <div 
                className="h-full rounded-full bg-amber-400 transition-all duration-1000"
                style={{ width: `${intelligence.fullScore.profileCompleteness}%` }}
              />
            </div>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} truncate`}>
              Enroll in a WingMentor program to boost your Programs score
            </span>
          </div>
        </div>
      )}

      {/* Floating Filter Buttons - appears when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-50 px-6 py-3"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(to bottom, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.7), transparent)'
                : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.7), transparent)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {/* Category Filters - Floating Components */}
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'cadet-programme', label: 'Cadet Programs' },
                  { key: 'private', label: 'Type Rating' },
                  { key: 'privateSector', label: 'Private Sector' },
                  { key: 'cargo', label: 'Cargo' },
                  { key: 'type-rating', label: 'Type Rating Pathways' },
                  { key: 'airtaxi-drones', label: 'AirTaxi & Drones' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-lg backdrop-blur ${
                      activeCategory === cat.key
                        ? 'bg-blue-500 text-white'
                        : isDarkMode 
                          ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80' 
                          : 'bg-white/80 text-slate-600 hover:bg-slate-100/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              
              {/* Match Filter - Floating Components */}
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Match:</span>
                <div className="flex gap-1">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'low', label: 'Low' },
                    { key: 'mid', label: 'Mid' },
                    { key: 'high', label: 'High' },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setMatchFilter(filter.key as typeof matchFilter)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-lg backdrop-blur ${
                        matchFilter === filter.key
                          ? 'bg-purple-500 text-white'
                          : isDarkMode 
                            ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80' 
                            : 'bg-white/80 text-slate-600 hover:bg-slate-100/80'
                    }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Filter - Jobs vs Pathways */}
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>View:</span>
                <div className="flex gap-1">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'jobs', label: 'Available Jobs' },
                    { key: 'pathways', label: 'Available Pathways' },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setViewFilter(filter.key as typeof viewFilter)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-lg backdrop-blur ${
                        viewFilter === filter.key
                          ? 'bg-green-500 text-white'
                          : isDarkMode
                            ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
                            : 'bg-white/80 text-slate-600 hover:bg-slate-100/80'
                    }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Position Filter - Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsPositionDropdownOpen(!isPositionDropdownOpen)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-lg backdrop-blur flex items-center gap-1 ${
                    positionFilter !== 'all'
                      ? 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80' 
                        : 'bg-white/80 text-slate-600 hover:bg-slate-100/80'
                  }`}
                >
                  <span>Position:</span>
                  <span>{positionFilter === 'all' ? 'All' : positionFilter}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isPositionDropdownOpen && (
                  <div className={`absolute top-full mt-1 right-0 w-40 rounded-lg shadow-xl z-50 overflow-hidden ${
                    isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                  }`}>
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'Captain', label: 'Captain' },
                      { key: 'Fighter Pilot', label: 'Fighter Pilot' },
                      { key: 'First Officer', label: 'First Officer' },
                      { key: 'Flight Instructor', label: 'Flight Instructor' },
                      { key: 'Pilot Cadet', label: 'Pilot Cadet' },
                    ].map((position) => (
                      <button
                        key={position.key}
                        onClick={() => {
                          setPositionFilter(position.key as typeof positionFilter);
                          setIsPositionDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${
                          positionFilter === position.key
                            ? 'bg-blue-500 text-white'
                            : isDarkMode 
                              ? 'text-slate-300 hover:bg-slate-700' 
                              : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {position.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className={`text-4xl md:text-5xl font-serif font-normal ${headerText} mb-2`}>
            {activeCategory === 'all'
              ? <>Pilot Recognition <span style={{ color: '#DAA520' }}>Pathways</span></>
              : <>{categoryLabels[activeCategory] || activeCategory} <span style={{ color: '#DAA520' }}>Pathways</span></>
            }
          </h1>
          <p className={`${subText} max-w-2xl mx-auto`}>
            Discover and track your journey to airline careers. Our Recognition Formula calculates your real probability of success.
          </p>
        </div>

        {/* Search & Filter */}
        <motion.div
          className="mb-8 space-y-4 text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: isScrolled ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: isScrolled ? 'none' : 'auto' }}
        >
          <div className="flex justify-center">
            <SearchBar onSearch={setSearchQuery} isDarkMode={isDarkMode} />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Airline Expectations', page: 'portal-airline-expectations' },
              { label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
              { label: 'Pilot Pathways', page: 'pathways-modern' },
              { label: 'Job Listings', page: 'job-listings' },
            ].map(({ label, page }) => {
              const isActive = (page === 'pathways-modern' && mode === 'pathways') || (page === 'job-listings' && mode === 'jobs');
              return (
              <button
                key={page}
                onClick={() => onNavigate && onNavigate(page)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-400 text-white'
                    : isDarkMode ? 'bg-sky-600 hover:bg-sky-500 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white'
                }`}
              >
                {label}
              </button>
              );
            })}
          </div>
          {mode === 'pathways' && (
            <div className="flex justify-center">
              <CategoryFilter
                active={activeCategory}
                onChange={setActiveCategory}
                isDarkMode={isDarkMode}
                categoryLabels={categoryLabels}
              />
            </div>
          )}

          {/* Match Probability Filter */}
          <div className="flex items-center gap-3 justify-center">
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Match Filter:</span>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All', color: 'blue' },
                { key: 'low', label: 'Low 60-75%', color: 'amber' },
                { key: 'mid', label: 'Mid 75-90%', color: 'emerald' },
                { key: 'high', label: 'High 90%+', color: 'purple' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setMatchFilter(filter.key as typeof matchFilter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    matchFilter === filter.key
                      ? filter.key === 'all' ? 'bg-blue-500 text-white' :
                        filter.key === 'low' ? 'bg-amber-500 text-white' :
                        filter.key === 'mid' ? 'bg-emerald-500 text-white' :
                        'bg-purple-500 text-white'
                      : isDarkMode 
                        ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50' 
                        : 'bg-slate-200/50 text-slate-600 hover:bg-slate-300/50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Position Filter */}
          <div className="flex items-center gap-3 justify-center">
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Position:</span>
            <div className="relative">
              <button
                onClick={() => setIsPositionDropdownOpen(!isPositionDropdownOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  positionFilter !== 'all'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode 
                      ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700' 
                      : 'bg-slate-200/50 text-slate-600 hover:bg-slate-300/50 border border-slate-300'
                }`}
              >
                <span>{positionFilter === 'all' ? 'All Positions' : positionFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isPositionDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-xl z-50 ${
                    isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                  }`}
                >
                  {[
                    { key: 'all', label: 'All Positions' },
                    { key: 'Captain', label: 'Captain' },
                    { key: 'Fighter Pilot', label: 'Fighter Pilot' },
                    { key: 'First Officer', label: 'First Officer' },
                    { key: 'Flight Instructor', label: 'Flight Instructor' },
                    { key: 'Pilot Cadet', label: 'Pilot Cadet' },
                  ].map((position) => (
                    <button
                      key={position.key}
                      onClick={() => {
                        setPositionFilter(position.key as typeof positionFilter);
                        setIsPositionDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                        positionFilter === position.key
                          ? 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'text-slate-300 hover:bg-slate-700' 
                            : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {position.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {mode === 'jobs' && (
          <JobIntelligenceBanner
            jobMatches={intelligence.jobMatches}
            loading={intelligence.loadingJobs}
            isDarkMode={isDarkMode}
          />
        )}

        {mode === 'jobs' && intelligence.jobMatches?.blindSpotPicks && (
          <BlindSpotPicksRow
            blindSpots={intelligence.jobMatches.blindSpotPicks}
            loading={intelligence.loadingJobs}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Edge-to-edge Carousel Section */}
        <div className="flex flex-col items-center">
          <div className="w-full text-center mb-3">
            <p className={`${subText} text-xs`}>
              {mode === 'jobs'
                ? <>{filteredPathways.length} of {jobApplicationListings.length}+ jobs <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">LIVE DATA</span></>
                : <>{filteredPathways.length} pathways available</>
              }
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative w-screen max-w-none left-1/2 -translate-x-1/2">
            <style>{`
              .pathways-carousel::-webkit-scrollbar { display: none; }
              .pathways-carousel { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div
              ref={carouselRef}
              className="pathways-carousel flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
              style={{
                WebkitOverflowScrolling: 'touch',
                paddingLeft: 'calc(50vw - 300px)',
                paddingRight: 'calc(50vw - 300px)',
                cursor: 'grab',
              }}
              onMouseDown={(e) => {
                const el = carouselRef.current;
                if (!el) return;
                el.style.cursor = 'grabbing';
                const startX = e.pageX - el.offsetLeft;
                const scrollLeft = el.scrollLeft;
                const onMove = (me: MouseEvent) => {
                  const x = me.pageX - el.offsetLeft;
                  el.scrollLeft = scrollLeft - (x - startX);
                };
                const onUp = () => {
                  el.style.cursor = 'grab';
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              {filteredPathways.length === 0 ? (
                <div className={`w-full py-16 text-center rounded-xl border-2 border-dashed ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                  <p className={`${subText} text-lg font-medium`}>No pathways match this filter</p>
                  <p className={`${subText} text-sm mt-1`}>Try a different filter or select "All"</p>
                </div>
              ) : (
                filteredPathways.map((pathway, idx) => {
                  const cardAirlineLogo = getAirlineLogo(pathway.airline);
                  const isWingMentorCard = pathway.aircraftType === '__wingmentor__';
                  const cardAircraftImage = isWingMentorCard
                    ? '/logo.png'
                    : (pathway.image && !pathway.image.startsWith('wingmentor') ? pathway.image : getAircraftImage(pathway.aircraftType));
                  const isSelected = carouselIndex === idx;
                  return (
                    <div
                      key={pathway.id}
                      data-pathway-index={idx}
                      className={`flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 p-[3px] ${isSelected ? 'ring-2 ring-sky-500 scale-100 opacity-100' : 'scale-95 opacity-60'}`}
                      style={{ width: '600px' }}
                      onClick={() => { 
                        // Skip intro card (index 0)
                        if (idx === 0) return;
                        setCarouselIndex(idx); 
                        setSelectedCarouselPathway(pathway); 
                        isProgrammaticScrollRef.current = true;
                        scrollToCarouselIndex(idx); 
                        setIsCarouselAutoScrolling(false); 
                        setTimeout(() => { isProgrammaticScrollRef.current = false; }, 800);
                      }}
                    >
                      <div className={`relative h-[300px] overflow-hidden rounded-xl ${isWingMentorCard ? 'bg-slate-950' : isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        {isWingMentorCard ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                            <img src="/logo.png" alt="WingMentor" className="h-20 w-auto object-contain mb-4" />
                            <p className="text-slate-400 text-sm text-center px-8">{pathway.description}</p>
                          </div>
                        ) : (
                          <img src={cardAircraftImage} alt={pathway.aircraftType} className="w-full h-full object-cover" loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGES[pathway.category] || FALLBACK_IMAGES['cadet-programme']; }} />
                        )}
                        {!isWingMentorCard && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />}
                        <div className="absolute top-3 right-3 flex gap-2 items-start">
                          {!isWingMentorCard && (() => {
                            const fbJob = intelligence.jobMatches?.scoredJobs?.find(j =>
                              String(j.company || '').toLowerCase() === String(pathway.airline || '').toLowerCase() ||
                              String(j.title || '').toLowerCase() === String(pathway.name || '').toLowerCase()
                            );
                            return (
                              <div className="relative">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setPopoverJobId(popoverJobId === pathway.id ? null : pathway.id); }}
                                  className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors"
                                >
                                  {pathway.matchProbability}% Match
                                </button>
                                <AnimatePresence>
                                  {popoverJobId === pathway.id && fbJob && (
                                    <MatchBreakdownPopover
                                      breakdown={fbJob.breakdown}
                                      matchPct={fbJob.matchPct}
                                      missingRating={fbJob.missingRating}
                                      isDarkMode={isDarkMode}
                                      onClose={() => setPopoverJobId(null)}
                                    />
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })()}
                          {!isWingMentorCard && <span className="px-3 py-1 rounded-full bg-sky-500/90 text-white text-xs font-semibold">PR: {intelligence.fullScore?.totalScore || recognitionProfile?.totalScore || 77}%</span>}
                          {!isWingMentorCard && pathway.hiringStatus === 'actively_hiring' && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/80 text-white text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              Hiring
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            {!isWingMentorCard && <img src={cardAirlineLogo} alt={pathway.airline} className="h-6 w-auto object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                            <h4 className="text-lg font-serif font-normal text-white">{pathway.name}</h4>
                          </div>
                          <p className="text-white/80 text-sm">{pathway.airline} · {pathway.locations.join(' | ')}</p>
                          {!isWingMentorCard && mode === 'jobs' && (() => {
                            const fbJob = intelligence.jobMatches?.scoredJobs?.find(j =>
                              String(j.title || '').toLowerCase() === String(pathway.name || '').toLowerCase() ||
                              String(j.company || '').toLowerCase() === String(pathway.airline || '').toLowerCase()
                            );
                            if (!fbJob || !pathway.requirements?.totalHours) return null;
                            return (
                              <div className="mt-2 px-2">
                                <JobGapBar
                                  hoursGap={fbJob.hoursGap}
                                  reqHours={pathway.requirements.totalHours}
                                  isDarkMode={true}
                                />
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Arrow Keys with Context Header */}
          <div className="flex items-center justify-center gap-6 mt-4 w-full">
            <button
              onClick={() => scrollCarousel('left')}
              className={`p-3 rounded-full border transition-all flex-shrink-0 ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 flex items-center justify-center">
              {selectedCarouselPathway && (
                <div className="text-center max-w-xl">
                    <p className={`text-xs uppercase tracking-widest ${subText} mb-1`}>Selected Pathway</p>
                    <h3 className={`text-xl font-serif font-normal ${headerText} mb-1`}>{selectedCarouselPathway.name}</h3>
                    <p className={`${subText} text-sm mb-2`}>
                      {selectedCarouselPathway.airline} · {selectedCarouselPathway.locations.join(' | ')}
                    </p>
                    <div className={`rounded-lg p-3 mb-2 ${isDarkMode ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-sky-50 border border-sky-200'}`}>
                      <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>Why this pathway is recommended</p>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Based on your profile, this pathway has a <strong>{selectedCarouselPathway.matchProbability}% match</strong>. Your recognition score of <strong>{intelligence.fullScore?.totalScore || recognitionProfile?.totalScore || 77}</strong> indicates alignment with this program's requirements.
                      </p>
                    </div>
                    <p className={`text-sm leading-relaxed ${subText}`}>{selectedCarouselPathway.description}</p>
                  </div>
              )}
            </div>

            <button
              onClick={() => scrollCarousel('right')}
              className={`p-3 rounded-full border transition-all flex-shrink-0 ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Requirements & Profile Alignment */}
          {selectedCarouselPathway && (() => {
            const reqMatches = analyzeRequirementAlignment(selectedCarouselPathway, recognitionProfile);
            return (
              <div className="w-full max-w-4xl mt-6">
                <div className="text-center mb-4">
                  <h3 className={`text-xl font-serif font-normal ${headerText} mb-1`}>Requirements & Profile Alignment</h3>
                  <p className={`${subText} text-sm`}>How your profile aligns with this pathway's requirements</p>
                </div>
                <GlassCard className="p-6" isDarkMode={isDarkMode}>
                  <div className={`border-b pb-3 mb-4 ${isDarkMode ? 'border-red-500/20' : 'border-red-200'}`}>
                    <p className="text-xs uppercase tracking-widest text-red-500 font-bold mb-2">Requirements & Profile Alignment</p>
                    <div className={`flex flex-wrap gap-4 text-xs ${subText}`}>
                      <div><span className="font-semibold">Updated:</span> {new Date().toLocaleDateString()}</div>
                      <div><span className="font-semibold">Source:</span> Job Board</div>
                      <div className="px-2 py-0.5 bg-sky-500 text-white rounded font-semibold">Airline Verified</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {reqMatches.map((match, index) => {
                      const statusColor = match.status === 'match' ? 'text-emerald-500' : match.status === 'close' ? 'text-amber-500' : 'text-red-500';
                      const statusBg = match.status === 'match' ? (isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50') : match.status === 'close' ? (isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50') : (isDarkMode ? 'bg-red-500/10' : 'bg-red-50');
                      const statusLabel = match.status === 'match' ? 'Met' : match.status === 'close' ? 'Close' : 'Gap';
                      return (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${statusBg}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${match.status === 'match' ? 'bg-emerald-500' : match.status === 'close' ? 'bg-amber-500' : 'bg-red-500'}`} />
                            <span className={`text-sm font-medium ${headerText}`}>{match.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs ${subText}`}>{match.suggestion || ''}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor} ${statusBg}`}>{statusLabel}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} flex flex-wrap gap-4 text-sm`}>
                    <div><span className={`font-semibold ${headerText}`}>Salary:</span> <span className={subText}>Up to {selectedCarouselPathway.salary.firstYear} per year</span></div>
                    <div><span className={`font-semibold ${headerText}`}>Positions:</span> <span className={subText}>{selectedCarouselPathway.positions} available</span></div>
                    <div><span className={`font-semibold ${headerText}`}>Location:</span> <span className={subText}>{selectedCarouselPathway.locations.join(', ')}</span></div>
                  </div>
                </GlassCard>

                {/* Score Display */}
                {intelligence.fullScore && (
                  <div className="flex flex-col items-center gap-2 mt-6">
                    <RadarChart
                      scores={intelligence.fullScore.breakdown}
                      size={160}
                      isDarkMode={isDarkMode}
                      animate={true}
                    />
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Score: {intelligence.fullScore.totalScore}/100
                      </span>
                      <ScoreVelocityBadge
                        velocity={intelligence.fullScore.scoreVelocity}
                        label={intelligence.fullScore.velocityLabel}
                        isDarkMode={isDarkMode}
                      />
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{intelligence.fullScore.rankLabel}</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Roadmap Timeline — shown when a pathway is selected */}
          {selectedCarouselPathway && (
            <div className="w-full max-w-4xl mt-6">
              <RoadmapTimeline
                steps={intelligence.roadmap?.roadmapSteps || []}
                loading={intelligence.loadingRoadmap}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* 3D Aircraft View */}
          {selectedCarouselPathway && (() => {
            const aircraftType = selectedCarouselPathway.aircraftType || 'default';
            const typeKey = String(aircraftType || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
            // Better matching for A320 family and similar patterns
            const hasModel = SKETCHFAB_MODELS[typeKey] || 
              SKETCHFAB_MODELS[aircraftType] ||
              Object.keys(SKETCHFAB_MODELS).some(key => 
                typeKey.includes(key) || key.includes(typeKey.replace('FAMILY', ''))
              );
            // Map A320 family to A320 if not found
            const effectiveType = (typeKey.includes('A320') && !SKETCHFAB_MODELS[typeKey]) ? 'A320' : aircraftType;
            return (
              <div className="w-full mt-6">
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                  <h3 className={`text-lg font-semibold ${headerText} mb-4 flex items-center gap-2`}>
                    <Target className="w-5 h-5 text-sky-400" />
                    3D Aircraft View
                  </h3>
                  {hasModel ? (
                    <div className="aspect-video w-full rounded-lg overflow-hidden relative group">
                      <Aircraft3DCanvas
                        aircraftType={effectiveType}
                        isDarkMode={isDarkMode}
                      />
                      {!cockpitActivated && (
                        <div
                          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-opacity duration-300 group-hover:opacity-100 opacity-90"
                          onClick={() => setCockpitActivated(true)}
                        >
                          <div className="text-center">
                            <img src="/logo.png" alt="WingMentor" className="w-48 h-48 object-contain mx-auto mb-1" />
                            <p className="text-white font-semibold text-lg mb-1">Click to Interact</p>
                            <p className="text-white/80 text-sm">Enable 3D aircraft controls</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`h-48 w-full rounded-lg flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <Plane className={`w-12 h-12 mb-2 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                      <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>3D model unavailable</p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Aircraft not in model library</p>
                    </div>
                  )}
                  <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-2 text-center`}>
                    Interactive {aircraftType || 'Aircraft'} model
                  </p>
                </div>
              </div>
            );
          })()}

          {/* 3D Cockpit View - A320 Family, B737, and B747 only */}
          {selectedCarouselPathway && (() => {
            const aircraftType = selectedCarouselPathway.aircraftType || 'default';
            const typeKey = String(aircraftType || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
            const isA320 = typeKey.includes('A318') || typeKey.includes('A319') || typeKey.includes('A319NEO') || typeKey.includes('A320') || typeKey.includes('A320NEO') || typeKey.includes('A321') || typeKey.includes('A321NEO');
            const isB737 = typeKey.includes('B737') || typeKey.includes('737');
            const isB747 = typeKey.includes('B747') || typeKey.includes('747');
            const showCockpit = isA320 || isB737 || isB747;
            if (!showCockpit) return null;
            return (
              <div className="w-full mt-6">
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                  <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                    <LayoutGrid className="w-4 h-4" />
                    Cockpit Interior 3D
                  </h4>
                  <div className="h-[500px] w-full rounded-lg relative overflow-hidden group">
                    <Cockpit3DCanvas
                      aircraftType={aircraftType}
                      isDarkMode={isDarkMode}
                    />
                    {!cockpitActivated && (
                      <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-opacity duration-300 group-hover:opacity-100 opacity-90"
                        onClick={() => setCockpitActivated(true)}
                      >
                        <div className="text-center">
                          <img src="/logo.png" alt="WingMentor" className="w-48 h-48 object-contain mx-auto mb-1" />
                          <p className="text-white font-semibold text-lg mb-1">Click to Interact</p>
                          <p className="text-white/80 text-sm">Enable 3D cockpit controls</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-2 text-center`}>
                    {isB747 ? 'Boeing 747 Glass cockpit' : isB737 ? 'Boeing 737 Glass cockpit' : 'A320 Glass cockpit layout'}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </main>


      {/* Match Result Modal */}
      {selectedPathwayForMatch && (
        <MatchResultModal 
          pathway={selectedPathwayForMatch}
          userProfile={userProfile}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedPathwayForMatch(null)}
        />
      )}
    </div>
  );
};

// Match Result Modal Component
const MatchResultModal: React.FC<{
  pathway: PathwayData;
  userProfile: any;
  isDarkMode: boolean;
  onClose: () => void;
}> = ({ pathway, userProfile, isDarkMode, onClose }) => {
  const [saved, setSaved] = useState(false);

  // Calculate match between user profile and job requirements
  const calculateMatch = () => {
    const userHours = userProfile?.current_flight_hours || 0;
    const requiredHours = pathway.requirements.totalHours || 1500;
    
    const userLicenses = userProfile?.ratings || [];
    const requiredLicenses = pathway.requirements.typeRatings || [];
    
    // Calculate hours match
    const hoursMet = userHours >= requiredHours;
    const hoursScore = Math.min(100, (userHours / requiredHours) * 100);
    
    // Calculate licenses match
    const licensesMet = requiredLicenses.every(license =>
      userLicenses.some(userLicense =>
        (userLicense || '').toLowerCase().includes(license.toLowerCase())
      )
    );
    const licensesScore = licensesMet ? 100 : 50;
    
    // Overall match score
    const overallMatch = Math.round((hoursScore + licensesScore) / 2);

    return {
      overallMatch,
      hoursMet,
      hoursScore,
      licensesMet,
      licensesScore,
      userHours,
      requiredHours
    };
  };

  const matchResult = calculateMatch();

  const handleSave = () => {
    setSaved(true);
    // Would save to Firebase in production
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
        {/* Header */}
        <div className={`p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between`}>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              REQUIREMENTS & PROFILE ALIGNMENT
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
              Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Job Info */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-2">
              <Building2 className="w-4 h-4" />
              Source: Job Board
              <span className="mx-2">•</span>
              <span>Airline Verified</span>
            </div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {pathway.name}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {pathway.airline}
            </p>
          </div>

          {/* Flight Hours */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-3`}>
              FLIGHT HOURS
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-4`}>
              Your account shows: {matchResult.userHours} total flight hours
            </p>
            <div className={`overflow-hidden rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <table className="w-full">
                <thead>
                  <tr className={`${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <th className={`text-left p-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      REQUIREMENT
                    </th>
                    <th className={`text-center p-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      STATUS
                    </th>
                    <th className={`text-left p-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`${isDarkMode ? 'border-slate-700' : 'border-slate-200'} border-t`}>
                    <td className={`p-3 text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {matchResult.requiredHours}+ hours
                    </td>
                    <td className="p-3 text-center">
                      {matchResult.hoursMet ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <span className="text-lg">✓</span> Met
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                          <span className="text-lg">✗</span> Not Met
                        </span>
                      )}
                    </td>
                    <td className={`p-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {matchResult.hoursMet 
                        ? 'You have sufficient hours' 
                        : `Need ${matchResult.requiredHours - matchResult.userHours} more hours`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Licenses */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-3`}>
              LICENSES
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-4`}>
              Your account shows: {userProfile?.ratings?.join(', ') || 'None'}
            </p>
            <div className={`overflow-hidden rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <table className="w-full">
                <thead>
                  <tr className={`${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <th className={`text-left p-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      REQUIREMENT
                    </th>
                    <th className={`text-center p-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      STATUS
                    </th>
                    <th className={`text-left p-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pathway.requirements.typeRatings.map((license, index) => {
                    const hasLicense = userProfile?.ratings?.some(r =>
                      (r || '').toLowerCase().includes(license.toLowerCase())
                    );
                    return (
                      <tr key={index} className={`${isDarkMode ? 'border-slate-700' : 'border-slate-200'} border-t`}>
                        <td className={`p-3 text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {license}
                        </td>
                        <td className="p-3 text-center">
                          {hasLicense ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <span className="text-lg">✓</span> Met
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                              <span className="text-lg">✗</span> Not Met
                            </span>
                          )}
                        </td>
                        <td className={`p-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {hasLicense ? 'License requirement met' : 'Missing required license'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Certifications */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-3`}>
              CERTIFICATIONS
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-4`}>
              Your account shows: 0 certifications on file
            </p>
            <div className={`overflow-hidden rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <table className="w-full">
                <thead>
                  <tr className={`${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <th className={`text-left p-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      REQUIREMENT
                    </th>
                    <th className={`text-center p-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      STATUS
                    </th>
                    <th className={`text-left p-3 text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`${isDarkMode ? 'border-slate-700' : 'border-slate-200'} border-t`}>
                    <td className={`p-3 text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Swim test
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                        <span className="text-lg">✗</span> Not Met
                      </span>
                    </td>
                    <td className={`p-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Missing Swim test
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Why Your Profile Matches */}
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-3`}>
              WHY YOUR PROFILE MATCHES
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl font-bold text-emerald-400">
                {matchResult.overallMatch}%
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Match based on your profile and job requirements
              </div>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Your profile shows a {matchResult.overallMatch}% match based on your flight hours, licenses, and certifications. 
              {matchResult.overallMatch < 80 && ' Consider building more flight hours and completing required type ratings to improve your match score.'}
              {matchResult.overallMatch >= 80 && ' You have a strong profile for this position.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} flex gap-3`}>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              saved 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/25'
            }`}
          >
            {saved ? (
              <>
                <span className="text-lg">✓</span> Saved
              </>
            ) : (
              <>
                <Bookmark className="w-5 h-5" />
                Save Match Result
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathwaysPageModern;
