import React from 'react';
import { User, TrendingUp, Target, Plane, GraduationCap, Briefcase, ArrowRight, Lock } from 'lucide-react';
import { RevealOnScroll } from '../RevealOnScroll';

interface RecommendedPathwaysProps {
    isAuthenticated: boolean;
    onLogin: () => void;
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

                {/* Recommended Pathways Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {recommendedPathways.map((pathway, index) => (
                        <div key={pathway.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                            {pathway.trending && (
                                <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold mb-3">
                                    <TrendingUp className="w-3 h-3" />
                                    Trending
                                </div>
                            )}
                            
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-10 h-10 ${pathway.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <pathway.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 mb-1">{pathway.title}</h4>
                                    <p className="text-sm text-slate-600 mb-2">{pathway.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="font-semibold text-green-600">{pathway.alignment}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-semibold text-slate-700">Type Rating:</span>
                                    <p className="text-sm text-slate-600">{pathway.typeRating}</p>
                                </div>
                                
                                <div>
                                    <span className="text-xs font-semibold text-slate-700">Partner Airlines:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {pathway.airlines.map((airline) => (
                                            <span key={airline} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                                {airline}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <span className="text-xs font-semibold text-slate-700">Key Requirements:</span>
                                    <ul className="text-xs text-slate-600 mt-1 space-y-1">
                                        {pathway.requirements.map((req) => (
                                            <li key={req} className="flex items-center gap-1">
                                                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <button className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2">
                                Explore Pathway
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
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
