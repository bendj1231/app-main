import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Route, 
  Target, 
  Award, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Bell,
  Settings
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate?: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const stats = [
    { label: 'Pathways Saved', value: '4', icon: Route, color: 'text-indigo-400' },
    { label: 'Skills Tracked', value: '12', icon: Target, color: 'text-emerald-400' },
    { label: 'Certificates', value: '3', icon: Award, color: 'text-violet-400' },
    { label: 'Hours Logged', value: '1,247', icon: Clock, color: 'text-amber-400' },
  ];

  const recommendedPathways = [
    { title: 'Regional Airline First Officer', match: '94%', hours: '1500 required', type: 'Regional' },
    { title: 'Corporate Aviation Pilot', match: '87%', hours: '2000 preferred', type: 'Corporate' },
    { title: 'Flight Instructor → Charter', match: '82%', hours: 'Build to 1500', type: 'Pathway' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
            <p className="text-slate-400">Track your career progression</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-slate-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recommended Pathways */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recommended Pathways</h2>
                <button 
                  onClick={() => handleNavigate('/pathways')}
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {recommendedPathways.map((pathway, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white mb-1">{pathway.title}</h3>
                        <p className="text-sm text-slate-500">{pathway.hours}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-semibold">{pathway.match}</span>
                        <p className="text-xs text-slate-500">match</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => handleNavigate('/discover')}
                  className="w-full p-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <span className="text-white text-sm">Update Career Goals</span>
                  </div>
                </button>
                <button 
                  onClick={() => handleNavigate('/programs')}
                  className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-violet-400" />
                    <span className="text-white text-sm">Browse Programs</span>
                  </div>
                </button>
                <button className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-colors">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-white text-sm">Log Flight Hours</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
