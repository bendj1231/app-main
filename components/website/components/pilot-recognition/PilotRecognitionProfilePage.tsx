import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../../../src/lib/supabase';
import ExaminationResultsPage from './ExaminationResultsPage';
import { DigitalLogbookPage } from './DigitalLogbookPage';
import { PilotLicensureExperiencePage } from './PilotLicensureExperiencePage';

interface PilotRecognitionProfilePageProps {
    onNavigate: (page: string) => void;
    onBack?: () => void;
}

const CategorySection: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
            <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>{title}</p>
            {description && <p style={{ margin: '0.25rem 0 0', color: '#475569', fontSize: '0.9rem' }}>{description}</p>}
        </div>
        {children}
    </div>
);

export const PilotRecognitionProfilePage: React.FC<PilotRecognitionProfilePageProps> = ({
    onNavigate,
    onBack
}) => {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState<string>('');
    const [showScoreTooltip, setShowScoreTooltip] = useState(false);
    const [selectedScoreCategory, setSelectedScoreCategory] = useState<'all' | 'low' | 'middle' | 'high'>('all');
    const [recommendedPathways, setRecommendedPathways] = useState<any[]>([]);
    const [selectedPathway, setSelectedPathway] = useState<any>(null);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
    const carouselRef = useRef<HTMLDivElement>(null);
    const [currentDocumentationPage, setCurrentDocumentationPage] = useState<'examination' | 'logbook' | 'licensure' | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

    // Filter pathways based on pathway match percentage (how well pathway matches user's profile)
    const filteredPathways = useMemo(() => {
        const wingmentorCard = recommendedPathways.find(p => p.id === 'wingmentor-intro');
        const otherPathways = recommendedPathways.filter(p => p.id !== 'wingmentor-intro');
        
        console.log('[FILTER] Selected category:', selectedScoreCategory);
        console.log('[FILTER] Total pathways before filter:', otherPathways.length);
        console.log('[FILTER] Pathway match percentages:', otherPathways.map(p => ({ id: p.id, title: p.title, match: p.matchPercentage })));
        
        const filteredOthers = otherPathways.filter(pathway => {
            if (selectedScoreCategory === 'all') return true;
            if (selectedScoreCategory === 'low') return pathway.matchPercentage < 50;
            if (selectedScoreCategory === 'middle') {
                const matches = pathway.matchPercentage >= 50 && pathway.matchPercentage <= 69;
                console.log('[FILTER MIDDLE]', pathway.title, 'match:', pathway.matchPercentage, 'matches:', matches);
                return matches;
            }
            if (selectedScoreCategory === 'high') {
                const matches = pathway.matchPercentage >= 70;
                console.log('[FILTER HIGH]', pathway.title, 'match:', pathway.matchPercentage, 'matches:', matches);
                return matches;
            }
            return true;
        });
        
        console.log('[FILTER] Pathways after filter:', filteredOthers.length);
        if (selectedScoreCategory === 'middle' || selectedScoreCategory === 'high') {
            console.log('[FILTER] Matched pathways:', filteredOthers.map(p => ({ title: p.title, match: p.matchPercentage })));
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
            console.log('Carousel ref attached:', carouselRef.current);
            console.log('Scroll width:', carouselRef.current.scrollWidth);
            console.log('Client width:', carouselRef.current.clientWidth);
            console.log('Can scroll:', carouselRef.current.scrollWidth > carouselRef.current.clientWidth);
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
        if (!pathway.requirements || !profileData) return pathway.requirements.map(req => ({ ...req, met: false, reason: 'Profile data not available' }));

        const userHours = profileData.total_hours || 0;
        const userLicense = profileData.license_type || '';
        const userMedical = profileData.medical_status || '';

        return pathway.requirements.map(req => {
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profileData?.user_id) return;

        setUploadingImage(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${profileData.user_id}-${Date.now()}.${fileExt}`;
            const filePath = `${profileData.user_id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-pics')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('profile-pics')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_image_url: publicUrl })
                .eq('id', profileData.user_id);

            if (updateError) throw updateError;

            setProfileImageUrl(publicUrl);
            console.log('✅ Profile image uploaded successfully:', publicUrl);
        } catch (err) {
            console.error('❌ Error uploading image:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDeleteAccount = async () => {
        console.log('[DELETE ACCOUNT] Starting delete account process');
        console.log('[DELETE ACCOUNT] Profile data:', profileData);
        console.log('[DELETE ACCOUNT] User ID:', profileData?.user_id);
        console.log('[DELETE ACCOUNT] Confirmation text:', deleteConfirmationText);

        if (!profileData?.user_id) {
            console.error('[DELETE ACCOUNT] No user ID found');
            return;
        }
        if (deleteConfirmationText !== 'pilotrecognition') {
            console.error('[DELETE ACCOUNT] Confirmation text does not match');
            alert('Please type "pilotrecognition" to confirm account deletion.');
            return;
        }

        console.log('[DELETE ACCOUNT] Confirmation validated, proceeding with deletion');
        setDeletingAccount(true);
        console.log('[DELETE ACCOUNT] Set deletingAccount to true');

        try {
            console.log('[DELETE ACCOUNT] Fetching authenticated user');
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            console.log('[DELETE ACCOUNT] User data:', user);
            console.log('[DELETE ACCOUNT] User error:', userError);
            
            if (!user) {
                console.error('[DELETE ACCOUNT] No authenticated user found');
                throw new Error('Not authenticated');
            }

            console.log('[DELETE ACCOUNT] Fetching session');
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            console.log('[DELETE ACCOUNT] Session data:', session ? 'Session exists' : 'No session');
            console.log('[DELETE ACCOUNT] Session error:', sessionError);
            
            if (!session) {
                console.error('[DELETE ACCOUNT] No session found');
                throw new Error('No session');
            }

            console.log('[DELETE ACCOUNT] Calling delete-account Edge Function');
            console.log('[DELETE ACCOUNT] User ID to delete:', profileData.user_id);
            console.log('[DELETE ACCOUNT] Access token (first 20 chars):', session.access_token?.substring(0, 20) + '...');

            const response = await fetch('https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ userId: profileData.user_id }),
            });

            console.log('[DELETE ACCOUNT] Edge Function response status:', response.status);
            console.log('[DELETE ACCOUNT] Edge Function response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('[DELETE ACCOUNT] Edge Function error:', errorData);
                throw new Error(errorData.error || 'Failed to delete account');
            }

            console.log('[DELETE ACCOUNT] Account deletion successful, signing out');
            // Sign out after successful deletion
            await supabase.auth.signOut();
            console.log('[DELETE ACCOUNT] Sign out complete');
            setDeleteConfirmationText('');
            console.log('[DELETE ACCOUNT] Confirmation text cleared');
            // Force navigation to home after sign out
            console.log('[DELETE ACCOUNT] Redirecting to home page');
            window.location.href = '/';
        } catch (err) {
            console.error('[DELETE ACCOUNT] Error during deletion:', err);
            console.error('[DELETE ACCOUNT] Error name:', err.name);
            console.error('[DELETE ACCOUNT] Error message:', err.message);
            console.error('[DELETE ACCOUNT] Error stack:', err.stack);
            alert('Failed to delete account. Please try again.');
        } finally {
            console.log('[DELETE ACCOUNT] Cleanup: setting deletingAccount to false');
            setDeletingAccount(false);
            console.log('[DELETE ACCOUNT] Cleanup: closing dialog');
            setShowDeleteDialog(false);
        }
    };

    const fetchProfileData = async () => {
        console.log('=== START fetchProfileData ===');
        try {
            // Fetch user's profile data directly from Supabase
            console.log('[1] Fetching profile data from Supabase');
            
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
                console.error('[ERROR] Supabase auth error:', userError);
                console.log('[WARN] Setting default profile data due to auth error');
                setProfileData({
                    user_id: '',
                    total_hours: 0,
                    recent_flight_experience: 'N/A',
                    overall_recognition_score: 0,
                    recognition_score: 0,
                    license_type: 'None',
                    medical_status: 'None',
                    pathway_interests: [],
                    certifications: [],
                    type_ratings: [],
                    enrolled_programs: []
                });
                setLoading(false);
                return;
            }
            
            if (!user) {
                console.error('[ERROR] No user found in Supabase auth');
                console.log('[WARN] Setting default profile data due to missing user');
                setProfileData({
                    user_id: '',
                    total_hours: 0,
                    recent_flight_experience: 'N/A',
                    overall_recognition_score: 0,
                    recognition_score: 0,
                    license_type: 'None',
                    medical_status: 'None',
                    pathway_interests: [],
                    certifications: [],
                    type_ratings: [],
                    enrolled_programs: []
                });
                setLoading(false);
                return;
            }
            
            console.log('[2] User authenticated:', user.id);
            console.log('[2a] User email:', user.email);
            
            // Fetch profile data from pilot_recognition_matches table
            const { data: profileData, error: profileError } = await supabase
                .from('pilot_recognition_matches')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();
            
            // Fetch profile image and basic user data from profiles table
            const { data: profileImage, error: imageError } = await supabase
                .from('profiles')
                .select('profile_image_url, full_name, display_name, email, current_flight_hours, overall_recognition_score')
                .eq('id', user.id)
                .maybeSingle();
            
            console.log('[3] Profile data from pilot_recognition_matches:', profileData);
            console.log('[3a] Profile image from profiles table:', profileImage);
            console.log('[3b] Image error:', imageError);
            
            if (profileError) {
                console.error('[ERROR] Profile fetch error:', profileError);
                // Don't throw error, continue with profiles data
            }
            
            // Provide default values if no profile exists, and merge with profiles table data
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
                ...(profileImage && !profileData ? {
                    full_name: profileImage.full_name || profileImage.display_name || '',
                    first_name: profileImage.display_name?.split(' ')[0] || '',
                    last_name: profileImage.display_name?.split(' ').slice(1).join(' ') || '',
                    email: profileImage.email || user.email || '',
                    total_hours: profileImage.current_flight_hours || 0,
                    overall_recognition_score: profileImage.overall_recognition_score || 0,
                    current_occupation: 'STUDENT PILOT'
                } : {})
            };
            
            console.log('[3] Profile data received:', finalProfileData);
            console.log('[3a] Profile image data:', profileImage);
            
            setProfileData(finalProfileData);
            // Use profile image from profiles table first, then fall back to pilot_recognition_matches
            const imageUrl = profileImage?.profile_image_url || finalProfileData.profile_image_url || '';
            setProfileImageUrl(imageUrl);
            console.log('[4] Profile data set in state, image URL:', imageUrl);
            
            // Call Supabase Edge Function to calculate pathway matches
            const supabaseUrl = 'https://gkbhgrozrzhalnjherfu.supabase.co';
            const edgeFunctionUrl = `${supabaseUrl}/functions/v1/calculate-pathway-matches`;
            
            console.log('[5] Calling Edge Function with profile data:', finalProfileData);
            console.log('[6] Edge Function URL:', edgeFunctionUrl);
            
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;
            
            console.log('[7] Access token:', accessToken?.substring(0, 20) + '...');
            
            const edgeFunctionResponse = await fetch(edgeFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken || ''}`,
                },
                body: JSON.stringify({ profileData: finalProfileData }),
            });
            
            console.log('[8] Edge Function response received');
            console.log('[9] Edge Function response status:', edgeFunctionResponse.status);
            
            if (!edgeFunctionResponse.ok) {
                const errorText = await edgeFunctionResponse.text();
                console.error('[ERROR] Edge Function error response:', errorText);
                throw new Error(`Edge Function returned ${edgeFunctionResponse.status}: ${errorText}`);
            }
            
            const pathwaysData = await edgeFunctionResponse.json();
            console.log('[10] Edge Function response data:', pathwaysData);
            
            if (pathwaysData.pathways) {
                setRecommendedPathways(pathwaysData.pathways);
                console.log('[11] Pathways set in state, count:', pathwaysData.pathways.length);
            } else {
                console.error('[ERROR] No pathways in response:', pathwaysData);
            }
        } catch (error) {
            console.error('[ERROR] Error in fetchProfileData:', error);
            console.error('[ERROR] Error name:', error.name);
            console.error('[ERROR] Error message:', error.message);
            console.error('[ERROR] Error stack:', error.stack);
            // Fallback to empty pathways if Edge Function fails
            setRecommendedPathways([]);
        } finally {
            console.log('[12] Setting loading to false');
            setLoading(false);
            console.log('=== END fetchProfileData ===');
        }
    };

    const baseCardStyle: React.CSSProperties = {
        background: 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(241,245,249,0.75))',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
        border: '1px solid rgba(255,255,255,0.45)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)'
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: '#eef4fb', paddingBottom: '4rem', minHeight: '100vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                            width: '48px', height: '48px', border: '3px solid #e2e8f0', 
                            borderTopColor: '#3b82f6', borderRadius: '50%', 
                            animation: 'spin 1s linear infinite', margin: '0 auto'
                        }}></div>
                        <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading your recognition profile...</p>
                    </div>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const pilotName = profileData?.full_name || 'Pilot Profile';
    const initials = pilotName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div style={{ backgroundColor: '#eef4fb', paddingBottom: '4rem', minHeight: '100vh' }}>
            <main style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
                {/* Header */}
                <header style={{
                    padding: '3rem 4rem',
                    background: 'linear-gradient(180deg, #fff 0%, #f0f4fb 100%)',
                    position: 'relative',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={onBack || (() => onNavigate('home'))}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            left: '2rem',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#475569'
                        }}
                    >
                        <ArrowLeft style={{ width: 16, height: 16 }} />
                        Back
                    </button>

                    <button
                        onClick={() => setShowDeleteDialog(true)}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            padding: '0.4rem 0.8rem',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            color: '#94a3b8',
                            transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                    >
                        Delete
                    </button>

                    <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                        <img 
                            src="/logo.png" 
                            alt="WingMentor Logo" 
                            style={{ height: '120px', width: 'auto' }}
                            onLoad={() => console.log('[IMAGE] Logo loaded: /logo.png')}
                            onError={(e) => console.error('[IMAGE] Logo error: /logo.png', e)}
                        />
                    </div>
                    <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', textAlign: 'center' }}>
                        Pilot Recognition Profile
                    </p>
                    <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0.5rem', color: '#0f172a', fontFamily: 'Georgia, serif', fontWeight: 'normal', textAlign: 'center' }}>
                        Pilot Profile
                    </h1>
                </header>

                <section style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <CategorySection title="Pilot Data" description="Identity, credentials, flight activity, and core hour summaries">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
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
                                            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.25)',
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
                                            ) : profileImageUrl ? (
                                                <>
                                                    <img 
                                                        src={profileImageUrl} 
                                                        alt="Profile" 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onLoad={() => console.log('[IMAGE] Profile image loaded:', profileImageUrl)}
                                                        onError={(e) => console.error('[IMAGE] Profile image error:', profileImageUrl, e)}
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        background: 'rgba(0,0,0,0.5)',
                                                        display: 'flex',
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
                                            ) : (
                                                <span>{initials}</span>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.25rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>{pilotName}</h2>
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

                                                // Extract license number if available (common format: CPL #123456)
                                                const licenseMatch = license.match(/#\s*(\d+)/);
                                                if (licenseMatch) {
                                                    licenseNumber = ` #${licenseMatch[1]}`;
                                                }

                                                // Build license display string
                                                let licenseDisplay = '';
                                                if (highestLicense) {
                                                    licenseDisplay = `${highestLicense}${licenseNumber}`;
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
                                            <div key={tile.label} style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.4)' }}>
                                                <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase' }}>{tile.label}</p>
                                                <p style={{ margin: '0.35rem 0 0', fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>{tile.value}{tile.unverified && <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#f59e0b', marginLeft: '0.25rem' }}>(unverified)</span>}</p>
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
                                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Pilot Credentials</h3>
                                        <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Licensing, hours, and access pass</p>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
                                        {(() => {
                                            const license = profileData?.license_type || '';
                                            const licenseLower = license.toLowerCase();
                                            let highestLicense = 'None';
                                            
                                            // Check in order of ranking: CPL > PPL > SPL
                                            if (licenseLower.includes('cpl')) {
                                                highestLicense = 'CPL';
                                            } else if (licenseLower.includes('ppl')) {
                                                highestLicense = 'PPL';
                                            } else if (licenseLower.includes('spl')) {
                                                highestLicense = 'SPL';
                                            }

                                            return [
                                                { label: 'License Type', value: highestLicense },
                                                { label: 'License Status', value: profileData?.license_status || 'Not specified' },
                                                { label: 'English Level', value: profileData?.english_proficiency_level || 'Not specified' },
                                                { label: 'Career Stage', value: profileData?.career_stage || 'Not specified' }
                                            ];
                                        })().map(tile => (
                                            <div key={tile.label} style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.4)', textAlign: 'center' }}>
                                                <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280', letterSpacing: '0.1em' }}>{tile.label}</p>
                                                <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{tile.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Readiness Card */}
                                <div style={{ ...baseCardStyle, minHeight: '100%' }}>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Readiness Snapshot</p>
                                        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#0f172a', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Resource & Availability</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        {[
                                            { label: 'Last Flown', value: profileData?.last_flown || 'Not specified' },
                                            { label: 'Countries Visited', value: profileData?.countries_visited || 'Not specified' },
                                            { label: 'Favorite Aircraft', value: profileData?.favorite_aircraft || 'Not specified' }
                                        ].map(item => (
                                            <div key={item.label} style={{ borderRadius: '14px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>{item.label}</div>
                                                <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', textAlign: 'right' }}>{item.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Stats Card */}
                                <div style={{
                                    gridColumn: '1 / -1',
                                    background: 'white',
                                    borderRadius: '26px',
                                    padding: '1.5rem',
                                    border: '1px solid rgba(226,232,240,0.9)',
                                    boxShadow: '0 20px 45px rgba(15,23,42,0.08)'
                                }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.35rem' }}>
                                        {[
                                            { title: 'Total Hours', value: profileData?.total_hours || 0, subtitle: 'Logged Hours', accent: '#0ea5e9', unverified: true },
                                            { title: 'Recognition', value: profileData?.overall_recognition_score || 0, subtitle: 'Verified Score', accent: '#10b981' },
                                            { title: 'Examination', value: profileData?.examination_score || 0, subtitle: 'Knowledge Test', accent: '#f59e0b' },
                                            { title: 'Mentor Hours', value: profileData?.mentorship_hours || 0, subtitle: 'Engagement', accent: '#8b5cf6' }
                                        ].map((stat, index) => (
                                            <div key={stat.title} style={{ padding: '0.4rem 0.75rem', textAlign: 'center', position: 'relative' }}>
                                                {index < 3 && (
                                                    <span style={{
                                                        position: 'absolute', top: '20%', right: 0,
                                                        width: '1px', height: '60%',
                                                        background: 'linear-gradient(180deg, transparent, rgba(148,163,184,0.5), transparent)'
                                                    }} />
                                                )}
                                                <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase' }}>{stat.title}</p>
                                                <p style={{ margin: '0.35rem 0 0', fontSize: '1.85rem', fontWeight: 700, color: stat.accent }}>{stat.value}{stat.unverified && <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#f59e0b', marginLeft: '0.25rem' }}>(unverified)</span>}</p>
                                                <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{stat.subtitle}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CategorySection>

                        <CategorySection title="Career & Interests" description="Professional information and pathway preferences">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ ...baseCardStyle }}>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Career Information</p>
                                        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#0f172a', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Professional Details</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        {[
                                            { label: 'Current Occupation', value: profileData?.current_occupation || 'Not specified' },
                                            { label: 'Current Employer', value: profileData?.current_employer || 'Not specified' }
                                        ].map(item => (
                                            <div key={item.label} style={{ borderRadius: '14px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>{item.label}</div>
                                                <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', textAlign: 'right' }}>{item.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ ...baseCardStyle }}>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pathway Interests</p>
                                        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#0f172a', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Career Goals</h3>
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
                                        <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#0f172a', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Learning Goals</h3>
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
                                    }
                                ].map(card => (
                                    <div key={card.title} style={{
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '24px',
                                        padding: '1.75rem',
                                        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto',
                                        gap: '1.5rem',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1.25rem', color: '#0f172a' }}>{card.title}</h3>
                                            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>{card.description}</p>
                                        </div>
                                        <button
                                            style={{
                                                padding: '0.65rem 1.75rem',
                                                borderRadius: '999px',
                                                border: card.filled ? 'none' : '1px solid #cbd5e1',
                                                background: card.filled ? '#0ea5e9' : 'transparent',
                                                color: card.filled ? '#fff' : '#0f172a',
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
                                                }
                                            }}
                                        >
                                            {card.cta}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CategorySection>

                        <CategorySection title="Additional Information" description="Personal details and aspirations">
                            <div style={{ ...baseCardStyle }}>
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Personal Details</p>
                                    <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', color: '#0f172a', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>About You</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    {[
                                        { label: 'Why You Want to Become a Pilot', value: profileData?.why_become_pilot || 'Not specified' },
                                        { label: 'Other Skills', value: profileData?.other_skills || 'Not specified' }
                                    ].map(item => (
                                        <div key={item.label} style={{ borderRadius: '14px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.9)' }}>
                                            <div style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>{item.label}</div>
                                            <div style={{ color: '#0f172a', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CategorySection>

                        {/* ATLAS Resume Section */}
                        <CategorySection title="ATLAS Resume" description="ATS-Approved ATLAS CV Formatting">
                            <div style={{ maxWidth: '80rem', margin: '0 auto', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
                                {/* Header Card */}
                                <div style={{ background: '#dc2626', padding: '1.25rem 1.5rem', borderBottom: '1px solid #b91c1c' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.625rem', color: '#fecaca', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.25rem' }}>Pilot Recognition Profile</p>
                                            <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{pilotName}</h4>
                                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#fecaca' }}>WingMentor Recognition Portfolio</p>
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
                                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e2e8f0' }}>
                                            <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Pilot Credentials</h5>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>Licensing, hours, and access pass</p>
                                            
                                            {/* Flight Hours Grid - 4 boxes */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                                                <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Hours</p>
                                                    <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.total_hours || 0} <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#f59e0b', marginLeft: '0.25rem' }}>(unverified)</span></p>
                                                </div>
                                                <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Mentorship</p>
                                                    <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.mentorship_hours || 0}</p>
                                                </div>
                                                <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Foundation</p>
                                                    <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.foundation_progress || 0}%</p>
                                                </div>
                                                <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                                                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#64748b', marginBottom: '0.25rem' }}>Recognition</p>
                                                    <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.overall_recognition_score || 0}</p>
                                                </div>
                                            </div>

                                            {/* Type & Status */}
                                            <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Type</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.license_type || 'Commercial Pilot'}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Status</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>{profileData?.license_status || 'Verified'}</span>
                                                </div>
                                            </div>

                                            <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                View Flight Digital Logbook <span>→</span>
                                            </a>
                                        </div>

                                        {/* Training */}
                                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e2e8f0' }}>
                                            <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Training</h5>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>License</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.license_type || 'CPL (A)'}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Medical</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>Class 1 Valid</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Type Ratings</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Multi-Engine</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>English Proficiency</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.english_proficiency_level || 'Level 6 (Expert)'}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Languages</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>English, Spanish</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Readiness Snapshot */}
                                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e2e8f0' }}>
                                            <h5 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>READINESS SNAPSHOT</h5>
                                            <h6 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Resource & Availability</h6>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Medical Certificate</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>Valid Until Aug 2026</span>
                                                </div>
                                                <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Last Flown</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.last_flown || 'Not Available'}</span>
                                                </div>
                                                <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Recognition Score</span>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{profileData?.overall_recognition_score || 0}/100</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Experience Section */}
                                    <div style={{ marginTop: '1rem', background: 'white', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Recent Job Experience & Industry Aligned Accredited Programs</h5>
                                            <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                Edit Experience <span>→</span>
                                            </a>
                                        </div>
                                        
                                        {/* Job Experience Entry */}
                                        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <h6 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{profileData?.current_occupation || 'Flight Instructor'}</h6>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{profileData?.current_employer || 'Skyway Aviation Academy'}</p>
                                                </div>
                                                <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>Jan 2024 - Present</span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                                                {profileData?.why_become_pilot || 'Providing flight instruction for PPL and CPL students. Specializing in instrument training and multi-engine operations.'}
                                            </p>
                                        </div>
                                        
                                        <a href="#" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            Add your job experience <span>→</span>
                                        </a>
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '0.75rem 1.5rem', borderTop: '1px solid #e2e8f0' }}>
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
                                    color: '#0f172a', 
                                    letterSpacing: '-0.02em' 
                                }}>
                                    Recommended Pathways
                                </h2>
                                <p style={{ margin: '0.5rem 0 0', color: '#475569', fontSize: '1rem' }}>
                                    Explore career pathways matched to your profile
                                </p>
                                <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                                    Discover cadet programs, airline partnerships, and career progression opportunities tailored to your experience level
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
                                            <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: '#0f172a', lineHeight: 1 }}>
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
                                        background: 'white',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
                                        zIndex: 1000,
                                        textAlign: 'left'
                                    }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
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
                                                            onLoad={() => console.log('[IMAGE] WingMentor image loaded:', pathway.image)}
                                                            onError={(e) => console.error('[IMAGE] WingMentor image error:', pathway.image, e)}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={pathway.image}
                                                            alt={pathway.title}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                            onLoad={() => console.log('[IMAGE] Pathway image loaded:', pathway.image, 'Pathway:', pathway.title)}
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
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'normal', color: '#0f172a', marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>
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
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: '#0f172a' }}>
                                    Requirements & Profile Alignment
                                </h3>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                                    Understand how your current profile aligns with the pathway requirements and identify areas for improvement to increase your eligibility.
                                </p>
                            </div>

                            {/* Description Component below header */}
                            {selectedPathway && (
                                <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(241,245,249,0.75))', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.45)', boxShadow: '0 20px 45px rgba(15,23,42,0.08)' }}>
                                    
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
                                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase' }}>
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
                                                                        <td style={{ padding: '0.75rem', color: '#0f172a', fontWeight: 500 }}>
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
                    </div>
                </section>
            </main>
            
            {/* Documentation Pages Overlay */}
            {currentDocumentationPage === 'examination' && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: '#f0f4f8', overflowY: 'auto' }}>
                    <ExaminationResultsPage
                        onBack={() => setCurrentDocumentationPage(null)}
                        userProfile={profileData ? {
                            firstName: profileData.first_name,
                            lastName: profileData.last_name,
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
                            firstName: profileData.first_name,
                            lastName: profileData.last_name,
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
                            id: profileData.id,
                            uid: profileData.id,
                            firstName: profileData.first_name,
                            lastName: profileData.last_name,
                            email: profileData.email
                        } : null}
                    />
                </div>
            )}

            {/* Delete Account Confirmation Dialog */}
            {showDeleteDialog && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 2000,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '450px',
                        width: '100%',
                        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.2)'
                    }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#0f172a', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>
                            Delete Account
                        </h3>
                        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                            Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data including profile information, flight logs, and enrollment records.
                        </p>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                                Type <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>pilotrecognition</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmationText}
                                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                                placeholder="Type pilotrecognition"
                                disabled={deletingAccount}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontFamily: 'monospace',
                                    letterSpacing: '0.05em',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setDeleteConfirmationText('');
                                }}
                                disabled={deletingAccount}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    color: '#64748b',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    cursor: deletingAccount ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!deletingAccount) {
                                        e.currentTarget.style.background = '#f8fafc';
                                        e.currentTarget.style.color = '#0f172a';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!deletingAccount) {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = '#64748b';
                                    }
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deletingAccount || deleteConfirmationText !== 'pilotrecognition'}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    background: deleteConfirmationText === 'pilotrecognition' ? '#ef4444' : '#e2e8f0',
                                    color: deleteConfirmationText === 'pilotrecognition' ? 'white' : '#94a3b8',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    cursor: deletingAccount || deleteConfirmationText !== 'pilotrecognition' ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    opacity: deletingAccount || deleteConfirmationText !== 'pilotrecognition' ? 0.5 : 1
                                }}
                            >
                                {deletingAccount ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
