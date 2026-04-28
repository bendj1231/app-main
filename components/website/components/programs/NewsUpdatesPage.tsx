import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, TrendingUp, Plane, Award, Users, Globe } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';

interface NewsUpdatesPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const NewsUpdatesPage: React.FC<NewsUpdatesPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const updates = [
        {
            date: 'April 2025',
            title: 'AIRBUS Advisory Guidance Expansion',
            category: 'Advisory',
            icon: <Award className="w-6 h-6" />,
            description: 'Expanded advisory relationship with Airbus Head of Training to include EBT CBTA framework guidance across all foundational programs, ensuring alignment with manufacturer standards.'
        },
        {
            date: 'March 2025',
            title: 'Etihad Aviation Training Integration',
            category: 'Training',
            icon: <Plane className="w-6 h-6" />,
            description: 'New integration with Etihad Aviation Training for cadet program development and advanced pilot training pathways with flagship carrier standards.'
        },
        {
            date: 'February 2025',
            title: 'AI-Powered Pathway Matching Launch',
            category: 'Technology',
            icon: <TrendingUp className="w-6 h-6" />,
            description: 'Launched AI-powered pathway matching system that connects pilot competencies with airline requirements using advanced machine learning algorithms.'
        },
        {
            date: 'January 2025',
            title: 'Global Recognition Network Expansion',
            category: 'Network',
            icon: <Globe className="w-6 h-6" />,
            description: 'Expanded our global recognition network to include 50+ airlines and operators worldwide, increasing career opportunities for program graduates.'
        },
        {
            date: 'December 2024',
            title: 'Blockchain Verification System',
            category: 'Security',
            icon: <Award className="w-6 h-6" />,
            description: 'Implemented blockchain-verifiable certifications for all program completions, providing tamper-proof credentials recognized by industry partners.'
        },
        {
            date: 'November 2024',
            title: 'Mentorship Program Milestone',
            category: 'Achievement',
            icon: <Users className="w-6 h-6" />,
            description: 'Reached milestone of 10,000 hours of verified mentorship delivered to pilots across all foundational and transition programs.'
        }
    ];

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Programs', url: '/programs' },
                { name: 'News & Updates', url: '/news-updates' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="PilotRecognition Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        NEWS & UPDATES
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                        News & Updates
                    </h1>
                    <p className="text-base md:text-lg text-slate-700 max-w-3xl mx-auto">
                        Stay informed about the latest developments, partnerships, and achievements in our pilot recognition-based programs.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-24">
                <RevealOnScroll>
                    <div className="space-y-6">
                        {updates.map((update, index) => (
                            <div
                                key={index}
                                className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex items-center gap-4 min-w-fit">
                                        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl text-blue-600">
                                            {update.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                                <Calendar className="w-4 h-4" />
                                                {update.date}
                                            </div>
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                                {update.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                                            {update.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {update.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </RevealOnScroll>

                <RevealOnScroll>
                    <div className="mt-16 text-center">
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-white">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                                Stay Updated
                            </h2>
                            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                                Subscribe to receive the latest news about program updates, partnership announcements, and industry insights.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => onNavigate('become-member')}
                                    className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    Join Our Network
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
