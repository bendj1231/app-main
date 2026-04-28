
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Lock, Mail, MapPin, School, Phone, Clock, Award, ShieldCheck, CheckCircle2, ChevronRight, ChevronDown, ChevronUp, HelpCircle, Calendar, Globe, Flag, Plane, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { useAuth } from '@/src/contexts/AuthContext';
import { BreadcrumbSchema } from './seo/BreadcrumbSchema';

interface BecomeMemberPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const BecomeMemberPage: React.FC<BecomeMemberPageProps> = ({ onBack, onNavigate, onLogin }) => {

    const { signup, currentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [pilotId, setPilotId] = useState('');
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');
    const [flightSchoolAddress, setFlightSchoolAddress] = useState('');
    const [residingCountry, setResidingCountry] = useState('');
    const [nationality, setNationality] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [licenseId, setLicenseId] = useState('');
    const [countryOfLicense, setCountryOfLicense] = useState('');
    const [currentFlightHours, setCurrentFlightHours] = useState('');
    const [aircraftRatedOn, setAircraftRatedOn] = useState('');
    const [experienceDescription, setExperienceDescription] = useState('');

    // Full Profiling Additional Fields
    const [middleName, setMiddleName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [languages, setLanguages] = useState('');
    const [englishProficiencyLevel, setEnglishProficiencyLevel] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseExpiry, setLicenseExpiry] = useState('');
    const [medicalExpiry, setMedicalExpiry] = useState('');
    const [medicalClass, setMedicalClass] = useState('');
    const [medicalCountry, setMedicalCountry] = useState('');
    const [radioLicenseExpiry, setRadioLicenseExpiry] = useState('');
    const [currentOccupation, setCurrentOccupation] = useState('');
    const [currentEmployer, setCurrentEmployer] = useState('');
    const [currentPosition, setCurrentPosition] = useState('');
    const [countriesVisited, setCountriesVisited] = useState('');
    const [favoriteAircraft, setFavoriteAircraft] = useState('');
    const [whyBecomePilot, setWhyBecomePilot] = useState('');
    const [otherSkills, setOtherSkills] = useState('');
    const [lastFlown, setLastFlown] = useState('');

    // Job Experience Array
    const [jobExperiences, setJobExperiences] = useState<Array<{
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }>>([]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [userAlreadyExisted, setUserAlreadyExisted] = useState(false);
    const [fullProfiling, setFullProfiling] = useState(false);

    // Log signupSuccess state changes
    useEffect(() => {
    }, [signupSuccess]);

    // Pre-fill email with current user's email if logged in via OAuth
    useEffect(() => {
        if (currentUser?.email && !email) {
            setEmail(currentUser.email);
        }
    }, [currentUser, email]);

    const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
    const [selectedInsights, setSelectedInsights] = useState<string[]>([]);
    const [selectedPathways, setSelectedPathways] = useState<string[]>([]);

    const toggleRating = (rating: string) => {
        setSelectedRatings(prev =>
            prev.includes(rating)
                ? prev.filter(r => r !== rating)
                : [...prev, rating]
        );
    };

    const toggleProgram = (program: string) => {
        setSelectedPrograms(prev =>
            prev.includes(program)
                ? prev.filter(p => p !== program)
                : [...prev, program]
        );
    };

    const toggleInsight = (insight: string) => {
        setSelectedInsights(prev =>
            prev.includes(insight)
                ? prev.filter(i => i !== insight)
                : [...prev, insight]
        );
    };

    const togglePathway = (pathway: string) => {
        setSelectedPathways(prev =>
            prev.includes(pathway)
                ? prev.filter(p => p !== pathway)
                : [...prev, pathway]
        );
    };

    const ratingsOptions = [
        { id: 'student', label: 'Student Pilot' },
        { id: 'ppl', label: 'Private Pilot License (PPL)' },
        { id: 'cpl', label: 'Commercial Pilot License (CPL)' },
        { id: 'ir', label: 'Instrument Rating (IR)' },
        { id: 'multi_engine', label: 'Multi Engine Rating (ME)' },
        { id: 'atpl', label: 'Airline Transport Pilot License (ATPL)' },
    ];

    const programOptions = [
        { id: 'foundation', label: 'Foundation Program' },
        { id: 'transition', label: 'Transition Program' },
    ];

    const insightOptions = [
        { id: 'airline', label: 'Airline Expectations' },
        { id: 'private_jet', label: 'Corporate & VIP Jet Sector' },
        { id: 'air_taxis', label: 'UAM & Emerging Air Taxis' },
        { id: 'cargo_ops', label: 'Global Cargo & Logistics' },
        { id: 'instructional', label: 'Flight Instruction Excellence' },
        { id: 'seaplane_insight', label: 'Float & Amphibious Operations' },
        { id: 'aerial_work', label: 'Specialized Aerial Work' },
        { id: 'tourism_insight', label: 'Aerial Tourism & Sightseeing' },
        { id: 'ownership_insight', label: 'Aircraft Ownership & Management' },
        { id: 'precision_ag', label: 'Precision Agriculture & Surveying' },
        { id: 'drones', label: 'Unmanned Drone Systems' },
    ];

    const pathwayOptions = [
        { id: 'atpl_pathway', label: 'ATPL Pathway' },
        { id: 'seaplane', label: 'Seaplane Rating Pathway' },
        { id: 'cargo', label: 'Cargo Transportation Pathway' },
        { id: 'air_taxi', label: 'Air Taxi Pathway' },
        { id: 'skydive', label: 'Skydive Pathway' },
        { id: 'instructor', label: 'Flight Instructor Pathway' },
        { id: 'tours', label: 'Flight Tours Pathway' },
        { id: 'ownership', label: 'Aircraft Ownership Pathway' },
        { id: 'private_charter', label: 'Private Charter Pathway' },
        { id: 'surveying', label: 'Land Surveying & Agricultural Pathway' },
    ];

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Become a Member', url: '/become-member' }
            ]} />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-200/40 rounded-full blur-[120px]" />
            </div>

            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            <div className="relative pt-32 pb-24 px-6 z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section - Kept requested format */}
                    <div className="text-center mb-16 relative">
                        <div className="inline-block relative">
                            <img
                                src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                                alt="PilotRecognition Logo"
                                className="mx-auto w-64 h-auto object-contain mb-8 drop-shadow-sm"
                            />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tight leading-none mb-2">
                                First Step Towards Pilot Recognition.
                            </h1>
                            <p className="text-sm md:text-base mb-8" style={{ color: '#DAA520' }}>
                                Programs | Pilot Recognition | Pathways
                            </p>

                            <div className="flex justify-center">
                                <div className="px-6 py-4 bg-white/80 backdrop-blur-md border border-blue-200/50 rounded-3xl shadow-sm max-w-2xl mx-auto">
                                    <p className="text-sm font-medium text-slate-700 text-center leading-relaxed">
                                        The information provided below will be scanned and formed into a default <span className="font-bold text-blue-900">ATLAS CV format</span> which you will be able to edit throughout your program & pathways.
                                        <span className="block mt-1 text-xs text-slate-500 italic">
                                            Note: Your detailed information will be read and seen by various airlines, aircraft manufacturers, Air Taxi Operators and various Pathways which PilotRecognition provides.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Success Confirmation Screen */}
                    {signupSuccess ? (
                        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden p-12 md:p-20 text-center">
                            <div className="max-w-2xl mx-auto">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                    {userAlreadyExisted ? 'Welcome Back!' : 'Welcome to PilotRecognition'}
                                </h2>

                                <p className="text-lg text-slate-600 mb-6">
                                    {userAlreadyExisted
                                        ? 'Your account has been updated with your information.'
                                        : 'Thank you for successfully creating your account!'
                                    }
                                </p>

                                {userAlreadyExisted ? (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
                                        <p className="text-sm text-slate-700 mb-2">
                                            <strong>Account Updated</strong>
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            Your profile information has been updated. You can now access your Pilot Recognition Profile and continue your journey.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                                            <p className="text-sm text-slate-700 mb-2">
                                                <strong>Verification email sent</strong>
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                Please check your inbox at <span className="font-semibold text-blue-900">{email}</span> and click the verification link to activate your account.
                                            </p>
                                        </div>

                                        {pilotId && (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
                                                <p className="text-sm text-slate-700 mb-2">
                                                    <strong>Your Profile Name</strong>
                                                </p>
                                                <p className="text-2xl font-bold text-emerald-900">
                                                    {pilotId}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    Save this name for future reference
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500">
                                        {userAlreadyExisted
                                            ? 'You can now access all available features.'
                                            : 'Once verified, you can access your Pilot Recognition Profile and begin your journey.'
                                        }
                                    </p>

                                    <button
                                        onClick={onLogin}
                                        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        {userAlreadyExisted ? 'Go to Dashboard' : 'Continue to Login'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden">
                        {/* Page Progress Indicator (Visual) */}
                        <div className="h-1.5 w-full bg-slate-100 flex">
                            <div className="h-full bg-blue-600 w-1/3" />
                            <div className="h-full bg-slate-200 w-2/3" />
                        </div>

                        <div className="p-8 md:p-16">
                            <form className="space-y-16" onSubmit={async (e) => {
                                e.preventDefault();
                                setError('');
                                setLoading(true);

                                // Add timeout to prevent infinite loading
                                const timeoutId = setTimeout(() => {
                                    if (loading) {
                                        setLoading(false);
                                        setError('Request timed out. Please check your internet connection and try again.');
                                    }
                                }, 30000); // 30 second timeout

                                try {
                                    // Determine highest rating from selection
                                    const ratingPriority = ['atpl', 'cpl', 'ppl', 'student'];
                                    let highestRating = 'Student';

                                    for (const r of ratingPriority) {
                                        if (selectedRatings.includes(r)) {
                                            highestRating = r.toUpperCase();
                                            break;
                                        }
                                    }

                                    // Construct the categorization string "Name , License, Hours"
                                    const pilotCategory = `${fullName} , ${highestRating}, ${currentFlightHours}hrs`;

                                    await signup(email, password, {
                                        pilotId,
                                        pilotCategory, // New field for easy identification
                                        fullName,
                                        dob,
                                        flightSchoolAddress,
                                        residingCountry,
                                        nationality,
                                        contactNumber,
                                        licenseId,
                                        countryOfLicense,
                                        currentFlightHours,
                                        aircraftRatedOn,
                                        experienceDescription,
                                        ratings: selectedRatings,
                                        programInterests: selectedPrograms,
                                        pathwayInterests: selectedPathways,
                                        insightInterests: selectedInsights,
                                        // Additional ATLAS resume fields
                                        middleName,
                                        dateOfBirth,
                                        languages,
                                        englishProficiencyLevel,
                                        licenseNumber,
                                        licenseExpiry,
                                        medicalExpiry,
                                        medicalClass,
                                        medicalCountry,
                                        radioLicenseExpiry,
                                        currentOccupation,
                                        currentEmployer,
                                        currentPosition,
                                        countriesVisited,
                                        favoriteAircraft,
                                        whyBecomePilot,
                                        otherSkills,
                                        lastFlown,
                                        jobExperiences
                                    });
                                    clearTimeout(timeoutId);
                                    setSignupSuccess(true);
                                    setUserAlreadyExisted(false);
                                    // Navigate to confirmation page
                                    setTimeout(() => {
                                        onNavigate('account-confirmation');
                                    }, 500);
                                } catch (err: any) {
                                    clearTimeout(timeoutId);
                                    console.error("Signup failed", err);
                                    // Check if user already existed
                                    if (err.message === 'USER_ALREADY_EXISTS') {
                                        setError('An account with this email already exists. Please sign in instead.');
                                    } else {
                                        setError(err.message || "Failed to create account");
                                    }
                                } finally {
                                    clearTimeout(timeoutId);
                                    setLoading(false);
                                }
                            }}>

                                {/* Section: Account Credentials */}
                                <section className="space-y-10">
                                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Credentials</h2>
                                        <p className="text-sm text-slate-500 font-medium italic">This name will be used across your pilot recognition profile.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5 group">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Profile Name</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Pilot Recognition Name"
                                                    value={pilotId}
                                                    onChange={(e) => setPilotId(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5 group">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Email Address
                                                {currentUser && <span className="ml-2 text-xs text-blue-600 font-normal">(from your Google account)</span>}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    placeholder="pilot@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                    readOnly={!!currentUser}
                                                    style={currentUser ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                                                />
                                                {currentUser && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Email is linked to your Google account and cannot be changed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2.5 group">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px w-full bg-slate-100/80" />

                                {/* Section: Personal Details */}
                                <section className="space-y-10">
                                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Details</h2>
                                        <p className="text-sm text-slate-500 font-medium">Tell us more about yourself and your background</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Legal Name</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Captain John Doe"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Date of Birth</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={dob}
                                                        onChange={(e) => setDob(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 group">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Flight School Address</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Flight School Address"
                                                    value={flightSchoolAddress}
                                                    onChange={(e) => setFlightSchoolAddress(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Residing Country</label>
                                                <div className="relative">
                                                    <select
                                                        value={residingCountry}
                                                        onChange={(e) => setResidingCountry(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    >
                                                        <option value="">Select Residing Country</option>
                                                        {[
                                                            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
                                                            "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
                                                            "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
                                                            "Denmark", "Djibouti", "Dominica", "Dominican Republic",
                                                            "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
                                                            "Fiji", "Finland", "France",
                                                            "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
                                                            "Haiti", "Honduras", "Hungary",
                                                            "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
                                                            "Jamaica", "Japan", "Jordan",
                                                            "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
                                                            "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
                                                            "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
                                                            "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
                                                            "Oman",
                                                            "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
                                                            "Qatar",
                                                            "Romania", "Russia", "Rwanda",
                                                            "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
                                                            "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
                                                            "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
                                                            "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
                                                            "Yemen",
                                                            "Zambia", "Zimbabwe"
                                                        ].map(country => (
                                                            <option key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>{country}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Nationality</label>
                                                <div className="relative">
                                                    <select
                                                        value={nationality}
                                                        onChange={(e) => setNationality(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    >
                                                        <option value="">Select Nationality</option>
                                                        {[
                                                            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
                                                            "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
                                                            "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
                                                            "Denmark", "Djibouti", "Dominica", "Dominican Republic",
                                                            "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
                                                            "Fiji", "Finland", "France",
                                                            "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
                                                            "Haiti", "Honduras", "Hungary",
                                                            "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
                                                            "Jamaica", "Japan", "Jordan",
                                                            "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
                                                            "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
                                                            "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
                                                            "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
                                                            "Oman",
                                                            "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
                                                            "Qatar",
                                                            "Romania", "Russia", "Rwanda",
                                                            "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
                                                            "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
                                                            "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
                                                            "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
                                                            "Yemen",
                                                            "Zambia", "Zimbabwe"
                                                        ].map(country => (
                                                            <option key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>{country}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 group">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Contact Number</label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={contactNumber}
                                                    onChange={(e) => setContactNumber(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px w-full bg-slate-100/80" />

                                {/* Section: Pilot Profile */}
                                <section className="space-y-10">
                                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pilot Profile</h2>
                                        <p className="text-sm text-slate-500 font-medium">Overview of your current flight qualification</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Pilot License ID Code Number</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter License ID Number"
                                                        value={licenseId}
                                                        onChange={(e) => setLicenseId(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Country of License</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                        value={countryOfLicense}
                                                        onChange={(e) => setCountryOfLicense(e.target.value)}
                                                    >
                                                        <option value="">Select Country of License</option>
                                                        {[
                                                            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
                                                            "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
                                                            "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
                                                            "Denmark", "Djibouti", "Dominica", "Dominican Republic",
                                                            "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
                                                            "Fiji", "Finland", "France",
                                                            "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
                                                            "Haiti", "Honduras", "Hungary",
                                                            "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
                                                            "Jamaica", "Japan", "Jordan",
                                                            "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
                                                            "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
                                                            "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
                                                            "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
                                                            "Oman",
                                                            "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
                                                            "Qatar",
                                                            "Romania", "Russia", "Rwanda",
                                                            "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
                                                            "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
                                                            "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
                                                            "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
                                                            "Yemen",
                                                            "Zambia", "Zimbabwe"
                                                        ].map(country => (
                                                            <option key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>{country}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Flight Hours</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 250"
                                                        value={currentFlightHours}
                                                        onChange={(e) => setCurrentFlightHours(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">English Proficiency Level</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={englishProficiencyLevel}
                                                        onChange={(e) => setEnglishProficiencyLevel(e.target.value)}
                                                    >
                                                        <option value="">Select English Proficiency</option>
                                                        <option value="Level 1 (Elementary)">Level 1 (Elementary)</option>
                                                        <option value="Level 2 (Pre-Intermediate)">Level 2 (Pre-Intermediate)</option>
                                                        <option value="Level 3 (Intermediate)">Level 3 (Intermediate)</option>
                                                        <option value="Level 4 (Upper Intermediate)">Level 4 (Upper Intermediate)</option>
                                                        <option value="Level 5 (Advanced)">Level 5 (Advanced)</option>
                                                        <option value="Level 6 (Expert)">Level 6 (Expert)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Last Flown Date</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={lastFlown}
                                                        onChange={(e) => setLastFlown(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Ratings & Endorsements</label>
                                            <div className="flex flex-wrap gap-2">
                                                {ratingsOptions.map(option => (
                                                    <button
                                                        key={option.id}
                                                        type="button"
                                                        onClick={() => toggleRating(option.id)}
                                                        className={`px-4 py-2 rounded-full border transition-all cursor-pointer text-sm font-medium ${
                                                            selectedRatings.includes(option.id)
                                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 flex items-start gap-3">
                                                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                <p className="text-sm leading-relaxed text-amber-900/80 font-medium">
                                                    Accurate ratings selection ensures you are assigned to the correct syllabus within the PilotRecognition ecosystem.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Pilot Info: Aircraft & Experience */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                                        <div className="space-y-4">
                                            <div className="space-y-2.5 group">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Aircraft Rated On</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. C172, PA28, B737, A320..."
                                                        value={aircraftRatedOn}
                                                        onChange={(e) => setAircraftRatedOn(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5 group">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Experience Description</label>
                                            <textarea
                                                placeholder="Briefly describe your flight experience, operational background, or specific aviation goals..."
                                                value={experienceDescription}
                                                onChange={(e) => setExperienceDescription(e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Profiling Mode Toggle - Glassy UI Button */}
                                <div className="flex justify-center mb-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFullProfiling(!fullProfiling)}
                                            className="px-8 py-4 rounded-2xl font-semibold text-sm transition-all flex items-center gap-3"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.7)',
                                                backdropFilter: 'blur(12px)',
                                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                                color: '#000000',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                                            }}
                                        >
                                            <span>Click to Expand Pilot Recognition Data Entry</span>
                                            {fullProfiling ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                        <p className="text-xs font-semibold text-blue-600">
                                            preferred for Aviation Industry Oversight
                                        </p>
                                    </div>
                                </div>

                                {/* Full Profiling Additional Fields */}
                                {fullProfiling && (
                                    <>
                                        <div className="h-px w-full bg-slate-100/80" />

                                        {/* Section: Detailed Pilot Recognition Profiling Data */}
                                        <section className="space-y-10">
                                            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Detailed Pilot Recognition Profiling Data</h2>
                                                <p className="text-sm text-slate-500 font-medium">Extra information for enhanced pilot recognition</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Middle Name</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Middle Name"
                                                            value={middleName}
                                                            onChange={(e) => setMiddleName(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Date of Birth</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            value={dateOfBirth}
                                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Languages</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="English, Spanish, French..."
                                                            value={languages}
                                                            onChange={(e) => setLanguages(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">License Number</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="License Number"
                                                            value={licenseNumber}
                                                            onChange={(e) => setLicenseNumber(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">License Expiry Date</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            value={licenseExpiry}
                                                            onChange={(e) => setLicenseExpiry(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Medical Certificate Class</label>
                                                    <div className="relative">
                                                        <select
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                            value={medicalClass}
                                                            onChange={(e) => setMedicalClass(e.target.value)}
                                                        >
                                                            <option value="">Select Medical Class</option>
                                                            <option value="Class 1">Class 1</option>
                                                            <option value="Class 2">Class 2</option>
                                                            <option value="Class 3">Class 3</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Medical Expiry Date</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            value={medicalExpiry}
                                                            onChange={(e) => setMedicalExpiry(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Medical Country of Issue</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Country of Medical Issue"
                                                            value={medicalCountry}
                                                            onChange={(e) => setMedicalCountry(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Radio License Expiry</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            value={radioLicenseExpiry}
                                                            onChange={(e) => setRadioLicenseExpiry(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <div className="h-px w-full bg-slate-100/80" />

                                        {/* Section: Job Experience */}
                                        <section className="space-y-10">
                                            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Job Experience</h2>
                                                <p className="text-sm text-slate-500 font-medium">Recent job experience and industry aligned accredited programs</p>
                                            </div>

                                            <div className="space-y-6">
                                                {jobExperiences.map((exp, index) => (
                                                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 opacity-60">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2.5">
                                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Job Title</label>
                                                                <input
                                                                    type="text"
                                                                    disabled
                                                                    placeholder="Flight Instructor, First Officer, etc."
                                                                    value={exp.title}
                                                                    onChange={(e) => {
                                                                        const newExps = [...jobExperiences];
                                                                        newExps[index].title = e.target.value;
                                                                        setJobExperiences(newExps);
                                                                    }}
                                                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                                                                />
                                                            </div>
                                                            <div className="space-y-2.5">
                                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Company</label>
                                                                <input
                                                                    type="text"
                                                                    disabled
                                                                    placeholder="Airline, Flight School, etc."
                                                                    value={exp.company}
                                                                    onChange={(e) => {
                                                                        const newExps = [...jobExperiences];
                                                                        newExps[index].company = e.target.value;
                                                                        setJobExperiences(newExps);
                                                                    }}
                                                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                                                                />
                                                            </div>
                                                            <div className="space-y-2.5">
                                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Start Date</label>
                                                                <input
                                                                    type="date"
                                                                    disabled
                                                                    value={exp.startDate}
                                                                    onChange={(e) => {
                                                                        const newExps = [...jobExperiences];
                                                                        newExps[index].startDate = e.target.value;
                                                                        setJobExperiences(newExps);
                                                                    }}
                                                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                                                                />
                                                            </div>
                                                            <div className="space-y-2.5">
                                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">End Date</label>
                                                                <input
                                                                    type="date"
                                                                    disabled
                                                                    value={exp.endDate}
                                                                    onChange={(e) => {
                                                                        const newExps = [...jobExperiences];
                                                                        newExps[index].endDate = e.target.value;
                                                                        setJobExperiences(newExps);
                                                                    }}
                                                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2.5 mt-4">
                                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                                                            <textarea
                                                                disabled
                                                                placeholder="Describe your role, responsibilities, and achievements..."
                                                                value={exp.description}
                                                                onChange={(e) => {
                                                                    const newExps = [...jobExperiences];
                                                                    newExps[index].description = e.target.value;
                                                                    setJobExperiences(newExps);
                                                                }}
                                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed min-h-[100px] resize-none"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            disabled
                                                            onClick={() => {
                                                                const newExps = jobExperiences.filter((_, i) => i !== index);
                                                                setJobExperiences(newExps);
                                                            }}
                                                            className="mt-3 text-sm text-gray-400 font-medium cursor-not-allowed"
                                                        >
                                                            Remove Experience
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    disabled
                                                    onClick={() => setJobExperiences([...jobExperiences, { title: '', company: '', startDate: '', endDate: '', description: '' }])}
                                                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 cursor-not-allowed font-medium text-sm"
                                                >
                                                    + Add Job Experience
                                                </button>
                                            </div>
                                        </section>

                                        <div className="h-px w-full bg-slate-100/80" />

                                        {/* Section: Career Information */}
                                        <section className="space-y-10">
                                            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Career Information</h2>
                                                <p className="text-sm text-slate-500 font-medium">Current employment and career details</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Occupation</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Employed, Unemployed, Student..."
                                                            value={currentOccupation}
                                                            onChange={(e) => setCurrentOccupation(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Employer</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Company Name"
                                                            value={currentEmployer}
                                                            onChange={(e) => setCurrentEmployer(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Current Position</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Job Title"
                                                            value={currentPosition}
                                                            onChange={(e) => setCurrentPosition(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <div className="h-px w-full bg-slate-100/80" />

                                        {/* Section: Additional Information */}
                                        <section className="space-y-10">
                                            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Additional Information</h2>
                                                <p className="text-sm text-slate-500 font-medium">Extra details for comprehensive profile</p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-8">
                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Experience Description</label>
                                                    <div className="relative">
                                                        <textarea
                                                            placeholder="Describe your flight experience, training, and achievements..."
                                                            value={experienceDescription}
                                                            onChange={(e) => setExperienceDescription(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Countries Visited</label>
                                                    <div className="relative">
                                                        <textarea
                                                            placeholder="List of countries you've visited..."
                                                            value={countriesVisited}
                                                            onChange={(e) => setCountriesVisited(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Favorite Aircraft</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Boeing 737, Airbus A320, Cessna 172..."
                                                            value={favoriteAircraft}
                                                            onChange={(e) => setFavoriteAircraft(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Why You Want to Become a Pilot</label>
                                                    <div className="relative">
                                                        <textarea
                                                            placeholder="Share your motivation for becoming a pilot..."
                                                            value={whyBecomePilot}
                                                            onChange={(e) => setWhyBecomePilot(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 group">
                                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Other Skills</label>
                                                    <div className="relative">
                                                        <textarea
                                                            placeholder="Any additional skills or certifications..."
                                                            value={otherSkills}
                                                            onChange={(e) => setOtherSkills(e.target.value)}
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <div className="h-px w-full bg-slate-100/80" />

                                        {/* ATLAS Resume Fields */}
                                        <div className="relative bg-gradient-to-r from-slate-50/50 to-blue-50/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* English Proficiency Level and Last Flown Date moved to main section */}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="h-px w-full bg-slate-100/80" />

                                {/* Section: Goals & Interests */}
                                <section className="space-y-10">
                                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Program & Pathway Interests</h2>
                                        <p className="text-sm text-slate-500 font-medium">Help us understand where you want to go in your career</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-12">
                                        <div className="space-y-4">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Program Interests</label>
                                            <div className="flex flex-wrap gap-3">
                                                {programOptions.map(option => (
                                                    <button
                                                        key={option.id}
                                                        type="button"
                                                        onClick={() => toggleProgram(option.id)}
                                                        className={`px-5 py-3 rounded-2xl border-2 transition-all duration-300 font-bold text-[13px] flex items-center gap-3 ${selectedPrograms.includes(option.id)
                                                            ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                            : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                                                            }`}
                                                    >
                                                        {option.label}
                                                        {selectedPrograms.includes(option.id) && <CheckCircle2 className="w-4 h-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Pathway Specialization</label>
                                            <div className="flex flex-wrap gap-2.5">
                                                {pathwayOptions.map(option => (
                                                    <button
                                                        key={option.id}
                                                        type="button"
                                                        onClick={() => togglePathway(option.id)}
                                                        className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-300 font-bold text-xs flex items-center gap-2 ${selectedPathways.includes(option.id)
                                                            ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                                            : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200 hover:bg-slate-100/80 hover:text-slate-700'
                                                            }`}
                                                    >
                                                        {option.label}
                                                        {selectedPathways.includes(option.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Get More Insight On</label>
                                            <div className="flex flex-wrap gap-2.5">
                                                {insightOptions.map(option => (
                                                    <button
                                                        key={option.id}
                                                        type="button"
                                                        onClick={() => toggleInsight(option.id)}
                                                        className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-300 font-bold text-xs flex items-center gap-2 ${selectedInsights.includes(option.id)
                                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                            : 'border-slate-100 bg-slate-50/30 text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700'
                                                            }`}
                                                    >
                                                        {option.label}
                                                        {selectedInsights.includes(option.id) && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2">
                                        <AlertCircle size={20} />
                                        {error}
                                    </div>
                                )}

                                {/* Footer Actions */}
                                <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <button
                                        type="button"
                                        onClick={onBack}
                                        className="w-full sm:w-auto px-10 py-5 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.5)] active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <button
                                        type="button"
                                        onClick={() => onNavigate('onboarding-pilot-portal')}
                                        className="w-full sm:w-auto px-12 py-5 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-emerald-700 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.5)] active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <span>Get Started</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="text-center mt-12 pb-8">
                                    <h3 className="text-2xl md:text-3xl font-serif text-slate-900">
                                        Join the Pilot Network , Get Recognized
                                    </h3>
                                </div>
                            </form>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};
