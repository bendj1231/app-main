import React from 'react';
import { ArrowLeft, CheckCircle2, Award, Shield, Target, Users, Zap, Globe, TrendingUp } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';

interface ProgramBenefitsPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ProgramBenefitsPage: React.FC<ProgramBenefitsPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const benefits = [
        {
            icon: <Award className="w-8 h-8" />,
            title: 'Accredited Recognition',
            description: 'Get officially recognized by industry leaders including AIRBUS and Etihad Aviation Training, boosting your credibility with airlines worldwide.'
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Verified Mentorship',
            description: 'Access verified mentorship from experienced pilots and industry professionals who guide your career development with proven expertise.'
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: 'EBT CBTA Alignment',
            description: 'Align with Evidence-Based Training and Competency-Based Training and Assessment standards, the gold standard in modern aviation training.'
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: 'Industry Network',
            description: 'Connect with a global network of aviation professionals, airlines, and recruiters opening doors to exclusive opportunities.'
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'Career Acceleration',
            description: 'Fast-track your aviation career with direct pathways to airline positions, cutting through traditional hiring barriers.'
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: 'Global Opportunities',
            description: 'Access opportunities across international markets with recognition and credentials respected by airlines globally.'
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Continuous Growth',
            description: 'Benefit from ongoing professional development and skill enhancement programs that keep you competitive in the evolving industry.'
        },
        {
            icon: <CheckCircle2 className="w-8 h-8" />,
            title: 'Profile Verification',
            description: 'Build a verified pilot profile that showcases your achievements, certifications, and experience to potential employers.'
        }
    ];

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Programs', url: '/programs' },
                { name: 'Program Benefits', url: '/benefits' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        PROGRAM BENEFITS
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                        Program Benefits
                    </h1>
                    <p className="text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
                        Discover the comprehensive benefits of our pilot recognition-based programs designed to accelerate your aviation career.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-24">
                <RevealOnScroll>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-xl mb-4 text-blue-600">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </RevealOnScroll>

                <RevealOnScroll>
                    <div className="mt-16 text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                                Ready to Transform Your Career?
                            </h2>
                            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                                Join thousands of pilots who have accelerated their careers through our recognition-based programs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => onNavigate('become-member')}
                                    className="px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors"
                                >
                                    Become a Member
                                </button>
                                <button
                                    onClick={() => onNavigate('programs')}
                                    className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Explore Programs
                                </button>
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Programs
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};
