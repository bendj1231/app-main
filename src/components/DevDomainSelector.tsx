import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DevDomainSelector: React.FC = () => {
  const navigate = useNavigate();

  const selectDomain = (domain: 'main' | 'careerpathways' | 'shortage' | 'pilotterminal') => {
    // Clear any stored mode
    localStorage.removeItem('careerpathways_mode');
    
    if (domain === 'main') {
      navigate('/?domain=main');
    } else if (domain === 'careerpathways') {
      navigate('/?product=careerpathways');
    } else if (domain === 'shortage') {
      navigate('/?shortage=1');
    } else if (domain === 'pilotterminal') {
      navigate('/?product=pilotterminal');
    }
    window.location.reload();
  };

  const domains = [
    {
      id: 'main' as const,
      name: 'pilotrecognition.com',
      subtitle: 'Main Platform',
      description: 'Recognition profiles, programs, pathways, and enterprise access',
      color: 'from-indigo-500 to-purple-600',
      icon: '✈️',
    },
    {
      id: 'careerpathways' as const,
      name: 'pilotcareerpathways.com',
      subtitle: 'Career Pathways',
      description: 'Pathway search, airline matching, and career navigation',
      color: 'from-red-500 to-rose-600',
      icon: '🛫',
    },
    {
      id: 'shortage' as const,
      name: 'pilotshortage.org',
      subtitle: 'Pilot Shortage Association',
      description: 'Advocacy, PSA landing, and the four-floor tower narrative',
      color: 'from-blue-500 to-cyan-600',
      icon: '🏛️',
    },
    {
      id: 'pilotterminal' as const,
      name: 'pilotterminal.com',
      subtitle: 'Community Forum',
      description: 'Pilot-to-pilot chat, forums, and community discussions',
      color: 'from-yellow-500 to-amber-500',
      icon: '💬',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-slate-400 text-sm font-mono">localhost:3000</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Select Domain View
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Choose which landing page to preview. This selector only appears in development.
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => selectDomain(domain.id)}
              className="group relative bg-slate-800 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-slate-700 hover:border-slate-600"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${domain.color} rounded-t-2xl`} />
              
              {/* Icon */}
              <div className="text-4xl mb-4">{domain.icon}</div>
              
              {/* Content */}
              <h2 className="text-xl font-bold text-white mb-1 group-hover:text-slate-200">
                {domain.name}
              </h2>
              <p className={`text-sm font-medium bg-gradient-to-r ${domain.color} bg-clip-text text-transparent mb-3`}>
                {domain.subtitle}
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {domain.description}
              </p>

              {/* Arrow indicator */}
              <div className="mt-6 flex items-center text-slate-500 group-hover:text-white transition-colors">
                <span className="text-sm font-medium">Launch Preview</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">Or use direct URLs:</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-mono">
            <code className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300">
              ?product=careerpathways
            </code>
            <code className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300">
              ?shortage=1
            </code>
            <code className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300">
              ?product=pilotterminal
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-600 text-xs">
          <p>Development Environment • WM Pilot Group</p>
        </div>
      </div>
    </div>
  );
};
