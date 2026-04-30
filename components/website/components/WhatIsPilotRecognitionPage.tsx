import React from 'react';
import { Link } from 'react-router-dom';
import { RevealOnScroll } from '../RevealOnScroll';
import { IMAGES } from '../../../src/lib/website-constants';
import { useAuth } from '../../../src/contexts/AuthContext';
import { TopNavbar } from './TopNavbar';
import { LoginModal } from './LoginModal';

interface WhatIsPilotRecognitionPageProps {
    onNavigate: (page: string) => void;
    onLogin: () => void;
    onJoinUs: () => void;
}

const WhatIsPilotRecognitionPage: React.FC<WhatIsPilotRecognitionPageProps> = ({ onNavigate, onLogin, onJoinUs }) => {
    const { currentUser, isLoggedIn } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
    const pilotId = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot';
    const userDisplayName = currentUser?.displayName;
    const userEmail = currentUser?.email;

    return (
        <div className="relative bg-white min-h-screen">
            <TopNavbar
                onNavigate={onNavigate}
                onLogin={onLogin}
                onJoinUs={onJoinUs}
                isLight={true}
                onLoginModalOpen={() => setIsLoginModalOpen(true)}
            />
            {/* Main Content */}
            <div id="membership" className="relative bg-white pt-24 pb-12 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative z-20 mb-12">
                    <RevealOnScroll delay={100}>
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            Programs | Pilot Recognition | Pathways
                        </p>
                        <h1 className="text-3xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            What is Pilot Recognition?
                        </h1>
                        <p className="text-[10px] text-slate-500 mb-8 italic max-w-md mx-auto">
                            Comprehensive pilot credentialing through verified data, EBT/CBTA assessments, and industry-standard portfolio building
                        </p>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mb-12">
                            Your Pilot Recognition Profile serves as your professional beacon to the aviation industry. It captures your flight hours, experience, behavioural scores, cognitive thinking, and constructivism from the Foundation Program if enrolled. This profile tells the industry: look at me, recognize me—this is who I am, this is my experience, this is the program I've completed, and these are my interview assessments. Through direct contact with the industry—including flight schools, type rating centres, operators, private jet sector, airlines, and emerging air taxi and eVTOL sectors—we gather their specific requirements and expectations. Your profile helps you discover opportunities across sectors you may not even know exist. Imagine an operator contacting you: "We've read your profile, we've watched your interview assessment and evaluation—we think you'll be a perfect candidate for us. Are you interested in undergoing this pathway?" Your profile helps you understand what each sector needs and how to align your profile against their standards, making it easier for employers to recognize your capabilities and for you to find opportunities across the aviation landscape.
                        </p>

                        {/* Pilot Journey Animation */}
                        <div className="max-w-6xl mx-auto mb-12">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
                                {/* Step 1: Foundation Program */}
                                <div className="relative group h-full">
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-400 transition-all duration-300 h-full flex flex-col">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white text-sm font-bold mb-3 mx-auto">
                                            1
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 mb-1 text-center">Foundation Program</h3>
                                        <p className="text-[10px] text-blue-600 font-medium text-center mb-2">Preferred, not mandatory</p>
                                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">Complete 50 hours of structured mentorship with EBT/CBTA assessments</p>
                                        <div className="space-y-1.5 mt-auto">
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                <span>W1000 Simulator Training</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                <span>Examination Terminal Access</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                <span>Mentorship Documentation</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                        <div className="w-4 h-4 border-t border-r border-slate-300 rotate-45"></div>
                                    </div>
                                </div>

                                {/* Step 2: Initial Recognition */}
                                <div className="relative group h-full">
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-400 transition-all duration-300 h-full flex flex-col">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 text-white text-sm font-bold mb-3 mx-auto">
                                            2
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 mb-1 text-center">Initial Recognition</h3>
                                        <p className="text-[10px] text-transparent font-medium text-center mb-2">&nbsp;</p>
                                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">Airbus interview and portfolio verification completes your profile</p>
                                        <div className="space-y-1.5 mt-auto">
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                <span>Competency Assessment</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                <span>Airline Oversight Review</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                <span>ATLAS CV Generated</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                        <div className="w-4 h-4 border-t border-r border-slate-300 rotate-45"></div>
                                    </div>
                                </div>

                                {/* Step 3: Pathways Unlocked */}
                                <div className="relative group h-full">
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-400 transition-all duration-300 h-full flex flex-col">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-600 text-white text-sm font-bold mb-3 mx-auto">
                                            3
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 mb-1 text-center">Pathways Unlocked</h3>
                                        <p className="text-[10px] text-transparent font-medium text-center mb-2">&nbsp;</p>
                                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">AI-powered job matching connects your verified profile to opportunities</p>
                                        <div className="space-y-1.5 mt-auto">
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                <span>Private Jets & Charter</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                <span>Air Taxi & eVTOL</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                                <span>Cargo & Commercial</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                        <div className="w-4 h-4 border-t border-r border-slate-300 rotate-45"></div>
                                    </div>
                                </div>

                                {/* Step 4: Recognition Plus */}
                                <div className="relative group h-full">
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border-2 border-red-500 hover:border-red-400 transition-all duration-300 h-full flex flex-col shadow-lg">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-bold mb-3 mx-auto shadow-sm">
                                            4
                                        </div>
                                        <h3 className="text-sm font-bold text-white mb-1 text-center">Recognition Plus</h3>
                                        <p className="text-[10px] text-red-400 font-medium text-center mb-2">Verified Priority Pipeline</p>
                                        <p className="text-xs text-slate-300 mb-3 leading-relaxed">AI-ranked for partner airline hiring surges with interview fast-track</p>
                                        <div className="space-y-1.5 mt-auto">
                                            <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                <span>OEM Aligned Profiles</span>
                                                <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                    Profile aligned with manufacturer standards from Airbus, Boeing, etc.
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                <span>Co-Pilot AI Career Strategist</span>
                                                <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                    AI alerts for hireable milestones and pathway recommendations
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                <span>Wingman Capital Access</span>
                                                <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                    Pre-approved training and type-rating loans
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                <span>Zero-Fail Compliance</span>
                                                <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                    24/7 automated monitoring of licenses and medicals
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-300 group/item relative">
                                                <div className="w-1 h-1 rounded-full bg-red-400"></div>
                                                <span>Predictive Medical Alerts</span>
                                                <div className="hidden group-hover/item:block absolute left-0 top-full mt-1 bg-slate-700 text-white text-[9px] p-2 rounded shadow-lg z-50 w-40">
                                                    60-day warnings with AME slot suggestions
                                                </div>
                                            </div>
                                        </div>
                                        <Link to="/recognition-plus" className="block mt-4 text-center text-[10px] text-red-400 hover:text-red-300 underline font-medium">
                                            Learn more
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ATLAS Resume Header */}
                        <div className="text-center mb-8">
                            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">ATLAS Resume System</p>
                            <h2 className="text-2xl md:text-3xl font-serif text-slate-900">ATS-Approved ATLAS CV Formatting</h2>
                        </div>

                        {/* ATLAS Resume Example */}
                        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                            {/* Header Card */}
                            <div className="bg-red-600 px-6 py-5 border-b border-red-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-red-200 uppercase tracking-[0.2em] mb-1">Pilot Recognition Profile</p>
                                        <h3 className="text-2xl font-bold text-white">{pilotId || 'Pilot'}</h3>
                                        <p className="text-sm text-red-100">PilotRecognition Portfolio</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-red-200 uppercase tracking-[0.2em] mb-2">SHARE LINK</p>
                                        <button className="px-4 py-2 bg-white border border-red-400 rounded-lg text-xs font-medium text-red-700 hover:bg-red-50 transition-colors">
                                            Copy shareable resume URL
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Pilot Credentials */}
                                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                                        <h4 className="text-sm font-bold text-slate-900 mb-1">Pilot Credentials</h4>
                                        <p className="text-xs text-slate-500 mb-4">Licensing, hours, and access pass</p>
                                        
                                        {/* Flight Hours Grid */}
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <div className="bg-slate-50/20 rounded-lg p-3 text-center">
                                                <p className="text-[10px] text-slate-500 mb-1">Total Hours</p>
                                                <p className="text-lg font-bold text-slate-900">0</p>
                                            </div>
                                            <div className="bg-slate-50/20 rounded-lg p-3 text-center">
                                                <p className="text-[10px] text-slate-500 mb-1">Mentorship</p>
                                                <p className="text-lg font-bold text-slate-900">0</p>
                                            </div>
                                            <div className="bg-slate-50/20 rounded-lg p-3 text-center">
                                                <p className="text-[10px] text-slate-500 mb-1">Foundation</p>
                                                <p className="text-lg font-bold text-slate-900">0%</p>
                                            </div>
                                            <div className="bg-slate-50/20 rounded-lg p-3 text-center">
                                                <p className="text-[10px] text-slate-500 mb-1">Recognition</p>
                                                <p className="text-lg font-bold text-slate-900">0</p>
                                            </div>
                                        </div>

                                        {/* Type & Status */}
                                        <div className="bg-slate-50/20 rounded-lg p-3 mb-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs text-slate-500">Type</span>
                                                <span className="text-xs font-bold text-slate-900">Commercial Pilot</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500">Status</span>
                                                <span className="text-xs font-bold text-emerald-600">Pending</span>
                                            </div>
                                        </div>

                                        <a href="#" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                                            View Flight Digital Logbook <span>→</span>
                                        </a>
                                    </div>

                                    {/* Training */}
                                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                                        <h4 className="text-sm font-bold text-slate-900 mb-4">Training</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500">License</span>
                                                <span className="text-xs font-bold text-slate-900">CPL (A)</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500">Medical</span>
                                                <span className="text-xs font-bold text-emerald-600">Class 1 Valid</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500">Type Ratings</span>
                                                <span className="text-xs font-bold text-slate-900">A320 (SEP)</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500">English Proficiency</span>
                                                <span className="text-xs font-bold text-slate-900">Level 6 (Expert)</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500">Languages</span>
                                                <span className="text-xs font-bold text-slate-900">English, Spanish</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Readiness Snapshot */}
                                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">READINESS SNAPSHOT</h4>
                                        <h5 className="text-sm font-bold text-slate-900 mb-4">Resource & Availability</h5>
                                        
                                        <div className="space-y-3">
                                            <div className="bg-slate-50/20 rounded-lg p-3 flex justify-between items-center">
                                                <span className="text-xs text-slate-500">Medical Certificate</span>
                                                <span className="text-xs font-bold text-emerald-600">Not Available</span>
                                            </div>
                                            <div className="bg-slate-50/20 rounded-lg p-3 flex justify-between items-center">
                                                <span className="text-xs text-slate-500">Last Flown</span>
                                                <span className="text-xs font-bold text-slate-900">Not Available</span>
                                            </div>
                                            <div className="bg-slate-50/20 rounded-lg p-3 flex justify-between items-center">
                                                <span className="text-xs text-slate-500">Recognition Score</span>
                                                <span className="text-xs font-bold text-slate-900">0/100</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Experience Section */}
                                <div className="mt-4 bg-white rounded-xl p-5 border border-slate-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-slate-900">Recent Job Experience & Industry Aligned Accredited Programs</h4>
                                        <a href="#" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                                            Edit Experience <span>→</span>
                                        </a>
                                    </div>
                                    
                                    {/* Job Experience Entry */}
                                    <div className="mb-4 pb-4 border-b border-slate-100">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h5 className="text-sm font-semibold text-slate-900">Flight Instructor</h5>
                                                <p className="text-xs text-slate-500">Skyway Aviation Academy</p>
                                            </div>
                                            <span className="text-[10px] text-slate-400">Jan 2024 - Present</span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Providing flight instruction for PPL and CPL students. Specializing in instrument training and multi-engine operations. Logged 350+ instructional hours with 92% student pass rate.
                                        </p>
                                    </div>
                                    
                                    {/* Second Job Experience Entry */}
                                    <div className="mb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h5 className="text-sm font-semibold text-slate-900">First Officer (A320)</h5>
                                                <p className="text-xs text-slate-500">Regional Air Charter Ltd</p>
                                            </div>
                                            <span className="text-[10px] text-slate-400">Jun 2023 - Dec 2023</span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Operated A320 aircraft on European routes. Completed 450+ flight hours including 120+ IFR sectors. Participated in EBT/CBTA assessment program with Competent rating.
                                        </p>
                                    </div>
                                    
                                    <a href="#" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                                        Add your job experience <span>→</span>
                                    </a>
                                </div>
                            </div>

                            <div className="bg-slate-50/20 px-6 py-3 border-t border-slate-200">
                                <p className="text-[10px] text-slate-500 text-center">
                                    This ATLAS-formatted CV is machine-readable by airline ATS systems and includes verified competency data from the PilotRecognition Foundation Program.
                                </p>
                            </div>
                        </div>

                        {/* Recognition Section */}
                        <div className="max-w-7xl mx-auto relative z-10 pt-12 mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch min-h-[350px]">
                                {[
                                    {
                                        corePoint: "Recognition",
                                        title: "ATLAS profile & Pilot Database",
                                        description: "Forget standard resumes. Build an ATLAS-compliant CV optimized for airline AI scanners. Your performance data is hosted in our Verified Pilot Database, allowing partner airlines and manufacturers to \"scout\" your specific competencies before you even apply.",
                                        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8Zh1dNXleqd5z_3TtGQ06ptfB1OE7GXMfzA&s",
                                        delay: 200
                                    },
                                    {
                                        corePoint: "Communication",
                                        title: "Multi-Sector Networking",
                                        description: "Break the \"experience barrier.\" Gain direct communication lines to veteran mentors and scarce insights into the Private Jet (VIP) and Air Taxi (eVTOL) sectors. Connect with the peers and pros who actually control the \"Hidden Job Market.\"",
                                        image: "https://www.pilot-expo.com/wp-content/uploads/2025/10/PE2025-1034-1-600x480.jpg",
                                        delay: 300
                                    },
                                    {
                                        corePoint: "Verification",
                                        title: "The \"New Standard\" Logging",
                                        description: "Be part of the industry's solution to the pilot gap. Access our 20/30 Mentorship Programs to log Verifiable Leadership Hours. We turn your \"soft skills\" into hard data that proves you are ready for the airline environment.",
                                        image: "https://airside.cae.com/media/images/_webp/09-logbookHistory_.png_webp_40cd750bba9870f18aada2478b24840a.webp",
                                        delay: 400
                                    },
                                    {
                                        corePoint: "Insider Knowledge",
                                        title: "Investment Intelligence",
                                        description: "Don't fly blind. Understand Airline & Manufacturer expectations (EBT/CBTA) before you invest $30k in a Type Rating. We provide the recommendations and \"reality checks\" you need to ensure your next step is a hired step.",
                                        image: "/images/homepage-13.png",
                                        delay: 500
                                    }
                                ].map((benefit, index) => (
                                    <RevealOnScroll key={index} delay={benefit.delay} className="h-full">
                                        <div className="flex flex-col h-full group">
                                            {/* Core Point Label */}
                                            <div className="text-center mb-8">
                                                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-600 group-hover:text-blue-800 transition-colors">
                                                    {benefit.corePoint}
                                                </span>
                                            </div>

                                            {/* The Epaulet Bar */}
                                            <div
                                                className="flex-1 px-4 py-4 bg-white rounded-xl flex flex-col items-center text-center transition-all duration-500 hover:shadow-xl relative overflow-hidden group/bar shadow-md"
                                            >
                                                {/* Image Background */}
                                                <div className="absolute inset-0 z-0">
                                                    <img
                                                        src={benefit.image}
                                                        alt={benefit.title}
                                                        className="w-full h-full object-cover opacity-60 group-hover/bar:opacity-70 transition-opacity duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/70 to-transparent"></div>
                                                </div>

                                                {/* Content */}
                                                <div className="relative z-10 flex flex-col h-full">
                                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 leading-tight">
                                                        {benefit.title}
                                                    </h3>
                                                    <p className="text-slate-600 text-sm leading-relaxed font-sans">
                                                        {benefit.description}
                                                    </p>

                                                    <div className="mt-auto pt-4">
                                                        <div className="w-px h-16 bg-gradient-to-b from-slate-900/10 to-transparent mx-auto"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </RevealOnScroll>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Accreditation and Recognition Logos - Marquee (Full Width) */}
                <div className="relative w-full overflow-hidden bg-white pb-10">
                    <div className="relative w-full pt-8">
                        <div className="text-center relative z-10 mb-6">
                            <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-blue-700 mb-2">
                                RECOGNITION | ASSURANCE | SUPPORT
                            </p>
                            <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                Strategic presence at the Etihad Museum UAE Career Fair, represented by leading aviation governing bodies.
                            </p>
                        </div>

                        <div className="relative py-6 z-10 flex overflow-hidden group">
                            {/* Gradient Masks for Fade/Glass Effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20"></div>

                            <div className="flex gap-16 animate-marquee whitespace-nowrap min-w-full pl-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex gap-16 items-center shrink-0">
                                        <img src={IMAGES.ACCREDITATION_1} alt="FAA" className="h-14 w-auto object-contain" />
                                        <img src={IMAGES.ACCREDITATION_3} alt="GCAA" className="h-14 w-auto object-contain" />
                                        <img src={IMAGES.ACCREDITATION_4} alt="Airbus" className="h-16 w-auto object-contain" />
                                        <img src={IMAGES.ACCREDITATION_5} alt="WM Group" className="h-16 w-auto object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Join The Network Section */}
                <div className="relative py-8 md:py-12 px-4 md:px-6 bg-slate-900 overflow-hidden">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto">
                            <h2 className="text-2xl md:text-4xl font-serif text-slate-900 mb-8 leading-tight text-center">
                                Create Your Pilot Recognition Profile
                            </h2>

                            <button
                                onClick={onJoinUs}
                                className="w-full max-w-md bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold uppercase tracking-[0.15em] transition-all shadow-lg flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 mb-4 mx-auto"
                            >
                                Create Account
                            </button>

                            <button
                                onClick={onLogin}
                                className="w-full max-w-md bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-xl font-bold uppercase tracking-[0.15em] transition-all shadow-lg border-2 border-slate-200 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-95 mb-8 mx-auto"
                            >
                                Sign in with Google
                            </button>

                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold">+</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">Recognition Plus</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            Unlock premium features including AI-powered career matching, priority pathway access, and verified competency scoring. <Link to="/recognition-plus" className="text-blue-600 hover:underline">Learn more</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onNavigate={onNavigate}
            />
        </div>
    );
};

export default WhatIsPilotRecognitionPage;
