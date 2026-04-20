import React from 'react';
import { Shield, Target, GraduationCap, Plane, Cpu, Briefcase, Award, FileText, LayoutGrid, ChevronRight, Globe, Layers, Navigation, Zap } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';

interface ProgramsPathwaysPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ProgramsPathwaysPage: React.FC<ProgramsPathwaysPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const corePrograms = [
        {
            title: "Foundational Program",
            desc: "The literal foundation of our pilot organization. Bridging the gap from 'I have a license' to 'I am a professional'. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, our <strong>50 hours of verifiable mentorship</strong> provides the <strong>EBT CBTA-aligned assessment framework</strong> that modern airlines demand. Our <strong>AI-powered pathway matching</strong> system identifies opportunities where your demonstrated competencies match airline requirements.",
            target: "become-member",
            icon: GraduationCap,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Transition Program",
            desc: "Designed for instructors and low-timers seeking to transition into multi-crew and jet environments. Through our partnership with <strong>Airbus Head of Training</strong>, we ensure that our <strong>EBT CBTA-aligned assessment framework</strong> specifically evaluates the CRM and multi-crew competencies that modern airlines require. Our <strong>blockchain-verifiable certifications</strong> and <strong>ATS-compatible ATLAS Aviation CV formatting</strong> provide pilots with cutting-edge tools for career advancement.",
            target: "transition-program",
            icon: Target,
            color: "text-red-600",
            bg: "bg-red-50"
        },
        {
            title: "Program Benefits",
            desc: "Discover comprehensive benefits including accredited recognition, verified mentorship, EBT CBTA alignment, industry networking, career acceleration, global opportunities, continuous growth, and profile verification. Transform your aviation career with our recognition-based programs.",
            target: "benefits",
            icon: Award,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "News & Updates",
            desc: "Stay informed about the latest developments, partnerships, and achievements in our pilot recognition-based programs. Get updates on AIRBUS partnership expansion, Etihad Aviation Training integration, and AI-powered pathway matching.",
            target: "news-updates",
            icon: FileText,
            color: "text-green-600",
            bg: "bg-green-50"
        }
    ];

    const pathways = [
        {
            title: "Air Taxi & eVTOL",
            desc: "Preparing pilots for the emerging eVTOL and Urban Air Mobility (UAM) sectors. Through our partnership with <strong>Airbus Head of Training</strong>, we ensure that pathway development aligns with manufacturer standards for urban air mobility. Our <strong>EBT CBTA-aligned assessment framework</strong> specifically evaluates the competencies required for advanced air mobility operations.",
            target: "emerging-air-taxi",
            icon: Zap,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Private Charter",
            desc: "Direct links to private jet operators and specialized business aviation training. We foster a culture of respect where every voice is heard, from the cadet to the captain. Our <strong>pathway matching system</strong> treats all pilots objectively based on verified competencies and recognition scores, ensuring fair and equitable access to career opportunities based on demonstrated professional capability rather than connections.",
            target: "private-charter-pathways",
            icon: Briefcase,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "Seaplane & Float Ops",
            desc: "Specialized training for island transfers and amphibious flight deck handling. Through our partnership with <strong>Airbus Head of Training</strong>, we ensure that program development aligns with manufacturer standards for specialized operations. Our <strong>AI-powered pathway matching</strong> system identifies opportunities where your demonstrated competencies match operator requirements.",
            target: "about_programs",
            icon: Navigation,
            color: "text-cyan-600",
            bg: "bg-cyan-50"
        },
        {
            title: "Unmanned Systems",
            desc: "Focusing on large-scale BVLOS operations and heavy-lift unmanned logistics. Through our partnership with <strong>Airbus Head of Training</strong>, we ensure that technology development aligns with industry standards for competency assessment. Our <strong>blockchain-verifiable certifications</strong> and <strong>ATS-compatible ATLAS Aviation CV formatting</strong> provide pilots with cutting-edge tools for career advancement.",
            target: "piloted-drones",
            icon: Cpu,
            color: "text-slate-600",
            bg: "bg-slate-50"
        },
        {
            title: "Cargo Transportation",
            desc: "Supply chain resilience and heavy logistics for the global feeder network. Through our partnership with <strong>Etihad Cadet Program</strong> and Head of Training, we ensure that pathway development aligns with flagship carrier expectations. Our <strong>AI-powered pathway matching</strong> system identifies opportunities where your demonstrated competencies match cargo operator requirements.",
            target: "about_programs",
            icon: Layers,
            color: "text-zinc-600",
            bg: "bg-zinc-50"
        }
    ];

    const systems = [
        {
            title: "Pilot Recognition",
            desc: "The industry's first Competency Assurance Network. Your skills, verified and recognized. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that our <strong>EBT CBTA-aligned assessment framework</strong> provides objective evaluation of pilot readiness across technical and non-technical domains. Our <strong>blockchain-verifiable certifications</strong> provide pilots with cutting-edge tools for career advancement.",
            target: "pilot-recognition",
            icon: Award,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            title: "Digital Flight Logbook",
            desc: "View your complete collection of licenses, flight hours, certifications, and professional milestones. Our digital logbook provides live tracking of your hours where every hour contributes to your Pilot Recognition Score, transforming your logbook into a meaningful career development tool.",
            target: "digital-logbook-directory",
            icon: FileText,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            title: "ATLAS CV Systems",
            desc: "Modernizing pilot profiles to meet manufacturer and recruiter data-driven standards. Through our partnership with <strong>Airbus Head of Training</strong>, we ensure that technology development aligns with industry standards for competency assessment. Our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> and <strong>AI-powered pathway matching</strong> system provide pilots with cutting-edge tools for career advancement.",
            target: "atlas-cv",
            icon: FileText,
            color: "text-sky-600",
            bg: "bg-sky-50"
        },
        {
            title: "EBT & CBTA Programs",
            desc: "Evidence-Based Training familiarization using integrated Airbus and Hinfact analytics. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our programs align with the exacting standards required by leading manufacturers and operators worldwide. Our <strong>AI-powered pathway matching</strong> system identifies opportunities where your demonstrated competencies match airline requirements.",
            target: "ebt-cbta",
            icon: LayoutGrid,
            color: "text-rose-600",
            bg: "bg-rose-50"
        }
    ];

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Programs & Pathways', url: '/programs' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section with Hero Image */}
            <div className="relative pt-32 pb-20 px-6">
                {/* Background Image - Foundational Program */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g"
                        alt="Foundational Program"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-400 mb-6 font-sans">
                            Directory
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-4">
                            Programs & Pathways
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none text-white" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Foundational | Transition | Specialized
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-white/90 leading-relaxed font-sans mt-6">
                            A comprehensive ecosystem designed to bridge the pilot gap. Explore our core foundational programs,
                            specialized career pathways, and industry-leading recognition systems. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our programs align with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Core Programs Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Program Structure
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Core Programs
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {corePrograms.map((prog, idx) => (
                        <ProgramCard 
                            key={idx} 
                            title={prog.title} 
                            desc={prog.desc} 
                            color={prog.color} 
                            onClick={() => onNavigate(prog.target)}
                            onLearnMore={prog.title === "Foundational Program" ? () => onNavigate('foundational-program') : undefined}
                        />
                    ))}
                </div>
            </div>

            {/* Pathways Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60A5FA', fontWeight: 600 }}>
                        Career Opportunities
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: 'white' }}>
                        Aviation Pathways
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pathways.map((prog, idx) => (
                            <div
                                key={idx}
                                onClick={() => onNavigate(prog.target)}
                                className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <h3 className="text-xl font-bold mb-4 font-sans">{prog.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">{prog.desc}</p>
                                <div className="flex items-center text-blue-400 text-sm font-bold uppercase tracking-widest gap-2 font-sans">
                                    Explore Pathway <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Systems Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Technology Ecosystem
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Ecosystem Systems
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {systems.map((prog, idx) => (
                        <ProgramCard key={idx} title={prog.title} desc={prog.desc} color={prog.color} onClick={() => onNavigate(prog.target)} />
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-lg text-slate-600 mb-10 font-sans">Join our global network of verified pilots and gain access to the industry's most specialized mentorship and tools.</p>
                    <button
                        onClick={() => onNavigate('become-member')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                    >
                        Apply for Enrollment
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

const ProgramCard = ({ title, desc, color, onClick, onLearnMore }: any) => (
    <div
        onClick={onClick}
        className="group bg-white border border-slate-200 p-8 rounded-3xl hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer"
    >
        <h3 className="text-xl font-bold text-slate-900 mb-4 font-sans">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">{desc}</p>
        {onLearnMore ? (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onLearnMore();
                }}
                className={`flex items-center ${color} text-sm font-bold uppercase tracking-widest gap-2 font-sans cursor-pointer hover:opacity-80`}
            >
                Learn More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        ) : (
            <div className={`flex items-center ${color} text-sm font-bold uppercase tracking-widest gap-2 font-sans`}>
                Learn More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        )}
    </div>
);
