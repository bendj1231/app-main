import React from 'react';
import { ArrowLeft, Truck, Anchor, MapPin, Plane, Droplets, Sprout, Search, Camera, Users, CheckCircle, Clock, Award } from 'lucide-react';

interface SpecializedOperationsIndexProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

const SpecializedOperationsIndex: React.FC<SpecializedOperationsIndexProps> = ({ onBack, onNavigate }) => {
  const operations = [
    {
      id: 'cargo-transportation',
      title: 'Cargo Transportation',
      description: 'The backbone of global commerce. Air cargo operations offer unique career opportunities with major logistics carriers, freight operators, and express delivery companies worldwide.',
      icon: <Truck className="w-8 h-8" />,
      color: 'from-blue-600 to-blue-400',
      details: [
        'Express/Integrator: Time-critical small packages (FedEx, UPS, DHL)',
        'Heavy Freight: Large-scale logistics and outsized cargo (Atlas Air, Kalitta)',
        'Charter/On-Demand: Flexible cargo solutions for specific client needs',
        '24/7 operations with diverse fleet types',
        'Faster career progression compared to passenger airlines'
      ],
      requirements: [
        'Commercial Pilot License (CPL)',
        'Instrument Rating required',
        '500+ flight hours minimum',
        'Multi-engine rating preferred',
        'Type rating for specific cargo aircraft'
      ],
      careerPath: 'Entry-Level → First Officer → Captain → Fleet Manager'
    },
    {
      id: 'seaplane-float-ops',
      title: 'Seaplane/Float Operations',
      description: 'Master the art of water-based aviation. Seaplane operations offer unique flying opportunities accessing remote destinations, coastal regions, and water-based transportation services.',
      icon: <Anchor className="w-8 h-8" />,
      color: 'from-cyan-600 to-cyan-400',
      details: [
        'Single-engine seaplane ratings',
        'Multi-engine seaplane operations',
        'Coastal and island transportation',
        'Remote wilderness access',
        'Tourism and charter operations',
        'Water-based cargo delivery'
      ],
      requirements: [
        'Private Pilot License minimum',
        'Seaplane rating (ASES/AMES)',
        '50+ hours of seaplane time preferred',
        'Water landing proficiency',
        'Night operations capability'
      ],
      careerPath: 'Seaplane Pilot → Charter Captain → Operations Manager'
    },
    {
      id: 'aerial-tours-skydive',
      title: 'Aerial Tours & Skydive',
      description: 'Combine adventure with aviation. Aerial tour operations and skydiving support offer exciting career opportunities in tourism and adventure aviation sectors.',
      icon: <Camera className="w-8 h-8" />,
      color: 'from-purple-600 to-purple-400',
      details: [
        'Scenic aerial tours for tourism',
        'Skydiving jump plane operations',
        'Photography and aerial survey flights',
        'Adventure tourism experiences',
        'High-altitude operations',
        'Passenger safety management'
      ],
      requirements: [
        'Commercial Pilot License required',
        '200+ flight hours minimum',
        'High-performance aircraft experience',
        'Passenger management skills',
        'Emergency procedures training'
      ],
      careerPath: 'Tour Pilot → Skydive Pilot → Chief Pilot → Tour Operations Manager'
    },
    {
      id: 'land-survey-ag',
      title: 'Land Survey & Agriculture',
      description: 'Precision aviation for mapping and agriculture. Specialized operations including aerial surveying, crop monitoring, and precision agriculture support services.',
      icon: <Search className="w-8 h-8" />,
      color: 'from-emerald-600 to-emerald-400',
      details: [
        'Aerial mapping and surveying',
        'Crop monitoring and analysis',
        'Precision agriculture support',
        'Pipeline and power line inspection',
        'Photogrammetry operations',
        'Environmental monitoring'
      ],
      requirements: [
        'Private Pilot License minimum',
        'Low-level operation training',
        'Navigation and GPS proficiency',
        'Aerial photography skills',
        'Industry-specific certifications'
      ],
      careerPath: 'Survey Pilot → Lead Surveyor → Operations Manager'
    },
    {
      id: 'float-amphibious',
      title: 'Float & Amphibious Operations',
      description: 'Versatile aviation for water and land. Amphibious aircraft operations provide access to both water and land-based destinations, maximizing operational flexibility.',
      icon: <Plane className="w-8 h-8" />,
      color: 'from-teal-600 to-teal-400',
      details: [
        'Amphibious aircraft operations',
        'Mixed terrain access capabilities',
        'Remote area support',
        'Search and rescue operations',
        'Medical evacuation support',
        'Disaster response missions'
      ],
      requirements: [
        'Commercial Pilot License preferred',
        'Both land and sea ratings',
        'Complex aircraft experience',
        'Advanced navigation skills',
        'Emergency water landing proficiency'
      ],
      careerPath: 'Amphibious Pilot → Mission Captain → SAR Coordinator'
    },
    {
      id: 'agricultural-crop-dusting',
      title: 'Agricultural Crop Dusting',
      description: 'Essential agricultural aviation services. Crop dusting and aerial application operations provide critical services to the farming and agriculture industry.',
      icon: <Sprout className="w-8 h-8" />,
      color: 'from-green-600 to-green-400',
      details: [
        'Aerial crop dusting and spraying',
        'Seed application operations',
        'Fertilizer distribution',
        'Pest control services',
        'Large-scale agricultural support',
        'Seasonal operations management'
      ],
      requirements: [
        'Commercial Pilot License required',
        'Agricultural aviation rating',
        'Low-level operation certification',
        'Chemical handling training',
        '100+ hours of ag training'
      ],
      careerPath: 'Ag Pilot → Lead Ag Pilot → Agricultural Operations Manager'
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
              Specialized Aviation
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-normal text-white leading-tight mb-6">
              Specialized Operations
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-slate-300">
              Explore diverse career pathways in specialized aviation operations, from cargo transportation to agricultural aviation, seaplane operations, and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Operations Grid */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operations.map((operation) => (
              <div
                key={operation.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all overflow-hidden group"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${operation.color} p-6`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      {operation.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{operation.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    {operation.description}
                  </p>

                  {/* Key Details */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
                      Key Operations
                    </h4>
                    <ul className="space-y-2">
                      {operation.details.slice(0, 3).map((detail, idx) => (
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
                      {operation.requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                          <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
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
                    <p className="text-sm text-slate-300">{operation.careerPath}</p>
                  </div>
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
                Ready to Explore Specialized Operations?
              </h2>
              <p className="text-slate-300 mb-8">
                Specialized aviation operations offer unique career opportunities outside traditional airline pathways. 
                Whether you're interested in cargo, agricultural, seaplane, or aerial tour operations, PilotRecognition 
                can help you connect with the right training programs and employers.
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

export default SpecializedOperationsIndex;
