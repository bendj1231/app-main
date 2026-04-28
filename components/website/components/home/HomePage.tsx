import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe, User, CheckCircle2, Zap, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { AirlineExpectationsCarousel } from '../AirlineExpectationsCarousel';
import { PilotJourneyScroll } from '../pilot-recognition/PilotJourneyScroll';
import { IMAGES } from '../../../../src/lib/website-constants';
import { MeshGradient } from '@paper-design/shaders-react';
import { PathwayGrid } from './PathwayGrid';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';
import { getDevicePerformanceTier, shouldEnable3DEffects, getAnimationDurationMultiplier } from '@/src/lib/device-detection';

interface HomePageProps {
    onJoinUs: () => void;
    onLogin: () => void;
    onNavigate: (page: string) => void;
    onGoToProgramDetail: (slide?: Slide) => void;
    isLoggedIn?: boolean;
    onLoginModalOpen?: () => void;
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

interface Slide {
    image: string;
    title: string;
    subtitle: string;
    category: 'program' | 'systems_automation' | 'network' | 'application' | 'pathways';
    regions?: { name: string; flag?: string }[];
    isDarkCard?: boolean;
    titleColor?: string;
    subtitleColor?: string;
    description?: string;
}

const navItems = [
    { name: 'Home', target: 'home' },
    { name: 'About', target: 'about' },
    { name: 'Pathways', target: 'about_programs' },
    { name: 'Accreditation', target: 'accreditation' },
    { name: 'Contact', target: 'dashboard' },
];

// Animated Header Component for Join Section
const AnimatedHeader: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        { text: 'Programs', color: 'text-white' },
        { text: 'Recognition', color: 'text-[#DAA520]' },
        { text: 'Pathways', color: 'text-white' }
    ];

    useEffect(() => {
        // Get animation duration multiplier based on device tier
        const multiplier = getAnimationDurationMultiplier();
        const intervalTime = 2500 * multiplier;
        
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, intervalTime);
        return () => clearInterval(interval);
    }, []);

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
                            textShadow: index === activeIndex && item.color === 'text-[#DAA520]' 
                                ? '0 0 30px rgba(218, 165, 32, 0.5)' 
                                : 'none'
                        }}
                    >
                        {item.text}
                    </span>
                ))}
            </span>
        </h1>
    );
};

const tabsData = [
    {
        id: 'programs',
        label: 'Programs',
        content: (
            <div className="space-y-4">
                <div className="bg-slate-50/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-slate-200">
                    <div className="mb-4 pb-3 border-b border-slate-200">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Foundation Program</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Building Your Aviation Foundation</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-2 text-xs">50 Hour Certification</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mb-2">
                                Comprehensive mentorship program combining <strong>20 hours of structured supervision</strong> with <strong>30 hours of official mentorship</strong> from industry veterans.
                            </p>
                            <ul className="text-[9px] text-slate-500 space-y-1">
                                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> Certificate of Accomplishment</li>
                                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> Official mentorship documentation</li>
                                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> EBT/CBTA competency baseline</li>
                            </ul>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-2 text-xs">W1000 Application</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mb-2">
                                Next-generation avionics suite inspired by the G1000 system. Full simulator room access for comprehensive flight training scenarios.
                            </p>
                            <ul className="text-[9px] text-slate-500 space-y-1">
                                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> IFR simulation environments</li>
                                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> VFR practice scenarios</li>
                                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> Checkride preparation modules</li>
                                <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> EBT CBTA Airbus-aligned training</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-slate-200 mb-3">
                        <h4 className="font-bold text-slate-900 mb-2 text-xs">Examination Terminal</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                            Advanced examination platform featuring FAA and CAAP practice tests with real-time performance analytics.
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-slate-50/20 rounded-lg p-2 text-center border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-700">ATPL</p>
                                <p className="text-[9px] text-slate-500">Airline Transport</p>
                            </div>
                            <div className="bg-slate-50/20 rounded-lg p-2 text-center border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-700">CPL</p>
                                <p className="text-[9px] text-slate-500">Commercial</p>
                            </div>
                            <div className="bg-slate-50/20 rounded-lg p-2 text-center border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-700">IR/ME</p>
                                <p className="text-[9px] text-slate-500">Instrument/Multi</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-100/30 backdrop-blur-sm rounded-xl p-3 border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-2 text-xs">Portfolio Development & Airline Oversight</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            All program data is systematically collected into your professional portfolio with <strong>Airbus representative oversight</strong>. This creates your official Pilot Recognition Profile — a verified credential recognized across the aviation industry.
                        </p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'recognition',
        label: 'Recognition',
        content: (
            <div className="space-y-4">
                <div className="bg-slate-50/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-slate-200">
                    <div className="mb-4 pb-3 border-b border-slate-200">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Pilot Recognition Profile</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Your Professional Aviation Identity</p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-slate-200 mb-4">
                        <p className="text-xs text-slate-700 leading-relaxed mb-3">
                            The PRP is a <strong>comprehensive, living document</strong> that evolves with your aviation career. It presents a complete picture of who you are as a pilot — verified, standardized, and ready for airline recruitment systems.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="text-center p-2 bg-slate-50/20 rounded-lg border border-slate-100">
                                <p className="text-base font-bold text-slate-800">Scores</p>
                                <p className="text-[9px] text-slate-500">Examination Performance</p>
                            </div>
                            <div className="text-center p-2 bg-slate-50/20 rounded-lg border border-slate-100">
                                <p className="text-base font-bold text-slate-800">Skills</p>
                                <p className="text-[9px] text-slate-500">EBT/CBTA Ratings</p>
                            </div>
                            <div className="text-center p-2 bg-slate-50/20 rounded-lg border border-slate-100">
                                <p className="text-base font-bold text-slate-800">Hours</p>
                                <p className="text-[9px] text-slate-500">Flight Experience</p>
                            </div>
                            <div className="text-center p-2 bg-slate-50/20 rounded-lg border border-slate-100">
                                <p className="text-base font-bold text-slate-800">CV</p>
                                <p className="text-[9px] text-slate-500">ATS-Optimized Profile</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-slate-900 mb-2 text-xs">Industry Recognition Standards</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                            PilotRecognition follows EASA, FAA, and ICAO standards for pilot competency verification.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">EASA Compliant</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">FAA Aligned</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">ICAO Standards</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">Airbus Partner</span>
                        </div>
                    </div>

                    <div className="bg-slate-100/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-2 text-xs">ATS-Compatible Atlas CV Format</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                            Your PRP automatically generates an <strong>ATS compatible</strong> CV using the industry-standard Atlas format.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">Airline-Ready Formatting</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">Keyword Optimized</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">Machine Readable</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">PDF Export</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'pathways',
        label: 'Pathways',
        content: (
            <div className="space-y-4">
                <div className="bg-slate-50/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-slate-200">
                    <div className="mb-4 pb-3 border-b border-slate-200">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Pilot Job Database & Pathways</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">From Profile to Career</p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-slate-900 mb-3 text-xs">Available Career Pathways</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                            <div className="bg-slate-50/20 rounded-xl p-3 border border-slate-200 text-center">
                                <p className="text-xs font-bold text-slate-800 mb-1">Private Jets</p>
                                <p className="text-[9px] text-slate-500">VIP Charter & Corporate</p>
                                <p className="text-[9px] text-blue-600 mt-1 font-medium">Avg: 2,500 hrs</p>
                            </div>
                            <div className="bg-slate-50/20 rounded-xl p-3 border border-slate-200 text-center">
                                <p className="text-xs font-bold text-slate-800 mb-1">Cargo</p>
                                <p className="text-[9px] text-slate-500">Logistics & Freighter</p>
                                <p className="text-[9px] text-blue-600 mt-1 font-medium">Avg: 1,500 hrs</p>
                            </div>
                            <div className="bg-slate-50/20 rounded-xl p-3 border border-slate-200 text-center">
                                <p className="text-xs font-bold text-slate-800 mb-1">Instructor</p>
                                <p className="text-[9px] text-slate-500">Training & Development</p>
                                <p className="text-[9px] text-blue-600 mt-1 font-medium">Avg: 500 hrs + CFI</p>
                            </div>
                            <div className="bg-slate-50/20 rounded-xl p-3 border border-slate-200 text-center">
                                <p className="text-xs font-bold text-slate-800 mb-1">Air Taxi</p>
                                <p className="text-[9px] text-slate-500">eVTOL & Urban Air</p>
                                <p className="text-[9px] text-blue-600 mt-1 font-medium">Avg: 200 hrs</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="bg-slate-50/20 rounded-xl p-2 border border-slate-200 text-center">
                                <p className="text-[10px] font-bold text-slate-700">Commercial Airline</p>
                            </div>
                            <div className="bg-slate-50/20 rounded-xl p-2 border border-slate-200 text-center">
                                <p className="text-[10px] font-bold text-slate-700">Air Ambulance</p>
                            </div>
                            <div className="bg-slate-50/20 rounded-xl p-2 border border-slate-200 text-center">
                                <p className="text-[10px] font-bold text-slate-700">Agricultural</p>
                            </div>
                            <div className="bg-slate-50/20 rounded-xl p-2 border border-slate-200 text-center">
                                <p className="text-[10px] font-bold text-slate-700">Survey & Patrol</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-2 text-xs">Smart Job Matching System</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mb-2">
                                Our matching engine continuously scans the job market and cross-references opportunities with your Pilot Recognition Profile.
                            </p>
                            <div className="bg-slate-50/20 rounded-lg p-2 border border-slate-100">
                                <p className="text-[9px] text-slate-600">
                                    <strong>Example:</strong> Your PRP shows 800 hrs, CPL, and IFR rating. The system identifies you as a match for Air Taxi positions.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-2 text-xs">Gap Analysis Engine</h4>
                            <ul className="text-[10px] text-slate-600 space-y-1">
                                <li className="flex items-start gap-1">
                                    <span className="text-blue-600 font-bold">1.</span>
                                    <span><strong>Hours Analysis:</strong> Compares your logged time against pathway requirements</span>
                                </li>
                                <li className="flex items-start gap-1">
                                    <span className="text-blue-600 font-bold">2.</span>
                                    <span><strong>Skills Gap:</strong> Identifies missing ratings or type certifications</span>
                                </li>
                                <li className="flex items-start gap-1">
                                    <span className="text-blue-600 font-bold">3.</span>
                                    <span><strong>Recommendations:</strong> Suggests specific training modules</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-slate-100/30 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-2 text-xs">Personalized Strategy Recommendations</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                            Based on your PRP data, PilotRecognition provides customized career roadmaps.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">Real-Time Matching</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">Gap Reports</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">Career Roadmaps</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-medium text-slate-600 border border-slate-200">Direct Applications</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

interface AutoCyclingTabsProps {
    onJoinUs: () => void;
}

const AutoCyclingTabs: React.FC<AutoCyclingTabsProps> = React.memo(({ onJoinUs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % tabsData.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [tabsData.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + tabsData.length) % tabsData.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % tabsData.length);
    };

    return (
        <div className="w-full mt-4 relative">
            {/* Glassy UI Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            {/* Card Container - Static */}
            <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 md:p-6 relative overflow-hidden h-[600px] md:h-[650px]">
                    {/* Content - Auto-shuffles */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full"
                        >
                            {tabsData[currentIndex].content}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Become a Member Button */}
            {onJoinUs && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onJoinUs}
                        className="px-8 py-3 bg-slate-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors border border-slate-900 rounded-lg"
                    >
                        Become A Member
                    </button>
                </div>
            )}
        </div>
    );
});

export const HomePage: React.FC<HomePageProps> = ({
    onJoinUs,
    onLogin,
    onNavigate,
    onGoToProgramDetail,
    isLoggedIn,
    onLoginModalOpen,
    isEnrolledInFoundation,
    pilotId,
    totalHours,
    lastFlown,
    mentorshipHours,
    foundationProgress,
    examinationScore,
    overallRecognitionScore,
    userDisplayName,
    userEmail,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [isConnectingIndustryExpanded, setIsConnectingIndustryExpanded] = useState(false);
    const [activeCategory, setActiveCategory] = useState<
        'all' | 'program' | 'systems_automation' | 'network' | 'application' | 'pathways'
    >('all');
    const scrollPositionRef = useRef(0);
    const pathwayGridRef = useRef<HTMLDivElement>(null);

    // Automatic device detection for performance optimization
    const [deviceTier, setDeviceTier] = useState<'low' | 'medium' | 'high'>('high');
    const [showOptimizationMessage, setShowOptimizationMessage] = useState(false);
    const [enableShader, setEnableShader] = useState(true);
    
    useEffect(() => {
        // Detect device performance on mount
        const tier = getDevicePerformanceTier();
        setDeviceTier(tier);
        
        // Disable shader on low-end devices
        const shouldEnableShader = shouldEnable3DEffects();
        setEnableShader(shouldEnableShader);
        
        // Show optimization message on low-end devices
        if (tier === 'low') {
            setShowOptimizationMessage(true);
            // Auto-hide message after 5 seconds
            const timer = setTimeout(() => {
                setShowOptimizationMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const allSlides: Slide[] = [
        {
            image: "/images/homepage-1.png",
            title: "Transition Program",
            category: 'program',
            subtitle: "Shifting students and graduates from flight school to an airline environment mindset through EBT & CBT familiarization.",
            description: "A structured bridge from fresh graduate to airline‑industry‑ready pilot. The Transition Program walks you through all nine EBT/CBTA core competencies using industry‑standard tools such as Airbus‑recommended HINFACT, aligns you with real airline expectations, and gives type‑rating insight before you commit tens of thousands to training. Combined with our Emirates‑standard GCAA ATPL theoretical pathway and accreditation partners, you gain a decisive advantage when presenting yourself to cadet programs, ATOs, and early first‑officer opportunities.",
            isDarkCard: true
        },
        {
            image: "https://images.unsplash.com/photo-1520437358207-323b43b50729?q=80&w=2940&auto-format&fit=crop",
            title: "EBT CBTA familiarization",
            category: 'program',
            subtitle: "airline expectations",
            description: "Master the core competencies of Evidence-Based Training (EBT) and Competency-Based Training & Assessment (CBTA). Our program integrates industry-leading software solutions, including HINFACT (industry-standard EBT CBTA tool), to simulate real-world airline evaluation environments.",
            isDarkCard: true
        },
        {
            image: "/images/foundational-program.png",
            title: "Foundational Program",
            subtitle: "Leadership skills, verifiable experience, and industry-recognized accreditation.",
            category: 'program',
            description: "Designed for recent graduates and ongoing pilots seeking a competitive edge. Our verified leadership and mentorship training prepares you to be Flight Instructor and mentor ready. Gain credibility, verifiable experience, and critical insights into the Transition Program, ensuring you are fully prepared for the next stage of your professional aviation career.",
            regions: [
                { name: "UAE", flag: "🇦🇪" },
                { name: "UK", flag: "🇬🇧" },
                { name: "Philippines", flag: "🇵🇭" },
                { name: "Mauritius", flag: "🇲🇺" },
                { name: "Germany", flag: "🇩🇪" }
            ],
            isDarkCard: true
        },
        {
            image: "/images/homepage-2.png",
            title: "Emirates ATPL Pilot Pathways",
            subtitle: "For pilots seeking an Emirates‑standard ATPL and GCAA license.",
            category: 'pathways',
            description:
                "PilotRecognition provides a structured Emirates ATPL Pathway through partner schools such as Fujairah Aviation, combining full ATPL training with license conversion inside the UAE. Pilots currently under the FAA system are guided through a smooth transition into EASA standards while completing their ATPL. The overall investment is comparable to many flight instructor ratings, while earning a respected GCAA license aligned with Emirates‑standard expectations—positioning you as a globally recognizable candidate whether you plan to fly in Dubai, the Philippines, or other international markets.",
            regions: [
                { name: "UAE", flag: "🇦🇪" },
                { name: "UK", flag: "🇬🇧" },
                { name: "Mauritius", flag: "🇲🇺" },
                { name: "Philippines", flag: "🇵🇭" },
                { name: "Germany", flag: "🇩🇪" }
            ],
            isDarkCard: true
        },
        {
            image: "/images/homepage-3.png",
            title: "Emerging Air Taxi Sector",
            subtitle: "For pilots under 1,000 hours stuck in the gap.",
            category: 'pathways',
            description:
                "PilotRecognition offers direct pilot pathways into the emerging air taxi sector, including leading industry players such as Archer and Joby—who have openly highlighted the need for pilots within this gap, typically under 1,000 hours. We also open routes into unmanned drone operations that are pilot-controlled from the ground. Through our network you gain strategic insight, connections, and a clear roadmap for how your current skills translate into this new segment.",
            isDarkCard: true
        },
        {
            image: "/images/homepage-4.png",
            title: "Air Taxi Pilot Pathways",
            subtitle: "From CPL/IR to eVTOL flight deck.",
            category: 'pathways',
            description:
                "A structured pathway for pilots aiming at eVTOL and air taxi roles. Understand licensing considerations, multi‑crew expectations, and how to present your experience to early‑stage operators building their first pilot rosters.",
            isDarkCard: true
        },
        {
            image: "/images/homepage-5.png",
            title: "Private Charter Pathways",
            subtitle: "Corporate and VIP flight departments.",
            category: 'pathways',
            description:
                "Guidance for pilots targeting private charter and corporate aviation. We unpack what owners, brokers, and chief pilots look for beyond raw hours—discretion, consistency, and the service mindset that defines successful charter crews.",
            isDarkCard: true
        },
        {
            image: "/images/homepage-6.png",
            title: "Unmanned Drones Pathways",
            subtitle: "From manned cockpit to remote operations.",
            category: 'pathways',
            description:
                "For pilots interested in RPAS and unmanned operations, this pathway explains certifications, operational roles, and how traditional flying experience translates into high‑value skills for drone operators and data‑driven missions.",
            isDarkCard: true
        },
        {
            image: "/images/airline-operations.png",
            title: "Airline Expectations",
            category: 'network',
            subtitle: "Strategic Investment Guidance",
            description: "A specialized data bank of airline-specific expectations and information, providing critical value for pilots prior to investing in expensive type ratings.",
            isDarkCard: true
        },
        {
            image: "/images/homepage-7.png",
            title: "Private Sector Insight",
            category: 'network',
            subtitle: "Executive Intelligence & Corporate Trends",
            description: "Exclusive access to private sector requirements, corporate aviation trends, and non-scheduled operator insights typically unavailable to the general public.",
            isDarkCard: true
        },
        {
            image: "/images/atlas_wallpaper_regular.png",
            title: "ATLAS Aviation CV",
            category: 'systems_automation',
            subtitle: "Globally Recognized AI-Optimized Format",
            description: "The new standard Resume recognized through automated platforms. ATLAS is a 'machine-language' version of a pilot's career, optimized for AI-powered parsers used by major airlines like Etihad and Cebu Pacific.",
            isDarkCard: true
        },
        {
            image: "/images/homepage-2.png",
            title: "Pilot Database Recognition System",
            category: 'systems_automation',
            subtitle: "Verifiable Excellence & Industry Standards",
            description: "A comprehensive database tracking pilot milestones, recognition, and professional development pathways recognized by global aviation authorities.",
            isDarkCard: true
        },
        {
            image: "/images/pilot-gap.png",
            title: "What is the Pilot Gap?",
            category: 'network',
            subtitle: "Unifying the voices of experienced aviators and all professional pilots to navigate the critical transition between flight training and the airline flight deck.",
            isDarkCard: true
        },
        {
            image: "/images/homepage-9.png",
            title: "Examination Terminal",
            category: 'application',
            subtitle: "Pilot Applications — Access our suite of professional aviation applications, including standardized examination environments and operational tools.",
            isDarkCard: true,
            titleColor: "text-yellow-500"
        },
        {
            image: "/images/homepage-10.png",
            title: "PilotRecognition W1000",
            category: 'application',
            subtitle: "The Professional Standard in glass cockpit familiarity.",
            description: "An application software inspired by the G1000 with our modern systems and simulators perfect suite for pilots to refresh on areas such as IFR, CPL examinations, and integrated Gleims examination software.",
            isDarkCard: true
        },
        {
            image: "/images/homepage-11.png",
            title: "Pilot Gap Forum",
            category: 'network',
            subtitle: "Bridging the Experience Gap",
            subtitleColor: "text-red-600 font-bold",
            description: "A secure intelligence hub for unfiltered career strategy discussions, industry gap analysis, and professional networking.",
            isDarkCard: true
        }
    ];

    const filteredSlides = allSlides.filter(slide => {
        if (activeCategory === 'all') {
            const excludedFromAll = ["Examination Terminal", "Pilot Gap Forum", "PilotRecognition W1000"];
            return !excludedFromAll.includes(slide.title);
        }
        if (activeCategory === 'pathways') {
            // Keep Emerging Air Taxi Sector only in the All view, not in the dedicated Pathways filter
            return slide.category === 'pathways' && slide.title !== "Emerging Air Taxi Sector";
        }
        return slide.category === activeCategory;
    });

    const slides = filteredSlides;

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            scrollPositionRef.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Save and restore scroll position on visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Save scroll position when tab is hidden
                const currentScroll = window.scrollY;
                scrollPositionRef.current = currentScroll;
                sessionStorage.setItem('scrollPosition', currentScroll.toString());
                sessionStorage.setItem('scrollPositionTimestamp', Date.now().toString());
                console.log('💾 Saved scroll position:', currentScroll);
            } else {
                // Restore scroll position when tab becomes visible
                const savedScroll = sessionStorage.getItem('scrollPosition');
                const savedTimestamp = sessionStorage.getItem('scrollPositionTimestamp');
                const scrollPos = savedScroll ? parseInt(savedScroll, 10) : scrollPositionRef.current;
                
                console.log('🔄 Tab visible, restoring scroll position:', scrollPos, 'saved:', savedScroll, 'timestamp:', savedTimestamp);
                console.log('📊 Current scroll position before restore:', window.scrollY);
                
                // Immediately restore scroll position without intermediate reset
                const restoreScroll = (delay: number) => {
                    window.scrollTo({
                        top: scrollPos,
                        behavior: 'instant'
                    });
                };
                
                // Single restore after a short delay
                setTimeout(() => restoreScroll(100), 100);
                setTimeout(() => restoreScroll(1200), 1200);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Ensure currentSlide is always in range when category changes
    useEffect(() => {
        if (currentSlide >= slides.length) {
            setCurrentSlide(0);
        }
    }, [slides.length, currentSlide]);

    // Auto-advance carousel
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [slides.length, activeCategory]); // Reset timer when content changes


    const carouselRef = useRef<HTMLDivElement>(null);
    const [isOverWhite, setIsOverWhite] = useState(false);

    const scrollToCarousel = () => {
        carouselRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' }
            ]} />
            <div className="relative min-h-screen font-sans bg-black overflow-x-hidden">
            {/* Navigation Bar */}
            <TopNavbar
                onNavigate={onNavigate}
                onLogin={onLogin}
                isLight={isOverWhite}
                isDark={!isOverWhite}
                onLoginModalOpen={onLoginModalOpen}
                pathwayGridRef={pathwayGridRef}
                currentPage="home"
            />

            {/* Optimization Message for Low-End Devices */}
            {showOptimizationMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Running in optimized mode for smoother performance on older devices</span>
                </div>
            )}

            {/* MeshGradient Background - Same as TypeRatingSearchPage */}
            <div className="relative w-full h-screen">
                <div className="fixed inset-0 z-0">
                    <MeshGradient
                        className="w-full h-full"
                        colors={[
                            "#dbeafe",
                            "#94a3b8",
                            "#64748b",
                            "#475569",
                            "#334155",
                            "#1e3a5f",
                            "#1e3a8a",
                            "#0f172a"
                        ]}
                        speed={0.22}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
                    <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
                </div>
                
                {/* Flight Simulator Style Grid */}
                {deviceTier === 'low' ? (
                    // Lazy load PathwayGrid for low-end devices
                    <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
                        <div ref={pathwayGridRef}>
                            <PathwayGrid slides={allSlides} onNavigate={onNavigate} onGoToProgramDetail={onGoToProgramDetail} onLogin={onLogin} isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} />
                        </div>
                    </React.Suspense>
                ) : (
                    <div ref={pathwayGridRef}>
                        <PathwayGrid slides={allSlides} onNavigate={onNavigate} onGoToProgramDetail={onGoToProgramDetail} onLogin={onLogin} isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} />
                    </div>
                )}
            </div>
            
            {/* Gradient Fade Below Shader - After Discover More */}
            <div className="relative w-full h-32 bg-gradient-to-b from-transparent via-slate-200/50 to-white z-40 pointer-events-none -mt-32"></div>

            {/* About Us section - Moved above iPad section */}
            <div className="relative bg-white pt-24 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll delay={100}>
                        <p className="text-lg font-bold tracking-[0.5em] uppercase text-blue-700 mb-4">
                            ABOUT US
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 leading-tight mb-4">
                            Connecting Pilots to Aviation Pathways
                        </h2>
                        <p className="text-xl font-medium tracking-wide text-slate-700 italic mb-10">
                            Bridging the Gap Between License and Career
                        </p>

                        <div className="max-w-4xl mx-auto space-y-8 mb-12">
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                                PilotRecognition is on a mission to solve the aviation industry's critical talent loss crisis. Many pilots feel alone and foreshadowed in a fragile market, afraid to make a move that might cost them their current position after several years. Our strategy connects the industry from both sides—pilots seeking opportunities and airlines, manufacturers, and aviation partners seeking qualified talent—through transparent communication and structured pathways. We address the experience gap by validating pilot competencies through evidence-based assessments and recognition programs, ensuring that skilled pilots don't leave the industry due to lack of opportunity, unclear career progression, or fear of losing their hard-earned positions. While our subscription model is not mandatory, it is preferred in the industry to demonstrate that you value your professional recognition as much as your training and career investment.
                            </p>
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                                Our services solve a critical need: the disconnect between pilot qualifications and industry recognition. Through our proprietary Verified Pilot Database and ATLAS-compliant profiling, we transform raw flight hours into data-driven professional competencies that manufacturers, airlines, and recruiters can actually evaluate and trust. We provide comprehensive recognition programs, evidence-based skill assessments, and verified documentation that bridge the gap between training and employment. Our aim is to give every pilot the tools to demonstrate their true capabilities beyond just flight hours—connecting them directly with industry veterans, decision-makers, and "hidden" job markets that value demonstrated competency. PilotRecognition ensures that pilots don't just graduate with a license—they transition seamlessly into the cockpit with the verified insights, professional network, and industry credibility that today's competitive aviation market demands.
                            </p>
                            
                            {!isConnectingIndustryExpanded && (
                                <button
                                    onClick={() => setIsConnectingIndustryExpanded(true)}
                                    className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-700 hover:text-blue-900 transition-colors flex items-center justify-center gap-2 mx-auto group px-4 py-2 bg-white border-2 border-blue-600 rounded-lg"
                                >
                                    READ MORE <ChevronDown className="w-4 h-4" />
                                </button>
                            )}

                            {isConnectingIndustryExpanded && (
                                <>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                                        PilotRecognition is a neutral platform—not a flight school, not an airline, and not a manufacturer—where pilots can access the industry directly and receive exact information rather than waiting months for outdated application systems. We provide pathways directly from the industry, alongside our own programs designed to develop your pilot recognition profile to align with industry expectations. Our programs emphasize discipline and leadership skill development—core values that future captains hold within their companies—which is why the industry values our approach. We build and develop the pilot mindset and industry-aligned role models. Our pathways include type ratings where you learn directly from manufacturers and airline expectations, giving you precise information about what airlines require. Additionally, our pilot recognition AI—available through subscription—recommends personalized pathways based on your profile, helping you navigate the complex aviation landscape with clarity.
                                    </p>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                                        Crucially, PilotRecognition is aligned with insurance underwriters, adding significant value and transparency to pilot risk contracts that airlines negotiate but rarely discuss with pilots. Most pilots are unaware that their experience level carries a financial price—airlines pay higher insurance premiums for low-timer pilots due to perceived risk, while experienced high-timer pilots represent lower risk. By providing verified competency documentation and recognition scores, we help pilots demonstrate their actual risk profile beyond mere flight hours, creating transparency that benefits both pilots and employers in insurance negotiations and career advancement.
                                    </p>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => onNavigate('accreditation')}
                            className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-700 hover:text-blue-900 transition-colors flex items-center justify-center gap-2 mx-auto group"
                        >
                            LEARN MORE ABOUT OUR ACCREDITATIONS AND SUPPORT PROVIDED <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Pilot Journey Scroll Animation - iPad/Tablet Section */}
            <PilotJourneyScroll onNavigate={onNavigate} />

            {/* Airline Expectations 3D Carousel */}
            <AirlineExpectationsCarousel
              onNavigate={onNavigate}
              onLogin={onLogin}
            />

            {/* Hero Section - Carousel */}
            <div ref={carouselRef} className="relative h-screen w-full flex items-center pt-20 overflow-hidden">
                {/* Top Gradient Fade - Transition from Airline Expectations */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-50 pointer-events-none"></div>
                
                {/* Background Images Layer */}
                {slides.map((slide, index) => (
                    <div
                        key={`${index}-${slide.title}`}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out z-0 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Vertical Gradient Scrim - Left Third */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.isDarkCard ? 'from-black/80 via-black/40' : 'from-[#050A30]/80 via-[#050A30]/40'} to-transparent z-10 transition-colors duration-1000`}></div>
                        <div className="absolute inset-0 bg-black/40 via-transparent to-black/20 z-0"></div>
                    </div>
                ))}

                <div className="max-w-7xl mx-auto px-6 w-full relative z-40 text-left">
                    <div className="space-y-8 max-w-3xl">
                        <h1
                            key={currentSlide}
                            className={`text-5xl md:text-9xl font-serif leading-none tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 ${slides[currentSlide]?.titleColor || 'text-white'}`}
                        >
                            {slides[currentSlide]?.title.split(' ').map((word, i) => (
                                <span key={i}>
                                    {word === 'Gap' ? (
                                        <span className="text-red-700">{word}</span>
                                    ) : (
                                        word
                                    )}
                                    {i < (slides[currentSlide]?.title.split(' ').length || 0) - 1 && ' '}
                                </span>
                            ))}
                        </h1>
                        <p
                            key={`subtitle-${currentSlide}`}
                            className={`text-lg md:text-xl font-light leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 ${slides[currentSlide]?.subtitleColor || 'text-white'}`}
                        >
                            {slides[currentSlide]?.subtitle}
                        </p>
                        {slides[currentSlide]?.description && (
                            <p
                                key={`description-${currentSlide}`}
                                className="text-sm md:text-base text-white/80 font-light leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
                            >
                                {slides[currentSlide].description}
                            </p>
                        )}

                        {slides[currentSlide]?.regions && (
                            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
                                <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">Regions Available</p>
                                <div className="flex gap-4">
                                    {slides[currentSlide].regions?.map((region, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm backdrop-blur-md group/flag hover:bg-white/10 transition-colors"
                                            aria-label={region.name}
                                        >
                                            <span className="text-lg md:text-xl">
                                                {region.flag || region.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="pt-4 flex justify-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
                            <button
                                onClick={() => onGoToProgramDetail(slides[currentSlide])}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-sm text-sm font-bold uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 border border-white/10 min-w-[200px]"
                            >
                                LEARN MORE
                            </button>
                            <button
                                onClick={onLogin}
                                className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-sm text-sm font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-sm min-w-[180px]"
                            >
                                MEMBER LOGIN
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute top-1/2 left-6 -translate-y-1/2 z-30">
                    <button
                        onClick={prevSlide}
                        className="text-white/40 hover:text-white transition-all hover:scale-110 p-4"
                    >
                        <ChevronLeft className="w-12 h-12 stroke-[1px]" />
                    </button>
                </div>
                <div className="absolute top-1/2 right-6 -translate-y-1/2 z-30">
                    <button
                        onClick={nextSlide}
                        className="text-white/40 hover:text-white transition-all hover:scale-110 p-4"
                    >
                        <ChevronRight className="w-12 h-12 stroke-[1px]" />
                    </button>
                </div>
                {/* Indicator Dots */}
                {slides.length > 1 && (
                    <div className="absolute bottom-24 right-8 z-40 flex gap-2 items-center">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`group relative py-2 transition-all duration-300 ${index === currentSlide ? 'px-1' : 'px-0'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <div className={`h-1 rounded-full transition-all duration-500 ease-out ${index === currentSlide
                                    ? 'w-8 bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]'
                                    : 'w-2 bg-white/20 group-hover:bg-white/40'
                                    }`} />
                            </button>
                        ))}
                    </div>
                )}

                {/* Glassy Category Filters */}
                <div className="absolute bottom-8 right-8 z-50">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl py-2 px-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-center gap-8">
                        {/* Interest of Pilots Group */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/50">Interest of Pilots</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => { setActiveCategory('all'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'all' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    All
                                </button>
                                <div className="w-[1px] h-3 bg-white/20"></div>
                                <button
                                    onClick={() => { setActiveCategory('program'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'program' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Programs
                                </button>
                                <div className="w-[1px] h-3 bg-white/20"></div>
                                <button
                                    onClick={() => { setActiveCategory('pathways'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'pathways' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Pathways
                                </button>
                                <div className="w-[1px] h-3 bg-white/20"></div>
                                <button
                                    onClick={() => { setActiveCategory('application'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'application' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Applications
                                </button>
                                <div className="w-[1px] h-3 bg-white/20"></div>
                                <button
                                    onClick={() => { setActiveCategory('network'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'network' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Networking
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-[1px] h-8 bg-white/20"></div>
                        <div className="md:hidden w-full h-[1px] bg-white/20"></div>

                        {/* Aviation Industry Interest Group */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-white/50">Aviation Industry Interest</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => { setActiveCategory('systems_automation'); setCurrentSlide(0); }}
                                    className={`text-[9px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${activeCategory === 'systems_automation' ? 'text-white scale-110 drop-shadow-md' : 'text-white/60 hover:text-white/90'}`}
                                >
                                    Systems & Automation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Gradient Fade Overlay - Adjusted for White Transition */}
                <div className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t pointer-events-none z-20 transition-colors duration-1000 ${slides[currentSlide]?.isDarkCard ? 'from-black/80 via-black/40' : 'from-[#050A30]/80 via-[#050A30]/40'} to-transparent`}></div>

                {/* Additional White Fade for Smooth Transition to Next Section */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/40 to-transparent z-30 pointer-events-none"></div>
            </div>

            {/* Main Content Area (Separated from Hero for Scrolling) */}
            <div className="relative bg-white">

                {/* Membership Benefits Section - Pilot Recognition Profile */}
                <div id="membership" className="relative bg-white pt-12 pb-0 px-6 overflow-hidden">
                    <div className="max-w-6xl mx-auto text-center relative z-20 mb-12">
                        <RevealOnScroll delay={100}>
                            <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                                Programs | Pilot Recognition | Pathways
                            </p>
                            <h2 className="text-3xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                                Pilot Recognition Profile
                            </h2>
                            <p className="text-[10px] text-slate-500 mb-8 italic max-w-md mx-auto">
                                Comprehensive pilot credentialing through verified data, EBT/CBTA assessments, and industry-standard portfolio building
                            </p>
                            <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mb-12">
                                Your Pilot Recognition Profile serves as your professional beacon to the aviation industry. It captures your flight hours, experience, behavioural scores, cognitive thinking, and constructivism from the Foundation Program if enrolled. This profile tells the industry: look at me, recognize me—this is who I am, this is my experience, this is the program I've completed, and these are my interview assessments. Through direct contact with the industry—including flight schools, type rating centres, operators, private jet sector, airlines, and emerging air taxi and eVTOL sectors—we gather their specific requirements and expectations. Your profile helps you discover opportunities across sectors you may not even know exist. Imagine an operator contacting you: "We've read your profile, we've watched your interview assessment and evaluation—we think you'll be a perfect candidate for us. Are you interested in undergoing this pathway?" Your profile helps you understand what each sector needs and how to align your profile against their standards, making it easier for employers to recognize your capabilities and for you to find opportunities across the aviation landscape.
                            </p>

                            {/* Pilot Journey Animation */}
                            <div className="max-w-6xl mx-auto mb-12">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
                                    {/* Step 1: Foundation Program */}
                                    <div className="relative group h-full">
                                        <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-400 transition-all duration-300 h-full flex flex-col">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white text-sm font-bold mb-3 mx-auto">
                                                1
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 mb-1 text-center">Foundation Program</h3>
                                            <p className="text-[10px] text-blue-600 font-medium text-center mb-2">Preferred, not mandatory</p>
                                            <p className="text-xs text-slate-600 mb-3 leading-relaxed">Complete 50 hours of structured mentorship with EBT/CBTA assessments</p>
                                            <div className="space-y-1.5 mt-auto">
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                    <span>W1000 Simulator Training</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                    <span>Examination Terminal Access</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                    <span>Mentorship Documentation</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                            <div className="w-4 h-4 border-t border-r border-slate-300 rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* Step 2: Initial Recognition */}
                                    <div className="relative group h-full">
                                        <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-400 transition-all duration-300 h-full flex flex-col">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 text-white text-sm font-bold mb-3 mx-auto">
                                                2
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 mb-1 text-center">Initial Recognition</h3>
                                            <p className="text-[10px] text-transparent font-medium text-center mb-2">&nbsp;</p>
                                            <p className="text-xs text-slate-600 mb-3 leading-relaxed">Airbus interview and portfolio verification completes your profile</p>
                                            <div className="space-y-1.5 mt-auto">
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                    <span>Competency Assessment</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                    <span>Airline Oversight Review</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                    <span>ATLAS CV Generated</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                            <div className="w-4 h-4 border-t border-r border-slate-300 rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* Step 3: Pathways Unlocked */}
                                    <div className="relative group h-full">
                                        <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-400 transition-all duration-300 h-full flex flex-col">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-600 text-white text-sm font-bold mb-3 mx-auto">
                                                3
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 mb-1 text-center">Pathways Unlocked</h3>
                                            <p className="text-[10px] text-transparent font-medium text-center mb-2">&nbsp;</p>
                                            <p className="text-xs text-slate-600 mb-3 leading-relaxed">AI-powered job matching connects your verified profile to opportunities</p>
                                            <div className="space-y-1.5 mt-auto">
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                    <span>Private Jets & Charter</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                    <span>Air Taxi & eVTOL</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                    <span>Cargo & Commercial</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                            <div className="w-4 h-4 border-t border-r border-slate-300 rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* Step 4: Recognition Plus */}
                                    <div className="relative group h-full">
                                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border-2 border-red-500 hover:border-red-400 transition-all duration-300 h-full flex flex-col shadow-lg">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-bold mb-3 mx-auto shadow-sm">
                                                4
                                            </div>
                                            <h3 className="text-sm font-bold text-white mb-1 text-center">Recognition Plus</h3>
                                            <p className="text-[10px] text-red-400 font-medium text-center mb-2">Verified Priority Pipeline</p>
                                            <p className="text-xs text-slate-300 mb-3 leading-relaxed">AI-ranked for partner airline hiring surges with interview fast-track</p>
                                            <div className="space-y-1.5 mt-auto">
                                                <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                    <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                    <span>OEM Aligned Profiles</span>
                                                    <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                        Profile aligned with manufacturer standards from Airbus, Boeing, etc.
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                    <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                    <span>Co-Pilot AI Career Strategist</span>
                                                    <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                        AI alerts for hireable milestones and pathway recommendations
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                    <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                    <span>Wingman Capital Access</span>
                                                    <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                        Pre-approved training and type-rating loans
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                    <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                    <span>Zero-Fail Compliance</span>
                                                    <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                        24/7 automated monitoring of licenses and medicals
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                    <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                    <span>Predictive Medical Alerts</span>
                                                    <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                        60-day warnings with AME slot suggestions
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to="/recognition-plus" className="block mt-4 text-center text-[10px] text-red-400 hover:text-red-300 underline font-medium">
                                                Learn more
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ATLAS Resume Header */}
                            <div className="text-center mb-8">
                                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">ATLAS Resume System</p>
                                <h3 className="text-2xl md:text-3xl font-serif text-slate-900">ATS-Approved ATLAS CV Formatting</h3>
                            </div>

                            {/* ATLAS Resume Example */}
                            <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                                {/* Header Card */}
                                <div className="bg-red-600 px-6 py-5 border-b border-red-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-red-200 uppercase tracking-[0.2em] mb-1">Pilot Recognition Profile</p>
                                            <h4 className="text-2xl font-bold text-white">{pilotId || userDisplayName || userEmail?.split('@')[0] || 'Pilot'}</h4>
                                            <p className="text-sm text-red-100">PilotRecognition Portfolio</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-red-200 uppercase tracking-[0.2em] mb-2">SHARE LINK</p>
                                            <button className="px-4 py-2 bg-white border border-red-400 rounded-lg text-xs font-medium text-red-700 hover:bg-red-50 transition-colors">
                                                Copy shareable resume URL
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Pilot Credentials */}
                                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                                            <h5 className="text-sm font-bold text-slate-900 mb-1">Pilot Credentials</h5>
                                            <p className="text-xs text-slate-500 mb-4">Licensing, hours, and access pass</p>
                                            
                                            {/* Flight Hours Grid */}
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div className="bg-slate-50/20 rounded-lg p-3 text-center">
                                                    <p className="text-[10px] text-slate-500 mb-1">Total Hours</p>
                                                    <p className="text-lg font-bold text-slate-900">{totalHours || 0}</p>
                                                </div>
                                                <div className="bg-slate-50/20 rounded-lg p-3 text-center">
                                                    <p className="text-[10px] text-slate-500 mb-1">Mentorship</p>
                                                    <p className="text-lg font-bold text-slate-900">{mentorshipHours || 0}</p>
                                                </div>
                                                <div className="bg-slate-50/20 rounded-lg p-3 text-center">
                                                    <p className="text-[10px] text-slate-500 mb-1">Foundation</p>
                                                    <p className="text-lg font-bold text-slate-900">{foundationProgress || 0}%</p>
                                                </div>
                                                <div className="bg-slate-50/20 rounded-lg p-3 text-center">
                                                    <p className="text-[10px] text-slate-500 mb-1">Recognition</p>
                                                    <p className="text-lg font-bold text-slate-900">{overallRecognitionScore || 0}</p>
                                                </div>
                                            </div>

                                            {/* Type & Status */}
                                            <div className="bg-slate-50/20 rounded-lg p-3 mb-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs text-slate-500">Type</span>
                                                    <span className="text-xs font-bold text-slate-900">{isLoggedIn ? 'Professional Pilot' : 'Commercial Pilot'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Status</span>
                                                    <span className="text-xs font-bold text-emerald-600">{isLoggedIn ? 'Verified' : 'Pending'}</span>
                                                </div>
                                            </div>

                                            <a href="#" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                                                View Flight Digital Logbook <span>→</span>
                                            </a>
                                        </div>

                                        {/* Training */}
                                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                                            <h5 className="text-sm font-bold text-slate-900 mb-4">Training</h5>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">License</span>
                                                    <span className="text-xs font-bold text-slate-900">{isLoggedIn ? 'Professional License' : 'CPL (A)'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Medical</span>
                                                    <span className="text-xs font-bold text-emerald-600">{isLoggedIn ? 'Class 1 Valid' : 'Class 1 Valid'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Type Ratings</span>
                                                    <span className="text-xs font-bold text-slate-900">{isLoggedIn ? 'Multi-Engine' : 'A320 (SEP)'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">English Proficiency</span>
                                                    <span className="text-xs font-bold text-slate-900">{isLoggedIn ? 'Level 6 (Expert)' : 'Level 6 (Expert)'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Languages</span>
                                                    <span className="text-xs font-bold text-slate-900">{isLoggedIn ? 'English, Spanish' : 'English, Spanish'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Readiness Snapshot */}
                                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">READINESS SNAPSHOT</h5>
                                            <h6 className="text-sm font-bold text-slate-900 mb-4">Resource & Availability</h6>
                                            
                                            <div className="space-y-3">
                                                <div className="bg-slate-50/20 rounded-lg p-3 flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Medical Certificate</span>
                                                    <span className="text-xs font-bold text-emerald-600">{isLoggedIn ? 'Valid Until Aug 2026' : 'Not Available'}</span>
                                                </div>
                                                <div className="bg-slate-50/20 rounded-lg p-3 flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Last Flown</span>
                                                    <span className="text-xs font-bold text-slate-900">{lastFlown || 'Not Available'}</span>
                                                </div>
                                                <div className="bg-slate-50/20 rounded-lg p-3 flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Recognition Score</span>
                                                    <span className="text-xs font-bold text-slate-900">{overallRecognitionScore || 0}/100</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Experience Section */}
                                    <div className="mt-4 bg-white rounded-xl p-5 border border-slate-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="text-sm font-bold text-slate-900">Recent Job Experience & Industry Aligned Accredited Programs</h5>
                                            <a href="#" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                                                Edit Experience <span>→</span>
                                            </a>
                                        </div>
                                        
                                        {/* Job Experience Entry */}
                                        <div className="mb-4 pb-4 border-b border-slate-100">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h6 className="text-sm font-semibold text-slate-900">Flight Instructor</h6>
                                                    <p className="text-xs text-slate-500">Skyway Aviation Academy</p>
                                                </div>
                                                <span className="text-[10px] text-slate-400">Jan 2024 - Present</span>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                Providing flight instruction for PPL and CPL students. Specializing in instrument training and multi-engine operations. Logged 350+ instructional hours with 92% student pass rate.
                                            </p>
                                        </div>
                                        
                                        {/* Second Job Experience Entry */}
                                        <div className="mb-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h6 className="text-sm font-semibold text-slate-900">First Officer (A320)</h6>
                                                    <p className="text-xs text-slate-500">Regional Air Charter Ltd</p>
                                                </div>
                                                <span className="text-[10px] text-slate-400">Jun 2023 - Dec 2023</span>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                Operated A320 aircraft on European routes. Completed 450+ flight hours including 120+ IFR sectors. Participated in EBT/CBTA assessment program with Competent rating.
                                            </p>
                                        </div>
                                        
                                        <a href="#" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                                            Add your job experience <span>→</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-slate-50/20 px-6 py-3 border-t border-slate-200">
                                    <p className="text-[10px] text-slate-500 text-center">
                                        This ATLAS-formatted CV is machine-readable by airline ATS systems and includes verified competency data from the PilotRecognition Foundation Program.
                                    </p>
                                </div>
                            </div>

                            {/* Four Key Benefits Cards */}
                            <div className="max-w-7xl mx-auto relative z-10 pt-12 mt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch min-h-[350px]">
                                    {[
                                        {
                                            corePoint: "Recognition",
                                            title: "ATLAS profile & Pilot Database",
                                            description: "Forget standard resumes. Build an ATLAS-compliant CV optimized for airline AI scanners. Your performance data is hosted in our Verified Pilot Database, allowing partner airlines and manufacturers to \"scout\" your specific competencies before you even apply.",
                                            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8Zh1dNXleqd5z_3TtGQ06ptfB1OE7GXMfzA&s",
                                            delay: 200
                                        },
                                        {
                                            corePoint: "Communication",
                                            title: "Multi-Sector Networking",
                                            description: "Break the \"experience barrier.\" Gain direct communication lines to veteran mentors and scarce insights into the Private Jet (VIP) and Air Taxi (eVTOL) sectors. Connect with the peers and pros who actually control the \"Hidden Job Market.\"",
                                            image: "https://www.pilot-expo.com/wp-content/uploads/2025/10/PE2025-1034-1-600x480.jpg",
                                            delay: 300
                                        },
                                        {
                                            corePoint: "Verification",
                                            title: "The \"New Standard\" Logging",
                                            description: "Be part of the industry's solution to the pilot gap. Access our 20/30 Mentorship Programs to log Verifiable Leadership Hours. We turn your \"soft skills\" into hard data that proves you are ready for the airline environment.",
                                            image: "https://airside.cae.com/media/images/_webp/09-logbookHistory_.png_webp_40cd750bba9870f18aada2478b24840a.webp",
                                            delay: 400
                                        },
                                        {
                                            corePoint: "Insider Knowledge",
                                            title: "Investment Intelligence",
                                            description: "Don't fly blind. Understand Airline & Manufacturer expectations (EBT/CBTA) before you invest $30k in a Type Rating. We provide the recommendations and \"reality checks\" you need to ensure your next step is a hired step.",
                                            image: "/images/homepage-13.png",
                                            delay: 500
                                        }
                                    ].map((benefit, index) => (
                                        <RevealOnScroll key={index} delay={benefit.delay} className="h-full">
                                            <div className="flex flex-col h-full group">
                                                {/* Core Point Label */}
                                                <div className="text-center mb-8">
                                                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-600 group-hover:text-blue-800 transition-colors">
                                                        {benefit.corePoint}
                                                    </span>
                                                </div>

                                                {/* The Epaulet Bar */}
                                                <div
                                                    className="flex-1 px-4 py-4 bg-white rounded-xl flex flex-col items-center text-center transition-all duration-500 hover:shadow-xl relative overflow-hidden group/bar shadow-md"
                                                >
                                                    {/* Image Background */}
                                                    <div className="absolute inset-0 z-0">
                                                        <img
                                                            src={benefit.image}
                                                            alt={benefit.title}
                                                            className="w-full h-full object-cover opacity-60 group-hover/bar:opacity-70 transition-opacity duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/70 to-transparent"></div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="relative z-10 flex flex-col h-full">
                                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 leading-tight">
                                                            {benefit.title}
                                                        </h3>
                                                        <p className="text-slate-600 text-sm leading-relaxed font-sans">
                                                            {benefit.description}
                                                        </p>

                                                        <div className="mt-auto pt-4">
                                                            <div className="w-px h-16 bg-gradient-to-b from-slate-900/10 to-transparent mx-auto"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </RevealOnScroll>
                                    ))}
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* Accreditation and Recognition Logos - Marquee (Full Width) */}
                <div className="relative w-full overflow-hidden bg-white pb-10">
                    <div className="relative w-full pt-8">
                        <div className="text-center relative z-10 mb-6">
                            <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-blue-700 mb-2">
                                RECOGNITION | ASSURANCE | SUPPORT
                            </p>
                            <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                Strategic presence at the Etihad Museum UAE Career Fair, represented by leading aviation governing bodies.
                            </p>
                        </div>

                        <div className="relative py-6 z-10 flex overflow-hidden group">
                            {/* Gradient Masks for Fade/Glass Effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20"></div>

                            <div className="flex gap-16 animate-marquee whitespace-nowrap min-w-full pl-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex gap-16 items-center shrink-0">
                                        <img src={IMAGES.ACCREDITATION_1} alt="FAA" className="h-14 w-auto object-contain" />
                                        <img src={IMAGES.ACCREDITATION_3} alt="GCAA" className="h-14 w-auto object-contain" />
                                        <img src={IMAGES.ACCREDITATION_4} alt="Airbus" className="h-16 w-auto object-contain" />
                                        <img src={IMAGES.ACCREDITATION_5} alt="WM Group" className="h-16 w-auto object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Join The Network Section - Simplified */}
                <div className="relative py-8 md:py-12 px-4 md:px-6 bg-slate-900 overflow-hidden" id="join-network-section">
                    
                    {/* MeshGradient Background - Rich sky/cloud palette with glassy blur */}
                    <div className="absolute inset-0 z-0 h-full w-full">
                        <MeshGradient
                            className="w-full h-full"
                            colors={[
                                "#f1f5f9",   // Soft white
                                "#e2e8f0",   // Light bluish grey
                                "#94a3b8",   // Medium grey
                                "#64748b",   // Slate
                                "#475569",   // Dark grey
                                "#334155",   // Darker slate
                                "#1e40af",   // Deep blue
                                "#1e3a8a",   // Navy
                                "#0f172a"    // Near black
                            ]}
                            speed={0.25}
                        />
                        {/* Glassy blur overlay - bathroom glass effect */}
                        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/5" />
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-8">
                                <AnimatedHeader />
                        </div>

                        <div className="max-w-6xl mx-auto space-y-6">
                            {/* Card 1: Become A Member - Simplified */}
                            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto">
                                <h2 className="text-2xl md:text-4xl font-serif text-slate-900 mb-8 leading-tight text-center">
                                    Create Your Pilot Recognition Profile
                                </h2>

                                {/* Create Profile Button */}
                                <button
                                    onClick={onJoinUs}
                                    className="w-full max-w-md bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold uppercase tracking-[0.15em] transition-all shadow-lg flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 mb-4 mx-auto"
                                >
                                    Create Account
                                </button>

                                {/* Social Login Option */}
                                <button
                                    onClick={onLogin}
                                    className="w-full max-w-md bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-xl font-bold uppercase tracking-[0.15em] transition-all shadow-lg border-2 border-slate-200 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 mb-8 mx-auto"
                                >
                                    Sign in with Google
                                </button>

                                {/* Recognition Plus Section */}
                                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shrink-0">
                                            <span className="text-white font-bold text-lg">+</span>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">Recognition Plus</h3>
                                            <p className="text-sm text-slate-700 leading-relaxed mb-3">
                                                Unlock premium features including verified priority pipeline, AI career strategist, interview fast-track, OEM-aligned profiles, and predictive medical alerts.
                                            </p>
                                            <a href="/recognition-plus" className="text-amber-600 hover:text-amber-700 text-sm font-bold underline">
                                                Learn more about Recognition Plus →
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Table */}
                                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-8 overflow-x-auto">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Platform Components</h3>
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr>
                                                <th className="text-left py-2 px-2 font-semibold text-slate-900 w-1/5">Component</th>
                                                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6">Profile</th>
                                                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6">Program</th>
                                                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6">Pathways</th>
                                                <th className="text-center py-2 px-2 font-semibold text-amber-600 w-1/3" colSpan={2}>Recognition Plus</th>
                                            </tr>
                                            <tr className="border-b-2 border-slate-300">
                                                <th className="text-left py-2 px-2 font-semibold text-slate-900 w-1/5"></th>
                                                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6"></th>
                                                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6"></th>
                                                <th className="text-center py-2 px-2 font-semibold text-slate-900 w-1/6"></th>
                                                <th className="text-center py-2 px-2 font-semibold text-amber-600 w-1/6">AI</th>
                                                <th className="text-center py-2 px-2 font-semibold text-amber-600 w-1/6">Priority</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-slate-200 bg-slate-100">
                                                <td className="py-2 px-2 text-slate-900 font-semibold">Profile</td>
                                                <td className="py-2 px-2 text-center text-blue-600">Credentials display</td>
                                                <td className="py-2 px-2 text-center text-slate-700">Free enrollment</td>
                                                <td className="py-2 px-2 text-center text-slate-700">Direct entry pathways</td>
                                                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                                                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                                            </tr>
                                            <tr className="border-b border-slate-200">
                                                <td className="py-2 px-2 text-slate-900 font-semibold">Programs</td>
                                                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                                                <td className="py-2 px-2 text-center text-slate-700">50+ hours mentorship</td>
                                                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                                                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                                                <td className="py-2 px-2 text-center text-slate-700">✓ Earned priority</td>
                                            </tr>
                                            <tr className="border-b border-slate-200 bg-slate-100">
                                                <td className="py-2 px-2 text-slate-900 font-semibold">Pathways</td>
                                                <td className="py-2 px-2 text-center text-blue-600">Profile matching</td>
                                                <td className="py-2 px-2 text-center text-slate-700">Interview access</td>
                                                <td className="py-2 px-2 text-center text-slate-700">Unlimited sectors</td>
                                                <td className="py-2 px-2 text-center text-slate-400">Not included</td>
                                                <td className="py-2 px-2 text-center text-slate-700">Pool access</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-2 text-amber-900 font-semibold">Recognition Plus</td>
                                                <td className="py-2 px-2 text-center text-amber-600">OEM aligned</td>
                                                <td className="py-2 px-2 text-center text-amber-600">Fast-track</td>
                                                <td className="py-2 px-2 text-center text-amber-600">AI recommendations</td>
                                                <td className="py-2 px-2 text-center text-amber-600">Verification</td>
                                                <td className="py-2 px-2 text-center text-amber-600">✓ First in pools</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button onClick={() => onNavigate('membership')} className="block text-center text-blue-600 hover:text-blue-700 text-sm font-bold underline mt-4">
                                        View full comparison →
                                    </button>
                                </div>

                                {/* Contact Us */}
                                <div className="mb-8 text-center">
                                    <p className="text-slate-600 text-sm mb-2">
                                        Want to inquire? <a href="#" className="text-blue-600 hover:text-blue-700 underline font-semibold">Contact us</a>
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        Want to know more? <a href="#" className="text-blue-600 hover:text-blue-700 underline font-semibold">Learn about our platform</a>
                                    </p>
                                </div>

                                {/* Operator CTA */}
                                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
                                    <p className="text-slate-900 text-sm mb-2 font-semibold text-center">
                                        Are you an operator?
                                    </p>
                                    <button
                                        onClick={() => window.location.href = '/enterprise-access'}
                                        className="w-full text-blue-600 hover:text-blue-700 text-sm font-bold underline text-center"
                                    >
                                        Click here for enterprise access
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Note: Progressive Pathway */}
                        {/* Footer Note: Progressive Pathway */}
                        <div className="text-center mt-4 mb-6 max-w-3xl mx-auto">
                            <p className="text-white italic text-xs md:text-sm leading-relaxed">
                                <span className="text-blue-900 font-bold block mb-1 not-italic uppercase tracking-widest text-[10px]">Progressive Pathway Recommendation</span>
                                Doing the Foundational Program first will give you a <strong className="text-white">preferred edge</strong> within the PilotRecognition Pilot Database.
                            </p>
                        </div>


                        {/* Section 3: The Why (For Airlines & ATOs) */}
                        <div className="mt-8 mb-6 text-center max-w-4xl mx-auto relative z-10 px-4">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h3 className="text-lg md:text-2xl font-sans font-bold text-slate-900 mb-3">
                                    Airlines, Operators, or Regulatory Authorities?
                                </h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                                    PilotRecognition provides an industry-standard database of candidates vetted through EBT CBTA familiarization and Hinfact.
                                </p>
                                <button onClick={() => window.location.href = '/enterprise-access'} className="inline-flex items-center justify-center px-6 py-2 text-xs font-bold text-white uppercase tracking-widest bg-slate-900 border border-slate-900 rounded-lg group">
                                        <span>Contact for Enterprise Access</span>
                                        <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                                    </button>
                            </div>
                        </div>

                        {/* User Agreement */}
                        <div className="text-center relative z-10 pb-6">
                            <p className="text-slate-400/60 text-[10px] uppercase tracking-widest">
                                By joining, you agree to the <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4">Privacy Policy</a> & <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4">User Agreement</a>
                            </p>
                        </div>
                    </div>
                </div>



            </div>
            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">PilotRecognition</h3>
                            <p className="text-slate-400 text-sm">The Aviation Industry's First Pilot Recognition-Based Platform</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Platform</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="/recognition-plus" className="hover:text-white cursor-pointer transition-colors">Pilot Recognition</a></li>
                                <li><a href="/recognition-career-matches" className="hover:text-white cursor-pointer transition-colors">Pathways</a></li>
                                <li><a href="/programs" className="hover:text-white cursor-pointer transition-colors">Programs</a></li>
                                <li><a href="/airline-expectations" className="hover:text-white cursor-pointer transition-colors">Airline Expectations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Programs</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="/foundational-program" className="hover:text-white cursor-pointer transition-colors">Foundation Program</a></li>
                                <li><a href="/transition-program" className="hover:text-white cursor-pointer transition-colors">Transition Program</a></li>
                                <li><a href="/airbus-aligned-ebt-cbta-programs" className="hover:text-white cursor-pointer transition-colors">EBT CBTA</a></li>
                                <li><a href="/become-member" className="hover:text-white cursor-pointer transition-colors">Become a Member</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Contact</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="mailto:contact@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">contact@pilotrecognition.com</a></li>
                                <li><a href="mailto:contact@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">contact@pilotrecognition.com</a></li>
                                <li><a href="mailto:enterprise@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">enterprise@pilotrecognition.com</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Legal</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="/privacy-policy" className="hover:text-white cursor-pointer transition-colors">Privacy Policy</a></li>
                                <li><a href="/terms-of-service" className="hover:text-white cursor-pointer transition-colors">Terms of Service</a></li>
                                <li><a href="/cookie-policy" className="hover:text-white cursor-pointer transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
                        <p>&copy; 2024 PilotRecognition - WM Pilot Group. All rights reserved.</p>
                    </div>
                </div>
            </footer>


        </div>
        </>
    );
};
