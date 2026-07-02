import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { safeRedirect } from '@/lib/url-validator';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/toast';
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
  ChevronUp,
  Compass,
  PlaneTakeoff,
  MessageSquare
} from 'lucide-react';
import MilitaryPathwaysPage from './MilitaryPathwaysPage';
import SpecialPathwaysPage from './SpecialPathwaysPage';
import LicensureTypeRatingPage from './LicensureTypeRatingPage';
import CommercialPilotPathwayPage from './CommercialPilotPathwayPage';
import { PathwaysSidebar } from '../../components/website/components/pilot-recognition/PathwaysSidebar';
import { PlatformNavbar } from '../../components/website/components/PlatformNavbar';
import { RecognitionAIChat } from '../../components/website/components/unified-platform/RecognitionAIChat';
import { useAuth } from '@/contexts/AuthContext';
import { usePathwaysIntelligence } from '../hooks/usePathwaysIntelligence';
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
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  pathwayEngine, 
  extractPilotProfile, 
  cachePathways, 
  getCachedPathways,
  type LocalPilotProfile 
} from '../../lib/pathways/pathwayMatchingEngine';
import type { PathwayMatch } from '../../lib/pathways/types';
import type { PathwayData, GapAnalysis, RecognitionProfile, RequirementMatch } from './pathways/components/types';
import { InterestBadge } from './pathways/components/InterestBadge';
import { ProbabilityBadge } from './pathways/components/ProbabilityBadge';
import {
  CLOUDINARY_AIRLINES,
  FALLBACK_IMAGES,
  AIRCRAFT_IMAGES,
  AIRLINE_LOGOS,
  getAircraftImage,
  getAirlineLogo,
  extractAircraftFromTitle,
  getAirlineImage,
} from './pathways/components/airlineImageBank';
import {
  MOCK_GAP_ANALYSIS,
  MOCK_USER_PROFILE,
  convertToRecognitionProfile,
  calcMatchProbability,
  analyzeRequirementAlignment,
} from './pathways/components/pathwayAnalysis';
import { GlassCard } from './pathways/components/GlassCard';

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

// Types imported from ./pathways/components/types

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
      postedAt: 'Active',
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
      postedAt: 'Active',
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
      postedAt: 'Active',
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
      postedAt: 'Active',
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
      postedAt: 'Active',
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

// ============================================================================
// COMPONENTS
// ============================================================================

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
                    <div className="flex items-center justify-center h-full text-slate-500">Aircraft Preview</div>
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
                    <div className="flex items-center justify-center h-full text-slate-500">Cockpit Preview</div>
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
    { label: 'Cadet Programs', img: '/image_4c913bfc.png', category: 'Entry Level' },
    { label: 'A320 Type Rating', img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80', category: 'Training' },
    { label: 'Low Time Pilot', img: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80', category: '0-500 hrs' },
    { label: 'Dubai Airlines', img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80', category: 'Location' },
    { label: 'Cargo Operations', img: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80', category: 'Sector' },
  ];

  const filterGroups = [
    {
      title: 'Total Hours',
      options: ['0-500 hrs', '500-1000 hrs', '1000-1500 hrs', '1500+ hrs'],
    },
    {
      title: 'Ratings',
      options: ['PPL', 'CPL', 'ATPL', 'A320', 'B737', 'B777'],
    },
    {
      title: 'Country',
      options: ['UAE', 'USA', 'UK', 'Qatar', 'Singapore', 'Canada'],
    },
  ];

  const handleFilterClick = (filter: string) => {
    setInputValue(filter);
    onSearch(filter);
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.value = filter;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.value = suggestion;
  };

  return (
    <div className="relative w-full">
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

      {/* Search Suggestions Dropdown - Glassy with image cards and filters */}
      {showSuggestions && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden z-50 bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 materialize"
        >
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">
              Trending Searches
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {trendingSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(item.label)}
                  className="group relative h-28 rounded-xl overflow-hidden text-left transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-sky-400/50 focus:outline-none"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <img
                    src={item.img}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white w-fit mb-1">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-white leading-tight drop-shadow-lg">
                      {item.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 dark:border-slate-700/50 mt-4 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-slate-500 dark:text-slate-400">
                Filters
              </p>
              <div className="space-y-3">
                {filterGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-sm font-medium text-white min-w-[100px]">{group.title}</span>
                    <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {group.options.map((option, optionIdx) => (
                        <button
                          key={optionIdx}
                          onClick={() => handleFilterClick(option)}
                          className="px-3 py-1.5 rounded-full text-sm font-medium transition-all border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-md flex-shrink-0"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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

  const { callApi } = useWorkerAuth();

  // Pre-populate with hardcoded fallback so pills render immediately
  // Worker API fetch runs in background to pick up any DB overrides
  useEffect(() => {
    let cancelled = false;
    const fetchGeneralCategories = async () => {
      try {
        const rows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'career_hierarchy_general_categories',
          operation: 'select',
          limit: 100,
        });
        const data = (rows || []).sort((a: any, b: any) => {
          const da = a.display_order || 0;
          const db = b.display_order || 0;
          return da - db;
        });

        if (cancelled) return;
        if (data.length > 0) {
          const overriddenCategories = data.map((cat: any) => ({
            ...cat,
            name: cat.name === 'Drones & Pilotless Drones' ? 'Drones & Airtaxi Pathways' : cat.name
          }));
          setGeneralCategories(overriddenCategories as GeneralCategory[]);
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
  const { callApi } = useWorkerAuth();
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
        const pathwaysRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'career_hierarchy_pathways',
          operation: 'select',
          where: { general_category_id: selectedGeneralCategory },
          limit: 500,
        });
        const pathwaysData = (pathwaysRows || []).sort((a: any, b: any) => {
          const da = a.display_order || 0;
          const db = b.display_order || 0;
          return da - db;
        });

        // Override pathway names for specific pathways
        const overriddenPathways = (pathwaysData as any[]).map((pathway: any) => ({
          ...pathway,
          name: pathway.name === 'Drones & Pilotless Drones' ? 'Drones & Airtaxi Pathways' : pathway.name
        }));

        setPathways(overriddenPathways as Pathway[]);

        // Fetch all sub-pathways for these pathways
        if (overriddenPathways && overriddenPathways.length > 0) {
          const pathwayIds = overriddenPathways.map((p: any) => p.id);
          const subRows = await callApi<Record<string, unknown>[]>('queryTable', {
            table: 'career_hierarchy_sub_pathways',
            operation: 'select',
            where: { pathway_id: pathwayIds[0], is_active: true },
            limit: 500,
          });
          const subPathwaysData = (subRows || []).sort((a: any, b: any) => {
            const da = a.display_order || 0;
            const db = b.display_order || 0;
            return da - db;
          });

          if (!subPathwaysData) {
            console.error('Error fetching sub-pathways: no data');
          } else {
            // Override sub-pathway names for specific sub-pathways
            const overriddenSubPathways = (subPathwaysData as any[]).map((sp: any) => ({
              ...sp,
              name: sp.name === 'Drone pilot certification and UAV training programs' ? 'Learn More about Drones & Airtaxi Pathways' : sp.name
            }));
            setSubPathways(overriddenSubPathways as SubPathway[]);
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
        const rows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'career_hierarchy_sub_pathways',
          operation: 'select',
          where: { pathway_id: selectedPathway, is_active: true },
          limit: 500,
        });
        const data = (rows || []).sort((a: any, b: any) => {
          const da = a.display_order || 0;
          const db = b.display_order || 0;
          return da - db;
        });

        if (data) {
          // Override sub-pathway names for specific sub-pathways
          const overriddenSubPathways = (data as any[]).map((sp: any) => ({
            ...sp,
            name: sp.name === 'Drone pilot certification and UAV training programs' ? 'Learn More about Drones & Airtaxi Pathways' : sp.name
          }));
          setSubPathways(overriddenSubPathways as SubPathway[]);
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
            description: 'Sponsored training with A320 type rating and guaranteed pathway. Monthly stipend of $2,000 during training. Located in Phnom Penh, Cambodia. Age 18-35, high school diploma, and Medical 1 required. Direct pathway to airline career with guaranteed employment.',
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
  const { callApi } = useWorkerAuth();
  const [interestSubmitting, setInterestSubmitting] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState<string | null>(null); // card id
  // Article 4 — Skybridge T2 legal notice state
  const [skybridgePendingPathway, setSkybridgePendingPathway] = useState<PathwayData | null>(null);
  const [stage1Index, setStage1Index] = useState(0);
  const [panelIndex, setPanelIndex] = useState(0);
  const panelCarouselRef = useRef<HTMLDivElement>(null);
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Auto-scroll panel carousel
  useEffect(() => {
    if (isPanelHovered) return;
    const interval = setInterval(() => {
      setPanelIndex((prev) => {
        const next = (prev + 1) % 5;
        const el = panelCarouselRef.current;
        if (el) {
          const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 0;
          el.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isPanelHovered]);

  // Toggle Stage 1 pathway cards visibility
  const SHOW_STAGE_1_CARDS = false;

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
  const isCarouselHovered = useRef(false);
  const [autoCarouselIndex, setAutoCarouselIndex] = useState(0);
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
  const [trSchoolTab, setTrSchoolTab] = useState<'about' | 'expectations' | 'requirements' | 'access' | 'comparison'>('about');
  const [flightSchoolCardImgIdx, setFlightSchoolCardImgIdx] = useState<number>(0);
  const [flightSchoolCardData, setFlightSchoolCardData] = useState<Record<string, any>>({});
  const [flightSchoolEngagement, setFlightSchoolEngagement] = useState<Record<string, any>>({});
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Auto-carousel for Stage 1 — scrolls every 4s, pauses on hover
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCarouselHovered.current) return;
      const el = carouselRef.current;
      if (!el) return;
      const firstCard = el.querySelector<HTMLElement>(':scope > div');
      if (!firstCard) return;
      const cardWidth = firstCard.offsetWidth + 16; // 16 = gap
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextScroll = el.scrollLeft + cardWidth;
      if (nextScroll >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
        setAutoCarouselIndex(0);
      } else {
        el.scrollTo({ left: nextScroll, behavior: 'smooth' });
        setAutoCarouselIndex(i => i + 1);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
      const cardRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'enterprise_pathway_cards',
        operation: 'select',
        where: { id: rawCardId },
        limit: 1,
      });
      const cardRow = cardRows?.[0];
      if (!cardRow) throw new Error('Card not found');
      const existing = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pathway_card_interests',
        operation: 'select',
        where: { pilot_id: currentUser.id, card_id: rawCardId },
        limit: 1,
      });
      if (existing?.[0]?.id) {
        await callApi('queryTable', {
          table: 'pathway_card_interests',
          operation: 'update',
          id: existing[0].id as string,
          data: {
            enterprise_account_id: cardRow.enterprise_account_id,
            submitted_at: new Date().toISOString(),
          },
        });
      } else {
        await callApi('queryTable', {
          table: 'pathway_card_interests',
          operation: 'insert',
          data: {
            pilot_id: currentUser.id,
            card_id: rawCardId,
            enterprise_account_id: cardRow.enterprise_account_id,
            submitted_at: new Date().toISOString(),
          },
        });
      }
      setInterestSubmitted(pathway.id);
    } catch (e) {
      console.error('Failed to submit interest:', e);
    } finally {
      setInterestSubmitting(false);
    }
  };

  // Fetch flight school card data from Worker API when a card is selected
  useEffect(() => {
    if (!selectedCarouselPathway?.id || selectedPathwayCard?.category !== 'flight-schools') return;
    const cardId = selectedCarouselPathway.id;
    // Skip if already cached
    if (flightSchoolCardData[cardId]) return;
    const fetchCard = async () => {
      const [cardRows, totalsRows] = await Promise.all([
        callApi<Record<string, unknown>[]>('queryTable', {
          table: 'flight_school_cards',
          operation: 'select',
          where: { id: cardId },
          limit: 1,
        }),
        callApi<Record<string, unknown>[]>('queryTable', {
          table: 'pathway_card_engagement_totals',
          operation: 'select',
          where: { card_id: cardId, card_type: 'flight_school' },
          limit: 1,
        }),
      ]);
      const card = cardRows?.[0];
      const totals = totalsRows?.[0];
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
    addToast('info', 'Enterprise Posting', 'Pathway posting is available for Enterprise accounts. Contact support to upgrade.');
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
      try {
        const rows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'career_hierarchy_general_categories',
          operation: 'select',
          limit: 100,
        });
        const data = (rows || []).sort((a: any, b: any) => {
          const da = a.display_order || 0;
          const db = b.display_order || 0;
          return da - db;
        });
        const overriddenCategories = data.map(cat => ({
          ...cat,
          name: (cat.name as string) === 'Drones & Pilotless Drones' ? 'Drones & Airtaxi Pathways' : cat.name
        }));
        setStage1Categories(overriddenCategories as any);
      } catch (err) {
        console.error('Error fetching general categories:', err);
        setStage1Categories([]);
      }
    };

    fetchGeneralCategories();
  }, []);

  // Stage 2: Fetch Pathways when Stage 1 category is selected
  useEffect(() => {
    if (selectedStage1Category) {
      const fetchPathways = async () => {
        try {
          const rows = await callApi<Record<string, unknown>[]>('queryTable', {
            table: 'career_hierarchy_pathways',
            operation: 'select',
            where: { general_category_id: selectedStage1Category.id },
            limit: 500,
          });
          const data = (rows || []).sort((a: any, b: any) => {
            const da = a.display_order || 0;
            const db = b.display_order || 0;
            return da - db;
          });
          const overriddenPathways = data.map(pathway => ({
            ...pathway,
            name: (pathway.name as string) === 'Drones & Pilotless Drones' ? 'Drones & Airtaxi Pathways' : pathway.name
          }));
          setStage2Pathways(overriddenPathways as any);
        } catch (err) {
          console.error('Error fetching pathways:', err);
          setStage2Pathways([]);
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
        try {
          const rows = await callApi<Record<string, unknown>[]>('queryTable', {
            table: 'career_hierarchy_sub_pathways',
            operation: 'select',
            where: { pathway_id: selectedStage2Pathway.id, is_active: true },
            limit: 500,
          });
          const data = (rows || []).sort((a: any, b: any) => {
            const da = a.display_order || 0;
            const db = b.display_order || 0;
            return da - db;
          });
          const overriddenSubPathways = data.map(sp => ({
            ...sp,
            name: sp.name === 'Drone pilot certification and UAV training programs' ? 'Learn More about Drones & Airtaxi Pathways' : sp.name
          }));
          setStage3SubPathways(overriddenSubPathways);
        } catch (err) {
          console.error('Error fetching sub-pathways:', err);
          setStage3SubPathways([]);
        }
      };

      fetchSubPathways();
    } else {
      setStage3SubPathways([]);
    }
  }, [selectedStage2Pathway]);

  // Legacy useEffect for backward compatibility - fetch sub-pathways when a pathway card is selected from main carousel
  useEffect(() => {
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
          aircraftType: 'default',
          interestLevel: 'moderate',
          isRecommended: item.matchPercentage >= 90,
        } as PathwayData))
      );
      
      // Show all cards from the same category as the selected pathway
      
      // Get all cards from the same category
      const categoryCards = discoveryPathwaysData.filter(card => card.category === selectedPathwayCard.category);
      
      
      if (categoryCards.length > 0) {
        const mappedCards = categoryCards.map((card) => ({
          id: card.id,
          name: card.name,
          description: card.description || card.salary,
          image: card.image,
          pathway_id: selectedPathwayCard.id,
        }));
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
      interestLevel: item.postedAt === 'Active' ? 'high_interest' : 'moderate' as const,
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
        return ((b as any).updatedAt || (b as any).createdAt || b.id).localeCompare((a as any).updatedAt || (a as any).createdAt || a.id);
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

  // Engine debug panel — disabled in production
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'development' && e.ctrlKey && e.shiftKey && e.key === 'E') {
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
      setAlignProfileLoading(false);
      return;
    }
    
    const loadAlignProfileData = async () => {
      setAlignProfileLoading(true);
      
      try {
        const { getIdTokenClaims } = useAuth0();
        const claims = await getIdTokenClaims();
        const userId = claims?.sub;
        if (!userId) {
          setAlignProfileLoading(false);
          return;
        }

        // Load pathways (from cache or fetch)
        let pathways: Pathway[] | null = getCachedPathways() as any;
        if (!pathways) {
          const rows = await callApi<Record<string, unknown>[]>('queryTable', {
            table: 'pathways',
            operation: 'select',
            where: { status: 'active' },
            limit: 500,
          });
          if (rows) {
            pathways = rows as any;
            cachePathways(pathways as any);
          }
        }

        if (pathways) {
          pathwayEngine.setPathways(pathways as any);
        }

        // Load user profile
        const profileRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'profiles',
          operation: 'select',
          where: { id: userId },
          limit: 1,
        });
        const profile = profileRows?.[0];

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
            pathwaysLoaded: (pathwayEngine as any).pathways?.length || 0,
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
    <div className={`min-h-screen ${bgGradient} relative`}>
      {/* MeshGradient Background */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          className="w-full h-full"
          colors={["#000000", "#050a14", "#0d1f3c", "#1e3a5f"]}
          speed={0.3}
        />
      </div>

      {/* Global materialization animation styles */}
      <style>{`
        @keyframes materialize {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        .materialize {
          animation: materialize 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }
        .materialize-delay-1 { animation-delay: 0.05s; }
        .materialize-delay-2 { animation-delay: 0.10s; }
        .materialize-delay-3 { animation-delay: 0.15s; }
        .materialize-delay-4 { animation-delay: 0.20s; }
        .materialize-delay-5 { animation-delay: 0.25s; }
        .materialize-delay-6 { animation-delay: 0.30s; }
        .materialize-delay-7 { animation-delay: 0.35s; }
        .materialize-delay-8 { animation-delay: 0.40s; }
        .materialize-delay-9 { animation-delay: 0.45s; }
        .materialize-delay-10 { animation-delay: 0.50s; }

        /* 3D edge-to-edge pathway cards */
        .pathway-card-3d {
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.6);
          border-radius: 1rem;
          overflow: hidden;
        }
        .pathway-card-3d:hover {
          transform: perspective(1000px) rotateY(4deg) rotateX(2deg) scale(1.03) translateY(-8px);
          box-shadow: 0 35px 70px -12px rgba(0, 0, 0, 0.8);
        }
        .pathway-card-3d::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.2) 100%);
          pointer-events: none;
          z-index: 2;
          opacity: 0.6;
          transition: opacity 0.5s ease;
        }
        .pathway-card-3d:hover::before {
          opacity: 0.9;
        }
        @media (prefers-reduced-motion: reduce) {
          .materialize { animation: none; opacity: 1; }
          .pathway-card-3d { transform: none; }
          .pathway-card-3d:hover { transform: none; }
        }
      `}</style>

      {/* Frosted glass blur overlay */}
      <div className="fixed inset-0 z-0 bg-white/5 backdrop-blur-md"></div>

      {/* Top Navigation Bar */}
      {!embedded && (
        <PlatformNavbar
          onNavigate={onNavigate || ((page) => safeRedirect(`/${page}`))}
          currentPage="pathways"
        />
      )}

      {/* Content wrapper with higher z-index to sit above shader */}
      <div className="relative z-10 flex min-h-screen">
        {/* MSFS 2024 Style Sidebar - Pathways Navigation - hidden when embedded */}
        {!embedded && (
          <PathwaysSidebar
            activeSection="pilot-pathways"
            onNavigate={onNavigate || ((page) => safeRedirect(`/${page}`))}
            prScore={78}
            matchPercentage={82}
            topPathway="Commercial Airline"
            topAirline="Qatar Airways"
          />
        )}
        {/* Main content area - responsive margin for sidebar (removed when embedded) */}
        <main className="flex-1 w-full min-h-screen overflow-x-hidden" style={{ marginLeft: embedded ? '0' : '340px' }}>
          {/* Pathway Panels Carousel - Full width edge-to-edge */}
          <div className="py-8">
            <div
              ref={panelCarouselRef}
              className="flex gap-4 overflow-x-auto pb-4 px-6 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
              onMouseEnter={() => setIsPanelHovered(true)}
              onMouseLeave={() => setIsPanelHovered(false)}
            >
              {[
                {
                  img: 'https://i.ytimg.com/vi/hQ3FJIPsT-g/maxresdefault.jpg',
                  icon: null,
                  title: 'Cadet Programme',
                  desc: 'Airline-sponsored zero-to-hero training with guaranteed job placement.',
                  stat: '50+ Airlines',
                },
                {
                  img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
                  icon: <Award className="w-6 h-6" />,
                  title: 'Type Rating',
                  desc: 'Get your A320 or B737 type rating and transition to the flight deck.',
                  stat: 'A320 · B737 · B777',
                },
                {
                  img: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
                  icon: <Users className="w-6 h-6" />,
                  title: 'Low Timer',
                  desc: 'First officer opportunities for pilots building their first 500 hours.',
                  stat: '250+ Openings',
                },
                {
                  img: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80',
                  icon: <GraduationCap className="w-6 h-6" />,
                  title: 'Flight Instructor',
                  desc: 'Teach the next generation while building hours toward your airline goal.',
                  stat: '1,200+ Schools',
                },
                {
                  img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
                  icon: <Compass className="w-6 h-6" />,
                  title: 'Commercial Pilot',
                  desc: 'The full pathway from zero hours to a multi-crew airline career.',
                  stat: 'Global Network',
                },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`flex-shrink-0 w-[560px] h-[300px] rounded-2xl border-2 transition-all duration-500 relative overflow-hidden group materialize ${
                    panelIndex === idx
                      ? 'ring-2 ring-sky-500 border-sky-500/50 shadow-2xl shadow-black/40'
                      : 'border-white/10 hover:border-white/30 hover:shadow-xl shadow-black/20'
                  }`}
                  style={{ animationDelay: `${idx * 120}ms` }}
                  onClick={() => setPanelIndex(idx)}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.98)_45%,rgba(0,0,0,0.75)_60%,rgba(0,0,0,0.3)_75%,transparent_90%)] pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_60%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 text-left transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 transform transition-transform duration-500 group-hover:translate-x-1">
                          {item.icon && (
                            <div className="p-2 rounded-lg bg-sky-500/20 backdrop-blur-md text-sky-300 group-hover:bg-sky-500/30 transition-colors duration-300">
                              {item.icon}
                            </div>
                          )}
                          <span className="text-xs font-semibold uppercase tracking-wider text-sky-300/80">{item.stat}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg transform transition-transform duration-500 group-hover:translate-x-1">{item.title}</h3>
                        <p className="text-sm text-slate-200/90 leading-relaxed max-w-sm drop-shadow-md transform transition-all duration-500 group-hover:translate-x-1 group-hover:text-white">{item.desc}</p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white text-sm font-medium transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/50 group-hover:scale-105 shadow-lg shadow-black/20 group-hover:shadow-xl flex-shrink-0">
                        Discover
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                  {panelIndex === idx && (
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-sky-400 shadow-lg shadow-sky-400/50 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Search and Filter Section */}
            <div className="mb-8">
              <div className="max-w-4xl mx-auto">
                <SearchBar ref={searchInputRef} onSearch={setSearchQuery} isDarkMode={false} />
                {searchQuery.trim().length > 0 && (
                  <div className="mt-3 flex items-center justify-start gap-2 overflow-x-auto px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {[
                      { label: 'Low Timers', filter: 'low-time', key: 'low-timers' },
                      { label: "CFI's", filter: 'cfi', key: 'cfi' },
                      { label: 'Graduates', filter: 'graduate', key: 'graduates' },
                      { label: 'PPL', filter: 'ppl', key: 'ppl' },
                      { label: 'CPL', filter: 'cpl', key: 'cpl' },
                      { label: 'Type Rating', filter: 'type-rating', key: 'type-rating' },
                      { label: 'Cargo', filter: 'cargo', key: 'cargo' },
                      { label: 'Private Sector', filter: 'private', key: 'private-sector' },
                      { label: 'Airline', filter: 'airline', key: 'airline' },
                      { label: 'Military', filter: 'military', key: 'military' },
                    ].map((pill, idx) => (
                      <button
                        key={pill.key}
                        onClick={() => {
                          setSelectedPrimaryPill(pill.key);
                          setActiveSubPills([]);
                          setSearchQuery(pill.filter);
                        }}
                        className="px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-md flex-shrink-0 materialize"
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Hero Section - Pathway Selection */}
            <div className="relative overflow-hidden mb-12 z-10 min-h-[600px]">
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
              
              <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="text-center text-white">
                  <h2 className="text-4xl md:text-5xl font-serif font-normal mb-4">
                    Discover Your Aviation Career Pathway
                  </h2>
                  <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
                    From cadet programs to type ratings, explore comprehensive pathways that connect your skills to airline opportunities worldwide.
                  </p>
                  
                  <div className="max-w-2xl mx-auto text-slate-400 text-sm leading-relaxed">
                    <p className="mb-4">
                      Browse through our comprehensive database of career pathways, including training programs, 
                      type rating courses, and direct entry opportunities. Our pathways are designed to help pilots 
                      understand the requirements and progression routes for leading airlines worldwide.
                    </p>
                    <p>
                      From legacy carriers to regional airlines and emerging carriers, find the pathway that matches 
                      your experience level and career aspirations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pathways Grid - Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Placeholder for pathway cards */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-2">Cadet Programme</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Airline-sponsored training with guaranteed placement</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-2">Type Rating</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">A320, B737, B777 type rating courses</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-2">Low Timer</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">First officer opportunities for building hours</p>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Recognition AI Chat Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-20 right-0"
              >
                <div className="w-[380px] max-h-[500px] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative">
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="p-4">
                    <RecognitionAIChat profile={userProfile} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            onClick={() => setIsChatOpen(!isChatOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/30 flex items-center justify-center text-white border-2 border-white/20"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PathwaysPageModern;
