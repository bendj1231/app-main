import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { HomePage } from '@/routes';
import { LoginModal } from '@/components/website/components/LoginModal';
import { CookieConsent } from '@/components/CookieConsent';
import { initializeAnalyticsServices } from '@/src/lib/analytics-config';

const LOGO_URL = "https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png";
const ACCREDITATION_URL = "/images/accreditation.png";
const ACCREDITATION_2_URL = "/images/accreditation-2.png";
const ACCREDITATION_3_URL = "/images/accreditation-3.png";
const ACCREDITATION_4_URL = "/images/accreditation-4.png";
const ACCREDITATION_5_URL = "/images/accreditation-5.png";

const safeRedirect = (path: string) => {
  window.location.href = path;
};

const navigateTo = (page: string, data?: any) => {
  if (page === 'recognition-plus' || page === 'pilot-recognition') {
    safeRedirect('/recognition-plus');
    return;
  }

  const [basePage, hash] = String(page).includes('#') ? String(page).split('#') : [page, null];
  window.scrollTo({ top: 0, behavior: 'instant' });
  safeRedirect(`/${basePage}${hash ? `#${hash}` : ''}`);
};

// Initialize analytics services on app load
initializeAnalyticsServices();

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEnrolledInFoundation, setIsEnrolledInFoundation] = useState(false);
  const [pilotId, setPilotId] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [lastFlown, setLastFlown] = useState('');
  const [mentorshipHours, setMentorshipHours] = useState(0);
  const [foundationProgress, setFoundationProgress] = useState(0);
  const [examinationScore, setExaminationScore] = useState(0);
  const [overallRecognitionScore, setOverallRecognitionScore] = useState(0);
  const { currentUser, logout } = useAuth();

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
          .single();

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
      if (!currentUser?.uid) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('pilot_id, profile_image_url, total_flight_hours, last_flown, mentorship_hours, foundation_progress, examination_score, overall_recognition_score, enrolled_programs')
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
      }
    };

    fetchProfileData();
  }, [currentUser]);

  const navigateToPortal = () => {
    safeRedirect('/portal');
  };

  return (
    <>
      {/* Global Loading Overlay */}
      <div className={`loading-overlay ${!loading ? 'hidden' : ''}`}>
        <div className="loading-content">
          <img src={LOGO_URL} alt="Logo" className="loading-logo-main" />
          <div className="loading-subtitle-blue">connecting pilots to the industry</div>
          <div className="loading-text">Bridging the Pilot Gap.</div>
          <div className="accreditation-box">
            <div className="accreditation-label">recognized & accredited by</div>
            <div className="accreditation-logos-row">
              <img src={ACCREDITATION_URL} alt="Accreditation 1" className="accreditation-logo" />
              <img src={ACCREDITATION_2_URL} alt="Accreditation 2" className="accreditation-logo" />
              <img src={ACCREDITATION_3_URL} alt="Accreditation 3" className="accreditation-logo" />
              <img src={ACCREDITATION_4_URL} alt="Accreditation 4" className="accreditation-logo" />
              <img src={ACCREDITATION_5_URL} alt="Accreditation 5" className="accreditation-logo" />
            </div>
          </div>
        </div>
      </div>

      {/* Home Page */}
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

      {/* Cookie Consent */}
      <CookieConsent />
    </>
  );
};
