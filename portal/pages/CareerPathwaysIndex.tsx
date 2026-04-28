import React from 'react';
import { ArrowLeft, Plane, Building2, Bot, Award, CheckCircle, Clock, Target, Zap } from 'lucide-react';

interface CareerPathwaysIndexProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

const CareerPathwaysIndex: React.FC<CareerPathwaysIndexProps> = ({ onBack, onNavigate }) => {
  const pathways = [
    {
      id: 'air-taxi-evtol',
      title: 'Air Taxi & eVTOL',
      description: 'The future of urban aviation. Air taxi and eVTOL pathways offer opportunities in emerging urban air mobility, working with industry leaders like Archer, MLG, and Joby Aviation.',
      icon: <Plane className="w-8 h-8" />,
      color: 'from-blue-600 to-blue-400',
      details: [
        'Urban Air Mobility (UAM) operations',
        'eVTOL aircraft certification and training',
        'Sub-1000 hour pilot opportunities',
        'Next-generation roster systems',
        'Partnerships with Archer, MLG, Joby Aviation'
      ],
      requirements: [
        'Commercial Pilot License (CPL)',
        'Instrument Rating required',
        'EBT/CBTA competency background',
        'Strong CRM capabilities',
        'Urban operations experience preferred'
      ],
      careerPath: 'Entry Pilot → First Officer → Captain → Fleet Manager'
    },
    {
      id: 'emirates-atpl',
      title: 'Emirates ATPL',
      description: 'Global recognition through GCAA ATPL theory training. Comprehensive pathway to international airline careers with Emirates and other major carriers.',
      icon: <Award className="w-8 h-8" />,
      color: 'from-emerald-600 to-emerald-400',
      details: [
        'GCAA ATPL Theory examination',
        'Global license recognition',
        'Fujairah Aviation Academy partnership',
        'International carrier connections',
        'Comprehensive ground school training',
        'Type rating pathway included'
      ],
      requirements: [
        'Commercial Pilot License minimum',
        '200+ flight hours',
        'Class 1 Medical Certificate',
        'English language proficiency',
        'Age 18+ requirement'
      ],
      careerPath: 'Student → ATPL Theory → Type Rating → First Officer → Captain'
    },
    {
      id: 'private-sector-pathway',
      title: 'Private Sector Pathway',
      description: 'Corporate flight departments and VIP charter operations. Specialized pathway for pilots seeking careers in private aviation with high service standards.',
      icon: <Building2 className="w-8 h-8" />,
      color: 'from-purple-600 to-purple-400',
      details: [
        'Corporate flight department operations',
        'VIP charter and private jet services',
        'Global mission profiles',
        'High service standards training',
        'Flexible scheduling arrangements',
        'Diverse aircraft fleet exposure'
      ],
      requirements: [
        'Commercial Pilot License required',
        'Multi-engine rating preferred',
        'Corporate aviation experience valued',
        'Security clearance often required',
        'Customer service skills essential'
      ],
      careerPath: 'Co-pilot → Captain → Chief Pilot → Director of Flight Operations'
    },
    {
      id: 'piloted-automated-drones',
      title: 'Piloted & Automated Drones',
      description: 'The intersection of manned and unmanned aviation. Career opportunities in BVLOS operations, data intelligence, and remote fleet management.',
      icon: <Bot className="w-8 h-8" />,
      color: 'from-orange-600 to-orange-400',
      details: [
        'BVLOS (Beyond Visual Line of Sight) operations',
        'Data intelligence and analytics',
        'Remote fleet management systems',
        'Autonomous flight technology',
        'Regulatory compliance for UAS',
        'Integration with manned airspace'
      ],
      requirements: [
        'Pilot license preferred (manned or UAS)',
        'UAS Part 107 or equivalent certification',
        'BVLOS operational approval',
        'Technical aptitude for systems management',
        'Remote operations training'
      ],
      careerPath: 'UAS Pilot → BVLOS Operator → Fleet Manager → Director of UAS Operations'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      {/* Header */}
      <div className="pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Pathways</span>
          </button>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-400 mb-4">
              Career Development
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-normal text-white leading-tight mb-6">
              Career Pathways
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-slate-300">
              Explore diverse career pathways in aviation, from emerging urban air mobility to traditional airline careers, private sector opportunities, and the future of unmanned aviation.
            </p>
          </div>
        </div>
      </div>

      {/* Pathways Grid */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pathways.map((pathway) => (
              <div
                key={pathway.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all overflow-hidden group"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${pathway.color} p-6`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      {pathway.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{pathway.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    {pathway.description}
                  </p>

                  {/* Key Details */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                      Program Highlights
                    </h4>
                    <ul className="space-y-2">
                      {pathway.details.slice(0, 4).map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                      Requirements
                    </h4>
                    <ul className="space-y-2">
                      {pathway.requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                          <Target className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career Path */}
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                      Career Path
                    </h4>
                    <p className="text-sm text-slate-300">{pathway.careerPath}</p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      if (pathway.id === 'air-taxi-evtol' && onNavigate) {
                        onNavigate('air-taxi-pathways');
                      } else if (pathway.id === 'emirates-atpl' && onNavigate) {
                        onNavigate('emirates-atpl');
                      } else if (pathway.id === 'private-sector-pathway' && onNavigate) {
                        onNavigate('private-charter-pathways');
                      } else if (pathway.id === 'piloted-automated-drones' && onNavigate) {
                        onNavigate('piloted-drones');
                      }
                    }}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                  >
                    Explore Pathway
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-normal text-white mb-4">
                Ready to Launch Your Aviation Career?
              </h2>
              <p className="text-slate-300 mb-8">
                Whether you're interested in emerging urban air mobility, traditional airline careers, private aviation, 
                or the future of unmanned aircraft, PilotRecognition can help you connect with the right training programs 
                and employers to achieve your career goals.
              </p>
              <button
                onClick={() => onNavigate && onNavigate('become-member')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg group"
              >
                Create Account to Get Started
                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPathwaysIndex;
