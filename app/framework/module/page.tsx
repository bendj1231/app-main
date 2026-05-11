'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Section {
  id: string;
  title: string;
  level: number;
  pillar?: number;
}

const PILLARS = [
  { num: 1, name: 'Commercial Airlines', hub: 'Operations' },
  { num: 2, name: 'Cargo & Freight', hub: 'Operations' },
  { num: 3, name: 'Charter & BizAv', hub: 'Operations' },
  { num: 4, name: 'Emerging Sectors', hub: 'Operations' },
  { num: 5, name: 'Flight Schools (ATOs)', hub: 'Training' },
  { num: 6, name: 'Type Rating Centers', hub: 'Training' },
  { num: 7, name: 'Military Commands', hub: 'Training' },
  { num: 8, name: 'Aviation Universities', hub: 'Training' },
  { num: 9, name: 'Banking', hub: 'Capital' },
  { num: 10, name: 'Insurance', hub: 'Capital' },
  { num: 11, name: 'Regulators', hub: 'Capital' },
  { num: 12, name: 'VEREMARK', hub: 'Infrastructure' },
  { num: 13, name: 'Flight Data Apps', hub: 'Infrastructure' },
  { num: 14, name: 'AMEs Medical', hub: 'Infrastructure' },
  { num: 15, name: 'Mentors & Unions', hub: 'Community' },
  { num: 16, name: 'Manufacturers', hub: 'Community' },
  { num: 17, name: 'Recruitment', hub: 'Growth' },
  { num: 18, name: 'Media', hub: 'Growth' },
  { num: 19, name: 'Events', hub: 'Growth' },
  { num: 20, name: 'Government', hub: 'Growth' },
];

const HUB_COLORS: Record<string, string> = {
  Operations: 'bg-red-600',
  Training: 'bg-blue-600',
  Capital: 'bg-amber-600',
  Infrastructure: 'bg-slate-700',
  Community: 'bg-green-600',
  Growth: 'bg-purple-600',
};

export default function ModuleFrameworkPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch('/docs/universal-commercial-framework-expanded.md')
      .then(res => res.text())
      .then(text => {
        setContent(text);
        // Parse sections from markdown
        const parsedSections: Section[] = [];
        const lines = text.split('\n');
        lines.forEach((line, idx) => {
          if (line.startsWith('# ')) {
            parsedSections.push({ id: `section-${idx}`, title: line.replace('# ', ''), level: 1 });
          } else if (line.startsWith('## ')) {
            const title = line.replace('## ', '');
            // Check if it's a pillar
            const pillarMatch = title.match(/^(\d+)[:\.\s]/);
            if (pillarMatch) {
              parsedSections.push({ 
                id: `section-${idx}`, 
                title: title.replace(/^\d+[:\.\s]/, '').trim(), 
                level: 2,
                pillar: parseInt(pillarMatch[1])
              });
            } else {
              parsedSections.push({ id: `section-${idx}`, title, level: 2 });
            }
          } else if (line.startsWith('### ')) {
            parsedSections.push({ id: `section-${idx}`, title: line.replace('### ', ''), level: 3 });
          }
        });
        setSections(parsedSections);
        if (parsedSections.length > 0) {
          setActiveSection(parsedSections[0].id);
        }
        setLoading(false);
      })
      .catch(() => {
        setContent('# Error loading document');
        setLoading(false);
      });
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        const id = `section-${i}`;
        
        if (line.startsWith('# ')) {
          return <h1 key={i} id={id} className="text-4xl font-bold text-slate-900 mt-8 mb-6 pb-4 border-b-2 border-slate-900">{line.replace('# ', '')}</h1>;
        }
        if (line.startsWith('## ')) {
          const title = line.replace('## ', '');
          const pillarMatch = title.match(/^(\d+)[:\.\s]/);
          if (pillarMatch) {
            const pillarNum = parseInt(pillarMatch[1]);
            const pillar = PILLARS.find(p => p.num === pillarNum);
            return (
              <h2 key={i} id={id} className="text-2xl font-bold text-slate-800 mt-10 mb-4 pb-2 border-b border-slate-300 flex items-center gap-3">
                {pillar && (
                  <span className={`w-10 h-10 ${HUB_COLORS[pillar.hub]} text-white rounded-lg flex items-center justify-center text-sm font-bold`}>
                    {pillarNum}
                  </span>
                )}
                <span>{title.replace(/^\d+[:\.\s]/, '').trim()}</span>
                {pillar && (
                  <span className="text-sm font-normal text-slate-500 ml-auto">{pillar.hub}</span>
                )}
              </h2>
            );
          }
          return <h2 key={i} id={id} className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b border-slate-300">{title}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} id={id} className="text-xl font-bold text-slate-700 mt-6 mb-3">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={i} id={id} className="text-lg font-bold text-slate-700 mt-4 mb-2">{line.replace('#### ', '')}</h4>;
        }
        
        if (line.trim() === '') {
          return <div key={i} className="h-4" />;
        }
        
        if (line.startsWith('---')) {
          return <hr key={i} className="my-8 border-slate-300" />;
        }
        
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <li key={i} className="ml-6 text-slate-700 leading-relaxed">{line.replace(/^- /, '').replace(/^• /, '')}</li>;
        }
        
        if (/^\d+\.\s/.test(line)) {
          return <li key={i} className="ml-6 text-slate-700 leading-relaxed">{line.replace(/^\d+\.\s/, '')}</li>;
        }
        
        let processedLine = line;
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedLine = processedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        if (line.startsWith('|')) {
          const cells = line.split('|').filter(c => c.trim());
          if (cells.length > 0 && !line.includes('---')) {
            return (
              <div key={i} className="grid grid-cols-2 gap-4 py-2 border-b border-slate-100">
                {cells.map((cell, j) => (
                  <span key={j} className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: cell.trim() }} />
                ))}
              </div>
            );
          }
          return null;
        }
        
        return <p key={i} id={id} className="text-slate-700 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: processedLine }} />;
      })
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading framework...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-40 overflow-y-auto ${
          sidebarOpen ? 'w-80 translate-x-0' : 'w-80 -translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-slate-700">
            <Link to="/framework" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mb-2">
              ← Back to Summary
            </Link>
            <h1 className="text-lg font-bold">Universal Framework</h1>
            <p className="text-xs text-slate-400">Module Viewer</p>
          </div>

          {/* Quick Nav - Pillar Grid */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">20 Pillars</p>
            <div className="grid grid-cols-4 gap-2">
              {PILLARS.map((pillar) => (
                <button
                  key={pillar.num}
                  onClick={() => {
                    const section = sections.find(s => s.pillar === pillar.num);
                    if (section) scrollToSection(section.id);
                  }}
                  className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all hover:scale-105 ${
                    HUB_COLORS[pillar.hub]
                  }`}
                  title={pillar.name}
                >
                  <span className="text-lg">{pillar.num}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hub Legend */}
          <div className="mb-6 pb-4 border-b border-slate-700">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Hubs</p>
            <div className="space-y-2">
              {Object.entries(HUB_COLORS).map(([hub, color]) => (
                <div key={hub} className="flex items-center gap-2 text-sm">
                  <span className={`w-3 h-3 rounded ${color}`} />
                  <span className="text-slate-300">{hub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections List */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Sections</p>
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section.id 
                      ? 'bg-red-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {section.pillar && (
                      <span className={`w-5 h-5 rounded text-xs flex items-center justify-center ${
                        activeSection === section.id ? 'bg-white/20' : HUB_COLORS[PILLARS.find(p => p.num === section.pillar)?.hub || 'Operations']
                      }`}>
                        {section.pillar}
                      </span>
                    )}
                    <span className={section.level === 1 ? 'font-bold' : section.level === 2 ? 'font-medium' : 'text-slate-400'}>
                      {section.title.length > 30 ? section.title.slice(0, 30) + '...' : section.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed z-50 top-4 bg-slate-900 text-white p-2 rounded-lg shadow-lg transition-all duration-300 ${
          sidebarOpen ? 'left-72' : 'left-4'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {/* Top Navigation */}
        <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-slate-900 font-semibold">Universal Commercial Framework</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600 text-sm">90+ Pages</span>
            </div>
            <div className="flex gap-3">
              <a 
                href="/docs/universal-commercial-framework-expanded.md"
                download
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Download .md
              </a>
              <a 
                href="/docs/universal-commercial-framework.tex"
                download
                className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
              >
                Download .tex
              </a>
            </div>
          </div>
        </nav>

        {/* Document */}
        <article className="max-w-4xl mx-auto px-6 py-12">
          <header className="text-center mb-12 pb-8 border-b-2 border-slate-900">
            <p className="text-sm text-slate-500 font-mono mb-2">Aviation Industry Operating System</p>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Universal Commercial Framework</h1>
            <p className="text-xl text-slate-600 italic mb-4">The Master Blueprint for the Aviation Industry</p>
            <p className="text-sm text-slate-500">Document Revision: 10.0 | 90+ Pages | May 2026</p>
          </header>

          <div className="prose prose-slate max-w-none">
            {renderMarkdown(content)}
          </div>

          <footer className="mt-20 pt-8 border-t-2 border-slate-900 text-center">
            <p className="text-slate-600 mb-4">End of Universal Commercial Framework</p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/framework"
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                ← Back to Summary
              </Link>
              <Link 
                to="/framework/full"
                className="text-slate-600 hover:text-slate-900 font-semibold"
              >
                Classic View →
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
