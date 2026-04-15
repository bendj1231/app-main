/**
 * WingMentor - Main Entry Point
 * Stabilized and Recovered UI Foundation
 */

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { View } from './types';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CheckCircle,
  Wrench,
  Mail,
  LineChart,
  Globe,
  LayoutGrid,
  Briefcase,
  HelpCircle,
  ExternalLink,
  Settings,
  User,
  LogOut,
  Zap,
  Award,
  AppWindow,
  Cpu,
  Tablet,
  Book
} from 'lucide-react';

import { Styles } from '@/src/components/ui/Styles';
import { ChevronRight, MenuIcon } from '@/src/components/ui/Icons';
import { AirbusSoftwarePage } from '@/src/features/website/AirbusSoftwarePage';
import { BusinessPlanPage } from '@/src/features/website/BusinessPlanPage';
import { ProgramProgress } from '@/src/features/dashboard/ProgramProgress';
import { ProgramLogsEmbed } from '@/src/features/dashboard/ProgramLogsEmbed';
import PilotTools from './components/PilotTools';
import PilotApps from './components/PilotApps';
import MentorTools from './components/MentorTools';
import WelcomeGuide from './components/WelcomeGuide';
import Dashboard from './components/Dashboard';
import WebBrowser from './components/WebBrowser';
import { Sidebar } from '@/src/components/ui/Sidebar';
import { Handbook } from '@/src/components/ui/Handbook';
import { AuthProvider } from '@/src/contexts/AuthContext';

const AboutProgramsPage = ({ onBack }: { onBack: () => void }) => (
  <div className="fade-in-up">
    <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
    <h1>About Programs Page - Moved</h1>
  </div>
);
import { DashboardPage } from './components/website/components/DashboardPage';
import { DashboardLayout } from './components/website/components/DashboardLayout';
import { WeatherMonitor } from './components/website/components/WeatherMonitor';
import { WebsitePage } from './components/website/WebsitePage';
import { HomePage } from './components/website/components/home/HomePage';
import { ContactSupportPage } from './components/website/components/ContactSupportPage';
import { AboutPage } from './components/website/components/AboutPage';
import { BecomeMemberPage } from './components/website/components/BecomeMemberPage';
import { AccreditationPage } from './components/website/components/AccreditationPage';
import { EmiratesAtplPage } from './components/website/components/pathways/EmiratesAtplPage';
import { EmergingAirTaxiPage } from './components/website/components/pathways/EmergingAirTaxiPage';
import { PilotedDronesPage } from './components/website/components/pathways/PilotedDronesPage';
import { PilotGapInfoPage } from './components/website/components/PilotGapInfoPage';
import { PilotRecognitionPage } from './components/website/components/pilot-recognition/PilotRecognitionPage';
import { AirTaxiPathwaysPage } from './components/website/components/pathways/AirTaxiPathwaysPage';
import { PrivateCharterPathwaysPage } from './components/website/components/pathways/PrivateCharterPathwaysPage';
import { EBTCBTAPage } from './components/website/components/EBTCBTAPage';
import { AirlineExpectationsPage } from './components/website/components/AirlineExpectationsPage';
import { ATLASCVPage } from './components/website/components/pilot-recognition/ATLASCVDirectoryPage';
import { FoundationalProgramApplicationPage } from './components/website/components/programs/FoundationalProgramApplicationDirectoryPage';
import { TransitionProgramApplicationPage } from './components/website/components/programs/TransitionProgramApplicationDirectoryPage';

import { BoardPage } from './components/website/components/BoardPage';
import { GovernancePage } from './components/website/components/GovernancePage';
import { CommitteesPage } from './components/website/components/CommitteesPage';
import { FAQPage } from './components/website/components/FAQPage';
import { MissionVisionPage } from './components/website/components/MissionVisionPage';
import { CoreValuesPage } from './components/website/components/CoreValuesPage';
import { IndustryStewardshipPage } from './components/website/components/IndustryStewardshipPage';
import { FoundationalProgramPage } from './components/website/components/programs/FoundationalProgramPage';
import { PlatformFoundationalProgramPage } from './components/website/components/programs/PlatformFoundationalProgramPage';
import { PlatformTransitionProgramPage } from './components/website/components/programs/PlatformTransitionProgramPage';
import { FoundationalVerificationPage } from './components/website/components/programs/FoundationalVerificationPage';
import { PlatformEmiratesAtplPage } from './components/website/components/pathways/PlatformEmiratesAtplPage';
import { PlatformAirTaxiPage } from './components/website/components/pathways/PlatformAirTaxiPage';
import { PlatformPrivateCharterPage } from './components/website/components/pathways/PlatformPrivateCharterPage';
import { PlatformPilotedDronesPage } from './components/website/components/pathways/PlatformPilotedDronesPage';
import { TransitionProgramPage } from './components/website/components/programs/TransitionProgramPage';
import { ProgramsPathwaysPage } from './components/website/components/programs/ProgramsPathwaysPage';
import { ProgramsPage } from './components/website/components/programs/ProgramsPage';
import { PathwaysPage } from './components/website/components/pathways/PathwaysPage';
import { PortalWrapper } from './components/website/components/portal/PortalWrapper';
import { AviationInsightsDirectoryPage } from './components/website/components/AviationInsightsDirectoryPage';
import { ApplicationsSystemsDirectoryPage } from './components/website/components/ApplicationsSystemsDirectoryPage';
import { MembershipDirectoryPage } from './components/website/components/MembershipDirectoryPage';
import { HinfactPage } from './components/website/components/HinfactDirectoryPage';
import { W1000SuitePage } from './components/website/components/W1000SuiteDirectoryPage';
import { MembershipBenefitsPage } from './components/website/components/MembershipBenefitsDirectoryPage';
import { DownloadPage } from './components/website/components/DownloadPage'; // New Import
import { useAuth } from './src/contexts/AuthContext'; // New Import
import { LoginModal } from './components/website/components/LoginModal';









const LOGO_URL = "https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR";
const ACCREDITATION_URL = "https://lh3.googleusercontent.com/d/12pf5A8zfaAmnN0TFPrL6_OV8Em7lX_p9";
const ACCREDITATION_2_URL = "https://lh3.googleusercontent.com/d/1EbPJSQbhBiEnBtP6lSPrYIkLxANUDJBl";
const ACCREDITATION_3_URL = "https://lh3.googleusercontent.com/d/1kpzjxNltR6BrX8IEitGbathVAZe8HVF-";
const ACCREDITATION_4_URL = "https://lh3.googleusercontent.com/d/1mO2UeKmfgb2Z3ZMqcEeBze5w119HZgUb";
const ACCREDITATION_5_URL = "https://lh3.googleusercontent.com/d/1sbabopQiNZkWXsGcePTH1MjzY2HzJate";
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSejj0W4rddiU2Ijs0NQEnvdBZdT45fCxzcp8JR15PTOiLC-OA/viewform?usp=sf_link";
const AVIATION_WEATHER_LINK = "https://aviationweather.gov/metar";

// Custom Icons and Styles extracted to @/src/components/ui/


// AirbusSoftwarePage moved to src/features/website/AirbusSoftwarePage.tsx
// AboutProgramsPage merged or moved
// AviationInsightsPage moved to src/features/website/AviationInsightsPage.tsx

const InnovationHubPage = ({ onBack }: { onBack: () => void }) => (
  <div className="fade-in-up">
    <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
    <div className="innovation-banner" style={{ padding: 'clamp(30px, 8vw, 60px)' }}>
      <h3 style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Aerospace Future</h3>
      <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', margin: '8px 0' }}>Innovation Hub</h1>
      <p style={{ fontSize: 'clamp(1rem, 3vw, 1.1rem)', maxWidth: '600px', opacity: 0.8 }}>Exploring the convergence of Urban Air Mobility and Autonomous Aviation.</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
      <div className="logbook-card" style={{ padding: 'clamp(24px, 5vw, 40px)' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 800, marginBottom: 16 }}>Air Taxis (eVTOL)</h2>
        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: 24 }}>The shift to electric Vertical Take-Off and Landing systems is revolutionizing short-haul urban transport. Pilots must prepare for simplified vehicle operations (SVO) and vertical infrastructure navigation.</p>
        <div style={{ background: '#f8f9fa', padding: 24, borderRadius: 20 }}>
          <h4 style={{ margin: '0 0 12px 0' }}>Current Market Nodes:</h4>
          <ul style={{ paddingLeft: 20, color: '#444' }}>
            <li>Joby Aviation - Commercial Phase</li>
            <li>Archer Aviation - Logistics Tier 1</li>
            <li>Lilium - Regional Expansion</li>
          </ul>
        </div>
      </div>

      <div className="logbook-card" style={{ padding: 'clamp(24px, 5vw, 40px)' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 800, marginBottom: 16 }}>Unmanned Systems (UAV)</h2>
        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: 24 }}>Beyond visual line of sight (BVLOS) operations are redefining drone logistics and aerial surveillance. Integrating autonomous drones into existing airspace requires advanced telemetry interpretation.</p>
        <div style={{ background: '#f8f9fa', padding: 24, borderRadius: 20 }}>
          <h4 style={{ margin: '0 0 12px 0' }}>Active Sectors:</h4>
          <ul style={{ paddingLeft: 20, color: '#444' }}>
            <li>Autonomous Cargo Delivery</li>
            <li>High-Altitude Endurance (HALE)</li>
            <li>Last-Mile Logistics Integration</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// ProgramProgress moved to src/features/dashboard/ProgramProgress.tsx
// ProgramLogsEmbed moved to src/features/dashboard/ProgramLogsEmbed.tsx
// BusinessPlanPage moved to src/features/website/BusinessPlanPage.tsx












const App = () => {
  const [jotFormConnected, setJotFormConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingType, setLoadingType] = useState<'website' | 'portal'>('website');
  const [currentPage, setCurrentPage] = useState<any>('home');
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  const [isBlurring, setIsBlurring] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState<any>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const { currentUser } = useAuth(); // Get current user

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Loading timer fired, setting loading to false');
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('App state:', { loading, currentPage, appError });
  }, [loading, currentPage, appError]);

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setAppError(event.error?.message || 'Unknown error');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const navigateTo = (page: any, data?: any) => {
    const [basePage, hash] = String(page).includes('#') ? String(page).split('#') : [page, null];
    setScrollToSection(hash || null);

    // Store selected airline if provided
    if (data && basePage === 'airline-expectations') {
      setSelectedAirline(data);
    } else if (basePage !== 'airline-expectations') {
      setSelectedAirline(null);
    }

    setIsBlurring(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setCurrentPage(basePage);
      setIsBlurring(false);
    }, 600);
  };

  const navigateToPortal = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.open('https://pilotnetwork.vercel.app', '_blank');
      setIsRedirecting(false);
    }, 3000);
  };

  return (
    <>
      <Styles />

      {/* Error Display */}
      {appError && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#334155',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '600px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#ef4444', marginBottom: '20px', fontSize: '24px' }}>Application Error</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.6' }}>
              {appError}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )}

      {/* Global Loading Overlay */}
      <div className={`loading-overlay ${!loading ? 'hidden' : ''}`}>
        <div className="loading-content">
          <img src={LOGO_URL} alt="Logo" className="loading-logo-main" />

          {loadingType === 'website' ? (
            <>
              <div className="loading-subtitle-blue">connecting pilots to the industry</div>
              <div className="loading-text">Bridging the Pilot Gap.</div>
            </>
          ) : (
            <div className="loading-text-portal">Programs | Applications | Pathways</div>
          )}

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

      <div className={`page-transition-wrapper ${isBlurring ? 'page-blur-active' : ''} ${loading ? 'page-blur-active' : ''}`}
        style={loading ? { filter: 'blur(20px)', opacity: 0.5 } : {}}>
        {currentPage === 'home' && (
          <HomePage
            onJoinUs={() => navigateTo('become-member')}
            onLogin={navigateToPortal}
            onNavigate={navigateTo}
            isLoggedIn={!!currentUser}
            onLoginModalOpen={() => setIsLoginModalOpen(true)}
            onGoToProgramDetail={(slide) => {
              if (slide?.title === 'Emirates ATPL Pilot Pathways') {
                navigateTo('emirates-atpl');
              } else if (slide?.title === 'Emerging Air Taxi Sector') {
                navigateTo('emerging-air-taxi');
              } else if (slide?.title === 'Air Taxi Pilot Pathways') {
                navigateTo('air-taxi-pathways');
              } else if (slide?.title === 'Private Charter Pathways') {
                navigateTo('private-charter-pathways');
              } else if (slide?.title === 'EBT CBTA familiarization') {
                navigateTo('ebt-cbta');
              } else if (slide?.title === 'Unmanned Drones Pathways') {
                navigateTo('piloted-drones');
              } else if (slide?.title === 'What is the Pilot Gap?') {
                navigateTo('pilot-gap');
              } else if (slide?.title === 'Transition Program') {
                navigateTo('transition-program');
              } else if (slide?.title === 'Pilot Database Recognition System') {
                navigateTo('pilot-recognition');
              } else if (slide?.title === 'Foundational Program') {
                navigateTo('foundational-program');
              } else {
                navigateTo('about-programs');
              }
            }}
          />
        )}

        {currentPage === 'website' && (
          <WebsitePage
            onGoToProgramDetail={() => navigateTo('foundational')}
            onGoToGapPage={() => navigateTo('transition')}
            onGoToOperatingHandbook={() => navigateTo('handbook')}
            onGoToBlackBox={() => navigateTo('pilot_tools')}
            onGoToExaminationTerminal={() => navigateTo('pilot_apps')}
            onGoToEnrollment={navigateToPortal}
            onGoToHub={() => navigateTo('dashboard')}
          />
        )}

        {currentPage === 'about_programs' && (
          <ProgramsPathwaysPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'insights' && (
          <AviationInsightsDirectoryPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'applications_systems' && (
          <ApplicationsSystemsDirectoryPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'membership' && (
          <MembershipDirectoryPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
            scrollToSection={scrollToSection}
          />
        )}
        {currentPage === 'pilot-gap' && (
          <PilotGapInfoPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'accreditation' && (
          <AccreditationPage onBack={() => navigateTo('home')} onNavigate={navigateTo} onLogin={navigateToPortal} />
        )}

        {currentPage === 'emirates-atpl' && (
          <EmiratesAtplPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'emerging-air-taxi' && (
          <EmergingAirTaxiPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'transition-program' && (
          <TransitionProgramPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'piloted-drones' && (
          <PilotedDronesPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'pilot-recognition' && (
          <PilotRecognitionPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'air-taxi-pathways' && (
          <AirTaxiPathwaysPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'private-charter-pathways' && (
          <PrivateCharterPathwaysPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'ebt-cbta' && (
          <EBTCBTAPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'airline-expectations' && (
          <AirlineExpectationsPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
            selectedAirline={selectedAirline}
          />
        )}

        {currentPage === 'atlas-cv' && (
          <ATLASCVPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'foundational-program' && (
          <FoundationalProgramPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'download' && (
          <DownloadPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}

        {currentPage === 'faq' && (
          <FAQPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'board' && (
          <BoardPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'governance' && (
          <GovernancePage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'committees' && (
          <CommitteesPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'mission-vision' && (
          <MissionVisionPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'core-values' && (
          <CoreValuesPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'industry-stewardship' && (
          <IndustryStewardshipPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'w1000-suite' && (
          <W1000SuitePage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'hinfact' && (
          <HinfactPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'membership-benefits' && (
          <MembershipBenefitsPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'become-member' && (
          <BecomeMemberPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'contact-support' && (
          <ContactSupportPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'foundational-application' && (
          <FoundationalProgramApplicationPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'transition-application' && (
          <TransitionProgramApplicationPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'programs-pathways' && (
          <ProgramsPathwaysPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'programs' && (
          <ProgramsPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {currentPage === 'pathways' && (
          <PathwaysPage
            onBack={() => navigateTo('home')}
            onNavigate={navigateTo}
            onLogin={navigateToPortal}
          />
        )}
        {/* Temporarily disabled portal routing to debug blank page issue */}
        {/* {currentPage === 'portal' && (
          <PortalWrapper
            onNavigate={navigateTo}
            onBack={() => navigateTo('home')}
          />
        )} */}
      </div>

      {![
        'home', 'about', 'accreditation', 'faq', 'board', 'governance',
        'committees', 'w1000-suite', 'hinfact', 'membership-benefits', 'become-member',
        'contact-support', 'emirates-atpl', 'emerging-air-taxi', 'piloted-drones',
        'pilot-recognition', 'air-taxi-pathways', 'private-charter-pathways', 'ebt-cbta',
        'airline-expectations', 'atlas-cv', 'foundational-program', 'foundational-application', 'transition-program', 'transition-application', 'programs-pathways', 'programs', 'pathways', 'portal', 'about_programs', 'insights', 'applications_systems', 'membership', 'mission-vision', 'core-values', 'industry-stewardship',
        'pilot-gap', 'website'
      ].includes(currentPage) && (
          <div className={`layout-wrapper ${loading ? 'content-loading' : 'content-ready'}`}>
            {!loading && (
              <>
                <Sidebar
                  activePage={currentPage}
                  onNavigate={navigateTo}
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                />
                <div className="mobile-header">
                  <img src={LOGO_URL} alt="Logo" style={{ height: 32 }} />
                  <button className="menu-toggle-btn" onClick={() => setSidebarOpen(true)}>
                    <MenuIcon />
                  </button>
                </div>
                <main className="main-content" style={{ position: 'relative' }}>
                  {/* Top Navigation Bar */}
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: '280px',
                    right: 0,
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 30px',
                    gap: '16px',
                    zIndex: 1000
                  }}>
                    {/* Sign In / Download Text */}
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        cursor: 'pointer'
                      }}
                      onClick={currentUser ? () => navigateTo('download') : navigateToPortal}
                    >
                      {currentUser ? 'Access Portal' : 'Sign In'}
                    </span>

                    {/* Profile Icon - Light Cyan Blue Square */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#e5e7eb',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#d1d5db'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#e5e7eb'}
                    >
                      <User size={20} color="#1a1a1a" />
                    </div>

                    {/* Settings Icon - Light Cyan Blue Square */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#e5e7eb',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#d1d5db'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#e5e7eb'}
                      onClick={() => navigateTo('settings')}
                    >
                      <Settings size={20} color="#1a1a1a" />
                    </div>

                    {/* Menu Icon - Red Square */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#dc2626',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </svg>
                    </div>
                  </div>

                  {/* Content wrapper with padding for fixed nav */}
                  <div style={{ paddingTop: '80px' }}>
                    {currentPage === 'dashboard' && (
                      <div style={{ marginTop: '-80px' }}>
                        <DashboardLayout onNavigate={navigateTo} onLogout={() => setCurrentPage('home')} />
                      </div>
                    )}
                    {currentPage === 'about_programs' && <AboutProgramsPage onBack={() => navigateTo('dashboard')} />}
                    {currentPage === 'foundational' && <FoundationalProgramPage onBack={() => navigateTo('dashboard')} />}
                    {currentPage === 'foundational-platform' && <PlatformFoundationalProgramPage onNavigate={navigateTo} />}
                    {currentPage === 'foundational-verification' && (
                      <FoundationalVerificationPage
                        onBack={() => navigateTo('foundational-platform')}
                        onNavigate={navigateTo}
                        onLogin={navigateToPortal}
                      />
                    )}
                    {currentPage === 'transition' && <TransitionProgramPage onBack={() => navigateTo('dashboard')} onNavigate={navigateTo} onLogin={navigateToPortal} />}
                    {currentPage === 'transition-program' && (
                      <TransitionProgramPage
                        onBack={() => navigateTo('transition-platform')}
                        onNavigate={(page) => page === 'home' ? navigateTo('dashboard') : navigateTo(page)}
                        onLogin={navigateToPortal}
                      />
                    )}
                    {currentPage === 'transition-platform' && (
                      <PlatformTransitionProgramPage
                        onNavigate={navigateTo}
                      />
                    )}

                    {currentPage === 'emirates-atpl-platform' && (
                      <PlatformEmiratesAtplPage
                        onNavigate={navigateTo}
                      />
                    )}
                    {currentPage === 'air-taxi-platform' && (
                      <PlatformAirTaxiPage
                        onNavigate={navigateTo}
                      />
                    )}
                    {currentPage === 'private-charter-platform' && (
                      <PlatformPrivateCharterPage
                        onNavigate={navigateTo}
                      />
                    )}
                    {currentPage === 'piloted-drones-platform' && (
                      <PlatformPilotedDronesPage
                        onNavigate={navigateTo}
                      />
                    )}  {currentPage === 'airbus' && <AirbusSoftwarePage onBack={() => navigateTo('dashboard')} />}

                    {currentPage === 'innovation' && <InnovationHubPage onBack={() => navigateTo('dashboard')} />}

                    {currentPage === 'weather' && <div className="fade-in-up"><button className="back-btn" onClick={() => navigateTo('dashboard')}>← Back</button><WeatherMonitor /></div>}
                    {currentPage === 'progress_analytics' && <ProgramProgress connected={jotFormConnected} onConnect={() => setJotFormConnected(true)} />}
                    {currentPage === 'program_logs' && <ProgramLogsEmbed />}
                    {currentPage === 'pilot_apps' && <PilotApps />}
                    {currentPage === 'pilot_tools' && <PilotTools />}
                    {currentPage === 'mentor_tools' && <MentorTools />}
                    {currentPage === 'handbook' && <Handbook />}
                    {currentPage === 'business-plan' && <BusinessPlanPage onBack={() => navigateTo('dashboard')} />}
                    {currentPage === 'welcome_guide' && <WelcomeGuide onNavigate={navigateTo} />}
                    {currentPage === 'settings' && (
                      <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
                          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                            <User size={40} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-800">Operational User</h3>
                            <p className="text-slate-500">System Access Active</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </main>
              </>
            )}
          </div>
        )}

      {/* Portal Redirect Loading Modal */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Redirecting you to the portal</h2>
            <p className="text-slate-600">Please wait while we connect you to the portal...</p>
          </div>
        </div>
      )}

      {/* Login Modal - at root level to avoid overflow-x-hidden issue */}
      {isLoginModalOpen && (
        <LoginModal
          key="login-modal"
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={navigateToPortal}
          onNavigate={navigateTo}
        />
      )}
    </>
  );

};

const root = createRoot(document.getElementById('root')!);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
