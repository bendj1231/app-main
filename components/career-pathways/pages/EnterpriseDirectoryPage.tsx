import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Plane,
  GraduationCap,
  Wrench,
  Users,
  CheckCircle2,
  ArrowRight,
  Globe,
  MapPin,
  Star,
  ExternalLink
} from 'lucide-react';

interface EnterpriseDirectoryPageProps {
  onNavigate?: (path: string) => void;
}

export const EnterpriseDirectoryPage: React.FC<EnterpriseDirectoryPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const enterpriseCategories = [
    {
      icon: Plane,
      title: 'Commercial Airlines',
      count: '12',
      description: 'Major international and regional carriers actively recruiting',
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      icon: GraduationCap,
      title: 'Flight Schools & ATOs',
      count: '8',
      description: 'Approved training organizations with verified instructor pathways',
      color: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      icon: Building2,
      title: 'Charter & Private Aviation',
      count: '6',
      description: 'Business aviation and private charter operators',
      color: 'bg-purple-500/10 text-purple-400',
    },
    {
      icon: Wrench,
      title: 'MRO & Technical Services',
      count: '4',
      description: 'Maintenance, repair and overhaul facilities',
      color: 'bg-amber-500/10 text-amber-400',
    },
  ];

  const featuredOperators = [
    {
      name: 'Emirates',
      type: 'Major International Airline',
      location: 'Dubai, UAE',
      status: 'Active Hiring',
      positions: 'First Officer, Captain',
      verified: true,
      category: 'Commercial Airline',
    },
    {
      name: 'Etihad Airways',
      type: 'Major International Airline',
      location: 'Abu Dhabi, UAE',
      status: 'Active Hiring',
      positions: 'Cadet Pilot, First Officer',
      verified: true,
      category: 'Commercial Airline',
    },
    {
      name: 'Qatar Airways',
      type: 'Major International Airline',
      location: 'Doha, Qatar',
      status: 'Active Hiring',
      positions: 'Direct Entry Captain',
      verified: true,
      category: 'Commercial Airline',
    },
    {
      name: 'Singapore Airlines',
      type: 'Major International Airline',
      location: 'Singapore',
      status: 'Cadet Program',
      positions: 'Ab-initio Cadet',
      verified: true,
      category: 'Commercial Airline',
    },
    {
      name: 'CAE Oxford Aviation Academy',
      type: 'Flight Training Organization',
      location: 'Multiple Global Locations',
      status: 'Open Enrollment',
      positions: 'Student Pilot',
      verified: true,
      category: 'ATO',
    },
    {
      name: 'L3Harris Flight Academy',
      type: 'Flight Training Organization',
      location: 'UK, Portugal, USA',
      status: 'Open Enrollment',
      positions: 'Integrated ATPL',
      verified: true,
      category: 'ATO',
    },
    {
      name: 'VistaJet',
      type: 'Private Charter Operator',
      location: 'Malta / Global',
      status: 'Active Hiring',
      positions: 'Challenger, Global Express',
      verified: true,
      category: 'Charter',
    },
    {
      name: 'NetJets',
      type: 'Fractional Ownership',
      location: 'USA, Europe',
      status: 'Active Hiring',
      positions: 'Citation, Phenom',
      verified: true,
      category: 'Charter',
    },
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
            <h1 className="text-3xl font-bold text-white">Enterprise Directory</h1>
            <p className="text-slate-400">
              Verified airlines, operators, and training organizations on pilotrecognition.com
            </p>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {enterpriseCategories.map((cat) => (
            <div
              key={cat.title}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${cat.color}`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-white">{cat.count}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">{cat.title}</h3>
              <p className="text-xs text-slate-500">{cat.description}</p>
            </div>
          ))}
        </div>

        {/* For Operators CTA */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 rounded-xl p-6 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                Are you an airline, ATO, or operator?
              </h2>
              <p className="text-sm text-slate-400">
                Get listed in the Enterprise Directory and access verified pilot profiles.
              </p>
            </div>
            <button
              onClick={() => handleNavigate('/get-started')}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm font-medium transition-all shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              Get Enterprise Access
            </button>
          </div>
        </div>

        {/* Operator List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white mb-4">Verified Operators</h2>
          {featuredOperators.map((op) => (
            <div
              key={op.name}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {op.name}
                    </h3>
                    {op.verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {op.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {op.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-indigo-400">
                      <Users className="w-3.5 h-3.5" />
                      {op.positions}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1.5 rounded-full">
                    {op.status}
                  </span>
                  <button
                    onClick={() => handleNavigate('/get-started')}
                    className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            All operators listed are verified through pilotrecognition.com's verification network.
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Want to join the directory?{' '}
            <button
              onClick={() => handleNavigate('/get-started')}
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Apply for Enterprise Access
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDirectoryPage;
