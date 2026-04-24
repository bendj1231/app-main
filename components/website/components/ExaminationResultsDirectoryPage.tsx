import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PathwaysHeader } from './PathwaysHeader';
import { RevealOnScroll } from '../RevealOnScroll';

interface ExaminationResultsDirectoryPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

const ExaminationResultsDirectoryPage: React.FC<ExaminationResultsDirectoryPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-slate-50">
            <PathwaysHeader onBack={onBack} onNavigate={onNavigate} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4 font-sans">
                            Assessment System
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Examination Results
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Verified Assessments | Competency Tracking | Industry Standards
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            Comprehensive record of pilot assessments, knowledge recency checks, and competency evaluations. Verified results are visible to WingMentor recruiters and airline partners. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>EBT/CBTA-aligned assessment framework</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Main Content Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Assessment Records
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        What Are Examination Results?
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto space-y-24">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                            Examination results provide a standardized, verifiable record of your pilot knowledge and competency assessments. These results include proctored examinations, knowledge recency checks, mentorship evaluations, and pathway-specific assessments. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that our <strong>competency evaluations</strong> align with manufacturer standards for pilot assessment.
                        </p>

                        <div className="space-y-6 text-left max-w-2xl mx-auto">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Proctored Examinations</h4>
                                    <p className="text-sm text-slate-600">Formal assessments monitored by qualified instructors for academic integrity.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Knowledge Recency Checks</h4>
                                    <p className="text-sm text-slate-600">Regular validations of current aviation knowledge and regulatory updates.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Competency Evaluations</h4>
                                    <p className="text-sm text-slate-600">EBT/CBTA-aligned assessments of practical skills and decision-making.</p>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Assessment Process
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        How Results Are Generated
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto space-y-24">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                            The examination system follows a rigorous process to ensure accuracy, fairness, and industry alignment. Through our partnership with <strong>Etihad Cadet Program</strong> and Head of Training, we ensure that program development aligns with flagship carrier expectations.
                        </p>

                        <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                            {[
                                { title: "Exam Registration", desc: "Enroll in examinations through the Examination Portal" },
                                { title: "Proctored Assessment", desc: "Complete exams under monitored conditions" },
                                { title: "Automated Grading", desc: "Objective questions scored instantly by the system" },
                                { title: "Instructor Review", desc: "Subjective components evaluated by qualified instructors" },
                                { title: "Result Verification", desc: "Results validated and recorded in your profile" },
                                { title: "Recruiter Access", desc: "Verified scores shared with partner airlines" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-blue-600 font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Member Access Gateway */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Member Access
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        View Your Examination Results
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-slate-600 text-base max-w-md mb-8 leading-relaxed">
                            Detailed examination records, score breakdowns, and competency assessments are reserved for verified members. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>EBT/CBTA-aligned assessment framework</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="px-8 py-4 bg-[#050A30] hover:bg-[#070D3D] text-white font-bold rounded-xl transition-colors shadow-lg uppercase tracking-wider text-xs"
                            >
                                Become a Member
                            </button>
                            <button
                                onClick={onLogin}
                                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl transition-colors border border-slate-200 uppercase tracking-wider text-xs"
                            >
                                Login to View Results
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                        Ready to Track Your Progress?
                    </h2>
                    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                        Join WingMentor to access comprehensive examination tracking and showcase your verified results to airlines.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExaminationResultsDirectoryPage;
