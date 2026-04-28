import React, { useState, useEffect } from 'react';

// Inline SVG icons (replacing lucide-react)
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

interface PathwayJob {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string;
  requirements: string[];
  tags: string[];
  matchPercentage?: number;
  image: string | { background: string; logo: string };
  description?: string;
}

interface CategorySection {
  id: string;
  title: string;
  description: string;
  accentColor: string;
  pathways: PathwayJob[];
}

interface DiscoverPathwayPageProps {
  categoryId: string;
  onBack: () => void;
  isDarkMode?: boolean;
}

// DISCOVERY_PATHWAYS data (subset for reference)
const DISCOVERY_PATHWAYS: Record<string, PathwayJob[]> = {
  'cadet-programme': [
    {
      id: 'disc-comm-1',
      title: 'Etihad Cadet Programme',
      company: 'Etihad Airways',
      type: 'Cadet Pilot Programme',
      location: 'Abu Dhabi, UAE',
      salary: 'AED 6,365 - 52,105',
      requirements: ['18-26 years old', 'IELTS 6.0', 'Min 80% high school score'],
      tags: ['Full Scholarship', 'Ab Initio', 'A320 Fleet'],
      matchPercentage: 85,
      image: { 
        background: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Etihad-airways-logo.svg/512px-Etihad-airways-logo.svg.png'
      }
    },
    {
      id: 'disc-comm-2',
      title: 'easyJet Generation Programme',
      company: 'easyJet',
      type: 'MPL Cadet Programme',
      location: 'UK & Europe',
      salary: '£35,000 - £95,000',
      requirements: ['18+ years', 'No upper age limit', 'CAE partnership'],
      tags: ['MPL Route', 'A320 Type', 'Europe'],
      matchPercentage: 78,
      image: { 
        background: 'https://images.unsplash.com/photo-1542296332-2e44a23b3ae9?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EasyJet_logo.svg/512px-EasyJet_logo.svg.png'
      }
    },
    {
      id: 'disc-comm-3',
      title: 'Wizz Air Pilot Academy',
      company: 'Wizz Air',
      type: 'Zero to Hero Program',
      location: 'Hungary & Greece',
      salary: 'Competitive + Bonus',
      requirements: ['18+ years', 'Swim 50m', 'Regional EU resident'],
      tags: ['A321neo Fleet', 'Fast Growing', 'Payment Terms'],
      matchPercentage: 72,
      image: { 
        background: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Wizz_Air_logo.svg/512px-Wizz_Air_logo.svg.png'
      }
    },
    {
      id: 'disc-comm-easyjet',
      title: 'Generation easyJet Programme',
      company: 'easyJet',
      type: 'MPL Training Course',
      location: 'Phoenix, AZ + Europe',
      salary: 'Market Leading',
      requirements: ['18+ at start', 'GCSE requirements', 'CAE partner'],
      tags: ['28 Weeks US', 'A320 Rating', 'Co-Pilot Ready'],
      matchPercentage: 80,
      image: { 
        background: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EasyJet_logo.svg/512px-EasyJet_logo.svg.png'
      }
    },
    {
      id: 'disc-comm-airindia',
      title: 'Air India FlyHIGH Programme',
      company: 'Air India',
      type: 'Cadet Pilot Programme',
      location: 'India & Phoenix, AZ',
      salary: 'India Market Scale',
      requirements: ['Indian citizen', '18-30 years', 'DGCA compliance'],
      tags: ['Tata Group', 'AeroGuard US', 'FAA CPLME'],
      matchPercentage: 75,
      image: { 
        background: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Air_India_Logo.svg/512px-Air_India_Logo.svg.png'
      }
    },
    {
      id: 'disc-comm-spicejet',
      title: 'SpiceJet Cadet Programme',
      company: 'SpiceJet',
      type: 'Cadet + BBA/MBA Combo',
      location: 'India (Multiple bases)',
      salary: 'Assured Employment',
      requirements: ['17-35 years', '158cm height', 'Indian/OCI'],
      tags: ['200 Aircraft Order', 'Dual Degree', 'Spice Star Academy'],
      matchPercentage: 70,
      image: { 
        background: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/SpiceJet_logo.svg/512px-SpiceJet_logo.svg.png'
      }
    },
    {
      id: 'disc-comm-royalbrunei',
      title: 'Royal Brunei Cadet Programme',
      company: 'Royal Brunei Airlines',
      type: 'National Cadet Scheme',
      location: 'Brunei Darussalam',
      salary: 'Government Sponsored',
      requirements: ['Brunei citizen', '18-26 years', 'Single status'],
      tags: ['National Carrier', 'UK/France Training', 'Full Sponsorship'],
      matchPercentage: 65,
      image: { 
        background: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ee/Royal_Brunei_Airlines_logo.svg/512px-Royal_Brunei_Airlines_logo.svg.png'
      }
    },
    {
      id: 'disc-comm-philippine',
      title: 'PAL Cadet Pilot Programme',
      company: 'Philippine Airlines',
      type: 'AO Class Training',
      location: 'Philippines + Australia',
      salary: 'P4.5M Program Cost',
      requirements: ['Filipino citizen', 'Pass medical', 'Funding ready'],
      tags: ['PAL Aviation School', 'Airways Aviation AU', 'A320 Type'],
      matchPercentage: 68,
      image: { 
        background: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Philippine_Airlines_logo.svg/512px-Philippine_Airlines_logo.svg.png'
      }
    },
    {
      id: 'disc-comm-jetstar',
      title: 'Jetstar Cadet Pilot Program',
      company: 'Jetstar Airways',
      type: 'Cadet Programme',
      location: 'Australia/Asia',
      salary: 'Competitive Package',
      requirements: ['Australian/PR', '18-35 years', 'Med Class 1'],
      tags: ['Low Cost Carrier', 'Asia Pacific', 'A320 Family'],
      matchPercentage: 0,
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'
    }
  ],
  'private': [
    {
      id: 'disc-pvt-empire',
      title: 'VIP Pilot Opportunities',
      company: 'Empire Aviation Group',
      type: 'Business Aviation',
      location: 'Dubai, UAE + Global',
      salary: 'AED 25,000 - 45,000',
      requirements: ['Type Rating preferred', 'Business Jet exp', 'VIP service'],
      tags: ['UAE AOC', 'MENA Leader', 'G550/G650'],
      matchPercentage: 82,
      image: { 
        background: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Empire_Aviation_Group_logo.svg/512px-Empire_Aviation_Group_logo.svg.png'
      }
    },
    {
      id: 'disc-pvt-execujet',
      title: 'Global Business Aviation',
      company: 'ExecuJet Aviation',
      type: 'Private Jet Operations',
      location: 'Global Network',
      salary: 'Location Dependent',
      requirements: ['Multi-type rated', 'Global ops exp', 'FBO exp'],
      tags: ['Luxaviation Group', '50+ Locations', 'Worldwide FBO'],
      matchPercentage: 75,
      image: { 
        background: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/ExecuJet_Logo.svg/512px-ExecuJet_Logo.svg.png'
      }
    },
    {
      id: 'disc-pvt-netjets',
      title: 'Fractional Ownership Pilot',
      company: 'NetJets',
      type: 'Part 135 Operations',
      location: 'US - 100+ Crew Bases',
      salary: '$85,000 - $180,000+',
      requirements: ['ATP license', 'Part 135 qual', 'Home based'],
      tags: ['Berkshire Hathaway', 'Citation/Gulfstream', '100% Benefits'],
      matchPercentage: 88,
      image: { 
        background: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/NetJets_logo.svg/512px-NetJets_logo.svg.png'
      }
    },
    {
      id: 'disc-pvt-flexjet',
      title: 'Premium Private Aviation',
      company: 'Flexjet',
      type: 'Red Label Program',
      location: 'US & Europe - 115+ Bases',
      salary: 'Up to $175,000 + Bonus',
      requirements: ['PIC Type Rating', 'Jet exp', 'Premium service'],
      tags: ['Red Label', '$42/day Per Diem', '18% Retirement'],
      matchPercentage: 85,
      image: { 
        background: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Flexjet_logo.svg/512px-Flexjet_logo.svg.png'
      }
    },
    {
      id: 'disc-pvt-vistajet-silver',
      title: 'Silver Service Cabin Crew',
      company: 'VistaJet',
      type: 'Cabin Host Program',
      location: 'Malta HQ + Global',
      salary: 'Premium Compensation',
      requirements: ['15-day training', 'Service excellence', 'Global travel'],
      tags: ['360+ Bombardier Fleet', 'British Butler Institute', '207 Countries'],
      matchPercentage: 72,
      image: { 
        background: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/VistaJet_logo.svg/512px-VistaJet_logo.svg.png'
      }
    },
    {
      id: 'disc-pvt-ejm',
      title: 'Aircraft Management Pilot',
      company: 'Executive Jet Management',
      type: 'Part 91/135 Operations',
      location: 'US & Europe',
      salary: 'Competitive + Benefits',
      requirements: ['Part 135 exp', 'Management ops', 'Customer focused'],
      tags: ['Berkshire Hathaway', '1978 Legacy', '1,000+ Staff'],
      matchPercentage: 78,
      image: { 
        background: 'https://images.unsplash.com/photo-1542296332-2e44a23b3ae9?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/NetJets_logo.svg/512px-NetJets_logo.svg.png'
      }
    },
    {
      id: 'disc-pvt-jet-aviation',
      title: 'Gulfstream Operations',
      company: 'Jet Aviation',
      type: 'VIP Charter & FBO',
      location: 'Van Nuys, Los Angeles',
      salary: 'CA Market Rate',
      requirements: ['G650 exp', 'Part 135', 'VIP ops'],
      tags: ['General Dynamics', 'G650 Fleet', 'Global Charter'],
      matchPercentage: 70,
      image: { 
        background: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Jet_Aviation_logo.svg/512px-Jet_Aviation_logo.svg.png'
      }
    },
    {
      id: 'disc-pvt-privateflite',
      title: 'Private Charter Specialist',
      company: 'PrivateFlite Aviation',
      type: 'Charter & Management',
      location: 'Louisville, KY / Sellersburg, IN',
      salary: 'Competitive',
      requirements: ['Multi-type', 'Customer service', 'Medical services'],
      tags: ['FAA 3PVA645M', 'G550/G650 Fleet', 'Air Medical'],
      matchPercentage: 65,
      image: { 
        background: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?w=1200', 
        logo: 'https://via.placeholder.com/200x80?text=PrivateFlite'
      }
    }
  ],
  'cargo': [
    {
      id: 'disc-cargo-dhl',
      title: 'DHL Aviation Pilot',
      company: 'DHL Aviation (EAT Leipzig)',
      type: 'Cargo Operations',
      location: 'Leipzig/Halle, Germany',
      salary: 'German Scale + Benefits',
      requirements: ['ATPL license', 'A330F type', 'Cargo ops'],
      tags: ['A330 Freighter', '1,000+ Employees', 'Express Network'],
      matchPercentage: 80,
      image: { 
        background: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/512px-DHL_Logo.svg.png'
      }
    }
  ],
  'atpl': [
    {
      id: 'disc-priv-cae-philippines',
      title: 'CAE Philippines Training',
      company: 'CAE Philippines (PAAT)',
      type: 'Type Rating Center',
      location: 'Clark Freeport Zone, Philippines',
      salary: 'Training Investment',
      requirements: ['CPL license', 'Funding secured', 'Type rating goal'],
      tags: ['4 Full Flight Sims', 'A320/ATR 72-600', 'EASA/CAAP Approved'],
      matchPercentage: 85,
      image: { 
        background: 'https://images.unsplash.com/photo-1542296332-2e44a23b3ae9?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/CAE_Inc._Logo.svg/512px-CAE_Inc._Logo.svg.png'
      }
    },
    {
      id: 'disc-priv-cat',
      title: 'CAT I | CAT II | CAT III Training',
      company: 'Advanced Landing Systems',
      type: 'Weather Authorization',
      location: 'Global Training Centers',
      salary: 'Career Advancement',
      requirements: ['Type rating complete', 'Airline sponsor', 'Low vis training'],
      tags: ['CAT II/III Auth', 'Simulator Checkride', 'Airline Specific'],
      matchPercentage: 90,
      image: { 
        background: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200', 
        logo: 'https://via.placeholder.com/200x80?text=CAT+II%2FIII'
      }
    }
  ],
  'airtaxi-drones': [
    {
      id: 'disc-airtaxi-joby',
      title: 'Joby Aviation Pilot',
      company: 'Joby Aviation',
      type: 'eVTOL Operations',
      location: 'Marina, California',
      salary: 'Startup + Equity',
      requirements: ['Test pilot exp', 'eVTOL interest', 'Innovation mindset'],
      tags: ['Tesla Partnership', 'eVTOL Pioneer', 'FAA Certified'],
      matchPercentage: 75,
      image: { 
        background: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Joby_Aviation_logo.svg/512px-Joby_Aviation_logo.svg.png'
      }
    },
    {
      id: 'disc-airtaxi-archer',
      title: 'Archer Aviation Pilot',
      company: 'Archer Aviation',
      type: 'Midnight eVTOL',
      location: 'Palo Alto, California',
      salary: 'Competitive + Equity',
      requirements: ['Rotorcraft exp', 'eVTOL training', 'Tech adaptability'],
      tags: ['Midnight Aircraft', 'United Partnership', 'eVTOL Leader'],
      matchPercentage: 72,
      image: { 
        background: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Archer_Aviation_logo.svg/512px-Archer_Aviation_logo.svg.png'
      }
    },
    {
      id: 'disc-airtaxi-lilium',
      title: 'Lilium Jet Pilot',
      company: 'Lilium GmbH',
      type: '7-Seater eVTOL',
      location: 'Munich, Germany',
      salary: 'EU Market Rate',
      requirements: ['EASA license', 'Multi-engine', 'Regional EU'],
      tags: ['Lilium Jet', 'German Engineering', 'Europe Focus'],
      matchPercentage: 70,
      image: { 
        background: 'https://images.unsplash.com/photo-1487975460695-a2e3c1b8f42d?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Lilium_logo.svg/512px-Lilium_logo.svg.png'
      }
    },
    {
      id: 'disc-drones-wing',
      title: 'Drone Delivery Pilot',
      company: 'Wing (Alphabet)',
      type: 'Autonomous Delivery',
      location: 'Australia / US / Finland',
      salary: 'Tech Industry Rate',
      requirements: ['Remote pilot', 'Tech savvy', 'Delivery ops'],
      tags: ['Alphabet/Google', 'Last-Mile Delivery', 'Autonomous Systems'],
      matchPercentage: 68,
      image: { 
        background: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Wing_Aviation_logo.svg/512px-Wing_Aviation_logo.svg.png'
      }
    },
    {
      id: 'disc-drones-zipline',
      title: 'Zipline Flight Operations',
      company: 'Zipline International',
      type: 'Medical Delivery Drones',
      location: 'Africa / US / Global',
      salary: 'Mission Driven',
      requirements: ['Humanitarian focus', 'Remote ops', 'Global travel'],
      tags: ['Life-Saving Delivery', '1M+ Deliveries', 'Global Health'],
      matchPercentage: 70,
      image: { 
        background: 'https://images.unsplash.com/photo-1527977966376-1c12bf77476d?w=1200', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Zipline_logo.svg/512px-Zipline_logo.svg.png'
      }
    },
    {
      id: 'disc-drones-mlg',
      title: 'MLG Pilotless Drone Ops',
      company: 'MLG (Medical Logistics Group)',
      type: 'B2B Drone Solutions',
      location: 'Global Operations',
      salary: 'Industry Competitive',
      requirements: ['B2B operations', 'Logistics exp', 'Drone tech'],
      tags: ['Pilotless Drones', 'B2B Solutions', 'Logistics Leader'],
      matchPercentage: 65,
      image: { 
        background: 'https://images.unsplash.com/photo-1527977966376-1c12bf77476d?w=1200', 
        logo: 'https://via.placeholder.com/200x80?text=MLG'
      }
    }
  ],
  'specialized': [
    {
      id: 'disc-spec-skydive',
      title: 'Skydive Operations Pilot',
      company: 'Skydive Centers',
      type: 'Drop Zone Pilot',
      location: 'Global Drop Zones',
      salary: 'Per Load + Tips',
      requirements: ['Multi-engine', 'Drop zone exp', 'Jump pilot'],
      tags: ['Extreme Sports', 'Flexible Hours', 'Community'],
      matchPercentage: 60,
      image: { 
        background: 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=1200', 
        logo: 'https://via.placeholder.com/200x80?text=Skydive'
      }
    },
    {
      id: 'disc-spec-air-ambulance',
      title: 'Air Ambulance Pilot',
      company: 'Medical Air Services',
      type: 'Medevac Operations',
      location: 'Regional Bases',
      salary: 'High + On-Call Pay',
      requirements: ['Multi-IFR', 'Medical ops', 'Emergency exp'],
      tags: ['Life Saving', 'Rotor/Fixed', 'Critical Care'],
      matchPercentage: 75,
      image: { 
        background: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1200', 
        logo: 'https://via.placeholder.com/200x80?text=Air+Ambulance'
      }
    },
    {
      id: 'disc-spec-crop-dusting',
      title: 'Agricultural Pilot',
      company: 'Crop Dusting Operations',
      type: 'Aerial Application',
      location: 'Rural Agricultural Areas',
      salary: 'Seasonal High',
      requirements: ['Low-level ops', 'Agricultural rating', 'Long hours'],
      tags: ['Seasonal Work', 'Specialized Rating', 'Rural'],
      matchPercentage: 55,
      image: { 
        background: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200', 
        logo: 'https://via.placeholder.com/200x80?text=Crop+Dusting'
      }
    },
    {
      id: 'disc-spec-pipeline',
      title: 'Pipeline & Survey Pilot',
      company: 'Survey Companies',
      type: 'Aerial Survey',
      location: 'Remote Territories',
      salary: 'Per Hour + Per Diem',
      requirements: ['Slow flight exp', 'Endurance', 'Remote work'],
      tags: ['Remote Areas', 'Survey Tech', 'Endurance Flying'],
      matchPercentage: 58,
      image: { 
        background: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200', 
        logo: 'https://via.placeholder.com/200x80?text=Survey'
      }
    },
    {
      id: 'disc-spec-aircraft-ownership',
      title: 'Aircraft Ownership Pathway',
      company: 'Private Ownership',
      type: 'Owner-Operator',
      location: 'Variable',
      salary: 'Investment Based',
      requirements: ['Significant capital', 'Business need', 'Maintenance plan'],
      tags: ['Fractional Ownership', 'Jet Cards', 'Full Ownership'],
      matchPercentage: 45,
      image: { 
        background: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200', 
        logo: 'https://via.placeholder.com/200x80?text=Ownership'
      }
    }
  ]
};

const CATEGORY_SECTIONS: CategorySection[] = [
  {
    id: 'cadet-programme',
    title: 'Cadet Programs',
    description: 'Major, regional, and budget carriers serving scheduled passenger routes',
    accentColor: '#3b82f6',
    pathways: DISCOVERY_PATHWAYS['cadet-programme']
  },
  {
    id: 'cargo',
    title: 'Cargo Pathways',
    description: 'Dedicated freighter and cargo operations worldwide',
    accentColor: '#8b5cf6',
    pathways: DISCOVERY_PATHWAYS['cargo']
  },
  {
    id: 'private',
    title: 'Private Sector Pathways',
    description: 'Business aviation, charter, and corporate flight departments',
    accentColor: '#10b981',
    pathways: DISCOVERY_PATHWAYS['private']
  },
  {
    id: 'atpl',
    title: 'Type Rating & Licensure Pathways',
    description: 'Advanced training and type rating certifications',
    accentColor: '#f59e0b',
    pathways: DISCOVERY_PATHWAYS['atpl']
  },
  {
    id: 'airline-expectations',
    title: 'Airline Expectations',
    description: 'Understanding what airlines look for in pilot candidates',
    accentColor: '#ec4899',
    pathways: []
  },
  {
    id: 'airtaxi-drones',
    title: 'Emerging AirTaxi & Drones Pathway',
    description: 'eVTOL, Urban Air Mobility, and Drone Delivery opportunities',
    accentColor: '#06b6d4',
    pathways: DISCOVERY_PATHWAYS['airtaxi-drones']
  },
  {
    id: 'specialized',
    title: 'Specialized Pathways',
    description: 'Agricultural, aerial survey, firefighting, and unique aviation careers',
    accentColor: '#ef4444',
    pathways: DISCOVERY_PATHWAYS['specialized']
  }
];

const DiscoverPathwayPage: React.FC<DiscoverPathwayPageProps> = ({ categoryId, onBack, isDarkMode = true }) => {
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  
  const section = CATEGORY_SECTIONS.find(s => s.id === categoryId);
  const pathways = DISCOVERY_PATHWAYS[categoryId] || [];

  if (!section) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: isDarkMode ? '#0B0F19' : '#f8fafc',
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Category not found</h2>
          <button onClick={onBack} style={{ marginTop: '20px' }}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: isDarkMode ? '#0B0F19' : '#f8fafc',
      color: isDarkMode ? '#f8fafc' : '#0f172a'
    }}>
      {/* Sticky Navigation Bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: isDarkMode ? 'rgba(11, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100
      }}>
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
            gap: '6px'
          }}
        >
          <ChevronLeftIcon />
          Back to Pathways
        </button>

        <img 
          src="/logo.png" 
          alt="PilotRecognition" 
          style={{ height: '36px', width: 'auto', opacity: 0.9 }} 
        />

        <div style={{
          padding: '6px 12px',
          backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)'}`,
          borderRadius: '8px',
          fontSize: '12px',
          color: isDarkMode ? '#94a3b8' : '#64748b'
        }}>
          {section.title}
        </div>
      </nav>

      {/* Header Section */}
      <header style={{ 
        textAlign: 'center', 
        padding: '40px 20px 30px'
      }}>
        <div style={{ 
          letterSpacing: '0.3em', 
          color: isDarkMode ? '#60a5fa' : '#2563eb', 
          fontWeight: 700,
          fontSize: '14px',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          {section.title}
        </div>
        
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: 400,
          color: isDarkMode ? '#f8fafc' : '#0f172a',
          fontFamily: '"Georgia", serif',
          marginBottom: '16px',
          letterSpacing: '-0.02em'
        }}>
          Discover Your Pathway
        </h1>
        
        <p style={{ 
          color: isDarkMode ? '#94a3b8' : '#64748b', 
          fontSize: '18px', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          {section.description}
        </p>
      </header>

      {/* Pathways Grid */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
        {pathways.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              Detailed pathway information coming soon for this category.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {pathways.map((pathway) => (
              <div
                key={pathway.id}
                onClick={() => setSelectedPathway(selectedPathway === pathway.id ? null : pathway.id)}
                style={{
                  backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.2)'}`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Card Image */}
                <div style={{ 
                  height: '200px', 
                  position: 'relative',
                  background: isDarkMode ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'linear-gradient(135deg, #e2e8f0, #f1f5f9)'
                }}>
                  {typeof pathway.image === 'object' && pathway.image.background ? (
                    <>
                      <img
                        src={pathway.image.background}
                        alt={pathway.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: isDarkMode 
                          ? 'linear-gradient(to top, rgba(11, 15, 25, 0.9), rgba(11, 15, 25, 0.3))'
                          : 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)'
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <img
                          src={pathway.image.logo}
                          alt={`${pathway.company} logo`}
                          style={{ height: '40px', maxWidth: '120px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={typeof pathway.image === 'string' ? pathway.image : pathway.image?.background}
                        alt={pathway.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: isDarkMode 
                          ? 'linear-gradient(to top, rgba(11, 15, 25, 0.9), rgba(11, 15, 25, 0.3))'
                          : 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)'
                      }} />
                    </>
                  )}
                  
                  {/* Match Badge */}
                  {pathway.matchPercentage !== undefined && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '6px 12px',
                      backgroundColor: pathway.matchPercentage >= 80 ? 'rgba(16, 185, 129, 0.9)' : pathway.matchPercentage >= 60 ? 'rgba(245, 158, 11, 0.9)' : 'rgba(148, 163, 184, 0.9)',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: pathway.matchPercentage >= 60 ? '#ffffff' : '#0f172a'
                    }}>
                      {pathway.matchPercentage}% Match
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px' }}>
                  <div style={{ 
                    fontSize: '11px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em',
                    color: section.accentColor,
                    fontWeight: 700,
                    marginBottom: '8px'
                  }}>
                    {pathway.type}
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: 600,
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                    marginBottom: '4px'
                  }}>
                    {pathway.title}
                  </h3>
                  
                  <p style={{ 
                    fontSize: '14px',
                    color: isDarkMode ? '#94a3b8' : '#64748b',
                    marginBottom: '12px'
                  }}>
                    {pathway.company}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    fontSize: '13px',
                    color: isDarkMode ? '#64748b' : '#94a3b8',
                    marginBottom: '12px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPinIcon />
                      {pathway.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSignIcon />
                      {pathway.salary}
                    </span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {pathway.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 500,
                          backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                          color: isDarkMode ? '#60a5fa' : '#2563eb'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Requirements */}
                  <div style={{ 
                    padding: '12px',
                    backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                    borderRadius: '12px'
                  }}>
                    <p style={{ 
                      fontSize: '12px', 
                      fontWeight: 600,
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Requirements
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                      {pathway.requirements.slice(0, 3).map((req, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DiscoverPathwayPage;
