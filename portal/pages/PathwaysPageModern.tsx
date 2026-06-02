import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/src/components/ui/toast';
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
  ArrowLeft,
  ChevronUp
} from 'lucide-react';
import MilitaryPathwaysPage from './MilitaryPathwaysPage';
import SpecialPathwaysPage from './SpecialPathwaysPage';
import LicensureTypeRatingPage from './LicensureTypeRatingPage';
import CommercialPilotPathwayPage from './CommercialPilotPathwayPage';
import { PathwaysSidebar } from '../../components/website/components/pilot-recognition/PathwaysSidebar';
import { PlatformNavbar } from '../../components/website/components/PlatformNavbar';
import { useAuth } from '../../src/contexts/AuthContext';
import { usePathwaysIntelligence } from '../hooks/usePathwaysIntelligence';
import { LoginModal } from '../../components/website/components/LoginModal';
import { getPhilippianFlightSchoolCount, Region, DUMMY_FLIGHT_SCHOOLS } from '../../data/flight-schools';
import { DUMMY_MILITARY_PATHWAYS } from '../../data/military-pathways';
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
import { MeshGradient } from '@paper-design/shaders-react';
import { supabase } from '../../src/lib/supabase';
import { 
  pathwayEngine, 
  extractPilotProfile, 
  cachePathways, 
  getCachedPathways,
  type LocalPilotProfile 
} from '../../lib/pathways/pathwayMatchingEngine';
import type { PathwayMatch, Pathway } from '../../lib/pathways/types';

// ============================================================================
// HARDCODED CATEGORY CONSTANTS
// ============================================================================

const GENERAL_CATEGORIES = [
  {
    id: 'da486dd1-8832-4ec3-843b-1cbd3c9b8718',
    name: 'Pilot Training & Certification',
    description: 'From student pilot to commercial pilot certifications',
    icon: null,
    display_order: 1
  },
  {
    id: '9c6dc768-ecac-408f-b62c-d3f72ae8e509',
    name: 'Career Progression',
    description: 'Career advancement and transition pathways',
    icon: null,
    display_order: 2
  },
  {
    id: '0cc029df-b6f9-4f6d-b4e3-c7bd3d89cbe8',
    name: 'Commercial Operations',
    description: 'Charter, corporate, and cargo operations',
    icon: null,
    display_order: 3
  },
  {
    id: '9865e475-1b3a-4d16-8a2f-cdd443dd7975',
    name: 'Specialized Operations',
    description: 'Agricultural, firefighting, and specialized aviation',
    icon: null,
    display_order: 4
  },
  {
    id: '37c42b2b-1f4c-4f64-b1a1-dd1f84623023',
    name: 'Humanitarian & Aid',
    description: 'Humanitarian missions and disaster response',
    icon: null,
    display_order: 5
  },
  {
    id: 'c5f16476-44c0-4c3e-88db-85813efb96a0',
    name: 'Remote & Bush Operations',
    description: 'Bush flying and remote operations',
    icon: null,
    display_order: 6
  },
  {
    id: 'd5855477-a76d-42be-abae-e18fce201ac8',
    name: 'Emerging Technologies',
    description: 'eVTOL, drones, and aviation technology',
    icon: null,
    display_order: 7
  },
  {
    id: 'c76a0f63-734c-4d1d-8cf4-b7ad3bdeed0b',
    name: 'Military & Government',
    description: 'Military and government aviation',
    icon: null,
    display_order: 8
  },
  {
    id: 'a37e4e35-d6f6-4af9-bb7f-30d06df21935',
    name: 'Aviation Support Services',
    description: 'Management, engineering, and support services',
    icon: null,
    display_order: 9
  },
  {
    id: '66be62e7-bc8b-48ca-978c-0fb15e3901a7',
    name: 'Aviation Industry',
    description: 'Sales, consulting, and industry roles',
    icon: null,
    display_order: 10
  }
];

const PATHWAYS = [
  // Pilot Training & Certification
  {
    id: 'c39c880b-dce1-4c6a-88b6-c5bf19eb07d0',
    general_category_id: 'da486dd1-8832-4ec3-843b-1cbd3c9b8718',
    name: 'Student Pilot Pathway',
    description: 'From zero to first solo flight',
    icon: null,
    display_order: 1
  },
  {
    id: '83806ec2-6376-4b65-bcd8-4fc25391cc71',
    general_category_id: 'da486dd1-8832-4ec3-843b-1cbd3c9b8718',
    name: 'Private Pilot Pathway',
    description: 'Private pilot license and recreational flying',
    icon: null,
    display_order: 2
  },
  {
    id: '7cbd80b9-1172-4b8a-b7e0-e975c91b3ee1',
    general_category_id: 'da486dd1-8832-4ec3-843b-1cbd3c9b8718',
    name: 'Commercial Pilot Pathway',
    description: 'Commercial pilot certification and ratings',
    icon: null,
    display_order: 3
  },
  {
    id: 'flight-schools-category',
    general_category_id: 'da486dd1-8832-4ec3-843b-1cbd3c9b8718',
    name: 'Flight Schools',
    description: 'Approved flight training academies and aviation universities worldwide',
    icon: null,
    display_order: 4
  },
  {
    id: 'type-rating-category',
    general_category_id: 'da486dd1-8832-4ec3-843b-1cbd3c9b8718',
    name: 'Licensure & Type Rating Pathways',
    description: 'IR, ME, ATPL, A320, B737, B777, ATR and more — approved type rating centres worldwide',
    icon: null,
    display_order: 5
  },
  // Military & Government
  {
    id: 'military-pathways-category',
    general_category_id: 'c76a0f63-734c-4d1d-8cf4-b7ad3bdeed0b',
    name: 'Military Pathways',
    description: 'Air Force, Navy, Army, Marine Corps and government aviation programs',
    icon: null,
    display_order: 1
  },
  // Career Progression
  {
    id: '48dabe06-87f2-4227-98ed-78e8d96b2d8b',
    general_category_id: '9c6dc768-ecac-408f-b62c-d3f72ae8e509',
    name: 'Airline Transport Pilot Pathway',
    description: 'ATP certification and airline entry',
    icon: null,
    display_order: 1
  },
  {
    id: 'da3b7514-925d-4024-9341-08248d52cdb9',
    general_category_id: '9c6dc768-ecac-408f-b62c-d3f72ae8e509',
    name: 'Flight Instructor Pathway',
    description: 'CFI, CFII, MEI instructor ratings',
    icon: null,
    display_order: 2
  },
  {
    id: 'a7dfe793-df6f-4286-8bd2-afa0653a608d',
    general_category_id: '9c6dc768-ecac-408f-b62c-d3f72ae8e509',
    name: 'Cadet Pilot Pathway',
    description: 'Airline-sponsored cadet programs',
    icon: null,
    display_order: 3
  },
  {
    id: 'c18c5eb8-5b0a-4ba1-ac17-fe0e658f1dd7',
    general_category_id: '9c6dc768-ecac-408f-b62c-d3f72ae8e509',
    name: 'Low Timer Pilot Pathway',
    description: 'Entry-level positions for low-time pilots',
    icon: null,
    display_order: 4
  },
  {
    id: '4f160ab4-d94f-496a-9099-5386ffa456ec',
    general_category_id: '9c6dc768-ecac-408f-b62c-d3f72ae8e509',
    name: 'High Timer Pilot Pathway',
    description: 'Advanced positions for experienced pilots',
    icon: null,
    display_order: 5
  },
  {
    id: '8d3faf3f-a892-4902-b82c-93980080dac9',
    general_category_id: '9c6dc768-ecac-408f-b62c-d3f72ae8e509',
    name: 'Regional Airline Pathway',
    description: 'Regional airline career progression',
    icon: null,
    display_order: 6
  },
  {
    id: 'fbb3a1be-432e-4c85-b23b-c1cce9d32913',
    general_category_id: '9c6dc768-ecac-408f-b62c-d3f72ae8e509',
    name: 'Major Airline Pathway',
    description: 'Major airline career progression',
    icon: null,
    display_order: 7
  },
  // Commercial Operations
  {
    id: '9145209b-d0de-4b43-a2bd-d7f523f8f230',
    general_category_id: '0cc029df-b6f9-4f6d-b4e3-c7bd3d89cbe8',
    name: 'Charter Pilot Pathway',
    description: 'Part 135 charter operations',
    icon: null,
    display_order: 1
  },
  {
    id: 'e11079f9-3506-4543-b273-a8410464b396',
    general_category_id: '0cc029df-b6f9-4f6d-b4e3-c7bd3d89cbe8',
    name: 'Corporate Pilot Pathway',
    description: 'Part 91 corporate aviation',
    icon: null,
    display_order: 2
  },
  {
    id: '9aab7b85-3f81-43ca-8d8b-421ee658ecaf',
    general_category_id: '0cc029df-b6f9-4f6d-b4e3-c7bd3d89cbe8',
    name: 'Cargo Pilot Pathway',
    description: 'Cargo and freight operations',
    icon: null,
    display_order: 3
  },
  {
    id: 'acdea7e3-fdfb-4d2e-a711-c653bd6e38ab',
    general_category_id: '0cc029df-b6f9-4f6d-b4e3-c7bd3d89cbe8',
    name: 'Private Sector Pathway',
    description: 'Private aviation and recreational flying',
    icon: null,
    display_order: 4
  },
  // Specialized Operations
  {
    id: '1c04e201-07f8-49f5-a899-b80742281ed8',
    general_category_id: '9865e475-1b3a-4d16-8a2f-cdd443dd7975',
    name: 'Specialized Pathway',
    description: 'Agricultural, firefighting, and specialized ops',
    icon: null,
    display_order: 1
  },
  // Humanitarian & Aid
  {
    id: 'c311583f-a6c1-4c38-b33f-ec1ff091501d',
    general_category_id: '37c42b2b-1f4c-4f64-b1a1-dd1f84623023',
    name: 'Humanitarian Aviation Pathway',
    description: 'Aid relief and humanitarian missions',
    icon: null,
    display_order: 1
  },
  // Remote & Bush Operations
  {
    id: '519a5814-a26d-431b-838f-d09dbf62586c',
    general_category_id: 'c5f16476-44c0-4c3e-88db-85813efb96a0',
    name: 'Bush Pilot Pathway',
    description: 'Bush flying and remote operations',
    icon: null,
    display_order: 1
  },
  // Emerging Technologies
  {
    id: '8a2ccd30-b6dd-49a8-a451-8d32ce42bf22',
    general_category_id: 'd5855477-a76d-42be-abae-e18fce201ac8',
    name: 'Emerging Air Taxi Pathway',
    description: 'eVTOL and urban air mobility',
    icon: null,
    display_order: 1
  },
  {
    id: '3a9e3d74-5937-4a68-ab0c-c11f8524c8ef',
    general_category_id: 'd5855477-a76d-42be-abae-e18fce201ac8',
    name: 'Drones/UAV Pathway',
    description: 'Commercial drone operations',
    icon: null,
    display_order: 2
  },
  {
    id: '18a40676-b17d-400e-9449-4b65c4c44e38',
    general_category_id: 'd5855477-a76d-42be-abae-e18fce201ac8',
    name: 'Aviation Technology Pathway',
    description: 'Aviation software and technology',
    icon: null,
    display_order: 3
  },
  // Military & Government
  {
    id: '5b6097c0-edef-4d89-90bc-9a0fa46aba84',
    general_category_id: 'c76a0f63-734c-4d1d-8cf4-b7ad3bdeed0b',
    name: 'Military Aviation Pathway',
    description: 'Military pilot training and transition',
    icon: null,
    display_order: 1
  },
  {
    id: 'e9877f93-5972-45a7-a635-e6fbf42b43c5',
    general_category_id: 'c76a0f63-734c-4d1d-8cf4-b7ad3bdeed0b',
    name: 'Government Aviation Pathway',
    description: 'Federal and government aviation',
    icon: null,
    display_order: 2
  },
  // Aviation Support Services
  {
    id: '90a230e0-7b1c-4209-9617-27d3bf06fd7a',
    general_category_id: 'a37e4e35-d6f6-4af9-bb7f-30d06df21935',
    name: 'Aviation Management Pathway',
    description: 'Airport and airline management',
    icon: null,
    display_order: 1
  },
  {
    id: '7af9bb04-8a9c-4ab2-86f4-b470f8a57f60',
    general_category_id: 'a37e4e35-d6f6-4af9-bb7f-30d06df21935',
    name: 'Aviation Engineering Pathway',
    description: 'Aircraft design and maintenance',
    icon: null,
    display_order: 2
  },
  {
    id: 'fceb071c-3b7c-4399-a7da-ad6e96af7aeb',
    general_category_id: 'a37e4e35-d6f6-4af9-bb7f-30d06df21935',
    name: 'Aviation Safety Pathway',
    description: 'Safety inspection and investigation',
    icon: null,
    display_order: 3
  },
  {
    id: '9129d24d-6a71-4ce8-a26d-a5b3a0fc65d4',
    general_category_id: 'a37e4e35-d6f6-4af9-bb7f-30d06df21935',
    name: 'Aviation Law Pathway',
    description: 'Aviation law and regulatory affairs',
    icon: null,
    display_order: 4
  },
  {
    id: '4c381227-42a4-410b-8309-9887fb73a243',
    general_category_id: 'a37e4e35-d6f6-4af9-bb7f-30d06df21935',
    name: 'Aviation Medicine Pathway',
    description: 'Aviation medical examiner and physiology',
    icon: null,
    display_order: 5
  },
  // Aviation Industry
  {
    id: 'bf917a9c-7c76-41f7-b2a2-68c48ac113d9',
    general_category_id: '66be62e7-bc8b-48ca-978c-0fb15e3901a7',
    name: 'Aviation Sales Pathway',
    description: 'Aircraft and aviation sales',
    icon: null,
    display_order: 1
  },
  {
    id: '78352948-c4eb-4ed8-ab5d-8f34e5012c91',
    general_category_id: '66be62e7-bc8b-48ca-978c-0fb15e3901a7',
    name: 'Aviation Consulting Pathway',
    description: 'Aviation consulting services',
    icon: null,
    display_order: 2
  },
  {
    id: '9390d75d-2e82-470a-a130-8422956690dd',
    general_category_id: '66be62e7-bc8b-48ca-978c-0fb15e3901a7',
    name: 'Aviation Media Pathway',
    description: 'Aviation journalism and media',
    icon: null,
    display_order: 3
  },
  {
    id: 'f7033e10-e979-49af-858d-19ab97d6435e',
    general_category_id: '66be62e7-bc8b-48ca-978c-0fb15e3901a7',
    name: 'Aviation Education Pathway',
    description: 'Aviation education and training',
    icon: null,
    display_order: 4
  },
  {
    id: '88bf9e99-1fa5-4d64-9d1f-9697aec3cda3',
    general_category_id: '66be62e7-bc8b-48ca-978c-0fb15e3901a7',
    name: 'Aviation Research Pathway',
    description: 'Aviation research and development',
    icon: null,
    display_order: 5
  }
];

// Sub-pathways will be fetched from Supabase for card details

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
  'qatar': 'https://airlinegeeks.com/wp-content/uploads/2018/10/IMG_3495-e1540774160956.jpg',
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
  'flight-schools': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'military': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
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

  // Return null instead of empty string to avoid empty src warning
  return null as any;
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
  claimed?: boolean;
}

interface PathwayData {
  id: string;
  name: string;
  category: 'all' | 'airline-pathways' | 'cadet-programme' | 'private' | 'privateSector' | 'cargo' | 'type-rating' | 'airtaxi-drones' | 'flight-schools' | 'military' | 'pathway';
  airline: string;
  description?: string;
  image: string;
  matchProbability: number;
  aircraftType: string; // X-Plane 3D model identifier
  claimed?: boolean;
  region?: Region;
  requirements: {
    totalHours: number;
    multiEngineHours?: number;
    turbineHours?: number;
    typeRatings: string[];
  };
  salary?: {
    firstYear: string;
    fifthYear: string;
    bonuses: string;
  };
  benefits?: string[];
  locations: string[];
  interestLevel: 'high_interest' | 'moderate' | 'limited' | 'paused' | 'active';
  positions?: number;
  url?: string; // Link to original job posting
  isEnterprise?: boolean; // Posted by an enterprise/airline account
  enterpriseLogoUrl?: string; // Airline logo from Cloudinary
  pathwayId?: string; // Reference to the career hierarchy pathway
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
// PATHWAY DATA - Discovery pathways from industry stakeholders
// ============================================================================

// Discovery Pathways - Career pathways and programs for all pilot types
const DISCOVERY_PATHWAYS: Record<string, PathwayJob[]> = {
  'airline-pathways': [
  ],
  'cadet-programme': [
    {
      id: 'wingmentor-intro',
      title: 'Pathways to Partnered Cadet Programs',
      company: 'PilotRecognition',
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
      company: 'PilotRecognition',
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
      company: 'PilotRecognition',
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
      company: 'PilotRecognition',
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
      company: 'PilotRecognition',
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
      id: 'tr-a320',
      title: 'Airbus A320 Type Rating',
      company: 'CAE / FlightSafety / Approved ATOs',
      matchPercentage: 97,
      location: 'Clark, Philippines · Dubai, UAE · London, UK · Melbourne, AU',
      type: 'Narrowbody Type Rating',
      salary: '$18,000 – $35,000',
      requirements: ['CPL + IR + ME', 'Class 1 Medical', '200+ hrs TT', 'English ICAO Level 4+'],
      tags: ['Asia', 'Type Rating', 'Most In-Demand'],
      postedAt: 'Open Enrollment',
      image: 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp'
    },
    {
      id: 'tr-b737',
      title: 'Boeing 737 Type Rating',
      company: 'CAE / FlightSafety / Boeing Training',
      matchPercentage: 95,
      location: 'Seattle, USA · Amsterdam, NL · Singapore · Manila, PH',
      type: 'Narrowbody Type Rating',
      salary: '$16,000 – $30,000',
      requirements: ['CPL + IR + ME', 'Class 1 Medical', '200+ hrs TT', 'English ICAO Level 4+'],
      tags: ['Americas', 'Type Rating', 'High Demand'],
      postedAt: 'Open Enrollment',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Southwest_Airlines_Boeing_737-700_N278WN.jpg/1280px-Southwest_Airlines_Boeing_737-700_N278WN.jpg'
    },
    {
      id: 'tr-atr72',
      title: 'ATR 72-600 Type Rating',
      company: 'CAE Philippines / ATR Training Centre',
      matchPercentage: 92,
      location: 'Clark, Philippines · Toulouse, France',
      type: 'Turboprop Type Rating',
      salary: '$12,000 – $20,000',
      requirements: ['CPL + IR', 'Class 1 Medical', 'ME Rating Preferred', 'CAAP/EASA Licence'],
      tags: ['Asia', 'Type Rating', 'Regional Airlines'],
      postedAt: 'Open Enrollment',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Philippine_Airlines_ATR_72-600_RP-C7282_LAX_%2814264556285%29.jpg/1280px-Philippine_Airlines_ATR_72-600_RP-C7282_LAX_%2814264556285%29.jpg'
    },
    {
      id: 'tr-b777',
      title: 'Boeing 777 Type Rating',
      company: 'CAE / Emirates Aviation / FlightSafety',
      matchPercentage: 88,
      location: 'Dubai, UAE · London, UK · Dallas, USA',
      type: 'Widebody Type Rating',
      salary: '$25,000 – $45,000',
      requirements: ['ATPL or CPL+IR', '1,500+ hrs TT', 'Class 1 Medical', 'Airline FO Experience Preferred'],
      tags: ['Middle East', 'Type Rating', 'Widebody'],
      postedAt: 'Open Enrollment',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Emirates_B777-300ER_%28A6-EGH%29_arrives_at_London_Heathrow_2.jpg/1280px-Emirates_B777-300ER_%28A6-EGH%29_arrives_at_London_Heathrow_2.jpg'
    },
    {
      id: 'tr-a330',
      title: 'Airbus A330 Type Rating',
      company: 'CAE / Airbus Training Centre',
      matchPercentage: 85,
      location: 'Toulouse, France · Singapore · Sydney, AU',
      type: 'Widebody Type Rating',
      salary: '$22,000 – $40,000',
      requirements: ['ATPL or CPL+IR', '1,000+ hrs TT', 'Class 1 Medical', 'A320 Rating Preferred'],
      tags: ['Europe', 'Type Rating', 'Widebody'],
      postedAt: 'Open Enrollment',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Philippine_Airlines_A330-300_RP-C8782_MNL_2013-4-29.png/1280px-Philippine_Airlines_A330-300_RP-C8782_MNL_2013-4-29.png'
    },
    {
      id: 'tr-b787',
      title: 'Boeing 787 Dreamliner Type Rating',
      company: 'CAE / United Airlines Training / Boeing',
      matchPercentage: 82,
      location: 'Denver, USA · London, UK · Tokyo, JP',
      type: 'Widebody Type Rating',
      salary: '$28,000 – $50,000',
      requirements: ['ATPL', '2,000+ hrs TT', 'Widebody Experience Preferred', 'Class 1 Medical'],
      tags: ['Americas', 'Type Rating', 'Widebody'],
      postedAt: 'Open Enrollment',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Air_New_Zealand_787-9_Dreamliner_ZK-NZE_%2820841177593%29.jpg/1280px-Air_New_Zealand_787-9_Dreamliner_ZK-NZE_%2820841177593%29.jpg'
    },
    {
      id: 'tr-dhc8',
      title: 'De Havilland Q400 Type Rating',
      company: 'CAE / Regional Airline ATOs',
      matchPercentage: 90,
      location: 'Manila, PH · Toronto, CA · Amsterdam, NL',
      type: 'Turboprop Type Rating',
      salary: '$10,000 – $18,000',
      requirements: ['CPL + IR', 'Class 1 Medical', 'ME Rating Preferred'],
      tags: ['Asia', 'Type Rating', 'Regional Airlines'],
      postedAt: 'Open Enrollment',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Philippine_Airlines_Q400_RP-C5001_MNL.jpg/1280px-Philippine_Airlines_Q400_RP-C5001_MNL.jpg'
    },
    {
      id: 'tr-mcc-joc',
      title: 'MCC / Jet Orientation Course',
      company: 'Multiple Approved ATOs',
      matchPercentage: 98,
      location: 'Clark, PH · London, UK · Amsterdam, NL · Dubai, UAE',
      type: 'Pre-Type Rating Course',
      salary: '$3,000 – $8,000',
      requirements: ['CPL + IR + ME', 'Class 1 Medical', 'Airline Interview Stage'],
      tags: ['Asia', 'Type Rating', 'Pre-TR Essential'],
      postedAt: 'Open Enrollment',
      image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1778404520/flight-schools/aag.jpg'
    },
    {
      id: 'tr-uprt',
      title: 'UPRT — Upset Prevention & Recovery',
      company: 'Camiguin Aviation / Approved UPRT Providers',
      matchPercentage: 88,
      location: 'Camiguin, PH · Various Locations',
      type: 'Mandatory Safety Rating',
      salary: '$2,500 – $5,000',
      requirements: ['CPL or ATPL', 'EASA/CAAP Compliant', 'Any Stage of Training'],
      tags: ['Asia', 'Safety', 'ICAO Mandated'],
      postedAt: 'Open Enrollment',
      image: 'https://www.camiguinaviation.com/images/our-aircraft-compressed.png'
    }
  ],
  'airtaxi-drones': [
    {
      id: 'wingmentor-intro-evtol',
      title: 'Learn More',
      company: 'PilotRecognition',
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
  ],
  'flight-schools': DUMMY_FLIGHT_SCHOOLS.filter(s => s.id !== 'wingmentor-intro').map(s => ({
    id: s.id,
    title: s.name,
    company: s.location,
    matchPercentage: Math.round(s.rating * 20),
    location: s.location,
    type: 'Flight School',
    salary: s.price,
    requirements: ['Medical Certificate', 'English Proficiency'],
    tags: [s.region, 'Flight Training', 'CAAP Approved'],
    postedAt: 'Open Enrollment',
    image: s.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    claimed: s.claimed ?? false,
  })),
  'military': DUMMY_MILITARY_PATHWAYS.filter(m => m.id !== 'military-intro').map(m => ({
    id: m.id,
    title: m.name,
    company: m.branch,
    matchPercentage: Math.round(m.rating * 20),
    location: m.location,
    type: 'Military',
    salary: `Service commitment: ${m.serviceCommitment}`,
    requirements: ['Physical Fitness', 'Security Clearance', 'Citizenship'],
    tags: [m.branch, 'Military Aviation', 'Service'],
    postedAt: 'Ongoing Recruitment',
    image: m.image || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  })),
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
  
  // Determine pathway activity level
  let interestLevel: PathwayData['interestLevel'] = 'moderate';
  if (String(job.status || '').toLowerCase().includes('hiring now') || String(job.status || '').toLowerCase().includes('actively')) {
    interestLevel = 'high_interest';
  } else if (String(job.status || '').toLowerCase().includes('limited') || String(job.status || '').toLowerCase().includes('selective')) {
    interestLevel = 'limited';
  } else if (String(job.status || '').toLowerCase().includes('frozen') || String(job.status || '').toLowerCase().includes('pause')) {
    interestLevel = 'paused';
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
    interestLevel,
    positions: interestLevel === 'high_interest' ? 20 + Math.floor(Math.random() * 50) : 5 + Math.floor(Math.random() * 15),
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

// Interest Level Badge (NOT a hiring status - pathway activity indicator)
const InterestBadge: React.FC<{ status: string; positions: number }> = ({ status, positions }) => {
  const configs: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    high_interest: { 
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: <Zap className="w-3.5 h-3.5" />,
      label: 'High Interest'
    },
    active: { 
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: <Zap className="w-3.5 h-3.5" />,
      label: 'Active'
    },
    moderate: { 
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: <Users className="w-3.5 h-3.5" />,
      label: 'Moderate Interest'
    },
    limited: { 
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Limited'
    },
    paused: { 
      color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: 'Paused'
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
  currentUser?: any;
  onSubmitInterest?: () => void;
}> = ({ pathway, isExpanded, onToggle, onCalculateMatch, isDarkMode = true, userProfile = MOCK_USER_PROFILE, currentUser, onSubmitInterest }) => {
  // Track view when enterprise card is expanded
  const hasTrackedView = useRef(false);
  
  useEffect(() => {
    if (isExpanded && pathway.isEnterprise && !hasTrackedView.current) {
      hasTrackedView.current = true;
      const cardId = pathway.id.replace('enterprise-', '');
      // Skip tracking on localhost to avoid CORS errors during development
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'))) return;
      // Fire and forget - don't block UI
      fetch('https://us-central1-pilotrecognition-airline.cloudfunctions.net/trackCardView', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId })
      }).catch(() => {});
    }
  }, [isExpanded, pathway.id, pathway.isEnterprise]);
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

          {/* Enterprise Badge */}
          {pathway.isEnterprise && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider shadow-lg border border-blue-400/40">
              <Building2 className="w-3 h-3" />
              Airline Posted
            </div>
          )}

                  </div>

        {/* Bottom - Content */}
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-3">
            {airlineLogo && (
              <img
                src={airlineLogo}
                alt={pathway.airline}
                className="h-8 w-auto object-contain flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
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
              <InterestBadge status={pathway.interestLevel} positions={pathway.positions} />
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
                {pathway.isEnterprise ? (
                  <button
                    onClick={onSubmitInterest}
                    disabled={!currentUser}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/25"
                    title={!currentUser ? 'Sign in to submit interest' : 'Submit interest in pathway'}
                  >
                    <Briefcase className="w-5 h-5" />
                    {currentUser ? 'Submit Interest' : 'Sign in to Submit Interest'}
                  </button>
                ) : (
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
                )}
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
          <p className={`${textColorLight} text-xs mt-1`}>Based on PilotRecognition formula</p>
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

// Search Bar - supports light/dark mode with enhanced UX
interface SearchBarProps {
  onSearch: (query: string) => void;
  isDarkMode?: boolean;
  canPostPathways?: boolean;
  onPostPathway?: () => void;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, isDarkMode = true, canPostPathways = false, onPostPathway }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const localInputRef = useRef<HTMLInputElement>(null);
  const inputRef = (ref as React.RefObject<HTMLInputElement>) || localInputRef;

  const trendingSearches = [
    { label: 'Cadet Programs', icon: '✈️', category: 'Entry Level' },
    { label: 'A320 Type Rating', icon: '🎯', category: 'Training' },
    { label: 'Low Time Pilot', icon: '🕐', category: '0-500 hrs' },
    { label: 'Dubai Airlines', icon: '🌏', category: 'Location' },
    { label: 'Cargo Operations', icon: '📦', category: 'Sector' },
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.value = suggestion;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
        <div className="relative flex-1">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isFocused ? 'text-blue-500' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pathways, airlines, locations, or aircraft types..."
            className={`w-full pl-12 pr-4 py-4 md:py-5 border-2 rounded-xl focus:outline-none transition-all ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700/50 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
            }`}
            onChange={(e) => { setInputValue(e.target.value); onSearch(e.target.value); setShowSuggestions(e.target.value === ''); }}
            onFocus={() => { setIsFocused(true); if (inputValue === '') setShowSuggestions(true); }}
            onBlur={() => { setIsFocused(false); setTimeout(() => setShowSuggestions(false), 200); }}
          />
          {/* Quick search hints */}
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <kbd className={`px-2 py-1 rounded text-[10px] font-mono ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>⌘K</kbd>
          </div>
        </div>
        {canPostPathways && onPostPathway && (
          <button
            onClick={onPostPathway}
            className="ml-3 px-6 py-4 md:py-5 rounded-xl font-semibold text-sm transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            aria-label="Post a new pathway"
          >
            Post Pathway
          </button>
        )}
      </div>
      {/* Search helper text */}
      <p className={`mt-2 text-xs text-center transition-colors duration-200 ${isFocused ? 'opacity-100' : 'opacity-60'}`}>
        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
          Try: "Cadet Programs", "A320 Type Rating", "Low Time", or "Dubai"
        </span>
        <span className={`ml-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Press ⌘K to search</span>
      </p>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl overflow-hidden z-50 ${
            isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
          }`}
        >
          <div className="p-4">
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Trending Searches
            </p>
            <div className="space-y-1">
              {trendingSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(item.label)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                    isDarkMode 
                      ? 'hover:bg-slate-700 text-slate-200' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
);

SearchBar.displayName = 'SearchBar';

// Three-Stage Pathway Filter - fetches from Supabase hierarchy
interface GeneralCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

interface Pathway {
  id: string;
  general_category_id: string;
  name: string;
  description: string;
  display_order: number;
}

interface SubPathway {
  id: string;
  pathway_id: string;
  name: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

const CategorySelection: React.FC<{
  isDarkMode?: boolean;
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
}> = ({ isDarkMode = true, onCategorySelect, selectedCategoryId }) => {
  const [generalCategories, setGeneralCategories] = useState<GeneralCategory[]>(GENERAL_CATEGORIES);
  const [loading, setLoading] = useState(false);

  // Pre-populate with hardcoded fallback so pills render immediately
  // Supabase fetch runs in background to pick up any DB overrides
  useEffect(() => {
    let cancelled = false;
    const fetchGeneralCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('career_hierarchy_general_categories')
          .select('*')
          .order('display_order');

        if (cancelled) return;
        if (!error && data && data.length > 0) {
          const overriddenCategories = data.map(cat => ({
            ...cat,
            name: cat.name === 'Drones & Pilotless Drones' ? 'Drones & Airtaxi Pathways' : cat.name
          }));
          setGeneralCategories(overriddenCategories);
        }
        // If error or empty — silently keep the hardcoded fallback already in state
      } catch (e) {
        // silently keep hardcoded fallback
      }
    };

    fetchGeneralCategories();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-4">
      {/* General Categories - Enhanced Mobile-First Design */}
      <div className="relative">
        {/* Section Header with Tooltip */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Filter by Category
          </h3>
          <div className="group relative">
            <span className={`text-xs cursor-help rounded-full w-4 h-4 flex items-center justify-center ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>?</span>
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ${isDarkMode ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-white text-slate-600 border border-slate-200 shadow-lg'}`}>
              Select a category to filter pathways by career type
            </div>
          </div>
        </div>
        
        
        {/* Scrollable Container for Mobile */}
        <div className="relative">
          {/* Mobile Scroll Indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none md:hidden" />
          
          <div 
            className="flex flex-wrap gap-2 justify-center pb-3 px-4"
          >
            {/* "All" Button */}
            <button
              onClick={() => onCategorySelect(null)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border-2 ${
                selectedCategoryId === null
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-700'
                    : 'bg-white border-slate-300 text-slate-800 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              All Pathways
            </button>
            
            {generalCategories.length > 0 ? (
              generalCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategorySelect(category.id === selectedCategoryId ? null : category.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border-2 ${
                    selectedCategoryId === category.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : isDarkMode 
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-700'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  aria-pressed={selectedCategoryId === category.id}
                >
                  {category.name}
                </button>
              ))
            ) : (
              <div className={`text-sm py-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    Loading categories...
                  </span>
                ) : 'No categories available'}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

const ThreeStagePathwayFilter: React.FC<{
  isDarkMode?: boolean;
  pathwayCards?: PathwayData[];
  selectedGeneralCategory?: string | null;
  onNavigateToPathway?: (pathwayId: string) => void;
  onNavigate?: (page: string) => void;
}> = ({ isDarkMode = true, pathwayCards = [], selectedGeneralCategory, onNavigateToPathway, onNavigate }) => {
  const { addToast } = useToast();
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [subPathways, setSubPathways] = useState<SubPathway[]>([]);

  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [selectedSubPathway, setSelectedSubPathway] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const [expandedStage, setExpandedStage] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for carousel
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch pathways and their sub-pathways when general category is selected
  useEffect(() => {
    if (selectedGeneralCategory) {
      const fetchPathwaysAndSubPathways = async () => {
        setLoading(true);
        
        // Fetch pathways
        const { data: pathwaysData, error: pathwaysError } = await supabase
          .from('career_hierarchy_pathways')
          .select('*')
          .eq('general_category_id', selectedGeneralCategory)
          .order('display_order');
        
        if (pathwaysError) {
          console.error('Error fetching pathways:', pathwaysError);
          setLoading(false);
          return;
        }

        // Override pathway names for specific pathways
        const overriddenPathways = (pathwaysData || []).map(pathway => ({
          ...pathway,
          name: pathway.name === 'Drones & Pilotless Drones' ? 'Drones & Airtaxi Pathways' : pathway.name
        }));
        
        setPathways(overriddenPathways);
        
        // Fetch all sub-pathways for these pathways
        if (overriddenPathways && overriddenPathways.length > 0) {
          const pathwayIds = overriddenPathways.map(p => p.id);
          const { data: subPathwaysData, error: subPathwaysError } = await supabase
            .from('career_hierarchy_sub_pathways')
            .select('*')
            .in('pathway_id', pathwayIds)
            .eq('is_active', true)
            .order('display_order');
          
          if (subPathwaysError) {
            console.error('Error fetching sub-pathways:', subPathwaysError);
          } else {
            // Override sub-pathway names for specific sub-pathways
            const overriddenSubPathways = (subPathwaysData || []).map(sp => ({
              ...sp,
              name: sp.name === 'Drone pilot certification and UAV training programs' ? 'Learn More about Drones & Airtaxi Pathways' : sp.name
            }));
            setSubPathways(overriddenSubPathways);
          }
        } else {
          setSubPathways([]);
        }
        
        setLoading(false);
      };
      
      fetchPathwaysAndSubPathways();
    } else {
      setPathways([]);
      setSubPathways([]);
    }
  }, [selectedGeneralCategory]);

  // Fetch sub-pathways when pathway is selected
  useEffect(() => {
    if (selectedPathway) {
      const fetchSubPathways = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('career_hierarchy_sub_pathways')
          .select('*')
          .eq('pathway_id', selectedPathway)
          .eq('is_active', true)
          .order('display_order');
        
        if (data && !error) {
          // Override sub-pathway names for specific sub-pathways
          const overriddenSubPathways = data.map(sp => ({
            ...sp,
            name: sp.name === 'Drone pilot certification and UAV training programs' ? 'Learn More about Drones & Airtaxi Pathways' : sp.name
          }));
          setSubPathways(overriddenSubPathways);
        }
        setLoading(false);
      };
      
      fetchSubPathways();
    } else {
      setSubPathways([]);
    }
  }, [selectedPathway]);

  // Reset selectedCard when general category changes
  useEffect(() => {
    setSelectedCard(null);
  }, [selectedGeneralCategory]);

  // Reset selectedCard when pathway changes
  useEffect(() => {
    setSelectedCard(null);
  }, [selectedPathway]);

  const handlePathwayClick = (pathwayId: string) => {
    setSelectedPathway(pathwayId);
    setSelectedSubPathway(null);
    setExpandedStage(3);
  };

  const handleSubPathwayClick = (subPathwayId: string) => {
    setSelectedSubPathway(subPathwayId);
  };

  // Filter pathway cards based on selected pathway and sub-pathway
  const getFilteredPathwayCards = (pathwayId: string, subPathwayId?: string | null) => {
    
    // If a specific sub-pathway is selected, only return that card
    if (subPathwayId) {
      const selectedSubPathway = subPathways.find(sp => sp.id === subPathwayId);
      if (selectedSubPathway) {
        return [{
          id: selectedSubPathway.id,
          name: selectedSubPathway.name,
          aircraftType: selectedSubPathway.id,
          airline: 'PilotRecognition',
          description: selectedSubPathway.description || 'Training pathway for pilot certification',
          locations: selectedSubPathway.description ? [selectedSubPathway.description.substring(0, 50)] : ['Global'],
          matchProbability: 95,
          interestLevel: 'high_interest' as const,
          requirements: { totalHours: 0, typeRatings: [] },
          image: '/images/accessportal.png',
          pathwayId: pathwayId,
          category: 'cadet-programme' as const,
        }];
      }
    }
    
    // Get sub-pathways for this pathway
    const subPathwaysForPathway = subPathways.filter(sp => sp.pathway_id === pathwayId);
    const pathwayName = pathways.find(p => p.id === pathwayId)?.name || '';
    
    
    // STUDENT PILOT PATHWAY - Always create custom branded cards from sub-pathways
    
    if (pathwayName.toLowerCase().includes('student pilot') && subPathwaysForPathway.length > 0) {
      return subPathwaysForPathway.map((sp, index) => {
        // Custom branded cards for each Student Pilot sub-pathway (using actual UUIDs from database)
        const studentPilotCards: Record<string, any> = {
          // Part 61 Flight School Pathway
          'aa7e455f-5b75-44d2-be26-d2ca05a38bc7': {
            image: 'https://sp-ao.shortpixel.ai/client/to_webp,q_lossy,ret_img,w_1024,h=683/https://www.flightschoolusa.com/wp-content/uploads/2025/04/Student-pilot-1024x683.png',
            airline: 'Flight Schools',
            description: 'Flexible training schedule with certified flight instructors at local airports. Train at your own pace with personalized instruction. Flight schools offer the most flexibility for students who need to balance training with work or school. Requires minimum 40 hours flight time (20 dual, 10 solo, 5 cross-country) before checkride. Ideal for self-motivated learners who prefer a customized training approach.',
          },
          // Part 141 Flight School Pathway
          'be6b0f3f-a5dc-43a2-a2b2-88ee5328beca': {
            image: 'https://cdn.prod.website-files.com/674f1a73a4a6599b28ca801f/67b661a1f9cc1d331881e163_w221129_252.jpg',
            airline: 'Fast Track Pilot',
            description: 'Structured FAA-approved curriculum with reduced hour requirements. Accelerated training path with minimum 35 hours before checkride. Fast track pilot programs follow a standardized syllabus approved by the FAA, ensuring consistent quality and faster completion times. Often includes VA benefits, GI Bill acceptance, and structured ground school. Best for students seeking a fast-track path to their pilot certificate with professional instruction.',
          },
          // University Aviation Program Pathway
          'f77fc867-9ed8-4e7e-a056-45448094e99c': {
            image: 'https://admissions.purdue.edu/wp-content/uploads/2025/05/brittany-gallarneau-flight-meet-our-student-1-e1747927121360.jpg',
            airline: 'University Bachelor\'s Programs',
            description: 'Degree + pilot training combined with financial aid options. Earn a bachelor\'s degree in aviation while completing flight training. Programs integrate ground school, simulator training, and flight hours into your curriculum. Access to university facilities, experienced instructors, and networking opportunities. Financial aid, scholarships, and federal student loans available. Graduates often have advantage with airline hiring and may qualify for reduced ATP requirements (1,250 hours instead of 1,500).',
          },
          // Military Flight Training Pathway
          '81753376-b823-4909-b82f-664acab13dae': {
            image: 'https://i.ytimg.com/vi/ODfVdiFzzWM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDulvfhff1geQO2SuBxWbh9lWjA8A',
            airline: 'Military Training',
            description: 'Service commitment with world-class training and full sponsorship. Join the Air Force, Navy, Army, or Marine Corps for comprehensive flight training at no cost. Receive top-tier instruction, advanced aircraft experience, and guaranteed employment. Requires service commitment (typically 8-10 years after pilot training). Offers competitive salary, benefits, and transition to commercial airlines. Highly competitive selection process requiring physical fitness, academic excellence, and leadership potential.',
          },
                  };
        
        const branded = studentPilotCards[sp.id] || {};
        
        const card = {
          id: sp.id,
          name: branded.airline || sp.name,
          aircraftType: sp.id,
          airline: branded.airline || 'PilotRecognition',
          description: branded.description || sp.description || 'Training pathway for pilot certification',
          locations: ['USA', 'Global'],
          matchProbability: 80 + (index * 3),
          interestLevel: 'high_interest' as const,
          requirements: { totalHours: 0, typeRatings: [] },
          image: branded.image || '/images/accessportal.png',
          pathwayId: pathwayId,
          category: 'cadet-programme' as const,
        };
        return card;
      });
    }
    
    // PRIVATE PILOT PATHWAY - Custom branded cards for specific sub-pathways
    if (pathwayName.toLowerCase().includes('private pilot') && subPathwaysForPathway.length > 0) {
      return subPathwaysForPathway.map((sp, index) => {
        // Custom branded cards for Private Pilot sub-pathways
        const privatePilotCards: Record<string, any> = {
          // Sport Pilot Transition Pathway
          'd36018dd-a116-4925-83ca-6acb414f4020': {
            image: 'https://robbreport.com/wp-content/uploads/2018/08/magnusfusion3.jpg?w=1000',
            airline: 'Sport Pilot Transition',
            description: 'Transition from Sport Pilot to Private Pilot license with additional training. Build on your sport pilot experience to gain more privileges and capabilities. Requires additional flight hours, cross-country training, and instrument training. Ideal pathway for sport pilots looking to advance their career and access more aircraft types.',
          },
          // Recreational Flight
          'de8a9cfd-34bd-47f2-bd5a-9afd6c96e1c5': {
            image: 'https://cdn.prod.website-files.com/65407649ec08542fb947ad21/65ebe0a864d82a05893f0cc4_SFC-self-paced-courses-24.jpg',
            airline: 'Recreational Flight',
            description: 'Flexible online ground school courses completed at your own pace. Study theory, regulations, and procedures from anywhere with 24/7 access. Perfect for busy pilots who need to balance training with work or personal commitments. Comprehensive curriculum covering all required knowledge areas for pilot certification.',
          },
          // Glass Cockpit Training
          '2acbf9f0-27cc-4094-9943-420572483c1e': {
            image: 'https://media.pea.com/wp-content/uploads/2023/06/altfull-view-of-G1000-Avionics-of-Cessna-172-1024x607.jpeg',
            airline: 'Glass Cockpit Training',
            description: 'Master modern avionics with hands-on Garmin G1000 training. Learn to operate glass cockpit systems, electronic flight displays, and advanced navigation technology. Essential for pilots transitioning from analog to glass panels. Includes simulator training and practical flight experience with G1000-equipped aircraft.',
          },
          // Aviation Career Path
          'adfdacf6-211b-45b5-b62c-3b4af9757c58': {
            image: 'https://calaero.edu/wp-content/uploads/2019/07/Decision-to-Pursue-Aviation-as-a-Career.jpg',
            airline: 'Aviation Career Path',
            description: 'Comprehensive career guidance and planning for aspiring pilots. Explore various aviation career paths, from commercial airlines to corporate aviation, cargo, and specialized roles. Includes mentorship programs, career counseling, and networking opportunities with industry professionals. Perfect for pilots deciding on their career trajectory or looking to transition to new aviation sectors.',
          },
          // Hour Building Pathway
          '7911f9f9-c2da-4732-b9da-8108ffefc416': {
            image: 'https://media.licdn.com/dms/image/v2/D5622AQFSILh9w9HLsQ/feedshare-shrink_800/B56ZXH7hVbGQAg-/0/1742816026128?e=2147483647&v=beta&t=YeKF6O4f6g3E8mLcYElFfK8XcsqaMsspvYC0hUHnN9k',
            airline: 'Hour Building',
            description: 'Build flight hours efficiently through structured hour building programs. Gain the required flight time for advanced ratings and airline qualifications. Options include ferry flights, instruction time, charter operations, and cross-country flying. Cost-effective strategies for accumulating hours while gaining valuable experience in diverse flying conditions and aircraft types.',
          },
          // Discover Experimental Flight
          'c43cf6ac-c644-4b38-9c51-84d784051037': {
            image: 'https://www.quicksilveraircraft.com/images/SPORT%202S/galeria/j-lawrence-foto-2012-1173.jpg',
            airline: 'Discover Experimental Flight',
            description: 'Explore experimental and amateur-built aircraft for unique flying experiences. Learn about kit aircraft, homebuilt planes, and experimental aviation regulations. Perfect for pilots interested in building their own aircraft or flying innovative designs. Offers hands-on construction experience and access to cutting-edge aviation technology.',
          },
          // Light Sport Aircraft Training
          '39ec2271-baa1-441e-878f-958440c8678d': {
            image: 'https://tecnam.com/wp-content/uploads/2025/06/GM1A8946-scaled-1.jpg',
            airline: 'Light Sport Aircraft Training',
            description: 'Train on modern light sport aircraft with simplified certification requirements. LSA training offers faster, more affordable path to pilot certification with lower medical standards and reduced training hours. Ideal for recreational pilots and those seeking efficient entry into aviation. Features modern aircraft like Tecnam with advanced avionics and excellent performance characteristics.',
          },
          // Instrument Rating Pathway
          'cc996aa7-a075-4be7-beef-f917dd1f41db': {
            image: 'https://i.ytimg.com/vi/ApAGDJGhSag/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCEJ3oeB8h0vSy8q8KxGx-OWp1f-A',
            airline: 'Instrument Rating',
            description: 'Earn your Instrument Rating to fly in all weather conditions and airspace. Master instrument flight rules (IFR), navigation, and approach procedures. Essential for professional pilots and those seeking expanded flying capabilities. Includes simulator training, real-world IFR experience, and preparation for the instrument knowledge and practical tests. Opens doors to airline careers and advanced ratings.',
          },
          // Multi-Engine Training
          'c739dab5-33e5-4315-80d9-6e960f49387f': {
            image: 'https://thumbs.dreamstime.com/b/cessna-caravan-14103370.jpg',
            airline: 'Multi-Engine Training',
            description: 'Transition to multi-engine aircraft and earn your multi-engine rating. Learn complex aircraft systems, engine-out procedures, and multi-engine operations. Essential for airline and corporate aviation careers. Includes training on turboprop and piston twins, performance planning, and emergency procedures. Gain experience with aircraft like Cessna Caravan and Beechcraft Baron.',
          },
        };
        
        const branded = privatePilotCards[sp.id] || {};
        
        const card = {
          id: sp.id,
          name: branded.airline || sp.name,
          aircraftType: sp.id,
          airline: branded.airline || 'PilotRecognition',
          description: branded.description || sp.description || 'Training pathway for pilot certification',
          locations: ['USA', 'Global'],
          matchProbability: 80 + (index * 3),
          interestLevel: 'high_interest' as const,
          requirements: { totalHours: 0, typeRatings: [] },
          image: branded.image || '/images/accessportal.png',
          pathwayId: pathwayId,
          category: 'private' as const,
        };
        return card;
      });
    }
    
    // COMMERCIAL PILOT PATHWAY - Custom branded cards for specific sub-pathways
    if (pathwayName.toLowerCase().includes('commercial pilot') && subPathwaysForPathway.length > 0) {
      
      // Add static Cadet Programmes card
      const cadetProgrammesCard = {
        id: 'cadet-programmes-commercial',
        name: 'Cadet Programmes',
        aircraftType: 'cadet-programmes-commercial',
        airline: 'Cadet Programmes',
        description: 'Sponsored airline training programs with guaranteed employment. Full or partial training sponsorship with partner airlines. Includes structured flight training, ground school, and mentorship. Direct pathway to first officer positions with major airlines. Competitive selection process with medical and age requirements. Ideal for aspiring airline pilots seeking structured career progression.',
        locations: ['Global'],
        matchProbability: 95,
        interestLevel: 'high_interest' as const,
        requirements: { totalHours: 0, typeRatings: [] },
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg',
        pathwayId: pathwayId,
        category: 'airline-pathways' as const,
      };
      
      const subPathwayCards = subPathwaysForPathway.map((sp, index) => {
        // Custom branded cards for Commercial Pilot sub-pathways
        const commercialPilotCards: Record<string, any> = {
          // Multi-Engine Rating Pathway
          '39ec2271-baa1-441e-878f-958440c8678d': {
            image: 'https://tecnam.com/wp-content/uploads/2025/06/GM1A8946-scaled-1.jpg',
            airline: 'Multi-Engine Rating',
            description: 'Earn your multi-engine rating to fly complex aircraft with multiple engines. Master engine-out procedures, asymmetric thrust management, and multi-engine performance planning. Essential for airline and corporate aviation careers. Includes training on twin-engine aircraft with advanced avionics systems.',
          },
          // Instrument Rating Pathway
          'cc996aa7-a075-4be7-beef-f917dd1f41db': {
            image: 'https://i.ytimg.com/vi/ApAGDJGhSag/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCEJ3oeB8h0vSy8q8KxGx-OWp1f-A',
            airline: 'Instrument Rating',
            description: 'Earn your Instrument Rating to fly in all weather conditions and airspace. Master instrument flight rules (IFR), navigation, and approach procedures. Essential for professional pilots and those seeking expanded flying capabilities. Includes simulator training, real-world IFR experience, and preparation for the instrument knowledge and practical tests.',
          },
          // Commercial Single-Engine Pathway
          'c739dab5-33e5-4315-80d9-6e960f49387f': {
            image: 'https://thumbs.dreamstime.com/b/cessna-caravan-14103370.jpg',
            airline: 'Commercial Single-Engine',
            description: 'Obtain your Commercial Pilot License for single-engine aircraft. Learn advanced maneuvers, complex aircraft operations, and commercial flight regulations. Required for paid pilot operations including charter, instruction, and aerial work. Includes intensive training on performance planning, weight and balance, and emergency procedures.',
          },
          // Commercial Multi-Engine Pathway
          '427408e8-62d6-42b0-a8bb-a7419868aed2': {
            image: 'https://www.centralflighttraining.com/wp-content/uploads/2011/05/DSC_8552a-1.jpg',
            airline: 'Commercial Multi-Engine',
            description: 'Earn your Commercial Pilot License for multi-engine aircraft. Master complex multi-engine operations, turbine systems, and high-performance aircraft. Essential for airline pathway and corporate aviation careers. Includes training on turboprop aircraft like Cessna Caravan and regional jet preparation.',
          },
          // ATPL Pathway
          '56ffd7d4-a281-4cc6-9b6f-45d949846d73': {
            image: 'https://www.wingpath.in/blog_images/what-is-atpl-in-india-6ihgy-1000x700.png',
            airline: 'ATPL Pathway',
            description: 'Build flight hours to meet Airline Transport Pilot requirements. Track progress toward 1,500 hours with structured hour building programs. Options include flight instruction, charter operations, ferry flights, and regional airline experience. Essential for airline career advancement and command opportunities.',
          },
        };
        
        const branded = commercialPilotCards[sp.id] || {};
        
        const card = {
          id: sp.id,
          name: branded.airline || sp.name,
          aircraftType: sp.id,
          airline: branded.airline || 'PilotRecognition',
          description: branded.description || sp.description || 'Training pathway for pilot certification',
          locations: ['USA', 'Global'],
          matchProbability: 80 + (index * 3),
          interestLevel: 'high_interest' as const,
          requirements: { totalHours: 0, typeRatings: [] },
          image: branded.image || '/images/accessportal.png',
          pathwayId: pathwayId,
          category: 'airline-pathways' as const,
        };
        return card;
      });
      
      // Combine cadet programmes card with subpathway cards
      return [cadetProgrammesCard, ...subPathwayCards];
    }
    
    // LICENSURE & TYPE RATING CENTERS PATHWAY - Custom branded cards for specific sub-pathways
    if (pathwayName.toLowerCase().includes('licensure') || pathwayName.toLowerCase().includes('type rating')) {
      
      return subPathwaysForPathway.map((sp, index) => {
        // Custom branded cards for Licensure & Type Rating Centers sub-pathways
        const licensureCards: Record<string, any> = {
          // Type Rating Centers
          'a02f4e29-e165-415f-a3b3-669edbd7deb1': {
            image: 'https://www.caepacific.com/wp-content/uploads/2021/03/CAE-Philippines-Training-Center.jpg',
            airline: 'Type Rating Centers',
            description: 'World-class type rating training centers. Comprehensive training programs for Airbus and Boeing aircraft types. State-of-the-art simulators and experienced instructors. Offers type ratings for A320, B737, A330, B777, and more. Direct pathway to airline careers with recognized certifications.',
          },
          // Instrument Rating Pathway
          'cc996aa7-a075-4be7-beef-f917dd1f41db': {
            image: 'https://i.ytimg.com/vi/ApAGDJGhSag/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCEJ3oeB8h0vSy8q8KxGx-OWp1f-A',
            airline: 'Instrument Rating',
            description: 'Earn your Instrument Rating to fly in all weather conditions and airspace. Master instrument flight rules (IFR), navigation, and approach procedures. Essential for professional pilots and those seeking expanded flying capabilities. Includes simulator training, real-world IFR experience, and preparation for the instrument knowledge and practical tests.',
          },
          // ATPL Pathway
          '54655935-92de-4aad-b82b-703152ffce25': {
            image: 'https://www.wingpath.in/blog_images/what-is-atpl-in-india-6ihgy-1000x700.png',
            airline: 'ATPL Pathway',
            description: 'Build flight hours to meet Airline Transport Pilot requirements. Track progress toward 1,500 hours with structured hour building programs. Options include flight instruction, charter operations, ferry flights, and regional airline experience. Essential for airline career advancement and command opportunities.',
          },
          // Seaplane Rating Pathway
          'c89c9f97-b3f6-4955-9c34-3ae266a6ffc8': {
            image: 'https://images.unsplash.com/photo-1507199129876-44d2b3190c1a?w=800&q=80',
            airline: 'Seaplane Rating',
            description: 'Add a seaplane rating to your pilot certificate. Learn water operations, seaplane handling, and amphibious aircraft procedures. Master takeoff and landing on water, floatplane operations, and seaplane-specific emergency procedures. Opens up new flying opportunities in remote locations and scenic destinations.',
          },
          // Multi Engine Rating Pathway
          'e94ba893-fa83-47b1-90f9-98905dc6685a': {
            image: 'https://thumbs.dreamstime.com/b/cessna-caravan-14103370.jpg',
            airline: 'Multi-Engine Rating',
            description: 'Earn your multi-engine rating to fly complex aircraft with multiple engines. Master engine-out procedures, asymmetric thrust management, and multi-engine performance planning. Essential for airline and corporate aviation careers. Includes training on twin-engine aircraft with advanced avionics systems.',
          },
          // UPRT Rating Pathway
          '078eea1a-271f-4392-a802-9a2ea4c36da0': {
            image: 'https://www.flight-safety.com/wp-content/uploads/2021/06/uprt-training.jpg',
            airline: 'UPRT Rating',
            description: 'Upset Prevention and Recovery Training. Learn to recognize and recover from aircraft upsets and unusual attitudes. Essential for airline pilot certification and safety. Includes both theoretical and practical training in upset scenarios. Required for many airline training programs and improves overall flight safety awareness.',
          },
          // CFI Rating Pathway
          '4d4b6568-3759-432e-9193-e0dba88425aa': {
            image: 'https://media.pea.com/wp-content/uploads/2023/06/flight-instructor-training-1024x607.jpeg',
            airline: 'CFI Rating',
            description: 'Certified Flight Instructor rating. Teach others to fly and build valuable flight hours. Learn instructional techniques, student evaluation, and flight training standards. Essential for career advancement and hour building. Includes training for CFI, CFII, and MEI ratings. Opens doors to teaching opportunities and accelerates career progression toward airline positions.',
          },
        };
        
        const branded = licensureCards[sp.id] || {};
        
        const card = {
          id: sp.id,
          name: branded.airline || sp.name,
          aircraftType: sp.id,
          airline: branded.airline || 'PilotRecognition',
          description: branded.description || sp.description || 'Training pathway for pilot certification',
          locations: ['USA', 'Global'],
          matchProbability: 85 + (index * 2),
          interestLevel: 'high_interest' as const,
          requirements: { totalHours: 0, typeRatings: [] },
          image: branded.image || '/images/accessportal.png',
          pathwayId: pathwayId,
          category: 'type-rating' as const,
        };
        return card;
      });
    }

    // CADET PATHWAYS PATHWAY - Custom branded cards for specific sub-pathways
    if (pathwayName.toLowerCase().includes('cadet')) {
      
      return subPathwaysForPathway.map((sp, index) => {
        // Custom branded cards for Cadet Pathways sub-pathways
        const cadetCards: Record<string, any> = {
          // Envoy Air Cadet Program
          'ad478411-9367-4cf4-9d81-8c08ff62320c': {
            image: 'https://www.envoyair.com/wp-content/uploads/2024/03/IMG_CadetProgram_MeganSnow.jpg',
            airline: 'Envoy Air Cadet Program',
            description: 'American Airlines Group cadet program with guaranteed FO position. Financial assistance available with tuition reimbursement. Flow-through to American Airlines with Embraer fleet. Requires 40+ hours, CPL, Class 1 Medical, US citizenship or permanent residency.',
          },
          // Air Cambodia Cadet Programme
          'fe2d9b27-4290-463e-b88a-9bdbddd8330e': {
            image: 'https://s28477.pcdn.co/wp-content/uploads/2024/10/CAngkor_1-984x554.png',
            airline: 'Air Cambodia Cadet Programme',
            description: 'Sponsored training with A320 type rating and guaranteed job. Monthly stipend of $2,000 during training. Located in Phnom Penh, Cambodia. Age 18-35, high school diploma, and Medical 1 required. Direct pathway to airline career with guaranteed employment.',
          },
          // Cebu Pacific Cadet Pilot Program
          'c6ad6407-cfce-42a2-961f-4c98fabff31b': {
            image: 'https://images.jgsummit.com.ph/2021/12/15/0f999ad31e634dc5a90ad0d350cbe86ddfc4eca3.jpg',
            airline: 'Cebu Pacific Cadet Pilot Program',
            description: 'Full training sponsorship with A320 fleet. Manila-based with Philippine network coverage. Age 18-35, college graduate, Class 1 medical, Filipino citizen required. Low-cost leader with excellent career progression opportunities within the airline.',
          },
          // Qantas Cadet Pilot Programme
          '9b751720-bcce-4d47-974a-19c6a4206a92': {
            image: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Qantas.svg/1200px-Qantas.svg.png',
            airline: 'Qantas Cadet Pilot Programme',
            description: 'World-class cadet program with full sponsorship. Training on Airbus and Boeing fleets. Australia-based with global opportunities. Australian citizen or permanent resident required. Excellent career progression with Asia-Pacifics leading airline.',
          },
          // Cathay Pacific Cadet Programme
          '887eddf3-e65a-4d7a-a15f-dc9d3ef2a73a': {
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg',
            airline: 'Cathay Pacific Cadet Programme',
            description: 'Full sponsorship cadet program with A350/B777 training. Monthly stipend of HKD 5,000 during training. All training costs covered. HK permanent residency required. Age 18-40. Direct entry to Cathay Pacific with definite return to Hong Kong.',
          },
          // FlyDubai Cadet Programme
          'c0a22135-7845-4b28-a9ec-79ac75861a5c': {
            image: 'https://cdn.uc.assets.prezly.com/5f1fd10f-a9bc-4bf0-aa29-b9a26dc42407/-/crop/1952x1066/0,272/-/preview/-/resize/1108x/-/quality/best/-/format/auto/',
            airline: 'FlyDubai Cadet Programme',
            description: 'Full training sponsorship with B737 MAX fleet. Competitive salary after training. Dubai-based with career progression opportunities. Age 18-30, high school diploma required. UAE resident or eligible candidates preferred.',
          },
          // Ryanair Future Flyer Program
          '120e4ce7-3913-4034-9c60-f744c3bacb26': {
            image: 'https://cdn.aviationa2z.com/wp-content/uploads/2024/01/image-25-1024x683.png',
            airline: 'Ryanair Future Flyer Program',
            description: 'Self-funded training with fast upgrade on B737 fleet. Europes largest low-cost airline with 500+ aircraft. EU passport required. 250 hours and B737 type rating needed. Rolling intake with excellent career progression.',
          },
          // Air Arabia Cadet Program
          '6f815347-9f68-4c6c-942c-bcaffa2da6f9': {
            image: 'https://ifa2.vpcstechnology.com/wp-content/uploads/2020/06/Air-Arabia-Cadet-Pilot-Program.jpg',
            airline: 'Air Arabia Cadet Program',
            description: 'Full sponsorship with A320 fleet and GCC network. Monthly salary during training. Sharjah-based with various GCC bases. Age 18-30, high school diploma, Class 1 medical required. Career progression opportunities within the airline.',
          },
          // Singapore Airlines Cadet Program
          'b36e0435-70c1-4d61-b0f6-28a815bb1d85': {
            image: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/2b/Singapore_Airlines_logo.svg/1200px-Singapore_Airlines_logo.svg.png',
            airline: 'Singapore Airlines Cadet Program',
            description: 'World-class cadet program with full sponsorship. Training on Airbus and Boeing fleets. Singapore-based with global opportunities. Singapore citizen or permanent resident required. Excellent career progression with Asia-Pacifics leading airline.',
          },
          // Airline-Sponsored Cadet Pathway
          'a8270b67-4171-4a47-9ef4-ed9304f18478': {
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
            airline: 'Airline-Sponsored Cadet Pathway',
            description: 'Airline-sponsored training programs with guaranteed employment. Full or partial training sponsorship with partner airlines. Includes structured flight training, ground school, and mentorship. Direct pathway to first officer positions with major airlines. Competitive selection process with medical and age requirements.',
          },
          // Government-Funded Cadet Pathway
          '7072bf71-b488-4e97-999d-a32ebec81ab3': {
            image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
            airline: 'Government-Funded Cadet Pathway',
            description: 'Government-sponsored training programs for aspiring pilots. Full or partial funding from government aviation initiatives. Includes structured flight training, ground school, and mentorship. Direct pathway to national airline positions. Competitive selection process with nationality and medical requirements.',
          },
          // Academy-Based Cadet Pathway
          '67a8a0b5-d793-4284-aa87-9da3ebc84882': {
            image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
            airline: 'Academy-Based Cadet Pathway',
            description: 'Flight academy-based training programs with structured curriculum. Professional flight training schools with experienced instructors. Includes comprehensive ground school, simulator training, and flight instruction. Direct pathway to airline careers through academy partnerships. High-quality training with industry-standard equipment.',
          },
          // Ab-Initio Cadet Pathway
          '6e6fad3e-53a4-473f-816e-a924fc494bec': {
            image: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
            airline: 'Ab-Initio Cadet Pathway',
            description: 'Zero-to-hero training programs for aspiring pilots with no prior experience. Complete training from private pilot to commercial pilot license. Includes ground school, flight training, and type ratings. Ideal for students starting their aviation career from scratch. Comprehensive training with airline career progression.',
          },
          // International Cadet Pathway
          '850fd8d1-83c2-4cce-8704-fb779e57ee5c': {
            image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
            airline: 'International Cadet Pathway',
            description: 'International training programs with global airline partnerships. Multi-country training opportunities with diverse fleet experience. Includes international licensing, language training, and cross-cultural preparation. Direct pathway to global airline careers. Ideal for pilots seeking international opportunities and global network exposure.',
          },
          // Etihad Airways Cadet Programme
          '9a527b17-59ae-4caa-afe3-ba8fdd833301': {
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/etihad-airways-new.jpg',
            airline: 'Etihad Airways Cadet Programme',
            description: 'Full sponsorship cadet program with Airbus and Boeing training. Abu Dhabi-based with global network. Comprehensive training with excellent career progression. UAE national or eligible candidates preferred. Age 18-30 requirements.',
          },
          // Lufthansa Cadet Pilot Programme
          '35eb4303-9b70-48ba-b8e0-7d32d247f143': {
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/lufthansa.jpg',
            airline: 'Lufthansa Cadet Pilot Programme',
            description: 'Germanys premier cadet program with full sponsorship. Training on Airbus and Boeing fleets. Based in Germany with European opportunities. German language proficiency required. Excellent career progression within Lufthansa Group.',
          },
          // British Airways Cadet Programme
          '493a5527-ebe0-43af-a169-ea76e469c852': {
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/british-airways.jpg',
            airline: 'British Airways Cadet Programme',
            description: 'UKs flagship cadet program with full sponsorship. Training on Airbus and Boeing fleets. Heathrow-based with global opportunities. UK citizen or right to work required. World-class training with excellent career progression.',
          },
          // Jetstar Cadet Pilot Programme
          'f4d2a35e-ca41-435a-8cba-cf97d95ba2ff': {
            image: 'https://cdn.cabincrewwings.com/wp-content/uploads/2019/04/jetstar.jpg',
            airline: 'Jetstar Cadet Pilot Programme',
            description: 'Qantas Group cadet program with A320 fleet. Melbourne-based with various Australian bases. Training sponsorship available. Age 18-30, high school diploma, Class 1 medical, Australian citizen or permanent resident required. Qantas Group airline with Asia-Pacific network.',
          },
          // SkyWest Pilot Pathway Program
          '78024e77-15db-43ec-bbf8-f7f6c069beec': {
            image: 'https://www.thrustflight.com/wp-content/uploads/2022/11/skywest-airlines-2-768x512.jpg',
            airline: 'SkyWest Pilot Pathway Program',
            description: 'Major airline flow program with E175/CRJ fleet. Financial assistance and guaranteed FO position. Salt Lake City-based with various bases. Private Pilot License required. US citizen or permanent resident. Flow-through to major airlines with tuition reimbursement.',
          },
          // JetBlue Gateway Program
          'c94254e7-1b7c-4945-b66d-6829e0e4ee87': {
            image: 'https://sanpedrosun.s3.us-west-1.amazonaws.com/wp-content/uploads/2023/12/09170529/Belizean-pilot-flies-JetBlues-inaugural-flight-to-Belize-3-657x438.jpg',
            airline: 'JetBlue Gateway Program',
            description: 'Direct-to-airline pathway with A320/A220 fleet. New York-based with various bases. High school graduate, age 18+, US citizen or permanent resident, Class 1 medical required. Direct-to-airline program with East Coast network opportunities.',
          },
          // Emirates Cadet Pilot Programme
          '778f6c91-7b34-4bd0-8354-2af631f6373c': {
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png',
            airline: 'Emirates Cadet Pilot Programme',
            description: 'Full training sponsorship with A380/A350 fleet. Dubai-based with global network. Age 18-28, high school diploma, UAE national or resident, ICAO Level 4 required. 5-star airline with global opportunities. Comprehensive training with excellent career progression.',
          },
          // easyJet Cadet Pilot Programme
          '7c511727-576c-4469-b074-0830c9bd6662': {
            image: 'https://www.cae.com/content/images/civil-aviation/_webp/easyJet_crew_.jpg_webp_40cd750bba9870f18aada2478b24840a.webp',
            airline: 'easyJet Cadet Pilot Programme',
            description: 'Training sponsorship with A320 fleet. London-based with various European bases. Age 18-30, high school diploma, Class 1 medical, EU passport or work permit required. European low-cost leader with growing network. Excellent career progression.',
          },
          // Wizz Air Cadet Pilot Programme
          'dd73bae1-3053-4643-bcb0-04db085f986b': {
            image: 'https://betteraviationjobs.com/storage/2019/11/Wizz-Air-Airbus-A321neo.jpg',
            airline: 'Wizz Air Cadet Pilot Programme',
            description: 'Training sponsorship with A321neo fleet. Budapest-based with various European bases. Age 18-30, high school diploma, Class 1 medical, EU passport or work permit required. European low-cost carrier with growing network. Career progression opportunities.',
          },
          // Air India Cadet Pilot Programme
          '5be245c1-2cd2-42e0-8dd4-828424df939f': {
            image: 'https://blog.topcrewaviation.com/wp-content/uploads/2024/04/Air-India-A350.jpg',
            airline: 'Air India Cadet Pilot Programme',
            description: 'Full training sponsorship with A350/B787 fleet. New Delhi-based with various Indian bases. Age 18-30, 12th grade or equivalent, Class 1 medical, Indian citizen required. Tata Group airline with global network. Comprehensive training with excellent career progression.',
          },
          // SpiceJet Cadet Pilot Programme
          'cd30235c-521e-47bd-aa15-7e26877529d3': {
            image: 'https://airinsight.com/wp-content/uploads/2019/04/SpiceJetMAX.jpg',
            airline: 'SpiceJet Cadet Pilot Programme',
            description: 'Training sponsorship with B737 fleet. Gurugram-based with various Indian bases. Age 18-30, 12th grade or equivalent, Class 1 medical, Indian citizen required. Indian low-cost carrier with growing network. Career progression opportunities within the airline.',
          },
          // Royal Brunei Cadet Pilot Programme
          'ab9de5c3-c94b-4784-b630-7d4b6cf82144': {
            image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
            airline: 'Royal Brunei Cadet Pilot Programme',
            description: 'Full training sponsorship program. Bandar Seri Begawan-based with Southeast Asian network. Comprehensive training with excellent career progression. Brunei national or eligible candidates preferred. Direct pathway to airline career with guaranteed employment.',
          },
          // Philippine Airlines Cadet Pilot Programme
          '2f9f92d7-f95d-4503-9b83-3a80d9fc8926': {
            image: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Philippine_Airlines_logo.svg/1200px-Philippine_Airlines_logo.svg.png',
            airline: 'Philippine Airlines Cadet Pilot Programme',
            description: 'Full sponsorship with Airbus and Boeing fleet. Manila-based with global network. Filipino citizen or permanent resident required. Age requirements apply. Philippines flag carrier with excellent career progression. Comprehensive training program with guaranteed employment.',
          },
        };
        
        const branded = cadetCards[sp.id] || {};
        
        const card = {
          id: sp.id,
          name: branded.airline || sp.name,
          aircraftType: sp.id,
          airline: branded.airline || 'PilotRecognition',
          description: branded.description || sp.description || 'Airline-sponsored cadet training program',
          locations: ['USA', 'Global'],
          matchProbability: 90 + (index * 1),
          interestLevel: 'high_interest' as const,
          requirements: { totalHours: 0, typeRatings: [] },
          image: branded.image || '/images/accessportal.png',
          pathwayId: pathwayId,
          category: 'cadet-programme' as const,
        };
        return card;
      });
    }

    // DRONES & PILOTLESS DRONES PATHWAY - Custom branded cards for specific sub-pathways
    if (pathwayName.toLowerCase().includes('drone') || pathwayName.toLowerCase().includes('pilotless')) {
      
      return subPathwaysForPathway.map((sp, index) => {
        // Custom branded cards for Drones & Pilotless Drones sub-pathways
        const droneCards: Record<string, any> = {
          // Joby Aviation Pilot
          '4594f1c1-4efb-4c1b-88ca-498642886e12': {
            image: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
            airline: 'Joby Aviation Pilot',
            description: 'eVTOL leader with electric aviation technology. Santa Cruz-based with global opportunities. Requires 1,500+ hours TT, helicopter rating, test pilot experience. Stock options and competitive salary. Leading the future of urban air mobility with innovative electric aircraft.',
          },
          // Archer Aviation Pilot
          'bc266023-13ad-421d-aa16-198596c89834': {
            image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
            airline: 'Archer Aviation Pilot',
            description: 'Midnight aircraft with urban air mobility focus. San Jose-based with various locations. Requires 1,200+ hours TT, fixed wing experience, instrument rating. Competitive pay and career progression. Electric aviation innovator transforming regional transportation.',
          },
          // Lilium Jet Pilot
          'b9ae809c-18e5-4ccf-a3c5-c08a910bf379': {
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
            airline: 'Lilium Jet Pilot',
            description: 'Electric jet pioneer with regional air mobility. Munich-based with global opportunities. Requires 1,000+ hours TT, EASA license, type rating preferred. Innovative technology with electric jet propulsion. Leading the way in sustainable aviation.',
          },
          // Drone Test Pilot
          '143fff6f-3a63-4555-9046-6fa0441bbb79': {
            image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
            airline: 'Drone Test Pilot',
            description: 'UAV operations with autonomous systems testing. Global opportunities with various companies. Requires 500+ hours TT, UAV certificate, technical background. Growing field in autonomous systems and testing. Emerging technology with excellent career prospects.',
          },
        };
        
        const branded = droneCards[sp.id] || {};
        
        const card = {
          id: sp.id,
          name: branded.airline || sp.name,
          aircraftType: sp.id,
          airline: branded.airline || 'PilotRecognition',
          description: branded.description || sp.description || 'Drone or UAV pilot training program',
          locations: ['USA', 'Global'],
          matchProbability: 85 + (index * 2),
          interestLevel: 'high_interest' as const,
          requirements: { totalHours: 0, typeRatings: [] },
          image: branded.image || '/images/accessportal.png',
          pathwayId: pathwayId,
          category: 'airtaxi-drones' as const,
        };
        return card;
      });
    }

    // PRIVATE SECTOR PATHWAYS - Custom branded cards for specific sub-pathways
    if (pathwayName.toLowerCase().includes('private sector')) {
      
      return subPathwaysForPathway.map((sp, index) => {
        // Custom branded cards for Private Sector Pathways sub-pathways
        const privateSectorCards: Record<string, any> = {
          // NetJets Pilot Career
          'c37fd15d-cf54-415b-9b7d-6811b12c20d8': {
            image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
            airline: 'NetJets Pilot Career',
            description: 'Fractional ownership airline with home basing. Columbus-based with global operations. Requires 2,500+ hours TT, type rating, Part 135 experience. Premium benefits and largest fleet. Leading private aviation company with stock options and competitive salary.',
          },
          // VistaJet Captain
          '00188380-9854-47b5-b314-641659839a8e': {
            image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
            airline: 'VistaJet Captain',
            description: 'Private charter company with worldwide operations. Malta-based with global bases. Requires 3,500+ hours TT, heavy jet type, VIP experience. Silver service and tax-free options. Premium private aviation leader with excellent benefits and career progression.',
          },
        };
        
        const branded = privateSectorCards[sp.id] || {};
        
        const card = {
          id: sp.id,
          name: branded.airline || sp.name,
          aircraftType: sp.id,
          airline: branded.airline || 'PilotRecognition',
          description: branded.description || sp.description || 'Private sector aviation career',
          locations: ['USA', 'Global'],
          matchProbability: 90 + (index * 1),
          interestLevel: 'high_interest' as const,
          requirements: { totalHours: 0, typeRatings: [] },
          image: branded.image || '/images/accessportal.png',
          pathwayId: pathwayId,
          category: 'privateSector' as const,
        };
        return card;
      });
    }
    
    // Check if there are pre-defined cards for OTHER pathways (not Student Pilot)
    const pathwaySpecificCards = pathwayCards.filter(card => card.pathwayId === pathwayId);
    
    if (pathwaySpecificCards.length > 0) {
      // Ensure PilotRecognition card is first if it exists
      const wingMentorCard = pathwaySpecificCards.find(card => card.aircraftType === '__wingmentor__');
      const otherCards = pathwaySpecificCards.filter(card => card.aircraftType !== '__wingmentor__');
      
      if (wingMentorCard) {
        return [wingMentorCard, ...otherCards];
      }
      return pathwaySpecificCards;
    }
    
    // Default cards for other pathways from sub-pathways
    if (subPathwaysForPathway.length > 0) {
      return subPathwaysForPathway.map((sp, index) => ({
        id: sp.id,
        name: sp.name,
        aircraftType: sp.id,
        airline: 'PilotRecognition',
        description: sp.description || 'Training pathway for pilot certification',
        locations: sp.description ? [sp.description.substring(0, 50)] : ['Global'],
        matchProbability: 85 + (index % 10),
        interestLevel: 'high_interest' as const,
        requirements: { totalHours: 0, typeRatings: [] },
        image: '/images/accessportal.png',
        pathwayId: pathwayId,
        category: 'cadet-programme' as const,
      }));
    }
    
    // Fallback: return EMPTY array instead of all cards to avoid showing wrong cards
    return [];
  };

  return (
    <div className="space-y-4">
      {/* Stage 2: Pathways as infinite scroll rows */}
      {selectedGeneralCategory && (
        <div className="space-y-8 w-screen relative left-1/2 -translate-x-1/2">
          {pathways.map((pathway) => {
            const cards = getFilteredPathwayCards(pathway.id, selectedSubPathway);
            
            // Add PilotRecognition introduction card at the start
            const wingMentorIntroCard = {
              id: `wingmentor-${pathway.id}`,
              name: (pathway.id === '05da1618-8398-4199-8993-90fd7353ac39' || pathway.id === '751b23de-4c0c-4fa1-8080-944ad7ea41b0' || pathway.id === 'aaa44819-37ec-40e7-a6cf-6d1990040d65' || pathway.id === '7cbd80b9-1172-4b8a-b7e0-e975c91b3ee1' || pathway.id === '83806ec2-6376-4b65-bcd8-4fc25391cc71' || pathway.id === 'c39c880b-dce1-4c6a-88b6-c5bf19eb07d0' || pathway.id === '7c3f09b6-5a24-48d6-89d8-f74c662f324e') ? `Learn More about ${pathway.name}` : `${pathway.name}`,
              aircraftType: '__wingmentor__',
              airline: 'PilotRecognition',
              description: pathway.name.toLowerCase().includes('student pilot') 
                ? 'Explore student pilot training options'
                : (pathway.description || `Explore ${pathway.name} opportunities and training options`),
              locations: ['Global'],
              matchProbability: 100,
              interestLevel: 'high_interest' as const,
              requirements: { totalHours: 0, typeRatings: [] },
              image: (pathway.id === '05da1618-8398-4199-8993-90fd7353ac39' || pathway.id === '751b23de-4c0c-4fa1-8080-944ad7ea41b0' || pathway.id === 'aaa44819-37ec-40e7-a6cf-6d1990040d65' || pathway.id === '7cbd80b9-1172-4b8a-b7e0-e975c91b3ee1' || pathway.id === '83806ec2-6376-4b65-bcd8-4fc25391cc71' || pathway.id === 'c39c880b-dce1-4c6a-88b6-c5bf19eb07d0' || pathway.id === '7c3f09b6-5a24-48d6-89d8-f74c662f324e') ? '' : '/images/accessportal.png',
              pathwayId: pathway.id,
              category: 'cadet-programme' as const,
            };
            
            const cardsWithPilotRecognition = cards.length > 0 ? [wingMentorIntroCard, ...cards] : [wingMentorIntroCard];
            
            // Create triple loop for infinite scroll effect
            const loopedCards = [...cardsWithPilotRecognition, ...cardsWithPilotRecognition, ...cardsWithPilotRecognition];
            return (
            <div key={pathway.id} className="w-full">
              {/* Pathway header on top left - Georgia serif font with description */}
              <div className="mb-6 pl-4 pr-4 w-full text-left">
                <h4 
                  className="text-2xl md:text-3xl font-normal text-white text-left"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {pathway.name}
                </h4>
                {pathway.description && (
                  <p className="mt-2 text-sm md:text-base text-white/70 text-left">
                    {pathway.description}
                  </p>
                )}
              </div>

              {/* Pathway cards - edge-to-edge infinite carousel matching main carousel */}
              <div>
                <style>{`
                  .pathway-sub-carousel::-webkit-scrollbar { display: none; }
                  .pathway-sub-carousel { -ms-overflow-style: none; scrollbar-width: none; }
                  .pathway-sub-carousel {
                    scroll-snap-type: x mandatory;
                    scroll-behavior: smooth;
                  }
                  .pathway-sub-carousel > div {
                    scroll-snap-align: center;
                  }
                  @keyframes blink-fade {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                  }
                  .selection-indicator {
                    animation: blink-fade 2s ease-in-out infinite;
                  }
                `}</style>

                {/* Floating Selection Indicator above carousel */}
                <div className="text-center mb-4 relative z-50">
                  <div className="selection-indicator inline-block">
                    <span className={`text-sm font-normal text-white/50`}>
                      {selectedCard ? selectedCard.name : 'Swipe left or right and click to select a card'}
                    </span>
                  </div>
                </div>

                <div
                  className="pathway-sub-carousel flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    cursor: 'grab',
                  }}
                  onMouseDown={(e) => {
                    const el = e.currentTarget;
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
                  {loopedCards.map((card, idx) => {
                    const cardAirlineLogo = getAirlineLogo(card.airline);
                    const isPilotRecognitionCard = card.aircraftType === '__wingmentor__';
                    const cardAircraftImage = isPilotRecognitionCard
                      ? '/logo.png'
                      : (card.image && !card.image.startsWith('wingmentor') ? card.image : getAircraftImage(card.aircraftType));
                    const isSelected = selectedCard?.id === card.id;
                    
                    const handleCardClick = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      setSelectedCard(card);
                      
                      // Scroll card to center
                      const cardElement = e.currentTarget as HTMLElement;
                      const carousel = cardElement.parentElement;
                      if (carousel && cardElement) {
                        // Calculate the position to scroll to center the card
                        const cardCenterInContainer = cardElement.offsetLeft + cardElement.offsetWidth / 2;
                        const targetScrollLeft = cardCenterInContainer - carousel.offsetWidth / 2;
                        
                        carousel.scrollTo({
                          left: targetScrollLeft,
                          behavior: 'smooth'
                        });
                      }
                    };
                    
                    return (
                    <div
                      key={`${card.id}-${idx}`}
                      id={`subpathway-card-${card.id}`}
                      data-card-id={card.id}
                      onClick={handleCardClick}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        const cardId = `subpathway-card-${card.id}`;
                        navigator.clipboard.writeText(cardId);
                        addToast('success', 'Card ID Copied!', cardId);
                      }}
                      className={`flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 p-[3px] ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}`}
                      style={{ width: '600px' }}
                    >
                      <div className={`relative h-[300px] overflow-hidden rounded-xl ${isPilotRecognitionCard ? 'bg-slate-950' : isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        {/* Card ID Badge - Click to copy */}
                        <div 
                          className="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 backdrop-blur-sm z-20 cursor-pointer hover:bg-black/70 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(`subpathway-card-${card.id}`);
                            addToast('success', 'Card ID Copied!', `subpathway-card-${card.id}`);
                          }}
                          title="Click to copy card ID"
                        >
                          <span className="text-[9px] text-white/60 font-mono">ID: {card.id?.slice(0, 8)}...</span>
                        </div>
                        {isPilotRecognitionCard ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                            {card.image ? (
                              <img src="/logo.png" alt="PilotRecognition" className="h-20 w-auto object-contain mb-4" />
                            ) : (
                              <div className="mb-4 text-center">
                                <span className="text-white text-2xl font-normal" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Discover</span>
                                <span className="text-red-500 text-xl ml-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{card.name}</span>
                              </div>
                            )}
                            <p className="text-slate-400 text-sm text-center px-8">{card.description}</p>
                            {(card.id === 'wingmentor-05da1618-8398-4199-8993-90fd7353ac39' || card.id === 'wingmentor-751b23de-4c0c-4fa1-8080-944ad7ea41b0' || card.id === 'wingmentor-aaa44819-37ec-40e7-a6cf-6d1990040d65' || card.id === 'wingmentor-7cbd80b9-1172-4b8a-b7e0-e975c91b3ee1' || card.id === 'wingmentor-83806ec2-6376-4b65-bcd8-4fc25391cc71' || card.id === 'wingmentor-c39c880b-dce1-4c6a-88b6-c5bf19eb07d0' || card.id === 'wingmentor-7c3f09b6-5a24-48d6-89d8-f74c662f324e' || card.id === 'recommended-pathways-intro') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if ((card.id === 'wingmentor-05da1618-8398-4199-8993-90fd7353ac39' || card.id === 'wingmentor-intro-evtol') && onNavigate) {
                                    onNavigate('air-taxi-pathways');
                                  } else if (card.id === 'wingmentor-aaa44819-37ec-40e7-a6cf-6d1990040d65' && onNavigate) {
                                    onNavigate('licensure-type-rating-pathways');
                                  }
                                }}
                                className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-lg text-sm font-semibold transition-all shadow-lg"
                              >
                                Learn More
                              </button>
                            )}
                          </div>
                        ) : (
                          <img src={cardAircraftImage} alt={card.aircraftType} className="w-full h-full object-cover" loading="lazy" />
                        )}
                        {!isPilotRecognitionCard && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />}
                        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute top-3 right-3 flex gap-2 items-start">
                          {!isPilotRecognitionCard && card.interestLevel === 'high_interest' && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/80 text-white text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              Hiring
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <h4 className="text-lg font-serif font-normal text-white">{card.name}</h4>
                          </div>
                          <p className="text-white/80 text-sm">{card.airline} · {card.locations?.join(' | ') || 'Global'}</p>
                          <p className="text-white/40 text-xs mt-1">ID: {card.id}</p>
                          {!isPilotRecognitionCard && card.requirements?.totalHours && (
                            <div className="mt-2 text-white/60 text-xs">{card.requirements.totalHours} hours required</div>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Discover Pathway Button - Only show when a pathway is selected */}
              {selectedCard && (
                <div className="mt-4 px-4 sm:px-6 lg:px-8 xl-px-12">
                  <div className="max-w-3xl mx-auto text-center">
                    <button
                      onClick={() => {
                        if (selectedCard) {
                          if ((selectedCard.id === 'wingmentor-05da1618-8398-4199-8993-90fd7353ac39' || selectedCard.id === 'wingmentor-intro-evtol') && onNavigate) {
                            onNavigate('air-taxi-pathways');
                          } else if (onNavigateToPathway) {
                            onNavigateToPathway(selectedCard.id);
                          }
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md cursor-pointer hover:scale-105 transition-transform ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white/30 border border-white/20'}`}
                    >
                      <span className="text-xs font-semibold text-white">
                        Discover pathway
                      </span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Selected Card Context Header - Under the selected card */}
              {selectedCard && cardsWithPilotRecognition.some(c => c.id === selectedCard.id) && (
                <div className="mt-6 relative overflow-hidden">
                  {/* Ghost Cards Background - Contained within parent */}
                  <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                    <style>{`
                      @keyframes scroll-left {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                      }
                      .ghost-scroll {
                        animation: scroll-left 40s linear infinite;
                      }
                    `}</style>
                    <div className="flex gap-8 ghost-scroll">
                      {(() => {
                        let ghostCardsToShow;
                        
                        // Check if selected card is a sub-pathway card (has pathwayId)
                        if (selectedCard.pathwayId) {
                          const cardName = selectedCard.name?.toLowerCase() || '';
                          
                          // For Flight Schools sub-pathway, show DUMMY_FLIGHT_SCHOOLS cards
                          if (cardName.includes('flight school') || cardName.includes('fast track') || cardName.includes('university') || cardName.includes('bachelor') || selectedCard.id === 'aa7e455f-5b75-44d2-be26-d2ca05a38bc7' || selectedCard.id === 'be6b0f3f-a5dc-43a2-a2b2-88ee5328beca' || selectedCard.id === 'f77fc867-9ed8-4e7e-a056-45448094e99c') {
                            ghostCardsToShow = DUMMY_FLIGHT_SCHOOLS.filter(s => s.id !== 'wingmentor-intro').map(fs => ({
                              id: fs.id,
                              name: fs.name,
                              aircraftType: fs.name,
                              image: fs.image,
                              airline: fs.location,
                              description: fs.description,
                            }));
                          } else if (cardName.includes('military') || selectedCard.id === '81753376-b823-4909-b82f-664acab13dae') {
                            // For Military Training sub-pathway, show DUMMY_MILITARY_PATHWAYS cards
                            ghostCardsToShow = DUMMY_MILITARY_PATHWAYS.filter(m => m.id !== 'military-intro').map(mp => ({
                              id: mp.id,
                              name: mp.name,
                              aircraftType: mp.name,
                              image: mp.image,
                              airline: mp.branch,
                              description: mp.description,
                            }));
                          } else {
                            // For other sub-pathways, show sibling sub-pathways
                            const pathwayCards = getFilteredPathwayCards(selectedCard.pathwayId, null);
                            ghostCardsToShow = pathwayCards.filter(c => !c.id.includes('wingmentor'));
                          }
                          
                          // Repeat to fill the ghost scroll
                          if (ghostCardsToShow.length > 0) {
                            ghostCardsToShow = [...ghostCardsToShow, ...ghostCardsToShow, ...ghostCardsToShow];
                          }
                        } else {
                          // Show the selected card repeated
                          ghostCardsToShow = [selectedCard, selectedCard, selectedCard, selectedCard, selectedCard, selectedCard, selectedCard, selectedCard];
                        }
                        
                        return ghostCardsToShow.map((card, idx) => {
                          if (!card) return null;
                          const isPilotRecognitionCard = card.aircraftType === '__wingmentor__';
                          const cardAircraftImage = isPilotRecognitionCard
                            ? '/logo.png'
                            : (card.image && !card.image.startsWith('wingmentor') ? card.image : getAircraftImage(card.aircraftType));
                          return (
                            <div
                              key={`ghost-${card.id}-${idx}`}
                              id={`ghost-card-${card.id}`}
                              className="flex flex-col items-center"
                              onContextMenu={(e) => {
                                e.preventDefault();
                                const cardId = `ghost-card-${card.id}`;
                                navigator.clipboard.writeText(cardId);
                                addToast('success', 'Card ID Copied!', cardId);
                              }}
                            >
                              <div
                                className="relative flex-shrink-0 rounded-xl overflow-hidden"
                                style={{ width: '400px', height: '200px' }}
                              >
                                {/* Card ID Badge - Click to copy */}
                                <div 
                                  className="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 backdrop-blur-sm z-20 cursor-pointer hover:bg-black/70 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(`ghost-card-${card.id}`);
                                    addToast('success', 'Card ID Copied!', `ghost-card-${card.id}`);
                                  }}
                                  title="Click to copy card ID"
                                >
                                  <span className="text-[8px] text-white/60 font-mono">ID: {card.id?.slice(0, 6)}...</span>
                                </div>
                                <img 
                                  src={cardAircraftImage} 
                                  alt={card.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="mt-2 text-white/30 text-[10px] text-center font-medium truncate max-w-[380px]">
                                {card.name}
                              </p>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                  
                  {/* Glassy Context Component */}
                  <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-12">
                    <div className="max-w-2xl mx-auto text-center flex items-center justify-center gap-4">
                      {/* Left Arrow */}
                      <button
                        onClick={() => {
                          const currentIndex = cardsWithPilotRecognition.findIndex(c => c.id === selectedCard.id);
                          if (currentIndex > 0) {
                            const nextCard = cardsWithPilotRecognition[currentIndex - 1];
                            setSelectedCard(nextCard);
                            
                            // Scroll to the card in carousel
                            setTimeout(() => {
                              const carousel = document.querySelector('.pathway-sub-carousel') as HTMLElement;
                              if (carousel) {
                                const cardElements = carousel.querySelectorAll('[data-card-id]');
                                const targetCard = Array.from(cardElements).find(el => el.getAttribute('data-card-id') === nextCard.id);
                                if (targetCard) {
                                  const cardCenter = (targetCard as HTMLElement).offsetLeft + (targetCard as HTMLElement).offsetWidth / 2;
                                  const targetScrollLeft = cardCenter - carousel.offsetWidth / 2;
                                  carousel.scrollTo({
                                    left: targetScrollLeft,
                                    behavior: 'smooth'
                                  });
                                }
                              }
                            }, 100);
                          }
                        }}
                        className="bg-gray-200/60 backdrop-blur-xl border border-gray-300/50 rounded-full p-3 shadow-2xl hover:bg-gray-200/80 transition-colors"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <div className="bg-gray-200/60 backdrop-blur-xl border border-gray-300/50 rounded-2xl px-6 py-5 shadow-2xl flex-1">
                        <h3 className="text-2xl md:text-3xl font-normal text-white mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                          {selectedCard.name}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <span className="text-sm font-medium text-white/90">
                            {selectedCard.airline}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/60"></span>
                          <span className="text-sm font-medium text-white/90">
                            {selectedCard.locations?.join(' | ') || 'Global'}
                          </span>
                        </div>
                        {selectedCard.description && (
                          <p className="text-sm text-white/80 mb-4 leading-relaxed">
                            {selectedCard.description}
                          </p>
                        )}
                        <button
                          onClick={() => setSelectedCard(null)}
                          className="text-xs text-white/70 hover:text-white transition-colors"
                        >
                          Close
                        </button>
                      </div>
                      
                      {/* Right Arrow */}
                      <button
                        onClick={() => {
                          const currentIndex = cardsWithPilotRecognition.findIndex(c => c.id === selectedCard.id);
                          if (currentIndex < cardsWithPilotRecognition.length - 1) {
                            const nextCard = cardsWithPilotRecognition[currentIndex + 1];
                            setSelectedCard(nextCard);
                            
                            // Scroll to the card in carousel
                            setTimeout(() => {
                              const carousel = document.querySelector('.pathway-sub-carousel') as HTMLElement;
                              if (carousel) {
                                const cardElements = carousel.querySelectorAll('[data-card-id]');
                                const targetCard = Array.from(cardElements).find(el => el.getAttribute('data-card-id') === nextCard.id);
                                if (targetCard) {
                                  const cardCenter = (targetCard as HTMLElement).offsetLeft + (targetCard as HTMLElement).offsetWidth / 2;
                                  const targetScrollLeft = cardCenter - carousel.offsetWidth / 2;
                                  carousel.scrollTo({
                                    left: targetScrollLeft,
                                    behavior: 'smooth'
                                  });
                                }
                              }
                            }, 100);
                          }
                        }}
                        className="bg-gray-200/60 backdrop-blur-xl border border-gray-300/50 rounded-full p-3 shadow-2xl hover:bg-gray-200/80 transition-colors"
                      >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Centered Context Header below cards */}
              <div className="mt-6 px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="mt-2">
                    <span className="text-xs font-medium text-white/60">
                      There are {getPhilippianFlightSchoolCount()} CAAP-approved flight schools available for {selectedCard?.name || cardsWithPilotRecognition[1]?.name || pathway.name}
                    </span>
                  </div>
                  {pathway.description && (
                    <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {pathway.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      {loading && (
        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Loading...
        </div>
      )}
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
  onNavigateToPathway?: (pathwayId: string) => void;
  onNavigateToMainApp?: (page: string) => void;
  mode?: 'pathways' | 'jobs';
  embedded?: boolean;
}

export const PathwaysPageModern: React.FC<PathwaysPageModernProps> = ({
  isDarkMode = true,
  initialCategory = 'all',
  selectedPathwayId,
  onNavigate,
  onNavigateToPathway,
  onNavigateToMainApp,
  mode = 'pathways',
  embedded = false
}) => {
  const [expandedPathway, setExpandedPathway] = useState<string | null>(selectedPathwayId || null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrimaryPill, setSelectedPrimaryPill] = useState<string | null>(null);
  const [activeSubPills, setActiveSubPills] = useState<string[]>([]);
  const [showMorePills, setShowMorePills] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1000); // Show all jobs and discovery pathways
  const [matchFilter, setMatchFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'newest' | 'alphabetical'>('match');
  const [viewFilter, setViewFilter] = useState<'all' | 'jobs' | 'pathways'>('all');
  const [positionFilter, setPositionFilter] = useState<'all' | 'Captain' | 'Fighter Pilot' | 'First Officer' | 'Flight Instructor' | 'Pilot Cadet'>('all');
  const [isPositionDropdownOpen, setIsPositionDropdownOpen] = useState(false);
  const [expandedGapAnalysis, setExpandedGapAnalysis] = useState(true);
  const [expandedQuickActions, setExpandedQuickActions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedPathwayForMatch, setSelectedPathwayForMatch] = useState<PathwayData | null>(null);
  const [selectedCarouselPathway, setSelectedCarouselPathway] = useState<PathwayData | null>(null);
  const [selectedPathwayCard, setSelectedPathwayCard] = useState<PathwayData | null>(null); // Track selected pathway from first row
  const [subPathways, setSubPathways] = useState<any[]>([]); // Store sub-pathways for selected pathway
  const [cockpitActivated, setCockpitActivated] = useState(false);
  const [sidePanelExpanded, setSidePanelExpanded] = useState(true);
  const [popoverJobId, setPopoverJobId] = useState<string | null>(null);
  const [canPostPathways, setCanPostPathways] = useState(false);
  const [enterprisePathwayCards, setEnterprisePathwayCards] = useState<PathwayData[]>([]);
  const [selectedStage1PathwayId, setSelectedStage1PathwayId] = useState<string | null>(null);
  const [interestSubmitting, setInterestSubmitting] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState<string | null>(null); // card id
  // Article 4 — Skybridge T2 legal notice state
  const [skybridgePendingPathway, setSkybridgePendingPathway] = useState<PathwayData | null>(null);
  const [stage1Index, setStage1Index] = useState(0);

  // Maps PATHWAYS[] UUID → DISCOVERY_PATHWAYS short-string key
  const PATHWAY_UUID_TO_DISCOVERY_KEY: Record<string, string> = {
    // Pilot Training & Certification → private / type-rating
    'c39c880b-dce1-4c6a-88b6-c5bf19eb07d0': 'private',       // Student Pilot
    '83806ec2-6376-4b65-bcd8-4fc25391cc71': 'private',       // Private Pilot
    '7cbd80b9-1172-4b8a-b7e0-e975c91b3ee1': 'type-rating',   // Commercial Pilot
    'flight-schools-category': 'flight-schools',             // Flight Schools
    'type-rating-category': 'type-rating',                   // Type Rating Pathways
    // Military & Government
    'military-pathways-category': 'military',                  // Military Pathways
    // Career Progression → airline-pathways / cadet-programme
    '48dabe06-87f2-4227-98ed-78e8d96b2d8b': 'airline-pathways', // ATP
    'da3b7514-925d-4024-9341-08248d52cdb9': 'airline-pathways', // Flight Instructor
    'a7dfe793-df6f-4286-8bd2-afa0653a608d': 'cadet-programme',  // Cadet Pilot
    'c18c5eb8-5b0a-4ba1-ac17-fe0e658f1dd7': 'airline-pathways', // Low Timer
    '4f160ab4-d94f-496a-9099-5386ffa456ec': 'airline-pathways', // High Timer
    '8d3faf3f-a892-4902-b82c-93980080dac9': 'airline-pathways', // Regional
    'fbb3a1be-432e-4c85-b23b-c1cce9d32913': 'airline-pathways', // Major Airline
    // Commercial Operations
    '9145209b-d0de-4b43-a2bd-d7f523f8f230': 'privateSector',   // Charter
    'e11079f9-3506-4543-b273-a8410464b396': 'privateSector',   // Corporate
    '9aab7b85-3f81-43ca-8d8b-421ee658ecaf': 'cargo',           // Cargo
    'acdea7e3-fdfb-4d2e-a711-c653bd6e38ab': 'privateSector',   // Private Sector
    // Specialized / Humanitarian / Remote / Military → airtaxi-drones or airline-pathways
    '1c04e201-07f8-49f5-a899-b80742281ed8': 'privateSector',
    'c311583f-a6c1-4c38-b33f-ec1ff091501d': 'airline-pathways',
    '519a5814-a26d-431b-838f-d09dbf62586c': 'privateSector',
    '8a2ccd30-b6dd-49a8-a451-8d32ce42bf22': 'airtaxi-drones', // Air Taxi
    '3a9e3d74-5937-4a68-ab0c-c11f8524c8ef': 'airtaxi-drones', // Drones
    '18a40676-b17d-400e-9449-4b65c4c44e38': 'airtaxi-drones', // Aviation Tech
    '5b6097c0-edef-4d89-90bc-9a0fa46aba84': 'airline-pathways',
    'e9877f93-5972-45a7-a635-e6fbf42b43c5': 'airline-pathways',
  };

  // Per-pathway card images for Stage 1
  const PATHWAY_IMAGES: Record<string, string> = {
    'c39c880b-dce1-4c6a-88b6-c5bf19eb07d0': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    '83806ec2-6376-4b65-bcd8-4fc25391cc71': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    '7cbd80b9-1172-4b8a-b7e0-e975c91b3ee1': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    '48dabe06-87f2-4227-98ed-78e8d96b2d8b': CLOUDINARY_AIRLINES['emirates'] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    'da3b7514-925d-4024-9341-08248d52cdb9': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    'a7dfe793-df6f-4286-8bd2-afa0653a608d': CLOUDINARY_AIRLINES['qatar'] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    'c18c5eb8-5b0a-4ba1-ac17-fe0e658f1dd7': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    '4f160ab4-d94f-496a-9099-5386ffa456ec': CLOUDINARY_AIRLINES['singapore'] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    '8d3faf3f-a892-4902-b82c-93980080dac9': CLOUDINARY_AIRLINES['cathay'] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    'fbb3a1be-432e-4c85-b23b-c1cce9d32913': CLOUDINARY_AIRLINES['lufthansa'] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    '9145209b-d0de-4b43-a2bd-d7f523f8f230': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    'e11079f9-3506-4543-b273-a8410464b396': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    '9aab7b85-3f81-43ca-8d8b-421ee658ecaf': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    'acdea7e3-fdfb-4d2e-a711-c653bd6e38ab': 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    '8a2ccd30-b6dd-49a8-a451-8d32ce42bf22': 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
    '3a9e3d74-5937-4a68-ab0c-c11f8524c8ef': 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
    '18a40676-b17d-400e-9449-4b65c4c44e38': 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
    '5b6097c0-edef-4d89-90bc-9a0fa46aba84': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    'e9877f93-5972-45a7-a635-e6fbf42b43c5': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    'flight-schools-category': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'type-rating-category': 'https://www.cae.com/content/images/blog/Civil_Aviation/_webp/IMG_4783_Updated_.JPG_webp_40cd750bba9870f18aada2478b24840a.webp',
    'military-pathways-category': 'https://www.airandspaceforces.com/app/uploads/2020/07/6255683-scaled.jpg',
  };
  const [regionFilter, setRegionFilter] = useState<Region>('All');
  const [showMilitaryPathwaysPage, setShowMilitaryPathwaysPage] = useState(false);
  const [showSpecialPathwaysPage, setShowSpecialPathwaysPage] = useState(false);
  const [showLicensureTypeRatingPage, setShowLicensureTypeRatingPage] = useState(false);
  const [showCommercialPilotPathwayPage, setShowCommercialPilotPathwayPage] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { addToast } = useToast();

  // Debug: Log when showSpecialPathwaysPage changes
  useEffect(() => {
    if (showSpecialPathwaysPage) {
      window.scrollTo(0, 0);
    }
  }, [showSpecialPathwaysPage]);

  // Debug: Log when showLicensureTypeRatingPage changes
  useEffect(() => {
    if (showLicensureTypeRatingPage) {
      window.scrollTo(0, 0);
    }
  }, [showLicensureTypeRatingPage]);

  // Debug: Log when showCommercialPilotPathwayPage changes
  useEffect(() => {
    if (showCommercialPilotPathwayPage) {
      window.scrollTo(0, 0);
    }
  }, [showCommercialPilotPathwayPage]);

  // Scroll to top when Military Pathways page is opened
  useEffect(() => {
    if (showMilitaryPathwaysPage) {
      window.scrollTo(0, 0);
    }
  }, [showMilitaryPathwaysPage]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const stage2Ref = useRef<HTMLDivElement>(null);
  const stage2CardsRef = useRef<PathwayData[]>([]);
  const [stage2Index, setStage2Index] = useState(0);
  const [stage2RegionFilter, setStage2RegionFilter] = useState<string>('All');
  const [stage2CountryFilter, setStage2CountryFilter] = useState<string>('All');
  const [userCountryCode, setUserCountryCode] = useState<string>('');
  const [userLatLng, setUserLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [stage2NearestSort, setStage2NearestSort] = useState<boolean>(false);
  const [stage2TypeRatingFilter, setStage2TypeRatingFilter] = useState<string>('All');
  const [stage2ViewFilter, setStage2ViewFilter] = useState<'All' | 'Type Rating Centers' | 'Flight School (ATO)' | 'Special Ratings'>('All');
  const [trSchoolTab, setTrSchoolTab] = useState<'about' | 'expectations' | 'requirements' | 'access'>('about');
  const [flightSchoolCardImgIdx, setFlightSchoolCardImgIdx] = useState<number>(0);
  const [flightSchoolCardData, setFlightSchoolCardData] = useState<Record<string, any>>({});
  const [flightSchoolEngagement, setFlightSchoolEngagement] = useState<Record<string, any>>({});
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Cycle flight school images on the Stage 1 card based on IP region
  useEffect(() => {
    const regionSchools = DUMMY_FLIGHT_SCHOOLS.filter(s =>
      s.id !== 'wingmentor-intro' &&
      s.image &&
      !s.image.startsWith('https://images.unsplash') &&
      (userCountryCode
        ? (COUNTRY_TO_REGION[userCountryCode]?.region
            ? s.region === COUNTRY_TO_REGION[userCountryCode].region
            : true)
        : true)
    );
    if (regionSchools.length < 2) return;
    const interval = setInterval(() => {
      setFlightSchoolCardImgIdx(i => (i + 1) % regionSchools.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [userCountryCode]);

  // Read IP-detected country code from localStorage (written by TopNavbar)
  const COUNTRY_TO_REGION: Record<string, { region: string; country: string }> = {
    'PH': { region: 'Asia', country: 'Philippines' },
    'SG': { region: 'Asia', country: 'Singapore' },
    'DE': { region: 'Europe', country: 'Germany' },
    'GB': { region: 'Europe', country: 'UK' },
    'FR': { region: 'Europe', country: 'France' },
    'NL': { region: 'Europe', country: 'Netherlands' },
    'ES': { region: 'Europe', country: 'Spain' },
    'US': { region: 'Americas', country: 'USA' },
    'CA': { region: 'Americas', country: 'Canada' },
    'AU': { region: 'Oceania', country: 'Australia' },
    'NZ': { region: 'Oceania', country: 'New Zealand' },
    'AE': { region: 'Middle East', country: 'UAE' },
    'SA': { region: 'Middle East', country: 'Saudi Arabia' },
    'QA': { region: 'Middle East', country: 'Qatar' },
    'ZA': { region: 'Africa', country: 'South Africa' },
    'NG': { region: 'Africa', country: 'Nigeria' },
    'KE': { region: 'Africa', country: 'Kenya' },
  };
  useEffect(() => {
    const cached = localStorage.getItem('cachedCountryCode');
    const cachedLat = localStorage.getItem('cachedLat');
    const cachedLng = localStorage.getItem('cachedLng');
    if (cached) setUserCountryCode(cached);
    if (cachedLat && cachedLng) setUserLatLng({ lat: parseFloat(cachedLat), lng: parseFloat(cachedLng) });
    if (!cached || !cachedLat) {
      fetch('https://ipapi.co/json/')
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d?.country_code) {
            setUserCountryCode(d.country_code);
            localStorage.setItem('cachedCountryCode', d.country_code);
            localStorage.setItem('cachedCountryTime', Date.now().toString());
          }
          if (d?.latitude && d?.longitude) {
            setUserLatLng({ lat: d.latitude, lng: d.longitude });
            localStorage.setItem('cachedLat', String(d.latitude));
            localStorage.setItem('cachedLng', String(d.longitude));
          }
        })
        .catch(() => {});
    }
  }, []);

  // Default to showing all regions in Stage 2 (user can manually filter if desired)
  useEffect(() => {
    // Reset to "All" when flight-schools category is selected
    if (selectedPathwayCard?.category === 'flight-schools') {
      setStage2RegionFilter('All');
      setStage2CountryFilter('All');
      setStage2Index(0);
    }
  }, [selectedPathwayCard?.category]);

  // Submit Interest handler — writes to pathway_card_interests table
  const handleSubmitInterest = async (pathway: PathwayData) => {
    if (!currentUser?.id || interestSubmitting) return;
    if (cadетGateStatus.restricted) return;
    const rawCardId = pathway.id.replace('enterprise-', '');
    setInterestSubmitting(true);
    try {
      const { data: cardRow } = await supabase
        .from('enterprise_pathway_cards')
        .select('id, enterprise_account_id')
        .eq('id', rawCardId)
        .maybeSingle();
      if (!cardRow) throw new Error('Card not found');
      const { error } = await supabase.from('pathway_card_interests').upsert({
        pilot_id: currentUser.id,
        card_id: rawCardId,
        enterprise_account_id: cardRow.enterprise_account_id,
        submitted_at: new Date().toISOString(),
      }, { onConflict: 'pilot_id,card_id' });
      if (error) throw error;
      setInterestSubmitted(pathway.id);
    } catch (e) {
      console.error('Failed to submit interest:', e);
    } finally {
      setInterestSubmitting(false);
    }
  };

  // Fetch flight school card data from Supabase when a card is selected
  useEffect(() => {
    if (!selectedCarouselPathway?.id || selectedPathwayCard?.category !== 'flight-schools') return;
    const cardId = selectedCarouselPathway.id;
    // Skip if already cached
    if (flightSchoolCardData[cardId]) return;
    const fetchCard = async () => {
      const [{ data: card }, { data: totals }] = await Promise.all([
        supabase.from('flight_school_cards').select('*').eq('id', cardId).single(),
        supabase.from('pathway_card_engagement_totals').select('*').eq('card_id', cardId).eq('card_type', 'flight_school').single(),
      ]);
      if (card) setFlightSchoolCardData(prev => ({ ...prev, [cardId]: card }));
      if (totals) setFlightSchoolEngagement(prev => ({ ...prev, [cardId]: totals }));
    };
    fetchCard();
  }, [selectedCarouselPathway?.id, selectedPathwayCard?.category]);

  // 3-stage hierarchy selection state
  const [hierarchySelection, setHierarchySelection] = useState<{
    generalCategory?: string;
    pathway?: string;
    subPathway?: string;
  }>({
    generalCategory: 'da486dd1-8832-4ec3-843b-1cbd3c9b8718', // Pilot Training & Certification
  });

  // Wrap setHierarchySelection in useCallback to prevent infinite loop
  const handleHierarchySelectionChange = useCallback((selection: { generalCategory?: string; pathway?: string; subPathway?: string }) => {
    setHierarchySelection(selection);
  }, []);

  // Wrap category selection handler in useCallback to prevent infinite loop
  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setHierarchySelection(prev => ({
      ...prev,
      generalCategory: categoryId || undefined,
      pathway: undefined,
      subPathway: undefined,
    }));
    setSelectedStage1PathwayId(null);
    setStage1Index(0);
    setStage2Index(0);
    setStage2RegionFilter('All');
    setStage2CountryFilter('All');
    setSelectedPathwayCard(null);
    setSelectedCarouselPathway(null);
  }, []);

  const { userProfile, currentUser } = useAuth();

  // ── Terminal 1 Cadet Track Mode gate ────────────────────────────────────────
  // Pilots who are minors (< 18) OR hold only a Student/SPL/PPL license are
  // restricted from submitting interest to enterprise (Terminal 3) pathways.
  // They may view all cards but the submit gate is locked with a redirect nudge.
  const cadетGateStatus = (() => {
    if (!currentUser || !userProfile) return { restricted: false, reason: null as string | null };
    const dob: string | null = userProfile.date_of_birth || null;
    const ratings: string[] = Array.isArray(userProfile.ratings) ? userProfile.ratings : [];
    const isMinor = dob ? (() => {
      const birth = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age < 18;
    })() : false;
    const STUDENT_LICENSES = ['student', 'spl', 'student pilot', 'student pilot license', 'spa'];
    const isStudentLicense = ratings.some(r => STUDENT_LICENSES.includes(r.toLowerCase()));
    const hasCPLOrAbove = ratings.some(r => {
      const rl = r.toLowerCase();
      return rl.includes('cpl') || rl.includes('atpl') || rl.includes('commercial');
    });
    const restricted = isMinor || (isStudentLicense && !hasCPLOrAbove);
    if (!restricted) return { restricted: false, reason: null };
    if (isMinor && isStudentLicense) return { restricted: true, reason: 'minor+student' };
    if (isMinor) return { restricted: true, reason: 'minor' };
    return { restricted: true, reason: 'student' };
  })();

  // Handle posting pathway cards
  const handlePostPathway = async (pathwayData: any) => {
    if (!currentUser?.id) {
      console.error('No user logged in');
      return;
    }

    try {
      const response = await fetch('https://us-central1-bendj1231-app-main.cloudfunctions.net/postPathwayCard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          pathwayData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to post pathway:', data.error);
        return;
      }

    } catch (error) {
      console.error('Error posting pathway:', error);
    }
  };

  // Wrapper function for Post Pathway button (without pathway data)
  const handlePostPathwayClick = () => {
    // TODO: Add a modal or form to collect pathway data
  };

  // Pathways Intelligence — Firebase R-formula powered data
  const intelligence = usePathwaysIntelligence(
    currentUser?.id || undefined,
    mode === 'jobs' ? jobApplicationListings : []
  );

  // Three-tier hierarchy states
  const [stage1Categories, setStage1Categories] = useState<any[]>([]); // General Categories
  const [stage2Pathways, setStage2Pathways] = useState<any[]>([]); // Pathways for selected category
  const [stage3SubPathways, setStage3SubPathways] = useState<any[]>([]); // Sub-pathways for selected pathway
  
  const [selectedStage1Category, setSelectedStage1Category] = useState<any>(null);
  const [selectedStage2Pathway, setSelectedStage2Pathway] = useState<any>(null);

  // Stage 1: Fetch General Categories on mount
  useEffect(() => {
    const fetchGeneralCategories = async () => {
      const { data, error } = await supabase
        .from('career_hierarchy_general_categories')
        .select('*')
        .order('display_order');
      
      if (error) {
        console.error('Error fetching general categories:', error);
        setStage1Categories([]);
      } else {
        const overriddenCategories = (data || []).map(cat => ({
          ...cat,
          name: cat.name === 'Drones & Pilotless Drones' ? 'Drones & Airtaxi Pathways' : cat.name
        }));
// [AUDIT] Removed console.log // line 4751
        setStage1Categories(overriddenCategories);
      }
    };
    
    fetchGeneralCategories();
  }, []);

  // Stage 2: Fetch Pathways when Stage 1 category is selected
  useEffect(() => {
    if (selectedStage1Category) {
      const fetchPathways = async () => {
        const { data, error } = await supabase
          .from('career_hierarchy_pathways')
          .select('*')
          .eq('general_category_id', selectedStage1Category.id)
          .order('display_order');
        
        if (error) {
          console.error('Error fetching pathways:', error);
          setStage2Pathways([]);
        } else {
          const overriddenPathways = (data || []).map(pathway => ({
            ...pathway,
            name: pathway.name === 'Drones & Pilotless Drones' ? 'Drones & Airtaxi Pathways' : pathway.name
          }));
// [AUDIT] Removed console.log // line 4777
          setStage2Pathways(overriddenPathways);
        }
      };
      
      fetchPathways();
    } else {
      setStage2Pathways([]);
    }
  }, [selectedStage1Category]);

  // Stage 3: Fetch Sub-pathways when Stage 2 pathway is selected
  useEffect(() => {
    if (selectedStage2Pathway) {
      const fetchSubPathways = async () => {
        const { data, error } = await supabase
          .from('career_hierarchy_sub_pathways')
          .select('*')
          .eq('pathway_id', selectedStage2Pathway.id)
          .eq('is_active', true)
          .order('display_order');
        
        if (error) {
          console.error('Error fetching sub-pathways:', error);
          setStage3SubPathways([]);
        } else {
          const overriddenSubPathways = (data || []).map(sp => ({
            ...sp,
            name: sp.name === 'Drone pilot certification and UAV training programs' ? 'Learn More about Drones & Airtaxi Pathways' : sp.name
          }));
// [AUDIT] Removed console.log // line 4807
          setStage3SubPathways(overriddenSubPathways);
        }
      };
      
      fetchSubPathways();
    } else {
      setStage3SubPathways([]);
    }
  }, [selectedStage2Pathway]);

  // Legacy useEffect for backward compatibility - fetch sub-pathways when a pathway card is selected from main carousel
  useEffect(() => {
// [AUDIT] Removed console.log // line 4820
    if (selectedPathwayCard) {
      // Transform DISCOVERY_PATHWAYS into PathwayData format
      const discoveryPathwaysData: PathwayData[] = Object.entries(DISCOVERY_PATHWAYS).flatMap(([catKey, items]) =>
        items.map((item: any) => ({
          id: item.id,
          name: item.title,
          description: item.description || item.salary,
          image: item.image,
          airline: item.company,
          locations: [item.location],
          category: catKey,
          matchProbability: item.matchPercentage / 100,
          requirements: { totalHours: 0, typeRatings: [] },
          isRecommended: item.matchPercentage >= 90,
        }))
      );
      
      // Show all cards from the same category as the selected pathway
// [AUDIT] Removed console.log // line 4839
      
      // Get all cards from the same category
      const categoryCards = discoveryPathwaysData.filter(card => card.category === selectedPathwayCard.category);
      
// [AUDIT] Removed console.log // line 4844
      
      if (categoryCards.length > 0) {
        const mappedCards = categoryCards.map((card) => ({
          id: card.id,
          name: card.name,
          description: card.description || card.salary,
          image: card.image,
          pathway_id: selectedPathwayCard.id,
        }));
// [AUDIT] Removed console.log // line 4854
        setSubPathways(mappedCards);
      } else {
        setSubPathways([]);
      }
    } else {
      setSubPathways([]);
    }
  }, [selectedPathwayCard]);

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
    'airtaxi-drones': 'Drones & Airtaxi Pathways'
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch published enterprise pathway cards from Supabase
  useEffect(() => {
    const fetchEnterpriseCards = async () => {
      try {
        // Skip on localhost to avoid CORS errors during development
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'))) return;
        const res = await fetch('https://us-central1-pilotrecognition-airline.cloudfunctions.net/getEnterprisePathwayCards');
        if (!res.ok) return;
        const data = await res.json();
        const cards: PathwayData[] = (data.cards || []).map((c: any) => {
          // airline data comes from the joined enterprise_accounts object
          const ea = c.enterprise_accounts || {};
          const airlineName = ea.airline_name || c.airline_name || '';
          const logoUrl = ea.airline_logo_url || c.airline_logo_url || '';
          return {
            id: `enterprise-${c.id}`,
            name: c.title,
            category: (['airline-pathways','cadet-programme','private','privateSector','cargo','type-rating','airtaxi-drones','flight-schools','military'].includes(c.category) ? c.category : 'airline-pathways') as PathwayData['category'],
            airline: airlineName,
            description: c.subtitle || c.benefits_summary || '',
            image: logoUrl,
            matchProbability: 75,
            aircraftType: 'generic',
            requirements: {
              totalHours: c.minimum_requirements?.total_hours || 0,
              typeRatings: c.minimum_requirements?.type_rating_required ? [c.position_type] : [],
            },
            salary: {
              firstYear: c.compensation?.salary_min && c.compensation?.salary_max
                ? `${c.compensation.currency || 'USD'} ${c.compensation.salary_min}–${c.compensation.salary_max}`
                : 'Competitive',
              fifthYear: c.career_progression?.typical_upgrade_years
                ? `Captain upgrade ~${c.career_progression.typical_upgrade_years} yrs`
                : '',
              bonuses: c.compensation?.housing ? 'Housing included' : '',
            },
            benefits: c.benefits_summary ? [c.benefits_summary] : [],
            locations: Array.isArray(c.base_locations) && c.base_locations.length > 0 ? c.base_locations : (ea.country ? [ea.country] : ['Global']),
            interestLevel: c.hiring_status === 'active' ? 'high_interest' : c.hiring_status === 'paused' ? 'limited' : 'moderate',
            positions: c.positions_available || 1,
            url: c.application_url || ea.airline_website || undefined,
            isEnterprise: true,
            enterpriseLogoUrl: logoUrl,
          };
        });
        setEnterprisePathwayCards(cards);
      } catch (e) {
        // silently fail — enterprise cards are additive
      }
    };
    fetchEnterpriseCards();
  }, []);

  // Check if user can post pathway cards
  useEffect(() => {
    if (currentUser?.id) {
      // Skip on localhost to avoid CORS errors during development
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'))) {
        setCanPostPathways(false);
        return;
      }
      const checkPostingAccess = async () => {
        try {
          const response = await fetch(`https://us-central1-pilotrecognition-airline.cloudfunctions.net/checkPathwayPostingAccess?userId=${currentUser.id}`);
          const data = await response.json();
          setCanPostPathways(data.canPost || false);
        } catch (error) {
          console.error('Error checking posting access:', error);
          setCanPostPathways(false);
        }
      };
      checkPostingAccess();
    }
  }, [currentUser?.id]);

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
      interestLevel: item.postedAt === 'Hiring Now' ? 'high_interest' : 'moderate' as const,
      positions: 1,
      url: undefined,
    }))
  );

  // When a category is selected, use PATHWAYS array instead of DISCOVERY_PATHWAYS
  const categoryPathways: PathwayData[] = hierarchySelection.generalCategory
    ? PATHWAYS.filter(p => p.general_category_id === hierarchySelection.generalCategory).map(p => ({
        id: p.id,
        name: p.name,
        category: 'pathway' as const,
        airline: 'PilotRecognition',
        description: p.description,
        image: '',
        matchProbability: 100,
        aircraftType: p.id,
        requirements: { totalHours: 0, typeRatings: [] },
        locations: ['Global'],
        interestLevel: 'moderate' as const,
      }))
    : [];

  // Include pathways or jobs based on mode
  // For 'all' category, always use discoveryPathways (curated pathway cards) regardless of mode
  // When a category is selected, use categoryPathways instead
  // Enterprise cards are always merged in, surfaced first
  const allPathways = [
    ...enterprisePathwayCards,
    ...(hierarchySelection.generalCategory ? categoryPathways : discoveryPathways),
    ...(mode === 'jobs' ? dynamicPathways : []),
  ];

// [AUDIT] Removed console.log // line 5067
// [AUDIT] Removed console.log // line 5068
// [AUDIT] Removed console.log // line 5069
// [AUDIT] Removed console.log // line 5070
// [AUDIT] Removed console.log // line 5071

  const filteredPathways = allPathways.filter(pathway => {
    // Use hierarchy selection for filtering if available, otherwise use activeCategory
    let matchesCategory = true;
    
    if (Object.keys(hierarchySelection).length > 0 && hierarchySelection.generalCategory) {
      // categoryPathways are already pre-filtered by general_category_id — they use
      // category:'pathway' as a sentinel. Pass them through without re-filtering.
      if (pathway.category === 'pathway') {
        matchesCategory = true;
      } else {
        // For dynamic job pathways, apply the category mapping as a secondary filter
        const categoryMapping: Record<string, string[]> = {
          'da486dd1-8832-4ec3-843b-1cbd3c9b8718': ['cadet-programme', 'private', 'type-rating', 'flight-schools'],
          '9c6dc768-ecac-408f-b62c-d3f72ae8e509': ['airline-pathways'],
          '0cc029df-b6f9-4f6d-b4e3-c7bd3d89cbe8': ['cargo', 'privateSector'],
          '9865e475-1b3a-4d16-8a2f-cdd443dd7975': ['privateSector'],
          '37c42b2b-1f4c-4f64-b1a1-dd1f84623023': ['cargo', 'privateSector'],
          'c5f16476-44c0-4c3e-88db-85813efb96a0': ['privateSector'],
          'd5855477-a76d-42be-abae-e18fce201ac8': ['airtaxi-drones'],
        };
        const allowedCategories = categoryMapping[hierarchySelection.generalCategory] || [];
        matchesCategory = allowedCategories.length === 0 || allowedCategories.includes(pathway.category);
      }
    } else {
      // Fall back to original category filtering
      matchesCategory = activeCategory === 'all' || pathway.category === activeCategory;
      // For 'recommended' category, show pathways with high match probability (85%+)
      if (activeCategory === 'recommended') {
        matchesCategory = pathway.matchProbability >= 85;
      }
    }
    
    const matchesSearch =
      (pathway.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pathway.airline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      pathway.locations.some(l => (l || '').toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Region filtering
    const matchesRegion = regionFilter === 'All' || pathway.region === regionFilter;
    
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
    
    return matchesCategory && matchesSearch && matchesRegion && matchesMatchFilter && matchesPositionFilter && matchesViewFilter;
  }).filter(pathway => !pathway.id.includes('wingmentor-intro'))
  // Sort based on selected sort option
  .sort((a, b) => {
    switch (sortBy) {
      case 'match':
        // Sort by match probability (highest first)
        return (b.matchProbability || 0) - (a.matchProbability || 0);
      case 'newest':
        // Sort by creation date or last updated (newest first)
        // If no date available, use id as fallback for stable sort
        return (b.updatedAt || b.createdAt || b.id).localeCompare(a.updatedAt || a.createdAt || a.id);
      case 'alphabetical':
        // Sort by name A-Z
        return (a.name || '').localeCompare(b.name || '');
      default:
        return 0;
    }
  });

  // Add intro card at the beginning
  const introCard: PathwayData = {
    id: 'recommended-pathways-intro',
    name: 'Your Pathway',
    category: 'all',
    airline: 'PilotRecognition',
    description: 'Personalized career matches based on your profile',
    image: '',
    matchProbability: 100,
    aircraftType: '__intro__', // Use different identifier to avoid conflict
    requirements: {
      totalHours: 0,
      typeRatings: [],
    },
    locations: ['Global'],
    interestLevel: 'active',
  };

  const pathwaysWithIntro = [introCard, ...filteredPathways];

  // Single set of cards - no infinite scroll
  const loopedPathways = pathwaysWithIntro;

  // Simple scroll function like PortalAirlineExpectationsPage
  const scrollCarousel = (dir: 'left' | 'right') => {
    const container = carouselRef.current;
    if (!container || pathwaysWithIntro.length === 0) return;

    // Select the next/previous card based on current selection
    const currentIndex = pathwaysWithIntro.findIndex(p => p.id === selectedCarouselPathway?.id);
    if (currentIndex === -1) return;

    let newIndex = dir === 'left' ? currentIndex - 1 : currentIndex + 1;
    // Wrap around for infinite selection
    if (newIndex < 0) newIndex = pathwaysWithIntro.length - 1;
    if (newIndex >= pathwaysWithIntro.length) newIndex = 0;

    setSelectedCarouselPathway(pathwaysWithIntro[newIndex]);

    // Calculate scroll position to center the selected card
    // Card width is 600px, gap is 16px (tailwind gap-4)
    const cardWidth = 600;
    const gap = 16;
    const cardTotalWidth = cardWidth + gap;

    // Get the card element at the new index
    const cards = container.children;
    if (cards[newIndex]) {
      const cardElement = cards[newIndex] as HTMLElement;
      const cardOffsetLeft = cardElement.offsetLeft;
      const containerWidth = container.clientWidth;

      // Calculate position to center the card
      const scrollLeft = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);

      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  // Reset cockpit activation when pathway changes
  useEffect(() => {
    setCockpitActivated(false);
  }, [selectedCarouselPathway?.id]);

  // Set initial selected pathway
  useEffect(() => {
    if (pathwaysWithIntro.length > 0 && !selectedCarouselPathway) {
      // Skip intro card (index 0) and select first non-intro card
      const firstNonIntroCard = pathwaysWithIntro.find(card => 
        card.aircraftType !== '__wingmentor__' && card.id !== 'recommended-pathways-intro'
      );
      if (firstNonIntroCard) {
        setSelectedCarouselPathway(firstNonIntroCard);
      }
    }
  }, [pathwaysWithIntro, selectedCarouselPathway]);

  // Reset selection to skip intro cards when filtered pathways change
  useEffect(() => {
    if (pathwaysWithIntro.length > 0) {
      const currentIsIntro = selectedCarouselPathway?.aircraftType === '__wingmentor__' || selectedCarouselPathway?.id === 'recommended-pathways-intro';
      if (currentIsIntro) {
        const firstNonIntroCard = pathwaysWithIntro.find(card => 
          card.aircraftType !== '__wingmentor__' && card.id !== 'recommended-pathways-intro'
        );
        if (firstNonIntroCard) {
          setSelectedCarouselPathway(firstNonIntroCard);
        }
      }
    }
  }, [pathwaysWithIntro]);

  // Infinite scroll disabled - no scroll reset for recommended pathways

  // Ref for search input focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard navigation for arrow keys and search shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Arrow keys for carousel
      if (e.key === 'ArrowLeft') {
        scrollCarousel('left');
      } else if (e.key === 'ArrowRight') {
        scrollCarousel('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-scroll disabled - manual control only

  // Auto-select centered card on scroll
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Debounce scroll event
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const carouselRect = carousel.getBoundingClientRect();
        const viewportCenter = carouselRect.left + carouselRect.width / 2;
        
        // Find which card is closest to center
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        const cards = carousel.children;
        const cardElements: HTMLElement[] = [];
        
        // Collect only actual card elements
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i] as HTMLElement;
          if (card.classList.contains('flex-shrink-0')) {
            cardElements.push(card);
          }
        }
        
        for (let i = 0; i < cardElements.length; i++) {
          const card = cardElements[i];
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(viewportCenter - cardCenter);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        }
        
        // Skip first card (intro card) and only select if index > 0
        if (closestIndex > 0 && closestIndex < pathwaysWithIntro.length) {
          const centeredCard = pathwaysWithIntro[closestIndex];
          if (centeredCard && centeredCard.id !== selectedCarouselPathway?.id) {
            setSelectedCarouselPathway(centeredCard);
          }
        }
      }, 100); // 100ms debounce
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(scrollTimeout);
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, [pathwaysWithIntro, selectedCarouselPathway?.id]);

  const handleCalculateMatch = (pathwayId: string) => {
    const pathway = allPathways.find(p => p.id === pathwayId);
    if (pathway) {
      setSelectedPathwayForMatch(pathway);
    }
  };

  const handleNavigateToPathway = (pathwayId: string) => {

    // Check if this is the air-taxi pathway wingmentor card
    if ((pathwayId === 'wingmentor-05da1618-8398-4199-8993-90fd7353ac39' || pathwayId === 'wingmentor-intro-evtol') && onNavigate) {
      onNavigate('air-taxi-pathways');
      return;
    }

    // Check if this is the Military pathway
    if (pathwayId === '81753376-b823-4909-b82f-664acab13dae') {
      setShowMilitaryPathwaysPage(true);
    } else if (pathwayId === '7cbd80b9-1172-4b8a-b7e0-e975c91b3ee1' || pathwayId === 'cadet-programmes-commercial' || pathwayId === '39ec2271-baa1-441e-878f-958440c8678d' || pathwayId === 'c739dab5-33e5-4315-80d9-6e960f49387f') {
      setShowCommercialPilotPathwayPage(true);
    } else if (pathwayId === 'd36018dd-a116-4925-83ca-6acb414f4020' || pathwayId === 'de8a9cfd-34bd-47f2-bd5a-9afd6c96e1c5' || pathwayId === 'c43cf6ac-c644-4b38-9c51-84d784051037' || pathwayId === '7911f9f9-c2da-4732-b9da-8108ffefc416' || pathwayId === 'adfdacf6-211b-45b5-b62c-3b4af9757c58') {
      setShowSpecialPathwaysPage(true);
    } else if (pathwayId === 'aaa44819-37ec-40e7-a6cf-6d1990040d65' || pathwayId === 'a02f4e29-e165-415f-a3b3-669edbd7deb1' || pathwayId === 'cc996aa7-a075-4be7-beef-f917dd1f41db' || pathwayId === '54655935-92de-4aad-b82b-703152ffce25' || pathwayId === 'c89c9f97-b3f6-4955-9c34-3ae266a6ffc8' || pathwayId === '4d4b6568-3759-432e-9193-e0dba88425aa' || pathwayId === '078eea1a-271f-4392-a802-9a2ea4c36da0' || pathwayId === 'e94ba893-fa83-47b1-90f9-98905dc6685a' || pathwayId === '2acbf9f0-27cc-4094-9943-420572483c1e') {
      setShowLicensureTypeRatingPage(true);
    } else if (onNavigateToPathway) {
      onNavigateToPathway(pathwayId);
    } else {
    }
  };

  // Theme colors
  const bgGradient = isDarkMode
    ? 'bg-gradient-to-br from-black via-[#050a14] to-[#0d1f3c]'
    : 'bg-gradient-to-br from-slate-100 via-white to-slate-200';
  const headerBg = isDarkMode ? 'bg-slate-950/80' : 'bg-white/80';
  const borderColor = isDarkMode ? 'border-slate-800/50' : 'border-slate-200/50';
  const headerText = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const buttonBg = isDarkMode ? 'bg-slate-800/50 hover:bg-slate-700/50' : 'bg-slate-200/50 hover:bg-slate-300/50';
  const buttonText = isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900';

  // Align Profile Tools State
  const [isAlignProfileOpen, setIsAlignProfileOpen] = useState(false);
  const [alignProfileMatches, setAlignProfileMatches] = useState<PathwayMatch[]>([]);
  const [alignProfileLoading, setAlignProfileLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [recognitionScore, setRecognitionScore] = useState(52);
  const [engineProfile, setEngineProfile] = useState<LocalPilotProfile | null>(null);

  // Engine Debug Panel State
  const [showEngineDebug, setShowEngineDebug] = useState(false);
  const [engineStats, setEngineStats] = useState<{
    lastCalculationTime: number;
    pathwaysLoaded: number;
    matchesCalculated: number;
    avgMatchScore: number;
    algorithmVersion: string;
    profileFactors: Record<string, number>;
  } | null>(null);

  // Toggle debug panel with Ctrl+Shift+E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setShowEngineDebug(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load real pathway matches when Align Profile opens
  useEffect(() => {
    if (!isAlignProfileOpen) return;
    
    // Guard: Only load if user is authenticated
    if (!userProfile?.id) {
// [AUDIT] Removed console.log // line 5439
      setAlignProfileLoading(false);
      return;
    }
    
    const loadAlignProfileData = async () => {
      setAlignProfileLoading(true);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setAlignProfileLoading(false);
          return;
        }

        // Load pathways (from cache or fetch)
        let pathways: Pathway[] | null = getCachedPathways();
        if (!pathways) {
          const { data: pathwayData, error } = await supabase
            .from('pathways')
            .select('*')
            .eq('status', 'active');
          
          if (!error && pathwayData) {
            pathways = pathwayData;
            cachePathways(pathways);
          }
        }

        if (pathways) {
          pathwayEngine.setPathways(pathways);
        }

        // Load user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const localProfile = extractPilotProfile(profile);
          setEngineProfile(localProfile);
          pathwayEngine.setPilotProfile(localProfile);
          
          // Calculate matches
          const startTime = performance.now();
          const matches = pathwayEngine.recalculate();
          const endTime = performance.now();
          
          setAlignProfileMatches(matches.slice(0, 3)); // Top 3 matches
          
          // Calculate profile completion
          let completion = 0;
          if (localProfile.total_flight_hours > 0) completion += 20;
          if (localProfile.ratings.length > 0) completion += 20;
          if (localProfile.medical_class && localProfile.medical_expiry) completion += 20;
          if (localProfile.icao_english_level && localProfile.icao_english_level !== '0') completion += 20;
          if (localProfile.type_ratings.length > 0) completion += 20;
          setProfileCompletion(completion);
          
          // Set recognition score
          setRecognitionScore(localProfile.recognition_score);
          
          // Set engine stats
          const avgScore = matches.length > 0 
            ? Math.round(matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length)
            : 0;
          const stats = {
            lastCalculationTime: Math.round(endTime - startTime),
            pathwaysLoaded: pathwayEngine.getPathways().length,
            matchesCalculated: matches.length,
            avgMatchScore: avgScore,
            algorithmVersion: 'v1.0.0-browser',
            profileFactors: {
              total_hours: localProfile.total_flight_hours,
              ratings_count: localProfile.ratings.length,
              type_ratings_count: localProfile.type_ratings.length,
              medical_valid: localProfile.medical_class ? 1 : 0,
              english_level: parseInt(localProfile.icao_english_level) || 0,
              recognition_score: localProfile.recognition_score
            }
          };
// [AUDIT] Removed console.log // line 5523
          setEngineStats(stats);
        }
      } catch (err) {
        console.error('Failed to load align profile data:', err);
      } finally {
        setAlignProfileLoading(false);
      }
    };

    loadAlignProfileData();
  }, [isAlignProfileOpen, userProfile?.id]); // Re-run when auth state changes

  return (
    <>
    <div className={`min-h-screen ${bgGradient} relative`}>
      {/* MeshGradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          className="w-full h-full"
          colors={["#000000", "#050a14", "#0d1f3c", "#1e3a5f"]}
          speed={0.3}
        />
      </div>

      {/* Frosted glass blur overlay */}
      <div className="fixed inset-0 z-0 bg-white/5 backdrop-blur-md"></div>

      {/* Top Navigation Bar */}
      {!embedded && (
        <PlatformNavbar
          onNavigate={onNavigate || ((page) => window.location.href = `/${page}`)}
          currentPage="pathways"
        />
      )}

      {/* Content wrapper with higher z-index to sit above shader */}
      <div className="relative z-10 flex min-h-screen" style={{ paddingTop: embedded ? '16px' : '80px' }}>
        {/* MSFS 2024 Style Sidebar - Pathways Navigation - hidden when embedded */}
        {!embedded && (
          <PathwaysSidebar
            activeSection="pilot-pathways"
            onNavigate={onNavigate || ((page) => window.location.href = `/${page}`)}
            prScore={78}
            matchPercentage={82}
            topPathway="Commercial Airline"
            topAirline="Qatar Airways"
          />
        )}
        {/* Main content area - responsive margin for sidebar (removed when embedded) */}
        <main className="flex-1 w-full min-h-screen overflow-x-hidden" style={{ marginLeft: embedded ? '0' : '340px' }}>
          <div className="max-w-[calc(100vw-360px)] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Branding */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            pilotcareer<span className="text-red-500">pathways</span>.com
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            powered by pilot<span className="text-red-500">recognition</span>.com
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-3 flex justify-center">
          <div className="w-full max-w-2xl relative">
            <SearchBar ref={searchInputRef} onSearch={setSearchQuery} isDarkMode={false} />
          </div>
        </div>

        {/* Filter Pills - Replaceable */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 px-4">
          {!selectedPrimaryPill ? (
            // Primary pills
            <>
              {[
                { label: 'Low Timers', filter: 'low-time', key: 'low-timers' },
                { label: "CFI's", filter: 'cfi', key: 'cfi' },
                { label: 'Graduates', filter: 'graduate', key: 'graduates' },
                { label: 'PPL', filter: 'ppl', key: 'ppl' },
                { label: 'CPL', filter: 'cpl', key: 'cpl' },
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => {
                    setSelectedPrimaryPill(pill.key);
                    setActiveSubPills([]);
                    setSearchQuery(pill.filter);
                    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.value = pill.label;
                      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50"
                >
                  {pill.label}
                </button>
              ))}
              <button
                onClick={() => setShowMorePills(!showMorePills)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  showMorePills
                    ? 'border-red-500 bg-red-500 text-white hover:bg-red-600'
                    : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50'
                }`}
              >
                {showMorePills ? 'Show Less' : 'View More'}
              </button>
              {showMorePills && [
                { label: 'Type Rating', filter: 'type-rating', key: 'type-rating' },
                { label: 'Cargo', filter: 'cargo', key: 'cargo' },
                { label: 'Private Sector', filter: 'private', key: 'private-sector' },
                { label: 'Airline', filter: 'airline', key: 'airline' },
                { label: 'Military', filter: 'military', key: 'military' },
                { label: 'Drones / eVTOL', filter: 'drone', key: 'drones' },
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => {
                    setSelectedPrimaryPill(pill.key);
                    setActiveSubPills([]);
                    setSearchQuery(pill.filter);
                    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.value = pill.label;
                      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 animate-fadeIn"
                >
                  {pill.label}
                </button>
              ))}
            </>
          ) : (
            // Sub pills replacing primary
            <>
              <button
                onClick={() => {
                  setSelectedPrimaryPill(null);
                  setActiveSubPills([]);
                  setSearchQuery('');
                  const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.value = '';
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
                className="px-3 py-2 rounded-full text-sm font-medium transition-all border border-slate-500/30 bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 hover:text-slate-300"
              >
                ← Back
              </button>
              {selectedPrimaryPill === 'cpl' && ['IR', 'Multi Engine', 'Single Engine', 'Seaplane', 'ATPL'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    const isActive = activeSubPills.includes(sub);
                    const newActive = isActive ? activeSubPills.filter(s => s !== sub) : [...activeSubPills, sub];
                    setActiveSubPills(newActive);
                    setSearchQuery(`cpl ${newActive.map(s => s.toLowerCase()).join(' ')}`.trim());
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeSubPills.includes(sub)
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50'
                  }`}
                >
                  {sub}
                </button>
              ))}
              {selectedPrimaryPill === 'ppl' && ['Recreational', 'Night Rating', 'Tailwheel', 'Aerobatic', 'Glider Towing'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    const isActive = activeSubPills.includes(sub);
                    const newActive = isActive ? activeSubPills.filter(s => s !== sub) : [...activeSubPills, sub];
                    setActiveSubPills(newActive);
                    setSearchQuery(`ppl ${newActive.map(s => s.toLowerCase()).join(' ')}`.trim());
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeSubPills.includes(sub)
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50'
                  }`}
                >
                  {sub}
                </button>
              ))}
              {selectedPrimaryPill === 'low-timers' && ['0-250 hrs', 'Cadet Programs', 'Flight Schools', 'Ground Crew'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    const isActive = activeSubPills.includes(sub);
                    const newActive = isActive ? activeSubPills.filter(s => s !== sub) : [...activeSubPills, sub];
                    setActiveSubPills(newActive);
                    setSearchQuery(newActive.map(s => s.toLowerCase()).join(' ').trim() || 'low-time');
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeSubPills.includes(sub)
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50'
                  }`}
                >
                  {sub}
                </button>
              ))}
              {selectedPrimaryPill === 'cfi' && ['CFI-I', 'MEI', 'Check Airman', 'Part 141', 'Part 61'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    const isActive = activeSubPills.includes(sub);
                    const newActive = isActive ? activeSubPills.filter(s => s !== sub) : [...activeSubPills, sub];
                    setActiveSubPills(newActive);
                    setSearchQuery(newActive.map(s => s.toLowerCase()).join(' ').trim() || 'cfi');
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeSubPills.includes(sub)
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50'
                  }`}
                >
                  {sub}
                </button>
              ))}
              {selectedPrimaryPill === 'graduates' && ['First Job', 'Regional', 'Corporate', 'Cargo', 'Charter'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    const isActive = activeSubPills.includes(sub);
                    const newActive = isActive ? activeSubPills.filter(s => s !== sub) : [...activeSubPills, sub];
                    setActiveSubPills(newActive);
                    setSearchQuery(newActive.map(s => s.toLowerCase()).join(' ').trim() || 'graduate');
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeSubPills.includes(sub)
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </>
          )}
        </div>


        {/* Results count */}
        <div className="w-full mb-4 text-center">
          <p className={`${subText} text-sm`}>
            {filteredPathways.length} pathways available
          </p>
        </div>

        {/* Stage 1: Pathway Cards — filtered by selected pill */}
        <div className="relative w-full z-10 -mx-4 sm:-mx-6 lg:-mx-8">
            <style>{`
              .pathways-carousel::-webkit-scrollbar { display: none; }
              .pathways-carousel { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; scroll-snap-align: center; scroll-behavior: smooth; }
              .pathways-carousel > div { scroll-snap-align: center; }
              @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
              .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
            `}</style>

            {/* Stage 1 Carousel */}
            <div
              ref={carouselRef}
              className="pathways-carousel flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8"
              style={{ WebkitOverflowScrolling: 'touch', cursor: 'grab', minHeight: '300px', scrollSnapType: 'x mandatory' }}
              onMouseDown={(e) => {
                const el = carouselRef.current;
                if (!el) return;
                el.style.cursor = 'grabbing';
                const startX = e.pageX - el.offsetLeft;
                const scrollLeft = el.scrollLeft;
                const onMove = (me: MouseEvent) => { el.scrollLeft = scrollLeft - (me.pageX - el.offsetLeft - startX); };
                const onUp = () => {
                  el.style.cursor = 'grab';
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              {(() => {
                const selectedUUID = hierarchySelection.generalCategory;

                // When no pill selected: show a curated recommended mix from all buckets
                type RecommendedCard = { id: string; name: string; description: string; image: string; discoveryKey: string; tag: string; tagColor: string; };
                const RECOMMENDED_MIX: RecommendedCard[] = [
                  {
                    id: 'rec-cadet',
                    name: 'Cathay Pacific Cadet Programme',
                    description: 'Airline-sponsored pathway from zero hours — full training covered',
                    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg',
                    discoveryKey: 'cadet-programme',
                    tag: 'Cadet', tagColor: 'bg-blue-600',
                  },
                  {
                    id: 'rec-cargo',
                    name: 'FedEx Express Pilot',
                    description: 'Heavy cargo operations — $250K-$350K/year, global network',
                    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
                    discoveryKey: 'cargo',
                    tag: 'Cargo', tagColor: 'bg-emerald-600',
                  },
                  {
                    id: 'rec-private-sector',
                    name: 'NetJets Pilot Career',
                    description: 'Fractional ownership — home basing, premium pay, largest private fleet',
                    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
                    discoveryKey: 'privateSector',
                    tag: 'Private Sector', tagColor: 'bg-amber-600',
                  },
                  {
                    id: 'rec-type-rating',
                    name: 'Type Rating Pathways',
                    description: 'A320, B737, B777 type rating routes and approved training centres',
                    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
                    discoveryKey: 'type-rating',
                    tag: 'Type Rating', tagColor: 'bg-pink-600',
                  },
                  {
                    id: 'rec-flydubai',
                    name: 'FlyDubai Cadet Programme',
                    description: 'Full sponsorship, B737 MAX fleet, Dubai base, career progression',
                    image: 'https://cdn.uc.assets.prezly.com/5f1fd10f-a9bc-4bf0-aa29-b9a26dc42407/-/crop/1952x1066/0,272/-/preview/-/resize/1108x/-/quality/best/-/format/auto/',
                    discoveryKey: 'cadet-programme',
                    tag: 'Cadet', tagColor: 'bg-blue-600',
                  },
                  {
                    id: 'rec-airtaxi',
                    name: 'eVTOL & Air Taxi Pathways',
                    description: 'Emerging urban air mobility — Joby, Archer, Wisk and more',
                    image: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
                    discoveryKey: 'airtaxi-drones',
                    tag: 'Emerging', tagColor: 'bg-purple-600',
                  },
                  {
                    id: 'rec-private',
                    name: 'Private Pilot Pathway',
                    description: 'From recreational flying to CPL — structured certification route',
                    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
                    discoveryKey: 'private',
                    tag: 'Training', tagColor: 'bg-orange-600',
                  },
                  {
                    id: 'rec-ups',
                    name: 'UPS Airlines Captain',
                    description: 'Heavy cargo, Teamsters union, $240K-$320K/year — Louisville hub',
                    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
                    discoveryKey: 'cargo',
                    tag: 'Cargo', tagColor: 'bg-emerald-600',
                  },
                ];

                // ── Recommended mix (no pill selected) ──────────────────────
                if (!selectedUUID) {
                  return RECOMMENDED_MIX.map((rec, recIdx) => {
                    const isSelected = selectedStage1PathwayId === rec.id;
                    return (
                      <div
                        key={rec.id}
                        className={`flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
                        style={{ width: '720px', height: '290px', scrollSnapAlign: 'center', flexShrink: 0 }}
                        onClick={() => {
                          setStage1Index(recIdx);
                          setStage2Index(0);
                          setSelectedStage1PathwayId(rec.id);
                          setSelectedPathwayCard({
                            id: rec.id,
                            name: rec.name,
                            description: rec.description,
                            category: rec.discoveryKey as PathwayData['category'],
                            airline: 'Multiple Airlines',
                            locations: ['Global'],
                            matchProbability: 0.85,
                            image: rec.image,
                            aircraftType: '',
                            interestLevel: 'moderate' as const,
                            requirements: { totalHours: 0, typeRatings: [] },
                          });
                          setSelectedCarouselPathway(null);
                        }}
                      >
                        <div className="relative w-full h-full overflow-hidden rounded-xl bg-slate-800" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                          <img src={rec.image} alt={rec.name} className="w-full h-full object-cover block" loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/accessportal.png'; }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${rec.tagColor}`}>{rec.tag}</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h4 className="text-xl font-serif font-normal text-white leading-tight mb-1">{rec.name}</h4>
                            <p className="text-white/60 text-sm leading-snug line-clamp-2">{rec.description}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                }

                // ── Pill selected: show PATHWAYS[] for that category UUID ────
                // Pre-compute the cycling image pool for flight-schools once per render
                const fsRegionSchools = DUMMY_FLIGHT_SCHOOLS.filter(s =>
                  s.id !== 'wingmentor-intro' &&
                  s.image &&
                  !s.image.startsWith('https://images.unsplash') &&
                  (userCountryCode
                    ? (COUNTRY_TO_REGION[userCountryCode]?.region
                        ? s.region === COUNTRY_TO_REGION[userCountryCode].region
                        : true)
                    : true)
                );
                const fsCycleImg = fsRegionSchools.length > 0
                  ? fsRegionSchools[flightSchoolCardImgIdx % fsRegionSchools.length].image
                  : PATHWAY_IMAGES['flight-schools-category'];

                return PATHWAYS.filter(p => p.general_category_id === selectedUUID).map((item, itemIdx) => {
                  const isFlightSchools = item.id === 'flight-schools-category';
                  const imgSrc = isFlightSchools
                    ? (fsCycleImg || PATHWAY_IMAGES[item.id] || FALLBACK_IMAGES['flight-schools'])
                    : (PATHWAY_IMAGES[item.id] || FALLBACK_IMAGES['airline-pathways'] || '/images/accessportal.png');
                  const isSelected = selectedStage1PathwayId === item.id;
                  const discoveryKey = PATHWAY_UUID_TO_DISCOVERY_KEY[item.id];
                  const stage2Count = discoveryKey ? (DISCOVERY_PATHWAYS[discoveryKey]?.length ?? 0) : 0;

                  return (
                    <div
                      key={item.id}
                      className={`flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 ${isSelected ? 'ring-2 ring-sky-500' : ''}`}
                      style={{ width: '720px', height: '290px', scrollSnapAlign: 'center', flexShrink: 0 }}
                      onClick={() => {
                        if (discoveryKey) {
                          setStage1Index(itemIdx);
                          setStage2Index(0);
                          setSelectedStage1PathwayId(item.id);
                          setSelectedPathwayCard({
                            id: item.id,
                            name: item.name,
                            description: item.description,
                            category: discoveryKey as PathwayData['category'],
                            airline: 'Multiple Airlines',
                            locations: ['Global'],
                            matchProbability: 0.85,
                            image: imgSrc,
                            aircraftType: '',
                            interestLevel: 'moderate' as const,
                            requirements: { totalHours: 0, typeRatings: [] },
                          });
                          setSelectedCarouselPathway(null);
                        }
                      }}
                    >
                      <div className="relative w-full h-full overflow-hidden rounded-xl bg-slate-800" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                        <img
                          key={imgSrc}
                          src={imgSrc}
                          alt={item.name}
                          className="w-full h-full object-cover block"
                          loading="lazy"
                          style={{ transition: 'opacity 0.6s ease', animation: isFlightSchools ? 'fadeIn 0.6s ease' : undefined }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/accessportal.png'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h4 className="text-xl font-serif font-normal text-white leading-tight mb-1">{item.name}</h4>
                          <p className="text-white/60 text-sm leading-snug line-clamp-2">{item.description}</p>
                          {stage2Count > 0 && (
                            <p className="text-sky-400 text-xs mt-1.5 font-semibold">{stage2Count} pathways →</p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Stage 1 Navigation Arrows */}
            {(() => {
              const selectedUUID = hierarchySelection.generalCategory;
              // Build the same ordered list the carousel renders
              type S1Card = { id: string; name: string; description: string; image: string; discoveryKey: string };
              const stage1Cards: S1Card[] = selectedUUID
                ? PATHWAYS.filter(p => p.general_category_id === selectedUUID).map(item => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    image: PATHWAY_IMAGES[item.id] || FALLBACK_IMAGES['airline-pathways'] || '/images/accessportal.png',
                    discoveryKey: PATHWAY_UUID_TO_DISCOVERY_KEY[item.id] || '',
                  }))
                : [
                    { id: 'rec-cadet', name: 'Cathay Pacific Cadet Programme', description: 'Airline-sponsored pathway from zero hours — full training covered', image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg', discoveryKey: 'cadet-programme' },
                    { id: 'rec-cargo', name: 'FedEx Express Pilot', description: 'Heavy cargo operations — $250K-$350K/year, global network', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80', discoveryKey: 'cargo' },
                    { id: 'rec-airline', name: 'Emirates First Officer', description: 'Long-haul widebody — direct entry, competitive pay package', image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.jpg', discoveryKey: 'airline-pathways' },
                    { id: 'rec-private', name: 'Private Pilot Pathway', description: 'From recreational flying to CPL — structured certification route', image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80', discoveryKey: 'private' },
                    { id: 'rec-ups', name: 'UPS Airlines Captain', description: 'Heavy cargo, Teamsters union, $240K-$320K/year — Louisville hub', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80', discoveryKey: 'cargo' },
                  ];

              const selectCardAtIndex = (index: number) => {
                const card = stage1Cards[index];
                if (!card || !card.discoveryKey) return;
                setSelectedStage1PathwayId(card.id);
                setStage2Index(0);
                setStage2ViewFilter('All' as const);
                setStage2TypeRatingFilter('All');
                setSelectedPathwayCard({
                  id: card.id,
                  name: card.name,
                  description: card.description,
                  category: card.discoveryKey as PathwayData['category'],
                  airline: 'Multiple Airlines',
                  locations: ['Global'],
                  matchProbability: 0.85,
                  image: card.image,
                  aircraftType: '',
                  interestLevel: 'moderate' as const,
                  requirements: { totalHours: 0, typeRatings: [] },
                });
                setSelectedCarouselPathway(null);
              };

              const navigate = (dir: 1 | -1) => {
                const el = carouselRef.current;
                if (!el) return;
                const targetIndex = Math.max(0, Math.min(stage1Cards.length - 1, stage1Index + dir));
                const firstCard = el.querySelector<HTMLElement>(':scope > div');
                const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 736;
                // Center the target card in the viewport
                const scrollTarget = targetIndex * cardWidth - (el.clientWidth / 2) + (cardWidth / 2) - 8;
                el.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
                setStage1Index(targetIndex);
                // Select after scroll animation (~400ms)
                setTimeout(() => selectCardAtIndex(targetIndex), 420);
              };

              return null;
            })()}
          </div>

          {/* Carousel Navigation Arrows - Overlaying cards */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => {
                const el = carouselRef.current;
                if (!el) return;
                const firstCard = el.querySelector<HTMLElement>(':scope > div');
                const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 736;
                el.scrollTo({ left: Math.max(0, el.scrollLeft - cardWidth), behavior: 'smooth' });
              }}
              className="p-3 rounded-full border transition-all flex-shrink-0 backdrop-blur-md border-white/10 bg-white/10 text-white hover:bg-white/20 hover:text-white shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => {
                const el = carouselRef.current;
                if (!el) return;
                const firstCard = el.querySelector<HTMLElement>(':scope > div');
                const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 736;
                el.scrollTo({ left: el.scrollLeft + cardWidth, behavior: 'smooth' });
              }}
              className="p-3 rounded-full border transition-all flex-shrink-0 backdrop-blur-md border-white/10 bg-white/10 text-white hover:bg-white/20 hover:text-white shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stage 2: Pathways Carousel - Shows when a category is selected */}
          {selectedPathwayCard && (
            <div className="mt-12 w-full">
              <div className="mb-6">
                <h3
                  className="text-2xl md:text-3xl font-normal text-white mb-2"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {selectedPathwayCard.name}
                </h3>
                <p className={`${subText} text-sm`}>
                  {selectedPathwayCard.description}
                </p>
              </div>

              {/* Type Rating filter pills */}
              {selectedPathwayCard.category === 'type-rating' && (() => {
                const TR_FILTERS = [
                  { label: 'All', group: null },
                  { label: 'Instrument Rating (IR)', group: 'Licensure' },
                  { label: 'Multi-Engine (ME)', group: 'Licensure' },
                  { label: 'ATPL', group: 'Licensure' },
                  { label: 'MCC / JOC', group: 'Licensure' },
                  { label: 'UPRT', group: 'Licensure' },
                  { label: 'Airbus Rating', group: 'Type Rating' },
                  { label: 'ATR Rating', group: 'Type Rating' },
                  { label: 'Boeing Rating', group: 'Type Rating' },
                  { label: 'Widebody', group: 'Type Rating' },
                  { label: 'Narrowbody', group: 'Type Rating' },
                ];
                const licensureFilters = TR_FILTERS.filter(f => f.group === 'Licensure' || f.label === 'All');
                const typeRatingFilters = TR_FILTERS.filter(f => f.group === 'Type Rating');
                return (
                  <div className="flex flex-col gap-3 mb-6">
                    {/* View toggle — separate pathways from flight schools */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Show</span>
                      {(['All', 'Type Rating Centers', 'Flight School (ATO)', 'Special Ratings'] as const).map(v => (
                        <button
                          key={v}
                          onClick={() => { setStage2ViewFilter(v); setStage2Index(0); }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                            stage2ViewFilter === v
                              ? 'bg-white text-slate-900 border-white'
                              : 'border-white/15 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {licensureFilters.map(f => (
                        <button
                          key={f.label}
                          onClick={() => { setStage2TypeRatingFilter(f.label); setStage2Index(0); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            stage2TypeRatingFilter === f.label
                              ? 'bg-pink-500 border-pink-500 text-white'
                              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pl-2 border-l border-pink-500/30">
                      {typeRatingFilters.map(f => (
                        <button
                          key={f.label}
                          onClick={() => { setStage2TypeRatingFilter(f.label); setStage2Index(0); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            stage2TypeRatingFilter === f.label
                              ? 'bg-pink-500 border-pink-500 text-white'
                              : 'border-pink-500/20 bg-pink-500/5 text-pink-300/70 hover:bg-pink-500/10 hover:text-pink-200'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Region + Country filter — all Stage 2 categories except military */}
              {selectedPathwayCard.category !== 'military' && (() => {
                const REGION_COUNTRIES: Record<string, string[]> = {
                  'Asia': ['All Countries', 'Philippines', 'Singapore'],
                  'Europe': ['All Countries', 'Germany'],
                  'Americas': ['All Countries', 'USA'],
                  'Oceania': ['All Countries', 'Australia'],
                  'Middle East': ['All Countries', 'UAE'],
                  'Africa': ['All Countries', 'South Africa'],
                };
                const regions = ['All', ...Object.keys(REGION_COUNTRIES)];
                const countries = stage2RegionFilter !== 'All' ? REGION_COUNTRIES[stage2RegionFilter] || [] : [];
                const nearestMatch = userCountryCode ? COUNTRY_TO_REGION[userCountryCode] : null;
                const LISTED_COUNTRIES = ['Philippines', 'Singapore', 'Germany', 'USA', 'Australia', 'UAE', 'South Africa'];
                const isNearestActive = stage2NearestSort;
                return (
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {/* Nearest to You pill — only shown when IP lat/lng is known */}
                    {userLatLng && (
                      <button
                        onClick={() => {
                          setStage2NearestSort(true);
                          const match = userCountryCode ? COUNTRY_TO_REGION[userCountryCode] : null;
                          const LISTED = ['Philippines', 'Singapore', 'Germany', 'USA', 'Australia', 'UAE', 'South Africa'];
                          setStage2RegionFilter(match?.region || 'All');
                          setStage2CountryFilter(match && LISTED.includes(match.country) ? match.country : 'All');
                          setStage2Index(0);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${isNearestActive ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300'}`}
                      >
                        <span>📍</span> Nearest to You
                      </button>
                    )}
                    {/* Region pills */}
                    <div className="flex flex-wrap gap-2">
                      {regions.map(r => (
                        <button
                          key={r}
                          onClick={() => { setStage2RegionFilter(r); setStage2CountryFilter('All'); setStage2NearestSort(false); setStage2Index(0); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${stage2RegionFilter === r ? 'bg-sky-500 border-sky-500 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    {/* Country sub-filter */}
                    {stage2RegionFilter !== 'All' && countries.length > 1 && (
                      <div className="flex flex-wrap gap-2 pl-2 border-l border-white/10">
                        {countries.map(c => (
                          <button
                            key={c}
                            onClick={() => { setStage2CountryFilter(c === 'All Countries' ? 'All' : c); setStage2NearestSort(false); setStage2Index(0); }}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all border ${(c === 'All Countries' ? stage2CountryFilter === 'All' : stage2CountryFilter === c) ? 'bg-white/20 border-white/30 text-white' : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Stage 2: Individual Pathways for Selected Category */}
              <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                <div 
                  ref={stage2Ref}
                  className="pathways-carousel flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth',
                  }}
                >
                {(() => {
                  // Pull Stage 2 cards directly from DISCOVERY_PATHWAYS — bypasses the filteredPathways
                  // pipeline which breaks when a hierarchy pill is selected (allPathways uses categoryPathways then)
                  const discoveryKey = selectedPathwayCard.category;
                  let rawCards: PathwayJob[] = DISCOVERY_PATHWAYS[discoveryKey] || [];
// [AUDIT] Removed console.log // line 6273
                  // Apply type-rating filter + inject matching flight schools
                  if (discoveryKey === 'type-rating') {
                    // Inject UUID licensure sub-pathway cards (they are not in DISCOVERY_PATHWAYS)
                    const LICENSURE_SUB_PATHWAY_CARDS: PathwayJob[] = [
                      { id: 'a02f4e29-e165-415f-a3b3-669edbd7deb1', title: 'Type Rating Centers', company: 'CAE / FlightSafety / Approved ATOs', matchPercentage: 95, location: 'Clark, Philippines · Dubai, UAE · London, UK', type: 'Type Rating Centers', salary: '$18,000 – $50,000', requirements: ['CPL + IR + ME', 'Class 1 Medical'], tags: ['A320', 'B737', 'A330', 'B777', 'ATR'], postedAt: 'Open Enrollment', image: 'https://www.caepacific.com/wp-content/uploads/2021/03/CAE-Philippines-Training-Center.jpg' },
                      { id: 'cc996aa7-a075-4be7-beef-f917dd1f41db', title: 'Instrument Rating Pathway', company: 'CAAP-Approved Flight Schools', matchPercentage: 92, location: 'Philippines · USA · Europe', type: 'Licensure', salary: '$10,000 – $18,000', requirements: ['PPL or CPL', 'Class 1 Medical'], tags: ['Instrument Rating', 'IFR', 'IR'], postedAt: 'Open Enrollment', image: 'https://media.pea.com/wp-content/uploads/2023/06/altfull-view-of-G1000-Avionics-of-Cessna-172-1024x607.jpeg' },
                      { id: '54655935-92de-4aad-b82b-703152ffce25', title: 'ATPL Pathway', company: 'Various ATOs', matchPercentage: 90, location: 'Philippines · Australia · USA', type: 'Licensure', salary: 'ATPL Theory: $3,000–$8,000', requirements: ['CPL + IR + ME', 'Class 1 Medical'], tags: ['ATPL', 'Hour Building', 'Airline'], postedAt: 'Open Enrollment', image: 'https://www.wingpath.in/blog_images/what-is-atpl-in-india-6ihgy-1000x700.png' },
                      { id: 'e94ba893-fa83-47b1-90f9-98905dc6685a', title: 'Multi-Engine Rating', company: 'CAAP-Approved Flight Schools', matchPercentage: 91, location: 'Philippines · USA · Australia', type: 'Licensure', salary: '$8,000 – $15,000', requirements: ['PPL or CPL', 'Class 1 Medical'], tags: ['Multi-Engine', 'MER', 'ME'], postedAt: 'Open Enrollment', image: 'https://cdn.prod.website-files.com/67b7f6762c0ae79aa3b1f3b0/6813ec96ef44eea3df482f3d_N53TW%203.jpg' },
                      { id: '4d4b6568-3759-432e-9193-e0dba88425aa', title: 'CFI Rating Pathway', company: 'CAAP-Approved Flight Schools', matchPercentage: 88, location: 'Philippines · USA · Australia', type: 'Licensure', salary: 'Training: $5,000–$10,000', requirements: ['CPL + IR', 'Class 1 Medical'], tags: ['CFI', 'Instructor', 'Hour Building'], postedAt: 'Open Enrollment', image: 'https://media.pea.com/wp-content/uploads/2023/06/flight-instructor-training-1024x607.jpeg' },
                      { id: '078eea1a-271f-4392-a802-9a2ea4c36da0', title: 'UPRT Rating', company: 'CAAP-Approved ATOs', matchPercentage: 86, location: 'Philippines · USA · Europe', type: 'Special Rating', salary: '$2,500 – $5,000', requirements: ['CPL or ATPL', 'Class 1 Medical'], tags: ['UPRT', 'Upset Recovery', 'Safety'], postedAt: 'Open Enrollment', image: 'https://www.flight-safety.com/wp-content/uploads/2021/06/uprt-training.jpg' },
                      { id: 'c89c9f97-b3f6-4955-9c34-3ae266a6ffc8', title: 'Seaplane Rating', company: 'CAAP-Approved Seaplane Operators', matchPercentage: 82, location: 'Philippines · Canada · USA', type: 'Special Rating', salary: '$3,000 – $8,000', requirements: ['PPL or higher', 'Class 2 Medical'], tags: ['Seaplane', 'Floatplane', 'Water Ops'], postedAt: 'Open Enrollment', image: 'https://images.unsplash.com/photo-1507199129876-44d2b3190c1a?w=800&q=80' },
                    ];
                    rawCards = [...rawCards, ...LICENSURE_SUB_PATHWAY_CARDS];
                    const f = stage2TypeRatingFilter;

                    // Helper: does an offering string match the active filter?
                    const offeringMatches = (o: string) => {
                      const ol = o.toLowerCase();
                      if (f === 'All') return true;
                      if (f === 'Instrument Rating (IR)') return ol.includes('instrument') || ol.includes(' ir)') || ol.includes('(ir)');
                      if (f === 'Multi-Engine (ME)') return ol.includes('multi-engine') || ol.includes('multi engine') || ol.includes('mer') || ol.includes('(me)');
                      if (f === 'ATPL') return ol.includes('atpl');
                      if (f === 'MCC / JOC') return ol.includes('mcc') || ol.includes('joc') || ol.includes('jet orientation');
                      if (f === 'UPRT') return ol.includes('uprt') || ol.includes('upset');
                      if (f === 'Airbus Rating') return ol.includes('a320') || ol.includes('a330') || ol.includes('airbus');
                      if (f === 'ATR Rating') return ol.includes('atr');
                      if (f === 'Boeing Rating') return ol.includes('b737') || ol.includes('b777') || ol.includes('b787') || ol.includes('boeing');
                      if (f === 'Widebody') return ol.includes('b777') || ol.includes('b787') || ol.includes('a330') || ol.includes('widebody');
                      if (f === 'Narrowbody') return ol.includes('a320') || ol.includes('b737') || ol.includes('narrowbody');
                      return false;
                    };

                    // Filter the dedicated type-rating cards
                    if (f !== 'All') {
                      rawCards = rawCards.filter(j => {
                        const allText = j.title.toLowerCase() + ' ' + (j.tags || []).join(' ').toLowerCase();
                        if (f === 'Instrument Rating (IR)') return allText.includes('instrument') || allText.includes(' ir ');
                        if (f === 'Multi-Engine (ME)') return allText.includes('multi') || allText.includes('multi-engine') || allText.includes('me rating');
                        if (f === 'ATPL') return allText.includes('atpl');
                        if (f === 'MCC / JOC') return allText.includes('mcc') || allText.includes('joc') || allText.includes('jet orientation');
                        if (f === 'UPRT') return allText.includes('uprt') || allText.includes('upset');
                        if (f === 'Airbus Rating') return allText.includes('airbus') || allText.includes('a320') || allText.includes('a330');
                        if (f === 'ATR Rating') return allText.includes('atr');
                        if (f === 'Boeing Rating') return allText.includes('boeing') || allText.includes('b737') || allText.includes('b777') || allText.includes('b787');
                        if (f === 'Widebody') return allText.includes('widebody') || allText.includes('b777') || allText.includes('b787') || allText.includes('a330');
                        if (f === 'Narrowbody') return allText.includes('narrowbody') || allText.includes('a320') || allText.includes('b737');
                        return true;
                      });
                    }

                    // Inject flight schools that offer this rating
                    const matchingSchools = DUMMY_FLIGHT_SCHOOLS.filter(s =>
                      s.id !== 'wingmentor-intro' &&
                      (s.offerings || []).some(o => offeringMatches(o))
                    );
                    const schoolCards: PathwayJob[] = matchingSchools.map(s => ({
                      id: s.id,
                      title: s.name,
                      company: s.location,
                      matchPercentage: Math.round(s.rating * 20),
                      location: s.location,
                      type: 'Flight School',
                      salary: s.price,
                      requirements: ['Medical Certificate', 'English Proficiency'],
                      tags: [s.region, f === 'All' ? 'Offers Training' : `Offers ${f}`, 'CAAP Approved'],
                      postedAt: 'Open Enrollment',
                      image: s.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
                      claimed: s.claimed ?? false,
                    }));
                    rawCards = [...rawCards, ...schoolCards];

                    // Apply view filter — separate sub-pathway cards from flight school cards
                    const TYPE_RATING_CENTER_UUIDS = new Set([
                      'a02f4e29-e165-415f-a3b3-669edbd7deb1', // Type Rating Centers
                      'cc996aa7-a075-4be7-beef-f917dd1f41db', // Instrument Rating
                      '54655935-92de-4aad-b82b-703152ffce25', // ATPL Pathway
                      'e94ba893-fa83-47b1-90f9-98905dc6685a', // Multi-Engine Rating
                      '4d4b6568-3759-432e-9193-e0dba88425aa', // CFI Rating
                    ]);
                    const SPECIAL_RATING_UUIDS = new Set([
                      '078eea1a-271f-4392-a802-9a2ea4c36da0', // UPRT
                      'c89c9f97-b3f6-4955-9c34-3ae266a6ffc8', // Seaplane Rating
                    ]);
                    const SPECIAL_RATING_SCHOOL_IDS = new Set([
                      'flight-school-33', // Camiguin Aviation — UPRT/aerobatics specialist
                    ]);
                    const ALL_PATHWAY_UUIDS = new Set([...TYPE_RATING_CENTER_UUIDS, ...SPECIAL_RATING_UUIDS]);
                    if (stage2ViewFilter === 'Type Rating Centers') {
                      rawCards = rawCards.filter(j => TYPE_RATING_CENTER_UUIDS.has(j.id));
                    } else if (stage2ViewFilter === 'Special Ratings') {
                      rawCards = rawCards.filter(j => SPECIAL_RATING_UUIDS.has(j.id) || SPECIAL_RATING_SCHOOL_IDS.has(j.id));
                    } else if (stage2ViewFilter === 'Flight School (ATO)') {
                      rawCards = rawCards.filter(j => !ALL_PATHWAY_UUIDS.has(j.id) && !SPECIAL_RATING_SCHOOL_IDS.has(j.id));
                    }
                  }
                  // Apply region/country/nearest filter for all non-military categories
                  if (discoveryKey !== 'military') {
                    if (stage2NearestSort && userLatLng) {
                      // Haversine distance sort — school cards get real distance, dedicated TR cards (no lat/lng) pushed to end
                      const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
                        const R = 6371;
                        const dLat = (lat2 - lat1) * Math.PI / 180;
                        const dLng = (lng2 - lng1) * Math.PI / 180;
                        const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2) ** 2;
                        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                      };
                      const schoolWithCoords = DUMMY_FLIGHT_SCHOOLS.filter(s => s.id !== 'wingmentor-intro' && s.lat && s.lng);
                      rawCards = rawCards
                        .map(j => {
                          const school = schoolWithCoords.find(s => s.id === j.id);
                          const dist = school ? haversine(userLatLng.lat, userLatLng.lng, school.lat!, school.lng!) : 99999;
                          return { ...j, _dist: dist };
                        })
                        .sort((a, b) => (a as any)._dist - (b as any)._dist);
                    } else {
                      if (stage2RegionFilter !== 'All') {
                        rawCards = rawCards.filter(j => j.tags?.[0] === stage2RegionFilter);
                      }
                      if (stage2CountryFilter !== 'All') {
                        rawCards = rawCards.filter(j => j.location?.includes(stage2CountryFilter));
                      }
                    }
                  }
                  // Convert PathwayJob → PathwayData shape for rendering
                  const stage2Cards: PathwayData[] = rawCards.map(j => ({
                    id: j.id,
                    name: j.title,
                    airline: j.company,
                    description: j.salary || '',
                    image: (j.image && !j.image.startsWith('wingmentor')) ? j.image : '',
                    category: discoveryKey as PathwayData['category'],
                    matchProbability: j.matchPercentage,
                    aircraftType: j.image?.startsWith('wingmentor') ? '__wingmentor__' : 'generic',
                    interestLevel: j.postedAt === 'Hiring Now' ? 'high_interest' : j.postedAt === 'Limited Slots' ? 'limited' : 'moderate',
                    locations: [j.location],
                    requirements: { totalHours: 0, typeRatings: [] },
                    claimed: (j as any).claimed ?? false,
                  }));
                  // Also include any live enterprise cards matching this category
                  const enterpriseForCategory = enterprisePathwayCards.filter(p => p.category === discoveryKey);
                  const allStage2 = [...enterpriseForCategory, ...stage2Cards];
                  stage2CardsRef.current = allStage2;
// [AUDIT] Removed console.log // line 6416
                  return allStage2.length > 0 ? (
                  allStage2.map((pathway, idx) => {
                  const cardAirlineLogo = getAirlineLogo(pathway.airline);
                  const isPilotRecognitionCard = pathway.aircraftType === '__wingmentor__' || pathway.aircraftType === '__intro__';
                  const isIntroCard = pathway.id === 'recommended-pathways-intro';
                  const cardAircraftImage = isPilotRecognitionCard
                    ? '/logo.png'
                    : (pathway.image && !pathway.image.startsWith('wingmentor') ? pathway.image : (FALLBACK_IMAGES[pathway.category] || FALLBACK_IMAGES['cadet-programme']));
                  const isSelected = selectedCarouselPathway?.id === pathway.id;
                  return (
                    <div
                      key={`${pathway.id}-${idx}`}
                      id={`pathway-card-${pathway.id}`}
                      className={`flex-shrink-0 cursor-pointer rounded-2xl transition-all duration-300 ${isSelected ? 'ring-2 ring-sky-500 scale-[1.02]' : 'hover:scale-[1.01]'}`}
                      style={{ 
                        width: '720px', 
                        height: '340px',
                        scrollSnapAlign: 'center',
                      }}
                      onClick={() => {
                        setSelectedCarouselPathway(pathway);
                        // Center this card in the viewport
                        const el = stage2Ref.current;
                        if (el) {
                          const firstCard = el.querySelector<HTMLElement>(':scope > div');
                          const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 736;
                          const scrollTarget = idx * cardWidth - (el.clientWidth / 2) + (cardWidth / 2) - 8;
                          el.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
                        }
                        setStage2Index(idx);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        const cardId = `pathway-card-${pathway.id}`;
                        navigator.clipboard.writeText(cardId);
                        addToast('success', 'Card ID Copied!', cardId);
                      }}
                    >
                      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-slate-800" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
                        <img
                          src={cardAircraftImage}
                          alt={pathway.name}
                          className="w-full h-full object-cover block"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = FALLBACK_IMAGES[pathway.category] || FALLBACK_IMAGES['cadet-programme'];
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        {/* Claimed / Unclaimed badge */}
                        {(discoveryKey === 'flight-schools' || discoveryKey === 'type-rating') && (
                          <div className="absolute top-3 left-3 flex flex-col gap-1">
                            {pathway.claimed ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-sky-600/90 backdrop-blur-sm">
                                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                Claimed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white/80 bg-black/40 backdrop-blur-sm border border-white/10">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M12 8v4m0 4h.01"/></svg>
                                Unverified
                              </span>
                            )}
                            {pathway.interestLevel === 'high_interest' && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-green-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                Hiring
                              </span>
                            )}
                          </div>
                        )}
                        {discoveryKey !== 'flight-schools' && discoveryKey !== 'type-rating' && pathway.interestLevel === 'high_interest' && (
                          <div className="absolute top-3 left-3">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-green-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              Hiring
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="text-sm font-serif font-normal text-white leading-tight mb-0.5 line-clamp-1">{pathway.name}</h4>
                          <p className="text-white/70 text-xs line-clamp-1">{pathway.airline}</p>
                          <p className="text-white/50 text-[10px] line-clamp-1">{pathway.locations?.[0]}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No pathways found for this category</p>
              );
                })()}
            </div>
            </div>

            {/* Stage 2 navigation arrows */}
            {(() => {
              const totalCards = stage2CardsRef.current.length;
              if (totalCards <= 1) return null;
              const navigateStage2 = (dir: 1 | -1) => {
                const el = stage2Ref.current;
                if (!el) return;
                const targetIndex = Math.max(0, Math.min(totalCards - 1, stage2Index + dir));
                const firstCard = el.querySelector<HTMLElement>(':scope > div');
                const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 736;
                const scrollTarget = targetIndex * cardWidth - (el.clientWidth / 2) + (cardWidth / 2) - 8;
                el.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
                setStage2Index(targetIndex);
                // Also select the card
                const card = stage2CardsRef.current[targetIndex];
                if (card) setSelectedCarouselPathway(card);
              };
              return (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    onClick={() => navigateStage2(-1)}
                    disabled={stage2Index === 0}
                    className="p-3 rounded-full border transition-all flex-shrink-0 backdrop-blur-md border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-white/40 text-xs tabular-nums">{stage2Index + 1} / {totalCards}</span>
                  <button
                    onClick={() => navigateStage2(1)}
                    disabled={stage2Index === totalCards - 1}
                    className="p-3 rounded-full border transition-all flex-shrink-0 backdrop-blur-md border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              );
            })()}

            {/* Type Rating / Licensure Detail Panel — appears when a Stage 2 card is selected under type-rating */}
            {selectedCarouselPathway && selectedPathwayCard?.category === 'type-rating' && (() => {
              const cardId = selectedCarouselPathway.id;
              const isSchoolCard = DUMMY_FLIGHT_SCHOOLS.some(s => s.id === cardId);
              const school = DUMMY_FLIGHT_SCHOOLS.find(s => s.id === cardId);

              // For school cards shown in type-rating context — show what offering matched
              if (isSchoolCard && school) {
                const matchedOfferings = (school.offerings || []).filter(o => {
                  const f = stage2TypeRatingFilter;
                  const ol = o.toLowerCase();
                  if (f === 'All') return true;
                  if (f === 'Instrument Rating (IR)') return ol.includes('instrument') || ol.includes('(ir)');
                  if (f === 'Multi-Engine (ME)') return ol.includes('multi-engine') || ol.includes('(me)') || ol.includes('mer');
                  if (f === 'ATPL') return ol.includes('atpl');
                  if (f === 'MCC / JOC') return ol.includes('mcc') || ol.includes('joc');
                  if (f === 'UPRT') return ol.includes('uprt') || ol.includes('upset');
                  if (f === 'Airbus Rating') return ol.includes('a320') || ol.includes('a330') || ol.includes('airbus');
                  if (f === 'ATR Rating') return ol.includes('atr');
                  if (f === 'Boeing Rating') return ol.includes('b737') || ol.includes('b777') || ol.includes('b787') || ol.includes('boeing');
                  if (f === 'Widebody') return ol.includes('b777') || ol.includes('b787') || ol.includes('a330') || ol.includes('widebody');
                  if (f === 'Narrowbody') return ol.includes('a320') || ol.includes('b737') || ol.includes('narrowbody');
                  return false;
                });
                const hasMultiEngine = (school.fleet || []).some(f => f.toLowerCase().includes('multi') || f.toLowerCase().includes('twin') || f.toLowerCase().includes('seneca') || f.toLowerCase().includes('baron') || f.toLowerCase().includes('aztec') || f.toLowerCase().includes('navajo'));
                const activeTab = trSchoolTab;
                const tf = stage2TypeRatingFilter;
                const isIR = tf.includes('Instrument');
                const isME = tf.includes('Multi-Engine') || tf.includes('(ME)');
                const isATR = tf.includes('ATR');
                const isAirbus = tf.includes('Airbus') || tf.includes('A320');
                const isBoeing = tf.includes('Boeing') || tf.includes('B737');
                const isWidebody = tf.includes('Widebody');
                const isNarrowbody = tf.includes('Narrowbody');
                const isTypeRating = isAirbus || isBoeing || isATR || isWidebody || isNarrowbody;
                const isMCC = tf.includes('MCC') || tf.includes('JOC');
                const isUPRT = tf.includes('UPRT');
                const isATRL = tf === 'ATPL';
                const ratingLabel = tf === 'All' ? 'this rating' : tf;
                const demandDataComputed = isTypeRating ? [
                  { label: 'Airline Demand', value: 'Type-rated pilots hired 2–3× faster than non-rated', icon: '📈' },
                  { label: 'Global Shortage', value: 'Boeing forecasts 674,000 new pilots needed by 2042', icon: '🌏' },
                  { label: `${tf} Demand`, value: 'Narrowbody & widebody demand remains highest in ASEAN', icon: '✈️' },
                ] : isIR ? [
                  { label: 'IR Demand', value: 'IR is the gateway to CPL and all IFR operations', icon: '📡' },
                  { label: 'Career Gate', value: 'Required for all airline and charter employment', icon: '🎯' },
                  { label: 'Regional Growth', value: 'Instrument-rated pilots preferred by regional operators', icon: '📈' },
                ] : isME ? [
                  { label: 'MER Demand', value: 'Multi-engine rating unlocks turboprop & jet pathways', icon: '✈️' },
                  { label: 'Airline Requirement', value: 'Most Philippine airlines require MER before type rating', icon: '🎯' },
                  { label: 'Career Step', value: 'Bridges CPL to first officer assessment eligibility', icon: '📈' },
                ] : isMCC ? [
                  { label: 'MCC / JOC Demand', value: 'Required by most airlines before type rating assessment', icon: '🎯' },
                  { label: 'CRM Focus', value: 'Evaluates crew resource management in multi-crew ops', icon: '👥' },
                  { label: 'Airline Prerequisite', value: 'Most cadet and ab-initio pathways require MCC completion', icon: '📈' },
                ] : isUPRT ? [
                  { label: 'UPRT Mandate', value: 'ICAO mandated UPRT for all CPL holders globally', icon: '⚠️' },
                  { label: 'Safety Critical', value: 'LOC-I is #1 cause of fatal accidents — UPRT addresses this', icon: '🛡️' },
                  { label: 'Regulatory', value: 'CAAP requires UPRT endorsement for CPL renewal in some categories', icon: '📋' },
                ] : isATRL ? [
                  { label: 'ATPL Demand', value: 'ATPL is the pinnacle — required for Airline Captain command', icon: '🏅' },
                  { label: 'Frozen ATPL', value: 'Airlines hire FO candidates with "Frozen ATPL" while building hours', icon: '❄️' },
                  { label: 'Philippine Requirement', value: 'CAAP ATPL requires 1,500 hrs total time including 500 hrs PIC', icon: '📋' },
                ] : [
                  { label: 'ASEAN Pilot Shortage', value: '~22,000 pilots needed across ASEAN by 2033', icon: '📈' },
                  { label: 'Philippines Growth', value: 'CAAP targeting 3× pilot output by 2028', icon: '🇵🇭' },
                  { label: 'Rating Demand', value: `${ratingLabel} holders are in active demand by regional carriers`, icon: '✈️' },
                ];
                const demandData = school.aboutDemandData && school.aboutDemandData.length > 0 ? school.aboutDemandData : demandDataComputed;
                const schoolStatementComputed = isTypeRating
                  ? `This school offers ${ratingLabel} training aligned with CAAP and ICAO simulator standards. Type rating completions here are recognised by Philippine and regional airlines for direct entry assessment.`
                  : isME
                  ? `This school's multi-engine programme uses CAAP-approved aircraft. Completion of MER here directly supports your eligibility for turboprop and jet type rating assessments.`
                  : isIR
                  ? `Instrument Rating training at this school prepares candidates for IFR operations on single and multi-engine aircraft. Essential step before any commercial airline pathway.`
                  : isMCC
                  ? `MCC/JOC courses here simulate real airline multi-crew operations. Completing MCC is typically a requirement before attending airline type rating assessment centres.`
                  : isUPRT
                  ? `UPRT training addresses Loss of Control In-flight — the leading cause of fatal accidents. ICAO-aligned programme that satisfies CAAP endorsement requirements.`
                  : isATRL
                  ? `ATPL ground school and flight training at this facility prepares candidates for the CAAP ATPL written exams and flight tests. Required for airline command authority.`
                  : `Training the next generation of Filipino aviators — from first solo to airline-ready. Transparency in progress, commitment to standards.`;
                const schoolStatement = school.aboutStatement || schoolStatementComputed;
                const expectationsTitle = isTypeRating ? `For ${tf} Training` : isME ? 'For Multi-Engine Rating' : isIR ? 'For Instrument Rating' : isMCC ? 'For MCC / JOC Course' : isUPRT ? 'For UPRT Training' : isATRL ? 'For ATPL Training' : `For ${ratingLabel}`;
                const pilotLabelsComputed = isTypeRating ? [
                  { label: 'CPL + MER + IR', hrs: 'Pre-requisite', desc: 'You must hold a CPL with Multi-Engine and Instrument Rating before type rating entry.', accent: 'border-red-500/40 bg-red-500/20', badge: 'bg-red-500/30 text-red-200' },
                  { label: 'Low-Hour FO', hrs: '200–500 hrs', desc: 'Freshly type-rated FO candidates. Most airlines accept directly into assessment.', accent: 'border-sky-500/40 bg-sky-500/15', badge: 'bg-sky-500/30 text-sky-200' },
                  { label: 'Experienced FO', hrs: '500–1500 hrs', desc: 'Stronger assessment position. Some airlines require 500 hrs before type rating entry.', accent: 'border-emerald-500/40 bg-emerald-500/15', badge: 'bg-emerald-500/30 text-emerald-200' },
                ] : isME ? [
                  { label: 'Low Timer', hrs: '< 200 hrs', desc: 'Too early for MER. Complete CPL + IR first before enrolling.', accent: 'border-red-500/40 bg-red-500/20', badge: 'bg-red-500/30 text-red-200' },
                  { label: 'CPL Holder', hrs: '200+ hrs', desc: 'Prime candidate for MER. Should hold valid CPL + IR before starting.', accent: 'border-amber-500/40 bg-amber-500/15', badge: 'bg-amber-500/30 text-amber-200' },
                  { label: 'CPL + IR', hrs: '250+ hrs', desc: 'Ideal entry point. Can proceed directly to MER and then type rating pathway.', accent: 'border-emerald-500/40 bg-emerald-500/15', badge: 'bg-emerald-500/30 text-emerald-200' },
                ] : isIR ? [
                  { label: 'PPL Holder', hrs: '50+ hrs', desc: 'Minimum stage to begin IR training. Requires additional instrument ground hours.', accent: 'border-sky-500/40 bg-sky-500/15', badge: 'bg-sky-500/30 text-sky-200' },
                  { label: 'CPL Student', hrs: '100+ hrs', desc: 'Typical stage for IR integration into CPL training programme.', accent: 'border-amber-500/40 bg-amber-500/15', badge: 'bg-amber-500/30 text-amber-200' },
                  { label: 'CPL Holder', hrs: '200+ hrs', desc: 'Adding standalone IR — required for all IFR and airline operations.', accent: 'border-emerald-500/40 bg-emerald-500/15', badge: 'bg-emerald-500/30 text-emerald-200' },
                ] : [
                  { label: 'Low Timer', hrs: '< 250 hrs', desc: 'Ab-initio or PPL stage. Best suited for full CPL programme entry.', accent: 'border-sky-500/40 bg-sky-500/15', badge: 'bg-sky-500/30 text-sky-200' },
                  { label: 'Mid Timer', hrs: '250–500 hrs', desc: 'CPL/IR training stage. Can enter rating courses.', accent: 'border-amber-500/40 bg-amber-500/15', badge: 'bg-amber-500/30 text-amber-200' },
                  { label: 'High Timer', hrs: '500+ hrs', desc: 'Rating complete or ATPL eligible. Competitive for airline pathway.', accent: 'border-emerald-500/40 bg-emerald-500/15', badge: 'bg-emerald-500/30 text-emerald-200' },
                ];
                const accentMap = ['border-sky-500/40 bg-sky-500/15', 'border-amber-500/40 bg-amber-500/15', 'border-emerald-500/40 bg-emerald-500/15'];
                const badgeMap = ['bg-sky-500/30 text-sky-200', 'bg-amber-500/30 text-amber-200', 'bg-emerald-500/30 text-emerald-200'];
                const pilotLabels = school.pilotLabels && school.pilotLabels.length > 0
                  ? school.pilotLabels.map((p, i) => ({ ...p, accent: accentMap[i % 3], badge: badgeMap[i % 3] }))
                  : pilotLabelsComputed;
                return (
                  <div className="mt-8 mx-4 rounded-2xl overflow-hidden shadow-2xl" style={{ backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    {/* Dark navy headline bar */}
                    <div className="px-6 py-4 flex items-center justify-between gap-4" style={{ background: 'linear-gradient(90deg, #0f1e3d 0%, #1a2f5a 100%)' }}>
                      <div className="flex items-center gap-3 flex-wrap min-w-0">
                        <h3 className="text-xl font-serif font-semibold text-white leading-tight truncate">{school.name}</h3>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-200 bg-white/10 border border-white/20 flex-shrink-0">Flight School</span>
                        {stage2TypeRatingFilter !== 'All' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-red-900 bg-red-300 border border-red-200 flex-shrink-0">Offers {stage2TypeRatingFilter}</span>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-blue-300/70 text-[9px] uppercase tracking-widest mb-0.5">Tuition</p>
                        <p className="text-white text-base font-bold leading-tight">{school.price}</p>
                      </div>
                    </div>
                    {/* Tab bar */}
                    <div className="flex border-b border-white/10" style={{ background: 'rgba(15,30,61,0.60)' }}>
                      {(['about', 'expectations', 'requirements', 'access'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setTrSchoolTab(tab)}
                          className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab ? 'border-red-400 text-white' : 'border-transparent text-white/40 hover:text-white/70'}`}
                        >
                          {tab === 'about' ? 'About' : tab === 'expectations' ? 'Expectations' : tab === 'requirements' ? 'Requirements' : 'Access'}
                        </button>
                      ))}
                    </div>
                    {/* Tab content — glassy body */}
                    <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>

                      {/* ── ABOUT ── */}
                      {activeTab === 'about' && (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                            {/* Col 1 — Offerings + location */}
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-3">Matched Offerings</p>
                              <div className="flex flex-wrap gap-2 mb-6">
                                {(matchedOfferings.length > 0 ? matchedOfferings : school.offerings || []).map(o => (
                                  <span key={o} className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/20">{o}</span>
                                ))}
                              </div>
                              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-2">Location</p>
                              <p className="text-sm text-white flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                {school.location}
                              </p>
                            </div>
                            {/* Col 2 — Fleet */}
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-4">Training Fleet</p>
                              <ul className="space-y-2">
                                {(school.fleet || []).map(f => (
                                  <li key={f} className="flex items-center gap-2 text-sm text-white">
                                    <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Col 3 — Future demand + school statement */}
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-3">Why {ratingLabel === 'this rating' ? 'This Rating' : ratingLabel} Matters</p>
                              <div className="space-y-2 mb-5">
                                {demandData.map(d => (
                                  <div key={d.label} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                                    <span className="text-base leading-none mt-0.5">{d.icon}</span>
                                    <div>
                                      <p className="text-[10px] text-white/60 uppercase font-bold">{d.label}</p>
                                      <p className="text-sm text-white/90">{d.value}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-2">About this Offering</p>
                              <p className="text-xs text-white/80 leading-relaxed italic">
                                "{schoolStatement}"
                              </p>
                              {school.aboutProTip && (
                                <div className="mt-3 px-3 py-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                                  <p className="text-[10px] uppercase text-sky-400 font-bold mb-1">Pro Tip — The Clark Advantage</p>
                                  <p className="text-xs text-white/85 leading-relaxed">{school.aboutProTip}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Full-width notice banner */}
                          <div className="mx-6 mb-5 mt-1 px-4 py-3 rounded-lg border border-amber-500/20 bg-amber-500/8 flex items-start gap-3">
                            <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <p className="text-xs text-amber-200/80 leading-relaxed">
                              <span className="font-bold text-amber-300">Data Notice:</span> This information is sourced from public records and may not reflect the latest intake or pricing. Always verify directly with the school before committing to enrolment.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* ── EXPECTATIONS ── */}
                      {activeTab === 'expectations' && (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-3">What They Expect — {expectationsTitle}</p>
                              <ul className="space-y-2.5">
                                {(school.expectations && school.expectations.length > 0 ? school.expectations : [
                                  'Self-funded training — no sponsorship implied',
                                  'Consistent flight progress, no extended gaps',
                                  'Professional conduct at all times on campus',
                                  'English proficiency to ATC communication standard',
                                  'Valid CAAP Student Pilot / CPL at the time of enrolment',
                                  'Punctuality and accountability on all flight bookings',
                                ]).map(e => (
                                  <li key={e} className="flex items-start gap-2 text-sm text-white">
                                    <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                                    {e}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Pilot Profile — Who Is This For</p>
                              <div className="space-y-2.5">
                                {pilotLabels.map(p => (
                                  <div key={p.label} className={`px-3 py-2.5 rounded-lg border ${p.accent}`} style={{ color: 'white' }}>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.badge}`} style={{ color: 'inherit' }}>{p.label}</span>
                                      <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>{p.hrs}</span>
                                    </div>
                                    <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>{p.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Assessment Criteria — {ratingLabel === 'this rating' ? 'General' : ratingLabel}</p>
                              <ul className="space-y-2.5 mb-5">
                                {(school.assessmentCriteria && school.assessmentCriteria.length > 0 ? school.assessmentCriteria : isTypeRating ? [
                                  { item: 'Simulator type rating exam (SIM check)', weight: 'Critical' },
                                  { item: 'Aircraft systems oral examination', weight: 'Critical' },
                                  { item: 'CRM & crew coordination scores', weight: 'High' },
                                  { item: 'Ground school written exam results', weight: 'High' },
                                  { item: 'Attendance and logbook consistency', weight: 'Medium' },
                                ] : isME ? [
                                  { item: 'Multi-engine flight test (CAAP examiner)', weight: 'Critical' },
                                  { item: 'Engine failure handling & OEI ops', weight: 'Critical' },
                                  { item: 'Ground school written exam results', weight: 'High' },
                                  { item: 'Cross-country navigation performance', weight: 'High' },
                                  { item: 'Attendance and logbook consistency', weight: 'Medium' },
                                ] : isIR ? [
                                  { item: 'IFR flight test under hood conditions', weight: 'Critical' },
                                  { item: 'Instrument approach procedures (ILS, VOR)', weight: 'Critical' },
                                  { item: 'Ground school written exam results', weight: 'High' },
                                  { item: 'Holding patterns & missed approach', weight: 'High' },
                                  { item: 'Situational awareness & scan technique', weight: 'Medium' },
                                ] : [
                                  { item: 'Ground school written exam results', weight: 'High' },
                                  { item: 'Simulator performance & CRM scores', weight: 'High' },
                                  { item: 'Flight test proficiency grades', weight: 'Critical' },
                                  { item: 'Attendance and logbook consistency', weight: 'Medium' },
                                  { item: 'Safety culture attitude & discipline', weight: 'Medium' },
                                ]).map(s => (
                                  <li key={s.item} className="flex items-start justify-between gap-2 text-sm text-white/90">
                                    <span className="flex-1">{s.item}</span>
                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${s.weight === 'Critical' ? 'bg-red-500/40 text-red-200' : s.weight === 'High' ? 'bg-amber-500/30 text-amber-200' : 'bg-white/15 text-white/70'}`}>{s.weight}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-[10px] uppercase text-red-400 font-bold mb-1">Pilot Warning</p>
                                <p className="text-xs text-white/85 leading-relaxed">{school.pilotWarning || (isTypeRating ? `Failing the ${ratingLabel} sim check requires re-booking and additional fees. Ensure you have completed the full ground school before entering the simulator.` : isME ? 'Failing the multi-engine flight test requires re-testing fees and delays your CAAP endorsement. Confirm aircraft availability before committing to a test date.' : isIR ? 'Failing the IFR flight test delays your CPL/ATPL progression. Ensure you have met minimum instrument hours before booking the CAAP examiner.' : 'Failing a flight test at this school may require re-testing fees and delay your CAAP submission. Plan training hours conservatively.')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── REQUIREMENTS ── */}
                      {activeTab === 'requirements' && (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-3">
                                {tf !== 'All' ? `${tf} — Entry Requirements` : 'General Entry Requirements'}
                              </p>
                              <ul className="space-y-2.5">
                                {(school.requirements && school.requirements.length > 0 ? school.requirements : isTypeRating ? [
                                  'Valid CAAP Class 1 Medical Certificate',
                                  'CPL with valid Instrument Rating (IR)',
                                  'Multi-Engine Rating (MER) completed',
                                  'Minimum 200 hrs total flight time',
                                  'MCC completion recommended (some airlines require)',
                                  'ICAO English Proficiency — Level 4 minimum',
                                  'No active licence suspension or infringement',
                                ] : isME ? [
                                  'Valid CAAP Class 1 Medical Certificate',
                                  'CPL or CPL Student (advanced stage)',
                                  'Valid Instrument Rating (IR) strongly recommended',
                                  'Minimum 50 hrs PIC cross-country time',
                                  'ICAO English Proficiency — Level 4 minimum',
                                  'Passing score on multi-engine ground school exam',
                                  'Satisfactory pre-solo dual check with instructor',
                                ] : isIR ? [
                                  'Valid CAAP Class 1 Medical Certificate',
                                  'PPL or CPL student with 50+ total hours',
                                  'ICAO English Proficiency — Level 4 minimum',
                                  'Completion of instrument ground school module',
                                  'Satisfactory instrument proficiency check',
                                  'Minimum instrument flight hours as per CAAP',
                                ] : isMCC ? [
                                  'Valid CAAP Class 1 Medical Certificate',
                                  'CPL with valid Instrument Rating (IR)',
                                  'Multi-Engine Rating (MER) completed',
                                  'ICAO English Proficiency — Level 4 minimum',
                                  'Minimum 70 hrs flight time recommended',
                                ] : isUPRT ? [
                                  'Valid CAAP Class 1 Medical Certificate',
                                  'PPL or CPL holder — any hours',
                                  'ICAO English Proficiency — Level 4 minimum',
                                  'No minimum flight hours required for ground UPRT',
                                  'Flight UPRT requires valid licence + medical',
                                ] : isATRL ? [
                                  'Valid CAAP Class 1 Medical Certificate',
                                  'CPL with valid IR and MER',
                                  '1,500 total flight hours (ICAO ATPL standard)',
                                  '500 hrs PIC time minimum',
                                  '100 hrs night time minimum',
                                  '75 hrs instrument time minimum',
                                  'ICAO English Proficiency — Level 4 minimum',
                                ] : [
                                  'Valid CAAP Class 1 Medical Certificate',
                                  'PPL or CPL as applicable to programme',
                                  'Minimum flight hours per programme requirements',
                                  'ICAO English Proficiency — Level 4 minimum',
                                  'Passing written ground school exam',
                                  'Satisfactory simulator competency assessment',
                                  'No active suspension of any aviation licence',
                                ]).map(r => (
                                  <li key={r} className="flex items-start gap-2 text-sm text-white">
                                    <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">
                                {hasMultiEngine ? 'Multi-Engine Rating Details' : 'All Programme Offerings'}
                              </p>
                              {hasMultiEngine ? (
                                <div className="space-y-3">
                                  <div className="px-3 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-[10px] uppercase text-red-400 font-bold mb-1">ME Aircraft Available</p>
                                    <p className="text-sm text-white/80">{(school.fleet || []).filter(f => f.toLowerCase().includes('seneca') || f.toLowerCase().includes('baron') || f.toLowerCase().includes('aztec') || f.toLowerCase().includes('navajo') || f.toLowerCase().includes('twin') || f.toLowerCase().includes('multi')).join(', ') || 'Multi-engine aircraft — contact school'}</p>
                                  </div>
                                  <div className="px-3 py-3 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Estimated Training Duration</p>
                                    <p className="text-sm text-white">10–15 hrs dual + solo · Written exam + CAAP flight test</p>
                                  </div>
                                  <div className="px-3 py-3 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Minimum Pre-Requisites</p>
                                    <p className="text-sm text-white">CPL + valid IR strongly recommended · Night rating is an advantage</p>
                                  </div>
                                  <div className="px-3 py-3 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Outcome</p>
                                    <p className="text-sm text-white">CAAP Multi-Engine Rating endorsement on CPL · Qualifies for MER-required airline positions</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {(school.offerings || []).map(o => (
                                    <div key={o} className="px-3 py-2.5 rounded-lg bg-white/8 border border-white/15 text-sm text-white/90 flex items-center gap-2">
                                      <svg className="w-3 h-3 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                                      {o}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Documents to Prepare</p>
                              <ul className="space-y-2 mb-5">
                                {(school.documents && school.documents.length > 0 ? school.documents : [
                                  'Valid government-issued ID',
                                  'CAAP licence or student pilot certificate',
                                  'Class 1 medical certificate (original)',
                                  'Certified true copy of logbook pages',
                                  'NBI clearance (some schools require)',
                                  'Recent 2×2 photos (4 copies)',
                                  'Proof of payment / tuition arrangement',
                                ]).map(d => (
                                  <li key={d} className="flex items-center gap-2 text-sm text-white/90">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                                    {d}
                                  </li>
                                ))}
                              </ul>
                              <div className="px-3 py-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                                <p className="text-[10px] uppercase text-sky-400 font-bold mb-1">Pro Tip</p>
                                <p className="text-xs text-white/85 leading-relaxed">{school.proTip || 'Call the school before showing up. Confirm aircraft availability for the rating you need — some schools have 1–2 multi-engine aircraft shared across all students.'}</p>
                              </div>
                              {school.requirementsWarning && (
                                <div className="mt-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                                  <p className="text-[10px] uppercase text-red-400 font-bold mb-1">Document Warning</p>
                                  <p className="text-xs text-white/85 leading-relaxed">{school.requirementsWarning}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ── ACCESS ── */}
                      {activeTab === 'access' && (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-3">Who Can Apply</p>
                              <div className="space-y-2.5">
                                {(school.accessEligibility && school.accessEligibility.length > 0 ? school.accessEligibility : [
                                  { label: 'Open to Outside Applicants', value: 'Yes — not exclusive to own graduates', ok: true },
                                  { label: 'College Degree Required', value: 'No — aviation licence is sufficient', ok: true },
                                  { label: 'Foreign Nationals', value: 'Permitted with valid Philippine visa + CAAP validation', ok: true },
                                  ...(school.contact ? [{ label: 'Contact', value: school.contact, ok: true }] : []),
                                  ...(school.email ? [{ label: 'Email', value: school.email, ok: true }] : []),
                                  { label: 'Affiliated Cadet Programme', value: (school.offerings || []).some(o => o.toLowerCase().includes('cadet')) ? 'Cadet pathway available — enquire directly' : 'No affiliated cadet sponsorship programme', ok: (school.offerings || []).some(o => o.toLowerCase().includes('cadet')) },
                                ]).map(a => (
                                  <div key={a.label} className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider mb-0.5">{a.label}</p>
                                    <p className="text-sm font-semibold text-white">{a.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Enrolment & Process</p>
                              <div className="space-y-2.5">
                                <div className="px-3 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                  <p className="text-[10px] uppercase text-emerald-400 font-bold mb-0.5">Intake Status</p>
                                  {school.intakeNote ? (
                                    <>
                                      <p className="text-sm text-white/85 font-semibold">{school.intakeNote.split('.')[0]}</p>
                                      <p className="text-xs text-white/70 mt-1">{school.intakeNote.split('.').slice(1).join('.').trim()}</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-sm text-white/85 font-semibold">Open Enrolment — Rolling Intake</p>
                                      <p className="text-xs text-white/70 mt-1">No fixed semester cutoff. Apply any time subject to aircraft availability.</p>
                                    </>
                                  )}
                                </div>
                                <div className="px-3 py-3 rounded-lg bg-white/5 border border-white/10">
                                  <p className="text-[10px] uppercase text-white/60 font-bold mb-1">How to Start</p>
                                  <ol className="text-xs text-white/85 space-y-1 leading-relaxed list-decimal list-inside">
                                    {(school.enrollmentSteps && school.enrollmentSteps.length > 0 ? school.enrollmentSteps : [
                                      'Contact school to confirm slot availability',
                                      'Submit documents + complete assessment',
                                      'Pay initial fees / training deposit',
                                      'Receive training schedule from chief instructor',
                                    ]).map(s => <li key={s}>{s}</li>)}
                                  </ol>
                                </div>
                                <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                                  <p className="text-[10px] uppercase text-white/60 font-bold mb-0.5">Tuition Range</p>
                                  <p className="text-sm text-red-300 font-semibold">{school.price}</p>
                                </div>
                                {school.technology && school.technology.length > 0 && (
                                  <div className="px-3 py-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                    <p className="text-[10px] uppercase text-violet-400 font-bold mb-1">Technology</p>
                                    {school.technology.map(t => (
                                      <p key={t} className="text-xs text-white/85 leading-relaxed">{t}</p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="px-6 py-6">
                              <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">School Credibility</p>
                              <div className="space-y-2.5">
                                <div className={`px-3 py-2.5 rounded-lg border ${school.claimed ? 'bg-sky-500/10 border-sky-500/20' : 'bg-white/5 border-white/10'}`}>
                                  <p className="text-[10px] uppercase font-bold mb-0.5 text-white/60">Platform Verification</p>
                                  <p className={`text-sm font-semibold ${school.claimed ? 'text-sky-200' : 'text-white/80'}`}>{school.claimed ? '✓ Claimed & Verified by School' : 'Unverified — sourced from public records'}</p>
                                </div>
                                {school.pilotsTrained && (
                                  <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                                    <p className="text-[10px] uppercase text-white/40 font-bold mb-0.5">Total Pilots Trained</p>
                                    <p className="text-2xl font-bold text-white">{school.pilotsTrained.toLocaleString()}<span className="text-sm text-white/60 font-normal ml-1">pilots</span></p>
                                  </div>
                                )}
                                <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                                  <p className="text-[10px] uppercase text-white/60 font-bold mb-0.5">CAAP Accreditation</p>
                                  <p className="text-sm text-emerald-300 font-semibold">✓ CAAP-Accredited Flight Training Organisation</p>
                                </div>
                                {school.website && (
                                  <a href={school.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300 hover:text-red-200 font-semibold transition-colors">
                                    Visit Official Website
                                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              }

              // For licensure sub-pathway cards — show rich tabbed panel like flight schools
              const LICENSURE_CARD_DATA: Record<string, { name: string; image: string; description: string; price: string; offerings: string[]; requirements: string[]; documents: string[]; proTip: string; expectations: string[]; pilotLabels: { label: string; hrs: string; desc: string }[]; assessmentCriteria: { item: string; weight: 'Critical' | 'High' | 'Medium' }[]; pilotWarning: string; aboutStatement: string; location: string; website?: string; }> = {
                'a02f4e29-e165-415f-a3b3-669edbd7deb1': {
                  name: 'Type Rating Centers',
                  image: 'https://www.caepacific.com/wp-content/uploads/2021/03/CAE-Philippines-Training-Center.jpg',
                  description: 'World-class type rating training centers with Level D Full-Flight Simulators for Airbus (A320, A330) and Boeing (B737, B777) aircraft. CAAP-approved for Philippine operators. CAE Rise™ data analytics used for objective performance tracking.',
                  price: '$18,000 – $50,000 depending on aircraft type and center',
                  location: 'Clark, Philippines · Dubai, UAE · London, UK · Melbourne, AU',
                  website: 'https://www.cae.com/civil-aviation/locations/asia-pacific/cae-philippines/',
                  offerings: ['A320 Type Rating', 'B737 Type Rating', 'A330 Type Rating', 'B777 Type Rating', 'ATR 72-600 Type Rating', 'Jet Orientation Course (JOC)', 'MCC — Multi-Crew Cooperation'],
                  requirements: ['Valid CAAP Class 1 Medical Certificate', 'CPL with IR + Multi-Engine (ME) endorsement', 'Minimum 200 hrs total flight time', 'ICAO English Proficiency — Level 4 minimum', 'No active licence suspension'],
                  documents: ['Valid Passport or Government-issued ID', 'CAAP License (CPL/ATPL)', 'Current Class 1 Medical Certificate', 'Certified True Copy of Pilot Logbook', 'NTC Radio Telephony License'],
                  proTip: 'Book simulator slots at least 4–6 weeks in advance. Airline recurrent training takes priority at most centers — self-funded candidates should confirm slot availability before paying deposits.',
                  expectations: ['Airline-standard discipline from day one.', 'Ground school exams must be passed before sim access.', 'CRM and SOP adherence are assessed throughout — not just during checkrides.', 'Simulator sessions are expensive; missed slots are typically forfeited without refund.'],
                  pilotLabels: [
                    { label: 'Fresh CPL', hrs: '200–500 hrs', desc: 'Completing first type rating to enter the airline market as First Officer.' },
                    { label: 'Mid Timer', hrs: '500–1,500 hrs', desc: 'Transitioning from regional/turboprop to narrowbody jet operations.' },
                    { label: 'High Timer', hrs: '1,500+ hrs', desc: 'Adding widebody or additional type rating for career advancement.' },
                  ],
                  assessmentCriteria: [
                    { item: 'Ground School Exam — systems & limitations', weight: 'High' },
                    { item: 'Simulator Performance — normal & abnormal procedures', weight: 'Critical' },
                    { item: 'CRM & Multi-crew coordination', weight: 'High' },
                    { item: 'SOP Adherence', weight: 'Critical' },
                  ],
                  pilotWarning: 'Airline partners have priority scheduling at most Type Rating Centers. Self-funded pilots should budget 1–2 weeks of buffer beyond the expected completion date for delays.',
                  aboutStatement: 'Type Rating Centers provide the bridge between your CPL and an airline cockpit. Completion of a type rating at a CAAP/EASA-approved center is the most direct route to First Officer employment at Philippine and regional airlines.',
                },
                'cc996aa7-a075-4be7-beef-f917dd1f41db': {
                  name: 'Instrument Rating Pathway',
                  image: 'https://media.pea.com/wp-content/uploads/2023/06/altfull-view-of-G1000-Avionics-of-Cessna-172-1024x607.jpeg',
                  description: 'Earn your Instrument Rating to operate legally under IFR in all weather conditions and controlled airspace. Master NDB/VOR/ILS approaches, holding patterns, and ATC communication. Essential gateway for all commercial airline pathways.',
                  price: '$10,000 – $18,000',
                  location: 'Philippines · USA · Europe · Australia',
                  offerings: ['IFR Ground School', 'Instrument Approaches — ILS/VOR/NDB', 'Holding Patterns & Missed Approaches', 'Cross-Country IFR Navigation', 'CAAP Instrument Rating Skill Test'],
                  requirements: ['Valid PPL or CPL (Student or Full)', 'CAAP Class 1 or Class 2 Medical', '50+ hours cross-country time as PIC', 'ICAO English Proficiency — Level 4 minimum', 'Completion of instrument ground school module'],
                  documents: ['Valid ID or Passport', 'CAAP Pilot License', 'Medical Certificate', 'Logbook (certified copy)', 'Ground school completion certificate'],
                  proTip: 'Train IFR in actual IMC when possible — sim-only training leaves gaps in scan technique. Ask the school how many actual cloud hours are included in the programme.',
                  expectations: ['Disciplined instrument scan from the first lesson.', 'Expect to fly partial-panel approaches early.', 'Ground knowledge of met, navigation, and regulations is tested rigorously.', 'Achieving the rating takes most students 6–8 weeks of focused effort.'],
                  pilotLabels: [
                    { label: 'PPL Holder', hrs: '50+ hrs', desc: 'Adding IR to expand weather capabilities and progress toward CPL.' },
                    { label: 'CPL Student', hrs: '150+ hrs', desc: 'Completing IR as part of the integrated CPL pathway.' },
                    { label: 'License Upgrade', hrs: 'Any', desc: 'Existing CPL holders adding IR for commercial employment eligibility.' },
                  ],
                  assessmentCriteria: [
                    { item: 'Instrument Approaches — ILS, VOR, NDB', weight: 'Critical' },
                    { item: 'Partial Panel Flying', weight: 'High' },
                    { item: 'ATC Communication — IFR clearances', weight: 'High' },
                    { item: 'Meteorology & Weather Decision-Making', weight: 'Medium' },
                  ],
                  pilotWarning: 'IR training is sequential — rushing instrument scan development leads to checkride failures. Do not compress the programme below the minimum hours. Quality of training matters more than speed.',
                  aboutStatement: 'The Instrument Rating is the most critical gateway licence in commercial aviation. Without it, no airline pathway is accessible. Train at a school with actual IMC flight time in the programme, not simulation-only.',
                },
                '54655935-92de-4aad-b82b-703152ffce25': {
                  name: 'ATPL Pathway',
                  image: 'https://www.wingpath.in/blog_images/what-is-atpl-in-india-6ihgy-1000x700.png',
                  description: 'Structured hour-building programme to meet the 1,500-hour ATPL requirement. Build hours through instruction, charter, ferry flights, and regional turboprop operations. Frozen ATPL holders can apply to airline FO positions while building toward full ATPL.',
                  price: 'Hour Building: Variable | ATPL Theory: $3,000–$8,000',
                  location: 'Philippines · Australia · USA · Europe',
                  offerings: ['ATPL Theory Ground School (14 subjects)', 'Flight Instruction Hour Building', 'Charter & Regional Turboprop Hour Building', 'Frozen ATPL Application Support', 'Airline Interview Preparation'],
                  requirements: ['CPL with IR and Multi-Engine Rating', 'CAAP Class 1 Medical', '500 hrs total time minimum to begin ATPL theory', 'ICAO English Proficiency — Level 4 minimum', '100 hrs night time (for full ATPL)'],
                  documents: ['Valid Passport or ID', 'CAAP CPL License', 'Class 1 Medical Certificate', 'Certified logbook pages', 'ATPL Theory exam results'],
                  proTip: 'Do not wait for 1,500 hours to apply to airlines — most Philippine carriers hire First Officers with Frozen ATPL (CPL + IR + ME) from 200 hours, especially cadet programme graduates.',
                  expectations: ['ATPL theory covers 14 subjects — treat it like a degree programme, not a test to pass.', 'Hour building quality matters: diverse aircraft types and conditions.', 'The path to command authority is long — plan financially for 3–5 years.', 'Network with line captains during hour building; referrals matter.'],
                  pilotLabels: [
                    { label: 'Frozen ATPL', hrs: '200–750 hrs', desc: 'CPL+IR+ME holder applying to airline FO positions while building hours.' },
                    { label: 'Hour Builder', hrs: '750–1,200 hrs', desc: 'Flight instructor or charter pilot progressing toward full ATPL minimums.' },
                    { label: 'ATPL Ready', hrs: '1,500+ hrs', desc: 'Applying for CAAP ATPL including 500 PIC and 100 night hours.' },
                  ],
                  assessmentCriteria: [
                    { item: 'ATPL Theory — 14 written exams (75% pass mark each)', weight: 'Critical' },
                    { item: 'Flight Hours — quality and diversity of experience', weight: 'High' },
                    { item: 'Night & IFR Time — CAAP minimums', weight: 'High' },
                    { item: 'CRM History — airline assessment readiness', weight: 'Medium' },
                  ],
                  pilotWarning: 'ATPL theory is valid for 7 years after passing all 14 subjects. If you do not complete flight hour requirements within this period, you must re-sit failed or expired subjects. Plan your timeline carefully.',
                  aboutStatement: 'The ATPL is the pinnacle pilot certificate — required for Airline Captain command. The journey from CPL to ATPL typically takes 3–6 years in the Philippines. Every hour logged is progress. The Frozen ATPL (CPL+IR+ME with passed theory) is your airline entry ticket.',
                },
                'c89c9f97-b3f6-4955-9c34-3ae266a6ffc8': {
                  name: 'Seaplane Rating',
                  image: 'https://images.unsplash.com/photo-1507199129876-44d2b3190c1a?w=800&q=80',
                  description: 'Add a seaplane (floatplane) rating to your existing pilot licence. Learn water takeoffs and landings, step taxi, dock approaches, and amphibious aircraft handling. Opens access to island-hopping tourism routes and remote area operations across the Philippines.',
                  price: '$3,000 – $8,000',
                  location: 'Philippines · Canada · USA · Caribbean',
                  offerings: ['Water Takeoffs & Landings', 'Step Taxi & Glassy Water Technique', 'Dock & Beach Approaches', 'Seaplane Emergency Procedures', 'CAAP Seaplane Rating Skill Test'],
                  requirements: ['Valid PPL or higher', 'CAAP Class 2 Medical minimum', '25+ hours total flight time', 'ICAO English Proficiency — Level 4', 'No seaplane-specific hours required prior'],
                  documents: ['Valid ID or Passport', 'CAAP Pilot License', 'Medical Certificate', 'Logbook (certified copy)'],
                  proTip: 'Seaplane ratings are rare in the Philippines — only a handful of CAAP-approved instructors exist. This niche rating commands premium pay in island tourism and NGO/humanitarian operations.',
                  expectations: ['Expect entirely new handling techniques — water is not a runway.', 'Glassy water approaches require specific altitude judgment; this takes time to learn.', 'Small class sizes mean highly personalized instruction.', 'Typically completed in 1–2 weeks of intensive flying.'],
                  pilotLabels: [
                    { label: 'PPL Holder', hrs: '25+ hrs', desc: 'Adding seaplane rating for island tourism or personal aviation diversity.' },
                    { label: 'CPL/ATPL', hrs: 'Any', desc: 'Professional pilot adding niche rating for specialized operator employment.' },
                  ],
                  assessmentCriteria: [
                    { item: 'Water Takeoff & Landing — normal and crosswind', weight: 'Critical' },
                    { item: 'Glassy Water Approach', weight: 'Critical' },
                    { item: 'Emergency Procedures — water-specific', weight: 'High' },
                    { item: 'Dock Approach & Mooring', weight: 'Medium' },
                  ],
                  pilotWarning: 'Seaplane operations carry unique hazards — submerged debris, boat traffic, and weather-driven wave heights can change rapidly. This is a niche rating; ensure your school has recent, relevant instruction experience.',
                  aboutStatement: 'The Seaplane Rating opens access to a unique aviation niche. In the Philippines, island-hopping seaplane services serve destinations unreachable by conventional aircraft. A rare, premium credential for pilots seeking differentiation.',
                },
                'e94ba893-fa83-47b1-90f9-98905dc6685a': {
                  name: 'Multi-Engine Rating',
                  image: 'https://cdn.prod.website-files.com/67b7f6762c0ae79aa3b1f3b0/6813ec96ef44eea3df482f3d_N53TW%203.jpg',
                  description: 'Earn your Multi-Engine Rating (MER) to legally operate aircraft with two or more engines. Master Vmc demonstrations, engine-out procedures, asymmetric thrust management, and multi-engine performance planning. Mandatory prerequisite before most Type Rating programmes.',
                  price: '$8,000 – $15,000',
                  location: 'Philippines · USA · Australia · Europe',
                  offerings: ['Multi-Engine Ground School', 'Vmc Demonstrations & Engine-Out Drills', 'Asymmetric Approach & Landing', 'Multi-Engine Performance Planning', 'CAAP Multi-Engine Rating Skill Test'],
                  requirements: ['Valid PPL or CPL', 'CAAP Class 1 Medical', 'Single-engine flight experience (50+ hrs recommended)', 'ICAO English Proficiency — Level 4', 'IR strongly recommended prior to MER'],
                  documents: ['Valid ID or Passport', 'CAAP Pilot License', 'Class 1 Medical Certificate', 'Certified Logbook Pages'],
                  proTip: 'Pair the MER with your IR in the same training block if possible — most Philippine airlines require CPL + IR + MER as the complete package for type rating eligibility.',
                  expectations: ['Engine-failure at Vr is the defining maneuver — practice until it is instinctive.', 'Ground school covers engine-failure aerodynamics and Vmc physics in detail.', 'Programme typically 4–6 weeks.', 'Expect checkride to include a simulated single-engine ILS approach.'],
                  pilotLabels: [
                    { label: 'PPL to MER', hrs: '50–150 hrs', desc: 'Building multi-engine experience on the path to CPL + IR + MER package.' },
                    { label: 'CPL Student', hrs: '150–200 hrs', desc: 'Completing MER as the final block before type rating eligibility.' },
                    { label: 'License Upgrade', hrs: 'Any', desc: 'Adding MER to existing CPL+IR for airline entry assessment.' },
                  ],
                  assessmentCriteria: [
                    { item: 'Engine Failure at V1/Vr — directional control', weight: 'Critical' },
                    { item: 'Single-Engine ILS Approach', weight: 'Critical' },
                    { item: 'Multi-Engine Performance Planning', weight: 'High' },
                    { item: 'Emergency Procedures — engine fire, feathering', weight: 'High' },
                  ],
                  pilotWarning: 'Multi-engine training on under-powered twins can create bad habits. Train on a modern aircraft (Piper Seminole or equivalent) with well-maintained engines. Verify the school\'s aircraft is airworthy and legally maintained before committing.',
                  aboutStatement: 'The Multi-Engine Rating is the final prerequisite before accessing type rating programmes. Combined with CPL and IR, it forms the complete entry package for every Philippine airline\'s First Officer assessment process.',
                },
                '078eea1a-271f-4392-a802-9a2ea4c36da0': {
                  name: 'UPRT Rating',
                  image: 'https://www.flight-safety.com/wp-content/uploads/2021/06/uprt-training.jpg',
                  description: 'Upset Prevention and Recovery Training (UPRT) addresses Loss of Control In-flight (LOC-I) — the single leading cause of fatal aviation accidents worldwide. ICAO-aligned programme required for many airline type rating programmes and CAAP CPL renewal endorsements.',
                  price: '$2,500 – $5,000',
                  location: 'Philippines · USA · Europe · Australia',
                  offerings: ['Unusual Attitude Recognition & Recovery', 'Stall Awareness & Prevention', 'Spin Recovery Training', 'Aerobatic-Based Recovery Maneuvers', 'CAAP UPRT Endorsement'],
                  requirements: ['CPL or ATPL (or advanced CPL student)', 'CAAP Class 1 Medical', 'Spin Awareness endorsement (or completed during UPRT)', 'EASA/ICAO-compliant programme recognition'],
                  documents: ['Valid ID or Passport', 'CAAP Pilot License', 'Class 1 Medical Certificate', 'Logbook (certified copy)'],
                  proTip: 'UPRT is not just a box-ticking exercise — LOC-I kills more pilots than any other accident category. Approach this training with genuine intent to internalize the skills. It could save your life.',
                  expectations: ['Expect to be uncomfortable — that is the point.', 'Aerobatic maneuvers are used as a training tool, not for spectacle.', 'Both theoretical (ground school) and practical (airborne) components are mandatory.', 'Programme typically 1–2 weeks intensive.'],
                  pilotLabels: [
                    { label: 'CPL Candidate', hrs: 'Any', desc: 'Completing UPRT as part of integrated CPL or standalone endorsement.' },
                    { label: 'Airline Applicant', hrs: '200+ hrs', desc: 'Meeting type rating or airline assessment UPRT prerequisite requirements.' },
                    { label: 'Active Pilot', hrs: 'Any', desc: 'Recurrent UPRT for enhanced flight safety awareness and skill currency.' },
                  ],
                  assessmentCriteria: [
                    { item: 'Unusual Attitude Recovery — nose high & nose low', weight: 'Critical' },
                    { item: 'Incipient Spin Entry & Recovery', weight: 'Critical' },
                    { item: 'Stall Recognition & Prevention', weight: 'High' },
                    { item: 'Theoretical LOC-I Awareness', weight: 'High' },
                  ],
                  pilotWarning: 'UPRT must be conducted in aerobatic-capable aircraft with full-authority dual controls. Do not accept a programme conducted only in a non-aerobatic trainer or simulator. Verify the aircraft\'s aerobatic certification before enrolling.',
                  aboutStatement: 'LOC-I is the #1 cause of fatal accidents. UPRT is not optional for serious pilots — ICAO, EASA, and CAAP all mandate or strongly recommend it. One well-trained recovery response at altitude could be the difference between a statistic and a survivor.',
                },
                '4d4b6568-3759-432e-9193-e0dba88425aa': {
                  name: 'CFI Rating Pathway',
                  image: 'https://media.pea.com/wp-content/uploads/2023/06/flight-instructor-training-1024x607.jpeg',
                  description: 'Certified Flight Instructor (CFI) rating — earn while you build hours toward ATPL minimums. Learn instructional techniques, lesson plan development, student evaluation, and CAAP flight training regulations. Includes CFI (single), CFII (instrument), and MEI (multi-engine) tracks.',
                  price: 'Training: $5,000 – $10,000 | Earning: PHP 25,000–60,000/month',
                  location: 'Philippines · USA · Australia',
                  website: undefined,
                  offerings: ['CFI — Certified Flight Instructor (Single Engine)', 'CFII — Instrument Flight Instructor', 'MEI — Multi-Engine Instructor', 'CAAP Flight Instructor License (FIL)', 'Ground Instructor Certification'],
                  requirements: ['Valid CPL with IR (CFII requires IR proficiency)', 'CAAP Class 1 Medical', '250+ hours total flight time', 'Written exam pass — Fundamentals of Instruction (FOI)', 'ICAO English Proficiency — Level 4+'],
                  documents: ['Valid ID or Passport', 'CAAP CPL License', 'Class 1 Medical Certificate', 'Logbook (certified copy)', 'FOI written exam result'],
                  proTip: 'Choose your flight school carefully — instructing at a busy ATO with structured syllabi teaches you more than a quiet school with minimal students. Productivity and quality of instruction experience matters for your airline assessment.',
                  expectations: ['Teaching requires deeper knowledge than flying — you must be able to explain every concept.', 'Student management and lesson preparation are as important as flight skills.', 'High-performing CFIs get airline referrals; complacent ones get overlooked.', 'Plan for at least 12–18 months of instructing before reaching competitive airline hours.'],
                  pilotLabels: [
                    { label: 'New CFI', hrs: '250–500 hrs', desc: 'Freshly rated instructor building hours on the path to Frozen ATPL airline entry.' },
                    { label: 'Experienced CFI', hrs: '500–1,200 hrs', desc: 'Building toward ATPL minimums while developing leadership and mentorship skills.' },
                    { label: 'Senior Instructor', hrs: '1,200+ hrs', desc: 'Transitioning to airline career with rich instructional background valued by recruiters.' },
                  ],
                  assessmentCriteria: [
                    { item: 'Fundamentals of Instruction (FOI) — teaching theory', weight: 'High' },
                    { item: 'Flight Demonstration Standards — precision & explanation', weight: 'Critical' },
                    { item: 'Student Evaluation — identifying & correcting errors', weight: 'High' },
                    { item: 'Ground Lesson Delivery — met, nav, regulations', weight: 'Medium' },
                  ],
                  pilotWarning: 'Instructing at an underfunded school with poorly maintained aircraft builds bad habits and creates safety risks. Verify the school\'s CAAP ATO certification and aircraft maintenance records before accepting an instructing position.',
                  aboutStatement: 'The CFI rating is the most efficient hour-building pathway in Philippine aviation. You earn a salary while progressing toward ATPL minimums, and you develop the communication, discipline, and leadership skills that airline recruiters actively look for.',
                },
              };

              const licensureData = LICENSURE_CARD_DATA[cardId];
              if (licensureData) {
                const school = {
                  id: cardId,
                  name: licensureData.name,
                  description: licensureData.description,
                  location: licensureData.location,
                  rating: 4.7,
                  price: licensureData.price,
                  image: licensureData.image,
                  region: 'Asia' as const,
                  fleet: [] as string[],
                  offerings: licensureData.offerings,
                  pilotsTrained: undefined as number | undefined,
                  established: undefined as number | undefined,
                  website: licensureData.website,
                  pathwayScore: undefined as number | undefined,
                  claimed: false,
                  requirements: licensureData.requirements,
                  documents: licensureData.documents,
                  proTip: licensureData.proTip,
                  technology: [] as string[],
                  expectations: licensureData.expectations,
                  pilotLabels: licensureData.pilotLabels,
                  assessmentCriteria: licensureData.assessmentCriteria,
                  pilotWarning: licensureData.pilotWarning,
                  aboutStatement: licensureData.aboutStatement,
                };
                const fsName = school.name;
                const fsLocation = school.location;
                const fsPrice = school.price;
                const fsOfferings = school.offerings;
                const fsWebsite = school.website;
                const fsDescription = school.description;

                return (
                  <div className="mt-8 mx-4 rounded-2xl overflow-hidden border border-white/8 bg-white/4 backdrop-blur-sm opacity-100">
                    {/* Header strip */}
                    <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/8">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-serif font-normal text-white leading-tight">{fsName}</h3>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-sky-700/80">Training Pathway</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap mt-1">
                          <span className="flex items-center gap-1 text-white/55 text-xs">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {fsLocation}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Estimated Cost</p>
                        <p className="text-white text-sm font-bold leading-tight max-w-[200px] text-right">{fsPrice}</p>
                      </div>
                    </div>

                    {/* Tab bar — add comparison tab for UPRT card */}
                    <div className="flex border-b border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      {(['about', 'expectations', 'requirements', 'access', ...(cardId === '078eea1a-271f-4392-a802-9a2ea4c36da0' ? ['comparison'] as const : [])] as const).map(t => (
                        <button key={t} onClick={() => setTrSchoolTab(t)} className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${trSchoolTab === t ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white/70'}`}>
                          {t === 'comparison' ? 'Comparison' : t}
                        </button>
                      ))}
                    </div>

                    {/* ABOUT tab */}
                    {trSchoolTab === 'about' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                        <div className="px-6 py-6">
                          <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Offerings</p>
                          <ul className="space-y-1.5">
                            {fsOfferings.map(o => (
                              <li key={o} className="flex items-start gap-2 text-sm text-white/85">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0 mt-1.5" />
                                {o}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="px-6 py-6">
                          <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">About</p>
                          <p className="text-xs text-white/70 leading-relaxed">{fsDescription}</p>
                        </div>
                        <div className="px-6 py-6 space-y-3">
                          <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Why This Rating Matters</p>
                          <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-[10px] uppercase text-white/60 font-bold mb-1">About this Pathway</p>
                            <p className="text-xs text-white/80 leading-relaxed italic">"{school.aboutStatement}"</p>
                          </div>
                          {school.proTip && (
                            <div className="mt-3 px-3 py-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                              <p className="text-[10px] uppercase text-sky-400 font-bold mb-1">Pro Tip</p>
                              <p className="text-xs text-white/85 leading-relaxed">{school.proTip}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* EXPECTATIONS tab */}
                    {trSchoolTab === 'expectations' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                        <div className="px-6 py-6">
                          <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-3">What They Expect</p>
                          <ul className="space-y-2">
                            {school.expectations.map(e => (
                              <li key={e} className="text-xs text-white/85 leading-relaxed border-l-2 border-red-500/40 pl-3">{e}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="px-6 py-6">
                          <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Pilot Profile — Who Is This For</p>
                          <div className="space-y-2.5">
                            {school.pilotLabels.map(p => (
                              <div key={p.label} className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-[11px] font-bold text-white">{p.label}</p>
                                  <span className="text-[10px] text-white/60 font-mono">{p.hrs}</span>
                                </div>
                                <p className="text-xs text-white/70">{p.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="px-6 py-6">
                          <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Assessment Criteria</p>
                          <div className="space-y-2 mb-4">
                            {school.assessmentCriteria.map(a => (
                              <div key={a.item} className="flex items-start gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 mt-0.5 ${a.weight === 'Critical' ? 'bg-red-500/20 text-red-300' : a.weight === 'High' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white/50'}`}>{a.weight}</span>
                                <p className="text-xs text-white/85">{a.item}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-[10px] uppercase text-red-400 font-bold mb-1">Pilot Warning</p>
                            <p className="text-xs text-white/85 leading-relaxed">{school.pilotWarning}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* REQUIREMENTS tab */}
                    {trSchoolTab === 'requirements' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                        <div className="px-6 py-6">
                          <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-3">Entry Requirements</p>
                          <ul className="space-y-2.5">
                            {school.requirements.map(r => (
                              <li key={r} className="flex items-start gap-2 text-sm text-white/90">
                                <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="px-6 py-6">
                          <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Documents to Prepare</p>
                          <ul className="space-y-2.5">
                            {school.documents.map(d => (
                              <li key={d} className="flex items-center gap-2 text-sm text-white/90">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                                {d}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 px-3 py-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                            <p className="text-[10px] uppercase text-sky-400 font-bold mb-1">Pro Tip</p>
                            <p className="text-xs text-white/85 leading-relaxed">{school.proTip}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* COMPARISON tab — UPRT vs Standard Type Rating */}
                    {trSchoolTab === 'comparison' && cardId === '078eea1a-271f-4392-a802-9a2ea4c36da0' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                        <div className="px-6 py-6">
                          <p className="text-[10px] uppercase tracking-widest text-violet-400 font-bold mb-3">UPRT — Special Rating</p>
                          <div className="space-y-3">
                            <div className="px-3 py-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                              <p className="text-[10px] uppercase text-violet-300 font-bold mb-1">Purpose</p>
                              <p className="text-xs text-white/85">Upset Prevention & Recovery Training — addresses LOC-I (Loss of Control In-flight), the #1 cause of fatal aviation accidents.</p>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Duration</p>
                              <p className="text-sm text-white font-semibold">1–2 weeks intensive</p>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Cost</p>
                              <p className="text-sm text-white font-semibold">₱36,000–₱120,000 ($2,500–$5,000)</p>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Training Method</p>
                              <p className="text-xs text-white/85">• Aerobatic-capable aircraft (Super Decathlon, Cessna Aerobat)<br/>• Real-world unusual attitude recovery<br/>• Spin entry & recovery (actual spins, not sim)</p>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Outcome</p>
                              <p className="text-xs text-white/85">CAAP UPRT endorsement required for CPL renewal and many airline type ratings.</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-6">
                          <p className="text-[10px] uppercase tracking-widest text-sky-400 font-bold mb-3">Standard Type Rating — A320/B737/etc.</p>
                          <div className="space-y-3">
                            <div className="px-3 py-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                              <p className="text-[10px] uppercase text-sky-300 font-bold mb-1">Purpose</p>
                              <p className="text-xs text-white/85">Qualification to operate specific aircraft type (A320, B737, A330, B777, ATR) as First Officer.</p>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Duration</p>
                              <p className="text-sm text-white font-semibold">4–12 weeks (ground + sim + line training)</p>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Cost</p>
                              <p className="text-sm text-white font-semibold">$18,000–$50,000+ depending on type</p>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Training Method</p>
                              <p className="text-xs text-white/85">• Level D Full-Flight Simulators (FFFS)<br/>• Systems & procedures training<br/>• Multi-crew cooperation (MCC)<br/>• Line Oriented Flight Training (LOFT)</p>
                            </div>
                            <div className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
                              <p className="text-[10px] uppercase text-white/60 font-bold mb-1">Outcome</p>
                              <p className="text-xs text-white/85">Type Rating Certificate — airline entry ticket. No manual handling in actual aircraft.</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 px-6 py-4 border-t border-white/10 bg-white/5">
                          <p className="text-[10px] uppercase text-white/60 font-bold mb-2">Key Insight — Why Both Matter</p>
                          <p className="text-xs text-white/85 leading-relaxed">Standard type ratings teach you to operate an airline jet. UPRT teaches you to survive when automation fails and the aircraft enters an unusual attitude. ASEAN needs <strong>22,000 pilots by 2033</strong>; CAAP targets <strong>3x pilot output by 2028</strong>. Airlines want both qualifications — the type rating for the job, UPRT for the survival skills that prevent becoming a statistic.</p>
                        </div>
                      </div>
                    )}

                    {/* ACCESS tab */}
                    {trSchoolTab === 'access' && (
                      <div className="px-6 py-6 space-y-3">
                        <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-3">Enrollment & Access</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="px-3 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-[10px] uppercase text-emerald-400 font-bold mb-0.5">Intake Status</p>
                            <p className="text-sm text-white/85 font-semibold">Open Enrolment — Rolling Intake</p>
                            <p className="text-xs text-white/70 mt-1">Training programmes are offered year-round. Contact training centres directly to confirm slot availability.</p>
                          </div>
                          <div className="px-3 py-3 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-[10px] uppercase text-white/60 font-bold mb-0.5">Estimated Cost</p>
                            <p className="text-sm text-red-300 font-semibold">{fsPrice}</p>
                          </div>
                          <div className="px-3 py-3 rounded-lg bg-white/5 border border-white/10 md:col-span-2">
                            <p className="text-[10px] uppercase text-white/60 font-bold mb-1">How to Start</p>
                            <ol className="text-xs text-white/85 space-y-1 leading-relaxed list-decimal list-inside">
                              <li>Confirm you meet the entry requirements listed above</li>
                              <li>Contact 2–3 CAAP-approved training centres to compare slot availability and pricing</li>
                              <li>Submit documents (licence, medical, logbook) and complete any required pre-entry assessment</li>
                              <li>Pay training fees and receive your training schedule</li>
                              <li>Complete ground school before gaining simulator/aircraft access</li>
                            </ol>
                          </div>
                          {fsWebsite && (
                            <a href={fsWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300 hover:text-red-200 font-semibold transition-colors md:col-span-2">
                              Visit Official Website
                              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // For dedicated type-rating cards (A320, B737, etc.)
              const trCard = (DISCOVERY_PATHWAYS['type-rating'] || []).find((j: PathwayJob) => j.id === cardId);
              if (!trCard) return null;
              const reqs: string[] = trCard.requirements || [];
              const tags: string[] = trCard.tags || [];
              const CATEGORY_COLOR: Record<string, string> = {
                'Narrowbody Type Rating': 'sky',
                'Widebody Type Rating': 'violet',
                'Turboprop Type Rating': 'amber',
                'Pre-Type Rating Course': 'emerald',
                'Mandatory Safety Rating': 'orange',
              };
              const color = CATEGORY_COLOR[trCard.type] || 'sky';
              const colorMap: Record<string, string> = {
                sky: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
                violet: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
                amber: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
                emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
                orange: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
              };
              const chipClass = colorMap[color] || colorMap.sky;
              const colorBarMap: Record<string, string> = {
                sky: 'linear-gradient(90deg, #0369a1 0%, #075985 100%)',
                violet: 'linear-gradient(90deg, #6d28d9 0%, #4c1d95 100%)',
                amber: 'linear-gradient(90deg, #b45309 0%, #92400e 100%)',
                emerald: 'linear-gradient(90deg, #047857 0%, #065f46 100%)',
                orange: 'linear-gradient(90deg, #c2410c 0%, #9a3412 100%)',
              };
              const barGradient = colorBarMap[color] || colorBarMap.sky;
              const chipTextColorMap: Record<string, string> = {
                sky: 'text-sky-900 bg-sky-200',
                violet: 'text-violet-900 bg-violet-200',
                amber: 'text-amber-900 bg-yellow-200',
                emerald: 'text-emerald-900 bg-emerald-200',
                orange: 'text-orange-900 bg-orange-200',
              };
              const badgeClass = chipTextColorMap[color] || chipTextColorMap.sky;
              return (
                <div className="mt-8 mx-4 rounded-2xl overflow-hidden shadow-2xl" style={{ backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  {/* Dark navy headline bar */}
                  <div className="px-6 py-4 flex items-center justify-between gap-4" style={{ background: 'linear-gradient(90deg, #0f1e3d 0%, #1a2f5a 100%)' }}>
                    <div className="flex items-center gap-3 flex-wrap min-w-0">
                      <h3 className="text-xl font-serif font-semibold text-white leading-tight">{trCard.title}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${badgeClass}`}>{trCard.type}</span>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-blue-300/70 text-[9px] uppercase tracking-widest mb-0.5">Estimated Cost</p>
                      <p className="text-white text-base font-bold leading-tight">{trCard.salary}</p>
                    </div>
                  </div>
                  {/* Sub-header: provider + location — slightly lighter navy */}
                  <div className="px-6 py-3 flex items-center gap-4 border-b border-white/10" style={{ background: 'rgba(15,30,61,0.60)' }}>
                    <p className="text-white font-semibold text-sm">{trCard.company}</p>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <p className="text-white/60 text-sm flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {trCard.location}
                    </p>
                  </div>
                  {/* Glassy body */}
                  <div className="grid grid-cols-1 md:grid-cols-3" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                    <div className="px-6 py-5 border-b md:border-b-0 md:border-r border-white/10">
                      <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-3">Entry Requirements</p>
                      <ul className="space-y-2">
                        {reqs.map(r => (
                          <li key={r} className="flex items-start gap-2 text-sm text-white/85">
                            <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="px-6 py-5 border-b md:border-b-0 md:border-r border-white/10">
                      <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3">Training Locations</p>
                      <ul className="space-y-2">
                        {trCard.location.split(' · ').map((loc: string) => (
                          <li key={loc} className="flex items-center gap-2 text-sm text-white/85">
                            <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {loc.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="px-6 py-5">
                      <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map(t => (
                          <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white/80 border border-white/15">{t}</span>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Enrollment</p>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">{trCard.postedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Enterprise Pathway Card Detail Panel — appears when an enterprise card is selected */}
            {selectedCarouselPathway?.isEnterprise && selectedPathwayCard?.category !== 'flight-schools' && selectedPathwayCard?.category !== 'type-rating' && (() => {
              const p = selectedCarouselPathway;
              const alreadySubmitted = interestSubmitted === p.id;
              const minHours = p.requirements?.totalHours || 0;
              return (
                <div className="mt-8 mx-4 rounded-2xl overflow-hidden border border-blue-500/20 bg-blue-950/20 backdrop-blur-sm">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/8">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {p.enterpriseLogoUrl ? (
                        <img src={p.enterpriseLogoUrl} alt={p.airline} className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1.5 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="text-lg font-semibold text-white leading-tight">{p.name}</h3>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-300 bg-blue-600/30 border border-blue-500/30">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Airline Posted
                          </span>
                        </div>
                        <p className="text-white/50 text-sm">{p.airline}</p>
                        {p.description && <p className="text-white/35 text-xs mt-1 line-clamp-2">{p.description}</p>}
                      </div>
                    </div>
                    {/* Interest level badge */}
                    <div className="shrink-0 text-right">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        p.interestLevel === 'high_interest' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : p.interestLevel === 'limited' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-slate-600/30 text-slate-400 border border-slate-600/30'
                      }`}>
                        {p.interestLevel === 'high_interest' ? '● Actively Hiring' : p.interestLevel === 'limited' ? '● Limited Slots' : '● Considering'}
                      </span>
                    </div>
                  </div>

                  {/* Body grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/8">

                    {/* Requirements */}
                    <div className="px-6 py-5">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Requirements</p>
                      <div className="space-y-2.5">
                        {minHours > 0 && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/50">Min Flight Hours</span>
                            <span className="text-white font-semibold">{minHours.toLocaleString()}h</span>
                          </div>
                        )}
                        {(p.requirements?.typeRatings || []).length > 0 && (
                          <div className="flex items-start justify-between text-xs gap-2">
                            <span className="text-white/50 shrink-0">Type Ratings</span>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {(p.requirements.typeRatings || []).map((tr: string) => (
                                <span key={tr} className="bg-blue-600/20 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px]">{tr}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {p.locations?.length > 0 && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/50">Base Location</span>
                            <span className="text-white/80">{p.locations[0]}</span>
                          </div>
                        )}
                        {p.positions && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/50">Positions Available</span>
                            <span className="text-white font-semibold">{p.positions}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Compensation */}
                    <div className="px-6 py-5">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Compensation</p>
                      <div className="space-y-2.5">
                        {p.salary?.firstYear && (
                          <div className="flex items-start justify-between text-xs gap-2">
                            <span className="text-white/50 shrink-0">Package</span>
                            <span className="text-emerald-400 font-semibold text-right">{p.salary.firstYear}</span>
                          </div>
                        )}
                        {p.salary?.fifthYear && (
                          <div className="flex items-start justify-between text-xs gap-2">
                            <span className="text-white/50 shrink-0">Progression</span>
                            <span className="text-white/70 text-right">{p.salary.fifthYear}</span>
                          </div>
                        )}
                        {p.salary?.bonuses && (
                          <div className="flex items-start justify-between text-xs gap-2">
                            <span className="text-white/50 shrink-0">Benefits</span>
                            <span className="text-white/70 text-right">{p.salary.bonuses}</span>
                          </div>
                        )}
                        {(p.benefits || []).length > 0 && (
                          <div className="pt-2 border-t border-white/8 space-y-1">
                            {(p.benefits || []).slice(0, 3).map((b: string, i: number) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-white/50">
                                <svg className="w-3 h-3 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                                {b}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Interest CTA */}
                    <div className="px-6 py-5 flex flex-col justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Pulling System</p>
                        <p className="text-white/50 text-xs leading-relaxed mb-4">
                          Submit your verified profile to this airline's interest pool. They pull from candidates — you don't push an application.
                        </p>
                        {cadетGateStatus.restricted ? (
                          <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3.5">
                            <div className="flex items-center gap-2 mb-1.5">
                              <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">Gate Restricted — Cadet Track Mode</p>
                            </div>
                            <p className="text-white/50 text-xs leading-relaxed">
                              {cadетGateStatus.reason === 'minor+student'
                                ? 'Terminal 3 requires age 18+ and a validated CPL or ATPL. You are currently in Cadet Track Mode as a minor student pilot.'
                                : cadетGateStatus.reason === 'minor'
                                ? 'Terminal 3 requires a minimum age of 18. Your profile is saved — gates unlock automatically when you reach eligibility.'
                                : 'Terminal 3 requires a validated Commercial Pilot License (CPL/ATPL). Student and PPL licenses are restricted to the open pathway lounge.'}
                            </p>
                            <p className="text-amber-500/70 text-[10px] mt-2">You can view all pathways and track your progress. Submissions unlock when eligibility requirements are met.</p>
                          </div>
                        ) : alreadySubmitted ? (
                          <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-4 py-3">
                            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <div>
                              <p className="text-emerald-400 text-sm font-semibold">Interest Submitted</p>
                              <p className="text-emerald-600 text-xs">Your profile is now in their pool</p>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => currentUser && setSkybridgePendingPathway(p)}
                            disabled={!currentUser || interestSubmitting}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/20"
                          >
                            {interestSubmitting ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                            )}
                            {currentUser ? 'Submit Interest' : 'Sign in to Submit Interest'}
                          </button>
                        )}
                      </div>
                      {!currentUser && (
                        <p className="text-white/30 text-[10px] text-center">
                          <a href="/login" className="text-blue-400 hover:text-blue-300 underline">Create a free account</a> to submit interest and be discoverable by this airline.
                        </p>
                      )}
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors border border-white/10 rounded-xl py-2">
                          View Official Posting
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-3 border-t border-white/8">
                    <p className="text-white/20 text-[10px]">This pathway card was posted directly by the airline via the PilotRecognition Enterprise Portal. Interest submissions are visible only to the posting operator.</p>
                  </div>
                </div>
              );
            })()}

            {/* Flight School Detail Panel — appears when a Stage 2 card is selected */}
            {selectedCarouselPathway && selectedPathwayCard?.category === 'flight-schools' && (() => {
              const cardId = selectedCarouselPathway.id;
              // Supabase data takes priority; static DUMMY data is fallback while loading
              const sb = flightSchoolCardData[cardId];
              const staticFallback = DUMMY_FLIGHT_SCHOOLS.find(s => s.id === cardId);
              const eng = flightSchoolEngagement[cardId];
              const isLoading = !sb;

              const name = selectedCarouselPathway.name;
              const location = sb?.location || selectedCarouselPathway.locations?.[0] || staticFallback?.location || '';
              const price = sb?.price || staticFallback?.price || selectedCarouselPathway.description || '—';
              const rating: number = sb?.rating ?? staticFallback?.rating ?? ((selectedCarouselPathway.matchProbability || 0) * 5);
              const fleet: string[] = sb?.fleet || staticFallback?.fleet || [];
              const offerings: string[] = sb?.offerings || staticFallback?.offerings || [];
              const pilotsTrained: number | undefined = sb?.pilots_trained ?? staticFallback?.pilotsTrained;
              const established: number | undefined = sb?.established ?? staticFallback?.established;
              const website: string | undefined = sb?.website || staticFallback?.website;
              const pathwayScore: number = sb?.pathway_score ?? staticFallback?.pathwayScore ?? Math.round(selectedCarouselPathway.matchProbability * 100);
              const claimed: boolean = sb?.claimed ?? selectedCarouselPathway.claimed ?? false;
              const description: string = sb?.description || staticFallback?.description || '';
              // Engagement from DB totals, fallback to score-derived estimates
              const likeCount: number = eng?.like_count ?? Math.round(pathwayScore * 3.2);
              const favoriteCount: number = eng?.favorite_count ?? Math.round(pathwayScore * 0.9);
              const bookmarkCount: number = eng?.bookmark_count ?? Math.round(pathwayScore * 1.8);

              return (
                <div className={`mt-8 mx-4 rounded-2xl overflow-hidden border border-white/8 bg-white/4 backdrop-blur-sm transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
                  {/* Header strip */}
                  <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/8">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-serif font-normal text-white leading-tight">{name}</h3>
                        {claimed ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-sky-600/80">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Claimed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white/50 bg-white/8 border border-white/10">Unverified</span>
                        )}
                      </div>
                      <p className="text-white/50 text-xs flex items-center gap-1">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {location}
                        {established && <><span className="mx-1 opacity-30">·</span>Est. {established}</>}
                      </p>
                      {description && <p className="text-white/40 text-xs mt-2 leading-relaxed line-clamp-2">{description}</p>}
                    </div>
                    {/* Pathway Score */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                          <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
                          <circle cx="28" cy="28" r="22" fill="none" stroke={pathwayScore >= 90 ? '#22d3ee' : pathwayScore >= 75 ? '#60a5fa' : '#94a3b8'} strokeWidth="4"
                            strokeDasharray={`${(pathwayScore / 100) * 138.2} 138.2`} strokeLinecap="round"/>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">{pathwayScore}</span>
                      </div>
                      <span className="text-[9px] text-white/40 uppercase tracking-wider mt-1">Pathway Score</span>
                    </div>
                  </div>

                  {/* Body grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/8">

                    {/* Location & Meta */}
                    <div className="px-5 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Overview</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">Rating</span>
                          <span className="text-white flex items-center gap-1">
                            {'★'.repeat(Math.max(0, Math.min(5, Math.floor(rating || 0))))}<span className="text-white/30">{'★'.repeat(Math.max(0, 5 - Math.min(5, Math.floor(rating || 0))))}</span>
                            <span className="text-white/60 ml-1">{rating.toFixed(1)}</span>
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-white/40">Tuition</span>
                          <span className="text-white/80 text-right max-w-[120px] leading-tight">{price}</span>
                        </div>
                        {pilotsTrained && (
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Pilots Trained</span>
                            <span className="text-white/80">{pilotsTrained.toLocaleString()}+</span>
                          </div>
                        )}
                        {established && (
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Established</span>
                            <span className="text-white/80">{established}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Training Offerings */}
                    <div className="px-5 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Training Offerings</p>
                      {offerings.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {offerings.map(o => (
                            <span key={o} className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/15 text-sky-300 border border-sky-500/20">{o}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/30 text-xs italic">Data pending verification</p>
                      )}
                    </div>

                    {/* Fleet */}
                    <div className="px-5 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Fleet</p>
                      {fleet.length > 0 ? (
                        <ul className="space-y-1.5">
                          {fleet.map(f => (
                            <li key={f} className="flex items-center gap-2 text-xs text-white/70">
                              <svg className="w-3 h-3 text-white/20 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-white/30 text-xs italic">Data pending verification</p>
                      )}
                    </div>

                    {/* Pathway Score breakdown + engagement */}
                    <div className="px-5 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Community Signal</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Liked by pilots', value: likeCount, icon: '♥' },
                          { label: 'Bookmarked', value: bookmarkCount, icon: '⊞' },
                          { label: 'Favorited', value: favoriteCount, icon: '★' },
                        ].map(({ label, value, icon }) => (
                          <div key={label} className="flex items-center justify-between text-xs">
                            <span className="text-white/40 flex items-center gap-1.5"><span className="text-white/20">{icon}</span>{label}</span>
                            <span className="text-white/70 tabular-nums">{value}</span>
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-white/8">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/40">Pathway Score</span>
                            <span className={`font-bold ${pathwayScore >= 90 ? 'text-cyan-400' : pathwayScore >= 75 ? 'text-blue-400' : 'text-slate-400'}`}>{pathwayScore}/100</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                            <div className={`h-full rounded-full ${pathwayScore >= 90 ? 'bg-cyan-400' : pathwayScore >= 75 ? 'bg-blue-400' : 'bg-slate-400'}`} style={{ width: `${pathwayScore}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  {website && (
                    <div className="px-6 py-3 border-t border-white/8 flex items-center justify-between">
                      <span className="text-white/30 text-xs">{claimed ? 'Official information provided by the school' : 'Data sourced by PilotRecognition — unverified'}</span>
                      <a href={website} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors">
                        Visit Website
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      </a>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Job Position Filter - Only show in jobs mode */}
        {mode === 'jobs' && (
          <div className="flex items-center gap-3 justify-center mt-6">
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
        )}

        {mode === 'jobs' && currentUser && (
          <JobIntelligenceBanner
            jobMatches={intelligence.jobMatches}
            loading={intelligence.loadingJobs}
            isDarkMode={isDarkMode}
          />
        )}

        {mode === 'jobs' && currentUser && intelligence.jobMatches?.blindSpotPicks && (
          <BlindSpotPicksRow
            blindSpots={intelligence.jobMatches.blindSpotPicks}
            loading={intelligence.loadingJobs}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Testimonials Section - Build Trust */}
        <section className={`py-12 px-6 ${isDarkMode ? 'bg-slate-800/30 border-y border-slate-700/50' : 'bg-slate-50/50 border-y border-slate-200'} mt-12`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-400 mb-2">Success Stories</p>
              <h2 className={`text-2xl md:text-3xl font-serif font-normal ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                Pilots Who Found Their Pathway
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Real pilots. Real careers. Real results through PilotRecognition.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'} backdrop-blur-sm`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    JM
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>James Mitchell</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>First Officer at Delta Air Lines</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  "I was stuck as a CFI with 1,200 hours and no clear path forward. The Recognition Score showed me exactly what I was missing. 8 months later, I'm in a Delta cockpit."
                </p>
                <div className={`mt-4 pt-4 border-t text-xs ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <span className="font-semibold text-sky-400">Pathway:</span> Regional Airline → Major Airline
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'} backdrop-blur-sm`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                    SC
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sarah Chen</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Captain at NetJets</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  "The pathway cards eliminated guesswork. I could see exactly which corporate operators wanted my 4,000 hours + type rating. No more shotgun applications."
                </p>
                <div className={`mt-4 pt-4 border-t text-xs ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <span className="font-semibold text-sky-400">Pathway:</span> Charter Pilot → Corporate Captain
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'} backdrop-blur-sm`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    MR
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Marcus Rodriguez</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Airbus A350 Captain at Cathay Pacific</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  "My Recognition Score travelled with me from a US regional to Hong Kong. Airlines saw my verified profile and skipped the guesswork. Cadet to Captain in 6 years."
                </p>
                <div className={`mt-4 pt-4 border-t text-xs ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <span className="font-semibold text-sky-400">Pathway:</span> Cadet Program → International Captain
                </div>
              </div>
            </div>
            
            {/* Trust Stats */}
            <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} grid grid-cols-2 md:grid-cols-4 gap-6 text-center`}>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>12,000+</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pilot Profiles</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>450+</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active Pathways</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>89%</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Match Accuracy</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>3,200+</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Career Placements</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-8 px-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} mt-12`}>
          <div className="mx-auto max-w-[1800px]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                © 2026 WingMentor. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a href="#" className={`text-sm ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
                  Privacy Policy
                </a>
                <a href="#" className={`text-sm ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
                  Terms of Service
                </a>
                <a href="#" className={`text-sm ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
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

      {/* Military Pathways Page */}
      {showMilitaryPathwaysPage && (
        <div className="absolute inset-0 z-[100] bg-white overflow-auto">
          <MilitaryPathwaysPage
            pathwayId="military"
            onBack={() => setShowMilitaryPathwaysPage(false)}
          />
        </div>
      )}

      {/* Special Pathways Page */}
      {showSpecialPathwaysPage && (
        <>
          <div className="absolute inset-0 z-[200] bg-white overflow-auto">
            <SpecialPathwaysPage
              pathwayId="d36018dd-a116-4925-83ca-6acb414f4020"
              onBack={() => setShowSpecialPathwaysPage(false)}
              onNavigate={onNavigate}
            />
          </div>
        </>
      )}

      {/* Licensure & Type Rating Page */}
      {showLicensureTypeRatingPage && (
        <>
          <div className="absolute inset-0 z-[200] bg-slate-900 overflow-auto">
            <LicensureTypeRatingPage
              pathwayId="aaa44819-37ec-40e7-a6cf-6d1990040d65"
              onBack={() => setShowLicensureTypeRatingPage(false)}
            />
          </div>
        </>
      )}

      {/* Commercial Pilot Pathway Page */}
      {showCommercialPilotPathwayPage && (
        <>
          <div className="absolute inset-0 z-[200] bg-slate-900 overflow-auto">
            <CommercialPilotPathwayPage
              pathwayId="7cbd80b9-1172-4b8a-b7e0-e975c91b3ee1"
              onBack={() => setShowCommercialPilotPathwayPage(false)}
            />
          </div>
        </>
      )}
      </div>
    </div>
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
      onNavigate={(page) => {
        setIsLoginModalOpen(false);
        if (onNavigate) {
          onNavigate(page);
        }
      }}
    />

      {/* Align Profile Tools - Floating Button (only when logged in) */}
      {userProfile?.id && (
      <div className="fixed bottom-6 right-6 z-50">
        {!isAlignProfileOpen ? (
          <button
            onClick={() => setIsAlignProfileOpen(true)}
            className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border border-indigo-500 hover:from-indigo-500 hover:to-violet-500' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border border-indigo-500 hover:from-indigo-500 hover:to-violet-500'
            }`}
            aria-label="Align your profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-sm font-medium hidden md:inline">Align Profile</span>
          </button>
        ) : (
          <div className={`w-96 rounded-2xl shadow-2xl p-5 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Align Profile Tools
                </h3>
              </div>
              <button 
                onClick={() => setIsAlignProfileOpen(false)}
                className={`p-1 rounded-full hover:bg-slate-100 ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-500'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Engine Stats */}
            {engineStats ? (
              <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-slate-900/50 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    ⚡ Engine Active
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    v{engineStats.algorithmVersion}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <span className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Time</span>
                    <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{engineStats.lastCalculationTime}ms</span>
                  </div>
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <span className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pathways</span>
                    <span className="font-bold text-white">{engineStats.pathwaysLoaded}</span>
                  </div>
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <span className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Matches</span>
                    <span className="font-bold text-white">{engineStats.matchesCalculated}</span>
                  </div>
                  <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <span className={`block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Avg Score</span>
                    <span className={`font-bold ${engineStats.avgMatchScore >= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>{engineStats.avgMatchScore}%</span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Profile Status */}
            <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Profile Completion</span>
                <span className="text-sm font-medium text-indigo-500">{profileCompletion}%</span>
              </div>
              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'}`}>
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
              </div>
              {engineProfile && (
                <div className={`mt-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {engineProfile.total_flight_hours.toLocaleString()} hrs • {engineProfile.ratings.length} ratings • {engineProfile.type_ratings.length} type ratings
                </div>
              )}
            </div>
            
            {/* Top Pathway Matches */}
            {alignProfileLoading ? (
              <div className="mb-4 flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500" />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Calculating matches...</span>
              </div>
            ) : alignProfileMatches.length > 0 ? (
              <div className="mb-4">
                <p className={`text-xs font-medium uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Your Top Matches
                </p>
                <div className="space-y-2">
                  {alignProfileMatches.map((match) => (
                    <div 
                      key={match.id}
                      onClick={() => {
                        setIsAlignProfileOpen(false);
                        onNavigate?.(`/pathways-detail/${match.pathway_id}`);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isDarkMode 
                          ? 'bg-slate-700/30 hover:bg-slate-700/50' 
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            match.match_score >= 85 ? 'bg-emerald-400' :
                            match.match_score >= 60 ? 'bg-amber-400' : 'bg-red-400'
                          }`} />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                            {match.pathways?.name || 'Pathway'}
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${
                          match.match_score >= 85 ? 'text-emerald-400' :
                          match.match_score >= 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {match.match_score}%
                        </span>
                      </div>
                      {match.gaps_count > 0 && (
                        <div className={`mt-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {match.gaps_count} gaps to close
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            
            {/* Quick Actions */}
            <div className="space-y-2 mb-4">
              <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Quick Actions
              </p>
              
              <button
                onClick={() => {
                  setIsAlignProfileOpen(false);
                  onNavigate?.('/dashboard');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-200' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">View Dashboard</div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>See your pathway matches</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setIsAlignProfileOpen(false);
                  onNavigate?.('/profile');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-200' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Update Profile</div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Add hours, ratings, certificates</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setIsAlignProfileOpen(false);
                  onNavigate?.('/discover');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-200' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Discover Pathways</div>
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Find matching opportunities</div>
                </div>
              </button>
            </div>
            
            {/* Recognition Score Preview */}
            <div className={`p-3 rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Recognition Score</span>
                </div>
                <span className="text-lg font-bold text-amber-400">{recognitionScore}</span>
              </div>
              <div className={`mt-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {recognitionScore >= 70 ? 'Excellent standing' :
                 recognitionScore >= 50 ? 'Good progress' :
                 'Build your profile to increase'}
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Engine Debug Panel — Ctrl+Shift+E to toggle */}
      {showEngineDebug && (
        <div className="fixed top-20 right-4 z-[9998] w-80 max-h-[70vh] overflow-y-auto rounded-xl shadow-2xl border border-indigo-500/30 bg-slate-900/95 backdrop-blur-sm">
          <div className="sticky top-0 bg-slate-900/95 border-b border-indigo-500/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">Engine Debug</span>
            </div>
            <button 
              onClick={() => setShowEngineDebug(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Engine Status */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Status</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded ${engineStats ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {engineStats ? '✓ Active' : '○ Idle'}
                </div>
                <div className="p-2 rounded bg-slate-700/50 text-slate-300">
                  v1.0.0-browser
                </div>
              </div>
            </div>

            {/* Calculation Stats */}
            {engineStats && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Last Calculation</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span className="text-emerald-400">{engineStats.lastCalculationTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pathways:</span>
                    <span className="text-white">{engineStats.pathwaysLoaded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Matches:</span>
                    <span className="text-white">{engineStats.matchesCalculated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Score:</span>
                    <span className={engineStats.avgMatchScore >= 60 ? 'text-emerald-400' : 'text-amber-400'}>
                      {engineStats.avgMatchScore}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Factors */}
            {engineStats?.profileFactors && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Profile Inputs</p>
                <div className="space-y-1 text-xs">
                  {Object.entries(engineStats.profileFactors).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-white font-mono">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Matches Preview */}
            {alignProfileMatches.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Top Matches</p>
                <div className="space-y-1">
                  {alignProfileMatches.map((match, i) => (
                    <div key={match.id} className="flex items-center justify-between p-2 rounded bg-slate-700/30">
                      <span className="text-xs text-slate-300 truncate w-32">{match.pathways?.name || `Match ${i+1}`}</span>
                      <span className={`text-xs font-bold ${
                        match.match_score >= 85 ? 'text-emerald-400' :
                        match.match_score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {match.match_score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Algorithm Weights Reference */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Weights</p>
              <div className="text-xs text-slate-400 space-y-0.5">
                <div>Hours: 35% | Medical: 20%</div>
                <div>Ratings: 20% | English: 15%</div>
                <div>Recognition: 10%</div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center pt-2 border-t border-slate-700">
              Press Ctrl+Shift+E to toggle
            </p>
          </div>
        </div>
      )}

      {/* Article 4 — Skybridge T2 Legal Notice Modal */}
      {skybridgePendingPathway && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSkybridgePendingPathway(null)} />
          <div className="relative z-10 w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/8 flex items-start gap-3">
              <span className="text-xl leading-none mt-0.5">🛃</span>
              <div>
                <p className="text-white font-bold text-sm">Skybridge Clearance — Terminal 2</p>
                <p className="text-white/40 text-xs mt-0.5">Article 4 — PR-DCA-001 v1.6</p>
              </div>
            </div>
            {/* Pathway being submitted */}
            <div className="px-5 py-3 bg-white/5 border-b border-white/8">
              <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Routing cargo to</p>
              <p className="text-white font-semibold text-sm">{skybridgePendingPathway.airline || skybridgePendingPathway.name}</p>
              {skybridgePendingPathway.locations?.[0] && (
                <p className="text-white/40 text-xs">{skybridgePendingPathway.locations[0]}</p>
              )}
            </div>
            {/* Legal notice body */}
            <div className="px-5 py-4">
              <p className="text-white/70 text-xs leading-relaxed">
                By submitting your self-declared credentials to this gate, you instruct the platform to open a pass-through skybridge to the operator.
                The receiving entity acts as an <span className="text-white font-semibold">Independent Data Controller</span> of this cargo.
                WM Pilot Group does not verify Terminal 2 entries and assumes <span className="text-white font-semibold">zero liability</span> for downstream HR data retention or vetting.
              </p>
              <div className="mt-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[10px] text-white/35 leading-relaxed">
                Your profile data is encrypted on your device (AES-256-GCM) before transmission. The operator receives only a signed, self-declared credential payload — no raw personal data is transferred by WM Pilot Group.
              </div>
            </div>
            {/* Actions */}
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setSkybridgePendingPathway(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 font-semibold text-sm hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const pathway = skybridgePendingPathway;
                  setSkybridgePendingPathway(null);
                  handleSubmitInterest(pathway);
                }}
                disabled={interestSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {interestSubmitting ? 'Submitting...' : 'Open Skybridge — Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Match Result Modal Component
interface MatchResultModalProps {
  pathway: PathwayData;
  userProfile: any;
  isDarkMode: boolean;
  onClose: () => void;
}

const MatchResultModal: React.FC<MatchResultModalProps> = ({ pathway, userProfile, isDarkMode, onClose }) => {
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
