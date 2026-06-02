import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletLoadingScreen } from '../wallet/WalletLoadingScreen';
import { WalletPageWithSidebar } from '../wallet/WalletPageWithSidebar';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, LayoutDashboard, BarChart3, BookMarked, Image as ImageIcon, Fingerprint, Plus } from 'lucide-react';

type ProfileSection = 'overview' | 'statistics' | 'logbook' | 'photos' | 'identity' | 'vault' | 'admin_dashboard';
import { supabase } from '../../../../src/lib/supabase';
import ExaminationResultsPage from './ExaminationResultsPage';
import { DigitalLogbookPage } from './DigitalLogbookPage';
import { PilotLicensureExperiencePage } from './PilotLicensureExperiencePage';
import { DocumentVaultPage } from './DocumentVaultPage';
import { RecognitionScoreDisplay } from '../../../RecognitionScoreDisplay';
import { ScoreOptimizationGuide } from '../../../ScoreOptimizationGuide';
import { RecognitionPlusNotifications } from './RecognitionPlusNotifications';
import { ATOVerificationRequestSection } from './ATOVerificationRequestSection';
import { PathwayPriority } from './CareerPathwayPriority';
import { AdminDashboardPanel } from './AdminDashboardPanel';
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
    const carouselRef = useRef<HTMLDivElement>(null);
    const [currentDocumentationPage, setCurrentDocumentationPage] = useState<'examination' | 'logbook' | 'licensure' | 'vault' | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [advancedMetricsOpen, setAdvancedMetricsOpen] = useState<'B' | 'L' | 'S' | null>(null);
    const [urlCopied, setUrlCopied] = useState(false);
    const [recognitionScore, setRecognitionScore] = useState<RecognitionScore | null>(null);
    const [loadingScore, setLoadingScore] = useState(false);
    const [scoreError, setScoreError] = useState<string | null>(null);
    const { score: recognitionScoreData, loading: scoreDataLoading } = useRecognitionScore();
    const { readProfile } = useVaultProfile();
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [isPremium, setIsPremium] = useState(false);
    const [showWalletGate, setShowWalletGate] = useState(false);
    const [showWalletView, setShowWalletView] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [editingTile, setEditingTile] = useState<string | null>(null);
    const [tileEditValue, setTileEditValue] = useState('');
    const [profileReady, setProfileReady] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const { currentUser } = useAuth();
    
    // Admin check - only show certain features for admin users
    const isAdmin = currentUser?.email?.includes('admin') || 
                    currentUser?.email?.includes('benjamin') || 
                    currentUser?.email?.includes('karl') ||
                    currentUser?.email === 'benjamintigerbowler@gmail.com';

    // Derive display values from wallet (injectedWalletData.credentials = pilot_credentials rows)
    // The wallet is the source of truth — the profile display below is a read-only mirror.
    const walletDisplay = useMemo(() => {
        const checks: any[] = injectedWalletData?.credentials || [];
        const find = (type: string) => checks.find((c: any) => c.check_type === type);

        const licenseCheck  = find('professional_qualification');
        const medicalCheck  = find('education');     // 'education' = medical cert check type
        const elpCheck      = find('language_proficiency');
        const identityCheck = find('identity');

        const calcDays = (dateStr?: string | null): string => {
            if (!dateStr) return '';
            const diff = Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000);
            if (diff < 0) return 'EXPIRED';
            if (diff === 0) return 'Today';
            return `${diff} day${diff !== 1 ? 's' : ''}`;
        };

        const toStatus = (dateStr?: string | null, isVerified?: boolean): 'safe' | 'warning' | 'danger' => {
            if (!isVerified) return 'warning';
            if (!dateStr) return 'warning';
            const diff = Math.round((new Date(dateStr).getTime() - Date.now()) / 86400000);
            if (diff < 0) return 'danger';
            if (diff < 30) return 'warning';
            return 'safe';
        };

        const licenseExpiry   = profileData?.license_expiry || licenseCheck?.result_data?.expiry_date || null;
        const medicalExpiry   = profileData?.medical_expiry || medicalCheck?.result_data?.expiry_date || null;
        const elpExpiry       = profileData?.elp_expiry || elpCheck?.result_data?.expiry_date || null;

        const complianceRows = [
            {
                label: 'Pilot License',
                status: toStatus(licenseExpiry, licenseCheck?.status === 'verified'),
                days: licenseExpiry ? calcDays(licenseExpiry) : (licenseCheck ? licenseCheck.status : 'Not added'),
            },
            {
                label: 'Class 1 Medical Certificate',
                status: toStatus(medicalExpiry, medicalCheck?.status === 'verified'),
                days: medicalExpiry ? calcDays(medicalExpiry) : (medicalCheck ? medicalCheck.status : 'Not added'),
            },
            {
                label: 'ICAO Language Proficiency (ELP)',
                status: toStatus(elpExpiry, elpCheck?.status === 'verified'),
                days: elpExpiry ? calcDays(elpExpiry) : (elpCheck ? elpCheck.status : 'Not added'),
            },
            {
                label: 'Identity / Passport',
                status: toStatus(null, identityCheck?.status === 'verified') as 'safe' | 'warning' | 'danger',
                days: identityCheck?.status === 'verified' ? 'Verified' : identityCheck ? identityCheck.status : 'Not added',
            },
        ];

        return {
            licenseNumber:    licenseCheck?.result_data?.license_number || profileData?.license_number || profileData?.license_id || '',
            licenseStatus:    licenseCheck?.status || 'unverified',
            licenseExpiry,
            medicalExpiry,
            licenseAuthority: licenseCheck?.result_data?.issuing_authority || profileData?.license_authority || profileData?.country_of_license || '',
            elpLevel:         elpCheck?.result_data?.level || profileData?.english_proficiency_level || profileData?.elp_level || '',
            isVerified:       checks.some((c: any) => c.status === 'verified'),
            complianceRows,
        };
    }, [injectedWalletData, profileData]);

    // MSFS 2024 Style Sidebar Navigation
    const [activeSection, setActiveSection] = useState<ProfileSection>('overview');

    // Check subscription status — resolve Supabase UUID from email (Auth0 sub is not a UUID)
    useEffect(() => {
        if (!currentUser?.email) return;

        let cancelled = false;
        const checkSubscription = async () => {
// [AUDIT] Removed console.log // line 172
            try {
                // Auth0 currentUser.id is a string sub (e.g. google-oauth2|...), not a UUID.
                // Look up the Supabase profile UUID by email first.
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', currentUser.email)
                    .single();

                if (cancelled) return;
                if (!profile?.id) return;

                const { data: subscriptions, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', profile.id)
                    .eq('status', 'active');
                
                if (cancelled) return;
// [AUDIT] Removed console.log // line 192
                
                if (error) {
                    console.error('[DEBUG] Subscription query error:', error);
                    return;
                }
                
                const hasActiveSubscription = subscriptions && subscriptions.length > 0;
// [AUDIT] Removed console.log // line 200
                setIsPremium(hasActiveSubscription);
            } catch (error) {
                console.error('[DEBUG] Error in checkSubscription:', error);
            }
        };
        checkSubscription();

        return () => { cancelled = true; };
    }, [currentUser?.email]);

    // Debug isPremium changes
    useEffect(() => {
// [AUDIT] Removed console.log // line 213
    }, [isPremium]);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('pilot-recognition-theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

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

// [AUDIT] Removed console.log // line 571

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

    const TILE_FIELD_MAP: Record<string, string> = {
        'License Type': 'current_occupation',
        'License Authority': 'license_issuing_authority',
        'English Level': 'elp_level',
        'Pilot Status': 'current_occupation',
        'bio': 'bio',
        'linkedin': 'linkedin_url',
        'instagram': 'instagram_url',
    };

    const saveTileEdit = async (label: string, value: string) => {
        const field = TILE_FIELD_MAP[label];
        if (!field) return;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await supabase.from('profiles').update({ [field]: value }).eq('id', user.id);
            setProfileData((prev: any) => ({
                ...prev,
                english_proficiency_level: label === 'English Level' ? value : prev?.english_proficiency_level,
                elp_level: label === 'English Level' ? value : prev?.elp_level,
                license_authority: label === 'License Authority' ? value : prev?.license_authority,
                license_issuing_authority: label === 'License Authority' ? value : prev?.license_issuing_authority,
                current_occupation: label === 'Pilot Status' || label === 'License Type' ? value : prev?.current_occupation,
                career_stage: label === 'Pilot Status' ? value : prev?.career_stage,
                bio: label === 'bio' ? value : prev?.bio,
                linkedin_url: label === 'linkedin' ? value : prev?.linkedin_url,
                instagram_url: label === 'instagram' ? value : prev?.instagram_url,
            }));
        } catch (e) {
            console.error('[TILE EDIT] Save failed:', e);
        }
        setEditingTile(null);
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

                const isCipher = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
                const safe = (v: any) => (v && !isCipher(v)) ? v : '';
                const merged = {
                    ...decryptedProfile,
                    user_id: decryptedProfile.id,
                    total_hours: decryptedProfile.total_flight_hours || 0,
                    recent_flight_experience: 'N/A',
                    overall_recognition_score: decryptedProfile.recognition_score || 0,
                    recognition_score: decryptedProfile.recognition_score || 0,
                    license_type: injLicenseType,
                    // Flat readable aliases for walletDisplay fallback lookups
                    license_number:          safe(decryptedProfile.license_number || decryptedProfile.license_id),
                    license_id:              safe(decryptedProfile.license_id || decryptedProfile.license_number),
                    license_authority:       safe(decryptedProfile.license_issuing_authority || decryptedProfile.country_of_license),
                    license_issuing_authority: safe(decryptedProfile.license_issuing_authority || decryptedProfile.country_of_license),
                    country_of_license:      safe(decryptedProfile.country_of_license),
                    elp_level:               safe(decryptedProfile.language_proficiency || decryptedProfile.elp_level),
                    english_proficiency_level: safe(decryptedProfile.language_proficiency || decryptedProfile.elp_level),
                    language_proficiency:    safe(decryptedProfile.language_proficiency || decryptedProfile.elp_level),
                    license_expiry:          safe(decryptedProfile.license_expiry),
                    medical_expiry:          safe(decryptedProfile.medical_expiry),
                    elp_expiry:              safe(decryptedProfile.elp_expiry),
                    license_issue_date:      safe(decryptedProfile.license_issue_date),
                    career_stage:            safe(decryptedProfile.career_stage || decryptedProfile.current_occupation),
                    current_occupation:      safe(decryptedProfile.current_occupation),
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
            // Small delay so loading bar completes before content materialises
            setTimeout(() => setProfileReady(true), 120);
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

    // Animate load progress bar while fetching
    useEffect(() => {
        if (!loading) { setLoadProgress(100); return; }
        setLoadProgress(0);
        const ticks = [10, 25, 45, 62, 78, 88, 94];
        const timers: ReturnType<typeof setTimeout>[] = [];
        ticks.forEach((val, i) => {
            timers.push(setTimeout(() => setLoadProgress(val), 300 + i * 380));
        });
        return () => timers.forEach(clearTimeout);
    }, [loading]);

    if (loading) {
        return (
            <AnimatePresence>
                <motion.div
                    key="profile-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,12,22,0.97)', backdropFilter: 'blur(20px)' }}
                >
                    {/* Wordmark */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{ marginBottom: '2.5rem', textAlign: 'center' }}
                    >
                        <p style={{ margin: 0, fontSize: '1.75rem', fontFamily: 'Arial Black, Helvetica Neue, sans-serif', letterSpacing: '-0.02em', lineHeight: 1 }}>
                            <span style={{ color: '#ffffff' }}>pilot</span>
                            <span style={{ color: '#ef4444' }}>recognition</span>
                            <span style={{ color: '#ffffff' }}>.com</span>
                        </p>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Recognition Profile</p>
                    </motion.div>

                    {/* Animated avatar placeholder */}
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(96,165,250,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                    </motion.div>

                    {/* Loading bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        style={{ width: 260, textAlign: 'center' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>Loading profile data</span>
                            <span style={{ fontSize: '0.6rem', color: 'rgba(96,165,250,0.6)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{loadProgress}%</span>
                        </div>
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                            <motion.div
                                animate={{ width: `${loadProgress}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', borderRadius: 99 }}
                            />
                        </div>
                        <p style={{ marginTop: '0.75rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>Decrypting credentials &amp; syncing recognition score…</p>
                    </motion.div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </motion.div>
            </AnimatePresence>
        );
    }

    const pilotName = profileData?.full_name || 'Pilot Profile';
    const initials = pilotName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    // DEBUG: Show current page state
// [AUDIT] Removed console.log // line 947
        showWalletGate, 
        showWalletView, 
        activeSection, 
        hasUser: !!currentUser 
    });

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
                @keyframes unverified-pulse {
                    0%   { opacity: 0.9; transform: scale(1); }
                    50%  { opacity: 1;   transform: scale(1.02); }
                    100% { opacity: 0.9; transform: scale(1); }
                }
            `}</style>
            {/* Transparent background - parent Portal 2 MeshGradient shows through */}
            {!embedded && <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'transparent' }} />}
            <AnimatePresence>
            {profileReady && (
            <motion.div
                key="profile-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                style={{ position: 'relative', zIndex: 10, display: 'flex', minHeight: embedded ? 'auto' : '100vh' }}
            >
                {/* MSFS 2024 Style Sidebar */}
                {!embedded && (
                    <motion.aside
                        initial={{ opacity: 0, x: -32 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                        width: '280px',
                        flexShrink: 0,
                        padding: '5rem 1rem 2rem 4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        background: 'transparent',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        height: '100vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        boxSizing: 'border-box',
                    }}>
                        {/* Header with chevron like MSFS */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1.5rem',
                            paddingLeft: '0.25rem',
                            overflow: 'hidden',
                            width: '100%'
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            <div style={{ overflow: 'hidden', minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Pilot profile</p>
                                <p style={{ margin: '2px 0 0', fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>My Profile</p>
                            </div>
                        </div>

                        {/* Navigation Items - MSFS 2024 Rectangular Floating Style */}
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                            {[
                                { id: 'overview',   label: 'Overview' },
                                { id: 'statistics', label: 'Licensure & Currency' },
                                { id: 'logbook',    label: 'Digital Flight Logbooks' },
                                { id: 'photos',     label: 'Certificates & Endorsements' },
                                { id: 'identity',   label: 'About & Experience' },
                                { id: 'vault',      label: 'Access Vault', isVault: true },
                                ...(isAdmin ? [{ id: 'admin_dashboard', label: 'Admin Dashboard', isAdmin: true }] : []),
                            ].map((item: any) => {
                                const isAdminItem = item.isAdmin;
                                const isVaultItem = item.isVault;
                                const isVaultActive = isVaultItem && (activeSection === 'vault' || showWalletGate || showWalletView);
                                const isActive = isVaultItem ? isVaultActive : activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id as ProfileSection)}
                                        style={{
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.875rem 1rem',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: isAdminItem
                                                ? (isActive ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.08)')
                                                : isVaultItem
                                                ? (isActive ? '#ffffff' : 'rgba(255,255,255,0.92)')
                                                : isActive
                                                ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.1) 100%)',
                                        border: isAdminItem ? `1px solid ${isActive ? 'rgba(239,68,68,0.6)' : 'rgba(239,68,68,0.25)'}` : isVaultItem ? `2px solid ${isActive ? '#dc2626' : 'rgba(220,38,38,0.4)'}` : 'none',
                                            color: isAdminItem ? '#f87171' : isVaultItem ? '#111827' : '#ffffff',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            textAlign: 'left',
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            boxShadow: isVaultItem
                                                ? (isActive ? '0 4px 20px rgba(220,38,38,0.4)' : '0 4px 20px rgba(0,0,0,0.3)')
                                                : isActive
                                                ? '0 4px 15px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                                                : '0 2px 8px rgba(0,0,0,0.2)',
                                            overflow: 'hidden',
                                            width: '100%',
                                            minWidth: 0
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(29, 78, 216, 0.2) 100%)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.1) 100%)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                                            }
                                        }}
                                    >
                                        {isAdminItem ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#f87171', lineHeight: 1.2 }}>Admin Dashboard</p>
                                                    <p style={{ margin: '1px 0 0', fontSize: '0.55rem', color: '#ef4444', fontWeight: 500 }}>Super Admin Only</p>
                                                </div>
                                            </div>
                                        ) : isVaultItem ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', minWidth: 0 }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                                <div style={{ overflow: 'hidden', minWidth: 0 }}>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#111827', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ color: '#111827' }}>Access </span><span style={{ color: '#dc2626' }}>Wallet</span></p>
                                                    <p style={{ margin: '1px 0 0', fontSize: '0.55rem', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pilot Credential Wallet</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', minWidth: 0 }}>{item.label}</span>
                                        )}
                                        {isActive && (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isVaultItem ? '#dc2626' : 'currentColor'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                    </motion.aside>
                )}

                <main style={{ 
                    position: 'relative', 
                    zIndex: 10, 
                    flex: 1, 
                    maxWidth: embedded ? '100%' : 'none', 
                    margin: embedded ? '0' : '0 0 0 280px', 
                    minHeight: embedded ? 'auto' : '100vh', 
                    overflowY: 'auto', 
                    paddingTop: embedded ? 0 : '1rem'
                }}>

                {/* Recognition Score Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '1rem 1.5rem 0', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
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
                </motion.div>

                {/* ── UPGRADE MODAL (free tier) ── */}
                {showUpgradeModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }} onClick={() => setShowUpgradeModal(false)}>
                        <div style={{ background: 'linear-gradient(160deg,#1a0a0a,#0f172a)', border: '1px solid rgba(229,62,62,0.35)', borderRadius: 16, padding: '2rem', maxWidth: 460, width: '90%', boxShadow: '0 0 60px rgba(229,62,62,0.15)', position: 'relative' }} onClick={e => e.stopPropagation()}>
                            {/* Close */}
                            <button onClick={() => setShowUpgradeModal(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>

                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.2em', color: '#e53e3e', fontWeight: 700, textTransform: 'uppercase' }}>Recognition+ Network</p>
                                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Elevate Your Professional Pilot Identity</h3>
                                </div>
                            </div>

                            {/* Problem hook */}
                            <div style={{ background: 'rgba(229,62,62,0.07)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#fca5a5', lineHeight: 1.6 }}>Airlines reject thousands of <strong style={{ color: '#ff8181' }}>unverified resumes</strong> every month. Prove you are a serious, hireable asset with cryptographically audited credentials.</p>
                            </div>

                            {/* Feature list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
                                {[
                                    { icon: '📒', title: 'Anti-Tamper Logbook Sync', desc: 'Cryptographic hash of every flight — any edit triggers a mismatch alert.' },
                                    { icon: '🏛️', title: 'Authority Node Verification', desc: 'FAA, CAAP, EASA & CASA licence checks via live civil aviation registries.' },
                                    { icon: '⏱️', title: 'Compliance & Expiration Monitor', desc: 'Never bust a medical, type rating, or currency window again.' },
                                    { icon: '🛡️', title: 'Verified Professional Badge', desc: 'Replace ⚠️ Self-Declared with a crimson 🛡️ PilotRecognition Network seal.' },
                                ].map(f => (
                                    <div key={f.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: '1rem', lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{f.icon}</span>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>{f.title}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.4 }}>{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => { setShowUpgradeModal(false); setShowWalletGate(true); }}
                                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#e53e3e,#c53030)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 4px 20px rgba(229,62,62,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                Upgrade to Recognition+
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </button>
                            <p style={{ margin: '0.65rem 0 0', fontSize: '0.65rem', color: '#475569', textAlign: 'center' }}>$99 / year &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Pilot-owned data</p>
                        </div>
                    </div>
                )}

                {/* ── WALLET GATE OVERLAY ── */}
                {showWalletGate && (
                    <WalletLoadingScreen
                        embedded={true}
                        onComplete={() => {
                            // Cancel pressed - go back to overview
                            setShowWalletGate(false);
                            setShowWalletView(false);
                            setActiveSection('overview');
                        }}
                    />
                )}

                {/* ── WALLET VIEW PAGE (post-auth) ── */}
                {showWalletView && (() => {
// [AUDIT] Removed console.log // line 1252
                    return (
                        <WalletPageWithSidebar
                            userId={currentUser?.id}
                            onNavigate={() => setShowWalletView(false)}
                            noSidebar={true}
                        />
                    );
                })()}

                {/* ── ACCESS WALLET BANNER ── */}
                {!showWalletGate && !showWalletView && (activeSection === 'overview' || activeSection === 'statistics') && (
                <div style={{ padding: '1.5rem clamp(1.5rem, 4vw, 3.5rem) 0' }}>
                    <div style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    }}>
                        {/* Top bar — ruby red always */}
                        <div style={{ height: 4, background: 'linear-gradient(90deg,#e53e3e,#c53030)' }} />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem', flexWrap: 'wrap' }}>
                            {/* Icon */}
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff1f1', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                    <line x1="1" y1="10" x2="23" y2="10"/>
                                </svg>
                            </div>

                            {/* Text */}
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4, color: '#0f172a' }}>
                                    Powered By <span style={{ color: '#dc2626' }}>walt.id</span>
                                </p>
                                <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
                                    {isPremium ? 'Access Your Wallet' : 'Pilot Identity Credentials Wallet (PIC)'}
                                </p>
                            </div>

                            {/* CTA button */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
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
                                {!isPremium && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                                {isPremium ? 'Open Wallet' : 'Access Wallet'}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </button>
                            <p style={{ fontSize: 10, color: '#94a3b8', margin: '6px 0 0', textAlign: 'center', lineHeight: 1.4, flexShrink: 0 }}>Upload credentials securely<br/>and encrypted with pilot consent</p>
                            </div>

                            {/* Full-width red notice box */}
                            <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: '10px', padding: '14px 18px', backdropFilter: 'blur(4px)' }}>
                                <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
                                    {isPremium
                                        ? 'Enter your credentials, upload verification documents, and build your Pre-Cleared pilot profile — zero-knowledge encrypted and fully pilot-owned.'
                                        : 'Verify your credentials to international standards — verified flight hours via ATOs, government-compliant licence checks, medical currency monitoring, and full profile readiness for pathway submissions.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* ── OVERVIEW SECTION ── */}
                {!showWalletGate && !showWalletView && activeSection === 'overview' && (
                <motion.section
                    key="overview"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <CategorySection title="Pilot Data" description="Identity, credentials, flight activity, and core hour summaries">
                            <div className="pilot-data-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'stretch' }}>
                                {/* Profile Overview Card - Image 1 Style */}
                                <div style={{ ...baseCardStyle, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'flex-start', height: '100%' }}>
                                    {/* Profile Photo */}
                                    <div style={{ position: 'relative', margin: '0 auto' }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: '#0f172a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.6rem',
                                            fontWeight: 600,
                                            color: 'white',
                                            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5), 0 6px 20px rgba(15, 23, 42, 0.4)',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        title="Click to upload profile photo"
                                        >
                                            {uploadingImage ? (
                                                <div style={{ color: 'white', fontSize: '0.75rem', textAlign: 'center' }}>Uploading...</div>
                                            ) : (
                                                <>
                                                    <ProfileImage
                                                        url={profileData?.profile_image_url}
                                                        publicId={profileData?.profile_image_public_id}
                                                        name={profileData?.full_name}
                                                        size={80}
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
                                                        Change Photo
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        {/* Online indicator */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '3px',
                                            right: '3px',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: '#22c55e',
                                            border: '2px solid #1e293b',
                                            boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.3)'
                                        }} />
                                    </div>

                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />

                                    {/* Name & Title */}
                                    <div>
                                        <h2 style={{ fontSize: '1.1rem', color: '#ffffff', margin: '0 0 0.2rem', fontWeight: 600 }}>{pilotName}</h2>
                                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>
                                            {(() => {
                                                const license = profileData?.license_type || '';
                                                const licenseLower = license.toLowerCase();
                                                if (licenseLower.includes('atpl')) return 'Airline Transport Pilot (ATPL)';
                                                if (licenseLower.includes('cpl')) return 'Commercial Pilot (CPL)';
                                                if (licenseLower.includes('ppl')) return 'Private Pilot (PPL)';
                                                if (licenseLower.includes('spl')) return 'Student Pilot (SPL)';
                                                return 'Pilot — Verification Pending';
                                            })()}
                                        </p>
                                        {/* License Number */}
                                        {profileData?.license_number && (
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                                                #{profileData.license_number} • {profileData?.license_status || 'Current'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Bio Section */}
                                    <div style={{ textAlign: 'left', width: '100%' }}>
                                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.5rem' }}>Bio</p>
                                        <button
                                            onClick={() => setActiveSection('identity')}
                                            style={{ width: '100%', cursor: 'pointer', padding: '12px 16px', background: 'rgba(30,41,59,0.5)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.18s', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.45)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.12)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(30,41,59,0.5)'; }}
                                        >
                                            <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#cbd5e1', letterSpacing: '0.01em' }}>View About &amp; Experience</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                                        </button>
                                    </div>

                                    {/* Social Links — side by side, icon + label below */}
                                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                                        {/* LinkedIn */}
                                        <a
                                            href={profileData?.linkedin_url || '#'}
                                            onClick={e => { if (!profileData?.linkedin_url) { e.preventDefault(); setEditingTile('linkedin'); setTileEditValue(''); } }}
                                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 14px', background: profileData?.linkedin_url ? 'rgba(10,102,194,0.15)' : 'rgba(30,41,59,0.6)', border: `1px solid ${profileData?.linkedin_url ? 'rgba(10,102,194,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', color: profileData?.linkedin_url ? '#0a66c2' : '#64748b', fontSize: '0.65rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s', minWidth: 54 }}
                                            target="_blank" rel="noopener noreferrer"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                            {profileData?.linkedin_url ? 'LinkedIn' : 'Add'}
                                        </a>
                                        {/* Instagram */}
                                        <a
                                            href={profileData?.instagram_url || '#'}
                                            onClick={e => { if (!profileData?.instagram_url) { e.preventDefault(); setEditingTile('instagram'); setTileEditValue(''); } }}
                                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 14px', background: profileData?.instagram_url ? 'rgba(225,48,108,0.15)' : 'rgba(30,41,59,0.6)', border: `1px solid ${profileData?.instagram_url ? 'rgba(225,48,108,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', color: profileData?.instagram_url ? '#e1306c' : '#64748b', fontSize: '0.65rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s', minWidth: 54 }}
                                            target="_blank" rel="noopener noreferrer"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                                            {profileData?.instagram_url ? 'Instagram' : 'Add'}
                                        </a>
                                    </div>

                                    {/* Social Link Editing Panel */}
                                    {(editingTile === 'linkedin' || editingTile === 'instagram') && (
                                        <div style={{ padding: '12px', background: 'rgba(30,41,59,0.8)', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)', marginTop: '0.5rem' }}>
                                            <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#94a3b8' }}>
                                                {editingTile === 'linkedin' ? 'Enter your LinkedIn profile URL' : 'Enter your Instagram profile URL'}
                                            </p>
                                            <input
                                                autoFocus
                                                type="url"
                                                value={tileEditValue}
                                                onChange={e => setTileEditValue(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter') saveTileEdit(editingTile === 'linkedin' ? 'linkedin' : 'instagram', tileEditValue); if (e.key === 'Escape') setEditingTile(null); }}
                                                placeholder={editingTile === 'linkedin' ? 'https://linkedin.com/in/yourprofile' : 'https://instagram.com/yourhandle'}
                                                style={{ width: '100%', padding: '8px 12px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.5)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box', marginBottom: '8px' }}
                                            />
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => saveTileEdit(editingTile === 'linkedin' ? 'linkedin' : 'instagram', tileEditValue)} style={{ padding: '4px 12px', background: '#6366f1', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                                                <button onClick={() => setEditingTile(null)} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '6px', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Credentials Card */}
                                <div style={{ ...baseCardStyle, display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
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
                                    {/* Credential rows — license name left, ID/number right */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                        {(() => {
                                            const licType = (() => { const l = (profileData?.license_type || '').toLowerCase(); if (l.includes('atpl') || l.includes('airline')) return 'ATPL'; if (l.includes('cpl') || l.includes('commercial')) return 'CPL'; if (l.includes('ppl') || l.includes('private')) return 'PPL'; if (l.includes('spl') || l.includes('student')) return 'SPL'; return profileData?.license_type || 'CPL'; })();
                                            const rows = [
                                                { license: `Pilot License — ${licType}`,           id: walletDisplay.licenseNumber || profileData?.license_id || 'Not added' },
                                                { license: 'Class 1 Medical Certificate',           id: profileData?.medical_control_number || 'Not added' },
                                                { license: 'ICAO ELP — English',                    id: walletDisplay.elpLevel ? `Level ${walletDisplay.elpLevel}` : (profileData?.elp_level ? `Level ${profileData.elp_level}` : 'Not added') },
                                                { license: 'Radio / NTC License',                   id: profileData?.ntc_license_number || 'Not added' },
                                                { license: 'Issuing Authority',                     id: walletDisplay.licenseAuthority || profileData?.license_authority || 'Not added' },
                                                { license: 'Issue Date',                            id: profileData?.license_issue_date || 'Not added' },
                                            ];
                                            return rows.map(r => (
                                                <div key={r.license} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, gap: 12 }}>
                                                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500, minWidth: 0 }}>{r.license}</span>
                                                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 700, color: '#e2e8f0', flexShrink: 0, letterSpacing: '0.03em' }}>{r.id}</span>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                    {isPremium && walletDisplay.isVerified && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: '0.6rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.04em', border: '1px solid rgba(34,197,94,0.3)', alignSelf: 'flex-start' }}>
                                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                            Cryptographically Verified
                                        </span>
                                    )}
                                </div>

                                {/* Compliance & Expiration Timeline */}
                                <div style={{ ...baseCardStyle, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Compliance Monitor</p>
                                            <h3 style={{ margin: '0.25rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Expiration Timeline</h3>
                                        </div>
                                    </div>

                                    {/* Compliance rows — fully visible for all tiers, open date inputs */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                        {walletDisplay.complianceRows.map((row, index) => (
                                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#ffffff', borderRadius: 7, border: `1px solid ${ row.status === 'danger' ? 'rgba(239,68,68,0.3)' : row.status === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)' }` }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                                    <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: row.status === 'danger' ? '#ef4444' : row.status === 'warning' ? '#f59e0b' : '#22c55e' }} />
                                                    <span style={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: 500 }}>{row.label}</span>
                                                </div>
                                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: row.days === 'Not added' ? '#dc2626' : (row.status === 'danger' ? '#ef4444' : row.status === 'warning' ? '#f59e0b' : '#22c55e'), minWidth: 64, textAlign: 'right' }}>{row.days || 'Enter date'}</span>
                                            </div>
                                        ))}
                                        {/* Recognition+ Note */}
                                        <div style={{ marginTop: '0.75rem', padding: '12px', background: '#ffffff', borderRadius: 8, border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Recognition+ Access & Benefits</p>
                                            <p style={{ margin: 0, fontSize: '0.65rem', color: '#1e293b', lineHeight: 1.5 }}>
                                                We contact your ATO through <strong style={{ color: '#dc2626' }}>verified verification providers</strong> to ensure your profile is up-to-date. Verified profiles gain <strong style={{ color: '#dc2626' }}>exclusive access</strong> to pathways held by charter and confidential operators.
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                {/* Quick Stats Card - Logbook Sync & Live */}
                                <div style={{
                                    gridColumn: '1 / -1',
                                    background: 'rgba(30, 41, 59, 0.9)',
                                    borderRadius: '20px',
                                    padding: '1.25rem 1.5rem',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.35)'
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: '1.5rem', alignItems: 'stretch' }}>
                                        {/* Left: Logbook Sync & Live Status */}
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '1rem', borderRight: '1px solid rgba(148,163,184,0.2)' }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.55rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase' }}>Logbook Sync</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }} />
                                                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#22c55e' }}>& Live</p>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '1rem' }}>
                                                <p style={{ margin: 0, fontSize: '0.5rem', letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase' }}>Recently Flown</p>
                                                <p style={{ margin: '0.15rem 0 0', fontSize: '0.9rem', fontWeight: 500, color: '#e2e8f0' }}>
                                                    {profileData?.last_flight_date ? new Date(profileData.last_flight_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No recent flights'}
                                                </p>
                                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.55rem', color: '#94a3b8' }}>
                                                    via {profileData?.active_logbook_provider || 'Wallet'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Center: Recent Flight Details */}
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 1rem' }}>
                                            {profileData?.recent_flight ? (
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.65rem', letterSpacing: '0.1em', color: '#94a3b8', textTransform: 'uppercase' }}>Aircraft Tail Number</p>
                                                    <p style={{ margin: '0.3rem 0 0', fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{profileData.recent_flight.tail_number || '—'}</p>
                                                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px' }}>
                                                        <p style={{ margin: 0, fontSize: '0.6rem', color: '#94a3b8' }}>Duration</p>
                                                        <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
                                                            {(() => {
                                                                const hours = Math.floor((profileData.recent_flight.duration_minutes || 0) / 60);
                                                                const mins = (profileData.recent_flight.duration_minutes || 0) % 60;
                                                                return `${hours}<span style="color:#dc2626">+</span>${mins.toString().padStart(2, '0')}`;
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ textAlign: 'center', opacity: 0.6 }}>
                                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" style={{ margin: '0 auto' }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>No flight data available</p>
                                                    {!isPremium && (
                                                        <button
                                                            onClick={() => setShowUpgradeModal(true)}
                                                            style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', background: 'linear-gradient(135deg,#dc2626,#991b1b)', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '0.6rem', fontWeight: 600, cursor: 'pointer' }}
                                                        >
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                                            Connect Live Logbook
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Total Verified Hours */}
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: '1rem', borderLeft: '1px solid rgba(148,163,184,0.2)' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0, fontSize: '0.55rem', letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase' }}>Total Time</p>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '2px' }}>
                                                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>{(profileData?.verified_hours || profileData?.total_hours || 0).toLocaleString()}</p>
                                                    <span style={{ padding: '2px 6px', background: 'linear-gradient(135deg,#dc2626,#991b1b)', borderRadius: '10px', fontSize: '0.55rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Recognition+</span>
                                                </div>
                                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.6rem', color: '#64748b' }}>Verified Hours</p>
                                            </div>
                                            <div style={{ textAlign: 'right', marginTop: '0.75rem' }}>
                                                <p style={{ margin: 0, fontSize: '0.5rem', letterSpacing: '0.1em', color: '#475569', textTransform: 'uppercase' }}>TTL Countdown</p>
                                                <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>
                                                    {profileData?.next_verification_due ? 
                                                        `${Math.ceil((new Date(profileData.next_verification_due).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d` : 
                                                        'N/A'}
                                                </p>
                                                <p style={{ margin: '0.1rem 0 0', fontSize: '0.5rem', color: '#64748b' }}>until re-verification</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recognition+ Ad Banner */}
                            <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(153, 27, 27, 0.1) 100%)', borderRadius: '12px', border: '1px solid rgba(220, 38, 38, 0.3)', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.6, fontWeight: 500 }}>
                                    <span style={{ color: '#dc2626', fontWeight: 700 }}>Get verified. Get recognition.</span> Unlock exclusive pathways. Submit interests and get international recognition worldwide. Connect with existing ATOs, flight schools, type rating centers, airlines, operators and manufacturers to learn how to align your profile with their expectations and their requirements.{' '}
                                    <span style={{ color: '#dc2626', fontWeight: 700 }}>Start flight planning your pilot career with Recognition+</span>
                                </p>
                            </div>
                        </CategorySection>

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
// [AUDIT] Removed console.log // line 1712
                                        }}
                                        onViewProgram={(program: string) => onNavigate(`program/${program}`)}
                                        onViewTraining={(trainingId: string) => onNavigate(`training/${trainingId}`)}
                                    />
                                </div>
                            )}
                        </div>


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
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    setUrlCopied(true);
                                                    setTimeout(() => setUrlCopied(false), 2000);
                                                }}
                                                style={{ padding: '0.5rem 1rem', background: urlCopied ? '#e6fffa' : 'white', border: '1px solid #fca5a5', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 500, color: urlCopied ? '#234e52' : '#b91c1c', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                            >
                                                {urlCopied ? '✓ URL Copied!' : 'Copy shareable resume URL'}
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
                                                    <button onClick={() => setCurrentDocumentationPage('logbook')} style={{ marginTop: '8px', background: 'none', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '6px', color: '#60a5fa', cursor: 'pointer', padding: '2px 8px', fontSize: '0.62rem', fontWeight: 600, display: 'block', width: '100%' }}>Sync Logbook →</button>
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
                                                    {(() => {
                                                        const hasVerifiedHours = isPremium && (profileData?.total_hours || 0) > 0;
                                                        return (
                                                            <span style={{ fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', color: hasVerifiedHours ? '#10b981' : '#f59e0b' }}>
                                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: hasVerifiedHours ? '#10b981' : '#f59e0b' }}></span>
                                                                {hasVerifiedHours ? 'Verified' : 'Self-Declared Profile'}
                                                            </span>
                                                        );
                                                    })()}
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
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                                                        {['ppl', 'cpl', 'ir', 'multi_engine', 'student'].map((license) => (
                                                            <span key={license} style={{ 
                                                                fontSize: '0.65rem', 
                                                                fontWeight: 700, 
                                                                color: '#ffffff',
                                                                background: 'rgba(59, 130, 246, 0.2)',
                                                                padding: '0.15rem 0.4rem',
                                                                borderRadius: '0.25rem',
                                                                border: '1px solid rgba(59, 130, 246, 0.4)',
                                                                textTransform: 'uppercase',
                                                                whiteSpace: 'nowrap'
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
                                                    {(() => {
                                                        const expiry = profileData?.medical_expiry ? new Date(profileData.medical_expiry) : null;
                                                        const now = new Date();
                                                        const daysOut = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / 86400000) : null;
                                                        const isExpired = daysOut !== null && daysOut <= 0;
                                                        const isUrgent = daysOut !== null && daysOut > 0 && daysOut <= 30;
                                                        const color = isExpired ? '#ef4444' : isUrgent ? '#f59e0b' : '#10b981';
                                                        const label = isExpired ? 'Expired' : isUrgent ? `Expires in ${daysOut}d` : expiry ? `Valid Until ${expiry.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}` : 'Class 1 Valid';
                                                        return (
                                                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }}></span>
                                                                {label}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Last Flown</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.last_flown || 'Not Available'}</span>
                                                </div>
                                                <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Recognition Score</span>
                                                    <span title={!profileData?.overall_recognition_score ? 'Score populates automatically upon logbook and license verification.' : undefined} style={{ fontSize: '1.25rem', fontWeight: 700, color: profileData?.overall_recognition_score ? '#ffffff' : '#64748b', cursor: !profileData?.overall_recognition_score ? 'help' : 'default' }}>
                                                        {profileData?.overall_recognition_score ? `${profileData.overall_recognition_score}/100` : '— / 100'}
                                                    </span>
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
                                                {profileData?.why_become_pilot || (
                                                    (profileData?.current_occupation || '').toLowerCase().includes('student')
                                                        ? 'Completing foundational flight maneuvers, cross-country navigation, and instrument training hours toward CPL requirements.'
                                                        : 'Providing flight instruction for PPL and CPL students. Specializing in instrument training and multi-engine operations.'
                                                )}
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

                        {/* Recommended Pathways Carousel - ADMIN ONLY */}
                        {isAdmin && (
                        <>
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
                </>
                )}
                </motion.section>
                )}

                {/* ── LICENSURE & CURRENCY SECTION ── */}
                {!showWalletGate && !showWalletView && activeSection === 'statistics' && (
                <motion.section
                    key="statistics"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                        {/* Pilot Licensure & Experience Data Entry — Moved from Overview */}
                        <CategorySection title="Official Documentation" description="Verification & Resumes">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{
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
                                        <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1.25rem', color: '#ffffff' }}>Pilot Licensure & Experience Data Entry</h3>
                                        <p style={{ margin: 0, color: '#a0aec0', fontSize: '0.95rem', lineHeight: 1.5 }}>Access your comprehensive digital flight log with detailed flight records, aircraft types, and operational experience.</p>
                                    </div>
                                    <button
                                        style={{
                                            padding: '8px 16px',
                                            minWidth: 180,
                                            borderRadius: '999px',
                                            border: '1px solid rgba(148,163,184,0.25)',
                                            background: 'rgba(255,255,255,0.03)',
                                            color: '#94a3b8',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap' as const,
                                            textAlign: 'center' as const
                                        }}
                                        onClick={() => setCurrentDocumentationPage('licensure')}
                                    >
                                        Open Data Entry
                                    </button>
                                </div>
                            </div>
                        </CategorySection>

                        {/* ── ROW 1: Pilot License Card + Verification Status ── */}
                        <CategorySection title="Pilot Licence" description="Active licence details pulled from your credential wallet">
                            <div className="pilot-data-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

                                {/* Main licence card */}
                                <div style={{ ...baseCardStyle, background: 'linear-gradient(145deg, rgba(17,24,39,0.95) 0%, rgba(30,41,59,0.85) 100%)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                                    {/* subtle grid lines */}
                                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.22em', color: '#64748b', textTransform: 'uppercase' }}>Civil Aviation Authority</p>
                                                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>{walletDisplay.licenseAuthority || 'Not added'}</h3>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0, fontSize: '0.58rem', letterSpacing: '0.15em', color: '#64748b', textTransform: 'uppercase' }}>Licence No.</p>
                                                <p style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '0.08em' }}>{walletDisplay.licenseNumber || '—'}</p>
                                            </div>
                                        </div>
                                        {/* Licence type banner */}
                                        <div style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem' }}>
                                            <p style={{ margin: 0, fontSize: '0.62rem', color: '#93c5fd', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Licence Type</p>
                                            <p style={{ margin: '3px 0 0', fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.license_type || profileData?.current_occupation || 'Commercial Pilot Licence (CPL)'}</p>
                                        </div>
                                        {/* Key fields grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                            {[
                                                { label: 'Issue Date', value: profileData?.license_issue_date || '—' },
                                                { label: 'Expiry Date', value: walletDisplay.licenseExpiry || profileData?.license_expiry || '—' },
                                                { label: 'Status', value: walletDisplay.licenseStatus === 'verified' ? 'Verified ✓' : walletDisplay.licenseStatus === 'unverified' ? 'Self-Declared' : walletDisplay.licenseStatus || 'Active' },
                                                { label: 'ELP Level', value: walletDisplay.elpLevel || '—' },
                                            ].map(f => (
                                                <div key={f.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '7px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                    <p style={{ margin: 0, fontSize: '0.57rem', color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{f.label}</p>
                                                    <p style={{ margin: '3px 0 0', fontSize: '0.8rem', fontWeight: 600, color: f.value === '—' ? '#475569' : '#e2e8f0', fontFamily: f.label.includes('Date') ? 'monospace' : 'inherit' }}>{f.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Ratings row */}
                                        {profileData?.ratings?.length > 0 && (
                                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                                <p style={{ margin: '0 0 6px', fontSize: '0.58rem', color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Ratings & Endorsements</p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                                    {(profileData.ratings as string[]).map((r: string) => (
                                                        <span key={r} style={{ padding: '3px 9px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, fontSize: '0.68rem', color: '#93c5fd' }}>{r}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Verification status card */}
                                <div style={{ ...baseCardStyle, alignSelf: 'start' }}>
                                    <p style={{ margin: '0 0 0.85rem', fontSize: '0.62rem', letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Wallet Verification Status</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {(injectedWalletData?.credentials?.length
                                            ? injectedWalletData.credentials
                                            : [
                                                { check_type: 'professional_qualification', status: 'pending' },
                                                { check_type: 'education', status: 'pending' },
                                                { check_type: 'language_proficiency', status: 'pending' },
                                                { check_type: 'identity', status: 'pending' },
                                            ]
                                        ).map((c: any) => {
                                            const labels: Record<string, string> = {
                                                professional_qualification: 'Pilot Licence (CPL/ATPL)',
                                                education: 'Medical Certificate',
                                                language_proficiency: 'ICAO ELP Certificate',
                                                identity: 'Identity / Passport',
                                                fitness_proprietary: 'Background / NBI',
                                                type_rating: 'Type Rating Certificate',
                                            };
                                            const sc = { verified: { dot: '#22c55e', text: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', label: 'Verified' }, pending: { dot: '#3b82f6', text: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', label: 'Pending' }, expired: { dot: '#ef4444', text: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', label: 'Expired' }, flagged: { dot: '#f59e0b', text: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', label: 'Flagged' } }[c.status as string] || { dot: '#64748b', text: '#94a3b8', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', label: c.status };
                                            return (
                                                <div key={c.check_type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 8 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, flexShrink: 0, display: 'inline-block' }} />
                                                        <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 500 }}>{labels[c.check_type] || c.check_type}</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sc.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {!isPremium && (
                                        <div style={{ marginTop: '0.875rem', padding: '8px 12px', background: 'rgba(236,201,75,0.06)', borderLeft: '3px solid #ecc94b', borderRadius: '0 6px 6px 0' }}>
                                            <p style={{ margin: '0 0 4px', fontSize: '0.63rem', color: '#94a3b8', lineHeight: 1.4 }}>Cryptographic verification requires Recognition+</p>
                                            <button onClick={() => setShowUpgradeModal(true)} style={{ background: 'none', border: 'none', color: '#ff8181', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>🛡️ Upgrade to Verify</button>
                                        </div>
                                    )}
                                </div>

                                {/* ELP & Language card */}
                                <div style={{ ...baseCardStyle, alignSelf: 'start' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Language Proficiency</p>
                                            <h3 style={{ margin: '0.2rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>ICAO ELP Rating</h3>
                                        </div>
                                        <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
                                            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>{walletDisplay.elpLevel || '—'}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.55rem', color: '#7c3aed', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Level</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {[
                                            { label: 'Standard', value: 'ICAO Language Proficiency Rating Scale' },
                                            { label: 'Expiry', value: profileData?.elp_expiry || '—' },
                                            { label: 'Certificate No.', value: profileData?.elp_certificate_no || '—' },
                                            { label: 'Issuing Body', value: walletDisplay.licenseAuthority || '—' },
                                        ].map(f => (
                                            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <span style={{ fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.05em' }}>{f.label}</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: f.value === '—' ? '#475569' : '#e2e8f0', fontFamily: f.label.includes('No') || f.label.includes('Expiry') ? 'monospace' : 'inherit' }}>{f.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CategorySection>

                        {/* ── ROW 2: Medical Certificate + Compliance Timeline ── */}
                        <CategorySection title="Medical Currency" description="Class certificates and expiration tracking from your wallet">
                            <div className="pilot-data-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

                                {/* Medical cert card */}
                                <div style={{ ...baseCardStyle, position: 'relative', overflow: 'hidden' }}>
                                    {(() => {
                                        const medExpiry = profileData?.medical_expiry;
                                        const isExpired = medExpiry ? new Date(medExpiry) < new Date() : false;
                                        const daysLeft = medExpiry ? Math.ceil((new Date(medExpiry).getTime() - Date.now()) / 86400000) : null;
                                        const accent = isExpired ? '#ef4444' : daysLeft !== null && daysLeft < 60 ? '#f59e0b' : '#22c55e';
                                        return (
                                            <>
                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Medical Certificate</p>
                                                        <h3 style={{ margin: '0.2rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>{profileData?.medical_class || 'Class 1'}</h3>
                                                    </div>
                                                    <div style={{ background: isExpired ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${isExpired ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.25)'}`, borderRadius: 8, padding: '5px 10px' }}>
                                                        <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{isExpired ? '⚠ EXPIRED' : daysLeft !== null ? `${daysLeft}d left` : 'Active'}</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                                    {[
                                                        { label: 'Class', value: profileData?.medical_class || '—' },
                                                        { label: 'Expiry', value: medExpiry || '—' },
                                                        { label: 'Country', value: profileData?.medical_country || '—' },
                                                        { label: 'Examiner', value: '—' },
                                                    ].map(f => (
                                                        <div key={f.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '7px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                            <p style={{ margin: 0, fontSize: '0.57rem', color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{f.label}</p>
                                                            <p style={{ margin: '3px 0 0', fontSize: '0.8rem', fontWeight: 600, color: f.value === '—' ? '#475569' : '#e2e8f0', fontFamily: f.label === 'Expiry' ? 'monospace' : 'inherit' }}>{f.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                {isExpired && (
                                                    <div style={{ marginTop: '0.75rem', padding: '8px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
                                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#fca5a5', lineHeight: 1.4 }}>⚠️ Your Class 1 medical has expired — CPL is currently invalid for commercial operations.</p>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Full compliance timeline */}
                                <div style={{ ...baseCardStyle, alignSelf: 'start' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Compliance Monitor</p>
                                            <h3 style={{ margin: '0.2rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Expiration Timeline</h3>
                                        </div>
                                        {!isPremium && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#ecc94b', color: '#1a202c', fontSize: '0.58rem', fontWeight: 800, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>⚠ Unverified</span>}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {walletDisplay.complianceRows.map(row => (
                                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 11px', background: '#ffffff', borderRadius: 8, border: `1px solid ${row.status === 'danger' ? 'rgba(239,68,68,0.3)' : row.status === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)'}` }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: row.status === 'danger' ? '#ef4444' : row.status === 'warning' ? '#f59e0b' : '#22c55e' }} />
                                                    <span style={{ fontSize: '0.72rem', color: '#1e293b', fontWeight: 500 }}>{row.label}</span>
                                                </div>
                                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: row.days === 'Not added' ? '#dc2626' : (row.status === 'danger' ? '#ef4444' : row.status === 'warning' ? '#f59e0b' : '#22c55e'), minWidth: 70, textAlign: 'right' }}>{row.days || 'Not added'}</span>
                                            </div>
                                        ))}
                                        {/* Recognition+ Note */}
                                        <div style={{ marginTop: '0.75rem', padding: '12px', background: '#ffffff', borderRadius: 8, border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Recognition+ Access & Benefits</p>
                                            <p style={{ margin: 0, fontSize: '0.65rem', color: '#1e293b', lineHeight: 1.5 }}>
                                                We contact your ATO through <strong style={{ color: '#dc2626' }}>verified verification providers</strong> to ensure your profile is up-to-date. Verified profiles gain <strong style={{ color: '#dc2626' }}>exclusive access</strong> to pathways held by charter and confidential operators.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* NTC / Radio licence card */}
                                <div style={{ ...baseCardStyle, alignSelf: 'start' }}>
                                    <p style={{ margin: '0 0 0.85rem', fontSize: '0.62rem', letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Radio Licence (NTC)</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {[
                                            { label: 'Registration No.', value: profileData?.ntc_license || profileData?.radio_license_number || '—' },
                                            { label: 'Expiry', value: profileData?.radio_license_expiry || profileData?.ntc_expiry || '—' },
                                            { label: 'Issued By', value: 'National Telecommunications Commission' },
                                            { label: 'Privileges', value: 'Radio Telephone Operator' },
                                        ].map(f => (
                                            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <span style={{ fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.04em', flexShrink: 0, paddingRight: 8 }}>{f.label}</span>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: f.value === '—' ? '#475569' : '#e2e8f0', fontFamily: f.label.includes('No') || f.label.includes('Expiry') ? 'monospace' : 'inherit', textAlign: 'right' }}>{f.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CategorySection>

                        {/* ── ROW 3: Ratings & Type Ratings ── */}
                        <CategorySection title="Ratings & Type Ratings" description="Aircraft categories, class ratings, and type certificates held">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                                <div style={{ ...baseCardStyle }}>
                                    <p style={{ margin: '0 0 0.85rem', fontSize: '0.62rem', letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Aircraft Ratings</p>
                                    {(profileData?.ratings?.length > 0 || profileData?.aircraft_rated_on) ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {(profileData?.ratings?.length > 0 ? profileData.ratings : [profileData?.aircraft_rated_on]).filter(Boolean).map((r: string) => (
                                                <span key={r} style={{ padding: '5px 12px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 20, fontSize: '0.72rem', color: '#93c5fd', fontWeight: 500 }}>{r}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {['Airplane Single Engine Land', 'Instrument Rating (IR)'].map(r => (
                                                <span key={r} style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 20, fontSize: '0.72rem', color: '#475569' }}>{r}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ ...baseCardStyle }}>
                                    <p style={{ margin: '0 0 0.85rem', fontSize: '0.62rem', letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Type Ratings</p>
                                    {profileData?.type_ratings?.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {(profileData.type_ratings as string[]).map((r: string) => (
                                                <span key={r} style={{ padding: '5px 12px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, fontSize: '0.72rem', color: '#34d399', fontWeight: 500 }}>{r}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0 }}>No type ratings on file — add via Licensure form</p>
                                    )}
                                </div>
                                <div style={{ ...baseCardStyle }}>
                                    <p style={{ margin: '0 0 0.85rem', fontSize: '0.62rem', letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Certifications</p>
                                    {profileData?.certifications?.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {(profileData.certifications as string[]).map((c: string) => (
                                                <span key={c} style={{ padding: '5px 12px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, fontSize: '0.72rem', color: '#fbbf24', fontWeight: 500 }}>{c}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0 }}>No certifications recorded</p>
                                    )}
                                </div>
                            </div>
                        </CategorySection>

                    </div>
                </motion.section>
                )}

                {/* ── LOGBOOK SECTION ── */}
                {!showWalletGate && !showWalletView && activeSection === 'logbook' && (
                <motion.section
                    key="logbook"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem', paddingBottom: '80px' }}>

                    {/* Official Documentation — Moved from Overview */}
                    <div style={{ marginBottom: '2rem' }}>
                        <CategorySection title="Official Documentation" description="Verification & Resumes">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{
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
                                        <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1.25rem', color: '#ffffff' }}>Digital Flight Logbook</h3>
                                        <p style={{ margin: 0, color: '#a0aec0', fontSize: '0.95rem', lineHeight: 1.5 }}>View your complete collection of licenses, flight hours, certifications, and professional milestones.</p>
                                    </div>
                                    <button
                                        style={{
                                            padding: '8px 16px',
                                            minWidth: 180,
                                            borderRadius: '999px',
                                            border: '1px solid rgba(148,163,184,0.25)',
                                            background: 'rgba(255,255,255,0.03)',
                                            color: '#94a3b8',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap' as const,
                                            textAlign: 'center' as const
                                        }}
                                        onClick={() => setCurrentDocumentationPage('logbook')}
                                    >
                                        View Logbook
                                    </button>
                                </div>
                            </div>
                        </CategorySection>
                    </div>

                    <DigitalLogbookPage
                        embedded
                        onBack={() => setActiveSection('overview')}
                        userProfile={profileData ? {
                            id: profileData.id || profileData.user_id,
                            uid: profileData.id || profileData.user_id,
                            firstName: profileData.full_name?.split(' ')[0] || profileData.display_name?.split(' ')[0] || '',
                            lastName: profileData.full_name?.split(' ').slice(1).join(' ') || '',
                            email: profileData.email || '',
                        } : null}
                    />

                    {/* Flight Hours Summary — Moved from Overview */}
                    <div style={{ marginTop: '2rem' }}>
                        <CategorySection title="Flight Hours Summary" description="Your verified and self-declared flight hours">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Flight Hours & Recognition Score Tiles */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', width: '100%' }}>
                                    <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <p style={{ margin: 0, fontSize: '0.58rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase' }}>Flight Hours</p>
                                        <p style={{ margin: '0.3rem 0 0', fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>{(profileData?.total_hours || 0).toLocaleString()}</p>
                                        {profileData?.veremark_verified ? (
                                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.65rem', color: '#22c55e' }}>✓ Verified via Veremark</p>
                                        ) : (
                                            <button
                                                onClick={() => isPremium ? setShowWalletGate(true) : setShowUpgradeModal(true)}
                                                style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'linear-gradient(135deg,#e53e3e,#c53030)', border: 'none', borderRadius: 20, color: '#fff', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(229,62,62,0.3)' }}
                                            >
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                                Sync Logbook
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <p style={{ margin: 0, fontSize: '0.58rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase' }}>Recognition Score</p>
                                        <p style={{ margin: '0.3rem 0 0', fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.overall_recognition_score || 0}</p>
                                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.62rem', color: isPremium ? '#f59e0b' : '#64748b' }}>
                                            {isPremium ? 'Tier 2: Advanced' : 'Upgrade to unlock'}
                                        </p>
                                    </div>
                                </div>

                                {/* Logbook Hour Breakdown — DUAL XC, XC PIC, PIC LCL, DUAL LCL */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', width: '100%' }}>
                                    <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px', padding: '0.6rem', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '0.5rem', letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase' }}>DUAL XC</p>
                                        <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{(profileData?.dual_xc_hours || 0).toLocaleString()}</p>
                                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.55rem', color: '#475569' }}>Dual Cross Country</p>
                                    </div>
                                    <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px', padding: '0.6rem', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '0.5rem', letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase' }}>XC PIC</p>
                                        <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{(profileData?.xc_pic_hours || 0).toLocaleString()}</p>
                                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.55rem', color: '#475569' }}>Cross Country PIC</p>
                                    </div>
                                    <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px', padding: '0.6rem', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '0.5rem', letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase' }}>PIC LCL</p>
                                        <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{(profileData?.pic_local_hours || 0).toLocaleString()}</p>
                                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.55rem', color: '#475569' }}>PIC Local</p>
                                    </div>
                                    <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px', padding: '0.6rem', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '0.5rem', letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase' }}>DUAL LCL</p>
                                        <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{(profileData?.dual_local_hours || 0).toLocaleString()}</p>
                                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.55rem', color: '#475569' }}>Dual Local</p>
                                    </div>
                                </div>
                            </div>
                        </CategorySection>
                    </div>

                    {/* ATO Hour Verification — Pillar 5 */}
                    <div style={{ marginTop: '2rem' }}>
                        <CategorySection title="ATO Hour Verification" description="Pillar 5 — Have your flight school verify your training hours for operator trust">
                            <ATOVerificationRequestSection />
                        </CategorySection>
                    </div>
                </motion.section>
                )}

                {/* ── PHOTOS SECTION ── */}
                {!showWalletGate && !showWalletView && activeSection === 'photos' && (
                <motion.section
                    key="photos"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <CategorySection title="Photo Album" description="Your aviation memories and achievements">
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(30,41,59,0.6), rgba(15,23,42,0.8))',
                                borderRadius: '16px',
                                padding: '3rem',
                                border: '1px dashed rgba(255,255,255,0.2)',
                                textAlign: 'center'
                            }}>
                                <ImageIcon size={48} style={{ color: '#64748b', marginBottom: '1rem' }} />
                                <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '0.5rem' }}>Photo album coming soon</p>
                                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Upload and organize your flight photos, certificates, and memories</p>
                            </div>
                        </CategorySection>

                        <CategorySection title="Examination Results" description="Verified exam scores and subcategory breakdowns">
                            <div style={{
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
                                    <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1.25rem', color: '#ffffff' }}>Examination Results</h3>
                                    <p style={{ margin: 0, color: '#a0aec0', fontSize: '0.95rem', lineHeight: 1.5 }}>Dive into your latest verified exam scores and subcategory breakdowns.</p>
                                </div>
                                <button
                                    style={{
                                        padding: '8px 16px',
                                        minWidth: 180,
                                        borderRadius: '999px',
                                        border: '1px solid rgba(148,163,184,0.25)',
                                        background: 'rgba(255,255,255,0.03)',
                                        color: '#94a3b8',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap' as const,
                                        textAlign: 'center' as const
                                    }}
                                    onClick={() => setCurrentDocumentationPage('examination')}
                                >
                                    View Examination Directory
                                </button>
                            </div>
                        </CategorySection>
                    </div>
                </motion.section>
                )}

                {/* ── IDENTITY SECTION ── */}
                {!showWalletGate && !showWalletView && activeSection === 'identity' && (
                <motion.section
                    key="identity"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <CategorySection title="Customize Identity" description="Personalize your pilot profile and preferences">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ ...baseCardStyle }}>
                                    <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#ffffff' }}>Profile Picture</h4>
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        background: '#0f172a',
                                        margin: '0 auto 1rem',
                                        overflow: 'hidden',
                                        cursor: 'pointer'
                                    }} onClick={() => fileInputRef.current?.click()}>
                                        <ProfileImage
                                            url={profileData?.profile_image_url}
                                            publicId={profileData?.profile_image_public_id}
                                            name={profileData?.full_name}
                                            size={120}
                                            className="w-full h-full"
                                            fallbackClassName="rounded-full bg-slate-900 text-white text-3xl"
                                        />
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
                                    <button onClick={() => fileInputRef.current?.click()} style={{
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(59,130,246,0.2)',
                                        border: '1px solid rgba(59,130,246,0.4)',
                                        borderRadius: '8px',
                                        color: '#60a5fa',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}>Change Photo</button>
                                </div>
                                <div style={{ ...baseCardStyle }}>
                                    <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#ffffff' }}>Display Name</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{profileData?.full_name || 'Not set'}</p>
                                    <button style={{
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        color: '#94a3b8',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}>Edit in Settings</button>
                                </div>
                            </div>
                        </CategorySection>

                        {/* Professional Interests - About & Experience */}
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
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflow: 'hidden' }}>
                                        {profileData?.pathway_interests?.map((interest: string, index: number) => (
                                            <span key={index} style={{ padding: '0.35rem 0.85rem', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {interest}
                                            </span>
                                        )) || (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {['Commercial Aviation', 'Type Rating', 'Long-Haul Ops'].map(suggestion => (
                                                    <button key={suggestion} style={{ padding: '0.3rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(148,163,184,0.3)', borderRadius: '999px', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,62,62,0.5)'; e.currentTarget.style.color = '#ff8181'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; e.currentTarget.style.color = '#64748b'; }}
                                                    >+ {suggestion}</button>
                                                ))}
                                                <button style={{ padding: '0.3rem 0.75rem', background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '999px', color: '#e53e3e', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>+ Add Goals</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ ...baseCardStyle }}>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Insight Interests</p>
                                        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Learning Goals</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', overflow: 'hidden' }}>
                                        {profileData?.insight_interests?.map((interest: string, index: number) => (
                                            <span key={index} style={{ padding: '0.35rem 0.85rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {interest}
                                            </span>
                                        )) || (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {['ATPL Theory', 'CRM & Safety', 'Aviation Regulations'].map(suggestion => (
                                                    <button key={suggestion} style={{ padding: '0.3rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(148,163,184,0.3)', borderRadius: '999px', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,62,62,0.5)'; e.currentTarget.style.color = '#ff8181'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; e.currentTarget.style.color = '#64748b'; }}
                                                    >+ {suggestion}</button>
                                                ))}
                                                <button style={{ padding: '0.3rem 0.75rem', background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '999px', color: '#e53e3e', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>+ Select Topics</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CategorySection>

                        {/* About You - Personal Statement & Skills */}
                        <CategorySection title="About You" description="Personal details and aspirations">
                            <div style={{ ...baseCardStyle }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    {/* Why You Want to Become a Pilot — long-form statement */}
                                    <div style={{ borderRadius: '14px', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(30, 41, 59, 0.6)' }}>
                                        <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Why You Want to Become a Pilot</div>
                                        {profileData?.why_become_pilot ? (
                                            <div style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.6 }}>{profileData.why_become_pilot}</div>
                                        ) : (
                                            <button
                                                onClick={() => onNavigate('pilot-licensure-experience')}
                                                style={{ width: '100%', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(148,163,184,0.3)', borderRadius: '10px', color: '#64748b', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s ease', textAlign: 'left' as const }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(229,62,62,0.5)'; e.currentTarget.style.color = '#ff8181'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; e.currentTarget.style.color = '#64748b'; }}
                                            >
                                                <Plus size={14} />
                                                <span><strong style={{ fontWeight: 700 }}>+ Add Personal Statement</strong> &nbsp;—&nbsp; Share your career vision for airline recruiters.</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Other Skills — modular tag-style */}
                                    <div style={{ borderRadius: '14px', padding: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(30, 41, 59, 0.6)' }}>
                                        <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Other Skills</div>
                                        {profileData?.other_skills ? (
                                            <div style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.5 }}>{profileData.other_skills}</div>
                                        ) : (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {['Flight Instructor', 'CRM Trained', 'Fluent in Spanish'].map(s => (
                                                    <button key={s} style={{ padding: '0.3rem 0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(148,163,184,0.3)', borderRadius: '999px', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(229,62,62,0.5)'; e.currentTarget.style.color = '#ff8181'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; e.currentTarget.style.color = '#64748b'; }}
                                                    >+ {s}</button>
                                                ))}
                                                <button
                                                    onClick={() => onNavigate('pilot-licensure-experience')}
                                                    style={{ padding: '0.3rem 0.75rem', background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '999px', color: '#e53e3e', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                                >+ Add Skills</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CategorySection>
                    </div>
                </motion.section>
                )}

                {/* ── VAULT SECTION ── */}
                {!showWalletGate && !showWalletView && activeSection === 'vault' && (
                <motion.section
                    key="vault"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Operator View</p>
                                <h2 style={{ margin: '0.3rem 0 0.5rem', fontSize: '1.5rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Access Vault</h2>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', maxWidth: 520 }}>This is exactly what airlines and operators see when they pull your profile. Edit the fields below to control your public-facing identity.</p>
                            </div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: isPremium ? 'rgba(34,197,94,0.12)' : 'rgba(236,201,75,0.1)', border: `1px solid ${isPremium ? 'rgba(34,197,94,0.3)' : 'rgba(236,201,75,0.3)'}`, borderRadius: 8, padding: '6px 14px' }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: isPremium ? '#22c55e' : '#ecc94b', flexShrink: 0, display: 'inline-block' }} />
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isPremium ? '#22c55e' : '#ecc94b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{isPremium ? 'Verified Profile' : 'Unverified — Upgrade to Recognition+'}</span>
                            </div>
                        </div>

                        {/* Operator preview card */}
                        <div style={{ ...baseCardStyle, border: '2px solid rgba(59,130,246,0.25)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 12, right: 14, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, padding: '3px 10px' }}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#60a5fa', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Operator View</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                                    {profileData?.profile_image_url
                                        ? <img src={profileData.profile_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{(profileData?.full_name || 'P').charAt(0).toUpperCase()}</span>
                                    }
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{profileData?.full_name || profileData?.display_name || 'Pilot Name'}</p>
                                    <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{profileData?.license_type || profileData?.current_occupation || 'Commercial Pilot License'} · {profileData?.country_of_license || profileData?.nationality || 'Unknown Authority'}</p>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>{profileData?.total_hours || 0} total hours · {profileData?.license_number || profileData?.license_id || 'License pending'}</p>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                                {[
                                    { label: 'License', value: profileData?.license_type || profileData?.current_occupation || '—' },
                                    { label: 'Authority', value: profileData?.license_issuing_authority || profileData?.country_of_license || '—' },
                                    { label: 'ELP', value: profileData?.language_proficiency || profileData?.elp_level || '—' },
                                    { label: 'Hours', value: profileData?.total_hours ? `${profileData.total_hours} hrs` : '—' },
                                    { label: 'Medical', value: profileData?.medical_class || '—' },
                                    { label: 'Home Base', value: profileData?.domicile || profileData?.country || '—' },
                                ].map(f => (
                                    <div key={f.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <p style={{ margin: 0, fontSize: '0.58rem', color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{f.label}</p>
                                        <p style={{ margin: '3px 0 0', fontSize: '0.82rem', fontWeight: 600, color: f.value === '—' ? '#475569' : '#e2e8f0' }}>{f.value}</p>
                                    </div>
                                ))}
                            </div>
                            {profileData?.bio && (
                                <p style={{ margin: '1rem 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>{profileData.bio}</p>
                            )}
                        </div>

                        {/* Editable fields */}
                        <div style={{ ...baseCardStyle }}>
                            <p style={{ margin: '0 0 1rem', fontSize: '0.7rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Edit Operator-Visible Fields</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.875rem' }}>
                                {[
                                    { label: 'Professional Headline', field: 'current_occupation', placeholder: 'e.g. Commercial Pilot — CPL/IR/ME', value: profileData?.current_occupation || '' },
                                    { label: 'Home Base / City', field: 'domicile', placeholder: 'e.g. Dubai, UAE', value: profileData?.domicile || profileData?.country || '' },
                                    { label: 'Nationality', field: 'nationality', placeholder: 'e.g. Filipino', value: profileData?.nationality || '' },
                                    { label: 'LinkedIn URL', field: 'linkedin_url', placeholder: 'linkedin.com/in/yourname', value: profileData?.linkedin_url || '' },
                                ].map(f => (
                                    <div key={f.field}>
                                        <label style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{f.label}</label>
                                        <input
                                            defaultValue={f.value}
                                            placeholder={f.placeholder}
                                            onBlur={async (e) => {
                                                const val = e.target.value.trim();
                                                if (!val) return;
                                                const { data: { user } } = await supabase.auth.getUser();
                                                if (!user) return;
                                                await supabase.from('profiles').update({ [f.field]: val }).eq('id', user.id);
                                                setProfileData((prev: any) => ({ ...prev, [f.field]: val }));
                                            }}
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: '#e2e8f0', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                ))}
                            </div>
                            {/* Bio */}
                            <div style={{ marginTop: '0.875rem' }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>Professional Bio</label>
                                <textarea
                                    defaultValue={profileData?.bio || ''}
                                    placeholder="Tell airlines about your background, goals, and what makes you a great hire..."
                                    rows={4}
                                    onBlur={async (e) => {
                                        const val = e.target.value.trim();
                                        const { data: { user } } = await supabase.auth.getUser();
                                        if (!user) return;
                                        await supabase.from('profiles').update({ bio: val }).eq('id', user.id);
                                        setProfileData((prev: any) => ({ ...prev, bio: val }));
                                    }}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#e2e8f0', fontSize: '0.82rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
                                />
                            </div>
                        </div>

                        {/* Upgrade CTA for free users */}
                        {!isPremium && (
                            <div style={{ background: 'rgba(229,62,62,0.06)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', letterSpacing: '0.06em', textTransform: 'uppercase' }}>⚠️ Operators See Unverified Warning</p>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>Upgrade to Recognition+ to replace the ⚠️ badge with a verified seal and unlock priority placement in airline pulls.</p>
                                </div>
                                <button
                                    onClick={() => setShowUpgradeModal(true)}
                                    style={{ flexShrink: 0, padding: '8px 20px', background: 'linear-gradient(135deg,#e53e3e,#c53030)', border: 'none', borderRadius: 8, color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >🛡️ Verify Now</button>
                            </div>
                        )}
                    </div>
                </motion.section>
                )}

                {/* ── ADMIN DASHBOARD SECTION — Super Admin Only ── */}
                {!showWalletGate && !showWalletView && activeSection === 'admin_dashboard' && isAdmin && (
                <motion.section
                    key="admin_dashboard"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem', paddingBottom: '80px' }}>
                    <AdminDashboardPanel />
                </motion.section>
                )}

            </main>
            </motion.div>
            )}
            </AnimatePresence>
            
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

