import React from 'react';
import { ArrowLeft, Shield, Users, Star, Briefcase, Award, CheckCircle2, Clock } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';

interface PrivateCharterPathwaysPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PrivateCharterPathwaysPage: React.FC<PrivateCharterPathwaysPageProps> = ({ onBack, onNavigate, onLogin }) => {

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-10 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="PilotRecognition Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Corporate &amp; VIP Aviation
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Private Charter Pathways
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        Enter the world of corporate and VIP flight departments where professionalism, discretion, and exceptional service define success beyond raw flight hours.
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">

                {/* Section 1: The Private Charter Sector */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Beyond the Airlines
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            A Different Kind of Flying
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Private charter and corporate aviation represents a distinct career path from traditional airlines. Here, you're not just a pilot—you're a trusted professional representing high-net-worth individuals, Fortune 500 executives, and heads of state. The stakes are different, the expectations are higher, and the rewards reflect that reality.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            PilotRecognition prepares pilots for this sector by teaching what owners, brokers, and chief pilots actually look for: <strong>discretion, consistency, and the service mindset</strong> that defines successful charter crews. It's not about having 5,000 hours—it's about demonstrating professionalism from day one.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full mx-auto">
                            <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-lg relative group">
                                <img
                                    src="https://res.cloudinary.com/dridtecu6/image/upload/v1776689902/pathways/private-charter.jpg"
                                    alt="Private Charter Aircraft"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 text-center italic">
                                Corporate flight department operations
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Insider Perspective - Both Sides of the Coin */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl p-8 md:p-12 border border-blue-100">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2 text-center">
                        Industry Insight
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center">
                        Both Sides of the Coin
                    </h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                        PilotRecognition has unique insight into the private charter world from <strong>both the operator and broker perspectives</strong>. We've spoken directly with operators managing Gulfstream fleets and maintain active relationships with charter brokers, giving us a complete picture of how this industry actually works.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Operator Perspective */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-blue-700" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">The Operator Side</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Through conversations with operators managing Gulfstream fleets, we've learned what it's really like on the ground. The work is <strong>massive development</strong>—constant coordination, diverse missions, and high-stakes operations.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <strong className="text-sm text-slate-900">Business Meetings:</strong>
                                        <p className="text-xs text-slate-600">Executive transport for critical corporate decisions</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <strong className="text-sm text-slate-900">Family Trips:</strong>
                                        <p className="text-xs text-slate-600">Personal travel for UHNW families and their guests</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <strong className="text-sm text-slate-900">Challenging Clients:</strong>
                                        <p className="text-xs text-slate-600">Some rent jets purely for status—they can be a headache to manage, but it's part of the business</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Broker Perspective */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-purple-700" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">The Broker Model</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Charter brokers are the middlemen who connect clients to aircraft. They <strong>take planes from operators</strong> and broker them to end clients, making a markup profit on each flight. Understanding this model is crucial for pilots entering the industry.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <strong className="text-sm text-slate-900">Client Acquisition:</strong>
                                        <p className="text-xs text-slate-600">Brokers market to high-net-worth individuals and corporations</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <strong className="text-sm text-slate-900">Aircraft Sourcing:</strong>
                                        <p className="text-xs text-slate-600">They lease aircraft from operators and add their service fee</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <strong className="text-sm text-slate-900">Profit Margin:</strong>
                                        <p className="text-xs text-slate-600">Markup varies based on demand, aircraft type, and route</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PilotRecognition Connections */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-2">PilotRecognition's Direct Connections</h3>
                                <p className="text-sm text-blue-50 leading-relaxed mb-3">
                                    We maintain active relationships with charter brokers and have direct connections to operators they work with, including those managed by <strong>flyairlines</strong>. This dual perspective means we can prepare you for both sides of the business and connect you to the right opportunities.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                                        <span className="text-blue-50">Direct broker introductions</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                                        <span className="text-blue-50">Operator network access</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                                        <span className="text-blue-50">Industry insider knowledge</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                                        <span className="text-blue-50">Real-world preparation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: What Charter Operators Look For */}
                <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2 text-center">
                        Core Competencies
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
                        Beyond Raw Flight Hours
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Discretion */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Discretion</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Absolute confidentiality is non-negotiable. You'll overhear sensitive business conversations, transport high-profile passengers, and operate in exclusive environments. What happens on the aircraft stays on the aircraft.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Professional boundaries</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Confidentiality protocols</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Reputation management</span>
                                </div>
                            </div>
                        </div>

                        {/* Consistency */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Consistency</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Charter clients expect flawless execution every single flight. No excuses, no surprises, no drama. Your ability to deliver the same exceptional experience on flight 500 as you did on flight 1 is what keeps you employed.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Predictable performance</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Attention to detail</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Reliability under pressure</span>
                                </div>
                            </div>
                        </div>

                        {/* Service Mindset */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                <Star className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Service Mindset</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                You're not just flying an aircraft—you're delivering a premium experience. From pre-flight coordination with FBOs to post-flight follow-up, every touchpoint matters. This is hospitality at 41,000 feet.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Client-first mentality</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Proactive problem-solving</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">White-glove coordination</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Types of Private Charter Operations */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Career Paths
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Where You Can Fly
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            The private charter sector encompasses several distinct operational models, each with unique requirements and opportunities:
                        </p>
                        <ul className="mt-2 space-y-3 text-base text-slate-700 list-none text-left">
                            <li className="flex items-start gap-3">
                                <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Corporate Flight Departments:</strong> Single-owner operations serving Fortune 500 companies. Stable schedules, excellent benefits, long-term relationships.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>Charter Operators:</strong> Multi-client operations (NetJets, Flexjet, VistaJet). Higher flight volume, diverse destinations, structured career progression.
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Star className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>VIP/VVIP Operations:</strong> Ultra-high-net-worth individuals, celebrities, and government officials. Premium compensation, global travel, discretion paramount.
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="md:w-1/2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <Briefcase className="w-10 h-10 text-blue-600 mb-3" />
                                <h3 className="font-bold text-slate-900">Corporate</h3>
                                <p className="text-xs text-slate-500 mt-2">Single-owner flight departments.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <Users className="w-10 h-10 text-emerald-600 mb-3" />
                                <h3 className="font-bold text-slate-900">Charter</h3>
                                <p className="text-xs text-slate-500 mt-2">Multi-client operations.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center col-span-2">
                                <Star className="w-10 h-10 text-purple-600 mb-3" />
                                <h3 className="font-bold text-slate-900">VIP/VVIP</h3>
                                <p className="text-xs text-slate-500 mt-2">Ultra-high-net-worth and government.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: PilotRecognition Preparation */}
                <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xs font-bold text-blue-300 uppercase tracking-[0.3em] mb-2 text-center">
                            Your Preparation
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                            How PilotRecognition Gets You Charter-Ready
                        </h2>
                        <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8 text-center">
                            The Transition Program doesn't just teach you to fly—it teaches you to operate like a charter professional from day one. We focus on the soft skills and industry knowledge that separate good pilots from hired pilots.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold mb-3">Professional Development</h3>
                                <ul className="space-y-2 text-sm text-slate-200">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Client interaction and communication protocols</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Discretion and confidentiality training</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Service excellence and hospitality standards</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Professional appearance and conduct guidelines</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold mb-3">Operational Skills</h3>
                                <ul className="space-y-2 text-sm text-slate-200">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>International operations and customs procedures</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>FBO coordination and ground handling</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Trip planning for complex itineraries</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Emergency response and contingency planning</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
                            <h3 className="text-lg font-bold mb-3">Industry Connections</h3>
                            <p className="text-sm text-slate-200 leading-relaxed mb-4">
                                PilotRecognition maintains relationships with chief pilots, charter brokers, and corporate flight department managers. Transition Program members receive:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-200">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span>Direct introductions to hiring managers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span>Resume optimization for charter roles</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span>Interview preparation and mock scenarios</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span>Mentorship from active charter pilots</span>
                                </li>
                            </ul>
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

                {/* Section 5: Getting Started */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Your Next Step
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        Break Into Private Charter
                    </h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-8">
                        The private charter sector values professionalism and service excellence over raw hours. With the right preparation and connections, you can enter this rewarding career path earlier than you think. PilotRecognition's Transition Program provides both.
                    </p>

                    <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Ready to Elevate Your Career?</h3>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            Join the PilotRecognition Transition Program and gain the professional skills, industry knowledge, and connections needed to succeed in corporate and VIP aviation.
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
