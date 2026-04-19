import React from 'react';
import { Plane, Shield, Users, CheckCircle2, ChevronRight, Globe, Building2, Zap, Briefcase } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { IMAGES } from '../../../src/lib/website-constants';

interface AccreditationPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

const ACCREDITATION_URL = "/images/accreditation-1.png";
const ACCREDITATION_2_URL = "/images/accreditation-2.png";
const ACCREDITATION_3_URL = "/images/accreditation-3.png";
const ACCREDITATION_4_URL = "/images/accreditation-4.png";
const ACCREDITATION_5_URL = "/images/accreditation-5.png";

export const AccreditationPage: React.FC<AccreditationPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const partnershipTiles = [
        {
            title: "UAE GCAA Career Fair 2026",
            desc: "Meeting face-to-face with industry pioneers and global aviation experts to shape the future of pilot training.",
            icon: Users,
        },
        {
            title: "Etihad Airways Consultation",
            desc: "Direct engagement with the Head of Training at Etihad Airways to align our standards with flagship carrier demands.",
            icon: Plane,
        },
        {
            title: "Airbus EBT Division",
            desc: "Collaborating with Airbus to integrate Evidence-Based Training analytics and human factors into our pathways.",
            icon: Building2,
        },
        {
            title: "Archer Aviation & eVTOL",
            desc: "Positioning our pilots at the forefront of the urban air mobility revolution through direct manufacturer links.",
            icon: Zap,
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src={IMAGES.LOGO}
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            RECOGNITION | ASSURANCE | SUPPORT
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Accreditation & Recognition
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            WingMentor is the aviation industry’s first Competency Assurance Network. We are connecting all pilots,
                            whether you are a low-timer searching for pathways or a seasoned captain seeking new opportunities.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Magazine Content Rows */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-24">

                {/* Row 1: Etihad Museum Milestone (Text Left, Image Right) - Now at Top */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                                HISTORIC EVENT
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                The First Aviation Career Fair <br />at Etihad Museum
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                                On <strong>January 21st</strong>, WingMentor marked a historic milestone by attending the first-ever aviation career fair hosted at the prestigious <strong>Etihad Museum</strong> in the UAE.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                                Representing the next generation of flight training excellence, we stood alongside industry pioneers to bridge the gap between education and employment. This event was not just a career fair; it was a verification of our mission to ensure that every pilot graduating into the market is recognized, assured, and supported by the world's leading aviation bodies.
                            </p>
                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 max-w-lg">
                                <p className="text-blue-900 text-sm font-semibold mb-1">Impact & Vision</p>
                                <p className="text-blue-800/80 text-sm leading-relaxed">
                                    Direct engagement with over 1,000 aspiring pilots, aligning their career pathways with real-world airline expectations from day one.
                                </p>
                            </div>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll delay={200}>
                            <div className="relative group p-[1px] bg-gradient-to-b from-blue-200 to-transparent rounded-[2rem]">
                                <img
                                    src={IMAGES.ETIHAD_MUSEUM_EVENT}
                                    alt="Etihad Museum Event"
                                    className="w-full h-auto rounded-[2rem] shadow-2xl transition-all duration-700 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/20"></div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* Row 2: Industry Stewardship (Text Only) */}
                <div className="max-w-4xl mx-auto">
                    <RevealOnScroll>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                            Stewardship
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                            Our Journey to <br />Industry Leadership
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                            WingMentor is proudly part of the <strong>WM Pilot Group</strong>, a collective dedicated to advancing aviation excellence.
                            We are a bridge and a link between pilots and the aviation industry, connecting the world's leading airline bodies with elite talent.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                            Beyond providing various pathways for pilot experience building and accredited credential programs, we are actively shaping the future of aviation policy. Along with our flagship applications and our proprietary pilot recognition database, our committee members sit on advisory boards that influence regulatory training standards, ensuring that the voice of the modern pilot is heard in the halls of rule-making bodies.
                        </p>

                        <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                            <p className="text-slate-600 text-sm font-sans leading-relaxed">
                                Making the connection between pilot & Industry Expectations, demands & Pilot Recognition easier like never before.
                            </p>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Row 3: Global Standards (Text Only) */}
                <div className="max-w-4xl mx-auto pb-12">
                    <RevealOnScroll>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
                            Global Standards
                        </p>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-10 leading-tight text-center">
                            Excellence in <br />Global Industry Connection
                        </h2>
                        <div className="space-y-6 mb-12">
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans text-center">
                                WingMentor is not a training organization; we are the essential "go-between" for pilots and the aviation industry, connecting the world's leading bodies with elite talent.
                            </p>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans text-center">
                                Our proprietary pilot database is rigorously vetted and screened to ensure that every pilot within our network is seen, recognized, and fully understands the critical expectations of the modern airline industry. By serving as a unifying standard, we bridge the gap between individual skill and institutional requirements, creating a universally recognized benchmark of competency.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: Globe, title: "Industry Alignment", text: "Universal alignment with International Civil Aviation Organization and global industry benchmarks." },
                                { icon: CheckCircle2, title: "Vetted & Screened", text: "A rigorous validation process ensuring all pilots meet the highest professional standards." },
                                { icon: Shield, title: "Regulatory Gateway", text: "Direct connections to regulatory bodies including GCAA & EASA to facilitate recognition." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-2">{item.title}</h4>
                                        <p className="text-slate-600 text-[13px] leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Strategic Partnerships Grid - Matches "Pillars of Professional Growth" */}
            <div className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-50 mt-12">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-4">Collaboration</p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900">Pilot Recognition</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {partnershipTiles.map((tile, idx) => (
                        <div key={idx} className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group">
                            <tile.icon className="w-8 h-8 text-blue-600 mb-8 transition-transform group-hover:scale-110" />
                            <h3 className="text-lg font-bold mb-3 font-sans text-slate-800 tracking-wide uppercase">{tile.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-sans">{tile.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Accreditation Logos with White Background */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6">
                        RECOGNITION | ASSURANCE | SUPPORT
                    </p>
                    <p className="text-slate-600 text-base max-w-2xl mx-auto mb-16 font-sans leading-relaxed">
                        Strategic presence at the Etihad Museum UAE Career Fair, represented by leading aviation governing bodies.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <img src={IMAGES.ACCREDITATION_1} alt="Promising Future" className="h-10 md:h-12 w-auto object-contain" />
                        <img src={IMAGES.ACCREDITATION_2} alt="Airbus" className="h-10 md:h-12 w-auto object-contain" />
                        <img src={IMAGES.ACCREDITATION_3} alt="Etihad Airways" className="h-10 md:h-12 w-auto object-contain" />
                        <img src={IMAGES.ACCREDITATION_5} alt="WM Pilot Group" className="h-12 md:h-16 w-auto object-contain" />
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Bridging the Industry Gap</h2>
                    <p className="text-lg text-slate-600 mb-10 font-sans">
                        Join the global network of pilots and gain direct visibility to recruiters and operators worldwide.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <button
                            onClick={() => onNavigate('become-member')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                        >
                            Apply for Membership
                        </button>
                        <button
                            onClick={onLogin}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-12 py-5 rounded-full font-bold text-lg transition-all font-sans"
                        >
                            Portal Access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
