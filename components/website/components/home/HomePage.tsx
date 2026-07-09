import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, User, CheckCircle2, Zap, Navigation, X, ShieldCheck, Clock } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { ThemeContext } from '../../context/ThemeContext';

import { IMAGES } from '@/lib/website-constants';
import { MeshGradient } from '@paper-design/shaders-react';
import { PathwayGrid, type Slide } from './PathwayGrid';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';
import { HomePageSchema } from '../seo/HomePageSchema';
import { getDevicePerformanceTier, shouldEnable3DEffects, getHomepageGraphicsConfig, type HomepageGraphicsConfig } from '@/lib/device-detection';
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

const navItems = [
    { name: 'Home', target: 'home' },
    { name: 'About', target: 'about' },
    { name: 'Pathways', target: 'about_programs' },
    { name: 'Accreditation', target: 'accreditation' },
    { name: 'Profile', target: 'profile' },
    { name: 'Contact', target: 'dashboard' },
];

const tabsData = [
    {
        id: 'programs',
        label: 'Programs',
        content: (
            <div className="space-y-4">
                <div className="rounded-2xl p-4 md:p-6 border border-slate-200">
                    <div className="mb-4 pb-3 border-b border-slate-200">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Foundation Program</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Building Your Aviation Foundation</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="rounded-xl p-3 border border-slate-200">
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

                        <div className="rounded-xl p-3 border border-slate-200">
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

                    <div className="rounded-xl p-3 border border-slate-200">
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
                <div className="rounded-2xl p-4 md:p-6 border border-slate-200">
                    <div className="mb-4 pb-3 border-b border-slate-200">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Pilot Recognition Profile</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Your Professional Aviation Identity</p>
                    </div>

                    <div className="rounded-xl p-4 border border-slate-200 mb-4">
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

                    <div className="rounded-xl p-4 border border-slate-200 mb-4">
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
                <div className="rounded-2xl p-4 md:p-6 border border-slate-200">
                    <div className="mb-4 pb-3 border-b border-slate-200">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Pilot Pathways & Recognition</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">From Profile to Career</p>
                    </div>

                    <div className="rounded-xl p-4 border border-slate-200 mb-4">
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
                            <h4 className="font-bold text-slate-900 mb-2 text-xs">Smart Pathway Matching System</h4>
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
        description: 'CEO & Founder Benjamin Bowler breaks down how to align your profile with Airbus EBT standards. It is not about flight hours alone — airlines want cognitive skills, behavioral markers, and constructivist thinking that static CVs never capture.',
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1777590630/newsroom/kvos2ityyztesx5idue2.png',
        metrics: [
            { label: 'Live Webinars', value: 'This week' },
            { label: 'Profile Views', value: '2,340 +' }
        ],
        bullets: [
            'Webinar series with Benjamin Bowler on EBT CBTA alignment beyond stick-and-rudder skills',
            'Behavioral scoring, mentorship hours, and competency verification in one live profile',
            'Airlines and operators pull verified profiles — no more static CVs into black holes'
        ],
        ctaTarget: 'recognition-plus',
        category: 'pilot' as const
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
        ctaTarget: 'discover-pathways',
        category: 'pathways' as const
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
        ctaTarget: 'programs',
        category: 'program' as const
    },
    {
        id: 'airbus-manufacturer-update',
        tag: 'Airbus Manufacturer',
        title: 'Airbus EBT Standards Integration Update',
        description: 'Airbus announces new integration with PilotRecognition platform for EBT CBTA standards verification. Airlines can now directly access verified pilot competency data aligned with Airbus HINFACT requirements.',
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1777590658/newsroom/b81ubzdpz0dmyqutiyqj.png',
        metrics: [
            { label: 'Integrated Carriers', value: '8 airlines' },
            { label: 'Verification Rate', value: '95% faster' }
        ],
        bullets: [
            'Direct integration with Airbus HINFACT application system',
            'Real-time competency verification for EBT CBTA standards',
            'Streamlined pathway matching for Airbus operator requirements'
        ],
        ctaTarget: 'discover-pathways',
        category: 'industry' as const
    },
    {
        id: 'airline-update',
        tag: 'Airline Partnerships',
        title: 'Major Airlines Join PilotRecognition Platform',
        description: 'Leading airlines including Emirates, Qatar Airways, and Etihad have joined the PilotRecognition platform to directly recruit verified pilots through the pull system. No more applications — operators pull based on verified competencies.',
        image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1777590647/newsroom/tws5xzryqjepzxoyc94d.png',
        metrics: [
            { label: 'Partner Airlines', value: '15 carriers' },
            { label: 'Active Pulls', value: '2,400+ monthly' }
        ],
        bullets: [
            'Direct recruitment through verified profile matching system',
            'Elimination of application black holes — operators pull qualified pilots',
            'Real-time pathway matching with airline-specific requirements'
        ],
        ctaTarget: 'discover-pathways',
        category: 'airlines' as const
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
        pr: 82,
        location: 'United States | Home-Based',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
        tags: ['American Airlines Flow', 'Embraer Fleet', 'Tuition Reimbursement'],
        category: 'Pilot Training & Certification'
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
        category: 'Pilot Training & Certification'
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
        category: 'Commercial Operations'
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
        category: 'Commercial Operations'
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
        category: 'Commercial Operations'
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
        category: 'Career Progression'
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
        category: 'Pilot Training & Certification'
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
        category: 'Commercial Operations'
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
    const themeContext = useContext(ThemeContext);
    const isDarkMode = themeContext?.isDarkMode ?? false;

    // Automatic device detection for performance optimization
    const [deviceTier, setDeviceTier] = useState<'low' | 'medium' | 'high'>('high');
    const [showOptimizationMessage, setShowOptimizationMessage] = useState(false);
    const [enableShader, setEnableShader] = useState(false); // Disabled to fix WebGL context leaks
    const [graphicsConfig, setGraphicsConfig] = useState<HomepageGraphicsConfig | null>(null);
    const [showGraphicsToast, setShowGraphicsToast] = useState(false);
    const [isNewsroomModalOpen, setIsNewsroomModalOpen] = useState(false);
    const [activeMatchFilter, setActiveMatchFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');
    const [activeCarouselCategory, setActiveCarouselCategory] = useState<string>('All');
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    const [activeBillboardSlide, setActiveBillboardSlide] = useState(0);
    const [pilotShortageImageIndex, setPilotShortageImageIndex] = useState(0);
    const pilotShortageImages = ['/images/set-07-ui-graphics/worker.png', '/images/set-07-ui-graphics/event2.png'];

    // Auto-advance platform news cards every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBillboardSlide(prev => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Auto-shuffle pilotshortage card image every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setPilotShortageImageIndex(prev => (prev + 1) % pilotShortageImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Check for enrollment success and show confirmation modal
    useEffect(() => {
        const enrollmentSuccess = sessionStorage.getItem('enrollmentSuccess');
        if (enrollmentSuccess === 'true') {
            setShowEnrollmentModal(true);
            sessionStorage.removeItem('enrollmentSuccess');
        }
    }, []);
    
    useEffect(() => {
        // Scroll to top on component mount to prevent unwanted scroll behavior
        window.scrollTo(0, 0);
        
        // Detect device performance on mount
        const tier = getDevicePerformanceTier();
        setDeviceTier(tier);
        
        // Disable shader on low-end devices
        const shouldEnableShader = shouldEnable3DEffects();
        setEnableShader(shouldEnableShader);

        // Homepage-specific graphics config (covers MeshGradient, backdrop-blur, speed)
        const cfg = getHomepageGraphicsConfig();
        setGraphicsConfig(cfg);
        
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
    const topRecommendedCarouselRef = useRef<HTMLDivElement>(null);
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
            <HomePageSchema />
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' }
            ]} />
            <style>{`
                @keyframes ticker-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
            <div id="home-root" className="relative font-sans bg-black overflow-x-hidden flex flex-col min-h-screen pt-16">
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
                                <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 45%)' }} />

                                {/* Header */}
                                <div className="relative p-2 md:p-3 text-center border-b border-white/10">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[9px] uppercase tracking-[0.15em] text-emerald-200/90 font-black">Live Confirmation</span>
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
                                        onClick={() => { setShowEnrollmentModal(false); onNavigate('access-portal-2?tab=programs'); }}
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
                                                Enter your program dashboard, track progress, and access all training materials.
                                            </p>
                                            <div className="flex items-center gap-0.5 pt-0.5">
                                                <Zap className="w-2.5 h-2.5 text-blue-400" />
                                                <span className="text-[8px] uppercase tracking-[0.1em] text-blue-300/80">Dashboard</span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Card 2: Build Your Profile */}
                                    <button
                                        onClick={() => { setShowEnrollmentModal(false); onNavigate('become-member'); }}
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
                                                Complete your pilot recognition profile to unlock pathway matching and scoring.
                                            </p>
                                            <div className="flex items-center gap-0.5 pt-0.5">
                                                <User className="w-2.5 h-2.5 text-amber-400" />
                                                <span className="text-[8px] uppercase tracking-[0.1em] text-amber-300/80">Recognition</span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Card 3: Explore Pathways */}
                                    <button
                                        onClick={() => { setShowEnrollmentModal(false); onNavigate('recognition-career-matches'); }}
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
                                                Discover airline expectations, cadet programs, and career transition routes.
                                            </p>
                                            <div className="flex items-center gap-0.5 pt-0.5">
                                                <Navigation className="w-2.5 h-2.5 text-emerald-400" />
                                                <span className="text-[8px] uppercase tracking-[0.1em] text-emerald-300/80">Pathways</span>
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
                            colors={isDarkMode ? [
                                '#020617',
                                '#0f172a',
                                '#1e293b',
                                '#1e3a5f',
                                '#111827'
                            ] : [
                                '#dbeafe',
                                '#94a3b8',
                                '#64748b',
                                '#475569',
                                '#334155',
                                '#1e3a5f',
                                '#1e3a8a',
                                '#0f172a'
                            ]}
                            speed={graphicsConfig.meshGradientSpeed}
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{
                                background: isDarkMode
                                    ? 'linear-gradient(160deg, #020617 0%, #0f172a 40%, #111827 100%)'
                                    : 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%)'
                            }}
                        />
                    )}
                </div>

                {/* Flight Simulator Style Grid */}
                {deviceTier === 'low' ? (
                    // Lazy load PathwayGrid for low-end devices
                    <React.Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading...</div>}>
                        <div ref={pathwayGridRef} className="relative z-0 pt-0 md:pt-16">
                            <PathwayGrid slides={allSlides} onNavigate={onNavigate} onGoToProgramDetail={onGoToProgramDetail} onLogin={onLogin} onBecomeMemberOpen={onJoinUs} isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} />
                        </div>
                    </React.Suspense>
                ) : (
                    <div ref={pathwayGridRef} className="relative z-0 pt-0 md:pt-16">
                        <PathwayGrid slides={allSlides} onNavigate={onNavigate} onGoToProgramDetail={onGoToProgramDetail} onLogin={onLogin} onBecomeMemberOpen={onJoinUs} isLoggedIn={isLoggedIn} isEnrolledInFoundation={isEnrolledInFoundation} />
                    </div>
                )}
            </div>

            {/* === OUR PURPOSE — FEATURE STORIES CAROUSEL === */}
            <div data-section="purpose" className="relative z-50 w-full px-4 md:px-8 -mt-16 md:mt-0 pt-8 md:pt-12 pb-8 md:pb-12 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-500 mb-2">Recognition in Action</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                            Our <span className="text-red-600">purpose</span>
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base max-w-2xl">
                            Verifying pilots through Recognition+. Building trusted profiles that connect aviators to verified pathways, opportunities, and the industry partners that matter.
                        </p>
                        <div className="mt-3 w-12 h-1.5 bg-blue-900 rounded-full" />
                    </div>

                    {/* Horizontal story cards */}
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {[
                            {
                                image: '/images/set-06-pathways/pathway4.png',
                                tags: ['Career Pathways', 'Type Rating Search'],
                                title: 'From first solo to airline-ready: mapped career pathways',
                                desc: 'Compare airline requirements, explore type ratings, and align your profile with operator expectations.',
                                date: '08 July 2026',
                                readTime: '4 min read',
                                href: 'pathways-modern'
                            },
                            {
                                image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png',
                                tags: ['Pilot Shortage', 'Foundation Program'],
                                title: 'Addressing the global pilot shortage through verified training',
                                desc: 'Structured foundation and transition programs that pair aspiring aviators with mentorship and operator connections.',
                                date: '06 July 2026',
                                readTime: '5 min read',
                                href: 'foundation-program'
                            },
                            {
                                image: '/images/set-03-recognition/recognition-unlock.png',
                                tags: ['Recognition+', 'Verification'],
                                title: 'Turn your logbook into a credential airlines trust',
                                desc: 'Recognition+ tokenizes your licensing history and verifies your hours so operators can hire with confidence.',
                                date: '04 July 2026',
                                readTime: '3 min read',
                                href: 'recognition-plus'
                            },
                            {
                                image: '/images/set-07-ui-graphics/terminal.png',
                                tags: ['Pilot Terminal', 'Community'],
                                title: 'A professional network built by pilots, for pilots',
                                desc: 'Join verified discussions, access flight deck tools, and connect with operators through fair, two-way communication.',
                                date: '02 July 2026',
                                readTime: '4 min read',
                                href: 'https://pilotterminal.com',
                                external: true
                            }
                        ].map((story, idx) => (
                            <article
                                key={idx}
                                className="min-w-[85vw] md:min-w-[360px] lg:min-w-[420px] snap-start bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-lg flex flex-col"
                            >
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={story.image}
                                        alt={story.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {story.tags.map((tag) => (
                                            <span key={tag} className="px-2.5 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">
                                        {story.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                                        {story.desc}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">{story.date} — {story.readTime}</span>
                                        {story.external ? (
                                            <a
                                                href={story.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700"
                                            >
                                                Read
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => onNavigate?.(story.href)}
                                                className="inline-flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700"
                                            >
                                                Read
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {/* === BECOME A MEMBER BANNER === */}
            <div data-section="4" className="relative z-30 w-full px-4 md:px-8 py-10 hidden md:block">
                <div className="max-w-7xl mx-auto">
                    <div className="relative overflow-hidden shadow-xl" style={{ backgroundColor: '#0d1b3e' }}>
                        <div className="px-8 py-8 md:px-10 md:py-10 flex flex-col lg:flex-row items-center gap-8 min-h-[280px]">
                            <div className="w-full lg:w-7/12">
                                        <h2 className="text-2xl md:text-4xl font-semibold mb-4 leading-tight" style={{ color: '#ffffff' }}>
                                    Discover <span style={{ color: '#dc2626' }}>pathways</span>, align your profile with operator <span style={{ color: '#dc2626' }}>requirements and expectations</span>.
                                </h2>
                                <p className="text-sm md:text-base leading-relaxed max-w-2xl" style={{ color: '#ffffff', opacity: 0.9 }}>
                                    Create your pilot profile for free, and get verified with <span style={{ color: '#dc2626' }}>Recognition+</span>.
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
                                        style={{ backgroundColor: 'transparent', color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
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
            <div data-section="5" className="relative z-30 w-full bg-white border-b border-slate-100 px-4 md:px-8 py-5 overflow-hidden">
                <div className="max-w-7xl mx-auto mb-3 text-center">
                    <h4
                        className="text-2xl md:text-3xl text-slate-900 font-normal"
                        style={{ fontFamily: 'Georgia, "Helvetica Neue", Arial, sans-serif' }}
                    >
                        Aviation industry first pilot <span className="text-red-500">recognition</span> platform built for
                    </h4>
                </div>
                <div className="max-w-7xl mx-auto relative">
                    <div className="absolute inset-y-0 left-0 w-16 pointer-events-none bg-gradient-to-r from-white to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-16 pointer-events-none bg-gradient-to-l from-white to-transparent" />
                    <div className="flex gap-8 whitespace-nowrap animate-marquee text-slate-900 font-semibold text-sm md:text-base">
                        <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">For <span className="text-red-500">airlines</span>: trusted profiles matched to airline needs.</span>
                        <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">For <span className="text-red-500">ATOs</span>: training outcomes linked to verified career pathways.</span>
                        <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">For <span className="text-red-500">Civil Aviation Regulators</span>: transparent oversight for modern pilot standards.</span>
                        <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">For <span className="text-red-500">Charter & Private sector</span>: premium pilots aligned to private operator requirements.</span>
                        <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">For <span className="text-red-500">Humanitarian Flight Operations</span>: ready-to-deploy pilot profiles built for relief missions.</span>
                        <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">For <span className="text-red-500">airlines</span>: trusted profiles matched to airline needs.</span>
                        <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">For <span className="text-red-500">ATOs</span>: training outcomes linked to verified career pathways.</span>
                        <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">For <span className="text-red-500">Civil Aviation Regulators</span>: transparent oversight for modern pilot standards.</span>
                        <span className="inline-flex items-center gap-1 border-r border-sky-950/30 pr-3 last:border-r-0">For <span className="text-red-500">Charter & Private sector</span>: premium pilots aligned to private operator requirements.</span>
                        <span className="inline-flex items-center gap-1">For <span className="text-red-500">Humanitarian Flight Operations</span>: ready-to-deploy pilot profiles built for relief missions.</span>
                    </div>
                </div>
                <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                    .animate-marquee { animation: marquee 35s linear infinite; }
                `}</style>
            </div>

            {/* === FULL IMAGE BANNER - Background Image Layout === */}
            <div data-section="6" className="relative z-30 w-full min-h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden flex items-end md:items-center">
                {/* Background image */}
                <img
                    src="/images/set-03-recognition/recognition-unlock.png"
                    alt="Recognition+ Unlocks"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center center' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1600&q=80'; }}
                />

                {/* Dark gradient overlay — mobile-first bottom-heavy, desktop left-to-right */}
                <div
                    className="absolute inset-0 hidden md:block"
                    style={{ background: 'linear-gradient(to right, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.55) 45%, rgba(2,6,23,0.2) 70%, rgba(2,6,23,0) 100%)' }}
                />
                <div
                    className="absolute inset-0 md:hidden"
                    style={{ background: 'linear-gradient(to bottom, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.55) 45%, rgba(2,6,23,0.82) 100%)' }}
                />

                {/* Text Content */}
                <div className="relative z-10 w-full px-5 pb-8 pt-24 md:py-0 md:px-14 lg:px-20">
                    <div className="max-w-lg">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                            <span className="text-red-500">Recognition+</span> Unlocks
                        </h3>
                        <p className="text-slate-300 text-sm md:text-base mb-5 max-w-sm leading-relaxed">
                            Get the recognition you deserve. Background screened, prepared through programs, connected to pathways — giving your profile the edge that airlines notice.
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                            <button
                                onClick={() => onNavigate?.('recognition-plus')}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white font-semibold text-xs sm:text-sm rounded-full hover:bg-slate-100 transition-colors shadow-lg group"
                            >
                                <span className="text-slate-900">Learn more about <span className="text-red-600">Recognition+</span></span>
                                <svg className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12h4m0 0l-2-2m2 2l-2 2" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onNavigate?.('become-member')}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white text-xs sm:text-sm font-semibold rounded-full transition-all hover:bg-white/20"
                                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                Get Started — Create Recognition Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* === DISCOVER PILOT RECOGNITION === */}
            <div data-section="7" className="relative z-10 bg-white w-full py-12 md:py-16 overflow-hidden">
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
                            <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-red-500 mb-4">Recognition Dashboard</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                Keeping your profile <span className="text-red-500">compliant, current,</span> and operator-ready
                            </h2>
                            <p className="text-slate-600 text-sm md:text-base mb-8 leading-relaxed">
                                Keeps regulators and operators aligned with your latest verified status. This live pilot profile tracks last flown time, synced logbook hours, and credential expiry so your profile stays safe and operator-ready.
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
                                        <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1">Recognition Status</h3>
                                        <p className="text-sm md:text-sm text-slate-600 leading-snug">Real-time status for your credentials, last flown hours, and logbook sync so you always know when your profile is ready for operator review.</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 items-start rounded-3xl bg-slate-100/80 border border-slate-200 p-4 md:p-5">
                                    <div className="flex-shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-3xl bg-slate-900/5 border border-slate-200 shadow-sm flex items-center justify-center text-slate-900">
                                        <Clock className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1">Gap Analysis</h3>
                                        <p className="text-sm md:text-sm text-slate-600 leading-snug">See where your synced logbook hours, expiring licenses, and training credentials align with airline pathways so you can fix gaps before operators evaluate your profile.</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 items-start rounded-3xl bg-slate-100/80 border border-slate-200 p-4 md:p-5">
                                    <div className="flex-shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-3xl bg-slate-900/5 border border-slate-200 shadow-sm flex items-center justify-center text-slate-900">
                                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base md:text-lg mb-1">Operator Pull</h3>
                                        <p className="text-sm md:text-sm text-slate-600 leading-snug">Operators with enterprise access pull directly from the verified system, and we automatically restrict submissions when credentials are about to expire to protect safety and compliance.</p>
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
            <div className="relative z-30 w-full px-4 md:px-8 py-8 md:py-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-6 md:flex md:items-end md:justify-between gap-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-red-500 mb-2">Solving the global pilot shortage</p>
                            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
                                Pilot<span className="text-red-500">Shortage</span>.org
                            </h2>
                            <p className="text-slate-600 text-sm md:text-base max-w-xl">
                                An independent initiative helping the aviation industry understand, track, and solve the pilot shortage through data, mentorship, and accessible pathways.
                            </p>
                            <div className="mt-3 w-12 h-1.5 bg-red-500 rounded-full" />
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <a
                                href="https://pilotterminal.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all"
                            >
                                PilotTerminal.com
                            </a>
                            <a
                                href="https://pilotcareerpathways.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-all"
                            >
                                pilotcareerpathways.com
                            </a>
                        </div>
                    </div>

                    {/* PilotShortage.org Feature Card */}
                    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[420px] md:min-h-[480px] flex flex-col justify-end group cursor-pointer">
                        {/* Background image */}
                        <img
                            src={pilotShortageImages[pilotShortageImageIndex]}
                            alt="PilotShortage.org initiative"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/30" />

                        {/* Content */}
                        <div className="relative z-10 p-5 md:p-8">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="inline-block px-2.5 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-full">Advocacy</span>
                                <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">Workforce Data</span>
                                <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">Mentorship</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Building the next generation of pilots</h3>
                            <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-5 max-w-2xl">
                                PilotShortage.org connects aspiring aviators with verified training pathways, mentorship networks, and workforce intelligence. We work with flight schools, airlines, and regulators to lower barriers and grow the pilot pipeline.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                {[
                                    { value: '800k+', label: 'Pilot gap by 2037' },
                                    { value: '50h', label: 'Free mentorship' },
                                    { value: 'Global', label: 'Workforce data' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2">
                                        <p className="text-white font-bold text-sm">{stat.value}</p>
                                        <p className="text-slate-300 text-[10px] uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <a
                                href="https://pilotshortage.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors"
                            >
                                Visit pilotshortage.org
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* === PLATFORM NEWS UPDATES === */}
            <div data-section="9" className="relative z-30 w-full px-4 md:px-8 py-6 md:py-10 bg-slate-100">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-500 mb-2">Platform Updates</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Latest platform stories shaping pilot progression
                        </h3>
                        <div className="mt-3 w-12 h-1.5 bg-blue-900 rounded-full" />
                    </div>

                    {/* Carousel */}
                    <div className="relative overflow-hidden">
                        <div className="relative flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeBillboardSlide * 100}%)` }}>
                            {[
                                {
                                    tag: 'Pilot Pathways',
                                    category: 'Pathways',
                                    title: 'New expectations from 10+ airlines',
                                    desc: 'Updated requirements and expectation changes from more than 10 airlines and operators are now reflected across the pathways guidance.',
                                    cta: 'Review pathway updates',
                                    target: 'pathways-modern',
                                    image: '/images/set-06-pathways/pathway4.png',
                                    date: '08 July 2026',
                                    readTime: '3 min read'
                                },
                                {
                                    tag: 'pilotshortage.org',
                                    category: 'Mentorship',
                                    title: 'Foundation program mentorship grows',
                                    desc: 'The platform now features a 50-pilot mentorship foundation program that pairs experienced crew with aspiring aviators.',
                                    cta: 'Explore the mentorship program',
                                    target: 'foundation-program',
                                    image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png',
                                    date: '06 July 2026',
                                    readTime: '4 min read'
                                },
                                {
                                    tag: 'Pilot Terminal',
                                    category: 'Discussion',
                                    title: 'Discussion on Boeing 797 progression',
                                    desc: 'Pilot Terminal conversations now explore the new Boeing 797 and how future type ratings will be impacted.',
                                    cta: 'See the latest terminal news',
                                    target: 'pilot-recognition-profile',
                                    image: '/images/set-06-pathways/pathway4.png',
                                    date: '04 July 2026',
                                    readTime: '5 min read'
                                }
                            ].map((slide, idx) => (
                                <article key={idx} className="min-w-full px-1">
                                    <div
                                        className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[420px] md:min-h-[480px] flex flex-col justify-end cursor-pointer group"
                                        onClick={() => onNavigate?.(slide.target)}
                                    >
                                        {/* Background image */}
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />

                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-950/20" />

                                        {/* Content */}
                                        <div className="relative z-10 p-5 md:p-8">
                                            {/* Tags */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2.5 py-1 bg-white text-blue-900 text-xs font-bold rounded-full">{slide.category}</span>
                                                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">{slide.tag}</span>
                                            </div>

                                            {/* Title */}
                                            <h4 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2 flex items-start justify-between gap-3">
                                                {slide.title}
                                                <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </h4>

                                            {/* Description */}
                                            <p className="text-sm text-slate-200 leading-relaxed mb-3 line-clamp-3">
                                                {slide.desc}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                                <span>{slide.date}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-400" />
                                                <span>{slide.readTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Indicators */}
                        <div className="mt-5 flex justify-center gap-2">
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

                        {/* === VERIFICATION & AMBASSADOR PROGRAM SECTION === */}
            <div data-section="11" className="relative z-30 bg-white w-full px-4 md:px-8 py-12 md:py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="mb-10 md:mb-12 text-center max-w-3xl mx-auto">
                        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-red-500 mb-3">Verification that protects pilots & operators</p>
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">
                            Verified by the industry. Trusted by the people who matter.
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            PilotRecognition contacts your ATO, operator, and Civil Aviation Authority directly to confirm hours, ratings, and credentials — maintaining absolute transparency and reducing falsification risk for everyone.
                        </p>
                        <div className="mt-4 w-12 h-1.5 bg-red-500 rounded-full mx-auto" />
                    </div>

                    {/* Image grid + content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left - Image collage */}
                        <div className="grid grid-cols-2 gap-3">
                            <img
                                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
                                alt="Pilots in briefing"
                                className="w-full h-40 md:h-48 object-cover rounded-xl"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80"
                                alt="Aircraft on runway"
                                className="w-full h-40 md:h-48 object-cover rounded-xl"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80"
                                alt="Professional handshake"
                                className="w-full h-40 md:h-48 object-cover rounded-xl col-span-2"
                            />
                        </div>

                        {/* Right - Content */}
                        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
                            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-red-500 mb-3">How verification works</p>
                            <h3 className="text-2xl md:text-3xl text-slate-900 mb-5" style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>
                                A verification layer built for aviation
                            </h3>

                            <div className="space-y-4 mb-6">
                                {[
                                    {
                                        title: 'Direct authority confirmation',
                                        desc: 'We reach out to your ATO, training provider, operator, and CAA to confirm licenses, medicals, type ratings, and logged hours — so your profile reflects what you have actually done.'
                                    },
                                    {
                                        title: 'W3C Verified Credentials',
                                        desc: 'Once confirmed, your credentials are issued as sovereign digital tokens to your own wallet. You hold the proof; operators receive the confirmation, not your private documents.'
                                    },
                                    {
                                        title: 'Continuous compliance',
                                        desc: 'Expiry dates, recency, and renewal status are tracked automatically. You stay current, and operators see your real readiness without chasing paperwork.'
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm mb-1">{item.title}</p>
                                            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-200 pt-6 mb-6">
                                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-red-500 mb-3">Ambassador & internship program</p>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    PilotRecognition is open to graduates and experienced instructors who want to shape the future of aviation. We offer ambassador missions and internship roles where you help other pilots, participate in talks with major airlines and ATOs, and work alongside professional pilots who understand where the industry is heading.
                                </p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Whether you are a 200-hour graduate facing the 1,500-hour gap, or an instructor with extensive hours ready to convert your experience into recognized industry standing, our ecosystem connects you to pathways posted on <a href="https://pilotcareerpathways.com" target="_blank" rel="noopener noreferrer" className="text-red-600 font-semibold hover:underline">pilotcareerpathways.com</a>.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="https://pilotcareerpathways.com"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all hover:scale-105"
                                >
                                    Explore pathways
                                </a>
                                <a
                                    href="/foundation-program"
                                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all hover:scale-105"
                                >
                                    Enroll for Foundation Program
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* About Us section — Image 1 inspired layout */}
            <div data-section="12" className="relative w-full bg-slate-950">
                {/* Clean top image */}
                <div className="relative w-full h-[360px] md:h-[480px] lg:h-[560px] overflow-hidden bg-slate-900">
                    <img
                        src="/images/set-08-website/program1.png"
                        alt="About PilotRecognition"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center center' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1600&q=80'; }}
                    />
                </div>

                {/* Dark quote section */}
                <div className="relative px-5 md:px-12 lg:px-20 py-10 md:py-14">
                    <div className="max-w-4xl mx-auto md:mx-0 md:max-w-2xl">
                        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
                            At a glance
                        </p>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-white leading-tight mb-4">
                            About <span className="text-red-500">PilotRecognition</span>
                        </h2>
                        <div className="w-10 h-1 bg-red-500 mb-8" />

                        <div className="relative pl-8 md:pl-12">
                            <span className="absolute top-0 left-0 text-6xl md:text-7xl text-red-500/60 leading-none font-serif">“</span>
                            <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-6">
                                Aviation's first pilot-owned career platform. The industry has never given pilots the infrastructure to prove who they are — only the paperwork to survive audits. PilotRecognition fixes that by turning your logbook, license, medical, and credentials into a verified recognition profile that reflects what you've actually done. Your credentials are issued as sovereign W3C Verified Credential tokens to your own cryptographic wallet; we receive the confirmation, not the paper.
                            </p>
                            <p className="text-white font-semibold">Benjamin Bowler</p>
                            <p className="text-slate-400 text-sm">Founder & CEO, PilotRecognition</p>
                        </div>

                        {/* Progress bar indicator */}
                        <div className="mt-8 w-full max-w-xs h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-red-500 rounded-full" />
                        </div>
                    </div>
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
                                        {/* Airbus logo removed — Wikimedia source no longer available */}
                                        <img src={IMAGES.ACCREDITATION_5} alt="WM Group" className="h-16 w-auto object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Join The Network Section */}
                <div className="relative py-16 md:py-24 px-5 md:px-8 bg-black overflow-hidden" id="join-network-section">
                    {/* Subtle grid/noise background */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-slate-950" />

                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="text-center mb-10">
                            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-4">
                                Join the network
                            </p>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-normal text-white leading-[1.05] mb-6">
                                <span className="text-white">Pilot</span>{' '}
                                <span className="text-red-500">Recognition</span>
                            </h2>
                            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                                One verified profile connects you to airline pathways, foundation programs, and a global pilot community. Get recognized by the industry that matters.
                            </p>

                            {/* CTA pills */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
                                <button
                                    onClick={() => onNavigate?.('become-member')}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-red-600/25"
                                >
                                    Get Started Free
                                </button>
                                <button
                                    onClick={() => onNavigate?.('recognition-plus')}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm transition-all active:scale-95"
                                >
                                    Learn about Recognition+
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                                {[
                                    { value: '15+', label: 'Partner Airlines' },
                                    { value: '50h', label: 'Mentorship Program' },
                                    { value: 'W3C', label: 'Verified Credentials' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                                        <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                                        <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
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
                            <svg className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
                            <svg className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
                            <svg className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer data-section="13" className="relative z-10 mt-auto bg-black text-white overflow-hidden">
                {/* Subtle texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950/50 to-black" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 md:py-20">
                    {/* Top row: brand + newsletter */}
                    <div className="grid md:grid-cols-2 gap-10 mb-12 pb-12 border-b border-white/10">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-3">
                                Pilot<span className="text-red-500">Recognition</span>
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                                The Aviation Industry's First Pilot Recognition-Based Platform. Verified profiles, trusted pathways, and a global pilot community.
                            </p>
                            <div className="flex items-center gap-3">
                                {[
                                    { label: 'LinkedIn', href: 'https://linkedin.com/company/pilotrecognition' },
                                    { label: 'YouTube', href: 'https://youtube.com/@pilotrecognition' },
                                    { label: 'X', href: 'https://x.com/pilotrecognition' },
                                    { label: 'TikTok', href: 'https://tiktok.com/@pilotrecognition' },
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 border border-white/10 flex items-center justify-center text-xs font-semibold text-white transition-colors"
                                    >
                                        {social.label[0]}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="md:text-right">
                            <p className="text-sm font-semibold text-white mb-3">Stay in the loop</p>
                            <p className="text-slate-400 text-sm mb-4">Get pathway drops, airline updates, and platform news.</p>
                            <div className="flex flex-col sm:flex-row md:justify-end gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-red-500/50"
                                />
                                <button
                                    onClick={() => onNavigate('newsletter-signup')}
                                    className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
                            <ul className="space-y-2.5 text-slate-400 text-sm">
                                <li><button onClick={() => onNavigate('recognition-plus')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Pilot Recognition</button></li>
                                <li><button onClick={() => onNavigate('recognition-career-matches')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Pathways</button></li>
                                <li><button onClick={() => onNavigate('programs')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Programs</button></li>
                                <li><button onClick={() => onNavigate('airline-expectations')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Airline Expectations</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Programs</h4>
                            <ul className="space-y-2.5 text-slate-400 text-sm">
                                <li><button onClick={() => onNavigate('foundational-program')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Foundation Program</button></li>
                                <li><button onClick={() => onNavigate('transition-program')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Transition Program</button></li>
                                <li><button onClick={() => onNavigate('airbus-aligned-ebt-cbta-programs')} className="hover:text-red-400 cursor-pointer transition-colors text-left">EBT CBTA</button></li>
                                <li><button onClick={() => onNavigate('become-member')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Become a Member</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contact</h4>
                            <ul className="space-y-2.5 text-slate-400 text-sm">
                                <li><a href="mailto:contact@pilotrecognition.com" className="hover:text-red-400 cursor-pointer transition-colors">contact@pilotrecognition.com</a></li>
                                <li><a href="mailto:enterprise@pilotrecognition.com" className="hover:text-red-400 cursor-pointer transition-colors">enterprise@pilotrecognition.com</a></li>
                                <li><span className="text-slate-500">Dubai, UAE</span></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Legal</h4>
                            <ul className="space-y-2.5 text-slate-400 text-sm">
                                <li><button onClick={() => onNavigate('privacy-policy')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Privacy Policy</button></li>
                                <li><button onClick={() => onNavigate('terms-of-service')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Terms of Service</button></li>
                                <li><button onClick={() => onNavigate('cookie-policy')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Cookie Policy</button></li>
                                <li><button onClick={() => onNavigate('terms-of-service')} className="hover:text-red-400 cursor-pointer transition-colors text-left">Our Services</button></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-slate-500 text-xs">
                        <p>&copy; 2024 PilotRecognition — Benjamin Bowler (pending Aviation Pathways Ltd). All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition-colors">Privacy</button>
                            <button onClick={() => onNavigate('terms-of-service')} className="hover:text-white transition-colors">Terms</button>
                            <button onClick={() => onNavigate('cookie-policy')} className="hover:text-white transition-colors">Cookies</button>
                        </div>
                    </div>
                </div>
            </footer>


            </div>{/* end home-root wrapper */}

            {/* Recognition ATC Chat Widget */}
            <RecognitionATC />
        </>
    );
};
