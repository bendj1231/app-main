import React, { useState } from 'react';
import { IMAGES } from '@/src/lib/website-constants';
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Award,
  Users,
  Newspaper,
  LogOut,
  ChevronRight,
  Moon,
  Grid3X3,
  UserCircle,
  Settings,
  Globe
} from 'lucide-react';

interface DashboardLayoutProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', desc: 'Flight logs, training records, and documents', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400&auto=format&fit=crop' },
  { id: 'programs', label: 'Programs', desc: 'Foundational and Transition mentorship programs', image: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=400&auto=format&fit=crop' },
  { id: 'pathways', label: 'Pathways', desc: 'Structured career roadmaps and training tracks', image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=400&auto=format&fit=crop' },
  { id: 'recognition', label: 'Pilot Recognition', desc: 'Awards, flight hours, and certifications', image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=400&auto=format&fit=crop' },
  { id: 'network', label: 'WingMentor Network', desc: 'Recognition hub, knowledge bank, and aviation community', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop' },
  { id: 'news', label: 'News & Updates', desc: 'Latest announcements and industry insights', image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=400&auto=format&fit=crop' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onNavigate, onLogout }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex">
      {/* Left Sidebar */}
      <aside className="w-56 md:w-60 bg-white border-r border-slate-200 flex flex-col fixed h-full overflow-y-auto">
        {/* Logo Section */}
        <div className="p-4 md:p-6 border-b border-slate-100">
          <img src={IMAGES.LOGO} alt="WingMentor" className="w-12 md:w-16 h-auto mb-2" />
          <p className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600">
            Connecting pilots to the industry
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 md:p-4 space-y-1.5 md:space-y-2">
          {sidebarItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  onNavigate(item.id);
                }}
                className={`w-full text-left p-2 md:p-3 rounded-xl transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between gap-2 md:gap-3 relative z-10">
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wide mb-0.5 ${
                      isActive ? 'text-blue-900' : 'text-slate-700'
                    }`}>
                      {item.label}
                    </p>
                    <p className="text-[8px] md:text-[10px] text-slate-500 leading-tight line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent rounded-lg" />
                    <div className={`absolute inset-0 flex items-center justify-center ${
                      isActive ? 'bg-blue-600/20' : 'bg-slate-900/10'
                    } rounded-lg`}>
                      <ChevronRight size={16} className={`md:size-[20px] ${isActive ? 'text-blue-600' : 'text-slate-600'}`} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 md:p-4 border-t border-slate-100 space-y-1.5 md:space-y-2">
          <button className="w-full flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-slate-300 flex items-center justify-center text-[6px] md:text-[8px]">?</div>
            Contact Support
          </button>
          <button className="w-full flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-slate-300 flex items-center justify-center text-[6px] md:text-[8px]">!</div>
            Guidance
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={12} className="md:size-[14px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-56 md:ml-60">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-[clamp(1rem,1.5vw,1.5rem)] py-[clamp(0.5rem,0.75vw,0.75rem)] flex items-center justify-between">
          <div className="text-[clamp(0.65rem,0.75vw,0.75rem)] text-slate-500">
            <span className="text-slate-400">Welcome back</span>
            <br />
            <span className="font-semibold text-slate-700">benjamintigerbowler</span>
          </div>
          <div className="flex items-center gap-[clamp(0.5rem,0.75vw,0.75rem)]">
            <button className="flex items-center gap-[clamp(0.4rem,0.5vw,0.5rem)] px-[clamp(0.5rem,0.75vw,0.75rem)] py-[clamp(0.35rem,0.4vw,0.4rem)] bg-slate-100 rounded-full text-[clamp(0.65rem,0.75vw,0.75rem)] text-slate-600 hover:bg-slate-200 transition-colors">
              <Moon size={14} />
              <span>Dark Mode</span>
            </button>
            <button className="flex items-center gap-[clamp(0.4rem,0.5vw,0.5rem)] px-[clamp(0.5rem,0.75vw,0.75rem)] py-[clamp(0.35rem,0.4vw,0.4rem)] bg-slate-100 rounded-full text-[clamp(0.65rem,0.75vw,0.75rem)] text-slate-600 hover:bg-slate-200 transition-colors">
              <Grid3X3 size={14} />
              <span>Pilot Modules</span>
            </button>
            <button className="flex items-center gap-[clamp(0.4rem,0.5vw,0.5rem)] px-[clamp(0.5rem,0.75vw,0.75rem)] py-[clamp(0.35rem,0.4vw,0.4rem)] bg-slate-100 rounded-full text-[clamp(0.65rem,0.75vw,0.75rem)] text-slate-600 hover:bg-slate-200 transition-colors">
              <UserCircle size={14} />
              <span>Profile</span>
            </button>
            <button className="p-[clamp(0.35rem,0.4vw,0.4rem)] text-slate-400 hover:text-slate-600">
              <Settings size={16} />
            </button>
            <button className="px-[clamp(0.75rem,1vw,1rem)] py-[clamp(0.35rem,0.4vw,0.4rem)] bg-blue-600 text-white text-[clamp(0.65rem,0.75vw,0.75rem)] font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-[clamp(0.25rem,0.35vw,0.35rem)]">
              <Globe size={14} />
              Access Website
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <DashboardContent onNavigate={onNavigate} />
        </div>
      </main>
    </div>
  );
};

const DashboardContent: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Back to Hub Link */}
      <button 
        onClick={() => onNavigate('home')}
        className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-6"
      >
        <ChevronRight size={14} className="rotate-180" />
        Back to Hub
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <img src={IMAGES.LOGO} alt="WingMentor" className="w-20 h-auto mx-auto mb-4" />
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-600 mb-2">
          Connecting pilots to the industry
        </p>
        <h1 className="text-3xl font-serif text-slate-900 mb-2">Dashboard</h1>
        <p className="text-xs text-slate-500">
          Your central hub for flight logs, training records, program progress,<br />
          and career development resources.
        </p>
      </div>

      {/* Programs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-serif text-slate-900 mb-1">Programs</h2>
        <p className="text-xs text-slate-500 mb-6">
          Track your training progress and program enrollment<br />
          across all WingMentor programs
        </p>

        <div className="grid grid-cols-3 gap-4">
          {/* Core Training Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-shadow">
            <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase mb-3">Core Training</p>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Foundational Program</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Master core aviation fundamentals, instrument procedures, and CRM techniques through structured simulator training.
            </p>
            <button className="w-full py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1">
              Access Platform <ChevronRight size={14} />
            </button>
          </div>

          {/* Airbus Aligned Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-shadow">
            <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase mb-3">Airbus Aligned</p>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">EBT CBTA Initial Pilot Recognition Interview</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              AIRBUS-aligned Evidence-Based Training and Competency-Based Training & Assessment interview for initial pilot recognition and industry placement readiness.
            </p>
            <button className="w-full py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1">
              Access Interview <ChevronRight size={14} />
            </button>
          </div>

          {/* Assessments Card */}
          <div className="bg-slate-900 rounded-xl p-5 text-white">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">Assessments</p>
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Award size={16} className="text-slate-900" />
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-2">Examination Portal</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Access your examination portal, view results, and track your assessment progress across all modules.
            </p>
            <button className="w-full py-2 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-1 border border-slate-700">
              Access Portal <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Program Overview */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Program Overview</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">0</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Active Programs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">92%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Completion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">73%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Assessment Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">50 hrs</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Training Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};
