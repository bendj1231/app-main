import React, { useEffect } from 'react';
import { ArrowLeft, Plane, Users, Award, TrendingUp, Building2, CheckCircle2, Zap, Bell } from 'lucide-react';

interface AirTaxiPathwaysPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const AirTaxiPathwaysPage: React.FC<AirTaxiPathwaysPageProps> = ({ onBack, onNavigate, onLogin }) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* Header - Same as PathwaysPageModern */}
            <header className="bg-white border-b border-slate-200 backdrop-blur-sm sticky top-0 z-30">
                <div className="mx-auto pr-6 py-4 w-full max-w-[1800px]">
                    {/* Main title row */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                {/* Back Button */}
                                <button
                                    onClick={onBack}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all"
                                    title="Back to Pathways"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                {/* PilotRecognition.com Logo */}
                                <div className="flex flex-col">
                                    <span style={{ fontFamily: 'Georgia, serif' }} className="text-black text-2xl font-normal">
                                        Discover <span className="text-red-600">Pathways</span>
                                    </span>
                                    <span className="text-xs text-slate-600 font-normal">
                                        pilotrecognition.com
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-3">
                            {[
                                { label: 'Airline Expectations', page: 'portal-airline-expectations' },
                                { label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
                                { label: 'Pilot Pathways', page: 'pathways-modern' },
                                { label: 'Job Listings', page: 'job-listings' },
                            ].map(({ label, page }) => (
                                <button
                                    key={page}
                                    onClick={() => onNavigate(page)}
                                    className="text-[0.6rem] font-bold uppercase tracking-[0.1em] transition-all hover:text-blue-400 flex items-center gap-1 whitespace-nowrap text-slate-900"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Right side items */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onLogin}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-[0.1em] transition-all"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="px-4 py-2 rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-[0.1em] transition-all"
                            >
                                Become Member
                            </button>
                            <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all">
                                <Bell className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Header Section */}
            <div className="pt-10 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Emerging Air Mobility
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Air Taxi Pathways
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        Your gateway to the future of urban aviation. PilotRecognition partners with industry leaders Archer, MLG, and Joby to prepare pilots for the emerging eVTOL revolution and secure your place in tomorrow's sky.
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">

                {/* Section 1: The Air Taxi Revolution */}
                <div className="flex flex-col items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The New Frontier
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Urban Air Mobility is Here
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The air taxi sector has transformed from concept to operational reality. <strong>Archer Aviation</strong>, <strong>MLG</strong>, and <strong>Joby Aviation</strong> are now launching commercial eVTOL services in major cities worldwide, representing a fundamental shift in urban transportation and creating unprecedented career opportunities for pilots.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Through strategic partnerships with these industry pioneers, PilotRecognition delivers direct insight into pilot requirements, operational standards, and hiring timelines. Our Transition Program is built on this insider knowledge, ensuring you develop exactly the competencies these operators demand.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <p className="text-xs text-slate-500 mt-3 text-center italic">
                            Next-generation eVTOL aircraft
                        </p>
                    </div>
                </div>

                {/* Section 2: Industry Partners */}
                <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2 text-center">
                        Our Partners
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
                        Direct Industry Connections
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Archer Aviation */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Archer Aviation</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Spearheading urban air mobility with the revolutionary Midnight aircraft. Archer is launching commercial operations across major U.S. cities, seeking pilots with exceptional CRM capabilities and advanced systems management expertise.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Commercial CPL + Instrument Rating</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Strong EBT/CBTA competency background</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Urban operations experience preferred</span>
                                </div>
                            </div>
                        </div>

                        {/* MLG */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                                <Building2 className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">MLG</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Revolutionizing autonomous and piloted drone logistics. MLG's innovative "pilotless" operations require skilled remote pilots capable of managing complex mission profiles from advanced ground control centers.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">CPL holders eligible for training</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Systems management expertise</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Strategic oversight capabilities</span>
                                </div>
                            </div>
                        </div>

                        {/* Joby Aviation */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Joby Aviation</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                First in the world to receive FAA certification for commercial eVTOL operations. Joby seeks pilots with superior situational awareness and the agility to master rapidly evolving aviation technology.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">FAA Commercial Pilot License</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Advanced automation understanding</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Adaptability to new aircraft systems</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: What They Look For */}
                <div className="flex flex-col items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Pilot Requirements
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            What Air Taxi Operators Expect
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Based on direct collaboration with Archer, MLG, and Joby, we've identified the critical competencies these operators prioritize. Success in air taxi operations requires more than flight hours—it demands mastery of modern aviation principles and next-generation skills.
                        </p>
                        <ul className="mt-2 space-y-2 text-base text-slate-700 list-disc list-inside text-center inline-block text-left">
                            <li><strong>EBT/CBTA Proficiency:</strong> Evidence-Based Training competency assessments</li>
                            <li><strong>Systems Thinking:</strong> Ability to manage highly automated aircraft</li>
                            <li><strong>CRM Excellence:</strong> Crew Resource Management in single-pilot operations</li>
                            <li><strong>Adaptability:</strong> Quick learning of new aircraft types and procedures</li>
                            <li><strong>Urban Operations:</strong> Understanding of high-density airspace management</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <Users className="w-10 h-10 text-blue-600 mb-3" />
                                <h3 className="font-bold text-slate-900">CRM Skills</h3>
                                <p className="text-xs text-slate-500 mt-2">Single-pilot resource management.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <Award className="w-10 h-10 text-emerald-600 mb-3" />
                                <h3 className="font-bold text-slate-900">Competency</h3>
                                <p className="text-xs text-slate-500 mt-2">EBT/CBTA core competencies verified.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center col-span-1 md:col-span-2">
                                <TrendingUp className="w-10 h-10 text-purple-600 mb-3" />
                                <h3 className="font-bold text-slate-900">Continuous Learning</h3>
                                <p className="text-xs text-slate-500 mt-2">Demonstrated commitment to professional development.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: PilotRecognition Transition Program Access */}
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xs font-bold text-blue-300 uppercase tracking-[0.3em] mb-2 text-center">
                            Exclusive Access
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                            Your Pathway Through PilotRecognition
                        </h2>
                        <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8 text-center">
                            The <strong>PilotRecognition Transition Program</strong> provides exclusive access to air taxi career pathways. Beyond training, we connect you directly to recruitment pipelines at Archer, MLG, and Joby, accelerating your transition into this emerging sector.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold mb-3">What You Get</h3>
                                <ul className="space-y-2 text-sm text-slate-200">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Direct introductions to Archer, MLG, and Joby recruitment teams</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>EBT/CBTA training aligned with eVTOL operator standards</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Type rating preparation for eVTOL aircraft systems</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Verified pilot database profile optimized for air taxi roles</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold mb-3">Program Benefits</h3>
                                <ul className="space-y-2 text-sm text-slate-200">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Early notification of air taxi job openings</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Mentorship from pilots already in eVTOL operations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Resume and interview prep specific to air taxi sector</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Access to industry events and networking opportunities</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => onNavigate('transition-program')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-xl group"
                            >
                                Learn About the Transition Program
                                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 5: Timeline & Next Steps */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Getting Started
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        Your Journey to Air Taxi Operations
                    </h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-8">
                        The air taxi industry is actively hiring now, with demand accelerating rapidly. Our Transition Program fast-tracks your journey from current qualifications to interview-ready status in months, positioning you ahead of the competition.
                    </p>

                    <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Ready to Take Off?</h3>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            Enroll in the PilotRecognition Transition Program today to unlock exclusive access to air taxi career pathways. Our strategic advisory relationships with Archer, MLG, and Joby provide unparalleled insights into emerging opportunities in the eVTOL sector.
                        </p>
                        <button
                            onClick={() => onNavigate('contact-support')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg"
                        >
                            Contact Us to Get Started
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};
