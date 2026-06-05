import React from 'react';
import { ArrowLeft, Calendar, Award, FileText, TrendingUp, Bell } from 'lucide-react';
import { PathwaysHeader } from './PathwaysHeader';
import { RevealOnScroll } from '../RevealOnScroll';
import { MeshGradient } from '@paper-design/shaders-react';

interface OfficialExaminationBoardPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin?: () => void;
}

const OfficialExaminationBoardPage: React.FC<OfficialExaminationBoardPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    // Mock data for dashboard
    const certifications = [
        { id: 1, name: 'Commercial Pilot License', status: 'Active', expiry: '2025-12-31', score: 95 },
        { id: 2, name: 'Instrument Rating', status: 'Active', expiry: '2025-08-15', score: 88 },
        { id: 3, name: 'Multi-Engine Rating', status: 'Pending', expiry: '2025-06-30', score: null },
    ];

    const newsUpdates = [
        { id: 1, title: 'New EBT CBTA Guidelines Released', date: 'May 1, 2026', category: 'Guidelines' },
        { id: 2, title: 'Examination Schedule Update - Q2 2026', date: 'April 28, 2026', category: 'Schedule' },
        { id: 3, title: 'Certification Renewal Process Updated', date: 'April 25, 2026', category: 'Policy' },
        { id: 4, title: 'Airbus Training Partnership Announcement', date: 'April 20, 2026', category: 'Partnership' },
    ];

    const stats = [
        { label: 'Active Certifications', value: '2', icon: Award, color: 'text-blue-600' },
        { label: 'Pending Exams', value: '1', icon: FileText, color: 'text-amber-600' },
        { label: 'Average Score', value: '91.5%', icon: TrendingUp, color: 'text-emerald-600' },
        { label: 'News Updates', value: '4', icon: Bell, color: 'text-purple-600' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* MeshGradient Shader Background */}
            <div className="absolute inset-0 z-0">
                <MeshGradient
                    className="w-full h-full"
                    colors={[
                        "#dbeafe",
                        "#e0e7ff",
                        "#f0f9ff",
                        "#ffffff"
                    ]}
                />
            </div>
            
            <div className="relative z-10">
                <PathwaysHeader onBack={onBack} onNavigate={onNavigate} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto relative z-20">
                    <RevealOnScroll>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-2 font-sans">
                                    Certification System
                                </p>
                                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">
                                    Examination Board Dashboard
                                </h1>
                            </div>
                            <div className="hidden md:flex items-center gap-2 bg-white rounded-lg shadow-sm px-4 py-2">
                                <Calendar className="w-5 h-5 text-slate-600" />
                                <span className="text-slate-700 font-medium">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-6xl mx-auto px-6 mb-8">
                <RevealOnScroll>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                    <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                                </div>
                                <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </RevealOnScroll>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Certifications Section */}
                    <div className="lg:col-span-2">
                        <RevealOnScroll>
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                                <h2 className="text-xl font-serif text-slate-900 mb-6 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-blue-600" />
                                    Your Certifications
                                </h2>
                                <div className="space-y-4">
                                    {certifications.map((cert) => (
                                        <div key={cert.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-slate-900">{cert.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    cert.status === 'Active' 
                                                        ? 'bg-emerald-100 text-emerald-700' 
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {cert.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-slate-600">
                                                <span>Expiry: {cert.expiry}</span>
                                                {cert.score && <span className="font-medium">Score: {cert.score}%</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* News Updates Section */}
                    <div className="lg:col-span-1">
                        <RevealOnScroll>
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                                <h2 className="text-xl font-serif text-slate-900 mb-6 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-purple-600" />
                                    News & Updates
                                </h2>
                                <div className="space-y-4">
                                    {newsUpdates.map((news) => (
                                        <div key={news.id} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                    {news.category}
                                                </span>
                                                <span className="text-xs text-slate-500">{news.date}</span>
                                            </div>
                                            <h3 className="text-sm font-medium text-slate-900 hover:text-blue-600 cursor-pointer transition-colors">
                                                {news.title}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default OfficialExaminationBoardPage;
