import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletLoadingScreen } from '../wallet/WalletLoadingScreen';
import { WalletPageWithSidebar } from '../wallet/WalletPageWithSidebar';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, LayoutDashboard, BarChart3, BookMarked, Image as ImageIcon, Fingerprint, Plus, Award, Plane, RefreshCw, Upload, FileCheck, TrendingUp, ShieldCheck, Sparkles, Bot, CheckCircle2, AlertCircle, User, FileText, Shield, Settings } from 'lucide-react';

type ProfileSection = 'overview' | 'statistics' | 'logbook' | 'photos' | 'identity' | 'vault' | 'admin_dashboard';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
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
import { useRecognitionScore } from '@/hooks/useRecognitionScore';
import { useVaultProfile } from '@/hooks/useVaultProfile';
import { calculateRecognitionScore } from '../../../../lib/pilot-recognition-score';
import { uploadProfileImage } from '@/lib/cloudinaryClient';
import ProfileImage from '@/components/ProfileImage';
import { getProfileImageUrl } from '@/lib/cloudinaryConfig';
import { cleanupOldProfileImage } from '@/lib/cloudinaryDelete';
import { MeshGradient } from '@paper-design/shaders-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '@/lib/shared/supabase';
import { VerificationStatusTab } from '../unified-platform/tabs/VerificationStatusTab';
import { VerificationDashboardGrid } from '../unified-platform/VerificationDashboardGrid';

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

function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

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
    const { readProfile, updateProfile } = useVaultProfile();
    const { callApi } = useWorkerAuth();
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const isPremium = useMemo(() => {
        const tier = profileData?.subscription_tier || profileData?.tier || 'free';
        return tier !== 'free' && tier !== 'bronze';
    }, [profileData?.subscription_tier, profileData?.tier]);
    const [showWalletGate, setShowWalletGate] = useState(false);
    const [showWalletView, setShowWalletView] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [editingTile, setEditingTile] = useState<string | null>(null);
    const [tileEditValue, setTileEditValue] = useState('');
    const [profileReady, setProfileReady] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const { currentUser } = useAuth();
    const { user: auth0User } = useAuth0();
    
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // isPremium is derived from profileData above — no extra API call needed

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
    }, [currentUser?.uid, currentUser?.email, injectedProfile, callApi]);

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

            // Update profile with new image URL via Worker
            const { error: updateError } = await updateProfile(profileData.user_id, {
                profile_image_url: result.url,
                profile_image_public_id: result.publicId,
            });

            if (updateError) throw updateError;

            // Update local state immediately so new image displays
            setProfileData(prev => prev ? {
                ...prev,
                profile_image_url: result.url,
                profile_image_public_id: result.publicId,
            } : null);


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
        if (!field || !profileData?.user_id) return;
        try {
            await updateProfile(profileData.user_id, { [field]: value });
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

            // Fetch profile data via Worker (single source of truth)
            const userId = currentUser?.uid || currentUser?.id;
            const userEmail = currentUser?.email;
            if (!userId && !userEmail) {
                console.warn('[PROFILE] No authenticated user — waiting for injected profile');
                setLoading(false);
                return;
            }

            const profileParams: any = {};
            if (userId) profileParams.auth0_id = userId;
            if (userEmail) profileParams.email = userEmail;

            const sourceProfile = (await callApi('getProfile', profileParams)) as any;

            if (!sourceProfile) {
                console.warn('[PROFILE] No Worker profile found');
                setLoading(false);
                return;
            }

            // Prefer display_name (always plain text) over full_name
            const isCiphertext = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
            const looksLikeEmailPrefix = (v: string) => /^[a-z0-9_\.]+$/.test(v) && v.length > 3;
            let resolvedFullName = '';
            const nameFromProfile = sourceProfile?.display_name && !isCiphertext(sourceProfile.display_name) ? sourceProfile.display_name
                : sourceProfile?.full_name && !isCiphertext(sourceProfile.full_name) ? sourceProfile.full_name
                : '';
            if (nameFromProfile && !looksLikeEmailPrefix(nameFromProfile)) {
                resolvedFullName = nameFromProfile;
            } else {
                resolvedFullName = auth0User?.name || auth0User?.nickname || nameFromProfile || 'Pilot';
            }

            const licenseTypes = sourceProfile.license_types || sourceProfile.license_type || sourceProfile.current_occupation;
            const licenseTypeStr = Array.isArray(licenseTypes) ? licenseTypes.join(', ') : licenseTypes;

            const finalProfileData = {
                ...{
                    user_id: sourceProfile.id,
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
                    profile_image_public_id: '',
                    first_name: '',
                    last_name: '',
                    full_name: '',
                    email: '',
                    current_occupation: ''
                },
                ...sourceProfile,
                full_name: resolvedFullName,
                first_name: resolvedFullName.split(' ')[0] || sourceProfile.first_name || '',
                last_name: resolvedFullName.split(' ').slice(1).join(' ') || sourceProfile.last_name || '',
                email: sourceProfile.email || userEmail || '',
                total_hours: sourceProfile.current_flight_hours || sourceProfile.total_flight_hours || 0,
                overall_recognition_score: sourceProfile.overall_recognition_score || sourceProfile.recognition_score || 0,
                recognition_score: sourceProfile.overall_recognition_score || sourceProfile.recognition_score || 0,
                current_occupation: sourceProfile.current_occupation || 'STUDENT PILOT',
                license_type: licenseTypeStr || 'None',
                license_authority: sourceProfile.license_issuing_authority || sourceProfile.country_of_license || '',
                license_id: sourceProfile.license_id || '',
                country_of_license: sourceProfile.country_of_license || '',
                type_ratings: sourceProfile.ratings || sourceProfile.type_ratings || [],
                english_proficiency_level: sourceProfile.elp_level || sourceProfile.language_proficiency || ''
            };

            setProfileData(finalProfileData);

            // Backfill missing name fields in database so other tabs see proper names
            const needsNameUpdate = !sourceProfile.first_name || !sourceProfile.full_name || looksLikeEmailPrefix(sourceProfile.display_name || '');
            if (needsNameUpdate && resolvedFullName !== 'Pilot') {
                try {
                    await updateProfile(sourceProfile.id, {
                        first_name: finalProfileData.first_name,
                        last_name: finalProfileData.last_name,
                        full_name: finalProfileData.full_name,
                        display_name: resolvedFullName,
                    });
                } catch (e) {
                    console.warn('[PROFILE] Could not backfill name fields:', e);
                }
            }

            // Pathway matching deferred — will be moved to a Worker action later
            setRecommendedPathways([]);
            setRecognitionScore({
                totalRecognition: finalProfileData.overall_recognition_score,
                breakdown: null
            });
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
                {/* Sidebar Navigation — matches AdvancedProfileTab design */}
                {!embedded && (
                    <motion.aside
                        initial={{ opacity: 0, x: -32 }}
                        animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -280 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                        width: '280px',
                        flexShrink: 0,
                        padding: '5rem 1rem 2rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(8,10,18,0.98) 100%)',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        height: '100vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        boxSizing: 'border-box',
                        pointerEvents: sidebarOpen ? 'auto' : 'none',
                        zIndex: 40,
                    }}>
                        {/* Header */}
                        <div style={{ padding: '0 0.5rem', marginBottom: '1.25rem' }}>
                            <p style={{ margin: 0, fontSize: '0.625rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Pilot Profile</p>
                            <p style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>My Profile</p>
                        </div>

                        {/* Navigation Items */}
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flexShrink: 0 }}>
                            {[
                                { id: 'overview',   label: 'Overview',         icon: LayoutDashboard },
                                { id: 'statistics', label: 'Licensure & Currency', icon: FileText },
                                { id: 'logbook',    label: 'Flight Logbooks',  icon: BookMarked },
                                { id: 'photos',     label: 'Certificates',     icon: ImageIcon },
                                { id: 'identity',   label: 'About & Experience', icon: User },
                                { id: 'vault',      label: 'Public Profile',   icon: Shield, isVault: true },
                                ...(isAdmin ? [{ id: 'admin_dashboard', label: 'Admin Dashboard', icon: ShieldCheck, isAdmin: true }] : []),
                            ].map((item: any) => {
                                const Icon = item.icon;
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
                                            gap: '0.75rem',
                                            padding: '0.625rem 0.875rem',
                                            borderRadius: '0.75rem',
                                            background: isActive ? 'rgba(220,38,38,0.10)' : 'transparent',
                                            border: isActive ? '1px solid rgba(220,38,38,0.25)' : '1px solid transparent',
                                            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            textAlign: 'left',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            width: '100%',
                                            minWidth: 0
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                                            }
                                        }}
                                    >
                                        <Icon size={16} style={{ color: isActive ? '#ef4444' : 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', minWidth: 0, flex: 1 }}>{item.label}</span>
                                        {isActive && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Toggle button at bottom */}
                        <div style={{ marginTop: 'auto', padding: '1rem 0.5rem 0' }}>
                            <button
                                onClick={() => setSidebarOpen((v) => !v)}
                                aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '0.5rem',
                                    color: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s ease' }}>
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                                {sidebarOpen ? 'Collapse' : ''}
                            </button>
                        </div>

                    </motion.aside>
                )}

                {/* Floating sidebar toggle when collapsed */}
                {!embedded && !sidebarOpen && (
                    <div
                        className="group"
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '1rem',
                            transform: 'translateY(-50%)',
                            zIndex: 50,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}
                    >
                        <button
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Show sidebar"
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                padding: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                        <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: 'rgba(255,255,255,0.85)',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                                pointerEvents: 'none',
                            }}
                        >
                            Open sidebar
                        </span>
                    </div>
                )}

                <main style={{ 
                    position: 'relative', 
                    zIndex: 10, 
                    flex: 1, 
                    maxWidth: embedded ? '100%' : 'none', 
                    margin: embedded ? '0' : (sidebarOpen ? '0 0 0 280px' : '0'), 
                    minHeight: embedded ? 'auto' : '100vh', 
                    overflowY: 'auto', 
                    paddingTop: 0,
                    transition: 'margin 0.45s ease',
                    transform: 'scale(0.8)',
                    transformOrigin: 'top center',
                }}>

                {/* Recognition Score Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '0.5rem 1.5rem 0', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
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
                    return (
                        <WalletPageWithSidebar
                            userId={currentUser?.id}
                            onNavigate={() => setShowWalletView(false)}
                            noSidebar={true}
                        />
                    );
                })()}


                {/* ── OVERVIEW SECTION ── */}
                {!showWalletGate && !showWalletView && activeSection === 'overview' && (
                <motion.section
                    key="overview"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ padding: '0 clamp(1.5rem, 4vw, 3.5rem) 3rem', paddingBottom: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Verification Dashboard */}
                        <VerificationStatusTab
                            profile={profileData}
                            walletChecks={injectedWalletData?.credentials || []}
                            credentials={injectedWalletData?.credentials || []}
                            setTab={() => {}}
                            onNavigate={onNavigate}
                            onProfileImageUpdate={(url, publicId) => {
                                setProfileData((prev: any) => prev ? { ...prev, profile_image_url: url, profile_image_public_id: publicId } : null);
                            }}
                        />
                    </div>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Licenses and Ratings Validity */}
                        <VerificationDashboardGrid profile={profileData} setTab={() => {}} />

                        {/* Recurrency & Hours */}
                        {(() => {
                          const profile = profileData;
                          const totalHours = (profile?.total_flight_hours as number) || (profile?.total_hours as number) || 0;
                          const picHours = (profile?.pic_hours as number) || 0;
                          const nightHours = (profile?.night_hours as number) || (profile?.total_night_hours as number) || 0;
                          const lastFlown = (profile?.last_flown as string) || null;
                          const lastFlownDays = lastFlown ? daysUntil(lastFlown) : null;
                          return (
                            <div className="flex flex-col gap-4">
                              <div className="rounded-2xl p-6 border border-white/5 bg-slate-950/60 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-5">
                                  <Plane size={16} className="text-white/40" />
                                  <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Recurrency & Hours</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <p className="text-3xl font-black text-white">{totalHours.toLocaleString()}</p>
                                    <p className="text-[11px] text-white/40 mt-1">Total Hours</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-3xl font-black text-white">
                                      {lastFlownDays !== null ? `${Math.abs(lastFlownDays)}` : '—'}
                                    </p>
                                    <p className="text-[11px] text-white/40 mt-1">Days Since Flown</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-3xl font-black text-white">{picHours}</p>
                                    <p className="text-[11px] text-white/40 mt-1">PIC Hours</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-3xl font-black text-white">{nightHours}</p>
                                    <p className="text-[11px] text-white/40 mt-1">Night Hours</p>
                                  </div>
                                </div>
                                <div className="mt-6 pt-5 border-t border-white/5">
                                  <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-bold text-white/60">Flight Recency (90-day rule)</p>
                                    <span className={`text-[11px] font-black px-2 py-0.5 rounded ${
                                      lastFlownDays !== null && lastFlownDays >= -90
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-red-500/10 text-red-400'
                                    }`}>
                                      {lastFlownDays !== null && lastFlownDays >= -90 ? 'Current' : 'Overdue'}
                                    </span>
                                  </div>
                                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        lastFlownDays !== null && lastFlownDays >= -90 ? 'bg-emerald-500' : 'bg-red-500'
                                      }`}
                                      style={{
                                        width: `${Math.max(
                                          0,
                                          Math.min(100, lastFlownDays !== null ? ((90 + lastFlownDays) / 90) * 100 : 0)
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                  <p className="text-[11px] text-white/30 mt-2">
                                    {lastFlownDays !== null && lastFlownDays >= -90
                                      ? `${90 + lastFlownDays} days remaining before currency review required`
                                      : 'Currency lapsed. Schedule proficiency check or sim session.'}
                                  </p>
                                </div>
                              </div>

                              {/* Auto-Pilot AI Objectives — now below Recurrency & Hours */}
                              {(() => {
                                const p = profileData || {};
                                const hasLicense = !!p.license_type;
                                const hasMedical = !!p.medical_expiry && daysUntil(p.medical_expiry as string)! > 0;
                                const hasHours = ((p.total_flight_hours as number) || (p.total_hours as number) || 0) > 0;
                                const hasLogbook = !!p.logbook_provider;
                                const isCurrent = lastFlownDays !== null && lastFlownDays >= -90;

                                const objectives = [
                                  { done: hasLicense, label: 'License on file', action: 'Add license', path: 'advanced-profile' },
                                  { done: hasMedical, label: 'Medical current', action: 'Upload medical', path: '/get-started/verify-apc' },
                                  { done: hasHours, label: 'Flight hours logged', action: 'Connect logbook', path: '/platform?tab=logbook#logbook-providers' },
                                  { done: isCurrent, label: '90-day recency met', action: 'Log a flight', path: '/platform?tab=logbook#logbook-providers' },
                                  { done: hasLogbook, label: 'Logbook connected', action: 'Sync logbook', path: '/platform?tab=logbook#logbook-providers' },
                                ];
                                const completed = objectives.filter(o => o.done).length;
                                const pct = Math.round((completed / objectives.length) * 100);
                                const nextObj = objectives.find(o => !o.done);

                                let aiMessage = '';
                                if (pct === 100) {
                                  aiMessage = 'Profile complete. You are visible to airline recruiters. Keep credentials current.';
                                } else if (nextObj) {
                                  aiMessage = `Next: ${nextObj.label}. ${nextObj.action} to stay cleared to fly.`;
                                } else {
                                  aiMessage = 'Complete your profile to unlock airline matching.';
                                }

                                return (
                                  <div className="rounded-2xl p-6 border border-white/5 bg-slate-950/60 backdrop-blur-sm">
                                    {/* AI Header */}
                                    <div className="flex items-center gap-3 mb-5">
                                      <div>
                                        <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Auto-Pilot AI</p>
                                        <p className="text-xs font-bold text-white/70">Profile Objectives</p>
                                      </div>
                                      <div className="ml-auto flex items-center gap-1.5">
                                        <div className="w-8 h-8 rounded-full border-2 border-sky-500/30 flex items-center justify-center">
                                          <span className="text-[10px] font-black text-sky-400">{pct}%</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* AI Chat Bubble */}
                                    <div className="rounded-xl p-4 bg-sky-500/[0.06] border border-sky-500/10 mb-5">
                                      <div className="flex items-start gap-2">
                                        <Sparkles size={12} className="text-sky-400 mt-1 flex-shrink-0" />
                                        <p className="text-[11px] text-white/60 leading-relaxed">{aiMessage}</p>
                                      </div>
                                    </div>

                                    {/* Objectives List */}
                                    <div className="space-y-2">
                                      {objectives.map((o, i) => (
                                        <button
                                          key={i}
                                          onClick={() => o.path.startsWith('/') ? onNavigate(o.path) : setActiveSection(o.path as ProfileSection)}
                                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/10 transition-all group text-left"
                                        >
                                          <div className={`p-1 rounded-md ${o.done ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                                            {o.done ? (
                                              <CheckCircle2 size={12} className="text-emerald-400" />
                                            ) : (
                                              <AlertCircle size={12} className="text-amber-400" />
                                            )}
                                          </div>
                                          <span className={`text-[11px] font-bold flex-1 ${o.done ? 'text-white/40 line-through' : 'text-white/70'}`}>
                                            {o.label}
                                          </span>
                                          {!o.done && (
                                            <span className="text-[10px] font-black text-sky-400 group-hover:text-sky-300 transition-colors">{o.action} →</span>
                                          )}
                                        </button>
                                      ))}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-wider">Completion</span>
                                        <span className="text-[10px] font-black text-sky-400">{completed}/{objectives.length}</span>
                                      </div>
                                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <div
                                          className="h-full rounded-full bg-sky-500 transition-all"
                                          style={{ width: `${pct}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        })()}
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
                                <h2 style={{ margin: '0.3rem 0 0.5rem', fontSize: '1.5rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Public Profile</h2>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', maxWidth: 520 }}>This is exactly what airlines and operators see when they pull your profile. Edit the fields below to control your public-facing identity.</p>
                            </div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: isPremium ? 'rgba(34,197,94,0.12)' : 'rgba(236,201,75,0.1)', border: `1px solid ${isPremium ? 'rgba(34,197,94,0.3)' : 'rgba(236,201,75,0.3)'}`, borderRadius: 8, padding: '6px 14px' }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: isPremium ? '#22c55e' : '#ecc94b', flexShrink: 0, display: 'inline-block' }} />
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isPremium ? '#22c55e' : '#ecc94b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{isPremium ? 'Verified Profile' : 'Unverified — Upgrade to Recognition+'}</span>
                            </div>
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
                                                if (!val || !profileData?.user_id) return;
                                                await updateProfile(profileData.user_id, { [f.field]: val });
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
                                        if (!profileData?.user_id) return;
                                        await updateProfile(profileData.user_id, { bio: val });
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

