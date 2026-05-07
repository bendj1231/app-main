import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, ArrowRight } from 'lucide-react';

interface PilotRecognitionOpportunitiesProps {
    onNavigate: (page: string) => void;
}

export const PilotRecognitionOpportunities: React.FC<PilotRecognitionOpportunitiesProps> = ({ onNavigate }) => {
    return (
        <section className="relative w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
                    {/* Left Side - Text Content (2 parts) */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                Pilot Recognition Unlocks Opportunities
                            </h2>
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                Your Recognition Score becomes your currency for accessing exclusive pathways, programs, and career opportunities. Build your profile, gain recognition, and unlock doors to your aviation future.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => onNavigate('access-portal-2?tab=profile')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Build Recognition Profile
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onNavigate('access-portal-2?tab=pathways')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300"
                                >
                                    View Pathways
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side - Images (3 parts) */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {/* Programs Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="group relative bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 cursor-pointer"
                            onClick={() => onNavigate('access-portal-2?tab=programs')}
                        >
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src="https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png"
                                    alt="Programs - Structured training pathways"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap className="w-5 h-5 text-amber-400" />
                                    <h3 className="text-lg font-semibold text-white">Programs</h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Foundation and Transition programs designed to accelerate your aviation career with industry-recognized training.
                                </p>
                            </div>
                        </motion.div>

                        {/* Pathways Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="group relative bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 cursor-pointer"
                            onClick={() => onNavigate('access-portal-2?tab=pathways')}
                        >
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src="/pathway4.png"
                                    alt="Career Pathways - Airline and aviation opportunities"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Briefcase className="w-5 h-5 text-rose-400" />
                                    <h3 className="text-lg font-semibold text-white">Pathways</h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Explore airline, charter, cargo, and emerging aviation sector opportunities matched to your profile.
                                </p>
                            </div>
                        </motion.div>

                        {/* Recognition Score Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="group relative bg-gradient-to-br from-violet-500/20 to-purple-600/20 backdrop-blur-md rounded-xl border border-violet-400/30 overflow-hidden hover:from-violet-500/30 hover:to-purple-600/30 transition-all duration-300 cursor-pointer"
                            onClick={() => onNavigate('access-portal-2?tab=profile')}
                        >
                            <div className="aspect-[4/3] flex flex-col items-center justify-center p-6">
                                <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl font-bold text-violet-300">85+</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Recognition Score</h3>
                                <p className="text-sm text-violet-200 text-center leading-relaxed">
                                    Your portable currency for accessing premium pathways and opportunities
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
