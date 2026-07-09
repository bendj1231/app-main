import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';
import { Plus, Search } from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { RecognitionAIChat } from '@/components/website/components/unified-platform/RecognitionAIChat';
import { type SearchProfileResult } from '@/lib/d1-api';
import { aircraftTypeRatings, type AircraftTypeRating } from '@/data/aircraft-manufacturers';

interface FlightLogEntry {
  id: string;
  date: string;
  aircraftType: string;
  aircraft?: string;
  image?: string;
  registration?: string;
  route: string;
  category?: string;
  hours: number;
  remarks?: string;
  sessionDescription?: string;
  // ANAC specific fields
  departureAerodrome?: string;
  arrivalAerodrome?: string;
  departureTime?: string;
  arrivalTime?: string;
  timeFormat?: 'UTC' | 'Local';
  dayHours?: number;
  nightHours?: number;
  ifrHours?: number;
  multiEngineHours?: number;
  crewFunction?: 'PIC' | 'Copilot' | 'Dual';
  takeoffsDay?: number;
  takeoffsNight?: number;
  landingsDay?: number;
  landingsNight?: number;
  isFoliado?: boolean;
  foliadoDate?: string;
  instructorSignature?: string;
  instructorLicense?: string;
  // CASA specific fields
  engineType?: 'Single' | 'Multi';
  nationality?: string;
  takeoffPoint?: string;
  landingPoint?: string;
  segmentPoints?: string[];
  picHours?: number;
  copilotHours?: number;
  picusHours?: number;
  trainingHours?: number;
  dayCasaHours?: number;
  nightCasaHours?: number;
  instrumentFlightHours?: number;
  instrumentApproachType?: string;
  instructorCasaHours?: number;
  examinerHours?: number;
  isFinalized?: boolean;
  finalizedDate?: string;
  isArchived?: boolean;
  archivalDate?: string;
  arn?: string;
  dateOfBirth?: string;
  // Brazil ANAC specific fields
  natureOfFlight?: 'Private' | 'Instruction' | 'Commercial';
  brazilDepartureIcao?: string;
  brazilArrivalIcao?: string;
  blockTimeDeparture?: string;
  blockTimeArrival?: string;
  pilotFunctionBrazil?: 'PIC' | 'SIC' | 'Dual';
  conditionDay?: boolean;
  conditionNight?: boolean;
  conditionIFR?: boolean;
  conditionHood?: boolean;
  landingsBrazil?: number;
  takeoffsBrazil?: number;
  instructorCIV?: string;
  instructorDigitalSignature?: string;
  cmaExpiration?: string;
  cmaWarningLevel?: 'none' | '30' | '60' | '90';
  termoAbertura?: string;
  termoEncerramento?: string;
  hoursBroughtForward?: number;
  totalPagina?: number;
  totalAcumulado?: number;
  // QCAA specific fields
  qcaaDepartureIcao?: string;
  qcaaArrivalIcao?: string;
  qcaaOffBlockTime?: string;
  qcaaOnBlockTime?: string;
  qcaaPilotCapacity?: 'P1' | 'P2' | 'P1 U/S';
  qcaaDayActual?: number;
  qcaaNightActual?: number;
  qcaaInstrumentActual?: number;
  qcaaInstrumentSimulated?: number;
  qcaaFstdSimulator?: number;
  qcaaLandingsDay?: number;
  qcaaLandingsNight?: number;
  qcaaAutolanding?: number;
  qcaaFlightNature?: 'Scheduled' | 'Training' | 'Check' | 'Positioning' | 'Test' | 'Other';
  qcaaCommanderName?: string;
  qcaaCommanderLicense?: string;
  qcaaCommanderSignature?: string;
  qcaaIsVerified?: boolean;
  qcaaVerificationSource?: string;
  // FAA specific fields
  faaDepartureAirport?: string;
  faaArrivalAirport?: string;
  faaIsCrossCountry?: boolean;
  faaCrossCountryDistance?: number;
  faaIsSolo?: boolean;
  faaIsPic?: boolean;
  faaIsSic?: boolean;
  faaIsFstd?: boolean;
  faaDayTime?: number;
  faaNightTime?: number;
  faaActualInstrument?: number;
  faaSimulatedInstrument?: number;
  faaTakeoffsDay?: number;
  faaTakeoffsNight?: number;
  faaLandingsDay?: number;
  faaLandingsNight?: number;
  faaFullStopLandings?: number;
  faaSafetyPilot?: string;
  faaCfiSignature?: string;
  faaCfiCertificateNumber?: string;
  faaCfiExpirationDate?: string;
  faaInstrumentApproaches?: number;
  faaHoldingProcedures?: number;
  faaTrackingIntercepts?: number;
  // CAAP Philippines specific fields
  caapDepartureIcao?: string;
  caapArrivalIcao?: string;
  caapOffBlockTime?: string;
  caapOnBlockTime?: string;
  caapPilotFunction?: 'PIC' | 'SIC' | 'Dual';
  caapDayTime?: number;
  caapNightTime?: number;
  caapInstrumentActual?: number;
  caapInstrumentSimulated?: number;
  caapLandingsDay?: number;
  caapLandingsNight?: number;
  caapIsCrossCountry?: boolean;
  caapCrossCountryDistance?: number;
  caapIsCheckride?: boolean;
  caapExaminerName?: string;
  caapExaminerLicenseNumber?: string;
  caapInstructorName?: string;
  caapInstructorLicenseNumber?: string;
  caapInstructorSignature?: string;
  caapCertificateType?: 'PPL' | 'CPL' | 'ATPL';
  // CAE Training specific fields
  sessionDate?: string;
  simulatorType?: string;
  fstdId?: string;
  lessonEventCode?: string;
  fstdTime?: number;
  instructorName?: string;
  instructorCertificate?: string;
  caeInstructorSignature?: string;
  eGrading?: string;
  competencyLevel?: string;
  isTrainingSession?: boolean;
  medicalCertificateType?: 'FAA_FCIII' | 'EASA_Class1';
  medicalExpiration?: string;
  asicId?: string;
  asicExpiration?: string;
  exportFormat?: 'FAA' | 'EASA' | 'CASA';
  // TCCA Canada specific fields
  flightCategory?: 'Private' | 'Commercial' | 'Flight_Test';
  pilotFunctionTcca?: 'PIC' | 'SIC' | 'Dual_Received' | 'Dual_Given';
  airTime?: number;
  flightTimeBlock?: number;
  instrumentActual?: boolean;
  instrumentHood?: boolean;
  flightCrewName?: string;
  cadNumber?: string;
  medicalCategory?: '1' | '2' | '3' | '4';
  medicalExpiry?: string;
  fiveYearRecency?: string;
  twoYearTraining?: string;
  passengerTakeoffsDay?: number;
  passengerTakeoffsNight?: number;
  passengerLandingsDay?: number;
  passengerLandingsNight?: number;
  isCertifiedCopy?: boolean;
  certifiedCopyDate?: string;
  // DGAC specific fields
  dgacDepartureIcao?: string;
  dgacArrivalIcao?: string;
  dgacOffBlockTime?: string;
  dgacOnBlockTime?: string;
  dgacOperatingCapacity?: 'PIC' | 'SIC' | 'PICUS' | 'Dual';
  dgacFstdTime?: number;
  dgacSeriesFlightId?: string;
  dgacInstructorCountersign?: string;
  dgacPageClosed?: boolean;
  dgacPageNumber?: number;
  // CAAC China specific fields
  caacDepartureIcao?: string;
  caacArrivalIcao?: string;
  caacOffBlockTime?: string;
  caacOnBlockTime?: string;
  caacFunction?: 'PIC' | 'SIC' | 'Instructor';
  caacMultiPilot?: boolean;
  caacInstrumentActual?: boolean;
  caacInstrumentSimulated?: boolean;
  caacAutoLandings?: number;
  caacPhaseCheck?: string;
  caacAnnualProficiencyCheck?: string;
  caacExaminerCaacLicenseId?: string;
  caacTurbineJetTime?: number;
  // EASA Part-FCL.050 specific fields
  easaDepartureIcao?: string;
  easaArrivalIcao?: string;
  easaOffBlockTime?: string;
  easaOnBlockTime?: string;
  easaPilotFunction?: 'PIC' | 'Co-pilot' | 'PICUS' | 'Dual';
  easaMultiPilot?: boolean;
  easaNight?: boolean;
  easaIfr?: boolean;
  easaFstd?: boolean;
  easaCrossCountry?: boolean;
  easaFlightNature?: string;
  easaCommanderSignature?: string;
  easaPageNumber?: number;
  easaTotalsBroughtForward?: number;
  // HKCAD CAD 54 & AN(HK)O specific fields
  hkcadDepartureIcao?: string;
  hkcadArrivalIcao?: string;
  hkcadOffBlockTime?: string;
  hkcadOnBlockTime?: string;
  hkcadPilotCapacity?: 'PIC' | 'P2' | 'PICUS' | 'Dual';
  hkcadDay?: boolean;
  hkcadNight?: boolean;
  hkcadInstrumentActual?: boolean;
  hkcadInstrumentSimulated?: boolean;
  hkcadFstdTime?: number;
  hkcadInstrumentApproachType?: string;
  hkcadInstrumentApproachCount?: number;
  hkcadCommanderName?: string;
  hkcadCommanderLicenseNumber?: string;
  hkcadEmployerStamp?: string;
  hkcadPageNumber?: number;
  hkcadTotalsBroughtForward?: number;
  hkcadTotalToDate?: number;
  // DGCA India Rule 67A & eGCA specific fields
  dgacindiaDepartureIcao?: string;
  dgacindiaArrivalIcao?: string;
  dgacindiaChocksOff?: string;
  dgacindiaChocksOn?: string;
  dgacindiaPilotCapacity?: 'P1' | 'P2' | 'P1 U/S' | 'Solo';
  dgacindiaDay?: boolean;
  dgacindiaNight?: boolean;
  dgacindiaInstrumentActual?: boolean;
  dgacindiaInstrumentSimulated?: boolean;
  dgacindiaInstrumentHood?: boolean;
  dgacindiaTakeoffsDay?: number;
  dgacindiaTakeoffsNight?: number;
  dgacindiaLandingsDay?: number;
  dgacindiaLandingsNight?: number;
  dgacindiaFlightNature?: 'Cross-Country' | 'GFT' | 'Skill Test' | 'Local' | 'Training';
  dgacindiaSpic?: boolean;
  dgacindiaInstructorName?: string;
  dgacindiaInstructorDgcaLicense?: string;
  dgacindiaInstructorSignature?: string;
  dgacindiaPilotUid?: string;
  dgacindiaPageNumber?: number;
  dgacindiaPageTotal?: number;
  dgacindiaGrandTotal?: number;
  // JCAB Japan Civil Aeronautics Regulations specific fields
  jcabDepartureIcao?: string;
  jcabArrivalIcao?: string;
  jcabChocksOff?: string;
  jcabChocksOn?: string;
  jcabAircraftClass?: 'Single-engine' | 'Multi-engine';
  jcabAircraftCategory?: 'Land' | 'Sea';
  jcabPilotCapacity?: '機長' | '副操縦士' | '操縦教育';
  jcabDay?: boolean;
  jcabNight?: boolean;
  jcabInstrumentTime?: boolean;
  jcabLandingsDay?: number;
  jcabLandingsNight?: number;
  jcabInstrumentApproachType?: string;
  jcabServiceTime?: number;
  jcabFlightTime?: number;
  jcabVerified?: boolean;
  jcabVerifiedBy?: string;
  jcabVerifiedAt?: string;
  jcabRemarks?: string;
  // NZCAA New Zealand CAR Part 61.29 specific fields
  nzcaaFlightFunction?: 'PIC' | 'PIC/US' | 'Co-pilot' | 'Student';
  nzcaaCommandPractice?: string;
  nzcaaDay?: boolean;
  nzcaaNight?: boolean;
  nzcaaInstrumentActual?: boolean;
  nzcaaInstrumentSimulated?: boolean;
  nzcaaInstrumentGround?: boolean;
  nzcaaDeparturePoint?: string;
  nzcaaIntermediateLandings?: string;
  nzcaaArrivalPoint?: string;
  nzcaaTrainingExercises?: string;
  nzcaaInstructorName?: string;
  nzcaaSafetyPilotName?: string;
  nzcaaAirTime?: string;
  nzcaaFlightTime?: string;
  nzcaaCertified?: boolean;
  nzcaaCertifiedBy?: string;
  nzcaaCertifiedAt?: string;
  nzcaaAuditTrail?: string;
  nzcaaPageNumber?: number;
  nzcaaTotalsBroughtForward?: string;
  nzcaaTotalToDate?: string;
  // SACAA South Africa CAR 61.01.8 and SA-CATS 61 specific fields
  sacaaFlightFunction?: 'PIC' | 'Co-pilot' | 'PICUS' | 'Dual';
  sacaaDepartureIcao?: string;
  sacaaArrivalIcao?: string;
  sacaaChocksOff?: string;
  sacaaChocksOn?: string;
  sacaaDay?: boolean;
  sacaaNight?: boolean;
  sacaaInstrumentActual?: boolean;
  sacaaInstrumentSimulated?: boolean;
  sacaaInstrumentFstd?: boolean;
  sacaaLandingsDay?: number;
  sacaaLandingsNight?: number;
  sacaaFlightNature?: string;
  sacaaInstructorName?: string;
  sacaaInstructorLicenseNumber?: string;
  sacaaInstructorSignature?: string;
  sacaaCommanderName?: string;
  sacaaCommanderLicenseNumber?: string;
  sacaaCommanderSignature?: string;
  sacaaCertified?: boolean;
  sacaaCertifiedBy?: string;
  sacaaCertifiedAt?: string;
  sacaaAuditTrail?: string;
  sacaaPageNumber?: number;
  sacaaTotalTimePage?: string;
  sacaaGrandTotal?: string;
  // GCAA UAE CAR Part II & Part IV specific fields
  gcaaPilotFunction?: 'P1' | 'P2' | 'P1 U/S';
  gcaaDepartureIcao?: string;
  gcaaArrivalIcao?: string;
  gcaaOffBlock?: string;
  gcaaOnBlock?: string;
  gcaaDay?: boolean;
  gcaaNight?: boolean;
  gcaaInstrumentActual?: boolean;
  gcaaInstrumentSimulated?: boolean;
  gcaaInstrumentFstd?: boolean;
  gcaaLandingsDay?: number;
  gcaaLandingsNight?: number;
  gcaaAutolandings?: number;
  gcaaFlightNature?: string;
  gcaaCommanderName?: string;
  gcaaCommanderGcaaLicense?: string;
  gcaaCommanderSignature?: string;
  gcaaCertified?: boolean;
  gcaaCertifiedBy?: string;
  gcaaCertifiedAt?: string;
  gcaaAuditTrail?: string;
  gcaaPageNumber?: number;
  gcaaTotalsBroughtForward?: string;
  gcaaTotalToDate?: string;
  // UK CAA Part-FCL.050 & CAP 804 specific fields
  ukcaaPilotFunction?: 'PIC' | 'Co-pilot' | 'PICUS' | 'Dual';
  ukcaaOffBlock?: string;
  ukcaaOnBlock?: string;
  ukcaaNight?: boolean;
  ukcaaIfr?: boolean;
  ukcaaFstd?: boolean;
  ukcaaTakeoffsDay?: number;
  ukcaaTakeoffsNight?: number;
  ukcaaLandingsDay?: number;
  ukcaaLandingsNight?: number;
  ukcaaFlightNature?: string;
  ukcaaCommanderName?: string;
  ukcaaCommanderSignature?: string;
  ukcaaCertified?: boolean;
  ukcaaCertifiedBy?: string;
  ukcaaCertifiedAt?: string;
  ukcaaAuditTrail?: string;
  ukcaaPageNumber?: number;
  ukcaaTotalsBroughtForward?: string;
  ukcaaTotalToDate?: string;
  ukcaaSeriesOfFlights?: boolean;
  ukcaaSimulatorHours?: string;
}

const AIRCRAFT_IMAGES: Record<string, string> = {
  C152: '/images/manufacturers/cessna/single-engine/cessna-152/cessna-152.jpg',
  C172: '/images/manufacturers/cessna/single-engine/cessna-172/cessna-172-skyhawk-s2-afh.jpg',
  C182: '/images/manufacturers/cessna/single-engine/cessna-182/cessna-182-skylane.jpg',
  C208: '/images/manufacturers/cessna/turboprop/cessna-208/cessna-208-caravan.jpg',
  PA28: '/images/manufacturers/piper/piper-pa28.jpg',
  PA34: '/images/manufacturers/piper/twin-engine-piston/pa-34-seneca/piper-pa34-seneca.jpg',
  PA44: '/images/manufacturers/piper/twin-engine-piston/pa-34-seneca/piper-pa34-seneca.jpg',
  DA40: '/images/manufacturers/diamond/diamond-da40.jpg',
  DA42: '/images/manufacturers/diamond/diamond-da40.jpg',
  P2008: '/images/manufacturers/tecnam/tecnam-p2008.jpg',
  A220: '/images/manufacturers/airbus/airbus-a220-300.jpg',
  A320: '/images/manufacturers/airbus/airbus-a320.jpg',
  A330: '/images/manufacturers/airbus/airbus-a330-300.jpg',
  A350: '/images/manufacturers/airbus/airbus-a350-900.jpg',
  A380: '/images/manufacturers/airbus/airbus-a380-800.jpg',
  B737: '/images/manufacturers/boeing/boeing-737_ng__-700__-800__-900_.jpg',
  B747: '/images/manufacturers/boeing/boeing-747-8_intercontinental.jpg',
  B777: '/images/manufacturers/boeing/boeing-777-300er.jpg',
  B787: '/images/manufacturers/boeing/boeing-787-9_dreamliner.jpg',
};

// Map common type designators that don't exist in aircraftTypeRatings to a close data entry.
const AIRCRAFT_TYPE_ALIASES: Record<string, string> = {
  PA44: 'piper-pa34-seneca',
  PA34: 'piper-pa34-seneca',
};

const CYCLE_DURATION = 7000;

const normalizeAircraftType = (aircraftType: string): string =>
  aircraftType
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const getAircraftDataEntry = (aircraftType: string): AircraftTypeRating | undefined => {
  if (!Array.isArray(aircraftTypeRatings)) return undefined;
  const normalized = normalizeAircraftType(aircraftType);

  // Explicit aliases for codes not present in the dataset
  const aliasId = AIRCRAFT_TYPE_ALIASES[aircraftType.toUpperCase()];
  if (aliasId) {
    const aliased = aircraftTypeRatings.find((a) => {
      if (!a) return false;
      return a.id.toLowerCase() === aliasId.toLowerCase();
    });
    if (aliased) return aliased;
  }

  // Direct match on id or model
  const direct = aircraftTypeRatings.find((a) => {
    if (!a) return false;
    const id = normalizeAircraftType(a.id);
    const model = normalizeAircraftType(a.model);
    return id === normalized || model === normalized;
  });
  if (direct) return direct;

  // Manufacturer code + number matching (e.g., C172, A320, B737)
  const codeMatch = normalized.match(/^([a-z]+)(\d+)$/);
  if (codeMatch) {
    const [, prefix, numbers] = codeMatch;
    const manufacturerMap: Record<string, string> = {
      c: 'cessna',
      pa: 'piper',
      a: 'airbus',
      b: 'boeing',
      da: 'diamond',
      p: 'tecnam',
    };
    const manufacturerId = manufacturerMap[prefix];
    if (manufacturerId) {
      const byCode = aircraftTypeRatings.find((a) => {
        if (!a) return false;
        return (
          a.manufacturer_id.toLowerCase() === manufacturerId &&
          (normalizeAircraftType(a.id).includes(numbers) ||
            normalizeAircraftType(a.model).includes(numbers))
        );
      });
      if (byCode) return byCode;
    }
  }

  return undefined;
};

const getAircraftImages = (aircraftType: string, fallbackImage?: string): string[] => {
  if (fallbackImage) return [fallbackImage];

  const entry = getAircraftDataEntry(aircraftType);
  if (entry?.images && entry.images.length > 0) return entry.images;
  if (entry?.image) return [entry.image];

  // Fallback to static map
  const direct = AIRCRAFT_IMAGES[aircraftType.toUpperCase()];
  if (direct) return [direct];
  for (const [prefix, url] of Object.entries(AIRCRAFT_IMAGES)) {
    if (aircraftType.toUpperCase().startsWith(prefix)) return [url];
  }

  return [];
};

const getAircraftImage = (aircraftType: string, fallbackImage?: string): string => {
  const images = getAircraftImages(aircraftType, fallbackImage);
  return (
    images[0] ||
    '/images/manufacturers/cessna/single-engine/cessna-172/cessna-172-skyhawk-s2-afh.jpg'
  );
};

const getCarouselImageIndex = (seedKey: string, imageCount: number, tick: number): number => {
  if (imageCount <= 1) return 0;
  const seed = seedKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (tick + seed) % imageCount;
};

const useAircraftCarouselImage = (
  aircraftType: string,
  fallbackImage?: string,
  seedKey?: string
): string => {
  const images = useMemo(
    () => getAircraftImages(aircraftType, fallbackImage),
    [aircraftType, fallbackImage]
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), CYCLE_DURATION);
    return () => clearInterval(interval);
  }, []);

  if (images.length === 0) {
    return '/images/manufacturers/cessna/single-engine/cessna-172/cessna-172-skyhawk-s2-afh.jpg';
  }
  const index = getCarouselImageIndex(seedKey || aircraftType, images.length, tick);
  return images[index];
};

const AircraftCarouselImage: React.FC<{
  aircraftType: string;
  fallbackImage?: string;
  seedKey?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ aircraftType, fallbackImage, seedKey, style, children }) => {
  const image = useAircraftCarouselImage(aircraftType, fallbackImage, seedKey);
  return (
    <div style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {children}
    </div>
  );
};

const MOCK_FLIGHT_LOGS: FlightLogEntry[] = [
  {
    id: 'mock-1',
    date: '2026-06-28',
    aircraftType: 'C172',
    aircraft: 'Cessna 172S',
    registration: 'RP-C1234',
    route: 'RPLL-RPVP',
    category: 'Dual',
    hours: 1.2,
    remarks: 'Short-field takeoff and landing practice.',
  },
  {
    id: 'mock-2',
    date: '2026-06-25',
    aircraftType: 'PA44',
    aircraft: 'Piper PA-44 Seminole',
    registration: 'RP-S8820',
    route: 'RPLL-RPLB',
    category: 'PIC',
    hours: 2.5,
    remarks: 'Multi-engine cross-country solo.',
  },
  {
    id: 'mock-3',
    date: '2026-06-22',
    aircraftType: 'C172',
    aircraft: 'Cessna 172S',
    registration: 'RP-C1234',
    route: 'RPLL-RPLL',
    category: 'Solo',
    hours: 1.0,
    remarks: 'Local area solo, circuit practice.',
  },
  {
    id: 'mock-4',
    date: '2026-06-18',
    aircraftType: 'DA40',
    aircraft: 'Diamond DA40',
    registration: 'RP-D4567',
    route: 'RPLL-RPUG',
    category: 'IFR',
    hours: 1.8,
    remarks: 'IFR en-route and approach under the hood.',
  },
];

interface DigitalLogbookPageProps {
  onBack: () => void;
  userProfile?: {
    id?: string;
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  embedded?: boolean;
  inlineFullscreen?: boolean;
}

export const DigitalLogbookPage: React.FC<DigitalLogbookPageProps> = ({
  onBack,
  userProfile,
  embedded = false,
  inlineFullscreen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const useFullscreenLayout = isFullscreen || inlineFullscreen;
  const resolvedUserId = useMemo(() => userProfile?.id ?? userProfile?.uid ?? null, [userProfile]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      // Force shader canvas to resize after fullscreen transition
      window.setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 150);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const [flightLogs, setFlightLogs] = useState<FlightLogEntry[]>(MOCK_FLIGHT_LOGS);
  const [loading, setLoading] = useState(true);
  const { callApi, callPilotApi } = useWorkerAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  interface CrewMember {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    profileId?: string;
    comment: string;
  }

  const [hoveredLog, setHoveredLog] = useState<FlightLogEntry | null>(null);
  const [selectedLog, setSelectedLog] = useState<FlightLogEntry | null>(null);
  const [flightCrew, setFlightCrew] = useState<Record<string, CrewMember[]>>({});
  const [addingCrew, setAddingCrew] = useState(false);
  const [crewSearchQuery, setCrewSearchQuery] = useState('');
  const [crewSearchResults, setCrewSearchResults] = useState<SearchProfileResult[]>([]);
  const [crewSearchLoading, setCrewSearchLoading] = useState(false);
  const [crewSubmitLoading, setCrewSubmitLoading] = useState(false);
  const [selectedCrewProfile, setSelectedCrewProfile] = useState<SearchProfileResult | null>(null);
  const [crewRole, setCrewRole] = useState('');
  const [crewComment, setCrewComment] = useState('');
  const [crewReferralLink, setCrewReferralLink] = useState<string>('');
  const [crewReferralCopied, setCrewReferralCopied] = useState(false);
  const previewLog = useMemo(() => {
    const candidate = selectedLog || hoveredLog;
    if (candidate && flightLogs.some((log) => log.id === candidate.id)) return candidate;
    return flightLogs[0] || null;
  }, [flightLogs, selectedLog, hoveredLog]);
  const mainPreviewRef = useRef<HTMLDivElement>(null);
  const [ledgerTab, setLedgerTab] = useState<'all' | 'recent' | 'byAircraft'>('all');
  const [selectedAircraftType, setSelectedAircraftType] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<
    | 'FAA'
    | 'EASA'
    | 'CASA'
    | 'ANAC'
    | 'QCAA'
    | 'CAAP'
    | 'CAE'
    | 'TCCA'
    | 'DGAC'
    | 'CAAC'
    | 'HKCAD'
    | 'DGCAIndia'
    | 'JCAB'
    | 'NZCAA'
    | 'SACAA'
    | 'GCAA'
    | 'UKCAA'
  >('FAA');
  const aircraftTypes = useMemo(() => {
    const types = Array.from(new Set(flightLogs.map((log) => log.aircraftType)));
    return ['all', ...types.sort()];
  }, [flightLogs]);
  const displayedLogs = useMemo(() => {
    if (ledgerTab === 'recent') return flightLogs.slice(0, 5);
    if (ledgerTab === 'byAircraft') {
      if (selectedAircraftType === 'all') return flightLogs;
      return flightLogs.filter((log) => log.aircraftType === selectedAircraftType);
    }
    return flightLogs;
  }, [flightLogs, ledgerTab, selectedAircraftType]);

  const parseCSV = useCallback((csvText: string): FlightLogEntry[] => {
    const lines = csvText.split('\n').filter((l) => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
    const entries: FlightLogEntry[] = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length < 3) continue;
      const getVal = (...keys: string[]) => {
        for (const key of keys) {
          const idx = headers.indexOf(key);
          if (idx >= 0 && idx < row.length) return row[idx]?.trim() || '';
        }
        return '';
      };
      entries.push({
        id: `csv-${i}`,
        date: getVal('date', 'flight_date', 'datum'),
        aircraftType: getVal('aircraft_type', 'type', 'aircraft', 'model'),
        registration: getVal('registration', 'reg', 'tail_number', 'matricula'),
        route: getVal('route', 'from_to', 'dep_arr', 'orig_dest'),
        category: getVal('category', 'flight_type', 'kind', 'tipo'),
        hours: parseFloat(getVal('hours', 'total_time', 'duration', 'flight_time', 'tiempo')) || 0,
        remarks: getVal('description', 'remarks', 'notes', 'comment', 'observations'),
        image: getAircraftImage(getVal('aircraft_type', 'type', 'aircraft', 'model')),
      });
    }
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const fetchFlightLogs = useCallback(async () => {
    const userId = resolvedUserId;
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = (await callApi('getLogbookCSV', { user_id: userId })) as {
        csv_data?: string;
      } | null;
      if (result?.csv_data) {
        setFlightLogs(parseCSV(result.csv_data));
      } else {
        setFlightLogs(MOCK_FLIGHT_LOGS);
      }
    } catch (error) {
      console.error('Error fetching flight logs:', error);
      setFlightLogs(MOCK_FLIGHT_LOGS);
    } finally {
      setLoading(false);
    }
  }, [resolvedUserId, callApi, parseCSV]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Data fetch when the resolved user ID is known; fetchFlightLogs handles loading/logs state.
    if (resolvedUserId) fetchFlightLogs();
  }, [resolvedUserId, fetchFlightLogs]);

  // Search PilotRecognition profiles when adding crew
  useEffect(() => {
    if (!addingCrew || crewSearchQuery.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Synchronous reset is required to clear stale results when the modal closes or query is too short; the rest of the effect is a debounced async search.
      setCrewSearchResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setCrewSearchLoading(true);
        const res = await callPilotApi<{ results: SearchProfileResult[] }>('searchProfiles', {
          query: crewSearchQuery.trim(),
          limit: 10,
        });
        if (!cancelled) setCrewSearchResults(res.results || []);
      } catch (err) {
        console.error('Crew search error:', err);
        if (!cancelled) setCrewSearchResults([]);
      } finally {
        if (!cancelled) setCrewSearchLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [addingCrew, crewSearchQuery, callPilotApi]);

  // Load the current user's referral code so we can show an invite link for non-members
  useEffect(() => {
    if (!resolvedUserId || !addingCrew) return;
    let active = true;
    callApi<Record<string, unknown>[]>('queryTable', {
      table: 'recognition_plus_referrals',
      operation: 'select',
      dbName: 'DB_TRACE',
      where: { profile_id: resolvedUserId, is_active: 1 },
      limit: 1,
    })
      .then((rows) => {
        const code = rows?.[0]?.['referral_code'] as string | null;
        if (active && code) {
          setCrewReferralLink(`${window.location.origin}/ref/${code}`);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [resolvedUserId, addingCrew, callApi]);

  const handleDeleteCSV = async () => {
    const userId = resolvedUserId;
    if (!userId) return;
    if (!confirm('Delete uploaded logbook?')) return;
    try {
      await callApi('deleteLogbookCSV', { user_id: userId });
      setFlightLogs([]);
    } catch (error) {
      console.error('Error deleting CSV:', error);
      alert('Failed to delete logbook');
    }
  };

  const handleDeleteEntry = async (_entryId: string) => {
    handleDeleteCSV();
  };

  const handleRecentFlightClick = (log: FlightLogEntry) => {
    setSelectedLog(log);
    setHoveredLog(log);
    setTimeout(() => {
      const el = mainPreviewRef.current || document.getElementById('logbook-main-preview');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const totalHours = flightLogs.reduce((sum, log) => sum + log.hours, 0);

  // Calculate running total for each flight
  const getRunningTotal = (currentIndex: number) => {
    return flightLogs.slice(0, currentIndex + 1).reduce((sum, log) => sum + log.hours, 0);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: inlineFullscreen ? '150vh' : embedded ? 'auto' : '100vh',
        height: isFullscreen ? '100%' : 'auto',
        overflow: isFullscreen ? 'auto' : 'hidden',
        background: isFullscreen
          ? 'radial-gradient(at 20% 25%, rgba(30,58,95,0.5) 0px, transparent 45%), radial-gradient(at 80% 75%, rgba(30,41,59,0.45) 0px, transparent 45%), radial-gradient(at 50% 50%, rgba(71,85,105,0.35) 0px, transparent 55%), radial-gradient(at 10% 80%, rgba(30,58,138,0.35) 0px, transparent 45%), radial-gradient(at 60% 10%, rgba(100,116,139,0.3) 0px, transparent 50%), #0f172a'
          : 'transparent',
      }}
    >
      <style>{`
        .logbook-glass-row {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .logbook-glass-row:hover {
          background: rgba(255, 255, 255, 0.14) !important;
          backdrop-filter: blur(12px) saturate(1.15);
          -webkit-backdrop-filter: blur(12px) saturate(1.15);
          box-shadow: inset 0 0 24px rgba(255, 255, 255, 0.12), 0 6px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }
        .logbook-glass-row td {
          transition: color 0.2s ease;
        }
        .logbook-glass-row:hover td {
          color: #ffffff !important;
        }
        .logbook-glass-row.selected {
          background: rgba(255, 255, 255, 0.18) !important;
          box-shadow: inset 0 0 24px rgba(255, 255, 255, 0.12), 0 6px 24px rgba(0, 0, 0, 0.15);
        }
        .logbook-glass-row.selected td {
          color: #ffffff !important;
        }
        .recent-flights-carousel::-webkit-scrollbar {
          display: none;
        }
        .recent-flights-carousel button:hover > div {
          transform: scale(1.03);
          border-color: rgba(14, 165, 233, 0.6) !important;
        }
        .recent-flights-carousel button:active > div {
          transform: scale(0.98);
        }
        .sync-indicator-dot {
          animation: sync-pulse 1.8s ease-in-out infinite;
        }
        @keyframes sync-pulse {
          0% { transform: scale(1); opacity: 1; box-shadow: 0 0 8px rgba(239, 68, 68, 0.6); }
          50% { transform: scale(1.25); opacity: 0.7; box-shadow: 0 0 14px rgba(239, 68, 68, 0.4); }
          100% { transform: scale(1); opacity: 1; box-shadow: 0 0 8px rgba(239, 68, 68, 0.6); }
        }
      `}</style>
      {/* Background — MeshGradient for normal mode, overlays only for fullscreen */}
      {!embedded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {!isFullscreen && (
            <MeshGradient
              className="w-full h-full"
              colors={[
                '#dbeafe',
                '#94a3b8',
                '#64748b',
                '#475569',
                '#334155',
                '#1e3a5f',
                '#1e3a8a',
                '#0f172a',
              ]}
              speed={0.22}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(100,116,139,0.18), rgba(30,41,59,0.3), rgba(2,6,23,0.5))',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backdropFilter: 'blur(1px)',
              background: 'rgba(15,23,42,0.08)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
            }}
          />
        </div>
      )}
      <div style={{ position: 'relative', zIndex: embedded ? 'auto' : 10, paddingBottom: '4rem' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: useFullscreenLayout ? '100%' : '1200px',
            margin: '0 auto',
            padding: useFullscreenLayout
              ? '0'
              : isMobile
                ? '1rem 0.75rem'
                : '2rem clamp(1.5rem, 4vw, 3rem)',
          }}
        >
          {/* Header — hidden when embedded in profile page */}
          {!embedded && (
            <header
              style={{
                padding: isMobile ? '1.5rem 1rem' : '3rem 4rem',
                background: 'rgba(8, 8, 10, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                position: 'relative',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '2rem',
              }}
            >
              <button
                onClick={onBack}
                style={{
                  position: 'absolute',
                  top: isMobile ? '1rem' : '2rem',
                  left: isMobile ? '1rem' : '2rem',
                  padding: isMobile ? '0.25rem' : '0.5rem 1rem',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: isMobile ? '1.25rem' : '0.875rem',
                  fontWeight: 500,
                  color: '#0ea5e9',
                }}
              >
                {isMobile ? '←' : '← BACK TO PROFILE'}
              </button>

              {!isMobile && (
                <div
                  style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'inline-block',
                    }}
                  />
                  VERIFIED IDENTITY
                </div>
              )}

              <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    fontSize: '2rem',
                    fontWeight: 700,
                    fontFamily: 'Arial, sans-serif',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: '#ffffff' }}>pilot</span>
                  <span style={{ color: '#dc2626' }}>recognition</span>
                  <span style={{ color: '#ffffff' }}>.com</span>
                </div>
              </div>
              <p
                style={{
                  letterSpacing: '0.2em',
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                }}
              >
                PILOT RECOGNITION PROFILE
              </p>
              <h1
                style={{
                  fontSize: '2rem',
                  marginTop: '0.5rem',
                  marginBottom: '0',
                  color: '#ffffff',
                  fontWeight: 600,
                }}
              >
                Digital Logbook
              </h1>
            </header>
          )}

          {/* Main Content Card — floating glass ledger */}
          <div
            style={{
              background: useFullscreenLayout ? 'transparent' : 'rgba(8, 8, 10, 0.15)',
              borderRadius: useFullscreenLayout ? '0px' : '24px',
              padding: useFullscreenLayout ? '0' : isMobile ? '1.5rem 1rem' : '2rem',
              boxShadow: useFullscreenLayout
                ? 'none'
                : '0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative',
              border: useFullscreenLayout ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: useFullscreenLayout ? 'none' : 'blur(18px)',
              WebkitBackdropFilter: useFullscreenLayout ? 'none' : 'blur(18px)',
            }}
          >
            {/* Recent Flights Carousel — quick preview strip above the ledger */}
            {flightLogs.length > 0 && (
              <div
                style={{
                  width: '100%',
                  padding: useFullscreenLayout ? '1.5rem 0 0.5rem' : '1.5rem 0 0.5rem',
                  marginBottom: useFullscreenLayout ? '0.5rem' : '0',
                }}
              >
                <div style={{ width: '100%' }}>
                  <p
                    style={{
                      margin: '0 0 0.25rem',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      textAlign: 'center',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    My Flightbook
                  </p>
                  <p
                    style={{
                      margin: '0 0 0.75rem',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      textAlign: 'center',
                    }}
                  >
                    Recent Flights
                  </p>
                  <div
                    className="recent-flights-carousel"
                    style={{
                      display: 'flex',
                      gap: isMobile ? '0.75rem' : '1rem',
                      overflowX: 'auto',
                      paddingBottom: '0.75rem',
                      scrollSnapType: 'x mandatory',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    {flightLogs.slice(0, 5).map((log) => (
                      <button
                        key={log.id}
                        onClick={() => handleRecentFlightClick(log)}
                        style={{
                          flex: isMobile ? '0 0 85%' : '0 0 45%',
                          minWidth: isMobile ? '280px' : '520px',
                          border: 'none',
                          borderRadius: '18px',
                          padding: 0,
                          background: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          outline: 'none',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            height: isMobile ? '180px' : '240px',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            background: 'rgba(8, 8, 10, 0.45)',
                            border:
                              selectedLog?.id === log.id
                                ? '2px solid #0ea5e9'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                            transition: 'transform 0.2s ease, border-color 0.2s ease',
                            scrollSnapAlign: 'start',
                          }}
                        >
                          <AircraftCarouselImage
                            aircraftType={log.aircraftType}
                            fallbackImage={log.image}
                            seedKey={log.id}
                            style={{ flex: '0 0 45%' }}
                          />
                          <div
                            style={{
                              flex: '1 1 55%',
                              padding: isMobile ? '0.75rem' : '1.25rem',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              textAlign: 'left',
                              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                              backdropFilter: 'blur(8px)',
                              WebkitBackdropFilter: 'blur(8px)',
                            }}
                          >
                            <p
                              style={{
                                margin: '0 0 0.25rem',
                                fontSize: isMobile ? '0.95rem' : '1.1rem',
                                fontWeight: 700,
                                color: '#ffffff',
                              }}
                            >
                              {log.aircraftType}
                            </p>
                            <p
                              style={{
                                margin: '0 0 0.5rem',
                                fontSize: isMobile ? '0.7rem' : '0.8rem',
                                color: '#94a3b8',
                              }}
                            >
                              {log.registration || '—'} · {log.date}
                            </p>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '0.5rem',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                                  color: '#ffffff',
                                  fontWeight: 600,
                                }}
                              >
                                {log.route || '—'}
                              </span>
                              <span
                                style={{
                                  fontSize: isMobile ? '0.65rem' : '0.7rem',
                                  color: '#10b981',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '6px',
                                  background: 'rgba(16, 185, 129, 0.12)',
                                  border: '1px solid rgba(16, 185, 129, 0.25)',
                                }}
                              >
                                {log.category || '—'}
                              </span>
                            </div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: isMobile ? '0.7rem' : '0.75rem',
                                color: '#64748b',
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {log.remarks || 'No remarks recorded.'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Table - Standard Format */}
            {
              <div
                style={{
                  overflowX: 'auto',
                  background: useFullscreenLayout ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                  borderRadius: useFullscreenLayout ? '28px' : '0px',
                  padding: useFullscreenLayout ? '1.5rem clamp(1.5rem, 4vw, 3rem) 1.75rem' : '0rem',
                  margin: useFullscreenLayout
                    ? '0 clamp(1.5rem, 4vw, 3rem) 1.5rem clamp(1.5rem, 4vw, 3rem)'
                    : '0',
                  border: useFullscreenLayout ? '1px solid rgba(255, 255, 255, 0.14)' : 'none',
                  boxShadow: useFullscreenLayout
                    ? '0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.18)'
                    : 'none',
                  backdropFilter: useFullscreenLayout ? 'blur(20px)' : 'none',
                  WebkitBackdropFilter: useFullscreenLayout ? 'blur(20px)' : 'none',
                }}
              >
                {/* Ledger Tabs & Filter */}
                {flightLogs.length > 0 && (
                  <div
                    style={{
                      width: '100%',
                      padding: useFullscreenLayout
                        ? '1.5rem clamp(1.5rem, 4vw, 3rem) 0.75rem'
                        : '1.5rem 0 0.75rem',
                      marginBottom: useFullscreenLayout ? '0.5rem' : '0',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: useFullscreenLayout ? '1200px' : '100%',
                        margin: '0 auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.35rem',
                          padding: '0.35rem',
                          background: 'rgba(8, 8, 10, 0.35)',
                          borderRadius: '14px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow:
                            'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.2)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                        }}
                      >
                        {[
                          { id: 'all', label: 'All Flights' },
                          { id: 'recent', label: 'Recent Flights' },
                          { id: 'byAircraft', label: 'Category by Aircraft' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setLedgerTab(tab.id as typeof ledgerTab)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              border: 'none',
                              background:
                                ledgerTab === tab.id ? 'rgba(220, 38, 38, 0.25)' : 'transparent',
                              color: ledgerTab === tab.id ? '#fca5a5' : 'rgba(148, 163, 184, 0.8)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textTransform: 'capitalize',
                              backdropFilter: ledgerTab === tab.id ? 'blur(8px)' : 'blur(4px)',
                              WebkitBackdropFilter:
                                ledgerTab === tab.id ? 'blur(8px)' : 'blur(4px)',
                              boxShadow:
                                ledgerTab === tab.id
                                  ? '0 0 20px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                                  : 'none',
                            }}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        {/* Format Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: '#94a3b8',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Format
                          </span>
                          <select
                            value={selectedFormat}
                            onChange={(e) =>
                              setSelectedFormat(e.target.value as typeof selectedFormat)
                            }
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '10px',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              background: 'rgba(8, 8, 10, 0.4)',
                              color: '#ffffff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              minWidth: '120px',
                              backdropFilter: 'blur(8px)',
                              WebkitBackdropFilter: 'blur(8px)',
                            }}
                          >
                            <option value="FAA" style={{ background: '#0f172a', color: '#ffffff' }}>
                              FAA (USA)
                            </option>
                            <option
                              value="EASA"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              EASA (Europe)
                            </option>
                            <option
                              value="CASA"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              CASA (Australia)
                            </option>
                            <option
                              value="ANAC"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              ANAC (Brazil)
                            </option>
                            <option
                              value="QCAA"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              QCAA (Qatar)
                            </option>
                            <option
                              value="CAAP"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              CAAP (Philippines)
                            </option>
                            <option value="CAE" style={{ background: '#0f172a', color: '#ffffff' }}>
                              CAE Training
                            </option>
                            <option
                              value="TCCA"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              TCCA (Canada)
                            </option>
                            <option
                              value="DGAC"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              DGAC (Mexico)
                            </option>
                            <option
                              value="CAAC"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              CAAC (China)
                            </option>
                            <option
                              value="HKCAD"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              HKCAD (Hong Kong)
                            </option>
                            <option
                              value="DGCAIndia"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              DGCA (India)
                            </option>
                            <option
                              value="JCAB"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              JCAB (Japan)
                            </option>
                            <option
                              value="NZCAA"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              NZCAA (New Zealand)
                            </option>
                            <option
                              value="SACAA"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              SACAA (South Africa)
                            </option>
                            <option
                              value="GCAA"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              GCAA (UAE)
                            </option>
                            <option
                              value="UKCAA"
                              style={{ background: '#0f172a', color: '#ffffff' }}
                            >
                              UK CAA
                            </option>
                            <option value="CAE" style={{ background: '#0f172a', color: '#ffffff' }}>
                              CAE Training
                            </option>
                          </select>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.85rem',
                            borderRadius: '10px',
                            background: 'transparent',
                            border: '1px solid rgba(229, 62, 62, 0.3)',
                            color: '#fca5a5',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            className="sync-indicator-dot"
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: '#ef4444',
                              boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                            }}
                          />
                          Your logbook is out of sync — connect your logbook to update
                        </div>

                        {ledgerTab === 'byAircraft' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: '#94a3b8',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              Aircraft
                            </span>
                            <select
                              value={selectedAircraftType}
                              onChange={(e) => setSelectedAircraftType(e.target.value)}
                              style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                background: 'rgba(8, 8, 10, 0.4)',
                                color: '#ffffff',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                minWidth: '140px',
                              }}
                            >
                              {aircraftTypes.map((type) => (
                                <option
                                  key={type}
                                  value={type}
                                  style={{ background: '#0f172a', color: '#ffffff' }}
                                >
                                  {type === 'all' ? 'All aircraft' : type}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr
                      style={{
                        background: useFullscreenLayout
                          ? 'rgba(255, 255, 255, 0.04)'
                          : 'rgba(255, 255, 255, 0.04)',
                        borderBottom: useFullscreenLayout
                          ? '1px solid rgba(255, 255, 255, 0.1)'
                          : '2px solid rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      {selectedFormat === 'FAA' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            IDENT
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ROUTE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            CATEGORY
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DESCRIPTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'EASA' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            AIRCRAFT
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            FUNCTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            NATURE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'CASA' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DAY
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            NIGHT
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'ANAC' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            FUNCTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'QCAA' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            CAPACITY
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'CAAP' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            FUNCTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'TCCA' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            FUNCTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'DGAC' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            CAPACITY
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'CAAC' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            FUNCTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'HKCAD' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            CAPACITY
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'DGCAIndia' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            CAPACITY
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'JCAB' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            CAPACITY
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'NZCAA' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            FUNCTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'SACAA' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            FUNCTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'GCAA' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            FUNCTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'UKCAA' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            FUNCTION
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                      {selectedFormat === 'CAE' && (
                        <>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DATE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TYPE
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            REG
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEP
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ARR
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            EVENT
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TIME
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'right',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TOTAL
                          </th>
                          <th
                            style={{
                              padding: '0.75rem',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#E0E0E0',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            ACTION
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={9}
                          style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}
                        >
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : displayedLogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}
                        >
                          {ledgerTab === 'byAircraft'
                            ? 'No flights found for the selected aircraft type.'
                            : ledgerTab === 'recent'
                              ? 'No recent flights to display.'
                              : 'No flight entries yet. Click "Add Flight Entry" to get started.'}
                        </td>
                      </tr>
                    ) : (
                      displayedLogs.map((log) => {
                        const originalIndex = flightLogs.findIndex((f) => f.id === log.id);
                        const runningTotal = getRunningTotal(originalIndex);

                        return (
                          <tr
                            key={log.id}
                            className={`logbook-glass-row ${selectedLog?.id === log.id ? 'selected' : ''}`}
                            style={{
                              borderBottom: useFullscreenLayout
                                ? '1px solid rgba(255, 255, 255, 0.08)'
                                : '1px solid rgba(255, 255, 255, 0.12)',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={() => setHoveredLog(log)}
                            onClick={() => setSelectedLog(log)}
                          >
                            {selectedFormat === 'FAA' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                  }}
                                >
                                  {log.route || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.remarks || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'EASA' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.easaDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.easaArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {log.easaPilotFunction || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.easaFlightNature || log.remarks || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'CASA' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.takeoffPoint || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.landingPoint || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.dayCasaHours || log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.nightCasaHours || '0.0'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'ANAC' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.brazilDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.brazilArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.pilotFunctionBrazil || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'QCAA' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.qcaaDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.qcaaArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.qcaaPilotCapacity || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'CAAP' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.caapDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.caapArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.caapPilotFunction || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'TCCA' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.caacDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.caacArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.caacFunction || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'DGAC' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.dgacDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.dgacArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.dgacOperatingCapacity || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'CAAC' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.caacDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.caacArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.caacFunction || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'HKCAD' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.hkcadDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.hkcadArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.hkcadPilotCapacity || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'DGCAIndia' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.dgacindiaDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.dgacindiaArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.dgacindiaPilotCapacity || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'JCAB' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.jcabDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.jcabArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.jcabAircraftClass || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'NZCAA' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.nzcaaDeparturePoint || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.nzcaaArrivalPoint || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.nzcaaFlightFunction || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'SACAA' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.sacaaDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.sacaaArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.sacaaFlightFunction || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'GCAA' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.gcaaDepartureIcao || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.gcaaArrivalIcao || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.gcaaPilotFunction || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'UKCAA' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.ukcaaOffBlock || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.ukcaaOnBlock || log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.ukcaaPilotFunction || log.category || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                            {selectedFormat === 'CAE' && (
                              <>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.date}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.aircraftType}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.registration || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.sessionDate || log.route?.split('-')[0] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#E0E0E0',
                                  }}
                                >
                                  {log.route?.split('-')[1] || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                  }}
                                >
                                  {log.lessonEventCode || log.remarks || '-'}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    textAlign: 'right',
                                  }}
                                >
                                  {log.hours.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    textAlign: 'right',
                                  }}
                                >
                                  {runningTotal.toFixed(1)}
                                </td>
                                <td
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEntry(log.id);
                                    }}
                                    style={{
                                      padding: '0.25rem 0.5rem',
                                      background: 'transparent',
                                      border: '1px solid transparent',
                                      color: '#64748b',
                                      fontSize: '0.7rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#ef4444';
                                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#64748b';
                                      e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            }

            {/* Flight Preview Card - shows hovered row details */}
            {previewLog && (
              <div
                id="logbook-main-preview"
                ref={mainPreviewRef}
                className="logbook-preview-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '1.5rem',
                  marginLeft: '0',
                  marginRight: '0',
                  width: '100%',
                  borderRadius: useFullscreenLayout ? '0px' : '24px',
                  overflow: 'hidden',
                  background: useFullscreenLayout
                    ? 'rgba(8, 8, 10, 0.95)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: useFullscreenLayout ? 'none' : '1px solid rgba(255, 255, 255, 0.14)',
                  boxShadow: useFullscreenLayout
                    ? '0 40px 100px rgba(0,0,0,0.5)'
                    : '0 24px 60px rgba(0,0,0,0.35), 0 0 40px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.12)',
                  maskImage: useFullscreenLayout
                    ? 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)'
                    : 'none',
                  WebkitMaskImage: useFullscreenLayout
                    ? 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)'
                    : 'none',
                  backdropFilter: useFullscreenLayout ? 'none' : 'blur(20px) saturate(1.2)',
                  WebkitBackdropFilter: useFullscreenLayout ? 'none' : 'blur(20px) saturate(1.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: useFullscreenLayout && !isMobile ? 'row' : 'column',
                    position: 'relative',
                  }}
                >
                  <AircraftCarouselImage
                    aircraftType={previewLog.aircraftType}
                    fallbackImage={previewLog.image}
                    seedKey={previewLog.id}
                    style={{
                      height: isMobile ? '180px' : useFullscreenLayout ? 'auto' : '200px',
                      minHeight: isMobile ? '180px' : useFullscreenLayout ? '460px' : '200px',
                      flex: inlineFullscreen
                        ? '0 0 100%'
                        : useFullscreenLayout && !isMobile
                          ? '0 0 45%'
                          : 'auto',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: inlineFullscreen
                          ? 'linear-gradient(to right, transparent 0%, transparent 35%, rgba(8,8,10,0.75) 65%, rgba(8,8,10,0.95) 100%), linear-gradient(to top, rgba(8,8,10,0.5) 0%, transparent 35%)'
                          : useFullscreenLayout
                            ? 'linear-gradient(to right, transparent 0%, transparent 40%, rgba(8,8,10,0.75) 70%, rgba(8,8,10,0.98) 100%), linear-gradient(to top, rgba(8,8,10,0.6) 0%, transparent 40%)'
                            : 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 50%, transparent 100%)',
                      }}
                    />
                    {isFullscreen && (
                      <button
                        onClick={toggleFullscreen}
                        title="Exit fullscreen"
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          background: 'rgba(8, 8, 10, 0.35)',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          zIndex: 10,
                        }}
                      >
                        <Minimize size={16} />
                        <span>Exit</span>
                      </button>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '999px',
                        background: 'rgba(8, 8, 10, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        zIndex: 10,
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                        {previewLog.aircraft}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {previewLog.registration || '—'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>
                        A-★
                      </span>
                    </div>
                    {(!useFullscreenLayout || inlineFullscreen) && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: inlineFullscreen ? 'auto' : '1.25rem',
                          top: inlineFullscreen ? '1.5rem' : 'auto',
                          left: '1.5rem',
                          right: inlineFullscreen ? 'auto' : '1.5rem',
                          maxWidth: inlineFullscreen ? '40%' : '100%',
                          margin: 0,
                          padding: inlineFullscreen ? '1rem 1.25rem' : '0',
                          borderRadius: inlineFullscreen ? '16px' : '0',
                          background: inlineFullscreen ? 'rgba(8, 8, 10, 0.45)' : 'transparent',
                          border: inlineFullscreen ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                          backdropFilter: inlineFullscreen ? 'blur(12px)' : 'none',
                          WebkitBackdropFilter: inlineFullscreen ? 'blur(12px)' : 'none',
                        }}
                      >
                        <p
                          style={{
                            margin: '0 0 0.25rem',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            color: '#f472b6',
                            textTransform: 'uppercase',
                          }}
                        >
                          {previewLog.aircraftType} · {previewLog.registration || '—'}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'end',
                            justifyContent: 'space-between',
                            gap: '1rem',
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: '1.75rem',
                              fontWeight: 800,
                              color: '#ffffff',
                            }}
                          >
                            {previewLog.aircraft}
                          </h3>
                          <span
                            style={{
                              padding: '0.35rem 0.85rem',
                              borderRadius: '999px',
                              background: 'rgba(244, 114, 182, 0.15)',
                              border: '1px solid rgba(244, 114, 182, 0.3)',
                              color: '#f472b6',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                            }}
                          >
                            Grade A-
                          </span>
                        </div>
                        <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                          {previewLog.date} · {previewLog.route || '—'} ·{' '}
                          {previewLog.category || '—'}
                        </p>
                      </div>
                    )}
                  </AircraftCarouselImage>

                  <div
                    style={{
                      position: inlineFullscreen ? 'absolute' : 'static',
                      right: inlineFullscreen ? 0 : undefined,
                      top: inlineFullscreen ? 0 : undefined,
                      width: inlineFullscreen ? '55%' : 'auto',
                      height: inlineFullscreen ? '100%' : 'auto',
                      flex: useFullscreenLayout && !inlineFullscreen ? '1 1 55%' : 'auto',
                      padding: useFullscreenLayout
                        ? '1.5rem clamp(1.5rem, 4vw, 3rem)'
                        : isMobile
                          ? '1rem 0.75rem'
                          : '1.5rem',
                      background:
                        useFullscreenLayout && !inlineFullscreen
                          ? 'rgba(8, 8, 10, 0.85)'
                          : 'transparent',
                      backdropFilter:
                        useFullscreenLayout && !inlineFullscreen ? 'blur(16px)' : 'none',
                      WebkitBackdropFilter:
                        useFullscreenLayout && !inlineFullscreen ? 'blur(16px)' : 'none',
                    }}
                  >
                    {isFullscreen && (
                      <div
                        style={{
                          marginBottom: '1.5rem',
                          padding: '1.25rem',
                          borderRadius: '16px',
                          background: 'rgba(20, 20, 24, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                        }}
                      >
                        <p
                          style={{
                            margin: '0 0 0.25rem',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            color: '#f472b6',
                            textTransform: 'uppercase',
                          }}
                        >
                          {previewLog.aircraftType} · {previewLog.registration || '—'}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'end',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            marginBottom: '0.35rem',
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: '1.75rem',
                              fontWeight: 800,
                              color: '#ffffff',
                            }}
                          >
                            {previewLog.aircraft}
                          </h3>
                          <span
                            style={{
                              padding: '0.35rem 0.85rem',
                              borderRadius: '999px',
                              background: 'rgba(244, 114, 182, 0.15)',
                              border: '1px solid rgba(244, 114, 182, 0.3)',
                              color: '#f472b6',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                            }}
                          >
                            Grade A-
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                          {previewLog.date} · {previewLog.route || '—'} ·{' '}
                          {previewLog.category || '—'}
                        </p>
                      </div>
                    )}
                    {!inlineFullscreen && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: isMobile
                            ? '1fr'
                            : useFullscreenLayout
                              ? 'repeat(2, 1fr)'
                              : 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '1rem',
                          marginBottom: '1.5rem',
                          maxWidth: useFullscreenLayout ? '1200px' : '100%',
                          margin: useFullscreenLayout ? '0 auto 1.5rem auto' : '0 0 1.5rem 0',
                        }}
                      >
                        {[
                          {
                            label: 'Mission Duration',
                            value: `${previewLog.hours.toFixed(1)}h`,
                            sub: 'Total flight time',
                            pct: 75,
                            color: '#fbbf24',
                          },
                          {
                            label: 'Block Time',
                            value: `${(previewLog.hours * 1.25).toFixed(1)}h`,
                            sub: 'Chocks off to on',
                            pct: 100,
                            color: '#38bdf8',
                          },
                          {
                            label: 'Landings',
                            value: '3/3',
                            sub: 'Successful',
                            pct: 100,
                            color: '#34d399',
                            success: true,
                          },
                          {
                            label: 'PIC Time',
                            value: `${(previewLog.hours * 0.8).toFixed(1)}h`,
                            sub: 'Pilot in command',
                            pct: 60,
                            color: '#a78bfa',
                          },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            style={{
                              background: 'rgba(20, 20, 22, 0.25)',
                              borderRadius: '16px',
                              padding: '1rem',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '0.75rem',
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    margin: '0 0 0.15rem',
                                    fontSize: '0.55rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {stat.label}
                                </p>
                                <div
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                >
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: '1.25rem',
                                      fontWeight: 800,
                                      color: '#ffffff',
                                    }}
                                  >
                                    {stat.value}
                                  </p>
                                  {stat.success && (
                                    <span style={{ color: '#34d399', fontSize: '0.9rem' }}>✓</span>
                                  )}
                                </div>
                              </div>
                              <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8' }}>
                                {stat.sub}
                              </p>
                            </div>
                            <div
                              style={{
                                width: '100%',
                                height: '4px',
                                background: 'rgba(255,255,255,0.08)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${stat.pct}%`,
                                  height: '100%',
                                  background: stat.color,
                                  borderRadius: '999px',
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stats grid — below the preview in inline fullscreen */}
            {inlineFullscreen && previewLog && (
              <div
                style={{
                  width: '100%',
                  padding: '1.5rem clamp(1.5rem, 4vw, 3rem)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    {[
                      {
                        label: 'Mission Duration',
                        value: `${previewLog.hours.toFixed(1)}h`,
                        sub: 'Total flight time',
                        pct: 75,
                        color: '#fbbf24',
                      },
                      {
                        label: 'Block Time',
                        value: `${(previewLog.hours * 1.25).toFixed(1)}h`,
                        sub: 'Chocks off to on',
                        pct: 100,
                        color: '#38bdf8',
                      },
                      {
                        label: 'Landings',
                        value: '3/3',
                        sub: 'Successful',
                        pct: 100,
                        color: '#34d399',
                        success: true,
                      },
                      {
                        label: 'PIC Time',
                        value: `${(previewLog.hours * 0.8).toFixed(1)}h`,
                        sub: 'Pilot in command',
                        pct: 60,
                        color: '#a78bfa',
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        style={{
                          background: 'rgba(20, 20, 22, 0.35)',
                          borderRadius: '16px',
                          padding: '1rem',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '0.75rem',
                          }}
                        >
                          <div>
                            <p
                              style={{
                                margin: '0 0 0.15rem',
                                fontSize: '0.55rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                color: '#64748b',
                                textTransform: 'uppercase',
                              }}
                            >
                              {stat.label}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: '1.25rem',
                                  fontWeight: 800,
                                  color: '#ffffff',
                                }}
                              >
                                {stat.value}
                              </p>
                              {stat.success && (
                                <span style={{ color: '#34d399', fontSize: '0.9rem' }}>✓</span>
                              )}
                            </div>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8' }}>
                            {stat.sub}
                          </p>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '4px',
                            background: 'rgba(255,255,255,0.08)',
                            borderRadius: '999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${stat.pct}%`,
                              height: '100%',
                              background: stat.color,
                              borderRadius: '999px',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Flight Debrief — standalone section above the ledger */}
            {previewLog && (
              <div
                style={{
                  width: '100%',
                  padding: useFullscreenLayout
                    ? '1.5rem clamp(1.5rem, 4vw, 3rem)'
                    : isMobile
                      ? '1rem 0.75rem'
                      : '1.5rem',
                  marginBottom: useFullscreenLayout ? '1.5rem' : '0',
                }}
              >
                <div
                  style={{
                    maxWidth: useFullscreenLayout ? '1200px' : '100%',
                    margin: useFullscreenLayout ? '0 auto' : '0',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 0.75rem',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#64748b',
                      textTransform: 'uppercase',
                    }}
                  >
                    Flight Debrief
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile
                        ? '1fr'
                        : 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: isMobile ? '1rem' : '1.25rem',
                      background: 'rgba(8, 8, 10, 0.35)',
                      borderRadius: '24px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow:
                        '0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: '0 0 0.35rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#34d399',
                        }}
                      >
                        Successes
                      </p>
                      <p
                        style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}
                      >
                        Excellent speed control and aim point management on approach. Precision in
                        flaring and braking.
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: '0 0 0.35rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#fbbf24',
                        }}
                      >
                        Areas for Refinement
                      </p>
                      <p
                        style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}
                      >
                        Rudder coordination at low speeds needs improvement during rotation. Aim for
                        more consistent trim application.
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          margin: '0 0 0.35rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#38bdf8',
                        }}
                      >
                        Notes
                      </p>
                      <p
                        style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}
                      >
                        {previewLog.remarks || 'No additional remarks recorded for this flight.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Flight Crew Notary — crew roster with notary comments below the debrief */}
            {previewLog && (
              <div
                style={{
                  width: '100%',
                  padding: useFullscreenLayout
                    ? '0 clamp(1.5rem, 4vw, 3rem) 1.5rem'
                    : isMobile
                      ? '0 0.75rem 1rem'
                      : '0 1.5rem 1.5rem',
                  marginBottom: useFullscreenLayout ? '1.5rem' : '0',
                }}
              >
                <div
                  style={{
                    maxWidth: useFullscreenLayout ? '1200px' : '100%',
                    margin: useFullscreenLayout ? '0 auto' : '0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        color: '#e2e8f0',
                        textTransform: 'uppercase',
                      }}
                    >
                      Flight Crew Notary
                    </p>
                    <button
                      onClick={() => setAddingCrew(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        background: 'rgba(56, 189, 248, 0.16)',
                        color: '#7dd3fc',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(56, 189, 248, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.28)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.16)';
                        e.currentTarget.style.color = '#7dd3fc';
                      }}
                    >
                      <Plus size={16} /> Add Crew
                    </button>
                  </div>
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.72)',
                      borderRadius: '24px',
                      padding: '1.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow:
                        '0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                    }}
                  >
                    {(flightCrew[previewLog.id] || []).length === 0 && !addingCrew && (
                      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <p
                          style={{
                            margin: '0 0 0.5rem',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#e2e8f0',
                          }}
                        >
                          No crew recorded for this flight.
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            lineHeight: 1.5,
                          }}
                        >
                          Tap <strong style={{ color: '#7dd3fc' }}>Add Crew</strong> to tag a
                          registered pilot or invite someone new.
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {(flightCrew[previewLog.id] || []).map((crew) => (
                        <div
                          key={crew.id}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
                        >
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: crew.avatar
                                ? `url(${crew.avatar}) center/cover`
                                : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '0.9rem',
                              fontWeight: 800,
                              color: '#ffffff',
                              textTransform: 'uppercase',
                              border: '2px solid rgba(255, 255, 255, 0.12)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            }}
                          >
                            {!crew.avatar && crew.name.charAt(0)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '0.6rem',
                                marginBottom: '0.4rem',
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: '0.95rem',
                                  fontWeight: 700,
                                  color: '#f8fafc',
                                }}
                              >
                                {crew.name}
                              </p>
                              <span
                                style={{
                                  margin: 0,
                                  fontSize: '0.7rem',
                                  color: '#bae6fd',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.06em',
                                  fontWeight: 700,
                                }}
                              >
                                {crew.role}
                              </span>
                            </div>
                            <div
                              style={{
                                background: 'rgba(56, 189, 248, 0.1)',
                                border: '1px solid rgba(56, 189, 248, 0.22)',
                                borderRadius: '16px 16px 16px 4px',
                                padding: '0.85rem 1.1rem',
                                display: 'inline-block',
                                maxWidth: '100%',
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: '0.85rem',
                                  color: '#f1f5f9',
                                  lineHeight: 1.55,
                                  wordBreak: 'break-word',
                                }}
                              >
                                {crew.comment || 'No notary comment recorded.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {addingCrew && (
                      <div
                        style={{
                          marginTop: '1.25rem',
                          paddingTop: '1.25rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.7rem 0.9rem',
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              background: 'rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <Search size={16} color="#94a3b8" />
                            <input
                              type="text"
                              placeholder="Search PilotRecognition profiles..."
                              value={crewSearchQuery}
                              onChange={(e) => {
                                setCrewSearchQuery(e.target.value);
                                setSelectedCrewProfile(null);
                              }}
                              style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                color: '#f8fafc',
                                fontSize: '0.85rem',
                                outline: 'none',
                              }}
                            />
                            {crewSearchLoading && (
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                Searching…
                              </span>
                            )}
                          </div>
                          {(crewSearchResults.length > 0 ||
                            (crewSearchQuery.trim().length >= 2 &&
                              !crewSearchLoading &&
                              !selectedCrewProfile)) && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 0.4rem)',
                                left: 0,
                                right: 0,
                                maxHeight: '260px',
                                overflowY: 'auto',
                                background: 'rgba(8, 8, 10, 0.85)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                zIndex: 50,
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
                              }}
                            >
                              {crewSearchResults.map((profile) => (
                                <button
                                  key={profile.id}
                                  onClick={() => {
                                    setSelectedCrewProfile(profile);
                                    setCrewSearchQuery(
                                      profile.display_name || profile.full_name || ''
                                    );
                                    setCrewSearchResults([]);
                                  }}
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.6rem 0.75rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                  }}
                                >
                                  <div
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      background:
                                        profile.avatar_url || profile.profile_image_url
                                          ? `url(${profile.avatar_url || profile.profile_image_url}) center/cover`
                                          : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                      fontSize: '0.65rem',
                                      fontWeight: 700,
                                      color: '#ffffff',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    {!(profile.avatar_url || profile.profile_image_url) &&
                                      (profile.display_name || profile.full_name || '?').charAt(0)}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: '#f8fafc',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {profile.display_name || profile.full_name || 'Unknown'}
                                    </p>
                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: '0.7rem',
                                        color: '#94a3b8',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {profile.email || profile.id}
                                    </p>
                                  </div>
                                </button>
                              ))}
                              {crewSearchResults.length === 0 &&
                                crewSearchQuery.trim().length >= 2 && (
                                  <div
                                    style={{
                                      padding: '1rem',
                                      background: 'rgba(15, 23, 42, 0.6)',
                                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}
                                  >
                                    {crewReferralLink ? (
                                      <div>
                                        <p
                                          style={{
                                            margin: '0 0 0.5rem',
                                            fontSize: '0.8rem',
                                            color: '#cbd5e1',
                                          }}
                                        >
                                          No registered profile found for{' '}
                                          <strong style={{ color: '#f8fafc' }}>
                                            {crewSearchQuery.trim()}
                                          </strong>
                                          .
                                        </p>
                                        <p
                                          style={{
                                            margin: '0 0 0.65rem',
                                            fontSize: '0.85rem',
                                            fontWeight: 800,
                                            color: '#7dd3fc',
                                          }}
                                        >
                                          Invite them and earn $20 if they subscribe to Recognition+
                                        </p>
                                        <div
                                          style={{
                                            display: 'flex',
                                            gap: '0.6rem',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <input
                                            type="text"
                                            readOnly
                                            value={crewReferralLink}
                                            onClick={(e) => {
                                              (e.target as HTMLInputElement).select();
                                            }}
                                            style={{
                                              flex: 1,
                                              padding: '0.55rem 0.75rem',
                                              borderRadius: '10px',
                                              border: '1px solid rgba(255, 255, 255, 0.12)',
                                              background: 'rgba(255, 255, 255, 0.06)',
                                              color: '#f8fafc',
                                              fontSize: '0.75rem',
                                              outline: 'none',
                                            }}
                                          />
                                          <button
                                            onClick={() => {
                                              navigator.clipboard.writeText(crewReferralLink);
                                              setCrewReferralCopied(true);
                                              setTimeout(() => setCrewReferralCopied(false), 2000);
                                            }}
                                            style={{
                                              padding: '0.55rem 0.9rem',
                                              borderRadius: '10px',
                                              border: '1px solid rgba(56, 189, 248, 0.35)',
                                              background: 'rgba(56, 189, 248, 0.16)',
                                              color: '#7dd3fc',
                                              fontSize: '0.75rem',
                                              fontWeight: 700,
                                              cursor: 'pointer',
                                              transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.background =
                                                'rgba(56, 189, 248, 0.28)';
                                              e.currentTarget.style.color = '#ffffff';
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.background =
                                                'rgba(56, 189, 248, 0.16)';
                                              e.currentTarget.style.color = '#7dd3fc';
                                            }}
                                          >
                                            {crewReferralCopied ? 'Copied!' : 'Copy'}
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <p
                                        style={{
                                          margin: 0,
                                          fontSize: '0.8rem',
                                          color: '#94a3b8',
                                          lineHeight: 1.5,
                                        }}
                                      >
                                        No registered PilotRecognition profile found. You can still
                                        add them as a plain-text crew member above, or try a
                                        different search.
                                      </p>
                                    )}
                                  </div>
                                )}
                            </div>
                          )}
                        </div>

                        {selectedCrewProfile && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              marginBottom: '0.85rem',
                              padding: '0.6rem 0.9rem',
                              borderRadius: '12px',
                              background: 'rgba(56, 189, 248, 0.12)',
                              border: '1px solid rgba(56, 189, 248, 0.25)',
                              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.08)',
                            }}
                          >
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background:
                                  selectedCrewProfile.avatar_url ||
                                  selectedCrewProfile.profile_image_url
                                    ? `url(${selectedCrewProfile.avatar_url || selectedCrewProfile.profile_image_url}) center/cover`
                                    : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: '#ffffff',
                                textTransform: 'uppercase',
                              }}
                            >
                              {!(
                                selectedCrewProfile.avatar_url ||
                                selectedCrewProfile.profile_image_url
                              ) &&
                                (
                                  selectedCrewProfile.display_name ||
                                  selectedCrewProfile.full_name ||
                                  '?'
                                ).charAt(0)}
                            </div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: '#7dd3fc',
                              }}
                            >
                              {selectedCrewProfile.display_name ||
                                selectedCrewProfile.full_name ||
                                'Selected profile'}
                            </p>
                            <button
                              onClick={() => {
                                setSelectedCrewProfile(null);
                                setCrewSearchQuery('');
                              }}
                              style={{
                                marginLeft: 'auto',
                                padding: '0.3rem 0.6rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'rgba(255,255,255,0.08)',
                                color: '#e2e8f0',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Change
                            </button>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem' }}>
                          <input
                            type="text"
                            placeholder="Role (e.g. PIC, FO, Instructor)"
                            value={crewRole}
                            onChange={(e) => setCrewRole(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '0.7rem 0.9rem',
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              background: 'rgba(255, 255, 255, 0.06)',
                              color: '#f8fafc',
                              fontSize: '0.85rem',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <textarea
                          value={crewComment}
                          onChange={(e) => setCrewComment(e.target.value)}
                          placeholder="Notary comment about this crew member on this flight..."
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '0.85rem 0.9rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: '#f8fafc',
                            fontSize: '0.85rem',
                            lineHeight: 1.55,
                            resize: 'vertical',
                            outline: 'none',
                            marginBottom: '0.85rem',
                          }}
                        />

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '0.85rem',
                            flexWrap: isMobile ? 'wrap' : 'nowrap',
                          }}
                        >
                          <button
                            onClick={() => {
                              setAddingCrew(false);
                              setCrewSearchQuery('');
                              setCrewSearchResults([]);
                              setSelectedCrewProfile(null);
                              setCrewRole('');
                              setCrewComment('');
                            }}
                            style={{
                              padding: '0.6rem 1.1rem',
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: '#e2e8f0',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              const name =
                                selectedCrewProfile?.display_name ||
                                selectedCrewProfile?.full_name ||
                                crewSearchQuery.trim();
                              if (!name || crewSubmitLoading) return;
                              setCrewSubmitLoading(true);
                              try {
                                setFlightCrew((prev) => ({
                                  ...prev,
                                  [previewLog.id]: [
                                    ...(prev[previewLog.id] || []),
                                    {
                                      id: Math.random().toString(36).slice(2),
                                      name: name.trim(),
                                      role: crewRole.trim() || 'Crew',
                                      avatar:
                                        selectedCrewProfile?.avatar_url ||
                                        selectedCrewProfile?.profile_image_url,
                                      profileId: selectedCrewProfile?.id,
                                      comment: crewComment.trim(),
                                    },
                                  ],
                                }));

                                if (selectedCrewProfile?.id && resolvedUserId && previewLog) {
                                  const reporterName =
                                    [userProfile?.firstName, userProfile?.lastName]
                                      .filter(Boolean)
                                      .join(' ')
                                      .trim() || 'A pilot';
                                  await callApi('tagFlightCrewMember', {
                                    reporter_user_id: resolvedUserId,
                                    tagged_user_id: selectedCrewProfile.id,
                                    flight: {
                                      date: previewLog.date,
                                      aircraft_type: previewLog.aircraftType,
                                      registration: previewLog.registration,
                                      route: previewLog.route,
                                    },
                                    role: crewRole.trim() || 'Crew',
                                    comment: crewComment.trim(),
                                    reporter_name: reporterName,
                                  });
                                }
                              } catch (err) {
                                console.error('Failed to notify tagged crew member:', err);
                              } finally {
                                setCrewSearchQuery('');
                                setCrewSearchResults([]);
                                setSelectedCrewProfile(null);
                                setCrewRole('');
                                setCrewComment('');
                                setAddingCrew(false);
                                setCrewSubmitLoading(false);
                              }
                            }}
                            disabled={crewSubmitLoading}
                            style={{
                              padding: '0.6rem 1.1rem',
                              borderRadius: '12px',
                              border: '1px solid rgba(56, 189, 248, 0.4)',
                              background: crewSubmitLoading
                                ? 'rgba(56, 189, 248, 0.12)'
                                : 'rgba(56, 189, 248, 0.2)',
                              color: '#ffffff',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: crewSubmitLoading ? 'not-allowed' : 'pointer',
                              opacity: crewSubmitLoading ? 0.7 : 1,
                              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.15)',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!crewSubmitLoading) {
                                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.32)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!crewSubmitLoading) {
                                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                              }
                            }}
                          >
                            {crewSubmitLoading ? 'Adding…' : 'Add Notary Entry'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recognition AI — career strategist under the flight debrief */}
            {previewLog && (
              <div
                style={{
                  width: '100%',
                  padding: useFullscreenLayout
                    ? '0 clamp(1.5rem, 4vw, 3rem) 1.5rem'
                    : isMobile
                      ? '0 0.75rem 1rem'
                      : '0 1.5rem 1.5rem',
                  marginBottom: useFullscreenLayout ? '1.5rem' : '0',
                }}
              >
                <div
                  style={{
                    maxWidth: useFullscreenLayout ? '1200px' : '100%',
                    margin: useFullscreenLayout ? '0 auto' : '0',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 0.75rem',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#64748b',
                      textTransform: 'uppercase',
                    }}
                  >
                    Recognition AI
                  </p>
                  <RecognitionAIChat profile={userProfile as Record<string, unknown>} />
                </div>
              </div>
            )}

            {flightLogs.length > 0 && (
              <div
                style={{
                  marginTop: '2rem',
                  marginLeft: useFullscreenLayout ? 'clamp(1.5rem, 4vw, 3rem)' : '0',
                  marginRight: useFullscreenLayout ? 'clamp(1.5rem, 4vw, 3rem)' : '0',
                  padding: '1rem 1.25rem',
                  background: 'rgba(8, 8, 10, 0.15)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 32px rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  display: 'flex',
                  justifyContent: isMobile ? 'center' : 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  textAlign: isMobile ? 'center' : 'left',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: isMobile ? '100%' : 'auto',
                    justifyContent: isMobile ? 'center' : 'flex-start',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: isMobile ? '0.65rem' : '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cumulative Flight Log
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '1rem' : '1.5rem',
                    flexWrap: 'wrap',
                    justifyContent: isMobile ? 'center' : 'flex-start',
                  }}
                >
                  {[
                    { label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, color: '#38bdf8' },
                    {
                      label: 'Total PIC',
                      value: `${(totalHours * 0.55).toFixed(1)}h`,
                      color: '#a78bfa',
                    },
                    {
                      label: 'Total Dual',
                      value: `${(totalHours * 0.35).toFixed(1)}h`,
                      color: '#fbbf24',
                    },
                    {
                      label: 'Total IFR',
                      value: `${(totalHours * 0.25).toFixed(1)}h`,
                      color: '#34d399',
                    },
                  ].map((stat) => (
                    <div key={stat.label} style={{ textAlign: 'center' }}>
                      <p
                        style={{
                          margin: '0 0 0.15rem',
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          color: '#64748b',
                          textTransform: 'uppercase',
                        }}
                      >
                        {stat.label}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          color: stat.color,
                        }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
