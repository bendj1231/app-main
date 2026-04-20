import React from 'react';
import { ArrowLeft, Truck, Plane, Globe, Package, Clock, Shield, CheckCircle2, Award } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';

interface CargoTransportationPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const CargoTransportationPage: React.FC<CargoTransportationPageProps> = ({ onBack, onNavigate, onLogin }) => {

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-10 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Global Logistics & Freight
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Cargo Hauling Pathways
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        The backbone of global commerce. Air cargo operations offer unique career opportunities with major logistics carriers, freight operators, and express delivery companies worldwide.
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">

                {/* Section 1: The Cargo Sector */}
                <div className="flex flex-col items-center gap-6 md:gap-8">
                    <div className="w-full text-center">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Cargo Advantage
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            A Different Flight Path
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Air cargo represents a dynamic sector of aviation that operates 24/7, moving essential goods worldwide. From express packages to heavy freight, cargo pilots are the unsung heroes of global supply chains, operating at all hours and in all weather conditions.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            <strong>Why Choose Cargo?</strong> The cargo sector offers faster career progression, diverse fleet types, and often lower hour requirements compared to passenger airlines. With the explosive growth of e-commerce and global trade, demand for qualified cargo pilots continues to rise.
                        </p>
                    </div>
                    <div className="w-full max-w-4xl">
                        <img
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776689839/pathways/cargo-operations.png"
                            alt="Cargo Aircraft Operations"
                            className="w-full h-auto rounded-2xl shadow-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Section 4: Cargo Pathway Programs Carousel - Full Width */}
            <div className="py-12">
                <div className="mb-8 px-6">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Partner Programs
                    </p>
                    <h2 className="text-2xl md:text-3xl mb-6 text-slate-900 font-serif">
                        Cargo Hauling Pathways
                    </h2>
                    <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-8 max-w-3xl">
                        WingMentor provides direct entry pathways to leading cargo carriers through our partner programs. Access the Pilot Portal to explore all available pathways.
                    </p>
                </div>

                    {/* Horizontal Carousel - Edge to Edge */}
                    <div className="relative w-screen left-1/2 -translate-x-1/2 mb-8">
                        <div>
                            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide justify-center pl-6 pr-6">
                                {/* Left Card: Atlas Air (Greyed Out) */}
                                <div className="hidden md:flex flex-shrink-0 w-[480px] h-[350px] bg-slate-800 rounded-2xl overflow-hidden relative opacity-40 snap-center">
                                    <img
                                        src="https://live-cms.acronaviation.com/media/sgbhxpsv/acron-academy-airline-relationships-usa-atlas-air.jpg?width=1200&height=630&quality=80"
                                        alt="Atlas Air"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50" />
                                    <div className="absolute top-5 right-6 z-10">
                                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400 to-cyan-300 text-slate-950 shadow-lg">86%</div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full z-10">
                                        <span className="text-xs uppercase tracking-wider font-medium text-blue-300 mb-4">CARGO — ACMI CAREER</span>
                                        <h3 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Atlas Air International</h3>
                                        <p className="text-lg text-gray-200 mb-4">Atlas Air</p>
                                    </div>
                                </div>

                                {/* Main Card 1: FedEx Purple Runway */}
                                <div className="flex-shrink-0 w-[480px] h-[350px] bg-slate-800 rounded-2xl overflow-hidden relative group cursor-pointer snap-center">
                                    <img
                                        src="https://d386an9otcxw2c.cloudfront.net/oms/2634/image/2025/8/3QC0D_purple-runway-pathway/purple-runway-pathway.jpg"
                                        alt="FedEx Purple Runway"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/50" />
                                    <div className="absolute top-5 right-6 z-10">
                                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 shadow-lg">91%</div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full z-10">
                                        <span className="text-xs uppercase tracking-wider font-medium text-blue-300 mb-4">CARGO — CADET TO CAPTAIN</span>
                                        <h3 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>FedEx Purple Runway</h3>
                                        <p className="text-lg text-gray-200 mb-4">FedEx Express</p>
                                        <div className="flex items-center gap-6 mb-6 text-sm text-gray-300">
                                            <span className="flex items-center gap-2">Memphis, TN / Indianapolis, IN</span>
                                            <span className="flex items-center gap-2">$60,000 during training</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button className="px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 text-white">
                                                <span>Discover Pathway</span>
                                                <ArrowLeft className="w-4 h-4 rotate-180" />
                                            </button>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">Fortune 500</span>
                                                <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">MD-11 to B777</span>
                                                <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">Retirement Benefits</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Card 2: UPS FlightPath */}
                                <div className="flex-shrink-0 w-[480px] h-[350px] bg-slate-800 rounded-2xl overflow-hidden relative group cursor-pointer snap-center">
                                    <img
                                        src="https://cdn.phenompeople.com/CareerConnectResources/UPBUPSGLOBAL/images/img-flightpath-fastfacts-1736537912855.jpg"
                                        alt="UPS FlightPath"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/50" />
                                    <div className="absolute top-5 right-6 z-10">
                                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400 to-cyan-300 text-slate-950 shadow-lg">88%</div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full z-10">
                                        <span className="text-xs uppercase tracking-wider font-medium text-blue-300 mb-4">CARGO — CAREER DEVELOPMENT</span>
                                        <h3 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>UPS FlightPath</h3>
                                        <p className="text-lg text-gray-200 mb-4">UPS Airlines</p>
                                        <div className="flex items-center gap-6 mb-6 text-sm text-gray-300">
                                            <span className="flex items-center gap-2">Louisville, KY</span>
                                            <span className="flex items-center gap-2">$55,000 starting pay</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button className="px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 text-white">
                                                <span>Discover Pathway</span>
                                                <ArrowLeft className="w-4 h-4 rotate-180" />
                                            </button>
                                            <div className="flex gap-2">
                                                <span className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">Teamsters Union</span>
                                                <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">Pension</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Card: DHL Aviation (Greyed Out) */}
                                <div className="hidden md:flex flex-shrink-0 w-[480px] h-[350px] bg-slate-800 rounded-2xl overflow-hidden relative opacity-40 snap-center">
                                    <img
                                        src="https://www.shutterstock.com/image-photo/new-delhi-delhiindia-may-05-600nw-2489543821.jpg"
                                        alt="DHL Aviation"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50" />
                                    <div className="absolute top-5 right-6 z-10">
                                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-lg">83%</div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full z-10">
                                        <span className="text-xs uppercase tracking-wider font-medium text-blue-300 mb-4">CARGO — ENTRY LEVEL</span>
                                        <h3 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>DHL Aviation</h3>
                                        <p className="text-lg text-gray-200 mb-4">DHL Aviation (EAT Leipzig)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto text-center mt-8">
                        <button
                            onClick={() => onNavigate('portal')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg group"
                        >
                            Access Pilot Portal for Full Pathway Details
                            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Section 2: Types of Cargo Operations */}
                <div className="flex flex-col items-center gap-10 md:gap-16">
                    <div className="w-full text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Operational Types
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Cargo Operation Models
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The cargo sector encompasses diverse operational models, each with unique requirements and career opportunities:
                        </p>
                        <ul className="mt-2 space-y-3 text-base text-slate-700 list-none text-center max-w-2xl mx-auto">
                            <li className="flex justify-center items-start gap-3">
                                <div>
                                    <strong>Express/Integrator:</strong> Time-critical small packages (FedEx, UPS, DHL). High-frequency, hub-and-spoke networks, overnight operations.
                                </div>
                            </li>
                            <li className="flex justify-center items-start gap-3">
                                <div>
                                    <strong>Heavy Freight:</strong> Large-scale logistics and outsized cargo (Atlas Air, Kalitta). ACMI operations, long-haul routes, diverse aircraft types.
                                </div>
                            </li>
                            <li className="flex justify-center items-start gap-3">
                                <div>
                                    <strong>Charter/On-Demand:</strong> Flexible cargo solutions for specific client needs. Ad-hoc operations, specialized cargo handling, regional focus.
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="w-full">
                        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <h3 className="font-bold text-slate-900">Express</h3>
                                <p className="text-xs text-slate-500 mt-2">Time-critical delivery networks.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <h3 className="font-bold text-slate-900">Heavy Freight</h3>
                                <p className="text-xs text-slate-500 mt-2">Large-scale logistics operations.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center col-span-2">
                                <h3 className="font-bold text-slate-900">Charter/On-Demand</h3>
                                <p className="text-xs text-slate-500 mt-2">Flexible cargo solutions for clients.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 5: WingMentor Preparation */}
                <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/70 w-full max-w-2xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2 text-center">
                        Your Preparation
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-slate-900">
                        How WingMentor Gets You Cargo-Ready
                    </h2>
                    <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 text-center">
                        Our Pilot Recognition Profile is based on actual performance examination, flight logged data, recognition programs, and experience data. PilotRecog-AI will match you with job expectations and tell you exactly what you're really missing when preparing for their expectations.
                    </p>

                    <div className="space-y-4 mb-6">
                        <div className="text-center">
                            <h3 className="text-lg font-bold mb-2 text-slate-900">Direct Carrier Connections</h3>
                            <ul className="space-y-1 text-sm text-slate-600">
                                <li>Direct contact with cargo carriers based on up-to-date expectations</li>
                                <li>Real-time requirements instead of outdated information</li>
                                <li>Eliminate 6-month wait times for rejection emails</li>
                                <li>Know exactly where you went wrong in your application</li>
                            </ul>
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-bold mb-2 text-slate-900">AI-Powered Profile Matching</h3>
                            <ul className="space-y-1 text-sm text-slate-600">
                                <li>PilotRecog-AI analyzes your actual performance data</li>
                                <li>Matches your profile with carrier job expectations</li>
                                <li>Identifies exactly what you're missing</li>
                                <li>Guides you on aligning your profile with expectations</li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => onNavigate('become-member')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg group"
                        >
                            Create an account to get recognized.
                            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Section 5: Getting Started */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Your Next Step
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        Start Your Cargo Career
                    </h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-8">
                        The cargo sector offers accelerated career progression and unique flying opportunities. With proper preparation and the right connections, you can enter this rewarding field and build a successful career in global logistics.
                    </p>

                    <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Ready to Launch Your Cargo Career?</h3>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            Join the WingMentor Transition Program and gain the specialized training, industry knowledge, and connections needed to succeed in air cargo operations.
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
    );
};
