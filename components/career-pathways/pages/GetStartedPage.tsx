import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { CareerPathwaysNavbar } from '../layout/CareerPathwaysNavbar';
import { BreadcrumbSchema } from '../../website/components/seo/BreadcrumbSchema';
import { shouldEnable3DEffects } from '@/lib/device-detection';
import { DataControllerAgreementModal } from '../../website/components/DataControllerAgreementModal';
import { WalletFirstCredentialFlow } from '../../website/components/WalletFirstCredentialFlow';
import { issueAndStoreCredential } from '@/lib/wallet';

const COUNTRIES = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
    'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
    'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
    'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (DRC)','Congo (Republic)',
    'Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador',
    'Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France',
    'Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau',
    'Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland',
    'Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan',
    'Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar',
    'Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia',
    'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal',
    'Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan',
    'Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
    'Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia',
    'Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa',
    'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan',
    'Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan',
    'Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City',
    'Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
];

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
);


const LICENSE_ACCESS_MATRIX: Record<string, {
    terminal: string;
    color: string;
    dotColor: string;
    access: string[];
    restricted: string[];
}> = {
    'Student Pilot': {
        terminal: 'Terminal 2 — Cadet Track',
        color: '#f59e0b',
        dotColor: '#fbbf24',
        access: [
            'View all public pathways',
            'Browse flight school & cadet programs',
            'Submit interest to T2 cadet pathways',
            'Build recognition profile & logbook',
            'Veremark course check — Currently Enrolled, Course Completion, or Hours Verified',
            'No hours required — enrollment confirmation alone validates active student status',
            'Course completion badge — confirms finished ground school or phase milestones',
            'Verified status — confirms valid active student to operators & programs',
            'Verified status — unlocks eligibility for cadet scholarship & foundation programs',
            'ATO visibility — enrolled profile discoverable by ATOs scouting next intake pipelines',
            'Post-completion lock-in — operators can secure your interest before you finish the course',
            'Annual re-verification — refreshes enrollment, completion & hours each training year',
            'Annual re-verification — keeps profile current & visible to T2 operators year-on-year',
        ],
        restricted: ['Submit interest to T3 airline gates', 'Access enterprise operator dashboard'],
    },
    'Cadet': {
        terminal: 'Terminal 2 — Cadet Track',
        color: '#f59e0b',
        dotColor: '#fbbf24',
        access: [
            'View all public pathways',
            'Browse cadet & ab-initio programs',
            'Submit interest to T2 cadet pathways',
            'Build recognition profile & logbook',
            'Veremark course check — Currently Enrolled, Course Completion, or Hours Verified',
            'No hours required — enrollment confirmation alone validates active cadet status',
            'Course completion badge — confirms finished ground school or phase milestones',
            'Verified status — confirms valid active cadet to operators & programs',
            'Verified status — unlocks eligibility for cadet scholarship & foundation programs',
            'ATO visibility — enrolled profile discoverable by ATOs scouting next intake pipelines',
            'Post-completion lock-in — operators can secure your interest before you finish the course',
            'Annual re-verification — refreshes enrollment, completion & hours each training year',
            'Annual re-verification — keeps profile current & visible to T2 operators year-on-year',
        ],
        restricted: ['Submit interest to T3 airline gates', 'Access enterprise operator dashboard'],
    },
    'Private Pilot': {
        terminal: 'Terminal 2 — Private Track',
        color: '#3b82f6',
        dotColor: '#93c5fd',
        access: [
            'View all public pathways',
            'Browse private & charter pathways',
            'Submit interest to T2 private pathways',
            'Build recognition profile & logbook',
            'Veremark license & medical verification',
            'Verified status — confirms valid private pilot credentials',
            'Verified status — unlocks eligibility for private charter & business aviation',
            'Operator visibility — discoverable by private operators seeking experienced pilots',
            'Annual re-verification — maintains current license & medical status',
        ],
        restricted: ['Submit interest to T3 airline gates', 'Access enterprise operator dashboard'],
    },
    'Commercial Pilot': {
        terminal: 'Terminal 3 — Professional Track',
        color: '#10b981',
        dotColor: '#86efac',
        access: [
            'Full access to all pathways (T1, T2, T3)',
            'Submit interest to airline pathways',
            'Build comprehensive recognition profile',
            'Veremark full credential verification (license, medical, employment)',
            'Verified status — maximum credibility to all operators',
            'Priority matching for airline pathways',
            'Direct operator outreach capabilities',
            'Annual re-verification — maintains professional standing',
        ],
        restricted: ['Access enterprise operator dashboard'],
    },
    'Airline Transport Pilot': {
        terminal: 'Terminal 3 — Professional Track',
        color: '#10b981',
        dotColor: '#86efac',
        access: [
            'Full access to all pathways (T1, T2, T3)',
            'Submit interest to airline pathways',
            'Build comprehensive recognition profile',
            'Veremark full credential verification (license, medical, employment)',
            'Verified status — maximum credibility to all operators',
            'Priority matching for airline pathways',
            'Direct operator outreach capabilities',
            'Annual re-verification — maintains professional standing',
        ],
        restricted: ['Access enterprise operator dashboard'],
    },
    'Flight Instructor': {
        terminal: 'Terminal 3 — Professional Track',
        color: '#10b981',
        dotColor: '#86efac',
        access: [
            'Full access to all pathways (T1, T2, T3)',
            'Submit interest to airline pathways',
            'Build comprehensive recognition profile',
            'Veremark full credential verification (license, medical, employment)',
            'Verified status — maximum credibility to all operators',
            'Priority matching for airline pathways',
            'Direct operator outreach capabilities',
            'Annual re-verification — maintains professional standing',
        ],
        restricted: ['Access enterprise operator dashboard'],
    },
};

export const GetStartedPage: React.FC = () => {
    const { loginWithRedirect, user, isLoading } = useAuth0();
    const [showDataControllerModal, setShowDataControllerModal] = useState(false);
    const [showWalletFlow, setShowWalletFlow] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        licenseType: '',
        licenseNumber: '',
        totalHours: '',
        instrumentHours: '',
        multiEngineHours: '',
        employmentStatus: '',
        seeking: '',
        bio: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [enable3D, setEnable3D] = useState(false);

    useEffect(() => {
        setEnable3D(shouldEnable3DEffects());
    }, []);

    const handleGoogleLogin = async () => {
        try {
            await loginWithRedirect({
                appState: { returnTo: '/get-started' },
                connection: 'google-oauth2'
            } as any);
        } catch (error) {
            console.error('Google login error:', error);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'licenseType') {
            setSelectedLicense(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Here you would typically save to D1 via Worker API
            // For now, just simulate success
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitStatus('success');
            
            // Show wallet flow after successful submission
            setTimeout(() => {
                setShowWalletFlow(true);
            }, 1000);
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentLicense = LICENSE_ACCESS_MATRIX[selectedLicense];

  return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: '/' },
                    { name: 'Get Started', url: '/get-started' }
                ]}
            />
            
            <div className="min-h-screen bg-slate-950 text-white flex flex-col relative">
                {/* Background */}
                <div className="fixed inset-0 z-0 overflow-hidden">
                    {enable3D && createPortal(
                        <MeshGradient
                            colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
                            speed={0.22}
                        />,
                        document.body
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
                    <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
                </div>

                <CareerPathwaysNavbar />

                {/* Hero Section */}
                <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 py-8 overflow-hidden">
                    <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16">

                        {/* Left: Hero text */}
                        <div className="flex-1 text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] mb-3 text-white">
                                Connecting Pilots<br />
                                <span className="text-red-500">to the Industry.</span>
                            </h1>
                            <p className="text-slate-300 text-sm mb-8">Free access to Programs, Pathways & Pilot Recognition</p>

                            {/* Recognition+ upsell */}
                            <div className="border border-white/20 bg-white/5 rounded-xl p-5 max-w-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-red-500 text-xs font-black tracking-widest uppercase">Recognition+</span>
                                </div>
                                <p className="text-white font-bold text-sm mb-1">Get the Recognition Your Training, Logbook, and Pilot Career Deserves</p>
                                <p className="text-white/75 text-xs leading-relaxed mb-3">
                                    Secure and verify your Pilot Identity Credentials (PIC) for Priority Recognition.
                                </p>
                                <ul className="space-y-2.5 mb-4">
                                    {[
                                        { bold: 'Global Standard Verification:', body: 'Direct outreach matching international standards. Full licensure and qualification audits for CPL, PPL, IR, ME, and ATPL handled seamlessly through regional verification providers.' },
                                        { bold: 'Medical & Logbook Auditing:', body: 'Comprehensive checks on Medical Class 1, 2, and 3. Rigorous flight logbook hour validation and flagged notation capture executed natively via regional flight logbook providers and civil aviation authority handling.' },
                                        { bold: 'Fast-Track Placement:', body: 'Gain an immediate competitive edge with priority listing on our automated Pathway Interest Pooling.' },
                                        { bold: 'Exclusive Tier Access:', body: 'Unlock premium, direct connections to Private Charter and Business Aviation Pathways for serious pilots.' },
                                    ].map((point) => (
                                        <li key={point.bold} className="flex items-start gap-2 text-xs text-white/90">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                            <span><span className="font-bold text-red-500">{point.bold}</span> {point.body}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4">
                                    <p className="text-amber-300 text-xs font-bold text-center">
                                        Invite co-pilots to earn $20 USD for every Recognition+ subscription with your unique code
                                    </p>
                                </div>
                                <button
                                    onClick={() => {}}
                                    className="w-full py-2.5 text-xs font-black tracking-widest text-white rounded-lg bg-red-600 hover:bg-red-700 transition-all"
                                >
                                    UPGRADE NOW — $120/YEAR
                                </button>
                                <p className="text-white/40 text-[10px] text-center mt-2 leading-snug">
                                    Processing infrastructure fees are distributed securely on-chain via a decentralized gateway to our respective integration nodes.
                                </p>
                            </div>
                        </div>

                        {/* Right: Signup card */}
                        <div className="w-full md:w-[400px] flex-shrink-0">
                            <p className="text-white font-bold text-base mb-3 text-center">Create a Free Account</p>

                            {/* Card */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                {/* Consent checkbox */}
                                <label className="flex items-start gap-3 mb-4 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0 cursor-pointer"
                                    />
                                    <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                        I am 16 or older and I agree to the{' '}
                                        <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-white underline">Terms of Service</a>,{' '}
                                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-white underline">Privacy Policy</a>, and{' '}
                                        <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" className="text-white underline">Data Controller Agreement</a>.
                                    </span>
                                </label>

                                {/* Google signup */}
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl transition-all duration-200 mb-3 shadow-sm"
                                >
                                    <GoogleIcon />
                                    Sign up with Google
                                </button>

                                {/* Divider */}
                                <div className="relative my-5">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-3 bg-transparent text-slate-500 text-xs">or</span>
                                    </div>
                                </div>

                                {/* Email signup */}
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-blue-600/20"
                                >
                                    Sign up with Email
                                </button>

                                {/* Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10" />
                                    </div>
                                </div>

                                {/* What you get */}
                                <ul className="space-y-2.5 mb-6">
                                    {[
                                        'Free pilot recognition profile',
                                        'Access to airline pathway cards',
                                        'Programs & training roadmaps',
                                        'ATLAS CV builder',
                                    ].map((item) => (
                                        <li key={item} className="flex items-center gap-2.5 text-sm text-white">
                                            <span className="w-4 h-4 rounded-full bg-[#00b4d8]/20 flex items-center justify-center flex-shrink-0">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                {/* Already have account */}
                                <p className="text-center text-sm text-slate-300">
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                                        className="text-[#00b4d8] hover:text-white font-semibold transition-colors"
                                    >
                                        Sign in
                                    </button>
                                </p>
                            </div>

                            {/* Neutral disclaimer */}
                            <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                                Your data is encrypted on your device before it reaches us. We cannot read, modify, or monetize your personal information.
                            </p>
                            <p className="text-center text-xs text-slate-500 mt-2">
                                powered by pilot<span className="text-red-500">recognition</span>.com
                            </p>
                        </div>{/* end right column */}
                    </div>{/* end flex row */}
                </div>

                {/* License Selection */}
                {selectedLicense && currentLicense && (
                    <section className="border-y border-slate-800 bg-slate-900/50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex items-center gap-4">
                                <div 
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: currentLicense.dotColor }}
                                >
                                    <div 
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: currentLicense.color }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {currentLicense.terminal}
                                    </h3>
                                    <p className="text-slate-400 text-sm">
                                        Based on your {selectedLicense} credentials
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-6 grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-white font-medium mb-3">✓ What You'll Access</h4>
                                    <ul className="space-y-2">
                                        {currentLicense.access.slice(0, 5).map((item, idx) => (
                                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                                <span className="text-green-400 mt-0.5">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-slate-400 font-medium mb-3">○ Premium Features</h4>
                                    <ul className="space-y-2">
                                        {currentLicense.restricted.map((item, idx) => (
                                            <li key={idx} className="text-sm text-slate-500 flex items-start gap-2">
                                                <span className="text-slate-600 mt-0.5">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Registration Form */}
                <section className="py-16">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Country *
                                        </label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="">Select your country</option>
                                            {COUNTRIES.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* License Information */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">License Information</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            License Type *
                                        </label>
                                        <select
                                            name="licenseType"
                                            value={formData.licenseType}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="">Select license type</option>
                                            {Object.keys(LICENSE_ACCESS_MATRIX).map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            License Number
                                        </label>
                                        <input
                                            type="text"
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="1234567"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Total Flight Hours
                                        </label>
                                        <input
                                            type="number"
                                            name="totalHours"
                                            value={formData.totalHours}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="250"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Instrument Hours
                                        </label>
                                        <input
                                            type="number"
                                            name="instrumentHours"
                                            value={formData.instrumentHours}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Career Information */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">Career Information</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Current Employment Status
                                        </label>
                                        <select
                                            name="employmentStatus"
                                            value={formData.employmentStatus}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="">Select status</option>
                                            <option value="student">Student Pilot</option>
                                            <option value="unemployed">Unemployed</option>
                                            <option value="employed">Employed</option>
                                            <option value="self-employed">Self-Employed</option>
                                            <option value="contractor">Contractor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Seeking Opportunities
                                        </label>
                                        <select
                                            name="seeking"
                                            value={formData.seeking}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="">What are you seeking?</option>
                                            <option value="first-officer">First Officer Position</option>
                                            <option value="captain">Captain Position</option>
                                            <option value="flight-instructor">Flight Instructor</option>
                                            <option value="charter-pilot">Charter Pilot</option>
                                            <option value="corporate-pilot">Corporate Pilot</option>
                                            <option value="cadet-program">Cadet Program</option>
                                            <option value="type-rating">Type Rating</option>
                                            <option value="networking">Networking</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Bio / Professional Summary
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Tell us about your aviation background and career goals..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Creating Profile...' : 'Create My Profile'}
                                </button>
                                
                                {submitStatus === 'success' && (
                                    <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-lg">
                                        <p className="text-green-400 font-medium">Profile created successfully!</p>
                                        <p className="text-green-300 text-sm mt-1">Redirecting to your PIC setup...</p>
                                    </div>
                                )}
                                
                                {submitStatus === 'error' && (
                                    <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                                        <p className="text-red-400 font-medium">Error creating profile</p>
                                        <p className="text-red-300 text-sm mt-1">Please try again or contact support</p>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </section>

                {/* Data Controller Agreement Modal */}
                {showDataControllerModal && (
                    <DataControllerAgreementModal
                        isOpen={showDataControllerModal}
                        onClose={() => setShowDataControllerModal(false)}
                        onAgree={() => {
                            setShowDataControllerModal(false);
                            // Continue with flow
                        }}
                    />
                )}


                {/* Wallet First Credential Flow */}
                {showWalletFlow && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-xl font-semibold text-white mb-4">PIC Setup</h3>
                            <p className="text-slate-300 mb-6">Your PIC credentials will be set up here.</p>
                            <button
                                onClick={() => setShowWalletFlow(false)}
                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GetStartedPage;
