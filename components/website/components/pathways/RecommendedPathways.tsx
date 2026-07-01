import React from 'react';
import { motion } from 'framer-motion';
import { User, TrendingUp, Target, Plane, GraduationCap, Briefcase, ArrowRight, Lock } from 'lucide-react';
import { RevealOnScroll } from '../RevealOnScroll';

interface RecommendedPathwaysProps {
    isAuthenticated: boolean;
    onLogin?: () => void;
}

export const RecommendedPathways: React.FC<RecommendedPathwaysProps> = ({
    isAuthenticated,
    onLogin
}) => {
    // Sample recommended pathways data
    const recommendedPathways = [
        {
            id: 'air-taxi',
            title: 'Air Taxi & eVTOL Pathway',
            description: 'Emerging urban air mobility sector with high growth potential',
            typeRating: 'eVTOL Type Rating',
            airlines: ['Joby Aviation', 'Wisk Aero', 'Archer Aviation'],
            alignment: '85% alignment with your profile',
            requirements: ['Commercial License', '500+ hours', 'Instrument Rating'],
            icon: Plane,
            color: 'bg-purple-500',
            trending: true
        },
        {
            id: 'private-charter',
            title: 'Private Charter Excellence',
            description: 'Business aviation and corporate flight operations',
            typeRating: 'Citation/Embraer Type',
            airlines: ['NetJets', 'Flexjet', 'VistaJet'],
            alignment: '78% alignment with your profile',
            requirements: ['Commercial License', '1500+ hours', 'Multi-engine'],
            icon: Briefcase,
            color: 'bg-amber-500',
            trending: false
        },
        {
            id: 'cadet-program',
            title: 'Airline Cadet Programs',
            description: 'Structured pathway to major airline careers',
            typeRating: 'Airbus/Boeing Type',
            airlines: ['Emirates', 'Qatar Airways', 'Etihad'],
            alignment: '92% alignment with your profile',
            requirements: ['High School Diploma', 'Medical Certificate', 'Age 18-35'],
            icon: GraduationCap,
            color: 'bg-blue-500',
            trending: true
        }
    ];

    const careerInsights = [
        {
            title: 'Career Pathways Analysis',
            subtitle: 'Based on your profile and industry trends',
            items: [
                'Strong fit for emerging aviation technologies',
                'Consider additional instrument training',
                'Network with regional carriers first'
            ]
        },
        {
            title: 'Airline Expectations',
            subtitle: 'Requirements to align with major carriers',
            items: [
                'ATPL certification preferred',
                'Multi-engine experience required',
                'International operations experience valuable'
            ]
        },
        {
            title: 'Type Rating Interests',
            subtitle: 'Recommended certifications for advancement',
            items: [
                'Airbus A320 Family',
                'Boeing 737 NG/MAX',
                'Business jet type ratings'
            ]
        }
    ];

    if (!isAuthenticated) {
        return (
            <RevealOnScroll>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-lg">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-6">
                            <Lock className="w-8 h-8 text-slate-600" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            Recommended Pathways
                        </h3>
                        
                        <p className="text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                            Sign in to receive personalized recommended pathways from Career Pathways, 
                            potential type rating interests aligned with your profile, and airline expectations 
                            you can align yourself to the requirements.
                        </p>
                        
                        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
                            <div className="grid md:grid-cols-3 gap-4 text-left">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <TrendingUp className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Career Pathways</h4>
                                    <p className="text-sm text-slate-600">AI-powered career recommendations</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Target className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Type Ratings</h4>
                                    <p className="text-sm text-slate-600">Profile-aligned certifications</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Plane className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Airline Requirements</h4>
                                    <p className="text-sm text-slate-600">Industry standards alignment</p>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={onLogin}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                        >
                            <User className="w-5 h-5" />
                            Sign In to View Recommendations
                        </button>
                    </div>
                </div>
            </RevealOnScroll>
        );
    }

    return (
        <RevealOnScroll>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">Recommended Pathways</h3>
                        <p className="text-slate-600">Personalized career recommendations based on your profile</p>
                    </div>
                </div>

                {/* Cinematic Carousel Pathway Cards */}
                <div className="relative mb-8">
                    {/* Scroll container */}
                    <div
                        id="pathway-carousel"
                        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {recommendedPathways.map((pathway, index) => {
                            const alignmentPct = parseInt(pathway.alignment);
                            const colorMap: Record<string, { gradient: string; accent: string; iconBg: string; glow: string }> = {
                                'bg-purple-500': {
                                    gradient: 'linear-gradient(160deg, rgba(124,58,237,0.35) 0%, rgba(15,23,42,0.95) 55%, rgba(15,23,42,0.98) 100%)',
                                    accent: '#8b5cf6',
                                    iconBg: 'bg-purple-500',
                                    glow: 'hover:shadow-purple-500/25'
                                },
                                'bg-amber-500': {
                                    gradient: 'linear-gradient(160deg, rgba(217,119,6,0.35) 0%, rgba(15,23,42,0.95) 55%, rgba(15,23,42,0.98) 100%)',
                                    accent: '#f59e0b',
                                    iconBg: 'bg-amber-500',
                                    glow: 'hover:shadow-amber-500/25'
                                },
                                'bg-blue-500': {
                                    gradient: 'linear-gradient(160deg, rgba(37,99,235,0.35) 0%, rgba(15,23,42,0.95) 55%, rgba(15,23,42,0.98) 100%)',
                                    accent: '#3b82f6',
                                    iconBg: 'bg-blue-500',
                                    glow: 'hover:shadow-blue-500/25'
                                },
                            };
                            const theme = colorMap[pathway.color] || colorMap['bg-blue-500'];

                            return (
                                <motion.div
                                    key={pathway.id}
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                    className={`relative flex-shrink-0 w-[420px] sm:w-[480px] rounded-3xl overflow-hidden group cursor-pointer snap-center transition-shadow duration-500 hover:shadow-2xl ${theme.glow}`}
                                    style={{ background: theme.gradient }}
                                >
                                    {/* Animated ambient orb */}
                                    <div
                                        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-40 blur-3xl group-hover:opacity-60 transition-opacity duration-700"
                                        style={{ background: `radial-gradient(circle, ${theme.accent}30 0%, transparent 70%)` }}
                                    />

                                    {/* Top content area */}
                                    <div className="relative px-8 pt-8 pb-6">
                                        {/* Header row: icon + title + badge */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-xl flex-shrink-0`}>
                                                    <pathway.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <h4 className="font-black text-white text-lg tracking-tight leading-tight">{pathway.title}</h4>
                                            </div>
                                            {pathway.trending && (
                                                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0">
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                                                    </span>
                                                    Trending
                                                </div>
                                            )}
                                        </div>

                                        {/* Description — below the header */}
                                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">{pathway.description}</p>

                                        {/* Big alignment score */}
                                        <div className="flex items-end gap-3 mb-2">
                                            <span className="text-5xl font-black tracking-tighter" style={{ color: theme.accent }}>{alignmentPct}%</span>
                                            <span className="text-sm font-bold text-white/60 mb-2">profile alignment</span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mb-6">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: theme.accent }}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${alignmentPct}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Glassy bottom panel */}
                                    <div
                                        className="relative px-8 pb-8 pt-6 border-t"
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            backdropFilter: 'blur(20px) saturate(1.2)',
                                            borderColor: 'rgba(255,255,255,0.06)'
                                        }}
                                    >
                                        {/* Type Rating & Airlines row */}
                                        <div className="grid grid-cols-2 gap-6 mb-5">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Type Rating</p>
                                                <p className="text-sm font-bold text-white">{pathway.typeRating}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Partner Airlines</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {pathway.airlines.map((airline) => (
                                                        <span key={airline} className="text-[10px] font-bold text-slate-300 px-2 py-1 rounded-md border border-white/10 bg-white/5">
                                                            {airline}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Requirements */}
                                        <div className="mb-6">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Key Requirements</p>
                                            <div className="flex flex-wrap gap-2">
                                                {pathway.requirements.map((req) => (
                                                    <span key={req} className="flex items-center gap-1.5 text-xs text-slate-300 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent }} />
                                                        {req}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <button
                                            className="w-full group/btn relative overflow-hidden rounded-2xl text-sm font-black uppercase tracking-wider text-white py-4 transition-all flex items-center justify-center gap-3"
                                            style={{ background: theme.accent }}
                                        >
                                            <span className="relative z-10">Explore Pathway</span>
                                            <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Career Insights */}
                <div className="grid md:grid-cols-3 gap-6">
                    {careerInsights.map((insight, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-2">{insight.title}</h4>
                            <p className="text-sm text-slate-600 mb-4">{insight.subtitle}</p>
                            <ul className="space-y-2">
                                {insight.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-slate-700">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </RevealOnScroll>
    );
};
