import React from 'react';
import { ArrowLeft, GraduationCap, Plane, DollarSign, MapPin, Award, CheckCircle, Clock, ChevronRight, Target, Shield, Home, Briefcase, Search } from 'lucide-react';

interface SpecializedPathwaysIndexProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

const SpecializedPathwaysIndex: React.FC<SpecializedPathwaysIndexProps> = ({ onBack, onNavigate }) => {
  const pathways = [
    {
      id: 'cfi-pathway',
      title: 'CFI Pathway',
      description: 'Certified Flight Instructor pathway to build hours and teach others to fly. Gain valuable experience while mentoring student pilots.',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'from-blue-600 to-blue-400',
      page: 'licensure-type-rating',
      details: [
        'CPL + 250+ hours required',
        '6-10 week training program',
        'Build flight hours through instruction',
        'Teach PPL, CPL, and instrument students'
      ]
    },
    {
      id: 'airline-expectations',
      title: 'Airline Expectations',
      description: 'Comprehensive guide to airline hiring requirements, assessment processes, and expectations across major carriers worldwide.',
      icon: <Target className="w-8 h-8" />,
      color: 'from-emerald-600 to-emerald-400',
      page: 'portal-airline-expectations',
      details: [
        'Flight hour requirements by airline',
        'Assessment process breakdown',
        'Technical interview preparation',
        'Simulator check guidance'
      ]
    },
    {
      id: 'cpl-type-ratings',
      title: 'CPL & Type Ratings',
      description: 'Commercial Pilot License and Type Rating training programs for Airbus and Boeing aircraft types.',
      icon: <Plane className="w-8 h-8" />,
      color: 'from-purple-600 to-purple-400',
      page: 'licensure-type-rating',
      details: [
        'CPL ground school and flight training',
        'Type rating centers worldwide',
        'A320/A330, B737/B777 programs',
        '4-12 week certification courses'
      ]
    },
    {
      id: 'aerial-work-uprt',
      title: 'Aerial Work (UPRT)',
      description: 'Upset Prevention and Recovery Training for advanced handling of unusual attitudes and upset recovery.',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-red-600 to-red-400',
      page: 'licensure-type-rating',
      details: [
        'Upset recognition and prevention',
        'Recovery techniques training',
        'EASA/FAA compliant programs',
        '1-2 week advanced training'
      ]
    },
    {
      id: 'aircraft-mgmt-ownership',
      title: 'Aircraft Management & Ownership',
      description: 'Guide to aircraft ownership, management services, and private aviation operations.',
      icon: <Home className="w-8 h-8" />,
      color: 'from-amber-600 to-amber-400',
      page: 'pathways-modern',
      details: [
        'Aircraft acquisition guidance',
        'Management service providers',
        'Cost of ownership analysis',
        'Private aviation operations'
      ]
    },
    {
      id: 'type-rating-search',
      title: 'Type Rating Search',
      description: 'Search and compare type rating training centers worldwide for specific aircraft types.',
      icon: <Search className="w-8 h-8" />,
      color: 'from-cyan-600 to-cyan-400',
      page: 'type-rating-search',
      details: [
        'Global training center database',
        'Compare costs and duration',
        'Aircraft type availability',
        'Location-based search'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="mx-auto px-6 py-4 max-w-[1800px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-col">
                <span style={{ fontFamily: 'Georgia, serif' }} className="text-white text-2xl font-normal">
                  Licensure & Type Rating <span className="text-red-500">Pathways</span>
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  pilotrecognition.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">
            Licensure & Type Rating <span className="text-red-500">Pathways</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Explore specialized aviation pathways including CFI certification, airline expectations, type ratings, aerial work, aircraft management, and more.
          </p>
        </div>

        {/* Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((pathway) => (
            <div
              key={pathway.id}
              className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate && onNavigate(pathway.page)}
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${pathway.color} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    {pathway.icon}
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-white">{pathway.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {pathway.description}
                </p>

                {/* Details List */}
                <ul className="space-y-2">
                  {pathway.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-white">Need More Information?</h3>
              <p className="text-slate-400 mb-4 max-w-2xl">
                Our specialized pathways are designed to help pilots advance their careers through targeted training and certification programs. Contact us to learn more about how we can help you achieve your aviation goals.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('contact-support')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecializedPathwaysIndex;
