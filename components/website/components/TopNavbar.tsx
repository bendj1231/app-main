import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Menu, X, ChevronLeft, ChevronDown, User, Settings, Camera, Award, Clock, Edit, Monitor, Bell, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { Skeleton } from '@/src/components/ui/skeleton';
import { NavigationSchema } from './seo/NavigationSchema';
import { GraphicsSettingsModal } from './GraphicsSettingsModal';
import { sanitizeHtml } from '@/src/lib/sanitize-html';

interface TopNavbarProps {
    onNavigate: (page: string) => void;
    onLogin: () => void;
    isDark?: boolean;
    forceScrolled?: boolean;
    isLight?: boolean;
    onLoginModalOpen?: () => void;
    currentPage?: string;
    pathwayGridRef?: React.RefObject<HTMLDivElement>;
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
    isBlue?: boolean;
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
    pathwayGridRef,
}) => {
    const { currentUser, userProfile, logout, loading: authLoading, signupInProgress } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(forceScrolled);
    const [passedPathwayGrid, setPassedPathwayGrid] = useState(false);
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
    const [logoutLoading, setLogoutLoading] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const settingsDropdownRef = useRef<HTMLDivElement>(null);
    const [isAuthRestoring, setIsAuthRestoring] = useState(true);
    const [isGraphicsModalOpen, setIsGraphicsModalOpen] = useState(false);
    const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
    const [showGraphicsTooltip, setShowGraphicsTooltip] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);
    const [countryCode, setCountryCode] = useState<string>('');

    // Fetch pilot_id and profile data from Supabase profile
    // Detect user country code via IP geolocation (free tier)
    useEffect(() => {
        let cancelled = false;
        
        // Check cache first
        const cachedCountry = localStorage.getItem('cachedCountryCode');
        const cachedTime = localStorage.getItem('cachedCountryTime');
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
        
        if (cachedCountry && cachedTime) {
            const timeDiff = Date.now() - parseInt(cachedTime);
            if (timeDiff < CACHE_DURATION) {
                setCountryCode(cachedCountry);
                return;
            }
        }
        
        fetch('https://ipapi.co/json/')
            .then(res => {
                if (!res.ok) {
                    if (res.status === 429) {
                        console.warn('ipapi.co rate limit reached, using cached value if available');
                    }
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (!cancelled && data?.country_code) {
                    setCountryCode(data.country_code);
                    // Cache the result
                    localStorage.setItem('cachedCountryCode', data.country_code);
                    localStorage.setItem('cachedCountryTime', Date.now().toString());
                }
            })
            .catch(() => {
                // Silently fail — country indicator is non-critical
            });
        return () => { cancelled = true; };
    }, []);

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
                        setProfileImageUrl(data.profile_image_url || null);
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

    const handleLogout = async (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        console.log('[LOGOUT CLICK] handleLogout called, logoutLoading:', logoutLoading, 'currentUser:', currentUser?.email);
        // Prevent multiple simultaneous logout calls
        if (logoutLoading) {
            console.log('[LOGOUT BLOCKED] Already logging out');
            return;
        }
        if (!logout) {
            console.error('[LOGOUT ERROR] logout function is undefined');
            return;
        }
        try {
            setLogoutLoading(true);
            console.log('[LOGOUT START] Calling auth.logout()...');
            await logout();
            console.log('[LOGOUT SUCCESS] Redirecting to home');
            onNavigate('home'); // Redirect to home after logout
            setIsMenuOpen(false);
        } catch (error) {
            console.error("[LOGOUT ERROR] Failed to log out:", error);
        } finally {
            setLogoutLoading(false);
            console.log('[LOGOUT END] logoutLoading reset');
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
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
                setIsNotificationDropdownOpen(false);
            }
        };

        if (isProfileDropdownOpen || isSettingsDropdownOpen || isNotificationDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isProfileDropdownOpen, isSettingsDropdownOpen, isNotificationDropdownOpen]);

    useEffect(() => {
        if (forceScrolled) return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Check if we've scrolled past the pathwaygrid section
            if (pathwayGridRef?.current) {
                const pathwayGridBottom = pathwayGridRef.current.getBoundingClientRect().bottom;
                setPassedPathwayGrid(pathwayGridBottom < 0);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [forceScrolled, pathwayGridRef]);

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

    // Show graphics tooltip on first visit (logged in or out)
    useEffect(() => {
        const hasSeenTooltip = localStorage.getItem('hasSeenGraphicsTooltip');
        if (!hasSeenTooltip && !authLoading) {
            const timer = setTimeout(() => {
                setShowGraphicsTooltip(true);
            }, 2000); // Show after 2 seconds
            return () => clearTimeout(timer);
        }
    }, [authLoading]);

    // Fetch notification count and notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (currentUser?.uid && userProfile?.id) {
                try {
                    const profileId = userProfile.id;

                    // Fetch count
                    const { count, error: countError } = await supabase
                        .from('notifications')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', profileId)
                        .eq('is_read', false);

                    if (!countError && count !== null) {
                        setNotificationCount(count);
                    }

                    // Fetch actual notifications
                    const { data, error } = await supabase
                        .from('notifications')
                        .select('*')
                        .eq('user_id', profileId)
                        .order('created_at', { ascending: false })
                        .limit(10);

                    if (!error && data) {
                        setNotifications(data);
                    }
                } catch (err) {
                    // Suppress transient network errors (tab suspended, offline, etc.)
                    if (err instanceof Error && err.message !== 'Load failed') {
                        console.error('Error fetching notifications:', err);
                    }
                }
            }
        };

        fetchNotifications();

        // Set up real-time subscription for new notifications
        const subscription = supabase
            .channel('notifications-count')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                },
                () => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [currentUser?.uid, userProfile?.id]);

    const markAsRead = async (notificationId: string) => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);
        
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setNotificationCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .in('id', unreadIds);

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setNotificationCount(0);
    };

    const formatTimestamp = (date: string) => {
        const now = new Date();
        const timestamp = new Date(date);
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return timestamp.toLocaleDateString();
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-amber-500" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const pilotRecognitionTarget = currentUser ? 'recognition-plus' : 'what-is-recognition';

    const navItems: NavItem[] = [
        {
            name: 'Home',
            target: '/'
        },
        {
            name: 'Blog',
            target: '/blog'
        },
        {
            name: 'Store',
            target: '/store'
        },
        {
            name: 'About',
            target: '/about',
            subItems: [
                { category: 'For Pilots', name: 'About PilotRecognition', target: '/about', bullets: ['Program Overview', 'Our Mission', 'Global Impact'] },
                { name: 'Mission & Vision', target: '/mission-vision', bullets: ['Our Core Values', 'Vision for 2030', 'Industry Stewardship'] },
                { name: 'What is the Pilot Gap?', target: '/pilot-gap-about', bullets: ['Professional Transition', 'Industry Challenge', 'Our Solution'] },
                { category: 'For Industry', name: 'For Airlines & Operators', target: '/about-industry', bullets: ['Recruitment Efficiency', 'Verified Candidates', 'Pull System Access'] },
                { name: 'Industry Stewardship', target: '/industry-stewardship', bullets: ['EBT Alignment', 'Pilot Advocacy', '2030 Vision'] },
                { name: 'FAQ', target: 'faq' },
                { name: 'Why Recognition', target: '/why-recognition', bullets: ['For Students', 'For Hobbyists', 'For Active Pilots'] },
                { name: 'The Pilot Shortage', target: '/pilot-shortage', bullets: ['The Truth Revealed', 'Why Airlines Are Picky', 'How to Get Vetted'] },
            ]
        },
        {
            name: 'Programs',
            target: '/programs',
            subItems: [
                // Core Programs
                { category: 'Core Programs', name: 'Foundational Program', target: '/foundational-program', bullets: ['20HR Guided Mentorship', 'Pilot Profile Build', 'Global Talent Registry'] },
                { category: 'Core Programs', name: 'Transition Program', target: '/transition-program', bullets: ['Atlas CV Optimization', 'Airline Interview Secrets', 'Broker Advantage'] },
                { category: 'Core Programs', name: 'EBT CBTA Fast-Track', target: '/ebt-cbta', bullets: ['Competency-based training', 'Evidence-based assessment', 'Interview priority'] },
                // Training & Development
                { category: 'Training', name: 'Pilot Gap Training', target: '/pilot-gap-module', bullets: ['Bridge knowledge gaps', 'Industry alignment', 'Recognition readiness'] },
                { category: 'Training', name: 'Mentorship Program', target: '/mentorship', bullets: ['Captain mentors', 'Professional guidance', '1-on-1 coaching'] },
                { category: 'Training', name: 'Examination Portal', target: '/examination-portal', bullets: ['Skill assessments', 'Progress tracking', 'Certification prep'] },
                // Resources
                { category: 'Resources', name: 'Program Benefits', target: '/program-benefits', bullets: ['Member advantages', 'Professional tools', 'Network access'] },
                { category: 'Resources', name: 'Program Pathways', target: '/programs-pathways', bullets: ['Stage progression', 'Milestone tracking', 'Next steps'] },
                { category: 'Resources', name: 'News & Updates', target: '/news-updates', bullets: ['Latest announcements', 'Program changes', 'Industry news'] },
                // Special Programs (highlighted)
                { category: 'Special Programs', name: 'What is the Pilot Gap?', target: '/pilot-gap-about', bullets: ['Industry disconnect', 'Professional transition', 'Our solution'], isYellow: true },
            ]
        },
        {
            name: 'Pathways',
            target: '/pathways-modern',
            subItems: [
                // For Pilots - Career Pathways to View & Access
                { category: 'For Pilots', name: 'Airlines & Operators', target: '/pathways-modern?section=airlines', bullets: ['Commercial carriers', 'Regional airlines', 'Flagship operators'] },
                { category: 'For Pilots', name: 'Private Jet & Charter', target: '/pathways-modern?section=private-jet', bullets: ['Corporate aviation', 'VIP charter', 'Fractional ownership'] },
                { category: 'For Pilots', name: 'Air Taxi & eVTOL', target: '/pathways-modern?section=evtol', bullets: ['Urban air mobility', 'Electric aircraft', 'Next-gen aviation'] },
                { category: 'For Pilots', name: 'Cargo & Logistics', target: '/pathways-modern?section=cargo', bullets: ['Freight operators', 'Express delivery', 'Long-haul cargo'] },
                { category: 'For Pilots', name: 'Military & Defence', target: '/pathways-modern?section=military', bullets: ['Armed forces', 'Defence contractors', 'Government aviation'] },
                { category: 'For Pilots', name: 'Flight Schools & ATOs', target: '/pathways-modern?section=flight-schools', bullets: ['Instructor pathways', 'Examiner routes', 'Training pathways'] },
                { category: 'For Pilots', name: 'Type Rating Search', target: '/type-rating-search', bullets: ['Aircraft manufacturers', 'Training centers', 'Licensing requirements'] },
                { category: 'For Pilots', name: 'Airline Expectations', target: '/airline-expectations', bullets: ['Entry requirements', 'Operator standards', 'Expectation insights'] },
                { category: 'For Pilots', name: 'Global Aviation Authorities', target: '/global-aviation-authorities', bullets: ['FAA database', 'CAAP compliance', 'EASA integration', 'Regulatory sync'], isYellow: true },
                // For Industry - Enterprise Access & Services
                { category: 'For Industry', name: 'Enterprise Access', target: 'https://enterprise.pilotrecognition.com', bullets: ['Pull-based recruitment', 'Verified candidates', 'Pathway publishing'] },
                { category: 'For Industry', name: 'Aviation Discovery', target: 'https://enterprise.pilotrecognition.com#recruitment', bullets: ['Agency partnerships', 'Talent pipeline', 'Recognition brokers'] },
                { category: 'For Industry', name: 'Simulator Training', target: 'https://enterprise.pilotrecognition.com#simulator', bullets: ['Type rating centers', 'Training partnerships', 'Facility network'] },
                { category: 'For Industry', name: 'MRO & Maintenance', target: 'https://enterprise.pilotrecognition.com#maintenance', bullets: ['Engineering tracks', 'Maintenance ops', 'Technical services'] },
                { category: 'For Industry', name: 'RPAS & Drone Ops', target: 'https://enterprise.pilotrecognition.com#drone', bullets: ['UAV training', 'Commercial drones', 'Remote pilot programs'] },
                { category: 'For Industry', name: 'OEM Partnerships', target: 'https://enterprise.pilotrecognition.com#manufacturers', bullets: ['Manufacturer programs', 'Factory training', 'Technical pathways'] },
            ]
        },
        {
            name: 'Pilot Recognition',
            target: pilotRecognitionTarget,
            subItems: [
                // Learn About - Educational content (BLUE headers)
                { category: 'Learn About', name: 'What is Pilot Recognition?', target: '/learn-about?section=what-is-recognition', bullets: ['Platform overview', 'How it works', 'Why pilots need it'] },
                { category: 'Learn About', name: 'Recognition Score Explained', target: '/learn-about?section=recognition-score-guide', bullets: ['What is your score', 'How it is calculated', 'Why airlines care'] },
                { category: 'Learn About', name: 'The Pulling System', target: '/learn-about?section=pulling-system', bullets: ['No more applications', 'How airlines find you', 'Live profile benefits'] },
                { category: 'Learn About', name: 'Recognition vs Traditional', target: '/learn-about?section=recognition-vs-traditional', bullets: ['CVs vs Live profiles', 'Apply vs Get pulled', 'Static vs Verified data'] },
                { category: 'Learn About', name: 'Why Resumes Are Dead Data', target: '/learn-about?section=dead-data-resumes', bullets: ['Static PDFs are outdated', 'Live profiles update auto', 'Verified vs claimed data'] },
                { category: 'Learn About', name: 'For Airlines & Operators', target: '/learn-about?section=for-airlines', bullets: ['Verified candidates', 'Ranked shortlists', 'Compliance ready'] },
                // Recognition+ Premium Features (RED header)
                { category: 'Recognition+', name: 'Recognition Plus Membership', target: '/recognition-plus', bullets: ['Priority Pipeline Access', 'Recognition+ Badge', 'AI Recognition Strategist'], isYellow: true },
                { category: 'Recognition+', name: 'Live Real-Time Profile', target: '/recognition-plus?section=live-profile', bullets: ['Auto-updates on hours logged', 'Airline pulling system', 'Ranked shortlist placement'] },
                { category: 'Recognition+', name: 'Recognition AI', target: '/recognition-plus?section=ai-features', bullets: ['Extended AI access', 'Live type rating data', 'Airline & pathway insights'] },
                { category: 'Recognition+', name: 'Priority Matching', target: '/recognition-plus?section=priority-matching', bullets: ['Unlimited pathway submissions', 'Unlimited profile comparisons', 'Pathway surge priority'] },
                { category: 'Recognition+', name: 'EBT CBTA Fast-Track', target: '/recognition-plus?section=ebt-cbta', bullets: ['Skip the queue', 'Foundation Program', 'Interview priority'] },
                { category: 'Recognition+', name: 'ATLAS Formatted CV', target: '/atlas-cv', bullets: ['AI data extraction', 'Global standards', 'Airline visibility'] },
                { category: 'Recognition+', name: 'AI Medical Alerts', target: '/recognition-plus?section=medical-alerts', bullets: ['60-day expiry warnings', 'Zero-Fail compliance', 'Auto-reminders'] },
                { category: 'Recognition+', name: 'Program Discounts', target: '/recognition-plus?section=program-discounts', bullets: ['25-50% off Foundation', '25-50% off Transition', 'Member-only rates'] },
                // General - Core platform features (BLUE headers)
                { category: 'General', name: 'Free Tier Access', target: '/general?section=free-tier', bullets: ['Create basic profile', '3 pathways per month', 'Public registry listing'] },
                { category: 'General', name: 'Priority Listings', target: '/general?section=priority-listings', bullets: ['How ranking works', 'Visibility tiers', 'Airline filters'] },
                { category: 'General', name: 'Verification Levels', target: '/general?section=verification-levels', bullets: ['Basic profile', 'Recognition+', 'Recognition+ Verified'] },
                { category: 'General', name: 'Professional Pathway Access', target: '/general?section=career-pathway-access', bullets: ['View public pathways', 'Submit interest', 'Match with operators'] },
                { category: 'General', name: 'Membership Benefits', target: '/general?section=membership-benefits', bullets: ['Free forever tier', 'Upgrade anytime', 'Cancel anytime'] },
                // Recognition Profiling (BLUE headers)
                { category: 'Recognition Profiling', name: 'Digital Logbook', target: '/professional-profile?section=digital-logbook', bullets: ['Flight records', 'Verified hours', 'Professional milestones'] },
                { category: 'Recognition Profiling', name: 'Flight Hours Verification', target: '/professional-profile?section=flight-hours-verification', bullets: ['Airline system integration', 'Third-party badges', 'PIC/SIC breakdown'] },
                { category: 'Recognition Profiling', name: 'Examination Results', target: '/professional-profile?section=examination-results', bullets: ['Verified scores', 'Mentorship assessments', 'Knowledge recency'] },
                { category: 'Recognition Profiling', name: 'Pilot Recognition Profile', target: '/professional-profile?section=pilot-recognition-profile', bullets: ['Digital identity', 'Verified credentials', 'Public registry'] },
                { category: 'Recognition Profiling', name: 'Type Ratings & Endorsements', target: '/professional-profile?section=type-ratings', bullets: ['Complete inventory', 'Expiration tracking', 'Recency monitoring'] },
                { category: 'Recognition Profiling', name: 'Training Records', target: '/professional-profile?section=training-records', bullets: ['Complete history', 'Provider sync', 'Check ride docs'] },
                { category: 'Recognition Profiling', name: 'Professional Timeline', target: '/professional-profile?section=career-timeline', bullets: ['Visual journey', 'Milestone tracking', 'Command upgrades'] },
                { category: 'Recognition Profiling', name: 'Document Vault', target: '/professional-profile?section=document-vault', bullets: ['Secure storage', 'Instant access', 'License archive'] },
                { category: 'Recognition Profiling', name: 'Skills & Competencies', target: '/professional-profile?section=skills-competencies', bullets: ['Skill breakdown', 'Instructor validation', 'Proficiency ratings'] },
                // Background & Compliance (BLUE headers) - includes Medical
                { category: 'Background Check', name: 'Background Checking', target: '/background-check?section=background-checking', bullets: ['Criminal record check', 'Employment verification', 'Reference validation'] },
                { category: 'Background Check', name: 'Medical Certificates', target: '/background-check?section=medical-certificates', bullets: ['Class 1 Medical', 'Class 2 Medical', 'Exam locations'] },
                { category: 'Background Check', name: 'Health Resources', target: '/background-check?section=health-resources', bullets: ['Mental health support', 'Fitness for duty', 'Wellness programs'] },
                { category: 'Background Check', name: 'Air Law & Legal Protection', target: '/background-check?section=air-law-legal', bullets: ['Insurance disputes', 'Contract review', 'License defense'] },
                // Pilot Insurance (BLUE headers)
                { category: 'Pilot Insurance', name: 'Loss of License Cover', target: '/pilot-insurance?section=loss-of-license', bullets: ['Income protection', 'Medical grounding', 'Career transition'] },
                { category: 'Pilot Insurance', name: 'Life Insurance', target: '/pilot-insurance?section=life-insurance', bullets: ['Term life', 'Family protection', 'Pilot-specific rates'] },
                { category: 'Pilot Insurance', name: 'Disability Coverage', target: '/pilot-insurance?section=disability-coverage', bullets: ['Short-term disability', 'Long-term protection', 'Occupational coverage'] },
                { category: 'Pilot Insurance', name: 'Professional Liability', target: '/pilot-insurance?section=professional-liability', bullets: ['Legal protection', 'Regulatory defense', 'Incident coverage'] },
                { category: 'Pilot Insurance', name: 'Pilot Insurance Providers', target: '/pilot-insurance?section=insurance-providers', bullets: ['Aviation specialists', 'Member discounts', 'Verified partners'] },
                // Career Tools now under General category
                { category: 'General', name: 'Recognition Career Matches', target: '/career-tools?section=recognition-career-matches', bullets: ['AI-powered matching', 'Career pathways', 'Match percentage'] },
                { category: 'General', name: 'ATLAS CV Builder', target: '/career-tools?section=atlas-cv-builder', bullets: ['ATS optimization', 'Auto-import profile', 'Airline templates'] },
                { category: 'General', name: 'Interview Preparation', target: '/career-tools?section=interview-preparation', bullets: ['Airline question banks', 'Video practice', 'Simulator prep'] },
                { category: 'General', name: 'Career Pathway Planner', target: '/career-tools?section=career-pathway-planner', bullets: ['Visual roadmaps', 'Hour requirements', 'Stage-by-stage guide'] },
                { category: 'General', name: 'Type Rating Advisor', target: '/career-tools?section=type-rating-advisor', bullets: ['Market demand analysis', 'ROI calculator', 'Provider comparisons'] },
                // Banking & Finance (BLUE headers)
                { category: 'Banking & Finance', name: 'Pilot Loans', target: '/banking-finance?section=pilot-loans', bullets: ['Type rating financing', 'Career-based lending', 'Lower rates for high scorers'] },
                { category: 'Banking & Finance', name: 'Mortgage Services', target: '/banking-finance?section=mortgage-services', bullets: ['Airline staff rates', 'Expat mortgages', 'Relocation loans'] },
                { category: 'Banking & Finance', name: 'Credit & Cards', target: '/banking-finance?section=credit-cards', bullets: ['Air miles programs', 'Travel benefits', 'Pilot perks'] },
                { category: 'Banking & Finance', name: 'Investment Planning', target: '/banking-finance?section=investment-planning', bullets: ['Retirement planning', 'Wealth management', 'Tax optimization'] },
            ]
        },
        { name: 'Contact', target: 'contact-support' },
        { name: 'Enterprise', target: '__enterprise_modal__', isBlue: true },
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

    const handleNavClick = (target: string) => {
        if (target === '__enterprise_modal__') {
            setIsEnterpriseModalOpen(true);
            return;
        }
        // External URLs: use full browser redirect
        if (target.startsWith('http://') || target.startsWith('https://')) {
            window.location.href = target;
        }
        // Use page routing for Portal 2 URLs
        else if (target.startsWith('/access-portal-2')) {
            window.location.href = target;
        } else {
            onNavigate(target);
        }
    };

    // Memoized dropdown item component for performance
    const DropdownItem = memo(({ subItem, isActive, onNavigate: nav, setDropdown, onHover }: { 
        subItem: NavSubItem; 
        isActive: boolean; 
        onNavigate: (target: string) => void;
        setDropdown: (val: string | null) => void;
        onHover?: (name: string | null) => void;
    }) => (
        <button
            onClick={(e) => {
                e.stopPropagation();
                nav(subItem.target);
                setDropdown(null);
            }}
            onMouseEnter={() => onHover?.(subItem.name)}
            onMouseLeave={() => onHover?.(null)}
            className={`w-full text-left px-3 py-2 rounded transition-all flex flex-col gap-0.5 ${isActive
                ? subItem.isYellow ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'
                : subItem.isYellow ? 'text-red-600 hover:text-red-700 hover:bg-red-50/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
        >
            <div className="flex items-center gap-1.5">
                {subItem.isYellow && <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>}
                <span className={`text-[0.7rem] font-bold uppercase tracking-wider ${subItem.name.includes('<br') ? '' : 'whitespace-nowrap'} ${subItem.isYellow ? 'text-red-600' : ''}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(subItem.name) }}>
                </span>
            </div>

            {subItem.bullets && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-32 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-0.5">
                        {subItem.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-center gap-1.5 text-[0.6rem] text-slate-500 font-medium tracking-wide">
                                <div className="w-0.5 h-0.5 rounded-full bg-blue-500"></div>
                                {bullet}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </button>
    ));

    // Pre-calculate dropdown layouts for performance
    const dropdownLayouts = useMemo(() => {
        const layouts: Record<string, { cols: number; widthClass: string; gridClass: string; grouped: [string, NavSubItem[]][] }> = {};
        
        navItems.forEach(item => {
            if (!item.subItems) return;
            
            // Calculate columns
            const categories = item.subItems.reduce((acc, subItem) => {
                const category = subItem.category || 'Other';
                if (!acc.includes(category)) acc.push(category);
                return acc;
            }, [] as string[]);
            
            const cols = Math.min(categories.length, 4);
            const widthClass = cols === 1 ? 'min-w-[220px]' : cols === 2 ? 'w-[480px]' : cols === 3 ? 'w-[720px]' : 'w-[960px]';
            const gridClass = cols === 1 ? '' : `grid grid-cols-${cols} gap-4`;
            
            // Group items
            const groupedItems = item.subItems.reduce((acc, subItem) => {
                const category = subItem.category || 'Other';
                if (!acc[category]) acc[category] = [];
                acc[category].push(subItem);
                return acc;
            }, {} as Record<string, NavSubItem[]>);
            
            // Sort categories
            const order = ['Learn About', 'Recognition+', 'General', 'Recognition Profiling', 'Background Check', 'Pilot Insurance', 'Banking & Finance', 'For Pilots', 'For Industry', 'Core Programs', 'Training', 'Resources', 'Special Programs'];
            const sortedEntries = Object.entries(groupedItems).sort(([a], [b]) => {
                const aIndex = order.indexOf(a);
                const bIndex = order.indexOf(b);
                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                if (aIndex !== -1) return -1;
                if (bIndex !== -1) return 1;
                return a.localeCompare(b);
            });
            
            layouts[item.name] = { cols, widthClass, gridClass, grouped: sortedEntries };
        });
        
        return layouts;
    }, []); // navItems is constant, so this only runs once

    // Debounced mouse handlers for performance
    const handleMouseEnterDebounced = useCallback((name: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(name);
        }, 50); // Small delay to prevent rapid toggling
    }, []);

    const handleMouseLeaveDebounced = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
            setActiveSubItem(null);
        }, 100);
    }, []);

    return (
        <>
            <NavigationSchema
                items={[
                    { name: 'Home', url: '/' },
                    { name: 'About', url: '/about' },
                    { name: 'Programs', url: '/programs' },
                    { name: 'Pathways', url: '/pathways-modern' },
                    { name: 'Type Rating Search', url: '/type-rating-search' },
                    { name: 'Airline Expectations', url: '/airline-expectations' },
                    { name: 'Pilot Career Pathways', url: '/pathways-modern' },
                    { name: 'Pilot Recognition', url: '/recognition-plus' },
                    { name: 'Applications', url: '/pilot-recognition' },
                    { name: 'Membership', url: '/become-member' },
                    { name: 'Contact', url: '/contact-support' }
                ]}
                siteName="Pilot Recognition"
                siteUrl="https://pilotrecognition.com"
            />
            <nav
                className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${isLight
                    ? 'bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 shadow-sm'
                    : isDark
                        ? '!bg-transparent backdrop-filter-none py-3 shadow-none'
                        : scrolled
                            ? passedPathwayGrid
                                ? 'bg-gradient-to-b from-black/95 via-black/60 to-transparent backdrop-blur-sm py-3'
                                : 'bg-white border-b border-slate-200 py-3'
                            : 'bg-transparent py-6'
                    }`}>
                <div className="max-w-[1800px] mx-auto px-6 flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onNavigate('home')}>
                        <div className="flex items-baseline transition-all duration-300 group-hover:scale-105">
                            <span
                                className={`${(isLight && passedPathwayGrid) || (isDark && scrolled) || (!passedPathwayGrid && scrolled) ? 'text-black' : 'text-white'
                                    } text-2xl tracking-tight leading-none`}
                                style={{ fontFamily: 'Arial Black, Helvetica Neue, sans-serif' }}
                            >
                                <span className={`${(isLight && passedPathwayGrid) || (isDark && scrolled) || (!passedPathwayGrid && scrolled) ? 'text-black' : 'text-white'}`}>pilot</span>
                                <span className="text-red-600">recognition</span>
                                <span className={`relative ${(isLight && passedPathwayGrid) || (isDark && scrolled) || (!passedPathwayGrid && scrolled) ? 'text-black' : 'text-white'}`}>
                                    .com
                                    {countryCode && (
                                        <sup className={`absolute top-0 -right-2 text-[8px] font-bold leading-none ${(isLight && passedPathwayGrid) || (isDark && scrolled) || (!passedPathwayGrid && scrolled) ? 'text-slate-400' : 'text-white/50'}`}>
                                            {countryCode}
                                        </sup>
                                    )}
                                </span>
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
                                    onClick={() => handleNavClick(item.target)}
                                    className={`text-[0.7rem] font-bold uppercase tracking-[0.1em] transition-all hover:text-blue-400 flex items-center gap-1 whitespace-nowrap ${item.target === 'home' && !forceScrolled
                                        ? isLight || (isDark && scrolled) || (!passedPathwayGrid && scrolled)
                                            ? 'text-blue-600 border-b-2 border-blue-600 pb-1 font-black'
                                            : 'text-blue-400 border-b-2 border-blue-400 pb-1 font-black'
                                        : item.isBlue
                                            ? isLight || (isDark && scrolled) || (!passedPathwayGrid && scrolled)
                                                ? 'text-blue-600 font-black'
                                                : 'text-blue-400 font-black'
                                            : isLight || (isDark && scrolled) || (!passedPathwayGrid && scrolled)
                                                ? 'text-slate-900'
                                                : 'text-white/80'
                                        }`}
                                >
                                    {item.name}
                                    {item.subItems && <ChevronDown className="w-3 h-3" />}
                                </button>

                                {/* Dropdown Menu - Optimized with pre-calculated layouts */}
                                {item.subItems && dropdownLayouts[item.name] && (
                                    <div 
                                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 will-change-transform ${activeDropdown === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}
                                        style={{ transition: 'opacity 200ms ease, transform 200ms ease, visibility 200ms' }}
                                    >
                                        <div className={`bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden ${dropdownLayouts[item.name].widthClass} ${dropdownLayouts[item.name].gridClass}`}>
                                            {dropdownLayouts[item.name].grouped.map(([category, items]) => (
                                                <div key={category} className="space-y-2">
                                                    <h4 className={`text-[0.65rem] font-black uppercase tracking-[0.2em] border-b border-slate-200 pb-2 ${
                                                        category === 'Recognition+' 
                                                            ? 'text-red-600' 
                                                            : isLight ? 'text-slate-500' : 'text-blue-600'
                                                    }`}>
                                                        {category}
                                                    </h4>
                                                    <div className="space-y-1">
                                                        {items.map((subItem, idx) => (
                                                            <DropdownItem
                                                                key={`${category}-${idx}`}
                                                                subItem={subItem}
                                                                isActive={activeSubItem === subItem.name}
                                                                onNavigate={onNavigate}
                                                                setDropdown={setActiveDropdown}
                                                                onHover={setActiveSubItem}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Bottom message for dropdowns with many items */}
                                            {item.name === 'Pathways' && (
                                                <div className="col-span-full mt-4 pt-4 border-t border-slate-200 text-center">
                                                    <p className="text-[0.6rem] text-slate-400 font-medium tracking-wide">
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
                                    onClick={currentUser ? (e) => handleLogout(e) : (onLoginModalOpen || (() => {}))}
                                    className={`${currentUser ? 'bg-slate-700 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2.5 rounded-md text-xs font-bold transition-all shadow-lg hover:shadow-red-500/20 flex items-center gap-1.5 whitespace-nowrap`}
                                >
                                    {currentUser ? 'Sign Out' : 'Get Recognition Free'}
                                </button>

                                {/* Access Portal button - Only show when not logged in */}
                                {!currentUser && (
                                    <button
                                        onClick={onLoginModalOpen || (() => {})}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-xs font-bold transition-all shadow-lg hover:shadow-blue-500/20 flex items-center gap-1.5"
                                    >
                                        Login
                                    </button>
                                )}

                                {/* Access Portal 2 button - Only show when logged in */}
                                {currentUser && (
                                    <button
                                        onClick={() => onNavigate('access-portal-2')}
                                        className="bg-black hover:bg-slate-800 text-white px-4 py-2.5 rounded-md text-xs font-bold transition-all shadow-lg hover:shadow-slate-500/20 flex items-center gap-1.5"
                                    >
                                        Access Portal
                                    </button>
                                )}

                                {/* Graphics Settings Button - Always visible */}
                                <div className="relative group">
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsGraphicsModalOpen(true)}
                                            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all relative"
                                            title="Graphics Settings"
                                        >
                                            <Monitor className="w-5 h-5" />
                                        </button>
                                        {showGraphicsTooltip && (
                                            <div
                                                onClick={() => {
                                                    setShowGraphicsTooltip(false);
                                                    localStorage.setItem('hasSeenGraphicsTooltip', 'true');
                                                    setIsGraphicsModalOpen(true);
                                                }}
                                                className="absolute right-0 top-full mt-2 px-2 py-1.5 bg-white rounded shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300 hover:bg-slate-50 transition-colors cursor-pointer"
                                            >
                                                <p className="text-[10px] text-slate-700 font-medium">
                                                    Adjust graphics
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {currentUser && (
                            <>
                                {/* Notification Bell */}
                                <div className="relative" ref={notificationDropdownRef}>
                                    <button 
                                        onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                                        className={`w-10 h-10 flex items-center justify-center transition-all relative ${isLight || (isDark && scrolled) || (!passedPathwayGrid && scrolled) ? 'text-slate-900 hover:text-slate-700' : 'text-white hover:text-white/80'}`}
                                    >
                                        <Bell className="w-6 h-6" />
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
                                                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                                                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                                                    {notificationCount > 0 && (
                                                        <button
                                                            onClick={markAllAsRead}
                                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                        >
                                                            Mark all as read
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Notifications List */}
                                                <div className="overflow-y-auto flex-1">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-8 text-center">
                                                            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                                            <p className="text-slate-500 text-sm">No notifications yet</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map(notification => (
                                                            <div
                                                                key={notification.id}
                                                                className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-all ${!notification.is_read ? 'bg-blue-50/50' : ''}`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                                                                        {getNotificationIcon(notification.type)}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <h4 className="font-semibold text-slate-900 text-sm">{notification.title}</h4>
                                                                            {!notification.is_read && (
                                                                                <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                                                                            )}
                                                                        </div>
                                                                        <p className="text-slate-600 text-sm mt-1 line-clamp-2">{notification.message}</p>
                                                                        <div className="flex items-center justify-between mt-2">
                                                                            <span className="text-slate-400 text-xs">{formatTimestamp(notification.created_at)}</span>
                                                                            <div className="flex items-center gap-2">
                                                                                {!notification.is_read && (
                                                                                    <button
                                                                                        onClick={() => markAsRead(notification.id)}
                                                                                        className="text-xs text-blue-600 hover:text-blue-700"
                                                                                    >
                                                                                        Mark read
                                                                                    </button>
                                                                                )}
                                                                                {(notification.type === 'cadet_match' || notification.type === 'pathway_match') && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            onNavigate('recognition-career-matches');
                                                                                            setIsNotificationDropdownOpen(false);
                                                                                        }}
                                                                                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                                                                    >
                                                                                        View Pathway
                                                                                    </button>
                                                                                )}
                                                                                {notification.metadata?.action_url && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            window.location.href = notification.metadata.action_url;
                                                                                            setIsNotificationDropdownOpen(false);
                                                                                        }}
                                                                                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                                                                                    >
                                                                                        View
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className="p-3 border-t border-slate-200">
                                                    <button className="w-full text-sm text-slate-600 hover:text-slate-900 text-center py-2">
                                                        View all notifications
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="w-12 h-14 rounded-[50%/40%] bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all hover:scale-105 shadow-lg overflow-hidden"
                                        title="Profile"
                                        style={{ borderRadius: '45% / 50%' }}
                                    >
                                        {profileImageUrl ? (
                                            <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-7" />
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
                                                        onNavigate('recognition-plus');
                                                        setIsProfileDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                                                >
                                                    <User className="w-4 h-4" />
                                                    View Recognition Profile
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsGraphicsModalOpen(true);
                                                        setIsProfileDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                                >
                                                    <Monitor className="w-4 h-4 text-slate-600" />
                                                    <span className="text-sm text-slate-700">Graphics Settings</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onNavigate('pathways-modern-light');
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
                                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all"
                                        title="Settings"
                                    >
                                        <Settings className="w-5 h-5" />
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
                                                        onNavigate('pathways-modern-light');
                                                        setIsSettingsDropdownOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                                >
                                                    <User className="w-4 h-4 text-slate-600" />
                                                    <span className="text-sm text-slate-700">Profile Settings</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onNavigate('recognition-plus');
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
                        {isMenuOpen ? <X className="w-10 h-10" /> : <Menu className="w-10 h-10" />}
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
                            {/* Auth buttons at the top of mobile menu */}
                            {isAuthRestoring ? (
                                <div className="flex flex-col items-center gap-4 mb-8">
                                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm text-slate-600 font-medium">Restoring session...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 mb-8">
                                    <button
                                        onClick={currentUser ? (e) => handleLogout(e) : () => { onNavigate('become-member'); setIsMenuOpen(false); }}
                                        className={`w-full py-4 min-h-[52px] rounded-lg font-bold uppercase tracking-widest text-sm ${currentUser ? 'bg-slate-700 hover:bg-slate-800' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors shadow-lg`}
                                    >
                                        {currentUser ? 'Sign Out' : 'Become a Member'}
                                    </button>

                                    <button
                                        onClick={currentUser ? () => onNavigate('portal') : onLoginModalOpen || (() => {})}
                                        className={`${currentUser ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white w-full py-4 min-h-[52px] rounded-lg text-sm font-bold uppercase tracking-widest shadow-xl`}
                                    >
                                        {currentUser ? 'Access Portal' : 'Login'}
                                    </button>
                                </div>
                            )}

                            {visibleNavItems.map((item) => (
                                <div key={item.name} className="flex flex-col items-center gap-3">
                                    <button
                                        onClick={() => { handleNavClick(item.target); setIsMenuOpen(false); }}
                                        className="text-2xl md:text-3xl font-bold text-white uppercase tracking-widest hover:text-blue-400 transition-colors py-3 px-6 min-h-[48px] min-w-[200px]"
                                    >
                                        {item.name}
                                    </button>
                                    {item.subItems && (
                                        <div className="flex flex-col items-center gap-2 w-full">
                                            {item.subItems.map((subItem) => (
                                                <button
                                                    key={`${subItem.name}-${subItem.target}`}
                                                    onClick={() => { handleNavClick(subItem.target); setIsMenuOpen(false); }}
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

            <GraphicsSettingsModal 
                isOpen={isGraphicsModalOpen}
                onClose={() => setIsGraphicsModalOpen(false)}
            />

            {/* Login Modal - moved to root level */}

            {/* Enterprise Modal */}
            {isEnterpriseModalOpen && (
                <div
                    className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                    onClick={() => setIsEnterpriseModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header bar */}
                        <div className="relative bg-white border-b border-slate-200 px-8 py-6">
                            <button
                                onClick={() => setIsEnterpriseModalOpen(false)}
                                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-blue-500 mb-1.5">For Airlines, ATOs & Operators</p>
                            <h2 className="text-2xl font-bold text-slate-900">
                                <span className="text-slate-900">pilot</span><span className="text-red-600">recognition</span><span className="text-slate-900"> Enterprise</span>
                            </h2>
                            <p className="text-slate-500 text-sm mt-1.5 max-w-lg">
                                Pull verified pilots. Publish pathway requirements. Access the live recognition database.
                            </p>
                        </div>

                        {/* Two full panels side by side */}
                        <div className="grid grid-cols-2 divide-x divide-slate-200 bg-white">
                            {/* Panel 1 — Read More */}
                            <button
                                onClick={() => {
                                    setIsEnterpriseModalOpen(false);
                                    window.open('https://enterprise.pilotrecognition.com', '_blank');
                                }}
                                className="group flex flex-col justify-between p-8 text-left hover:bg-slate-50 transition-all"
                            >
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-5 transition-colors">
                                        <svg className="w-7 h-7 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 mb-2 transition-colors">Learn About Enterprise</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                        Discover how airlines, ATOs, and aviation operators use PilotRecognition to find verified candidates, publish pathway requirements, and access the recognition database.
                                    </p>
                                    <ul className="space-y-2">
                                        {['Pull-based verified pilot recruitment', 'Publish live pathway requirements', 'Access recognition scores & credentials', 'Enterprise API & dashboard access'].map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-xs text-slate-500">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600 group-hover:gap-3 transition-all">
                                    Read More
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </button>

                            {/* Panel 2 — Enterprise Login */}
                            <button
                                onClick={() => {
                                    setIsEnterpriseModalOpen(false);
                                    onNavigate('enterprise-login');
                                }}
                                className="group flex flex-col justify-between p-8 text-left bg-blue-50 hover:bg-blue-100 transition-all"
                            >
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-5 transition-colors">
                                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-blue-900 group-hover:text-blue-700 mb-2 transition-colors">Enterprise Login</h3>
                                    <p className="text-sm text-blue-700/70 leading-relaxed mb-4">
                                        Already have an enterprise account? Sign in to your portal to manage pathways, view verified pilot profiles, and access your recruitment dashboard.
                                    </p>
                                    <ul className="space-y-2">
                                        {['Manage your pathway listings', 'View matched pilot profiles', 'Access your recruitment pipeline', 'Download recognition reports'].map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-xs text-blue-600/70">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-700 group-hover:gap-3 transition-all">
                                    Sign In to Portal
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 border-t border-slate-200 px-8 py-3 flex items-center justify-between">
                            <p className="text-[11px] text-slate-400">
                                Enterprise accounts are separate from pilot accounts.
                            </p>
                            <button
                                onClick={() => { setIsEnterpriseModalOpen(false); onNavigate('contact-support'); }}
                                className="text-[11px] text-blue-500 hover:text-blue-700 font-medium transition-colors"
                            >
                                Contact us to get started →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
