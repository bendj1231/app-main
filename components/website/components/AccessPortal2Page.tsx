import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Home, Users, Settings, Bell, Plane, BookOpen, FolderOpen, CheckCircle2, GraduationCap, Award, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/src/contexts/AuthContext';
import { NewsroomModal } from './NewsroomModal';
import { MeshGradient } from '@paper-design/shaders-react';

interface AccessPortal2PageProps {
    onNavigate: (page: string) => void;
}

interface NavItem {
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface DashboardCard {
    id: string;
    title: string;
    image: string;
    onClick: () => void;
}

// Pilot Badge/Logo Component
const PilotBadge = () => (
    <div className="w-24 h-24 mx-auto mb-4 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Diamond background */}
            <polygon points="50,5 95,50 50,95 5,50" fill="#1e293b" stroke="#f97316" strokeWidth="2"/>
            {/* Eagle/wings symbol */}
            <path d="M50 25 L65 45 L50 40 L35 45 Z" fill="#f97316"/>
            <path d="M50 40 L70 55 L50 70 L30 55 Z" fill="#f97316"/>
        </svg>
    </div>
);

export const AccessPortal2Page: React.FC<AccessPortal2PageProps> = ({ onNavigate }) => {
    const { userProfile, currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isVisible, setIsVisible] = useState(false);
    const [activeNewsIndex, setActiveNewsIndex] = useState(0);
    
    // Profile and notification state
    const [profileImageUrl, setProfileImageUrl] = useState<string>('');
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const settingsDropdownRef = useRef<HTMLDivElement>(null);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);
    
    // Video mute state
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    
    // Pathway carousel state
    const [pathwayCarouselIndex, setPathwayCarouselIndex] = useState(0);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);
    
    // Auto-scroll carousel
    useEffect(() => {
        if (isCarouselPaused) return;
        
        const interval = setInterval(() => {
            setPathwayCarouselIndex((prev) => (prev + 1) % 6);
        }, 4000); // Change every 4 seconds
        
        return () => clearInterval(interval);
    }, [isCarouselPaused]);

    // Profile data from recognition profile
    const displayName = userProfile?.displayName || userProfile?.firstName || 
                        (currentUser?.email ? currentUser.email.split('@')[0].toUpperCase() : 'PILOT');
    const lastName = userProfile?.lastName || '';
    const fullName = userProfile?.full_name || (lastName ? `${displayName} ${lastName}` : displayName);
    
    // Flight hours and stats
    const flightHours = userProfile?.total_flight_hours || userProfile?.flight_hours || userProfile?.total_hours || 0;
    const recognitionScore = userProfile?.recognition_score || userProfile?.score || userProfile?.overall_recognition_score || 0;
    const currentLevel = userProfile?.current_level || userProfile?.level || userProfile?.current_occupation || 'Student Pilot';
    
    // Profile image
    const profileImage = userProfile?.profile_image_url || userProfile?.avatar_url || null;
    
    // Initials for default avatar (same as pilot recognition profile)
    const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    
    // Certifications count
    const certifications = userProfile?.certifications || userProfile?.licenses || userProfile?.ratings || [];
    const certCount = Array.isArray(certifications) ? certifications.length : 0;
    
    // Next level progress
    const hoursForNextLevel = 50;
    const progressPercent = Math.min((flightHours / hoursForNextLevel) * 100, 100);
    
    // Check if enrolled in Foundational program
    const enrolledPrograms = userProfile?.enrolled_programs || [];
    const isEnrolledInFoundational = Array.isArray(enrolledPrograms) && 
        enrolledPrograms.some((p: string) => p.toLowerCase().includes('foundational') || p.toLowerCase().includes('foundation'));

    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const navItems: NavItem[] = [
        { id: 'welcome', label: 'WELCOME', icon: Home },
        { id: 'profile', label: 'PROFILE' },
        { id: 'pathways', label: 'PATHWAYS' },
        { id: 'programs', label: 'PROGRAMS', icon: BookOpen },
        { id: 'dashboard', label: 'DASHBOARD', icon: BarChart3 },
        { id: 'marketplace', label: 'NEWS ROOM' },
        { id: 'options', label: 'OPTIONS' },
    ];

    const dashboardCards: DashboardCard[] = [
        {
            id: 'my-hangar',
            title: 'MY PATHWAYS',
            image: '/images/airline-operations.png',
            onClick: () => setActiveTab('pathways'),
        },
        {
            id: 'access-programs',
            title: isEnrolledInFoundational ? 'ACCESS PROGRAMS' : 'ENROLL NOW',
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png',
            onClick: () => onNavigate(isEnrolledInFoundational ? 'foundational-platform' : 'foundational-program'),
        },
        {
            id: 'my-logbook',
            title: 'MY LOGBOOK',
            image: '/images/pilotrecognitioncompoennt.png',
            onClick: () => onNavigate('digital-logbook'),
        },
    ];

    // Pathways view cards with vertical design - images from PathwayGrid
    const pathwaysCards: DashboardCard[] = [
        {
            id: 'type-rating-search',
            title: 'TYPE RATING SEARCH',
            image: '/typeratingsrch.png',
            onClick: () => onNavigate('type-rating-search'),
        },
        {
            id: 'airline-expectations',
            title: 'AIRLINE EXPECTATIONS SEARCH',
            image: '/AE.png',
            onClick: () => onNavigate('airline-expectations'),
        },
        {
            id: 'pilot-career-pathways',
            title: 'PILOT CAREER PATHWAYS',
            image: '/DP.png',
            onClick: () => onNavigate('pathways-modern'),
        },
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.4,
                ease: "easeOut",
            },
        }),
    };

    // Sample newsroom highlights data - same as homepage
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
                'EBT CBTA-aligned assessment framework',
                'Industry-recognized competency validation',
                'Live profile matching with operators'
            ],
            ctaTarget: 'recognition-profile'
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
                'Real-time pathway matching algorithm',
                'Verified pilot database access',
                'Direct operator recruitment pipeline'
            ],
            ctaTarget: 'pathways'
        },
        {
            id: 'foundation-program',
            tag: 'Foundation Program',
            title: 'Foundation Program Enrollment Open Now',
            description: 'Start with 50 hours of verified mentorship, EBT CBTA-aligned competency assessment, and industry-recognized CV formatting. Build your Recognition Score from day one — the currency that gets you pulled by operators instead of begging for interviews.',
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1777590658/newsroom/b81ubzdpz0dmyqutiyqj.png',
            metrics: [
                { label: 'Mentorship Hours', value: '50 included' },
                { label: 'Certification', value: 'enroll now for free!' }
            ],
            bullets: [
                '50 hours verified mentorship included',
                'EBT CBTA competency assessment',
                'Industry-recognized CV formatting'
            ],
            ctaTarget: 'foundational-program'
        }
    ];

    // Auto-rotate news carousel every 6 seconds when marketplace tab is active
    useEffect(() => {
        if (activeTab !== 'marketplace') return;
        
        const interval = setInterval(() => {
            setActiveNewsIndex((prev) => (prev + 1) % newsroomHighlights.length);
        }, 6000);
        
        return () => clearInterval(interval);
    }, [activeTab, newsroomHighlights.length]);

    // Fetch profile image from user profile
    useEffect(() => {
        if (userProfile?.profile_image_url) {
            setProfileImageUrl(userProfile.profile_image_url);
        }
    }, [userProfile]);

    // Handle click outside for dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
                setIsSettingsDropdownOpen(false);
            }
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
                setIsNotificationDropdownOpen(false);
            }
        };

        if (isSettingsDropdownOpen || isNotificationDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isSettingsDropdownOpen, isNotificationDropdownOpen]);

    return (
        <div
            className="relative min-h-screen flex flex-col overflow-hidden"
        >
            {/* MeshGradient Background - Same as PathwayGrid */}
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
                {/* Vignette */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
            </div>

            {/* Top Navigation Bar */}
            <div
                className="relative z-50 flex items-center justify-between px-4 py-2"
                style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                {/* Left - Navigation Items */}
                <div className="flex items-center">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.id === 'welcome') {
                                        onNavigate('home');
                                    } else {
                                        setActiveTab(item.id);
                                    }
                                }}
                                className="relative px-4 py-2 flex items-center gap-2 transition-all duration-200"
                                style={{
                                    background: isActive ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                                    color: isActive ? '#0f172a' : 'rgba(255, 255, 255, 0.7)',
                                    borderBottom: isActive ? '2px solid #0ea5e9' : '2px solid transparent',
                                }}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                <span className="text-xs font-bold tracking-wider">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Right - User Info */}
                <div className="flex items-center gap-4">
                    {/* Profile Picture */}
                    <div className="relative">
                        <button
                            onClick={() => onNavigate('pilot-recognition-profile')}
                            className="w-12 h-14 rounded-[50%/40%] bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all hover:scale-105 shadow-lg overflow-hidden"
                            title="Profile"
                            style={{ borderRadius: '45% / 50%' }}
                        >
                            {profileImageUrl ? (
                                <img
                                    src={profileImageUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-lg font-bold text-slate-700">
                                    {displayName.charAt(0)}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Settings Dropdown */}
                    <div className="relative" ref={settingsDropdownRef}>
                        <button
                            onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
                            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        {/* Settings Dropdown Menu */}
                        {isSettingsDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsSettingsDropdownOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                                    <div className="p-4 border-b border-slate-200">
                                        <h3 className="font-semibold text-slate-900">Quick Settings</h3>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                onNavigate('settings');
                                                setIsSettingsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                        >
                                            <Settings className="w-4 h-4 text-slate-600" />
                                            <span className="text-sm text-slate-700">Account Settings</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                onNavigate('pilot-recognition-profile');
                                                setIsSettingsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                        >
                                            <Users className="w-4 h-4 text-slate-600" />
                                            <span className="text-sm text-slate-700">Profile</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Notification Bell */}
                    <div className="relative" ref={notificationDropdownRef}>
                        <button 
                            onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all relative"
                            title="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 bg-white text-red-500 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-red-500">
                                    {notificationCount > 9 ? '9+' : notificationCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {isNotificationDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsNotificationDropdownOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-[500px] overflow-hidden flex flex-col">
                                    {/* Header */}
                                    <div className="p-4 border-b border-slate-200">
                                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                                    </div>
                                    
                                    {/* Notifications List */}
                                    <div className="overflow-y-auto flex-1">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                                <p className="text-slate-500 text-sm">No notifications yet</p>
                                            </div>
                                        ) : (
                                            <div className="p-2">
                                                {notifications.map((notification, index) => (
                                                    <div key={index} className="p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                                        <p className="text-sm text-slate-900">{notification.message}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-40 flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-6xl flex gap-4">
                    
                    {/* Left Sidebar - Profile Card - Only show on profile tab */}
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            onClick={() => onNavigate('pilot-recognition-profile')}
                            className="w-72 flex-shrink-0 cursor-pointer group"
                            style={{
                                background: 'rgba(30, 41, 59, 0.8)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <div className="p-6">
                                {/* Profile Image - Same style as Pilot Recognition Profile */}
                                <div className="relative w-24 h-24 mx-auto mb-4">
                                    {profileImage ? (
                                        <img 
                                            src={profileImage} 
                                            alt={fullName}
                                            className="w-full h-full object-cover rounded-full border-2 border-white/30"
                                        />
                                    ) : (
                                        <div 
                                            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl"
                                            style={{ backgroundColor: '#3b82f6' }}
                                        >
                                            <span>{initials}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Name and Level */}
                                <h2 className="text-lg font-bold text-white text-center mb-1 tracking-wider">
                                    {fullName}
                                </h2>
                                <p className="text-center text-orange-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                                    {currentLevel}
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="text-center p-2 bg-white/5 rounded">
                                        <p className="text-lg font-bold text-white">{flightHours}</p>
                                        <p className="text-xs text-white/60 uppercase">Hours</p>
                                    </div>
                                    <div className="text-center p-2 bg-white/5 rounded">
                                        <p className="text-lg font-bold text-white">{recognitionScore}</p>
                                        <p className="text-xs text-white/60 uppercase">Score</p>
                                    </div>
                                    <div className="text-center p-2 bg-white/5 rounded">
                                        <p className="text-lg font-bold text-white">{certCount}</p>
                                        <p className="text-xs text-white/60 uppercase">Certs</p>
                                    </div>
                                    <div className="text-center p-2 bg-white/5 rounded">
                                        <p className="text-lg font-bold text-orange-400">{hoursForNextLevel - flightHours > 0 ? hoursForNextLevel - flightHours : 0}</p>
                                        <p className="text-xs text-white/60 uppercase">To Next</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-2">
                                    <div className="flex justify-between text-xs text-white/60 mb-1">
                                        <span>LEVEL PROGRESS</span>
                                        <span>{Math.round(progressPercent)}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pilot Profile Button */}
                            <div 
                                className="w-full flex items-center gap-3 px-6 py-4 group-hover:bg-white/5 transition-colors border-t border-white/10"
                            >
                                <ChevronRight className="w-5 h-5 text-white/70" />
                                <span className="text-sm font-bold text-white tracking-wider">PILOT PROFILE</span>
                            </div>

                            {/* Hover Border Effect */}
                            <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
                        </motion.div>
                    )}

                    {/* Right Area - Dashboard Cards */}
                    <div className="flex-1">
                        {activeTab === 'profile' ? (
                            <div className="grid grid-cols-2 gap-4">
                                {/* Large Card - My Hangar */}
                                <motion.div
                                    custom={0}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate={isVisible ? "visible" : "hidden"}
                                    onClick={dashboardCards[0].onClick}
                                    className="col-span-2 relative group cursor-pointer overflow-hidden"
                                    style={{
                                        height: '280px',
                                        background: 'rgba(30, 41, 59, 0.6)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.15)',
                                    }}
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${dashboardCards[0].image})`,
                                            opacity: 0.7,
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                                    
                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20">
                                            <ChevronRight className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white tracking-wider">
                                            {dashboardCards[0].title}
                                        </h3>
                                    </div>

                                    {/* Hover effect */}
                                    <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
                                </motion.div>

                                {/* Bottom Row - 2 Cards */}
                                {dashboardCards.slice(1).map((card, index) => (
                                    <motion.div
                                        key={card.id}
                                        custom={index + 1}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate={isVisible ? "visible" : "hidden"}
                                        onClick={card.onClick}
                                        className="relative group cursor-pointer overflow-hidden"
                                        style={{
                                            height: '160px',
                                            background: 'rgba(30, 41, 59, 0.6)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.15)',
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url(${card.image})`,
                                                opacity: 0.6,
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
                                        
                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2">
                                            <div className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20">
                                                <ChevronRight className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-sm font-bold text-white tracking-wider">
                                                {card.title}
                                            </h3>
                                        </div>

                                        {/* Hover effect */}
                                        <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
                                    </motion.div>
                                ))}
                            </div>
                        ) : activeTab === 'pathways' ? (
                            <div className="grid grid-cols-3 gap-4">
                                <h2 className="col-span-3 text-2xl font-bold text-white tracking-wider mb-2">PATHWAYS</h2>
                                {pathwaysCards.map((card, index) => (
                                    <motion.div
                                        key={card.id}
                                        custom={index}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate={isVisible ? "visible" : "hidden"}
                                        onClick={card.onClick}
                                        className="relative group cursor-pointer overflow-hidden"
                                        style={{
                                            height: '400px',
                                            border: index === 0 ? '2px solid #3b82f6' : '2px solid transparent',
                                        }}
                                    >
                                        {/* Full-bleed background image */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url(${card.image})`,
                                            }}
                                        />
                                        
                                        {/* Gradient overlay for text readability */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />
                                        
                                        {/* Top-weighted data (metrics) */}
                                        <div className="absolute top-4 left-4">
                                            <div className="text-3xl font-bold text-white">
                                                {index === 0 ? '96%' : index === 1 ? '78%' : '62%'}
                                            </div>
                                            <div className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                                                MASTERED
                                            </div>
                                        </div>

                                        {/* Information footer */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-sm">
                                            <h3 className="text-sm font-bold text-white tracking-wider mb-1">
                                                {card.title}
                                            </h3>
                                            <p className="text-xs text-white/70">
                                                {index === 0 ? 'Explore type ratings and certifications' : 
                                                 index === 1 ? 'Discover airline standards and requirements' : 
                                                 'Build your aviation career path'}
                                            </p>
                                        </div>

                                        {/* Hover effect */}
                                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />
                                    </motion.div>
                                ))}
                            </div>
                        ) : activeTab === 'programs' ? (
                            <div className="flex flex-col items-center justify-start min-h-[calc(100vh-200px)]">
                                {/* Programs Header - Elegant serif font with gradient underline */}
                                <div className="relative mb-8">
                                    <h2 className="text-3xl font-serif text-white tracking-wide mb-2">PROGRAMS</h2>
                                    <div className="h-1 bg-gradient-to-r from-teal-500 to-blue-500 w-32"></div>
                                </div>
                                
                                {/* Programs Content - Larger, centered layout */}
                                <div className="w-full max-w-6xl mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                                        {/* Foundation Program - Large hero card */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="md:col-span-2 h-80 md:h-96"
                                        >
                                            <div className="relative group cursor-pointer overflow-hidden transition-all duration-300 h-full"
                                                 onClick={() => onNavigate('foundational-program')}>
                                                {/* Split-section design */}
                                                <div className="h-full flex flex-col">
                                                    {/* Top half - Video (70% of height) */}
                                                    <div className="relative h-[70%] overflow-hidden">
                                                        <video
                                                            ref={(el) => {
                                                                if (el) {
                                                                    el.muted = isVideoMuted;
                                                                }
                                                            }}
                                                            className="w-full h-full object-cover"
                                                            autoPlay
                                                            muted={isVideoMuted}
                                                            loop
                                                            playsInline
                                                        >
                                                            <source src="/images/My Movie 3 - 720WebShareName.mov" type="video/mp4" />
                                                        </video>
                                                        
                                                        {/* Sharp-cornered teal badge */}
                                                        <div className="absolute top-4 right-4">
                                                            <span className="px-4 py-2 bg-teal-500 text-white text-sm font-bold uppercase tracking-wider">
                                                                Start Here
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Unmute button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsVideoMuted(!isVideoMuted);
                                                            }}
                                                            className="absolute bottom-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200 group"
                                                        >
                                                            {isVideoMuted ? (
                                                                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Bottom half - Solid dark navy (30% of height) */}
                                                    <div className="h-[30%] bg-slate-900 border-t-0 border-l border-r border-b border-slate-700 p-4 flex flex-col justify-center">
                                                        <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1">
                                                            » Foundation Program
                                                        </h3>
                                                        <p className="text-slate-300 text-xs leading-tight">
                                                            Start your pilot journey with structured mentorship and guidance
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {/* Hover effect */}
                                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
                                            </div>
                                        </motion.div>
                                        
                                        {/* Three directory cards stacked vertically */}
                                        <div className="md:col-span-2 flex flex-col gap-3 md:gap-4 h-80 md:h-96">
                                            {/* News & Updates - Rectangular strip */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="flex-1 min-h-0"
                                            >
                                                <div className="relative group cursor-pointer overflow-hidden transition-all duration-300 h-full">
                                                    {/* Directory Card - Simple text with arrow */}
                                                    <div className={`
                                                        relative w-full h-full rounded-none overflow-hidden
                                                        bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl
                                                        border border-white/20 shadow-2xl shadow-black/50
                                                        before:content-[''] before:absolute before:inset-0 before:rounded-none
                                                        before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0
                                                        before:transition-opacity before:duration-300
                                                        transition-all duration-500 ease-out
                                                        flex items-center justify-between px-6 md:px-8
                                                        ${'hover:scale-[1.02] shadow-black/70 before:opacity-100 border-white/30'}
                                                    `}>
                                                        <div className="flex flex-col">
                                                            <h3 className="text-white font-serif text-base md:text-lg tracking-wide mb-2">
                                                                » News & Updates
                                                            </h3>
                                                            <p className="text-slate-300 text-sm md:text-base leading-tight">
                                                                Latest industry insights, program announcements, and aviation trends
                                                            </p>
                                                        </div>
                                                        <div className={`
                                                            w-10 h-10 md:w-12 md:h-12 rounded-none flex items-center justify-center
                                                            bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg
                                                            transition-all duration-300
                                                            ${'hover:bg-white/20 scale-110 border-white/40'}
                                                        `}>
                                                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            
                                            {/* Program Benefits - Rectangular strip */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="flex-1 min-h-0"
                                            >
                                                <div className="relative group cursor-pointer overflow-hidden transition-all duration-300 h-full">
                                                    {/* Directory Card - Simple text with arrow */}
                                                    <div className={`
                                                        relative w-full h-full rounded-none overflow-hidden
                                                        bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl
                                                        border border-white/20 shadow-2xl shadow-black/50
                                                        before:content-[''] before:absolute before:inset-0 before:rounded-none
                                                        before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0
                                                        before:transition-opacity before:duration-300
                                                        transition-all duration-500 ease-out
                                                        flex items-center justify-between px-6 md:px-8
                                                        ${'hover:scale-[1.02] shadow-black/70 before:opacity-100 border-white/30'}
                                                    `}>
                                                        <div className="flex flex-col">
                                                            <h3 className="text-white font-serif text-base md:text-lg tracking-wide mb-2">
                                                                » Program Benefits
                                                            </h3>
                                                            <p className="text-slate-300 text-sm md:text-base leading-tight">
                                                                Discover certification advantages, career pathways, and exclusive member perks
                                                            </p>
                                                        </div>
                                                        <div className={`
                                                            w-10 h-10 md:w-12 md:h-12 rounded-none flex items-center justify-center
                                                            bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg
                                                            transition-all duration-300
                                                            ${'hover:bg-white/20 scale-110 border-white/40'}
                                                        `}>
                                                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            
                                            {/* Learn More - Rectangular strip */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="flex-1 min-h-0"
                                            >
                                                <div className="relative group cursor-pointer overflow-hidden transition-all duration-300 h-full">
                                                    {/* Directory Card - Simple text with arrow */}
                                                    <div className={`
                                                        relative w-full h-full rounded-none overflow-hidden
                                                        bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl
                                                        border border-white/20 shadow-2xl shadow-black/50
                                                        before:content-[''] before:absolute before:inset-0 before:rounded-none
                                                        before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0
                                                        before:transition-opacity before:duration-300
                                                        transition-all duration-500 ease-out
                                                        flex items-center justify-between px-6 md:px-8
                                                        ${'hover:scale-[1.02] shadow-black/70 before:opacity-100 border-white/30'}
                                                    `}>
                                                        <div className="flex flex-col">
                                                            <h3 className="text-white font-serif text-base md:text-lg tracking-wide mb-2">
                                                                » Learn More
                                                            </h3>
                                                            <p className="text-slate-300 text-sm md:text-base leading-tight">
                                                                Deep dive into curriculum details, mentorship structure, and success stories
                                                            </p>
                                                        </div>
                                                        <div className={`
                                                            w-10 h-10 md:w-12 md:h-12 rounded-none flex items-center justify-center
                                                            bg-white/10 backdrop-blur-sm border border-white/30 shadow-lg
                                                            transition-all duration-300
                                                            ${'hover:bg-white/20 scale-110 border-white/40'}
                                                        `}>
                                                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'dashboard' ? (
                            <div className="flex flex-col items-center justify-start min-h-[calc(100vh-200px)]">
                                {/* Dashboard Header - Elegant serif font with gradient underline */}
                                <div className="relative mb-8">
                                    <h2 className="text-3xl font-serif text-white tracking-wide mb-2">DASHBOARD</h2>
                                    <div className="h-1 bg-gradient-to-r from-teal-500 to-blue-500 w-32"></div>
                                </div>
                                
                                {/* Dashboard Content - Three main sections */}
                                <div className="w-full max-w-7xl mx-auto space-y-8">
                                    {/* Part 1: Recognition Profile Analytics */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-none p-6 shadow-2xl shadow-black/50"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <BarChart3 className="w-6 h-6 text-blue-400" />
                                            <h3 className="text-xl font-bold text-white">» RECOGNITION PROFILE ANALYTICS</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            {/* Core Metrics */}
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white mb-1">{flightHours.toLocaleString()}</div>
                                                <div className="text-sm text-slate-300">Flight Hours</div>
                                                <div className="text-xs text-teal-400 mt-1">+12 this month</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white mb-1">{recognitionScore.toLocaleString()}</div>
                                                <div className="text-sm text-slate-300">Recognition Score</div>
                                                <div className="text-xs text-blue-400 mt-1">Top 15%</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white mb-1">24</div>
                                                <div className="text-sm text-slate-300">Certificates</div>
                                                <div className="text-xs text-purple-400 mt-1">8 type ratings</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white mb-1">A+</div>
                                                <div className="text-sm text-slate-300">Profile Strength</div>
                                                <div className="text-xs text-green-400 mt-1">Excellent</div>
                                            </div>
                                        </div>
                                        
                                        {/* Recognition Breakdown */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-slate-900/50 border border-slate-700 rounded-none p-4">
                                                <h4 className="text-white font-bold mb-3">Technical Skills</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-300">A320 Type Rating</span>
                                                        <span className="text-teal-400">Expert</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-300">IFR Procedures</span>
                                                        <span className="text-blue-400">Advanced</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-300">CRM Skills</span>
                                                        <span className="text-purple-400">Proficient</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-slate-900/50 border border-slate-700 rounded-none p-4">
                                                <h4 className="text-white font-bold mb-3">Leadership Metrics</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-300">Mentorship Score</span>
                                                        <span className="text-green-400">92/100</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-300">Team Leadership</span>
                                                        <span className="text-teal-400">88/100</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-300">Decision Making</span>
                                                        <span className="text-blue-400">95/100</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-slate-900/50 border border-slate-700 rounded-none p-4">
                                                <h4 className="text-white font-bold mb-3">Career Progression</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-300">Current Level</span>
                                                        <span className="text-purple-400">Senior Pilot</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-300">Experience</span>
                                                        <span className="text-blue-400">8.5 years</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-300">Next Milestone</span>
                                                        <span className="text-teal-400">Captain</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Part 2: Programs Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-none p-6 shadow-2xl shadow-black/50"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <BookOpen className="w-6 h-6 text-teal-400" />
                                            <h3 className="text-xl font-bold text-white">» PROGRAMS</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Foundation Program */}
                                            <div className="bg-slate-900/50 border border-slate-700 rounded-none p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <GraduationCap className="w-5 h-5 text-purple-400" />
                                                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-none font-bold uppercase">Completed</span>
                                                </div>
                                                <h4 className="text-white font-bold mb-2">Foundation Program</h4>
                                                <p className="text-slate-300 text-sm mb-3">Core pilot development and mentorship</p>
                                                <div className="w-full bg-slate-700 rounded-none h-2">
                                                    <div className="bg-purple-500 h-2 rounded-none" style={{ width: '100%' }}></div>
                                                </div>
                                            </div>
                                            
                                            {/* Transition Program */}
                                            <div className="bg-slate-900/50 border border-slate-700 rounded-none p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <Plane className="w-5 h-5 text-blue-400" />
                                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-none font-bold uppercase">In Progress</span>
                                                </div>
                                                <h4 className="text-white font-bold mb-2">Transition Program</h4>
                                                <p className="text-slate-300 text-sm mb-3">Airline transition and industry alignment</p>
                                                <div className="w-full bg-slate-700 rounded-none h-2">
                                                    <div className="bg-blue-500 h-2 rounded-none" style={{ width: '65%' }}></div>
                                                </div>
                                            </div>
                                            
                                            {/* EBT Video Scoring */}
                                            <div className="bg-slate-900/50 border border-slate-700 rounded-none p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <Award className="w-5 h-5 text-green-400" />
                                                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-none font-bold uppercase">Available</span>
                                                </div>
                                                <h4 className="text-white font-bold mb-2">EBT Video Scoring</h4>
                                                <p className="text-slate-300 text-sm mb-3">Behavioral assessment and interview prep</p>
                                                <div className="w-full bg-slate-700 rounded-none h-2">
                                                    <div className="bg-green-500 h-2 rounded-none" style={{ width: '0%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                    
                                    {/* Part 3: Pathway Recommendations - Infinite Edge Carousel with GridCard Design */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-none p-6 shadow-2xl shadow-black/50"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <FolderOpen className="w-6 h-6 text-green-400" />
                                            <h3 className="text-xl font-bold text-white">» PATHWAY RECOMMENDATIONS</h3>
                                        </div>
                                        
                                        {/* Infinite Edge Carousel - GridCard MSFS Style */}
                                        <div className="relative overflow-hidden rounded-none">
                                            {/* Carousel Container */}
                                            <div 
                                                className="flex transition-transform duration-500 ease-out"
                                                style={{ 
                                                    transform: `translateX(-${pathwayCarouselIndex * 100}%)`,
                                                    width: '600%' // 6 pathways * 100% each for infinite loop
                                                }}
                                                onMouseEnter={() => setIsCarouselPaused(true)}
                                                onMouseLeave={() => setIsCarouselPaused(false)}
                                            >
                                                {/* Original pathways with GridCard design */}
                                                {[
                                                    {
                                                        id: 'delta',
                                                        title: 'Delta Airlines',
                                                        subtitle: 'A320 First Officer - Atlanta Base',
                                                        image: '/images/airlines/delta-airlines.jpg',
                                                        match: 95,
                                                        matchColor: 'green',
                                                        gaps: 3,
                                                        benefits: ['Competitive salary', 'Fast-track upgrade', 'Career growth']
                                                    },
                                                    {
                                                        id: 'united',
                                                        title: 'United Airlines',
                                                        subtitle: 'B737 First Officer - Chicago Hub',
                                                        image: '/images/airlines/united-airlines.jpg',
                                                        match: 82,
                                                        matchColor: 'yellow',
                                                        gaps: 7,
                                                        benefits: ['Global network', 'Training included', 'Seniority progression']
                                                    },
                                                    {
                                                        id: 'corporate',
                                                        title: 'Corporate Aviation',
                                                        subtitle: 'Falcon 7X Captain - Private Fleet',
                                                        image: '/images/aviation/corporate-aviation.jpg',
                                                        match: 78,
                                                        matchColor: 'blue',
                                                        gaps: 5,
                                                        benefits: ['Premium compensation', 'Flexible schedule', 'Luxury travel']
                                                    },
                                                    {
                                                        id: 'fedex',
                                                        title: 'FedEx Cargo',
                                                        subtitle: 'B767 First Officer - Memphis Hub',
                                                        image: '/images/airlines/fedex-cargo.jpg',
                                                        match: 88,
                                                        matchColor: 'green',
                                                        gaps: 4,
                                                        benefits: ['Stable growth', 'International routes', 'Cargo demand']
                                                    },
                                                    {
                                                        id: 'skywest',
                                                        title: 'SkyWest Airlines',
                                                        subtitle: 'CRJ700 First Officer - Denver Base',
                                                        image: '/images/airlines/skywest-airlines.jpg',
                                                        match: 91,
                                                        matchColor: 'teal',
                                                        gaps: 2,
                                                        benefits: ['Quick upgrade', 'Partnership program', 'Regional focus']
                                                    },
                                                    {
                                                        id: 'emirates',
                                                        title: 'Emirates Airlines',
                                                        subtitle: 'A380 First Officer - Dubai Hub',
                                                        image: '/images/airlines/emirates-airlines.jpg',
                                                        match: 75,
                                                        matchColor: 'red',
                                                        gaps: 6,
                                                        benefits: ['Tax-free benefits', 'Global opportunities', 'International routes']
                                                    }
                                                ].map((pathway, index) => (
                                                    <div key={`${pathway.id}-${index}`} className="w-full flex-shrink-0 px-2">
                                                        {/* MSFS Style GridCard */}
                                                        <div className={`
                                                            relative w-full h-[200px] rounded-none overflow-hidden cursor-pointer group
                                                            bg-black/85 border border-white/20 
                                                            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_28px_rgba(0,0,0,0.55)]
                                                            transition-transform duration-300 ease-out
                                                            hover:scale-[1.01] hover:brightness-110
                                                        `}>
                                                            {/* Selected Card Highlight Strip (MSFS style) */}
                                                            <div className="absolute bottom-0 left-0 right-0 h-[3px] z-30 opacity-100 bg-[#00b4d8]" />
                                                            
                                                            {/* Background Image */}
                                                            <div className="absolute inset-0">
                                                                <img 
                                                                    src={pathway.image} 
                                                                    alt={pathway.title}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        // Fallback to gradient if image fails
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                        target.parentElement!.className = target.parentElement!.className + ' bg-gradient-to-br from-slate-800 to-slate-900';
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                                            </div>
                                                            
                                                            {/* Content Overlay */}
                                                            <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
                                                                {/* Top Section */}
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h3 className="text-white font-serif text-lg md:text-xl tracking-wide font-bold mb-1">
                                                                            {pathway.title}
                                                                        </h3>
                                                                        <p className="text-slate-300 text-sm leading-tight">
                                                                            {pathway.subtitle}
                                                                        </p>
                                                                    </div>
                                                                    <div className={`bg-${pathway.matchColor}-500/20 backdrop-blur-sm border border-${pathway.matchColor}-400/30 px-3 py-1 rounded-none`}>
                                                                        <span className={`text-${pathway.matchColor}-300 text-xs font-bold uppercase`}>
                                                                            {pathway.match}% Match
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Bottom Section */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-2 h-2 bg-${pathway.matchColor}-400 rounded-full`}></div>
                                                                        <span className="text-white text-sm font-medium">
                                                                            {pathway.gaps} gaps remaining
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {pathway.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                                                                            <span key={benefitIndex} className="text-slate-300 text-xs bg-white/10 px-2 py-1 rounded-none">
                                                                                {benefit}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                {/* Duplicate pathways for infinite loop */}
                                                {[
                                                    {
                                                        id: 'delta',
                                                        title: 'Delta Airlines',
                                                        subtitle: 'A320 First Officer - Atlanta Base',
                                                        image: '/images/airlines/delta-airlines.jpg',
                                                        match: 95,
                                                        matchColor: 'green',
                                                        gaps: 3,
                                                        benefits: ['Competitive salary', 'Fast-track upgrade', 'Career growth']
                                                    },
                                                    {
                                                        id: 'united',
                                                        title: 'United Airlines',
                                                        subtitle: 'B737 First Officer - Chicago Hub',
                                                        image: '/images/airlines/united-airlines.jpg',
                                                        match: 82,
                                                        matchColor: 'yellow',
                                                        gaps: 7,
                                                        benefits: ['Global network', 'Training included', 'Seniority progression']
                                                    },
                                                    {
                                                        id: 'corporate',
                                                        title: 'Corporate Aviation',
                                                        subtitle: 'Falcon 7X Captain - Private Fleet',
                                                        image: '/images/aviation/corporate-aviation.jpg',
                                                        match: 78,
                                                        matchColor: 'blue',
                                                        gaps: 5,
                                                        benefits: ['Premium compensation', 'Flexible schedule', 'Luxury travel']
                                                    },
                                                    {
                                                        id: 'fedex',
                                                        title: 'FedEx Cargo',
                                                        subtitle: 'B767 First Officer - Memphis Hub',
                                                        image: '/images/airlines/fedex-cargo.jpg',
                                                        match: 88,
                                                        matchColor: 'green',
                                                        gaps: 4,
                                                        benefits: ['Stable growth', 'International routes', 'Cargo demand']
                                                    },
                                                    {
                                                        id: 'skywest',
                                                        title: 'SkyWest Airlines',
                                                        subtitle: 'CRJ700 First Officer - Denver Base',
                                                        image: '/images/airlines/skywest-airlines.jpg',
                                                        match: 91,
                                                        matchColor: 'teal',
                                                        gaps: 2,
                                                        benefits: ['Quick upgrade', 'Partnership program', 'Regional focus']
                                                    },
                                                    {
                                                        id: 'emirates',
                                                        title: 'Emirates Airlines',
                                                        subtitle: 'A380 First Officer - Dubai Hub',
                                                        image: '/images/airlines/emirates-airlines.jpg',
                                                        match: 75,
                                                        matchColor: 'red',
                                                        gaps: 6,
                                                        benefits: ['Tax-free benefits', 'Global opportunities', 'International routes']
                                                    }
                                                ].map((pathway, index) => (
                                                    <div key={`${pathway.id}-duplicate-${index}`} className="w-full flex-shrink-0 px-2">
                                                        {/* MSFS Style GridCard */}
                                                        <div className={`
                                                            relative w-full h-[200px] rounded-none overflow-hidden cursor-pointer group
                                                            bg-black/85 border border-white/20 
                                                            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_0_28px_rgba(0,0,0,0.55)]
                                                            transition-transform duration-300 ease-out
                                                            hover:scale-[1.01] hover:brightness-110
                                                        `}>
                                                            {/* Selected Card Highlight Strip (MSFS style) */}
                                                            <div className="absolute bottom-0 left-0 right-0 h-[3px] z-30 opacity-100 bg-[#00b4d8]" />
                                                            
                                                            {/* Background Image */}
                                                            <div className="absolute inset-0">
                                                                <img 
                                                                    src={pathway.image} 
                                                                    alt={pathway.title}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        // Fallback to gradient if image fails
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                        target.parentElement!.className = target.parentElement!.className + ' bg-gradient-to-br from-slate-800 to-slate-900';
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                                            </div>
                                                            
                                                            {/* Content Overlay */}
                                                            <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
                                                                {/* Top Section */}
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h3 className="text-white font-serif text-lg md:text-xl tracking-wide font-bold mb-1">
                                                                            {pathway.title}
                                                                        </h3>
                                                                        <p className="text-slate-300 text-sm leading-tight">
                                                                            {pathway.subtitle}
                                                                        </p>
                                                                    </div>
                                                                    <div className={`bg-${pathway.matchColor}-500/20 backdrop-blur-sm border border-${pathway.matchColor}-400/30 px-3 py-1 rounded-none`}>
                                                                        <span className={`text-${pathway.matchColor}-300 text-xs font-bold uppercase`}>
                                                                            {pathway.match}% Match
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Bottom Section */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-2 h-2 bg-${pathway.matchColor}-400 rounded-full`}></div>
                                                                        <span className="text-white text-sm font-medium">
                                                                            {pathway.gaps} gaps remaining
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {pathway.benefits.slice(0, 2).map((benefit, benefitIndex) => (
                                                                            <span key={benefitIndex} className="text-slate-300 text-xs bg-white/10 px-2 py-1 rounded-none">
                                                                                {benefit}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Carousel Navigation */}
                                            <button
                                                onClick={() => setPathwayCarouselIndex((prev) => prev === 0 ? 5 : prev - 1)}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-none flex items-center justify-center transition-all duration-200 z-10"
                                            >
                                                <ChevronRight className="w-5 h-5 text-white rotate-180" />
                                            </button>
                                            <button
                                                onClick={() => setPathwayCarouselIndex((prev) => prev === 5 ? 0 : prev + 1)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-none flex items-center justify-center transition-all duration-200 z-10"
                                            >
                                                <ChevronRight className="w-5 h-5 text-white" />
                                            </button>
                                            
                                            {/* Carousel Indicators */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setPathwayCarouselIndex(index)}
                                                        className={`w-2 h-2 rounded-none transition-all duration-200 ${
                                                            pathwayCarouselIndex === index 
                                                                ? 'bg-white w-8' 
                                                                : 'bg-white/40 hover:bg-white/60'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Pathway Insights */}
                                        <div className="mt-6 p-4 bg-slate-900/30 border border-slate-700 rounded-none">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                                                <span className="text-sm text-teal-400 font-bold">INSIGHTS</span>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                Your profile matches <span className="text-white font-bold">6 high-potential pathways</span> with 80%+ compatibility. 
                                                Focus on completing the <span className="text-blue-400 font-bold">Transition Program</span> to unlock premium pathways 
                                                and increase your match score by an average of <span className="text-green-400 font-bold">12%</span>.
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        ) : activeTab === 'marketplace' ? (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white tracking-wider mb-6">NEWS ROOM</h2>
                                
                                {/* Newsroom Content - Exactly like homepage modal */}
                                <div className="relative w-full max-w-[900px] mx-auto">
                                    <div className="relative border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/65 to-slate-950/80 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-[12px] flex flex-col overflow-hidden">
                                        <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 45%)' }} />
                                        
                                        <div className="grid gap-3 md:gap-4 md:grid-cols-[1.4fr,1fr] p-3 md:p-5 overflow-y-auto">
                                            <div className="text-white space-y-2 md:space-y-4 flex flex-col min-h-0">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/40">
                                                            <span className="text-red-400">Recognition</span> <span className="text-white">Update</span>
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-rose-200">
                                                            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                                                            Live
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">{activeNewsIndex + 1} / {newsroomHighlights.length}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-200/80">{newsroomHighlights[activeNewsIndex].tag}</p>
                                                    <h2 className="text-lg md:text-3xl lg:text-[2.2rem] font-serif leading-tight mt-1 md:mt-2">
                                                        {newsroomHighlights[activeNewsIndex].title}
                                                    </h2>
                                                    <p className="text-slate-100/85 text-xs md:text-base mt-2 md:mt-3 leading-relaxed">
                                                        {newsroomHighlights[activeNewsIndex].description}
                                                    </p>
                                                </div>

                                                <ul className="space-y-1 md:space-y-1.5">
                                                    {newsroomHighlights[activeNewsIndex].bullets.map((bullet: string, index: number) => (
                                                        <li key={`${newsroomHighlights[activeNewsIndex].id}-bullet-${index}`} className="flex items-start gap-2 text-xs md:text-sm text-slate-100/90">
                                                            <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-300 mt-0.5 shrink-0" />
                                                            <span>{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {newsroomHighlights[activeNewsIndex].metrics.map((metric: { label: string; value: string }) => (
                                                        <div key={`${newsroomHighlights[activeNewsIndex].id}-${metric.label}`} className="border border-white/25 bg-white/5 px-2 py-1.5 md:px-3 md:py-2 shadow-lg shadow-black/30">
                                                            <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">{metric.label}</p>
                                                            {metric.label === 'Certification' && metric.value === 'enroll now for free!' ? (
                                                                <button
                                                                    onClick={() => onNavigate('become-a-member')}
                                                                    className="text-sm md:text-base font-semibold text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                                                >
                                                                    {metric.value}
                                                                </button>
                                                            ) : (
                                                                <p className="text-sm md:text-base font-semibold">{metric.value}</p>
                                                            )}
                                                            {metric.label === 'Certification' && (
                                                                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-white/40 mt-1">
                                                                    certifications & terms and conditions apply
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex flex-col items-center gap-2 pt-1">
                                                    <button
                                                        onClick={() => onNavigate('home')}
                                                        className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 border border-white/20 bg-white/80 text-slate-900 text-[11px] md:text-xs font-black uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(15,23,42,0.6)] hover:-translate-y-0.5 transition"
                                                    >
                                                        <Home className="w-3.5 h-3.5 md:w-4 md:h-4" /> Home
                                                    </button>
                                                    <button
                                                        onClick={() => onNavigate(newsroomHighlights[activeNewsIndex].ctaTarget)}
                                                        className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80 hover:text-white"
                                                    >
                                                        Open update →
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="relative min-h-[100px] md:min-h-0 border border-white/25 flex-shrink-0">
                                                <img src={newsroomHighlights[activeNewsIndex].image} alt={newsroomHighlights[activeNewsIndex].title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/75 via-slate-900/10 to-transparent" />
                                                <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4">
                                                    <p className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-white/70">Latest drop</p>
                                                    <p className="text-sm md:text-lg font-semibold text-white leading-tight">
                                                        {newsroomHighlights[activeNewsIndex].tag}
                                                    </p>
                                                    <p className="text-xs md:text-sm text-white/80 hidden sm:block">
                                                        Recognition, programs, and pathways broadcast through one newsroom overlay.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-4 md:px-6 py-3 border-t border-white/10 bg-slate-900/30">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">Latest Updates</span>
                                                <div className="flex gap-1.5">
                                                    {newsroomHighlights.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setActiveNewsIndex(index)}
                                                            className={`h-1.5 flex-1 rounded-sm transition-all ${
                                                                index === activeNewsIndex
                                                                    ? 'bg-white/60 border-2 border-white/40'
                                                                    : 'bg-white/20 border-2 border-dashed border-white/10 hover:bg-white/30'
                                                            }`}
                                                            aria-label={`Go to news item ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-white/50 text-lg">Coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
