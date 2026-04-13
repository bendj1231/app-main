
import React, { useState } from 'react';
import { ArrowLeft, User, Lock, Mail, MapPin, School, Phone, Clock, Award, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, Calendar, Globe, Flag, Plane, AlertCircle } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { useAuth } from '@/src/contexts/AuthContext';

interface BecomeMemberPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const BecomeMemberPage: React.FC<BecomeMemberPageProps> = ({ onBack, onNavigate, onLogin }) => {

    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

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
                                src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                alt="WingMentor Logo"
                                className="mx-auto w-64 h-auto object-contain mb-8 drop-shadow-sm"
                            />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tight leading-none mb-2">
                                First Step Towards Pilot Recognition
                            </h1>
                            <p className="text-sm md:text-base mb-8" style={{ color: '#DAA520' }}>
                                Programs | Pilot Recognition | Pathways
                            </p>

                            <div className="flex justify-center">
                                <div className="px-6 py-4 bg-white/80 backdrop-blur-md border border-blue-200/50 rounded-3xl shadow-sm max-w-2xl mx-auto">
                                    <p className="text-sm font-medium text-slate-700 text-center leading-relaxed">
                                        The information provided below will be scanned and formed into a default <span className="font-bold text-blue-900">ATLAS CV format</span> which you will be able to edit throughout your program & pathways.
                                        <span className="block mt-1 text-xs text-slate-500 italic">
                                            Note: Your detailed information will be read and seen by various airlines, aircraft manufacturers, Air Taxi Operators and various Pathways which WingMentor provides.
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
                                    Welcome to WingMentor
                                </h2>
                                
                                <p className="text-lg text-slate-600 mb-6">
                                    Thank you for successfully creating your account!
                                </p>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                                    <p className="text-sm text-slate-700 mb-2">
                                        <strong>Verification email sent</strong>
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        Please check your inbox at <span className="font-semibold text-blue-900">{email}</span> and click the verification link to activate your account.
                                    </p>
                                </div>
                                
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500">
                                        Once verified, you can access your Pilot Recognition Profile and begin your journey.
                                    </p>
                                    
                                    <button
                                        onClick={onLogin}
                                        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        Continue to Login
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
                                        insightInterests: selectedInsights
                                    });
                                    setSignupSuccess(true);
                                } catch (err: any) {
                                    console.error("Signup failed", err);
                                    setError(err.message || "Failed to create account");
                                } finally {
                                    setLoading(false);
                                }
                            }}>

                                {/* Section: Account Credentials */}
                                <section className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Credentials</h2>
                                            <p className="text-sm text-slate-500 font-medium italic">Think of this as the Ident of the aircraft you are flying—your unique signature in the sky. Use your Name, Personal Callsign, or a favorite Tailnumber.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2.5 group">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Pilot ID</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Pilot ID (Name, Personal Callsign, or Tailnumber)"
                                                    value={pilotId}
                                                    onChange={(e) => setPilotId(e.target.value)}
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5 group">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Email Address</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    placeholder="pilot@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 placeholder:text-slate-400"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5 group">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Password</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 placeholder:text-slate-400"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px w-full bg-slate-100/80" />

                                {/* Section: Personal Details */}
                                <section className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Details</h2>
                                            <p className="text-sm text-slate-500 font-medium">Tell us more about yourself and your background</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2.5 group">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Captain John Doe"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2.5 group">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={dob}
                                                        onChange={(e) => setDob(e.target.value)}
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 group">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Flight School Address</label>
                                            <div className="relative">
                                                <textarea
                                                    placeholder="Aviation Way, Sector 4, Global Flight Academy..."
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 min-h-[80px] placeholder:text-slate-400 placeholder:font-normal resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2.5 group">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Residing Country</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="United Arab Emirates"
                                                        value={residingCountry}
                                                        onChange={(e) => setResidingCountry(e.target.value)}
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2.5 group">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nationality</label>
                                                <div className="relative">
                                                    <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                    <select
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 appearance-none bg-no-repeat"
                                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                                                        value={nationality}
                                                        onChange={(e) => setNationality(e.target.value)}
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
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={contactNumber}
                                                    onChange={(e) => setContactNumber(e.target.value)}
                                                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px w-full bg-slate-100/80" />

                                {/* Section: Pilot Profile */}
                                <section className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pilot Profile</h2>
                                            <p className="text-sm text-slate-500 font-medium">Overview of your current flight qualification</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2.5 group">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilot License ID Code Number</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter License ID Number"
                                                        value={licenseId}
                                                        onChange={(e) => setLicenseId(e.target.value)}
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 group">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Country of License</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 appearance-none bg-no-repeat"
                                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
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
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Flight Hours</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 250"
                                                        value={currentFlightHours}
                                                        onChange={(e) => setCurrentFlightHours(e.target.value)}
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 text-lg placeholder:text-slate-400 placeholder:font-normal"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Ratings & Endorsements</label>
                                            <div className="p-6 bg-slate-50/80 border border-slate-200 rounded-[2rem] space-y-4">
                                                {ratingsOptions.map(option => (
                                                    <label
                                                        key={option.id}
                                                        className="flex items-center gap-4 group cursor-pointer"
                                                    >
                                                        <div className="relative flex items-center justify-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRatings.includes(option.id)}
                                                                onChange={() => toggleRating(option.id)}
                                                                className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-lg checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                                            />
                                                            <CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <span className={`text-sm font-bold transition-colors ${selectedRatings.includes(option.id) ? 'text-blue-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                                                {option.label}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 flex items-start gap-3">
                                                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                                <p className="text-[11px] leading-relaxed text-amber-900/80 font-semibold">
                                                    Accurate ratings selection ensures you are assigned to the correct syllabus within the WingMentor ecosystem.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Pilot Info: Aircraft & Experience */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                                        <div className="space-y-4">
                                            <div className="space-y-2.5 group">
                                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Aircraft Rated On</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. C172, PA28, B737, A320..."
                                                        value={aircraftRatedOn}
                                                        onChange={(e) => setAircraftRatedOn(e.target.value)}
                                                        className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5 group">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Description</label>
                                            <textarea
                                                placeholder="Briefly describe your flight experience, operational background, or specific aviation goals..."
                                                value={experienceDescription}
                                                onChange={(e) => setExperienceDescription(e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 min-h-[120px] placeholder:text-slate-400 placeholder:font-normal resize-none"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px w-full bg-slate-100/80" />

                                {/* Section: Goals & Interests */}
                                <section className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Program & Pathway Interests</h2>
                                            <p className="text-sm text-slate-500 font-medium">Help us understand where you want to go in your career</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-12">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Interests</label>
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
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Pathway Specialization</label>
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
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Get More Insight On</label>
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
    );
};
