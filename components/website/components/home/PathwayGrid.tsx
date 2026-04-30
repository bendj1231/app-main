import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Map, GraduationCap, Compass, ShoppingBag, Briefcase, Award, Plane, BookOpen, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { shouldEnableHeavyAnimations, shouldEnable3DEffects } from '@/src/lib/device-detection';

// Social Media Icons
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-6a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);
import { MemberJourneyAnimation } from './MemberJourneyAnimation';
import { DigitalLogbookAnimation } from './DigitalLogbookAnimation';
import { EtihadExpectationsAnimation } from './EtihadExpectationsAnimation';
import { DiscoverPathwaysAnimation } from './DiscoverPathwaysAnimation';

interface Slide {
    image: string;
    title: string;
    category: string;
    subtitle: string;
    description?: string;
    regions?: { name: string; flag: string }[];
    isDarkCard?: boolean;
    titleColor?: string;
    subtitleColor?: string;
    animationIndices?: number[];
}

interface PathwayGridProps {
    slides: Slide[];
    onNavigate: (page: string) => void;
    onGoToProgramDetail: (slide: Slide) => void;
    onLogin: () => void;
    isLoggedIn?: boolean;
    isEnrolledInFoundation?: boolean;
}

// Card type definition with optional image/video support
interface GridCardData {
    id: string;
    image?: string;
    images?: string[];
    videoUrl?: string;
    loggedInImage?: string;
    loggedInImages?: string[];
    enrolledImage?: string;
    enrolledImages?: string[];
    title: string;
    loggedInTitle?: string;
    enrolledTitle?: string;
    subtitle: string;
    loggedInSubtitle?: string;
    enrolledSubtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | null;
    enrolledBadge?: string;
    accentColor: string;
    hasAnimation?: boolean;
    hasAnimationWhenLoggedIn?: boolean;
    hasAnimationWhenEnrolled?: boolean;
    enrollNow?: boolean;
    isCarousel?: boolean;
    isCarouselWhenLoggedIn?: boolean;
    isCarouselWhenEnrolled?: boolean;
    hasArrows?: boolean;
    dynamicTitles?: string[];
    dynamicSubtitles?: string[];
    animationIndices?: number[];
    isDirectory?: boolean;
}

interface ViewSet {
    id: string;
    title: string;
    accentColor: string;
    cards: GridCardData[];
}

// View metadata for titles and colors
const viewSets: ViewSet[] = [
    { id: 'home', title: 'Home', accentColor: 'bg-yellow-400', cards: [] },
    { id: 'programs', title: 'Programs', accentColor: 'bg-amber-400', cards: [] },
    { id: 'pathways', title: 'Pathways', accentColor: 'bg-rose-400', cards: [] },
    { id: 'pilot-recognition', title: 'Pilot Recognition', accentColor: 'bg-violet-400', cards: [] },
    { id: 'applications', title: 'Applications', accentColor: 'bg-emerald-400', cards: [] },
    { id: 'membership', title: 'Membership', accentColor: 'bg-blue-400', cards: [] },
];

// View-specific card definitions
const getViewCards = (isLoggedIn: boolean, isEnrolledInFoundation: boolean = false) => ({
    home: [
        {
            id: 'foundation-program-enroll',
            image: '/pr2.png',
            title: 'Foundation Program Enroll',
            subtitle: '50+ hours mentorship. Start your journey today!',
            icon: Map,
            badge: 'Now Open',
            accentColor: 'from-emerald-500/80 to-teal-400/80',
        },
        {
            id: 'card-2',
            images: ['/pr2.png', '/images/airline-operations.png'],
            image: '/pr2.png',
            loggedInImages: ['/pr2.png'],
            loggedInImage: '/pr2.png',
            enrolledImage: '/pr2.png',
            enrolledImages: ['/pr2.png'],
            title: 'Discover Pathways',
            loggedInTitle: 'Discover Pathways',
            enrolledTitle: 'Discover Pathways',
            dynamicTitles: ['Discover Pathways', 'Discover Expectations', 'Discover Type Ratings'],
            dynamicSubtitles: ['Explore your aviation career options', 'Match your profile to airline standards', 'Find your perfect aircraft type rating'],
            subtitle: 'Discover additional pathways and opportunities',
            loggedInSubtitle: 'Discover additional pathways and opportunities',
            enrolledSubtitle: 'Discover additional pathways and opportunities',
            icon: null,
            badge: null,
            accentColor: 'from-purple-500/80 to-pink-400/80',
            isCarousel: true,
            isCarouselWhenLoggedIn: true,
            isCarouselWhenEnrolled: true,
            hasArrows: true,
            animationIndices: [],
            enrollNow: false,
        },
        {
            id: 'programs',
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png',
            title: 'Programs',
            subtitle: 'Structured training pathways from flight school to airline-ready professional',
            icon: GraduationCap,
            badge: null,
            accentColor: 'from-amber-500/80 to-orange-400/80',
        },
        {
            id: 'pilot-recognition',
            image: '/images/pilotrecognitioncompoennt.png',
            title: 'Pilot Recognition',
            subtitle: 'Verified credentials, milestones, and industry-recognized achievements',
            icon: Compass,
            badge: null,
            accentColor: 'from-violet-500/80 to-purple-400/80',
        },
        {
            id: 'pathways',
            image: '/images/airline-operations.png',
            title: 'Pathways',
            subtitle: 'Airline, charter, cargo, and emerging aviation sector opportunities',
            icon: ShoppingBag,
            badge: null,
            accentColor: 'from-rose-500/80 to-pink-400/80',
        },
    ],
    programs: [
        {
            id: 'foundation',
            videoUrl: '/images/My Movie 3 - 720WebShareName.mov',
            title: 'Foundation Program',
            enrolledTitle: 'Foundation Program Access',
            subtitle: 'Start your pilot journey with structured mentorship and guidance',
            enrolledSubtitle: 'Access your Foundation Program dashboard and resources',
            icon: Plane,
            badge: 'Start Here',
            enrolledBadge: 'Enrolled',
            accentColor: 'from-red-500/80 to-rose-400/80',
            enrollNow: true,
        },
        {
            id: 'benefits',
            image: '/New Note.jpeg',
            title: 'Program Benefits',
            subtitle: 'Discover certification advantages, career pathways, and exclusive member perks',
            icon: Award,
            badge: 'Explore',
            accentColor: 'from-emerald-500/80 to-teal-400/80',
        },
        {
            id: 'news',
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
            title: 'News & Updates',
            subtitle: 'Latest industry insights, program announcements, and aviation trends',
            icon: BookOpen,
            badge: 'Latest',
            accentColor: 'from-blue-500/80 to-cyan-400/80',
        },
        {
            id: 'learn-more',
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png',
            title: 'Learn More',
            subtitle: 'Deep dive into curriculum details, mentorship structure, and success stories',
            icon: GraduationCap,
            badge: 'Discover',
            accentColor: 'from-amber-500/80 to-orange-400/80',
        },
    ],
    pathways: [
        {
            id: 'pilot-pathways',
            image: '/Adobe Express - file.jpg',
            title: 'Discover Pathways Platform',
            subtitle: 'Discover comprehensive career pathways from student to captain',
            icon: Compass,
            badge: null,
            accentColor: 'from-blue-500/80 to-sky-400/80',
        },
        {
            id: 'type-rating-search',
            image: '/typeratingsrch.png',
            title: 'Type-Rating Search',
            subtitle: 'Find aircraft type ratings and training centers worldwide',
            icon: Plane,
            badge: null,
            accentColor: 'from-purple-500/80 to-fuchsia-400/80',
        },
        {
            id: 'airline-expectations',
            image: '/images/airline-operations.png',
            title: 'Airline Expectations',
            subtitle: 'Major carriers, regional airlines, and international opportunities',
            icon: Briefcase,
            badge: null,
            accentColor: 'from-orange-500/80 to-amber-400/80',
        },
        {
            id: 'recognition-pathways',
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776690048/pathways/cadet-programs.jpg',
            title: 'Recognition Pathways',
            subtitle: 'Verified credentials, milestones, and industry-recognized achievements',
            icon: Award,
            badge: null,
            accentColor: 'from-violet-500/80 to-purple-400/80',
        },
        {
            id: 'profile-matched-jobs',
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776689980/pathways/air-taxi-evtol.jpg',
            title: 'Profile Matched Jobs',
            subtitle: 'AI-powered job matching based on your qualifications and experience',
            icon: Zap,
            badge: 'AI Match',
            accentColor: 'from-blue-500/80 to-sky-400/80',
        },
    ],
    'pilot-recognition': [
        {
            id: 'pilot-recognition',
            videoUrl: '/fp.mp4',
            title: 'Pilot Recognition',
            subtitle: 'Verified credentials, milestones, and industry-recognized achievements',
            icon: Compass,
            badge: null,
            accentColor: 'from-violet-500/80 to-purple-400/80',
        },
        {
            id: 'credentials',
            image: '/images/pilotrecognitioncompoennt.png',
            title: 'Pilot-Recognition Profile',
            subtitle: 'Industry-recognized pilot verification and endorsement system',
            icon: Award,
            badge: null,
            accentColor: 'from-blue-500/80 to-indigo-400/80',
        },
        {
            id: 'digital-flight-logs',
            title: 'Digital Flight Logs',
            subtitle: 'Comprehensive digital logbook with automated entries and analytics',
            icon: BookOpen,
            badge: null,
            accentColor: 'from-violet-500/80 to-purple-400/80',
            isDirectory: true,
        },
        {
            id: 'profile-matched-jobs',
            title: 'Profile Matched Jobs',
            subtitle: 'AI-powered job matching based on your qualifications and experience',
            icon: Zap,
            badge: null,
            accentColor: 'from-yellow-500/80 to-amber-400/80',
            isDirectory: true,
        },
    ],
    applications: [
        {
            id: 'w1000-suite',
            image: '/images/w1000.png',
            title: 'W1000 Suite',
            subtitle: 'Complete pilot workspace with weather, NOTAMs, and flight planning',
            icon: Zap,
            badge: null,
            accentColor: 'from-cyan-500/80 to-blue-400/80',
        },
        {
            id: 'expectations',
            title: 'Pilot-Pathways Access',
            subtitle: 'Airline-specific requirements and preparation tools',
            icon: Briefcase,
            badge: null,
            accentColor: 'from-amber-500/80 to-orange-400/80',
            isDirectory: true,
        },
        {
            id: 'examination',
            title: 'Pilot-Portal Access',
            subtitle: 'Practice tests and exam preparation for all license levels',
            icon: BookOpen,
            badge: null,
            accentColor: 'from-indigo-500/80 to-purple-400/80',
            isDirectory: true,
        },
        {
            id: 'cv-builder',
            title: 'ATLAS-Resume Systems',
            subtitle: 'Professional aviation resume and portfolio creator',
            icon: Award,
            badge: null,
            accentColor: 'from-teal-500/80 to-emerald-400/80',
            isDirectory: true,
        },
        {
            id: 'atpl-game',
            title: 'Pilot-Terminal.com',
            subtitle: 'Pilot social media platform',
            icon: Play,
            badge: null,
            accentColor: 'from-pink-500/80 to-rose-400/80',
            isDirectory: true,
        },
    ],
    membership: [
        {
            id: 'benefits',
            image: '/images/accessportal.png',
            title: 'Member Benefits',
            subtitle: 'Exclusive discounts, resources, and career advantages',
            icon: Award,
            badge: 'Value',
            accentColor: 'from-yellow-500/80 to-amber-400/80',
        },
        {
            id: 'community',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
            title: 'Pilot Recognition First Class',
            subtitle: 'Connect with fellow pilots, mentors, and industry professionals',
            icon: Users,
            badge: 'First Class',
            accentColor: 'from-yellow-500/80 to-amber-400/80',
        },
        {
            id: 'community-2',
            image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
            title: 'Discover Membership Free & First Class Benefits',
            subtitle: 'Connect with fellow pilots, mentors, and industry professionals',
            icon: Users,
            badge: 'Network',
            accentColor: 'from-blue-500/80 to-sky-400/80',
        },
    ],
});

// Legacy dummyCards for backward compatibility (Home view)
const dummyCards = [
    {
        id: 'member',
        images: [],
        image: '',
        loggedInImages: ['/images/accessportal.png'],
        loggedInImage: '/images/accessportal.png',
        title: 'Discover Pathways',
        loggedInTitle: 'Access Portal',
        subtitle: 'AI-powered pathway matching for your aviation career',
        loggedInSubtitle: 'Enter your member dashboard and resources',
        icon: Play,
        badge: null,
        accentColor: 'from-blue-500/80 to-cyan-400/80',
        hasAnimation: true,
        hasAnimationWhenLoggedIn: false,
        isCarouselWhenLoggedIn: false,
    },
    {
        id: 'discover',
        images: ['/pr2.png', '/images/airline-operations.png'],
        image: '/pr2.png',
        loggedInImages: ['/pr2.png'],
        loggedInImage: '/pr2.png',
        enrolledImages: ['/pr2.png'],
        enrolledImage: '/pr2.png',
        title: 'Foundation Program Enroll',
        loggedInTitle: 'Foundation Program Enroll',
        enrolledTitle: 'Foundation Program Access',
        dynamicTitles: ['Featured: Foundation Program', 'Airline Expectations', 'Type Rating Search', 'AI Job Matching', 'Career Pathways'],
        dynamicSubtitles: ['50+ hours mentorship. Start your journey today!', 'Match your profile to airline standards', 'Find your perfect aircraft type rating', 'AI matches you with your dream airline job', 'From student to captain - your complete pathway'],
        subtitle: 'Align your Recognition Profile with an Airline Expectation',
        loggedInSubtitle: 'Align your Recognition Profile with an Airline Expectation',
        enrolledSubtitle: 'Access your Foundation Program dashboard and resources',
        icon: Map,
        badge: 'Now Open',
        accentColor: 'from-emerald-500/80 to-teal-400/80',
        isCarousel: true,
        isCarouselWhenLoggedIn: true,
        isCarouselWhenEnrolled: true,
        hasArrows: true,
        animationIndices: [],
        enrollNow: false,
    },
    {
        id: 'pathways',
        image: '/images/airline-operations.png',
        title: 'Pathways',
        subtitle: 'Airline, charter, cargo, and emerging aviation sector opportunities',
        icon: ShoppingBag,
        badge: null,
        accentColor: 'from-rose-500/80 to-pink-400/80',
    },
    {
        id: 'pilot-recognition',
        image: '/images/pilotrecognitioncompoennt.png',
        title: 'Pilot Recognition',
        subtitle: 'Verified credentials, milestones, and industry-recognized achievements',
        icon: Compass,
        badge: null,
        accentColor: 'from-violet-500/80 to-purple-400/80',
    },
    {
        id: 'programs',
        image: '/images/pathway-grid.png',
        title: 'Programs',
        subtitle: 'Structured training pathways from flight school to airline-ready professional',
        icon: GraduationCap,
        badge: null,
        accentColor: 'from-amber-500/80 to-orange-400/80',
    },
];

export const PathwayGrid: React.FC<PathwayGridProps> = ({
    onNavigate,
    onGoToProgramDetail,
    isLoggedIn = false,
    isEnrolledInFoundation = false,
}) => {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [mountKey, setMountKey] = useState(Date.now());
    const [currentViewIndex, setCurrentViewIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState(0);
    const gridInteractionRef = useRef<HTMLDivElement | null>(null);
    const isGridHoveredRef = useRef(false);
    const touchStartXRef = useRef<number | null>(null);
    const touchStartYRef = useRef<number | null>(null);
    const touchCurrentXRef = useRef<number | null>(null);
    const wheelLockRef = useRef(false);

    const viewKeys = ['home', 'programs', 'pilot-recognition', 'pathways', 'applications', 'membership'];
    const viewCards = getViewCards(isLoggedIn, isEnrolledInFoundation);

    // Trigger animations on every mount (including refresh)
    useEffect(() => {
        setMountKey(Date.now());
        setIsVisible(false);
        
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentViewIndex, isAnimating]);

    const goToNext = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(1);
        setCurrentViewIndex((prev) => (prev + 1) % viewKeys.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, viewKeys.length]);

    const goToPrevious = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(-1);
        setCurrentViewIndex((prev) => (prev - 1 + viewKeys.length) % viewKeys.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, viewKeys.length]);

    useEffect(() => {
        const element = gridInteractionRef.current;
        if (!element) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length < 1) return;
            touchStartXRef.current = e.touches[0].clientX;
            touchStartYRef.current = e.touches[0].clientY;
            touchCurrentXRef.current = e.touches[0].clientX;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length < 1 || touchStartXRef.current === null || touchStartYRef.current === null) return;

            touchCurrentXRef.current = e.touches[0].clientX;
            const deltaX = Math.abs(touchStartXRef.current - e.touches[0].clientX);
            const deltaY = Math.abs(touchStartYRef.current - e.touches[0].clientY);

            if (deltaX > deltaY && deltaX > 10) {
                e.preventDefault();
            }
        };

        const handleTouchEnd = () => {
            const startX = touchStartXRef.current;
            const endX = touchCurrentXRef.current;
            if (startX === null || endX === null) return;

            const distance = startX - endX;
            const threshold = 40;

            if (distance > threshold) {
                goToNext();
            } else if (distance < -threshold) {
                goToPrevious();
            }

            touchStartXRef.current = null;
            touchStartYRef.current = null;
            touchCurrentXRef.current = null;
        };

        const handleTouchCancel = () => {
            touchStartXRef.current = null;
            touchStartYRef.current = null;
            touchCurrentXRef.current = null;
        };

        const handleWheel = (e: WheelEvent) => {
            const horizontalDelta = Math.abs(e.deltaX);
            const verticalDelta = Math.abs(e.deltaY);
            const dominantDelta = e.shiftKey ? e.deltaY : e.deltaX;

            if (!e.shiftKey && horizontalDelta <= verticalDelta) {
                return;
            }

            if (Math.abs(dominantDelta) < 30 || wheelLockRef.current) {
                return;
            }

            e.preventDefault();
            wheelLockRef.current = true;

            if (dominantDelta > 0) {
                goToNext();
            } else {
                goToPrevious();
            }

            window.setTimeout(() => {
                wheelLockRef.current = false;
            }, 450);
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
        element.addEventListener('touchcancel', handleTouchCancel, { passive: true, capture: true });
        element.addEventListener('wheel', handleWheel, { passive: false, capture: true });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart, true);
            element.removeEventListener('touchmove', handleTouchMove, true);
            element.removeEventListener('touchend', handleTouchEnd, true);
            element.removeEventListener('touchcancel', handleTouchCancel, true);
            element.removeEventListener('wheel', handleWheel, true);
        };
    }, [goToNext, goToPrevious]);

    useEffect(() => {
        const handleWindowWheel = (e: WheelEvent) => {
            if (!isGridHoveredRef.current) return;

            const horizontalDelta = Math.abs(e.deltaX);
            const verticalDelta = Math.abs(e.deltaY);
            const dominantDelta = e.shiftKey ? e.deltaY : e.deltaX;

            if (!e.shiftKey && horizontalDelta <= verticalDelta) {
                return;
            }

            if (Math.abs(dominantDelta) < 30 || wheelLockRef.current) {
                return;
            }

            e.preventDefault();
            wheelLockRef.current = true;

            if (dominantDelta > 0) {
                goToNext();
            } else {
                goToPrevious();
            }

            window.setTimeout(() => {
                wheelLockRef.current = false;
            }, 450);
        };

        window.addEventListener('wheel', handleWindowWheel, { passive: false, capture: true });

        return () => {
            window.removeEventListener('wheel', handleWindowWheel, true);
        };
    }, [goToNext, goToPrevious]);

    const handleGridMouseEnter = useCallback(() => {
        isGridHoveredRef.current = true;
        document.documentElement.style.overscrollBehaviorX = 'none';
        document.body.style.overscrollBehaviorX = 'none';
    }, []);

    const handleGridMouseLeave = useCallback(() => {
        isGridHoveredRef.current = false;
        document.documentElement.style.overscrollBehaviorX = '';
        document.body.style.overscrollBehaviorX = '';
    }, []);

    useEffect(() => {
        return () => {
            document.documentElement.style.overscrollBehaviorX = '';
            document.body.style.overscrollBehaviorX = '';
        };
    }, []);

    const goToView = useCallback((index: number) => {
        if (isAnimating || index === currentViewIndex) return;
        setIsAnimating(true);
        setDirection(index > currentViewIndex ? 1 : -1);
        setCurrentViewIndex(index);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, currentViewIndex]);

    const currentViewKey = viewKeys[currentViewIndex] as keyof typeof viewCards;
    const currentCards = viewCards[currentViewKey] || viewCards.home;
    const currentViewTitle = viewSets.find(v => v.id === currentViewKey)?.title || 'Home';
    const currentAccentColor = viewSets.find(v => v.id === currentViewKey)?.accentColor || 'bg-yellow-400';

    // Animation variants for cards
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            }
        }
    } as const;

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 30,
            scale: 0.95,
            filter: 'blur(10px)'
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            filter: 'blur(10px)',
            transition: {
                duration: 0.3,
            }
        }
    } as const;

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut' as 'easeOut'
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2,
            }
        }
    } as const;

    const viewTransitionVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
        }),
    };

    // View index mapping for carousel navigation
    const viewIndexMap: Record<string, number> = {
        'home': 0,
        'programs': 1,
        'pilot-recognition': 2,
        'pathways': 3,
        'applications': 4,
        'membership': 5,
    };

    const getCardClickHandler = (card: GridCardData) => {
        return () => {
            // debug: Card clicked
            
            // When on Home view, clicking Programs/Pathways switches to that view
            // Pilot Recognition navigates to the profile page when logged in
            if (currentViewKey === 'home' && card.id === 'pilot-recognition' && isLoggedIn) {
                // debug: Navigating to pilot-recognition-profile page
                onNavigate('pilot-recognition-profile');
                return;
            }
            if (currentViewKey === 'home' && ['programs', 'pathways'].includes(card.id)) {
                const targetIndex = viewIndexMap[card.id];
                if (targetIndex !== undefined) {
                    // debug: Switching to view
                    goToView(targetIndex);
                    return;
                }
            }

            // Navigation mapping for all view cards
            const navMap: Record<string, string> = {
                'member': isLoggedIn ? 'portal' : 'become-member',
                'card-2': 'become-member',
                'foundation-program-enroll': 'become-member',
                'discover': 'pathways-modern',
                'pilot-pathways': 'pathways-modern',
                'type-rating-search': 'type-rating-search',
                'airline-expectations': 'airline-expectations',
                'recognition-pathways': 'pilot-recognition',
                'programs': 'programs',
                'pilot-recognition': 'pilot-recognition',
                'pathways': 'pathways',
                'foundation': 'become-member',
                'benefits': 'benefits',
                'news': 'news-updates',
                'learn-more': 'foundational-program',
                'commercial-airlines': 'airline-expectations',
                'cargo': 'cargo-transportation',
                'charter': 'private-charter-pathways',
                'cadet': 'cadet-pathways',
                'air-taxi': 'air-taxi-pathways',
                'digital-logbook': isLoggedIn ? 'pilot-recognition' : 'digital-logbook-directory',
                'digital-flight-logs': isLoggedIn ? 'pilot-recognition' : 'digital-logbook-directory',
                'profile-matched-jobs': 'pathways-modern',
                'credentials': 'pilot-recognition',
                'milestones': 'pilot-recognition',
                'badges': 'pilot-recognition',
                'verification': 'pilot-recognition',
                'w1000-suite': 'w1000-suite',
                'expectations': 'airline-expectations',
                'examination': 'examination-results-directory',
                'atpl-game': 'w1000-suite',
                'cv-builder': 'pilot-recognition',
                'community': 'become-member',
                'events': 'become-member',
                'resources': 'programs',
                'support': 'become-member',
            };

            const target = navMap[card.id];
            if (target) {
                // debug: Navigating to target for card
                onNavigate(target);
            } else {
                onGoToProgramDetail({
                    image: card.image,
                    title: card.title,
                    category: 'program',
                    subtitle: card.subtitle,
                    isDarkCard: true,
                });
            }
        };
    };

    return (
        <div 
            className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-20 md:pt-24 lg:pt-28 px-4 md:px-8 lg:px-12 pointer-events-auto"
        >
            <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-b from-slate-900/55 via-slate-900/70 to-black/85" />

            <div
                ref={gridInteractionRef}
                className="relative w-full max-w-[1000px] xl:max-w-[1100px]"
                onMouseEnter={handleGridMouseEnter}
                onMouseLeave={handleGridMouseLeave}
                style={{ touchAction: 'pan-y', cursor: 'grab', overscrollBehaviorX: 'contain' }}
            >
                {/* Side Navigation Arrows - Left */}
                <button
                    onClick={goToPrevious}
                    disabled={isAnimating}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 md:-translate-x-20 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
                    aria-label="Previous view"
                    style={{ pointerEvents: 'none' }}
                >
                    <div style={{ pointerEvents: 'auto' }}>
                        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
                    </div>
                </button>

                {/* Side Navigation Arrows - Right */}
                <button
                    onClick={goToNext}
                    disabled={isAnimating}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 md:translate-x-20 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
                    aria-label="Next view"
                    style={{ pointerEvents: 'none' }}
                >
                    <div style={{ pointerEvents: 'auto' }}>
                        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
                    </div>
                </button>

                {/* Minimal Compass Header - Just the revolving word */}
                <div className="w-full max-w-[980px] xl:max-w-[1040px] mx-auto mb-4 md:mb-5">
                    <div className="flex items-center justify-center gap-4 md:gap-8">
                        {/* Left Preview (Previous) */}
                        <button
                            onClick={goToPrevious}
                            disabled={isAnimating}
                            className="text-right transition-all duration-300 group"
                        >
                            <span className="text-xs md:text-sm text-white/30 font-serif tracking-wider block">
                                {viewSets[(currentViewIndex - 1 + viewSets.length) % viewSets.length].title}
                            </span>
                        </button>

                        {/* Main Title - Minimal with smooth horizontal slide */}
                        <div className="relative px-2 overflow-hidden">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.h2
                                    key={currentViewIndex}
                                    custom={direction}
                                    variants={{
                                        enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
                                        center: { opacity: 1, x: 0 },
                                        exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
                                    }}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 400, damping: 35, mass: 0.8 },
                                        opacity: { duration: 0.2 },
                                    }}
                                    className="text-xl md:text-3xl lg:text-4xl font-serif text-white tracking-tight"
                                >
                                    {currentViewTitle}
                                </motion.h2>
                            </AnimatePresence>
                            {/* Subtle underline */}
                            <motion.div 
                                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 ${currentAccentColor}`}
                                initial={{ width: 0 }}
                                animate={{ width: '60%' }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            />
                        </div>

                        {/* Right Preview (Next) */}
                        <button
                            onClick={goToNext}
                            disabled={isAnimating}
                            className="text-left transition-all duration-300 group"
                        >
                            <span className="text-xs md:text-sm text-white/30 font-serif tracking-wider block">
                                {viewSets[(currentViewIndex + 1) % viewSets.length].title}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Grid Content - Dynamic layouts per view */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentViewKey}
                        custom={direction}
                        variants={viewTransitionVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.3 },
                        }}
                        className="w-full max-w-[1000px] xl:max-w-[1100px] mx-auto"
                    >
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                        >
                            {/* Layout 1: Home - Two top cards, three bottom cards */}
                            {currentViewKey === 'home' && (
                                <>
                                    <div className="md:hidden grid grid-cols-1 gap-2 mb-4">
                                        {currentCards.slice(0, 5).map((card, idx) => (
                                            <motion.div key={card.id} variants={cardVariants} className={idx < 2 ? 'h-[220px]' : 'h-[170px]'}>
                                                <GridCard card={card} isHovered={hoveredCard === card.id} onHover={() => setHoveredCard(card.id)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(card)} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={idx < 2} currentViewKey={currentViewKey} />
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="hidden md:grid md:grid-cols-2 gap-2 md:gap-2.5 mb-2.5">
                                        {currentCards.slice(0, 2).map((card) => (
                                            <motion.div key={card.id} variants={cardVariants} className="h-[220px] lg:h-[240px]">
                                                <GridCard card={card} isHovered={hoveredCard === card.id} onHover={() => setHoveredCard(card.id)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(card)} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={true} currentViewKey={currentViewKey} />
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="hidden md:grid md:grid-cols-3 gap-2 md:gap-2.5 mb-4 md:mb-6">
                                        {currentCards.slice(2, 5).map((card) => (
                                            <motion.div key={card.id} variants={cardVariants} className="h-[150px] lg:h-[165px]">
                                                <GridCard card={card} isHovered={hoveredCard === card.id} onHover={() => setHoveredCard(card.id)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(card)} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Layout 2: Programs - Foundation video hero + 3 stacked info cards */}
                            {currentViewKey === 'programs' && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3 mb-4 md:mb-6 h-[340px] md:h-[400px]">
                                    {/* Foundation Program - Video showcase, featured left (60%) */}
                                    <motion.div key={currentCards[0]?.id} variants={cardVariants} className="md:col-span-3 h-full">
                                        <GridCard card={currentCards[0]} isHovered={hoveredCard === currentCards[0]?.id} onHover={() => setHoveredCard(currentCards[0]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[0])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={true} currentViewKey={currentViewKey} />
                                    </motion.div>
                                    {/* 3 Info cards stacked vertically on right (40%) with equal spacing */}
                                    <div className="md:col-span-2 flex flex-col gap-2 md:gap-3 h-full">
                                        <motion.div key={currentCards[1]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[1]} isHovered={hoveredCard === currentCards[1]?.id} onHover={() => setHoveredCard(currentCards[1]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[1])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                        <motion.div key={currentCards[2]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[2]} isHovered={hoveredCard === currentCards[2]?.id} onHover={() => setHoveredCard(currentCards[2]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[2])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                        <motion.div key={currentCards[3]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[3]} isHovered={hoveredCard === currentCards[3]?.id} onHover={() => setHoveredCard(currentCards[3]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[3])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                    </div>
                                </div>
                            )}

                            {/* Layout 3: Pathways - Commercial Airlines as main goal, alternatives below */}
                            {currentViewKey === 'pathways' && (
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-2.5 mb-4 md:mb-6">
                                    {/* Commercial Airlines - The primary goal, full width */}
                                    <motion.div key={currentCards[0]?.id} variants={cardVariants} className="md:col-span-6 h-[180px] md:h-[220px]">
                                        <GridCard card={currentCards[0]} isHovered={hoveredCard === currentCards[0]?.id} onHover={() => setHoveredCard(currentCards[0]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[0])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={true} currentViewKey={currentViewKey} />
                                    </motion.div>
                                    {/* Alternative pathways as equal options - Larger MSFS style */}
                                    <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                                        {currentCards.slice(1).map((card) => (
                                            <motion.div key={card.id} variants={cardVariants} className="h-[180px] md:h-[200px]">
                                                <GridCard card={card} isHovered={hoveredCard === card.id} onHover={() => setHoveredCard(card.id)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(card)} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Layout 4: Pilot Recognition - Video hero (60%) + 3 stacked cards on right (40%) */}
                            {currentViewKey === 'pilot-recognition' && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3 mb-4 md:mb-6 h-[340px] md:h-[400px]">
                                    {/* Pilot Recognition Video - Main hero left (60%) */}
                                    <motion.div key={currentCards[0]?.id} variants={cardVariants} className="md:col-span-3 h-full">
                                        <GridCard card={currentCards[0]} isHovered={hoveredCard === currentCards[0]?.id} onHover={() => setHoveredCard(currentCards[0]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[0])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={true} currentViewKey={currentViewKey} />
                                    </motion.div>
                                    {/* Right side: 3 stacked cards - Credentials, Digital Flight Logs, Profile Matched Jobs */}
                                    <div className="md:col-span-2 flex flex-col gap-2 md:gap-3 h-full">
                                        {/* Verified Credentials - Increased height */}
                                        <motion.div key={currentCards[1]?.id} variants={cardVariants} className="flex-[1.5] min-h-0">
                                            <GridCard card={currentCards[1]} isHovered={hoveredCard === currentCards[1]?.id} onHover={() => setHoveredCard(currentCards[1]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[1])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={true} currentViewKey={currentViewKey} />
                                        </motion.div>
                                        {/* Digital Flight Logs - Text-only directory */}
                                        <motion.div key={currentCards[2]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[2]} isHovered={hoveredCard === currentCards[2]?.id} onHover={() => setHoveredCard(currentCards[2]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[2])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                        {/* Profile Matched Jobs - Text-only directory */}
                                        <motion.div key={currentCards[3]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[3]} isHovered={hoveredCard === currentCards[3]?.id} onHover={() => setHoveredCard(currentCards[3]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[3])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                    </div>
                                </div>
                            )}

                            {/* Layout 5: Applications - W1000 Suite flagship, supporting tools stacked on right */}
                            {currentViewKey === 'applications' && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-2.5 mb-4 md:mb-6 h-[320px] md:h-[380px]">
                                    {/* W1000 Suite - Flagship product, takes center stage */}
                                    <motion.div key={currentCards[0]?.id} variants={cardVariants} className="md:col-span-3 h-full">
                                        <GridCard card={currentCards[0]} isHovered={hoveredCard === currentCards[0]?.id} onHover={() => setHoveredCard(currentCards[0]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[0])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={true} currentViewKey={currentViewKey} />
                                    </motion.div>
                                    {/* Right side: 4 stacked cards - Access Pathways Platform, Exam Terminal, ATPL Learning Game, Pilot CV Builder */}
                                    <div className="md:col-span-2 flex flex-col gap-2 md:gap-3 h-full">
                                        <motion.div key={currentCards[1]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[1]} isHovered={hoveredCard === currentCards[1]?.id} onHover={() => setHoveredCard(currentCards[1]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[1])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                        <motion.div key={currentCards[2]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[2]} isHovered={hoveredCard === currentCards[2]?.id} onHover={() => setHoveredCard(currentCards[2]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[2])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                        <motion.div key={currentCards[3]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[3]} isHovered={hoveredCard === currentCards[3]?.id} onHover={() => setHoveredCard(currentCards[3]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[3])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                        <motion.div key={currentCards[4]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[4]} isHovered={hoveredCard === currentCards[4]?.id} onHover={() => setHoveredCard(currentCards[4]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[4])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                    </div>
                                </div>
                            )}

                            {/* Layout 6: Membership - Benefits lead, community cards stacked */}
                            {currentViewKey === 'membership' && (
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-2.5 mb-4 md:mb-6 h-[320px] md:h-[380px]">
                                    {/* Benefits - The value proposition, prominent */}
                                    <motion.div key={currentCards[0]?.id} variants={cardVariants} className="md:col-span-2 h-full">
                                        <GridCard card={currentCards[0]} isHovered={hoveredCard === currentCards[0]?.id} onHover={() => setHoveredCard(currentCards[0]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[0])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={true} currentViewKey={currentViewKey} />
                                    </motion.div>
                                    {/* Right side: 2 stacked Pilot Community cards with equal sizing */}
                                    <div className="md:col-span-4 flex flex-col gap-2 md:gap-3 h-full">
                                        <motion.div key={currentCards[1]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[1]} isHovered={hoveredCard === currentCards[1]?.id} onHover={() => setHoveredCard(currentCards[1]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[1])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                        <motion.div key={currentCards[2]?.id} variants={cardVariants} className="flex-1 min-h-0">
                                            <GridCard card={currentCards[2]} isHovered={hoveredCard === currentCards[2]?.id} onHover={() => setHoveredCard(currentCards[2]?.id || null)} onLeave={() => setHoveredCard(null)} onClick={getCardClickHandler(currentCards[2])} onNavigate={onNavigate} className="w-full h-full" isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} isLargeCard={false} currentViewKey={currentViewKey} />
                                        </motion.div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Social Media Section */}
                <motion.div
                    className="mt-6 md:mt-8 flex flex-col items-center"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 1.0,
                                duration: 0.5,
                                ease: 'easeOut' as 'easeOut'
                            }
                        }
                    }}
                >
                    <p className="text-white/80 text-sm md:text-base font-serif font-medium mb-3 tracking-wide">
                        Discover pilotrecognition @
                    </p>
                    <div className="flex items-center gap-4 md:gap-5">
                        <a
                            href="https://www.tiktok.com/@pilotrecognition?is_from_webapp=1&sender_device=pc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                            aria-label="TikTok"
                        >
                            <TikTokIcon className="w-5 h-5 md:w-5.5 md:h-5.5" />
                        </a>
                        <a
                            href="https://youtube.com/@pilotrecognition"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                            aria-label="YouTube"
                        >
                            <YouTubeIcon className="w-5 h-5 md:w-5.5 md:h-5.5" />
                        </a>
                        <a
                            href="https://instagram.com/pilotrecognition"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                            aria-label="Instagram"
                        >
                            <InstagramIcon className="w-5 h-5 md:w-5.5 md:h-5.5" />
                        </a>
                        <a
                            href="https://facebook.com/pilotrecognition"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                            aria-label="Facebook"
                        >
                            <FacebookIcon className="w-5 h-5 md:w-5.5 md:h-5.5" />
                        </a>
                        <a
                            href="https://linkedin.com/company/pilotrecognition"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                            aria-label="LinkedIn"
                        >
                            <LinkedInIcon className="w-5 h-5 md:w-5.5 md:h-5.5" />
                        </a>
                    </div>
                </motion.div>

                {/* Discover More - Scroll Indicator (moved below social media) */}
                <motion.div 
                    className="mt-4 flex flex-col items-center z-50"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { 
                            opacity: 1, 
                            y: 0,
                            transition: {
                                delay: 1.2,
                                duration: 0.5,
                                ease: 'easeOut' as 'easeOut'
                            }
                        }
                    }}
                >
                    <span 
                        className="text-yellow-400 text-base md:text-lg font-bold tracking-[0.12em] mb-0.5"
                        style={{ 
                            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000'
                        }}
                    >
                        Discover more!
                    </span>
                    <div className="flex flex-col items-center leading-none">
                        <svg className="w-5 h-5 text-yellow-400 -mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 0 #000) drop-shadow(1px 0 0 #000) drop-shadow(0 -1px 0 #000) drop-shadow(-1px 0 0 #000)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400 -mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 0 #000) drop-shadow(1px 0 0 #000) drop-shadow(0 -1px 0 #000) drop-shadow(-1px 0 0 #000)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 0 #000) drop-shadow(1px 0 0 #000) drop-shadow(0 -1px 0 #000) drop-shadow(-1px 0 0 #000)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

interface GridCardProps {
    card: GridCardData;
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
    onClick: (carouselIndex?: number) => void;
    onNavigate: (page: string) => void;
    className?: string;
    isLoggedIn?: boolean;
    isEnrolledInFoundation?: boolean;
    isLargeCard?: boolean;
    currentViewKey?: string;
}

const GridCard: React.FC<GridCardProps> = ({
    card,
    isHovered,
    onHover,
    onLeave,
    onClick,
    onNavigate,
    className = '',
    isLoggedIn = false,
    isEnrolledInFoundation = false,
    isLargeCard = false,
    currentViewKey = ''
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [animationSceneIndex, setAnimationSceneIndex] = useState(0);
    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Determine display title and subtitle based on enrollment state
    const displayTitle = isEnrolledInFoundation && card.enrolledTitle
        ? card.enrolledTitle
        : isLoggedIn && card.loggedInTitle
            ? card.loggedInTitle
            : card.title;
    const displaySubtitle = isEnrolledInFoundation && card.enrolledSubtitle
        ? card.enrolledSubtitle
        : isLoggedIn && card.loggedInSubtitle
            ? card.loggedInSubtitle
            : card.subtitle;

    // Get current dynamic title for discover card and card-2
    const currentDynamicTitle = (card.id === 'card-2')
        ? card.dynamicTitles ? card.dynamicTitles[currentImageIndex === 1 ? animationSceneIndex + 1 : currentImageIndex] : null
        : null;

    // Get current dynamic subtitle for discover card and card-2
    const currentDynamicSubtitle = (card.id === 'card-2')
        ? card.dynamicSubtitles ? card.dynamicSubtitles[currentImageIndex === 1 ? animationSceneIndex + 1 : currentImageIndex] : null
        : null;

    // Use dynamic title if available, otherwise use display title
    const finalDisplayTitle = currentDynamicTitle || displayTitle;

    // Use dynamic subtitle if available, otherwise use display subtitle
    const finalDisplaySubtitle = currentDynamicSubtitle || displaySubtitle;
    
    // Determine if we should use carousel for enrolled/logged in state
    const shouldUseEnrolledCarousel = isEnrolledInFoundation && card.isCarouselWhenEnrolled && card.enrolledImages;
    const shouldUseLoggedInCarousel = isLoggedIn && !isEnrolledInFoundation && card.isCarouselWhenLoggedIn && card.loggedInImages;
    
    // Get the images array to use for carousel
    const carouselImages = shouldUseEnrolledCarousel
        ? card.enrolledImages
        : shouldUseLoggedInCarousel
            ? card.loggedInImages
            : card.images;

    // Determine which single image to use (not carousel)
    const displayImage = isEnrolledInFoundation && card.enrolledImage
        ? card.enrolledImage
        : isLoggedIn && !isEnrolledInFoundation && card.loggedInImage
            ? card.loggedInImage
            : card.image;

    // For discover card, respect the isCarouselWhenLoggedIn flag
    const shouldUseCarousel = (card.id === 'discover' && isLoggedIn && !card.isCarouselWhenLoggedIn)
        ? false
        : (card.id === 'discover' && isLoggedIn && !isEnrolledInFoundation && card.isCarouselWhenLoggedIn)
            ? !!carouselImages
            : shouldUseLoggedInCarousel
                ? !!carouselImages
                : shouldUseEnrolledCarousel
                    ? !!carouselImages
                    : card.isCarousel && card.images;

    // Auto-rotate carousel images
    useEffect(() => {
        if (!shouldUseCarousel || !carouselImages || carouselImages.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [shouldUseCarousel, shouldUseLoggedInCarousel, shouldUseEnrolledCarousel, carouselImages, card.isCarousel, card.images, isPaused]);


    // Reset animation scene index when carousel image changes
    useEffect(() => {
        setAnimationSceneIndex(0);
    }, [currentImageIndex]);

    
    // Cleanup pause timeout on unmount
    useEffect(() => {
        return () => {
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }
        };
    }, []);
    
    // Handle manual navigation (pause for 10 seconds)
    const handleManualNavigation = (direction: 'next' | 'prev') => {
        setIsPaused(true);
        
        // Clear existing timeout
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }
        
        // Navigate
        if (direction === 'next') {
            setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        } else {
            setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
        }
        
        // Resume after 10 seconds
        pauseTimeoutRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 10000);
    };
    
    const currentImage = shouldUseEnrolledCarousel
        ? carouselImages[currentImageIndex]
        : shouldUseLoggedInCarousel
            ? carouselImages[currentImageIndex]
            : isEnrolledInFoundation && card.enrolledImage
                ? card.enrolledImage
                : isLoggedIn && card.loggedInImage
                    ? card.loggedInImage
                    : shouldUseCarousel && card.images
                        ? card.images[currentImageIndex]
                        : card.image;

    const isMsfsSelected = isHovered;
    
    // Handle card click - for discover card, navigate based on state
    const handleCardClick = (e: React.MouseEvent) => {
        // debug: GridCard handleCardClick
        if (card.id === 'discover') {
            e.preventDefault();
            e.stopPropagation();
            // Always navigate to enrollment page when logged in
            if (isLoggedIn) {
                onNavigate('portal?directToEnrollment=true');
                return;
            }
            // If not logged out, navigate based on current image index
            const pageMap: Record<number, string> = {
                0: 'become-member',         // Foundation Program Enroll
                1: 'airline-expectations',  // Expectations
                2: 'type-rating-search',    // Type Rating Search
            };
            const targetPage = pageMap[currentImageIndex] || 'airline-expectations';
            // debug: Navigating to targetPage for currentImageIndex
            onNavigate(targetPage);
        } else {
            onClick();
        }
    };

    // Check if heavy animations should be enabled based on graphics settings
    const enableAnimations = shouldEnableHeavyAnimations();
    const enable3DEffects = shouldEnable3DEffects();

    return (
        <div
            className={`relative group cursor-pointer ${className}`}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={handleCardClick}
        >
            {/* Directory Card - Simple text with arrow */}
            {card.isDirectory ? (
                <div className={`
                    relative w-full h-full rounded-lg overflow-hidden
                    bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl
                    border border-white/20 shadow-2xl shadow-black/50
                    before:content-[''] before:absolute before:inset-0 before:rounded-lg
                    before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0
                    before:transition-opacity before:duration-300
                    transition-all duration-500 ease-out
                    flex items-center justify-between px-4 md:px-6
                    ${isHovered ? 'scale-[1.03] shadow-black/70 before:opacity-100 border-white/30' : 'scale-100'}
                `}>
                    <div className="flex flex-col">
                        {!(card.id === 'discover' && currentImageIndex === 0) && (
                            <>
                                <h3 className="text-white font-serif text-sm md:text-base tracking-wide">
                                    {finalDisplayTitle}
                                </h3>
                                <p className="text-slate-300 text-xs md:text-sm leading-tight">
                                    {finalDisplaySubtitle}
                                </p>
                            </>
                        )}
                    </div>
                    <div className={`
                        w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center
                        bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg
                        transition-all duration-300
                        ${isHovered ? 'bg-white/20 scale-110 border-white/40' : ''}
                    `}>
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            ) : (
                /* Main Card Container - MSFS Style Dark Card with Blue Accent */
                <div className={`
                    relative w-full h-full rounded-none overflow-hidden
                    bg-black/85 border border-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_28px_rgba(0,0,0,0.55)]
                    ${enableAnimations ? 'transition-transform duration-300 ease-out' : ''}
                    ${enableAnimations && isHovered ? 'scale-[1.01] brightness-110' : 'scale-100'}
                `}>
                    {/* Selected Card Highlight Strip (MSFS style) */}
                    <div className={`absolute bottom-0 left-0 right-0 h-[3px] z-30 transition-opacity duration-300 ${isMsfsSelected ? 'opacity-100 bg-[#00b4d8]' : 'opacity-0 bg-transparent'}`} />
                    {/* Background Image / Video / Carousel / Animation */}
                    <div className="absolute inset-0">
                    {card.videoUrl ? (
                        // Video playback for cards with videoUrl - isolated from card click
                        <div 
                            className="relative w-full h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {card.videoUrl.includes('youtube.com') || card.videoUrl.includes('youtu.be') ? (
                                // YouTube embed
                                <iframe
                                    src={card.videoUrl}
                                    title={card.title}
                                    className="w-full h-full object-cover"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                // Local MP4 video with mute toggle
                                <>
                                    <video
                                        src={card.videoUrl}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted={!isVideoPlaying}
                                        loop
                                        playsInline
                                        ref={(el) => {
                                            if (el) {
                                                el.muted = !isVideoPlaying;
                                            }
                                        }}
                                    />
                                    {/* Mute/Unmute Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                                            if (video) {
                                                video.muted = !video.muted;
                                                setIsVideoPlaying(!video.muted);
                                            }
                                        }}
                                        className="absolute bottom-3 right-3 z-50 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 transition-all duration-200 pointer-events-auto"
                                        aria-label={isVideoPlaying ? 'Mute video' : 'Unmute video'}
                                    >
                                        {isVideoPlaying ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                            </svg>
                                        )}
                                    </button>
                                </>
                            )}
                            {/* MSFS Style Gradient Overlay - Bottom fade to dark */}
                            {!(card.isCarousel && carouselImages) && (card.videoUrl || card.image || card.hasAnimation) && !(isLoggedIn && card.hasAnimationWhenLoggedIn === false) && (
                                <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#111827]/35 to-transparent pointer-events-none" />
                            )}
                        </div>
                    ) : card.hasAnimation && !shouldUseLoggedInCarousel && !(isLoggedIn && card.hasAnimationWhenLoggedIn === false) && enableAnimations ? (
                        // Member Journey Animation (only when not logged in and animations are enabled)
                        <MemberJourneyAnimation />
                    ) : (card.id === 'discover' && isLoggedIn && !card.isCarouselWhenLoggedIn) ? (
                        // Discover card when logged in - use single image without carousel
                        <img
                            src={displayImage || card.image}
                            alt={card.title}
                            className="w-full h-full object-cover object-center"
                        />
                    ) : shouldUseLoggedInCarousel && carouselImages ? (
                        // Carousel when logged in
                        <div className="relative w-full h-full">
                            {carouselImages.map((img, idx) => (
                                <div key={idx} className={`absolute inset-0 w-full h-full ${enableAnimations ? 'transition-all duration-1000' : ''} ${idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-100 scale-105'}`}>
                                    <img
                                        src={img}
                                        alt={`${card.title} ${idx + 1}`}
                                        className={`w-full h-full object-cover object-center ${enableAnimations && isHovered && idx === currentImageIndex && !(card.id === 'discover' && isLoggedIn) ? 'scale-110' : ''}`}
                                        onError={(e) => {
                                            console.error('Carousel image load error:', card.id, idx);
                                        }}
                                        onLoad={() => {
                                            // image loaded successfully
                                        }}
                                    />
                                </div>
                            ))}
                            {/* Carousel Indicators */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                {carouselImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            idx === currentImageIndex
                                                ? 'bg-white w-4'
                                                : 'bg-white/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : shouldUseCarousel && carouselImages ? (
                        // Carousel - Pure Billboard Style (No Controls) - Hidden for top row cards
                        <div className="relative w-full h-full">
                            {carouselImages.map((img, idx) => {
                                const isAnimationIndex = card.animationIndices?.includes(idx);
                                return (
                                    <div key={idx} className={`absolute inset-0 w-full h-full ${enableAnimations ? 'transition-all duration-700 ease-out' : ''} ${idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                                        {isAnimationIndex ? (
                                            idx === 1 && card.id === 'discover' ? (
                                                <DiscoverPathwaysAnimation isPlaying={idx === currentImageIndex} onSceneChange={setAnimationSceneIndex} />
                                            ) : idx === 1 ? (
                                                <EtihadExpectationsAnimation isHovered={isHovered && idx === currentImageIndex} />
                                            ) : (
                                                <DigitalLogbookAnimation isHovered={isHovered && idx === currentImageIndex} />
                                            )
                                        ) : (
                                            <img
                                                src={img}
                                                alt={`${card.title} ${idx + 1}`}
                                                className={`
                                                    w-full h-full object-cover
                                                    ${isHovered && idx === currentImageIndex ? 'scale-105' : ''}
                                                `}
                                                onError={(e) => {
                                                    console.error('General carousel image load error:', card.id, idx);
                                                }}
                                                onLoad={() => {
                                                    // general carousel image loaded
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                            {/* MSFS Style Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#111827]/25 to-transparent pointer-events-none" />
                        </div>
                    ) : displayImage || currentImage ? (
                        // Single image - Hidden for top row cards
                        !(card.id === 'discover' || card.id === 'pathways') && (
                            <img
                                src={currentImage || displayImage}
                                alt={card.title}
                                style={{ objectPosition: card.id === 'benefits' ? 'bottom center' : card.id === 'pilot-pathways' ? 'top center' : card.id === 'type-rating-search' ? 'top 20% center' : 'center' }}
                                className={`w-full h-full object-cover ${enableAnimations && isHovered && !(card.id === 'discover' && !isLoggedIn) ? 'scale-110' : ''}`}
                                onError={(e) => {
                                    console.error('Image load error:', card.id);
                                }}
                                onLoad={() => {
                                    // image loaded successfully
                                }}
                            />
                        )
                    ) : null}
                    {/* MSFS Style Image to Content Transition - skip for carousel cards */}
                    {!shouldUseCarousel && !shouldUseLoggedInCarousel && !shouldUseEnrolledCarousel && (
                        <div className={`
                            absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05070d] to-transparent
                            transition-opacity duration-300
                            ${isHovered ? 'opacity-100' : 'opacity-90'}
                        `} />
                    )}
                </div>

                {/* MSFS Style Badge - Amber/Orange NEW badge */}
                {card.id === 'discover' ? (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#ff9f1c] text-black text-xs font-bold uppercase tracking-wider">
                        {currentImageIndex === 0 ? 'NOW OPEN' : currentImageIndex === 1 ? 'DISCOVER' : ''}
                    </div>
                ) : (card.id === 'pathways' || card.id === 'pilot-recognition' || card.id === 'programs') ? (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#ff9f1c] text-black text-xs font-bold uppercase tracking-wider">
                        NEW
                    </div>
                ) : (isEnrolledInFoundation ? card.enrolledBadge : card.badge) && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#00b4d8] text-white text-xs font-bold uppercase tracking-wider">
                        {isEnrolledInFoundation ? card.enrolledBadge : card.badge}
                    </div>
                )}

                {/* Card ID Label - Top Left */}
                {(card.id === 'foundation-program-enroll' || card.id === 'card-2') && (
                    <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono uppercase tracking-wider">
                        ID: {card.id}
                    </div>
                )}


                {/* MSFS Style Content Area - Bottom section with blue accents (for large cards) */}
                {isLargeCard && (
                    <div className={`absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20 transition-colors duration-300 ${isMsfsSelected ? 'bg-[#00b4d8]' : 'bg-[#111827]'} ${card.id === 'w1000-suite' ? 'pb-12' : ''}`}>
                        <div className="flex flex-col">
                            {/* Title row with double chevrons - MSFS style */}
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className={`text-xs md:text-sm font-bold ${isMsfsSelected ? 'text-white' : 'text-white/80'}`}>&#8811;</span>
                                <h3 className={`text-white text-xs md:text-sm font-bold uppercase tracking-wider ${card.id === 'credentials' ? 'text-black' : ''}`}>
                                    {finalDisplayTitle}
                                </h3>
                            </div>
                            {/* Blue accent underline - MSFS style progress bar look */}
                            <div className={`w-full max-w-[120px] h-1 mb-2 ${isMsfsSelected ? 'bg-gradient-to-r from-white to-transparent' : 'bg-gradient-to-r from-[#00b4d8] to-transparent'}`} />
                            {/* Description - MSFS style smaller gray text */}
                            <p className={`text-[10px] md:text-xs leading-tight line-clamp-2 ${isMsfsSelected ? 'text-white/85' : 'text-slate-300'}`}>
                                {finalDisplaySubtitle}
                            </p>
                            {/* Red Glassy Enroll Button - for Foundation Program Enroll card */}
                            {card.id === 'foundation-program-enroll' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onNavigate('become-member');
                                    }}
                                    className="absolute bottom-4 right-4 px-2 py-0.5 bg-red-600/70 backdrop-blur-md border border-red-400/50 text-white text-[8px] md:text-[9px] font-bold uppercase tracking-wider rounded hover:bg-red-600/90 hover:border-red-400 transition-all shadow-lg shadow-red-500/20 z-30"
                                >
                                    Enroll Now
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Glassy Arrows for carousel cards */}
                {card.hasArrows && card.images && card.images.length > 1 && (
                    <>
                        {/* Left Arrow */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleManualNavigation('prev');
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {/* Right Arrow */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleManualNavigation('next');
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* MSFS Style Bottom Bar - Small Cards */}
                {!isLargeCard && (
                    <div className="absolute bottom-0 left-0 right-0">
                        <div className={`
                            relative
                            px-3 py-2 md:px-4 md:py-2 transition-all duration-300
                            ${isMsfsSelected ? 'bg-[#00b4d8]' : 'bg-[#111827]'}
                        `}>
                            {/* Blue accent line at top */}
                            <div className={`absolute top-0 left-0 w-10 h-[2px] ${isMsfsSelected ? 'bg-white' : 'bg-[#00b4d8]'}`} />
                            <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <span className={`text-[10px] md:text-xs font-bold ${isMsfsSelected ? 'text-white' : 'text-white/80'}`}>&#8811;</span>
                                        <h3 className="font-bold text-white text-xs md:text-sm truncate uppercase tracking-wider">
                                            {displayTitle}
                                        </h3>
                                    </div>
                                    <p className={`text-[10px] truncate hidden md:block ${isMsfsSelected ? 'text-white/85' : 'text-slate-300'}`}>
                                        {finalDisplaySubtitle.length > 45 ? finalDisplaySubtitle.slice(0, 42) + '...' : finalDisplaySubtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subtle hover glow effect */}
                <div className={`
                    absolute inset-0 transition-all duration-300 pointer-events-none
                    ${isMsfsSelected ? 'shadow-[inset_0_0_0_1px_rgba(0,180,216,0.5)]' : ''}
                `} />

                {/* Carousel Indicator Bar - Segmented Bar (At Bottom of Card) */}
                {card.hasArrows && card.images && card.images.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 z-30 flex gap-1 px-3 py-2">
                        {card.images.map((_, index) => (
                            <div
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(index);
                                }}
                                className={`
                                    h-1 flex-1 cursor-pointer transition-all duration-300
                                    ${index === currentImageIndex
                                        ? 'bg-white/40'
                                        : 'bg-[#0078d4]/30'
                                    }
                                `}
                            />
                        ))}
                    </div>
                )}
                </div>
            )}
        </div>
    );
};

export default PathwayGrid;
