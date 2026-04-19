import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Menu, X, ChevronLeft, ChevronDown, User, Settings, Camera, Award, Clock, Edit } from 'lucide-react';
import { Skeleton } from '@/src/components/ui/skeleton';

interface TopNavbarProps {
    onNavigate: (page: string) => void;
    onLogin: () => void;
    isDark?: boolean;
    forceScrolled?: boolean;
    isLight?: boolean;
    onLoginModalOpen?: () => void;
    currentPage?: string;
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
    currentPage = '',
}) => {
    const { currentUser, logout, loading: authLoading, signupInProgress } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(forceScrolled);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
    const [pilotId, setPilotId] = useState<string>('');
    const [profileImageUrl, setProfileImageUrl] = useState<string>('');
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [lastFlown, setLastFlown] = useState<string>('');
    const [mentorshipHours, setMentorshipHours] = useState<number>(0);
    const [foundationProgress, setFoundationProgress] = useState<number>(0);
    const [examinationScore, setExaminationScore] = useState<number>(0);
    const [overallRecognitionScore, setOverallRecognitionScore] = useState<number>(0);
    const [isEnrolledInFoundation, setIsEnrolledInFoundation] = useState<boolean>(false);
    const [uploading, setUploading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const settingsDropdownRef = useRef<HTMLDivElement>(null);
    const [isAuthRestoring, setIsAuthRestoring] = useState(true);

    // Fetch pilot_id and profile data from Supabase profile
    useEffect(() => {
        const fetchProfileData = async () => {
            if (currentUser?.uid) {
                setProfileLoading(true);
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('pilot_id, profile_image_url, total_flight_hours, last_flown, mentorship_hours, foundation_progress, examination_score, overall_recognition_score, enrolled_programs')
                        .eq('id', currentUser.uid)
                        .maybeSingle();
                    
                    if (error) {
                        console.error('Error fetching profile data:', error);
                        // Set default values on error to prevent UI breakage
                        setPilotId(currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot');
                        return;
                    }
                    
                    if (data) {
                        // Safely set values with fallbacks for missing or invalid data
                        setPilotId(data.pilot_id || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot');
                        setProfileImageUrl(data.profile_image_url || '');
                        setTotalHours(typeof data.total_flight_hours === 'number' ? data.total_flight_hours : 0);
                        setLastFlown(data.last_flown || '');
                        setMentorshipHours(typeof data.mentorship_hours === 'number' ? data.mentorship_hours : 0);
                        setFoundationProgress(typeof data.foundation_progress === 'number' ? data.foundation_progress : 0);
                        setExaminationScore(typeof data.examination_score === 'number' ? data.examination_score : 0);
                        setOverallRecognitionScore(typeof data.overall_recognition_score === 'number' ? data.overall_recognition_score : 0);
                        setIsEnrolledInFoundation(Array.isArray(data.enrolled_programs) && data.enrolled_programs.includes('Foundational'));
                    } else {
                        // Profile doesn't exist, set defaults
                        setPilotId(currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot');
                    }
                } catch (err) {
                    console.error('Unexpected error fetching profile data:', err);
                    // Set default values on unexpected error
                    setPilotId(currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot');
                } finally {
                    setProfileLoading(false);
                }
            }
        };
        
        fetchProfileData();
    }, [currentUser]);

    const handleLogout = async () => {
        console.log('🔴 handleLogout called');
        try {
            console.log('🔴 Calling logout function...');
            await logout();
            console.log('✅ Logout successful, navigating to home');
            onNavigate('home'); // Redirect to home after logout
            setIsMenuOpen(false);
        } catch (error) {
            console.error("❌ Failed to log out", error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser?.uid) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.uid}-${Date.now()}.${fileExt}`;
            const filePath = `${currentUser.uid}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('profile pics')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('profile pics')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_image_url: publicUrl })
                .eq('id', currentUser.uid);

            if (updateError) throw updateError;

            setProfileImageUrl(publicUrl);
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
            if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
                setIsSettingsDropdownOpen(false);
            }
        };

        if (isProfileDropdownOpen || isSettingsDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isProfileDropdownOpen, isSettingsDropdownOpen]);

    useEffect(() => {
        if (forceScrolled) return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [forceScrolled]);

    // Detect when auth restoration is complete
    useEffect(() => {
        if (!authLoading) {
            // Give a small delay to ensure UI is ready
            const timer = setTimeout(() => {
                setIsAuthRestoring(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [authLoading]);

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
                { category: 'Career Pathways', name: 'Emirates ATPL', target: 'emirates-atpl', bullets: ['GCAA ATPL Theory', 'Global Recognition', 'Fujairah Aviation Academy'] },
                { category: 'Specialized Operations', name: 'Cargo Transportation', target: 'cargo-transportation', bullets: ['Feeder Operations', 'Heavy Logistics', 'Global Supply Chain'] },
                { category: 'Career Pathways', name: 'Private Sector Pathway', target: 'private-charter-pathways', bullets: ['Corporate Flight Depts', 'VIP Service Standards', 'Global Mission Profile'] },
                { category: 'Licensure & Type Rating Pathways', name: 'CFI Pathway', target: 'about_programs', bullets: ['Teaching Excellence', 'Building Experience', 'School Operations'] },
                { category: 'Specialized Operations', name: 'Seaplane/Float Ops', target: 'about_programs', bullets: ['Island Transfers', 'Amphibious Skills', 'Specialized Handling'] },
                { category: 'Specialized Operations', name: 'Aerial Tours & Skydive', target: 'about_programs', bullets: ['Sightseeing Ops', 'Jump Pilot Standards', 'Safety Protocols'] },
                { category: 'Specialized Operations', name: 'Land Survey & Ag', target: 'about_programs', bullets: ['Precision Agriculture', 'Aerial Mapping', 'Utility Missions'] },
                { category: 'Career Pathways', name: 'Piloted & Automated<br />Drones', target: 'piloted-drones', bullets: ['BVLOS Operations', 'Data Intelligence', 'Remote Fleet Mgmt'] },
                { category: 'Licensure & Type Rating Pathways', name: 'Airline Expectations', target: 'airline-expectations', bullets: ['Flagship Carrier Culture', 'Entry Requirements', 'Fleet Planning'] },
                                { category: 'Career Pathways', name: 'UAM & Air Taxis', target: 'air-taxi-pathways', bullets: ['Urban Air Mobility', 'Infrastructure Layout', 'Battery Technology'] },
                                { category: 'Specialized Operations', name: 'Float & Amphibious Ops', target: 'insights', bullets: ['Water Runways', 'Corrosion Management', 'Tidal Navigation'] },
                { category: 'Licensure & Type Rating Pathways', name: 'CFI Pathway', target: 'insights', bullets: ['Student Psychology', 'Marketing Your School', 'Regulatory Compliance'] },
                { category: 'Licensure & Type Rating Pathways', name: 'CPL & Type Ratings', target: 'about_programs', bullets: ['License Upgrades', 'Type Rating Courses', 'Multi-Engine'] },
{ category: 'Licensure & Type Rating Pathways', name: 'Aerial Work<br />(UPRT)', target: 'insights', bullets: ['Aerial Firefighting', 'Search & Rescue', 'External Load Ops'] },
                { category: 'Licensure & Type Rating Pathways', name: 'Aircraft Mgmt &<br />Ownership', target: 'insights', bullets: ['Registration Options', 'Maintenance Costs', 'Hangarage Strategy'] },
                { category: 'Specialized Operations', name: 'Agricultural Crop<br />Dusting', target: 'insights', bullets: ['Hyperspectral Imaging', 'Crop Yield Analysis', 'Autonomy in Ag'] }
            ]
        },
        {
            name: 'Pilot Recognition',
            target: 'pilot-recognition',
            subItems: [
                { category: 'Recognition Systems', name: 'ATLAS Aviation CV', target: 'atlas-cv', bullets: ['AI Data Extraction', 'Global Standards', 'Airline Visibility'] },
                { name: 'Pilot Recognition Profile', target: 'pilot-recognition', bullets: ['Credibility Scoring', 'Verified Background', 'Industry Endorsement'] },
                { name: 'Recognition Career Matches', target: 'recognition-career-matches', bullets: ['AI-Powered Matching', 'Career Pathways', 'Match Percentage'] },
                { name: 'Examination Results', target: 'examination-results', bullets: ['Verified Scores', 'Mentorship Assessments', 'Knowledge Recency'] },
                { name: 'Digital Logbook', target: 'digital-logbook-directory', bullets: ['Flight Records', 'Verified Hours', 'Professional Milestones'] }
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

    // Filter out Home nav item when on home page
    const visibleNavItems = currentPage === 'home' 
        ? navItems.filter(item => item.name !== 'Home')
        : navItems;

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
                        <div className="w-32 h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
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
                        {visibleNavItems.map((item) => (
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
                                        <div className={`bg-[#050A30]/95 backdrop-blur-xl border border-white/10 rounded-lg p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ${item.name === 'Pathways' ? 'w-[600px] grid grid-cols-3 gap-4' : 'min-w-[200px] flex flex-col gap-0.5'}`}>
                                            {item.name === 'Pathways' ? (
                                                // Horizontal square layout for Pathways
                                                (() => {
                                                    const categories = item.subItems?.reduce((acc, subItem) => {
                                                        const category = subItem.category || 'Other';
                                                        if (!acc[category]) acc[category] = [];
                                                        acc[category].push(subItem);
                                                        return acc;
                                                    }, {} as Record<string, typeof item.subItems>) || {};

                                                    return Object.entries(categories).map(([category, items]) => (
                                                        <div key={category} className="space-y-2">
                                                            <h4 className={`text-[0.65rem] font-black uppercase tracking-[0.2em] ${isLight ? 'text-slate-400' : 'text-blue-400/60'} border-b border-white/10 pb-2`}>
                                                                {category}
                                                            </h4>
                                                            <div className="space-y-1">
                                                                {items.map((subItem, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onNavigate(subItem.target);
                                                                            setActiveDropdown(null);
                                                                        }}
                                                                        className={`w-full text-left px-3 py-2 rounded transition-all flex flex-col gap-0.5 ${activeSubItem === subItem.name
                                                                            ? subItem.isYellow ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-600/20 text-white'
                                                                            : subItem.isYellow ? 'text-yellow-400/80 hover:text-yellow-400 hover:bg-yellow-500/5' : 'text-white/70 hover:text-white hover:bg-white/5'
                                                                            }`}
                                                                        onMouseEnter={() => setActiveSubItem(subItem.name)}
                                                                        onMouseLeave={() => setActiveSubItem(null)}
                                                                    >
                                                                        <div className="flex items-center gap-1.5">
                                                                            {subItem.isYellow && <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse"></div>}
                                                                            <span className={`text-[0.7rem] font-bold uppercase tracking-wider ${subItem.name.includes('<br') ? '' : 'whitespace-nowrap'} ${subItem.isYellow ? 'text-yellow-400' : ''}`} dangerouslySetInnerHTML={{ __html: subItem.name }}>
                                                                            </span>
                                                                        </div>

                                                                        {subItem.bullets && (
                                                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeSubItem === subItem.name ? 'max-h-32 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                                                                <ul className="space-y-0.5">
                                                                                    {subItem.bullets.map((bullet, bIdx) => (
                                                                                        <li key={bIdx} className="flex items-center gap-1.5 text-[0.6rem] text-blue-300/80 font-medium tracking-wide">
                                                                                            <div className="w-0.5 h-0.5 rounded-full bg-blue-400"></div>
                                                                                            {bullet}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ));
                                                })()
                                            ) : (
                                                // Vertical layout for other dropdowns
                                                item.subItems.map((subItem, idx) => (
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
                                                                    <span className={`text-[0.7rem] font-bold uppercase tracking-wider ${subItem.name.includes('<br') ? '' : 'whitespace-nowrap'} ${subItem.isYellow ? 'text-yellow-400' : ''}`} dangerouslySetInnerHTML={{ __html: subItem.name }}>
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
                                                ))
                                            )}
                                            {/* Bottom message for Pathways dropdown */}
                                            {item.name === 'Pathways' && (
                                                <div className="col-span-3 mt-4 pt-4 border-t border-white/10 text-center">
                                                    <p className="text-[0.6rem] text-blue-300/60 font-medium tracking-wide">
                                                        Access the pilot portal to view more pathways
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-3 ml-4">

                        {isAuthRestoring || signupInProgress ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[0.65rem] text-slate-600 font-medium">{signupInProgress ? 'Creating account...' : 'Restoring session...'}</span>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}

                        {currentUser && (
                            <>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="w-10 h-12 rounded-[50%/40%] bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all hover:scale-105 shadow-lg overflow-hidden"
                                        title="Profile"
                                        style={{ borderRadius: '45% / 50%' }}
                                    >
                                        {profileImageUrl ? (
                                            <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-6" />
                                        )}
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                                            {/* Profile Header */}
                                            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                                {profileLoading ? (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <Skeleton variant="circle" width="48px" height="48px" />
                                                        <Skeleton variant="text" width="60%" className="text-white" />
                                                        <Skeleton variant="text" width="40%" className="text-white/80" />
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="relative group">
                                                            <div className="w-12 h-16 rounded-[50%/40%] bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30" style={{ borderRadius: '45% / 50%' }}>
                                                                {profileImageUrl ? (
                                                                    <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User className="w-6 h-8 text-white/80" />
                                                                )}
                                                            </div>
                                                            <label className="absolute bottom-0 right-0 p-1.5 bg-white text-blue-600 rounded-full cursor-pointer hover:bg-blue-50 transition-colors">
                                                                <Camera className="w-3 h-3" />
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleImageUpload}
                                                                    disabled={uploading}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="text-center">
                                                            <h3 className="font-semibold text-lg">{pilotId || currentUser?.displayName || 'Pilot'}</h3>
                                                            <p className="text-sm text-white/80">{currentUser?.email}</p>
                                                            <div className="mt-2">
                                                                <span className="text-sm font-bold text-white">Recognition Score: {overallRecognitionScore.toFixed(0)}/100</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Stats Section */}
                                            <div className="p-4 space-y-4">
                                                {profileLoading ? (
                                                    <div className="space-y-4">
                                                        <Skeleton variant="text" width="30%" />
                                                        <div className="space-y-2">
                                                            <Skeleton variant="rect" height="3.5rem" />
                                                            <Skeleton variant="rect" height="3.5rem" />
                                                        </div>
                                                        <Skeleton variant="text" width="30%" />
                                                        <div className="space-y-2">
                                                            <Skeleton variant="rect" height="3.5rem" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* Recognition Category */}
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recognition</p>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                                        <Clock className="w-4 h-4 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-slate-600 uppercase tracking-wider">Flight Hours</p>
                                                                        <p className="text-base font-semibold text-slate-900">{totalHours.toFixed(1)} hrs</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                                        <Clock className="w-4 h-4 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-slate-600 uppercase tracking-wider">Last Flown</p>
                                                                        <p className="text-base font-semibold text-slate-900">{lastFlown || 'Not recorded'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Programs Category */}
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Programs</p>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                                        <Clock className="w-4 h-4 text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-slate-600 uppercase tracking-wider">Mentorship Hours</p>
                                                                        <p className="text-base font-semibold text-slate-900">{mentorshipHours.toFixed(1)} hrs</p>
                                                                    </div>
                                                                </div>

                                                                {isEnrolledInFoundation && (
                                                                    <>
                                                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                                <Award className="w-4 h-4 text-green-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-xs text-slate-600 uppercase tracking-wider">Foundation Progress</p>
                                                                                <p className="text-base font-semibold text-slate-900">{foundationProgress.toFixed(0)}%</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                                <Award className="w-4 h-4 text-green-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-xs text-slate-600 uppercase tracking-wider">Examination Score</p>
                                                                                <p className="text-base font-semibold text-slate-900">{examinationScore.toFixed(0)}/100</p>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                                        <Award className="w-4 h-4 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-slate-600 uppercase tracking-wider">Recognition Score</p>
                                                                        <p className="text-base font-semibold text-slate-900">{overallRecognitionScore.toFixed(0)}/100</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="p-4 border-t border-slate-200 space-y-2">
                                                <button
                                                    onClick={() => {
                                                        onNavigate('pilot-recognition');
                                                        setIsProfileDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    View Recognition Profile
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onNavigate('portal');
                                                        setIsProfileDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Edit Profile
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative" ref={settingsDropdownRef}>
                                    <button
                                        onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all"
                                        title="Settings"
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>

                                    {/* Settings Dropdown Menu */}
                                    {isSettingsDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                                            <div className="p-4 border-b border-slate-200">
                                                <h3 className="font-semibold text-slate-900">Quick Settings</h3>
                                            </div>
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        onNavigate('portal');
                                                        setIsSettingsDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                                >
                                                    <User className="w-4 h-4 text-slate-600" />
                                                    <span className="text-sm text-slate-700">Profile Settings</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onNavigate('pilot-recognition');
                                                        setIsSettingsDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                                >
                                                    <Award className="w-4 h-4 text-slate-600" />
                                                    <span className="text-sm text-slate-700">Recognition Profile</span>
                                                </button>
                                            </div>
                                            <div className="p-2 border-t border-slate-200">
                                                <button
                                                    onClick={() => {
                                                        onNavigate('settings');
                                                        setIsSettingsDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-700 font-medium"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    <span>View Full Settings</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className={`lg:hidden ${isLight || (isDark && scrolled) ? 'text-slate-900' : 'text-white'} p-2 rounded-lg hover:bg-white/10 transition-colors`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 z-[60] bg-black transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
            >
                <div className="flex flex-col h-full p-6 md:p-8">
                    <div className="flex justify-end">
                        <button 
                            className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <X className="w-10 h-10" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 gap-6 overflow-y-auto">
                        <div className="w-full max-w-sm space-y-4 py-4">
                            {visibleNavItems.map((item) => (
                                <div key={item.name} className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={() => { onNavigate(item.target); setIsMenuOpen(false); }}
                                        className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest hover:text-blue-400 transition-colors py-3 px-6 min-h-[48px] min-w-[200px]"
                                    >
                                        {item.name}
                                    </button>
                                    {item.subItems && (
                                        <div className="flex flex-col items-center gap-2 w-full">
                                            {item.subItems.map((subItem) => (
                                                <button
                                                    key={`${subItem.name}-${subItem.target}`}
                                                    onClick={() => { onNavigate(subItem.target); setIsMenuOpen(false); }}
                                                    className={`text-sm md:text-base font-medium uppercase tracking-widest transition-colors flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] w-full ${subItem.isYellow ? 'text-yellow-400' : 'text-white/40 hover:text-blue-300'}`}
                                                >
                                                    {subItem.isYellow && <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse"></div>}
                                                    {subItem.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}



                            {isAuthRestoring ? (
                                <div className="flex flex-col items-center gap-4 mt-8">
                                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-slate-600 font-medium">Restoring session...</span>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={currentUser ? handleLogout : () => { onNavigate('become-member'); setIsMenuOpen(false); }}
                                        className={`w-full py-4 min-h-[52px] rounded-lg font-bold uppercase tracking-widest mt-8 ${currentUser ? 'bg-slate-700 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors shadow-lg`}
                                    >
                                        {currentUser ? 'Sign Out' : 'Become a Member'}
                                    </button>

                                    <button
                                        onClick={currentUser ? () => onNavigate('portal') : onLoginModalOpen || (() => {})}
                                        className={`${currentUser ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white w-full py-4 min-h-[52px] rounded-lg font-bold uppercase tracking-widest mt-4 shadow-xl`}
                                    >
                                        {currentUser ? 'Access Portal' : 'Login'}
                                    </button>
                                </>
                            )}

                            {currentUser && (
                                <div className="flex gap-4 mt-4">
                                    <div className="flex-1 flex items-center justify-center gap-2">
                                        <div className="relative">
                                            <div className="w-12 h-16 rounded-[50%/40%] bg-slate-700 flex items-center justify-center overflow-hidden" style={{ borderRadius: '45% / 50%' }}>
                                                {profileImageUrl ? (
                                                    <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-6 h-8 text-slate-400" />
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                                <Camera className="w-3 h-3" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <span className="text-white text-sm font-medium">{pilotId || 'Pilot'}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Modal - moved to root level */}
        </>
    );
};
