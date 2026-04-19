import React, { useState } from 'react';
import { ArrowLeft, Target, Users, Brain, Award, CheckCircle2, Briefcase, Shield, Search, Zap, Globe, Cpu, MapPin, Plane } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface Airline {
  id: string;
  name: string;
  location: string;
  salaryRange: string;
  flightHours: string;
  tags: string[];
  image: string;
  description: string;
  locationFlag?: string;
  fleet?: string;
}

interface AirlineExpectationsPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
    selectedAirline?: Airline;
}

export const AirlineExpectationsPage: React.FC<AirlineExpectationsPageProps> = ({ onBack, onNavigate, onLogin, selectedAirline }) => {
    const [showMockDataModal, setShowMockDataModal] = useState(false);

    // Calculate dynamic match score based on airline
    const getMatchScore = (airline: Airline) => {
        // Generate a score based on airline characteristics
        const scoreMap: { [key: string]: number } = {
            'qatar': 87,
            'singapore': 92,
            'cathay': 85,
            'emirates': 89,
            'etihad': 84,
            'lufthansa': 88,
            'british': 86,
            'airfrance': 83,
            'klm': 81,
            'qantas': 90,
            'ana': 91,
            'delta': 82,
            'united': 80,
            'american': 79,
            'fiji': 75,
            'airnz': 93,
            'real-tonga': 70,
            'vanuatu': 72,
            'solomons': 68,
            'air-niugini': 74,
            'nauru': 71
        };
        return scoreMap[airline.id] || 85;
    };

    const getCompetencyScores = (airline: Airline) => {
        const baseScore = getMatchScore(airline);
        return {
            technical: Math.min(baseScore + 5, 98),
            leadership: baseScore - 2,
            decision: baseScore + 3,
            innovation: baseScore - 4
        };
    };

    const coreExpectations = [
        {
            title: "Technical Mastery",
            desc: "Beyond handling skills, airlines assess your mastery of automation, systems logic, and manual flight path management. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that technical competencies align with the exacting standards required by leading manufacturers. Our <strong>9 core competencies framework</strong> specifically addresses technical proficiency through competencies like <strong>aircraft systems knowledge</strong>, <strong>automation management</strong>, and <strong>manual flying skills</strong>.",
            icon: Cpu,
            bullets: ["Automation Logic", "Manual Precision", "Systems Mastery"]
        },
        {
            title: "Behavioral Competency",
            desc: "Evaluations focus on your ability to work within a crew, demonstrating CRM, leadership, and effective communication. Our Foundational Program's <strong>50 hours of verifiable logged effort-based mentorship</strong> ensures that behavioral competencies are developed through practical experience. The <strong>CRM (Crew Resource Management)</strong> competency specifically evaluates your ability to communicate respectfully, listen actively, and contribute constructively to crew decisions.",
            icon: Users,
            bullets: ["CRM Excellence", "Decision Making", "Balanced Leadership"]
        },
        {
            title: "Cognitive Resilience",
            desc: "Assessment of situational awareness, workload management, and the ability to solve complex problems under pressure. Through our <strong>EBT CBTA-aligned assessment framework</strong>, we evaluate cognitive competencies including <strong>situational awareness</strong>, <strong>workload management</strong>, and <strong>decision making</strong> under pressure. Our recognition-based profiling provides objective assessment of these cognitive markers, giving operators confidence in your ability to handle demanding operational scenarios.",
            icon: Brain,
            bullets: ["Mental Math", "Situational Awareness", "Workload Management"]
        },
        {
            title: "Professional Persona",
            desc: "Your commitment to the airline's values, safety culture, and long-term professional development/career stewardship. We foster a culture of respect where every voice is heard, from the cadet to the captain. Our <strong>pathway matching system</strong> treats all pilots objectively based on verified competencies and recognition scores, ensuring fair and equitable access to career opportunities based on demonstrated professional capability rather than connections.",
            icon: Shield,
            bullets: ["Safety Culture", "Company Fit", "Ethics & Integrity"]
        }
    ];

    const assessmentPipeline = [
        { title: "Screening", value: "Initial digital audit of your ATLAS CV and minimum legal credentials.", icon: Search },
        { title: "Psychometrics", value: "Advanced testing of cognitive ability, spatial awareness, and personality fit.", icon: Target },
        { title: "Technical/HR", value: "Multi-stage interviews focusing on competency-based responses and SOP knowledge.", icon: Briefcase },
        { title: "Simulator Audit", value: "Practical demonstration of EBT/CBTA competencies in a multi-crew environment.", icon: Zap }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section - matching AboutPage style */}
            <div className={selectedAirline ? "pt-12 pb-8 px-6" : "pt-32 pb-12 px-6"}>
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            Strategic Career Guidance
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Airline Requirements Search
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Requirements | Expectations | Career Pathways
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
                            Understanding what airlines really look for in pilot candidates—beyond the 1,500-hour requirement.
                            We bridge the gap between "having the hours" and "being the right candidate." Through our <strong>AI-powered pathway matching</strong> system,
                            we analyze your verified PilotRecognition profile against airline requirements to identify optimal career opportunities.
                            Our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong> ensures that the expectations we provide
                            align with the exacting standards required by leading manufacturers and operators.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Selected Airline Hero Section - Netflix-style */}
            {selectedAirline && (
                <div className="relative h-[70vh] min-h-[500px]">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={selectedAirline.image}
                            alt={selectedAirline.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative h-full flex items-end pb-16 px-6 md:px-12">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400 bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-400/30 backdrop-blur-sm">
                                    SELECTED AIRLINE
                                </span>
                                <div className="flex items-center gap-2 text-sm text-white/80">
                                    <MapPin className="w-4 h-4" />
                                    {selectedAirline.location}
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-4 leading-tight">
                                {selectedAirline.name}
                            </h1>

                            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6 max-w-2xl">
                                {selectedAirline.description}
                            </p>

                            {selectedAirline.fleet && (
                                <div className="mb-6">
                                    <p className="text-sm text-white/70 mb-2">
                                        <span className="font-semibold text-white">Fleet:</span> {selectedAirline.fleet}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex items-center gap-2 bg-emerald-500/30 backdrop-blur-sm px-5 py-3 rounded-lg border border-emerald-400/30">
                                    <span className="text-emerald-300 font-semibold">{selectedAirline.salaryRange}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm px-5 py-3 rounded-lg border border-blue-400/30">
                                    <span className="text-blue-300 font-semibold">{selectedAirline.flightHours}</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {selectedAirline.tags.slice(0, 4).map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Airline-Specific Content - Only shown when airline is selected */}
            {selectedAirline && (
                <div className="py-16 px-6 bg-slate-50">
                    <div className="max-w-6xl mx-auto">
                        {/* Requirements Section */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">Pilot Requirements</h2>
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <span className="text-amber-600 font-bold text-lg mt-0.5">!</span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 mb-1">Last Updated Notice</p>
                                            <p className="text-xs text-slate-600">Requirements information was last updated on January 15, 2026. Please verify current requirements directly with {selectedAirline.name} as policies may change.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Minimum Qualifications</h3>
                                        <ul className="space-y-3 text-slate-600">
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span><strong>{selectedAirline.flightHours}</strong> Total Flight Time</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span>Valid Airline Transport Pilot License (ATPL) or Commercial Pilot License (CPL)</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span>ICAO English Language Proficiency Level 4 or higher</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span>Class 1 Medical Certificate valid for airline operations</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span>Multi-Engine Instrument Rating</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Preferred Qualifications</h3>
                                        <ul className="space-y-3 text-slate-600">
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span>Type Rating on aircraft in the {selectedAirline.name} fleet</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span>Previous airline or commercial aviation experience</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span>Evidence-Based Training (EBT) and Competency-Based Training & Assessment (CBTA) certification</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span>Multi-Crew Coordination (MCC) course completion</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="text-slate-400 mt-1">•</span>
                                                <span>Recent line experience within the last 12 months</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Aircraft Fleet Section */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">Aircraft Fleet</h2>
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                <p className="text-slate-700 leading-relaxed mb-6 text-lg">
                                    {selectedAirline.fleet}
                                </p>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-blue-600 pl-4">
                                        <h4 className="font-bold text-slate-800 mb-1">Wide-Body Aircraft</h4>
                                        <p className="text-slate-600">Boeing 777, Boeing 787 Dreamliner, Airbus A350 XWB, Airbus A380</p>
                                    </div>
                                    <div className="border-l-4 border-emerald-600 pl-4">
                                        <h4 className="font-bold text-slate-800 mb-1">Narrow-Body Aircraft</h4>
                                        <p className="text-slate-600">Airbus A320 Family, Boeing 737 MAX (where applicable)</p>
                                    </div>
                                    <div className="border-l-4 border-purple-600 pl-4">
                                        <h4 className="font-bold text-slate-800 mb-1">Regional Fleet</h4>
                                        <p className="text-slate-600">ATR 72, Embraer E-Jet family (regional operations)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Future Goals & Insights Section */}
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-200">Future Goals & Strategic Insights</h2>
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-3">Strategic Vision</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {selectedAirline.name} continues to expand its global network with a strategic focus on sustainable aviation initiatives, digital transformation of operations, and enhancing the overall passenger experience. The airline is committed to significantly reducing its carbon footprint through comprehensive fleet modernization programs, implementation of sustainable aviation fuels (SAF), and operational efficiency improvements across all business units.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-3">Key Growth Areas</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                <h4 className="font-semibold text-slate-800 mb-2">Sustainable Aviation</h4>
                                                <p className="text-slate-600 text-sm">Carbon neutrality targets, SAF integration, and eco-efficient operations</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                <h4 className="font-semibold text-slate-800 mb-2">Digital Innovation</h4>
                                                <p className="text-slate-600 text-sm">AI-powered operations, advanced analytics, and passenger experience technology</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                <h4 className="font-semibold text-slate-800 mb-2">Market Expansion</h4>
                                                <p className="text-slate-600 text-sm">New route development, strategic partnerships, and emerging market penetration</p>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                                <h4 className="font-semibold text-slate-800 mb-2">Fleet Modernization</h4>
                                                <p className="text-slate-600 text-sm">Next-generation aircraft acquisition and retirement of legacy fleet</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-3">Career Development Opportunities</h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            With ambitious expansion plans and a commitment to internal talent development, {selectedAirline.name} offers exceptional career progression opportunities for motivated pilots. The airline places significant emphasis on continuous learning through comprehensive training programs, mentorship initiatives, and structured career pathways from First Officer to Captain and beyond. Pilots can expect exposure to diverse aircraft types, international routes, and leadership development programs designed to foster long-term professional growth within the organization.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pilot Recognition Profile Match Card */}
                        <div className="mt-16">
                            <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                                {/* Header Card */}
                                <div className="bg-red-600 px-6 py-5 border-b border-red-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-red-200 uppercase tracking-[0.2em] mb-1">Pilot Recognition Profile</p>
                                            <h4 className="text-2xl font-bold text-white">Pete Mitchell</h4>
                                            <p className="text-sm text-red-100">WingMentor Recognition Portfolio</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-red-200 uppercase tracking-[0.2em] mb-2">MATCH SCORE</p>
                                            <div className="text-4xl font-bold text-white">{selectedAirline ? getMatchScore(selectedAirline) : 85}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        {/* Profile Metrics */}
                                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">PROFILE METRICS</h5>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Total Hours</span>
                                                    <span className="text-xs font-bold text-slate-900">4,500</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Competency Score</span>
                                                    <span className="text-xs font-bold text-red-600">{selectedAirline ? Math.min(getMatchScore(selectedAirline) + 5, 98) : 90}%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Type Ratings</span>
                                                    <span className="text-xs font-bold text-slate-900">8</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500">Leadership Roles</span>
                                                    <span className="text-xs font-bold text-slate-900">3</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Competency Breakdown */}
                                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">COMPETENCY BREAKDOWN</h5>
                                            <div className="space-y-3">
                                                <div className="bg-slate-50 rounded-lg p-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] text-slate-500">Technical Skills</span>
                                                        <span className="text-xs font-bold text-red-600">{selectedAirline ? getCompetencyScores(selectedAirline).technical : 90}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-1">
                                                        <div className="bg-red-500 h-1 rounded-full" style={{ width: selectedAirline ? `${getCompetencyScores(selectedAirline).technical}%` : '90%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] text-slate-500">Leadership</span>
                                                        <span className="text-xs font-bold text-red-600">{selectedAirline ? getCompetencyScores(selectedAirline).leadership : 83}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-1">
                                                        <div className="bg-red-500 h-1 rounded-full" style={{ width: selectedAirline ? `${getCompetencyScores(selectedAirline).leadership}%` : '83%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] text-slate-500">Decision Making</span>
                                                        <span className="text-xs font-bold text-red-600">{selectedAirline ? getCompetencyScores(selectedAirline).decision : 88}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-1">
                                                        <div className="bg-red-500 h-1 rounded-full" style={{ width: selectedAirline ? `${getCompetencyScores(selectedAirline).decision}%` : '88%' }}></div>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] text-slate-500">Innovation</span>
                                                        <span className="text-xs font-bold text-red-600">{selectedAirline ? getCompetencyScores(selectedAirline).innovation : 81}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-1">
                                                        <div className="bg-red-500 h-1 rounded-full" style={{ width: selectedAirline ? `${getCompetencyScores(selectedAirline).innovation}%` : '81%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Airline Alignment */}
                                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{selectedAirline.name} ALIGNMENT</h5>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-emerald-600 text-xs font-bold mt-0.5">✓</span>
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-900">Advanced Flight Maneuvers</span>
                                                        <p className="text-[10px] text-slate-500">Exceeds standard requirements</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-emerald-600 text-xs font-bold mt-0.5">✓</span>
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-900">Crisis Leadership</span>
                                                        <p className="text-[10px] text-slate-500">Validated pressure handling</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-emerald-600 text-xs font-bold mt-0.5">✓</span>
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-900">Strategic Planning</span>
                                                        <p className="text-[10px] text-slate-500">Tactical analysis skills</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-emerald-600 text-xs font-bold mt-0.5">✓</span>
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-900">Innovation</span>
                                                        <p className="text-[10px] text-slate-500">Creative problem-solving</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Development Areas */}
                                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">DEVELOPMENT AREAS</h5>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-amber-600 text-xs font-bold mt-0.5">!</span>
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-900">ATLAS CV Documentation</span>
                                                        <p className="text-[10px] text-slate-500">Complete verified profile</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-amber-600 text-xs font-bold mt-0.5">!</span>
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-900">EBT/CBTA Certification</span>
                                                        <p className="text-[10px] text-slate-500">Nine core competencies</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-amber-600 text-xs font-bold mt-0.5">!</span>
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-900">Modern Type Ratings</span>
                                                        <p className="text-[10px] text-slate-500">Next-generation aircraft</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-amber-600 text-xs font-bold mt-0.5">!</span>
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-900">Mentorship Program</span>
                                                        <p className="text-[10px] text-slate-500">Structured engagement</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Recommendation */}
                                        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                            <h5 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">WINGMENTOR AI RECOMMENDATION</h5>
                                            <p className="text-xs text-slate-700 leading-relaxed mb-3">
                                                Pete Mitchell demonstrates exceptional natural aptitude for advanced aviation operations with a {selectedAirline ? getMatchScore(selectedAirline) : 85}% match with {selectedAirline.name}. Recommended enrollment in Transition Program to formalize EBT/CBTA competencies, complete ATLAS CV documentation, and pursue type rating progression.
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-medium">Transition Program</span>
                                                <span className="px-2 py-1 bg-slate-700 text-white rounded text-[10px] font-medium">ATLAS CV</span>
                                                <span className="px-2 py-1 bg-slate-700 text-white rounded text-[10px] font-medium">Type Rating</span>
                                            </div>
                                            <button
                                                onClick={() => setShowMockDataModal(true)}
                                                className="w-full text-center text-xs font-semibold text-red-600 hover:text-red-700 underline"
                                            >
                                                View More Mock Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mock Data Modal */}
            {showMockDataModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Blurred Background */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMockDataModal(false)}></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-red-600 px-6 py-4 border-b border-red-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">Pilot Recognition Profile - Detailed Data</h3>
                                <p className="text-sm text-red-100">Pete Mitchell | WingMentor Recognition Portfolio</p>
                            </div>
                            <button
                                onClick={() => setShowMockDataModal(false)}
                                className="text-white hover:text-red-200 transition-colors"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            {/* Flight Log Summary */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest">Flight Log Summary</h4>
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-slate-900">4,500</p>
                                            <p className="text-xs text-slate-500">Total Hours</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-slate-900">2,100</p>
                                            <p className="text-xs text-slate-500">PIC Hours</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-slate-900">1,800</p>
                                            <p className="text-xs text-slate-500">Cross-Country</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-slate-900">600</p>
                                            <p className="text-xs text-slate-500">Night Hours</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest">Certifications & Licenses</h4>
                                <div className="bg-white rounded-lg border border-slate-200">
                                    <div className="divide-y divide-slate-200">
                                        <div className="flex justify-between items-center p-3">
                                            <span className="text-xs text-slate-600">Airline Transport Pilot License (ATPL)</span>
                                            <span className="text-xs font-bold text-emerald-600">Valid</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3">
                                            <span className="text-xs text-slate-600">Commercial Pilot License (CPL)</span>
                                            <span className="text-xs font-bold text-emerald-600">Valid</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3">
                                            <span className="text-xs text-slate-600">Instrument Rating (IR)</span>
                                            <span className="text-xs font-bold text-emerald-600">Valid</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3">
                                            <span className="text-xs text-slate-600">Multi-Engine Rating (ME)</span>
                                            <span className="text-xs font-bold text-emerald-600">Valid</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3">
                                            <span className="text-xs text-slate-600">Class 1 Medical Certificate</span>
                                            <span className="text-xs font-bold text-emerald-600">Valid until 2026</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Type Ratings */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest">Type Ratings</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                                        <p className="text-sm font-bold text-slate-900">Boeing 737</p>
                                        <p className="text-[10px] text-slate-500">NG/MAX</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                                        <p className="text-sm font-bold text-slate-900">Airbus A320</p>
                                        <p className="text-[10px] text-slate-500">Family</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                                        <p className="text-sm font-bold text-slate-900">Boeing 777</p>
                                        <p className="text-[10px] text-slate-500">GE/RR/PW</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                                        <p className="text-sm font-bold text-slate-900">Airbus A350</p>
                                        <p className="text-[10px] text-slate-500">XWB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Training History */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest">Training History</h4>
                                <div className="bg-white rounded-lg border border-slate-200">
                                    <div className="divide-y divide-slate-200">
                                        <div className="p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-slate-900">EBT/CBTA Training</span>
                                                <span className="text-[10px] text-slate-500">2024</span>
                                            </div>
                                            <p className="text-[10px] text-slate-600">Evidence-Based Training and Competency-Based Training & Assessment completed with distinction</p>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-slate-900">MCC Course</span>
                                                <span className="text-[10px] text-slate-500">2023</span>
                                            </div>
                                            <p className="text-[10px] text-slate-600">Multi-Crew Coordination training completed</p>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-slate-900">CRM Training</span>
                                                <span className="text-[10px] text-slate-500">2023</span>
                                            </div>
                                            <p className="text-[10px] text-slate-600">Crew Resource Management advanced training</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Assessment Scores */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest">EBT/CBTA Assessment Scores</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                        <p className="text-[10px] text-slate-600 mb-1">Technical Mastery</p>
                                        <p className="text-xl font-bold text-emerald-600">94%</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                        <p className="text-[10px] text-slate-600 mb-1">Behavioral Competency</p>
                                        <p className="text-xl font-bold text-emerald-600">89%</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                        <p className="text-[10px] text-slate-600 mb-1">Cognitive Resilience</p>
                                        <p className="text-xl font-bold text-emerald-600">91%</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                        <p className="text-[10px] text-slate-600 mb-1">Professional Persona</p>
                                        <p className="text-xl font-bold text-emerald-600">85%</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                        <p className="text-[10px] text-slate-600 mb-1">Situational Awareness</p>
                                        <p className="text-xl font-bold text-emerald-600">92%</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                        <p className="text-[10px] text-slate-600 mb-1">Communication</p>
                                        <p className="text-xl font-bold text-emerald-600">88%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Visible Content - 2 Paragraphs (Magazine Style) */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Industry Intelligence
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        What Airlines Really Look For
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto space-y-8">
                <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 font-sans">
                    The aviation industry has evolved beyond the traditional "1,500 hours and a clean record" hiring model.
                    Modern airlines—especially major carriers like Emirates, Qatar Airways, and Etihad—now employ sophisticated
                    screening processes that evaluate candidates through <strong>Evidence-Based Training (EBT)</strong> and <strong>Competency-Based Training
                    & Assessment (CBTA)</strong> frameworks. These systems assess not just your flight hours, but your demonstrated competency
                    across nine core performance areas. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that
                    our assessment framework aligns with the exacting standards required by leading manufacturers worldwide.
                </p>

                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                    WingMentor bridges this gap by providing direct insight from training captains and recruitment specialists at
                    global carriers. Our program prepares you for the modern assessment pipeline: from initial <strong>ATLAS CV screening</strong>
                    and psychometric testing, through competency-based interviews, to the final simulator evaluation. Understanding
                    these expectations before you apply is the difference between being "qualified on paper" and being "the right
                    candidate for the flight deck." Our <strong>AI-powered pathway matching</strong> system analyzes your verified PilotRecognition profile
                    against airline requirements to identify optimal career opportunities.
                </p>
            </div>

            {/* Core Expectations Grid */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Assessment Framework
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        The Four Pillars of Assessment
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {coreExpectations.map((item, idx) => (
                        <div key={idx} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col items-start min-h-[350px]">
                            <h3 className="text-2xl font-serif text-slate-900 mb-4">{item.title}</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed text-sm font-sans">{item.desc}</p>
                            <div className="space-y-3 mt-auto w-full">
                                {item.bullets.map((bullet, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cinematic Section (Dark) */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60A5FA', fontWeight: 600 }}>
                        Real-World Assessment
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: 'white' }}>
                        Beyond the 1,500 Hours: The Evidence Filter
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                "Meeting the minimum is the entry ticket. Competency is the invitation to the flight deck."
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                Airlines are moving toward Evidence-Based Training (EBT) screening. Our insight from
                                training leadership at global carriers ensures you understand the 9 core competencies
                                before you ever walk into the assessment center.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Section 1 */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Cultural Fit Assessment
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Beyond The Cockpit: Flagship Carrier Culture
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <p className="text-slate-600 text-lg leading-relaxed mb-4">
                    Airlines aren't just hiring pilots; they're hiring future captains and brand ambassadors. Major carriers invest heavily in their corporate identity, and they expect their flight deck crew to embody these values. Our assessment preparation goes beyond technical skills to ensure you demonstrate the <strong>professional persona</strong>, <strong>leadership qualities</strong>, and <strong>cultural alignment</strong> that recruiters at top-tier airlines effectively mandate.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                    Through our partnership with <strong>Etihad Cadet Program</strong> and <strong>Airbus Head of Training</strong>, we provide direct insight into the cultural expectations of leading carriers. Our <strong>pathway matching system</strong> treats all pilots objectively based on verified competencies and recognition scores, ensuring fair and equitable access to career opportunities based on demonstrated professional capability rather than connections.
                </p>
            </div>

            {/* Article Section 2 */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Competency Framework
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        The Competency Balance
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto mb-24">
                <p className="text-slate-600 text-lg leading-relaxed mb-4">
                    While technical proficiency is non-negotiable, the deciding factor in modern airline recruitment often lies in non-technical competencies. Decision-making, situational awareness, and communication are scrutinized under the microscope of EBT frameworks. We provide the strategies to articulate your experience in the language of these competencies, turning your flight hours into a compelling narrative of safety and leadership.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                    Through our <strong>EBT CBTA-aligned assessment framework</strong>, we evaluate both technical and non-technical competencies including <strong>situational awareness</strong>, <strong>workload management</strong>, and <strong>decision making</strong> under pressure. Our recognition-based profiling provides objective assessment of these cognitive markers, giving operators confidence in your ability to handle demanding operational scenarios. Our <strong>9 core competencies framework</strong> specifically addresses the balance between technical mastery and behavioral excellence.
                </p>
            </div>

            {/* Cockpit Teamwork Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Crew Resource Management
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Cockpit Teamwork Excellence
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto mb-24">
                <p className="text-slate-600 text-lg leading-relaxed mb-4 text-center">
                    Effective cockpit teamwork is the foundation of aviation safety. Through our <strong>Foundational Program's 50 hours of verifiable logged effort-based mentorship</strong>, we develop the <strong>CRM (Crew Resource Management)</strong> competencies that modern airlines demand. Our training focuses on communication, leadership, and decision-making in a multi-crew environment, ensuring you can contribute effectively to flight deck operations from day one.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed text-center">
                    Our <strong>EBT CBTA-aligned assessment framework</strong> specifically evaluates your ability to communicate respectfully, listen actively, and contribute constructively to crew decisions. Through our partnership with <strong>Airbus Head of Training</strong>, we ensure that our CRM training aligns with the exacting standards required by leading manufacturers worldwide. Our <strong>AI-powered pathway matching</strong> system identifies opportunities where your demonstrated teamwork competencies match airline requirements.
                </p>
            </div>

            {/* Assessment Pipeline */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Selection Process
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Modern Assessment Stages
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-4">
                    {assessmentPipeline.map((item, idx) => (
                        <div key={idx} className="p-2 md:p-6 bg-slate-50 border border-slate-100 rounded-lg md:rounded-[2rem] min-h-[120px] md:min-h-[220px]">
                            <div className="absolute top-1.5 right-2 md:top-4 md:right-6 font-serif text-lg md:text-4xl text-slate-200">0{idx + 1}</div>
                            <h3 className="text-[9px] md:text-base font-bold mb-0.5 md:mb-3 font-sans text-slate-800 uppercase tracking-widest">{item.title}</h3>
                            <p className="text-slate-500 text-[7px] md:text-sm leading-tight md:leading-relaxed font-sans">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Back button (from AboutPage) */}
            <div className="py-12 flex flex-col items-center gap-12">
                <button
                    onClick={onBack}
                    className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};
