import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../src/lib/supabase';

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
}

export const DigitalLogbookPage: React.FC<DigitalLogbookPageProps> = ({ onBack, userProfile }) => {
  const [flightLogs, setFlightLogs] = useState<FlightLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
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
    passengerLandingsNight: ''
  });
  const [logbookFormat, setLogbookFormat] = useState<'standard' | 'compact' | 'detailed' | 'timeline' | 'anac' | 'casa' | 'brazil' | 'cae' | 'qcaa' | 'tcca'>('standard');

  useEffect(() => {
    fetchFlightLogs();
  }, [userProfile?.id, userProfile?.uid]);

  const fetchFlightLogs = async () => {
    const userId = userProfile?.id || userProfile?.uid;
    if (!userId) {
      console.log('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pilot_flight_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      const entries: FlightLogEntry[] = (data || []).map((log) => ({
        id: log.id,
        date: log.date,
        aircraftType: log.aircraft_type || log.aircraft || '',
        registration: log.registration || '',
        route: log.route || '',
        category: log.category || '',
        hours: Number(log.hours) || 0,
        remarks: log.remarks || ''
      }));

      setFlightLogs(entries);
    } catch (error) {
      console.error('Error fetching flight logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    const userId = userProfile?.id || userProfile?.uid;
    console.log('=== Save Entry Debug Info ===');
    console.log('userProfile:', userProfile);
    console.log('userProfile type:', typeof userProfile);
    console.log('userProfile keys:', userProfile ? Object.keys(userProfile) : 'null');
    console.log('userProfile.id:', userProfile?.id);
    console.log('userProfile.uid:', userProfile?.uid);
    console.log('formData:', formData);
    console.log('============================');
    
    if (!userId) {
      console.error('No user ID found - userProfile is:', userProfile);
      alert(`User not authenticated. Debug info: ${JSON.stringify({
        hasUserProfile: !!userProfile,
        userProfileType: typeof userProfile,
        userProfileKeys: userProfile ? Object.keys(userProfile) : null,
        hasId: !!userProfile?.id,
        hasUid: !!userProfile?.uid
      })}`);
      return;
    }
    
    try {
      const { error } = await supabase.from('pilot_flight_logs').insert({
        user_id: userId,
        date: formData.date,
        aircraft_type: formData.aircraftType,
        registration: formData.registration,
        route: formData.route,
        category: formData.category || 'flight',
        hours: parseFloat(formData.hours),
        remarks: formData.remarks,
        created_at: new Date().toISOString()
      });

      if (error) {
        throw error;
      }

      alert('Flight entry saved successfully!');
      setFormData({
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
        passengerLandingsNight: ''
      });
      setShowAddForm(false);
      fetchFlightLogs();
    } catch (error) {
      console.error('Error adding flight log:', error);
      alert(`Failed to add flight entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    const userId = userProfile?.id || userProfile?.uid;
    if (!userId) return;
    if (!confirm('Are you sure you want to delete this flight entry?')) return;

    try {
      const { error } = await supabase
        .from('pilot_flight_logs')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      fetchFlightLogs();
    } catch (error) {
      console.error('Error deleting flight log:', error);
      alert('Failed to delete flight entry');
    }
  };

  const totalHours = flightLogs.reduce((sum, log) => sum + log.hours, 0);

  return (
    <div style={{ backgroundColor: '#eef4fb', minHeight: '100vh', paddingBottom: '4rem' }}>
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
          background: 'linear-gradient(180deg, #fff 0%, #f0f4fb 100%)',
          borderRadius: '20px',
          position: 'relative',
          textAlign: 'center',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
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
            <img src="/logo.png" alt="WingMentor Logo" style={{ height: '72px', width: 'auto' }} />
          </div>
          <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            PILOT RECOGNITION PROFILE
          </p>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0', color: '#0f172a', fontWeight: 600 }}>
            Digital Logbook
          </h1>
        </header>

        {/* Main Content Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
          border: '1px solid rgba(226,232,240,0.9)'
        }}>
          {/* Title Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                Digital Logbook
              </h2>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                VERIFIED FLIGHT RECORD REGISTRY
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
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
                {showAddForm ? 'CANCEL' : 'ADD FLIGHT ENTRY'}
              </button>
              <select
                value={logbookFormat}
                onChange={(e) => setLogbookFormat(e.target.value as any)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#0f172a',
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
              </select>
            </div>
          </div>

          {/* Add Entry Form */}
          {showAddForm && (
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
                {logbookFormat === 'anac' ? 'New Flight Entry - ANAC Format' : 'New Flight Entry'}
              </h3>
              
              {/* Standard Form Fields */}
              {logbookFormat !== 'anac' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Aircraft Type *
                    </label>
                    <input
                      type="text"
                      value={formData.aircraftType}
                      onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                      placeholder="e.g., C172"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Registration
                    </label>
                    <input
                      type="text"
                      value={formData.registration}
                      onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                      placeholder="e.g., rpc1885"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Route
                    </label>
                    <input
                      type="text"
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      placeholder="e.g., klax"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., DUAL"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Hours *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      placeholder="e.g., 20.0"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="e.g., flight"
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
              )}

              {/* ANAC Form Fields */}
              {logbookFormat === 'anac' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Matrícula (LV-XXX) *
                    </label>
                    <input
                      type="text"
                      value={formData.registration}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^(LV-|LQ-)?[A-Z0-9]*$/.test(value)) {
                          setFormData({ ...formData, registration: value });
                        }
                      }}
                      placeholder="LV-ABC"
                      maxLength={7}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Tipo Aeronave *
                    </label>
                    <input
                      type="text"
                      value={formData.aircraftType}
                      onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                      placeholder="C172"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Aeródromo Salida (ICAO)
                    </label>
                    <input
                      type="text"
                      value={formData.departureAerodrome}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^[A-Z]{0,4}$/.test(value)) {
                          setFormData({ ...formData, departureAerodrome: value });
                        }
                      }}
                      placeholder="SABE"
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Hora Salida
                    </label>
                    <input
                      type="time"
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Aeródromo Llegada (ICAO)
                    </label>
                    <input
                      type="text"
                      value={formData.arrivalAerodrome}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^[A-Z]{0,4}$/.test(value)) {
                          setFormData({ ...formData, arrivalAerodrome: value });
                        }
                      }}
                      placeholder="SABE"
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Hora Llegada
                    </label>
                    <input
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Formato Hora
                    </label>
                    <select
                      value={formData.timeFormat}
                      onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value as 'UTC' | 'Local' })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="UTC">UTC</option>
                      <option value="Local">Local</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Total Horas *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      placeholder="2.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Horas Día
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.dayHours}
                      onChange={(e) => setFormData({ ...formData, dayHours: e.target.value })}
                      placeholder="1.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Horas Noche
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.nightHours}
                      onChange={(e) => setFormData({ ...formData, nightHours: e.target.value })}
                      placeholder="0.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Horas IFR
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.ifrHours}
                      onChange={(e) => setFormData({ ...formData, ifrHours: e.target.value })}
                      placeholder="0.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Multi-Motor
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.multiEngineHours}
                      onChange={(e) => setFormData({ ...formData, multiEngineHours: e.target.value })}
                      placeholder="0.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Función Tripulación
                    </label>
                    <select
                      value={formData.crewFunction}
                      onChange={(e) => setFormData({ ...formData, crewFunction: e.target.value as 'PIC' | 'Copilot' | 'Dual' })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="PIC">PIC</option>
                      <option value="Copilot">Copilot</option>
                      <option value="Dual">Dual Instruction</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Despegues Día
                    </label>
                    <input
                      type="number"
                      value={formData.takeoffsDay}
                      onChange={(e) => setFormData({ ...formData, takeoffsDay: e.target.value })}
                      placeholder="1"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Despegues Noche
                    </label>
                    <input
                      type="number"
                      value={formData.takeoffsNight}
                      onChange={(e) => setFormData({ ...formData, takeoffsNight: e.target.value })}
                      placeholder="0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Aterrizajes Día
                    </label>
                    <input
                      type="number"
                      value={formData.landingsDay}
                      onChange={(e) => setFormData({ ...formData, landingsDay: e.target.value })}
                      placeholder="1"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Aterrizajes Noche
                    </label>
                    <input
                      type="number"
                      value={formData.landingsNight}
                      onChange={(e) => setFormData({ ...formData, landingsNight: e.target.value })}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Observaciones
                    </label>
                    <input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Flight remarks"
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
              )}

              {/* CASA Form Fields */}
              {logbookFormat === 'casa' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      A/C Type *
                    </label>
                    <input
                      type="text"
                      value={formData.aircraftType}
                      onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                      placeholder="C172"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Engine Type
                    </label>
                    <select
                      value={formData.engineType}
                      onChange={(e) => setFormData({ ...formData, engineType: e.target.value as 'Single' | 'Multi' })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Multi">Multi</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Registration (VH-) *
                    </label>
                    <input
                      type="text"
                      value={formData.registration}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^(VH-)?[A-Z0-9]*$/.test(value)) {
                          setFormData({ ...formData, registration: value });
                        }
                      }}
                      placeholder="VH-ABC"
                      maxLength={6}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Takeoff Point
                    </label>
                    <input
                      type="text"
                      value={formData.takeoffPoint}
                      onChange={(e) => setFormData({ ...formData, takeoffPoint: e.target.value })}
                      placeholder="YSSY"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Landing Point
                    </label>
                    <input
                      type="text"
                      value={formData.landingPoint}
                      onChange={(e) => setFormData({ ...formData, landingPoint: e.target.value })}
                      placeholder="YMML"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      PIC Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.picHours}
                      onChange={(e) => setFormData({ ...formData, picHours: e.target.value })}
                      placeholder="1.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Co-pilot Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.copilotHours}
                      onChange={(e) => setFormData({ ...formData, copilotHours: e.target.value })}
                      placeholder="0.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      PICUS Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.picusHours}
                      onChange={(e) => setFormData({ ...formData, picusHours: e.target.value })}
                      placeholder="0.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Training Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.trainingHours}
                      onChange={(e) => setFormData({ ...formData, trainingHours: e.target.value })}
                      placeholder="0.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Day Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.dayCasaHours}
                      onChange={(e) => setFormData({ ...formData, dayCasaHours: e.target.value })}
                      placeholder="1.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Night Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.nightCasaHours}
                      onChange={(e) => setFormData({ ...formData, nightCasaHours: e.target.value })}
                      placeholder="0.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      IFR Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.instrumentFlightHours}
                      onChange={(e) => setFormData({ ...formData, instrumentFlightHours: e.target.value })}
                      placeholder="0.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Instrument Approach
                    </label>
                    <input
                      type="text"
                      value={formData.instrumentApproachType}
                      onChange={(e) => setFormData({ ...formData, instrumentApproachType: e.target.value })}
                      placeholder="ILS/VOR"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Instructor Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.instructorCasaHours}
                      onChange={(e) => setFormData({ ...formData, instructorCasaHours: e.target.value })}
                      placeholder="0.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Examiner Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.examinerHours}
                      onChange={(e) => setFormData({ ...formData, examinerHours: e.target.value })}
                      placeholder="0.0"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Remarks
                    </label>
                    <input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Flight remarks"
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
              )}

              {/* Brazil ANAC Form Fields */}
              {logbookFormat === 'brazil' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Data *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Matrícula (PP-/PT-/PR-/PS-/PU-) *
                    </label>
                    <input
                      type="text"
                      value={formData.registration}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^(PP-|PT-|PR-|PS-|PU-)?[A-Z0-9]*$/.test(value)) {
                          setFormData({ ...formData, registration: value });
                        }
                      }}
                      placeholder="PP-ABC"
                      maxLength={7}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Modelo *
                    </label>
                    <input
                      type="text"
                      value={formData.aircraftType}
                      onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                      placeholder="C172"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Natureza do Voo
                    </label>
                    <select
                      value={formData.natureOfFlight}
                      onChange={(e) => setFormData({ ...formData, natureOfFlight: e.target.value as 'Private' | 'Instruction' | 'Commercial' })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Private">Privada</option>
                      <option value="Instruction">Instrução</option>
                      <option value="Commercial">Comercial</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Saída (ICAO)
                    </label>
                    <input
                      type="text"
                      value={formData.brazilDepartureIcao}
                      onChange={(e) => setFormData({ ...formData, brazilDepartureIcao: e.target.value.toUpperCase() })}
                      placeholder="SBSP"
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Hora Saída (UTC)
                    </label>
                    <input
                      type="time"
                      value={formData.blockTimeDeparture}
                      onChange={(e) => setFormData({ ...formData, blockTimeDeparture: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Chegada (ICAO)
                    </label>
                    <input
                      type="text"
                      value={formData.brazilArrivalIcao}
                      onChange={(e) => setFormData({ ...formData, brazilArrivalIcao: e.target.value.toUpperCase() })}
                      placeholder="SBGR"
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Hora Chegada (UTC)
                    </label>
                    <input
                      type="time"
                      value={formData.blockTimeArrival}
                      onChange={(e) => setFormData({ ...formData, blockTimeArrival: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Função do Piloto
                    </label>
                    <select
                      value={formData.pilotFunctionBrazil}
                      onChange={(e) => setFormData({ ...formData, pilotFunctionBrazil: e.target.value as 'PIC' | 'SIC' | 'Dual' })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="PIC">Piloto em Comando</option>
                      <option value="SIC">Copiloto</option>
                      <option value="Dual">Instrução Recebida</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Horas Totais *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                      placeholder="2.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Condições
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        <input
                          type="checkbox"
                          checked={formData.conditionDay}
                          onChange={(e) => setFormData({ ...formData, conditionDay: e.target.checked })}
                          style={{ marginRight: '0.25rem' }}
                        />
                        Diurno
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        <input
                          type="checkbox"
                          checked={formData.conditionNight}
                          onChange={(e) => setFormData({ ...formData, conditionNight: e.target.checked })}
                          style={{ marginRight: '0.25rem' }}
                        />
                        Noturno
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        <input
                          type="checkbox"
                          checked={formData.conditionIFR}
                          onChange={(e) => setFormData({ ...formData, conditionIFR: e.target.checked })}
                          style={{ marginRight: '0.25rem' }}
                        />
                        IFR
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        <input
                          type="checkbox"
                          checked={formData.conditionHood}
                          onChange={(e) => setFormData({ ...formData, conditionHood: e.target.checked })}
                          style={{ marginRight: '0.25rem' }}
                        />
                        Capota
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Decolagens
                    </label>
                    <input
                      type="number"
                      value={formData.takeoffsBrazil}
                      onChange={(e) => setFormData({ ...formData, takeoffsBrazil: e.target.value })}
                      placeholder="1"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Pouso
                    </label>
                    <input
                      type="number"
                      value={formData.landingsBrazil}
                      onChange={(e) => setFormData({ ...formData, landingsBrazil: e.target.value })}
                      placeholder="1"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Observações
                    </label>
                    <input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Flight remarks"
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
              )}

              {/* QCAA Form Fields */}
              {logbookFormat === 'qcaa' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Flight Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Aircraft Registration (A7-)*
                    </label>
                    <input
                      type="text"
                      value={formData.registration}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^(A7-)?[A-Z0-9]*$/.test(value)) {
                          setFormData({ ...formData, registration: value });
                        }
                      }}
                      placeholder="A7-ABC"
                      maxLength={6}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        borderColor: formData.registration && !formData.registration.startsWith('A7-') ? '#ef4444' : '#cbd5e1'
                      }}
                    />
                    {formData.registration && !formData.registration.startsWith('A7-') && (
                      <div style={{ fontSize: '0.65rem', color: '#ef4444', marginTop: '0.25rem' }}>
                        Must start with A7-
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Aircraft Type/Variant *
                    </label>
                    <input
                      type="text"
                      value={formData.aircraftType}
                      onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                      placeholder="A320-200"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Departure ICAO *
                    </label>
                    <input
                      type="text"
                      value={formData.qcaaDepartureIcao}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^[A-Z]{0,4}$/.test(value)) {
                          setFormData({ ...formData, qcaaDepartureIcao: value });
                        }
                      }}
                      placeholder="OTHH"
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Arrival ICAO *
                    </label>
                    <input
                      type="text"
                      value={formData.qcaaArrivalIcao}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^[A-Z]{0,4}$/.test(value)) {
                          setFormData({ ...formData, qcaaArrivalIcao: value });
                        }
                      }}
                      placeholder="OTHH"
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Off-Block Time (UTC)
                    </label>
                    <input
                      type="time"
                      value={formData.qcaaOffBlockTime}
                      onChange={(e) => setFormData({ ...formData, qcaaOffBlockTime: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      On-Block Time (UTC)
                    </label>
                    <input
                      type="time"
                      value={formData.qcaaOnBlockTime}
                      onChange={(e) => setFormData({ ...formData, qcaaOnBlockTime: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Pilot Capacity *
                    </label>
                    <select
                      value={formData.qcaaPilotCapacity}
                      onChange={(e) => setFormData({ ...formData, qcaaPilotCapacity: e.target.value as 'P1' | 'P2' | 'P1 U/S' })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="P1">P1 (PIC)</option>
                      <option value="P2">P2 (Copilot)</option>
                      <option value="P1 U/S">P1 U/S (PIC Under Supervision)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Day Actual
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.qcaaDayActual}
                      onChange={(e) => setFormData({ ...formData, qcaaDayActual: e.target.value })}
                      placeholder="1.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Night Actual
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.qcaaNightActual}
                      onChange={(e) => setFormData({ ...formData, qcaaNightActual: e.target.value })}
                      placeholder="0.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Instrument Actual
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.qcaaInstrumentActual}
                      onChange={(e) => setFormData({ ...formData, qcaaInstrumentActual: e.target.value })}
                      placeholder="0.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Instrument Simulated
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.qcaaInstrumentSimulated}
                      onChange={(e) => setFormData({ ...formData, qcaaInstrumentSimulated: e.target.value })}
                      placeholder="0.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      FSTD Simulator
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.qcaaFstdSimulator}
                      onChange={(e) => setFormData({ ...formData, qcaaFstdSimulator: e.target.value })}
                      placeholder="0.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Landings Day
                    </label>
                    <input
                      type="number"
                      value={formData.qcaaLandingsDay}
                      onChange={(e) => setFormData({ ...formData, qcaaLandingsDay: e.target.value })}
                      placeholder="1"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Landings Night
                    </label>
                    <input
                      type="number"
                      value={formData.qcaaLandingsNight}
                      onChange={(e) => setFormData({ ...formData, qcaaLandingsNight: e.target.value })}
                      placeholder="0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Autolanding
                    </label>
                    <input
                      type="number"
                      value={formData.qcaaAutolanding}
                      onChange={(e) => setFormData({ ...formData, qcaaAutolanding: e.target.value })}
                      placeholder="0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Flight Nature
                    </label>
                    <select
                      value={formData.qcaaFlightNature}
                      onChange={(e) => setFormData({ ...formData, qcaaFlightNature: e.target.value as 'Scheduled' | 'Training' | 'Check' | 'Positioning' | 'Test' | 'Other' })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Training">Training</option>
                      <option value="Check">Check</option>
                      <option value="Positioning">Positioning</option>
                      <option value="Test">Test</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Commander Name
                    </label>
                    <input
                      type="text"
                      value={formData.qcaaCommanderName}
                      onChange={(e) => setFormData({ ...formData, qcaaCommanderName: e.target.value })}
                      placeholder="Capt. Name"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Commander License
                    </label>
                    <input
                      type="text"
                      value={formData.qcaaCommanderLicense}
                      onChange={(e) => setFormData({ ...formData, qcaaCommanderLicense: e.target.value })}
                      placeholder="QCAA-XXXXX"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  {formData.qcaaPilotCapacity === 'P1 U/S' && (
                    <div style={{ gridColumn: '1 / -1', padding: '0.75rem', background: '#fef3c7', borderRadius: '6px', border: '1px solid #f59e0b' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', margin: '0 0 0.5rem' }}>
                        ⚠️ P1 U/S Entry Requirements
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>
                            Commander License Number *
                          </label>
                          <input
                            type="text"
                            value={formData.qcaaCommanderLicense}
                            onChange={(e) => setFormData({ ...formData, qcaaCommanderLicense: e.target.value })}
                            placeholder="QCAA-XXXXX"
                            required
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #f59e0b',
                              borderRadius: '6px',
                              fontSize: '0.875rem'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#92400e', marginBottom: '0.25rem' }}>
                            Commander Signature *
                          </label>
                          <input
                            type="text"
                            value={formData.qcaaCommanderSignature}
                            onChange={(e) => setFormData({ ...formData, qcaaCommanderSignature: e.target.value })}
                            placeholder="Digital signature required"
                            required
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #f59e0b',
                              borderRadius: '6px',
                              fontSize: '0.875rem'
                            }}
                          />
                        </div>
                      </div>
                      <p style={{ fontSize: '0.65rem', color: '#92400e', margin: '0.5rem 0 0' }}>
                        P1 U/S entries require Commander's signature and license number for QCAA license upgrade validation.
                      </p>
                    </div>
                  )}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Remarks
                    </label>
                    <input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Flight remarks"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                      <input
                        type="checkbox"
                        checked={formData.qcaaIsVerified}
                        onChange={(e) => setFormData({ ...formData, qcaaIsVerified: e.target.checked })}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Verified with Airline Records (AIMS/Crew Portal)
                    </label>
                    {formData.qcaaIsVerified && (
                      <input
                        type="text"
                        value={formData.qcaaVerificationSource}
                        onChange={(e) => setFormData({ ...formData, qcaaVerificationSource: e.target.value })}
                        placeholder="Verification source (e.g., AIMS, Crew Portal)"
                        style={{
                          width: '100%',
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          border: '1px solid #10b981',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          background: '#f0fdf4'
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* CAE Training Form Fields */}
              {logbookFormat === 'cae' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Session Date *
                    </label>
                    <input
                      type="date"
                      value={formData.sessionDate}
                      onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Simulator Type
                    </label>
                    <input
                      type="text"
                      value={formData.simulatorType}
                      onChange={(e) => setFormData({ ...formData, simulatorType: e.target.value })}
                      placeholder="Level D FFS"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      FSTD ID
                    </label>
                    <input
                      type="text"
                      value={formData.fstdId}
                      onChange={(e) => setFormData({ ...formData, fstdId: e.target.value })}
                      placeholder="FFS-001"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Lesson/Event Code
                    </label>
                    <select
                      value={formData.lessonEventCode}
                      onChange={(e) => setFormData({ ...formData, lessonEventCode: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="CTP">CTP</option>
                      <option value="Type_Rating">Type Rating</option>
                      <option value="Recurrent">Recurrent</option>
                      <option value="Checkride">Checkride</option>
                      <option value="Prof_Check">Proficiency Check</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      FSTD Time (hrs) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.fstdTime}
                      onChange={(e) => setFormData({ ...formData, fstdTime: e.target.value })}
                      placeholder="2.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Instructor Name *
                    </label>
                    <input
                      type="text"
                      value={formData.instructorName}
                      onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
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
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Certificate Number *
                    </label>
                    <input
                      type="text"
                      value={formData.instructorCertificate}
                      onChange={(e) => setFormData({ ...formData, instructorCertificate: e.target.value })}
                      placeholder="Cert #"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Digital Signature
                    </label>
                    <input
                      type="text"
                      value={formData.caeInstructorSignature}
                      onChange={(e) => setFormData({ ...formData, caeInstructorSignature: e.target.value })}
                      placeholder="Signature"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      eGrading
                    </label>
                    <select
                      value={formData.eGrading}
                      onChange={(e) => setFormData({ ...formData, eGrading: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="S">Satisfactory</option>
                      <option value="U">Unsatisfactory</option>
                      <option value="I">Incomplete</option>
                      <option value="X">Exceeds</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Competency Level
                    </label>
                    <select
                      value={formData.competencyLevel}
                      onChange={(e) => setFormData({ ...formData, competencyLevel: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Level_1">Level 1</option>
                      <option value="Level_2">Level 2</option>
                      <option value="Level_3">Level 3</option>
                      <option value="Level_4">Level 4</option>
                      <option value="Level_5">Level 5</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      <input
                        type="checkbox"
                        checked={formData.isTrainingSession}
                        onChange={(e) => setFormData({ ...formData, isTrainingSession: e.target.checked })}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Mark as Training Session (excludes from Actual Flight Hours total)
                    </label>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Remarks
                    </label>
                    <input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Training session remarks"
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
              )}

              {/* TCCA Canada Form Fields */}
              {logbookFormat === 'tcca' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Aircraft Registration *
                    </label>
                    <input
                      type="text"
                      value={formData.registration}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (/^(C-[FGI])?[A-Z0-9]*$/.test(value)) {
                          setFormData({ ...formData, registration: value });
                        }
                      }}
                      placeholder="C-FXXX"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Aircraft Type *
                    </label>
                    <input
                      type="text"
                      value={formData.aircraftType}
                      onChange={(e) => setFormData({ ...formData, aircraftType: e.target.value })}
                      placeholder="e.g., C172"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Flight Category *
                    </label>
                    <select
                      value={formData.flightCategory}
                      onChange={(e) => setFormData({ ...formData, flightCategory: e.target.value as any })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Private">Private</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Flight_Test">Flight Test</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Pilot Function *
                    </label>
                    <select
                      value={formData.pilotFunctionTcca}
                      onChange={(e) => setFormData({ ...formData, pilotFunctionTcca: e.target.value as any })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="">Select</option>
                      <option value="PIC">PIC</option>
                      <option value="SIC">SIC</option>
                      <option value="Dual_Received">Dual Received</option>
                      <option value="Dual_Given">Dual Given</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Air Time (hrs) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.airTime}
                      onChange={(e) => {
                        const airTime = parseFloat(e.target.value) || 0;
                        setFormData({ ...formData, airTime: e.target.value, flightTimeBlock: (airTime + 0.2).toFixed(1) });
                      }}
                      placeholder="1.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Flight Time (block) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.flightTimeBlock}
                      onChange={(e) => setFormData({ ...formData, flightTimeBlock: e.target.value })}
                      placeholder="1.7"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Day Hours *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.dayHours}
                      onChange={(e) => setFormData({ ...formData, dayHours: e.target.value })}
                      placeholder="1.0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Night Hours
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.nightHours}
                      onChange={(e) => setFormData({ ...formData, nightHours: e.target.value })}
                      placeholder="0.5"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Instrument Time
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        <input
                          type="checkbox"
                          checked={formData.instrumentActual}
                          onChange={(e) => setFormData({ ...formData, instrumentActual: e.target.checked, instrumentHood: false })}
                          style={{ marginRight: '0.25rem' }}
                        />
                        Actual
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        <input
                          type="checkbox"
                          checked={formData.instrumentHood}
                          onChange={(e) => setFormData({ ...formData, instrumentHood: e.target.checked, instrumentActual: false })}
                          style={{ marginRight: '0.25rem' }}
                        />
                        Hood
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Flight Crew Name
                    </label>
                    <input
                      type="text"
                      value={formData.flightCrewName}
                      onChange={(e) => setFormData({ ...formData, flightCrewName: e.target.value })}
                      placeholder="Other pilot/instructor"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Takeoffs - Day
                    </label>
                    <input
                      type="number"
                      value={formData.takeoffsDay}
                      onChange={(e) => setFormData({ ...formData, takeoffsDay: e.target.value })}
                      placeholder="1"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Takeoffs - Night
                    </label>
                    <input
                      type="number"
                      value={formData.takeoffsNight}
                      onChange={(e) => setFormData({ ...formData, takeoffsNight: e.target.value })}
                      placeholder="0"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Landings - Day
                    </label>
                    <input
                      type="number"
                      value={formData.landingsDay}
                      onChange={(e) => setFormData({ ...formData, landingsDay: e.target.value })}
                      placeholder="1"
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
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Landings - Night
                    </label>
                    <input
                      type="number"
                      value={formData.landingsNight}
                      onChange={(e) => setFormData({ ...formData, landingsNight: e.target.value })}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                      Remarks
                    </label>
                    <input
                      type="text"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      placeholder="Flight remarks"
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
              )}
              <button
                onClick={handleAddEntry}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 2rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: '#10b981',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Save Entry
              </button>
            </div>
          )}

          {/* Table - Standard Format */}
          {logbookFormat === 'standard' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
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
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>
                          {log.date}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0ea5e9', fontWeight: 600 }}>
                          {log.aircraftType}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                          {log.registration || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a' }}>
                          {log.route || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>
                          {log.category || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                          {log.remarks || '-'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#0f172a', textAlign: 'right' }}>
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
                  <div key={log.id} style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>{log.date}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{log.aircraftType}</div>
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
                  <div key={log.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>{log.date}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{log.aircraftType}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>{log.hours.toFixed(1)}h</div>
                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>{log.category || '-'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Registration</div>
                        <div style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>{log.registration || '-'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Route</div>
                        <div style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>{log.route || '-'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Description</div>
                        <div style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>{log.remarks || '-'}</div>
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
                    <div key={log.id} style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>{log.date}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{log.aircraftType}</div>
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
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a' }}>{log.date}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a', fontWeight: 600 }}>{log.registration || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a' }}>{log.aircraftType || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a' }}>{log.flightCategory || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a' }}>{log.pilotFunctionTcca || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a' }}>{log.airTime?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a', fontWeight: 700 }}>{log.flightTimeBlock?.toFixed(1) || log.hours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a' }}>{log.dayHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a' }}>{log.nightHours?.toFixed(1) || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a' }}>{log.instrumentActual ? 'A' : (log.instrumentHood ? 'H' : '-')}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #22c55e', color: '#0f172a' }}>{log.flightCrewName || '-'}</td>
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

          {/* Total Hours Summary */}
          {flightLogs.length > 0 && (
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#f0f9ff',
              borderRadius: '12px',
              border: '1px solid #bae6fd',
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
  );
};
