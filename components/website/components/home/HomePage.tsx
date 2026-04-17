
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Globe, User, CheckCircle2 } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { AirlineExpectationsCarousel } from '../AirlineExpectationsCarousel';
import { PilotJourneyScroll } from '../pilot-recognition/PilotJourneyScroll';
import { IMAGES } from '../../../../src/lib/website-constants';
import { SmokeShader } from '../../../ui/smoke-shader';
import { PathwayGrid } from './PathwayGrid';

interface HomePageProps {
    onJoinUs: () => void;
    onLogin: () => void;
    onNavigate: (page: string) => void;
    onGoToProgramDetail: (slide?: Slide) => void;
    isLoggedIn?: boolean;
    onLoginModalOpen?: () => void;
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

// Auto-Cycling Tabs Component
interface AutoCyclingTabsProps {
    onJoinUs?: () => void;
}

// Animated Header Component for Join Section
const AnimatedHeader: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const items = [
        { text: 'Programs', color: 'text-white' },
        { text: 'Recognition', color: 'text-[#DAA520]' },
        { text: 'Pathways', color: 'text-white' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, 2500);
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

const AutoCyclingTabs: React.FC<AutoCyclingTabsProps> = ({ onJoinUs }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const tabs = [
        {
            id: 'programs',
            label: 'Programs',
            content: (
                <div className="space-y-6">
                    <div className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200">
                        <div className="mb-6 pb-4 border-b border-slate-200">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Foundation Program</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Building Your Aviation Foundation</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-2 text-sm">50 Hour Certification</h4>
                                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                    Comprehensive mentorship program combining <strong>20 hours of structured supervision</strong> with <strong>30 hours of official mentorship</strong> from industry veterans.
                                </p>
                                <ul className="text-[10px] text-slate-500 space-y-1.5">
                                    <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> Certificate of Accomplishment</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> Official mentorship documentation</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> EBT/CBTA competency baseline</li>
                                </ul>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-2 text-sm">W1000 Application</h4>
                                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                    Next-generation avionics suite inspired by the G1000 system. Full simulator room access for comprehensive flight training scenarios.
                                </p>
                                <ul className="text-[10px] text-slate-500 space-y-1.5">
                                    <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> IFR simulation environments</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> VFR practice scenarios</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> Checkride preparation modules</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-600 mt-0.5">-</span> EBT CBTA Airbus-aligned training</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 mb-4">
                            <h4 className="font-bold text-slate-900 mb-3 text-sm">Examination Terminal</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                Advanced examination platform featuring FAA and CAAP practice tests with real-time performance analytics. Track your progress across all aviation knowledge areas.
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-700">ATPL</p>
                                    <p className="text-[10px] text-slate-500">Airline Transport</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-700">CPL</p>
                                    <p className="text-[10px] text-slate-500">Commercial</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-700">IR/ME</p>
                                    <p className="text-[10px] text-slate-500">Instrument/Multi</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-100/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-2 text-sm">Portfolio Development & Airline Oversight</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                All program data is systematically collected into your professional portfolio: examination performance metrics, EBT/CBTA skill assessments, mentorship session evaluations, and a comprehensive interview with <strong>Airbus representative oversight</strong>. This creates your official Pilot Recognition Profile — a verified credential recognized across the aviation industry.
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
                <div className="space-y-6">
                    <div className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200">
                        <div className="mb-6 pb-4 border-b border-slate-200">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Pilot Recognition Profile</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Your Professional Aviation Identity</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200 mb-6">
                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                The PRP is a <strong>comprehensive, living document</strong> that evolves with your aviation career. It presents a complete picture of who you are as a pilot — verified, standardized, and ready for airline recruitment systems.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-lg font-bold text-slate-800">Scores</p>
                                    <p className="text-[10px] text-slate-500">Examination Performance</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-lg font-bold text-slate-800">Skills</p>
                                    <p className="text-[10px] text-slate-500">EBT/CBTA Ratings</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-lg font-bold text-slate-800">Hours</p>
                                    <p className="text-[10px] text-slate-500">Flight Time Logged</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-lg font-bold text-slate-800">Status</p>
                                    <p className="text-[10px] text-slate-500">Current Competency</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-3 text-sm">Performance Tracking</h4>
                                <ul className="text-xs text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">-</span>
                                        <span>Real-time examination performance analytics with trend analysis</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">-</span>
                                        <span>EBT/CBTA competency assessments aligned with Airbus standards</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">-</span>
                                        <span>Mentorship session documentation and evaluation scores</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">-</span>
                                        <span>Structured interview assessments with industry representatives</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-3 text-sm">Flight Data Integration</h4>
                                <ul className="text-xs text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">-</span>
                                        <span>Real-world flight log integration with automatic hour tracking</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">-</span>
                                        <span>Monthly recurrence tracking to maintain mentor fitness</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">-</span>
                                        <span>Aircraft type ratings and currency status monitoring</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">-</span>
                                        <span>Operational history across all aviation sectors</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-slate-100/50 backdrop-blur-sm rounded-xl p-5 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-3 text-sm">ATS-Compatible Atlas CV Format</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                Your PRP automatically generates an <strong>Applicant Tracking System (ATS) compatible</strong> CV using the industry-standard Atlas format. All major airlines use ATS systems to screen candidates — your WingMentor profile is optimized to pass these filters.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-medium text-slate-600 border border-slate-200">Airline-Ready Formatting</span>
                                <span className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-medium text-slate-600 border border-slate-200">Keyword Optimized</span>
                                <span className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-medium text-slate-600 border border-slate-200">Machine Readable</span>
                                <span className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-medium text-slate-600 border border-slate-200">PDF Export</span>
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
                <div className="space-y-6">
                    <div className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200">
                        <div className="mb-6 pb-4 border-b border-slate-200">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Pilot Job Database & Pathways</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">From Profile to Career</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200 mb-6">
                            <h4 className="font-bold text-slate-900 mb-4 text-sm">Available Career Pathways</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                                    <p className="text-sm font-bold text-slate-800 mb-1">Private Jets</p>
                                    <p className="text-[10px] text-slate-500">VIP Charter & Corporate</p>
                                    <p className="text-[10px] text-blue-600 mt-2 font-medium">Avg: 2,500 hrs</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                                    <p className="text-sm font-bold text-slate-800 mb-1">Cargo</p>
                                    <p className="text-[10px] text-slate-500">Logistics & Freighter</p>
                                    <p className="text-[10px] text-blue-600 mt-2 font-medium">Avg: 1,500 hrs</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                                    <p className="text-sm font-bold text-slate-800 mb-1">Instructor</p>
                                    <p className="text-[10px] text-slate-500">Training & Development</p>
                                    <p className="text-[10px] text-blue-600 mt-2 font-medium">Avg: 500 hrs + CFI</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                                    <p className="text-sm font-bold text-slate-800 mb-1">Air Taxi</p>
                                    <p className="text-[10px] text-slate-500">eVTOL & Urban Air</p>
                                    <p className="text-[10px] text-blue-600 mt-2 font-medium">Avg: 200 hrs</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                                    <p className="text-xs font-bold text-slate-700">Commercial Airline</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                                    <p className="text-xs font-bold text-slate-700">Air Ambulance</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                                    <p className="text-xs font-bold text-slate-700">Agricultural</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                                    <p className="text-xs font-bold text-slate-700">Survey & Patrol</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-4 text-sm">Smart Job Matching System</h4>
                                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                    Our matching engine continuously scans the job market and cross-references opportunities with your Pilot Recognition Profile. When a position matches your qualifications, you'll receive an immediate notification with application guidance.
                                </p>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                    <p className="text-[10px] text-slate-600">
                                        <strong>Example:</strong> Your PRP shows 800 hrs, CPL, and IFR rating. The system identifies you as a match for Air Taxi positions requiring 200+ hrs and provides a direct application pathway.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-4 text-sm">Gap Analysis Engine</h4>
                                <ul className="text-xs text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-medium">1.</span>
                                        <span><strong>Hours Analysis:</strong> Compares your logged time against pathway requirements</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-medium">2.</span>
                                        <span><strong>Skills Gap:</strong> Identifies missing ratings or type certifications</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-medium">3.</span>
                                        <span><strong>Interview Prep:</strong> Shows competency areas needing improvement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 font-medium">4.</span>
                                        <span><strong>Strategy:</strong> Provides step-by-step roadmap to qualify</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-slate-100/50 backdrop-blur-sm rounded-xl p-5 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-3 text-sm">Personalized Strategy Recommendations</h4>
                            <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                Based on your PRP data, WingMentor provides customized career roadmaps. If you want to pursue Private Jet pathways but lack the required hours, the system will recommend specific training modules, mentorship sessions, and transitional roles to build your profile.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-medium text-slate-600 border border-slate-200">Real-Time Matching</span>
                                <span className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-medium text-slate-600 border border-slate-200">Gap Reports</span>
                                <span className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-medium text-slate-600 border border-slate-200">Career Roadmaps</span>
                                <span className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-medium text-slate-600 border border-slate-200">Direct Applications</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % tabs.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isHovered, tabs.length]);

    return (
        <div
            className="w-full mt-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Tab Navigation */}
            <div className="flex justify-center gap-2 mb-6">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(index)}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${
                            activeTab === index
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white/50 backdrop-blur-sm text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-slate-200">
                <div className="p-6 md:p-8">
                    <div className="transition-all duration-500 ease-in-out">
                        {tabs[activeTab].content}
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="h-0.5 bg-slate-100">
                    <div
                        className="h-full bg-blue-500/50 transition-all duration-300"
                        style={{ width: `${((activeTab + 1) / tabs.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Shuffle indicator */}
            <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest">
                {isHovered ? 'Auto-shuffle paused' : 'Auto-shuffling tabs'}
            </p>

            {/* Become a Member Button */}
            {onJoinUs && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={onJoinUs}
                        className="px-8 py-3 bg-slate-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors border border-slate-900"
                    >
                        Become A Member
                    </button>
                </div>
            )}
        </div>
    );
};

export const HomePage: React.FC<HomePageProps> = ({ onJoinUs, onLogin, onNavigate, onGoToProgramDetail, isLoggedIn = false, onLoginModalOpen }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [activeCategory, setActiveCategory] = useState<
        'all' | 'program' | 'systems_automation' | 'network' | 'application' | 'pathways'
    >('all');
    const [currentFaq, setCurrentFaq] = useState(0);
    const scrollPositionRef = useRef(0);

    const faqItems = [
        {
            question: "What is the Pilot Gap?",
            answer: "It's the critical experience void between basic commercial licensing and the elite standards required by major airlines. We bridge this through verified operational experience and industry-standard EBT/CBTA training modules."
        },
        {
            question: "How does membership work?",
            answer: "Membership is free and provides restricted community access to our strategic intelligence hub, expert mentorship, and professional-grade applications usually reserved for airline flight decks."
        },
        {
            question: "Is WingMentor accredited?",
            answer: "Yes. Our pathways are supported by key industry players including Airbus partners, and our documentation mirrors the regulatory requirements of governing bodies like the FAA, CAAP, and GCAA."
        },
        {
            question: "What are the career pathways?",
            answer: "We offer direct routes into major airlines, private sector operators, and emerging aviation segments like the Air Taxi sector (AAM), ensuring your hours are recognized by top recruiters."
        }
    ];

    const nextFaq = () => setCurrentFaq((prev) => (prev + 1) % faqItems.length);
    const prevFaq = () => setCurrentFaq((prev) => (prev - 1 + faqItems.length) % faqItems.length);

    const allSlides: Slide[] = [
        {
            image: "https://lh3.googleusercontent.com/d/1wPEIiMRj4fW34_NIQKRnzCf8KNhdD1TC",
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
            description: "Master the core competencies of Evidence-Based Training (EBT) and Competency-Based Training & Assessment (CBTA). Our program integrates industry-leading software solutions, including Airbus-recommended HINFACT, to simulate real-world airline evaluation environments.",
            isDarkCard: true
        },
        {
            image: "/images/foundational-program.png",
            title: "Foundational Program",
            subtitle: "Leadership skills, verifiable experience, and industry-recognized accreditation supported by AIRBUS, Etihad & Archer.",
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
            image: "https://lh3.googleusercontent.com/d/1Ars9ou0JcoloGv-W18gvJ1G0eWrdFNAu",
            title: "Emirates ATPL Pilot Pathways",
            subtitle: "For pilots seeking an Emirates‑standard ATPL and GCAA license.",
            category: 'pathways',
            description:
                "Wing Mentor provides a structured Emirates ATPL Pathway through partner schools such as Fujairah Aviation, combining full ATPL training with license conversion inside the UAE. Pilots currently under the FAA system are guided through a smooth transition into EASA standards while completing their ATPL. The overall investment is comparable to many flight instructor ratings, while earning a respected GCAA license aligned with Emirates‑standard expectations—positioning you as a globally recognizable candidate whether you plan to fly in Dubai, the Philippines, or other international markets.",
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
            image: "https://lh3.googleusercontent.com/d/1XcRDW3p9C965siBjl5HsTXDHaQZJ-Ona",
            title: "Emerging Air Taxi Sector",
            subtitle: "For pilots under 1,000 hours stuck in the gap.",
            category: 'pathways',
            description:
                "WingMentor offers direct pilot pathways into the emerging air taxi sector, including leading industry players such as Archer and Joby—who have openly highlighted the need for pilots within this gap, typically under 1,000 hours. We also open routes into unmanned drone operations that are pilot-controlled from the ground. Through our network you gain strategic insight, connections, and a clear roadmap for how your current skills translate into this new segment.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1aTWWTtFwIMCrrU9HnCtWdUPTGhvWk6Yi",
            title: "Air Taxi Pilot Pathways",
            subtitle: "From CPL/IR to eVTOL flight deck.",
            category: 'pathways',
            description:
                "A structured pathway for pilots aiming at eVTOL and air taxi roles. Understand licensing considerations, multi‑crew expectations, and how to present your experience to early‑stage operators building their first pilot rosters.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/18tXsX2e_uYI5i8EBJEgZYhAUhVhDkOGn",
            title: "Private Charter Pathways",
            subtitle: "Corporate and VIP flight departments.",
            category: 'pathways',
            description:
                "Guidance for pilots targeting private charter and corporate aviation. We unpack what owners, brokers, and chief pilots look for beyond raw hours—discretion, consistency, and the service mindset that defines successful charter crews.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/11rzk2pXR99JuKEjhanfvAn58cgVETtId",
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
            image: "https://lh3.googleusercontent.com/d/1F9fPZsg-cn8bGyJkhUmGm0lRt9JL0oha",
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
            image: "https://lh3.googleusercontent.com/d/1Ars9ou0JcoloGv-W18gvJ1G0eWrdFNAu",
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
            image: "https://lh3.googleusercontent.com/d/11JxfuQ_5Tu3GZP4wab734qPnd1sDxCnv",
            title: "Examination Terminal",
            category: 'application',
            subtitle: "Pilot Applications — Access our suite of professional aviation applications, including standardized examination environments and operational tools.",
            isDarkCard: true,
            titleColor: "text-yellow-500"
        },
        {
            image: "https://lh3.googleusercontent.com/d/1klsusO1TwuXnDWrke-HzadozUrF9ri4u",
            title: "WingMentor W1000",
            category: 'application',
            subtitle: "The Professional Standard in glass cockpit familiarity.",
            description: "An application software inspired by the G1000 with our modern systems and simulators perfect suite for pilots to refresh on areas such as IFR, CPL examinations, and integrated Gleims examination software.",
            isDarkCard: true
        },
        {
            image: "https://lh3.googleusercontent.com/d/1rZLzWxCpouDAIoNRFxeli5GDa3lhGyr2",
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
            const excludedFromAll = ["Examination Terminal", "Pilot Gap Forum", "WingMentor W1000"];
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
                scrollPositionRef.current = window.scrollY;
            } else {
                // Restore scroll position when tab becomes visible
                window.scrollTo(0, scrollPositionRef.current);
                setTimeout(() => {
                    window.scrollTo(0, scrollPositionRef.current);
                }, 50);
                setTimeout(() => {
                    window.scrollTo(0, scrollPositionRef.current);
                }, 200);
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
        <div className="relative min-h-screen font-sans bg-black overflow-x-hidden">
            {/* Navigation Bar */}
            <TopNavbar
                onNavigate={onNavigate}
                onLogin={onLogin}
                isLight={isOverWhite}
                isDark={!isOverWhite}
                onLoginModalOpen={onLoginModalOpen}
                currentPage="home"
            />

            {/* Smoke Shader Section with Glassy Card */}
            <div className="relative w-full h-screen">
                <SmokeShader />
                
                {/* Flight Simulator Style Grid */}
                <PathwayGrid slides={allSlides} onNavigate={onNavigate} onGoToProgramDetail={onGoToProgramDetail} onLogin={onLogin} isLoggedIn={isLoggedIn} />
            </div>
            
            {/* Gradient Fade Below Shader - After Discover More */}
            <div className="relative w-full h-32 bg-gradient-to-b from-transparent via-slate-200/50 to-white z-40 pointer-events-none -mt-32"></div>

            {/* Pilot Journey Scroll Animation - iPad/Tablet Section */}
            <PilotJourneyScroll onNavigate={onNavigate} />

            {/* Airline Expectations 3D Carousel */}
            <AirlineExpectationsCarousel onNavigate={onNavigate} onLogin={onLogin} />

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
                            <img
                                src={IMAGES.LOGO}
                                alt="WingMentor Logo"
                                className="mx-auto w-64 h-auto object-contain mb-2"
                            />
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
                                Your Pilot Recognition Profile is a living document that evolves with your aviation career. It captures your examination scores, 
                                EBT/CBTA competency ratings, mentorship records, flight hours, and interview assessments — all formatted into an ATS-compatible 
                                ATLAS CV that major airlines use to screen candidates. From student pilots to seasoned instructors, the PRP provides 
                                verifiable proof of your professional capabilities.
                            </p>

                            {/* Pilot Journey Animation */}
                            <div className="max-w-4xl mx-auto mb-12">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
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
                                            <h4 className="text-2xl font-bold text-white">Pete Mitchell</h4>
                                            <p className="text-sm text-red-100">WingMentor Recognition Portfolio</p>
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
                                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                                    <p className="text-[10px] text-slate-500 mb-1">Dual XC hrs</p>
                                                    <p className="text-lg font-bold text-slate-900">85</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                                    <p className="text-[10px] text-slate-500 mb-1">Dual LOC</p>
                                                    <p className="text-lg font-bold text-slate-900">42</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                                    <p className="text-[10px] text-slate-500 mb-1">PIC LOC</p>
                                                    <p className="text-lg font-bold text-slate-900">156</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                                    <p className="text-[10px] text-slate-500 mb-1">LOC XC</p>
                                                    <p className="text-lg font-bold text-slate-900">78</p>
                                                </div>
                                            </div>

                                            {/* Type & Status */}
                                            <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs text-slate-500">Type</span>
                                                    <span className="text-xs font-bold text-slate-900">Commercial Pilot</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Status</span>
                                                    <span className="text-xs font-bold text-emerald-600">Verified</span>
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
                                                    <span className="text-xs font-bold text-slate-900">CPL (A)</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Medical</span>
                                                    <span className="text-xs font-bold text-emerald-600">Class 1 Valid</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Type Ratings</span>
                                                    <span className="text-xs font-bold text-slate-900">A320 (SEP)</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">English Proficiency</span>
                                                    <span className="text-xs font-bold text-slate-900">Level 6 (Expert)</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Languages</span>
                                                    <span className="text-xs font-bold text-slate-900">English, Spanish</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Readiness Snapshot */}
                                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">READINESS SNAPSHOT</h5>
                                            <h6 className="text-sm font-bold text-slate-900 mb-4">Resource & Availability</h6>
                                            
                                            <div className="space-y-3">
                                                <div className="bg-slate-50 rounded-lg p-3 flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Medical Certificate</span>
                                                    <span className="text-xs font-bold text-emerald-600">Valid Until Aug 2026</span>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-3 flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Radio License</span>
                                                    <span className="text-xs font-bold text-slate-900">G-RT12345</span>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-3 flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">License Expiry</span>
                                                    <span className="text-xs font-bold text-slate-900">Mar 2028</span>
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

                                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                                    <p className="text-[10px] text-slate-500 text-center">
                                        This ATLAS-formatted CV is machine-readable by airline ATS systems and includes verified competency data from the WingMentor Foundation Program.
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
                                            image: "https://lh3.googleusercontent.com/d/1USf_f9ZXG1Aflandx6_EMwR1JMhNBi8l",
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

                {/* About Us section - Restored */}
                <div className="relative bg-white pt-24 pb-12 px-6">
                    <div className="max-w-6xl mx-auto text-center relative z-20">
                        <RevealOnScroll delay={100}>
                            <img
                                src={IMAGES.LOGO}
                                alt="WingMentor Logo"
                                className="mx-auto w-48 md:w-64 h-auto object-contain mb-8 opacity-90"
                            />
                            <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-blue-700 mb-4">
                                ABOUT US
                            </p>
                            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                                Industry-First Accredited Pilot Experience & Recognition Programs
                            </h2>
                            <p className="text-xl font-medium tracking-wide text-slate-700 italic mb-10">
                                Bridging the Gap Between License and Career
                            </p>

                            <div className="max-w-4xl mx-auto space-y-8 mb-12">
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                                    WingMentor is the aviation industry's first Competency Assurance Network, designed to solve the critical "experience gap" in the modern pilot market. We are connecting all pilots, whether you are a low-timer pilot looking for pathways, a seasoned instructor looking for evolution in their current career, or a time-constrained airline captain looking for opportunities. We are speaking in direct relation with various Airlines, manufacturers, emerging air taxis, and many more. Making the connection between pilot & Industry Expectations, demands & Pilot Recognition easier like never before.
                                </p>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans text-center">
                                    Through our proprietary Verified Pilot Database and ATLAS-compliant profiling, we transform raw flight hours into data-driven professional competencies recognized by manufacturers and recruiters. By facilitating direct access to industry veterans and "hidden" job markets, WingMentor ensures that pilots don't just graduate—they transition seamlessly into the cockpit with the insights, network, and credibility the industry demands.
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

                {/* Join The Network Section (High-Fidelity Redesign) */}
                <div className="relative py-16 md:py-32 px-4 md:px-6 overflow-hidden">
                    {/* High-Fidelity Background: Modern Flight Deck */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=2669&auto=format&fit=crop"
                            alt="Modern Flight Deck"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark Overlay with Blur */}
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#050A30] via-transparent to-[#050A30]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-24">
                            <RevealOnScroll delay={100}>
                                {/* Animated Cycling Header */}
                                <AnimatedHeader />
                                
                                <p className="text-xl md:text-2xl text-blue-300 font-medium tracking-wide mb-8">
                                    Your Journey Starts Here
                                </p>
                                <p className="text-xl text-blue-100/70 max-w-3xl mx-auto leading-relaxed font-light italic">
                                    "From verified logbook audits to global airline visibility, start your journey into legalized pilot recognition."
                                </p>
                            </RevealOnScroll>
                        </div>

                        <div className="max-w-6xl mx-auto">
                            <RevealOnScroll delay={200}>
                                <div className="relative group p-[1px] bg-gradient-to-b from-slate-200 to-transparent rounded-[3rem]">
                                    <div className="absolute inset-0 bg-white/40 rounded-[3rem] blur-3xl transition-all duration-500 group-hover:bg-blue-100/20"></div>
                                    <div className="relative bg-white border border-slate-100 rounded-[3rem] p-12 md:py-20 md:px-24 flex flex-col items-center text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">

                                        <img
                                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                            alt="WingMentor Logo"
                                            className="w-72 h-auto object-contain mb-8 opacity-90"
                                        />

                                        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                            Pilot Database Recognition & Network Access
                                        </p>
                                        <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-12 leading-tight">
                                            Become A Member To Access
                                        </h2>

                                        {/* Auto-Cycling Tabs Component */}
                                        <AutoCyclingTabs onJoinUs={onJoinUs} />

                                        {/* Verifiable and Accredited Experience Section */}
                                        <div className="mt-12 pt-12 border-t border-slate-100 w-full text-center">
                                            <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.4em] mb-8">
                                                Verifiable and Accredited Experience
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                                <div className="group/pillar">
                                                    <h4 className="text-[11px] font-bold text-[#050A30] uppercase tracking-widest mb-3 flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#050A30]"></div>
                                                        Leadership Skills
                                                    </h4>
                                                    <p className="text-slate-600 text-xs leading-relaxed font-sans">
                                                        Master the <strong className="text-slate-900 font-semibold">Foundational Program</strong> & <strong className="text-slate-900 font-semibold">Mentorship Certification</strong>. Develop a flight instructor mindset, specializing in problem-solving through professional consultation and observation.
                                                    </p>
                                                </div>
                                                <div className="group/pillar">
                                                    <h4 className="text-[11px] font-bold text-[#050A30] uppercase tracking-widest mb-3 flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#050A30]"></div>
                                                        Pilot Recognition
                                                    </h4>
                                                    <p className="text-slate-600 text-xs leading-relaxed font-sans">
                                                        Gain industry recognition <strong className="text-slate-900 font-semibold">prior to major investments</strong>. Master airline expectations and type rating requirements instead of investing blindly in your future.
                                                    </p>
                                                </div>
                                                <div className="group/pillar">
                                                    <h4 className="text-[11px] font-bold text-[#050A30] uppercase tracking-widest mb-3 flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#050A30]"></div>
                                                        Unity & Support
                                                    </h4>
                                                    <p className="text-slate-600 text-xs leading-relaxed font-sans">
                                                        A network dedicated to supporting pilots. Find <strong className="text-slate-900 font-semibold">strategic pathways</strong> and get connected through industry relations and the diverse people within our program.
                                                    </p>
                                                </div>
                                                <div className="group/pillar">
                                                    <h4 className="text-[11px] font-bold text-[#050A30] uppercase tracking-widest mb-3 flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#050A30]"></div>
                                                        Accredited Experience
                                                    </h4>
                                                    <p className="text-slate-600 text-xs leading-relaxed font-sans">
                                                        Transform your operational history into a <strong className="text-slate-900 font-semibold">verifiable competency record</strong>, accredited by partners and recognized by top recruiters.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bridging the Gap Section - Inner Card Section */}
                                        <div className="mt-20 pt-20 border-t border-slate-100 w-full flex flex-col items-center">
                                            <img
                                                src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                                alt="WingMentor Logo"
                                                className="w-48 h-auto object-contain mb-8 opacity-70"
                                            />
                                            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                                Connecting Pilots to the Aviation Industry
                                            </p>
                                            <h3 className="text-4xl md:text-6xl font-serif text-slate-900 mb-12 leading-tight tracking-tight">
                                                Bridging the Pilot Gap
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 text-left w-full max-w-5xl mx-auto">
                                                <div className="space-y-8">
                                                    <div className="flex items-start gap-5 group/item p-4 -mx-4 rounded-2xl transition-all duration-500 hover:bg-slate-50/50">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#050A30] flex-shrink-0"></div>
                                                        <div>
                                                            <h4 className="font-bold text-[#050A30] uppercase tracking-[0.2em] text-xs mb-2 transition-colors">Pathways</h4>
                                                            <p className="text-slate-600 text-[14px] leading-relaxed font-sans">Strategic placement into <strong className="text-slate-900 font-semibold">Commercial Airlines, Private Jet (VIP), Air Taxi (eVTOL)</strong>, and Unmanned Systems. We solve the "Experience Gap" by facilitating direct-to-industry transitions through verified operational history.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-5 group/item p-4 -mx-4 rounded-2xl transition-all duration-500 hover:bg-slate-50/50">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#050A30] flex-shrink-0"></div>
                                                        <div>
                                                            <h4 className="font-bold text-[#050A30] uppercase tracking-[0.2em] text-xs mb-2 transition-colors">Programs</h4>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-blue-800 font-bold text-[10px] uppercase tracking-widest mb-1.5">Foundational Tier</p>
                                                                    <p className="text-slate-600 text-[14px] leading-relaxed font-sans">High-impact recognition for <strong className="text-slate-900 font-semibold">Leadership, CRM</strong>, and <strong className="text-slate-900 font-semibold">Flight Instructor Readiness</strong>, establishing a verified baseline required for elite carrier recruitment.</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-blue-800 font-bold text-[10px] uppercase tracking-widest mb-1.5">Transition Tier</p>
                                                                    <p className="text-slate-600 text-[14px] leading-relaxed font-sans">Advanced <strong className="text-slate-900 font-semibold">EBT & CBTA Familiarization</strong>, aligning your performance metrics to the global standards demanded by manufacturers like <strong className="text-slate-900 font-semibold">Airbus</strong>.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-8">
                                                    <div className="flex items-start gap-5 group/item p-4 -mx-4 rounded-2xl transition-all duration-500 hover:bg-slate-50/50">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#050A30] flex-shrink-0"></div>
                                                        <div>
                                                            <h4 className="font-bold text-[#050A30] uppercase tracking-[0.2em] text-xs mb-2 transition-colors">Applications</h4>
                                                            <p className="text-slate-600 text-[14px] leading-relaxed font-sans">Direct access to our proprietary ecosystem: <strong className="text-slate-900 font-semibold">W1000 Glass Cockpit Suite</strong>, Gleims Examination Terminal, and the <strong className="text-slate-900 font-semibold">Black Box</strong> intelligence repository for real-world simulation.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-5 group/item p-4 -mx-4 rounded-2xl transition-all duration-500 hover:bg-slate-50/50">
                                                        <div className="mt-1.5 w-2 h-2 rounded-full bg-[#050A30] flex-shrink-0"></div>
                                                        <div>
                                                            <h4 className="font-bold text-[#050A30] uppercase tracking-[0.2em] text-xs mb-2 transition-colors">Systems</h4>
                                                            <p className="text-slate-600 text-[14px] leading-relaxed font-sans"><strong className="text-slate-900 font-semibold">ATLAS-Compliant AI CV</strong> profiling and permanent placement within the industry-standard <strong className="text-slate-900 font-semibold">Verified Pilot Database</strong>, transforming raw hours into data-driven competency markers.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-16 w-full max-w-lg flex flex-col items-center">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-4 animate-pulse">Join the Pilot Network & Get Recognized</span>
                                            <button
                                                onClick={onJoinUs}
                                                className="w-full bg-[#050A30] hover:bg-[#070D3D] text-white py-6 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/10 hover:shadow-blue-900/30 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-98 border border-white/10"
                                            >
                                                Become a Member <i className="fas fa-arrow-right text-xs opacity-50"></i>
                                            </button>
                                            <div className="mt-6 flex items-center justify-center gap-6">
                                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Verified Access</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Restricted Community</span>
                                            </div>
                                            <div className="mt-8 max-w-2xl bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <p className="text-[10px] text-slate-500 font-medium tracking-tight leading-relaxed text-center">
                                                    Service fees apply for professional awards, certifications, and program completions. Please consult our official documentation regarding pathway enrollment, system database screening fees, and administrative processing requirements according to regulatory standards.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>

                        {/* Footer Note: Progressive Pathway */}
                        {/* Footer Note: Progressive Pathway */}
                        <div className="text-center mt-8 mb-12 max-w-3xl mx-auto">
                            <p className="text-blue-200/60 italic text-sm md:text-base leading-relaxed">
                                <span className="text-blue-400 font-bold block mb-2 not-italic uppercase tracking-widest text-xs">Progressive Pathway Recommendation</span>
                                Doing the Foundational Program first, rather than going straight to the Transition Program & Airline Familiarizations, will give you a <strong className="text-white">preferred edge</strong> towards the beneficial and <strong className="text-white">recognizability</strong> within the WingMentor Pilot Database.
                            </p>
                        </div>


                        {/* Section 3: The Why (For Airlines & ATOs) */}
                        <div className="mt-24 mb-16 text-center max-w-4xl mx-auto relative z-10 px-4">
                            <RevealOnScroll delay={400}>
                                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-xl">
                                    <h3 className="text-xl md:text-3xl font-sans font-bold text-white mb-4">
                                        Airlines, Operators, or Regulatory Authorities?
                                    </h3>
                                    <p className="text-zinc-300 text-lg leading-relaxed mb-8">
                                        WingMentor provides an industry-standard database of candidates vetted through EBT CBTA familiarization and Hinfact. We serve Major Carriers, Private Sector Operators, and Governing Bodies (FAA/CAAP) to streamline "Airline-Ready" talent acquisition.
                                    </p>
                                    <button className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white uppercase tracking-widest transition-all duration-200 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/40 group">
                                        <span>Contact for Enterprise Access</span>
                                        <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                                    </button>
                                </div>
                            </RevealOnScroll>
                        </div>

                        {/* User Agreement */}
                        <div className="text-center relative z-10 pb-12">
                            <p className="text-slate-400/60 text-xs uppercase tracking-widest">
                                By joining, you agree to the <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4">Privacy Policy</a> & <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4">User Agreement</a>
                            </p>
                        </div>
                    </div>
                </div>



                {/* Frequently Asked Questions Section (Carousel) */}
                <div className="relative bg-[#0A1138] py-24 px-6 overflow-hidden">
                    <div className="max-w-6xl mx-auto relative z-10">
                        <RevealOnScroll delay={100}>
                            <div className="relative group">
                                {/* Glassy Background Glow */}
                                <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl transition-all duration-500 group-hover:bg-white/10"></div>

                                <div className="relative bg-white border border-slate-200 rounded-3xl p-8 md:py-10 md:px-20 flex flex-col items-center text-center shadow-2xl min-h-[350px] justify-center">

                                    {/* Navigation Chevrons */}
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 pointer-events-none">
                                        <button
                                            onClick={prevFaq}
                                            className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:scale-110 transition-all pointer-events-auto shadow-sm active:scale-95"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextFaq}
                                            className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:scale-110 transition-all pointer-events-auto shadow-sm active:scale-95"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <img
                                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                        alt="WingMentor Logo"
                                        className="w-64 h-auto object-contain mb-4 opacity-80"
                                    />

                                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                        Support & Guidance
                                    </p>

                                    {/* Animated Content Wrapper */}
                                    <div className="relative w-full overflow-hidden mb-6">
                                        <div
                                            key={currentFaq}
                                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center"
                                        >
                                            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4 leading-tight max-w-3xl">
                                                {faqItems[currentFaq].question}
                                            </h2>

                                            <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
                                                {faqItems[currentFaq].answer}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pagination Dots */}
                                    <div className="flex gap-3 mb-6">
                                        {faqItems.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentFaq(idx)}
                                                className={`h-1.5 transition-all duration-500 rounded-full ${currentFaq === idx ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex flex-col items-center w-full max-w-md">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-2 animate-pulse">Join the Pilot Network & Get Recognized</span>
                                        <div className="flex flex-col sm:flex-row gap-4 w-full relative z-20">
                                            <button
                                                onClick={onJoinUs}
                                                className="flex-1 bg-[#050A30] hover:bg-[#070D3D] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-95 border border-white/10"
                                            >
                                                Become a Member
                                            </button>
                                            <button
                                                onClick={() => onNavigate('dashboard')}
                                                className="flex-1 bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-xl font-bold uppercase tracking-widest transition-all border border-slate-200 hover:border-slate-300 hover:scale-[1.02] active:scale-95 shadow-sm"
                                            >
                                                Visit FAQ Center
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="relative bg-black text-white py-24 px-6 overflow-hidden">

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
                        {/* Logo & About Us */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                                    <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="Logo" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-lg font-bold tracking-tighter leading-none uppercase">WingMentor</span>
                                    <span className="text-white/60 text-[10px] uppercase tracking-widest font-light italic">Pilot Recognition & WingMentor Pathways</span>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-sm max-w-sm">
                                WingMentor provides comprehensive Pilot Recognition & WingMentor Pathways: bridging the gap between training and career excellence through methodology and verifiable experience.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-white/60 hover:text-white transition-colors"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>

                        {/* Important Links */}
                        <div className="md:pl-12">
                            <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-blue-400">Important Links</h3>
                            <ul className="space-y-4">
                                {navItems.map((item) => (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => onNavigate(item.target)}
                                            className="text-gray-400 hover:text-white transition-colors uppercase text-sm tracking-widest font-semibold"
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div>
                            <h3 className="text-xl font-bold mb-8 uppercase tracking-widest text-blue-400">Contact Us</h3>
                            <div className="space-y-6 text-gray-300">
                                <div className="flex items-start gap-4">
                                    <span className="text-blue-400 mt-1"><i className="fas fa-envelope"></i></span>
                                    <div>
                                        <p className="text-xs uppercase text-white/40 font-bold tracking-widest mb-1">Email Now</p>
                                        <p className="text-sm font-semibold">wingmentorprogram@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-blue-400 mt-1"><i className="fas fa-phone"></i></span>
                                    <div>
                                        <p className="text-xs uppercase text-white/40 font-bold tracking-widest mb-1">Call Support</p>
                                        <p className="text-sm font-semibold">+971 55 519 5391</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-blue-400 mt-1"><i className="fas fa-map-marker-alt"></i></span>
                                    <div>
                                        <p className="text-xs uppercase text-white/40 font-bold tracking-widest mb-1">Office Location</p>
                                        <p className="text-sm font-semibold">Global Operations (UAE, EU, PH)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                        <p>&copy; {new Date().getFullYear()} WingMentor Pilot Recognition & WingMentor Pathways. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>


        </div>
    );
};
