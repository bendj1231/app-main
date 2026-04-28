import React from 'react';
import { Shield, Users, CheckCircle2, Globe, Zap } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { IMAGES } from '../../../src/lib/website-constants';

interface AccreditationPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const AccreditationPage: React.FC<AccreditationPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const partnershipTiles = [
        {
            title: "EBT CBTA FRAMEWORK",
            desc: "Our programs align with Evidence-Based Training and Competency-Based Training and Assessment frameworks, which are international standards in pilot training. The <strong>9 core competencies</strong> framework provides a comprehensive structure for evaluating pilot readiness across technical and non-technical domains, ensuring alignment with modern airline requirements.",
        },
        {
            title: "VERIFIED COMPETENCY DATABASE",
            desc: "Access to verified data on pilot professional competencies through our PilotRecognition platform, including <strong>EBT CBTA 9 core competencies</strong> and behavioral assessments. Our <strong>blockchain-verifiable certifications</strong> provide operators with confidence in pilot credentials, while our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> ensures standardized presentation across global recruitment systems.",
        },
        {
            title: "DIRECT INDUSTRY CONNECTIONS",
            desc: "Platform access for operators to post jobs and airline expectations, connecting directly to 5000+ pilots seeking opportunities in the aviation industry. Through our <strong>Pilot Terminal</strong> social network and <strong>enterprise integration</strong>, operators can access candidates with verified competencies, recognition scores, and pathway interests, creating a transparent and efficient recruitment marketplace.",
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
                            alt="PilotRecognition Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            RECOGNITION | ASSURANCE | SUPPORT
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-4">
                            Accreditation & Recognition
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Industry Alignment | Global Standards | Professional Excellence
                        </span>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            PilotRecognition is the aviation industry's first Competency Assurance Network. We are connecting all pilots,
                            whether you are a low-timer searching for pathways or a seasoned captain seeking new opportunities.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Magazine Content Rows */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-24">

                {/* Row 1: Etihad Museum Milestone (Text Left, Image Right) - Now at Top */}
                <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                    <RevealOnScroll>
                        <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                            HISTORIC EVENT
                        </p>
                        <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                            The First Aviation Career Fair at Etihad Museum
                        </h2>
                    </RevealOnScroll>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                                On <strong>January 21st</strong>, PilotRecognition marked a historic milestone by attending the first-ever aviation career fair hosted at the prestigious <strong>Etihad Museum</strong> in the UAE. This event brought together leading aviation bodies, airlines, and training providers, creating a unique platform for direct engagement between aspiring pilots and industry leaders.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                                Representing the next generation of flight training excellence, we stood alongside industry pioneers to bridge the gap between education and employment. This event was not just a career fair; it was a verification of our mission to ensure that every pilot graduating into the market is recognized, assured, and supported by the world's leading aviation bodies. Our presence at the Etihad Museum demonstrated our commitment to <strong>EBT CBTA-aligned assessment</strong> and competency-based recognition.
                            </p>
                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 max-w-lg">
                                <p className="text-blue-900 text-sm font-semibold mb-1">Impact & Vision</p>
                                <p className="text-blue-800/80 text-sm leading-relaxed">
                                    Direct engagement with over 1,000 aspiring pilots, aligning their career pathways with real-world airline expectations from day one.
                                </p>
                                <p className="text-blue-900 text-sm font-semibold mt-4 mb-1">Etihad Museum Event</p>
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
                <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                    <RevealOnScroll>
                        <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                            STEWARDSHIP
                        </p>
                        <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                            The Essential Go-Between for Pilots & Industry
                        </h2>
                    </RevealOnScroll>
                </div>

                <div className="max-w-4xl mx-auto">
                    <RevealOnScroll>
                        <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                            PilotRecognition is not a training organization; we are the essential bridge connecting pilots and the aviation industry, linking the world's leading bodies with elite talent. Our proprietary pilot database is rigorously vetted and screened to ensure that every pilot within our network is seen, recognized, and fully understands the critical expectations of the modern airline industry. Through our <strong>PilotRecognition platform</strong>, we provide <strong>ATS-compatible ATLAS Aviation CV formatting</strong> that presents pilot credentials in the standardized format preferred by major airlines worldwide.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                            By serving as a unifying standard, we bridge the gap between individual skill and institutional requirements, creating a universally recognized benchmark of competency. Our programs are aligned with <strong>AIRBUS 9 core competencies</strong> and supported by industry leaders, ensuring that verified competencies translate directly to operational readiness. Our platform aligns with Airbus EBT CBTA standards, ensuring alignment with industry standards.
                        </p>

                        <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
                            <p className="text-slate-600 text-sm font-sans leading-relaxed">
                                Universal alignment with International Civil Aviation Organization and global industry benchmarks through verified competency data and PilotRecognition profiles.
                            </p>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Row 3: Global Standards (Text Only) */}
                <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                    <RevealOnScroll>
                        <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                            GLOBAL STANDARDS
                        </p>
                        <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                            Excellence in Global Industry Connection
                        </h2>
                    </RevealOnScroll>
                </div>

                <div className="max-w-4xl mx-auto pb-12">
                    <RevealOnScroll>
                        <div className="space-y-6 mb-12">
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans text-center">
                                PilotRecognition is not a training organization; we are the essential "go-between" for pilots and the aviation industry, connecting the world's leading bodies with elite talent. Our platform provides <strong>AI-powered pathway matching</strong> that analyzes pilot profiles against operator requirements, ensuring that connections lead to meaningful career opportunities.
                            </p>
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans text-center">
                                Our proprietary pilot database is rigorously vetted and screened to ensure that every pilot within our network is seen, recognized, and fully understands the critical expectations of the modern airline industry. By serving as a unifying standard, we bridge the gap between individual skill and institutional requirements, creating a universally recognized benchmark of competency through our <strong>blockchain-verifiable certifications</strong> and <strong>EBT-aligned assessments</strong>.
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

                {/* Row 4: Guardians of the Profession */}
                <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                    <RevealOnScroll>
                        <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                            INDUSTRY STEWARDSHIP
                        </p>
                        <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                            Guardians of the Profession
                        </h2>
                    </RevealOnScroll>
                </div>

                <div className="max-w-6xl mx-auto pb-12">
                    <RevealOnScroll>
                        <div className="text-center mb-12">
                            <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans max-w-3xl mx-auto">
                                We view our role as more than a service provider. We are custodians of the pilot profession, dedicated to raising safety standards, advocating for aircrew, and preparing the next generation for a sustainable future.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Elevating Standards */}
                            <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">ELEVATING STANDARDS</h3>
                                <p className="text-sm font-bold text-blue-700 mb-4">EBT & Safety Alignment</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    The era of "box-ticking" training is over. We champion Evidence-Based Training (EBT) and Competency-Based Training & Assessment (CBTA) as the only way forward for global aviation safety. By integrating these methodologies into our Foundational Program through our partnership with <strong>Airbus Head of Training</strong>, we ensure that even low-time pilots are developing the resilience and decision-making skills required by modern flight decks.
                                </p>
                            </div>

                            {/* The Voice of the Pilot */}
                            <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">THE VOICE OF THE PILOT</h3>
                                <p className="text-sm font-bold text-blue-700 mb-4">Pilot Advocacy</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    In a profit-driven industry, the voice of the pilot can be drowned out. We serve as an independent advocate, representing the interests of our members to regulators, airlines, and flight schools. Through our <strong>Pilot Terminal</strong> social network and <strong>enterprise integration</strong>, we push for fair hiring practices, transparent career pathways, and mental health support, ensuring that the human element remains at the center of aviation. Our <strong>AI-powered pathway matching</strong> system provides objective competency assessment, reducing bias in recruitment decisions.
                                </p>
                            </div>

                            {/* Future Ready */}
                            <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:shadow-xl transition-all">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                                    <Zap className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">FUTURE READY</h3>
                                <p className="text-sm font-bold text-blue-700 mb-4">Vision 2030</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Aviation is changing. From sustainable fuels to single-pilot operations and urban air mobility, we are preparing our pilots for the flight deck of tomorrow. Our stewardship involves anticipating these shifts and updating our competency frameworks continuously. Through our partnership with <strong>Archer Aviation</strong> and other eVTOL leaders, we ensure a PilotRecognition pilot is always ahead of the curve, ready for emerging pathways in electric aviation, autonomous systems, and sustainable operations.
                                </p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Strategic Partnerships Grid */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        COLLABORATION
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Pilot Recognition
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto border-t border-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {partnershipTiles.map((tile, idx) => (
                        <div key={idx} className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group">
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
                        <p className="text-slate-800 font-bold">Promising Future</p>
                        <p className="text-slate-800 font-bold">Airbus</p>
                        <p className="text-slate-800 font-bold">Etihad Airways</p>
                        <p className="text-slate-800 font-bold">WM Pilot Group</p>
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
