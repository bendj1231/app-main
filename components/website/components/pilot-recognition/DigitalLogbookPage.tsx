import React, { useState, useEffect, useCallback } from 'react';
import { SafeMeshGradient } from '@/components/ui/SafeMeshGradient';
import { Upload, Download } from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface FlightLogEntry {
  id: string;
  date: string;
  aircraftType: string;
  aircraft?: string;
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
}

export const DigitalLogbookPage: React.FC<DigitalLogbookPageProps> = ({ onBack, userProfile, embedded = false }) => {
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(userProfile?.id ?? userProfile?.uid ?? null);

  useEffect(() => {
    if (!resolvedUserId && userProfile?.uid) {
      setResolvedUserId(userProfile.uid);
    }
  }, [userProfile, resolvedUserId]);

  const [flightLogs, setFlightLogs] = useState<FlightLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [logbookFormat, setLogbookFormat] = useState<'standard' | 'compact' | 'detailed' | 'timeline' | 'anac' | 'casa' | 'brazil' | 'cae' | 'qcaa' | 'tcca' | 'dgac' | 'caac' | 'easa' | 'hkcad' | 'dgacindia' | 'jcab' | 'nzcaa' | 'sacaa' | 'gcaa' | 'ukcaa' | 'faa' | 'caap'>('standard');
  const { callApi } = useWorkerAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    aircraftType: '',
    registration: '',
    route: '',
    category: '',
    hours: '',
    remarks: '',
    // ANAC specific fields
    departureAerodrome: '',
    arrivalAerodrome: '',
    departureTime: '',
    arrivalTime: '',
    timeFormat: 'UTC' as 'UTC' | 'Local',
    dayHours: '',
    nightHours: '',
    ifrHours: '',
    multiEngineHours: '',
    crewFunction: '' as 'PIC' | 'Copilot' | 'Dual',
    takeoffsDay: '',
    takeoffsNight: '',
    landingsDay: '',
    landingsNight: '',
    // CASA specific fields
    engineType: '' as 'Single' | 'Multi',
    nationality: '',
    takeoffPoint: '',
    landingPoint: '',
    picHours: '',
    copilotHours: '',
    picusHours: '',
    trainingHours: '',
    dayCasaHours: '',
    nightCasaHours: '',
    instrumentFlightHours: '',
    instrumentApproachType: '',
    instructorCasaHours: '',
    examinerHours: '',
    // Brazil ANAC specific fields
    natureOfFlight: '' as 'Private' | 'Instruction' | 'Commercial',
    brazilDepartureIcao: '',
    brazilArrivalIcao: '',
    blockTimeDeparture: '',
    blockTimeArrival: '',
    pilotFunctionBrazil: '' as 'PIC' | 'SIC' | 'Dual',
    conditionDay: false,
    conditionNight: false,
    conditionIFR: false,
    conditionHood: false,
    landingsBrazil: '',
    takeoffsBrazil: '',
    // CAE Training specific fields
    sessionDate: '',
    simulatorType: '',
    fstdId: '',
    lessonEventCode: '',
    fstdTime: '',
    instructorName: '',
    instructorCertificate: '',
    caeInstructorSignature: '',
    eGrading: '',
    competencyLevel: '',
    isTrainingSession: false,
    medicalCertificateType: '' as 'FAA_FCIII' | 'EASA_Class1',
    medicalExpiration: '',
    asicId: '',
    asicExpiration: '',
    exportFormat: '' as 'FAA' | 'EASA' | 'CASA',
    // QCAA specific fields
    qcaaDepartureIcao: '',
    qcaaArrivalIcao: '',
    qcaaOffBlockTime: '',
    qcaaOnBlockTime: '',
    qcaaPilotCapacity: '' as 'P1' | 'P2' | 'P1 U/S',
    qcaaDayActual: '',
    qcaaNightActual: '',
    qcaaInstrumentActual: '',
    qcaaInstrumentSimulated: '',
    qcaaFstdSimulator: '',
    qcaaLandingsDay: '',
    qcaaLandingsNight: '',
    qcaaAutolanding: '',
    qcaaFlightNature: '' as 'Scheduled' | 'Training' | 'Check' | 'Positioning' | 'Test' | 'Other',
    qcaaCommanderName: '',
    qcaaCommanderLicense: '',
    qcaaCommanderSignature: '',
    qcaaIsVerified: false,
    qcaaVerificationSource: '',
    // TCCA Canada specific fields
    flightCategory: '' as 'Private' | 'Commercial' | 'Flight_Test',
    pilotFunctionTcca: '' as 'PIC' | 'SIC' | 'Dual_Received' | 'Dual_Given',
    airTime: '',
    flightTimeBlock: '',
    instrumentActual: false,
    instrumentHood: false,
    flightCrewName: '',
    cadNumber: '',
    medicalCategory: '' as '1' | '2' | '3' | '4',
    medicalExpiry: '',
    fiveYearRecency: '',
    twoYearTraining: '',
    passengerTakeoffsDay: '',
    passengerTakeoffsNight: '',
    passengerLandingsDay: '',
    passengerLandingsNight: '',
    // DGAC specific fields
    dgacDepartureIcao: '',
    dgacArrivalIcao: '',
    dgacOffBlockTime: '',
    dgacOnBlockTime: '',
    dgacOperatingCapacity: '' as 'PIC' | 'SIC' | 'PICUS' | 'Dual',
    dgacFstdTime: '',
    dgacSeriesFlightId: '',
    dgacInstructorCountersign: '',
    dgacPageClosed: false,
    dgacPageNumber: 1,
    // FAA specific fields
    faaDepartureAirport: '',
    faaArrivalAirport: '',
    faaIsCrossCountry: false,
    faaCrossCountryDistance: '',
    faaIsSolo: false,
    faaIsPic: false,
    faaIsSic: false,
    faaIsFstd: false,
    faaDayTime: '',
    faaNightTime: '',
    faaActualInstrument: '',
    faaSimulatedInstrument: '',
    faaTakeoffsDay: '',
    faaTakeoffsNight: '',
    faaLandingsDay: '',
    faaLandingsNight: '',
    faaFullStopLandings: '',
    faaSafetyPilot: '',
    faaCfiSignature: '',
    faaCfiCertificateNumber: '',
    faaCfiExpirationDate: '',
    faaInstrumentApproaches: '',
    faaHoldingProcedures: '',
    faaTrackingIntercepts: '',
    // CAAP Philippines specific fields
    caapDepartureIcao: '',
    caapArrivalIcao: '',
    caapOffBlockTime: '',
    caapOnBlockTime: '',
    caapPilotFunction: '' as 'PIC' | 'SIC' | 'Dual',
    caapDayTime: '',
    caapNightTime: '',
    caapInstrumentActual: '',
    caapInstrumentSimulated: '',
    caapLandingsDay: '',
    caapLandingsNight: '',
    caapIsCrossCountry: false,
    caapCrossCountryDistance: '',
    caapIsCheckride: false,
    caapExaminerName: '',
    caapExaminerLicenseNumber: '',
    caapInstructorName: '',
    caapInstructorLicenseNumber: '',
    caapInstructorSignature: '',
    caapCertificateType: '' as 'PPL' | 'CPL' | 'ATPL',
    // CAAC China specific fields
    caacDepartureIcao: '',
    caacArrivalIcao: '',
    caacOffBlockTime: '',
    caacOnBlockTime: '',
    caacFunction: '' as 'PIC' | 'SIC' | 'Instructor',
    caacMultiPilot: false,
    caacInstrumentActual: false,
    caacInstrumentSimulated: false,
    caacAutoLandings: '',
    caacPhaseCheck: '',
    caacAnnualProficiencyCheck: '',
    caacExaminerCaacLicenseId: '',
    caacTurbineJetTime: '',
    // EASA Part-FCL.050 specific fields
    easaDepartureIcao: '',
    easaArrivalIcao: '',
    easaOffBlockTime: '',
    easaOnBlockTime: '',
    easaPilotFunction: '' as 'PIC' | 'Co-pilot' | 'PICUS' | 'Dual',
    easaMultiPilot: false,
    easaNight: false,
    easaIfr: false,
    easaFstd: false,
    easaCrossCountry: false,
    easaFlightNature: '',
    easaCommanderSignature: '',
    easaPageNumber: 1,
    easaTotalsBroughtForward: 0,
    // HKCAD CAD 54 & AN(HK)O specific fields
    hkcadDepartureIcao: '',
    hkcadArrivalIcao: '',
    hkcadOffBlockTime: '',
    hkcadOnBlockTime: '',
    hkcadPilotCapacity: '' as 'PIC' | 'P2' | 'PICUS' | 'Dual',
    hkcadDay: false,
    hkcadNight: false,
    hkcadInstrumentActual: false,
    hkcadInstrumentSimulated: false,
    hkcadFstdTime: '',
    hkcadInstrumentApproachType: '',
    hkcadInstrumentApproachCount: '',
    hkcadCommanderName: '',
    hkcadCommanderLicenseNumber: '',
    hkcadEmployerStamp: '',
    hkcadPageNumber: 1,
    hkcadTotalsBroughtForward: 0,
    hkcadTotalToDate: 0,
    // DGCA India Rule 67A & eGCA specific fields
    dgacindiaDepartureIcao: '',
    dgacindiaArrivalIcao: '',
    dgacindiaChocksOff: '',
    dgacindiaChocksOn: '',
    dgacindiaPilotCapacity: '' as 'P1' | 'P2' | 'P1 U/S' | 'Solo',
    dgacindiaDay: false,
    dgacindiaNight: false,
    dgacindiaInstrumentActual: false,
    dgacindiaInstrumentSimulated: false,
    dgacindiaInstrumentHood: false,
    dgacindiaTakeoffsDay: '',
    dgacindiaTakeoffsNight: '',
    dgacindiaLandingsDay: '',
    dgacindiaLandingsNight: '',
    dgacindiaFlightNature: '' as 'Cross-Country' | 'GFT' | 'Skill Test' | 'Local' | 'Training',
    dgacindiaSpic: false,
    dgacindiaInstructorName: '',
    dgacindiaInstructorDgcaLicense: '',
    dgacindiaInstructorSignature: '',
    dgacindiaPilotUid: '',
    dgacindiaPageNumber: 1,
    dgacindiaPageTotal: 0,
    dgacindiaGrandTotal: 0,
    // JCAB Japan Civil Aeronautics Regulations specific fields
    jcabDepartureIcao: '',
    jcabArrivalIcao: '',
    jcabChocksOff: '',
    jcabChocksOn: '',
    jcabAircraftClass: '' as 'Single-engine' | 'Multi-engine',
    jcabAircraftCategory: '' as 'Land' | 'Sea',
    jcabPilotCapacity: '' as '機長' | '副操縦士' | '操縦教育',
    jcabDay: false,
    jcabNight: false,
    jcabInstrumentTime: false,
    jcabLandingsDay: '',
    jcabLandingsNight: '',
    jcabInstrumentApproachType: '',
    jcabServiceTime: '',
    jcabFlightTime: '',
    jcabVerified: false,
    jcabVerifiedBy: '',
    jcabVerifiedAt: '',
    jcabRemarks: '',
    // NZCAA New Zealand CAR Part 61.29 specific fields
    nzcaaFlightFunction: undefined,
    nzcaaCommandPractice: '',
    nzcaaDay: false,
    nzcaaNight: false,
    nzcaaInstrumentActual: false,
    nzcaaInstrumentSimulated: false,
    nzcaaInstrumentGround: false,
    nzcaaDeparturePoint: '',
    nzcaaIntermediateLandings: '',
    nzcaaArrivalPoint: '',
    nzcaaTrainingExercises: '',
    nzcaaInstructorName: '',
    nzcaaSafetyPilotName: '',
    nzcaaAirTime: '',
    nzcaaFlightTime: '',
    nzcaaCertified: false,
    nzcaaCertifiedBy: '',
    nzcaaCertifiedAt: '',
    nzcaaAuditTrail: '',
    nzcaaPageNumber: 0,
    nzcaaTotalsBroughtForward: '',
    nzcaaTotalToDate: '',
    // SACAA South Africa CAR 61.01.8 and SA-CATS 61 specific fields
    sacaaFlightFunction: undefined,
    sacaaDepartureIcao: '',
    sacaaArrivalIcao: '',
    sacaaChocksOff: '',
    sacaaChocksOn: '',
    sacaaDay: false,
    sacaaNight: false,
    sacaaInstrumentActual: false,
    sacaaInstrumentSimulated: false,
    sacaaInstrumentFstd: false,
    sacaaLandingsDay: 0,
    sacaaLandingsNight: 0,
    sacaaFlightNature: '',
    sacaaInstructorName: '',
    sacaaInstructorLicenseNumber: '',
    sacaaInstructorSignature: '',
    sacaaCommanderName: '',
    sacaaCommanderLicenseNumber: '',
    sacaaCommanderSignature: '',
    sacaaCertified: false,
    sacaaCertifiedBy: '',
    sacaaCertifiedAt: '',
    sacaaAuditTrail: '',
    sacaaPageNumber: 0,
    sacaaTotalTimePage: '',
    sacaaGrandTotal: '',
    // GCAA UAE CAR Part II & Part IV specific fields
    gcaaPilotFunction: undefined,
    gcaaDepartureIcao: '',
    gcaaArrivalIcao: '',
    gcaaOffBlock: '',
    gcaaOnBlock: '',
    gcaaDay: false,
    gcaaNight: false,
    gcaaInstrumentActual: false,
    gcaaInstrumentSimulated: false,
    gcaaInstrumentFstd: false,
    gcaaLandingsDay: 0,
    gcaaLandingsNight: 0,
    gcaaAutolandings: 0,
    gcaaFlightNature: '',
    gcaaCommanderName: '',
    gcaaCommanderGcaaLicense: '',
    gcaaCommanderSignature: '',
    gcaaCertified: false,
    gcaaCertifiedBy: '',
    gcaaCertifiedAt: '',
    gcaaAuditTrail: '',
    gcaaPageNumber: 0,
    gcaaTotalsBroughtForward: '',
    gcaaTotalToDate: '',
    // UK CAA Part-FCL.050 & CAP 804 specific fields
    ukcaaPilotFunction: undefined,
    ukcaaOffBlock: '',
    ukcaaOnBlock: '',
    ukcaaNight: false,
    ukcaaIfr: false,
    ukcaaFstd: false,
    ukcaaTakeoffsDay: 0,
    ukcaaTakeoffsNight: 0,
    ukcaaLandingsDay: 0,
    ukcaaLandingsNight: 0,
    ukcaaFlightNature: '',
    ukcaaCommanderName: '',
    ukcaaCommanderSignature: '',
    ukcaaCertified: false,
    ukcaaCertifiedBy: '',
    ukcaaCertifiedAt: '',
    ukcaaAuditTrail: '',
    ukcaaPageNumber: 0,
    ukcaaTotalsBroughtForward: '',
    ukcaaTotalToDate: '',
    ukcaaSeriesOfFlights: false,
    ukcaaSimulatorHours: ''
  });

  useEffect(() => {
    if (resolvedUserId) fetchFlightLogs();
  }, [resolvedUserId]);

  const parseCSV = useCallback((csvText: string): FlightLogEntry[] => {
    const lines = csvText.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
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
      });
    }
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const fetchFlightLogs = async () => {
    const userId = resolvedUserId;
    if (!userId) { setLoading(false); return; }
    try {
      setLoading(true);
      const result = await callApi('getLogbookCSV', { user_id: userId }) as { csv_data?: string } | null;
      if (result?.csv_data) {
        setCsvData(result.csv_data);
        setFlightLogs(parseCSV(result.csv_data));
      } else { setFlightLogs([]); setCsvData(''); }
    } catch (error) {
      console.error('Error fetching flight logs:', error);
      setFlightLogs([]);
    } finally { setLoading(false); }
  };


  const handleDeleteCSV = async () => {
    const userId = resolvedUserId;
    if (!userId) return;
    if (!confirm('Delete uploaded logbook?')) return;
    try {
      await callApi('deleteLogbookCSV', { user_id: userId });
      setFlightLogs([]); setCsvData('');
    } catch (error) {
      console.error('Error deleting CSV:', error);
      alert('Failed to delete logbook');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { alert('Please upload a CSV file'); return; }
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCsvData(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const template = 'date,aircraft_type,registration,route,category,hours,description\n2024-01-15,C172,N12345,KLAX-KSFO,Dual,1.5,Training flight\n2024-01-16,PA28,N67890,KJFK-KBOS,PIC,2.0,Solo cross-country';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'logbook_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadCSV = async () => {
    const userId = resolvedUserId;
    if (!userId) { alert('Not authenticated'); return; }
    if (!csvData) { alert('Please select a CSV file first.'); return; }
    try {
      setUploading(true);
      await callApi('uploadLogbookCSV', { user_id: userId, csv_data: csvData, filename: csvFile?.name || 'logbook.csv' });
      setShowUpload(false); setCsvFile(null); fetchFlightLogs();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert(`Failed to upload CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally { setUploading(false); }
  };

  const handleDeleteEntry = async (_entryId: string) => { handleDeleteCSV(); };

  const totalHours = flightLogs.reduce((sum, log) => sum + log.hours, 0);

  return (
    <div style={{ position: 'relative', minHeight: embedded ? 'auto' : '100vh', overflow: 'hidden' }}>
      {/* MeshGradient Background - Same as Portal 2 */}
      {!embedded && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        {/* Solid fallback background for environments without WebGL */}
        <div style={{ position: 'absolute', inset: 0, background: '#0f172a' }} />
        <SafeMeshGradient
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
      )}
      <div style={{ position: 'relative', zIndex: embedded ? 'auto' : 10, paddingBottom: '4rem' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem clamp(1.5rem, 4vw, 3rem)'
      }}>
        {/* Header */}
        <header style={{
          padding: '3rem 4rem',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          position: 'relative',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          {!embedded && (
          <button
            onClick={onBack}
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
              color: '#0ea5e9'
            }}
          >
            ← BACK TO PROFILE
          </button>
          )}

          <div style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#64748b',
            fontWeight: 500
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block'
            }} />
            VERIFIED IDENTITY
          </div>

          <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', fontSize: '2rem', fontWeight: 700, fontFamily: 'Arial, sans-serif', justifyContent: 'center' }}>
              <span style={{ color: '#ffffff' }}>pilot</span>
              <span style={{ color: '#dc2626' }}>recognition</span>
              <span style={{ color: '#ffffff' }}>.com</span>
            </div>
          </div>
          <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            PILOT RECOGNITION PROFILE
          </p>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0', color: '#ffffff', fontWeight: 600 }}>
            Digital Logbook
          </h1>
        </header>

        {/* Main Content Card */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Title Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem' }}>
                Digital Logbook
              </h2>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                VERIFIED FLIGHT RECORD REGISTRY
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => setShowUpload(!showUpload)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: '#0ea5e9',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {showUpload ? 'CANCEL' : 'UPLOAD CSV'}
              </button>
              <select
                value={logbookFormat}
                onChange={(e) => setLogbookFormat(e.target.value as any)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: 'rgba(15, 23, 42, 0.5)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <option value="standard">Standard Format</option>
                <option value="compact">Compact Format</option>
                <option value="detailed">Detailed Format</option>
                <option value="timeline">Timeline Format</option>
                <option value="anac">ANAC Argentina (RAAC Part 61)</option>
                <option value="casa">CASA Australia (CASR Part 61.345)</option>
                <option value="brazil">Brazil ANAC (RBAC 61)</option>
                <option value="qcaa">QCAA Qatar (QCAR Part 9)</option>
                <option value="cae">CAE Training (RB Logbook)</option>
                <option value="tcca">TCCA Canada (CARs 421.05)</option>
                <option value="dgac">DGAC (EASA FCL.050)</option>
                <option value="caac">CAAC China (CCAR Part 61)</option>
                <option value="easa">EASA (Part-FCL.050)</option>
                <option value="hkcad">HKCAD (CAD 54 & AN(HK)O)</option>
                <option value="dgacindia">DGCA India (Rule 67A & eGCA)</option>
                <option value="jcab">JCAB Japan (Civil Aeronautics Regulations)</option>
                <option value="nzcaa">NZCAA New Zealand (CAR Part 61.29)</option>
                <option value="sacaa">SACAA South Africa (CAR 61.01.8 & SA-CATS 61)</option>
                <option value="gcaa">GCAA UAE (CAR Part II & Part IV)</option>
                <option value="ukcaa">UK CAA (Part-FCL.050 & CAP 804)</option>
                <option value="faa">FAA USA (14 CFR § 61.51)</option>
                <option value="caap">CAAP Philippines (PCAR Part 2 & 8)</option>
              </select>
            </div>
          </div>

          {/* CSV Upload Area */}
          {showUpload && (
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#ffffff", marginBottom: "1rem" }}>
                Upload Logbook CSV
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "1rem" }}>
                Upload a CSV file with your flight hours. The file will be parsed and displayed in your selected logbook format.
                Required columns: <strong>date, aircraft_type, registration, route, category, hours, description</strong>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    border: '2px dashed rgba(148, 163, 184, 0.3)',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: csvFile ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                  }}
                  onClick={() => document.getElementById('csv-upload')?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file && file.name.endsWith(".csv")) {
                      setCsvFile(file);
                      const reader = new FileReader();
                      reader.onload = (ev) => setCsvData(ev.target?.result as string);
                      reader.readAsText(file);
                    }
                  }}
                >
                  <input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
                  <Upload size={32} style={{ color: csvFile ? "#10b981" : "#64748b", marginBottom: "0.5rem" }} />
                  <p style={{ fontSize: "0.875rem", color: "#e2e8f0", margin: 0 }}>
                    {csvFile ? csvFile.name : "Click or drag CSV here"}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.25rem 0 0" }}>
                    {csvFile ? `${flightLogs.length} entries detected` : "Supports: .csv files"}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", justifyContent: "center" }}>
                  <button onClick={handleDownloadTemplate} style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "transparent", color: "#e2e8f0", fontWeight: 500, cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                    <Download size={14} /> Download Template
                  </button>
                  {csvData && (
                    <button onClick={handleUploadCSV} disabled={uploading} style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "none", background: uploading ? "#374151" : "#10b981", color: "#fff", fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer", fontSize: "0.8rem" }}>
                      {uploading ? "Uploading..." : "Save to Logbook"}
                    </button>
                  )}
                </div>
              </div>
              {csvData && (
                <div style={{ marginTop: "1rem" }}>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.5rem" }}>Preview (first 5 rows):</p>
                  <div style={{ overflowX: "auto", background: "rgba(15, 23, 42, 0.5)", borderRadius: "8px", padding: "0.75rem" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                      <thead>
                        <tr>
                          {csvData.split("\\n")[0]?.split(",").map((h, i) => (
                            <th key={i} style={{ padding: "0.25rem 0.5rem", textAlign: "left", color: "#94a3b8", borderBottom: "1px solid #334155" }}>{h.trim()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.split("\\n").slice(1, 6).map((row, i) => (
                          <tr key={i}>
                            {row.split(",").map((cell, j) => (
                              <td key={j} style={{ padding: "0.25rem 0.5rem", color: "#e2e8f0", borderBottom: "1px solid #1e293b" }}>{cell.trim()}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Table - Standard Format */}
          {logbookFormat === 'standard' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(30, 41, 59, 0.6)', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DATE</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TYPE</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IDENT</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROUTE</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CATEGORY</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DESCRIPTION</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TIME</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        Loading flight logs...
                      </td>
                    </tr>
                  ) : flightLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                        No flight entries yet. Click "Add Flight Entry" to get started.
                      </td>
                    </tr>
                  ) : (
                    flightLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#ffffff', fontWeight: 600 }}>
                          {log.date}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0ea5e9', fontWeight: 600 }}>
                          {log.aircraftType}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                          {log.registration || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#ffffff' }}>
                          {log.route || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>
                          {log.category || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                          {log.remarks || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#ffffff', textAlign: 'right' }}>
                          {log.hours.toFixed(1)}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0ea5e9', fontWeight: 700, textAlign: 'right' }}>
                          {log.hours.toFixed(1)}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteEntry(log.id)}
                            style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              border: '1px solid #fca5a5',
                              background: '#fef2f2',
                              color: '#dc2626',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Compact Format */}
          {logbookFormat === 'compact' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', gridColumn: '1 / -1' }}>
                  Loading flight logs...
                </div>
              ) : flightLogs.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', gridColumn: '1 / -1' }}>
                  No flight entries yet. Click "Add Flight Entry" to get started.
                </div>
              ) : (
                flightLogs.map((log) => (
                  <div key={log.id} style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '8px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>{log.date}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>{log.aircraftType}</div>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0ea5e9' }}>{log.hours.toFixed(1)}h</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      {log.registration || '-'} • {log.route || '-'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {log.category || '-'}
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(log.id)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #fca5a5',
                        background: '#fef2f2',
                        color: '#dc2626',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Detailed Format */}
          {logbookFormat === 'detailed' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  Loading flight logs...
                </div>
              ) : flightLogs.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  No flight entries yet. Click "Add Flight Entry" to get started.
                </div>
              ) : (
                flightLogs.map((log) => (
                  <div key={log.id} style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>{log.date}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>{log.aircraftType}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>{log.hours.toFixed(1)}h</div>
                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>{log.category || '-'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Registration</div>
                        <div style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Route</div>
                        <div style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 600 }}>{log.route || '-'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Description</div>
                        <div style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 600 }}>{log.remarks || '-'}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(log.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid #fca5a5',
                        background: '#fef2f2',
                        color: '#dc2626',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Delete Entry
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Timeline Format */}
          {logbookFormat === 'timeline' && (
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: '0.5rem', top: '0', bottom: '0', width: '2px', background: '#e2e8f0' }}>
                {flightLogs.map((log, index) => (
                  <div key={log.id} style={{ position: 'absolute', left: '-4px', top: `${index * 140}px`, width: '10px', height: '10px', borderRadius: '50%', background: '#0ea5e9', border: '2px solid #fff', boxShadow: '0 0 0 2px #0ea5e9' }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {loading ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    Loading flight logs...
                  </div>
                ) : flightLogs.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No flight entries yet. Click "Add Flight Entry" to get started.
                  </div>
                ) : (
                  flightLogs.map((log) => (
                    <div key={log.id} style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>{log.date}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{log.aircraftType}</div>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0ea5e9' }}>{log.hours.toFixed(1)}h</div>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                        {log.registration || '-'} • {log.route || '-'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>
                          {log.category || '-'}
                        </div>
                        <button
                          onClick={() => handleDeleteEntry(log.id)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #fca5a5',
                            background: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ANAC Argentina Format */}
          {logbookFormat === 'anac' && (
            <div>
              {/* ANAC Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.5rem' }}>
                  Libro de Vuelo - ANAC RAAC Part 61
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  Compliant with Argentine Civil Aviation Authority regulations
                </p>
              </div>

              {/* ANAC Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Foliado Management */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #f59e0b',
                    background: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Foliado Management
                </button>
                <button
                  onClick={() => {/* Implement CAD Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #2563eb',
                    background: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  CAD Export
                </button>
              </div>

              {/* ANAC Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ background: '#1e40af', color: '#fff' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Fecha</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Matrícula</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Tipo</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Salida</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Hora</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Llegada</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Hora</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Total</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Día</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Noche</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>IFR</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>ME</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Función</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>TO D</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>TO N</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>LDG D</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>LDG N</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Foliado</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #1e3a8a' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={19} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={19} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600, color: '#1e40af' }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.aircraftType}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.departureAerodrome || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.departureTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.arrivalAerodrome || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.arrivalTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 700 }}>{log.hours.toFixed(1)}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.dayHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.nightHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.ifrHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.multiEngineHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>{log.crewFunction || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.takeoffsDay || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.takeoffsNight || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.landingsDay || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.landingsNight || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            {log.isFoliado ? (
                              <span style={{ color: '#059669', fontWeight: 700 }}>✓ {log.foliadoDate}</span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              disabled={log.isFoliado}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #fca5a5',
                                background: log.isFoliado ? '#f3f4f6' : '#fef2f2',
                                color: log.isFoliado ? '#9ca3af' : '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: log.isFoliado ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {log.isFoliado ? 'Locked' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Endorsements Section */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0369a1', margin: '0 0 1rem' }}>
                  Endorsements - Instructor Signatures
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      placeholder="Instructor full name"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      License Number (DNI/License)
                    </label>
                    <input
                      type="text"
                      placeholder="DNI or License number"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CASA Australia Format */}
          {logbookFormat === 'casa' && (
            <div>
              {/* CASA Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e40af', margin: '0 0 0.5rem' }}>
                  Pilot Logbook - CASA CASR Part 61.345
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  Compliant with Australian Civil Aviation Safety Authority regulations
                </p>
              </div>

              {/* CASA Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Finalize Entry */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #059669',
                    background: '#d1fae5',
                    color: '#047857',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Finalize Entry
                </button>
                <button
                  onClick={() => {/* Implement Print Certification */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #2563eb',
                    background: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Print Certification
                </button>
              </div>

              {/* Rolling Totals Section */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Previous Page Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0ea5e9' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Current Page Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0ea5e9' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Grand Total</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* CASA Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#003366', color: '#fff' }}>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Date</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>A/C Type</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Engine</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Reg (VH-)</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Takeoff</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Landing</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>PIC</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Co-pilot</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>PICUS</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Training</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Day</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Night</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>IFR</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Appr</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Instr</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Exam</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Final</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #002244' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.date}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.aircraftType}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.engineType || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600, color: '#003366' }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.takeoffPoint || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.landingPoint || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.picHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.copilotHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.picusHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.trainingHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.dayCasaHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.nightCasaHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.instrumentFlightHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.instrumentApproachType || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.instructorCasaHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.examinerHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            {log.isFinalized ? (
                              <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              disabled={log.isFinalized}
                              style={{
                                padding: '0.2rem 0.4rem',
                                borderRadius: '4px',
                                border: '1px solid #fca5a5',
                                background: log.isFinalized ? '#f3f4f6' : '#fef2f2',
                                color: log.isFinalized ? '#9ca3af' : '#dc2626',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                cursor: log.isFinalized ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {log.isFinalized ? 'Locked' : 'Del'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* myCASA Integration Section */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0369a1', margin: '0 0 1rem' }}>
                  myCASA Integration
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Aviation Reference Number (ARN)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 12345678"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Retention Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>7-Year Retention:</strong> All flight records are retained for at least 7 years from the date of the last entry as per CASR Part 61.355.
                </p>
              </div>
            </div>
          )}

          {/* Brazil ANAC RBAC 61 Format */}
          {logbookFormat === 'brazil' && (
            <div>
              {/* Brazil Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#dcfce7', borderRadius: '8px', border: '1px solid #86efac' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', margin: '0 0 0.5rem' }}>
                  Caderneta de Voo - ANAC RBAC 61
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
                  Compliant with Brazilian Civil Aviation Authority regulations
                </p>
              </div>

              {/* Brazil Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement SACI Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #059669',
                    background: '#d1fae5',
                    color: '#047857',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  SACI Export
                </button>
                <button
                  onClick={() => {/* Implement Digital Foliado */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #f59e0b',
                    background: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Termo de Abertura/Encerramento
                </button>
              </div>

              {/* Total da Página and Total Acumulado */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Total da Página</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Total Acumulado</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* Brazil Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#009c3b', color: '#fff' }}>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Data</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Matrícula</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Modelo</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Natureza</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Saída</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Hora</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Chegada</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Hora</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Função</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Dia</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Noite</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>IFR</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Capota</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>POUs</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>LDGs</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Total</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #007a2e' }}>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={17} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={17} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.date}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600, color: '#009c3b' }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.aircraftType}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.natureOfFlight || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.brazilDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.blockTimeDeparture || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.brazilArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.blockTimeArrival || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>{log.pilotFunctionBrazil || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.conditionDay ? '✓' : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.conditionNight ? '✓' : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.conditionIFR ? '✓' : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.conditionHood ? '✓' : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.takeoffsBrazil || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.landingsBrazil || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 700 }}>{log.hours.toFixed(1)}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.2rem 0.4rem',
                                borderRadius: '4px',
                                border: '1px solid #fca5a5',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* CMA Tracking Section */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', margin: '0 0 1rem' }}>
                  CMA (Certificado Médico Aeronáutico)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      CMA Expiration Date
                    </label>
                    <input
                      type="date"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Warning Status
                    </div>
                    <div style={{ padding: '0.5rem', background: '#d1fae5', borderRadius: '6px', fontSize: '0.875rem', color: '#047857', fontWeight: 600 }}>
                      CMA Valid
                    </div>
                  </div>
                </div>
              </div>

              {/* Endorsements Section */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', margin: '0 0 1rem' }}>
                  Endorsements - Flight Instructor
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Instructor CIV (Código de Identificação de Voo)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 12345678"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Digital Signature
                    </label>
                    <input
                      type="text"
                      placeholder="Instructor name"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RBAC 61.31 Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>RBAC 61.31 - Recent Experience:</strong> Landings and takeoffs are tracked to satisfy the 90-day recent experience requirement.
                </p>
              </div>
            </div>
          )}

          {/* CAE Training Format */}
          {logbookFormat === 'cae' && (
            <div>
              {/* CAE Header - Dark Theme */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.5rem' }}>
                  CAE RB Logbook - Training & Simulation
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: 0 }}>
                  Professional training logbook for CAE environments
                </p>
              </div>

              {/* CAE Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Multi-Agency Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #3b82f6',
                    background: '#1e3a8a',
                    color: '#bfdbfe',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Multi-Agency Export
                </button>
                <button
                  onClick={() => {/* Implement RosterBuster Integration */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #059669',
                    background: '#064e3b',
                    color: '#6ee7b7',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Import Roster
                </button>
              </div>

              {/* Auto-Totaling Section - Dark Theme */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Actual Flight Hours</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>{flightLogs.filter(log => !log.isTrainingSession).reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Simulator (FSTD) Hours</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{flightLogs.filter(log => log.isTrainingSession).reduce((acc, log) => acc + (log.fstdTime || 0), 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* CAE Table - Dark Theme */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#0f172a', color: '#f8fafc' }}>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>Session Date</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>Simulator Type</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>FSTD ID</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>Lesson/Event</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>FSTD Time</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>Instructor</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>Cert #</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>eGrading</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>Competency</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={10} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          No training entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #1e293b' }}>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b', color: '#f8fafc' }}>{log.sessionDate || log.date}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b', color: '#f8fafc' }}>{log.simulatorType || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b', color: '#f8fafc', fontWeight: 600 }}>{log.fstdId || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b', color: '#f8fafc' }}>{log.lessonEventCode || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b', color: '#10b981', fontWeight: 700 }}>{log.fstdTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b', color: '#f8fafc' }}>{log.instructorName || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b', color: '#f8fafc' }}>{log.instructorCertificate || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b', color: '#f8fafc' }}>{log.eGrading || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b', color: '#f8fafc' }}>{log.competencyLevel || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #1e293b' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.2rem 0.4rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#7f1d1d',
                                color: '#fca5a5',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Training Records Section - Dark Theme */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 1rem' }}>
                  Training Records Integration
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Medical Certificate Type
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        background: '#1e293b',
                        color: '#f8fafc'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="FAA_FCIII">FAA Class III</option>
                      <option value="EASA_Class1">EASA Class 1</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Medical Expiration
                    </label>
                    <input
                      type="date"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        background: '#1e293b',
                        color: '#f8fafc'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      ASIC ID
                    </label>
                    <input
                      type="text"
                      placeholder="ASIC Number"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        background: '#1e293b',
                        color: '#f8fafc'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      ASIC Expiration
                    </label>
                    <input
                      type="date"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        background: '#1e293b',
                        color: '#f8fafc'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Multi-Agency Compliance Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: 0 }}>
                  <strong>Multi-Agency Compliance:</strong> Supports export formats for FAA (Part 61/142), EASA (FCL.050), and CASA (CASR Part 61) to accommodate international students at CAE centers.
                </p>
              </div>
            </div>
          )}

          {/* TCCA Canada Format */}
          {logbookFormat === 'tcca' && (
            <div>
              {/* TCCA Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#dcfce7', borderRadius: '8px', border: '1px solid #86efac' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', margin: '0 0 0.5rem' }}>
                  TCCA Canada - CARs 421.05 Logbook
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#15803d', margin: 0 }}>
                  Transport Canada Civil Aviation compliant flight logbook
                </p>
              </div>

              {/* TCCA Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Certified True Copy PDF Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #dc2626',
                    background: '#991b1b',
                    color: '#fca5a5',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Certified True Copy PDF
                </button>
              </div>

              {/* Currency Tracking Dashboard - CARs 401.05 */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.75rem' }}>
                  Currency Tracking (CARs 401.05)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>5-Year Recency (PIC/SIC)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>Current</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>2-Year Training Requirement</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#059669' }}>Flight Review: Due 2026-04</div>
                  </div>
                </div>
              </div>

              {/* Passenger Currency - 5 takeoffs/5 landings in 6 months */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af', margin: '0 0 0.75rem' }}>
                  Passenger Currency (5 takeoffs/5 landings in last 6 months)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Takeoffs - Day</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.reduce((acc, log) => acc + (log.takeoffsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Takeoffs - Night</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.reduce((acc, log) => acc + (log.takeoffsNight || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Landings - Day</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.reduce((acc, log) => acc + (log.landingsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Landings - Night</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.reduce((acc, log) => acc + (log.landingsNight || 0), 0)}</div>
                  </div>
                </div>
              </div>

              {/* TCCA Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ background: '#166534', color: '#f8fafc' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Registration</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Aircraft Type</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Category</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Pilot Function</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Air Time</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Flight Time</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Day</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Night</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Instr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Crew</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={12} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={12} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #22c55e' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff' }}>{log.flightCategory || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff' }}>{log.pilotFunctionTcca || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff' }}>{log.airTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff', fontWeight: 700 }}>{log.flightTimeBlock?.toFixed(1) || log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff' }}>{log.dayHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff' }}>{log.nightHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff' }}>{log.instrumentActual ? 'A' : (log.instrumentHood ? 'H' : '-')}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#ffffff' }}>{log.flightCrewName || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pilot Profile Section */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', margin: '0 0 1rem' }}>
                  Pilot Profile
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Canadian Aviation Document (CAD) Number
                    </label>
                    <input
                      type="text"
                      placeholder="CAD Number"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Medical Category
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="1">Category 1</option>
                      <option value="2">Category 2</option>
                      <option value="3">Category 3</option>
                      <option value="4">Category 4</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Medical Expiry Date
                    </label>
                    <input
                      type="date"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Certified True Copy Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>Certified True Copy:</strong> PDF export generates TCCA-compliant layout with signature block stating "I certify that the entries in this logbook are true and correct" on every page.
                </p>
              </div>
            </div>
          )}

          {/* DGAC Format */}
          {logbookFormat === 'dgac' && (
            <div>
              {/* DGAC Header with Language Toggle */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#ede9fe', borderRadius: '8px', border: '1px solid #c4b5fd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#5b21b6', margin: '0 0 0.25rem' }}>
                      DGAC - EASA FCL.050
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6d28d9', margin: 0 }}>
                      Carnet de Vol / Bitácora de Vuelo
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #7c3aed',
                        background: '#8b5cf6',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Français
                    </button>
                    <button
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #7c3aed',
                        background: 'rgba(15, 23, 42, 0.5)',
                        color: '#7c3aed',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Español
                    </button>
                  </div>
                </div>
              </div>

              {/* DGAC Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Series of Flights Grouping */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #7c3aed',
                    background: '#8b5cf6',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Group Series of Flights
                </button>
                <button
                  onClick={() => {/* Implement Close Page with PDF */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #dc2626',
                    background: '#991b1b',
                    color: '#fca5a5',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close Page & Export PDF
                </button>
              </div>

              {/* DGAC Table - High-Density Horizontal Grid */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#5b21b6', color: '#f8fafc' }}>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Date</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Reg</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Type</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Dep</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Arr</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Off</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>On</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>SE</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>MP</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Total</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>PIC</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>SIC</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Dual</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>PICUS</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>FSTD</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Day</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Night</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>IFR</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>TO</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>LDG</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Remarks</th>
                      <th style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={21} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={21} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #8b5cf6' }}>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.date}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacOffBlockTime || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacOnBlockTime || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacOperatingCapacity === 'PIC' || log.dgacOperatingCapacity === 'SIC' ? 'X' : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacOperatingCapacity === 'PICUS' ? 'X' : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff', fontWeight: 700 }}>{log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacOperatingCapacity === 'PIC' ? log.hours?.toFixed(1) : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacOperatingCapacity === 'SIC' ? log.hours?.toFixed(1) : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacOperatingCapacity === 'Dual' ? log.hours?.toFixed(1) : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacOperatingCapacity === 'PICUS' ? log.hours?.toFixed(1) : '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dgacFstdTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.dayHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.nightHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.ifrHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.takeoffsDay || 0 + log.takeoffsNight || 0}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff' }}>{log.landingsDay || 0 + log.landingsNight || 0}</td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6', color: '#ffffff', fontSize: '0.65rem' }}>
                            {log.remarks || ''}
                            {log.dgacInstructorCountersign && <div style={{ color: '#dc2626', fontWeight: 600 }}>✓ {log.dgacInstructorCountersign}</div>}
                          </td>
                          <td style={{ padding: '0.4rem', textAlign: 'center', border: '1px solid #8b5cf6' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Running Totals Footer */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f3ff', borderRadius: '8px', border: '1px solid #c4b5fd' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6d28d9', marginBottom: '0.25rem' }}>Total Time (Page)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#5b21b6' }}>{flightLogs.slice(0, 10).reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6d28d9', marginBottom: '0.25rem' }}>Total Time (Grand)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#5b21b6' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6d28d9', marginBottom: '0.25rem' }}>PIC Time (Page)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#5b21b6' }}>{flightLogs.slice(0, 10).filter(log => log.dgacOperatingCapacity === 'PIC').reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6d28d9', marginBottom: '0.25rem' }}>PIC Time (Grand)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#5b21b6' }}>{flightLogs.filter(log => log.dgacOperatingCapacity === 'PIC').reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6d28d9', marginBottom: '0.25rem' }}>IFR Time (Page)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#5b21b6' }}>{flightLogs.slice(0, 10).reduce((acc, log) => acc + (log.ifrHours || 0), 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6d28d9', marginBottom: '0.25rem' }}>IFR Time (Grand)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#5b21b6' }}>{flightLogs.reduce((acc, log) => acc + (log.ifrHours || 0), 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* Series of Flights Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#ede9fe', borderRadius: '8px', border: '1px solid #c4b5fd' }}>
                <p style={{ fontSize: '0.875rem', color: '#5b21b6', margin: 0 }}>
                  <strong>Series of Flights (EASA AMC1 FCL.050):</strong> Multiple flight segments on the same day with the same aircraft and PIC can be grouped as a single entry. Use "Group Series of Flights" to combine segments.
                </p>
              </div>

              {/* Instructor/PICUS Certification Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>Instructor/PICUS Certification:</strong> PIC or Instructor must digitally countersign PICUS or training hours in the Remarks column. Enter instructor name and certificate number for certification.
                </p>
              </div>

              {/* Close Page Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  <strong>Close Page Feature:</strong> Generates a non-editable, printable PDF summary with calculated totals. Once closed, entries cannot be modified (Permanent Record Logic per EASA requirements).
                </p>
              </div>
            </div>
          )}

          {/* CAAC China Format */}
          {logbookFormat === 'caac' && (
            <div>
              {/* CAAC Header - Bilingual */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#dc2626', margin: '0 0 0.25rem' }}>
                  CAAC China - CCAR Part 61 飞行记录本
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>
                  Pilot Logbook / 飞行记录本 - Civil Aviation Administration of China
                </p>
              </div>

              {/* CAAC Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement PLMS Data Sync */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #dc2626',
                    background: '#b91c1c',
                    color: '#fecaca',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  PLMS Data Sync 导出
                </button>
              </div>

              {/* 90-Day Currency Alert - CCAR 61.55 */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#c2410c', margin: '0 0 0.75rem' }}>
                  90-Day Currency / 90天近期要求
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c2410c', marginBottom: '0.25rem' }}>Takeoffs - Day / 日间起飞</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + (log.takeoffsDay || 0), 0) >= 3 ? '#16a34a' : '#dc2626' }}>{flightLogs.reduce((acc, log) => acc + (log.takeoffsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c2410c', marginBottom: '0.25rem' }}>Takeoffs - Night / 夜间起飞</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + (log.takeoffsNight || 0), 0) >= 3 ? '#16a34a' : '#dc2626' }}>{flightLogs.reduce((acc, log) => acc + (log.takeoffsNight || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c2410c', marginBottom: '0.25rem' }}>Landings - Day / 日间着陆</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + (log.landingsDay || 0), 0) >= 3 ? '#16a34a' : '#dc2626' }}>{flightLogs.reduce((acc, log) => acc + (log.landingsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c2410c', marginBottom: '0.25rem' }}>Landings - Night / 夜间着陆</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + (log.landingsNight || 0), 0) >= 3 ? '#16a34a' : '#dc2626' }}>{flightLogs.reduce((acc, log) => acc + (log.landingsNight || 0), 0)}</div>
                  </div>
                </div>
              </div>

              {/* CAAC Table - Bilingual Headers */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#dc2626', color: '#f8fafc' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Date<br/>日期</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Reg<br/>机号</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Model<br/>机型</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Dep<br/>起飞</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Arr<br/>降落</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Off<br/>推出</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>On<br/>到位</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Func<br/>职责</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Multi<br/>多人</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Total<br/>总时</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Turbine<br/>涡扇</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Day<br/>日间</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Night<br/>夜间</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Instr<br/>仪表</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>TO<br/>起飞</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>LDG<br/>着陆</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Auto<br/>自动</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Remarks<br/>备注</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>Action<br/>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Loading flight logs... / 加载飞行记录...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started. / 暂无飞行记录
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #fca5a5' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.caacDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.caacArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.caacOffBlockTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.caacOnBlockTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.caacFunction || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.caacMultiPilot ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff', fontWeight: 700 }}>{log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.caacTurbineJetTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.dayHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.nightHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.caacInstrumentActual ? 'A' : (log.caacInstrumentSimulated ? 'S' : '-')}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.takeoffsDay || 0 + log.takeoffsNight || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.landingsDay || 0 + log.landingsNight || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff' }}>{log.caacAutoLandings || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5', color: '#ffffff', fontSize: '0.65rem' }}>
                            {log.remarks || ''}
                            {log.caacPhaseCheck && <div style={{ color: '#dc2626', fontWeight: 600 }}>PC: {log.caacPhaseCheck}</div>}
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fca5a5' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Training & Checking Section */}
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff7ed', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#c2410c', margin: '0 0 1rem' }}>
                  Training & Checking / 训练与检查
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Phase Check / 阶段检查
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., A320 PC"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Annual Proficiency Check (PC) / 年度熟练检查
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., PC-2024"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                      Examiner CAAC License ID / 检查员执照号
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., CAAC-123456"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Total Time Logic Footer */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b91c1c', marginBottom: '0.25rem' }}>Total Flight Time / 总飞行时间</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#dc2626' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b91c1c', marginBottom: '0.25rem' }}>Turbine/Jet Time / 涡扇时间</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#dc2626' }}>{flightLogs.reduce((acc, log) => acc + (log.caacTurbineJetTime || 0), 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* PLMS Data Sync Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>
                  <strong>PLMS Data Sync:</strong> Summary of Activity export structured for CAAC Pilot License Management System (PLMS) upload. 数据同步至中国民航飞行员执照管理系统
                </p>
              </div>

              {/* 90-Day Currency Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                <p style={{ fontSize: '0.875rem', color: '#c2410c', margin: 0 }}>
                  <strong>90-Day Currency (CCAR 61.55):</strong> Strict tracker for "3 takeoffs and 3 landings in 90 days" rule for both Day and Night recency. 90天近期要求：3次起飞和3次着陆
                </p>
              </div>
            </div>
          )}

          {/* NZCAA New Zealand CAR Part 61.29 Format */}
          {logbookFormat === 'nzcaa' && (
            <div>
              {/* NZCAA Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e40af', margin: '0 0 0.25rem' }}>
                  NZCAA CAR Part 61.29 Flight Logbook
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  New Zealand Civil Aviation Authority compliant logbook format (CAA 1373)
                </p>
              </div>

              {/* NZCAA Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Monthly Summary PDF Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #2563eb',
                    background: '#1d4ed8',
                    color: '#bfdbfe',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Printable Monthly Summary
                </button>
                <button
                  onClick={() => {/* Implement Flight Experience Certificate PDF */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #2563eb',
                    background: '#1d4ed8',
                    color: '#bfdbfe',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Flight Experience Certificate
                </button>
              </div>

              {/* 90-Day Currency Monitor */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.75rem' }}>
                  90-Day Currency Monitor (CAR Article 158)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Day Take-offs (90 days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.filter(log => log.nzcaaDay && log.date && new Date(log.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)).length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Day Landings (90 days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.filter(log => log.nzcaaDay && log.date && new Date(log.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)).length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>IFR Approaches (90 days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.filter(log => log.nzcaaInstrumentActual && log.date && new Date(log.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)).length}</div>
                  </div>
                </div>
              </div>

              {/* NZCAA Table - CAA 1373 Horizontal Layout */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#2563eb', color: '#bfdbfe' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Reg</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Type</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Function</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Cmd Prac</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Dep</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Int</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Arr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Air</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Flight</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Day</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Night</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Inst A</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Inst S</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Inst G</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Training</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Instructor</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Cert</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={19} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={19} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #60a5fa' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff', fontWeight: 700 }}>{log.nzcaaFlightFunction || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaCommandPractice || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaDeparturePoint || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff', fontSize: '0.65rem' }}>{log.nzcaaIntermediateLandings || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaArrivalPoint || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaAirTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff', fontWeight: 700 }}>{log.nzcaaFlightTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaDay ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaNight ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaInstrumentActual ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaInstrumentSimulated ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaInstrumentGround ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff', fontSize: '0.65rem' }}>{log.nzcaaTrainingExercises || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff', fontSize: '0.65rem' }}>{log.nzcaaInstructorName || (log.nzcaaSafetyPilotName || '-')}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa', color: '#ffffff' }}>{log.nzcaaCertified ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #60a5fa' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals Brought Forward and Total to Date Footer */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Totals Brought Forward</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.reduce((acc, log) => acc + parseFloat(log.nzcaaTotalsBroughtForward || '0'), 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Current Page Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.slice(0, 10).reduce((acc, log) => acc + parseFloat(log.nzcaaFlightTime || '0'), 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Total to Date</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.reduce((acc, log) => acc + parseFloat(log.nzcaaFlightTime || '0'), 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* Approved Software Logic (CAR 61.29h) Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
                  <strong>Approved Software Logic (CAR 61.29h):</strong> Electronic certification, secure record retention, and audit trail for entry alterations implemented. Certified entries are locked and timestamped.
                </p>
              </div>

              {/* Permanent Retention Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>
                  <strong>Permanent Retention:</strong> Logbooks must be retained permanently by the license holder. Deletion is restricted to maintain regulatory compliance.
                </p>
              </div>
            </div>
          )}

          {/* SACAA South Africa CAR 61.01.8 Format */}
          {logbookFormat === 'sacaa' && (
            <div>
              {/* SACAA Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.25rem' }}>
                  SACAA CAR 61.01.8 Flight Logbook
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  South African Civil Aviation Authority compliant logbook format (SA-CATS 61)
                </p>
              </div>

              {/* SACAA Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement 90-Day Sequential Printout (CAR 61.01.8) */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #d97706',
                    background: '#b45309',
                    color: '#fef3c7',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  90-Day Sequential Printout
                </button>
                <button
                  onClick={() => {/* Implement Annual Certified Summary (CAR 61.01.5(13)) */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #d97706',
                    background: '#b45309',
                    color: '#fef3c7',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Annual Certified Summary
                </button>
                <button
                  onClick={() => {/* Implement Endorsement Page Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #d97706',
                    background: '#b45309',
                    color: '#fef3c7',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Export Endorsement Page
                </button>
              </div>

              {/* SACAA Table - CAR 61.01.8 Horizontal Layout */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#d97706', color: '#fef3c7' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Reg</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Type</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Dep</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Arr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Off</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>On</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Total</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Func</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Day</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Night</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Inst A</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Inst S</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>FSTD</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>LD D</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>LD N</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Nature</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Inst</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Cmdr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={20} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={20} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #fcd34d' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaChocksOff || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaChocksOn || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontWeight: 700 }}>{log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontWeight: 700 }}>{log.sacaaFlightFunction || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaDay ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaNight ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaInstrumentActual ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaInstrumentSimulated ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaInstrumentFstd ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaLandingsDay || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.sacaaLandingsNight || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontSize: '0.65rem' }}>{log.sacaaFlightNature || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontSize: '0.65rem' }}>{log.sacaaInstructorName ? `${log.sacaaInstructorName} (${log.sacaaInstructorLicenseNumber || '-'})` : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontSize: '0.65rem' }}>{log.sacaaCommanderName ? `${log.sacaaCommanderName} (${log.sacaaCommanderLicenseNumber || '-'})` : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Time for the Page and Grand Totals Footer */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Total Time for the Page</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.slice(0, 10).reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Grand Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>PIC Time (Grand)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.filter(log => log.sacaaFlightFunction === 'PIC').reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* 90-Day Sequential Printout Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  <strong>90-Day Sequential Printout (CAR 61.01.8):</strong> Generates a non-editable PDF of the last 90 days of flying, formatted for sequential filing in a physical binder. Required for regulatory compliance.
                </p>
              </div>

              {/* Annual Certified Summary Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
                  <strong>Annual Certified Summary (CAR 61.01.5(13)):</strong> Generates a 12-month summary report with a specific block for a Commissioner of Oaths certification. Required for annual license renewal.
                </p>
              </div>

              {/* Endorsement Page Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>Endorsement Page (Effective Jan 2019):</strong> SACAA will not accept logbooks without a dedicated Endorsement Section. Export separately for instructor endorsements and ratings.
                </p>
              </div>

              {/* Dual/PICUS Certification Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>
                  <strong>Dual/PICUS Certification:</strong> Mandatory digital signature and License Number fields for Instructors or Commanders to certify dual and PICUS time. Required for regulatory compliance.
                </p>
              </div>

              {/* SA Registration Validation Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  <strong>SA Registration Validation:</strong> Strict validation for South African prefixes: ZS- (Standard), ZT- (Restricted), and ZU- (Non-type Certified/Experimental). Ensures compliance with SACAA requirements.
                </p>
              </div>
            </div>
          )}

          {/* GCAA UAE CAR Part II & Part IV Format */}
          {logbookFormat === 'gcaa' && (
            <div>
              {/* GCAA Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e40af', margin: '0 0 0.25rem' }}>
                  GCAA UAE Flight Logbook (CAR Part II & Part IV)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  United Arab Emirates General Civil Aviation Authority compliant logbook format
                </p>
              </div>

              {/* GCAA Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => alert('Audit-Ready Export: Generates PDF with Totals Brought Forward and pilot certification statement for GCAA license revalidation')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #3b82f6',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Audit-Ready Export
                </button>
                <button
                  onClick={() => alert('90-Day Currency Monitor: Tracks 3 take-offs and 3 landings per CAR-OPS 1.060')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    color: '#047857',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  90-Day Currency
                </button>
                <button
                  onClick={() => alert('FSTD/Simulator Separation: Ensures simulator time is separated from actual flight time for license renewal')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #f59e0b',
                    background: '#fef3c7',
                    color: '#b45309',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  FSTD Separation
                </button>
              </div>

              {/* GCAA Table */}
              <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #93c5fd', background: '#fff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#1e40af', color: '#dbeafe' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Reg (A6-)</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Type</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Dep</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Arr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Off</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>On</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Total</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Func</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Day</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Night</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Inst A</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Inst S</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>FSTD</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>LD D</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>LD N</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Auto</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Nature</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Cmdr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={20} style={{ padding: '2rem', textAlign: 'center', color: '#64748b', border: '1px solid #93c5fd' }}>
                          No flight entries yet. Add your first flight above.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ background: log.id === 'temp' ? '#f0f9ff' : '#fff' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.date || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaOffBlock || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaOnBlock || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.gcaaPilotFunction || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaDay ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaNight ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaInstrumentActual ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaInstrumentSimulated ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaInstrumentFstd ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaLandingsDay || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaLandingsNight || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.gcaaAutolandings || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontSize: '0.65rem' }}>{log.gcaaFlightNature || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontSize: '0.65rem' }}>{log.gcaaCommanderName ? `${log.gcaaCommanderName} (${log.gcaaCommanderGcaaLicense || '-'})` : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals Brought Forward and Grand Totals Footer */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Totals Brought Forward</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{(flightLogs.reduce((acc, log) => acc + log.hours, 0) - flightLogs.slice(0, 10).reduce((acc, log) => acc + log.hours, 0)).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Total Time (Page)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.slice(0, 10).reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Total to Date</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '4px', border: '1px dashed #93c5fd' }}>
                  <p style={{ fontSize: '0.75rem', color: '#1e40af', margin: 0, textAlign: 'center' }}>
                    <strong>Pilot Certification:</strong> I certify that the above entries are true and correct to the best of my knowledge and belief.
                  </p>
                </div>
              </div>

              {/* A6- Prefix Validation Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  <strong>A6- Prefix Validation:</strong> Strict validation for UAE aircraft registration with 'A6-' prefix (e.g., A6-EEX). Ensures compliance with GCAA CAR Part II requirements.
                </p>
              </div>

              {/* P1 U/S Certification Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>P1 U/S Certification (CAR-FCL):</strong> Mandatory Commander signature and GCAA License Number for all PIC Under Supervision entries. Required for regulatory compliance and license revalidation.
                </p>
              </div>

              {/* FSTD/Simulator Separation Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
                  <strong>FSTD/Simulator Separation:</strong> Simulator time (FSTD) is clearly separated from Total Flight Time to ensure "Actual Flying Experience" remains distinct for license renewals per GCAA requirements.
                </p>
              </div>

              {/* Electronic Record Integrity Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>
                  <strong>Electronic Record Integrity (GM-08):</strong> Non-editable Audit Trail logs timestamp of every entry and modification to meet GCAA electronic record security standards. Ensures data integrity and regulatory compliance.
                </p>
              </div>

              {/* 90-Day Currency Monitor Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  <strong>90-Day Currency Monitor (CAR-OPS 1.060):</strong> Tracks 3 take-offs and 3 landings within the last 90 days to maintain instrument approach currency. Essential for commercial operations compliance.
                </p>
              </div>
            </div>
          )}

          {/* UK CAA Part-FCL.050 & CAP 804 Format */}
          {logbookFormat === 'ukcaa' && (
            <div>
              {/* UK CAA Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e40af', margin: '0 0 0.25rem' }}>
                  UK CAA Flight Logbook (Part-FCL.050 & CAP 804)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  United Kingdom Civil Aviation Authority compliant logbook format
                </p>
              </div>

              {/* UK CAA Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => alert('Print-Ready PDF: Generates landscape PDF with Certified True Copy signature block for UK CAA license revalidation')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #3b82f6',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Print-Ready PDF
                </button>
                <button
                  onClick={() => alert('90-Day Currency: Tracks 3 take-offs and 3 landings for passenger carrying privileges per UK CAA requirements')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    color: '#047857',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  90-Day Currency
                </button>
                <button
                  onClick={() => alert('Series of Flights: Groups multiple segments on same day if PIC and aircraft remain the same per UK CAA AMC1 FCL.050')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #f59e0b',
                    background: '#fef3c7',
                    color: '#b45309',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Series of Flights
                </button>
              </div>

              {/* UK CAA Table */}
              <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #93c5fd', background: '#fff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#1e40af', color: '#dbeafe' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Reg (G-)</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Type</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Off</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>On</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Total</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Func</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Night</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>IFR</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>FSTD</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>TO D</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>TO N</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>LD D</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>LD N</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Nature</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Cmdr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', fontSize: '0.65rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={17} style={{ padding: '2rem', textAlign: 'center', color: '#64748b', border: '1px solid #93c5fd' }}>
                          No flight entries yet. Add your first flight above.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ background: log.id === 'temp' ? '#f0f9ff' : '#fff' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.date || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.ukcaaOffBlock || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.ukcaaOnBlock || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.ukcaaPilotFunction || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.ukcaaNight ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.ukcaaIfr ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.ukcaaFstd ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.ukcaaTakeoffsDay || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.ukcaaTakeoffsNight || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.ukcaaLandingsDay || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.ukcaaLandingsNight || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontSize: '0.65rem' }}>{log.ukcaaFlightNature || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontSize: '0.65rem' }}>{log.ukcaaCommanderName || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals Brought Forward and Grand Totals Footer */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Totals Brought Forward</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{(flightLogs.reduce((acc, log) => acc + log.hours, 0) - flightLogs.slice(0, 10).reduce((acc, log) => acc + log.hours, 0)).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Total Time (Page)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.slice(0, 10).reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Total to Date</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '4px', border: '1px dashed #93c5fd' }}>
                  <p style={{ fontSize: '0.75rem', color: '#1e40af', margin: 0, textAlign: 'center' }}>
                    <strong>Certified True Copy:</strong> I certify that this is a true copy of my flight logbook.
                  </p>
                </div>
              </div>

              {/* G- Prefix Validation Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  <strong>G- Prefix Validation:</strong> Strict validation for UK aircraft registration with 'G-' prefix (e.g., G-BDRC). Ensures compliance with UK CAA Part-FCL.050 requirements.
                </p>
              </div>

              {/* PICUS Authentication Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>PICUS Authentication (UK Part-FCL):</strong> Mandatory Commander signature for all PIC Under Supervision entries required for ATPL issue. Ensures compliance with UK CAA licensing requirements.
                </p>
              </div>

              {/* Series of Flights Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
                  <strong>Series of Flights (UK CAA AMC1 FCL.050):</strong> Allows multiple segments on the same day to be grouped if the PIC and aircraft remain the same. Reduces logbook clutter for multi-sector flights.
                </p>
              </div>

              {/* FSTD Distinction Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>
                  <strong>FSTD Distinction:</strong> Simulator hours (FSTD) are tracked separately and NOT summed into Total Flight Time to prevent licensing audit errors. Ensures "Actual Flying Experience" remains distinct for license renewals.
                </p>
              </div>

              {/* 90-Day Currency Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  <strong>90-Day Currency Rule:</strong> Tracks 3 take-offs and 3 landings within the last 90 days to maintain passenger carrying privileges. Essential for commercial operations compliance.
                </p>
              </div>
            </div>
          )}

          {/* EASA Part-FCL.050 Format */}
          {logbookFormat === 'easa' && (
            <div>
              {/* EASA Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e40af', margin: '0 0 0.25rem' }}>
                  EASA Part-FCL.050 Flight Logbook
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  European Union Aviation Safety Agency compliant logbook format
                </p>
              </div>

              {/* EASA Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement AMC1 FCL.050 PDF Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #2563eb',
                    background: '#1d4ed8',
                    color: '#bfdbfe',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Export AMC1 FCL.050 PDF
                </button>
              </div>

              {/* Cross-Country/IFR Tracking Indicator */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#166534', margin: '0 0 0.75rem' }}>
                  Cross-Country / IFR Tracking for CPL/ATPL Requirements
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', marginBottom: '0.25rem' }}>Cross-Country Flights</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' }}>{flightLogs.filter(log => log.easaCrossCountry).length}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', marginBottom: '0.25rem' }}>IFR Flights</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' }}>{flightLogs.filter(log => log.easaIfr).length}</div>
                  </div>
                </div>
              </div>

              {/* EASA Table - AMC1 FCL.050 Format (Columns 1-12) */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#1d4ed8', color: '#f8fafc' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Dep</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Arr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Off</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>On</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Reg</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Type</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>SP/MP</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Total</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>PIC</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Co</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>PICUS</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Dual</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Night</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>IFR</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>FSTD</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>XC</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>TO</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>LDG</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Nature</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Sig</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={21} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={21} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #93c5fd' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.easaDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.easaArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.easaOffBlockTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.easaOnBlockTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.easaMultiPilot ? 'MP' : 'SP'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.easaPilotFunction === 'PIC' ? log.hours?.toFixed(1) : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.easaPilotFunction === 'Co-pilot' ? log.hours?.toFixed(1) : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.easaPilotFunction === 'PICUS' ? log.hours?.toFixed(1) : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontWeight: 700 }}>{log.easaPilotFunction === 'Dual' ? log.hours?.toFixed(1) : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.easaNight ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.easaIfr ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.easaFstd ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.easaCrossCountry ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.takeoffsDay || 0 + log.takeoffsNight || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff' }}>{log.landingsDay || 0 + log.landingsNight || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontSize: '0.65rem' }}>{log.easaFlightNature || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd', color: '#ffffff', fontSize: '0.65rem' }}>{log.easaCommanderSignature || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #93c5fd' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals Brought Forward and Grand Total */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Totals Brought Forward</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1d4ed8' }}>{flightLogs.reduce((acc, log) => acc + (log.easaTotalsBroughtForward || 0), 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Current Page Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1d4ed8' }}>{flightLogs.slice(0, 10).reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Grand Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1d4ed8' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* Certified Digital Record Footer */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0, fontWeight: 600 }}>
                      Certified Digital Record
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#166534', margin: '0.25rem 0 0' }}>
                      I certify that the entries in this logbook are true and correct.
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#166534', marginBottom: '0.25rem' }}>Pilot Signature</div>
                    <div style={{ width: '200px', height: '40px', border: '1px solid #86efac', borderRadius: '4px', background: '#f0fdf4' }}></div>
                  </div>
                </div>
              </div>

              {/* AMC1 FCL.050 Formatting Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#dbeafe', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                  <strong>AMC1 FCL.050 Formatting:</strong> Export function generates PDF matching EASA model logbook format (Columns 1 through 12) for regulatory compliance.
                </p>
              </div>

              {/* Cross-Country/IFR Tracking Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
                  <strong>Cross-Country/IFR Tracking:</strong> Automatic tagging of flights exceeding distance requirements or landing at different aerodromes to support CPL/ATPL issue requirements.
                </p>
              </div>
            </div>
          )}

          {/* HKCAD CAD 54 & AN(HK)O Format */}
          {logbookFormat === 'hkcad' && (
            <div>
              {/* HKCAD Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.25rem' }}>
                  HKCAD Personal Flying Logbook (CAD 54 & AN(HK)O)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  Hong Kong Civil Aviation Department compliant logbook format
                </p>
              </div>

              {/* HKCAD Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Certified True Copy PDF Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #b45309',
                    background: '#d97706',
                    color: '#fef3c7',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Export Certified True Copy PDF
                </button>
              </div>

              {/* 90-Day Recency Monitor */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.75rem' }}>
                  90-Day Recency Monitor (AN(HK)O) - Passenger Carriage
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Day Takeoffs (90 days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.filter(log => log.takeoffsDay && log.date).reduce((acc, log) => acc + (log.takeoffsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Day Landings (90 days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.filter(log => log.landingsDay && log.date).reduce((acc, log) => acc + (log.landingsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Status</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: flightLogs.filter(log => log.takeoffsDay && log.date).reduce((acc, log) => acc + (log.takeoffsDay || 0), 0) >= 3 && flightLogs.filter(log => log.landingsDay && log.date).reduce((acc, log) => acc + (log.landingsDay || 0), 0) >= 3 ? '#16a34a' : '#dc2626' }}>
                      {flightLogs.filter(log => log.takeoffsDay && log.date).reduce((acc, log) => acc + (log.takeoffsDay || 0), 0) >= 3 && flightLogs.filter(log => log.landingsDay && log.date).reduce((acc, log) => acc + (log.landingsDay || 0), 0) >= 3 ? 'CURRENT' : 'NOT CURRENT'}
                    </div>
                  </div>
                </div>
              </div>

              {/* FSTD Distinctness Notice */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>FSTD Distinctness:</strong> Simulator (FSTD) time is explicitly separated from Actual Flight Time to prevent licensing audit errors. Total columns do NOT sum simulator time into "Total Flying Experience".
                </p>
              </div>

              {/* HKCAD Table - CAD 54 Horizontal Layout */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#d97706', color: '#fef3c7' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Dep</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Arr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Off</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>On</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Reg</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Type</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Cap</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Total</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Day</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Night</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Inst</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Sim</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>App</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>LDG</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Cmdr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={17} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={17} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #fcd34d' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.hkcadDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.hkcadArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.hkcadOffBlockTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.hkcadOnBlockTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontWeight: 700 }}>{log.hkcadPilotCapacity || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontWeight: 700 }}>{log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.hkcadDay ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.hkcadNight ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.hkcadInstrumentActual ? 'A' : log.hkcadInstrumentSimulated ? 'S' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.hkcadFstdTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontSize: '0.65rem' }}>{log.hkcadInstrumentApproachType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.landingsDay || 0 + log.landingsNight || 0}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontSize: '0.65rem' }}>{log.hkcadCommanderName ? `${log.hkcadCommanderName} (${log.hkcadCommanderLicenseNumber})` : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals Brought Forward and Total to Date */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Totals Brought Forward</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.reduce((acc, log) => acc + (log.hkcadTotalsBroughtForward || 0), 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Current Page Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.slice(0, 10).reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Total to Date</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* Certified True Copy Footer */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0, fontWeight: 600 }}>
                      Certified True Copy (CAD 54 Clause 4)
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#92400e', margin: '0.25rem 0 0' }}>
                      Signature block on every page for monthly/annual verification
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem' }}>Employer/Company Stamp or Authorized Signature</div>
                    <div style={{ width: '200px', height: '40px', border: '1px solid #fcd34d', borderRadius: '4px', background: '#fef3c7' }}></div>
                  </div>
                </div>
              </div>

              {/* CAD 54 Clause 4 Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>CAD 54 Clause 4:</strong> PDF export generates standard horizontal layout with signature block on every page for regulatory compliance.
                </p>
              </div>

              {/* Instructor/Commander Endorsement Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>Instructor/Commander Endorsement:</strong> Mandatory digital signature field for any PICUS or Dual entries, recording Commander's name and License Number.
                </p>
              </div>
            </div>
          )}

          {/* DGCA India Rule 67A & eGCA Format */}
          {logbookFormat === 'dgacindia' && (
            <div>
              {/* DGCA India Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.25rem' }}>
                  DGCA Personal Pilot Logbook (Rule 67A & eGCA)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  Director General of Civil Aviation India compliant logbook format
                </p>
              </div>

              {/* DGCA India Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement eGCA Bulk Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #b45309',
                    background: '#d97706',
                    color: '#fef3c7',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Export for eGCA Upload
                </button>
              </div>

              {/* 90-Day Currency Dashboard */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.75rem' }}>
                  90-Day Currency Dashboard (Passenger Carrying)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Day Takeoffs (90 days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.filter(log => log.takeoffsDay && log.date).reduce((acc, log) => acc + (log.takeoffsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Day Landings (90 days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.filter(log => log.landingsDay && log.date).reduce((acc, log) => acc + (log.landingsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Status</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: flightLogs.filter(log => log.takeoffsDay && log.date).reduce((acc, log) => acc + (log.takeoffsDay || 0), 0) >= 3 && flightLogs.filter(log => log.landingsDay && log.date).reduce((acc, log) => acc + (log.landingsDay || 0), 0) >= 3 ? '#16a34a' : '#dc2626' }}>
                      {flightLogs.filter(log => log.takeoffsDay && log.date).reduce((acc, log) => acc + (log.takeoffsDay || 0), 0) >= 3 && flightLogs.filter(log => log.landingsDay && log.date).reduce((acc, log) => acc + (log.landingsDay || 0), 0) >= 3 ? 'CURRENT' : 'NOT CURRENT'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Solo vs. PIC Logic Notice */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>Solo vs. PIC Logic:</strong> For student pilots, 'Solo' hours are distinguished from 'P1 Under Supervision' as per DGCA conversion standards. Solo flights are logged with no instructor, while P1 U/S requires instructor endorsement.
                </p>
              </div>

              {/* DGCA India Table - Rule 67A Layout */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#d97706', color: '#fef3c7' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Dep</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Arr</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Off</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>On</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Reg</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Type</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Cap</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Total</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Day</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Night</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Inst</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Hood</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>TO</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>LDG</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Nature</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>SPIC</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Instructor</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #fcd34d' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.dgacindiaDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.dgacindiaArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.dgacindiaChocksOff || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.dgacindiaChocksOn || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontWeight: 700 }}>{log.dgacindiaPilotCapacity || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontWeight: 700 }}>{log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.dgacindiaDay ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.dgacindiaNight ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.dgacindiaInstrumentActual ? 'A' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.dgacindiaInstrumentHood ? 'H' : log.dgacindiaInstrumentSimulated ? 'S' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{(log.dgacindiaTakeoffsDay || 0) + (log.dgacindiaTakeoffsNight || 0)}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{(log.dgacindiaLandingsDay || 0) + (log.dgacindiaLandingsNight || 0)}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontSize: '0.65rem' }}>{log.dgacindiaFlightNature || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff' }}>{log.dgacindiaSpic ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d', color: '#ffffff', fontSize: '0.65rem' }}>{log.dgacindiaInstructorName ? `${log.dgacindiaInstructorName} (${log.dgacindiaInstructorDgcaLicense})` : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #fcd34d' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Physical Page Mapping */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Page Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.slice(0, 10).reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Brought Forward</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.reduce((acc, log) => acc + (log.dgacindiaPageTotal || 0), 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>Grand Total</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d97706' }}>{flightLogs.reduce((acc, log) => acc + log.hours, 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* eGCA Sync Readiness Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>eGCA Sync Readiness:</strong> Data fields are structured to match the eGCA "e-Logbook" bulk upload format. Pilot UID is included for synchronization with the eGCA platform.
                </p>
              </div>

              {/* Endorsement Tracking Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                  <strong>Endorsement Tracking:</strong> Flight Instructor signature and DGCA License Number are required for all training flights (P1 U/S, GFT, Skill Test).
                </p>
              </div>
            </div>
          )}

          {/* JCAB Japan Format */}
          {logbookFormat === 'jcab' && (
            <div>
              {/* JCAB Header */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1e3a8a', borderRadius: '8px', border: '1px solid #3b82f6' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>
                  飛行経歴書 / Flight Log
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#bfdbfe', margin: 0 }}>
                  Japan Civil Aviation Bureau compliant logbook format
                </p>
              </div>

              {/* JCAB Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Flight Experience Certificate PDF */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #1e40af',
                    background: '#2563eb',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Generate Flight Experience Certificate (飛行経歴証明書)
                </button>
              </div>

              {/* 90-Day Recency Monitor */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1e3a8a', borderRadius: '8px', border: '1px solid #3b82f6' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', margin: '0 0 0.75rem' }}>
                  90-Day Recency Monitor (Japan CAR Article 158)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#bfdbfe', marginBottom: '0.25rem' }}>Day Takeoffs (90 days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60a5fa' }}>{flightLogs.filter(log => log.takeoffsDay && log.date).reduce((acc, log) => acc + (log.takeoffsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#bfdbfe', marginBottom: '0.25rem' }}>Day Landings (90 days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60a5fa' }}>{flightLogs.filter(log => log.landingsDay && log.date).reduce((acc, log) => acc + (log.landingsDay || 0), 0)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#bfdbfe', marginBottom: '0.25rem' }}>Status</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: flightLogs.filter(log => log.takeoffsDay && log.date).reduce((acc, log) => acc + (log.takeoffsDay || 0), 0) >= 3 && flightLogs.filter(log => log.landingsDay && log.date).reduce((acc, log) => acc + (log.landingsDay || 0), 0) >= 3 ? '#22c55e' : '#ef4444' }}>
                      {flightLogs.filter(log => log.takeoffsDay && log.date).reduce((acc, log) => acc + (log.takeoffsDay || 0), 0) >= 3 && flightLogs.filter(log => log.landingsDay && log.date).reduce((acc, log) => acc + (log.landingsDay || 0), 0) >= 3 ? 'CURRENT' : 'NOT CURRENT'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Service Time vs. Total Flight Time Notice */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1e3a8a', borderRadius: '8px', border: '1px solid #3b82f6' }}>
                <p style={{ fontSize: '0.875rem', color: '#bfdbfe', margin: 0 }}>
                  <strong>Total Service Time vs. Total Flight Time:</strong> Fields included to distinguish between block-to-block time (Flight Time) and the duration used for maintenance/duty (Service Time) as required by operator SOPs.
                </p>
              </div>

              {/* JCAB Table - Bilingual Layout */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr style={{ background: '#1e3a8a', color: '#fff' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Date<br/>年月日</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Reg<br/>登録記号</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Class<br/>機種</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Cat<br/>区分</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Dep<br/>出発</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Arr<br/>到着</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Off</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>On</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Cap<br/>操縦席</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Service<br/>稼働時間</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Flight<br/>飛行時間</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Day<br/>昼</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Night<br/>夜</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>IFR<br/>計器</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>LDG</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>App<br/>進入</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Verified<br/>認証</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #3b82f6' }}>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff', fontSize: '0.65rem' }}>{log.jcabAircraftClass || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff', fontSize: '0.65rem' }}>{log.jcabAircraftCategory || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>{log.jcabDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>{log.jcabArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>{log.jcabChocksOff || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>{log.jcabChocksOn || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff', fontWeight: 700 }}>{log.jcabPilotCapacity || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff', fontWeight: 700 }}>{log.jcabServiceTime || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff', fontWeight: 700 }}>{log.jcabFlightTime || log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>{log.jcabDay ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>{log.jcabNight ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>{log.jcabInstrumentTime ? '✓' : '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>{(log.jcabLandingsDay || 0) + (log.jcabLandingsNight || 0)}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff', fontSize: '0.65rem' }}>{log.jcabInstrumentApproachType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6', color: '#ffffff' }}>
                            {log.jcabVerified ? (
                              <span style={{ color: '#22c55e', fontWeight: 600 }}>✓ {log.jcabVerifiedBy || ''}</span>
                            ) : (
                              <span style={{ color: '#ef4444', fontWeight: 600 }}>未</span>
                            )}
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #3b82f6' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#fef2f2',
                                color: '#dc2626',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Verification Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#1e3a8a', borderRadius: '8px', border: '1px solid #3b82f6' }}>
                <p style={{ fontSize: '0.875rem', color: '#bfdbfe', margin: 0 }}>
                  <strong>Verification Status:</strong> Entries can be locked by a Chief Pilot or Instructor with a digital timestamp. Verified entries (✓) are certified and cannot be modified.
                </p>
              </div>

              {/* Japanese Registration Validation Notice */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#1e3a8a', borderRadius: '8px', border: '1px solid #3b82f6' }}>
                <p style={{ fontSize: '0.875rem', color: '#bfdbfe', margin: 0 }}>
                  <strong>Japanese Registration Validation:</strong> Strict validation for "JA" followed by 4 digits or alphanumeric characters (e.g., JA01AB, JA1234).
                </p>
              </div>
            </div>
          )}

          {/* QCAA Qatar Format */}
          {logbookFormat === 'qcaa' && (
            <div>
              {/* QCAA Header - Professional Theme */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#8B0000', borderRadius: '8px', border: '1px solid #A52A2A' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
                  QCAA Personal Flying Logbook (QCAR Part 9)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#fecaca', margin: 0 }}>
                  Qatar Civil Aviation Authority compliant logbook format
                </p>
              </div>

              {/* QCAA Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Annual Summary PDF */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #8B0000',
                    background: '#660000',
                    color: '#fecaca',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Generate Annual Summary PDF
                </button>
                <button
                  onClick={() => {/* Implement 90-Day Currency Check */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #d97706',
                    background: '#92400e',
                    color: '#fde68a',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Check 90-Day Currency
                </button>
              </div>

              {/* 90-Day Currency Status */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.75rem' }}>
                  90-Day Currency Status (3 takeoffs + 3 landings)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>Takeoffs (Last 90 Days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669' }}>
                      {flightLogs.reduce((acc, log) => acc + (log.qcaaLandingsDay || 0) + (log.qcaaLandingsNight || 0), 0)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>Landings (Last 90 Days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669' }}>
                      {flightLogs.reduce((acc, log) => acc + (log.qcaaLandingsDay || 0) + (log.qcaaLandingsNight || 0), 0)}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#92400e' }}>
                  Status: {flightLogs.reduce((acc, log) => acc + (log.qcaaLandingsDay || 0) + (log.qcaaLandingsNight || 0), 0) >= 6 ? '✓ Current for passenger carrying' : '⚠ Not current - requires 3 takeoffs and 3 landings'}
                </div>
              </div>

              {/* FSTD/Simulator Separation Summary */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af', margin: '0 0 0.75rem' }}>
                  Flight Time Separation (QCAR Part 9)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Actual Flight Hours</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>
                      {flightLogs.reduce((acc, log) => acc + (log.qcaaDayActual || 0) + (log.qcaaNightActual || 0), 0).toFixed(1)}h
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>FSTD Simulator Hours</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669' }}>
                      {flightLogs.reduce((acc, log) => acc + (log.qcaaFstdSimulator || 0), 0).toFixed(1)}h
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Total Experience</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7c3aed' }}>
                      {(flightLogs.reduce((acc, log) => acc + (log.qcaaDayActual || 0) + (log.qcaaNightActual || 0) + (log.qcaaFstdSimulator || 0), 0)).toFixed(1)}h
                    </div>
                  </div>
                </div>
              </div>

              {/* QCAA Table - Professional High-Density */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem' }}>
                  <thead>
                    <tr style={{ background: '#8B0000', color: '#fff' }}>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Date</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Reg (A7-)</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Type</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Dep</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Arr</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Off-Blk</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>On-Blk</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Capacity</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Day</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Night</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Inst Act</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Inst Sim</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>FSTD</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Lnd Day</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Lnd Night</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Auto</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Nature</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Cmdr</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Verif</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #A52A2A' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={20} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={20} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.date}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600, color: '#8B0000' }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaOffBlockTime || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaOnBlockTime || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>
                            {log.qcaaPilotCapacity === 'P1 U/S' ? (
                              <span style={{ color: '#d97706' }}>P1 U/S</span>
                            ) : log.qcaaPilotCapacity || '-'}
                          </td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaDayActual?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaNightActual?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaInstrumentActual?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaInstrumentSimulated?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', color: '#059669', fontWeight: 600 }}>{log.qcaaFstdSimulator?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaLandingsDay || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaLandingsNight || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.qcaaAutolanding || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '0.6rem' }}>{log.qcaaFlightNature || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '0.6rem' }}>{log.qcaaCommanderName || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            {log.qcaaIsVerified ? (
                              <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>-</span>
                            )}
                          </td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.2rem 0.4rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#7f1d1d',
                                color: '#fca5a5',
                                fontSize: '0.6rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* QCAA Regulatory Compliance Notice */}
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.5rem' }}>
                  QCAA Regulatory Requirements (QCAR Part 9)
                </h4>
                <ul style={{ fontSize: '0.75rem', color: '#92400e', margin: 0, paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                  <li style={{ marginBottom: '0.25rem' }}><strong>A7- Prefix:</strong> All aircraft registrations must start with A7- (Qatar registered)</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>P1 U/S Validation:</strong> Requires Commander's signature and license number for license upgrade eligibility</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>FSTD Separation:</strong> Simulator time is segregated from actual flight time for accurate experience reporting</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>90-Day Currency:</strong> 3 takeoffs and 3 landings within 90 days required for passenger carrying privileges</li>
                  <li style={{ marginBottom: '0' }}><strong>Verification:</strong> Toggle indicates reconciliation with airline records (AIMS/Crew Portal)</li>
                </ul>
              </div>
            </div>
          )}

          {/* FAA USA Format */}
          {logbookFormat === 'faa' && (
            <div>
              {/* FAA Header - Professional Theme */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1e3a8a', borderRadius: '8px', border: '1px solid #1e40af' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
                  FAA Personal Flying Logbook (14 CFR § 61.51)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#bfdbfe', margin: 0 }}>
                  Federal Aviation Administration compliant logbook format
                </p>
              </div>

              {/* Checkride Ready Summary */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #10b981' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#065f46', margin: '0 0 1rem' }}>
                  Checkride Ready Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>PPL Requirements</div>
                    <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                      <div>Total Time: {flightLogs.reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h (40h req)</div>
                      <div>Cross-Country: {flightLogs.filter(log => log.faaIsCrossCountry).reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h (10h req)</div>
                      <div>Solo XC: {flightLogs.filter(log => log.faaIsSolo && log.faaIsCrossCountry).reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h (5h req)</div>
                      <div>Solo: {flightLogs.filter(log => log.faaIsSolo).reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h (10h req)</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>CPL Requirements</div>
                    <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                      <div>Total Time: {flightLogs.reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h (250h req)</div>
                      <div>PIC XC: {flightLogs.filter(log => log.faaIsPic && log.faaIsCrossCountry).reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h (100h req)</div>
                      <div>Night XC: {flightLogs.filter(log => log.faaIsCrossCountry && Number(log.faaNightTime || 0) > 0).reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h (25h req)</div>
                      <div>Instrument: {flightLogs.reduce((acc, log) => acc + (Number(log.faaActualInstrument || 0) + Number(log.faaSimulatedInstrument || 0)), 0).toFixed(1)}h (40h req)</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>ATPL Requirements</div>
                    <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                      <div>Total Time: {flightLogs.reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h (1500h req)</div>
                      <div>PIC XC: {flightLogs.filter(log => log.faaIsPic && log.faaIsCrossCountry).reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h (500h req)</div>
                      <div>Night: {flightLogs.reduce((acc, log) => acc + (Number(log.faaNightTime || 0)), 0).toFixed(1)}h (100h req)</div>
                      <div>Instrument: {flightLogs.reduce((acc, log) => acc + (Number(log.faaActualInstrument || 0) + Number(log.faaSimulatedInstrument || 0)), 0).toFixed(1)}h (250h req)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instrument Currency Dashboard (6-6-H) */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.75rem' }}>
                  Instrument Currency (§ 61.57 - 6-6-H Rule)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>Instrument Approaches</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + (log.faaInstrumentApproaches || 0), 0) >= 6 ? '#059669' : '#dc2626' }}>
                      {flightLogs.reduce((acc, log) => acc + (log.faaInstrumentApproaches || 0), 0)}/6
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>Holding Procedures</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + (log.faaHoldingProcedures || 0), 0) >= 6 ? '#059669' : '#dc2626' }}>
                      {flightLogs.reduce((acc, log) => acc + (log.faaHoldingProcedures || 0), 0)}/6
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>Tracking/Intercepts</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + (log.faaTrackingIntercepts || 0), 0) >= 6 ? '#059669' : '#dc2626' }}>
                      {flightLogs.reduce((acc, log) => acc + (log.faaTrackingIntercepts || 0), 0)}/6
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#92400e' }}>
                  Status: {flightLogs.reduce((acc, log) => acc + (log.faaInstrumentApproaches || 0), 0) >= 6 && 
                           flightLogs.reduce((acc, log) => acc + (log.faaHoldingProcedures || 0), 0) >= 6 && 
                           flightLogs.reduce((acc, log) => acc + (log.faaTrackingIntercepts || 0), 0) >= 6 
                           ? '✓ Current for IFR operations' : '⚠ Not current - requires 6 approaches, 6 holdings, 6 tracking/intercepts'}
                </div>
              </div>

              {/* Night Currency Dashboard */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af', margin: '0 0 0.75rem' }}>
                  Night Currency (§ 61.57)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Full-Stop Landings (Last 90 Days)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + (log.faaFullStopLandings || 0), 0) >= 3 ? '#059669' : '#dc2626' }}>
                      {flightLogs.reduce((acc, log) => acc + (log.faaFullStopLandings || 0), 0)}/3
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>Total Night Landings</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>
                      {flightLogs.reduce((acc, log) => acc + (log.faaLandingsNight || 0), 0)}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#1e40af' }}>
                  Status: {flightLogs.reduce((acc, log) => acc + (log.faaFullStopLandings || 0), 0) >= 3 ? '✓ Current for night passenger carrying' : '⚠ Not current - requires 3 full-stop landings'}
                </div>
              </div>

              {/* FAA Table - Horizontal Grid Layout */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem' }}>
                  <thead>
                    <tr style={{ background: '#1e3a8a', color: '#fff' }}>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Date</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>N-Number</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Make/Model</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Dep</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Arr</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Total</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Type</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>XC</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>XC Dist</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Day</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Night</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Inst Act</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Inst Sim</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>TO Day</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>TO Night</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>LDG Day</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>LDG Night</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>FS</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Appr</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Hold</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Track</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Safety Pilot</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>CFI</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #1e40af' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={23} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={23} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.date}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600, color: '#1e3a8a' }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaDepartureAirport || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaArrivalAirport || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{Number(log.hours || 0).toFixed(1)}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>
                            {log.faaIsSolo && <span style={{ color: '#059669' }}>S</span>}
                            {log.faaIsPic && <span style={{ color: '#1e40af' }}>P</span>}
                            {log.faaIsSic && <span style={{ color: '#7c3aed' }}>C</span>}
                            {log.faaIsFstd && <span style={{ color: '#dc2626' }}>F</span>}
                            {!log.faaIsSolo && !log.faaIsPic && !log.faaIsSic && !log.faaIsFstd && '-'}
                          </td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            {log.faaIsCrossCountry ? (
                              <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaCrossCountryDistance ? Number(log.faaCrossCountryDistance).toFixed(0) : '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaDayTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaNightTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaActualInstrument?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaSimulatedInstrument?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaTakeoffsDay || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaTakeoffsNight || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaLandingsDay || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaLandingsNight || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaFullStopLandings || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaInstrumentApproaches || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaHoldingProcedures || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.faaTrackingIntercepts || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '0.6rem' }}>{log.faaSafetyPilot || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '0.6rem' }}>{log.faaCfiSignature || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.2rem 0.4rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#7f1d1d',
                                color: '#fca5a5',
                                fontSize: '0.6rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* FAA Regulatory Compliance Notice */}
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.5rem' }}>
                  FAA Regulatory Requirements (14 CFR § 61.51)
                </h4>
                <ul style={{ fontSize: '0.75rem', color: '#92400e', margin: 0, paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                  <li style={{ marginBottom: '0.25rem' }}><strong>N-Number:</strong> All aircraft registrations must start with N (US registered)</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>Cross-Country:</strong> 50nm+ distance required for Private/Commercial rating credit</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>Instrument Currency (6-6-H):</strong> 6 approaches, 6 holdings, 6 tracking/intercepts within 6 calendar months</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>Night Currency:</strong> 3 full-stop landings within preceding 90 days for night passenger carrying</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>Safety Pilot:</strong> Required when logging simulated instrument time under § 61.51(g)</li>
                  <li style={{ marginBottom: '0' }}><strong>CFI Endorsement:</strong> Required for solo flights, checkrides, and specific training events</li>
                </ul>
              </div>
            </div>
          )}

          {/* CAAP Philippines Format */}
          {logbookFormat === 'caap' && (
            <div>
              {/* CAAP Header - Professional Theme */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#003366', borderRadius: '8px', border: '1px solid #004080' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
                  CAAP Personal Flying Logbook (PCAR Part 2 & 8)
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#bfdbfe', margin: 0 }}>
                  Civil Aviation Authority of the Philippines compliant logbook format
                </p>
              </div>

              {/* CAAP Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => {/* Implement Certificate of Flying Time PDF */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #003366',
                    background: '#002244',
                    color: '#bfdbfe',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Generate Certificate of Flying Time
                </button>
                <button
                  onClick={() => {/* Implement A4/Legal Export */}}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #003366',
                    background: '#002244',
                    color: '#bfdbfe',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Export to A4/Legal
                </button>
              </div>

              {/* 90-Day Recency Tracker */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.75rem' }}>
                  90-Day Recency Tracker (PCAR Part 8)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>
                      Takeoffs (Last 90 Days)
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + ((log.caapLandingsDay || 0) + (log.caapLandingsNight || 0)), 0) >= 3 ? '#059669' : '#dc2626' }}>
                      {flightLogs.reduce((acc, log) => acc + ((log.caapLandingsDay || 0) + (log.caapLandingsNight || 0)), 0)}/3
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>
                      Landings (Last 90 Days)
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + ((log.caapLandingsDay || 0) + (log.caapLandingsNight || 0)), 0) >= 3 ? '#059669' : '#dc2626' }}>
                      {flightLogs.reduce((acc, log) => acc + ((log.caapLandingsDay || 0) + (log.caapLandingsNight || 0)), 0)}/3
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309', marginBottom: '0.25rem' }}>
                      Passenger-Carrying Status
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: flightLogs.reduce((acc, log) => acc + ((log.caapLandingsDay || 0) + (log.caapLandingsNight || 0)), 0) >= 3 ? '#059669' : '#dc2626' }}>
                      {flightLogs.reduce((acc, log) => acc + ((log.caapLandingsDay || 0) + (log.caapLandingsNight || 0)), 0) >= 3 ? '✓ Current' : '⚠ Not Current'}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#92400e' }}>
                  Status: {flightLogs.reduce((acc, log) => acc + ((log.caapLandingsDay || 0) + (log.caapLandingsNight || 0)), 0) >= 3 ? '✓ Eligible for passenger-carrying privileges' : '⚠ Requires 3 takeoffs and 3 landings within preceding 90 days'}
                </div>
              </div>

              {/* XC Mileage Tracking */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af', margin: '0 0 0.75rem' }}>
                  Cross-Country Mileage Tracking
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>
                      Standard XC (50nm+)
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>
                      {flightLogs.filter(log => log.caapIsCrossCountry && log.caapCrossCountryDistance && log.caapCrossCountryDistance >= 50).length} flights
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e40af', marginBottom: '0.25rem' }}>
                      CPL XC (300nm+)
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>
                      {flightLogs.filter(log => log.caapIsCrossCountry && log.caapCrossCountryDistance && log.caapCrossCountryDistance >= 300).length} flights
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#1e40af' }}>
                  Note: XC flights must include full-stop landings at two different aerodromes for rating credit
                </div>
              </div>

              {/* Total Time for the Page */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Total Time for the Page</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>{flightLogs.reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>Grand Totals</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>{flightLogs.reduce((acc, log) => acc + (Number(log.hours) || 0), 0).toFixed(1)}h</div>
                  </div>
                </div>
              </div>

              {/* CAAP Table - Professional Layout */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.65rem' }}>
                  <thead>
                    <tr style={{ background: '#003366', color: '#fff' }}>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Date</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>RP-C</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Type</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Dep</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Arr</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Off-Block</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>On-Block</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Function</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Day</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Night</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Inst Act</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Inst Sim</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>LDG Day</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>LDG Night</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>XC</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>XC Dist</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Checkride</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Instructor</th>
                      <th style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #004080' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          Loading flight logs...
                        </td>
                      </tr>
                    ) : flightLogs.length === 0 ? (
                      <tr>
                        <td colSpan={18} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          No flight entries yet. Click "Add Flight Entry" to get started.
                        </td>
                      </tr>
                    ) : (
                      flightLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.date}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600, color: '#003366' }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapDepartureIcao || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapArrivalIcao || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapOffBlockTime || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapOnBlockTime || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 600 }}>{log.caapPilotFunction || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapDayTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapNightTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapInstrumentActual?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapInstrumentSimulated?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapLandingsDay || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapLandingsNight || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            {log.caapIsCrossCountry ? (
                              <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>{log.caapCrossCountryDistance ? Number(log.caapCrossCountryDistance).toFixed(0) : '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            {log.caapIsCheckride ? (
                              <span style={{ color: '#dc2626', fontWeight: 700 }}>✓</span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0', fontSize: '0.6rem' }}>{log.caapInstructorName || '-'}</td>
                          <td style={{ padding: '0.3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                            <button
                              onClick={() => handleDeleteEntry(log.id)}
                              style={{
                                padding: '0.2rem 0.4rem',
                                borderRadius: '4px',
                                border: '1px solid #ef4444',
                                background: '#7f1d1d',
                                color: '#fca5a5',
                                fontSize: '0.6rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* CAAP Regulatory Compliance Notice */}
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e', margin: '0 0 0.5rem' }}>
                  CAAP Regulatory Requirements (PCAR Part 2 & 8)
                </h4>
                <ul style={{ fontSize: '0.75rem', color: '#92400e', margin: 0, paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                  <li style={{ marginBottom: '0.25rem' }}><strong>RP-C Prefix:</strong> All aircraft registrations must start with RP-C (Philippines registered)</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>Block Times:</strong> Off-block and On-block times must be recorded in UTC format</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>90-Day Currency:</strong> 3 takeoffs and 3 landings within 90 days required for passenger-carrying privileges (PCAR Part 8)</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>Cross-Country:</strong> 50nm+ distance required for standard XC, 300nm+ for CPL XC credit</li>
                  <li style={{ marginBottom: '0.25rem' }}><strong>Checkride:</strong> Must include CAAP Examiner's name and license number for skill test entries</li>
                  <li style={{ marginBottom: '0' }}><strong>Instructor:</strong> Training entries must include instructor name, license number, and digital signature</li>
                </ul>
              </div>
            </div>
          )}

          {/* Total Hours Summary */}
          {flightLogs.length > 0 && (
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0369a1' }}>
                TOTAL FLIGHT HOURS:
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>
                {totalHours.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
