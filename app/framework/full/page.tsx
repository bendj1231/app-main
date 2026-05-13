'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCompleteFrameworkData, getPillarDetail } from '@/lib/framework-api';
import type { FrameworkPillar, FrameworkContentSection, FrameworkTable, FrameworkTableRow } from '@/types/framework-db';

// Pillar Accordion Table Component
function PillarTabTable({ headerLine, groups, colCount, scrollToSection }: {
  headerLine: string | null;
  groups: Array<{ label: string; rows: string[] }>;
  colCount: number;
  scrollToSection: (id: string) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridClass = colCount === 4 ? 'grid-cols-4' : colCount === 3 ? 'grid-cols-3' : 'grid-cols-2';

  const processCellText = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  const cleanLabel = (label: string) => {
    // Shorten: "PILLAR 1 — COMMERCIAL AIRLINES — Two Separate..." → "PILLAR 1 — COMMERCIAL AIRLINES"
    const stripped = label.replace(/\*\*(.*?)\*\*/g, '$1');
    const parts = stripped.split('—');
    if (parts.length >= 2) return `${parts[0].trim()} — ${parts[1].trim()}`;
    return stripped;
  };

  const renderDataRow = (tLine: string, idx: number) => {
    const cells = tLine.split('|').filter(c => c.trim());
    return (
      <div key={idx} className={`grid py-2 border-b border-slate-200 ${gridClass}`}>
        {cells.map((cell, j) => {
          const cellText = processCellText(cell.trim());
          const isCurrentState = j === 1;
          const isDiscoverCol = j === 3;
          if (isDiscoverCol && cellText) {
            const linkMatch = cell.trim().match(/\[(.+?)\]\(#(.+?)\)/);
            if (linkMatch) {
              return (
                <div key={j} className="px-3 py-1">
                  <button
                    onClick={() => scrollToSection(linkMatch[2])}
                    className="text-xs text-blue-600 hover:text-red-600 hover:underline font-medium transition-colors text-left"
                  >
                    {linkMatch[1]}
                  </button>
                </div>
              );
            }
          }
          return (
            <span
              key={j}
              className={`text-sm px-3 py-1 ${isCurrentState ? 'text-red-600 font-medium' : 'text-slate-700'}`}
              dangerouslySetInnerHTML={{ __html: cellText }}
            />
          );
        })}
      </div>
    );
  };

  const renderSubRow = (tLine: string, idx: number) => {
    const rc = tLine.split('|').slice(1, -1);
    const rawLabel = rc[0]?.trim() || '';
    const isKeynote = rawLabel.includes('KEYNOTE');
    const isSubSection = rawLabel.startsWith('—') || rawLabel.startsWith('**—') || rawLabel.startsWith('* ');
    if (isKeynote) {
      const keynoteText = processCellText(rawLabel.replace(/\*\*KEYNOTE[^*]*\*\*\s*—?\s*/i, ''));
      return (
        <div key={idx} className="my-3 mx-2 px-5 py-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Keynote</p>
          <p className="text-sm text-slate-700 leading-relaxed italic" dangerouslySetInnerHTML={{ __html: keynoteText }} />
        </div>
      );
    }
    if (isSubSection) {
      return (
        <div key={idx} className={`grid ${gridClass} py-2 border-y border-slate-400 bg-slate-600`}>
          <span className="col-span-full px-3 text-xs font-bold text-white tracking-wide" dangerouslySetInnerHTML={{ __html: processCellText(rawLabel) }} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="my-6 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {groups.map((group, gi) => {
        const label = cleanLabel(group.label);
        const pillarNum = label.match(/PILLAR\s+(\d+)/i)?.[1];
        const pillarName = label.split('—')[1]?.trim() || label;
        const isOpen = openIndex === gi;
        return (
          <div key={gi} className="border-b border-slate-200 last:border-b-0">
            {/* Accordion trigger */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : gi)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                isOpen ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {pillarNum && (
                  <span className={`text-xs font-black tracking-widest px-2 py-0.5 rounded ${isOpen ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    P{pillarNum}
                  </span>
                )}
                <span className="text-sm font-semibold">{pillarName}</span>
              </div>
              <span className={`text-lg transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {/* Expanded content */}
            {isOpen && (
              <div>
                {/* Column headers */}
                {headerLine && (
                  <div className={`grid ${gridClass} bg-slate-100 border-b-2 border-slate-300`}>
                    {headerLine.split('|').filter(c => c.trim()).map((cell, j) => (
                      <span key={j} className="text-sm px-3 py-2 font-semibold text-slate-800">{cell.trim()}</span>
                    ))}
                  </div>
                )}
                {group.rows.map((tl, ri) => {
                  const rc = tl.split('|').slice(1, -1);
                  const isSubOrKeynote = rc.length >= 2 && rc[0].trim() !== '' && rc.slice(1).every(c => c.trim() === '');
                  if (isSubOrKeynote) return renderSubRow(tl, ri);
                  return renderDataRow(tl, ri);
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Navigation Section Component (separate to avoid hooks in map)
interface NavChild {
  id: string;
  label: string;
  level: number;
  onClick?: () => void;
}

interface NavSectionProps {
  id: string;
  label: string;
  level: number;
  children?: NavChild[];
}

function NavSection({ section, scrollToSection }: { 
  section: NavSectionProps,
  scrollToSection: (id: string) => void 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  console.log('NavSection rendering:', section.label, 'has children:', !!section.children, 'id:', section.id);
  
  return (
    <div className="mb-1">
      <button
        onClick={() => {
          console.log('Sidebar CLICK:', section.label, 'id:', section.id, 'has children:', !!section.children);
          if (section.children) {
            console.log('→ Toggling expand');
            setIsExpanded(!isExpanded);
          } else {
            console.log('→ Scrolling to section');
            scrollToSection(section.id);
          }
        }}
        className={`w-full text-left px-2 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-200 flex items-center justify-between ${
          section.level === 1 ? 'text-slate-900 bg-slate-100' : 'text-slate-600 pl-4'
        }`}
      >
        <span className="flex items-center">
          {section.children && (
            <span className={`text-red-600 mr-1.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>▸</span>
          )}
          {!section.children && <span className="text-slate-400 mr-1.5">•</span>}
          <span className="text-xs leading-tight">{section.label}</span>
        </span>
      </button>
      {section.children && isExpanded && (
        <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-slate-200 pl-2 overflow-visible">
          {section.children.map((child) => (
            <button
              key={child.id}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Child CLICK:', child.label, 'id:', child.id, 'has onClick:', !!child.onClick);
                // Support both onClick handler and scrollToSection
                if (child.onClick) {
                  child.onClick();
                } else {
                  scrollToSection(child.id);
                }
              }}
              className={`w-full text-left px-2 py-1 rounded-md text-xs transition-colors flex items-start gap-1.5 ${
                child.onClick ? 'text-red-600 hover:text-red-700 hover:bg-red-50 font-medium cursor-pointer' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span className={`mt-0.5 flex-shrink-0 ${child.onClick ? 'text-red-500' : 'text-blue-500'}`}>→</span>
              <span className="leading-tight">{child.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Generate ID from text
const generateId = (text: string) => {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
};

export default function FullFrameworkPage() {
  const [pillars, setPillars] = useState<FrameworkPillar[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<FrameworkPillar | null>(null);
  const [pillarSections, setPillarSections] = useState<FrameworkContentSection[]>([]);
  const [pillarTables, setPillarTables] = useState<(FrameworkTable & { rows: FrameworkTableRow[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'pillars'>('overview');
  const contentRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load framework data from Supabase
  useEffect(() => {
    let isMounted = true;
    
    async function loadFrameworkData() {
      try {
        setLoading(true);
        const data = await getCompleteFrameworkData();
        
        if (!isMounted) return;
        
        setPillars(data.pillars);
        setError(null);
        
        // Load first pillar details by default
        if (data.pillars.length > 0) {
          const firstPillar = data.pillars[0];
          setSelectedPillar(firstPillar);
          
          const detail = await getPillarDetail(firstPillar.pillar_number);
          if (isMounted && detail) {
            setPillarSections(detail.content_sections);
            setPillarTables(detail.tables);
          }
        }
      } catch (err) {
        console.error('Error loading framework:', err);
        if (isMounted) {
          setError('Failed to load framework data from Supabase');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    loadFrameworkData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  async function loadPillarDetail(pillarNumber: number) {
    try {
      const pillar = pillars.find(p => p.pillar_number === pillarNumber);
      if (pillar) {
        setSelectedPillar(pillar);
      }
      
      const detail = await getPillarDetail(pillarNumber);
      if (detail) {
        setPillarSections(detail.content_sections);
        setPillarTables(detail.tables);
      }
    } catch (err) {
      console.error('Error loading pillar detail:', err);
    }
  }

  const scrollToSection = (id: string) => {
    console.log('scrollToSection called with id:', id);
    const element = document.getElementById(id);
    console.log('Found element:', element ? 'YES' : 'NO', 'for id:', id);
    if (element) {
      console.log('Scrolling to element:', element.tagName, element.textContent?.substring(0, 50));
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error('❌ Element not found for id:', id);
      // Try to find all IDs in the document for debugging
      const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      console.log('Available IDs in document:', allIds.slice(0, 20), '...');
    }
  };

  // Group pillars by hub for navigation
  const groupedPillars = pillars.reduce((acc, pillar) => {
    if (!acc[pillar.hub_name]) {
      acc[pillar.hub_name] = [];
    }
    acc[pillar.hub_name].push(pillar);
    return acc;
  }, {} as Record<string, FrameworkPillar[]>);

  // Build navigation from database pillars
  const navSections = Object.entries(groupedPillars).map(([hubName, hubPillars]) => ({
    id: generateId(hubName),
    label: hubName,
    level: 1,
    children: hubPillars.map(p => ({
      id: `pillar-${p.pillar_number}`,
      label: `P${p.pillar_number}: ${p.name}`,
      level: 2,
      onClick: () => loadPillarDetail(p.pillar_number)
    }))
  }));

  // Render pillar overview - list all pillars grouped by hub
  const renderPillarOverview = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">25 Pillars • 7 Hubs</h2>
        <p className="text-lg text-slate-600">Click any pillar in the sidebar to view details</p>
      </div>
      
      {Object.entries(groupedPillars).map(([hubName, hubPillars]) => (
        <div key={hubName} className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            {hubName}
            <span className="text-sm font-normal text-slate-500">({hubPillars.length} pillars)</span>
          </h3>
          <div className="grid gap-3">
            {hubPillars.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => loadPillarDetail(pillar.pillar_number)}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-red-300 hover:shadow-sm transition-all text-left"
              >
                <span className="text-2xl">{pillar.icon || '🔷'}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">
                    Pillar {pillar.pillar_number}: {pillar.name}
                  </h4>
                  {pillar.description && (
                    <p className="text-sm text-slate-500 mt-1">{pillar.description}</p>
                  )}
                </div>
                <span className="text-slate-400">→</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Render content from database
  const renderPillarContent = () => {
    if (!selectedPillar) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading framework content...</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Pillar Header */}
        <div id={`pillar-${selectedPillar.pillar_number}`} className="border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{selectedPillar.icon || '🔷'}</span>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Pillar {selectedPillar.pillar_number}: {selectedPillar.name}
              </h2>
              <p className="text-slate-500 text-lg">{selectedPillar.hub_name}</p>
            </div>
          </div>
          {selectedPillar.description && (
            <p className="text-lg text-slate-600">{selectedPillar.description}</p>
          )}
        </div>

        {/* Content Sections */}
        {pillarSections.map((section) => (
          <div key={section.id} id={`section-${section.id}`} className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
              {section.title}
            </h3>
            {section.content && (
              <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                {section.content}
              </div>
            )}
          </div>
        ))}

        {/* Tables */}
        {pillarTables.map((table) => (
          <div key={table.id} className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{table.title}</h3>
            {table.description && (
              <p className="text-sm text-slate-500 mb-4">{table.description}</p>
            )}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100">
                    {Array.isArray(table.headers) && table.headers.map((header: string, idx: number) => (
                      <th 
                        key={idx} 
                        className="border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows?.map((row: FrameworkTableRow) => (
                    <tr 
                      key={row.id} 
                      className={`border-b border-slate-100 ${
                        row.row_type === 'keynote' ? 'bg-red-50' : ''
                      }`}
                    >
                      {Array.isArray(row.cells) && row.cells.map((cell: string, idx: number) => (
                        <td 
                          key={idx} 
                          className={`px-4 py-3 text-sm ${
                            row.row_type === 'keynote' ? 'text-red-800 italic' : 'text-slate-700'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-slate-900 mb-4">Error Loading Framework</h1>
          <p className="text-red-600 font-mono text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>
          <p className="text-slate-600 mb-6">Check browser console for details</p>
          <a 
            href="/framework" 
            className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to Framework Summary
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading from Supabase...</p>
          <p className="text-slate-400 text-sm mt-2">Universal Commercial Framework • 25 Pillars • 7 Hubs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
          .print\\:w-full {
            width: 100% !important;
          }
          nav.sticky {
            position: static !important;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link to="/framework" className="text-slate-900 font-semibold hover:text-red-600 transition-colors">
              ← Back to Summary
            </Link>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-600 text-sm">
              {pillars.length} Pillars • 7 Hubs
            </span>
            <span className="hidden md:inline text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-2">
              Live from Supabase
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden sm:inline">Print</span>
            </button>
            <a
              href="/Universal_Commercial_Framework_v11.pdf"
              download
              className="text-sm font-medium text-red-600 bg-white hover:bg-red-50 border border-red-600 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Layout with Left Sidebar */}
      <div className="w-full flex gap-6 pl-4 pr-6 py-8 relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Left Sidebar Navigation - Hidden on mobile, toggleable */}
        <aside className={`${sidebarOpen ? 'fixed left-0 top-0 z-50 h-full w-64 pt-20 px-4' : 'hidden'} md:block md:static md:w-64 md:flex-shrink-0 md:h-fit md:print:hidden`}>
          <div className="sticky top-24 bg-slate-50 rounded-xl border border-slate-200 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-lg md:shadow-none">
            <div className="p-3 border-b border-slate-200 bg-white rounded-t-xl">
              <h2 className="font-bold text-slate-900 text-sm">📑 25 Pillars</h2>
              <p className="text-xs text-slate-500 mt-1">Click to view pillar details</p>
              <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                Live from Supabase
              </span>
            </div>
            <nav className="p-2">
              {navSections.map((section) => (
                <NavSection key={section.id} section={section} scrollToSection={scrollToSection} />
              ))}
            </nav>
            <div className="p-3 border-t border-slate-200">
              <button
                onClick={() => {
                  setSelectedPillar(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full text-center py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors"
              >
                ← Back to Overview
              </button>
            </div>
          </div>
        </aside>

        {/* Document - Full width when printing */}
        <article className="max-w-4xl mx-auto print:max-w-none print:w-full">
        {/* Header */}
        <header className="text-center mb-12 pb-8 border-b-2 border-slate-900">
          <div className="mb-6">
            <span className="text-2xl font-bold text-slate-900">Pilot</span>
            <span className="text-2xl font-bold text-red-600">Recognition</span>
            <span className="text-lg text-slate-500">.com</span>
          </div>
          <p className="text-sm text-slate-500 font-mono mb-2">Aviation Industry Operating System</p>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Universal Commercial Framework</h1>
          <p className="text-xl text-slate-600 italic mb-4">The Master Blueprint for the Aviation Industry Operating System</p>
          <p className="text-sm text-slate-500">Document Revision: 10.0-Expanded | 90+ Pages | May 2026</p>
        </header>

        {/* TOC Instruction */}
        <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
          <p className="text-amber-800 text-sm">
            <strong>📖 Navigation Tip:</strong> Click any item in the Table of Contents below to jump directly to that section.
          </p>
        </div>

        {/* Content - Now from Supabase */}
        <div ref={contentRef} className="prose prose-slate max-w-none">
          {renderPillarContent()}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t-2 border-slate-900 text-center">
          <p className="text-slate-600 mb-4">End of Universal Commercial Framework</p>
          <Link 
            to="/framework"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
          >
            ← Back to Framework Summary
          </Link>
        </footer>
      </article>
    </div>
  </div>
  );
}
