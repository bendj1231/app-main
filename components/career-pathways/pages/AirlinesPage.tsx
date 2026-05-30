import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowLeft, Building2, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface AirlinesPageProps {
  onNavigate?: (path: string) => void;
}

export const AirlinesPage: React.FC<AirlinesPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const benefits = [
    { icon: Users, title: 'Verified Pilot Pool', desc: 'Access pre-verified pilots with validated credentials' },
    { icon: CheckCircle2, title: 'Reduced Hiring Time', desc: 'Cut recruitment time by up to 70%' },
    { icon: Building2, title: 'Enterprise Integration', desc: 'Direct API access to your ATS/HR systems' },
  ];

  const airlines = [
    { name: 'Emirates', type: 'Major International', location: 'Dubai, UAE' },
    { name: 'Etihad Airways', type: 'Major International', location: 'Abu Dhabi, UAE' },
    { name: 'Qatar Airways', type: 'Major International', location: 'Doha, Qatar' },
    { name: 'Singapore Airlines', type: 'Major International', location: 'Singapore' },
    { name: 'Cathay Pacific', type: 'Major International', location: 'Hong Kong' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => handleNavigate('/')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">For Airlines & Operators</h1>
            <p className="text-slate-400">Streamlined access to verified pilot talent</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Enterprise Pilot Solutions</h2>
              <p className="text-slate-400 max-w-xl">
                Connect directly with our verified pilot database. Filter by hours, ratings, 
                medical status, and more. Integrate with your existing ATS via our API.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 rounded-xl">
                <benefit.icon className="w-6 h-6 text-indigo-400 mb-2" />
                <h3 className="font-medium text-white mb-1">{benefit.title}</h3>
                <p className="text-sm text-slate-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Airlines */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Partner Airlines</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {airlines.map((airline, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{airline.name}</h3>
                  <Building2 className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-sm text-slate-500">{airline.type}</p>
                <p className="text-sm text-slate-600">{airline.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-white font-semibold transition-all">
            Request Enterprise Access
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-sm text-slate-500">
            Custom pricing based on fleet size and hiring volume
          </p>
        </div>
      </div>
    </div>
  );
};

export default AirlinesPage;
