import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe, User, CheckCircle2, Zap, Briefcase, Navigation, Cpu, Layers, ChevronDown, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { AirlineExpectationsCarousel } from '../AirlineExpectationsCarousel';
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
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1777590630/newsroom/kvos2ityyztesx5idue2.png',
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
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1777590647/newsroom/tws5xzryqjepzxoyc94d.png',
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
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1777590658/newsroom/b81ubzdpz0dmyqutiyqj.png',
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

const HOME_PATHWAYS = [
    {
        id: 'disc-comm-1',
        title: 'Envoy Air Pilot Cadet Program',
        company: 'Envoy Air (American Airlines Group)',
        matchProbability: 94,
        location: 'United States | Home-Based',
        image: 'https://www.envoyair.com/wp-content/uploads/2024/03/IMG_CadetProgram_MeganSnow.jpg',
        tags: ['American Airlines Flow', 'Embraer Fleet', 'Tuition Reimbursement'],
        category: 'Pilot Training & Certification'
    },
    {
        id: 'disc-comm-2',
        title: 'Air Cambodia Cadet Programme',
        company: 'Air Cambodia',
        matchProbability: 92,
        location: 'Phnom Penh, Cambodia',
        image: 'https://s28477.pcdn.co/wp-content/uploads/2024/10/CAngkor_1-984x554.png',
        tags: ['Sponsored Training', 'A320 Type Rating', 'Guaranteed Job'],
        category: 'Pilot Training & Certification'
    },
    {
        id: 'disc-comm-3',
        title: 'Cathay Pacific Cadet Pilot Programme',
        company: 'Cathay Pacific Airways',
        matchProbability: 88,
        location: 'Hong Kong / Australia',
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/cathay-pacific.jpg',
        tags: ['Full Sponsorship', 'A350/B777', 'Definite Return'],
        category: 'Commercial Operations'
    },
    {
        id: 'disc-comm-4',
        title: 'FlyDubai Pilot Cadet Programme',
        company: 'FlyDubai',
        matchProbability: 90,
        location: 'Dubai, United Arab Emirates',
        image: 'https://cdn.uc.assets.prezly.com/5f1fd10f-a9bc-4bf0-aa29-b9a26dc42407/-/crop/1952x1066/0,272/-/preview/-/resize/1108x/-/quality/best/-/format/auto/',
        tags: ['B737 MAX', 'Dubai Base', 'Career Progression'],
        category: 'Commercial Operations'
    },
    {
        id: 'disc-comm-6',
        title: 'Ryanair Future Flyer Program',
        company: 'Ryanair / Atlantic Flight Training',
        matchProbability: 89,
        location: 'Dublin, Ireland / Various',
        image: 'https://cdn.aviationa2z.com/wp-content/uploads/2024/01/image-25-1024x683.png',
        tags: ['Low-Cost Leader', 'Fast Upgrade', '500+ Aircraft'],
        category: 'Commercial Operations'
    },
    {
        id: 'disc-comm-jetblue',
        title: 'JetBlue Gateway Program',
        company: 'JetBlue Airways',
        matchProbability: 92,
        location: 'New York, NY / Various Bases',
        image: 'https://sanpedrosun.s3.us-west-1.amazonaws.com/wp-content/uploads/2023/12/09170529/Belizean-pilot-flies-JetBlues-inaugural-flight-to-Belize-3-657x438.jpg',
        tags: ['Direct-to-Airline', 'A320/A220 Fleet', 'East Coast Network'],
        category: 'Career Progression'
    },
    {
        id: 'disc-comm-emirates-cadet',
        title: 'Emirates Cadet Pilot Programme',
        company: 'Emirates Airlines',
        matchProbability: 93,
        location: 'Dubai, UAE',
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png',
        tags: ['A380/A350 Fleet', '5-Star Airline', 'Global Network'],
        category: 'Pilot Training & Certification'
    },
    {
        id: 'disc-comm-easyjet',
        title: 'easyJet Cadet Pilot Programme',
        company: 'easyJet',
        matchProbability: 87,
        location: 'London, UK / Various European Bases',
        image: 'https://www.cae.com/content/images/civil-aviation/_webp/easyJet_crew_.jpg_webp_40cd750bba9870f18aada2478b24840a.webp',
        tags: ['A320 Fleet', 'European Network', 'Low-Cost Leader'],
        category: 'Commercial Operations'
    },
    {
        id: 'disc-low-1',
        title: 'Regional Commuter First Officer',
        company: 'Mesa Airlines / Air Wisconsin',
        matchProbability: 72,
        location: 'Phoenix, AZ / Various US Bases',
        image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80',
        tags: ['Regional Carrier', 'E175/CRJ Fleet', 'United Express Partner'],
        category: 'Career Progression'
    },
    {
        id: 'disc-low-2',
        title: 'Helicopter EMS Pilot Pathway',
        company: 'Air Methods / REACH Air Medical',
        matchProbability: 68,
        location: 'United States',
        image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
        tags: ['Rotary Wing', 'Medical Transport', 'IFR Experience Required'],
        category: 'Specialized Operations'
    },
    {
        id: 'disc-low-3',
        title: 'Cargo Feeder Pilot — Part 135',
        company: 'Ameriflight / Wiggins Airways',
        matchProbability: 65,
        location: 'Various US Hubs',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
        tags: ['Part 135 Cargo', 'Beech 99 / SA227', 'Build Turbine Time'],
        category: 'Commercial Operations'
    },
    {
        id: 'disc-low-4',
        title: 'Agricultural Aviation Pilot',
        company: 'Various Operators',
        matchProbability: 74,
        location: 'Midwest US / Australia',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
        tags: ['Crop Dusting', 'Tailwheel Experience', 'Seasonal Work'],
        category: 'Specialized Operations'
    }
];

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
    const [activeMatchFilter, setActiveMatchFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
    const [activeCarouselCategory, setActiveCarouselCategory] = useState<string>('All');
    const [activeProductTab, setActiveProductTab] = useState<'programs' | 'pathways' | 'profile'>('pathways');

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
    const pathwaysCarouselRef = useRef<HTMLDivElement>(null);
    const [isOverWhite, setIsOverWhite] = useState(false);
    const [selectedCarouselPathway, setSelectedCarouselPathway] = useState<any>(null);

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
                
                const visiblePathways = HOME_PATHWAYS.filter(p => {
                    const matchesMatch = (() => {
                        if (activeMatchFilter === 'all') return true;
                        if (activeMatchFilter === 'low') return p.matchProbability >= 60 && p.matchProbability < 75;
                        if (activeMatchFilter === 'mid') return p.matchProbability >= 75 && p.matchProbability < 90;
                        return p.matchProbability >= 90;
                    })();
                    const matchesCategory = activeCarouselCategory === 'All' || p.category === activeCarouselCategory;
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
        const visiblePathways = HOME_PATHWAYS.filter(p => {
            const matchesMatch = (() => {
                if (activeMatchFilter === 'all') return true;
                if (activeMatchFilter === 'low') return p.matchProbability >= 60 && p.matchProbability < 75;
                if (activeMatchFilter === 'mid') return p.matchProbability >= 75 && p.matchProbability < 90;
                return p.matchProbability >= 90;
            })();
            const matchesCategory = activeCarouselCategory === 'All' || p.category === activeCarouselCategory;
            return matchesMatch && matchesCategory;
        });
        if (visiblePathways.length > 0 && !selectedCarouselPathway) {
            setSelectedCarouselPathway(visiblePathways[0]);
        }
    }, [activeMatchFilter, activeCarouselCategory, selectedCarouselPathway]);

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
            
            {/* Gradient Blur Transition between PathwayGrid and Showcase */}
            <div className="relative h-32 w-full z-40 pointer-events-none overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(15,23,42,0.3) 40%, rgba(15,23,42,0.7) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, black 100%)'
                    }}
                />
            </div>

            {/* === AIRBNB-STYLE SHOWCASE SECTION === */}
            <div className="relative pt-8 pb-16 px-4 md:px-6 overflow-hidden">
                {/* Mesh Gradient Background - Darkened for white text readability */}
                <div className="absolute inset-0 z-0">
                    <MeshGradient
                        className="w-full h-full"
                        colors={[
                            "#000000",
                            "#050a14",
                            "#0d1f3c",
                            "#1e293b",
                            "#0f172a",
                            "#1e3a5f",
                            "#172554",
                            "#020617"
                        ]}
                        speed={0.22}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80" />
                    <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/20" />
                </div>

                {/* Product Tabs — Inline Headline */}
                <div className="relative z-20">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-1 md:gap-8 px-4 py-6">
                        {[
                            { id: 'programs' as const, label: 'Programs' },
                            { id: 'pathways' as const, label: 'Pathways' },
                            { id: 'profile' as const, label: 'Recognition Profile' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveProductTab(tab.id)}
                                className={`relative pb-1 text-base md:text-lg tracking-wide transition-all duration-300 ${
                                    activeProductTab === tab.id
                                        ? 'text-white font-medium'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                                style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal' }}
                            >
                                {tab.label}
                                {activeProductTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                    {activeProductTab === 'pathways' && (
                <div className="relative z-10">
                    {/* Hero Section */}
                    <div className="mb-8 text-center pt-16">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-sky-400 mb-3">Discover Pathways</p>
                        <h1 className="text-4xl md:text-5xl font-serif font-normal text-white mb-2">
                            <span style={{ color: '#ffffff' }}>Pilot Recognition</span>{' '}
                            <span style={{ color: '#dc2626' }}>Pathways</span>
                        </h1>
                    </div>

                    {/* Context Banner - Pulling System */}
                    <div className="mb-6 w-full px-4">
                        <div className="w-full max-w-7xl mx-auto">
                            <div className="bg-blue-900/30 backdrop-blur border border-blue-500/30 rounded-xl p-4 text-center">
                                <p className="text-white text-sm font-medium">
                                    Pathway Cards — Not Job Listings. Submit your interest. Airlines pull from your live real-time profile.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 flex justify-center px-4">
                        <div className="w-full max-w-2xl">
                            <div className="bg-slate-400/30 backdrop-blur rounded-lg px-4 py-3 text-slate-300 text-sm">
                                Search pathways, airlines, or locations...
                            </div>
                        </div>
                    </div>

                    {/* Category Pills */}
                    <div className="mb-8 flex flex-wrap justify-center gap-2 px-4">
                        {[
                            'All',
                            'Pilot Training & Certification',
                            'Career Progression',
                            'Commercial Operations',
                            'Specialized Operations',
                            'Humanitarian & Aid',
                            'Remote & Bush Operations',
                            'Emerging Technologies',
                            'Military & Government',
                            'Aviation Support Services',
                            'Aviation Industry'
                        ].map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveCarouselCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                    activeCarouselCategory === cat
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Recommended Pathways Header */}
                    <div className="mb-4 w-full max-w-7xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-normal text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                            Recommended Pathways
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">26 pathways available</p>
                    </div>

                    {/* Match Filter */}
                    <div className="mb-4 w-full max-w-7xl mx-auto px-4 flex justify-center">
                        <div className="flex items-center gap-2">
                            <span className="text-base text-slate-400">Match Filter:</span>
                            <div className="flex gap-2">
                                {[
                                    { key: 'all' as const, label: 'All' },
                                    { key: 'low' as const, label: 'Low 60-75%' },
                                    { key: 'mid' as const, label: 'Mid 75-90%' },
                                    { key: 'high' as const, label: 'High 90%+' },
                                ].map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => setActiveMatchFilter(filter.key)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            activeMatchFilter === filter.key
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Selection hint */}
                    <div className="text-center mb-4">
                        <span className="text-sm font-normal text-white/50">Swipe left or right and click to select a card</span>
                    </div>

                    {/* Pathway Cards Carousel - Full PathwaysPageModern Style */}
                    <div className="relative w-screen left-1/2 -translate-x-1/2 mb-6">
                        <style>{`
                            .pathways-carousel::-webkit-scrollbar { display: none; }
                            .pathways-carousel { -ms-overflow-style: none; scrollbar-width: none; }
                            .pathways-carousel {
                                scroll-snap-type: x mandatory;
                                scroll-behavior: smooth;
                                scroll-padding-left: calc(50vw - 300px);
                                scroll-padding-right: calc(50vw - 300px);
                            }
                            .pathways-carousel > div {
                                scroll-snap-align: center;
                            }
                        `}</style>
                        <div ref={pathwaysCarouselRef} className="pathways-carousel flex gap-4 overflow-x-auto overflow-y-hidden pb-4" style={{ WebkitOverflowScrolling: 'touch', cursor: 'grab', paddingLeft: 'calc(50vw - 300px)', paddingRight: 'calc(50vw - 300px)' }}>
                            {/* Intro Card */}
                            <div
                                key="FOUNDATION-PROGRAM-ENROLL"
                                className="flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 p-[3px] scale-95 opacity-100 hover:scale-100"
                                style={{ width: '600px', scrollSnapAlign: 'center' }}
                                onClick={() => onNavigate('programs')}
                            >
                                <div className="relative h-[300px] overflow-hidden rounded-xl bg-slate-800">
                                    <img
                                        src="/program1.png"
                                        alt="Foundation Program"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                                    <div className="absolute top-3 right-3 flex gap-2 items-start">
                                        <span className="px-3 py-1 rounded-full bg-blue-500/90 text-white text-xs font-semibold">Featured</span>
                                        <span className="px-3 py-1 rounded-full bg-sky-500/90 text-white text-xs font-semibold">PR: 77%</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <h4 className="text-lg font-serif font-normal text-white">Foundation Program</h4>
                                        </div>
                                        <p className="text-white/80 text-sm">PilotRecognition · Global</p>
                                    </div>
                                </div>
                            </div>
                            {/* Cadet Programme Cards */}
                            {HOME_PATHWAYS.filter(pathway => {
                                const matchesMatch = (() => {
                                    if (activeMatchFilter === 'all') return true;
                                    if (activeMatchFilter === 'low') return pathway.matchProbability >= 60 && pathway.matchProbability < 75;
                                    if (activeMatchFilter === 'mid') return pathway.matchProbability >= 75 && pathway.matchProbability < 90;
                                    return pathway.matchProbability >= 90;
                                })();
                                const matchesCategory = activeCarouselCategory === 'All' || pathway.category === activeCarouselCategory;
                                return matchesMatch && matchesCategory;
                            }).map((pathway) => (
                                <div
                                    key={pathway.id}
                                    className="flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 p-[3px] scale-95 opacity-100 hover:scale-100"
                                    style={{ width: '600px', scrollSnapAlign: 'center' }}
                                    onClick={() => onNavigate('pathways-modern')}
                                >
                                    <div className="relative h-[300px] overflow-hidden rounded-xl bg-slate-800">
                                        <img 
                                            src={pathway.image} 
                                            alt={pathway.title} 
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/default-airline.jpg'; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                                        <div className="absolute top-3 right-3 flex gap-2 items-start">
                                            <button className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors">
                                                {pathway.matchProbability}% Match
                                            </button>
                                            <span className="px-3 py-1 rounded-full bg-sky-500/90 text-white text-xs font-semibold">PR: 77%</span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <h4 className="text-lg font-serif font-normal text-white">{pathway.title}</h4>
                                            </div>
                                            <p className="text-white/80 text-sm">{pathway.company} · {pathway.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Pathway Display */}
                    {selectedCarouselPathway && (
                        <div className="flex items-center justify-center gap-4 mt-4 mb-8">
                            <button
                                onClick={() => pathwaysCarouselRef.current?.scrollBy({ left: -616, behavior: 'smooth' })}
                                className="p-3 rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all flex-shrink-0 backdrop-blur-md"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="text-center max-w-xl">
                                <p className="text-xs uppercase tracking-widest text-white/70 mb-1">Selected Pathway</p>
                                <h3 className="text-xl font-serif font-normal text-white mb-1">{selectedCarouselPathway.title}</h3>
                                <p className="text-sm text-white/70 mb-2">{selectedCarouselPathway.company} · {selectedCarouselPathway.location}</p>
                                <p className="text-sm leading-relaxed text-white/70">{selectedCarouselPathway.tags?.[0] || 'Explore this pathway'}</p>
                            </div>
                            <button
                                onClick={() => pathwaysCarouselRef.current?.scrollBy({ left: 616, behavior: 'smooth' })}
                                className="p-3 rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all flex-shrink-0 backdrop-blur-md"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Profile Alignment Section */}
                    {selectedCarouselPathway && (
                        <div className="mb-16">
                            {/* CTA Button */}
                            <div className="text-center mb-6">
                                <button
                                    onClick={() => selectedCarouselPathway.matchProbability >= 75 ? onNavigate('pathways-modern') : onNavigate('become-member')}
                                    className={`px-8 py-3 rounded-lg text-sm font-semibold transition-all ${
                                        selectedCarouselPathway.matchProbability >= 75
                                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                                    }`}
                                >
                                    {selectedCarouselPathway.matchProbability >= 75 
                                        ? 'Submit Interest for Pathway' 
                                        : 'Improve Your Profile'}
                                </button>
                            </div>
                            <div className="text-center mb-6">
                                <p className="text-xs uppercase tracking-widest text-white/70 mb-2">REQUIREMENTS & PROFILE ALIGNMENT</p>
                                <p className="text-sm text-white/50">Updated: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="max-w-4xl mx-auto">
                                {/* Single Glassy UI Component */}
                                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                                    {/* Flight Hours */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-white">FLIGHT HOURS</h4>
                                            {selectedCarouselPathway.matchProbability >= 75 && (
                                                <span className="text-xs text-emerald-400 flex items-center gap-1">
                                                    <span>✓</span> Met
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/60 mb-3">
                                            Your account shows: {totalHours || 0} total flight hours
                                        </p>
                                        {selectedCarouselPathway.matchProbability < 75 ? (
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                                <p className="text-xs text-red-400 font-medium mb-2">
                                                    ⚠ {selectedCarouselPathway.matchProbability}%+ Match - Improvement needed
                                                </p>
                                                <p className="text-xs text-white/70">
                                                    <span className="text-white font-semibold">Recommended:</span> Build more flight hours through training, mentorship, or additional certifications. Consider gaining multi-engine and turbine time for better alignment.
                                                </p>
                                            </div>
                                        ) : (
                                            <details className="group">
                                                <summary className="text-xs text-emerald-400 cursor-pointer hover:underline">View details</summary>
                                                <div className="mt-2 text-xs text-white/60 pl-4">
                                                    Good alignment with pathway requirements
                                                </div>
                                            </details>
                                        )}
                                    </div>

                                    {/* Foundation Program */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-white">FOUNDATION PROGRAM</h4>
                                            {isEnrolledInFoundation && (
                                                <span className="text-xs text-emerald-400 flex items-center gap-1">
                                                    <span>✓</span> Enrolled
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/60 mb-3">
                                            Your progress: {foundationProgress || 0}% complete
                                        </p>
                                        {!isEnrolledInFoundation ? (
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                                <p className="text-xs text-red-400 font-medium mb-2">
                                                    ○ Not Started
                                                </p>
                                                <p className="text-xs text-white/70">
                                                    <span className="text-white font-semibold">Recommended:</span> Enroll in the Foundation Program for 50 hours of verified mentorship, EBT CBTA-aligned competency assessment, and ATLAS CV formatting. This builds your Recognition Score from day one.
                                                </p>
                                            </div>
                                        ) : (
                                            <details className="group">
                                                <summary className="text-xs text-emerald-400 cursor-pointer hover:underline">View details</summary>
                                                <div className="mt-2 text-xs text-white/60 pl-4">
                                                    {foundationProgress || 0}% complete
                                                </div>
                                            </details>
                                        )}
                                    </div>

                                    {/* Recognition Score */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-white">RECOGNITION SCORE</h4>
                                            {(overallRecognitionScore || 0) >= 70 && (
                                                <span className="text-xs text-emerald-400 flex items-center gap-1">
                                                    <span>✓</span> Met
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/60 mb-3">
                                            Your score: {overallRecognitionScore || 0} / 100
                                        </p>
                                        {(overallRecognitionScore || 0) < 70 ? (
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                                <p className="text-xs text-red-400 font-medium mb-2">
                                                    ⚠ Recognition Score 70+ - In Progress ({70 - (overallRecognitionScore || 0)} points to go)
                                                </p>
                                                <p className="text-xs text-white/70">
                                                    <span className="text-white font-semibold">Recommended:</span> Complete programs, gain mentorship hours, and improve examination scores. Build networking experience within the aviation community to strengthen your recognition profile.
                                                </p>
                                            </div>
                                        ) : (
                                            <details className="group">
                                                <summary className="text-xs text-emerald-400 cursor-pointer hover:underline">View details</summary>
                                                <div className="mt-2 text-xs text-white/60 pl-4">
                                                    Strong recognition profile
                                                </div>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recognition AI Strategy Component */}
                            <div className="max-w-4xl mx-auto mt-8">
                                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-xl p-6 border border-blue-500/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <span className="text-blue-400 text-lg">AI</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Recognition AI Strategy</h4>
                                            <p className="text-xs text-white/60">Personalized recommendations based on your profile</p>
                                        </div>
                                    </div>
                                    
                                    {/* Recognition Score vs Job */}
                                    <div className="bg-black/30 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-white/70">Recognition Score vs Job</span>
                                            <span className={`text-sm font-bold ${(overallRecognitionScore || 0) >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                {overallRecognitionScore || 0} / 100
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                                            <div 
                                                className="h-2 rounded-full transition-all duration-300"
                                                style={{ 
                                                    width: `${overallRecognitionScore || 0}%`,
                                                    backgroundColor: (overallRecognitionScore || 0) >= 70 ? '#10b981' : '#f59e0b'
                                                }}
                                            />
                                        </div>
                                        <p className={`text-xs ${(overallRecognitionScore || 0) >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {(overallRecognitionScore || 0) >= 70 ? '✓ High Match' : '⚠ Low Match'}
                                        </p>
                                    </div>

                                    {/* Profile Alignment Status */}
                                    <div className="mb-4">
                                        <p className="text-xs text-white/70 mb-2">Profile Alignment</p>
                                        <div className={`text-sm font-semibold ${selectedCarouselPathway.matchProbability >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {selectedCarouselPathway.matchProbability >= 75 ? 'Aligned with high match rate' : 'Needs improvement for better alignment'}
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                                        <p className="text-xs text-white/70 mb-3">Recommended Actions:</p>
                                        <ul className="space-y-2">
                                            <li className="text-xs text-white/80 flex items-start gap-2">
                                                <span className="text-blue-400">•</span>
                                                <span>Improve English proficiency through aviation communication training</span>
                                            </li>
                                            <li className="text-xs text-white/80 flex items-start gap-2">
                                                <span className="text-blue-400">•</span>
                                                <span>Build more flight hours and gain diverse flying experience</span>
                                            </li>
                                            <li className="text-xs text-white/80 flex items-start gap-2">
                                                <span className="text-blue-400">•</span>
                                                <span>Gain networking experience within the aviation community</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Discover More Link */}
                    <div className="text-center mb-16">
                        <button
                            onClick={() => onNavigate('pathways-modern')}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-all border border-white/20"
                        >
                            View All Pathways <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {activeProductTab === 'programs' && (
                <div className="relative z-10 max-w-6xl mx-auto px-4 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Foundation</p>
                            <h3 className="text-xl text-white mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Foundation Program</h3>
                            <p className="text-sm text-slate-300 mb-4">50 hours of verified mentorship, EBT CBTA-aligned competency assessment, and industry-recognized CV formatting. Build your Recognition Score from day one.</p>
                            <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                                <span>Mentorship: 50 hrs</span>
                                <span className="text-white font-semibold">$49</span>
                            </div>
                            <button
                                onClick={() => onNavigate('foundation-program')}
                                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium tracking-wider transition-colors"
                            >
                                Enroll Now
                            </button>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Transition</p>
                            <h3 className="text-xl text-white mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Transition Program</h3>
                            <p className="text-sm text-slate-300 mb-4">Airline transition with 9 core competencies, Airbus HINFACT applications, ATLAS resume formatting, and internship placement.</p>
                            <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                                <span>Full readiness</span>
                                <span className="text-white font-semibold">$299</span>
                            </div>
                            <button
                                onClick={() => onNavigate('transition-program')}
                                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium tracking-wider transition-colors"
                            >
                                Learn More
                            </button>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">EBT Scoring</p>
                            <h3 className="text-xl text-white mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>EBT Video Assessment</h3>
                            <p className="text-sm text-slate-300 mb-4">Recorded interview evaluating cognitive behaviorism and constructivism alignment. Airlines view your interview directly.</p>
                            <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                                <span>Bundle with Transition</span>
                                <span className="text-white font-semibold">Included</span>
                            </div>
                            <button
                                onClick={() => onNavigate('programs')}
                                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium tracking-wider transition-colors"
                            >
                                View Programs
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeProductTab === 'profile' && (
                <div className="relative z-10 mb-10 relative">
                    <div className="max-w-4xl mx-auto relative">
                        
                        {/* Recognition Profile Section */}
                        <div className="transition-all duration-500 ease-in-out">
                            {/* Section Header */}
                            <div className="mb-4">
                                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-300 mb-1">Pilot Data</p>
                                <p className="text-xs text-slate-400">Identity, credentials, flight activity, and core hour summaries</p>
                            </div>

                            {/* Redesigned Single Card Layout with ATLAS influence */}
                            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] overflow-hidden">
                                {/* ATLAS-style Header Bar */}
                                <div className="bg-red-600 px-4 py-3 border-b border-red-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-200 mb-0.5">Pilot Recognition Profile</p>
                                            <h4 className="text-sm font-bold text-white">Pete Michelle</h4>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-200 mb-1">SHARE LINK</p>
                                            <button
                                                onClick={() => onNavigate('pilot-recognition-profile')}
                                                className="px-2 py-1 bg-white border border-red-300 rounded text-[10px] font-medium text-red-700 hover:bg-red-50 transition-colors"
                                            >
                                                Copy URL
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {/* Profile Header */}
                                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                                        <div className="w-[60px] h-[60px] rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                                            PM
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-blue-600 font-semibold tracking-[0.18em] mb-1">ATPL (USA) · 8 Ratings</p>
                                            <p className="text-[10px] text-slate-500 truncate">pete.michelle@aviation.com</p>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end flex-shrink-0">
                                            <div className="text-right">
                                                <p className="text-[9px] tracking-[0.12em] text-slate-500 uppercase mb-0.5">Flight Hours</p>
                                                <p className="text-lg font-bold text-slate-900">3,500</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] tracking-[0.12em] text-slate-500 uppercase mb-0.5">Score</p>
                                                <p className="text-lg font-bold text-slate-900">847</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ATLAS-style Data Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                        {[
                                            { label: 'License Type', value: 'ATPL' },
                                            { label: 'License Number', value: 'A-789456' },
                                            { label: 'License Status', value: 'Valid' },
                                            { label: 'English Level', value: 'Level 6' },
                                            { label: 'Career Stage', value: 'Captain' },
                                            { label: 'Last Flown', value: '2 days ago' },
                                            { label: 'Countries Visited', value: '12' },
                                            { label: 'Favorite Aircraft', value: 'B737-800' }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-slate-50/80 rounded-lg p-2 border border-slate-100 text-center">
                                                <p className="text-[9px] text-slate-500 tracking-[0.1em] mb-0.5">{item.label}</p>
                                                <p className="text-xs font-bold text-slate-900">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ATLAS-style Footer */}
                                <div className="bg-slate-50 px-4 py-2 border-t border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] text-slate-500">
                                            ATLAS CV · ATS-Readable · Verified
                                        </p>
                                        <button
                                            onClick={() => onNavigate('pilot-licensure-experience')}
                                            className="text-[9px] text-blue-600 font-medium hover:underline"
                                        >
                                            View Full Profile →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                        <button
                            onClick={() => onNavigate('pilot-recognition-profile')}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Build Your Profile
                        </button>
                    </div>
                </div>
            </div>
            )}
            </div>

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
