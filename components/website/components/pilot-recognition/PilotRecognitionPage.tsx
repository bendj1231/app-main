import React from 'react';
import { ArrowLeft, Award, Shield, CheckCircle2, Zap, Search, UserCheck, Lock } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';

interface PilotRecognitionPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PilotRecognitionPage: React.FC<PilotRecognitionPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Pilot Recognition', url: '/pilot-recognition' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Professional Identity
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                        Pilot Recognition
                    </h1>
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-700 mb-6">
                        Recognition-Based Profile
                    </p>

                    <div className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 space-y-12 pt-12">
                        <div>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-3">
                                The Problem
                            </p>
                            <p>
                                The most significant challenge facing the aviation industry today is professional <strong>Recognition</strong>. Pilots invest <strong>$50,000 USD</strong> in training and dedicate <strong>4 years</strong> to university education, yet many find themselves relying on job application platforms that have not been updated since <strong>2007</strong>, or resorting to informal job searches on social media platforms such as <strong>Facebook</strong>, which undermines professional standards.
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-3">
                                The Solution & Challenges
                            </p>
                            <p>
                                This reality prompted the establishment of <strong>PilotRecognition.com</strong>. Following strategic discussions with <strong>AIRBUS</strong>, <strong>Etihad</strong>, and <strong>Archer</strong>, the industry faces undeniable challenges: recent graduates are unable to secure employment due to the <strong>1500-hour requirement</strong>, flight instructors who have reached these hours remain employed at the same flight school for over <strong>10 years</strong>, and airline pilots operating <strong>international long-haul flights</strong> seek career advancement opportunities while constrained by time limitations.
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-3">
                                The Future
                            </p>
                            <p>
                                You have arrived at the appropriate destination. Welcome to the <strong>future of aviation</strong>, where effective communication between the industry and the pilot profession <strong>bridges the gap</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Readable Content */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                {/* Section 1: Re-inventing the Pilot Flight Logbook */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Innovation
                    </p>
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-4">
                        Re-inventing the Pilot Flight Logbook
                    </h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-4">
                        Many believe that <strong>re-inventing</strong> an existing system for logging flight hours would be a waste of time. When people speak of <strong>digitalization</strong> as the innovation of aviation, they refer to digital logbooks that enable logging flight hours on an <strong>iPad</strong>. However, nothing has fundamentally changed—the transition from a book to an iPad merely replicates the same input process. While digital logbooks can store <strong>1000 hours</strong>, so can paper logbooks.
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed mb-4">
                        The <strong>traditional logbook</strong> has remained unchanged. PilotRecognition.com introduces <strong>Pilot Recognition-based Flight Logbooks</strong>, where your logbook serves a meaningful purpose beyond proving flight hours for checkrides or recency requirements. We have implemented <strong>live tracking</strong> of your hours, where every hour contributes to your <strong>Pilot Recognition Score</strong>.
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed mb-4">
                        When airlines access our platform, they gain access to a <strong>database of pilots</strong>. They would rather see a pilot who has maintained a <strong>high recognition score</strong>, indicating recent flight activity, than a pilot who has not flown for <strong>two years</strong> despite having <strong>1000 hours</strong>. A pilot with <strong>500 recent hours</strong> holds greater value than a pilot with <strong>1500 hours</strong> who flew <strong>five years ago</strong>.
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed mb-4">
                        We have identified the <strong>recognition factor</strong> in your logbook and will ensure your logbook keeps you on track. Our <strong>PilotRecogAI</strong> will provide notifications such as: "John, your recognition score is declining. Why not book a flight occasionally, since you have been aiming for that airline expectation?"
                    </p>
                </div>

                {/* Section 2: Recognition-Based Pathways */}
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Recognition-Based Pathways
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Your <strong>Pilot Recognition Profile</strong> will automatically suggest pathways based on your <strong>Pilot Recognition Profile Score</strong> and match percentage. The score determines an overall assessment of your profile in comparison to the overall job position, and you will be in greater favor if you possess a <strong>higher score</strong>. This <strong>intelligent matching system</strong> analyzes your flight hours, certifications, competencies, and recent activity to identify the <strong>most suitable career opportunities</strong> tailored to your professional development.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        <strong>Operators and airlines</strong> will access your profile based on your interests in their programs or pathways, and they will evaluate your <strong>profile score</strong>. The <strong>percentage match</strong> compares the requirements from the job to your current profile, providing you with a percentage. This comprehensive evaluation ensures that airlines can identify pilots who not only meet the technical requirements but also demonstrate <strong>recent engagement</strong>, competency growth, and alignment with their specific operational needs and organizational culture.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        By maintaining a <strong>high recognition score</strong> through consistent flight activity and skill development, you increase your <strong>visibility to recruiters</strong> and enhance your chances of securing desirable positions. The system continuously updates your profile score as you log flight hours, complete training programs, and achieve new certifications, ensuring that your <strong>professional standing</strong> is always current and accurately reflects your capabilities and readiness for career advancement.
                    </p>
                </div>

                {/* Section 3: Initial-Recognition Profile */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Getting Started
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Initial-Recognition Profile
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Your journey begins with creating your <strong>Initial-Recognition Profile</strong>, the foundation of your professional aviation identity. This comprehensive profile captures your flight experience, certifications, training history, and competency assessments in a unified digital format that serves as your passport to the aviation industry.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Upon registration, you will be guided through a structured onboarding process that collects essential information including your flight hours, aircraft types flown, licenses held, and specialized training completed. This data is verified and integrated into your <strong>Pilot Recognition Score</strong>, providing you with an immediate baseline assessment of your professional standing.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Your <strong>Initial-Recognition Profile</strong> is not static—it evolves with your career. As you log new flight hours, complete additional training programs, and achieve new certifications, your profile updates in real-time, ensuring that your professional identity always reflects your current capabilities and readiness for new opportunities.
                    </p>
                </div>

                {/* Section 4: First Step Towards Pilot Recognition */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Foundation Program
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        First Step Towards Pilot Recognition
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        The <strong>Foundation Program</strong> is your first step towards building a credible and recognized pilot profile. This recognition-based program is designed to establish a solid foundation of aviation knowledge, competency, and industry standards that global manufacturers and operators recognize as credible experience. The program is <strong>EBT CBTA Aligned with AIRBUS</strong>, ensuring that your recognition meets the highest international standards in evidence-based training and competency-based training and assessment.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Through strategic partnerships with industry leaders including <strong>AIRBUS</strong>, <strong>Etihad</strong>, <strong>Archer</strong>, <strong>MLG</strong>, <strong>Cebu Pacific</strong>, and <strong>WCC Pilot Academy</strong>, the Foundation Program provides a recognition framework that aligns with the highest industry standards. Upon completion, your profile reflects this achievement, demonstrating to airlines and operators that you have undergone rigorous assessment and verification.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        This program significantly impacts your <strong>Pilot Recognition Score</strong> by adding verified recognition credentials, competency assessments, and industry-recognized certifications to your profile. As you progress through the program, your profile evolves, building a comprehensive <strong>pilot portfolio</strong> that showcases your skills, knowledge, and readiness for career opportunities.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        The Foundation Program consists of <strong>5 core stages</strong>: <strong>The Context</strong> (Module 1 with 5 chapters addressing industry issues), <strong>W1000 Access</strong> (examination practice and core material), <strong>Examination</strong> (baseline assessment), <strong>Mentorship</strong> (road to 50hrs certification), and <strong>AIRBUS Interview</strong> (EBT-aligned evaluation with certificate of achievement). Each stage is designed to progressively build your recognition credentials.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Industry-Recognized Recognition</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Global Partners</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Portfolio Building</span>
                        </div>
                    </div>
                </div>

                {/* Section 5: Transition Program */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Upcoming Program
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                        Transition Program
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Our upcoming <strong>Transition Program</strong> integrates <strong>AIRBUS HINFACT applications</strong> and <strong>ATLAS CV resume ATS screening</strong> for all users. As the aviation industry increasingly relies on <strong>AI-based recruitment</strong> rather than manual resume screening, we ensure our platform keeps pace with industry standards and technological advancements. We are also working with <strong>insurance underwriters</strong> to help identify high-risk pilots for airlines, providing valuable risk assessment data that enhances hiring decisions and operational safety.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        Every credential, flight hour, and achievement is <strong>cryptographically verified</strong>. Our blockchain-backed verification system creates an <strong>unbreakable chain of custody</strong> that airlines and regulatory bodies trust implicitly.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Cryptographic Proof</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Real-Time Verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Industry Trust</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>

            <div className="flex justify-center pb-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-slate-300" />
                </div>
            </div>
        </div>
        </>
    );
};
