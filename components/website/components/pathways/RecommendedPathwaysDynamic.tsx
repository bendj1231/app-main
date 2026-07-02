import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Plane, GraduationCap, Briefcase, ArrowRight, Lock, ChevronRight, Star, DollarSign, Clock, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface RecommendedPathwaysDynamicProps {
    onNavigate?: (page: string) => void;
}

// Types for data aggregation
interface AircraftTypeRating {
    id: string;
    model: string;
    manufacturer_id: string;
    category: string;
    subcategory?: string;
    image?: string;
    demandLevel?: 'high' | 'medium' | 'low';
    lifecycleStage?: 'early-career' | 'mid-career' | 'mature' | 'retiring';
    orderBacklog?: { orders: number; delivered: number };
    operatorCount?: number;
    pilotCount?: number;
}

interface Airline {
    id: string;
    name: string;
    location: string;
    salaryRange: string;
    flightHours: string;
    tags: string[];
    image: string;
    description: string;
}

interface Pathway {
    title: string;
    desc: string;
    target: string;
    icon: any;
    color: string;
    bg: string;
}

interface Manufacturer {
    id: string;
    name: string;
    logo: string;
}

export const RecommendedPathwaysDynamic: React.FC<RecommendedPathwaysDynamicProps> = ({ onNavigate }) => {
    const { currentUser, userProfile } = useAuth();
    const { callApi } = useWorkerAuth();
    const isAuthenticated = !!currentUser;
    
    // Data states
    const [aircraftTypeRatings, setAircraftTypeRatings] = useState<AircraftTypeRating[]>([]);
    const [airlines, setAirlines] = useState<Airline[]>([]);
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Career score calculation (simplified version from TypeRatingSearchPage)
    const calculateCareerScore = (aircraft: AircraftTypeRating, pilotProfile?: any): number => {
        let score = 0;
        
        // Aircraft-based scoring
        if (aircraft.demandLevel === 'high') score += 15;
        else if (aircraft.demandLevel === 'medium') score += 10;
        else score += 5;
        
        if (aircraft.lifecycleStage === 'early-career') score += 12;
        else if (aircraft.lifecycleStage === 'mid-career') score += 6;
        
        if (aircraft.orderBacklog) {
            const ratio = aircraft.orderBacklog.orders / (aircraft.orderBacklog.delivered || 1);
            if (ratio >= 2) score += 12;
            else if (ratio >= 1.5) score += 9;
            else if (ratio >= 1) score += 6;
        }
        
        if (aircraft.operatorCount && aircraft.operatorCount >= 20) score += 9;
        
        // Pilot profile-based scoring
        if (pilotProfile) {
            const flightHours = pilotProfile.total_flight_hours || pilotProfile.flight_hours || 0;
            if (flightHours >= 5000) score += 12;
            else if (flightHours >= 3000) score += 9;
            else if (flightHours >= 1500) score += 6;
            else if (flightHours >= 500) score += 3;
            
            const recognitionScore = pilotProfile.recognition_score || 0;
            if (recognitionScore >= 80) score += 10;
            else if (recognitionScore >= 60) score += 8;
            else if (recognitionScore >= 40) score += 5;
        }
        
        return Math.min(score, 100);
    };
    
    // Fetch data from D1
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch aircraft type ratings
                const aircraftData = await callApi<Record<string, unknown>[]>('queryTable', {
                    table: 'aircraft_type_ratings',
                    operation: 'select',
                    limit: 10,
                });
                if (aircraftData) {
                    setAircraftTypeRatings((aircraftData as unknown) as AircraftTypeRating[]);
                }
                
                // Fetch manufacturers
                const manufacturerData = await callApi<Record<string, unknown>[]>('queryTable', {
                    table: 'manufacturers',
                    operation: 'select',
                    limit: 10,
                });
                if (manufacturerData) {
                    setManufacturers((manufacturerData as unknown) as Manufacturer[]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
    // Static airline data (sample from AirlineExpectationsCarousel)
    const sampleAirlines: Airline[] = [
        {
            id: 'qatar',
            name: 'Qatar Airways',
            location: 'Qatar',
            salaryRange: '$120,000 - $250,000/year',
            flightHours: '4,000+ hrs TT',
            tags: ['5-Star Airline', 'Tax-Free', 'Worldwide Routes'],
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/qatar-airways.jpg',
            description: 'Qatar Airways is renowned for its exceptional service standards and global network.'
        },
        {
            id: 'emirates',
            name: 'Emirates',
            location: 'UAE',
            salaryRange: '$130,000 - $280,000/year',
            flightHours: '4,000+ hrs TT',
            tags: ['5-Star Airline', 'Global Network', 'Tax-Free'],
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/emirates.png',
            description: 'Emirates operates one of the largest Airbus A380 and Boeing 777 fleets.'
        },
        {
            id: 'delta',
            name: 'Delta Air Lines',
            location: 'United States',
            salaryRange: '$110,000 - $250,000/year',
            flightHours: '1,500+ hrs TT',
            tags: ['US Legacy', 'Atlanta Hub', 'Largest Airline'],
            image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776686673/airline-expectations/delta.jpg',
            description: 'Delta is the worlds largest airline by revenue and fleet size.'
        }
    ];
    
    // Static pathway data (from PathwaysPage)
    const pathways: Pathway[] = [
        {
            title: "Air Taxi & eVTOL",
            desc: "Preparing pilots for the emerging eVTOL and Urban Air Mobility (UAM) sectors.",
            target: "emerging-air-taxi",
            icon: TrendingUp,
            color: "text-white",
            bg: "bg-purple-50"
        },
        {
            title: "Private Charter",
            desc: "Direct links to private jet operators and specialized business aviation training.",
            target: "private-charter-pathways",
            icon: Briefcase,
            color: "text-white",
            bg: "bg-amber-50"
        },
        {
            title: "Cargo Transportation",
            desc: "Supply chain resilience and heavy logistics for the global feeder network.",
            target: "about_programs",
            icon: Plane,
            color: "text-white",
            bg: "bg-zinc-50"
        }
    ];
    
    // Calculate recommended items based on profile
    const recommendedAircraft = aircraftTypeRatings
        .map(aircraft => ({
            ...aircraft,
            careerScore: calculateCareerScore(aircraft, userProfile)
        }))
        .sort((a, b) => b.careerScore - a.careerScore)
        .slice(0, 3);
    
    if (!isAuthenticated) {
        return (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Recommended Pathways</h3>
                        <p className="text-slate-400 text-sm">Personalized recommendations based on your profile</p>
                    </div>
                </div>
                
                {/* Type Rating Recommendations */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                        <Plane className="w-4 h-4" />
                        Type Rating Recommendations
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-purple-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">737 MAX</span>
                                <span className="text-xs font-bold text-green-400">5%</span>
                            </div>
                            <p className="text-xs text-slate-400">commercial</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-purple-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">Cessna 208 Caravan</span>
                                <span className="text-xs font-bold text-green-400">5%</span>
                            </div>
                            <p className="text-xs text-slate-400">cargo</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-purple-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">A320neo</span>
                                <span className="text-xs font-bold text-green-400">5%</span>
                            </div>
                            <p className="text-xs text-slate-400">commercial</p>
                        </div>
                    </div>
                </div>
                
                {/* Airline Expectations */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Airline Expectations
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-blue-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">Qatar Airways</span>
                            </div>
                            <p className="text-xs text-slate-400">$120,000 - $250,000/year</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-blue-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">Emirates</span>
                            </div>
                            <p className="text-xs text-slate-400">$130,000 - $280,000/year</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-blue-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">Delta Air Lines</span>
                            </div>
                            <p className="text-xs text-slate-400">$110,000 - $250,000/year</p>
                        </div>
                    </div>
                </div>
                
                {/* Career Pathways */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Career Pathways
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-green-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">Air Taxi & eVTOL</span>
                            </div>
                            <p className="text-xs text-slate-400">Preparing pilots for the emerging eVTOL and Urban Air Mobility (UAM) sectors.</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-green-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">Private Charter</span>
                            </div>
                            <p className="text-xs text-slate-400">Direct links to private jet operators and specialized business aviation training.</p>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-green-500/50 transition-all cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">Cargo Transportation</span>
                            </div>
                            <p className="text-xs text-slate-400">Supply chain resilience and heavy logistics for the global feeder network.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-center text-slate-400">Loading recommendations...</div>
            </div>
        );
    }
    
    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Recommended Pathways</h3>
                    <p className="text-slate-400 text-sm">Personalized recommendations based on your profile</p>
                </div>
            </div>
            
            {/* Type Rating Recommendations */}
            {recommendedAircraft.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                        <Plane className="w-4 h-4" />
                        Type Rating Recommendations
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                        {recommendedAircraft.map((aircraft) => (
                            <div
                                key={aircraft.id}
                                className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-purple-500/50 transition-all cursor-pointer"
                                onClick={() => onNavigate && onNavigate('type-rating-search')}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-white">{aircraft.model}</span>
                                    <span className="text-xs font-bold text-green-400">{aircraft.careerScore}%</span>
                                </div>
                                <p className="text-xs text-slate-400">{aircraft.category}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Airline Expectations */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Airline Expectations
                </h4>
                <div className="grid grid-cols-3 gap-3">
                    {sampleAirlines.map((airline) => (
                        <div
                            key={airline.id}
                            className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-amber-500/50 transition-all cursor-pointer"
                            onClick={() => onNavigate && onNavigate('portal-airline-expectations')}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 flex items-center justify-center bg-blue-600/20 rounded">
                                    <span className="text-slate-900 font-bold text-[10px]">{airline.name.slice(0, 2)}</span>
                                </div>
                                <span className="text-xs font-semibold text-white">{airline.name}</span>
                            </div>
                            <p className="text-xs text-slate-400">{airline.salaryRange}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Career Pathways */}
            <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Career Pathways
                </h4>
                <div className="grid grid-cols-3 gap-3">
                    {pathways.map((pathway, index) => (
                        <div
                            key={index}
                            className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 hover:border-blue-500/50 transition-all cursor-pointer"
                            onClick={() => onNavigate && onNavigate(pathway.target)}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <pathway.icon className={`w-4 h-4 ${pathway.color}`} />
                                <span className="text-xs font-semibold text-white">{pathway.title}</span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2">{pathway.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
