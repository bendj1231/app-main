import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe, User, CheckCircle2, Zap, ChevronDown, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { IMAGES } from '../../../../src/lib/website-constants';
import { MeshGradient } from '@paper-design/shaders-react';
import { PathwayGrid } from './PathwayGrid';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';
import { getDevicePerformanceTier, shouldEnable3DEffects, getAnimationDurationMultiplier } from '@/src/lib/device-detection';
import { NewsroomModal } from '../NewsroomModal';

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

const newsroomHighlights = [
    {
        id: 'recognition-profiles',
        tag: 'Recognition Systems',
        title: 'How to Build the Right Recognition Profile',
        description: 'CEO & Founder Karl Brian Vogt breaks down how to align your profile with Airbus EBT standards. It is not about flight hours alone — airlines want cognitive skills, behavioral markers, and constructivist thinking that static CVs never capture.',
        image: '/PR3.png',
        metrics: [
            { label: 'Live Webinars', value: 'This week' },
            { label: 'Profile Views', value: '2,340 +' }
        ],
        bullets: [
            'Webinar series with Karl Brian Vogt on EBT CBTA alignment beyond stick-and-rudder skills',
            'Behavioral scoring, mentorship hours, and competency verification in one live profile',
            'Airlines and operators pull verified profiles — no more static CVs into black holes'
        ],
        ctaTarget: 'recognition-plus'
    },
    {
        id: 'pathway-cards',
        tag: 'Pathway Cards',
        title: 'Discover Pilot Profile-Matching Pathways',
        description: 'Stop sending static CVs into black holes. Airlines and operators post live pathway requirements with exact competency gaps. Your Recognition Profile auto-matches against them — you see your missing pieces before you apply, and operators pull verified pilots directly from the database.',
        image: '/discoverpathways.png',
        metrics: [
            { label: 'Live Pathways', value: '11 carriers' },
            { label: 'Match Accuracy', value: '88% hit' }
        ],
        bullets: [
            'Profile-matching engine compares your verified competencies against live airline requirements',
            'Gap analysis shows exactly which hours, ratings, and EBT scores you need to close',
            'Pull system — operators invite matched pilots directly, no applications, no waiting in line'
        ],
        ctaTarget: 'pathways-modern'
    },
    {
        id: 'platform-update',
        tag: 'Foundation Program',
        title: 'Foundation Program Enrollment Open Now',
        description: 'Start with 50 hours of verified mentorship, EBT CBTA-aligned competency assessment, and industry-recognized CV formatting. Build your Recognition Score from day one — the currency that gets you pulled by operators instead of begging for interviews.',
        image: '/foundation.png',
        metrics: [
            { label: 'Mentorship Hours', value: '50 included' },
            { label: 'Certification', value: 'enroll now for free!' }
        ],
        bullets: [
            'Foundation Program includes verified mentorship, competency scoring, and ATLAS CV formatting',
            'Recognition Score starts building from day one — operators pull from live profiles, not static CVs',
            'Scholarship seats available — 10% of spots are free for qualified applicants'
        ],
        ctaTarget: 'programs'
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
    const [isNewsroomModalOpen, setIsNewsroomModalOpen] = useState(false);

    // Auto-open newsroom modal on first visit of the session
    useEffect(() => {
        const hasSeenNewsroom = sessionStorage.getItem('hasSeenNewsroom');
        if (!hasSeenNewsroom) {
            // Small delay to allow the page to render first
            setTimeout(() => {
                setIsNewsroomModalOpen(true);
                sessionStorage.setItem('hasSeenNewsroom', 'true');
            }, 500);
        }
    }, []);
    
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

    // Save scroll position on visibility change (restoration disabled for development)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Save scroll position when tab is hidden
                const currentScroll = window.scrollY;
                scrollPositionRef.current = currentScroll;
                sessionStorage.setItem('scrollPosition', currentScroll.toString());
                sessionStorage.setItem('scrollPositionTimestamp', Date.now().toString());
                console.log('💾 Saved scroll position:', currentScroll);
            }
            // Note: Scroll restoration disabled to prevent unwanted scrolling when switching IDE tabs
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
                isLight={isOverWhite || isNewsroomModalOpen}
                isDark={!isOverWhite && !isNewsroomModalOpen}
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

            {/* Newsroom Trigger Button */}
            <button
                onClick={() => setIsNewsroomModalOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-slate-900/90 hover:bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm transition-all hover:scale-105"
            >
                <Zap className="w-4 h-4" />
                Newsroom
            </button>

            {/* Newsroom Modal */}
            <NewsroomModal
                isOpen={isNewsroomModalOpen}
                onClose={() => setIsNewsroomModalOpen(false)}
                onNavigate={onNavigate}
                newsroomHighlights={newsroomHighlights}
            />

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
                        <div ref={pathwayGridRef} className="relative z-0">
                            <PathwayGrid slides={allSlides} onNavigate={onNavigate} onGoToProgramDetail={onGoToProgramDetail} onLogin={onLogin} isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} />
                        </div>
                    </React.Suspense>
                ) : (
                    <div ref={pathwayGridRef} className="relative z-0">
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
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 leading-tight mb-6">
                            About PilotRecognition
                        </h2>

                        <div className="max-w-4xl mx-auto space-y-6 mb-12 text-left">
                            <p className="text-slate-700 text-sm md:text-base leading-relaxed font-sans">
                                PilotRecognition is an aviation competency platform operated by WM Pilot Group. The system provides competency-based profiling and experience programs aligned with EBT CBTA standards. Profiles are maintained in ATLAS Aviation CV format, with competency assessment integrated within the Transition Program.
                            </p>
                            <p className="text-slate-700 text-sm md:text-base leading-relaxed font-sans">
                                Pathways are structured career routes — cadet programs, type ratings, license progression, business aviation, eVTOL, and specialized operations. Each pathway lists operator requirements and identifies competency gaps against the pilot's profile. The platform does not operate as a job board. Pathways are available to all users; free tier sees 3 per month, Plus tier sees unlimited. Pilots indicate interest in a pathway; when operators join, they can pull verified profiles based on competency scores, flight hours, and EBT assessment data. The profile updates as you log hours, certifications, and mentorship completion. Examination results are verified and recorded. The competency score improves your matching priority with operators.
                            </p>
                            <p className="text-slate-700 text-sm md:text-base leading-relaxed font-sans">
                                Two programs build the verified competencies that improve your matching priority with operators. The Foundation Program establishes baseline competency across the nine EBT CBTA core areas through structured coursework, examination, and 50 hours of evidence-based mentorship. Foundation graduates unlock the Transition Program at graduate pricing ($99, a $50 discount from $149). The Transition Program is currently under development and will advance to full EBT CBTA assessment, ATLAS Aviation CV formatting, EBT video evaluation, and internship placement with pathway providers. Program completion generates verified competency data that feeds directly into the pilot profile and improves operator matching.
                            </p>
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
