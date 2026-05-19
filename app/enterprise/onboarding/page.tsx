import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '@/components/website/components/TopNavbar';
import { 
  Plane, 
  GraduationCap, 
  Building2, 
  Container,
  Briefcase,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Users,
  Shield,
  Clock
} from 'lucide-react';

interface OperationType {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  dualValue?: string;
}

const OPERATION_TYPES: OperationType[] = [
  {
    id: 'flight-academy',
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'Flight Academy / ATO',
    subtitle: 'Training Organization + Fleet Operator',
    description: 'Certified flight schools with training fleets. Teach new pilots while managing active aircraft operations.',
    dualValue: 'Recruit verified instructors AND monetize your training records through alumni verification.',
  },
  {
    id: 'charter',
    icon: <Plane className="w-8 h-8" />,
    title: 'Charter / Private Aviation',
    subtitle: 'On-Demand Flight Services',
    description: 'Private jet charters, fractional ownership, and on-demand aviation services.',
  },
  {
    id: 'airline',
    icon: <Building2 className="w-8 h-8" />,
    title: 'Commercial Airline',
    subtitle: 'Scheduled Passenger Operations',
    description: 'Major carriers, regional airlines, and low-cost operators with scheduled routes.',
  },
  {
    id: 'leasing',
    icon: <Briefcase className="w-8 h-8" />,
    title: 'Aircraft Leasing / Asset Management',
    subtitle: 'Fleet & Asset Operations',
    description: 'Lessors, banks, and asset managers operating aircraft portfolios.',
  },
  {
    id: 'cargo',
    icon: <Container className="w-8 h-8" />,
    title: 'Cargo / Specialized Operations',
    subtitle: 'Freight & Special Mission',
    description: 'Cargo carriers, firefighting, medical evacuation, and specialized aviation services.',
  },
];

export default function EnterpriseOnboardingPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAtoDetail, setShowAtoDetail] = useState(false);

  const handleSelect = (typeId: string) => {
    setSelectedType(typeId);
    if (typeId === 'flight-academy') {
      setShowAtoDetail(true);
    } else {
      // Navigate to standard enterprise signup for other types
      navigate(`/enterprise/signup?type=${typeId}`);
    }
  };

  const selectedOperation = OPERATION_TYPES.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar 
        onNavigate={(page) => console.log(page)} 
        onLogin={() => {}} 
        forceScrolled={true} 
        isLight={true} 
      />

      <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Enterprise Access
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join the neutral protocol where verified pilots and verified operators connect — 
            without anyone owning the data.
          </p>
        </div>

        {/* Swiss Badge */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-10 flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">+</span>
          </div>
          <p className="text-red-900 font-medium">
            Swiss-Inspired Neutrality • Zero Data Retention • Zero Industrial Bias
          </p>
        </div>

        {!showAtoDetail ? (
          <>
            {/* Step 1: Select Operation Type */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Step 1: What type of operation are you?
              </h2>
              <p className="text-slate-500">
                All operators pay the same $1,000/year Enterprise fee. Select your category to customize your dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {OPERATION_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelect(type.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                    selectedType === type.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className={`mb-4 ${
                    selectedType === type.id ? 'text-blue-600' : 'text-slate-600'
                  }`}>
                    {type.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{type.title}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-2">{type.subtitle}</p>
                  <p className="text-sm text-slate-500">{type.description}</p>
                  
                  {type.dualValue && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-700 font-medium">
                        ★ Dual Revenue: {type.dualValue}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* ATO-Specific Detail Screen */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-10 h-10" />
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    Flight Academy / ATO
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  The ATO Dual Flywheel
                </h2>
                <p className="text-blue-100 text-lg">
                  Your $1,000/year subscription pays for itself through two revenue streams.
                </p>
              </div>

              <div className="p-8">
                {/* Dual Value Proposition */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* Stream 1: As Operator */}
                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">As Operator</h3>
                        <p className="text-sm text-slate-500">Inbound Recruiting</p>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        Post Instructor Pathways
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        Pull 6,000-hr CFIs & Check Airmen
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        Manage fleet liability through verified crew
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        Full enterprise dashboard access
                      </li>
                    </ul>
                  </div>

                  {/* Stream 2: As Validator */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">As Validator</h3>
                        <p className="text-sm text-green-700">Outbound Revenue</p>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        Verify alumni logbooks automatically
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        Capture 5% on every verification check
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        Hundreds of checks/year = fully recouped fee
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <strong>Self-funding subscription</strong>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* The Math */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                  <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    The Break-Even Calculation
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-amber-700">200</p>
                      <p className="text-sm text-amber-800">Alumni verifications/year</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-amber-700">× $5</p>
                      <p className="text-sm text-amber-800">5% per verification</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-700">= $1,000</p>
                      <p className="text-sm text-green-800">Your subscription cost</p>
                    </div>
                  </div>
                  <p className="text-center text-amber-900 mt-4 font-medium">
                    A busy flight academy with 200+ alumni verifications fully recoups their Enterprise fee.
                  </p>
                </div>

                {/* Trust Elements */}
                <div className="flex items-center justify-center gap-6 mb-8 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Verification proceeds regardless of membership
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    5-day Activation Credit window
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-4">
                  <button 
                    onClick={() => navigate('/enterprise/signup?type=flight-academy')}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Activate Enterprise Access — $1,000/yr
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowAtoDetail(false)}
                    className="px-6 py-4 bg-white text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Trust Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 mb-2">
            All Enterprise operators receive the same platform access, security standards, and neutral data handling.
          </p>
          <p className="text-xs text-slate-400">
            No data stored on our servers. Cryptographic verification only. Swiss-inspired neutrality.
          </p>
        </div>
      </div>
    </div>
  );
}
