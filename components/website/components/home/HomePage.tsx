import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  User,
  CheckCircle2,
  Zap,
  Navigation,
  X,
  ShieldCheck,
  Clock,
  Globe,
} from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { ThemeContext } from '../../context/ThemeContext';
import { HomeLabel } from './HomeLabel';
import { IMAGES } from '@/lib/website-constants';
import { MeshGradient } from '@paper-design/shaders-react';
import { PathwayGrid, type Slide } from './PathwayGrid';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';
import { HomePageSchema } from '../seo/HomePageSchema';
import {
  getDevicePerformanceTier,
  getAnimationDurationMultiplier,
  getHomepageGraphicsConfig,
  type HomepageGraphicsConfig,
} from '@/lib/device-detection';
import { RecognitionATC } from '../RecognitionATC';

interface HomePageProps {
  onJoinUs: () => void;
  onLogin?: () => void;
  onNavigate: (page: string) => void;
  onGoToProgramDetail: (slide?: Slide) => void;
  isLoggedIn?: boolean;
  onLoginModalOpen?: () => void;
  onBecomeMemberOpen?: () => void;
  isEnrolledInFoundation?: boolean;
  pilotId?: string;
  totalHours?: number;
  lastFlown?: string;
  mentorshipHours?: number;
  foundationProgress?: number;
  examinationScore?: number;
  overallRecognitionScore?: number;
  userDisplayName?: string;
  userEmail?: string;
}

// Animated Header Component for Join Section
const AnimatedHeader: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = [
    { text: 'Programs', color: 'text-red-500' },
    { text: 'Recognition', color: 'text-red-500' },
    { text: 'Pathways', color: 'text-red-500' },
  ];

  useEffect(() => {
    // Get animation duration multiplier based on device tier
    const multiplier = getAnimationDurationMultiplier();
    const intervalTime = 2500 * multiplier;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <h1 className="text-5xl md:text-8xl font-serif leading-tight mb-4 tracking-tighter flex items-center justify-center gap-4 flex-wrap">
      <span className="text-white">Pilot</span>
      <span className="relative inline-block min-w-[280px] md:min-w-[400px] transition-all duration-500">
        {items.map((item, index) => (
          <span
            key={index}
            className={`${item.color} transition-all duration-500 ${
              index === activeIndex
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform -translate-y-4 absolute left-0 right-0'
            }`}
            style={{
              textShadow: index === activeIndex ? '0 0 30px rgba(239,68,68,0.4)' : 'none',
            }}
          >
            {item.text}
          </span>
        ))}
      </span>
    </h1>
  );
};

const HOME_PATHWAYS = [
  {
    id: 'disc-comm-1',
    title: 'Envoy Air Pilot Cadet Program',
    company: 'Envoy Air (American Airlines Group)',
    matchProbability: 94,
    pr: 82,
    location: 'United States | Home-Based',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    tags: ['American Airlines Flow', 'Embraer Fleet', 'Tuition Reimbursement'],
    category: 'Pilot Training & Certification',
  },
  {
    id: 'disc-comm-2',
    title: 'Air Cambodia Cadet Programme',
    company: 'Air Cambodia',
    matchProbability: 92,
    pr: 78,
    location: 'Phnom Penh, Cambodia',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    tags: ['Sponsored Training', 'A320 Type Rating', 'Direct Pathway'],
    category: 'Pilot Training & Certification',
  },
  {
    id: 'disc-comm-3',
    title: 'Cathay Pacific Cadet Pilot Programme',
    company: 'Cathay Pacific Airways',
    matchProbability: 88,
    pr: 75,
    location: 'Hong Kong / Australia',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    tags: ['Full Sponsorship', 'A350/B777', 'Definite Return'],
    category: 'Commercial Operations',
  },
  {
    id: 'disc-comm-4',
    title: 'FlyDubai Pilot Cadet Programme',
    company: 'FlyDubai',
    matchProbability: 90,
    pr: 80,
    location: 'Dubai, United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
    tags: ['B737 MAX', 'Dubai Base', 'Career Progression'],
    category: 'Commercial Operations',
  },
  {
    id: 'disc-comm-6',
    title: 'Ryanair Future Flyer Program',
    company: 'Ryanair / Atlantic Flight Training',
    matchProbability: 89,
    pr: 77,
    location: 'Dublin, Ireland / Various',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    tags: ['Low-Cost Leader', 'Fast Upgrade', '500+ Aircraft'],
    category: 'Commercial Operations',
  },
  {
    id: 'disc-comm-jetblue',
    title: 'JetBlue Gateway Program',
    company: 'JetBlue Airways',
    matchProbability: 92,
    pr: 81,
    location: 'New York, NY / Various Bases',
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    tags: ['Direct-to-Airline', 'A320/A220 Fleet', 'East Coast Network'],
    category: 'Career Progression',
  },
  {
    id: 'disc-comm-emirates-cadet',
    title: 'Emirates Cadet Pilot Programme',
    company: 'Emirates Airlines',
    matchProbability: 93,
    pr: 85,
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    tags: ['A380/A350 Fleet', '5-Star Airline', 'Global Network'],
    category: 'Pilot Training & Certification',
  },
  {
    id: 'disc-comm-easyjet',
    title: 'easyJet Cadet Pilot Programme',
    company: 'easyJet',
    matchProbability: 87,
    pr: 74,
    location: 'London, UK / Various European Bases',
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    tags: ['A320 Fleet', 'European Network', 'Low-Cost Leader'],
    category: 'Commercial Operations',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onJoinUs,
  onLogin,
  onNavigate,
  onGoToProgramDetail,
  isLoggedIn,
  onLoginModalOpen,
  onBecomeMemberOpen,
  isEnrolledInFoundation,
  _pilotId,
  _totalHours,
  _lastFlown,
  _mentorshipHours,
  _foundationProgress,
  _examinationScore,
  _overallRecognitionScore,
  _userDisplayName,
  _userEmail,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, _setActiveCategory] = useState<
    'all' | 'program' | 'systems_automation' | 'network' | 'application' | 'pathways'
  >('all');
  const pathwayGridRef = useRef<HTMLDivElement>(null);
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;

  // Automatic device detection for performance optimization
  const [deviceTier] = useState<'low' | 'medium' | 'high'>(getDevicePerformanceTier);
  const [graphicsConfig] = useState<HomepageGraphicsConfig | null>(getHomepageGraphicsConfig);
  const [activeMatchFilter, setActiveMatchFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [activeCarouselCategory, _setActiveCarouselCategory] = useState<string>('All');
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(() => {
    const enrollmentSuccess = sessionStorage.getItem('enrollmentSuccess');
    if (enrollmentSuccess === 'true') {
      sessionStorage.removeItem('enrollmentSuccess');
      return true;
    }
    return false;
  });
  const [activeBillboardSlide, setActiveBillboardSlide] = useState(0);
  const [platformImageIndex, setPlatformImageIndex] = useState(0);
  const [pilotShortageImageIndex, setPilotShortageImageIndex] = useState(0);
  const platformImages = [
    '/images/set-06-pathways/typeratingsearch.png',
    '/images/set-07-ui-graphics/AE.png',
    '/images/set-07-ui-graphics/DP.png',
  ];
  const pilotShortageImages = [
    '/images/set-07-ui-graphics/worker.png',
    '/images/set-07-ui-graphics/event2.png',
  ];

  // Auto-advance platform news cards every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBillboardSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-shuffle platform images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlatformImageIndex((prev) => (prev + 1) % platformImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [platformImages.length]);

  // Auto-shuffle pilotshortage card image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPilotShortageImageIndex((prev) => (prev + 1) % pilotShortageImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pilotShortageImages.length]);

  useEffect(() => {
    // Scroll to top on component mount to prevent unwanted scroll behavior
    window.scrollTo(0, 0);
  }, []);

  // Disable transitions after initial materialization so scroll doesn't re-trigger animations
  useEffect(() => {
    const tryDisable = () => {
      if (document.body.classList.contains('app-ready')) {
        // Wait for longest stagger (0.72s delay + 0.6s duration) + buffer
        setTimeout(() => {
          document.querySelectorAll('#home-root [data-section]').forEach((el) => {
            (el as HTMLElement).style.transition = 'none';
          });
        }, 1500);
        return true;
      }
      return false;
    };
    if (tryDisable()) return;
    const obs = new MutationObserver(tryDisable);
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const allSlides: Slide[] = [
    {
      image: '/images/homepage-1.png',
      title: 'Transition Program',
      category: 'program',
      subtitle:
        'Shifting students and graduates from flight school to an airline environment mindset through EBT & CBT familiarization.',
      description:
        'A structured bridge from fresh graduate to airline‑industry‑ready pilot. The Transition Program walks you through all nine EBT/CBTA core competencies using industry‑standard tools such as Airbus‑recommended HINFACT, aligns you with real airline expectations, and gives type‑rating insight before you commit tens of thousands to training. Combined with our Emirates‑standard GCAA ATPL theoretical pathway and accreditation partners, you gain a decisive advantage when presenting yourself to cadet programs, ATOs, and early first‑officer opportunities.',
      isDarkCard: true,
    },
    {
      image:
        'https://images.unsplash.com/photo-1520437358207-323b43b50729?q=80&w=2940&auto-format&fit=crop',
      title: 'EBT CBTA familiarization',
      category: 'program',
      subtitle: 'airline expectations',
      description:
        'Master the core competencies of Evidence-Based Training (EBT) and Competency-Based Training & Assessment (CBTA). Our program integrates industry-leading software solutions, including HINFACT (industry-standard EBT CBTA tool), to simulate real-world airline evaluation environments.',
      isDarkCard: true,
    },
    {
      image: '/images/foundational-program.png',
      title: 'Foundational Program',
      subtitle: 'Leadership skills, verifiable experience, and industry-recognized accreditation.',
      category: 'program',
      description:
        'Designed for recent graduates and ongoing pilots seeking a competitive edge. Our verified leadership and mentorship training prepares you to be Flight Instructor and mentor ready. Gain credibility, verifiable experience, and critical insights into the Transition Program, ensuring you are fully prepared for the next stage of your professional aviation career.',
      regions: [
        { name: 'UAE', flag: '🇦🇪' },
        { name: 'UK', flag: '🇬🇧' },
        { name: 'Philippines', flag: '🇵🇭' },
        { name: 'Mauritius', flag: '🇲🇺' },
        { name: 'Germany', flag: '🇩🇪' },
      ],
      isDarkCard: true,
    },
    {
      image: '/images/homepage-2.png',
      title: 'Emirates ATPL Pilot Pathways',
      subtitle: 'For pilots seeking an Emirates‑standard ATPL and GCAA license.',
      category: 'pathways',
      description:
        'PilotRecognition provides a structured Emirates ATPL Pathway through partner schools such as Fujairah Aviation, combining full ATPL training with license conversion inside the UAE. Pilots currently under the FAA system are guided through a smooth transition into EASA standards while completing their ATPL. The overall investment is comparable to many flight instructor ratings, while earning a respected GCAA license aligned with Emirates‑standard expectations—positioning you as a globally recognizable candidate whether you plan to fly in Dubai, the Philippines, or other international markets.',
      regions: [
        { name: 'UAE', flag: '🇦🇪' },
        { name: 'UK', flag: '🇬🇧' },
        { name: 'Mauritius', flag: '🇲🇺' },
        { name: 'Philippines', flag: '🇵🇭' },
        { name: 'Germany', flag: '🇩🇪' },
      ],
      isDarkCard: true,
    },
    {
      image: '/images/homepage-3.png',
      title: 'Emerging Air Taxi Sector',
      subtitle: 'For pilots under 1,000 hours stuck in the gap.',
      category: 'pathways',
      description:
        'PilotRecognition offers direct pilot pathways into the emerging air taxi sector, including leading industry players such as Archer and Joby—who have openly highlighted the need for pilots within this gap, typically under 1,000 hours. We also open routes into unmanned drone operations that are pilot-controlled from the ground. Through our network you gain strategic insight, connections, and a clear roadmap for how your current skills translate into this new segment.',
      isDarkCard: true,
    },
    {
      image: '/images/homepage-4.png',
      title: 'Air Taxi Pilot Pathways',
      subtitle: 'From CPL/IR to eVTOL flight deck.',
      category: 'pathways',
      description:
        'A structured pathway for pilots aiming at eVTOL and air taxi roles. Understand licensing considerations, multi‑crew expectations, and how to present your experience to early‑stage operators building their first pilot rosters.',
      isDarkCard: true,
    },
    {
      image: '/images/homepage-5.png',
      title: 'Private Charter Pathways',
      subtitle: 'Corporate and VIP flight departments.',
      category: 'pathways',
      description:
        'Guidance for pilots targeting private charter and corporate aviation. We unpack what owners, brokers, and chief pilots look for beyond raw hours—discretion, consistency, and the service mindset that defines successful charter crews.',
      isDarkCard: true,
    },
    {
      image: '/images/homepage-6.png',
      title: 'Unmanned Drones Pathways',
      subtitle: 'From manned cockpit to remote operations.',
      category: 'pathways',
      description:
        'For pilots interested in RPAS and unmanned operations, this pathway explains certifications, operational roles, and how traditional flying experience translates into high‑value skills for drone operators and data‑driven missions.',
      isDarkCard: true,
    },
    {
      image: '/images/airline-operations.png',
      title: 'Airline Expectations',
      category: 'network',
      subtitle: 'Strategic Investment Guidance',
      description:
        'A specialized data bank of airline-specific expectations and information, providing critical value for pilots prior to investing in expensive type ratings.',
      isDarkCard: true,
    },
    {
      image: '/images/homepage-7.png',
      title: 'Private Sector Insight',
      category: 'network',
      subtitle: 'Executive Intelligence & Corporate Trends',
      description:
        'Exclusive access to private sector requirements, corporate aviation trends, and non-scheduled operator insights typically unavailable to the general public.',
      isDarkCard: true,
    },
    {
      image: '/images/atlas_wallpaper_regular.png',
      title: 'ATLAS Aviation CV',
      category: 'systems_automation',
      subtitle: 'Globally Recognized AI-Optimized Format',
      description:
        "The new standard Resume recognized through automated platforms. ATLAS is a 'machine-language' version of a pilot's career, optimized for AI-powered parsers used by major airlines like Etihad and Cebu Pacific.",
      isDarkCard: true,
    },
    {
      image: '/images/homepage-2.png',
      title: 'Pilot Database Recognition System',
      category: 'systems_automation',
      subtitle: 'Verifiable Excellence & Industry Standards',
      description:
        'A comprehensive database tracking pilot milestones, recognition, and professional development pathways recognized by global aviation authorities.',
      isDarkCard: true,
    },
    {
      image: '/images/pilot-gap.png',
      title: 'What is the Pilot Gap?',
      category: 'network',
      subtitle:
        'Unifying the voices of experienced aviators and all professional pilots to navigate the critical transition between flight training and the airline flight deck.',
      isDarkCard: true,
    },
    {
      image: '/images/homepage-9.png',
      title: 'Examination Terminal',
      category: 'application',
      subtitle:
        'Pilot Applications — Access our suite of professional aviation applications, including standardized examination environments and operational tools.',
      isDarkCard: true,
      titleColor: 'text-yellow-500',
    },
    {
      image: '/images/homepage-10.png',
      title: 'PilotRecognition W1000',
      category: 'application',
      subtitle: 'The Professional Standard in glass cockpit familiarity.',
      description:
        'An application software inspired by the G1000 with our modern systems and simulators perfect suite for pilots to refresh on areas such as IFR, CPL examinations, and integrated Gleims examination software.',
      isDarkCard: true,
    },
    {
      image: '/images/homepage-11.png',
      title: 'Pilot Gap Forum',
      category: 'network',
      subtitle: 'Bridging the Experience Gap',
      subtitleColor: 'text-red-600 font-bold',
      description:
        'A secure intelligence hub for unfiltered career strategy discussions, industry gap analysis, and professional networking.',
      isDarkCard: true,
    },
  ];

  const filteredSlides = allSlides.filter((slide) => {
    if (activeCategory === 'all') {
      const excludedFromAll = ['Examination Terminal', 'Pilot Gap Forum', 'PilotRecognition W1000'];
      return !excludedFromAll.includes(slide.title);
    }
    if (activeCategory === 'pathways') {
      // Keep Emerging Air Taxi Sector only in the All view, not in the dedicated Pathways filter
      return slide.category === 'pathways' && slide.title !== 'Emerging Air Taxi Sector';
    }
    return slide.category === activeCategory;
  });

  const slides = filteredSlides;

  // Ensure currentSlide is always in range when category changes
  useEffect(() => {
    if (currentSlide >= slides.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  // Auto-advance carousel
  useEffect(() => {
    if (slides.length <= 1) return;
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [slides.length, activeCategory]); // Reset timer when content changes

  const pathwaysCarouselRef = useRef<HTMLDivElement>(null);
  const topRecommendedCarouselRef = useRef<HTMLDivElement>(null);
  const [isOverWhite, setIsOverWhite] = useState(false);
  const [selectedCarouselPathway, setSelectedCarouselPathway] = useState<Slide | null>(null);

  // Detect when scrolling over white sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // The first section (smoke shader) is h-screen, so after that we're over white content
      // Smoke shader is at scroll 0 to windowHeight
      if (scrollY > windowHeight * 0.7) {
        setIsOverWhite(true);
      } else {
        setIsOverWhite(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-select centered card on pathways carousel scroll
  useEffect(() => {
    const carousel = pathwaysCarouselRef.current;
    if (!carousel) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
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

        const visiblePathways = HOME_PATHWAYS.filter((p) => {
          const matchesMatch = (() => {
            if (activeMatchFilter === 'all') return true;
            if (activeMatchFilter === 'low')
              return p.matchProbability >= 60 && p.matchProbability < 75;
            if (activeMatchFilter === 'mid')
              return p.matchProbability >= 75 && p.matchProbability < 90;
            return p.matchProbability >= 90;
          })();
          const matchesCategory =
            activeCarouselCategory === 'All' || p.category === activeCarouselCategory;
          return matchesMatch && matchesCategory;
        });

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
        if (closestIndex > 0 && closestIndex <= visiblePathways.length) {
          const centeredCard = visiblePathways[closestIndex - 1]; // -1 because first card is intro
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
  }, [activeMatchFilter, activeCarouselCategory, selectedCarouselPathway?.id]);

  // Initialize selected pathway to first visible non-intro card
  useEffect(() => {
    const visiblePathways = HOME_PATHWAYS.filter((p) => {
      const matchesMatch = (() => {
        if (activeMatchFilter === 'all') return true;
        if (activeMatchFilter === 'low') return p.matchProbability >= 60 && p.matchProbability < 75;
        if (activeMatchFilter === 'mid') return p.matchProbability >= 75 && p.matchProbability < 90;
        return p.matchProbability >= 90;
      })();
      const matchesCategory =
        activeCarouselCategory === 'All' || p.category === activeCarouselCategory;
      return matchesMatch && matchesCategory;
    });
    if (visiblePathways.length > 0 && !selectedCarouselPathway) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCarouselPathway(visiblePathways[0]);
    }
  }, [activeMatchFilter, activeCarouselCategory, selectedCarouselPathway]);

  return (
    <>
      <HomePageSchema />
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }]} />
      <style>{`
                @keyframes ticker-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
      <div
        id="home-root"
        className="relative font-sans bg-black overflow-x-hidden flex flex-col min-h-screen pt-16"
      >
        <style>{`
                /* ENTRANCE: sections start invisible and materialize when app-ready */
                #home-root [data-section] {
                    transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                                filter 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                                transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                    opacity: 0;
                    filter: blur(8px);
                    transform: scale(0.96) translateY(16px);
                    pointer-events: none;
                }
                body.app-ready #home-root [data-section] {
                    opacity: 1;
                    filter: none;
                    transform: none;
                    pointer-events: auto;
                }
                body.app-ready #home-root [data-section="3"] { transition-delay: 0.00s; }
                body.app-ready #home-root [data-section="2"] { transition-delay: 0.06s; }
                body.app-ready #home-root [data-section="4"] { transition-delay: 0.18s; }
                body.app-ready #home-root [data-section="5"] { transition-delay: 0.24s; }
                body.app-ready #home-root [data-section="6"] { transition-delay: 0.30s; }
                body.app-ready #home-root [data-section="7"] { transition-delay: 0.36s; }
                body.app-ready #home-root [data-section="8"] { transition-delay: 0.42s; }
                body.app-ready #home-root [data-section="9"] { transition-delay: 0.48s; }
                body.app-ready #home-root [data-section="10"] { transition-delay: 0.54s; }
                body.app-ready #home-root [data-section="11"] { transition-delay: 0.60s; }
                body.app-ready #home-root [data-section="12"] { transition-delay: 0.66s; }
                body.app-ready #home-root [data-section="13"] { transition-delay: 0.72s; }

                /* EXIT: staggered dematerialization when leaving */
                .page-exiting #home-root [data-section] {
                    transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                                filter 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                                transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                    opacity: 0 !important;
                    filter: blur(12px) !important;
                    transform: scale(0.96) translateY(-8px) !important;
                    pointer-events: none !important;
                }
                .page-exiting #home-root [data-section="2"] { transition-delay: 0.00s; }
                .page-exiting #home-root [data-section="3"] { transition-delay: 0.08s; }
                .page-exiting #home-root [data-section="4"] { transition-delay: 0.12s; }
                .page-exiting #home-root [data-section="5"] { transition-delay: 0.16s; }
                .page-exiting #home-root [data-section="6"] { transition-delay: 0.20s; }
                .page-exiting #home-root [data-section="7"] { transition-delay: 0.24s; }
                .page-exiting #home-root [data-section="8"] { transition-delay: 0.28s; }
                .page-exiting #home-root [data-section="9"] { transition-delay: 0.32s; }
                .page-exiting #home-root [data-section="10"] { transition-delay: 0.36s; }
                .page-exiting #home-root [data-section="11"] { transition-delay: 0.40s; }
                .page-exiting #home-root [data-section="12"] { transition-delay: 0.44s; }
                .page-exiting #home-root [data-section="13"] { transition-delay: 0.48s; }
                .page-exiting #home-root [data-section="14"] { transition-delay: 0.52s; }
            `}</style>
        {/* Navigation Bar — always visible, not part of materialization */}
        <div>
          <TopNavbar
            onNavigate={onNavigate}
            onLogin={onLogin}
            isLight={isOverWhite}
            isDark={!isOverWhite}
            onLoginModalOpen={onLoginModalOpen}
            onBecomeMemberOpen={onBecomeMemberOpen}
            pathwayGridRef={pathwayGridRef}
            currentPage="home"
          />
        </div>

        <div data-section="2">
          <HomeLabel />
        </div>

        {/* Enrollment Confirmation Modal */}
        <AnimatePresence>
          {showEnrollmentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-24 p-4 bg-slate-900/60 backdrop-blur-[8px]"
              onClick={() => setShowEnrollmentModal(false)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-[90vw] md:max-w-[700px] pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowEnrollmentModal(false)}
                  className="absolute -top-3 -right-3 z-20 w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-black/40 border-2 border-white/20 transition-all hover:scale-110"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/65 to-slate-950/80 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-[12px] rounded-2xl">
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 45%)',
                    }}
                  />

                  {/* Header */}
                  <div className="relative p-2 md:p-3 text-center border-b border-white/10">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] uppercase tracking-[0.15em] text-emerald-200/90 font-black">
                        Live Confirmation
                      </span>
                    </div>
                    <h2 className="text-sm md:text-lg font-serif text-white leading-tight">
                      Enrollment Confirmed
                    </h2>
                    <p className="text-white/60 text-[10px] mt-1 max-w-lg mx-auto">
                      You are now enrolled in the Foundation Program. Choose your next step below.
                    </p>
                  </div>

                  {/* Cards Grid */}
                  <div className="relative p-2 md:p-3 grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2">
                    {/* Card 1: Access Foundation Program */}
                    <button
                      onClick={() => {
                        setShowEnrollmentModal(false);
                        onNavigate('access-portal-2?tab=programs');
                      }}
                      className="group relative text-left overflow-hidden border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/30"
                    >
                      <div className="relative aspect-[9/16] overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/dridtecu6/image/upload/v1777590658/newsroom/b81ubzdpz0dmyqutiyqj.png"
                          alt="Foundation Program"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                        <div className="absolute top-1 left-1">
                          <span className="px-1 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] bg-blue-500/80 text-white border border-white/30 backdrop-blur-sm">
                            Primary
                          </span>
                        </div>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <h3 className="text-[10px] md:text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                          Access Foundation Program
                        </h3>
                        <p className="text-[9px] text-white/60 leading-tight">
                          Enter your program dashboard, track progress, and access all training
                          materials.
                        </p>
                        <div className="flex items-center gap-0.5 pt-0.5">
                          <Zap className="w-2.5 h-2.5 text-blue-400" />
                          <span className="text-[8px] uppercase tracking-[0.1em] text-blue-300/80">
                            Dashboard
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Card 2: Build Your Profile */}
                    <button
                      onClick={() => {
                        setShowEnrollmentModal(false);
                        onNavigate('become-member');
                      }}
                      className="group relative text-left overflow-hidden border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/30"
                    >
                      <div className="relative aspect-[9/16] overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/dridtecu6/image/upload/v1777590630/newsroom/kvos2ityyztesx5idue2.png"
                          alt="Build Profile"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                        <div className="absolute top-1 left-1">
                          <span className="px-1 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] bg-amber-500/80 text-white border border-white/30 backdrop-blur-sm">
                            Essential
                          </span>
                        </div>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <h3 className="text-[10px] md:text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                          Build Your Profile
                        </h3>
                        <p className="text-[9px] text-white/60 leading-tight">
                          Complete your pilot recognition profile to unlock pathway matching and
                          scoring.
                        </p>
                        <div className="flex items-center gap-0.5 pt-0.5">
                          <User className="w-2.5 h-2.5 text-amber-400" />
                          <span className="text-[8px] uppercase tracking-[0.1em] text-amber-300/80">
                            Recognition
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Card 3: Explore Pathways */}
                    <button
                      onClick={() => {
                        setShowEnrollmentModal(false);
                        onNavigate('recognition-career-matches');
                      }}
                      className="group relative text-left overflow-hidden border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/30"
                    >
                      <div className="relative aspect-[9/16] overflow-hidden">
                        <img
                          src="https://res.cloudinary.com/dridtecu6/image/upload/v1777590647/newsroom/tws5xzryqjepzxoyc94d.png"
                          alt="Explore Pathways"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                        <div className="absolute top-1 left-1">
                          <span className="px-1 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] bg-red-500/80 text-red-100 border border-red-300/30 backdrop-blur-sm">
                            Discover
                          </span>
                        </div>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <h3 className="text-[10px] md:text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          Explore Pathways
                        </h3>
                        <p className="text-[9px] text-white/60 leading-tight">
                          Discover airline expectations, cadet programs, and career transition
                          routes.
                        </p>
                        <div className="flex items-center gap-0.5 pt-0.5">
                          <Navigation className="w-2.5 h-2.5 text-emerald-400" />
                          <span className="text-[8px] uppercase tracking-[0.1em] text-emerald-300/80">
                            Pathways
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="relative px-2 md:px-3 py-1.5 border-t border-white/10 bg-slate-900/30">
                    <button
                      onClick={() => setShowEnrollmentModal(false)}
                      className="w-full py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white/90 transition-colors border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
                    >
                      Continue to Home
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MeshGradient Background - Same as TypeRatingSearchPage */}
        <div data-section="3" className="relative w-full min-h-screen overflow-hidden">
          <div className="fixed inset-0 z-0">
            {graphicsConfig ? (
              <MeshGradient
                className="w-full h-full"
                colors={
                  isDarkMode
                    ? ['#020617', '#0f172a', '#1e293b', '#1e3a5f', '#111827']
                    : [
                        '#dbeafe',
                        '#94a3b8',
                        '#64748b',
                        '#475569',
                        '#334155',
                        '#1e3a5f',
                        '#1e3a8a',
                        '#0f172a',
                      ]
                }
                speed={graphicsConfig.meshGradientSpeed}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(160deg, #020617 0%, #0f172a 40%, #111827 100%)'
                    : 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%)',
                }}
              />
            )}
          </div>

          {/* Flight Simulator Style Grid */}
          {deviceTier === 'low' ? (
            // Lazy load PathwayGrid for low-end devices
            <React.Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-white">
                  Loading...
                </div>
              }
            >
              <div ref={pathwayGridRef} className="relative z-0 pt-12 md:pt-16">
                <PathwayGrid
                  slides={allSlides}
                  onNavigate={onNavigate}
                  onGoToProgramDetail={onGoToProgramDetail}
                  onLogin={onLogin}
                  onBecomeMemberOpen={onJoinUs}
                  isLoggedIn={isLoggedIn}
                  isEnrolledInFoundation={isEnrolledInFoundation}
                />
              </div>
            </React.Suspense>
          ) : (
            <div ref={pathwayGridRef} className="relative z-0 pt-12 md:pt-16">
              <PathwayGrid
                slides={allSlides}
                onNavigate={onNavigate}
                onGoToProgramDetail={onGoToProgramDetail}
                onLogin={onLogin}
                onBecomeMemberOpen={onJoinUs}
                isLoggedIn={isLoggedIn}
                isEnrolledInFoundation={isEnrolledInFoundation}
              />
            </div>
          )}
        </div>

        {/* === BECOME A MEMBER BANNER === */}
        <div data-section="4" className="relative z-30 w-full px-4 md:px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <div
              className="relative overflow-hidden shadow-xl"
              style={{ backgroundColor: '#0d1b3e' }}
            >
              <div className="px-8 py-8 md:px-10 md:py-10 flex flex-col lg:flex-row items-center gap-8 min-h-[280px]">
                <div className="w-full lg:w-7/12">
                  <h2
                    className="text-2xl md:text-4xl font-semibold mb-4 leading-tight"
                    style={{ color: '#ffffff' }}
                  >
                    Discover <span style={{ color: '#dc2626' }}>pathways</span>, align your profile
                    with operator{' '}
                    <span style={{ color: '#dc2626' }}>requirements and expectations</span>.
                  </h2>
                  <p
                    className="text-sm md:text-base leading-relaxed max-w-2xl"
                    style={{ color: '#ffffff', opacity: 0.9 }}
                  >
                    Create your pilot profile for free, and get verified with{' '}
                    <span style={{ color: '#dc2626' }}>Recognition+</span>.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onNavigate?.('become-member')}
                      className="px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 text-left"
                      style={{ backgroundColor: '#ffffff', color: '#0d1b3e' }}
                    >
                      <span className="block">Create free account</span>
                      <span className="block text-xs font-normal mt-1" style={{ color: '#475569' }}>
                        Get <span style={{ color: '#dc2626' }}>Recognition+</span> verified
                      </span>
                    </button>
                    <a
                      href="https://pilotcareerpathways.com"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center justify-center px-7 py-3 rounded-xl font-semibold text-sm transition-all border hover:bg-white/10"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#ffffff',
                        borderColor: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      Visit pilotcareerpathways.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === INDUSTRY PARTNER HEADLINES === */}
        <div
          data-section="5"
          className="relative z-30 w-full bg-white border-b border-slate-100 px-4 md:px-8 py-5 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto mb-3 text-center">
            <h4
              className="text-2xl md:text-3xl text-slate-900 font-normal"
              style={{ fontFamily: 'Georgia, "Helvetica Neue", Arial, sans-serif' }}
            >
              Aviation industry first pilot <span className="text-red-500">recognition</span>{' '}
              platform built for
            </h4>
            <div className="mt-5">
              <button
                onClick={() => onNavigate?.('enterprise-access')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
              >
                Learn more for Aviation Industry
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 w-16 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div className="absolute inset-y-0 right-0 w-16 pointer-events-none bg-gradient-to-l from-white to-transparent" />
            <div className="flex gap-8 whitespace-nowrap animate-marquee text-slate-900 font-semibold text-sm md:text-base">
              <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">
                For <span className="text-red-500">airlines</span>: trusted profiles matched to
                airline needs.
              </span>
              <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">
                For <span className="text-red-500">ATOs</span>: training outcomes linked to verified
                career pathways.
              </span>
              <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">
                For <span className="text-red-500">Civil Aviation Regulators</span>: transparent
                oversight for modern pilot standards.
              </span>
              <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">
                For <span className="text-red-500">Charter & Private sector</span>: premium pilots
                aligned to private operator requirements.
              </span>
              <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">
                For <span className="text-red-500">Humanitarian Flight Operations</span>:
                ready-to-deploy pilot profiles built for relief missions.
              </span>
              <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">
                For <span className="text-red-500">airlines</span>: trusted profiles matched to
                airline needs.
              </span>
              <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">
                For <span className="text-red-500">ATOs</span>: training outcomes linked to verified
                career pathways.
              </span>
              <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">
                For <span className="text-red-500">Civil Aviation Regulators</span>: transparent
                oversight for modern pilot standards.
              </span>
              <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">
                For <span className="text-red-500">Charter & Private sector</span>: premium pilots
                aligned to private operator requirements.
              </span>
              <span className="inline-flex items-center gap-1">
                For <span className="text-red-500">Humanitarian Flight Operations</span>:
                ready-to-deploy pilot profiles built for relief missions.
              </span>
            </div>
          </div>
          <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                    .animate-marquee { animation: marquee 35s linear infinite; }
                `}</style>
        </div>

        {/* === FULL IMAGE BANNER - Split Layout === */}
        <div
          data-section="6"
          className="relative z-30 w-full h-[400px] md:h-[520px] lg:h-[600px] overflow-hidden flex"
        >
          {/* Left Half - Text Content */}
          <div className="relative z-10 w-1/2 flex items-center bg-slate-950 px-8 md:px-14 lg:px-20">
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                <span className="text-red-500">Recognition+</span> Unlocks
              </h3>
              <p className="text-slate-300 text-sm md:text-base mb-6 max-w-sm">
                Get the recognition you deserve. Background screened, prepared through programs,
                connected to pathways — giving your profile the edge that airlines notice.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={() => onNavigate?.('recognition-plus')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 font-semibold text-sm rounded-full hover:bg-slate-100 transition-colors shadow-lg group"
                >
                  <span>
                    Secure your Profile with <span className="text-red-500">Recognition+</span>
                  </span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 12h4m0 0l-2-2m2 2l-2 2"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onNavigate?.('pilot-recognition')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-full transition-all hover:bg-white/20"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  Learn more about Recognition Profile
                </button>
              </div>
            </div>
          </div>

          {/* Right Half - Image with gradient fade from left */}
          <div className="relative w-1/2">
            <img
              src="/images/set-03-recognition/recognition-unlock.png"
              alt="Recognition+ Unlocks"
              className="w-full h-full object-cover"
              style={{ objectPosition: '20% center' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1600&q=80';
              }}
            />
            {/* Gradient fade from left (slate-950) to transparent */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, #020617 0%, rgba(2,6,23,0.6) 30%, transparent 70%)',
              }}
            />
          </div>
        </div>

        {/* === DISCOVER PILOT RECOGNITION === */}
        <div
          data-section="7"
          className="relative z-10 bg-white w-full py-12 md:py-16 overflow-hidden"
        >
          <div className="absolute inset-y-0 right-0 hidden md:block w-[48vw] lg:w-[50vw] xl:w-[52vw]">
            <div
              className="absolute inset-0 bg-contain bg-right bg-no-repeat bg-white"
              style={{ backgroundImage: "url('/images/set-03-recognition/recog6.png')" }}
            />
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,40%)_minmax(0,60%)] gap-8 md:gap-12 items-start">
              {/* Left Side - Text Content */}
              <div className="relative z-10 pl-4 md:pl-10 pr-4 md:pr-0">
                <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-red-500 mb-4">
                  Recognition Dashboard
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                  Keeping your profile <span className="text-red-500">compliant, current,</span> and
                  operator-ready
                </h2>
                <p className="text-slate-600 text-sm md:text-base mb-8 leading-relaxed">
                  Keeps regulators and operators aligned with your latest verified status. This live
                  pilot profile tracks last flown time, synced logbook hours, and credential expiry
                  so your profile stays safe and operator-ready.
                </p>

                <div className="md:hidden mb-6">
                  <div className="relative w-full h-[200px] overflow-hidden rounded-[28px] bg-slate-100">
                    <img
                      src="/images/set-03-recognition/recog6.png"
                      alt="Recognition dashboard"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Three Key Features */}
                <div className="space-y-4 mb-6">
                  <div className="flex gap-3 items-start rounded-3xl bg-slate-100/80 border border-slate-200 p-4 md:p-5">
                    <div className="flex-shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-3xl bg-slate-900/5 border border-slate-200 shadow-sm flex items-center justify-center text-slate-900">
                      <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1">
                        Recognition Status
                      </h3>
                      <p className="text-sm md:text-sm text-slate-600 leading-snug">
                        Real-time status for your credentials, last flown hours, and logbook sync so
                        you always know when your profile is ready for operator review.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start rounded-3xl bg-slate-100/80 border border-slate-200 p-4 md:p-5">
                    <div className="flex-shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-3xl bg-slate-900/5 border border-slate-200 shadow-sm flex items-center justify-center text-slate-900">
                      <Clock className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1">
                        Gap Analysis
                      </h3>
                      <p className="text-sm md:text-sm text-slate-600 leading-snug">
                        See where your synced logbook hours, expiring licenses, and training
                        credentials align with airline pathways so you can fix gaps before operators
                        evaluate your profile.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start rounded-3xl bg-slate-100/80 border border-slate-200 p-4 md:p-5">
                    <div className="flex-shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-3xl bg-slate-900/5 border border-slate-200 shadow-sm flex items-center justify-center text-slate-900">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1">
                        Operator Pull
                      </h3>
                      <p className="text-sm md:text-sm text-slate-600 leading-snug">
                        Operators with enterprise access pull directly from the verified system, and
                        we automatically restrict submissions when credentials are about to expire
                        to protect safety and compliance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate?.('become-member')}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
                  >
                    Build Your Profile
                  </button>
                  <button
                    onClick={() => onNavigate?.('pilot-recognition')}
                    className="px-6 py-3 border border-slate-300 hover:border-slate-900 text-slate-900 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === DISCOVER PATHWAYS - Three Vertical Cards === */}
        <div data-section="8" className="relative z-10 bg-white">
          <div className="relative z-30 w-full px-3 sm:px-4 md:px-8 lg:px-12 xl:px-16 pb-6 sm:pb-8 pt-8 sm:pt-10 md:pt-12">
            <div className="max-w-7xl mx-auto">
              {/* Section Header - Centered */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  Discover <span className="text-black">PilotTerminal.com</span>{' '}
                  <span className="text-black">Pilot pathways</span>
                </h2>
                <p className="text-slate-600 text-sm md:text-base">
                  One profile across three platforms
                </p>
              </div>

              {/* Three Cards Grid - Portal Pathways Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto pb-8">
                {/* Card 1 - Pilot Terminal */}
                <div
                  onClick={() =>
                    window.open('https://pilotterminal.com', '_blank', 'noopener,noreferrer')
                  }
                  className="group relative overflow-hidden rounded-xl cursor-pointer border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 order-3 md:order-1 h-[220px] sm:h-auto sm:aspect-auto sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px] xl:min-h-[420px] 2xl:min-h-[480px]"
                >
                  {/* Full Background Image */}
                  <img
                    src="/images/set-04-screenshots/terminal.png"
                    alt="Pilot Terminal Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="absolute top-4 left-4 z-20 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-100">
                      Connect
                    </div>

                    {/* Bottom Text Bar */}
                    <div className="mt-auto bg-white/95 px-4 py-4">
                      <h4 className="text-black font-bold text-lg sm:text-base uppercase tracking-[0.15em]">
                        Pilot<span className="text-red-500">Terminal</span>
                        <span className="text-black">.com</span>
                      </h4>
                      <p className="text-slate-600 text-xs sm:text-[11px] mt-1">
                        Professional pilot network and flight deck tools
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Pilot Shortage */}
                <div
                  onClick={() =>
                    window.open('https://pilotshortage.org', '_blank', 'noopener,noreferrer')
                  }
                  className="group relative overflow-hidden rounded-xl cursor-pointer border border-slate-700 hover:border-blue-500/50 transition-all duration-300 order-2 md:order-2 h-[220px] sm:h-auto sm:aspect-auto sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px] xl:min-h-[420px] 2xl:min-h-[480px]"
                >
                  {/* Full Background Image */}
                  <img
                    src={pilotShortageImages[pilotShortageImageIndex]}
                    alt="Pilot Shortage Event"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="absolute top-4 left-4 z-20 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-100">
                      Serve communities
                    </div>

                    {/* Bottom Text Bar */}
                    <div className="mt-auto bg-white/95 px-4 py-4">
                      <h4 className="text-black font-bold text-lg sm:text-base uppercase tracking-[0.15em]">
                        pilot<span className="text-red-500">shortage</span>.org
                      </h4>
                      <p className="text-slate-600 text-xs sm:text-[11px] mt-1">
                        Global pilot shortage analytics and industry insights
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Pilot Pathways */}
                <div
                  onClick={() => onNavigate?.('discover-pathways')}
                  className="group relative overflow-hidden rounded-xl cursor-pointer border border-slate-700 hover:border-blue-500/50 transition-all duration-300 order-1 md:order-3 h-[220px] sm:h-auto sm:aspect-auto sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px] xl:min-h-[420px] 2xl:min-h-[480px]"
                >
                  {/* Shuffling Background Images */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={platformImageIndex}
                      src={platformImages[platformImageIndex]}
                      alt="Pilot Pathways Background"
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="absolute top-4 left-4 z-20 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-100">
                      Save lives
                    </div>

                    {/* Bottom Text Bar */}
                    <div className="mt-auto bg-white/95 px-4 py-4">
                      <h4 className="text-black font-bold text-lg sm:text-base uppercase tracking-[0.15em]">
                        pilot<span className="text-black">career</span>
                        <span className="text-red-500">pathways</span>
                        <span className="text-black">.coim</span>
                      </h4>
                      <p className="text-slate-600 text-xs sm:text-[11px] mt-1">
                        Career pathways from student to captain
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === PLATFORM NEWS UPDATES === */}
        <div data-section="9" className="relative z-30 w-full px-3 sm:px-4 md:px-8 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-slate-200 shadow-2xl">
              <div className="px-5 py-4 sm:px-7 sm:py-5 rounded-t-[2rem] bg-red-600 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.24em] font-semibold text-white border border-white/20">
                  Platform Updates
                </div>
                <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-white">
                  Latest platform stories shaping pilot progression
                </h3>
              </div>
              <div className="px-5 pb-5 sm:px-7 sm:pb-6 bg-white">
                <p className="text-sm sm:text-base text-slate-700 max-w-2xl">
                  Stay current with platform-specific updates from Pilot Pathways,
                  PilotShortage.org, and Pilot Terminal.
                </p>
              </div>

              <div className="relative overflow-hidden p-4 sm:p-5 bg-slate-100/20 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-900/10 rounded-[1.75rem]">
                <div className="absolute inset-0 bg-slate-200/20 backdrop-blur-xl pointer-events-none" />
                <div
                  className="relative flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${activeBillboardSlide * 100}%)` }}
                >
                  <article className="min-w-full rounded-[1.7rem] border border-white/30 bg-white/70 backdrop-blur-xl p-5 shadow-xl shadow-slate-900/10 ring-1 ring-white/30">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] font-semibold text-red-600">
                          Pilot Pathways
                        </p>
                        <h4 className="mt-3 text-xl font-semibold text-slate-950">
                          New expectations from 10+ airlines
                        </h4>
                      </div>
                      <Globe className="h-7 w-7 text-red-600" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-700">
                      Updated requirements and expectation changes from more than 10 airlines and
                      operators are now reflected across the pathways guidance.
                    </p>
                    <button
                      onClick={() => onNavigate?.('pathways-modern')}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Review pathway updates
                    </button>
                  </article>

                  <article className="min-w-full rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] font-semibold text-red-600">
                          pilotshortage.org
                        </p>
                        <h4 className="mt-3 text-xl font-semibold text-slate-950">
                          Foundation program mentorship grows
                        </h4>
                      </div>
                      <Zap className="h-7 w-7 text-red-600" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-700">
                      The platform now features a 50-pilot mentorship foundation program that pairs
                      experienced crew with aspiring aviators.
                    </p>
                    <button
                      onClick={() => onNavigate?.('foundation-program')}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Explore the mentorship program
                    </button>
                  </article>

                  <article className="min-w-full rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] font-semibold text-red-600">
                          Pilot Terminal
                        </p>
                        <h4 className="mt-3 text-xl font-semibold text-slate-950">
                          Discussion on Boeing 797 progression
                        </h4>
                      </div>
                      <Layers className="h-7 w-7 text-red-600" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-700">
                      Pilot Terminal conversations now explore the new Boeing 797 and how future
                      type ratings will be impacted.
                    </p>
                    <button
                      onClick={() => onNavigate?.('pilot-recognition-profile')}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      See the latest terminal news
                    </button>
                  </article>
                </div>

                <div className="mt-4 flex justify-center gap-2">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => setActiveBillboardSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeBillboardSlide === index ? 'w-10 bg-red-600' : 'w-6 bg-slate-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === RECOMMENDED PATHWAYS CAROUSEL === */}
        <div
          data-section="10"
          className="relative z-30 w-full px-3 sm:px-4 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                Recommended <span className="text-red-500">Pathways</span>
              </h2>
              <p className="text-slate-600 text-sm mb-4">
                26 pathways matched to your Recognition Profile
              </p>

              {/* Match Filter */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { key: 'all' as const, label: 'All' },
                  { key: 'low' as const, label: 'Low 60-75%' },
                  { key: 'mid' as const, label: 'Mid 75-90%' },
                  { key: 'high' as const, label: 'High 90%+' },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveMatchFilter(filter.key)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeMatchFilter === filter.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hint */}
            <div className="text-center mb-4">
              <span className="text-sm text-slate-500">
                Swipe left or right and click to select a card
              </span>
            </div>

            {/* Horizontal Scrolling Carousel */}
            <div className="relative w-full mb-6">
              <style>{`
                            .top-rec-carousel::-webkit-scrollbar { display: none; }
                            .top-rec-carousel { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; scroll-behavior: smooth; }
                            .top-rec-carousel > div { scroll-snap-align: center; }
                        `}</style>
              <div
                ref={topRecommendedCarouselRef}
                className="top-rec-carousel flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  cursor: 'grab',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                }}
              >
                {/* Featured Card - Foundation Program */}
                <div
                  className="flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 p-[3px] scale-95 hover:scale-100"
                  style={{ width: '600px' }}
                  onClick={(e) => {
                    setSelectedCarouselPathway({
                      id: 'FOUNDATION-PROGRAM-ENROLL',
                      title: 'Foundation Program',
                      company: 'PilotRecognition',
                      location: 'Global',
                      tags: ['Featured Program', '50 Hours Mentorship'],
                    });
                    const card = e.currentTarget;
                    const carousel = topRecommendedCarouselRef.current;
                    if (carousel && card)
                      carousel.scrollLeft =
                        card.offsetLeft - carousel.offsetWidth / 2 + card.offsetWidth / 2;
                  }}
                >
                  <div className="relative h-[300px] overflow-hidden rounded-xl bg-slate-800">
                    <img
                      src="/images/set-08-website/program1.png"
                      alt="Foundation Program"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-500/90 text-white text-xs font-semibold">
                        Featured
                      </span>
                      <span className="px-3 py-1 rounded-full bg-sky-500/90 text-white text-xs font-semibold">
                        PR: 77%
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                      <h4 className="text-lg font-serif font-normal text-white">
                        Foundation Program
                      </h4>
                      <p className="text-white/80 text-sm">PilotRecognition · Global</p>
                    </div>
                  </div>
                </div>

                {/* Pathway Cards */}
                {HOME_PATHWAYS.filter((pathway) => {
                  if (activeMatchFilter === 'all') return true;
                  if (activeMatchFilter === 'low')
                    return pathway.matchProbability >= 60 && pathway.matchProbability < 75;
                  if (activeMatchFilter === 'mid')
                    return pathway.matchProbability >= 75 && pathway.matchProbability < 90;
                  return pathway.matchProbability >= 90;
                }).map((pathway) => (
                  <div
                    key={pathway.id}
                    className="flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 p-[3px] scale-95 hover:scale-100"
                    style={{ width: '600px' }}
                    onClick={(e) => {
                      setSelectedCarouselPathway(pathway);
                      const card = e.currentTarget;
                      const carousel = topRecommendedCarouselRef.current;
                      if (carousel && card)
                        carousel.scrollLeft =
                          card.offsetLeft - carousel.offsetWidth / 2 + card.offsetWidth / 2;
                    }}
                  >
                    <div className="relative h-[300px] overflow-hidden rounded-xl bg-slate-800">
                      <img
                        src={pathway.image}
                        alt={pathway.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/default-airline.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold">
                          {pathway.matchProbability}% Match
                        </span>
                        <span className="px-3 py-1 rounded-full bg-sky-500/90 text-white text-xs font-semibold">
                          PR: {pathway.pr}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        <p className="text-[10px] font-bold tracking-wider uppercase text-blue-300 mb-1">
                          {pathway.category}
                        </p>
                        <h4 className="text-base font-serif font-normal text-white">
                          {pathway.title}
                        </h4>
                        <p className="text-white/70 text-sm">{pathway.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Pathway Panel */}
            {(() => {
              const filteredPathways = HOME_PATHWAYS.filter((pathway) => {
                if (activeMatchFilter === 'all') return true;
                if (activeMatchFilter === 'low')
                  return pathway.matchProbability >= 60 && pathway.matchProbability < 75;
                if (activeMatchFilter === 'mid')
                  return pathway.matchProbability >= 75 && pathway.matchProbability < 90;
                return pathway.matchProbability >= 90;
              });
              // cards[0] = intro Foundation card, cards[1..n] = filteredPathways[0..n-1]
              const introCard = {
                id: 'FOUNDATION-PROGRAM-ENROLL',
                title: 'Foundation Program',
                company: 'PilotRecognition',
                location: 'Global',
                tags: ['Featured Program', '50 Hours Mentorship'],
              };
              const allCardData = [introCard, ...filteredPathways];

              const navigateCarousel = (direction: 'prev' | 'next') => {
                const carousel = topRecommendedCarouselRef.current;
                if (!carousel) return;
                const cards = Array.from(carousel.children) as HTMLElement[];
                const center = carousel.scrollLeft + carousel.offsetWidth / 2;
                let closest = 0;
                let minDist = Infinity;
                cards.forEach((card, i) => {
                  const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
                  if (dist < minDist) {
                    minDist = dist;
                    closest = i;
                  }
                });
                const targetIdx =
                  direction === 'prev'
                    ? Math.max(0, closest - 1)
                    : Math.min(cards.length - 1, closest + 1);
                const targetCard = cards[targetIdx];
                if (targetCard) {
                  carousel.scrollLeft =
                    targetCard.offsetLeft - carousel.offsetWidth / 2 + targetCard.offsetWidth / 2;
                  const pathway = allCardData[targetIdx];
                  if (pathway) setSelectedCarouselPathway(pathway);
                }
              };

              return selectedCarouselPathway ? (
                <div className="flex items-center justify-center gap-4 mt-2 mb-4">
                  <button
                    onClick={() => navigateCarousel('prev')}
                    className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 text-xl font-bold transition-colors flex-shrink-0"
                  >
                    ‹
                  </button>
                  <div className="text-center max-w-xl">
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                      Selected Pathway
                    </p>
                    <h3 className="text-xl font-serif font-normal text-slate-900 mb-1">
                      {selectedCarouselPathway.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {selectedCarouselPathway.company} · {selectedCarouselPathway.location}
                    </p>
                    <p className="text-sm text-slate-500 mb-4">
                      {selectedCarouselPathway.tags?.[0] || 'Explore this pathway'}
                    </p>
                    <a
                      href="https://pilotcareerpathways.com"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex px-8 py-3 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all"
                    >
                      Visit pilotcareerpathways.com
                    </a>
                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      Your Recognition Profile auto syncs for pathway submissions.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      This is not a job board but a pooling of interest system posted by the
                      operator to receive insights and network with pilots through fair, two-way
                      private communications between pilot and industry.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateCarousel('next')}
                    className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 text-xl font-bold transition-colors flex-shrink-0"
                  >
                    ›
                  </button>
                </div>
              ) : null;
            })()}
          </div>
        </div>

        {/* === DISCOVER PROGRAMS SECTION === */}
        <div data-section="11" className="relative z-30 bg-white w-full px-4 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Section Header - Centered */}
            <div className="mb-6 text-center">
              <h2
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 cursor-pointer hover:text-red-600 transition-colors inline-block"
                onClick={() => onNavigate('discover-programs')}
              >
                Discover programs through <span className="text-red-500">pilotshortage.org</span>
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                Structured training pathways from flight school to airline-ready professional
              </p>
            </div>
            {/* Foundation Program Showcase */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-0">
                {/* Left - Image */}
                <div className="relative bg-slate-900 flex items-center justify-center">
                  <img
                    src="/images/set-03-recognition/pr2.png"
                    alt="Foundation Program Certificate of Completion"
                    className="w-full h-auto object-contain block"
                  />
                </div>
                {/* Right - Content */}
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-3">
                    Foundation Program
                  </p>
                  <h3
                    className="text-2xl md:text-3xl text-slate-900 mb-4"
                    style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal' }}
                  >
                    Complete the Foundation Program
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    50 hours of verified mentorship with industry professionals. EBT CBTA-aligned
                    competency assessment that measures your readiness against real airline
                    standards. Upon completion, your Recognition Profile is elevated with verified
                    credentials.
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    The Foundation Program mission is aimed at aligning graduating pilots to mentor
                    the next generation while building captain leadership, EBT/CBTA, and
                    Airbus-aligned skills needed to traverse into the airline industry.
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Prepare yourself with a pilot self-development program that can continue into
                    our Transition Program with a graduate discount, including EBT CBTA
                    familiarization, sponsor internships, operations with selected operators, and
                    industry-connected interviews aligned to EBT fundamentals.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <a
                      href="https://pilotshortage.org"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all hover:scale-105"
                    >
                      Become a member at pilotshortage.org
                    </a>
                    <a
                      href="/foundation-program"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all hover:scale-105"
                    >
                      Enroll for Foundation Program
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    Certification of completion and verification charges apply
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Blur Transition between PathwayGrid and Showcase */}
        <div className="relative h-32 w-full z-40 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(15,23,42,0.3) 40%, rgba(15,23,42,0.7) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
            }}
          />
        </div>

        {/* === AIRBNB-STYLE SHOWCASE SECTION REMOVED === */}

        {/* About Us section - Moved above iPad section */}
        <div data-section="12" className="relative bg-white pt-24 pb-12 px-6">
          <div className="max-w-6xl mx-auto text-center relative z-20">
            <p className="text-lg font-bold tracking-[0.5em] uppercase text-blue-700 mb-4">
              ABOUT US
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 leading-tight mb-6">
              About PilotRecognition
            </h2>

            <div className="max-w-4xl mx-auto space-y-6 mb-12 text-left">
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-sans">
                Aviation's first pilot-owned career platform. The industry has never given pilots
                the infrastructure to prove who they are — only the paperwork to survive audits.
                PilotRecognition fixes that. You sync your logbook, verify your license, medical,
                and credentials through international verification providers, and build a
                recognition profile that reflects what you've actually done — not just what you
                claim. Your credentials are issued as sovereign W3C Verified Credential tokens to
                your own cryptographic wallet. The platform never retains your documents after
                verification. We receive the confirmation — not the paper.
              </p>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-sans">
                It is not a job board but a professional networking platform—similar to LinkedIn for
                the aviation industry. Instead of pilots sending CVs into a void, operators post
                pathway cards showing exactly what they need: hours, ratings, nationality
                requirements, type rating preferences, experience level. You align your profile
                against those requirements and submit interest. If an operator wants to move
                forward, they send you a consent message — free. They may include a confidential
                offer document that self-destructs within 5 days of inactivity. You read it,
                negotiate if needed, and decide. Operators pay a flat annual subscription for
                advanced search tools; there are absolutely no success, connection, or placement
                fees for either side.
              </p>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-sans">
                The Foundation Program builds the verified competency record operators look for. It
                covers 50 hours of logged mentorship, EBT CBTA-aligned industry education, type
                rating investment risk management, and a practical mentorship interview. Free to
                enter. Certification is $49 at completion. Everything you complete is appended to
                your profile and made available to operators with your consent.
              </p>
            </div>

            <button
              onClick={() => onNavigate('accreditation')}
              className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-700 hover:text-blue-900 transition-colors flex items-center justify-center gap-2 mx-auto group"
            >
              LEARN MORE ABOUT OUR ACCREDITATIONS AND SUPPORT PROVIDED{' '}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative bg-white">
          {/* Accreditation and Recognition Logos - Marquee (Full Width) */}
          <div className="relative w-full overflow-hidden bg-white pb-10">
            <div className="relative w-full pt-8">
              <div className="text-center relative z-10 mb-6">
                <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-blue-700 mb-2">
                  RECOGNITION | ASSURANCE | SUPPORT
                </p>
                <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  Strategic presence at the Etihad Museum UAE Career Fair, represented by leading
                  aviation governing bodies.
                </p>
              </div>

              <div className="relative py-6 z-10 flex overflow-hidden group">
                {/* Gradient Masks for Fade/Glass Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20"></div>

                <div className="flex gap-16 animate-marquee whitespace-nowrap min-w-full pl-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-16 items-center shrink-0">
                      <img
                        src={IMAGES.ACCREDITATION_1}
                        alt="FAA"
                        className="h-14 w-auto object-contain"
                      />
                      <img
                        src={IMAGES.ACCREDITATION_3}
                        alt="GCAA"
                        className="h-14 w-auto object-contain"
                      />
                      {/* Airbus logo removed — Wikimedia source no longer available */}
                      <img
                        src={IMAGES.ACCREDITATION_5}
                        alt="WM Group"
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Join The Network Section - Simplified */}
          <div
            className="relative py-8 md:py-12 px-4 md:px-6 bg-[#05091a] overflow-hidden"
            id="join-network-section"
          >
            {/* MeshGradient Background - Deep navy/blue palette */}
            <div className="absolute inset-0 z-0 h-full w-full">
              {graphicsConfig?.enableMeshGradient ? (
                <MeshGradient
                  className="w-full h-full"
                  colors={[
                    '#05091a',
                    '#080e2a',
                    '#0a1240',
                    '#0d1850',
                    '#0f2060',
                    '#112878',
                    '#1e3a8a',
                    '#1e40af',
                    '#1d4ed8',
                  ]}
                  speed={graphicsConfig.meshGradientSpeed}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'linear-gradient(180deg, #1e3a8a 0%, #0f2060 40%, #080e2a 75%, #05091a 100%)',
                  }}
                />
              )}
              {/* Deep blue overlay — dark blue at top, deeper navy at bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(8,14,50,0.75) 0%, rgba(5,10,35,0.82) 40%, rgba(3,6,20,0.94) 100%)',
                }}
              />
              {graphicsConfig?.enableBackdropBlur && (
                <div className="absolute inset-0 backdrop-blur-[1px]" />
              )}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-12">
                <AnimatedHeader />
              </div>
            </div>
          </div>
        </div>

        {/* Domain Links Bar */}
        <div className="bg-black border-y border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-8 md:gap-12">
              {/* PilotTerminal.com */}
              <a
                href="https://pilotterminal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
              >
                <span className="text-white">Pilot</span>
                <span className="text-yellow-400">Terminal</span>
                <span className="text-gray-500">.com</span>
                <svg
                  className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>

              <span className="text-gray-700">|</span>

              {/* PilotShortage.org */}
              <a
                href="https://pilotshortage.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
              >
                <span className="text-white">Pilot</span>
                <span className="text-red-500">Shortage</span>
                <span className="text-gray-500">.org</span>
                <svg
                  className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>

              <span className="text-gray-700">|</span>

              {/* PilotCareerPathways.com */}
              <a
                href="https://pilotcareerpathways.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
              >
                <span className="text-white">Pilot</span>
                <span className="text-green-400">CareerPathways</span>
                <span className="text-gray-500">.com</span>
                <svg
                  className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          data-section="13"
          className="relative z-10 mt-auto bg-slate-900 text-white py-12 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-lg mb-4">PilotRecognition</h3>
                <p className="text-slate-400 text-sm">
                  The Aviation Industry's First Pilot Recognition-Based Platform
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Platform</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>
                    <button
                      onClick={() => onNavigate('recognition-plus')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Pilot Recognition
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('recognition-career-matches')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Pathways
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('programs')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Programs
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('airline-expectations')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Airline Expectations
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Programs</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>
                    <button
                      onClick={() => onNavigate('foundational-program')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Foundation Program
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('transition-program')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Transition Program
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('airbus-aligned-ebt-cbta-programs')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      EBT CBTA
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('become-member')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Become a Member
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Contact</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>
                    <a
                      href="mailto:contact@pilotrecognition.com"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      contact@pilotrecognition.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:contact@pilotrecognition.com"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      contact@pilotrecognition.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:enterprise@pilotrecognition.com"
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      enterprise@pilotrecognition.com
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Legal</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>
                    <button
                      onClick={() => onNavigate('privacy-policy')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('terms-of-service')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('cookie-policy')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Cookie Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('terms-of-service')}
                      className="hover:text-white cursor-pointer transition-colors text-left"
                    >
                      Our Services
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
              <p>
                &copy; 2024 PilotRecognition - Benjamin Bowler (pending Aviation Pathways Ltd). All
                rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
      {/* end home-root wrapper */}

      {/* Recognition ATC Chat Widget */}
      <RecognitionATC />
    </>
  );
};
