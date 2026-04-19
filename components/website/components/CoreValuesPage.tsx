import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface CoreValuesPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const CoreValuesPage: React.FC<CoreValuesPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            The WingMentor DNA
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Core Values
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Connection | Attitude | Respect
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                            Our values are not just words on a wall; they are the behavioral markers we expect
                            from every pilot in our network. Connection, Attitude, and Respect define who we are
                            and how we fly.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Value 1: Connection */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        The Power of Network
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Connection
                    </h2>
                    <div style={{ maxWidth: '4xl', margin: '0 auto', paddingTop: '1.5rem' }}>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Aviation is a small world, but it can feel vast and lonely when you are starting out.
                            We believe that meaningful connection is the antidote to career stagnation. Through our
                            <strong>Pilot Terminal</strong> social network, pilots can connect with mentors, instructors,
                            and aviation professionals worldwide, creating a robust support system that spans the entire
                            aviation ecosystem.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            By connecting low-timers with captains, and captains with operators, we create a
                            circular economy of mentorship where wisdom is passed down and opportunity is passed up.
                            Our <strong>50 hours of verifiable logged effort-based mentorship</strong> in the Foundational Program
                            ensures that connections translate into tangible professional growth, with mentees receiving
                            verified logbook entries and mentors building their leadership credentials.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            The WingMentor network extends beyond mentorship to include <strong>direct pathway connections</strong>
                            with airlines, manufacturers, and training providers. When operators post opportunities on
                            our platform, they appear on Pilot Terminal with match indicators showing alignment with your
                            verified competencies. This intelligent matching system ensures that connections lead to
                            meaningful career opportunities, not just social interactions.
                        </p>
                    </div>
                </RevealOnScroll>
            </div>

            {/* Value 2: Attitude */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        The Professional Mindset
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Attitude
                    </h2>
                    <div style={{ maxWidth: '4xl', margin: '0 auto', paddingTop: '1.5rem' }}>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Skills can be developed, but attitude is chosen. We champion the pilots who show up early,
                            prepare thoroughly, and own their mistakes. Our <strong>EBT CBTA-aligned assessment framework</strong>
                            evaluates not just technical proficiency, but the behavioral competencies that distinguish
                            exceptional pilots from the merely competent.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            A WingMentor pilot doesn't just fly the plane; they manage the operation with
                            humility, resilience, and an unshakeable commitment to safety standards. Through our
                            partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that the attitude
                            we cultivate aligns with the exacting standards required by leading manufacturers and
                            operators worldwide.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Our Foundational Program's <strong>9 core competencies</strong> framework—aligned with AIRBUS
                            standards—specifically addresses attitude through competencies like <strong>decision making</strong>,
                            <strong>situational awareness</strong>, and <strong>crew resource management</strong>. These behavioral
                            markers are objectively assessed through our recognition-based profiling, giving operators
                            confidence that a WingMentor pilot possesses the professional mindset required for safe,
                            efficient operations in any environment.
                        </p>
                    </div>
                </RevealOnScroll>
            </div>

            {/* Value 3: Respect */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Mutual & Self Respect
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Respect
                    </h2>
                    <div style={{ maxWidth: '4xl', margin: '0 auto', paddingTop: '1.5rem' }}>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Respect for the uniform, respect for the regulations, and respect for our peers.
                            In a multi-crew environment, respect is the foundation of effective communication.
                            Our platform enforces this principle through <strong>verified competency documentation</strong> that
                            ensures all pilots in our network have demonstrated the professional standards expected
                            in commercial aviation operations.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            We foster a culture where every voice is heard, from the cadet to the captain,
                            creating a safer and more inclusive cockpit for everyone. Our <strong>CRM (Crew Resource Management)</strong>
                            competency assessments specifically evaluate a pilot's ability to communicate respectfully,
                            listen actively, and contribute constructively to crew decisions—skills that are essential
                            for safe multi-crew operations.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This culture of respect extends to our <strong>pathway matching system</strong>, which treats all pilots
                            objectively based on their verified competencies and recognition scores, regardless of background
                            or connections. When operators access our platform, they see pilots evaluated on merit—through
                            <strong>blockchain-verifiable certifications</strong> and <strong>EBT-aligned assessments</strong>—ensuring fair
                            and equitable access to career opportunities based on demonstrated professional capability.
                        </p>
                    </div>
                </RevealOnScroll>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center bg-white">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Overview
                </button>
            </div>
        </div>
    );
};
