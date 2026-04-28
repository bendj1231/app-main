import React from 'react';
import { ArrowLeft, Plane, Users, Award, TrendingUp, Building2, CheckCircle2, Zap } from 'lucide-react';

interface PlatformAirTaxiPageProps {
    onNavigate: (page: string) => void;
}

export const PlatformAirTaxiPage: React.FC<PlatformAirTaxiPageProps> = ({
    onNavigate
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">

            {/* Header Section */}
            <div className="pt-10 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="PilotRecognition Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Emerging Air Mobility
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Air Taxi Pathways
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        Direct access to the future of urban aviation. PilotRecognition is in active partnership with industry leaders Archer, MLG, and Joby to prepare pilots for the eVTOL revolution.
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">

                {/* Section 1: The Air Taxi Revolution */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The New Frontier
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Urban Air Mobility is Here
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The air taxi sector is no longer science fiction—it's operational reality. Companies like <strong>Archer Aviation</strong>, <strong>MLG</strong>, and <strong>Joby Aviation</strong> are launching commercial eVTOL (electric Vertical Take-Off and Landing) services in major cities worldwide. These aircraft represent a fundamental shift in how we think about urban transportation and pilot careers.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            PilotRecognition has established direct communication channels with these industry pioneers to understand their pilot requirements, operational standards, and hiring timelines. This insider knowledge allows us to prepare our Transition Program members with the exact competencies these operators demand.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full mx-auto">
                            <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-lg relative group">
                                <img
                                    src="https://lh3.googleusercontent.com/d/1rZLzWxCpouDAIoNRFxeli5GDa3lhGyr2"
                                    alt="Air Taxi eVTOL"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 text-center italic">
                                Next-generation eVTOL aircraft
                            </p>
                        </div>
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
                                Leading the charge in urban air mobility with their Midnight aircraft. Archer is launching commercial operations in major U.S. cities and requires pilots with strong CRM and systems management skills.
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
                                Pioneering autonomous and piloted drone logistics. MLG's "pilotless" approach requires remote pilots who can manage complex mission profiles from ground control centers.
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
                                First to receive FAA certification for commercial eVTOL operations. Joby seeks pilots with exceptional situational awareness and the ability to adapt to rapidly evolving technology.
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
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Pilot Requirements
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            What Air Taxi Operators Expect
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Through our direct conversations with Archer, MLG, and Joby, we've identified the core competencies these operators prioritize when hiring pilots. It's not just about flight hours—it's about demonstrating mastery of modern aviation principles.
                        </p>
                        <ul className="mt-2 space-y-2 text-base text-slate-700 list-disc list-inside md:list-outside md:pl-5 text-left">
                            <li><strong>EBT/CBTA Proficiency:</strong> Evidence-Based Training competency assessments</li>
                            <li><strong>Systems Thinking:</strong> Ability to manage highly automated aircraft</li>
                            <li><strong>CRM Excellence:</strong> Crew Resource Management in single-pilot operations</li>
                            <li><strong>Adaptability:</strong> Quick learning of new aircraft types and procedures</li>
                            <li><strong>Urban Operations:</strong> Understanding of high-density airspace management</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2">
                        <div className="grid grid-cols-2 gap-4">
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
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center col-span-2">
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
                            Members participating in the <strong>PilotRecognition Transition Program</strong> receive exclusive pathway access to air taxi opportunities. We don't just teach you what these operators want—we connect you directly to their recruitment pipelines.
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
                                onClick={() => onNavigate('transition-platform')}
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
                        The air taxi industry is hiring now, and demand is accelerating. PilotRecognition's Transition Program is designed to get you from where you are today to interview-ready in months, not years.
                    </p>

                    <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Ready to Take Off?</h3>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            Join the PilotRecognition Transition Program today and gain exclusive access to the air taxi pathway. Our direct partnerships with Archer, MLG, and Joby mean you'll be first in line when positions open.
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
