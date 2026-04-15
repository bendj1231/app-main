
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronLeft, ChevronDown } from 'lucide-react';

interface TopNavbarProps {
    onNavigate: (page: string) => void;
    onLogin: () => void;
    isDark?: boolean;
    forceScrolled?: boolean;
    isLight?: boolean;
    onLoginModalOpen?: () => void;
}

interface NavSubItem {
    name: string;
    target: string;
    bullets?: string[];
    category?: string;
    isYellow?: boolean;
}

interface NavItem {
    name: string;
    target: string;
    subItems?: NavSubItem[];
}

import { useAuth } from '@/src/contexts/AuthContext';

export const TopNavbar: React.FC<TopNavbarProps> = ({
    onNavigate,
    onLogin,
    isDark = false,
    forceScrolled = false,
    isLight = false,
    onLoginModalOpen,
}) => {
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(forceScrolled);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = async () => {
        try {
            await logout();
            onNavigate('home'); // Redirect to home after logout
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    useEffect(() => {
        if (forceScrolled) return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [forceScrolled]);

    const navItems: NavItem[] = [
        {
            name: 'Home',
            target: 'home',
            subItems: [
                { category: 'Navigation', name: 'Home Navigation', target: 'home', bullets: ['Main Landing', 'Quick Access', 'Site Overview'] },
                { category: 'Platform', name: 'The Pilot Portal', target: 'home', bullets: ['Login Access', 'Dashboard', 'Member Area'] },
                { name: 'Airline Expectations', target: 'airline-expectations', bullets: ['Carrier Culture', 'Entry Requirements', 'Fleet Planning'] },
                { name: 'Carousel Cards', target: 'home', bullets: ['Program Highlights', 'Feature Showcase', 'Dynamic Content'] },
                { name: 'Pilot Recognition', target: 'pilot-recognition', bullets: ['Credibility Scoring', 'Verified Background', 'Industry Endorsement'] },
                { name: 'ATS Pilot Data Formatting Systems', target: 'atlas-cv', bullets: ['AI Data Extraction', 'Global Standards', 'Airline Visibility'] },
                { category: 'About', name: 'About Us', target: 'about', bullets: ['Brief Overview', 'Mission', 'Our Values'] },
                { name: 'Become a Member', target: 'become-member', bullets: ['Join Network', 'Create Account', 'Start Journey'] }
            ]
        },
        {
            name: 'About',
            target: 'about',
            subItems: [
                { category: 'The Organization', name: 'About WingMentor', target: 'about', bullets: ['Program Overview', 'Our Mission', 'Global Impact'] },
                { name: 'Mission & Vision', target: 'mission-vision', bullets: ['Our Core Values', 'Vision for 2030', 'Industry Stewardship'] },
                { name: 'Core Values', target: 'core-values', bullets: ['Connection', 'Attitude', 'Respect'] },
                { category: 'Compliance', name: 'Accreditation & Recognition', target: 'accreditation', bullets: ['Global Standards', 'EASA & GCAA Alignment', 'Verified Training'] },
                { name: 'Industry Stewardship', target: 'industry-stewardship', bullets: ['EBT Alignment', 'Pilot Advocacy', '2030 Vision'] },
                { name: 'Governance', target: 'governance', bullets: ['Regulatory Compliance', 'Data Ethics', 'Partner Transparency'] },
                { category: 'Governance', name: 'Our Board', target: 'board', bullets: ['Executive Leadership', 'Airlines Advisory', 'Tech Innovators'] },
                { name: 'Committees', target: 'committees', bullets: ['Safety Board', 'Curriculum Review', 'Pilot Advocacy'] },
                { name: 'Frequently Asked Questions', target: 'faq', bullets: ['Eligibility', 'Program Timeline', 'Pricing Details'] }
            ]
        },
        {
            name: 'Programs',
            target: 'about_programs',
            subItems: [
                { category: 'Core Programs', name: 'Foundational Program', target: 'foundational-program', bullets: ['20HR Guided Mentorship', 'Pilot Profile Build', 'Global Talent Registry'] },
                { name: 'What is the pilot gap?', target: 'pilot-gap', isYellow: true },
                { name: 'Transition Program', target: 'transition-program', bullets: ['Atlas CV Optimization', 'Airline Interview Secrets', 'Broker Advantage'] },
                { name: 'EBT CBTA Familiarization', target: 'ebt-cbta', isYellow: true },
                { name: 'Airline Expectations', target: 'airline-expectations', isYellow: true }
            ]
        },
        {
            name: 'Pathways',
            target: 'about_programs',
            subItems: [
                { category: 'Career Pathways', name: 'Air Taxi & eVTOL', target: 'air-taxi-pathways', bullets: ['Sub‑1000 Hour Pilots', 'New Sector Entry', 'Next‑Gen Rosters'] },
                { name: 'Emirates ATPL', target: 'emirates-atpl', bullets: ['GCAA ATPL Theory', 'Global Recognition', 'Fujairah Aviation Academy'] },
                { name: 'Cargo Transportation', target: 'about_programs', bullets: ['Feeder Operations', 'Heavy Logistics', 'Global Supply Chain'] },
                { name: 'Fleet & Private Charter', target: 'private-charter-pathways', bullets: ['Corporate Flight Depts', 'VIP Service Standards', 'Global Mission Profile'] },
                { name: 'Flight Instructor', target: 'about_programs', bullets: ['Teaching Excellence', 'Building Experience', 'School Operations'] },
                { category: 'Specialized Operations', name: 'Seaplane/Float Ops', target: 'about_programs', bullets: ['Island Transfers', 'Amphibious Skills', 'Specialized Handling'] },
                { name: 'Aerial Tours & Skydive', target: 'about_programs', bullets: ['Sightseeing Ops', 'Jump Pilot Standards', 'Safety Protocols'] },
                { name: 'Land Survey & Ag', target: 'about_programs', bullets: ['Precision Agriculture', 'Aerial Mapping', 'Utility Missions'] },
                { name: 'Unmanned Systems', target: 'about_programs', bullets: ['BVLOS Operations', 'Data Intelligence', 'Remote Fleet Mgmt'] },
                { category: 'Sector Insights', name: 'Airline Expectations', target: 'airline-expectations', bullets: ['Flagship Carrier Culture', 'Entry Requirements', 'Fleet Planning'] },
                { name: 'Corporate & VIP Jet', target: 'private-charter-pathways', bullets: ['Elite Service Standards', 'Executive Travel Trends', 'Non‑Scheduled Ops'] },
                { name: 'UAM & Air Taxis', target: 'air-taxi-pathways', bullets: ['Urban Air Mobility', 'Infrastructure Layout', 'Battery Technology'] },
                { name: 'Global Cargo Logistics', target: 'insights', bullets: ['Supply Chain Resilience', 'Hub Operations', 'Automation in Cargo'] },
                { category: 'Operational Intelligence', name: 'Float & Amphibious Ops', target: 'insights', bullets: ['Water Runways', 'Corrosion Management', 'Tidal Navigation'] },
                { name: 'Flight Instruction', target: 'insights', bullets: ['Student Psychology', 'Marketing Your School', 'Regulatory Compliance'] },
                { name: 'Specialized Aerial Work', target: 'insights', bullets: ['Aerial Firefighting', 'Search & Rescue', 'External Load Ops'] },
                { category: 'Innovation & Ownership', name: 'Aircraft Mgmt & Ownership', target: 'insights', bullets: ['Registration Options', 'Maintenance Costs', 'Hangarage Strategy'] },
                { name: 'Precision Agriculture', target: 'insights', bullets: ['Hyperspectral Imaging', 'Crop Yield Analysis', 'Autonomy in Ag'] }
            ]
        },
        {
            name: 'Pilot Recognition',
            target: 'pilot-recognition',
            subItems: [
                { category: 'Recognition Systems', name: 'ATLAS Aviation CV', target: 'atlas-cv', bullets: ['AI Data Extraction', 'Global Standards', 'Airline Visibility'] },
                { name: 'Pilot Recognition Profile', target: 'pilot-recognition', bullets: ['Credibility Scoring', 'Verified Background', 'Industry Endorsement'] },
                { name: 'Examination Results', target: 'examination-results', bullets: ['Verified Scores', 'Mentorship Assessments', 'Knowledge Recency'] },
                { name: 'Digital Logbook', target: 'digital-logbook', bullets: ['Flight Records', 'Verified Hours', 'Professional Milestones'] }
            ]
        },
        {
            name: 'Applications',
            target: 'applications_systems',
            subItems: [
                { category: 'The Digital Ecosystem', name: 'WingMentor W1000 Suite', target: 'w1000-suite', bullets: ['Examination Terminal', 'The Black Box', 'IFR Simulator', 'Program Handbook', 'Pilot Masterclass'] },
                { name: 'Hinfact AIRBUS integrated applications', target: 'hinfact', bullets: ['Human Factors Analytics', 'Performance Monitoring', 'Safety Culture'] },
                { category: 'Recognition Systems', name: 'ATLAS Aviation CV Recognition Systems', target: 'atlas-cv', bullets: ['AI Data Extraction', 'Global Standards', 'Airline Visibility'] },
                { name: 'Pilot Recognition Systems', target: 'pilot-recognition', bullets: ['Credibility Scoring', 'Verified Background', 'Industry Endorsement'] },
                { category: 'Program Access', name: 'Foundation Program application', target: 'foundational-application', bullets: ['Join Global Registry', 'Start Mentorship', 'Build Profile'] },
                { name: 'Transition Program Application', target: 'transition-application', bullets: ['Optimize Career', 'Advanced Training', 'Direct Broker Entry'] },
            ]
        },
        {
            name: 'Membership',
            target: 'membership',
            subItems: [
                { category: 'The Network', name: 'Benefits of Membership', target: 'membership-benefits', bullets: ['Unlock Ecosystem Tools', 'Verified Pilot Badge', 'Broker Network Access'] },
                { name: 'Become a Member', target: 'become-member', bullets: ['Free Forever Tier', 'Start Your Profile', 'Enter Global Registry'] }
            ]
        },
        { name: 'Contact', target: 'contact-support' },
    ];

    const handleMouseEnter = (name: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveDropdown(name);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
            setActiveSubItem(null);
        }, 150);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isLight
                    ? 'bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 shadow-sm'
                    : isDark
                        ? '!bg-transparent backdrop-filter-none py-3 shadow-none'
                        : scrolled
                            ? 'bg-gradient-to-b from-black/95 via-black/60 to-transparent backdrop-blur-sm py-3 shadow-2xl'
                            : 'bg-transparent py-6'
                    }`}>
                <div className="max-w-[1800px] mx-auto px-6 flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onNavigate('home')}>
                        <div className="w-24 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                            <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col items-center">
                            <span
                                className={`${isLight || (isDark && scrolled) ? 'text-slate-900' : 'text-white'
                                    } text-xs font-bold tracking-[0.4em] uppercase leading-none mb-1 group-hover:text-blue-400 transition-colors`}
                            >
                                Pilot Recognition
                            </span>
                            <span
                                className={`${isLight || (isDark && scrolled) ? 'text-slate-600' : 'text-white/60'
                                    } text-[8px] font-medium tracking-[0.2em] uppercase leading-none group-hover:text-white transition-colors`}
                            >
                                PROGRAMS & PATHWAYS
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-3">
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group/dropdown"
                                onMouseEnter={() => item.subItems && handleMouseEnter(item.name)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    onClick={() => onNavigate(item.target)}
                                    className={`text-[0.6rem] font-bold uppercase tracking-[0.1em] transition-all hover:text-blue-400 flex items-center gap-1 whitespace-nowrap ${item.target === 'home' && !forceScrolled
                                        ? isLight || (isDark && scrolled)
                                            ? 'text-blue-600 border-b-2 border-blue-600 pb-1 font-black'
                                            : 'text-blue-400 border-b-2 border-blue-400 pb-1 font-black'
                                        : isLight || (isDark && scrolled)
                                            ? 'text-slate-900'
                                            : 'text-white/80'
                                        }`}
                                >
                                    {item.name}
                                    {item.subItems && <ChevronDown className="w-3 h-3" />}
                                </button>

                                {/* Dropdown Menu */}
                                {item.subItems && (
                                    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-300 ${activeDropdown === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                        <div className="bg-[#050A30]/95 backdrop-blur-xl border border-white/10 rounded-lg p-2 min-w-[200px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-0.5 overflow-hidden">
                                            {item.subItems.map((subItem, idx) => (
                                                <React.Fragment key={`${item.name}-${subItem.name}-${idx}`}>
                                                    {subItem.category && (
                                                        <div className={`px-3 pt-2 pb-1 text-[0.65rem] font-black uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-blue-400/60'} border-b border-white/5 mb-0.5 mt-0.5 first:mt-0`}>
                                                            {subItem.category}
                                                        </div>
                                                    )}
                                                    <div
                                                        onMouseEnter={() => setActiveSubItem(subItem.name)}
                                                        onMouseLeave={() => setActiveSubItem(null)}
                                                        className="relative"
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onNavigate(subItem.target);
                                                                setActiveDropdown(null);
                                                            }}
                                                            className={`w-full text-left px-3 py-1.5 rounded transition-all flex flex-col gap-0.5 ${activeSubItem === subItem.name
                                                                ? subItem.isYellow ? 'bg-yellow-500/10 text-yellow-400 translate-x-1' : 'bg-blue-600/20 text-white translate-x-1'
                                                                : subItem.isYellow ? 'text-yellow-400/80 hover:text-yellow-400 hover:bg-yellow-500/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-1.5">
                                                                {subItem.isYellow && <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse"></div>}
                                                                <span className={`text-[0.7rem] font-bold uppercase tracking-wider whitespace-nowrap ${subItem.isYellow ? 'text-yellow-400' : ''}`}>
                                                                    {subItem.name}
                                                                </span>
                                                            </div>

                                                            {/* Expanded Core Components */}
                                                            {subItem.bullets && (
                                                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeSubItem === subItem.name ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                                                    <ul className="space-y-0.5">
                                                                        {subItem.bullets.map((bullet, idx) => (
                                                                            <li key={idx} className="flex items-center gap-1.5 text-[0.6rem] text-blue-300/80 font-medium tracking-wide">
                                                                                <div className="w-0.5 h-0.5 rounded-full bg-blue-400"></div>
                                                                                {bullet}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </button>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-3 ml-4">



                        <button
                            onClick={currentUser ? handleLogout : () => onNavigate('become-member')}
                            className={`${currentUser ? 'bg-slate-700 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1.5 rounded-sm text-[0.65rem] font-bold transition-all shadow-lg hover:shadow-red-500/20 flex items-center gap-1.5 whitespace-nowrap`}
                        >
                            {currentUser ? 'Sign Out' : 'Become a Member'}
                        </button>

                        <button
                            onClick={currentUser ? () => onNavigate('portal') : onLoginModalOpen || (() => {})}
                            className={`${currentUser ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-1.5 rounded-sm text-[0.65rem] font-bold transition-all shadow-lg hover:shadow-blue-500/20 flex items-center gap-1.5`}
                        >
                            {currentUser ? 'Access Portal' : 'Login'}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className={`lg:hidden ${isLight || (isDark && scrolled) ? 'text-slate-900' : 'text-white'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[60] bg-black transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col h-full p-8">
                    <div className="flex justify-end">
                        <button className="text-white" onClick={() => setIsMenuOpen(false)}>
                            <X className="w-10 h-10" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 gap-6">
                        <div className="w-full max-w-sm space-y-6">
                            {navItems.map((item) => (
                                <div key={item.name} className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={() => { onNavigate(item.target); setIsMenuOpen(false); }}
                                        className="text-2xl font-bold text-white uppercase tracking-widest hover:text-blue-400 transition-colors"
                                    >
                                        {item.name}
                                    </button>
                                    {item.subItems && (
                                        <div className="flex flex-col items-center gap-2 mb-2">
                                            {item.subItems.map((subItem) => (
                                                <button
                                                    key={subItem.name}
                                                    onClick={() => { onNavigate(subItem.target); setIsMenuOpen(false); }}
                                                    className={`text-sm font-medium uppercase tracking-widest transition-colors flex items-center gap-2 ${subItem.isYellow ? 'text-yellow-400' : 'text-white/40 hover:text-blue-300'}`}
                                                >
                                                    {subItem.isYellow && <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse"></div>}
                                                    {subItem.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}



                            <button
                                onClick={currentUser ? handleLogout : () => { onNavigate('become-member'); setIsMenuOpen(false); }}
                                className={`w-full py-4 rounded-sm font-bold uppercase tracking-widest mt-8 ${currentUser ? 'bg-slate-700 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors shadow-lg`}
                            >
                                {currentUser ? 'Sign Out' : 'Become a Member'}
                            </button>

                            <button
                                onClick={currentUser ? () => onNavigate('portal') : onLoginModalOpen || (() => {})}
                                className={`${currentUser ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white w-full py-4 rounded-sm font-bold uppercase tracking-widest mt-4 shadow-xl`}
                            >
                                {currentUser ? 'Access Portal' : 'Login'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Modal - moved to root level */}
        </>
    );
};
