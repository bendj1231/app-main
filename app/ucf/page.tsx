'use client';

import React from 'react';
import { Link } from 'react-router-dom';

export default function UCFPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">Pilot</span>
            <span className="text-xl font-bold text-red-600">Recognition</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/framework" className="text-sm text-slate-600 hover:text-slate-900">Framework</Link>
            <Link to="/framework/full" className="text-sm text-slate-600 hover:text-slate-900">Full Version</Link>
          </nav>
        </div>
      </header>

      <section className="bg-slate-50 py-20 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full mb-4">
            Version 10.0-Expanded
          </span>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">Universal Commercial Framework</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The Master Blueprint for the Aviation Industry Operating System
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mt-8">
            <span>7 Stakeholder Hubs</span>
            <span>25 Strategic Pillars</span>
            <span>90+ Pages</span>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">7 Stakeholder Hubs</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '✈️', name: 'Hub A', desc: 'Operations & Recruitment', count: '5 Pillars' },
            { icon: '🎓', name: 'Hub B', desc: 'Training & Transition', count: '4 Pillars' },
            { icon: '🏦', name: 'Hub C', desc: 'Capital, Risk & Compliance', count: '4 Pillars' },
            { icon: '📡', name: 'Hub D', desc: 'Connection & Media', count: '4 Pillars' },
            { icon: '📋', name: 'Hub E', desc: 'Governance & Policy', count: '4 Pillars' },
            { icon: '🌐', name: 'Hub E-A', desc: 'Humanitarian & Mission Aviation', count: '1 Pillar' },
            { icon: '🔍', name: 'Hub G', desc: 'Digital Discovery', count: '3 Pillars' },
          ].map((hub) => (
            <div key={hub.name} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">{hub.icon}</div>
              <h3 className="font-bold text-slate-900 mb-1">{hub.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{hub.desc}</p>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">{hub.count}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>Universal Commercial Framework • PilotRecognition.com</p>
      </footer>
    </div>
  );
}
