import React from 'react';
import { ArrowLeft, Mail, Users, Shield, Cpu, Radio, Map, Target } from 'lucide-react';

interface PlatformPilotedDronesPageProps {
    onNavigate: (page: string) => void;
}

export const PlatformPilotedDronesPage: React.FC<PlatformPilotedDronesPageProps> = ({
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
                        Future Aviation &amp; RPAS
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Piloted &amp; Automated Drones
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        The convergence of traditional aviation and unmanned systems is here. From piloted eVTOL operations to
                        fully automated drone logistics, PilotRecognition provides the pathway for pilots to master the next generation of flight.
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">

                {/* Section 1: The Shift */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Industry Shift
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Piloted Drones vs. Pilotless Drones
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            <strong>MLG's "Pilotless" Approach:</strong> While these systems appear to be fully autonomous to the observer, they are in fact meticulously controlled from a centralized headquarters. This "pilotless" model relies on advanced safety protocols and data links, but the human pilot remains the "brains of the flight"—managing mission parameters, contingencies, and air traffic integration from the ground.
                        </p>
                        <ul className="mt-2 space-y-2 text-base text-slate-700 list-disc list-inside md:list-outside md:pl-5 text-left mb-6">
                            <li><strong>Remote Command:</strong> Pilots transition from the cockpit to mission control centers.</li>
                            <li><strong>Passenger Safety:</strong> Future pathways include remotely piloting passenger-carrying drones.</li>
                            <li><strong>Strategic Oversight:</strong> The role shifts from manual stick-and-rudder to high-level systems management.</li>
                        </ul>
                        <p className="text-base text-slate-700 leading-relaxed">
                            <strong>Expanding Mission Profiles:</strong> The future massive demand extends beyond logistics. We are seeing a surge in specialized "mission pilotless drones" for <strong>agricultural precision, sea floor bed surveys, and terrain-penetrating radar</strong> operations from air, land, and sea. These complex missions require skilled aviators to manage the automated systems, ensuring safe and effective execution in challenging environments.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full mx-auto">
                            <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-lg relative group">
                                <img
                                    src="/images/drones-image.png"
                                    alt="Unmanned Drone"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 text-center italic">
                                MLG prototype Pilotless Drone
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Automated vs Piloted */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Operational Modes
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Piloted Loop vs. Fully Autonomous
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Understanding the distinction is vital for your career path. "Piloted Drones" (RPAS) keep the human in the loop for critical decision-making, often required for passenger-carrying eVTOLs or hazardous cargo. "Automated Drones" rely on pre-programmed mission profiles where the pilot becomes a systems manager.
                        </p>
                        <ul className="mt-2 space-y-2 text-base text-slate-700 list-disc list-inside md:list-outside md:pl-5 text-left">
                            <li><strong>Piloted (RPAS):</strong> Active control inputs, real-time latency management, immediate emergency authority.</li>
                            <li><strong>Automated:</strong> Waypoint navigation, obstacle avoidance logic, supervisory monitoring usage.</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <Radio className="w-10 h-10 text-blue-600 mb-3" />
                                <h3 className="font-bold text-slate-900">RPAS</h3>
                                <p className="text-xs text-slate-500 mt-2">Remote Pilot Aircraft Systems. Human-in-the-loop.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <Map className="w-10 h-10 text-emerald-600 mb-3" />
                                <h3 className="font-bold text-slate-900">Autonomous</h3>
                                <p className="text-xs text-slate-500 mt-2">AI-driven pathfinding and collision avoidance.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center col-span-2">
                                <Target className="w-10 h-10 text-purple-600 mb-3" />
                                <h3 className="font-bold text-slate-900">Mission Profiles</h3>
                                <p className="text-xs text-slate-500 mt-2">Surveillance, Agriculture, Logistics, Urban Mobility.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certification Path */}
            <div className="pb-12 px-6 max-w-4xl mx-auto text-center mt-12">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                    Training &amp; Certification
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                    Your Pathway to the Future
                </h2>
                <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-3">
                    PilotRecognition guides you through the certification maze. Whether you are adding a remote rating to your CPL or starting from scratch, we align you with approved training entities for Specific Category operations and eVTOL type ratings.
                </p>
                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-base text-slate-700 leading-relaxed">
                        <strong>Industry Update:</strong> PilotRecognition has spoken with <strong>MLG</strong> regarding unmanned systems. They have confirmed that Commercial Pilot License (CPL) holders are eligible to undergo training for autonomous drone operations. Please note that based on your existing qualifications and skills, this eligibility is currently <span className="font-semibold text-blue-900">limited to aerial drones</span>.
                    </p>
                </div>
            </div>

        </div>
    );
};
