import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';
import { OAuthCallback } from '@/src/components/OAuthCallback';

const LoginModal = lazy(() => import('@/components/website/components/LoginModal').then(m => ({ default: m.LoginModal })));
const HomePage = lazy(() => import('@/components/website/components/home/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('@/components/website/components/AboutPage').then(m => ({ default: m.AboutPage })));
const TechnicalIndexPage = lazy(() => import('@/components/website/components/TechnicalIndexPage').then(m => ({ default: m.TechnicalIndexPage })));
const AboutIndustryPage = lazy(() => import('@/components/website/components/AboutIndustryPage').then(m => ({ default: m.AboutIndustryPage })));
const FAQPage = lazy(() => import('@/components/website/components/FAQPage').then(m => ({ default: m.FAQPage })));
const MissionVisionPage = lazy(() => import('@/components/website/components/MissionVisionPage').then(m => ({ default: m.MissionVisionPage })));
const IndustryStewardshipPage = lazy(() => import('@/components/website/components/IndustryStewardshipPage').then(m => ({ default: m.IndustryStewardshipPage })));
const ContactSupportPage = lazy(() => import('@/components/website/components/ContactSupportPage').then(m => ({ default: m.ContactSupportPage })));
const BecomeMemberPage = lazy(() => import('@/components/website/components/BecomeMemberPage').then(m => ({ default: m.BecomeMemberPage })));
const AccountConfirmationPage = lazy(() => import('@/components/website/components/AccountConfirmationPage').then(m => ({ default: m.AccountConfirmationPage })));
const EmiratesAtplPage = lazy(() => import('@/components/website/components/pathways/EmiratesAtplPage').then(m => ({ default: m.EmiratesAtplPage })));
const EmergingAirTaxiPage = lazy(() => import('@/components/website/components/pathways/EmergingAirTaxiPage').then(m => ({ default: m.EmergingAirTaxiPage })));
const PilotedDronesPage = lazy(() => import('@/components/website/components/pathways/PilotedDronesPage').then(m => ({ default: m.PilotedDronesPage })));
const AirTaxiPathwaysPage = lazy(() => import('@/components/website/components/pathways/AirTaxiPathwaysPage').then(m => ({ default: m.AirTaxiPathwaysPage })));
const CadetProgramsPathwaysPage = lazy(() => import('@/components/website/components/pathways/CadetProgramsPathwaysPage').then(m => ({ default: m.CadetProgramsPathwaysPage })));
const PrivateCharterPathwaysPage = lazy(() => import('@/components/website/components/pathways/PrivateCharterPathwaysPage').then(m => ({ default: m.PrivateCharterPathwaysPage })));
const CargoTransportationPage = lazy(() => import('@/components/website/components/pathways/CargoTransportationPage').then(m => ({ default: m.CargoTransportationPage })));
const FoundationalProgramPage = lazy(() => import('@/components/website/components/programs/FoundationalProgramPage').then(m => ({ default: m.FoundationalProgramPage })));
const TransitionProgramPage = lazy(() => import('@/components/website/components/programs/TransitionProgramPage').then(m => ({ default: m.TransitionProgramPage })));
const ProgramBenefitsPage = lazy(() => import('@/components/website/components/programs/ProgramBenefitsPage').then(m => ({ default: m.ProgramBenefitsPage })));
const NewsUpdatesPage = lazy(() => import('@/components/website/components/programs/NewsUpdatesPage').then(m => ({ default: m.NewsUpdatesPage })));
const ProgramsPathwaysPage = lazy(() => import('@/components/website/components/programs/ProgramsPathwaysPage').then(m => ({ default: m.ProgramsPathwaysPage })));
const ProgramsPage = lazy(() => import('@/components/website/components/programs/ProgramsPage').then(m => ({ default: m.ProgramsPage })));
const PlatformFoundationalProgramPage = lazy(() => import('@/components/website/components/programs/PlatformFoundationalProgramPage').then(m => ({ default: m.PlatformFoundationalProgramPage })));
const RecognitionPlusPage = lazy(() => import('@/app/recognition-plus/page'));
const RecognitionPlusComparisonPage = lazy(() => import('@/app/recognition-plus-comparison/page'));
const LearnAboutPage = lazy(() => import('@/app/learn-about/page'));
const GeneralPage = lazy(() => import('@/app/general/page'));
const ProfessionalProfilePage = lazy(() => import('@/app/professional-profile/page'));
const BackgroundCheckPage = lazy(() => import('@/app/background-check/page'));
const PilotInsurancePage = lazy(() => import('@/app/pilot-insurance/page'));
const BankingFinancePage = lazy(() => import('@/app/banking-finance/page'));
const CareerToolsPage = lazy(() => import('@/app/career-tools/page'));
const EnrolledFoundationalPage = lazy(() => import('@/components/website/components/programs/EnrolledFoundationalPage').then(m => ({ default: m.EnrolledFoundationalPage })));
const FoundationalModulesPage = lazy(() => import('@/components/website/components/programs/FoundationalModulesPage').then(m => ({ default: m.FoundationalModulesPage })));
const FoundationalProgressPage = lazy(() => import('@/components/website/components/programs/FoundationalProgressPage').then(m => ({ default: m.FoundationalProgressPage })));
const FoundationalLogbookPage = lazy(() => import('@/components/website/components/programs/FoundationalLogbookPage').then(m => ({ default: m.FoundationalLogbookPage })));
const FoundationalChapter1Page = lazy(() => import('@/components/website/components/programs/FoundationalChapter1Page').then(m => ({ default: m.FoundationalChapter1Page })));
const FoundationalChapter2Page = lazy(() => import('@/components/website/components/programs/FoundationalChapter2Page').then(m => ({ default: m.FoundationalChapter2Page })));
const FoundationalChapter3Page = lazy(() => import('@/components/website/components/programs/FoundationalChapter3Page').then(m => ({ default: m.FoundationalChapter3Page })));
const PilotGapModulePage = lazy(() => import('@/components/website/components/programs/PilotGapModulePage'));
const PlatformTransitionProgramPage = lazy(() => import('@/components/website/components/programs/PlatformTransitionProgramPage').then(m => ({ default: m.PlatformTransitionProgramPage })));
const PlatformEmiratesAtplPage = lazy(() => import('@/components/website/components/pathways/PlatformEmiratesAtplPage').then(m => ({ default: m.PlatformEmiratesAtplPage })));
const PlatformAirTaxiPage = lazy(() => import('@/components/website/components/pathways/PlatformAirTaxiPage').then(m => ({ default: m.PlatformAirTaxiPage })));
const PlatformPrivateCharterPage = lazy(() => import('@/components/website/components/pathways/PlatformPrivateCharterPage').then(m => ({ default: m.PlatformPrivateCharterPage })));
const PlatformPilotedDronesPage = lazy(() => import('@/components/website/components/pathways/PlatformPilotedDronesPage').then(m => ({ default: m.PlatformPilotedDronesPage })));
const FoundationalVerificationPage = lazy(() => import('@/components/website/components/programs/FoundationalVerificationPage').then(m => ({ default: m.FoundationalVerificationPage })));
const PilotRecognitionPage = lazy(() => import('@/components/website/components/pilot-recognition/PilotRecognitionPage').then(m => ({ default: m.PilotRecognitionPage })));
const PilotRecognitionProfilePage = lazy(() => import('@/components/website/components/pilot-recognition/PilotRecognitionProfilePage').then(m => ({ default: m.PilotRecognitionProfilePage })));
const PilotLicensureExperiencePage = lazy(() => import('@/components/website/components/pilot-recognition/PilotLicensureExperiencePage').then(m => ({ default: m.PilotLicensureExperiencePage })));
const WhatIsPilotRecognitionPage = lazy(() => import('../../components/website/components/WhatIsPilotRecognitionPage'));
const ScoreOptimizationPage = lazy(() => import('@/components/website/components/pilot-recognition/ScoreOptimizationPage').then(m => ({ default: m.ScoreOptimizationPage })));
const RecognitionScoreInfoPage = lazy(() => import('@/components/website/components/pilot-recognition/RecognitionScoreInfoPage').then(m => ({ default: m.RecognitionScoreInfoPage })));
const RecognitionCareerMatchesPage = lazy(() => import('@/components/website/components/pilot-recognition/RecognitionCareerMatchesPage').then(m => ({ default: m.RecognitionCareerMatchesPage })));
const ATLASCVPage = lazy(() => import('@/components/website/components/pilot-recognition/ATLASCVDirectoryPage').then(m => ({ default: m.ATLASCVPage })));
const AviationInsightsDirectoryPage = lazy(() => import('@/components/website/components/AviationInsightsDirectoryPage').then(m => ({ default: m.AviationInsightsDirectoryPage })));
const ApplicationsSystemsDirectoryPage = lazy(() => import('@/components/website/components/ApplicationsSystemsDirectoryPage').then(m => ({ default: m.ApplicationsSystemsDirectoryPage })));
const MembershipDirectoryPage = lazy(() => import('@/components/website/components/MembershipDirectoryPage').then(m => ({ default: m.MembershipDirectoryPage })));
const HinfactPage = lazy(() => import('@/components/website/components/HinfactDirectoryPage').then(m => ({ default: m.HinfactPage })));
const W1000Page = lazy(() => import('@/components/website/components/W1000Page'));
const W1000SuitePage = lazy(() => import('@/components/website/components/W1000SuiteDirectoryPage').then(m => ({ default: m.W1000SuitePage })));
const W2000ApplicationPage = lazy(() => import('@/components/website/components/W2000ApplicationPage').then(m => ({ default: m.W2000ApplicationPage })));
const MembershipBenefitsPage = lazy(() => import('@/components/website/components/MembershipBenefitsDirectoryPage').then(m => ({ default: m.MembershipBenefitsPage })));
const ExaminationResultsDirectoryPage = lazy(() => import('@/components/website/components/ExaminationResultsDirectoryPage'));
const OfficialExaminationBoardPage = lazy(() => import('@/components/website/components/OfficialExaminationBoardPage'));
const DigitalLogbookDirectoryPage = lazy(() => import('@/components/website/components/DigitalLogbookDirectoryPage').then(m => ({ default: m.DigitalLogbookDirectoryPage })));
const DigitalLogbookPage = lazy(() => import('@/components/website/components/pilot-recognition/DigitalLogbookPage').then(m => ({ default: m.DigitalLogbookPage })));
const EBTCBTAPage = lazy(() => import('@/components/website/components/EBTCBTAPage').then(m => ({ default: m.EBTCBTAPage })));
const AirlineExpectationsPage = lazy(() => import('@/components/website/components/AirlineExpectationsPage').then(m => ({ default: m.AirlineExpectationsPage })));
const PortalAirlineExpectationsPage = lazy(() => import('@/portal/pages/PortalAirlineExpectationsPage').then(m => ({ default: m.PortalAirlineExpectationsPage })));
const TypeRatingSearchPage = lazy(() => import('@/pages/TypeRatingSearchPage'));
const JobListingsPage = lazy(() => import('@/pages/JobListingsPage'));
const PilotGapAboutPage = lazy(() => import('@/components/website/components/PilotGapAboutPage').then(m => ({ default: m.PilotGapAboutPage })));
const DownloadPage = lazy(() => import('@/components/website/components/DownloadPage').then(m => ({ default: m.DownloadPage })));
const SettingsDirectoryPage = lazy(() => import('@/components/website/components/SettingsDirectoryPage').then(m => ({ default: m.SettingsDirectoryPage })));
const SubscriptionPage = lazy(() => import('@/components/website/components/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const OnboardingPilotPortal = lazy(() => import('@/components/website/components/OnboardingPilotPortal').then(m => ({ default: m.OnboardingPilotPortal })));
const OnboardingPrograms = lazy(() => import('@/components/website/components/OnboardingPrograms').then(m => ({ default: m.OnboardingPrograms })));
const OnboardingRecognition = lazy(() => import('@/components/website/components/OnboardingRecognition').then(m => ({ default: m.OnboardingRecognition })));
const DirectEnrollmentLoadingScreen = lazy(() => import('@/components/website/components/home/DirectEnrollmentLoadingScreen').then(m => ({ default: m.DirectEnrollmentLoadingScreen })));
const DirectPlatformLoadingScreen = lazy(() => import('@/components/website/components/home/DirectPlatformLoadingScreen').then(m => ({ default: m.DirectPlatformLoadingScreen })));
const PortalWrapper = lazy(() => import('@/components/website/components/portal/PortalWrapper').then(m => ({ default: m.PortalWrapper })));
const PathwaysPageModern = lazy(() => import('@/portal/pages/PathwaysPageModern').then(m => ({ default: m.PathwaysPageModern })));
const SpecializedPathwaysIndex = lazy(() => import('@/portal/pages/SpecializedPathwaysIndex'));
const SpecializedOperationsIndex = lazy(() => import('@/portal/pages/SpecializedOperationsIndex'));
const CareerPathwaysIndex = lazy(() => import('@/portal/pages/CareerPathwaysIndex'));
const AccessPortal2Page = lazy(() => import('@/components/website/components/AccessPortal2Page').then(m => ({ default: m.AccessPortal2Page })));
const ExaminationPortal = lazy(() => import('@/components/website/components/examinations/ExaminationPortal'));
const EnterpriseAccessPage = lazy(() => import('@/app/enterprise-access/page'));
const EnterpriseAccessLearnMorePage = lazy(() => import('@/app/enterprise-access/learn-more/page'));
const AirlinesOperatorsPage = lazy(() => import('@/app/enterprise-access/airlines/page'));
const FlightSchoolsPage = lazy(() => import('@/app/partners/flight-schools/page'));
const DiscoverPathwaysPage = lazy(() => import('@/app/discover-pathways/page'));
const PilotShortagePage = lazy(() => import('@/components/website/components/PilotShortagePage').then(m => ({ default: m.PilotShortagePage })));
const WhyRecognitionPage = lazy(() => import('@/components/website/components/WhyRecognitionPage').then(m => ({ default: m.WhyRecognitionPage })));
const GlobalAviationAuthoritiesPage = lazy(() => import('@/pages/GlobalAviationAuthoritiesPage'));
const BlogPage = lazy(() => import('@/app/blog/page'));
const StorePage = lazy(() => import('@/app/store/page'));
const FrameworkPage = lazy(() => import('@/app/framework/page'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
    Loading...
  </div>
);

// ExternalRedirect: performs a hard browser redirect for cross-origin URLs.
// React Router's <Navigate> treats "https://..." as a relative path, so we use window.location.href directly.
const ExternalRedirect: React.FC<{ url: string }> = ({ url }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  return <LoadingFallback />;
};

export const AppRoutes = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // DEBUG: Log routing info
  console.log('[DEBUG AppRoutes] hostname:', window.location.hostname);
  console.log('[DEBUG AppRoutes] pathname:', window.location.pathname);

  // Subdomain routing for enterprise.pilotrecognition.com
  if (window.location.hostname === 'enterprise.pilotrecognition.com') {
    let path = window.location.pathname;
    // Normalize: strip trailing /index.html from static file serving
    path = path.replace(/\/index\.html$/, '');
    // Handle empty path after stripping
    if (path === '' || path === '/index' || path === '/home') path = '/';
    console.log('[DEBUG AppRoutes] Enterprise subdomain detected, normalized path:', path);

    // Framework pages - served from enterprise subdomain
    if (path === '/framework' || path === '/framework/full' || path.startsWith('/framework/')) {
      console.log('[DEBUG AppRoutes] Rendering FrameworkPage on enterprise subdomain');
      return <FrameworkPage />;
    }

    // Enterprise sub-pages
    if (path === '/enterprise-access/airlines') {
      console.log('[DEBUG AppRoutes] Rendering AirlinesOperatorsPage');
      return <AirlinesOperatorsPage />;
    }
    if (path === '/enterprise-access/learn-more') {
      console.log('[DEBUG AppRoutes] Rendering EnterpriseAccessLearnMorePage');
      return <EnterpriseAccessLearnMorePage />;
    }
    
    // Enterprise root page - MUST check for exact match or root variations
    if (path === '/' || path === '/enterprise-access' || path === '/enterprise') {
      console.log('[DEBUG AppRoutes] Rendering EnterpriseAccessPage for path:', path);
      return <EnterpriseAccessPage />;
    }
    
    console.log('[DEBUG AppRoutes] Unknown path on enterprise subdomain, falling through to Routes:', path);
  }

  // Listen for custom login modal events
  useEffect(() => {
    const handleOpenLoginModal = () => {
      console.log('[DEBUG AppRoutes] open-login-modal event received - opening login modal');
      setIsLoginModalOpen(true);
    };

    window.addEventListener('open-login-modal', handleOpenLoginModal);

    return () => {
      window.removeEventListener('open-login-modal', handleOpenLoginModal);
    };
  }, []);

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  const handleBack = (fallback: string = '/') => {
    navigate(fallback);
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<HomePage onJoinUs={() => navigate('/become-member')} onLogin={() => setIsLoginModalOpen(true)} onNavigate={handleNavigate} onLoginModalOpen={() => setIsLoginModalOpen(true)} />} />
        <Route path="/home" element={<HomePage onJoinUs={() => navigate('/become-member')} onLogin={() => setIsLoginModalOpen(true)} onNavigate={handleNavigate} onLoginModalOpen={() => setIsLoginModalOpen(true)} />} />

        {/* Auth routes */}
        <Route path="/callback" element={<OAuthCallback />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* Portal route */}
        <Route path="/portal" element={
          <ProtectedRoute>
            <PortalWrapper onNavigate={() => {}} onBack={() => {}} />
          </ProtectedRoute>
        } />

        {/* Main website routes */}
      <Route path="/about" element={<AboutPage onBack={() => handleBack()} onNavigate={handleNavigate} onLogin={() => setIsLoginModalOpen(true)} />} />
      <Route path="/about-industry" element={<AboutIndustryPage onBack={() => handleBack()} onNavigate={handleNavigate} onLogin={() => setIsLoginModalOpen(true)} />} />
      <Route path="/technical-index" element={<TechnicalIndexPage onBack={() => handleBack()} onNavigate={handleNavigate} onLogin={() => setIsLoginModalOpen(true)} />} />
      <Route path="/faq" element={<FAQPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/pilot-shortage" element={<PilotShortagePage onBack={() => handleBack()} onNavigate={handleNavigate} onLogin={() => setIsLoginModalOpen(true)} />} />
      <Route path="/why-recognition" element={<WhyRecognitionPage onBack={() => handleBack()} onNavigate={handleNavigate} onLogin={() => setIsLoginModalOpen(true)} />} />
      <Route path="/mission-vision" element={<MissionVisionPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/industry-stewardship" element={<IndustryStewardshipPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/contact-support" element={<ContactSupportPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/become-member" element={<BecomeMemberPage onBack={() => handleBack()} onNavigate={handleNavigate} onLogin={() => setIsLoginModalOpen(true)} />} />
      <Route path="/account-confirmation" element={<AccountConfirmationPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Onboarding routes */}
      <Route path="/onboarding-pilot-portal" element={<OnboardingPilotPortal onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/onboarding-programs" element={<OnboardingPrograms onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/onboarding-recognition" element={<OnboardingRecognition onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Pathways routes */}
      <Route path="/emirates-atpl" element={<EmiratesAtplPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/emerging-air-taxi" element={<EmergingAirTaxiPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/piloted-drones" element={<PilotedDronesPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/air-taxi-pathways" element={<AirTaxiPathwaysPage onBack={() => handleBack('/pathways-modern')} onNavigate={handleNavigate} onLogin={() => setIsLoginModalOpen(true)} />} />
      <Route path="/cadet-pathways" element={<CadetProgramsPathwaysPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/private-charter-pathways" element={<PrivateCharterPathwaysPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/cargo-transportation" element={<CargoTransportationPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Program routes */}
      <Route path="/about_programs" element={<ProgramsPathwaysPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/programs" element={<ProgramsPathwaysPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/benefits" element={<ProgramBenefitsPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
            <Route path="/news-updates" element={<NewsUpdatesPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/foundational-program" element={<FoundationalProgramPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/transition-program" element={<TransitionProgramPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/ebt-cbta" element={<EBTCBTAPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/airbus-aligned-ebt-cbta-programs" element={<EBTCBTAPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Platform routes */}
      <Route path="/foundational-platform" element={<EnrolledFoundationalPage onBack={() => handleBack('access-portal-2?tab=programs')} onNavigate={handleNavigate} />} />
      <Route path="/foundational-modules" element={<FoundationalModulesPage onBack={() => handleBack('/foundational-platform')} onNavigate={handleNavigate} />} />
      <Route path="/pilot-gap-module" element={<PilotGapModulePage onBack={() => handleBack('/foundational-modules')} onNavigateToMentorModules={() => handleNavigate('foundational-modules')} onNavigateToExaminationPortal={() => handleNavigate('foundational-progress')} />} />
      <Route path="/foundational-chapter-1" element={<FoundationalChapter1Page onBack={() => handleBack('/foundational-modules')} onNavigate={handleNavigate} />} />
      <Route path="/foundational-chapter-2" element={<FoundationalChapter2Page onBack={() => handleBack('/foundational-modules')} onNavigate={handleNavigate} />} />
      <Route path="/foundational-chapter-3" element={<FoundationalChapter3Page onBack={() => handleBack('/foundational-modules')} onNavigate={handleNavigate} />} />
      <Route path="/foundational-progress" element={<FoundationalProgressPage onBack={() => handleBack('/foundational-platform')} onNavigate={handleNavigate} />} />
      <Route path="/foundational-logbook" element={<FoundationalLogbookPage onBack={() => handleBack('/foundational-platform')} onNavigate={handleNavigate} />} />
      <Route path="/transition-platform" element={<PlatformTransitionProgramPage onNavigate={handleNavigate} />} />
      <Route path="/emirates-atpl-platform" element={<PlatformEmiratesAtplPage onNavigate={handleNavigate} />} />
      <Route path="/air-taxi-platform" element={<PlatformAirTaxiPage onNavigate={handleNavigate} />} />
      <Route path="/private-charter-platform" element={<PlatformPrivateCharterPage onNavigate={handleNavigate} />} />
      <Route path="/piloted-drones-platform" element={<PlatformPilotedDronesPage onNavigate={handleNavigate} />} />
      <Route path="/foundational-verification" element={<FoundationalVerificationPage onBack={() => handleBack('/foundational-platform')} onNavigate={handleNavigate} onLogin={() => setIsLoginModalOpen(true)} />} />

      {/* Pilot recognition routes */}
      <Route
        path="/pilot-recognition"
        element={
          <PilotRecognitionPage
            onBack={() => handleBack()}
            onNavigate={handleNavigate}
            onLogin={() => setIsLoginModalOpen(true)}
          />
        }
      />
      <Route path="/what-is-recognition" element={<WhatIsPilotRecognitionPage onNavigate={handleNavigate} onLogin={() => setIsLoginModalOpen(true)} onJoinUs={() => navigate('/become-member')} />} />
      <Route path="/recognition-plus" element={<RecognitionPlusPage />} />
      <Route path="/recognition-plus-comparison" element={<RecognitionPlusComparisonPage />} />
      <Route path="/pilot-recognition-profile" element={<PilotRecognitionProfilePage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/pilot-licensure-experience" element={<PilotLicensureExperiencePage onBack={() => handleBack('/pilot-recognition-profile')} />} />
      <Route path="/score-optimization" element={<ScoreOptimizationPage onBack={() => handleBack('/pilot-recognition-profile')} onNavigate={handleNavigate} />} />
      <Route path="/recognition-score-info" element={<RecognitionScoreInfoPage onBack={() => handleBack('/pilot-recognition-profile')} onNavigate={handleNavigate} />} />
      <Route path="/recognition-career-matches" element={<RecognitionCareerMatchesPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/atlas-cv" element={<ATLASCVPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Directory routes */}
      <Route path="/accreditation" element={<Navigate to="/about" replace />} />
      <Route path="/insights" element={<AviationInsightsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/applications_systems" element={<ApplicationsSystemsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/applications-systems" element={<ApplicationsSystemsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/membership" element={<MembershipDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/hinfact" element={<HinfactPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/w1000" element={<W1000Page onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/w1000-suite" element={<W1000SuitePage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/w1000/w2000" element={<W2000ApplicationPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/membership-benefits" element={<MembershipBenefitsPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/examination-results" element={<ExaminationResultsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/examination-results-directory" element={<ExaminationResultsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/official-examination-board" element={<OfficialExaminationBoardPage onBack={() => handleBack('access-portal-2?tab=programs')} onNavigate={handleNavigate} />} />
      <Route path="/digital-logbook-directory" element={<DigitalLogbookDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/digital-logbook" element={<DigitalLogbookPage onBack={() => handleBack()} userProfile={null} />} />

      {/* Other routes */}
      <Route path="/pilot-gap" element={<PilotGapAboutPage onBack={() => handleBack('/about')} onNavigate={handleNavigate} />} />
      <Route path="/what-is-the-pilot-gap" element={<PilotGapAboutPage onBack={() => handleBack('/about')} onNavigate={handleNavigate} />} />
      <Route path="/pilot-gap-about" element={<PilotGapAboutPage onBack={() => handleBack('/about')} onNavigate={handleNavigate} />} />
      <Route path="/airline-expectations" element={<PortalAirlineExpectationsPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/portal-airline-expectations" element={<PortalAirlineExpectationsPage onBack={() => handleBack('/pathways-modern')} onNavigate={handleNavigate} />} />
      <Route path="/type-rating-search" element={<TypeRatingSearchPage onNavigate={handleNavigate} onBack={() => handleBack()} />} />
      <Route path="/global-aviation-authorities" element={<GlobalAviationAuthoritiesPage />} />
      <Route path="/job-listings" element={<JobListingsPage onNavigate={handleNavigate} />} />
      <Route path="/download" element={<DownloadPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/settings" element={<SettingsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/subscription" element={<SubscriptionPage onBack={() => handleBack('/settings')} />} />
      <Route path="/pathways-modern" element={<PathwaysPageModern isDarkMode={false} onNavigate={handleNavigate} onNavigateToPathway={(pathwayId) => {
  if (pathwayId.includes('air-taxi') || pathwayId.includes('wingmentor')) {
    navigate('/air-taxi-pathways');
  } else {
    navigate(`/pathways-detail/${pathwayId}`);
  }
}} />} />
      <Route path="/licensure-type-rating-pathways" element={<SpecializedPathwaysIndex onBack={() => handleBack('/pathways-modern')} onNavigate={handleNavigate} />} />
      <Route path="/specialized-operations" element={<SpecializedOperationsIndex onBack={() => handleBack('/pathways-modern')} onNavigate={handleNavigate} />} />
      <Route path="/career-pathways" element={<CareerPathwaysIndex onBack={() => handleBack('/pathways-modern')} onNavigate={handleNavigate} />} />
      <Route path="/access-portal-2" element={<AccessPortal2Page onNavigate={handleNavigate} />} />
      <Route path="/examination-portal" element={
        <ProtectedRoute>
          <ExaminationPortal />
        </ProtectedRoute>
      } />
      <Route path="/enterprise-access" element={<EnterpriseAccessPage />} />
      <Route path="/enterprise-access/learn-more" element={<EnterpriseAccessLearnMorePage />} />
      <Route path="/enterprise-access/airlines" element={<AirlinesOperatorsPage />} />

      {/* Partner pages */}
      <Route path="/partners/flight-schools" element={<FlightSchoolsPage />} />

      {/* Pathways pages */}
      <Route path="/discover-pathways" element={<DiscoverPathwaysPage />} />

      {/* New category pages */}
      <Route path="/learn-about" element={<LearnAboutPage />} />
      <Route path="/general" element={<GeneralPage />} />
      <Route path="/professional-profile" element={<ProfessionalProfilePage />} />
      <Route path="/background-check" element={<BackgroundCheckPage />} />
      <Route path="/pilot-insurance" element={<PilotInsurancePage />} />
      <Route path="/banking-finance" element={<BankingFinancePage />} />
      <Route path="/career-tools" element={<CareerToolsPage />} />

      {/* Blog & Store */}
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/store" element={<StorePage />} />

      {/* Framework routes - /framework/full redirects to enterprise subdomain */}
      <Route path="/framework" element={<FrameworkPage />} />
      <Route path="/framework/full" element={<ExternalRedirect url="https://enterprise.pilotrecognition.com/framework/full" />} />

        {/* Redirect removed pages */}
        <Route path="/board" element={<Navigate to="/about" replace />} />
        <Route path="/committees" element={<Navigate to="/about" replace />} />
        <Route path="/governance" element={<Navigate to="/about" replace />} />
        <Route path="/core-values" element={<Navigate to="/mission-vision" replace />} />
        <Route path="/recognition-profile-live" element={<Navigate to="/recognition-plus?section=live-profile" replace />} />
        <Route path="/recognition-ai" element={<Navigate to="/recognition-plus?section=ai-features" replace />} />
        <Route path="/priority-matching" element={<Navigate to="/recognition-plus?section=priority-matching" replace />} />
        <Route path="/ebt-fast-track" element={<Navigate to="/recognition-plus?section=ebt-cbta" replace />} />
        <Route path="/medical-alerts" element={<Navigate to="/recognition-plus?section=medical-alerts" replace />} />
        <Route path="/program-discounts" element={<Navigate to="/recognition-plus?section=program-discounts" replace />} />
      </Routes>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onNavigate={handleNavigate} />
    </Suspense>
  );
};
