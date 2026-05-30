import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, ArrowLeft, Filter, Search } from 'lucide-react';

interface PathwaysExplorerPageProps {
  onNavigate?: (path: string) => void;
}

export const PathwaysExplorerPage: React.FC<PathwaysExplorerPageProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const pathways = [
    { id: 'airline-cadet', title: 'Airline Cadet Program', hours: '0-200', type: 'Cadet' },
    { id: 'flight-instructor', title: 'Flight Instructor Pathway', hours: '200-1500', type: 'Training' },
    { id: 'regional-first-officer', title: 'Regional First Officer', hours: '1500-3000', type: 'Regional' },
    { id: 'major-airline', title: 'Major Airline Captain', hours: '3000+', type: 'Major' },
    { id: 'cargo-pilot', title: 'Cargo Transportation', hours: '1500+', type: 'Cargo' },
    { id: 'private-charter', title: 'Private Charter', hours: '2000+', type: 'Charter' },
    { id: 'corporate-aviation', title: 'Corporate Aviation', hours: '2500+', type: 'Corporate' },
    { id: 'air-taxi', title: 'Emerging Air Taxi', hours: '500+', type: 'Emerging' },
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
            <h1 className="text-3xl font-bold text-white">Career Pathways</h1>
            <p className="text-slate-400">Explore validated routes in aviation</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search pathways..."
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Pathways Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pathways.map((pathway) => (
            <div
              key={pathway.id}
              onClick={() => handleNavigate(`/pathways/${pathway.id}`)}
              className="group p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/30 hover:bg-slate-900 cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center mb-4">
                <Route className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                {pathway.title}
              </h3>
              <p className="text-sm text-slate-500">{pathway.hours} hours</p>
              <span className="inline-block mt-3 px-2 py-1 text-xs bg-slate-800 rounded text-slate-400">
                {pathway.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PathwaysExplorerPage;
