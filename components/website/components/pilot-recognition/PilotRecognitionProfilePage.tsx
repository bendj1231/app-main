import React, { useState, useEffect, useRef, useMemo } from 'react';
import { WalletLoadingScreen } from '../wallet/WalletLoadingScreen';
import { WalletViewPage } from '../wallet/WalletViewPage';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Home, Users, User, Settings, Bell, BookOpen, LogOut, Sun, Moon, Plus } from 'lucide-react';
import { supabase } from '../../../../src/lib/supabase';
import ExaminationResultsPage from './ExaminationResultsPage';
import { DigitalLogbookPage } from './DigitalLogbookPage';
import { PilotLicensureExperiencePage } from './PilotLicensureExperiencePage';
import { DocumentVaultPage } from './DocumentVaultPage';
import { RecognitionScoreDisplay } from '../../../RecognitionScoreDisplay';
import { ScoreOptimizationGuide } from '../../../ScoreOptimizationGuide';
import { RecognitionPlusNotifications } from './RecognitionPlusNotifications';
import { VeremarkVerifiedBadge } from './VeremarkVerifiedBadge';
import { VerificationWalletSection } from './VerificationWalletSection';
import { ATOVerificationRequestSection } from './ATOVerificationRequestSection';
import { PathwayPriority } from './CareerPathwayPriority';
import { useRecognitionScore } from '../../../../src/hooks/useRecognitionScore';
import { useVaultProfile } from '../../../../src/hooks/useVaultProfile';
import { calculateRecognitionScore } from '../../../../lib/pilot-recognition-score';
import { uploadProfileImage } from '../../../../src/lib/cloudinaryClient';
import ProfileImage from '../../../../src/components/ProfileImage';
import { getProfileImageUrl } from '../../../../src/lib/cloudinaryConfig';
import { cleanupOldProfileImage } from '../../../../src/lib/cloudinaryDelete';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '../../../../src/contexts/AuthContext';

interface PilotRecognitionProfilePageProps {
    onNavigate: (page: string) => void;
    onBack?: () => void;
    embedded?: boolean;
    injectedProfile?: any;
    injectedWalletData?: { did: string | null; credentials: any[] };
}

interface RecognitionScore {
    totalRecognition: number;
    breakdown?: any;
}

const CategorySection: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
            <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>{title}</p>
            {description && <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>{description}</p>}
        </div>
        {children}
    </div>
);

export const PilotRecognitionProfilePage: React.FC<PilotRecognitionProfilePageProps> = ({
    onNavigate,
    onBack,
    embedded = false,
    injectedProfile,
    injectedWalletData,
}) => {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showScoreTooltip, setShowScoreTooltip] = useState(false);
    const [selectedScoreCategory, setSelectedScoreCategory] = useState<'all' | 'low' | 'middle' | 'high'>('all');
    const [recommendedPathways, setRecommendedPathways] = useState<any[]>([]);
    const [selectedPathway, setSelectedPathway] = useState<any>(null);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    
    // Navigation state
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const settingsDropdownRef = useRef<HTMLDivElement>(null);
    const notificationDropdownRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [currentDocumentationPage, setCurrentDocumentationPage] = useState<'examination' | 'logbook' | 'licensure' | 'vault' | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [advancedMetricsOpen, setAdvancedMetricsOpen] = useState<'B' | 'L' | 'S' | null>(null);
    const [recognitionScore, setRecognitionScore] = useState<RecognitionScore | null>(null);
    const [loadingScore, setLoadingScore] = useState(false);
    const [scoreError, setScoreError] = useState<string | null>(null);
    const { score: recognitionScoreData, loading: scoreDataLoading } = useRecognitionScore();
    const { readProfile } = useVaultProfile();
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [isPremium, setIsPremium] = useState(false);
    const [showWalletGate, setShowWalletGate] = useState(false);
    const [showWalletView, setShowWalletView] = useState(false);
    const { currentUser } = useAuth();

    // Check subscription status using auth context user (avoids lock race)
    useEffect(() => {
        if (!currentUser?.id) {
            console.log('[DEBUG] No authenticated user yet, skipping subscription check');
            return;
        }

        let cancelled = false;
        const checkSubscription = async () => {
            console.log('[DEBUG] Starting subscription check for user:', currentUser.id);
            try {
                const { data: subscriptions, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .eq('status', 'active');
                
                if (cancelled) return;
                console.log('[DEBUG] Subscriptions query result:', { subscriptions, error });
                
                if (error) {
                    console.error('[DEBUG] Subscription query error:', error);
                    return;
                }
                
                const hasActiveSubscription = subscriptions && subscriptions.length > 0;
                console.log('[DEBUG] Has active subscription:', hasActiveSubscription, 'Count:', subscriptions?.length);
                setIsPremium(hasActiveSubscription);
            } catch (error) {
                console.error('[DEBUG] Error in checkSubscription:', error);
                // Don't reset isPremium on error - keep previous state
            }
        };
        checkSubscription();

        return () => { cancelled = true; };
    }, [currentUser?.id]);

    // Debug isPremium changes
    useEffect(() => {
        console.log('[DEBUG] isPremium state changed to:', isPremium);
    }, [isPremium]);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('pilot-recognition-theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Save theme to localStorage when changed
    const toggleTheme = (newTheme: 'dark' | 'light') => {
        setTheme(newTheme);
        localStorage.setItem('pilot-recognition-theme', newTheme);
    };

    // Filter pathways based on pathway match percentage (how well pathway matches user's profile)
    const filteredPathways = useMemo(() => {
        const wingmentorCard = recommendedPathways.find(p => p.id === 'wingmentor-intro');
        const otherPathways = recommendedPathways.filter(p => p.id !== 'wingmentor-intro');
        
        
        const filteredOthers = otherPathways.filter(pathway => {
            if (selectedScoreCategory === 'all') return true;
            if (selectedScoreCategory === 'low') return pathway.matchPercentage < 50;
            if (selectedScoreCategory === 'middle') {
                const matches = pathway.matchPercentage >= 50 && pathway.matchPercentage <= 69;
                return matches;
            }
            if (selectedScoreCategory === 'high') {
                const matches = pathway.matchPercentage >= 70;
                return matches;
            }
            return true;
        });
        
        if (selectedScoreCategory === 'middle' || selectedScoreCategory === 'high') {
        }
        
        // Sort by match percentage (highest to lowest)
        const sortedOthers = filteredOthers.sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        return wingmentorCard ? [wingmentorCard, ...sortedOthers] : sortedOthers;
    }, [recommendedPathways, selectedScoreCategory]);

    // Initialize selected pathway to the first one (skip wingmentor-intro)
    useEffect(() => {
        if (filteredPathways.length > 0 && !selectedPathway) {
            const firstSelectable = filteredPathways.find(p => p.id !== 'wingmentor-intro');
            if (firstSelectable) {
                setSelectedPathway(firstSelectable);
            }
        }
    }, [filteredPathways]);

    // Debug carousel ref
    useEffect(() => {
        if (carouselRef.current) {
        }
    }, [recommendedPathways]);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;
        
        const container = carouselRef.current;
        const cardWidth = 600; // increased card width
        const gap = 24; // 1.5rem in pixels
        const cardTotalWidth = cardWidth + gap;
        
        const containerCenter = container.scrollLeft + container.clientWidth / 2;
        const cards = container.children;
        
        let currentCenteredIndex = 0;
        let closestDistance = Infinity;
        
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                currentCenteredIndex = i;
            }
        }
        
        const targetIndex = direction === 'left' 
            ? Math.max(0, currentCenteredIndex - 1)
            : Math.min(recommendedPathways.length - 1, currentCenteredIndex + 1);
        
        const targetCard = cards[targetIndex] as HTMLElement;
        const targetScroll = targetCard.offsetLeft - (container.clientWidth / 2) + (targetCard.offsetWidth / 2);
        
        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
        
        // Immediately update selected pathway (skip wingmentor-intro)
        const targetPathway = recommendedPathways[targetIndex];
        if (targetPathway && targetPathway.id !== 'wingmentor-intro') {
            setSelectedPathway(targetPathway);
        }
    };

    const handleScroll = () => {
        if (!carouselRef.current) return;
        
        const container = carouselRef.current;
        const containerCenter = container.scrollLeft + container.clientWidth / 2;
        const cards = container.children;
        
        // Check if scrolled to the end - force select last card
        const isScrolledToEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
        
        if (isScrolledToEnd && cards.length > 0) {
            const lastCard = cards[cards.length - 1] as HTMLElement;
            const cardIndex = cards.length - 1;
            if (cardIndex >= 0 && cardIndex < recommendedPathways.length) {
                const newSelectedPathway = recommendedPathways[cardIndex];
                if (newSelectedPathway && newSelectedPathway.id !== selectedPathway?.id && newSelectedPathway.id !== 'wingmentor-intro') {
                    setSelectedPathway(newSelectedPathway);
                }
            }
            return;
        }
        
        // Check if scrolled to the start - force select first card
        const isScrolledToStart = container.scrollLeft <= 10;
        
        if (isScrolledToStart && cards.length > 0) {
            const firstCard = cards[0] as HTMLElement;
            const cardIndex = 0;
            if (cardIndex >= 0 && cardIndex < recommendedPathways.length) {
                const newSelectedPathway = recommendedPathways[cardIndex];
                if (newSelectedPathway && newSelectedPathway.id !== selectedPathway?.id && newSelectedPathway.id !== 'wingmentor-intro') {
                    setSelectedPathway(newSelectedPathway);
                }
            }
            return;
        }
        
        // Otherwise, find the closest centered card
        let closestCard = null;
        let closestDistance = Infinity;
        
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCard = card;
            }
        }
        
        if (closestCard) {
            const cardIndex = Array.from(cards).indexOf(closestCard);
            if (cardIndex >= 0 && cardIndex < recommendedPathways.length) {
                const newSelectedPathway = recommendedPathways[cardIndex];
                if (newSelectedPathway && newSelectedPathway.id !== selectedPathway?.id && newSelectedPathway.id !== 'wingmentor-intro') {
                    setSelectedPathway(newSelectedPathway);
                }
            }
        }
    };

    // Debounced scroll handler with shorter delay for better responsiveness
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const debouncedHandleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleScroll, 50); // Reduced from 100ms to 50ms
        };
        
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', debouncedHandleScroll);
        }
        
        return () => {
            if (carousel) {
                carousel.removeEventListener('scroll', debouncedHandleScroll);
            }
            clearTimeout(timeoutId);
        };
    }, [recommendedPathways, selectedPathway]);

    // Snap to center on scroll end
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const carousel = carouselRef.current;
        
        if (!carousel) return;

        const handleScrollEnd = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const containerCenter = carousel.scrollLeft + carousel.clientWidth / 2;
                const cards = carousel.children;
                
                let closestCard = null;
                let closestDistance = Infinity;
                
                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i] as HTMLElement;
                    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                    const distance = Math.abs(containerCenter - cardCenter);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestCard = card;
                    }
                }
                
                if (closestCard && closestDistance > 50) { // Only snap if more than 50px off center
                    const cardCenter = closestCard.offsetLeft + closestCard.offsetWidth / 2;
                    const targetScroll = cardCenter - carousel.clientWidth / 2;
                    carousel.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                    });
                }
            }, 150); // Wait 150ms after scroll stops before snapping
        };

        carousel.addEventListener('scroll', handleScrollEnd);
        
        return () => {
            carousel.removeEventListener('scroll', handleScrollEnd);
            clearTimeout(timeoutId);
        };
    }, [recommendedPathways]);

    const checkRequirements = (pathway: any) => {
        if (!pathway.requirements || !profileData) return pathway.requirements.map((req: any) => ({ ...req, met: false, reason: 'Profile data not available' }));

        const userHours = profileData.total_hours || 0;
        const userLicense = profileData.license_type || '';
        const userMedical = profileData.medical_status || '';

        return pathway.requirements.map((req: any) => {
            let met = false;
            let reason = '';

            // Preferred requirements are always considered met (optional)
            if (req.isPreferred) {
                met = true;
                reason = 'Optional - not required';
            } else if (req.type === 'hours') {
                met = userHours >= req.minHours;
                reason = met ? 'You have sufficient hours' : `You need ${req.minHours} hours, currently have ${userHours}`;
            } else if (req.type === 'license') {
                met = userLicense.toLowerCase().includes(req.id.toLowerCase()) || userHours >= req.minHours;
                reason = met ? 'License requirement met' : `Missing ${req.label}`;
            } else if (req.type === 'medical') {
                met = userMedical.toLowerCase().includes('valid') || userMedical.toLowerCase().includes('class');
                reason = met ? 'Medical certificate valid' : 'Medical certificate not valid or expired';
            } else {
                // For ratings and certifications, assume not met for now
                met = false;
                reason = `Missing ${req.label}`;
            }

            return { ...req, met, reason };
        });
    };

    const groupRequirementsByCategory = (requirements: any[]) => {
        const categories: { [key: string]: any[] } = {
            'Flight Hours': [],
            'Licenses': [],
            'Medical': [],
            'Certifications': [],
            'Type Ratings': [],
            'Other': []
        };

        requirements.forEach(req => {
            switch (req.type) {
                case 'hours':
                    categories['Flight Hours'].push(req);
                    break;
                case 'license':
                    categories['Licenses'].push(req);
                    break;
                case 'medical':
                    categories['Medical'].push(req);
                    break;
                case 'rating':
                    categories['Type Ratings'].push(req);
                    break;
                case 'cert':
                    categories['Certifications'].push(req);
                    break;
                default:
                    categories['Other'].push(req);
            }
        });

        return categories;
    };

    const getCategoryAccountComparison = (category: string, requirements: any[]) => {
        if (!profileData) return 'Profile data not available';

        switch (category) {
            case 'Flight Hours':
                return `Your account shows: ${profileData.total_hours || 0} total flight hours`;
            case 'Licenses':
                return `Your account shows: ${profileData.license_type || 'No license on file'}`;
            case 'Medical':
                return `Your account shows: ${profileData.medical_status || 'No medical certificate on file'}`;
            case 'Certifications':
                return `Your account shows: ${profileData.certifications?.length || 0} certifications on file`;
            case 'Type Ratings':
                return `Your account shows: ${profileData.type_ratings?.length || 0} type ratings on file`;
            default:
                return 'Check your profile for details';
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    // Handle click outside for dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
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

    // Profile image upload using Cloudinary (free tier)
    // Zero edge function invocations - client-side upload directly to Cloudinary
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profileData?.user_id) return;

        setUploadingImage(true);
        try {
            // Store old public_id for deletion after successful upload
            const oldPublicId = profileData?.profile_image_public_id;

            // Upload directly to Cloudinary (no edge function!)
            const result = await uploadProfileImage(file, profileData.user_id);

            if (!result.success) {
                throw new Error(result.error || 'Upload failed');
            }

            // Update profile with new image URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ 
                    profile_image_url: result.url,
                    profile_image_public_id: result.publicId,
                })
                .eq('id', profileData.user_id);

            if (updateError) throw updateError;

            // Update local state immediately so new image displays
            setProfileData(prev => prev ? {
                ...prev,
                profile_image_url: result.url,
                profile_image_public_id: result.publicId,
            } : null);

            console.log('✅ Profile image uploaded to Cloudinary:', result.publicId);

            // Delete old image from Cloudinary (non-blocking)
            if (oldPublicId && oldPublicId !== result.publicId) {
                await cleanupOldProfileImage(oldPublicId);
            }
        } catch (err: any) {
            console.error('❌ Error uploading image:', err);
            alert('Failed to upload image: ' + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const fetchProfileData = async () => {
        try {
            // If injected profile from Auth0 wallet — use it directly
            if (injectedProfile) {
                const isCiphertext = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
                
                // Attempt to decrypt if we have encrypted fields
                let decryptedProfile = { ...injectedProfile };
                if (injectedProfile.id && isCiphertext(injectedProfile.full_name)) {
                    try {
                        const { data: vaultData } = await readProfile(injectedProfile.id);
                        if (vaultData) {
                            decryptedProfile = { ...injectedProfile, ...vaultData };
                        }
                    } catch (vaultErr) {
                        console.warn('[PROFILE] Vault decryption failed, using raw data:', vaultErr);
                    }
                }
                
                // Fix encrypted full_name for injected profile — prefer display_name (always plain text)
                const isCiphertextInj = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
                let injectedFullName = '';
                if (decryptedProfile.display_name && !isCiphertextInj(decryptedProfile.display_name)) {
                    injectedFullName = decryptedProfile.display_name;
                } else if (decryptedProfile.full_name && !isCiphertextInj(decryptedProfile.full_name)) {
                    injectedFullName = decryptedProfile.full_name;
                } else {
                    injectedFullName = 'Pilot';
                }

                const injLicenseType = (decryptedProfile.license_types?.length > 0 ? decryptedProfile.license_types.join(', ') : null)
                    || decryptedProfile.current_occupation || 'None';

                const merged = {
                    ...decryptedProfile,
                    user_id: decryptedProfile.id,
                    total_hours: decryptedProfile.total_flight_hours || 0,
                    recent_flight_experience: 'N/A',
                    overall_recognition_score: decryptedProfile.recognition_score || 0,
                    recognition_score: decryptedProfile.recognition_score || 0,
                    license_type: injLicenseType,
                    license_authority: decryptedProfile.license_issuing_authority || decryptedProfile.country_of_license || '',
                    medical_status: 'None',
                    pathway_interests: decryptedProfile.pathway_interests || [],
                    certifications: decryptedProfile.certifications || [],
                    type_ratings: decryptedProfile.aircraft_types || [],
                    enrolled_programs: decryptedProfile.enrolled_programs || [],
                    full_name: injectedFullName,
                    display_name: decryptedProfile.display_name || '',
                    profile_image_url: decryptedProfile.profile_image_url || '',
                    wallet_did: injectedWalletData?.did || decryptedProfile.wallet_did || null,
                    wallet_credentials: injectedWalletData?.credentials || [],
                };
                setProfileData(merged);
                setLoading(false);
                return;
            }

            // Fetch user's profile data directly from Supabase
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                console.warn('[PROFILE] No Supabase session — waiting for injected profile');
                setLoading(false);
                return;
            }
            
            
            // Fetch profile data from pilot_recognition_matches table
            const { data: profileData, error: profileError } = await supabase
                .from('pilot_recognition_matches')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();
            
            // Fetch profile image and basic user data from profiles table (with vault decryption)
            const { data: profileImage, error: imageError } = await supabase
                .from('profiles')
                .select('profile_image_url, profile_image_public_id, full_name, display_name, email, current_flight_hours, overall_recognition_score, license_id, country_of_license, license_issuing_authority, ratings, license_types, current_occupation, profile_token, profile_token_generated_at, auth0_id, elp_level')
                .eq('id', user.id)
                .maybeSingle();
            
            // Decrypt profile data using vault
            let decryptedProfileImage = profileImage;
            if (profileImage) {
                try {
                    const { data: vaultData } = await readProfile(user.id);
                    if (vaultData) {
                        decryptedProfileImage = { ...profileImage, ...vaultData };
                    }
                } catch (vaultErr) {
                    console.warn('[PROFILE] Vault decryption failed for profile fetch:', vaultErr);
                }
            }
            
            
            if (profileError) {
                console.error('[ERROR] Profile fetch error:', profileError);
                // Don't throw error, continue with profiles data
            }
            
            // Provide default values if no profile exists, and merge with profiles table data
            // Use decrypted profile data if available
            const sourceProfile = decryptedProfileImage || profileImage;
            
            // Prefer display_name (always plain text) over full_name (may be AES-encrypted)
            const isCiphertext = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
            let resolvedFullName = '';
            if (sourceProfile?.display_name && !isCiphertext(sourceProfile.display_name)) {
                resolvedFullName = sourceProfile.display_name;
            } else if (sourceProfile?.full_name && !isCiphertext(sourceProfile.full_name)) {
                resolvedFullName = sourceProfile.full_name;
            } else {
                resolvedFullName = 'Pilot';
            }
            
            const finalProfileData = {
                ...{
                    user_id: user.id,
                    total_hours: 0,
                    recent_flight_experience: 'N/A',
                    overall_recognition_score: 0,
                    recognition_score: 0,
                    license_type: 'None',
                    medical_status: 'None',
                    pathway_interests: [],
                    certifications: [],
                    type_ratings: [],
                    profile_image_url: '',
                    first_name: '',
                    last_name: '',
                    full_name: '',
                    email: '',
                    current_occupation: ''
                },
                ...profileData,
                // Override with profiles table data if pilot_recognition_matches is empty
                ...(sourceProfile && !profileData ? {
                    full_name: resolvedFullName,
                    first_name: resolvedFullName.split(' ')[0] || '',
                    last_name: resolvedFullName.split(' ').slice(1).join(' ') || '',
                    email: sourceProfile.email || user.email || '',
                    total_hours: sourceProfile.current_flight_hours || 0,
                    overall_recognition_score: sourceProfile.overall_recognition_score || 0,
                    current_occupation: sourceProfile.current_occupation || 'STUDENT PILOT',
                    license_type: (sourceProfile.license_types?.length > 0 ? sourceProfile.license_types.join(', ') : null) || sourceProfile.current_occupation || 'None',
                    license_authority: sourceProfile.license_issuing_authority || sourceProfile.country_of_license || '',
                    license_id: sourceProfile.license_id || '',
                    country_of_license: sourceProfile.country_of_license || '',
                    type_ratings: sourceProfile.ratings || []
                } : {}),
                // Always include profile image, name and license data from profiles table
                ...(sourceProfile ? {
                    full_name: resolvedFullName,
                    profile_image_url: sourceProfile.profile_image_url || '',
                    profile_image_public_id: sourceProfile.profile_image_public_id || '',
                    license_type: (sourceProfile.license_types?.length > 0 ? sourceProfile.license_types.join(', ') : null) || sourceProfile.current_occupation || 'None',
                    license_authority: sourceProfile.license_issuing_authority || sourceProfile.country_of_license || '',
                    license_id: sourceProfile.license_id || '',
                    country_of_license: sourceProfile.country_of_license || '',
                    type_ratings: sourceProfile.ratings || [],
                    english_proficiency_level: sourceProfile.elp_level || ''
                } : {})
            };
            
            
            setProfileData(finalProfileData);
            // Use decrypted profile image from profiles table first, then fall back to pilot_recognition_matches
            // Call Supabase Edge Function to calculate pathway matches
            const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
            const edgeFunctionUrl = `${supabaseUrl}/functions/v1/calculate-pathway-matches`;
            
            
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;
            
            
            const edgeFunctionResponse = await fetch(edgeFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken || ''}`,
                },
                body: JSON.stringify({ profileData: finalProfileData }),
            });
            
            
            if (!edgeFunctionResponse.ok) {
                const errorText = await edgeFunctionResponse.text();
                console.error('[ERROR] Edge Function error response:', errorText);
                throw new Error(`Edge Function returned ${edgeFunctionResponse.status}: ${errorText}`);
            }
            
            const pathwaysData = await edgeFunctionResponse.json();
            
            if (pathwaysData.pathways) {
                setRecommendedPathways(pathwaysData.pathways);
            } else {
                console.error('[ERROR] No pathways in response:', pathwaysData);
            }

            // Extract recognition score from Edge Function response
            if (pathwaysData.recognitionProfile) {
                setRecognitionScore({
                    totalRecognition: pathwaysData.recognitionProfile.recognition_score || pathwaysData.recognitionProfile.overall_recognition_score || 0,
                    breakdown: pathwaysData.recognitionProfile.breakdown
                });
            }
        } catch (error: any) {
            console.error('[ERROR] Error in fetchProfileData:', error);
            console.error('[ERROR] Error name:', error?.name);
            console.error('[ERROR] Error message:', error?.message);
            console.error('[ERROR] Error stack:', error?.stack);
            // Fallback to empty pathways if Edge Function fails
            setRecommendedPathways([]);
        } finally {
            setLoading(false);
        }
    };

    const baseCardStyle: React.CSSProperties = {
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)'
    };

    if (loading) {
        return (
            <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
                <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
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
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(100,116,139,0.2), rgba(30,41,59,0.35), rgba(15,23,42,0.6))' }} />
                    <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(3px)', background: 'rgba(15,23,42,0.1)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
                </div>
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                            width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.2)', 
                            borderTopColor: '#3b82f6', borderRadius: '50%', 
                            animation: 'spin 1s linear infinite', margin: '0 auto'
                        }}></div>
                        <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Loading your recognition profile...</p>
                    </div>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const pilotName = profileData?.full_name || 'Pilot Profile';
    const initials = pilotName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div 
            style={{ position: 'relative', minHeight: embedded ? 'auto' : '100vh', overflow: embedded ? 'visible' : 'hidden' }}
            className={theme === 'light' ? 'light-theme' : 'dark-theme'}
            data-theme={theme}
        >
            {/* Responsive styles for mobile */}
            <style>{`
                @media (max-width: 768px) {
                    .pilot-data-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .quick-stats-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 0.75rem !important;
                    }
                    .quick-stats-grid > div:last-child {
                        grid-column: 1 / -1 !important;
                    }
                }
                @media (max-width: 480px) {
                    .quick-stats-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
            {/* MeshGradient Background - Same as Portal 2 */}
            {!embedded && <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
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
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(100,116,139,0.2), rgba(30,41,59,0.35), rgba(15,23,42,0.6))' }} />
                <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(3px)', background: 'rgba(15,23,42,0.1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
            </div>}
            <main style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: embedded ? '100%' : '1200px', margin: embedded ? '0' : '0 auto', minHeight: embedded ? 'auto' : '100vh' }}>
                {/* Portal 2 Navigation Bar */}
                {!embedded && <div
                    className="relative z-50 flex items-center justify-between px-4 py-2"
                    style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {/* Left - Navigation Items */}
                    <div className="flex items-center">
                        {[
                            { id: 'welcome', label: 'WELCOME', icon: Home },
                            { id: 'profile', label: 'PROFILE', icon: null },
                            { id: 'pathways', label: 'PATHWAYS', icon: null },
                            { id: 'marketplace', label: 'NEWS ROOM', icon: null },
                            { id: 'options', label: 'OPTIONS', icon: null },
                        ].map((item) => {
                            const Icon = item.icon;
                            const isActive = item.id === 'profile';
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.id === 'welcome') {
                                            onNavigate('home');
                                        } else if (item.id === 'profile') {
                                            // Stay on current page
                                        } else if (item.id === 'pathways') {
                                            onNavigate('access-portal-2');
                                        } else {
                                            onNavigate(item.id);
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
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="w-12 h-14 rounded-[50%/40%] bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all hover:scale-105 shadow-lg overflow-hidden"
                                title="Profile"
                                style={{ borderRadius: '45% / 50%' }}
                            >
                                <ProfileImage
                                    url={profileData?.profile_image_url}
                                    publicId={profileData?.profile_image_public_id}
                                    name={profileData?.full_name}
                                    size={48}
                                    className="w-full h-full"
                                    fallbackClassName="rounded-[45%/50%] bg-slate-100 text-slate-700 text-lg"
                                />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                                        <div className="p-4 border-b border-slate-200">
                                            <h3 className="font-semibold text-slate-900">{profileData?.full_name || 'Pilot'}</h3>
                                            <p className="text-xs text-slate-500">{profileData?.license_type || 'Student Pilot'}</p>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                            >
                                                <User className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm text-slate-700">View Profile</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onNavigate('access-portal-2?tab=programs');
                                                    setIsProfileDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                            >
                                                <BookOpen className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm text-slate-700">My Programs</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsProfileDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                            >
                                                <Settings className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm text-slate-700">Settings</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Handle logout
                                                    setIsProfileDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4 text-slate-600" />
                                                <span className="text-sm text-slate-700">Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
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
                                            <div className="border-t border-slate-200 my-2"></div>
                                            <div className="px-3 py-2">
                                                <p className="text-xs text-slate-500 mb-2">Theme</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            toggleTheme('light');
                                                            setIsSettingsDropdownOpen(false);
                                                        }}
                                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                    >
                                                        <Sun className="w-4 h-4" />
                                                        <span className="text-sm">Light</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            toggleTheme('dark');
                                                            setIsSettingsDropdownOpen(false);
                                                        }}
                                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                    >
                                                        <Moon className="w-4 h-4" />
                                                        <span className="text-sm">Dark</span>
                                                    </button>
                                                </div>
                                            </div>
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
                </div>}

                {/* Recognition Score Display */}
                <div style={{ padding: '1rem 1.5rem 0', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                        {recognitionScoreData ? (
                            <ScoreOptimizationGuide
                                currentScore={calculateRecognitionScore({
                                    stats: {
                                        totalHours: profileData?.total_hours || 0,
                                        picHours: profileData?.pic_hours || 0,
                                        ifrHours: profileData?.ifr_hours || 0,
                                        nightHours: profileData?.night_hours || 0,
                                    },
                                    experience: {
                                        years: profileData?.experience_years || 0,
                                        achievements: profileData?.certifications?.length || 0,
                                        licenses: profileData?.type_ratings?.length || 0,
                                    },
                                    assessments: {
                                        programCompletion: 0,
                                        performanceScore: profileData?.overall_recognition_score || 0,
                                    },
                                    mentorship: {
                                        hours: 0,
                                        observations: 0,
                                        cases: 0,
                                    },
                                })}
                                isPremium={isPremium}
                                userId={profileData?.user_id}
                                limit={3}
                                onViewAll={() => onNavigate('score-optimization')}
                                onNavigate={onNavigate}
                            />
                        ) : null}
                </div>

                {/* ── WALLET GATE OVERLAY ── */}
                {showWalletGate && (
                    <WalletLoadingScreen
                        onComplete={() => {
                            setShowWalletGate(false);
                            setShowWalletView(true);
                        }}
                    />
                )}

                {/* ── WALLET VIEW PAGE (post-auth) ── */}
                {showWalletView && (
                    <WalletViewPage
                        userId={currentUser?.id}
                        onBack={() => setShowWalletView(false)}
                    />
                )}

                {/* ── ACCESS WALLET BANNER ── */}
                <div style={{ padding: '1.5rem clamp(1.5rem, 4vw, 3.5rem) 0' }}>
                    <div style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}>
                        {/* Red top bar */}
                        <div style={{ height: 4, background: '#dc2626' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem', flexWrap: 'wrap' }}>
                            {/* Icon */}
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                            </div>

                            {/* Text */}
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#dc2626', textTransform: 'uppercase', marginBottom: 4 }}>
                                    Pilot Credential Vault
                                </p>
                                <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 4 }}>
                                    Access Your Wallet
                                </p>
                                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                                    Enter credentials, upload verification documents, and build your Pre-Cleared profile — zero-knowledge, pilot-owned.
                                </p>
                            </div>

                            {/* Status pills */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', flexShrink: 0 }} />
                                    <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                        {profileData?.verification_status || 'Unverified'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AES-256-GCM</span>
                                </div>
                            </div>

                            {/* CTA button */}
                            <button
                                onClick={() => setShowWalletGate(true)}
                                style={{
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 24px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#b91c1c'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#dc2626'; }}
                            >
                                Open Wallet
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <section style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <CategorySection title="Pilot Data" description="Identity, credentials, flight activity, and core hour summaries">
                            <div className="pilot-data-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
                                {/* Profile Card */}
                                <div style={{ ...baseCardStyle, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            backgroundColor: '#0f172a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 1rem',
                                            fontSize: '2rem',
                                            fontWeight: 600,
                                            color: 'white',
                                            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.25), 0 0 0 3px rgba(37, 99, 235, 0.5)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        title="Click to upload profile image"
                                        >
                                            {uploadingImage ? (
                                                <div style={{ color: 'white', fontSize: '0.75rem', textAlign: 'center' }}>Uploading...</div>
                                            ) : (
                                                <>
                                                    <ProfileImage
                                                        url={profileData?.profile_image_url}
                                                        publicId={profileData?.profile_image_public_id}
                                                        name={profileData?.full_name}
                                                        size={100}
                                                        className="w-full h-full"
                                                        fallbackClassName="rounded-full bg-slate-900 text-white text-2xl"
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: 'rgba(0,0,0,0.5)',
                                                        display: profileData?.profile_image_url ? 'flex' : 'none',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s ease',
                                                        fontSize: '0.75rem',
                                                        color: 'white'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                                    >
                                                        Change
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.25rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>{pilotName}</h2>
                                        <p style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, letterSpacing: '0.18em', marginBottom: '0.2rem' }}>
                                            {(() => {
                                                const license = profileData?.license_type || '';
                                                const licenseLower = license.toLowerCase();
                                                let highestLicense = '';
                                                let licenseNumber = '';

                                                // Check in order of ranking: CPL > PPL > SPL
                                                if (licenseLower.includes('cpl')) {
                                                    highestLicense = 'CPL';
                                                } else if (licenseLower.includes('ppl')) {
                                                    highestLicense = 'PPL';
                                                } else if (licenseLower.includes('spl')) {
                                                    highestLicense = 'SPL';
                                                }

                                                // Build license display string
                                                let licenseDisplay = '';
                                                if (highestLicense) {
                                                    licenseDisplay = highestLicense;
                                                }

                                                // Add country of license if available
                                                if (profileData?.country_of_license) {
                                                    licenseDisplay += ` (${profileData.country_of_license})`;
                                                }

                                                // Add expiration date if available
                                                if (profileData?.license_expiration) {
                                                    const expDate = new Date(profileData.license_expiration);
                                                    const formattedDate = expDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                                    licenseDisplay += ` • Exp: ${formattedDate}`;
                                                }

                                                // Add recurrency if available
                                                if (profileData?.recurrency_date) {
                                                    const recDate = new Date(profileData.recurrency_date);
                                                    const formattedDate = recDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                                    licenseDisplay += ` • Rec: ${formattedDate}`;
                                                }

                                                // Add CFI prof check date if CFI is mentioned
                                                if (licenseLower.includes('cfi') && profileData?.prof_check_date) {
                                                    const profDate = new Date(profileData.prof_check_date);
                                                    const formattedDate = profDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                                    licenseDisplay += ` • Prof: ${formattedDate}`;
                                                }

                                                // Add ratings and certifications
                                                const additionalInfo = [];
                                                if (profileData?.type_ratings?.length > 0) {
                                                    additionalInfo.push(`${profileData.type_ratings.length} Ratings`);
                                                }
                                                if (profileData?.certifications?.length > 0) {
                                                    additionalInfo.push(`${profileData.certifications.length} Certs`);
                                                }

                                                if (licenseDisplay && additionalInfo.length > 0) {
                                                    licenseDisplay += ' • ' + additionalInfo.join(' • ');
                                                } else if (!licenseDisplay && additionalInfo.length > 0) {
                                                    licenseDisplay = additionalInfo.join(' • ');
                                                }

                                                return licenseDisplay || 'No Licenses';
                                            })()}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            {profileData?.email || 'No email provided'}
                                        </p>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', width: '100%' }}>
                                        {[
                                            { label: 'Flight Hours', value: profileData?.total_hours || 0, unverified: true },
                                            { label: 'Recognition Score', value: profileData?.overall_recognition_score || 0 }
                                        ].map(tile => (
                                            <div key={tile.label} style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase' }}>{tile.label}</p>
                                                <p style={{ margin: '0.35rem 0 0', fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>{tile.value}</p>
                                                {tile.unverified && <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', fontWeight: 500, color: '#f59e0b' }}>(unverified)</p>}
                                                {tile.unverified && <button onClick={() => setCurrentDocumentationPage('logbook')} style={{ marginTop: '0.25rem', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', padding: 0, margin: '0.25rem 0 0 0', fontSize: '0.65rem', fontWeight: 500 }}>verify your flight hours</button>}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            {profileData?.enrolled_programs?.includes('Foundational') && (
                                                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, padding: '0.25rem 0.75rem', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '999px' }}>
                                                    Foundation Program
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Credentials Card */}
                                <div style={{ ...baseCardStyle, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Pilot Credentials</h3>
                                        <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Licensing, hours, and access pass</p>
                                        <button
                                            onClick={() => onNavigate('pilot-licensure-experience')}
                                            style={{
                                                marginTop: '0.5rem',
                                                padding: '0',
                                                background: 'none',
                                                border: 'none',
                                                color: '#2563eb',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                textAlign: 'left',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.textDecoration = 'underline'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.textDecoration = 'none'; }}
                                        >
                                            view details on licensure →
                                        </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
                                        {(() => {
                                            const tileData = (() => {
                                            const license = profileData?.license_type || '';
                                            const licenseLower = license.toLowerCase();
                                            let highestLicense = 'None';
                                            
                                            // Check in order of ranking: ATPL > CPL > PPL > SPL
                                            if (licenseLower.includes('atpl') || licenseLower.includes('airline')) {
                                                highestLicense = 'ATPL';
                                            } else if (licenseLower.includes('cpl') || licenseLower.includes('commercial')) {
                                                highestLicense = 'CPL';
                                            } else if (licenseLower.includes('ppl') || licenseLower.includes('private')) {
                                                highestLicense = 'PPL';
                                            } else if (licenseLower.includes('spl') || licenseLower.includes('student')) {
                                                highestLicense = 'SPL';
                                            } else if (license && license !== 'None') {
                                                highestLicense = license;
                                            }

                                            const tiles = [
                                                { label: 'License Type', value: highestLicense },
                                                { label: 'License Authority', value: profileData?.license_authority || profileData?.country_of_license || '' },
                                                { label: 'English Level', value: profileData?.english_proficiency_level || profileData?.elp_level || '' },
                                                { label: 'Pilot Status', value: profileData?.career_stage || profileData?.current_occupation || '' }
                                            ] as { label: string; value: string }[];
                                            const licenseVerified = !!(profileData?.license_id || profileData?.license_status);
                                            return { tiles, licenseVerified, licenseId: profileData?.license_id || '', licenseStatus: profileData?.license_status || '' };
                                            })();
                                            return (
                                            <>
                                            {/* Merged Recognition+ tile for License Number + Status */}
                                            {!tileData.licenseVerified ? (
                                                <div style={{ gridColumn: '1 / -1', background: 'rgba(239,68,68,0.06)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(239,68,68,0.25)', textAlign: 'center' }}>
                                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.65rem', color: '#f87171', letterSpacing: '0.1em' }}>LICENSE NUMBER &amp; STATUS</p>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', letterSpacing: '0.05em' }}>Recognition+</span>
                                                        <span style={{ fontSize: '0.6rem', color: 'rgba(239,68,68,0.6)' }}>Upgrade to verify &amp; display your licence details</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em' }}>LICENSE NUMBER</p>
                                                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{tileData.licenseId || 'N/A'}</p>
                                                </div>
                                                <div style={{ background: 'rgba(30,41,59,0.6)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em' }}>LICENSE STATUS</p>
                                                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{tileData.licenseStatus || 'N/A'}</p>
                                                </div>
                                                </>
                                            )}
                                            {tileData.tiles.map(tile => (
                                            <div key={tile.label} style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
                                                <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em' }}>{tile.label}</p>
                                                {tile.value ? (
                                                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{tile.value}</p>
                                                ) : (
                                                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>N/A</p>
                                                )}
                                            </div>
                                            ))}
                                            </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Readiness Card */}
                                <div style={{ ...baseCardStyle, minHeight: '100%' }}>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Readiness Snapshot</p>
                                        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Resource & Availability</h3>
                                        <button
                                            onClick={() => onNavigate('pilot-licensure-experience')}
                                            style={{
                                                marginTop: '0.5rem',
                                                padding: '0',
                                                background: 'none',
                                                border: 'none',
                                                color: '#2563eb',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                textAlign: 'left',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.textDecoration = 'underline'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.textDecoration = 'none'; }}
                                        >
                                            view details on readiness →
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        {[
                                            { label: 'Last Flown', value: profileData?.last_flown || '' },
                                            { label: 'Countries Visited', value: profileData?.countries_visited || '' },
                                            { label: 'Favorite Aircraft', value: profileData?.favorite_aircraft || '' }
                                        ].map(item => (
                                            <div key={item.label} style={{ borderRadius: '14px', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(30, 41, 59, 0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>{item.label}</div>
                                                {item.value ? (
                                                    <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', textAlign: 'right' }}>{item.value}</div>
                                                ) : (
                                                    <button
                                                        onClick={() => onNavigate('pilot-licensure-experience')}
                                                        style={{ padding: '0.25rem 0.6rem', background: 'none', border: '1px dashed rgba(148,163,184,0.4)', borderRadius: '6px', color: '#64748b', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s ease' }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.4)'; e.currentTarget.style.color = '#64748b'; }}
                                                    >
                                                        <Plus size={12} /> Add Info
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats Card */}
                                <div style={{
                                    gridColumn: '1 / -1',
                                    background: 'rgba(30, 41, 59, 0.8)',
                                    borderRadius: '26px',
                                    padding: '1.5rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 20px 45px rgba(0,0,0,0.3)'
                                }}>
                                    <div className="quick-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0', alignItems: 'center' }}>
                                        {/* Total Hours */}
                                        <div style={{ padding: '0.6rem 0.75rem', textAlign: 'center', position: 'relative' }}>
                                            <span style={{
                                                position: 'absolute', top: '20%', right: 0,
                                                width: '1px', height: '60%',
                                                background: 'linear-gradient(180deg, transparent, rgba(148,163,184,0.5), transparent)'
                                            }} />
                                            <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase' }}>Total Hours</p>
                                            <p style={{ margin: '0.35rem 0 0', fontSize: '1.85rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.total_hours || 0}</p>
                                            <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Logged Hours</p>
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.65rem', color: '#f59e0b', fontWeight: 500 }}>(unverified)</p>
                                            <button onClick={() => setCurrentDocumentationPage('logbook')} style={{ marginTop: '0.25rem', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', padding: 0, margin: 0, fontSize: '0.65rem', fontWeight: 500, transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#60a5fa'} onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}>verify your flight hours</button>
                                        </div>

                                        {/* Recognition */}
                                        <div style={{ padding: '0.6rem 0.75rem', textAlign: 'center', position: 'relative' }}>
                                            <span style={{
                                                position: 'absolute', top: '20%', right: 0,
                                                width: '1px', height: '60%',
                                                background: 'linear-gradient(180deg, transparent, rgba(148,163,184,0.5), transparent)'
                                            }} />
                                            <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase' }}>Recognition</p>
                                            <p style={{ margin: '0.35rem 0 0', fontSize: '1.85rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.overall_recognition_score || 0}</p>
                                            <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Verified Score</p>
                                        </div>

                                        {/* Recency Examination Score */}
                                        <div style={{ padding: '0.6rem 0.75rem', textAlign: 'center', position: 'relative' }}>
                                            <span style={{
                                                position: 'absolute', top: '20%', right: 0,
                                                width: '1px', height: '60%',
                                                background: 'linear-gradient(180deg, transparent, rgba(148,163,184,0.5), transparent)'
                                            }} />
                                            <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase' }}>Recency Exam</p>
                                            <p style={{ margin: '0.35rem 0 0', fontSize: '1.85rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.recency_examination_score || 0}</p>
                                            <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Recency Score</p>
                                        </div>

                                        {/* Nested Card for Examination and Mentor Hours */}
                                        <div style={{
                                            background: 'rgba(248,250,252,0.85)',
                                            borderRadius: '16px',
                                            padding: '0.75rem',
                                            border: '1px solid rgba(226,232,240,0.8)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem'
                                        }}>
                                            {/* Title */}
                                            <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.15em', color: '#475569', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center' }}>Foundation Program</p>
                                            
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                                {/* Examination */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.55rem', letterSpacing: '0.15em', color: '#64748b', textTransform: 'uppercase' }}>Examination</p>
                                                    <p style={{ margin: '0.25rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.examination_score || 0}</p>
                                                    <p style={{ margin: '0.05rem 0 0', fontSize: '0.65rem', color: '#475569' }}>Knowledge Test</p>
                                                </div>

                                                {/* Mentor Hours */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.55rem', letterSpacing: '0.15em', color: '#64748b', textTransform: 'uppercase' }}>Mentor Hours</p>
                                                    <p style={{ margin: '0.25rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.mentorship_hours || 0}</p>
                                                    <p style={{ margin: '0.05rem 0 0', fontSize: '0.65rem', color: '#475569' }}>Engagement</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CategorySection>

                        {/* Score Optimization Guide */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>Recognition+</h2>
                                <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Premium Score Optimization</span>
                            </div>
                            <ScoreOptimizationGuide
                                currentScore={calculateRecognitionScore({
                                    stats: {
                                        totalHours: profileData?.total_hours || 0,
                                        picHours: 0,
                                        ifrHours: 0,
                                        nightHours: 0,
                                    },
                                    experience: {
                                        years: 0,
                                        achievements: 0,
                                        licenses: 0,
                                    },
                                    assessments: {
                                        programCompletion: 0,
                                        performanceScore: profileData?.overall_recognition_score || 0,
                                    },
                                    mentorship: {
                                        hours: 0,
                                        observations: 0,
                                        cases: 0,
                                    },
                                })}
                                isPremium={isPremium}
                                userId={profileData?.user_id}
                                limit={3}
                                onViewAll={() => onNavigate('score-optimization')}
                                onNavigate={onNavigate}
                            />

                            {/* Veremark Verified Badge — visible to ALL pilots */}
                            <div style={{ marginTop: '1.5rem' }}>
                                <VeremarkVerifiedBadge
                                    isVerified={profileData?.veremark_verified || false}
                                    isPreCleared={profileData?.veremark_verified && profileData?.verification_completeness === 100}
                                    verificationDate={profileData?.veremark_verified_at ? new Date(profileData.veremark_verified_at) : undefined}
                                    expiryDate={profileData?.veremark_expires_at ? new Date(profileData.veremark_expires_at) : undefined}
                                    verificationId={profileData?.veremark_verification_id || undefined}
                                    riskTier={(() => {
                                        // Compute insurance risk tier from profile data
                                        const medical = profileData?.medical_status?.toLowerCase() || '';
                                        const hours = profileData?.total_hours || 0;
                                        const license = profileData?.license_status?.toLowerCase() || '';
                                        const incidents = profileData?.incident_count || 0;
                                        const suspensions = profileData?.license_suspension_count || 0;

                                        if (incidents >= 2 || suspensions >= 1 || medical.includes('special')) return 'high';
                                        if (incidents === 1 || hours < 250 || !medical.includes('valid')) return 'moderate';
                                        if (license.includes('valid') && medical.includes('valid') && hours >= 500) return 'low';
                                        return 'unknown';
                                    })()}
                                    countryCode={profileData?.country_of_license}
                                    isPremium={isPremium}
                                    walletCompletenessPercent={(() => {
                                        // Compute wallet completeness from available profile data
                                        let checks = 0;
                                        let total = 9;
                                        if (profileData?.license_type && profileData?.license_type !== 'None') checks++;
                                        if (profileData?.medical_status && profileData?.medical_status !== 'None') checks++;
                                        if (profileData?.total_hours && profileData?.total_hours > 0) checks++;
                                        if (profileData?.certifications?.length > 0) checks++;
                                        if (profileData?.current_employer) checks++;
                                        if (profileData?.country_of_license) checks++;
                                        if (profileData?.veremark_verified) checks += 3;
                                        return Math.min(100, Math.round((checks / total) * 100));
                                    })()}
                                    items={(() => {
                                        const vItems: import('./VeremarkVerifiedBadge').VerificationItem[] = [];
                                        if (profileData?.license_type && profileData?.license_type !== 'None') {
                                            vItems.push({ id: 'lic', category: 'license', label: 'License Validation', status: profileData?.license_status?.toLowerCase().includes('valid') ? 'verified' : 'pending' });
                                        }
                                        if (profileData?.medical_status && profileData?.medical_status !== 'None') {
                                            vItems.push({ id: 'med', category: 'medical', label: 'Medical Certificate', status: profileData?.medical_status?.toLowerCase().includes('valid') ? 'verified' : 'pending' });
                                        }
                                        if (profileData?.total_hours && profileData?.total_hours > 0) {
                                            vItems.push({ id: 'hrs', category: 'identity', label: 'Flight Hours Log', status: 'verified' });
                                        }
                                        if (profileData?.certifications?.length > 0) {
                                            vItems.push({ id: 'edu', category: 'education', label: 'Education & Credentials', status: 'verified' });
                                        }
                                        if (profileData?.current_employer) {
                                            vItems.push({ id: 'emp', category: 'employment', label: 'Employment History', status: 'verified' });
                                        }
                                        return vItems;
                                    })()}
                                    onRequestVerification={() => onNavigate('veremark-verification')}
                                    onViewDetails={() => onNavigate('verification-details')}
                                />
                            </div>

                            {/* Recognition+ Premium Features */}
                            {isPremium && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Currency & Compliance Notifications */}
                                    <RecognitionPlusNotifications
                                        lastFlownDate={profileData?.last_flight_date ? new Date(profileData.last_flight_date) : null}
                                        medicalExpiry={profileData?.medical_expiry ? new Date(profileData.medical_expiry) : null}
                                        licenseExpiry={profileData?.license_expiry ? new Date(profileData.license_expiry) : null}
                                        totalHours={profileData?.total_hours || 0}
                                        onAction={(action) => {
                                            if (action === 'Schedule Flight') onNavigate('digital-logbook');
                                            if (action === 'Schedule Medical') onNavigate('medical-certificate');
                                            if (action === 'View Requirements') onNavigate('license-requirements');
                                            if (action === 'Update Logbook') onNavigate('digital-logbook');
                                        }}
                                    />

                                    {/* Pathway Priority */}
                                    <PathwayPriority
                                        selectedInterests={profileData?.pathway_interests || []}
                                        currentHours={profileData?.total_hours || 0}
                                        currentRatings={profileData?.ratings || []}
                                        onInterestChange={(interests: string[]) => {
                                            // Update profile with new interests
                                            console.log('Pathway interests updated:', interests);
                                        }}
                                        onViewProgram={(program: string) => onNavigate(`program/${program}`)}
                                        onViewTraining={(trainingId: string) => onNavigate(`training/${trainingId}`)}
                                    />
                                </div>
                            )}
                        </div>

                        <CategorySection title="Professional Interests" description="Professional information and pathway preferences">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ ...baseCardStyle }}>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Professional Information</p>
                                        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Professional Details</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        {[
                                            { label: 'Current Occupation', value: profileData?.current_occupation || '' },
                                            { label: 'Current Employer', value: profileData?.current_employer || '' }
                                        ].map(item => (
                                            <div key={item.label} style={{ borderRadius: '14px', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(30, 41, 59, 0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>{item.label}</div>
                                                {item.value ? (
                                                    <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', textAlign: 'right' }}>{item.value}</div>
                                                ) : (
                                                    <button
                                                        onClick={() => onNavigate('pilot-licensure-experience')}
                                                        style={{ padding: '0.25rem 0.6rem', background: 'none', border: '1px dashed rgba(148,163,184,0.4)', borderRadius: '6px', color: '#64748b', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', transition: 'all 0.2s ease' }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.4)'; e.currentTarget.style.color = '#64748b'; }}
                                                    >
                                                        <Plus size={12} /> Add Info
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ ...baseCardStyle }}>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pathway Interests</p>
                                        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Career Goals</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {profileData?.pathway_interests?.map((interest: string, index: number) => (
                                            <span key={index} style={{ padding: '0.35rem 0.85rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {interest}
                                            </span>
                                        )) || <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No interests specified</p>}
                                    </div>
                                </div>

                                <div style={{ ...baseCardStyle }}>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Insight Interests</p>
                                        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Learning Goals</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {profileData?.insight_interests?.map((interest: string, index: number) => (
                                            <span key={index} style={{ padding: '0.35rem 0.85rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {interest}
                                            </span>
                                        )) || <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No insights interests specified</p>}
                                    </div>
                                </div>
                            </div>
                        </CategorySection>

                        {/* Official Documentation Section */}
                        <CategorySection title="Official Documentation" description="Verification & Resumes">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    {
                                        title: 'Examination Results',
                                        description: 'Dive into your latest verified exam scores and subcategory breakdowns.',
                                        cta: 'View Examination Directory',
                                        filled: true
                                    },
                                    {
                                        title: 'Digital Flight Logbook',
                                        description: 'View your complete collection of licenses, flight hours, certifications, and professional milestones.',
                                        cta: 'View Logbook',
                                        filled: false
                                    },
                                    {
                                        title: 'Pilot Licensure & Experience Data Entry',
                                        description: 'Access your comprehensive digital flight log with detailed flight records, aircraft types, and operational experience.',
                                        cta: 'Open Data Entry',
                                        filled: true
                                    },
                                    {
                                        title: 'Document Vault',
                                        description: 'Upload and verify your pilot certificates, licenses, and medical documents for ATS visibility.',
                                        cta: 'Open Vault',
                                        filled: true
                                    }
                                ].map(card => (
                                    <div key={card.title} style={{
                                        background: 'rgba(30, 41, 59, 0.6)',
                                        borderRadius: '24px',
                                        padding: '1.75rem',
                                        boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto',
                                        gap: '1.5rem',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1.25rem', color: '#ffffff' }}>{card.title}</h3>
                                            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>{card.description}</p>
                                        </div>
                                        <button
                                            style={{
                                                padding: '0.65rem 1.75rem',
                                                borderRadius: '999px',
                                                border: card.filled ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                                                background: card.filled ? '#0ea5e9' : 'transparent',
                                                color: card.filled ? '#fff' : '#94a3b8',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                if (card.title === 'Examination Results') {
                                                    setCurrentDocumentationPage('examination');
                                                } else if (card.title === 'Digital Flight Logbook') {
                                                    setCurrentDocumentationPage('logbook');
                                                } else if (card.title === 'Pilot Licensure & Experience Data Entry') {
                                                    setCurrentDocumentationPage('licensure');
                                                } else if (card.title === 'Document Vault') {
                                                    setCurrentDocumentationPage('vault');
                                                }
                                            }}
                                        >
                                            {card.cta}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CategorySection>

                        {/* PILLAR 11: Verification & Background Checks */}
                        <CategorySection title="Verification & Background Checks" description="Pillar 11 — Portable credential wallet, pre-cleared status, and insurance risk profile">
                            <VerificationWalletSection
                                profileData={profileData}
                                isPremium={isPremium}
                                onNavigate={onNavigate}
                            />
                        </CategorySection>

                        {/* PILLAR 5: ATO Hour Verification */}
                        <CategorySection title="ATO Hour Verification" description="Pillar 5 — Have your flight school verify your training hours for operator trust">
                            <ATOVerificationRequestSection />
                        </CategorySection>

                        <CategorySection title="Additional Information" description="Personal details and aspirations">
                            <div style={{ ...baseCardStyle }}>
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Personal Details</p>
                                    <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>About You</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    {[
                                        { label: 'Why You Want to Become a Pilot', value: profileData?.why_become_pilot || '' },
                                        { label: 'Other Skills', value: profileData?.other_skills || '' }
                                    ].map(item => (
                                        <div key={item.label} style={{ borderRadius: '14px', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(30, 41, 59, 0.6)' }}>
                                            <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>{item.label}</div>
                                            {item.value ? (
                                                <div style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.value}</div>
                                            ) : (
                                                <button
                                                    onClick={() => onNavigate('pilot-licensure-experience')}
                                                    style={{ padding: '0.3rem 0.75rem', background: 'none', border: '1px dashed rgba(148,163,184,0.4)', borderRadius: '8px', color: '#64748b', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s ease' }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.4)'; e.currentTarget.style.color = '#64748b'; }}
                                                >
                                                    <Plus size={14} /> Add Info
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CategorySection>

                        {/* ATLAS Resume Section */}
                        <CategorySection title="ATLAS Resume" description="ATS-Approved ATLAS CV Formatting">
                            <div style={{ maxWidth: '80rem', margin: '0 auto', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', overflow: 'hidden' }}>
                                {/* Header Card - Aviation Burgundy for professional authority */}
                                <div style={{ background: '#7f1d1d', padding: '1.25rem 1.5rem', borderBottom: '1px solid #991b1b' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '0.625rem', color: '#fecaca', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.25rem' }}>Pilot Recognition Profile</p>
                                            <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{pilotName}</h4>
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#fecaca' }}>WingMentor Recognition Portfolio</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '0.625rem', color: '#fecaca', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>SHARE LINK</p>
                                            <button style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #fca5a5', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, color: '#b91c1c', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                                Copy shareable resume URL
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                        {/* Pilot Credentials */}
                                        <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Pilot Credentials</h5>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Licensing, hours, and access pass</p>
                                            
                                            {/* Flight Hours Grid - 4 boxes */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Hours</p>
                                                    <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.total_hours || 0}</p>
                                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.65rem', color: '#f59e0b', fontWeight: 500 }}>(unverified)</p>
                                                    <button onClick={() => setCurrentDocumentationPage('logbook')} style={{ marginTop: '0.25rem', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', padding: 0, margin: '0.25rem 0 0 0', fontSize: '0.65rem', fontWeight: 500 }}>verify your flight hours</button>
                                                </div>
                                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Mentorship</p>
                                                    <div style={{ position: 'relative', width: '48px', height: '48px', margin: '0 auto' }}>
                                                        <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
                                                            <circle cx="24" cy="24" r="20" fill="none" stroke="#1e293b" strokeWidth="4" />
                                                            <circle cx="24" cy="24" r="20" fill="none" stroke={profileData?.mentorship_hours >= 50 ? '#059669' : '#3b82f6'} strokeWidth="4" strokeDasharray={`${(profileData?.mentorship_hours || 0) / 50 * 125.6} 125.6`} strokeLinecap="round" />
                                                        </svg>
                                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                                                            {profileData?.mentorship_hours || 0}
                                                        </div>
                                                    </div>
                                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.6rem', color: '#64748b' }}>Goal: 50 hrs</p>
                                                </div>
                                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Foundation</p>
                                                    <div style={{ position: 'relative', width: '48px', height: '48px', margin: '0 auto' }}>
                                                        <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
                                                            <circle cx="24" cy="24" r="20" fill="none" stroke="#1e293b" strokeWidth="4" />
                                                            <circle cx="24" cy="24" r="20" fill="none" stroke={profileData?.foundation_progress >= 100 ? '#059669' : '#3b82f6'} strokeWidth="4" strokeDasharray={`${(profileData?.foundation_progress || 0) / 100 * 125.6} 125.6`} strokeLinecap="round" />
                                                        </svg>
                                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                                                            {profileData?.foundation_progress || 0}%
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Recognition</p>
                                                    <div style={{ position: 'relative', width: '48px', height: '48px', margin: '0 auto' }}>
                                                        <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
                                                            <circle cx="24" cy="24" r="20" fill="none" stroke="#1e293b" strokeWidth="4" />
                                                            <circle cx="24" cy="24" r="20" fill="none" stroke={profileData?.overall_recognition_score >= 70 ? '#059669' : profileData?.overall_recognition_score >= 40 ? '#f59e0b' : '#3b82f6'} strokeWidth="4" strokeDasharray={`${(profileData?.overall_recognition_score || 0) / 100 * 125.6} 125.6`} strokeLinecap="round" />
                                                        </svg>
                                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
                                                            {profileData?.overall_recognition_score || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Type & Status */}
                                            <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Status</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                                                        {profileData?.license_status || 'Verified'}
                                                    </span>
                                                </div>
                                            </div>

                                            <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                View Flight Digital Logbook <span>→</span>
                                            </a>
                                        </div>

                                        {/* Training */}
                                        <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>Training</h5>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b', flexShrink: 0 }}>License</span>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                                        {['ppl', 'cpl', 'ir', 'multi_engine', 'student'].map((license) => (
                                                            <span key={license} style={{ 
                                                                fontSize: '0.65rem', 
                                                                fontWeight: 700, 
                                                                color: '#ffffff',
                                                                background: 'rgba(59, 130, 246, 0.2)',
                                                                padding: '0.15rem 0.4rem',
                                                                borderRadius: '0.25rem',
                                                                border: '1px solid rgba(59, 130, 246, 0.4)',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {license.replace('_', ' ').toUpperCase()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Medical</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                                                        Class 1 Valid
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Type Ratings</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>Multi-Engine</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>English Proficiency</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.english_proficiency_level || 'Level 6 (Expert)'}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Languages</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>English, Spanish</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Readiness Snapshot */}
                                        <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <h5 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>READINESS SNAPSHOT</h5>
                                            <h6 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>Resource & Availability</h6>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Medical Certificate</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                                                        Valid Until Aug 2026
                                                    </span>
                                                </div>
                                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Last Flown</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.last_flown || 'Not Available'}</span>
                                                </div>
                                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Recognition Score</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.overall_recognition_score || 0}/100</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Experience Section */}
                                    <div style={{ marginTop: '1rem', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>Recent Job Experience & Industry Aligned Accredited Programs</h5>
                                            <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                Edit Experience <span>→</span>
                                            </a>
                                        </div>
                                        
                                        {/* Job Experience Entry */}
                                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <h6 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{profileData?.current_occupation || 'Student Pilot'}</h6>
                                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{profileData?.current_employer || 'Skyway Aviation Academy'}</p>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 600 }}>Jan 2024 - Present</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
                                                {profileData?.why_become_pilot || 'Providing flight instruction for PPL and CPL students. Specializing in instrument training and multi-engine operations.'}
                                            </p>
                                        </div>
                                        
                                        <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            Add your job experience <span>→</span>
                                        </a>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.75rem 1.5rem', borderTop: '1px solid #e2e8f0' }}>
                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', textAlign: 'center' }}>
                                        This ATLAS-formatted CV is machine-readable by airline ATS systems and includes verified competency data from the WingMentor Foundation Program.
                                    </p>
                                </div>
                            </div>
                        </CategorySection>

                        {/* Recommended Pathways Carousel */}
                        <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '1rem' }}>
                            <div>
                                <h2 style={{ 
                                    margin: 0, 
                                    fontSize: '3rem', 
                                    fontWeight: 'normal', 
                                    fontFamily: 'Georgia, serif', 
                                    color: '#ffffff', 
                                    letterSpacing: '-0.02em' 
                                }}>
                                    Recommended Pathways
                                </h2>
                                <p style={{ margin: '0.5rem 0 0', color: '#475569', fontSize: '1rem' }}>
                                    Explore career pathways matched to your profile
                                </p>
                                <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                                    Discover cadet programs, airline relationships, and career progression opportunities tailored to your experience level
                                </p>
                            </div>
                        </div>

                        {/* Swipe instruction text and Overall Profile Score */}
                        <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '0.5rem' }}>
                            {/* Recognition Match Categories */}
                            <div style={{ position: 'absolute', left: '1.5rem', display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                                <div 
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: selectedScoreCategory === 'low' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: selectedScoreCategory === 'low' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease' }}
                                    onClick={() => setSelectedScoreCategory('low')}
                                >
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}></div>
                                    <span style={{ fontSize: '0.7rem', color: selectedScoreCategory === 'low' ? '#ef4444' : '#000000', fontWeight: selectedScoreCategory === 'low' ? 600 : 500 }}>Low Match</span>
                                </div>
                                <div 
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: selectedScoreCategory === 'middle' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: selectedScoreCategory === 'middle' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease' }}
                                    onClick={() => setSelectedScoreCategory('middle')}
                                >
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px rgba(245, 158, 11, 0.5)' }}></div>
                                    <span style={{ fontSize: '0.7rem', color: selectedScoreCategory === 'middle' ? '#f59e0b' : '#000000', fontWeight: selectedScoreCategory === 'middle' ? 600 : 500 }}>Middle Match</span>
                                </div>
                                <div 
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: selectedScoreCategory === 'high' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: selectedScoreCategory === 'high' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease' }}
                                    onClick={() => setSelectedScoreCategory('high')}
                                >
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)' }}></div>
                                    <span style={{ fontSize: '0.7rem', color: selectedScoreCategory === 'high' ? '#22c55e' : '#000000', fontWeight: selectedScoreCategory === 'high' ? 600 : 500 }}>High Match</span>
                                </div>
                                <div 
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: selectedScoreCategory === 'all' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: selectedScoreCategory === 'all' ? '1px solid rgba(148, 163, 184, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease' }}
                                    onClick={() => setSelectedScoreCategory('all')}
                                >
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8', boxShadow: '0 0 8px rgba(148, 163, 184, 0.5)' }}></div>
                                    <span style={{ fontSize: '0.7rem', color: '#000000', fontWeight: selectedScoreCategory === 'all' ? 600 : 500 }}>All</span>
                                </div>
                            </div>

                            <p style={{ 
                                fontSize: '0.875rem', 
                                color: '#94a3b8', 
                                fontStyle: 'italic',
                                margin: 0
                            }}>
                                Swipe left and right or click to select a card
                            </p>

                            {/* Overall Profile Score */}
                            <div 
                                style={{ position: 'absolute', right: '1.5rem' }}
                                onMouseEnter={() => setShowScoreTooltip(true)}
                                onMouseLeave={() => setShowScoreTooltip(false)}
                            >
                                <div style={{ textAlign: 'right', padding: '0.75rem 1rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(241,245,249,0.8))', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(15,23,42,0.1)', cursor: 'help', minWidth: '220px' }}>
                                    {loading || recommendedPathways.length === 0 ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
                                            <div style={{ 
                                                width: '16px', 
                                                height: '16px', 
                                                border: '2px solid #e2e8f0', 
                                                borderTopColor: '#3b82f6', 
                                                borderRadius: '50%', 
                                                animation: 'spin 1s linear infinite' 
                                            }}></div>
                                            <span style={{ fontSize: '0.6rem', color: '#64748b', fontStyle: 'italic' }}>
                                                Authenticating Supabase profile connection and pulling recommendations...
                                            </span>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                                            <div style={{ textAlign: 'left', flex: 1 }}>
                                                <p style={{ margin: 0, fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.125rem' }}>
                                                    Overall Profile Score
                                                </p>
                                                <div style={{ fontSize: '0.6rem', color: '#64748b' }}>
                                                    <div style={{ marginBottom: '0.0625rem' }}>
                                                        Flight Hours: {profileData?.total_hours || 0} <span style={{ fontSize: '0.6rem', fontWeight: 500, color: '#f59e0b' }}>(unverified)</span>
                                                    </div>
                                                    <div style={{ marginBottom: '0.0625rem' }}>
                                                        Recency: {profileData?.recent_flight_experience || 'N/A'}
                                                    </div>
                                                    <div>
                                                        Recognition: {profileData?.recognition_score || profileData?.overall_recognition_score || 0}
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: '#ffffff', lineHeight: 1 }}>
                                                {profileData?.overall_recognition_score || 0}
                                            </h3>
                                        </div>
                                    )}
                                </div>

                                {/* Tooltip Popup */}
                                {showScoreTooltip && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '0.5rem',
                                        width: '350px',
                                        padding: '1rem',
                                        background: 'rgba(30, 41, 59, 0.95)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                                        zIndex: 1000,
                                        textAlign: 'left'
                                    }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                                            About Your Profile Score
                                        </h4>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
                                            Your overall profile score is calculated based on three key factors:
                                        </p>
                                        <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>
                                            <li style={{ marginBottom: '0.25rem' }}><strong>Flight Hours:</strong> Total accumulated flight experience</li>
                                            <li style={{ marginBottom: '0.25rem' }}><strong>Recency:</strong> Recent flight activity and currency</li>
                                            <li><strong>Recognition:</strong> Professional achievements and certifications</li>
                                        </ul>
                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                            Higher scores indicate stronger alignment with aviation career pathways.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ position: 'relative', width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '0', paddingRight: '0', marginTop: '0.5rem' }}>
                            <style>{`
                                .scrollbar-hide::-webkit-scrollbar {
                                    display: none;
                                }
                                .scrollbar-hide {
                                    -ms-overflow-style: none;
                                    scrollbar-width: none;
                                }
                                .snap-scroll {
                                    scroll-snap-type: x mandatory;
                                    scroll-padding-left: 3rem;
                                    scroll-padding-right: 3rem;
                                }
                                .snap-scroll > div {
                                    scroll-snap-align: center;
                                    scroll-snap-stop: always;
                                }
                            `}</style>
                            <div 
                                ref={carouselRef}
                                onScroll={handleScroll}
                                style={{ 
                                    display: 'flex', 
                                    gap: '1.5rem', 
                                    overflowX: 'scroll', 
                                    overflowY: 'hidden', 
                                    paddingBottom: '1rem', 
                                    scrollbarWidth: 'none', 
                                    msOverflowStyle: 'none',
                                    overscrollBehaviorX: 'none',
                                    WebkitOverflowScrolling: 'touch',
                                    width: '100%',
                                    maxWidth: '100%'
                                }}
                                className="snap-scroll"
                            >
                                    {filteredPathways.length === 0 ? (
                                        <div style={{ 
                                            width: '100%', 
                                            padding: '4rem 2rem', 
                                            textAlign: 'center', 
                                            background: 'rgba(255, 255, 255, 0.5)', 
                                            borderRadius: '1rem',
                                            border: '2px dashed rgba(148, 163, 184, 0.3)'
                                        }}>
                                            <p style={{ 
                                                margin: 0, 
                                                fontSize: '1.25rem', 
                                                color: '#64748b', 
                                                fontWeight: 500 
                                            }}>
                                                No pathways match this filter
                                            </p>
                                            <p style={{ 
                                                margin: '0.5rem 0 0 0', 
                                                fontSize: '0.875rem', 
                                                color: '#94a3b8' 
                                            }}>
                                                Try selecting a different filter or "All" to see all pathways
                                            </p>
                                        </div>
                                    ) : (
                                        filteredPathways.map((pathway) => (
                                        <div 
                                            key={pathway.id} 
                                            style={{ 
                                                flexShrink: 0, 
                                                width: pathway.id === 'wingmentor-intro' ? '450px' : '600px', 
                                                cursor: pathway.id === 'wingmentor-intro' ? 'default' : 'pointer',
                                                border: selectedPathway?.id === pathway.id ? '3px solid #0ea5e9' : '3px solid transparent',
                                                borderRadius: '1rem',
                                                padding: '3px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onClick={() => pathway.id !== 'wingmentor-intro' && setSelectedPathway(pathway)}
                                        >
                                            <div style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
                                                {/* Thumbnail Image */}
                                                <div style={{ position: 'relative', height: '300px', borderRadius: '0.75rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: pathway.id === 'wingmentor-intro' ? 'white' : 'transparent' }}>
                                                    {pathway.id === 'wingmentor-intro' ? (
                                                        <img
                                                            src={pathway.image}
                                                            alt={pathway.title}
                                                            style={{ width: '120px', height: '120px', objectFit: 'contain', margin: 'auto' }}
                                                            onError={(e) => console.error('[IMAGE] WingMentor image error:', pathway.image, e)}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={pathway.image}
                                                            alt={pathway.title}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                            onError={(e) => console.error('[IMAGE] Pathway image error:', pathway.image, 'Pathway:', pathway.title, 'Error:', e)}
                                                        />
                                                    )}
                                                    {pathway.id !== 'wingmentor-intro' && (
                                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent 40%)' }} />
                                                    )}
                                                
                                                    {/* Match Badge */}
                                                    {pathway.id !== 'wingmentor-intro' && (
                                                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                                        <div style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.9)', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                                                            {pathway.matchPercentage}% Match
                                                        </div>
                                                        <div style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(14, 165, 233, 0.9)', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                                                            PR: {profileData?.overall_recognition_score || 0}
                                                        </div>
                                                    </div>
                                                )}

                                                    {/* Headline Bar */}
                                                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '1rem', background: pathway.id === 'wingmentor-intro' ? 'transparent' : 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)', textAlign: 'center' }}>
                                                        <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'normal', color: pathway.id === 'wingmentor-intro' ? '#0f172a' : 'white', fontFamily: 'Georgia, serif', textShadow: pathway.id === 'wingmentor-intro' ? 'none' : '0 2px 4px rgba(0,0,0,0.5)' }}>
                                                            {pathway.title}
                                                        </h4>
                                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: pathway.id === 'wingmentor-intro' ? '#64748b' : 'rgba(255, 255, 255, 0.8)' }}>
                                                            {pathway.subtitle}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )))}
                                </div>
                            </div>

                            {/* Arrow Keys with Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
                                <button 
                                    onClick={() => scrollCarousel('left')}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '50%',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#f8fafc';
                                        e.currentTarget.style.color = '#0f172a';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = '#64748b';
                                    }}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {/* Floating Header between arrows with description */}
                                {selectedPathway && (
                                    <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>
                                            Selected Pathway
                                        </p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'normal', color: '#ffffff', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>
                                            {selectedPathway.title}
                                        </h3>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b' }}>
                                            {selectedPathway.subtitle}
                                        </p>
                                        <div style={{ background: 'rgba(14, 165, 233, 0.05)', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '0.5rem', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#0ea5e9', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                Why this pathway is recommended to you
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                                                Based on your profile, this pathway has a <strong>{selectedPathway.matchPercentage}% match</strong> with your interests in <strong>{selectedPathway.interests.join(', ')}</strong>. Your recognition score of <strong>{profileData?.overall_recognition_score || 0}</strong> indicates strong alignment with this program's requirements. This pathway is one of the best starting points to build your recognition profile score throughout your pilot career, setting a foundation for future opportunities.
                                            </p>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                                            {selectedPathway.description}
                                        </p>
                                    </div>
                                )}

                                <button 
                                    onClick={() => scrollCarousel('right')}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '50%',
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#f8fafc';
                                        e.currentTarget.style.color = '#0f172a';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = '#64748b';
                                    }}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* Header and description above the card */}
                            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: '#ffffff' }}>
                                    Requirements & Profile Alignment
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                                    Understand how your current profile aligns with the pathway requirements and identify areas for improvement to increase your eligibility.
                                </p>
                            </div>

                            {/* Description Component below header */}
                            {selectedPathway && (
                                <div style={{ padding: '1.5rem', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 45px rgba(0,0,0,0.3)' }}>
                                    
                                    {/* Requirements Section */}
                                    {selectedPathway.requirements && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', letterSpacing: '0.1em', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' }}>
                                                    REQUIREMENTS & PROFILE ALIGNMENT
                                                </p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                                                    <div>
                                                        <span style={{ fontWeight: 600 }}>Updated:</span>
                                                        <span> {new Date().toLocaleDateString()}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: 600 }}>Source:</span>
                                                        <span> {selectedPathway.source || (selectedPathway.id === 'wingmentor-intro' ? 'Direct Source' : 'Job Board')}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(14, 165, 233, 1)', borderRadius: '0.25rem' }}>
                                                        <span style={{ color: 'white', fontWeight: 600 }}>Airline Verified</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Requirements by Category */}
                                            {Object.entries(groupRequirementsByCategory(checkRequirements(selectedPathway))).map(([category, reqs]) => (
                                                reqs.length > 0 && (
                                                    <div key={category} style={{ marginBottom: '1.5rem' }}>
                                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#ffffff', fontWeight: 700, textTransform: 'uppercase' }}>
                                                            {category}
                                                        </p>
                                                        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                                            {getCategoryAccountComparison(category, reqs)}
                                                        </p>
                                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                                            <thead>
                                                                <tr style={{ borderBottom: '2px solid rgba(203, 213, 225, 0.5)' }}>
                                                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirement</th>
                                                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                                                    <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {reqs.map((req) => (
                                                                    <tr key={req.id} style={{ borderBottom: '1px solid rgba(203, 213, 225, 0.2)' }}>
                                                                        <td style={{ padding: '0.75rem', color: '#ffffff', fontWeight: 500 }}>
                                                                            {req.label}
                                                                            {req.openToForeignNationals !== undefined && (
                                                                                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                                                                                    ({req.openToForeignNationals ? 'Open to foreign nationals' : 'Citizenship required'})
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td style={{ padding: '0.75rem' }}>
                                                                            <span style={{ 
                                                                                display: 'inline-flex',
                                                                                alignItems: 'center',
                                                                                gap: '0.5rem',
                                                                                padding: '0.25rem 0.75rem',
                                                                                borderRadius: '0.25rem',
                                                                                fontSize: '0.75rem',
                                                                                fontWeight: 600,
                                                                                background: req.isPreferred ? 'rgba(14, 165, 233, 0.1)' : (req.met ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
                                                                                color: req.isPreferred ? '#0ea5e9' : (req.met ? '#15803d' : '#dc2626')
                                                                            }}>
                                                                                {req.isPreferred ? 'Optional' : (req.met ? '✓ Met' : '✗ Not Met')}
                                                                            </span>
                                                                        </td>
                                                                        <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.8rem' }}>
                                                                            {req.reason}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}

                                    {/* Why Profile Matches Section */}
                                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0ea5e9', fontWeight: 600 }}>
                                            Why Your Profile Matches
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                                            Your profile shows a {selectedPathway.matchPercentage}% match based on your interests in {selectedPathway.interests.join(', ')} and your recognition score of {profileData?.overall_recognition_score || 0}. 
                                            {profileData?.pathway_interests?.some((interest: string) => selectedPathway.interests.some((pathwayInterest: string) => 
                                                interest.toLowerCase().includes(pathwayInterest.toLowerCase())
                                            )) ? ' Your selected interests align well with this pathway.' : ' Consider adding relevant interests to improve your match score.'}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button style={{
                                            padding: '0.75rem 2rem',
                                            borderRadius: '0.5rem',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            Discover {selectedPathway.title} →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Advanced Recognition Metrics Section */}
                            <div style={{ marginTop: '2rem' }}>
                                <div style={{ 
                                    padding: '1.5rem', 
                                    background: 'rgba(30, 41, 59, 0.8)', 
                                    borderRadius: '1rem', 
                                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                                    boxShadow: '0 20px 45px rgba(0,0,0,0.3)'
                                }}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                                            Advanced Recognition Metrics
                                        </p>
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>
                                            Expanded Formula Variables
                                        </h3>
                                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                                            Detailed breakdown of behavioral, language, and specialized skills metrics used in pathway matching calculations.
                                        </p>
                                    </div>

                                    {/* Reveal Buttons */}
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        {[
                                            { id: 'B', label: 'Behavioral (B)', description: 'CRM & Decision-Making' },
                                            { id: 'L', label: 'Language (L)', description: 'Cultural Fit' },
                                            { id: 'S', label: 'Skills (S)', description: 'Specialized Operations' }
                                        ].map((metric) => (
                                            <button
                                                key={metric.id}
                                                onClick={() => setAdvancedMetricsOpen(advancedMetricsOpen === metric.id ? null : metric.id as 'B' | 'L' | 'S')}
                                                style={{
                                                    padding: '0.75rem 1.25rem',
                                                    borderRadius: '0.5rem',
                                                    border: '1px solid rgba(37, 99, 235, 0.2)',
                                                    background: advancedMetricsOpen === metric.id ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.9)',
                                                    color: advancedMetricsOpen === metric.id ? 'white' : '#0f172a',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    boxShadow: advancedMetricsOpen === metric.id ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 2px 8px rgba(15, 23, 42, 0.05)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (advancedMetricsOpen !== metric.id) {
                                                        e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)';
                                                        e.currentTarget.style.background = 'rgba(37, 99, 235, 0.05)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (advancedMetricsOpen !== metric.id) {
                                                        e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.2)';
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                                                    }
                                                }}
                                            >
                                                {metric.label}
                                                <ChevronRight style={{ 
                                                    width: 16, 
                                                    height: 16, 
                                                    transition: 'transform 0.2s ease',
                                                    transform: advancedMetricsOpen === metric.id ? 'rotate(90deg)' : 'rotate(0deg)'
                                                }} />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Dropdown Content */}
                                    {advancedMetricsOpen === 'B' && (
                                        <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', letterSpacing: '0.15em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>
                                                Behavioral & CRM Index (B)
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                                {[
                                                    { label: 'Situational Judgment Test', value: profileData?.behavioral_sjt_score || 0, key: 'behavioral_sjt_score' },
                                                    { label: 'Psychometric Profile', value: profileData?.behavioral_psychometric_score || 0, key: 'behavioral_psychometric_score' },
                                                    { label: 'Cognitive Workload', value: profileData?.behavioral_cognitive_workload || 0, key: 'behavioral_cognitive_workload' },
                                                    { label: 'Stress Management', value: profileData?.behavioral_stress_management || 0, key: 'behavioral_stress_management' },
                                                    { label: 'Decision-Making', value: profileData?.behavioral_decision_making || 0, key: 'behavioral_decision_making' },
                                                    { label: 'CRM Assessment', value: profileData?.behavioral_crm_assessment || 0, key: 'behavioral_crm_assessment' }
                                                ].map((item) => (
                                                    <div key={item.key} style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.5rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{item.label}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{ 
                                                                    width: `${item.value}%`, 
                                                                    height: '100%', 
                                                                    background: item.value >= 70 ? '#22c55e' : item.value >= 40 ? '#f59e0b' : '#ef4444',
                                                                    borderRadius: '3px',
                                                                    transition: 'width 0.3s ease'
                                                                }} />
                                                            </div>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', minWidth: '35px' }}>{item.value}%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {advancedMetricsOpen === 'L' && (
                                        <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', letterSpacing: '0.15em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>
                                                Language & Cultural Fit (L)
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                                {[
                                                    { label: 'ICAO English Level', value: profileData?.language_icao_level || 'Not Set', key: 'language_icao_level', isText: true },
                                                    { label: 'Cultural Adaptability', value: profileData?.language_cultural_adaptability || 0, key: 'language_cultural_adaptability' },
                                                    { label: 'International Experience', value: profileData?.language_international_experience ? 'Yes' : 'No', key: 'language_international_experience', isText: true },
                                                    { label: 'Cross-Cultural Comm', value: profileData?.language_cross_cultural_comm || 0, key: 'language_cross_cultural_comm' }
                                                ].map((item) => (
                                                    <div key={item.key} style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.5rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{item.label}</p>
                                                        {item.isText ? (
                                                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{item.value}</p>
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                                    <div style={{ 
                                                                        width: `${item.value}%`, 
                                                                        height: '100%', 
                                                                        background: item.value >= 70 ? '#22c55e' : item.value >= 40 ? '#f59e0b' : '#ef4444',
                                                                        borderRadius: '3px',
                                                                        transition: 'width 0.3s ease'
                                                                    }} />
                                                                </div>
                                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', minWidth: '35px' }}>{item.value}%</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {advancedMetricsOpen === 'S' && (
                                        <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', letterSpacing: '0.15em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>
                                                Specialized Skills Index (S)
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                                {[
                                                    { label: 'Weather Operations', value: profileData?.skills_weather_ops || 0, key: 'skills_weather_ops' },
                                                    { label: 'Terrain Complexity', value: profileData?.skills_terrain_complexity || 0, key: 'skills_terrain_complexity' },
                                                    { label: 'Emergency Procedures', value: profileData?.skills_emergency_procedures || 0, key: 'skills_emergency_procedures' },
                                                    { label: 'Type Rating Diversity', value: profileData?.skills_type_rating_diversity || 0, key: 'skills_type_rating_diversity' },
                                                    { label: 'Instrument Approaches', value: profileData?.skills_instrument_approaches || 0, key: 'skills_instrument_approaches' }
                                                ].map((item) => (
                                                    <div key={item.key} style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.5rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{item.label}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{ 
                                                                    width: `${item.value}%`, 
                                                                    height: '100%', 
                                                                    background: item.value >= 70 ? '#22c55e' : item.value >= 40 ? '#f59e0b' : '#ef4444',
                                                                    borderRadius: '3px',
                                                                    transition: 'width 0.3s ease'
                                                                }} />
                                                            </div>
                                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', minWidth: '35px' }}>{item.value}%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                    </div>
                </section>
            </main>
            
            {/* Documentation Pages Overlay */}
            {currentDocumentationPage === 'examination' && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: '#f0f4f8', overflowY: 'auto' }}>
                    <ExaminationResultsPage
                        onBack={() => setCurrentDocumentationPage(null)}
                        userProfile={profileData ? {
                            firstName: profileData.full_name?.split(' ')[0] || profileData.display_name?.split(' ')[0] || '',
                            lastName: profileData.full_name?.split(' ').slice(1).join(' ') || profileData.display_name?.split(' ').slice(1).join(' ') || '',
                            uid: profileData.id,
                            id: profileData.id
                        } : null}
                    />
                </div>
            )}
            {currentDocumentationPage === 'logbook' && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: '#eef4fb', overflowY: 'auto' }}>
                    <DigitalLogbookPage
                        onBack={() => setCurrentDocumentationPage(null)}
                        userProfile={profileData ? {
                            id: profileData.id,
                            uid: profileData.id,
                            firstName: profileData.full_name?.split(' ')[0] || profileData.display_name?.split(' ')[0] || '',
                            lastName: profileData.full_name?.split(' ').slice(1).join(' ') || profileData.display_name?.split(' ').slice(1).join(' ') || '',
                            email: profileData.email
                        } : null}
                    />
                </div>
            )}
            {currentDocumentationPage === 'licensure' && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)', overflowY: 'auto' }}>
                    <PilotLicensureExperiencePage
                        onBack={() => setCurrentDocumentationPage(null)}
                        userProfile={profileData ? {
                            id: profileData.id || profileData.user_id,
                            uid: profileData.id || profileData.user_id,
                            firstName: profileData.full_name?.split(' ')[0] || '',
                            lastName: profileData.full_name?.split(' ').slice(1).join(' ') || ''
                        } : null}
                    />
                </div>
            )}
            {currentDocumentationPage === 'vault' && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: '#f0f4f8', overflowY: 'auto' }}>
                    <DocumentVaultPage
                        onBack={() => setCurrentDocumentationPage(null)}
                        userProfile={profileData ? {
                            id: profileData.id || profileData.user_id,
                            firstName: profileData.full_name?.split(' ')[0] || profileData.display_name?.split(' ')[0] || '',
                            lastName: profileData.full_name?.split(' ').slice(1).join(' ') || profileData.display_name?.split(' ').slice(1).join(' ') || ''
                        } : null}
                    />
                </div>
            )}

        </div>
    );
};
