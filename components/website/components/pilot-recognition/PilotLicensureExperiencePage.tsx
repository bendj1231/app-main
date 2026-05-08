import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../../../../src/lib/supabase';
import { useAuth } from '@/src/contexts/AuthContext';
import { Search, HelpCircle, ChevronRight, Check, Upload, FileText, X, Lock, Scan, Shield, Clock, FileDigit, Loader2 } from 'lucide-react';

interface UploadedDoc {
  id: string;
  type: 'license' | 'medical' | 'rating' | 'logbook';
  fileName: string;
  fileSize: number;
  status: 'uploading' | 'processing' | 'verified' | 'pending_review';
  extractedData?: {
    licenseNumber?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    medicalClass?: string;
  };
}

interface PilotLicensureExperiencePageProps {
  onBack: () => void;
  userProfile?: {
    id?: string;
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
}

interface JobExperience {
  id: string;
  company: string;
  position: string;
  fromDate: string;
  toDate: string;
  description: string;
}

interface AircraftRating {
  id: string;
  aircraftType: string;
  ratingDate: string;
  isCurrent: boolean;
}

const OCCUPATION_OPTIONS = [
  { value: 'employed', label: 'Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'open_to_changes', label: 'Open to Changes' },
  { value: 'looking_for_new_opportunities', label: 'Looking for New Opportunities' }
];

const LICENSE_TYPES = [
  'PPL',
  'CPL',
  'SPL',
  'CFI',
  'IR',
  'ME',
  'ATPL',
  'ATPL Frozen'
];

const MEDICAL_CLASSES = [
  'Class 1',
  'Class 2',
  'Class 3'
];

const COMMON_AIRCRAFT = [
  'Airbus A320', 'Airbus A330', 'Airbus A350', 'Airbus A380',
  'Boeing 737', 'Boeing 747', 'Boeing 757', 'Boeing 767', 'Boeing 777', 'Boeing 787',
  'Embraer E170/E175', 'Embraer E190/E195',
  'Bombardier CRJ200/700/900',
  'ATR 42/72',
  'Cessna 172', 'Cessna 208', 'Cessna Citation',
  'Piper PA-28', 'Piper PA-34',
  'Diamond DA40', 'Diamond DA42',
  'Beechcraft King Air',
  'Other'
];

const LANGUAGES = [
  'English', 'Arabic', 'French', 'Spanish', 'German', 'Italian', 'Portuguese',
  'Russian', 'Chinese (Mandarin)', 'Japanese', 'Hindi', 'Urdu', 'Turkish',
  'Other'
];

const NATIONALITIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada',
  'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia',
  'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia',
  'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece',
  'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Madagascar', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand',
  'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Paraguay',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain',
  'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
  'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
  'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const ENGLISH_PROFICIENCY_LEVELS = [
  'Level 1 - Pre-Elementary',
  'Level 2 - Elementary',
  'Level 3 - Pre-Operational',
  'Level 4 - Operational',
  'Level 5 - Extended',
  'Level 6 - Expert'
];

const SLATE = {
  50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
  400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a'
};

const EMERALD = '#10b981';
const CORPORATE_BLUE = '#003366';

// Monospace font for data fields
const MONO_FONT = "'JetBrains Mono', 'SF Mono', 'Menlo', monospace";;

// Aviation Pathways Options
const AVIATION_PATHWAYS_OPTIONS = [
  'Commercial Aviation (Airlines)',
  'Cargo Aviation',
  'Business Aviation / Private Jets',
  'Flight Instruction',
  'Agricultural Aviation',
  'Emergency Medical Services (Air Ambulance)',
  'Search and Rescue',
  'Firefighting Aviation',
  'Aerial Photography / Surveying',
  'Flight Testing',
  'Military Aviation',
  'Government / Civil Aviation Authority',
  'Aviation Management',
  'Aircraft Maintenance',
  'Aviation Safety & Investigation',
  'Unmanned Aerial Systems (Drones)',
  'Helicopter Operations',
  'Seaplane Operations',
  'Aerobatics / Airshow Flying',
  'Gliding / Soaring'
];

// Pilot Job Positions Options
const PILOT_JOB_POSITIONS_OPTIONS = [
  'Student Pilot',
  'Private Pilot',
  'Commercial Pilot',
  'First Officer (FO)',
  'Senior First Officer (SFO)',
  'Captain',
  'Check Airman / Examiner',
  'Type Rating Instructor',
  'Simulator Instructor',
  'Ground School Instructor',
  'Chief Pilot',
  'Director of Operations',
  'Flight Operations Manager',
  'Corporate Pilot',
  'Charter Pilot',
  'Cargo Pilot',
  'Helicopter Pilot',
  'Agricultural Pilot',
  'Flight Test Pilot',
  'Airshow / Display Pilot',
  'Military Pilot',
  'Flight Dispatcher',
  'Aviation Consultant'
];

export const PilotLicensureExperiencePage: React.FC<PilotLicensureExperiencePageProps> = ({ 
  onBack, 
  userProfile: userProfileProp 
}) => {
  // Get auth context as fallback when accessed directly via URL
  const { currentUser, userProfile: authUserProfile } = useAuth();
  
  // Use prop if provided (nested navigation), otherwise use auth context (direct URL access)
  const userProfile = userProfileProp || authUserProfile || (currentUser ? {
    id: currentUser.id,
    uid: currentUser.uid,
    email: currentUser.email,
    firstName: authUserProfile?.first_name || '',
    lastName: authUserProfile?.last_name || ''
  } : null);
  // Personal Info State
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  
  // Auto-generated full legal name
  const fullLegalName = useMemo(() => {
    const parts = [firstName, middleName, lastName].filter(Boolean);
    return parts.join(' ');
  }, [firstName, middleName, lastName]);
  
  // Search states for dropdowns
  const [countrySearch, setCountrySearch] = useState('');
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [flightSchoolSearch, setFlightSchoolSearch] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [residingCountry, setResidingCountry] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [flightSchoolAddress, setFlightSchoolAddress] = useState('');
  const [languages, setLanguages] = useState('');
  
  // License Info State
  const [currentLicenses, setCurrentLicenses] = useState<string[]>([]);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [licenseCountryOfIssue, setLicenseCountryOfIssue] = useState('');
  
  // Medical Certificate State
  const [medicalExpiry, setMedicalExpiry] = useState('');
  const [medicalCountry, setMedicalCountry] = useState('');
  const [medicalClass, setMedicalClass] = useState('');
  
  // Radio License State
  const [radioLicenseExpiry, setRadioLicenseExpiry] = useState('');
  
  // Aircraft Ratings State
  const [aircraftRatings, setAircraftRatings] = useState<AircraftRating[]>([]);
  
  // Job Experience State
  const [jobExperiences, setJobExperiences] = useState<JobExperience[]>([]);
  
  // Current Occupation State
  const [currentOccupation, setCurrentOccupation] = useState('');
  const [currentEmployer, setCurrentEmployer] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');
  
  // Additional Info State
  const [countriesVisited, setCountriesVisited] = useState('');
  const [favoriteAircraft, setFavoriteAircraft] = useState('');
  const [whyBecomePilot, setWhyBecomePilot] = useState('');
  const [otherSkills, setOtherSkills] = useState('');
  const [englishProficiency, setEnglishProficiency] = useState('');
  
  // Pilot Interests State
  const [aviationPathwaysInterests, setAviationPathwaysInterests] = useState<string[]>([]);
  const [pilotJobPositionsInterests, setPilotJobPositionsInterests] = useState<string[]>([]);
  const [programInterests, setProgramInterests] = useState<string[]>([]);
  const [insightInterests, setInsightInterests] = useState<string[]>([]);
  
  // Form State
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 4;
  
  // Review mode state
  const [isReviewMode, setIsReviewMode] = useState(false);
  
  // Auto-save state
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Document upload state
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<'license' | 'medical' | 'rating' | null>(null);
  
  // Filtered options based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return NATIONALITIES;
    return NATIONALITIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));
  }, [countrySearch]);
  
  const filteredNationalities = useMemo(() => {
    if (!nationalitySearch) return NATIONALITIES;
    return NATIONALITIES.filter(n => n.toLowerCase().includes(nationalitySearch.toLowerCase()));
  }, [nationalitySearch]);

  // Separate effect to handle minimum display time for loading screen
  useEffect(() => {
    // Always show loading for at least 1 second when component mounts
    const timer = setTimeout(() => {
      if (dataLoaded || !userProfile?.uid) {
        // Hide loader if data is loaded OR if no userProfile after timeout
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [dataLoaded, userProfile?.id]);

  // Load existing data from Supabase
  useEffect(() => {
    const loadExistingData = async () => {
      console.log('PilotLicensureExperiencePage - userProfile:', userProfile);
      const userId = userProfile?.id || userProfile?.uid;
      console.log('PilotLicensureExperiencePage - userId:', userId);
      if (!userId) {
        console.log('No userProfile id available, skipping data load');
        setDataLoaded(true); // Mark as loaded so loader hides
        return;
      }

      try {
        // First, fetch from profiles table (account creation data)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, display_name, phone, country, date_of_birth, email, onboarding_responses, nationality, flight_school_address, license_id, program_interests, pathway_interests, insight_interests')
          .eq('id', userId)
          .single();

        // Set initial values from profiles (if available)
        let initialData: any = {};
        
        if (profileError) {
          console.log('❌ No profile data found:', profileError);
        } else if (profileData) {
          console.log('✅ Profile data loaded:', profileData);
          console.log('✅ Profile nationality:', profileData.nationality);
          console.log('✅ Profile country:', profileData.country);
          console.log('✅ Profile flight_school_address:', profileData.flight_school_address);
          console.log('✅ Profile phone:', profileData.phone);
          console.log('✅ Profile license_id:', profileData.license_id);
          
          // Extract from onboarding_responses JSONB as fallback
          const onboarding = profileData.onboarding_responses || {};
          
          // Handle empty strings as well as null/undefined
          const hasValue = (val: any) => val && val.trim && val.trim() !== '';
          
          initialData = {
            fullLegalName: hasValue(profileData.full_name) ? profileData.full_name : (hasValue(onboarding.full_name) ? onboarding.full_name : ''),
            contactNumber: hasValue(profileData.phone) ? profileData.phone : (hasValue(onboarding.phone) ? onboarding.phone : ''),
            residingCountry: hasValue(profileData.country) ? profileData.country : (hasValue(onboarding.country) ? onboarding.country : ''),
            dateOfBirth: hasValue(profileData.date_of_birth) ? profileData.date_of_birth : (hasValue(onboarding.date_of_birth) ? onboarding.date_of_birth : ''),
            nationality: hasValue(profileData.nationality) ? profileData.nationality : (hasValue(onboarding.nationality) ? onboarding.nationality : ''),
            flightSchoolAddress: hasValue(profileData.flight_school_address) ? profileData.flight_school_address : (hasValue(onboarding.flight_school_address) ? onboarding.flight_school_address : ''),
            licenseNumber: hasValue(profileData.license_id) ? profileData.license_id : (hasValue(onboarding.license_id) ? onboarding.license_id : '')
          };
          
          // Parse display_name into first/last name (check for empty string)
          if (hasValue(profileData.display_name)) {
            const nameParts = profileData.display_name.split(' ');
            initialData.firstName = nameParts[0] || '';
            initialData.lastName = nameParts.slice(1).join(' ') || '';
          } else if (hasValue(onboarding.first_name) || hasValue(onboarding.last_name)) {
            initialData.firstName = onboarding.first_name || '';
            initialData.lastName = onboarding.last_name || '';
          } else if (profileData.email) {
            // Fallback: parse email prefix as name
            const emailPrefix = profileData.email.split('@')[0];
            // Parse benjamintigerbowler -> Benjamin Tiger Bowler
            // or john.doe -> John Doe
            const cleanName = emailPrefix
              .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
              .replace(/([0-9])/g, ' ') // Remove numbers
              .replace(/[._-]/g, ' ') // Replace separators with space
              .replace(/\s+/g, ' ') // Collapse multiple spaces
              .trim();
            
            if (cleanName) {
              const nameParts = cleanName.split(' ').filter((p: string) => p.length > 0);
              if (nameParts.length >= 2) {
                // Capitalize each part
                initialData.firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
                initialData.lastName = nameParts.slice(1).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
              } else if (nameParts.length === 1) {
                initialData.firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
                initialData.lastName = '';
              }
            }
          }
        }

        // Then, fetch from pilot_licensure_experience table
        const { data, error } = await supabase
          .from('pilot_licensure_experience')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        // Also fetch from pilot_profiles for flight hours and license data
        const { data: pilotProfileData, error: pilotProfileError } = await supabase
          .from('pilot_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (pilotProfileError) {
          console.log('No pilot profile data found:', pilotProfileError);
        } else if (pilotProfileData) {
          console.log('Pilot profile data loaded:', pilotProfileData);
        }

        if (error) {
          console.log('❌ No existing licensure data found:', error);
          console.log('⚠️ Will use profile data as fallback');
          // Only use profile data as fallback if we haven't already set the values
          if (!firstName) setFirstName(initialData.firstName || userProfile?.firstName || '');
          if (!lastName) setLastName(initialData.lastName || userProfile?.lastName || '');
          if (!contactNumber) setContactNumber(initialData.contactNumber || '');
          if (!residingCountry) setResidingCountry(initialData.residingCountry || '');
          if (!dateOfBirth) setDateOfBirth(initialData.dateOfBirth || '');
        } else if (data) {
          console.log('✅ Licensure data loaded:', data);
          console.log('✅ Licensure nationality:', data.nationality);
          console.log('✅ Licensure residing_country:', data.residing_country);
          console.log('✅ Licensure flight_school_address:', data.flight_school_address);
          console.log('✅ Licensure contact_number:', data.contact_number);
          console.log('✅ Licensure license_number:', data.license_number);
          console.log('✅ Licensure aviation_pathways_interests:', data.aviation_pathways_interests);
          console.log('✅ Licensure pilot_job_positions_interests:', data.pilot_job_positions_interests);
          console.log('✅ Licensure program_interests:', data.program_interests);
          console.log('✅ Licensure insight_interests:', data.insight_interests);
          // Personal Info - use licensure data if available, fallback to profiles
          setFirstName(data.first_name || initialData.firstName || userProfile?.firstName || '');
          setMiddleName(data.middle_name || '');
          setLastName(data.last_name || initialData.lastName || userProfile?.lastName || '');
          setDateOfBirth(data.date_of_birth || initialData.dateOfBirth || '');
          setNationality(data.nationality || initialData.nationality || '');
          setResidingCountry(data.residing_country || initialData.residingCountry || '');
          setContactNumber(data.contact_number || initialData.contactNumber || '');
          setFlightSchoolAddress(data.flight_school_address || initialData.flightSchoolAddress || '');
          setLanguages(data.languages || '');
          setEnglishProficiency(data.english_proficiency || '');

          // License Info
          setCurrentLicenses(data.current_license || []);
          setLicenseNumber(data.license_number || initialData.licenseNumber || '');
          setLicenseExpiry(data.license_expiry || '');
          setLicenseCountryOfIssue(data.license_country_of_issue || '');

          // Medical Info
          setMedicalExpiry(data.medical_expiry || '');
          setMedicalCountry(data.medical_country || '');
          setMedicalClass(data.medical_class || '');
          setRadioLicenseExpiry(data.radio_license_expiry || '');

          // Aircraft Ratings
          setAircraftRatings(data.aircraft_ratings || []);

          // Job Experiences
          setJobExperiences(data.job_experiences || []);

          // Current Occupation
          setCurrentOccupation(data.current_occupation || '');
          setCurrentEmployer(data.current_employer || '');
          setCurrentPosition(data.current_position || '');

          // Pilot Interests
          setCountriesVisited(data.countries_visited?.toString() || '');
          setFavoriteAircraft(data.favorite_aircraft || '');
          setWhyBecomePilot(data.why_become_pilot || '');
          setOtherSkills(data.other_skills || '');
          setAviationPathwaysInterests(data.aviation_pathways_interests || []);
          setPilotJobPositionsInterests(data.pilot_job_positions_interests || []);
          setProgramInterests(data.program_interests || initialData.programInterests || []);
          setInsightInterests(data.insight_interests || initialData.insightInterests || []);
        }
        
        // Apply all profile data fallbacks if no licensure data was found
        if (!data) {
          console.log('⚠️ No licensure data, using profile fallbacks');
          console.log('⚠️ initialData:', initialData);
          setFirstName(initialData.firstName || '');
          setLastName(initialData.lastName || '');
          setContactNumber(initialData.contactNumber || '');
          setResidingCountry(initialData.residingCountry || '');
          setDateOfBirth(initialData.dateOfBirth || '');
          setNationality(initialData.nationality || '');
          setFlightSchoolAddress(initialData.flightSchoolAddress || '');
          setLicenseNumber(initialData.licenseNumber || '');
          setProgramInterests(initialData.programInterests || []);
          setAviationPathwaysInterests(initialData.pathwayInterests || []);
          setInsightInterests(initialData.insightInterests || []);
        }
        
        // Mark data as loaded - the separate effect will handle hiding the loader after min time
        setDataLoaded(true);
        setLastSaved(new Date());
        
      } catch (error) {
        console.error('Error loading data:', error);
        setDataLoaded(true); // Still mark as loaded to hide loader
      }
    };

    loadExistingData();
  }, [userProfile?.uid]);

  // Add new job experience
  const addJobExperience = () => {
    const newJob: JobExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      fromDate: '',
      toDate: '',
      description: ''
    };
    setJobExperiences([...jobExperiences, newJob]);
  };

  // Update job experience
  const updateJobExperience = (id: string, field: keyof JobExperience, value: string) => {
    setJobExperiences(jobExperiences.map(job => 
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  // Remove job experience
  const removeJobExperience = (id: string) => {
    setJobExperiences(jobExperiences.filter(job => job.id !== id));
  };

  // Add aircraft rating
  const addAircraftRating = () => {
    const newRating: AircraftRating = {
      id: Date.now().toString(),
      aircraftType: '',
      ratingDate: '',
      isCurrent: true
    };
    setAircraftRatings([...aircraftRatings, newRating]);
  };

  // Update aircraft rating
  const updateAircraftRating = (id: string, field: keyof AircraftRating, value: string | boolean) => {
    setAircraftRatings(aircraftRatings.map(rating => 
      rating.id === id ? { ...rating, [field]: value } : rating
    ));
  };

  // Remove aircraft rating
  const removeAircraftRating = (id: string) => {
    setAircraftRatings(aircraftRatings.filter(rating => rating.id !== id));
  };

  // Toggle license selection with hierarchical logic
  const toggleLicense = (license: string) => {
    const hierarchy = ['PPL', 'CPL', 'ATPL Frozen', 'ATPL'];
    const ratings = ['SPL', 'CFI', 'IR', 'ME'];
    
    if (currentLicenses.includes(license)) {
      // If deselecting a main license, deselect all higher licenses too
      if (hierarchy.includes(license)) {
        const licenseIndex = hierarchy.indexOf(license);
        const toRemove = hierarchy.slice(licenseIndex);
        setCurrentLicenses(currentLicenses.filter(l => !toRemove.includes(l)));
      } else {
        // Just remove the rating
        setCurrentLicenses(currentLicenses.filter(l => l !== license));
      }
    } else {
      // If selecting a main license, auto-select all lower licenses
      if (hierarchy.includes(license)) {
        const licenseIndex = hierarchy.indexOf(license);
        const lowerLicenses = hierarchy.slice(0, licenseIndex + 1);
        const newLicenses = [...new Set([...currentLicenses, ...lowerLicenses])];
        setCurrentLicenses(newLicenses);
      } else {
        // Just add the rating
        setCurrentLicenses([...currentLicenses, license]);
      }
    }
  };
  
  // Document upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, docType: 'license' | 'medical' | 'rating') => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0], docType);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, docType: 'license' | 'medical' | 'rating') => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, docType);
    }
  };

  const processFile = (file: File, docType: 'license' | 'medical' | 'rating') => {
    const newDoc: UploadedDoc = {
      id: Date.now().toString(),
      type: docType,
      fileName: file.name,
      fileSize: file.size,
      status: 'uploading'
    };

    setUploadedDocs(prev => [...prev, newDoc]);

    // Simulate upload progress
    setTimeout(() => {
      setUploadedDocs(prev => 
        prev.map(doc => 
          doc.id === newDoc.id 
            ? { ...doc, status: 'processing' }
            : doc
        )
      );
    }, 1500);

    // Simulate OCR extraction
    setTimeout(() => {
      const detectedMedicalClass = Math.random() > 0.5 ? 'Class 1' : 'Class 2';
      
      setUploadedDocs(prev => 
        prev.map(doc => 
          doc.id === newDoc.id 
            ? { 
                ...doc, 
                status: 'pending_review',
                extractedData: {
                  licenseNumber: docType === 'license' ? 'CPL-' + Math.floor(Math.random() * 100000) : undefined,
                  expiryDate: docType === 'license' ? '2025-12-31' : undefined,
                  issuingAuthority: docType === 'license' ? 'CAA' : undefined,
                  medicalClass: docType === 'medical' ? detectedMedicalClass : undefined
                }
              }
            : doc
        )
      );
      
      // Auto-detect medical class from OCR and update form
      if (docType === 'medical') {
        setMedicalClass(detectedMedicalClass);
      }
    }, 3500);
  };

  const removeDocument = (docId: string) => {
    setUploadedDocs(prev => prev.filter(doc => doc.id !== docId));
  };

  const getDocsByType = (type: 'license' | 'medical' | 'rating') => {
    return uploadedDocs.filter(doc => doc.type === type);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Check if date is expired
  const isDateExpired = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  };

  // Toggle aviation pathway interest
  const toggleAviationPathway = (pathway: string) => {
    if (aviationPathwaysInterests.includes(pathway)) {
      setAviationPathwaysInterests(aviationPathwaysInterests.filter(p => p !== pathway));
    } else {
      setAviationPathwaysInterests([...aviationPathwaysInterests, pathway]);
    }
  };

  // Toggle pilot job position interest
  const togglePilotJobPosition = (position: string) => {
    if (pilotJobPositionsInterests.includes(position)) {
      setPilotJobPositionsInterests(pilotJobPositionsInterests.filter(p => p !== position));
    } else {
      setPilotJobPositionsInterests([...pilotJobPositionsInterests, position]);
    }
  };

  // Save all data to Supabase
  const handleSave = async () => {
    const userId = userProfile?.id || userProfile?.uid;
    if (!userId) {
      setSaveMessage('Please log in to save your data');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const data = {
        user_id: userId,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        nationality,
        languages,
        current_license: currentLicenses,
        license_number: licenseNumber,
        license_expiry: licenseExpiry,
        license_country_of_issue: licenseCountryOfIssue,
        medical_expiry: medicalExpiry,
        medical_country: medicalCountry,
        medical_class: medicalClass,
        radio_license_expiry: radioLicenseExpiry,
        aircraft_ratings: aircraftRatings,
        job_experiences: jobExperiences,
        current_occupation: currentOccupation,
        current_employer: currentEmployer,
        current_position: currentPosition,
        full_legal_name: fullLegalName,
        flight_school_address: flightSchoolAddress,
        residing_country: residingCountry,
        contact_number: contactNumber,
        countries_visited: countriesVisited ? parseInt(countriesVisited, 10) : null,
        favorite_aircraft: favoriteAircraft,
        why_become_pilot: whyBecomePilot,
        other_skills: otherSkills,
        aviation_pathways_interests: aviationPathwaysInterests,
        pilot_job_positions_interests: pilotJobPositionsInterests,
        english_proficiency: englishProficiency,
        updated_at: new Date().toISOString()
      };

      console.log('Saving data to pilot_licensure_experience:', data);
      
      const { error } = await supabase
        .from('pilot_licensure_experience')
        .upsert(data, { onConflict: 'user_id' });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Also sync with profiles table for consistency
      if (userId) {
        const profileUpdateData: any = {
          full_name: fullLegalName,
          phone: contactNumber,
          country: residingCountry,
          date_of_birth: dateOfBirth,
          nationality: nationality,
          flight_school_address: flightSchoolAddress,
          license_id: licenseNumber,
          country_of_license: licenseCountryOfIssue,
          aircraft_rated_on: aircraftRatings?.length > 0 ? aircraftRatings[0].aircraftType : '',
          experience_description: whyBecomePilot,
          ratings: currentLicenses,
          program_interests: aviationPathwaysInterests,
          pathway_interests: aviationPathwaysInterests,
          insight_interests: pilotJobPositionsInterests,
          // Medical information
          medical_expiry: medicalExpiry,
          medical_country: medicalCountry,
          medical_class: medicalClass,
          radio_license_expiry: radioLicenseExpiry,
          license_expiry: licenseExpiry,
          updated_at: new Date().toISOString()
        };

        console.log('Syncing data to profiles table:', profileUpdateData);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdateData)
          .eq('id', userId);

        if (profileError) {
          console.error('Profile sync error (non-critical):', profileError);
          // Non-critical: main data is saved to pilot_licensure_experience
        } else {
          console.log('✅ Data synced to profiles table');
        }
      }
      
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);

      setSaveMessage('Data saved successfully!');
    } catch (error: any) {
      console.error('Error saving data:', error);
      const errorMessage = error?.message || error?.error_details || error?.hint || 'Unknown error';
      setSaveMessage(`Error saving data: ${errorMessage}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)' }}>
      {/* Loading Screen */}
      {isLoading ? (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(1.1); }
            }
          `}</style>
          <p style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: '#475569', fontWeight: 500 }}>
            Loading your profile...
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
            Please wait while we fetch your information
          </p>
        </div>
      ) : (
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative' }}>
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#475569',
              fontWeight: 500
            }}
          >
            ← Back to Dashboard
          </button>
          
          <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', marginTop: '1rem' }}>
            Pilot Recognition Profile
          </p>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0', color: '#0f172a', fontWeight: 600 }}>
            Pilot Licensure & Experience Data Entry
          </h1>
          <p style={{ marginTop: '1rem', color: '#64748b', maxWidth: '600px', margin: '1rem auto' }}>
            This information will be visible to aviation industry manufacturers and airlines who will see your current state, qualifications, and experience.
          </p>
        </header>

        {/* Progress Stepper */}
        <div style={{ marginBottom: '2rem', background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {[
              { step: 1, label: 'Personal Info' },
              { step: 2, label: 'License Info' },
              { step: 3, label: 'Medical & Ratings' },
              { step: 4, label: 'Experience' }
            ].map((item, index) => (
              <React.Fragment key={item.step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: currentStep === item.step ? '#dc2626' : currentStep > item.step ? '#10b981' : '#e5e7eb',
                    color: currentStep >= item.step ? 'white' : '#6b7280',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    border: `2px solid ${currentStep === item.step ? '#dc2626' : currentStep > item.step ? '#10b981' : '#d1d5db'}`
                  }}>
                    {currentStep > item.step ? <Check style={{ width: '20px', height: '20px' }} /> : item.step}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: currentStep === item.step ? 600 : 500,
                    color: currentStep === item.step ? '#dc2626' : currentStep > item.step ? '#10b981' : '#6b7280'
                  }}>
                    {item.label}
                  </span>
                </div>
                {index < 3 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    background: currentStep > item.step ? '#10b981' : '#9ca3af',
                    marginTop: '-20px'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div style={{
            background: saveMessage.includes('success') ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${saveMessage.includes('success') ? '#86efac' : '#fca5a5'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
            color: saveMessage.includes('success') ? '#166534' : '#991b1b'
          }}>
            {saveMessage}
          </div>
        )}

        {/* Personal Information Section */}
        <section style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '2rem', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            Personal Information
          </h2>
          
          {/* Two Column Layout for Personal Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Middle Name
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter middle name (optional)"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter last name"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Date of Birth *
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Row 3: Country + Contact */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Residing Country *
                <button
                  onMouseEnter={() => setActiveTooltip('country')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'help' }}
                >
                  <HelpCircle style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                </button>
                {activeTooltip === 'country' && (
                  <span style={{ position: 'absolute', bottom: '100%', left: 0, background: '#1f2937', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 20 }}>
                    Used for timezone and regulatory jurisdiction matching
                  </span>
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={residingCountry || countrySearch}
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setShowCountryDropdown(true);
                  }}
                  onFocus={() => setShowCountryDropdown(true)}
                  placeholder="Search country..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                />
                <Search style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
              </div>
              {showCountryDropdown && filteredCountries.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '200px', overflowY: 'auto', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  {filteredCountries.slice(0, 8).map(country => (
                    <button
                      key={country}
                      onClick={() => {
                        setResidingCountry(country);
                        setCountrySearch('');
                        setShowCountryDropdown(false);
                      }}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', textAlign: 'left', border: 'none', background: residingCountry === country ? '#eff6ff' : 'white', color: '#374151', fontSize: '0.875rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                    >
                      {country}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Nationality *
                <button
                  onMouseEnter={() => setActiveTooltip('nationality')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'help' }}
                >
                  <HelpCircle style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                </button>
                {activeTooltip === 'nationality' && (
                  <span style={{ position: 'absolute', bottom: '100%', left: 0, background: '#1f2937', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 20 }}>
                    Required for visa and work permit processing
                  </span>
                )}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={nationality || nationalitySearch}
                  onChange={(e) => {
                    setNationalitySearch(e.target.value);
                    setShowNationalityDropdown(true);
                  }}
                  onFocus={() => setShowNationalityDropdown(true)}
                  placeholder="Search nationality..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onBlur={() => setTimeout(() => setShowNationalityDropdown(false), 200)}
                />
                <Search style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
              </div>
              {showNationalityDropdown && filteredNationalities.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, maxHeight: '200px', overflowY: 'auto', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  {filteredNationalities.slice(0, 8).map(nat => (
                    <button
                      key={nat}
                      onClick={() => {
                        setNationality(nat);
                        setNationalitySearch('');
                        setShowNationalityDropdown(false);
                      }}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', textAlign: 'left', border: 'none', background: nationality === nat ? '#eff6ff' : 'white', color: '#374151', fontSize: '0.875rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                    >
                      {nat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Row 4: Flight School Search - Full Width */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Flight School Search
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 400, fontStyle: 'italic' }}>(Google Places API - Coming Soon)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={flightSchoolAddress}
                onChange={(e) => setFlightSchoolSearch(e.target.value)}
                placeholder="Search flight school (e.g., 'WCC Aviation', 'CAE Oxford')..."
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <Search style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              Auto-completes address, ICAO code, and school details
            </p>
          </div>

          {/* Row 5: Contact + Languages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Contact Number *
                <button
                  onMouseEnter={() => setActiveTooltip('contact')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'help' }}
                >
                  <HelpCircle style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                </button>
                {activeTooltip === 'contact' && (
                  <span style={{ position: 'absolute', bottom: '100%', left: 0, background: '#1f2937', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 20 }}>
                    Used by recruiters for urgent interview scheduling
                  </span>
                )}
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Languages You Speak *
              </label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g. English, Arabic, French"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#dc2626';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                Enter languages separated by commas
              </p>
            </div>
          </div>

          {/* English Proficiency */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              English Proficiency Level *
            </label>
            <select
              value={englishProficiency}
              onChange={(e) => setEnglishProficiency(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                background: 'white'
              }}
            >
              <option value="">Select proficiency level</option>
              {ENGLISH_PROFICIENCY_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              ICAO English Language Proficiency Rating
            </p>
          </div>
        </section>

        {/* License Information Section - Terminal Style */}
        <section style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: `1px solid ${SLATE[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${SLATE[200]}` }}>
            <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: SLATE[800], letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              License Information
            </h2>
          </div>
          
          {/* Pilot Licenses - Multi Select */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
              Current License(s) Held *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {LICENSE_TYPES.map(license => (
                <button
                  key={license}
                  onClick={() => toggleLicense(license)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: currentLicenses.includes(license) ? '#2563eb' : '#d1d5db',
                    background: currentLicenses.includes(license) ? '#2563eb' : 'white',
                    color: currentLicenses.includes(license) ? 'white' : '#374151',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  {license}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                License Number
                <button
                  onMouseEnter={() => setActiveTooltip('license')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'help' }}
                >
                  <HelpCircle style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                </button>
                {activeTooltip === 'license' && (
                  <span style={{ position: 'absolute', bottom: '100%', left: 0, background: '#1f2937', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 20 }}>
                    Enter your license number from your physical certificate
                  </span>
                )}
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${SLATE[300]}`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontFamily: MONO_FONT,
                  letterSpacing: '0.025em',
                  outline: 'none',
                  transition: 'all 0.15s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = CORPORATE_BLUE;
                  e.currentTarget.style.boxShadow = `0 0 0 2px rgba(0, 51, 102, 0.1)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = SLATE[300];
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="e.g., CPL-2024-001234"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                License Country of Issue
              </label>
              <select
                value={licenseCountryOfIssue}
                onChange={(e) => setLicenseCountryOfIssue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
              >
                <option value="">Select country of issue</option>
                {NATIONALITIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                License Expiration Date *
                {isDateExpired(licenseExpiry) && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 500 }}>(Expired)</span>
                )}
              </label>
              <input
                type="date"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${isDateExpired(licenseExpiry) ? '#ef4444' : SLATE[300]}`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontFamily: MONO_FONT,
                  outline: 'none',
                  transition: 'all 0.15s'
                }}
              />
            </div>
          </div>
          
          {/* License Certificate Upload - High Fidelity Terminal Style */}
          <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'white', borderRadius: '6px', border: `1px solid ${SLATE[200]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
              <Shield style={{ width: '14px', height: '14px', color: '#001E3C' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: SLATE[700], letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Document Verification
              </span>
              <Lock style={{ width: '12px', height: '12px', color: EMERALD }} />
              <span style={{ fontSize: '0.7rem', color: SLATE[400] }}>Secure SSL</span>
            </div>
            
            {getDocsByType('license').length === 0 ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'license')}
                onClick={() => {
                  setActiveUploadType('license');
                  fileInputRef.current?.click();
                }}
                style={{
                  border: `1px solid ${isDragging ? '#001E3C' : SLATE[200]}`,
                  borderRadius: '4px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: SLATE[50],
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <FileDigit style={{ width: '18px', height: '18px', color: '#001E3C' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500, color: SLATE[700] }}>
                    Upload CPL/ATPL Certificate
                  </p>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.7rem', color: SLATE[400] }}>
                    PDF, JPG, PNG • Max 10MB • Required for verification
                  </p>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#001E3C', fontWeight: 600 }}>Browse</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {getDocsByType('license').map(doc => (
                  <div key={doc.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem', 
                    background: SLATE[50], 
                    borderRadius: '4px', 
                    border: `1px solid ${doc.status === 'pending_review' ? EMERALD : SLATE[200]}` 
                  }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: doc.status === 'pending_review' ? '#ecfdf5' : SLATE[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {doc.status === 'processing' ? (
                        <Loader2 style={{ width: '16px', height: '16px', color: '#f59e0b', animation: 'spin 1s linear infinite' }} />
                      ) : doc.status === 'pending_review' ? (
                        <Check style={{ width: '16px', height: '16px', color: EMERALD }} />
                      ) : (
                        <FileText style={{ width: '16px', height: '16px', color: SLATE[500] }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500, color: SLATE[700], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.fileName}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                        <span style={{ fontSize: '0.7rem', color: SLATE[400] }}>{formatFileSize(doc.fileSize)}</span>
                        {doc.status === 'uploading' && (
                          <span style={{ fontSize: '0.7rem', color: SLATE[500] }}>↑ Uploading...</span>
                        )}
                        {doc.status === 'processing' && (
                          <span style={{ fontSize: '0.7rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1.5s infinite' }} />
                            Processing OCR...
                          </span>
                        )}
                        {doc.status === 'pending_review' && (
                          <span style={{ fontSize: '0.7rem', color: EMERALD, fontWeight: 500 }}>
                            VERIFIED (24-48h)
                          </span>
                        )}
                      </div>
                      {doc.extractedData && doc.status === 'pending_review' && (
                        <div style={{ marginTop: '0.4rem', padding: '0.4rem 0.5rem', background: 'white', borderRadius: '3px', border: `1px solid ${SLATE[200]}`, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Scan style={{ width: '12px', height: '12px', color: SLATE[400] }} />
                          <span style={{ color: SLATE[500] }}>Extracted:</span>
                          <span style={{ color: SLATE[700], fontFamily: MONO_FONT, fontWeight: 500 }}>{doc.extractedData.licenseNumber}</span>
                          {doc.extractedData.expiryDate && (
                            <span style={{ color: SLATE[400] }}>•</span>
                          )}
                          {doc.extractedData.expiryDate && (
                            <span style={{ color: SLATE[700], fontFamily: MONO_FONT }}>{doc.extractedData.expiryDate}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      style={{ padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.4, transition: 'opacity 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
                    >
                      <X style={{ width: '16px', height: '16px', color: SLATE[500] }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Medical Certificate Section - Terminal Style */}
        <section style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: `1px solid ${SLATE[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${SLATE[200]}` }}>
            <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: SLATE[800], letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              Medical Certificate
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Medical Certificate Expiration Date *
                {isDateExpired(medicalExpiry) && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 500 }}>(Expired)</span>
                )}
              </label>
              <input
                type="date"
                value={medicalExpiry}
                onChange={(e) => setMedicalExpiry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${isDateExpired(medicalExpiry) ? '#ef4444' : SLATE[300]}`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontFamily: MONO_FONT,
                  outline: 'none',
                  transition: 'all 0.15s'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Country Medical License Issued *
              </label>
              <select
                value={medicalCountry}
                onChange={(e) => setMedicalCountry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
              >
                <option value="">Select country</option>
                {NATIONALITIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                Medical Class *
                {uploadedDocs.some(d => d.type === 'medical' && d.status === 'pending_review') && (
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: EMERALD, 
                    background: '#f0fdf4', 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '4px',
                    border: `1px solid ${EMERALD}`,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Check style={{ width: '10px', height: '10px' }} />
                    Auto-filled from document
                  </span>
                )}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {MEDICAL_CLASSES.map(medClass => (
                  <button
                    key={medClass}
                    onClick={() => setMedicalClass(medClass)}
                    style={{
                      padding: '1rem 1.5rem',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: medicalClass === medClass ? '#001E3C' : SLATE[300],
                      background: medicalClass === medClass ? '#001E3C' : 'white',
                      color: medicalClass === medClass ? 'white' : SLATE[700],
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      fontWeight: medicalClass === medClass ? 700 : 500,
                      flex: 1,
                      boxShadow: medicalClass === medClass ? '0 2px 8px rgba(0, 30, 60, 0.2)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    {medClass}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Medical Certificate Upload - Terminal Style */}
          <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'white', borderRadius: '6px', border: `1px solid ${SLATE[200]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
              <Shield style={{ width: '14px', height: '14px', color: '#001E3C' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: SLATE[700], letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Medical Verification
              </span>
              <Lock style={{ width: '12px', height: '12px', color: EMERALD }} />
              <span style={{ fontSize: '0.7rem', color: SLATE[400] }}>AeroMedical Secure</span>
            </div>
            
            {getDocsByType('medical').length === 0 ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'medical')}
                onClick={() => {
                  setActiveUploadType('medical');
                  fileInputRef.current?.click();
                }}
                style={{
                  border: `1px solid ${isDragging ? '#001E3C' : SLATE[200]}`,
                  borderRadius: '4px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: SLATE[50],
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <FileDigit style={{ width: '18px', height: '18px', color: '#001E3C' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500, color: SLATE[700] }}>
                    Upload Medical Certificate
                  </p>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.7rem', color: SLATE[400] }}>
                    ICAO/EASA format • PDF, JPG • Auto-detects Class
                  </p>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#001E3C', fontWeight: 600 }}>Browse</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {getDocsByType('medical').map(doc => (
                  <div key={doc.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem', 
                    background: SLATE[50], 
                    borderRadius: '4px', 
                    border: `1px solid ${doc.status === 'pending_review' ? EMERALD : SLATE[200]}` 
                  }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: doc.status === 'pending_review' ? '#ecfdf5' : SLATE[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {doc.status === 'processing' ? (
                        <Loader2 style={{ width: '16px', height: '16px', color: '#f59e0b', animation: 'spin 1s linear infinite' }} />
                      ) : doc.status === 'pending_review' ? (
                        <Check style={{ width: '16px', height: '16px', color: EMERALD }} />
                      ) : (
                        <FileText style={{ width: '16px', height: '16px', color: '#059669' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500, color: SLATE[700], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.fileName}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                        <span style={{ fontSize: '0.7rem', color: SLATE[400] }}>{formatFileSize(doc.fileSize)}</span>
                        {doc.status === 'uploading' && (
                          <span style={{ fontSize: '0.7rem', color: SLATE[500] }}>↑ Uploading...</span>
                        )}
                        {doc.status === 'processing' && (
                          <span style={{ fontSize: '0.7rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1.5s infinite' }} />
                            Scanning medical class...
                          </span>
                        )}
                        {doc.status === 'pending_review' && (
                          <span style={{ fontSize: '0.7rem', color: EMERALD, fontWeight: 500 }}>
                            VERIFIED (24-48h)
                          </span>
                        )}
                      </div>
                      {doc.extractedData?.medicalClass && doc.status === 'pending_review' && (
                        <div style={{ marginTop: '0.4rem', padding: '0.4rem 0.5rem', background: 'white', borderRadius: '3px', border: `1px solid ${SLATE[200]}`, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Scan style={{ width: '12px', height: '12px', color: SLATE[400] }} />
                          <span style={{ color: SLATE[500] }}>Auto-detected:</span>
                          <span style={{ color: '#059669', fontWeight: 600, fontFamily: MONO_FONT }}>{doc.extractedData.medicalClass}</span>
                          <span style={{ color: EMERALD, fontSize: '0.65rem' }}>✓ Applied</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      style={{ padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.4, transition: 'opacity 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
                    >
                      <X style={{ width: '16px', height: '16px', color: SLATE[500] }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Radio License Section - Terminal Style */}
        <section style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: `1px solid ${SLATE[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${SLATE[200]}` }}>
            <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: SLATE[800], letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              Radio License
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Radio License Expiration Date
              </label>
              <input
                type="date"
                value={radioLicenseExpiry}
                onChange={(e) => setRadioLicenseExpiry(e.target.value)}
                placeholder="DD / MM / YYYY"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${SLATE[300]}`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontFamily: MONO_FONT
                }}
              />
            </div>
          </div>
        </section>

        {/* Aircraft Type Ratings Section - Terminal Style */}
        <section style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: `1px solid ${SLATE[200]}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${SLATE[200]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: SLATE[800], letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                Aircraft Type Ratings
              </h2>
            </div>
            <button
              onClick={addAircraftRating}
              style={{
                padding: '0.4rem 1rem',
                background: 'white',
                color: '#001E3C',
                border: `1px solid #001E3C`,
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#001E3C';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#001E3C';
              }}
            >
              + Add Rating
            </button>
          </div>
          
          {aircraftRatings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '1.5rem', background: SLATE[50], borderRadius: '8px', border: `1px solid ${SLATE[200]}` }}>
              <p style={{ color: SLATE[500], fontSize: '0.875rem', margin: 0 }}>
                No aircraft ratings added yet. Click "Add Rating" to log your A320, B737, or other type ratings.
              </p>
            </div>
          )}
          
          {aircraftRatings.map((rating, index) => (
            <div key={rating.id} style={{ 
              marginBottom: '1rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '8px',
              border: `1px solid ${SLATE[200]}`
            }}>
              {/* Rating Header with Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${SLATE[100]}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: SLATE[800] }}>
                    Rating #{index + 1}
                  </span>
                  {rating.aircraftType && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '0.2rem 0.5rem', 
                      background: getDocsByType('rating').length > index ? '#f0fdf4' : '#fef3c7',
                      color: getDocsByType('rating').length > index ? EMERALD : '#d97706',
                      borderRadius: '4px',
                      fontWeight: 500,
                      border: `1px solid ${getDocsByType('rating').length > index ? EMERALD : '#fbbf24'}`
                    }}>
                      {getDocsByType('rating').length > index ? 'VERIFIED' : 'PENDING'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeAircraftRating(rating.id)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    background: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    opacity: 0.8,
                    transition: 'opacity 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  Remove
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: SLATE[500], marginBottom: '0.25rem' }}>
                    Aircraft Type
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={rating.aircraftType}
                      onChange={(e) => updateAircraftRating(rating.id, 'aircraftType', e.target.value)}
                      placeholder="e.g., A320, B737..."
                      list={`aircraft-list-${rating.id}`}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: `1px solid ${SLATE[300]}`,
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        fontFamily: MONO_FONT
                      }}
                    />
                    <datalist id={`aircraft-list-${rating.id}`}>
                      {COMMON_AIRCRAFT.map(aircraft => (
                        <option key={aircraft} value={aircraft} />
                      ))}
                    </datalist>
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: SLATE[500], marginBottom: '0.25rem' }}>
                    Rating Date
                  </label>
                  <input
                    type="date"
                    value={rating.ratingDate}
                    onChange={(e) => updateAircraftRating(rating.id, 'ratingDate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${SLATE[300]}`,
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontFamily: MONO_FONT
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: SLATE[700] }}>
                    <input
                      type="checkbox"
                      checked={rating.isCurrent}
                      onChange={(e) => updateAircraftRating(rating.id, 'isCurrent', e.target.checked)}
                      style={{ width: '1rem', height: '1rem' }}
                    />
                    Current
                  </label>
                </div>
              </div>
            </div>
          ))}
          
          {/* Type Rating Certificate Upload - Terminal Style */}
          <div style={{ marginTop: '1.5rem', padding: '0.875rem', background: 'white', borderRadius: '6px', border: `1px solid ${SLATE[200]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
              <Shield style={{ width: '14px', height: '14px', color: '#001E3C' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: SLATE[700], letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Type Rating Documentation
              </span>
              <span style={{ fontSize: '0.7rem', color: SLATE[400] }}>Optional</span>
            </div>
            
            {getDocsByType('rating').length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'rating')}
                  onClick={() => {
                    setActiveUploadType('rating');
                    fileInputRef.current?.click();
                  }}
                  style={{
                    border: `1px solid ${isDragging ? '#001E3C' : SLATE[200]}`,
                    borderRadius: '4px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: SLATE[50],
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <FileDigit style={{ width: '18px', height: '18px', color: '#001E3C' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500, color: SLATE[700] }}>
                      Upload ATO Certificate
                    </p>
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.7rem', color: SLATE[400] }}>
                      PDF, JPG • Max 10MB • Enhances credibility
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#001E3C', fontWeight: 600 }}>Browse</span>
                </div>
                <button
                  style={{
                    padding: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: SLATE[400],
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  Skip for now →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {getDocsByType('rating').map(doc => (
                  <div key={doc.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem', 
                    background: SLATE[50], 
                    borderRadius: '4px', 
                    border: `1px solid ${doc.status === 'pending_review' ? EMERALD : SLATE[200]}` 
                  }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '4px', background: doc.status === 'pending_review' ? '#eff6ff' : SLATE[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {doc.status === 'processing' ? (
                        <Loader2 style={{ width: '16px', height: '16px', color: '#f59e0b', animation: 'spin 1s linear infinite' }} />
                      ) : doc.status === 'pending_review' ? (
                        <Check style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                      ) : (
                        <FileText style={{ width: '16px', height: '16px', color: '#2563eb' }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500, color: SLATE[700], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.fileName}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                        <span style={{ fontSize: '0.7rem', color: SLATE[400] }}>{formatFileSize(doc.fileSize)}</span>
                        {doc.status === 'uploading' && (
                          <span style={{ fontSize: '0.7rem', color: SLATE[500] }}>↑ Uploading...</span>
                        )}
                        {doc.status === 'processing' && (
                          <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>Processing...</span>
                        )}
                        {doc.status === 'pending_review' && (
                          <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 500 }}>
                            VERIFIED (24-48h)
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      style={{ padding: '0.4rem', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.4, transition: 'opacity 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
                    >
                      <X style={{ width: '16px', height: '16px', color: SLATE[500] }} />
                    </button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setActiveUploadType('rating');
                      fileInputRef.current?.click();
                    }}
                    style={{ 
                      flex: 1,
                      padding: '0.625rem', 
                      border: `1px dashed ${SLATE[300]}`, 
                      borderRadius: '4px', 
                      background: 'white',
                      color: SLATE[600],
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Certificate
                  </button>
                  <button
                    style={{
                      padding: '0.625rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      color: SLATE[400],
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Job Experience Section - Terminal Style */}
        <section style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: `1px solid ${SLATE[200]}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${SLATE[200]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: SLATE[800], letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                Job Experience
              </h2>
            </div>
            <button
              onClick={addJobExperience}
              style={{
                padding: '0.4rem 1rem',
                background: '#001E3C',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              + Add Experience
            </button>
          </div>
          
          {jobExperiences.length === 0 && (
            <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
              No job experiences added yet. Click "Add Experience" to log your work history.
            </p>
          )}
          
          {jobExperiences.map((job, index) => (
            <div key={job.id} style={{ 
              marginBottom: '1.5rem',
              padding: '1.5rem',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                    Company/Organization *
                  </label>
                  <input
                    type="text"
                    value={job.company}
                    onChange={(e) => updateJobExperience(job.id, 'company', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., Emirates Airlines"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                    Position/Role *
                  </label>
                  <input
                    type="text"
                    value={job.position}
                    onChange={(e) => updateJobExperience(job.id, 'position', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., First Officer"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                    From Date *
                  </label>
                  <input
                    type="date"
                    value={job.fromDate}
                    onChange={(e) => updateJobExperience(job.id, 'fromDate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={job.toDate}
                    onChange={(e) => updateJobExperience(job.id, 'toDate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem' }}>
                  Job Description
                </label>
                <textarea
                  value={job.description}
                  onChange={(e) => updateJobExperience(job.id, 'description', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your responsibilities and achievements in this role..."
                />
              </div>
              
              <button
                onClick={() => removeJobExperience(job.id)}
                style={{
                  padding: '0.4rem 0.75rem',
                  background: 'transparent',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                  opacity: 0.7,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              >
                ✕ Remove
              </button>
            </div>
          ))}
          
          {/* ICAO Data Security Audit Trail */}
          <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: SLATE[50], borderRadius: '4px', border: `1px solid ${SLATE[200]}`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock style={{ width: '14px', height: '14px', color: SLATE[400] }} />
            <span style={{ fontSize: '0.7rem', color: SLATE[500] }}>
              Data encrypted and stored according to ICAO data security standards
            </span>
          </div>
        </section>

        {/* Current Occupation Status Section - Terminal Style */}
        <section style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: `1px solid ${SLATE[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${SLATE[200]}` }}>
            <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: SLATE[800], letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              Current Occupation Status
            </h2>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
              Your Current Employment Status *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {OCCUPATION_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setCurrentOccupation(option.value)}
                  style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: currentOccupation === option.value ? '#001E3C' : SLATE[300],
                    background: currentOccupation === option.value ? '#001E3C' : 'white',
                    color: currentOccupation === option.value ? 'white' : SLATE[700],
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: currentOccupation === option.value ? 600 : 500,
                    transition: 'all 0.15s',
                    boxShadow: currentOccupation === option.value ? '0 2px 6px rgba(0, 30, 60, 0.15)' : 'none'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {(currentOccupation === 'employed' || currentOccupation === 'open_to_changes') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Current Employer
                </label>
                <input
                  type="text"
                  value={currentEmployer}
                  onChange={(e) => setCurrentEmployer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter current employer name"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  Current Position
                </label>
                <input
                  type="text"
                  value={currentPosition}
                  onChange={(e) => setCurrentPosition(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter current position"
                />
              </div>
            </div>
          )}
        </section>

        {/* Pilot Interests Section - Terminal Style */}
        <section style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: `1px solid ${SLATE[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${SLATE[200]}` }}>
            <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: SLATE[800], letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              Pilot Interests
            </h2>
          </div>
          
          {/* Aviation Pathways Interests - Multiple Choice */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
              Interests in Aviation Pathways (Select all that apply)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {AVIATION_PATHWAYS_OPTIONS.map(pathway => (
                <button
                  key={pathway}
                  onClick={() => toggleAviationPathway(pathway)}
                  style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: aviationPathwaysInterests.includes(pathway) ? '#001E3C' : SLATE[300],
                    background: aviationPathwaysInterests.includes(pathway) ? '#001E3C' : 'white',
                    color: aviationPathwaysInterests.includes(pathway) ? 'white' : SLATE[700],
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: aviationPathwaysInterests.includes(pathway) ? 600 : 500,
                    transition: 'all 0.15s',
                    boxShadow: aviationPathwaysInterests.includes(pathway) ? '0 2px 6px rgba(0, 30, 60, 0.15)' : 'none'
                  }}
                >
                  {pathway}
                </button>
              ))}
            </div>
          </div>

          {/* Pilot Job Positions Interests - Multiple Choice */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
              Interests in Pilot Job Positions (Select all that apply)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {PILOT_JOB_POSITIONS_OPTIONS.map(position => (
                <button
                  key={position}
                  onClick={() => togglePilotJobPosition(position)}
                  style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: pilotJobPositionsInterests.includes(position) ? '#001E3C' : SLATE[300],
                    background: pilotJobPositionsInterests.includes(position) ? '#001E3C' : 'white',
                    color: pilotJobPositionsInterests.includes(position) ? 'white' : SLATE[700],
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: pilotJobPositionsInterests.includes(position) ? 600 : 500,
                    transition: 'all 0.15s',
                    boxShadow: pilotJobPositionsInterests.includes(position) ? '0 2px 6px rgba(0, 30, 60, 0.15)' : 'none'
                  }}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Countries Visited (General Average)
              </label>
              <input
                type="number"
                value={countriesVisited}
                onChange={(e) => setCountriesVisited(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
                placeholder="Number of countries visited"
                min="0"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Favorite Aircraft Type
              </label>
              <select
                value={favoriteAircraft}
                onChange={(e) => setFavoriteAircraft(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: 'white'
                }}
              >
                <option value="">Select favorite aircraft</option>
                {COMMON_AIRCRAFT.map(aircraft => (
                  <option key={aircraft} value={aircraft}>{aircraft}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Why Did You Become a Pilot / Hold a Pilot License?
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                value={whyBecomePilot}
                onChange={(e) => setWhyBecomePilot(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '4rem',
                  border: `1px solid ${SLATE[300]}`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: MONO_FONT
                }}
                placeholder="Focusing on long-haul operations and EBT-aligned training..."
                maxLength={500}
              />
              <span style={{ 
                position: 'absolute', 
                bottom: '0.75rem', 
                right: '0.75rem', 
                fontSize: '0.75rem', 
                color: SLATE[400],
                fontFamily: MONO_FONT,
                pointerEvents: 'none'
              }}>
                {whyBecomePilot.length} / 500
              </span>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Other Skills & Experiences (e.g., Cooking, IT, Languages, etc.)
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                value={otherSkills}
                onChange={(e) => setOtherSkills(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '4rem',
                  border: `1px solid ${SLATE[300]}`,
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  minHeight: '60px',
                  resize: 'vertical',
                  fontFamily: MONO_FONT
                }}
                placeholder="Multi-engine IFR experience, technical documentation, crew resource management..."
                maxLength={500}
              />
              <span style={{ 
                position: 'absolute', 
                bottom: '0.75rem', 
                right: '0.75rem', 
                fontSize: '0.75rem', 
                color: SLATE[400],
                fontFamily: MONO_FONT,
                pointerEvents: 'none'
              }}>
                {otherSkills.length} / 500
              </span>
            </div>
          </div>
        </section>

        {/* Review Your Information - Terminal Style */}
        <section style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem', 
          marginBottom: '2rem',
          border: `1px solid ${SLATE[300]}`,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${SLATE[200]}` }}>
            <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: SLATE[800], letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              Review Your Information
            </h3>
          </div>
          
          <p style={{ color: SLATE[600], lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Before saving, please review your information. This data will be visible on your ATLAS CV and shared with aviation industry partners including airlines and manufacturers.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: SLATE[50], borderRadius: '6px', border: `1px solid ${SLATE[200]}` }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Pilot Name</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', fontWeight: fullLegalName ? 700 : 400, color: fullLegalName ? SLATE[900] : SLATE[400] }}>{fullLegalName || 'Not entered'}</p>
            </div>
            <div style={{ padding: '1rem', background: SLATE[50], borderRadius: '6px', border: `1px solid ${SLATE[200]}` }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>License Type</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', fontWeight: currentLicenses.length > 0 ? 700 : 400, color: currentLicenses.length > 0 ? SLATE[900] : SLATE[400] }}>{currentLicenses.join(', ') || 'None selected'}</p>
            </div>
            <div style={{ padding: '1rem', background: SLATE[50], borderRadius: '6px', border: `1px solid ${SLATE[200]}` }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Medical Status</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', fontWeight: medicalClass ? 700 : 400, color: medicalClass ? (isDateExpired(medicalExpiry) ? '#ef4444' : EMERALD) : SLATE[400] }}>
                {medicalClass || 'Not selected'} {isDateExpired(medicalExpiry) && '(Expired)'}
              </p>
            </div>
            <div style={{ padding: '1rem', background: SLATE[50], borderRadius: '6px', border: `1px solid ${SLATE[200]}` }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: SLATE[500], textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Type Ratings</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', fontWeight: aircraftRatings.length > 0 ? 700 : 400, color: aircraftRatings.length > 0 ? SLATE[900] : SLATE[400] }}>{aircraftRatings.length > 0 ? `${aircraftRatings.length} rating(s)` : 'None added'}</p>
            </div>
          </div>
          
          {isDateExpired(licenseExpiry) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', marginBottom: '1rem' }}>
              <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>⚠️ Your license appears to be expired. Please verify the expiration date.</span>
            </div>
          )}
          {isDateExpired(medicalExpiry) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px', marginBottom: '1rem' }}>
              <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>⚠️ Your medical certificate appears to be expired. Please verify the expiration date.</span>
            </div>
          )}
          
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: SLATE[50], borderRadius: '6px', border: `1px solid ${SLATE[200]}` }}>
            <input type="checkbox" style={{ marginTop: '0.125rem', width: '1.25rem', height: '1.25rem', accentColor: '#001E3C' }} />
            <span style={{ fontSize: '0.875rem', color: SLATE[700], lineHeight: 1.5, fontWeight: 500 }}>
              <strong style={{ color: '#001E3C' }}>Legal Confirmation:</strong> I confirm that all information provided is accurate and complete. I understand this data will be visible to aviation industry partners and may be verified according to ICAO standards.
            </span>
          </label>
        </section>

        {/* Industry Visibility Notice - Terminal Style (Legal Disclosure) */}
        <section style={{ 
          background: SLATE[50], 
          borderRadius: '6px', 
          padding: '1.25rem', 
          marginBottom: '2rem',
          border: `1px solid ${SLATE[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Shield style={{ width: '16px', height: '16px', color: SLATE[500] }} />
            <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: SLATE[600], letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              Industry Visibility Notice
            </h3>
          </div>
          <p style={{ color: SLATE[700], lineHeight: 1.5, marginBottom: '0.75rem', fontSize: '0.8125rem' }}>
            <strong>This information is visible to aviation industry manufacturers and airlines.</strong>
          </p>
          <p style={{ color: SLATE[500], lineHeight: 1.5, fontSize: '0.8125rem' }}>
            Leading aviation companies including Boeing, Airbus, Emirates, Etihad Airways, and other major airlines regularly review pilot profiles on our platform. 
            Your current state, qualifications, experience, and employment status will be visible to recruiters and hiring managers who are looking for qualified pilots. 
            Keep your information up-to-date to maximize your opportunities in the aviation industry.
          </p>
        </section>

        {/* Terminal-Style Sticky Action Bar */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: `1px solid ${SLATE[200]}`, padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', background: SLATE[50], borderRadius: '4px', border: `1px solid ${SLATE[200]}` }}>
              <Clock style={{ width: '14px', height: '14px', color: SLATE[500] }} />
              {autoSaveStatus === 'idle' && lastSaved && (
                <span style={{ fontSize: '0.75rem', color: SLATE[500], fontFamily: MONO_FONT }}>
                  {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {autoSaveStatus === 'saving' && (
                <span style={{ fontSize: '0.75rem', color: SLATE[500] }}>Syncing...</span>
              )}
              {autoSaveStatus === 'saved' && (
                <span style={{ fontSize: '0.75rem', color: EMERALD, fontWeight: 500 }}>SAVED</span>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: SLATE[400] }}>
              {uploadedDocs.length} doc{uploadedDocs.length !== 1 ? 's' : ''} queued
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'white',
                color: SLATE[600],
                border: `1px solid ${SLATE[300]}`,
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 0 ? 0.5 : 1
              }}
            >
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '0.75rem 2rem',
                background: isSaving ? SLATE[300] : '#001E3C',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: isSaving ? 'none' : '0 2px 8px rgba(0, 30, 60, 0.25)'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = '#00294d';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 30, 60, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = '#001E3C';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 30, 60, 0.25)';
                }
              }}
            >
              {isSaving ? (
                <>
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : (
                <>Generate ATLAS CV →</>
              )}
            </button>
          </div>
        </div>

        {/* Spacer for fixed bottom bar */}
        <div style={{ height: '80px' }} />

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '1rem 3rem',
              background: isSaving ? '#93c5fd' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            {isSaving ? 'Saving...' : 'Save All Information'}
          </button>
        </div>
      </main>
      )}
    </div>
  );
};

export default PilotLicensureExperiencePage;
