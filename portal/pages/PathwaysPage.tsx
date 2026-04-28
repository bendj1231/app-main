import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Icons } from '../icons';
import { supabase } from '../lib/supabase-auth';

// ============================================================================
// TYPE DEFINITIONS
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

interface CategorySection {
  id: string;
  title: string;
  description: string;
  pathways: PathwayJob[];
  accentColor: string;
}

interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ReactNode;
  urgent?: boolean;
}

// User profile data interface
interface UserProfileData {
  logged_hours?: number | null;
  program_inputs?: number | null;
  total_hours?: number | null;
  licenses?: string[] | null;
  type_ratings?: string[] | null;
}

// Helper to check if profile is empty
const isProfileEmpty = (profile: UserProfileData | null): boolean => {
  if (!profile) return true;
  const loggedHours = profile.logged_hours ?? profile.total_hours ?? 0;
  const programInputs = profile.program_inputs ?? 0;
  return loggedHours === 0 && programInputs === 0;
};

// ============================================================================
// ROLLING TEXT COMPONENT (Slot-machine style per-character)
// ============================================================================

interface RollingHeaderProps {
  items: { title: string; subtitle: string }[];
  isDarkMode: boolean;
  currentIndex?: number;
}

// VistaJet-style Odometer Character Slot - Each letter rolls independently through a strip
const OdometerSlot: React.FC<{
  targetChar: string;
  isRolling: boolean;
  delay: number;
}> = ({ targetChar, isRolling, delay }) => {
  const displayChar = targetChar === ' ' ? '\u00A0' : targetChar;
  
  return (
    <span className="inline-block overflow-hidden" style={{ 
      width: targetChar === ' ' ? '0.25em' : '1ch', 
      height: '1.2em', 
      verticalAlign: 'bottom',
      perspective: '800px',
    }}>
      <span
        className="block"
        style={{
          height: '2.4em',
          lineHeight: '1.2em',
          transform: isRolling ? 'translateY(-50%)' : 'translateY(0)',
          transition: `transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
        }}
      >
        {/* Previous/placeholder character */}
        <span className="block" style={{ 
          height: '1.2em', 
          lineHeight: '1.2em',
          opacity: isRolling ? 0.3 : 1,
          transition: `opacity 0.3s ease ${delay}s`,
        }}>
          {displayChar}
        </span>
        {/* Target character rolling into view */}
        <span className="block" style={{ 
          height: '1.2em', 
          lineHeight: '1.2em',
          opacity: isRolling ? 1 : 0.3,
          transition: `opacity 0.3s ease ${delay + 0.3}s`,
        }}>
          {displayChar}
        </span>
      </span>
    </span>
  );
};

// VistaJet-style Rolling Word - Each character is an independent odometer slot OR whole word rolls
const RollingWord: React.FC<{
  text: string;
  isRolling: boolean;
  baseDelay?: number;
  wholeWord?: boolean;
}> = ({ text, isRolling, baseDelay = 0, wholeWord = true }) => {
  if (wholeWord) {
    // Whole word rolling - entire phrase rolls as one unit
    return (
      <span className="inline-flex overflow-hidden" style={{ 
        height: '1.2em', 
        lineHeight: '1.2em',
        verticalAlign: 'bottom',
      }}>
        <span
          className="block"
          style={{
            height: '2.4em',
            lineHeight: '1.2em',
            transform: isRolling ? 'translateY(-50%)' : 'translateY(0)',
            transition: `transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${baseDelay}s`,
          }}
        >
          {/* Previous/placeholder text */}
          <span className="block" style={{ 
            height: '1.2em', 
            lineHeight: '1.2em',
            opacity: isRolling ? 0.3 : 1,
            transition: `opacity 0.3s ease ${baseDelay}s`,
          }}>
            {text}
          </span>
          {/* Target text rolling into view */}
          <span className="block" style={{ 
            height: '1.2em', 
            lineHeight: '1.2em',
            opacity: isRolling ? 1 : 0.3,
            transition: `opacity 0.3s ease ${baseDelay + 0.3}s`,
          }}>
            {text}
          </span>
        </span>
      </span>
    );
  }
  
  // Character-by-character rolling (original)
  const chars = text.split('');
  
  return (
    <span className="inline-flex">
      {chars.map((char, index) => (
        <OdometerSlot
          key={index}
          targetChar={char}
          isRolling={isRolling}
          delay={baseDelay + (index * 0.08)} // 80ms stagger for pronounced wave
        />
      ))}
    </span>
  );
};

// VistaJet-style rolling header with true odometer animation
const RollingHeader: React.FC<RollingHeaderProps> = ({ items, isDarkMode, currentIndex: externalIndex }) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  
  // Use external index if provided, otherwise use internal
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  const displayTitle = items[currentIndex]?.title || '';
  
  const duration = 3000; // 3 seconds per word
  
  // Only auto-rotate if no external index is provided
  useEffect(() => {
    if (externalIndex !== undefined || items.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsRolling(true);
      
      // Start rolling after a brief pause
      setTimeout(() => {
        const nextIndex = (internalIndex + 1) % items.length;
        setInternalIndex(nextIndex);
        
        // Stop rolling after animation completes
        setTimeout(() => {
          setIsRolling(false);
        }, 600);
      }, 200);
      
    }, duration);
    
    return () => clearInterval(interval);
  }, [items, internalIndex, externalIndex]);

  // Trigger rolling animation when external index changes
  useEffect(() => {
    if (externalIndex !== undefined && items.length > 1) {
      setIsRolling(true);
      setTimeout(() => {
        setIsRolling(false);
      }, 600);
    }
  }, [externalIndex, items.length]);

  return (
    <div className="text-center">
      {/* Static prefix line - VistaJet style */}
      <div style={{
        fontFamily: 'Georgia, serif',
        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        lineHeight: 1.3,
        color: isDarkMode ? '#f8fafc' : '#0f172a',
      }}>
        Your pathway.
      </div>
      
      {/* Rolling words - Simple. Efficient. Reliable. style */}
      <div 
        className="overflow-hidden inline-block mt-1"
        style={{
          height: '1.5em',
          lineHeight: '1.5em',
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: isDarkMode ? '#cda052' : '#b8860b',
        }}
      >
        <RollingWord 
          text={displayTitle}
          isRolling={isRolling}
          baseDelay={0}
        />
      </div>
    </div>
  );
};

// ============================================================================
// MOCK DATA
// ============================================================================

const LIVE_JOBS: PathwayJob[] = [
  {
    id: 'live-1',
    title: 'First Officer A320',
    company: 'Emirates',
    matchPercentage: 94,
    location: 'Dubai, UAE',
    type: 'Major Airline',
    salary: '$8,500/mo + housing',
    requirements: ['2500 hrs TT', 'A320 Type Rating', 'ICAO Level 5'],
    tags: ['Hot', 'Visa Sponsored'],
    postedAt: 'Just now',
    isLive: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
  },
  {
    id: 'live-2',
    title: 'CRJ First Officer',
    company: 'SkyWest Airlines',
    matchPercentage: 91,
    location: 'Salt Lake City, UT',
    type: 'Regional',
    salary: '$65,000 - $95,000',
    requirements: ['250 hrs TT', 'ME Rating', 'ATP-CTP'],
    tags: ['Matches Profile', 'Fast Track'],
    postedAt: '2 min ago',
    isLive: true,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
  },
  {
    id: 'live-3',
    title: 'eVTOL Test Pilot',
    company: 'Joby Aviation',
    matchPercentage: 88,
    location: 'Marina, CA',
    type: 'eVTOL / Air Taxi',
    salary: '$95,000 + equity',
    requirements: ['1000 hrs TT', 'Heli Exp Preferred'],
    tags: ['Emerging', 'Stock Options'],
    postedAt: '5 min ago',
    isLive: true,
    isHot: true,
    image: 'https://images.unsplash.com/photo-1483304528321-0674f0040030?w=800&q=80'
  },
  {
    id: 'live-4',
    title: 'Global 7500 Captain',
    company: 'VistaJet',
    matchPercentage: 85,
    location: 'Multiple Bases',
    type: 'Private Aviation',
    salary: '$180,000 + bonus',
    requirements: ['3500 hrs TT', 'Global Exp', 'VIP Service'],
    tags: ['Premium', 'Worldwide'],
    postedAt: '12 min ago',
    isLive: true,
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
  }
];

// Category-specific Live Matches data
const CATEGORY_LIVE_JOBS: Record<string, PathwayJob[]> = {
  commercial: [],
  private: [
    {
      id: 'live-priv-1',
      title: 'A320 Type Rating + First Officer',
      company: 'Fly Dubai',
      matchPercentage: 94,
      location: 'Dubai, UAE',
      type: 'Type Rating Program',
      salary: '$85,000/year after completion',
      requirements: ['CPL + ME/IR', '1,500 hrs', 'Medical Class 1'],
      tags: ['A320 TR Included', 'Immediate Start', 'UAE Base'],
      postedAt: 'Just now',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
    },
    {
      id: 'live-priv-2',
      title: 'B737 Type Rating Program',
      company: 'European Aviation School',
      matchPercentage: 91,
      location: 'Barcelona, Spain',
      type: 'Type Rating',
      salary: '€18,000 program cost',
      requirements: ['CPL + IR', 'Medical Class 1', 'English ICAO 5'],
      tags: ['Boeing Approved', 'Simulator Access', 'Job Placement'],
      postedAt: '3 min ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
    },
    {
      id: 'live-priv-3',
      title: 'B777 Type Rating + Line Training',
      company: 'Middle East Aviation Academy',
      matchPercentage: 88,
      location: 'Doha, Qatar',
      type: 'Widebody Type Rating',
      salary: '$45,000 + accommodation',
      requirements: ['3,000+ hrs TT', 'ATP License', 'Heavy Jet Exp'],
      tags: ['Widebody Command', 'Direct Hire Path', 'Luxury Airline'],
      postedAt: '8 min ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
    },
    {
      id: 'live-priv-4',
      title: 'ATR 72-600 Type Rating',
      company: 'Airline Pilot Training Center',
      matchPercentage: 85,
      location: 'Toulouse, France',
      type: 'Regional Type Rating',
      salary: '€12,000 training cost',
      requirements: ['CPL', '500+ hrs', 'Multi-Engine IR'],
      tags: ['Regional Gateway', 'Airline Partnership', 'Fast Track'],
      postedAt: '15 min ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80'
    }
  ],
  cargo: [
    {
      id: 'live-cargo-1',
      title: 'B777F Captain',
      company: 'FedEx Express',
      matchPercentage: 94,
      location: 'Memphis, TN',
      type: 'Heavy Cargo',
      salary: '$295,000/year',
      requirements: ['4000 hrs', 'B777 Type', 'Heavy Jet'],
      tags: ['Fortune 500', 'Great Benefits'],
      postedAt: 'Just now',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
    },
    {
      id: 'live-cargo-2',
      title: 'B747-8F Captain',
      company: 'Atlas Air',
      matchPercentage: 91,
      location: 'Purchase, NY',
      type: 'Heavy Cargo',
      salary: '$280,000/year',
      requirements: ['4000 hrs', 'B747 Type'],
      tags: ['ACMI Leader', 'Union'],
      postedAt: '4 min ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
    },
    {
      id: 'live-cargo-3',
      title: 'MD-11F First Officer',
      company: 'UPS Airlines',
      matchPercentage: 88,
      location: 'Louisville, KY',
      type: 'Heavy Cargo',
      salary: '$165,000/year',
      requirements: ['1500 hrs', 'Heavy Jet'],
      tags: ['Teamsters', 'Pension'],
      postedAt: '10 min ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
    },
    {
      id: 'live-cargo-4',
      title: 'B767F Captain',
      company: 'Amazon Air',
      matchPercentage: 85,
      location: 'CVG Airport, KY',
      type: 'Express Cargo',
      salary: '$250,000/year',
      requirements: ['3500 hrs', 'B767 Type'],
      tags: ['Tech Giant', 'Growing Fleet'],
      postedAt: '18 min ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
    }
  ]
};

// Category-specific job listings for the job board
const CATEGORY_JOBS: Record<string, PathwayJob[]> = {
  commercial: [
    {
      id: 'cat-comm-1',
      title: 'A320 Captain',
      company: 'Delta Air Lines',
      matchPercentage: 87,
      location: 'Atlanta, GA',
      type: 'Major Airline',
      salary: '$285,000/year',
      requirements: ['3000 hrs TT', 'A320 Type', 'ATP'],
      tags: ['Captain', 'Major Carrier'],
      postedAt: '1 hour ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
    },
    {
      id: 'cat-comm-2',
      title: 'B737 First Officer',
      company: 'Southwest Airlines',
      matchPercentage: 89,
      location: 'Dallas, TX',
      type: 'Major Airline',
      salary: '$95,000/year',
      requirements: ['1500 hrs', 'B737 TR', 'ATP'],
      tags: ['LUV Culture', 'Great Benefits'],
      postedAt: '3 hours ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
    },
    {
      id: 'cat-comm-3',
      title: 'A350 Second Officer',
      company: 'Cathay Pacific',
      matchPercentage: 82,
      location: 'Hong Kong',
      type: 'Major Airline',
      salary: '$120,000 + housing',
      requirements: ['750 hrs', 'Widebody Exp'],
      tags: ['Asia Hub', 'Expat Package'],
      postedAt: '5 hours ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
    },
    {
      id: 'cat-comm-4',
      title: 'E175 Captain',
      company: 'Envoy Air',
      matchPercentage: 91,
      location: 'DFW Airport, TX',
      type: 'Regional',
      salary: '$110,000/year',
      requirements: ['2000 hrs', 'Part 121'],
      tags: ['AA Flow', 'Fast Captain'],
      postedAt: '1 day ago',
      image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80'
    },
    {
      id: 'cat-comm-5',
      title: 'A220 First Officer',
      company: 'AirBaltic',
      matchPercentage: 78,
      location: 'Riga, Latvia',
      type: 'Regional',
      salary: '€55,000/year',
      requirements: ['250 hrs', 'EASA CPL'],
      tags: ['EU Base', 'New Aircraft'],
      postedAt: '2 days ago',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
    },
    {
      id: 'cat-comm-6',
      title: 'B777 Captain',
      company: 'KLM Royal Dutch',
      matchPercentage: 85,
      location: 'Amsterdam, NL',
      type: 'Major Airline',
      salary: '€200,000/year',
      requirements: ['4000 hrs', 'B777 Type', 'EU Passport'],
      tags: ['Legacy Carrier', 'Europe'],
      postedAt: '4 days ago',
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
    }
  ],
  private: [
    {
      id: 'cat-priv-1',
      title: 'Gulfstream G650 Captain',
      company: 'Flexjet',
      matchPercentage: 88,
      location: 'Columbus, OH',
      type: 'Fractional',
      salary: '$220,000/year',
      requirements: ['3500 hrs', 'G650 Type', 'Part 135'],
      tags: ['Premium Fleet', 'Home Basing'],
      postedAt: '6 hours ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
    },
    {
      id: 'cat-priv-2',
      title: 'Citation CJ4 Captain',
      company: 'NetJets',
      matchPercentage: 86,
      location: 'Columbus, OH',
      type: 'Fractional',
      salary: '$175,000/year',
      requirements: ['2500 hrs', 'CJ4 Type'],
      tags: ['Largest Fleet', 'Benefits'],
      postedAt: '12 hours ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
    },
    {
      id: 'cat-priv-3',
      title: 'Global 6000 Captain',
      company: 'VistaJet',
      matchPercentage: 92,
      location: 'Malta / Global',
      type: 'Private Charter',
      salary: '$195,000 + bonus',
      requirements: ['4000 hrs', 'Global Type', 'VIP Exp'],
      tags: ['Silver Service', 'Worldwide'],
      postedAt: '1 day ago',
      isLive: true,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
    },
    {
      id: 'cat-priv-4',
      title: 'Phenom 300 Captain',
      company: 'PlaneSense',
      matchPercentage: 79,
      location: 'Portsmouth, NH',
      type: 'Fractional',
      salary: '$125,000/year',
      requirements: ['2000 hrs', 'Phenom Type'],
      tags: ['Turboprop Focus', 'Growth'],
      postedAt: '2 days ago',
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
    },
    {
      id: 'cat-priv-5',
      title: 'Challenger 650 Captain',
      company: 'Bombardier',
      matchPercentage: 84,
      location: 'Montreal, QC',
      type: 'Demo Pilot',
      salary: '$180,000/year',
      requirements: ['3000 hrs', 'CL60 Type'],
      tags: ['Demo Flying', 'Factory'],
      postedAt: '3 days ago',
      image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80'
    },
    {
      id: 'cat-priv-6',
      title: 'Legacy 500 Captain',
      company: 'Embraer Executive',
      matchPercentage: 81,
      location: 'São Paulo, BR',
      type: 'Demo Pilot',
      salary: '$165,000/year',
      requirements: ['2500 hrs', 'E550 Type'],
      tags: ['Demo Team', 'Brazil'],
      postedAt: '4 days ago',
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
    }
  ],
  cargo: [
    {
      id: 'cat-cargo-4',
      title: 'A330F Captain',
      company: 'Turkish Cargo',
      matchPercentage: 83,
      location: 'Istanbul, Turkey',
      type: 'Long-Haul Cargo',
      salary: '$180,000/year',
      requirements: ['3500 hrs', 'A330 Type'],
      tags: ['Global Hub', 'Asia-Europe'],
      postedAt: '2 days ago',
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
    },
    {
      id: 'cat-cargo-5',
      title: 'B747-8F First Officer',
      company: 'Atlas Air',
      matchPercentage: 88,
      location: 'Purchase, NY',
      type: 'Heavy Cargo',
      salary: '$155,000/year',
      requirements: ['1000 hrs', 'Heavy Jet'],
      tags: ['ACMI Leader', 'Union'],
      postedAt: '3 days ago',
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
    },
    {
      id: 'cat-cargo-6',
      title: 'A350F Captain',
      company: 'Singapore Airlines Cargo',
      matchPercentage: 86,
      location: 'Singapore',
      type: 'Next-Gen Cargo',
      salary: '$220,000/year',
      requirements: ['3500 hrs', 'A350 Type'],
      tags: ['New Freighter', 'Asia Hub'],
      postedAt: '5 days ago',
      image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80'
    }
  ]
};

// Airline Expectations - Airlines and their requirements/expectations for pilots
const AIRLINE_EXPECTATIONS: PathwayJob[] = [
  {
    id: 'airline-emirates',
    title: 'Emirates',
    company: 'Emirates Airlines',
    matchPercentage: 88,
    location: 'Dubai, UAE',
    type: 'Major Airline',
    salary: 'AED 650,000 - 800,000/year',
    requirements: ['3,000+ hrs TT', 'A380/A350 Type Rating', 'ICAO Level 5+', 'Class 1 Medical'],
    tags: ['Tax-Free Salary', 'Housing Provided', 'Global Network'],
    postedAt: 'Accepting Applications',
    image: 'https://dubai-immo.com/wp-content/uploads/2024/10/emirates-histoire-compagnie-aerienne-dubai.png'
  },
  {
    id: 'airline-etihad',
    title: 'Etihad Airways',
    company: 'Etihad Airways',
    matchPercentage: 86,
    location: 'Abu Dhabi, UAE',
    type: 'Major Airline',
    salary: 'AED 550,000 - 700,000/year',
    requirements: ['2,500+ hrs TT', 'A320/B787 Type Rating', 'ICAO Level 5', 'ATP License'],
    tags: ['Tax-Free Income', 'Global Destinations', 'Career Growth'],
    postedAt: 'Hiring Now',
    image: 'https://aviationtoday.in/wp-content/uploads/2025/09/AVIATION-TODAY-ETIHAD-AIRWAYS.jpg'
  },
  {
    id: 'airline-qatar',
    title: 'Qatar Airways',
    company: 'Qatar Airways',
    matchPercentage: 90,
    location: 'Doha, Qatar',
    type: 'Major Airline',
    salary: '$180,000 - $250,000/year',
    requirements: ['2,500+ hrs TT', 'A350/B777 Type Rating', 'ICAO Level 5+', 'Degree Preferred'],
    tags: ['5-Star Airline', 'Tax-Free', 'Worldwide Routes'],
    postedAt: 'Active Recruitment',
    image: 'https://d21buns5ku92am.cloudfront.net/69647/images/629178-Latest%20QR%20Winter%20Frequencies%202025-cb3816-large-1763885990.jpg'
  },
  {
    id: 'airline-singapore',
    title: 'Singapore Airlines',
    company: 'Singapore Airlines',
    matchPercentage: 85,
    location: 'Singapore',
    type: 'Major Airline',
    salary: '$120,000 - $180,000/year',
    requirements: ['3,000+ hrs TT', 'A350/B787 Type Rating', 'ICAO Level 6', 'Excellent Vision'],
    tags: ['Premium Carrier', 'Asian Hub', 'Great Benefits'],
    postedAt: 'Applications Open',
    image: 'https://www.aerotime.aero/images/Singapore-Airlines-Airbus-A350-at-Tokyo-Haneda-International-Airport-HND.jpg'
  },
  {
    id: 'airline-cathay',
    title: 'Cathay Pacific',
    company: 'Cathay Pacific Airways',
    matchPercentage: 82,
    location: 'Hong Kong',
    type: 'Major Airline',
    salary: '$110,000 - $160,000/year',
    requirements: ['2,500+ hrs TT', 'A350/B777 Type Rating', 'ICAO Level 5', 'HK Resident/Permit'],
    tags: ['Asian Network', 'Housing Allowance', 'Definite Return'],
    postedAt: 'Limited Slots',
    image: 'https://www.aljazeera.com/wp-content/uploads/2024/06/AFP__20240207__34HX2FX__v2__HighRes__UsTransportAviationAirbus-1718776971.jpg?resize=1920%2C1080'
  },
  {
    id: 'airline-delta',
    title: 'Delta Air Lines',
    company: 'Delta Air Lines',
    matchPercentage: 87,
    location: 'Atlanta, GA / Multiple Bases',
    type: 'Major Airline',
    salary: '$280,000 - $350,000/year',
    requirements: ['1,500+ hrs TT', 'FAA ATP', 'Part 121 Experience', 'US Citizen/Perm Resident'],
    tags: ['Fortune 500', 'Profit Sharing', 'Strong Union'],
    postedAt: 'Continuous Hiring',
    image: 'https://qz.com/cdn-cgi/image/width=1920,quality=85,format=auto/https://assets.qz.com/media/d7df58ebbb44fc98b9cca6ba22db0eb8.jpg'
  },
  {
    id: 'airline-british',
    title: 'British Airways',
    company: 'British Airways',
    matchPercentage: 88,
    location: 'London, UK',
    type: 'Legacy Carrier',
    salary: '£80,000 - £120,000/year',
    requirements: ['1,500+ hrs TT', 'A320/B777 Type Rating', 'EASA ATP', 'UK/EU Passport'],
    tags: ['Legacy Carrier', 'Global Routes', 'Premium Benefits'],
    postedAt: 'Hiring Now',
    image: 'https://ik.imgkit.net/3vlqs5axxjf/BTNE/uploadedImages/1_News/Air_Travel/British%20Airways.jpeg'
  },
  {
    id: 'airline-atlas',
    title: 'Atlas Air',
    company: 'Atlas Air Worldwide',
    matchPercentage: 84,
    location: 'Purchase, NY / Miami, FL',
    type: 'Cargo Airline',
    salary: '$180,000 - $280,000/year',
    requirements: ['2,000+ hrs TT', 'B747 Type Rating', 'Heavy Jet Experience'],
    tags: ['Global Operations', 'Amazon/Atlas', 'Travel Benefits'],
    postedAt: 'Direct Entry Available',
    image: 'https://live-cms.acronaviation.com/media/sgbhxpsv/acron-academy-airline-relationships-usa-atlas-air.jpg?width=1200&height=630&quality=80'
  },
  {
    id: 'airline-westair',
    title: 'Westair Aviation',
    company: 'Westair Aviation',
    matchPercentage: 79,
    location: 'Windhoek, Namibia',
    type: 'Regional Airline',
    salary: '$45,000 - $75,000/year',
    requirements: ['1,000+ hrs TT', 'C208/ERJ Experience', 'ICAO Level 4', 'Multi-Engine IR'],
    tags: ['African Operations', 'Growth Opportunity', 'Diverse Fleet'],
    postedAt: 'Accepting Applications',
    image: 'https://d4f7y6nbupj5z.cloudfront.net/wp-content/uploads/2022/09/Westair.jpg'
  },
  {
    id: 'airline-riyadh',
    title: 'Riyadh Air',
    company: 'Riyadh Air',
    matchPercentage: 86,
    location: 'Riyadh, Saudi Arabia',
    type: 'Startup Airline',
    salary: '$150,000 - $220,000/year',
    requirements: ['2,000+ hrs TT', 'A320/A321 Type Rating', 'ICAO Level 5', 'GACA License'],
    tags: ['New National Carrier', 'Saudi Vision 2030', 'Modern Fleet'],
    postedAt: 'Active Recruitment',
    image: 'https://cdn.radarbox.com/blog/Caio/ceo%20in%20front%20of%20plane.jpg'
  },
  {
    id: 'airline-starlux',
    title: 'Starlux Airlines',
    company: 'Starlux Airlines',
    matchPercentage: 83,
    location: 'Taipei, Taiwan',
    type: 'Full Service Carrier',
    salary: '$90,000 - $140,000/year',
    requirements: ['1,500+ hrs TT', 'A321/A330 Type Rating', 'ICAO Level 5', 'Chinese Skills'],
    tags: ['Premium Service', 'Asian Routes', 'Growing Fleet'],
    postedAt: 'Applications Open',
    image: 'https://media.cnn.com/api/v1/images/stellar/prod/191112145316-20191026-p3849-deliveryflight-starlux-hr-027.jpg?q=w_1600,h_900,x_0,y_0,c_fill'
  },
  {
    id: 'airline-airastana',
    title: 'Air Astana',
    company: 'Air Astana',
    matchPercentage: 80,
    location: 'Almaty, Kazakhstan',
    type: 'Flag Carrier',
    salary: '$70,000 - $110,000/year',
    requirements: ['1,500+ hrs TT', 'A320/B767 Type Rating', 'ICAO Level 4', 'Housing Provided'],
    tags: ['Central Asia Hub', 'Growing Network', 'Expat Friendly'],
    postedAt: 'Hiring Now',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Frankfurt_Airport_Air_Astana_Airbus_A321-271NX_EI-KGH_%28DSC04615%29.jpg/1280px-Frankfurt_Airport_Air_Astana_Airbus_A321-271NX_EI-KGH_%28DSC04615%29.jpg'
  },
  {
    id: 'airline-transavia',
    title: 'Transavia',
    company: 'Transavia Airlines',
    matchPercentage: 78,
    location: 'Amsterdam, Netherlands',
    type: 'Low-Cost Carrier',
    salary: '€65,000 - €95,000/year',
    requirements: ['500+ hrs TT', 'B737 Type Rating', 'EASA ATP', 'Dutch/French Preferred'],
    tags: ['Air France-KLM Group', 'European Leisure', 'Holiday Routes'],
    postedAt: 'Rolling Intake',
    image: 'https://content.presspage.com/uploads/3011/eebd5444-6f02-4502-8272-14496df6d779/1920_ai-pho-0224-msn12876-tra-f1-lr-1109.jpg?10000'
  },
  {
    id: 'airline-scoot',
    title: 'Scoot',
    company: 'Scoot',
    matchPercentage: 76,
    location: 'Singapore',
    type: 'Low-Cost Carrier',
    salary: '$60,000 - $95,000/year',
    requirements: ['500+ hrs TT', 'A320/A787 Type Rating', 'ICAO Level 4'],
    tags: ['Singapore Airlines Group', 'Budget Travel', 'Asia-Pacific'],
    postedAt: 'Check Website',
    image: 'https://taraohreilly.com/wp-content/uploads/2024/12/pexels-saturnus99-19766193-1-edited.webp'
  },
  {
    id: 'airline-ethiopian',
    title: 'Ethiopian Airlines',
    company: 'Ethiopian Airlines',
    matchPercentage: 82,
    location: 'Addis Ababa, Ethiopia',
    type: 'Flag Carrier',
    salary: '$80,000 - $130,000/year',
    requirements: ['2,000+ hrs TT', 'B787/A350 Type Rating', 'ICAO Level 4', 'African Experience'],
    tags: ['Africa Largest Carrier', 'Pan-African Network', 'Star Alliance'],
    postedAt: 'Active Recruitment',
    image: 'https://aviationweek.com/sites/default/files/styles/crop_freeform/public/2026-02/ethiopian_boeing_max_8_inflight_source_rob_finlayson.png?itok=Il52GRT1'
  },
  {
    id: 'airline-copa',
    title: 'Copa Airlines',
    company: 'Copa Airlines',
    matchPercentage: 79,
    location: 'Panama City, Panama',
    type: 'Major Airline',
    salary: '$75,000 - $120,000/year',
    requirements: ['1,500+ hrs TT', 'B737 Type Rating', 'FAA ATP', 'Spanish/English'],
    tags: ['Hub of the Americas', 'Star Alliance', 'Latin Network'],
    postedAt: 'Hiring Now',
    image: 'https://aviationweek.com/sites/default/files/styles/crop_freeform/public/2024-02/2jb1e2f-2.jpg?itok=3EUv1gXZ'
  },
  {
    id: 'airline-korean',
    title: 'Korean Air',
    company: 'Korean Air',
    matchPercentage: 85,
    location: 'Seoul, South Korea',
    type: 'Major Airline',
    salary: '$100,000 - $160,000/year',
    requirements: ['2,000+ hrs TT', 'B777/A380 Type Rating', 'ICAO Level 5', 'Korean Language'],
    tags: ['SkyTeam Alliance', 'Asian Network', 'Premium Service'],
    postedAt: 'Limited Slots',
    image: 'https://cdn.mos.cms.futurecdn.net/A87WFsErsqqkj3ZHiHpiqV.jpg'
  },
  {
    id: 'airline-jet2',
    title: 'Jet2.com',
    company: 'Jet2.com',
    matchPercentage: 75,
    location: 'Leeds, UK / Multiple Bases',
    type: 'Low-Cost Carrier',
    salary: '£55,000 - £85,000/year',
    requirements: ['500+ hrs TT', 'B737 Type Rating', 'EASA ATP', 'UK Base'],
    tags: ['UK Leisure Travel', 'Package Holidays', 'Growing Fleet'],
    postedAt: 'Continuous Hiring',
    image: 'https://c.files.bbci.co.uk/11207/production/_125815107_mediaitem125815103.jpg'
  },
];

// Discovery Pathways - Career pathways and programs for all pilot types
const DISCOVERY_PATHWAYS: Record<string, PathwayJob[]> = {
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
      postedAt: 'Accepting Applications',
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
      postedAt: 'Applications Open',
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
      image: 'https://i0.wp.com/aerocadet.com/blog/wp-content/uploads/2024/05/Screenshot-2024-05-10-at-1.56.37%E2%80%AFPM.png?fit=2392%2C1338&ssl=1'
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
      postedAt: 'Applications Open',
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
      postedAt: 'Applications Open',
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
      postedAt: 'Accepting Applications',
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
      postedAt: 'Applications Open',
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
      image: 'https://www.100knots.com/airlines_dashboard/uploads/blog/1700201710.webp'
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
      postedAt: 'Applications Open',
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
      postedAt: 'Applications Open',
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
      postedAt: 'Applications Open',
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
      postedAt: 'Applications Open',
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
      image: 'https://www.etihad.com/content/dam/eag/etihadairways/etihadcom/Global/news/etihad-airways-launches-international-roadshow-in-major-pilot-recruitment-drive.jpg'
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
      image: 'https://media.licdn.com/dms/image/v2/D5622AQEorE3S-pb_-g/feedshare-shrink_800/B56ZuH5BCLJYAg-/0/1767511431493?e=2147483647&v=beta&t=_MvjJVpFPaJi_89kySmuFOAKiSMLZnt_RowacQjwB1I'
    },
    {
      id: 'disc-priv-uprt',
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
    },
    {
      id: 'disc-priv-airbus-ebt',
      title: 'AIRBUS EBT CBTA Familiarization Pathway',
      company: 'Airbus Training Centers',
      matchPercentage: 92,
      location: 'Toulouse, France / Miami, FL',
      type: 'Competency-Based Training',
      salary: 'Contact for pricing',
      requirements: ['A320 Family Type Rating', 'Airline Experience', 'CBTA Compliant'],
      tags: ['Evidence-Based Training', 'Airbus Standard', 'Recurrent Training'],
      postedAt: 'Scheduled Batches',
      image: 'https://i0.wp.com/pilotswhoaskwhy.com/wp-content/uploads/2023/06/img_9643.png?resize=750%2C464&ssl=1'
    },
    {
      id: 'disc-priv-multi',
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
      id: 'disc-priv-instrument',
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
      id: 'disc-priv-instructor',
      title: 'Flight/Ground Instructor Pathway',
      company: 'Aviation Academies',
      matchPercentage: 89,
      location: 'Global',
      type: 'Instructor Pathway',
      salary: 'Hourly/Contract Rates',
      requirements: ['CPL or ATPL', 'Instructional Techniques', 'Class 1 Medical'],
      tags: ['CFI/CFII', 'Teaching Career', 'Build Hours'],
      postedAt: 'Always Hiring',
      image: 'https://leopardaviation.com/wp-content/uploads/2025/10/How-Long-Does-It-Take-to-Become-a-Certified-Flight-Instructor.jpg'
    },
    {
      id: 'disc-priv-cat',
      title: 'CAT I | CAT II | CAT III Rating Pathways',
      company: 'Airline Training Departments & SIM Centers',
      matchPercentage: 87,
      location: 'Major Aviation Hubs (CAE, FlightSafety)',
      type: 'Instrument Rating Enhancement',
      salary: 'Part of Type Rating/Recurrent - No Extra Cost',
      requirements: ['Instrument Rating', 'Multi-Engine Experience', 'Type-Specific Ground School'],
      tags: ['Low Visibility Ops', 'Auto-Land Management', 'Advanced IFR'],
      postedAt: 'Type Rating Dependent',
      image: 'https://profipilot.training/project/files/pages/196/instrument-rating-(1).jpg'
    }
  ],
  cargo: [
    {
      id: 'wingmentor-intro-cargo',
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
      id: 'disc-cargo-3',
      title: 'Atlas Air International Pathway',
      company: 'Atlas Air',
      matchPercentage: 86,
      location: 'Purchase, NY / Miami, FL',
      type: 'ACMI Career Track',
      salary: '$180,000 - $280,000',
      requirements: ['2,000 hrs', 'B747 Type Rating', 'Heavy Jet Experience'],
      tags: ['Global Operations', 'Amazon/Atlas', 'Travel Benefits'],
      postedAt: 'Direct Entry Available',
      image: 'https://live-cms.acronaviation.com/media/sgbhxpsv/acron-academy-airline-relationships-usa-atlas-air.jpg?width=1200&height=630&quality=80'
    },
  ],
  cargoPathways: [
    {
      id: 'wingmentor-intro-cargopath',
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
      id: 'disc-cargo-1',
      title: 'FedEx Purple Runway Program',
      company: 'FedEx Express',
      matchPercentage: 91,
      location: 'Memphis, TN / Indianapolis, IN',
      type: 'Cadet to Captain',
      salary: '$60,000 during training',
      requirements: ['750 hrs', 'ATP Written', 'US Citizen/Permanent Resident'],
      tags: ['Fortune 500', 'MD-11 to B777', 'Retirement Benefits'],
      postedAt: 'Pipeline Program',
      image: 'https://d386an9otcxw2c.cloudfront.net/oms/2634/image/2025/8/3QC0D_purple-runway-pathway/purple-runway-pathway.jpg'
    },
    {
      id: 'disc-cargo-2',
      title: 'UPS FlightPath Program',
      company: 'UPS Airlines',
      matchPercentage: 88,
      location: 'Louisville, KY',
      type: 'Career Development',
      salary: '$55,000 starting pay',
      requirements: ['1,000 hrs', 'Part 121 Experience', 'ATP'],
      tags: ['Teamsters Union', 'Pension', 'Global Routes'],
      postedAt: 'Hiring Window Open',
      image: 'https://cdn.phenompeople.com/CareerConnectResources/UPBUPSGLOBAL/images/img-flightpath-fastfacts-1736537912855.jpg'
    },
    {
      id: 'disc-cargo-4',
      title: 'DHL Aviation First Officer Program',
      company: 'DHL Aviation (EAT Leipzig)',
      matchPercentage: 83,
      location: 'Leipzig, Germany',
      type: 'Entry Level Cargo',
      salary: '€65,000 - €85,000',
      requirements: ['250 hrs', 'EASA CPL', 'A330 Type Rating Program'],
      tags: ['European Hub', 'A330F', 'Night Operations'],
      postedAt: 'EU Nationals Only',
      image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=800&auto=format&fit=crop'
    }
  ],
  privateSector: [
    {
      id: 'wingmentor-intro-privatesector',
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
      id: 'disc-priv-empire',
      title: 'Empire Aviation - Business Aviation Pathway',
      company: 'Empire Aviation Group',
      matchPercentage: 81,
      location: 'Dubai, UAE',
      type: 'Business Aviation',
      salary: '$120,000 - $180,000/year',
      requirements: ['2,500+ hrs TT', 'Gulfstream/Bombardier Type', 'VIP Experience'],
      tags: ['Private Charter', 'Luxury Fleet', 'Dubai Based'],
      postedAt: 'Hiring Now',
      image: 'https://empireaviation.com/wp-content/uploads/2021/02/march072017.jpg'
    },
    {
      id: 'disc-priv-execujet',
      title: 'ExecuJet - Executive Charter',
      company: 'ExecuJet Aviation Group',
      matchPercentage: 80,
      location: 'Dubai, UAE / Global',
      type: 'Business Aviation',
      salary: '$140,000 - $200,000/year',
      requirements: ['2,500+ hrs TT', 'Bombardier/Gulfstream Type', 'VIP Client Experience'],
      tags: ['Luxury Charter', 'Global Operations', 'Premium Service'],
      postedAt: 'Hiring Now',
      image: 'https://www.stanstednews.com/gallery_2022/31431.jpg'
    },
    {
      id: 'disc-priv-1',
      title: 'NetJets Pilot Development Program',
      company: 'NetJets',
      matchPercentage: 87,
      location: 'Columbus, OH / Various Bases',
      type: 'Career Pathway',
      salary: '$85,000 starting + sign-on bonus',
      requirements: ['1,500 hrs', 'Multi-Engine ATP', 'Customer Service Skills'],
      tags: ['Fractional Leader', 'Cessna to Gulfstream', 'Home Basing'],
      postedAt: 'Continuous Hiring',
      image: 'https://marvel-b1-cdn.bc0a.com/f00000000249826/nbaa.org/wp-content/uploads/2020/07/netjets-fleet-ramp.jpg'
    },
    {
      id: 'disc-priv-2',
      title: 'Flexjet Direct Entry Program',
      company: 'Flexjet',
      matchPercentage: 84,
      location: '115+ Home Domiciles Across US & Europe',
      type: 'Direct Entry',
      salary: 'Up to $175,000 first year + $5,000 productivity bonus',
      requirements: ['2,500 hrs TT', 'Citation Experience Preferred', 'Type Rating Available', 'ATP'],
      tags: ['Home-Based', '401(k) 6% Match', '$42/day Per Diem', 'Red Label Premium'],
      postedAt: 'Now Hiring - Multiple Fleet Types',
      image: 'https://cdn.phenompeople.com/CareerConnectResources/OJAOJCUS/images/5I2A9553-1751401469126.jpg'
    },
    {
      id: 'disc-priv-4',
      title: 'VistaJet Silver Service Training',
      company: 'VistaJet',
      matchPercentage: 90,
      location: 'Malta / Dubai',
      type: 'Service Excellence Program',
      salary: '$180,000 + bonuses',
      requirements: ['3,500 hrs', 'Global Experience', 'Cabin Service Training'],
      tags: ['Worldwide Operations', 'Global 7500', 'Luxury Service'],
      postedAt: 'Elite Positions',
      image: 'https://www.voyages-d-affaires.com/wp-content/uploads/2018/10/vistajet.jpg'
    },
    {
      id: 'disc-priv-7',
      title: 'Executive Jet Management - Challenger Captain',
      company: 'EJM (NetJets)',
      matchPercentage: 88,
      location: 'Cincinnati, OH',
      type: 'Corporate Aviation',
      salary: '$130,000 - $175,000 + signing bonus',
      requirements: ['3,500 hrs', 'CL30 Type Rating', 'ATP'],
      tags: ['NetJets Family', 'Premium Benefits', 'Career Growth'],
      postedAt: 'Actively Hiring',
      image: 'https://media.licdn.com/dms/image/v2/D5610AQF-mBJGtYQMEw/image-shrink_800/B56ZiZN6FXHUAk-/0/1754917217977?e=2147483647&v=beta&t=aBnETThrSWu2g8cvtfd8FSrpwYdq9ILm2DSElGUOZC8'
    },
    {
      id: 'disc-priv-8',
      title: 'Jet Aviation - G650 Captain',
      company: 'Jet Aviation (General Dynamics)',
      matchPercentage: 91,
      location: 'Van Nuys, CA',
      type: 'Private Charter',
      salary: '$180,000 - $220,000 + benefits',
      requirements: ['3,500 hrs', '1,500 PIC', 'G650 Type Rating'],
      tags: ['Global Charter', 'VIP Operations', '401(k) Match'],
      postedAt: 'Immediate Start',
      image: 'https://www.bjtonline.com/sites/bjtonline.com/files/styles/bjt30_article_large/public/jet-aviation-singapore-seletar.jpg?itok=7UwvebpF&timestamp=1562696419'
    },
    {
      id: 'disc-priv-9',
      title: 'PrivateFlite Aviation - Global Express Captain',
      company: 'PrivateFlite Aviation',
      matchPercentage: 85,
      location: 'Louisville, KY',
      type: 'Private Charter',
      salary: '$130,000 - $175,000 + signing bonus',
      requirements: ['2,000 hrs', 'Global Express Type', 'Part 135'],
      tags: ['Premium Charter', 'Signing Bonus', 'Flexible Schedule'],
      postedAt: 'Now Accepting',
      image: 'https://media.licdn.com/dms/image/v2/D5622AQECGqvvP5aO-A/feedshare-shrink_800/B56ZrgnQSHLwAk-/0/1764704978944?e=2147483647&v=beta&t=dJs4HV4pAgoMLpbmyZhilZekByaTLRggf-ABlTYDIkM'
    },
    {
      id: 'disc-priv-10',
      title: 'Solairus Aviation - GVII/G500 Captain',
      company: 'Solairus Aviation',
      matchPercentage: 89,
      location: 'Teterboro, NJ',
      type: 'Corporate Aviation',
      salary: '$170,000 - $200,000 + comprehensive benefits',
      requirements: ['3,000 hrs', '1,500 PIC', 'GVII Type Rating'],
      tags: ['Teterboro Hub', 'High-End Clientele', 'Full Benefits'],
      postedAt: 'Hiring Now',
      image: 'https://pbs.twimg.com/media/FzzsxWOXwAwdE2K.jpg'
    }
  ],
  'airtaxi-drones': [
    {
      id: 'wingmentor-intro-airtaxi',
      title: 'Pathways to Urban Air Mobility Careers',
      company: 'PilotRecognition',
      matchPercentage: 100,
      location: 'Global',
      type: 'Introduction',
      salary: 'Entry to mid-level pilot positions in emerging eVTOL and drone sectors',
      requirements: ['CPL or ATPL', 'Multi-Engine Rating', 'Interest in New Technology'],
      tags: ['eVTOL', 'Urban Air Mobility', 'Future Aviation'],
      postedAt: 'Featured',
      image: 'wingmentor-white'
    },
    {
      id: 'disc-airtaxi-1',
      title: 'Joby Aviation Pilot Program',
      company: 'Joby Aviation',
      matchPercentage: 88,
      location: 'Marina, CA / Various US Cities',
      type: 'eVTOL Pilot',
      salary: '$85,000 - $120,000/year',
      requirements: ['1,500 hrs', 'CPL or ATPL', 'Helicopter Experience Preferred', 'FAA Medical Class 1'],
      tags: ['eVTOL Pioneer', 'S4 Aircraft', 'Urban Air Mobility'],
      postedAt: 'Pre-Launch Hiring',
      image: 'https://lh3.googleusercontent.com/d/1XcRDW3p9C965siBjl5HsTXDHaQZJ-Ona'
    },
    {
      id: 'disc-airtaxi-2',
      title: 'Archer Aviation Midnight Operations',
      company: 'Archer Aviation',
      matchPercentage: 87,
      location: 'San Jose, CA / Miami, FL',
      type: 'eVTOL Captain',
      salary: '$80,000 - $115,000/year',
      requirements: ['1,200 hrs', 'Fixed-Wing or Rotary', 'Part 135 Experience'],
      tags: ['Midnight Aircraft', 'United Partnership', 'Sustainable Aviation'],
      postedAt: 'Early Recruitment',
      image: 'https://lh3.googleusercontent.com/d/1aTWWTtFwIMCrrU9HnCtWdUPTGhvWk6Yi'
    },
    {
      id: 'disc-airtaxi-3',
      title: 'Lilium Jet Pilot Training Program',
      company: 'Lilium GmbH',
      matchPercentage: 85,
      location: 'Munich, Germany / Orlando, FL',
      type: 'eVTOL Test & Operations Pilot',
      salary: '€70,000 - €95,000/year',
      requirements: ['2,000 hrs', 'Test Pilot Experience', 'EASA ATPL', 'English Fluent'],
      tags: ['Lilium Jet', 'VTOL Innovation', 'European UAM'],
      postedAt: 'Applications Open',
      image: 'https://aerospace.honeywell.com/content/dam/aerobt/en/images/horizontal/aero-lilium-jet-top-side-press-banner-2880x1440.jpg'
    },
    {
      id: 'disc-drone-1',
      title: 'Wing (Alphabet) Drone Delivery Pilot',
      company: 'Wing Aviation (Alphabet)',
      matchPercentage: 82,
      location: 'Dallas, TX / Canberra, Australia',
      type: 'Autonomous Drone Operations',
      salary: '$65,000 - $85,000/year',
      requirements: ['Remote Pilot License', 'UAS Experience', 'Technical Aptitude'],
      tags: ['Drone Delivery', 'Google/Alphabet', 'Autonomous Systems'],
      postedAt: 'Hiring Now',
      image: 'https://www.ttnews.com/sites/default/files/styles/article_full_width_webp/public/images/articles/alphabet-wing-1200.jpg.webp'
    },
    {
      id: 'disc-drone-2',
      title: 'Zipline International Flight Operations',
      company: 'Zipline International',
      matchPercentage: 86,
      location: 'San Francisco, CA / Global Bases',
      type: 'Drone Fleet Operator',
      salary: '$70,000 - $95,000/year',
      requirements: ['UAS Certification', 'International Experience', 'Healthcare Logistics'],
      tags: ['Medical Delivery', 'Life-Saving Missions', 'Global Impact'],
      postedAt: 'Active Hiring',
      image: 'https://techcrunch.com/wp-content/uploads/2026/01/Zipline-P2-drone-Delivering.jpg'
    },
    {
      id: 'disc-drone-3',
      title: 'EHang AAV Pilot Certification',
      company: 'EHang Holdings',
      matchPercentage: 83,
      location: 'Guangzhou, China / Global Expansion',
      type: 'Autonomous Aerial Vehicle Pilot',
      salary: '$60,000 - $90,000/year',
      requirements: ['CPL or ATPL', 'Chinese Language Optional', 'AAV Training Provided'],
      tags: ['EH216', 'Urban Air Taxi', 'Chinese UAM Leader'],
      postedAt: 'Training Programs Open',
      image: 'https://www.ehang.com/ueditor/image/2020-05-27/b84e83d73343ae74a9ed691bbd9ff9321590586324349049.jpg'
    },
    {
      id: 'disc-drone-4',
      title: 'Vertical Aerospace VX4 Pilot Program',
      company: 'Vertical Aerospace',
      matchPercentage: 84,
      location: 'Bristol, UK / London',
      type: 'eVTOL Pilot - London Services',
      salary: '£55,000 - £80,000/year',
      requirements: ['1,800 hrs', 'ATPL', 'Helicopter Experience', 'UK/EU Citizen'],
      tags: ['VX4 Aircraft', 'London Air Taxi', 'Sustainable Travel'],
      postedAt: 'Pre-Commercial Hiring',
      image: 'https://vertical-aerospace.com/wp-content/uploads/2025/12/VerticalAerospace-AC3-32-1920x1000.jpg'
    },
    {
      id: 'disc-drone-5',
      title: 'MLG Pilotless Drone Operations',
      company: 'MLG Aviation',
      matchPercentage: 80,
      location: 'Global Remote Operations',
      type: 'Autonomous Drone Operations',
      salary: '$55,000 - $75,000/year',
      requirements: ['UAS Certification', 'Remote Pilot License', 'Autonomous Systems Experience'],
      tags: ['Pilotless Operations', 'Remote Command', 'Next-Gen Aviation'],
      postedAt: 'Now Hiring',
      image: '/images/pathway-mlg.png'
    }
  ],
  specialized: [
    {
      id: 'wingmentor-intro-specialized',
      title: 'Pathways to Specialized Aviation Careers',
      company: 'PilotRecognition',
      matchPercentage: 100,
      location: 'Global',
      type: 'Introduction',
      salary: 'Unique aviation careers with specialized training and certification requirements',
      requirements: ['Varies by Pathway', 'Specialized Training', 'Passion for Niche Aviation'],
      tags: ['Niche Careers', 'Specialized Operations', 'Unique Aviation'],
      postedAt: 'Featured',
      image: 'wingmentor-white'
    },
    {
      id: 'disc-spec-skydive',
      title: 'Skydive Piloting Pathway',
      company: 'Drop Zone Operators',
      matchPercentage: 78,
      location: 'Multiple Drop Zones Worldwide',
      type: 'Specialized Operations',
      salary: '$45,000 - $70,000/year',
      requirements: ['1,000+ hrs TT', 'CPL', 'Skydive Operations Experience', 'Safety Focused'],
      tags: ['Skydiving', 'Drop Zone Ops', 'Adventure Aviation'],
      postedAt: 'Hiring Now',
      image: 'https://skydiverdriver.com/assets/images/cr-656x463.jpg'
    },
    {
      id: 'disc-spec-rescue',
      title: 'Remote Supply Runs Pilot',
      company: 'Remote Logistics Operators',
      matchPercentage: 82,
      location: 'Remote / Underserved Regions',
      type: 'Supply & Logistics',
      salary: '$60,000 - $95,000/year',
      requirements: ['2,000+ hrs TT', 'Mountain Flying', 'Short Field Operations', 'Supply Chain Experience'],
      tags: ['Remote Supply', 'Logistics', 'Critical Deliveries'],
      postedAt: 'Active Recruitment',
      image: '/images/pathway-susiair.png'
    },
    {
      id: 'disc-spec-tours',
      title: 'Flight Tours Operations Pathway',
      company: 'Tour Operators',
      matchPercentage: 75,
      location: 'Tourist Destinations Worldwide',
      type: 'Commercial Tourism',
      salary: '$40,000 - $65,000/year',
      requirements: ['500+ hrs TT', 'CPL', 'Customer Service Skills', 'Local Knowledge'],
      tags: ['Sightseeing', 'Tourism', 'Scenic Flights'],
      postedAt: 'Seasonal Hiring',
      image: 'https://suncityaviation.com/_astro/sun-city-aviation-academy-why-pilot.CEsqMppz_Z26lmps.webp'
    },
    {
      id: 'disc-spec-experimental',
      title: 'Experimental Flight Pathways',
      company: 'R&D Flight Centers',
      matchPercentage: 85,
      location: 'Test Facilities / Flight Centers',
      type: 'Research & Development',
      salary: '$75,000 - $110,000/year',
      requirements: ['2,500+ hrs TT', 'Test Pilot Training', 'Engineering Background', 'Risk Assessment'],
      tags: ['Flight Testing', 'Prototype Ops', 'R&D Aviation'],
      postedAt: 'Limited Positions',
      image: 'https://angelesflying.com/wp-content/uploads/2021/03/FB_IMG_1615194966689-e1652932116141.jpg'
    },
    {
      id: 'disc-spec-ambulance',
      title: 'Air Ambulance Pathways',
      company: 'Medical Transport Services',
      matchPercentage: 88,
      location: 'Hospital Bases / Emergency Centers',
      type: 'Medical Transport',
      salary: '$55,000 - $85,000/year',
      requirements: ['1,500+ hrs TT', 'IFR Rated', 'Medical Evacuation Experience', 'Night Operations'],
      tags: ['Air Ambulance', 'Medical Evac', 'Life Critical'],
      postedAt: 'Continuous Hiring',
      image: 'https://www.lifeflight.org.nz/wp-content/uploads/2023/11/G83_5774-web-800x400.jpg'
    },
    {
      id: 'disc-spec-agriculture',
      title: 'Agricultural Crop Dusting Pathway',
      company: 'Aerial Application Operators',
      matchPercentage: 76,
      location: 'Rural / Agricultural Regions',
      type: 'Agricultural Aviation',
      salary: '$50,000 - $80,000/year',
      requirements: ['800+ hrs TT', 'Low-Level Flight Experience', 'Chemical Handling', 'Seasonal Work'],
      tags: ['Crop Dusting', 'Aerial Application', 'Agricultural Aviation'],
      postedAt: 'Seasonal Peak',
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Gehling_PZL-106_AR_Kruk_OTT_2013_D7N9017_009.jpg'
    },
    {
      id: 'disc-spec-survey',
      title: 'Pipeline & Land Survey Pilotage Pathway',
      company: 'Aerial Survey Operators',
      matchPercentage: 79,
      location: 'Remote / Industrial Regions',
      type: 'Survey & Inspection',
      salary: '$55,000 - $85,000/year',
      requirements: ['1,000+ hrs TT', 'Low-Level Survey Flying', 'Photogrammetry', 'Long-Endurance Flights'],
      tags: ['Pipeline Survey', 'Land Survey', 'Aerial Mapping'],
      postedAt: 'Year-Round Hiring',
      image: 'https://www.aopa.org/-/media/Images/AOPA-Main/News-and-Media/Publications/Flight-Training-Magazine/2023/2311/2311f_ap/2311f_ap_career_01/2311f_ap_career_01_16x9.jpg'
    },
    {
      id: 'disc-spec-ownership',
      title: 'Aircraft Ownership Pathways',
      company: 'Private Aircraft Owners / Management Companies',
      matchPercentage: 81,
      location: 'Global / Flexible',
      type: 'Private Aircraft Operations',
      salary: '$90,000 - $150,000/year',
      requirements: ['2,500+ hrs TT', 'CPL/ATPL', 'Type Ratings Required', 'Personal Aircraft Experience'],
      tags: ['Private Ownership', 'Aircraft Management', 'VIP Operations'],
      postedAt: 'Private Opportunities',
      image: 'https://media.licdn.com/dms/image/v2/C4E22AQFp1BB6J459Qg/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1662370011016?e=2147483647&v=beta&t=0YKdpSpzhGbUfvRwS8fz-17I1O4i7cq-glY9pA51tMI'
    },
    {
      id: 'disc-spec-fire',
      title: 'Aerial Firefighting Pathway',
      company: 'Fire Suppression Operators',
      matchPercentage: 77,
      location: 'High-Risk Fire Regions / Seasonal Bases',
      type: 'Emergency Response',
      salary: '$65,000 - $95,000/year',
      requirements: ['1,500+ hrs TT', 'Low-Level Flying', 'Fire Season Experience', 'Tanker Operations'],
      tags: ['Fire Suppression', 'Water Bomber', 'Emergency Aviation'],
      postedAt: 'Seasonal Recruitment',
      image: 'https://airtractor.com/wp-content/uploads/2022/03/3_22_22-Wildfire.jpg'
    },
    {
      id: 'disc-spec-ice',
      title: 'Arctic & Ice Operations Pathway',
      company: 'Polar Aviation Services',
      matchPercentage: 83,
      location: 'Arctic / Antarctic / High-Latitude Regions',
      type: 'Extreme Environment Operations',
      salary: '$70,000 - $100,000/year',
      requirements: ['2,000+ hrs TT', 'Cold Weather Ops', 'Skis/Wheel Operations', 'Survival Training'],
      tags: ['Polar Operations', 'Ice Runways', 'Extreme Weather'],
      postedAt: 'Limited Positions',
      image: 'https://pilotweb.aero/wp-content/uploads/10010287-credit-morag-hunter.jpg'
    },
    {
      id: 'disc-spec-banners',
      title: 'Aerial Banner Towing Pathway',
      company: 'Advertising Aviation Companies',
      matchPercentage: 72,
      location: 'Coastal / Event Locations',
      type: 'Commercial Advertising',
      salary: '$35,000 - $55,000/year',
      requirements: ['500+ hrs TT', 'Tailwheel Experience', 'Banner Towing Endorsement', 'Seasonal Flexibility'],
      tags: ['Banner Towing', 'Aerial Ads', 'Event Aviation'],
      postedAt: 'Summer Season',
      image: 'https://t4.ftcdn.net/jpg/01/24/76/11/360_F_124761142_PDxGcICygVGzWa2GirpHIZkbGLLHGzzW.jpg'
    },
    {
      id: 'disc-spec-intel',
      title: 'Aerial Surveillance & Intel Pathway',
      company: 'Government & Security Contractors',
      matchPercentage: 86,
      location: 'Classified / Domestic Bases',
      type: 'Intelligence Operations',
      salary: '$80,000 - $120,000/year',
      requirements: ['2,500+ hrs TT', 'Security Clearance', 'ISR Experience', 'Multi-Engine Rated'],
      tags: ['Surveillance', 'Intelligence', 'Government Ops'],
      postedAt: 'Security Clearance Required',
      image: 'https://cdn.prod.website-files.com/692fd066ee17d3dbb4a3c663/6966cb5ac521befde4d6b818_64343287e557aaecdaa2aaac_02d2f99fdfc8244b75d5b37839674333ab452aa54b89ec98af755e964f4923990053a8035ac4a68f29df5646bc6ca0ef1721a3c7be38e384443cf0c5186e6f37f8b5e90785c9723546f7e01cd676057e2058af389232c88992f8b96a3c734b384d6fc2b9.png'
    }
  ]
};

const CATEGORY_SECTIONS: CategorySection[] = [
  {
    id: 'cadet-programme',
    title: 'Cadet Programs',
    description: 'Major, regional, and budget carriers serving scheduled passenger routes',
    accentColor: '#3b82f6',
    pathways: [
      {
        id: 'comm-1',
        title: 'First Officer A320',
        company: 'Singapore Airlines',
        matchPercentage: 92,
        location: 'Singapore',
        type: 'Major Airline',
        salary: '$120,000/year',
        requirements: ['1500 hrs', 'A320 TR', 'Medical 1'],
        tags: ['Full Benefits', 'Training Bond'],
        postedAt: '1 day ago',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
      },
      {
        id: 'comm-2',
        title: 'B737 First Officer',
        company: 'Ryanair',
        matchPercentage: 89,
        location: 'Dublin, Ireland',
        type: 'Low-Cost Carrier',
        salary: '€65,000/year',
        requirements: ['500 hrs', 'B737 TR', 'EU Passport'],
        tags: ['Fast Upgrade', 'Base Options'],
        postedAt: '2 days ago',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
      },
      {
        id: 'comm-3',
        title: 'ATR72 First Officer',
        company: 'AirAsia',
        matchPercentage: 87,
        location: 'Kuala Lumpur',
        type: 'Regional',
        salary: '$45,000/year',
        requirements: ['250 hrs', 'ME/IR', 'ICAO 4'],
        tags: ['Growing Fleet', 'Asia Pacific'],
        postedAt: '3 days ago',
        image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80'
      },
      {
        id: 'comm-4',
        title: 'Q400 First Officer',
        company: 'Horizon Air',
        matchPercentage: 94,
        location: 'Seattle, WA',
        type: 'Regional',
        salary: '$55,000/year',
        requirements: ['250 hrs', 'ME Rating'],
        tags: ['Alaska Group', 'Flow Program'],
        postedAt: '1 week ago',
        image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
      },
      {
        id: 'comm-5',
        title: 'E175 First Officer',
        company: 'Republic Airways',
        matchPercentage: 90,
        location: 'Indianapolis, IN',
        type: 'Regional',
        salary: '$60,000/year',
        requirements: ['250 hrs', 'ATP-CTP'],
        tags: ['Partner Airlines', 'Upgrade Fast'],
        postedAt: '4 days ago',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
      },
      {
        id: 'comm-6',
        title: 'A350 Second Officer',
        company: 'Qatar Airways',
        matchPercentage: 86,
        location: 'Doha, Qatar',
        type: 'Major Airline',
        salary: '$95,000 tax-free',
        requirements: ['750 hrs', 'Widebody Exp'],
        tags: ['Tax Free', 'Housing'],
        postedAt: '5 days ago',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
      },
      {
        id: 'comm-7',
        title: 'B787 First Officer',
        company: 'ANA',
        matchPercentage: 83,
        location: 'Tokyo, Japan',
        type: 'Major Airline',
        salary: '¥12,000,000',
        requirements: ['2000 hrs', 'B787 TR', 'JLPT N2'],
        tags: ['Premium Airline', 'Japan'],
        postedAt: '6 days ago',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
      }
    ]
  },
  {
    id: 'private',
    title: 'Type Rating & Licensure Pathways',
    description: 'Executive transport, fractional ownership, and luxury charter operations',
    accentColor: '#f59e0b',
    pathways: [
      {
        id: 'priv-3',
        title: 'Challenger 350 Captain',
        company: 'VistaJet',
        matchPercentage: 91,
        location: 'Malta / Global',
        type: 'Private Charter',
        salary: '$190,000 + bonus',
        requirements: ['3500 hrs', 'Bombardier Exp', 'VIP Exp'],
        tags: ['Worldwide', 'Silver Service'],
        postedAt: '1 day ago',
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80'
      },
      {
        id: 'priv-4',
        title: 'Falcon 7X Captain',
        company: 'Global Jet',
        matchPercentage: 82,
        location: 'Geneva, Switzerland',
        type: 'Private Charter',
        salary: 'CHF 220,000',
        requirements: ['4000 hrs', 'Falcon Type', 'EU'],
        tags: ['European', 'Long Range'],
        postedAt: '5 days ago',
        image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80'
      },
      {
        id: 'priv-5',
        title: 'PC-12 Captain',
        company: 'PlaneSense',
        matchPercentage: 79,
        location: 'Portsmouth, NH',
        type: 'Fractional',
        salary: '$110,000/year',
        requirements: ['1500 hrs', 'Turboprop', 'Single Pilot'],
        tags: ['Turboprop', 'Growth'],
        postedAt: '1 week ago',
        image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80'
      },
      {
        id: 'priv-6',
        title: 'Legacy 650 Captain',
        company: 'ExecuJet',
        matchPercentage: 84,
        location: 'Dubai, UAE',
        type: 'Private Charter',
        salary: '$175,000 tax-free',
        requirements: ['3500 hrs', 'Embraer', 'Middle East'],
        tags: ['Tax Free', 'VIP'],
        postedAt: '4 days ago',
        image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
      }
    ]
  },
  {
    id: 'privateSector',
    title: 'Private Sector Pathways',
    description: 'Executive transport, fractional ownership, and luxury charter operations',
    accentColor: '#f59e0b',
    pathways: []
  },
  {
    id: 'cargo',
    title: 'Airline Expectations',
    description: 'Freight and logistics operations including express delivery and long-haul cargo',
    accentColor: '#10b981',
    pathways: [
      {
        id: 'cargo-5',
        title: 'B777F Captain',
        company: 'Ethiopian Cargo',
        matchPercentage: 81,
        location: 'Addis Ababa',
        type: 'Long-Haul Cargo',
        salary: '$220,000/year',
        requirements: ['5000 hrs', 'B777 Type'],
        tags: ['Africa Hub', 'Growth Market'],
        postedAt: '1 week ago',
        image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80'
      }
    ]
  },
  {
    id: 'cargoPathways',
    title: 'Cargo Pathways',
    description: 'Dedicated cargo airline career programs and development pathways',
    accentColor: '#8b5cf6',
    pathways: []
  },
  {
    id: 'airtaxi-drones',
    title: 'Emerging AirTaxi & Drones Pathway',
    description: 'Urban air mobility, eVTOL operations, and autonomous drone piloting opportunities',
    accentColor: '#ec4899',
    pathways: []
  },
  {
    id: 'specialized',
    title: 'Specialized Pathways',
    description: 'Niche aviation careers including skydiving, rescue operations, flight tours, and experimental flight',
    accentColor: '#f97316',
    pathways: []
  }
];

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Industry Alert: VistaJet Increases Minimums',
    subtitle: 'New requirement for 4000 hours TT effective immediately across all captain positions',
    category: 'Industry Update',
    icon: <Icons.AlertTriangle className="w-5 h-5" />,
    urgent: true
  },
  {
    id: 'news-2',
    title: 'Emirates Announces 200 New Pilot Positions',
    subtitle: 'Expansion of A350 and B777X fleet creates opportunities for First Officers and Captains',
    category: 'Hiring Surge',
    icon: <Icons.TrendingUp className="w-5 h-5" />
  },
  {
    id: 'news-3',
    title: 'eVTOL Sector Raises $2.4B in Q1 2026',
    subtitle: 'Joby, Archer, and Lilium secure major funding - pilot hiring expected to accelerate',
    category: 'Market Intel',
    icon: <Icons.Zap className="w-5 h-5" />
  }
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const MatchBadge: React.FC<{ percentage: number }> = ({ percentage }) => {
  const getGlowColor = (p: number) => {
    if (p >= 90) return 'shadow-emerald-500/50';
    if (p >= 80) return 'shadow-blue-500/50';
    if (p >= 70) return 'shadow-amber-500/50';
    return 'shadow-slate-500/30';
  };

  const getGradient = (p: number) => {
    if (p >= 90) return 'from-emerald-400 to-teal-300';
    if (p >= 80) return 'from-blue-400 to-cyan-300';
    if (p >= 70) return 'from-amber-400 to-yellow-300';
    return 'from-slate-400 to-zinc-300';
  };

  return (
    <div 
      className={`
        relative inline-flex items-center gap-1 
        px-2 py-0.5 rounded-full text-xs font-bold
        bg-gradient-to-r ${getGradient(percentage)}
        text-slate-950 shadow-lg ${getGlowColor(percentage)}
      `}
    >
      <span>{percentage}%</span>
    </div>
  );
};

// N/A Badge for empty profiles with tooltip
const NABadge: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = true }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-slate-400 to-gray-400 text-slate-950 shadow-lg cursor-help"
      >
        <span>N/A</span>
      </div>
      
      {showTooltip && (
        <div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs max-w-[200px] z-50"
          style={{
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            color: isDarkMode ? '#e2e8f0' : '#0f172a',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)'}`,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="font-medium mb-1">Match Score Unavailable</div>
          <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
            N/A due to zero input or logged hours. Update your Recognition Profile to see your match score.
          </div>
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45"
            style={{
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderRight: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)'}`,
              borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)'}`
            }}
          />
        </div>
      )}
    </div>
  );
};

// Combined badge component that shows percentage or N/A
const MatchBadgeOrNA: React.FC<{ percentage: number; profile: UserProfileData | null; isDarkMode?: boolean }> = ({ 
  percentage, 
  profile, 
  isDarkMode = true 
}) => {
  if (isProfileEmpty(profile)) {
    return <NABadge isDarkMode={isDarkMode} />;
  }
  return <MatchBadge percentage={percentage} />;
};

const LivePulsingDot: React.FC = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
  </span>
);

// ============================================================================
// MAIN COMPONENT SECTIONS
// ============================================================================

const OmniSearchBar: React.FC<{ value: string; onChange: (v: string) => void; isDarkMode?: boolean }> = ({ value, onChange, isDarkMode = true }) => {
  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1200px', 
      margin: '0 auto 40px',
      padding: '0 20px'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
        borderRadius: '16px',
        border: `1px solid ${isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
        boxShadow: isDarkMode 
          ? '0 0 20px rgba(139, 92, 246, 0.4), 0 0 60px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 0 20px rgba(139, 92, 246, 0.15), 0 0 40px rgba(236, 72, 153, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        padding: '4px',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Search Icon */}
        <div style={{ 
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#94a3b8' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
        
        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            fontSize: '17px',
            padding: '14px 0',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        />
        
        {/* Filter Icon Button */}
        <button
          style={{
            padding: '12px 16px',
            margin: '4px',
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(226, 232, 240, 0.8)';
            e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(148, 163, 184, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)';
            e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#cbd5e1' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

const LiveJobBoard: React.FC<{ isDarkMode?: boolean; profile: UserProfileData | null; jobs: PathwayJob[]; title?: string }> = ({ isDarkMode = true, profile, jobs, title = "Live Matches for Your Profile" }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (jobs.length === 0) return null;

  return (
    <section className="py-6 px-4" style={{ backgroundColor: isDarkMode ? 'transparent' : 'transparent' }}>
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <LivePulsingDot />
            <h2 className="text-lg font-semibold" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>
              {title}
            </h2>
            <span className="px-2 py-0.5 text-xs rounded-full border" style={{ 
              backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: isDarkMode ? '#34d399' : '#059669',
              borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.2)'
            }}>
              {jobs.length} active
            </span>
          </div>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide justify-center mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: 'fit-content' }}
        >
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex-shrink-0 w-[380px] p-5 rounded-3xl transition-all duration-300 cursor-pointer group"
              style={{
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
              }}
            >
              {/* Job Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ 
                    backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
                    color: isDarkMode ? '#94a3b8' : '#475569'
                  }}>
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>{job.title}</h3>
                    <p className="text-xs" style={{ color: isDarkMode ? '#64748b' : '#64748b' }}>{job.company}</p>
                  </div>
                </div>
                <MatchBadgeOrNA percentage={job.matchPercentage} profile={profile} isDarkMode={isDarkMode} />
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)'
                }}>
                  <Icons.MapPin className="w-3 h-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)'
                }}>
                  <Icons.DollarSign className="w-3 h-3" /> {job.salary}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {job.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-full border"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: isDarkMode ? '#93c5fd' : '#2563eb',
                      borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Posted Time */}
              <div className="flex items-center gap-1.5 mt-3 pt-3" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.2)'}` }}>
                <span className="text-xs" style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}>{job.postedAt}</span>
                {job.isLive && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs" style={{
                    backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: isDarkMode ? '#34d399' : '#059669'
                  }}>
                    <LivePulsingDot /> Live
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Category Job Board - Horizontal scrolling job cards for each category
const CategoryJobBoard: React.FC<{ 
  categoryId: string;
  isDarkMode?: boolean; 
  profile: UserProfileData | null;
}> = ({ categoryId, isDarkMode = true, profile }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const jobs = CATEGORY_JOBS[categoryId] || [];

  if (jobs.length === 0) return null;

  return (
    <section className="py-4 px-4 mb-6" style={{ backgroundColor: isDarkMode ? 'transparent' : 'transparent' }}>
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>
              Available Positions
            </h3>
            <span className="px-2 py-0.5 text-xs rounded-full border" style={{ 
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              color: isDarkMode ? '#60a5fa' : '#2563eb',
              borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)'
            }}>
              {jobs.length} jobs
            </span>
          </div>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex-shrink-0 w-[340px] p-4 rounded-2xl transition-all duration-300 cursor-pointer group"
              style={{
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(148, 163, 184, 0.15)'}`,
              }}
            >
              {/* Job Card Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold" style={{ 
                    backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
                    color: isDarkMode ? '#94a3b8' : '#475569'
                  }}>
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm leading-tight" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>{job.title}</h4>
                    <p className="text-xs" style={{ color: isDarkMode ? '#64748b' : '#64748b' }}>{job.company}</p>
                  </div>
                </div>
                <MatchBadgeOrNA percentage={job.matchPercentage} profile={profile} isDarkMode={isDarkMode} />
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)'
                }}>
                  <Icons.MapPin className="w-3 h-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)'
                }}>
                  <Icons.DollarSign className="w-3 h-3" /> {job.salary}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {job.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-full border"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: isDarkMode ? '#93c5fd' : '#2563eb',
                      borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Posted Time */}
              <div className="flex items-center gap-1.5 mt-2 pt-2" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.2)'}` }}>
                <span className="text-xs" style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}>{job.postedAt}</span>
                {job.isLive && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs" style={{
                    backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: isDarkMode ? '#34d399' : '#059669'
                  }}>
                    <LivePulsingDot /> Live
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Discovery Cards - Shows pathway opportunities for pilots to discover
const DiscoveryCards: React.FC<{ 
  categoryId: string;
  isDarkMode?: boolean; 
  profile: UserProfileData | null;
  title?: string;
  onNavigateToPathway?: (categoryId: string) => void;
}> = ({ categoryId, isDarkMode = true, profile, title, onNavigateToPathway }) => {
  // Refs must be declared before scroll function
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);
  
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Use hovered index if available, otherwise use active index from scroll
  const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  // Use the discovery pathways data
  const pathways = DISCOVERY_PATHWAYS[categoryId] || [];
  const section = CATEGORY_SECTIONS.find(s => s.id === categoryId);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current || !containerRef.current) return;
    
    const gap = 24;
    const currentScroll = scrollRef.current.scrollLeft;
    const containerWidth = containerRef.current.clientWidth;
    const viewportCenter = currentScroll + (containerWidth / 2);
    
    // Find current active index based on viewport center
    let cumulativeWidth = 0;
    let currentIndex = 0;
    
    for (let i = 0; i < pathways.length; i++) {
      const cardWidth = i === 0 ? 600 : 1000;
      const itemWidth = cardWidth + gap;
      const cardStart = cumulativeWidth;
      const cardEnd = cumulativeWidth + cardWidth;
      
      if (viewportCenter >= cardStart && viewportCenter < cardEnd + gap) {
        currentIndex = i;
        break;
      }
      cumulativeWidth += itemWidth;
    }
    
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(pathways.length - 1, currentIndex + 1);
    
    // Calculate cumulative scroll to reach target card
    let newScroll = 0;
    for (let i = 0; i < newIndex; i++) {
      const cardWidth = i === 0 ? 600 : 1000;
      newScroll += cardWidth + gap;
    }
    
    scrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
  };

  // Manual card navigation for header arrows - centers the target card
  const navigateCard = (direction: 'prev' | 'next') => {
    if (!scrollRef.current || !containerRef.current) return;
    
    const gap = 24;
    const containerWidth = containerRef.current.clientWidth;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = Math.max(0, activeIndex - 1);
    } else {
      newIndex = Math.min(pathways.length - 1, activeIndex + 1);
    }
    
    // Calculate cumulative scroll position to reach the target card
    let cardStartPos = 0;
    for (let i = 0; i < newIndex; i++) {
      const cardWidth = i === 0 ? 600 : 1000;
      cardStartPos += cardWidth + gap;
    }
    
    // Calculate the target card's width and center it in the viewport
    const targetCardWidth = newIndex === 0 ? 600 : 1000;
    const cardCenterOffset = targetCardWidth / 2;
    const viewportCenter = containerWidth / 2;
    
    // Scroll to position where card center aligns with viewport center
    const scrollPosition = Math.max(0, cardStartPos + cardCenterOffset - viewportCenter);
    
    scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    setActiveIndex(newIndex);
    setHoveredIndex(null); // Clear hover state when manually navigating
  };

  // Handle scroll - detect scroll position for UI updates with momentum snap
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  
  const snapToNearestCard = useCallback(() => {
    if (!scrollRef.current || !containerRef.current) return;
    
    const scrollLeft = scrollRef.current.scrollLeft;
    const containerWidth = containerRef.current.clientWidth;
    const viewportCenter = scrollLeft + (containerWidth / 2);
    
    // Calculate cumulative widths to find which card is closest to center
    let cumulativeWidth = 0;
    let closestIndex = 0;
    let closestDistance = Infinity;
    const gap = 24;
    
    for (let i = 0; i < pathways.length; i++) {
      const cardWidth = i === 0 ? 600 : 1000;
      const itemWidth = cardWidth + gap;
      const cardCenter = cumulativeWidth + (cardWidth / 2);
      const distance = Math.abs(viewportCenter - cardCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
      
      cumulativeWidth += itemWidth;
    }
    
    // Calculate scroll position to center the closest card
    let targetCardStart = 0;
    for (let i = 0; i < closestIndex; i++) {
      const cardWidth = i === 0 ? 600 : 1000;
      targetCardStart += cardWidth + gap;
    }
    
    const targetCardWidth = closestIndex === 0 ? 600 : 1000;
    const scrollPosition = targetCardStart + (targetCardWidth / 2) - (containerWidth / 2);
    
    scrollRef.current.scrollTo({ 
      left: Math.max(0, scrollPosition), 
      behavior: 'smooth' 
    });
    
    setActiveIndex(closestIndex);
  }, [pathways.length]);
  
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !containerRef.current) return;
    
    // Update left arrow visibility
    setShowLeftArrow(scrollRef.current.scrollLeft > 20);
    
    // Calculate which card is centered in the viewport
    const scrollLeft = scrollRef.current.scrollLeft;
    const containerWidth = containerRef.current.clientWidth;
    const viewportCenter = scrollLeft + (containerWidth / 2);
    
    // Calculate cumulative widths to find which card is at center
    let cumulativeWidth = 0;
    let newActiveIndex = 0;
    const gap = 24;
    
    for (let i = 0; i < pathways.length; i++) {
      const cardWidth = i === 0 ? 600 : 1000;
      const itemWidth = cardWidth + gap;
      const cardStart = cumulativeWidth;
      const cardEnd = cumulativeWidth + cardWidth;
      
      // Check if viewport center is within this card (with some buffer for the gap)
      if (viewportCenter >= cardStart && viewportCenter < cardEnd + gap) {
        newActiveIndex = i;
        break;
      }
      
      cumulativeWidth += itemWidth;
    }
    
    if (newActiveIndex !== activeIndex && newActiveIndex >= 0 && newActiveIndex < pathways.length) {
      setActiveIndex(newActiveIndex);
    }
    
    // Clear existing timeout and set new one for momentum snap
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    isScrollingRef.current = true;
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      snapToNearestCard();
    }, 150); // 150ms after scroll stops, snap to nearest card
    
  }, [activeIndex, pathways.length, snapToNearestCard]);

  // Auto-scroll using CSS animation for smooth performance
  const shouldAutoScroll = pathways.length > 1;
  
  useEffect(() => {
    if (!shouldAutoScroll || !scrollRef.current || !containerRef.current) return;
    
    const scrollContainer = scrollRef.current;
    const cardWidth = 1016;
    const gap = 24;
    const itemWidth = cardWidth + gap;
    const totalWidth = itemWidth * pathways.length;
    const containerWidth = containerRef.current.clientWidth;
    const maxOffset = Math.max(0, totalWidth - containerWidth);
    
    // If content fits, no animation needed
    if (maxOffset <= 0) return;
    
    // Use CSS animation for GPU-accelerated smooth scrolling
    const duration = Math.max(30, maxOffset / 30); // seconds, ~30px/sec
    
    // Apply animation via style (not state)
    scrollContainer.style.setProperty('--scroll-duration', `${duration}s`);
    scrollContainer.style.setProperty('--scroll-distance', `${maxOffset}px`);
    scrollContainer.classList.add('auto-scroll');
    
    // Pause on interaction
    const pauseScroll = () => {
      scrollContainer.classList.add('paused');
      setTimeout(() => {
        scrollContainer.classList.remove('paused');
      }, 3000);
    };
    
    scrollContainer.addEventListener('mousedown', pauseScroll);
    scrollContainer.addEventListener('touchstart', pauseScroll, { passive: true });
    
    return () => {
      scrollContainer.classList.remove('auto-scroll');
      scrollContainer.removeEventListener('mousedown', pauseScroll);
      scrollContainer.removeEventListener('touchstart', pauseScroll);
    };
  }, [pathways.length, shouldAutoScroll]);

  // Intersection Observer to handle visibility changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          containerRef.current?.classList.add('in-view');
        } else {
          containerRef.current?.classList.remove('in-view');
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  if (pathways.length === 0) return null;

  return (
    <section className="pt-2 pb-8 px-4 relative" style={{ backgroundColor: isDarkMode ? 'transparent' : 'transparent' }}>
      <div className="w-full">
        {/* Section Header - Left Aligned - Compact */}
        <div className="mb-4 text-left px-4">
          <h2 style={{ fontFamily: 'Georgia, serif', margin: '0 0 0.5rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>
            {section?.title || title || 'Pathways'}
          </h2>
          <p style={{ margin: '0', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '500px' }}>
            {section?.description || 'Training programs, cadet schemes, and career pathways to advance your aviation career'}
          </p>
          
          {/* News Headlines Strip - Below header description */}
          {section && (
            <div className="mt-2 py-2 px-3 rounded-lg" style={{ 
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ 
                color: section.accentColor || '#3b82f6',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'
              }}>
                {section.title} Update
              </span>
              <span className="text-xs" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                Latest opportunities and industry news
              </span>
            </div>
          )}
        </div>

        {/* Navigation Arrows - positioned separately */}
        <div className="flex items-center justify-end gap-2 mb-4">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full transition-colors"
              style={{
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
                color: isDarkMode ? '#cbd5e1' : '#475569'
              }}
            >
              <Icons.ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full transition-colors"
            style={{
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
              color: isDarkMode ? '#cbd5e1' : '#475569'
            }}
          >
            <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Swipe instruction - faint text above cards */}
        <div className="mb-3 flex justify-center">
          <span className="text-xs tracking-wider" style={{ 
            color: isDarkMode ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)',
            fontStyle: 'italic'
          }}>
            Swipe left & right to discover pathways
          </span>
        </div>

          {/* Discovery Cards Container */}
        <div ref={containerRef} className="relative overflow-hidden">
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .auto-scroll {
              scroll-behavior: auto;
            }
            .auto-scroll {
              animation: smoothScroll var(--scroll-duration) linear forwards;
            }
            .auto-scroll.paused {
              animation-play-state: paused;
            }
            @keyframes smoothScroll {
              0% { scroll-left: 0; }
              100% { scroll-left: var(--scroll-distance); }
            }
            .snap-scroll {
              scroll-snap-type: x mandatory;
            }
            .snap-scroll > div > div {
              scroll-snap-align: center;
            }
          `}</style>
          {/* Scroll container with snap behavior */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-scroll"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              overscrollBehaviorX: 'none',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x pinch-zoom',
              scrollPaddingLeft: '50%',
              scrollPaddingRight: '50%'
            }}
            onWheel={(e) => {
              if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.stopPropagation();
              }
            }}
            onTouchMove={(e) => {
              if (scrollRef.current) {
                const scrollLeft = scrollRef.current.scrollLeft;
                const scrollWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                if ((scrollLeft <= 0 && e.touches[0].clientX > e.changedTouches[0]?.clientX) ||
                    (scrollLeft >= scrollWidth && e.touches[0].clientX < e.changedTouches[0]?.clientX)) {
                  e.preventDefault();
                }
              }
            }}
          >
            {/* Track - animated */}
            <div ref={trackRef} className={`flex gap-6 flex-shrink-0 ${pathways.length === 1 ? 'justify-center w-full' : ''}`}>
              {pathways.map((pathway, index) => (
                <div
                  key={pathway.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group relative"
                  style={{
                    width: index === 0 ? '600px' : '1000px',
                    height: '420px',
                    backgroundColor: index === 0 ? '#ffffff' : (isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)'),
                    border: `1px solid ${index === 0 ? 'rgba(148, 163, 184, 0.3)' : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)')}`,
                  }}
                >
                {index === 0 ? (
                  // PilotRecognition Intro Card - White background with special styling (450px)
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white">
                    {/* PilotRecognition Logo */}
                    <div className="mb-5 flex items-center justify-center">
                      <img 
                        src="/logo.png" 
                        alt="PilotRecognition Logo"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    
                    {/* Georgia Font Header */}
                    <h2 style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '1.5rem',
                      fontWeight: 400,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.3,
                      color: '#0f172a',
                      textAlign: 'center',
                      marginBottom: '1rem'
                    }}>
                      {categoryId === 'private' ? 'Pathways to Type Rating Pathways' : 'Pathways to Partnered Cadet Programs'}
                    </h2>
                    
                    {/* Description Text */}
                    <p style={{
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: '#475569',
                      textAlign: 'center'
                    }}>
                      Direct entry pathways for foundation program completion
                    </p>
                    
                    {/* PilotRecognition Branding */}
                    <div className="mt-8 flex items-center gap-2">
                      <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Powered by</span>
                      <span style={{ fontFamily: 'Georgia, serif', color: '#0f172a', fontWeight: 600 }}>PilotRecognition</span>
                    </div>
                  </div>
                ) : (
                  // Standard card rendering
                  <>
                {/* Full Background Image - Support dual images with gradient fade */}
                {typeof pathway.image === 'object' && pathway.image.background ? (
                  <div className="absolute inset-0">
                    {/* Background building image */}
                    <img
                      src={pathway.image.background}
                      alt={pathway.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Gradient overlay for fade effect */}
                    <div 
                      className="absolute inset-0" 
                      style={{ 
                        background: isDarkMode 
                          ? 'linear-gradient(135deg, rgba(2, 6, 23, 0.4) 0%, rgba(15, 23, 42, 0.2) 40%, rgba(15, 23, 42, 0.1) 100%)' 
                          : 'linear-gradient(135deg, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.15) 40%, rgba(15, 23, 42, 0.05) 100%)'
                      }} 
                    />
                    {/* Logo overlay with gradient mask - centered in left half */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-48 h-32"
                      style={{
                        left: '25%',
                        transform: 'translateX(-50%) translateY(-50%)',
                        maskImage: 'linear-gradient(to right, black 0%, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 0%, black 60%, transparent 100%)'
                      }}
                    >
                      <img
                        src={pathway.image.logo}
                        alt={`${pathway.company} logo`}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    src={typeof pathway.image === 'string' ? pathway.image : pathway.image?.background}
                    alt={pathway.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                      pathway.title === 'Cathay Pacific Cadet Pilot Programme' 
                        ? 'blur-[3px] group-hover:blur-[3px] group-hover:scale-110' 
                        : 'group-hover:scale-105'
                    }`}
                  />
                )}
                
                {/* Dark Tint Overlay for text readability - with hover blur */}
                <div className="absolute inset-0 bg-black/50 z-[5] transition-all duration-500 group-hover:blur-[1px] pointer-events-none" />
                
                {/* Match Badge on Image */}
                <div className="absolute top-5 right-6 z-10">
                  <MatchBadgeOrNA percentage={pathway.matchPercentage} profile={profile} isDarkMode={isDarkMode} />
                </div>

                {/* Closed Program Badge */}
                {(pathway.id === 'disc-comm-2' || pathway.id === 'disc-comm-jetstar') && (
                  <div className="absolute top-5 left-6 z-10">
                    <span 
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full"
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: '#ffffff',
                        border: '1px solid rgba(239, 68, 68, 1)',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                      }}
                    >
                      Currently Closed
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full z-10">
                  {/* Company Badge */}
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-wider font-medium text-blue-300">
                      {categoryId.toUpperCase()} — {pathway.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {pathway.title}
                  </h3>
                  
                  {/* Company Name */}
                  <p className="text-lg text-gray-200 mb-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {pathway.company}
                  </p>

                  {/* Location & Salary */}
                  <div className="flex items-center gap-6 mb-6">
                    <span className="flex items-center gap-2 text-sm text-gray-300">
                      <Icons.MapPin className="w-4 h-4" /> {pathway.location}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-300">
                      <Icons.DollarSign className="w-4 h-4" /> {pathway.salary}
                    </span>
                  </div>

                  {/* Discover Pathway Button */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onNavigateToPathway) {
                          onNavigateToPathway(categoryId);
                        }
                      }}
                      className="px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 group/btn"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{categoryId === 'cargo' ? 'Discover Expectations' : 'Discover Pathway'}</span>
                      <Icons.ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    {/* Tags */}
                    <div className="flex gap-2">
                      {pathway.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs rounded-full backdrop-blur"
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
                )}
              </div>
            ))}
            
            {/* End Card - Duplicate of PilotRecognition Intro Card for proper centering */}
            <div
              className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group relative"
              style={{
                width: '600px',
                height: '420px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(148, 163, 184, 0.3)',
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white">
                {/* PilotRecognition Logo */}
                <div className="mb-5 flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="PilotRecognition Logo"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                
                {/* Georgia Font Header */}
                <h2 style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  color: '#0f172a',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  {categoryId === 'private' ? 'Pathways to Type Rating Pathways' : 'Pathways to Partnered Cadet Programs'}
                </h2>
                
                {/* Description Text */}
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#475569',
                  textAlign: 'center'
                }}>
                  Direct entry pathways for foundation program completion
                </p>
                
                {/* PilotRecognition Branding */}
                <div className="mt-8 flex items-center gap-2">
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Powered by</span>
                  <span style={{ fontFamily: 'Georgia, serif', color: '#0f172a', fontWeight: 600 }}>PilotRecognition</span>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Left Fade Overlay - narrower edge fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10"
            style={{ background: isDarkMode ? 'linear-gradient(to right, rgba(11, 15, 25, 0.9) 0%, transparent 100%)' : 'linear-gradient(to right, rgba(248, 250, 252, 0.9) 0%, transparent 100%)' }} />

          {/* Right Fade Overlay - prominent edge fade */}
          <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-10"
            style={{ background: isDarkMode ? 'linear-gradient(to left, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.7) 40%, transparent 100%)' : 'linear-gradient(to left, rgba(248, 250, 252, 0.95) 0%, rgba(248, 250, 252, 0.7) 40%, transparent 100%)' }} />
        </div>

        {/* Dynamic Selected Pathway Header - Floating Centered Text with Navigation */}
        <div className="mt-8 mb-6 px-4">
          <div className="text-center relative flex items-center justify-center gap-4">
            {/* Left Arrow - hidden when at first card */}
            {displayIndex > 0 && (
              <button
                onClick={() => navigateCard('prev')}
                className="p-3 rounded-full transition-all hover:scale-110"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(148, 163, 184, 0.3)'}`,
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.color = isDarkMode ? '#60a5fa' : '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.color = isDarkMode ? '#94a3b8' : '#64748b';
                }}
              >
                <Icons.ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {/* Spacer for layout consistency when left arrow is hidden */}
            {displayIndex === 0 && <div className="w-12 h-12" />}

            <div className="relative">
              {/* Badge and Type Row */}
              <div className="relative h-8 mb-3 flex items-center justify-center gap-3">
              {/* Pathway 0 */}
              <div 
                className="absolute inset-0 flex items-center justify-center gap-3 transition-all duration-500"
                style={{
                  opacity: displayIndex === 0 ? 1 : 0,
                  transform: `translateY(${displayIndex === 0 ? 0 : 15}px)`,
                }}
              >
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full" style={{
                  backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                  color: isDarkMode ? '#60a5fa' : '#2563eb',
                  border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                }}>
                  {categoryId.toUpperCase()} PATHWAY
                </span>
                <span className="text-sm" style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                  {pathways[0]?.type || 'Training Program'}
                </span>
              </div>

              {pathways.length > 1 && (
                <div 
                  className="absolute inset-0 flex items-center justify-center gap-3 transition-all duration-500"
                  style={{
                    opacity: displayIndex === 1 ? 1 : 0,
                    transform: `translateY(${displayIndex === 1 ? 0 : 15}px)`,
                  }}
                >
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full" style={{
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    color: isDarkMode ? '#60a5fa' : '#2563eb',
                    border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                  }}>
                    {categoryId.toUpperCase()} PATHWAY
                  </span>
                  <span className="text-sm" style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                    {pathways[1]?.type || 'Training Program'}
                  </span>
                </div>
              )}

              {pathways.length > 2 && (
                <div 
                  className="absolute inset-0 flex items-center justify-center gap-3 transition-all duration-500"
                  style={{
                    opacity: displayIndex >= 2 ? 1 : 0,
                    transform: `translateY(${displayIndex >= 2 ? 0 : 15}px)`,
                  }}
                >
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full" style={{
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    color: isDarkMode ? '#60a5fa' : '#2563eb',
                    border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                  }}>
                    {categoryId.toUpperCase()} PATHWAY
                  </span>
                  <span className="text-sm" style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                    {pathways[displayIndex]?.type || 'Training Program'}
                  </span>
                </div>
              )}
            </div>

            {/* Title - Dynamic based on selected card */}
            <div className="mb-2">
              <RollingHeader 
                items={pathways.map(p => ({ title: p.title, subtitle: p.company }))}
                isDarkMode={isDarkMode}
                currentIndex={displayIndex}
              />
            </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => navigateCard('next')}
              className="p-3 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(148, 163, 184, 0.3)'}`,
                color: isDarkMode ? '#94a3b8' : '#64748b',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.color = isDarkMode ? '#60a5fa' : '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.color = isDarkMode ? '#94a3b8' : '#64748b';
              }}
            >
              <Icons.ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Discovery Component Description & Matched Jobs */}
        <div className="mt-8 px-4 text-center">
          {/* Discover Pathway Button - Always visible when not on intro card */}
          {activeIndex > 0 && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => {
                  // Scroll to the description section instead of navigating away
                  const descriptionSection = document.getElementById('pathway-description');
                  if (descriptionSection) {
                    descriptionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="px-10 py-4 rounded-full text-base font-semibold transition-all flex items-center gap-3 group/btn"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(59, 130, 246, 0.4)'}`,
                  color: isDarkMode ? '#ffffff' : '#2563eb',
                  boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(59, 130, 246, 0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>{categoryId === 'cargo' ? 'Discover Expectations' : 'Discover Pathway'}</span>
                <Icons.ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Discover Pathway Link - Always visible when not on intro card */}
          {activeIndex > 0 && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => {
                  // Scroll to the description section instead of navigating away
                  const descriptionSection = document.getElementById('pathway-description');
                  if (descriptionSection) {
                    descriptionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="text-sm font-medium flex items-center gap-1.5 transition-colors hover:opacity-80"
                style={{
                  color: isDarkMode ? '#60a5fa' : '#2563eb',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                Read full description <Icons.ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Description Text - Dynamic based on active card with blur fade */}
          <div id="pathway-description" className="text-center mb-6 max-w-5xl mx-auto relative scroll-mt-8">
            {displayIndex === 0 ? (
              // PilotRecognition Intro Card description
              <>
                <p className="text-lg md:text-xl leading-relaxed mb-4" style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                  Welcome to PilotRecognition's partnered pathway programs. As a foundation program graduate, you have exclusive access 
                  to direct entry opportunities with leading airlines and training organizations worldwide. These partnerships 
                  provide streamlined career progression, from cadet programs to first officer positions, with recognized 
                  credentials and industry support.
                </p>
                <p className="text-base md:text-lg" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Swipe through to discover specific programs, entry requirements, and how your foundation training 
                  qualifies you for accelerated career pathways in commercial, private, and cargo aviation sectors.
                </p>
              </>
            ) : (
              // Dynamic description based on active pathway
              <>
                <p className="text-lg md:text-xl leading-relaxed mb-4" style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                  {pathways[displayIndex]?.id === 'disc-comm-1' ? (
                    // Envoy Air specific description
                    <>The <strong>Envoy Cadet Program</strong> provides a direct career path to <strong>American Airlines</strong>, the world's largest airline. As an Envoy Cadet, you'll receive mentorship from professional pilots, up to <strong>$15,000 in bonuses</strong>, and guaranteed First Officer placement. Once you reach ATP minimums, Envoy pays for your ATP/CTP course with hotel and transportation included—then places you directly into the next new hire class with no additional interview required.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-2' ? (
                    // Air Cambodia specific description
                    <><strong>Note: Cadet Programme currently closed.</strong> Join <strong>Air Cambodia</strong>, the national flag carrier of Cambodia, as they expand their fleet with COMAC C909 aircraft. Currently hiring experienced COMAC C909 Captains and First Officers only. The airline offers competitive market salaries, a high-stakes rewarding environment, and professional development in safety and crisis management. Check back for cadet program openings or contact recruitment: 071-66 000 36.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-3' ? (
                    // Cathay Pacific specific description
                    <>The <strong>Cathay Cadet Pilot Programme</strong> is an ~80 week sponsored training program where Second Officers are trained to become future captains. You'll receive <strong>fully sponsored training</strong> to obtain your Commercial Pilot License with ground school in Hong Kong and flight training at world-renowned facilities in the <strong>United States or Australia</strong>. Upon graduation, you'll join Cathay Pacific as a Second Officer operating regional, long-haul and ultra-long haul flights on the A350 and B777 fleet.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-4' ? (
                    // FlyDubai specific description
                    <>The <strong>flydubai Ab Initio Pilot Training Programme</strong> is a <strong>Multi-Pilot License (MPL)</strong> programme launched in partnership with international overseas flight training partners. Open to candidates <strong>17+ years old</strong> with a high school diploma, this programme provides all necessary training to become a commercial airline pilot. Cadets train at the flydubai Flight Training centre and qualify as <strong>Boeing 737 pilots</strong>. With 125+ Boeing 737 MAX and 30 Boeing 787s on order, flydubai offers a unique opportunity to join a growing airline serving 130+ destinations.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-6' ? (
                    // Ryanair specific description
                    <>The <strong>Ryanair Future Flyer Academy</strong> offers a <strong>part-sponsored</strong> pathway to becoming a Ryanair pilot with <strong>3 training routes</strong> (Gateway 0 Ab-Initio, Gateway 1 Modular, Gateway 2 APS MCC). You'll receive a <strong>conditional job offer upon enrolment</strong> and guaranteed final assessment. Training is completed in <strong>16+ months</strong> at approved partner schools across Europe (Ireland, UK, France, Italy, Poland). Ryanair offers the <strong>fastest time to Captaincy (within 4 years)</strong>, fixed 5 days on/4 days off rosters, and operates Europe's youngest Boeing 737 8200 Gamechanger fleet.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-airarabia' ? (
                    // Air Arabia specific description
                    <>The <strong>Air Arabia Academy</strong> offers <strong>MPL pilot training programs</strong> and ground operations training at their campus in <strong>Sharjah, UAE</strong>. As the training arm of Air Arabia, the academy provides cadets with the skills needed to join the airline's <strong>A320 fleet</strong> serving the <strong>GCC network</strong>. The academy features modern technical facilities, English Language Proficiency training, and is a <strong>GCAA approved examination centre</strong>. Cadets experience structured training with a clear pathway to employment with the region's leading low-cost carrier.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-jetstar' ? (
                    // Jetstar specific description
                    <><strong>Note: Cadet Programme currently closed.</strong> The <strong>Jetstar Cadet Pilot Programme</strong> is the only jet aircraft pilot cadetship offered in Australia. The program is delivered in partnership with <strong>Swinburne University of Technology and CAE Oxford Aviation Academy</strong> in Melbourne. Successful cadets obtain an <strong>Associate Degree of Aviation</strong> and Private/Commercial Pilot Licences, leading to First Officer positions on the <strong>A320</strong> or Second Officer on the <strong>Boeing 787 Dreamliner</strong>. The previous program (2010-2014) produced 168 qualified pilots. Check Jetstar careers page for future intakes.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-cebu' ? (
                    // Cebu Pacific specific description
                    <>The <strong>Cebu Pacific Cadet Pilot Program</strong> is a <strong>96-week program</strong> (as of 2024) in partnership with <strong>Airworks Aviation</strong>—the only airline cadet program in the Philippines. The program includes a 4-week Aviation Foundation Course in Manila, <strong>68 weeks of Basic Flight Training</strong> at Airworks Aviation Academy in Cebu, and 24 weeks of Airline Integration Training. Cadets receive <strong>guaranteed employment</strong> with Cebu Pacific upon completion. BPI loan financing is available for the self-funded program. No age limit applies for applicants.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-skywest' ? (
                    // SkyWest specific description
                    <>The <strong>SkyWest Pilot Pathway Program</strong> provides a direct path to becoming a professional pilot with <strong>enhanced seniority</strong>—up to 2 years of company seniority activates immediately as a cadet, applying to health benefits, profit sharing, PTO, and 401(k) matching. Cadets receive a <strong>guaranteed interview</strong> for a First Officer position, <strong>seniority at ground school</strong>, free <strong>LogTen Pro electronic logbook</strong> access, and mentorship from SkyWest pilots. The program partners with <strong>United, Delta, Alaska, and American Airlines</strong>. Requires PPL, instrument, and commercial ratings to join.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-jetblue' ? (
                    // JetBlue Gateway specific description
                    <>The <strong>JetBlue Gateway Select</strong> is an innovative <strong>3-4 year competency-based</strong> pathway to becoming a JetBlue pilot. Training is delivered by CAE in <strong>Phoenix, Arizona</strong> and includes Foundation Course, Primary Training (Private through Commercial Multi-Engine), Airline Preparation at <strong>JetBlue University</strong>, and CFI/CFII Instructor Training with employment as a CAE Flight Instructor. The program costs approximately <strong>$110,000</strong> with installment options and financial assistance available. Graduates become JetBlue First Officers after meeting the 1,500 flight-hour requirement.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-emirates-cadet' ? (
                    // Emirates Cadet specific description
                    <>The <strong>Emirates National Cadet Pilot Programme</strong> is a comprehensive pathway for <strong>UAE Nationals</strong> to become world-class pilots flying to over 140 destinations. Training at the <strong>Emirates Flight Training Academy (EFTA)</strong> includes 12 months Ground School, 12 months Flight Training, 3 months at Emirates Training College, and 8 months Line Training. Cadets receive <strong>meals and accommodation</strong> at EFTA, with salary progression from AED 6,365 to AED 52,105 as a First Officer. Requirements: 18-26 years old, IELTS 6.0, minimum 80% high school score.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-easyjet' ? (
                    // easyJet specific description
                    <>The <strong>Generation easyJet Pilot Training Programme</strong> is a <strong>Multi-Crew Pilot Licence (MPL)</strong> course delivered in partnership with <strong>CAE</strong>. Training begins with <strong>28 weeks of flight training in Phoenix, Arizona</strong>—chosen for its ideal weather conditions—followed by airline-specific training. The competency-based program includes CAE's unique <strong>Fleet Standards Assurance</strong> and provides easyJet standard operating procedures from day one. Upon graduation, cadets have an <strong>A320 Type Rating</strong> and become qualified Co-Pilots with easyJet. <strong>No upper age limit</strong>—minimum 18 at course start.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-wizzair' ? (
                    // Wizz Air specific description
                    <>The <strong>Wizz Air Pilot Academy</strong> offers training <strong>from zero to First Officer</strong> with <strong>no prior flying experience needed</strong>. Delivered at <strong>Trener Flight Academy (Hungary)</strong> and <strong>Egnatia Aviation (Greece)</strong>, the program provides a career opportunity at <strong>Europe's fastest growing airline</strong> with affordable payment terms. Continuous airline monitoring and high-quality training ensure cadets are prepared for the A321neo fleet. Open to residents of: Albania, Armenia, Bosnia and Herzegovina, Bulgaria, Cyprus, Georgia, Hungary, North Macedonia, Poland, Romania, Serbia. Must be <strong>18+ years old</strong>, able to swim 50m, and have strong English skills.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-airindia' ? (
                    // Air India specific description
                    <>The <strong>Air India Cadet Pilot Programme</strong> (FlyHIGH) launched in 2024 as part of Air India's transformation under the <strong>Tata Group</strong>. Cadets complete <strong>DGCA theory coaching and exams in India</strong>, then train at <strong>AeroGuard in Phoenix, Arizona</strong>—graduating with <strong>FAA CPLME and Instrument Rating</strong>. The 12-15 month program includes <strong>travel, accommodation, and immigration processing</strong>, followed by DGCA license conversion and type rating in India. Training includes mentorship from Air India pilots, industry-leading instructors, and the latest aviation technology. Open to <strong>Indian citizens aged 18-30</strong> with passing grades in English, Mathematics, and Physics.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-spicejet' ? (
                    // SpiceJet specific description
                    <>The <strong>SpiceJet Cadet Pilot Programme</strong> at <strong>Spice Star Academy</strong> offers a perfect launchpad for aspiring pilots with <strong>assured employment at SpiceJet</strong> upon completion. With <strong>200 aircraft on order</strong> and massive expansion plans under India's Regional Connectivity Scheme, SpiceJet is creating ample opportunities. The program includes training at world-class schools with 3 phases: Ground School for DGCA CPL, Flying Training, and Aircraft Type Rating. Dual degree options available: <strong>Cadet Programme + BBA</strong> or <strong>Cadet Programme + MBA</strong>. Open to <strong>Indian Nationals and OCI holders aged 17-35</strong> with minimum 158cm height.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-royalbrunei' ? (
                    // Royal Brunei specific description
                    <>The <strong>Royal Brunei Airlines Cadet Pilot Programme</strong> is the national carrier's training scheme for aspiring pilots. Open exclusively to <strong>citizens of Brunei Darussalam</strong> who are single and aged <strong>18-26 years</strong>. The program includes flight training in the <strong>United Kingdom and France</strong>, leading to a career with the flag carrier of the "Abode of Peace." Requirements include minimum height of 157.5cm, BMI under 35, EASA GBR (UK) Medical, and strong English and Bahasa Melayu skills. Academic prerequisites: 3 GCE/GCSE "A" levels (Grade B) in English, Mathematics, and Physics.</>
                  ) : pathways[displayIndex]?.id === 'disc-comm-philippine' ? (
                    // Philippine Airlines specific description
                    <>The <strong>Philippine Airlines Cadet Pilot Programme</strong> (AO Class) is offered through the <strong>PAL Aviation School</strong>, founded in 1960 and relaunched in 2025 in partnership with <strong>Australia's Airways Aviation</strong>. The 18-month course includes Philippine-based foundation training followed by hands-on flight instruction in <strong>Australia</strong>. Training includes Ground School, Flying Training (Cessna 172R, Piper Seminole), and A320 Type Rating. Cost is approximately <strong>P4.5 million</strong> covering training, meals, and lodging. Designed for pilot trainees destined for employment with the flag carrier of the Philippines.</>
                  ) : pathways[displayIndex]?.id === 'disc-priv-cae-philippines' ? (
                    // CAE Philippines specific description
                    <><strong>CAE Philippines</strong> (formerly PAAT) is a joint venture between <strong>Cebu Pacific Air and CAE</strong>, located in <strong>Clark Freeport Zone, Pampanga</strong>. The training center features four <strong>CAE-built Level D Full Flight Simulators</strong>—three Airbus A320 FFS and one ATR 72-600 FFS. The facility offers <strong>A320, A320 NEO, and ATR 72-600 pilot training</strong> to Cebu Pacific Air and other operators in the region. As a <strong>EASA/CAAP approved</strong> training center, it provides type rating courses with state-of-the-art CAE7000XR Series simulators and modern training methodologies.</>
                  ) : pathways[displayIndex]?.id === 'disc-pvt-empire' ? (
                    // Empire Aviation specific description
                    <><strong>Empire Aviation Group</strong> is an award-winning <strong>one-stop shop for integrated business aviation solutions</strong> established in <strong>Dubai, UAE in 2007</strong>. The company operates one of the <strong>largest managed fleets of business jets in the MENA region</strong> with global operations in UAE, Europe, India, Africa, and Indonesia. Services include <strong>aircraft sales, management, charter, and CAMO</strong>. Empire Aviation holds an <strong>Air Operator Certificate (AOC) from UAE GCAA (A6)</strong> and <strong>San Marino CAA (T7)</strong> certification. A team of 120+ skilled business aviation professionals provides world-class private aviation services.</>
                  ) : pathways[displayIndex]?.id === 'disc-pvt-execujet' ? (
                    // ExecuJet specific description
                    <><strong>ExecuJet Aviation Group</strong>, part of the <strong>Luxaviation Group</strong>, is a leading <strong>global business aviation services provider</strong> founded in <strong>Johannesburg in 1991</strong>. With a worldwide network of <strong>Fixed Base Operations (FBOs)</strong> across <strong>Africa, Middle East, Europe, Asia-Pacific, and The Americas</strong>, ExecuJet provides premium ground handling, aircraft management, and charter services. The Dubai FBO at <strong>Dubai International Airport</strong> has been voted <strong>best FBO in the UAE and Africa region</strong>. Safety is their first priority, with unwavering dedication to customer satisfaction and the highest standards of excellence.</>
                  ) : pathways[displayIndex]?.id === 'disc-pvt-netjets' ? (
                    // NetJets specific description
                    <><strong>NetJets</strong>, owned by <strong>Warren Buffett's Berkshire Hathaway</strong>, is the <strong>world's largest private aviation company</strong> offering fractional ownership and on-demand charter services. Headquartered in <strong>Columbus, Ohio</strong>, NetJets operates a diverse fleet including <strong>Cessna Citation, Bombardier Challenger, and Gulfstream G650</strong> aircraft. Pilots are <strong>home-based</strong> with 100+ crew bases across the lower 48 United States. Benefits include <strong>100% company-paid medical, vision, and dental insurance</strong> for pilots and family starting on hire date, with all <strong>PIC type ratings paid by the company</strong> at Flight Safety International.</>
                  ) : pathways[displayIndex]?.id === 'disc-pvt-flexjet' ? (
                    // Flexjet specific description
                    <><strong>Flexjet</strong> offers the <strong>highest-paid pilot opportunities in private aviation</strong> with first-year pilots earning up to <strong>$175,000</strong> plus a <strong>$5,000 productivity bonus</strong>. Pilots enjoy <strong>home-based scheduling</strong> with <strong>115+ domiciles</strong> across the US and Europe, plus the highest per diem in the industry at <strong>$42/day</strong>. The company provides a <strong>6% 401(k) match</strong> and up to <strong>18% annual retirement benefits</strong>. Flexjet's <strong>Red Label</strong> program offers dedicated crewing with superior pay for the most advanced aircraft. Pilots travel to aircraft at company expense during scheduled days only—no commuting on days off.</>
                  ) : pathways[displayIndex]?.id === 'disc-pvt-vistajet-silver' ? (
                    // VistaJet Silver Service Training specific description
                    <><strong>VistaJet</strong>, founded in 2004, is a leading <strong>global private aviation company</strong> with headquarters in <strong>Malta</strong> and offices in <strong>London, New York, Los Angeles, Hong Kong, and Dubai</strong>. The company operates a fleet of <strong>360+ Bombardier Global and Challenger business jets</strong>, flying to <strong>207 countries and 1,900 airports</strong>. The <strong>Silver Service Training</strong> program includes a <strong>15-day training course</strong> for Cabin Hosts featuring instruction from the <strong>British Butler Institute, MedAire, and Norland College</strong>. Training covers service excellence, fire-fighting, food safety and hygiene, WSET Level 2, and advanced plating with a top chef. Pilots train twice yearly in state-of-the-art simulators.</>
                  ) : pathways[displayIndex]?.id === 'disc-pvt-ejm' ? (
                    // Executive Jet Management specific description
                    <><strong>Executive Jet Management (EJM)</strong> is a <strong>Berkshire Hathaway company</strong> and part of the <strong>NetJets portfolio</strong>, founded in 1978 and joining NetJets in 1988. Based in <strong>Cincinnati, Ohio</strong>, EJM is the <strong>world's largest aircraft management and private jet charter company</strong>, facilitating seamless travel for aircraft Owners and charter customers across the <strong>U.S. and Europe</strong>. With a team of over <strong>1,000 passionate professionals</strong>, EJM offers Part 91 and Part 135 opportunities with unparalleled support, numerous crew bases, and comprehensive resources to let pilots focus on what they do best: flying.</>
                  ) : pathways[displayIndex]?.id === 'disc-pvt-jet-aviation' ? (
                    // Jet Aviation specific description
                    <><strong>Jet Aviation</strong>, a subsidiary of <strong>General Dynamics</strong> (Gulfstream's holding company), is a leading <strong>global business aviation services provider</strong> with a legacy spanning over <strong>half a century</strong>. With <strong>4,500+ employees across 80+ nationalities and 50+ locations worldwide</strong>, the company offers comprehensive services including <strong>FBO, maintenance, charter, and staffing</strong>. The <strong>Van Nuys, Los Angeles location</strong> offers <strong>Gulfstream G650</strong> charter operations under its US Part 135 air carrier certificate, providing VIP operations and global charter services with competitive compensation and benefits.</>
                  ) : pathways[displayIndex]?.id === 'disc-pvt-privateflite' ? (
                    // PrivateFlite Aviation specific description
                    <><strong>PrivateFlite Aviation</strong> is a <strong>customer-focused private aviation company</strong> based in <strong>Louisville, KY / Sellersburg, IN</strong>, operating with <strong>FAA Certification #3PVA645M</strong>. The company provides <strong>private jet charter, aircraft management, and air medical services</strong> with a diverse fleet including <strong>Bombardier Global 5000, Gulfstream G550/G650, Challenger 300/350, and Cessna Citation</strong> aircraft. Rooted in core values with a mission of <strong>"Providing the Ultimate Client Experience,"</strong> PrivateFlite serves business and leisure travelers with personalized, consultative charter services and state-of-the-art FBO facilities.</>
                  ) : pathways[displayIndex]?.id === 'disc-cargo-dhl' ? (
                    // DHL Aviation specific description
                    <><strong>DHL Aviation (EAT Leipzig)</strong> is a <strong>100% subsidiary of the DHL Group</strong> and part of <strong>DHL Express</strong>, operating as <strong>Germany's largest cargo airline</strong> at Leipzig/Halle Airport since 2008. European Air Transport Leipzig GmbH employs over <strong>1,000 aviation enthusiasts</strong> in aircraft maintenance and flight operations. The company operates a modern fleet including <strong>Airbus A330F</strong> freighters, serving as a key hub in DHL's global cargo network. Pilots benefit from working with a world-class logistics company known for precision, excellence in flight operations, and comprehensive support across all levels of the organization.</>
                  ) : pathways[displayIndex]?.id === 'disc-priv-cat' ? (
                    // CAT I | CAT II | CAT III specific description
                    <><strong>Critical Distinction:</strong> While a Type Rating gives you the legal "license" to fly a specific aircraft (like an A320 or ATR-72), <strong>CAT II/III Authorizations are the specific "keys"</strong> that allow you to land that aircraft in near-zero visibility. Most pilots mistakenly believe a Type Rating automatically includes these landing privileges. In reality, CAT ratings are <strong>advanced operational credits usually granted by an airline's training department</strong>. Before you invest, know that a private Type Rating may only certify you for standard (CAT I) weather, while CAT II/III requires specialized simulator checkrides and company-specific approval.</>
                  ) : (
                    // Generic description for other pathways
                    <>{pathways[displayIndex]?.title} with {pathways[displayIndex]?.company} offers a comprehensive training pathway designed to advance your aviation career. This program provides structured learning, hands-on experience, and direct employment opportunities upon successful completion.</>
                  )}
                </p>
                <p className="text-base md:text-lg" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  {pathways[displayIndex]?.salary} — Located in {pathways[displayIndex]?.location}. 
                  Requirements include: {pathways[displayIndex]?.requirements.slice(0, 3).join(', ')}. 
                  Explore detailed program benefits, application timelines, and career progression opportunities.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Airline Expectations Cards - Shows airline expectation cards with Discover Expectations button
const AirlineExpectationsCards: React.FC<{ 
  isDarkMode?: boolean; 
  profile: UserProfileData | null;
}> = ({ isDarkMode = true, profile }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current || !containerRef.current) return;
    const cardWidth = 1016;
    const gap = 24;
    const itemWidth = cardWidth + gap;
    const currentTransform = trackRef.current.style.transform;
    const currentOffset = currentTransform ? parseInt(currentTransform.replace(/[^\d-]/g, '')) || 0 : 0;
    const newOffset = direction === 'left' 
      ? Math.max(0, currentOffset - itemWidth)
      : currentOffset + itemWidth;
    trackRef.current.style.transform = `translateX(-${newOffset}px)`;
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 20);
    }
  };

  if (AIRLINE_EXPECTATIONS.length === 0) return null;

  return (
    <section className="py-8 px-4 relative" style={{ backgroundColor: isDarkMode ? 'transparent' : 'transparent' }}>
      <div className="w-full">
        {/* Section Header - Left Aligned */}
        <div className="mb-8 text-left px-4">
          <h2 style={{ fontFamily: 'Georgia, serif', margin: '0 0 0.5rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, color: isDarkMode ? '#f8fafc' : '#0f172a', letterSpacing: '-0.02em' }}>
            Airline Expectations
          </h2>
          <p style={{ margin: '0', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '600px' }}>
            Learn about expectations, requirements, and career paths from major airlines around the world
          </p>
          
          {/* News Headlines Strip - Below header description */}
          <div className="mt-4 py-2 px-3 rounded-lg inline-flex items-center gap-3" style={{ 
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`
          }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ 
              color: '#94a3b8',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.15)'
            }}>
              Airline Expectations Update
            </span>
            <span className="text-xs" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Latest opportunities and industry news
            </span>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-end gap-2 mb-4">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full transition-colors"
              style={{
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
                color: isDarkMode ? '#cbd5e1' : '#475569'
              }}
            >
              <Icons.ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full transition-colors"
            style={{
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
              color: isDarkMode ? '#cbd5e1' : '#475569'
            }}
          >
            <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Swipe instruction */}
        <div className="mb-3 flex justify-center">
          <span className="text-xs tracking-wider" style={{ 
            color: isDarkMode ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)',
            fontStyle: 'italic'
          }}>
            Swipe left & right to discover airline expectations
          </span>
        </div>

        {/* Airline Cards Container */}
        <div ref={containerRef} className="relative overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              overscrollBehaviorX: 'none',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x pinch-zoom'
            }}
          >
            {/* Track - animated */}
            <div ref={trackRef} className="flex gap-6 flex-shrink-0">
              {AIRLINE_EXPECTATIONS.map((airline) => (
                <div
                  key={airline.id}
                  className="flex-shrink-0 w-[1000px] h-[420px] rounded-2xl overflow-hidden cursor-pointer group relative"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
                  }}
                >
                  {/* Full Background Image */}
                  <img
                    src={airline.image}
                    alt={airline.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Dark Tint Overlay for text readability */}
                  <div className="absolute inset-0 bg-black/50 z-[5] transition-all duration-500 group-hover:blur-[1px]" />
                  
                  {/* Match Badge on Image */}
                  <div className="absolute top-5 right-6 z-10">
                    <MatchBadgeOrNA percentage={airline.matchPercentage} profile={profile} isDarkMode={isDarkMode} />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full z-10">
                    {/* Airline Type Badge */}
                    <div className="mb-4">
                      <span className="text-xs uppercase tracking-wider font-medium text-white/80">
                        AIRLINE — {airline.type.toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {airline.title}
                    </h3>
                    
                    {/* Location */}
                    <p className="text-lg text-gray-200 mb-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {airline.location}
                    </p>

                    {/* Salary & Key Requirements */}
                    <div className="flex items-center gap-6 mb-6">
                      <span className="flex items-center gap-2 text-sm text-gray-300">
                        <Icons.DollarSign className="w-4 h-4" /> {airline.salary}
                      </span>
                      <span className="flex items-center gap-2 text-sm text-gray-300">
                        <Icons.Briefcase className="w-4 h-4" /> {airline.requirements[0]}
                      </span>
                    </div>

                    {/* Discover Expectations Button & Tags */}
                    <div className="flex items-center justify-between">
                      <button
                        className="px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center gap-2 group/btn"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: '#f1f5f9',
                        }}
                      >
                        <span>Discover Expectations</span>
                        <Icons.ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      {/* Tags */}
                      <div className="flex gap-2">
                        {airline.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs rounded-full backdrop-blur"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.15)',
                              color: '#e2e8f0',
                              border: '1px solid rgba(255, 255, 255, 0.25)'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left Fade Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10"
            style={{ background: isDarkMode ? 'linear-gradient(to right, rgba(11, 15, 25, 0.9) 0%, transparent 100%)' : 'linear-gradient(to right, rgba(248, 250, 252, 0.9) 0%, transparent 100%)' }} />

          {/* Right Fade Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-10"
            style={{ background: isDarkMode ? 'linear-gradient(to left, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.7) 40%, transparent 100%)' : 'linear-gradient(to left, rgba(248, 250, 252, 0.95) 0%, rgba(248, 250, 252, 0.7) 40%, transparent 100%)' }} />
        </div>

        {/* Discovery Component Description & Matched Jobs */}
        <div className="mt-12 px-4 text-center">
          {/* Description Text - Article Block Style */}
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed mb-4" style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
              Explore detailed expectations, requirements, and career progression opportunities from leading airlines worldwide. 
              Each airline profile provides insights into salary ranges, required flight hours, type ratings, and unique benefits 
              to help you make informed career decisions.
            </p>
            <p className="text-base md:text-lg" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Swipe through to discover airline-specific requirements and compare opportunities across global carriers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Recommended Section - Glassy strip style matching Discover Pathway button
const RecommendedSection: React.FC<{ 
  profile: UserProfileData | null; 
  isDarkMode?: boolean;
}> = ({ profile, isDarkMode = true }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Combine all jobs from all categories
  const allJobs = [
    ...CATEGORY_LIVE_JOBS.commercial || [],
    ...CATEGORY_LIVE_JOBS.private || [],
    ...CATEGORY_LIVE_JOBS.cargo || [],
    ...CATEGORY_JOBS.commercial || [],
    ...CATEGORY_JOBS.private || [],
    ...CATEGORY_JOBS.cargo || []
  ];
  
  // Calculate match score for each job based on profile
  const getMatchScore = (job: PathwayJob): number => {
    if (!profile) return job.matchPercentage;
    
    let score = job.matchPercentage;
    
    // Boost score if profile matches job requirements
    if (profile.total_hours && profile.total_hours > 1000) {
      const hourReq = job.requirements.find(r => r.includes('hrs') || r.includes('hours'));
      if (hourReq) {
        const requiredHours = parseInt(hourReq.replace(/\D/g, ''));
        if (profile.total_hours >= requiredHours) {
          score += 5;
        }
      }
    }
    
    return Math.min(score, 100);
  };
  
  // Sort by match score - show only 4 cards
  const recommendedJobs = allJobs
    .map(job => ({ ...job, calculatedMatch: getMatchScore(job) }))
    .sort((a, b) => b.calculatedMatch - a.calculatedMatch)
    .slice(0, 4);
  
  if (recommendedJobs.length === 0) return null;

  return (
    <section className="py-4 px-4" style={{ backgroundColor: 'transparent' }}>
      <div className="w-full max-w-6xl mx-auto">
        {/* Glassy Strip Container */}
        <div 
          className="rounded-2xl p-4 flex items-center gap-4 overflow-x-auto scrollbar-hide"
          style={{
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
            boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          {/* Header - Compact */}
          <div className="flex-shrink-0 flex items-center gap-3 pr-4 border-r" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(148,163,184,0.2)' }}>
            <div className="p-2 rounded-lg" style={{ 
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
              color: isDarkMode ? '#60a5fa' : '#2563eb'
            }}>
              <Icons.Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>
                Recommended
              </h2>
              <p className="text-xs" style={{ color: isDarkMode ? '#64748b' : '#64748b' }}>
                {recommendedJobs.length} matches
              </p>
            </div>
          </div>

          {/* Horizontal Strip of Compact Cards */}
          <div
            ref={scrollRef}
            className="flex gap-3 flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recommendedJobs.map((job) => (
            <div
              key={job.id}
              className="flex-shrink-0 p-3 rounded-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(148, 163, 184, 0.15)'}`,
                minWidth: '200px',
                maxWidth: '240px'
              }}
            >
              {/* Compact Card Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ 
                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    color: isDarkMode ? '#60a5fa' : '#2563eb'
                  }}>
                    {job.company.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-xs leading-tight truncate" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>{job.title}</h3>
                    <p className="text-xs truncate" style={{ color: isDarkMode ? '#64748b' : '#64748b' }}>{job.company}</p>
                  </div>
                </div>
                <div className="px-1.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0" style={{ 
                  backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                  color: isDarkMode ? '#34d399' : '#059669'
                }}>
                  {job.calculatedMatch}%
                </div>
              </div>

              {/* Compact Info Row */}
              <div className="flex items-center gap-2 text-xs" style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                <span className="flex items-center gap-1">
                  <Icons.MapPin className="w-3 h-3" /> {job.location.split(',')[0]}
                </span>
                <span className="flex items-center gap-1">
                  <Icons.DollarSign className="w-3 h-3" /> {job.salary.split('/')[0].slice(0, 8)}
                </span>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// All Job Listings - Shows all jobs from all categories
const AllJobListings: React.FC<{ 
  isDarkMode?: boolean;
  profile: UserProfileData | null;
}> = ({ isDarkMode = true, profile }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Combine all jobs from all sources
  const allJobs = [
    ...CATEGORY_LIVE_JOBS.commercial || [],
    ...CATEGORY_LIVE_JOBS.private || [],
    ...CATEGORY_LIVE_JOBS.cargo || [],
    ...CATEGORY_JOBS.commercial || [],
    ...CATEGORY_JOBS.private || [],
    ...CATEGORY_JOBS.cargo || []
  ];
  
  // Remove duplicates by ID
  const uniqueJobs = allJobs.filter((job, index, self) => 
    index === self.findIndex((j) => j.id === job.id)
  );
  
  if (uniqueJobs.length === 0) return null;

  return (
    <section className="py-8 px-4" style={{ backgroundColor: isDarkMode ? 'transparent' : 'transparent' }}>
      <div className="w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.02em', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
              {title || 'All Job Listings'}
            </h2>
            <p style={{ margin: '0.5rem 0 0', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '500px' }}>
              Complete directory of all available positions
            </p>
          </div>
          <span className="px-3 py-1 text-sm rounded-full border" style={{ 
            backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: isDarkMode ? '#34d399' : '#059669',
            borderColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.2)'
          }}>
            {uniqueJobs.length} jobs
          </span>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {uniqueJobs.map((job) => (
            <div
              key={job.id}
              className="flex-shrink-0 w-[340px] p-4 rounded-2xl transition-all duration-300 cursor-pointer group"
              style={{
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(148, 163, 184, 0.15)'}`,
              }}
            >
              {/* Job Card Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold" style={{ 
                    backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
                    color: isDarkMode ? '#94a3b8' : '#475569'
                  }}>
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm leading-tight" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>{job.title}</h4>
                    <p className="text-xs" style={{ color: isDarkMode ? '#64748b' : '#64748b' }}>{job.company}</p>
                  </div>
                </div>
                <MatchBadgeOrNA percentage={job.matchPercentage} profile={profile} isDarkMode={isDarkMode} />
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)'
                }}>
                  <Icons.MapPin className="w-3 h-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ 
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)'
                }}>
                  <Icons.DollarSign className="w-3 h-3" /> {job.salary}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {job.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-full border"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: isDarkMode ? '#93c5fd' : '#2563eb',
                      borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Posted Time */}
              <div className="flex items-center gap-1.5 mt-2 pt-2" style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.2)'}` }}>
                <span className="text-xs" style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }}>{job.postedAt}</span>
                {job.isLive && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs" style={{
                    backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: isDarkMode ? '#34d399' : '#059669'
                  }}>
                    <LivePulsingDot /> Live
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoryRow: React.FC<{ section: CategorySection; index: number; isDarkMode?: boolean; profile: UserProfileData | null }> = ({ section, index, isDarkMode = true, profile }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  // Auto-scroll effect - Only enable if 3 or more cards
  const shouldAutoScroll = section.pathways.length >= 3;
  
  useEffect(() => {
    if (!shouldAutoScroll || !trackRef.current) return;
    
    const track = trackRef.current;
    const cardWidth = 340;
    const gap = 24;
    const itemWidth = cardWidth + gap;
    const originalWidth = itemWidth * section.pathways.length;
    
    // Calculate duration based on content width
    const duration = Math.max(20, originalWidth / 30);
    
    // Apply CSS animation for GPU-accelerated smooth scroll
    track.style.animation = `categoryCarouselScroll ${duration}s linear infinite`;
    track.style.willChange = 'transform';
    
    return () => {
      track.style.animation = '';
      track.style.willChange = '';
    };
  }, [section.pathways.length, shouldAutoScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current || !scrollRef.current) return;
    
    const cardWidth = 1016;
    const gap = 24;
    const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
    
    // Get current transform value
    const currentTransform = trackRef.current.style.transform;
    const currentOffset = currentTransform ? parseInt(currentTransform.replace(/[^\d-]/g, '')) || 0 : 0;
    const newOffset = Math.max(0, currentOffset + scrollAmount);
    
    // Cancel current animation and set new position
    if (animationRef.current) {
      animationRef.current.cancel();
    }
    
    // Apply new transform
    trackRef.current.style.transform = `translateX(-${newOffset}px)`;
    
    // Update hasReachedEnd if scrolling back from end
    if (direction === 'left' && hasReachedEnd) {
      setHasReachedEnd(false);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 20);
    }
  };

  return (
    <section className="py-8 px-4 relative" style={{ backgroundColor: isDarkMode ? 'transparent' : 'transparent' }}>
      <div className="w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="text-center">
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.02em', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>{section.title}</h2>
            <p style={{ margin: '0.5rem 0 0', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.6, fontSize: '0.95rem', maxWidth: '500px' }}>{section.description}</p>
          </div>
        </div>

        {/* Cards Container with Blur Reveal - Only auto-scroll if more than 3 cards */}
        <div className="relative overflow-hidden"
          onMouseEnter={() => shouldAutoScroll && trackRef.current?.style.setProperty('animation-play-state', 'paused')}
          onMouseLeave={() => shouldAutoScroll && trackRef.current?.style.setProperty('animation-play-state', 'running')}
        >
          <style>{`
            @keyframes categoryCarouselScroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Animated track */}
            <div ref={trackRef} className="flex gap-6 flex-shrink-0">
              {section.pathways.map((pathway, i) => (
                <div
                  key={pathway.id}
                  className="flex-shrink-0 w-[340px] group cursor-pointer"
                >
                {/* Thumbnail Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={pathway.image}
                    alt={pathway.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0" style={{ background: isDarkMode ? 'linear-gradient(to top, rgba(2, 6, 23, 0.8), transparent)' : 'linear-gradient(to top, rgba(15, 23, 42, 0.6), transparent)' }} />
                  
                  {/* Match Badge on Image */}
                  <div className="absolute top-2 right-2">
                    <MatchBadgeOrNA percentage={pathway.matchPercentage} profile={profile} isDarkMode={isDarkMode} />
                  </div>

                  {/* Company on Image */}
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 backdrop-blur text-xs rounded font-medium" style={{
                      backgroundColor: isDarkMode ? 'rgba(2, 6, 23, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                      color: isDarkMode ? '#e2e8f0' : '#0f172a'
                    }}>
                      {pathway.company}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-1">
                  <h3 className="font-semibold text-xs leading-tight mb-1" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>
                    {pathway.title}
                  </h3>
                  <p className="text-xs mb-2" style={{ color: isDarkMode ? '#64748b' : '#64748b' }}>{pathway.type}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {pathway.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          color: isDarkMode ? '#94a3b8' : '#64748b',
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate cards for seamless loop if more than 3 cards */}
            {shouldAutoScroll && section.pathways.map((pathway) => (
              <div
                key={`duplicate-${pathway.id}`}
                className="flex-shrink-0 w-[340px] group cursor-pointer"
              >
                {/* Thumbnail Image */}
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={pathway.image}
                    alt={pathway.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0" style={{ background: isDarkMode ? 'linear-gradient(to top, rgba(2, 6, 23, 0.8), transparent)' : 'linear-gradient(to top, rgba(15, 23, 42, 0.6), transparent)' }} />
                  
                  {/* Match Badge on Image */}
                  <div className="absolute top-2 right-2">
                    <MatchBadgeOrNA percentage={pathway.matchPercentage} profile={profile} isDarkMode={isDarkMode} />
                  </div>

                  {/* Company on Image */}
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 backdrop-blur text-xs rounded font-medium" style={{
                      backgroundColor: isDarkMode ? 'rgba(2, 6, 23, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                      color: isDarkMode ? '#e2e8f0' : '#0f172a'
                    }}>
                      {pathway.company}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-1">
                  <h3 className="font-semibold text-xs leading-tight mb-1" style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>
                    {pathway.title}
                  </h3>
                  <p className="text-xs mb-2" style={{ color: isDarkMode ? '#64748b' : '#64748b' }}>{pathway.type}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {pathway.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          color: isDarkMode ? '#94a3b8' : '#64748b',
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.1)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {/* Spacer for button positioning */}
            <div className="flex-shrink-0 w-64" />
          </div>
        </div>

        {/* Right Fade Overlay + Button */}
        <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none flex items-center justify-end pr-4"
          style={{ background: isDarkMode ? 'linear-gradient(to left, rgba(11, 15, 25, 0.9), rgba(11, 15, 25, 0.5), transparent)' : 'linear-gradient(to left, rgba(248, 250, 252, 0.9), rgba(248, 250, 252, 0.5), transparent)' }}>
          <button 
            className="pointer-events-auto px-5 py-3 rounded-full text-base font-medium transition-all duration-300 flex items-center gap-2 group"
            style={{
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(148, 163, 184, 0.3)'}`,
              color: isDarkMode ? '#f1f5f9' : '#0f172a',
              boxShadow: isDarkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <span>Discover More</span>
            <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

interface PathwaysPageProps {
  userProfile?: any;
  onBack?: () => void;
  onNavigateToPathway?: (categoryId: string) => void;
  isDarkMode?: boolean;
  initialCategory?: string;
}

export const PathwaysPage: React.FC<PathwaysPageProps> = ({ 
  userProfile, 
  onBack,
  onNavigateToPathway,
  isDarkMode = true,
  initialCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [activeFilters, setActiveFilters] = useState<string[]>(initialCategory ? [initialCategory] : ['all']);

  const toggleFilter = (filterId: string) => {
    if (filterId === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.includes(filterId)
        ? activeFilters.filter(f => f !== filterId)
        : [...activeFilters.filter(f => f !== 'all'), filterId];
      setActiveFilters(newFilters.length === 0 ? ['all'] : newFilters);
    }
  };

  const filteredSections = activeFilters.includes('all') 
    ? CATEGORY_SECTIONS 
    : CATEGORY_SECTIONS.filter(section => activeFilters.includes(section.id));

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setProfileLoading(false);
          return;
        }

        // Fetch from pilot_recognition_matches table
        const { data, error } = await supabase
          .from('pilot_recognition_matches')
          .select('total_hours, licenses, type_ratings, logged_hours, program_inputs')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }

        if (data) {
          setProfile({
            total_hours: data.total_hours,
            licenses: data.licenses,
            type_ratings: data.type_ratings,
            logged_hours: data.logged_hours,
            program_inputs: data.program_inputs
          });
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  try {
    return (
      <div style={{ 
        backgroundColor: isDarkMode ? '#0B0F19' : '#f8fafc', 
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        overflowX: 'hidden'
      }}>
        {/* Global Styles for Scrollbar Hiding */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Sticky Top Navigation Bar */}
        <nav style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          backgroundColor: isDarkMode ? 'rgba(11, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 100
        }}>
          {/* Left: Back Button */}
          <button 
            onClick={onBack}
            style={{
              padding: '8px 16px',
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              color: isDarkMode ? '#cbd5e1' : '#475569',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)'}`,
              borderRadius: '999px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Icons.ChevronLeft style={{ width: '14px', height: '14px' }} />
            Return to Platform
          </button>

          {/* Center: Logo */}
          <img 
            src="/logo.png" 
            alt="PilotRecognition" 
            style={{ 
              height: '36px', 
              width: 'auto',
              opacity: 0.9
            }} 
          />

          {/* Right: Pilot Recognition Status */}
          <div style={{
            padding: '6px 12px',
            backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)'}`,
            borderRadius: '8px',
            fontSize: '12px',
            color: isDarkMode ? '#94a3b8' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontWeight: 500 }}>Status:</span>
            <span style={{ 
              color: isProfileEmpty(profile) ? '#94a3b8' : (isDarkMode ? '#34d399' : '#059669'),
              fontWeight: 600 
            }}>
              {isProfileEmpty(profile) ? 'N/A' : 'Active'}
            </span>
          </div>
        </nav>

        {/* Header with Logo */}
        <header style={{ 
          textAlign: 'center', 
          padding: '40px 20px 30px',
          position: 'relative'
        }}>
          {/* Subtitle like dashboard */}
          <div style={{ 
            letterSpacing: '0.3em', 
            color: isDarkMode ? '#60a5fa' : '#2563eb', 
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            WINGMENTOR PATHWAYS
          </div>
          
          {/* Main Title - matching dashboard Georgia font */}
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 400,
            color: isDarkMode ? '#f8fafc' : '#0f172a',
            fontFamily: '"Georgia", serif',
            marginBottom: '20px',
            letterSpacing: '-0.02em'
          }}>
            Discover Pathways
          </h1>
          
          {/* Enhanced Description */}
          <p style={{ 
            color: isDarkMode ? '#94a3b8' : '#64748b', 
            fontSize: '18px', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Your comprehensive aviation career directory. Browse live job opportunities from leading airlines, 
            explore commercial and private sector pathways, and stay informed with real-time industry updates 
            tailored to your pilot profile and career aspirations.
          </p>
        </header>

        {/* Omni-Search Bar */}
        <OmniSearchBar value={searchQuery} onChange={setSearchQuery} isDarkMode={isDarkMode} />

        {/* Category Filter Buttons */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 30px',
          padding: '0 20px',
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxHeight: '80px',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => toggleFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: activeFilters.includes('all') 
                ? '#3b82f6' 
                : (isDarkMode ? '#1e293b' : '#f8fafc'),
              color: activeFilters.includes('all') 
                ? '#ffffff' 
                : (isDarkMode ? '#94a3b8' : '#64748b'),
              border: `1px solid ${activeFilters.includes('all') 
                ? '#3b82f6' 
                : (isDarkMode ? '#334155' : '#e2e8f0')}`,
              transition: 'all 0.2s ease'
            }}
          >
            All Categories
          </button>
          {CATEGORY_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => toggleFilter(section.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: activeFilters.includes(section.id) 
                  ? section.accentColor 
                  : (isDarkMode ? '#1e293b' : '#f8fafc'),
                color: activeFilters.includes(section.id) 
                  ? '#ffffff' 
                  : (isDarkMode ? '#94a3b8' : '#64748b'),
                border: `1px solid ${activeFilters.includes(section.id) 
                  ? section.accentColor 
                  : (isDarkMode ? '#334155' : '#e2e8f0')}`,
                transition: 'all 0.2s ease'
              }}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Location Filter */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 30px',
          padding: '0 20px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxHeight: '80px',
          overflow: 'hidden'
        }}>
          {['Europe', 'Asia', 'Africa', 'Middle East', 'Americas'].map((region) => (
            <button
              key={region}
              onClick={() => toggleFilter(region.toLowerCase().replace(' ', '-'))}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: activeFilters.includes(region.toLowerCase().replace(' ', '-')) 
                  ? '#8b5cf6' 
                  : (isDarkMode ? '#1e293b' : '#f8fafc'),
                color: activeFilters.includes(region.toLowerCase().replace(' ', '-')) 
                  ? '#ffffff' 
                  : (isDarkMode ? '#94a3b8' : '#64748b'),
                border: `1px solid ${activeFilters.includes(region.toLowerCase().replace(' ', '-')) 
                  ? '#8b5cf6' 
                  : (isDarkMode ? '#334155' : '#e2e8f0')}`,
                transition: 'all 0.2s ease'
              }}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Pilot Job Database Directory */}
        <section style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 40px',
          padding: '0 20px'
        }}>
          <div
            onClick={() => {
              // @ts-ignore
              if (window.handleViewChange) {
                // @ts-ignore
                window.handleViewChange('job-database');
              }
            }}
            style={{
              backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icons.Briefcase style={{ width: '24px', height: '24px', color: '#10b981' }} />
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '17px',
                  fontWeight: 600,
                  color: isDarkMode ? '#f8fafc' : '#0f172a'
                }}>
                  Pilot Job Database
                </h2>
                <p style={{
                  margin: '4px 0 0',
                  fontSize: '14px',
                  color: isDarkMode ? '#94a3b8' : '#64748b'
                }}>
                  Browse 120+ active pilot opportunities from global airlines and operators
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                borderRadius: '10px',
                color: isDarkMode ? '#60a5fa' : '#2563eb',
                fontSize: '14px',
                fontWeight: 500
              }}>
                <span>View Database</span>
                <Icons.ArrowRight style={{ width: '16px', height: '16px' }} />
              </div>
              <Icons.ChevronRight style={{ width: '20px', height: '20px', color: isDarkMode ? '#64748b' : '#94a3b8' }} />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main style={{ width: '100%' }}>
          {/* Category Sections */}
          {filteredSections.map((section, index) => (
            <React.Fragment key={section.id}>
              {/* 1. Discovery Cards - Training programs, cadet schemes, career pathways */}
              {section.id === 'cargo' ? (
                <AirlineExpectationsCards 
                  isDarkMode={isDarkMode}
                  profile={profile}
                />
              ) : (
                <DiscoveryCards 
                  categoryId={section.id}
                  isDarkMode={isDarkMode}
                  profile={profile}
                  onNavigateToPathway={onNavigateToPathway}
                />
              )}
            </React.Fragment>
          ))}
        </main>
      </div>
    );
  } catch (err: any) {
    console.error('PathwaysPage error:', err);
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0B0F19', 
        color: '#f8fafc',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#ef4444', marginBottom: '20px' }}>Error Loading Pathways</h1>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{err?.message || 'Unknown error'}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }
};

export default PathwaysPage;
