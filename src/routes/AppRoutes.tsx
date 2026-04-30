import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';
import { OAuthCallback } from '@/src/components/OAuthCallback';
import { LoginModal } from '@/components/website/components/LoginModal';
import { HomePage } from '@/components/website/components/home/HomePage';
import { AboutPage } from '@/components/website/components/AboutPage';
import { TechnicalIndexPage } from '@/components/website/components/TechnicalIndexPage';
import { AboutIndustryPage } from '@/components/website/components/AboutIndustryPage';
import { FAQPage } from '@/components/website/components/FAQPage';
import { BoardPage } from '@/components/website/components/BoardPage';
import { GovernancePage } from '@/components/website/components/GovernancePage';
import { CommitteesPage } from '@/components/website/components/CommitteesPage';
import { MissionVisionPage } from '@/components/website/components/MissionVisionPage';
import { CoreValuesPage } from '@/components/website/components/CoreValuesPage';
import { IndustryStewardshipPage } from '@/components/website/components/IndustryStewardshipPage';
import { ContactSupportPage } from '@/components/website/components/ContactSupportPage';
import { BecomeMemberPage } from '@/components/website/components/BecomeMemberPage';
import { AccountConfirmationPage } from '@/components/website/components/AccountConfirmationPage';
import { EmiratesAtplPage } from '@/components/website/components/pathways/EmiratesAtplPage';
import { EmergingAirTaxiPage } from '@/components/website/components/pathways/EmergingAirTaxiPage';
import { PilotedDronesPage } from '@/components/website/components/pathways/PilotedDronesPage';
import { AirTaxiPathwaysPage } from '@/components/website/components/pathways/AirTaxiPathwaysPage';
import { CadetProgramsPathwaysPage } from '@/components/website/components/pathways/CadetProgramsPathwaysPage';
import { PrivateCharterPathwaysPage } from '@/components/website/components/pathways/PrivateCharterPathwaysPage';
import { CargoTransportationPage } from '@/components/website/components/pathways/CargoTransportationPage';
import { FoundationalProgramPage } from '@/components/website/components/programs/FoundationalProgramPage';
import { TransitionProgramPage } from '@/components/website/components/programs/TransitionProgramPage';
import { ProgramBenefitsPage } from '@/components/website/components/programs/ProgramBenefitsPage';
import { NewsUpdatesPage } from '@/components/website/components/programs/NewsUpdatesPage';
import { ProgramsPathwaysPage } from '@/components/website/components/programs/ProgramsPathwaysPage';
import { ProgramsPage } from '@/components/website/components/programs/ProgramsPage';
import { PathwaysPage } from '@/components/website/components/pathways/PathwaysPage';
import { PlatformFoundationalProgramPage } from '@/components/website/components/programs/PlatformFoundationalProgramPage';
import { PlatformTransitionProgramPage } from '@/components/website/components/programs/PlatformTransitionProgramPage';
import { PlatformEmiratesAtplPage } from '@/components/website/components/pathways/PlatformEmiratesAtplPage';
import { PlatformAirTaxiPage } from '@/components/website/components/pathways/PlatformAirTaxiPage';
import { PlatformPrivateCharterPage } from '@/components/website/components/pathways/PlatformPrivateCharterPage';
import { PlatformPilotedDronesPage } from '@/components/website/components/pathways/PlatformPilotedDronesPage';
import { FoundationalVerificationPage } from '@/components/website/components/programs/FoundationalVerificationPage';
import { PilotRecognitionPage } from '@/components/website/components/pilot-recognition/PilotRecognitionPage';
import { PilotRecognitionProfilePage } from '@/components/website/components/pilot-recognition/PilotRecognitionProfilePage';
import { ScoreOptimizationPage } from '@/components/website/components/pilot-recognition/ScoreOptimizationPage';
import { RecognitionScoreInfoPage } from '@/components/website/components/pilot-recognition/RecognitionScoreInfoPage';
import { RecognitionCareerMatchesPage } from '@/components/website/components/pilot-recognition/RecognitionCareerMatchesPage';
import { ATLASCVPage } from '@/components/website/components/pilot-recognition/ATLASCVDirectoryPage';
import { FoundationalProgramApplicationPage } from '@/components/website/components/programs/FoundationalProgramApplicationDirectoryPage';
import { TransitionProgramApplicationPage } from '@/components/website/components/programs/TransitionProgramApplicationDirectoryPage';
import { AviationInsightsDirectoryPage } from '@/components/website/components/AviationInsightsDirectoryPage';
import { ApplicationsSystemsDirectoryPage } from '@/components/website/components/ApplicationsSystemsDirectoryPage';
import { MembershipDirectoryPage } from '@/components/website/components/MembershipDirectoryPage';
import { HinfactPage } from '@/components/website/components/HinfactDirectoryPage';
import { W1000SuitePage } from '@/components/website/components/W1000SuiteDirectoryPage';
import { MembershipBenefitsPage } from '@/components/website/components/MembershipBenefitsDirectoryPage';
import ExaminationResultsDirectoryPage from '@/components/website/components/ExaminationResultsDirectoryPage';
import { DigitalLogbookDirectoryPage } from '@/components/website/components/DigitalLogbookDirectoryPage';
import { EBTCBTAPage } from '@/components/website/components/EBTCBTAPage';
import { AirlineExpectationsPage } from '@/components/website/components/AirlineExpectationsPage';
import TypeRatingSearchPage from '@/pages/TypeRatingSearchPage';
import { PilotGapAboutPage } from '@/components/website/components/PilotGapAboutPage';
import { DownloadPage } from '@/components/website/components/DownloadPage';
import { SettingsDirectoryPage } from '@/components/website/components/SettingsDirectoryPage';
import { SubscriptionPage } from '@/components/website/components/SubscriptionPage';
import { OnboardingPilotPortal } from '@/components/website/components/OnboardingPilotPortal';
import { OnboardingPrograms } from '@/components/website/components/OnboardingPrograms';
import { OnboardingRecognition } from '@/components/website/components/OnboardingRecognition';
import { DirectEnrollmentLoadingScreen } from '@/components/website/components/home/DirectEnrollmentLoadingScreen';
import { DirectPlatformLoadingScreen } from '@/components/website/components/home/DirectPlatformLoadingScreen';
import { PortalWrapper } from '@/components/website/components/portal/PortalWrapper';
import { PathwaysPageModern } from '@/portal/pages/PathwaysPageModern';
import SpecializedPathwaysIndex from '@/portal/pages/SpecializedPathwaysIndex';
import SpecializedOperationsIndex from '@/portal/pages/SpecializedOperationsIndex';
import CareerPathwaysIndex from '@/portal/pages/CareerPathwaysIndex';

const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
    Loading...
  </div>
);

export const AppRoutes = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  const handleBack = (fallback: string = '/') => {
    navigate(fallback);
  };

  return (
    <>
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
      <Route path="/board" element={<BoardPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/governance" element={<GovernancePage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/committees" element={<CommitteesPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/mission-vision" element={<MissionVisionPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/core-values" element={<CoreValuesPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/industry-stewardship" element={<IndustryStewardshipPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/contact-support" element={<ContactSupportPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/become-member" element={<BecomeMemberPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/account-confirmation" element={<AccountConfirmationPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Onboarding routes */}
      <Route path="/onboarding-pilot-portal" element={<OnboardingPilotPortal onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/onboarding-programs" element={<OnboardingPrograms onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/onboarding-recognition" element={<OnboardingRecognition onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Pathways routes */}
      <Route path="/discover-pathways" element={<PathwaysPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
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
      <Route path="/foundational-platform" element={<PlatformFoundationalProgramPage onNavigate={handleNavigate} />} />
      <Route path="/transition-platform" element={<PlatformTransitionProgramPage onNavigate={handleNavigate} />} />
      <Route path="/emirates-atpl-platform" element={<PlatformEmiratesAtplPage onNavigate={handleNavigate} />} />
      <Route path="/air-taxi-platform" element={<PlatformAirTaxiPage onNavigate={handleNavigate} />} />
      <Route path="/private-charter-platform" element={<PlatformPrivateCharterPage onNavigate={handleNavigate} />} />
      <Route path="/piloted-drones-platform" element={<PlatformPilotedDronesPage onNavigate={handleNavigate} />} />
      <Route path="/foundational-verification" element={<FoundationalVerificationPage onBack={() => handleBack('/foundational-platform')} onNavigate={handleNavigate} />} />

      {/* Pilot recognition routes */}
      <Route path="/recognition-plus" element={<PilotRecognitionProfilePage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/pilot-recognition-profile" element={<PilotRecognitionProfilePage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/score-optimization" element={<ScoreOptimizationPage onBack={() => handleBack('/pilot-recognition-profile')} onNavigate={handleNavigate} />} />
      <Route path="/recognition-score-info" element={<RecognitionScoreInfoPage onBack={() => handleBack('/pilot-recognition-profile')} onNavigate={handleNavigate} />} />
      <Route path="/recognition-career-matches" element={<RecognitionCareerMatchesPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/atlas-cv" element={<ATLASCVPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Application routes */}
      <Route path="/foundational-application" element={<FoundationalProgramApplicationPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/transition-application" element={<TransitionProgramApplicationPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Directory routes */}
      <Route path="/insights" element={<AviationInsightsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/applications_systems" element={<ApplicationsSystemsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/applications-systems" element={<ApplicationsSystemsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/membership" element={<MembershipDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/hinfact" element={<HinfactPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/w1000-suite" element={<W1000SuitePage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/membership-benefits" element={<MembershipBenefitsPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/examination-results" element={<ExaminationResultsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/examination-results-directory" element={<ExaminationResultsDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/digital-logbook-directory" element={<DigitalLogbookDirectoryPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />

      {/* Other routes */}
      <Route path="/pilot-gap" element={<PilotGapAboutPage onBack={() => handleBack('/about')} onNavigate={handleNavigate} />} />
      <Route path="/what-is-the-pilot-gap" element={<PilotGapAboutPage onBack={() => handleBack('/about')} onNavigate={handleNavigate} />} />
      <Route path="/pilot-gap-about" element={<PilotGapAboutPage onBack={() => handleBack('/about')} onNavigate={handleNavigate} />} />
      <Route path="/airline-expectations" element={<AirlineExpectationsPage onBack={() => handleBack()} onNavigate={handleNavigate} />} />
      <Route path="/type-rating-search" element={<TypeRatingSearchPage onNavigate={handleNavigate} onBack={() => handleBack()} />} />
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
      </Routes>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onNavigate={handleNavigate} />
    </>
  );
};
