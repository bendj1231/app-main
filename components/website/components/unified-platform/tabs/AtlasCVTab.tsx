import React from 'react';
import { FileText, Download, Edit3, CheckCircle } from 'lucide-react';
import { SectionCard } from '../shared';

export const AtlasCVTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile, onNavigate }) => (
  <div className="space-y-6">
    <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <FileText size={40} className="text-white mx-auto mb-3" />
      <p className="text-white font-bold text-lg mb-1">ATLAS Aviation CV</p>
      <p className="text-white/50 text-sm mb-4">Industry-standard formatted CV. Auto-populated from your Recognition Profile. Accepted by airlines using the ATLAS format.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => onNavigate('atlas-cv-generator')} className="text-sm font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 tracking-wider" style={{ background: 'rgba(249,115,22,0.8)', color: 'white', border: '1px solid rgba(249,115,22,0.5)' }}>
          <Download size={15} /> Generate & Download
        </button>
        <button onClick={() => onNavigate('atlas-resume')} className="text-sm font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 tracking-wider" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Edit3 size={15} /> Edit CV
        </button>
      </div>
    </div>
    <SectionCard title="What Your Atlas CV Includes">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {['Flight Hours Summary', 'License & Ratings', 'Type Ratings Held', 'Medical Certificate Status', 'Recognition Score', 'EBT Assessment Result', 'Program Completions', 'Employment History', 'Language Proficiency'].map(item => (
          <div key={item} className="flex items-center gap-2 text-xs text-white/65">
            <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" /> {item}
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);
