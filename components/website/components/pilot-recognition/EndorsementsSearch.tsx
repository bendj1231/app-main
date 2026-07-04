import React, { useMemo, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Check,
  Plus,
  Users,
  Crown,
  Zap,
  Settings,
  RotateCcw,
  RefreshCw,
  Waves,
  Moon,
  Layers,
  Wind,
  Eye,
  Target,
  Crosshair,
  Mountain,
  TreePine,
  Leaf,
  Flame,
  Shield,
  Compass,
  MapPin,
  Activity,
  Award,
  Heart,
  Ambulance,
} from 'lucide-react';

const SLATE: Record<string, string> = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

const ICONS: Record<string, React.FC<{ size?: number; strokeWidth?: number }>> = {
  Users,
  Crown,
  Zap,
  Settings,
  RotateCcw,
  RefreshCw,
  Waves,
  Moon,
  Layers,
  Wind,
  Eye,
  Target,
  Crosshair,
  Mountain,
  TreePine,
  Leaf,
  Flame,
  Shield,
  Compass,
  MapPin,
  Activity,
  Award,
  Heart,
  Ambulance,
};

interface EndorsementMeta {
  id: string;
  label: string;
  description: string;
  category: string;
  gradient: string;
  accent: string;
  iconName: string;
  imageUrl: string;
  tag?: string;
}

const ENDORSEMENTS_META: EndorsementMeta[] = [
  {
    id: 'firstOfficer',
    label: 'First Officer Endorsement',
    description: 'Qualified to operate as second-in-command on multi-crew aircraft.',
    category: 'License Endorsements',
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    accent: '#2563eb',
    iconName: 'Users',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu6u8dn7LDL-1n0Vz0rmi4VOb0pL8FJPByzfHI2aStJfImuBDeS1lnqNZh&s=10',
    tag: 'COMMAND',
  },
  {
    id: 'captain',
    label: 'Captain Endorsement',
    description: 'Qualified to act as pilot-in-command and carry final authority.',
    category: 'License Endorsements',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    accent: '#d97706',
    iconName: 'Crown',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu6u8dn7LDL-1n0Vz0rmi4VOb0pL8FJPByzfHI2aStJfImuBDeS1lnqNZh&s=10',
    tag: 'AUTHORITY',
  },
  {
    id: 'secondOfficer',
    label: 'Second Officer Endorsement',
    description: 'Junior crew member position on long-haul multi-crew operations.',
    category: 'License Endorsements',
    gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    accent: '#4f46e5',
    iconName: 'User',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu6u8dn7LDL-1n0Vz0rmi4VOb0pL8FJPByzfHI2aStJfImuBDeS1lnqNZh&s=10',
  },
  {
    id: 'cadetPilot',
    label: 'Cadet Pilot Endorsement',
    description: 'Entry-level pilot completing ab-initio training program.',
    category: 'License Endorsements',
    gradient: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    accent: '#16a34a',
    iconName: 'GraduationCap',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu6u8dn7LDL-1n0Vz0rmi4VOb0pL8FJPByzfHI2aStJfImuBDeS1lnqNZh&s=10',
  },
  {
    id: 'highPerformance',
    label: 'High Performance',
    description: 'Aircraft with more than 200 hp per engine.',
    category: 'Aircraft Type Ratings',
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    accent: '#dc2626',
    iconName: 'Zap',
    imageUrl: 'https://assets.skiesmag.com/wp-content/uploads/2025/01/one-G-Tarbes-8-pilot.jpg',
  },
  {
    id: 'complexAircraft',
    label: 'Complex Aircraft',
    description: 'Retractable gear, flaps, and controllable-pitch propeller.',
    category: 'Aircraft Type Ratings',
    gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    accent: '#7c3aed',
    iconName: 'Settings',
    imageUrl: 'https://cdn.shopify.com/s/files/1/2773/1296/files/A_beechcraft_Bonanza_Complex_Airplane_with_Mountains_in_the_background_-_Pilot_Mall.png?v=1701533972',
  },
  {
    id: 'tailwheel',
    label: 'Tailwheel',
    description: 'Conventional-gear aircraft requiring a tailwheel endorsement.',
    category: 'Aircraft Type Ratings',
    gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    accent: '#db2777',
    iconName: 'RotateCcw',
    imageUrl: 'https://pilotinstitute.com/wp-content/uploads/2021/11/taildragger-landing-cessna.jpeg',
  },
  {
    id: 'aerobatic',
    label: 'Aerobatic',
    description: 'Flight manoeuvres beyond normal flight such as spins and rolls.',
    category: 'Aircraft Type Ratings',
    gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    accent: '#ea580c',
    iconName: 'RefreshCw',
    imageUrl: 'https://www.aviationjobsearch.com/storage/AJS/uploads/hub/advices/RlSQ7ncB7Lef8rO2xvlvnqGHGaSZr2fFexHMxLUU.webp',
  },
  {
    id: 'seaplane',
    label: 'Float / Seaplane',
    description: 'Take-off and landing on water.',
    category: 'Aircraft Type Ratings',
    gradient: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)',
    accent: '#0891b2',
    iconName: 'Waves',
    imageUrl: 'https://seaplanes.ph/wp-content/uploads/2022/12/IMG_20220813_094727-1-1024x768.jpg',
    tag: 'SPECIALIST',
  },
  {
    id: 'nightVFR',
    label: 'Night VFR',
    description: 'Visual flight rules operations during night-time conditions.',
    category: 'Aircraft Type Ratings',
    gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    accent: '#4f46e5',
    iconName: 'Moon',
    imageUrl: 'https://images.unsplash.com/photo-1534376623844-8a5ef3cf4479?w=800&q=80',
  },
  {
    id: 'nightIFR',
    label: 'Night IFR',
    description: 'Instrument flight rules operations during night-time conditions.',
    category: 'Instrument Approach Authorizations',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    accent: '#4338ca',
    iconName: 'Moon',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlu7TS-A_vDHv6rkQI-gATiFoPp4iTH7k8D5f3IAlNQxCpBI0Cfb6L0sE&s=10',
  },
  {
    id: 'multiEngine',
    label: 'Multi-Engine',
    description: 'Operations of aircraft with more than one powerplant.',
    category: 'Aircraft Type Ratings',
    gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    accent: '#059669',
    iconName: 'Layers',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxKAp6voHvLqsXUxUXwS4SImjaBrWfeDkeZ1NfNvcgCWHIR-vUPlPspgg&s=10',
  },
  {
    id: 'glider',
    label: 'Glider',
    description: 'Unpowered flight using thermal and ridge lift.',
    category: 'Aircraft Type Ratings',
    gradient: 'linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%)',
    accent: '#65a30d',
    iconName: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  },
  {
    id: 'ifr',
    label: 'IFR',
    description: 'Instrument Flight Rules certification for all-weather operations.',
    category: 'Aircraft Type Ratings',
    gradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    accent: '#475569',
    iconName: 'Compass',
    imageUrl: 'https://angelflightwest.org/wp-content/uploads/2022/02/caleb-woods-R2lCJwGyqPQ-unsplash-1.jpg',
  },
  {
    id: 'catI',
    label: 'CAT I',
    description: 'Standard precision approach down to 200 ft decision height.',
    category: 'Instrument Approach Authorizations',
    gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    accent: '#059669',
    iconName: 'Eye',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR55oXQCGhWpKupb5KiHEV2tXGZyHBqjcV3Bi8VqkUp6yyTWBfZsJ9xYVk5&s=10',
  },
  {
    id: 'catII',
    label: 'CAT II',
    description: 'Autoland or guided approach down to 100 ft decision height.',
    category: 'Instrument Approach Authorizations',
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    accent: '#2563eb',
    iconName: 'Target',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR55oXQCGhWpKupb5KiHEV2tXGZyHBqjcV3Bi8VqkUp6yyTWBfZsJ9xYVk5&s=10',
  },
  {
    id: 'catIII',
    label: 'CAT III',
    description: 'Zero-visibility autoland operations.',
    category: 'Instrument Approach Authorizations',
    gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    accent: '#4f46e5',
    iconName: 'Crosshair',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR55oXQCGhWpKupb5KiHEV2tXGZyHBqjcV3Bi8VqkUp6yyTWBfZsJ9xYVk5&s=10',
    tag: 'FLAGSHIP',
  },
  {
    id: 'rnpAr',
    label: 'RNP AR',
    description: 'Required Navigation Performance Authorisation Required approaches.',
    category: 'Instrument Approach Authorizations',
    gradient: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
    accent: '#7e22ce',
    iconName: 'MapPin',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqZrqzZ5AwnZiv562G0Lrkfo81Gvg3Z30gAyQGIiC1xMKBIvAKrFfsHD0l&s=10',
  },
  {
    id: 'lpv',
    label: 'LPV',
    description: 'Localiser Performance with Vertical guidance approaches.',
    category: 'Instrument Approach Authorizations',
    gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    accent: '#0284c7',
    iconName: 'Activity',
    imageUrl: 'https://pilotinstitute.com/wp-content/uploads/2025/01/image-26-1024x569.png',
  },
  {
    id: 'mountainFlying',
    label: 'Mountain Flying',
    description: 'Operations in high-terrain and alpine environments.',
    category: 'Additional Ratings',
    gradient: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    accent: '#78716c',
    iconName: 'Mountain',
    imageUrl: 'https://i.ytimg.com/vi/9eLcDcQ3Z-0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCaMk2ENdzYLGYvyKRLsowRdgtiuw',
  },
  {
    id: 'formationFlying',
    label: 'Formation Flying',
    description: 'Coordinated multi-aircraft flight in close proximity.',
    category: 'Additional Ratings',
    gradient: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
    accent: '#0e7490',
    iconName: 'Users',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRscNcvmbb18vH3fU8fiW2EMYARHNlNwJ81L7QDVuuJptI46Xjp74njiqo&s=10',
  },
  {
    id: 'agricultural',
    label: 'Agricultural Operations',
    description: 'Aerial application and crop-dusting flight operations.',
    category: 'Additional Ratings',
    gradient: 'linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%)',
    accent: '#65a30d',
    iconName: 'Leaf',
    imageUrl: 'https://educhem.co.nz/wp-content/uploads/2023/01/areial-pilot-refresher.jpeg',
  },
  {
    id: 'fireBombing',
    label: 'Fire Bombing',
    description: 'Aerial firefighting and retardant delivery operations.',
    category: 'Additional Ratings',
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    accent: '#dc2626',
    iconName: 'Flame',
    imageUrl: 'https://live-production.wcms.abc-cdn.net.au/837ecf3bfe47acfaa52834303124449a?impolicy=wcms_crop_resize&cropH=1191&cropW=1785&xPos=94&yPos=0&width=862&height=575',
  },
  {
    id: 'searchRescue',
    label: 'Search & Rescue',
    description: 'Airborne SAR coordination and rescue operations.',
    category: 'Additional Ratings',
    gradient: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    accent: '#c2410c',
    iconName: 'Shield',
    imageUrl: 'https://www.airforce-technology.com/wp-content/uploads/sites/6/2017/09/main-545.jpg',
  },
  {
    id: 'charitableRemoteSupply',
    label: 'Charitable Remote Supply',
    description: 'Humanitarian aid delivery to remote and underserved communities.',
    category: 'Additional Ratings',
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    accent: '#2563eb',
    iconName: 'Heart',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgnJ5nfjZAl_ZdXhQuMdtbuxZsW8kGL5FnVzS0evtxoek4innieaDoGjmTGzpemXwkAGUAjxb0y2iuXEuwNS8AaDxllhpo-qu-b7ncg3gXRgku-j6q5qYGT1zwnk2-nt3HK357wdbqy2vj2/s1600/210901_P1003143.jpg',
  },
  {
    id: 'airAmbulance',
    label: 'Air Ambulance',
    description: 'Medical evacuation and emergency medical transport operations.',
    category: 'Additional Ratings',
    gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    accent: '#dc2626',
    iconName: 'Ambulance',
    imageUrl: 'https://www.pilatus-aircraft.com/assets/media/22-News/2024/_fullSizeAuto/23720/PC-24-Whales.webp?v=1737743735',
  },
  {
    id: 'bushFlying',
    label: 'Bush Flying',
    description: 'Operations in remote and unimproved locations with limited infrastructure.',
    category: 'Additional Ratings',
    gradient: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    accent: '#78716c',
    iconName: 'TreePine',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-t1QEPWPRgby76nDrplLsh9V91CNNas1BntxNG9iUVQkmXg-mD1vWv3A&s=10',
  },
  {
    id: 'flightTours',
    label: 'Flight Tours',
    description: 'Scenic flight operations and aerial tourism services.',
    category: 'Additional Ratings',
    gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    accent: '#db2777',
    iconName: 'Award',
    imageUrl: 'https://cdn2.veltra.com/ptr/20140521233744_1963331673_1267_0.jpg?imwidth=1000&impolicy=custom',
  },
];

const ENDORSEMENT_BY_ID = new Map(ENDORSEMENTS_META.map((e) => [e.id, e]));

export const EndorsementsSearch: React.FC<{
  selectedIds: string[];
  onToggle: (id: string) => void;
}> = ({ selectedIds, onToggle }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [autoRotateIndex, setAutoRotateIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Auto-rotate preview when not focused and not hovering
  useEffect(() => {
    if (focused || hoveredId) return;
    
    const interval = setInterval(() => {
      setAutoRotateIndex((prev) => (prev + 1) % ENDORSEMENTS_META.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [focused, hoveredId]);

  const previewId =
    hoveredId || 
    (selectedIds.length > 0 ? selectedIds[selectedIds.length - 1] : null) ||
    ENDORSEMENTS_META[autoRotateIndex]?.id;
  const preview = ENDORSEMENT_BY_ID.get(previewId || '') || ENDORSEMENTS_META[0];
  const PreviewIcon = ICONS[preview.iconName] || Shield;

  const filtered = useMemo(() => {
    if (!query.trim()) return ENDORSEMENTS_META;
    const q = query.toLowerCase();
    return ENDORSEMENTS_META.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, EndorsementMeta[]> = {};
    filtered.forEach((e) => {
      if (!map[e.category]) map[e.category] = [];
      map[e.category].push(e);
    });
    return map;
  }, [filtered]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (portalRef.current && !portalRef.current.contains(e.target as Node) && 
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setFocused(false);
        setDropdownPos(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (focused && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width
      });
    } else {
      setDropdownPos(null);
    }
  }, [focused]);

  return (
    <div ref={containerRef} style={{ marginBottom: '2rem' }}>
      <style>{`
        @keyframes endorse-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes endorse-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes endorse-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Main Preview */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
          border: `1px solid ${SLATE[200]}`,
        }}
      >
        {/* Left — Visual */}
        <div
          style={{
            flex: '0 0 42%',
            position: 'relative',
            minHeight: '260px',
            background: preview.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Animated ambient blob */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.4)',
              filter: 'blur(50px)',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              position: 'absolute',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              filter: 'blur(35px)',
              top: '10%',
              right: '10%',
            }}
          />

          {/* Floating image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={preview.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
              }}
            >
              <img
                src={preview.imageUrl}
                alt={preview.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Subtle scanlines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 6px)',
              pointerEvents: 'none',
              opacity: 0.35,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Shimmer sweep */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'endorse-shimmer 4s ease-in-out infinite',
              pointerEvents: 'none',
              opacity: 0.6,
            }}
          />

          {/* Gradient transition into right panel */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, transparent 55%, rgba(255,255,255,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Right — Details */}
        <div
          style={{
            flex: '1 1 auto',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'white',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={preview.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '0.8rem',
                  color: SLATE[500],
                  fontWeight: 500,
                }}
              >
                Search and select your additional ratings and endorsements
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: SLATE[500],
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {preview.category}
                </p>
                {preview.tag && (
                  <span
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      background: `${preview.accent}12`,
                      color: preview.accent,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: `1px solid ${preview.accent}25`,
                    }}
                  >
                    {preview.tag}
                  </span>
                )}
              </div>
              <h3
                style={{
                  margin: '0 0 0.75rem',
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: SLATE[900],
                  lineHeight: 1.15,
                }}
              >
                {preview.label}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.9rem',
                  color: SLATE[600],
                  lineHeight: 1.65,
                  maxWidth: '500px',
                }}
              >
                {preview.description}
              </p>

              <div
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                }}
              >
                <button
                  onClick={() => onToggle(preview.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1.25rem',
                    background: selectedIds.includes(preview.id)
                      ? 'transparent'
                      : preview.accent,
                    color: selectedIds.includes(preview.id)
                      ? preview.accent
                      : 'white',
                    border: `1.5px solid ${preview.accent}`,
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedIds.includes(preview.id)) {
                      (e.currentTarget as HTMLButtonElement).style.background = `${preview.accent}12`;
                    } else {
                      (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedIds.includes(preview.id)) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    } else {
                      (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
                    }
                  }}
                >
                  {selectedIds.includes(preview.id) ? (
                    <>
                      <Check size={16} /> Added to Profile
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add to Profile
                    </>
                  )}
                </button>

                {selectedIds.includes(preview.id) && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      color: '#059669',
                      fontWeight: 600,
                    }}
                  >
                    <Shield size={14} /> Verified capability
                  </motion.span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Selected pills */}
      {selectedIds.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}
        >
          {selectedIds.map((id) => {
            const item = ENDORSEMENT_BY_ID.get(id);
            if (!item) return null;
            return (
              <motion.div
                key={id}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  background: item.gradient,
                  border: `1px solid ${item.accent}25`,
                  borderRadius: '9999px',
                  color: item.accent,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                <span>{item.label}</span>
                <button
                  onClick={() => onToggle(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    color: item.accent,
                    cursor: 'pointer',
                    padding: 0,
                    opacity: 0.7,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.opacity = '1')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.opacity = '0.7')
                  }
                >
                  <X size={12} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Search Bar */}
      <div ref={triggerRef} style={{ position: 'relative', zIndex: 100 }}>
        <Search
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: SLATE[400],
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search and select endorsements additional ratings"
          style={{
            width: '100%',
            padding: '0.8rem 1rem 0.8rem 2.5rem',
            background: 'white',
            border: `1.5px solid ${focused ? '#3b82f6' : SLATE[200]}`,
            borderRadius: '12px',
            color: SLATE[800],
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: focused ? '0 4px 16px rgba(59,130,246,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setFocused(false); }}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: SLATE[400],
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        )}

        {/* Dropdown via Portal */}
        {focused && dropdownPos && createPortal(
          <div ref={portalRef} style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 99999,
            background: 'white',
            border: `1px solid ${SLATE[200]}`,
            borderRadius: '12px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '0.5rem 0',
          }}>
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p
                  style={{
                    margin: '0.5rem 0.75rem 0.25rem',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: SLATE[400],
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {category}
                </p>
                {items.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const ItemIcon = ICONS[item.iconName] || Shield;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onToggle(item.id);
                        setQuery('');
                        setFocused(false);
                      }}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.1s',
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = SLATE[50];
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img
                          src={item.imageUrl}
                          alt={item.label}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: SLATE[800],
                            }}
                          >
                            {item.label}
                          </p>
                          <p
                            style={{
                              margin: '2px 0 0',
                              fontSize: '0.75rem',
                              color: SLATE[500],
                              maxWidth: '320px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Check
                          size={16}
                          style={{ color: '#10b981', flexShrink: 0 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
            {filtered.length === 0 && (
              <p
                style={{
                  margin: 0,
                  padding: '1.25rem',
                  fontSize: '0.85rem',
                  color: SLATE[400],
                  textAlign: 'center',
                }}
              >
                No endorsements found.
              </p>
            )}
          </div>
        , document.body)}
      </div>
    </div>
  );
};
