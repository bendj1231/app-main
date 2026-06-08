import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { safeRedirect } from '@/src/lib/url-validator';
import { HomePage } from '@/src/routes';
import { LoginModal } from '@/components/website/components/LoginModal';
import { CookieConsent } from '@/components/CookieConsent';
import { PasskeyPrompt } from '@/components/website/components/PasskeyPrompt';
import { initializeAnalyticsServices } from '@/src/lib/analytics-config';
import ChatWidget from '@/portal/components/w1000/ChatWidget';
import { ThemeProvider } from '@/components/website/context/ThemeContext';
// Admin components
import { MoaExecutiveSummary } from '@/src/components/admin/MoaExecutiveSummary';
import { InvestorPitch } from '@/src/components/admin/InvestorPitch';
import { GovernmentPromotion } from '@/src/components/admin/GovernmentPromotion';
import { VeremarkPricing } from '@/src/components/admin/VeremarkPricing';

const LOGO_URL =
  'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png';
const LOGO_FALLBACK_URL = '/logo.png';

// Initialize analytics services on app load
initializeAnalyticsServices();

export const App = () => {
  const [loading, _setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isEnrolledInFoundation, setIsEnrolledInFoundation] = useState(false);
  const [pilotId, setPilotId] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [lastFlown, setLastFlown] = useState('');
  const [mentorshipHours, setMentorshipHours] = useState(0);
  const [foundationProgress, setFoundationProgress] = useState(0);
  const [examinationScore, setExaminationScore] = useState(0);
  const [overallRecognitionScore, setOverallRecognitionScore] = useState(0);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const {
    currentUser,
    logout: _logout,
    showPasskeyPrompt,
    dismissPasskeyPrompt,
    userProfile,
  } = useAuth();

  // Fetch user's enrollment status from Supabase
  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      if (!currentUser?.email) {
        setIsEnrolledInFoundation(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('enrolled_programs')
          .eq('email', currentUser.email)
          .maybeSingle();

        if (error) {
          console.error('Error fetching enrollment status:', error);
          setIsEnrolledInFoundation(false);
          return;
        }

        if (data?.enrolled_programs && Array.isArray(data.enrolled_programs)) {
          const isEnrolled = data.enrolled_programs.includes('Foundational');
          setIsEnrolledInFoundation(isEnrolled);
        } else {
          setIsEnrolledInFoundation(false);
        }
      } catch (err) {
        console.error('Error fetching enrollment status:', err);
        setIsEnrolledInFoundation(false);
      }
    };

    fetchEnrollmentStatus();
  }, [currentUser]);

  // Fetch user's profile data from Supabase
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.uid) {
        setIsProfileLoading(false);
        return;
      }
      // Skip if uid is an Auth0 sub (not a Supabase UUID) — profile query would 400
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        currentUser.uid
      );
      if (!isUUID) {
        setIsProfileLoading(false);
        return;
      }

      setIsProfileLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(
            'pilot_id, profile_image_url, total_flight_hours, last_flown, mentorship_hours, foundation_progress, examination_score, overall_recognition_score, enrolled_programs'
          )
          .eq('id', currentUser.uid)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile data:', error);
          return;
        }

        if (data) {
          setPilotId(data.pilot_id || '');
          setTotalHours(data.total_flight_hours || 0);
          setLastFlown(data.last_flown || '');
          setMentorshipHours(data.mentorship_hours || 0);
          setFoundationProgress(data.foundation_progress || 0);
          setExaminationScore(data.examination_score || 0);
          setOverallRecognitionScore(data.overall_recognition_score || 0);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  const navigateToPortal = useCallback(() => {
    safeRedirect('/portal');
  }, []);

  const navigateTo = useCallback((page: string, _data?: unknown) => {
    // Admin routes - render admin components directly, update state only
    if (
      page === 'moa-executive-summary' ||
      page === 'investor-pitch' ||
      page === 'government-promotion' ||
      page === 'veremark-pricing'
    ) {
      setCurrentPage(page);
      return;
    }

    if (page === 'recognition-plus') {
      safeRedirect('/recognition-plus');
      return;
    }

    if (page === 'pilot-recognition') {
      safeRedirect('/pilot-recognition');
      return;
    }

    const [basePage, hash] = String(page).includes('#') ? String(page).split('#') : [page, null];
    window.scrollTo({ top: 0, behavior: 'instant' });
    safeRedirect(`/${basePage}${hash ? `#${hash}` : ''}`);
  }, []);

  return (
    <>
      {/* Global Loading Overlay */}
      <div className={`loading-overlay ${!loading ? 'hidden' : ''}`}>
        <div className="loading-content">
          <img
            src={LOGO_URL}
            alt="PilotRecognition Logo"
            className="loading-logo-main"
            onError={(e) => {
              (e.target as HTMLImageElement).src = LOGO_FALLBACK_URL;
            }}
          />
          <div className="loading-subtitle-blue">connecting pilots to recognition</div>
          <div className="loading-text">Bridging the Pilot Gap.</div>
        </div>
      </div>

      <ThemeProvider>
        {/* Admin Pages - Only show for admin users */}
        {currentUser &&
          (userProfile?.account_tier === 'enterprise_admin' ||
            currentUser?.email === import.meta.env.VITE_ADMIN_EMAIL) && (
            <>
              {currentPage === 'moa-executive-summary' && <MoaExecutiveSummary />}
              {currentPage === 'investor-pitch' && <InvestorPitch />}
              {currentPage === 'government-promotion' && <GovernmentPromotion />}
              {currentPage === 'veremark-pricing' && <VeremarkPricing />}
            </>
          )}

        {/* Home Page */}
        {![
          'moa-executive-summary',
          'investor-pitch',
          'government-promotion',
          'veremark-pricing',
        ].includes(currentPage) && (
          <HomePage
            onJoinUs={() => navigateTo('become-member')}
            onLogin={() => setIsLoginModalOpen(true)}
            onNavigate={navigateTo}
            isLoggedIn={!!currentUser}
            onLoginModalOpen={() => setIsLoginModalOpen(true)}
            isEnrolledInFoundation={isEnrolledInFoundation}
            pilotId={pilotId}
            totalHours={totalHours}
            lastFlown={lastFlown}
            mentorshipHours={mentorshipHours}
            foundationProgress={foundationProgress}
            examinationScore={examinationScore}
            overallRecognitionScore={overallRecognitionScore}
            userDisplayName={currentUser?.displayName}
            userEmail={currentUser?.email}
            onGoToProgramDetail={(slide) => {
              const routeMap: Record<string, string> = {
                'Emirates ATPL Pilot Pathways': 'emirates-atpl',
                'Emerging Air Taxi Sector': 'emerging-air-taxi',
                'Air Taxi Pilot Pathways': 'air-taxi-pathways',
                'Private Charter Pathways': 'private-charter-pathways',
                'EBT CBTA familiarization': 'ebt-cbta',
                'Unmanned Drones Pathways': 'piloted-drones',
                'What is the Pilot Gap?': 'pilot-gap',
                'Transition Program': 'transition-program',
                'Pilot Database Recognition System': 'pilot-recognition',
                'Foundational Program': 'foundational-program',
              };
              const route = routeMap[slide?.title || ''];
              if (route) navigateTo(route);
              else navigateTo('about-programs');
            }}
          />
        )}

        {/* Login Modal */}
        {isLoginModalOpen && (
          <LoginModal
            key="login-modal"
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={navigateToPortal}
            onNavigate={navigateTo}
          />
        )}
      </ThemeProvider>

      {/* Passkey registration prompt — shown once after first Google login */}
      {showPasskeyPrompt && currentUser && (
        <PasskeyPrompt
          userId={currentUser.id}
          userEmail={currentUser.email}
          onDismiss={dismissPasskeyPrompt}
        />
      )}

      {/* Cookie Consent */}
      <CookieConsent />

      {/* Chat Bot - Only on Home Page */}
      {currentPage === 'home' && !isProfileLoading && <ChatWidget />}
    </>
  );
};
